window.PREP = window.PREP || {};
window.PREP.deployment = String.raw`
@title Deployment, AWS and CI/CD
@icon cloud
@tagline How code reaches production safely: Git workflow, Docker, CI/CD with Jenkins, CodePipeline and Octopus, AWS hosting, rollbacks and monitoring.
@resume AWS, AWS CodePipeline, Jenkins, Octopus Deploy, Heroku | Git, GitHub, GitLab | CI/CD | ServiceNow release process | Release ownership

## ROADMAP

### Phase 1 · Foundations (Basic)
- Git essentials: commit, branch, merge, rebase, stash, cherry-pick, tags :: Explain merge vs rebase and when each is safe.
- Undoing things safely: restore, reset (soft/mixed/hard), revert, reflog :: Recover a lost commit with reflog.
- Branching and PR workflow: GitHub Flow, Git Flow, trunk-based development, protected branches, CODEOWNERS :: Defend the strategy your team uses.
- Linux and shell basics: files, permissions, ssh, grep, curl, systemd, env vars :: Be comfortable debugging on a server.
- Web basics for deployment: DNS, HTTP/HTTPS, TLS certificates, ports, reverse proxy, CDN :: Trace what happens when a user opens your site.
- Build and package: npm ci, build artefacts, env configuration, static vs server apps :: Know what a React build outputs.
- Environments and configuration: dev, test, staging, prod, 12-factor config, secrets :: Build once, configure per environment.
- Heroku deployment: Procfile, dynos, config vars, buildpacks, release phase :: Recall how you deployed there and its limits.
- Docker basics: images, containers, Dockerfile, layers, volumes, compose :: Containerise a Node API and a React app.

### Phase 2 · Pipelines and AWS (Intermediate)
- CI/CD concepts: build, lint, test, scan, package, deploy :: Distinguish continuous delivery from continuous deployment.
- GitHub Actions / GitLab CI: workflows, jobs, caching, secrets, environments, matrices :: Write a working pipeline file.
- Jenkins: declarative Jenkinsfile, agents, stages, credentials, parallel, shared libraries :: Describe a real pipeline you maintained.
- AWS CodePipeline, CodeBuild, CodeDeploy: buildspec, appspec, stages, approvals :: Compare with Jenkins and Actions.
- Octopus Deploy: projects, releases, environments, lifecycles, variables, tenants, runbooks, approvals :: Explain how CI hands an artefact to Octopus.
- AWS core: IAM, VPC basics, EC2, S3, CloudFront, Route 53, ACM, RDS, ALB, CloudWatch :: Draw the architecture of a React + Node + MySQL app.
- Deploying a React SPA: S3 + CloudFront, OAC, cache headers, invalidation, SPA fallback :: Fix the "refresh gives 404/403" problem.
- Deploying a Node API: EC2 + PM2/systemd, ECS Fargate, Elastic Beanstalk, Lambda :: Choose by operations effort and scaling needs.
- Deployment strategies: rolling, blue/green, canary, feature flags, rollback :: Know the trade-offs and database implications.
- Databases in pipelines: migrations, backups, backward-compatible changes :: Migrations run before or with the app deploy; code must tolerate both schemas.
- Secrets and identity: SSM Parameter Store, Secrets Manager, IAM roles, OIDC from CI :: No long-lived access keys in pipelines.
- Monitoring and logging: CloudWatch logs/metrics/alarms, health checks, Sentry, uptime checks :: Define what pages the on-call.

### Phase 3 · Platform and reliability (Lead level)
- Infrastructure as Code: Terraform, CloudFormation, CDK; state and drift :: Treat infrastructure like application code.
- Containers at scale: ECS vs Kubernetes (pods, deployments, services, ingress, autoscaling) :: Know the vocabulary even if you do not run K8s daily.
- Release engineering: versioning, changelogs, build once deploy many, promotion, approvals, change management (ServiceNow) :: Describe your release governance.
- Pipeline and supply-chain security: secret scanning, dependency and image scanning, SAST/DAST, least-privilege roles :: Know how you would respond to a leaked key.
- Reliability engineering: SLIs/SLOs, error budgets, multi-AZ, DR, RTO/RPO, incident response, post-mortems :: Have one incident story ready.
- Observability: logs, metrics, traces, dashboards, alert design :: Alert on symptoms, not noise.
- Performance and CDN: caching headers, compression, HTTP/2, edge caching :: Hashed assets are immutable, index.html is not cached.
- Cost and governance: right-sizing, tagging, budgets, lifecycle rules :: Show a saving you made.
- Engineering metrics: DORA (deployment frequency, lead time, change failure rate, MTTR) :: Use them to improve the team, not to police it.
- Healthcare/compliance deployments: environment separation, access reviews, audit trails, data residency :: Relevant to your domain.

## QA

### [basic] Git merge vs rebase. When do you use each?
**Merge** joins branches with a merge commit and preserves the true history. **Rebase** replays your commits on top of another branch, producing a linear history, but rewrites commit ids. Rules: rebase your **own local/feature** branch to update it from main; never rebase commits that others have pulled (shared branches). Use merge (or squash merge) to land PRs according to team policy.
¦¦¦bash
git switch feature/login
git fetch origin
git rebase origin/main      # update feature on top of main
# fix conflicts, then: git add . && git rebase --continue
git push --force-with-lease # safe force push for your own branch only
¦¦¦

### [basic] reset vs revert vs restore. How do you undo mistakes?
- ¦git restore <file>¦ discards working-tree changes.
- ¦git reset --soft HEAD~1¦ undoes the last commit but keeps changes staged; ¦--mixed¦ unstages; ¦--hard¦ discards changes (dangerous).
- ¦git revert <sha>¦ creates a **new commit** that undoes an earlier one: safe for shared history (use this on main).
- ¦git reflog¦ shows where HEAD has been, so you can recover "lost" commits after a bad reset.

### [basic] git fetch vs git pull. What is cherry-pick? What is stash?
¦fetch¦ downloads remote changes without changing your branch; ¦pull¦ is ¦fetch¦ plus merge (or rebase with ¦--rebase¦). ¦cherry-pick <sha>¦ applies one commit onto the current branch (hotfix backports). ¦stash¦ saves uncommitted work temporarily so you can switch branches (¦git stash push -m "wip"¦, ¦git stash pop¦).

### [basic] Which branching strategy do you prefer?
**Git Flow** (main, develop, feature, release, hotfix) suits scheduled releases but is heavy. **GitHub Flow** (short feature branches, PR, deploy main) fits continuous delivery. **Trunk-based development** (very short branches, frequent merges, feature flags) gives the fastest feedback and is favoured by high-performing teams. Pick based on release cadence and test maturity; whichever you choose, use protected branches, required reviews and green CI before merge.

### [basic] CI vs Continuous Delivery vs Continuous Deployment.
**CI**: every change is built and tested automatically and merged frequently. **Continuous Delivery**: every change that passes is *releasable*, deployment to production is a manual approval. **Continuous Deployment**: passing changes go to production automatically. Regulated environments (healthcare) often use continuous delivery with approvals and change records.

### [basic] What is Docker? Containers vs virtual machines.
Docker packages an app with its dependencies into an **image**; a **container** is a running instance. Containers share the host kernel, start in seconds and use fewer resources than VMs, which each run a full guest OS. Benefit: "works the same everywhere". Isolation is weaker than VMs, so apply security hardening.

### [basic] Dockerfile best practices.
Use small official base images (¦node:22-alpine¦ or slim), **multi-stage builds** (build tools stay out of the final image), copy ¦package*.json¦ and install before copying source for layer caching, use ¦npm ci --omit=dev¦, add ¦.dockerignore¦ (¦node_modules¦, ¦.git¦, ¦.env¦), run as non-root (¦USER node¦), pin versions, add ¦HEALTHCHECK¦, and never bake secrets into the image.

### [basic] How do you manage configuration and secrets across environments?
Keep one build artefact and inject configuration per environment: environment variables, parameter stores, secret managers. Never commit secrets; rotate them; give each environment separate credentials. For React the API URL is **build-time** (baked into the bundle) unless you load a runtime ¦config.json¦, so decide early how staging and production differ. Server-side secrets must never go into frontend variables because everything in the bundle is public.

### [basic] What is a reverse proxy? Why use Nginx or a load balancer?
A reverse proxy sits in front of your app servers, terminates TLS, serves static files, compresses, caches, applies rate limits and forwards requests (¦proxy_pass¦). A load balancer (AWS ALB) distributes traffic across instances with health checks, enabling zero-downtime deploys and scaling. Your Node app should listen on an internal port and trust proxy headers (¦X-Forwarded-*¦).

### [basic] What happens when a user opens https://app.example.com?
DNS resolves the name (Route 53) to a CDN/load balancer IP → TCP connection → TLS handshake using a certificate (ACM/Let's Encrypt) → HTTP request → CDN cache hit or origin (S3/ALB) → response with cache headers → browser parses HTML, loads hashed JS/CSS, calls the API. Knowing each hop helps debugging (DNS TTL, expired certificate, wrong cache headers, CORS).

### [intermediate] Describe a typical CI/CD pipeline for a React + Node application.
1. **Trigger**: PR or merge to main.
2. **Install** with ¦npm ci¦ and cache dependencies.
3. **Quality gates**: lint, type-check, unit tests, dependency/secret scan.
4. **Build** the frontend and package the API (Docker image or zip) with a version tag (commit SHA).
5. **Publish artefacts** (S3, ECR, Octopus package feed) once.
6. **Deploy to dev/staging** automatically, run smoke or end-to-end tests.
7. **Approval** (and a ServiceNow change if required), then deploy to production using rolling/blue-green.
8. **Verify** health checks and dashboards, auto-rollback on failure, notify the team.

### [intermediate] Explain a Jenkins declarative pipeline.
A ¦Jenkinsfile¦ in the repo defines ¦pipeline { agent … stages { stage … } post { … } }¦. Agents are where steps run, ¦credentials()¦ injects secrets safely, ¦parallel¦ speeds up independent stages, ¦when¦ limits stages to branches, ¦input¦ pauses for approval, and shared libraries reuse code across projects. Keep pipeline logic in code, pin plugin versions, keep Jenkins itself backed up, and use short-lived agents (containers) for clean builds.

### [intermediate] What is Octopus Deploy and how does it fit with Jenkins or CodePipeline?
CI tools **build and test**; Octopus **deploys and releases**. The pipeline pushes a versioned package to Octopus and creates a **release**. Octopus promotes it through a **lifecycle** (Dev → Test → Staging → Prod) with environment-specific **variables**, **approvals**, **tenants** (per-customer deployments), scheduled deployments and **runbooks** for operations. Benefits: consistent, auditable deployments and easy promotion of the same artefact. In your answer, link it to your ServiceNow change process.

### [intermediate] AWS CodePipeline vs Jenkins vs GitHub Actions: how do you choose?
| Tool | Strength | Trade-off |
|---|---|---|
| CodePipeline + CodeBuild | Fully managed, native IAM and AWS integrations | Less flexible UI and plugin ecosystem |
| Jenkins | Very flexible, huge plugin ecosystem, on-prem friendly | You maintain servers, plugins, upgrades, security |
| GitHub Actions / GitLab CI | Pipeline next to the code, marketplace, easy start | Runner minutes and governance for large orgs |

Choose by where code lives, compliance needs, team skills and who maintains the tooling. Mention migrating or running several in the same company.

### [intermediate] IAM: users vs roles, and least privilege.
**Users** have long-lived credentials; **roles** are assumed temporarily and give short-lived credentials (EC2 instance roles, ECS task roles, CI roles via OIDC). Apply **least privilege**: allow only needed actions on specific resources, use conditions, separate roles for build vs deploy, enable MFA for humans, review access regularly, and avoid wildcard ¦*¦ policies. Never put access keys in code or images.

### [intermediate] How do you deploy a React SPA on S3 and CloudFront?
Build (¦npm run build¦), upload to a **private** S3 bucket, and serve through **CloudFront with Origin Access Control**. Configure: HTTPS via ACM certificate, Route 53 alias, default root object ¦index.html¦, and **custom error responses** that return ¦/index.html¦ with status 200 for 403/404 so client-side routes work on refresh. Cache hashed assets for a year (¦immutable¦) and ¦index.html¦ with ¦no-cache¦ (or invalidate ¦/index.html¦ after each release).

### [intermediate] Where can you run a Node.js API on AWS?
- **EC2** with PM2/systemd behind an ALB: full control, you manage patches and scaling.
- **ECS on Fargate** (containers): no servers to manage, rolling/blue-green deploys, task roles; a strong default.
- **Elastic Beanstalk**: managed platform with simple deployments, less flexible.
- **Lambda + API Gateway**: pay per request, good for spiky or small APIs, watch cold starts and connection limits to MySQL (use RDS Proxy).
- **EKS**: Kubernetes when you need its ecosystem and have the skills.

### [intermediate] ALB, health checks and autoscaling.
The ALB routes traffic to healthy targets. A health endpoint (¦/health¦) returns 200 only if the app can serve; deep checks (database) belong in readiness, not necessarily in the ALB check. Autoscaling policies react to CPU, requests per target or custom metrics. During deployment the ALB drains connections from old targets (deregistration delay) so users do not see errors.

### [intermediate] Heroku: how does it work and why would a team move to AWS?
Heroku deploys from git push using **buildpacks**, runs processes as **dynos** defined in a ¦Procfile¦, stores configuration in **config vars**, supports a **release phase** (migrations) and add-ons (Postgres, Redis). It is fast to start and low-ops. Teams move to AWS for cost at scale, networking/VPC control, compliance (private networking, data residency), more services and fine-grained IAM. A migration plan: containerise, replicate environments with IaC, move data with a rehearsed cutover, switch DNS, keep Heroku as fallback briefly.

### [intermediate] Compare rolling, blue/green and canary deployments.
| Strategy | How | Pros | Cons |
|---|---|---|---|
| Rolling | Replace instances gradually | Simple, no extra capacity | Mixed versions run together |
| Blue/green | Deploy to a parallel stack, switch traffic | Instant rollback, easy testing | Double capacity, DB compatibility |
| Canary | Send a small % of traffic to the new version | Limits blast radius, real metrics | Needs good monitoring and routing |

Feature flags decouple **deploy** from **release**, so code can ship dark and be enabled gradually.

### [intermediate] What is your rollback strategy?
Prefer **roll forward fast** with a hotfix only if it is quicker than rollback; otherwise redeploy the previous artefact (keep the last N versions). Automate: health checks fail → auto rollback (CodeDeploy, ECS circuit breaker, Octopus guided failure). Database changes must be **backward compatible** so old code still works after rollback. Keep the process rehearsed and documented.

### [intermediate] How do database migrations fit into deployments?
Run migrations as a controlled pipeline step (or a one-off task) **before** the new code takes traffic, using expand/contract so both old and new code work with the intermediate schema. Take a backup/snapshot before risky migrations, run them once (not on every app instance start), time-limit them and log results. Destructive changes (drop column) wait for a later release.

### [intermediate] How do you handle secrets in AWS and CI?
Use **SSM Parameter Store** (cheap, hierarchical, SecureString) or **Secrets Manager** (rotation, DB credential integration). Containers receive them as environment variables from the task definition or are fetched at start via the task role. CI authenticates with **OIDC** to assume a role, so there are no stored access keys. Scan repositories for secrets, rotate immediately if one leaks, and restrict who can read production values.

### [intermediate] What do you monitor in production?
The four golden signals: **latency**, **traffic**, **errors**, **saturation** (CPU, memory, DB connections, queue depth). Frontend: Core Web Vitals and JavaScript errors (Sentry). Business: sign-ups, enrolments. Add synthetic uptime checks and dashboards per service. Alert on user-visible symptoms (error rate, p95 latency, failed checks) with runbooks, route alerts to the right on-call, and tune noisy alarms.

### [intermediate] How do caching headers work for a SPA deployment?
Build tools add content hashes to filenames (¦app.4f2a9c.js¦), so those files can be cached for a year with ¦Cache-Control: public, max-age=31536000, immutable¦. ¦index.html¦ references the new hashes, so it must not be cached long: ¦Cache-Control: no-cache¦ (revalidate each time). After deploy, invalidate ¦/index.html¦ on CloudFront. Keep the previous version's assets for a while so users with an open tab can still load lazy chunks.

### [intermediate] How do you handle environment-specific config in a React app?
Vite/CRA variables (¦VITE_API_URL¦) are replaced at **build time**, so you need a build per environment, or build once and load ¦/config.json¦ at startup (served from the environment) to keep the "build once, deploy many" principle. Never put secrets in frontend variables.

### [intermediate] How do you deal with Git merge conflicts and keep PRs healthy?
Pull or rebase often, keep PRs small and focused, communicate when touching shared files, resolve conflicts by understanding both changes (not blindly accepting one side), re-run tests after resolving, and use code owners, PR templates, and CI gates. Small, frequent merges are the best conflict prevention.

### [advanced] Terraform vs CloudFormation. What is Terraform state?
Both define infrastructure as code. **CloudFormation/CDK** is AWS-native with managed state and rollback. **Terraform** is multi-cloud with a large provider ecosystem and a plan/apply workflow. Terraform **state** maps your configuration to real resources, so store it remotely (S3 + DynamoDB lock or Terraform Cloud), restrict access (it can contain secrets), never edit by hand, and detect drift with ¦terraform plan¦. Use modules for reuse and separate states per environment.

### [advanced] Explain Kubernetes at a high level.
You declare desired state; the control plane makes it true. A **Pod** runs one or more containers. A **Deployment** manages replicas and rolling updates. A **Service** gives pods a stable address. An **Ingress** routes external HTTP traffic. **ConfigMaps/Secrets** hold configuration, **HPA** autoscales, **readiness/liveness probes** control traffic and restarts. It is powerful but operationally heavy; ECS Fargate is simpler if you only need to run containers on AWS.

### [advanced] What makes a deployment truly zero-downtime?
Multiple instances behind a load balancer, correct **readiness** checks, **connection draining** and graceful shutdown in the app, rolling or blue/green rollout, **backward-compatible database changes**, session state outside the app (Redis/JWT), cache-safe asset handling (keep old chunks), and automatic rollback. Test the process regularly under load rather than assuming it works.

### [advanced] How do you secure the CI/CD pipeline and software supply chain?
Least-privilege roles and short-lived credentials (OIDC), protected branches and required reviews, secret scanning, dependency scanning (¦npm audit¦, Dependabot, Snyk), container image scanning and minimal base images, lockfiles and pinned versions (and pinned action SHAs), SAST/DAST in the pipeline, separate build and deploy permissions, signed artefacts or provenance, and audit logs. Restrict who can modify pipeline definitions because they are code execution.

### [advanced] Explain RPO, RTO and disaster recovery levels.
**RPO** is the maximum acceptable data loss (time), **RTO** the maximum acceptable downtime. Strategies from cheapest to fastest: backup and restore, pilot light, warm standby, active-active multi-region. Multi-AZ gives high availability inside a region (RDS Multi-AZ, ALB over AZs); multi-region protects against region failure but adds data-replication and cost complexity. Test restores and failover; document runbooks.

### [advanced] What does "build once, deploy many" mean and why does it matter?
Build the artefact (Docker image, zip) **once**, tag it with a version/commit, and promote the exact same artefact through every environment, changing only configuration. This guarantees that what you tested is what runs in production and removes "it was a different build" failures. It requires externalised config and an artefact repository (ECR, S3, Octopus feed).

### [advanced] What are DORA metrics and how would you use them?
Deployment frequency, lead time for changes, change failure rate and time to restore service. They show delivery health. Use them as team-level trends to find bottlenecks (slow reviews, flaky tests, manual approvals), not as individual performance scores. Improve with smaller changes, trunk-based development, automated tests, feature flags and good observability.

### [advanced] How do you reduce cloud costs without hurting reliability?
Right-size instances using metrics, autoscale, turn off non-production environments off-hours, use savings plans or reserved capacity for steady loads, S3 lifecycle rules and intelligent tiering, delete unattached volumes and old snapshots, use CloudFront caching to reduce origin traffic, tag resources for cost allocation, set budgets and alerts, and review the bill monthly with the team.

### [advanced] How do change management and ServiceNow fit into releases?
In regulated environments each production release has a **change request** that records what is changing, risk, rollback plan, approvals and the deployment window. Automate the link: the pipeline creates or references the change, updates its status, attaches test evidence and records the deployed version. Standard (pre-approved) changes for low-risk, repeatable deployments speed things up while keeping auditability.

## EXERCISES

### [basic] Git rescue scenarios
Write the commands for: (1) you committed to ¦main¦ instead of a feature branch (not pushed), (2) you committed a secret and already pushed, (3) a merged PR broke production and must be undone safely.
--- solution ---
¦¦¦bash
# 1. Move the last commit to a new branch and reset main
git switch -c feature/login        # new branch keeps the commit
git switch main
git reset --hard origin/main       # main back to remote state

# 2. Secret pushed: rotate the secret FIRST (history is compromised), then remove from history
git filter-repo --path .env --invert-paths   # or BFG Repo-Cleaner
git push --force-with-lease                   # coordinate with the team

# 3. Undo a merge commit on a shared branch safely
git revert -m 1 <merge-commit-sha>   # -m 1 keeps the main-line parent
git push
¦¦¦
Key point for case 2: the secret must be treated as leaked and rotated; deleting it from history alone is not enough.

### [basic] Dockerfile for a Node/Express API
Create a production image using a multi-stage build, non-root user, health check and ¦.dockerignore¦.
--- solution ---
¦¦¦dockerfile
# syntax=docker/dockerfile:1
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build            # e.g. tsc -> dist/

FROM node:22-alpine AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1:3000/health || exit 1
CMD ["node", "dist/server.js"]
¦¦¦
¦¦¦text
# .dockerignore
node_modules
dist
.git
.env
npm-debug.log
Dockerfile
¦¦¦
Explain: dependency layer is cached unless ¦package*.json¦ changes, dev tools never reach the final image, and the container does not run as root.

### [basic] Dockerfile and Nginx config for a React SPA
Serve a Vite build with Nginx, with SPA routing fallback and correct cache headers.
--- solution ---
¦¦¦dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
¦¦¦
¦¦¦nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  gzip on;
  gzip_types text/css application/javascript application/json image/svg+xml;

  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
  location / {
    try_files $uri /index.html;          # client-side routing fallback
    add_header Cache-Control "no-cache";
  }
}
¦¦¦
The fallback fixes 404 on refresh for routes like ¦/courses/12¦. Hashed files in ¦/assets¦ are cached for a year, ¦index.html¦ is always revalidated.

### [intermediate] GitHub Actions: test on every PR, deploy to S3 on main using OIDC
Write a workflow with lint, test and build, then deploy the build to S3 and invalidate CloudFront without storing AWS keys.
--- solution ---
¦¦¦yaml
name: ci-cd
on:
  push:
    branches: [main]
  pull_request:

permissions:
  id-token: write      # needed for OIDC
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production          # can require manual approval
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/gh-deploy
          aws-region: ap-south-1
      - run: aws s3 sync dist/ s3://my-site-bucket --delete --cache-control "public,max-age=31536000,immutable" --exclude index.html
      - run: aws s3 cp dist/index.html s3://my-site-bucket/index.html --cache-control "no-cache"
      - run: aws cloudfront create-invalidation --distribution-id §{{ vars.CF_ID }} --paths "/index.html"
¦¦¦
Explain: the IAM role trusts GitHub's OIDC provider and is restricted to your repo and branch; deploy uses the artefact that was tested (build once).

### [intermediate] Jenkinsfile with staging deploy and manual production approval
Write a declarative pipeline: install, parallel lint and unit tests, build, archive, deploy to staging, wait for approval, deploy to production.
--- solution ---
¦¦¦groovy
pipeline {
  agent none
  options { timestamps(); timeout(time: 30, unit: 'MINUTES'); buildDiscarder(logRotator(numToKeepStr: '20')) }

  stages {
    stage('Build and test') {
      agent { docker { image 'node:22-alpine' } }
      stages {
        stage('Install') { steps { sh 'npm ci' } }
        stage('Quality') {
          parallel {
            stage('Lint') { steps { sh 'npm run lint' } }
            stage('Unit tests') { steps { sh 'npm test -- --ci' } }
          }
        }
        stage('Build') {
          steps {
            sh 'npm run build'
            archiveArtifacts artifacts: 'dist/**', fingerprint: true
            stash name: 'dist', includes: 'dist/**'
          }
        }
      }
    }
    stage('Deploy staging') {
      when { branch 'main' }
      agent any
      steps { unstash 'dist'; sh './scripts/deploy.sh staging' }
    }
    stage('Approve production') {
      when { branch 'main' }
      steps { timeout(time: 1, unit: 'DAYS') { input message: 'Deploy to production?', ok: 'Deploy' } }
    }
    stage('Deploy production') {
      when { branch 'main' }
      agent any
      steps { unstash 'dist'; sh './scripts/deploy.sh production' }
    }
  }
  post { failure { echo 'Pipeline failed: notify the team' } }
}
¦¦¦
Notes: ¦agent none¦ at the top so the approval wait does not hold an executor; credentials are used with ¦withCredentials¦ inside the deploy script; the same stashed artefact goes to both environments.

### [intermediate] CodeBuild buildspec for a React app
Build, test and publish to S3 with proper cache headers, then invalidate CloudFront.
--- solution ---
¦¦¦yaml
version: 0.2
env:
  variables:
    BUCKET: my-site-bucket
    DIST_ID: E123EXAMPLE
phases:
  install:
    runtime-versions:
      nodejs: 22
    commands:
      - npm ci
  pre_build:
    commands:
      - npm run lint
      - npm test -- --ci
  build:
    commands:
      - npm run build
  post_build:
    commands:
      - aws s3 sync dist/ s3://$BUCKET --delete --cache-control "public,max-age=31536000,immutable" --exclude index.html
      - aws s3 cp dist/index.html s3://$BUCKET/index.html --cache-control "no-cache"
      - aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/index.html"
artifacts:
  base-directory: dist
  files:
    - '**/*'
cache:
  paths:
    - 'node_modules/**/*'
¦¦¦
Check the Node runtimes supported by your CodeBuild image. Give the CodeBuild service role only the S3 and CloudFront permissions it needs.

### [intermediate] Nginx reverse proxy for a Node API with HTTPS
Redirect HTTP to HTTPS, proxy to Node on port 3000, pass client IP and protocol headers, and support WebSockets.
--- solution ---
¦¦¦nginx
server {
  listen 80;
  server_name api.example.com;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl;
  http2 on;
  server_name api.example.com;

  ssl_certificate     /etc/letsencrypt/live/api.example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;

  gzip on;
  gzip_types application/json text/plain text/css application/javascript;
  client_max_body_size 10m;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 60s;
  }
}
¦¦¦
In Express set ¦app.set('trust proxy', 1)¦ so ¦req.ip¦ and secure cookies work behind the proxy.

### [intermediate] Local development stack with Docker Compose
Run the API, MySQL and Redis locally. The API must start only after MySQL is healthy.
--- solution ---
¦¦¦yaml
services:
  api:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: mysql://app:app@db:3306/learning
      REDIS_URL: redis://cache:6379
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
  db:
    image: mysql:8.4
    environment:
      MYSQL_DATABASE: learning
      MYSQL_USER: app
      MYSQL_PASSWORD: app
      MYSQL_ROOT_PASSWORD: root
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-uroot", "-proot"]
      interval: 5s
      timeout: 3s
      retries: 20
    volumes:
      - dbdata:/var/lib/mysql
  cache:
    image: redis:7-alpine
volumes:
  dbdata: {}
¦¦¦
Start with ¦docker compose up --build¦. The named volume keeps data between restarts.

### [advanced] Least-privilege IAM policy for the deploy role
The pipeline role must upload to one S3 bucket and invalidate one CloudFront distribution, nothing else. Write the policy.
--- solution ---
¦¦¦json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::my-site-bucket/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::my-site-bucket"
    },
    {
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "arn:aws:cloudfront::123456789012:distribution/E123EXAMPLE"
    }
  ]
}
¦¦¦
The **trust policy** of the role allows only GitHub's OIDC provider with a condition on ¦token.actions.githubusercontent.com:sub¦ such as ¦repo:my-org/my-repo:ref:refs/heads/main¦. Separate roles per environment keep production isolated.

### [advanced] Plan a zero-downtime release with a database change
You must rename a column used by the API (¦status¦ to ¦state¦) on a busy system. Write the release sequence.
> Hint: Never rename in one step. Think expand, migrate, contract across several releases.
--- solution ---
1. **Release 1 (expand)**: migration adds ¦state¦ (nullable). Code writes **both** columns and still reads ¦status¦.
2. **Backfill**: batch job copies ¦status¦ to ¦state¦ for old rows; verify counts match.
3. **Release 2**: code reads ¦state¦ (falls back to ¦status¦ if null); keep dual writes. Monitor errors.
4. **Release 3 (contract)**: stop writing ¦status¦, deploy, wait a safe period (rollback window).
5. **Release 4**: migration drops ¦status¦, adds ¦NOT NULL¦ on ¦state¦.
Every release works with old and new code at the same time, so rolling deploys and rollbacks are safe. Pair with a database snapshot before each migration.

## SCENARIOS

### Walk me through how code goes from a developer's laptop to production in your team.
Use a concrete end-to-end story: feature branch and PR → automated checks (lint, tests, security scan) → code review and merge to main → pipeline (Jenkins or CodePipeline) builds once and publishes a versioned artefact → Octopus (or the pipeline) deploys to dev and QA automatically → smoke tests → approval and ServiceNow change for production → deployment with rollback ready → verification with dashboards and alerts → release notes. Add numbers where you can (pipeline duration, release frequency) and one improvement you made.

### A production deployment broke the site. What do you do in the first 15 minutes?
Declare an incident and assign roles (incident lead, communicator). Check dashboards and error tracking to confirm impact. **Mitigate first**: roll back to the previous artefact or disable the feature flag; do not debug live in production unless rollback is impossible. Communicate status to stakeholders. After recovery, collect logs and timelines, write a blameless post-mortem with root cause and follow-ups (extra test, pipeline gate, better alert).

### Plan a migration from Heroku to AWS.
Inventory apps, add-ons, config and data. Choose the target (ECS Fargate + RDS + CloudFront/S3), define infrastructure as code, containerise, set up CI/CD, replicate staging first and run load/regression tests. Rehearse the data migration (dump/restore or replication), plan the cutover (maintenance window, DNS TTL lowered in advance), keep Heroku read-only as a fallback, monitor closely after cutover, then decommission and update documentation and runbooks.

### Your pipeline takes 40 minutes. How do you speed it up?
Measure each stage. Cache dependencies and Docker layers, run lint/unit/type checks in parallel, split slow end-to-end tests into shards, run only affected packages in a monorepo (Nx/Turborepo), use faster or larger runners, avoid rebuilding artefacts per environment (build once), delete flaky tests or quarantine them, and fail fast on cheap checks first. Report the before and after time.

### A developer accidentally pushed an AWS access key to a public GitHub repo. What now?
Treat it as compromised immediately: **deactivate and rotate** the key, check CloudTrail for misuse, review IAM permissions, remove the secret from history (and purge forks/caches where possible), notify security, and add controls: secret scanning and push protection, pre-commit hooks, OIDC roles instead of long-lived keys, and an incident note with lessons.

### How do Jenkins, Octopus Deploy and ServiceNow work together in your release process?
Jenkins builds and tests, produces a versioned package and pushes it to Octopus. Octopus creates the release and promotes it through environments with environment-specific variables and approvals. For production, a ServiceNow change is created or validated before deployment, and the pipeline/Octopus updates the change with deployment status and evidence. This gives traceability from commit to change request to deployed version, and consistent repeatable releases.
`;
