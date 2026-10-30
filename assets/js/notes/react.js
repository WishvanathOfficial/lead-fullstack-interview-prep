window.PREP_NOTES = window.PREP_NOTES || {};
window.PREP_NOTES.react = String.raw`
## Phase 1 · Foundations (Basic)
### Components and JSX
#### In one line
A component is a function that returns UI, and JSX is the HTML-like syntax you use to describe that UI inside JavaScript.

#### Real-life analogy
A component is a LEGO brick with a label. Props are the stickers you put on it (colour, size), children are the smaller bricks you snap inside, and a page is just bricks snapped together.

#### How it works
- A function component takes one object, **props**, and returns JSX (elements, strings, arrays, or null).
- JSX is not HTML. It compiles to function calls (¦jsx("div", {...})¦). So you write ¦className¦, ¦htmlFor¦, and camelCase events like ¦onClick¦.
- A component returns **one root**, because a function returns one value. Use a Fragment ¦<>...</>¦ when you do not want an extra DOM node.
- **children** is a special prop: whatever you put between the tags.
- **Composition** means building big components from small ones and passing content through ¦children¦ instead of inheritance.
- Component names start with a capital letter. Lowercase means a DOM tag.

#### Example
¦¦¦jsx
// Reusable Card: composition via children
function Card({ title, children }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

// Usage in the Clinical Learning Hub
export default function CoursePage() {
  return (
    <Card title="Sepsis basics">
      <p>Duration: 20 min</p>
      <button onClick={() => alert('Started')}>Start</button>
    </Card>
  );
}
¦¦¦

#### Remember it
- **C**apital name, **O**ne root, **C**lassName, **C**amelCase events (COCC).
- ¦{ }¦ in JSX = "JavaScript goes here". Only expressions, not statements.
- Props flow **down**, are **read-only**.

#### Common mistakes
- Using ¦class¦ instead of ¦className¦.
- Writing ¦if¦ statements inside JSX braces (use ternary or compute before).
- Mutating props.
- Naming a component in lowercase, so React treats it as an HTML tag.

#### Interview angle
They ask: "What is JSX and why one root?" Say: "JSX is syntax sugar that compiles to function calls returning element objects. A component returns a single value, so it needs one root, and a Fragment gives that without extra DOM." Follow-up: how is composition better than inheritance?

### Lists and keys
#### In one line
When you render an array, each item needs a stable, unique ¦key¦ so React can match old and new items correctly.

#### Real-life analogy
Keys are the name tags at a conference. If people shuffle seats, the host still knows who is who. With seat numbers (array index) as tags, the person in seat 2 "becomes" a different person when someone leaves.

#### How it works
- ¦items.map(i => <Row key={i.id} .../>)¦ turns data into elements.
- During reconciliation React compares keys: same key means same component instance (state kept); new key means create; missing key means destroy.
- Index keys are fine only for static lists that never reorder, insert or delete.
- Keys only need to be unique among **siblings**, and they are not passed as a prop.
- Changing a key on purpose is a trick to **reset** a component's state.

#### Example
¦¦¦jsx
function LessonList({ lessons }) {
  return (
    <ul>
      {lessons.map(l => (
        // l.id comes from the database: stable and unique
        <li key={l.id}>
          <input defaultValue={l.title} />
        </li>
      ))}
    </ul>
  );
}
// With key={index}: delete the first lesson and the typed text
// in the inputs shifts to the wrong rows. With key={l.id}: it stays correct.
¦¦¦

#### Remember it
- Key = **identity**, not position.
- Best key: database id. Never ¦Math.random()¦ (new each render, remounts everything).
- ¦key¦ change = new component = state reset.

#### Common mistakes
- Index keys on sortable or editable lists.
- Random keys causing remounts and lost focus.
- Putting the key on the inner element instead of the outermost element returned by ¦map¦.

#### Interview angle
"Why are keys needed?" Say: "They give each item a stable identity so reconciliation can reuse, move or remove the right instance. Index keys break state and inputs when the list is reordered." Follow-up: how can a key reset a form?

### State with useState
#### In one line
¦useState¦ gives a component memory: a value that survives re-renders and triggers a re-render when you change it.

#### Real-life analogy
State is the whiteboard in a meeting room. Each component has its own board. When someone updates it, everyone in the room looks up and re-reads it (re-render).

#### How it works
- ¦const [count, setCount] = useState(0)¦ returns the current value and a setter.
- Calling the setter schedules a re-render. The value in the **current** render does not change immediately; it is a snapshot.
- **Functional update** ¦setCount(c => c + 1)¦ uses the latest value, needed when updating several times or from async code.
- **Batching**: React 18 batches multiple updates in one event, timeout or promise into one render.
- **Immutable updates**: never mutate. Create a new array or object so React sees a new reference.

#### Example
¦¦¦jsx
const [cart, setCart] = useState([]);

// Add: new array
setCart(prev => [...prev, { id: 1, qty: 1 }]);
// Update one: map and spread
setCart(prev => prev.map(i => i.id === 1 ? { ...i, qty: i.qty + 1 } : i));
// Remove: filter
setCart(prev => prev.filter(i => i.id !== 1));

// Snapshot rule:
function bump() {
  setCount(count + 1);
  setCount(count + 1); // still +1 total (both read the same count)
  setCount(c => c + 1);
  setCount(c => c + 1); // +2 total
}
¦¦¦

#### Remember it
| Need | Write |
|---|---|
| Add | ¦[...a, x]¦ |
| Update | ¦a.map(...)¦ |
| Remove | ¦a.filter(...)¦ |
| Object | ¦{ ...o, k: v }¦ |
- Rule: **new reference or no render**.

#### Common mistakes
- ¦arr.push(x); setArr(arr)¦ (same reference, no update).
- Reading state right after setting it.
- Storing derived values in state instead of computing them.

#### Interview angle
"Why functional updates?" Say: "State is a snapshot per render, so successive updates based on the variable use stale values. The updater function receives the latest queued state." Follow-up: what does batching do?

### Events and forms
#### In one line
In React you handle events with props like ¦onClick¦ and build forms as **controlled inputs**, where state is the single source of truth for the field value.

#### Real-life analogy
A controlled input is a teacher who writes down every answer on the board as the student speaks. The board (state) always shows the truth; the student cannot write on a private paper.

#### How it works
- Handlers receive a **synthetic event**, a cross-browser wrapper around the native event.
- Pass a function, not a call: ¦onClick={save}¦, not ¦onClick={save()}¦.
- Controlled input: ¦value={state}¦ + ¦onChange={e => setState(e.target.value)}¦.
- ¦e.preventDefault()¦ stops the browser reloading the page on submit.
- Validate on submit (and optionally on blur); show errors next to fields with ¦aria-describedby¦.

#### Example
¦¦¦jsx
function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(form.email)) return setError('Enter a valid email');
    if (form.password.length < 8) return setError('Password needs 8+ characters');
    setError('');
    await onLogin(form);
  };

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" value={form.email} onChange={change} />
      <label htmlFor="pw">Password</label>
      <input id="pw" name="password" type="password" value={form.password} onChange={change} />
      {error && <p role="alert">{error}</p>}
      <button type="submit">Sign in</button>
    </form>
  );
}
¦¦¦

#### Remember it
- **value + onChange** = controlled.
- ¦onSubmit¦ on the form, not ¦onClick¦ on the button (Enter key works).
- One handler with ¦[e.target.name]¦ for many fields.

#### Common mistakes
- ¦value¦ without ¦onChange¦ (read-only field warning).
- Calling the handler during render.
- Forgetting ¦preventDefault¦.

#### Interview angle
"Controlled vs uncontrolled?" Say: "Controlled means React state drives the value on every keystroke. Uncontrolled lets the DOM own it and you read it via ref or FormData, with fewer re-renders, as in React Hook Form." Follow-up: when pick uncontrolled?

### Conditional rendering
#### In one line
You choose what to show using plain JavaScript: ternary, ¦&&¦, or an early ¦return¦.

#### Real-life analogy
A traffic light controller: depending on the state (loading, error, data) exactly one picture is displayed.

#### How it works
- **Ternary** ¦cond ? <A/> : <B/>¦ for either/or.
- **&&** ¦cond && <A/>¦ for show-or-nothing. If the left side is ¦0¦, React renders the number 0.
- **Early return** keeps components flat: handle loading and error first.
- ¦null¦, ¦false¦, ¦undefined¦ render nothing.
- For many states use a lookup object or a small component.

#### Example
¦¦¦jsx
function CourseList({ status, courses }) {
  if (status === 'loading') return <Spinner />;
  if (status === 'error') return <p role="alert">Could not load courses.</p>;

  return (
    <>
      {courses.length > 0 && <h2>{courses.length} courses</h2>}  {/* safe */}
      {courses.length === 0 ? <p>No courses yet</p> : <Grid items={courses} />}
    </>
  );
}
// Bug: {courses.length && <h2/>} renders "0" on screen when empty
¦¦¦

#### Remember it
- **Number on the left of && is dangerous**: compare with ¦> 0¦ or use ternary.
- Loading, Error, Empty, Data: always handle all four.

#### Common mistakes
- ¦{count && <X/>}¦ showing 0.
- Deeply nested ternaries (extract components).
- Hiding with CSS when you actually want to unmount (state is lost only when unmounted).

#### Interview angle
"What is wrong with ¦{items.length && ...}¦?" Say: "When length is 0 React renders 0, because 0 is a valid renderable value. Use ¦items.length > 0 &&¦ or a ternary." Follow-up: difference between hiding and unmounting?

### useEffect
#### In one line
¦useEffect¦ runs code **after** React has painted, to synchronise your component with something outside React (API, timer, subscription, DOM).

#### Real-life analogy
Think of subscribing to a newspaper: when you move in (mount) you subscribe, if your address changes (dependency) you re-subscribe, and when you leave (unmount) you cancel (cleanup).

#### How it works
- ¦useEffect(setup, deps)¦. Setup runs after render if any dependency changed.
- ¦[]¦ = run once after mount. No array = after every render. ¦[a, b]¦ = when a or b change.
- Return a **cleanup** function; it runs before the next effect and on unmount.
- In dev **Strict Mode** mounts, unmounts and remounts once to reveal missing cleanups.
- Do not use effects for things you can compute during render or do in an event handler.

#### Example
¦¦¦jsx
function useCourse(id) {
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(¦/api/courses/§{id}¦, { signal: ctrl.signal })
      .then(r => r.json())
      .then(setCourse)
      .catch(e => { if (e.name !== 'AbortError') console.error(e); });

    return () => ctrl.abort(); // cleanup: avoids stale/race responses
  }, [id]);                    // re-run when id changes

  return course;
}
¦¦¦

#### Remember it
| Deps | Runs |
|---|---|
| none | every render |
| ¦[]¦ | mount (and cleanup on unmount) |
| ¦[x]¦ | mount + when x changes |
- Lifecycle mapping: mount, update, unmount.
- Ask: "Is this syncing with the outside world?" If no, you may not need an effect.

#### Common mistakes
- Missing dependencies (stale values). Trust the ESLint rule.
- Forgetting cleanup (leaks, double subscriptions).
- Setting state from an effect that derives from props (compute instead).
- ¦async¦ directly as the effect function.

#### Interview angle
"Explain useEffect dependencies." Say: "React compares each dependency with ¦Object.is¦ after render; if one changed, it runs cleanup then setup again. The array must list every reactive value used inside." Follow-up: why does Strict Mode run effects twice?

### Lifting state up and prop drilling
#### In one line
When two components need the same data, move the state to their closest common parent and pass it down; passing through many layers is called prop drilling.

#### Real-life analogy
Two roommates need the same Wi-Fi password. Instead of each keeping a private copy that can disagree, you put it on the fridge (the parent).

#### How it works
1. Find every component that reads or changes the value.
2. Find the nearest common parent; hold the state there.
3. Pass the value as a prop and a setter or handler as a callback prop.
4. If drilling through 3+ layers hurts, use **composition** (pass elements as ¦children¦), Context, or a store.

#### Example
¦¦¦jsx
function Filters({ term, onTerm }) {
  return <input value={term} onChange={e => onTerm(e.target.value)} />;
}
function Results({ term, courses }) {
  return courses.filter(c => c.title.includes(term)).map(c => <p key={c.id}>{c.title}</p>);
}
function CatalogPage({ courses }) {
  const [term, setTerm] = useState('');      // lifted: shared by both children
  return (
    <>
      <Filters term={term} onTerm={setTerm} />
      <Results term={term} courses={courses} />
    </>
  );
}
¦¦¦

#### Remember it
- State lives at the **lowest common ancestor**.
- Data down, events up.
- Drilling only 1-2 levels is fine; do not reach for Context too early.

#### Common mistakes
- Duplicating the same state in two places.
- Lifting too high so unrelated components re-render.
- Using Context for everything.

#### Interview angle
"How do you avoid prop drilling?" Say: "First composition by passing JSX as children, then Context for low-frequency data, and a store like Zustand or Redux Toolkit for shared complex state." Follow-up: what are Context's downsides?

### Styling options
#### In one line
React has no built-in style system, so you pick: plain CSS or CSS Modules, CSS-in-JS, utility classes (Tailwind), or a component library (Material UI).

#### Real-life analogy
Styling is clothing: a uniform (Material UI) is quick and consistent, tailored clothes (CSS Modules) fit exactly, a wardrobe of small pieces (Tailwind) lets you mix quickly.

#### How it works
- **CSS Modules**: normal CSS, class names scoped per file at build time. Zero runtime, simple.
- **styled-components / Emotion**: styles written in JS, dynamic by props; runtime cost and less friendly with Server Components.
- **Tailwind**: utility classes in markup; fast, consistent, small final CSS; long class strings.
- **Material UI**: ready components and theming; quick to ship but heavier and harder to make unique.
- Theming via **CSS variables** works with all and supports dark mode.

#### Example
¦¦¦jsx
// Button.module.css  ->  .btn { padding: 8px 16px; } .primary { background: var(--brand); }
import styles from './Button.module.css';

export function Button({ variant = 'primary', ...rest }) {
  return <button className={¦§{styles.btn} §{styles[variant]}¦} {...rest} />;
}
// Tailwind equivalent:
// <button className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700" />
¦¦¦

#### Remember it
| Option | Strength | Cost |
|---|---|---|
| CSS Modules | simple, fast | manual theming |
| styled-components | dynamic | runtime, SSR setup |
| Tailwind | speed, consistency | verbose markup |
| MUI | complete components | bundle size, look |

#### Common mistakes
- Mixing three approaches in one app.
- Inline styles for everything (no media queries or pseudo classes).
- Global CSS leaking between components.

#### Interview angle
"Which would you choose?" Say: "For a design-system library I prefer CSS Modules or Tailwind with CSS-variable tokens for zero runtime cost and easy theming; for fast internal tools MUI is productive." Follow-up: how does CSS-in-JS affect performance?

### React Router
#### In one line
React Router maps URLs to components, so your single-page app has pages, back/forward buttons and shareable links.

#### Real-life analogy
It is the building directory: the address (URL) tells you which room (component) to open, and nested routes are rooms inside rooms.

#### How it works
- ¦createBrowserRouter¦ defines route objects; ¦RouterProvider¦ renders them.
- **Params**: ¦/courses/:id¦ and ¦useParams()¦.
- **Nested routes**: a parent renders ¦<Outlet />¦ where children appear.
- **Navigate**: ¦<Link>¦ and ¦useNavigate()¦ avoid full reloads.
- **Protected routes**: a wrapper checks auth and redirects with ¦<Navigate to="/login" replace />¦.
- **Data router (v6.4+/v7)**: ¦loader¦ fetches before render, ¦action¦ handles form submits, ¦errorElement¦ catches errors.

#### Example
¦¦¦jsx
const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    element: <RequireAuth />,                  // protected layout
    children: [
      { path: '/', element: <Dashboard /> },
      {
        path: '/courses/:id',
        loader: ({ params }) => fetch(¦/api/courses/§{params.id}¦).then(r => r.json()),
        element: <CoursePage />,               // useLoaderData() inside
        errorElement: <p>Course not found</p>,
      },
    ],
  },
]);

function RequireAuth() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
¦¦¦

#### Remember it
- **Link** to navigate, **Outlet** for nesting, **params** for ids, **loader** for data.
- Auth guard in the UI is for UX only; the server must enforce access.

#### Common mistakes
- Using ¦<a href>¦ (full reload).
- Relying on client guards for security.
- Forgetting a catch-all ¦*¦ route.

#### Interview angle
"How do you protect routes?" Say: "A layout route checks the auth state and renders an Outlet or redirects to login, but the API must still verify permissions." Follow-up: what are loaders good for?

### Tooling
#### In one line
Modern React projects use Vite (build/dev server), ESLint with the react-hooks plugin, Prettier and React DevTools to stay fast and bug-free.

#### Real-life analogy
Tooling is the workshop: Vite is the power tool, ESLint is the safety inspector, Prettier is the tidy-up crew and DevTools is the X-ray machine.

#### How it works
- **Vite**: native ES modules in dev (instant start, fast hot reload) and Rollup/Rolldown bundling for production. Create React App is deprecated.
- **Next.js** (or another framework) when you need SSR, routing and server features.
- **ESLint + eslint-plugin-react-hooks** catches missing effect dependencies and hook-rule violations.
- **Prettier** formats code so reviews focus on logic.
- **DevTools**: Components tab inspects props/state; Profiler records renders and flame graphs.
- Add TypeScript, Vitest and Husky/lint-staged for pre-commit checks.

#### Example
¦¦¦bash
npm create vite@latest hub -- --template react-ts
cd hub && npm i
npm i -D eslint eslint-plugin-react-hooks prettier vitest
npm run dev     # http://localhost:5173
npm run build   # optimised bundle in dist/
¦¦¦

#### Remember it
- **Vite for SPA, Next.js for full-stack.**
- Rules of Hooks: top level only, only in components/hooks.
- Profile before you optimise.

#### Common mistakes
- Disabling the exhaustive-deps lint rule to silence it.
- Starting new projects with CRA.
- Not committing lint/format config for the team.

#### Interview angle
"Why Vite over webpack?" Say: "Vite serves source as native ESM so dev start and HMR do not depend on bundle size, and production builds are still optimised." Follow-up: how does the Profiler help?

## Phase 2 · Intermediate
### Rendering model
#### In one line
After state changes React **renders** (calls your components to get a new element tree), compares it with the previous one, and **commits** only the differences to the real DOM.

#### Real-life analogy
An editor receives a new draft of a document, uses "track changes" to compare it with the old draft, and edits only the lines that differ in the printed copy.

#### How it works
1. **Trigger**: a state update, parent re-render, or context change.
2. **Render phase**: React calls components (pure, can be paused in concurrent mode) and builds a new virtual tree.
3. **Reconciliation**: compares by type and key; same type keeps the instance, different type remounts.
4. **Commit phase**: applies DOM changes, then runs layout effects and effects.
- A **re-render** means calling the function again, not necessarily touching the DOM.
- A child re-renders when its parent does, unless wrapped in ¦React.memo¦ and props are shallow-equal.
- Render must be **pure**: no side effects, same inputs same output.

#### Example
¦¦¦jsx
function Parent() {
  const [n, setN] = useState(0);
  console.log('Parent renders');          // each click
  return (
    <>
      <button onClick={() => setN(n + 1)}>{n}</button>
      <Child />                           {/* re-renders too, no props changed */}
      <MemoChild />                       {/* skipped: memo + no props */}
    </>
  );
}
const MemoChild = React.memo(function MemoChild() { console.log('MemoChild'); return null; });
function Child() { console.log('Child renders'); return null; }
¦¦¦

#### Remember it
- Render = compute. Commit = touch DOM.
- Triggers: **state, parent, context**.
- Same type + same key = update; otherwise remount.

#### Common mistakes
- Thinking re-render equals DOM update.
- Side effects in the render body.
- Defining components inside components (new type every render, remounts).

#### Interview angle
"What happens after setState?" Say: "React queues the update, re-renders the component and its children, diffs the new tree against the old using type and key, then commits minimal DOM changes and runs effects." Follow-up: how does memo stop a child render?

### Hooks deep dive
#### In one line
Beyond ¦useState¦ and ¦useEffect¦, each hook solves one specific problem: persistent refs, caching, complex state, shared values, layout timing and unique ids.

#### Real-life analogy
Hooks are drawers in a toolbox: ¦useRef¦ is a sticky note that does not trigger re-reading, ¦useMemo¦ is a saved calculation, ¦useReducer¦ is a rule book for changes.

#### How it works
- **useRef**: mutable box ¦.current¦ that survives renders without re-rendering; DOM access, timers, previous value.
- **useMemo**: caches a computed value until deps change.
- **useCallback**: caches a function identity (for memo children or effect deps).
- **useReducer**: ¦(state, action) => newState¦ for complex transitions.
- **useContext**: reads the nearest provider value.
- **useLayoutEffect**: runs before paint; measure DOM and adjust without flicker.
- **useId**: stable unique id for accessibility attributes, safe for SSR.

#### Example
¦¦¦jsx
function Quiz({ questions }) {
  const inputRef = useRef(null);
  const [state, dispatch] = useReducer(reducer, { index: 0, score: 0 });
  const id = useId();
  const total = useMemo(() => questions.reduce((s, q) => s + q.points, 0), [questions]);

  return (
    <div>
      <label htmlFor={id + '-ans'}>Answer</label>
      <input id={id + '-ans'} ref={inputRef} />
      <button onClick={() => { dispatch({ type: 'next' }); inputRef.current.focus(); }}>
        Next ({state.index + 1}/{questions.length}) of {total} pts
      </button>
    </div>
  );
}
function reducer(s, a) {
  return a.type === 'next' ? { ...s, index: s.index + 1 } : s;
}
¦¦¦

#### Remember it
| Hook | Think |
|---|---|
| useRef | box, no re-render |
| useMemo | cache value |
| useCallback | cache function |
| useReducer | many state rules |
| useLayoutEffect | before paint |
| useId | accessible ids |

#### Common mistakes
- Putting a value that should render into a ref.
- Memoising everything without measuring.
- ¦useLayoutEffect¦ for data fetching (blocks paint).

#### Interview angle
"useMemo vs useCallback?" Say: "useMemo caches the result of a calculation; useCallback caches the function itself, equal to ¦useMemo(() => fn)¦. Both only help when referential equality or expensive work matters." Follow-up: when use useReducer over useState?

### Custom hooks
#### In one line
A custom hook is a function starting with ¦use¦ that bundles reusable stateful logic built from other hooks.

#### Real-life analogy
A recipe card: the same steps (logic) can be used in many kitchens (components), but each cook gets their own ingredients (own state).

#### How it works
- Name starts with ¦use¦ so lint can check the rules of hooks.
- Each call creates **separate** state; hooks share logic, not state.
- Return whatever the caller needs: value, setter, status.
- Keep them focused: one job each. Test with ¦renderHook¦.

#### Example
¦¦¦jsx
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);          // cancel on each change
  }, [value, delay]);
  return debounced;
}

export function useLocalStorage(key, initial) {
  const [v, setV] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initial; } catch { return initial; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(v)); }, [key, v]);
  return [v, setV];
}

// Search box: API is called 300 ms after typing stops
const q = useDebounce(term, 300);
¦¦¦

#### Remember it
- **Reuse logic, not state.**
- Name: ¦useXxx¦. Call at top level.
- Starter kit: useDebounce, useFetch, useLocalStorage, useMediaQuery.

#### Common mistakes
- Believing two components share state through a custom hook.
- Huge hooks doing many unrelated things.
- Unstable returned objects causing consumer re-renders.

#### Interview angle
"When do you write a custom hook?" Say: "When two components repeat the same stateful logic or effect, I extract it so it is testable and consistent, for example a debounce hook for search." Follow-up: how do you test one?

### Context API
#### In one line
Context lets a parent broadcast a value to any descendant without passing props, but every consumer re-renders when the value changes.

#### Real-life analogy
Context is a building PA system: everyone can hear it, but when the announcement changes, everyone stops what they are doing.

#### How it works
1. ¦createContext(default)¦.
2. Wrap the tree in ¦<Ctx.Provider value={...}>¦.
3. Read with ¦useContext(Ctx)¦.
- A new object in ¦value¦ each render makes all consumers re-render. **Memoise the value**.
- Split contexts by change frequency (theme vs user vs notifications).
- Separate state and dispatch contexts so components that only dispatch do not re-render.
- Not a full state manager: no selectors, so use a store for frequently changing data.

#### Example
¦¦¦jsx
const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = useMemo(
    () => ({ user, login: setUser, logout: () => setUser(null) }),
    [user]                                     // stable unless user changes
  );
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
¦¦¦

#### Remember it
- Good for: theme, locale, current user.
- Bad for: fast-changing state (typing, mouse).
- **Memoise value, split contexts.**

#### Common mistakes
- Inline ¦value={{ a, b }}¦ without ¦useMemo¦.
- One giant app context.
- Missing provider check giving cryptic errors.

#### Interview angle
"Why does Context cause re-renders?" Say: "Every component using ¦useContext¦ subscribes to the whole value, so any change re-renders all consumers. I split contexts and memoise values, or use Zustand with selectors." Follow-up: Context vs Redux?

### State management
#### In one line
Choose the tool by where the state lives and how it changes: local state, shared UI state, server cache, or the URL.

#### Real-life analogy
Storing things at home: your pocket (local state), the shared fridge (global store), the supermarket's shelf copy (server cache) and the signpost outside (URL).

#### How it works
- **Local**: ¦useState/useReducer¦ for one component or subtree.
- **Shared client state**: Zustand (small, selectors) or Redux Toolkit (large teams, devtools, middleware, predictable).
- **Context**: low-frequency values.
- **Server state**: React Query/SWR, not Redux.
- **URL state**: filters, page, sort in query params so links are shareable.
- Rule: put state in the **narrowest scope** possible.

#### Example
¦¦¦js
import { create } from 'zustand';

// Shared UI state: sidebar and selected course
export const useUi = create(set => ({
  sidebarOpen: true,
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
}));

// Component subscribes to ONE slice: only re-renders when it changes
const open = useUi(s => s.sidebarOpen);

// URL state: ?page=2&sort=title
const [params, setParams] = useSearchParams();
¦¦¦

#### Remember it
| State kind | Tool |
|---|---|
| Local | useState |
| Shared UI | Zustand / RTK |
| Server data | React Query |
| Shareable | URL |

#### Common mistakes
- Putting API data in Redux and hand-writing caching.
- Global store for everything.
- Duplicating URL state in component state.

#### Interview angle
"Redux or Zustand?" Say: "I classify the state first. Server data goes to React Query, URL for filters, and for shared client state Zustand for simplicity or Redux Toolkit when the team needs conventions and tooling." Follow-up: what did RTK fix in old Redux?

### Server state
#### In one line
Server state is data owned by the backend; React Query (TanStack Query) or SWR fetch, cache, refresh and update it for you.

#### Real-life analogy
A librarian keeps copies of popular books at the front desk. She serves from the copy (cache), checks for newer editions in the background, and replaces them when told.

#### How it works
- ¦useQuery({ queryKey, queryFn })¦ returns ¦data, isPending, error¦.
- **Cache** is keyed by ¦queryKey¦; same key shares one request (deduplication).
- **staleTime**: how long data counts as fresh. After that, refetch on focus, reconnect or mount.
- **Mutations**: ¦useMutation¦ then ¦invalidateQueries¦ to refetch.
- **Optimistic update**: change the cache first, roll back on error.
- Gives retries, pagination, infinite scroll and background refetch without custom code.

#### Example
¦¦¦jsx
const qc = useQueryClient();

const { data: courses, isPending } = useQuery({
  queryKey: ['courses', { page }],
  queryFn: () => fetch(¦/api/courses?page=§{page}¦).then(r => r.json()),
  staleTime: 60_000,                       // fresh for 1 minute
});

const enrol = useMutation({
  mutationFn: id => fetch(¦/api/enrol/§{id}¦, { method: 'POST' }),
  onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }), // refetch list
});
¦¦¦

#### Remember it
- **Key = identity** of the data, include every variable.
- **Invalidate after mutate.**
- stale is not bad; it means "refetch when convenient".

#### Common mistakes
- Copying query data into ¦useState¦.
- Forgetting variables in the key (wrong cache hits).
- Setting ¦staleTime: 0¦ everywhere (extra requests).

#### Interview angle
"Why React Query over useEffect fetch?" Say: "It handles caching, deduplication, retries, race conditions and refetching, so I avoid fragile hand-written effects and Redux boilerplate." Follow-up: how do optimistic updates work?

### Forms at scale
#### In one line
React Hook Form with zod validation keeps big forms fast and accessible by using mostly uncontrolled inputs and schema-based rules.

#### Real-life analogy
Instead of a clerk updating a ledger on every keystroke (controlled), RHF lets you fill the paper form and the clerk checks it when you hand it over.

#### How it works
- ¦register('field')¦ attaches inputs by ref, so typing does not re-render the form.
- A **zod schema** is the single source of validation and TypeScript types via ¦z.infer¦.
- ¦zodResolver¦ connects them; ¦formState.errors¦ gives messages.
- **Field arrays** (¦useFieldArray¦) for repeating rows like questions or options.
- **Accessibility**: label every input, ¦aria-invalid¦, ¦aria-describedby¦ for errors, move focus to the first error.

#### Example
¦¦¦jsx
const schema = z.object({
  name: z.string().min(2, 'Too short'),
  email: z.string().email(),
});

function ProfileForm({ onSave }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(onSave)} noValidate>
      <label htmlFor="n">Name</label>
      <input id="n" {...register('name')} aria-invalid={!!errors.name}
             aria-describedby="n-err" />
      <p id="n-err" role="alert">{errors.name?.message}</p>
      <button disabled={isSubmitting}>Save</button>
    </form>
  );
}
¦¦¦

#### Remember it
- **Schema once, use on client and server.**
- Uncontrolled = fewer renders.
- Errors are announced: ¦role="alert"¦.

#### Common mistakes
- Using controlled inputs for 50-field forms.
- Only client validation; the server must validate too.
- Error text not linked to its field.

#### Interview angle
"Why React Hook Form?" Say: "It isolates re-renders by using uncontrolled inputs, has small bundle size and works with zod for typed validation, which keeps large forms fast." Follow-up: how would you handle a dynamic list of fields?

### Performance
#### In one line
Optimise only after measuring: avoid unnecessary renders, split code, virtualise long lists and use the Profiler to find the hot path.

#### Real-life analogy
Fixing a slow commute: first track which road is slow (profile), then fix that road, instead of buying a faster car for every trip.

#### How it works
- **React.memo**: skip child re-render when props are shallow-equal.
- **useMemo / useCallback**: stable values/functions so memo works and expensive work is cached.
- **lazy + Suspense**: load route or heavy component code on demand.
- **Virtualisation** (react-window/TanStack Virtual): render only visible rows.
- **Keep state local**, move it down, so fewer components re-render.
- **Profiler**: record, find slow commits, check "why did this render".

#### Example
¦¦¦jsx
const Reports = lazy(() => import('./Reports'));   // separate chunk

const Row = React.memo(function Row({ item, onOpen }) {
  return <li onClick={() => onOpen(item.id)}>{item.title}</li>;
});

function List({ items }) {
  const open = useCallback(id => navigate(¦/c/§{id}¦), []);  // stable for memo
  return <ul>{items.map(i => <Row key={i.id} item={i} onOpen={open} />)}</ul>;
}

<Suspense fallback={<Spinner />}><Reports /></Suspense>
¦¦¦

#### Remember it
1. **Measure** 2. **Move state down** 3. **Split code** 4. **Virtualise** 5. **Memoise last**.
- Typical wins: code-splitting and caching gave 30-40% faster pages in practice.

#### Common mistakes
- ¦memo¦ with new inline objects/functions each render (never skips).
- Memoising everything.
- Optimising without a profile.

#### Interview angle
"How did you make pages 30-40% faster?" Say: "I profiled first, then split routes with lazy loading, cached server data, trimmed re-renders by moving state down, and re-measured with Web Vitals." Follow-up: when does React.memo not help?

### Error boundaries and Suspense boundaries
#### In one line
Error boundaries catch rendering errors in a subtree and show a fallback; Suspense boundaries show a fallback while something is loading.

#### Real-life analogy
A circuit breaker in each room: if one room shorts out (error), only that room goes dark, and a "please wait" sign (Suspense) is shown while the electrician works.

#### How it works
- An **error boundary** is a class with ¦getDerivedStateFromError¦ / ¦componentDidCatch¦, or use the ¦react-error-boundary¦ package.
- Catches errors in render, lifecycle and constructors of children. **Not** event handlers, async code or SSR; handle those with try/catch.
- **Suspense** wraps components that lazy load or fetch with Suspense-enabled libraries; shows ¦fallback¦.
- Place boundaries around **features** (widgets, routes), not only at the root, so one failure does not blank the page.
- Report errors to Sentry in ¦onError¦.

#### Example
¦¦¦jsx
import { ErrorBoundary } from 'react-error-boundary';

function Fallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong.</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

<ErrorBoundary FallbackComponent={Fallback} onError={e => Sentry.captureException(e)}>
  <Suspense fallback={<Spinner />}>
    <ProgressChart />          {/* lazy loaded, may throw */}
  </Suspense>
</ErrorBoundary>
¦¦¦

#### Remember it
- Error boundary = **catch**. Suspense = **wait**.
- Boundaries do not catch event handler errors.
- Many small boundaries beat one big one.

#### Common mistakes
- Expecting boundaries to catch ¦fetch¦ failures in handlers.
- No reset option for users.
- Silent errors with no logging.

#### Interview angle
"What do error boundaries not catch?" Say: "Errors in event handlers, asynchronous code, server rendering, and errors in the boundary itself; those need try/catch or error state." Follow-up: where would you place them?

### Testing
#### In one line
Test what the user sees and does with React Testing Library, not internal implementation details.

#### Real-life analogy
A restaurant inspector orders a meal and tastes it; they do not check which brand of stove the chef used.

#### How it works
- **Vitest/Jest** runs tests; **RTL** renders and queries by role, label and text.
- **user-event** simulates real typing and clicking.
- **MSW** mocks the network at the HTTP level, so your real fetch code runs.
- Query priority: ¦getByRole¦ > ¦getByLabelText¦ > ¦getByText¦ > ¦getByTestId¦.
- Use ¦findBy¦ for async appearance and ¦queryBy¦ to assert absence.
- Cover: happy path, validation errors, loading, error, accessibility.

#### Example
¦¦¦jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from './server';

test('shows error on wrong password', async () => {
  server.use(http.post('/api/login', () => new HttpResponse(null, { status: 401 })));
  render(<LoginForm />);

  await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'wrongpass1');
  await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

  expect(await screen.findByRole('alert')).toHaveTextContent(/invalid/i);
});
¦¦¦

#### Remember it
- **Arrange, Act, Assert**.
- Test **behaviour**, not state variables.
- Role queries double as an accessibility check.

#### Common mistakes
- Testing implementation (internal state, class names).
- Snapshot tests for everything.
- Not awaiting async UI.

#### Interview angle
"How do you test a component?" Say: "I render it as a user would, interact with user-event, mock the API with MSW and assert on visible output by role or label, so refactors do not break tests." Follow-up: unit vs integration vs e2e?

### Accessibility (WCAG)
#### In one line
Accessibility means everyone, including keyboard and screen-reader users, can use your UI; WCAG defines the standards.

#### Real-life analogy
A building with ramps, clear signs and automatic doors is better for everyone, not only wheelchair users. Accessible UI is the same.

#### How it works
- **Semantic HTML first**: ¦button¦, ¦nav¦, ¦main¦, ¦label¦, headings in order. ARIA only when HTML cannot express it.
- **Keyboard**: everything reachable with Tab, visible focus, Enter/Space work, no keyboard traps.
- **Focus management**: after opening a modal move focus inside and return it on close; after route change focus the heading.
- **Colour contrast**: 4.5:1 for normal text.
- **Alt text**, captions, ¦aria-live¦ for dynamic messages.
- Test with axe, Lighthouse, jest-axe, and a screen reader.

#### Example
¦¦¦jsx
// Bad: div as a button
<div onClick={save}>Save</div>
// Good: free keyboard + role + focus
<button type="button" onClick={save}>Save</button>

// Accessible icon button and live status
<button aria-label="Close dialog" onClick={close}><XIcon aria-hidden="true" /></button>
<p role="status" aria-live="polite">{saved ? 'Progress saved' : ''}</p>
¦¦¦

#### Remember it
- **First rule of ARIA: do not use ARIA** if native HTML works.
- POUR: Perceivable, Operable, Understandable, Robust.
- Healthcare education platforms may have legal accessibility requirements.

#### Common mistakes
- Clickable ¦div¦s.
- Removing focus outlines.
- Placeholder as the only label.

#### Interview angle
"How do you ensure accessibility?" Say: "Semantic HTML, keyboard testing, managed focus, sufficient contrast, plus automated axe checks in CI and manual screen-reader checks on key flows." Follow-up: how do you make a modal accessible?

### Design-system / component-library design
#### In one line
A component library is a set of reusable, documented, accessible components that share design tokens, so teams build screens faster and consistently.

#### Real-life analogy
It is a standard set of kitchen modules: any chef can assemble a new restaurant kitchen quickly because the parts fit and look the same.

#### How it works
- **Design tokens**: colours, spacing, type as CSS variables for theming and dark mode.
- **API design**: consistent props (¦variant¦, ¦size¦, ¦disabled¦), forward ¦ref¦ and native attributes, prefer composition to many booleans.
- **Compound components**: ¦<Tabs><Tabs.List/><Tabs.Panel/></Tabs>¦ share state via context.
- **Headless primitives** (Radix, Headless UI) give accessibility and behaviour; you add style.
- **Storybook** for docs and visual testing; unit and a11y tests; **semver** and changelog; tree-shakeable ESM build.

#### Example
¦¦¦tsx
type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md';
};

export function Button({ variant = 'primary', size = 'md', className = '', ...rest }: ButtonProps) {
  return <button className={¦btn btn--§{variant} btn--§{size} §{className}¦} {...rest} />;
}
// Tokens in CSS: .btn--primary { background: var(--color-brand); }
// Result in practice: new screens needed ~35% less effort
¦¦¦

#### Remember it
- **Tokens, primitives, components, docs, versions.**
- Make the right thing the easy thing: accessible by default.
- Breaking change means major version plus migration guide.

#### Common mistakes
- Too many boolean props.
- No documentation, so nobody adopts it.
- Styling that cannot be overridden.

#### Interview angle
"How did you design the component library?" Say: "I audited duplicates, defined tokens and a small consistent API, used headless primitives for accessibility, documented in Storybook, versioned it, and paired with teams to adopt it; screens took about 35% less effort." Follow-up: how do you handle breaking changes?

## Phase 3 · Advanced (Lead level)
### React 18 concurrency
#### In one line
Concurrent rendering lets React pause and prioritise work, so urgent updates like typing stay responsive while heavy updates happen in the background.

#### Real-life analogy
A chef who can pause a slow stew to quickly serve a customer's drink, then return to the stew.

#### How it works
- **useTransition**: ¦startTransition(() => setState())¦ marks an update as non-urgent; ¦isPending¦ shows progress.
- **useDeferredValue**: gives a lagging copy of a value for expensive child rendering.
- **Automatic batching**: updates in promises, timeouts and native events are batched.
- **Strict Mode (dev)**: double-invokes render and re-runs effects to expose impure code and missing cleanup.
- Enabled with ¦createRoot¦. Transitions do not make work faster; they make the UI **feel** responsive.

#### Example
¦¦¦jsx
function Search({ items }) {
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const onChange = e => {
    setText(e.target.value);                       // urgent: input stays smooth
    startTransition(() => setQuery(e.target.value)); // heavy list can wait
  };

  return (
    <>
      <input value={text} onChange={onChange} />
      {isPending && <Spinner />}
      <HeavyList items={items} query={query} />
    </>
  );
}
¦¦¦

#### Remember it
- **Urgent vs transition.**
- useTransition = you own the setter; useDeferredValue = you only get the value.
- Transitions keep old UI visible instead of showing a fallback.

#### Common mistakes
- Putting controlled input value inside a transition.
- Expecting speed-up of the work itself.
- Impure render breaking under Strict Mode.

#### Interview angle
"When use a transition?" Say: "When a state update triggers expensive rendering, like filtering thousands of rows, I mark that update as a transition so keystrokes stay urgent and smooth." Follow-up: transition vs debounce?

### React 19
#### In one line
React 19 adds Actions and new hooks that make async form handling, optimistic UI and data reading simpler, plus small ergonomics like ref as a prop.

#### Real-life analogy
Before, you built a car's indicators by hand each time; React 19 ships them built in: pending, error and rollback states come standard.

#### How it works
- **Actions**: async functions used in ¦<form action={fn}>¦ or transitions, with built-in pending and error handling.
- **useActionState**: state + action + pending for a form.
- **useFormStatus**: child components read the parent form's pending state.
- **useOptimistic**: show the expected result immediately, revert if it fails.
- **use()**: read a promise (with Suspense) or context, even conditionally.
- **ref as a prop**: no ¦forwardRef¦ for function components; refs can return cleanup functions.
- Document metadata tags (¦<title>¦) from components; Context itself usable as a provider.

#### Example
¦¦¦jsx
function RateCourse({ id, rating, rate }) {
  const [optimistic, setOptimistic] = useOptimistic(rating);
  const [error, submit, pending] = useActionState(async (_prev, formData) => {
    const value = Number(formData.get('stars'));
    setOptimistic(value);                  // instant UI
    try { await rate(id, value); return null; }
    catch { return 'Could not save rating'; }   // optimistic value reverts
  }, null);

  return (
    <form action={submit}>
      <input name="stars" type="number" min="1" max="5" />
      <button disabled={pending}>Rate</button>
      <p>Current: {optimistic} {error}</p>
    </form>
  );
}
¦¦¦

#### Remember it
| New | Purpose |
|---|---|
| Actions | async forms |
| useActionState | result + pending |
| useOptimistic | instant UI |
| use() | read promise/context |
| ref prop | no forwardRef |

#### Common mistakes
- Using ¦use()¦ with a promise created during render (recreated every time).
- Mixing old and new form patterns.
- Assuming Server Actions work without a supporting framework.

#### Interview angle
"What is new in React 19?" Say: "Actions with useActionState, useOptimistic, useFormStatus and use(), ref as a prop and metadata support, which remove much form and loading boilerplate." Follow-up: how does useOptimistic roll back?

### Server Components and Next.js App Router
#### In one line
Server Components render on the server and send no JavaScript for themselves, while Client Components (¦'use client'¦) handle interactivity.

#### Real-life analogy
A restaurant: the kitchen (server) cooks and plates the meal; only things that need interaction, like a salt shaker, are handed to the table (client).

#### How it works
- In the App Router, components are **server by default**. They can be ¦async¦, read databases directly and keep secrets and heavy libraries off the client.
- Add ¦'use client'¦ for state, effects, events, browser APIs. A client boundary also makes its imports client code.
- Server components can render client components and pass serialisable props; not the other way around except via ¦children¦.
- **Server Actions** (¦'use server'¦) are functions the client can call for mutations.
- **Streaming** with Suspense sends parts of the page as they are ready; **hydration** attaches interactivity.
- **Caching**: framework-level data, route and fetch caches; know your version's defaults.

#### Example
¦¦¦jsx
// app/courses/page.jsx  (Server Component: no 'use client')
import { db } from '@/lib/db';
import EnrolButton from './EnrolButton';

export default async function Page() {
  const courses = await db.course.findMany();       // runs on the server only
  return courses.map(c => (
    <div key={c.id}>{c.title} <EnrolButton id={c.id} /></div>
  ));
}

// EnrolButton.jsx
'use client';
export default function EnrolButton({ id }) {
  const [done, setDone] = useState(false);          // needs the browser
  return <button onClick={() => setDone(true)}>{done ? 'Enrolled' : 'Enrol'}</button>;
}
¦¦¦

#### Remember it
- **Server by default, client only when interactive.**
- Push ¦'use client'¦ to the leaves.
- Props crossing the boundary must be serialisable.

#### Common mistakes
- Marking a whole page ¦'use client'¦.
- Passing functions as props from server to client.
- Leaking secrets by importing server code into client files.

#### Interview angle
"Server vs client components?" Say: "Server components run only on the server, so no bundle cost and direct data access; client components add interactivity and hydrate in the browser. I keep the client boundary at small leaves." Follow-up: what is hydration?

### Rendering strategies
#### In one line
CSR, SSR, SSG, ISR and streaming decide **where and when** HTML is generated, trading SEO, freshness, speed and cost.

#### Real-life analogy
A bakery: cook to order (SSR), bake in the morning and sell all day (SSG), rebake every hour (ISR), deliver ingredients and let the customer cook (CSR).

#### How it works
- **CSR**: browser downloads JS and builds the page. Good for dashboards behind login; slower first paint, weaker SEO.
- **SSR**: server renders HTML per request. Good SEO and fresh data; server cost and latency.
- **SSG**: HTML built at build time, served from CDN. Fastest; for content that rarely changes.
- **ISR**: static pages regenerated after a time or on demand.
- **Streaming**: send HTML in chunks with Suspense so users see content early.
- Pick **per page**, in the same app.

#### Example
¦¦¦js
// Next.js examples (concept)
// SSG: marketing page, built once
export const dynamic = 'force-static';

// ISR: course catalogue refreshed at most every 10 minutes
export const revalidate = 600;

// SSR: personalised dashboard, per request
export const dynamic = 'force-dynamic';
¦¦¦

#### Remember it
| Page | Strategy |
|---|---|
| Landing, blog | SSG |
| Catalogue | ISR |
| Dashboard (auth) | CSR or SSR |
| Search results | SSR / streaming |
- **SEO + fresh = SSR, SEO + stable = SSG.**

#### Common mistakes
- SSR for everything (cost).
- CSR for public SEO pages.
- Forgetting cache invalidation on ISR.

#### Interview angle
"How do you choose?" Say: "I decide per page: SEO needs, how often data changes, personalisation and cost. Static or ISR for public content, SSR or streaming for dynamic personalised pages, CSR for logged-in apps." Follow-up: what is hydration mismatch?

### Application architecture
#### In one line
Architecture is how you organise code so a team of 8+ can work in parallel without breaking each other.

#### Real-life analogy
A city: districts (features) with their own shops and rules, shared roads and utilities (shared libraries), and clear boundaries.

#### How it works
- **Feature folders**: ¦features/courses¦ holds its components, hooks, api and tests; features do not import each other's internals.
- **Layers**: ui (components), domain (hooks, logic), data (API clients); dependencies point inward.
- **Shared** layer: design system, utils, API client.
- **Monorepo** (Nx/Turborepo/pnpm workspaces): shared packages, one CI, consistent versions.
- **Micro-frontends** (module federation): independent deploys per team; adds complexity, so use only for real organisational scaling.
- Record decisions in **ADRs**; enforce boundaries with lint rules.

#### Example
¦¦¦text
src/
  app/            routes, providers
  features/
    courses/
      components/  hooks/  api.ts  index.ts   <- public API
    quiz/
  shared/
    ui/  lib/  api-client.ts
packages/ (monorepo)
  design-system/  eslint-config/  apps/hub
¦¦¦

#### Remember it
- **Colocate by feature**, share by layer.
- Public API via ¦index.ts¦; no deep imports.
- Micro-frontends are an org tool, not a code tool.

#### Common mistakes
- Folders by type only (components, hooks) growing huge.
- Circular imports between features.
- Adopting micro-frontends too early.

#### Interview angle
"How do you structure a large React app?" Say: "Feature folders with public entry points, shared design system and API client, enforced by lint boundaries, inside a monorepo with CI per package; ADRs document why." Follow-up: when are micro-frontends worth it?

### Performance at scale
#### In one line
At scale you manage bundle size, loading metrics (Core Web Vitals) and render cost with measurement and budgets, and the React Compiler can automate memoisation.

#### Real-life analogy
Running a large airport: not just one fast plane, but baggage, queues and schedules, tracked with dashboards and limits.

#### How it works
- **Bundle analysis** (source-map-explorer, rollup-plugin-visualizer): find big dependencies; replace or lazy load.
- **Tree shaking**: use ESM and named imports (¦import { debounce } from 'lodash-es'¦).
- **Core Web Vitals**: LCP (loading), INP (responsiveness), CLS (layout shift). Track with Lighthouse and real-user monitoring.
- Images: modern formats, correct size, lazy loading, preload hero.
- Caching: CDN, HTTP headers, React Query.
- **React Compiler** (v1.0 released in late 2025) auto-memoises at build time, reducing manual ¦useMemo¦ and ¦useCallback¦. Check your React and tooling version.
- Add **performance budgets** in CI.

#### Example
¦¦¦js
// vite.config.js: visualise bundle
import { visualizer } from 'rollup-plugin-visualizer';
export default { plugins: [react(), visualizer({ open: true })] };

// Route-level splitting
const Admin = lazy(() => import('./pages/Admin'));

// Report real user metrics
import { onINP, onLCP, onCLS } from 'web-vitals';
[onINP, onLCP, onCLS].forEach(fn => fn(m => navigator.sendBeacon('/vitals', JSON.stringify(m))));
¦¦¦

#### Remember it
| Metric | Meaning | Good |
|---|---|---|
| LCP | main content loaded | under 2.5 s |
| INP | response to input | under 200 ms |
| CLS | layout jumps | under 0.1 |
- Measure, budget, automate.

#### Common mistakes
- Importing whole libraries for one function.
- Only checking on a fast laptop.
- Ignoring real-user data.

#### Interview angle
"How do you keep performance good as the app grows?" Say: "Bundle budgets in CI, route-level splitting, tracking Web Vitals from real users, profiling hot paths, and letting the React Compiler remove manual memoisation where available." Follow-up: what is INP?

### Security in React apps
#### In one line
React escapes output by default, but you must still prevent XSS, protect tokens, defend against CSRF, set CSP and manage dependency risk.

#### Real-life analogy
A bank vault with a good door (React escaping) still needs guards, cameras and visitor checks (CSP, cookies, audits).

#### How it works
- **XSS**: JSX escapes text. Danger: ¦dangerouslySetInnerHTML¦, ¦href="javascript:..."¦, rendering untrusted HTML. Sanitise with DOMPurify if needed.
- **Token storage**: prefer **HttpOnly, Secure, SameSite cookies** over localStorage (readable by any injected script).
- **CSRF**: with cookies, use SameSite and CSRF tokens on state-changing requests.
- **CSP**: restricts script sources, reducing XSS impact.
- **Dependencies**: ¦npm audit¦, lockfile, Dependabot, review new packages.
- Never trust the client: authorisation is enforced on the server; no secrets in env variables shipped to the browser.

#### Example
¦¦¦jsx
import DOMPurify from 'dompurify';

// Unsafe: attacker-controlled HTML runs scripts
// <div dangerouslySetInnerHTML={{ __html: comment }} />

// Safer: sanitise first (only when you truly need HTML)
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment) }} />

// Cookie set by server:
// Set-Cookie: sid=...; HttpOnly; Secure; SameSite=Lax; Path=/
¦¦¦

#### Remember it
- **Escape, sanitise, HttpOnly, SameSite, CSP, audit.**
- ¦VITE_¦ / ¦NEXT_PUBLIC_¦ variables are public.
- UI hiding is not authorisation.

#### Common mistakes
- Storing JWTs in localStorage.
- Using ¦dangerouslySetInnerHTML¦ with user content.
- Trusting client-side role checks.

#### Interview angle
"How do you protect against XSS in React?" Say: "React escapes by default; I avoid dangerouslySetInnerHTML or sanitise with DOMPurify, set a strict CSP, and keep tokens in HttpOnly cookies so injected scripts cannot read them." Follow-up: how do you handle CSRF with cookies?

### Patterns
#### In one line
Common React patterns solve recurring design problems: compound components, render props, HOCs, controlled/uncontrolled components and state machines.

#### Real-life analogy
Patterns are standard floor plans: you do not reinvent a kitchen layout each time; you pick the one that fits.

#### How it works
- **Compound components**: related components share implicit state (Tabs, Accordion, Select) via context; flexible API.
- **Render props**: pass a function that returns UI to share logic; mostly replaced by hooks.
- **HOC**: function that wraps a component to add behaviour (¦withAuth¦). Hooks replaced most because they avoid wrapper hell and prop collisions.
- **Controlled vs uncontrolled**: let the parent own the value, or the component owns it; support both with ¦value/defaultValue¦.
- **State machines** (XState, or a reducer with explicit states): impossible states become impossible (idle, loading, success, error).

#### Example
¦¦¦jsx
const TabsCtx = createContext();
function Tabs({ defaultValue, children }) {
  const [value, setValue] = useState(defaultValue);
  return <TabsCtx.Provider value={{ value, setValue }}>{children}</TabsCtx.Provider>;
}
Tabs.Tab = ({ id, children }) => {
  const { value, setValue } = useContext(TabsCtx);
  return <button role="tab" aria-selected={value === id} onClick={() => setValue(id)}>{children}</button>;
};
Tabs.Panel = ({ id, children }) => useContext(TabsCtx).value === id ? <div role="tabpanel">{children}</div> : null;

// <Tabs defaultValue="a"><Tabs.Tab id="a">Notes</Tabs.Tab><Tabs.Panel id="a">...</Tabs.Panel></Tabs>
¦¦¦

#### Remember it
| Pattern | Use today? |
|---|---|
| Compound | yes (libraries) |
| Render props | rarely |
| HOC | rarely |
| Custom hook | yes (first choice) |
| State machine | yes (complex flows) |

#### Common mistakes
- Boolean state flags (¦isLoading¦, ¦isError¦ both true).
- HOCs that hide props and break refs.
- Over-abstracting too early.

#### Interview angle
"Why did hooks replace HOCs?" Say: "Hooks share logic without wrapping the tree, avoid naming collisions and deeply nested wrappers, and are easier to compose and type." Follow-up: when is a compound component better than props?

### Observability
#### In one line
Observability means you can see what your production app is doing: errors, performance and user impact, and release changes safely.

#### Real-life analogy
A hospital monitor: heart rate, oxygen, alarms. You do not wait for the patient to complain.

#### How it works
- **Error tracking** (Sentry): source maps, release tags, user and breadcrumbs context; alert on spikes.
- **Real User Monitoring**: Web Vitals sent to a dashboard, segmented by route, device and release.
- **Logging and tracing**: correlate frontend requests with backend via trace ids.
- **Feature flags**: release to a percentage, kill switch for quick rollback.
- **A/B tests**: measure impact with analytics.
- Link dashboards to deployments to spot **regressions** quickly; mind privacy (no PII in logs).

#### Example
¦¦¦js
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  release: import.meta.env.VITE_APP_VERSION,  // ties errors to deploy
  tracesSampleRate: 0.1,
  beforeSend(event) { delete event.user?.email; return event; } // privacy
});

// Feature flag rollout
if (flags.isEnabled('new-player')) renderNewPlayer(); else renderOldPlayer();
¦¦¦

#### Remember it
- **Detect, diagnose, decide (rollback/flag).**
- Release tag + source maps = readable errors.
- Alert on user impact, not noise.

#### Common mistakes
- Source maps missing in production tooling.
- Logging personal or patient data.
- Alerts without owners.

#### Interview angle
"How do you detect regressions after a release?" Say: "I tag releases in Sentry, watch error rate and Web Vitals by version, release behind feature flags and roll back or disable the flag on a spike." Follow-up: what do you alert on?

### Team practices
#### In one line
As a lead you scale quality through shared standards: PR checklists, coding guidelines, mentoring and written decisions.

#### Real-life analogy
A head chef does not cook every dish; they set the recipes, taste-test and train the line cooks.

#### How it works
- **PR checklist**: tests, accessibility, performance impact, types, no console logs, screenshots for UI.
- **Coding standards**: lint/format automated, naming, folder rules, error handling conventions.
- **Mentoring**: pair programming, explain feedback, stretch tasks, one-to-ones.
- **ADRs** (Architecture Decision Records): context, decision, consequences.
- **Estimation and planning**: slice into small stories, call out risks early.
- **Metrics**: cycle time, review time, escaped defects; blameless post-mortems.

#### Example
¦¦¦text
ADR-012: Use React Query for server state
Context:   hand-written fetch effects caused race conditions and duplicate requests.
Decision:  adopt TanStack Query; no server data in Redux.
Consequences: less boilerplate, shared cache; team needs a short training session.
Status:    accepted (2024-03)
¦¦¦

#### Remember it
- **Automate the boring, discuss the important.**
- Review the code, not the person.
- Write decisions down.

#### Common mistakes
- Becoming the review bottleneck.
- Rewriting juniors' code instead of coaching.
- Standards that exist only in people's heads.

#### Interview angle
"Tell me about leading a team." Say: "With 8-10 engineers I set PR checklists and lint rules, ran design reviews, paired with juniors and recorded decisions as ADRs, which shortened review cycles and made delivery more predictable." Follow-up: how do you handle a low performer?
`;
