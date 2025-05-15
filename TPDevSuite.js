// ==UserScript==
// @name         TypingMind Dev Suite
// @namespace    https://typingmind.com/
// @version      2.2.1
// @description  Syntax Error Highlight, Code Export (ZIP & Individual), Markdown Table Formatter, Chat Folding—for TypingMind!
// @author       TypingMind User
// @match        *://*/*
// @grant        none
// ==/UserScript==

(() => {
    'use strict';

    // ========== [ STYLES ] ==========
    const CSS = `
  /* Code block action bar */
  .tm-codebar { position: absolute; top: 10px; right: 14px; display: flex; gap: 7px; z-index: 20; }
  .tm-codebtn { background: linear-gradient(90deg,#173bd9,#27c956); color: #fff; border: none; border-radius: 6px; padding: 6px 12px; font-size: 15px; box-shadow: 0 1.5px 4px rgba(24,28,52,0.13); cursor: pointer; opacity: .89; transition: background .14s,opacity .12s; }
  .tm-codebtn[disabled] { opacity: 0.5; cursor:not-allowed; }
  .tm-codebtn:hover { opacity: 1;background: linear-gradient(90deg,#2a64e8,#4ad684);}
  code.tm-syntax-err { background:#362020 !important; box-shadow: 0 0 7px 1.5px #c45d5d94; border: 2px solid #ad3630!important; position: relative; }
  .tm-synerr-badge { position: absolute; top:0; left:0; background: #e23b3b; color: #fff; font-size: 12px; padding: 2px 12px 2px 7px; border-radius: 0 0 8px 0; z-index:80; max-width:210px; white-space:nowrap;overflow-x:auto; box-shadow: 0 1.5px 5px #8c181877; }
  .tm-toast { position: fixed; bottom: 42px; right: 39px; background: #232b44f2; color: #f2f6ff; padding: 18px 33px; font-size: 18px; border-radius: 19px; box-shadow: 0 2px 10px #1117; z-index: 20202; text-align: center; min-width:170px; letter-spacing:0.01em; }
  .tm-floating-bar { position: fixed; left:40px; bottom:44px; display: flex; flex-direction: column; gap: 12px; z-index: 9999; }
  .tm-floating-btn { padding: 13px 28px; font-size: 16px; font-weight: 500; background: linear-gradient(90deg,#0d193e,#27c956); color: #fff; border: none; border-radius: 24px; box-shadow: 0 2px 8px rgba(40,52,100,.20); opacity: 0.96; cursor: pointer; transition: opacity .13s,background .13s; }
  .tm-floating-btn:hover {opacity:1;background: linear-gradient(90deg,#425cff,#27e6ba);}
  .tm-fold-btn { background:#363a4b; color:#e6ecee; border:none;border-radius:6px; padding:1px 10px;font-size:14px; opacity:0.72;cursor:pointer; position: absolute; top: 5px; right: 8px; z-index:110; transition:opacity .13s,background .13s; }
  .tm-fold-btn:hover {opacity:1;background:#405799;}
  .tm-collapsed-wrap { min-height:36px;display:flex; align-items:center; cursor: pointer; color: #60ffec; font-weight: 600; padding:18px 22px; font-size:16px; justify-content:center; }
  .tm-toast + .tm-floating-bar { bottom:88px!important; }
  `;
    if (!document.getElementById('tm-mega-style')) {
        const s = document.createElement('style'); s.id = 'tm-mega-style'; s.innerHTML = CSS; document.head.appendChild(s);
    }

    // ========== [ TOAST / FEEDBACK ] ==========
    function showToast(msg, time = 1500) {
        let old = document.querySelector('.tm-toast'); if (old) old.remove();
        let t = document.createElement('div'); t.className = 'tm-toast'; t.innerHTML = msg; document.body.appendChild(t);
        setTimeout(() => t.remove(), time);
    }

    // ========== [ 1. SYNTAX ERROR HIGHLIGHTER ] ==========
    let skulptLoading = false, skulptReady = false, skulptReadyCbs = [];
    function ensureSkulpt(cb) {
        if (skulptReady) { cb(); return; } 
        if (window.Sk) { 
            skulptReady = true; 
            cb(); 
            return; 
        }
        if (skulptLoading) { 
            skulptReadyCbs.push(cb); 
            return; 
        }
        skulptLoading = true; 
        skulptReadyCbs.push(cb);
        let s = document.createElement('script'); 
        s.src = 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js';
        s.async = true; 
        s.onload = () => {
            skulptReady = true; 
            skulptLoading = false; 
            const currentCallbacks = skulptReadyCbs;
            skulptReadyCbs = []; 
            currentCallbacks.forEach(fn => fn()); 
        };
        s.onerror = () => {
            console.error("TypingMind Dev Suite: Skulpt failed to load from CDN."); 
            skulptLoading = false;
            const loadError = new Error("Skulpt library failed to load. Python syntax highlighting disabled.");
            const currentCallbacks = skulptReadyCbs;
            skulptReadyCbs = [];
            currentCallbacks.forEach(fn => fn(loadError)); 
        };
        document.head.appendChild(s);
    }

    function checkSyntax(codeText, lang, cb) {
        const currentCodeText = String(codeText || ''); 

        if (lang === 'python') {
            ensureSkulpt((err) => { 
                if (err) { 
                    cb(err.message || "Skulpt loading error.");
                    return;
                }
                if (!window.Sk) {
                    cb("Skulpt not initialized. Python syntax check unavailable.");
                    return;
                }
                if (typeof window.Sk.parse !== 'function') {
                    cb("Skulpt.parse method not found. Python syntax check incomplete.");
                    return;
                }
                try {
                    window.Sk.parse('tm_code.py', currentCodeText); 
                    cb(null); 
                } catch (e) {
                    cb(e.message || e.toString()); 
                }
            });
        } else if (lang === 'javascript') {
            try {
                new Function(currentCodeText); cb(null);
            } catch (e) { cb(e.message || e.toString()); }
        } else if (lang === 'json') {
            try {
                const jsonText = currentCodeText.trim() === '' ? '{}' : currentCodeText;
                JSON.parse(jsonText); cb(null); 
            } catch (e) { cb(e.message || e.toString()); }
        } else {
            cb(null); 
        }
    }

    function detectLang(codeElem) {
        let lang = codeElem.className.match(/language-(\w+)/)?.[1] || '';
        if (!lang) {
            const txt = (codeElem.textContent || "").toLowerCase(); // This is the critical line (122)
            if (txt.includes("def ") || txt.includes("import ") || txt.includes("class ")) return 'python';
            if (txt.trim().startsWith("{") && txt.trim().endsWith("}")) return 'json'; 
            if (txt.includes("function") || txt.includes("const ") || txt.includes("let ") || txt.includes("var ") || txt.includes("=>")) return 'javascript';
        }
        return lang;
    }

    function syntaxHighlightBlocks(force = false) {
        document.querySelectorAll('pre > code').forEach(code => {
            if (!force && code.classList.contains('tm-err-checked')) return;
            code.classList.remove('tm-err-checked', 'tm-syntax-err');
            const pre = code.parentElement;
            if (pre) { 
                let b = pre.querySelector('.tm-synerr-badge'); if (b) b.remove();
            }
        });
        setTimeout(() => { 
            document.querySelectorAll('pre > code').forEach(code => {
                if (code.classList.contains('tm-err-checked') && !force) return;
                const lang = detectLang(code);
                if (!lang || !["python", "javascript", "json"].includes(lang)) { 
                    code.classList.add('tm-err-checked'); 
                    return; 
                }
                checkSyntax(code.textContent, lang, function (errMessage) { 
                    code.classList.add('tm-err-checked');
                    const pre = code.parentElement; 
                    if (!pre) return; 
                    
                    let oldb = pre.querySelector('.tm-synerr-badge'); if (oldb) oldb.remove();
                    code.classList.remove('tm-syntax-err'); 

                    if (errMessage) {
                        code.classList.add('tm-syntax-err');
                        let badge = document.createElement("div"); 
                        badge.className = "tm-synerr-badge";
                        badge.title = errMessage; 
                        badge.textContent = "❌ Syntax Error"; 
                        pre.appendChild(badge);
                    }
                });
            });
        }, 150); 
    }

    // ========== [ 2. CODEBLOCK: EXPORT/COPY BTN & BATCH ZIP ] ==========
    function guessFilename(codeElement, usedFilenames) {
        let codeText = (codeElement.innerText || "").trim(); 
        let filename = '';
        let lang = codeElement.className.match(/language-(\w+)/)?.[1] || detectLang(codeElement) || 'txt';
 
        const preElement = codeElement.closest('pre');
        if (preElement) {
            const firstLineOfPre = (preElement.innerText || "").split('\n')[0];
            const fenceMatch = firstLineOfPre.match(/^```[\w#+-]*\s+([-\w.]+)/);
            if (fenceMatch && fenceMatch[1]) {
                filename = fenceMatch[1];
            }
        }
        
        if (!filename) {
            const header = codeText.split('\n').slice(0, 5); 
            for (let line of header) {
                let mm = line.match(/(?:#|\/\/|;)\s*(?:file(?:name)?\s*[:=]?\s*)([-\w.]+)/i);
                if (mm && mm[1]) { filename = mm[1]; break; }
            }
        }
        
        let baseName, currentExt;
        const commonExtensions = { 
            python: 'py', javascript: 'js', typescript: 'ts', json: 'json', 
            bash: 'sh', shell: 'sh', powershell: 'ps1', batch: 'bat', cmd: 'bat', 
            java: 'java', sql: 'sql', cpp: 'cpp', c: 'c', html: 'html', css: 'css', 
            php: 'php', md: 'md', go: 'go', rust: 'rs', ruby: 'rb', yaml: 'yaml', yml: 'yml'
        };

        if (filename) { 
            const dotIndex = filename.lastIndexOf('.');
            if (dotIndex > 0 && dotIndex < filename.length - 1) { 
                baseName = filename.substring(0, dotIndex);
                currentExt = filename.substring(dotIndex);
            } else { 
                baseName = filename.startsWith('.') ? filename : filename.replace(/\.$/, ''); 
                currentExt = '.' + (commonExtensions[lang] || lang || 'txt');
            }
        } else { 
            baseName = `codeblock-${lang}`; 
            currentExt = '.' + (commonExtensions[lang] || 'txt');
        }
        
        if (!currentExt.startsWith('.')) currentExt = '.' + currentExt;

        let finalFilename = baseName + currentExt;
        let counter = 1;
        while (usedFilenames[finalFilename.toLowerCase()]) { 
            finalFilename = `${baseName}_${counter}${currentExt}`;
            counter++;
        }
        usedFilenames[finalFilename.toLowerCase()] = true; 
        return finalFilename;
    }

    function enhanceCodeBlocks() {
        document.querySelectorAll('pre > code').forEach(code => {
            const pre = code.parentElement; if (!pre) return;
            if (pre.classList.contains("tm-has-codebar")) return;
            if (getComputedStyle(pre).position === 'static') pre.style.position = 'relative';
            
            pre.querySelectorAll('.tm-codebar').forEach(el => el.remove());
            
            const bar = document.createElement('div'); bar.className = 'tm-codebar';
            const eBtn = document.createElement('button'); eBtn.className = 'tm-codebtn'; 
            eBtn.innerHTML = '💾'; eBtn.title = 'Export this code as file';
            eBtn.onclick = (ev) => {
                ev.stopPropagation();
                const filename = guessFilename(code, {}); 
                const blob = new Blob([(code.innerText || "").replace(/\n$/, '')], { type: "application/octet-stream" });
                const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename;
                document.body.appendChild(a); a.click();
                setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(a.href); }, 100);
                navigator.clipboard.writeText(filename).catch(err => console.warn("Copy filename to clipboard failed:", err));
                eBtn.innerHTML = "✅"; setTimeout(() => eBtn.innerHTML = "💾", 1150);
                showToast(`<b>${filename}</b> saved & name copied!`);
            };
            bar.appendChild(eBtn);

            const cBtn = document.createElement('button'); cBtn.className = 'tm-codebtn'; 
            cBtn.innerHTML = '📋'; cBtn.title = 'Copy code';
            cBtn.onclick = (ev) => {
                ev.stopPropagation(); 
                navigator.clipboard.writeText((code.innerText || "").trim())
                    .then(() => {
                        cBtn.innerHTML = "✅"; setTimeout(() => cBtn.innerHTML = "📋", 900); 
                        showToast(`Code copied!`);
                    })
                    .catch(err => {
                        console.warn("Copy code to clipboard failed:", err);
                        showToast(`Failed to copy code. See console.`);
                    });
            };
            bar.appendChild(cBtn); 
            pre.appendChild(bar); 
            pre.classList.add("tm-has-codebar");
        });
    }

    let jszipLoading = false; let jszipCallbacks = [];
    function injectZip(cb) {
        if (window.JSZip) { cb(); return; }
        jszipCallbacks.push(cb);
        if (jszipLoading || document.getElementById('tm-jszip-script')) return; 
        jszipLoading = true;
        const s = document.createElement('script'); s.id = 'tm-jszip-script';
        s.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
        s.async = true;
        s.onload = () => { 
            jszipLoading = false; 
            const currentCallbacks = jszipCallbacks; jszipCallbacks = [];
            currentCallbacks.forEach(fn => fn()); 
        };
        s.onerror = (errEvent) => { 
            jszipLoading = false; 
            console.error("TypingMind Dev Suite: JSZip failed to load.", errEvent);
            const loadError = new Error("JSZip library failed to load. Batch export unavailable.");
            showToast(loadError.message, 2500); 
            const currentCallbacks = jszipCallbacks; jszipCallbacks = [];
            currentCallbacks.forEach(fn => fn(loadError));
        };
        document.head.appendChild(s);
    }

    function batchZipExport() {
        const codeBlocks = [...document.querySelectorAll('pre > code')];
        if (!codeBlocks.length) { showToast("No code blocks found.", 1100); return; }
        
        injectZip((err) => { 
            if (err || !window.JSZip) { 
                showToast(err ? err.message : "Error: ZIP library not available.", 2000); 
                return; 
            }
            const zip = new JSZip(); const usedFilenames = {};
            codeBlocks.forEach((code) => {
                const filename = guessFilename(code, usedFilenames);
                zip.file(filename, (code.innerText || "").replace(/\n$/, ''));
            });
            zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } })
                .then((content) => {
                    const a = document.createElement("a"); 
                    a.href = URL.createObjectURL(content); 
                    a.download = "chat-codeblocks.zip";
                    document.body.appendChild(a); a.click();
                    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(a.href); }, 100);
                    showToast(`Exported <b>${codeBlocks.length}</b> files as ZIP<br><span style="font-size:14px;">(chat-codeblocks.zip)</span>`, 2100 + (300 * codeBlocks.length));
                })
                .catch(zipErr => { 
                    console.error("TypingMind Dev Suite: Error generating ZIP:", zipErr); 
                    showToast("Error generating ZIP file. See console.", 2000); 
                });
        });
    }

    // ========== [ 3. MARKDOWN TABLE BEAUTIFIER ] ==========
    function alignTable(txt) {
        const lines = (txt || "").split('\n'); 
        if (!lines.some(l => l.includes('|'))) return txt; 
        
        let tableLines = [], out = [], inTable = false;
        for (let i = 0; i < lines.length; ++i) {
            let line = lines[i].trim(); 
            if (line.includes('|') && (line.startsWith('|') || line.endsWith('|'))) {
                tableLines.push(lines[i]); 
                inTable = true;
            } else {
                if (inTable && tableLines.length >= 2) { 
                    out.push(formatTable(tableLines)); 
                } else if (inTable) { 
                    out.push(...tableLines); 
                }
                tableLines = []; 
                inTable = false; 
                out.push(lines[i]); 
            }
        }
        if (inTable && tableLines.length >= 2) out.push(formatTable(tableLines)); 
        else if (inTable) out.push(...tableLines);
        
        return out.join('\n');
    }

    function formatTable(lines) {
        const rows = lines.map(row => row.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim()));
        const colWidths = [];
        rows.forEach(row => {
            row.forEach((cell, i) => {
                colWidths[i] = Math.max(colWidths[i] || 0, cell.length);
            });
        });

        return rows.map((row, rowIndex) => {
            const isSeparator = rowIndex === 1 && row.every(cell => /^\s*[:\-]{3,}\s*$/.test(cell));
            return '| ' + row.map((cell, i) => {
                if (isSeparator) {
                    let content = '-'.repeat(colWidths[i]);
                    if (cell.startsWith(':') && cell.endsWith(':') && colWidths[i] >= 2) {
                        content = ':' + '-'.repeat(Math.max(1, colWidths[i] - 2)) + ':';
                    } else if (cell.startsWith(':') && colWidths[i] >= 1) {
                        content = ':' + '-'.repeat(Math.max(0, colWidths[i] - 1));
                    } else if (cell.endsWith(':') && colWidths[i] >= 1) {
                        content = '-'.repeat(Math.max(0, colWidths[i] - 1)) + ':';
                    }
                    return content.padEnd(colWidths[i], '-'); 
                }
                return cell.padEnd(colWidths[i], ' ');
            }).join(' | ') + ' |';
        }).join('\n');
    }

    function beautifyMarkdownTables() {
        let beautifiedCount = 0;
        document.querySelectorAll('pre > code').forEach(code => {
            const originalText = code.innerText || "";
            if (originalText.includes('|') && originalText.match(/\|\s*[:\-]+\s*\|/)) {
                const formattedText = alignTable(originalText);
                if (formattedText !== originalText) { 
                    code.innerText = formattedText; 
                    beautifiedCount++; 
                }
            }
        });
        if (beautifiedCount) showToast(`Beautified <b>${beautifiedCount}</b> table(s)!`);
        else showToast('No tables found or tables already beautified.');
    }

    // ========== [ 4. CHAT MESSAGE FOLDING ] ==========
    function addChatFolds() {
        document.querySelectorAll('.chat-message-bubble').forEach(bubble => {
            if (bubble.classList.contains('tm-has-fold') || !bubble.firstChild) return; 
            
            let wrap = bubble.querySelector('.tm-fold-wrap');
            if (!wrap) {
                wrap = document.createElement('div'); wrap.className = 'tm-fold-wrap';
                while (bubble.firstChild) { wrap.appendChild(bubble.firstChild); }
                bubble.appendChild(wrap);
            }

            let btn = bubble.querySelector('.tm-fold-btn');
            if (!btn) {
                btn = document.createElement('button'); 
                btn.className = 'tm-fold-btn'; 
                bubble.insertBefore(btn, wrap); 
            }
            
            let folded = wrap.style.display === 'none'; 
            btn.innerHTML = folded ? '▲' : '▼'; 
            btn.title = folded ? 'Expand message' : 'Collapse message';

            btn.onclick = (ev) => {
                ev.stopPropagation();
                const currentWrap = bubble.querySelector('.tm-fold-wrap'); 
                if (!currentWrap) return;

                let collapsedPlaceholder = bubble.querySelector('.tm-collapsed-wrap');
                folded = !folded; 

                if (folded) {
                    currentWrap.style.display = 'none';
                    if (!collapsedPlaceholder) {
                        collapsedPlaceholder = document.createElement('div'); 
                        collapsedPlaceholder.className = 'tm-collapsed-wrap';
                        collapsedPlaceholder.textContent = '[Message collapsed. Click to expand]';
                        btn.insertAdjacentElement('afterend', collapsedPlaceholder);
                        
                        collapsedPlaceholder.onclick = (e) => { 
                            e.stopPropagation(); 
                            currentWrap.style.display = '';
                            folded = false; 
                            if(collapsedPlaceholder) collapsedPlaceholder.remove();
                            btn.innerHTML = '▼'; btn.title = 'Collapse message';
                        };
                    }
                    btn.innerHTML = '▲'; btn.title = 'Expand message';
                } else { 
                    currentWrap.style.display = '';
                    if (collapsedPlaceholder) collapsedPlaceholder.remove();
                    btn.innerHTML = '▼'; btn.title = 'Collapse message';
                }
            };
            bubble.classList.add('tm-has-fold');
            if (getComputedStyle(bubble).position === 'static') bubble.style.position = 'relative';
        });
    }

    // ========== [ FLOATING BAR ELEMENTS & VISIBILITY LOGIC ] ==========
    let tmFloatingBar = null, tmZipButton = null, tmTableButton = null;
    function initFloatingBar() {
        tmFloatingBar = document.getElementById('tm-mega-floating-bar');

        if (tmFloatingBar) { 
            tmZipButton = tmFloatingBar.querySelector('button[title*="Export all code blocks"]');
            tmTableButton = tmFloatingBar.querySelector('button[title*="Prettify/align all markdown tables"]');
            if (tmZipButton && tmTableButton) return; 
            tmFloatingBar.innerHTML = ''; 
        } else { 
            tmFloatingBar = document.createElement('div'); 
            tmFloatingBar.id = 'tm-mega-floating-bar';
            tmFloatingBar.className = 'tm-floating-bar'; 
            document.body.appendChild(tmFloatingBar); 
        }
        tmFloatingBar.style.display = 'none'; 

        tmZipButton = document.createElement('button'); 
        tmZipButton.className = 'tm-floating-btn';
        tmZipButton.innerHTML = '🗜️ Batch Code ZIP'; 
        tmZipButton.title = 'Export all code blocks in chat as a ZIP file';
        tmZipButton.onclick = batchZipExport; 
        tmFloatingBar.appendChild(tmZipButton);

        tmTableButton = document.createElement('button'); 
        tmTableButton.className = 'tm-floating-btn';
        tmTableButton.innerHTML = '📐 Beautify Tables'; 
        tmTableButton.title = 'Prettify/align all markdown tables';
        tmTableButton.onclick = beautifyMarkdownTables; 
        tmFloatingBar.appendChild(tmTableButton);
    }

    function updateFloatingButtonsVisibility() {
        if (!tmFloatingBar || !tmZipButton || !tmTableButton) {
            initFloatingBar(); 
            if (!tmFloatingBar || !tmZipButton || !tmTableButton) { 
                console.warn('TypingMind Dev Suite: Floating bar elements critically missing after re-initialization attempt.'); 
                return; 
            }
        }
        
        const isInChatContext = document.querySelector('.chat-message-bubble') !== null || 
                                document.querySelector('[class*="ConversationDetail_conversationWrapper"]') !== null; 
                                
        if (!isInChatContext) { 
            tmFloatingBar.style.display = 'none'; 
            return; 
        }

        const codeBlocks = document.querySelectorAll('pre > code');
        const hasCodeBlocks = codeBlocks.length > 0;
        tmZipButton.style.display = hasCodeBlocks ? 'block' : 'none';
        
        let hasTables = false;
        if (hasCodeBlocks) {
            for (const code of codeBlocks) {
                const text = code.innerText || "";
                if (text.includes('|') && text.match(/\|\s*[:\-]+\s*\|/)) { 
                    hasTables = true; 
                    break; 
                }
            }
        }
        tmTableButton.style.display = hasTables ? 'block' : 'none';
        
        tmFloatingBar.style.display = (tmZipButton.style.display !== 'none' || tmTableButton.style.display !== 'none') ? 'flex' : 'none';
    }

    // ========== [ 5. MASTER OBSERVER (DYNAMIC UI)] ==========
    let obsTimeout = null; 
    const DEBOUNCE_DELAY = 250; 

    function mainEnhance() {
        syntaxHighlightBlocks(); 
        enhanceCodeBlocks(); 
        addChatFolds(); 
        updateFloatingButtonsVisibility(); 
    }

    function observerCb(mutationsList, observer) { 
        if (obsTimeout) clearTimeout(obsTimeout); 
        obsTimeout = setTimeout(mainEnhance, DEBOUNCE_DELAY); 
    }

    function runMainEnhancer() {
        initFloatingBar();    
        mainEnhance();        

        const targetNode = document.querySelector("#app") || 
                           document.querySelector(".main-content-area") || 
                           document.body; 
                           
        const observerConfig = { childList: true, subtree: true };
        const observer = new MutationObserver(observerCb);
        observer.observe(targetNode, observerConfig);

        window.addEventListener('popstate', mainEnhance);
    }

    // ========== [ RUN ] ==========
    if (document.readyState === "complete" || document.readyState === "interactive") {
        runMainEnhancer();
    } else {
        document.addEventListener('DOMContentLoaded', runMainEnhancer);
    }

})();
