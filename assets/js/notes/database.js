window.PREP_NOTES = window.PREP_NOTES || {};
window.PREP_NOTES.database = String.raw`
## Phase 1 · Foundations (Basic)
### Relational concepts: tables, keys and ER diagrams
#### In one line
A relational database stores data in tables (rows and columns) and links them using keys. Keys make every row identifiable and every relationship explicit.

#### Real-life analogy
Think of a school register: each student has a roll number (primary key). The library card lists that roll number (foreign key), so you can always find which student borrowed a book without copying the student's name everywhere.

#### How it works
- **Table** = one kind of thing (users, courses). **Row** = one record. **Column** = one attribute.
- **Primary key (PK)**: unique, never NULL, identifies a row. Usually an auto-increment ¦BIGINT¦ or UUID.
- **Foreign key (FK)**: a column that points to a PK in another table. The database refuses values that do not exist there.
- **Relationships**: one-to-many (one course, many lessons), many-to-many (users and courses via a **junction table** ¦enrolments¦), one-to-one (user and profile).
- **ER diagram**: boxes for tables, lines for relationships, with crow's foot for "many".

#### Example
¦¦¦sql
CREATE TABLE users   (id BIGINT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(190) NOT NULL UNIQUE);
CREATE TABLE courses (id BIGINT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(200) NOT NULL);
-- junction table for the many-to-many relationship
CREATE TABLE enrolments (
  user_id   BIGINT NOT NULL,
  course_id BIGINT NOT NULL,
  enrolled_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, course_id),               -- one enrolment per pair
  FOREIGN KEY (user_id)   REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
¦¦¦

#### Remember it
- **PK = identity, FK = link.**
- One-to-many: put the FK on the "many" side.
- Many-to-many always needs a third (junction) table.
- Draw the boxes first, SQL second.

#### Common mistakes
- Storing comma-separated ids in one column instead of a junction table.
- Forgetting an index on FK columns used in joins (MySQL InnoDB creates one automatically for declared FKs).
- Using a natural key like email as PK, then changing it later.

#### Interview angle
They ask: "Design a schema for a learning platform." Say: "Users and courses are many-to-many, so I use an enrolments junction table with a composite PK, FKs to both, and timestamps. Progress hangs off enrolments." Follow-up: *why a surrogate key instead of email?* Because emails change and surrogate keys keep FKs stable and small.

### SQL basics: SELECT, WHERE, ORDER BY, LIMIT
#### In one line
SELECT reads rows; WHERE, ORDER BY, LIMIT and friends decide which rows come back and in what order. They run in a fixed logical order, not the order you type.

#### Real-life analogy
Ordering at a restaurant: pick a menu section (FROM), filter allergies (WHERE), choose which columns of the dish you want (SELECT), sort by price (ORDER BY), take only the first three (LIMIT).

#### How it works
- Logical order: **FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT**.
- That is why you cannot use a SELECT alias in WHERE but can in ORDER BY.
- ¦LIKE 'ab%'¦ matches prefixes (index friendly); ¦'%ab'¦ cannot use a normal index.
- ¦IN (1,2,3)¦ = several ORs. ¦BETWEEN a AND b¦ is inclusive on both ends.
- Always add ¦ORDER BY¦ with ¦LIMIT¦, otherwise the rows returned are arbitrary.

#### Example
¦¦¦sql
SELECT DISTINCT c.category,            -- unique categories only
       c.title AS course_title        -- alias
FROM courses c
WHERE c.created_at BETWEEN '2026-01-01' AND '2026-03-31'
  AND c.title LIKE 'React%'
  AND c.level IN ('basic','intermediate')
ORDER BY c.created_at DESC
LIMIT 10 OFFSET 0;                    -- first page
¦¦¦

#### Remember it
Mnemonic for the logical order: **"Fred Went Grocery Hunting, Selecting Deli Orders Lightly"** = From, Where, Group, Having, Select, Distinct, Order, Limit.

#### Common mistakes
- ¦SELECT *¦ in production code (extra data, breaks covering indexes).
- Using ¦LIMIT¦ without ¦ORDER BY¦.
- Using a SELECT alias inside WHERE.

#### Interview angle
Expect: "In what order does SQL execute?" Answer with the FROM-to-LIMIT list and mention aliases. Follow-up: *why is deep OFFSET pagination slow?* MySQL reads and discards all skipped rows; use keyset pagination.

### NULL handling and three-valued logic
#### In one line
NULL means "unknown", not zero or empty, so comparisons with it give UNKNOWN, not true or false. You must use ¦IS NULL¦.

#### Real-life analogy
A sealed envelope: you cannot say it equals another sealed envelope, because you do not know what is inside either.

#### How it works
- ¦NULL = NULL¦ → NULL (not true). ¦NULL <> 1¦ → NULL. WHERE keeps only rows where the condition is **TRUE**.
- ¦IS NULL¦ / ¦IS NOT NULL¦ test for NULL. ¦<=>¦ is MySQL's NULL-safe equals.
- ¦COALESCE(a, b, c)¦ returns the first non-NULL value; ¦IFNULL(a,b)¦ is the two-argument version.
- Aggregates (¦SUM, AVG, COUNT(col)¦) ignore NULLs; ¦COUNT(*)¦ counts rows.
- **NOT IN trap**: if the list contains a NULL, ¦x NOT IN (1, NULL)¦ is never true, so you get zero rows.

#### Example
¦¦¦sql
SELECT COUNT(*) FROM users;                 -- 100 rows
SELECT COUNT(phone) FROM users;             -- 60 (NULL phones ignored)
SELECT name, COALESCE(phone, 'n/a') FROM users;

-- Trap: returns NOTHING if any enrolments.user_id is NULL
SELECT * FROM users WHERE id NOT IN (SELECT user_id FROM enrolments);
-- Safe version
SELECT * FROM users u
WHERE NOT EXISTS (SELECT 1 FROM enrolments e WHERE e.user_id = u.id);
¦¦¦

#### Remember it
- **NULL is contagious**: any comparison with it is unknown.
- Use **IS NULL**, never **= NULL**.
- Prefer **NOT EXISTS** over **NOT IN** with subqueries.

#### Common mistakes
- Writing ¦WHERE col = NULL¦.
- Assuming ¦AVG¦ counts NULL as 0.
- Allowing NULL in columns that should be required.

#### Interview angle
Classic: "Why does NOT IN return no rows?" Say: "Because a NULL in the list makes every comparison UNKNOWN, so no row passes. I use NOT EXISTS or filter NULLs out." Follow-up: *difference between COUNT(*) and COUNT(col)?*

### Aggregation: GROUP BY and HAVING
#### In one line
Aggregation collapses many rows into summary rows (count, sum, average). ¦WHERE¦ filters rows before grouping; ¦HAVING¦ filters groups after.

#### Real-life analogy
Sorting exam papers into piles per class (GROUP BY), then counting each pile (COUNT). WHERE decides which papers enter piles; HAVING decides which piles you keep.

#### How it works
- Functions: ¦COUNT, SUM, AVG, MIN, MAX¦.
- Every non-aggregated column in SELECT must appear in GROUP BY (MySQL's ¦ONLY_FULL_GROUP_BY¦ enforces this).
- ¦COUNT(DISTINCT col)¦ counts unique values.
- ¦HAVING¦ can use aggregates; WHERE cannot.
- Prefer WHERE for row filters because it reduces work earlier.

#### Example
¦¦¦sql
-- Courses with more than 100 active enrolments
SELECT c.id, c.title, COUNT(*) AS learners
FROM enrolments e
JOIN courses c ON c.id = e.course_id
WHERE e.status = 'active'          -- filter rows first
GROUP BY c.id, c.title
HAVING COUNT(*) > 100              -- then filter groups
ORDER BY learners DESC;
¦¦¦

#### Remember it
- **WHERE = rows, HAVING = groups.**
- Order: WHERE → GROUP BY → HAVING.
- Put plain conditions in WHERE even if HAVING would work.

#### Common mistakes
- Using an aggregate inside WHERE.
- Selecting a column that is not grouped.
- Joining one-to-many first and then double-counting; use ¦COUNT(DISTINCT ...)¦ carefully.

#### Interview angle
"Difference between WHERE and HAVING?" Model answer: "WHERE filters individual rows before grouping and can use indexes; HAVING filters aggregated groups afterwards." Follow-up: *write top 5 courses by enrolments*.

### Joins: INNER, LEFT, RIGHT, CROSS, self join
#### In one line
A join combines rows from two tables based on a condition. INNER keeps matches only; LEFT keeps all rows from the left table, filling NULL where no match exists.

#### Real-life analogy
Matching guests to a seating chart. INNER: only guests who have a seat. LEFT: all guests, with a blank seat for those who have none.

#### How it works
- **INNER JOIN**: rows with a match in both tables.
- **LEFT JOIN**: all left rows plus matching right rows (NULLs otherwise). RIGHT is the mirror; most teams just use LEFT.
- **CROSS JOIN**: every combination (m × n rows). Useful for generating calendars.
- **Self join**: a table joined to itself, e.g. employee and manager.
- Put filters on the right table of a LEFT JOIN in the **ON** clause; in WHERE they turn it into an inner join.

#### Example
¦¦¦sql
-- Users with zero enrolments (LEFT JOIN + IS NULL = anti join)
SELECT u.id, u.email
FROM users u
LEFT JOIN enrolments e ON e.user_id = u.id
WHERE e.user_id IS NULL;

-- Self join: employee and manager names
SELECT emp.name, mgr.name AS manager
FROM staff emp LEFT JOIN staff mgr ON mgr.id = emp.manager_id;
¦¦¦

#### Remember it
| Join | Keeps |
|---|---|
| INNER | matches only |
| LEFT | all left + matches |
| CROSS | all combinations |
| Self | same table twice |

Rule: **draw two small tables and walk through them.**

#### Common mistakes
- Putting a right-table filter in WHERE after a LEFT JOIN (kills the NULL rows).
- Joining on non-indexed columns.
- Forgetting the ON clause and creating a cross join.

#### Interview angle
"Find users with no enrolments." Say: "LEFT JOIN enrolments and filter where the right key IS NULL, or use NOT EXISTS." Follow-up: *which is faster?* Usually equivalent on MySQL 8; check with EXPLAIN.

### DDL and constraints
#### In one line
DDL statements (CREATE, ALTER, DROP) define the structure; constraints (NOT NULL, UNIQUE, CHECK, FOREIGN KEY) make the database reject bad data.

#### Real-life analogy
A building's safety rules: doors that only open with the right key, fire exits that cannot be blocked. Constraints protect data even when application code has bugs.

#### How it works
- **NOT NULL** required value. **UNIQUE** no duplicates (creates an index). **CHECK** custom rule (enforced from MySQL 8.0.16).
- **FOREIGN KEY** with ON DELETE: ¦RESTRICT¦/¦NO ACTION¦ (block), ¦CASCADE¦ (delete children), ¦SET NULL¦.
- ¦ALTER TABLE¦ changes columns; on big tables it can lock or rebuild, so plan it (see online DDL).
- DDL statements in MySQL cause an implicit commit; they cannot be rolled back.

#### Example
¦¦¦sql
CREATE TABLE payments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending','paid','failed') NOT NULL DEFAULT 'pending',
  CONSTRAINT chk_amount CHECK (amount > 0),
  CONSTRAINT fk_pay_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE RESTRICT     -- cannot delete a user with payments
);
ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL;
¦¦¦

#### Remember it
- **Data rules live in the database, not only in the app.**
- Default FK rule: RESTRICT. Use CASCADE only for true child data.
- DDL = auto-commit.

#### Common mistakes
- Using CASCADE delete on important data and losing history.
- Relying only on app validation.
- Running ALTER on a huge table at peak time.

#### Interview angle
"Why use constraints if you validate in code?" Say: "Multiple services, scripts and race conditions can bypass app code; constraints guarantee integrity at the last line of defence." Follow-up: *UNIQUE vs unique index?* Same mechanism in MySQL.

### DML: INSERT, UPDATE, DELETE
#### In one line
DML statements change the data: INSERT adds rows, UPDATE modifies them, DELETE removes them. Always test the WHERE first.

#### Real-life analogy
Editing a shared spreadsheet: adding a row is INSERT, changing a cell is UPDATE, removing a row is DELETE. Forgetting the filter is like "find and replace all" on the whole sheet.

#### How it works
- Multi-row insert is much faster than many single inserts: ¦INSERT ... VALUES (...), (...)¦.
- **DELETE** removes rows (can have WHERE, logged, rollbackable, fires triggers). **TRUNCATE** empties the table quickly, resets AUTO_INCREMENT, is DDL (implicit commit). **DROP** removes the table itself.
- Safer habit: run a ¦SELECT¦ with the same WHERE first, and wrap risky changes in a transaction.
- Large deletes: delete in batches (¦LIMIT 1000¦ in a loop) to avoid long locks.

#### Example
¦¦¦sql
INSERT INTO courses (title, level) VALUES ('SQL 101','basic'), ('React Hooks','intermediate');

START TRANSACTION;
SELECT COUNT(*) FROM enrolments WHERE status = 'expired';   -- check first
DELETE FROM enrolments WHERE status = 'expired' LIMIT 1000; -- batch
COMMIT;
¦¦¦

#### Remember it
| Command | Removes | Rollback | WHERE |
|---|---|---|---|
| DELETE | rows | yes | yes |
| TRUNCATE | all rows | no | no |
| DROP | whole table | no | no |

#### Common mistakes
- ¦UPDATE¦ or ¦DELETE¦ without WHERE.
- Giant single DELETE locking the table.
- Using TRUNCATE on tables referenced by foreign keys.

#### Interview angle
"DELETE vs TRUNCATE vs DROP?" Use the table above in words. Follow-up: *how do you delete 50 million old rows safely?* In batches, with an index on the filter column, off-peak, or partition drops.

### MySQL data types
#### In one line
Choosing the right column type saves space, speeds queries and prevents bugs. Use the smallest type that safely fits the data.

#### Real-life analogy
Choosing the right container: you would not store a teaspoon of salt in a water tank, nor a litre of milk in an egg cup.

#### How it works
- Integers: ¦TINYINT, INT, BIGINT¦ (add ¦UNSIGNED¦ for non-negative ids).
- Money: ¦DECIMAL(10,2)¦, never ¦FLOAT/DOUBLE¦ (binary rounding errors).
- Text: ¦VARCHAR(n)¦ for short strings, ¦TEXT¦ for long content. Use ¦utf8mb4¦ so emojis and all languages work.
- Time: ¦DATETIME¦ stores a literal value (range 1000–9999); ¦TIMESTAMP¦ stores UTC, converts to session time zone, ends in 2038. Store UTC consistently.
- ¦JSON¦ for flexible data (index through generated columns). ¦ENUM¦ for small fixed sets (changing it needs ALTER).
- ¦BOOLEAN¦ is just ¦TINYINT(1)¦.

#### Example
¦¦¦sql
CREATE TABLE invoices (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  amount DECIMAL(10,2) NOT NULL,              -- 0.1 + 0.2 = 0.30 exactly
  notes TEXT NULL,
  meta JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
¦¦¦

#### Remember it
- **Money = DECIMAL.**
- **Text = utf8mb4.**
- **Ids = BIGINT UNSIGNED.**
- Store times in UTC.

#### Common mistakes
- FLOAT for prices.
- Old ¦utf8¦ (3-byte) instead of ¦utf8mb4¦.
- Oversized VARCHAR(255) everywhere, especially in indexes.

#### Interview angle
"DATETIME vs TIMESTAMP?" Say: "TIMESTAMP is UTC-based with time-zone conversion and a 2038 limit; DATETIME is a plain value with a wide range. I store UTC and convert in the app." Follow-up: *when would you use JSON columns?*

### Normalisation: 1NF, 2NF, 3NF
#### In one line
Normalisation organises data so each fact is stored once, avoiding update, insert and delete anomalies. Denormalisation deliberately duplicates some data for speed.

#### Real-life analogy
A contacts app stores a company's address once and links people to it. If it copied the address into every person, one office move would mean editing hundreds of entries.

#### How it works
- **1NF**: atomic values, no repeating groups (no "tags = a,b,c").
- **2NF**: every non-key column depends on the **whole** key (matters for composite keys).
- **3NF**: non-key columns depend **only on the key**, not on other non-key columns. Mnemonic: "the key, the whole key, and nothing but the key."
- **Denormalise** when reads dominate and joins are costly: e.g. a stored ¦lesson_count¦ on courses, kept updated by the app.

#### Example
¦¦¦sql
-- Violates 3NF: city depends on pincode, not on the user id
-- users(id, name, pincode, city)
-- Fix: split into two tables
CREATE TABLE pincodes (pincode CHAR(6) PRIMARY KEY, city VARCHAR(80));
CREATE TABLE users2   (id BIGINT PRIMARY KEY, name VARCHAR(100), pincode CHAR(6),
  FOREIGN KEY (pincode) REFERENCES pincodes(pincode));
¦¦¦

#### Remember it
**"The key, the whole key, and nothing but the key."**
- 1NF atomic, 2NF whole key, 3NF only key.
- Normalise first; denormalise with evidence.

#### Common mistakes
- Over-normalising reporting tables.
- Denormalising without a plan to keep copies in sync.
- Storing lists in one column.

#### Interview angle
"Have you denormalised?" Say: "Yes, I stored a pre-computed completion percentage on enrolments because the dashboard read it constantly; the app updates it inside the same transaction as the progress change." Follow-up: *how do you keep it consistent?*

### Subqueries: scalar, IN, EXISTS, derived tables
#### In one line
A subquery is a query inside another query, used as a value, a list, a yes/no check or a temporary table.

#### Real-life analogy
Asking your colleague a smaller question first ("who finished the course?") and using the answer to answer the bigger question.

#### How it works
- **Scalar**: returns one value (¦WHERE price > (SELECT AVG(price) ...)¦).
- **IN**: matches against a list returned by the subquery.
- **EXISTS**: true if the subquery returns any row; stops at the first match and is NULL-safe.
- **Derived table**: a subquery in FROM, must have an alias.
- **Correlated**: references the outer query and conceptually runs per outer row; MySQL 8 often rewrites to semi-joins.
- Often a JOIN or CTE is clearer.

#### Example
¦¦¦sql
-- Courses priced above average
SELECT title FROM courses WHERE price > (SELECT AVG(price) FROM courses);

-- Learners who completed at least one course (EXISTS)
SELECT u.id FROM users u
WHERE EXISTS (SELECT 1 FROM enrolments e WHERE e.user_id = u.id AND e.status = 'completed');

-- Derived table
SELECT t.user_id, t.cnt FROM (SELECT user_id, COUNT(*) cnt FROM enrolments GROUP BY user_id) t WHERE t.cnt > 3;
¦¦¦

#### Remember it
- **EXISTS** = "is there any?" (NULL-safe, short-circuits).
- **IN** = "is it in this list?" (beware NULLs with NOT IN).
- Derived tables need an alias.

#### Common mistakes
- NOT IN with a nullable subquery.
- Correlated subquery in SELECT on a big table when a join works.
- Forgetting the derived table alias.

#### Interview angle
"EXISTS vs IN?" Say: "EXISTS checks for presence and is safe with NULLs; IN compares against a list. In modern MySQL the optimiser often treats them the same, but NOT EXISTS is safer than NOT IN." Follow-up: *rewrite as a join.*

### Sequelize basics: models and CRUD
#### In one line
Sequelize is a Node.js ORM that maps JavaScript classes (models) to MySQL tables, so you run queries with methods instead of hand-written SQL.

#### Real-life analogy
A translator at a meeting: you speak JavaScript, the ORM speaks SQL to the database, and translates results back into objects.

#### How it works
- Create a ¦Sequelize¦ instance (connection + pool), define a model with ¦sequelize.define¦ or ¦Model.init¦.
- CRUD: ¦create, findAll, findOne, findByPk, update, destroy¦.
- Operators from ¦Op¦: ¦Op.gt, Op.like, Op.in, Op.or¦.
- ¦attributes¦ picks columns; ¦order, limit, offset¦ control paging.
- Use ¦raw: true¦ to get plain objects when you do not need model instances (faster).
- ¦sequelize.sync()¦ is for quick demos only; use migrations in real projects.

#### Example
¦¦¦js
const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = new Sequelize('lms', 'app', process.env.DB_PASS, { host: 'localhost', dialect: 'mysql' });

const Course = sequelize.define('Course', {
  title: { type: DataTypes.STRING(200), allowNull: false },
  level: { type: DataTypes.ENUM('basic', 'intermediate', 'advanced'), defaultValue: 'basic' },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, { tableName: 'courses', underscored: true });

await Course.create({ title: 'SQL 101', price: 499 });
const cheap = await Course.findAll({
  where: { price: { [Op.lt]: 1000 }, title: { [Op.like]: 'SQL%' } },
  attributes: ['id', 'title'], order: [['price', 'ASC']], limit: 10, raw: true,
});
// -> [{ id: 1, title: 'SQL 101' }]
¦¦¦

#### Remember it
- **Model = table, instance = row.**
- ¦where¦ + ¦Op¦ symbols for conditions.
- ¦findByPk¦ for id lookups; ¦raw: true¦ for read-only speed.
- **Never sync() in production.**

#### Common mistakes
- Fetching all columns and rows when you need a few.
- Forgetting ¦await¦.
- Using ¦sync({ force: true })¦ on a real database.

#### Interview angle
"Why use an ORM?" Say: "It speeds development, gives validation, associations and parameterised queries by default, but I still read the generated SQL and use raw queries for complex reports." Follow-up: *what are ORM downsides?* N+1 queries, hidden joins, less control.

## Phase 2 · Performance and correctness (Intermediate)
### Indexes: B-tree, composite, covering
#### In one line
An index is a sorted lookup structure that lets MySQL find rows without scanning the whole table. InnoDB stores the table itself ordered by the primary key.

#### Real-life analogy
The index at the back of a textbook: instead of reading every page to find "closures", you look it up alphabetically and jump to the page.

#### How it works
- **B-tree** (default): sorted tree; good for equality, ranges, ORDER BY and prefix LIKE.
- **Clustered index**: in InnoDB the PK *is* the table; rows are stored in PK order. Secondary indexes store the PK value, so a lookup is: secondary index → PK → row ("double lookup").
- **Composite index** ¦(a, b, c)¦ follows the **leftmost-prefix rule**: usable for ¦a¦, ¦a,b¦, ¦a,b,c¦, not for ¦b¦ alone. Put equality columns first, then range column.
- **Covering index**: contains every column the query needs, so no table lookup (EXPLAIN shows ¦Using index¦).
- **Cost**: every index slows writes and uses space, so index for real queries only.
- Short PKs (BIGINT) keep all secondary indexes small.

#### Example
¦¦¦sql
-- Query: latest active enrolments of a user
SELECT course_id, enrolled_at FROM enrolments
WHERE user_id = 42 AND status = 'active' ORDER BY enrolled_at DESC LIMIT 20;

-- Equality columns first, then the sort column; also covers the SELECT
CREATE INDEX idx_enr_user_status_date ON enrolments (user_id, status, enrolled_at, course_id);
¦¦¦

#### Remember it
- **E-S-R**: Equality, Sort, Range column order.
- Leftmost prefix or nothing.
- Selective columns (many distinct values) index well; booleans alone rarely do.
- More indexes = slower writes.

#### Common mistakes
- Separate single-column indexes instead of one composite.
- Indexing low-cardinality columns alone.
- Never removing unused indexes.

#### Interview angle
"How does InnoDB store data?" Say: "The table is a clustered B-tree ordered by the primary key; secondary indexes hold the PK, so a lookup goes secondary index then clustered index." Follow-up: *why a small PK matters.* Every secondary index entry carries it.

### EXPLAIN and EXPLAIN ANALYZE
#### In one line
EXPLAIN shows the plan MySQL will use for a query; EXPLAIN ANALYZE actually runs it and reports real timings and row counts.

#### Real-life analogy
A GPS route preview (EXPLAIN) versus the trip log after you drove (EXPLAIN ANALYZE).

#### How it works
Read these columns first:
- **type**: access method, best to worst: ¦const > eq_ref > ref > range > index > ALL¦. ¦ALL¦ = full table scan.
- **key**: the index used. **possible_keys**: candidates.
- **rows**: estimated rows examined. **filtered**: percent kept.
- **Extra**: ¦Using index¦ (covering, good), ¦Using filesort¦ (extra sort), ¦Using temporary¦ (temp table), ¦Using where¦.
- ¦EXPLAIN ANALYZE¦ (MySQL 8.0.18+) shows actual time and loops per step, so you can spot where estimates were wrong.
- ¦EXPLAIN FORMAT=TREE¦ prints a readable tree.

#### Example
¦¦¦sql
EXPLAIN SELECT * FROM enrolments WHERE user_id = 42;
-- type=ALL, key=NULL, rows=2,000,000   -> full scan, bad

CREATE INDEX idx_enr_user ON enrolments (user_id);

EXPLAIN ANALYZE SELECT * FROM enrolments WHERE user_id = 42;
-- type=ref, key=idx_enr_user, rows=18, actual time=0.05..0.08  -> good
¦¦¦

#### Remember it
Checklist: **type → key → rows → Extra.**
- ALL + big rows = missing index.
- filesort / temporary = look at ORDER BY and GROUP BY indexes.
- Always compare before and after.

#### Common mistakes
- Trusting the estimated rows without ANALYZE.
- Testing on a tiny dev table (optimiser behaves differently).
- Adding an index without re-running EXPLAIN.

#### Interview angle
"How do you tune a slow query?" Say: "I run EXPLAIN, check type, key, rows and Extra, add or reshape an index, rewrite the query if needed, and re-measure with EXPLAIN ANALYZE." Follow-up: *what does Using filesort mean?* An extra sorting pass, not necessarily on disk.

### Writing index-friendly queries
#### In one line
A query can use an index only if the condition is written so MySQL can search the sorted index directly. Wrapping the column in a function usually breaks that.

#### Real-life analogy
A dictionary sorted by word: you can find "apple" fast, but you cannot quickly find "all words whose 3rd letter is p".

#### How it works
Index-friendly (**sargable**) patterns:
- Compare the bare column: ¦created_at >= '2026-01-01'¦, not ¦YEAR(created_at) = 2026¦.
- Prefix match ¦LIKE 'abc%'¦ works; ¦LIKE '%abc'¦ does not.
- Match types: comparing a string column to a number forces conversion and skips the index.
- Avoid ¦OR¦ across different columns (use UNION or index merge).
- Do not select columns you do not need (enables covering).
- Mismatched collations or charsets in joins also block index use.

#### Example
¦¦¦sql
-- Slow: function on indexed column
SELECT * FROM orders WHERE DATE(created_at) = '2026-03-01';
-- Fast: range on the bare column
SELECT * FROM orders
WHERE created_at >= '2026-03-01' AND created_at < '2026-03-02';

-- Slow: phone is VARCHAR, comparing with a number
SELECT * FROM users WHERE phone = 9876543210;
-- Fast
SELECT * FROM users WHERE phone = '9876543210';
¦¦¦

#### Remember it
- **Keep the column naked.** Move the math to the other side.
- Leading wildcard = full scan.
- Same type on both sides.

#### Common mistakes
- ¦WHERE LOWER(email) = ...¦ without a functional index (use case-insensitive collation instead).
- ¦SELECT *¦ with ORDER BY on large sets.
- Joining columns with different types or collations.

#### Interview angle
"Why is this query not using my index?" List: function on the column, type mismatch, leading wildcard, wrong column order, low selectivity. Follow-up: *MySQL 8 functional indexes* exist (¦CREATE INDEX ... ((LOWER(email)))¦) when needed.

### Transactions and ACID
#### In one line
A transaction groups statements into one all-or-nothing unit. ACID describes the guarantees: Atomicity, Consistency, Isolation, Durability.

#### Real-life analogy
Bank transfer: money leaves account A and arrives in account B. Either both happen or neither; you never want the money to vanish halfway.

#### How it works
- **Atomicity**: all succeed or all roll back (undo log).
- **Consistency**: constraints stay valid before and after.
- **Isolation**: concurrent transactions do not see each other's half-finished work (level decides how much).
- **Durability**: after COMMIT the data survives a crash (redo log / binlog).
- Use ¦START TRANSACTION; ... COMMIT; / ROLLBACK;¦ and ¦SAVEPOINT¦ for partial rollbacks.
- InnoDB supports transactions; MyISAM does not.
- Keep transactions **short**: no API calls or user waits inside, because locks are held until commit.

#### Example
¦¦¦sql
START TRANSACTION;
UPDATE wallets SET balance = balance - 500 WHERE user_id = 1 AND balance >= 500;
-- check ROW_COUNT() = 1, else ROLLBACK
UPDATE wallets SET balance = balance + 500 WHERE user_id = 2;
INSERT INTO ledger (from_user, to_user, amount) VALUES (1, 2, 500);
COMMIT;
¦¦¦

#### Remember it
**A-C-I-D = All-or-nothing, Correct, Isolated, Durable.**
- Short, focused transactions.
- Always handle errors with rollback.

#### Common mistakes
- Long transactions holding locks.
- Forgetting to roll back on error.
- Mixing non-transactional side effects (emails) inside.

#### Interview angle
"Explain ACID with an example." Use the transfer example. Follow-up: *where is durability implemented?* Redo log flushed on commit (¦innodb_flush_log_at_trx_commit¦).

### Isolation levels and anomalies
#### In one line
Isolation levels decide which changes by other transactions you can see. Higher isolation prevents more anomalies but allows less concurrency.

#### Real-life analogy
Editing a shared document: do you see colleagues' unsaved typing (dirty), or only saved versions, and does the page change under you while you read it?

#### How it works
Anomalies:
- **Dirty read**: reading uncommitted data.
- **Non-repeatable read**: same row read twice, value changed in between.
- **Phantom read**: same query twice, new rows appear.

| Level | Dirty | Non-repeatable | Phantom |
|---|---|---|---|
| READ UNCOMMITTED | possible | possible | possible |
| READ COMMITTED | no | possible | possible |
| REPEATABLE READ (InnoDB default) | no | no | mostly prevented (MVCC snapshot + gap locks) |
| SERIALIZABLE | no | no | no |

- InnoDB REPEATABLE READ reads from a snapshot taken at the first read.
- READ COMMITTED has fewer gap locks and is popular for high write concurrency.

#### Example
¦¦¦sql
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
START TRANSACTION;
SELECT balance FROM wallets WHERE user_id = 1;   -- 1000
-- another session commits balance = 900
SELECT balance FROM wallets WHERE user_id = 1;   -- 900 (non-repeatable read allowed)
COMMIT;
¦¦¦

#### Remember it
Order of strictness: **RU < RC < RR < SER**.
- InnoDB default = REPEATABLE READ.
- Dirty reads are almost never acceptable.

#### Common mistakes
- Assuming REPEATABLE READ makes updates safe from lost updates (use locks or atomic updates).
- Using SERIALIZABLE everywhere.
- Not knowing the default.

#### Interview angle
"What is the default level in MySQL and what does it prevent?" Say: "REPEATABLE READ; it prevents dirty and non-repeatable reads using MVCC snapshots, and mostly phantoms through next-key locks." Follow-up: *when pick READ COMMITTED?*

### Locks and deadlocks
#### In one line
Locks stop concurrent transactions from corrupting the same rows. A deadlock happens when two transactions wait on each other forever, so MySQL kills one.

#### Real-life analogy
Two cars meeting on a narrow bridge, each waiting for the other to reverse. Someone must back up.

#### How it works
- **Row locks**: shared (S) for reading, exclusive (X) for writing. ¦SELECT ... FOR UPDATE¦ takes X locks; ¦FOR SHARE¦ takes S locks.
- **Gap / next-key locks** lock ranges to prevent phantoms (in REPEATABLE READ).
- ¦SKIP LOCKED¦ and ¦NOWAIT¦ (MySQL 8) are useful for job queues.
- **Deadlock** example: T1 locks row A then wants B; T2 locks B then wants A. InnoDB detects it and rolls back one (error 1213).
- Prevent: access rows in a **consistent order**, keep transactions short, use indexes (so fewer rows are locked).
- Always **retry** on deadlock.

#### Example
¦¦¦sql
-- Job queue: each worker grabs different rows without blocking
START TRANSACTION;
SELECT id FROM jobs WHERE status = 'pending' ORDER BY id LIMIT 5 FOR UPDATE SKIP LOCKED;
UPDATE jobs SET status = 'running' WHERE id IN (/* ids above */);
COMMIT;
¦¦¦

#### Remember it
- **Same order, short time, good indexes.**
- Deadlock = retry, not crash.
- ¦SHOW ENGINE INNODB STATUS¦ shows the latest deadlock.

#### Common mistakes
- Updating without an index, which locks many rows.
- No retry logic for error 1213.
- Holding a transaction open during slow work.

#### Interview angle
"How do you handle deadlocks?" Say: "Make lock ordering consistent, shorten transactions, ensure indexes, and retry the transaction a few times with backoff." Follow-up: *how do you find the cause?* InnoDB status and the deadlock log.

### Joins at scale and the N+1 problem
#### In one line
N+1 means running one query for a list plus one extra query per row. It looks fine in development and becomes painfully slow with real data.

#### Real-life analogy
Going to the supermarket once per item on your shopping list instead of buying everything in one trip.

#### How it works
- Pattern: fetch 100 courses (1 query), then loop and fetch each course's lessons (100 queries) = 101 queries.
- **Fixes**: eager loading with a JOIN or ¦IN¦ query, batching (DataLoader), or caching.
- Joins at scale: join on indexed columns, filter early, select only needed columns, paginate.
- Joining many one-to-many tables multiplies rows (**row explosion**); fetch them in separate queries instead.
- Detect with query logs, APM tools or counting queries per request.

#### Example
¦¦¦js
// Bad: N+1
const courses = await Course.findAll();
for (const c of courses) c.lessons = await Lesson.findAll({ where: { courseId: c.id } });

// Good: 2 queries total (IN batching)
const ids = courses.map(c => c.id);
const lessons = await Lesson.findAll({ where: { courseId: ids } });   // WHERE course_id IN (...)
// or 1 query with include (see associations)
¦¦¦

#### Remember it
- **Loop + query = red flag.**
- Eager load or batch.
- Count queries per request in tests.

#### Common mistakes
- Eager loading everything with deep includes (huge joins).
- Not noticing N+1 because dev data is tiny.
- Lazy-loading associations in loops.

#### Interview angle
"What is N+1 and how did you fix it?" Use the courses and lessons example and mention include or batching, plus how you detected it. Follow-up: *when is include a bad idea?* When it multiplies rows across several hasMany branches.

### CTEs and window functions
#### In one line
A CTE (¦WITH¦) names a temporary result to make queries readable. Window functions compute values across related rows without collapsing them.

#### Real-life analogy
A CTE is a sticky note with an intermediate answer. A window function is like adding a "rank" column to a leaderboard while keeping every player visible.

#### How it works
- ¦WITH x AS (...) SELECT ... FROM x¦; ¦WITH RECURSIVE¦ walks hierarchies.
- Window syntax: ¦fn() OVER (PARTITION BY group ORDER BY col)¦.
- **ROW_NUMBER** unique sequence; **RANK** ties share a rank with gaps; **DENSE_RANK** no gaps.
- **LAG/LEAD** read the previous/next row; **SUM() OVER** gives running totals.
- Top-N per group: rank in a CTE, filter in the outer query (windows cannot be used in WHERE directly).
- Requires MySQL 8.0+.

#### Example
¦¦¦sql
-- Top 3 courses per category by enrolments
WITH ranked AS (
  SELECT c.category, c.title, COUNT(*) AS learners,
         ROW_NUMBER() OVER (PARTITION BY c.category ORDER BY COUNT(*) DESC) AS rn
  FROM courses c JOIN enrolments e ON e.course_id = c.id
  GROUP BY c.category, c.id, c.title
)
SELECT category, title, learners FROM ranked WHERE rn <= 3;

-- Running total of daily signups
SELECT d, signups, SUM(signups) OVER (ORDER BY d) AS running FROM daily_signups;
¦¦¦

#### Remember it
- **PARTITION BY = groups, ORDER BY = order inside the group.**
- Filter windows in an outer query.
- ROW_NUMBER unique, RANK has gaps, DENSE_RANK none.

#### Common mistakes
- Using a window function in WHERE.
- Forgetting ORDER BY inside OVER.
- Using ROW_NUMBER when ties should share ranks.

#### Interview angle
"Top N per group in SQL?" Say: "Use ROW_NUMBER over partition in a CTE and filter rn <= N." Follow-up: *difference between GROUP BY and window functions?* Windows keep all rows.

### Sequelize associations
#### In one line
Associations declare relationships between models (hasOne, hasMany, belongsTo, belongsToMany) so Sequelize can join tables for you with ¦include¦.

#### Real-life analogy
A family tree: each child belongs to a parent, a parent has many children, and cousins connect through shared relatives.

#### How it works
- **belongsTo**: FK lives on this model (Lesson belongsTo Course).
- **hasMany / hasOne**: FK lives on the other model.
- **belongsToMany**: many-to-many through a junction model (¦through: Enrolment¦).
- Declare both directions to query both ways.
- ¦include¦ generates a JOIN. Default is LEFT OUTER JOIN; ¦required: true¦ makes it INNER JOIN.
- ¦separate: true¦ on hasMany runs a second query instead of a big join, avoiding row explosion.
- Filter inside include with its own ¦where¦ (with ¦required¦ semantics).

#### Example
¦¦¦js
Course.hasMany(Lesson, { foreignKey: 'courseId', as: 'lessons' });
Lesson.belongsTo(Course, { foreignKey: 'courseId' });
User.belongsToMany(Course, { through: Enrolment, foreignKey: 'userId', otherKey: 'courseId' });

const rows = await Course.findAll({
  include: [{ model: Lesson, as: 'lessons', where: { published: true }, required: true, separate: false }],
  limit: 5,
});
// SQL: SELECT ... FROM courses INNER JOIN lessons ON ... WHERE lessons.published = 1
¦¦¦

#### Remember it
- **belongsTo = I hold the FK; hasMany = they hold it.**
- required: true = INNER JOIN.
- hasMany + limit => use ¦separate: true¦.

#### Common mistakes
- Declaring only one side of the relation.
- ¦limit¦ with hasMany includes producing subquery surprises.
- Deep includes pulling large result sets.

#### Interview angle
"How does include work?" Say: "It builds a JOIN from the association; LEFT by default, INNER with required, and I use separate for large hasMany to avoid duplicated rows." Follow-up: *how to prevent N+1?* Use include or batched queries.

### Sequelize advanced querying
#### In one line
Scopes, hooks, paranoid mode, validations and safe raw queries let you add reusable rules and still keep full SQL control without risking injection.

#### Real-life analogy
Scopes are saved filters in your email; hooks are automatic actions ("when mail arrives, label it"); paranoid delete is moving mail to the bin instead of shredding it.

#### How it works
- **Scopes**: named reusable query fragments (¦Course.scope('published').findAll()¦).
- **Hooks**: ¦beforeCreate, afterUpdate¦ etc. Bulk operations skip individual hooks unless ¦individualHooks: true¦.
- **Paranoid**: ¦paranoid: true¦ adds ¦deletedAt¦; ¦destroy¦ sets it and queries ignore deleted rows.
- **Validations**: ¦isEmail, len, notNull¦ run in JS before the query; DB constraints remain essential.
- **Raw queries**: ¦sequelize.query(sql, { replacements | bind })¦. Use ¦bind¦ (¦$1¦) or ¦replacements¦ (¦:name¦), never string concatenation.
- ¦sequelize.literal()¦ injects raw SQL and is dangerous with user input.

#### Example
¦¦¦js
const [rows] = await sequelize.query(
  'SELECT id, title FROM courses WHERE level = :level AND price < :max',
  { replacements: { level: req.query.level, max: 1000 }, type: QueryTypes.SELECT }
);

// UNSAFE - never do this
// sequelize.query("SELECT * FROM users WHERE email = '" + email + "'");

Course.addScope('published', { where: { status: 'published' } });
const list = await Course.scope('published').findAll();
¦¦¦

#### Remember it
- **Bind or replace, never concatenate.**
- literal() = trusted strings only.
- Bulk ops skip hooks by default.

#### Common mistakes
- Building ORDER BY from user input without a whitelist.
- Assuming validations replace DB constraints.
- Forgetting paranoid rows exist when checking unique values.

#### Interview angle
"How do you prevent SQL injection with Sequelize?" Say: "Use model methods and parameterised raw queries with replacements or bind, and whitelist anything dynamic like column names." Follow-up: *what does paranoid do on a unique column?*

### Sequelize transactions
#### In one line
Sequelize can wrap queries in a database transaction. Every query inside must be given that transaction, otherwise it runs outside it.

#### Real-life analogy
A shopping basket at checkout: items only become yours when you pay (commit); otherwise everything is put back (rollback).

#### How it works
- **Managed**: ¦sequelize.transaction(async t => { ... })¦. Commits if the callback resolves, rolls back if it throws. Preferred.
- **Unmanaged**: ¦const t = await sequelize.transaction(); ... t.commit()/t.rollback()¦; you handle errors.
- Pass ¦{ transaction: t }¦ to **every** query, create, update, destroy, and ¦lock: t.LOCK.UPDATE¦ for FOR UPDATE.
- Optional CLS (continuation-local storage) can pass it automatically, but explicit is clearer.
- Use ¦isolationLevel¦ option when needed. Retry on deadlock.
- ¦afterCommit¦ hooks are the place for emails or events.

#### Example
¦¦¦js
await sequelize.transaction(async (t) => {
  const wallet = await Wallet.findOne({ where: { userId: 1 }, lock: t.LOCK.UPDATE, transaction: t });
  if (wallet.balance < 500) throw new Error('Insufficient funds');   // rolls back
  await wallet.decrement('balance', { by: 500, transaction: t });
  await Ledger.create({ userId: 1, amount: -500 }, { transaction: t });
});
¦¦¦

#### Remember it
- **Pass t everywhere.**
- Managed transaction = auto commit/rollback.
- Side effects after commit.

#### Common mistakes
- Forgetting ¦transaction: t¦ on one query, creating a partial commit bug.
- Calling external APIs inside the transaction.
- Never rolling back an unmanaged transaction on error.

#### Interview angle
"Managed vs unmanaged?" Say: "Managed handles commit and rollback automatically from the callback result; unmanaged gives manual control. I use managed." Follow-up: *what happens if a query misses the transaction option?* It uses another connection and ignores the rollback.

### Migrations and seeders
#### In one line
Migrations are versioned scripts that change the database schema step by step (up and down). Seeders insert starter data.

#### Real-life analogy
Git for your database structure: each change is a commit that can be applied or reverted in the same order on every machine.

#### How it works
- Tools: ¦sequelize-cli¦ or ¦umzug¦. Applied migrations are recorded in a table (¦SequelizeMeta¦).
- Each migration has ¦up¦ (apply) and ¦down¦ (revert).
- Workflow: create migration → review in PR → run in CI/CD before deploying the app code.
- **Never** use ¦sync({ alter/force })¦ in production: it can drop data.
- Never edit an already-applied migration; add a new one.
- Keep changes backward compatible (expand/contract) so old and new code both work during deploy.

#### Example
¦¦¦js
// migrations/20260301-add-phone-to-users.js
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'phone', { type: Sequelize.STRING(20), allowNull: true });
    await queryInterface.addIndex('users', ['phone'], { name: 'idx_users_phone' });
  },
  async down(queryInterface) {
    await queryInterface.removeIndex('users', 'idx_users_phone');
    await queryInterface.removeColumn('users', 'phone');
  },
};
¦¦¦

#### Remember it
- **Schema = code. Review it, version it, never hand-edit prod.**
- Forward-only in practice; ¦down¦ for dev.
- New nullable column first, constraint later.

#### Common mistakes
- Editing old migrations.
- Using sync() on a live database.
- Non-reversible data migrations without backups.

#### Interview angle
"How do you deploy schema changes?" Say: "Migrations run in the pipeline before the new code, written to be backward compatible, with a backup and a rollback plan." Follow-up: *what about huge tables?* Use online DDL or gh-ost.

### Pagination, upsert and bulk operations
#### In one line
Pagination returns data in chunks, upsert inserts or updates in one step, and bulk operations handle many rows in a single query.

#### Real-life analogy
Reading a book with a bookmark (keyset) versus counting pages from the front cover every time (offset).

#### How it works
- **OFFSET** pagination: simple but slow on deep pages (reads and discards rows) and unstable when data changes.
- **Keyset (cursor)** pagination: ¦WHERE (created_at, id) < (?, ?) ORDER BY created_at DESC, id DESC LIMIT 20¦; fast with an index and stable.
- **Upsert** in MySQL: ¦INSERT ... ON DUPLICATE KEY UPDATE¦ (needs a unique key). Sequelize: ¦Model.upsert()¦.
- **Bulk**: ¦bulkCreate(rows, { updateOnDuplicate: ['title'] })¦, chunked at 500–1000 rows.
- ¦bulkCreate¦ skips validations/hooks unless asked.

#### Example
¦¦¦js
// Keyset pagination
const page = await Course.findAll({
  where: sequelize.literal('(created_at, id) < (:ts, :id)'),   // values bound via replacements
  replacements: { ts: lastTs, id: lastId },
  order: [['createdAt', 'DESC'], ['id', 'DESC']], limit: 20,
});

await Enrolment.bulkCreate(rows, { updateOnDuplicate: ['status', 'updatedAt'] });
¦¦¦

#### Remember it
- **Deep pages -> keyset.**
- Upsert needs a unique key.
- Bulk in chunks.

#### Common mistakes
- OFFSET 100000.
- Keyset order without a unique tie-breaker (id).
- Giant single bulk inserts hitting packet limits.

#### Interview angle
"Offset vs keyset?" Say: "Offset gets slower as the page grows and can skip or repeat rows; keyset uses the last seen values and an index so it stays fast." Follow-up: *how do you jump to page 50?* You cannot easily; offer search or filters.

### Connection pooling
#### In one line
A pool keeps a set of open database connections ready for reuse, because opening a connection for every request is slow and databases limit connections.

#### Real-life analogy
A taxi stand: a fixed number of cabs wait for passengers. When all are busy, new passengers queue; too long a queue means a timeout.

#### How it works
- Sequelize pool options: ¦max¦ (upper limit), ¦min¦, ¦acquire¦ (ms to wait for a connection before error), ¦idle¦ (ms before releasing).
- Total connections = app instances × ¦max¦; it must stay below MySQL ¦max_connections¦.
- **Pool exhaustion** symptoms: ¦SequelizeConnectionAcquireTimeoutError¦, rising latency, requests hanging. Causes: slow queries, leaked transactions never committed, too small pool.
- Fixes: shorten queries and transactions, always commit/rollback, size the pool sensibly, add a proxy (RDS Proxy) for many instances or serverless.

#### Example
¦¦¦js
const sequelize = new Sequelize(db, user, pass, {
  host, dialect: 'mysql',
  pool: { max: 10, min: 2, acquire: 30000, idle: 10000 },
});
// 6 app instances x max 10 = 60 connections; keep max_connections > 60 + headroom
¦¦¦

#### Remember it
- **Pool size × instances < max_connections.**
- Exhaustion usually means slow queries or leaks, not "need more connections".
- Always release: commit or rollback.

#### Common mistakes
- Setting max huge to hide slow queries.
- Not closing transactions on error paths.
- Creating a new Sequelize instance per request.

#### Interview angle
"The API hangs under load with acquire timeouts; what do you check?" Say: "Slow queries and long transactions holding connections, leaked transactions, pool size versus DB limits, then use metrics and the processlist." Follow-up: *how to scale connections across many instances?* A proxy or pooler.

## Phase 3 · Scale and reliability (Lead level)
### Query tuning workflow
#### In one line
A repeatable loop: find the slow query, understand its plan, fix it, and prove the fix with numbers. Guessing and adding random indexes is not tuning.

#### Real-life analogy
A doctor's process: symptoms (slow log), diagnosis (EXPLAIN), treatment (index or rewrite), follow-up test (measure again).

#### How it works
1. **Find**: enable the slow query log (¦long_query_time=0.5¦) or use ¦performance_schema¦ / ¦sys.statement_analysis¦ and APM to rank by **total time**, not just the slowest single run.
2. **Reproduce** with real parameters and production-like data volume.
3. **EXPLAIN / EXPLAIN ANALYZE**: look for full scans, filesort, temporary tables, large row estimates.
4. **Fix** in this order: rewrite the query (sargable, fewer columns, avoid N+1) → add or change an index → change the schema or cache.
5. **Verify** with before/after timing and rows examined; check that writes did not slow down.
6. **Monitor** after release and document it.

#### Example
¦¦¦sql
-- Top time consumers
SELECT digest_text, count_star, ROUND(sum_timer_wait/1e12,2) AS total_s,
       ROUND(avg_timer_wait/1e9,1) AS avg_ms, sum_rows_examined
FROM performance_schema.events_statements_summary_by_digest
ORDER BY sum_timer_wait DESC LIMIT 5;
-- Then: EXPLAIN ANALYZE <the query>; add index; re-run; compare rows examined
¦¦¦

#### Remember it
**Measure → Explain → Change one thing → Measure again.**
- Rank by total time.
- Rewrite before you index.
- Change one variable at a time.

#### Common mistakes
- Optimising a query that runs once a day.
- Adding indexes without checking write cost.
- Testing with a tiny dataset.

#### Interview angle
"Describe a performance win." Say: "Slow log showed an enrolments report scanning 2M rows; EXPLAIN showed type ALL with a filesort. A composite index on user, status and date plus selecting fewer columns cut it from 2.4s to 40ms." Use your real numbers. Follow-up: *how did you prove it?*

### Concurrency control: optimistic vs pessimistic locking
#### In one line
Concurrency control prevents two users or processes from overwriting each other or double-spending. Pessimistic locks first; optimistic detects conflicts at write time.

#### Real-life analogy
Pessimistic: reserving a meeting room by locking the door. Optimistic: editing a shared document and getting a warning at save time that someone changed it.

#### How it works
- **Pessimistic**: ¦SELECT ... FOR UPDATE¦ inside a transaction. Safe for high-contention items (wallet balance, seat booking) but blocks others.
- **Optimistic**: a ¦version¦ column; ¦UPDATE ... WHERE id=? AND version=?¦; if 0 rows changed, someone else won, so retry. Sequelize: ¦version: true¦ on the model throws ¦OptimisticLockError¦.
- **Atomic updates**: ¦SET stock = stock - 1 WHERE stock > 0¦ avoids read-modify-write races.
- **Unique constraints** protect against duplicates (one enrolment per user and course).
- **Idempotency keys**: store a unique request key so retries do not create double payments.

#### Example
¦¦¦sql
-- Prevent overselling seats atomically
UPDATE batches SET seats_left = seats_left - 1 WHERE id = 7 AND seats_left > 0;
-- ROW_COUNT() = 0 -> sold out

-- Idempotent payment: second insert with the same key fails
CREATE UNIQUE INDEX uq_pay_idem ON payments (idempotency_key);
¦¦¦

#### Remember it
| Style | Best when | Cost |
|---|---|---|
| Pessimistic | conflicts common | blocking |
| Optimistic | conflicts rare | retries |

Rule: **let the database enforce it** (unique key, atomic update).

#### Common mistakes
- Read-then-write without a lock.
- Relying on app-level checks only.
- No retry after optimistic conflicts.

#### Interview angle
"How do you prevent double booking or double payment?" Say: "Atomic conditional updates or FOR UPDATE inside a transaction, a unique constraint on the business key, and an idempotency key for retries." Follow-up: *optimistic vs pessimistic trade-off?*

### InnoDB internals: MVCC, logs, buffer pool
#### In one line
InnoDB keeps old row versions (MVCC) so readers do not block writers, and uses logs and an in-memory cache to be fast and crash-safe.

#### Real-life analogy
A library keeps the old edition on the shelf while a new edition is being printed, so readers still get a consistent book until the swap is done.

#### How it works
- **MVCC**: each row has hidden transaction ids. A consistent read uses a **read view** to pick the version visible to it from the **undo log**. So plain SELECTs take no locks.
- **Undo log**: previous versions; used for rollback and MVCC.
- **Redo log**: write-ahead log for durability and crash recovery; changes are written here before data pages.
- **Buffer pool**: memory cache of data and index pages (set to ~50-75% of RAM on a dedicated server).
- **Binlog** (server level): used for replication and point-in-time recovery.
- **Gap/next-key locks** apply in REPEATABLE READ for locking reads and writes.
- Long transactions keep old versions alive and bloat undo.

#### Example
¦¦¦sql
-- Session A
START TRANSACTION; SELECT balance FROM wallets WHERE id = 1;  -- 1000 (snapshot)
-- Session B
UPDATE wallets SET balance = 900 WHERE id = 1; COMMIT;
-- Session A (REPEATABLE READ) still sees 1000, no blocking
SELECT balance FROM wallets WHERE id = 1;                      -- 1000
¦¦¦

#### Remember it
- **Readers don't block writers (MVCC).**
- Undo = go back, Redo = go forward after crash.
- Buffer pool = RAM cache.
- Long transactions hurt.

#### Common mistakes
- Leaving sessions open in a transaction.
- Confusing binlog with redo log.
- Small buffer pool on a big dataset.

#### Interview angle
"Why don't reads block writes in InnoDB?" Say: "Because of MVCC: a read uses a snapshot built from undo log versions, so it needs no row locks." Follow-up: *difference between undo and redo log?*

### Replication and high availability
#### In one line
Replication copies changes from a primary to replicas for read scaling and failover. HA setups automatically promote a replica when the primary fails.

#### Real-life analogy
A head office (primary) that sends every decision to branch offices (replicas). Branch offices can answer customer questions, but their copy may be a few minutes behind.

#### How it works
- The primary writes changes to the **binlog**; replicas fetch and replay them (async by default; semi-sync waits for one replica ack).
- **Read/write splitting**: writes to primary, read-only queries to replicas.
- **Replica lag**: replica is behind. Problem: **read-your-writes** (user saves, then reads from a stale replica). Fixes: read from primary right after a write, session stickiness, or check GTID position.
- **Failover**: RDS **Multi-AZ** keeps a synchronous standby (not for reads) and fails over in ~1-2 minutes. **Aurora** shares storage, replicas are fast (usually under 100 ms lag) and promote quickly.
- Use GTIDs, monitor ¦Seconds_Behind_Source¦, and test failover.

#### Example
¦¦¦js
// Two Sequelize connections
const sequelize = new Sequelize(db, user, pass, {
  dialect: 'mysql',
  replication: {
    write: { host: 'primary.db.internal' },
    read:  [{ host: 'replica-1.db.internal' }, { host: 'replica-2.db.internal' }],
  },
});
// SELECTs go to replicas; INSERT/UPDATE/DELETE and transactions go to primary.
¦¦¦

#### Remember it
- **Replica = scale reads. Multi-AZ = survive failure.**
- Async means lag.
- After a write, read from primary.

#### Common mistakes
- Treating a Multi-AZ standby as a read replica.
- Ignoring lag in business logic.
- Never testing failover.

#### Interview angle
"How do you handle replica lag?" Say: "Route critical reads after writes to the primary, monitor lag, and keep replicas for reports and tolerant reads." Follow-up: *Multi-AZ vs read replica?*

### Backups and recovery
#### In one line
Backups let you restore after mistakes or disasters. Point-in-time recovery replays the binlog on top of a backup to restore to an exact moment.

#### Real-life analogy
A photo of your desk (backup) plus a diary of every change since (binlog). You can rebuild the desk as it was at 2:14 pm.

#### How it works
- **Logical** backups (¦mysqldump¦, mysqlpump): SQL text, portable, slow to restore on big data.
- **Physical** backups (Percona XtraBackup, RDS snapshots): copy files, fast to restore.
- **PITR**: restore full backup, then replay binlogs up to a timestamp (¦mysqlbinlog --stop-datetime¦). RDS automated backups provide this.
- **RPO** (how much data you can lose) and **RTO** (how long recovery may take) drive the design.
- Follow the **3-2-1** rule; encrypt backups; store copies in another region.
- A backup you never restored is not a backup: run **restore drills**.

#### Example
¦¦¦bash
# Logical backup with consistent snapshot, no locks on InnoDB
mysqldump --single-transaction --routines --triggers lms > lms_2026-03-01.sql

# Point-in-time: replay binlogs until just before the bad DELETE
mysqlbinlog --stop-datetime="2026-03-01 14:13:59" binlog.000042 | mysql lms_restore
¦¦¦

#### Remember it
- **RPO = data loss, RTO = downtime.**
- Snapshot + binlog = PITR.
- Test restores regularly.

#### Common mistakes
- Backups only on the same server.
- No restore tests.
- Not retaining binlogs long enough.

#### Interview angle
"Someone ran DELETE without WHERE; what do you do?" Say: "Stop writes if needed, restore the latest backup to a new instance, replay binlogs to just before the mistake, then copy back the missing rows." Follow-up: *define RPO and RTO.*

### Zero-downtime schema changes
#### In one line
Change a live table without blocking users by splitting the change into small backward-compatible steps (expand and contract) and using online DDL tools.

#### Real-life analogy
Renovating a shop while it stays open: build the new shelf next to the old one, move stock gradually, then remove the old shelf.

#### How it works
- **Expand/contract**: (1) add the new nullable column, (2) deploy code that writes both, (3) **backfill** old rows in small batches, (4) switch reads to the new column, (5) stop writing the old one, (6) drop it later.
- MySQL 8 **online DDL**: ¦ALGORITHM=INSTANT¦ (add column at end, metadata only), ¦INPLACE¦ (no copy, e.g. add index) with ¦LOCK=NONE¦. State the algorithm explicitly so the statement fails instead of locking.
- Tools: **gh-ost** or **pt-online-schema-change** copy the table in the background and swap.
- Watch replica lag and metadata locks (a long transaction can block ALTER and then everything queues behind it).

#### Example
¦¦¦sql
-- Step 1: instant, safe
ALTER TABLE enrolments ADD COLUMN completed_at DATETIME NULL, ALGORITHM=INSTANT;

-- Step 3: backfill in batches (repeat until 0 rows)
UPDATE enrolments SET completed_at = updated_at
WHERE status = 'completed' AND completed_at IS NULL LIMIT 5000;

-- Add index online
ALTER TABLE enrolments ADD INDEX idx_completed (completed_at), ALGORITHM=INPLACE, LOCK=NONE;
¦¦¦

#### Remember it
**Expand → Migrate → Contract.**
- Specify ALGORITHM and LOCK.
- Small batches with pauses.
- Never rename/drop in the same deploy as the code change.

#### Common mistakes
- Plain ALTER on a 100M-row table at peak.
- Ignoring long-running transactions that hold metadata locks.
- Dropping a column the old app version still uses.

#### Interview angle
"How do you add a column to a huge table?" Say: "Use INSTANT or online DDL if supported, otherwise gh-ost, deploy in expand-and-contract steps, backfill in batches and monitor lag." Follow-up: *what is a metadata lock problem?*

### Partitioning, archiving and sharding
#### In one line
These are ways to handle very large data: split a table inside one server (partitioning), move old data away (archiving), or spread data over servers (sharding).

#### Real-life analogy
A giant filing cabinet: partitioning is labelled drawers by year, archiving is moving old years to storage, sharding is buying more cabinets in different rooms.

#### How it works
- **Partitioning**: RANGE/LIST/HASH on a column (e.g. by month). Helps drop old data instantly (¦ALTER TABLE ... DROP PARTITION¦) and prune scans. The partition key must be part of every unique key (including the PK).
- **Archiving**: move rows older than N months to an archive table or cold storage; keep the hot table small.
- **Sharding**: split by tenant or user id across databases. It adds complexity: cross-shard joins, transactions, resharding.
- **Do not shard early**: first optimise queries and indexes, add caching and replicas, scale up the instance, then partition/archive. Shard last.

#### Example
¦¦¦sql
CREATE TABLE activity_log (
  id BIGINT NOT NULL, user_id BIGINT NOT NULL, created_at DATE NOT NULL,
  PRIMARY KEY (id, created_at)                      -- partition key inside PK
) PARTITION BY RANGE (YEAR(created_at)) (
  PARTITION p2025 VALUES LESS THAN (2026),
  PARTITION p2026 VALUES LESS THAN (2027),
  PARTITION pmax  VALUES LESS THAN MAXVALUE
);
ALTER TABLE activity_log DROP PARTITION p2025;       -- instant purge of a year
¦¦¦

#### Remember it
**Index → Cache → Replicas → Scale up → Partition/Archive → Shard (last).**
- Partition for retention, not magic speed.
- Sharding = application-level complexity.

#### Common mistakes
- Partitioning without queries filtering on the partition key.
- Sharding a 50 GB database.
- No archive policy for logs.

#### Interview angle
"When would you shard?" Say: "Only when a single primary can't handle write volume or data size even after tuning, caching and scaling up; then I'd pick a stable shard key such as tenant id." Follow-up: *downsides of sharding?*

### Data modelling patterns
#### In one line
Reusable designs for common needs: soft delete, audit trail, multi-tenancy, JSON columns and progress tracking.

#### Real-life analogy
Standard floor plans: the same layout ideas (kitchen, exit, storage) reused for many houses.

#### How it works
- **Soft delete**: ¦deleted_at¦ column (Sequelize paranoid). Keep unique keys aware of it; archive eventually.
- **Audit trail**: append-only history table (who, what, old/new values, when), often written via hooks or triggers.
- **Multi-tenant**: shared tables with ¦tenant_id¦ on every table and in every index/query (cheapest); schema or database per tenant (stronger isolation, harder ops).
- **JSON column**: for flexible attributes; index via generated columns; do not hide core relational data there.
- **Progress/event tracking**: store events (¦lesson_completed¦ rows) and a summary on enrolments (percent, last_activity), updated in the same transaction. Certificates reference the enrolment and are unique per (user, course).

#### Example
¦¦¦sql
CREATE TABLE lesson_progress (
  enrolment_id BIGINT NOT NULL, lesson_id BIGINT NOT NULL,
  completed_at DATETIME NOT NULL,
  PRIMARY KEY (enrolment_id, lesson_id),          -- idempotent: cannot complete twice
  FOREIGN KEY (enrolment_id) REFERENCES enrolments(id)
);
CREATE TABLE certificates (
  id BIGINT AUTO_INCREMENT PRIMARY KEY, enrolment_id BIGINT NOT NULL UNIQUE,
  issued_at DATETIME NOT NULL, FOREIGN KEY (enrolment_id) REFERENCES enrolments(id)
);
¦¦¦

#### Remember it
- **Soft delete = deleted_at. Audit = append-only. Tenant = tenant_id everywhere.**
- JSON for the flexible edge only.
- Make progress writes idempotent via composite PK.

#### Common mistakes
- Forgetting tenant_id in a query (data leak).
- Soft-deleted rows breaking UNIQUE constraints.
- Putting everything in a JSON blob.

#### Interview angle
"Model course progress and certificates." Use the tables above: composite PK for idempotent completion, summary percent on enrolment, unique certificate per enrolment. Follow-up: *how do you ensure tenant isolation?*

### MySQL vs PostgreSQL
#### In one line
Both are strong relational databases. MySQL is simple and widely hosted; PostgreSQL has richer features and stricter standards compliance.

#### Real-life analogy
A reliable family hatchback (MySQL) versus a feature-rich estate car with more gadgets (PostgreSQL); either gets you to work, the choice depends on the journey.

#### How it works
| Topic | MySQL (InnoDB) | PostgreSQL |
|---|---|---|
| MVCC | undo log, old versions in undo | old row versions in the table, cleaned by **VACUUM** |
| JSON | JSON (binary) | **JSONB** with GIN indexes, very strong |
| Indexes | B-tree, full-text, functional | B-tree, GIN, GiST, BRIN, **partial** and expression indexes |
| Extensions | limited | many (PostGIS, pg_trgm) |
| Window/CTE | full since 8.0 | mature for years |
| Replication | binlog based, async/semi-sync | WAL streaming, logical replication |
| DDL | mostly auto-commit | **transactional DDL** |
- Pick by team skills, ecosystem, hosting (RDS/Aurora support both) and needs such as geo data or heavy JSON analytics.

#### Example
¦¦¦sql
-- PostgreSQL: partial index only for active rows
CREATE INDEX idx_active ON enrolments (user_id) WHERE status = 'active';
-- MySQL alternative: composite index (status, user_id) or generated column
¦¦¦

#### Remember it
- **PG = features and strictness; MySQL = simplicity and ubiquity.**
- PG: VACUUM, JSONB, partial indexes, transactional DDL.
- Both fine for most web apps.

#### Common mistakes
- Choosing by hype.
- Assuming SQL syntax is identical (LIMIT, upsert, quoting differ).
- Ignoring operational skills of the team.

#### Interview angle
"Why MySQL for the project?" Say: "Team expertise, mature tooling and managed hosting; our workload is transactional with relational data, and MySQL 8 covers CTEs and windows. I'd consider PostgreSQL for heavy JSON, geospatial or complex indexing needs." Follow-up: *what is VACUUM?*

### Security and compliance
#### In one line
Protect data by giving minimum access, never concatenating SQL, encrypting data and keeping an audit trail, which is critical for healthcare and personal data.

#### Real-life analogy
A hospital records room: only authorised staff get keys to the rooms they need, every visit is logged, and files are in locked cabinets.

#### How it works
- **Least privilege**: the app user gets only SELECT/INSERT/UPDATE/DELETE on its schema; migrations use a separate, stronger account; no root in apps.
- **Parameterised queries** everywhere (ORM or bind variables).
- **Encryption in transit** (TLS, ¦require_secure_transport¦) and **at rest** (RDS KMS). Sensitive fields can be encrypted at the application level.
- **Secrets** in AWS Secrets Manager, rotated; never in git.
- **PII/PHI**: mask in logs and non-production data, restrict exports, retention rules, GDPR/HIPAA awareness.
- **Audit logs** for access and changes; network isolation (private subnets, security groups).

#### Example
¦¦¦sql
CREATE USER 'lms_app'@'10.0.%' IDENTIFIED BY '********' REQUIRE SSL;
GRANT SELECT, INSERT, UPDATE, DELETE ON lms.* TO 'lms_app'@'10.0.%';
-- no DROP, ALTER, GRANT; migrations use 'lms_migrator'
¦¦¦

#### Remember it
**LEAST: Least privilege, Encrypt, Audit, Secrets, Tokenised/parameterised queries.**
- App user cannot ALTER.
- Mask PII outside production.

#### Common mistakes
- Using the root account in the app.
- Logging full request bodies with personal data.
- Copying production data to dev unmasked.

#### Interview angle
"How do you secure database access in a healthcare product?" Say: "Private network, TLS, least-privilege accounts, secrets in a manager with rotation, parameterised queries, encryption at rest, masked non-prod data and audit logs." Follow-up: *how do you handle a leaked credential?*

### Caching and read models
#### In one line
Keep expensive or frequently read results somewhere cheaper than the main database (Redis, summary tables, replicas) so the primary stays fast.

#### Real-life analogy
A shop keeps popular items by the counter (cache) instead of walking to the warehouse (database) for every sale.

#### How it works
- **Cache-aside** with Redis: check the cache, on a miss query the DB and store with a TTL; on updates delete the key.
- **Invalidation** is the hard part: TTLs, event-based deletes, versioned keys. Beware cache stampede (use locks or jittered TTL).
- **Read models / summary tables**: pre-computed aggregates (daily course stats) refreshed by jobs or events; **materialised** views are emulated in MySQL with tables.
- **Reporting replica**: run heavy reports on a replica or a warehouse, never on the primary.
- Cache data that is read often and changes rarely; do not cache per-user sensitive data without scoping the key.

#### Example
¦¦¦js
async function getCourse(id) {
  const key = 'course:' + id;
  const hit = await redis.get(key);
  if (hit) return JSON.parse(hit);
  const course = await Course.findByPk(id, { raw: true });      // miss -> DB
  if (course) await redis.set(key, JSON.stringify(course), 'EX', 300);   // 5 min TTL
  return course;
}
// on update: await redis.del('course:' + id);
¦¦¦

#### Remember it
- **Cache-aside: read cache, miss -> DB -> set with TTL; write -> delete key.**
- Reports go to replicas.
- Two hard things: naming and invalidation.

#### Common mistakes
- No TTL, stale data forever.
- Caching user-specific data under a shared key.
- Running big reports on the primary.

#### Interview angle
"How do you speed up a heavy dashboard?" Say: "Pre-compute summaries in a read model refreshed by jobs, serve hot data from Redis with sensible TTLs, and run heavy queries on a replica." Follow-up: *how do you invalidate the cache?*

`;
