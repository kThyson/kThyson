// ==UserScript==
// @name         TypingMind Dev Suite
// @namespace    https://typingmind.com/
// @version      2.0
// @description  Syntax Error Highlight, Code Export (ZIP & Individual), Markdown Table Formatter, Chat Folding—for TypingMind!
// @author       TypingMind User
// @match        *://*/*
// @grant        none
// ==/UserScript==

(() => {
    'use strict';

    // ========== [ DARK MODE/MODERN STYLES ] ==========
    const CSS = `
  /* Code block action bar */
  .tm-codebar {
    position: absolute;
    top: 10px;
    right: 14px;
    display: flex;
    gap: 7px;
    z-index: 20;
  }
  .tm-codebtn {
    background: linear-gradient(90deg,#173bd9,#27c956);
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 15px;
    box-shadow: 0 1.5px 4px rgba(24,28,52,0.13);
    cursor: pointer;
    opacity: .89;
    transition: background .14s,opacity .12s;
  }
  .tm-codebtn[disabled] { opacity: 0.5; cursor:not-allowed; }
  .tm-codebtn:hover { opacity: 1;background: linear-gradient(90deg,#2a64e8,#4ad684);}
  code.tm-syntax-err {
    background:#362020 !important;
    box-shadow: 0 0 7px 1.5px #c45d5d94;
    border: 2px solid #ad3630!important;
    position: relative;
  }
  .tm-synerr-badge {
    position: absolute; top:0; left:0;
    background: #e23b3b;
    color: #fff;
    font-size: 12px;
    padding: 2px 12px 2px 7px;
    border-radius: 0 0 8px 0;
    z-index:80;
    max-width:210px;
    white-space:nowrap;overflow-x:auto;
    box-shadow: 0 1.5px 5px #8c181877;
  }
  .tm-toast {
    position: fixed;
    bottom: 42px;
    right: 39px;
    background: #232b44f2;
    color: #f2f6ff;
    padding: 18px 33px;
    font-size: 18px;
    border-radius: 19px;
    box-shadow: 0 2px 10px #1117;
    z-index: 20202;
    text-align: center;
    min-width:170px;
    letter-spacing:0.01em;
  }
  /* Floating action bar */
  .tm-floating-bar {
    position: fixed;
    left:40px;
    bottom:44px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    z-index: 9999;
  }
  .tm-floating-btn {
    padding: 13px 28px;
    font-size: 16px;
    font-weight: 500;
    background: linear-gradient(90deg,#0d193e,#27c956);
    color: #fff; border: none;
    border-radius: 24px;
    box-shadow: 0 2px 8px rgba(40,52,100,.20);
    opacity: 0.96; cursor: pointer;
    transition: opacity .13s,background .13s;
  }
  .tm-floating-btn:hover {opacity:1;background: linear-gradient(90deg,#425cff,#27e6ba);}
  /* Folding styles */
  .tm-fold-btn {
    background:#363a4b;
    color:#e6ecee;
    border:none;border-radius:6px;
    padding:1px 10px;font-size:14px;
    opacity:0.72;cursor:pointer;
    position: absolute;
    top: 5px; right: 8px; z-index:110;
    transition:opacity .13s,background .13s;
  }
  .tm-fold-btn:hover {opacity:1;background:#405799;}
  .tm-collapsed-wrap {
    min-height:36px;display:flex; align-items:center;
    cursor: pointer;
    color: #60ffec;
    font-weight: 600;
    padding:18px 22px;
    font-size:16px; justify-content:center;
  }
  /* Responsive (floating btn moves up if toast is present) */
  .tm-toast + .tm-floating-bar { bottom:88px!important; }
  `;
    // Insert once
    if (!document.getElementById('tm-mega-style')) {
        const s = document.createElement('style');
        s.id = 'tm-mega-style'; s.innerHTML = CSS;
        document.head.appendChild(s);
    }

    // ========== [ TOAST / FEEDBACK ] ==========
    function showToast(msg, time=1500) {
        // Only one toast at a time
        let old = document.querySelector('.tm-toast');
        if (old) { old.remove(); }
        let t = document.createElement('div');
        t.className='tm-toast'; t.innerHTML=msg;
        document.body.appendChild(t);
        setTimeout(()=>{ t.remove(); }, time);
    }

    // ========== [ 1. SYNTAX ERROR HIGHLIGHTER ] ==========
    // --- Skulpt async load & ready management
    let skulptLoading=false, skulptReady=false, skulptReadyCbs=[];
    function ensureSkulpt(cb){
        if(skulptReady){cb();return;}
        if(skulptLoading){ skulptReadyCbs.push(cb); return;}
        if(window.Sk){ skulptReady=true;cb();return;}
        skulptLoading=true; skulptReadyCbs.push(cb);
        let s=document.createElement('script');
        s.src='https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js';
        s.onload=()=>{
            skulptReady = true;
            skulptReadyCbs.forEach(fn=>fn());
            skulptReadyCbs = [];
        };
        document.head.appendChild(s);
    }
    function checkSyntax(codeText, lang, cb) {
        if (lang === 'python') {
            ensureSkulpt(()=>{
                try { window.Sk.parse('tm_code.py', codeText); cb(null);}
                catch(e) { cb(e.message||e.toString());}
            });
        } else if (lang === 'javascript') {
            try { new Function(codeText); cb(null);}
            catch(e) { cb(e.message||e.toString()); }
        } else if (lang === 'json') {
            try { JSON.parse(codeText); cb(null);}
            catch(e) { cb(e.message||e.toString()); }
        }
        else { cb(null);}
    }
    function detectLang(codeElem) {
        let lang = codeElem.className.match(/language-(\w+)/)?.[1] || '';
        if (!lang) {
            const txt = codeElem.textContent;
            if (txt.includes("def ") || txt.includes("import ")) return 'python';
            if (txt.trim().startsWith("{")) return 'json';
            if (txt.includes("function") || txt.includes(";")) return 'javascript';
        }
        return lang;
    }
    // Each code gets error analysis once (after syntax lib loaded)
    function syntaxHighlightBlocks(force=false) {
        document.querySelectorAll('pre > code').forEach(code=>{
            if (!force && code.classList.contains('tm-err-checked')) return;
            // Remove old
            code.classList.remove('tm-err-checked','tm-syntax-err');
            let b = code.parentElement.querySelector('.tm-synerr-badge'); if(b) b.remove();
        });
        // DELAY so badge never flashes/gets erased (if called in rapid succession)
        setTimeout(()=>{
            document.querySelectorAll('pre > code').forEach(code=>{
                if (code.classList.contains('tm-err-checked')) return;
                const lang = detectLang(code);
                if (!lang || !["python","javascript","json"].includes(lang)) {code.classList.add('tm-err-checked');return;}
                checkSyntax(code.textContent, lang, function(err){
                    code.classList.add('tm-err-checked');
                    const pre = code.parentElement;
                    // Remove any old
                    let oldb = pre.querySelector('.tm-synerr-badge'); if(oldb) oldb.remove();
                    code.classList.remove('tm-syntax-err');
                    if (err) {
                        code.classList.add('tm-syntax-err');
                        let badge = document.createElement("div");
                        badge.className = "tm-synerr-badge";
                        badge.title = err;
                        badge.textContent = "❌ Syntax Error";
                        pre.appendChild(badge);
                    }
                });
            });
        },100);
    }

    // ========== [ 2. CODEBLOCK: EXPORT/COPY BTN & BATCH ZIP ] ==========
    // --- Filename logic unified
    function guessFilename(code, used) {
        let codeText = code.innerText.trim();
        let filename = '', ext = '';
        // Markdown triple-backtick + filename e.g. ```python mycode.py
        let m = codeText.match(/^```[\w#+-]*\s+([-\w.]+).*$/m);
        if (m && m[1]) filename = m[1];
        // Comments (header lines)
        if (!filename) {
            const header = codeText.split('\n').slice(0, 3);
            for(let line of header){
                let mm=line.match(/(?:#|\/\/|;)\s*([-\w]+\.\w+)/);
                if(mm&&mm[1]){ filename=mm[1]; break;}
            }
        }
        // Code language
        if (!filename) {
            let lang = code.className.match(/language-(\w+)/)?.[1]||'txt';
            ext = ({
                python:'.py', javascript:'.js', typescript:'.ts', json:'.json', bash:'.sh', shell:'.sh',powershell:'.ps1',
                batch:'.bat', cmd:'.bat',java:'.java',sql:'.sql',cpp:'.cpp',c:'.c',html:'.html',css:'.css',
                php:'.php',md:'.md',go:'.go',rust:'.rs',ruby:'.rb'
            })[lang] || '.txt';
            filename = `exported-code-${lang}${ext}`;
        }
        // .ext check
        if(!/\.\w+$/i.test(filename)) filename += '.txt';
        // Uniquify if duplicate
        if(used[filename]){filename=filename.replace(/(\.\w+$)/,`_${used[filename]}$1`);}
        used[filename]=(used[filename] || 0)+1;
        return filename;
    }
    // --- Add per-block codebar with Export/Copy (top right)
    function enhanceCodeBlocks() {
        document.querySelectorAll('pre > code').forEach(code => {
            const pre = code.parentElement;
            if (pre.classList.contains("tm-has-codebar")) return;
            // Make relative for abs button bar
            if (getComputedStyle(pre).position==='static') pre.style.position='relative';
            // Remove existing bars
            pre.querySelectorAll('.tm-codebar').forEach(el=>el.remove());
            // Bar container
            const bar = document.createElement('div'); bar.className='tm-codebar';
            // Export btn
            const eBtn=document.createElement('button');
            eBtn.className='tm-codebtn';eBtn.innerHTML='💾';
            eBtn.title='Export this code as file';
            eBtn.onclick=function(ev) {
                ev.stopPropagation();
                const filename = guessFilename(code, {});
                const blob = new Blob([code.innerText.replace(/\n$/,'')], {type:"application/octet-stream"});
                const a=document.createElement("a");
                a.href=URL.createObjectURL(blob);
                a.download=filename;
                document.body.appendChild(a); a.click();
                setTimeout(()=>{document.body.removeChild(a);}, 80);
                navigator.clipboard.writeText(filename).catch(()=>{});
                eBtn.innerHTML="✅";
                setTimeout(() => eBtn.innerHTML = "💾", 1150);
                showToast(`<b>${filename}</b> saved &amp; copied!`);
            };
            bar.appendChild(eBtn);
            // Copy btn
            const cBtn = document.createElement('button');
            cBtn.className='tm-codebtn'; cBtn.innerHTML='📋'; cBtn.title='Copy code';
            cBtn.onclick=function(ev){
                ev.stopPropagation();
                navigator.clipboard.writeText(code.innerText.trim()).catch(()=>{});
                cBtn.innerHTML="✅"; setTimeout(()=>cBtn.innerHTML="📋",900);
                showToast(`Code copied!`);
            };
            bar.appendChild(cBtn);
            // Place bar top-right
            pre.appendChild(bar);
            pre.classList.add("tm-has-codebar");
        });
    }
    // --- JSZip loader
    function injectZip(cb) {
        if (window.JSZip) return cb();
        if(document.getElementById('tm-jszip')) return;
        var s = document.createElement('script');
        s.id='tm-jszip';
        s.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
        s.onload = cb; document.head.appendChild(s);
    }
    // --- Batch ZIP: floating button
    function addFloatingBar() {
        if (document.getElementById('tm-mega-floating-bar')) return;
        const bar = document.createElement('div');
        bar.className='tm-floating-bar'; bar.id='tm-mega-floating-bar';
        // Batch Zip Export
        const zipBtn=document.createElement('button');
        zipBtn.className='tm-floating-btn';
        zipBtn.innerText='🗜️ Batch Code ZIP';
        zipBtn.title='Export all code blocks in chat as a ZIP file';
        zipBtn.onclick=() => injectZip(batchZipExport);
        bar.appendChild(zipBtn);
        // Beautify Tables
        const tblBtn=document.createElement('button');
        tblBtn.className='tm-floating-btn';
        tblBtn.innerText='📐 Beautify Tables';
        tblBtn.title='Prettify/align all markdown tables';
        tblBtn.onclick=beautifyMarkdownTables;
        bar.appendChild(tblBtn);
        document.body.appendChild(bar);
    }
    function batchZipExport() {
        const codeBlocks=[...document.querySelectorAll('pre > code')];
        if(!codeBlocks.length) return showToast("No code blocks found.",1100);
        const zip=new JSZip(), used={};
        codeBlocks.forEach((code,i)=>{
            const filename = guessFilename(code, used);
            zip.file(filename, code.innerText.replace(/\n$/,''));
        });
        zip.generateAsync({type:"blob"}).then(function(content){
            const a=document.createElement("a");
            a.href=URL.createObjectURL(content);
            a.download="chat-codeblocks.zip";
            document.body.appendChild(a); a.click();
            setTimeout(()=>{document.body.removeChild(a)},80);
            showToast(`Exported <b>${codeBlocks.length}</b> files as ZIP<br><span style="font-size:14px;">(chat-codeblocks.zip)</span>`,2100+300*codeBlocks.length);
        });
    }

    // ========== [ 3. MARKDOWN TABLE BEAUTIFIER ] ==========
    function alignTable(txt) {
        const lines = txt.split('\n');
        if (!lines.some(l=>l.includes('|'))) return txt;
        let tableLines = [], out = [];
        for(let i = 0; i < lines.length; ++i) {
            let line = lines[i];
            if (line.includes('|')) { tableLines.push(line);}
            else if (tableLines.length>1) { out.push(formatTable(tableLines)); tableLines=[]; out.push(line);}
            else out.push(line);
        }
        if(tableLines.length > 1) out.push(formatTable(tableLines));
        return out.join('\n');
    }
    function formatTable(lines) {
        const rows = lines.map(row => row.trim().replace(/^[|]/,'').replace(/[|]$/,'').split('|').map(c=>c.trim()));
        // Find col widths
        const colWidths = [];
        rows.forEach(row => {
            row.forEach((cell, i) => colWidths[i]=Math.max(colWidths[i]||0,cell.length));
        });
        // Format rows
        return rows.map(row => '| ' + row.map((cell,i)=>cell.padEnd(colWidths[i],' ')).join(' | ') + ' |').join('\n');
    }
    function beautifyMarkdownTables() {
        let beautifiedCount=0;
        document.querySelectorAll('pre > code').forEach(code => {
            if (code.classList && code.classList.contains('tm-markdown-table-beautified')) return;
            const txt = code.innerText;
            if (txt.includes('|')) {
                const formatted = alignTable(txt);
                if (formatted !== txt) {
                    code.innerText = formatted;
                    code.classList && code.classList.add('tm-markdown-table-beautified');
                    beautifiedCount++;
                }
            }
        });
        if(beautifiedCount) showToast(`Beautified <b>${beautifiedCount}</b> table(s)!`);
        else showToast('No tables found');
    }

    // ========== [ 4. CHAT MESSAGE FOLDING ] ==========
    // -- Wrapper div so content/data/eventListeners are not lost!
    function addChatFolds() {
        document.querySelectorAll('.chat-message-bubble').forEach(bubble => {
            if (bubble.classList.contains('tm-has-fold')) return;
            // Create wrapper for message so content is preserved
            if (!bubble.querySelector('.tm-fold-wrap')) {
                const w=document.createElement('div');
                w.className='tm-fold-wrap';
                while(bubble.childNodes.length) w.appendChild(bubble.childNodes[0]);
                bubble.appendChild(w);
            }
            // Add button (absolute top-right)
            if (!bubble.querySelector('.tm-fold-btn')) {
                const btn=document.createElement('button');
                btn.innerHTML='▼';
                btn.className = 'tm-fold-btn';
                btn.title='Collapse message';
                let folded=false;
                btn.onclick = function(ev){
                    ev.stopPropagation();
                    const wrap = bubble.querySelector('.tm-fold-wrap');
                    if(!folded){
                        wrap.style.display='none';
                        // Insert click-to-expand minimal node
                        let collapsed = document.createElement('div');
                        collapsed.className='tm-collapsed-wrap';
                        collapsed.textContent='[Click to expand]';
                        collapsed.onclick=function(e){e.stopPropagation();
                                                      wrap.style.display=''; folded=false;
                                                      collapsed.remove();
                                                      btn.innerHTML='▼';
                                                     };
                        bubble.appendChild(collapsed);
                        btn.innerHTML='▲';
                        folded=true;
                    }
                };
                bubble.appendChild(btn);
            }
            bubble.classList.add('tm-has-fold');
            // Ensure parent for abs position
            if(getComputedStyle(bubble).position==='static') bubble.style.position='relative';
        });
    }

    // ========== [ 5. MASTER OBSERVER (DYNAMIC UI)] ==========
    // Watch ".main-content-area" or fallback to document.body
    let obsTimeout=null;
    function mainEnhance(){ // Called once & debounced in observer
        syntaxHighlightBlocks();
        enhanceCodeBlocks();
        addFloatingBar();
        addChatFolds();
    }
    function observerCb(){
        if(obsTimeout) clearTimeout(obsTimeout);
        obsTimeout=setTimeout(mainEnhance, 175);
    }
    function runMainEnhancer() {
        mainEnhance();
        const chatRoot=document.querySelector(".main-content-area") || document.body;
        // One observer for all! (So features update together, single debounce)
        new MutationObserver(observerCb).observe(chatRoot, {childList:true, subtree:true});
    }

    // ========== [ RUN ] ==========
    if (document.readyState!=="loading") runMainEnhancer();
    else document.addEventListener('DOMContentLoaded',runMainEnhancer);
})();
