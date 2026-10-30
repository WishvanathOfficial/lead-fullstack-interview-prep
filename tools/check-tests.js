/* Verifies that every exercise with a "--- tests ---" block passes its tests with the shipped solution,
   and that the starter code does NOT already pass (so the exercise is not trivially done).
   Usage:  node tools/check-tests.js [subjectId ...]            */
const fs = require('fs'), path = require('path'), vm = require('vm');
const HARNESS = require('../assets/js/harness.js');
const root = path.join(__dirname, '..', 'assets', 'js', 'data');
const only = process.argv.slice(2);
process.on('unhandledRejection', () => {});

function clean(raw) { return String(raw || '').replace(/\r\n/g, '\n').replace(/¦/g, '`').replace(/§\{/g, '${'); }
function fence(text) {
  const m = /^```[a-z]*\n([\s\S]*?)^```/m.exec(text || '');
  return m ? m[1] : '';
}
function run(user, tests) {
  return new Promise(resolve => {
    const t = setTimeout(() => resolve({ type: 'error', message: 'timeout' }), 6000);
    try { HARNESS(user, tests, r => { clearTimeout(t); resolve(r); }); }
    catch (e) { clearTimeout(t); resolve({ type: 'error', message: String(e) }); }
  });
}

(async () => {
  let total = 0, bad = 0, trivial = 0;
  for (const f of fs.readdirSync(root)) {
    const id = f.replace('.js', '');
    if (id === 'plan' || (only.length && !only.includes(id))) continue;
    const w = { PREP: {} }; w.window = w;
    vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), vm.createContext(w));
    const text = clean(w.PREP[id]);
    const sec = (text.split(/^## EXERCISES\s*$/m)[1] || '').split(/^## /m)[0];
    const exs = sec.split(/^### /m).slice(1);
    let n = 0;
    for (const e of exs) {
      const title = e.split('\n')[0];
      const parts = e.split(/^--- (solution|starter|tests) ---$/m);
      const map = {};
      for (let i = 1; i < parts.length; i += 2) map[parts[i]] = parts[i + 1];
      if (!map.tests) continue;
      n++; total++;
      const r = await run(fence(map.solution), fence(map.tests));
      if (r.type === 'error') { bad++; console.log('FAIL', id, '|', title, '|', r.message); continue; }
      const failed = r.results.filter(x => !x.pass);
      if (!r.results.length) { bad++; console.log('FAIL', id, '|', title, '| no tests registered'); continue; }
      if (failed.length) { bad++; console.log('FAIL', id, '|', title, '|', failed.map(x => x.name + ': ' + x.error).join(' ; ')); continue; }
      if (map.starter) {
        const s = await run(fence(map.starter), fence(map.tests));
        if (s.type === 'done' && s.results.length && s.results.every(x => x.pass)) { trivial++; console.log('WARN starter already passes:', id, '|', title); }
      } else { console.log('WARN no starter:', id, '|', title); }
    }
    if (n) console.log(id.padEnd(11), n, 'exercises with tests');
  }
  console.log('checked', total, 'failures', bad, 'trivial starters', trivial);
  process.exit(bad ? 1 : 0);
})();
