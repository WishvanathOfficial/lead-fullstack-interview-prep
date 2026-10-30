window.PREP_NOTES = window.PREP_NOTES || {};
window.PREP_NOTES.testing = String.raw`
## Phase 1 · Foundations (Basic)
### Why we test: confidence, regression safety, design feedback
#### In one line
Tests are executable examples of how your code must behave, so you can change it later without fear.

#### Real-life analogy
A climber's safety rope. It does not make you climb faster on day one, but it lets you attempt harder routes, and a fall becomes a small slip instead of a disaster. Code without tests is free solo climbing: fine until the day it is not.

#### How it works
1. **Regression safety**: when you fix or change something, the old tests re-check everything you did before, in seconds.
2. **Living documentation**: a test named "rejects enrolment when the course is full" tells a new teammate the rule, and it can never be out of date because CI fails if it is.
3. **Design feedback**: code that is painful to test (many dependencies, hidden globals, giant functions) is usually painful to change. Writing tests pushes you to smaller, clearer units.
4. **Faster debugging**: a failing test points at one behaviour; a user report points at "something is broken".
5. **Team confidence**: with a trusted suite, reviewers can focus on design instead of re-running the app by hand.

Tests cost time too. A good test is cheap to write, fast to run, and fails only when something real broke.

#### Example
¦¦¦js
// The rule is written once, as an example anyone can read
function calculateCompletion(done, total) {
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
}

test('reports 75 percent when 3 of 4 modules are done', () => {
  eq(calculateCompletion(3, 4), 75);
});
test('does not divide by zero for a course with no modules', () => {
  eq(calculateCompletion(0, 0), 0);
});
¦¦¦
Six months later someone "simplifies" the function and removes the ¦total === 0¦ line; the second test fails immediately and shows exactly what was lost.

#### Remember it
**"Tests are a safety net, a manual and a design tool."**

| Benefit | Question it answers |
|---|---|
| Regression safety | Did my change break old behaviour? |
| Documentation | What is this code supposed to do? |
| Design feedback | Is this code easy to change? |
| Speed | Can I release on Friday without panic? |

#### Common mistakes
- Saying tests "find bugs" only. They mostly **prevent regressions** and enable safe change.
- Writing tests after a release to hit a coverage number instead of to protect behaviour.
- Treating a slow, flaky suite as normal. A suite nobody trusts gives no safety.

#### Interview angle
**Q:** "Why do you write tests?" **Say:** "Mainly to change code safely. On the Clinical Learning Hub, with 8 to 10 engineers touching shared code, tests let us refactor and release often because regressions show up in CI instead of production. They also document business rules, and hard-to-test code tells me my design needs work." **Follow-up:** What do you do when the business says there is no time for tests?

### Testing pyramid and testing trophy
#### In one line
The pyramid and the trophy are two pictures that tell you how many tests of each kind to write: more of the cheap, fast kind, fewer of the slow, realistic kind.

#### Real-life analogy
Quality checks at a car factory. Thousands of quick checks on single parts (unit), a good number on assembled systems such as engine plus gearbox (integration), and only a few full test drives on the track (end-to-end). You cannot test-drive every possible combination, and you also would not ship a car whose parts were only inspected one by one.

#### How it works
**Pyramid** (Mike Cohn): base = many unit tests, middle = fewer integration, top = few E2E. Reasoning: lower levels are fast, stable and precise; higher levels are slow, flaky and expensive to debug.

**Trophy** (Kent C. Dodds): from bottom to top: **static analysis** (TypeScript, ESLint), **unit**, **integration (the biggest part)**, **E2E**. Reasoning: integration tests give the best confidence per minute, because they exercise real wiring (component + hooks + network layer) the way users use the app, and bugs often live in the seams between units.

A practical mix for a React + Node + MySQL team:
- TypeScript and lint on every commit.
- Unit tests for pure logic (calculations, validators, reducers).
- Integration tests for most features: React component with mocked network, Express route with a test database.
- A handful of E2E tests for money-or-reputation journeys: login, enrol, complete, certificate.

#### Example
¦¦¦text
Feature: "Enrol on a course"

static   TypeScript: enrol(learnerId: string, courseId: string) cannot be called with a number
unit     canEnrol(rules) -> 12 quick cases (full, duplicate, prerequisite...)
integr.  POST /enrolments with Supertest + test DB: 201, 409, 403    (8 tests)
integr.  <EnrolButton/> with MSW: loading, success, error messages  (4 tests)
e2e      learner logs in, enrols, sees the course on the dashboard   (1 test)
¦¦¦

#### Remember it
**"Cheap and many at the bottom, costly and few at the top."**
- Pyramid: more unit tests. Trophy: more integration tests.
- Both agree: very few E2E, and always have static checks.
- Choose by where your bugs actually come from (check your last 10 escaped bugs).

#### Common mistakes
- The **ice-cream cone**: lots of manual or E2E testing and almost no unit tests, which makes the pipeline slow and flaky.
- Following a ratio religiously (such as 70/20/10) without looking at your own risks.
- Counting types by tool name instead of by what the test does and how long it takes.

#### Interview angle
**Q:** "Pyramid or trophy?" **Say:** "I lean towards the trophy for UI-heavy apps: TypeScript catches a lot for free, and integration tests of components and API routes give the most confidence per minute. I still keep fast unit tests for pure business rules and a very small E2E set for critical journeys." **Follow-up:** How would you decide whether a bug needs a unit or an integration test?

### Unit vs integration vs end-to-end tests
#### In one line
Unit tests check one piece in isolation, integration tests check several real pieces working together, and end-to-end tests check the whole system the way a user does.

#### Real-life analogy
Building a house: checking that one brick is not cracked (unit), that the plumbing and the heating work together in one room (integration), and finally moving in and living there for a weekend (end-to-end).

#### How it works
| | Unit | Integration | End-to-end |
|---|---|---|---|
| Scope | one function/class | several modules, one subsystem | whole app, real browser |
| Dependencies | doubled | mostly real, edges faked | real (or near real) |
| Speed | milliseconds | tens to hundreds of ms | seconds |
| Failure tells you | exactly where | which area | that something is wrong |
| Flakiness | very low | low | highest |

Unit example: ¦formatDuration(3725)¦ returns ¦'1h 2m'¦. Integration example: render ¦<CourseList />¦ with a mocked API and check that the filter box, the list and the empty state work together. E2E example: Playwright logs in, enrols, and checks the dashboard.

How to choose: test **rules and calculations** as units, test **wiring and user flows** as integration, and test **only the critical journeys** end to end.

#### Example
¦¦¦js
// UNIT: pure function, no setup
test('formats seconds as hours and minutes', () => {
  eq(formatDuration(3725), '1h 2m');
});

// INTEGRATION: real service + fake repository, no network
test('enrols a learner and stores the enrolment', async () => {
  const repo = makeInMemoryRepo();
  const svc = createEnrolmentService({ repo, clock: fixedClock, idGen: () => 'e1' });
  const e = await svc.enrol('L1', 'C1');
  eq((await repo.find('L1', 'C1')).id, e.id);
});

// E2E (Playwright, runs in a real browser):
// await page.goto('/login'); ... await page.getByRole('button', { name: 'Enrol' }).click();
¦¦¦

#### Remember it
**"Unit = one thing. Integration = things together. E2E = the user's view."**
- Ask: "If this test fails, how many places could be wrong?" One place means unit; many places means higher level.
- Names matter less than speed and clarity; some teams call component tests "unit", and that is fine if everyone agrees.

#### Common mistakes
- Calling a test "unit" when it needs a real database (it is an integration test and will be slow).
- Mocking so much in an integration test that nothing real is left.
- Putting every check in E2E because it feels "more real".

#### Interview angle
**Q:** "Difference between unit, integration and E2E?" **Say:** "Scope and realism. Unit tests isolate one function with doubles and run in milliseconds. Integration tests combine real modules, for example a route with its service and a test database. E2E drives the real UI and stack. I pick the lowest level that can catch the bug, because lower is faster and easier to debug." **Follow-up:** Give an example of a bug only an integration test would catch.

### Anatomy of a good test: Arrange-Act-Assert, naming, one reason to fail
#### In one line
A good test has three clear steps (set up, do one thing, check the result), a name that reads like a sentence, and exactly one reason to fail.

#### Real-life analogy
A science experiment write-up: the setup (apparatus), the action (what you did), the observation (what you saw). If the write-up mixes all three or measures ten things at once, nobody can tell what the result means.

#### How it works
**Arrange-Act-Assert (AAA)**
1. **Arrange**: create the data and collaborators the scenario needs, as little as possible.
2. **Act**: call the code under test **once**.
3. **Assert**: check the observable result (return value, state change, call to a collaborator).

Separate the three blocks with blank lines so the shape is visible.

**Naming**: describe behaviour and context, not the function: ¦rejects enrolment when the course is full¦ beats ¦enrol test 2¦. A failure in CI should be understandable from the name alone.

**One reason to fail**: one behaviour per test. Several asserts are fine if they describe the same outcome (a returned object's fields), but not three unrelated rules.

**Keep it independent**: no test should rely on another test running first.

#### Example
¦¦¦js
// Weak: unclear name, many reasons to fail
test('enrol', async () => {
  const svc = createEnrolmentService(fakes());
  const a = await svc.enrol('L1', 'C1');
  ok(a.id);
  await svc.enrol('L1', 'C1').catch(() => {});
  eq(fakes().rows.length, 1);
});

// Better: one behaviour, clear AAA
test('rejects a second enrolment of the same learner on the same course', async () => {
  // Arrange
  const f = makeFakes([{ learnerId: 'L1', courseId: 'C1' }]);
  const svc = createEnrolmentService(f);

  // Act
  let message = '';
  try { await svc.enrol('L1', 'C1'); } catch (e) { message = e.message; }

  // Assert
  eq(message, 'ALREADY_ENROLLED');
});
¦¦¦

#### Remember it
**"Arrange, Act, Assert; name it like a sentence; one reason to fail."**
Good name patterns: ¦does X when Y¦, ¦returns X for Y¦, ¦throws X if Y¦, or Given/When/Then.
Test the **public behaviour**, not private functions.

#### Common mistakes
- Logic inside tests (loops, ifs) that can itself be wrong.
- Giant ¦beforeEach¦ setups that hide what a test really depends on.
- Names like ¦test1¦ or ¦works correctly¦.
- Asserting on things unrelated to the behaviour, which makes tests brittle.

#### Interview angle
**Q:** "What makes a good unit test?" **Say:** "It is fast, deterministic and isolated, follows Arrange-Act-Assert, has a name that states the behaviour, and has one reason to fail. It tests observable behaviour rather than implementation, so refactors do not break it." **Follow-up:** How do you decide how many assertions are too many?

### TDD: red, green, refactor
#### In one line
Test-Driven Development means writing a failing test first, then the smallest code to pass it, then cleaning up, in tiny repeated loops.

#### Real-life analogy
Drawing the target before throwing the dart. By stating exactly what "hit" means first, you cannot fool yourself afterwards by drawing the circle around wherever the dart landed.

#### How it works
1. **Red**: write one small test for the next behaviour. Run it and **watch it fail for the right reason** (not a typo).
2. **Green**: write the simplest code that makes it pass, even if it is naive or hard-coded.
3. **Refactor**: improve names and structure of both code and tests while the suite stays green.
4. Repeat with the next behaviour.

Why it helps: you design the API from the caller's point of view, you only write needed code, you get a regression suite as a by-product, and each step is small so debugging is easy.

Where it shines: business rules, parsers, utilities, API handlers. Where it is awkward: exploratory spikes and pixel-level UI work. A lead can say: "TDD for logic, test-after for exploration, but never ship without tests".

#### Example
¦¦¦js
// 1) RED: the function does not exist yet
test('gives a certificate at 70 percent or more', () => {
  eq(isCertified(70), true);
  eq(isCertified(69), false);
});
// run: ReferenceError / fails  -> good, it fails

// 2) GREEN: simplest code
function isCertified(score) {
  return score >= 70;
}
// run: passes

// 3) NEXT RED: new rule - scores must be numbers
test('rejects a non-number score', () => {
  throws(() => isCertified('90'));
});
// 4) GREEN
function isCertified(score) {
  if (typeof score !== 'number') throw new TypeError('score must be a number');
  return score >= 70;
}
¦¦¦

#### Remember it
**"Red, green, refactor."** Rules of thumb: never write production code without a failing test; write only enough test to fail; write only enough code to pass; refactor on green only.

#### Common mistakes
- Writing many tests at once, then a huge implementation (that is test-first, not TDD).
- Skipping the refactor step, which leaves messy code.
- Not seeing the test fail first, so the test might never fail at all.
- Applying TDD dogmatically to throwaway prototypes or visual layout.

#### Interview angle
**Q:** "Do you practise TDD?" **Say:** "Yes for rule-heavy code like eligibility, pricing and validators: I write a failing test, make it pass simply, then refactor. For UI exploration I prototype first, then add tests before merging. TDD gives me small steps, a better API and a safety net." **Follow-up:** What are the downsides of TDD?

### Test doubles: dummy, stub, spy, mock, fake
#### In one line
Test doubles are stand-ins for real collaborators (database, email, clock) so a test stays fast, isolated and predictable.

#### Real-life analogy
Film stunt doubles. A **dummy** is a mannequin standing in the background. A **stub** is an actor who only reads one scripted line. A **spy** watches and writes down everything that happens. A **mock** is a spy with a checklist ("the door must be knocked on twice"). A **fake** is a real but cheaper substitute, like a studio set that works as a room.

#### How it works
- **Dummy**: passed only to fill a parameter; never used. Example: ¦null¦ logger.
- **Stub**: returns fixed answers. ¦getCourse = () => ({ id: 7, capacity: 2 })¦.
- **Spy**: records calls (arguments, count) while possibly calling the real thing.
- **Mock**: a spy plus expectations that fail the test if not met. In Jest/Vitest, ¦vi.fn()¦ is both spy and stub.
- **Fake**: a lightweight working implementation, such as an in-memory repository or an in-memory email outbox.

Choosing: prefer **state verification** (assert the result or the fake's contents). Use spies and mocks when the interaction itself is the outcome ("send a welcome email once"). Over-using mocks couples tests to implementation.

#### Example
¦¦¦js
// fake: in-memory outbox that behaves like a real email service
function makeFakeMailer() {
  const sent = [];
  return { send: async (to, subject) => { sent.push({ to, subject }); }, sent };
}

test('sends one confirmation email after enrolment', async () => {
  const mailer = makeFakeMailer();                        // fake
  const repo = { find: async () => null, count: async () => 0, save: async () => {} }; // stub-ish
  const svc = createEnrolmentService({ repo, clock: { now: () => 1 }, idGen: () => 'e1', mailer });
  await svc.enrol('L1', 'C1');
  eq(mailer.sent.length, 1);                              // interaction is the outcome
  eq(mailer.sent[0].to, 'L1');
});
¦¦¦

#### Remember it
**D-S-S-M-F: "Dummy fills, Stub answers, Spy records, Mock expects, Fake works."**
Decision: need a value? stub. Need to know it was called? spy. Need realistic behaviour cheaply? fake.

#### Common mistakes
- Mocking everything, including pure helper functions you own.
- Verifying exact call order or counts when the outcome is what matters.
- Fakes that drift from the real thing; keep a few integration tests against the real service.

#### Interview angle
**Q:** "Mock vs stub?" **Say:** "A stub supplies canned data so the code can run; a mock also verifies an interaction happened. I prefer fakes and checking outcomes, and keep mocks for real side effects like emails or payments." **Follow-up:** When can too many mocks make a test worthless?

### Jest and Vitest basics: describe/it, matchers, hooks
#### In one line
Jest and Vitest are test runners with the same API: they find your test files, run them, give you ¦expect¦ matchers and mocks, and report results and coverage.

#### Real-life analogy
An exam hall invigilator. You provide the questions (tests) and the answer rules (matchers); the runner hands them out, checks answers, handles timing, and publishes a result sheet.

#### How it works
- **Structure**: ¦describe('group', () => { it('does something', () => { ... }) })¦. ¦it¦ and ¦test¦ are the same.
- **Matchers**: ¦toBe¦ (identity, ¦Object.is¦), ¦toEqual¦ (deep equality), ¦toStrictEqual¦, ¦toBeNull¦, ¦toContain¦, ¦toHaveLength¦, ¦toThrow¦, ¦toMatchObject¦, ¦resolves/rejects¦ for promises, ¦not¦ to negate.
- **Hooks**: ¦beforeEach¦ / ¦afterEach¦ run around every test; ¦beforeAll¦ / ¦afterAll¦ once per file. Use them to reset state, not to hide setup.
- **Mocks**: ¦vi.fn()¦ / ¦jest.fn()¦, ¦vi.spyOn(obj, 'method')¦, ¦vi.mock('./module')¦.
- **Filtering**: ¦test.only¦, ¦test.skip¦, ¦test.each¦ for table tests.
- **Vitest vs Jest**: Vitest reuses your Vite config, is ESM and TypeScript friendly and often faster; Jest is mature, with a very large ecosystem. The APIs are nearly identical.
- **Coverage**: ¦--coverage¦ (v8 or istanbul) outputs line and branch numbers.

#### Example
¦¦¦js
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('cart', () => {
  let cart;
  beforeEach(() => { cart = createCart(); });          // fresh state for every test

  it('starts empty', () => {
    expect(cart.items).toEqual([]);
  });

  it('adds an item and totals the price', () => {
    cart.add({ id: 1, price: 10 });
    cart.add({ id: 2, price: 5 });
    expect(cart.total()).toBe(15);
  });

  it.each([[0, 0], [100, 90], [50, 45]])('applies 10 percent discount: %i -> %i', (price, out) => {
    expect(applyDiscount(price, 10)).toBe(out);
  });
});
¦¦¦

#### Remember it
**"toBe is identity, toEqual is deep."**
- Reset state in ¦beforeEach¦, never rely on test order.
- ¦.only¦ left in a commit hides tests: add a lint rule.
- Use ¦test.each¦ for the same logic with many inputs.

#### Common mistakes
- Using ¦toBe¦ on objects or arrays and wondering why it fails.
- Sharing mutable state across tests in a module-level variable.
- Forgetting ¦vi.restoreAllMocks()¦ so mocks leak between tests.

#### Interview angle
**Q:** "Jest or Vitest?" **Say:** "They share the same API. I pick Vitest for Vite projects because it reuses the config and is fast, and Jest for existing setups. What matters is isolation, clear names, and a stable CI run." **Follow-up:** What is the difference between ¦toEqual¦ and ¦toStrictEqual¦?

### Async testing: promises, async/await, fake timers
#### In one line
For async code the test must wait for the promise (or the timer) to finish, otherwise it ends too early and passes without checking anything.

#### Real-life analogy
Sending a letter and checking the mailbox. If you check one second after posting, the mailbox is empty and you wrongly conclude nothing was delivered. You must wait for the delivery, or move the clock forward yourself.

#### How it works
- **async/await**: make the test ¦async¦ and ¦await¦ the call, or ¦return¦ the promise.
- **Promise matchers**: ¦await expect(p).resolves.toBe(x)¦ and ¦await expect(p).rejects.toThrow('msg')¦. Always ¦await¦ them.
- **Expect assertions**: ¦expect.assertions(1)¦ proves a ¦catch¦ branch really ran.
- **Fake timers**: ¦vi.useFakeTimers()¦ then ¦vi.advanceTimersByTime(500)¦ or ¦await vi.runAllTimersAsync()¦ so debounce, polling and retry tests finish instantly. Always restore with ¦vi.useRealTimers()¦.
- **UI**: use ¦await screen.findByText(...)¦ or ¦waitFor¦ for results that appear later; avoid ¦sleep¦.
- **Never** leave unhandled rejections or open handles (timers, servers); they cause flaky or hanging suites.

#### Example
¦¦¦js
async function rejectsWith(promise) {
  try { await promise; } catch (e) { return e; }
  throw new Error('expected rejection');
}

test('loads a course (awaited)', async () => {
  const course = await loadCourse(7);          // WITHOUT await this test would pass early
  eq(course.id, 7);
});

test('rejects for an unknown course', async () => {
  const err = await rejectsWith(loadCourse(-1));
  eq(err.message, 'NOT_FOUND');
});

// With a real framework and fake timers:
// vi.useFakeTimers();
// const spy = vi.fn();
// const d = debounce(spy, 300);
// d(); d(); vi.advanceTimersByTime(300);
// expect(spy).toHaveBeenCalledTimes(1);
¦¦¦

#### Remember it
**"Await it, return it, or advance it."**
If the test could end before the async work does, it is wrong. A green test that never reached its assertion is worse than no test.

#### Common mistakes
- Forgetting ¦await¦ on ¦expect(...).resolves¦.
- Using ¦setTimeout(..., 1000)¦ in tests, which is slow and still racy.
- Not restoring real timers, which breaks the next test file.
- Asserting inside a ¦.then¦ that the test never waits for.

#### Interview angle
**Q:** "How do you test a debounced search?" **Say:** "Use fake timers: call the function several times, advance the clock by the debounce delay, and assert the handler ran once with the last arguments. No real waiting, and it is deterministic." **Follow-up:** How do you prove a ¦catch¦ branch actually executed?

### Mocking modules, fetch and HTTP (vi.fn, jest.mock, MSW)
#### In one line
Mocking replaces slow or unpredictable dependencies (network, payment, email) with controlled ones; the best place to do it is at the boundary you do not own.

#### Real-life analogy
Rehearsing a play with a stand-in for an unavailable actor. You do not rebuild the theatre (too much), and you do not skip the scene (untested); you put someone in the role who says the right lines on cue.

#### How it works
Three levels, from simplest to most realistic:
1. **Replace a function**: ¦const fetchCourse = vi.fn().mockResolvedValue({ id: 7 })¦ and inject it.
2. **Replace a module**: ¦vi.mock('./api')¦ or ¦jest.mock('./api')¦ swaps the whole import. Quick, but ties the test to **how** you call the network.
3. **Intercept the network (MSW)**: Mock Service Worker answers real HTTP requests with handlers, so your real fetch client, headers, parsing and error handling all run. The same handlers can serve Storybook, local dev and E2E.

Guidelines: mock what you do **not** own (HTTP, payments, email, time); do not mock your own pure functions; reset mocks in ¦afterEach¦; test error responses (500, timeout, malformed JSON), not only success.

#### Example
¦¦¦js
// Level 1: inject the dependency (works in the playground, no framework needed)
async function getCourseTitle(id, fetchJson) {
  const course = await fetchJson('/api/courses/' + id);
  return course.title.toUpperCase();
}
test('uppercases the title using the injected fetcher', async () => {
  const calls = [];
  const fakeFetch = async (url) => { calls.push(url); return { title: 'react basics' }; };
  eq(await getCourseTitle(7, fakeFetch), 'REACT BASICS');
  eq(calls, ['/api/courses/7']);
});

// Level 3 with MSW (in a real project):
// import { http, HttpResponse } from 'msw';
// server.use(http.get('/api/courses/7', () => HttpResponse.json({ title: 'react basics' })));
// server.use(http.get('/api/courses/9', () => new HttpResponse(null, { status: 500 })));
¦¦¦

#### Remember it
**"Mock at the edge, not in the middle."**
Hierarchy: inject a fake > MSW > module mock. Always add an error-response test.

#### Common mistakes
- Mocking your own modules so heavily that the test only proves the mock works.
- Forgetting to reset or restore mocks, causing leaks between tests.
- Never testing failure responses, so the error UI is untested.
- Different mocked data shape than the real API; use shared types or contract tests.

#### Interview angle
**Q:** "How do you mock API calls in React tests?" **Say:** "I use MSW so the real fetch layer runs, and I cover loading, success, empty and error. I use module mocks only when something is genuinely not interceptable." **Follow-up:** How do you keep mocked responses in sync with the real API?

### Test data: factories and builders instead of giant fixtures
#### In one line
A factory creates fresh, valid test objects with sensible defaults, so each test states only the fields it cares about.

#### Real-life analogy
A costume rack with a base outfit. For each scene you just swap the hat, instead of keeping 200 separate full costumes where nobody remembers which one has the torn sleeve.

#### How it works
- **Fixture files** (a huge JSON with 50 users) grow stale, hide what a test depends on, and cause accidental coupling: change one record and 12 tests fail.
- A **factory** returns a new object per call: ¦buildLearner({ role: 'admin' })¦. Defaults are valid and unique (counters or random-but-seeded values).
- A **builder** chains: ¦aLearner().withRole('admin').enrolledIn(course).build()¦, handy for related objects.
- For databases, factories **insert** rows (¦createLearner()¦) and return them; clean up by rolling back the transaction.
- Keep defaults minimal and valid; overriding makes the interesting part stand out ("this test is about an expired subscription").

#### Example
¦¦¦js
function createFactory(defaults) {
  let seq = 0;
  function build(overrides = {}) {
    seq += 1;
    const out = {};
    for (const key of Object.keys(defaults)) {
      const v = defaults[key];
      out[key] = typeof v === 'function' ? v(seq) : structuredClone(v);
    }
    return Object.assign(out, overrides);
  }
  return { build };
}

const learner = createFactory({
  id: (n) => n,
  email: (n) => 'learner' + n + '@example.com',
  role: 'learner',
  courses: [],
});

test('admins can enrol others', () => {
  const admin = learner.build({ role: 'admin' });   // only the relevant field is visible
  eq(canEnrolOthers(admin), true);
});
¦¦¦

#### Remember it
**"Defaults for the boring, overrides for the point."**
Each test builds its own data. Never share rows or objects between tests.

#### Common mistakes
- A single shared ¦testUser¦ object that tests mutate.
- Random data without a seed, so failures cannot be reproduced.
- Factories with so much logic they need their own tests.
- Over-specifying fields that the test does not care about.

#### Interview angle
**Q:** "How do you manage test data?" **Say:** "Factories with valid defaults and per-test overrides, unique values from sequences, inserted through the real repository for integration tests, and each test isolated by a rolled-back transaction. I avoid big shared fixtures." **Follow-up:** How do you debug a test that fails only when run with others?

### Code coverage: what the percentage does and does not tell you
#### In one line
Coverage tells you which lines and branches your tests executed, not whether those tests check anything meaningful.

#### Real-life analogy
A security guard's patrol log shows every door was walked past. It does not prove any door was tried or locked. Coverage is the patrol log; assertions are checking the handle.

#### How it works
Metrics: **line**, **statement**, **function**, **branch** (each side of ¦if¦, ¦?:¦, ¦&&¦). Branch coverage is the most telling.

Uses:
- Find **untested code**, especially error and edge branches.
- Detect dead code.
- Apply a floor on **changed lines** (for example 80%) in CI.

Limits:
- A test with no assertion still yields coverage.
- 100% coverage can hide missing cases (wrong boundaries, missing requirements).
- Chasing a global number produces low-value tests (testing getters) and gaming.
- Coverage ignores untested **combinations** and integration behaviour.

Better quality signals: mutation score, escaped-defect count, and review. Treat coverage as a smoke detector, not a goal.

#### Example
¦¦¦js
function canCertify(score, attempts) {
  if (attempts > 3) return false;
  return score >= 70;
}

// This single test gives 100% line coverage, yet protects very little:
test('certifies a strong learner', () => {
  eq(canCertify(85, 1), true);
});

// Boundaries make the same code truly tested:
test('boundaries', () => {
  eq(canCertify(70, 3), true);
  eq(canCertify(69, 1), false);
  eq(canCertify(85, 4), false);
});
¦¦¦

#### Remember it
**"Coverage shows what ran, not what was checked."**
Sensible policy: no mandated global percentage; require tests for new code, watch the trend, and review branches that are red.

#### Common mistakes
- Demanding 100% and getting assertion-free tests.
- Excluding hard code from coverage to hit the target.
- Mistaking coverage for quality in reports to management.
- Ignoring branch coverage and looking only at lines.

#### Interview angle
**Q:** "What coverage do you aim for?" **Say:** "I use coverage to find gaps, with a floor on changed code rather than a global target. Quality is better judged by boundary tests, mutation testing on critical modules, and escaped defects." **Follow-up:** How could a test suite have 100% coverage and still miss an obvious bug?

### Testing pitfalls: implementation details, shared state, over-mocking
#### In one line
Most bad suites fail in three ways: they test how code works instead of what it does, they share state between tests, and they mock so much that nothing real is tested.

#### Real-life analogy
Judging a restaurant by checking which pan the chef used (implementation) instead of tasting the dish (behaviour); sharing one dirty plate between tables (shared state); and tasting a plastic model of the dish (over-mocking).

#### How it works
1. **Implementation details**: asserting private functions, internal state, CSS classes, call order. A harmless refactor breaks the tests, so people stop refactoring or stop trusting tests. Fix: assert **observable behaviour** (output, rendered text, HTTP response, side effect at the boundary).
2. **Shared state / order dependence**: module-level variables, a shared database row, a mock that is not reset. Tests pass alone and fail together. Fix: fresh data per test, reset mocks, run tests in random order occasionally.
3. **Over-mocking**: mocking collaborators that are cheap and deterministic, so the test mirrors the implementation line by line. Fix: use real objects or fakes, mock only the edges.
4. Others: logic in tests, huge setups, asserting too much, sleeping instead of waiting, ignoring failure paths, testing the framework.

#### Example
¦¦¦js
// Smell: tests the implementation (how), breaks on refactor
test('calls helper', () => {
  const spy = mockFn(() => 'x');
  service.render(spy);
  ok(spy.calledWith('header', 'footer', 42));      // checks the call, not the result
});

// Better: assert the visible outcome
test('renders title and footer', () => {
  const html = service.render();
  ok(html.includes('Clinical Learning Hub'));
  ok(html.includes('Footer'));
});

// Smell: shared state
let counter = 0;                      // module level, mutated by tests
test('a', () => { counter++; eq(counter, 1); });
test('b', () => { counter++; eq(counter, 1); });   // fails when run after "a"
¦¦¦

#### Remember it
**"Test the what, isolate every test, mock only the edge."**
Refactor test: if you change internals without changing behaviour and a test fails, that test is a smell.

#### Common mistakes
- Fixing flaky shared-state tests with ¦retry¦ instead of isolation.
- Snapshotting big trees as a lazy assertion.
- Over-specifying: asserting every property of a big object when one field matters.

#### Interview angle
**Q:** "What makes a test brittle?" **Say:** "Coupling to implementation: private methods, internal state, CSS selectors, exact call counts, and heavy mocking. I assert behaviour at public boundaries, keep tests independent, and mock only external systems." **Follow-up:** How would you rescue a suite that breaks with every refactor?

## Phase 2 · Practical testing in your stack (Intermediate)
### React Testing Library: queries by role, accessibility-first
#### In one line
React Testing Library (RTL) renders your component and lets you find things the way a user or screen reader does, so tests survive refactors and double as accessibility checks.

#### Real-life analogy
A mystery shopper. They do not inspect the shop's wiring (state, hooks); they walk in, look for the sign that says "Enrol", press it and see what happens. If the sign disappears, they notice.

#### How it works
- Guiding principle: *"The more your tests resemble the way your software is used, the more confidence they can give you."*
- ¦render(<Component />)¦ mounts it into a virtual DOM; ¦screen¦ queries the document.
- **Query priority**: ¦getByRole¦ (with ¦name¦) > ¦getByLabelText¦ > ¦getByPlaceholderText¦ > ¦getByText¦ > ¦getByDisplayValue¦ > ¦getByAltText¦ > ¦getByTitle¦ > ¦getByTestId¦ (last resort).
- Query families: ¦getBy¦ (must exist, throws), ¦queryBy¦ (may be ¦null¦, use to assert absence), ¦findBy¦ (async, waits), plus ¦...AllBy...¦.
- Matchers from ¦@testing-library/jest-dom¦: ¦toBeInTheDocument¦, ¦toBeVisible¦, ¦toHaveAttribute¦, ¦toBeDisabled¦, ¦toHaveTextContent¦.
- ¦screen.debug()¦ and ¦logRoles(container)¦ show what is available to query; Testing Playground suggests the best query.

#### Example
¦¦¦js
import { render, screen } from '@testing-library/react';

test('shows the course title and an enabled enrol button', () => {
  render(<CourseCard course={{ id: 7, title: 'React Basics', full: false }} />);

  expect(screen.getByRole('heading', { name: 'React Basics' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /enrol/i })).toBeEnabled();
});

test('disables enrolment when the course is full', () => {
  render(<CourseCard course={{ id: 7, title: 'React Basics', full: true }} />);
  expect(screen.getByRole('button', { name: /enrol/i })).toBeDisabled();
  expect(screen.getByText(/course is full/i)).toBeInTheDocument();
});
¦¦¦

#### Remember it
**"Find it like a user: role, label, text. Test id is the last resort."**
If ¦getByRole¦ cannot find it, your markup may be inaccessible, and that is a real bug.

#### Common mistakes
- Using ¦container.querySelector('.btn')¦ or ¦data-testid¦ everywhere.
- Checking component state or props instead of rendered output.
- Using ¦getBy¦ to assert something is absent (use ¦queryBy¦).
- Wrapping everything in ¦act()¦ manually; RTL already handles it.

#### Interview angle
**Q:** "Why RTL over Enzyme?" **Say:** "Enzyme encouraged testing internals like state and instances, which break on refactor. RTL tests what users see and do, so the tests are resilient and encourage accessible markup. I query by role and label first." **Follow-up:** When is it acceptable to use ¦data-testid¦?

### user-event: testing clicks, typing and forms
#### In one line
user-event simulates what a person really does (focus, type character by character, click, tab) so your form and interaction tests are realistic.

#### Real-life analogy
A crash-test dummy that behaves like a driver, braking, steering and pressing buttons in sequence, instead of a robot that teleports the car into its final state.

#### How it works
- ¦fireEvent.click¦ fires a single raw DOM event. ¦userEvent.click¦ simulates the full sequence (pointer move, down, up, focus, click), so disabled and hidden elements behave as in a browser.
- Set up once per test: ¦const user = userEvent.setup()¦, then ¦await user.type(input, 'abc')¦, ¦await user.click(button)¦, ¦await user.selectOptions(...)¦, ¦await user.tab()¦, ¦await user.keyboard('{Enter}')¦.
- All user-event calls are **async**: always ¦await¦.
- After interaction, assert on the **result a person sees**: an error message, a disabled button, a navigation, a success status; use ¦findBy¦ for async outcomes.
- Test forms end to end: labels, required fields, validation messages, submit payload (via a mocked handler or MSW), success and failure.

#### Example
¦¦¦js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('shows a validation error, then submits a valid form', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<LoginForm onSubmit={onSubmit} />);

  await user.click(screen.getByRole('button', { name: /sign in/i }));
  expect(await screen.findByRole('alert')).toHaveTextContent(/email is required/i);
  expect(onSubmit).not.toHaveBeenCalled();

  await user.type(screen.getByLabelText(/email/i), 'ana@example.com');
  await user.type(screen.getByLabelText(/password/i), 'secret123');
  await user.click(screen.getByRole('button', { name: /sign in/i }));

  expect(onSubmit).toHaveBeenCalledWith({ email: 'ana@example.com', password: 'secret123' });
});
¦¦¦

#### Remember it
**"setup, await, assert the visible result."**
Test keyboard paths too: Tab order, Enter to submit, Escape to close dialogs.

#### Common mistakes
- Not awaiting user-event calls, so assertions run too early.
- Asserting that a handler was called but never checking what the user sees.
- Using ¦fireEvent¦ for everything and missing disabled or pointer-event behaviour.
- Typing into inputs found by test id instead of label.

#### Interview angle
**Q:** "fireEvent vs userEvent?" **Say:** "fireEvent dispatches one low-level event; userEvent reproduces the real sequence a browser produces, including focus and typing per character. I use userEvent so tests catch problems like clicking a disabled button." **Follow-up:** How do you test a keyboard-only flow?

### Testing custom hooks and context providers
#### In one line
Test hooks through the behaviour they give a component, using ¦renderHook¦ for reusable hooks and the real provider for anything that reads context.

#### Real-life analogy
A car engine can be tested on a bench (hook alone), but a hook that depends on the car's electrics (context) must be tested with those electrics connected, or the engine never starts.

#### How it works
- A hook cannot run outside a component. ¦renderHook(() => useCounter())¦ renders a tiny host component and returns ¦result.current¦.
- Use ¦act¦ (or the helpers that wrap it) when calling functions that update state: ¦act(() => result.current.increment())¦.
- Use ¦rerender(newProps)¦ to test dependency changes, and ¦unmount()¦ to verify cleanup (listeners, timers, subscriptions).
- Context-dependent hooks: pass a ¦wrapper¦ that supplies the provider (React Query client, router, auth context). Create a **fresh** client per test.
- Often better: test the hook **through a component** that uses it, since that is how users meet it.
- Async hooks: ¦await waitFor(() => expect(result.current.data).toBeDefined())¦.

#### Example
¦¦¦js
import { renderHook, act } from '@testing-library/react';

function useToggle(initial = false) {
  const [on, setOn] = React.useState(initial);
  const toggle = React.useCallback(() => setOn((v) => !v), []);
  return [on, toggle];
}

test('toggles between true and false', () => {
  const { result } = renderHook(() => useToggle());
  expect(result.current[0]).toBe(false);
  act(() => result.current[1]());
  expect(result.current[0]).toBe(true);
});

test('hooks that need context use a wrapper', () => {
  const wrapper = ({ children }) => (
    <AuthProvider value={{ user: { role: 'admin' } }}>{children}</AuthProvider>
  );
  const { result } = renderHook(() => useCanEdit(), { wrapper });
  expect(result.current).toBe(true);
});
¦¦¦

#### Remember it
**"renderHook for the hook, wrapper for the world it needs."**
Test the contract (inputs, returned values, cleanup), not the internal ¦useState¦ calls.

#### Common mistakes
- Forgetting ¦act¦ and seeing "not wrapped in act" warnings.
- Reusing one React Query client across tests, leaking cache.
- Testing implementation (how many times ¦useEffect¦ ran).
- Forgetting to test unmount cleanup for subscriptions.

#### Interview angle
**Q:** "How do you test a custom hook?" **Say:** "With ¦renderHook¦, wrapping providers when needed, ¦act¦ around updates and ¦waitFor¦ for async results. For hooks tightly tied to UI I test them through the component. I also test cleanup on unmount." **Follow-up:** How do you test a hook that depends on timers?

### Testing data-fetching components: loading, error, empty and success
#### In one line
Every component that loads data has at least four visual states, and a good test covers all of them.

#### Real-life analogy
A vending machine has four situations: you pressed the button and it is working (loading), it dispensed (success), it is empty (empty), and it jammed (error). Only testing the happy snack misses the angry customers.

#### How it works
1. Intercept the network with **MSW** so the component's real fetch code runs.
2. **Loading**: render and assert the spinner or skeleton (¦getByRole('status')¦ or text) before data arrives.
3. **Success**: ¦await screen.findByText('React Basics')¦ (async query) to see the list.
4. **Empty**: handler returns ¦[]¦; assert the friendly empty message and the call to action.
5. **Error**: handler returns 500 or network error; assert the error message and the retry button, then click retry and assert recovery.
6. Create a **new QueryClient / cache per test** with ¦retry: false¦ so errors show immediately.
7. Assert **requests too** when it matters (query params after filtering, pagination), by reading the handler's request.

#### Example
¦¦¦js
import { http, HttpResponse } from 'msw';

test('shows courses', async () => {
  server.use(http.get('/api/courses', () => HttpResponse.json([{ id: 1, title: 'React Basics' }])));
  renderWithClient(<CourseList />);
  expect(screen.getByRole('status')).toHaveTextContent(/loading/i);
  expect(await screen.findByText('React Basics')).toBeInTheDocument();
});

test('shows an empty state', async () => {
  server.use(http.get('/api/courses', () => HttpResponse.json([])));
  renderWithClient(<CourseList />);
  expect(await screen.findByText(/no courses yet/i)).toBeInTheDocument();
});

test('shows an error with a retry button', async () => {
  server.use(http.get('/api/courses', () => new HttpResponse(null, { status: 500 })));
  renderWithClient(<CourseList />);
  expect(await screen.findByRole('alert')).toHaveTextContent(/something went wrong/i);
  expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
});
¦¦¦

#### Remember it
**"L-S-E-E: Loading, Success, Empty, Error."**
Add a fifth when relevant: **partial or stale** (cached data shown while refreshing).

#### Common mistakes
- Only testing success.
- Using real timers and ¦sleep¦ to wait for data instead of ¦findBy¦.
- Letting a shared query cache leak between tests.
- Mocking ¦fetch¦ with a function that does not match the real response shape.

#### Interview angle
**Q:** "How do you test a component that calls an API?" **Say:** "Mock the network with MSW, wrap the component in a fresh query client, and test loading, success, empty and error states with async queries. I also assert the request when parameters matter." **Follow-up:** How do you test optimistic updates?

### Snapshot testing: when it helps and when it hurts
#### In one line
A snapshot test saves the output the first time and fails when it later changes; it is quick to write but only useful when the output is small, stable and reviewed.

#### Real-life analogy
Taking a photo of your tidy desk and later comparing. It tells you "something changed", but not whether the change is good, and if the desk is huge you will stop looking at the photos.

#### How it works
- ¦expect(value).toMatchSnapshot()¦ writes ¦__snapshots__/file.snap¦ on the first run; later runs compare. ¦toMatchInlineSnapshot()¦ keeps the expected text inside the test (preferred, because reviewers see it).
- **Good uses**: error message objects, generated config, API response shapes, serialisation formats, small pure presentational components, CLI output.
- **Bad uses**: large component trees (hundreds of lines of noise), output with dates, ids or random values, anything people update with ¦-u¦ without reading.
- Make output deterministic first: fixed clock, seeded ids, ¦expect.any(String)¦ or property matchers.
- Review snapshot changes like code; fail CI when snapshots are obsolete.
- Prefer explicit assertions: ¦expect(screen.getByRole('alert')).toHaveTextContent('...')¦ says what matters.

#### Example
¦¦¦js
// Good: small, deterministic, readable inline snapshot
test('builds the certificate payload', () => {
  const payload = buildCertificate({ name: 'Ana', course: 'React', date: '2025-01-01' });
  expect(payload).toMatchInlineSnapshot(¦
    {
      "course": "React",
      "holder": "Ana",
      "issued": "2025-01-01",
      "title": "Certificate of Completion",
    }
  ¦);
});

// Bad: a 400-line snapshot of the whole page nobody reads
// expect(container).toMatchSnapshot();
¦¦¦

#### Remember it
**"Small, stable, reviewed. Otherwise write an explicit assertion."**
A snapshot that is regularly updated without thought is noise.

#### Common mistakes
- Blindly pressing "update snapshots".
- Snapshotting entire pages and styles.
- Including timestamps, random ids or absolute paths.
- Treating snapshots as a replacement for behaviour tests.

#### Interview angle
**Q:** "Do you use snapshots?" **Say:** "Sparingly: inline snapshots for small deterministic output such as payloads or messages. For UI I assert behaviour with RTL, because big snapshots create noisy diffs that people approve without reading." **Follow-up:** How would you remove a codebase's dependence on huge snapshots?

### Testing Express APIs with Supertest
#### In one line
Supertest sends real HTTP-style requests to your Express app in memory, so you can test status codes, headers and JSON bodies without opening a port.

#### Real-life analogy
A mystery caller phoning your reception desk. They do not look at the staff rota (internals); they ask questions and judge the answers you give, including what happens when they give the wrong code.

#### How it works
- Export the ¦app¦ from one file and call ¦listen¦ in another (¦server.js¦), so tests import the app only.
- ¦request(app).post('/api/enrolments').send(body).set('Authorization', 'Bearer ...').expect(201)¦.
- Assert status, ¦res.body¦, headers (¦Content-Type¦, ¦Location¦), and side effects (a row in a test DB or a call to a fake mailer).
- **Cover each rule once**: success, validation (400), unauthenticated (401), forbidden (403), not found (404), conflict (409), server error (500, by injecting a failing dependency).
- **Isolation**: reset the database or use per-test transactions; inject fakes for email, payments and clock through the app factory: ¦createApp({ repo, mailer, clock })¦.
- Keep route tests **thin** and push business rules into services that have fast unit tests.

#### Example
¦¦¦js
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('POST /api/enrolments', () => {
  let app, repo, mailer;
  beforeEach(() => {
    repo = makeInMemoryRepo();
    mailer = makeFakeMailer();
    app = createApp({ repo, mailer, clock: { now: () => 1700000000000 } });
  });

  it('creates an enrolment and sends one email', async () => {
    const res = await request(app).post('/api/enrolments').set(authFor('learner-1'))
      .send({ courseId: 'C1' }).expect(201);
    expect(res.body).toMatchObject({ courseId: 'C1', status: 'active' });
    expect(mailer.sent).toHaveLength(1);
  });

  it('rejects an invalid body with 400', async () => {
    const res = await request(app).post('/api/enrolments').set(authFor('learner-1')).send({}).expect(400);
    expect(res.body.error).toMatch(/courseId/);
  });

  it('requires a token', async () => {
    await request(app).post('/api/enrolments').send({ courseId: 'C1' }).expect(401);
  });
});
¦¦¦

#### Remember it
**"App without listen, one test per rule, fakes at the edge."**
Test the error format too, since the frontend relies on it.

#### Common mistakes
- Starting the real server on a fixed port, causing clashes in parallel runs.
- Sharing database state between tests.
- Only testing the 200 path.
- Forgetting to close DB pools and servers, so Jest hangs.

#### Interview angle
**Q:** "How do you test your REST APIs?" **Say:** "Supertest against an app factory with a test database or fakes, covering success, validation, auth, not-found, conflict and server-error paths, and asserting side effects such as emails. Business rules also get unit tests." **Follow-up:** How do you test an endpoint that depends on the current time?

### Testing database code: test DB, transaction rollback, Sequelize
#### In one line
Test queries and constraints against a real database of the same type as production, and keep tests isolated by rolling back each one in a transaction or resetting data.

#### Real-life analogy
A flight simulator that uses the real cockpit. Practising on a toy version (SQLite or a mock) hides the exact buttons that fail in the real aircraft, and a reset button between flights stops one crash from affecting the next.

#### How it works
- **Real MySQL in a container** (Docker or a CI service) is the most faithful way to test migrations, constraints, indexes, JSON and locking behaviour.
- **Isolation options**:
  1. Wrap each test in a transaction and **roll back** at the end (fast, but cannot test code that commits its own transactions).
  2. **Truncate** tables in ¦beforeEach¦ (simple, slower).
  3. A **new schema per worker** for parallel runs.
- Run migrations once before the suite (¦sequelize-cli db:migrate¦ or umzug), seed minimal reference data.
- Use **factories** to insert data, and assert on database state, not on SQL strings.
- Pure business logic should be unit-tested with an **in-memory fake repository**; keep DB tests focused on queries, constraints, transactions and unique-violation handling.
- Test concurrency scenarios deliberately: two parallel enrolments for the last seat, optimistic-lock conflicts.

#### Example
¦¦¦js
import { sequelize, Learner, Enrolment } from '../src/models';

describe('Enrolment model', () => {
  let t;
  beforeEach(async () => { t = await sequelize.transaction(); });
  afterEach(async () => { await t.rollback(); });                 // isolation

  it('enforces a unique learner and course pair', async () => {
    const learner = await Learner.create({ email: 'a@x.com' }, { transaction: t });
    await Enrolment.create({ learnerId: learner.id, courseId: 1 }, { transaction: t });
    await expect(
      Enrolment.create({ learnerId: learner.id, courseId: 1 }, { transaction: t })
    ).rejects.toThrow(/unique/i);
  });
});
¦¦¦

#### Remember it
**"Same engine as production, fresh state per test."**
Fast and many: fakes. Few and realistic: real DB for queries, constraints and transactions.

#### Common mistakes
- Using SQLite in tests for a MySQL app and missing dialect differences.
- Letting tests share rows and depend on order.
- Asserting on generated SQL text.
- Never testing migrations (a broken migration is a production outage).

#### Interview angle
**Q:** "How do you test code that uses Sequelize?" **Say:** "Business rules against a fake repository for speed; queries, constraints, transactions and migrations against a real MySQL in Docker, with each test rolled back or truncated, and data from factories. I add explicit concurrency tests for scarce resources." **Follow-up:** What do you do when code under test commits its own transaction?

### Testing authentication, authorisation and error paths
#### In one line
Security rules are behaviour like any other, so test who is allowed in, who is kept out, and what happens when things go wrong.

#### Real-life analogy
A building with badge readers. You do not only test that the CEO's badge opens the door; you check that an expired badge, a visitor badge and no badge are all refused, and that the refusal message does not leak anything.

#### How it works
Build a **matrix** per protected endpoint:

| Case | Expected |
|---|---|
| No token | 401 |
| Invalid or expired token | 401 |
| Valid token, wrong role | 403 |
| Valid token, right role | 2xx |
| Valid token, another user's resource | 403 or 404 |

- Create tokens through a **test helper** (sign with the test secret, set role and expiry); avoid calling real login in every test.
- Test token expiry with a fixed clock.
- Check responses do not leak internals (no stack traces, no hints about which email exists).
- Frontend: route guards redirect unauthenticated users; protected UI is not rendered for the wrong role; session-expiry flows show a message.
- **Error paths**: validation errors, dependency timeouts, malformed JSON, oversized payloads, and a failing downstream service (stub it to throw) should give clean, consistent errors.
- Negative and abuse tests: SQL-injection-like strings, XSS payloads in inputs, rate limiting returns 429.

#### Example
¦¦¦js
describe('GET /api/admin/reports', () => {
  it.each([
    ['no token', {}, 401],
    ['expired token', authFor('u1', { role: 'admin', expired: true }), 401],
    ['learner role', authFor('u1', { role: 'learner' }), 403],
    ['admin role', authFor('u2', { role: 'admin' }), 200],
  ])('%s -> %i', async (_name, headers, status) => {
    await request(app).get('/api/admin/reports').set(headers).expect(status);
  });

  it('does not leak existence of other users resources', async () => {
    const res = await request(app).get('/api/enrolments/of-someone-else').set(authFor('u1')).expect(404);
    expect(res.text).not.toMatch(/stack|sql/i);
  });
});
¦¦¦

#### Remember it
**"401 who are you, 403 not allowed, 404 or 403 for others' data. Test the no-paths."**
A missing permission check never shows up in a happy-path test.

#### Common mistakes
- Testing only the successful login.
- Real third-party auth calls in tests.
- Not testing horizontal access (user A reading user B's data).
- Error responses that differ per path, confusing the frontend.

#### Interview angle
**Q:** "How do you test authorisation?" **Say:** "A role-and-ownership matrix per endpoint using generated tokens, including expired tokens and other users' resources, plus frontend guards. I verify responses do not leak internals and add negative tests for abuse." **Follow-up:** How would you test that a role change takes effect immediately?

### Contract testing and API schema validation
#### In one line
A contract test checks that what one service sends is exactly what another expects, without running both systems together.

#### Real-life analogy
Two companies agree a standard shipping form: box size, label position, fields. Each tests its own side against the form, so the boxes always fit even if the companies never meet.

#### How it works
- **Consumer-driven contracts (Pact)**: the consumer (React app or another service) writes tests describing the requests it makes and the responses it needs. This generates a contract file. The **provider** (API) replays those requests in its own pipeline and verifies it responds correctly. A broker (Pact Broker or PactFlow) stores contracts and answers "can I deploy?".
- **Schema-first**: an OpenAPI/JSON Schema document is the single truth. Validate responses against it in tests (¦ajv¦, ¦zod¦, ¦openapi-response-validator¦), and generate TypeScript types from it so mismatches fail at compile time.
- **Runtime validation** with ¦zod¦ at the API edge turns unknown JSON into typed data and gives clear errors.
- Compared with E2E: contract tests are fast, deterministic and pinpoint which side broke.
- Contracts cover **shape and key semantics**, not full business logic.

#### Example
¦¦¦js
import { z } from 'zod';

const EnrolmentResponse = z.object({
  id: z.string(),
  courseId: z.string(),
  status: z.enum(['active', 'completed', 'cancelled']),
  enrolledAt: z.string().datetime(),
});

test('POST /enrolments responds with the agreed shape', async () => {
  const res = await request(app).post('/api/enrolments').set(authFor('u1')).send({ courseId: 'C1' }).expect(201);
  const parsed = EnrolmentResponse.safeParse(res.body);
  expect(parsed.success).toBe(true);        // fails with a precise message if the shape drifts
});
¦¦¦

#### Remember it
**"Agree the form, test your side of it."**
Use contracts when teams deploy independently; use shared schema/types when one team owns both sides.

#### Common mistakes
- Writing mocks by hand that quietly differ from the real API.
- Treating contract tests as a replacement for all integration tests.
- Over-specifying values the consumer does not use (makes provider changes painful).
- Not versioning the contract when the API evolves.

#### Interview angle
**Q:** "How do you prevent breaking API changes?" **Say:** "Schema-first design with generated types, runtime validation at the edge, and consumer-driven contract tests in CI that block deployments. It is faster and more reliable than coordinating full E2E environments." **Follow-up:** How do you evolve an API without breaking existing consumers?

### Accessibility testing with jest-axe and axe-core
#### In one line
Automated tools such as axe find many common accessibility bugs for free, and your RTL queries already push you towards accessible markup.

#### Real-life analogy
A building inspector with a checklist: wheelchair ramps, signage, fire exits. The checklist finds the obvious violations quickly, but you still need people to walk the building to see if it is truly usable.

#### How it works
- **jest-axe**: ¦expect(await axe(container)).toHaveNoViolations()¦ in component tests; **axe-core** in Cypress (¦cy.injectAxe()¦, ¦cy.checkA11y()¦) or Playwright (¦@axe-core/playwright¦) for full pages.
- Catches: missing labels and alt text, invalid ARIA, duplicate ids, colour contrast (in a real browser), missing landmarks, empty buttons.
- **Static**: ¦eslint-plugin-jsx-a11y¦ in the editor and CI.
- **Lighthouse CI** gives an accessibility score trend.
- **RTL as a check**: if ¦getByRole('button', { name: ... })¦ fails, a screen reader user would also struggle.
- **Cannot be automated**: keyboard flow and focus order, focus trapping in dialogs, meaningful alt text and headings, screen-reader announcements for live updates, zoom and reflow, cognitive load. Schedule manual checks with a keyboard and a screen reader (NVDA, VoiceOver).
- Aim for WCAG 2.2 AA; put accessibility in the definition of done for the component library.

#### Example
¦¦¦js
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('the enrolment dialog has no detectable accessibility violations', async () => {
  const { container } = render(<EnrolDialog open course={{ title: 'React Basics' }} />);
  expect(await axe(container)).toHaveNoViolations();
});

test('the dialog is reachable by role and has a name', () => {
  render(<EnrolDialog open course={{ title: 'React Basics' }} />);
  expect(screen.getByRole('dialog', { name: /enrol on react basics/i })).toBeInTheDocument();
});
¦¦¦

#### Remember it
**"Automation finds about a third; people find the rest."**
Test with the keyboard, zoom to 200%, and try a screen reader on every new component.

#### Common mistakes
- Treating a green axe run as "accessible".
- Colour contrast checks in jsdom (they need a real browser).
- Adding ¦aria-label¦ everywhere instead of using native elements.
- Testing only the default state, not error, focus and open states.

#### Interview angle
**Q:** "How do you test accessibility?" **Say:** "Layers: lint rules while coding, role- and label-based queries in RTL, jest-axe in component tests, axe in E2E for pages, and manual keyboard and screen-reader checks. Automation covers perhaps a third, so the manual pass remains part of done." **Follow-up:** How do you test focus management in a modal?

### Flaky tests: causes and fixes
#### In one line
A flaky test passes and fails on the same code; fix the cause, because retrying only hides the problem and erodes trust.

#### Real-life analogy
A smoke alarm that sometimes beeps for no reason. After a while everyone ignores it, and on the day there is a real fire nobody gets up.

#### How it works
Typical causes and fixes:

| Cause | Fix |
|---|---|
| Real time, dates, timezones | inject a clock, fake timers, fixed system time |
| Randomness, ids | seed generators, inject ¦idGen¦ |
| Async races, missing awaits | await the right thing, ¦findBy¦, wait on network alias, no fixed sleeps |
| Shared state, test order | fresh data per test, reset mocks and DB, randomise order in CI to expose it |
| Network and third parties | stub with MSW or fakes |
| Environment (slow CI, animations, resolution) | fixed viewport, disable animations, pin versions, adequate resources |
| Concurrency in the app itself | real bug: fix the race, add a test |

Process: 1) **detect** (track failures per test, run suspects in a loop with ¦--repeat¦ or a stress job), 2) **quarantine** visibly (tagged, still run, does not block), 3) **diagnose** with traces, logs and videos, 4) **fix** the cause, 5) **prevent** with lint rules (no ¦.only¦, no ¦sleep¦) and review. Measure the flake rate and make it a team metric.

#### Example
¦¦¦js
// Flaky: depends on real time
test('shows today', () => {
  eq(label(new Date()), 'Today');
});

// Fixed: inject the clock
function label(date, now = () => new Date()) {
  const n = now();
  return date.toDateString() === n.toDateString() ? 'Today' : date.toDateString();
}
test('shows Today for the current day', () => {
  const fixed = () => new Date('2025-03-05T10:00:00Z');
  eq(label(new Date('2025-03-05T09:00:00Z'), fixed), 'Today');
});
¦¦¦

#### Remember it
**"Time, order, state, network, async: the five flake sources."**
Never "fix" with ¦retry¦ or a bigger timeout without understanding the cause.

#### Common mistakes
- Increasing timeouts until it passes on your laptop.
- Re-running CI until green.
- Marking tests ¦skip¦ and forgetting them.
- Not recording evidence (trace, video) when it fails.

#### Interview angle
**Q:** "How do you deal with flaky tests?" **Say:** "Measure them, quarantine so they stop blocking, find the cause using traces and loops (usually time, shared state or async waits), fix it properly and add a rule to prevent the pattern. Retries are only a temporary mitigation with reporting." **Follow-up:** How would you find a test that only fails when run after another test?

### Testing in CI: parallelism, retries, quality gates
#### In one line
Continuous Integration runs your tests on every change; a good pipeline is fast, ordered from cheap to expensive, and blocks merges that break the rules.

#### Real-life analogy
Airport security with lanes: a quick scan first (lint, types), then baggage check (unit and integration), and a full interview only for the few flagged cases (E2E). Everyone is checked, but the cheap checks catch most problems before the expensive ones start.

#### How it works
- **Order for fast feedback**: install with cache → lint and type-check → unit and integration (parallel shards) → build → E2E against a preview environment → deploy.
- **Parallelism**: shard test files across machines (¦--shard=1/4¦ in Playwright and Vitest, ¦--maxWorkers¦), and ensure tests are isolated so they can run in parallel.
- **Caching**: dependencies, build output, Docker layers, Playwright browsers.
- **Reports**: JUnit XML, coverage reports, failure screenshots, videos and traces uploaded as artifacts.
- **Quality gates**: fail on any test failure; coverage on changed lines above a floor; no new lint or type errors; optional bundle-size and Lighthouse budgets; security scan.
- **Retries**: at most one retry for E2E, reported as "flaky" in the summary, never counted as clean pass.
- **Services**: start MySQL and Redis as containers (GitHub Actions ¦services¦, docker compose, Jenkins agents).
- Run the full suite on main/nightly, and affected tests on pull requests when the suite is large.

#### Example
¦¦¦yaml
name: ci
on: [pull_request]
jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint && npm run typecheck
  test:
    needs: checks
    runs-on: ubuntu-latest
    strategy:
      matrix: { shard: [1, 2, 3, 4] }
    services:
      mysql:
        image: mysql:8
        env: { MYSQL_ROOT_PASSWORD: test, MYSQL_DATABASE: app_test }
        ports: ['3306:3306']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npx vitest run --coverage --shard=§{{ matrix.shard }}/4
¦¦¦

#### Remember it
**"Cheap first, parallel always, gates that matter, retries reported."**
Target: PR feedback in about 10 minutes.

#### Common mistakes
- One giant serial job taking 40 minutes.
- Retrying everything silently.
- No artifacts, so failures cannot be debugged.
- Running E2E before cheaper checks.

#### Interview angle
**Q:** "How do you structure testing in CI/CD?" **Say:** "Lint and types first, then sharded unit and integration tests with service containers, then E2E on a preview deployment. Quality gates on failures, coverage of changed code and lint, artifacts for debugging, and visible, limited retries. I keep PR feedback near ten minutes." **Follow-up:** How do you handle a suite that has grown too slow?

## Phase 3 · Advanced and lead level
### End-to-end testing with Cypress and Playwright
#### In one line
End-to-end tests drive a real browser through your running app, so they prove that the whole stack works together for a critical user journey.

#### Real-life analogy
The final test drive before delivering a car. It is slow and expensive, so you do it for the key journeys (start, drive, brake, park), not for every button.

#### How it works
- **Playwright**: Microsoft; Chromium, Firefox and WebKit; multiple tabs, contexts and users in one test; built-in auto-waiting, tracing (¦trace viewer¦), parallel workers and sharding, API testing, network interception.
- **Cypress**: great interactive runner with time-travel debugging, automatic retries of assertions, simple network stubbing with ¦cy.intercept¦; runs inside the browser, historically one tab and one origin (improving over time).
- **What to cover**: login, enrol, complete, certificate, payment, role-based access, and a few cross-browser smoke checks. **Not**: every validation message, every permutation (cheaper at lower levels).
- **Environments**: run against a preview or staging deployment with seeded, isolated data; keep E2E independent of production.
- **Structure**: Page Object or "screen" helpers for repeated flows, custom commands for login via API, tests in plain user language.
- **Artifacts**: video, screenshots and traces on failure.
- Keep the suite small (about 10 to 40 tests), run in parallel, and treat any flake as a bug.

#### Example
¦¦¦js
// Playwright
import { test, expect } from '@playwright/test';

test('learner enrols on a course and sees it on the dashboard', async ({ page, request }) => {
  const { email, password, courseTitle } = await (await request.post('/test-api/seed')).json();

  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.getByRole('article', { name: courseTitle }).getByRole('button', { name: 'Enrol' }).click();
  await expect(page.getByRole('status')).toContainText('You are enrolled');

  await page.goto('/dashboard');
  await expect(page.getByRole('listitem').filter({ hasText: courseTitle })).toBeVisible();
});
¦¦¦

#### Remember it
**"Few, critical, isolated, auto-waiting."**
Playwright = cross-browser, parallel, tracing. Cypress = developer experience and quick feedback. Pick one, and be consistent.

#### Common mistakes
- Testing everything through the UI (slow, flaky, hard to debug).
- Logging in through the UI in every test instead of via API or saved storage state.
- Tests that depend on each other's data.
- Asserting too early without waiting on the right signal.

#### Interview angle
**Q:** "Cypress or Playwright?" **Say:** "Both are solid. I prefer Playwright for cross-browser coverage, parallelism, tracing and multi-user scenarios; Cypress has a great interactive runner. More important than the tool is the discipline: few critical journeys, seeded isolated data, role-based selectors and auto-waiting." **Follow-up:** How do you keep E2E under 15 minutes in CI?

### Stable E2E selectors, waits and test isolation
#### In one line
Stable E2E tests find elements by what they mean, wait for real signals instead of time, and create their own data so they never depend on each other.

#### Real-life analogy
Giving directions by "the blue house next to the bakery" breaks when someone repaints; "12 Station Road" survives. And you wait for the bus by looking for the bus, not by standing for exactly ten minutes.

#### How it works
**Selectors**, in order: role and accessible name (¦getByRole¦), label, visible text, then ¦data-testid¦ (agreed stable contract). Avoid CSS chains, ¦nth-child¦, and generated class names.

**Waits**: use **auto-waiting** actions and **web-first assertions** (¦await expect(locator).toBeVisible()¦ retries until timeout). Wait for a **specific signal**: a network response (¦page.waitForResponse¦ or ¦cy.wait('@alias')¦), a URL change, an element state. Never use fixed ¦sleep¦ or ¦cy.wait(3000)¦.

**Isolation**: each test creates its own user and data via **API seeding** (not by clicking through the UI), uses a fresh browser context, and cleans up or uses unique names. Tests must run in any order and in parallel.

**Speed tricks**: reuse authentication with saved ¦storageState¦, stub third parties, disable animations, set a fixed viewport and locale.

**Debuggability**: on failure keep trace, screenshot, video and console and network logs; name tests as journeys.

#### Example
¦¦¦js
// Brittle
await page.click('div.list > div:nth-child(3) .btn-primary');
await page.waitForTimeout(3000);

// Stable
const row = page.getByRole('row', { name: /react basics/i });
await row.getByRole('button', { name: 'Enrol' }).click();
await expect(page.getByRole('status')).toHaveText(/enrolled/i);   // retries until true

// Wait on a precise signal when needed
const [response] = await Promise.all([
  page.waitForResponse((r) => r.url().includes('/api/enrolments') && r.status() === 201),
  row.getByRole('button', { name: 'Enrol' }).click(),
]);
¦¦¦

#### Remember it
**"Select by meaning, wait for signals, own your data."**
Checklist: no sleeps, no shared accounts, no order dependence, no real third parties.

#### Common mistakes
- Using one shared test account that others modify.
- Chaining on CSS classes from a design system that changes.
- Asserting with immediate (non-retrying) checks.
- Leaving animations enabled, which causes clicks on moving targets.

#### Interview angle
**Q:** "How do you make E2E tests reliable?" **Say:** "Role-based selectors, web-first assertions and waiting on network or state signals, API-seeded isolated data per test, saved auth state, disabled animations, and traces on failure. I treat any flake as a bug and measure it." **Follow-up:** How would you test a feature that sends an email?

### Visual regression testing
#### In one line
Visual regression tests take screenshots and compare them with approved baselines, catching unintended style and layout changes that functional tests cannot see.

#### Real-life analogy
Spot-the-difference puzzles between yesterday's photo and today's. It catches a logo that moved 20 pixels, but if the photo includes a moving clock and the weather, you will spot "differences" every day.

#### How it works
- **Tools**: Playwright's ¦toHaveScreenshot()¦ (free, local baselines), Storybook with **Chromatic** or **Percy** (hosted, component-level, review UI), BackstopJS, Loki.
- **Flow**: run in a fixed environment → capture screenshots → compare pixels (with a small threshold) → differences go to review → the team approves (updates baseline) or fixes.
- **Where**: components in Storybook (many states cheaply: hover, error, empty) and a few key pages.
- **Stabilise**: same browser and OS (use the CI container to render baselines), fixed viewport, loaded fonts, disabled animations, mocked data and dates, **mask** dynamic regions (avatars, timestamps), wait for images.
- **Strengths**: catches CSS regressions, design-system breakage and cross-browser layout issues.
- **Weaknesses**: noisy diffs, baseline maintenance, can approve bad changes by habit, no assertion about meaning or accessibility.
- Use it for **design system and high-value pages**, not everything.

#### Example
¦¦¦js
// Playwright
import { test, expect } from '@playwright/test';

test('course card looks right in all states', async ({ page }) => {
  await page.goto('/storybook/iframe.html?id=coursecard--full');
  await page.addStyleTag({ content: '*{animation:none!important;transition:none!important}' });

  await expect(page.locator('#storybook-root')).toHaveScreenshot('course-card-full.png', {
    maxDiffPixelRatio: 0.002,
    mask: [page.getByTestId('updated-at')],       // ignore a changing timestamp
  });
});
¦¦¦

#### Remember it
**"Same machine, no motion, mask the moving parts, review every diff."**
Generate baselines inside the CI container so that "works on my machine" font differences disappear.

#### Common mistakes
- Baselines created on a laptop and compared on Linux CI.
- Capturing full pages with live data and timestamps.
- Accepting all diffs in bulk.
- Using it instead of functional and accessibility tests.

#### Interview angle
**Q:** "Is visual regression worth it?" **Say:** "For a shared component library, yes: Storybook plus Chromatic or Playwright snapshots catch unintended style changes across many states. I stabilise the environment, mask dynamic content, and keep it to the design system and a few key pages to avoid noisy diffs." **Follow-up:** How do you keep baseline updates from becoming a rubber stamp?

### Property-based testing
#### In one line
Instead of hand-picking examples, you state a rule that must always be true and let a library generate hundreds of inputs to try to break it.

#### Real-life analogy
Quality inspectors who do not check three hand-picked boxes, but state "no box should ever weigh less than 500 g or leak", then test thousands of random boxes and show you the smallest leaking one.

#### How it works
1. Define **generators** (integers, strings, arrays, objects).
2. Define a **property**: a statement true for all inputs.
3. The framework (**fast-check** for JS) runs it with many random inputs (default 100), using a seed so failures reproduce.
4. On failure it **shrinks** the input to a minimal counterexample (from a 40-element array down to ¦[0, 0]¦).

Common property patterns:
- **Round trip**: ¦parse(format(x)) equals x¦.
- **Idempotence**: ¦sort(sort(xs))¦ equals ¦sort(xs)¦; ¦normalise(normalise(x))¦ equals ¦normalise(x)¦.
- **Invariants**: output length equals input length; sorted output is ascending.
- **Oracle**: compare a fast implementation with a slow, obviously correct one.
- **No crash**: any input returns a valid result or a controlled error.

Best for parsers, serialisers, formatters, pricing and date logic, data structures. Keep a few readable example tests too.

#### Example
¦¦¦js
// fast-check style (in a real project: import fc from 'fast-check')
// fc.assert(fc.property(fc.array(fc.integer()), (xs) => {
//   const sorted = [...xs].sort((a, b) => a - b);
//   return sorted.length === xs.length && sorted.every((v, i) => i === 0 || sorted[i - 1] <= v);
// }));

// Same idea with a tiny hand-rolled loop, runnable anywhere:
function sortAsc(xs) { return [...xs].sort((a, b) => a - b); }

test('sortAsc is idempotent and keeps the length for 200 random arrays', () => {
  for (let i = 0; i < 200; i++) {
    const xs = Array.from({ length: Math.floor(Math.random() * 12) }, () => Math.floor(Math.random() * 100) - 50);
    const once = sortAsc(xs);
    eq(sortAsc(once), once);
    eq(once.length, xs.length);
  }
});
¦¦¦

#### Remember it
**"Round trip, idempotent, invariant, oracle, never crash."**
Always keep the seed in the failure output so you can replay it.

#### Common mistakes
- Re-implementing the function inside the property (testing the code against itself).
- Properties too weak ("returns something") to find bugs.
- Generators that produce unrealistic data.
- Not saving the failing seed or counterexample as a regular regression test.

#### Interview angle
**Q:** "What is property-based testing?" **Say:** "You assert general properties, like round-trip or idempotence, and a library such as fast-check generates many inputs and shrinks failures to the smallest example. It finds edge cases I would not think of, so I use it for parsers, formatters and pricing logic next to normal example tests." **Follow-up:** What property would you test for a URL shortener?

### Mutation testing: testing your tests
#### In one line
Mutation testing deliberately breaks your code in small ways and checks whether your tests notice; the ones that do not expose weak assertions.

#### Real-life analogy
A fire drill where you secretly set off a smoke machine in different rooms to see which alarms ring. Alarms that stay silent are the ones you need to fix.

#### How it works
1. A tool (**Stryker** for JavaScript and TypeScript) creates **mutants**: copies of your code with one small change (¦>¦ to ¦>=¦, ¦&&¦ to ¦||¦, ¦true¦ to ¦false¦, remove a statement, change a return value).
2. It runs your tests against each mutant.
3. If a test fails, the mutant is **killed** (good). If all tests pass, the mutant **survived** (a gap).
4. **Mutation score** = killed / total (excluding equivalent or unreachable mutants). It reflects test strength better than line coverage.
5. Fix survivors by adding boundary and negative tests or stronger assertions, not by writing tests that mirror the code.

Practicalities: it is slow, so run it on critical modules, changed files in PRs (incremental mode), or nightly; configure which files to mutate and use ¦coverageAnalysis: perTest¦ to speed up. Some mutants are **equivalent** (the change does not alter behaviour); ignore those.

#### Example
¦¦¦js
function canCertify(score, attempts, hours) {
  if (attempts > 3) return false;
  return score >= 70 && hours >= 5;
}

// weak: 100% line coverage, kills almost nothing
test('strong learner', () => { eq(canCertify(85, 1, 6), true); });

// stronger: boundaries kill ">= to >" and "&& to ||" mutants
test('boundaries', () => {
  eq(canCertify(70, 3, 5), true);    // kills score >= 70 -> > 70, attempts > 3 -> >= 3, hours >= 5 -> > 5
  eq(canCertify(69, 1, 6), false);   // kills score check removal
  eq(canCertify(85, 1, 4), false);   // kills hours check removal and && -> ||
  eq(canCertify(85, 4, 6), false);   // kills attempts guard removal
});
¦¦¦

#### Remember it
**"Break the code; if tests stay green, the tests are weak."**
Great tests: boundary values, negative cases, and assertions on results (not only "no error").

#### Common mistakes
- Running it on the whole repo for every commit.
- Chasing 100% by writing tests that mirror the implementation.
- Treating equivalent mutants as failures.
- Ignoring surviving mutants in business-critical code.

#### Interview angle
**Q:** "How do you know your tests are good?" **Say:** "Coverage only shows execution. I use mutation testing, with Stryker, on critical modules to see whether tests detect small changes; surviving mutants point to missing boundary tests or weak assertions. I also track escaped defects." **Follow-up:** What is an equivalent mutant?

### Performance and load testing basics (k6)
#### In one line
Load tests simulate many users hitting your system to measure response times, throughput and errors, and to find limits before real users do.

#### Real-life analogy
Testing a bridge by driving trucks over it: a few trucks (smoke), the usual rush hour (load), far more than expected (stress), and a long steady stream (soak), while measuring how much it bends.

#### How it works
- **Test types**: **smoke** (one or a few users, does it work), **load** (expected peak), **stress** (beyond peak, find the breaking point), **spike** (sudden surge), **soak** (hours, find leaks).
- **Metrics**: **latency percentiles** (p50, p95, p99, never only the average), **throughput** (requests/second), **error rate**, resource use (CPU, memory, DB connections), saturation.
- **k6**: scripts in JavaScript; ¦vus¦ (virtual users), ¦duration¦, ¦stages¦ (ramp up/down), ¦thresholds¦ turn goals into pass or fail in CI; runs from CLI or cloud.
- **Method**: define the goal ("p95 under 300 ms at 200 req/s"), model realistic flows and data, test a **production-like** environment, ramp gradually, watch server metrics, find the bottleneck (DB query, N+1, connection pool, lock), fix, and re-test.
- **Frontend performance**: Lighthouse and Core Web Vitals (LCP, INP, CLS) with performance budgets in CI.
- **Do not**: test production blindly, or measure only on a laptop against localhost.

#### Example
¦¦¦js
// k6 script (run with: k6 run enrol-load.js)
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },    // ramp up
    { duration: '3m', target: 50 },    // steady load
    { duration: '30s', target: 0 },    // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'],  // 95% of requests under 300 ms
    http_req_failed: ['rate<0.01'],    // less than 1% errors
  },
};

export default function () {
  const res = http.get('https://staging.example.com/api/courses');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
¦¦¦

#### Remember it
**"Percentiles not averages; production-like not localhost; thresholds in CI."**
Always ask "what is the bottleneck?" and fix that, then measure again.

#### Common mistakes
- Quoting average latency (hides slow tail).
- Testing without realistic data volumes (an empty database is fast).
- Load-testing third-party services you do not own.
- Running once and never again; performance regresses silently.

#### Interview angle
**Q:** "How would you load test the enrolment API?" **Say:** "Define the target, for example p95 under 300 ms at expected peak. Script realistic flows in k6 with ramping users and thresholds, run against a production-like environment with realistic data, watch DB and server metrics to find the bottleneck, fix it and repeat. I add a short smoke performance check to CI." **Follow-up:** What is the difference between load, stress and soak tests?

### Testing legacy code: characterisation tests and seams
#### In one line
For code with no tests, first record what it does today in tests, then change it safely, because you cannot refactor what you cannot verify.

#### Real-life analogy
Before renovating an old house, photograph and measure every room and map the wiring. If something looks different afterwards, you know what you changed, even if the original layout was odd.

#### How it works
1. **Characterisation (golden-master) tests**: call the code with real or representative inputs, record the actual outputs, and assert them, even if they look wrong. They document current behaviour, not desired behaviour. Mark suspicious behaviour with a comment and fix it later deliberately.
2. **Seams** (Michael Feathers): a place where you can change behaviour without editing the code around it. Examples: pass a dependency as a parameter, use module mocking, wrap a global (¦Date¦, ¦fetch¦), extract a pure function from a big one, subclass and override.
3. **Test at the highest convenient level first**: an API call or a component render, then dig down as you extract units.
4. **Sprout and wrap**: put new logic in a new, fully tested function (sprout) or wrap the old function (wrap), calling it from the old code with minimal edits.
5. **Small safe refactors** with tests as the net: rename, extract, inject.
6. Prioritise code that changes often or breaks often (check git history), and leave the rest.
7. Record decisions in the PR so the next person gets a head start.

#### Example
¦¦¦js
// Legacy: hidden dependency on the clock and a global, odd output format
function invoiceNumber(customerId) {
  const d = new Date();
  return 'INV-' + customerId + '-' + d.getFullYear() + (d.getMonth() + 1) + d.getDate();
}

// Step 1: make a seam (default parameter keeps old callers working)
function invoiceNumber2(customerId, now = () => new Date()) {
  const d = now();
  return 'INV-' + customerId + '-' + d.getFullYear() + (d.getMonth() + 1) + d.getDate();
}

// Step 2: characterisation test pins today's behaviour (note: no zero padding!)
test('pins the current format, including the missing zero padding', () => {
  eq(invoiceNumber2(42, () => new Date(2025, 0, 5)), 'INV-42-202515');
});
¦¦¦

#### Remember it
**"Pin it, seam it, then change it."**
Never change behaviour and structure in the same step.

#### Common mistakes
- Rewriting from scratch instead of incremental change.
- Writing tests for what the code *should* do and being confused when they fail.
- Refactoring first and testing later.
- Trying to cover the whole legacy module instead of the part you must change.

#### Interview angle
**Q:** "You inherit untested code. What do you do?" **Say:** "Write characterisation tests around the area I must change, at API or UI level, introduce seams to isolate side effects, make the smallest change under that net, then refactor and add focused unit tests. I prioritise by change frequency and defect history." **Follow-up:** What do you do when the current behaviour is clearly a bug?

### Testing AI-generated code: verify, do not trust
#### In one line
AI code is a fast draft from a system that can sound certain and be wrong; tests, review and verification are how you turn the draft into trustworthy software.

#### Real-life analogy
A very quick junior colleague who never says "I am not sure". You still read their work, ask for evidence, and run it before it goes to a customer.

#### How it works
Typical failure modes: invented APIs or options, outdated library usage, subtle logic errors (off-by-one, wrong sort, race conditions), insecure defaults, ignoring project conventions, and **tests that assert the implementation** or repeat the same mistake.

A verification workflow:
1. **Specify first**: write the acceptance criteria and key tests (or review the AI's tests) before accepting code.
2. **Run everything**: type-check, lint, unit and integration tests, and the app itself.
3. **Check existence**: every import, function and option exists in the installed version; unknown packages are verified (supply-chain risk).
4. **Probe edge cases**: empty, null, large, unicode, concurrent, error paths; ask the model to list assumptions and add tests for them.
5. **Mutate to verify the tests**: change a condition in the generated code and confirm a test fails.
6. **Review security** and accessibility explicitly.
7. **Small diffs** and clear PR descriptions with the prompt context; humans stay accountable.
8. Prefer generating tests from the **requirement**, not from the code just written.

#### Example
¦¦¦js
// AI suggested this "unique and sorted" helper
function uniqueSorted(nums) {
  return [...new Set(nums)].sort();           // BUG: default sort is lexicographic
}

// Tests written from the requirement catch it immediately
test('sorts numerically', () => {
  eq(uniqueSorted([10, 2, 1, 2]), [1, 2, 10]);   // fails: got [1, 10, 2]
});

// Fix
function uniqueSorted2(nums) {
  return [...new Set(nums)].sort((a, b) => a - b);
}
¦¦¦

#### Remember it
**"Spec, run, probe, mutate, review."** Never paste secrets or customer data into non-approved tools, and never merge what you do not understand.

#### Common mistakes
- Accepting AI tests that merely mirror the AI code.
- Skipping a run because the code "looks right".
- Giant AI-generated PRs nobody can review.
- Trusting a package name or API without checking it exists.

#### Interview angle
**Q:** "How do you use AI safely in development?" **Say:** "As an accelerator within a verification loop: requirement-based tests first, run type-check, lint and tests, verify APIs exist, probe edge cases, check that tests fail when I break the code, and review security. Small diffs, and I stay accountable for what is merged." **Follow-up:** How would you prove an AI-written test is actually useful?

### Reviewing tests in a code review
#### In one line
Tests are code that must also be reviewed: they should be readable, meaningful, independent and fast, or they become a burden.

#### Real-life analogy
Proofreading the exam as well as the answer sheet. A badly written question makes every answer meaningless.

#### How it works
Review checklist:
1. **Name and intent**: does the name state a behaviour and context? Could a new teammate understand the rule from it?
2. **Would it fail?** Mentally break the code: would a test fail? Weak assertions (¦toBeTruthy¦, ¦not.toThrow¦ only) and missing assertions are red flags.
3. **Behaviour not implementation**: no private details, no brittle selectors, no over-specified calls.
4. **Coverage of cases**: happy path, boundaries, error paths, empty or null inputs, permissions.
5. **Isolation and determinism**: no shared state, no real time, random or network, no dependence on order.
6. **Readability**: small AAA structure, factories instead of huge fixtures, no logic in tests.
7. **Speed and level**: right level of test for the risk; no unneeded E2E; no sleeps.
8. **Maintenance**: duplicated setup extracted, no skipped or ¦.only¦ tests, snapshots small and reviewed.
9. **Regression**: bug fixes include a test that fails before the fix.

Review the tests **before** the implementation: they show intent. Comment constructively and offer a rewrite.

#### Example
¦¦¦js
// Review comment: "this passes even when the discount is wrong"
test('applies discount', () => {
  const result = applyDiscount(100, 10);
  ok(result);                      // weak: any non-zero number passes
});

// Suggested
test('reduces a price of 100 by 10 percent to 90', () => {
  eq(applyDiscount(100, 10), 90);
});
test('rejects a negative percentage', () => {
  throws(() => applyDiscount(100, -1));
});
¦¦¦

#### Remember it
**"Name, would-it-fail, behaviour, cases, isolation, readability, speed."**
A PR with code and no tests needs an explanation, not a rubber stamp.

#### Common mistakes
- Reviewing only production code and skimming tests.
- Accepting tests added only to satisfy coverage.
- Not asking for a regression test for a bug fix.
- Nitpicking style while missing a test that cannot fail.

#### Interview angle
**Q:** "What do you check in test code during review?" **Say:** "I read the tests first. Does the name describe behaviour, would the test fail if the code were wrong, does it avoid implementation details, does it cover boundaries and error paths, and is it isolated and fast? Bug-fix PRs must include a failing-then-passing regression test." **Follow-up:** How do you coach a junior whose tests all assert ¦toBeTruthy¦?

### Test strategy for a team of 8–10: ownership, budgets, definition of done
#### In one line
A test strategy is the set of agreed rules about what to test, where, with which tools, and who owns quality, so 8 to 10 people produce one consistent, fast and trusted suite.

#### Real-life analogy
Traffic rules for a city: nobody needs to invent how to cross a junction each time. Agreed signals, lanes and speed limits keep everyone moving safely without a meeting for every car.

#### How it works
1. **Principles**: test behaviour at the cheapest level that covers the risk; mock only at the edges; isolation and determinism are non-negotiable.
2. **Tools and patterns**: pick one toolset (Vitest/Jest, RTL + user-event, MSW, Supertest, Playwright) and keep a **testing guide** with copy-paste examples, factories, and helpers.
3. **Definition of done**: every change includes tests at the right level; bug fixes include a regression test; accessibility and error states covered; PR template has a testing checklist.
4. **Budgets**: unit and integration under about 5 minutes, E2E under about 15 in parallel, PR feedback near 10 minutes; a test that makes the suite slower needs a reason.
5. **Flake policy**: a visible flake dashboard, quarantine within a day, fix within a sprint; no blind retries.
6. **Quality gates in CI**: failures, coverage on changed code, lint and types, optional mutation score for critical modules.
7. **Ownership**: each module has an owner; everyone fixes failing tests on main; the on-call or rotating "build captain" watches CI.
8. **Skills and culture**: pairing, short training sessions, review of tests in PRs, blameless reviews of escaped bugs.
9. **Metrics that matter**: escaped defects, change failure rate, lead time, flake rate, suite duration. Not coverage alone.
10. **Review quarterly** and prune slow or low-value tests.

#### Example
¦¦¦text
TESTING POLICY (one page, versioned in the repo)

Levels      TS+lint every commit | unit for pure rules | integration for features | E2E for 8 critical journeys
Tools       Vitest, RTL + user-event, MSW, Supertest + MySQL container, Playwright
Done =      tests at the right level, error states covered, a11y checked, bug fix has regression test
Budgets     PR checks <= 10 min | E2E <= 15 min (4 shards) | flake rate < 1%
Gates       red tests block merge | changed-line coverage >= 80% | no new lint/type errors
Ownership   module owners + weekly build captain | flaky test: quarantine in 1 day, fix in 1 sprint
AI code     same rules; tests written from requirements; humans accountable
¦¦¦

#### Remember it
**"Principles, tools, definition of done, budgets, flake policy, owners, metrics."**
Rules the team wrote together get followed; rules handed down get worked around.

#### Common mistakes
- A strategy in a wiki nobody reads; keep it in the repo and in the PR template.
- Measuring only coverage.
- Letting a slow, flaky suite persist "until later".
- Putting quality only on a QA person, instead of the whole team.

#### Interview angle
**Q:** "How would you set up testing for a team of 8 to 10?" **Say:** "Agree a short testing policy: levels and tools, a definition of done with regression tests for bugs, time budgets, a flake policy and CI quality gates. Support it with a guide of examples, test review in PRs, pairing and metrics such as escaped defects and flake rate. I involve the team in writing it so they own it." **Follow-up:** How do you introduce this into a team that currently has few tests?

`;
