window.PREP = window.PREP || {};
window.PREP.javascript = String.raw`
@title Core JavaScript
@icon code
@tagline The language under React and Node. Most lead-level interviews start here: closures, async, the event loop and writing clean ES6+.
@resume ES6+ used daily in React, Node.js and Angular | Performance work: code-splitting, caching | Reusable components and clean APIs

## ROADMAP

### Phase 1 · Foundations (Basic)
- Variables and scope: var, let, const, hoisting, temporal dead zone :: Predict output of hoisting snippets. Default to const, use let only when you reassign.
- Data types and coercion: primitives vs objects, == vs ===, truthy/falsy, typeof null :: Know the 7 primitives and the 5 falsy surprises (0, "", null, undefined, NaN).
- Modern operators: ??, ?., ||=, &&=, ??= :: Explain why ?? is safer than || for defaults like 0 or "".
- Functions: declaration, expression, arrow, default/rest/spread parameters :: Know how each treats this and arguments.
- Array methods: map, filter, reduce, find, some, every, flat, flatMap, at, toSorted :: Write each from memory; know which mutate (sort, splice, reverse).
- Objects: destructuring, spread, computed keys, Object.entries/fromEntries/hasOwn :: Practise reshaping API responses with these.
- Copying data: shallow vs deep, structuredClone, JSON pitfalls :: Know what JSON.parse(JSON.stringify(x)) loses (Date, undefined, Map, functions).
- Strings, template literals, Number precision, Date and Intl :: Know 0.1 + 0.2, Number.EPSILON and Intl.NumberFormat/DateTimeFormat.
- Loops: for, for...of, for...in, forEach :: for...of for values, for...in for keys only, forEach cannot await.
- Modules: ES modules vs CommonJS, named vs default exports :: Explain interop problems you hit in Node + React projects.
- Errors: try/catch/finally, throw, custom Error classes :: Always throw Error objects, never strings.
- DOM and events: querySelector, bubbling, capturing, delegation :: Needed to understand how React synthetic events work.

### Phase 2 · Core engine concepts (Intermediate)
- Execution context and call stack :: Draw the stack for a nested call and a recursion overflow.
- Closures :: Counters, private state, memoize; explain stale closures in React hooks.
- this binding: default, implicit, explicit (call/apply/bind), new, arrow :: Recite the 4 rules and fix a lost-this bug in a callback.
- Prototypes, inheritance and classes :: Class is sugar over prototypes; know private fields (#x) and static members.
- Event loop: call stack, microtask queue, macrotask queue :: Predict output order of setTimeout, Promise.then and sync code.
- Promises: states, chaining, all, allSettled, race, any :: Choose the right combinator for a given requirement.
- async/await patterns: error handling, parallel vs sequential, for...of with await :: Convert a callback chain to async/await.
- Iterators and generators :: Know Symbol.iterator and when a generator beats an array.
- Map, Set, WeakMap, WeakSet :: Use Map for dynamic keys, Set for uniqueness, WeakMap for private metadata.
- Higher-order functions, currying, composition, pure functions :: Pure functions are the base of Redux reducers and React rendering.
- fetch, AbortController and JSON :: Cancel in-flight requests; handle non-2xx (fetch does not reject on 404).
- Debounce and throttle :: Implement both; know which fits search box vs scroll handler.
- Immutability patterns :: Spread, map/filter, toSorted/with; why React state must not be mutated.

### Phase 3 · Advanced (Lead level)
- Memory management and leaks :: Listeners, timers, closures, detached DOM; find leaks in Chrome DevTools heap snapshots.
- Proxy and Reflect :: Understand how reactive systems (Vue) and validation layers are built.
- V8 basics: parsing, JIT, hidden classes, inline caching :: Keep object shapes stable and avoid delete for hot paths.
- Event loop in Node vs browser :: process.nextTick, setImmediate, queueMicrotask, timers phases.
- Concurrency tools: Web Workers, structuredClone, transferables :: Move CPU-heavy parsing off the main thread.
- Performance: layout thrash, reflow vs repaint, requestAnimationFrame, idle callbacks, lazy loading :: Measure first with the Performance panel.
- Design patterns: module, observer/pub-sub, factory, strategy, singleton :: Be able to implement an event emitter live.
- Security basics: XSS, CSRF, prototype pollution, eval, CSP :: Explain how you sanitise user content in React.
- Testing JavaScript: Jest, fake timers, mocking fetch, testing async code :: Test debounce with fake timers.
- Newer language features (check engine support): Object.groupBy, Promise.withResolvers, Set methods, array change-by-copy, iterator helpers :: Mention them to show you keep current.

## QA

### [basic] What is the difference between var, let and const? What is the temporal dead zone?
- ¦var¦ is function-scoped, hoisted and initialised as ¦undefined¦. It can be redeclared.
- ¦let¦ and ¦const¦ are block-scoped. They are hoisted but **not initialised** until the declaration line runs. Accessing them earlier throws a ¦ReferenceError¦. That window is the **temporal dead zone (TDZ)**.
- ¦const¦ prevents reassignment of the binding, not mutation of the object it points to.

¦¦¦js
console.log(a); // undefined (var is hoisted)
var a = 1;

console.log(b); // ReferenceError (TDZ)
let b = 2;

const user = { name: 'Asha' };
user.name = 'Ravi';   // allowed: object mutated
// user = {};         // TypeError: assignment to constant variable
¦¦¦

> In interviews: say "I use const by default, let when I must reassign, and never var."

### [basic] Explain == vs === and type coercion.
¦===¦ compares value and type with no conversion. ¦==¦ converts types first using coercion rules, which produces surprises.

¦¦¦js
0 == '';          // true
null == undefined; // true
null === undefined;// false
NaN === NaN;       // false -> use Number.isNaN(x)
[] == false;       // true
¦¦¦

Use ¦===¦ everywhere. The one accepted use of ¦==¦ is ¦x == null¦ to check both null and undefined.

### [basic] What is hoisting?
JavaScript allocates memory for declarations before running code.
- **Function declarations** are hoisted with their body, so you can call them before they appear.
- **var** is hoisted and set to ¦undefined¦.
- **let / const / class** are hoisted but stay in the TDZ.
- **Function expressions and arrow functions** follow the rule of the variable that holds them.

¦¦¦js
sayHi();            // works
function sayHi() { console.log('hi'); }

sayBye();           // TypeError: sayBye is not a function (var is undefined)
var sayBye = () => console.log('bye');
¦¦¦

### [basic] What is the difference between null and undefined? Why does typeof null return "object"?
¦undefined¦ means a variable was declared but has no value, or a property is missing. ¦null¦ is an intentional "no value" assigned by the programmer. ¦typeof null === 'object'¦ is a historical bug from the first JavaScript engine that was never fixed to avoid breaking the web. Check null with ¦value === null¦.

### [basic] Primitive vs reference types. What happens when you copy each?
Primitives (string, number, boolean, null, undefined, symbol, bigint) are copied **by value**. Objects, arrays and functions are copied **by reference**, so two variables point to the same object.

¦¦¦js
let a = 1, b = a; b++;           // a is still 1
const o1 = { n: 1 }, o2 = o1;
o2.n = 2;                         // o1.n is 2 as well
¦¦¦

This is why mutating state in React does not trigger re-renders: the reference is the same.

### [basic] Arrow functions vs regular functions.
| | Regular function | Arrow function |
|---|---|---|
| ¦this¦ | Depends on how it is called | Taken from the surrounding scope |
| ¦arguments¦ | Available | Not available (use rest ¦...args¦) |
| ¦new¦ | Can be a constructor | Cannot be used with ¦new¦ |
| Methods on objects/prototypes | Good fit | Bad fit (wrong ¦this¦) |

Use arrows for callbacks and inline handlers, regular functions or method shorthand for object methods.

### [basic] Explain spread, rest and destructuring with examples.
¦¦¦js
// Spread: expand
const merged = { ...defaults, ...overrides };
const next = [...items, newItem];

// Rest: collect
function sum(first, ...others) { return others.reduce((a, b) => a + b, first); }

// Destructuring: unpack, rename, default
const { id, name: title = 'Untitled', ...meta } = course;
const [first, , third] = list;
¦¦¦

Spread makes only a **shallow** copy. Nested objects still share references.

### [basic] map vs forEach vs filter vs reduce. Which mutate the array?
- ¦map¦ returns a new array of the same length (transform).
- ¦filter¦ returns a new array with items that pass a test.
- ¦reduce¦ folds the array into one value (sum, object, grouping).
- ¦forEach¦ returns nothing; use it for side effects only.
- Mutating methods: ¦push, pop, shift, unshift, splice, sort, reverse¦. Prefer ¦toSorted, toReversed, toSpliced, with¦ (copy versions) or spread.

¦¦¦js
const total = orders.filter(o => o.paid).map(o => o.amount).reduce((a, b) => a + b, 0);
¦¦¦

### [basic] for...in vs for...of vs forEach.
¦for...in¦ iterates enumerable **keys** (including inherited ones), so avoid it on arrays. ¦for...of¦ iterates **values** of any iterable (array, string, Map, Set) and supports ¦break¦ and ¦await¦. ¦forEach¦ cannot be stopped early and does not wait for async callbacks.

### [basic] Shallow copy vs deep copy. How do you deep clone?
Shallow copies (spread, ¦Object.assign¦, ¦slice¦) copy only the first level. For a deep copy use ¦structuredClone(obj)¦, which handles Date, Map, Set and circular references but not functions or class instances. ¦JSON.parse(JSON.stringify(x))¦ drops functions and ¦undefined¦, turns Dates into strings and fails on circular objects. For complex cases use a library such as lodash ¦cloneDeep¦ or, better, avoid deep copies by updating immutably.

### [intermediate] What is a closure? Give a practical use and a common bug.
A closure is a function that remembers the variables of the scope where it was created, even after that scope has finished.

¦¦¦js
function makeCounter() {
  let count = 0;                 // private state
  return { inc: () => ++count, get: () => count };
}
const c = makeCounter(); c.inc(); c.get(); // 1
¦¦¦

Uses: private state, memoization, debounce, function factories, React hooks.

**Common bug (stale closure)**: a callback captures an old value.
¦¦¦js
useEffect(() => {
  const id = setInterval(() => setCount(count + 1), 1000); // always uses the first count
  return () => clearInterval(id);
}, []);
// Fix: setCount(c => c + 1)
¦¦¦

### [intermediate] Explain how this works and the difference between call, apply and bind.
Rules in priority order: ¦new¦ binding, explicit binding (¦call/apply/bind¦), implicit binding (object before the dot), default (¦undefined¦ in strict mode / global in sloppy mode). Arrow functions ignore these rules and use the outer ¦this¦.

¦¦¦js
function intro(greet) { return greet + ', ' + this.name; }
const p = { name: 'Asha' };
intro.call(p, 'Hi');      // args one by one, runs now
intro.apply(p, ['Hi']);   // args as array, runs now
const bound = intro.bind(p, 'Hi'); // returns a new function
bound();
¦¦¦

Typical bug: ¦const f = obj.method; f()¦ loses ¦this¦. Fix with ¦bind¦, an arrow wrapper, or a class field arrow function.

### [intermediate] How does prototypal inheritance work? Is class a new inheritance model?
Every object has an internal link (¦[[Prototype]]¦) to another object. When a property is not found, the engine walks up this chain until it reaches ¦null¦. ES6 ¦class¦ is syntax sugar over this mechanism, with ¦extends¦ setting the prototype link and ¦super¦ calling the parent.

¦¦¦js
class Animal { speak() { return 'sound'; } }
class Dog extends Animal { speak() { return super.speak() + ' woof'; } }
Object.getPrototypeOf(Dog.prototype) === Animal.prototype; // true
¦¦¦

Private fields (¦#secret¦) are truly private; ¦_secret¦ is only a convention.

### [intermediate] Explain the event loop, microtasks and macrotasks.
JavaScript runs one thing at a time on the call stack. Async work is handled by the host (browser or Node), and finished callbacks wait in queues. After the stack is empty the loop runs **all microtasks** (Promise ¦then¦, ¦queueMicrotask¦, ¦MutationObserver¦) and then takes **one macrotask** (¦setTimeout¦, I/O, UI events), repeating forever.

¦¦¦js
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// 1 4 3 2
¦¦¦

Interview takeaway: a long synchronous task blocks rendering and all callbacks.

### [intermediate] Promise states and the difference between all, allSettled, race and any.
A promise is **pending**, then **fulfilled** or **rejected**, and never changes again.
| Method | Resolves when | Rejects when |
|---|---|---|
| ¦Promise.all¦ | all fulfil (array of values) | the first rejects |
| ¦Promise.allSettled¦ | all finish (status objects) | never |
| ¦Promise.race¦ | first settles | first settles with rejection |
| ¦Promise.any¦ | first fulfils | all reject (AggregateError) |

Use ¦all¦ for dependent data, ¦allSettled¦ for dashboards where partial data is fine, ¦race¦ for timeouts, ¦any¦ for fastest mirror.

### [intermediate] How do you handle errors with async/await? Sequential vs parallel?
Wrap awaits in ¦try/catch¦ (or attach ¦.catch¦). Do not ¦await¦ independent calls one after another.

¦¦¦js
// Slow: 2 seconds if each call takes 1s
const user = await getUser();
const orders = await getOrders();

// Fast: 1 second
const [user2, orders2] = await Promise.all([getUser(), getOrders()]);

// Unhandled rejection trap
items.forEach(async i => { await save(i); }); // errors are lost
await Promise.all(items.map(save));           // correct
¦¦¦

### [intermediate] Debounce vs throttle. When do you use each?
**Debounce** waits until the user stops triggering the event for N ms (search box, auto-save, window resize end). **Throttle** allows at most one call every N ms (scroll, mousemove, drag). Both rely on closures and timers. In React, memoise them (¦useMemo¦/¦useRef¦) so a re-render does not create a new debounced function.

### [intermediate] What is event delegation? Bubbling vs capturing?
Events travel in three phases: capture (window down to the target), target, bubble (target back up). Delegation attaches **one** listener on a parent and uses ¦event.target¦ to handle many children, including ones added later, which saves memory.

¦¦¦js
list.addEventListener('click', e => {
  const li = e.target.closest('li[data-id]');
  if (li) select(li.dataset.id);
});
¦¦¦

React attaches its listeners at the root container and delegates in the same way.

### [intermediate] What are currying and function composition?
Currying turns ¦f(a, b, c)¦ into ¦f(a)(b)(c)¦, so you can pre-fill arguments. Composition chains functions so the output of one feeds the next.

¦¦¦js
const add = a => b => a + b;
const add10 = add(10);
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
const slug = compose(s => s.replace(/\s+/g, '-'), s => s.toLowerCase(), s => s.trim());
slug('  Hello World '); // hello-world
¦¦¦

### [intermediate] Map vs Object, Set, WeakMap. When do you choose each?
- **Map**: any type as key, keeps insertion order, has ¦size¦, better for frequent add/delete.
- **Object**: fixed shape records and JSON data. Keys are strings or symbols.
- **Set**: unique values, fast ¦has¦. ¦[...new Set(arr)]¦ removes duplicates.
- **WeakMap / WeakSet**: keys must be objects and do not stop garbage collection. Use for private data or caches tied to an object lifetime.

### [intermediate] ES modules vs CommonJS.
CommonJS (¦require/module.exports¦) loads synchronously and evaluates at runtime, so it can be conditional. ES modules (¦import/export¦) are static, loaded asynchronously, enable tree shaking and use live bindings. In Node, a package uses ESM when ¦"type": "module"¦ is set or files end with ¦.mjs¦. Mixed projects need care: ESM can import CJS easily, but CJS needs dynamic ¦import()¦ to load ESM (newer Node versions also allow ¦require¦ for some ESM).

### [intermediate] What is ?? and how is it different from ||? What is optional chaining?
¦||¦ returns the right side for any falsy left value, including ¦0¦ and ¦''¦. ¦??¦ only does so for ¦null¦ or ¦undefined¦. ¦?.¦ stops and returns ¦undefined¦ when the left side is nullish.

¦¦¦js
const qty = input.qty ?? 1;        // keeps 0
const city = user?.address?.city;  // no TypeError
const first = list?.[0];
const out = handler?.(event);
¦¦¦

### [intermediate] What are generators and iterators?
An iterator is any object with ¦next()¦ returning ¦{ value, done }¦. A generator function (¦function*¦) produces an iterator and can pause with ¦yield¦, keeping its state. Use them for lazy sequences, paginated reads, and as the idea behind async iteration and old redux-saga.

¦¦¦js
function* ids() { let i = 1; while (true) yield i++; }
const it = ids(); it.next().value; // 1
¦¦¦

### [advanced] What causes memory leaks in JavaScript and how do you find them?
Common causes: event listeners never removed, ¦setInterval¦ never cleared, closures holding large objects, global variables, detached DOM nodes still referenced, unbounded caches and Maps, and subscriptions not cleaned up in React effects.

How to find: open Chrome DevTools → Memory → take heap snapshots before and after repeating an action, compare, look at "Detached" nodes and growing retained size; use the Performance monitor to watch JS heap and listener counts.

¦¦¦js
useEffect(() => {
  const onResize = () => setW(window.innerWidth);
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize); // cleanup
}, []);
¦¦¦

### [advanced] How does V8 run JavaScript? What does it mean for how you write code?
V8 parses code to an AST, the Ignition interpreter produces bytecode, and hot functions are compiled to optimised machine code by the TurboFan JIT. Optimisation relies on assumptions such as stable object shapes (hidden classes) and consistent types. So: initialise object properties in the same order, avoid changing a variable's type, avoid ¦delete¦ on hot objects, and prefer arrays of one type. Measure before micro-optimising; the biggest wins are usually network, rendering and algorithm choices.

### [advanced] What are Proxy and Reflect used for?
¦Proxy¦ wraps an object and intercepts operations (get, set, has, delete) through handler traps. ¦Reflect¦ provides the default behaviour for each trap. Uses: reactivity systems, validation, logging, default values, API clients that build calls dynamically.

¦¦¦js
const guarded = new Proxy({}, {
  set(t, k, v) { if (k === 'age' && v < 0) throw new RangeError('age'); return Reflect.set(t, k, v); }
});
¦¦¦

### [advanced] How do you avoid race conditions in async UI code (typeahead, route changes)?
Responses can arrive out of order, so an old slow request can overwrite a newer result. Cancel or ignore stale ones:

¦¦¦js
let controller;
async function search(q) {
  controller?.abort();
  controller = new AbortController();
  try {
    const res = await fetch('/api?q=' + encodeURIComponent(q), { signal: controller.signal });
    render(await res.json());
  } catch (e) { if (e.name !== 'AbortError') throw e; }
}
¦¦¦

In React Query / SWR this is handled for you; in plain effects use an ¦ignore¦ flag or AbortController in cleanup.

### [advanced] Explain prototype pollution and XSS and how to prevent them.
**Prototype pollution**: merging untrusted keys such as ¦__proto__¦ into an object changes ¦Object.prototype¦ for the whole app. Prevent by validating input, using ¦Object.create(null)¦ or ¦Map¦, and updating libraries. **XSS**: untrusted HTML runs as script. Prevent by escaping output (React does for text), avoiding ¦dangerouslySetInnerHTML¦ or sanitising with DOMPurify, setting a Content Security Policy, using ¦HttpOnly¦ cookies for tokens.

### [advanced] When would you use a Web Worker and how does it communicate?
When CPU-heavy work (parsing a huge CSV, image processing, crypto) would block the main thread and freeze the UI. A worker runs in a separate thread with no DOM access and communicates by ¦postMessage¦, copying data with structured clone or **transferring** buffers for zero-copy. Keep messages small and measure; the overhead is not worth it for small tasks.

### [advanced] How does ordering work in Node: process.nextTick, microtasks, setTimeout, setImmediate?
After the current operation, Node runs the ¦process.nextTick¦ queue first, then Promise microtasks, then moves through event loop phases (timers, pending callbacks, poll, check, close). ¦setImmediate¦ runs in the check phase, after I/O. Inside an I/O callback ¦setImmediate¦ always fires before ¦setTimeout(0)¦; from the main module the order is not guaranteed.

### [advanced] How do you make code immutable and why does it matter?
Immutability means creating new objects instead of changing existing ones. It makes change detection cheap (reference check), prevents accidental shared-state bugs, and makes time-travel and undo easy. Use spread, ¦map/filter¦, ¦toSorted¦, ¦structuredClone¦ for rare deep needs, and Immer when nested updates become noisy. ¦Object.freeze¦ is shallow and mostly useful in tests and dev.

## EXERCISES

### [basic] Predict the output (var vs let in loops)
What does this print, and how do you make the first loop print 0, 1, 2?

¦¦¦js
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);
for (let j = 0; j < 3; j++) setTimeout(() => console.log(j), 0);
¦¦¦
> Hint: Think about how many ¦i¦ variables exist and when the callbacks run.
--- solution ---
Output: ¦3 3 3 0 1 2¦. ¦var¦ creates one function-scoped ¦i¦; all callbacks run after the loop, when ¦i¦ is 3. ¦let¦ creates a new binding per iteration.

¦¦¦js
// Fix 1: use let
// Fix 2: closure (IIFE)
for (var i = 0; i < 3; i++) ((n) => setTimeout(() => console.log(n), 0))(i);
¦¦¦

### [basic] Group an array of objects by a key
Write ¦groupBy(items, key)¦ that returns an object of arrays. Example: group orders by ¦status¦.
¦¦¦js
groupBy([{id:1,s:'paid'},{id:2,s:'open'},{id:3,s:'paid'}], 's');
// { paid: [{id:1,s:'paid'},{id:3,s:'paid'}], open: [{id:2,s:'open'}] }
¦¦¦
--- solution ---
¦¦¦js
const groupBy = (items, key) =>
  items.reduce((acc, item) => {
    (acc[item[key]] ||= []).push(item);
    return acc;
  }, {});
¦¦¦
Modern engines also have ¦Object.groupBy(items, i => i.s)¦. Mention both.
--- starter ---
¦¦¦js
const groupBy = (items, key) => {
  // your code here
};
¦¦¦
--- tests ---
¦¦¦js
test('groups objects by the given key', () => {
  const out = groupBy([{ id: 1, s: 'paid' }, { id: 2, s: 'open' }, { id: 3, s: 'paid' }], 's');
  eq(out, { paid: [{ id: 1, s: 'paid' }, { id: 3, s: 'paid' }], open: [{ id: 2, s: 'open' }] });
});
test('returns an empty object for an empty array', () => {
  eq(groupBy([], 'x'), {});
});
test('keeps the original order inside each group', () => {
  const out = groupBy([{ n: 3, t: 'a' }, { n: 1, t: 'a' }, { n: 2, t: 'a' }], 't');
  eq(out.a.map(x => x.n), [3, 1, 2]);
});
test('works with numeric key values', () => {
  const out = groupBy([{ a: 1 }, { a: 2 }, { a: 1 }], 'a');
  eq(Object.keys(out).sort(), ['1', '2']);
  eq(out['1'].length, 2);
});
test('does not mutate the input', () => {
  const input = [{ k: 'x' }, { k: 'y' }];
  groupBy(input, 'k');
  eq(input, [{ k: 'x' }, { k: 'y' }]);
});
test('puts items with a missing key under "undefined"', () => {
  const out = groupBy([{ a: 1 }, { b: 2 }], 'a');
  eq(out['1'].length, 1);
  eq(out['undefined'].length, 1);
});
¦¦¦

### [intermediate] Implement debounce
Write ¦debounce(fn, wait)¦ that delays calling ¦fn¦ until ¦wait¦ ms after the last call, keeps ¦this¦ and arguments, and has a ¦cancel()¦ method.
> Hint: One timer id lives in the closure. Clear it on every call.
--- solution ---
¦¦¦js
function debounce(fn, wait = 300) {
  let t;
  function debounced(...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  }
  debounced.cancel = () => clearTimeout(t);
  return debounced;
}
¦¦¦
Follow-up: throttle keeps a "last run" timestamp and ignores calls inside the window. Leading vs trailing edge options are common extensions.
--- starter ---
¦¦¦js
function debounce(fn, wait = 300) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
const __wait = ms => new Promise(r => setTimeout(r, ms));
test('calls once, with the last arguments, after the wait', async () => {
  const calls = [];
  const d = debounce(x => calls.push(x), 30);
  d(1); d(2); d(3);
  eq(calls, []);
  await __wait(90);
  eq(calls, [3]);
});
test('does not call before the wait has passed', async () => {
  let n = 0;
  const d = debounce(() => n++, 60);
  d();
  await __wait(20);
  eq(n, 0);
  await __wait(80);
  eq(n, 1);
});
test('every new call restarts the timer', async () => {
  let n = 0;
  const d = debounce(() => n++, 40);
  d();
  await __wait(25); d();
  await __wait(25); d();
  await __wait(25);
  eq(n, 0);
  await __wait(60);
  eq(n, 1);
});
test('keeps the "this" of the caller', async () => {
  const obj = { v: 7, out: 0, f: debounce(function () { this.out = this.v; }, 10) };
  obj.f();
  await __wait(50);
  eq(obj.out, 7);
});
test('cancel() stops a pending call', async () => {
  let n = 0;
  const d = debounce(() => n++, 20);
  d();
  d.cancel();
  await __wait(60);
  eq(n, 0);
});
test('fires again for a call made after the previous one ran', async () => {
  let n = 0;
  const d = debounce(() => n++, 15);
  d();
  await __wait(50);
  d();
  await __wait(50);
  eq(n, 2);
});
¦¦¦

### [intermediate] Implement memoize
Write ¦memoize(fn)¦ that caches results by arguments. Make it work for multiple arguments.
--- solution ---
¦¦¦js
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
const slowSquare = n => n * n;
const fast = memoize(slowSquare);
¦¦¦
Discuss limits: JSON keys fail for functions/circular args, caches can grow forever (use an LRU or ¦WeakMap¦ when keys are objects), and only pure functions are safe to memoise.
--- starter ---
¦¦¦js
function memoize(fn) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
test('returns the cached result for repeated arguments', () => {
  let n = 0;
  const f = memoize((a, b) => { n++; return a + b; });
  eq(f(1, 2), 3);
  eq(f(1, 2), 3);
  eq(n, 1);
});
test('different arguments are cached separately', () => {
  let n = 0;
  const f = memoize((a, b) => { n++; return a - b; });
  eq(f(5, 2), 3);
  eq(f(2, 5), -3);
  eq(n, 2);
});
test('works with several arguments and zero arguments', () => {
  let n = 0;
  const f = memoize((...xs) => { n++; return xs.length; });
  eq(f(), 0); eq(f(), 0);
  eq(f(1, 2, 3), 3); eq(f(1, 2, 3), 3);
  eq(n, 2);
});
test('treats equal object arguments as the same call', () => {
  let n = 0;
  const f = memoize(o => { n++; return o.a * 2; });
  eq(f({ a: 4 }), 8);
  eq(f({ a: 4 }), 8);
  eq(n, 1);
});
test('keeps "this"', () => {
  const o = { k: 3, m: memoize(function (x) { return this.k * x; }) };
  eq(o.m(2), 6);
});
test('caches falsy results too', () => {
  let n = 0;
  const f = memoize(x => { n++; return x === 1 ? 0 : null; });
  f(1); f(1); f(2); f(2);
  eq(n, 2);
});
¦¦¦

### [intermediate] Predict the event-loop output
¦¦¦js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
(async () => {
  console.log('D');
  await null;
  console.log('E');
})();
console.log('F');
¦¦¦
> Hint: Sync code first. Code after await becomes a microtask.
--- solution ---
Output: ¦A D F C E B¦.
1. Sync: A, D (the async function runs synchronously until the first await), F.
2. Microtasks in order queued: C (promise then), E (continuation after await).
3. Macrotask: B.

### [intermediate] Write your own Promise.all
Implement ¦promiseAll(promises)¦ returning a promise of all results in order, rejecting on the first failure.
--- solution ---
¦¦¦js
function promiseAll(items) {
  return new Promise((resolve, reject) => {
    const list = [...items];
    const results = new Array(list.length);
    let remaining = list.length;
    if (!remaining) return resolve(results);
    list.forEach((p, i) => {
      Promise.resolve(p).then(v => {
        results[i] = v;
        if (--remaining === 0) resolve(results);
      }, reject);
    });
  });
}
¦¦¦
Key points: keep order by index, wrap with ¦Promise.resolve¦ so plain values work, handle an empty array.
--- starter ---
¦¦¦js
function promiseAll(items) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
const __delay = (ms, v) => new Promise(r => setTimeout(() => r(v), ms));
test('resolves with results in input order, not completion order', async () => {
  const out = await promiseAll([__delay(40, 'a'), __delay(5, 'b'), __delay(20, 'c')]);
  eq(out, ['a', 'b', 'c']);
});
test('accepts plain values mixed with promises', async () => {
  eq(await promiseAll([1, Promise.resolve(2), __delay(5, 3)]), [1, 2, 3]);
});
test('resolves an empty array to an empty array', async () => {
  eq(await promiseAll([]), []);
});
test('rejects with the first failure', async () => {
  let msg = '';
  try {
    await promiseAll([__delay(30, 1), Promise.reject(new Error('boom')), __delay(5, 3)]);
  } catch (e) { msg = e.message; }
  eq(msg, 'boom');
});
test('rejects early without waiting for slow promises', async () => {
  const t0 = Date.now();
  try { await promiseAll([__delay(100, 1), Promise.reject(new Error('fast'))]); } catch (e) {}
  ok(Date.now() - t0 < 80, 'should reject immediately');
});
test('accepts any iterable (a Set)', async () => {
  eq(await promiseAll(new Set([1, 2])), [1, 2]);
});
¦¦¦

### [intermediate] Retry with exponential backoff
Write ¦retry(fn, { retries, delay })¦ that retries a failing async function, doubling the delay each time.
--- solution ---
¦¦¦js
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function retry(fn, { retries = 3, delay = 200 } = {}) {
  let attempt = 0;
  while (true) {
    try { return await fn(); }
    catch (err) {
      if (attempt++ >= retries) throw err;
      await sleep(delay * 2 ** (attempt - 1));
    }
  }
}
¦¦¦
Production tips: add jitter (random extra delay), retry only on retryable errors (network, 5xx, 429) and never on 4xx validation errors.
--- starter ---
¦¦¦js
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function retry(fn, { retries = 3, delay = 200 } = {}) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
test('returns the value when the first attempt works', async () => {
  let calls = 0;
  const v = await retry(async () => { calls++; return 'ok'; }, { retries: 3, delay: 5 });
  eq(v, 'ok');
  eq(calls, 1);
});
test('retries until it succeeds', async () => {
  let calls = 0;
  const v = await retry(async () => { calls++; if (calls < 3) throw new Error('fail'); return 'done'; }, { retries: 5, delay: 5 });
  eq(v, 'done');
  eq(calls, 3);
});
test('throws the last error once retries are used up', async () => {
  let calls = 0, msg = '';
  try { await retry(async () => { calls++; throw new Error('e' + calls); }, { retries: 2, delay: 5 }); }
  catch (e) { msg = e.message; }
  eq(calls, 3);
  eq(msg, 'e3');
});
test('retries = 0 means a single attempt', async () => {
  let calls = 0;
  try { await retry(async () => { calls++; throw new Error('x'); }, { retries: 0, delay: 5 }); } catch (e) {}
  eq(calls, 1);
});
test('the delay doubles between attempts', async () => {
  const stamps = [];
  try { await retry(async () => { stamps.push(Date.now()); throw new Error('x'); }, { retries: 3, delay: 20 }); } catch (e) {}
  const gaps = [stamps[1] - stamps[0], stamps[2] - stamps[1], stamps[3] - stamps[2]];
  ok(gaps[0] >= 15 && gaps[0] < 38, 'first gap about 20ms, got ' + gaps[0]);
  ok(gaps[1] >= 33 && gaps[1] < 70, 'second gap about 40ms, got ' + gaps[1]);
  ok(gaps[2] >= 70, 'third gap about 80ms, got ' + gaps[2]);
});
¦¦¦

### [advanced] Promise pool with a concurrency limit
Run an array of async tasks with at most ¦limit¦ running at the same time and return results in order.
> Hint: Start ¦limit¦ workers; each worker takes the next index until none are left.
--- solution ---
¦¦¦js
async function pool(tasks, limit = 3) {
  const results = new Array(tasks.length);
  let next = 0;
  async function worker() {
    while (next < tasks.length) {
      const i = next++;
      results[i] = await tasks[i]();
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));
  return results;
}
// usage (fetch is only an example):
// pool(urls.map(u => () => fetch(u).then(r => r.json())), 4);
¦¦¦
This is a common lead-level question for bulk uploads or API rate limits.
--- starter ---
¦¦¦js
async function pool(tasks, limit = 3) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
const __d = (ms, v) => () => new Promise(r => setTimeout(() => r(v), ms));
test('returns results in task order', async () => {
  const out = await pool([__d(30, 'a'), __d(5, 'b'), __d(15, 'c')], 2);
  eq(out, ['a', 'b', 'c']);
});
test('never runs more than "limit" tasks at once', async () => {
  let active = 0, peak = 0;
  const task = n => async () => {
    active++; peak = Math.max(peak, active);
    await new Promise(r => setTimeout(r, 15));
    active--;
    return n;
  };
  const out = await pool([1, 2, 3, 4, 5, 6, 7].map(task), 3);
  eq(out, [1, 2, 3, 4, 5, 6, 7]);
  eq(peak, 3);
});
test('works when the limit is higher than the number of tasks', async () => {
  eq(await pool([__d(5, 1), __d(5, 2)], 10), [1, 2]);
});
test('returns an empty array for no tasks', async () => {
  eq(await pool([], 3), []);
});
test('limit 1 runs tasks one after another', async () => {
  const order = [];
  const t = n => async () => { order.push('s' + n); await new Promise(r => setTimeout(r, 5)); order.push('e' + n); };
  await pool([t(1), t(2), t(3)], 1);
  eq(order, ['s1', 'e1', 's2', 'e2', 's3', 'e3']);
});
test('propagates a rejected task', async () => {
  let msg = '';
  try { await pool([__d(5, 1), async () => { throw new Error('bad'); }], 2); } catch (e) { msg = e.message; }
  eq(msg, 'bad');
});
¦¦¦

### [advanced] Deep clone with circular reference support
Implement ¦deepClone(value)¦ for plain objects, arrays, Dates, Maps and Sets without recursing forever on cycles.
--- solution ---
¦¦¦js
function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);
  if (value instanceof Date) return new Date(value);
  if (value instanceof Map) {
    const m = new Map(); seen.set(value, m);
    value.forEach((v, k) => m.set(deepClone(k, seen), deepClone(v, seen)));
    return m;
  }
  if (value instanceof Set) {
    const s = new Set(); seen.set(value, s);
    value.forEach(v => s.add(deepClone(v, seen)));
    return s;
  }
  const out = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));
  seen.set(value, out);
  for (const key of Reflect.ownKeys(value)) out[key] = deepClone(value[key], seen);
  return out;
}
¦¦¦
Say that in real code you would call ¦structuredClone¦ first and use this only to show understanding.
--- starter ---
¦¦¦js
function deepClone(value, seen = new WeakMap()) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
test('copies nested objects and arrays without sharing references', () => {
  const src = { a: 1, b: { c: [1, 2, { d: 3 }] } };
  const out = deepClone(src);
  eq(out, src);
  ok(out !== src && out.b !== src.b && out.b.c !== src.b.c && out.b.c[2] !== src.b.c[2], 'must be new objects');
  out.b.c[2].d = 99;
  eq(src.b.c[2].d, 3);
});
test('returns primitives and null as they are', () => {
  eq(deepClone(5), 5);
  eq(deepClone('x'), 'x');
  eq(deepClone(null), null);
  eq(deepClone(undefined), undefined);
});
test('clones Date objects', () => {
  const d = new Date(2020, 1, 2);
  const out = deepClone({ d }).d;
  ok(out instanceof Date && out !== d, 'should be a new Date');
  eq(out.getTime(), d.getTime());
});
test('clones Map and Set including nested values', () => {
  const m = new Map([['k', { x: 1 }]]);
  const s = new Set([1, 2]);
  const out = deepClone({ m, s });
  ok(out.m instanceof Map && out.s instanceof Set, 'types kept');
  ok(out.m.get('k') !== m.get('k'), 'map value must be cloned');
  eq(out.m.get('k'), { x: 1 });
  eq(Array.from(out.s), [1, 2]);
});
test('handles circular references', () => {
  const a = { name: 'a' };
  a.self = a;
  const out = deepClone(a);
  ok(out !== a, 'new object');
  ok(out.self === out, 'cycle should point to the clone');
  eq(out.name, 'a');
});
test('keeps shared references shared inside the clone', () => {
  const shared = { v: 1 };
  const out = deepClone({ x: shared, y: shared });
  ok(out.x === out.y, 'x and y should still be the same object');
  ok(out.x !== shared, 'but not the original');
});
test('keeps the prototype of class instances', () => {
  class P { constructor() { this.n = 1; } hi() { return 'hi'; } }
  const out = deepClone(new P());
  eq(out.hi(), 'hi');
  ok(out instanceof P, 'prototype kept');
});
¦¦¦

### [advanced] Build a tiny event emitter
Implement ¦on(event, fn)¦, ¦off(event, fn)¦, ¦once(event, fn)¦ and ¦emit(event, ...args)¦. ¦on¦ should return an unsubscribe function.
--- solution ---
¦¦¦js
class Emitter {
  #map = new Map();
  on(evt, fn) {
    if (!this.#map.has(evt)) this.#map.set(evt, new Set());
    this.#map.get(evt).add(fn);
    return () => this.off(evt, fn);
  }
  off(evt, fn) { this.#map.get(evt)?.delete(fn); }
  once(evt, fn) {
    const off = this.on(evt, (...a) => { off(); fn(...a); });
    return off;
  }
  emit(evt, ...args) { [...(this.#map.get(evt) ?? [])].forEach(fn => fn(...args)); }
}
¦¦¦
Talking points: copying the set before iterating lets listeners remove themselves safely; returning an unsubscribe function makes React effect cleanup easy.
--- starter ---
¦¦¦js
class Emitter {
  on(evt, fn) {
    // your code here
  }
  off(evt, fn) {
    // your code here
  }
  once(evt, fn) {
    // your code here
  }
  emit(evt, ...args) {
    // your code here
  }
}
¦¦¦
--- tests ---
¦¦¦js
test('on + emit passes all arguments to the listener', () => {
  const e = new Emitter(), got = [];
  e.on('x', (...a) => got.push(a));
  e.emit('x', 1, 'two');
  eq(got, [[1, 'two']]);
});
test('listeners run in the order they were added', () => {
  const e = new Emitter(), order = [];
  e.on('x', () => order.push(1));
  e.on('x', () => order.push(2));
  e.emit('x');
  eq(order, [1, 2]);
});
test('on returns an unsubscribe function', () => {
  const e = new Emitter(); let n = 0;
  const off = e.on('x', () => n++);
  e.emit('x');
  off();
  e.emit('x');
  eq(n, 1);
});
test('off removes a specific listener only', () => {
  const e = new Emitter(); let a = 0, b = 0;
  const fa = () => a++, fb = () => b++;
  e.on('x', fa); e.on('x', fb);
  e.off('x', fa);
  e.emit('x');
  eq([a, b], [0, 1]);
});
test('once fires a single time', () => {
  const e = new Emitter(); let n = 0;
  e.once('x', () => n++);
  e.emit('x'); e.emit('x');
  eq(n, 1);
});
test('emit on an unknown event does not throw', () => {
  const e = new Emitter();
  e.emit('nothing', 1, 2);
  ok(true);
});
test('a listener can remove itself while emitting', () => {
  const e = new Emitter(), calls = [];
  const self = () => { calls.push('self'); e.off('x', self); };
  e.on('x', self);
  e.on('x', () => calls.push('other'));
  e.emit('x');
  e.emit('x');
  eq(calls, ['self', 'other', 'other']);
});
¦¦¦

## SCENARIOS

### A page in the Clinical Learning Hub feels slow. How do you find and fix the JavaScript part of the problem?
1. **Reproduce and measure**: Chrome DevTools Performance panel on a throttled CPU and network profile; check Lighthouse and Core Web Vitals (LCP, INP, CLS).
2. **Find the cost**: long tasks (over 50 ms), large JS bundles (webpack/Vite analyzer), repeated renders, heavy loops, or big JSON parsing.
3. **Fix in order of impact**: code-split routes and heavy widgets with ¦import()¦; remove unused libraries; memoise expensive calculations; virtualise long lists; debounce input handlers; move heavy work to a Web Worker; cache API data.
4. **Prove it**: compare before and after numbers and add a performance budget to CI.

Tie it to your resume: "code-splitting, query optimisation and caching improved page load and API response times by 30–40%". Be ready to explain exactly what you measured.

### A bug only reproduces in production for some users. How do you debug it?
Collect evidence first: error tracking (Sentry or similar), browser and OS, user steps, request IDs and logs. Check source maps are uploaded so stack traces are readable. Try to reproduce with the same browser version and slow network. Look for race conditions, undefined data from the API, timezone or locale issues, and feature flags. Ship the fix behind a flag or small release, add a regression test, and write a short post-mortem.

### Two API calls return out of order and the UI shows stale data. What do you do?
Describe the typeahead race: cancel the previous request with ¦AbortController¦ or ignore results whose request id is not the latest. Mention that libraries such as React Query handle keys, cancellation and caching. Add a test that resolves the second promise before the first.

### A junior developer's pull request has nested callbacks, mutated state and unhandled promises. How do you review it?
Explain your review style: start with what is good, then focus on correctness (unhandled rejections, ¦forEach¦ with ¦async¦, shared mutable state), then readability (async/await, small pure functions, naming), then tests. Offer a pairing session or a short example instead of only comments. Add lint rules (¦no-floating-promises¦, ¦prefer-const¦) so tools enforce the basics.

### The single-page app gets slower the longer it stays open. What is your approach?
Suspect a memory leak. Take heap snapshots after repeating an action several times, compare, and look for growing listeners, timers, detached DOM and caches. Fix missing cleanup in effects, cap caches, and verify by repeating the snapshot test. Add a note in the team checklist: every subscription needs an unsubscribe.
`;
