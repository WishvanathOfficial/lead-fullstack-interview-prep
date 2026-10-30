/* Test harness. HARNESS_LIB and HARNESS are stringified into a Web Worker / sandboxed iframe, and also
   run in Node by tools/check-tests.js. Both must stay self-contained (no references to outer variables). */
(function (root) {
  function HARNESS_LIB() {
    var logs = [], queue = [], L = { logs: logs, err: '' };

    function fmt(v, d) {
      d = d || 0;
      if (d > 4) return '…';
      if (v === undefined) return 'undefined';
      if (v === null) return 'null';
      if (typeof v === 'string') return d ? JSON.stringify(v) : v;
      if (typeof v === 'function') return '[Function' + (v.name ? ': ' + v.name : '') + ']';
      if (typeof v === 'bigint') return v + 'n';
      if (typeof v !== 'object') return String(v);
      if (Array.isArray(v)) return '[' + v.map(function (x) { return fmt(x, d + 1); }).join(', ') + ']';
      if (v instanceof Map) return 'Map(' + v.size + ') {' + Array.from(v).map(function (p) { return fmt(p[0], d + 1) + ' => ' + fmt(p[1], d + 1); }).join(', ') + '}';
      if (v instanceof Set) return 'Set(' + v.size + ') {' + Array.from(v).map(function (x) { return fmt(x, d + 1); }).join(', ') + '}';
      if (v instanceof Date) return v.toISOString();
      if (v instanceof Error) return v.name + ': ' + v.message;
      try {
        var keys = Object.keys(v);
        return '{' + keys.map(function (k) { return k + ': ' + fmt(v[k], d + 1); }).join(', ') + '}';
      } catch (e) { return '[Object]'; }
    }

    function deepEqual(a, b, d) {
      d = d || 0;
      if (a === b || (a !== a && b !== b)) return true;
      if (d > 30 || typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
      if (Array.isArray(a) !== Array.isArray(b)) return false;
      if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
      if (a instanceof Map && b instanceof Map) {
        if (a.size !== b.size) return false;
        var ok = true;
        a.forEach(function (v, k) { if (!b.has(k) || !deepEqual(v, b.get(k), d + 1)) ok = false; });
        return ok;
      }
      if (a instanceof Set && b instanceof Set) {
        if (a.size !== b.size) return false;
        var ok2 = true;
        a.forEach(function (v) { if (!b.has(v)) ok2 = false; });
        return ok2;
      }
      var ka = Object.keys(a), kb = Object.keys(b);
      if (ka.length !== kb.length) return false;
      for (var i = 0; i < ka.length; i++) {
        if (!Object.prototype.hasOwnProperty.call(b, ka[i]) || !deepEqual(a[ka[i]], b[ka[i]], d + 1)) return false;
      }
      return true;
    }

    var con = {};
    ['log', 'info', 'warn', 'error', 'debug'].forEach(function (m) {
      con[m] = function () {
        var line = Array.prototype.map.call(arguments, function (x) { return fmt(x); }).join(' ');
        logs.push(m === 'error' || m === 'warn' ? m + ': ' + line : line);
        if (logs.length > 300) logs.shift();
      };
    });
    con.table = con.log; con.dir = con.log; con.group = function () {}; con.groupEnd = function () {};

    function test(name, fn) { queue.push({ name: String(name), fn: fn }); }
    function eq(actual, expected, msg) {
      if (!deepEqual(actual, expected)) throw new Error((msg ? msg + ': ' : '') + 'expected ' + fmt(expected, 1) + ' but got ' + fmt(actual, 1));
    }
    function ok(cond, msg) { if (!cond) throw new Error(msg || 'expected a truthy value'); }
    function throws(fn, msg) {
      var threw = false;
      try { fn(); } catch (e) { threw = true; }
      if (!threw) throw new Error(msg || 'expected the function to throw');
    }
    function sameItems(actual, expected, msg) {
      var norm = function (arr) { return arr.map(function (x) { return JSON.stringify(x); }).sort(); };
      if (!Array.isArray(actual)) throw new Error((msg ? msg + ': ' : '') + 'expected an array but got ' + fmt(actual, 1));
      eq(norm(actual), norm(expected), msg);
    }
    function approx(a, b, eps) {
      if (Math.abs(a - b) > (eps || 1e-6)) throw new Error('expected about ' + b + ' but got ' + a);
    }
    L.con = con; L.test = test; L.eq = eq; L.ok = ok; L.throws = throws; L.sameItems = sameItems; L.approx = approx;
    L.assert = { equal: eq, deepEqual: eq, ok: ok, throws: throws, sameItems: sameItems, approx: approx };

    /* Run the registered tests one by one and report through post(). */
    L.run = function (post) {
      if (L.err) { post({ type: 'error', message: L.err, logs: logs }); return; }
      var results = [], idx = 0;
      function next() {
        if (idx >= queue.length) { post({ type: 'done', results: results, logs: logs }); return; }
        var t = queue[idx++], t0 = Date.now();
        function finish(err) {
          results.push({ name: t.name, pass: !err, error: err ? (err && err.message ? err.message : String(err)) : '', ms: Date.now() - t0 });
          next();
        }
        try {
          var r = t.fn();
          if (r && typeof r.then === 'function') r.then(function () { finish(null); }, function (e) { finish(e || new Error('rejected')); });
          else finish(null);
        } catch (e) { finish(e); }
      }
      next();
    };
    return L;
  }

  /* Eval-based runner (Worker and Node): compiles user code and tests into one function scope. */
  function HARNESS(user, tests, post) {
    var L = HARNESS_LIB(), compiled;
    try {
      /* eslint-disable no-new-func */
      compiled = new Function('console', 'test', 'eq', 'ok', 'throws', 'sameItems', 'approx', 'assert', user + '\n;\n' + tests + '\n;');
    } catch (e) {
      post({ type: 'error', message: e.name + ': ' + e.message, logs: L.logs });
      return;
    }
    try {
      compiled(L.con, L.test, L.eq, L.ok, L.throws, L.sameItems, L.approx, L.assert);
    } catch (e) {
      post({ type: 'error', message: e.name + ': ' + e.message, logs: L.logs });
      return;
    }
    L.run(post);
  }

  root.HARNESS = HARNESS;
  root.HARNESS_LIB = HARNESS_LIB;
  if (typeof module !== 'undefined' && module.exports) module.exports = HARNESS;
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : globalThis));
