window.PREP = window.PREP || {};
window.PREP.react = String.raw`
@title React.js
@icon atom
@tagline Your main skill. Expect deep questions on rendering, hooks, performance, state management, component library design and React 18/19 features.
@resume Reusable component library (~35% faster screens) | Code-splitting and performance work | Accessibility and cross-browser UI | Team lead and code reviews

## ROADMAP

### Phase 1 · Foundations (Basic)
- Components and JSX: function components, props, children, composition, fragments :: JSX is JavaScript; know className, htmlFor and why one root is needed.
- Lists and keys :: Stable unique keys; array index keys break reordering and state.
- State with useState: functional updates, batching, immutable updates :: Never mutate state; arrays and objects need new references.
- Events and forms: controlled inputs, synthetic events, preventDefault :: Build a login form with validation.
- Conditional rendering: ternary, &&, early return :: Beware {count && <X/>} rendering 0.
- useEffect: dependency array, cleanup, when it runs :: Learn the lifecycle in hooks terms: mount, update, unmount.
- Lifting state up and prop drilling :: Decide where state belongs: nearest common parent.
- Styling options: CSS Modules, styled-components, Tailwind, Material UI :: Be able to compare two approaches honestly.
- React Router: routes, params, nested routes, navigation, protected routes :: Know v6/v7 data router concepts (loaders, actions).
- Tooling: Vite, ESLint (react-hooks plugin), Prettier, DevTools :: Create React App is deprecated; start new apps with Vite or Next.js.

### Phase 2 · Intermediate
- Rendering model: render vs commit, reconciliation, virtual DOM, what triggers a re-render :: Explain in one minute what happens after setState.
- Hooks deep dive: useRef, useMemo, useCallback, useReducer, useContext, useLayoutEffect, useId :: Know a real use for each and a misuse.
- Custom hooks :: Extract useDebounce, useFetch, useLocalStorage, useMediaQuery.
- Context API and its re-render cost :: Split contexts by change frequency; memoise the value.
- State management: Redux Toolkit, Zustand, Context, URL state :: Choose by scope: local, shared UI, server cache, URL.
- Server state: React Query / TanStack Query or SWR :: Cache, stale time, invalidation, optimistic updates.
- Forms at scale: React Hook Form + zod, field arrays, accessibility :: Uncontrolled inputs mean fewer re-renders.
- Performance: React.memo, useMemo, useCallback, lazy + Suspense, list virtualisation, Profiler :: Measure first, then optimise the hot path.
- Error boundaries and Suspense boundaries :: Show friendly fallbacks and report errors.
- Testing: Vitest/Jest, React Testing Library, MSW, user-event :: Test behaviour, not implementation.
- Accessibility (WCAG): semantic HTML, ARIA, keyboard, focus management, colour contrast :: Critical in healthcare products like yours.
- Design-system / component-library design :: Composition, compound components, headless pattern, theming tokens, Storybook, semver.

### Phase 3 · Advanced (Lead level)
- React 18 concurrency: transitions, useDeferredValue, automatic batching, Strict Mode effects :: Explain when a transition keeps typing responsive.
- React 19: Actions, useActionState, useOptimistic, use(), ref as a prop, form status :: Show you know what changed and why.
- Server Components, Server Actions and Next.js App Router :: Server vs client components, streaming, caching, hydration.
- Rendering strategies: CSR, SSR, SSG, ISR, streaming :: Pick per page using SEO, freshness and cost.
- Application architecture: feature folders, layers, monorepo, micro-frontends (module federation) :: Defend your structure for 8+ engineers.
- Performance at scale: bundle analysis, tree shaking, Core Web Vitals, React Compiler :: Compiler (1.0 in late 2025) reduces manual memoisation; check your version.
- Security in React apps: XSS, token storage, CSRF, CSP, dependency risks :: Prefer HttpOnly cookies; avoid dangerouslySetInnerHTML.
- Patterns: compound components, render props, HOC, controlled/uncontrolled, state machines :: Know why hooks replaced most HOCs.
- Observability: Sentry, Web Vitals RUM, feature flags, A/B tests :: Show how you detect regressions in production.
- Team practices: PR checklist, coding standards, mentoring, ADRs :: Prepare stories for lead-level behavioural rounds.

## QA

### [basic] What is React and what is the virtual DOM?
React is a library for building UIs from components that describe what the screen should look like for the current state. The virtual DOM is an in-memory tree of elements. After state changes React renders a new tree, compares it with the previous one (reconciliation) and updates only the real DOM nodes that changed. The benefit is not "the virtual DOM is faster than the DOM" but a **declarative model** with predictable updates.

### [basic] How is JSX turned into JavaScript?
JSX is syntax sugar. A compiler (Babel, SWC, esbuild) converts ¦<Button size="sm">Hi</Button>¦ into a call like ¦jsx(Button, { size: 'sm', children: 'Hi' })¦ that returns a plain object (a React element). Rules: one root (or a fragment ¦<>…</>¦), ¦className¦ not ¦class¦, ¦htmlFor¦ not ¦for¦, camelCase attributes, expressions inside ¦{}¦.

### [basic] Props vs state. What is one-way data flow?
**Props** are inputs passed from parent to child and are read-only. **State** is data owned and changed by a component. Data flows **down** through props; children send changes **up** by calling callbacks passed as props. This makes data changes traceable.

### [basic] Why do lists need keys? Can I use the index?
Keys let React match old and new elements during reconciliation, so it can reuse, move or remove DOM nodes and preserve state correctly. Use a stable unique id from your data. Index keys are only safe for static lists that never reorder, filter or insert. With index keys, inputs and component state can jump to the wrong row.

¦¦¦jsx
{todos.map(t => <TodoItem key={t.id} todo={t} />)}
¦¦¦

### [basic] Controlled vs uncontrolled components.
Controlled: React state is the single source of truth (¦value={text} onChange={…}¦). Easy validation and formatting, but re-renders on every keystroke. Uncontrolled: the DOM holds the value and you read it with a ref or on submit (¦defaultValue¦, ¦FormData¦). Less code and fewer renders; libraries such as React Hook Form use uncontrolled inputs for performance.

### [basic] Why does state not update immediately after setState? What are functional updates?
State updates are **scheduled and batched**. Inside the same render the variable keeps its old value. If the next state depends on the previous one, pass a function so React gives you the latest value.

¦¦¦jsx
setCount(count + 1);
setCount(count + 1);          // still +1 total
setCount(c => c + 1);
setCount(c => c + 1);         // +2 total
¦¦¦

### [basic] Explain useEffect: dependencies, cleanup and when it runs.
¦useEffect¦ runs **after** the browser has painted, for synchronising with outside systems (network, subscriptions, timers, DOM APIs). The dependency array lists the reactive values the effect uses: ¦[]¦ runs after mount only, no array runs after every render. The returned function is cleanup and runs before the next effect and on unmount.

¦¦¦jsx
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, [tick]);
¦¦¦

> Interview tip: mention "You might not need an effect": derive values during render, handle user actions in event handlers, and use keys to reset state instead of effects.

### [basic] Prop drilling vs lifting state vs context. When do you choose which?
Lift state to the nearest common parent when two siblings need it. If many levels pass it through, consider **composition** (pass components as children) first, then Context for truly global, rarely changing values (theme, locale, current user), and a state library for frequently changing shared state.

### [basic] Conditional rendering pitfalls.
¦{items.length && <List />}¦ renders ¦0¦ when empty. Use ¦{items.length > 0 && …}¦ or a ternary. Returning ¦null¦ renders nothing. Early returns keep JSX flat:
¦¦¦jsx
if (isLoading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
return <Table rows={data} />;
¦¦¦

### [intermediate] How does reconciliation work and what triggers a re-render?
After a state change React re-runs the component function and compares the new element tree with the old one. Rules of the diff: different element **type** means replace the subtree; same type means update props; **keys** match children in lists. A component re-renders when its own state changes, when its parent re-renders (even if props are the same, unless memoised), or when a context it reads changes. Re-render is not the same as DOM update: React only touches the DOM if output changed.

### [intermediate] useRef vs useState. When do you use a ref?
¦useRef¦ stores a mutable value that persists across renders **without causing a re-render**. Use it for DOM access (focus, scroll, measure), timer ids, previous values, and latest-callback patterns. If the value affects what is displayed, it must be state.

¦¦¦jsx
const inputRef = useRef(null);
useEffect(() => inputRef.current?.focus(), []);
¦¦¦

### [intermediate] useMemo vs useCallback vs React.memo. When should you not use them?
- ¦React.memo(Component)¦ skips re-rendering when props are shallow-equal.
- ¦useMemo(() => compute(), deps)¦ caches a **value** (expensive calculation or a stable object reference).
- ¦useCallback(fn, deps)¦ caches a **function** reference (¦useMemo(() => fn)¦).

They only help when a memoised child receives stable props, or a calculation is truly expensive. Wrapping everything adds memory and complexity and can hide the real problem. Profile first. The React Compiler can add much of this automatically.

### [intermediate] useReducer vs useState.
Use ¦useReducer¦ when state is an object with multiple related fields, transitions follow rules, or next state depends on actions (forms, wizards, undo). It centralises logic in a pure reducer that is easy to test and share via context.

¦¦¦jsx
function reducer(state, action) {
  switch (action.type) {
    case 'add': return { ...state, items: [...state.items, action.item] };
    case 'clear': return { ...state, items: [] };
    default: return state;
  }
}
const [state, dispatch] = useReducer(reducer, { items: [] });
¦¦¦

### [intermediate] What are the pitfalls of Context and how do you avoid them?
Every component that reads a context re-renders when the provided value changes. Passing an inline object (¦value={{ user, setUser }}¦) creates a new value on every render. Mitigate: memoise the value with ¦useMemo¦, split contexts (state vs dispatch, or by domain), keep fast-changing state out of context, and use a selector-based store (Zustand, Redux, ¦use-context-selector¦) for large shared state.

### [intermediate] Write a custom hook. Why use them?
Custom hooks extract reusable stateful logic with its own state and effects while keeping components small and testable.

¦¦¦jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
¦¦¦
Rules of hooks: call hooks only at the top level and only from components or other hooks, so React can match them by call order.

### [intermediate] How do you fetch data in React? Why use React Query?
Fetching in ¦useEffect¦ needs loading/error state, cancellation, race-condition handling, caching and refetching, which you rebuild in every component. **TanStack Query** (or SWR) treats it as **server state**: caching by query key, deduplication, background refetch (stale-while-revalidate), retries, pagination, mutations with invalidation and optimistic updates. Use effects only for simple one-off cases. In frameworks like Next.js or React Router, loaders and Server Components can fetch before render.

### [intermediate] Redux vs Context vs Zustand. How does Redux Toolkit work?
Decide by the kind of state: local UI state → ¦useState¦; shared UI state → Context or Zustand; server data → React Query; URL state → router; complex, cross-feature client state with tooling needs → Redux Toolkit. **RTK** flow: ¦createSlice¦ defines reducers (Immer lets you "mutate" safely) and actions, ¦configureStore¦ builds the store, components read with ¦useSelector¦ and send ¦dispatch(action)¦. RTK Query adds data fetching and caching.

### [intermediate] How do you do code splitting in React?
Use ¦React.lazy¦ and ¦Suspense¦ with dynamic ¦import()¦, mostly **per route** and for heavy, rarely used components (charts, editors, PDF viewers).

¦¦¦jsx
const Reports = lazy(() => import('./pages/Reports'));
<Suspense fallback={<PageSkeleton />}>
  <Routes><Route path="/reports" element={<Reports />} /></Routes>
</Suspense>
¦¦¦
Also split vendor chunks, analyse with ¦vite-bundle-visualizer¦ or webpack-bundle-analyzer, prefetch likely next routes, and lazy-load below-the-fold images.

### [intermediate] What are error boundaries?
A class component with ¦getDerivedStateFromError¦ / ¦componentDidCatch¦ that catches errors thrown while **rendering** its children and shows a fallback. It does not catch event handler, async or server errors. Use ¦react-error-boundary¦ for a hooks-friendly API and log errors to a service such as Sentry. Place boundaries around routes and risky widgets so one failure does not blank the whole app.

### [intermediate] How do you build forms with React Hook Form and validation?
React Hook Form registers uncontrolled inputs, so typing does not re-render the whole form. Pair it with a ¦zodResolver¦ to validate and get inferred types.

¦¦¦tsx
const schema = z.object({ email: z.string().email(), age: z.coerce.number().min(18) });
type Form = z.infer<typeof schema>;
const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });
<form onSubmit={handleSubmit(save)}>
  <input {...register('email')} aria-invalid={!!errors.email} />
  {errors.email && <p role="alert">{errors.email.message}</p>}
</form>
¦¦¦

### [intermediate] What are portals, forwardRef and compound components?
**Portals** (¦createPortal¦) render children into another DOM node (modals, tooltips) while keeping React event bubbling. **Refs**: in React 19 ¦ref¦ is a normal prop for function components; earlier you needed ¦forwardRef¦. **Compound components** (¦<Tabs><Tabs.List/><Tabs.Panel/></Tabs>¦) share implicit state through context, giving a flexible, readable API for design systems.

### [intermediate] What does StrictMode do?
In development it renders components and runs effects **twice** (mount → unmount → mount) to expose impure render logic and missing cleanup. It does not affect production. If double effects break your code (duplicate requests, double subscriptions), the effect lacks proper cleanup or should be moved out of an effect.

### [intermediate] How do you find and fix performance problems in React?
1. Measure with React DevTools **Profiler** (what rendered and why) and the browser Performance panel; check Web Vitals.
2. Typical causes: state held too high (moves whole tree), unstable props to memoised children, heavy calculations in render, long lists, large bundles, context value churn, layout thrash.
3. Fixes: move state down or split components, ¦React.memo¦ + stable props, ¦useMemo¦ for heavy work, virtualise lists (¦react-window¦, ¦TanStack Virtual¦), debounce inputs, ¦useTransition¦ for non-urgent updates, code-split, optimise images.
4. Verify improvement with the same measurement.

### [intermediate] How do you test React components?
Use Vitest or Jest with **React Testing Library**: render the component, interact like a user (¦user-event¦), and assert on what appears (¦getByRole¦, ¦findByText¦). Mock network with **MSW**, not by mocking fetch internals. Test behaviour, not implementation details like state variable names. Add a few end-to-end tests with Playwright or Cypress for critical flows (login, checkout, enrolment).

### [intermediate] How do you make React apps accessible?
Use semantic elements (button, nav, main, label) before ARIA; ensure keyboard access and visible focus; manage focus on route change and in modals (trap and restore); provide labels and error messages tied to inputs; meet colour contrast; support screen readers with ¦aria-live¦ for async updates; test with axe and eslint-plugin-jsx-a11y plus manual keyboard and screen reader checks. For healthcare/education products, WCAG 2.1 AA is usually the target.

### [intermediate] How do you implement protected routes and authentication in an SPA?
Keep auth state (user, roles) in a context or store loaded from a ¦/me¦ endpoint. A route wrapper redirects unauthenticated users to login and preserves the target URL. Store tokens in **HttpOnly, Secure, SameSite cookies** rather than ¦localStorage¦ (XSS can read it). Use short-lived access tokens with refresh, handle 401 globally with an Axios/fetch interceptor, and always enforce authorisation on the server; hiding UI is not security.

### [intermediate] How would you design a reusable component library? (Your resume headline)
- **API first**: small, composable components; consistent props (¦variant¦, ¦size¦, ¦disabled¦); support ¦className¦, ¦ref¦ and native attributes; prefer composition over many boolean props.
- **Foundation**: design tokens (colour, spacing, type) via CSS variables for theming and dark mode; headless primitives (Radix, Headless UI) for accessibility.
- **Quality**: TypeScript types, Storybook docs, unit and accessibility tests, visual regression (Chromatic).
- **Delivery**: package in a monorepo, semantic versioning, changelog, tree-shakeable ESM build, migration guides for breaking changes.
- **Adoption**: pair with product teams, track usage, review contributions. Quote the outcome from your resume: new screens needed about 35% less effort.

### [advanced] What are concurrent features? useTransition vs useDeferredValue.
React 18 can interrupt low-priority renders to keep the UI responsive. ¦startTransition¦/¦useTransition¦ marks a state update as non-urgent (filtering a big list) so typing stays instant. ¦useDeferredValue¦ gives you a lagging copy of a value, useful when you cannot control where the update starts.

¦¦¦jsx
const [isPending, startTransition] = useTransition();
function onChange(e) {
  setText(e.target.value);                      // urgent
  startTransition(() => setFilter(e.target.value)); // can wait
}
¦¦¦

### [advanced] What is new in React 19?
- **Actions**: async functions passed to ¦<form action={fn}>¦ or transitions, with built-in pending, error and optimistic handling.
- **useActionState** (form state), **useFormStatus**, **useOptimistic**.
- **use()** reads a promise or context during render (works with Suspense).
- **ref as a prop** (no ¦forwardRef¦ for function components) and cleanup functions for refs.
- Document metadata (¦<title>¦, ¦<meta>¦) rendered from components, improved resource preloading, better hydration errors, and ¦<Context>¦ usable as a provider.
- Server Components and Server Actions are stable for frameworks that support them.

### [advanced] Server Components vs Client Components vs SSR. What is hydration?
**SSR** renders HTML on the server for first paint, then the browser downloads JS and **hydrates** (attaches event handlers). **Server Components** run only on the server, can read databases directly, send no component JS to the browser and can stream. **Client Components** (¦'use client'¦) run in the browser and hold interactivity and state. Hydration mismatches occur when server HTML differs from the first client render (dates, ¦Math.random¦, ¦window¦ checks); fix by rendering the same output first and updating in an effect.

### [advanced] CSR vs SSR vs SSG vs ISR. How do you choose?
| Strategy | Good for | Trade-off |
|---|---|---|
| CSR | Dashboards behind login | Slow first paint, weak SEO |
| SSR | Personalised or fresh pages needing SEO | Server cost per request |
| SSG | Marketing and docs | Rebuild to change content |
| ISR | Mostly static with periodic updates | Cache invalidation complexity |

For a login-only healthcare learning app, CSR plus good caching and code splitting is usually enough; public catalogue pages benefit from SSR or SSG.

### [advanced] How does the React Compiler change memoisation?
The compiler analyses components at build time and inserts memoisation automatically, so most manual ¦useMemo¦, ¦useCallback¦ and ¦React.memo¦ become unnecessary. Code must follow the Rules of React (pure render, no mutation). Adopt incrementally, keep the ESLint plugin on, and still profile.

### [advanced] How do you handle very large lists or tables?
Virtualise (render only visible rows) with ¦react-window¦ or ¦TanStack Virtual¦, paginate or infinite-scroll from the server, keep row components memoised with stable props, avoid per-row inline objects, debounce filters, and move sorting/filtering to the server for large data. Check accessibility: announce row counts and keep keyboard navigation working.

### [advanced] Monorepo vs micro-frontends. When would you choose each?
A **monorepo** (Nx, Turborepo, pnpm workspaces) shares code, tooling and versions across apps and libraries; it is the right default for one product team or a small number of teams. **Micro-frontends** (module federation, iframes, web components) split a large product by team with independent deployment but add runtime complexity, duplicate dependencies and UX consistency risk. Choose micro-frontends only when team autonomy and independent release cycles clearly outweigh that cost.

### [advanced] How do you avoid state-related bugs in complex UIs?
Keep one source of truth, derive everything else during render, use reducers or state machines (XState) for flows with many modes instead of many booleans, normalise server data, colocate state with where it is used, and write tests for reducers/selectors. Typed discriminated unions model states like ¦idle | loading | success | error¦ without impossible combinations.

### [advanced] How do you secure a React application?
React escapes text by default, so XSS mostly appears through ¦dangerouslySetInnerHTML¦, unsafe URLs (¦javascript:¦) and third-party scripts. Sanitise HTML (DOMPurify), set a strict CSP, keep tokens in HttpOnly cookies, protect against CSRF (SameSite, tokens), audit dependencies (¦npm audit¦, Dependabot), avoid exposing secrets in the bundle (every ¦VITE_¦ or ¦NEXT_PUBLIC_¦ variable is public), and enforce permissions on the server.

## EXERCISES

### [basic] Fix the stale counter
This counter increases by only 1 when clicked once. Make it increase by 3.
¦¦¦jsx
function Counter() {
  const [n, setN] = useState(0);
  const addThree = () => { setN(n + 1); setN(n + 1); setN(n + 1); };
  return <button onClick={addThree}>{n}</button>;
}
¦¦¦
--- solution ---
¦¦¦jsx
const addThree = () => {
  setN(c => c + 1);
  setN(c => c + 1);
  setN(c => c + 1);
};
¦¦¦
All three calls read the same ¦n¦ from that render. Functional updates read the latest queued value.

### [basic] Todo list with add, toggle and remove
Build a ¦TodoApp¦ using ¦useState¦. Items need stable ids and must not mutate state.
--- solution ---
¦¦¦jsx
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  const add = e => {
    e.preventDefault();
    if (!text.trim()) return;
    setTodos(t => [...t, { id: crypto.randomUUID(), text, done: false }]);
    setText('');
  };
  const toggle = id => setTodos(t => t.map(x => (x.id === id ? { ...x, done: !x.done } : x)));
  const remove = id => setTodos(t => t.filter(x => x.id !== id));

  return (
    <>
      <form onSubmit={add}>
        <input value={text} onChange={e => setText(e.target.value)} aria-label="New todo" />
        <button>Add</button>
      </form>
      <ul>
        {todos.map(t => (
          <li key={t.id}>
            <label>
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
              <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
            </label>
            <button onClick={() => remove(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
}
¦¦¦
Talking points: keys, immutable updates, controlled input, label for accessibility.

### [intermediate] Fix the infinite render loop
This component keeps re-rendering. Why, and how do you fix it?
¦¦¦jsx
function Results({ query }) {
  const [filters, setFilters] = useState({ page: 1 });
  useEffect(() => {
    setFilters({ page: 1, query });
  }, [filters, query]);
  return <List filters={filters} />;
}
¦¦¦
> Hint: What changes every time ¦setFilters¦ runs?
--- solution ---
The effect depends on ¦filters¦ and also sets ¦filters¦ to a new object, so each run triggers another run. The effect is also unnecessary: ¦filters¦ can be derived during render.
¦¦¦jsx
function Results({ query }) {
  const filters = useMemo(() => ({ page: 1, query }), [query]);
  return <List filters={filters} />;
}
¦¦¦
Rule: do not synchronise state from props in an effect; derive it or reset with a ¦key¦.

### [intermediate] Build useDebounce and a search box
Use a debounced value to call an API only after the user stops typing for 400 ms.
--- solution ---
¦¦¦jsx
function useDebounce(value, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

function Search() {
  const [q, setQ] = useState('');
  const debounced = useDebounce(q);
  const { data, isLoading } = useQuery({
    queryKey: ['courses', debounced],
    queryFn: () => fetch('/api/courses?q=' + encodeURIComponent(debounced)).then(r => r.json()),
    enabled: debounced.length > 1,
  });
  return (
    <>
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search courses" />
      {isLoading ? 'Loading…' : data?.map(c => <p key={c.id}>{c.title}</p>)}
    </>
  );
}
¦¦¦
Because the query key changes with the debounced value, React Query cancels and caches results per term.

### [intermediate] Write a useFetch hook with cancellation
Return ¦{ data, error, loading }¦, cancel on unmount or URL change and ignore aborted requests.
--- solution ---
¦¦¦jsx
function useFetch(url) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  useEffect(() => {
    const controller = new AbortController();
    setState(s => ({ ...s, loading: true, error: null }));
    fetch(url, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(data => setState({ data, error: null, loading: false }))
      .catch(error => { if (error.name !== 'AbortError') setState({ data: null, error, loading: false }); });
    return () => controller.abort();
  }, [url]);
  return state;
}
¦¦¦
Mention that this still lacks caching, retries and deduplication, which is why you would use React Query in a real app.

### [intermediate] Write a useLocalStorage hook
It should behave like ¦useState¦, read the initial value lazily and handle JSON errors.
--- solution ---
¦¦¦jsx
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initial;
    } catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}
¦¦¦
Edge cases to mention: SSR (no ¦localStorage¦), syncing across tabs with the ¦storage¦ event, and storing sensitive data (do not).

### [intermediate] Accordion as a compound component
Create ¦<Accordion>¦ and ¦<Accordion.Item id title>¦ where only one item is open and the button has correct ARIA attributes.
--- solution ---
¦¦¦jsx
const AccordionContext = createContext(null);

function Accordion({ children }) {
  const [open, setOpen] = useState(null);
  const toggle = id => setOpen(o => (o === id ? null : id));
  const value = useMemo(() => ({ open, toggle }), [open]);
  return <AccordionContext.Provider value={value}>{children}</AccordionContext.Provider>;
}

function Item({ id, title, children }) {
  const { open, toggle } = useContext(AccordionContext);
  const isOpen = open === id;
  return (
    <div>
      <button aria-expanded={isOpen} aria-controls={'panel-' + id} onClick={() => toggle(id)}>{title}</button>
      {isOpen && <div id={'panel-' + id} role="region">{children}</div>}
    </div>
  );
}
Accordion.Item = Item;
¦¦¦
This shows the pattern behind design-system components like Tabs, Menu and Select.

### [advanced] Infinite scroll with IntersectionObserver
Load the next page when a sentinel element near the bottom becomes visible. Avoid duplicate loads.
--- solution ---
¦¦¦jsx
function useInfiniteScroll(onLoadMore, enabled) {
  const sentinel = useRef(null);
  useEffect(() => {
    if (!enabled || !sentinel.current) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onLoadMore();
    }, { rootMargin: '200px' });
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [onLoadMore, enabled]);
  return sentinel;
}

function Feed() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({ /* ... */ });
  const ref = useInfiniteScroll(fetchNextPage, hasNextPage && !isFetchingNextPage);
  return (<>{data.pages.flat().map(i => <Card key={i.id} {...i} />)}<div ref={ref} /></>);
}
¦¦¦
The ¦enabled¦ flag prevents repeated calls while a page is loading. For very long feeds combine this with virtualisation.

### [advanced] Make a slow list fast
A list of 5 000 rows re-renders fully whenever the parent state (a search box) changes. Fix it.
¦¦¦jsx
function Page({ rows }) {
  const [q, setQ] = useState('');
  return (<>
    <input value={q} onChange={e => setQ(e.target.value)} />
    {rows.map(r => <Row key={r.id} row={r} onSelect={() => select(r.id)} />)}
  </>);
}
¦¦¦
> Hint: Stable props, memoised rows, and consider not rendering 5 000 rows at all.
--- solution ---
¦¦¦jsx
const Row = memo(function Row({ row, onSelect }) {
  return <div onClick={() => onSelect(row.id)}>{row.name}</div>;
});

function Page({ rows }) {
  const [q, setQ] = useState('');
  const deferredQ = useDeferredValue(q);
  const onSelect = useCallback(id => select(id), []);
  const visible = useMemo(
    () => rows.filter(r => r.name.toLowerCase().includes(deferredQ.toLowerCase())),
    [rows, deferredQ]
  );
  return (<>
    <input value={q} onChange={e => setQ(e.target.value)} />
    <VirtualList items={visible} renderRow={r => <Row key={r.id} row={r} onSelect={onSelect} />} />
  </>);
}
¦¦¦
Steps to explain: (1) measure with Profiler, (2) memo rows and stable callbacks, (3) filter with a deferred value so typing stays responsive, (4) virtualise so only ~20 DOM rows exist. Memoisation alone does not fix 5 000 DOM nodes.

### [advanced] Optimistic update with rollback
When a user toggles a lesson as complete, update the UI immediately and roll back if the request fails (React Query).
--- solution ---
¦¦¦jsx
const qc = useQueryClient();
const toggle = useMutation({
  mutationFn: id => api.toggleLesson(id),
  onMutate: async id => {
    await qc.cancelQueries({ queryKey: ['lessons'] });
    const previous = qc.getQueryData(['lessons']);
    qc.setQueryData(['lessons'], old => old.map(l => (l.id === id ? { ...l, done: !l.done } : l)));
    return { previous };
  },
  onError: (_err, _id, ctx) => qc.setQueryData(['lessons'], ctx.previous),
  onSettled: () => qc.invalidateQueries({ queryKey: ['lessons'] }),
});
¦¦¦
In React 19 the same idea is available with ¦useOptimistic¦ inside form Actions.

## SCENARIOS

### Tell me about the reusable component library you built. What decisions did you make and what was the result?
Use a STAR structure. **Situation**: many screens re-implemented tables, forms and dialogs, causing inconsistent UI and slow delivery. **Action**: you defined shared components with typed props, tokens for theming, accessibility defaults, documentation and examples; agreed contribution rules; reviewed usage. **Result**: new screens needed about 35% less effort and UI behaviour stayed consistent (use your real numbers). Be ready for follow-ups: how you handled breaking changes, versioning, and teams that wanted custom behaviour.

### A page in your product loads slowly on hospital networks. Walk me through your plan.
Measure Web Vitals on a throttled network; inspect bundle size and waterfall. Code-split by route, lazy-load heavy widgets, compress and size images, cache API calls with React Query, prefetch next likely routes, reduce render work with memoised rows and virtualised lists, and set a performance budget in CI. Mention that you reported before/after numbers such as the 30–40% improvement.

### How do you decide on state management for a new large React application?
Classify state: server state (React Query), URL state (router), form state (React Hook Form), local UI state (¦useState¦), and truly global client state (small Zustand store or Redux Toolkit if the team needs devtools, middleware and strict patterns). Avoid putting server data into Redux. Keep the decision recorded in an ADR and revisit if pain appears.

### You inherit a codebase with class components, prop drilling everywhere and no tests. What do you do first?
Do not rewrite. Add tests around critical flows first, set up lint and type-checking, then refactor opportunistically: new code in function components and hooks, extract custom hooks, introduce React Query for data, and replace prop drilling with composition or context where it hurts. Track progress with small milestones and communicate the benefits (fewer bugs, faster features).

### As a lead, how do you run code reviews and mentor developers on React?
Define a PR checklist: correctness, hooks rules, state placement, accessibility, tests, naming, bundle impact. Review for learning: ask questions, share links and small examples, praise good solutions. Pair on tricky features, hold short knowledge-sharing sessions (rendering, memoisation, testing) and keep shared lint rules so style issues are automated. Share an example where mentoring improved a junior's output.

### Your app must meet accessibility requirements for clinicians who use keyboards and screen readers. How do you approach it?
Start with semantic HTML and a component library that bakes in accessible patterns (focus trap in dialogs, labelled inputs, keyboard navigation). Add automated checks (axe in CI, ESLint a11y plugin), manual testing with keyboard and a screen reader, colour contrast checks, and include accessibility in the definition of done. Track issues like any other bug.
`;
