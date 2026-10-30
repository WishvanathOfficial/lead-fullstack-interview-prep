window.PREP_NOTES = window.PREP_NOTES || {};
window.PREP_NOTES.system = String.raw`
## Phase 1 · Foundations (Basic)
### The system design interview frame
#### In one line
A repeatable 7-step routine (requirements, estimation, API, data model, high-level design, deep dive, trade-offs) that keeps you structured while the problem is vague.

#### Real-life analogy
An architect never starts by drawing walls. She first asks: how many people, what budget, what climate? Then a rough floor plan, then detail for the tricky parts. Jumping straight to "use Kafka" is like picking tiles before knowing the house size.

#### How it works
1. **Requirements** (3-5 min): functional ("learner enrols in a course") and non-functional (scale, latency, availability, consistency). State what is out of scope.
2. **Estimation**: users, QPS, storage, bandwidth. Just enough to choose designs.
3. **API**: the 3-6 key endpoints.
4. **Data model**: entities, keys, SQL or NoSQL.
5. **High-level design**: boxes and arrows: client, CDN, load balancer, services, DB, cache, queue.
6. **Deep dive**: the riskiest 1-2 parts (hot partition, consistency, fan-out).
7. **Trade-offs and next steps**: bottlenecks, failure modes, monitoring, cost.

#### Example
¦¦¦text
Prompt: "Design the Clinical Learning Hub."
Ask:   Who are the users? (nurses, ~500k) Video? Certificates? Regions? Offline?
Say:   "Reads are 100x writes, p95 < 300 ms, 99.9% availability, strong
        consistency only for certificates."
Draw:  Browser -> CDN -> LB -> API (Node) -> MySQL (+replica) / Redis / S3
Dive:  progress tracking writes, certificate issuance idempotency
Close: "Bottleneck: progress writes. Next: queue + batch. Monitor: p95, queue lag."
¦¦¦

#### Remember it
Mnemonic **R-E-A-D-H-D-T**: Requirements, Estimate, API, Data, High-level, Deep dive, Trade-offs. Talk out loud, state assumptions, and ask before you assume.

#### Common mistakes
- Starting with technology names before requirements.
- Spending 20 minutes on boxes and never going deep anywhere.
- Silent thinking; the interviewer cannot grade what they cannot hear.
- Presenting one "right answer" instead of trade-offs.

#### Interview angle
*"How do you approach an open-ended design question?"* Say: "I clarify functional and non-functional requirements, estimate scale, define the API and data model, sketch a high-level design, then deep-dive into the riskiest component and finish with trade-offs and monitoring." Follow-up: *"What if requirements change mid-way?"* Re-state the affected assumptions and show which part of the design moves.

### Back-of-envelope estimation
#### In one line
Quick, rounded maths that tells you whether you need one server or a hundred, and one disk or a petabyte.

#### Real-life analogy
Before a wedding you estimate "200 guests x 3 plates = 600 plates", not an exact number. The goal is the right order of magnitude so you book the right hall.

#### How it works
- **Seconds in a day** ≈ 100,000 (86,400). So 1M requests/day ≈ 10 QPS.
- **QPS** = daily requests / 100,000. **Peak** ≈ 2-5x average.
- **Storage** = items x size x retention x replication.
- **Bandwidth** = QPS x payload size.
- Powers of two: 1 KB = 10³, 1 MB = 10⁶, 1 GB = 10⁹ bytes (approximately).
- Latency numbers: memory ~100 ns, SSD read ~100 µs, same-datacentre round trip ~0.5 ms, cross-continent ~150 ms.

#### Example
¦¦¦js
// Clinical Learning Hub, rough sizing
const users = 500_000, dau = users * 0.2;          // 100k daily active
const reqPerUser = 50;                             // API calls per day
const qps = (dau * reqPerUser) / 100_000;          // 50 QPS average
const peak = qps * 4;                              // 200 QPS peak
const progressRows = dau * 20 * 365;               // 20 events/day/year
const storageGB = (progressRows * 200) / 1e9;      // 200 bytes each
console.log({ qps, peak, storageGB: Math.round(storageGB) });
// { qps: 50, peak: 200, storageGB: 146 }  -> one MySQL primary is fine
¦¦¦

#### Remember it
| Fact | Value |
|---|---|
| Seconds/day | ~10⁵ |
| 1M req/day | ~12 QPS |
| 1B req/day | ~12k QPS |
| Read from RAM vs SSD vs network | ns / µs / ms |
Round aggressively, write units, and sanity check the result.

#### Common mistakes
- Forgetting peak vs average.
- Mixing bits and bytes, or MB and GB.
- Estimating for ten minutes and never using the numbers to decide anything.

#### Interview angle
*"How many servers do you need?"* Say: "Peak is about 200 QPS; one Node instance handles roughly 1-2k simple QPS, so two for redundancy; the database is the real limit." Follow-up: *"What changes at 100x?"* Cache reads, add replicas, then shard.

### Client-server, HTTP, DNS, TLS: what happens when you open a URL
#### In one line
Opening a URL triggers DNS lookup, a TCP connection, a TLS handshake, an HTTP request through CDN and load balancer, app and database, and finally rendering.

#### Real-life analogy
Posting a letter: look up the address (DNS), arrange a secure courier (TLS), deliver the letter (HTTP), the reception desk routes it (load balancer), an employee handles it (app), pulls a file (DB), and returns a reply.

#### How it works
1. **Browser cache / DNS**: resolve ¦learninghub.com¦ to an IP (cached at browser, OS, resolver).
2. **TCP** three-way handshake (HTTP/3 uses QUIC over UDP).
3. **TLS** handshake: certificate check, keys agreed, traffic encrypted.
4. **HTTP request** goes to the **CDN** (static assets served from the edge) or to the **load balancer**.
5. **App server** authenticates, reads cache/DB, builds the response.
6. Response returns; browser parses HTML, fetches CSS/JS/images, renders.

#### Example
¦¦¦text
Browser -> DNS (A record) -> 52.1.2.3
Browser == TLS ==> CloudFront (cache HIT for app.js)
Browser == TLS ==> ALB -> Node API -> Redis (miss) -> MySQL
GET /api/courses  200  14 ms server time, 90 ms total
¦¦¦

#### Remember it
**D-T-T-H-A-D-R**: DNS, TCP, TLS, HTTP, App, Data, Render. Each hop is a place for latency, caching or failure.

#### Common mistakes
- Forgetting DNS TTLs when planning failover.
- Ignoring connection reuse (keep-alive, HTTP/2 multiplexing).
- Not mentioning the CDN for static content.

#### Interview angle
*"What happens when you type a URL?"* Walk the six steps above briefly, then mention where you would cache and where it can fail. Follow-up: *"How does HTTPS stay secure?"* Certificates prove identity; asymmetric crypto agrees a session key; symmetric crypto encrypts data.

### API styles: REST, GraphQL, gRPC, WebSockets, SSE
#### In one line
Different ways for clients and servers to talk; choose by data shape, performance, and direction of communication.

#### Real-life analogy
REST is ordering from a fixed menu; GraphQL is a build-your-own bowl; gRPC is a private phone line between kitchens; WebSockets is an open walkie-talkie; SSE is a radio the kitchen broadcasts on.

#### How it works
| Style | Best for | Watch out |
|---|---|---|
| REST/JSON | Public CRUD APIs, caching | Over/under-fetching |
| GraphQL | Many client shapes, mobile | Caching, N+1, query cost |
| gRPC | Internal service-to-service, streaming | Browser support, debugging |
| WebSocket | Two-way real time (chat) | Stateful connections, scaling |
| SSE | Server to client push (notifications) | One-way only |

#### Example
¦¦¦js
// SSE endpoint in Express: push progress updates
app.get('/events', (req, res) => {
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' });
  const timer = setInterval(() => res.write('data: ' + JSON.stringify({ t: Date.now() }) + '\n\n'), 2000);
  req.on('close', () => clearInterval(timer));
});
¦¦¦

#### Remember it
Default to **REST**; use **gRPC inside**, **GraphQL for flexible clients**, **WebSocket for chat**, **SSE for one-way push**.

#### Common mistakes
- Using WebSockets where polling or SSE is enough.
- Choosing GraphQL without query depth limits.
- Treating REST as only "JSON over HTTP" and ignoring status codes and idempotency.

#### Interview angle
*"REST or GraphQL?"* "REST for simple, cacheable resources; GraphQL when many clients need different shapes, with cost limits and dataloaders." Follow-up: *"How do you scale WebSockets?"* Sticky or pub/sub backplane (Redis), and connection limits per node.

### Load balancing
#### In one line
A load balancer spreads incoming requests over healthy servers and hides failures from clients.

#### Real-life analogy
A supermarket manager directing shoppers to the shortest checkout and closing a broken till.

#### How it works
- **L4** (TCP/UDP): fast, routes by IP and port.
- **L7** (HTTP): routes by path, header, cookie; can terminate TLS, do auth, rewrite.
- **Algorithms**: round robin, weighted, least connections, IP hash, consistent hash.
- **Health checks**: probe ¦/health¦; unhealthy nodes are removed and re-added.
- The balancer itself must not be a single point of failure: run it redundantly (AWS ALB is managed and multi-AZ).

#### Example
¦¦¦text
upstream api { least_conn; server 10.0.1.10:3000; server 10.0.1.11:3000 max_fails=3 fail_timeout=10s; }
location /api/   { proxy_pass http://api; }
location /static { root /var/www; expires 30d; }
¦¦¦

#### Remember it
**L4 = fast and dumb, L7 = smart and flexible.** Always pair with health checks and a drain period for deployments.

#### Common mistakes
- Sticky sessions hiding the need for shared session storage.
- Health check that only tests "process is up", not "DB is reachable".
- Forgetting connection draining during releases.

#### Interview angle
*"What happens when a server dies?"* "Health checks mark it down, the balancer stops routing there, in-flight requests may retry on another node if they are idempotent." Follow-up: *"How do you avoid the LB being a SPOF?"* Multiple LB nodes across AZs behind DNS or anycast.

### Scaling: vertical vs horizontal, stateless services
#### In one line
Vertical scaling makes one machine bigger; horizontal scaling adds more machines, which works best when services keep no local state.

#### Real-life analogy
A bigger pizza oven (vertical) vs more ovens (horizontal). More ovens only help if any oven can bake any order (stateless).

#### How it works
- **Vertical**: simple, but there is a ceiling, a price curve and a single point of failure.
- **Horizontal**: add nodes behind a load balancer; needs stateless design.
- **Stateless service**: no user data in process memory; sessions in Redis or signed tokens, uploads in S3, config from environment.
- Databases are the hard part to scale: use caching, replicas, then sharding.

#### Example
¦¦¦js
// Stateful (breaks with 2 servers)
const sessions = {};
app.post('/login', (req, res) => { sessions[req.body.user] = Date.now(); });

// Stateless: signed token holds the identity
const token = jwt.sign({ sub: user.id, role: user.role }, SECRET, { expiresIn: '15m' });
¦¦¦

#### Remember it
**Scale out the stateless tier, scale up (then out) the stateful tier.** 12-factor: config in env, logs to stdout, processes disposable.

#### Common mistakes
- Local file uploads or in-memory caches that differ per node.
- Scaling the app while the single DB stays the bottleneck.
- Auto scaling without warm-up or limits.

#### Interview angle
*"Why are stateless services easy to scale?"* "Any instance can serve any request, so I add or remove instances freely behind the balancer." Follow-up: *"Where does the state go?"* Database, cache, object storage, or the client token.

### SQL vs NoSQL, ACID vs BASE
#### In one line
SQL stores relational data with strong guarantees (ACID); NoSQL trades some of that for flexibility and horizontal scale (often BASE).

#### Real-life analogy
SQL is a well-organised filing cabinet with rules; NoSQL is a set of labelled boxes: faster to add, harder to cross-reference.

#### How it works
- **ACID**: Atomic, Consistent, Isolated, Durable transactions.
- **BASE**: Basically Available, Soft state, Eventually consistent.
- **SQL** (MySQL, PostgreSQL): joins, constraints, transactions; scale reads with replicas.
- **NoSQL** types: key-value (Redis, DynamoDB), document (MongoDB), wide-column (Cassandra), graph (Neo4j).
- Choose by access pattern, not fashion.

#### Example
¦¦¦text
Enrolments, payments, certificates   -> MySQL (transactions, constraints)
Learner activity events (billions)   -> Cassandra/DynamoDB (write heavy, key lookup)
Session/progress cache               -> Redis
Course search                        -> OpenSearch
Videos                               -> S3 + CDN
¦¦¦

#### Remember it
**Default SQL. Move to NoSQL for a specific, measured need** (scale, schema flexibility, access pattern). Polyglot persistence is normal.

#### Common mistakes
- "NoSQL is faster" as a blanket claim.
- Forcing relational data into documents then re-implementing joins in code.
- Ignoring operational cost of another database.

#### Interview angle
*"SQL or NoSQL for X?"* Discuss data shape, query patterns, consistency needs and scale; then name the store and why. Follow-up: *"Can SQL scale?"* Yes: indexes, caching, replicas, partitioning, then sharding.

### Indexing and query basics
#### In one line
An index is a sorted lookup structure that makes reads fast at the cost of slower writes and more storage.

#### Real-life analogy
The index at the back of a textbook: finding a word is instant, but every time the book changes you must update the index.

#### How it works
- **B-tree index** (default): good for equality and range; O(log n).
- **Composite index** follows the **leftmost prefix** rule: ¦(user_id, created_at)¦ helps ¦WHERE user_id=?¦ and both, not only ¦created_at¦.
- **Covering index** holds all queried columns, avoiding table lookups.
- Use ¦EXPLAIN¦ to verify.
- Each extra index slows ¦INSERT/UPDATE¦; avoid indexing low-cardinality columns alone.

#### Example
¦¦¦sql
-- slow: full scan
SELECT id, title FROM courses WHERE category_id = 7 AND status = 'live' ORDER BY created_at DESC LIMIT 20;

CREATE INDEX idx_courses_cat_status_created ON courses (category_id, status, created_at);
EXPLAIN SELECT ...;  -- type=ref, no filesort
¦¦¦

#### Remember it
**Equality columns first, range/sort column last.** Index for your queries, measure with ¦EXPLAIN¦.

#### Common mistakes
- Index on every column.
- Functions on indexed columns (¦WHERE DATE(created_at)=...¦) defeating the index.
- Offset pagination on large tables.

#### Interview angle
*"Why not index everything?"* "Writes pay for every index, memory is limited, and the optimiser only uses a few." Follow-up: *"Index vs cache?"* Index speeds the database itself; cache avoids the query.

### Replication: leader-follower, read replicas, lag
#### In one line
Copying data from a leader database to followers so reads scale and a failover target exists.

#### Real-life analogy
A teacher writes on the board (leader) and students copy into notebooks (followers). A student may be a few seconds behind.

#### How it works
- Writes go to the **leader**; followers replay its log (binlog in MySQL).
- **Async** replication: fast, but lag and possible loss on failover. **Sync/semi-sync**: safer, slower.
- **Replica lag** causes stale reads and the "I just saved but do not see it" bug.
- Fixes: read-your-writes (route that user to the leader for a few seconds), sticky reads, or version checks.
- **Failover**: promote a follower; clients reconnect via DNS or a proxy.

#### Example
¦¦¦js
// Simple read/write split with read-your-writes window
const lastWrite = new Map(); // userId -> timestamp
function db(userId, isWrite) {
  if (isWrite) { lastWrite.set(userId, Date.now()); return primary; }
  return Date.now() - (lastWrite.get(userId) || 0) < 5000 ? primary : replica;
}
¦¦¦

#### Remember it
**Replicas scale reads, not writes.** Lag is the price; design for it.

#### Common mistakes
- Reading from replicas right after writing.
- Assuming failover is instant and lossless.
- Running reporting queries on the primary.

#### Interview angle
*"How do you scale a read-heavy database?"* "Cache, then read replicas with read-your-writes handling, then partition." Follow-up: *"Write bottleneck?"* Sharding or moving hot writes to a queue.

### Caching basics
#### In one line
Keeping a fast copy of expensive-to-get data closer to the user to cut latency and load.

#### Real-life analogy
Keeping your most-used spices on the counter instead of walking to the pantry every time.

#### How it works
Layers: **browser cache** (Cache-Control), **CDN** (static and some API), **application cache** (Redis/Memcached), **DB buffer cache**.
- Cache what is **read often, changes rarely, expensive to compute**.
- Never cache secrets or highly personal data in shared caches; be careful with permissions.
- Always set a **TTL**; plan invalidation.

#### Example
¦¦¦js
async function getCourse(id) {
  const key = 'course:' + id;
  const hit = await redis.get(key);
  if (hit) return JSON.parse(hit);
  const course = await Course.findByPk(id);
  await redis.set(key, JSON.stringify(course), 'EX', 300); // 5 min TTL
  return course;
}
¦¦¦

#### Remember it
**"There are only two hard things: cache invalidation and naming things."** Prefer short TTLs plus event-based invalidation.

#### Common mistakes
- No TTL, so stale data lives forever.
- Caching per-user responses in a shared CDN.
- Treating the cache as the source of truth.

#### Interview angle
*"What would you cache in the learning hub?"* "Course catalogue, public content, config; not payment or certificate state." Follow-up: *"Cache hit rate low?"* Check key design, TTL and access skew.

### Availability maths: nines, SLA, single points of failure
#### In one line
Availability is the fraction of time a system works; components in series multiply (worse), in parallel improve it.

#### Real-life analogy
A chain is as strong as its weakest link (series). Two bridges across a river means one can close without stopping traffic (parallel).

#### How it works
| Availability | Downtime/year |
|---|---|
| 99% | ~3.65 days |
| 99.9% | ~8.8 hours |
| 99.99% | ~53 minutes |
| 99.999% | ~5 minutes |
- **Series**: A x B (0.999 x 0.999 = 0.998).
- **Parallel**: 1 - (1-A)(1-B) (two 99% nodes give 99.99%).
- Find and remove **single points of failure**: LB, DB, DNS, one AZ.

#### Example
¦¦¦js
const series   = (...a) => a.reduce((x, y) => x * y, 1);
const parallel = (a, n) => 1 - Math.pow(1 - a, n);
console.log(series(0.999, 0.999, 0.995));      // 0.993 (API+DB+auth chain)
console.log(parallel(0.99, 2));                // 0.9999 (two replicas)
¦¦¦

#### Remember it
**More dependencies in a chain = less availability. Redundancy = more.** SLA is a promise; SLO is your target; SLI is the measurement.

#### Common mistakes
- Forgetting that third-party services count in the chain.
- Redundancy in one availability zone only.
- Promising 99.99% without testing failover.

#### Interview angle
*"What is the availability of three 99.9% services in a row?"* "About 99.7%." Follow-up: *"How do you raise it?"* Redundancy, timeouts, fallbacks, and removing hard dependencies.

### Latency vs throughput, p50/p95/p99
#### In one line
Latency is how long one request takes; throughput is how many you complete per second; percentiles reveal slow tails that averages hide.

#### Real-life analogy
A motorway: latency is the time one car takes; throughput is cars per hour. Adding lanes raises throughput, not the speed of a single car.

#### How it works
- **p50** is the typical request; **p95/p99** are the slow ones users complain about.
- One slow dependency can dominate p99 (tail latency amplification when a page calls many services).
- Throughput is limited by the slowest resource (CPU, DB connections, network).
- Little's law: concurrent requests = throughput x latency.

#### Example
¦¦¦js
function percentile(sorted, p) { return sorted[Math.ceil((p / 100) * sorted.length) - 1]; }
const ms = [12, 14, 15, 15, 16, 18, 20, 25, 400, 900].sort((a, b) => a - b);
console.log({ avg: ms.reduce((a, b) => a + b) / ms.length, p50: percentile(ms, 50), p95: percentile(ms, 95) });
// avg 143.5 hides that p95 is 900
¦¦¦

#### Remember it
**Measure percentiles, not averages. Optimise p95/p99 for user experience.**

#### Common mistakes
- Reporting only averages.
- Load testing with unrealistic traffic.
- Ignoring queueing delays under load.

#### Interview angle
*"Why p99?"* "In a page that makes 20 calls, the chance of hitting at least one slow call is high, so tail latency drives real experience." Follow-up: *"How do you reduce it?"* Timeouts, hedged requests, caching, and fewer synchronous hops.

## Phase 2 · Building blocks (Intermediate)
### Sharding and partitioning
#### In one line
Splitting a large dataset across multiple databases (shards) by a key so no single machine holds or serves everything.

#### Real-life analogy
A library too big for one room: books A-H in room 1, I-P in room 2 and so on (range), or by a hash of the title (hash) so rooms fill evenly.

#### How it works
- **Range**: simple, supports range queries, risks hot shards (all new data hits the latest range).
- **Hash**: even spread, hard range queries, re-sharding moves data (use consistent hashing).
- **Directory/lookup**: a table maps key to shard; flexible, but it is a dependency.
- Pick a **shard key** with high cardinality that matches your main query (¦learner_id¦).
- Costs: cross-shard joins and transactions are hard; hot keys; re-sharding effort.

#### Example
¦¦¦js
const SHARDS = ['db0', 'db1', 'db2', 'db3'];
const shardFor = learnerId => SHARDS[hash(String(learnerId)) % SHARDS.length];
// All of one learner's progress lives on one shard -> single-shard queries
const conn = connections[shardFor(user.id)];
¦¦¦

#### Remember it
**Shard last.** Try indexes, cache, replicas and archiving first. Choose a key you almost always query by.

#### Common mistakes
- Sharding by a low-cardinality or time-based key (hot shard).
- Needing cross-shard joins for core queries.
- No plan for re-sharding.

#### Interview angle
*"How would you shard learner activity data?"* "By learner_id hash, because queries are per learner; a celebrity-style hot key is unlikely, and reports go to a separate analytical store." Follow-up: *"How do you add shards?"* Consistent hashing or directory-based migration with dual writes.

### CAP, PACELC and consistency models
#### In one line
During a network partition you must choose between consistency and availability; even without partitions you trade latency against consistency.

#### Real-life analogy
Two bank branches lose their phone line. Either refuse withdrawals until they can talk (consistent, unavailable) or allow them and reconcile later (available, possibly inconsistent).

#### How it works
- **CAP**: Consistency, Availability, Partition tolerance; partitions happen, so choose C or A **during** a partition.
- **PACELC**: if Partition choose A or C; Else choose Latency or Consistency.
- Models (strong to weak): **linearizable/strong**, **causal**, **read-your-writes**, **eventual**.
- Banking balance: strong. Social feed likes: eventual is fine.

#### Example
¦¦¦text
Certificate issuance  -> CP: single leader, transaction, reject if unsure
Course view counter   -> AP: increment locally, merge later
Progress %            -> read-your-writes for the learner, eventual for managers' dashboard
¦¦¦

#### Remember it
**Match the model to the business risk.** Strong consistency is expensive; use it only where wrong data is costly.

#### Common mistakes
- Saying "CA" systems exist in distributed settings.
- Applying one consistency level to everything.
- Confusing CAP consistency with ACID consistency.

#### Interview angle
*"Explain CAP with an example."* Use the bank and the social feed. Follow-up: *"Which would you choose for enrolment?"* Strong for payment and seat limits, eventual for counts shown on the page.

### Caching strategies and invalidation
#### In one line
Rules for when to read and write the cache versus the database, and how to keep them in sync.

#### Real-life analogy
A shop shelf (cache) and the warehouse (database). Do you restock when a customer asks (cache-aside), every time the warehouse changes (write-through), or in bulk later (write-back)?

#### How it works
- **Cache-aside**: app reads cache, on miss loads DB and fills cache. Most common.
- **Write-through**: write to cache and DB together; consistent, slower writes.
- **Write-back**: write to cache, flush to DB later; fast, risk of loss.
- **Invalidation**: TTL, delete on update, versioned keys, event-based.
- **Stampede**: many requests miss at once; use a lock, request coalescing, or jittered TTLs.

#### Example
¦¦¦js
const inflight = new Map();
async function getCached(key, loader, ttl = 300) {
  const hit = await redis.get(key);
  if (hit) return JSON.parse(hit);
  if (inflight.has(key)) return inflight.get(key);            // coalesce concurrent misses
  const p = loader().then(async v => {
    await redis.set(key, JSON.stringify(v), 'EX', ttl + Math.floor(Math.random() * 30)); // jitter
    inflight.delete(key);
    return v;
  });
  inflight.set(key, p);
  return p;
}
¦¦¦

#### Remember it
**Cache-aside + TTL + delete-on-write** covers most cases. Add jitter and coalescing for hot keys.

#### Common mistakes
- Updating the DB and cache non-atomically in the wrong order.
- Same TTL for all keys causing synchronised expiry.
- Caching null results forever.

#### Interview angle
*"How do you handle cache stampede?"* "Single-flight loading, a short lock, jittered TTLs, or serving stale while revalidating." Follow-up: *"How do you invalidate across services?"* Publish an event and let each service evict its keys.

### Message queues and event-driven design
#### In one line
A queue lets one component hand work to another asynchronously, decoupling speed, failures and scale.

#### Real-life analogy
A restaurant order rail: waiters pin tickets, cooks take them at their own pace, and a broken ticket goes to a separate spike.

#### How it works
- **Queue** (SQS, RabbitMQ): each message processed by one consumer. **Log/stream** (Kafka): ordered, replayable, many consumer groups.
- Delivery: at-most-once, **at-least-once** (default; duplicates possible), exactly-once (hard, usually "effectively once" via idempotency).
- **Idempotent consumer**: processing a message twice has the same effect.
- **DLQ**: poison messages move aside after N retries.
- Use for emails, certificate PDFs, analytics, spikes.

#### Example
¦¦¦js
async function handle(msg) {
  const done = await redis.set('processed:' + msg.id, 1, 'NX', 'EX', 86400); // idempotency guard
  if (!done) return;                       // duplicate delivery -> ignore
  await sendCertificateEmail(msg.learnerId);
}
¦¦¦

#### Remember it
**Assume duplicates and reordering. Make handlers idempotent, retry with backoff, and use a DLQ.**

#### Common mistakes
- Assuming exactly-once delivery.
- No visibility into queue lag.
- Huge messages instead of references to S3.

#### Interview angle
*"Queue vs Kafka?"* "Queues for task distribution; Kafka for event logs, replay and multiple consumers." Follow-up: *"How do you keep order?"* Partition by key; one consumer per partition.

### Outbox pattern and transactional messaging
#### In one line
Write the event into an "outbox" table in the same DB transaction as the data change, then publish it reliably later.

#### Real-life analogy
Writing a letter and putting it in the outbox tray while you sign the contract. The postman collects the tray later; the letter is never lost if the phone rings in between.

#### How it works
- Problem: **dual write**: save to DB then publish to a broker; a crash between the two loses or duplicates events.
- Solution: in one transaction insert the row **and** an ¦outbox¦ event.
- A relay (poller or CDC like Debezium) publishes unsent events, then marks them sent.
- Consumers must be idempotent (at-least-once).

#### Example
¦¦¦js
await sequelize.transaction(async t => {
  const enrol = await Enrolment.create({ learnerId, courseId }, { transaction: t });
  await Outbox.create({ type: 'EnrolmentCreated', payload: { id: enrol.id }, sentAt: null }, { transaction: t });
});
// relay worker
const rows = await Outbox.findAll({ where: { sentAt: null }, limit: 100 });
for (const r of rows) { await queue.publish(r.type, r.payload); await r.update({ sentAt: new Date() }); }
¦¦¦

#### Remember it
**One transaction, two writes (data + event).** Publish later, deduplicate on the consumer.

#### Common mistakes
- Publishing inside the transaction before commit.
- Outbox table growing forever (clean up).
- Relay not preserving per-entity order.

#### Interview angle
*"How do you avoid losing events?"* "Outbox plus a relay with at-least-once and idempotent consumers." Follow-up: *"Why not 2PC?"* Poor availability and broker support; outbox is simpler.

### Rate limiting
#### In one line
Restricting how many requests a client can make in a time window to protect the system and ensure fairness.

#### Real-life analogy
A nightclub door: only so many guests per minute, and a bucket of tokens that refills slowly.

#### How it works
- **Fixed window**: simple, bursty at boundaries.
- **Sliding window** (log or counter): smoother, more memory.
- **Token bucket**: tokens refill at a rate; allows bursts up to capacity. Most popular.
- **Leaky bucket**: constant outflow, smooths traffic.
- Distributed: keep counters in Redis (atomic INCR or Lua); return **429** and ¦Retry-After¦.

#### Example
¦¦¦js
class TokenBucket {
  constructor(capacity, refillPerSec) { this.cap = capacity; this.rate = refillPerSec; this.tokens = capacity; this.last = Date.now(); }
  allow() {
    const now = Date.now();
    this.tokens = Math.min(this.cap, this.tokens + ((now - this.last) / 1000) * this.rate);
    this.last = now;
    if (this.tokens >= 1) { this.tokens -= 1; return true; }
    return false;
  }
}
const b = new TokenBucket(5, 1);
console.log(Array.from({ length: 7 }, () => b.allow())); // 5 true, then false, false
¦¦¦

#### Remember it
**Token bucket = burst + steady rate.** Limit by user, API key and IP; return 429 with Retry-After.

#### Common mistakes
- Limiting only by IP (shared NATs, proxies).
- Race conditions with non-atomic counters.
- No limit on expensive endpoints like login or search.

#### Interview angle
*"Implement a rate limiter."* Describe token bucket, then the Redis Lua script for atomicity. Follow-up: *"Multiple regions?"* Local limits with periodic sync, accepting small overshoot.

### API design at scale
#### In one line
Designing APIs that stay fast, safe to retry and easy to evolve as clients and data grow.

#### Real-life analogy
A restaurant menu with stable names, portion sizes (pagination), and a rule that ordering twice by accident does not charge you twice (idempotency).

#### How it works
- **Cursor pagination** (¦?after=id¦) instead of ¦OFFSET¦ for large lists.
- **Versioning**: URL ¦/v1¦ or headers; add fields, avoid breaking changes.
- **Idempotency keys** for POST payments/enrolments.
- **Bulk endpoints** to cut round trips; consistent **error format** (code, message, details).
- Rate limits, ETags/conditional requests, and compression.

#### Example
¦¦¦js
app.get('/v1/courses', async (req, res) => {
  const limit = Math.min(+req.query.limit || 20, 100);
  const after = req.query.after || 0;
  const rows = await Course.findAll({ where: { id: { [Op.gt]: after } }, order: [['id', 'ASC']], limit: limit + 1 });
  const next = rows.length > limit ? rows[limit - 1].id : null;
  res.json({ data: rows.slice(0, limit), next });
});
¦¦¦

#### Remember it
**Cursor, not offset. Idempotency on writes. Never break old clients.**

#### Common mistakes
- Offset pagination with deep pages.
- Returning different error shapes per endpoint.
- Changing meaning of existing fields.

#### Interview angle
*"Design pagination for a feed."* "Cursor based on a stable sort key; return next cursor." Follow-up: *"How do you retire an old version?"* Announce, monitor usage, deprecate with headers, then remove.

### Authentication and authorisation
#### In one line
Authentication proves who you are; authorisation decides what you may do.

#### Real-life analogy
Showing ID at the hospital entrance (authentication), then your badge only opening the doors for your department (authorisation).

#### How it works
- **Sessions**: server stores state; easy revocation; needs shared store.
- **JWT**: signed, stateless; hard to revoke, so use short expiry + refresh tokens.
- **OAuth2/OIDC**: delegate login to an identity provider; SSO across apps.
- **RBAC** (roles) vs **ABAC** (attributes/policies).
- Store tokens in HttpOnly, Secure, SameSite cookies; hash passwords with bcrypt/argon2.

#### Example
¦¦¦js
function requireRole(...roles) {
  return (req, res, next) => roles.includes(req.user.role) ? next() : res.status(403).json({ error: 'Forbidden' });
}
app.delete('/v1/courses/:id', authenticate, requireRole('admin'), removeCourse);
¦¦¦

#### Remember it
**401 = not logged in, 403 = not allowed.** Short-lived access token, rotating refresh token, central revocation list if needed.

#### Common mistakes
- Storing JWTs in localStorage without considering XSS.
- Long-lived tokens with no revocation.
- Checking roles only in the UI.

#### Interview angle
*"JWT or sessions?"* "Sessions for simple first-party web with easy revocation; JWT for distributed APIs, with short expiry and refresh." Follow-up: *"How do you revoke a JWT?"* Short TTL, deny-list, or token versioning.

### Monolith vs microservices, API gateway, service discovery
#### In one line
Choose the simplest deployable unit that your team and scale need; split only when the pain is real.

#### Real-life analogy
One big kitchen vs many food trucks. Trucks scale and fail independently but need coordination, logistics and more staff.

#### How it works
- **Monolith**: simple deploys, easy transactions, can grow messy.
- **Modular monolith**: clear module boundaries in one deployable; a great default.
- **Microservices**: independent deploy/scale/teams; costs: network failures, distributed data, observability, DevOps.
- **API gateway**: single entry for auth, routing, rate limits. **Service discovery**: find instances (DNS, Consul, Kubernetes).
- Split by business capability and data ownership.

#### Example
¦¦¦text
Gateway (auth, rate limit)
 |- catalogue-service   (courses, search)      own DB
 |- learning-service    (progress, quizzes)    own DB
 |- certificate-service (PDF, issuing)         own DB + queue
Shared: identity, notifications, observability
¦¦¦

#### Remember it
**Start modular monolith; extract a service when a team, scale or release cadence demands it.**

#### Common mistakes
- Distributed monolith: services sharing a database.
- Too many tiny services.
- Synchronous call chains without timeouts.

#### Interview angle
*"Would you use microservices?"* "Only with clear boundaries and a team that can run them; otherwise a modular monolith." Follow-up: *"How do services share data?"* APIs and events, not shared tables.

### Resilience patterns
#### In one line
Techniques that stop one failing dependency from taking the whole system down.

#### Real-life analogy
A house with fuses: a short circuit trips one fuse instead of burning down the house.

#### How it works
- **Timeouts** on every network call.
- **Retries with exponential backoff and jitter**, only for idempotent operations.
- **Circuit breaker**: after repeated failures, stop calling for a while (closed, open, half-open).
- **Bulkhead**: isolate pools so one slow dependency cannot use all threads.
- **Graceful degradation**: fallback content, cached data, disable non-critical features.

#### Example
¦¦¦js
async function retry(fn, tries = 4, base = 100) {
  for (let i = 0; i < tries; i++) {
    try { return await fn(); }
    catch (e) {
      if (i === tries - 1) throw e;
      const delay = Math.random() * base * 2 ** i;   // full jitter
      await new Promise(r => setTimeout(r, delay));
    }
  }
}
¦¦¦

#### Remember it
**Timeout, retry (with jitter), break, isolate, degrade.** Retries without limits cause retry storms.

#### Common mistakes
- Infinite retries.
- No timeout (threads pile up).
- Retrying non-idempotent writes.

#### Interview angle
*"How do you prevent cascading failures?"* "Timeouts, circuit breakers, bulkheads, load shedding." Follow-up: *"Retry storm?"* Backoff with jitter, retry budgets, and shedding load.

### Observability
#### In one line
Being able to understand what a running system is doing from its logs, metrics and traces.

#### Real-life analogy
A hospital monitor: heart rate (metrics), the nurse's notes (logs), and the patient's journey between departments (traces).

#### How it works
- **Logs**: structured JSON with request id, user id (no secrets).
- **Metrics**: rate, errors, duration (RED), and saturation (USE).
- **Traces**: follow one request across services (OpenTelemetry).
- **SLI** (measurement) → **SLO** (target) → **SLA** (contract). Alert on SLO burn rate, not every spike.

#### Example
¦¦¦text
SLI: % of GET /courses answered < 300 ms and non-5xx
SLO: 99.5% over 30 days  -> error budget 0.5% (about 3.6 hours)
Alert: burning budget 10x faster than allowed for 10 minutes -> page
¦¦¦

#### Remember it
**RED for services, USE for resources, SLOs for alerts.** Correlation ids connect everything.

#### Common mistakes
- Logging sensitive data.
- Alerting on causes instead of symptoms.
- No dashboards for dependencies.

#### Interview angle
*"What SLOs for a learning platform?"* "Availability and p95 latency of learner-facing APIs, video start time, certificate delivery time." Follow-up: *"What is an error budget?"* Allowed unreliability that balances shipping and stability.

### Reliability and disaster recovery
#### In one line
Planning for failure: redundancy inside a region, backups, and a tested way to recover within agreed time and data-loss limits.

#### Real-life analogy
Fire drills and a backup generator: you rehearse so that the real emergency is routine.

#### How it works
- **Multi-AZ** for high availability within a region; **multi-region** for disaster recovery.
- **RPO** (how much data you can lose) and **RTO** (how long to recover) drive the strategy: backup/restore → pilot light → warm standby → active-active.
- Automated, **tested** backups; point-in-time recovery; infrastructure as code.
- **Chaos testing** to prove failover works.

#### Example
¦¦¦text
RPO 15 min, RTO 1 hour  -> RDS Multi-AZ + cross-region read replica + PITR,
                           IaC to rebuild stack, runbook, quarterly failover drill
RPO 0, RTO minutes      -> active-active, conflict handling (costly)
¦¦¦

#### Remember it
**Untested backups are not backups.** Choose the cheapest strategy that meets RPO/RTO.

#### Common mistakes
- Backups in the same account and region as production.
- No runbook or ownership.
- Ignoring dependency failures (DNS, identity provider).

#### Interview angle
*"Design DR for RPO 15 minutes."* "Continuous replication or PITR, cross-region copy, IaC, and a rehearsed failover." Follow-up: *"Cost trade-off?"* Warm standby costs more than restore-from-backup but recovers faster.

### Security fundamentals
#### In one line
Build security in at every layer: encrypt data, protect secrets, grant least privilege, and handle personal and health data carefully.

#### Real-life analogy
A hospital: locked doors, ID badges, records only visible to the treating team, and an audit trail of who looked.

#### How it works
- **TLS** everywhere; **encryption at rest** (KMS-managed keys).
- **Secrets** in a manager (AWS Secrets Manager), never in git or logs.
- **Least privilege** IAM; network segmentation; private subnets for databases.
- **Input validation**, parameterised queries, output encoding, CSRF/CORS correctness, dependency scanning.
- **PII/PHI**: minimise, mask in logs, access audit, retention rules (HIPAA/GDPR principles).

#### Example
¦¦¦js
// parameterised query (no SQL injection)
const [rows] = await pool.execute('SELECT id, title FROM courses WHERE category_id = ? AND status = ?', [categoryId, 'live']);
// never: 'SELECT ... WHERE name = ' + req.query.name
¦¦¦

#### Remember it
**Defence in depth: validate, authenticate, authorise, encrypt, audit.** Add security to every design, not as an afterthought.

#### Common mistakes
- Secrets in environment files committed to git.
- Overly broad IAM roles.
- Logging tokens or personal data.

#### Interview angle
*"How do you secure the learning hub?"* Run through network, identity, data, application and monitoring layers. Follow-up: *"How do you handle PII?"* Collect less, encrypt, restrict access, audit, delete on schedule.

## Phase 3 · Advanced and case studies (Lead level)
### Consistent hashing and virtual nodes
#### In one line
A way to map keys to nodes so that adding or removing a node moves only a small fraction of keys.

#### Real-life analogy
Guests seated around a circular table, each served by the next waiter clockwise. If one waiter leaves, only his guests move to the next waiter.

#### How it works
- Hash both nodes and keys onto a ring (0 to 2³²).
- A key belongs to the first node clockwise from it.
- Adding a node takes over keys only from its neighbour; plain ¦hash % N¦ would reshuffle almost everything.
- **Virtual nodes**: each physical node appears many times on the ring for even distribution and smoother rebalancing.
- Used in caches, Dynamo-style stores, load balancers.

#### Example
¦¦¦js
class Ring {
  constructor(nodes, vnodes = 100) {
    this.ring = [];
    for (const n of nodes) for (let i = 0; i < vnodes; i++) this.ring.push({ h: hash(n + '#' + i), n });
    this.ring.sort((a, b) => a.h - b.h);
  }
  get(key) {
    const h = hash(key);
    let lo = 0, hi = this.ring.length;
    while (lo < hi) { const m = (lo + hi) >> 1; this.ring[m].h < h ? (lo = m + 1) : (hi = m); }
    return this.ring[lo % this.ring.length].n;
  }
}
function hash(s) { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; }
¦¦¦

#### Remember it
**hash % N reshuffles everything; the ring moves about 1/N of keys.** Add vnodes for balance.

#### Common mistakes
- Too few virtual nodes (uneven load).
- Ignoring replication on the next nodes.
- Forgetting hot keys are still hot.

#### Interview angle
*"Why consistent hashing?"* "To add or remove cache nodes without invalidating most keys." Follow-up: *"How many keys move?"* Roughly 1/N of them.

### Unique ID generation
#### In one line
Creating IDs that are unique across many machines, ideally sortable by time and cheap to generate.

#### Real-life analogy
Each branch of a bank issues cheque numbers from its own range, plus the date, so branches never clash.

#### How it works
| Option | Pros | Cons |
|---|---|---|
| Auto-increment | Simple, compact | Single writer, leaks counts, hard to shard |
| UUID v4 | No coordination | Random, poor index locality, 16 bytes |
| UUID v7 / ULID | Time-ordered, no coordination | Clock dependence |
| Snowflake | 64-bit, time-sorted, fast | Needs worker id, clock sync |
- Snowflake layout: 41 bits timestamp + 10 bits worker + 12 bits sequence.

#### Example
¦¦¦js
class Snowflake {
  constructor(workerId) { this.w = BigInt(workerId); this.seq = 0n; this.last = -1n; this.epoch = 1700000000000n; }
  next() {
    let t = BigInt(Date.now()) - this.epoch;
    if (t === this.last) { this.seq = (this.seq + 1n) & 4095n; if (this.seq === 0n) while (t <= this.last) t = BigInt(Date.now()) - this.epoch; }
    else this.seq = 0n;
    this.last = t;
    return (t << 22n) | (this.w << 12n) | this.seq;
  }
}
console.log(new Snowflake(1).next() < new Snowflake(1).next()); // IDs grow with time
¦¦¦

#### Remember it
**Need sorted + sharded? Snowflake/ULID/UUIDv7.** Single DB and simple? Auto-increment.

#### Common mistakes
- UUID v4 as clustered primary key on huge tables.
- Trusting clocks that move backwards.
- Exposing sequential IDs in public URLs.

#### Interview angle
*"IDs for a sharded table?"* "Snowflake-style or UUIDv7: unique without coordination and index friendly." Follow-up: *"Clock goes back?"* Refuse to issue until time catches up.

### Search: inverted index, Elasticsearch, autocomplete
#### In one line
Search engines index words to documents (an inverted index) so queries find matches and rank them quickly.

#### Real-life analogy
The back-of-book index: look up a word and get the page numbers, rather than reading every page.

#### How it works
- **Analyse** text: lowercase, tokenise, stem, remove stop words.
- **Inverted index**: term maps to a list of document ids (and positions).
- **Ranking**: TF-IDF/BM25 plus boosts (title, popularity, freshness).
- **Elasticsearch/OpenSearch** shard and replicate indexes; the primary DB stays the source of truth, synced by events/CDC.
- **Autocomplete**: prefix trie, edge n-grams, or a completion suggester, cached.

#### Example
¦¦¦js
const docs = { 1: 'react hooks guide', 2: 'node react api', 3: 'sql tuning guide' };
const index = {};
for (const [id, text] of Object.entries(docs))
  for (const w of new Set(text.split(' '))) (index[w] ||= []).push(+id);
const search = (...words) => words.map(w => index[w] || []).reduce((a, b) => a.filter(x => b.includes(x)));
console.log(search('react', 'guide')); // [ 1 ]
¦¦¦

#### Remember it
**DB for truth, search engine for finding.** Keep them in sync asynchronously and accept a small delay.

#### Common mistakes
- Using ¦LIKE '%term%'¦ on big tables.
- Index not updated on deletes.
- No reindex strategy when mappings change.

#### Interview angle
*"Design course search."* "Index course documents in OpenSearch, update via events, boost titles, cache popular queries." Follow-up: *"Typo tolerance?"* Fuzzy matching with edit distance.

### File upload and object storage
#### In one line
Store large files in object storage (S3) and let clients upload and download directly, not through your API servers.

#### Real-life analogy
Giving a visitor a visitor pass to the warehouse door instead of carrying every parcel yourself.

#### How it works
1. Client asks API for an upload slot.
2. API validates user, size and type, returns a **presigned URL**.
3. Client uploads directly to S3 (multipart for big files, resumable).
4. S3 event triggers processing: virus scan, thumbnail, transcode.
5. Metadata (owner, status) lives in the DB; delivery goes through a **CDN** with signed URLs.

#### Example
¦¦¦js
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
const s3 = new S3Client({ region: 'ap-south-1' });
app.post('/v1/uploads', authenticate, async (req, res) => {
  const key = 'uploads/' + req.user.id + '/' + crypto.randomUUID();
  const url = await getSignedUrl(s3, new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: req.body.type }), { expiresIn: 300 });
  res.json({ url, key });
});
¦¦¦

#### Remember it
**Presigned URL in, CDN out. API handles metadata only.**

#### Common mistakes
- Proxying large files through Node.
- Public buckets.
- Trusting client-declared file types.

#### Interview angle
*"How do you handle a 2 GB video upload?"* "Multipart presigned upload, async transcoding, status via events." Follow-up: *"Security?"* Short-lived URLs, size limits, scanning, private buckets.

### Notification service
#### In one line
A central service that sends email, SMS and push messages reliably, respecting user preferences and avoiding duplicates.

#### Real-life analogy
A post office sorting room: it takes letters from everyone, chooses the right courier, retries lost deliveries, and respects "do not disturb".

#### How it works
- Producers publish events (¦CertificateIssued¦) to a queue.
- Notification service renders **templates**, checks **preferences** and quiet hours, chooses channel(s).
- Sends via providers (SES, Twilio, FCM) with retries and backoff; **dedupe key** prevents repeats.
- Track status (sent, delivered, failed), handle bounces and unsubscribes.
- Priority queues: OTP before newsletters; rate limit per provider.

#### Example
¦¦¦js
async function notify(evt) {
  const dedupe = evt.type + ':' + evt.userId + ':' + evt.refId;
  if (!(await redis.set(dedupe, 1, 'NX', 'EX', 86400))) return;     // already sent
  const prefs = await Prefs.get(evt.userId);
  const channels = prefs.channels.filter(c => !prefs.mute.includes(evt.type));
  await Promise.all(channels.map(c => send(c, render(evt, c))));
}
¦¦¦

#### Remember it
**At-least-once + dedupe key = effectively once.** Preferences and unsubscribe are compliance features.

#### Common mistakes
- Sending synchronously inside the request.
- No fallback provider.
- Ignoring time zones and quiet hours.

#### Interview angle
*"Design notifications."* "Event-driven, templated, preference-aware, retried, deduped, observable." Follow-up: *"Provider down?"* Failover to a second provider and queue with backoff.

### Real-time systems
#### In one line
Systems that push updates to clients immediately, using WebSockets, SSE or sometimes simple polling.

#### Real-life analogy
Phone call (WebSocket) vs radio broadcast (SSE) vs checking your letterbox every minute (polling).

#### How it works
- **Polling/long-polling**: simple, wasteful; fine for low frequency.
- **SSE**: one-way server push over HTTP, auto-reconnect.
- **WebSocket**: two-way, persistent; needs sticky routing or a **pub/sub backplane** (Redis, Kafka) so any server can deliver to any user.
- **Presence**: heartbeats with TTL. **Fan-out**: group messages sent to each connection.
- Limits: connections per node (tens of thousands), reconnect storms, backpressure.

#### Example
¦¦¦js
// WebSocket server fan-out through Redis pub/sub
wss.on('connection', ws => {
  sub.subscribe('room:' + ws.room);
  ws.on('message', m => pub.publish('room:' + ws.room, m.toString()));
});
sub.on('message', (ch, msg) => rooms.get(ch)?.forEach(c => c.send(msg)));
¦¦¦

#### Remember it
**Use the simplest push that fits.** WebSockets add state; you must manage it.

#### Common mistakes
- No heartbeat, so dead connections linger.
- Not handling reconnect with last event id.
- Sending huge payloads to every client.

#### Interview angle
*"Chat vs notification push?"* "Chat needs two-way WebSocket; notifications are fine with SSE or mobile push." Follow-up: *"Scale to a million connections?"* Many gateway nodes, pub/sub, sharded presence store.

### Frontend system design
#### In one line
Designing the browser side: rendering strategy, state, caching, performance and structure for many teams.

#### Real-life analogy
Designing a shop front: what is on display (rendered fast), what is fetched from the back room (API), and how many staff (teams) can work without bumping into each other.

#### How it works
- **CSR** (fast navigation, slower first paint), **SSR** (fast first paint, server cost), **SSG/ISR** (static, cached, revalidated).
- **Performance budgets**: JS size, LCP, INP, CLS; code splitting, lazy loading, image optimisation, CDN.
- **State**: server state (React Query) vs client state; normalised cache; optimistic updates.
- **Micro-frontends** for independent teams (module federation) with a shared design system.
- Accessibility, error boundaries, observability (RUM).

#### Example
¦¦¦js
// Route-level splitting and server-state caching
const Dashboard = lazy(() => import('./Dashboard'));
const { data } = useQuery({ queryKey: ['courses', page], queryFn: () => api.courses(page), staleTime: 60_000 });
¦¦¦

#### Remember it
**Budget, split, cache, measure.** Pick rendering per page type, not per company.

#### Common mistakes
- One giant bundle.
- Duplicating server state in global stores.
- Micro-frontends without governance.

#### Interview angle
*"Design a dashboard."* "Skeleton first, parallel requests, cached server state, virtualised lists, a performance budget and RUM." Follow-up: *"Component library?"* Tokens, accessible primitives, versioned package, docs and visual tests.

### Case study: URL shortener
#### In one line
Map a long URL to a short code and redirect quickly at very high read volume.

#### Real-life analogy
A coat-check: you hand in a long coat and receive a small numbered ticket to redeem later.

#### How it works
- **Requirements**: create short link, redirect (read-heavy 100:1), optional expiry, analytics.
- **ID**: counter or Snowflake encoded in **base62** (7 chars ≈ 3.5 trillion).
- **Store**: key-value (code to url); cache hot codes in Redis; CDN for redirects.
- **Redirect**: 301 (cached, less analytics) vs 302 (trackable).
- Collisions for custom aliases: check-and-insert; abuse protection with rate limits and URL scanning.

#### Example
¦¦¦js
const A = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function toBase62(n) { let s = ''; do { s = A[n % 62] + s; n = Math.floor(n / 62); } while (n); return s; }
console.log(toBase62(125));        // "21"
console.log(toBase62(3521614606207).length); // 7
¦¦¦

#### Remember it
**Read-heavy: cache + CDN. Writes: unique IDs.** Estimate 100M links x 500 B = 50 GB.

#### Common mistakes
- Hashing and truncating without collision handling.
- Sequential codes that are guessable when privacy matters.
- No expiry or abuse controls.

#### Interview angle
Walk requirements, ID generation, storage, cache and redirect semantics. Follow-up: *"Analytics at scale?"* Emit click events to a queue and aggregate asynchronously.

### Case study: rate limiter as a service
#### In one line
A shared component that decides allow or deny for requests across many app servers, with low latency.

#### Real-life analogy
One ticket inspector with a shared clipboard for all gates, rather than each gate guessing independently.

#### How it works
- Placement: API gateway/middleware calling a limiter; keys by user, API key, IP, endpoint.
- Counters in **Redis** with atomic **Lua** script for token bucket or sliding window.
- Response: 429 and ¦Retry-After¦; headers show remaining quota.
- Failure mode: if Redis is down, **fail open** (availability) or fail closed (security) per endpoint.
- Multi-region: local limit + async sync.

#### Example
¦¦¦js
const script = ¦
local t = redis.call('INCR', KEYS[1])
if t == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
return t¦;
async function allow(key, limit, windowSec) {
  const count = await redis.eval(script, 1, 'rl:' + key, windowSec);
  return count <= limit;           // fixed window, atomic
}
¦¦¦

#### Remember it
**Atomic counters + TTL.** Decide fail-open vs fail-closed deliberately.

#### Common mistakes
- Read-modify-write race in app code.
- One global key for everyone (hot key).
- No monitoring of rejected traffic.

#### Interview angle
*"Distributed rate limiter?"* "Redis + Lua token bucket, sharded by key, local cache of denials." Follow-up: *"Accuracy vs speed?"* Allow small overshoot with local counters synced periodically.

### Case study: news / activity feed
#### In one line
Show each user a ranked stream of events from people or courses they follow, built by fan-out on write or on read.

#### Real-life analogy
A newspaper delivered to each house (fan-out on write) vs readers collecting stories from each reporter when they want (fan-out on read).

#### How it works
- **Fan-out on write**: when someone posts, push the post id into each follower's feed list (Redis). Reads are fast; writes are heavy for popular accounts.
- **Fan-out on read**: compute at read time by merging followed sources; slower reads, cheap writes.
- **Hybrid**: push for normal users, pull for celebrities; merge at read.
- Store post bodies once; feeds hold ids. Cursor pagination; ranking service optional.

#### Example
¦¦¦js
async function publish(authorId, postId) {
  const followers = await getFollowers(authorId);
  if (followers.length > 10_000) return markCelebrity(authorId);     // pull model
  await Promise.all(followers.map(f => redis.lpush('feed:' + f, postId).then(() => redis.ltrim('feed:' + f, 0, 999))));
}
¦¦¦

#### Remember it
**Push for normal, pull for celebrities, hybrid merge.** Feeds store ids, not bodies.

#### Common mistakes
- Fan-out for a user with millions of followers.
- Unbounded feed lists.
- Offset pagination on moving data.

#### Interview angle
*"Design a feed."* Compare push vs pull, then propose hybrid and discuss storage and ranking. Follow-up: *"Unfollow?"* Filter at read time or lazily clean.

### Case study: chat application
#### In one line
One-to-one and group messaging with ordered, reliably delivered messages and offline support.

#### Real-life analogy
A messenger who keeps a numbered logbook per conversation and re-delivers anything the recipient missed.

#### How it works
- **Connection**: WebSocket gateway nodes; session registry (user to node) in Redis.
- **Send flow**: client sends with a client message id; server assigns a per-conversation **sequence number**, persists, then delivers; ack back.
- **Ordering** per conversation via partition/sequence; **delivery states**: sent, delivered, read.
- **Offline**: store, push notification, sync from last seen sequence on reconnect.
- Storage: wide-column or sharded by conversation id; media in S3.
- Groups: fan-out through pub/sub; limit group size.

#### Example
¦¦¦text
client --msg(id=c1)--> gateway --> chat-service
                         |-- assign seq=42, write to DB (conversation shard)
                         |-- publish to recipients' nodes
client <--ack(c1, seq=42)--
reconnect: GET /sync?after=41 -> returns messages 42..N
¦¦¦

#### Remember it
**Sequence per conversation + client ids for dedupe + sync from last seq.**

#### Common mistakes
- Relying on timestamps for order.
- No dedupe on retries.
- Storing everything in a single table without partitioning.

#### Interview angle
*"How do you guarantee ordering?"* "A single writer per conversation assigns sequence numbers." Follow-up: *"End-to-end encryption?"* Keys on devices; the server stores ciphertext.

### Case study: Clinical learning platform
#### In one line
A platform where clinicians take courses with video, progress tracking, quizzes and certificates, designed for reliability and compliance.

#### Real-life analogy
A digital teaching hospital: courses are wards, progress is the patient chart, and certificates are signed discharge papers that must never be wrong.

#### How it works
- **Requirements**: browse and enrol, watch video, resume progress, quizzes with scoring, certificates, admin reporting; ~500k users, 99.9% availability, p95 < 300 ms.
- **Architecture**: React app on CDN, Node/Express API behind ALB, MySQL (primary + replica), Redis, S3 + CloudFront for video, SQS for async jobs.
- **Progress**: write small events; batch to the DB; learner sees read-your-writes.
- **Quizzes**: server-side scoring, attempts table, idempotent submit.
- **Certificates**: transactional issue, outbox event, async PDF generation, verification URL.
- **Observability and security**: SLOs, audit trail, PHI-safe logging, RBAC for institutions.

#### Example
¦¦¦text
Browser -> CloudFront -> ALB -> Node API
                           |-> Redis (sessions, hot catalogue, progress buffer)
                           |-> MySQL primary (+replica for reports)
                           |-> SQS -> workers (PDF, email, analytics)
Video: S3 -> MediaConvert -> CloudFront (signed URLs)
Tables: learners, courses, enrolments, progress_events, quiz_attempts, certificates, outbox
¦¦¦

#### Remember it
**Strong consistency for enrolment and certificates; eventual for dashboards.** Say this sentence in the interview.

#### Common mistakes
- Treating video like normal API traffic.
- Double-issuing certificates on retries.
- No audit trail for compliance.

#### Interview angle
This is your own project, so rehearse it as a 10-minute story with numbers and trade-offs. Follow-up: *"What would you change?"* Event-driven progress pipeline and read models for reporting.

### Case study: file storage and sync, search autocomplete
#### In one line
Two classic designs: sync files efficiently across devices using chunks, and serve instant suggestions using prefix structures and caching.

#### Real-life analogy
File sync is shipping a book by pages and only re-sending the pages that changed. Autocomplete is a phone book where you flip straight to the right letter.

#### How it works
**File sync**
- Split files into chunks (4 MB), hash each, upload only missing chunks (**dedupe**).
- Metadata service stores file version and chunk list; clients sync via a change log or notifications.
- Conflicts: last writer wins or keep both copies.

**Autocomplete**
- Trie or prefix index of popular queries with scores; store top-K per prefix.
- Cache hot prefixes; update from query logs offline; debounce on the client.

#### Example
¦¦¦js
class Trie {
  constructor() { this.next = {}; this.top = []; }
  add(word, score) {
    let n = this;
    for (const ch of word) { n = n.next[ch] ||= new Trie(); n.top.push({ word, score }); n.top.sort((a, b) => b.score - a.score); n.top.length = Math.min(n.top.length, 3); }
  }
  suggest(prefix) { let n = this; for (const ch of prefix) { n = n.next[ch]; if (!n) return []; } return n.top.map(x => x.word); }
}
const t = new Trie(); t.add('react hooks', 90); t.add('react router', 70); t.add('redux', 50);
console.log(t.suggest('rea')); // [ 'react hooks', 'react router' ]
¦¦¦

#### Remember it
**Chunk + hash for sync; trie + top-K + cache for suggestions.**

#### Common mistakes
- Re-uploading whole files.
- Computing suggestions per keystroke from the DB.
- Ignoring offensive or private query filtering.

#### Interview angle
Explain chunking and metadata for sync, and top-K prefix storage for autocomplete. Follow-up: *"Freshness of suggestions?"* Periodic rebuild plus real-time boosts for trending queries.

### Trade-off writing: ADRs, capacity plans, cost, build vs buy, migrations
#### In one line
Lead engineers decide in writing: record options, trade-offs and the decision so teams understand and can revisit it.

#### Real-life analogy
Meeting minutes for a building decision: why concrete not steel, what we gave up, who agreed, and when to review.

#### How it works
- **ADR** (Architecture Decision Record): context, options, decision, consequences, status.
- **Capacity plan**: current load, growth, headroom, cost, when to scale.
- **Build vs buy**: core differentiator and risk vs time, maintenance and lock-in.
- **Migration** with the **strangler fig**: route features gradually from old to new, with fallback.
- Cost awareness: reserved instances, right-sizing, data transfer, storage tiers.

#### Example
¦¦¦text
ADR-012: Use SQS for certificate generation
Context:  PDF generation takes 5-20 s and spikes at course deadlines.
Options:  (1) inline, (2) SQS + workers, (3) Kafka.
Decision: (2) SQS + workers; DLQ after 5 retries.
Trade-off: more moving parts; eventual delivery; chosen for simplicity and cost.
Review:   when volume exceeds 1M certificates/month.
¦¦¦

#### Remember it
**Write the why, not only the what.** State the option you rejected and what would change your mind.

#### Common mistakes
- Decisions only in chat threads.
- No owner or review date.
- Big-bang rewrites instead of incremental migration.

#### Interview angle
*"How do you make architectural decisions in your team?"* "I write short ADRs, review them with the team, and revisit when assumptions change." Follow-up: *"Legacy migration?"* Strangler fig with feature flags and measurable milestones.
`;
