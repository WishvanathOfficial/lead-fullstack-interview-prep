window.PREP_NOTES = window.PREP_NOTES || {};
window.PREP_NOTES.leader = String.raw`
## Phase 1 · Foundations (Basic)
### Lead vs senior engineer vs manager
#### In one line
A senior engineer owns hard technical problems, a lead owns the technical outcome of a whole team's work, and a manager owns the people and the team's health.

#### Real-life analogy
A football team: the senior striker scores the hard goals, the captain on the pitch (lead) organises the play and keeps standards up while still playing, and the club manager (manager) picks the squad, handles contracts and long-term development.

#### How it works
- **Senior**: scope is a problem or a feature. Success = excellent work delivered reliably.
- **Lead**: scope is a team's delivery. Success = the team ships good software on time, and people grow.
- **Manager**: scope is people and organisation. Success = a healthy, hiring, growing team that meets goals.
- The lead keeps coding (hands-on) but adds design direction, reviews, estimation, mentoring and communication with product.
- Interviewers want to hear that your *impact is multiplied through others*.

#### Example
¦¦¦text
Before (senior):  "I built the reporting module in two sprints."
As a lead:        "I designed the reporting approach with the team, split it into 6 tasks, paired with two juniors,
                   reviewed 20 PRs, and we shipped it in two sprints with zero Sev-1 bugs."
¦¦¦

#### Remember it
**Senior = best player. Lead = captain. Manager = coach.**

| Role | Main question they answer |
|---|---|
| Senior | "How do I solve this well?" |
| Lead | "How does my team solve this well?" |
| Manager | "Do the right people have what they need to grow and deliver?" |

#### Common mistakes
- Answering with only your own tasks and no team outcome.
- Saying a lead "just manages people": a lead is still technical.
- Acting like a manager (HR decisions) when the role is technical leadership.

#### Interview angle
Say: "As Lead Engineer – II I still write code on the hardest work, but my main value is the team's result: design direction, reviews, estimation with product and growing the 8–10 engineers I work with." Follow-up: "What did you stop doing when you became a lead?" (Answer: being the only person who can fix everything.)

### Technical leadership vs people leadership
#### In one line
Technical leadership is setting direction on design and quality; people leadership is helping individuals do their best work and grow.

#### Real-life analogy
An orchestra: the first violinist (technical) sets the sound and standard; the conductor's care for each player (people) decides whether they perform well together.

#### How it works
- **Technical**: architecture decisions, standards, code review, solving the tricky problems, spotting risk early.
- **People**: 1:1s, feedback, mentoring, motivation, fairness, conflict handling.
- A lead needs both. Strong technical skills without people skills creates a "hero" who blocks the team; people skills without technical credibility loses trust.
- Balance changes with the situation: a new team needs more technical direction, a stressed team needs more people support.

#### Example
¦¦¦text
Technical: wrote an ADR to choose React Query for server state; set a PR checklist.
People:    noticed a junior went quiet after a harsh review; held a private 1:1, re-explained the pattern,
           paired for an hour; they merged their next PR without comments.
¦¦¦

#### Remember it
**"Head and heart": head sets the direction, heart brings people along.**
- Technical: decide, design, review.
- People: listen, grow, protect.

#### Common mistakes
- Becoming the bottleneck for every decision.
- Skipping 1:1s because "the code is more urgent".
- Giving technical feedback in public in a harsh tone.

#### Interview angle
Give one example of each from your real work and say how you balance them. Model: "I use ADRs to share technical decisions openly, and I keep a weekly 1:1 rhythm so people feel supported." Follow-up: "Which is harder for you?" Answer honestly and say what you do to improve it.

### Estimation basics: story points, task breakdown, buffers
#### In one line
Estimation is giving the team and stakeholders an honest range for how long work will take, based on breaking it into small, understood pieces.

#### Real-life analogy
Planning a road trip: you don't say "about 6 hours" for a route you haven't checked. You split it into legs, add petrol stops and traffic buffers, and update your arrival time on the way.

#### How it works
1. Clarify the scope and acceptance criteria; write down assumptions.
2. Break work into tasks of 1–2 days (backend, frontend, DB, tests, deploy).
3. Estimate each (relative story points or days) with the team.
4. Add buffer for risk (new library, unclear requirements, integrations).
5. Give a range and a confidence level, and re-estimate when you learn more.
- **Story points** = relative size/uncertainty; **velocity** = points completed per sprint.

#### Example
¦¦¦text
Feature: certificate download
Tasks: DB 0.5d | API 1-2d | PDF service 2-3d (spike first) | UI 1-2d | tests 1-2d | QA/deploy 1d
Sum: 7-11.5d  + 20% buffer  =>  "9-14 days, most likely 11"
Assumption: English-only, no bulk download.
¦¦¦

#### Remember it
**Break it, range it, buffer it, revisit it.**
- Never give one number under pressure.
- Estimate with the team, not for the team.
- Track actual vs estimate to improve.

#### Common mistakes
- Treating an estimate as a promise.
- Forgetting testing, review, deployment and meetings.
- Not stating assumptions.
- Estimating huge items without splitting.

#### Interview angle
Model answer: "I break the work into small tasks, estimate as a team, add a visible risk buffer and give a range, then re-estimate after any spike." Follow-up: "What do you do when stakeholders push you to cut the estimate?" (Offer scope options, not a smaller number.)

### Agile and Scrum ceremonies and what a lead owns
#### In one line
Scrum gives the team a rhythm of planning, daily sync, demo and retro; the lead makes sure each one is technically sound and useful.

#### Real-life analogy
A sports season: pre-season planning, daily practice check-ins, match day (demo) and a post-match review (retro) where you decide what to change.

#### How it works
- **Refinement**: clarify stories, split big ones, surface technical risks.
- **Sprint planning**: realistic commitment based on velocity and capacity (holidays, on-call).
- **Daily stand-up** (15 min): progress, plan, blockers; the lead follows up on blockers after.
- **Review/demo**: show working software to stakeholders and collect feedback.
- **Retrospective**: pick 1–2 actions, assign owners, review them next time.
- The lead protects the team from mid-sprint scope changes and from unclear tickets.

#### Example
¦¦¦text
Retro action: "Reviews wait 2 days" ->
  Action: PR review slot at 11:00 daily; owner Ravi; check metric (time to first review) next retro.
¦¦¦

#### Remember it
**P-D-D-R: Plan, Daily, Demo, Retro (+ Refine).** A ceremony without a decision or action is waste.

#### Common mistakes
- Stand-ups that become status reports to the manager.
- Retros with no follow-up.
- Over-committing at 100% capacity.

#### Interview angle
Say what you do *in* each ceremony, not just names. Model: "In refinement I check each story is testable and split anything over three days." Follow-up: "What would you change about a bad stand-up?" (Timebox, focus on blockers, take discussions offline.)

### Code review culture and checklists
#### In one line
Code review is the team habit of checking each other's changes for correctness, design and risk, and learning from them.

#### Real-life analogy
A second pilot reading the checklist: not because the first pilot is bad, but because two sets of eyes catch what one misses.

#### How it works
- Authors keep PRs small with a clear description and tests.
- Reviewers check: **correctness → design → readability → tests → security/performance**.
- Linters and formatters handle style automatically.
- Comments are specific, kind, explain *why*, and label severity ("must fix" vs "nit").
- Target review within one working day; unblock quickly.
- Approve with comments when the rest is minor.

#### Example
¦¦¦text
nit: rename ¦tmp¦ to ¦statusById¦ (non-blocking)
must fix: ¦getStatus¦ is called inside ¦map¦ = 50 requests per page; batch or fetch in the parent.
question: why do we need ¦useMemo¦ here? Is the list large?
¦¦¦

#### Remember it
**"Kind, specific, why, severity."**
- Review the code, not the person.
- Small PR = fast review = fewer bugs.

#### Common mistakes
- Commenting on style a linter can fix.
- Rewriting the author's code in comments.
- Leaving PRs waiting for days.
- Approving without reading ("LGTM" only).

#### Interview angle
Model: "I review for correctness and design first, use a checklist, label comments by severity and aim for same-day turnaround." Follow-up: "How do you handle a senior who gets defensive in reviews?" (Talk privately, focus on shared goals and evidence.)

### Giving and receiving feedback (SBI model)
#### In one line
SBI is a simple way to give feedback: describe the Situation, the Behaviour you saw, and the Impact it had.

#### Real-life analogy
A sports replay: it shows exactly what happened and its effect on the score, rather than shouting "you played badly".

#### How it works
1. **Situation**: when and where ("In Monday's planning...").
2. **Behaviour**: what you observed, facts only ("you interrupted twice...").
3. **Impact**: the effect on the team, work or you ("she stopped sharing...").
4. Then **ask** for their view and agree a next step.
- Give feedback soon, in private for corrective feedback, in public for praise.
- Receiving: listen, ask for an example, thank them, reflect, then act.

#### Example
¦¦¦text
Situation: In yesterday's design review
Behaviour: you answered "that won't work" without explaining why
Impact:    the new joiner didn't present her idea and we missed a simpler option
Ask:       "How did you see it? What would help you give feedback in reviews?"
¦¦¦

#### Remember it
**S-B-I, then ask.** Facts, not labels ("rude", "lazy").

#### Common mistakes
- Vague feedback ("be more proactive").
- The "feedback sandwich" that hides the message.
- Waiting for the annual review.

#### Interview angle
Model: "I use SBI: I describe the situation, the behaviour and its impact, then ask for their perspective and agree an action." Follow-up: "Tell me about feedback that changed you." Have a real example ready.

### Mentoring and growing junior engineers
#### In one line
Mentoring is helping someone become independent faster by giving them guidance, stretch tasks and honest feedback.

#### Real-life analogy
Teaching someone to ride a bike: you hold the seat first, let go slowly, and run alongside until they don't need you.

#### How it works
1. Learn their goals and gaps.
2. Give small, clear tasks with success criteria.
3. Pair on the first tasks; then step back.
4. Review with explanations, not rewrites.
5. Hold regular 1:1s on progress, blockers and career.
6. Raise difficulty gradually; let them present their work.
- Measure growth by independence and quality, not by hours spent.

#### Example
¦¦¦text
Goal: Anita to own the "filters" module in 3 months
Month 1: pair on fixing 3 bugs; Month 2: she designs, I review; Month 3: she leads and demos
Signal: fewer review comments, accurate estimates, explains trade-offs
¦¦¦

#### Remember it
**"I do, we do, you do."**

#### Common mistakes
- Doing the task for them.
- Only mentoring the people you like.
- Giving feedback only when something is wrong.

#### Interview angle
Tell a real story: who, what gap, what you did, how you measured improvement. Follow-up: "What if they don't improve?" (Clarify expectations, change approach, escalate fairly.)

### STAR method and storytelling
#### In one line
STAR is a structure for behavioural answers: Situation, Task, Action, Result.

#### Real-life analogy
A good movie trailer: short setup, the hero's decisive moves, and the outcome that makes you care.

#### How it works
- **Situation + Task** (about 15%): context and your responsibility.
- **Action** (about 60%): what *you* did, step by step, with "I".
- **Result** (about 25%): numbers, impact, and what you learned.
- Prepare 6 reusable stories: leading, conflict, failure, performance win, mentoring, change.
- Keep each to about two minutes.

#### Example
¦¦¦text
S: Pages on the Clinical Learning Hub were slow on weak networks.
T: I owned improving load time without a rewrite.
A: Profiled with Lighthouse, added route code-splitting, cached stable APIs, tuned two MySQL queries.
R: Page and API times improved ~30-40% (verify); added a performance budget to CI.
¦¦¦

#### Remember it
**S-T-A-R: set up fast, spend time on Action, finish with a number.**

#### Common mistakes
- Saying "we" for everything.
- No result or no number.
- Long background, short action.
- Stories that make you look blameless in a failure question.

#### Interview angle
Say: "Let me give a specific example" and tell the story. Follow-up: "What would you do differently?" Always have a learning.

### Onboarding new engineers
#### In one line
Onboarding is the plan that makes a new joiner productive and comfortable quickly.

#### Real-life analogy
A good hotel check-in: key ready, a map, someone to ask, and a first easy outing to feel at home.

#### How it works
- **Before day 1**: access, laptop, buddy, written guide.
- **Week 1**: run the app locally, merge a tiny first PR, architecture walkthrough, meet the people.
- **Weeks 2–4**: a bounded real feature with a buddy, coding standards, release process.
- **Always**: ask what was confusing and update the docs.

#### Example
¦¦¦text
Day 1: environment up, meet buddy | Day 2: read architecture doc, ask questions
Day 3: first small PR (fix typo/bug) | Week 2: own a small ticket
Check-ins: end of week 1, week 2, week 4
¦¦¦

#### Remember it
**"Access, buddy, first PR, first feature."**

#### Common mistakes
- No ready access on day one.
- Throwing them into a huge ticket.
- Never updating the onboarding doc.

#### Interview angle
Model: "I give a buddy, a small first PR in week one and check in often." Follow-up: "How do you know onboarding worked?" (Time to first PR, confidence, questions asked.)

### Remote and cross-team collaboration
#### In one line
Collaboration across locations and teams works when decisions, context and expectations are written down and shared.

#### Real-life analogy
Passing a baton in a relay: it works because the hand-off is clear, rehearsed and visible.

#### How it works
- Write decisions in shared docs or ADRs.
- Use overlap hours for discussion; async updates for the rest.
- Clear PR descriptions, ticket acceptance criteria and demo videos.
- Agree response-time expectations and ownership of shared components.
- Involve QA, product and design early.

#### Example
¦¦¦text
Async update (daily, 3 lines):
Done: reports API  |  Next: CSV export  |  Blocked: need prod-sized data from DBA
¦¦¦

#### Remember it
**"If it isn't written, it didn't happen."**

#### Common mistakes
- Decisions made in calls with no notes.
- Assuming other teams know your priorities.
- Time-zone unfairness (always the same people stay late).

#### Interview angle
Model: "I document decisions, keep updates short and async, and involve other teams early." Follow-up: "Tell me about a cross-team disagreement." Use a real STAR story.

## Phase 2 · Day-to-day leadership (Intermediate)
### Delegation: what to hand off and how
#### In one line
Delegation is giving someone ownership of an outcome, with clear success criteria and support, so the team can do more than you alone.

#### Real-life analogy
A head chef who hands the sauce station to a trusted cook: defines the taste standard, checks occasionally, but doesn't stir the pot for them.

#### How it works
1. Choose the right task and person (growth edge, not overload).
2. State the **outcome**, constraints, deadline and who to ask.
3. Agree check-in points (not daily micromanagement).
4. Let them decide how; give feedback after.
5. If it fails, review the process, not the person.
- Don't delegate what only you must own (hiring decisions, sensitive feedback).

#### Example
¦¦¦text
"Priya, you own the notification preferences module end to end.
 Goal: users can choose email/in-app; live by sprint 14. Ask me for design review on Wednesday.
 I'll check progress Thursday; decisions inside the module are yours."
¦¦¦

#### Remember it
**Outcome, owner, check-in, trust.**

#### Common mistakes
- Delegating the boring work only.
- Taking it back at the first problem.
- Hovering and re-doing it silently.

#### Interview angle
Model: "I delegate outcomes with clear criteria and agreed check-ins, matched to each person's growth." Follow-up: "Example when delegation went wrong?" Own your part: unclear criteria, no check-in.

### Technical debt: finding it, sizing it, prioritising it
#### In one line
Technical debt is shortcut code that makes future change slower or riskier; managing it means choosing which debt to repay and when.

#### Real-life analogy
A credit card: borrowing helps you move fast now, but the interest (slower features, more bugs) grows until you repay.

#### How it works
1. **Find**: bug hotspots, slow modules, areas everyone fears, missing tests.
2. **Size**: impact (bugs, slowdowns, risk) vs cost to fix.
3. **Prioritise**: high impact + low cost first; security/reliability risk jumps the queue.
4. **Sell it**: translate into business effect ("adds two days to every feature").
5. **Pay incrementally**: reserve 15–20% of capacity (example) or attach to features (boy-scout rule).
- Avoid big-bang rewrites unless there is no safe alternative.

#### Example
¦¦¦text
Item: legacy enrolment module
Impact: 30% of bugs, +2 days per feature (example)   Cost: 6 days
Plan: add tests around behaviour (2d), extract service (3d), remove dead code (1d), measure bugs next quarter
¦¦¦

#### Remember it
**Impact over cost; explain in business words; repay a bit every sprint.**

#### Common mistakes
- Asking for "a refactor sprint" with no business case.
- Treating all debt as equal.
- Starting a rewrite you can't finish.

#### Interview angle
Model: "I quantify the cost to delivery and bugs, propose a bounded plan, and keep a steady percentage of each sprint." Follow-up: "What if product refuses?" Offer the smallest slice with the highest value and show the data.

### Architecture decision records and RFCs
#### In one line
An ADR is a short note recording an important technical decision and why; an RFC is a proposal shared for feedback before deciding.

#### Real-life analogy
Meeting minutes for the architecture: next year, anyone can see what was decided and what was rejected, and why.

#### How it works
- **ADR** sections: context, options, decision, consequences, status.
- **RFC** flow: write proposal, circulate, collect comments, decide, then record an ADR.
- Keep it one page; store in the repo; number them; supersede, never delete.
- Write one for costly-to-reverse choices (auth, database, state management, new service).

#### Example
¦¦¦text
ADR-012: Server state with React Query
Context: dashboard is mostly server data
Options: Redux Toolkit | React Query + context | Zustand
Decision: React Query + context
Consequences: less boilerplate; team training needed; revisit if client state grows
¦¦¦

#### Remember it
**Context, options, decision, consequences.**

#### Common mistakes
- Writing ADRs after months, from memory.
- Hiding the rejected options.
- Long documents nobody reads.

#### Interview angle
Model: "For costly decisions I write a one-page ADR with options and trade-offs so we don't re-debate it." Follow-up: "ADR vs RFC?" RFC before, ADR after.

### Incident response and blameless postmortems
#### In one line
Incident response is a calm, structured way to restore service first and then learn from what happened without blaming people.

#### Real-life analogy
A fire brigade: first put out the fire, then investigate how it started so it can't happen again.

#### How it works
1. Detect, acknowledge, assign an **incident lead** and a **communicator**.
2. **Mitigate first**: roll back, flag off, scale.
3. Communicate regularly with stakeholders.
4. Find root cause with logs, metrics, traces.
5. **Postmortem** within days: timeline, impact, root cause, contributing factors, what went well, action items with owners and dates.
- Blameless: ask "how did the system allow this?", not "who did this?".

#### Example
¦¦¦text
Action items:
1. Test migrations on prod-sized data (Asha, Feb 3)
2. Migration lint in CI (Team, Feb 17)
3. Runbook: stopping a migration (Priya, Feb 5)
¦¦¦

#### Remember it
**Stop the bleeding, tell people, find the cause, fix the system.**

#### Common mistakes
- Debugging before mitigating.
- Hero culture (one person fixes everything at night).
- Postmortems with no follow-through.

#### Interview angle
Model: "I mitigate first, communicate on a cadence, then run a blameless postmortem with owned action items." Follow-up: "A real incident?" Use a STAR story with the safeguard you added.

### Stakeholder and product communication
#### In one line
Communicating with stakeholders means turning technical facts into dates, cost, risk and user impact in their language.

#### Real-life analogy
A pilot's announcement: short, calm, honest about the delay, and clear about what happens next.

#### How it works
- Know their goals (revenue, compliance, learner experience).
- Lead with the **headline and the decision needed**; details after.
- Quantify: users affected, days, cost.
- Offer **options with a recommendation**.
- Confirm in writing; update regularly; share bad news early.

#### Example
¦¦¦text
"Without a load test there's roughly a 1-in-5 chance (example) the exam page fails at peak, affecting ~10,000 learners.
 A 2-day test removes most of that risk. I recommend adding it. Decision needed by Thursday."
¦¦¦

#### Remember it
**Headline, impact, options, ask.**

#### Common mistakes
- Jargon ("N+1 query") with no impact.
- Hiding problems until the last day.
- Giving only problems, no options.

#### Interview angle
Model: "I translate technical risk into user impact and dates, and always bring options." Follow-up: "A stakeholder disagrees with your estimate?" Walk through the breakdown and assumptions.

### Saying no and managing up
#### In one line
Saying no well means refusing the scope or date while offering alternatives; managing up means keeping your manager informed and equipped to help.

#### Real-life analogy
A restaurant saying: "The steak will take 40 minutes; the pasta is ready in 10. Which would you like?" Honest and helpful.

#### How it works
- Say no to the request, not the person; explain the trade-off.
- Offer 2–3 options (reduce scope, move date, add people).
- Share bad news early with a proposed plan.
- Give short, regular updates: progress, risks, asks.
- Learn what your manager measures and frame work accordingly.

#### Example
¦¦¦text
"We can't ship A, B and C by the 15th. Options: (1) A+B by the 15th, C next sprint, (2) all three on the 22nd,
 (3) add one engineer, still the 20th. I recommend (1). Which fits the client best?"
¦¦¦

#### Remember it
**No + because + options + recommendation.**

#### Common mistakes
- Saying yes and silently working weekends.
- Surprising your manager.
- Complaining without proposing anything.

#### Interview angle
Model: "I explain the trade-off and offer options so the decision-maker chooses with full information." Follow-up: "What if they insist?" Document the risk, commit to the decision, monitor.

### Conflict resolution within the team
#### In one line
Conflict resolution means turning a personal or technical disagreement into a decision based on shared goals and evidence.

#### Real-life analogy
A referee who doesn't take sides but applies the rules and checks the replay.

#### How it works
1. Listen to each side separately, then together.
2. Restate both positions fairly.
3. Agree on criteria (performance, maintainability, time, risk).
4. Use evidence: benchmark, prototype, data.
5. Name a decision-maker; decide; "disagree and commit".
6. Record the decision (ADR) and follow up privately.

#### Example
¦¦¦text
Two engineers: GraphQL vs REST for the dashboard.
Criteria: delivery time, team skills, caching, over-fetching.
Prototype: 1 day each endpoint; REST chosen for team skills; ADR written; revisit in 6 months.
¦¦¦

#### Remember it
**People vs problem; criteria before opinions; decide and commit.**

#### Common mistakes
- Ignoring it hoping it will fade.
- Picking the louder voice.
- Public blame.

#### Interview angle
Model: "I separate the people from the problem, agree criteria, test with evidence and make a clear decision." Follow-up: "What if you're one of the two?" Ask a neutral person to decide, and commit.

### Hiring and interviewing
#### In one line
Hiring well means evaluating candidates against clear criteria with a structured, fair process.

#### Real-life analogy
A good audition: the same piece for everyone, a scoring sheet, and the panel decides on evidence, not on who chats best.

#### How it works
- Define must-have skills and level before interviewing.
- Use a practical task close to real work and structured questions.
- Score immediately with written evidence; avoid gut feel and bias.
- Check collaboration, communication and learning ability.
- Treat candidates well; they evaluate you too.

#### Example
¦¦¦text
Scorecard (1-4): problem solving | React/Node depth | system thinking | communication | collaboration
Evidence: "Explained trade-off between cache-aside and write-through with an example from a past project."
¦¦¦

#### Remember it
**Same questions, written evidence, no gut feel.**

#### Common mistakes
- Trick puzzles unrelated to the job.
- Hiring people like yourself.
- Not giving feedback.

#### Interview angle
Model: "I use a structured practical interview with a scorecard and avoid bias." Follow-up: "A candidate is strong technically but unkind?" Weigh impact on the team; probe with behavioural questions.

### Handling underperformance
#### In one line
Handling underperformance means giving early, clear support and a fair path to improvement, and escalating only after documented effort.

#### Real-life analogy
A coach noticing a player's form dropping: asks what's wrong, adjusts training, sets small goals, and only then considers the lineup.

#### How it works
1. Check facts: is the expectation clear? Is the workload fair?
2. Private 1:1 with SBI feedback and curiosity.
3. Find causes: skill, clarity, motivation, personal issues.
4. Agree a short plan with measurable goals and support.
5. Follow up weekly; recognise progress.
6. If no progress: involve manager/HR with documented examples.

#### Example
¦¦¦text
Goal for 4 weeks: PRs under 300 lines, tests included, estimates within 25% of actual
Support: pairing twice a week; weekly check-in; review checklist
¦¦¦

#### Remember it
**Clarify, support, document, decide fairly.**

#### Common mistakes
- Avoiding the conversation for months.
- Surprising someone in the annual review.
- Public criticism.

#### Interview angle
Model: "I start with curiosity and clear expectations, give specific feedback and a plan, and escalate fairly if needed." Follow-up: "What if it's a personal issue?" Show empathy, adjust workload, involve HR resources.

### Burnout, workload and sustainable pace
#### In one line
Sustainable pace means planning work so people can deliver well over months, and noticing early when someone is overloaded.

#### Real-life analogy
A marathon runner who sprints from the start won't finish; steady pacing wins.

#### How it works
- Signs: long hours, irritability, quality drop, withdrawal.
- Plan at about 80–85% capacity; include support work and holidays.
- Share on-call and urgent work fairly.
- Ask about energy in 1:1s.
- Negotiate scope with product, not silent overtime.

#### Example
¦¦¦text
Sprint capacity: 5 devs x 8 days = 40; minus holiday 4, support 4, ceremonies 4 => commit to ~26 dev-days of feature work.
¦¦¦

#### Remember it
**Capacity is real; overtime is a loan with interest.**

#### Common mistakes
- Treating heroics as normal.
- Promising dates without checking capacity.

#### Interview angle
Model: "I plan at realistic capacity, watch workload signals and negotiate scope instead of overtime." Follow-up: "A deadline can't move?" Cut scope, add help, and agree recovery time afterwards.

### Release planning and risk management
#### In one line
Release planning is deciding what ships when, with checks, a rollback plan and clear communication to reduce surprises.

#### Real-life analogy
A flight departure: checklist done, weather checked, alternate airport known, passengers informed.

#### How it works
1. Confirm scope, dependencies and definition of done.
2. Schedule regression and performance tests.
3. Prepare rollback and a feature flag for risky parts.
4. Deploy off-peak; monitor error rate, latency and key flows.
5. Communicate who is told what and when.
6. Retro on surprises.

#### Example
¦¦¦text
Release checklist: migrations tested on prod-size copy | flags ready | rollback tested | monitoring dashboard open |
support informed | release notes sent | on-call named
¦¦¦

#### Remember it
**Small, flagged, monitored, reversible.**

#### Common mistakes
- Big-bang Friday releases.
- Untested rollback.
- No owner during release.

#### Interview angle
Model: "I release small, behind flags, with tested rollbacks and active monitoring." Follow-up: "How do you decide to roll back?" Pre-agree thresholds (error rate, latency, failed key flow).

## Phase 3 · Strategic and interview-day (Advanced)
### Quality and delivery metrics (DORA)
#### In one line
DORA metrics measure how fast and how safely a team ships: deployment frequency, lead time for changes, change failure rate and time to restore service.

#### Real-life analogy
A car dashboard: speed and warning lights together tell you if you're going fast *and* safely.

#### How it works
- **Deployment frequency**: how often you release to production.
- **Lead time for changes**: commit to production.
- **Change failure rate**: share of releases causing incidents or rollbacks.
- **Time to restore**: how long to recover from an incident.
- Baseline from CI/CD and incident data, find the bottleneck, improve one thing, re-measure.
- Use at team level, never to rank people.

#### Example
¦¦¦text
Baseline (example): deploy 2x/month, lead time 9 days, failure rate 18%, restore 3h
Bottleneck: manual regression + slow reviews
Actions: automate smoke tests, review SLA 1 day, smaller PRs
After 2 months: deploy weekly, lead time 4 days, failure rate 10%
¦¦¦

#### Remember it
**Speed (frequency, lead time) + Stability (failures, restore).**

#### Common mistakes
- Using metrics as individual performance scores.
- Optimising speed and ignoring failures.

#### Interview angle
Model: "I baseline the four metrics, fix the biggest bottleneck, and share results with the team, not as a ranking." Follow-up: "How do you stop gaming?" Pair numbers with quality signals and developer feedback.

### Engineering productivity and AI adoption in a team
#### In one line
Introducing AI tools means getting real time savings while controlling quality, security and over-reliance.

#### Real-life analogy
Giving a team power tools: faster work, but you need safety rules, training and inspection.

#### How it works
1. Agree policy with security/legal: approved tools, no secrets or patient data in prompts.
2. Pilot with volunteers on bounded tasks (tests, boilerplate, refactors, docs).
3. Share prompts and examples; write PR rules (author is accountable).
4. Measure: sample tasks before/after, cycle time, review rounds, defects, survey.
5. Review risks: hallucinated APIs, subtle bugs, junior over-reliance.
- Your resume claim: an estimated **4–6 hours per developer per sprint** saved; present it as an estimate with its method.

#### Example
¦¦¦text
Method: 6 comparable tasks (tests, docs, refactors) timed with/without AI; survey of 8 devs; defects tracked per sprint.
Result (example): ~5 hours saved per dev per sprint; defect rate unchanged; review time +10% (bigger diffs).
Control: small PRs, checklist, juniors explain AI code in PRs.
¦¦¦

#### Remember it
**Policy, pilot, measure, guard.**

#### Common mistakes
- Claiming savings without a method.
- No policy for sensitive data.
- Letting AI replace understanding.

#### Interview angle
Model: "We piloted on bounded tasks, measured before and after, and kept review and tests unchanged; I estimate 4–6 hours per dev per sprint." Follow-up: "What went wrong?" Mention a hallucinated API caught in review and the checklist you added.

### Roadmaps, OKRs and aligning engineering with the business
#### In one line
OKRs link goals to measurable results so engineering work visibly supports business outcomes.

#### Real-life analogy
A map with a destination and milestones: you know where you're going and whether you've arrived.

#### How it works
- **Objective**: the qualitative goal. **Key results**: 2–4 measurable outcomes.
- Map each epic to a key result; drop work that moves nothing.
- Review progress regularly; adjust.
- Explain technical investments (performance, reliability) in business terms.

#### Example
¦¦¦text
Objective: Learners finish courses faster
KR1: Course page load time -30% (example)
KR2: Quiz error rate < 0.5%
KR3: Completion rate +5 points
Epics: code-splitting, API caching, quiz validation fixes
¦¦¦

#### Remember it
**Outcome over output.**

#### Common mistakes
- KRs that are tasks ("ship feature X").
- Too many objectives.

#### Interview angle
Model: "I translate engineering work to a measurable outcome the business cares about." Follow-up: "How do you justify refactoring?" Tie it to a KR such as delivery speed or incident rate.

### Leading change and getting buy-in
#### In one line
Leading change means helping people adopt a new way of working by involving them, proving value and supporting the transition.

#### Real-life analogy
Moving a family to a new house: you explain why, let them choose their rooms, move gradually and keep the old place until the new one works.

#### How it works
1. Explain the **why** with evidence.
2. Listen to resistance (it often hides real concerns).
3. Pilot in one small area.
4. Show results, then standardise and document.
5. Train, support, and celebrate early adopters.

#### Example
¦¦¦text
Change: adopt TypeScript strict mode
Pilot: one module; measure bugs caught; share a demo; then migrate folder by folder with a lint rule
¦¦¦

#### Remember it
**Why, pilot, prove, standardise.**

#### Common mistakes
- Mandating without explaining.
- Big-bang migrations.

#### Interview angle
Model: "I pilot, share evidence and involve sceptics in shaping the change." Follow-up: "What if a senior still refuses?" Understand their concern; if valid, adapt; otherwise agree and commit with a review date.

### Ethics, privacy and security responsibility
#### In one line
As a lead you're responsible for protecting user data and being honest about risks, even when it is inconvenient.

#### Real-life analogy
A building inspector who signs the certificate: lives depend on honesty.

#### How it works
- Least privilege access; secrets in a vault, never in code or prompts.
- Review changes touching auth and personal data.
- Dependency scanning and patching in CI.
- Report mistakes and risks promptly; make reporting safe.
- Follow laws and policy (privacy, healthcare data rules).

#### Example
¦¦¦text
Found: API returned learner emails to all course admins.
Action: fixed same day, checked logs for misuse, informed security team, added an authorisation test.
¦¦¦

#### Remember it
**Protect data, tell the truth, fix fast.**

#### Common mistakes
- Hiding an incident.
- Sharing production data in tickets or AI tools.

#### Interview angle
Model: "I treat security as part of done: reviews, scans, least privilege, and prompt reporting." Follow-up: "A deadline conflicts with a security fix?" Escalate with risk and options; don't ship a known serious vulnerability.

### Handling failure and learning from mistakes
#### In one line
Handling failure means owning it, limiting the damage, fixing the cause and adding a safeguard so it can't repeat.

#### Real-life analogy
A pilot's checklist is written from past accidents: every mistake becomes a safer routine.

#### How it works
1. Own it early; tell people.
2. Reduce impact first.
3. Find the root cause (not the excuse).
4. Add a safeguard: test, alert, checklist, review step.
5. Share the lesson with the team.

#### Example
¦¦¦text
Mistake: underestimated a data migration.
Action: told product same day, cut scope, new date, rehearsal on prod-size copy.
Safeguard: migration estimates now include rehearsal + rollback plan.
¦¦¦

#### Remember it
**Own, fix, safeguard, share.**

#### Common mistakes
- Blaming others or the situation.
- Choosing a fake "weakness" failure.

#### Interview angle
Pick a real, modest failure with a lasting change. Follow-up: "What would you do differently?" Give a specific change.

### Career growth: yours and your team's
#### In one line
Career growth is a deliberate plan for building skills and responsibility, for yourself and the people you lead.

#### Real-life analogy
A gardener who plans seasons: plants need different care at different stages.

#### How it works
- Yourself: define next-level skills (system design, influence), find a mentor, take stretch work, learn continuously.
- Team: personal growth plans in 1:1s, stretch assignments, rotating ownership, internal talks, honest feedback.
- Ask each person where they want to be in a year.

#### Example
¦¦¦text
Growth plan (mid -> senior): own a module design, mentor one junior, lead one release, present at an internal talk.
Review every quarter.
¦¦¦

#### Remember it
**Goal, gap, stretch, review.**

#### Common mistakes
- No time set aside for learning.
- Only promoting people who ask loudly.

#### Interview angle
Model: "I keep a skills plan for myself and each person on my team, reviewed quarterly." Follow-up: "Where do you see yourself in 3 years?" Link to bigger architecture/leadership scope.

### Salary negotiation, notice period and offers
#### In one line
Negotiating means knowing your market value and priorities, discussing the full package politely, and getting the final terms in writing.

#### Real-life analogy
Buying a house: you know your budget and must-haves, compare options and don't sign until every clause is clear.

#### How it works
- Research the market range; decide target, floor and priorities.
- Let them name a range first when possible; anchor to scope and value.
- Consider the total package: fixed, variable, joining bonus, notice buy-out, learning budget, flexibility.
- State your notice period honestly; discuss buy-out options.
- Ask for time to decide; get the offer in writing.

#### Example
¦¦¦text
"Thanks for the offer. Based on the scope of the role and my experience leading teams of 8-10, I was expecting
 a figure closer to X. Is there flexibility on base or on a joining bonus?"
¦¦¦

#### Remember it
**Research, range, package, writing.**

#### Common mistakes
- Naming a number too early.
- Lying about current pay or other offers.
- Accepting verbally without details.

#### Interview angle
Model: "I focus on the role's scope and the whole package and stay flexible and polite." Follow-up: "What's your expected salary?" Give a researched range and say it's open to discuss for the right role.

### Questions to ask the interviewer
#### In one line
Good questions show you think about outcomes, quality and people, and help you judge the company too.

#### Real-life analogy
Test-driving a car: you check brakes and mileage, not only the paint.

#### How it works
- Ask about success at 6 and 12 months.
- How decisions are made and documented.
- Release, testing and on-call practices.
- Biggest technical challenge or debt.
- Growth support for leads.
- AI tooling policy.
- Listen for hesitation, blame or vague answers.

#### Example
¦¦¦text
1. What does success look like in the first 6 months?
2. How do you decide and document technical decisions?
3. How do releases and on-call work?
4. What's the biggest challenge the team faces right now?
¦¦¦

#### Remember it
**Success, decisions, delivery, difficulty, growth.**

#### Common mistakes
- "No questions."
- Asking only about salary and perks first.

#### Interview angle
Prepare 5 and ask 2–3 relevant ones. Follow-up: you may be asked "Why do you want to join us?" Tie it to their product and your strengths.

### Your first 30-60-90 days in a new lead role
#### In one line
A 30-60-90 plan is a simple structure for learning first, contributing next and then leading with a visible win.

#### Real-life analogy
Joining a band: first listen to the songs, then play along, then write a new one.

#### How it works
- **30 days (learn)**: meet people, read architecture and incidents, ship a small fix, understand release and quality metrics.
- **60 days (contribute)**: improve one pain point, start 1:1s, lead a design discussion with an ADR.
- **90 days (lead)**: own a roadmap slice, show a measurable improvement, agree goals for the next quarter.

#### Example
¦¦¦text
Day 30: list of what works, risks, quick wins
Day 60: review turnaround 2 days -> 1 day
Day 90: led release of module X with zero Sev-1; goals set with manager
¦¦¦

#### Remember it
**Listen, improve, own.**

#### Common mistakes
- Changing everything in the first month.
- Not agreeing success criteria with your manager.

#### Interview angle
Model: "In 30 days I learn, in 60 I improve one pain point, in 90 I own a slice with a measurable win." Follow-up: "What if the team resists your ideas?" Build trust with a small win and involve them.
`;
