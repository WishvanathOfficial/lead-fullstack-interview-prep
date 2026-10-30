window.PREP = window.PREP || {};
window.PREP.node = String.raw`
@title Node.js and Express
@icon hex
@tagline Build and defend production REST APIs: event loop, Express architecture, authentication, security, scaling and reliability.
@resume Node.js/Express REST APIs for the Clinical Learning Hub | API response times improved 30–40% | API integration across products | Backend API design

## ROADMAP

### Phase 1 · Foundations (Basic)
- What Node.js is: V8 + libuv, single-threaded event loop, non-blocking I/O :: Explain why it is great for I/O-heavy APIs and weak for CPU-bound work.
- Modules and npm: CommonJS vs ESM, package.json, scripts, semver (^ and ~), lockfiles :: Know dependencies vs devDependencies and why you commit the lockfile.
- Core modules: fs/promises, path, os, http, events, stream, buffer, crypto, url, util :: Write a script that reads a file, hashes it and writes the result.
- Async patterns: callbacks, promises, async/await, util.promisify, error-first style :: Convert callback code to async/await.
- Express basics: routing, middleware, req/res, express.json, static files :: Build a small CRUD API from scratch.
- REST API design: resources, HTTP verbs, status codes, idempotency, filtering, pagination, versioning :: Be able to design endpoints for a learning platform.
- Configuration: environment variables, dotenv or --env-file, 12-factor config :: Never commit secrets; validate env at startup.
- Error handling: sync vs async errors, Express error middleware, custom error classes :: One central place maps errors to HTTP responses.
- Tooling: node --watch, nodemon, ESLint, Prettier, debugging with --inspect :: Show how you debug a failing request.

### Phase 2 · Production APIs (Intermediate)
- Event loop in depth and the libuv thread pool :: Know what blocks the loop (sync crypto, JSON.parse of huge bodies, regex backtracking).
- Streams, buffers, backpressure, pipeline :: Process big files without loading them into memory.
- Project architecture: routes → controllers → services → repositories :: Keep business logic out of route handlers.
- Validation and DTOs: zod, Joi, express-validator :: Validate every input at the edge.
- Authentication and authorisation: sessions vs JWT, password hashing, refresh tokens, RBAC, OAuth2/OIDC basics :: Explain token storage and revocation trade-offs.
- Security: helmet, CORS, rate limiting, SQL injection, XSS, CSRF, secrets, npm audit :: Walk through an OWASP-style checklist.
- Databases from Node: pooling, transactions, migrations, N+1 avoidance :: See the Database subject for MySQL and Sequelize.
- Caching: in-memory, Redis, cache-aside, HTTP cache headers and ETag :: Know invalidation strategies.
- File handling: multer, streaming uploads, S3 pre-signed URLs :: Avoid buffering large uploads in memory.
- Logging and monitoring: pino/winston, request IDs, health checks, metrics :: Make logs searchable and correlated.
- Testing: Vitest/Jest, Supertest, mocks, test database :: Test routes, services and error paths.
- API documentation: OpenAPI/Swagger, Postman collections :: Contract first helps frontend and QA.
- Background work: queues (BullMQ, SQS), cron jobs, retries :: Do not do slow work inside the request.

### Phase 3 · Scale and architecture (Lead level)
- Scaling: stateless services, cluster, worker_threads, PM2, containers behind a load balancer :: Explain horizontal vs vertical scaling and session handling.
- Performance diagnosis: clinic.js, --cpu-prof, heap snapshots, event-loop lag, p95/p99 latency :: Describe how you found and fixed a slow endpoint.
- Architecture styles: layered, hexagonal, modular monolith, microservices :: Choose with team size and domain boundaries in mind.
- Event-driven systems: SNS/SQS, Kafka basics, at-least-once delivery, outbox pattern, sagas :: Make consumers idempotent.
- Real-time: WebSockets, Socket.IO, Server-Sent Events :: Know when polling is enough.
- Reliability patterns: timeouts, retries with backoff, circuit breaker, graceful shutdown, health and readiness probes :: Prevent cascading failures.
- Observability: structured logs, metrics, distributed tracing (OpenTelemetry) :: Trace a request across services.
- Alternatives: Fastify, NestJS, GraphQL, tRPC, BFF pattern :: Know trade-offs; do not be dogmatic.
- Modern Node features: built-in fetch, node:test, --watch, --env-file, ESM, top-level await, Web Streams, permission model :: Use the current LTS and mention features you adopted.
- Compliance and data protection for healthcare: encryption, audit logs, least privilege, PII handling :: Relevant to your Clinical Learning Hub work.

## QA

### [basic] What is Node.js? It is single-threaded, so how does it handle many requests?
Node.js is a JavaScript runtime built on V8 with libuv, which provides the event loop and asynchronous I/O. Your JavaScript runs on **one thread**, but network and file I/O are handed to the OS or libuv's thread pool and completion callbacks are queued. While one request waits for the database, the loop serves others. It excels at I/O-bound work (APIs, proxies, real-time) and struggles with CPU-bound work (image processing, heavy loops) unless you use worker threads or separate services.

### [basic] Explain the Node.js event loop phases.
Each loop iteration goes through: **timers** (¦setTimeout¦, ¦setInterval¦ callbacks), **pending callbacks**, **poll** (retrieve I/O events and run their callbacks), **check** (¦setImmediate¦), **close callbacks**. Between each operation Node drains ¦process.nextTick¦ first and then Promise microtasks. A long synchronous operation in any callback blocks every other request, so keep handlers short and offload heavy work.

### [basic] CommonJS vs ES modules in Node. What is the require cache?
CommonJS uses ¦require()¦ / ¦module.exports¦, synchronous and dynamic. ESM uses ¦import¦ / ¦export¦, asynchronous, static analysis, top-level await. Enable ESM with ¦"type": "module"¦ in ¦package.json¦ or ¦.mjs¦. ¦require¦ caches each module after first load in ¦require.cache¦, so a module runs once and later imports share the same object (singleton behaviour for DB clients and config). In ESM you do not have ¦__dirname¦; use ¦import.meta.dirname¦ (newer Node) or ¦fileURLToPath(import.meta.url)¦.

### [basic] package.json, semver and lockfiles.
¦dependencies¦ are needed at runtime; ¦devDependencies¦ for build/test tools. Versions follow MAJOR.MINOR.PATCH. ¦^1.2.3¦ allows minor and patch updates, ¦~1.2.3¦ only patch updates. The lockfile (¦package-lock.json¦, ¦pnpm-lock.yaml¦) pins the exact tree for reproducible installs: commit it and use ¦npm ci¦ in CI. Run ¦npm audit¦ and update dependencies regularly.

### [basic] What is middleware in Express? Does order matter?
Middleware is a function ¦(req, res, next)¦ that can read or change the request/response, end the cycle, or call ¦next()¦. Order matters because Express runs them in the order registered. Typical order: logging → security headers → CORS → body parsers → routes → 404 handler → **error handler** (four arguments, registered last).

¦¦¦js
app.use(express.json());
app.use((req, res, next) => { console.log(req.method, req.url); next(); });
app.get('/health', (req, res) => res.json({ ok: true }));
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, next) => res.status(err.status || 500).json({ error: err.message }));
¦¦¦

### [basic] REST basics: methods, idempotency and status codes.
| Method | Use | Idempotent |
|---|---|---|
| GET | Read | Yes |
| POST | Create / actions | No |
| PUT | Replace | Yes |
| PATCH | Partial update | Usually |
| DELETE | Remove | Yes |

Common codes: 200 OK, 201 Created (with ¦Location¦), 204 No Content, 400 invalid input, 401 not authenticated, 403 not allowed, 404 not found, 409 conflict, 422 validation failure, 429 too many requests, 500 server error, 503 unavailable. Use nouns for resources (¦/courses/12/lessons¦), not verbs.

### [basic] req.params vs req.query vs req.body.
¦req.params¦ are route segments (¦/courses/:id¦). ¦req.query¦ is the query string (¦?page=2&sort=title¦), used for filtering, sorting, pagination. ¦req.body¦ is the payload (needs ¦express.json()¦). All three are strings or untrusted JSON, so validate and convert types.

### [basic] How do you handle errors in Express, including async code?
Create an error class with a status, throw it in services, and use one error-handling middleware to turn errors into responses. In **Express 5**, rejected promises from route handlers are forwarded to the error handler automatically. In Express 4 you must wrap handlers (¦catch(next)¦ or a helper).

¦¦¦js
class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) throw new HttpError(404, 'Course not found');
  res.json(course);
}));
¦¦¦
Also handle ¦unhandledRejection¦ / ¦uncaughtException¦ by logging and exiting so the process manager restarts a clean process.

### [basic] How should configuration and secrets be managed?
Follow 12-factor: configuration comes from environment variables, not code. Locally use ¦.env¦ (gitignored) or ¦node --env-file¦; in production use the platform's secret store (AWS Secrets Manager / Parameter Store). Validate variables at startup so the app fails fast, and never log secrets.

¦¦¦js
const Env = z.object({ PORT: z.coerce.number().default(3000), DATABASE_URL: z.string().url(), JWT_SECRET: z.string().min(32) });
export const env = Env.parse(process.env);
¦¦¦

### [basic] What are streams and why do they matter?
Streams process data in chunks instead of loading it all in memory. Types: Readable, Writable, Duplex, Transform. Use them for large files, HTTP responses, compression and data pipelines. ¦pipeline¦ connects them and handles errors and cleanup.

¦¦¦js
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';
await pipeline(createReadStream('big.log'), createGzip(), createWriteStream('big.log.gz'));
¦¦¦

### [intermediate] What is backpressure?
If a producer writes faster than a consumer can handle, memory grows. ¦writable.write()¦ returns ¦false¦ when its buffer is full; the producer should pause until the ¦'drain'¦ event. ¦pipe¦ and ¦pipeline¦ handle this for you, which is why you should prefer them to manual ¦data¦ handlers.

### [intermediate] JWT vs session authentication. Where should tokens be stored?
**Sessions**: server stores state (memory/Redis) and sends an opaque ID cookie; easy revocation, needs shared store when scaling. **JWT**: signed token carrying claims, stateless verification, hard to revoke before expiry. A common secure setup: short-lived access token (5–15 min) + rotating refresh token stored in an **HttpOnly, Secure, SameSite** cookie, with refresh tokens saved server-side so you can revoke them. Avoid ¦localStorage¦ for tokens because XSS can steal them. Always verify the algorithm, expiry, issuer and audience.

### [intermediate] How do you store passwords?
Never store plain or fast-hashed passwords. Use a slow adaptive hash with a unique salt: **argon2id** (preferred) or **bcrypt** with a sensible cost factor. Compare with the library's constant-time ¦compare¦. Add rate limiting and lockout for logins, enforce minimum strength rules, and support MFA for sensitive roles.

### [intermediate] What is CORS and what is a preflight request?
Browsers block cross-origin requests unless the server allows them. A "simple" request is sent directly; others (custom headers, JSON content type, PUT/DELETE) first send an ¦OPTIONS¦ **preflight** asking permission. The server answers with ¦Access-Control-Allow-Origin¦, ¦-Methods¦ and ¦-Headers¦. Configure an explicit allow-list of origins, not ¦*¦ with credentials. CORS protects browsers; it is not authentication and does not stop curl or server-to-server calls.

### [intermediate] What security measures do you add to an Express API?
- ¦helmet¦ for security headers; HTTPS everywhere and HSTS.
- Input validation and output encoding; parameterised queries or ORM (no string concatenation) against SQL injection.
- Rate limiting and brute-force protection; request size limits.
- Authentication, role/permission checks on **every** route, object-level checks (can this user see this record?).
- CORS allow-list, CSRF protection when using cookies, secure cookie flags.
- Secrets in a vault, dependency audits, pinned lockfile, least-privilege DB user.
- Safe error messages (no stack traces to clients) and audit logs for sensitive actions.

### [intermediate] How do you structure a Node/Express project?
¦¦¦text
src/
  config/          env + constants
  modules/
    courses/
      course.routes.js       HTTP wiring only
      course.controller.js   parse request, call service, shape response
      course.service.js      business rules
      course.repository.js   database access (Sequelize)
      course.schema.js       validation (zod)
  middleware/      auth, error, validate, requestContext
  lib/             logger, db, cache
  app.js           create express app
  server.js        listen + graceful shutdown
¦¦¦
Benefits: testable services, replaceable data layer, clear ownership by feature. Keep ¦app.js¦ separate from ¦server.js¦ so Supertest can import the app without opening a port.

### [intermediate] How do you validate request data?
Validate at the edge with a schema library, return ¦400/422¦ with field-level messages, and pass the parsed (trusted) object to services.

¦¦¦js
const validate = schema => (req, res, next) => {
  const parsed = schema.safeParse({ body: req.body, query: req.query, params: req.params });
  if (!parsed.success) return res.status(422).json({ errors: parsed.error.flatten().fieldErrors });
  Object.assign(req, parsed.data);
  next();
};
¦¦¦

### [intermediate] Offset vs cursor pagination.
Offset (¦LIMIT 20 OFFSET 4000¦) is simple and supports page numbers but gets slower with large offsets and can skip or duplicate rows when data changes. Cursor (keyset) pagination uses the last seen key (¦WHERE id > ? ORDER BY id LIMIT 20¦), stays fast with an index and is stable for feeds and infinite scroll. Return ¦nextCursor¦ and a ¦hasMore¦ flag; cap ¦limit¦ on the server.

### [intermediate] How do you make POST requests safe to retry (idempotency)?
Clients retry on timeouts, which can create duplicates (double payment, double enrolment). Require an ¦Idempotency-Key¦ header; the server stores the key with the response (or a lock for in-flight requests) and returns the stored result on repeats. Combine with a database unique constraint on a natural key as the final safety net.

### [intermediate] How would you implement rate limiting?
Choose a key (IP, user id, API key) and an algorithm: fixed window (simple), sliding window, token bucket (allows bursts). In one process an in-memory Map works; with multiple instances use a shared store such as Redis (¦express-rate-limit¦ with a Redis store, or atomic Lua scripts). Return ¦429¦ with ¦Retry-After¦ and rate-limit headers. Put coarse limits at the API gateway/WAF and finer limits per route (login, password reset).

### [intermediate] How does caching work for an API? What is cache-aside?
Layers: browser/CDN via HTTP headers (¦Cache-Control¦, ¦ETag¦, ¦304¦), application cache in Redis, database caches. **Cache-aside**: read cache first; on miss load from the database, store with a TTL and return. On writes, update the database then delete (or update) the cache key. Hard parts: invalidation, stampedes (many misses at once; use locks or request coalescing), and stale data tolerance per endpoint.

### [intermediate] How do you handle logging, request tracing and health checks?
Use structured JSON logs (pino) with level, timestamp, request id, user id and duration. Generate or accept an ¦X-Request-Id¦ and attach it to every log line (AsyncLocalStorage). Expose ¦/health¦ (liveness) and ¦/ready¦ (dependencies reachable) for load balancers and orchestrators. Never log passwords, tokens or personal health data. Ship logs to a central system (CloudWatch, ELK, Datadog).

### [intermediate] How do you test an Express API?
Export the ¦app¦ separately from the server and use **Supertest** to call it in-process. Unit-test services with mocked repositories; integration-test routes against a real test database (Docker) and reset data between tests. Test error paths (400, 401, 403, 404, 409), auth, and pagination. Run in CI before merge.

¦¦¦js
import request from 'supertest';
import { app } from '../src/app.js';

test('creates a course', async () => {
  const res = await request(app).post('/courses').send({ title: 'Safety 101', hours: 2 }).expect(201);
  expect(res.body.id).toBeDefined();
});
¦¦¦

### [intermediate] How do you handle large file uploads?
Do not buffer files in memory. Stream to disk or, better, let the client upload directly to S3 using a **pre-signed URL** your API creates after checking permissions; then store the object key and metadata. Validate type and size limits, scan for malware if needed, and process in a background job.

### [intermediate] cluster vs worker_threads vs child_process.
- **cluster**: several Node processes sharing a port, use all CPU cores for request handling (in containers prefer one process per container and scale containers).
- **worker_threads**: threads inside one process with message passing and shared memory, for CPU-heavy tasks (image resize, parsing).
- **child_process**: spawn separate programs or scripts (ffmpeg, Python).
Pick worker threads for CPU work you must keep in Node; otherwise a queue plus separate worker service is easier to scale.

### [intermediate] What is graceful shutdown and why does it matter?
On deploys the platform sends ¦SIGTERM¦. A graceful server stops accepting new connections, finishes in-flight requests, closes DB pools and queues, then exits, avoiding dropped requests and half-finished writes. Set a hard timeout so a stuck connection cannot block the exit.

### [intermediate] WebSockets vs Server-Sent Events vs polling.
**Polling** is simplest and works everywhere but wastes requests. **SSE** is one-way server→client over HTTP with automatic reconnect; ideal for notifications and progress. **WebSockets** are full duplex for chat, collaboration and live dashboards but need sticky routing or a pub/sub backplane (Redis) when scaled across instances.

### [advanced] How do you scale a Node.js API horizontally?
Make instances **stateless**: no sessions or files in memory or local disk; use Redis for sessions/cache and S3 for files. Run multiple containers or instances behind a load balancer with health checks and autoscaling on CPU or latency. Share nothing between requests, use connection pooling with limits so instances do not overwhelm the database, and add read replicas or caching when the database becomes the bottleneck. Sticky sessions are only needed for stateful protocols such as WebSockets without a shared backplane.

### [advanced] The API is slow in production. How do you diagnose it?
1. Check metrics: p50/p95/p99 latency, error rate, CPU, memory, event-loop lag, DB query time.
2. Find the slow endpoint with tracing or access logs.
3. Look inside: slow queries (¦EXPLAIN¦, slow query log), N+1 queries, missing indexes, sync CPU work, large payloads, no pooling, external API latency.
4. Profile with ¦clinic.js¦ or ¦node --cpu-prof¦; take heap snapshots for memory growth.
5. Fix the biggest cost first (index, query rewrite, cache, pagination, compression), then load-test to prove it.
Relate this to your resume: query optimisation and caching gave the 30–40% faster responses.

### [advanced] Monolith, modular monolith or microservices?
Start with a **modular monolith**: one deployable with strict module boundaries. Move to microservices only when independent scaling, team autonomy or different tech needs justify the costs: network failures, distributed transactions, versioning, observability and deployment complexity. Prefer events or async messaging between services, own your data per service, and keep contracts versioned.

### [advanced] How do you keep data consistent across services? (outbox and saga)
Avoid distributed transactions. **Outbox**: write business data and an "event" row in the same local transaction; a relay publishes events to the broker, so no event is lost. **Saga**: a sequence of local transactions with compensating actions if a step fails (reserve → pay → confirm; undo on failure). Consumers must be **idempotent** because brokers deliver at-least-once.

### [advanced] How do you design background jobs and queues?
Put slow or unreliable work (emails, reports, imports, third-party calls) on a queue (BullMQ/Redis, SQS). The API enqueues and returns ¦202 Accepted¦ with a job id. Workers process with retries, exponential backoff, a dead-letter queue, concurrency limits and idempotent handlers. Provide a status endpoint or webhook, and monitor queue depth and failures.

### [advanced] Reliability patterns: timeouts, retries, circuit breaker.
Always set timeouts on outgoing calls. Retry only idempotent or safe operations with backoff and jitter. A **circuit breaker** (e.g. ¦opossum¦) stops calling a failing dependency after a threshold, returns a fallback or error quickly, and tests recovery periodically. Use **bulkheads** (separate pools) so one slow dependency cannot exhaust all resources.

### [advanced] What are common JWT and API security mistakes?
Accepting unsigned or weak algorithms, not verifying ¦exp¦/¦iss¦/¦aud¦, long-lived tokens with no revocation plan, storing tokens in ¦localStorage¦, putting sensitive data in the payload (it is only encoded), missing object-level authorisation (IDOR/BOLA), mass assignment (accepting any body field), verbose errors, and no rate limiting. Use the OWASP API Security Top 10 as a checklist.

### [advanced] How do you handle database transactions in Node services?
Wrap multi-step writes in one transaction so they commit or roll back together, pass the transaction object through the service/repository calls, keep transactions short, and never call external APIs inside them. Handle deadlocks and serialization failures with a retry. See the Database subject for Sequelize managed transactions and isolation levels.

### [advanced] What modern Node features should a senior developer know?
Use the current **LTS** release. Features worth mentioning: built-in ¦fetch¦ and ¦AbortSignal.timeout¦, ¦node:test¦ test runner, ¦--watch¦ and ¦--env-file¦, ESM with top-level await, Web Streams, ¦structuredClone¦, ¦AsyncLocalStorage¦, the experimental permission model, and stronger built-in performance tooling. Say what you actually adopted and why, not a feature list.

## EXERCISES

### [basic] Build a CRUD API for courses with validation
Create ¦POST /courses¦, ¦GET /courses/:id¦, ¦PUT /courses/:id¦, ¦DELETE /courses/:id¦ using Express and an in-memory Map. Validate input, return correct status codes and have one error handler.
--- solution ---
¦¦¦js
import express from 'express';
import { z } from 'zod';

const app = express();
app.use(express.json());

const courses = new Map();
let seq = 1;
const Body = z.object({ title: z.string().min(1), hours: z.number().positive() });

const validate = schema => (req, res, next) => {
  const r = schema.safeParse(req.body);
  if (!r.success) return res.status(422).json({ errors: r.error.flatten().fieldErrors });
  req.body = r.data;
  next();
};
const find = (req, res) => {
  const c = courses.get(Number(req.params.id));
  if (!c) res.status(404).json({ error: 'Course not found' });
  return c;
};

app.post('/courses', validate(Body), (req, res) => {
  const course = { id: seq++, ...req.body };
  courses.set(course.id, course);
  res.status(201).location('/courses/' + course.id).json(course);
});
app.get('/courses/:id', (req, res) => { const c = find(req, res); if (c) res.json(c); });
app.put('/courses/:id', validate(Body), (req, res) => {
  const c = find(req, res); if (!c) return;
  const updated = { id: c.id, ...req.body };
  courses.set(c.id, updated);
  res.json(updated);
});
app.delete('/courses/:id', (req, res) => { const c = find(req, res); if (!c) return; courses.delete(c.id); res.status(204).end(); });

app.use((err, req, res, next) => { console.error(err); res.status(500).json({ error: 'Internal server error' }); });
export { app };
¦¦¦
Discuss next steps: replace the Map with a repository over MySQL, add auth, pagination and tests.

### [basic] Count lines in a huge file without loading it into memory
Write ¦countLines(path)¦ for a multi-gigabyte log file.
--- solution ---
¦¦¦js
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

export async function countLines(file) {
  const rl = createInterface({ input: createReadStream(file), crlfDelay: Infinity });
  let n = 0;
  for await (const _line of rl) n++;
  return n;
}
¦¦¦
Streams read the file in small chunks, so memory use stays flat. ¦readFile¦ would load the whole file and could crash the process.

### [intermediate] Auth middleware with roles
Write ¦auth¦ middleware that verifies a Bearer JWT and ¦requireRole(...roles)¦ that returns ¦403¦ if the user's role is not allowed.
--- solution ---
¦¦¦js
import jwt from 'jsonwebtoken';

export function auth(req, res, next) {
  const header = req.get('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export const requireRole = (...roles) => (req, res, next) =>
  roles.includes(req.user?.role) ? next() : res.status(403).json({ error: 'Forbidden' });

app.delete('/courses/:id', auth, requireRole('admin'), removeCourse);
¦¦¦
401 means "who are you?", 403 means "I know you, but no". Add object-level checks inside handlers (does this user own the record?).

### [intermediate] Fixed-window rate limiter
Implement an in-memory limiter: 100 requests per minute per IP, with ¦429¦, ¦Retry-After¦ and remaining headers.
--- solution ---
¦¦¦js
function rateLimit({ windowMs = 60_000, max = 100 } = {}) {
  const hits = new Map();
  const cleaner = setInterval(() => {
    const now = Date.now();
    for (const [key, v] of hits) if (v.reset <= now) hits.delete(key);
  }, windowMs);
  cleaner.unref?.();   // let Node exit even if the timer is pending

  return (req, res, next) => {
    const now = Date.now();
    let e = hits.get(req.ip);
    if (!e || e.reset <= now) { e = { count: 0, reset: now + windowMs }; hits.set(req.ip, e); }
    e.count++;
    res.set({ 'X-RateLimit-Limit': max, 'X-RateLimit-Remaining': Math.max(0, max - e.count) });
    if (e.count > max) {
      res.set('Retry-After', Math.ceil((e.reset - now) / 1000));
      return res.status(429).json({ error: 'Too many requests' });
    }
    next();
  };
}
¦¦¦
Limits to mention: counts are per process, so use Redis for multiple instances; fixed windows allow bursts at the boundary (use sliding window or token bucket for fairness); behind a proxy configure ¦trust proxy¦ so ¦req.ip¦ is correct.
--- starter ---
¦¦¦js
function rateLimit({ windowMs = 60_000, max = 100 } = {}) {
  // your code here: return an Express-style middleware (req, res, next)
}
¦¦¦
--- tests ---
¦¦¦js
const wait = ms => new Promise(r => setTimeout(r, ms));
function fakeRes() {
  const res = { headers: {}, statusCode: 200, body: undefined };
  res.set = (k, v) => { if (typeof k === 'object') Object.assign(res.headers, k); else res.headers[k] = v; return res; };
  res.status = c => { res.statusCode = c; return res; };
  res.json = b => { res.body = b; return res; };
  return res;
}
function hit(mw, ip) {
  const res = fakeRes();
  let passed = false;
  mw({ ip }, res, () => { passed = true; });
  return { res, passed };
}

test('lets requests through while under the limit', () => {
  const mw = rateLimit({ windowMs: 1000, max: 3 });
  for (let i = 0; i < 3; i++) eq(hit(mw, '1.1.1.1').passed, true, 'request ' + (i + 1));
});
test('blocks the request after the limit with 429', () => {
  const mw = rateLimit({ windowMs: 1000, max: 2 });
  hit(mw, '2.2.2.2'); hit(mw, '2.2.2.2');
  const r = hit(mw, '2.2.2.2');
  eq(r.passed, false);
  eq(r.res.statusCode, 429);
  ok(r.res.body && r.res.body.error, 'send a JSON error body');
});
test('sets X-RateLimit-Limit and X-RateLimit-Remaining', () => {
  const mw = rateLimit({ windowMs: 1000, max: 5 });
  const r = hit(mw, '3.3.3.3');
  eq(Number(r.res.headers['X-RateLimit-Limit']), 5);
  eq(Number(r.res.headers['X-RateLimit-Remaining']), 4);
});
test('sets Retry-After (seconds) when blocking', () => {
  const mw = rateLimit({ windowMs: 5000, max: 1 });
  hit(mw, '4.4.4.4');
  const r = hit(mw, '4.4.4.4');
  const ra = Number(r.res.headers['Retry-After']);
  ok(ra >= 1 && ra <= 5, 'Retry-After should be between 1 and 5 seconds, got ' + ra);
});
test('counts each IP separately', () => {
  const mw = rateLimit({ windowMs: 1000, max: 1 });
  eq(hit(mw, '5.5.5.5').passed, true);
  eq(hit(mw, '6.6.6.6').passed, true);
  eq(hit(mw, '5.5.5.5').passed, false);
});
test('allows requests again after the window resets', async () => {
  const mw = rateLimit({ windowMs: 60, max: 1 });
  hit(mw, '7.7.7.7');
  eq(hit(mw, '7.7.7.7').passed, false);
  await wait(90);
  eq(hit(mw, '7.7.7.7').passed, true);
});
¦¦¦

### [intermediate] Cursor-based pagination endpoint
Implement ¦GET /courses?limit=20&cursor=120¦ with Sequelize returning ¦items¦ and ¦nextCursor¦.
--- solution ---
¦¦¦js
import { Op } from 'sequelize';

app.get('/courses', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const cursor = Number(req.query.cursor) || 0;

  const rows = await Course.findAll({
    where: { id: { [Op.gt]: cursor } },
    order: [['id', 'ASC']],
    limit: limit + 1,           // fetch one extra to know if more exist
  });

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  res.json({ items, nextCursor: hasMore ? items[items.length - 1].id : null });
});
¦¦¦
For sorting by a non-unique column (such as ¦createdAt¦) use a compound cursor (¦createdAt, id¦) to keep ordering stable.

### [intermediate] Request-id logging with AsyncLocalStorage
Attach a request id to every log line without passing it through function arguments.
--- solution ---
¦¦¦js
import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';

const als = new AsyncLocalStorage();

export function requestContext(req, res, next) {
  const id = req.get('x-request-id') || randomUUID();
  res.set('x-request-id', id);
  als.run({ id }, next);
}

export function log(msg, extra = {}) {
  console.log(JSON.stringify({ time: new Date().toISOString(), reqId: als.getStore()?.id, msg, ...extra }));
}
¦¦¦
Any code called during the request, including database helpers and services, can call ¦log()¦ and the id follows async boundaries.

### [advanced] Idempotency-Key middleware
For ¦POST /enrolments¦, if the same ¦Idempotency-Key¦ is sent twice, return the first response instead of creating a duplicate.
> Hint: Store the response by key, and think about two requests with the same key arriving at the same time.
--- solution ---
¦¦¦js
const store = new Map(); // production: Redis with TTL

function idempotency(req, res, next) {
  const key = req.get('Idempotency-Key');
  if (!key) return res.status(400).json({ error: 'Idempotency-Key header required' });

  const entry = store.get(key);
  if (entry?.done) return res.status(entry.status).json(entry.body);
  if (entry && !entry.done) return res.status(409).json({ error: 'Request in progress' });

  store.set(key, { done: false });
  const json = res.json.bind(res);
  res.json = body => {
    store.set(key, { done: true, status: res.statusCode, body });
    return json(body);
  };
  next();
}
¦¦¦
In production store keys in Redis with ¦SET key value NX EX 86400¦ for the lock, scope the key by user, and also enforce a unique constraint in the database as the last line of defence.
--- starter ---
¦¦¦js
const store = new Map(); // production: Redis with TTL

function idempotency(req, res, next) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
function fakeReq(key) {
  return { get: name => (name.toLowerCase() === 'idempotency-key' ? key : undefined) };
}
function fakeRes() {
  const res = { statusCode: 200, body: undefined };
  res.status = c => { res.statusCode = c; return res; };
  res.json = b => { res.body = b; return res; };
  return res;
}
// runs the middleware, then (if it called next) a handler that creates the resource
function call(key, handler) {
  const res = fakeRes();
  let passed = false;
  idempotency(fakeReq(key), res, () => { passed = true; if (handler) handler(res); });
  return { res, passed };
}

test('rejects requests without an Idempotency-Key header', () => {
  const r = call(undefined);
  eq(r.res.statusCode, 400);
  eq(r.passed, false);
});
test('first request with a new key reaches the handler', () => {
  const r = call('k-new', res => res.status(201).json({ id: 1 }));
  eq(r.passed, true);
  eq(r.res.statusCode, 201);
});
test('replays the stored response for the same key', () => {
  call('k-replay', res => res.status(201).json({ id: 42 }));
  const second = call('k-replay', res => res.status(201).json({ id: 43 }));
  eq(second.passed, false, 'handler must not run twice');
  eq(second.res.statusCode, 201);
  eq(second.res.body, { id: 42 });
});
test('a different key is treated as a new request', () => {
  call('k-a', res => res.status(201).json({ id: 1 }));
  const r = call('k-b', res => res.status(201).json({ id: 2 }));
  eq(r.passed, true);
  eq(r.res.body, { id: 2 });
});
test('returns 409 while the first request is still in progress', () => {
  call('k-busy');                       // handler never finishes
  const r = call('k-busy');
  eq(r.res.statusCode, 409);
  eq(r.passed, false);
});
test('stores error-free status codes too (replays a 200)', () => {
  call('k-200', res => res.json({ ok: true }));
  const r = call('k-200');
  eq(r.res.statusCode, 200);
  eq(r.res.body, { ok: true });
});
¦¦¦

### [advanced] Graceful shutdown for HTTP server and database pool
Handle ¦SIGTERM¦ and ¦SIGINT¦: stop accepting connections, finish in-flight requests, close the DB pool, exit within 10 seconds.
--- solution ---
¦¦¦js
const server = app.listen(env.PORT);
let closing = false;

async function shutdown(signal) {
  if (closing) return;
  closing = true;
  console.log(signal + ' received, shutting down');

  const timer = setTimeout(() => { console.error('Forced exit'); process.exit(1); }, 10_000);
  timer.unref();

  server.close(async err => {
    try { await sequelize.close(); } catch (e) { console.error(e); }
    process.exit(err ? 1 : 0);
  });
  server.closeIdleConnections?.();   // free keep-alive sockets (Node 18.2+)
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
¦¦¦
Also make the readiness endpoint return ¦503¦ once shutdown starts so the load balancer stops sending traffic.

### [advanced] Concurrency-limited job runner with retries
Write ¦runJobs(jobs, { concurrency, retries })¦ where each job is an async function. Retry failed jobs and return all results with status.
--- solution ---
¦¦¦js
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function runJobs(jobs, { concurrency = 4, retries = 2 } = {}) {
  const results = new Array(jobs.length);
  let next = 0;

  async function runOne(i) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try { return { status: 'ok', value: await jobs[i]() }; }
      catch (error) {
        if (attempt === retries) return { status: 'failed', error: String(error) };
        await sleep(200 * 2 ** attempt);
      }
    }
  }
  async function worker() {
    while (next < jobs.length) { const i = next++; results[i] = await runOne(i); }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, jobs.length) }, worker));
  return results;
}
¦¦¦
Production version: use BullMQ or SQS so jobs survive restarts, add a dead-letter queue and idempotent handlers.
--- starter ---
¦¦¦js
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function runJobs(jobs, { concurrency = 4, retries = 2 } = {}) {
  // your code here: run at most ¦concurrency¦ jobs at once,
  // retry a failed job up to ¦retries¦ times, keep results in input order
}
¦¦¦
--- tests ---
¦¦¦js
const delay = (ms, v) => new Promise(r => setTimeout(() => r(v), ms));

test('returns results in the same order as the jobs', async () => {
  const out = await runJobs([() => delay(40, 'a'), () => delay(5, 'b'), () => delay(20, 'c')], { concurrency: 3 });
  eq(out, [{ status: 'ok', value: 'a' }, { status: 'ok', value: 'b' }, { status: 'ok', value: 'c' }]);
});
test('handles an empty job list', async () => {
  eq(await runJobs([]), []);
});
test('never runs more than ¦concurrency¦ jobs at the same time', async () => {
  let active = 0, peak = 0;
  const job = () => async () => { active++; peak = Math.max(peak, active); await delay(25); active--; return 1; };
  await runJobs(Array.from({ length: 7 }, job), { concurrency: 2 });
  eq(peak, 2);
});
test('actually runs jobs in parallel', async () => {
  const t0 = Date.now();
  await runJobs(Array.from({ length: 4 }, () => () => delay(60)), { concurrency: 4 });
  ok(Date.now() - t0 < 200, 'four 60ms jobs with concurrency 4 should take about 60ms');
});
test('retries a failing job and returns ok once it succeeds', async () => {
  let calls = 0;
  const flaky = async () => { calls++; if (calls < 2) throw new Error('boom'); return 'fine'; };
  const out = await runJobs([flaky], { concurrency: 1, retries: 2 });
  eq(out, [{ status: 'ok', value: 'fine' }]);
  eq(calls, 2);
});
test('marks a job failed after all retries are used', async () => {
  let calls = 0;
  const bad = async () => { calls++; throw new Error('nope'); };
  const out = await runJobs([bad], { concurrency: 1, retries: 1 });
  eq(out[0].status, 'failed');
  ok(String(out[0].error).includes('nope'), 'error should mention the original message');
  eq(calls, 2, 'one try plus one retry');
});
test('one failing job does not stop the others', async () => {
  const out = await runJobs([async () => 1, async () => { throw new Error('x'); }, async () => 3], { concurrency: 2, retries: 0 });
  eq(out.map(r => r.status), ['ok', 'failed', 'ok']);
});
¦¦¦

### [advanced] Transform stream with pipeline
Read a large text file, uppercase every line and write the output using ¦pipeline¦, safely handling multi-byte characters.
--- solution ---
¦¦¦js
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { Transform } from 'node:stream';
import { StringDecoder } from 'node:string_decoder';

const upper = new Transform({
  construct(cb) { this.decoder = new StringDecoder('utf8'); cb(); },
  transform(chunk, _enc, cb) { cb(null, this.decoder.write(chunk).toUpperCase()); },
  flush(cb) { cb(null, this.decoder.end().toUpperCase()); },
});

await pipeline(createReadStream('in.txt'), upper, createWriteStream('out.txt'));
¦¦¦
¦StringDecoder¦ avoids breaking a multi-byte character that is split across two chunks. ¦pipeline¦ handles backpressure and destroys all streams on error.

## SCENARIOS

### Design the REST API for course enrolments in the Clinical Learning Hub.
Resources: ¦/courses¦, ¦/courses/:id/lessons¦, ¦/users/:id/enrolments¦, ¦/enrolments/:id/progress¦. Use ¦POST /enrolments¦ (201 + Location, idempotency key), ¦GET¦ with cursor pagination, filtering (¦status¦, ¦courseId¦) and sorting, ¦PATCH /enrolments/:id/progress¦ for partial updates. Auth with short-lived JWT + roles (learner, instructor, admin) and object-level checks so a learner only sees their own records. Validate with zod, version at ¦/v1¦, document with OpenAPI, return consistent error bodies, add rate limiting and audit logs for admin actions.

### Describe how you improved API response time by 30–40%. What exactly did you do?
Structure: baseline measurement (p95 latency per endpoint) → find the top slow endpoints → inspect SQL (¦EXPLAIN¦), find N+1 queries and missing indexes → fix with eager loading or joins, composite indexes, selecting only needed columns, pagination → add caching for read-heavy reference data → compress responses → re-measure. Quote your real numbers and one concrete example, and mention a regression test or dashboard that kept it from drifting back.

### In production the Node process memory grows until it crashes. How do you handle it?
Short term: restart policy and an alert so users are not affected. Investigate: compare heap snapshots (¦--inspect¦, Chrome DevTools or ¦heapdump¦), look at retained objects (growing Maps, caches, listeners, closures, unfinished promises, unbounded queues), correlate with deploys and traffic. Fix the leak (bounded LRU caches, remove listeners, close streams) and add a memory graph and alert; a load test verifies the fix.

### You must import 1 million rows from a CSV into MySQL. How do you do it?
Upload the file to S3 and process in a **background job**, not in the request. Stream it (¦readline¦ or a CSV parser stream), validate rows, insert in batches (500–5 000 rows per ¦bulkCreate¦ or multi-row ¦INSERT¦) inside short transactions, use ¦INSERT … ON DUPLICATE KEY UPDATE¦ for idempotency, track progress and errors in a job table, write rejected rows to an error report, disable unnecessary indexes only if safe, and run during low traffic. Provide a status endpoint for the UI.

### The team wants to split the backend into microservices. What is your view?
Ask what problem it solves. If it is deployment conflicts or scaling a specific hot path, a **modular monolith** with clear boundaries may deliver most of the benefit at lower cost. If services are justified, define domain boundaries first, give each service its own data, use async events and idempotent consumers, standardise logging/tracing and CI/CD, and migrate one capability at a time (strangler pattern). Mention the extra cost in on-call, testing and consistency.

### How do you protect sensitive health or personal data in your APIs?
Encrypt in transit (TLS) and at rest, minimise what you collect and return, mask data in logs, apply least-privilege roles for services and databases, enforce object-level authorisation, keep audit logs of access, rotate secrets, back up securely and follow the organisation's compliance rules (for example HIPAA/GDPR where relevant). Add automated dependency and secret scanning, and run security reviews for new endpoints.
`;
