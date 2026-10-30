window.PREP = window.PREP || {};
window.PREP.system = String.raw`
@title System Design
@icon hex
@tagline Design scalable, reliable systems and explain trade-offs like a lead: estimation, data, caching, queues, APIs, security and full case studies built around a healthcare learning platform.
@resume Clinical Learning Hub architecture (React + Node + MySQL on AWS) | Performance work: 30–40% faster pages and APIs | Leading 8–10 engineers through design reviews | AWS CodePipeline, Jenkins and Octopus delivery

## ROADMAP

### Phase 1 · Foundations (Basic)
- How to run a system design interview: requirements → estimation → API → data model → high-level design → deep dive → trade-offs :: Memorise this frame and say it aloud at the start.
- Back-of-envelope estimation: QPS, storage, bandwidth, latency numbers :: Estimate the Clinical Learning Hub traffic in 2 minutes.
- Client-server, HTTP, DNS, TLS and what happens when you open a URL :: Explain each hop from browser to database.
- API styles: REST vs GraphQL vs gRPC vs WebSockets vs SSE :: Pick one per use case and defend it.
- Load balancing: L4 vs L7, round robin, least connections, health checks :: Know what the balancer does when a server dies.
- Scaling: vertical vs horizontal, stateless services, sessions :: Explain why stateless services scale easily.
- SQL vs NoSQL: when each fits, ACID vs BASE :: Choose a store for enrolments vs activity logs.
- Indexing and query basics for system design :: Know why an index speeds reads and slows writes.
- Replication: leader-follower, read replicas, replication lag :: Explain read-your-own-writes problems.
- Caching basics: browser, CDN, application cache, Redis :: Know what to cache and what never to cache.
- Availability maths: nines, SLA, single points of failure :: Compute availability of components in series and parallel.
- Latency vs throughput, p50/p95/p99 :: Explain why averages hide problems.

### Phase 2 · Building blocks (Intermediate)
- Sharding and partitioning: range, hash, directory; hot keys; re-sharding :: Pick a shard key for learner activity data.
- CAP, PACELC and consistency models: strong, eventual, causal, read-your-writes :: Explain with a bank and a social feed.
- Caching strategies: cache-aside, write-through, write-back, TTL, invalidation, stampede :: Write cache-aside with locking.
- Message queues and event-driven design: SQS, RabbitMQ, Kafka, at-least-once, idempotency, DLQ :: Make consumers idempotent.
- Outbox pattern and transactional messaging :: Avoid the dual-write problem.
- Rate limiting: fixed window, sliding window, token bucket, leaky bucket :: Implement token bucket from memory.
- API design at scale: pagination, versioning, idempotency keys, bulk APIs, error format :: Design cursor pagination.
- Authentication and authorisation: sessions, JWT, OAuth2/OIDC, RBAC, ABAC, SSO :: Explain token revocation trade-offs.
- Monolith vs modular monolith vs microservices; API gateway; service discovery :: Argue for the right size of service.
- Resilience: timeouts, retries with backoff and jitter, circuit breaker, bulkhead, graceful degradation :: Prevent cascading failures.
- Observability: logs, metrics, traces, SLI/SLO/SLA, alerting :: Define SLOs for the learning platform.
- Reliability and DR: multi-AZ, multi-region, backups, RPO and RTO, failover, chaos testing :: Choose a DR strategy for a given RPO/RTO.
- Security fundamentals: TLS, encryption at rest, secrets, least privilege, PII and healthcare compliance :: Add security to every design.

### Phase 3 · Advanced and case studies (Lead level)
- Consistent hashing and virtual nodes :: Explain how adding a cache node moves only a few keys.
- Unique ID generation: UUID, auto-increment, Snowflake, ULID :: Pick one for sharded tables.
- Search: inverted index, Elasticsearch/OpenSearch, relevance, autocomplete with a trie :: Design course search.
- File upload and object storage: S3, presigned URLs, multipart upload, virus scanning, CDN delivery :: Avoid streaming large files through your API.
- Notification service: email, SMS, push, templates, preferences, retries, dedupe :: Design for at-least-once delivery.
- Real-time systems: WebSockets, presence, fan-out, chat design :: Know when SSE or polling is enough.
- Frontend system design: CSR vs SSR vs ISR, micro-frontends, performance budgets, state and caching :: Design a component library and a dashboard.
- Case study: URL shortener :: Walk it end to end, including ID generation and caching.
- Case study: rate limiter as a service :: Distributed counters with Redis.
- Case study: news feed / activity feed (fan-out on write vs read) :: Handle celebrity users.
- Case study: chat application :: Message ordering, delivery, offline users.
- Case study: Clinical learning platform (video, progress, quizzes, certificates) :: Your own project; the most important one to rehearse.
- Case study: file storage and sync, search autocomplete :: Chunking, dedupe, tries and caching.
- Trade-off writing: ADRs, capacity plans, cost, build vs buy, migration plans (strangler fig) :: Show lead-level communication.

## QA

### [basic] What frame do you use in a system design interview?
Use the same seven steps every time so you never freeze.
1. **Clarify requirements**: functional (what the system does) and non-functional (scale, latency, availability, consistency, compliance). Ask who the users are and what is out of scope.
2. **Estimate**: users, requests per second, storage, bandwidth.
3. **API**: list the main endpoints or events.
4. **Data model**: entities, relationships, access patterns, database choice.
5. **High-level design**: boxes and arrows (clients, CDN, load balancer, services, cache, DB, queue).
6. **Deep dive**: the riskiest or most interesting component (hot keys, consistency, fan-out).
7. **Trade-offs and next steps**: bottlenecks, failure modes, monitoring, cost, what you would build later.
Talk while you draw, state assumptions, and let the interviewer steer.

### [basic] How do you do back-of-envelope estimation?
Turn users into requests and bytes. Example: 1 million daily active learners, each making 20 requests a day gives 20 million requests per day. Divide by about 100 000 seconds (86 400 rounded) to get roughly **200 average QPS**; peak is usually 3–10 times the average, so plan for 1 000–2 000 QPS. Storage: 1 million learners x 2 KB profile = 2 GB; progress events at 1 KB each x 20 per day x 365 = about 7 TB a year. Bandwidth = QPS x average response size. Round aggressively; the goal is the order of magnitude (does this fit on one database or need sharding?).

### [basic] Which latency numbers should you know?
Roughly: memory read 100 ns, SSD read 100 µs, network round trip in the same data centre 0.5 ms, read 1 MB from SSD 1 ms, cross-region round trip 70–150 ms. Lessons: memory is far faster than disk, disk is far faster than the network, so cache hot data, batch network calls and keep related data close. A call to the database is about 1 ms; a call across continents is about 100 ms, which is why CDNs and regional deployments matter.

### [basic] What happens when you type a URL and press Enter?
1. The browser checks its caches, then resolves the domain through **DNS** to an IP address.
2. It opens a TCP connection and negotiates **TLS** (HTTP/3 uses QUIC).
3. It sends an HTTP request, possibly answered by a **CDN** edge cache.
4. Otherwise the request reaches a **load balancer**, then an app server, which may use a cache and a database.
5. The response travels back; the browser parses HTML, fetches CSS/JS/images (often from the CDN), builds the DOM and renders.
Each step is a place to add caching, compression, or fail over, which is what interviewers want you to notice.

### [basic] REST vs GraphQL vs gRPC vs WebSockets vs SSE: when do you pick each?
| Choice | Best for | Trade-off |
|---|---|---|
| REST | Public and CRUD APIs, easy caching | Over/under-fetching, many round trips |
| GraphQL | Many client types needing flexible queries | Caching and N+1 complexity, query cost control |
| gRPC | Internal service-to-service, low latency, strong contracts | Not browser-native without a proxy |
| WebSockets | Two-way real-time (chat, collaboration) | Stateful connections, scaling and reconnect logic |
| SSE | One-way server push (notifications, progress) | One direction only, simple over HTTP |
For the Clinical Learning Hub: REST for the public API, SSE or WebSocket for live notifications, and possibly gRPC between internal services.

### [basic] What is load balancing and what are the common algorithms?
A load balancer spreads requests across servers and removes unhealthy ones using **health checks**. **L4** balancers work on TCP/UDP (fast, simple); **L7** balancers understand HTTP (route by path or header, terminate TLS, sticky sessions). Algorithms: round robin, weighted round robin, **least connections**, IP hash (same client to same server), and consistent hashing for caches. Make the balancer itself highly available (managed ALB/NLB in AWS spans multiple zones).

### [basic] Vertical vs horizontal scaling? Why are stateless services easier to scale?
Vertical scaling means a bigger machine: simple, but there is a ceiling, a single point of failure and downtime to resize. Horizontal scaling means more machines behind a balancer: near-unlimited and fault tolerant but needs distributed-system thinking. Stateless servers keep no user data in memory between requests (session data lives in Redis, the database or a signed token), so any server can handle any request and you can add or remove servers freely (autoscaling).

### [basic] SQL vs NoSQL: how do you choose?
Choose **SQL** (MySQL/PostgreSQL) when data is relational, you need transactions, joins and strong consistency: users, courses, enrolments, payments. Choose **NoSQL** when you need massive write throughput, flexible schema, or simple key access patterns: activity logs, sessions, caches, time series. Many systems use both (polyglot persistence). A good default: start with a relational database, and move specific workloads out when measurements show you must.

### [basic] What do indexes do, and why not index everything?
An index (usually a B-tree) lets the database find rows without scanning the whole table: reads become O(log n). The costs are extra storage and slower writes, because every insert or update must also update each index. Index columns used in ¦WHERE¦, ¦JOIN¦ and ¦ORDER BY¦; use composite indexes in the order of your queries; avoid indexing low-cardinality columns alone; verify with ¦EXPLAIN¦.

### [basic] Explain database replication and replication lag.
In leader-follower replication, all writes go to the leader and are copied to followers. Followers serve reads (read replicas) and take over if the leader fails. Replication is usually asynchronous, so a follower may be slightly behind (**lag**): a user who just saved something may not see it on the next read. Fixes: read from the leader for the user's own recent writes (read-your-writes), pin a session to the leader for a few seconds, or use synchronous replication for critical data at a latency cost.

### [basic] What are availability "nines" and how do you compute system availability?
99.9% allows about 8.8 hours of downtime a year; 99.99% about 53 minutes; 99.999% about 5 minutes. Components **in series** multiply (two 99.9% services in a chain give about 99.8%); components **in parallel** (redundant) improve it: 1 − (1 − a)². This is why you remove single points of failure with redundancy and why every extra synchronous dependency lowers availability.

### [intermediate] What is sharding? How do you choose a shard key?
Sharding splits one big dataset across several databases so each holds a subset. Strategies: **range** (simple range queries, risk of hot shards), **hash** (even spread, harder range queries), **directory/lookup** (flexible, extra hop). A good shard key has high cardinality, even distribution and appears in most queries (for example ¦learner_id¦ for activity data), so queries stay on one shard. Costs: cross-shard joins and transactions are hard, and re-sharding needs planning (consistent hashing or many small logical shards help). Delay sharding: first use indexes, caching, read replicas and archiving.

### [intermediate] Explain the CAP theorem and PACELC.
When a network **partition** happens, a distributed store must choose between **consistency** (every read sees the latest write) and **availability** (every request gets an answer). Partitions are a fact of life, so the real choice is CP vs AP behaviour during failures. **PACELC** adds: Else (no partition), you still trade **latency** against **consistency**. Examples: a payment ledger prefers consistency; a like counter or activity feed accepts eventual consistency for speed and uptime.

### [intermediate] What consistency models should you know?
**Strong** (linearizable): reads always see the latest write. **Eventual**: replicas converge if writes stop. **Read-your-writes**: you always see your own updates. **Monotonic reads**: you never see data go backward. **Causal**: related events appear in order. Pick the weakest model that keeps the user experience correct, because stronger models cost latency and availability.

### [intermediate] Compare cache-aside, write-through and write-back.
- **Cache-aside (lazy loading)**: app reads cache first; on miss reads the DB and fills the cache. Writes update the DB and invalidate the cache. Most common and simple; first read after expiry is slow.
- **Write-through**: writes go to cache and DB together. Cache is always fresh; writes are slower and you cache data that may never be read.
- **Write-back (write-behind)**: write to cache, flush to DB later. Fast writes; data can be lost if the cache dies.
Add a **TTL** as a safety net, and decide how to invalidate (delete on write, or publish an event).

### [intermediate] What is a cache stampede and how do you prevent it?
When a popular key expires, thousands of requests miss at once and all hit the database. Prevention: a **lock or single-flight** so one request refills while others wait or serve stale data; **TTL jitter** so keys do not all expire together; **stale-while-revalidate** (serve old data while refreshing); and **early refresh** for the hottest keys. Also guard against cache penetration (requests for keys that do not exist) with negative caching or a Bloom filter.

### [intermediate] Why use a message queue? Compare SQS, RabbitMQ and Kafka.
Queues **decouple** producers from consumers, absorb spikes, enable retries and let slow work (emails, PDFs, certificates) run in the background. **SQS**: managed, simple work queue, at-least-once, dead-letter queues. **RabbitMQ**: flexible routing (exchanges), rich features, good for task queues. **Kafka**: distributed commit log with partitions, replay, high throughput and many independent consumer groups; best for event streams and analytics. Always assume **at-least-once delivery**, so consumers must be **idempotent** (use an event ID and a processed-events table).

### [intermediate] What is the outbox pattern and why is it needed?
Writing to the database and publishing to a queue are two separate operations: if one fails you get inconsistency (order saved, event lost). With the **transactional outbox**, you insert the event into an ¦outbox¦ table **in the same database transaction** as the business change. A separate relay process reads the outbox and publishes events (marking them sent). Delivery is at-least-once, so consumers deduplicate. It avoids distributed transactions.

### [intermediate] Explain token bucket and sliding window rate limiting.
**Token bucket**: a bucket holds up to ¦capacity¦ tokens and refills at a steady rate; each request takes a token, so bursts up to capacity are allowed but the average rate is capped. **Sliding window**: count requests in the last N seconds (log of timestamps, or weighted counters of the current and previous fixed windows), giving a smoother limit than a fixed window, which allows double bursts at window edges. In a distributed system, keep counters in Redis with atomic scripts (Lua) keyed by user or API key, and return ¦429¦ with ¦Retry-After¦.

### [intermediate] How do you design pagination for a large list API?
**Offset pagination** (¦?page=3&limit=20¦) is simple but slow on deep pages and unstable when data changes. **Cursor (keyset) pagination** uses the last seen sort key (¦?after=...&limit=20¦, query ¦WHERE (created_at, id) < (?, ?) ORDER BY created_at DESC, id DESC LIMIT 20¦): fast at any depth and stable. Return a ¦nextCursor¦ (opaque, base64) and keep sorting deterministic with a unique tiebreaker. Use cursors for feeds and large tables; offsets are fine for small admin lists.

### [intermediate] What is an idempotency key and how do you implement it?
A client sends a unique ¦Idempotency-Key¦ header with a mutating request (payment, enrolment). The server stores the key with the request fingerprint and the final response. If the same key arrives again (retry after a timeout), the server returns the stored response instead of repeating the action. Implement with a unique constraint and a status (¦in_progress¦, ¦done¦), reject the same key with a different body, and expire keys after about 24 hours.

### [intermediate] Sessions vs JWT vs OAuth2/OIDC: how do you choose?
**Server sessions**: a random ID in an HttpOnly cookie, state in Redis; easy to revoke. **JWT**: a signed token the server can verify without a lookup; scales well, but is hard to revoke before expiry, so keep access tokens short (5–15 minutes) with rotating refresh tokens. **OAuth2** delegates access (what an app may do); **OpenID Connect** adds identity (who the user is) for SSO with providers like Okta, Entra ID or Google. Authorisation models: **RBAC** (roles) is the baseline; **ABAC** (attributes and policies) for finer rules. Always check authorisation on the server at the object level.

### [intermediate] Monolith, modular monolith or microservices?
A **monolith** is simple to build, test and deploy; it suffers when many teams collide or one part must scale alone. A **modular monolith** keeps one deployable with strict module boundaries, getting most of the benefit with low cost. **Microservices** give independent deployment and scaling but add network failures, distributed data, tracing, versioning and operational load. Choose them for team autonomy and different scaling needs, not for fashion. Migrate gradually with the **strangler fig** pattern.

### [intermediate] Which resilience patterns prevent cascading failure?
- **Timeouts** on every network call (no waiting forever).
- **Retries with exponential backoff and jitter**, only for idempotent operations, with a retry budget.
- **Circuit breaker**: after repeated failures, stop calling the dependency for a while (open), probe (half-open), then close.
- **Bulkheads**: separate pools so one slow dependency cannot use all threads or connections.
- **Fallbacks and graceful degradation**: show cached or partial data.
- **Load shedding** and **backpressure** under overload.

### [intermediate] What is observability and how do you define SLOs?
Observability means you can understand the system from its outputs: **logs** (events), **metrics** (numbers over time) and **traces** (a request across services, for example with OpenTelemetry). Define **SLIs** (measurements such as the share of requests under 300 ms and the success rate), set **SLOs** (targets such as 99.9% over 30 days), and track the **error budget**. An SLA is the external contract with penalties. Alert on symptoms that hurt users (burn rate, error rate, p99 latency), not on every CPU spike, and use request IDs to correlate logs.

### [advanced] Explain consistent hashing and why virtual nodes matter.
Map both servers and keys onto a circular hash space; a key belongs to the first server clockwise from its position. When a server is added or removed, only about 1/N of the keys move, unlike ¦hash(key) % N¦ which remaps nearly everything. Plain placement can be uneven, so each server is placed many times (**virtual nodes**) to balance load and let stronger machines take more. It is used by distributed caches, Dynamo-style stores and some load balancers.

### [advanced] How do you generate unique IDs in a distributed system?
Options: **database auto-increment** (simple, single point of contention, leaks counts), **UUID v4** (no coordination, but random and index-unfriendly), **UUID v7 / ULID** (time-ordered, better index locality), and **Snowflake-style** 64-bit IDs (41 bits timestamp, 10 bits machine ID, 12 bits sequence): sortable, compact and generated without a central database. Watch clock skew and never reuse a machine ID. Do not expose sequential IDs in public URLs when guessing matters.

### [advanced] How would you design course search with autocomplete?
Use a search engine (Elasticsearch or OpenSearch) built on an **inverted index** (term to list of documents) with analysers for stemming and typos. Keep the database as the source of truth and index changes asynchronously through events or change data capture. For autocomplete, use an edge-n-gram or completion suggester (or a **trie** in memory) over popular queries, cache results for common prefixes in Redis/CDN, debounce on the client (150–300 ms) and rank by popularity and recency. Handle reindexing with versioned indexes and aliases.

### [advanced] How should large files (videos, certificates, uploads) be handled?
Never stream big files through your API servers. The client asks the API for a **presigned URL** and uploads directly to object storage (S3), using **multipart upload** for large files and resumable retries. S3 events trigger background jobs (virus scan, transcoding, thumbnail). Deliver through a **CDN** (CloudFront) with signed URLs or cookies for private content. Store only metadata (key, size, owner, status) in the database and enforce size and type limits.

### [advanced] Design a notification service.
Producers publish events (¦certificate.issued¦) to a queue. A notification service looks up the user's **preferences**, picks the channel (email, SMS, push, in-app), renders a **template**, and sends through a provider adapter. Needs: per-channel queues so a slow SMS vendor does not block email, retries with backoff, a DLQ, **idempotency / dedupe** (event ID), rate limits per user and provider, scheduling and quiet hours, delivery status tracking (webhooks), unsubscribe handling and audit logs. Delivery is at-least-once, so keep message sending idempotent where possible.

### [advanced] How would you design a real-time chat or live notification system?
Use **WebSockets** (or SSE for server-to-client only) through a gateway tier that holds connections. A connection registry (Redis) maps user to gateway node; messages go through a pub/sub or Kafka topic so any node can deliver. Persist messages first (partition by conversation, store a monotonically increasing sequence per conversation for ordering), then fan out; deliver offline users' messages from storage on reconnect with acks and ¦lastSeenId¦ sync. Handle heartbeats, reconnect with backoff, presence with TTL keys, and scale gateways horizontally.

### [advanced] Feed design: fan-out on write or on read?
**Fan-out on write**: when someone posts, push the item into each follower's precomputed feed (fast reads, expensive writes, bad for users with millions of followers). **Fan-out on read**: compute the feed at read time by merging recent posts from followed accounts (cheap writes, slower reads). Real systems use a **hybrid**: push for normal users, pull for celebrities, merged at read time. Store feeds in Redis lists or sorted sets, paginate with cursors, and rank separately.

### [advanced] How do you design the frontend of a large application (frontend system design)?
Cover: **rendering strategy** (CSR for dashboards, SSR/SSG/ISR for content and SEO), **performance budgets** (bundle size, LCP, INP, CLS), code splitting and lazy loading, **state** (server state with React Query/SWR, local UI state, minimal global state), **caching** (HTTP cache, CDN, service worker), accessibility, error boundaries and monitoring (RUM), a **design system / component library** with tokens, versioning and tests, and optionally **micro-frontends** when separate teams need independent deployments (with the cost of shared dependencies and consistency).

### [advanced] How do you plan disaster recovery? What are RPO and RTO?
**RPO** (recovery point objective) is how much data you can afford to lose (time since the last good backup/replica). **RTO** (recovery time objective) is how long you can be down. Strategies from cheap to costly: **backup and restore**, **pilot light** (minimal copy running), **warm standby**, and **active-active multi-region**. Use multi-AZ for most failures, automated backups with tested restores, infrastructure as code to rebuild quickly, runbooks, and regular game days. Choose by business impact; not every service needs multi-region.

### [advanced] What security should be part of every system design?
TLS everywhere, encryption at rest with managed keys, secrets in a vault (not in code), least-privilege IAM roles, network segmentation (private subnets, security groups), input validation and parameterised queries, authentication with short-lived tokens, object-level authorisation, rate limiting and WAF, audit logs, dependency and container scanning, and data minimisation. For healthcare data, add PII/PHI classification, masking in logs, access auditing and retention rules aligned with HIPAA or GDPR as relevant.

### [advanced] How do you handle trade-offs and communicate decisions as a lead?
State the options, criteria (cost, time, risk, scale, team skills) and the decision, and record it in an **ADR** (architecture decision record): context, decision, alternatives, consequences. Prefer reversible decisions, prototype risky parts, prove with load tests, plan migrations incrementally (strangler fig, dual writes only with reconciliation), and review designs with the team before building. In interviews say "I would choose X because of Y; the trade-off is Z, and I would revisit it if W changes".

## EXERCISES

### [basic] Capacity estimation for the Clinical Learning Hub
The platform has 500 000 registered learners, 20% active daily. Each active learner makes 30 API calls a day, averaging 8 KB per response. Each learner generates 15 progress events a day (500 bytes each). Estimate average and peak QPS, daily bandwidth, and yearly event storage. State what design choices the numbers suggest.
> Hint: Use 100 000 seconds per day and a peak factor of 5.
--- solution ---
¦¦¦js
const registered = 500_000;
const dau = registered * 0.2;                    // 100 000 daily active learners
const callsPerDay = dau * 30;                    // 3 000 000 requests/day
const avgQps = callsPerDay / 100_000;            // ~30 QPS average
const peakQps = avgQps * 5;                      // ~150 QPS peak (exam deadline spikes may be 10x)

const bandwidthPerDayGB = (callsPerDay * 8) / 1_000_000;   // 3M x 8KB = 24 GB/day
const peakMbps = (peakQps * 8 * 8) / 1000;                  // 150 x 8KB x 8 bits = ~9.6 Mbps

const eventsPerDay = dau * 15;                   // 1 500 000 events
const eventBytesPerYear = eventsPerDay * 500 * 365;
const eventTBPerYear = eventBytesPerYear / 1e12; // ~0.27 TB/year

console.log({ avgQps, peakQps, bandwidthPerDayGB, peakMbps, eventTBPerYear });
¦¦¦
**Conclusions to say aloud**
- 150 peak QPS is small: one or two app servers and one MySQL primary can handle it. Run at least 2 servers in 2 availability zones for availability, not for capacity.
- 0.27 TB a year of events is easy for MySQL with partitioning by month; archive old partitions to S3.
- The real risks are spikes (assignment deadlines), so autoscale and cache read-heavy content (course catalogue, static assets on a CDN).

### [basic] Base62 URL shortener with collision-free IDs
Implement ¦encode(id)¦ and ¦decode(code)¦ using base62 (0-9, a-z, A-Z), and a tiny in-memory ¦shorten(url)¦ / ¦resolve(code)¦ that uses an incrementing ID. Explain how the design changes with many servers.
--- solution ---
¦¦¦js
const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function encode(n) {
  if (n === 0) return ALPHABET[0];
  let s = '';
  while (n > 0) { s = ALPHABET[n % 62] + s; n = Math.floor(n / 62); }
  return s;
}
function decode(str) {
  let n = 0;
  for (const ch of str) n = n * 62 + ALPHABET.indexOf(ch);
  return n;
}

let counter = 100_000_000;       // starting offset makes codes look less guessable
const byCode = new Map();
const byUrl = new Map();

function shorten(url) {
  if (byUrl.has(url)) return byUrl.get(url);     // same URL, same code
  const code = encode(counter++);
  byCode.set(code, url);
  byUrl.set(url, code);
  return code;
}
const resolve = code => byCode.get(code) ?? null;

const c = shorten('https://example.com/course/42');
console.log(c, resolve(c), decode(c));            // 7 chars cover 62^7 = 3.5 trillion URLs
¦¦¦
**Scaling it**
- Replace the counter with a **range-allocation service** (each app server leases a block of 10 000 IDs from a database or ZooKeeper) or a Snowflake ID; no collisions because ranges never overlap.
- Store ¦code → url¦ in a key-value or MySQL table (primary key = code), cache hot codes in Redis, serve redirects with ¦301¦ (cacheable) or ¦302¦ (if you need click analytics).
- For custom aliases, insert with a unique constraint and return ¦409¦ on conflict. Validate URLs and block abuse.
--- starter ---
¦¦¦js
const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function encode(n) {
  // your code here: number -> base62 string (encode(0) must be '0')
}

function decode(str) {
  // your code here: base62 string -> number
}

let counter = 100_000_000;       // starting offset makes codes look less guessable
const byCode = new Map();
const byUrl = new Map();

function shorten(url) {
  // your code here: the same URL always gets the same code, new URLs use encode(counter++)
}

function resolve(code) {
  // your code here: return the original URL, or null if the code is unknown
}
¦¦¦
--- tests ---
¦¦¦js
test('encode handles small numbers', () => {
  eq(encode(0), '0');
  eq(encode(9), '9');
  eq(encode(10), 'a');
  eq(encode(35), 'z');
  eq(encode(36), 'A');
  eq(encode(61), 'Z');
  eq(encode(62), '10');
  eq(encode(125), '21');
});

test('decode is the inverse of encode', () => {
  [0, 1, 61, 62, 3844, 100000000, 987654321].forEach(n => eq(decode(encode(n)), n));
});

test('shorten returns a base62 code', () => {
  ok(/^[0-9a-zA-Z]+$/.test(shorten('https://example.com/a')), 'code should only use 0-9a-zA-Z');
});

test('the same URL always gets the same code', () => {
  eq(shorten('https://example.com/same'), shorten('https://example.com/same'));
});

test('different URLs get different codes', () => {
  ok(shorten('https://example.com/one') !== shorten('https://example.com/two'), 'codes must differ');
});

test('resolve returns the original URL', () => {
  const code = shorten('https://example.com/resolve-me');
  eq(resolve(code), 'https://example.com/resolve-me');
});

test('resolve returns null for an unknown code', () => {
  eq(resolve('does-not-exist'), null);
});

test('new URLs use consecutive ids', () => {
  const a = shorten('https://example.com/seq-1');
  const b = shorten('https://example.com/seq-2');
  eq(decode(b) - decode(a), 1);
});
¦¦¦

### [intermediate] Implement a token bucket rate limiter
Write a ¦TokenBucket¦ class with ¦capacity¦ and ¦refillPerSec¦, and a ¦tryRemove()¦ method. Then wrap it as Express middleware keyed by user or IP that returns ¦429¦ with ¦Retry-After¦.
> Hint: Do not use timers; compute refills lazily from elapsed time on each call.
--- solution ---
¦¦¦js
class TokenBucket {
  constructor(capacity, refillPerSec, now = () => Date.now()) {
    this.capacity = capacity;
    this.refillPerSec = refillPerSec;
    this.tokens = capacity;
    this.now = now;
    this.last = now();
  }
  tryRemove(cost = 1) {
    const t = this.now();
    const elapsed = (t - this.last) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillPerSec);
    this.last = t;
    if (this.tokens >= cost) { this.tokens -= cost; return { ok: true }; }
    const retryAfter = Math.ceil((cost - this.tokens) / this.refillPerSec);
    return { ok: false, retryAfter };
  }
}

const buckets = new Map();
function rateLimit({ capacity = 10, refillPerSec = 5 } = {}) {
  return (req, res, next) => {
    const key = req.user?.id ?? req.ip;
    if (!buckets.has(key)) buckets.set(key, new TokenBucket(capacity, refillPerSec));
    const r = buckets.get(key).tryRemove();
    if (r.ok) return next();
    res.set('Retry-After', String(r.retryAfter));
    res.status(429).json({ error: 'Too many requests' });
  };
}

// quick test with a fake clock
let time = 0;
const b = new TokenBucket(2, 1, () => time);
console.log(b.tryRemove().ok, b.tryRemove().ok, b.tryRemove().ok); // true true false
time += 1000;
console.log(b.tryRemove().ok);                                       // true (one token refilled)
¦¦¦
**Distributed version**: keep the bucket in Redis and run the refill-and-take logic in a **Lua script** so it is atomic across servers. Evict idle buckets (TTL) so memory does not grow without bound.
--- starter ---
¦¦¦js
class TokenBucket {
  constructor(capacity, refillPerSec, now = () => Date.now()) {
    this.capacity = capacity;
    this.refillPerSec = refillPerSec;
    this.tokens = capacity;
    this.now = now;
    this.last = now();
  }
  tryRemove(cost = 1) {
    // your code here
    // refill lazily from the elapsed time, then take tokens
    // return { ok: true } or { ok: false, retryAfter: seconds }
  }
}

const buckets = new Map();
function rateLimit({ capacity = 10, refillPerSec = 5 } = {}) {
  return (req, res, next) => {
    // your code here: one bucket per user id (or IP), 429 + Retry-After when empty
  };
}
¦¦¦
--- tests ---
¦¦¦js
function fakeRes() {
  return {
    headers: {}, code: 200, body: null,
    set(k, v) { this.headers[k] = v; return this; },
    status(c) { this.code = c; return this; },
    json(b) { this.body = b; return this; }
  };
}

test('allows a burst up to capacity, then rejects', () => {
  let time = 0;
  const b = new TokenBucket(3, 1, () => time);
  eq([b.tryRemove().ok, b.tryRemove().ok, b.tryRemove().ok, b.tryRemove().ok], [true, true, true, false]);
});

test('refills over time using the clock', () => {
  let time = 0;
  const b = new TokenBucket(2, 1, () => time);
  b.tryRemove(); b.tryRemove();
  eq(b.tryRemove().ok, false);
  time += 1000;
  eq(b.tryRemove().ok, true);
  eq(b.tryRemove().ok, false);
});

test('never refills above capacity', () => {
  let time = 0;
  const b = new TokenBucket(2, 1, () => time);
  b.tryRemove();
  time += 60000;
  eq([b.tryRemove().ok, b.tryRemove().ok, b.tryRemove().ok], [true, true, false]);
});

test('reports retryAfter in whole seconds', () => {
  let time = 0;
  const b = new TokenBucket(1, 0.5, () => time);
  b.tryRemove();
  const r = b.tryRemove();
  eq(r.ok, false);
  eq(r.retryAfter, 2);
});

test('supports a cost greater than one, and a rejected call takes nothing', () => {
  let time = 0;
  const b = new TokenBucket(5, 1, () => time);
  eq(b.tryRemove(3).ok, true);
  eq(b.tryRemove(3).ok, false);
  eq(b.tryRemove(2).ok, true);
});

test('middleware calls next, then answers 429 with Retry-After', () => {
  const mw = rateLimit({ capacity: 1, refillPerSec: 1 });
  const req = { ip: 'test-ip-1' };
  let nextCalls = 0;
  mw(req, fakeRes(), () => nextCalls++);
  const res = fakeRes();
  mw(req, res, () => nextCalls++);
  eq(nextCalls, 1);
  eq(res.code, 429);
  ok(Number(res.headers['Retry-After']) >= 1, 'Retry-After header should be set');
});

test('middleware keeps a separate bucket per user', () => {
  const mw = rateLimit({ capacity: 1, refillPerSec: 1 });
  let nextCalls = 0;
  mw({ user: { id: 'user-a' }, ip: 'shared-ip' }, fakeRes(), () => nextCalls++);
  const resA = fakeRes();
  mw({ user: { id: 'user-a' }, ip: 'shared-ip' }, resA, () => nextCalls++);
  mw({ user: { id: 'user-b' }, ip: 'shared-ip' }, fakeRes(), () => nextCalls++);
  eq(resA.code, 429);
  eq(nextCalls, 2);
});
¦¦¦

### [intermediate] Sliding window log rate limiter
Implement a limiter that allows at most N requests in any rolling window of W milliseconds. Explain the memory cost and a cheaper approximation.
--- solution ---
¦¦¦js
class SlidingWindowLimiter {
  constructor(limit, windowMs, now = () => Date.now()) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.now = now;
    this.hits = new Map();            // key -> array of timestamps
  }
  allow(key) {
    const t = this.now();
    const cutoff = t - this.windowMs;
    const arr = (this.hits.get(key) ?? []).filter(ts => ts > cutoff);
    if (arr.length >= this.limit) { this.hits.set(key, arr); return false; }
    arr.push(t);
    this.hits.set(key, arr);
    return true;
  }
}

let t = 0;
const lim = new SlidingWindowLimiter(3, 1000, () => t);
console.log([1, 2, 3, 4].map(() => lim.allow('u1')));   // [true, true, true, false]
t = 1001;
console.log(lim.allow('u1'));                           // true
¦¦¦
**Cost**: O(limit) timestamps per key, which is accurate but memory-heavy at high limits. The **sliding window counter** approximation stores only two counters (current and previous fixed window) and estimates the rolling count as ¦prev * (1 - elapsedFraction) + curr¦: constant memory, small error, and the usual choice at scale. In Redis use a sorted set (¦ZADD¦, ¦ZREMRANGEBYSCORE¦, ¦ZCARD¦) inside a script.
--- starter ---
¦¦¦js
class SlidingWindowLimiter {
  constructor(limit, windowMs, now = () => Date.now()) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.now = now;
    this.hits = new Map();            // key -> array of timestamps
  }
  allow(key) {
    // your code here: drop timestamps older than the window, then allow or reject
    // return true / false
  }
}
¦¦¦
--- tests ---
¦¦¦js
test('allows up to the limit, then blocks', () => {
  let t = 0;
  const l = new SlidingWindowLimiter(3, 1000, () => t);
  eq([1, 2, 3, 4].map(() => l.allow('u')), [true, true, true, false]);
});

test('the window slides: old hits expire one by one', () => {
  let t = 0;
  const l = new SlidingWindowLimiter(2, 1000, () => t);
  eq(l.allow('u'), true);     // t=0
  t = 500;  eq(l.allow('u'), true);
  t = 600;  eq(l.allow('u'), false);
  t = 1001; eq(l.allow('u'), true);   // the hit at t=0 has expired
  t = 1002; eq(l.allow('u'), false);
  t = 1501; eq(l.allow('u'), true);   // the hit at t=500 has expired
});

test('rejected requests do not extend the window', () => {
  let t = 0;
  const l = new SlidingWindowLimiter(1, 1000, () => t);
  eq(l.allow('u'), true);
  t = 500;  eq(l.allow('u'), false);
  t = 1001; eq(l.allow('u'), true);
});

test('a request exactly one window later is allowed', () => {
  let t = 0;
  const l = new SlidingWindowLimiter(1, 1000, () => t);
  eq(l.allow('u'), true);
  t = 1000; eq(l.allow('u'), true);
});

test('keys are limited independently', () => {
  let t = 0;
  const l = new SlidingWindowLimiter(1, 1000, () => t);
  eq(l.allow('a'), true);
  eq(l.allow('a'), false);
  eq(l.allow('b'), true);
});
¦¦¦

### [intermediate] Build an LRU cache
Implement an LRU cache with ¦get(key)¦ and ¦put(key, value)¦ in O(1) with a fixed capacity. Add an optional TTL.
> Hint: A JavaScript ¦Map¦ remembers insertion order.
--- solution ---
¦¦¦js
class LRUCache {
  constructor(capacity, ttlMs = Infinity, now = () => Date.now()) {
    this.capacity = capacity;
    this.ttlMs = ttlMs;
    this.now = now;
    this.map = new Map();             // key -> { value, expires }
  }
  get(key) {
    const e = this.map.get(key);
    if (!e) return undefined;
    if (e.expires <= this.now()) { this.map.delete(key); return undefined; }
    this.map.delete(key);             // move to most recent
    this.map.set(key, e);
    return e.value;
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, { value, expires: this.now() + this.ttlMs });
    if (this.map.size > this.capacity) {
      const oldest = this.map.keys().next().value;   // first key = least recently used
      this.map.delete(oldest);
    }
  }
}

const c = new LRUCache(2);
c.put('a', 1); c.put('b', 2);
c.get('a');                 // a becomes most recent
c.put('c', 3);              // evicts b
console.log(c.get('b'), c.get('a'), c.get('c'));   // undefined 1 3
¦¦¦
In interviews also describe the classic design: a hash map plus a doubly linked list, giving the same O(1) operations. Redis offers LRU/LFU eviction policies (¦maxmemory-policy allkeys-lru¦).
--- starter ---
¦¦¦js
class LRUCache {
  constructor(capacity, ttlMs = Infinity, now = () => Date.now()) {
    this.capacity = capacity;
    this.ttlMs = ttlMs;
    this.now = now;
    this.map = new Map();             // key -> { value, expires }
  }
  get(key) {
    // your code here: return the value (and mark it most recent) or undefined
  }
  put(key, value) {
    // your code here: insert/update, evict the least recently used entry when over capacity
  }
}
¦¦¦
--- tests ---
¦¦¦js
test('get returns stored values and undefined for a miss', () => {
  const c = new LRUCache(2);
  c.put('a', 1);
  eq(c.get('a'), 1);
  eq(c.get('missing'), undefined);
});

test('evicts the least recently used entry', () => {
  const c = new LRUCache(2);
  c.put('a', 1); c.put('b', 2); c.put('c', 3);
  eq(c.get('a'), undefined);
  eq(c.get('b'), 2);
  eq(c.get('c'), 3);
});

test('get refreshes recency', () => {
  const c = new LRUCache(2);
  c.put('a', 1); c.put('b', 2);
  c.get('a');
  c.put('c', 3);                 // evicts b, not a
  eq(c.get('b'), undefined);
  eq(c.get('a'), 1);
  eq(c.get('c'), 3);
});

test('put on an existing key updates the value and refreshes it', () => {
  const c = new LRUCache(2);
  c.put('a', 1); c.put('b', 2);
  c.put('a', 10);
  c.put('c', 3);                 // evicts b
  eq(c.get('a'), 10);
  eq(c.get('b'), undefined);
});

test('capacity 1 keeps only the latest entry', () => {
  const c = new LRUCache(1);
  c.put('a', 1); c.put('b', 2);
  eq(c.get('a'), undefined);
  eq(c.get('b'), 2);
});

test('entries expire after the TTL (fake clock)', () => {
  let t = 0;
  const c = new LRUCache(2, 1000, () => t);
  c.put('a', 1);
  t = 999;  eq(c.get('a'), 1);
  t = 1000; eq(c.get('a'), undefined);
});

test('updating a key restarts its TTL', () => {
  let t = 0;
  const c = new LRUCache(2, 1000, () => t);
  c.put('a', 1);
  t = 800; c.put('a', 2);
  t = 1500; eq(c.get('a'), 2);
});
¦¦¦

### [intermediate] Design the REST API and SQL schema for course enrolments
Design tables and endpoints for users, courses, enrolments and progress in the learning platform. Prevent duplicate enrolments and support listing a learner's courses with progress.
--- solution ---
¦¦¦sql
CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE courses (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  status ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
  total_lessons INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_status_created (status, created_at)
) ENGINE=InnoDB;

CREATE TABLE enrolments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  course_id BIGINT UNSIGNED NOT NULL,
  status ENUM('active','completed','cancelled') NOT NULL DEFAULT 'active',
  completed_lessons INT NOT NULL DEFAULT 0,
  enrolled_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME NULL,
  UNIQUE KEY uq_user_course (user_id, course_id),
  KEY idx_course (course_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
) ENGINE=InnoDB;
¦¦¦
**Endpoints**
- ¦GET /v1/courses?status=published&limit=20&after=cursor¦ lists courses.
- ¦POST /v1/enrolments¦ with ¦{ "courseId": 7 }¦ and an ¦Idempotency-Key¦ header returns ¦201¦, or ¦200¦ with the existing enrolment (the unique key blocks duplicates, so catch the duplicate-key error).
- ¦GET /v1/me/enrolments?status=active¦ joins courses and computes ¦progress = completed_lessons / total_lessons¦.
- ¦PATCH /v1/enrolments/:id/progress¦ with ¦{ "lessonId": 12 }¦ records a completed lesson idempotently.
- ¦DELETE /v1/enrolments/:id¦ cancels (soft status change).
**Notes**: authorise by the token's user ID, never trust a user ID in the body; use ¦422¦ for validation errors, ¦404¦ for unknown IDs, ¦409¦ for conflicts. For heavy activity data later, move per-lesson events to a separate append-only table partitioned by month.

### [intermediate] Cursor (keyset) pagination
Implement ¦listCourses({ limit, after })¦ over an array sorted by ¦createdAt¦ descending then ¦id¦, returning ¦items¦ and an opaque ¦nextCursor¦. Show the equivalent SQL.
--- solution ---
¦¦¦js
const encodeCursor = o => btoa(JSON.stringify(o));          // opaque to the client
const decodeCursor = s => JSON.parse(atob(s));

function listCourses(all, { limit = 3, after } = {}) {
  const sorted = [...all].sort((a, b) =>
    b.createdAt - a.createdAt || b.id - a.id);          // deterministic order

  let start = 0;
  if (after) {
    const c = decodeCursor(after);
    start = sorted.findIndex(x => x.createdAt < c.createdAt || (x.createdAt === c.createdAt && x.id < c.id));
    if (start === -1) start = sorted.length;
  }
  const items = sorted.slice(start, start + limit);
  const last = items[items.length - 1];
  const hasMore = start + limit < sorted.length;
  return { items, nextCursor: hasMore ? encodeCursor({ createdAt: last.createdAt, id: last.id }) : null };
}

const data = Array.from({ length: 7 }, (_, i) => ({ id: i + 1, createdAt: 1000 + Math.floor(i / 2) }));
const p1 = listCourses(data, { limit: 3 });
const p2 = listCourses(data, { limit: 3, after: p1.nextCursor });
console.log(p1.items.map(x => x.id), p2.items.map(x => x.id));
¦¦¦
**SQL (uses the composite index)**
¦¦¦sql
SELECT id, title, created_at
FROM courses
WHERE status = 'published'
  AND (created_at < ? OR (created_at = ? AND id < ?))
ORDER BY created_at DESC, id DESC
LIMIT 21;   -- fetch limit + 1 to know if there is a next page
¦¦¦
--- starter ---
¦¦¦js
const encodeCursor = o => btoa(JSON.stringify(o));          // opaque to the client
const decodeCursor = s => JSON.parse(atob(s));

function listCourses(all, { limit = 3, after } = {}) {
  // your code here
  // 1) sort a copy by createdAt desc, then id desc
  // 2) if "after" is given, start at the first row strictly after that cursor
  // 3) return { items, nextCursor } where nextCursor is null on the last page
  return { items: [], nextCursor: null };
}
¦¦¦
--- tests ---
¦¦¦js
const sample = () => Array.from({ length: 7 }, (_, i) => ({ id: i + 1, createdAt: 1000 + Math.floor(i / 2) }));
const ids = page => page.items.map(x => x.id);

test('first page is newest first and has a cursor', () => {
  const p = listCourses(sample(), { limit: 3 });
  eq(ids(p), [7, 6, 5]);
  ok(typeof p.nextCursor === 'string', 'nextCursor should be a string');
});

test('default limit is 3', () => {
  eq(ids(listCourses(sample())), [7, 6, 5]);
});

test('following the cursor continues the list', () => {
  const p1 = listCourses(sample(), { limit: 3 });
  const p2 = listCourses(sample(), { limit: 3, after: p1.nextCursor });
  eq(ids(p2), [4, 3, 2]);
  const p3 = listCourses(sample(), { limit: 3, after: p2.nextCursor });
  eq(ids(p3), [1]);
  eq(p3.nextCursor, null);
});

test('walking every page returns each item exactly once', () => {
  const seen = [];
  let after;
  let guard = 0;
  do {
    const p = listCourses(sample(), { limit: 2, after });
    seen.push(...ids(p));
    after = p.nextCursor;
  } while (after && ++guard < 20);
  eq(seen, [7, 6, 5, 4, 3, 2, 1]);
});

test('no next cursor when everything fits on one page', () => {
  eq(listCourses(sample(), { limit: 7 }).nextCursor, null);
  eq(ids(listCourses(sample(), { limit: 100 })), [7, 6, 5, 4, 3, 2, 1]);
});

test('is stable when a new row is inserted at the top between pages', () => {
  const data = sample();
  const p1 = listCourses(data, { limit: 3 });
  data.push({ id: 8, createdAt: 2000 });      // newest row arrives
  const p2 = listCourses(data, { limit: 3, after: p1.nextCursor });
  eq(ids(p2), [4, 3, 2]);                      // offset paging would repeat item 5 here
});

test('does not mutate the input array', () => {
  const data = sample();
  const before = data.map(x => x.id);
  listCourses(data, { limit: 2 });
  eq(data.map(x => x.id), before);
});
¦¦¦

### [intermediate] Idempotency-key middleware for Express
Write Express middleware so a retried ¦POST¦ with the same ¦Idempotency-Key¦ returns the first response instead of doing the work twice. Handle concurrent duplicates and key reuse with a different body.
--- solution ---
¦¦¦js
const store = new Map();     // production: Redis or a DB table with a unique key and TTL
const hash = body => JSON.stringify(body ?? {});   // production: store a SHA-256 of the body instead

function idempotency() {
  return (req, res, next) => {
    const key = req.get('Idempotency-Key');
    if (!key) return res.status(400).json({ error: 'Idempotency-Key header required' });

    const fingerprint = hash(req.body);
    const entry = store.get(key);

    if (entry) {
      if (entry.fingerprint !== fingerprint) return res.status(422).json({ error: 'Key reused with different request' });
      if (entry.status === 'in_progress') return res.status(409).json({ error: 'Request in progress' });
      res.set('Idempotent-Replay', 'true');
      return res.status(entry.statusCode).json(entry.body);
    }

    store.set(key, { fingerprint, status: 'in_progress' });
    const json = res.json.bind(res);
    res.json = body => {
      store.set(key, { fingerprint, status: 'done', statusCode: res.statusCode, body });
      return json(body);
    };
    next();
  };
}
¦¦¦
In a database version, ¦INSERT¦ the key row first with a unique constraint: only one concurrent request wins; others get ¦409¦ or wait. Delete keys after about 24 hours, and also delete the key if the handler crashes before finishing, or use a lock timeout.
--- starter ---
¦¦¦js
const store = new Map();     // key -> { fingerprint, status, statusCode, body }
const hash = body => JSON.stringify(body ?? {});

function idempotency() {
  return (req, res, next) => {
    // your code here
    // - no Idempotency-Key header      -> 400
    // - unknown key                    -> mark in progress, remember the response, call next()
    // - same key + same body, finished -> replay the stored status/body, set header Idempotent-Replay: true
    // - same key + different body      -> 422
    // - same key while still running   -> 409
  };
}
¦¦¦
--- tests ---
¦¦¦js
function makeReq(key, body) {
  return { body, get(h) { return h.toLowerCase() === 'idempotency-key' ? key : undefined; } };
}
function makeRes() {
  return {
    statusCode: 200, headers: {}, body: undefined,
    set(k, v) { this.headers[k] = v; return this; },
    status(c) { this.statusCode = c; return this; },
    json(b) { this.body = b; return this; }
  };
}
// runs the middleware; the "handler" answers 201 immediately unless respond=false
function call(mw, key, body, respond = true) {
  const req = makeReq(key, body), res = makeRes();
  let reached = false;
  mw(req, res, () => {
    reached = true;
    if (respond) res.status(201).json({ created: true, echo: body });
  });
  return { res, reached };
}

test('rejects a request without an Idempotency-Key header', () => {
  const mw = idempotency();
  const r = call(mw, undefined, { a: 1 });
  eq(r.res.statusCode, 400);
  eq(r.reached, false);
});

test('first request with a new key reaches the handler', () => {
  const mw = idempotency();
  const r = call(mw, 'key-first', { a: 1 });
  eq(r.reached, true);
  eq(r.res.statusCode, 201);
});

test('a retry with the same key and body replays the first response', () => {
  const mw = idempotency();
  call(mw, 'key-replay', { a: 1 });
  const r = call(mw, 'key-replay', { a: 1 });
  eq(r.reached, false);
  eq(r.res.statusCode, 201);
  eq(r.res.body, { created: true, echo: { a: 1 } });
  eq(r.res.headers['Idempotent-Replay'], 'true');
});

test('the same key with a different body is rejected with 422', () => {
  const mw = idempotency();
  call(mw, 'key-reuse', { a: 1 });
  const r = call(mw, 'key-reuse', { a: 2 });
  eq(r.res.statusCode, 422);
  eq(r.reached, false);
});

test('a duplicate that arrives while the first is still running gets 409', () => {
  const mw = idempotency();
  call(mw, 'key-busy', { a: 1 }, false);       // handler has not responded yet
  const r = call(mw, 'key-busy', { a: 1 });
  eq(r.res.statusCode, 409);
  eq(r.reached, false);
});

test('different keys are independent', () => {
  const mw = idempotency();
  eq(call(mw, 'key-x', { a: 1 }).reached, true);
  eq(call(mw, 'key-y', { a: 1 }).reached, true);
});
¦¦¦

### [basic] Retry with exponential backoff and jitter
Write ¦retry(fn, { retries, baseMs, maxMs })¦ that retries failures with exponential backoff and full jitter, but does not retry client errors. Make ¦random¦ and ¦sleep¦ injectable options (defaulting to ¦Math.random¦ and a real timer) so the delays can be tested, and pass the attempt number (starting at 0) to ¦fn¦.
--- solution ---
¦¦¦js
const realSleep = ms => new Promise(r => setTimeout(r, ms));

async function retry(fn, { retries = 4, baseMs = 100, maxMs = 5000, shouldRetry = e => !(e.status >= 400 && e.status < 500), random = Math.random, sleep = realSleep } = {}) {
  let attempt = 0;
  for (;;) {
    try {
      return await fn(attempt);
    } catch (err) {
      if (attempt >= retries || !shouldRetry(err)) throw err;
      const cap = Math.min(maxMs, baseMs * 2 ** attempt);   // 100, 200, 400, 800...
      const delay = random() * cap;                         // full jitter avoids synchronized retries
      await sleep(delay);
      attempt++;
    }
  }
}

// demo: fails twice, then succeeds
let calls = 0;
retry(async () => { if (++calls < 3) { const e = new Error('503'); e.status = 503; throw e; } return 'ok'; })
  .then(v => console.log(v, 'after', calls, 'calls'));
¦¦¦
Why jitter: without it, thousands of clients retry at the same instants and re-crash the recovering service. Only retry **idempotent** operations (or use idempotency keys), set per-attempt timeouts, and cap total retry time.
--- starter ---
¦¦¦js
const realSleep = ms => new Promise(r => setTimeout(r, ms));

async function retry(fn, { retries = 4, baseMs = 100, maxMs = 5000, shouldRetry = e => !(e.status >= 400 && e.status < 500), random = Math.random, sleep = realSleep } = {}) {
  // your code here
  // - call fn(attempt) starting at attempt 0
  // - on failure: stop if attempts are used up or shouldRetry(err) is false
  // - otherwise wait random() * Math.min(maxMs, baseMs * 2 ** attempt) and try again
}
¦¦¦
--- tests ---
¦¦¦js
// returns a function that fails the first N times with the given HTTP status, then succeeds
function failing(times, status) {
  let n = 0;
  const fn = async () => {
    n++;
    if (n <= times) { const e = new Error('fail ' + n); e.status = status; throw e; }
    return 'ok';
  };
  fn.calls = () => n;
  return fn;
}
const noSleep = async () => {};

test('returns the result when the first call succeeds', async () => {
  eq(await retry(async () => 42, { sleep: noSleep }), 42);
});

test('retries failures and eventually succeeds', async () => {
  const fn = failing(2, 503);
  eq(await retry(fn, { sleep: noSleep, random: () => 0 }), 'ok');
  eq(fn.calls(), 3);
});

test('backoff doubles each attempt (random = 1 gives the full cap)', async () => {
  const delays = [];
  await retry(failing(3, 503), { baseMs: 100, maxMs: 5000, random: () => 1, sleep: async ms => { delays.push(ms); } });
  eq(delays, [100, 200, 400]);
});

test('full jitter scales the delay by random()', async () => {
  const delays = [];
  await retry(failing(3, 503), { baseMs: 100, random: () => 0.5, sleep: async ms => { delays.push(ms); } });
  eq(delays, [50, 100, 200]);
});

test('caps the delay at maxMs', async () => {
  const delays = [];
  await retry(failing(4, 500), { baseMs: 100, maxMs: 250, random: () => 1, sleep: async ms => { delays.push(ms); } });
  eq(delays, [100, 200, 250, 250]);
});

test('does not retry client errors (4xx)', async () => {
  const fn = failing(5, 404);
  let err = null;
  try { await retry(fn, { sleep: noSleep }); } catch (e) { err = e; }
  ok(err && err.status === 404, 'should throw the 404 error');
  eq(fn.calls(), 1);
});

test('gives up after the retry limit and throws the last error', async () => {
  const fn = failing(99, 500);
  let err = null;
  try { await retry(fn, { retries: 2, sleep: noSleep, random: () => 0 }); } catch (e) { err = e; }
  ok(err, 'should throw after retries are used up');
  eq(fn.calls(), 3);                       // first try + 2 retries
});

test('passes the attempt number to fn', async () => {
  const seen = [];
  await retry(async a => {
    seen.push(a);
    if (a < 2) { const e = new Error('x'); e.status = 500; throw e; }
    return 1;
  }, { sleep: noSleep, random: () => 0 });
  eq(seen, [0, 1, 2]);
});
¦¦¦

### [advanced] Implement a circuit breaker
Write a ¦CircuitBreaker¦ wrapper with states closed, open and half-open. Open after N consecutive failures, wait ¦resetMs¦, then allow one trial call.
--- solution ---
¦¦¦js
class CircuitBreaker {
  constructor(fn, { failureThreshold = 3, resetMs = 5000, now = () => Date.now() } = {}) {
    Object.assign(this, { fn, failureThreshold, resetMs, now });
    this.state = 'closed';
    this.failures = 0;
    this.openedAt = 0;
  }
  async call(...args) {
    if (this.state === 'open') {
      if (this.now() - this.openedAt < this.resetMs) throw new Error('Circuit open');
      this.state = 'half-open';                      // allow a trial request
    }
    try {
      const result = await this.fn(...args);
      this.failures = 0;
      this.state = 'closed';
      return result;
    } catch (err) {
      this.failures++;
      if (this.state === 'half-open' || this.failures >= this.failureThreshold) {
        this.state = 'open';
        this.openedAt = this.now();
      }
      throw err;
    }
  }
}

let t = 0, healthy = false;
const cb = new CircuitBreaker(async () => { if (!healthy) throw new Error('down'); return 'ok'; }, { failureThreshold: 2, resetMs: 1000, now: () => t });
(async () => {
  for (let i = 0; i < 3; i++) await cb.call().catch(e => console.log(cb.state, e.message));  // open after 2 failures
  t = 1500; healthy = true;
  console.log(await cb.call(), cb.state);                                                    // ok closed
})();
¦¦¦
Add a fallback (cached data or a friendly message), metrics for state changes, and a limit on concurrent trial calls in half-open state.
--- starter ---
¦¦¦js
class CircuitBreaker {
  constructor(fn, { failureThreshold = 3, resetMs = 5000, now = () => Date.now() } = {}) {
    Object.assign(this, { fn, failureThreshold, resetMs, now });
    this.state = 'closed';      // 'closed' | 'open' | 'half-open'
    this.failures = 0;
    this.openedAt = 0;
  }
  async call(...args) {
    // your code here
    // - open and resetMs not elapsed -> throw new Error('Circuit open') without calling fn
    // - open and resetMs elapsed     -> go half-open and allow one trial call
    // - success -> reset failures, state = 'closed'
    // - failure -> count it; open the circuit at the threshold or when the trial fails; rethrow
  }
}
¦¦¦
--- tests ---
¦¦¦js
function makeService() {
  const svc = { fail: false, calls: 0 };
  svc.fn = async (a, b) => { svc.calls++; if (svc.fail) throw new Error('down'); return a === undefined ? 'ok' : a + b; };
  return svc;
}
async function errorOf(p) { try { await p; } catch (e) { return e; } return null; }

test('passes calls and arguments through while closed', async () => {
  const svc = makeService();
  const cb = new CircuitBreaker(svc.fn);
  eq(await cb.call(), 'ok');
  eq(await cb.call(2, 3), 5);
  eq(cb.state, 'closed');
});

test('opens after the failure threshold', async () => {
  const svc = makeService(); svc.fail = true;
  const cb = new CircuitBreaker(svc.fn, { failureThreshold: 3 });
  await errorOf(cb.call()); await errorOf(cb.call());
  eq(cb.state, 'closed');
  const e = await errorOf(cb.call());
  eq(e.message, 'down');                 // the original error is rethrown
  eq(cb.state, 'open');
});

test('fails fast while open without calling the service', async () => {
  let t = 0;
  const svc = makeService(); svc.fail = true;
  const cb = new CircuitBreaker(svc.fn, { failureThreshold: 2, resetMs: 1000, now: () => t });
  await errorOf(cb.call()); await errorOf(cb.call());
  const callsWhenOpened = svc.calls;
  const e = await errorOf(cb.call());
  eq(e.message, 'Circuit open');
  eq(svc.calls, callsWhenOpened);
});

test('after resetMs a successful trial call closes the circuit', async () => {
  let t = 0;
  const svc = makeService(); svc.fail = true;
  const cb = new CircuitBreaker(svc.fn, { failureThreshold: 2, resetMs: 1000, now: () => t });
  await errorOf(cb.call()); await errorOf(cb.call());
  t = 1000; svc.fail = false;
  eq(await cb.call(), 'ok');
  eq(cb.state, 'closed');
});

test('a failed trial call re-opens the circuit immediately', async () => {
  let t = 0;
  const svc = makeService(); svc.fail = true;
  const cb = new CircuitBreaker(svc.fn, { failureThreshold: 2, resetMs: 1000, now: () => t });
  await errorOf(cb.call()); await errorOf(cb.call());
  t = 1500;
  const e1 = await errorOf(cb.call());     // trial call fails
  eq(e1.message, 'down');
  eq(cb.state, 'open');
  const before = svc.calls;
  const e2 = await errorOf(cb.call());     // still inside the new reset window
  eq(e2.message, 'Circuit open');
  eq(svc.calls, before);
});

test('only consecutive failures count: a success resets the counter', async () => {
  const svc = makeService();
  const cb = new CircuitBreaker(svc.fn, { failureThreshold: 3 });
  svc.fail = true;  await errorOf(cb.call()); await errorOf(cb.call());
  svc.fail = false; await cb.call();
  svc.fail = true;  await errorOf(cb.call()); await errorOf(cb.call());
  eq(cb.state, 'closed');
});
¦¦¦

### [advanced] Cache-aside with stampede protection
Write ¦getOrLoad(key, loader, ttlMs)¦ so concurrent misses for the same key trigger only one loader call (single flight), with TTL jitter and optional stale-while-revalidate.
--- solution ---
¦¦¦js
const cache = new Map();         // key -> { value, expires }
const inflight = new Map();      // key -> Promise

async function getOrLoad(key, loader, ttlMs = 60_000) {
  const hit = cache.get(key);
  const now = Date.now();
  if (hit && hit.expires > now) return hit.value;

  if (inflight.has(key)) {                          // someone is already loading
    if (hit) return hit.value;                      // stale-while-revalidate: serve old value
    return inflight.get(key);                       // otherwise wait for the same promise
  }

  const jitter = ttlMs * (0.9 + Math.random() * 0.2);   // spread expiries +-10%
  const p = loader()
    .then(value => { cache.set(key, { value, expires: Date.now() + jitter }); return value; })
    .finally(() => inflight.delete(key));
  inflight.set(key, p);
  return hit ? hit.value : p;
}

// demo: 5 concurrent misses, one loader call
let loads = 0;
const loader = async () => { loads++; await new Promise(r => setTimeout(r, 50)); return 'course-catalogue'; };
Promise.all(Array.from({ length: 5 }, () => getOrLoad('catalogue', loader))).then(r => console.log(r.length, 'results,', loads, 'load'));
¦¦¦
In multi-server production use a distributed lock (¦SET key value NX PX 5000¦) or Redis-side request coalescing, and cache negative results briefly to stop penetration.
--- starter ---
¦¦¦js
const cache = new Map();         // key -> { value, expires }
const inflight = new Map();      // key -> Promise of the load that is running

async function getOrLoad(key, loader, ttlMs = 60_000) {
  // your code here
  // - fresh entry in cache      -> return it
  // - a load is already running -> share it (or return the stale value if you have one)
  // - otherwise call loader() once, store the result with a TTL (+-10% jitter), clear inflight
  // - failures must not be cached
}
¦¦¦
--- tests ---
¦¦¦js
const sleepMs = ms => new Promise(r => setTimeout(r, ms));
function countingLoader(value, delay = 10) {
  const l = async () => { l.calls++; await sleepMs(delay); return value; };
  l.calls = 0;
  return l;
}

test('five concurrent misses trigger a single load', async () => {
  const loader = countingLoader('catalogue');
  const out = await Promise.all(Array.from({ length: 5 }, () => getOrLoad('t-single', loader, 1000)));
  eq(out, ['catalogue', 'catalogue', 'catalogue', 'catalogue', 'catalogue']);
  eq(loader.calls, 1);
});

test('a fresh cached value is returned without loading again', async () => {
  const loader = countingLoader('v1');
  await getOrLoad('t-hit', loader, 1000);
  eq(await getOrLoad('t-hit', loader, 1000), 'v1');
  eq(loader.calls, 1);
});

test('different keys load independently', async () => {
  const a = countingLoader('A'), b = countingLoader('B');
  const [x, y] = await Promise.all([getOrLoad('t-a', a, 1000), getOrLoad('t-b', b, 1000)]);
  eq([x, y], ['A', 'B']);
  eq([a.calls, b.calls], [1, 1]);
});

test('a failing load is not cached and the error reaches the caller', async () => {
  const bad = async () => { await sleepMs(5); throw new Error('db down'); };
  let err = null;
  try { await getOrLoad('t-fail', bad, 1000); } catch (e) { err = e; }
  ok(err && err.message === 'db down', 'should rethrow the loader error');
  eq(await getOrLoad('t-fail', async () => 'recovered', 1000), 'recovered');
});

test('stale-while-revalidate: expired values are served while one reload runs', async () => {
  await getOrLoad('t-swr', async () => 'v1', 30);
  await sleepMs(60);                                        // entry is now expired
  const reload = countingLoader('v2');
  eq(await getOrLoad('t-swr', reload, 1000), 'v1');         // stale value returned immediately
  eq(await getOrLoad('t-swr', reload, 1000), 'v1');         // still stale, but no second load
  eq(reload.calls, 1);
  await sleepMs(40);                                        // reload finished
  eq(await getOrLoad('t-swr', reload, 1000), 'v2');
  eq(reload.calls, 1);
});
¦¦¦

### [advanced] Consistent hashing ring with virtual nodes
Implement ¦addNode¦, ¦removeNode¦ and ¦getNode(key)¦. Show that adding a node moves only a small share of keys.
--- solution ---
¦¦¦js
// small pure-JS hash (FNV-1a plus a final mix) so the code runs in the browser too
function hash(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
  return h >>> 0;
}

class HashRing {
  constructor(vnodes = 100) { this.vnodes = vnodes; this.ring = []; }   // sorted [{ h, node }]
  addNode(node) {
    for (let i = 0; i < this.vnodes; i++) this.ring.push({ h: hash(¦§{node}#§{i}¦), node });
    this.ring.sort((a, b) => a.h - b.h);
  }
  removeNode(node) { this.ring = this.ring.filter(e => e.node !== node); }
  getNode(key) {
    const h = hash(key);
    let lo = 0, hi = this.ring.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (this.ring[mid].h < h) lo = mid + 1; else hi = mid; }
    return this.ring[lo % this.ring.length].node;            // wrap around the circle
  }
}

const ring = new HashRing();
['cache-a', 'cache-b', 'cache-c'].forEach(n => ring.addNode(n));
const keys = Array.from({ length: 10000 }, (_, i) => ¦user:§{i}¦);
const before = keys.map(k => ring.getNode(k));
ring.addNode('cache-d');
const moved = keys.filter((k, i) => ring.getNode(k) !== before[i]).length;
console.log('moved', (moved / keys.length * 100).toFixed(1) + '%');   // about 25%, not about 75%
¦¦¦
With ¦hash(key) % N¦ going from 3 to 4 nodes would move about 75% of keys. Virtual nodes smooth the distribution; give bigger servers more vnodes.
--- starter ---
¦¦¦js
// small pure-JS hash (given): string -> unsigned 32-bit integer
function hash(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
  return h >>> 0;
}

class HashRing {
  constructor(vnodes = 100) { this.vnodes = vnodes; this.ring = []; }   // sorted [{ h, node }]
  addNode(node) {
    // your code here: add vnodes points for this node and keep the ring sorted by h
  }
  removeNode(node) {
    // your code here
  }
  getNode(key) {
    // your code here: first ring point with h >= hash(key), wrapping around to the start
  }
}
¦¦¦
--- tests ---
¦¦¦js
function buildRing(nodes, vnodes) {
  const r = new HashRing(vnodes);
  nodes.forEach(n => r.addNode(n));
  return r;
}
const manyKeys = Array.from({ length: 4000 }, (_, i) => 'user:' + i);

test('adds vnodes points per node and keeps the ring sorted', () => {
  const r = buildRing(['a', 'b', 'c'], 50);
  eq(r.ring.length, 150);
  for (let i = 1; i < r.ring.length; i++) ok(r.ring[i - 1].h <= r.ring[i].h, 'ring must be sorted by h');
});

test('the same key always maps to the same known node', () => {
  const r = buildRing(['cache-a', 'cache-b', 'cache-c']);
  const n = r.getNode('course:42');
  eq(r.getNode('course:42'), n);
  ok(['cache-a', 'cache-b', 'cache-c'].includes(n), 'must return one of the nodes');
});

test('keys are spread across the nodes', () => {
  const r = buildRing(['cache-a', 'cache-b', 'cache-c']);
  const counts = {};
  manyKeys.forEach(k => { const n = r.getNode(k); counts[n] = (counts[n] || 0) + 1; });
  eq(Object.keys(counts).length, 3);
  Object.values(counts).forEach(c => ok(c > manyKeys.length * 0.15 && c < manyKeys.length * 0.55, 'each node should hold roughly a third, got ' + c));
});

test('adding a node moves only about a quarter of the keys, all to the new node', () => {
  const r = buildRing(['cache-a', 'cache-b', 'cache-c']);
  const before = manyKeys.map(k => r.getNode(k));
  r.addNode('cache-d');
  let moved = 0;
  manyKeys.forEach((k, i) => {
    const now = r.getNode(k);
    if (now !== before[i]) { moved++; eq(now, 'cache-d', 'a moved key must land on the new node'); }
  });
  const share = moved / manyKeys.length;
  ok(share > 0.1 && share < 0.4, 'expected about 25% to move, got ' + Math.round(share * 100) + '%');
});

test('removing a node only moves the keys that lived on it', () => {
  const r = buildRing(['cache-a', 'cache-b', 'cache-c']);
  const before = manyKeys.map(k => r.getNode(k));
  r.removeNode('cache-b');
  manyKeys.forEach((k, i) => {
    const now = r.getNode(k);
    ok(now !== 'cache-b', 'removed node must not be returned');
    if (before[i] !== 'cache-b') eq(now, before[i], 'keys on other nodes must not move');
  });
});

test('wraps around the end of the ring', () => {
  const r = buildRing(['only-node'], 10);
  manyKeys.slice(0, 200).forEach(k => eq(r.getNode(k), 'only-node'));
});
¦¦¦

### [advanced] Build a pub/sub event bus with at-least-once handlers
Implement ¦subscribe(topic, handler)¦ and ¦publish(topic, event)¦ in memory, where failed handlers are retried up to 3 times and then pushed to a dead-letter list. Make handlers idempotent using event IDs.
--- solution ---
¦¦¦js
class EventBus {
  constructor() { this.subs = new Map(); this.dlq = []; this.seq = 0; }
  subscribe(topic, name, handler) {
    if (!this.subs.has(topic)) this.subs.set(topic, []);
    this.subs.get(topic).push({ name, handler, seen: new Set() });
  }
  async publish(topic, event) {
    const e = { ...event, id: event.id ?? ¦evt-§{++this.seq}¦ };
    for (const s of this.subs.get(topic) ?? []) {
      if (s.seen.has(e.id)) continue;                       // idempotent: skip duplicates
      let ok = false;
      for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
        try { await s.handler(e); ok = true; s.seen.add(e.id); }
        catch (err) { if (attempt === 3) this.dlq.push({ topic, subscriber: s.name, event: e, error: err.message }); }
      }
    }
    return e.id;
  }
}

const bus = new EventBus();
let attempts = 0;
bus.subscribe('course.completed', 'certificate', async e => { console.log('certificate for', e.userId); });
bus.subscribe('course.completed', 'email', async () => { attempts++; throw new Error('smtp down'); });
(async () => {
  await bus.publish('course.completed', { id: 'evt-1', userId: 7 });
  await bus.publish('course.completed', { id: 'evt-1', userId: 7 });    // duplicate ignored by the certificate handler
  console.log('email attempts', attempts, 'DLQ size', bus.dlq.length);  // 6 attempts (the email handler never succeeded, so the duplicate is retried), DLQ size 2
})();
¦¦¦
Real systems persist the seen-ID set in a table (¦processed_events¦ with a unique key) so duplicates are ignored across restarts, and alert on the DLQ depth. Kafka keeps offsets per consumer group instead; SQS uses visibility timeouts and a redrive policy to a DLQ.
--- starter ---
¦¦¦js
class EventBus {
  constructor() { this.subs = new Map(); this.dlq = []; this.seq = 0; }
  subscribe(topic, name, handler) {
    // your code here: remember { name, handler, seen: new Set() } for the topic
  }
  async publish(topic, event) {
    // your code here
    // - give the event an id if it has none (e.g. evt-1, evt-2)
    // - for each subscriber: skip ids it has already handled successfully
    // - try the handler up to 3 times; after the 3rd failure push
    //   { topic, subscriber, event, error } to this.dlq
    // - return the event id
  }
}
¦¦¦
--- tests ---
¦¦¦js
test('delivers events to every subscriber of the topic only', async () => {
  const bus = new EventBus();
  const got = [];
  bus.subscribe('t', 'a', async e => { got.push('a' + e.n); });
  bus.subscribe('t', 'b', async e => { got.push('b' + e.n); });
  bus.subscribe('other', 'c', async () => { got.push('c'); });
  await bus.publish('t', { n: 1 });
  sameItems(got, ['a1', 'b1']);
});

test('publish returns the event id (generated when missing)', async () => {
  const bus = new EventBus();
  bus.subscribe('t', 'a', async () => {});
  eq(await bus.publish('t', { id: 'given-1' }), 'given-1');
  const generated = await bus.publish('t', { n: 1 });
  ok(typeof generated === 'string' && generated.length > 0, 'a generated id is expected');
});

test('retries a failing handler and succeeds on the third attempt', async () => {
  const bus = new EventBus();
  let calls = 0;
  bus.subscribe('t', 'flaky', async () => { calls++; if (calls < 3) throw new Error('temporary'); });
  await bus.publish('t', { id: 'e1' });
  eq(calls, 3);
  eq(bus.dlq.length, 0);
});

test('sends the event to the dead-letter list after 3 failed attempts', async () => {
  const bus = new EventBus();
  let calls = 0;
  bus.subscribe('orders', 'bad', async () => { calls++; throw new Error('boom'); });
  await bus.publish('orders', { id: 'e2', userId: 7 });
  eq(calls, 3);
  eq(bus.dlq.length, 1);
  eq(bus.dlq[0].subscriber, 'bad');
  eq(bus.dlq[0].topic, 'orders');
  eq(bus.dlq[0].error, 'boom');
  eq(bus.dlq[0].event.id, 'e2');
});

test('a failing subscriber does not block the others', async () => {
  const bus = new EventBus();
  let good = 0;
  bus.subscribe('t', 'bad', async () => { throw new Error('x'); });
  bus.subscribe('t', 'good', async () => { good++; });
  await bus.publish('t', { id: 'e3' });
  eq(good, 1);
});

test('a handler that already succeeded ignores a duplicate event id', async () => {
  const bus = new EventBus();
  let handled = 0;
  bus.subscribe('t', 'once', async () => { handled++; });
  await bus.publish('t', { id: 'dup' });
  await bus.publish('t', { id: 'dup' });
  eq(handled, 1);
});

test('publishing to a topic without subscribers is a no-op', async () => {
  const bus = new EventBus();
  await bus.publish('nobody', { id: 'e4' });
  eq(bus.dlq.length, 0);
});
¦¦¦

### [advanced] Implement a Bloom filter and explain where to use it
Build a Bloom filter with ¦add¦ and ¦mightContain¦. Explain the trade-off and one use in the learning platform.
--- solution ---
¦¦¦js
// small pure-JS hash with a seed (FNV-1a plus a final mix), so the code runs in the browser too
function hash32(str, seed = 0) {
  let h = (0x811c9dc5 ^ seed) >>> 0;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
  return h >>> 0;
}

class BloomFilter {
  constructor(bits = 1 << 16, hashes = 3) {
    this.bits = bits;
    this.hashes = hashes;
    this.arr = new Uint8Array(bits);
  }
  _positions(item) {                          // double hashing: h1 + i * h2 gives k positions from two hashes
    const s = String(item);
    const h1 = hash32(s, 1), h2 = (hash32(s, 2) | 1) >>> 0;   // keep it an odd, unsigned number
    return Array.from({ length: this.hashes }, (_, i) => (h1 + i * h2) % this.bits);
  }
  add(item) { for (const p of this._positions(item)) this.arr[p] = 1; }
  mightContain(item) { return this._positions(item).every(p => this.arr[p] === 1); }
}

const bf = new BloomFilter();
['user:1', 'user:2', 'user:3'].forEach(k => bf.add(k));
console.log(bf.mightContain('user:2'), bf.mightContain('user:999'));   // true false (false positives are possible, false negatives never)
¦¦¦
It answers "definitely not present" or "maybe present" in very little memory. Use it in front of a cache or database to reject lookups for keys that do not exist (stopping cache penetration), to check "have I seen this event or URL before", or to avoid disk reads in LSM-tree databases. Size it from the expected item count and the acceptable false positive rate, and note that standard Bloom filters cannot delete items.
--- starter ---
¦¦¦js
// small pure-JS hash with a seed (given): string -> unsigned 32-bit integer
function hash32(str, seed = 0) {
  let h = (0x811c9dc5 ^ seed) >>> 0;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
  return h >>> 0;
}

class BloomFilter {
  constructor(bits = 1 << 16, hashes = 3) {
    this.bits = bits;
    this.hashes = hashes;
    this.arr = new Uint8Array(bits);
  }
  _positions(item) {
    // your code here: return this.hashes bit positions
    // hint: h1 = hash32(s, 1), h2 = (hash32(s, 2) | 1) >>> 0, position i = (h1 + i * h2) % this.bits
  }
  add(item) {
    // your code here
  }
  mightContain(item) {
    // your code here
  }
}
¦¦¦
--- tests ---
¦¦¦js
test('an empty filter contains nothing', () => {
  const bf = new BloomFilter();
  eq(bf.mightContain('user:1'), false);
});

test('added items are always reported as present (no false negatives)', () => {
  const bf = new BloomFilter();
  const items = Array.from({ length: 1000 }, (_, i) => 'user:' + i);
  items.forEach(i => bf.add(i));
  items.forEach(i => eq(bf.mightContain(i), true, i));
});

test('items that were never added are almost always reported absent', () => {
  const bf = new BloomFilter();
  for (let i = 0; i < 1000; i++) bf.add('user:' + i);
  let falsePositives = 0;
  for (let i = 0; i < 1000; i++) if (bf.mightContain('other:' + i)) falsePositives++;
  ok(falsePositives < 20, 'too many false positives: ' + falsePositives);
});

test('adding the same item twice changes nothing', () => {
  const bf = new BloomFilter();
  bf.add('a');
  const snapshot = Array.from(bf.arr).join('');
  bf.add('a');
  eq(Array.from(bf.arr).join(''), snapshot);
  eq(bf.mightContain('a'), true);
});

test('a tiny filter fills up and starts to give false positives', () => {
  const bf = new BloomFilter(64, 3);
  for (let i = 0; i < 100; i++) bf.add('x' + i);
  let hits = 0;
  for (let i = 0; i < 100; i++) if (bf.mightContain('y' + i)) hits++;
  ok(hits > 50, 'a saturated filter says "maybe" for most items, got ' + hits);
});

test('numbers and strings are treated the same way (String(item))', () => {
  const bf = new BloomFilter();
  bf.add(42);
  eq(bf.mightContain('42'), true);
});
¦¦¦

## SCENARIOS

### Design the Clinical Learning Hub (video lessons, progress tracking, quizzes, certificates) for 500 000 learners.
Walk the frame. **Requirements**: browse and enrol in courses, watch lessons, track progress, take quizzes, receive certificates; learners are healthcare professionals, so availability, privacy and audit matter; spikes before compliance deadlines. **Estimate**: about 30 average and 150 to 1 500 peak QPS, mostly reads. **Design**: React frontend on a CDN; API behind a load balancer (stateless Node/Express, autoscaled, 2 AZs); MySQL primary with read replicas for users, courses, enrolments and quiz results; Redis for sessions, catalogue cache and rate limits; videos in S3 delivered via CloudFront with signed URLs; progress events written through a queue to batch inserts; certificate generation as a background job (PDF to S3, email through the notification service); search with OpenSearch if the catalogue grows. **Deep dive**: progress tracking (write path, idempotent events, partitioned table, resume position cached) and quiz scoring (server-side, immutable attempts). **Risks**: spikes (autoscale, cache), data protection (encryption, audit logs, least privilege), DR (multi-AZ, backups with tested restore, RPO 5 minutes and RTO 1 hour). Close with monitoring SLOs and what you would add later.

### Your API p95 latency doubles during peak hours. How do you investigate and fix it?
Measure first: dashboards for p50/p95/p99 per endpoint, CPU, event-loop lag, database connections, slow query log, cache hit rate, and recent deploys. Find the bottleneck layer: if the database (missing indexes, N+1, lock waits, exhausted pool), fix queries and add replicas or caching; if the app (CPU-bound or blocking code), profile and scale horizontally or move work to workers; if a dependency, add timeouts, circuit breaker and caching. Add load tests that reproduce the peak, set alerts on p95, and re-measure after each change to prove improvement (this is how you reached 30 to 40% faster responses).

### Design a rate limiter for a public API used by many tenants.
Clarify limits (per user, per tenant, per endpoint) and behaviours (hard reject or queue). Use token bucket for burst-friendly limits. Keep counters in Redis keyed by tenant and endpoint, run the refill-and-consume logic in a Lua script for atomicity, and return ¦429¦ with ¦Retry-After¦ and ¦X-RateLimit-*¦ headers. Place a coarse limiter at the edge (WAF/API gateway) and fine-grained ones in the app. Plan for Redis failure (fail open with a local fallback limiter, or fail closed for sensitive endpoints), hot keys, clock skew and configuration changes without redeploys. Test with load.

### Design a notification system that sends 5 million emails a day without duplicates.
Producers publish events to a queue; a notification service applies user preferences, renders templates, and writes a ¦notifications¦ row with a unique ¦(event_id, channel)¦ key before sending, which dedupes retries. Separate queues and worker pools per channel, with provider rate limits, retries with backoff and a DLQ. Use idempotency keys with the email provider when available, handle webhooks for delivered, bounced and complained, suppress bounced addresses, and track status for support. About 60 per second average means a few workers; scale on queue depth. Exactly-once is not realistic, so say you aim for at-least-once delivery with idempotent sending and deduplication.

### The team wants to move from a monolith to microservices. What do you decide?
Ask which problems are real: deploy conflicts, scaling hotspots, team ownership. Often a **modular monolith** (clear module boundaries, one database schema per module, no cross-module table access) solves most of it. If you do split, pick boundaries by business capability (learning content, enrolment, assessment, notifications), give each service its own data, communicate by APIs and events, use the outbox pattern and idempotent consumers, add tracing, a gateway and CI/CD per service, and migrate one slice at a time with the strangler fig approach. Set success criteria (deploy frequency, incident count) and be ready to stop if the cost outweighs the benefit.

### Design a multi-region disaster recovery plan for a healthcare learning platform with RPO 5 minutes and RTO 1 hour.
Start with business impact: learners can tolerate short downtime, but data loss (completed training records) is costly. Use multi-AZ everywhere for routine failures. For region loss: cross-region **read replica** or Aurora global database for near-continuous data copy (RPO of minutes), S3 cross-region replication for content, infrastructure as code to launch the app tier in the standby region (warm standby with minimal servers), Route 53 health checks and a documented failover runbook, secrets and container images replicated. Practise failover quarterly, test backup restores, monitor replication lag against the RPO, and plan the failback. Active-active is more expensive and unnecessary for these targets.
`;
