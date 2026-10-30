/* Interview Roadmap — vanilla JS study app. No dependencies. */
(function () {
  'use strict';

  var ORDER = ['htmlcss', 'javascript', 'typescript', 'dsa', 'react', 'testing', 'node', 'database', 'system', 'deployment', 'ai', 'leader'];
  var ICONS = {
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    doc: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
    code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>',
    braces: '<path d="M8 4c-2 0-3 1-3 3v2c0 1-1 2-2 3 1 1 2 2 2 3v2c0 2 1 3 3 3M16 4c2 0 3 1 3 3v2c0 1 1 2 2 3-1 1-2 2-2 3v2c0 2-1 3-3 3"/>',
    atom: '<circle cx="12" cy="12" r="1.8"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
    hex: '<path d="M12 2.5 20.5 7.2v9.6L12 21.5 3.5 16.8V7.2z"/><path d="M12 8v8M8.5 10l7 4"/>',
    db: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    cloud: '<path d="M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9.5 4.3 4.3 0 0 1 17.5 18z"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z"/>',
    home: '<path d="M3 11 12 4l9 7M5 10v10h14V10"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'
  };
  var COL = { javascript: '#f7c948', typescript: '#4f9cff', react: '#22d3ee', node: '#4ade80', database: '#fb923c', deployment: '#a78bfa', ai: '#f472b6', dsa: '#f87171', system: '#2dd4bf', htmlcss: '#e879f9', testing: '#a3e635', leader: '#fdba74' };
  function animateCounts() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    $$('[data-count]').forEach(function (el) {
      var to = +el.getAttribute('data-count'), t0 = null;
      if (reduce || !window.requestAnimationFrame) { el.textContent = to; return; }
      (function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / 900), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * e);
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    });
  }
  var typerTimer = null;
  function startTyper() {
    clearTimeout(typerTimer);
    var el = document.getElementById('typer');
    if (!el) return;
    var words = ['closures & the event loop', 'React hooks & performance', 'Node.js REST APIs', 'MySQL query tuning', 'Sequelize transactions', 'CI/CD pipelines on AWS', 'AI-assisted engineering'], w = 0, c = 0, del = false;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = words[0]; return; }
    (function tick() {
      var el2 = document.getElementById('typer');
      if (!el2) return;
      var word = words[w];
      c += del ? -1 : 1;
      el2.textContent = word.slice(0, c);
      var d = del ? 28 : 65;
      if (!del && c === word.length) { del = true; d = 1400; }
      else if (del && c === 0) { del = false; w = (w + 1) % words.length; d = 350; }
      typerTimer = setTimeout(tick, d);
    })();
  }
  function tiltCard() {
    var card = document.querySelector('.hero-prog'), hero = document.querySelector('.hero');
    if (!card || !hero) return;
    hero.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect(), x = (e.clientX - (r.left + r.width / 2)) / 40, y = (e.clientY - (r.top + r.height / 2)) / 40;
      card.style.transform = 'perspective(700px) rotateY(' + Math.max(-9, Math.min(9, x)) + 'deg) rotateX(' + Math.max(-9, Math.min(9, -y)) + 'deg)';
    });
    hero.addEventListener('mouseleave', function () { card.style.transform = ''; });
  }
  function icon(name) { return '<svg viewBox="0 0 24 24" class="ic">' + (ICONS[name] || ICONS.code) + '</svg>'; }

  /* ---------- state ---------- */
  var KEY = 'prep-roadmap-v1', state = {};
  try { state = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { state = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  /* ---------- helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function pct(a, b) { return b ? Math.round((a / b) * 100) : 0; }
  function toast(m) { var t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove('show'); }, 1800); }

  /* ---------- syntax highlight ---------- */
  var JS_KW = 'const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|extends|implements|import|export|from|default|async|await|try|catch|finally|throw|typeof|instanceof|in|of|this|super|null|undefined|true|false|yield|delete|void|static|interface|type|enum|public|private|protected|readonly|abstract|as|keyof|never|unknown|any|string|number|boolean|object|namespace|declare|satisfies|infer|is|asserts|get|set|constructor|module|require';
  var SQL_KW = 'SELECT|FROM|WHERE|AND|OR|NOT|IN|IS|NULL|JOIN|LEFT|RIGHT|INNER|OUTER|FULL|CROSS|ON|AS|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|INDEX|UNIQUE|PRIMARY|KEY|FOREIGN|REFERENCES|ALTER|ADD|DROP|DISTINCT|UNION|ALL|EXISTS|CASE|WHEN|THEN|ELSE|END|WITH|OVER|PARTITION|BEGIN|COMMIT|ROLLBACK|START|TRANSACTION|DEFAULT|AUTO_INCREMENT|ENGINE|CONSTRAINT|CHECK|EXPLAIN|ANALYZE|FOR|LIKE|BETWEEN|ASC|DESC|COUNT|SUM|AVG|MIN|MAX|INT|BIGINT|VARCHAR|TEXT|DATETIME|TIMESTAMP|BOOLEAN|DECIMAL|JSON|USE|SHOW|DATABASE|VIEW|TRIGGER|PROCEDURE|LOCK|SHARE|MODE|SKIP|LOCKED|NOWAIT|RECURSIVE';
  var SH_KW = 'if|then|else|elif|fi|for|do|done|while|case|esac|function|echo|export|cd|sudo|npm|npx|node|git|docker|aws|kubectl|curl|mkdir|cp|mv|rm|cat|chmod|FROM|RUN|CMD|COPY|WORKDIR|EXPOSE|ENV|ARG|ENTRYPOINT|USER|ADD|AS|name|on|jobs|steps|uses|with|runs-on|run|env|needs|stages|stage|stage|pipeline|agent|sh';

  function tokenize(code, re, classes) {
    var out = '', last = 0, m, i, cls;
    re.lastIndex = 0;
    while ((m = re.exec(code))) {
      out += esc(code.slice(last, m.index));
      cls = null;
      for (i = 1; i <= classes.length; i++) { if (m[i] !== undefined) { cls = classes[i - 1]; break; } }
      out += '<span class="' + cls + '">' + esc(m[0]) + '</span>';
      last = m.index + m[0].length;
      if (m[0].length === 0) re.lastIndex++;
    }
    return out + esc(code.slice(last));
  }
  var STR = /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`/;
  var NUM = /\b\d+(?:\.\d+)?\b/;
  var FN = /\b[A-Za-z_$][\w$]*(?=\()/;
  var RE_JS = new RegExp('(' + /\/\/[^\n]*|\/\*[\s\S]*?\*\//.source + ')|(' + STR.source + ')|(\\b(?:' + JS_KW + ')\\b)|(' + NUM.source + ')|(' + FN.source + ')', 'g');
  var RE_JSON = new RegExp('(\\b\\B)|(' + /"(?:\\.|[^"\\\n])*"/.source + ')|(\\b(?:true|false|null)\\b)|(' + NUM.source + ')', 'g');
  var RE_SQL = new RegExp('(' + /--[^\n]*|\/\*[\s\S]*?\*\//.source + ')|(' + /'(?:''|[^'])*'/.source + ')|(\\b(?:' + SQL_KW + ')\\b)|(' + NUM.source + ')|(' + FN.source + ')', 'gi');
  var RE_SH = new RegExp('(' + /#[^\n]*/.source + ')|(' + STR.source + ')|(\\b(?:' + SH_KW + ')\\b)|(' + NUM.source + ')|(\\b\\B)', 'g');
  var RE_HTML = /(<!--[\s\S]*?-->)|(<\/?[a-zA-Z][\w:-]*)|("[^"\n]*"|'[^'\n]*')|([\w:-]+(?==))|(\/?>)/g;
  var RE_CSS = /(\/\*[\s\S]*?\*\/)|("[^"\n]*"|'[^'\n]*')|(@[a-zA-Z-]+|#[0-9a-fA-F]{3,8}\b)|(-?\d*\.?\d+(?:px|rem|em|%|vh|vw|vmin|vmax|fr|ch|s|ms|deg)?\b)|([a-zA-Z-]+(?=\s*:(?!:)))/g;
  function highlight(code, lang) {
    lang = (lang || '').toLowerCase();
    var cl = ['tc', 'ts', 'tk', 'tn', 'tf'];
    if (lang === 'html' || lang === 'xml' || lang === 'svg') return tokenize(code, RE_HTML, ['tc', 'tk', 'ts', 'tf', 'tk']);
    if (lang === 'css' || lang === 'scss' || lang === 'sass') return tokenize(code, RE_CSS, ['tc', 'ts', 'tk', 'tn', 'tf']);
    if (/^(js|javascript|jsx|ts|typescript|tsx|node)$/.test(lang)) return tokenize(code, RE_JS, cl);
    if (lang === 'json') return tokenize(code, RE_JSON, cl);
    if (lang === 'sql') return tokenize(code, RE_SQL, cl);
    if (/^(bash|sh|shell|yaml|yml|dockerfile|groovy|env|text|http)$/.test(lang)) return tokenize(code, RE_SH, cl);
    return esc(code);
  }
  function codeBlock(code, lang) {
    return '<div class="code"><div class="code-h"><span>' + esc(lang || 'code') + '</span><button type="button" data-copy>Copy</button></div><pre><code>' + highlight(code, lang) + '</code></pre></div>';
  }

  /* ---------- tiny markdown ---------- */
  function inline(t) {
    var codes = [];
    t = t.replace(/`([^`]+)`/g, function (_, c) { codes.push('<code>' + esc(c) + '</code>'); return '\u0000' + (codes.length - 1) + '\u0000'; });
    t = esc(t);
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
    t = t.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    return t.replace(/\u0000(\d+)\u0000/g, function (_, i) { return codes[+i]; });
  }
  var LIST_RE = /^\s*([-*]|\d+\.)\s+/;
  function renderList(lines) {
    var ordered = /^\s*\d+\./.test(lines[0]), items = [];
    lines.forEach(function (l) {
      var m = l.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
      if (m) {
        if (m[1].length >= 2 && items.length) items[items.length - 1].sub.push(m[3]);
        else items.push({ t: m[3], sub: [] });
      } else if (items.length) {
        var it = items[items.length - 1];
        if (it.sub.length) it.sub[it.sub.length - 1] += ' ' + l.trim(); else it.t += ' ' + l.trim();
      }
    });
    var tag = ordered ? 'ol' : 'ul';
    return '<' + tag + '>' + items.map(function (it) {
      return '<li>' + inline(it.t) + (it.sub.length ? '<ul>' + it.sub.map(function (s) { return '<li>' + inline(s) + '</li>'; }).join('') + '</ul>' : '') + '</li>';
    }).join('') + '</' + tag + '>';
  }
  function renderTable(lines) {
    var rows = lines.map(function (l) { return l.replace(/^\||\|$/g, '').split('|').map(function (c) { return c.trim(); }); });
    var head = rows[0], body = rows.slice(2);
    return '<table><thead><tr>' + head.map(function (c) { return '<th>' + inline(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      body.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + inline(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>';
  }
  function md(src) {
    var lines = src.replace(/\s+$/, '').split('\n'), out = [], i = 0, n = lines.length, l;
    function special(x) { return /^```/.test(x) || /^#{3,5} /.test(x) || LIST_RE.test(x) || /^\|/.test(x) || /^> ?/.test(x) || /^---+$/.test(x); }
    while (i < n) {
      l = lines[i];
      if (/^```/.test(l)) {
        var lang = l.slice(3).trim(), buf = [];
        i++;
        while (i < n && !/^```/.test(lines[i])) { buf.push(lines[i]); i++; }
        i++;
        out.push(codeBlock(buf.join('\n'), lang));
      } else if (/^\s*$/.test(l)) { i++; }
      else if (/^#{3,5} /.test(l)) { out.push('<h4>' + inline(l.replace(/^#+\s*/, '')) + '</h4>'); i++; }
      else if (/^---+$/.test(l)) { out.push('<hr>'); i++; }
      else if (/^\|/.test(l)) {
        var tb = [];
        while (i < n && /^\|/.test(lines[i])) { tb.push(lines[i]); i++; }
        out.push(renderTable(tb));
      } else if (/^>/.test(l)) {
        var q = [];
        while (i < n && /^>/.test(lines[i])) { q.push(lines[i].replace(/^>\s?/, '')); i++; }
        out.push('<blockquote><p>' + q.map(inline).join('<br>') + '</p></blockquote>');
      } else if (LIST_RE.test(l)) {
        var li = [];
        while (i < n && (LIST_RE.test(lines[i]) || (/^\s+\S/.test(lines[i]) && li.length))) { li.push(lines[i]); i++; }
        out.push(renderList(li));
      } else {
        var p = [];
        while (i < n && !/^\s*$/.test(lines[i]) && !(p.length && special(lines[i]))) { p.push(lines[i]); i++; }
        out.push('<p>' + inline(p.join(' ')) + '</p>');
      }
    }
    return out.join('');
  }

  /* ---------- content parsing ---------- */
  function clean(raw) { return String(raw || '').replace(/\r\n/g, '\n').replace(/¦/g, '`').replace(/§\{/g, '${'); }
  function sections(text) {
    var parts = text.split(/^## /m), head = parts.shift(), map = {}, meta = {};
    head.split('\n').forEach(function (l) {
      var m = l.match(/^@(\w+)\s+(.*)$/);
      if (m) meta[m[1]] = m[2].trim();
    });
    parts.forEach(function (sec) {
      var nl = sec.indexOf('\n');
      map[sec.slice(0, nl).trim().toUpperCase()] = sec.slice(nl + 1);
    });
    return { meta: meta, map: map };
  }
  function blocks(body) {
    return (body || '').split(/^### /m).slice(1).map(function (b) {
      var nl = b.indexOf('\n');
      return { title: (nl < 0 ? b : b.slice(0, nl)).trim(), body: nl < 0 ? '' : b.slice(nl + 1).trim() };
    });
  }
  function fenceCode(text, lang) {
    var m = new RegExp('^```(?:' + (lang || '[a-z]*') + ')[ \\t]*\\n([\\s\\S]*?)^```', 'm').exec(text || '');
    return m ? m[1].replace(/\s+$/, '') : '';
  }
  function allFences(text, lang) {
    var re = new RegExp('^```(?:' + lang + ')[ \\t]*\\n([\\s\\S]*?)^```', 'gm'), out = [], m;
    while ((m = re.exec(text || ''))) out.push(m[1].replace(/\s+$/, ''));
    return out.join('\n\n');
  }
  function parseSubject(id) {
    var parsed = sections(clean(window.PREP && window.PREP[id]));
    var s = { id: id, title: parsed.meta.title || id, icon: parsed.meta.icon || 'code', tagline: parsed.meta.tagline || '',
      resume: (parsed.meta.resume || '').split('|').map(function (x) { return x.trim(); }).filter(Boolean),
      phases: [], qa: [], ex: [], sc: [], topics: 0 };
    var idx = 0;
    blocks(parsed.map.ROADMAP).forEach(function (b) {
      var ph = { title: b.title, items: [] };
      b.body.split('\n').forEach(function (l) {
        var m = l.match(/^- (.*)$/);
        if (!m) return;
        var parts = m[1].split(' :: ');
        ph.items.push({ i: idx++, t: parts[0].trim(), n: (parts[1] || '').trim() });
      });
      s.phases.push(ph);
    });
    s.topics = idx;
    s.qa = blocks(parsed.map.QA).map(function (b, i) {
      var m = b.title.match(/^\[(basic|intermediate|advanced)\]\s*(.*)$/i);
      return { i: i, level: m ? m[1].toLowerCase() : 'intermediate', q: m ? m[2] : b.title, a: b.body };
    });
    s.ex = blocks(parsed.map.EXERCISES).map(function (b, i) {
      var m = b.title.match(/^\[(basic|intermediate|advanced)\]\s*(.*)$/i);
      var halves = b.body.split(/^--- (solution|starter|tests) ---$/m), prompt = halves[0], hint = '', parts = {};
      for (var hi = 1; hi < halves.length; hi += 2) parts[halves[hi]] = (halves[hi + 1] || '').trim();
      prompt = prompt.replace(/^> Hint:\s*(.*)$/m, function (_, h) { hint = h; return ''; });
      return { i: i, level: m ? m[1].toLowerCase() : 'intermediate', t: m ? m[2] : b.title, p: prompt.trim(), hint: hint, s: parts.solution || '', starter: fenceCode(parts.starter), tests: fenceCode(parts.tests) };
    });
    s.sc = blocks(parsed.map.SCENARIOS).map(function (b, i) { return { i: i, q: b.title, a: b.body }; });
    return s;
  }
  function parsePlan() {
    var parsed = sections(clean(window.PREP && window.PREP.plan));
    return {
      meta: parsed.meta,
      weeks: blocks(parsed.map.PLAN),
      playbook: blocks(parsed.map.PLAYBOOK),
      star: blocks(parsed.map.STAR)
    };
  }
  function parseNotes(id) {
    var raw = clean(window.PREP_NOTES && window.PREP_NOTES[id]), groups = [], idx = 0;
    if (!raw) return { groups: [], count: 0 };
    raw.split(/^## /m).slice(1).forEach(function (g) {
      var nl = g.indexOf('\n'), grp = { title: g.slice(0, nl).trim(), notes: [] };
      blocks(g.slice(nl + 1)).forEach(function (b) { grp.notes.push({ i: idx++, t: b.title, b: b.body }); });
      groups.push(grp);
    });
    return { groups: groups, count: idx };
  }
  var SUBJECTS = {}, PLAN = null;
  ORDER.forEach(function (id) { if (window.PREP && window.PREP[id]) { SUBJECTS[id] = parseSubject(id); SUBJECTS[id].notes = parseNotes(id); } });
  PLAN = parsePlan();
  var IDS = ORDER.filter(function (id) { return SUBJECTS[id]; });

  /* ---------- progress ---------- */
  function done(k) { return !!state[k]; }
  function subjectCounts(s) {
    var total = s.topics + s.qa.length + s.ex.length + s.notes.count, d = 0, i;
    for (i = 0; i < s.notes.count; i++) if (done(s.id + ':n:' + i)) d++;
    for (i = 0; i < s.topics; i++) if (done(s.id + ':r:' + i)) d++;
    for (i = 0; i < s.qa.length; i++) if (done(s.id + ':q:' + i)) d++;
    for (i = 0; i < s.ex.length; i++) if (done(s.id + ':e:' + i)) d++;
    return { total: total, done: d, pct: pct(d, total) };
  }
  function overall() {
    var t = 0, d = 0;
    IDS.forEach(function (id) { var c = subjectCounts(SUBJECTS[id]); t += c.total; d += c.done; });
    return { total: t, done: d, pct: pct(d, t) };
  }

  /* ---------- chrome ---------- */
  var route = { page: 'home', id: null, tab: 'roadmap', open: null };
  function renderNav() {
    var h = '<a class="nav-a' + (route.page === 'home' ? ' on' : '') + '" href="#/">' + icon('home') + '<span class="t">Dashboard</span></a>';
    h += '<div class="nav-h">Subjects</div>';
    IDS.forEach(function (id) {
      var s = SUBJECTS[id], c = subjectCounts(s);
      h += '<a class="nav-a' + (route.page === 'subject' && route.id === id ? ' on' : '') + '" style="--c:' + COL[id] + '" href="#/' + id + '">' + icon(s.icon) + '<span class="t">' + esc(s.title) + '</span><span class="pc">' + c.pct + '%</span></a>';
    });
    h += '<div class="nav-h">Tools</div><a class="nav-a' + (route.page === 'review' ? ' on' : '') + '" href="#/review">' + icon('users') + '<span class="t">Mock interview</span></a><a class="nav-a' + (route.page === 'playground' ? ' on' : '') + '" href="#/playground">' + icon('code') + '<span class="t">Code playground</span></a>';
    h += '<div class="nav-h">Plan</div><a class="nav-a' + (route.page === 'plan' ? ' on' : '') + '" href="#/plan">' + icon('cal') + '<span class="t">Study plan &amp; playbook</span></a>';
    $('#nav').innerHTML = h;
  }
  function updateChrome() {
    renderNav();
    var o = overall();
    $('#overall').textContent = o.pct + '% complete';
    $('#bar').style.width = o.pct + '%';
  }

  /* ---------- views ---------- */
  var RESUME_MAP = [
    ['Reusable React component library (~35% faster screens)', 'react', 'roadmap'],
    ['Code-splitting, caching and 30–40% faster pages/APIs', 'react', 'qa'],
    ['Node.js / Express REST APIs for the Clinical Learning Hub', 'node', 'roadmap'],
    ['MySQL / PostgreSQL queries and optimisation', 'database', 'qa'],
    ['Sequelize ORM in production code', 'database', 'practice'],
    ['TypeScript across frontend and backend', 'typescript', 'roadmap'],
    ['AWS, CodePipeline, Jenkins, Octopus, Heroku', 'deployment', 'roadmap'],
    ['Copilot, ChatGPT, Claude, Codex and agentic workflows', 'ai', 'roadmap'],
    ['Architecture of a scalable healthcare learning platform', 'system', 'roadmap'],
    ['Efficient code: search, sorting, pagination, caching', 'dsa', 'practice'],
    ['Leading 8–10 engineers, code reviews, estimation', 'react', 'scenarios']
  ];
  function ringSvg(p) {
    var r = 54, c = 2 * Math.PI * r;
    return '<div class="ring"><svg viewBox="0 0 132 132"><defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#818cf8"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs><circle class="bg" cx="66" cy="66" r="' + r + '"/><circle class="fg" cx="66" cy="66" r="' + r + '" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - p / 100)).toFixed(1) + '"/></svg><b>' + p + '%</b></div>';
  }
  function viewHome() {
    var o = overall(), qs = 0, ex = 0, tp = 0, nt = 0;
    IDS.forEach(function (id) { qs += SUBJECTS[id].qa.length; ex += SUBJECTS[id].ex.length; tp += SUBJECTS[id].topics; nt += SUBJECTS[id].notes.count; });
    var h = '<div class="hero"><div class="syms" aria-hidden="true"><i>{ }</i><i>&lt;/&gt;</i><i>=&gt;</i><i>[ ]</i><i>async</i><i>SELECT</i><i>npm</i><i>( )</i></div><div class="hero-in"><div class="eyebrow"><i class="dot"></i>Interview roadmap · 8–12 weeks</div><h1>Crack the <span class="hl">Lead Full Stack</span> interview</h1>' +
      '<div class="typer-line">Now mastering <b id="typer" class="typer"></b><span class="caret"></span></div>' +
      '<p class="lead">Twelve subjects, from your resume plus HTML &amp; CSS, DSA, system design, testing and leadership, ordered basic → advanced. Every topic has practical notes, real interview questions with answers, code exercises with solutions and scenarios from your own projects.</p>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px"><a class="btn p" href="#/javascript">Start with JavaScript</a><a class="btn" href="#/plan">Open the 12-week plan</a><a class="btn" href="#/review">Mock interview</a>' + (state._last ? '<a class="btn" href="' + esc(state._last.h) + '">Continue: ' + esc(state._last.t) + '</a>' : '') + '</div></div>' +
      '<div class="hero-prog">' + ringSvg(o.pct) + '<div class="hp-t"><b>Your progress</b><span>' + o.done + ' of ' + o.total + ' items done</span></div></div></div>';
    h += '<div class="stats">' + [[nt, 'Study notes', '#818cf8'], [tp, 'Roadmap topics', '#22d3ee'], [qs, 'Interview Q&amp;A', '#f472b6'], [ex, 'Code exercises', '#fbbf24']].map(function (s, i) {
      return '<div class="stat" style="--c:' + s[2] + ';--i:' + i + '"><b data-count="' + s[0] + '">0</b><span>' + s[1] + '</span></div>';
    }).join('') + '</div>';
    h += '<div class="search">' + icon('code').replace('<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>', '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>') + '<input id="gsearch" type="search" placeholder="Search all ' + qs + ' questions and ' + nt + ' notes (press / to focus)" aria-label="Search interview questions"></div><div class="results" id="gres"></div>';
    h += dashExtras();
    h += '<h2 class="sec">Subjects</h2><div class="grid">';
    IDS.forEach(function (id, ix) {
      var s = SUBJECTS[id], c = subjectCounts(s);
      h += '<a class="card sub" style="--c:' + COL[id] + ';--i:' + ix + '" href="#/' + id + '"><div class="ico">' + icon(s.icon) + '</div><h3>' + esc(s.title) + '</h3><p>' + esc(s.tagline) + '</p>' +
        '<div class="prog"><i style="width:' + c.pct + '%"></i></div><div class="meta"><span>' + s.notes.count + ' notes · ' + s.topics + ' topics · ' + s.qa.length + ' Q&amp;A · ' + s.ex.length + ' exercises</span><span>' + c.pct + '%</span></div></a>';
    });
    h += '</div><h2 class="sec">How to use this</h2><div class="card steps">' +
      '<div class="step"><b>1</b><p><strong>Follow the roadmap.</strong> Tick topics only when you can explain them aloud without notes.</p></div>' +
      '<div class="step"><b>2</b><p><strong>Drill the Q&amp;A.</strong> Read the question, answer out loud, then open the answer and mark it revised.</p></div>' +
      '<div class="step"><b>3</b><p><strong>Code the exercises.</strong> Attempt before opening the hint or solution. Type, do not copy.</p></div></div>';
    h += '<h2 class="sec">Your resume → what to prepare</h2><div class="card tw"><table class="map"><thead><tr><th>Resume claim</th><th>Prepare in</th></tr></thead><tbody>';
    RESUME_MAP.forEach(function (r) {
      if (!SUBJECTS[r[1]]) return;
      h += '<tr><td>' + esc(r[0]) + '</td><td><a href="#/' + r[1] + '/' + r[2] + '">' + esc(SUBJECTS[r[1]].title) + ' · ' + r[2] + '</a></td></tr>';
    });
    h += '</tbody></table></div><p class="lead" style="margin-top:18px">' + tp + ' topics · ' + qs + ' questions · ' + ex + ' exercises in total.</p>';
    return h;
  }

  function topicRow(s, it) {
    var k = s.id + ':r:' + it.i, on = done(k);
    return '<div class="topic' + (on ? ' done' : '') + '"><label class="chk"><input type="checkbox" data-k="' + k + '"' + (on ? ' checked' : '') + ' aria-label="Mark done"></label><div><b>' + inline(it.t) + '</b>' + (it.n ? '<span>' + inline(it.n) + '</span>' : '') + '</div></div>';
  }
  function tabRoadmap(s) {
    return s.phases.map(function (ph) {
      var d = ph.items.filter(function (it) { return done(s.id + ':r:' + it.i); }).length;
      return '<div class="card phase"><div class="phase-h"><h3>' + esc(ph.title) + '</h3><span class="n">' + d + '/' + ph.items.length + '</span></div>' + ph.items.map(function (it) { return topicRow(s, it); }).join('') + '</div>';
    }).join('');
  }
  function tabNotes(s) {
    if (!s.notes.count) return '<div class="empty">Study notes for this subject are coming soon.</div>';
    var h = '<p class="lead" style="margin-bottom:14px">Read the notes in order, one group per sitting. Each note has the idea in one line, an analogy, how it works, code, a memory trick and the interview angle. Tick it when you can explain it without looking.</p>';
    h += '<div class="tools"><div class="chips" style="margin:0;flex:1">' + s.notes.groups.map(function (g, gi) { return '<button type="button" class="fchip" data-jump="ng-' + gi + '">' + esc(g.title.split('·')[0].trim()) + '</button>'; }).join('') + '</div><button class="fchip" id="nexpand" type="button">Expand all</button></div><div id="nlist">';
    s.notes.groups.forEach(function (g, gi) {
      h += '<h2 class="sec" id="ng-' + gi + '">' + esc(g.title) + '</h2>';
      g.notes.forEach(function (n) {
        var k = s.id + ':n:' + n.i;
        h += '<div class="q" id="n-' + n.i + '"><label class="chk" title="Mark as studied"><input type="checkbox" data-k="' + k + '"' + (done(k) ? ' checked' : '') + ' aria-label="Mark studied"></label>' +
          '<details><summary><span class="badge basic">Note ' + (n.i + 1) + '</span><span class="qt">' + inline(n.t) + '</span></summary><div class="body note">' + md(n.b) + '</div></details></div>';
      });
    });
    return h + '</div>';
  }
  function tabQA(s) {
    var h = '<div class="tools"><button class="fchip on" data-f="all" type="button">All</button><button class="fchip" data-f="basic" type="button">Basic</button><button class="fchip" data-f="intermediate" type="button">Intermediate</button><button class="fchip" data-f="advanced" type="button">Advanced</button><button class="fchip" data-f="todo" type="button">Not revised</button>' +
      '<div class="search" style="margin:0;flex:1;min-width:200px;padding:8px 14px"><input id="qsearch" type="search" placeholder="Filter questions…" aria-label="Filter questions"></div><button class="fchip" id="expand" type="button">Expand all</button></div><div id="qlist">';
    s.qa.forEach(function (q) {
      var k = s.id + ':q:' + q.i;
      h += '<div class="q" id="q-' + q.i + '" data-level="' + q.level + '" data-done="' + (done(k) ? 1 : 0) + '" data-text="' + esc(q.q.toLowerCase()) + '"><label class="chk" title="Mark as revised"><input type="checkbox" data-k="' + k + '"' + (done(k) ? ' checked' : '') + ' aria-label="Mark revised"></label>' +
        '<details><summary><span class="badge ' + q.level + '">' + q.level + '</span><span class="qt">' + inline(q.q) + '</span></summary><div class="body">' + md(q.a) + rateBar(s.id, q.i) + '</div></details></div>';
    });
    return h + '</div><div class="empty" id="qempty" hidden>No questions match.</div>';
  }
  function exKind(s, e) {
    if (e.tests && e.starter) return 'js';
    if (s.id === 'htmlcss' && (/```(html|css)/.test(e.s) || /```(html|css)/.test(e.p))) return 'web';
    return '';
  }
  function tabPractice(s) {
    if (!s.ex.length) return '<div class="empty">No exercises for this subject.</div>';
    return s.ex.map(function (e) {
      var k = s.id + ':e:' + e.i, kind = exKind(s, e);
      return '<div class="card ex"><div class="ex-h"><span class="badge ' + e.level + '">' + e.level + '</span><h3>' + inline(e.t) + '</h3>' + (kind ? '<span class="runtag">' + (kind === 'js' ? 'Runnable' : 'Live preview') + '</span>' : '') + '<label class="chk" title="Mark solved"><input type="checkbox" data-k="' + k + '"' + (done(k) ? ' checked' : '') + ' aria-label="Mark solved"></label></div>' +
        '<div class="pr">' + md(e.p) + '</div>' +
        (e.hint ? '<details class="hint"><summary>Hint</summary><p style="margin-top:8px">' + inline(e.hint) + '</p></details>' : '') +
        (kind ? '<details class="try" data-kind="' + kind + '" data-sid="' + s.id + '" data-i="' + e.i + '"><summary>' + (kind === 'js' ? 'Try it: write code and run the tests' : 'Try it: code with a live preview') + '</summary><div class="try-body"></div></details>' : '') +
        '<details class="sol"><summary>Show solution</summary><div class="body">' + md(e.s) + '</div></details></div>';
    }).join('');
  }
  function tabScenarios(s) {
    if (!s.sc.length) return '<div class="empty">No scenarios for this subject.</div>';
    return '<p class="lead" style="margin-bottom:16px">Answer these using real examples from your projects. Use the structure: context → what you did → trade-off → result.</p>' +
      s.sc.map(function (c) {
        return '<details class="sc"><summary><span class="tag">Scenario</span><span class="qt">' + inline(c.q) + '</span></summary><div class="body">' + md(c.a) + '</div></details>';
      }).join('');
  }
  function viewSubject(s, tab) {
    var c = subjectCounts(s);
    var tabs = [['notes', 'Study notes', s.notes.count], ['roadmap', 'Roadmap', s.topics], ['qa', 'Interview Q&A', s.qa.length], ['practice', 'Code practice', s.ex.length], ['scenarios', 'Scenarios', s.sc.length]];
    var h = '<div class="shead" style="--c:' + (COL[s.id] || '#818cf8') + '"><div style="display:flex;gap:18px;align-items:center"><div class="ico">' + icon(s.icon) + '</div><div><div class="eyebrow">Subject</div><h1 style="margin:2px 0 4px">' + esc(s.title) + '</h1><p class="lead">' + esc(s.tagline) + '</p></div></div>' +
      '<div style="min-width:220px;flex:0 0 240px"><div style="display:flex;justify-content:space-between;font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-bottom:6px"><span>Progress</span><span id="sp">' + c.done + '/' + c.total + ' · ' + c.pct + '%</span></div><div class="prog"><i id="spb" style="width:' + c.pct + '%"></i></div></div></div>';
    if (s.resume.length) h += '<div class="chips"><span class="chip" style="color:var(--accent)">From your resume</span>' + s.resume.map(function (r) { return '<span class="chip">' + esc(r) + '</span>'; }).join('') + '</div>';
    h += '<div class="tabs" role="tablist">' + tabs.map(function (t) { return '<a class="tab' + (t[0] === tab ? ' on' : '') + '" role="tab" href="#/' + s.id + '/' + t[0] + '">' + t[1] + '<small>' + t[2] + '</small></a>'; }).join('') + '</div>';
    if (tab === 'notes') h += tabNotes(s); else if (tab === 'qa') h += tabQA(s); else if (tab === 'practice') h += tabPractice(s); else if (tab === 'scenarios') h += tabScenarios(s); else h += tabRoadmap(s);
    return h;
  }
  function viewPlan() {
    var h = '<div class="eyebrow">Study plan</div><h1>8–12 week <span class="grad">roadmap</span></h1><p class="lead">' + esc(PLAN.meta.intro || '') + '</p>';
    h += '<h2 class="sec">Week by week</h2>';
    PLAN.weeks.forEach(function (w, i) {
      var k = 'plan:w' + i;
      h += '<div class="week"><label class="chk" title="Mark week complete"><input type="checkbox" data-k="' + k + '"' + (done(k) ? ' checked' : '') + ' aria-label="Mark week complete"></label><div class="card"><h3>' + inline(w.title) + '</h3><div class="body" style="padding:0;border:0">' + md(w.body) + '</div></div></div>';
    });
    if (PLAN.playbook.length) {
      h += '<h2 class="sec">Interview-day playbook</h2>';
      PLAN.playbook.forEach(function (b) { h += '<details class="sc"><summary><span class="qt">' + inline(b.title) + '</span></summary><div class="body">' + md(b.body) + '</div></details>'; });
    }
    if (PLAN.star.length) {
      h += '<h2 class="sec">Lead &amp; behavioural stories (STAR)</h2><p class="lead" style="margin-bottom:14px">Prepare one real story for each. Say them out loud until they take about two minutes.</p>';
      PLAN.star.forEach(function (b) { h += '<details class="sc"><summary><span class="qt">' + inline(b.title) + '</span></summary><div class="body">' + md(b.body) + '</div></details>'; });
    }
    return h;
  }

  /* ---------- activity (streak and daily goal) ---------- */
  function today() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  var saveTimer = null;
  function saveSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(save, 400); }
  function activity(n) { var a = state._act || (state._act = {}), t = today(); a[t] = (a[t] || 0) + (n || 1); saveSoon(); }

  /* ---------- playground panels ---------- */
  function renderRun(out, r, hasTests) {
    var h = '';
    if (r.type === 'error') h += '<div class="rr bad"><b>Error</b></div><pre class="errtxt">' + esc(r.message) + '</pre>';
    else if (hasTests) {
      var pass = r.results.filter(function (x) { return x.pass; }).length, total = r.results.length, all = total > 0 && pass === total;
      h += '<div class="rr ' + (all ? 'ok' : 'bad') + '"><b>' + (all ? 'All tests passed' : pass + ' of ' + total + ' tests passed') + '</b><span>' + pass + '/' + total + '</span></div><ul class="tl">' +
        r.results.map(function (x) { return '<li class="' + (x.pass ? 'ok' : 'bad') + '"><i>' + (x.pass ? '✓' : '✗') + '</i><div><span>' + esc(x.name) + '</span>' + (x.error ? '<pre>' + esc(x.error) + '</pre>' : '') + '</div></li>'; }).join('') + '</ul>';
    }
    if (r.logs && r.logs.length) h += '<div class="con"><div class="con-h">Console</div><pre>' + esc(r.logs.join('\n')) + '</pre></div>';
    else if (!hasTests && r.type === 'done') h += '<div class="con"><div class="con-h">Console</div><pre class="muted">Nothing printed. Use console.log(...) to see values.</pre></div>';
    out.innerHTML = h;
  }
  function jsPanel(body, o) {
    body.innerHTML = '<div class="ed-host"></div><div class="try-bar"><button type="button" class="btn p sm" data-a="run">' + (o.tests ? 'Run tests' : 'Run code') + '</button><button type="button" class="btn sm" data-a="reset">Reset</button>' + (o.solution ? '<button type="button" class="btn sm" data-a="sol">Load solution</button>' : '') + '<span class="try-st">Ctrl + Enter to run</span></div><div class="try-out"></div>';
    var st = $('.try-st', body), out = $('.try-out', body), saved = state['code:' + o.key], running = false, ed;
    function run() {
      if (running) return;
      running = true; st.textContent = 'Running…';
      PG.runJS(ed.get(), o.tests || '', function (r) {
        running = false;
        renderRun(out, r, !!o.tests);
        var ok = o.tests && r.type === 'done' && r.results.length && r.results.every(function (x) { return x.pass; });
        st.textContent = ok ? 'All tests passed' : 'Ctrl + Enter to run';
        if (ok && o.onPass) o.onPass();
      });
    }
    ed = PG.editor($('.ed-host', body), { value: saved != null ? saved : o.starter, lang: 'js', highlight: highlight, onRun: run, onChange: function (v) { state['code:' + o.key] = v; saveSoon(); }, minRows: o.rows || 9 });
    body.addEventListener('click', function (ev) {
      var b = ev.target.closest && ev.target.closest('[data-a]');
      if (!b) return;
      var a = b.getAttribute('data-a');
      if (a === 'run') run();
      else if (a === 'reset') { ed.set(o.starter); delete state['code:' + o.key]; out.innerHTML = ''; save(); }
      else if (a === 'sol') { if (ed.get().trim() === o.starter.trim() || window.confirm('Replace your code with the solution?')) ed.set(o.solution); }
    });
  }
  function webPanel(body, o) {
    body.innerHTML = '<div class="web"><div class="web-ed"><div class="lbl">HTML</div><div class="eh"></div><div class="lbl">CSS</div><div class="ec"></div></div><div class="web-pv"><div class="pv-bar"><span>Live preview</span><span class="vp"><button type="button" data-w="360">Mobile</button><button type="button" data-w="768">Tablet</button><button type="button" data-w="100%" class="on">Full</button></span></div><div class="pv-wrap"><iframe sandbox="" title="Live preview"></iframe></div></div></div>' +
      '<div class="try-bar"><button type="button" class="btn sm" data-a="reset">Reset</button>' + (o.solHtml || o.solCss ? '<button type="button" class="btn sm" data-a="sol">Load solution</button>' : '') + '<span class="try-st">Preview updates as you type</span></div>';
    var frame = $('iframe', body), timer = null, kh = 'code:' + o.key + ':html', kc = 'code:' + o.key + ':css', eh, ec;
    function upd() { frame.srcdoc = PG.buildDoc(eh.get(), ec.get()); }
    function later() { clearTimeout(timer); timer = setTimeout(upd, 220); }
    eh = PG.editor($('.eh', body), { value: state[kh] != null ? state[kh] : o.html, lang: 'html', highlight: highlight, minRows: 9, onChange: function (v) { state[kh] = v; saveSoon(); later(); } });
    ec = PG.editor($('.ec', body), { value: state[kc] != null ? state[kc] : o.css, lang: 'css', highlight: highlight, minRows: 9, onChange: function (v) { state[kc] = v; saveSoon(); later(); } });
    upd();
    body.addEventListener('click', function (ev) {
      var w = ev.target.closest && ev.target.closest('[data-w]');
      if (w) { $$('.vp button', body).forEach(function (b) { b.classList.toggle('on', b === w); }); frame.style.width = w.getAttribute('data-w').indexOf('%') > -1 ? '100%' : w.getAttribute('data-w') + 'px'; return; }
      var b = ev.target.closest && ev.target.closest('[data-a]');
      if (!b) return;
      if (b.getAttribute('data-a') === 'reset') { delete state[kh]; delete state[kc]; eh.set(o.html); ec.set(o.css); delete state[kh]; delete state[kc]; save(); }
      else if (window.confirm('Replace your code with the solution?')) { eh.set(o.solHtml); ec.set(o.solCss); }
    });
  }
  function wireTry(el) {
    el.addEventListener('toggle', function () {
      if (!el.open || el.getAttribute('data-ready')) return;
      el.setAttribute('data-ready', '1');
      var s = SUBJECTS[el.getAttribute('data-sid')], e = s.ex[+el.getAttribute('data-i')], body = $('.try-body', el), key = s.id + ':' + e.i;
      if (el.getAttribute('data-kind') === 'js') {
        jsPanel(body, {
          key: key, starter: e.starter, tests: e.tests, solution: fenceCode(e.s, 'js|javascript') || fenceCode(e.s),
          onPass: function () {
            var k = s.id + ':e:' + e.i;
            activity(2);
            if (!done(k)) {
              state[k] = 1; save();
              var box = el.closest('.ex').querySelector('input[data-k]'); if (box) box.checked = true;
              toast('All tests passed. Marked as solved.');
              refreshLocal();
            }
          }
        });
      } else {
        var probHtml = allFences(e.p, 'html'), probCss = allFences(e.p, 'css');
        webPanel(body, { key: key, html: probHtml || '<!-- Write your HTML here -->\n', css: probCss || '/* Write your CSS here */\n', solHtml: allFences(e.s, 'html'), solCss: allFences(e.s, 'css') });
      }
    });
  }
  var PG_JS = '// Write JavaScript here, then press Ctrl + Enter to run it.\nconst nums = [1, 2, 3, 4, 5];\nconst squares = nums.map(n => n * n);\nconsole.log("squares:", squares);\nconsole.log("sum:", squares.reduce((a, b) => a + b, 0));\n';
  var PG_HTML = '<div class="card">\n  <h2>Hello, playground</h2>\n  <p>Edit the HTML and CSS and watch the preview update.</p>\n  <button>Click me</button>\n</div>\n';
  var PG_CSS = '.card {\n  max-width: 320px;\n  margin: 24px auto;\n  padding: 24px;\n  border-radius: 16px;\n  background: #f5f3ff;\n  box-shadow: 0 10px 30px rgba(79, 70, 229, .18);\n}\nh2 { margin: 0 0 8px; color: #4338ca; }\nbutton {\n  padding: 10px 18px;\n  border: 0;\n  border-radius: 10px;\n  background: #4f46e5;\n  color: #fff;\n  cursor: pointer;\n}\n';
  function viewPlayground(tab) {
    return '<div class="eyebrow">Playground</div><h1>Code <span class="hl">playground</span></h1><p class="lead">Experiment freely. Your code runs in a sandbox in this browser and is saved here; nothing is sent anywhere.</p>' +
      '<div class="tabs" style="width:max-content"><a class="tab' + (tab === 'js' ? ' on' : '') + '" href="#/playground/js">JavaScript</a><a class="tab' + (tab === 'web' ? ' on' : '') + '" href="#/playground/web">HTML &amp; CSS</a></div><div class="card pg" id="pg-root" data-tab="' + tab + '"><div class="try-body" id="pg-body"></div></div>';
  }
  function mountPanels() {
    $$('.try').forEach(wireTry);
    var root = $('#pg-body');
    if (root) {
      if ($('#pg-root').getAttribute('data-tab') === 'js') jsPanel(root, { key: 'pg:js', starter: PG_JS, tests: '', rows: 14 });
      else webPanel(root, { key: 'pg:web', html: PG_HTML, css: PG_CSS, solHtml: '', solCss: '' });
    }
  }

  /* ---------- learning loop: ratings, goal, weak areas, review ---------- */
  var RATE_NAMES = ['Missed it', 'Shaky', 'Got it'];
  function rateBar(id, i) {
    var r = state[id + ':c:' + i];
    return '<div class="rate" data-ck="' + id + ':c:' + i + '"><span>How well did you know this?</span>' + RATE_NAMES.map(function (n, j) { return '<button type="button" class="rb r' + j + (r === j ? ' on' : '') + '" data-r="' + j + '">' + n + '</button>'; }).join('') + '</div>';
  }
  function setRating(ck, r) {
    state[ck] = r;
    var qk = ck.replace(':c:', ':q:');
    if (r > 0) { state[qk] = 1; var box = document.querySelector('input[data-k="' + qk + '"]'); if (box) { box.checked = true; var qrow = box.closest('.q'); if (qrow) qrow.setAttribute('data-done', '1'); } }
    save(); activity(1); refreshLocal();
  }
  function lastDays(n) {
    var out = [], d = new Date();
    for (var k = n - 1; k >= 0; k--) {
      var x = new Date(d.getFullYear(), d.getMonth(), d.getDate() - k);
      var key = x.getFullYear() + '-' + ('0' + (x.getMonth() + 1)).slice(-2) + '-' + ('0' + x.getDate()).slice(-2);
      out.push({ key: key, n: (state._act && state._act[key]) || 0, label: 'SMTWTFS'.charAt(x.getDay()) });
    }
    return out;
  }
  function streakDays() {
    var act = state._act || {}, d = new Date(), c = 0, i = 0;
    function key(x) { return x.getFullYear() + '-' + ('0' + (x.getMonth() + 1)).slice(-2) + '-' + ('0' + x.getDate()).slice(-2); }
    if (!act[key(d)]) i = 1;
    for (; i < 400; i++) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate() - i); if (act[key(x)]) c++; else break; }
    return c;
  }
  function weakList() {
    var out = [];
    IDS.forEach(function (id) { SUBJECTS[id].qa.forEach(function (q) { var r = state[id + ':c:' + q.i]; if (r === 0 || r === 1) out.push({ id: id, q: q, r: r }); }); });
    out.sort(function (a, b) { return a.r - b.r; });
    return out;
  }
  function dashExtras() {
    var goal = state._goal || 5, t = (state._act && state._act[today()]) || 0, days = lastDays(7), mx = Math.max.apply(null, days.map(function (d) { return d.n; }).concat([goal])), st = streakDays();
    var h = '<div class="dash2"><div class="card goal"><div class="goal-h"><div><div class="eyebrow-s">Daily goal</div><b class="goal-n">' + t + ' / ' + goal + '</b> <span class="muted">items today</span></div><div class="streak"><b>' + st + '</b><span>day streak</span></div></div>' +
      '<div class="prog" style="margin:12px 0"><i style="width:' + Math.min(100, pct(t, goal)) + '%"></i></div>' +
      '<div class="wk">' + days.map(function (d) { return '<div class="wk-c" title="' + d.key + ': ' + d.n + ' items"><i style="height:' + Math.max(4, Math.round(d.n / mx * 46)) + 'px' + (d.n >= goal ? ';background:var(--ok)' : '') + '"></i><span>' + d.label + '</span></div>'; }).join('') + '</div>' +
      '<div class="goal-b"><span class="muted">Goal per day</span><button type="button" class="fchip" data-goal="-1" aria-label="Lower goal">−</button><button type="button" class="fchip" data-goal="1" aria-label="Raise goal">+</button></div></div>';
    var weak = weakList();
    h += '<div class="card weakc"><div class="goal-h"><div><div class="eyebrow-s">Weak areas</div><b class="goal-n">' + weak.length + '</b> <span class="muted">questions to revisit</span></div><a class="btn p sm" href="#/review">' + (weak.length ? 'Drill them' : 'Start a mock') + '</a></div>';
    if (weak.length) h += '<div class="wl">' + weak.slice(0, 5).map(function (w) { return '<a href="#/' + w.id + '/qa/' + w.q.i + '"><i class="d' + w.r + '"></i><span>' + inline(w.q.q) + '</span><small>' + esc(SUBJECTS[w.id].title) + '</small></a>'; }).join('') + '</div>';
    else h += '<p class="muted" style="margin-top:12px">Rate questions as you study (Missed it, Shaky, Got it) and the ones you struggle with show up here.</p>';
    return h + '</div></div>';
  }

  /* mock interview: timed rounds, company-style loops, voice, follow-ups, readiness report, PDF */
  var RV = null, rvTimer = null;
  var PRESETS = {
    warm: { name: 'Warm-up', desc: '5 questions · 90 s each', ic: 'spark', o: { n: 5, secs: 90, deck: 'smart', level: 'all' } },
    std: { name: 'Standard round', desc: '10 questions · 2 min each', ic: 'users', o: { n: 10, secs: 120, deck: 'smart', level: 'all' } },
    lead: { name: 'Lead-level round', desc: '15 harder questions · 3 min each', ic: 'hex', o: { n: 15, secs: 180, deck: 'smart', level: 'senior' } },
    weak: { name: 'Weak-spot drill', desc: 'Only what you missed or found shaky', ic: 'db', o: { n: 10, secs: 120, deck: 'weak', level: 'all' } }
  };
  var LOOPS = {
    frontend: { name: 'Frontend engineer loop', ic: 'atom', secs: 120, level: 'all', stages: [
      { name: 'Web fundamentals', subs: ['htmlcss', 'javascript'], n: 4 }, { name: 'React and TypeScript', subs: ['react', 'typescript'], n: 5 },
      { name: 'Testing and quality', subs: ['testing'], n: 2 }, { name: 'Behavioural', subs: ['leader'], n: 2 }] },
    backend: { name: 'Backend engineer loop', ic: 'hex', secs: 120, level: 'all', stages: [
      { name: 'Node.js and APIs', subs: ['node'], n: 4 }, { name: 'Data and SQL', subs: ['database'], n: 4 },
      { name: 'Delivery and cloud', subs: ['deployment'], n: 3 }, { name: 'Behavioural', subs: ['leader'], n: 2 }] },
    sysdesign: { name: 'System design loop', ic: 'cloud', secs: 180, level: 'senior', stages: [
      { name: 'Architecture and scale', subs: ['system'], n: 6 }, { name: 'Data layer', subs: ['database'], n: 3 },
      { name: 'Reliability and delivery', subs: ['deployment', 'node'], n: 3 }, { name: 'Trade-offs and leadership', subs: ['leader'], n: 2 }] },
    lead: { name: 'Lead full stack loop', ic: 'users', secs: 180, level: 'senior', stages: [
      { name: 'Core stack', subs: ['javascript', 'react', 'node'], n: 5 }, { name: 'Architecture and data', subs: ['system', 'database'], n: 4 },
      { name: 'AI and delivery', subs: ['ai', 'deployment'], n: 3 }, { name: 'Leadership round', subs: ['leader'], n: 4 }] },
    coding: { name: 'Coding fundamentals loop', ic: 'code', secs: 120, level: 'all', stages: [
      { name: 'JavaScript depth', subs: ['javascript', 'typescript'], n: 4 }, { name: 'Data structures and algorithms', subs: ['dsa'], n: 6 }] },
    startup: { name: 'Startup generalist loop', ic: 'spark', secs: 90, level: 'all', stages: [
      { name: 'Core web', subs: ['javascript', 'react', 'node'], n: 4 }, { name: 'Data and delivery', subs: ['database', 'deployment'], n: 3 },
      { name: 'AI and ownership', subs: ['ai', 'leader'], n: 3 }] }
  };
  var TIPS = ['Start with a one-line definition, then give an example, then a trade-off.', 'Think aloud. Interviewers score your reasoning, not only the final answer.', 'Use a real project from your resume as the example.', 'If you are unsure, state what you do know, then how you would find out.', 'Mention a pitfall or edge case. It signals real experience.', 'Keep it structured: what it is, why it matters, when not to use it.'];
  var FU_GEN = ['Can you give a real example from a project you worked on?', 'What are the trade-offs or downsides of this approach?', 'How would this behave at 100 times the load or data size?', 'How would you test or monitor this in production?', 'How would you explain this to a junior developer in two minutes?', 'What is a common mistake here, and how do you avoid it?'];
  var FU = {
    htmlcss: ['How would you make this accessible for keyboard and screen-reader users?', 'How does this behave on a small mobile screen?'],
    javascript: ['What happens in the call stack and event loop when this runs?', 'How would this change in async code or another runtime?'],
    typescript: ['How would you type this so mistakes fail at compile time?', 'When would you avoid any or a type assertion here?'],
    dsa: ['What are the time and space complexity, and can you improve either?', 'Which edge cases would break a first attempt?'],
    react: ['How would you stop unnecessary re-renders here?', 'How would you structure state for this in a larger app?'],
    testing: ['How would you keep tests for this fast and non-flaky?', 'What would you mock, and what would you leave real?'],
    node: ['How would you handle errors, retries and timeouts here?', 'What security risks would you check?'],
    database: ['How would you index or query this efficiently?', 'What happens to data integrity under concurrent writes?'],
    system: ['Where is the bottleneck, and how would you scale it?', 'What fails first, and how does the system degrade gracefully?'],
    deployment: ['How would you roll this out safely and roll it back?', 'What would you monitor and alert on?'],
    ai: ['How would you evaluate quality and guard against hallucination or data leakage?', 'What would you keep a human in the loop for?'],
    leader: ['What was the outcome, and what did you learn?', 'How would you handle it if the team disagreed?']
  };
  var LEVELS = [['all', 'All levels'], ['basic', 'Basic'], ['intermediate', 'Intermediate'], ['advanced', 'Advanced'], ['senior', 'Intermediate + advanced']];
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition, rec = null, recBtn = null;

  function mkDefaults() { return { sub: 'all', deck: 'smart', level: 'all', n: 10, secs: 120, mode: 'timed', pad: 1, fu: 1, tts: 0, preset: 'std' }; }
  function loopTotal(k) { return LOOPS[k].stages.reduce(function (a, s) { return a + s.n; }, 0); }
  function followUp(c, i) { var l = (FU[c.id] || []).concat(FU_GEN); return l[(c.q.i * 3 + i) % l.length]; }

  function buildDeck(o) {
    var cards = [];
    IDS.forEach(function (id) {
      if (o.subs ? o.subs.indexOf(id) < 0 : (o.sub !== 'all' && o.sub !== id)) return;
      SUBJECTS[id].qa.forEach(function (q) {
        if (o.level === 'senior' ? q.level === 'basic' : (o.level && o.level !== 'all' && q.level !== o.level)) return;
        var r = state[id + ':c:' + q.i], pri = r === 0 ? 0 : r === 1 ? 1 : r === undefined ? 2 : 3;
        if (o.deck === 'weak' && pri > 1) return;
        if (o.deck === 'new' && pri !== 2) return;
        if (o.deck === 'smart' && pri > 2) return;
        cards.push({ id: id, q: q, pri: pri, rnd: Math.random() });
      });
    });
    cards.sort(function (a, b) { return o.deck === 'smart' ? (a.pri - b.pri) + (a.rnd - b.rnd) * 1.4 : a.rnd - b.rnd; });
    return cards.slice(0, o.n);
  }
  function buildLoop(o) {
    var L = LOOPS[o.loop], out = [];
    L.stages.forEach(function (st, si) {
      buildDeck({ subs: st.subs, level: L.level, deck: o.deck === 'weak' ? 'smart' : o.deck, n: st.n }).forEach(function (c) { c.stage = si; out.push(c); });
    });
    return out;
  }
  function rvOption(id, label, vals, cur, dis) { return '<label class="rv-f"><span>' + label + '</span><select id="' + id + '"' + (dis ? ' disabled' : '') + '>' + vals.map(function (v) { return '<option value="' + v[0] + '"' + (String(v[0]) === String(cur) ? ' selected' : '') + '>' + v[1] + '</option>'; }).join('') + '</select></label>'; }
  function fmtTime(s) { s = Math.max(0, s); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function mkPts(r) { return r === 2 ? 1 : r === 1 ? 0.5 : 0; }
  function mkScore(log) { return log.length ? Math.round(log.reduce(function (a, x) { return a + mkPts(x.r); }, 0) / log.length * 100) : 0; }
  function mkVerdict(s) { return s >= 85 ? ['Interview ready', 'ok'] : s >= 70 ? ['Almost there', 'ok'] : s >= 50 ? ['Getting there', 'warn'] : ['Keep building', 'bad']; }
  function mkName(o) { return o.loop ? LOOPS[o.loop].name : (PRESETS[o.preset] ? PRESETS[o.preset].name : 'Custom round'); }
  function mkSpark(vals) {
    if (vals.length < 2) return '<p class="muted" style="margin:10px 0 0;font-size:.86rem">Complete two rounds to see your trend.</p>';
    var w = 220, h = 54, pts = vals.map(function (v, i) { return [Math.round(i / (vals.length - 1) * (w - 8) + 4), Math.round(h - 6 - v / 100 * (h - 12))]; });
    return '<svg class="mk-spark" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Score trend"><polyline points="' + pts.map(function (p) { return p.join(','); }).join(' ') + '" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' + pts.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.2" fill="var(--accent)"/>'; }).join('') + '</svg>';
  }
  function mkRing(left, secs) {
    var C = 276.46;
    return '<div class="mk-ring' + (left <= 15 ? ' low' : left <= secs * 0.34 ? ' mid' : '') + '" id="rv-ringw"><svg viewBox="0 0 100 100"><circle class="trk" cx="50" cy="50" r="44"/><circle class="prg" id="rv-ring" cx="50" cy="50" r="44" stroke-dasharray="276.46" stroke-dashoffset="' + (C * (1 - left / secs)).toFixed(1) + '" transform="rotate(-90 50 50)"/></svg><b id="rv-time">' + fmtTime(left) + '</b></div>';
  }

  /* voice: speech-to-text for answers, text-to-speech for questions */
  function micStop() {
    if (rec) { try { rec.onend = null; rec.stop(); } catch (e) {} rec = null; }
    if (recBtn) { recBtn.classList.remove('on'); recBtn.querySelector('span').textContent = recBtn.getAttribute('data-idle') || 'Speak your answer'; recBtn = null; }
  }
  function micToggle(btn) {
    if (!SR) { toast('Voice input works in Chrome and Edge'); return; }
    if (rec && recBtn === btn) { micStop(); return; }
    micStop();
    var ta = $('#' + btn.getAttribute('data-for')); if (!ta) return;
    var base = ta.value; if (base && !/\s$/.test(base)) base += ' ';
    var isMain = ta.id === 'rv-note';
    rec = new SR(); rec.lang = 'en-IN'; rec.continuous = true; rec.interimResults = true;
    rec.onresult = function (e) {
      var fin = '', tmp = '';
      for (var i = 0; i < e.results.length; i++) { if (e.results[i].isFinal) fin += e.results[i][0].transcript; else tmp += e.results[i][0].transcript; }
      ta.value = base + fin + tmp;
      if (RV) { if (isMain) RV.note = ta.value; else RV.fnote = ta.value; }
    };
    rec.onerror = function (e) { toast(e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'Microphone access was blocked. Allow it in the address bar.' : e.error === 'no-speech' ? 'No speech heard' : 'Voice input stopped'); micStop(); };
    rec.onend = function () { micStop(); };
    try { rec.start(); recBtn = btn; btn.classList.add('on'); btn.setAttribute('data-idle', btn.querySelector('span').textContent); btn.querySelector('span').textContent = 'Listening… tap to stop'; }
    catch (e) { rec = null; toast('Could not start the microphone'); }
  }
  function speak(t) {
    if (!('speechSynthesis' in window)) return;
    try { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(String(t).replace(/[`*_#]/g, '')); u.lang = 'en-IN'; u.rate = 0.98; speechSynthesis.speak(u); } catch (e) {}
  }
  function hush() { try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) {} micStop(); }
  function micBtn(forId, label) { return SR ? '<button type="button" class="btn sm mk-mic" data-rv="mic" data-for="' + forId + '" aria-label="' + label + '">' + icon('mic') + '<span>' + label + '</span></button>' : '<span class="mk-nomic">Voice input needs Chrome or Edge</span>'; }

  function mkStatsPanel() {
    var hist = state._mock || [], last5 = hist.slice(-5), avg = last5.length ? Math.round(last5.reduce(function (a, x) { return a + x.score; }, 0) / last5.length) : null, best = hist.length ? Math.max.apply(null, hist.map(function (x) { return x.score; })) : null;
    var by = {}; weakList().forEach(function (w) { by[w.id] = (by[w.id] || 0) + 1; });
    var wk = Object.keys(by).sort(function (a, b) { return by[b] - by[a]; })[0];
    var h = '<aside class="card mk-side"><div class="eyebrow-s">Your mock record</div>';
    if (!hist.length) return h + '<p class="muted" style="margin-top:10px">No rounds yet. Run your first one and your score, trend and weak subjects will show up here.</p><ul class="mk-how"><li><b>1.</b> Hear the question and answer out loud.</li><li><b>2.</b> Reveal the model answer and meet the follow-up.</li><li><b>3.</b> Score yourself honestly and save the report as a PDF.</li></ul></aside>';
    var v = mkVerdict(avg);
    h += '<div class="mk-mini"><div><b>' + hist.length + '</b><span>rounds</span></div><div><b>' + avg + '%</b><span>avg (last ' + last5.length + ')</span></div><div><b>' + best + '%</b><span>best</span></div></div>';
    h += '<div class="mk-read ' + v[1] + '"><i></i>' + v[0] + '</div>' + mkSpark(hist.slice(-10).map(function (x) { return x.score; }));
    if (wk) h += '<p class="mk-focus">Focus next: <a href="#/' + wk + '/qa"><b>' + esc(SUBJECTS[wk].title) + '</b></a> <span class="muted">(' + by[wk] + ' weak)</span></p>';
    h += '<div class="mk-hist">' + hist.slice(-4).reverse().map(function (x) { return '<div><span>' + esc(x.name || x.d) + '</span><span>' + x.n + ' q</span><b class="' + mkVerdict(x.score)[1] + '">' + x.score + '%</b></div>'; }).join('') + '</div></aside>';
    return h;
  }
  function viewSetup() {
    var o = RV && RV.opts || mkDefaults(), wk = weakList().length, lp = !!o.loop;
    var pc = Object.keys(PRESETS).map(function (k) { var p = PRESETS[k]; return '<button type="button" class="mk-p' + (o.preset === k ? ' on' : '') + '" data-rv="preset" data-p="' + k + '"><span class="mk-pi">' + icon(p.ic) + '</span><b>' + p.name + '</b><small>' + (k === 'weak' ? wk + ' weak questions queued' : p.desc) + '</small></button>'; }).join('');
    var lc = Object.keys(LOOPS).map(function (k) { var l = LOOPS[k]; return '<button type="button" class="mk-p' + (o.loop === k ? ' on' : '') + '" data-rv="loop" data-p="' + k + '"><span class="mk-pi">' + icon(l.ic) + '</span><b>' + l.name + '</b><small>' + l.stages.length + ' stages · ' + loopTotal(k) + ' questions · ' + (l.secs >= 120 ? l.secs / 60 + ' min' : l.secs + ' s') + ' each</small></button>'; }).join('');
    function chk(id, on, txt) { return '<label class="rv-f rv-chk"><input type="checkbox" id="' + id + '"' + (on ? ' checked' : '') + '><span>' + txt + '</span></label>'; }
    return '<div class="eyebrow">Mock interview</div><h1>Practise like the <span class="hl">real round</span></h1><p class="lead">A question, a countdown, your answer out loud, then a follow-up and honest scoring. You finish with a readiness report you can save as a PDF.</p>' +
      '<div class="mk-grid"><div><div class="mk-label">1. Pick a round</div><div class="mk-presets">' + pc + '</div>' +
      '<div class="mk-label">Or run a company-style loop <span class="mk-new">multi-stage</span></div><div class="mk-presets">' + lc + '</div>' +
      '<div class="card rv-setup mk-set"><div class="mk-label" style="margin:0">2. Fine-tune (optional)</div>' + (lp ? '<p class="muted mk-lpnote">Subject, difficulty and count come from the selected loop. You can still change the mode, timer and options.</p>' : '') + '<div class="mk-fields">' +
      rvOption('rv-sub', 'Subject', [['all', 'All subjects']].concat(IDS.map(function (id) { return [id, SUBJECTS[id].title]; })), o.sub, lp) +
      rvOption('rv-level', 'Difficulty', LEVELS, o.level, lp) +
      rvOption('rv-deck', 'Question pool', [['smart', 'Smart mix (weak first)'], ['weak', 'Weak only (' + wk + ')'], ['new', 'Not yet rated'], ['all', 'Everything']], o.deck) +
      rvOption('rv-n', 'Questions', [[5, '5'], [10, '10'], [15, '15'], [20, '20'], [30, '30']], o.n, lp) +
      rvOption('rv-mode', 'Mode', [['timed', 'Interview (countdown)'], ['free', 'Practice (no timer)']], o.mode) +
      rvOption('rv-secs', 'Time per question', [[60, '1 min'], [90, '1.5 min'], [120, '2 min'], [180, '3 min'], [300, '5 min']], o.secs) + '</div>' +
      '<div class="mk-checks">' + chk('rv-pad', o.pad, 'Answer notepad') + chk('rv-fu', o.fu, 'Interviewer follow-up questions') + chk('rv-tts', o.tts, 'Interviewer reads questions aloud') + '</div>' +
      '<p class="muted" style="margin:0;font-size:.84rem">' + (SR ? 'Voice answers are on: tap the microphone in a question to dictate. ' : 'Voice answers need Chrome or Edge. ') + 'Everything runs in your browser; nothing is uploaded by this app.</p>' +
      '<button type="button" class="btn p mk-start" data-rv="start">Start the interview <svg viewBox="0 0 24 24" class="ic"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button><p class="muted" id="rv-msg" style="margin:0"></p></div></div>' + mkStatsPanel() + '</div>';
  }
  function viewSession() {
    var c = RV.cards[RV.idx], s = SUBJECTS[c.id], rev = RV.phase === 'review', L = RV.opts.loop ? LOOPS[RV.opts.loop] : null;
    var segs = RV.cards.map(function (x, i) { var l = RV.log[i]; return '<i class="' + (i < RV.log.length ? (l.r === 2 ? 'g' : l.r === 1 ? 'a' : l.r === 0 ? 'r' : 's') : i === RV.idx ? 'cur' : '') + '"></i>'; }).join('');
    var title = L ? L.name + ' · Stage ' + (c.stage + 1) + ' of ' + L.stages.length + ': ' + L.stages[c.stage].name : (RV.timed ? 'Mock interview' : 'Practice round');
    var h = '<div class="mk-top"><div class="eyebrow" style="margin:0">' + esc(title) + ' · Question ' + (RV.idx + 1) + ' of ' + RV.cards.length + '</div><div class="mk-ctl">' + (RV.timed && !rev ? '<button type="button" class="btn sm" data-rv="pause" id="rv-pause">Pause</button>' : '') + '<button type="button" class="btn sm" data-rv="end">End round</button></div></div><div class="mk-segs" aria-hidden="true">' + segs + '</div>';
    h += '<div class="card mk-card' + (RV.paused ? ' paused' : '') + '"><div class="mk-head"><div class="mk-who"><span class="mk-av">' + icon('users') + '</span><div><b>Interviewer</b><small>asks · ' + esc(s.title) + '</small></div></div>' + (RV.timed && !rev ? mkRing(RV.left, RV.secs) : rev && RV.timed ? '<div class="mk-took' + (RV.timedOut ? ' bad' : '') + '">' + (RV.timedOut ? 'Time ran out' : 'Answered in ' + fmtTime(RV.taken)) + '</div>' : '') + '</div>';
    h += '<div class="mk-body"><div class="rv-meta"><span class="chip" style="color:' + COL[c.id] + '">' + esc(s.title) + '</span><span class="badge ' + c.q.level + '">' + c.q.level + '</span>' + (RV.tts && 'speechSynthesis' in window ? '<button type="button" class="btn sm mk-rep-q" data-rv="repeat">' + icon('mic') + '<span>Repeat question</span></button>' : '') + '</div><h2 class="rv-q">' + inline(c.q.q) + '</h2>';
    if (!rev) {
      h += '<p class="mk-tip"><b>Tip:</b> ' + TIPS[RV.idx % TIPS.length] + '</p>';
      if (RV.pad) h += '<textarea id="rv-note" class="mk-pad" rows="4" placeholder="Optional notepad: jot key points, or tap the microphone and speak your answer…" aria-label="Answer notepad">' + esc(RV.note || '') + '</textarea><div class="mk-padbar">' + micBtn('rv-note', 'Speak your answer') + '</div>';
      else h += '<div class="mk-padbar">' + micBtn('rv-note', 'Speak your answer') + '</div><textarea id="rv-note" class="mk-pad" rows="2" hidden></textarea>';
      h += '<div class="mk-act"><button type="button" class="btn p" data-rv="show">I have answered, show model answer</button>' + (RV.timed ? '<button type="button" class="btn" data-rv="more">+30 s</button>' : '') + '<button type="button" class="btn" data-rv="skip">Skip</button></div><p class="mk-keys"><kbd>Space</kbd> reveal · <kbd>S</kbd> skip' + (RV.timed ? ' · <kbd>P</kbd> pause' : '') + '</p>';
    } else {
      h += '<div class="mk-cols' + (RV.note ? '' : ' one') + '">' + (RV.note ? '<div class="mk-yours"><div class="eyebrow-s">Your answer</div><p>' + esc(RV.note).replace(/\n/g, '<br>') + '</p></div>' : '') + '<div class="body rv-a"><div class="eyebrow-s">Model answer</div>' + md(c.q.a) + '</div></div>';
      if (RV.fu) h += '<div class="mk-fu"><div class="mk-fu-h"><span class="mk-av sm">' + icon('users') + '</span><div><div class="eyebrow-s">Interviewer follow-up</div><b>' + esc(RV.fuq) + '</b></div></div><textarea id="rv-fnote" class="mk-pad" rows="2" placeholder="Answer it here, or tap the microphone and say it aloud (optional)…" aria-label="Follow-up answer">' + esc(RV.fnote || '') + '</textarea><div class="mk-padbar">' + micBtn('rv-fnote', 'Speak the follow-up') + '<label class="mk-fok"><input type="checkbox" id="rv-fok"' + (RV.fok ? ' checked' : '') + '><span>I could answer this confidently</span></label></div></div>';
      h += '<div class="rate rv-rate"><span>Be honest: how did your answer compare?</span>' + RATE_NAMES.map(function (n, j) { return '<button type="button" class="rb r' + j + '" data-rv="rate" data-r="' + j + '">' + (j === 2 ? 'Nailed it' : n) + ' <kbd>' + (j + 1) + '</kbd></button>'; }).join('') + '</div>';
    }
    return h + '</div></div>';
  }
  function viewResult() {
    var log = RV.log, score = mkScore(log), v = mkVerdict(score), prev = (state._mock || []).slice(0, -1).slice(-1)[0], L = RV.opts.loop ? LOOPS[RV.opts.loop] : null;
    var got = log.filter(function (x) { return x.r === 2; }).length, sh = log.filter(function (x) { return x.r === 1; }).length, ms = log.filter(function (x) { return x.r === 0; }).length, sk = log.filter(function (x) { return x.r === -1; }).length;
    var ans = log.filter(function (x) { return x.r >= 0; }), avgT = ans.length ? Math.round(ans.reduce(function (a, x) { return a + x.t; }, 0) / ans.length) : 0, to = log.filter(function (x) { return x.to; }).length;
    var fuAsked = log.filter(function (x) { return x.fu; }).length, fuOk = log.filter(function (x) { return x.fu && x.fok; }).length;
    var by = {}; log.forEach(function (x) { var b = by[x.id] || (by[x.id] = { n: 0, p: 0 }); b.n++; b.p += mkPts(x.r); });
    var rows = Object.keys(by).sort(function (a, b) { return by[a].p / by[a].n - by[b].p / by[b].n; });
    var weakQ = log.filter(function (x) { return x.r < 2; });
    var delta = prev ? score - prev.score : null, C = 276.46, rname = mkName(RV.opts);
    function bar(label, p) { return '<div class="mk-row"><span>' + esc(label) + '</span><div class="prog"><i style="width:' + p + '%;background:' + (p >= 70 ? 'var(--ok)' : p >= 50 ? 'var(--warn)' : 'var(--bad)') + '"></i></div><b>' + p + '%</b></div>'; }
    var h = '<div class="mk-printonly mk-ph"><div><b>Interview Roadmap · Mock interview report</b><br>' + esc(rname) + ' · ' + new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) + '</div><div class="mk-pscore">' + score + '%</div></div>';
    h += '<div class="eyebrow">Round complete · ' + esc(rname) + '</div><h1>Your <span class="hl">readiness report</span></h1>';
    h += '<div class="mk-rep"><div class="card mk-score ' + v[1] + '"><div class="mk-big"><svg viewBox="0 0 100 100"><circle class="trk" cx="50" cy="50" r="44"/><circle class="prg" cx="50" cy="50" r="44" stroke-dasharray="276.46" stroke-dashoffset="' + (C * (1 - score / 100)).toFixed(1) + '" transform="rotate(-90 50 50)"/></svg><b>' + score + '<small>%</small></b></div><div><div class="mk-vd">' + v[0] + '</div><p class="muted" style="margin:4px 0 0">' + (delta === null ? 'First recorded round. Beat it next time.' : delta === 0 ? 'Same as your previous round.' : (delta > 0 ? 'Up ' : 'Down ') + Math.abs(delta) + ' points from your previous round.') + '</p></div></div>';
    h += '<div class="stats mk-stats"><div class="stat" style="--c:#22c55e"><b>' + got + '</b><span>Nailed</span></div><div class="stat" style="--c:#f59e0b"><b>' + sh + '</b><span>Shaky</span></div><div class="stat" style="--c:#ef4444"><b>' + ms + '</b><span>Missed</span></div><div class="stat" style="--c:#94a3b8"><b>' + sk + '</b><span>Skipped</span></div><div class="stat" style="--c:#6366f1"><b>' + (RV.timed ? fmtTime(avgT) : '–') + '</b><span>Avg answer time' + (to ? ' · ' + to + ' timed out' : '') + '</span></div>' + (fuAsked ? '<div class="stat" style="--c:#0891b2"><b>' + fuOk + '/' + fuAsked + '</b><span>Follow-ups handled</span></div>' : '') + '</div></div>';
    if (L) {
      var st = {}; log.forEach(function (x) { var b = st[x.stage] || (st[x.stage] = { n: 0, p: 0 }); b.n++; b.p += mkPts(x.r); });
      h += '<div class="card mk-by"><div class="eyebrow-s">By interview stage</div>' + L.stages.map(function (s, i) { return st[i] ? bar(s.name, Math.round(st[i].p / st[i].n * 100)) : ''; }).join('') + '</div>';
    }
    h += '<div class="card mk-by"><div class="eyebrow-s">By subject (weakest first)</div>' + rows.map(function (id) { return bar(SUBJECTS[id].title, Math.round(by[id].p / by[id].n * 100)); }).join('') + '</div>';
    if (weakQ.length) h += '<div class="card mk-rev"><div class="eyebrow-s">Revisit these (' + weakQ.length + ')</div><div class="wl">' + weakQ.map(function (x) { return '<a href="#/' + x.id + '/qa/' + x.q.i + '"><i class="d' + (x.r < 0 ? 1 : x.r) + '"></i><span>' + inline(x.q.q) + '</span><small>' + esc(SUBJECTS[x.id].title) + (x.r < 0 ? ' · skipped' : '') + '</small></a>'; }).join('') + '</div></div>';
    else h += '<div class="card mk-rev"><b>Clean sweep.</b> <span class="muted">Every answer was nailed. Try a harder round next.</span></div>';
    h += '<p class="lead mk-noprint" style="margin-top:16px">Missed and shaky answers were added to your Weak areas, so the next smart round will bring them back first.</p><div class="mk-act mk-noprint" style="margin-top:12px">' + (weakQ.length ? '<button type="button" class="btn p" data-rv="retry">Retry these ' + weakQ.length + '</button>' : '') + '<button type="button" class="btn' + (weakQ.length ? '' : ' p') + '" data-rv="again">New round</button><button type="button" class="btn" data-rv="pdf">' + icon('doc') + ' Download PDF report</button><a class="btn" href="#/">Back to dashboard</a></div><p class="muted mk-noprint" style="margin-top:10px;font-size:.84rem">The PDF opens your browser\'s print dialog. Choose "Save as PDF" as the destination.</p>';
    if (weakQ.length) {
      h += '<div class="mk-printonly mk-sheet"><h2>Study sheet: questions to revisit</h2>' + weakQ.map(function (x, i) {
        return '<div class="mk-sq"><h3>' + (i + 1) + '. ' + inline(x.q.q) + '</h3><p class="mk-sm">' + esc(SUBJECTS[x.id].title) + ' · ' + x.q.level + ' · ' + (x.r < 0 ? 'skipped' : RATE_NAMES[x.r]) + '</p>' +
          (x.note ? '<p><b>Your answer:</b> ' + esc(x.note) + '</p>' : '') + (x.fu ? '<p><b>Follow-up:</b> ' + esc(x.fu) + (x.fnote ? '<br><b>Your reply:</b> ' + esc(x.fnote) : '') + '</p>' : '') +
          '<div class="mk-sa"><b>Model answer</b>' + md(x.q.a) + '</div></div>';
      }).join('') + '</div>';
    }
    return h;
  }
  function viewReview() {
    if (RV && RV.cards) return RV.idx >= RV.cards.length || RV.done ? viewResult() : viewSession();
    return viewSetup();
  }
  function rvPaint() {
    clearInterval(rvTimer); hush();
    var v = $('#view'); v.innerHTML = viewReview(); window.scrollTo(0, 0);
    if (RV && RV.cards && !RV.done && RV.idx < RV.cards.length && RV.phase === 'ask') {
      if (RV.timed) rvStartTimer();
      if (RV.tts) speak(RV.cards[RV.idx].q.q);
      var ta = $('#rv-note'); if (ta && !ta.hidden) ta.focus({ preventScroll: true });
    }
  }
  function rvTick() {
    var t = $('#rv-time'), rg = $('#rv-ring'), w = $('#rv-ringw');
    if (t) t.textContent = fmtTime(RV.left);
    if (rg) rg.setAttribute('stroke-dashoffset', (276.46 * (1 - Math.max(0, RV.left) / RV.secs)).toFixed(1));
    if (w) { w.classList.toggle('low', RV.left <= 15); w.classList.toggle('mid', RV.left > 15 && RV.left <= RV.secs * 0.34); }
  }
  function rvStartTimer() {
    clearInterval(rvTimer);
    rvTimer = setInterval(function () {
      if (RV.paused) return;
      RV.left--; rvTick();
      if (RV.left <= 0) { clearInterval(rvTimer); RV.timedOut = true; rvReveal(); toast('Time is up. Compare with the model answer.'); }
    }, 1000);
  }
  function rvReveal() {
    var ta = $('#rv-note'); if (ta) RV.note = ta.value;
    RV.taken = RV.timed ? RV.secs - Math.max(0, RV.left) : Math.round((Date.now() - RV.t0) / 1000);
    RV.phase = 'review'; RV.paused = false; RV.fnote = ''; RV.fok = false;
    RV.fuq = RV.fu ? followUp(RV.cards[RV.idx], RV.idx) : '';
    rvPaint();
  }
  function rvNext() {
    var prevStage = RV.cards[RV.idx].stage;
    RV.idx++; RV.note = ''; RV.phase = 'ask'; RV.left = RV.secs; RV.timedOut = false; RV.paused = false; RV.t0 = Date.now();
    if (RV.idx >= RV.cards.length) { rvFinish(); return; }
    var ns = RV.cards[RV.idx].stage;
    if (RV.opts.loop && ns !== prevStage) toast('Next stage: ' + LOOPS[RV.opts.loop].stages[ns].name);
    rvPaint();
  }
  function rvFinish() {
    if (!RV.saved && RV.log.length) {
      RV.saved = true;
      var h = state._mock || (state._mock = []);
      h.push({ d: today(), ts: Date.now(), n: RV.log.length, score: mkScore(RV.log), sub: RV.opts.sub, mode: RV.opts.mode, name: mkName(RV.opts) });
      if (h.length > 40) h.splice(0, h.length - 40);
      save();
    }
    RV.done = true; rvPaint();
  }
  function rvFlags() {
    var g = function (id, d) { var e = $('#' + id); return e ? (e.checked ? 1 : 0) : d; }, cur = RV && RV.opts || mkDefaults();
    return { pad: g('rv-pad', cur.pad), fu: g('rv-fu', cur.fu), tts: g('rv-tts', cur.tts) };
  }
  function rvOptsFromDom() {
    var f = rvFlags(), cur = RV && RV.opts || {}, o = { sub: $('#rv-sub').value, level: $('#rv-level').value, deck: $('#rv-deck').value, n: +$('#rv-n').value, mode: $('#rv-mode').value, secs: +$('#rv-secs').value, pad: f.pad, fu: f.fu, tts: f.tts, preset: cur.preset || 'custom' };
    if (cur.loop) o.loop = cur.loop;
    return o;
  }
  function rvBegin(o, cards) {
    RV = { opts: o, cards: cards, idx: 0, phase: 'ask', log: [], timed: o.mode === 'timed', secs: o.secs, left: o.secs, pad: o.pad, fu: o.fu, tts: o.tts, note: '', fnote: '', fok: false, paused: false, t0: Date.now(), taken: 0 };
    rvPaint();
  }
  function rvAction(a, btn) {
    if (a === 'preset' || a === 'loop') {
      var p = btn.getAttribute('data-p'), cur = RV && RV.opts ? RV.opts : mkDefaults(), f = rvFlags(), sub = $('#rv-sub') && !$('#rv-sub').disabled ? $('#rv-sub').value : 'all', o = { sub: sub, mode: $('#rv-mode') ? $('#rv-mode').value : cur.mode, pad: f.pad, fu: f.fu, tts: f.tts };
      if (a === 'preset') { Object.keys(PRESETS[p].o).forEach(function (k) { o[k] = PRESETS[p].o[k]; }); o.preset = p; }
      else { o.deck = 'smart'; o.level = 'all'; o.n = loopTotal(p); o.secs = LOOPS[p].secs; o.loop = p; o.preset = 'loop:' + p; o.sub = 'all'; }
      RV = { opts: o }; rvPaint();
    } else if (a === 'start') {
      var op = rvOptsFromDom(), cards = op.loop ? buildLoop(op) : buildDeck(op);
      if (!cards.length) { $('#rv-msg').textContent = 'No questions match these filters. Try a wider pool or a different difficulty.'; return; }
      rvBegin(op, cards);
    } else if (a === 'show') { rvReveal(); }
    else if (a === 'mic') { micToggle(btn); }
    else if (a === 'repeat') { speak(RV.cards[RV.idx].q.q); }
    else if (a === 'more') { RV.left += 30; RV.secs += 30; rvTick(); toast('+30 seconds'); }
    else if (a === 'pause') {
      RV.paused = !RV.paused;
      var cd = $('.mk-card'); if (cd) cd.classList.toggle('paused', RV.paused);
      btn.textContent = RV.paused ? 'Resume' : 'Pause';
    }
    else if (a === 'skip') { var cs = RV.cards[RV.idx]; RV.log.push({ id: cs.id, q: cs.q, r: -1, t: 0, to: false, stage: cs.stage }); rvNext(); }
    else if (a === 'rate') {
      var r = +btn.getAttribute('data-r'), c = RV.cards[RV.idx], fn = $('#rv-fnote'), fk = $('#rv-fok');
      if (fn) RV.fnote = fn.value; if (fk) RV.fok = fk.checked;
      state[c.id + ':c:' + c.q.i] = r; if (r > 0) state[c.id + ':q:' + c.q.i] = 1;
      save(); activity(1);
      RV.log.push({ id: c.id, q: c.q, r: r, t: RV.taken, to: !!RV.timedOut, stage: c.stage, note: RV.note, fu: RV.fu ? RV.fuq : '', fok: !!RV.fok, fnote: RV.fnote });
      updateChrome(); rvNext();
    }
    else if (a === 'end') {
      if (RV.log.length) rvFinish();
      else { var o2 = RV.opts; RV = { opts: o2 }; rvPaint(); }
    }
    else if (a === 'retry') {
      var redo = RV.log.filter(function (x) { return x.r < 2; }).map(function (x) { return { id: x.id, q: x.q, stage: x.stage }; }), o4 = {}; Object.keys(RV.opts).forEach(function (k) { o4[k] = RV.opts[k]; });
      rvBegin(o4, redo);
    }
    else if (a === 'pdf') {
      var old = document.title; document.title = 'Mock interview report - ' + today();
      setTimeout(function () { window.print(); setTimeout(function () { document.title = old; }, 500); }, 60);
    }
    else if (a === 'again') { var o3 = RV.opts; RV = { opts: o3 }; rvPaint(); }
  }
  function rvKey(e) {
    if (route.page !== 'review' || !RV || !RV.cards || RV.done || RV.idx >= RV.cards.length) return false;
    var tag = (document.activeElement || {}).tagName || '';
    if (/^(INPUT|SELECT)$/.test(tag)) return false;
    if (tag === 'TEXTAREA') { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && RV.phase === 'ask') { e.preventDefault(); rvReveal(); return true; } return false; }
    var k = e.key.toLowerCase();
    if (RV.phase === 'ask') {
      if (k === ' ' || k === 'enter') { e.preventDefault(); rvReveal(); return true; }
      if (k === 's') { rvAction('skip'); return true; }
      if (k === 'p' && RV.timed) { var pb = $('#rv-pause'); if (pb) rvAction('pause', pb); return true; }
    } else if (k === '1' || k === '2' || k === '3') {
      var fake = { getAttribute: function () { return String(+k - 1); } }; rvAction('rate', fake); return true;
    }
    return false;
  }

  /* ---------- export / import progress ---------- */
  function exportProgress() {
    var blob = new Blob([JSON.stringify({ app: 'interview-roadmap', version: 1, saved: new Date().toISOString(), state: state }, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'interview-roadmap-progress.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    toast('Progress exported');
  }
  function importProgress(file) {
    var fr = new FileReader();
    fr.onload = function () {
      try {
        var d = JSON.parse(fr.result), st = d && d.state && typeof d.state === 'object' ? d.state : null;
        if (!st) throw new Error('bad file');
        if (!window.confirm('Replace the progress in this browser with the imported file?')) return;
        state = st; save(); render(); toast('Progress imported');
      } catch (e) { toast('That file is not a progress export'); }
    };
    fr.readAsText(file);
  }

  /* ---------- routing ---------- */
  function parseHash() {
    var p = (location.hash || '#/').replace(/^#\/?/, '').split('/').filter(Boolean);
    if (!p.length) return { page: 'home' };
    if (p[0] === 'plan') return { page: 'plan' };
    if (p[0] === 'review') return { page: 'review' };
    if (p[0] === 'playground') return { page: 'playground', tab: p[1] === 'web' ? 'web' : 'js' };
    if (SUBJECTS[p[0]]) return { page: 'subject', id: p[0], tab: ['notes', 'roadmap', 'qa', 'practice', 'scenarios'].indexOf(p[1]) > -1 ? p[1] : (SUBJECTS[p[0]].notes.count ? 'notes' : 'roadmap'), open: p[2] != null ? +p[2] : null };
    return { page: 'home' };
  }
  function render() {
    route = parseHash();
    var v = $('#view'), crumb = $('#crumb');
    if (route.page === 'home') { v.innerHTML = viewHome(); crumb.textContent = 'Dashboard'; document.title = 'Interview Roadmap — Wishvanath Sah'; }
    else if (route.page === 'plan') { v.innerHTML = viewPlan(); crumb.textContent = 'Study plan'; document.title = 'Study plan — Interview Roadmap'; }
    else if (route.page === 'review') { v.innerHTML = viewReview(); crumb.textContent = 'Mock interview'; document.title = 'Mock interview — Interview Roadmap'; }
    else if (route.page === 'playground') { v.innerHTML = viewPlayground(route.tab); crumb.textContent = 'Playground'; document.title = 'Playground — Interview Roadmap'; }
    else { var s = SUBJECTS[route.id]; v.innerHTML = viewSubject(s, route.tab); crumb.textContent = s.title; document.title = s.title + ' — Interview Roadmap'; }
    clearInterval(rvTimer); hush();
    if (route.page === 'subject') { state._last = { h: '#/' + route.id + '/' + route.tab, t: SUBJECTS[route.id].title + ' · ' + ({ notes: 'notes', roadmap: 'roadmap', qa: 'Q&A', practice: 'practice', scenarios: 'scenarios' }[route.tab]) }; saveSoon(); }
    mountPanels();
    updateChrome();
    animateCounts();
    if (route.page === 'home') { startTyper(); tiltCard(); } else clearTimeout(typerTimer);
    $('#side').classList.remove('open');
    $('#burger').setAttribute('aria-expanded', 'false');
    if (route.page === 'subject' && route.tab === 'qa' && route.open != null) {
      var el = $('#q-' + route.open);
      if (el) { var d = $('details', el); d.open = true; setTimeout(function () { el.scrollIntoView({ block: 'center' }); }, 30); }
    } else if (route.page === 'subject' && route.tab === 'notes' && route.open != null) {
      var nel = $('#n-' + route.open);
      if (nel) { var nd = $('details', nel); nd.open = true; setTimeout(function () { nel.scrollIntoView({ block: 'center' }); }, 30); }
    } else { window.scrollTo(0, 0); }
  }

  /* ---------- live updates ---------- */
  function refreshLocal() {
    updateChrome();
    if (route.page === 'subject') {
      var s = SUBJECTS[route.id], c = subjectCounts(s), sp = $('#sp'), spb = $('#spb');
      if (sp) sp.textContent = c.done + '/' + c.total + ' · ' + c.pct + '%';
      if (spb) spb.style.width = c.pct + '%';
      if (route.tab === 'roadmap') {
        $$('.phase').forEach(function (ph, i) {
          var items = s.phases[i].items, d = items.filter(function (it) { return done(s.id + ':r:' + it.i); }).length;
          $('.n', ph).textContent = d + '/' + items.length;
        });
      }
    }
  }
  function applyQFilter() {
    var f = ($('.fchip.on[data-f]') || {}).getAttribute ? $('.fchip.on[data-f]').getAttribute('data-f') : 'all';
    var term = ($('#qsearch') || { value: '' }).value.trim().toLowerCase(), shown = 0;
    $$('#qlist .q').forEach(function (el) {
      var ok = (f === 'all' || (f === 'todo' ? el.getAttribute('data-done') === '0' : el.getAttribute('data-level') === f)) && (!term || el.getAttribute('data-text').indexOf(term) > -1);
      el.hidden = !ok;
      if (ok) shown++;
    });
    var em = $('#qempty'); if (em) em.hidden = shown > 0;
  }
  function globalSearch(term) {
    var box = $('#gres'); if (!box) return;
    term = term.trim().toLowerCase();
    if (term.length < 2) { box.innerHTML = ''; return; }
    var res = [];
    IDS.forEach(function (id) {
      SUBJECTS[id].qa.forEach(function (q) { if (q.q.toLowerCase().indexOf(term) > -1) res.push({ id: id, q: q }); });
      SUBJECTS[id].notes.groups.forEach(function (g) { g.notes.forEach(function (n) { if (n.t.toLowerCase().indexOf(term) > -1) res.push({ id: id, note: n }); }); });
    });
    box.innerHTML = res.length ? res.slice(0, 14).map(function (r) {
      if (r.note) return '<a class="res" href="#/' + r.id + '/notes/' + r.note.i + '"><span class="badge basic">note</span><span>' + inline(r.note.t) + '</span><small>' + esc(SUBJECTS[r.id].title) + '</small></a>';
      return '<a class="res" href="#/' + r.id + '/qa/' + r.q.i + '"><span class="badge ' + r.q.level + '">' + r.q.level + '</span><span>' + inline(r.q.q) + '</span><small>' + esc(SUBJECTS[r.id].title) + '</small></a>';
    }).join('') : '<div class="empty">No matching questions.</div>';
  }

  /* ---------- events ---------- */
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches && t.matches('input[data-k]')) {
      state[t.getAttribute('data-k')] = t.checked ? 1 : 0;
      if (t.checked) activity(1);
      if (!t.checked) delete state[t.getAttribute('data-k')];
      save();
      var row = t.closest('.topic'); if (row) row.classList.toggle('done', t.checked);
      var q = t.closest('.q'); if (q) { q.setAttribute('data-done', t.checked ? 1 : 0); applyQFilter(); }
      refreshLocal();
    }
  });
  document.addEventListener('click', function (e) {
    var t = e.target;
    var cp = t.closest && t.closest('[data-copy]');
    if (cp) {
      var text = cp.closest('.code').querySelector('code').textContent;
      var ok = function () { cp.textContent = 'Copied'; setTimeout(function () { cp.textContent = 'Copy'; }, 1200); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, function () { toast('Copy failed'); });
      else { var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); ok(); } catch (x) {} ta.remove(); }
      return;
    }
    var rvb = t.closest && t.closest('[data-rv]');
    if (rvb) { rvAction(rvb.getAttribute('data-rv'), rvb); return; }
    var gb = t.closest && t.closest('[data-goal]');
    if (gb) { state._goal = Math.max(1, Math.min(30, (state._goal || 5) + (+gb.getAttribute('data-goal')))); save(); render(); return; }
    var rb = t.closest && t.closest('.rate .rb:not([data-rv])');
    if (rb) {
      var bar = rb.parentNode, rr = +rb.getAttribute('data-r');
      setRating(bar.getAttribute('data-ck'), rr);
      $$('.rb', bar).forEach(function (b) { b.classList.toggle('on', b === rb); });
      return;
    }
    if (t.id === 'export') { exportProgress(); return; }
    if (t.id === 'import') { $('#importfile').click(); return; }
    var fc = t.closest && t.closest('.fchip[data-f]');
    if (fc) { $$('.fchip[data-f]').forEach(function (b) { b.classList.toggle('on', b === fc); }); applyQFilter(); return; }
    var jp = t.closest && t.closest('[data-jump]');
    if (jp) { var tg = document.getElementById(jp.getAttribute('data-jump')); if (tg) tg.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (t.id === 'nexpand') {
      var nd = $$('#nlist details'), no = t.textContent === 'Expand all';
      nd.forEach(function (d) { d.open = no; });
      t.textContent = no ? 'Collapse all' : 'Expand all';
      return;
    }
    if (t.id === 'expand') {
      var ds = $$('#qlist .q:not([hidden]) details'), open = t.textContent === 'Expand all';
      ds.forEach(function (d) { d.open = open; });
      t.textContent = open ? 'Collapse all' : 'Expand all';
    }
  });
  document.addEventListener('input', function (e) {
    if (e.target.id === 'qsearch') applyQFilter();
    if (e.target.id === 'gsearch') globalSearch(e.target.value);
    if (e.target.id === 'rv-note' && RV) RV.note = e.target.value;
  });
  document.addEventListener('keydown', function (e) {
    if (rvKey(e)) return;
    if (e.key === '/' && !/^(INPUT|TEXTAREA)$/.test((document.activeElement || {}).tagName || '')) {
      var s = $('#gsearch') || $('#qsearch'); if (s) { e.preventDefault(); s.focus(); }
    }
  });
  window.addEventListener('hashchange', render);
  $('#importfile').addEventListener('change', function () { if (this.files && this.files[0]) importProgress(this.files[0]); this.value = ''; });
  $('#burger').addEventListener('click', function () {
    var o = $('#side').classList.toggle('open');
    this.setAttribute('aria-expanded', String(o));
  });
  $('#theme').addEventListener('click', function () {
    var r = document.documentElement, n = r.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    r.setAttribute('data-theme', n);
    try { localStorage.setItem('prep-theme', n); } catch (e) {}
  });
  $('#reset').addEventListener('click', function () {
    if (window.confirm('Reset all progress? This cannot be undone.')) { state = {}; save(); render(); toast('Progress reset'); }
  });

  if (!IDS.length) { $('#view').innerHTML = '<div class="empty">Content files did not load. Keep the assets folder next to index.html.</div>'; return; }
  render();
})();
