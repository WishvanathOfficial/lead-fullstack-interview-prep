window.PREP_NOTES = window.PREP_NOTES || {};
window.PREP_NOTES.deployment = String.raw`
## Phase 1 · Foundations (Basic)
### Git essentials: commit, branch, merge, rebase, stash, cherry-pick, tags
#### In one line
Git records snapshots of your code as commits on branches, so many people can work in parallel and combine the results safely.

#### Real-life analogy
Think of a shared Google Doc where every save is a numbered checkpoint. A **branch** is a photocopy you edit privately; **merge** staples your pages back into the original; **rebase** re-writes your pages as if you had started from the newest original.

#### How it works
- **commit**: a snapshot plus message plus pointer to its parent.
- **branch**: a movable label pointing at a commit (cheap, create freely).
- **merge**: joins two histories; creates a *merge commit* (keeps real history, can look noisy).
- **rebase**: replays your commits on top of another branch (linear history, but it *rewrites* commit IDs).
- **stash**: parks uncommitted work in a drawer so you can switch branches.
- **cherry-pick**: copies one commit onto the current branch (hotfix to a release branch).
- **tag**: a permanent name for a commit, e.g. ¦v1.4.0¦, used for releases.
- Golden rule: **never rebase commits other people already pulled** (shared branches).

#### Example
¦¦¦bash
git switch -c feature/course-filter      # new branch from current commit
git add -p && git commit -m "feat: course filter"
git fetch origin
git rebase origin/main                   # replay my commits on latest main (my private branch: safe)
git push --force-with-lease              # safer than --force after a rebase
git stash push -m "wip search"           # park changes
git switch main && git stash pop         # bring them back
git cherry-pick 3f2a1bc                  # copy one fix onto this branch
git tag -a v1.4.0 -m "Release 1.4.0" && git push origin v1.4.0
¦¦¦

#### Remember it
| Need | Use |
|---|---|
| Keep exact history, shared branch | merge |
| Clean linear history, private branch | rebase |
| One fix on another branch | cherry-pick |
| Park work | stash |
Mnemonic: **"Rebase private, merge public."**

#### Common mistakes
- Rebasing a branch teammates already pulled, then force-pushing with plain ¦--force¦.
- Giant commits with messages like "fix". Commit small, with a reason.
- Forgetting ¦git fetch¦ before comparing with the remote.

#### Interview angle
*Merge vs rebase?* "Merge preserves history and is safe on shared branches. Rebase gives a linear history but rewrites commits, so I only rebase my own unshared branch, then use ¦--force-with-lease¦. We squash-merge PRs into main for a clean log." Follow-up: *What does ¦--force-with-lease¦ protect against?* (Overwriting someone else's new commits.)

### Undoing things safely: restore, reset (soft/mixed/hard), revert, reflog
#### In one line
Git gives you a different undo tool for each situation: discard file edits, move the branch back, or add a new commit that cancels an old one.

#### Real-life analogy
Like a document with undo options: *restore* = erase a pencil mark, *reset* = tear out recent pages, *revert* = stick a new page saying "ignore page 5", *reflog* = the recycle bin that remembers every place you have been.

#### How it works
- ¦git restore file¦: throw away uncommitted changes in a file.
- ¦git restore --staged file¦: unstage but keep the edit.
- ¦git reset --soft HEAD~1¦: undo the commit, keep changes **staged**.
- ¦git reset --mixed HEAD~1¦ (default): undo the commit, keep changes **unstaged**.
- ¦git reset --hard HEAD~1¦: undo the commit **and delete changes** (dangerous).
- ¦git revert <sha>¦: new commit that reverses an old one. **Safe for shared branches.**
- ¦git reflog¦: log of where HEAD has been, even after a hard reset; recovers "lost" commits for ~90 days.

#### Example
¦¦¦bash
# Oops: I ran a hard reset and lost my last commit
git reset --hard HEAD~1
git reflog                       # shows: a1b2c3d HEAD@{1}: commit: add payment retry
git reset --hard a1b2c3d         # commit is back

# A bad commit is already on main and deployed: do NOT reset, revert
git revert 9e8d7c6               # creates a new commit that undoes it
git push origin main             # CI/CD redeploys the fixed state
¦¦¦

#### Remember it
- **Not pushed yet** → reset is fine. **Already pushed/shared** → revert.
- soft = keep staged, mixed = keep files, hard = lose files.
- Lost something? **reflog first, panic never.**

#### Common mistakes
- Using ¦reset --hard¦ with uncommitted work you still need.
- Resetting a shared branch and force-pushing, breaking everyone's clone.
- Not knowing reflog exists.

#### Interview angle
*A bad commit reached production; what do you do?* "I revert it so history stays intact and the pipeline redeploys quickly, then fix forward with a test. I only use reset on local, unpushed work." Follow-up: *How do you recover a commit after a hard reset?* (Find the SHA in ¦git reflog¦ and reset or branch to it.)

### Branching and PR workflow: GitHub Flow, Git Flow, trunk-based, protected branches, CODEOWNERS
#### In one line
A branching strategy is the team agreement on how code moves from a developer's laptop to production safely.

#### Real-life analogy
Like an airport: everyone can prepare luggage (feature branches), but all bags pass the same security gate (pull request + checks) before boarding the plane (main/production).

#### How it works
- **GitHub Flow**: ¦main¦ is always deployable; short feature branch → PR → review + CI → merge → deploy. Simple, great for web apps.
- **Git Flow**: long-lived ¦develop¦, ¦release/*¦, ¦hotfix/*¦ branches. Suits versioned products with scheduled releases; heavier.
- **Trunk-based**: tiny branches (<1 day) merged to ¦main¦ often, unfinished work hidden behind **feature flags**. Best for fast CI/CD.
- **Protected branches**: require PR, passing checks, approvals, no force-push.
- **CODEOWNERS**: file mapping paths to reviewers, e.g. ¦/infra/ @devops-team¦, auto-requested on PRs.

#### Example
¦¦¦text
# .github/CODEOWNERS
*                @org/frontend-leads
/server/db/      @org/backend-leads @org/dba
/.github/        @org/platform
¦¦¦
¦¦¦text
Branch protection on main:
  [x] Require pull request, 1-2 approvals
  [x] Require status checks: lint, test, build
  [x] Require review from Code Owners
  [x] Block force pushes, linear history (squash merge)
¦¦¦

#### Remember it
| Strategy | Branch life | Best for |
|---|---|---|
| GitHub Flow | days | web apps, continuous delivery |
| Git Flow | weeks | packaged/versioned releases |
| Trunk-based | hours | mature CI, feature flags |
Rule: **short branches, small PRs, always-green main.**

#### Common mistakes
- Long-lived feature branches that become painful merges.
- Protected branch without required checks (the rule is then decoration).
- Huge PRs nobody reviews properly.

#### Interview angle
*Which strategy and why?* "We use GitHub Flow with protected main, required CI, one or two reviewers and CODEOWNERS for sensitive areas, with squash merges. It keeps main deployable and reviews small. For risky features we use flags." Follow-up: *When would you choose Git Flow?* (Multiple supported versions or scheduled release trains.)

### Linux and shell basics: files, permissions, ssh, grep, curl, systemd, env vars
#### In one line
Most servers run Linux, so you must be able to move around, read logs, check permissions and restart services from a terminal.

#### Real-life analogy
The terminal is the service desk of a building: you ask precise questions ("who owns this room?", "what happened at 3pm?") and give precise instructions ("restart the lift").

#### How it works
- Navigate: ¦ls -la¦, ¦cd¦, ¦pwd¦, ¦cat¦, ¦tail -f¦ (follow a log).
- Search: ¦grep -rn "ERROR" /var/log/app¦, pipe with ¦|¦ (¦ps aux | grep node¦).
- **Permissions** ¦rwx¦ for owner/group/others: ¦chmod 640 file¦ (4=read, 2=write, 1=execute); ¦chown user:group file¦.
- **ssh**: ¦ssh -i key.pem ec2-user@host¦; key file must be ¦chmod 400¦.
- **curl**: test endpoints and headers: ¦curl -I https://api.example.com/health¦.
- **systemd**: manages services: ¦systemctl status|restart|enable myapp¦; logs via ¦journalctl -u myapp -f¦.
- **Env vars**: ¦export NODE_ENV=production¦, read in Node via ¦process.env¦.

#### Example
¦¦¦bash
# API on EC2 returns 502; investigate
ssh -i ~/.ssh/prod.pem ec2-user@10.0.1.25
systemctl status clinical-api          # inactive (failed)
journalctl -u clinical-api -n 50       # "Error: connect ECONNREFUSED 10.0.2.9:3306"
nc -zv 10.0.2.9 3306                   # connection refused -> DB security group issue
df -h; free -m; top                    # disk, memory, CPU sanity check
¦¦¦
¦¦¦ini
# /etc/systemd/system/clinical-api.service
[Service]
User=app
WorkingDirectory=/srv/api
EnvironmentFile=/etc/clinical-api.env
ExecStart=/usr/bin/node dist/server.js
Restart=always
¦¦¦

#### Remember it
- **Where, who, what, why**: ¦pwd¦/¦ls¦, ¦ps¦/¦top¦, ¦journalctl¦/¦tail¦, ¦curl¦.
- Permission numbers: **4 read, 2 write, 1 execute**; 755 = rwxr-xr-x, 600 = private file.
- Secrets files: ¦chmod 600¦, never 777.

#### Common mistakes
- ¦chmod 777¦ to "make it work".
- Running the app as root.
- Forgetting env vars are per-process; a service does not see your shell's ¦export¦.

#### Interview angle
*The API is down on a server, what do you check?* "Service status and logs with systemctl and journalctl, then port listening with ¦ss -tlnp¦, then dependencies (DB reachability), then disk, memory and recent deploys." Follow-up: *How do you keep an app running after reboot?* (¦systemctl enable¦ and ¦Restart=always¦.)

### Web basics for deployment: DNS, HTTP/HTTPS, TLS, ports, reverse proxy, CDN
#### In one line
When a user opens your site, DNS finds the server, TLS secures the connection, a reverse proxy routes the request and a CDN serves cached copies close to the user.

#### Real-life analogy
DNS is the phone book, TLS is a sealed envelope with an ID check, the reverse proxy is the receptionist who sends visitors to the right department, and the CDN is a local branch office that keeps copies of popular documents.

#### How it works
1. Browser asks DNS for ¦app.example.com¦ → gets an IP (or CloudFront address).
2. TCP connection to port **443** (HTTP is 80).
3. **TLS handshake**: server shows a certificate (issued by a CA, e.g. ACM); browser verifies, both agree on keys.
4. Request reaches the **load balancer/reverse proxy** (ALB or Nginx), which forwards to Node on port 3000 and terminates TLS.
5. Static files come from the **CDN edge** cache; API calls go to the origin.
- DNS record types: **A** (name→IPv4), **CNAME** (alias), **ALIAS** for AWS resources at the root domain.

#### Example
¦¦¦text
User -> DNS (Route 53) -> CloudFront (edge cache, HTTPS, ACM cert)
                               |-- /assets/*  -> S3 bucket (React build)
                               |-- /api/*     -> ALB -> Node (port 3000) -> MySQL (RDS)
¦¦¦
¦¦¦bash
dig +short app.example.com            # which IP/alias?
curl -I https://app.example.com       # status, cache-control, server headers
openssl s_client -connect app.example.com:443 | openssl x509 -noout -dates   # certificate expiry
¦¦¦

#### Remember it
- **DNS → TCP → TLS → Proxy → App**.
- Ports: 80 HTTP, 443 HTTPS, 22 SSH, 3306 MySQL, 5432 Postgres.
- Certificates **expire**; automate renewal (ACM/Let's Encrypt).

#### Common mistakes
- Forgetting DNS TTL: changes take time to propagate.
- Expired certificate or missing intermediate chain.
- Exposing the app port (3000) directly to the internet.

#### Interview angle
*What happens when you type a URL?* "DNS resolves the name, the browser opens TCP and a TLS handshake on 443, the request hits CDN or load balancer, which forwards to the app; the response comes back and the browser renders it." Follow-up: *Why a reverse proxy?* (TLS termination, routing, compression, caching, load balancing, hiding internal servers.)

### Build and package: npm ci, build artefacts, env configuration, static vs server apps
#### In one line
A build turns your source code into a deployable artefact: a folder of static files for React, or a runnable bundle plus dependencies for Node.

#### Real-life analogy
Like baking: source code is the raw recipe and ingredients; the build is the oven; the artefact is the finished cake you box up and deliver. You do not ship the kitchen.

#### How it works
- **¦npm ci¦** installs exactly the lockfile versions (clean, repeatable, fails if lock is out of sync). Use it in CI, not ¦npm install¦.
- **React build** (¦npm run build¦) outputs ¦dist/¦ or ¦build/¦: HTML, hashed JS/CSS (¦app.4f9a1c.js¦). It is **static**; any web server or CDN can serve it.
- Frontend env variables (¦VITE_API_URL¦) are **baked into the bundle at build time** and are public. Never put secrets there.
- **Node API** is a *server app*: needs Node runtime, ¦node_modules¦ (production only), and runtime env vars. TypeScript is compiled to ¦dist/¦ first.
- Package the artefact (zip/Docker image) with a version, e.g. the git SHA.

#### Example
¦¦¦bash
npm ci                         # exact versions from package-lock.json
npm run lint && npm test
npm run build                  # React -> dist/ (index.html + assets/app.4f9a1c.js)
npm prune --omit=dev           # API: drop dev dependencies
zip -r api-$GIT_SHA.zip dist package.json package-lock.json
¦¦¦
¦¦¦text
dist/
  index.html            (never cache)
  assets/app.4f9a1c.js  (cache for 1 year: hash changes when content changes)
¦¦¦

#### Remember it
| | React SPA | Node API |
|---|---|---|
| Type | static files | running process |
| Hosting | S3/CloudFront/Nginx | EC2/ECS/Heroku |
| Config | build time (public) | runtime (secret ok) |
Rule: **¦npm ci¦ in CI, build once, ship the artefact.**

#### Common mistakes
- Using ¦npm install¦ in CI and getting different versions.
- Putting API secrets in ¦VITE_¦/¦REACT_APP_¦ variables.
- Shipping ¦node_modules¦ with dev dependencies or rebuilding on the server.

#### Interview angle
*¦npm ci¦ vs ¦npm install¦?* "¦npm ci¦ deletes node_modules and installs exactly from the lockfile, so builds are reproducible and fail on drift; ¦npm install¦ may update the lock." Follow-up: *How does a React app know the API URL per environment?* (Build-time variables, or load a runtime ¦config.json¦ so one build serves all environments.)

### Environments and configuration: dev, test, staging, prod, 12-factor config, secrets
#### In one line
Run the same build in several environments and change only the configuration, keeping secrets out of the code.

#### Real-life analogy
Same car model (the build) driven on a test track, a rehearsal road and the public highway; only the route (config) and the key (secret) differ.

#### How it works
- **dev**: your laptop. **test/CI**: automated checks. **staging**: production-like rehearsal with realistic data (anonymised). **prod**: real users.
- **12-factor config**: store config in the **environment**, not in code. *Build once, configure per environment.*
- Config examples: DB host, API URLs, feature flags, log level. Secrets: DB password, API keys, JWT secret.
- Secrets live in a manager (SSM Parameter Store, Secrets Manager, Octopus sensitive variables, GitHub secrets), are injected at deploy/runtime and are **rotated**.
- Keep ¦.env¦ files out of git (¦.gitignore¦) and commit a ¦.env.example¦.

#### Example
¦¦¦js
// config.js: fail fast if something is missing
const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET'];
for (const k of required) if (!process.env[k]) throw new Error('Missing env var ' + k);
module.exports = {
  env: process.env.NODE_ENV || 'development',
  db: { host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD },
  jwtSecret: process.env.JWT_SECRET,
};
¦¦¦
¦¦¦text
Same artifact  api-9f3c2e1.zip
  staging: DB_HOST=stg-db.internal   JWT_SECRET from Secrets Manager (stg)
  prod:    DB_HOST=prod-db.internal  JWT_SECRET from Secrets Manager (prod)
¦¦¦

#### Remember it
- **Code same, config different.**
- Secrets: never in git, logs, images or front-end bundles.
- Staging must mirror prod (same OS, DB version, topology) or it lies to you.

#### Common mistakes
- Different build per environment, so what you tested is not what you ship.
- Committing ¦.env¦; reusing prod secrets in dev.
- Staging with a different DB version, hiding bugs.

#### Interview angle
*How do you manage secrets across environments?* "Same artefact promoted through environments; config via env vars, secrets in Secrets Manager or Octopus sensitive variables, scoped per environment, injected at deploy time, with rotation and no secrets in git." Follow-up: *What if a secret leaks?* (Rotate immediately, revoke, audit usage, remove from git history, add secret scanning.)

### Heroku deployment: Procfile, dynos, config vars, buildpacks, release phase
#### In one line
Heroku is a platform-as-a-service: you push code and it builds, runs and scales it for you without you managing servers.

#### Real-life analogy
Renting a fully furnished serviced apartment: quick to move in, utilities included, but you cannot knock down walls and it costs more per month than owning.

#### How it works
- **Push to deploy**: ¦git push heroku main¦ (or GitHub integration / pipeline).
- **Buildpack** detects Node, runs ¦npm ci¦ and ¦npm run build¦, creates a **slug**.
- **Procfile** declares process types: ¦web¦ (receives traffic), ¦worker¦ (background jobs).
- **Dynos** are lightweight containers running those processes; scale with ¦heroku ps:scale web=2¦.
- **Config vars** are the environment variables (secrets).
- **Release phase** runs a command (e.g. DB migrations) before the new release goes live.
- Add-ons: managed DB (ClearDB/JawsDB for MySQL, Postgres), Redis, logging.
- Limits: filesystem is **ephemeral**, dyno restarts daily, cost grows, less network control than AWS.

#### Example
¦¦¦text
# Procfile
release: npx sequelize-cli db:migrate
web: node dist/server.js
worker: node dist/jobs/worker.js
¦¦¦
¦¦¦bash
heroku config:set NODE_ENV=production JWT_SECRET=*** -a clinical-api-stg
git push heroku main                 # build -> release (migrate) -> web dynos swap
heroku logs --tail -a clinical-api-stg
heroku releases:rollback v41 -a clinical-api-stg   # quick rollback
¦¦¦

#### Remember it
- **Procfile = what to run, config vars = settings, buildpack = how to build, release = pre-flight task.**
- Listen on ¦process.env.PORT¦, not a fixed port.
- Ephemeral disk: store uploads in S3.

#### Common mistakes
- Hard-coding the port or writing uploads to local disk.
- Running migrations manually instead of the release phase.
- Using free/hobby dynos for production (they sleep).

#### Interview angle
*Why Heroku vs AWS?* "Heroku gives fast setup and low ops effort, ideal for MVPs or staging. As scale, compliance and cost control grow, AWS gives more control over networking, IAM and pricing; we used Heroku for X and AWS for Y." Follow-up: *How do you roll back on Heroku?* (¦heroku releases:rollback¦; remember DB migrations are not rolled back automatically.)

### Docker basics: images, containers, Dockerfile, layers, volumes, compose
#### In one line
Docker packages an app with everything it needs into an image that runs the same way on any machine.

#### Real-life analogy
A shipping container: whatever is inside, ships, trucks and cranes handle it the same way. "Works on my machine" becomes "works in the container".

#### How it works
- **Image**: read-only template (like a class). **Container**: a running instance (like an object).
- **Dockerfile**: recipe; each instruction creates a cached **layer**. Put rarely-changing steps (install deps) before frequently-changing ones (copy source).
- **Multi-stage build**: build in a big image, copy only the output into a small runtime image.
- **Volumes**: persistent data outside the container (DB files); containers themselves are disposable.
- **Compose**: define multiple services (api, web, db) in ¦docker-compose.yml¦ and run with one command.
- Never bake secrets in an image; pass env vars at runtime.

#### Example
¦¦¦dockerfile
# Stage 1: build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci                 # cached unless package files change
COPY . .
RUN npm run build

# Stage 2: small runtime image
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
¦¦¦
¦¦¦yaml
services:
  api:
    build: .
    ports: ["3000:3000"]
    environment:
      DB_HOST: db
    depends_on: [db]
  db:
    image: mysql:8
    environment: { MYSQL_ROOT_PASSWORD: example }
    volumes: [dbdata:/var/lib/mysql]
volumes:
  dbdata:
¦¦¦

#### Remember it
- **Image = recipe result, container = running copy.**
- Order layers: **dependencies first, source last.**
- Use ¦.dockerignore¦ (node_modules, .git, .env), non-root user, small base image.

#### Common mistakes
- ¦COPY . .¦ before ¦npm ci¦, killing the cache.
- Storing database data inside the container without a volume.
- Running as root and using ¦latest¦ tags.

#### Interview angle
*Image vs container?* "An image is an immutable template built from layers; a container is a running instance with a writable layer on top. I use multi-stage builds to keep images small and ¦USER node¦ for safety." Follow-up: *Why does layer order matter?* (Docker caches layers; an early change invalidates all later layers.)

## Phase 2 · Pipelines and AWS (Intermediate)
### CI/CD concepts: build, lint, test, scan, package, deploy
#### In one line
CI automatically builds and tests every change; CD automatically delivers the tested build to an environment.

#### Real-life analogy
A factory assembly line with quality inspectors at each station: a defective part is stopped early, a good one rolls to the loading dock.

#### How it works
- **CI (Continuous Integration)**: on every push/PR: install → lint → unit tests → build → security scan.
- **Continuous Delivery**: every passing build is *ready* to deploy; a **human approval** triggers production.
- **Continuous Deployment**: passing build goes to production **automatically**, no approval.
- Stages in order: **commit → build → test → scan → package (artefact) → deploy staging → smoke tests → approval → deploy prod → verify**.
- Principles: fast feedback (<10 min), **build once**, same artefact everywhere, pipeline as code, fail fast.

#### Example
¦¦¦text
PR opened      -> lint, unit tests, build, dependency scan      (must pass to merge)
merge to main  -> build artefact api-<sha>, push to registry
               -> deploy to STAGING automatically, run smoke tests
               -> manual approval (change ticket)
               -> deploy to PROD (rolling), health check, auto-rollback on failure
¦¦¦

#### Remember it
| Term | Who presses the final button? |
|---|---|
| Continuous Delivery | a human |
| Continuous Deployment | nobody (automatic) |
Mnemonic: **"Build once, test everywhere, promote, don't rebuild."**

#### Common mistakes
- Slow, flaky pipelines that people learn to ignore.
- Rebuilding for each environment.
- No smoke test or rollback after deploy.

#### Interview angle
*Delivery vs deployment?* "Both keep main always releasable. In delivery, production release needs a manual approval; in deployment it happens automatically after checks. In healthcare we keep approval for production." Follow-up: *How do you keep a pipeline fast?* (Caching, parallel jobs, running only affected tests, small PRs.)

### GitHub Actions / GitLab CI: workflows, jobs, caching, secrets, environments, matrices
#### In one line
GitHub Actions runs automation defined in YAML files in your repo whenever events like pushes or PRs happen.

#### Real-life analogy
A set of standing orders pinned to the office wall: "When a new PR arrives, run these checks in this order and report back."

#### How it works
- **Workflow** (YAML in ¦.github/workflows¦) is triggered by **events** (¦push¦, ¦pull_request¦, ¦workflow_dispatch¦).
- A workflow has **jobs** (run on separate runners, in parallel unless ¦needs¦) made of **steps** (¦uses¦ an action or ¦run¦ a command).
- **Caching** (¦actions/setup-node¦ with ¦cache: npm¦) speeds up installs.
- **Secrets** are encrypted and read as ¦§{{ secrets.NAME }}¦; **environments** (staging/prod) add protection rules, approvals and scoped secrets.
- **Matrix** runs the same job across versions (Node 20/22).
- For AWS use **OIDC** with ¦aws-actions/configure-aws-credentials¦ instead of stored keys.
- GitLab CI is the same idea with ¦.gitlab-ci.yml¦, stages and runners.

#### Example
¦¦¦yaml
name: ci
on:
  pull_request:
  push: { branches: [main] }
permissions: { id-token: write, contents: read }
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix: { node: [20, 22] }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: §{{ matrix.node }}, cache: npm }
      - run: npm ci
      - run: npm run lint && npm test -- --coverage
      - run: npm run build
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production          # approval gate lives here
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/gha-deploy
          aws-region: ap-south-1
      - run: aws s3 sync dist s3://my-app-bucket --delete
¦¦¦

#### Remember it
- **on → jobs → steps; needs = order; matrix = many versions; environment = gate.**
- Pin action versions; give the minimum ¦permissions¦.
- OIDC role, not access keys.

#### Common mistakes
- Long-lived AWS keys in secrets.
- Echoing secrets, or running untrusted PR code with secrets (use ¦pull_request¦, not ¦pull_request_target¦ carelessly).
- No caching, making builds slow.

#### Interview angle
*Walk me through a pipeline you wrote.* "Triggers on PR: install with cache, lint, tests, build. On merge to main a deploy job assumes an AWS role through OIDC, uploads to S3, invalidates CloudFront, in a protected environment with approval." Follow-up: *Job vs step?* (A job runs on its own runner; steps share that runner's filesystem.)

### Jenkins: declarative Jenkinsfile, agents, stages, credentials, parallel, shared libraries
#### In one line
Jenkins is a self-hosted automation server that runs pipelines described in a ¦Jenkinsfile¦ stored with your code.

#### Real-life analogy
A workshop foreman who hires workers (agents) for each job, follows the checklist in the Jenkinsfile, and keeps the keys (credentials) in a locked cabinet.

#### How it works
- **Controller** schedules; **agents** run the work (labels, Docker, Kubernetes).
- **Declarative pipeline**: ¦pipeline { agent … stages { stage { steps } } post { } }¦.
- **Credentials** are stored in Jenkins and injected with ¦withCredentials¦ (masked in logs).
- **parallel** stages run tests concurrently; ¦when¦ conditions limit stages to a branch.
- **Shared libraries** hold reusable pipeline code across many repos.
- Plugins add features but need upgrades; Jenkins needs **maintenance** (backups, security patches).

#### Example
¦¦¦groovy
pipeline {
  agent { label 'node-22' }
  options { timeout(time: 20, unit: 'MINUTES'); disableConcurrentBuilds() }
  stages {
    stage('Install') { steps { sh 'npm ci' } }
    stage('Verify') {
      parallel {
        stage('Lint') { steps { sh 'npm run lint' } }
        stage('Test') { steps { sh 'npm test' } }
      }
    }
    stage('Build') { steps { sh 'npm run build && zip -r app-§{env.GIT_COMMIT}.zip dist' } }
    stage('Deploy staging') {
      when { branch 'main' }
      steps {
        withCredentials([string(credentialsId: 'octopus-api-key', variable: 'OCTO_KEY')]) {
          sh 'octo push --package app-*.zip --apiKey $OCTO_KEY --server $OCTO_URL'
        }
      }
    }
  }
  post { failure { echo 'Notify the team' } }
}
¦¦¦

#### Remember it
- **pipeline → agent → stages → steps → post.**
- Credentials: never ¦echo¦ them, use ¦withCredentials¦.
- Pros: flexible, plugins. Cons: you operate it.

#### Common mistakes
- Putting job config in the UI instead of a versioned Jenkinsfile.
- Plugin sprawl and an unpatched controller.
- Running builds on the controller itself.

#### Interview angle
*Describe a Jenkins pipeline you maintained.* "Declarative Jenkinsfile with install, parallel lint/test, build, package; on main it pushes the artefact to Octopus which deploys through staging to prod. Credentials in Jenkins store, shared library for common steps." Follow-up: *Jenkins vs GitHub Actions?* (Self-hosted flexibility and maintenance vs managed, repo-integrated, less ops.)

### AWS CodePipeline, CodeBuild, CodeDeploy: buildspec, appspec, stages, approvals
#### In one line
AWS's native CI/CD trio: CodePipeline orchestrates, CodeBuild builds and tests, CodeDeploy rolls the artefact out to servers or containers.

#### Real-life analogy
CodePipeline is the project manager, CodeBuild is the factory, CodeDeploy is the delivery driver.

#### How it works
- **CodePipeline**: stages (Source → Build → Approval → Deploy) connected by artefacts stored in S3.
- **CodeBuild**: managed build containers configured by **¦buildspec.yml¦** (phases: install, pre_build, build, post_build; ¦artifacts¦ output).
- **CodeDeploy**: deploys to EC2/ECS/Lambda following **¦appspec.yml¦** and lifecycle hooks (¦BeforeInstall¦, ¦AfterInstall¦, ¦ApplicationStart¦, ¦ValidateService¦). Supports in-place and blue/green.
- **Manual approval** action pauses the pipeline (with SNS email).
- Access is controlled by IAM service roles, so no stored keys.
- Compared with Jenkins/Actions: tight AWS integration and IAM, less flexible and a less friendly UI.

#### Example
¦¦¦yaml
# buildspec.yml
version: 0.2
phases:
  install:
    runtime-versions: { nodejs: 22 }
  pre_build:
    commands: [npm ci]
  build:
    commands: [npm test, npm run build]
artifacts:
  files: ['dist/**/*', 'appspec.yml', 'scripts/**/*', 'package*.json']
cache:
  paths: ['node_modules/**/*']
¦¦¦
¦¦¦yaml
# appspec.yml (EC2)
version: 0.0
os: linux
files:
  - source: /
    destination: /srv/api
hooks:
  AfterInstall:
    - location: scripts/install.sh
  ApplicationStart:
    - location: scripts/start.sh
  ValidateService:
    - location: scripts/health.sh
¦¦¦

#### Remember it
| File | Used by | Purpose |
|---|---|---|
| buildspec.yml | CodeBuild | how to build |
| appspec.yml | CodeDeploy | how to install/start |
Mnemonic: **Source → Build → Approve → Deploy.**

#### Common mistakes
- Forgetting to include ¦appspec.yml¦ and scripts in the build artefact.
- Over-broad IAM roles for the pipeline.
- No ¦ValidateService¦ hook, so bad releases look "successful".

#### Interview angle
*CodePipeline vs Jenkins?* "CodePipeline is managed and IAM-native with no servers to patch, great when everything is on AWS; Jenkins offers more flexibility and plugins but needs operating. I choose by team skills and integration needs." Follow-up: *What does ¦appspec.yml¦ do?* (Describes files to copy and lifecycle hook scripts for CodeDeploy.)

### Octopus Deploy: projects, releases, environments, lifecycles, variables, tenants, runbooks, approvals
#### In one line
Octopus Deploy takes a built artefact from CI and promotes it through environments with controlled steps, variables and approvals.

#### Real-life analogy
CI is the bakery, Octopus is the logistics company: the cake (artefact) is already made; Octopus decides which van, which route, who signs for it and what happens if delivery fails.

#### How it works
- CI (Jenkins/Actions) builds a **package** (zip/NuGet/Docker) and pushes it to Octopus, creating a **release** (versioned snapshot).
- **Project** = deployment process (steps: run script, deploy to IIS/Linux, update DB, health check).
- **Environments**: Dev, Staging, Prod. **Lifecycle** defines the allowed promotion order and gates (cannot reach Prod without Staging).
- **Variables** are scoped by environment/role/tenant; sensitive ones are encrypted.
- **Tenants**: same project for many customers/regions with their own variables.
- **Runbooks**: operational tasks outside deployments (restart service, rotate secrets, DB backup).
- **Manual intervention** steps give approvals; full **audit log** helps compliance.

#### Example
¦¦¦bash
# End of the Jenkins pipeline: hand the artefact to Octopus
octo pack --id ClinicalApi --version 1.4.§{BUILD_NUMBER} --format zip --outFolder out
octo push --package out/ClinicalApi.1.4.§{BUILD_NUMBER}.zip --server $OCTO_URL --apiKey $OCTO_KEY
octo create-release --project "Clinical API" --version 1.4.§{BUILD_NUMBER} --deployTo "Staging"
# Octopus then: Staging deploy -> smoke test -> manual approval -> Production deploy
¦¦¦

#### Remember it
- **Package → Release → Lifecycle → Environment.**
- CI = build, Octopus = deploy and govern.
- Variables scoped by environment keep the same release usable everywhere.

#### Common mistakes
- Putting environment-specific values into the package instead of variables.
- Skipping lifecycle gates for "urgent" releases.
- Unversioned or overwritten packages.

#### Interview angle
*How does CI hand over to Octopus?* "The pipeline builds and tests once, pushes a versioned package and creates a release; Octopus promotes the same release through environments with scoped variables, approvals and an audit trail, which fits our change-management requirements." Follow-up: *What is a runbook?* (Automated operational tasks like restarts or backups, run on demand with permissions.)

### AWS core: IAM, VPC basics, EC2, S3, CloudFront, Route 53, ACM, RDS, ALB, CloudWatch
#### In one line
A small set of AWS building blocks (identity, network, compute, storage, DNS, load balancing, monitoring) is enough to host a complete web app.

#### Real-life analogy
Think of building an office: **IAM** = security badges, **VPC** = the building with private floors, **EC2** = desks and computers, **S3** = filing room, **RDS** = managed records office, **ALB** = reception desk, **Route 53** = the phone directory, **ACM** = the identity certificate, **CloudFront** = branch offices, **CloudWatch** = CCTV and alarms.

#### How it works
- **IAM**: users, roles, policies; follow **least privilege**. Services use *roles*, not keys.
- **VPC**: your private network with **public subnets** (ALB) and **private subnets** (app, DB), across multiple AZs; **security groups** act as per-resource firewalls.
- **EC2**: virtual servers. **S3**: object storage (static sites, uploads, backups). **RDS**: managed MySQL with backups, Multi-AZ, patching.
- **ALB**: HTTPS entry, health checks, routes to targets. **ACM**: free TLS certificates. **Route 53**: DNS records. **CloudFront**: CDN. **CloudWatch**: logs, metrics, alarms.

#### Example
¦¦¦text
Route 53 (app.example.com)
   -> CloudFront (ACM cert) --- S3 bucket (React build, private via OAC)
   -> ALB (public subnets, ACM cert) /api/*
        -> EC2/ECS Node API (private subnets, SG: only from ALB)
             -> RDS MySQL Multi-AZ (private subnet, SG: only from API)
CloudWatch: logs + alarms (5xx rate, CPU, DB connections)
¦¦¦
¦¦¦text
Security group rules (chain of trust):
  ALB SG:  inbound 443 from the internet
  API SG:  inbound 3000 from ALB SG only
  DB  SG:  inbound 3306 from API SG only
¦¦¦

#### Remember it
- **Public = ALB/CDN. Private = app + DB.**
- Security groups reference **other security groups**, not IPs.
- Two AZs minimum for production.

#### Common mistakes
- Database in a public subnet or open to ¦0.0.0.0/0¦.
- Using root account or long-lived keys.
- Single AZ for everything.

#### Interview angle
*Draw the architecture of a React + Node + MySQL app.* "Route 53 to CloudFront serving React from a private S3 bucket; ALB routes API traffic to Node in private subnets; RDS MySQL Multi-AZ; security groups chained; secrets in Secrets Manager; logs and alarms in CloudWatch." Follow-up: *Security group vs NACL?* (SG is stateful at instance level; NACL stateless at subnet level.)

### Deploying a React SPA: S3 + CloudFront, OAC, cache headers, invalidation, SPA fallback
#### In one line
Host the React build as static files in a private S3 bucket and serve them globally through CloudFront with the right cache rules.

#### Real-life analogy
S3 is the warehouse; CloudFront is a chain of shops with the only key to the warehouse (OAC). Shops stock hashed product boxes for a year but always ask the warehouse for the daily menu (¦index.html¦).

#### How it works
1. Build ¦dist/¦, upload to S3 (bucket **private**).
2. CloudFront with **OAC (Origin Access Control)** is the only principal allowed to read the bucket.
3. **Cache headers**: hashed assets ¦Cache-Control: public, max-age=31536000, immutable¦; ¦index.html¦ ¦no-cache¦.
4. After deploy, **invalidate** ¦/index.html¦ (or ¦/*¦) so edges fetch the new file.
5. **SPA fallback**: routes like ¦/courses/12¦ do not exist as files, so S3 returns 403/404. In CloudFront configure custom error responses 403/404 → ¦/index.html¦ with status 200 (or use a CloudFront Function).

#### Example
¦¦¦bash
npm run build
# immutable hashed assets first
aws s3 sync dist s3://my-app-bucket --delete \
  --exclude index.html --cache-control "public,max-age=31536000,immutable"
# index.html last, never cached
aws s3 cp dist/index.html s3://my-app-bucket/index.html --cache-control "no-cache"
aws cloudfront create-invalidation --distribution-id E123ABC --paths "/index.html"
¦¦¦
¦¦¦text
CloudFront custom error responses:
  403 -> /index.html (200)
  404 -> /index.html (200)    # fixes "refresh gives 404/403"
¦¦¦

#### Remember it
- **Hashed files: cache forever. index.html: never.**
- Private bucket + OAC, HTTPS only.
- Refresh 403/404 = missing SPA fallback.

#### Common mistakes
- Public S3 bucket website instead of OAC.
- Caching ¦index.html¦ so users get stale apps referencing deleted bundles.
- Invalidating ¦/*¦ every deploy (costly and unnecessary with hashed names).

#### Interview angle
*Refreshing a deep link returns 403/404, why?* "The route is client-side; S3 has no such object. I add CloudFront error responses mapping 403/404 to ¦/index.html¦ with 200 so React Router takes over." Follow-up: *How do you avoid users seeing old versions?* (Hashed assets plus no-cache index.html, and invalidate index.html on release.)

### Deploying a Node API: EC2 + PM2/systemd, ECS Fargate, Elastic Beanstalk, Lambda
#### In one line
There are several ways to run a Node API on AWS; choose by how much server management you want and how your traffic scales.

#### Real-life analogy
Four ways to get around: own a car (EC2: full control, you maintain it), take a managed taxi (Beanstalk), rent a driverless pod (ECS Fargate: you give a container, AWS runs it), call a courier per trip (Lambda: pay only when it runs).

#### How it works
| Option | You manage | Scaling | Best for |
|---|---|---|---|
| EC2 + PM2/systemd | OS, patching, process | manual/ASG | simple, full control |
| Elastic Beanstalk | app only (AWS provisions EC2/ALB) | auto | quick PaaS-like on AWS |
| ECS Fargate | container image | auto, per task | containerised services, no servers |
| Lambda + API Gateway | function code | per-request | spiky/low traffic, event-driven |
- **PM2/systemd** restarts crashed processes and uses all CPU cores (cluster mode).
- ECS: build image → push to **ECR** → task definition → service behind ALB with health checks, rolling/blue-green deploys.
- Lambda caveats: cold starts, DB connection pooling (use RDS Proxy), 15-minute limit.

#### Example
¦¦¦bash
# ECS Fargate release (what the pipeline runs)
docker build -t clinical-api:$GIT_SHA .
aws ecr get-login-password | docker login --username AWS --password-stdin 123456789012.dkr.ecr.ap-south-1.amazonaws.com
docker tag clinical-api:$GIT_SHA 123456789012.dkr.ecr.ap-south-1.amazonaws.com/clinical-api:$GIT_SHA
docker push 123456789012.dkr.ecr.ap-south-1.amazonaws.com/clinical-api:$GIT_SHA
aws ecs update-service --cluster prod --service api --force-new-deployment
# ECS starts new tasks, waits for ALB health checks, drains old tasks (rolling)
¦¦¦
¦¦¦bash
# EC2 alternative
pm2 start dist/server.js -i max --name clinical-api && pm2 save && pm2 startup
¦¦¦

#### Remember it
- **Control ↔ convenience**: EC2 → Beanstalk → Fargate → Lambda.
- Always add a ¦/health¦ endpoint for the load balancer.
- Containers: immutable images tagged with git SHA.

#### Common mistakes
- Running Node as a bare ¦node server.js¦ without a supervisor.
- Lambda with an unpooled MySQL connection storm.
- Using ¦latest¦ image tags in task definitions.

#### Interview angle
*How would you choose?* "For steady APIs I prefer ECS Fargate: no servers to patch, autoscaling, immutable images and ALB health-checked rolling deploys. EC2 if we need OS control, Lambda for event-driven or spiky workloads." Follow-up: *What does the load balancer health check do?* (Only routes to healthy targets and blocks bad releases.)

### Deployment strategies: rolling, blue/green, canary, feature flags, rollback
#### In one line
A deployment strategy decides how new code replaces old code while limiting user impact and making rollback easy.

#### Real-life analogy
Changing the engine of a plane: **rolling** = replace engines one by one, **blue/green** = switch to an identical spare plane, **canary** = let a few brave passengers fly first, **feature flag** = fit the new seat but keep it locked until ready.

#### How it works
- **Rolling**: replace instances gradually. Cheap; mixed versions run together (must be compatible); rollback is slower.
- **Blue/Green**: two full environments; deploy to idle (green), test, switch traffic at ALB/DNS. Instant rollback; double cost during the switch.
- **Canary**: send 5% → 25% → 100% of traffic while watching errors/latency; stop on regressions.
- **Feature flags** separate *deploy* from *release*: code ships dark, enabled gradually or per user group, kill switch without redeploy.
- **Rollback**: redeploy the previous artefact. **Databases complicate this**: use expand/contract (backward-compatible) migrations so old and new code both work.

#### Example
¦¦¦text
Release plan: Clinical API v1.5
 1. Expand migration: ADD COLUMN completed_at NULL (old code ignores it)
 2. Deploy v1.5 as canary 10%  -> watch 5xx < 0.5%, p95 < 400ms for 15 min
 3. Increase to 50% -> 100%
 4. Enable flag "new-progress-ui" for 10% of users
 5. Later release: contract migration (drop old column) once v1.4 is gone
Rollback: shift ALB weight back to v1.4 (seconds); flag off for UI issues
¦¦¦

#### Remember it
| Strategy | Speed of rollback | Extra cost | Risk exposure |
|---|---|---|---|
| Rolling | medium | none | gradual |
| Blue/Green | instant | high | all at switch |
| Canary | fast | low | small slice |
Mnemonic: **"Roll, Switch, Sample."**

#### Common mistakes
- Destructive DB migration in the same release as code needing the old schema.
- Canary without metrics or automatic abort.
- Flags left forever (flag debt).

#### Interview angle
*Which strategy for a risky release?* "Canary behind feature flags, backed by backward-compatible migrations: watch error rate and latency, abort automatically, and rollback by shifting traffic. Blue/green when we need instant switch-back." Follow-up: *How do you roll back a schema change?* (Avoid needing to: expand/contract keeps old code working.)

### Databases in pipelines: migrations, backups, backward-compatible changes
#### In one line
Schema changes must ship with the code safely: versioned migrations, a backup, and changes compatible with both old and new code.

#### Real-life analogy
Renovating a restaurant while it stays open: build the new door beside the old one, move customers over, and only then brick up the old door.

#### How it works
- **Migrations** (Sequelize CLI) are versioned scripts with ¦up¦ and ¦down¦, run in the pipeline by one job only.
- Order: backup/snapshot → run migration → deploy app (or app compatible first). Never let two instances migrate simultaneously.
- **Expand/Contract**: (1) *expand*: add nullable column/table, (2) deploy code writing both, (3) backfill in batches, (4) switch reads, (5) *contract*: drop the old column in a later release.
- Avoid long locks on big tables: use online DDL/batched updates, run off-peak.
- **Backups**: automated RDS snapshots + point-in-time recovery; **test restores**.

#### Example
¦¦¦js
// migrations/20261030-add-completed-at.js  (expand step: safe, backward compatible)
module.exports = {
  async up(q, S) {
    await q.addColumn('enrolments', 'completed_at', { type: S.DATE, allowNull: true });
    await q.addIndex('enrolments', ['completed_at'], { name: 'idx_enrol_completed' });
  },
  async down(q) {
    await q.removeIndex('enrolments', 'idx_enrol_completed');
    await q.removeColumn('enrolments', 'completed_at');
  },
};
¦¦¦
¦¦¦bash
aws rds create-db-snapshot --db-instance-identifier prod-db --db-snapshot-identifier pre-1-5-§{GIT_SHA}
npx sequelize-cli db:migrate        # single job, before app rollout
¦¦¦

#### Remember it
- **Snapshot → migrate → deploy → verify.**
- Add before you remove; rename = add + copy + switch + drop.
- A backup you never restored is a hope, not a backup.

#### Common mistakes
- ¦DROP COLUMN¦ or renaming in the same release as the code change.
- Each app instance running migrations on startup.
- Editing an already-applied migration file.

#### Interview angle
*How do you do zero-downtime schema changes?* "Expand/contract: add compatible schema first, deploy code tolerant of both, backfill in batches, switch, and drop the old structure in a later release, always after a snapshot." Follow-up: *Why not edit an old migration?* (Environments already ran it; create a new migration.)

### Secrets and identity: SSM Parameter Store, Secrets Manager, IAM roles, OIDC from CI
#### In one line
Give pipelines and apps short-lived, least-privilege identities and keep secrets in a managed vault, not in code or long-lived keys.

#### Real-life analogy
Hotel key cards: temporary, work only on your room, expire at checkout, and the front desk can see every use, unlike a master key copied for everyone.

#### How it works
- **IAM roles** are assumed by services (EC2/ECS task role) and get **temporary credentials** automatically.
- **SSM Parameter Store**: config and simple secrets (SecureString, KMS encrypted), cheap.
- **Secrets Manager**: secrets with built-in **rotation** (e.g. RDS passwords), versioning and audit.
- **OIDC from CI**: GitHub/GitLab proves its identity to AWS, which issues a short-lived token for a role whose trust policy limits repo and branch. **No stored AWS keys.**
- Apps read secrets at startup (or via ECS ¦secrets¦ injection) and caches them.

#### Example
¦¦¦json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Federated": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com" },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": { "token.actions.githubusercontent.com:sub": "repo:my-org/clinical-hub:ref:refs/heads/main" }
    }
  }]
}
¦¦¦
¦¦¦js
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
const sm = new SecretsManagerClient({});           // uses the task role, no keys in code
const { SecretString } = await sm.send(new GetSecretValueCommand({ SecretId: 'prod/db' }));
const db = JSON.parse(SecretString);               // { host, username, password }
¦¦¦

#### Remember it
- **Roles over keys. Temporary over permanent. Scoped over broad.**
- Parameter Store = config/cheap; Secrets Manager = rotation.
- Trust policy pins **which repo/branch** can assume the role.

#### Common mistakes
- Access keys stored in CI secrets or committed.
- ¦AdministratorAccess¦ for the pipeline role.
- Logging secrets or environment dumps.

#### Interview angle
*How do you authenticate CI to AWS?* "OIDC federation: the workflow exchanges its token for a short-lived role limited to a specific repo and branch, so no long-lived keys exist to leak." Follow-up: *Parameter Store vs Secrets Manager?* (Secrets Manager adds automatic rotation and richer secret lifecycle; Parameter Store is cheaper for config.)

### Monitoring and logging: CloudWatch logs/metrics/alarms, health checks, Sentry, uptime checks
#### In one line
Monitoring tells you when something is wrong and logging tells you why, so you find problems before users report them.

#### Real-life analogy
A car dashboard: warning lights (alarms), gauges (metrics), and the black box recording (logs).

#### How it works
- **Logs**: structured JSON (¦requestId¦, ¦userId¦, ¦level¦) to stdout → CloudWatch Logs; search with Logs Insights.
- **Metrics**: CPU, memory, ALB 5xx count, latency, DB connections, plus custom ones (login failures).
- **Alarms**: threshold on a metric → notify SNS/Slack/PagerDuty. Page only for **user-visible symptoms** (error rate, latency, downtime).
- **Health checks**: ¦/health¦ (liveness) and ¦/ready¦ (dependencies like DB) for ALB/ECS.
- **Sentry**: captures frontend and backend exceptions with stack traces and release versions.
- **Uptime checks** from outside (Route 53 health check, synthetic canary).

#### Example
¦¦¦js
app.get('/health', (req, res) => res.json({ status: 'ok' }));           // process alive
app.get('/ready', async (req, res) => {
  try { await sequelize.authenticate(); res.json({ db: 'up' }); }       // dependency ok
  catch { res.status(503).json({ db: 'down' }); }
});
console.log(JSON.stringify({ level: 'error', requestId, route: '/api/courses', msg: err.message }));
¦¦¦
¦¦¦text
Alarm: ALB 5xx > 2% for 5 minutes  -> page on-call
Alarm: p95 latency > 1s for 10 min -> notify channel (warning)
Alarm: RDS free storage < 15 GB    -> ticket
¦¦¦

#### Remember it
- **Logs = why, metrics = what/when, traces = where.**
- Page on **symptoms**, ticket on **causes**.
- Include a **request ID** everywhere.

#### Common mistakes
- Alert fatigue from noisy low-value alarms.
- Unstructured logs with secrets or personal data.
- Health check that always returns 200 even if the DB is down.

#### Interview angle
*What would page the on-call?* "Sustained 5xx rate, high latency, failed health checks or the site being down, everything user-visible with a runbook link; resource warnings go to tickets." Follow-up: *Liveness vs readiness?* (Liveness: restart me; readiness: send me traffic only when dependencies are ready.)

## Phase 3 · Platform and reliability (Lead level)
### Infrastructure as Code: Terraform, CloudFormation, CDK; state and drift
#### In one line
Infrastructure as Code describes servers, networks and databases in versioned files so environments are repeatable and reviewable.

#### Real-life analogy
Architectural blueprints instead of building by hand: any number of identical houses can be built from them, and changes are reviewed on paper first.

#### How it works
- **Terraform** (multi-cloud, HCL): ¦plan¦ shows changes, ¦apply¦ performs them. **State** file maps code to real resources; store it **remotely** (S3 + DynamoDB lock) never locally.
- **CloudFormation**: AWS-native JSON/YAML stacks, change sets.
- **CDK**: define AWS infra in TypeScript/Python and synthesise to CloudFormation (great for TS developers).
- **Drift**: reality differs from code (someone clicked in the console). Detect with ¦terraform plan¦ or drift detection; fix by code, not clicks.
- Use modules, separate state per environment, PR review of ¦plan¦ output, and run apply from the pipeline.

#### Example
¦¦¦text
resource "aws_s3_bucket" "web" {
  bucket = "clinical-hub-web-§{var.env}"
  tags   = { Env = var.env, Owner = "platform" }
}
terraform {
  backend "s3" { bucket = "tf-state-org" key = "web/prod.tfstate" dynamodb_table = "tf-locks" }
}
¦¦¦
¦¦¦bash
terraform fmt && terraform validate
terraform plan -out tf.plan      # reviewed in the PR
terraform apply tf.plan          # executed by the pipeline only
¦¦¦

#### Remember it
- **Code → plan → review → apply.**
- State = source of truth for Terraform: protect, lock and back it up.
- No console changes in prod.

#### Common mistakes
- Local or unlocked state, secrets in state files in a public repo.
- One giant state for everything.
- Manual hot-fixes causing drift.

#### Interview angle
*Terraform vs CloudFormation vs CDK?* "Terraform for multi-cloud and strong ecosystem, CloudFormation for AWS-native, CDK to write AWS infra in TypeScript with real code abstractions. Whichever I choose: remote state, modules, plan review in PR, apply from CI." Follow-up: *What is drift and how do you handle it?* (Detect by plan; restore by applying code or import the change into code.)

### Containers at scale: ECS vs Kubernetes (pods, deployments, services, ingress, autoscaling)
#### In one line
Container orchestrators run, heal, scale and update many containers across many machines; ECS is simpler, Kubernetes is more powerful and portable.

#### Real-life analogy
A shipping port manager: decides which crane and which dock each container uses, replaces broken equipment, and adds docks when ships queue.

#### How it works
- **Kubernetes**: **pod** (one or more containers, smallest unit), **deployment** (desired replicas + rolling updates), **service** (stable address/load balancing for pods), **ingress** (HTTP routing/TLS from outside), **HPA** (autoscale by CPU/metrics), **ConfigMap/Secret**, **namespaces**.
- **Probes**: liveness (restart), readiness (traffic gate).
- **ECS**: task definition (≈ pod spec), service (≈ deployment), ALB target group (≈ service/ingress), autoscaling policies. Fargate removes node management.
- Choose ECS for AWS-only, small team, low ops; Kubernetes (EKS) for multi-cloud, rich ecosystem, complex platforms.

#### Example
¦¦¦yaml
apiVersion: apps/v1
kind: Deployment
metadata: { name: clinical-api }
spec:
  replicas: 3
  strategy: { type: RollingUpdate, rollingUpdate: { maxUnavailable: 0, maxSurge: 1 } }
  selector: { matchLabels: { app: clinical-api } }
  template:
    metadata: { labels: { app: clinical-api } }
    spec:
      containers:
        - name: api
          image: 123456789012.dkr.ecr.ap-south-1.amazonaws.com/clinical-api:9f3c2e1
          ports: [{ containerPort: 3000 }]
          readinessProbe: { httpGet: { path: /ready, port: 3000 } }
          resources: { requests: { cpu: 250m, memory: 256Mi }, limits: { memory: 512Mi } }
¦¦¦
¦¦¦bash
kubectl rollout status deployment/clinical-api
kubectl rollout undo deployment/clinical-api     # rollback
¦¦¦

#### Remember it
| Kubernetes | ECS equivalent |
|---|---|
| Pod | Task |
| Deployment | Service |
| Service/Ingress | ALB + target group |
| HPA | Service auto scaling |
Mnemonic: **Pod runs, Deployment keeps, Service finds, Ingress opens.**

#### Common mistakes
- Adopting Kubernetes for a tiny app (operations overhead).
- No resource requests/limits or probes.
- Mutable ¦latest¦ tags.

#### Interview angle
*ECS or Kubernetes?* "For an AWS-focused team I start with ECS Fargate for simplicity; Kubernetes if we need portability, a big ecosystem or advanced scheduling. I know the concepts: pods, deployments, services, ingress, probes and HPA." Follow-up: *Pod vs container?* (A pod wraps one or more tightly coupled containers sharing network and storage.)

### Release engineering: versioning, changelogs, build once deploy many, promotion, approvals, change management
#### In one line
Release engineering is the discipline of turning code into traceable, approved, repeatable releases.

#### Real-life analogy
Publishing a book: numbered editions, an errata list, one print run shipped to every bookshop, and an editor signing off before distribution.

#### How it works
- **Semantic versioning**: MAJOR.MINOR.PATCH (breaking.feature.fix); tag the commit ¦v1.5.2¦.
- **Changelog** generated from conventional commits (¦feat:¦, ¦fix:¦).
- **Build once, deploy many**: the same artefact (identified by version/SHA) is **promoted** dev → staging → prod; only config changes.
- **Approvals & change management** (e.g. ServiceNow): change ticket linked to release, risk level, approvers, rollback plan, deployment window; the pipeline can verify the ticket is approved.
- **Traceability**: commit → build → artefact → release → deployment → ticket.
- Hotfix path: branch from the production tag, patch, test, release, merge back.

#### Example
¦¦¦text
Release 1.5.0 (artefact clinical-api-1.5.0+9f3c2e1)
  Changelog:  feat: course progress export   fix: duplicate enrolment on retry
  Staging:    deployed Tue 10:05, smoke tests passed
  Approval:   CHG0043210 approved by Product + QA (low risk, rollback = redeploy 1.4.3)
  Production: Wed 11:00 rolling deploy, verified, ticket closed with evidence
¦¦¦
¦¦¦bash
git tag -a v1.5.0 -m "Release 1.5.0" && git push origin v1.5.0
¦¦¦

#### Remember it
- **Version, tag, build once, promote, approve, record.**
- Every production change answers: *who, what, when, why, how to undo*.
- Fast path (hotfix) still leaves an audit trail.

#### Common mistakes
- Rebuilding per environment ("it passed staging" no longer true).
- Releases without tags or notes.
- Approvals as a rubber stamp without risk review.

#### Interview angle
*Describe your release governance.* "Semver tags, generated changelog, one artefact promoted through environments, automated tests and smoke checks, a change ticket with approvers and rollback plan before production, and evidence stored automatically." Follow-up: *How do you handle an emergency hotfix?* (Expedited approval, branch from the prod tag, same pipeline, retro afterwards.)

### Pipeline and supply-chain security: secret scanning, dependency and image scanning, SAST/DAST, least privilege
#### In one line
Secure the whole path from code to production so that neither your code, your dependencies nor your pipeline can be used to attack you.

#### Real-life analogy
Food safety: check the ingredients (dependencies), the kitchen hygiene (pipeline), the packaging seal (image) and test the finished dish (DAST).

#### How it works
- **Secret scanning** (gitleaks, GitHub secret scanning) + pre-commit hooks block committed keys.
- **Dependency scanning (SCA)**: ¦npm audit¦, Dependabot/Renovate; use lockfiles and pinned versions.
- **Image scanning**: Trivy/ECR scanning for OS and library CVEs; minimal base images; non-root.
- **SAST**: static analysis of code (CodeQL, SonarQube). **DAST**: tests the running app (OWASP ZAP) in staging.
- **Least privilege**: narrow IAM roles, protected branches, required reviews, restricted pipeline permissions, OIDC.
- **SBOM and signed artefacts** prove what is inside a build.
- **Leaked key response**: *revoke/rotate first*, check CloudTrail for misuse, remove from history, find root cause, add scanning.

#### Example
¦¦¦yaml
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - run: npm audit --audit-level=high              # fail on high vulnerabilities
      - uses: gitleaks/gitleaks-action@v2              # secrets in history
      - uses: github/codeql-action/init@v3
        with: { languages: javascript-typescript }
      - uses: github/codeql-action/analyze@v3
      - run: trivy image --exit-code 1 --severity HIGH,CRITICAL clinical-api:§{{ github.sha }}
¦¦¦

#### Remember it
- **Scan Secrets, Dependencies, Code (SAST), Image, Running app (DAST).**
- Shift left: cheapest to fix in the PR.
- Rotate first, investigate second.

#### Common mistakes
- Ignoring audit warnings forever.
- Treating a deleted commit as a removed secret (it still exists in history and forks).
- Over-privileged CI tokens.

#### Interview angle
*A key leaked on GitHub; what do you do?* "Immediately revoke or rotate it, review CloudTrail and logs for misuse, purge it from history, notify security, and prevent a repeat with secret scanning and OIDC instead of keys." Follow-up: *SAST vs DAST?* (SAST reads code without running; DAST attacks the running application.)

### Reliability engineering: SLIs/SLOs, error budgets, multi-AZ, DR, RTO/RPO, incident response, post-mortems
#### In one line
Reliability engineering sets measurable availability goals and designs systems and processes to meet them and recover quickly.

#### Real-life analogy
A hospital: defined response times (SLO), backup generators (multi-AZ), a disaster plan (DR), and a review after every incident to improve.

#### How it works
- **SLI**: a measurement (successful requests / total, p95 latency). **SLO**: target (99.9% success monthly). **SLA**: contractual promise.
- **Error budget** = 100% − SLO (99.9% ≈ 43 min/month). If budget is spent, slow feature releases and fix reliability.
- **Multi-AZ**: survive a data-centre failure (ALB + 2 AZs, RDS Multi-AZ). **DR** covers region-level failure.
- **RTO**: how long you can be down. **RPO**: how much data you can lose. Define per system; pick backup/replication to match.
- **Incident response**: detect → declare → assign roles (incident commander, comms) → mitigate first (rollback) → resolve → **blameless post-mortem** with action items.

#### Example
¦¦¦text
Service: Clinical Learning API
SLI: % of requests with status < 500 AND latency < 1s
SLO: 99.9% over 30 days   -> error budget 43m 12s
DR:  RTO 1 hour, RPO 5 minutes -> RDS Multi-AZ + PITR + cross-region snapshots

Incident 2026-09-12 (post-mortem excerpt)
  Impact: 18 min elevated 5xx. Cause: migration locked enrolments table.
  Mitigation: rolled back release. Actions: run large DDL off-peak (owner: DBA, due 09-26),
  add lock-time alarm, add migration review checklist.
¦¦¦

#### Remember it
| Term | Question it answers |
|---|---|
| SLO | how reliable do we promise to be? |
| RTO | how fast must we recover? |
| RPO | how much data can we lose? |
Mnemonic: **Measure → Budget → Redundancy → Recover → Learn.**

#### Common mistakes
- Aiming for 100% (infinitely costly).
- Blame-oriented post-mortems with no follow-through.
- DR plan never tested.

#### Interview angle
*Tell me about an incident.* "Describe impact, detection, mitigation (rollback first), root cause, and the preventive actions we shipped: an alarm, a checklist, a test." Follow-up: *RTO vs RPO?* (Time to restore vs amount of data loss tolerated.)

### Observability: logs, metrics, traces, dashboards, alert design
#### In one line
Observability means your system emits enough data (logs, metrics, traces) that you can understand what is happening inside it from the outside.

#### Real-life analogy
Medical care: vital signs (metrics), the patient history notes (logs), and a scan following the blood path through the body (traces).

#### How it works
- **Logs**: discrete events with context; use structured JSON and correlation IDs.
- **Metrics**: numbers over time; use the **RED** method for services (Rate, Errors, Duration) and **USE** for resources (Utilisation, Saturation, Errors).
- **Traces**: follow one request across services (OpenTelemetry, AWS X-Ray) to find the slow hop.
- **Dashboards**: one overview (golden signals) plus drill-downs; not 50 charts.
- **Alert design**: alert on **symptoms** with clear owner and runbook; use multi-window burn rate on SLOs; avoid alerts nobody acts on.
- Deployment markers on graphs link regressions to releases.

#### Example
¦¦¦js
// request id + structured log + metric label
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('x-request-id', req.id);
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(JSON.stringify({ level: 'info', id: req.id, method: req.method, path: req.route?.path, status: res.statusCode, ms }));
  });
  next();
});
¦¦¦
¦¦¦text
Good alert:  "API error rate > 2% for 5 min (runbook: wiki/api-5xx)"  -> pages
Bad alert:   "CPU > 70%"  (no user impact, no action)  -> dashboard only
¦¦¦

#### Remember it
- **Three pillars: Logs, Metrics, Traces.**
- **RED** for services, **USE** for servers.
- *Symptoms page, causes explain.*

#### Common mistakes
- Logging everything unstructured and never searching it.
- Alerts without runbooks or owners.
- High-cardinality metric labels (user IDs) that explode cost.

#### Interview angle
*How do you debug a slow request in production?* "Find it by request ID in logs, check RED metrics on the dashboard, use a trace to locate the slow span (DB query or downstream call), then fix and watch the release marker." Follow-up: *Monitoring vs observability?* (Monitoring watches known failures; observability helps you investigate unknown ones.)

### Performance and CDN: caching headers, compression, HTTP/2, edge caching
#### In one line
Make pages load faster by sending less data, reusing cached copies and serving from locations near the user.

#### Real-life analogy
A library: popular books kept at the local branch (CDN), the heavy books zipped into compact form (compression), and a "check when I last borrowed" slip (ETag) to avoid carrying it twice.

#### How it works
- **Cache-Control**: ¦max-age=31536000, immutable¦ for hashed files; ¦no-cache¦ (revalidate) for ¦index.html¦ and API responses that change; ¦no-store¦ for sensitive data.
- **ETag / Last-Modified** allow cheap ¦304 Not Modified¦ responses.
- **Compression**: gzip or **Brotli** for text assets (CloudFront can do it).
- **HTTP/2/3**: multiplexing many requests over one connection.
- **Edge caching**: CloudFront caches by URL (and chosen headers/cookies); keep the cache key small to raise hit ratio.
- Also: image optimisation (WebP/AVIF), code splitting, lazy loading, fonts preloaded.

#### Example
¦¦¦text
GET /assets/app.4f9a1c.js
  Cache-Control: public, max-age=31536000, immutable      (content-hash in name)
  Content-Encoding: br
GET /index.html
  Cache-Control: no-cache                                  (always revalidate, tiny file)
GET /api/courses
  Cache-Control: private, max-age=0, must-revalidate       (user-specific data)
¦¦¦
¦¦¦bash
curl -sI -H "Accept-Encoding: br" https://app.example.com/assets/app.4f9a1c.js | grep -i -E "cache-control|content-encoding|x-cache"
# x-cache: Hit from cloudfront   <- served from the edge
¦¦¦

#### Remember it
- **Hashed assets are immutable; index.html is not cached.**
- Cache what is the same for everyone; never cache personal data at the edge.
- Measure with Lighthouse and Core Web Vitals.

#### Common mistakes
- Long cache on unhashed filenames, causing stale files.
- Forwarding all cookies/headers to the CDN origin, destroying cache hits.
- Caching authenticated responses publicly.

#### Interview angle
*How do you make a React app fast to load?* "Code-split, compress with Brotli, serve from CloudFront with immutable hashed assets and a no-cache HTML shell, optimise images and measure with Core Web Vitals." Follow-up: *What does ¦no-cache¦ mean?* (Store it but revalidate with the server before using; not "do not store".)

### Cost and governance: right-sizing, tagging, budgets, lifecycle rules
#### In one line
Cloud cost control means paying only for what you need and being able to see who spends what.

#### Real-life analogy
Household electricity: switch off unused lights (idle resources), buy the right size of fridge (right-sizing), and read the itemised bill (tags and budgets).

#### How it works
- **Right-sizing**: use CloudWatch/Compute Optimizer to move over-provisioned instances to smaller ones.
- **Pricing models**: On-Demand, Savings Plans/Reserved (steady workloads), Spot (interruptible, non-critical).
- **Tagging** (¦env¦, ¦team¦, ¦service¦, ¦owner¦) enforced by policy for cost allocation.
- **Budgets and alerts**: AWS Budgets and Cost Anomaly Detection notify before surprises.
- **Lifecycle rules**: S3 → Infrequent Access → Glacier; delete old logs/artefacts; ECR image retention.
- Turn off non-prod outside working hours; delete orphaned EBS volumes, snapshots and IPs; reduce NAT/data-transfer costs; log retention limits.

#### Example
¦¦¦json
{
  "Rules": [{
    "ID": "expire-build-artifacts",
    "Status": "Enabled",
    "Filter": { "Prefix": "artifacts/" },
    "Transitions": [{ "Days": 30, "StorageClass": "STANDARD_IA" }],
    "Expiration": { "Days": 180 }
  }]
}
¦¦¦
¦¦¦text
Story: staging ran 24x7 on 4 x m5.large. Scheduled stop 8pm-8am + weekends, and moved
to t3.large: ~65% cheaper. Added tags + monthly budget alert. (Use your real numbers.)
¦¦¦

#### Remember it
- **See it (tags), cap it (budgets), shrink it (right-size), age it (lifecycle).**
- Biggest wins: idle non-prod, oversize DB/instances, unlimited logs, data transfer.
- Never trade away backups or security for savings.

#### Common mistakes
- No tags, so nobody owns the cost.
- Buying reservations before right-sizing.
- Forgetting log and snapshot retention.

#### Interview angle
*Show a saving you made.* "I analysed utilisation, scheduled non-prod shutdowns, right-sized instances, and added S3 lifecycle and log retention, with tags and budgets so owners saw their spend." Follow-up: *When use Spot?* (Fault-tolerant, stateless or batch workloads.)

### Engineering metrics: DORA (deployment frequency, lead time, change failure rate, MTTR)
#### In one line
DORA metrics measure how fast and how safely a team delivers software.

#### Real-life analogy
A delivery company tracking how often trucks leave, how long a parcel takes from order to doorstep, how many deliveries fail, and how quickly a failure is fixed.

#### How it works
- **Deployment frequency**: how often you release to production.
- **Lead time for changes**: commit to running in production.
- **Change failure rate**: % of deployments causing incidents or rollbacks.
- **MTTR** (failed-deployment recovery time): how fast service is restored.
- Speed (first two) and stability (last two) improve **together** in high-performing teams.
- Improve with small PRs, automated tests, trunk-based development, feature flags, fast pipelines, good monitoring and rehearsed rollback.
- Use them to find bottlenecks (e.g. slow review queue), **not** to rank or punish people (Goodhart's law: a measure that becomes a target stops being useful).

#### Example
¦¦¦text
Team baseline (quarter start)        After improvements
Deployment frequency   weekly   ->   daily
Lead time              6 days   ->   1.5 days   (smaller PRs, parallel tests)
Change failure rate    18%      ->   8%         (smoke tests, canary)
MTTR                   3 h      ->   25 min     (one-click rollback, alerts with runbooks)
¦¦¦

#### Remember it
| Metric | Group |
|---|---|
| Deployment frequency, Lead time | **Speed** |
| Change failure rate, MTTR | **Stability** |
Mnemonic: **"Ship often, ship fast, ship safe, fix quick."**

#### Common mistakes
- Using metrics for individual performance reviews.
- Counting deployments but ignoring failures.
- Gaming numbers (tiny meaningless deploys).

#### Interview angle
*How do you measure your team's delivery?* "With DORA metrics from our pipeline and incident data, reviewed in retros to find bottlenecks like slow reviews or flaky tests, never to compare individuals." Follow-up: *Which would you improve first?* (Usually lead time through smaller PRs and faster pipeline, which also lowers failure rate.)

### Healthcare/compliance deployments: environment separation, access reviews, audit trails, data residency
#### In one line
Regulated products need provable control over who can change what, where data lives and how changes are approved.

#### Real-life analogy
A hospital pharmacy: separate rooms for stock and dispensing, a signed log for every item handed out, and regular checks of who holds keys.

#### How it works
- **Environment separation**: separate AWS accounts or VPCs for dev/staging/prod; **no real patient/learner data** in non-prod (use synthetic or anonymised data).
- **Access control**: least privilege, SSO + MFA, role-based access, **periodic access reviews**, break-glass accounts with alerts, no shared logins.
- **Audit trails**: CloudTrail, application audit logs, Octopus/Jenkins history, immutable log storage with retention (e.g. S3 Object Lock).
- **Change management**: approved tickets, separation of duties (author ≠ approver), evidence retained.
- **Data protection**: encryption at rest (KMS) and in transit (TLS), backups, **data residency** (choose regions, restrict replication), PII masking in logs.
- Frameworks to know by name: HIPAA, GDPR, SOC 2, ISO 27001.

#### Example
¦¦¦text
Accounts:  org-dev  |  org-staging  |  org-prod  |  org-security (logs, audit)
Controls:  prod access via SSO role "ReadOnly" by default, "Deployer" only via pipeline,
           "BreakGlass" requires ticket + MFA + alert to security
Evidence:  CloudTrail -> central S3 (Object Lock 1y); change ticket linked to Octopus release;
           quarterly access review exported and signed
Data:      RDS in eu-west-1 only, KMS-encrypted; staging uses masked snapshot
¦¦¦

#### Remember it
- **Separate, Least-privilege, Log, Approve, Encrypt** (S-L-L-A-E).
- If it is not logged, it did not happen (to an auditor).
- Never copy production data to lower environments unmasked.

#### Common mistakes
- Developers with standing production admin access.
- Using real data in staging "just for testing".
- Audit logs that can be edited or that expire too soon.

#### Interview angle
*How do you deploy in a regulated environment?* "Separate accounts per environment, no real data outside prod, least-privilege and reviewed access, approved change tickets with separation of duties, automated deployments with full audit trail, encryption and region-restricted data." Follow-up: *How do you handle emergency access?* (Break-glass role with MFA, ticket, time limit, alerting and post-review.)
`;
