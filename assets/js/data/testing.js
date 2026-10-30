window.PREP = window.PREP || {};
window.PREP.testing = String.raw`
@title Testing
@icon atom
@tagline How to prove your code works: unit, integration and end-to-end tests, Jest/Vitest, React Testing Library, Supertest, Cypress/Playwright, and how a lead keeps a team's tests fast and trustworthy.
@resume Quality of the Clinical Learning Hub releases | Code reviews for a team of 8–10 engineers | Verifying AI-generated code from Copilot, ChatGPT and Claude | CI/CD pipelines (CodePipeline, Jenkins, Octopus)

## ROADMAP

### Phase 1 · Foundations (Basic)
- Why we test: confidence, regression safety, design feedback :: Be able to say what a test buys you besides "finding bugs".
- Testing pyramid and testing trophy :: Know which kinds of tests are cheap, which are expensive, and where most of yours should live.
- Unit vs integration vs end-to-end tests :: Give one Clinical Learning Hub example of each.
- Anatomy of a good test: Arrange-Act-Assert, naming, one reason to fail :: Rewrite a vague test name into a behaviour sentence.
- TDD: red, green, refactor :: Walk through one small feature test-first.
- Test doubles: dummy, stub, spy, mock, fake :: Know the five words and pick the right one for an email service.
- Jest and Vitest basics: describe/it, matchers, hooks :: Know toBe vs toEqual, beforeEach, and test isolation.
- Async testing: promises, async/await, fake timers :: Never forget to await, return or use resolves/rejects.
- Mocking modules, fetch and HTTP (vi.fn, jest.mock, MSW) :: Mock at the network boundary, not inside your own code.
- Test data: factories and builders instead of giant fixtures :: Build only the fields a test cares about.
- Code coverage: what the percentage does and does not tell you :: Coverage finds untested code; it cannot prove tested code is correct.
- Testing pitfalls: implementation details, shared state, over-mocking :: Recognise the three smells in a code review.

### Phase 2 · Practical testing in your stack (Intermediate)
- React Testing Library: queries by role, accessibility-first :: Prefer getByRole and getByLabelText over test ids.
- user-event: testing clicks, typing and forms :: Test what a person does, not what a handler is called.
- Testing custom hooks and context providers :: Use renderHook and wrap with the real provider.
- Testing data-fetching components: loading, error, empty and success :: Always cover all four states.
- Snapshot testing: when it helps and when it hurts :: Use small, intentional snapshots; avoid giant component dumps.
- Testing Express APIs with Supertest :: Test status, body and headers without starting a real port.
- Testing database code: test DB, transaction rollback, Sequelize :: Keep tests isolated and fast with rollback or a clean schema.
- Testing authentication, authorisation and error paths :: Test the 401, 403, 404 and 500 paths, not only the happy path.
- Contract testing and API schema validation :: Explain how a consumer-driven contract prevents breaking an API.
- Accessibility testing with jest-axe and axe-core :: Automate the checkable 30-40%, review the rest manually.
- Flaky tests: causes and fixes :: List five causes: time, order, shared state, network, async races.
- Testing in CI: parallelism, retries, quality gates :: Retries hide problems; use them with reporting, not as a fix.

### Phase 3 · Advanced and lead level
- End-to-end testing with Cypress and Playwright :: Know what to cover with E2E (critical journeys) and what not to.
- Stable E2E selectors, waits and test isolation :: Use role/test-id selectors, auto-waiting and API-seeded data.
- Visual regression testing :: Know the trade-off: catches CSS regressions, produces noisy diffs.
- Property-based testing :: Describe a property instead of examples; understand shrinking.
- Mutation testing: testing your tests :: Explain how surviving mutants reveal weak assertions.
- Performance and load testing basics (k6) :: Know p95 latency, throughput, and what a smoke vs load vs stress test is.
- Testing legacy code: characterisation tests and seams :: Pin down current behaviour before you change anything.
- Testing AI-generated code: verify, do not trust :: Treat AI output as a draft; tests are your proof.
- Reviewing tests in a code review :: Have a checklist for names, assertions, isolation and speed.
- Test strategy for a team of 8–10: ownership, budgets, definition of done :: Set rules the whole team follows.

## QA

### [basic] Why do we write tests, and what makes a test valuable?
Tests give you **confidence to change code**: they catch regressions, document behaviour with examples, and push you toward smaller, loosely coupled designs (hard-to-test code is usually badly structured). A valuable test is **fast, deterministic, isolated, readable, and fails for one clear reason**. It checks *behaviour that matters to users or callers* rather than how the code is written inside. A test that breaks every time you refactor, or passes while the feature is broken, has negative value.

### [basic] Explain the testing pyramid and the testing trophy.
The **pyramid** says: many fast unit tests at the base, fewer integration tests in the middle, and very few slow end-to-end (E2E) tests at the top, because cost and flakiness grow as you go up. The **trophy** (popularised by Kent C. Dodds) argues the best return is on **integration tests**: static checks (TypeScript, ESLint) as the base, a few unit tests, mostly integration tests that exercise several modules together as a user would, and a small top of E2E. For a React and Node team, a practical mix is: TypeScript + lint, unit tests for pure logic, component and API integration tests for most features, and E2E only for critical journeys such as login and enrolment.

### [basic] What is the difference between unit, integration and end-to-end tests?
- **Unit**: one function or class in isolation; collaborators are doubled. Example: ¦calculateCompletion(modules)¦ returns 75.
- **Integration**: several real pieces together, such as a React form with its validation and a mocked network, or an Express route with the real service layer and a test database.
- **End-to-end**: the whole system through the real UI in a real browser against a deployed or local stack, for example log in, enrol on a course, see it on the dashboard.

Lower levels are faster and pinpoint failures; higher levels give more realism but are slower and flakier.

### [basic] What is Arrange-Act-Assert and what does a good test name look like?
**Arrange** the data and collaborators, **Act** by calling the code once, **Assert** the outcome. Keep each part visible, with a blank line between them. Name tests as behaviour sentences: ¦rejects enrolment when the course is full¦, not ¦test1¦ or ¦enrolService works¦. A good test has one reason to fail, so avoid ten unrelated asserts in one test. When it fails in CI the name alone should tell you what broke.

### [basic] Explain TDD (red, green, refactor).
1. **Red**: write a small failing test for the next behaviour (and see it fail for the right reason).
2. **Green**: write the simplest code that makes it pass.
3. **Refactor**: clean up the code and tests while the suite stays green.

Benefits: you design the API from the caller's side, you get tests for free, and you only write code that is needed. Limits: it is slower for exploratory work or UI layout, so use it where logic is clear (business rules, utilities, API handlers). Honest answer: use TDD for rules-heavy code, and write tests right after for exploratory code.

### [basic] Dummy, stub, spy, mock, fake: what is the difference?
- **Dummy**: passed to satisfy a parameter but never used.
- **Stub**: returns canned answers (¦getCourse()¦ always returns course 7).
- **Spy**: wraps a real or fake function and records how it was called.
- **Mock**: a spy with built-in expectations about calls; in Jest/Vitest ¦vi.fn()¦ plays spy and stub roles.
- **Fake**: a working lightweight implementation, such as an in-memory repository.

Prefer stubs and fakes that check *outcomes*; use spies/mocks for *interactions that are the outcome*, for example "an email was sent once".

### [basic] How do you test async code, and what are the usual mistakes?
Make the test return or await the promise: ¦test('loads', async () => { await expect(load()).resolves.toEqual(x); })¦. Common mistakes: forgetting ¦await¦ so the test passes before the assertion runs; using ¦done¦ callbacks with promises; leaving timers or open handles; asserting inside a ¦.then¦ that is never awaited. For timers use **fake timers** (¦vi.useFakeTimers()¦) and advance time explicitly instead of sleeping. For UI use ¦findBy¦ queries or ¦waitFor¦ for things that appear later.

### [basic] What does code coverage tell you, and what does it not?
Coverage reports which lines, branches and functions ran during tests. It is useful for **finding untested code**, especially error branches. It cannot tell you whether assertions are meaningful: a test that calls a function with no assertions gives 100% coverage and zero protection. Chasing a number (such as 90%) encourages low-value tests. Use coverage as a flashlight, set a sensible floor on **changed code** in CI, and use mutation testing or review to judge test quality.

### [basic] What is a flaky test and why is it harmful?
A test that sometimes passes and sometimes fails without any code change. Flaky tests destroy trust: people re-run until green, ignore real failures and stop trusting CI. Causes include real time and randomness, test-order dependence, shared state or data, unawaited async work, network calls, animations and race conditions. Treat flakiness as a bug: quarantine it quickly, find the cause, fix it, and track a flake rate.

### [basic] How do you test code that uses the current time or randomness?
Inject the dependency instead of reaching for globals. Pass a ¦clock¦ (¦{ now: () => Date.now() }¦) and a ¦random¦ or ¦idGenerator¦ function into the function or service, and use fixed values in tests. Or use the test framework's fake timers and system time (¦vi.setSystemTime(new Date('2025-01-01'))¦). For randomness, use a seeded generator so failures are reproducible.

### [intermediate] What is the guiding principle of React Testing Library?
"The more your tests resemble the way your software is used, the more confidence they can give you." You render the component, find elements the way a user or screen reader does (by role, label, text), interact with ¦user-event¦, and assert on what is visible. You do not read component state, call instance methods or check which hooks ran, so refactors do not break tests. This is different from Enzyme-style testing of internals.

### [intermediate] Why prefer getByRole over getByTestId?
¦getByRole('button', { name: /enrol/i })¦ proves the element has the right **role and accessible name**, so the test doubles as an accessibility check and survives markup changes. ¦data-testid¦ is invisible to users and passes even when the button is unlabeled or is a ¦div¦. Order of preference: ¦getByRole¦, ¦getByLabelText¦, ¦getByPlaceholderText¦, ¦getByText¦, ¦getByDisplayValue¦, then ¦getByTestId¦ only when nothing else works.

### [intermediate] What is the difference between getBy, queryBy and findBy?
¦getBy*¦ returns the element or throws immediately if absent (use for things that must be there). ¦queryBy*¦ returns ¦null¦ if absent (use to assert something is NOT there). ¦findBy*¦ is async: it waits (default about 1 second) for the element to appear, then returns it or rejects (use for results that appear after fetching). The ¦*AllBy*¦ variants return arrays.

### [intermediate] How do you test a component that fetches data?
Render it with a mocked network layer and cover four states: **loading**, **success**, **empty**, **error**. Use MSW (Mock Service Worker) to intercept requests at the network level so the component's real fetch code runs. Wrap with the providers it needs (React Query client, router) and make a fresh client per test to avoid cache leaks. Assert with ¦findBy¦ and ¦waitFor¦, and test the retry or error message path.

### [intermediate] When are snapshot tests a good idea?
Good for **small, stable, serialisable output**: an error message object, a generated config, an API response shape, or a tiny presentational component. Bad for large component trees, because the diff is noisy, people update snapshots without reading them, and the tests break on harmless markup changes. Use inline snapshots (¦toMatchInlineSnapshot¦) so the expected value is in the test, and review every snapshot change like code.

### [intermediate] jest.mock or MSW: how do you mock HTTP calls?
¦jest.mock('./api')¦ (or ¦vi.mock¦) replaces your own module, which is quick but couples tests to how you fetch, and can hide bugs in the real fetch code. **MSW** intercepts at the network level, so the real client code, headers, parsing and error handling are exercised, and the same handlers can be reused in Storybook and E2E. Rule of thumb: mock at the boundary you do not own (network, payment, email), not modules you wrote.

### [intermediate] How do you test an Express API with Supertest?
Export the Express ¦app¦ without calling ¦listen¦, then ¦request(app).post('/enrolments').send(body).expect(201)¦. Assert on status, headers and JSON body. Use a test database or fake repository, reset state in ¦beforeEach¦, and cover validation errors (400), auth failures (401/403), not found (404) and server errors (500, with an injected failing dependency). Add one test per rule, not one giant test per route.

### [intermediate] How do you test code that talks to the database (Sequelize)?
Options: (1) a real MySQL test database (Docker in CI) with migrations run once and **each test wrapped in a transaction that is rolled back**; (2) truncate tables between tests; (3) an in-memory fake repository for pure business logic. Prefer the real database for query, constraint and transaction behaviour, because SQLite or mocks differ from MySQL. Use factories to create data, and never share rows between tests. Keep a small number of such tests, since they are slower than unit tests.

### [intermediate] How do you test authentication and authorisation?
Test the matrix: no token (401), invalid or expired token (401), valid token with wrong role (403), valid token and correct role (200), plus access to **someone else's resource** (403 or 404). Generate tokens with a test helper, not by calling the real login each time. For frontend, test route guards and that protected UI is hidden or redirected. Include negative tests, since a missing permission check is invisible to happy-path tests.

### [intermediate] What is contract testing and why use it?
A **consumer-driven contract** (for example with Pact) records what a consumer (the React app) expects from a provider (the API): paths, parameters and response shape. The provider's pipeline verifies it can satisfy those contracts, so breaking changes are caught before deployment, without running both systems together. It is lighter than full E2E and ideal for teams who deploy services and frontends independently. Schema validation (OpenAPI, zod) checks shape at runtime or in tests.

### [intermediate] How do you test accessibility automatically, and what cannot be automated?
Use ¦jest-axe¦ in component tests and ¦axe-core¦ in Cypress/Playwright to catch missing labels, bad ARIA, contrast problems and duplicate ids. Also use ¦getByRole¦ queries, lint rules (¦eslint-plugin-jsx-a11y¦) and Lighthouse. Automation finds roughly a third of issues. Manual checks are still needed for keyboard flow, focus order, meaningful alt text, screen-reader announcements and zoom or reflow.

### [intermediate] What are the main causes of flaky tests and how do you fix them?
- **Time and randomness**: inject clocks, use fake timers, seed random.
- **Async races**: await the right thing; use ¦findBy¦ or auto-waiting; never ¦sleep(3000)¦.
- **Shared state or order dependence**: isolate data per test; reset mocks; run in random order to expose it.
- **Network and third parties**: stub with MSW or contract fakes.
- **Environment**: CPU contention, animations; disable animations, set fixed viewport, pin versions.

Process: reproduce by running in a loop, quarantine, fix the cause, add a regression guard.

### [intermediate] How do you set up tests in CI (parallelism, retries, quality gates)?
Run lint and type-check first (fast fail), then unit and integration tests in parallel shards, then E2E against a deployed preview. Cache dependencies, publish JUnit and coverage reports, and make the pipeline fail on test failure. **Quality gates**: no new failing tests, coverage on changed lines above a floor, no new lint errors. Retries (one at most) are acceptable for E2E only when failures are reported as flaky, never as a way to hide them.

### [advanced] Cypress or Playwright, and how do you write stable E2E tests?
Both are good. Playwright: multiple browsers and tabs, fast parallelism, auto-waiting, strong tracing. Cypress: great developer experience and time-travel debugging, runs inside the browser, historically single-tab. Stability rules: use **role or test-id selectors**, rely on **auto-waiting** and web-first assertions instead of fixed waits, **seed data through the API** rather than clicking through the UI, give each test its own user, keep tests independent, and cover only critical journeys (login, enrol, complete, certificate).

### [advanced] What is mutation testing and what is it for?
A tool (Stryker for JS) makes small changes to your code, called **mutants**, such as ¦>¦ to ¦>=¦, ¦&&¦ to ¦||¦ or removing a statement, then runs your tests. If tests still pass, the mutant **survived**, which means no test noticed that behaviour change. The **mutation score** is a better quality signal than line coverage. It is slow, so run it on critical modules or changed files, not the whole repo on every commit.

### [advanced] What is property-based testing? Give an example.
Instead of fixed examples you state a **property** that must hold for any input, and a library (fast-check) generates hundreds of random inputs, then **shrinks** a failing case to the smallest counterexample. Example property: for any list of numbers, ¦sort(sort(xs))¦ equals ¦sort(xs)¦ and has the same length. It finds edge cases you did not think of (empty arrays, negative numbers, unicode). Use it for parsers, formatters, serialisers and algorithms; combine with a few example tests for readability.

### [advanced] How do you add tests to legacy code with no safety net?
Write **characterisation tests**: call the code with real inputs, record what it does today (even if odd), and assert that. To make code testable, find **seams** where you can substitute behaviour without editing logic: inject a dependency, extract a pure function, or wrap a global. Make the smallest safe change, get it under test, then refactor. Prioritise code you are about to change and code that has a history of bugs. Keep tests at a coarse level first (API or UI level) before unit-level ones.

### [advanced] How do you verify AI-generated code and tests?
Treat AI output as an untrusted draft. Read it, run it, and write or review the **tests first**, since AI-written tests can assert the implementation instead of the requirement, or hard-code the same bug. Check that tests fail when behaviour is broken (mutate a line and see). Verify that APIs and options actually exist, review security and edge cases, and keep PRs small. Ask the model to list assumptions and edge cases, and add them as tests. You remain accountable for what is merged.

### [advanced] What do you look for when reviewing tests in a pull request?
- Does the name describe behaviour, and does it fail for one reason?
- Would it fail if the feature broke? (no weak assertions like ¦toBeTruthy¦ everywhere)
- Is it isolated (no order or shared data) and deterministic (no real time, network or random)?
- Does it test behaviour rather than implementation details?
- Is the setup minimal and readable (factories, no 200-line fixtures)?
- Are error paths and edge cases covered?
- Is it fast enough for the level it lives at?

### [advanced] How would you build a test strategy for a team of 8–10 engineers?
1. Agree a **definition of done** that includes tests at the right level for each change.
2. Choose tooling once (Vitest/Jest, RTL, MSW, Supertest, Playwright) and document patterns with examples.
3. Set a **test budget**: unit and integration run in under about 5 minutes; E2E under about 15, sharded in parallel.
4. Own flakiness: a visible dashboard, a rule to quarantine within a day, and a weekly fix slot.
5. Put quality gates in CI and review tests in PRs.
6. Teach through pairing and short sessions, and measure escaped defects and cycle time, not just coverage.

### [advanced] What are the basics of performance and visual regression testing?
**Load testing** with k6 or similar: define user flows, ramp virtual users, and measure **p95/p99 latency, throughput and error rate** against thresholds. Types: smoke (does it work under minimal load), load (expected traffic), stress (beyond capacity), soak (long duration). Run against a production-like environment, never production by accident. **Visual regression** (Playwright screenshots, Percy, Chromatic) compares screenshots of pages or components to baselines; it catches unintended CSS changes but needs stable fonts, data, viewport and masked dynamic regions to avoid noise.

## EXERCISES

### [basic] Build a tiny expect() assertion library
Write ¦expect(actual)¦ that returns an object with these matchers, plus a ¦.not¦ version of each. A failed assertion must **throw an Error**.

- ¦toBe(expected)¦ uses ¦Object.is¦ (so ¦NaN¦ equals ¦NaN¦ and ¦0¦ does not equal ¦-0¦)
- ¦toEqual(expected)¦ compares objects and arrays deeply
- ¦toThrow()¦ expects ¦actual¦ to be a function that throws
- ¦toContain(item)¦ works for arrays (¦===¦) and strings (substring)

¦¦¦js
expect(2 + 2).toBe(4);
expect({ a: [1, 2] }).toEqual({ a: [1, 2] });
expect(() => JSON.parse('{')).toThrow();
expect([1, 2, 3]).not.toContain(9);
¦¦¦
> Hint: Write one inner function that builds the matcher object for ¦not = false¦ or ¦not = true¦, then expose both.
--- solution ---
¦¦¦js
function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && deepEqual(a[k], b[k]));
}

function expect(actual) {
  function matchers(not) {
    function check(pass, message) {
      if (not ? pass : !pass) throw new Error(message);
    }
    const show = (v) => (typeof v === 'string' ? JSON.stringify(v) : String(v));
    return {
      toBe(expected) {
        check(Object.is(actual, expected), 'Expected ' + show(actual) + (not ? ' not' : '') + ' to be ' + show(expected));
      },
      toEqual(expected) {
        check(deepEqual(actual, expected), 'Expected ' + JSON.stringify(actual) + (not ? ' not' : '') + ' to equal ' + JSON.stringify(expected));
      },
      toThrow() {
        let threw = false;
        try { actual(); } catch (e) { threw = true; }
        check(threw, 'Expected function ' + (not ? 'not ' : '') + 'to throw');
      },
      toContain(item) {
        const has = typeof actual === 'string' ? actual.includes(item) : Array.isArray(actual) && actual.includes(item);
        check(has, 'Expected ' + show(actual) + (not ? ' not' : '') + ' to contain ' + show(item));
      },
    };
  }
  const api = matchers(false);
  api.not = matchers(true);
  return api;
}
¦¦¦
Key idea: the matcher body is written once and flipped by a ¦not¦ flag, which is exactly how Jest keeps ¦.not¦ cheap. Note ¦Object.is¦ semantics for ¦toBe¦, and that failures **throw**, because a test runner decides pass or fail by whether the test function throws.

--- starter ---
¦¦¦js
function expect(actual) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
test('toBe passes for equal primitives', () => {
  expect(2).toBe(2);
  expect('a').toBe('a');
});
test('toBe throws for different values', () => {
  throws(() => expect(2).toBe(3));
});
test('toBe uses Object.is semantics', () => {
  expect(NaN).toBe(NaN);
  throws(() => expect(0).toBe(-0));
});
test('toBe does not treat equal-looking objects as the same', () => {
  throws(() => expect({ a: 1 }).toBe({ a: 1 }));
});
test('toEqual compares deeply', () => {
  expect({ a: [1, { b: 2 }] }).toEqual({ a: [1, { b: 2 }] });
  throws(() => expect({ a: [1, { b: 2 }] }).toEqual({ a: [1, { b: 3 }] }));
  throws(() => expect([1, 2]).toEqual({ 0: 1, 1: 2 }));
});
test('toThrow detects a throwing function', () => {
  expect(() => { throw new Error('x'); }).toThrow();
  throws(() => expect(() => 1).toThrow());
});
test('toContain works on arrays and strings', () => {
  expect([1, 2, 3]).toContain(2);
  expect('learning hub').toContain('hub');
  throws(() => expect([1, 2, 3]).toContain(9));
});
test('.not flips every matcher', () => {
  expect(1).not.toBe(2);
  expect({ a: 1 }).not.toEqual({ a: 2 });
  expect(() => 1).not.toThrow();
  expect([1]).not.toContain(5);
  throws(() => expect(1).not.toBe(1));
  throws(() => expect([1]).not.toContain(1));
});
¦¦¦

### [basic] Find the bugs: applyDiscount
The function below should return the price after a percentage discount, **rounded to 2 decimals**. It should throw ¦TypeError¦ when the price is not a non-negative finite number and ¦RangeError¦ when the percent is not between 0 and 100. The hidden tests found that it misbehaves. Fix it.

¦¦¦js
applyDiscount(100, 10);   // 90
applyDiscount(19.99, 15); // 16.99
applyDiscount(50, 100);   // 0
applyDiscount(-5, 10);    // TypeError
applyDiscount(50, 101);   // RangeError
¦¦¦
> Hint: Check three things: floating-point rounding, input validation, and the boundaries 0 and 100.
--- solution ---
¦¦¦js
function applyDiscount(price, percent) {
  if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) {
    throw new TypeError('price must be a non-negative number');
  }
  if (typeof percent !== 'number' || !(percent >= 0 && percent <= 100)) {
    throw new RangeError('percent must be between 0 and 100');
  }
  // work in "cents * 100" so we round once, at the end
  return Math.round(price * (100 - percent)) / 100;
}
¦¦¦
The original code was ¦price - price * percent / 100¦: it never rounds (¦19.99 * 15%¦ gives ¦16.9915¦) and it accepts nonsense such as negative prices, ¦NaN¦ and percentages above 100. Lesson: tests that cover **boundaries and invalid input**, not only the happy path, are what exposed the bugs.

--- starter ---
¦¦¦js
function applyDiscount(price, percent) {
  return price - price * percent / 100;
}
¦¦¦
--- tests ---
¦¦¦js
test('applies a simple discount', () => {
  eq(applyDiscount(100, 10), 90);
});
test('rounds to two decimals', () => {
  eq(applyDiscount(19.99, 15), 16.99);
  eq(applyDiscount(10, 33), 6.7);
});
test('0 percent keeps the price, 100 percent makes it free', () => {
  eq(applyDiscount(42.5, 0), 42.5);
  eq(applyDiscount(50, 100), 0);
});
test('rejects invalid prices with TypeError', () => {
  [-5, NaN, Infinity, '10', null].forEach((p) => {
    let err;
    try { applyDiscount(p, 10); } catch (e) { err = e; }
    ok(err instanceof TypeError, 'price ' + String(p) + ' should throw TypeError');
  });
});
test('rejects invalid percentages with RangeError', () => {
  [-1, 101, NaN].forEach((pc) => {
    let err;
    try { applyDiscount(10, pc); } catch (e) { err = e; }
    ok(err instanceof RangeError, 'percent ' + String(pc) + ' should throw RangeError');
  });
});
¦¦¦

### [intermediate] Implement a spy: mockFn()
Write ¦mockFn(impl?)¦ that returns a function you can call like the original, and that also records usage, like ¦vi.fn()¦.

- ¦mock.calls¦ is an array of argument arrays, ¦mock.results¦ an array of returned values
- ¦mock.mockReturnValue(v)¦ makes every call return ¦v¦
- ¦mock.mockReturnValueOnce(v)¦ queues a value used by the next call only (first-in, first-out)
- ¦mock.mockImplementation(fn)¦ replaces the implementation
- ¦mock.calledWith(...args)¦ returns ¦true¦ if any recorded call had exactly those arguments (compare with ¦JSON.stringify¦)
- ¦mock.mockClear()¦ resets ¦calls¦ and ¦results¦ but keeps implementations; ¦mock.mockReset()¦ also clears implementations and queued values
- all of the ¦mock.mock*¦ setters return the mock so calls can be chained

> Hint: ¦mock¦ is a function declared inside ¦mockFn¦, so you can attach properties to it. Keep the current implementation and the "once" queue in closure variables.
--- solution ---
¦¦¦js
function mockFn(impl) {
  let implementation = impl;
  const onceQueue = [];

  function mock(...args) {
    mock.calls.push(args);
    const f = onceQueue.length ? onceQueue.shift() : implementation;
    const result = f ? f.apply(this, args) : undefined;
    mock.results.push(result);
    return result;
  }

  mock.calls = [];
  mock.results = [];
  mock.mockReturnValue = (v) => { implementation = () => v; return mock; };
  mock.mockReturnValueOnce = (v) => { onceQueue.push(() => v); return mock; };
  mock.mockImplementation = (fn) => { implementation = fn; return mock; };
  mock.calledWith = (...args) => mock.calls.some((c) => JSON.stringify(c) === JSON.stringify(args));
  mock.mockClear = () => { mock.calls.length = 0; mock.results.length = 0; return mock; };
  mock.mockReset = () => { mock.mockClear(); implementation = undefined; onceQueue.length = 0; return mock; };
  return mock;
}
¦¦¦
A spy is just a function with memory. ¦calls¦ lets you assert interactions (¦expect(sendEmail).toHaveBeenCalledWith(...)¦), and the queue of "once" values lets you script a service that fails first and succeeds second.

--- starter ---
¦¦¦js
function mockFn(impl) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
test('records calls and results', () => {
  const m = mockFn((a, b) => a + b);
  eq(m(1, 2), 3);
  eq(m(5, 5), 10);
  eq(m.calls, [[1, 2], [5, 5]]);
  eq(m.results, [3, 10]);
});
test('returns undefined without an implementation', () => {
  const m = mockFn();
  eq(m('x'), undefined);
  eq(m.calls.length, 1);
});
test('mockReturnValue', () => {
  const m = mockFn().mockReturnValue(7);
  eq(m(), 7);
  eq(m(), 7);
});
test('mockReturnValueOnce is used once, in order, then falls back', () => {
  const m = mockFn(() => 'default').mockReturnValueOnce('a').mockReturnValueOnce('b');
  eq([m(), m(), m()], ['a', 'b', 'default']);
});
test('mockImplementation replaces the implementation', () => {
  const m = mockFn(() => 1);
  m.mockImplementation((x) => x * 2);
  eq(m(21), 42);
});
test('calledWith checks exact arguments', () => {
  const m = mockFn();
  m('a', 1);
  ok(m.calledWith('a', 1));
  ok(!m.calledWith('a'));
  ok(!m.calledWith('b', 1));
});
test('mockClear keeps the implementation, mockReset drops it', () => {
  const m = mockFn(() => 5);
  m();
  m.mockClear();
  eq(m.calls, []);
  eq(m(), 5);
  m.mockReset();
  eq(m(), undefined);
  eq(m.calls.length, 1);
});
test('this is passed through', () => {
  const obj = { n: 3, get: mockFn(function () { return this.n; }) };
  eq(obj.get(), 3);
});
¦¦¦

### [intermediate] Build a fake clock (mini fake timers)
Write ¦createClock()¦ that returns a controllable replacement for the timer functions:

- ¦now()¦ returns the fake time in ms (starts at 0)
- ¦setTimeout(fn, ms)¦ and ¦setInterval(fn, ms)¦ return numeric ids; ¦clearTimeout(id)¦ and ¦clearInterval(id)¦ cancel them
- ¦advance(ms)¦ moves time forward and runs every due timer **in time order** (ties: the one created first). While a timer runs, ¦now()¦ returns the time it was scheduled for. Timers created inside a callback also run if they fall inside the window.
- ¦pending()¦ returns how many timers are still scheduled

> Hint: Keep a Map of timers with an ¦at¦ time. In ¦advance¦, repeatedly pick the earliest timer with ¦at <= end¦ until none is left, and set ¦now¦ to ¦end¦ at the finish.
--- solution ---
¦¦¦js
function createClock() {
  let time = 0;
  let nextId = 1;
  const timers = new Map();

  function add(fn, delay, interval) {
    const id = nextId++;
    timers.set(id, { id, fn, at: time + Math.max(0, delay || 0), interval });
    return id;
  }

  return {
    now: () => time,
    setTimeout: (fn, ms) => add(fn, ms, null),
    setInterval: (fn, ms) => add(fn, ms, Math.max(1, ms || 1)),
    clearTimeout: (id) => { timers.delete(id); },
    clearInterval: (id) => { timers.delete(id); },
    pending: () => timers.size,
    advance(ms) {
      const end = time + ms;
      for (;;) {
        let next = null;
        timers.forEach((t) => {
          if (t.at <= end && (!next || t.at < next.at || (t.at === next.at && t.id < next.id))) next = t;
        });
        if (!next) break;
        time = next.at;
        if (next.interval) next.at += next.interval;
        else timers.delete(next.id);
        next.fn();
      }
      time = end;
    },
  };
}
¦¦¦
This is the core of ¦vi.useFakeTimers()¦ and ¦jest.useFakeTimers()¦: time becomes data you control, so a "wait 5 seconds" test finishes in a millisecond and never flakes.

--- starter ---
¦¦¦js
function createClock() {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
test('now starts at 0 and advances', () => {
  const c = createClock();
  eq(c.now(), 0);
  c.advance(250);
  eq(c.now(), 250);
});
test('setTimeout fires only after its delay', () => {
  const c = createClock();
  const calls = [];
  c.setTimeout(() => calls.push('a'), 100);
  c.advance(99);
  eq(calls, []);
  c.advance(1);
  eq(calls, ['a']);
});
test('timers fire in time order, ties by creation order', () => {
  const c = createClock();
  const calls = [];
  c.setTimeout(() => calls.push('slow'), 300);
  c.setTimeout(() => calls.push('first'), 100);
  c.setTimeout(() => calls.push('second'), 100);
  c.advance(500);
  eq(calls, ['first', 'second', 'slow']);
});
test('now() inside a callback is the scheduled time', () => {
  const c = createClock();
  const seen = [];
  c.setTimeout(() => seen.push(c.now()), 120);
  c.advance(500);
  eq(seen, [120]);
  eq(c.now(), 500);
});
test('clearTimeout cancels a timer', () => {
  const c = createClock();
  let ran = false;
  const id = c.setTimeout(() => { ran = true; }, 50);
  c.clearTimeout(id);
  c.advance(100);
  eq(ran, false);
  eq(c.pending(), 0);
});
test('setInterval repeats until cleared', () => {
  const c = createClock();
  let n = 0;
  const id = c.setInterval(() => { n++; }, 100);
  c.advance(350);
  eq(n, 3);
  c.clearInterval(id);
  c.advance(1000);
  eq(n, 3);
});
test('timers created inside callbacks run within the same advance', () => {
  const c = createClock();
  const calls = [];
  c.setTimeout(() => {
    calls.push('outer');
    c.setTimeout(() => calls.push('inner'), 50);
  }, 100);
  c.advance(160);
  eq(calls, ['outer', 'inner']);
});
test('pending counts scheduled timers', () => {
  const c = createClock();
  c.setTimeout(() => {}, 10);
  c.setTimeout(() => {}, 20);
  eq(c.pending(), 2);
  c.advance(10);
  eq(c.pending(), 1);
});
¦¦¦

### [intermediate] Write a testable debounce
Implement ¦debounce(fn, wait, timers)¦ where ¦timers¦ is an object ¦{ setTimeout, clearTimeout }¦ that defaults to the real global functions. Calling the debounced function restarts the wait; after ¦wait¦ ms without further calls, ¦fn¦ runs **once with the arguments and ¦this¦ of the last call**. The returned function also has a ¦.cancel()¦ method.

Because the timers are injected, tests can pass a fake clock and never really wait.
> Hint: Store the current timer id in a closure variable; clear it before scheduling a new one.
--- solution ---
¦¦¦js
function debounce(fn, wait, timers = { setTimeout, clearTimeout }) {
  let id = null;
  function debounced(...args) {
    if (id !== null) timers.clearTimeout(id);
    id = timers.setTimeout(() => {
      id = null;
      fn.apply(this, args);
    }, wait);
  }
  debounced.cancel = () => {
    if (id !== null) timers.clearTimeout(id);
    id = null;
  };
  return debounced;
}
¦¦¦
Injecting ¦timers¦ is a tiny example of **dependency injection for testability**. The production call stays ¦debounce(search, 300)¦, while the test passes a fake clock.

--- starter ---
¦¦¦js
function debounce(fn, wait, timers) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
function fakeTimers() {
  let time = 0, nextId = 1;
  const list = new Map();
  return {
    setTimeout(fn, ms) { const id = nextId++; list.set(id, { fn, at: time + ms }); return id; },
    clearTimeout(id) { list.delete(id); },
    advance(ms) {
      const end = time + ms;
      for (;;) {
        let next = null, nid = null;
        list.forEach((t, id) => { if (t.at <= end && (!next || t.at < next.at)) { next = t; nid = id; } });
        if (!next) break;
        time = next.at;
        list.delete(nid);
        next.fn();
      }
      time = end;
    },
  };
}
test('does not call before the wait has passed', () => {
  const t = fakeTimers();
  const calls = [];
  const d = debounce((x) => calls.push(x), 300, t);
  d('a');
  t.advance(299);
  eq(calls, []);
});
test('calls once after the wait', () => {
  const t = fakeTimers();
  const calls = [];
  const d = debounce((x) => calls.push(x), 300, t);
  d('a');
  t.advance(300);
  eq(calls, ['a']);
});
test('restarts the wait on each call and uses the last arguments', () => {
  const t = fakeTimers();
  const calls = [];
  const d = debounce((x) => calls.push(x), 300, t);
  d('a');
  t.advance(200);
  d('b');
  t.advance(200);
  eq(calls, []);
  t.advance(100);
  eq(calls, ['b']);
});
test('can fire again after a quiet period', () => {
  const t = fakeTimers();
  const calls = [];
  const d = debounce((x) => calls.push(x), 100, t);
  d(1); t.advance(100);
  d(2); t.advance(100);
  eq(calls, [1, 2]);
});
test('cancel stops the pending call', () => {
  const t = fakeTimers();
  const calls = [];
  const d = debounce((x) => calls.push(x), 100, t);
  d('a');
  d.cancel();
  t.advance(500);
  eq(calls, []);
});
test('preserves this', () => {
  const t = fakeTimers();
  const obj = { name: 'hub', seen: null, run: debounce(function () { obj.seen = this.name; }, 10, t) };
  obj.run();
  t.advance(10);
  eq(obj.seen, 'hub');
});
¦¦¦

### [intermediate] Retry with exponential backoff (testable)
Write the async function ¦retry(fn, options)¦ with options ¦{ retries = 3, delayMs = 100, sleep }¦.

- Call ¦fn(attemptNumber)¦ (attempts start at 1). If it resolves, return its value.
- If it rejects, wait ¦delayMs * 2^(attempt-1)¦ using ¦sleep(ms)¦ and try again, up to ¦retries¦ **extra** attempts (so ¦retries + 1¦ attempts in total).
- Do **not** sleep after the final failure; reject with the last error.
- ¦sleep¦ is injectable and defaults to a real ¦setTimeout¦ promise, so tests can record delays without waiting.
> Hint: A ¦for¦ loop with ¦try/catch¦ is enough. Remember the "no sleep after last failure" rule.
--- solution ---
¦¦¦js
async function retry(fn, options = {}) {
  const {
    retries = 3,
    delayMs = 100,
    sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  } = options;
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn(attempt + 1);
    } catch (err) {
      lastError = err;
      if (attempt < retries) await sleep(delayMs * 2 ** attempt);
    }
  }
  throw lastError;
}
¦¦¦
In tests you pass ¦sleep: async (ms) => delays.push(ms)¦, so a three-attempt retry with 100 ms, 200 ms backoff finishes instantly and you can assert the delays. Real retries should also add **jitter** and only retry errors that are safe to retry (network errors, 503), never validation errors.

--- starter ---
¦¦¦js
async function retry(fn, options = {}) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
function flakyService(failTimes, value) {
  let calls = 0;
  const fn = async () => {
    calls++;
    if (calls <= failTimes) throw new Error('boom ' + calls);
    return value;
  };
  fn.count = () => calls;
  return fn;
}
async function rejectsWith(promise) {
  try { await promise; } catch (e) { return e; }
  throw new Error('expected the promise to reject');
}
test('returns the value when the first attempt works, with no sleeping', async () => {
  const delays = [];
  const svc = flakyService(0, 'ok');
  const r = await retry(svc, { sleep: async (ms) => { delays.push(ms); } });
  eq(r, 'ok');
  eq(svc.count(), 1);
  eq(delays, []);
});
test('retries after failures and waits with exponential backoff', async () => {
  const delays = [];
  const svc = flakyService(2, 'ok');
  const r = await retry(svc, { retries: 3, delayMs: 100, sleep: async (ms) => { delays.push(ms); } });
  eq(r, 'ok');
  eq(svc.count(), 3);
  eq(delays, [100, 200]);
});
test('gives up after retries and rejects with the last error', async () => {
  const delays = [];
  const svc = flakyService(99, 'never');
  const err = await rejectsWith(retry(svc, { retries: 3, delayMs: 10, sleep: async (ms) => { delays.push(ms); } }));
  eq(err.message, 'boom 4');
  eq(svc.count(), 4);
  eq(delays, [10, 20, 40]);
});
test('passes the attempt number to fn', async () => {
  const seen = [];
  await retry(async (n) => { seen.push(n); if (n < 3) throw new Error('x'); return n; }, { sleep: async () => {} });
  eq(seen, [1, 2, 3]);
});
test('retries: 0 means a single attempt', async () => {
  const svc = flakyService(1, 'ok');
  await rejectsWith(retry(svc, { retries: 0, sleep: async () => {} }));
  eq(svc.count(), 1);
});
¦¦¦

### [basic] Test data factory
Write ¦createFactory(defaults)¦ returning ¦{ build(overrides), buildList(n, overrides) }¦.

- Each default may be a plain value or a function ¦(seq) => value¦, called with an incrementing sequence number starting at 1 (one sequence per factory, shared by ¦build¦ and ¦buildList¦).
- Plain default values must not be shared between built objects (mutating one object must not affect another); use ¦structuredClone¦.
- ¦overrides¦ replace defaults.
- ¦buildList(n, overrides)¦ returns ¦n¦ objects.
> Hint: A factory lets a test state only the field it cares about, such as ¦build({ role: 'admin' })¦, which keeps the test short and the intent obvious.
--- solution ---
¦¦¦js
function createFactory(defaults) {
  let seq = 0;
  function build(overrides = {}) {
    seq += 1;
    const out = {};
    for (const key of Object.keys(defaults)) {
      const value = defaults[key];
      out[key] = typeof value === 'function' ? value(seq) : structuredClone(value);
    }
    return Object.assign(out, overrides);
  }
  function buildList(n, overrides) {
    return Array.from({ length: n }, () => build(overrides));
  }
  return { build, buildList };
}
¦¦¦
Usage:
¦¦¦js
const learner = createFactory({
  id: (n) => n,
  email: (n) => 'learner' + n + '@example.com',
  role: 'learner',
  courses: [],
});
learner.build({ role: 'admin' });
¦¦¦
Factories replace huge shared fixtures: each test builds fresh, unique, minimal data, which also prevents hidden coupling between tests.

--- starter ---
¦¦¦js
function createFactory(defaults) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
const make = () => createFactory({
  id: (n) => n,
  email: (n) => 'learner' + n + '@example.com',
  role: 'learner',
  courses: [],
});
test('build returns defaults with a sequence', () => {
  const f = make();
  eq(f.build(), { id: 1, email: 'learner1@example.com', role: 'learner', courses: [] });
  eq(f.build().id, 2);
});
test('overrides win over defaults', () => {
  const f = make();
  const a = f.build({ role: 'admin', email: 'a@x.com' });
  eq(a.role, 'admin');
  eq(a.email, 'a@x.com');
  eq(a.id, 1);
});
test('plain defaults are not shared between objects', () => {
  const f = make();
  const a = f.build();
  const b = f.build();
  a.courses.push('react');
  eq(b.courses, []);
  eq(f.build().courses, []);
});
test('buildList returns n unique objects', () => {
  const f = make();
  const list = f.buildList(3, { role: 'mentor' });
  eq(list.length, 3);
  eq(list.map((x) => x.id), [1, 2, 3]);
  ok(list.every((x) => x.role === 'mentor'));
  eq(new Set(list.map((x) => x.email)).size, 3);
});
test('factories keep separate sequences', () => {
  const a = make();
  const b = make();
  a.build(); a.build();
  eq(b.build().id, 1);
});
¦¦¦

### [intermediate] Write a mini test runner
Implement ¦createRunner()¦ returning ¦{ test(name, fn), beforeEach(fn), run() }¦.

- ¦run()¦ returns a promise for ¦{ passed, failed, results }¦ where ¦results¦ is an array of ¦{ name, pass, error }¦ in registration order.
- Tests run **one after another**. Test functions may be sync or async. A test fails if it throws or returns a rejected promise; ¦error¦ is the error message (empty string for passes).
- A failing test must not stop the others.
- ¦beforeEach¦ hooks run (in registration order, awaited) before every test. If a hook throws, that test fails.
> Hint: Use ¦async run()¦ with ¦for...of¦ and ¦await¦ inside a ¦try/catch¦ for each test.
--- solution ---
¦¦¦js
function createRunner() {
  const tests = [];
  const hooks = [];
  return {
    test(name, fn) { tests.push({ name, fn }); },
    beforeEach(fn) { hooks.push(fn); },
    async run() {
      const results = [];
      for (const t of tests) {
        try {
          for (const hook of hooks) await hook();
          await t.fn();
          results.push({ name: t.name, pass: true, error: '' });
        } catch (e) {
          results.push({ name: t.name, pass: false, error: e && e.message ? e.message : String(e) });
        }
      }
      const passed = results.filter((r) => r.pass).length;
      return { passed, failed: results.length - passed, results };
    },
  };
}
¦¦¦
This is the heart of every test framework: collect test functions, run them in isolation, catch errors, and report. Seeing it in 20 lines explains why tests must be independent (they share one process) and why a missing ¦await¦ makes a test pass early.

--- starter ---
¦¦¦js
function createRunner() {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
test('reports passes and failures in order', async () => {
  const r = createRunner();
  r.test('a', () => {});
  r.test('b', () => { throw new Error('boom'); });
  r.test('c', () => {});
  const out = await r.run();
  eq(out.passed, 2);
  eq(out.failed, 1);
  eq(out.results.map((x) => x.name), ['a', 'b', 'c']);
  eq(out.results[1], { name: 'b', pass: false, error: 'boom' });
  eq(out.results[0], { name: 'a', pass: true, error: '' });
});
test('supports async tests and rejected promises', async () => {
  const r = createRunner();
  r.test('ok', async () => { await Promise.resolve(); });
  r.test('rejects', () => Promise.reject(new Error('nope')));
  const out = await r.run();
  eq(out.results.map((x) => x.pass), [true, false]);
  eq(out.results[1].error, 'nope');
});
test('tests run one after another', async () => {
  const r = createRunner();
  const log = [];
  r.test('slow', async () => { log.push('slow start'); await new Promise((res) => setTimeout(res, 15)); log.push('slow end'); });
  r.test('fast', () => { log.push('fast'); });
  await r.run();
  eq(log, ['slow start', 'slow end', 'fast']);
});
test('beforeEach runs before every test in order', async () => {
  const r = createRunner();
  const log = [];
  r.beforeEach(() => { log.push('h1'); });
  r.beforeEach(async () => { log.push('h2'); });
  r.test('one', () => { log.push('t1'); });
  r.test('two', () => { log.push('t2'); });
  await r.run();
  eq(log, ['h1', 'h2', 't1', 'h1', 'h2', 't2']);
});
test('a throwing hook fails that test', async () => {
  const r = createRunner();
  let first = true;
  r.beforeEach(() => { if (first) { first = false; throw new Error('hook failed'); } });
  r.test('one', () => {});
  r.test('two', () => {});
  const out = await r.run();
  eq(out.results.map((x) => x.pass), [false, true]);
  eq(out.results[0].error, 'hook failed');
});
test('non-error throws are reported as text', async () => {
  const r = createRunner();
  r.test('weird', () => { throw 'plain string'; });
  const out = await r.run();
  eq(out.results[0].error, 'plain string');
});
¦¦¦

### [advanced] Make an enrolment service testable with dependency injection
Write ¦createEnrolmentService({ repo, clock, idGen, maxPerCourse = 30 })¦ with an async ¦enrol(learnerId, courseId)¦ method.

Rules, in this order:
1. If ¦learnerId¦ or ¦courseId¦ is missing, throw ¦Error('INVALID_INPUT')¦.
2. If ¦repo.find(learnerId, courseId)¦ returns something, throw ¦Error('ALREADY_ENROLLED')¦.
3. If ¦repo.count(courseId)¦ is at least ¦maxPerCourse¦, throw ¦Error('COURSE_FULL')¦.
4. Otherwise build ¦{ id: idGen(), learnerId, courseId, enrolledAt: clock.now(), status: 'active' }¦, call ¦repo.save(enrolment)¦ and return it.

The repository methods may be async. ¦save¦ must **not** be called when a rule fails.
> Hint: No ¦Date.now()¦ or ¦Math.random()¦ inside the service; everything non-deterministic comes in through the arguments.
--- solution ---
¦¦¦js
function createEnrolmentService({ repo, clock, idGen, maxPerCourse = 30 }) {
  return {
    async enrol(learnerId, courseId) {
      if (!learnerId || !courseId) throw new Error('INVALID_INPUT');
      if (await repo.find(learnerId, courseId)) throw new Error('ALREADY_ENROLLED');
      if ((await repo.count(courseId)) >= maxPerCourse) throw new Error('COURSE_FULL');
      const enrolment = {
        id: idGen(),
        learnerId,
        courseId,
        enrolledAt: clock.now(),
        status: 'active',
      };
      await repo.save(enrolment);
      return enrolment;
    },
  };
}
¦¦¦
Because the repository, clock and id generator are parameters, the test uses an **in-memory fake repo**, a **fixed clock** and a **counter**, so it needs no database, no real time and gives exactly repeatable results. The same service gets the real Sequelize repository in production.

--- starter ---
¦¦¦js
function createEnrolmentService(deps) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
function makeFakes(initial) {
  const rows = (initial || []).slice();
  let saves = 0;
  let n = 0;
  return {
    repo: {
      find: async (l, c) => rows.find((r) => r.learnerId === l && r.courseId === c) || null,
      count: async (c) => rows.filter((r) => r.courseId === c).length,
      save: async (e) => { saves++; rows.push(e); },
    },
    clock: { now: () => 1700000000000 },
    idGen: () => 'enr-' + (++n),
    saves: () => saves,
    rows,
  };
}
async function rejectsWith(promise) {
  try { await promise; } catch (e) { return e.message; }
  throw new Error('expected the promise to reject');
}
test('enrols a learner and returns the enrolment', async () => {
  const f = makeFakes();
  const svc = createEnrolmentService(f);
  const e = await svc.enrol('L1', 'C1');
  eq(e, { id: 'enr-1', learnerId: 'L1', courseId: 'C1', enrolledAt: 1700000000000, status: 'active' });
  eq(f.saves(), 1);
  eq(f.rows.length, 1);
});
test('rejects missing input', async () => {
  const f = makeFakes();
  const svc = createEnrolmentService(f);
  eq(await rejectsWith(svc.enrol('', 'C1')), 'INVALID_INPUT');
  eq(await rejectsWith(svc.enrol('L1')), 'INVALID_INPUT');
  eq(f.saves(), 0);
});
test('rejects duplicate enrolment', async () => {
  const f = makeFakes([{ learnerId: 'L1', courseId: 'C1' }]);
  const svc = createEnrolmentService(f);
  eq(await rejectsWith(svc.enrol('L1', 'C1')), 'ALREADY_ENROLLED');
  eq(f.saves(), 0);
});
test('rejects when the course is full', async () => {
  const f = makeFakes([{ learnerId: 'A', courseId: 'C1' }, { learnerId: 'B', courseId: 'C1' }]);
  const svc = createEnrolmentService({ ...f, maxPerCourse: 2 });
  eq(await rejectsWith(svc.enrol('L1', 'C1')), 'COURSE_FULL');
  eq(f.saves(), 0);
});
test('capacity is per course and defaults to 30', async () => {
  const rows = [];
  for (let i = 0; i < 30; i++) rows.push({ learnerId: 'u' + i, courseId: 'BIG' });
  const f = makeFakes(rows);
  const svc = createEnrolmentService(f);
  eq(await rejectsWith(svc.enrol('L1', 'BIG')), 'COURSE_FULL');
  const ok1 = await svc.enrol('L1', 'OTHER');
  eq(ok1.courseId, 'OTHER');
});
test('duplicate check comes before the capacity check', async () => {
  const f = makeFakes([{ learnerId: 'L1', courseId: 'C1' }]);
  const svc = createEnrolmentService({ ...f, maxPerCourse: 1 });
  eq(await rejectsWith(svc.enrol('L1', 'C1')), 'ALREADY_ENROLLED');
});
¦¦¦

### [advanced] Build a property-based testing helper with shrinking
You are given a seeded random generator and two generators. Implement ¦forAll(gen, prop, options)¦.

- ¦gen¦ is a function ¦(rng) => value¦, ¦options¦ is ¦{ runs = 100, seed = 1 }¦.
- It runs ¦prop(value)¦ on up to ¦runs¦ generated values. A property **fails** if it returns ¦false¦ or throws (returning anything else passes).
- If all pass, return ¦{ ok: true, runs }¦.
- On the first failure at run ¦i¦ (counting from 1) return ¦{ ok: false, runs: i, counterexample }¦ where ¦counterexample¦ is **shrunk**:
  - an **integer** shrinks to the failing value with the smallest absolute value; try candidates ¦0, 1, -1, 2, -2, ...¦ below ¦|value|¦ and take the first one that still fails
  - an **array** shrinks by repeatedly removing one element while the property still fails, until no single removal still fails
  - anything else is returned unchanged
> Hint: Write ¦fails(value)¦ once (wrapping ¦prop¦ in ¦try/catch¦) and reuse it in the run loop and in the shrinkers.
--- solution ---
¦¦¦js
function makeRng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const genInt = (min, max) => (rng) => min + Math.floor(rng() * (max - min + 1));
const genArray = (g, maxLen) => (rng) =>
  Array.from({ length: Math.floor(rng() * (maxLen + 1)) }, () => g(rng));

function shrink(value, fails) {
  if (Number.isInteger(value)) {
    for (let k = 0; k < Math.abs(value); k++) {
      const candidates = k === 0 ? [0] : [k, -k];
      for (const c of candidates) if (fails(c)) return c;
    }
    return value;
  }
  if (Array.isArray(value)) {
    let current = value;
    let changed = true;
    while (changed) {
      changed = false;
      for (let i = 0; i < current.length; i++) {
        const without = current.slice(0, i).concat(current.slice(i + 1));
        if (fails(without)) {
          current = without;
          changed = true;
          break;
        }
      }
    }
    return current;
  }
  return value;
}

function forAll(gen, prop, options = {}) {
  const { runs = 100, seed = 1 } = options;
  const rng = makeRng(seed);
  const fails = (v) => {
    try { return prop(v) === false; } catch (e) { return true; }
  };
  for (let i = 1; i <= runs; i++) {
    const value = gen(rng);
    if (fails(value)) return { ok: false, runs: i, counterexample: shrink(value, fails) };
  }
  return { ok: true, runs };
}
¦¦¦
This is a small version of what ¦fast-check¦ does. Property tests describe a rule ("sorting twice equals sorting once") and let the machine hunt for inputs that break it; **shrinking** turns a confusing failing input such as ¦[8, 3, 9, 0, 7]¦ into the minimal one a human can understand.

--- starter ---
¦¦¦js
function makeRng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const genInt = (min, max) => (rng) => min + Math.floor(rng() * (max - min + 1));
const genArray = (g, maxLen) => (rng) =>
  Array.from({ length: Math.floor(rng() * (maxLen + 1)) }, () => g(rng));

function forAll(gen, prop, options = {}) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
test('a true property passes for all runs', () => {
  const r = forAll(genInt(-100, 100), (n) => n + 0 === n);
  eq(r, { ok: true, runs: 100 });
});
test('respects the runs option', () => {
  let count = 0;
  const r = forAll(genInt(0, 5), () => { count++; return true; }, { runs: 50 });
  eq(count, 50);
  eq(r.runs, 50);
});
test('finds a counterexample and shrinks an integer to the smallest failing value', () => {
  const r = forAll(genInt(0, 1000), (n) => n < 10);
  eq(r.ok, false);
  eq(r.counterexample, 10);
});
test('shrinks negative-failing integers by absolute value', () => {
  const r = forAll(genInt(-1000, 1000), (n) => Math.abs(n) < 5);
  eq(r.ok, false);
  eq(Math.abs(r.counterexample), 5);
});
test('shrinks arrays by removing elements', () => {
  const r = forAll(genArray(genInt(0, 9), 10), (xs) => xs.length < 3);
  eq(r.ok, false);
  eq(r.counterexample.length, 3);
});
test('a throwing property counts as a failure', () => {
  const r = forAll(genInt(0, 100), (n) => { if (n > 50) throw new Error('too big'); return true; });
  eq(r.ok, false);
  eq(r.counterexample, 51);
});
test('is deterministic for the same seed', () => {
  const a = forAll(genInt(1, 1000), (n) => n < 900, { seed: 42 });
  const b = forAll(genInt(1, 1000), (n) => n < 900, { seed: 42 });
  eq(a.ok, false);
  eq(a.runs, b.runs);
  eq(a.counterexample, 900);
  eq(b.counterexample, 900);
});
¦¦¦

### [intermediate] Design a test plan for the enrolment API
The Clinical Learning Hub has ¦POST /courses/:id/enrolments¦. A learner enrols on a course; the API checks authentication, whether the course is published, duplicates, capacity (30), and prerequisites, then stores the enrolment and sends a confirmation email. Write a test plan: which tests at which level, what you mock, and what you leave to E2E.
--- solution ---
**Principle**: most behaviour at the API-integration level (real Express app, real service, test database), the rules as fast unit tests, only one E2E journey.

| Level | What to test | Doubles |
|---|---|---|
| Unit | capacity rule, prerequisite rule, duplicate rule, date and status mapping | fake repo, fixed clock |
| API integration (Supertest + test MySQL, rolled back per test) | 201 happy path and stored row; 400 invalid id; 401 no or expired token; 403 wrong role; 404 unknown or unpublished course; 409 duplicate; 409 course full; concurrency: two simultaneous requests for the last seat result in one 201 and one 409 | real DB; email provider faked |
| Contract | response shape the React app depends on (¦id, courseId, status, enrolledAt¦) | consumer contract verified in the API pipeline |
| Side effects | confirmation email requested exactly once; none on failure | spy on the email port |
| Frontend integration (RTL + MSW) | button label and disabled states, success message, each error message, loading state | MSW handlers |
| E2E (Playwright) | login, find course, enrol, see it on dashboard | seeded user and course through the API |
| Non-functional | smoke load test on the endpoint (p95 under 300 ms at expected traffic); accessibility check of the enrol dialog | k6, axe |

Leave out of E2E: every error code (already covered cheaper below), and email content (unit-tested with the template).

### [intermediate] Fix a flaky Cypress test
This test fails about one run in five on CI. Explain the causes and rewrite it.

¦¦¦js
it('enrols on a course', () => {
  cy.visit('/courses');
  cy.wait(3000);
  cy.get('.card:nth-child(2) .btn-primary').click();
  cy.get('.toast').should('exist');
  cy.get('.my-courses li').should('have.length', 4);
});
¦¦¦
> Hint: Look at fixed waits, selectors tied to layout and CSS, a hard-coded expected count, and shared data.
--- solution ---
Problems: (1) ¦cy.wait(3000)¦ is a guess: too short on a slow CI machine, wasted time on a fast one. (2) ¦.card:nth-child(2) .btn-primary¦ depends on order and styling, so a new course or restyle changes the target. (3) ¦should('exist')¦ on a toast does not check what it says. (4) ¦have.length 4¦ depends on whatever data earlier tests left behind.

¦¦¦js
it('enrols a learner on a course', () => {
  // seed an isolated user and course through the API, not the UI
  cy.task('seedLearnerAndCourse').then(({ email, courseTitle }) => {
    cy.login(email);
    cy.intercept('POST', '/api/courses/*/enrolments').as('enrol');

    cy.visit('/courses');
    cy.findByRole('article', { name: courseTitle })
      .within(() => cy.findByRole('button', { name: /enrol/i }).click());

    cy.wait('@enrol').its('response.statusCode').should('eq', 201);
    cy.findByRole('status').should('contain.text', 'You are enrolled');

    cy.visit('/dashboard');
    cy.findByRole('list', { name: /my courses/i }).findAllByRole('listitem').should('have.length', 1);
  });
});
¦¦¦
Fixes: wait on the **network alias**, not time; select by **role and name**; assert **content**; give each test its **own data**. Cypress retries assertions automatically, so no sleeps are needed.

### [intermediate] Convert implementation-detail React tests into behaviour tests
Rewrite these tests so they survive a refactor from ¦useState¦ to ¦useReducer¦ and from a ¦div¦ to a ¦button¦.

¦¦¦js
it('toggles state', () => {
  const wrapper = shallow(<Accordion title="FAQ" />);
  expect(wrapper.state('open')).toBe(false);
  wrapper.find('.header').simulate('click');
  expect(wrapper.state('open')).toBe(true);
  expect(wrapper.instance().toggle).toHaveBeenCalledTimes(1);
});
¦¦¦
> Hint: Ask what a user sees and does: they read a title, press a button, and see content appear.
--- solution ---
¦¦¦js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('shows the content after the header is pressed', async () => {
  render(<Accordion title="FAQ">Answer text</Accordion>);

  const header = screen.getByRole('button', { name: 'FAQ' });
  expect(header).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByText('Answer text')).not.toBeInTheDocument();

  await userEvent.click(header);

  expect(header).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByText('Answer text')).toBeVisible();
});
¦¦¦
What changed: no reading of component state, no instance methods, no CSS class. The test now also checks the **accessibility contract** (¦button¦ role, ¦aria-expanded¦). Rule: if a refactor that keeps behaviour breaks a test, the test was testing implementation.

### [advanced] Find the surviving mutants
This function and its single test have 100% line coverage. List mutants that would survive, then add tests that kill them.

¦¦¦js
function canCertify(score, attempts, hoursSpent) {
  if (attempts > 3) return false;
  return score >= 70 && hoursSpent >= 5;
}
it('certifies a strong learner', () => {
  expect(canCertify(85, 1, 6)).toBe(true);
});
¦¦¦
> Hint: Mutation tools change ¦>¦ to ¦>=¦, ¦>=¦ to ¦>¦, ¦&&¦ to ¦||¦, and delete statements. Each one needs a test that sits exactly on the boundary.
--- solution ---
Surviving mutants (the single test still passes):
1. ¦attempts > 3¦ to ¦attempts >= 3¦ (boundary not tested)
2. ¦attempts > 3¦ guard removed (no test with many attempts)
3. ¦score >= 70¦ to ¦score > 70¦ (the 70 boundary)
4. ¦score >= 70¦ to ¦true¦ (low scores never tested)
5. ¦hoursSpent >= 5¦ to ¦hoursSpent > 5¦ or to ¦true¦
6. ¦&&¦ to ¦||¦ (never tested with exactly one condition false)

Tests that kill them:
¦¦¦js
it.each([
  [70, 3, 5, true],    // exact boundaries are all inclusive
  [69, 1, 6, false],   // just below the score threshold
  [85, 1, 4, false],   // just below the hours threshold
  [85, 4, 6, false],   // too many attempts
  [85, 3, 6, true],    // last allowed attempt
  [60, 1, 2, false],   // both conditions fail
])('canCertify(%i, %i, %i) is %s', (score, attempts, hours, expected) => {
  expect(canCertify(score, attempts, hours)).toBe(expected);
});
¦¦¦
Lesson: line coverage said 100%, yet six behaviours were unprotected. Boundary-value tests are the cheapest way to raise real test quality.

## SCENARIOS

### A release broke the enrolment flow even though CI was green. What do you do?
First restore service: roll back or hotfix behind a flag. Then investigate why the pipeline missed it: was the path untested, was it tested only with mocks that hid the break (for example a changed API field), or did tests assert too little? Add a regression test at the cheapest level that would have caught it (often an API-integration or contract test), add a smoke E2E for the critical journey if none exists, and write a blameless review with an action list. Report the change in how you decide what to test, not only the one fix.

### The test suite takes 40 minutes and developers have started skipping it. How do you fix it?
Measure first: find the slowest tests and the split between unit, integration and E2E. Then: run lint and types first (fast fail), shard and parallelise, cache dependencies and Docker layers, replace slow E2E checks with API or component tests, remove sleeps, share expensive setup (one database per worker, rolled-back transactions), and run only affected tests on pull requests with the full suite on main. Set a budget (for example 10 minutes for PR checks), show the timing on a dashboard, and make it a team rule that new slow tests need justification.

### Coverage is 85% but customers keep finding bugs. What is your approach?
Coverage measures execution, not verification. Sample recent escaped bugs and find why tests missed them (missing edge case, weak assertion, untested integration, mocked-away behaviour). Run mutation testing on a critical module to quantify weak assertions. Shift from a global percentage to risk-based testing: boundary and error paths in business rules, integration tests for the main flows, contract tests across services. Add a rule that every bug fix ships with a regression test, and track escaped defects as the real quality measure.

### Copilot generated a feature and its tests in one pull request. How do you review it?
Review the tests first, since they define correct behaviour. Check that they assert the requirement and not the implementation, include error paths and boundaries, and are not tautologies. Try breaking the code (flip a condition) to see whether a test fails. Verify every API and library option the code uses exists, and check security and accessibility. Ask the author to explain the logic aloud; if they cannot, the PR is not ready. Keep the PR small, and add the finding to your team guideline for AI-assisted work.

### You inherit a legacy module with no tests and must change it this sprint.
Do not refactor blind. Write characterisation tests around the current inputs and outputs (golden-master style) at the highest convenient level, such as an API call. Find a seam to isolate side effects, for example inject the database or clock. Make the smallest change under that safety net, then add focused unit tests for the new behaviour. Refactor only after tests pass. Record what you learned in the PR so the next person has a starting point.

### E2E tests fail randomly in CI about one run in ten. What do you do?
Treat it as a bug with a deadline. Collect traces and videos from failing runs, then reproduce by running the single test in a loop on CI-like hardware. Typical findings: fixed waits, shared accounts, animations, data left by other tests, or real third-party calls. Fix by isolating data per test, using auto-waiting and role selectors, waiting on network aliases, disabling animations, and stubbing external services. Quarantine the test (reported, not hidden) until fixed, and set a flake-rate target.
`;
