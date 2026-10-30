window.PREP = window.PREP || {};
window.PREP.plan = String.raw`
@intro A 12-week path through all twelve subjects, from fundamentals to lead-level mastery. Daily rhythm: 1.5–2 hours on weekdays and 3 hours on weekends, plus one DSA problem every day from week 4 onward (two on weekends) to keep the habit. Every study day follows the same loop: read the Study notes tab first, tick the Roadmap topics you can explain, answer the Q&A out loud and rate each one (Missed it, Shaky, Got it), then do the Code practice in the built-in playground (runnable exercises with tests, HTML and CSS exercises with a live preview), and finish with the Scenarios. End every week with a 20-minute Mock interview round (timed questions, then the readiness report) on that week's subject. If you only have 8 weeks: merge weeks 1–2 (HTML and CSS plus JavaScript), merge weeks 4–5 (DSA), merge weeks 8–9 (Node.js), and fold week 3 (TypeScript) into week 6; keep everything else.

## PLAN

### Week 1 · HTML & CSS and JavaScript core
- **Mon**: HTML & CSS notes on semantic HTML, forms and accessibility; do the live-preview exercises in the playground.
- **Tue**: CSS notes on the box model, specificity, flexbox and grid; build two layouts and test them in the Mobile and Full preview.
- **Wed**: JavaScript notes on scope, closures, hoisting and ¦this¦; rate every basic Q&A.
- **Thu**: JavaScript types, coercion, arrays and objects; solve the runnable JavaScript exercises.
- **Fri**: Responsive and modern CSS (container queries, ¦:has¦, custom properties) plus ES2015+ features.
- **Weekend**: Build a responsive card page, then a small utility library (debounce, memoize, deepClone) until the tests pass. Mock interview: HTML & CSS and JavaScript.
- **Deliverable**: Explain closures, ¦this¦ and specificity in two minutes each without notes.

### Week 2 · JavaScript async and advanced
- **Mon–Tue**: Event loop, microtasks vs macrotasks, promises and async/await; predict the output of 10 snippets.
- **Wed**: Concurrency patterns: ¦Promise.all/allSettled/race¦, retries, timeouts, promise pools.
- **Thu**: Generators, iterators, Proxy, WeakMap and memory leaks.
- **Fri**: All remaining JavaScript Q&A and scenarios; time yourself on the exercises.
- **Weekend**: Pass the promise pool and retry-with-backoff exercises, then a 20-minute Mock interview round.
- **Deliverable**: Explain the event loop on a whiteboard and write a promise pool from memory.

### Week 3 · TypeScript
- **Mon**: Types, interfaces vs type aliases, unions and narrowing.
- **Tue**: Generics, constraints and utility types.
- **Wed–Thu**: Mapped, conditional and template literal types, ¦infer¦, discriminated unions.
- **Fri**: Type-safe API clients and runtime validation with zod; TypeScript Q&A and scenarios.
- **Weekend**: Convert a small JavaScript module to strict TypeScript with no ¦any¦. Mock interview: TypeScript.
- **Deliverable**: Explain how TypeScript is used across your frontend and backend at work.

### Week 4 · DSA part 1: arrays, hashing, pointers, stacks, lists
- **Daily**: Study notes for the day's pattern, then solve the matching playground exercises until every test passes. One problem per day, two on weekends.
- **Mon**: Big-O, arrays and strings, hash maps (two sum, anagrams).
- **Tue**: Two pointers and sliding window.
- **Wed**: Prefix sums, sorting and binary search (including rotated arrays).
- **Thu**: Linked lists: reverse, cycle detection, merge.
- **Fri**: Stacks, queues and monotonic stack; valid parentheses, min stack.
- **Weekend**: Redo the problems you failed first time without hints. Mock interview: DSA.
- **Deliverable**: Explain a brute-force solution, then optimise it with complexity, for any three problems.

### Week 5 · DSA part 2: trees, graphs, heaps, DP
- **Mon**: Trees: DFS/BFS traversals, BST validation, lowest common ancestor.
- **Tue**: Heaps and top-K, tries, and the LRU cache design problem.
- **Wed**: Graphs: BFS/DFS, islands, topological sort (course schedule).
- **Thu**: Dynamic programming: climbing stairs, coin change, longest common subsequence.
- **Fri**: Backtracking (subsets, permutations) and greedy intervals.
- **Weekend**: Do two timed problems (30 minutes each) while talking aloud. Mock interview: DSA.
- **Deliverable**: Recognise the pattern for any new problem within two minutes and say why.

### Week 6 · React fundamentals and hooks
- **Mon**: Rendering model, reconciliation, keys, props vs state.
- **Tue–Wed**: ¦useState/useEffect/useRef/useMemo/useCallback¦, dependency arrays and stale closures.
- **Thu**: Custom hooks, context and reducers, controlled vs uncontrolled forms.
- **Fri**: React Q&A out loud; build a debounced search and an infinite scroll list.
- **Weekend**: Build a small app (list, filters, form) with custom hooks. Mock interview: React.
- **Deliverable**: Explain why a component re-renders and three ways to prevent it.

### Week 7 · React advanced, performance and Testing basics
- **Mon–Tue**: Code splitting, lazy and Suspense, memoisation, virtualisation and profiling.
- **Wed**: State management choices (context, Redux Toolkit, React Query, Zustand) and when each fits; the component library scenario.
- **Thu**: Testing notes: the testing pyramid, test doubles, AAA and TDD; React Testing Library queries by role.
- **Fri**: Write behaviour tests for the app you built; do the runnable spy and mock exercises.
- **Weekend**: Component library design: API, tokens, docs, tests and versioning. Mock interview: React and Testing.
- **Deliverable**: Tell your "35% faster screens" and "30–40% faster pages" stories with the method you used.

### Week 8 · Testing deeper and Node.js fundamentals
- **Mon**: Jest/Vitest mocks, fake timers, async tests, flaky tests and coverage limits.
- **Tue**: Testing APIs with Supertest, database test strategies, E2E basics with Playwright or Cypress.
- **Wed**: Node.js event loop, streams, buffers, worker threads and clustering.
- **Thu**: Express middleware, routing, validation, error handling and layered architecture.
- **Fri**: Authentication: sessions, JWT, refresh tokens, RBAC and OAuth overview.
- **Weekend**: Build a REST API with validation and tests. Mock interview: Testing and Node.js.
- **Deliverable**: Draw the request lifecycle of your Clinical Learning Hub API and say where you test each layer.

### Week 9 · Node.js advanced and API design
- **Mon**: REST design, versioning, pagination, idempotency keys and error formats.
- **Tue**: Caching (HTTP and Redis), queues, background jobs and retries.
- **Wed**: Security: OWASP top 10, rate limiting, CORS, helmet and input validation.
- **Thu**: Observability, graceful shutdown, health checks, profiling and memory leaks.
- **Fri**: Node.js exercises (rate limiter, idempotency middleware, job runner) in the playground.
- **Weekend**: Add rate limiting, idempotency and graceful shutdown to your API. Mock interview: Node.js.
- **Deliverable**: Explain how you would scale an API 10x.

### Week 10 · MySQL and Sequelize
- **Mon**: Data types, keys, normalisation and joins.
- **Tue**: Indexes, ¦EXPLAIN¦ and the leftmost-prefix rule.
- **Wed**: Transactions, isolation levels, locks and deadlocks.
- **Thu**: Window functions, CTEs, keyset pagination; Sequelize models, associations and the N+1 problem.
- **Fri**: Sequelize transactions, optimistic locking, migrations and expand/contract schema changes.
- **Weekend**: Take a slow query, diagnose it with ¦EXPLAIN¦, fix it and write up before and after. Mock interview: Database.
- **Deliverable**: Tell your query optimisation story with numbers.

### Week 11 · System design and Deployment
- **Mon**: How to run a design interview, estimation, scaling, load balancing and caching.
- **Tue**: Databases at scale (replication, sharding, CAP), queues and event-driven design.
- **Wed**: Rate limiter, URL shortener and notifications case studies; do the runnable system design exercises.
- **Thu**: Git workflows, Docker, and CI/CD with GitHub Actions, Jenkins and CodePipeline.
- **Fri**: AWS essentials (IAM, ECS/EC2, S3/CloudFront, RDS), blue/green and rollback.
- **Weekend**: Design a learning platform end to end (video, progress, quizzes, certificates), then write the pipeline for it. Mock interview: System design and Deployment.
- **Deliverable**: Describe your CI/CD pipeline end to end, including rollback, and present one design in 35 minutes.

### Week 12 · AI-assisted coding, Leadership and mock interviews
- **Mon**: Prompt patterns, verifying AI code, repo instruction files, agents and RAG basics.
- **Tue**: AI security, evals, governance and rolling AI tools out to a team; prepare the "4–6 hours saved per sprint" story.
- **Wed**: Leadership notes: estimation, code review culture, mentoring, feedback, incidents and stakeholders; write your STAR stories.
- **Thu**: Full mock interview 1: 45 minutes JavaScript and React, 45 minutes Node and database, 30 minutes system design.
- **Fri**: Mock interview 2 with the Mock interview timer on your weakest subjects; clear the Weak areas list on the dashboard.
- **Weekend**: One light mock, a one-page cheat sheet and your questions for the interviewer. Rest.
- **Deliverable**: Six polished STAR stories and a Weak areas list that is empty or knowingly small.

## PLAYBOOK

### Before the interview
- Re-read your resume and prepare a story with **numbers** for every bullet: problem, action, result, what you would do differently.
- Research the company: product, stack, scale, recent news. Prepare 5 good questions (team, quality practices, on-call, roadmap, growth).
- Test the setup: camera, microphone, internet, editor, a quiet room. Have water and a notepad ready.
- Sleep well. Do a 20-minute warm-up with an easy problem to start thinking in code.

### Introducing yourself (90 seconds)
Structure: **who you are** (Lead Full Stack Engineer, 8+ years, React/Node/TypeScript) → **what you do best** (scalable healthcare learning platform, performance, mentoring a team of 8–10, AI-assisted engineering) → **proof** (35% faster screens, 30–40% faster pages/APIs, 4–6 hours saved per developer per sprint) → **why this role**. Practise until it is natural, not memorised.

### Answering technical questions
1. Repeat or rephrase the question to confirm it.
2. Start with the **simple definition**, then the **why**, then a **practical example** from your own work.
3. Mention trade-offs ("it depends on... in my project we chose X because...").
4. If you do not know, say so, reason from first principles, and show how you would find out. Never bluff.
5. Keep answers around 1–2 minutes and invite follow-ups.

### Live coding
- Clarify requirements and edge cases first (empty input, duplicates, large input).
- Talk through your approach before typing; start with a simple working solution, then optimise.
- Use meaningful names, small functions, and test with examples out loud.
- State time and space complexity. If you get stuck, explain what you tried and ask for a hint calmly.

### System design (lead level)
Follow a frame: **requirements** (functional, non-functional, scale) → **API and data model** → **high-level architecture** → **deep dive** on the riskiest part → **scaling, caching, queues** → **reliability, security, observability** → **trade-offs and next steps**. State assumptions and numbers (requests per second, data size). Interviewers value structured thinking more than a perfect diagram.

### Questions to ask them
- How do you decide what to build, and how do engineers influence the roadmap?
- What does a good first 90 days look like for this role?
- How do you handle testing, releases and on-call?
- What are the biggest technical challenges or debt right now?
- How do you use AI tools in engineering, and what are the policies?

### Salary and offer discussion
Know your market range and your lowest acceptable number before the call. Let them state a range first when possible, anchor to the value you bring, discuss the total package (fixed, variable, joining bonus, notice buy-out, learning budget), and ask for time to decide. Be polite, factual and flexible about non-salary benefits.

## STAR

### Leading a team of 8–10 engineers
- **Situation**: The Clinical Learning Hub had many features in flight and uneven code quality across a team of 8–10.
- **Task**: Deliver on time while raising quality and growing the team.
- **Action**: Set coding standards and PR checklists, introduced weekly design reviews, paired with juniors, split work into small milestones, and tracked cycle time.
- **Result**: Fewer review rounds, more predictable releases, and team members taking ownership of modules. Add your real numbers.

### Improving performance (35% faster screens, 30–40% faster pages/APIs)
- **Situation**: Key screens and APIs were slow for users.
- **Task**: Reduce load times without a rewrite.
- **Action**: Profiled first, then applied code-splitting, caching, query and index tuning, and reduced re-renders; validated with before/after measurements.
- **Result**: The improvements above, plus a performance checklist the team reuses. Be ready to name the tools and metrics.

### Building the reusable component library
- **Situation**: Teams rebuilt similar UI repeatedly with inconsistent behaviour.
- **Task**: Create a shared set of accessible, tested components.
- **Action**: Audited duplicates, defined design tokens and APIs, documented usage, added tests, versioned releases, and migrated screens gradually.
- **Result**: Faster delivery (~35% faster screens) and consistent UX. Mention adoption and how you handled feedback.

### Handling a production incident
- **Situation**: A release caused errors or slowness in production.
- **Task**: Restore service quickly and prevent recurrence.
- **Action**: Rolled back or hot-fixed, communicated status, found the root cause with logs and metrics, and ran a blameless review.
- **Result**: Added tests, alerts and release checks. Choose a real incident and be honest about your part.

### Disagreement with a colleague or stakeholder
- **Situation**: You and another person had different technical approaches (or a stakeholder wanted an unrealistic deadline).
- **Task**: Reach the best outcome without damaging the relationship.
- **Action**: Listened, wrote down trade-offs, tested with a small prototype or data, involved a third opinion when needed, and committed to the decision.
- **Result**: A decision the team supported and a stronger relationship. Show that you can disagree and commit.

### Mentoring and growing someone
- **Situation**: A junior developer struggled with confidence or quality.
- **Task**: Help them become independent.
- **Action**: Gave small stretch tasks, reviewed with explanations rather than rewrites, held weekly one-to-ones, and encouraged them to present their work.
- **Result**: They started owning features. Mention concrete growth.

### Introducing AI tools to the team
- **Situation**: Developers were using AI tools inconsistently, with privacy and quality risks.
- **Task**: Get the benefits safely.
- **Action**: Chose approved tools, wrote guidelines (no sensitive data, review and tests required), ran training and prompt-sharing sessions, and measured outcomes.
- **Result**: An estimated 4–6 hours saved per developer per sprint with no rise in defects. State how you estimated it.

### A mistake you made and what you learned
- **Situation**: Choose a real, modest mistake (an untested migration, an optimistic estimate, a missed edge case).
- **Task**: Fix the impact and learn.
- **Action**: Owned it immediately, fixed it, communicated openly, and added a safeguard (a checklist, a test, an alert).
- **Result**: It never happened again and the team adopted the safeguard. Show accountability and learning.
`;
