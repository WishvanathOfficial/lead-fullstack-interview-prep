window.PREP = window.PREP || {};
window.PREP.leader = String.raw`
@title Leadership and Behavioural
@icon home
@tagline What lead-level interviews test beyond code: estimation, reviews, mentoring, incidents, stakeholders, conflict and telling your story with evidence.
@resume Leading a team of 8–10 engineers | Code reviews and mentoring | Estimation and release planning | AI adoption in the team (4–6 hours saved per developer per sprint)

## ROADMAP

### Phase 1 · Foundations (Basic)
- Lead vs senior engineer vs manager: scope, ownership and expectations :: Be able to say what changed in your job when you became a lead.
- Technical leadership vs people leadership :: Give one example of each from the Clinical Learning Hub team.
- Estimation basics: story points, task breakdown, buffers :: Break a feature into tasks and give a range, not a single number.
- Agile and Scrum ceremonies, and what a lead owns in each :: Planning, stand-up, refinement, review, retro: your job in each.
- Code review culture and checklists :: Know what you check first, what you leave to linters, and how you phrase comments.
- Giving and receiving feedback (SBI model) :: Practise Situation, Behaviour, Impact out loud.
- Mentoring and growing junior engineers :: Have a story of someone you grew and how you measured it.
- STAR method and storytelling :: Prepare 6 stories, two minutes each, with numbers.
- Onboarding new engineers :: Describe your first-week plan for a new joiner.
- Remote and cross-team collaboration :: Know your habits for async updates, hand-offs and shared ownership.

### Phase 2 · Day-to-day leadership (Intermediate)
- Delegation: what to hand off and how :: Delegate outcomes, not tasks; follow up without micromanaging.
- Technical debt: finding it, sizing it, prioritising it :: Show how you sell debt work to product with business impact.
- Architecture decision records and RFCs :: Write a one-page ADR with options and trade-offs.
- Incident response and blameless postmortems :: Know the timeline, root cause, action items structure.
- Stakeholder and product communication :: Translate technical risk into dates, cost and user impact.
- Saying no and managing up :: Offer options instead of a flat no; escalate early with a recommendation.
- Conflict resolution within the team :: Use a calm, evidence-based approach; separate people from the problem.
- Hiring and interviewing :: Describe how you evaluate candidates and avoid bias.
- Handling underperformance :: Clear expectations, early feedback, a written plan, support, a fair outcome.
- Burnout, workload and sustainable pace :: Spot the signs and protect the team without hiding the deadline.
- Release planning and risk management :: Plan scope, dependencies, rollback and communication.

### Phase 3 · Strategic and interview-day (Advanced)
- Quality and delivery metrics (DORA) :: Lead time, deploy frequency, change failure rate, time to restore.
- Engineering productivity and AI adoption in a team :: Tell the 4–6 hours per sprint story, with method and risks.
- Roadmaps, OKRs and aligning engineering with the business :: Connect technical work to a measurable outcome.
- Leading change and getting buy-in :: Pilot, show evidence, listen to resistance, standardise.
- Ethics, privacy and security responsibility :: Healthcare data, access control, honest reporting of risks.
- Handling failure and learning from mistakes :: A real mistake, your fix and the safeguard you added.
- Career growth: yours and your team's :: Know your next step and how you grow others.
- Salary negotiation, notice period and offers :: Know your range, your floor and the total package.
- Questions to ask the interviewer :: Have 5 good questions ready about team, quality and growth.
- Your first 30-60-90 days in a new lead role :: Listen, learn, deliver one visible win.

## QA

### [basic] What is the difference between a senior engineer, a lead engineer and an engineering manager?
A **senior engineer** owns hard technical problems and delivers them well. A **lead engineer** does that and also owns the *outcome of a team's technical work*: design direction, quality, delivery, and growing the people around them. An **engineering manager** owns people and the team's health (hiring, performance, careers, budget) and spends less time in code.

In my role as Lead Engineer – II at CitiusTech I still write code, but I also run design discussions, review pull requests, estimate with product, and guide a team of 8–10 engineers on the Clinical Learning Hub. I'm accountable for the result, not just my own tickets.

### [basic] What does a lead engineer actually do in a typical week?
Roughly (example split, adjust to yours): 40% hands-on coding on the hardest or riskiest work, 20% code and design reviews, 15% planning and refinement with product and QA, 15% mentoring, unblocking and 1:1s, 10% communication, documentation and release coordination. The balance shifts by sprint: more coding early, more coordination near release. I protect time for focused work because a lead who is always in meetings stops adding technical value.

### [basic] How do you estimate a feature?
1. **Clarify scope** and acceptance criteria with the product owner; list assumptions and unknowns.
2. **Break it down** into tasks small enough to finish in 1–2 days (API, DB change, UI, tests, deployment, docs).
3. **Estimate each task** with the team (planning poker or relative sizing), using past similar work as reference.
4. **Add risk buffer** for unknowns (integration, new library, unclear requirements) and say it out loud.
5. **Give a range** ("8–12 days, most likely 10") rather than one number, and re-estimate when we learn more.

Estimates are a forecast, not a promise. I track actual vs estimate per sprint so we get better.

### [basic] What are story points and why not use hours?
Story points measure **relative size and uncertainty** (complexity, effort, risk) instead of precise time. They avoid false precision, remove the pressure of "you said 4 hours", and stay stable when different people work on a story. The team's **velocity** (points finished per sprint) then predicts capacity. Hours are fine for small tasks inside a story. The key is consistency: calibrate with a reference story everyone agrees on.

### [basic] Which Scrum ceremonies matter most to a lead, and what do you own in each?
- **Refinement**: I make sure stories are clear, testable and technically understood; I raise risks and split large items.
- **Sprint planning**: I help the team commit to a realistic amount and surface dependencies.
- **Daily stand-up**: short; I listen for blockers and quietly follow up after.
- **Review/demo**: I help the team show working software and gather feedback.
- **Retrospective**: I make it safe to speak, pick one or two actions, and follow up next sprint. Retros without follow-through die quickly.

### [basic] How do you run an effective code review?
I review for **correctness, design, readability, tests and risk**, in that order, and leave formatting to linters and Prettier. I read the description first, check the tests, then the diff. Comments are specific and kind, explain *why*, and separate **must fix** from **suggestion** ("nit:"). I aim to review within a working day so PRs don't pile up, keep PRs small, and approve with comments when remaining items are minor. For juniors, a review is also a teaching moment: I link to docs and explain the principle, not just the fix.

### [basic] Give an example of a good vs bad code review comment.
**Bad**: "This is wrong. Use a Map."
**Good**: "This loop is O(n²) because ¦find¦ runs inside ¦map¦. With 5,000 items it took ~400 ms in my test (example). A ¦Map¦ keyed by id would make it O(n). Happy to pair if useful. (suggestion, not blocking)". It names the issue, gives evidence, offers a fix, states severity and is respectful of the person.

### [basic] What is the SBI feedback model?
**Situation, Behaviour, Impact.** Describe *when and where* it happened, the *observable behaviour* (not your interpretation), and the *effect* it had. Example: "In yesterday's sprint planning (situation), you interrupted Priya twice while she explained the estimate (behaviour). She stopped sharing, and we lost the risk she was about to mention (impact)." Then ask for their view and agree next steps. It keeps feedback factual, specific and less defensive.

### [basic] How do you receive critical feedback?
I listen without defending, ask for a specific example, thank the person, and summarise what I heard to confirm. Then I take time to reflect, decide what to change, and follow up later with what I did. I treat feedback as data. As a lead I also ask for it regularly ("What's one thing I could do to unblock you faster?") so people know it's safe.

### [basic] How do you mentor a junior engineer?
I start with their goals and current gaps, then set small stretch tasks with clear success criteria. I pair on the first few, then step back, and I review with explanations rather than rewrites. Weekly 1:1s cover progress, blockers and career. I encourage them to present their work to the team. I measure growth by independence: fewer review comments of the same type, owning a module, estimating accurately. (Use a real example here: name the skill, the plan, and the result.)

### [basic] How do you onboard a new engineer to the team?
Before day one: access, laptop, a buddy, and a short written guide. Week 1: environment running, a tiny first PR merged (fix a typo or small bug), walkthrough of architecture and the Clinical Learning Hub domain, intro to people. Weeks 2–4: a real but bounded feature with a buddy, plus coding standards and release process. I check in often and ask what was confusing, then improve the onboarding doc. A fast first merged PR builds confidence.

### [basic] What is the STAR method and how do you use it?
**Situation, Task, Action, Result.** I spend about 15% on situation/task, 60% on *what I did* (use "I", not "we"), and 25% on result with numbers and what I learned. I keep each story to about two minutes. I prepare 6 flexible stories (leading, conflict, failure, performance win, mentoring, change) so I can adapt them to different questions.

### [basic] How do you collaborate with remote or cross-functional teams?
Write things down: decisions, designs and meeting notes live in shared docs. Overlap hours are used for discussion; the rest is async updates. I keep PR descriptions and tickets clear, use short demo videos for UI work, and agree response-time expectations. With QA, product and designers I involve them early (refinement) so there are fewer surprises late.

### [intermediate] How do you delegate effectively?
I delegate **outcomes**, not just tasks: what success looks like, constraints, deadline and who to ask. I match the task to the person's growth edge, agree check-in points, and avoid taking it back when it gets hard. I stay available but don't hover. If it goes wrong, we review the process, not blame the person. Delegating the interesting design work to others is how a lead scales.

### [intermediate] How do you decide whether to pay down technical debt?
I list debt items with **impact** (bugs, slow delivery, risk) and **cost to fix**, then prioritise those that slow every feature or carry security/reliability risk. I explain to product in business terms: "this module causes 30% of our bugs and adds about two days to each feature (example numbers)". Then I propose a bounded plan: a percentage of each sprint (for instance 15–20%) or a specific hardening story, delivered incrementally. I avoid big rewrites unless there is no safer path.

### [intermediate] What is an ADR and when do you write one?
An **Architecture Decision Record** is a short document capturing a significant decision: context, options considered, the decision, and consequences. I write one when a choice is costly to reverse (state management library, database change, auth approach, new service). It prevents re-debating the same question and helps new joiners understand why. Keep it to one page and store it in the repo.

### [intermediate] ADR vs RFC: what is the difference?
An **RFC** is a proposal circulated *before* deciding, to gather feedback on a larger change (new platform, cross-team API). An **ADR** records the decision *after* it is made. Common flow: RFC → discussion → decision → ADR. For small team-level choices a short ADR alone is enough.

### [intermediate] Walk me through how you handle a production incident.
1. **Detect and acknowledge**; assign an incident lead and a communicator.
2. **Mitigate first**: roll back, disable a feature flag or scale up. Restore service before finding root cause.
3. **Communicate** status to stakeholders at a regular cadence.
4. **Investigate** with logs, metrics and traces.
5. **Resolve and verify**.
6. **Blameless postmortem** within a few days: timeline, root cause, what went well, what didn't, action items with owners and dates.
The goal is learning and prevention, never blame.

### [intermediate] What makes a postmortem blameless and why does it matter?
It focuses on **systems and process**, not individuals ("how did our pipeline let this through?" rather than "who broke it?"). People then report problems early and share the full story, which gives better fixes. I still hold people accountable for actions on follow-ups. A good postmortem has a timeline, contributing factors, impact, and concrete action items such as an alert, a test or a checklist.

### [intermediate] How do you communicate technical risk to non-technical stakeholders?
I translate it into **user impact, date and cost**: "If we skip the load test, there's roughly a one-in-five chance (example) the exam page fails at peak enrolment, affecting about 10,000 learners. A two-day test removes most of that risk." I give options with trade-offs and a recommendation, avoid jargon, and put it in writing after the conversation.

### [intermediate] How do you say no to a request without damaging the relationship?
I say no to the *scope or date*, not to the person, and offer alternatives: "We can't deliver all of this by the 15th. We can ship A and B by then and C the following sprint, or add a person. Which do you prefer?" I explain the trade-off in their language and ask what matters most. People accept "no" better when they see the reasoning and options.

### [intermediate] How do you manage up?
I share bad news early with a proposed plan, give regular short status updates (progress, risks, asks), and learn what my manager and product owner care about so I frame things accordingly. I bring solutions, not just problems, and make it easy to support me ("I need a decision on X by Thursday").

### [intermediate] Two engineers disagree strongly on a technical approach. What do you do?
Bring them together, restate each position fairly, and move to **evidence**: criteria (performance, maintainability, time, risk), a small prototype or benchmark if cheap, and a clear decision-maker. If it's still tied, I decide, explain why, record it in an ADR, and ask everyone to "disagree and commit". Afterwards I check in privately with both to make sure no one feels dismissed.

### [intermediate] A teammate is consistently missing deadlines. How do you handle it?
Start with curiosity in a private 1:1: are expectations clear, is the work too large, is there a skill gap, is something happening outside work? Agree specific expectations and shorter milestones, give early and specific feedback (SBI), pair if skills are the issue, and follow up weekly. If there is still no improvement, I involve my manager and HR with documented examples and a fair improvement plan. The goal is to help them succeed while protecting the team.

### [intermediate] How do you interview and evaluate engineering candidates?
I agree on the role's must-have skills beforehand and use a consistent structure: a practical problem close to real work (not trick puzzles), questions on design and trade-offs, and behavioural questions. I score against criteria right after the interview, write evidence-based feedback, and avoid gut-feel and bias (similar-to-me, pedigree). I also sell the role honestly: candidates interview us too.

### [intermediate] How do you spot and prevent burnout in your team?
Signs: longer hours, irritability, quality dropping, withdrawal, missed stand-ups. I look at workload in planning (don't commit at 100% capacity), rotate on-call and urgent work, encourage time off, and have regular 1:1s with real questions ("how is your energy?"). When deadlines are tight I negotiate scope with product rather than silently asking for overtime.

### [intermediate] How do you plan a release and manage its risk?
I confirm scope and dependencies, define the **definition of done**, schedule regression testing, prepare a rollback and a feature-flag option, and agree communication (who is told, when). I release smaller and more often when possible, deploy off-peak, monitor key metrics right after, and keep a "release day" checklist. Afterwards we note surprises in the retro.

### [advanced] What are the DORA metrics and how would you use them?
**Deployment frequency, lead time for changes, change failure rate, and time to restore service.** They measure delivery speed and stability together. I'd baseline them from the CI/CD and incident data, then target the bottleneck (for example long review waits or manual regression). I use them as a *team improvement* signal, never to rank individuals, and I pair them with developer feedback so we don't game the numbers.

### [advanced] How did you introduce AI tools to your team and measure the benefit?
I started with security and legal guidance (approved tools, no customer or patient data in prompts), ran a small pilot with willing developers on well-bounded tasks (tests, boilerplate, refactors, documentation), shared prompt examples, and wrote PR guidelines (the author is accountable; tests and review still required). I estimated roughly **4–6 hours saved per developer per sprint** by comparing sample tasks before and after and surveying the team (state this as an estimate with its method). I watched quality through review rounds and defects, and addressed risks such as over-reliance and hallucinated APIs through training and checklists.

### [advanced] How do you connect engineering work to business goals (OKRs)?
I ask what outcome the business needs (for example, learner completion rate or page performance), then translate to engineering objectives with measurable key results: "Reduce course page load time by 30% (example) so completion rises." I make sure each epic maps to a key result, review progress regularly, and drop or reshape work that doesn't move the number. It also helps justify technical investment to non-technical leaders.

### [advanced] How do you lead a change that the team resists?
Understand the resistance (fear, past bad experience, real technical concerns), involve people in shaping it, pilot on one small area, show evidence (numbers, demos), and document the new standard. I acknowledge the costs openly and support people with training and time. I celebrate early adopters and adjust based on feedback rather than forcing a big bang.

### [advanced] How do you handle ethics and security responsibilities as a lead?
In healthcare, learner and clinician data is sensitive. I enforce least privilege, review changes touching auth or data, keep secrets out of code and AI prompts, run dependency and vulnerability scans in CI, and make it safe to report mistakes. If I find a risk, I report it honestly and promptly even if it delays a release, with a mitigation plan.

### [advanced] Tell me about a time you failed.
(Use a real, modest failure.) Structure: **Situation**: I under-estimated a data migration (example). **Action**: when I saw the slip I told product the same day, proposed a reduced scope and a new date, and fixed the root cause. **Result**: we shipped one sprint later with no data loss. **Learning**: I now add a rehearsal on a production-like copy and a rollback plan to every migration estimate. Show ownership, a fix and a lasting safeguard.

### [advanced] How do you grow your own career and your team's?
For me: a short list of skills for the next level (system design, influence across teams), a mentor, side projects, and reading. For the team: individual growth plans in 1:1s, stretch assignments, rotating ownership of modules, internal talks, and honest feedback. I ask each person where they want to be in a year and look for work that moves them there.

### [advanced] How do you negotiate salary and an offer?
I research the market and decide my target, my floor and my priorities beforehand. I let the employer share a range first when possible, anchor to the scope and value I'll bring, and consider the whole package (fixed pay, variable, joining bonus, notice-period buy-out, learning budget, flexibility). I stay polite and factual, ask for time to decide, and get the final offer in writing. If I have a notice period, I state it honestly and discuss options.

### [advanced] What is your 30-60-90 day plan in a new lead role?
**30 days: listen and learn**: meet the team and stakeholders, read the architecture and incident history, ship a small fix. **60 days: contribute**: improve one pain point (for instance review turnaround), start 1:1s, propose a plan. **90 days: lead**: own a roadmap slice, show a measurable win, agree goals for the next quarter. I'd avoid big changes before understanding the context.

### [advanced] What questions would you ask the interviewer?
"What does success look like in this role at 6 and 12 months?", "How are technical decisions made and documented?", "How do you handle on-call, testing and releases?", "What's the biggest technical or team challenge right now?", "How do you support growth for leads?", "How is AI tooling used and governed here?" Good questions show you think about quality, people and outcomes.

### [advanced] How do you balance hands-on coding with leadership?
I code on tasks that are **not on the critical path** or that teach me the system's reality (spikes, tests, tricky bugs), avoid being the single owner of key features, and delegate hands-on work to grow others. I protect two blocks per week for focused work, and I review code so I stay close to quality. If I'm always blocking the team, I'm too deep in code; if I can't read a diff, I'm too far out.

## EXERCISES

### [basic] Prepare your 90-second introduction
Write and rehearse a 90-second answer to "Tell me about yourself" for a Lead Full Stack Engineer interview.
> Hint: Use present → past → future: who you are now, the proof, and why this role.
--- solution ---
**Structure**: who you are (10s) → what you do best (25s) → proof with numbers (35s) → why this role (20s).

**Model answer (edit with your real facts)**

"I'm Wishvanath, a Lead Full Stack Engineer with 8+ years' experience, mostly in React.js, TypeScript and Node.js. Right now I lead end-to-end delivery on the Clinical Learning Hub at CitiusTech and guide a team of 8–10 engineers through design, reviews and releases.

What I do best is turning ambiguous requirements into fast, maintainable products. I built a reusable component library that made screens about 35% faster to deliver, and our code-splitting, caching and query work improved page and API response times by 30–40% (verify these numbers). I also introduced AI-assisted engineering with Copilot, ChatGPT and Claude, which saved an estimated 4–6 hours per developer per sprint.

I'm looking for a lead role where I can own architecture and grow a team, and your focus on <company's product/problem> is exactly that."

Practise until it takes 80–90 seconds and sounds natural, not memorised.

### [basic] Write a kind and specific code review comment
A teammate's PR fetches data inside a ¦.map()¦ call, causing 50 API calls per page. Write a review comment.
--- solution ---
¦¦¦text
Nice work on the table component, the structure is clear and the tests cover the empty state well.

One thing to look at before merge (blocking):
in ¦renderRows¦ we call ¦getStatus(id)¦ inside ¦map¦, so a page of 50 rows makes 50 requests. In my local check this added about 1.2 s (example) to page load.

Suggestion: add a batch endpoint (¦GET /status?ids=1,2,3¦) or fetch the statuses once in the parent and pass them down. I can pair on this for 15 minutes if you'd like.

(non-blocking nit: rename ¦tmp¦ to ¦statusById¦ for readability)
¦¦¦
**Why it works**: starts with something positive and true, names the issue with evidence, marks severity (blocking vs nit), proposes a solution, offers help.

### [basic] Give SBI feedback
A junior developer regularly pushes PRs with no description. Write the SBI feedback and how you'd open the conversation.
--- solution ---
**Opening**: "Do you have 10 minutes? I'd like to share something that will help your PRs get merged faster."

**SBI**
- **Situation**: "In the last three PRs, including yesterday's ¦feature/course-filters¦..."
- **Behaviour**: "...the description was empty, so I had to read every file to understand what changed."
- **Impact**: "Reviews took longer (about a day each, example), and the QA team didn't know what to test."

**Ask**: "How do you see it? Is there anything making it hard to write them?"

**Agree**: use the PR template with three lines (what, why, how to test); I'll review the next two PRs together with you.

**Follow up** in the next 1:1 and acknowledge the improvement.

### [basic] Create a code review checklist
Write a checklist your team can paste into the PR template.
--- solution ---
¦¦¦text
Author checklist
[ ] The PR description explains what, why and how to test
[ ] PR is small and focused (one concern)
[ ] Tests added or updated; all pass locally
[ ] No secrets, tokens or patient data in code, logs or prompts
[ ] Errors and loading/empty states handled
[ ] Accessibility checked (labels, focus, contrast)
[ ] No console.log, dead code or commented-out blocks
[ ] AI-generated code was read, understood and verified

Reviewer checklist
[ ] Solves the actual requirement
[ ] Simple, readable, follows our patterns
[ ] Edge cases and failure paths covered
[ ] Security: input validation, auth, SQL/HTML injection
[ ] Performance: no N+1, unnecessary re-renders, big bundles
[ ] Tests meaningful (assert behaviour, not implementation)
[ ] Comments marked "must fix" or "suggestion"
¦¦¦

### [intermediate] Break a feature into tasks with estimates and risks
Feature: "Learners can download a certificate (PDF) after completing a course." Break it down for a team of 3.
> Hint: Cover backend, frontend, data, tests, deployment and unknowns. Give ranges.
--- solution ---
| Task | Estimate (days) | Risk / note |
|---|---|---|
| Clarify requirements (design, fields, language, regeneration rules) | 0.5 | Product to confirm template |
| DB change: ¦certificates¦ table (user, course, issued_at, code) + migration | 0.5 | Migration on large table: expand/contract |
| API: ¦POST /courses/:id/certificate¦ with eligibility check | 1–2 | Idempotent: same learner gets same certificate |
| PDF generation service (template, fonts) | 2–3 | Unknown library fit; spike first (0.5 day) |
| Store PDF in S3 + presigned download URL | 1 | IAM permissions |
| Frontend: button, loading, error and download states | 1–2 | Accessibility, slow PDF generation |
| Unit + integration tests | 1–2 | |
| QA, regression, staging deployment | 1 | |
| Buffer for unknowns (about 20%) | 1.5 | |

**Total**: about 10–14 days of effort, most likely 12 (example). **Risks**: template approval delay, PDF performance for bulk generation (consider a queue). **Assumptions**: English only; no bulk download.
State the range and re-estimate after the PDF spike.

### [intermediate] Write an ADR for choosing a state management approach
Decide between Redux Toolkit and React Query plus context for a new learning dashboard.
--- solution ---
¦¦¦text
ADR-012: State management for the learning dashboard
Status: Accepted (2026-01-12)

Context
- The dashboard mostly shows server data (courses, progress) with a few UI states (filters, modals).
- Team of 8-10, mixed experience; need quick onboarding and few bugs.

Options
1. Redux Toolkit for everything
   + predictable, devtools   - boilerplate for server cache, manual loading/error handling
2. React Query for server state + React context/useState for UI state
   + caching, retries, invalidation built in; less code   - two mental models
3. Zustand for UI + fetch hooks
   + tiny   - we would rebuild caching ourselves

Decision
Option 2. Server data via React Query, UI state via local state or context.

Consequences
+ Less boilerplate, automatic cache and refetch
- Team needs a short React Query training
- Revisit if cross-page client state becomes complex (then add Redux Toolkit)
¦¦¦

### [intermediate] Write a blameless postmortem for a failed release
Release 4.2 shipped a migration that locked the ¦enrolments¦ table for 12 minutes and the site timed out during peak hours.
--- solution ---
¦¦¦text
Postmortem: Release 4.2 enrolment outage (example numbers)

Summary
Between 10:05 and 10:22 UTC, 18% of requests failed while a migration locked the enrolments table. About 3,500 learners were affected.

Impact
- Enrolment and progress pages unavailable for 17 minutes
- 40 support tickets

Timeline
10:00 Deployment starts, migration runs
10:05 Alerts: error rate > 5%
10:08 Incident lead assigned, deployment paused
10:15 Migration identified as the cause; query killed
10:22 Service restored; rollback of app version

Root cause
An ALTER TABLE added a column with a default value on a 40M-row table and held a metadata lock.

Contributing factors
- Migration tested only on a small staging dataset
- Deployed at peak hours
- No automated check for long-running migrations

What went well: fast alert, clear incident roles, quick communication

Action items (owner, date)
1. Test migrations on a production-sized copy (Asha, Feb 3)
2. Adopt expand/contract and online schema change for large tables (Ravi, Feb 10)
3. Deployment window off-peak + migration lint in CI (Team, Feb 17)
4. Add a runbook: "stopping a migration" (Priya, Feb 5)
¦¦¦

### [intermediate] Plan a 1:1 agenda
You have a 30-minute weekly 1:1 with a mid-level engineer who wants to move to senior. Draft the agenda and questions.
--- solution ---
**Agenda (30 min)**
1. **Check-in (5 min)**: "How are you doing? How's your energy and workload?"
2. **Their topics (10 min)**: blockers, questions, ideas. They go first.
3. **Work and feedback (8 min)**: recent wins, one piece of specific feedback (SBI) in both directions.
4. **Growth (5 min)**: progress on the "senior" plan (design ownership, mentoring, estimation).
5. **Actions (2 min)**: write 2–3 follow-ups.

**Good questions**: "What's one thing slowing you down?", "What would you like to learn this quarter?", "What should I start, stop, continue doing as your lead?", "Which task did you enjoy most?"

**Habits**: keep a shared doc of notes and actions; never cancel casually; don't use it only for status updates.

### [intermediate] Respond to a stakeholder asking "why is this late?"
The product owner messages: "Why is the reporting feature late? The client demo is on Friday." Write a response.
--- solution ---
¦¦¦text
Hi Maria, thanks for flagging, and I understand the Friday demo pressure.

Status: the reporting API and charts are done and tested. The export-to-CSV part is behind by about 3 days because the data model needed a change we only discovered when testing with real data (about 2 million rows made the first query slow).

Options:
A) Demo on Friday with charts only; CSV export ready Wednesday next week. (Recommended: no risk to quality)
B) Keep CSV for Friday by limiting export to the last 30 days; full range afterwards.
C) Delay the demo to Tuesday.

What I need from you: a decision by tomorrow noon so we can plan. I'll send a short update each day at 4 pm until it is shipped.

Sorry for the late warning; we now run a performance check on real-sized data at the start of each report story.
¦¦¦
**Why it works**: facts, cause, options with a recommendation, a clear ask and date, accountability, and a prevention step.

### [intermediate] Write 3 STAR stories from your own work
Draft three stories: (1) performance improvement, (2) leading under pressure, (3) mentoring. Use your real examples.
--- solution ---
**Template** (aim for 2 minutes, 250–300 words)

**Situation** (1–2 sentences): where, when, what was at stake.
**Task** (1 sentence): your responsibility.
**Action** (4–6 sentences, "I"): the specific steps, decisions, trade-offs.
**Result** (2 sentences + number): outcome and what you learned.

**Example 1: Performance (fill in with your real data)**
- S: Course pages on the Clinical Learning Hub loaded slowly for learners on weak networks.
- T: I owned improving load time without a rewrite.
- A: I profiled with Lighthouse, then introduced route-level code-splitting, cached stable API responses and tuned two slow MySQL queries with indexes. I verified with before/after measurements.
- R: Page and API response times improved by about 30–40% (verify), and we added a performance budget to CI.

Write examples 2 and 3 in the same shape. Check each: Is there a number? Does "I" appear more than "we"? Is there a learning?

### [advanced] Prepare a decision memo on introducing AI coding tools
Your director asks if the team should adopt AI coding assistants. Write a one-page recommendation.
--- solution ---
¦¦¦text
Recommendation: Adopt approved AI coding assistants with guardrails, starting with a 6-week pilot.

Why
- Tests, boilerplate, refactors and documentation are repetitive and well suited to assistance
- Pilot estimate (example, verify): 4-6 hours saved per developer per sprint

Risks and controls
- Data leakage: approved enterprise tools only; no patient/customer data or secrets in prompts
- Quality: author accountable for every line; tests and review unchanged
- Licensing/security: dependency and licence scanning in CI
- Over-reliance: juniors explain AI-generated code in PRs

Plan
Weeks 1-2 policy and training; weeks 3-6 pilot with 4 volunteers on defined tasks; measure cycle time, review rounds, defects, satisfaction.

Decision needed: approve tool licences and policy by [date].
¦¦¦

### [advanced] Practise a 30-60-90 day plan
Write your 30-60-90 day plan for a new Lead Full Stack Engineer role at a company building a learning platform.
--- solution ---
**Days 1–30: learn**
- Meet each team member 1:1; meet product, QA, design and your manager.
- Read architecture docs, recent incidents and the roadmap; run the app locally; ship one small fix.
- Understand release process, on-call and quality metrics.
- Output: a written list of what is working, risks and quick wins.

**Days 31–60: contribute**
- Pick one pain point (slow PR reviews, flaky tests, unclear estimates) and improve it with the team.
- Start regular 1:1s and agree development goals.
- Lead a design discussion with an ADR.
- Output: first measurable improvement.

**Days 61–90: lead**
- Own a roadmap slice end to end; propose a quarter plan with risks.
- Show results on 1–2 metrics (cycle time, defects, page speed).
- Agree goals with my manager for the next 6 months.

**Principle**: listen before changing; earn trust with one visible win.

### [advanced] Prepare your answers for the questions you will ask them
Write six questions to ask the interviewer and what each tells you.
--- solution ---
| Question | What it reveals |
|---|---|
| "What does success look like for this role at 6 and 12 months?" | Expectations, clarity, and whether goals are realistic |
| "How are technical decisions made and documented?" | Culture of ownership, ADRs, autonomy |
| "How do you handle releases, testing and on-call?" | Engineering maturity and workload |
| "What is the biggest technical challenge or debt right now?" | Honesty and the real problem you'd inherit |
| "How do you support growth for leads?" | Career path, mentoring, budget |
| "How do you use AI tools in engineering, and what are the guardrails?" | Modern practices and governance |

After the answers, listen for hesitation, blame, or vague replies; they signal risk.

## SCENARIOS

### Your team is behind schedule two days before a release. What do you do?
Gather facts quickly: what is done, what remains, what is risky. Talk to product with **options** (cut scope, move date, add help, release behind a feature flag). Prioritise must-haves with the team, protect testing time, and avoid hidden overtime. Communicate status to stakeholders daily. After the release, run a retro on why the estimate was off (scope growth, unknowns, dependencies) and adjust planning, for example by adding buffers and an earlier spike.

### A senior engineer on your team keeps overriding decisions in code reviews. How do you handle it?
Talk privately with curiosity first: what concerns drive these comments? Share specific examples (SBI) of the impact on morale and speed. Clarify decision rights: for design decisions use an ADR and a named decision-maker; reviews should focus on correctness and clarity, not personal style (use linters for style). Offer them a bigger role such as owning architecture reviews or mentoring, which channels their energy. Follow up and check how the team feels.

### Your manager asks for a date for a feature that is not well defined. What do you say?
Say what you know and don't know: "With current information I can give a range of 6–10 weeks. I need a spike of 3 days and answers on X and Y to narrow it." Offer to give a firm date after the spike and write the assumptions down. Avoid committing to a precise date under pressure; commit to when you'll provide a better estimate.

### A critical bug is found in production on Friday evening. What are your first steps?
Assess impact and severity, assign an incident lead and communicator, and decide: roll back, disable a feature flag, or hotfix. Mitigate first, investigate second. Notify stakeholders with a clear status. Keep the team rested: rotate people and avoid long sessions. Monday: blameless postmortem with action items such as tests, alerts and a release checklist.

### Two teams need your people for conflicting priorities. How do you decide?
Clarify the business impact and deadlines of both; ask product and managers for the priority ranking rather than deciding silently. Offer options (split capacity, sequence the work, or add resources) with trade-offs, and document the decision. Keep communication open with both teams so that expectations are managed.

### A new joiner struggles after three weeks. What is your approach?
Ask them how it's going and what is confusing. Check onboarding: was the environment, documentation and buddy support adequate? Break work into smaller tasks, pair more, set clear weekly goals, and give frequent feedback. Review progress after two weeks. If the gap is large, discuss options with your manager early, and treat it as a fixable support problem first.

### How would you decide between rewriting a legacy module and refactoring it incrementally?
Gather evidence: bug rate, change cost, test coverage, how critical it is, and the team's knowledge. Prefer incremental refactoring with tests around existing behaviour (strangler pattern) because it delivers value continuously and has lower risk. Consider a rewrite only if the technology is unsupported or the design blocks needed features, and then with a time-boxed plan, parallel run and rollback. Explain the trade-off to product in cost and risk.

### You disagree with a decision made by your manager. What do you do?
Seek to understand the reasoning first. Then share your concerns privately with evidence and alternatives, focused on the goal ("I'm worried this increases release risk because..."). If the decision stands, "disagree and commit": support it publicly and monitor the risks you raised. Escalate only if there is a serious ethical, security or safety concern.
`;
