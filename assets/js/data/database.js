window.PREP = window.PREP || {};
window.PREP.database = String.raw`
@title Database, MySQL and Sequelize
@icon db
@tagline SQL fundamentals, indexes and EXPLAIN, transactions and locking, then Sequelize ORM patterns you use daily. Includes MySQL vs PostgreSQL notes.
@resume MySQL / PostgreSQL queries and optimisation | Sequelize ORM | Query optimisation behind 30–40% faster responses | Data-driven workflows

## ROADMAP

### Phase 1 · Foundations (Basic)
- Relational concepts: tables, rows, primary and foreign keys, ER diagrams :: Draw the schema of a learning platform: users, courses, enrolments.
- SQL basics: SELECT, WHERE, ORDER BY, LIMIT, DISTINCT, aliases, LIKE, IN, BETWEEN :: Write them without an IDE.
- NULL handling: IS NULL, COALESCE, three-valued logic :: NULL = NULL is not true; know NOT IN with NULL traps.
- Aggregation: COUNT, SUM, AVG, MIN, MAX, GROUP BY, HAVING :: WHERE filters rows, HAVING filters groups.
- Joins: INNER, LEFT, RIGHT, CROSS, self join :: Explain results with small tables on paper.
- DDL and constraints: CREATE/ALTER, NOT NULL, UNIQUE, CHECK, FOREIGN KEY with ON DELETE rules :: Constraints are your last line of defence.
- DML: INSERT, UPDATE, DELETE, multi-row insert, DELETE vs TRUNCATE vs DROP :: Always run UPDATE/DELETE with a tested WHERE.
- MySQL data types: INT/BIGINT, DECIMAL, VARCHAR, TEXT, DATETIME vs TIMESTAMP, JSON, ENUM, utf8mb4 :: Money in DECIMAL, never FLOAT.
- Normalisation: 1NF, 2NF, 3NF and when to denormalise :: Defend one denormalisation you made for performance.
- Subqueries: scalar, IN, EXISTS, derived tables :: Know EXISTS vs IN and when a join is clearer.
- Sequelize basics: connection, define models, CRUD, findAll/findOne/findByPk, where operators :: Create a model and run queries for a course catalogue.

### Phase 2 · Performance and correctness (Intermediate)
- Indexes: B-tree, primary/secondary, composite (leftmost prefix), covering, unique :: Explain how InnoDB stores the table in the primary key order.
- EXPLAIN and EXPLAIN ANALYZE :: Read type (ALL, ref, range, const), key, rows, Extra (Using filesort, Using temporary).
- Writing index-friendly queries :: No functions on indexed columns, avoid leading wildcards, match data types.
- Transactions and ACID :: BEGIN, COMMIT, ROLLBACK, savepoints; keep them short.
- Isolation levels and anomalies :: Dirty, non-repeatable and phantom reads; InnoDB default is REPEATABLE READ.
- Locks and deadlocks :: Row locks, gap locks, SELECT ... FOR UPDATE, SKIP LOCKED; retry on deadlock.
- Joins at scale and the N+1 problem :: Fix with eager loading or batching.
- CTEs and window functions (MySQL 8) :: ROW_NUMBER, RANK, LAG/LEAD, running totals, top-N per group.
- Sequelize associations: hasOne, hasMany, belongsTo, belongsToMany, include, required :: Know how include generates JOINs.
- Sequelize advanced querying: scopes, hooks, paranoid, validations, raw queries with bind parameters, literal :: Prevent SQL injection in raw SQL.
- Sequelize transactions: managed vs unmanaged, passing the transaction option :: Every query inside must receive the transaction.
- Migrations and seeders: sequelize-cli or umzug, up/down, never sync() in production :: Schema changes are code-reviewed and versioned.
- Pagination, upsert and bulk operations :: Keyset pagination, ON DUPLICATE KEY UPDATE, bulkCreate with updateOnDuplicate.
- Connection pooling :: max, min, acquire, idle; recognise pool exhaustion symptoms.

### Phase 3 · Scale and reliability (Lead level)
- Query tuning workflow :: Slow query log, performance_schema, EXPLAIN, rewrite, index, verify.
- Concurrency control: optimistic vs pessimistic locking, idempotency, unique constraints :: Prevent double booking and double payment.
- InnoDB internals: MVCC, undo/redo logs, buffer pool, gap locks :: Explain why reads do not block writes.
- Replication and high availability: primary-replica, read/write splitting, replica lag, failover (RDS Multi-AZ, Aurora) :: Know read-your-writes problems.
- Backups and recovery: logical vs physical backups, binlog point-in-time recovery, RPO/RTO :: Describe a restore drill.
- Zero-downtime schema changes: expand/contract, online DDL, gh-ost/pt-osc :: Add a column to a huge table safely.
- Partitioning, archiving and sharding concepts :: Know when not to shard.
- Data modelling patterns: soft delete, audit trail, multi-tenant, JSON columns, event/progress tracking :: Model course progress and certificates.
- MySQL vs PostgreSQL :: MVCC and vacuum, JSONB, partial indexes, extensions, window/CTE maturity, replication differences.
- Security and compliance: least privilege, parameterised queries, encryption, PII masking, audit logs :: Important in healthcare data.
- Caching and read models: Redis, materialised summaries, reporting replicas :: Do not run heavy reports on the primary.

## QA

### [basic] RDBMS vs NoSQL. How do you choose?
Relational databases store data in tables with a fixed schema, joins and ACID transactions, ideal for structured, related data (users, courses, enrolments, payments). NoSQL (document, key-value, wide-column, graph) trades some of that for flexible schema or horizontal scale: MongoDB for variable documents, Redis for caching, DynamoDB for massive key-value access. Choose by access patterns and consistency needs. For most business applications, start with a relational database.

### [basic] Primary key, foreign key, unique key, candidate key.
A **primary key** uniquely identifies a row (not null, one per table, InnoDB clusters data by it). A **foreign key** references another table's key and enforces referential integrity. A **unique** constraint prevents duplicates but allows NULLs (MySQL permits multiple NULLs). A candidate key is any column set that could serve as a primary key. Prefer a short, stable, meaningless key (auto-increment BIGINT or UUID v7) over natural data like email.

### [basic] What is normalisation? When would you denormalise?
Normalisation removes redundancy: 1NF (atomic values), 2NF (no partial dependency on part of a composite key), 3NF (no transitive dependency). It prevents update anomalies. Denormalise deliberately for read performance (store a ¦course_title¦ snapshot on an order, keep a ¦completed_lessons_count¦), accepting the burden of keeping copies in sync. Always justify it with a measurement.

### [basic] INNER JOIN vs LEFT JOIN. Show the difference.
¦INNER JOIN¦ returns rows with matches in both tables. ¦LEFT JOIN¦ returns all rows from the left table, with NULLs where there is no match.
¦¦¦sql
-- Users and their enrolments (only users who enrolled)
SELECT u.name, e.course_id FROM users u INNER JOIN enrolments e ON e.user_id = u.id;

-- All users, even those with no enrolment
SELECT u.name, e.course_id FROM users u LEFT JOIN enrolments e ON e.user_id = u.id;

-- Users with no enrolment
SELECT u.* FROM users u LEFT JOIN enrolments e ON e.user_id = u.id WHERE e.id IS NULL;
¦¦¦
Trap: a ¦WHERE¦ condition on the right table turns a LEFT JOIN into an INNER JOIN; put it in the ¦ON¦ clause.

### [basic] WHERE vs HAVING.
¦WHERE¦ filters individual rows **before** grouping. ¦HAVING¦ filters groups **after** aggregation and can use aggregate functions.
¦¦¦sql
SELECT course_id, COUNT(*) AS learners
FROM enrolments
WHERE status = 'active'
GROUP BY course_id
HAVING COUNT(*) >= 10;
¦¦¦

### [basic] DELETE vs TRUNCATE vs DROP.
¦DELETE¦ removes rows (with ¦WHERE¦), is logged row by row, fires triggers and can roll back. ¦TRUNCATE¦ empties the table quickly, resets auto-increment, is DDL (implicit commit in MySQL) and cannot filter. ¦DROP¦ removes the table and its structure.

### [basic] How do you handle NULL in SQL?
NULL means unknown, so any comparison with NULL is unknown, not true. Use ¦IS NULL¦ / ¦IS NOT NULL¦, ¦COALESCE(col, 0)¦ for defaults, and be careful: ¦NOT IN (subquery)¦ returns no rows if the subquery contains a NULL; use ¦NOT EXISTS¦ instead. Aggregates like ¦COUNT(col)¦ ignore NULLs while ¦COUNT(*)¦ counts rows.

### [basic] UNION vs UNION ALL.
¦UNION¦ combines results and removes duplicates (extra sort/dedupe cost). ¦UNION ALL¦ keeps everything and is faster. Use ¦UNION ALL¦ unless you need de-duplication.

### [basic] Which data types should you choose in MySQL?
Money: ¦DECIMAL(12,2)¦, never FLOAT. Ids: ¦BIGINT UNSIGNED¦. Text: ¦VARCHAR(n)¦ for short, ¦TEXT¦ for long content (not indexable fully). Time: ¦DATETIME¦ for local wall-clock values, ¦TIMESTAMP¦ for UTC-based instants (range to 2038 in older versions; session time zone applies). Booleans: ¦TINYINT(1)¦ / ¦BOOLEAN¦. Use ¦utf8mb4¦ so emoji and all languages work. ¦ENUM¦ is compact but altering it needs a migration; a lookup table is often more flexible.

### [basic] IN vs EXISTS vs JOIN.
Modern MySQL optimises many ¦IN (subquery)¦ forms into semi-joins, so performance is often similar. ¦EXISTS¦ stops at the first match and handles NULLs correctly (¦NOT EXISTS¦). Use ¦JOIN¦ when you need columns from the other table. Always check ¦EXPLAIN¦ instead of guessing.

### [intermediate] What is an index and how does it work in InnoDB?
An index is a sorted structure (a B+tree) that lets the database find rows without scanning the whole table. In InnoDB the **primary key is the clustered index**: the table rows live in the leaves, ordered by the key. Secondary indexes store the indexed columns plus the primary key, so a lookup may need a second hop to the clustered index unless the index is **covering**. Indexes speed up reads (¦WHERE¦, ¦JOIN¦, ¦ORDER BY¦, ¦GROUP BY¦) but slow writes and use space, so add only what queries need.

### [intermediate] Explain composite indexes and the leftmost prefix rule.
An index on ¦(status, course_id, enrolled_at)¦ can serve queries filtering on ¦status¦; ¦status, course_id¦; or all three, but not ¦course_id¦ alone. Order columns by: equality columns first, then the range or sort column. A range condition stops later columns from being used for filtering. Put the most selective equality filter early only if it helps the actual queries.

¦¦¦sql
CREATE INDEX idx_enr_status_course_date ON enrolments (status, course_id, enrolled_at);
SELECT * FROM enrolments WHERE status = 'active' AND course_id = 7 AND enrolled_at >= '2026-01-01';
¦¦¦

### [intermediate] Why might MySQL ignore an index?
- Function or expression on the column: ¦WHERE DATE(created_at) = '2026-10-01'¦ (use a range instead).
- Leading wildcard: ¦LIKE '%abc'¦.
- Implicit type conversion: comparing a ¦VARCHAR¦ column to a number.
- Low selectivity: the optimiser decides a scan is cheaper (boolean or tiny enum columns).
- OR across different columns (consider ¦UNION¦ or separate indexes), or wrong column order in a composite index.
- Outdated statistics (run ¦ANALYZE TABLE¦).
Confirm with ¦EXPLAIN¦.

### [intermediate] How do you read EXPLAIN output?
Look at: ¦type¦ (best to worst: ¦const¦, ¦eq_ref¦, ¦ref¦, ¦range¦, ¦index¦, ¦ALL¦ = full scan), ¦key¦ (index used), ¦rows¦ (estimated rows examined), and ¦Extra¦ (¦Using index¦ = covering, ¦Using filesort¦ / ¦Using temporary¦ = costly). ¦EXPLAIN ANALYZE¦ (MySQL 8.0.18+) runs the query and shows real timings and row counts. Goal: examine few rows, use an index for filtering and ordering, avoid sorting large sets.

### [intermediate] Explain ACID.
**Atomicity**: all statements in a transaction succeed or none do. **Consistency**: constraints and rules hold before and after. **Isolation**: concurrent transactions do not see each other's partial work (to a configurable degree). **Durability**: committed data survives crashes (InnoDB redo log and flush settings). Example: enrolling a learner must insert the enrolment and reduce available seats together or not at all.

### [intermediate] What are isolation levels? What is the MySQL default?
| Level | Dirty read | Non-repeatable read | Phantom read |
|---|---|---|---|
| READ UNCOMMITTED | Possible | Possible | Possible |
| READ COMMITTED | No | Possible | Possible |
| REPEATABLE READ (InnoDB default) | No | No | Mostly prevented (MVCC snapshot + gap locks) |
| SERIALIZABLE | No | No | No |

Higher isolation means fewer anomalies but more locking and contention. PostgreSQL defaults to READ COMMITTED. Choose the lowest level that is correct for the operation and handle conflicts explicitly.

### [intermediate] What is a deadlock and how do you handle it?
Two transactions each hold a lock the other needs, so neither can proceed. InnoDB detects it and rolls back one (error 1213). Reduce them by keeping transactions short, accessing rows in a consistent order, indexing the columns used in ¦WHERE¦ of updates (otherwise InnoDB locks more rows), and avoiding user interaction inside transactions. The application must **catch and retry** the failed transaction. Check ¦SHOW ENGINE INNODB STATUS¦ for the last deadlock.

### [intermediate] What is the N+1 query problem? How do you fix it in Sequelize?
Loading a list (1 query) and then querying related data for each item (N queries). Fix with eager loading (¦include¦) which issues a JOIN or a second batched query, or by batching ids with ¦IN¦.

¦¦¦js
// N+1: 1 + N queries
const courses = await Course.findAll();
for (const c of courses) c.lessons = await Lesson.findAll({ where: { courseId: c.id } });

// Fixed: 1 or 2 queries
const courses2 = await Course.findAll({
  include: [{ model: Lesson, separate: true, order: [['position', 'ASC']] }],
});
¦¦¦
¦separate: true¦ runs a second ¦IN¦ query for hasMany includes, which avoids row explosion and works properly with ¦limit¦. Verify with ¦logging: console.log¦ or a query counter in tests.

### [intermediate] Explain Sequelize associations and include.
¦hasOne/belongsTo¦ model one-to-one or many-to-one (the foreign key lives on the "belongs to" side), ¦hasMany¦ one-to-many, ¦belongsToMany¦ many-to-many through a join model.
¦¦¦js
User.hasMany(Enrolment, { foreignKey: 'userId' });
Enrolment.belongsTo(User, { foreignKey: 'userId' });
Course.hasMany(Enrolment, { foreignKey: 'courseId' });
Enrolment.belongsTo(Course, { foreignKey: 'courseId' });
User.belongsToMany(Course, { through: Enrolment, foreignKey: 'userId', otherKey: 'courseId' });

const rows = await Enrolment.findAll({
  where: { status: 'active' },
  include: [{ model: Course, attributes: ['id', 'title'], required: true }, { model: User, attributes: ['name'] }],
});
¦¦¦
¦required: true¦ makes it an INNER JOIN; the default for ¦include¦ with ¦where¦ is also required. Define associations once (an ¦associate¦ function) after all models are loaded.

### [intermediate] Migrations vs sync(). Why not use sync({ alter: true }) in production?
¦sync¦ creates or alters tables from models and is fine for quick prototypes and tests. In production it can drop or rewrite columns unexpectedly, has no history and cannot be reviewed or rolled back. **Migrations** (¦sequelize-cli¦ or ¦umzug¦) are versioned ¦up¦/¦down¦ scripts stored in git, run in CI/CD, and give an audit trail. Keep migrations small, backwards compatible and tested against a copy of production-sized data.

### [intermediate] How do transactions work in Sequelize?
Two styles. **Managed** (preferred): Sequelize commits if the callback resolves and rolls back if it throws. **Unmanaged**: you call ¦commit()¦ / ¦rollback()¦. Every query in the transaction must receive ¦{ transaction: t }¦ (or use CLS to propagate it automatically).
¦¦¦js
await sequelize.transaction(async t => {
  const course = await Course.findByPk(courseId, { transaction: t, lock: t.LOCK.UPDATE });
  if (course.seatsLeft < 1) throw new HttpError(409, 'Course full');
  await Enrolment.create({ userId, courseId, status: 'active' }, { transaction: t });
  await course.decrement('seatsLeft', { transaction: t });
});
¦¦¦
Pitfalls: forgetting the ¦transaction¦ option (query runs outside it), long transactions, calling external APIs inside, and not retrying deadlocks.

### [intermediate] How do you run raw SQL safely in Sequelize?
Never concatenate user input. Use **bind parameters** or **replacements**.
¦¦¦js
const [rows] = await sequelize.query(
  'SELECT id, title FROM courses WHERE category = :cat AND hours <= :hrs ORDER BY title LIMIT :lim',
  { replacements: { cat, hrs, lim: 20 }, type: QueryTypes.SELECT }
);
¦¦¦
Use ¦sequelize.literal¦ only with trusted constants; dynamic ¦ORDER BY¦ columns must come from an allow-list.

### [intermediate] What are Sequelize scopes, hooks, paranoid mode and validations?
- **Scopes**: reusable query fragments (¦Course.scope('published').findAll()¦).
- **Hooks**: lifecycle callbacks (¦beforeCreate¦, ¦afterUpdate¦); useful for hashing or audit but can hide side effects and are skipped by bulk operations unless ¦individualHooks¦.
- **Paranoid**: soft delete using ¦deletedAt¦; ¦destroy()¦ sets the timestamp and queries exclude those rows by default.
- **Validations**: model-level checks (¦isEmail¦, ¦len¦) that run before the query; still keep database constraints.

### [intermediate] Offset vs keyset pagination in SQL.
¦OFFSET 100000¦ makes the database read and discard 100 000 rows, so deep pages are slow and unstable under inserts. **Keyset** uses the last seen values and an index:
¦¦¦sql
SELECT id, created_at FROM enrolments
WHERE (created_at < ?) OR (created_at = ? AND id < ?)
ORDER BY created_at DESC, id DESC
LIMIT 20;
¦¦¦
Needs a matching index ¦(created_at, id)¦ and a unique tiebreaker column.

### [intermediate] What are CTEs and window functions? Give examples.
A **CTE** (¦WITH¦) names a subquery for readability, and can be recursive (hierarchies). **Window functions** compute across related rows without collapsing them.
¦¦¦sql
-- Top 3 courses per category by enrolments
WITH counts AS (
  SELECT c.id, c.category, c.title, COUNT(e.id) AS total
  FROM courses c LEFT JOIN enrolments e ON e.course_id = c.id
  GROUP BY c.id, c.category, c.title
)
SELECT * FROM (
  SELECT counts.*, ROW_NUMBER() OVER (PARTITION BY category ORDER BY total DESC) AS rn FROM counts
) ranked WHERE rn <= 3;

-- Running total per day
SELECT d, SUM(cnt) OVER (ORDER BY d) AS running FROM (SELECT DATE(enrolled_at) d, COUNT(*) cnt FROM enrolments GROUP BY DATE(enrolled_at)) x;
¦¦¦
¦ROW_NUMBER¦ gives unique ranks, ¦RANK¦ leaves gaps after ties, ¦DENSE_RANK¦ does not.

### [intermediate] Common GROUP BY mistakes.
Selecting non-aggregated columns that are not in ¦GROUP BY¦ (rejected by ¦ONLY_FULL_GROUP_BY¦, which is on by default in MySQL 8). Counting joined rows twice after joining two one-to-many tables (use subqueries or ¦COUNT(DISTINCT ...)¦). Putting a row filter in ¦HAVING¦ instead of ¦WHERE¦, which is slower.

### [intermediate] How do you do upserts and bulk inserts?
MySQL: ¦INSERT ... ON DUPLICATE KEY UPDATE¦ (needs a unique key). Sequelize: ¦Model.upsert()¦ or ¦bulkCreate(rows, { updateOnDuplicate: ['status','progress'] })¦. Insert in batches (for example 1 000 rows) in a transaction, validate data first, and avoid per-row round trips. For imports of millions of rows consider ¦LOAD DATA¦ into a staging table, then merge with SQL.

### [intermediate] How do you configure and monitor the connection pool?
Sequelize uses a pool: ¦max¦ (upper bound per process), ¦min¦, ¦acquire¦ (ms to wait for a connection before an error), ¦idle¦. Total connections = instances × ¦max¦ and must stay under the MySQL ¦max_connections¦. Symptoms of exhaustion: ¦SequelizeConnectionAcquireTimeoutError¦, requests hanging, slow queries holding connections, or transactions left open. Fix by shortening queries/transactions, fixing leaks, adding a proxy (RDS Proxy), or scaling the database.

### [intermediate] Foreign keys: ON DELETE actions and indexing.
¦CASCADE¦ deletes children, ¦RESTRICT¦/¦NO ACTION¦ blocks deleting a parent with children, ¦SET NULL¦ clears the reference. Choose deliberately: use ¦RESTRICT¦ for important business data, ¦CASCADE¦ for pure dependents. InnoDB requires an index on foreign key columns and creates one if missing; make sure it matches your query patterns.

### [advanced] Walk me through finding and fixing a slow query.
1. Identify it: slow query log (¦long_query_time¦), ¦performance_schema¦, APM tracing or RDS Performance Insights; rank by total time, not just single duration.
2. Reproduce with production-like data; capture the real parameters.
3. ¦EXPLAIN ANALYZE¦: find full scans, big row estimates, filesort, temp tables, bad join order.
4. Fix: add or reshape an index (composite, covering), rewrite the query (remove functions on columns, select only needed columns, avoid ¦SELECT *¦, replace OFFSET, split OR), reduce joins or pre-aggregate, add caching.
5. Verify with the same measurement, check write overhead of new indexes, deploy the index safely (online DDL), and monitor.
6. Prevent regression with a query budget in tests or dashboards.

### [advanced] Optimistic vs pessimistic locking. How do you prevent double booking?
**Pessimistic**: lock rows up front (¦SELECT ... FOR UPDATE¦) so others wait; good under high contention but can block. **Optimistic**: read a ¦version¦, update with ¦WHERE id = ? AND version = ?¦, and retry if no row changed; good when conflicts are rare. For seats, the best pattern is one atomic statement plus a unique constraint:
¦¦¦sql
UPDATE courses SET seats_left = seats_left - 1 WHERE id = ? AND seats_left > 0;  -- check affectedRows = 1
INSERT INTO enrolments (user_id, course_id) VALUES (?, ?);                         -- unique (user_id, course_id)
¦¦¦
In Sequelize use ¦version: true¦ on the model for optimistic locking (throws ¦OptimisticLockError¦) or ¦lock: t.LOCK.UPDATE¦ inside a transaction.

### [advanced] Explain MVCC and how InnoDB achieves consistent reads.
InnoDB keeps old versions of changed rows in **undo logs**. A consistent read uses a snapshot (read view) so readers see data as of their snapshot while writers create new versions; readers do not block writers. Locking reads (¦FOR UPDATE¦, ¦FOR SHARE¦) read the latest committed data and take locks. The **redo log** guarantees durability, the **buffer pool** caches pages, and **gap/next-key locks** prevent phantoms at REPEATABLE READ. Long-running transactions keep old versions alive and bloat undo space.

### [advanced] Replication, read replicas and lag. What problems appear?
A primary handles writes and streams the binary log to replicas for reads and backups. Issues: **replica lag** (a user writes then reads stale data from a replica), failover complexity, and queries that behave differently under statement-based replication. Mitigate: read-your-writes by routing recent writers (or critical reads) to the primary, monitor ¦Seconds_Behind_Source¦, use semi-sync or Aurora where needed, keep heavy reports on a dedicated replica, and use RDS Multi-AZ for automatic failover.

### [advanced] How do you change a schema on a huge table with zero downtime?
Use **expand → migrate → contract**:
1. Expand: add the new nullable column or table (online/INSTANT DDL where supported, or gh-ost / pt-online-schema-change for rebuilds).
2. Deploy code that writes to both old and new fields and reads the old one.
3. Backfill existing rows in small batches with sleeps so replication and locks stay healthy.
4. Switch reads to the new field, verify, then add constraints (¦NOT NULL¦, indexes, FK) in a later step.
5. Contract: stop writing the old field and drop it in a later release.
Make every step backwards compatible so a rollback is safe.

### [advanced] Partitioning vs sharding. When do you need them?
**Partitioning** splits one large table into parts in the same database (by range of date, hash) for faster pruning and easy archiving or dropping old data; it does not remove the single-server limit. **Sharding** spreads data across multiple servers by a shard key, adding routing, cross-shard queries and rebalancing complexity. Try cheaper options first: better indexes, query fixes, caching, read replicas, archiving, bigger instance. Shard only when write volume or data size truly exceeds one node.

### [advanced] MySQL vs PostgreSQL: what are the key differences?
| Area | MySQL (InnoDB) | PostgreSQL |
|---|---|---|
| MVCC cleanup | Undo logs, purge | Dead tuples, VACUUM |
| JSON | JSON type | JSONB with rich indexing (GIN) |
| Indexes | B-tree, full-text, spatial | Many types: partial, expression, GIN, GiST, BRIN |
| Default isolation | REPEATABLE READ | READ COMMITTED |
| Extensions and features | Simpler | Very extensible (PostGIS, pgvector) |
| Replication | Binlog-based, very common | Streaming/logical |

Both are excellent. Say you have worked with both (as on your resume) and choose by team skills, features needed (JSONB, PostGIS) and operations support.

### [advanced] How would you model course progress and certificates?
Tables: ¦users¦, ¦courses¦, ¦lessons¦ (¦course_id¦, ¦position¦), ¦enrolments¦ (unique ¦user_id, course_id¦, ¦status¦, ¦enrolled_at¦, ¦completed_at¦), ¦lesson_progress¦ (unique ¦enrolment_id, lesson_id¦, ¦completed_at¦, ¦score¦), ¦certificates¦ (¦enrolment_id¦, ¦issued_at¦, ¦code¦). Indexes for dashboards: ¦(course_id, status)¦ and ¦(user_id, status)¦. Store derived ¦progress_percent¦ only if reads need it and update it in the same transaction as progress rows; otherwise compute with aggregation. Keep an audit table for compliance events.

### [advanced] Backup and recovery strategy?
Combine **full backups** (physical snapshots or ¦mysqldump¦/¦xtrabackup¦) with **binary logs** for point-in-time recovery. On RDS use automated backups with retention plus manual snapshots before risky changes. Define RPO (acceptable data loss) and RTO (restore time). Practise restores regularly and verify them in a staging environment; an untested backup is not a backup. Encrypt backups and restrict access.

### [advanced] How do you safely update millions of rows?
Do it in **batches** (for example 1 000–10 000 rows by primary key range) with short transactions, a sleep between batches, and idempotent conditions so the job can resume. Avoid long locks, watch replication lag and deadlocks, run during low traffic, and keep a dry run query plus a rollback plan. Prefer a background job with progress tracking over a single giant ¦UPDATE¦.

## EXERCISES

### [basic] Design the schema: users, courses, enrolments
Write MySQL DDL with correct keys, constraints and indexes for a learner who can enrol in a course once. This schema is used in the other exercises.
--- solution ---
¦¦¦sql
CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(120) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE courses (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(60) NOT NULL,
  seats_left INT NOT NULL DEFAULT 0,
  CHECK (seats_left >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE enrolments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  course_id BIGINT UNSIGNED NOT NULL,
  status ENUM('active','completed','dropped') NOT NULL DEFAULT 'active',
  progress TINYINT UNSIGNED NOT NULL DEFAULT 0,
  enrolled_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME NULL,
  UNIQUE KEY uq_user_course (user_id, course_id),
  KEY idx_course_status (course_id, status),
  CONSTRAINT fk_enr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_enr_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
¦¦¦
Explain choices: unique constraint prevents double enrolment even under races, composite index supports "learners in a course by status", foreign keys protect integrity, ¦utf8mb4¦ supports all characters.

### [basic] Top 5 courses by number of enrolments
Return course id, title and enrolment count, including courses with zero enrolments in the ranking logic.
--- solution ---
¦¦¦sql
SELECT c.id, c.title, COUNT(e.id) AS total
FROM courses c
LEFT JOIN enrolments e ON e.course_id = c.id
GROUP BY c.id, c.title
ORDER BY total DESC, c.id
LIMIT 5;
¦¦¦
Mention: ¦COUNT(e.id)¦ not ¦COUNT(*)¦ so zero-enrolment courses show 0, and a deterministic tiebreaker in ¦ORDER BY¦.

### [basic] Users who have never enrolled
Write two versions: with ¦LEFT JOIN¦ and with ¦NOT EXISTS¦.
--- solution ---
¦¦¦sql
SELECT u.* FROM users u
LEFT JOIN enrolments e ON e.user_id = u.id
WHERE e.id IS NULL;

SELECT u.* FROM users u
WHERE NOT EXISTS (SELECT 1 FROM enrolments e WHERE e.user_id = u.id);
¦¦¦
Avoid ¦NOT IN (SELECT user_id ...)¦ if ¦user_id¦ could be NULL; it would return nothing.

### [intermediate] Find and delete duplicate emails
Assume the unique key is missing and the table has duplicate emails. Keep the row with the lowest id.
--- solution ---
¦¦¦sql
-- find
SELECT email, COUNT(*) AS c FROM users GROUP BY email HAVING c > 1;

-- delete, keep the lowest id
DELETE u1 FROM users u1
JOIN users u2 ON u1.email = u2.email AND u1.id > u2.id;

-- prevent in future
ALTER TABLE users ADD UNIQUE KEY uq_users_email (email);
¦¦¦
Always run the ¦SELECT¦ version of the join first and take a backup. Re-point child rows (enrolments) to the surviving id before deleting.

### [intermediate] Latest enrolment per user
Return each user's most recent enrolment row.
> Hint: Rank rows inside each user with a window function.
--- solution ---
¦¦¦sql
SELECT id, user_id, course_id, enrolled_at
FROM (
  SELECT e.*, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY enrolled_at DESC, id DESC) AS rn
  FROM enrolments e
) ranked
WHERE rn = 1;
¦¦¦
Use ¦RANK¦ if you want ties kept. A pre-MySQL-8 alternative joins to a ¦MAX(enrolled_at)¦ derived table.

### [intermediate] Rank learners by completions per month
For each month, rank users by the number of completed courses (highest first).
--- solution ---
¦¦¦sql
SELECT month, user_id, completed,
       RANK() OVER (PARTITION BY month ORDER BY completed DESC) AS rnk
FROM (
  SELECT DATE_FORMAT(completed_at, '%Y-%m') AS month, user_id, COUNT(*) AS completed
  FROM enrolments
  WHERE status = 'completed'
  GROUP BY month, user_id
) t
ORDER BY month, rnk;
¦¦¦

### [intermediate] Fix a slow query
This query scans millions of rows. Rewrite it and add the right index.
¦¦¦sql
SELECT id, user_id FROM enrolments
WHERE DATE(enrolled_at) = '2026-10-01' AND status = 'active';
¦¦¦
> Hint: A function on the column prevents index use. Think equality column first, range column second.
--- solution ---
¦¦¦sql
SELECT id, user_id FROM enrolments
WHERE status = 'active'
  AND enrolled_at >= '2026-10-01'
  AND enrolled_at <  '2026-10-02';

CREATE INDEX idx_enr_status_date ON enrolments (status, enrolled_at, user_id);
¦¦¦
The range is **sargable** now and the index can satisfy the filter. Adding ¦user_id¦ makes it **covering** (no table lookup, ¦Using index¦ in EXPLAIN). Verify with ¦EXPLAIN ANALYZE¦ before and after.

### [intermediate] Sequelize models, associations and a paginated include query
Define ¦User¦, ¦Course¦ and ¦Enrolment¦ with Sequelize and return page 2 of active enrolments with course title and user name.
--- solution ---
¦¦¦js
import { Sequelize, DataTypes } from 'sequelize';

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: false,
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
});

const base = { underscored: true };
export const User = sequelize.define('User', {
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true, validate: { isEmail: true } },
  name: { type: DataTypes.STRING(120), allowNull: false },
}, { ...base, tableName: 'users' });

export const Course = sequelize.define('Course', {
  title: { type: DataTypes.STRING(200), allowNull: false },
  category: { type: DataTypes.STRING(60), allowNull: false },
  seatsLeft: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, { ...base, tableName: 'courses' });

export const Enrolment = sequelize.define('Enrolment', {
  status: { type: DataTypes.ENUM('active', 'completed', 'dropped'), defaultValue: 'active' },
  progress: { type: DataTypes.TINYINT.UNSIGNED, defaultValue: 0 },
}, { ...base, tableName: 'enrolments', indexes: [{ unique: true, fields: ['user_id', 'course_id'] }] });

User.hasMany(Enrolment, { foreignKey: 'userId' });
Enrolment.belongsTo(User, { foreignKey: 'userId' });
Course.hasMany(Enrolment, { foreignKey: 'courseId' });
Enrolment.belongsTo(Course, { foreignKey: 'courseId' });

export async function activeEnrolments(page = 2, size = 20) {
  return Enrolment.findAndCountAll({
    where: { status: 'active' },
    include: [{ model: Course, attributes: ['id', 'title'] }, { model: User, attributes: ['id', 'name'] }],
    order: [['id', 'DESC']],
    limit: size,
    offset: (page - 1) * size,
  });
}
¦¦¦
Explain ¦underscored¦ (camelCase attributes map to snake_case columns) and that deep offsets get slow, so keyset pagination is better for big tables.

### [intermediate] Fix an N+1 in Sequelize
The code below loads users then queries enrolments per user. Rewrite it to avoid N+1 and explain ¦separate¦.
¦¦¦js
const users = await User.findAll({ limit: 50 });
for (const u of users) {
  u.enrolments = await Enrolment.findAll({ where: { userId: u.id } });
}
¦¦¦
--- solution ---
¦¦¦js
const users = await User.findAll({
  limit: 50,
  include: [{ model: Enrolment, separate: true, where: { status: 'active' }, required: false }],
});
// 2 queries: users, then enrolments WHERE user_id IN (...)
¦¦¦
Without ¦separate: true¦ a ¦hasMany¦ include plus ¦limit¦ makes Sequelize wrap the query in a subquery or return duplicated rows. With ¦separate: true¦ it runs a clean second ¦IN¦ query. Alternatively fetch all ids once and use one ¦findAll¦ with ¦userId: { [Op.in]: ids }¦ and group in JavaScript.

### [advanced] Enrol safely when seats are limited
Implement ¦enrol(userId, courseId)¦ so two simultaneous requests cannot oversell the last seat and a learner cannot enrol twice.
--- solution ---
¦¦¦js
import { Op, UniqueConstraintError } from 'sequelize';

export async function enrol(userId, courseId) {
  try {
    return await sequelize.transaction(async t => {
      // atomic decrement: only succeeds while seats remain
      const [affected] = await Course.update(
        { seatsLeft: sequelize.literal('seats_left - 1') },
        { where: { id: courseId, seatsLeft: { [Op.gt]: 0 } }, transaction: t }
      );
      if (affected === 0) throw Object.assign(new Error('Course full'), { status: 409 });

      // unique (user_id, course_id) stops duplicates even under races
      return Enrolment.create({ userId, courseId }, { transaction: t });
    });
  } catch (e) {
    if (e instanceof UniqueConstraintError) throw Object.assign(new Error('Already enrolled'), { status: 409 });
    throw e;
  }
}
¦¦¦
Why it works: the conditional ¦UPDATE¦ is atomic at the row level, the unique key is the final guard, and if the insert fails the transaction rolls back the seat decrement. Add a retry on deadlock errors.

### [advanced] Optimistic locking with a version column
Two admins edit the same course at once. The second save must fail instead of overwriting.
--- solution ---
¦¦¦js
const Course = sequelize.define('Course', {
  title: DataTypes.STRING,
  summary: DataTypes.TEXT,
}, { tableName: 'courses', underscored: true, version: true }); // adds an incrementing "version" column

async function updateTitle(id, title, expectedVersion) {
  const course = await Course.findByPk(id);
  if (course.version !== expectedVersion) throw new HttpError(409, 'Course changed, reload and retry');
  try {
    await course.update({ title });                 // UPDATE ... WHERE id = ? AND version = ?
  } catch (e) {
    if (e.name === 'SequelizeOptimisticLockError') throw new HttpError(409, 'Course changed, reload and retry');
    throw e;
  }
}
¦¦¦
Send the ¦version¦ (or an ETag / ¦If-Match¦ header) to the client with the record and require it back on update.

### [advanced] Keyset pagination with a composite cursor
Return the next 20 enrolments ordered by newest first using a cursor made of ¦(enrolled_at, id)¦, in SQL and Sequelize.
--- solution ---
¦¦¦sql
CREATE INDEX idx_enr_date_id ON enrolments (enrolled_at, id);

SELECT id, user_id, enrolled_at FROM enrolments
WHERE enrolled_at < :at OR (enrolled_at = :at AND id < :id)
ORDER BY enrolled_at DESC, id DESC
LIMIT 21;
¦¦¦
¦¦¦js
const rows = await Enrolment.findAll({
  where: cursor
    ? { [Op.or]: [{ enrolledAt: { [Op.lt]: cursor.at } }, { enrolledAt: cursor.at, id: { [Op.lt]: cursor.id } }] }
    : {},
  order: [['enrolledAt', 'DESC'], ['id', 'DESC']],
  limit: 21,
});
const hasMore = rows.length > 20;
const items = rows.slice(0, 20);
const last = items[items.length - 1];
const nextCursor = hasMore ? Buffer.from(JSON.stringify({ at: last.enrolledAt, id: last.id })).toString('base64url') : null;
¦¦¦
Fetching 21 rows tells you whether another page exists without a ¦COUNT¦.

### [advanced] Safe migration to add a NOT NULL column to a huge table
Add ¦completed_at¦ semantics for ¦enrolments¦ with 50 million rows, with zero downtime. Show the migration and the plan.
--- solution ---
¦¦¦js
// 20261030-add-enrolments-completed-at.js  (step 1: expand)
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('enrolments', 'completed_at', { type: Sequelize.DATE, allowNull: true });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('enrolments', 'completed_at');
  },
};
¦¦¦
Plan:
1. **Expand**: add the column as nullable (instant/online DDL in MySQL 8 for most cases).
2. **Dual write**: deploy code that sets ¦completed_at¦ whenever status becomes completed.
3. **Backfill** in batches: ¦UPDATE enrolments SET completed_at = updated_at WHERE status='completed' AND completed_at IS NULL AND id BETWEEN ? AND ?¦ for ranges of 5 000 ids with a short pause.
4. **Switch reads**, verify counts, then in a later migration add the index or constraint.
5. Roll back safely at any step because every step is backwards compatible.

### [intermediate] Keyset pagination cursor (pure JavaScript)
Write ¦paginate(rows, { limit, cursor })¦ for rows shaped ¦{ id, enrolledAt }¦ (ISO date strings). Return the newest rows first, ordered by ¦(enrolledAt, id)¦ descending, as ¦{ items, nextCursor }¦. The cursor is an opaque base64 string. A cursor that cannot be decoded must throw ¦Invalid cursor¦, and ¦nextCursor¦ is ¦null¦ on the last page.
> Hint: Fetch ¦limit + 1¦ rows to learn whether another page exists, and compare on ¦enrolledAt¦ first and ¦id¦ second so rows with the same timestamp are not skipped or repeated.
--- solution ---
¦¦¦js
const encodeCursor = row => btoa(JSON.stringify({ at: row.enrolledAt, id: row.id }));

function decodeCursor(cursor) {
  try {
    const c = JSON.parse(atob(cursor));
    if (typeof c.at !== 'string' || !Number.isInteger(c.id)) throw new Error('shape');
    return c;
  } catch {
    throw new Error('Invalid cursor');
  }
}

function paginate(rows, { limit = 20, cursor } = {}) {
  const after = cursor ? decodeCursor(cursor) : null;
  const sorted = [...rows].sort((a, b) => b.enrolledAt.localeCompare(a.enrolledAt) || b.id - a.id);
  const page = sorted
    .filter(r => !after || r.enrolledAt < after.at || (r.enrolledAt === after.at && r.id < after.id))
    .slice(0, limit + 1);                       // one extra row tells us if there is a next page
  const hasMore = page.length > limit;
  const items = page.slice(0, limit);
  return { items, nextCursor: hasMore ? encodeCursor(items[items.length - 1]) : null };
}
¦¦¦
This is the same logic as the SQL ¦WHERE enrolled_at < :at OR (enrolled_at = :at AND id < :id)¦. A database does it with an index instead of sorting everything, so every page costs the same however deep you go.
--- starter ---
¦¦¦js
const encodeCursor = row => btoa(JSON.stringify({ at: row.enrolledAt, id: row.id }));

function decodeCursor(cursor) {
  // your code here: parse the cursor, throw new Error('Invalid cursor') if it is bad
}

function paginate(rows, { limit = 20, cursor } = {}) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
const rows = [
  { id: 1, enrolledAt: '2025-01-01T10:00:00Z' },
  { id: 2, enrolledAt: '2025-01-02T10:00:00Z' },
  { id: 3, enrolledAt: '2025-01-02T10:00:00Z' },   // same timestamp as id 2
  { id: 4, enrolledAt: '2025-01-03T10:00:00Z' },
  { id: 5, enrolledAt: '2025-01-03T10:00:00Z' },
  { id: 6, enrolledAt: '2025-01-04T10:00:00Z' },
  { id: 7, enrolledAt: '2025-01-05T10:00:00Z' },
];
const ids = page => page.items.map(r => r.id);

test('first page is the newest rows, ordered by date then id descending', () => {
  eq(ids(paginate(rows, { limit: 3 })), [7, 6, 5]);
});
test('nextCursor is a string when more rows exist', () => {
  eq(typeof paginate(rows, { limit: 3 }).nextCursor, 'string');
});
test('the next page continues exactly where the last one stopped', () => {
  const p1 = paginate(rows, { limit: 3 });
  eq(ids(paginate(rows, { limit: 3, cursor: p1.nextCursor })), [4, 3, 2]);
});
test('walking every page returns each row exactly once, even with equal timestamps', () => {
  const seen = [];
  let cursor;
  for (let guard = 0; guard < 10; guard++) {
    const p = paginate(rows, { limit: 2, cursor });
    seen.push(...ids(p));
    if (!p.nextCursor) break;
    cursor = p.nextCursor;
  }
  eq(seen, [7, 6, 5, 4, 3, 2, 1]);
});
test('last page has nextCursor null', () => {
  eq(paginate(rows, { limit: 7 }).nextCursor, null);
  eq(paginate(rows, { limit: 50 }).nextCursor, null);
});
test('empty input returns an empty page', () => {
  eq(paginate([], { limit: 5 }), { items: [], nextCursor: null });
});
test('a cursor that is not valid base64 JSON throws Invalid cursor', () => {
  throws(() => paginate(rows, { limit: 2, cursor: '%%%not-a-cursor' }));
});
test('a cursor with the wrong shape throws', () => {
  throws(() => paginate(rows, { limit: 2, cursor: btoa(JSON.stringify({ at: 5 })) }));
});
¦¦¦

### [intermediate] Build a safe WHERE clause with placeholders
Write ¦buildWhere(filters)¦ that turns a filter object from a query string into ¦{ sql, params }¦ for a ¦courses¦ query. Only allow ¦status¦, ¦level¦ (equals), ¦minHours¦ (¦hours >= ?¦), ¦maxHours¦ (¦hours <= ?¦) and ¦title¦ (¦LIKE¦ with the text wrapped in ¦%¦). Ignore empty values, throw for unknown keys, and never put user text into the SQL string.
> Hint: Column names and operators come from your own whitelist, and every value goes into ¦params¦ with a ¦?¦ placeholder.
--- solution ---
¦¦¦js
const ALLOWED = { status: '=', level: '=', minHours: '>=', maxHours: '<=', title: 'LIKE' };
const COLUMN = { minHours: 'hours', maxHours: 'hours' };

function buildWhere(filters = {}) {
  const parts = [];
  const params = [];
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === '') continue;
    const op = ALLOWED[key];
    if (!op) throw new Error('Unknown filter: ' + key);
    parts.push((COLUMN[key] || key) + ' ' + op + ' ?');
    params.push(op === 'LIKE' ? '%' + value + '%' : value);
  }
  return { sql: parts.length ? 'WHERE ' + parts.join(' AND ') : '', params };
}
¦¦¦
Whitelisting keys stops SQL injection through column names, which placeholders cannot protect. Values travel separately, so a value like ¦'; DROP TABLE courses;--¦ is just data.
--- starter ---
¦¦¦js
const ALLOWED = { status: '=', level: '=', minHours: '>=', maxHours: '<=', title: 'LIKE' };
const COLUMN = { minHours: 'hours', maxHours: 'hours' };

function buildWhere(filters = {}) {
  // your code here: return { sql, params }
}
¦¦¦
--- tests ---
¦¦¦js
test('no filters gives an empty clause', () => {
  eq(buildWhere({}), { sql: '', params: [] });
  eq(buildWhere(), { sql: '', params: [] });
});
test('one equality filter', () => {
  eq(buildWhere({ status: 'published' }), { sql: 'WHERE status = ?', params: ['published'] });
});
test('several filters are joined with AND in the given order', () => {
  eq(buildWhere({ status: 'published', level: 'basic' }), { sql: 'WHERE status = ? AND level = ?', params: ['published', 'basic'] });
});
test('minHours and maxHours both use the hours column', () => {
  eq(buildWhere({ minHours: 2, maxHours: 10 }), { sql: 'WHERE hours >= ? AND hours <= ?', params: [2, 10] });
});
test('title uses LIKE and wraps the text in percent signs', () => {
  eq(buildWhere({ title: 'react' }), { sql: 'WHERE title LIKE ?', params: ['%react%'] });
});
test('empty, null and undefined values are ignored', () => {
  eq(buildWhere({ status: '', level: null, title: undefined, minHours: 3 }), { sql: 'WHERE hours >= ?', params: [3] });
});
test('unknown filter keys throw', () => {
  throws(() => buildWhere({ 'status; DROP TABLE courses': 'x' }));
  throws(() => buildWhere({ password: 'x' }));
});
test('malicious values stay in params and never reach the SQL text', () => {
  const evil = "x'; DROP TABLE courses;--";
  const r = buildWhere({ status: evil });
  eq(r.params, [evil]);
  ok(!r.sql.includes('DROP'), 'the SQL string must not contain user text');
});
¦¦¦

## SCENARIOS

### Your reporting page takes 20 seconds because of one SQL query. How do you approach it?
Describe the workflow: get the exact query and parameters from logs, run ¦EXPLAIN ANALYZE¦ on production-like data, identify full scans or large joins, add a composite or covering index, remove functions on columns, select only needed columns, pre-aggregate or cache results, and move heavy reporting to a read replica or a summary table updated by a job. Show before/after timings, and note how you prevented the regression. This maps directly to the query optimisation on your resume.

### Two learners click "Enrol" for the last seat at the same moment. What happens in your system?
Explain the atomic conditional update plus unique constraint inside a transaction (see the exercise), the 409 response for the loser, and how you test concurrency with parallel requests. Mention idempotency keys for retries and why checking seats in application code first (read-then-write) is unsafe.

### A deployment added a column to a table with 80 million rows and the site slowed down. How would you have avoided it, and what do you do now?
Now: stop or throttle the migration if possible, check locks (¦SHOW PROCESSLIST¦, ¦performance_schema.metadata_locks¦), communicate status. Prevention: test migrations on production-sized data, use online/INSTANT DDL or gh-ost, expand/contract steps, run in off-peak windows, add migration checks in CI, and have a rollback plan.

### Why use Sequelize instead of raw SQL, and when would you drop to raw SQL?
ORM benefits: model definitions, validation, associations, migrations, protection against basic injection, and portability across MySQL and PostgreSQL. Costs: hidden queries, N+1 risks, awkward complex reporting and window functions. Use the ORM for CRUD and simple relations; use raw SQL (with bind parameters) for complex reports, bulk operations and performance-critical paths, wrapped in repository functions with tests. Always inspect generated SQL in development.

### You discover that someone deleted production rows by mistake. How do you recover?
Stop further damage (restrict access), assess scope and time, restore from backup or snapshot into a **separate** instance, use binary logs for point-in-time recovery to just before the mistake, copy the missing rows back with a reviewed script in a transaction, validate with the business, then write a post-mortem: add soft deletes where appropriate, least-privilege DB users, change approval for destructive scripts, and regular restore drills.

### How do you design a database for a multi-tenant SaaS product?
Options: shared database with a ¦tenant_id¦ column on every table (cheapest, needs strict query scoping and composite indexes starting with ¦tenant_id¦), schema per tenant, or database per tenant (strong isolation, higher operational cost). Enforce tenant scoping in one data-access layer, include ¦tenant_id¦ in unique keys, add row-level checks in tests, plan noisy-neighbour limits and per-tenant backup/export needs. Choose by isolation requirements, number of tenants and compliance rules.
`;
