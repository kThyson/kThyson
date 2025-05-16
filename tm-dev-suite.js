// ==UserScript==
// @name         TypingMind Dev Suite (Refactored, Production)
// @namespace    https://typingmind.com/
// @version      3.3
// @description  Modular code export, batch ZIP, markdown table beautifier, chat folding for TypingMind (SPA/PWA robust)
// @author       TypingMind User
// @license      MIT
// @match        *://*/*
// @grant        none
// ==/UserScript==

/*
MIT License
Copyright (c) 2024 TypingMind User
Permission is hereby granted, free of charge, to any person obtaining a copy...
*/

(() => {
'use strict';

// ====== Config & Selectors ======
const PREFIX = "tmdev-";
const TM_SELECTORS = {
    chatBubble:    ".chat-message-bubble",
    codeBlock:     "pre > code",
    mainContent:   ".main-content-area",
};
// ---- Option 5: CSS Improvements (use variables, move inline to classes) ----
const CSS = `
  :root {
    --tm-floating-bar-left: 40px;
    --tm-floating-bar-bottom: 44px;
    --tm-floating-bar-z: 9999;
    --tm-btn-bg: linear-gradient(90deg,#0d193e,#27c956);
    --tm-btn-bg-hover: linear-gradient(90deg, #425cff, #27e6ba);
    --tm-toast-bg: #232b44f2;
    --tm-toast-fg: #f2f6ff;
    --tm-toast-bg-light: #efeef9eb;
    --tm-toast-fg-light: #1d2740;
    --tm-toast-z: 20202;
    --tm-toast-radius: 19px;
    --tm-btn-radius: 24px;
    --tm-btn-font: 16px;
    --tm-codebar-btn-bg: linear-gradient(90deg,#173bd9,#27c956);
    --tm-codebar-btn-bg-hover: linear-gradient(90deg,#2a64e8,#4ad684);
  }
  .${PREFIX}floating-bar {
    position: fixed; left: var(--tm-floating-bar-left); bottom: var(--tm-floating-bar-bottom);
    display: flex; flex-direction: column; gap: 12px; z-index: var(--tm-floating-bar-z);
  }
  .${PREFIX}floating-btn {
    padding: 13px 28px; font-size: var(--tm-btn-font); font-weight: 500;
    background: var(--tm-btn-bg); color: #fff; border: none; border-radius: var(--tm-btn-radius);
    box-shadow: 0 2px 8px rgba(40,52,100,.20); opacity: 0.96; cursor: pointer;
    transition: opacity .13s, background .13s;
    outline: none;
  }
  .${PREFIX}floating-btn:hover, .${PREFIX}floating-btn:focus {
    opacity: 1; background: var(--tm-btn-bg-hover);
  }
  .${PREFIX}toast {
    position: fixed; bottom: 42px; right: 39px;
    background: var(--tm-toast-bg);
    color: var(--tm-toast-fg);
    padding: 18px 33px; font-size: 18px; border-radius: var(--tm-toast-radius); box-shadow: 0 2px 10px #1117;
    z-index: var(--tm-toast-z); text-align: center; min-width: 170px; letter-spacing: 0.01em;
  }
  html[data-theme="light"] .${PREFIX}toast {
    background: var(--tm-toast-bg-light);
    color: var(--tm-toast-fg-light);
  }
  .${PREFIX}toast + .${PREFIX}floating-bar { bottom: 88px!important; }
  .${PREFIX}fold-btn {
    background:#363a4b; color:#e6ecee; border:none; border-radius:6px;
    padding:1px 10px; font-size:14px; opacity:0.72; cursor:pointer;
    position: absolute; top: 5px; right: 8px; z-index:110;
    transition:opacity .13s,background .13s;
    outline: none;
  }
  .${PREFIX}fold-btn:hover, .${PREFIX}fold-btn:focus {opacity:1;background:#405799;}
  .${PREFIX}collapsed-wrap {
    min-height:36px;display:flex; align-items:center; cursor: pointer;
    color: #60ffec; font-weight: 600; padding:18px 22px; font-size:16px; justify-content:center;
  }
  .${PREFIX}codebar {
    position: absolute; top: 10px; right: 14px; display: flex; gap: 7px; z-index: 20;
  }
  .${PREFIX}codebar-btn {
    background: var(--tm-codebar-btn-bg); color: #fff;
    border: none; border-radius: 6px; padding: 6px 12px; font-size: 15px;
    box-shadow: 0 1.5px 4px rgba(24,28,52,0.13); cursor: pointer; opacity: .89;
    transition: background .14s,opacity .12s;
    outline: none;
  }
  .${PREFIX}codebar-btn:hover, .${PREFIX}codebar-btn:focus { opacity: 1; background: var(--tm-codebar-btn-bg-hover);}
  .${PREFIX}has-relative { position: relative !important; }
`;
// ---- End Option 5 ----

// Injects the style tag once
function injectStyle() {
    if (document.getElementById(PREFIX+'style')) return;
    const style = document.createElement('style');
    style.id = PREFIX + 'style';
    style.innerText = CSS;
    document.head.appendChild(style);
}

// Improved toast notification with error handling (option 3)
function showToast(msg, time=1700) {
    let t = document.querySelector('.' + PREFIX + 'toast');
    if (t) t.remove();
    t = document.createElement('div');
    t.className = PREFIX + 'toast';
    t.setAttribute('role', 'alert');
    t.setAttribute('aria-live', 'polite');
    t.innerHTML = msg;
    document.body.appendChild(t);
    setTimeout(()=>{ if (t.parentNode) t.remove(); }, time);
}

// ======= Feature: Code Export & Batch ZIP ==========
class CodeExport {
    get codeBlocks() {
        return document.querySelectorAll(TM_SELECTORS.codeBlock);
    }

    /**
     * Generates a filename for a code block based on its content and language.
     * Improved readability with more comments.
     */
    generateFilename(code, used) {
        let codeText = code.innerText.trim(), filename='', ext='';
        // Try code fence filename
        let m = codeText.match(/^```[\w#+-]*\s+([-\w.]+).*$/m);
        if (m && m[1]) filename = m[1];
        // Try extracting filename from comments/header
        if (!filename) {
            const header = codeText.split('\n').slice(0,3);
            for (let line of header) {
                let mm = line.match(/(?:#|\/\/|;)\s*([-\w]+\.\w+)/);
                if (mm&&mm[1]) { filename=mm[1]; break; }
            }
        }
        // Use language class as fallback
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
        // Ensure filenames are unique in batch mode
        if (used[filename]) { filename = filename.replace(/(\.\w+$)/, `_${used[filename]}$1`);}
        used[filename] = (used[filename]||0)+1;
        return filename;
    }

    /**
     * Adds export/copy buttons to all code blocks (option 1: helper methods, option 2: avoid redundant queries)
     */
    injectPerBlock() {
        this.codeBlocks.forEach(code => {
            const pre = code.parentElement;
            if (pre.classList.contains(PREFIX + "has-codebar")) return;
            pre.classList.add(PREFIX + "has-codebar");
            // Option 5: Use a class instead of inline style for relative positioning
            if (getComputedStyle(pre).position === 'static') pre.classList.add(PREFIX + 'has-relative');
            // Remove previous codebars if any
            pre.querySelectorAll('.' + PREFIX + 'codebar').forEach(e=>e.remove());
            const bar = document.createElement('div'); bar.className = PREFIX + 'codebar';
            // Create export and copy buttons via helper for option 1
            bar.appendChild(this._createExportBtn(code));
            bar.appendChild(this._createCopyBtn(code));
            pre.appendChild(bar);
        });
    }

    // Option 1: Helper for export button creation with error handling
    _createExportBtn(code) {
        const eBtn = document.createElement('button');
        eBtn.className = PREFIX + 'codebar-btn'; eBtn.innerHTML = '💾';
        eBtn.title = 'Export this code as file'; eBtn.setAttribute('aria-label','Export code block');
        eBtn.onclick = ev => {
            ev.stopPropagation();
            try {
                const filename = this.generateFilename(code, {});
                const blob = new Blob([code.innerText.replace(/\n$/, '')], { type: "application/octet-stream" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob); a.download = filename;
                document.body.appendChild(a); a.click();
                setTimeout(()=>{if(a.parentNode)document.body.removeChild(a);}, 80);
                // Option 3: Error handling for clipboard
                try {
                    navigator.clipboard.writeText(filename);
                } catch(e) {
                    showToast("File saved but could not copy filename!");
                }
                eBtn.innerHTML="✅"; setTimeout(()=>{eBtn.innerHTML="💾"}, 1150);
                showToast(`<b>${filename}</b> saved &amp; copied!`);
            } catch (err) {
                showToast("Error exporting file.");
            }
        };
        return eBtn;
    }

    // Option 1: Helper for copy button creation with error handling
    _createCopyBtn(code) {
        const cBtn = document.createElement('button');
        cBtn.className = PREFIX + 'codebar-btn'; cBtn.innerHTML = '📋';
        cBtn.title = 'Copy code'; cBtn.setAttribute('aria-label','Copy code block');
        cBtn.onclick = ev => {
            ev.stopPropagation();
            try {
                navigator.clipboard.writeText(code.innerText.trim());
                cBtn.innerHTML="✅"; setTimeout(()=>cBtn.innerHTML="📋",900);
                showToast('Code copied!');
            } catch (err) {
                showToast('Copy failed. Your browser may not support it.');
            }
        };
        return cBtn;
    }

    removePerBlock() {
        document.querySelectorAll('.'+PREFIX+'has-codebar').forEach(pre => {
            pre.classList.remove(PREFIX+'has-codebar');
            pre.classList.remove(PREFIX+'has-relative');
            pre.querySelectorAll('.'+PREFIX+'codebar').forEach(el=>el.remove());
        });
    }

    // Loads JSZip only when needed (option 2)
    injectJSZip(cb) {
        if (window.JSZip) return cb();
        if (document.getElementById(PREFIX+'jszip')) return;
        var s = document.createElement('script');
        s.id = PREFIX+'jszip';
        s.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
        s.integrity = 'sha384-tkPP03pLyMtXk8X8yt5tsuLbl/HN/jwNFUIMJ+UYhVCpNSab6iCMpwLu9nslNWZZ';
        s.crossOrigin = 'anonymous';
        s.onload = cb;
        s.onerror = () => showToast("Failed to load ZIP library.", 2000); // Option 3
        document.head.appendChild(s);
    }

    batchZipExport() {
        const codeBlocks = [...this.codeBlocks];
        if (!codeBlocks.length) return showToast("No code blocks found.",1100);
        if (!window.JSZip) return showToast("ZIP library not loaded.", 1500);
        const zip = new JSZip(), used = {};
        codeBlocks.forEach(code=>{
            const filename = this.generateFilename(code, used);
            zip.file(filename, code.innerText.replace(/\n$/,''));
        });
        zip.generateAsync({type:"blob"}).then(content=>{
            const a=document.createElement("a");
            a.href=URL.createObjectURL(content);
            a.download="chat-codeblocks.zip";
            document.body.appendChild(a); a.click();
            setTimeout(()=>{if(a.parentNode)document.body.removeChild(a)},80);
            showToast(`Exported <b>${codeBlocks.length}</b> files as ZIP<br><span style="font-size:14px;">(chat-codeblocks.zip)</span>`,2100+300*codeBlocks.length);
        }).catch(()=>showToast("ZIP export failed.", 2000)); // Option 3
    }
    init()        { this.injectPerBlock(); }
    cleanup()     { this.removePerBlock(); }
}

// ========== Table Beautify ==========
class TableBeautify {
    /**
     * Aligns markdown tables for each code block found.
     * Refactored to clarify steps (option 1).
     */
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
    init() {}
}

// ========== Chat Folding ==========
class ChatFold {
    // unchanged for brevity (no options specified here)
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

        // Option 1: create buttons via helper
        bar.appendChild(this._createZipBtn());
        bar.appendChild(this._createTableBtn());

        document.body.appendChild(bar);
    }
    _createZipBtn() {
        const zipBtn = document.createElement('button');
        zipBtn.className = PREFIX+'floating-btn';
        zipBtn.innerText = '🗜️ Batch Code ZIP';
        zipBtn.title = 'Export all code blocks in chat as a ZIP file';
        zipBtn.setAttribute('aria-label', 'Batch export all code');
        zipBtn.onclick = ()=>this.codeExport.injectJSZip(()=>this.codeExport.batchZipExport());
        return zipBtn;
    }
    _createTableBtn() {
        const tblBtn = document.createElement('button');
        tblBtn.className = PREFIX+'floating-btn';
        tblBtn.innerText = '📐 Beautify Tables';
        tblBtn.title = 'Prettify/align all markdown tables';
        tblBtn.setAttribute('aria-label', 'Beautify markdown tables');
        tblBtn.onclick = ()=>this.tableBeautify.beautifyTables();
        return tblBtn;
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
    // Option 2: Efficient observer with tuned debouncing
    setupObserver() {
        if (this.observer) this.observer.disconnect();
        const root = document.querySelector(TM_SELECTORS.mainContent) || document.body;
        this.observer = new MutationObserver(()=>this.mainEnhancerDebounced());
        this.observer.observe(root, {childList:true, subtree:true});
        this.mainEnhancerDebounced();
    }
    mainEnhancerDebounced() {
        if(this.debTimer) clearTimeout(this.debTimer);
        // Option 2: debounce time tuned to 120ms for better performance
        this.debTimer = setTimeout(()=>this.features.forEach(f=>f.init&&f.init()), 120);
    }
}

// === SPA Navigation Support & Bootstrap ===
const mgr = new TMDevSuiteManager();
window.addEventListener('popstate', () => mgr.init());
window.addEventListener('hashchange', () => mgr.init());
if (document.readyState !== "loading") mgr.init();
else document.addEventListener('DOMContentLoaded', () => mgr.init());

})();
