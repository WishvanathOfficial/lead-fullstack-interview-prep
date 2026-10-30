window.PREP_NOTES = window.PREP_NOTES || {};
window.PREP_NOTES.typescript = String.raw`
## Phase 1 · Foundations (Basic)
### Why TypeScript: static typing, editor support, erased at runtime
#### In one line
TypeScript is JavaScript plus a type checker that runs before your code does. The types disappear when the code is compiled to JavaScript.

#### Real-life analogy
A spell-checker for code. It underlines mistakes while you type, but the printed letter (the JavaScript that runs) contains no trace of the checker.

#### How it works
1. You write ¦.ts¦ or ¦.tsx¦ files with type annotations.
2. The compiler (¦tsc¦) or a bundler (Vite, esbuild, SWC) checks the types and **removes** them.
3. The output is plain JavaScript that the browser or Node runs.

Benefits: bugs found at edit time, safe refactoring (rename a field and every use is flagged), autocomplete, and self-documenting function signatures.

Key limit: types do not exist at runtime. If the API returns bad data, TypeScript cannot stop it. You need runtime validation (zod) at the boundary.

#### Example
¦¦¦ts
type Course = { id: number; title: string };

function showCourse(c: Course) {
  return c.title.toUpperCase();
}

showCourse({ id: 1, title: 'Sepsis care' });   // OK
// showCourse({ id: 1 });                      // Error: property 'title' is missing

// At runtime the type is gone:
const data = JSON.parse('{"id":"x"}') as Course; // compiles, but id is a string!
¦¦¦

#### Remember it
- **Compile-time only**: TS checks, then erases.
- **Types are promises**, not guarantees, at the edges (network, JSON, user input).
- Gains: *catch bugs early, refactor safely, better tooling*.

#### Common mistakes
- Believing TypeScript validates API responses at runtime.
- Using ¦as¦ to silence errors instead of fixing the type.
- Treating TypeScript as a replacement for tests.

#### Interview angle
**Q: Why use TypeScript?** "It adds static types on top of JavaScript so we catch mistakes at compile time, refactor safely and get strong editor support. Types are erased at runtime, so for external data we pair it with runtime validation like zod." Follow-up: *What does TypeScript not protect you from?* (Runtime data shape, logic bugs, ¦any¦ leaks.)

### tsconfig essentials
#### In one line
¦tsconfig.json¦ tells the compiler how strict to be, what JavaScript to output and how to find modules.

#### Real-life analogy
The settings page of a spell-checker: language, how picky to be, and where to look for the dictionary.

#### How it works
Important options:
- **strict**: turns on a family of checks (¦noImplicitAny¦, ¦strictNullChecks¦, ¦strictFunctionTypes¦, ¦strictBindCallApply¦, ¦strictPropertyInitialization¦, ¦useUnknownInCatchVariables¦, ¦alwaysStrict¦, ¦noImplicitThis¦). Always start with ¦true¦.
- **target**: the JavaScript version emitted (¦ES2022¦ for modern Node/browsers).
- **module** and **moduleResolution**: how imports work (¦NodeNext¦ for Node ESM, ¦Bundler¦ for Vite/webpack).
- **skipLibCheck**: skips checking ¦.d.ts¦ files in ¦node_modules¦; makes builds faster.
- **noUncheckedIndexedAccess**: ¦arr[0]¦ becomes ¦T | undefined¦, which prevents out-of-range bugs.
- **isolatedModules**, **esModuleInterop**, **resolveJsonModule**: common bundler-friendly options.

#### Example
¦¦¦json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "skipLibCheck": true,
    "jsx": "react-jsx",
    "outDir": "dist"
  },
  "include": ["src"]
}
¦¦¦

#### Remember it
| Option | One-liner |
|---|---|
| strict | the master safety switch |
| target | which JS you emit |
| moduleResolution | how imports are found |
| skipLibCheck | faster, ignores library typings errors |
| noUncheckedIndexedAccess | array/index reads may be undefined |

#### Common mistakes
- Starting a new project with ¦strict: false¦ and never turning it on.
- Mixing ¦module: CommonJS¦ with ESM-only packages.
- Forgetting ¦include¦, so tests or build output get compiled.

#### Interview angle
**Q: What does strict do?** "It enables the strict family: no implicit any, strict null checks, strict function types and more. It is the setting that makes TypeScript actually useful." Follow-up: *How do you enable strict in an old codebase?* (Turn on one flag at a time and fix by folder.)

### Basic types: string, number, boolean, arrays, tuples, null, undefined
#### In one line
The building blocks: primitives, lists of one type, and fixed-length lists called tuples.

#### Real-life analogy
Labelled boxes in a pharmacy: a box labelled "tablets" only holds tablets. A tuple is a pill organiser with exactly 2 slots: the first for a name, the second for a dose.

#### How it works
- Primitives: ¦string¦, ¦number¦, ¦boolean¦, ¦bigint¦, ¦symbol¦, ¦null¦, ¦undefined¦.
- Arrays: ¦string[]¦ or ¦Array<string>¦ (same thing).
- Tuples: ¦[string, number]¦, order and length are fixed. Labels help: ¦[name: string, age: number]¦.
- With ¦strictNullChecks¦, ¦null¦ and ¦undefined¦ are separate types, so ¦string¦ can never be ¦null¦ unless you write ¦string | null¦.

#### Example
¦¦¦ts
const title: string = 'Hand hygiene';
const scores: number[] = [80, 92];
const pair: [string, number] = ['Anita', 4];   // tuple
// pair[2]                                      // Error: tuple of length 2
let note: string | null = null;                 // must say null is allowed

// React's useState returns a tuple:
// const [count, setCount] = useState(0);
¦¦¦

#### Remember it
- Lowercase types (¦string¦), never ¦String¦ or ¦Number¦ wrapper types.
- Array = *many of the same*. Tuple = *few, fixed, different*.
- Null and undefined are **not** part of other types when strict.

#### Common mistakes
- Using ¦Object¦, ¦String¦, ¦Function¦ (capitalised) as types.
- Using a tuple when an object with named fields is clearer.
- Forgetting that ¦push¦ on a tuple can still compile in older patterns.

#### Interview angle
**Q: Array vs tuple?** "An array is a list of any length with one element type. A tuple has a fixed length and a type per position, like React's useState return." Follow-up: *When do you avoid tuples?* (More than two or three items: use an object.)

### any vs unknown vs never vs void
#### In one line
¦any¦ turns checking off, ¦unknown¦ is the safe "anything", ¦never¦ is "cannot happen", ¦void¦ is "returns nothing useful".

#### Real-life analogy
¦any¦ is an unlabelled, unlocked box. ¦unknown¦ is a sealed parcel: you must open and inspect it before use. ¦never¦ is a door that nobody can walk through. ¦void¦ is a function that does its job and hands nothing back.

#### How it works
- **any**: no checks, spreads like a virus (anything touched by ¦any¦ can become ¦any¦).
- **unknown**: you can assign anything to it, but to use it you must narrow (¦typeof¦, ¦instanceof¦, a guard).
- **never**: the type of a function that always throws or never ends, and the leftover type after exhaustive narrowing.
- **void**: a function with no return value.

#### Example
¦¦¦ts
function parse(input: unknown): string {
  if (typeof input === 'string') return input.trim();   // narrowed
  if (typeof input === 'number') return String(input);
  throw new Error('Unsupported');                        // returns never
}

function fail(msg: string): never { throw new Error(msg); }

try { risky(); } catch (e: unknown) {
  if (e instanceof Error) console.error(e.message);      // safe use
}
¦¦¦

#### Remember it
- **any** = trust me (unsafe). **unknown** = prove it (safe).
- **never** = impossible. **void** = nothing returned.
- Rule: *reach for unknown, not any*.

#### Common mistakes
- Using ¦any¦ for JSON or ¦catch¦ errors.
- Confusing ¦void¦ and ¦undefined¦ (a callback typed ¦() => void¦ may still return a value that is ignored).
- Ignoring the compiler when a function accidentally returns ¦any¦.

#### Interview angle
**Q: any vs unknown?** "Both accept any value, but any disables checking while unknown forces me to narrow before use, so unknown is the safe choice for external data." Follow-up: *Where does never appear?* (Exhaustive switches and throwing functions.)

### Inference vs annotation
#### In one line
TypeScript can work out many types itself. You annotate the places where code meets the outside world.

#### Real-life analogy
A new colleague who reads context well: you don't label every drawer, but you do write clear labels on the doors other teams use.

#### How it works
- **Inference** from the initial value: ¦const n = 5¦ is type ¦number¦ (literal ¦5¦ for ¦const¦).
- **Annotate**: function parameters, exported function return types, empty arrays, and values that start empty.
- Inferred return types are fine for small local functions; annotate public APIs to keep contracts stable and compile times lower.

#### Example
¦¦¦ts
const ids = [1, 2, 3];                     // number[] inferred
const names: string[] = [];                // needed: empty array would be never[]/any[]

function total(prices: number[]): number { // annotate boundaries
  return prices.reduce((sum, p) => sum + p, 0);
}

const out = total([10, 20]);               // out is number, no annotation needed
¦¦¦

#### Remember it
- **Annotate boundaries** (params, exports); **infer the inside**.
- Empty collections and ¦let x;¦ need help.
- Over-annotating is noise; under-annotating on exports hides contracts.

#### Common mistakes
- Annotating every local variable.
- Leaving exported functions to infer a huge return type.
- Declaring ¦let x;¦ with no type (implicit any).

#### Interview angle
**Q: When do you annotate?** "On function parameters and public return types, and for empty initial values. Everywhere else I let inference work." Follow-up: *Why annotate exports?* (Stable contract, better error locations, faster builds.)

### Functions: optional, default, rest parameters, overloads, return types
#### In one line
Functions in TypeScript declare the type of every parameter and what they return; overloads describe several call shapes.

#### Real-life analogy
A form with required fields, optional fields, fields with default values, and "add as many guests as you like" fields.

#### How it works
- Optional: ¦name?: string¦ (type becomes ¦string | undefined¦, must come after required).
- Default: ¦limit = 10¦ (type inferred as ¦number¦).
- Rest: ¦...ids: number[]¦.
- Return type: after the parameter list; ¦void¦ if none.
- **Overloads**: several signatures plus one implementation. Use only when the return type depends on the input shape and a union or generic can't express it.

#### Example
¦¦¦ts
function listCourses(page = 1, limit = 20, ...tags: string[]): string {
  return ¦§{page}/§{limit}/§{tags.join(',')}¦;
}
listCourses();                    // "1/20/"
listCourses(2, 10, 'icu', 'er');  // "2/10/icu,er"

function toArray(x: string): string[];
function toArray(x: string[]): string[];
function toArray(x: string | string[]) { return Array.isArray(x) ? x : [x]; }
¦¦¦

#### Remember it
- Required → optional → default/rest (order).
- **Optional ≠ default**: optional may be undefined; default always has a value inside.
- Overload = *last resort*; the implementation signature is not visible to callers.

#### Common mistakes
- Putting optional parameters before required ones.
- Writing overloads where a generic or union would do.
- Forgetting that the implementation signature is not callable.

#### Interview angle
**Q: When use overloads?** "When different argument types produce different return types and one signature can't express it. Otherwise a union or generic is simpler." Follow-up: *Overload vs generic?* (Generics relate input to output without listing each case.)

### Objects: interface vs type, optional, readonly, index signatures
#### In one line
Describe the shape of an object with ¦interface¦ or ¦type¦, mark fields optional or readonly, and use index signatures for dynamic keys.

#### Real-life analogy
A patient registration form: some fields mandatory, some optional, some locked after submit (readonly), and a free "notes" area where any label is accepted (index signature).

#### How it works
- ¦interface¦: object shapes and classes, can **extend** and **merge** (declaration merging).
- ¦type¦: aliases for anything: unions, tuples, mapped and conditional types.
- ¦?¦ optional, ¦readonly¦ prevents reassignment (compile time only).
- Index signature: ¦{ [key: string]: number }¦ for dictionaries. Prefer ¦Record<string, number>¦.

#### Example
¦¦¦ts
interface User {
  readonly id: number;
  name: string;
  email?: string;
}
interface Admin extends User { permissions: string[] }

type Status = 'draft' | 'live';          // only a type alias can be a union
type Scores = Record<string, number>;
const s: Scores = { anita: 90 };

const u: User = { id: 1, name: 'A' };
// u.id = 2;   // Error: read-only
¦¦¦

#### Remember it
- Objects → **interface** (or type, be consistent). Unions/utilities → **type**.
- ¦readonly¦ = compile-time lock.
- Dictionaries → ¦Record<K, V>¦.

#### Common mistakes
- Thinking ¦readonly¦ makes the object frozen at runtime.
- Index signature with ¦noUncheckedIndexedAccess¦ off: values look always present.
- Mixing styles randomly in one codebase.

#### Interview angle
**Q: interface vs type?** "Both describe objects. Interfaces can be extended and merged, which is useful for library augmentation; types can express unions and mapped types. I use interfaces for public object contracts and types for everything else." Follow-up: *Can a type be merged?* (No, duplicates error.)

### Union, intersection and literal types
#### In one line
A union means "one of these", an intersection means "all of these together", a literal type means "exactly this value".

#### Real-life analogy
Union: "pay by card **or** cash". Intersection: "a doctor **and** a manager" (one person with both roles). Literal: the only allowed answers on a multiple-choice question.

#### How it works
- ¦A | B¦: the value is A or B; you can only use what both share until you narrow.
- ¦A & B¦: combine properties from both.
- Literals: ¦'draft' | 'live'¦, ¦1 | 2 | 3¦. ¦as const¦ keeps literals.
- String-literal unions usually replace enums: no runtime code, great autocomplete.

#### Example
¦¦¦ts
type Role = 'learner' | 'admin';
type Id = string | number;
type Timestamps = { createdAt: Date };
type CourseRow = { id: number; title: string } & Timestamps;

function label(id: Id) {
  return typeof id === 'string' ? id.toUpperCase() : id.toFixed(0); // narrowing
}
const r: Role = 'admin';
// const bad: Role = 'owner';   // Error
¦¦¦

#### Remember it
| Symbol | Word | Means |
|---|---|---|
| pipe (¦A or B¦ written with a vertical bar) | or | one of |
| ampersand (¦&¦) | and | all of |
| literal | exactly | one value |

#### Common mistakes
- Using a union member's property without narrowing.
- Intersecting incompatible primitives (¦string & number¦ is ¦never¦).
- Widening literals by using ¦let¦ without ¦as const¦.

#### Interview angle
**Q: Why prefer literal unions over enums?** "They have no runtime footprint, are easy to serialise and interoperate with JSON and APIs. Enums generate code and numeric enums are loosely typed." Follow-up: *When is an enum fine?* (Need reverse mapping or legacy code.)

### Narrowing: typeof, instanceof, in, equality, truthiness
#### In one line
Narrowing is the compiler learning a more specific type from your checks.

#### Real-life analogy
Airport security: "Is it a liquid or a laptop?" Once you check, you know which rules apply to that item.

#### How it works
TypeScript follows your code flow (control-flow analysis). After a check, the type inside the branch is narrower:
- ¦typeof x === 'string'¦ for primitives.
- ¦x instanceof Date¦ for classes.
- ¦'email' in obj¦ for property presence.
- ¦x === null¦ / ¦x !== undefined¦ for equality.
- Truthiness: ¦if (x)¦ removes ¦null¦ and ¦undefined¦ (also removes ¦0¦ and ¦''¦, so be careful).
- Discriminant checks: ¦if (r.type === 'ok')¦.

#### Example
¦¦¦ts
function show(v: string | number | Date | null) {
  if (v === null) return 'none';
  if (typeof v === 'string') return v.toUpperCase();
  if (typeof v === 'number') return v.toFixed(1);
  return v.toISOString();               // only Date is left
}
¦¦¦

#### Remember it
- Check → branch → **type shrinks**.
- Early ¦return¦ is a great narrowing tool.
- Truthiness is blunt: ¦0¦ and ¦''¦ disappear too.

#### Common mistakes
- Using truthiness when ¦0¦ or empty string is valid.
- Narrowing a value that is then mutated in a callback.
- Assuming ¦in¦ works on primitives.

#### Interview angle
**Q: What is narrowing?** "TypeScript analyses control flow and refines a union to a smaller type inside a branch after checks like typeof, instanceof, in or equality." Follow-up: *How do you narrow custom shapes?* (Discriminated unions or type predicates.)

### Assertions: as, non-null (!), satisfies
#### In one line
Assertions tell the compiler "trust me"; ¦satisfies¦ instead says "check me, but keep the precise type".

#### Real-life analogy
¦as¦ is signing a form "I confirm this is correct" without verification. ¦satisfies¦ is having it checked at the desk and still keeping your original details.

#### How it works
- ¦value as Type¦: overrides inference; no runtime check. Allowed only when types sufficiently overlap.
- ¦value!¦: removes ¦null¦ and ¦undefined¦; throws at runtime if you were wrong.
- ¦satisfies¦ (TS 4.9): validates against a type without widening.

#### Example
¦¦¦ts
const el = document.getElementById('root')!;           // risky: could be null

const routes = {
  home: '/',
  course: '/course/:id',
} satisfies Record<string, string>;
routes.home;            // type is literal '/'-like string, keys are known
// routes.missing       // Error (with 'as Record<...>' it would be allowed)

const data = JSON.parse(text) as { id: number };        // unchecked promise!
¦¦¦

#### Remember it
- **as** = promise, **!** = bigger promise, **satisfies** = verified.
- Prefer a check (¦if¦ or a guard) over an assertion.
- Each ¦as¦ in code review deserves a reason.

#### Common mistakes
- ¦as unknown as T¦ double-casts to bypass the compiler.
- Using ¦!¦ to quieten ¦undefined¦ from ¦array.find¦.
- Asserting API data instead of validating it.

#### Interview angle
**Q: as vs satisfies?** "as overrides the type without checking and can hide bugs; satisfies validates the value against a type but keeps its specific inferred type, so I get both safety and precision." Follow-up: *When is ! acceptable?* (When an invariant is truly guaranteed, ideally documented.)

## Phase 2 · Everyday power (Intermediate)
### Generics: functions, interfaces, constraints, defaults
#### In one line
Generics are type parameters: you write one piece of code that works for many types and still keeps the exact type.

#### Real-life analogy
A labelled lunchbox: the box design is the same, but the label says what is inside (¦Box<Apple>¦, ¦Box<Sandwich>¦).

#### How it works
- Declare ¦<T>¦ after the name. TypeScript **infers** ¦T¦ from the arguments.
- Constraint: ¦T extends { id: number }¦ means "any type that has at least an id".
- Default: ¦<T = string>¦.
- Multiple params: ¦<K extends keyof T, T>¦ links one argument to another.

#### Example
¦¦¦ts
function first<T>(items: T[]): T | undefined {
  return items[0];
}
first([1, 2]);         // number | undefined
first(['a']);          // string | undefined

function byId<T extends { id: number }>(list: T[], id: number): T | undefined {
  return list.find(x => x.id === id);
}

interface ApiResult<T = unknown> { data: T; error?: string }
const r: ApiResult<{ title: string }> = { data: { title: 'Sepsis' } };
¦¦¦

#### Remember it
- ¦T¦ = "some type I'll learn from the call".
- **extends** = minimum requirement.
- If a type parameter is used only once, you probably don't need it.

#### Common mistakes
- Using ¦any¦ where a generic keeps the type.
- Over-constraining or adding generics that are used only once.
- Forgetting the return type depends on ¦T¦ (returning ¦any¦).

#### Interview angle
**Q: Explain generics.** "They let me write reusable code that keeps type information, like a function that returns the same type it receives, with optional constraints." Follow-up: *Write a generic ¦pick¦ function.* (¦<T, K extends keyof T>(o: T, k: K): T[K]¦)

### Built-in utility types
#### In one line
Ready-made helpers that transform an existing type, so you don't rewrite similar types.

#### Real-life analogy
Photocopier presets: "make all fields optional", "keep only these fields", "make it read-only".

#### How it works
| Utility | What it does |
|---|---|
| ¦Partial<T>¦ | all properties optional |
| ¦Required<T>¦ | all properties required |
| ¦Readonly<T>¦ | all properties readonly |
| ¦Pick<T, K>¦ | keep only keys K |
| ¦Omit<T, K>¦ | remove keys K |
| ¦Record<K, V>¦ | object with keys K and values V |
| ¦ReturnType<F>¦ | return type of function F |
| ¦Parameters<F>¦ | tuple of F's parameter types |
| ¦Awaited<T>¦ | unwraps a Promise |
| ¦NonNullable<T>¦ | removes null and undefined |

#### Example
¦¦¦ts
interface User { id: number; name: string; email: string }

type UserUpdate = Partial<Omit<User, 'id'>>;     // PATCH body
type UserCard = Pick<User, 'id' | 'name'>;
type ById = Record<number, User>;

async function load() { return { id: 1, name: 'A' }; }
type Loaded = Awaited<ReturnType<typeof load>>;  // { id: number; name: string }
¦¦¦

#### Remember it
- **Pick / Omit** change *which keys*.
- **Partial / Required / Readonly** change *modifiers*.
- **ReturnType / Parameters / Awaited** read *functions and promises*.

#### Common mistakes
- Using ¦Partial¦ for forms and then forgetting required checks.
- ¦Omit¦ with a key that doesn't exist (no error on plain ¦Omit¦).
- Applying ¦Readonly¦ and expecting deep immutability.

#### Interview angle
**Q: Which utility types do you use?** "Partial and Omit for update DTOs, Pick for view models, Record for lookup maps and ReturnType with Awaited to derive types from async functions." Follow-up: *Implement Partial yourself.* (¦{ [K in keyof T]?: T[K] }¦)

### keyof, typeof, indexed access types, as const
#### In one line
Tools that derive types from values and other types, so there is one source of truth.

#### Real-life analogy
Instead of retyping a menu in two places, you print the second menu from the first.

#### How it works
- ¦keyof T¦: union of T's keys.
- ¦typeof value¦ (in a type position): the type of a value.
- ¦T[K]¦: type of property K in T.
- ¦as const¦: freezes literals and makes arrays readonly tuples.

#### Example
¦¦¦ts
const ROLES = ['learner', 'mentor', 'admin'] as const;
type Role = typeof ROLES[number];             // 'learner' | 'mentor' | 'admin'

const config = { api: '/v1', retries: 3 } as const;
type Config = typeof config;                  // readonly { api: '/v1'; retries: 3 }

interface User { id: number; name: string }
type UserKey = keyof User;                    // 'id' | 'name'
type NameType = User['name'];                 // string

function get<T, K extends keyof T>(o: T, k: K): T[K] { return o[k]; }
¦¦¦

#### Remember it
- **keyof** → keys. **typeof** → value's type. **T[K]** → property type. **as const** → exact literals.
- Define values once, derive types: no drift.

#### Common mistakes
- Using ¦typeof¦ on a type (it works on values).
- Forgetting ¦as const¦, so the array is ¦string[]¦ and ¦Role¦ becomes ¦string¦.
- Writing the same union twice (a value and a type).

#### Interview angle
**Q: How do you avoid duplicating a union and a list?** "I define the array with as const and derive the type with typeof ROLES[number], so the runtime list and the type stay in sync." Follow-up: *What does as const do to objects?* (Readonly with literal values.)

### Discriminated unions and exhaustive checks with never
#### In one line
A union where every member has a shared tag field, so one check tells the compiler the exact member.

#### Real-life analogy
Boarding passes with a colour band: green means economy, red means business. The band tells staff which rules to apply.

#### How it works
1. Give each member a literal ¦type¦ (or ¦status¦, ¦kind¦) field.
2. Check that field in ¦switch¦ or ¦if¦.
3. In the ¦default¦ branch assign the value to ¦never¦. If you add a new member and forget a case, the compiler errors.

#### Example
¦¦¦ts
type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: string[] };

function view(s: State): string {
  switch (s.status) {
    case 'loading': return 'Loading...';
    case 'error':   return s.message;           // narrowed
    case 'success': return s.data.join(', ');
    default: {
      const _exhaustive: never = s;             // error if a case is missing
      return _exhaustive;
    }
  }
}
¦¦¦

#### Remember it
- **Tag + switch + never** = safe state modelling.
- Replaces booleans like ¦isLoading¦, ¦isError¦ that can contradict each other.
- Perfect for reducers, API states, events.

#### Common mistakes
- Using ¦string¦ instead of literals for the tag.
- Optional fields instead of a union (impossible states allowed).
- Forgetting the ¦never¦ check, so new cases pass silently.

#### Interview angle
**Q: How do you model async state?** "A discriminated union with a status tag, so each state carries only the data valid for it, and an exhaustive switch with never catches missing cases." Follow-up: *Why not several booleans?* (They allow impossible combinations.)

### Type guards, predicates and assertion functions
#### In one line
Functions that tell TypeScript what type a value has after a runtime check.

#### Real-life analogy
A security officer who checks an ID and stamps it "verified staff". After the stamp, everyone treats the person as staff.

#### How it works
- **Type predicate**: ¦function isX(v: unknown): v is X¦; return ¦true¦ only when v really is X.
- **Assertion function**: ¦function assertX(v: unknown): asserts v is X¦; throws if not.
- Best use: turn ¦unknown¦ (API, JSON) into a trusted type. In practice zod/valibot do this for you.

#### Example
¦¦¦ts
interface Course { id: number; title: string }

function isCourse(v: unknown): v is Course {
  return typeof v === 'object' && v !== null
    && typeof (v as any).id === 'number'
    && typeof (v as any).title === 'string';
}

function assertCourse(v: unknown): asserts v is Course {
  if (!isCourse(v)) throw new Error('Invalid course');
}

const raw: unknown = JSON.parse('{"id":1,"title":"ICU"}');
if (isCourse(raw)) console.log(raw.title);    // typed
¦¦¦

#### Remember it
- **is** → boolean check that narrows. **asserts** → throws or continues.
- The compiler *trusts* your guard: a wrong guard is a lie.
- For big shapes use a schema library.

#### Common mistakes
- A predicate that returns true too easily.
- Forgetting ¦null¦ when checking ¦typeof x === 'object'¦.
- Writing manual guards for large API payloads.

#### Interview angle
**Q: How do you validate unknown data?** "Narrow it with a type guard or, better, parse it with zod and infer the type, so the check and the type come from one schema." Follow-up: *What is the risk of a type predicate?* (If it's wrong, TypeScript still trusts it.)

### Classes: access modifiers, abstract, implements, parameter properties
#### In one line
Classes in TypeScript add ¦public¦, ¦private¦, ¦protected¦, ¦readonly¦ and abstract members to JavaScript classes.

#### Real-life analogy
A hospital building: reception is public, staff rooms protected, the pharmacy safe private.

#### How it works
- ¦public¦ (default), ¦protected¦ (class and subclasses), ¦private¦ (class only; compile-time).
- JS ¦#field¦ is **truly** private at runtime; TS ¦private¦ is erased.
- ¦abstract¦ classes can't be instantiated and force subclasses to implement members.
- ¦implements¦ checks a class meets an interface.
- **Parameter properties**: ¦constructor(private repo: Repo)¦ declares and assigns in one step (great for dependency injection).

#### Example
¦¦¦ts
interface Notifier { send(to: string, msg: string): Promise<void> }

abstract class BaseService {
  protected abstract name: string;
  log(m: string) { console.log(¦[§{this.name}] §{m}¦); }
}

class EmailNotifier extends BaseService implements Notifier {
  protected name = 'email';
  #attempts = 0;                                  // runtime-private
  constructor(private readonly apiKey: string) { super(); }
  async send(to: string, msg: string) { this.#attempts++; this.log(¦to §{to}¦); }
}
¦¦¦

#### Remember it
| Keyword | Visible to |
|---|---|
| public | everyone |
| protected | class + subclasses |
| private | class only |
| #x | class only, at runtime too |

#### Common mistakes
- Thinking ¦private¦ blocks access at runtime.
- Using inheritance where composition is simpler.
- Forgetting ¦readonly¦ for injected dependencies.

#### Interview angle
**Q: TS private vs #private?** "TypeScript private is checked only at compile time and removed; the hash prefix is real JavaScript privacy enforced at runtime." Follow-up: *abstract class vs interface?* (Abstract classes can hold implementation; interfaces are pure contracts.)

### Modules and declaration files (.d.ts), @types, module augmentation
#### In one line
Declaration files describe the types of JavaScript code, and augmentation lets you extend existing types.

#### Real-life analogy
A user manual for a machine that has no labels: the manual (¦.d.ts¦) tells you what each button does without changing the machine.

#### How it works
- ¦.d.ts¦ files contain only types.
- Packages ship their own types or you install ¦@types/xyz¦.
- If a library has none: ¦declare module 'legacy-lib';¦ (quick) or write proper declarations.
- **Module augmentation**: reopen a module to add to an interface (e.g. add ¦user¦ to Express ¦Request¦).
- Make sure the file is included in ¦tsconfig¦ (¦include¦ or ¦typeRoots¦).

#### Example
¦¦¦ts
// types/legacy-lib.d.ts
declare module 'legacy-lib' {
  export function parse(s: string): { ok: boolean };
}

// types/express.d.ts  (file must be a module: has an export/import)
import 'express';
declare module 'express-serve-static-core' {
  interface Request { user?: { id: number; role: 'admin' | 'learner' } }
}
export {};
¦¦¦

#### Remember it
- **@types** = community typings; **.d.ts** = typings only; **augmentation** = add to existing.
- Missing type error ⇒ install ¦@types/...¦ first.

#### Common mistakes
- Augmentation file not included in tsconfig.
- Forgetting ¦export {}¦ so the file becomes a global script.
- Using ¦declare module '*'¦ everywhere (turns everything into any).

#### Interview angle
**Q: How do you add types for an untyped library?** "Check for @types, otherwise write a declare module block with only what I use, and extend it as needed." Follow-up: *How do you add req.user in Express?* (Augment express-serve-static-core.)

### Typing React: props, children, events, hooks, refs, generic components
#### In one line
Give components typed props and use React's event and hook types so JSX stays safe.

#### Real-life analogy
A power socket that only accepts the right plug: props are the plug shape, and TypeScript is the socket cover.

#### How it works
- Props: an interface/type; return type is inferred.
- Children: ¦React.ReactNode¦ (or ¦PropsWithChildren¦).
- Events: ¦React.ChangeEvent<HTMLInputElement>¦, ¦React.FormEvent<HTMLFormElement>¦, ¦React.MouseEvent¦.
- Hooks: ¦useState<User | null>(null)¦, ¦useRef<HTMLInputElement>(null)¦, ¦useReducer¦ with a discriminated union.
- Generic components: ¦function Table<T>(props: Props<T>)¦.

#### Example
¦¦¦ts
import { useState, useRef } from 'react';

type Column<T> = { key: keyof T; header: string };
type TableProps<T> = { rows: T[]; columns: Column<T>[]; onSelect?: (row: T) => void };

export function Table<T extends { id: number }>({ rows, columns, onSelect }: TableProps<T>) {
  return (
    <table><tbody>
      {rows.map(r => (
        <tr key={r.id} onClick={() => onSelect?.(r)}>
          {columns.map(c => <td key={String(c.key)}>{String(r[c.key])}</td>)}
        </tr>
      ))}
    </tbody></table>
  );
}

function SearchBox() {
  const [q, setQ] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  return <input ref={ref} value={q} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)} />;
}
¦¦¦

#### Remember it
- Props = interface; children = ¦ReactNode¦; events = ¦React.XEvent<Element>¦.
- ¦useState<T>¦ when initial value doesn't show the full type.
- Avoid ¦React.FC¦ unless you need it; plain functions are clearer.

#### Common mistakes
- ¦useState([])¦ gives ¦never[]¦.
- Typing event handlers as ¦any¦.
- Forgetting ¦| null¦ on refs.

#### Interview angle
**Q: How do you type a reusable table?** "A generic component with ¦T extends { id }¦, columns typed by ¦keyof T¦, so keys can't be misspelled and the row callback gets the exact type." Follow-up: *How do you type useReducer?* (Discriminated union of actions.)

### Typing Node/Express: Request/Response generics, middleware, env, DTOs
#### In one line
Type request bodies, params and responses, and validate input at runtime with a schema so types and validation match.

#### Real-life analogy
A reception desk with a checklist: it checks each form at the door (validation) and then everyone inside trusts it (types).

#### How it works
- ¦Request<Params, ResBody, ReqBody, Query>¦ generics type each part.
- Middleware is ¦(req, res, next) => void¦ (type ¦RequestHandler¦).
- Environment: parse ¦process.env¦ once with a schema; export a typed ¦config¦.
- DTOs: define a zod schema, then ¦z.infer<typeof Schema>¦ for the type.

#### Example
¦¦¦ts
import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const CreateCourse = z.object({ title: z.string().min(3), level: z.enum(['basic', 'pro']) });
type CreateCourseDto = z.infer<typeof CreateCourse>;

const validate = (schema: z.ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    const r = schema.safeParse(req.body);
    if (!r.success) return res.status(400).json(r.error.flatten());
    req.body = r.data;
    next();
  };

const app = express();
app.post('/courses', validate(CreateCourse),
  (req: Request<{}, {}, CreateCourseDto>, res: Response) => {
    res.status(201).json({ title: req.body.title });   // typed
  });
¦¦¦

#### Remember it
- **Schema first**: validate at the edge, infer the type.
- Never trust ¦req.body¦ type alone; it is only a hint.
- Parse env once at startup.

#### Common mistakes
- Typing ¦req.body¦ without validating.
- Reading ¦process.env.X¦ everywhere (string | undefined).
- Duplicating DTO interface and validation logic.

#### Interview angle
**Q: How do you keep types and validation in sync?** "I define a zod schema, validate in middleware and infer the DTO type from it, so there is one source of truth." Follow-up: *Why isn't req: Request<..., Body> enough?* (It is a compile-time claim, not a check.)

### Async types and errors: Promise<T>, Awaited, unknown in catch
#### In one line
An async function returns ¦Promise<T>¦, and caught errors should be ¦unknown¦ until you check them.

#### Real-life analogy
An order slip: you hold a promise of a meal (¦Promise<Meal>¦). When it arrives you unwrap it with ¦await¦. If something fails, the kitchen's note could say anything, so read carefully first.

#### How it works
- ¦async function f(): Promise<T>¦, and ¦await¦ gives ¦T¦.
- ¦Awaited<T>¦ unwraps nested promises.
- ¦Promise.all¦ keeps tuple types.
- With ¦useUnknownInCatchVariables¦ (part of strict) ¦catch (e)¦ is ¦unknown¦. Narrow with ¦instanceof Error¦.
- Result pattern: return ¦{ ok: true, data } | { ok: false, error }¦ for expected failures.

#### Example
¦¦¦ts
async function getCourse(id: number): Promise<{ id: number; title: string }> {
  const res = await fetch(¦/api/courses/§{id}¦);
  if (!res.ok) throw new Error(¦HTTP §{res.status}¦);
  return res.json();
}

const [a, b] = await Promise.all([getCourse(1), getCourse(2)]); // typed tuple

try {
  await getCourse(0);
} catch (e: unknown) {
  const msg = e instanceof Error ? e.message : 'Unknown error';
  console.error(msg);
}
¦¦¦

#### Remember it
- ¦async¦ ⇒ always ¦Promise¦. ¦await¦ ⇒ unwrap.
- **catch → unknown → narrow**.
- Expected failures → Result type; unexpected → throw.

#### Common mistakes
- Forgetting to ¦await¦ and getting a ¦Promise¦ where a value is expected.
- ¦catch (e: any)¦ and reading ¦e.message¦ blindly.
- Returning ¦Promise<Promise<T>>¦-like shapes by mistake.

#### Interview angle
**Q: How do you type caught errors?** "As unknown, then narrow with instanceof Error or a custom guard before using message or status." Follow-up: *Why not any?* (any hides that anything can be thrown, even a string.)

## Phase 3 · Advanced (Lead level)
### Mapped types and key remapping (as)
#### In one line
A mapped type loops over the keys of a type and builds a new type from them.

#### Real-life analogy
A rubber stamp pressed on every row of a form: each field gets the same treatment (make optional, make readonly, rename).

#### How it works
- Syntax: ¦{ [K in keyof T]: NewType }¦.
- Modifiers: add or remove with ¦?¦, ¦readonly¦, ¦-?¦, ¦-readonly¦.
- **Key remapping** with ¦as¦: add ¦as¦ after ¦keyof T¦ and build the new key name with a template literal type (see the example) to rename keys.
- Filter keys by remapping to ¦never¦.
- Built-ins like ¦Partial¦, ¦Readonly¦, ¦Record¦ are mapped types.

#### Example
¦¦¦ts
type Nullable<T> = { [K in keyof T]: T[K] | null };

type Getters<T> = {
  [K in keyof T as ¦get§{Capitalize<string & K>}¦]: () => T[K];
};
type U = { name: string; age: number };
type G = Getters<U>;      // { getName: () => string; getAge: () => number }

type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

type OnlyStrings<T> = { [K in keyof T as T[K] extends string ? K : never]: T[K] };
¦¦¦

#### Remember it
- **in keyof T** = loop over keys. **as** = rename or drop keys.
- **-?** removes optional; **+readonly / -readonly** toggles.
- Recursion gives "Deep" versions.

#### Common mistakes
- Forgetting ¦string & K¦ when using template literals on keys.
- Expecting ¦DeepReadonly¦ to handle arrays and functions without extra cases.
- Over-engineering when a utility type exists.

#### Interview angle
**Q: Implement Partial.** "¦type MyPartial<T> = { [K in keyof T]?: T[K] }¦. A mapped type iterates keys and can add or remove modifiers." Follow-up: *How to remove optionality?* (¦-?¦.)

### Conditional types and infer
#### In one line
A type-level if/else: "if T extends U then X, else Y", with ¦infer¦ to capture a piece of T.

#### Real-life analogy
A sorting machine at a mail room: if the parcel is a letter go left, else go right; and ¦infer¦ reads the postcode off the parcel.

#### How it works
- ¦T extends U ? X : Y¦.
- ¦infer R¦ declares a type variable inside the check.
- **Distributive**: with a naked type parameter, the condition runs on each union member. Wrap in ¦[T]¦ to avoid.
- Built-ins ¦ReturnType¦, ¦Parameters¦, ¦Awaited¦, ¦NonNullable¦ are conditional types.

#### Example
¦¦¦ts
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type A = UnwrapPromise<Promise<string>>;   // string
type B = UnwrapPromise<number>;            // number

type ElementType<T> = T extends (infer E)[] ? E : never;
type C = ElementType<string[]>;            // string

type MyReturn<F> = F extends (...args: any[]) => infer R ? R : never;

// distributive:
type ToArray<T> = T extends any ? T[] : never;
type D = ToArray<string | number>;         // string[] | number[]
¦¦¦

#### Remember it
- **extends ? :** = type-level ternary.
- **infer** = "capture this part".
- Naked ¦T¦ + union = distributes.

#### Common mistakes
- Forgetting distribution (¦never¦ input gives ¦never¦).
- Writing very deep conditional types that slow the compiler.
- Using ¦any¦ in the check and losing information.

#### Interview angle
**Q: What does infer do?** "It declares a type variable inside a conditional type to extract part of a matched type, for example the resolved value of a Promise." Follow-up: *Write ReturnType.* (See above.)

### Template literal types
#### In one line
Build string types from other string types, like template strings but for types.

#### Real-life analogy
Name tags generated from a pattern: "Hello, [Name]" for every allowed name.

#### How it works
- A template such as on-plus-Event (written with a dollar-brace placeholder inside backticks) combines unions into all combinations.
- Intrinsic helpers: ¦Uppercase¦, ¦Lowercase¦, ¦Capitalize¦, ¦Uncapitalize¦.
- Pair with ¦infer¦ to parse strings like routes.

#### Example
¦¦¦ts
type Entity = 'course' | 'user';
type Action = 'created' | 'deleted';
type EventName = ¦§{Entity}:§{Action}¦;    // 'course:created' | 'course:deleted' | 'user:created' | 'user:deleted'

function emit(e: EventName) {}
emit('course:created');   // ok
// emit('course:updated'); // error

type RouteParams<S extends string> =
  S extends ¦§{string}:§{infer P}/§{infer Rest}¦ ? P | RouteParams<Rest>
  : S extends ¦§{string}:§{infer P}¦ ? P
  : never;
type P = RouteParams<'/course/:id/lesson/:lessonId'>;   // 'id' | 'lessonId'
¦¦¦

#### Remember it
- Unions multiply: 2 × 2 = 4 strings.
- Great for event names, routes, CSS-like tokens.
- Keep patterns small; huge unions slow the compiler.

#### Common mistakes
- Creating massive unions (hundreds of thousands of members).
- Forgetting that numbers need ¦§{number}¦ in the template.
- Using it where a plain ¦string¦ is good enough.

#### Interview angle
**Q: Where do you use template literal types?** "For typed event names and routes, so ¦emit('course:updated')¦ fails at compile time." Follow-up: *How to extract route params?* (Recursive conditional with infer.)

### Branded (opaque) types
#### In one line
Add a fake tag to a primitive so ¦UserId¦ and ¦OrderId¦ can't be mixed up.

#### Real-life analogy
Two keys that look identical but carry different coloured rings: the lock for the pharmacy only accepts the red ring.

#### How it works
- TypeScript is structural, so two ¦number¦ aliases are interchangeable.
- Add a phantom property: ¦type UserId = number & { readonly __brand: 'UserId' }¦.
- Create values through one constructor/validator function, which uses an assertion internally.
- The brand does not exist at runtime.

#### Example
¦¦¦ts
type Brand<T, B extends string> = T & { readonly __brand: B };
type UserId = Brand<number, 'UserId'>;
type OrderId = Brand<number, 'OrderId'>;

const asUserId = (n: number) => n as UserId;       // the only place with a cast

function loadUser(id: UserId) {}
const u = asUserId(1);
const o = 5 as OrderId;

loadUser(u);        // ok
// loadUser(o);     // error: OrderId is not UserId
// loadUser(1);     // error: plain number
¦¦¦

#### Remember it
- **Structural typing needs help** → brand it.
- One constructor, validation inside.
- Zero runtime cost.

#### Common mistakes
- Casting brands all over the code.
- Branding without validating (the brand claims something unchecked).
- Using for everything (adds friction).

#### Interview angle
**Q: Why brand IDs?** "TypeScript compares shapes, so two number IDs are interchangeable. A brand makes them distinct types and prevents passing an order ID where a user ID is expected." Follow-up: *What does it cost at runtime?* (Nothing.)

### Structural typing and variance
#### In one line
TypeScript checks what a value looks like, not what it is named, and has rules for when one type can replace another.

#### Real-life analogy
Duck test: if it walks and quacks like a duck, TypeScript treats it as a duck, regardless of its name tag.

#### How it works
- **Structural**: ¦{ id: number; name: string; extra: boolean }¦ can be used where ¦{ id: number }¦ is expected.
- **Excess property check**: an object **literal** assigned directly must not have extra keys. Assign through a variable and the check disappears.
- **Variance**: return types are *covariant* (a subtype is fine). Function parameters are *contravariant* under ¦strictFunctionTypes¦ (for function-typed properties), but **method** parameters remain *bivariant* for compatibility, which is less safe.
- ¦in¦ / ¦out¦ variance annotations exist for generics (TS 4.7+).

#### Example
¦¦¦ts
interface Named { name: string }
const learner = { name: 'Anita', age: 30 };
const n: Named = learner;                // ok: extra field via variable

// const m: Named = { name: 'A', age: 3 }; // error: excess property in literal

class A { x = 1 }
class B { x = 2 }
const a: A = new B();                    // ok, same shape

type Handler = { cb: (e: string) => void };    // property: strict (contravariant)
type Handler2 = { cb(e: string): void };       // method: bivariant (looser)
¦¦¦

#### Remember it
- **Shape over name.**
- Literal → excess check; variable → no excess check.
- Output positions covariant, input positions contravariant.

#### Common mistakes
- Expecting nominal checks (two classes with same shape are compatible).
- Relying on excess property checks for safety.
- Using method syntax in callbacks types where strictness matters.

#### Interview angle
**Q: What is structural typing?** "Compatibility is based on shape. If an object has the required properties it's assignable, no matter its declared type." Follow-up: *How do you get nominal-like safety?* (Brands.)

### Type-safe API layer: shared package, zod/valibot, OpenAPI, tRPC
#### In one line
Define the API contract once and let both React and Node use the same types.

#### Real-life analogy
One architectural blueprint used by both the builders and the inspectors: they can't disagree about the dimensions.

#### How it works
Options (pick by team and API style):
- **Shared package** in a monorepo exporting zod schemas and inferred types.
- **OpenAPI → generated client** (openapi-typescript) when the backend is spec-first.
- **tRPC** when frontend and backend are both TypeScript: end-to-end inference, no codegen.
- Always **validate at runtime** at boundaries; types alone are not enough.

#### Example
¦¦¦ts
// packages/contracts/src/course.ts
import { z } from 'zod';
export const CourseSchema = z.object({ id: z.number(), title: z.string(), tags: z.array(z.string()) });
export type Course = z.infer<typeof CourseSchema>;

// server: res.json(CourseSchema.parse(row))
// client:
import { CourseSchema, type Course } from '@acme/contracts';
async function getCourse(id: number): Promise<Course> {
  const res = await fetch(¦/api/courses/§{id}¦);
  return CourseSchema.parse(await res.json());     // runtime check + static type
}
¦¦¦

#### Remember it
| Approach | Best when |
|---|---|
| shared zod package | monorepo, REST |
| OpenAPI codegen | spec-first, many clients |
| tRPC | full-stack TS, internal API |

#### Common mistakes
- Hand-copying interfaces on both sides.
- Trusting generated types without validating responses.
- Leaking database models directly as API types.

#### Interview angle
**Q: How do you share types across React and Node?** "I keep zod schemas in a shared workspace package, infer the types, validate at the boundary on both sides, and publish internal versions with the monorepo." Follow-up: *Why not just import backend types?* (Couples builds and skips runtime validation.)

### Declaration merging and global augmentation
#### In one line
Two interfaces with the same name combine into one, and you can add to global or module types.

#### Real-life analogy
Two people editing the same shared contact card; the final card contains both sets of fields.

#### How it works
- Interfaces with the same name merge. Type aliases do **not** (duplicate identifier error).
- Namespaces, enums and functions can merge in limited ways.
- **Global augmentation**: ¦declare global { interface Window { analytics: ... } }¦ inside a module file.
- Used for libraries (Express Request) and for adding fields to ¦Window¦ or ¦process.env¦.

#### Example
¦¦¦ts
interface Settings { theme: 'dark' | 'light' }
interface Settings { language: string }       // merged
const s: Settings = { theme: 'dark', language: 'en' };

// global-augmentations.d.ts
export {};
declare global {
  interface Window { dataLayer: unknown[] }
  namespace NodeJS {
    interface ProcessEnv { DATABASE_URL: string; PORT?: string }
  }
}
¦¦¦

#### Remember it
- **interface = open**, **type = closed**.
- Global change needs ¦declare global¦ in a **module** file.
- Prefer a typed config object over augmenting ¦ProcessEnv¦ when you can.

#### Common mistakes
- Using ¦type¦ for something a library needs to extend.
- Augmentation file missing an import/export, so it isn't a module.
- Merging accidentally (two interfaces with the same name in different files).

#### Interview angle
**Q: Interface vs type, in one point?** "Interfaces merge, so libraries can be augmented; type aliases can't merge but can express unions and mapped types." Follow-up: *How to type window.analytics?* (declare global in a module file.)

### Large codebase tooling: project references, incremental, isolatedModules, type-aware ESLint
#### In one line
Settings and tools that keep type-checking fast and consistent in a big or monorepo project.

#### Real-life analogy
Instead of rechecking every room in a hospital each day, you only inspect the wards that changed and keep the previous report.

#### How it works
- **Project references** (¦composite: true¦, ¦references¦): split into packages that build separately; use ¦tsc -b¦.
- **incremental** / ¦tsBuildInfoFile¦: cache results of the last build.
- **isolatedModules**: each file can be compiled alone (needed for Babel/esbuild/SWC); disallows constructs that need whole-program info, requires ¦import type¦ for types.
- **Type-aware ESLint** (typescript-eslint with ¦parserOptions.project¦): rules like ¦no-floating-promises¦ and ¦no-unsafe-*¦.
- Keep fast: ¦skipLibCheck¦, avoid giant unions, annotate exports, avoid deep generic recursion; use ¦tsc --noEmit¦ in CI with the bundler doing the build.

#### Example
¦¦¦json
// packages/api/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "composite": true, "outDir": "dist", "rootDir": "src" },
  "references": [{ "path": "../contracts" }]
}
¦¦¦
¦¦¦bash
tsc -b                       # build in dependency order, only what changed
tsc --noEmit --incremental   # fast CI type-check
¦¦¦

#### Remember it
- **composite + references** = split build.
- **isolatedModules** = bundler-friendly, use ¦import type¦.
- **no-floating-promises** = catches forgotten ¦await¦.

#### Common mistakes
- One huge tsconfig for everything.
- Not using ¦import type¦ with isolatedModules.
- Running a full type-check on every file save in CI watch.

#### Interview angle
**Q: How do you speed up TypeScript in a monorepo?** "Project references with incremental builds, skipLibCheck, annotated exports, and type-checking separately from bundling." Follow-up: *How do you find slow types?* (¦tsc --extendedDiagnostics¦ and the trace analyzer.)

### Migrating JS to TS: allowJs, checkJs, strictness ratchet
#### In one line
Move to TypeScript gradually: JS and TS coexist, and you tighten rules step by step.

#### Real-life analogy
Renovating a house room by room while people still live in it: never shut the whole building.

#### How it works
1. Add TypeScript and a ¦tsconfig¦ with ¦allowJs: true¦ and (optionally) ¦checkJs: true¦.
2. Make the build pass; add ¦@types/*¦ for dependencies.
3. Rename files ¦.js → .ts¦ in small batches, **leaf modules first**.
4. Start with ¦strict: false¦ and enable flags one by one (the **ratchet**): ¦noImplicitAny¦, ¦strictNullChecks¦, then ¦strict¦.
5. Block regressions: CI fails on new ¦any¦ or on files in a "strict" folder list.
6. Use ¦// @ts-expect-error¦ with a comment for known issues; track the count.
7. Optional: ¦ts-reset¦ improves some built-in types (like ¦JSON.parse¦ → ¦unknown¦).

#### Example
¦¦¦json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": false,
    "noImplicitAny": false,
    "strictNullChecks": false,
    "outDir": "dist"
  },
  "include": ["src"]
}
¦¦¦
¦¦¦ts
// Step 3: add JSDoc types to a JS file before renaming
// @ts-check
/** @param {number[]} xs @returns {number} */
function sum(xs) { return xs.reduce((a, b) => a + b, 0); }
¦¦¦

#### Remember it
**Compile → rename leaves → ratchet strictness → block regressions.**
- Don't stop feature work.
- Types first on shared utilities and API boundaries (best return on effort).

#### Common mistakes
- Big-bang rewrite.
- Replacing errors with ¦any¦ everywhere and never revisiting.
- Turning on ¦strict¦ at the start and drowning in errors.

#### Interview angle
**Q: How would you migrate a large JS app?** "Enable allowJs, convert leaf modules first, add strict flags incrementally with CI guards against regressions, and type shared utilities and API boundaries early." Follow-up: *How do you measure progress?* (% of files in TS, count of any and ts-expect-error.)

### Recent features: const type parameters, satisfies, NoInfer, using, standard decorators
#### In one line
Newer TypeScript 5.x features that make types more precise and resource handling safer.

#### Real-life analogy
Better tools in the same toolbox: a sharper screwdriver, not a new workshop.

#### How it works
- **satisfies** (4.9): check a value against a type without widening.
- **const type parameters** (5.0): ¦<const T>¦ infers literal/readonly types without ¦as const¦ at the call site.
- **Standard decorators** (5.0): ECMAScript decorators (no ¦experimentalDecorators¦ needed).
- **using / await using** (5.2): automatic cleanup of resources (¦Symbol.dispose¦), like try/finally.
- **NoInfer<T>** (5.4): stops an argument from being used to infer ¦T¦.
- **Inferred type predicates** (5.5): ¦filter(x => x !== null)¦ now narrows automatically.

#### Example
¦¦¦ts
function tuple<const T extends readonly unknown[]>(...xs: T): T { return xs; }
const t = tuple('a', 1);                       // readonly ['a', 1]

function pick<T extends string>(options: T[], initial: NoInfer<T>) { return initial; }
pick(['draft', 'live'], 'draft');              // ok
// pick(['draft', 'live'], 'other');           // error: not widened to include 'other'

const names = ['a', null, 'b'].filter(x => x !== null);   // string[] in TS 5.5+

{
  using conn = openConnection();               // conn[Symbol.dispose]() runs at scope end
  conn.query('select 1');
}
¦¦¦

#### Remember it
| Feature | Why |
|---|---|
| satisfies | validate, keep precise |
| const T | literals without as const |
| NoInfer | control inference |
| using | auto cleanup |

#### Common mistakes
- Using ¦using¦ without a runtime that supports ¦Symbol.dispose¦ (needs target/lib support or polyfill).
- Mixing old ¦experimentalDecorators¦ with standard decorators.
- Listing features you haven't actually used.

#### Interview angle
**Q: Which recent TS features have you used?** "satisfies for typed config objects, const type parameters for literal-preserving helpers, and inferred type predicates for filter, which removes many manual guards." Follow-up: *What does NoInfer solve?* (Stops secondary arguments from widening the inferred type.)
`;
