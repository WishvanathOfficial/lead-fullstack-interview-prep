/* Playground engine: sandboxed code runner, code editor, live HTML preview. No dependencies.
   Runner 1: Web Worker (can be stopped on infinite loops).
   Runner 2: sandboxed iframe with plain <script> elements (works when eval or workers are blocked). */
(function () {
  'use strict';
  var blobUrl = null;

  function workerUrl() {
    if (!blobUrl) {
      var src = 'var HARNESS_LIB=' + window.HARNESS_LIB.toString() + ';var HARNESS=' + window.HARNESS.toString() + ';self.onmessage=function(e){HARNESS(e.data.user,e.data.tests,function(m){self.postMessage(m)})};';
      blobUrl = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
    }
    return blobUrl;
  }

  function scriptSafe(code) { return String(code).replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--'); }

  function runInFrame(user, tests, cb, ms) {
    var f = document.createElement('iframe'), done = false, t;
    f.setAttribute('sandbox', 'allow-scripts');
    f.style.cssText = 'position:absolute;width:0;height:0;border:0;visibility:hidden';
    function finish(r) {
      if (done) return;
      done = true; clearTimeout(t); window.removeEventListener('message', onMsg);
      if (f.parentNode) f.parentNode.removeChild(f);
      cb(r);
    }
    function onMsg(e) { if (e.source === f.contentWindow && e.data && e.data.type) finish(e.data); }
    window.addEventListener('message', onMsg);
    var boot = 'var L=HARNESS_LIB();window.console=L.con;window.test=L.test;window.eq=L.eq;window.ok=L.ok;window.throws=L.throws;window.sameItems=L.sameItems;window.approx=L.approx;window.assert=L.assert;' +
      'window.onerror=function(m,s,l,c,err){if(!L.err)L.err=String(err&&err.name?err.name+": "+err.message:m).replace(/^Uncaught /,"");return true};' +
      'window.addEventListener("unhandledrejection",function(ev){ev.preventDefault&&ev.preventDefault()});';
    f.srcdoc = '<!doctype html><html><body><script>' + scriptSafe('var HARNESS_LIB=' + window.HARNESS_LIB.toString() + ';' + boot) + '<\/script>' +
      '<script>' + scriptSafe(user) + '\n<\/script><script>' + scriptSafe(tests || '') + '\n<\/script>' +
      '<script>L.run(function(m){parent.postMessage(m,"*")})<\/script></body></html>';
    t = setTimeout(function () { finish({ type: 'error', message: 'Time limit exceeded (' + Math.round((ms || 5000) / 1000) + 's). Check for an infinite loop or very slow code.', logs: [] }); }, ms || 5000);
    document.body.appendChild(f);
  }

  var EVAL_BLOCKED = /unsafe-eval|EvalError|Content Security Policy/i;

  function runJS(user, tests, cb, ms) {
    ms = ms || 5000;
    var w, done = false, timer;
    function viaFrame() { runInFrame(user, tests, cb, ms); }
    try { w = new Worker(workerUrl()); } catch (e) { viaFrame(); return; }
    timer = setTimeout(function () { finish({ type: 'error', message: 'Time limit exceeded (' + Math.round(ms / 1000) + 's). Check for an infinite loop or very slow code.', logs: [] }); }, ms);
    function finish(r) {
      if (done) return;
      done = true; clearTimeout(timer); try { w.terminate(); } catch (e) {}
      if (r && r.type === 'error' && EVAL_BLOCKED.test(r.message || '')) { viaFrame(); return; }
      cb(r);
    }
    w.onmessage = function (e) { finish(e.data); };
    w.onerror = function (e) {
      if (e && e.preventDefault) e.preventDefault();
      if (!e || !e.message) { if (done) return; done = true; clearTimeout(timer); try { w.terminate(); } catch (x) {} viaFrame(); return; }
      finish({ type: 'error', message: e.message.replace(/^Uncaught\s*/, ''), logs: [] });
    };
    w.postMessage({ user: user, tests: tests || '' });
  }

  /* Code editor: textarea over a highlighted <pre>. opts: value, lang, highlight(code, lang), onRun, onChange, minRows */
  function editor(host, opts) {
    host.innerHTML = '<div class="ed"><pre class="ed-hl" aria-hidden="true"><code></code></pre><textarea class="ed-ta" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="Code editor"></textarea></div>';
    var ta = host.querySelector('textarea'), code = host.querySelector('code'), pre = host.querySelector('pre');
    pre.style.minHeight = (opts.minRows || 8) * 1.7 + 'em';
    function paint() { code.innerHTML = (opts.highlight ? opts.highlight(ta.value, opts.lang) : ta.value.replace(/&/g, '&amp;').replace(/</g, '&lt;')) + '\n'; }
    ta.value = opts.value || '';
    paint();
    ta.addEventListener('input', function () { paint(); if (opts.onChange) opts.onChange(ta.value); });
    ta.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); if (opts.onRun) opts.onRun(); return; }
      var s = ta.selectionStart, en = ta.selectionEnd, v = ta.value;
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        ta.setRangeText('  ', s, en, 'end');
        ta.dispatchEvent(new Event('input'));
      } else if (e.key === 'Enter') {
        var lineStart = v.lastIndexOf('\n', s - 1) + 1, line = v.slice(lineStart, s), indent = (line.match(/^\s*/) || [''])[0];
        var open = /[{(\[]\s*$/.test(line), nextCh = v.charAt(en), close = open && /[})\]]/.test(nextCh);
        e.preventDefault();
        var ins = '\n' + indent + (open ? '  ' : '') + (close ? '\n' + indent : '');
        ta.setRangeText(ins, s, en, 'end');
        if (close) { var pos = s + 1 + indent.length + 2; ta.setSelectionRange(pos, pos); }
        ta.dispatchEvent(new Event('input'));
      }
    });
    return {
      get: function () { return ta.value; },
      set: function (v) { ta.value = v; paint(); if (opts.onChange) opts.onChange(v); },
      focus: function () { ta.focus(); }
    };
  }

  /* Build a complete HTML document for the preview iframe from separate HTML and CSS source. */
  function buildDoc(html, css) {
    html = html || ''; css = css || '';
    var base = 'html{box-sizing:border-box}*,*:before,*:after{box-sizing:inherit}body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#111}';
    var styleTag = '<style>' + css + '</style>';
    if (/<html[\s>]/i.test(html)) {
      if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, styleTag + '</head>');
      return html + styleTag;
    }
    return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>' + base + '</style>' + styleTag + '</head><body>' + html + '</body></html>';
  }

  window.PG = { runJS: runJS, editor: editor, buildDoc: buildDoc };
})();
