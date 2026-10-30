window.PREP_NOTES = window.PREP_NOTES || {};
window.PREP_NOTES.javascript = String.raw`
## Phase 1 · Foundations (Basic)
### Variables and scope: var, let, const, hoisting, temporal dead zone
#### In one line
Variables are named boxes for values; **scope** decides where a box can be seen, and **hoisting** decides what exists before the line that declares it runs.

#### Real-life analogy
Think of a hospital. A **var** is a notice on the hospital's main board (visible in the whole building, function scope). A **let/const** is a note stuck on one ward's door (only visible inside that ward, block scope). Hoisting is the hospital printing the ward names before opening: the names exist, but until the patient (value) arrives, **let/const** wards are locked (temporal dead zone).

#### How it works
- ¦var¦ is function-scoped, hoisted and initialised to ¦undefined¦. You can read it before the line runs (and get ¦undefined¦).
- ¦let¦ and ¦const¦ are block-scoped (inside ¦{ }¦). They are hoisted too, but stay **uninitialised** until the declaration runs. Reading them earlier throws ¦ReferenceError¦. That gap is the **temporal dead zone (TDZ)**.
- ¦const¦ forbids *re-assigning* the binding. It does not freeze the object: you can still change ¦obj.name¦.
- Function declarations are fully hoisted (name + body). Function expressions assigned with ¦var¦ only hoist the name as ¦undefined¦.
- Top-level ¦var¦ in a script creates a property on ¦window¦; ¦let/const¦ do not.

#### Example
¦¦¦js
console.log(course);          // undefined (var hoisted)
var course = 'React';

try { console.log(level); } catch (e) { console.log(e.name); } // ReferenceError (TDZ)
let level = 2;

const learner = { name: 'Asha' };
learner.name = 'Ravi';        // allowed: object is mutable
// learner = {};              // TypeError: Assignment to constant variable

// Classic loop bug
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i)); // 3 3 3
for (let j = 0; j < 3; j++) setTimeout(() => console.log(j)); // 0 1 2 (new j per iteration)
¦¦¦

#### Remember it
- **Default to const**, use let when you must reassign, avoid var.
- var = function scope + undefined; let/const = block scope + TDZ.
- const protects the *binding*, not the *value*.

| Keyword | Scope | Hoisted value | Re-assign |
|---|---|---|---|
| var | function | undefined | yes |
| let | block | TDZ | yes |
| const | block | TDZ | no |

#### Common mistakes
- Thinking ¦const¦ makes objects immutable (use ¦Object.freeze¦ for shallow freezing).
- Using ¦var¦ in loops with async callbacks.
- Assuming let/const are not hoisted (they are, but in the TDZ).

#### Interview angle
**Model answer:** "var is function-scoped and initialised to undefined at hoisting time. let and const are block-scoped and live in the temporal dead zone until their declaration runs, so early access throws. I default to const and use let only when I reassign."
**Follow-up:** *Why does the var loop print 3 3 3?* One shared binding; by the time callbacks run, i is 3.

### Data types and coercion: primitives vs objects, == vs ===, truthy/falsy, typeof null
#### In one line
JavaScript has 7 primitive types (immutable values) and objects (everything else); coercion is the automatic conversion between types, which is why ¦==¦ can surprise you.

#### Real-life analogy
Primitives are like **cash notes**: you hand over a copy, and the value is the value. Objects are like a **house key**: when you copy the key, both keys open the same house, so changes by one person are seen by the other.

#### How it works
- Primitives: ¦string, number, boolean, null, undefined, symbol, bigint¦. Compared **by value**.
- Objects (arrays, functions, dates, maps): compared **by reference**; ¦{} === {}¦ is ¦false¦.
- ¦===¦ compares without conversion. ¦==¦ converts types first (rules are complex), so avoid it. One accepted use: ¦x == null¦ checks both ¦null¦ and ¦undefined¦.
- **Falsy values (8):** ¦false, 0, -0, 0n, "", null, undefined, NaN¦. Everything else is truthy, including ¦"0"¦, ¦[]¦ and ¦{}¦.
- ¦typeof null¦ is ¦"object"¦, a historical bug that cannot be fixed. Use ¦x === null¦.
- ¦NaN !== NaN¦. Use ¦Number.isNaN(x)¦ or ¦Object.is¦.

#### Example
¦¦¦js
console.log(typeof 42, typeof 'a', typeof undefined, typeof null); // number string undefined object
console.log(0 == '', 0 == '0', '' == '0');   // true true false  (the == chaos)
console.log(0 === '', null === undefined);   // false false

console.log([] == false, !![]);              // true true  (empty array is truthy!)
console.log(Boolean('0'), Boolean(''));      // true false

const a = { id: 1 }, b = { id: 1 };
console.log(a === b, a === a);               // false true

// Safe empty-array check for API results
const results = [];
if (!results.length) console.log('No courses found');
¦¦¦

#### Remember it
- **7 primitives:** *S-N-B-N-U-S-B* (string, number, boolean, null, undefined, symbol, bigint).
- **Falsy: "Zero, Empty, Null, Un-defined, Not-a-number, False".**
- Always ¦===¦. Objects compare by reference.

#### Common mistakes
- ¦if (value)¦ when ¦0¦ or ¦""¦ is valid data.
- Using ¦typeof¦ to check for null or arrays (use ¦Array.isArray¦).
- Comparing objects with ¦===¦ expecting a deep comparison.

#### Interview angle
**Model answer:** "Primitives are immutable and compared by value; objects are compared by reference. I use strict equality to avoid coercion surprises, and I remember typeof null is object because of a legacy bug."
**Follow-up:** *Is [] == ![] true?* Yes: ¦![]¦ is false, then ¦[]¦ becomes ¦""¦ then ¦0¦, and ¦false¦ becomes ¦0¦.

### Modern operators: ??, ?., ||=, &&=, ??=
#### In one line
These operators let you set defaults, read deep properties safely and assign conditionally with less code and fewer bugs.

#### Real-life analogy
Delivering a parcel: **?.** is "if the building has a door, knock; otherwise stop, don't crash". **??** is "if the address is *missing* use the default address" (an address of "0" is still an address).

#### How it works
- ¦a ?? b¦ returns ¦b¦ only when ¦a¦ is ¦null¦ or ¦undefined¦. ¦a || b¦ returns ¦b¦ for **any falsy** value (0, "", false).
- ¦a?.b¦, ¦a?.[k]¦, ¦a?.()¦ short-circuit to ¦undefined¦ if ¦a¦ is nullish instead of throwing.
- Logical assignment: ¦a ||= b¦ (assign if falsy), ¦a &&= b¦ (assign if truthy), ¦a ??= b¦ (assign if nullish). They short-circuit, so no unnecessary setter calls.
- Mixing ¦??¦ with ¦||¦ or ¦&&¦ without brackets is a syntax error.

#### Example
¦¦¦js
const settings = { pageSize: 0, theme: '', user: null };

console.log(settings.pageSize || 10);   // 10  (wrong: 0 is valid)
console.log(settings.pageSize ?? 10);   // 0   (correct)
console.log(settings.theme ?? 'light'); // ''  (keeps empty string)

console.log(settings.user?.profile?.name);       // undefined, no crash
console.log(settings.onSave?.());                // undefined, safe call

settings.retries ??= 3;       // sets only if null/undefined
settings.theme ||= 'light';   // '' is falsy so it becomes 'light'
console.log(settings);        // { pageSize: 0, theme: 'light', user: null, retries: 3 }
¦¦¦

#### Remember it
- **?? = missing value**, **|| = any falsy**.
- **?. = "if exists"** (stops the chain).
- ¦??=¦ is the tidy way to set defaults on objects.

#### Common mistakes
- Using ¦||¦ for defaults when ¦0¦, ¦false¦ or ¦""¦ are valid.
- Overusing ¦?.¦ and hiding real bugs (a required field should fail loudly).
- Forgetting ¦?.¦ only guards the *left* value, not the whole expression.

#### Interview angle
**Model answer:** "I use ?? for defaults because it only replaces null and undefined, so a page size of 0 or an empty string survives. Optional chaining prevents crashes on deep API responses."
**Follow-up:** *Difference between ?. and a try/catch?* ¦?.¦ only guards nullish access; it does not catch other errors.

### Functions: declaration, expression, arrow, default/rest/spread parameters
#### In one line
A function is a reusable block of code; JavaScript offers several syntaxes that differ in hoisting, ¦this¦ and ¦arguments¦.

#### Real-life analogy
A function is a **recipe card**. A declaration is a card pinned to the kitchen wall from the start (hoisted). An expression is a card you write later and store in a drawer (a variable). An arrow is a short-hand card that doesn't have its own "chef" (no own ¦this¦).

#### How it works
- **Declaration:** ¦function add(a,b){}¦ is fully hoisted.
- **Expression:** ¦const add = function(){}¦ is available only after assignment.
- **Arrow:** ¦const add = (a,b) => a+b¦ has no own ¦this¦, ¦arguments¦, ¦prototype¦, and cannot be used with ¦new¦. It takes ¦this¦ from the surrounding scope.
- **Default parameters:** ¦function f(x = 5)¦ apply when the argument is ¦undefined¦ (not ¦null¦).
- **Rest** collects extra arguments into a real array: ¦(...args)¦. **Spread** expands an iterable: ¦fn(...list)¦.
- Functions are values: pass them, return them, store them (first-class).

#### Example
¦¦¦js
console.log(greet('Asha'));            // works: declaration hoisted
function greet(name = 'Learner') { return 'Hi ' + name; }

// console.log(total(1));              // ReferenceError (TDZ): expression not ready
const total = (...nums) => nums.reduce((s, n) => s + n, 0);
console.log(total(1, 2, 3));           // 6

const scores = [80, 95, 70];
console.log(Math.max(...scores));      // 95 (spread into arguments)

const course = {
  title: 'JS',
  regular() { return this.title; },
  arrow: () => typeof this,            // arrow ignores course, uses outer this
};
console.log(course.regular());         // 'JS'
¦¦¦

#### Remember it
- **Arrow = no own this/arguments/new.**
- Rest *gathers* (parameters), spread *scatters* (call site).
- Defaults trigger on ¦undefined¦ only.

#### Common mistakes
- Arrow functions as object methods or constructors.
- Expecting ¦null¦ to trigger a default parameter.
- Using ¦arguments¦ in arrows (use rest instead).

#### Interview angle
**Model answer:** "Declarations are hoisted, expressions are not, and arrows inherit this lexically so they are ideal for callbacks but not for object methods or constructors. I use rest parameters instead of arguments."
**Follow-up:** *What does an arrow function return for ¦() => ({})¦?* An empty object; the parentheses stop it being parsed as a block.

### Array methods: map, filter, reduce, find, some, every, flat, flatMap, at, toSorted
#### In one line
Array methods let you transform, search and summarise lists declaratively instead of writing manual loops.

#### Real-life analogy
A factory conveyor belt: **map** repaints every item, **filter** removes bad items, **reduce** packs everything in one box, **find** grabs the first matching item, **some/every** ask "is any/are all OK?".

#### How it works
- ¦map(fn)¦ returns a new array of the same length. ¦filter(fn)¦ returns the items where ¦fn¦ is truthy. ¦reduce(fn, initial)¦ folds to a single value; always pass the initial value.
- ¦find¦ returns the first item (or ¦undefined¦); ¦findIndex¦ its index; ¦some¦/¦every¦ return booleans and short-circuit.
- ¦flat(depth)¦ flattens nested arrays; ¦flatMap¦ is map + flat(1).
- ¦at(-1)¦ gives the last item.
- **Mutating:** ¦sort, reverse, splice, push, pop, shift, unshift, fill¦. **Non-mutating copies (ES2023):** ¦toSorted, toReversed, toSpliced, with¦.
- ¦sort()¦ with no comparator sorts as strings; use ¦(a,b)=>a-b¦.

#### Example
¦¦¦js
const courses = [
  { id: 1, title: 'React', hours: 10, done: true },
  { id: 2, title: 'Node', hours: 6, done: false },
  { id: 3, title: 'SQL', hours: 8, done: true },
];

const titles = courses.map(c => c.title);                 // ['React','Node','SQL']
const finished = courses.filter(c => c.done);             // 2 items
const totalHours = courses.reduce((sum, c) => sum + c.hours, 0); // 24
const node = courses.find(c => c.title === 'Node');      // {id:2,...}
console.log(courses.some(c => c.done), courses.every(c => c.done)); // true false

console.log([[1, 2], [3]].flat());                        // [1,2,3]
console.log(courses.at(-1).title);                        // 'SQL'
console.log([10, 2, 1].sort());                           // [1,10,2] (string sort!)
console.log([10, 2, 1].toSorted((a, b) => a - b), courses.length); // [1,2,10] original untouched

// group by status with reduce
const byStatus = courses.reduce((acc, c) => {
  (acc[c.done ? 'done' : 'todo'] ??= []).push(c.title);
  return acc;
}, {});
console.log(byStatus); // { done: ['React','SQL'], todo: ['Node'] }
¦¦¦

#### Remember it
- **map = transform, filter = keep, reduce = combine.**
- Mutators: *"SPRS-P"*: sort, pop/push, reverse, splice, shift/unshift.
- Prefer ¦toSorted¦ in React state code.

#### Common mistakes
- Using ¦map¦ just for side effects (use ¦forEach¦ or ¦for...of¦).
- ¦reduce¦ without an initial value on possibly empty arrays (TypeError).
- ¦sort()¦ on numbers without a comparator.

#### Interview angle
**Model answer:** "map transforms, filter selects, reduce aggregates, and I know which methods mutate so I never accidentally change React state. I use toSorted or copy first."
**Follow-up:** *Implement map with reduce.* ¦arr.reduce((acc, x) => [...acc, fn(x)], [])¦ (note the performance cost of copying).

### Objects: destructuring, spread, computed keys, Object.entries/fromEntries/hasOwn
#### In one line
Modern object syntax lets you unpack, merge and reshape data in one readable line.

#### Real-life analogy
An object is a **filing cabinet with labelled drawers**. Destructuring takes out specific folders; spread photocopies all folders into a new cabinet; computed keys let you label a drawer using a variable.

#### How it works
- **Destructuring:** ¦const { id, name: title, role = 'student' } = user¦ (rename + default). Works in parameters and with nesting.
- **Spread:** ¦{ ...a, ...b }¦ shallow-copies; later keys win.
- **Computed keys:** ¦{ [field]: value }¦.
- ¦Object.keys/values/entries¦ list own enumerable properties. ¦Object.fromEntries¦ rebuilds an object from pairs (inverse of entries).
- ¦Object.hasOwn(obj, key)¦ is the safe replacement for ¦obj.hasOwnProperty(key)¦.
- Shorthand: ¦{ id, name }¦ and method shorthand ¦{ run() {} }¦.

#### Example
¦¦¦js
const apiResponse = { data: { user: { id: 7, fullName: 'Asha Rao', roles: ['learner'] } }, status: 200 };

const { data: { user: { id, fullName: name, roles: [firstRole] } } } = apiResponse;
console.log(id, name, firstRole);            // 7 'Asha Rao' 'learner'

const updated = { ...apiResponse.data.user, fullName: 'Asha R.' }; // immutable update
console.log(updated.fullName);                // 'Asha R.'

const field = 'email';
const payload = { [field]: 'a@x.com' };      // { email: 'a@x.com' }

// transform: uppercase all values
const prices = { react: 10, node: 20 };
const doubled = Object.fromEntries(Object.entries(prices).map(([k, v]) => [k, v * 2]));
console.log(doubled);                         // { react: 20, node: 40 }
console.log(Object.hasOwn(prices, 'react'));  // true
¦¦¦

#### Remember it
- **entries -> map -> fromEntries** is the object transform pipeline.
- Spread is *shallow*; nested objects still share references.
- Use ¦hasOwn¦, not ¦in¦, to check own keys.

#### Common mistakes
- Destructuring ¦null/undefined¦ (throws); give defaults ¦= {}¦.
- Believing spread deep-copies.
- Using ¦for...in¦ and picking up inherited keys.

#### Interview angle
**Model answer:** "I destructure API responses with defaults, update state immutably with spread, and transform objects through entries and fromEntries. Spread is shallow so nested updates need a copy at each level."
**Follow-up:** *How do you remove a key immutably?* ¦const { password, ...safe } = user¦.

### Copying data: shallow vs deep, structuredClone, JSON pitfalls
#### In one line
A shallow copy duplicates only the top level; a deep copy duplicates everything nested, so changes can't leak between copies.

#### Real-life analogy
Photocopying a folder: a **shallow copy** copies the cover page, but the pages inside are the same physical pages shared with the original. A **deep copy** photocopies every page.

#### How it works
- Shallow: ¦{...obj}¦, ¦[...arr]¦, ¦Object.assign({}, obj)¦, ¦arr.slice()¦. Nested objects remain shared.
- Deep: ¦structuredClone(value)¦ (modern, built-in) copes with Date, Map, Set, RegExp, typed arrays and circular references. It **cannot** clone functions, DOM nodes or class instances' methods (throws or drops prototypes).
- ¦JSON.parse(JSON.stringify(x))¦ loses ¦undefined¦, functions, symbols; turns ¦Date¦ into strings; breaks ¦Map/Set¦ (become ¦{}¦); turns ¦NaN/Infinity¦ into ¦null¦; throws on circular references.
- In React you rarely need deep clones: copy only the path you change.

#### Example
¦¦¦js
const original = { name: 'Asha', tags: ['js'], when: new Date('2025-01-01'), meta: undefined };

const shallow = { ...original };
shallow.tags.push('react');
console.log(original.tags);                 // ['js','react'] (shared!)

const viaJson = JSON.parse(JSON.stringify(original));
console.log(typeof viaJson.when, 'meta' in viaJson); // 'string' false

const deep = structuredClone(original);
deep.tags.push('node');
console.log(original.tags, deep.when instanceof Date); // ['js','react'] true
¦¦¦

#### Remember it
- **Spread = shallow. structuredClone = deep.**
- JSON clone loses: **D**ate, **U**ndefined, **M**ap/Set, **F**unctions (*"DUMF"*).
- Prefer targeted immutable updates over cloning everything.

#### Common mistakes
- Mutating a "copy" made with spread and corrupting the original state.
- Using JSON clone for dates and Maps.
- Calling ¦structuredClone¦ on objects containing functions.

#### Interview angle
**Model answer:** "Spread is a shallow copy so nested objects are still shared. For a real deep copy I use structuredClone, and I avoid the JSON trick because it drops undefined, functions and converts dates to strings."
**Follow-up:** *Write a deepClone by hand.* Recursively copy arrays and plain objects, track a WeakMap for circular references.

### Strings, template literals, Number precision, Date and Intl
#### In one line
Strings are immutable text, numbers are 64-bit floats (so decimals can be inexact), and ¦Intl¦ formats text, dates and currency for any locale.

#### Real-life analogy
A calculator that stores 1/3 as 0.3333... can never be perfect. Floating point does the same for 0.1: it is stored as a close binary approximation, so sums show tiny errors.

#### How it works
- **Template literals:** strings written between backticks, with multi-line support and expressions inside ¦§{ }¦ (example below).
- Useful string methods: ¦includes, startsWith, padStart, replaceAll, split, trim, at, slice¦. Strings are immutable: methods return new strings.
- **Numbers:** ¦0.1 + 0.2 = 0.30000000000000004¦. Compare with ¦Math.abs(a-b) < Number.EPSILON¦ or work in integers (paise/cents). Use ¦BigInt¦ for integers above ¦Number.MAX_SAFE_INTEGER¦ (2^53-1).
- ¦toFixed¦ returns a *string*.
- **Date:** months are 0-based; ¦new Date('2025-01-01')¦ is parsed as UTC while ¦'2025-01-01T00:00'¦ is local time. Store and send ISO UTC strings.
- **Intl:** ¦NumberFormat¦, ¦DateTimeFormat¦, ¦RelativeTimeFormat¦, ¦PluralRules¦ handle locales for you.

#### Example
¦¦¦js
console.log(0.1 + 0.2 === 0.3);                          // false
console.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON); // true
console.log((1.005).toFixed(2));                          // '1.00' (surprise!)

const cents = Math.round(19.99 * 100);                    // 1999 (store money as integers)
console.log(cents / 100);                                 // 19.99

const name = 'Asha';
console.log(¦Welcome back, §{name}!¦);                     // Welcome back, Asha!

console.log(new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(1234567.5)); // ₹12,34,567.50
console.log(new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date('2025-03-09'))); // 9 Mar 2025
console.log(new Date(2025, 0, 31).getMonth());            // 0 (January)
¦¦¦

#### Remember it
- **Money = integers (or a decimal library). Dates = UTC strings.**
- ¦toFixed¦ returns text; ¦Number()¦ it back if needed.
- Months are 0-11.

#### Common mistakes
- Doing currency math with floats.
- Hard-coding date formats instead of ¦Intl¦.
- Parsing non-ISO date strings (browser-dependent).

#### Interview angle
**Model answer:** "JavaScript numbers are IEEE-754 doubles, so 0.1 + 0.2 isn't exactly 0.3. For money I use integer minor units, for large integers BigInt, and for display Intl.NumberFormat."
**Follow-up:** *Why is the date -1 day off in some timezones?* A date-only ISO string is UTC, and local display can shift it.

### Loops: for, for...of, for...in, forEach
#### In one line
Choose the loop by what you need: ¦for...of¦ for values, ¦for...in¦ for object keys, ¦forEach¦ for simple side effects (but never with ¦await¦).

#### Real-life analogy
Walking along a shelf of books: ¦for...of¦ picks up each *book*; ¦for...in¦ reads each *label* on the shelf; classic ¦for¦ lets you walk by position and skip around.

#### How it works
- ¦for (let i...)¦: full control, can ¦break¦/¦continue¦, best for index maths.
- ¦for...of¦: iterates **values** of any iterable (arrays, strings, Map, Set). Supports ¦break¦ and ¦await¦ inside async functions.
- ¦for...in¦: iterates enumerable **keys** (including inherited ones) as strings. Use for plain objects only; never for arrays.
- ¦forEach¦: calls a callback per item; cannot ¦break¦; ignores returned promises, so ¦await¦ inside doesn't pause the loop.
- For sequential async work use ¦for...of¦ with ¦await¦; for parallel use ¦Promise.all(arr.map(...))¦.

#### Example
¦¦¦js
const ids = [1, 2, 3];
for (const id of ids) console.log(id);                  // 1 2 3
for (const i in ids) console.log(typeof i);             // 'string' x3 (keys are strings)

const user = { name: 'Asha', role: 'lead' };
for (const key in user) console.log(key, user[key]);   // name Asha / role lead
for (const [k, v] of Object.entries(user)) console.log(k, v);

// forEach does NOT wait
async function bad() {
  ids.forEach(async id => { await save(id); });         // returns immediately
  console.log('done');                                  // prints before saves finish
}
async function good() {
  for (const id of ids) await save(id);                 // sequential
  await Promise.all(ids.map(save));                     // parallel
}
const save = id => new Promise(r => setTimeout(r, 10));
¦¦¦

#### Remember it
- **of = values, in = keys.**
- forEach + await = broken.
- Need to stop early? Use ¦for...of¦, ¦some¦ or ¦find¦.

#### Common mistakes
- Using ¦for...in¦ on arrays.
- Async callbacks in ¦forEach¦.
- Mutating an array while iterating it.

#### Interview angle
**Model answer:** "for...of for values, for...in only for object keys, and I never use forEach with await because it doesn't wait. I pick for...of for sequential and Promise.all with map for parallel async work."
**Follow-up:** *How do you limit concurrency to 5?* Process the list in chunks or use a worker-pool pattern.

### Modules: ES modules vs CommonJS, named vs default exports
#### In one line
Modules split code into files; **ES modules** (¦import/export¦) are the standard, **CommonJS** (¦require/module.exports¦) is Node's original system.

#### Real-life analogy
A restaurant kitchen with stations: each station (module) exposes only what other stations need through a service hatch (exports); everything else stays private.

#### How it works
- **ESM:** static ¦import¦/¦export¦, analysed at build time (enables tree shaking), always strict mode, loaded asynchronously, live bindings. Use ¦.mjs¦ or ¦"type": "module"¦ in Node.
- **CJS:** ¦require()¦ is a runtime function call, synchronous, exports a copy of ¦module.exports¦.
- **Named export:** ¦export const a¦, imported as ¦import { a }¦ (name must match). **Default export:** one per file, imported with any name.
- Dynamic ¦import('./x.js')¦ returns a promise (code splitting, lazy loading).
- Interop problems: ¦require¦ of an ESM-only package fails; default-import of CJS may need ¦.default¦; ¦__dirname¦ doesn't exist in ESM (use ¦import.meta.url¦).
- Prefer named exports: better autocomplete, safer refactors, tree-shaking friendly.

#### Example
¦¦¦js
// math.js (ESM)
export const add = (a, b) => a + b;
export default function multiply(a, b) { return a * b; }

// app.js
import multiply, { add } from './math.js';
console.log(add(2, 3), multiply(2, 3)); // 5 6

// lazy-load a heavy chart only when needed
async function showChart() {
  const { renderChart } = await import('./chart.js');
  renderChart();
}

// CommonJS equivalent
// const { add } = require('./math');
// module.exports = { add };
¦¦¦

#### Remember it
- **ESM = static, async, tree-shakable. CJS = dynamic, sync.**
- Named exports for libraries, default for one main thing (a React component).
- Use dynamic import for lazy loading.

#### Common mistakes
- Mixing ¦require¦ and ¦import¦ in the same file.
- Circular imports giving ¦undefined¦ values.
- Forgetting the file extension in Node ESM.

#### Interview angle
**Model answer:** "ESM has static imports that tools can tree-shake, while CommonJS loads synchronously at runtime. In our Node and React stack I hit interop issues with ESM-only packages and solved them with dynamic import or by aligning module settings."
**Follow-up:** *What is a live binding?* Imported names reflect later changes to the exported variable.

### Errors: try/catch/finally, throw, custom Error classes
#### In one line
Errors signal that something went wrong; ¦try/catch¦ lets you handle it and ¦finally¦ runs cleanup either way.

#### Real-life analogy
A fire alarm system: ¦throw¦ pulls the alarm, ¦catch¦ is the response team, ¦finally¦ is closing the doors and switching off the gas whatever happened.

#### How it works
- ¦throw new Error('msg')¦ creates a stack trace. Throwing strings or objects loses it.
- ¦catch (e)¦ catches synchronous errors and errors from ¦await¦ inside ¦try¦. It **does not** catch errors inside un-awaited promises or ¦setTimeout¦ callbacks.
- ¦finally¦ runs after try/catch even on ¦return¦: ideal for closing connections, hiding loaders.
- **Custom errors:** ¦class ValidationError extends Error¦ with ¦name¦, ¦status¦ and ¦cause¦ (¦new Error('x', { cause })¦).
- Rethrow errors you can't handle. Check type with ¦instanceof¦ or ¦e.name¦.
- Browser global safety nets: ¦window.onerror¦, ¦unhandledrejection¦; React error boundaries for render errors.

#### Example
¦¦¦js
class ApiError extends Error {
  constructor(message, status, options) {
    super(message, options);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function loadCourse(id) {
  try {
    const res = await fetch('/api/courses/' + id);
    if (!res.ok) throw new ApiError('Course request failed', res.status);
    return await res.json();
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null; // expected case
    throw new Error('Could not load course', { cause: err });       // wrap + rethrow
  } finally {
    console.log('hide spinner');                                      // always runs
  }
}
¦¦¦

#### Remember it
- **Throw Errors, not strings.**
- try/catch handles sync + awaited code only.
- Handle what you can; rethrow what you can't; always clean up in ¦finally¦.

#### Common mistakes
- Empty ¦catch¦ blocks that swallow errors.
- Forgetting ¦await¦ so errors escape ¦try¦.
- Throwing strings and losing the stack trace.

#### Interview angle
**Model answer:** "I throw Error subclasses with a status or code, handle expected cases near the source, wrap and rethrow with cause for the rest, and use finally for cleanup. In React I add an error boundary for rendering failures."
**Follow-up:** *Does fetch reject on a 500?* No, only on network failure; check ¦res.ok¦.

### DOM and events: querySelector, bubbling, capturing, delegation
#### In one line
The DOM is the page as a tree of objects; events travel down (capture), hit the target, then travel back up (bubble), which makes event delegation possible.

#### Real-life analogy
A ring on the door of a block of flats: the sound starts at the flat's door (target) and then can be heard by the floor warden, then the building manager (bubbling up). One manager at the main gate (delegation) can handle every flat's visitors.

#### How it works
- Select: ¦document.querySelector('.card')¦, ¦querySelectorAll¦ (static NodeList), ¦closest()¦, ¦matches()¦.
- Listen: ¦el.addEventListener('click', handler, options)¦. Phases: **capture** (window to target), **target**, **bubble** (target to window). Default is bubble.
- ¦event.target¦ is the element clicked; ¦event.currentTarget¦ is where the listener is attached.
- ¦stopPropagation()¦ stops travelling; ¦preventDefault()¦ stops the browser action (link, form submit). They are different.
- **Delegation:** attach one listener to a parent and check ¦e.target.closest(selector)¦. Fewer listeners, and it works for items added later.
- React attaches its events at the root and dispatches its own synthetic events, which is delegation at framework scale.
- Options: ¦{ once, passive, signal }¦ (use an ¦AbortController¦ to remove many listeners).

#### Example
¦¦¦js
// One listener for a whole list of lessons
document.querySelector('#lessons').addEventListener('click', (e) => {
  const item = e.target.closest('li[data-id]');
  if (!item) return;                        // click was elsewhere
  console.log('Open lesson', item.dataset.id);
});

// cleanup many listeners at once
const ctrl = new AbortController();
window.addEventListener('resize', () => console.log('resize'), { signal: ctrl.signal });
window.addEventListener('scroll', () => console.log('scroll'), { passive: true, signal: ctrl.signal });
ctrl.abort();                               // removes both
¦¦¦

#### Remember it
- **Capture down, target, bubble up.**
- target = who was clicked; currentTarget = who is listening.
- Delegation = one listener on the parent + ¦closest()¦.

#### Common mistakes
- Adding listeners in loops and never removing them (leaks).
- Confusing ¦stopPropagation¦ and ¦preventDefault¦.
- Using ¦e.target¦ when the click lands on a child element (use ¦closest¦).

#### Interview angle
**Model answer:** "Events capture down, reach the target, then bubble up. I use delegation by attaching one listener to the parent and using closest on the target, which handles dynamic items and saves memory; React's synthetic events work the same way."
**Follow-up:** *Which events don't bubble?* ¦focus¦, ¦blur¦ (use ¦focusin/focusout¦), ¦mouseenter¦.

## Phase 2 · Core engine concepts (Intermediate)
### Execution context and call stack
#### In one line
Every time JavaScript runs code it creates an **execution context** (a workspace with variables and ¦this¦), and the **call stack** tracks which context is running now.

#### Real-life analogy
A pile of work files on your desk. When you start a new task you put its file on top; when it's finished you remove it and carry on with the file underneath. Only the top file is being worked on (Last In, First Out).

#### How it works
- At start JS creates the **global context**. Each function call creates a new **function context** and pushes it on the stack.
- A context has two phases: **creation** (hoist declarations, set up scope chain and ¦this¦) and **execution** (run line by line).
- When a function returns, its context is popped.
- The **scope chain** is how a function looks up variables: own scope, then outer scopes, then global (lexical scoping: decided by where code is *written*).
- JavaScript is single-threaded: one call stack, one thing at a time.
- Infinite or very deep recursion overflows the stack: ¦RangeError: Maximum call stack size exceeded¦.

#### Example
¦¦¦js
function third()  { console.log('third'); }
function second() { third(); console.log('second'); }
function first()  { second(); console.log('first'); }
first();
// Stack grows: global -> first -> second -> third
// Output order: third, second, first

function countDown(n) { return countDown(n - 1); } // no base case
try { countDown(5); } catch (e) { console.log(e.name); } // RangeError

// Fix deep recursion with a loop
const sum = (n) => { let t = 0; for (let i = 1; i <= n; i++) t += i; return t; };
console.log(sum(100000)); // 5000050000
¦¦¦

#### Remember it
- **Stack = LIFO. One stack = one thread.**
- Function call = push; return = pop.
- Recursion needs a **base case**.

#### Common mistakes
- Forgetting a base case in recursion.
- Thinking async code runs "in parallel" on the same stack.
- Confusing lexical scope with where a function is *called*.

#### Interview angle
**Model answer:** "Each function call creates an execution context pushed on the call stack; JavaScript runs the top one until it returns. Variable lookup follows the lexical scope chain. Because there is one stack, long synchronous work blocks everything."
**Follow-up:** *How do you avoid stack overflow in deep recursion?* Use iteration, or an explicit stack/queue, or trampolines.

### Closures
#### In one line
A closure is a function that **remembers the variables from where it was created**, even after the outer function has finished.

#### Real-life analogy
A backpack: when a function leaves its home (outer function), it carries a backpack with the variables it needs. Wherever it travels, it can still open the backpack.

#### How it works
- Functions keep a reference to their lexical environment (not a copy), so they see the *current* value of captured variables.
- Use cases: private state, counters, factories, memoization, once(), partial application, event handlers, hooks.
- The captured environment stays in memory while the function is reachable (watch for leaks).
- **Stale closures** happen in React: an effect or callback captures old state from an earlier render. Fix with correct dependency arrays, functional updates (¦setX(x => x + 1)¦) or refs.
- Loop trap: ¦var¦ in loops shares one variable; ¦let¦ makes a fresh one per iteration.

#### Example
¦¦¦js
function createCounter() {
  let count = 0;                       // private
  return {
    inc: () => ++count,
    get: () => count,
  };
}
const c = createCounter();
c.inc(); c.inc();
console.log(c.get());                  // 2 (count not accessible directly)

const memoize = (fn) => {
  const cache = new Map();
  return (x) => cache.has(x) ? cache.get(x) : (cache.set(x, fn(x)), cache.get(x));
};
const slowSquare = (n) => { console.log('computing'); return n * n; };
const fast = memoize(slowSquare);
console.log(fast(4), fast(4));         // computing, 16 16

// Stale closure in React-style code
function demo() {
  let count = 0;
  const log = () => console.log(count);  // captures the variable
  count = 5;
  return log;
}
demo()();                               // 5 (sees the latest value of that variable)
¦¦¦

#### Remember it
- **Closure = function + its backpack (scope).**
- Closures capture *variables*, not values.
- React stale closure fix: *deps array, functional update, or ref*.

#### Common mistakes
- ¦var¦ in loops with callbacks.
- Holding large objects in closures (memory leaks).
- Missing dependencies in ¦useEffect¦.

#### Interview angle
**Model answer:** "A closure is a function bundled with its lexical environment, so it can access outer variables after the outer function returns. I use them for private state, memoization and factories, and I watch for stale closures in React hooks."
**Follow-up:** *Write a function that runs only once.* Keep a ¦called¦ flag and the result in the closure.

### this binding: default, implicit, explicit (call/apply/bind), new, arrow
#### In one line
¦this¦ is decided by **how a function is called**, not where it is written (except arrow functions, which take it from outside).

#### Real-life analogy
The word "I": it means whoever is speaking. Same sentence, different speaker, different meaning. ¦this¦ is "who is calling me?".

#### How it works
Four rules, in order of priority:
1. **new:** ¦new Fn()¦ makes a fresh object as ¦this¦.
2. **Explicit:** ¦fn.call(obj)¦, ¦fn.apply(obj, [args])¦, ¦fn.bind(obj)¦ set ¦this¦ yourself. ¦bind¦ returns a new function.
3. **Implicit:** ¦obj.method()¦ uses the object left of the dot.
4. **Default:** plain ¦fn()¦ gives ¦undefined¦ in strict mode (modules, classes) or the global object otherwise.
- **Arrow functions** ignore these rules and use the ¦this¦ of the enclosing scope, permanently.
- Detached methods lose ¦this¦: ¦const f = obj.method; f()¦.

#### Example
¦¦¦js
const learner = {
  name: 'Asha',
  hello() { return 'Hi ' + this.name; },
  later() { setTimeout(() => console.log(this.name), 0); }, // arrow keeps this
};
console.log(learner.hello());               // 'Hi Asha' (implicit)

const lost = learner.hello;
try { console.log(lost()); } catch (e) { console.log('lost this'); } // this is undefined in strict mode

const fixed = learner.hello.bind(learner);
console.log(fixed());                       // 'Hi Asha'
console.log(learner.hello.call({ name: 'Ravi' })); // 'Hi Ravi'

function Course(title) { this.title = title; }
console.log(new Course('JS').title);        // 'JS' (new binding)

learner.later();                            // 'Asha'
¦¦¦

#### Remember it
- Priority: **new > call/apply/bind > obj.method() > default**.
- Arrow = inherits ¦this¦ lexically.
- Callback loses ¦this¦? **bind it or use an arrow**.

#### Common mistakes
- Passing ¦obj.method¦ as a callback.
- Using arrows as object methods that need ¦this¦.
- Forgetting that class methods lose ¦this¦ when passed as handlers.

#### Interview angle
**Model answer:** "this depends on the call site: new, explicit call/apply/bind, implicit by the object before the dot, otherwise default. Arrow functions don't have their own this, so they're perfect for callbacks, and I bind or use arrows when passing methods."
**Follow-up:** *Difference between call, apply and bind?* call/apply invoke immediately (args list vs array); bind returns a new function.

### Prototypes, inheritance and classes
#### In one line
Every object has a hidden link to another object (its **prototype**); when a property isn't found, JavaScript follows this chain. ¦class¦ is cleaner syntax over the same mechanism.

#### Real-life analogy
A company policy book. If your team handbook doesn't answer a question, you check the department handbook, then the company handbook. Each handbook points to the next one up (the prototype chain).

#### How it works
- Property lookup: own properties, then ¦obj.__proto__¦ (its prototype), then up to ¦Object.prototype¦, then ¦null¦.
- ¦Object.getPrototypeOf(obj)¦ reads the link; ¦Object.create(proto)¦ makes an object with a chosen prototype.
- Constructor functions put shared methods on ¦Fn.prototype¦; instances share them (saves memory).
- **Classes:** ¦class A { constructor(){} method(){} }¦, ¦extends¦, ¦super¦, ¦static¦, getters/setters, **private fields** ¦#x¦ (truly private, enforced by the engine).
- Class bodies run in strict mode; class declarations are not hoisted like functions (TDZ).
- Prefer **composition over inheritance** in most app code.

#### Example
¦¦¦js
class Learner {
  #email;                                   // private field
  static count = 0;
  constructor(name, email) { this.name = name; this.#email = email; Learner.count++; }
  get domain() { return this.#email.split('@')[1]; }
  greet() { return 'Hi ' + this.name; }
}
class Lead extends Learner {
  greet() { return super.greet() + ' (lead)'; }
}
const l = new Lead('Asha', 'a@elsevier.com');
console.log(l.greet(), l.domain);           // 'Hi Asha (lead)' 'elsevier.com'
console.log(l instanceof Learner, Object.getPrototypeOf(Lead) === Learner); // true true
console.log(typeof Learner);                // 'function' (class is sugar)
console.log(l.hasOwnProperty('greet'));     // false (lives on the prototype)
// l.#email -> SyntaxError outside the class
¦¦¦

#### Remember it
- **Look own, then up the chain.**
- ¦class¦ = sugar over prototypes.
- ¦#private¦ is real privacy; ¦_name¦ is only a convention.

#### Common mistakes
- Assigning methods inside the constructor for every instance (wasteful).
- Forgetting ¦super()¦ before using ¦this¦ in a subclass.
- Deep inheritance trees where composition is simpler.

#### Interview angle
**Model answer:** "JavaScript uses prototype-based inheritance: objects delegate missing properties up their prototype chain. Classes are syntax sugar on top, and I prefer composition with small modules over deep class hierarchies."
**Follow-up:** *What does new do?* Creates an object linked to Fn.prototype, runs the constructor with this bound to it, returns it.

### Event loop: call stack, microtask queue, macrotask queue
#### In one line
The event loop lets single-threaded JavaScript handle async work by running the stack to empty, then draining **microtasks**, then taking one **macrotask**, and repeating.

#### Real-life analogy
A chef (the stack) can cook one dish at a time. Tickets arrive from two boxes: a **VIP box** (microtasks: promises) which the chef empties completely after every dish, and a **normal box** (macrotasks: timers, I/O, clicks) from which the chef takes one ticket at a time.

#### How it works
1. Run all synchronous code (the current task) until the stack is empty.
2. Run **all microtasks** (¦Promise.then/catch/finally¦, ¦await¦ continuations, ¦queueMicrotask¦, ¦MutationObserver¦), including ones added meanwhile.
3. (Browser) render if needed.
4. Take **one macrotask** (¦setTimeout¦, ¦setInterval¦, DOM events, I/O, ¦MessageChannel¦), go to step 2.
- ¦setTimeout(fn, 0)¦ means "as soon as the stack and microtasks are clear", not instantly.
- Heavy sync code blocks rendering and timers (frozen UI).
- ¦await x¦ pauses the function and schedules the rest as a microtask.

#### Example
¦¦¦js
console.log('1 sync');
setTimeout(() => console.log('5 timeout'), 0);
Promise.resolve().then(() => console.log('3 promise'));
queueMicrotask(() => console.log('4 microtask'));
(async () => {
  console.log('2 async start (still sync)');
  await null;
  console.log('4b after await');
})();
console.log('2b sync end');
// Order: 1 sync, 2 async start, 2b sync end, 3 promise, 4 microtask, 4b after await, 5 timeout
¦¦¦

#### Remember it
- **Sync first, then ALL microtasks, then ONE macrotask.**
- *"Promises beat timers."*
- Long sync loops freeze the page: split work or use a worker.

#### Common mistakes
- Believing ¦setTimeout(0)¦ runs immediately.
- Infinite microtask loops starving rendering.
- Assuming code after ¦await¦ is synchronous.

#### Interview angle
**Model answer:** "After the synchronous code, JavaScript drains the microtask queue, which holds promise callbacks, and only then picks one macrotask such as a timer. That's why a resolved promise logs before a zero-delay timeout."
**Follow-up:** *Where does requestAnimationFrame run?* Before the next repaint, after microtasks, outside the macrotask queue.

### Promises: states, chaining, all, allSettled, race, any
#### In one line
A promise is an object representing a value that will arrive later (or fail), which you can chain and combine.

#### Real-life analogy
A **restaurant buzzer**. It's pending while the food cooks, then either lights up with your order (fulfilled) or announces the dish is unavailable (rejected). You can attach plans to it: "when ready, take to table 5".

#### How it works
- States: **pending**, then **fulfilled** or **rejected**; once settled it never changes.
- ¦.then(onOk)¦, ¦.catch(onErr)¦, ¦.finally(cleanup)¦ each return a **new promise**, so they chain. Returning a value passes it on; throwing jumps to the next ¦catch¦.
- Combinators:

| Method | Resolves when | Rejects when |
|---|---|---|
| ¦all¦ | all fulfil (array of values) | **first** rejection |
| ¦allSettled¦ | all settle (status objects) | never |
| ¦race¦ | first settles | first settles with a rejection |
| ¦any¦ | first **fulfils** | all reject (AggregateError) |

- Always return promises inside chains; always handle rejections (¦unhandledrejection¦).
- ¦new Promise((resolve, reject) => ...)¦ is for wrapping callback APIs only.

#### Example
¦¦¦js
const wait = (ms, v, fail) => new Promise((res, rej) => setTimeout(() => fail ? rej(new Error(v)) : res(v), ms));

wait(10, 'user').then(u => wait(10, u + '+courses')).then(console.log); // user+courses

Promise.all([wait(10, 'a'), wait(20, 'b')]).then(console.log);           // ['a','b']
Promise.allSettled([wait(10, 'ok'), wait(10, 'bad', true)]).then(r => console.log(r.map(x => x.status)));
// ['fulfilled','rejected']
Promise.race([wait(50, 'slow'), wait(5, 'fast')]).then(console.log);     // 'fast'
Promise.any([wait(5, 'x', true), wait(10, 'mirror')]).then(console.log); // 'mirror'

// timeout wrapper
const withTimeout = (p, ms) => Promise.race([p, wait(ms, 'timeout', true)]);
withTimeout(wait(100, 'late'), 20).catch(e => console.log(e.message));   // timeout
¦¦¦

#### Remember it
- **all** = everything or nothing. **allSettled** = tell me everything. **race** = first to finish. **any** = first success.
- Return inside ¦then¦ to keep the chain.
- ¦catch¦ at the end of every chain.

#### Common mistakes
- Forgetting to ¦return¦ a promise inside ¦then¦.
- Using ¦Promise.all¦ when partial failures are acceptable.
- The "promise constructor anti-pattern" around functions already returning promises.

#### Interview angle
**Model answer:** "A promise is pending, then settles once. I chain with then and a final catch, use all for dependent parallel calls, allSettled when partial results are fine, race for timeouts and any for the first successful mirror."
**Follow-up:** *Does Promise.all cancel the others on failure?* No; the rest keep running. Use ¦AbortController¦ to cancel.

### async/await patterns: error handling, parallel vs sequential, for...of with await
#### In one line
¦async/await¦ lets you write promise code that reads like normal top-to-bottom code.

#### Real-life analogy
Ordering at a counter: *sequential* is ordering coffee, waiting, then ordering a sandwich; *parallel* is placing both orders at once and waiting for both.

#### How it works
- An ¦async¦ function always returns a promise. ¦await¦ pauses *that function* (not the thread) until the promise settles.
- Errors: ¦try/catch¦ around ¦await¦, or ¦.catch()¦ on the returned promise.
- **Sequential** (each depends on the previous or order matters): ¦await¦ one after another.
- **Parallel** (independent work): start all, then ¦await Promise.all([...])¦.
- ¦for...of¦ + ¦await¦ is sequential; ¦arr.map(async ...)¦ + ¦Promise.all¦ is parallel.
- ¦return await¦ is only needed inside ¦try/catch¦ to catch the rejection.
- Top-level ¦await¦ works in ES modules.

#### Example
¦¦¦js
const getUser = () => new Promise(r => setTimeout(() => r({ id: 1 }), 100));
const getCourses = () => new Promise(r => setTimeout(() => r(['JS', 'React']), 100));

async function slow() {
  const t = Date.now();
  const user = await getUser();          // waits 100ms
  const courses = await getCourses();    // waits another 100ms
  console.log('sequential', Date.now() - t, 'ms'); // ~200
}
async function fast() {
  const t = Date.now();
  const [user, courses] = await Promise.all([getUser(), getCourses()]);
  console.log('parallel', Date.now() - t, 'ms');     // ~100
}

async function safeLoad(ids) {
  const results = [];
  for (const id of ids) {
    try { results.push(await fetch('/api/items/' + id).then(r => r.json())); }
    catch (e) { results.push({ id, error: e.message }); }   // one failure doesn't stop the rest
  }
  return results;
}
slow().then(fast);
¦¦¦

#### Remember it
- **Independent = parallel (Promise.all). Dependent = sequential.**
- ¦await¦ in ¦forEach¦ doesn't work.
- Every ¦async¦ function returns a promise.

#### Common mistakes
- Awaiting independent calls one by one (slow pages).
- Missing ¦try/catch¦ so errors become unhandled rejections.
- Using ¦await¦ in a non-async function.

#### Interview angle
**Model answer:** "I use async/await for readability, wrap awaits in try/catch where I can recover, and run independent requests in parallel with Promise.all. For sequential batches I use for...of with await."
**Follow-up:** *How do you retry with backoff?* Loop attempts, ¦await¦ a delay that doubles each time (with jitter), rethrow after the max.

### Iterators and generators
#### In one line
An **iterator** hands out values one at a time; a **generator** (¦function*¦) is a function that can pause with ¦yield¦ and resume later, producing values lazily.

#### Real-life analogy
A vending machine versus a buffet. A buffet (array) puts every dish out up front. A vending machine (generator) gives you one item each time you press the button and only prepares it when asked.

#### How it works
- An **iterable** has a ¦[Symbol.iterator]()¦ method returning an object with ¦next()¦ that gives ¦{ value, done }¦. Arrays, strings, Map, Set are iterable; ¦for...of¦, spread and destructuring use this.
- A **generator function** returns an iterator automatically. ¦yield¦ pauses; ¦next(x)¦ resumes and can send a value in.
- Lazy evaluation: infinite sequences, pagination, streaming large data, without holding everything in memory.
- ¦async function*¦ + ¦for await...of¦ for streams and paged APIs.
- Modern **iterator helpers** (¦map, filter, take, toArray¦ on iterators) are arriving in engines.

#### Example
¦¦¦js
function* idGenerator(start = 1) {
  let id = start;
  while (true) yield id++;             // infinite but lazy
}
const ids = idGenerator();
console.log(ids.next().value, ids.next().value); // 1 2

function* take(iter, n) { let i = 0; for (const x of iter) { if (i++ >= n) return; yield x; } }
console.log([...take(idGenerator(10), 3)]);       // [10, 11, 12]

// paged API with async generator
async function* pages(fetchPage) {
  let page = 1;
  while (true) {
    const items = await fetchPage(page++);
    if (!items.length) return;
    yield* items;
  }
}
// for await (const course of pages(api)) { ... }
¦¦¦

#### Remember it
- **iterable = has Symbol.iterator; iterator = has next().**
- ¦yield¦ = pause and hand out a value.
- Generator beats array when data is **large, infinite or expensive**.

#### Common mistakes
- Spreading an infinite generator (hangs).
- Reusing a finished generator (it's exhausted).
- Forgetting ¦yield*¦ to delegate.

#### Interview angle
**Model answer:** "Iterables implement Symbol.iterator, which is what for...of and spread rely on. Generators give me lazy sequences with yield, ideal for pagination or large streams, and async generators let me consume them with for await."
**Follow-up:** *How do you make a custom class iterable?* Implement ¦*[Symbol.iterator]()¦ as a generator method.

### Map, Set, WeakMap, WeakSet
#### In one line
**Map** stores key/value pairs with any key type, **Set** stores unique values, and the **Weak** versions hold objects without preventing garbage collection.

#### Real-life analogy
A Map is a cloakroom with numbered tags (any tag type works). A Set is a guest list that ignores duplicate names. A WeakMap is sticky notes attached to guests: when the guest leaves, the note is thrown away automatically.

#### How it works
- **Map:** keys can be objects, functions, anything; keeps insertion order; ¦size¦; ¦get/set/has/delete¦; iterable. Faster and safer than plain objects for dynamic keys.
- **Set:** unique values (uses SameValueZero, so ¦NaN¦ equals ¦NaN¦). Great for dedupe and membership checks (O(1) average).
- **WeakMap/WeakSet:** keys must be **objects**, held weakly, not iterable, no ¦size¦. Perfect for private data or caches tied to an object's lifetime.
- Newer Set methods: ¦union, intersection, difference, isSubsetOf¦ etc. (check engine support).

#### Example
¦¦¦js
const unique = [...new Set([1, 2, 2, 3, 3])];            // [1,2,3]

const seen = new Set();
const dupes = ['a', 'b', 'a'].filter(x => seen.size === seen.add(x).size); // ['a']

const cache = new Map();                                  // object keys work
const userObj = { id: 1 };
cache.set(userObj, 'profile data');
console.log(cache.get(userObj), cache.size);              // 'profile data' 1

const counts = new Map();
for (const w of 'a b a c a'.split(' ')) counts.set(w, (counts.get(w) ?? 0) + 1);
console.log(counts);                                      // Map { a: 3, b: 1, c: 1 }

const meta = new WeakMap();                               // metadata freed with the object
function track(el) { meta.set(el, { clicks: 0 }); }
¦¦¦

#### Remember it
- **Map = any-key dictionary. Set = unique list. Weak* = auto-cleaning, object keys only.**
- Object keys are strings/symbols; Map keys are anything.
- Dedupe in one line: ¦[...new Set(arr)]¦.

#### Common mistakes
- Using objects as dictionaries with user-controlled keys (prototype pollution risk).
- Expecting ¦WeakMap¦ to be iterable or to have ¦size¦.
- JSON-serialising a Map directly (becomes ¦{}¦).

#### Interview angle
**Model answer:** "I use Map for dynamic or non-string keys and ordered iteration, Set for uniqueness and fast lookup, and WeakMap to attach private data to objects without causing memory leaks."
**Follow-up:** *Why not just use objects?* Maps avoid key collisions with inherited properties and have a proper ¦size¦ and iteration.

### Higher-order functions, currying, composition, pure functions
#### In one line
Higher-order functions take or return functions; **pure** functions always give the same output for the same input and change nothing outside themselves.

#### Real-life analogy
A **pure function** is a vending machine: same coin + same button = same snack, every time, and it doesn't rearrange the shop. A **higher-order function** is a machine that builds other machines (a coffee-machine factory).

#### How it works
- **Higher-order:** ¦map, filter, reduce¦, ¦setTimeout¦, React's ¦useCallback¦ and HOCs.
- **Pure:** no side effects (no mutation, I/O, randomness, time), so easy to test, cache and reason about. React components and Redux reducers should be pure.
- **Currying:** turn ¦f(a, b, c)¦ into ¦f(a)(b)(c)¦. **Partial application:** pre-fill some args.
- **Composition:** ¦compose(f, g)(x) = f(g(x))¦ and ¦pipe¦ (left to right) build pipelines from small functions.
- Side effects should be isolated at the edges (fetching, logging).

#### Example
¦¦¦js
// pure vs impure
const addTax = (price, rate) => price * (1 + rate);          // pure
let total = 0;
const addToTotal = (n) => { total += n; };                    // impure (changes outside state)

const curry = (fn) => function curried(...args) {
  return args.length >= fn.length ? fn(...args) : (...more) => curried(...args, ...more);
};
const add3 = curry((a, b, c) => a + b + c);
console.log(add3(1)(2)(3), add3(1, 2)(3));                    // 6 6

const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
const slugify = pipe(s => s.trim(), s => s.toLowerCase(), s => s.replace(/\s+/g, '-'));
console.log(slugify('  Intro To React  '));                    // 'intro-to-react'

const withLogging = (fn) => (...args) => { console.log('call', args); return fn(...args); }; // HOF
console.log(withLogging(addTax)(100, 0.18));                   // call [100,0.18] -> 118
¦¦¦

#### Remember it
- **Pure = same in, same out, no side effects.**
- Curry = one argument at a time; compose = glue small functions.
- React render and reducers = pure.

#### Common mistakes
- Mutating arguments inside "pure" functions.
- Over-currying until the code is unreadable.
- Hiding side effects inside ¦map¦ callbacks.

#### Interview angle
**Model answer:** "A higher-order function accepts or returns functions. I favour pure functions because they are deterministic and testable, which is why React rendering and Redux reducers require them, and I compose small ones into pipelines."
**Follow-up:** *Implement compose.* ¦(...fns) => x => fns.reduceRight((v, f) => f(v), x)¦.

### fetch, AbortController and JSON
#### In one line
¦fetch¦ makes HTTP requests and returns a promise; ¦AbortController¦ cancels them; ¦JSON¦ converts between objects and text.

#### Real-life analogy
Posting a letter: ¦fetch¦ sends and promises a reply. A failed delivery (network error) is a rejection, but a reply saying "address not found" (404) is still a *delivered* reply you must check. ¦AbortController¦ is calling the courier to cancel.

#### How it works
- ¦fetch(url, { method, headers, body, signal })¦ resolves with a ¦Response¦ as soon as headers arrive. It **rejects only on network failure** (or abort). Check ¦res.ok¦ / ¦res.status¦.
- Read the body once: ¦await res.json()¦ / ¦.text()¦ / ¦.blob()¦.
- Sending JSON: ¦headers: { 'Content-Type': 'application/json' }¦ and ¦body: JSON.stringify(data)¦.
- ¦AbortController¦: pass ¦controller.signal¦; call ¦controller.abort()¦ to reject with an ¦AbortError¦. ¦AbortSignal.timeout(ms)¦ gives a built-in timeout.
- In React effects, abort in the cleanup function to prevent race conditions and state updates after unmount.
- ¦JSON.parse¦ throws on invalid text; ¦JSON.stringify¦ drops functions/undefined and can take a replacer.

#### Example
¦¦¦js
async function getJson(url, { signal } = {}) {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error('HTTP ' + res.status);       // fetch does NOT reject on 404/500
  return res.json();
}

// cancel previous search when user types again
let controller;
async function search(term) {
  controller?.abort();
  controller = new AbortController();
  try {
    return await getJson('/api/courses?q=' + encodeURIComponent(term), { signal: controller.signal });
  } catch (e) {
    if (e.name === 'AbortError') return null;               // expected
    throw e;
  }
}

// timeout in one line
// fetch(url, { signal: AbortSignal.timeout(5000) })

await fetch('/api/progress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ lessonId: 3, done: true }),
});
¦¦¦

#### Remember it
- **fetch resolves on 404. Check ¦res.ok¦.**
- Body can be read once.
- Cancel stale requests with ¦AbortController¦ (search boxes, effects).

#### Common mistakes
- Forgetting ¦res.ok¦.
- Forgetting ¦Content-Type¦ and ¦JSON.stringify¦.
- Not handling ¦AbortError¦ as a normal case.

#### Interview angle
**Model answer:** "fetch only rejects on network errors, so I check res.ok and throw. I use AbortController to cancel stale requests such as search-as-you-type and in React effect cleanup, which prevents race conditions."
**Follow-up:** *How do you add a timeout?* ¦AbortSignal.timeout(ms)¦ or a controller with ¦setTimeout¦.

### Debounce and throttle
#### In one line
**Debounce** waits until activity stops before running; **throttle** runs at most once per time window.

#### Real-life analogy
A lift door: **debounce** waits until nobody has pressed the button for a few seconds, then closes. **Throttle** is a bus leaving exactly every 10 minutes, however many people arrive.

#### How it works
- Debounce: reset a timer on every call; run when the delay passes without a new call. Best for search boxes, auto-save, window resize end.
- Throttle: run immediately (or at intervals) and ignore calls until the window ends. Best for scroll, mouse move, drag, analytics pings.
- Both rely on closures and ¦setTimeout¦. Add ¦cancel¦ for cleanup (React unmount).
- Options: leading edge (run first call), trailing edge (run last call).
- In React keep the debounced function stable with ¦useMemo/useRef¦ or use ¦useDebouncedValue¦.

#### Example
¦¦¦js
function debounce(fn, delay = 300) {
  let timer;
  const wrapped = (...args) => { clearTimeout(timer); timer = setTimeout(() => fn.apply(this, args), delay); };
  wrapped.cancel = () => clearTimeout(timer);
  return wrapped;
}

function throttle(fn, limit = 200) {
  let waiting = false;
  return (...args) => {
    if (waiting) return;
    fn(...args);
    waiting = true;
    setTimeout(() => (waiting = false), limit);
  };
}

const onSearch = debounce((q) => console.log('search', q), 300);
onSearch('r'); onSearch('re'); onSearch('rea');   // only 'rea' runs after 300ms

const onScroll = throttle(() => console.log('scroll handled'), 200);
window.addEventListener('scroll', onScroll, { passive: true });
¦¦¦

#### Remember it
- **Debounce = wait for quiet. Throttle = steady rhythm.**
- *Search box -> debounce. Scroll -> throttle.*
- Always provide ¦cancel¦.

#### Common mistakes
- Creating a new debounced function on every React render.
- Using arrow functions and losing ¦this¦ when needed.
- Forgetting trailing-edge behaviour (the final value is lost).

#### Interview angle
**Model answer:** "Debounce delays execution until the user stops, so I use it for search and auto-save; throttle limits execution to once per interval, so I use it for scroll and resize. Both are small closures over a timer."
**Follow-up:** *How would you test debounce?* Jest fake timers: advance time and assert call counts.

### Immutability patterns
#### In one line
Immutability means never changing data in place; you create a new copy with the change instead.

#### Real-life analogy
Editing a document with **Track Changes saved as a new version** rather than overwriting the original: you can compare, undo and know exactly what changed.

#### How it works
- React and Redux detect changes by **reference comparison** (¦prev !== next¦). If you mutate the same object, nothing re-renders.
- Arrays: add ¦[...arr, x]¦, remove ¦arr.filter¦, update ¦arr.map¦, sort ¦toSorted¦, replace ¦arr.with(i, x)¦.
- Objects: ¦{ ...obj, key: value }¦; nested updates copy every level on the path.
- Safer: ¦Object.freeze¦ (shallow), TypeScript ¦readonly¦ / ¦as const¦, libraries like Immer (write "mutating" code on a draft).
- Benefits: predictable state, easy undo/redo, memoisation, no accidental shared-state bugs.
- Structural sharing: unchanged parts keep the same reference.

#### Example
¦¦¦js
const state = { user: { name: 'Asha', tags: ['js'] }, lessons: [{ id: 1, done: false }, { id: 2, done: false }] };

// update nested value without mutation
const next = {
  ...state,
  user: { ...state.user, tags: [...state.user.tags, 'react'] },
  lessons: state.lessons.map(l => l.id === 2 ? { ...l, done: true } : l),
};

console.log(state.user.tags, next.user.tags);        // ['js'] ['js','react']
console.log(state.lessons[0] === next.lessons[0]);   // true (unchanged item reused)
console.log(state === next);                         // false -> React will re-render

const frozen = Object.freeze({ a: 1 });
frozen.a = 2;                                        // ignored (throws in strict mode)
console.log(frozen.a);                               // 1
¦¦¦

#### Remember it
- **Never mutate state. Copy, change, return.**
- Copy only the path you change (structural sharing).
- Mutators to avoid on state: push, splice, sort, reverse, direct assignment.

#### Common mistakes
- ¦state.items.push(x); setState(state)¦ (same reference, no update).
- Spreading only the top level of a nested update.
- Deep-cloning everything on every update.

#### Interview angle
**Model answer:** "React compares references, so I treat state as immutable: use spread, map, filter and toSorted to produce new objects, copying only the path that changes. For deeply nested state I use Immer."
**Follow-up:** *Does Object.freeze make deep immutability?* No, it is shallow.

## Phase 3 · Advanced (Lead level)
### Memory management and leaks
#### In one line
JavaScript frees memory automatically (garbage collection) for objects nobody can reach any more; a **leak** is memory you still reference by accident.

#### Real-life analogy
A hotel clearing rooms: housekeeping (the GC) cleans every room whose guests have left. A leak is a room where someone left a "do not disturb" sign (a forgotten reference), so it's never cleaned and the hotel slowly fills up.

#### How it works
- GC uses **reachability** (mark-and-sweep): anything reachable from roots (globals, the stack, active closures) stays; the rest is collected.
- Common leaks:
  - Forgotten ¦setInterval¦/timers and ¦addEventListener¦ never removed.
  - Closures holding big objects.
  - Growing global caches/arrays/Maps with no eviction.
  - Detached DOM nodes still referenced from JS.
  - React: effects without cleanup, subscriptions, stale refs.
- Fixes: cleanup in ¦useEffect¦ return, ¦AbortController¦ signals, ¦WeakMap/WeakRef¦, bounded caches (LRU), ¦removeEventListener¦.
- **Chrome DevTools > Memory:** take a heap snapshot, do the action, snapshot again and compare; look at "Detached" nodes and retained size. Performance monitor shows a rising heap that never drops after GC.

#### Example
¦¦¦js
// Leak: listener + interval never removed
function mountWidget(el) {
  const data = new Array(1e6).fill('x');
  const id = setInterval(() => console.log(data.length), 1000);
  window.addEventListener('resize', () => console.log(data.length));
  // no cleanup -> data stays alive forever
}

// Fixed with a cleanup function
function mountWidgetSafe() {
  const data = new Array(1e6).fill('x');
  const ctrl = new AbortController();
  const id = setInterval(() => console.log(data.length), 1000);
  window.addEventListener('resize', () => console.log(data.length), { signal: ctrl.signal });
  return () => { clearInterval(id); ctrl.abort(); };   // call on unmount
}

// React equivalent
// useEffect(() => { const id = setInterval(tick, 1000); return () => clearInterval(id); }, []);
¦¦¦

#### Remember it
- **Every "start" needs a "stop":** listener, timer, subscription, request.
- Leaks = unwanted references. Heap snapshots find them.
- Unbounded cache = leak.

#### Common mistakes
- Guessing instead of measuring with snapshots.
- Using ¦WeakRef¦ as the main caching tool.
- Believing GC runs on demand (it doesn't).

#### Interview angle
**Model answer:** "Memory is freed when objects become unreachable, so leaks come from forgotten references such as timers, listeners, closures and unbounded caches. I find them with heap snapshot comparisons in DevTools and fix them with cleanup functions and bounded caches."
**Follow-up:** *Is a circular reference a leak?* No; modern GC uses reachability, not reference counting.

### Proxy and Reflect
#### In one line
A **Proxy** wraps an object and lets you intercept operations like get, set and delete; **Reflect** gives the default behaviour for those operations.

#### Real-life analogy
A **receptionist** at a clinic: every request for the doctor passes through them. They can log it, check permissions, rewrite it, or refuse, and otherwise pass it on as normal (Reflect).

#### How it works
- ¦new Proxy(target, handler)¦ with traps: ¦get, set, has, deleteProperty, ownKeys, apply, construct¦ and more.
- ¦Reflect.get/set/has...¦ mirror each trap and keep ¦this¦/receiver semantics right; use them inside traps.
- Uses: validation, default values, logging, read-only views, observable/reactive state (Vue 3), API clients (dynamic methods), mocking in tests.
- Invariants: some rules cannot be broken (a non-writable property must keep its real value).
- Cost: slower than direct access; avoid in hot loops. Proxies are not equal to their targets (¦proxy !== target¦).

#### Example
¦¦¦js
function validated(target, schema) {
  return new Proxy(target, {
    set(obj, key, value, receiver) {
      if (schema[key] && typeof value !== schema[key]) throw new TypeError(key + ' must be ' + schema[key]);
      return Reflect.set(obj, key, value, receiver);
    },
    get(obj, key, receiver) {
      return key in obj ? Reflect.get(obj, key, receiver) : 'n/a';  // default value
    },
  });
}
const learner = validated({}, { age: 'number', name: 'string' });
learner.name = 'Asha';
try { learner.age = '30'; } catch (e) { console.log(e.message); }   // age must be number
console.log(learner.name, learner.missing);                          // 'Asha' 'n/a'

// tiny reactive store
const watch = (obj, cb) => new Proxy(obj, { set(t, k, v) { t[k] = v; cb(k, v); return true; } });
const store = watch({ count: 0 }, (k, v) => console.log('changed', k, v));
store.count++;                                                       // changed count 1
¦¦¦

#### Remember it
- **Proxy = gatekeeper. Reflect = "do the normal thing".**
- Traps: get, set, has, delete, apply.
- Vue 3 reactivity = Proxy; React = immutable updates (no Proxy needed).

#### Common mistakes
- Forgetting ¦return true¦ in a ¦set¦ trap (throws in strict mode).
- Using Proxies in performance-critical loops.
- Comparing a proxy to its target with ¦===¦.

#### Interview angle
**Model answer:** "A Proxy intercepts fundamental operations on an object through traps, and Reflect provides the default behaviour. It powers reactive frameworks like Vue 3, validation layers and logging wrappers, at some performance cost."
**Follow-up:** *Why does React not use Proxy for state?* It prefers explicit, immutable updates that are simpler to reason about and optimise.

### V8 basics: parsing, JIT, hidden classes, inline caching
#### In one line
V8 (Chrome/Node's engine) turns JavaScript into machine code on the fly and runs fastest when your objects have **consistent shapes** and types.

#### Real-life analogy
A chef who learns your usual order. If you order the same dish in the same format every time, they prepare it instantly (optimised). If every order is shaped differently, they must stop and think each time.

#### How it works
1. **Parse** source into an AST, then the **Ignition** interpreter produces bytecode and starts running it.
2. Hot code is profiled and compiled by the optimising JIT (**TurboFan**, plus mid-tier Maglev) into fast machine code using assumptions about types.
3. If an assumption fails (e.g. a number suddenly becomes a string) the code is **deoptimised** and falls back to slower bytecode.
4. **Hidden classes (shapes):** objects with the same properties added in the same order share a shape, allowing fast offset lookups.
5. **Inline caching:** call sites remember the shapes they've seen. *Monomorphic* (1 shape) is fastest, *polymorphic* a few, *megamorphic* slow.
- Practical rules: initialise all properties in the constructor in the same order; avoid ¦delete¦ on hot objects; keep arrays holding one type; don't change an array's type mid-way; don't write micro-optimisations before profiling.

#### Example
¦¦¦js
// Same shape: fast
function Point(x, y) { this.x = x; this.y = y; }
const a = new Point(1, 2), b = new Point(3, 4);

// Different shapes for the "same" concept: slower, polymorphic access
const p1 = { x: 1, y: 2 };
const p2 = { y: 2, x: 1 };        // different property order = different hidden class
const p3 = { x: 1 }; p3.y = 2;    // added later

// Deleting turns objects into slow dictionary mode
const hot = { id: 1, tmp: 2 };
delete hot.tmp;                    // prefer: hot.tmp = undefined

// Keep arrays homogeneous
const nums = [1, 2, 3];            // packed SMI/doubles (fast)
nums.push('x');                    // transitions to a generic elements kind (slower)

function sumX(points) { let s = 0; for (const p of points) s += p.x; return s; }
console.log(sumX([a, b]));         // 4 (monomorphic, optimised)
¦¦¦

#### Remember it
- **Same shape + same types = fast.**
- Parse -> Ignition (bytecode) -> TurboFan (optimised) -> maybe deopt.
- *Measure before you optimise.*

#### Common mistakes
- Micro-optimising without profiling.
- Using ¦delete¦ in hot paths.
- Mixing types in arrays and function arguments.

#### Interview angle
**Model answer:** "V8 interprets bytecode first, then JIT-compiles hot code assuming stable types and object shapes. I keep object shapes consistent, avoid delete and mixed-type arrays in hot paths, and always profile before optimising."
**Follow-up:** *What is deoptimisation?* The engine throws away optimised code when its type assumptions break.

### Event loop in Node vs browser
#### In one line
Both use an event loop, but Node (libuv) has distinct **phases** and extra queues such as ¦process.nextTick¦ and ¦setImmediate¦; the browser ties the loop to rendering.

#### Real-life analogy
A browser loop is a shopkeeper who also repaints the window display between customers. A Node loop is a factory foreman following a fixed round: timers, then I/O, then check, then cleanup, then repeat.

#### How it works
- **Node loop phases:** timers (¦setTimeout/setInterval¦) -> pending callbacks -> poll (I/O) -> **check** (¦setImmediate¦) -> close callbacks.
- Between phases Node drains: **¦process.nextTick¦ queue first**, then **promise microtasks** (¦queueMicrotask¦).
- ¦setImmediate¦ runs in the check phase right after poll; ¦setTimeout(0)¦ in the next timers phase. From the main module their order can vary; **inside an I/O callback, ¦setImmediate¦ is always first**.
- File system, DNS, crypto and zlib use the libuv **thread pool** (default 4 threads); network I/O uses the OS (epoll/kqueue).
- Browser: tasks -> microtasks -> ¦requestAnimationFrame¦ -> style/layout/paint -> idle callbacks.
- Rule: CPU-heavy loops block both; Node can use ¦worker_threads¦ or ¦cluster¦.

#### Example
¦¦¦js
// Node.js
const fs = require('fs');
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));
console.log('sync');
// sync, nextTick, promise, then timeout/immediate (order may vary)

fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout in I/O'), 0);
  setImmediate(() => console.log('immediate in I/O'));
  // always: immediate in I/O, then timeout in I/O
});
¦¦¦

#### Remember it
- **Node order: sync -> nextTick -> promises -> timers/poll/check.**
- *"nextTick is more urgent than a promise."*
- Inside I/O: ¦setImmediate¦ beats ¦setTimeout¦.

#### Common mistakes
- Recursive ¦process.nextTick¦ starving I/O.
- Blocking the loop with sync file reads or heavy JSON/regex.
- Assuming the browser and Node ordering are identical.

#### Interview angle
**Model answer:** "Node's libuv loop runs timers, poll for I/O, check for setImmediate and close callbacks, and drains nextTick and then promise microtasks between them. The browser loop is similar in spirit but is integrated with rendering and has no nextTick or setImmediate."
**Follow-up:** *How do you keep the Node loop responsive?* Avoid sync heavy work; offload to worker threads or queues.

### Concurrency tools: Web Workers, structuredClone, transferables
#### In one line
**Web Workers** run JavaScript on another thread so heavy work doesn't freeze the UI; data is passed by message using the structured clone algorithm or **transferred** without copying.

#### Real-life analogy
The main thread is the waiter dealing with customers. A worker is a **back-kitchen chef**: you pass orders through a hatch (¦postMessage¦). Large crates can be handed over (transferred) instead of photocopied, but then you no longer have them.

#### How it works
- ¦new Worker('worker.js')¦ (¦{ type: 'module' }¦ for imports). Workers have no DOM access; they communicate only with ¦postMessage¦ and ¦onmessage¦.
- Data is copied with **structuredClone** (supports objects, arrays, Map, Set, Date, typed arrays; not functions or DOM nodes).
- **Transferables** (¦ArrayBuffer¦, ¦MessagePort¦, ¦ImageBitmap¦, ¦OffscreenCanvas¦): ¦postMessage(buf, [buf])¦ moves ownership with zero copy; the sender's buffer becomes empty (detached).
- ¦SharedArrayBuffer¦ + ¦Atomics¦ allow shared memory (needs cross-origin isolation headers).
- Other types: Service Workers (network proxy/offline), Worklets. In Node: ¦worker_threads¦.
- Use when work takes more than ~50 ms: parsing huge JSON/CSV, image processing, crypto, search indexing. Don't use for tiny tasks (messaging overhead).

#### Example
¦¦¦js
// main.js
const worker = new Worker('csv-worker.js');
const buffer = new TextEncoder().encode(bigCsvText).buffer;
worker.postMessage({ buffer }, [buffer]);          // transfer, no copy
worker.onmessage = (e) => console.log('rows parsed:', e.data.rows);
worker.onerror = (e) => console.error(e.message);

// csv-worker.js
self.onmessage = ({ data }) => {
  const text = new TextDecoder().decode(data.buffer);
  const rows = text.split('\n').map(line => line.split(','));  // heavy part
  self.postMessage({ rows: rows.length });
};

console.log(structuredClone(new Map([['a', 1]])));  // Map { 'a' => 1 }
¦¦¦

#### Remember it
- **Worker = new thread, no DOM, talk via messages.**
- Copy = structuredClone; move = transfer.
- Only for heavy work (> ~50 ms).

#### Common mistakes
- Sending huge objects back and forth (copy cost).
- Trying to touch the DOM in a worker.
- Creating a new worker for every small task.

#### Interview angle
**Model answer:** "I move CPU-heavy work, like parsing large files, into a Web Worker so the main thread stays responsive. Messages are copied with structured clone, and large binary data can be transferred to avoid copying."
**Follow-up:** *Worker vs async/await?* Async doesn't add threads; it only avoids waiting. CPU-bound work still blocks without a worker.

### Performance: layout thrash, reflow vs repaint, requestAnimationFrame, idle callbacks, lazy loading
#### In one line
Fast pages avoid unnecessary layout work, animate on the compositor, and load only what the user needs when they need it.

#### Real-life analogy
Rearranging a shop: **reflow** is moving shelves (everything nearby shifts, expensive). **Repaint** is repainting a label (cheaper). **Layout thrashing** is measuring a shelf, moving it, measuring again, moving again, instead of measuring everything first and then moving.

#### How it works
- **Rendering pipeline:** JS -> style -> layout (reflow) -> paint -> composite.
- **Layout thrash:** alternating DOM reads (¦offsetHeight¦, ¦getBoundingClientRect¦) and writes (¦style.width¦) forces the browser to recalculate layout every time. Batch reads, then writes.
- Animate ¦transform¦ and ¦opacity¦ (compositor only) rather than ¦width/top/left¦.
- ¦requestAnimationFrame¦: run visual updates right before the next paint. ¦requestIdleCallback¦: low-priority work when idle.
- **Lazy loading:** ¦loading="lazy"¦ images, ¦IntersectionObserver¦, dynamic ¦import()¦, route-based code splitting, virtualised lists.
- Also: debounce/throttle handlers, ¦passive¦ listeners, avoid huge DOMs, use ¦content-visibility: auto¦, caching, compression, image sizing, preconnect.
- **Measure first:** DevTools Performance panel, Lighthouse, Web Vitals (LCP, INP, CLS).

#### Example
¦¦¦js
// Thrash: read/write inside loop
cards.forEach(c => { c.style.width = c.parentNode.offsetWidth + 'px'; });  // forces layout each time

// Better: batch reads, then writes
const widths = cards.map(c => c.parentNode.offsetWidth);
requestAnimationFrame(() => cards.forEach((c, i) => { c.style.width = widths[i] + 'px'; }));

// Lazy load a lesson video when it scrolls into view
const io = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.src = e.target.dataset.src; obs.unobserve(e.target); }
  });
}, { rootMargin: '200px' });
document.querySelectorAll('iframe[data-src]').forEach(el => io.observe(el));

// Defer non-critical work
requestIdleCallback(() => sendAnalytics(), { timeout: 2000 });
function sendAnalytics() {}
¦¦¦

#### Remember it
- **Read all, then write all.**
- Animate **transform + opacity**.
- *Measure, fix the biggest bottleneck, measure again.*

#### Common mistakes
- Optimising by guesswork.
- Animating layout properties.
- Loading the whole app bundle up front.

#### Interview angle
**Model answer:** "I profile first with the Performance panel and Web Vitals. Then I cut layout thrash by batching reads and writes, animate with transform, split code by route, lazy-load below-the-fold content and virtualise long lists. That's how we reached the 30-40% improvement on key pages."
**Follow-up:** *What is INP?* Interaction to Next Paint: how quickly the page responds visually to user input.

### Design patterns: module, observer/pub-sub, factory, strategy, singleton
#### In one line
Design patterns are proven shapes for solving recurring structure problems, named so teams can discuss them quickly.

#### Real-life analogy
Patterns are like **standard building plans**: a "newsletter" (observer) lets many people subscribe to one source; a "restaurant menu" (strategy) lets you pick different cooking methods for the same dish.

#### How it works
- **Module:** closure/ES module hiding private state and exposing a public API.
- **Observer / pub-sub:** subjects notify subscribers (¦on/emit/off¦). Basis of DOM events, Node ¦EventEmitter¦, Redux subscriptions.
- **Factory:** a function that creates objects without exposing creation details (¦createLogger(type)¦).
- **Strategy:** swap algorithms at runtime through a common interface (pricing, sorting, validation rules).
- **Singleton:** one shared instance (config, DB pool). In JS an ES module already behaves like a singleton.
- Others worth naming: **Adapter** (wrap an API), **Decorator/HOC** (add behaviour), **Facade** (simple API over complexity), **Command**, **Middleware chain** (Express).
- Don't force patterns; use them when they remove duplication or coupling.

#### Example
¦¦¦js
class EventEmitter {
  #handlers = new Map();
  on(evt, fn) { (this.#handlers.get(evt) ?? this.#handlers.set(evt, new Set()).get(evt)).add(fn); return () => this.off(evt, fn); }
  off(evt, fn) { this.#handlers.get(evt)?.delete(fn); }
  emit(evt, ...args) { this.#handlers.get(evt)?.forEach(fn => fn(...args)); }
}
const bus = new EventEmitter();
const stop = bus.on('lessonDone', id => console.log('completed', id));
bus.emit('lessonDone', 7);        // completed 7
stop(); bus.emit('lessonDone', 8); // nothing

// Strategy
const discounts = { none: p => p, student: p => p * 0.8, bulk: p => p * 0.7 };
const price = (p, type = 'none') => discounts[type](p);
console.log(price(100, 'student')); // 80

// Factory
const createStorage = (kind) => kind === 'session' ? sessionStorage : localStorage;
¦¦¦

#### Remember it
- **Observer = subscribe/notify. Strategy = swap behaviour. Factory = create. Module = hide. Singleton = one.**
- Express middleware = chain of responsibility.
- Know EventEmitter by heart: *on, off, emit*.

#### Common mistakes
- Using singletons for global mutable state.
- Over-engineering simple code with patterns.
- Forgetting to unsubscribe observers (leaks).

#### Interview angle
**Model answer:** "I use modules for encapsulation, pub-sub for decoupled communication, strategy to replace long if-else chains, and factories to centralise creation. I can implement an event emitter on a whiteboard with on, off and emit."
**Follow-up:** *Observer vs pub-sub?* Observer has direct subject-observer links; pub-sub adds a broker so publishers and subscribers don't know each other.

### Security basics: XSS, CSRF, prototype pollution, eval, CSP
#### In one line
Most web attacks come from trusting user input: never run it as code, never insert it as HTML, never merge it blindly into objects.

#### Real-life analogy
A security desk at a hospital: it checks every visitor (input validation), lets nobody walk into the pharmacy with their own keys (no eval), and only accepts calls from approved numbers (CORS/CSRF tokens/CSP).

#### How it works
- **XSS:** attacker's script runs in your page. Prevent: escape output, avoid ¦innerHTML¦/¦dangerouslySetInnerHTML¦ with untrusted data, sanitise HTML with DOMPurify, use **CSP**, set cookies ¦HttpOnly¦. React escapes text by default.
- **CSRF:** a malicious site makes the browser send your authenticated request. Prevent: ¦SameSite¦ cookies, CSRF tokens, checking ¦Origin¦, not using GET for changes.
- **Prototype pollution:** attacker sets ¦__proto__¦/¦constructor.prototype¦ via unsafe merge, changing all objects. Prevent: validate keys, ¦Object.create(null)¦, ¦Map¦, schema validation, patched libraries, ¦Object.freeze(Object.prototype)¦ in hardened environments.
- **eval / new Function / string setTimeout:** execute arbitrary strings; avoid entirely.
- **CSP (Content-Security-Policy):** header that restricts script sources (e.g. no inline scripts), limiting XSS damage.
- Also: don't keep tokens in ¦localStorage¦ if XSS is likely (prefer HttpOnly cookies), use HTTPS, update dependencies (¦npm audit¦), validate on the server always.

#### Example
¦¦¦js
// XSS
const el = document.querySelector('#comment');
const comment = '<img src=x onerror="steal()">';
// BAD:
// el.innerHTML = comment;
// GOOD: treat as text
el.textContent = comment;
// If HTML is required, sanitise
// el.innerHTML = DOMPurify.sanitize(comment);

// Prototype pollution
function unsafeMerge(t, s) { for (const k in s) { t[k] = typeof s[k] === 'object' ? unsafeMerge(t[k] ?? {}, s[k]) : s[k]; } return t; }
unsafeMerge({}, JSON.parse('{"__proto__": {"admin": true}}'));
console.log({}.admin);        // true (all objects polluted!)

function safeMerge(t, s) {
  for (const k of Object.keys(s)) {
    if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
    t[k] = s[k] && typeof s[k] === 'object' ? safeMerge(t[k] ?? {}, s[k]) : s[k];
  }
  return t;
}
¦¦¦

#### Remember it
- **XSS = their code in my page. CSRF = their request with my cookie.**
- Never eval; never trust input; escape on output; validate on the server.
- Headers: ¦CSP¦, ¦HttpOnly¦, ¦SameSite¦, ¦Secure¦.

#### Common mistakes
- Using ¦dangerouslySetInnerHTML¦ with unsanitised content.
- Client-side validation only.
- Storing long-lived tokens in ¦localStorage¦ without considering XSS.

#### Interview angle
**Model answer:** "React escapes output by default; I never inject raw HTML without DOMPurify, I use HttpOnly SameSite cookies and CSRF protection, validate input with schemas on the server, avoid eval, guard against prototype pollution in merges and add a strict CSP."
**Follow-up:** *Why isn't CORS a CSRF defence?* CORS controls reading responses; a simple cross-site form POST still gets sent with cookies.

### Testing JavaScript: Jest, fake timers, mocking fetch, testing async code
#### In one line
Automated tests prove your code works and keep working; good tests are fast, isolated and check behaviour, not implementation.

#### Real-life analogy
A **pre-flight checklist**: you run the same checks every time before take-off, so nothing is forgotten. Mocks are flight simulators: you test your reaction to bad weather without actual storms.

#### How it works
- **Test pyramid:** many unit tests, fewer integration tests, few end-to-end (Playwright/Cypress).
- Structure: ¦describe¦, ¦it/test¦, ¦expect(...).toBe/toEqual/toThrow¦. Pattern **Arrange - Act - Assert**.
- **Async:** ¦async/await¦ in tests, ¦await expect(p).resolves.toBe(...)¦, ¦rejects.toThrow¦. Always return/await promises or the test passes falsely.
- **Fake timers:** ¦jest.useFakeTimers()¦, ¦jest.advanceTimersByTime(ms)¦, ¦jest.runAllTimers()¦, restore with ¦useRealTimers¦.
- **Mocks:** ¦jest.fn()¦, ¦jest.spyOn(obj, 'method')¦, ¦jest.mock('module')¦. Mock ¦fetch¦ with ¦global.fetch = jest.fn()¦ or MSW (mocks at the network layer).
- Reset between tests: ¦afterEach(jest.restoreAllMocks)¦.
- Vitest uses almost identical APIs. For React: React Testing Library queries by role/text.
- Aim for meaningful coverage, not 100% numbers.

#### Example
¦¦¦js
// debounce.test.js
import { debounce } from './debounce';

describe('debounce', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('calls the function once after the delay', () => {
    const fn = jest.fn();
    const d = debounce(fn, 300);
    d('a'); d('b'); d('c');
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('c');
  });
});

// api.test.js
it('returns course data', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });
  await expect(getCourse(1)).resolves.toEqual({ id: 1 });
  expect(fetch).toHaveBeenCalledWith('/api/courses/1', expect.anything());
});

it('throws on 404', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404 });
  await expect(getCourse(9)).rejects.toThrow('HTTP 404');
});
¦¦¦

#### Remember it
- **AAA: Arrange, Act, Assert.**
- Fake timers for time, mocks for network, always ¦await¦ async assertions.
- Test behaviour users see, not private details.

#### Common mistakes
- Forgetting ¦await¦, so the test passes before the assertion runs.
- Leaking mocks/timers between tests.
- Over-mocking so tests check nothing real.

#### Interview angle
**Model answer:** "I write Arrange-Act-Assert tests with Jest or Vitest, use fake timers for debounce and retries, mock fetch or use MSW for network calls, and await every async assertion. I focus on behaviour and cover the critical paths."
**Follow-up:** *Unit vs integration vs E2E?* Unit tests a function in isolation, integration tests modules together, E2E drives the real app in a browser.

### Newer language features (check engine support): Object.groupBy, Promise.withResolvers, Set methods, array change-by-copy, iterator helpers
#### In one line
Recent ECMAScript additions replace common helper code with built-ins; knowing them shows you keep your skills current.

#### Real-life analogy
New power tools in a workshop: you can still use the old hand saw (lodash and reduce tricks), but the new tools do the job faster and with fewer mistakes.

#### How it works
- **¦Object.groupBy(items, fn)¦ / ¦Map.groupBy¦** (ES2024): group an array into keyed arrays.
- **¦Promise.withResolvers()¦** (ES2024): returns ¦{ promise, resolve, reject }¦ without the executor wrapper.
- **Array change-by-copy** (ES2023): ¦toSorted, toReversed, toSpliced, with¦ return new arrays, perfect for immutable state; also ¦findLast/findLastIndex¦ and ¦Array.fromAsync¦.
- **Set methods** (ES2025): ¦union, intersection, difference, symmetricDifference, isSubsetOf, isSupersetOf, isDisjointFrom¦.
- **Iterator helpers** (ES2025): ¦iterator.map/filter/take/drop/flatMap/toArray¦ for lazy pipelines.
- Others: ¦Object.hasOwn¦, ¦structuredClone¦, ¦at()¦, ¦Error cause¦, top-level ¦await¦, ¦Array.prototype.flat¦, ¦String.prototype.replaceAll¦, ¦using¦ declarations (explicit resource management, emerging).
- **Check support** (caniuse, MDN compat tables, Node version) and transpile/polyfill if you must support old browsers.

#### Example
¦¦¦js
const lessons = [
  { title: 'Closures', level: 'core' },
  { title: 'Proxies', level: 'advanced' },
  { title: 'Promises', level: 'core' },
];
console.log(Object.groupBy(lessons, l => l.level));
// { core: [Closures, Promises], advanced: [Proxies] }

// Promise.withResolvers: expose resolve outside the executor
const { promise, resolve } = Promise.withResolvers();
setTimeout(() => resolve('ready'), 50);
promise.then(console.log);                       // 'ready'

const a = new Set([1, 2, 3]), b = new Set([3, 4]);
console.log(a.union(b), a.intersection(b));      // Set {1,2,3,4} Set {3}

const nums = [3, 1, 2];
console.log(nums.toSorted(), nums.with(0, 9), nums); // [1,2,3] [9,1,2] [3,1,2]

function* naturals() { let n = 1; while (true) yield n++; }
console.log(naturals().filter(n => n % 2).map(n => n * n).take(3).toArray()); // [1, 9, 25]
¦¦¦

#### Remember it
- **Group = ¦Object.groupBy¦. Copy-not-mutate = ¦toSorted/with¦. Deferred promise = ¦withResolvers¦. Set maths = ¦union/intersection¦.**
- Always check support tables before relying on a feature.
- Mention one or two with a real use case in interviews.

#### Common mistakes
- Using brand-new APIs without checking browser/Node support.
- Forgetting these methods are static (¦Object.groupBy¦) rather than on arrays.
- Polyfilling blindly and increasing bundle size.

#### Interview angle
**Model answer:** "I use the newer built-ins where supported: toSorted and with for immutable state updates, Object.groupBy instead of a reduce, Promise.withResolvers for deferred promises, and the new Set methods. I check engine support and polyfill if needed."
**Follow-up:** *How do you decide to adopt a new feature?* Check browser/Node targets, build tooling/polyfills, and whether it improves readability enough to justify it.

`;
