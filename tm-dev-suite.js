// ==UserScript==
// @name         TypingMind Dev Suite (Refactored, Production)
// @namespace    https://typingmind.com/
// @version      3.2
// @description  Modular code export, batch ZIP, markdown table beautifier, chat folding for TypingMind (SPA/PWA robust)
// @author       TypingMind User
// @license      MIT
// @match        *://*/*
// @grant        none
// ==/UserScript==
/*
MIT License

Copyright (c) 2024 TypingMind User

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software ... [trimmed for brevity, see full license on upload]
*/

(() => {
'use strict';

// ====== Config & Selectors ======
const PREFIX = "tmdev-";
const TM_SELECTORS = {
    chatBubble:    ".chat-message-bubble",
    codeBlock:     "pre > code",
    mainContent:   ".main-content-area", // fallback to document.body if absent
};
const CSS = `
  .${PREFIX}floating-bar {
    position: fixed; left: 40px; bottom: 44px;
    display: flex; flex-direction: column; gap: 12px; z-index: 9999;
  }
  .${PREFIX}floating-btn {
    padding: 13px 28px; font-size: 16px; font-weight: 500;
    background: linear-gradient(90deg,#0d193e,#27c956); color: #fff; border: none; border-radius: 24px;
    box-shadow: 0 2px 8px rgba(40,52,100,.20); opacity: 0.96; cursor: pointer;
    transition: opacity .13s, background .13s;
  }
  .${PREFIX}floating-btn:hover {
    opacity: 1;
    background: linear-gradient(90deg, #425cff, #27e6ba);
  }
  .${PREFIX}toast {
    position: fixed; bottom: 42px; right: 39px;
    background: var(--tm-color-toast-bg, #232b44f2);
    color: var(--tm-color-toast-fg, #f2f6ff);
    padding: 18px 33px; font-size: 18px; border-radius: 19px; box-shadow: 0 2px 10px #1117;
    z-index: 20202; text-align: center; min-width: 170px; letter-spacing: 0.01em;
  }
  html[data-theme="light"] .${PREFIX}toast {
    background: #efeef9eb;
    color: #1d2740;
  }
  .${PREFIX}toast + .${PREFIX}floating-bar { bottom: 88px!important; }
  .${PREFIX}fold-btn {
    background:#363a4b; color:#e6ecee; border:none; border-radius:6px;
    padding:1px 10px; font-size:14px; opacity:0.72; cursor:pointer;
    position: absolute; top: 5px; right: 8px; z-index:110;
    transition:opacity .13s,background .13s;
  }
  .${PREFIX}fold-btn:hover {opacity:1;background:#405799;}
  .${PREFIX}collapsed-wrap {
    min-height:36px;display:flex; align-items:center; cursor: pointer;
    color: #60ffec; font-weight: 600; padding:18px 22px; font-size:16px; justify-content:center;
  }
  .${PREFIX}codebar {
    position: absolute; top: 10px; right: 14px; display: flex; gap: 7px; z-index: 20;
  }
  .${PREFIX}codebar-btn {
    background: linear-gradient(90deg,#173bd9,#27c956); color: #fff;
    border: none; border-radius: 6px; padding: 6px 12px; font-size: 15px;
    box-shadow: 0 1.5px 4px rgba(24,28,52,0.13); cursor: pointer; opacity: .89;
    transition: background .14s,opacity .12s;
  }
  .${PREFIX}codebar-btn:hover { opacity: 1; background: linear-gradient(90deg,#2a64e8,#4ad684);}
`;
function injectStyle() {
    if (document.getElementById(PREFIX+'style')) return;
    const style = document.createElement('style');
    style.id = PREFIX + 'style'; style.innerText = CSS;
    document.head.appendChild(style);
}
function showToast(msg, time=1700) {
    let t = document.querySelector('.' + PREFIX + 'toast');
    if (t) t.remove();
    t = document.createElement('div');
    t.className = PREFIX + 'toast';
    t.setAttribute('role', 'alert');
    t.setAttribute('aria-live', 'polite');
    t.innerHTML = msg;
    document.body.appendChild(t);
    setTimeout(()=>{ t.remove(); }, time);
}

// ======= Feature: Code Export & Batch ZIP ==========
class CodeExport {
    get codeBlocks() { return document.querySelectorAll(TM_SELECTORS.codeBlock);}
    guessFilename(code, used) {
        let codeText = code.innerText.trim(), filename='', ext='';
        let m = codeText.match(/^```[\w#+-]*\s+([-\w.]+).*$/m);
        if (m && m[1]) filename = m[1];
        if (!filename) {
            const header = codeText.split('\n').slice(0,3);
            for (let line of header) {
                let mm = line.match(/(?:#|\/\/|;)\s*([-\w]+\.\w+)/);
                if (mm&&mm[1]) { filename=mm[1]; break; }
            }
        }
        if (!filename) {
            let lang = code.className.match(/language-(\w+)/)?.[1] || 'txt';
            ext = ({
                python: '.py', javascript: '.js', typescript: '.ts', json: '.json',
                bash: '.sh', shell: '.sh', powershell: '.ps1', batch: '.bat', cmd: '.bat',
                java: '.java', sql: '.sql', cpp: '.cpp', c: '.c', html: '.html', css: '.css',
                php: '.php', md: '.md', go: '.go', rust: '.rs', ruby: '.rb'
            })[lang] || '.txt';
            filename = `exported-code-${lang}${ext}`;
        }
        if (!/\.\w+$/i.test(filename)) filename += '.txt';
        if (used[filename]) { filename = filename.replace(/(\.\w+$)/, `_${used[filename]}$1`);}
        used[filename] = (used[filename]||0)+1;
        return filename;
    }
    injectPerBlock() {
        this.codeBlocks.forEach(code => {
            const pre = code.parentElement;
            if (pre.classList.contains(PREFIX + "has-codebar")) return;
            if (getComputedStyle(pre).position === 'static') pre.style.position = 'relative';
            pre.querySelectorAll('.' + PREFIX + 'codebar').forEach(e=>e.remove());
            const bar = document.createElement('div'); bar.className = PREFIX + 'codebar';
            // Export
            const eBtn = document.createElement('button');
            eBtn.className = PREFIX + 'codebar-btn'; eBtn.innerHTML = '💾';
            eBtn.title = 'Export this code as file'; eBtn.setAttribute('aria-label','Export code block');
            eBtn.onclick = ev => {
                ev.stopPropagation();
                const filename = this.guessFilename(code, {});
                const blob = new Blob([code.innerText.replace(/\n$/, '')], { type: "application/octet-stream" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob); a.download = filename;
                document.body.appendChild(a); a.click();
                setTimeout(()=>{document.body.removeChild(a);}, 80);
                navigator.clipboard.writeText(filename).catch(()=>{});
                eBtn.innerHTML="✅"; setTimeout(()=>{eBtn.innerHTML="💾"}, 1150);
                showToast(`<b>${filename}</b> saved &amp; copied!`);
            };
            // Copy
            const cBtn = document.createElement('button');
            cBtn.className = PREFIX + 'codebar-btn'; cBtn.innerHTML = '📋';
            cBtn.title = 'Copy code'; cBtn.setAttribute('aria-label','Copy code block');
            cBtn.onclick = ev => {
                ev.stopPropagation();
                navigator.clipboard.writeText(code.innerText.trim()).catch(()=>{});
                cBtn.innerHTML="✅"; setTimeout(()=>cBtn.innerHTML="📋",900);
                showToast('Code copied!');
            };
            bar.appendChild(eBtn); bar.appendChild(cBtn);
            pre.appendChild(bar);
            pre.classList.add(PREFIX + "has-codebar");
        });
    }
    removePerBlock() {
        document.querySelectorAll('.'+PREFIX+'has-codebar').forEach(pre => {
            pre.classList.remove(PREFIX+'has-codebar');
            pre.querySelectorAll('.'+PREFIX+'codebar').forEach(el=>el.remove());
        });
    }
    injectJSZip(cb) {
        if (window.JSZip) return cb();
        if (document.getElementById(PREFIX+'jszip')) return;
        var s = document.createElement('script');
        s.id = PREFIX+'jszip';
        s.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
        s.integrity = 'sha384-tkPP03pLyMtXk8X8yt5tsuLbl/HN/jwNFUIMJ+UYhVCpNSab6iCMpwLu9nslNWZZ';
        s.crossOrigin = 'anonymous';
        s.onload = cb; document.head.appendChild(s);
    }
    batchZipExport() {
        const codeBlocks = [...this.codeBlocks];
        if (!codeBlocks.length) return showToast("No code blocks found.",1100);
        const zip = new JSZip(), used = {};
        codeBlocks.forEach(code=>{
          const filename = this.guessFilename(code, used);
          zip.file(filename, code.innerText.replace(/\n$/,''));
        });
        zip.generateAsync({type:"blob"}).then(content=>{
          const a=document.createElement("a");
          a.href=URL.createObjectURL(content);
          a.download="chat-codeblocks.zip";
          document.body.appendChild(a); a.click();
          setTimeout(()=>{document.body.removeChild(a)},80);
          showToast(`Exported <b>${codeBlocks.length}</b> files as ZIP<br><span style="font-size:14px;">(chat-codeblocks.zip)</span>`,2100+300*codeBlocks.length);
        });
    }
    init()        { this.injectPerBlock(); }
    cleanup()     { this.removePerBlock(); }
}

// ========== Table Beautify ==========
class TableBeautify {
    alignTable(txt) {
      const lines = txt.split('\n');
      if (!lines.some(l=>l.includes('|'))) return txt;
      let tableLines = [], out = [];
      for(let i = 0; i < lines.length; ++i) {
        let line = lines[i];
        if (line.includes('|')) { tableLines.push(line);}
        else if (tableLines.length>1) { out.push(this.formatTable(tableLines)); tableLines=[]; out.push(line);}
        else out.push(line);
      }
      if(tableLines.length > 1) out.push(this.formatTable(tableLines));
      return out.join('\n');
    }
    formatTable(lines) {
      const rows = lines.map(row => row.trim().replace(/^[|]/,'').replace(/[|]$/,'').split('|').map(c=>c.trim()));
      const colWidths = [];
      rows.forEach(row => {
        row.forEach((cell, i) => colWidths[i]=Math.max(colWidths[i]||0,cell.length));
      });
      return rows.map(row => '| ' + row.map((cell,i)=>cell.padEnd(colWidths[i],' ')).join(' | ') + ' |').join('\n');
    }
    beautifyTables() {
      let beautifiedCount=0;
      document.querySelectorAll(TM_SELECTORS.codeBlock).forEach(code => {
        if (code.classList && code.classList.contains(PREFIX+'mdtbl-beautified')) return;
        const txt = code.innerText;
        if (txt.includes('|')) {
          const formatted = this.alignTable(txt);
          if (formatted !== txt) {
            code.innerText = formatted;
            code.classList && code.classList.add(PREFIX+'mdtbl-beautified');
            beautifiedCount++;
          }
        }
      });
      if(beautifiedCount) showToast(`Beautified <b>${beautifiedCount}</b> table(s)!`);
      else showToast('No tables found');
    }
    cleanup() {
        document.querySelectorAll('.'+PREFIX+'mdtbl-beautified').forEach(code=>code.classList.remove(PREFIX+'mdtbl-beautified'));
    }
    init() { /* No op, UI triggers this */ }
}

// ========== Chat Folding ==========
class ChatFold {
    foldChats() {
        document.querySelectorAll(TM_SELECTORS.chatBubble).forEach(bubble => {
            if (bubble.classList.contains(PREFIX + "has-fold")) return;
            if (!bubble.querySelector('.'+PREFIX+'fold-wrap')) {
                const w=document.createElement('div');
                w.className=PREFIX+'fold-wrap';
                while(bubble.childNodes.length) w.appendChild(bubble.childNodes[0]);
                bubble.appendChild(w);
            }
            if (!bubble.querySelector('.'+PREFIX+'fold-btn')) {
                const btn=document.createElement('button');
                btn.innerHTML='▼'; btn.className = PREFIX+'fold-btn';
                btn.title='Collapse message';
                btn.setAttribute('aria-label','Collapse chat message');
                let folded=false;
                btn.onclick = function(ev){
                  ev.stopPropagation();
                  const wrap = bubble.querySelector('.' + PREFIX + 'fold-wrap');
                  if(!folded){
                    wrap.style.display='none';
                    let collapsed = document.createElement('div');
                    collapsed.className=PREFIX+'collapsed-wrap';
                    collapsed.textContent='[Click to expand]';
                    collapsed.tabIndex=0;
                    collapsed.setAttribute('aria-label','Expand chat message');
                    collapsed.onclick = function(e){e.stopPropagation();wrap.style.display=''; folded=false;collapsed.remove();btn.innerHTML='▼';};
                    collapsed.onkeyup = function(e){if(e.key==='Enter'||e.key===' '){collapsed.click();}};
                    bubble.appendChild(collapsed);
                    btn.innerHTML='▲'; folded=true;
                  }
                };
                bubble.appendChild(btn);
            }
            bubble.classList.add(PREFIX+"has-fold");
            if (getComputedStyle(bubble).position==='static') bubble.style.position='relative';
        });
    }
    cleanup() {
        document.querySelectorAll('.'+PREFIX+'has-fold').forEach(bubble => {
            bubble.classList.remove(PREFIX+'has-fold');
            bubble.querySelectorAll('.'+PREFIX+'fold-btn').forEach(el=>el.remove());
            let wrap = bubble.querySelector('.'+PREFIX+'fold-wrap');
            if(wrap) wrap.style.display='';
            bubble.querySelectorAll('.'+PREFIX+'collapsed-wrap').forEach(el=>el.remove());
        });
    }
    init() { this.foldChats(); }
}

// ========== Floating Action Bar ==============
class FloatingBar {
    constructor({codeExport, tableBeautify}) {
        this.barId = PREFIX+'floating-bar';
        this.codeExport = codeExport;
        this.tableBeautify = tableBeautify;
    }
    createBar() {
        if (document.getElementById(this.barId)) return;
        const bar = document.createElement('div');
        bar.className = PREFIX + 'floating-bar'; bar.id = this.barId;

        const zipBtn = document.createElement('button');
        zipBtn.className = PREFIX+'floating-btn';
        zipBtn.innerText = '🗜️ Batch Code ZIP';
        zipBtn.title = 'Export all code blocks in chat as a ZIP file';
        zipBtn.setAttribute('aria-label', 'Batch export all code');
        zipBtn.onclick = ()=>this.codeExport.injectJSZip(()=>this.codeExport.batchZipExport());
        bar.appendChild(zipBtn);

        const tblBtn = document.createElement('button');
        tblBtn.className = PREFIX+'floating-btn';
        tblBtn.innerText = '📐 Beautify Tables';
        tblBtn.title = 'Prettify/align all markdown tables';
        tblBtn.setAttribute('aria-label', 'Beautify markdown tables');
        tblBtn.onclick = ()=>this.tableBeautify.beautifyTables();
        bar.appendChild(tblBtn);

        document.body.appendChild(bar);
    }
    removeBar() {
        const bar = document.getElementById(this.barId);
        if (bar) bar.remove();
    }
    init() { this.createBar(); }
    cleanup() { this.removeBar(); }
}

// ========== Main Manager ==========
class TMDevSuiteManager {
    constructor() {
        this.features = [];
        this.observer = null;
        this.debTimer = null;
        this.codeExport = new CodeExport();
        this.tableBeautify = new TableBeautify();
        this.chatFold = new ChatFold();
        this.floatingBar = new FloatingBar({codeExport: this.codeExport, tableBeautify: this.tableBeautify});
        this.features = [this.codeExport, this.floatingBar, this.tableBeautify, this.chatFold];
    }
    init() {
        injectStyle();
        this.features.forEach(f => f.init && f.init());
        this.setupObserver();
    }
    cleanup() {
        this.features.forEach(f=>f.cleanup&&f.cleanup());
        document.querySelectorAll('.'+PREFIX+'toast').forEach(el=>el.remove());
        const sty = document.getElementById(PREFIX+'style'); if (sty) sty.remove();
        if (this.observer) this.observer.disconnect();
        this.observer = null;
    }
    setupObserver() {
        if (this.observer) this.observer.disconnect();
        const root = document.querySelector(TM_SELECTORS.mainContent) || document.body;
        this.observer = new MutationObserver(()=>this.mainEnhancerDebounced());
        this.observer.observe(root, {childList:true, subtree:true});
        this.mainEnhancerDebounced();
    }
    mainEnhancerDebounced() {
        if(this.debTimer) clearTimeout(this.debTimer);
        this.debTimer = setTimeout(()=>this.features.forEach(f=>f.init&&f.init()), 150);
    }
}

// === SPA Navigation Support & Bootstrap ===
const mgr = new TMDevSuiteManager();
window.addEventListener('popstate', () => mgr.init());
window.addEventListener('hashchange', () => mgr.init());
if (document.readyState !== "loading") mgr.init();
else document.addEventListener('DOMContentLoaded', () => mgr.init());

})();
