window.PREP = window.PREP || {};
window.PREP.typescript = String.raw`
@title TypeScript
@icon braces
@tagline Types that catch bugs before production. Lead interviews test generics, narrowing, utility types and how you type React and Express code.
@resume TypeScript across React and Node.js | Shared types between frontend and API | Code quality and maintainability

## ROADMAP

### Phase 1 · Foundations (Basic)
- Why TypeScript: static typing, editor support, types are erased at runtime :: Explain that TS is a compile-time layer; it does not validate data at runtime.
- tsconfig essentials: strict, target, module, moduleResolution, skipLibCheck, noUncheckedIndexedAccess :: Know what strict switches on (noImplicitAny, strictNullChecks and more).
- Basic types: string, number, boolean, arrays, tuples, null, undefined :: Prefer string[] or Array<string>; use tuples for fixed-length pairs.
- any vs unknown vs never vs void :: unknown is the safe any; never marks impossible values.
- Inference vs annotation :: Annotate function boundaries (params, public returns), let inference handle locals.
- Functions: optional, default, rest params, overloads, return types :: Write overloads only when one signature cannot express the contract.
- Objects: interface vs type, optional (?), readonly, index signatures :: Know when each is the better fit.
- Union, intersection and literal types :: Replace enums with string-literal unions in most code.
- Narrowing: typeof, instanceof, in, equality, truthiness :: Control-flow analysis is what makes unions usable.
- Assertions: as, non-null (!), satisfies :: Use rarely; every assertion is a promise the compiler cannot check.

### Phase 2 · Everyday power (Intermediate)
- Generics: functions, interfaces, constraints (extends), defaults :: Write a generic function without looking.
- Built-in utility types: Partial, Required, Pick, Omit, Record, Readonly, ReturnType, Parameters, Awaited, NonNullable :: Know the one-line definition of each.
- keyof, typeof, indexed access types, as const :: Derive types from values so they never drift apart.
- Discriminated unions and exhaustive checks with never :: The standard way to model reducer actions and API states.
- Type guards, predicates (x is T), assertion functions :: Validate unknown data into a known type.
- Classes: access modifiers, abstract, implements, parameter properties :: Match JS private fields (#x) with TS private.
- Modules and declaration files (.d.ts), @types packages, module augmentation :: Add types for a library without types or extend Express Request.
- Typing React: props, children, events, hooks, refs, generic components :: Be ready to type a form and a reusable table live.
- Typing Node/Express: Request/Response generics, middleware, env config, DTOs :: Validate input with zod and infer the type from the schema.
- Async types and errors: Promise<T>, Awaited, unknown in catch :: Do not type caught errors as any.

### Phase 3 · Advanced (Lead level)
- Mapped types and key remapping (as) :: Build DeepReadonly, Getters, Nullable<T>.
- Conditional types and infer :: Write UnwrapPromise, ElementType, ReturnType from scratch.
- Template literal types :: Typed routes, event names, CSS-like strings.
- Branded (opaque) types :: Stop mixing UserId and OrderId.
- Structural typing and variance :: Know excess property checks and why callbacks are bivariant for methods.
- Type-safe API layer: shared package, zod/valibot inference, OpenAPI or tRPC clients :: Single source of truth between React and Node.
- Declaration merging and global augmentation :: Interfaces merge, type aliases do not.
- Large codebase tooling: project references, incremental builds, isolatedModules, type-aware ESLint :: Keep the compiler fast in a monorepo.
- Migrating JS to TS: allowJs, checkJs, strictness ratchet, ts-reset :: Explain a safe step-by-step plan.
- Recent features: const type parameters, satisfies, NoInfer, using declarations, decorators (standard) :: Mention what you have used in real code.

## QA

### [basic] What is TypeScript and why use it?
TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. Benefits: errors found at compile time, better autocomplete and refactoring, self-documenting contracts between modules and teams, safer large-scale changes. Costs: build step, learning curve, and types give **no runtime protection**; data from APIs still needs validation.

### [basic] interface vs type. When do you use which?
Both describe object shapes and are mostly interchangeable.
| | interface | type alias |
|---|---|---|
| Extend | ¦extends¦ | intersection ¦&¦ |
| Declaration merging | Yes | No |
| Unions, tuples, mapped/conditional types | No | Yes |
| Error messages and perf | Slightly better for objects | Fine |

Rule of thumb: ¦interface¦ for public object contracts and classes, ¦type¦ for unions and computed types. Pick one convention per codebase.

### [basic] any vs unknown vs never.
- ¦any¦ switches off type checking. Avoid it.
- ¦unknown¦ is "could be anything": you must narrow it before use. Use it for data from outside (JSON, ¦catch¦).
- ¦never¦ is the type of values that never exist: a function that always throws, or the leftover case after exhaustive narrowing.

¦¦¦ts
function parse(input: unknown) {
  if (typeof input === 'string') return input.toUpperCase();
  if (typeof input === 'number') return input.toFixed(2);
  throw new Error('unsupported');
}
¦¦¦

### [basic] What is type inference? When should you annotate?
TypeScript infers types from values (¦const n = 5¦ is ¦number¦, and ¦const s = 'a'¦ is the literal ¦'a'¦). Annotate **function parameters**, **exported function return types** and empty collections (¦const items: Item[] = []¦). Do not annotate what is obvious; over-annotation adds noise and hides refactors.

### [basic] Union and intersection types.
A union ¦A | B¦ means "one of". An intersection ¦A & B¦ means "all of", merging members.

¦¦¦ts
type Status = 'idle' | 'loading' | 'error';
type Timestamps = { createdAt: Date; updatedAt: Date };
type User = { id: string; name: string };
type UserRecord = User & Timestamps;
¦¦¦

### [basic] Enums or union literal types?
Union literals (¦type Role = 'admin' | 'user'¦) are erased to nothing, work well with JSON, and give clear errors. Regular ¦enum¦ generates runtime code and numeric enums accept any number in older versions. Use ¦const¦ objects with ¦as const¦ if you also need the values at runtime:
¦¦¦ts
const ROLE = { Admin: 'admin', User: 'user' } as const;
type Role = typeof ROLE[keyof typeof ROLE]; // 'admin' | 'user'
¦¦¦

### [basic] What are optional properties, readonly and index signatures?
¦name?: string¦ means the property can be missing (type ¦string | undefined¦). ¦readonly id: string¦ blocks reassignment (compile time only). ¦[key: string]: number¦ allows any string key with number values; prefer ¦Record<string, number>¦ or ¦Map¦.

### [basic] Type assertion (as) vs the non-null operator (!). Are they safe?
Both tell the compiler "trust me". ¦value as User¦ does not convert or check anything at runtime, and ¦el!.focus()¦ removes null from the type. If you are wrong, you get a runtime error that TypeScript cannot prevent. Prefer narrowing (¦if (!el) return;¦) or a type guard. ¦as unknown as T¦ is a red flag in code review.

### [basic] What strict flags matter most?
¦strict: true¦ enables the important ones: ¦noImplicitAny¦, ¦strictNullChecks¦, ¦strictFunctionTypes¦, ¦strictPropertyInitialization¦, ¦useUnknownInCatchVariables¦. Extra ones worth adding: ¦noUncheckedIndexedAccess¦ (array and record reads can be undefined), ¦exactOptionalPropertyTypes¦, ¦noImplicitOverride¦. New projects should start strict; old ones can turn flags on one by one.

### [intermediate] Explain generics with a practical example.
Generics let code work with many types while keeping the relationship between input and output.

¦¦¦ts
function first<T>(items: T[]): T | undefined { return items[0]; }
const n = first([1, 2, 3]);        // number | undefined
const s = first(['a', 'b']);       // string | undefined

// constraint: T must have an id
function byId<T extends { id: string }>(list: T[], id: string) {
  return list.find(x => x.id === id);
}

// reusable API type
type ApiResult<T> = { data: T; error?: string };
¦¦¦

### [intermediate] Explain the utility types you use most.
¦¦¦ts
type User = { id: string; name: string; email: string };
type Draft = Partial<User>;                 // all optional
type Create = Omit<User, 'id'>;             // remove keys
type Summary = Pick<User, 'id' | 'name'>;   // keep keys
type ById = Record<string, User>;           // map type
type Fn = ReturnType<typeof getUser>;       // from a function
type Data = Awaited<ReturnType<typeof fetchUser>>; // unwrap promise
type Safe = NonNullable<string | null>;     // string
¦¦¦
Typical use: ¦Omit<User,'id'>¦ for create payloads and ¦Partial<User>¦ for PATCH bodies.

### [intermediate] What is narrowing and what is a discriminated union?
Narrowing means the compiler refines a type inside a branch (¦typeof¦, ¦instanceof¦, ¦in¦, equality, truthiness). A discriminated union gives every member a literal ¦type¦ (or ¦status¦) field so a ¦switch¦ narrows precisely.

¦¦¦ts
type State =
  | { status: 'loading' }
  | { status: 'success'; data: string[] }
  | { status: 'error'; message: string };

function view(s: State) {
  switch (s.status) {
    case 'loading': return 'Loading...';
    case 'success': return s.data.join(', ');
    case 'error': return s.message;
    default: { const _never: never = s; return _never; } // compile error if a case is missing
  }
}
¦¦¦
This is the cleanest way to model API request state, avoiding impossible combinations such as ¦loading: true¦ with ¦error¦ set.

### [intermediate] How do custom type guards work?
A function returning ¦x is T¦ tells the compiler what a successful check means.

¦¦¦ts
interface Dog { bark(): void }
interface Cat { meow(): void }
const isDog = (a: Dog | Cat): a is Dog => 'bark' in a;

function isUser(x: unknown): x is { id: string } {
  return typeof x === 'object' && x !== null && typeof (x as any).id === 'string';
}
¦¦¦
Libraries like zod generate these guards from a schema, which is safer than writing them by hand.

### [intermediate] What do keyof, typeof and indexed access types do?
¦¦¦ts
const config = { env: 'prod', retries: 3 } as const;
type Config = typeof config;              // type from a value
type Key = keyof Config;                  // 'env' | 'retries'
type Retries = Config['retries'];         // 3
function get<T, K extends keyof T>(obj: T, key: K): T[K] { return obj[key]; }
¦¦¦
¦as const¦ makes values readonly literals so you can derive unions from them.

### [intermediate] What are satisfies and as const?
¦as const¦ freezes literal types. ¦satisfies¦ (TS 4.9) checks a value against a type **without widening** it, so you keep the precise inferred type.

¦¦¦ts
type Routes = Record<string, { path: string }>;
const routes = {
  home: { path: '/' },
  courses: { path: '/courses' },
} satisfies Routes;
routes.home.path;   // typed, and a typo in a key would error elsewhere
¦¦¦

### [intermediate] How do you type React components, events and hooks?
¦¦¦tsx
type ButtonProps = {
  label: string;
  variant?: 'primary' | 'ghost';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
} & React.ComponentPropsWithoutRef<'button'>;

export function Button({ label, variant = 'primary', ...rest }: ButtonProps) {
  return <button className={variant} {...rest}>{label}</button>;
}

const [user, setUser] = useState<User | null>(null);
const inputRef = useRef<HTMLInputElement>(null);
const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);
¦¦¦
Tips: let TypeScript infer component return types; avoid ¦React.FC¦ unless you want its children behaviour (not needed in React 18+); use ¦ComponentPropsWithoutRef¦ to inherit native props.

### [intermediate] How do you type an Express route and middleware?
¦¦¦ts
import { Request, Response, NextFunction } from 'express';

type Params = { id: string };
type Body = { name: string };

app.post('/courses/:id', (req: Request<Params, unknown, Body>, res: Response, next: NextFunction) => {
  const { id } = req.params;      // string
  const { name } = req.body;      // string
  res.status(201).json({ id, name });
});
¦¦¦
Do not trust the declared body type: validate with zod and infer.
¦¦¦ts
const Body = z.object({ name: z.string().min(1) });
type Body = z.infer<typeof Body>;   // type and validator stay in sync
¦¦¦

### [intermediate] How do you add types for a library with none, or extend Express Request?
Create a declaration file included by ¦tsconfig¦:
¦¦¦ts
// types/express.d.ts
import 'express';
declare module 'express-serve-static-core' {
  interface Request { user?: { id: string; roles: string[] } }
}
¦¦¦
For an untyped package: ¦declare module 'untyped-lib';¦ (everything is ¦any¦) or write minimal typed declarations for the functions you use. Check DefinitelyTyped first (¦npm i -D @types/name¦).

### [intermediate] How do function overloads work, and what are tuples and readonly arrays?
Overloads list several call signatures followed by one implementation. Tuples are fixed-length arrays with known element types. ¦readonly string[]¦ or ¦ReadonlyArray<string>¦ prevents mutation methods.

¦¦¦ts
function parse(x: string): number;
function parse(x: number): string;
function parse(x: string | number) { return typeof x === 'string' ? Number(x) : String(x); }

const pair: [string, number] = ['age', 30];
function total(nums: readonly number[]) { return nums.reduce((a, b) => a + b, 0); }
¦¦¦

### [intermediate] How do you safely handle API data in TypeScript?
Treat network data as ¦unknown¦. Validate at the boundary and convert to a trusted type.

¦¦¦ts
const Course = z.object({ id: z.string(), title: z.string(), duration: z.number() });
type Course = z.infer<typeof Course>;

async function getCourse(id: string): Promise<Course> {
  const res = await fetch('/api/courses/' + id);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return Course.parse(await res.json());   // throws if shape is wrong
}
¦¦¦
Casting with ¦as Course¦ would hide a backend change until it crashes in production.

### [advanced] Explain conditional types and infer.
Conditional types choose a type based on a condition: ¦T extends U ? X : Y¦. ¦infer¦ captures a type inside the check.

¦¦¦ts
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type A = UnwrapPromise<Promise<string>>; // string

type ElementOf<T> = T extends (infer E)[] ? E : never;
type B = ElementOf<number[]>; // number

// Distributive: applies to each union member
type ToArray<T> = T extends any ? T[] : never;
type C = ToArray<string | number>; // string[] | number[]
¦¦¦

### [advanced] What are mapped types? Show key remapping.
A mapped type transforms every key of another type.
¦¦¦ts
type Nullable<T> = { [K in keyof T]: T[K] | null };
type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type Getters<T> = { [K in keyof T as ¦get§{Capitalize<string & K>}¦]: () => T[K] };
// Getters<{ name: string }> -> { getName: () => string }
¦¦¦
Modifiers ¦+¦ and ¦-¦ add or remove ¦readonly¦ and ¦?¦.

### [advanced] What are template literal types and where are they useful?
They build string types from other string types.
¦¦¦ts
type Entity = 'user' | 'order';
type EventName = ¦§{Entity}:created¦ | ¦§{Entity}:deleted¦;  // 'user:created' | 'user:deleted' | ...
type Route = ¦/api/§{Entity}s/:id¦;
¦¦¦
Uses: typed event names, route builders, CSS utility names, and strongly typed i18n keys.

### [advanced] What are branded types and why use them?
TypeScript is structural, so ¦UserId¦ and ¦OrderId¦ that are both ¦string¦ are interchangeable. A brand adds a phantom property to make them distinct.
¦¦¦ts
type Brand<T, B> = T & { readonly __brand: B };
type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;
const toUserId = (s: string) => s as UserId;
function getUser(id: UserId) {}
getUser('x' as OrderId); // error
¦¦¦
Great for IDs, currency amounts in different units, and sanitised strings.

### [advanced] Structural typing: what surprises does it cause?
Types match by shape, not by name. An object with extra properties is assignable to a type with fewer, except for **fresh object literals**, which trigger an "excess property" error. Class instances with the same members are interchangeable. Function parameters are checked contravariantly under ¦strictFunctionTypes¦, but **method** declarations stay bivariant, which can let unsafe assignments through.

### [advanced] How would you migrate a large JavaScript codebase to TypeScript?
1. Add ¦tsconfig¦ with ¦allowJs: true¦ and ¦checkJs: false¦; get the build working.
2. Convert leaf modules and shared utilities first, then features, renaming ¦.js¦ to ¦.ts¦ gradually.
3. Start with ¦strict: false¦ and ratchet: enable one strict flag at a time, fixing errors per flag.
4. Add types for domain objects and API responses in a shared folder; validate boundaries with zod.
5. Add lint rules (¦@typescript-eslint/no-explicit-any¦ as warn → error), CI type-check, and a rule that new files must be TypeScript.
6. Track progress (percentage of TS files, count of ¦any¦).
This is a good place to speak about your experience introducing standards in a team.

### [advanced] How do you share types between React and Node in a monorepo?
Create a ¦packages/contracts¦ (or ¦shared¦) package that exports zod schemas and inferred types. Backend validates requests with them; frontend uses the same types for forms and API clients. Use TypeScript **project references** or workspace tooling (pnpm/npm workspaces, Nx, Turborepo) with incremental builds. Alternatives: generate types from OpenAPI, or use tRPC where the router type is the contract.

### [advanced] Interface merging vs type aliases. Why does it matter?
Two ¦interface¦ declarations with the same name merge, which is how libraries are augmented (¦Express.Request¦, ¦Window¦). Two ¦type¦ aliases with the same name are an error. Use interfaces when you want others to extend your type; use type aliases for closed unions and computed types.

## EXERCISES

### [basic] Write a type-safe getProp
Write ¦getProp(obj, key)¦ so passing a key that does not exist is a compile error and the return type is the property type.
--- solution ---
¦¦¦ts
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const user = { id: 1, name: 'Asha' };
const n = getProp(user, 'name'); // string
// getProp(user, 'age');         // error
¦¦¦

### [basic] Derive types from a constant
Given the object below, create a ¦Role¦ type that is ¦'admin' | 'editor' | 'viewer'¦ without writing the strings twice.
¦¦¦ts
const ROLES = ['admin', 'editor', 'viewer'];
¦¦¦
--- solution ---
¦¦¦ts
const ROLES = ['admin', 'editor', 'viewer'] as const;
type Role = typeof ROLES[number];
const isRole = (x: string): x is Role => (ROLES as readonly string[]).includes(x);
¦¦¦
Without ¦as const¦ the array type widens to ¦string[]¦.

### [intermediate] Exhaustive reducer with a discriminated union
Type a todo reducer with actions ¦add¦, ¦toggle¦ and ¦clear¦ and make the compiler fail if a new action is added but not handled.
--- solution ---
¦¦¦ts
type Todo = { id: number; text: string; done: boolean };
type Action =
  | { type: 'add'; todo: Todo }
  | { type: 'toggle'; id: number }
  | { type: 'clear' };

function reducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'add': return [...state, action.todo];
    case 'toggle': return state.map(t => t.id === action.id ? { ...t, done: !t.done } : t);
    case 'clear': return [];
    default: {
      const _exhaustive: never = action;
      return state;
    }
  }
}
¦¦¦

### [intermediate] Build Optional<T, K>
Create a utility type that makes only the keys ¦K¦ of ¦T¦ optional.
> Hint: Combine Omit and Partial<Pick<...>> with an intersection.
--- solution ---
¦¦¦ts
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type User = { id: string; name: string; email: string };
type NewUser = Optional<User, 'id'>; // id is optional, others required
const u: NewUser = { name: 'A', email: 'a@x.com' };
¦¦¦

### [intermediate] A typed fetch wrapper
Write ¦api<T>(url, init?)¦ that returns ¦Promise<T>¦ and throws an ¦HttpError¦ with the status on non-2xx responses. Explain what the generic does and does not guarantee.
--- solution ---
¦¦¦ts
class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...init });
  if (!res.ok) throw new HttpError(res.status, await res.text());
  return (await res.json()) as T;
}

const course = await api<{ id: string; title: string }>('/api/courses/1');
¦¦¦
The generic only **tells** the compiler what to expect; it does not validate the response. In production pass a zod schema and parse the result.

### [intermediate] Generic List component in React
Create a ¦List<T>¦ component that takes ¦items¦, ¦getKey¦ and ¦renderItem¦ and infers ¦T¦ from ¦items¦.
--- solution ---
¦¦¦tsx
type ListProps<T> = {
  items: T[];
  getKey: (item: T) => string | number;
  renderItem: (item: T) => React.ReactNode;
};

export function List<T>({ items, getKey, renderItem }: ListProps<T>) {
  return <ul>{items.map(item => <li key={getKey(item)}>{renderItem(item)}</li>)}</ul>;
}

<List items={[{ id: 1, name: 'A' }]} getKey={u => u.id} renderItem={u => <b>{u.name}</b>} />
¦¦¦
In a ¦.tsx¦ file generic arrow functions need ¦<T,>¦ to avoid JSX ambiguity; a ¦function¦ declaration avoids the issue.

### [advanced] DeepReadonly
Write ¦DeepReadonly<T>¦ that makes every nested property readonly, including arrays, but leaves functions alone.
--- solution ---
¦¦¦ts
type DeepReadonly<T> =
  T extends (...args: any[]) => any ? T :
  T extends (infer U)[] ? readonly DeepReadonly<U>[] :
  T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } :
  T;

type Cfg = DeepReadonly<{ api: { urls: string[] } }>;
// cfg.api.urls.push('x') -> error
¦¦¦

### [advanced] Typed event emitter
Create ¦Emitter<Events>¦ so ¦on('login', fn)¦ gives ¦fn¦ the payload type declared for ¦login¦, and emitting the wrong payload is a compile error.
--- solution ---
¦¦¦ts
class Emitter<E extends Record<string, any>> {
  private handlers = new Map<keyof E, Set<(p: any) => void>>();

  on<K extends keyof E>(evt: K, fn: (payload: E[K]) => void) {
    if (!this.handlers.has(evt)) this.handlers.set(evt, new Set());
    this.handlers.get(evt)!.add(fn);
    return () => this.handlers.get(evt)?.delete(fn);
  }
  emit<K extends keyof E>(evt: K, payload: E[K]) {
    this.handlers.get(evt)?.forEach(fn => fn(payload));
  }
}

type AppEvents = { login: { id: string }; logout: undefined };
const bus = new Emitter<AppEvents>();
bus.on('login', p => console.log(p.id));
bus.emit('login', { id: 'u1' });
// bus.emit('login', 42); // error
¦¦¦

### [advanced] Branded IDs
Prevent passing an ¦OrderId¦ to a function that expects a ¦UserId¦ while keeping both as strings at runtime.
--- solution ---
¦¦¦ts
type Brand<T, B extends string> = T & { readonly __brand: B };
type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;

const asUserId = (s: string) => s as UserId;
const asOrderId = (s: string) => s as OrderId;

function loadUser(id: UserId) { /* ... */ }
loadUser(asUserId('u1'));
// loadUser(asOrderId('o1')); // error
¦¦¦
Create ids through one factory function (ideally after validation) so the cast lives in one place.

## SCENARIOS

### Your React app is plain JavaScript and bugs keep reaching production. How do you introduce TypeScript without stopping feature work?
Propose a gradual plan: enable ¦allowJs¦, type shared utilities and API models first, convert new files to TypeScript by default, then convert high-churn files when touched. Turn on strict flags one at a time. Add CI type-check and lint rules. Measure: number of type-related production bugs, percentage of files converted. Pair with the team and document patterns so adoption is not a burden.

### The frontend and backend keep drifting apart: the API changes and the UI breaks at runtime. What do you do?
Make the contract a single source of truth. Options: shared zod schemas in a workspace package; OpenAPI spec with generated types and clients; or tRPC for TypeScript-only stacks. Validate responses at the boundary, version breaking changes, and add contract tests in CI. Link to your REST API experience on the Clinical Learning Hub.

### The codebase is full of any and ts-ignore comments. How do you improve quality without blocking the team?
Measure first (count of ¦any¦ and ¦@ts-ignore¦). Replace ¦@ts-ignore¦ with ¦@ts-expect-error¦ plus a reason so stale ones fail. Add ESLint rules as warnings, then raise to errors for new code. Fix the high-traffic types first (API responses, shared models). Review with a checklist item "no new any".

### A third-party library has no types and the types you need are missing. What are your options?
Check ¦@types/...¦ first, then the library's own ¦types¦ field. Otherwise write a small ¦.d.ts¦ with only the functions you use and keep it in a ¦types¦ folder; contribute it upstream or to DefinitelyTyped if useful. Wrap the library in your own typed module so the untyped surface is limited to one file.

### Type-checking has become slow in the monorepo. How do you speed it up?
Use ¦tsc --noEmit --incremental¦ and project references so packages build independently. Enable ¦skipLibCheck¦, avoid giant union or recursive types, split large ¦tsconfig¦ includes, run type-check only on changed packages in CI (Nx/Turborepo caching), and use ¦isolatedModules¦ with a fast transpiler for dev while still running ¦tsc¦ in CI.
`;
