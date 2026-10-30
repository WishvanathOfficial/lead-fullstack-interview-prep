window.PREP_NOTES = window.PREP_NOTES || {};
window.PREP_NOTES.node = String.raw`
## Phase 1 · Foundations (Basic)
### What Node.js is: V8 + libuv, event loop, non-blocking I/O
#### In one line
Node.js is a JavaScript runtime built from the V8 engine (runs JS) and libuv (talks to the OS), which handles many connections on one thread by never waiting around for I/O.

#### Real-life analogy
A single waiter in a restaurant. He takes your order, hands it to the kitchen, and immediately serves the next table instead of standing at the pass. When the kitchen rings the bell, he delivers the food. He is fast because he never *waits*. But if someone asks him to cook a 20-minute dish himself (CPU work), every table is stuck.

#### How it works
1. Your JavaScript runs on **one thread** (the main thread) inside V8.
2. When you call something slow (file read, DB query, HTTP call), Node hands it to the OS or to libuv's **thread pool** (4 threads by default) and moves on.
3. When the work finishes, a callback/promise is put in a queue.
4. The **event loop** picks queued callbacks one at a time and runs them on the main thread.

- **Great for**: I/O-heavy work such as REST APIs, proxies, real-time chat, streaming.
- **Weak for**: CPU-heavy work (image processing, big JSON crunching, crypto in loops). Move it to ¦worker_threads¦ or another service.

#### Example
¦¦¦js
import { readFile } from 'node:fs/promises';
import http from 'node:http';

// Non-blocking: while the file is read, the server still answers other requests.
http.createServer(async (req, res) => {
  if (req.url === '/courses') {
    const json = await readFile('./courses.json', 'utf8'); // I/O -> handed to libuv
    res.setHeader('Content-Type', 'application/json');
    return res.end(json);                                   // back on the main thread
  }
  res.statusCode = 404;
  res.end('Not found');
}).listen(3000, () => console.log('Listening on 3000'));

// BAD: blocks every user for the whole loop
// while (Date.now() < end) {}
¦¦¦

#### Remember it
**"V8 runs it, libuv waits for it, the loop delivers it."**

| Piece | Job |
|---|---|
| V8 | Compiles and runs JavaScript |
| libuv | Event loop, thread pool, async OS I/O |
| Event loop | Runs callbacks one at a time |
| Thread pool | fs, crypto, DNS lookups, zlib |

#### Common mistakes
- Saying "Node is single-threaded" and stopping there. Only *your JS* is single-threaded; I/O is not.
- Running CPU-heavy code on the main thread.
- Using ¦readFileSync¦ inside request handlers.

#### Interview angle
**Q:** "Node is single-threaded, how does it serve thousands of users?" **Say:** "My JavaScript runs on one thread, but I/O is delegated to the OS and libuv. While waiting, the event loop serves other requests, so it scales well for I/O-bound APIs like our Clinical Learning Hub. For CPU-heavy work I use worker threads or a separate service." **Follow-up:** What blocks the event loop, and how do you detect it?

### Modules and npm: CommonJS vs ESM, package.json, semver
#### In one line
Modules split code into files you can import; npm installs third-party packages and records exact versions so everyone gets the same code.

#### Real-life analogy
A LEGO set. Each module is a brick with studs (exports). ¦package.json¦ is the parts list; the lockfile is the exact photo of the finished build so a teammate builds it identically.

#### How it works
- **CommonJS (CJS)**: ¦require()¦ and ¦module.exports¦. Loads synchronously; results are cached in ¦require.cache¦.
- **ES Modules (ESM)**: ¦import/export¦. Static (analysable, tree-shakeable), supports top-level ¦await¦. Enable with ¦"type": "module"¦ or ¦.mjs¦.
- **package.json** holds name, scripts, dependencies, ¦engines¦.
- **dependencies** ship to production; **devDependencies** (tests, linters, TypeScript) do not.
- **Semver** ¦MAJOR.MINOR.PATCH¦: ¦^1.2.3¦ allows 1.x.x (minor+patch), ¦~1.2.3¦ allows 1.2.x (patch only).
- **Lockfile** (¦package-lock.json¦) pins exact versions. Commit it, and use ¦npm ci¦ in CI for repeatable installs.

#### Example
¦¦¦js
// math.mjs (ESM)
export const add = (a, b) => a + b;
export default function total(items) { return items.reduce(add, 0); }

// app.mjs
import total, { add } from './math.mjs';
console.log(total([1, 2, 3]), add(2, 3)); // 6 5

// CommonJS equivalent
// const { add } = require('./math.cjs');
¦¦¦
¦¦¦json
{
  "name": "clinical-api",
  "type": "module",
  "engines": { "node": ">=22" },
  "scripts": { "dev": "node --watch src/server.js", "test": "vitest run" },
  "dependencies": { "express": "^5.0.0" },
  "devDependencies": { "vitest": "^2.0.0" }
}
¦¦¦

#### Remember it
- ¦^¦ = "caret allows minor", ¦~¦ = "tilde allows tiny (patch)".
- Dev vs prod: "Would the server need it to *run*? Then dependency."
- ¦npm install¦ updates lock; ¦npm ci¦ obeys lock exactly.

#### Common mistakes
- Not committing the lockfile, so builds differ between machines.
- Mixing ¦require¦ in ESM files (no ¦require¦ or ¦__dirname¦ in ESM; use ¦import.meta.dirname¦ in Node 22).
- Putting build tools in ¦dependencies¦, bloating production images.

#### Interview angle
**Q:** "CJS vs ESM?" **Say:** "CJS loads synchronously with ¦require¦ and a cache; ESM is the standard, statically analysable, async-capable and supports top-level await. New code uses ESM; I keep a lockfile and use ¦npm ci¦ in pipelines." **Follow-up:** What is the require cache and how do circular imports behave?

### Core modules: fs/promises, path, os, http, events, stream, buffer, crypto
#### In one line
Core modules ship inside Node, need no install, and cover files, paths, networking, events, streams, hashing and more.

#### Real-life analogy
The tools built into a Swiss Army knife: you already carry a blade, scissors and a screwdriver before buying anything extra.

#### How it works
- **fs/promises**: read/write files with ¦await¦.
- **path**: build paths safely across OSes (¦path.join¦, ¦path.resolve¦, ¦path.extname¦).
- **os**: CPU count, memory, temp dir.
- **http**: low-level server (Express sits on top).
- **events**: ¦EventEmitter¦ for ¦on/emit¦ patterns.
- **stream / buffer**: chunked data and raw bytes.
- **crypto**: hashes, HMAC, random bytes, ¦scrypt¦ for passwords, ¦randomUUID¦.
- Use the ¦node:¦ prefix (¦node:fs¦) to make it clear they are built-in.

#### Example
¦¦¦js
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

// Read a file, hash it, write the hash next to it.
const file = path.join(process.cwd(), 'reports', 'course-report.csv');
const data = await readFile(file);                         // Buffer
const hash = createHash('sha256').update(data).digest('hex');
await writeFile(file + '.sha256', hash);
console.log(path.basename(file), hash.slice(0, 12));      // course-report.csv 9f86d081884c
¦¦¦

#### Remember it
Say it as a list: *File, Path, OS, HTTP, Events, Streams, Buffer, Crypto*. Rule: **check core before npm**.

#### Common mistakes
- Building paths with string concatenation (breaks on Windows).
- Using sync methods (¦readFileSync¦) in a server.
- Using ¦Math.random()¦ for tokens instead of ¦crypto.randomBytes¦.

#### Interview angle
**Q:** "Which core modules do you use most?" **Say:** "¦fs/promises¦, ¦path¦, ¦crypto¦ for hashing and tokens, ¦events¦ for decoupling, and streams for big files. I check core first before adding a dependency." **Follow-up:** Difference between ¦Buffer¦ and string?

### Async patterns: callbacks, promises, async/await, promisify
#### In one line
Three generations of handling "do this later": callbacks, promises, and async/await (promises that read like normal code).

#### Real-life analogy
Ordering a pizza. Callback: "call me when it is ready." Promise: you get a receipt that will become pizza or a refund. Async/await: you simply wait at the counter in a line of code, but the shop keeps serving others.

#### How it works
- **Error-first callback**: ¦(err, result) => {}¦. Easy to nest into "callback hell".
- **Promise**: object with states pending, fulfilled, rejected; chain ¦.then/.catch¦.
- **async/await**: ¦await¦ pauses *that function* only; use ¦try/catch¦.
- **util.promisify** turns a callback API into a promise API.
- Run independent work in **parallel** with ¦Promise.all¦, not sequential ¦await¦s.

#### Example
¦¦¦js
import { promisify } from 'node:util';
import fs from 'node:fs';

// Callback -> promise
const readFileP = promisify(fs.readFile);

// Sequential (slow): total = a + b
// const user = await getUser(id); const courses = await getCourses(id);

// Parallel (fast): total = max(a, b)
async function dashboard(id) {
  const [user, courses] = await Promise.all([getUser(id), getCourses(id)]);
  return { user, courses };
}

try {
  const txt = await readFileP('./notes.txt', 'utf8');
} catch (err) {
  console.error('Read failed:', err.code); // ENOENT
}
¦¦¦

#### Remember it
- Callback = "call me", promise = "receipt", await = "wait here (only me)".
- Independent calls -> ¦Promise.all¦. Need partial results -> ¦Promise.allSettled¦.

#### Common mistakes
- ¦await¦ inside ¦forEach¦ (does not wait). Use ¦for...of¦ or ¦Promise.all(map)¦.
- Forgetting ¦try/catch¦ or ¦.catch¦ -> unhandled rejection.
- Awaiting independent calls one after another.

#### Interview angle
**Q:** "Convert callback code to async/await." **Say:** "I wrap with ¦promisify¦ or use the ¦fs/promises¦ API, use ¦await¦ in ¦try/catch¦, and use ¦Promise.all¦ for independent calls so latency is the slowest call, not the sum." **Follow-up:** What happens on an unhandled rejection in Node 22? (process exits by default)

### Express basics: routing, middleware, req/res, express.json
#### In one line
Express is a thin web framework: you register middleware and routes, and each request flows through them to a response.

#### Real-life analogy
Airport security. Every passenger (request) walks through checkpoints in order: ID check, baggage scan, boarding gate (middleware). A checkpoint can let you through (¦next()¦) or stop you (send a response).

#### How it works
- ¦app.use(fn)¦ registers middleware that runs in **registration order**.
- Routes: ¦app.get('/courses/:id', handler)¦.
- ¦req.params¦ (path), ¦req.query¦ (?x=1), ¦req.body¦ (needs ¦express.json()¦).
- Respond once: ¦res.status(201).json(data)¦.
- ¦express.static('public')¦ serves files.
- **Express 5**: async handler errors/rejections are forwarded to the error handler automatically.

#### Example
¦¦¦js
import express from 'express';
const app = express();
const courses = new Map();

app.use(express.json());                             // parse JSON bodies first
app.use((req, _res, next) => { console.log(req.method, req.url); next(); });

app.post('/courses', (req, res) => {
  const id = crypto.randomUUID();
  courses.set(id, { id, ...req.body });
  res.status(201).json(courses.get(id));             // 201 Created
});

app.get('/courses/:id', (req, res) => {
  const course = courses.get(req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
});

app.listen(3000);
¦¦¦

#### Remember it
**Order matters**: parsers -> security -> routes -> 404 -> error handler.
Middleware signature: ¦(req, res, next)¦; error middleware has **4 args**.

#### Common mistakes
- Registering ¦express.json()¦ after routes (body is ¦undefined¦).
- Not returning after ¦res.send¦, then calling ¦next()¦ or sending twice.
- Forgetting ¦next()¦ so requests hang.

#### Interview angle
**Q:** "What is middleware?" **Say:** "A function with access to request, response and ¦next¦. They run in order and form a pipeline: logging, auth, validation, then the handler, and finally the error handler." **Follow-up:** How does Express 5 differ from 4 for async errors?

### REST API design: resources, verbs, status codes, idempotency, pagination
#### In one line
REST models your system as nouns (resources) manipulated with standard HTTP verbs and meaningful status codes.

#### Real-life analogy
A library. Books are resources with addresses (shelf numbers = URLs). You can *get* a book, *add* one, *replace* one, *remove* one. The librarian replies with clear signals ("not found", "not allowed").

#### How it works
| Verb | Use | Idempotent |
|---|---|---|
| GET | read | yes |
| POST | create / action | no |
| PUT | replace whole | yes |
| PATCH | partial update | usually no |
| DELETE | remove | yes |

- URLs are **plural nouns**: ¦/courses/42/modules¦, not ¦/getCourse¦.
- Status codes: **200** OK, **201** Created, **204** No Content, **400** bad input, **401** not logged in, **403** forbidden, **404** not found, **409** conflict, **422** validation, **429** rate limited, **500** server bug.
- Collections need ¦?page&limit&sort&status=¦ filters and pagination (offset or cursor).
- Version with ¦/v1/¦ or headers.

#### Example
¦¦¦
GET    /v1/courses?status=published&limit=20&cursor=abc
GET    /v1/courses/42
POST   /v1/courses                 -> 201 + Location: /v1/courses/43
PATCH  /v1/courses/42              -> 200 updated
DELETE /v1/courses/42              -> 204
POST   /v1/courses/42/enrolments   -> enrol learner (sub-resource)
¦¦¦
¦¦¦json
{ "data": [{ "id": 42, "title": "Sepsis Care" }], "nextCursor": "eyJpZCI6NDJ9" }
¦¦¦

#### Remember it
**"Nouns in the URL, verbs in the method, numbers in the status."** 4xx = *your* fault (client), 5xx = *our* fault.

#### Common mistakes
- Using ¦200¦ for errors with ¦{success:false}¦.
- Verbs in URLs (¦/createCourse¦).
- Returning 500 for validation errors.

#### Interview angle
**Q:** "Design endpoints for a learning platform." **Say:** "Resources: users, courses, modules, enrolments, progress. Plural nouns, correct verbs and status codes, pagination and filtering on lists, ¦/v1¦ versioning, idempotency keys for payments or enrolments." **Follow-up:** PUT vs PATCH, and why is POST not idempotent?

### Configuration: environment variables, dotenv, 12-factor config
#### In one line
Keep settings that differ per environment (DB URL, secrets) outside the code in environment variables, and validate them at startup.

#### Real-life analogy
The same car model sold in different countries: the engine (code) is identical, but the dashboard language and plugs (config) are set per market.

#### How it works
- Read with ¦process.env.NAME¦ (always strings).
- Locally use a ¦.env¦ file: ¦node --env-file=.env app.js¦ (built-in) or ¦dotenv¦.
- **12-factor**: config in env, same build artifact for dev/stage/prod.
- Secrets in a manager (AWS Secrets Manager, SSM), never in git.
- **Validate at startup** and crash early if invalid.

#### Example
¦¦¦js
import { z } from 'zod';

const Env = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
});

export const env = Env.parse(process.env); // throws with a clear message if wrong
// env.PORT is a number now, not "3000"
¦¦¦
¦¦¦bash
# .gitignore
.env
# commit a template instead
.env.example
¦¦¦

#### Remember it
**"Config in env, secrets in a vault, validate on boot, never commit .env."**

#### Common mistakes
- Committing ¦.env¦ or secrets in Docker images.
- Forgetting that ¦process.env.PORT¦ is a string (¦"5" + 1 = "51"¦).
- Failing late at runtime instead of at startup.

#### Interview angle
**Q:** "How do you manage secrets?" **Say:** "Env vars for config, a secrets manager for sensitive values, injected at deploy time, validated with zod at boot, with ¦.env.example¦ in git and rotation if anything leaks." **Follow-up:** Why do env vars alone not equal secure secrets?

### Error handling: sync vs async errors, error middleware, custom errors
#### In one line
Throw meaningful errors anywhere, and catch them in one central Express error middleware that turns them into safe HTTP responses.

#### Real-life analogy
A hospital triage desk. Any department can raise an alarm, but one desk decides how serious it is and what the patient is told, without exposing internal details.

#### How it works
- **Sync errors** thrown inside a handler are caught by Express.
- **Async errors**: Express 5 forwards rejected promises automatically (Express 4 needed ¦next(err)¦ or a wrapper).
- Create **custom error classes** with ¦status¦ and ¦code¦.
- **Error middleware** has four args ¦(err, req, res, next)¦ and goes **last**.
- Distinguish *operational* errors (bad input, not found) from *programmer* errors (bugs). Log both; hide internals from clients.

#### Example
¦¦¦js
export class AppError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}

app.get('/courses/:id', async (req, res) => {
  const course = await repo.find(req.params.id);          // may reject
  if (!course) throw new AppError(404, 'COURSE_NOT_FOUND', 'Course not found');
  res.json(course);
});

// last middleware
app.use((err, req, res, next) => {
  const status = err.status ?? 500;
  if (status >= 500) req.log?.error({ err }, 'unhandled');
  res.status(status).json({
    error: { code: err.code ?? 'INTERNAL', message: status >= 500 ? 'Something went wrong' : err.message },
  });
});
¦¦¦

#### Remember it
**"Throw anywhere, handle once, last in the chain, 4 arguments, never leak the stack."**

#### Common mistakes
- Sending the stack trace to the client.
- Swallowing errors in empty ¦catch¦ blocks.
- Putting the error handler before the routes.

#### Interview angle
**Q:** "How do you handle async errors in Express?" **Say:** "In Express 5 rejected promises go to the error middleware automatically; in 4 I wrap handlers. I use custom error classes and one central handler that maps them to status codes and logs server errors with a request ID." **Follow-up:** What about ¦unhandledRejection¦ and ¦uncaughtException¦?

### Tooling: node --watch, ESLint, Prettier, debugging with --inspect
#### In one line
Dev tooling that restarts on change, enforces code style, and lets you pause running code to find bugs quickly.

#### Real-life analogy
A workshop: a spell-checker (ESLint), an auto-formatter (Prettier) and a magnifying glass with pause button (debugger) so you stop guessing and start seeing.

#### How it works
- ¦node --watch app.js¦ restarts on file changes (replaces nodemon).
- **ESLint** finds bugs and bad patterns; **Prettier** formats consistently. Run both in CI and pre-commit (husky/lint-staged).
- **Debugging**: ¦node --inspect app.js¦, then open ¦chrome://inspect¦ or use VS Code "Attach". Use breakpoints, watch variables, step through.
- Better than ¦console.log¦ for async flows; use ¦console.table¦ and ¦console.time¦ when quick checks are enough.

#### Example
¦¦¦json
{
  "scripts": {
    "dev": "node --watch --env-file=.env src/server.js",
    "debug": "node --inspect --watch src/server.js",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
¦¦¦
¦¦¦bash
npm run debug
# open chrome://inspect -> inspect -> set a breakpoint in the /courses handler
# send: curl localhost:3000/courses/42 and inspect req.params
¦¦¦

#### Remember it
**"Watch, Lint, Format, Inspect."** Debug flow: reproduce -> breakpoint -> inspect -> fix -> add a test.

#### Common mistakes
- Debugging production with ¦--inspect¦ open to the internet.
- Ignoring lint warnings until they pile up.
- Only using ¦console.log¦ for async issues.

#### Interview angle
**Q:** "How do you debug a failing request?" **Say:** "I reproduce it, check logs by request ID, then attach the debugger with ¦--inspect¦, set a breakpoint in the handler, inspect inputs and the failing line, fix it and add a regression test." **Follow-up:** How do you debug memory leaks?

## Phase 2 · Production APIs (Intermediate)
### Event loop in depth and the libuv thread pool
#### In one line
The event loop cycles through phases (timers, poll, check...) running queued callbacks; slow native work goes to a thread pool of 4 threads, and any long JavaScript blocks everyone.

#### Real-life analogy
A single-lane drive-through with a kitchen behind. The window clerk (event loop) hands orders to cooks (thread pool) but if the clerk herself starts cooking a huge order, the queue of cars stops.

#### How it works
Order of one loop turn: **timers** (setTimeout/setInterval) -> pending callbacks -> **poll** (I/O callbacks) -> **check** (setImmediate) -> close callbacks.
- Between each callback Node drains **¦process.nextTick¦** first, then **promise microtasks**.
- Priority: ¦nextTick¦ > promises > timers/immediate.
- **Thread pool** (¦UV_THREADPOOL_SIZE¦, default 4): fs, crypto (pbkdf2, scrypt), zlib, dns.lookup. Network sockets use OS async I/O, not the pool.
- **Blockers**: ¦JSON.parse¦ of huge payloads, sync crypto, ¦readFileSync¦, catastrophic regex, big loops.
- Measure with ¦perf_hooks.monitorEventLoopDelay()¦.

#### Example
¦¦¦js
console.log('1 start');
setTimeout(() => console.log('5 timeout'), 0);
setImmediate(() => console.log('6 immediate'));   // order vs timeout can vary in main module
Promise.resolve().then(() => console.log('3 promise'));
process.nextTick(() => console.log('2 nextTick'));
console.log('2.5 end of script');
// 1 start, 2.5 end of script, 2 nextTick, 3 promise, 5 timeout, 6 immediate
¦¦¦
¦¦¦js
import { monitorEventLoopDelay } from 'node:perf_hooks';
const h = monitorEventLoopDelay(); h.enable();
setInterval(() => console.log('p99 lag ms', h.percentile(99) / 1e6), 5000);
¦¦¦

#### Remember it
**"Sync first, then nextTick, then promises, then timers/immediate."**
Pool is for *files and crypto*, sockets are not in the pool.

#### Common mistakes
- Thinking ¦setTimeout(fn, 0)¦ runs immediately.
- Recursive ¦nextTick¦ starving I/O.
- Assuming async means non-blocking CPU work (a huge ¦.map¦ still blocks).

#### Interview angle
**Q:** "Predict the output of nextTick, promise, timeout, immediate." **Say:** "Synchronous code, then the nextTick queue, then promise microtasks, then timers and immediate in the loop phases." **Follow-up:** How would you find what blocks the loop in production?

### Streams, buffers, backpressure, pipeline
#### In one line
Streams process data in small chunks as it flows, so large files and responses never need to fit in memory.

#### Real-life analogy
A water pipe versus carrying a full bathtub. A pipe moves a little at a time; ¦pipeline¦ is the plumber who also shuts the tap if the sink backs up (backpressure).

#### How it works
- Types: **Readable**, **Writable**, **Duplex**, **Transform** (e.g. gzip).
- **Buffer**: raw bytes; each chunk is a Buffer unless an encoding is set.
- **Backpressure**: if the consumer is slower, ¦write()¦ returns ¦false¦; the producer must pause until ¦'drain'¦. ¦pipe¦ and ¦pipeline¦ handle this.
- Prefer **¦stream/promises¦ ¦pipeline¦**: it forwards errors and destroys all streams (¦.pipe()¦ does not).
- Async iteration: ¦for await (const chunk of readable)¦.

#### Example
¦¦¦js
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

// Compress a 2 GB report with ~constant memory
await pipeline(
  createReadStream('./exports/enrolments.csv'),
  createGzip(),
  createWriteStream('./exports/enrolments.csv.gz'),
);

// Stream a file to the HTTP client
app.get('/exports/:name', async (req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  await pipeline(createReadStream(¦./exports/§{path.basename(req.params.name)}¦), res);
});
¦¦¦

#### Remember it
**"Chunk it, pipeline it, respect the drain."** Memory with streams ~ chunk size (64 KB), not file size.

#### Common mistakes
- ¦readFile¦ on huge files then ¦res.send¦.
- Using ¦.pipe()¦ without error handlers (leaks descriptors).
- Passing user input directly as a file path (path traversal).

#### Interview angle
**Q:** "What is backpressure?" **Say:** "When the destination is slower than the source. The writable signals via ¦write()¦ returning false, and the readable must pause until ¦drain¦. ¦pipeline¦ does this and cleans up on errors." **Follow-up:** How would you build a CSV export for 1 million rows?

### Project architecture: routes -> controllers -> services -> repositories
#### In one line
Split code into layers so HTTP concerns, business rules and database access each live in one place.

#### Real-life analogy
A restaurant: the waiter (route/controller) takes the order, the chef (service) applies the recipe, the pantry clerk (repository) fetches ingredients. The waiter never cooks and the chef never walks to the farm.

#### How it works
- **Routes**: map URL + verb to a controller, attach middleware.
- **Controller**: read ¦req¦, call a service, shape ¦res¦ (thin).
- **Service**: business rules, transactions, orchestration; no ¦req/res¦.
- **Repository**: all DB queries (Sequelize/SQL).
- Benefits: easy tests (mock the repo), reuse (jobs call the same service), swapping DB later.
- Group by feature (¦courses/¦, ¦users/¦) as the project grows (modular monolith).

#### Example
¦¦¦js
// courses/courses.routes.js
router.post('/', auth('admin'), validate(CreateCourse), courses.create);

// courses/courses.controller.js  (thin)
export const create = async (req, res) => {
  const course = await coursesService.create(req.body, req.user);
  res.status(201).json(course);
};

// courses/courses.service.js  (business rules)
export async function create(dto, user) {
  if (await coursesRepo.existsByTitle(dto.title)) throw new AppError(409, 'DUPLICATE', 'Title exists');
  return coursesRepo.insert({ ...dto, createdBy: user.id });
}

// courses/courses.repo.js  (DB only)
export const insert = (data) => Course.create(data);
¦¦¦

#### Remember it
**"Controller talks HTTP, service talks business, repo talks database."**
Rule: a service must work without Express being imported.

#### Common mistakes
- Fat controllers with SQL inside.
- Passing ¦req¦ into services.
- Over-layering tiny apps (only add layers that pay off).

#### Interview angle
**Q:** "How do you structure a Node project?" **Say:** "Feature folders with routes, controllers, services and repositories. Controllers stay thin, services hold business logic and transactions, repositories isolate the ORM. This keeps tests simple and logic reusable." **Follow-up:** When would you not use repositories?

### Validation and DTOs: zod, Joi, express-validator
#### In one line
Check every incoming request against a schema at the edge and reject bad data before it reaches your logic.

#### Real-life analogy
A bouncer at the club door checking ID. Once you are inside, staff do not re-check; but the door must never be skipped.

#### How it works
- Never trust ¦body¦, ¦query¦, ¦params¦, headers.
- Define a **schema** (zod/Joi) once; get validation, coercion (¦"5"¦ -> ¦5¦) and TypeScript types (zod ¦z.infer¦).
- Write a reusable ¦validate(schema)¦ middleware that replaces ¦req.body¦ with parsed data (strips unknown fields: prevents mass assignment).
- Return **400/422** with a field-by-field error list.

#### Example
¦¦¦js
import { z } from 'zod';

export const CreateCourse = z.object({
  title: z.string().trim().min(3).max(120),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  durationMins: z.coerce.number().int().positive().max(600),
}).strict();                            // unknown keys are an error

export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next(new AppError(422, 'VALIDATION', JSON.stringify(result.error.flatten().fieldErrors)));
  }
  req.body = result.data;               // trusted, typed data from here on
  next();
};
// POST {title:"A"} -> 422 { title: ["String must contain at least 3 character(s)"] }
¦¦¦

#### Remember it
**"Validate at the edge, whitelist fields, coerce types, return field errors."**

#### Common mistakes
- Validating only in the frontend.
- Passing ¦req.body¦ straight into ¦Model.create¦ (mass assignment, e.g. ¦isAdmin: true¦).
- Validating body but forgetting ¦query¦ and ¦params¦.

#### Interview angle
**Q:** "How do you validate requests?" **Say:** "A zod schema per endpoint inside a middleware at the edge. It coerces types, strips unknown fields and returns 422 with field messages; services can trust the data." **Follow-up:** Validation vs authorisation: where does each belong?

### Authentication and authorisation: sessions, JWT, hashing, RBAC, OAuth2
#### In one line
Authentication proves *who you are*; authorisation decides *what you may do*.

#### Real-life analogy
A hotel. Check-in verifies your passport and gives a key card (authentication). The card only opens your room and the gym (authorisation).

#### How it works
- **Passwords**: hash with **argon2/bcrypt/scrypt** (slow, salted). Never SHA-256 or plain.
- **Sessions**: server stores state, cookie holds a session id. Easy revocation; needs shared store (Redis) when scaling.
- **JWT**: signed token carrying claims; stateless, but hard to revoke before expiry.
- Pattern: **short-lived access token (5-15 min)** + **refresh token** (rotating, stored hashed server-side, in an HttpOnly cookie).
- **RBAC**: roles (learner, instructor, admin) -> permissions; also check **ownership** (can this user see *this* record?).
- **OAuth2/OIDC**: delegate login to an identity provider (Google, Azure AD); you receive an ID token.

#### Example
¦¦¦js
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

export const auth = (...roles) => (req, _res, next) => {
  const token = req.cookies.access;                       // HttpOnly cookie
  if (!token) throw new AppError(401, 'UNAUTHENTICATED', 'Login required');
  try {
    req.user = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });
  } catch { throw new AppError(401, 'TOKEN_INVALID', 'Invalid or expired token'); }
  if (roles.length && !roles.includes(req.user.role)) throw new AppError(403, 'FORBIDDEN', 'Not allowed');
  next();
};

app.delete('/courses/:id', auth('admin'), removeCourse);   // RBAC at route level
// Object-level check inside service: course.ownerId === req.user.id
¦¦¦

#### Remember it
**401 = "who are you?", 403 = "I know you, but no."**
Tokens: access short, refresh long and rotating, passwords slow-hashed.

#### Common mistakes
- Storing JWTs in ¦localStorage¦ (XSS steals them).
- Not pinning the algorithm, or using weak secrets.
- Checking role but not record ownership (IDOR).

#### Interview angle
**Q:** "Sessions vs JWT?" **Say:** "Sessions are easy to revoke but need a shared store; JWTs are stateless and scale easily but are hard to revoke. I use short access tokens with rotating refresh tokens in HttpOnly cookies, and a denylist or token version for revocation." **Follow-up:** How do you log a user out of a stateless JWT?

### Security: helmet, CORS, rate limiting, injection, XSS, CSRF, npm audit
#### In one line
Layer cheap defences (headers, validation, limits, least privilege) so one mistake does not become a breach.

#### Real-life analogy
A building with a gate, a front desk, locked doors and a safe. Each layer is imperfect; together they stop most attacks.

#### How it works
Use the OWASP checklist:
- **helmet**: security headers (HSTS, no-sniff, frame options). HTTPS everywhere.
- **CORS**: browser-only rule; allow-list origins, not ¦*¦ with credentials.
- **Rate limiting**: stop brute force and abuse (stricter on ¦/login¦).
- **Injection**: parameterised queries/ORM, never string-concatenated SQL.
- **XSS**: escape output, set CSP, sanitise rich text.
- **CSRF**: with cookies use ¦SameSite¦ + CSRF tokens.
- **Secrets**: vault, rotation. **¦npm audit¦** + Dependabot, pin lockfile.
- **Authorisation on every route** and object-level checks. Safe errors, audit logs.

#### Example
¦¦¦js
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: ['https://learn.example.com'], credentials: true }));
app.use(express.json({ limit: '100kb' }));                  // body size cap
app.use('/auth/login', rateLimit({ windowMs: 15 * 60_000, limit: 10 }));

// SAFE: parameterised
const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
// UNSAFE: ¦SELECT * FROM users WHERE email = '§{email}'¦  <- never
¦¦¦

#### Remember it
**"HELMET-CORS-RATE-VALIDATE-PARAMETERISE-AUDIT"**: Headers, Origins, Limits, Input, Queries, Dependencies.

#### Common mistakes
- Believing CORS protects the API (it only controls browsers).
- ¦cors()¦ default (allows everything) in production.
- Detailed error messages and stack traces to clients.

#### Interview angle
**Q:** "How do you secure an Express API?" **Say:** "Defence in depth: HTTPS and helmet, strict CORS, validation, parameterised queries, rate limiting, authN and per-object authZ, secrets in a vault, dependency scanning and audit logs." **Follow-up:** Explain CSRF and why it does not apply to bearer-token APIs.

### Databases from Node: pooling, transactions, migrations, N+1
#### In one line
Reuse a small pool of DB connections, wrap multi-step changes in transactions, change schemas via migrations, and avoid one-query-per-row loops.

#### Real-life analogy
Taxis at a stand (pool). Opening a new connection each request is like building a new car for every ride. A transaction is booking a whole trip: all legs happen or none.

#### How it works
- **Pool**: ¦connectionLimit¦ ~10 per instance; total across instances must stay below the DB limit.
- **Transaction**: ¦BEGIN¦ -> work -> ¦COMMIT¦ or ¦ROLLBACK¦; always release the connection.
- **Migrations**: versioned scripts (up/down) in git; never edit prod schema by hand.
- **N+1**: 1 query for list + N queries for children. Fix with joins/eager loading or ¦WHERE id IN (...)¦.
- Index foreign keys and filter columns. (See the Database subject for MySQL and Sequelize depth.)

#### Example
¦¦¦js
import mysql from 'mysql2/promise';
const pool = mysql.createPool({ uri: env.DATABASE_URL, connectionLimit: 10 });

export async function enrol(userId, courseId) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute('INSERT INTO enrolments (user_id, course_id) VALUES (?, ?)', [userId, courseId]);
    await conn.execute('UPDATE courses SET seats = seats - 1 WHERE id = ? AND seats > 0', [courseId]);
    await conn.commit();                      // both or nothing
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();                           // always give the connection back
  }
}
¦¦¦

#### Remember it
**"Pool it, wrap it, migrate it, batch it."** Forgetting ¦release()¦ = pool exhaustion = hanging API.

#### Common mistakes
- Not releasing connections on error paths.
- Querying in a loop (N+1).
- Mixing multiple DB calls without a transaction when they must be atomic.

#### Interview angle
**Q:** "What is N+1 and how do you fix it?" **Say:** "Loading a list then querying children per row. I fix it with a join or eager loading, or one ¦IN¦ query and group in memory, and I confirm with query logs." **Follow-up:** How do you size a connection pool?

### Caching: in-memory, Redis, cache-aside, HTTP cache headers and ETag
#### In one line
Store expensive results closer to the user so repeat requests are fast and the database is protected.

#### Real-life analogy
A sticky note on your monitor with a phone number you use daily, instead of looking it up in the phone book each time. The risk: the number changes and your note is stale.

#### How it works
- **In-memory** (Map/LRU): fastest, per process, lost on restart, not shared.
- **Redis**: shared across instances, supports TTL.
- **Cache-aside**: check cache -> on miss load from DB -> store with TTL -> return.
- **Invalidation**: TTL, delete on write, or versioned keys; add jitter to avoid many keys expiring together (**stampede**).
- **HTTP caching**: ¦Cache-Control: public, max-age=60¦, ¦ETag¦ with ¦304 Not Modified¦.

#### Example
¦¦¦js
export async function getCourse(id) {
  const key = ¦course:§{id}¦;
  const hit = await redis.get(key);
  if (hit) return JSON.parse(hit);                         // cache hit

  const course = await repo.find(id);                      // miss -> DB
  if (course) await redis.set(key, JSON.stringify(course), 'EX', 300 + Math.floor(Math.random() * 60));
  return course;
}

export async function updateCourse(id, data) {
  const updated = await repo.update(id, data);
  await redis.del(¦course:§{id}¦);                         // invalidate on write
  return updated;
}
// Express: res.set('Cache-Control', 'public, max-age=60'); res.json(data) // ETag is automatic
¦¦¦

#### Remember it
*"There are only two hard things: cache invalidation and naming."* Always: **TTL + invalidate on write + metrics (hit ratio)**.

#### Common mistakes
- Caching per-user data under a shared key (data leak).
- No TTL, so stale data lives forever.
- Cache stampede on a hot key expiring.

#### Interview angle
**Q:** "Explain cache-aside." **Say:** "App checks cache first, on miss reads the DB and populates the cache with a TTL; writes delete the key. It is simple and resilient since cache failure falls back to the DB." **Follow-up:** How do you prevent a stampede?

### File handling: multer, streaming uploads, S3 pre-signed URLs
#### In one line
Handle uploads without loading whole files into server memory, ideally letting the client upload straight to S3.

#### Real-life analogy
Instead of receiving a heavy parcel at your desk and carrying it to the warehouse, you give the courier a one-time pass so they deliver it straight to the warehouse.

#### How it works
- **multer** parses ¦multipart/form-data¦. ¦memoryStorage¦ buffers (bad for large files); ¦diskStorage¦ or streaming is better.
- Enforce **limits** (size, count) and **validate type** (check magic bytes, not only the extension).
- Best for big files: server creates a **pre-signed PUT URL** (valid ~5 min); browser uploads directly to S3; server stores the key/metadata.
- Scan for malware if needed; never serve uploads from the app's own folder as executable content.
- Download via pre-signed GET URLs.

#### Example
¦¦¦js
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
const s3 = new S3Client({ region: 'ap-south-1' });

app.post('/uploads/sign', auth(), async (req, res) => {
  const { contentType } = req.body;                       // validate against an allow-list
  if (!['video/mp4', 'application/pdf'].includes(contentType)) throw new AppError(400, 'BAD_TYPE', 'Unsupported');
  const key = ¦courses/§{req.user.id}/§{crypto.randomUUID()}¦;
  const url = await getSignedUrl(s3, new PutObjectCommand({ Bucket: env.BUCKET, Key: key, ContentType: contentType }), { expiresIn: 300 });
  res.json({ url, key });                                  // browser PUTs the file to url
});
¦¦¦

#### Remember it
**"Limit it, type-check it, stream it, or pre-sign it."**

#### Common mistakes
- ¦multer.memoryStorage()¦ with big files (out-of-memory).
- Trusting the client's filename (path traversal) or MIME type.
- Long-lived or public-write pre-signed URLs.

#### Interview angle
**Q:** "How do you handle large uploads?" **Say:** "I avoid proxying them: the API issues a short-lived pre-signed S3 URL after authorising and validating type, the client uploads directly, then the API records the key. Smaller files stream with multer limits." **Follow-up:** How do you confirm the upload actually completed?

### Logging and monitoring: pino, request IDs, health checks, metrics
#### In one line
Write structured, correlated logs and expose health and metrics so you can find and fix production problems fast.

#### Real-life analogy
A flight data recorder plus a dashboard. The recorder (logs) explains what happened; the dashboard (metrics) tells you something is wrong now; the ticket number (request ID) links them.

#### How it works
- **Structured JSON logs** (pino): searchable fields, not free text.
- **Request ID**: generate or accept ¦x-request-id¦, attach to every log line and return it to the client. Use ¦AsyncLocalStorage¦ to carry it.
- **Levels**: error, warn, info, debug. Never log passwords, tokens, PII.
- **Health**: ¦/health¦ (liveness: process is up), ¦/ready¦ (readiness: DB reachable).
- **Metrics**: request rate, errors, latency p50/p95/p99, event-loop lag, memory (Prometheus/CloudWatch).

#### Example
¦¦¦js
import pino from 'pino';
import pinoHttp from 'pino-http';
const logger = pino({ redact: ['req.headers.authorization', 'req.headers.cookie'] });

app.use(pinoHttp({
  logger,
  genReqId: (req) => req.headers['x-request-id'] ?? crypto.randomUUID(),
}));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/ready', async (_req, res) => {
  try { await pool.query('SELECT 1'); res.json({ status: 'ready' }); }
  catch { res.status(503).json({ status: 'db_down' }); }
});
// {"level":30,"reqId":"7b1c...","req":{"method":"GET","url":"/courses/42"},"res":{"statusCode":200},"responseTime":12}
¦¦¦

#### Remember it
**"Structured, correlated, redacted."** Alert on **symptoms** (errors, latency), debug with **logs + traces**.

#### Common mistakes
- Logging sensitive data.
- ¦console.log¦ strings with no request context.
- One health endpoint that checks nothing, or one that kills pods when a dependency blips.

#### Interview angle
**Q:** "How do you trace a user's failing request?" **Say:** "Every request gets an ID in a header and in all logs, so I search by it across services, check status and latency in metrics, and follow the trace spans." **Follow-up:** Liveness vs readiness?

### Testing: Vitest/Jest, Supertest, mocks, test database
#### In one line
Automated tests that call your routes and services prove behaviour and protect you when refactoring.

#### Real-life analogy
A car's crash tests and dashboard warning lights: you find the weak point before customers do.

#### How it works
- **Unit tests**: pure logic and services with mocked repos (fast).
- **Integration tests**: **Supertest** calls the Express ¦app¦ without a port, ideally against a real test DB (Docker, transactions rolled back).
- Export ¦app¦ separately from ¦listen()¦ so tests can import it.
- Test **happy path + validation + auth + not found + error paths**.
- Mock external HTTP (nock/msw), not your own code. Keep tests independent and deterministic.

#### Example
¦¦¦js
import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import { app } from '../src/app.js';

describe('GET /courses/:id', () => {
  it('returns 200 with the course', async () => {
    const res = await request(app).get('/courses/42').set('Cookie', authCookie());
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 42 });
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/courses/999999');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('COURSE_NOT_FOUND');
  });

  it('rejects an invalid token with 401', async () => {
    const res = await request(app).get('/courses/42').set('Cookie', 'access=bad');
    expect(res.status).toBe(401);
  });
});
¦¦¦

#### Remember it
**"Arrange, Act, Assert"** and the pyramid: many unit tests, some integration, few end-to-end.

#### Common mistakes
- Testing implementation details instead of behaviour.
- Tests depending on each other or on real third-party services.
- Skipping error-path tests.

#### Interview angle
**Q:** "How do you test an Express API?" **Say:** "Services unit-tested with mocks; routes with Supertest against a real test database, covering success, validation, auth and error cases, running in CI on every PR." **Follow-up:** Mock vs stub vs spy?

### API documentation: OpenAPI/Swagger, Postman collections
#### In one line
A machine-readable contract (OpenAPI) describing endpoints, inputs and outputs, so frontend, QA and partners agree before and after coding.

#### Real-life analogy
A restaurant menu. It lists what can be ordered, what comes with it and what it costs, so nobody has to ask the chef.

#### How it works
- **Contract-first**: write the OpenAPI YAML, review it, then generate types/mocks/tests.
- **Code-first**: generate from decorators/zod schemas (¦zod-to-openapi¦, NestJS Swagger).
- Serve docs at ¦/docs¦ (Swagger UI); keep **examples** and error shapes.
- **Postman collections** for manual and smoke tests; export to CI with Newman.
- Version the spec in git; fail CI on breaking changes (¦oasdiff¦).

#### Example
¦¦¦yaml
openapi: 3.0.3
info: { title: Clinical Learning API, version: 1.0.0 }
paths:
  /courses/{id}:
    get:
      summary: Get a course
      parameters:
        - { name: id, in: path, required: true, schema: { type: integer } }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Course' }
        '404': { description: Course not found }
components:
  schemas:
    Course:
      type: object
      required: [id, title]
      properties: { id: { type: integer }, title: { type: string } }
¦¦¦

#### Remember it
**"Spec -> mock -> build -> test against spec."** Docs that are not generated or checked go stale.

#### Common mistakes
- Hand-written docs that drift from the code.
- Missing error responses and auth info.
- Breaking changes without a version bump.

#### Interview angle
**Q:** "Why contract-first?" **Say:** "Frontend can build against a mock immediately, QA can write tests early, and breaking changes are caught in review instead of production." **Follow-up:** How do you detect breaking changes automatically?

### Background work: queues (BullMQ, SQS), cron jobs, retries
#### In one line
Move slow or unreliable work out of the request into a queue, so users get a fast reply and failures can be retried.

#### Real-life analogy
A coffee shop. The cashier takes your order and gives you a ticket immediately; baristas work through the queue behind the counter.

#### How it works
- API validates, saves a job (**BullMQ/Redis**, **SQS**), returns **202 Accepted** with a job id.
- **Worker** processes jobs separately and scales independently.
- **Retries with exponential backoff**, max attempts, then a **dead-letter queue**.
- Jobs must be **idempotent** (delivery is at-least-once).
- **Cron/scheduled** jobs: use one scheduler (not every instance) to avoid duplicates.
- Examples: certificate PDFs, emails, report exports, video processing.

#### Example
¦¦¦js
import { Queue, Worker } from 'bullmq';
const connection = { host: env.REDIS_HOST };
const certQueue = new Queue('certificates', { connection });

// API: respond fast
app.post('/enrolments/:id/certificate', auth(), async (req, res) => {
  const job = await certQueue.add('generate', { enrolmentId: req.params.id },
    { jobId: ¦cert-§{req.params.id}¦,                      // dedupe = idempotent
      attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
  res.status(202).json({ jobId: job.id });
});

// Worker process
new Worker('certificates', async (job) => {
  if (await certExists(job.data.enrolmentId)) return;      // idempotent check
  await generateAndEmailCertificate(job.data.enrolmentId);
}, { connection, concurrency: 5 });
¦¦¦

#### Remember it
**"202 now, work later, retry safely, dead-letter the rest."**

#### Common mistakes
- Doing PDF/email work inside the HTTP request.
- Non-idempotent jobs that double-send on retry.
- No dead-letter queue or monitoring for stuck jobs.

#### Interview angle
**Q:** "Where would you use a queue?" **Say:** "For slow, retryable or bursty work like emails, certificates and exports. The API returns 202, workers process with backoff and DLQ, and jobs are idempotent because delivery is at-least-once." **Follow-up:** How do you ensure a cron job runs once across 5 instances?

## Phase 3 · Scale and architecture (Lead level)
### Scaling: stateless services, cluster, worker_threads, PM2, load balancers
#### In one line
Scale by running many identical, stateless copies behind a load balancer, and push CPU-heavy work to workers.

#### Real-life analogy
A supermarket opening more checkout lanes (horizontal) versus hiring one superhuman cashier (vertical). More lanes work only if any lane can serve any customer, which means no customer-specific state stuck in one lane.

#### How it works
- **Vertical**: bigger machine; simple, but has a ceiling and is a single point of failure.
- **Horizontal**: more instances behind an ALB/Nginx; needs **statelessness**.
- Make services stateless: sessions in Redis/JWT, uploads in S3, cache in Redis, jobs in queues.
- **cluster/PM2**: one process per CPU core on a VM. In **containers**, prefer one process per container and let ECS/Kubernetes scale replicas.
- **worker_threads**: CPU tasks inside a process (image resize, parsing).
- Scale the **database** too: indexes, read replicas, pooling limits, caching.
- Autoscale on CPU, latency or queue depth; health checks remove bad instances.

#### Example
¦¦¦js
// Offload CPU work so the main loop stays responsive
import { Worker } from 'node:worker_threads';

export const resizeImage = (file) => new Promise((resolve, reject) => {
  const w = new Worker(new URL('./resize-worker.js', import.meta.url), { workerData: { file } });
  w.once('message', resolve);
  w.once('error', reject);
});
¦¦¦
¦¦¦text
Client -> ALB -> [API x N containers (stateless)]
                    |-> Redis (sessions, cache, queues)
                    |-> MySQL primary + read replicas
                    |-> S3 (files)
¦¦¦

#### Remember it
**"Stateless + shared stores + more copies + health checks."**

| Move | Where |
|---|---|
| Session | Redis / JWT |
| Files | S3 |
| Slow tasks | Queue + workers |
| CPU work | worker_threads |

#### Common mistakes
- In-memory sessions or local-disk uploads (break behind a load balancer).
- Scaling the API but ignoring DB connection limits.
- Running ¦cluster¦ inside every container.

#### Interview angle
**Q:** "How do you scale a Node API?" **Say:** "Keep it stateless, run multiple containers behind a load balancer with autoscaling and health checks, move sessions and cache to Redis, files to S3, slow work to queues, and scale the database with indexes, pooling and replicas." **Follow-up:** Where does the first bottleneck usually appear?

### Performance diagnosis: clinic.js, --cpu-prof, heap snapshots, p95/p99
#### In one line
Measure first, find the real bottleneck (CPU, event loop, DB, network, memory), then fix it and re-measure.

#### Real-life analogy
A doctor does not prescribe before running tests. Metrics are the vitals, profilers are the scans.

#### How it works
1. **Define the symptom**: which endpoint, p95/p99 latency, error rate, since when (deploy?).
2. **Metrics/APM**: is it CPU, memory, DB time, or downstream calls?
3. **Event-loop lag** high -> CPU-bound code; profile with ¦node --cpu-prof¦ or ¦clinic flame¦.
4. **DB slow** -> slow query log, ¦EXPLAIN¦, missing index, N+1.
5. **Memory growing** -> heap snapshots (compare two), look for retained objects, listeners, unbounded caches.
6. **Load test** (autocannon, k6) before/after the fix.
- Use **percentiles**, not averages: p99 shows what unlucky users experience.

#### Example
¦¦¦bash
# CPU profile for 30s while load-testing
node --cpu-prof --cpu-prof-dir=./prof src/server.js &
npx autocannon -c 50 -d 30 http://localhost:3000/courses
# open the .cpuprofile in Chrome DevTools -> Performance, find the hot function

# Quick visual flame graph
npx clinic flame -- node src/server.js
¦¦¦
¦¦¦text
Before: GET /courses p95 = 1200 ms (N+1: 1 + 50 queries)
Fix:    single JOIN + index on enrolments(course_id)
After:  p95 = 180 ms, DB queries per request: 1
¦¦¦

#### Remember it
**"Symptom -> Measure -> Isolate -> Fix -> Re-measure."** Averages lie; watch **p95/p99**.

#### Common mistakes
- Guessing and optimising without a profile.
- Looking only at averages.
- Testing on a tiny dataset that hides query problems.

#### Interview angle
**Q:** "Describe how you fixed a slow endpoint." **Say:** "I confirmed the p95 regression, checked metrics and traces that showed 90% of time in the DB, found an N+1 with the query log, replaced it with a join and an index, load-tested, and saw p95 drop from about a second to under 200 ms." **Follow-up:** How do you find a memory leak?

### Architecture styles: layered, hexagonal, modular monolith, microservices
#### In one line
Choose how to divide code and deployables based on team size, domain boundaries and operational maturity, not fashion.

#### Real-life analogy
A house vs an apartment block vs a village. One house is simple to manage; a village (microservices) has independent homes but needs roads, rules and a town council (networking, tracing, deployment).

#### How it works
- **Layered**: routes -> services -> repos; simple and common.
- **Hexagonal (ports & adapters)**: domain core independent of DB/HTTP; adapters plug in; great for testing.
- **Modular monolith**: one deployable, strict module boundaries (own tables, public interfaces). Best default for small-mid teams.
- **Microservices**: independent deploy/scale per service; costs: network failures, distributed data consistency, observability, more DevOps.
- Split when: independent scaling, different team ownership, different release cadence. Not just because the code is big.

| Style | Team size | Complexity |
|---|---|---|
| Layered monolith | 1-8 | low |
| Modular monolith | 5-30 | medium |
| Microservices | 30+ or many teams | high |

#### Example
¦¦¦text
src/
  modules/
    courses/   index.js  (public API)  service/  repo/  routes/
    learners/  index.js  service/  repo/  routes/
    billing/   ...
Rule: learners may call courses/index.js only, never courses/repo directly.
¦¦¦
¦¦¦js
// ESLint boundary rule idea: block imports across module internals
// 'no-restricted-imports': ['error', { patterns: ['**/modules/*/repo/*'] }]
¦¦¦

#### Remember it
**"Start monolith, modularise, extract only with a reason."**

#### Common mistakes
- Microservices on day one for a team of 8.
- A "distributed monolith": services sharing one database and deploying together.
- Hexagonal ceremony for a CRUD app.

#### Interview angle
**Q:** "Monolith or microservices?" **Say:** "For our team size I would use a modular monolith with clear boundaries and extract a service only when it needs independent scaling or ownership. Microservices bring consistency, observability and deployment costs we must be ready to pay." **Follow-up:** How would you extract a module later?

### Event-driven systems: SNS/SQS, Kafka, at-least-once, outbox, sagas
#### In one line
Services communicate by publishing events and reacting to them, which decouples them but means handling duplicates and eventual consistency.

#### Real-life analogy
A noticeboard in an office. HR posts "New hire joined"; IT, payroll and facilities each read it and act on their own time. HR does not call each department.

#### How it works
- **Queue (SQS)**: one consumer group processes each message. **Topic (SNS/Kafka)**: many subscribers.
- Delivery is usually **at-least-once**, so consumers must be **idempotent** (dedupe by event ID).
- **Outbox pattern**: write the business change *and* the event to the same DB transaction; a relay publishes the event. Avoids "saved but never published".
- **Saga**: a multi-step business transaction across services with **compensating actions** instead of a distributed ACID transaction.
- Use **dead-letter queues**, retries with backoff, and schemas/versioning for events.

#### Example
¦¦¦js
// Outbox: atomic write
await sequelize.transaction(async (t) => {
  const enrolment = await Enrolment.create({ userId, courseId }, { transaction: t });
  await Outbox.create({
    id: crypto.randomUUID(), type: 'enrolment.created',
    payload: { enrolmentId: enrolment.id }, publishedAt: null,
  }, { transaction: t });
});
// A relay job polls Outbox WHERE publishedAt IS NULL and publishes to SNS, then marks it published.

// Idempotent consumer
async function handle(event) {
  if (await processedEvents.exists(event.id)) return;   // duplicate -> ignore
  await sendWelcomeEmail(event.payload);
  await processedEvents.add(event.id);
}
¦¦¦

#### Remember it
**"At-least-once means idempotent consumers. Outbox = DB + event in one transaction. Saga = undo steps instead of rollback."**

#### Common mistakes
- Publishing the event after commit without outbox (can be lost).
- Assuming exactly-once delivery.
- Ignoring event ordering and schema changes.

#### Interview angle
**Q:** "How do you keep data consistent across services?" **Say:** "I avoid distributed transactions: write state and an outbox event atomically, publish asynchronously, make consumers idempotent, and use sagas with compensating steps for multi-service workflows." **Follow-up:** SQS vs Kafka?

### Real-time: WebSockets, Socket.IO, Server-Sent Events
#### In one line
Push data to browsers as it happens, using a persistent connection, instead of the client asking repeatedly.

#### Real-life analogy
Polling is calling the pizza shop every minute asking "ready yet?". WebSockets/SSE is the shop calling you when it is ready.

#### How it works
| Option | Direction | Best for |
|---|---|---|
| Polling | client asks | simple, infrequent updates |
| SSE | server -> client | notifications, progress, live feeds |
| WebSocket | two-way | chat, collaboration, games |

- SSE runs over plain HTTP, auto-reconnects, simple. WebSocket needs sticky or shared state to scale.
- **Scaling**: many instances -> use a **pub/sub adapter** (Redis) so a message reaches clients on other instances; load balancer must support WS upgrade and idle timeouts.
- Authenticate on connect, heartbeat/ping, limit message size.

#### Example
¦¦¦js
// Server-Sent Events: video-processing progress
app.get('/jobs/:id/events', auth(), (req, res) => {
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
  res.flushHeaders();

  const send = (data) => res.write(¦data: §{JSON.stringify(data)}\n\n¦);
  const unsubscribe = progressBus.subscribe(req.params.id, send);   // e.g. Redis pub/sub

  req.on('close', unsubscribe);                                      // cleanup
});
// Browser: const es = new EventSource('/jobs/7/events'); es.onmessage = e => update(JSON.parse(e.data));
¦¦¦

#### Remember it
**"Need two-way? WebSocket. Only server pushes? SSE. Rare updates? Poll."**

#### Common mistakes
- Using WebSockets when polling every 30s is enough.
- Not cleaning up listeners on disconnect (leaks).
- Scaling to many instances without a shared pub/sub.

#### Interview angle
**Q:** "WebSockets vs SSE vs polling?" **Say:** "Polling for rare updates, SSE for one-way push like notifications and progress, WebSockets when I need two-way low-latency messaging. At scale I add a Redis adapter so all instances can reach all clients." **Follow-up:** How do you authenticate a WebSocket?

### Reliability patterns: timeouts, retries, circuit breaker, graceful shutdown
#### In one line
Assume dependencies fail and design so one slow or broken service does not take down everything.

#### Real-life analogy
Electrical fuses and circuit breakers in a home: when one appliance shorts, the breaker trips so the whole house does not burn. Retrying a tripped breaker repeatedly is the wrong fix.

#### How it works
- **Timeouts** on every outbound call (¦AbortSignal.timeout(2000)¦). Without them, requests pile up.
- **Retries** only for safe/idempotent operations, with **exponential backoff + jitter** and a max count.
- **Circuit breaker**: after N failures, *open* (fail fast), after a cool-down *half-open* test, then close. Prevents cascading failure.
- **Bulkheads/limits**: cap concurrency per dependency.
- **Fallbacks**: cached/default data when possible.
- **Graceful shutdown**: on SIGTERM stop accepting, finish in-flight requests, close DB/queues, then exit. **Readiness probe** goes false first.

#### Example
¦¦¦js
async function callWithRetry(fn, { retries = 3, base = 200 } = {}) {
  for (let attempt = 0; ; attempt++) {
    try { return await fn(AbortSignal.timeout(2000)); }        // timeout every call
    catch (err) {
      if (attempt >= retries) throw err;
      const wait = base * 2 ** attempt + Math.random() * 100;  // backoff + jitter
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}

// Graceful shutdown
const server = app.listen(env.PORT);
process.on('SIGTERM', () => {
  ready = false;                                   // /ready now returns 503
  server.close(async () => { await pool.end(); process.exit(0); });
  setTimeout(() => process.exit(1), 10_000).unref(); // hard stop safety net
});
¦¦¦

#### Remember it
**"Timeout, Retry (with backoff), Break, Drain."** Retries multiply load: protect with limits.

#### Common mistakes
- Retrying non-idempotent POSTs blindly.
- Retry storms without jitter.
- Ignoring SIGTERM so deploys drop requests.

#### Interview angle
**Q:** "Prevent cascading failures?" **Say:** "Timeouts on every call, bounded retries with backoff and jitter on idempotent operations, a circuit breaker to fail fast, concurrency limits, and graceful shutdown with readiness probes." **Follow-up:** What is a retry storm?

### Observability: structured logs, metrics, distributed tracing (OpenTelemetry)
#### In one line
Logs, metrics and traces together let you ask new questions about production without redeploying.

#### Real-life analogy
Package tracking. Logs are scan events, metrics are the overall delivery statistics, and a trace is the full journey of one parcel through every warehouse.

#### How it works
- **Logs**: events with context (JSON).
- **Metrics**: numbers over time (RED: Rate, Errors, Duration; USE for resources).
- **Traces**: a request across services as **spans** sharing a **trace ID**, propagated via headers (¦traceparent¦).
- **OpenTelemetry (OTel)**: vendor-neutral SDK for all three; export to Datadog, X-Ray, Grafana, etc.
- Link them: put ¦traceId¦ in log lines.
- Define **SLOs** (e.g. 99.9% of requests under 500 ms) and alert on burn rate.

#### Example
¦¦¦js
// tracing.js — load first: node --import ./tracing.js src/server.js
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

new NodeSDK({
  serviceName: 'learning-api',
  traceExporter: new OTLPTraceExporter({ url: env.OTEL_URL }),
  instrumentations: [getNodeAutoInstrumentations()],   // express, http, mysql2 auto-traced
}).start();
// Trace: API 480ms -> mysql 410ms (SELECT ... courses) => DB is the culprit
¦¦¦

#### Remember it
**"Logs = what, metrics = how much, traces = where."** RED for services.

#### Common mistakes
- Only logs, no metrics/alerts.
- Not propagating trace headers across services.
- Alerting on causes (CPU 70%) instead of user symptoms.

#### Interview angle
**Q:** "How do you trace a request across services?" **Say:** "OpenTelemetry auto-instrumentation creates spans and propagates a trace ID header; I include the trace ID in logs and view the waterfall to see which hop is slow." **Follow-up:** What SLOs would you set?

### Alternatives: Fastify, NestJS, GraphQL, tRPC, BFF pattern
#### In one line
Know the main options and their trade-offs, so you pick tools for the problem rather than habit.

#### Real-life analogy
Vehicles: Express is a reliable bicycle (simple, flexible), Fastify a faster road bike, NestJS a bus with fixed seating (structure for big teams), GraphQL a taxi where you choose the exact route.

#### How it works
| Tool | Strength | Trade-off |
|---|---|---|
| Express | Simple, huge ecosystem | You design structure yourself |
| Fastify | Faster, schema validation, plugins | Smaller ecosystem |
| NestJS | Modules, DI, decorators, opinionated TS | Learning curve, boilerplate |
| GraphQL | Client picks fields, one endpoint | Caching, N+1, complexity, auth per field |
| tRPC | End-to-end TS types, no schema step | TS-only full-stack monorepo |
| BFF | API tailored per client (web/mobile) | One more service to maintain |

- Pick for **team skill, problem shape, and maintenance**.
- **BFF**: a thin backend per frontend that aggregates microservice calls and shapes data.

#### Example
¦¦¦js
// Fastify: schema gives validation + fast serialisation
import Fastify from 'fastify';
const app = Fastify({ logger: true });

app.get('/courses/:id', {
  schema: { params: { type: 'object', properties: { id: { type: 'integer' } } },
            response: { 200: { type: 'object', properties: { id: { type: 'integer' }, title: { type: 'string' } } } } },
}, async (req) => getCourse(req.params.id));

await app.listen({ port: 3000 });
¦¦¦

#### Remember it
**"Express = freedom, Nest = structure, Fastify = speed, GraphQL = flexibility, tRPC = shared types."**

#### Common mistakes
- Rewriting a working Express API for tiny gains.
- GraphQL without dataloaders (N+1 explosion).
- Dogmatic opinions instead of trade-offs.

#### Interview angle
**Q:** "Why Express and not NestJS?" **Say:** "Express is simple and fits our team's experience. For a larger team I would consider NestJS for built-in structure and DI; Fastify when throughput matters. I choose on team and requirements, and keep the architecture layered either way." **Follow-up:** When is GraphQL worth it?

### Modern Node features: fetch, node:test, --watch, --env-file, ESM, permissions
#### In one line
Recent Node versions include many things you once installed as packages, so use the current LTS and drop needless dependencies.

#### Real-life analogy
Your phone's built-in flashlight and calculator: you no longer download separate gadgets for them.

#### How it works
| Feature | Replaces |
|---|---|
| Global ¦fetch¦ | axios / node-fetch (simple calls) |
| ¦node:test¦ + ¦node --test¦ | small Jest setups |
| ¦node --watch¦ | nodemon |
| ¦node --env-file=.env¦ | dotenv |
| ESM + top-level ¦await¦ | CJS boilerplate |
| Web Streams, ¦AbortSignal.timeout¦ | custom timers |
| ¦--permission¦ model | (limit fs/network/child process access) |
| ¦structuredClone¦, ¦crypto.randomUUID¦ | lodash cloneDeep, uuid |
| ¦import.meta.dirname¦ | ¦__dirname¦ |

- Run on the **active LTS** (22). Even versions become LTS; odd are short-lived.
- Many packages still help (retries, interceptors in axios); do not remove tools blindly.

#### Example
¦¦¦js
// Node 22: no extra packages
import { test } from 'node:test';
import assert from 'node:assert/strict';

const res = await fetch('https://api.example.com/health', { signal: AbortSignal.timeout(2000) });
const data = await res.json();

test('health is ok', () => assert.equal(data.status, 'ok'));
// run: node --env-file=.env --watch --test
¦¦¦

#### Remember it
**"fetch, test, watch, env-file, ESM, permissions"**: built-ins that replace axios, jest(small), nodemon, dotenv.

#### Common mistakes
- Staying on an end-of-life Node version.
- Assuming ¦fetch¦ throws on 404 (it only rejects on network errors; check ¦res.ok¦).
- Removing libraries without checking features.

#### Interview angle
**Q:** "Which modern Node features do you use?" **Say:** "Built-in fetch with AbortSignal timeouts, ¦--env-file¦ and ¦--watch¦ for local dev, ESM with top-level await, ¦node:test¦ for small packages, and I keep the project on the active LTS." **Follow-up:** What does the permission model do?

### Compliance and data protection for healthcare: encryption, audit logs, PII
#### In one line
Handle personal and health-related data so only the right people see it, everything sensitive is encrypted, and every access can be proven.

#### Real-life analogy
A hospital records room: locked, visitors sign a log, staff see only the files they need, and old files are destroyed on schedule.

#### How it works
- **Classify data**: PII/PHI (names, emails, health info) vs public.
- **Encryption**: TLS in transit; at rest (RDS/S3 encryption with KMS); field-level encryption for the most sensitive values.
- **Least privilege**: RBAC, per-record checks, narrow IAM roles and DB users.
- **Audit logs**: who accessed/changed what and when; append-only, tamper-resistant, retained per policy.
- **Minimise & mask**: collect less, mask in logs and non-prod; use synthetic data in dev.
- **Retention & deletion**: delete or anonymise per policy; support data-subject requests (GDPR); backups encrypted.
- Know the regimes: **HIPAA** (US health), **GDPR** (EU). Follow your organisation's compliance guidance; do not claim certification yourself.

#### Example
¦¦¦js
// Audit log on sensitive reads
export const audit = (action) => async (req, _res, next) => {
  await AuditLog.create({
    actorId: req.user.id, action, resource: req.originalUrl,
    ip: req.ip, requestId: req.id, at: new Date(),
  });
  next();
};
app.get('/learners/:id/records', auth('admin', 'instructor'), audit('READ_LEARNER_RECORD'), getRecords);

// Never log PII: pino redact
// pino({ redact: ['req.body.email', 'req.body.password', 'req.headers.authorization'] })
¦¦¦

#### Remember it
**"Classify, Encrypt, Limit, Log, Delete."**

#### Common mistakes
- PII in logs, error messages or analytics.
- Production data copied into dev databases.
- Audit logs that admins can edit.

#### Interview angle
**Q:** "How do you protect sensitive data in your platform?" **Say:** "Classify it, encrypt in transit and at rest, enforce least privilege and per-record authorisation, redact logs, keep immutable audit trails, use synthetic data outside production and follow retention and deletion policy set by compliance." **Follow-up:** How do you handle a data-deletion request?
`;
