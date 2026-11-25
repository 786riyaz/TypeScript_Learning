# Phase 50: Advanced TypeScript – Database Architecture, Advanced SQL, Query Optimization, Indexing, Caching, Redis and Data Management

**Level:** Expert / Advanced Database Engineering  
**Prerequisites:** TypeScript, Node.js, Express.js, SQL, MySQL, PostgreSQL, Sequelize, Prisma, database transactions and relational database fundamentals.

---

# 1. Learning Objectives

In this phase, you will learn advanced database concepts and how to implement them in TypeScript backend applications.

By the end of this phase, you should understand:

1. Advanced Database Architecture.
2. Database Normalization.
3. Database Denormalization.
4. Advanced SQL Queries.
5. Advanced Joins.
6. Subqueries.
7. Common Table Expressions (CTEs).
8. Window Functions.
9. Stored Procedures.
10. Database Triggers.
11. Database Views.
12. Materialized Views.
13. Indexing Strategies.
14. Composite Indexes.
15. Unique Indexes.
16. Full-Text Search.
17. Query Execution Plans.
18. Query Optimization.
19. N+1 Query Optimization.
20. Database Locking.
21. Transaction Isolation Levels.
22. Optimistic Locking.
23. Pessimistic Locking.
24. Redis with TypeScript.
25. Redis Data Structures.
26. Caching Strategies.
27. Cache Invalidation.
28. Cache-Aside Pattern.
29. Rate Limiting with Redis.
30. Distributed Caching.
31. Database Backup and Recovery.
32. Database Monitoring.
33. Production Data Management.

---

# 2. Advanced Database Architecture

Before learning advanced SQL and optimization, understand how databases fit into a scalable backend architecture.

A basic application architecture:

```text
Client
  |
  v
Load Balancer
  |
  v
Express API
  |
  v
Service Layer
  |
  v
Repository Layer
  |
  +----------------+
  |                |
  v                v
Redis Cache     Database
                   |
                   v
                MySQL
```

In a production system, different components handle different responsibilities.

| Component | Responsibility |
|---|---|
| API Server | Handles HTTP requests |
| Service Layer | Business logic |
| Repository | Database operations |
| Database | Persistent data storage |
| Redis | Fast in-memory data storage |
| Load Balancer | Distributes incoming traffic |
| Cache | Reduces repeated database queries |
| Monitoring | Tracks application and database performance |

## 2.1 Why Advanced Database Architecture Matters

Suppose an e-commerce application receives 100,000 requests daily.

Every request may require:

- Fetching products.
- Fetching categories.
- Checking user information.
- Retrieving orders.
- Checking inventory.

If every request executes multiple database queries, database load increases significantly.

Advanced database architecture helps improve:

- Query performance.
- Application scalability.
- Data consistency.
- Resource utilization.
- Reliability.
- Maintainability.

---

# 3. Database Normalization

Database normalization is the process of organizing relational database structures to reduce unnecessary duplication and improve data integrity.

Consider this table:

| order_id | customer_name | customer_email | product_name |
|---:|---|---|---|
| 1 | John | john@example.com | Laptop |
| 2 | John | john@example.com | Mouse |
| 3 | David | david@example.com | Keyboard |

Notice that John's information is repeated.

This creates data duplication.

Suppose John changes his email address.

You must update multiple rows.

If one row is missed, inconsistent information appears.

Normalization solves this problem by separating related data.

## 3.1 First Normal Form (1NF)

A table is in First Normal Form when:

1. Each column contains atomic values.
2. Each row can be uniquely identified.
3. Repeating groups are eliminated.

Incorrect design:

| id | name | phone_numbers |
|---:|---|---|
| 1 | John | 12345, 67890 |

Here, multiple phone numbers are stored in one field.

Better design:

**users**

| id | name |
|---:|---|
| 1 | John |

**user_phones**

| id | user_id | phone |
|---:|---:|---|
| 1 | 1 | 12345 |
| 2 | 1 | 67890 |

Now each phone number is stored separately.

## 3.2 Second Normal Form (2NF)

A table is in Second Normal Form when:

1. It satisfies 1NF.
2. Every non-key attribute depends on the entire candidate key, not just part of a composite key.

Consider:

| student_id | course_id | student_name | course_name |
|---:|---:|---|---|
| 1 | 101 | John | JavaScript |
| 1 | 102 | John | TypeScript |
| 2 | 101 | David | JavaScript |

Suppose the composite primary key is:

```text
student_id + course_id
```

But:

- `student_name` depends only on `student_id`.
- `course_name` depends only on `course_id`.

This creates partial dependencies.

Better design:

**students**

| student_id | student_name |
|---:|---|
| 1 | John |
| 2 | David |

**courses**

| course_id | course_name |
|---:|---|
| 101 | JavaScript |
| 102 | TypeScript |

**student_courses**

| student_id | course_id |
|---:|---:|
| 1 | 101 |
| 1 | 102 |
| 2 | 101 |

## 3.3 Third Normal Form (3NF)

A table is in Third Normal Form when:

1. It satisfies 2NF.
2. Non-key attributes do not depend transitively on a candidate key.

Consider:

| employee_id | employee_name | department_id | department_name |
|---:|---|---:|---|
| 1 | John | 10 | Engineering |
| 2 | David | 10 | Engineering |
| 3 | Sarah | 20 | Marketing |

Here:

```text
employee_id → department_id
department_id → department_name
```

`department_name` depends on `department_id`, not directly on the employee key.

Better design:

**employees**

| employee_id | employee_name | department_id |
|---:|---|---:|
| 1 | John | 10 |
| 2 | David | 10 |
| 3 | Sarah | 20 |

**departments**

| department_id | department_name |
|---:|---|
| 10 | Engineering |
| 20 | Marketing |

## 3.4 Normal Forms Summary

| Normal Form | Main Rule |
|---|---|
| 1NF | Atomic values; no repeating groups |
| 2NF | No partial dependency on a composite candidate key |
| 3NF | No transitive dependency of non-key attributes on a candidate key |
| BCNF | Every determinant is a candidate key |

BCNF is a stronger form of normalization than 3NF.

---

# 4. Database Denormalization

Denormalization intentionally introduces some redundancy into a database to improve specific read workloads.

Consider an order reporting application.

You have:

**orders**

| id | user_id | total |
|---:|---:|---:|
| 1 | 10 | 500 |
| 2 | 10 | 1000 |

**users**

| id | name |
|---:|---|
| 10 | John |

To display an order report, you need to join both tables.

```sql
SELECT
    orders.id,
    users.name,
    orders.total
FROM orders
JOIN users
    ON users.id = orders.user_id;
```

For certain reporting workloads, you may store the customer's name in the order record as a historical snapshot.

**orders**

| id | user_id | customer_name | total |
|---:|---:|---|---:|
| 1 | 10 | John | 500 |
| 2 | 10 | John | 1000 |

Now the report may need fewer joins.

However, this creates redundancy.

## 4.1 Normalization vs Denormalization

| Normalization | Denormalization |
|---|---|
| Reduces duplication | Introduces controlled duplication |
| Improves data consistency | Can improve read performance |
| Often requires more joins | Can reduce joins |
| Useful for transactional data | Useful for selected read-heavy workloads |

**Important:** Denormalization is not automatically faster. It introduces synchronization and consistency costs. Measure the actual workload before applying it.

---

# 5. Advanced SQL Queries

Now let's move into advanced SQL.

Assume we have these tables:

```sql
users
-----
id
name
email

orders
------
id
user_id
total
status
created_at

products
--------
id
name
price

order_items
-----------
id
order_id
product_id
quantity
price
```

These tables will be used in the following examples.

---

# 6. Advanced SQL Joins

Joins combine data from multiple tables.

## 6.1 INNER JOIN

Returns matching records from both tables.

```sql
SELECT
    users.id,
    users.name,
    orders.id AS order_id,
    orders.total
FROM users
INNER JOIN orders
    ON users.id = orders.user_id;
```

Only users who have matching orders appear.

## 6.2 LEFT JOIN

Returns all records from the left table and matching records from the right table.

```sql
SELECT
    users.id,
    users.name,
    orders.id AS order_id
FROM users
LEFT JOIN orders
    ON users.id = orders.user_id;
```

Users without orders also appear, with `NULL` values for order columns.

## 6.3 RIGHT JOIN

Returns all records from the right table and matching records from the left table.

```sql
SELECT
    users.name,
    orders.id
FROM users
RIGHT JOIN orders
    ON users.id = orders.user_id;
```

## 6.4 FULL OUTER JOIN

Returns matching and non-matching records from both tables.

```sql
SELECT
    users.name,
    orders.id
FROM users
FULL OUTER JOIN orders
    ON users.id = orders.user_id;
```

PostgreSQL supports `FULL OUTER JOIN` directly.

MySQL does not support native `FULL OUTER JOIN`; it can be emulated using a `UNION` of left and right joins.

## 6.5 CROSS JOIN

Returns the Cartesian product of two tables.

```sql
SELECT
    users.name,
    products.name
FROM users
CROSS JOIN products;
```

If there are:

- 5 users.
- 10 products.

The result contains:

```text
5 × 10 = 50 rows
```

## 6.6 SELF JOIN

A self join joins a table with itself.

Example: employees and managers.

```sql
SELECT
    employees.name AS employee,
    managers.name AS manager
FROM employees
LEFT JOIN employees AS managers
    ON employees.manager_id = managers.id;
```

This is useful for hierarchical relationships.

## 6.7 Join Summary

| Join | Result |
|---|---|
| INNER JOIN | Matching rows |
| LEFT JOIN | All left rows plus matching right rows |
| RIGHT JOIN | All right rows plus matching left rows |
| FULL OUTER JOIN | All rows from both sides |
| CROSS JOIN | Cartesian product |
| SELF JOIN | A table joined with itself |

---

# 7. SQL Subqueries

A subquery is a query nested inside another query.

Example:

Find users whose total order amount is greater than ₹5,000.

```sql
SELECT *
FROM users
WHERE id IN (
    SELECT user_id
    FROM orders
    GROUP BY user_id
    HAVING SUM(total) > 5000
);
```

The inner query executes as part of the outer query.

## 7.1 Scalar Subquery

A scalar subquery returns a single value.

```sql
SELECT
    name,
    (
        SELECT COUNT(*)
        FROM orders
        WHERE orders.user_id = users.id
    ) AS total_orders
FROM users;
```

## 7.2 Correlated Subquery

A correlated subquery references a column from the outer query.

Example:

```sql
SELECT *
FROM users
WHERE EXISTS (
    SELECT 1
    FROM orders
    WHERE orders.user_id = users.id
);
```

The inner query references:

```sql
users.id
```

from the outer query.

## 7.3 EXISTS vs IN

`EXISTS` checks whether a subquery returns at least one row.

```sql
SELECT *
FROM users
WHERE EXISTS (
    SELECT 1
    FROM orders
    WHERE orders.user_id = users.id
);
```

`IN` checks whether a value exists in a returned set.

```sql
SELECT *
FROM users
WHERE id IN (
    SELECT user_id
    FROM orders
);
```

The best option depends on the query and database optimizer. Do not assume one is always faster.

---

# 8. Common Table Expressions (CTEs)

A Common Table Expression is a temporary named result set defined using `WITH`.

It makes complex SQL queries easier to read and maintain.

Example:

```sql
WITH user_orders AS (
    SELECT
        user_id,
        SUM(total) AS total_amount
    FROM orders
    GROUP BY user_id
)

SELECT
    users.name,
    user_orders.total_amount
FROM users
JOIN user_orders
    ON users.id = user_orders.user_id;
```

Here:

```sql
user_orders
```

is the CTE.

## 8.1 Multiple CTEs

```sql
WITH order_summary AS (

    SELECT
        user_id,
        COUNT(*) AS total_orders,
        SUM(total) AS total_amount
    FROM orders
    GROUP BY user_id

),

high_value_users AS (

    SELECT *
    FROM order_summary
    WHERE total_amount > 10000

)

SELECT *
FROM high_value_users;
```

This query:

1. Calculates each user's order summary.
2. Filters users with more than ₹10,000 in orders.
3. Returns the filtered result.

## 8.2 Recursive CTE

Recursive CTEs are useful for hierarchical data.

Example: organizational hierarchy.

```sql
WITH RECURSIVE employee_hierarchy AS (

    SELECT
        id,
        name,
        manager_id,
        1 AS level
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    SELECT
        employees.id,
        employees.name,
        employees.manager_id,
        employee_hierarchy.level + 1
    FROM employees
    JOIN employee_hierarchy
        ON employees.manager_id = employee_hierarchy.id
)

SELECT *
FROM employee_hierarchy;
```

Recursive CTE syntax is supported by PostgreSQL and modern MySQL versions.

---

# 9. SQL Window Functions

Window functions perform calculations across related rows without collapsing them into one result per group.

This is an important advanced SQL topic.

Consider:

| id | user_id | total |
|---:|---:|---:|
| 1 | 1 | 500 |
| 2 | 1 | 1000 |
| 3 | 2 | 800 |
| 4 | 2 | 1200 |

## 9.1 ROW_NUMBER()

Assigns a sequential number to each row within a window.

```sql
SELECT
    id,
    user_id,
    total,
    ROW_NUMBER() OVER (
        PARTITION BY user_id
        ORDER BY total DESC
    ) AS row_number
FROM orders;
```

Example output:

| id | user_id | total | row_number |
|---:|---:|---:|---:|
| 2 | 1 | 1000 | 1 |
| 1 | 1 | 500 | 2 |
| 4 | 2 | 1200 | 1 |
| 3 | 2 | 800 | 2 |

## 9.2 RANK()

Assigns rankings, allowing ties and leaving gaps after tied rankings.

```sql
SELECT
    name,
    salary,
    RANK() OVER (
        ORDER BY salary DESC
    ) AS ranking
FROM employees;
```

## 9.3 DENSE_RANK()

Assigns rankings without leaving gaps after ties.

```sql
SELECT
    name,
    salary,
    DENSE_RANK() OVER (
        ORDER BY salary DESC
    ) AS ranking
FROM employees;
```

Difference:

| Salary | RANK | DENSE_RANK |
|---:|---:|---:|
| 100000 | 1 | 1 |
| 90000 | 2 | 2 |
| 90000 | 2 | 2 |
| 80000 | 4 | 3 |

## 9.4 SUM() OVER()

Calculate a running total.

```sql
SELECT
    id,
    total,
    SUM(total) OVER (
        ORDER BY id
    ) AS running_total
FROM orders;
```

## 9.5 LAG()

Access a previous row's value.

```sql
SELECT
    id,
    total,
    LAG(total) OVER (
        ORDER BY id
    ) AS previous_total
FROM orders;
```

## 9.6 LEAD()

Access the next row's value.

```sql
SELECT
    id,
    total,
    LEAD(total) OVER (
        ORDER BY id
    ) AS next_total
FROM orders;
```

## 9.7 Window Function Summary

| Function | Purpose |
|---|---|
| `ROW_NUMBER()` | Sequential row numbering |
| `RANK()` | Ranking with gaps after ties |
| `DENSE_RANK()` | Ranking without gaps |
| `SUM() OVER()` | Windowed sum |
| `AVG() OVER()` | Windowed average |
| `LAG()` | Previous row value |
| `LEAD()` | Next row value |
| `FIRST_VALUE()` | First value in a window |
| `LAST_VALUE()` | Last value in a window, subject to the window frame |

**Important:** Window functions do not normally collapse rows like `GROUP BY`. They calculate values across a window while retaining individual rows.

---

# 10. Stored Procedures

A stored procedure is a reusable collection of SQL statements stored inside the database.

Example in MySQL:

```sql
DELIMITER //

CREATE PROCEDURE GetAllUsers()
BEGIN

    SELECT *
    FROM users;

END //

DELIMITER ;
```

Execute:

```sql
CALL GetAllUsers();
```

## 10.1 Stored Procedure with Parameters

```sql
DELIMITER //

CREATE PROCEDURE GetUserById(
    IN user_id INT
)
BEGIN

    SELECT *
    FROM users
    WHERE id = user_id;

END //

DELIMITER ;
```

Execute:

```sql
CALL GetUserById(1);
```

## 10.2 Advantages

- Reusable SQL logic.
- Can reduce repeated application-side SQL.
- Centralized database operations.
- Useful for database-centric workflows.

## 10.3 Disadvantages

- Database-specific syntax.
- More complex deployment and version control.
- Business logic can become split between application and database.
- Debugging may require database-specific tools.

---

# 11. Database Triggers

A trigger automatically executes when a particular database event occurs.

For example:

- INSERT.
- UPDATE.
- DELETE.

Example: Maintain an audit table when a user is inserted.

```sql
CREATE TABLE user_audit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Create trigger:

```sql
DELIMITER //

CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN

    INSERT INTO user_audit (
        user_id,
        action
    )
    VALUES (
        NEW.id,
        'USER_CREATED'
    );

END //

DELIMITER ;
```

Now inserting a user automatically creates an audit record.

## 11.1 OLD and NEW

Inside row-level triggers:

| Keyword | Meaning |
|---|---|
| `NEW` | New row values |
| `OLD` | Existing row values |

For example:

```sql
NEW.email
```

represents the new email value.

```sql
OLD.email
```

represents the previous email value in an update or delete trigger, where applicable.

## 11.2 When Should You Use Triggers?

Useful for:

- Audit records.
- Database-enforced business rules.
- Certain automatic data-maintenance operations.

Avoid excessive triggers because they can make application behavior less visible and harder to debug.

---

# 12. Database Views

A view is a saved SQL query that behaves like a virtual table.

Example:

```sql
CREATE VIEW user_order_summary AS

SELECT
    users.id,
    users.name,
    COUNT(orders.id) AS total_orders,
    COALESCE(SUM(orders.total), 0) AS total_amount

FROM users

LEFT JOIN orders
    ON users.id = orders.user_id

GROUP BY
    users.id,
    users.name;
```

Now query the view:

```sql
SELECT *
FROM user_order_summary;
```

## 12.1 Why Use Views?

- Simplify complex queries.
- Reuse query logic.
- Provide controlled access to selected data.
- Simplify reporting queries.

A regular view generally stores the query definition, not a separate cached copy of its results.

---

# 13. Materialized Views

A materialized view stores the results of a query.

Unlike an ordinary view, it persists the query result.

Conceptually:

```text
View:
Query executes when accessed.

Materialized View:
Query result is stored and refreshed separately.
```

Example in PostgreSQL:

```sql
CREATE MATERIALIZED VIEW user_order_summary AS

SELECT
    user_id,
    COUNT(*) AS total_orders,
    SUM(total) AS total_amount
FROM orders
GROUP BY user_id;
```

Query:

```sql
SELECT *
FROM user_order_summary;
```

Refresh:

```sql
REFRESH MATERIALIZED VIEW user_order_summary;
```

## 13.1 Advantages

- Faster reads for expensive aggregations.
- Useful for analytics.
- Reduces repeated computation.

## 13.2 Disadvantages

- Stored data may become stale.
- Refreshing can be expensive.
- Additional storage is required.

**Important:** PostgreSQL supports materialized views natively. MySQL does not provide the same native materialized-view feature; similar behavior can be implemented using summary tables and scheduled refresh jobs.

---

# 14. Database Indexing

An index is a data structure that helps the database find records more efficiently.

Imagine a book containing 1,000 pages.

Without an index, finding a topic may require checking many pages.

With an index, you can locate the relevant page quickly.

Database indexes work on a similar principle.

## 14.1 Without an Index

Consider:

```sql
SELECT *
FROM users
WHERE email = 'john@example.com';
```

Without an appropriate index, the database may scan many rows.

This is called a table scan.

## 14.2 Create an Index

```sql
CREATE INDEX idx_users_email
ON users(email);
```

Now the database can use the index to locate matching records more efficiently when the optimizer determines that it is beneficial.

## 14.3 Unique Index

A unique index prevents duplicate values.

```sql
CREATE UNIQUE INDEX idx_users_email_unique
ON users(email);
```

This is useful for:

- Email addresses.
- Usernames.
- External identifiers.
- Business reference numbers.

A unique constraint also creates an index in common relational database systems, though implementation details differ.

## 14.4 Composite Index

A composite index contains multiple columns.

Example:

```sql
CREATE INDEX idx_orders_user_status
ON orders(user_id, status);
```

This can help queries such as:

```sql
SELECT *
FROM orders
WHERE user_id = 10
AND status = 'completed';
```

## 14.5 Index Column Order

Consider:

```sql
CREATE INDEX idx_orders_user_status
ON orders(user_id, status);
```

The index is organized around:

1. `user_id`
2. `status`

It is generally useful for queries filtering by:

```sql
WHERE user_id = 10
```

and queries filtering by:

```sql
WHERE user_id = 10
AND status = 'completed'
```

It may not be as useful for a query filtering only by:

```sql
WHERE status = 'completed'
```

This is related to the leftmost-prefix principle for common B-tree composite indexes.

## 14.6 Index Types

| Index Type | Purpose |
|---|---|
| B-tree | General-purpose indexing |
| Hash | Equality lookup in supported contexts |
| Unique | Enforces uniqueness |
| Composite | Indexes multiple columns |
| Full-text | Searches text content |
| Spatial | Supports spatial data queries |

Available index types depend on the database engine.

---

# 15. When Should You Create an Index?

Consider creating an index on columns frequently used in:

- WHERE conditions.
- JOIN conditions.
- ORDER BY clauses.
- GROUP BY operations.
- Foreign key lookups.

Example:

```sql
SELECT *
FROM orders
WHERE user_id = 10;
```

An index on `user_id` may help.

## 15.1 Disadvantages of Indexes

Indexes are not free.

They require:

- Additional storage.
- Maintenance during inserts.
- Maintenance during updates.
- Maintenance during deletes.

Too many indexes can slow down write-heavy workloads.

The correct strategy is to index according to real query patterns.

---

# 16. Full-Text Search

Full-text search allows applications to search textual content using database-specific search capabilities.

Example: Search products by description.

In MySQL:

```sql
ALTER TABLE products
ADD FULLTEXT INDEX idx_product_search (
    name,
    description
);
```

Search:

```sql
SELECT *
FROM products
WHERE MATCH(name, description)
AGAINST('gaming laptop' IN NATURAL LANGUAGE MODE);
```

PostgreSQL offers full-text search features such as:

- `tsvector`
- `tsquery`
- `to_tsvector()`
- `to_tsquery()`
- `websearch_to_tsquery()`

Example:

```sql
SELECT *
FROM products
WHERE to_tsvector(
    'english',
    name || ' ' || description
)
@@ websearch_to_tsquery(
    'english',
    'gaming laptop'
);
```

Full-text search is useful for:

- Product catalogs.
- Blog search.
- Documentation.
- Article search.
- Content management systems.

For more advanced search requirements, dedicated search engines may be appropriate.

---

# 17. Query Execution Plans

A query execution plan explains how the database intends to execute a SQL query.

This is essential for query optimization.

Suppose:

```sql
SELECT *
FROM orders
WHERE user_id = 10;
```

You can inspect the execution plan.

## 17.1 MySQL EXPLAIN

```sql
EXPLAIN
SELECT *
FROM orders
WHERE user_id = 10;
```

For supported MySQL versions:

```sql
EXPLAIN ANALYZE
SELECT *
FROM orders
WHERE user_id = 10;
```

## 17.2 PostgreSQL EXPLAIN

```sql
EXPLAIN
SELECT *
FROM orders
WHERE user_id = 10;
```

Analyze actual execution:

```sql
EXPLAIN ANALYZE
SELECT *
FROM orders
WHERE user_id = 10;
```

`EXPLAIN ANALYZE` executes the query, so be careful when analyzing statements that modify data.

## 17.3 Important Execution Plan Concepts

| Concept | Meaning |
|---|---|
| Sequential Scan | Reads rows by scanning the table |
| Index Scan | Uses an index to locate rows |
| Index Only Scan | Retrieves required data from an index when possible |
| Nested Loop | Joins using repeated lookups |
| Hash Join | Uses a hash structure to join rows |
| Sort | Sorts intermediate or final results |
| Cost | Optimizer's estimated execution cost |

A sequential scan is not necessarily bad. For a small table or a query returning a large percentage of rows, it may be more efficient than an index scan.

---

# 18. Query Optimization

Query optimization means improving the efficiency of database queries.

Consider:

```sql
SELECT *
FROM orders;
```

If the table contains millions of records, retrieving everything is expensive.

Better:

```sql
SELECT
    id,
    user_id,
    total
FROM orders
LIMIT 100;
```

## 18.1 Avoid SELECT *

Instead of:

```sql
SELECT *
FROM users;
```

Use:

```sql
SELECT
    id,
    name,
    email
FROM users;
```

This reduces unnecessary data transfer.

## 18.2 Use Appropriate Indexes

```sql
CREATE INDEX idx_orders_user_id
ON orders(user_id);
```

## 18.3 Avoid Functions on Indexed Columns When Possible

Potentially less index-friendly:

```sql
SELECT *
FROM users
WHERE LOWER(email) = 'john@example.com';
```

A normal index on `email` may not be usable for this expression.

Possible solutions include:

- Functional indexes where supported.
- A normalized email column.
- Appropriate collation.

## 18.4 Avoid Leading Wildcards When Possible

```sql
SELECT *
FROM users
WHERE name LIKE '%John%';
```

A typical B-tree index often cannot efficiently support arbitrary substring matching with a leading wildcard.

For large-scale text search, consider full-text search or a specialized search index.

## 18.5 Use Pagination

Avoid returning millions of records.

```sql
SELECT *
FROM users
ORDER BY id
LIMIT 20 OFFSET 40;
```

For large datasets, consider keyset pagination.

## 18.6 Avoid Unnecessary Joins

Only join tables whose data is required.

## 18.7 Avoid N+1 Queries

Use eager loading, batching, or carefully designed joins.

---

# 19. N+1 Query Optimization with TypeScript

Let's see a practical example using Prisma.

Problematic approach:

```ts
const users = await prisma.user.findMany();

for (const user of users) {

    const orders = await prisma.order.findMany({
        where: {
            userId: user.id
        }
    });

    console.log(orders);
}
```

This creates multiple database queries.

Better approach:

```ts
const users = await prisma.user.findMany({
    include: {
        orders: true
    }
});
```

Now the ORM fetches users with their associated orders using a more efficient query strategy.

## 19.1 Select Only Required Fields

```ts
const users = await prisma.user.findMany({
    select: {
        id: true,
        name: true,

        orders: {
            select: {
                id: true,
                total: true
            }
        }
    }
});
```

This reduces unnecessary data retrieval.

---

# 20. Database Locking

Locking controls concurrent access to database records.

Suppose two users try to purchase the last available product simultaneously.

Inventory:

```text
Product stock = 1
```

Both requests read stock as 1.

Both attempt to purchase.

Without appropriate concurrency control, overselling may occur.

Locking helps prevent this.

## 20.1 Pessimistic Locking

Pessimistic locking locks records while a transaction operates on them.

Example in PostgreSQL:

```sql
BEGIN;

SELECT *
FROM products
WHERE id = 1
FOR UPDATE;

UPDATE products
SET stock = stock - 1
WHERE id = 1
AND stock > 0;

COMMIT;
```

`FOR UPDATE` locks selected rows against conflicting updates until the transaction ends.

A production implementation should verify that the update affected exactly one row.

## 20.2 Optimistic Locking

Optimistic locking assumes conflicts are uncommon.

A version column tracks changes.

Example:

| id | stock | version |
|---:|---:|---:|
| 1 | 10 | 1 |

Update:

```sql
UPDATE products
SET
    stock = 9,
    version = version + 1
WHERE
    id = 1
    AND version = 1;
```

If another transaction has already changed the record, the version will no longer match.

The update affects zero rows, indicating a conflict.

## 20.3 Pessimistic vs Optimistic Locking

| Pessimistic Locking | Optimistic Locking |
|---|---|
| Locks records | Uses version checks |
| Prevents conflicting updates while locked | Detects conflicting updates |
| Useful for high-contention operations | Useful when conflicts are uncommon |
| Can cause waiting and deadlocks | May require retrying operations |

---

# 21. Transaction Isolation Levels

Isolation levels control how concurrent transactions interact.

The four commonly discussed SQL isolation levels are:

1. Read Uncommitted.
2. Read Committed.
3. Repeatable Read.
4. Serializable.

## 21.1 Read Uncommitted

Allows reading uncommitted changes from another transaction.

Potential issue:

Dirty reads.

## 21.2 Read Committed

A transaction reads only committed data.

It prevents dirty reads, but repeated reads may return different committed values.

## 21.3 Repeatable Read

Repeated reads of the same row generally return consistent values within a transaction, subject to database-specific behavior.

## 21.4 Serializable

Provides the strongest standard isolation level.

Transactions behave as if they executed serially, although the database may abort transactions that cannot be safely serialized.

## 21.5 Isolation Level Comparison

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read |
|---|---|---|---|
| Read Uncommitted | Possible | Possible | Possible |
| Read Committed | Prevented | Possible | Possible |
| Repeatable Read | Prevented | Prevented | Database-dependent behavior |
| Serializable | Prevented | Prevented | Prevented |

Actual behavior depends on the database engine and its implementation.

---

# 22. Redis Introduction

Now let's move to Redis.

Redis is an in-memory data store commonly used for:

- Caching.
- Session storage.
- Rate limiting.
- Distributed locks.
- Queues.
- Counters.
- Real-time data.

Redis is often used alongside a relational database.

Example architecture:

```text
Client
  |
  v
Express API
  |
  v
Service
  |
  v
Redis Cache
  |
  +---- Cache Hit ----> Return Data
  |
  +---- Cache Miss
          |
          v
       Database
          |
          v
       Redis Cache
          |
          v
       Return Data
```

## 22.1 Why Redis?

Consider a product API.

Every request executes:

```sql
SELECT *
FROM products
WHERE id = 1;
```

If the same product is requested 10,000 times, repeated database queries may be unnecessary.

You can cache the result in Redis.

The application can retrieve cached data without querying the database on every request.

## 22.2 Redis vs MySQL

| Feature | Redis | MySQL |
|---|---|---|
| Primary Purpose | In-memory data store | Relational database |
| Data Model | Key-value and data structures | Tables and relationships |
| Typical Speed | Very low-latency memory access | Depends on storage, cache and query |
| SQL | No | Yes |
| Relationships | No traditional relational joins | Yes |
| Common Usage | Cache, sessions, counters | Persistent business data |

Redis can persist data using its persistence mechanisms, but its common caching use case is not a replacement for a relational system of record.

---

# 23. Installing Redis and Connecting with TypeScript

Install the official Node.js Redis client:

```bash
npm install redis
```

Create:

```text
src/config/redis.ts
```

Code:

```ts
import { createClient } from "redis";

export const redisClient = createClient({
    url: process.env.REDIS_URL ?? "redis://localhost:6379"
});

redisClient.on("error", (error) => {
    console.error("Redis error:", error);
});
```

Connect during application startup:

```ts
await redisClient.connect();

console.log("Redis connected");
```

**Important:** Redis connection management should happen during application startup, not inside every request.

Also, configure appropriate reconnection behavior and health checks for your deployment.

---

# 24. Redis Data Structures

Redis provides several useful data structures.

## 24.1 Strings

Store simple key-value data.

```ts
await redisClient.set(
    "username",
    "John"
);
```

Retrieve:

```ts
const username = await redisClient.get("username");
```

## 24.2 Hashes

Store structured fields.

```ts
await redisClient.hSet(
    "user:1",
    {
        name: "John",
        email: "john@example.com",
        age: "25"
    }
);
```

Retrieve:

```ts
const user = await redisClient.hGetAll("user:1");
```

Example:

```json
{
    "name": "John",
    "email": "john@example.com",
    "age": "25"
}
```

## 24.3 Lists

Lists store ordered collections.

```ts
await redisClient.lPush(
    "notifications",
    "New message"
);
```

Retrieve:

```ts
const notification = await redisClient.rPop(
    "notifications"
);
```

Lists can be useful for simple queue-like workflows, although Redis Streams or dedicated queue systems may be more appropriate for reliable message processing.

## 24.4 Sets

Sets store unique values.

```ts
await redisClient.sAdd(
    "online_users",
    "user:1",
    "user:2"
);
```

Check membership:

```ts
const exists = await redisClient.sIsMember(
    "online_users",
    "user:1"
);
```

## 24.5 Sorted Sets

Sorted sets store unique members with associated scores.

```ts
await redisClient.zAdd(
    "leaderboard",
    [
        {
            score: 100,
            value: "John"
        },
        {
            score: 150,
            value: "David"
        }
    ]
);
```

Retrieve:

```ts
const leaderboard = await redisClient.zRangeWithScores(
    "leaderboard",
    0,
    -1
);
```

Useful for leaderboards and ranking systems.

## 24.6 Redis Data Structure Summary

| Data Structure | Typical Use |
|---|---|
| String | Cache values, counters |
| Hash | Objects and structured fields |
| List | Ordered collections |
| Set | Unique values |
| Sorted Set | Leaderboards |
| Stream | Event and message processing |
| Bitmap | Compact Boolean state |
| HyperLogLog | Approximate cardinality |

---

# 25. Redis Key Expiration and TTL

TTL stands for Time To Live.

It determines how long a key remains available before expiration.

Example:

```ts
await redisClient.set(
    "user:1",
    JSON.stringify({
        id: 1,
        name: "John"
    }),
    {
        EX: 300
    }
);
```

The key expires after 300 seconds.

Retrieve remaining TTL:

```ts
const ttl = await redisClient.ttl("user:1");
```

## 25.1 Set Expiration Separately

```ts
await redisClient.expire(
    "user:1",
    300
);
```

## 25.2 Why Use TTL?

TTL helps prevent stale cached data from remaining indefinitely.

Common uses:

- Product cache.
- OTP expiration.
- Temporary sessions.
- API response cache.
- Verification tokens.

For sensitive authentication data, expiration must be combined with an appropriate security and revocation strategy.

---

# 26. Caching Strategies

Caching stores frequently accessed data in a faster storage layer.

There are several caching strategies.

## 26.1 Cache-Aside Pattern

This is one of the most commonly used caching strategies.

Workflow:

1. Check Redis.
2. If data exists, return it.
3. If data does not exist, query the database.
4. Store the result in Redis.
5. Return the result.

Diagram:

```text
Request
   |
   v
Check Redis
   |
   +---- Cache Hit ----> Return Data
   |
   +---- Cache Miss
           |
           v
        Database
           |
           v
        Store in Redis
           |
           v
        Return Data
```

## 26.2 Implement Cache-Aside with TypeScript

```ts
import { redisClient } from "../config/redis.js";

import { prisma } from "../config/database.js";

async function getUserById(id: number) {

    const cacheKey = `user:${id}`;

    // 1. Check cache
    const cachedUser = await redisClient.get(cacheKey);

    if (cachedUser) {
        return JSON.parse(cachedUser);
    }

    // 2. Fetch from database
    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });

    if (!user) {
        return null;
    }

    // 3. Store in cache
    await redisClient.set(
        cacheKey,
        JSON.stringify(user),
        {
            EX: 300
        }
    );

    // 4. Return data
    return user;
}
```

This is a basic example. In production, validate cached JSON before trusting it, and define an explicit response type.

## 26.3 Cache Hit vs Cache Miss

| Scenario | Meaning |
|---|---|
| Cache Hit | Data exists in cache |
| Cache Miss | Data is not found in cache |

A high cache hit rate can reduce database workload.

However, a high hit rate does not automatically mean the application is performing well. Monitor latency, freshness, memory use and database load too.

---

# 27. Cache Invalidation

Cache invalidation means removing or updating cached data when the underlying data changes.

Suppose:

User information is cached:

```text
user:1
```

Then the user updates their name.

The database contains the new name, but Redis still contains the old data.

This creates stale cache data.

## 27.1 Delete Cache After Update

```ts
async function updateUser(
    id: number,
    name: string
) {

    const user = await prisma.user.update({
        where: {
            id
        },

        data: {
            name
        }
    });

    await redisClient.del(`user:${id}`);

    return user;
}
```

Now the next request will fetch fresh data from the database.

## 27.2 Cache Invalidation Strategies

| Strategy | Description |
|---|---|
| TTL | Cache expires automatically |
| Explicit Delete | Delete cache after updates |
| Update Cache | Update cached data |
| Event-Based | Invalidate cache when events occur |
| Versioned Keys | Use new keys for new data versions |

## 27.3 Cache-Aside vs Write-Through

**Cache-Aside:**

The application updates the database and then manages the cache separately.

**Write-Through:**

The application updates the database and cache as part of the same write workflow.

Neither approach is automatically atomic across Redis and a relational database. Failure handling and consistency requirements must be designed explicitly.

---

# 28. Preventing Cache Stampedes

A cache stampede occurs when a frequently accessed cache key expires and many requests simultaneously query the database to rebuild it.

Example:

```text
10,000 Requests
      |
      v
Cache Miss
      |
      v
10,000 Database Queries
```

This can overload the database.

Possible solutions:

1. Request coalescing.
2. Distributed locks.
3. Randomized TTL.
4. Background refresh.
5. Stale-while-revalidate strategies.

## 28.1 Request Coalescing Concept

Within one Node.js process, multiple requests for the same key can share one in-progress database operation.

```ts
const inFlight = new Map<string, Promise<unknown>>();

async function loadOnce<T>(
    key: string,
    loader: () => Promise<T>
): Promise<T> {

    const existing = inFlight.get(key);

    if (existing) {
        return existing as Promise<T>;
    }

    const promise = loader();

    inFlight.set(key, promise);

    try {
        return await promise;

    } finally {
        inFlight.delete(key);
    }
}
```

This example handles duplicate work inside one application process.

For multiple server instances, use a distributed coordination strategy when necessary.

---

# 29. Redis Rate Limiting

Rate limiting restricts how frequently a client can access an API.

Example:

Allow a user to make 100 requests per minute.

Redis is useful because multiple application instances can share the same rate-limit state.

## 29.1 Basic Counter-Based Approach

```ts
async function checkRateLimit(
    key: string
) {

    const requests = await redisClient.incr(key);

    if (requests === 1) {
        await redisClient.expire(key, 60);
    }

    return requests <= 100;
}
```

Usage:

```ts
const allowed = await checkRateLimit("user:1");

if (!allowed) {
    throw new Error("Rate limit exceeded");
}
```

This is a simplified fixed-window counter.

For production, the increment and expiration should be atomic, such as through a Redis Lua script or another atomic Redis operation. Otherwise, a failure between the two operations can leave a counter without an expiration.

Also consider:

- IP-based rate limiting.
- User-based rate limiting.
- API key-based rate limiting.
- Different limits for different endpoints.
- Distributed deployments.

## 29.2 Express Rate Limiting with Redis

A practical option is to use a middleware package such as `rate-limiter-flexible` with its Redis integration.

This avoids implementing distributed rate-limiting mechanics manually.

---

# 30. Distributed Caching

Distributed caching means multiple application servers use a shared cache.

Example:

```text
            Load Balancer
                 |
       +---------+---------+
       |         |         |
       v         v         v
    Server 1  Server 2  Server 3
       |         |         |
       +---------+---------+
                 |
                 v
               Redis
                 |
                 v
              Database
```

Without a shared cache, each server might maintain separate cached copies.

This can cause inconsistent results.

Redis provides a centralized cache accessible by all application instances.

## 30.1 Distributed Cache Benefits

- Shared cached data.
- Lower database workload.
- Consistent cache location.
- Better horizontal scalability.

## 30.2 Distributed Cache Challenges

- Network latency.
- Cache invalidation.
- Redis availability.
- Memory limits.
- Data consistency.
- Concurrent access.

Redis itself can be deployed with replication, persistence and clustering strategies to improve availability and capacity.

---

# 31. Redis Distributed Locks

Distributed locks help coordinate operations across multiple application instances.

Suppose two servers attempt to process the same job.

You want only one server to acquire the lock.

A basic Redis lock acquisition pattern:

```ts
const lockValue = crypto.randomUUID();

const result = await redisClient.set(
    "lock:order:1001",
    lockValue,
    {
        NX: true,
        PX: 10000
    }
);
```

Meaning:

- `NX`: Set only if the key does not exist.
- `PX`: Set expiration in milliseconds.

If the result indicates success, the lock was acquired.

## 31.1 Why Use a Unique Lock Value?

Suppose Server A acquires a lock.

Its lock expires.

Server B acquires the same lock.

Server A later tries to delete the lock.

If Server A deletes the key without checking its ownership token, it might delete Server B's lock.

Therefore, release the lock only if the stored token matches the owner.

A simple Lua script:

```lua
if redis.call("GET", KEYS[1]) == ARGV[1] then
    return redis.call("DEL", KEYS[1])
else
    return 0
end
```

Execute using Redis's scripting support.

**Important:** A basic Redis lock is not a universal guarantee of distributed mutual exclusion under every failure scenario. For critical distributed coordination, carefully evaluate lease expiration, process pauses, network partitions, fencing tokens, and the consistency guarantees required.

---

# 32. Database Backup and Recovery

Database backups protect data against:

- Accidental deletion.
- Hardware failure.
- Corruption.
- Application bugs.
- Security incidents.
- Infrastructure failure.

A backup strategy should include:

1. Regular backups.
2. Off-site or separate-storage copies.
3. Retention policies.
4. Encryption.
5. Backup verification.
6. Recovery testing.

## 32.1 MySQL Backup

Using `mysqldump`:

```bash
mysqldump -u root -p typescript_app > backup.sql
```

Restore:

```bash
mysql -u root -p typescript_app < backup.sql
```

## 32.2 PostgreSQL Backup

Using `pg_dump`:

```bash
pg_dump -U postgres -d typescript_app -F c -f backup.dump
```

Restore:

```bash
pg_restore -U postgres -d typescript_app backup.dump
```

## 32.3 Point-in-Time Recovery

Point-in-time recovery allows restoring a database to a specific time, subject to the database's backup and log configuration.

For PostgreSQL, this commonly involves:

- Base backups.
- WAL archiving.
- Recovery configuration.

For MySQL, binary logs can be used with suitable backups to recover changes up to a target time.

## 32.4 Important Backup Principle

A backup is not proven useful merely because the backup command succeeded.

You must periodically test restoration.

---

# 33. Database Monitoring

Database monitoring helps identify performance and reliability issues.

Monitor:

- CPU usage.
- Memory usage.
- Disk usage.
- Active connections.
- Connection pool utilization.
- Slow queries.
- Lock waits.
- Deadlocks.
- Replication lag.
- Query latency.
- Cache hit ratio.

## 33.1 Example: Monitor Query Duration

```ts
const start = performance.now();

const users = await prisma.user.findMany();

const duration = performance.now() - start;

console.log({
    operation: "getUsers",
    durationMs: duration
});
```

## 33.2 Database Health Check

```ts
async function databaseHealthCheck() {

    try {

        await prisma.$queryRaw`SELECT 1`;

        return {
            status: "healthy"
        };

    } catch {

        return {
            status: "unhealthy"
        };
    }
}
```

Use health checks carefully.

A liveness check should generally establish whether the process is alive, while a readiness check can determine whether the application is ready to serve traffic, including its critical dependencies.

---

# 34. Advanced TypeScript: Building a Redis Cache Service

Let's create a reusable cache service.

Create:

```text
src/services/cache.service.ts
```

Code:

```ts
import { redisClient } from "../config/redis.js";

export class CacheService {

    async get<T>(key: string): Promise<T | null> {

        const value = await redisClient.get(key);

        if (!value) {
            return null;
        }

        return JSON.parse(value) as T;
    }

    async set<T>(
        key: string,
        value: T,
        ttl: number = 300
    ): Promise<void> {

        await redisClient.set(
            key,
            JSON.stringify(value),
            {
                EX: ttl
            }
        );
    }

    async delete(key: string): Promise<void> {

        await redisClient.del(key);
    }

    async exists(key: string): Promise<boolean> {

        const result = await redisClient.exists(key);

        return result === 1;
    }

    async clear(): Promise<void> {

        await redisClient.flushDb();
    }
}
```

Usage:

```ts
const cache = new CacheService();

await cache.set(
    "user:1",
    {
        id: 1,
        name: "John"
    },
    300
);

const user = await cache.get<{
    id: number;
    name: string;
}>("user:1");
```

**Important:** `JSON.parse()` does not validate data. The generic `T` is a compile-time assertion. For important cached data, validate the parsed value using Zod or another runtime schema.

Also, avoid calling `flushDb()` in a shared production Redis instance unless you deliberately intend to remove all keys from the selected database.

---

# 35. Complete Cache-Aside Service with Prisma and Redis

Let's combine everything.

```ts
import { prisma } from "../config/database.js";

import { redisClient } from "../config/redis.js";

interface UserResponse {
    id: number;
    name: string;
    email: string;
}

export async function getUser(
    id: number
): Promise<UserResponse | null> {

    const cacheKey = `user:${id}`;

    // 1. Check Redis
    const cached = await redisClient.get(cacheKey);

    if (cached) {
        return JSON.parse(cached) as UserResponse;
    }

    // 2. Fetch database
    const user = await prisma.user.findUnique({
        where: {
            id
        },

        select: {
            id: true,
            name: true,
            email: true
        }
    });

    if (!user) {
        return null;
    }

    // 3. Cache result
    await redisClient.set(
        cacheKey,
        JSON.stringify(user),
        {
            EX: 300
        }
    );

    // 4. Return
    return user;
}
```

## 35.1 Update User and Invalidate Cache

```ts
export async function updateUser(
    id: number,
    name: string
) {

    const user = await prisma.user.update({
        where: {
            id
        },

        data: {
            name
        },

        select: {
            id: true,
            name: true,
            email: true
        }
    });

    await redisClient.del(`user:${id}`);

    return user;
}
```

This implements a basic cache-aside strategy.

In production, think carefully about what happens if the database update succeeds but cache invalidation fails. TTL, retry strategies, outbox events, and versioned cache keys are possible approaches depending on consistency requirements.

---

# 36. Production Database Best Practices

## Database Design

- Use appropriate primary keys.
- Define foreign keys.
- Apply normalization where appropriate.
- Use denormalization selectively.
- Choose appropriate data types.
- Enforce unique constraints.
- Add appropriate indexes.

## SQL Performance

- Avoid unnecessary `SELECT *`.
- Use execution plans.
- Optimize joins.
- Avoid N+1 queries.
- Use pagination.
- Monitor slow queries.
- Avoid unnecessary sorting.

## Transactions

- Use transactions for related updates.
- Keep transactions reasonably short.
- Understand isolation levels.
- Handle deadlocks.
- Implement retries where appropriate.
- Use locking where necessary.

## Redis and Caching

- Set appropriate TTL values.
- Implement cache invalidation.
- Avoid caching sensitive data unnecessarily.
- Monitor memory consumption.
- Handle Redis outages.
- Prevent cache stampedes.
- Use shared caching in distributed systems.

## Reliability

- Back up databases.
- Test restoration.
- Monitor database connections.
- Implement graceful shutdown.
- Monitor replication.
- Track query latency.
- Maintain migration history.

---

# 37. Common Database Architecture Mistakes

| Mistake | Problem | Better Approach |
|---|---|---|
| Over-normalization | Excessive joins for common workloads | Design around actual access patterns |
| Excessive denormalization | Data inconsistency | Introduce controlled redundancy |
| Missing indexes | Slow queries | Analyze query patterns |
| Too many indexes | Slower writes and extra storage | Maintain only useful indexes |
| Using `SELECT *` everywhere | Unnecessary data transfer | Select required columns |
| Ignoring query plans | Performance problems remain hidden | Use EXPLAIN and profiling |
| Ignoring N+1 queries | Excessive database requests | Use eager loading or batching |
| Long-running transactions | Lock contention | Keep transactions short |
| Incorrect locking | Race conditions | Use suitable concurrency control |
| No cache invalidation | Stale data | Define invalidation strategy |
| Infinite cache lifetime | Stale or excessive cache data | Use appropriate TTL |
| Caching every response | Memory waste | Cache valuable repeated reads |
| No backup testing | Recovery may fail | Perform restoration drills |
| Ignoring monitoring | Problems go undetected | Track performance metrics |
| Trusting Redis as permanent storage without planning | Potential data loss | Configure appropriate persistence and recovery |

---

# 38. Advanced Database Interview Questions and Answers

### Q1. What is database normalization?

Normalization organizes database structures to reduce unnecessary duplication and improve data integrity.

### Q2. What is 1NF?

First Normal Form requires atomic column values and elimination of repeating groups.

### Q3. What is 2NF?

Second Normal Form requires 1NF and no partial dependency of non-key attributes on a candidate key.

### Q4. What is 3NF?

Third Normal Form requires 2NF and no transitive dependency of non-key attributes on a candidate key.

### Q5. What is BCNF?

Boyce-Codd Normal Form requires every determinant to be a candidate key.

### Q6. What is denormalization?

Denormalization introduces controlled redundancy to improve particular read workloads.

### Q7. What is an INNER JOIN?

It returns rows with matching values in both joined tables.

### Q8. What is a LEFT JOIN?

It returns all rows from the left table and matching rows from the right table.

### Q9. What is a SELF JOIN?

A self join joins a table with itself.

### Q10. What is a subquery?

A subquery is a query nested inside another SQL query.

### Q11. What is a correlated subquery?

A correlated subquery references columns from an outer query.

### Q12. What is the difference between IN and EXISTS?

`IN` checks membership in a returned set, while `EXISTS` checks whether a subquery returns at least one row.

### Q13. What is a CTE?

A Common Table Expression is a named temporary result set defined using a `WITH` clause.

### Q14. What is a recursive CTE?

A recursive CTE repeatedly references its own result to process hierarchical or iterative data.

### Q15. What is a window function?

A window function performs calculations across a set of related rows without collapsing the individual rows.

### Q16. What is the difference between ROW_NUMBER and RANK?

`ROW_NUMBER` assigns a unique sequential number. `RANK` allows ties and leaves gaps after tied positions.

### Q17. What is DENSE_RANK?

It assigns rankings without gaps after tied values.

### Q18. What is a stored procedure?

A stored procedure is a reusable collection of SQL statements stored in the database.

### Q19. What is a database trigger?

A trigger automatically executes in response to certain database events.

### Q20. What is a database view?

A view is a saved query that behaves like a virtual table.

### Q21. What is a materialized view?

A materialized view stores the result of a query and must be refreshed to reflect later changes.

### Q22. What is a database index?

An index is a data structure that helps locate records efficiently.

### Q23. What is a composite index?

A composite index is an index built on multiple columns.

### Q24. What is the leftmost-prefix principle?

For common B-tree composite indexes, queries can often use leading indexed columns, while queries using only later columns may not benefit from the index.

### Q25. What is a unique index?

A unique index prevents duplicate indexed values.

### Q26. What is a full-text index?

It is an index designed to support text-search operations.

### Q27. What is EXPLAIN?

EXPLAIN displays the database optimizer's planned query execution strategy.

### Q28. What is EXPLAIN ANALYZE?

It executes a query and provides actual execution information alongside the plan.

### Q29. What is a sequential scan?

A sequential scan reads rows by scanning the table rather than using an index to locate them.

### Q30. What is query optimization?

Query optimization improves database query efficiency in terms of execution time and resource usage.

### Q31. What is the N+1 query problem?

It occurs when an application executes one query for parent records and additional queries for each related record.

### Q32. What is pessimistic locking?

Pessimistic locking locks records to prevent conflicting concurrent operations.

### Q33. What is optimistic locking?

Optimistic locking uses version checks or similar mechanisms to detect concurrent modifications.

### Q34. What is a dirty read?

A dirty read occurs when a transaction reads data written by another transaction that has not committed.

### Q35. What is a non-repeatable read?

It occurs when repeated reads of the same row within a transaction return different committed values.

### Q36. What is a phantom read?

It occurs when repeated execution of a predicate-based query returns a different set of rows due to concurrent changes.

### Q37. What is Redis?

Redis is an in-memory data store commonly used for caching, sessions, counters and real-time data operations.

### Q38. What is TTL?

Time To Live defines how long a Redis key remains available before expiration.

### Q39. What is a cache hit?

A cache hit occurs when requested data is found in the cache.

### Q40. What is a cache miss?

A cache miss occurs when requested data is not found in the cache.

### Q41. What is cache-aside?

Cache-aside checks the cache first and queries the database when cached data is missing.

### Q42. What is cache invalidation?

Cache invalidation removes or updates cached data when the underlying data changes.

### Q43. What is a cache stampede?

A cache stampede occurs when many requests simultaneously rebuild the same expired or missing cache entry.

### Q44. What is distributed caching?

Distributed caching uses a shared cache accessible by multiple application instances.

### Q45. What is a Redis hash?

A Redis hash stores field-value pairs under one key.

### Q46. What is a Redis sorted set?

A sorted set stores unique members associated with scores and maintains ordering by score.

### Q47. What is a Redis distributed lock?

It is a coordination mechanism that uses Redis to control access to a shared resource across application instances.

### Q48. What is point-in-time recovery?

It is a recovery technique that restores a database to a particular point in time using backups and transaction logs.

### Q49. Why are database backups important?

They allow recovery from accidental deletion, corruption, infrastructure failure and other data-loss events.

### Q50. Why is database monitoring important?

It helps identify performance bottlenecks, connection problems, resource exhaustion, lock contention and reliability issues.

---

# 39. Practical Exercises

Complete these exercises to strengthen your understanding.

## Beginner – Advanced SQL

**Exercise 1:** Create users, orders and products tables.

**Exercise 2:** Practice INNER JOIN, LEFT JOIN, RIGHT JOIN and SELF JOIN.

**Exercise 3:** Write queries using subqueries.

**Exercise 4:** Implement correlated subqueries.

**Exercise 5:** Write multiple CTE queries.

**Exercise 6:** Implement recursive CTEs for employee hierarchies.

## Intermediate – Database Architecture

**Exercise 7:** Implement ROW_NUMBER, RANK and DENSE_RANK.

**Exercise 8:** Implement running totals using window functions.

**Exercise 9:** Create stored procedures.

**Exercise 10:** Create database triggers.

**Exercise 11:** Create database views.

**Exercise 12:** Implement materialized views in PostgreSQL.

**Exercise 13:** Normalize an e-commerce database to 3NF.

**Exercise 14:** Identify where denormalization could improve reporting performance.

## Advanced – Query Optimization

**Exercise 15:** Create indexes on frequently queried columns.

**Exercise 16:** Create composite indexes.

**Exercise 17:** Analyze queries using EXPLAIN.

**Exercise 18:** Compare query plans before and after indexing.

**Exercise 19:** Optimize N+1 queries using Prisma.

**Exercise 20:** Implement pagination and keyset pagination.

**Exercise 21:** Implement optimistic locking.

**Exercise 22:** Implement pessimistic locking.

**Exercise 23:** Experiment with transaction isolation levels.

## Expert – Redis and Production Architecture

**Exercise 24:** Connect Redis with TypeScript.

**Exercise 25:** Implement Redis strings, hashes, lists and sets.

**Exercise 26:** Implement TTL-based caching.

**Exercise 27:** Implement cache-aside architecture.

**Exercise 28:** Implement cache invalidation after database updates.

**Exercise 29:** Implement Redis-based rate limiting.

**Exercise 30:** Implement request coalescing.

**Exercise 31:** Implement distributed locking.

**Exercise 32:** Implement database backup and recovery.

**Exercise 33:** Implement database health monitoring.

**Exercise 34:** Build a complete Express + TypeScript + Prisma + MySQL + Redis application.

---

# 40. Phase 50 Completion Checklist

| No. | Topic | Expected Knowledge |
|---|---|---|
| 1 | Database Architecture | Understand scalable database architecture |
| 2 | Normalization | Understand 1NF, 2NF, 3NF and BCNF |
| 3 | Denormalization | Understand controlled redundancy |
| 4 | Advanced Joins | Write complex joins |
| 5 | Subqueries | Write nested queries |
| 6 | CTEs | Use common table expressions |
| 7 | Recursive CTEs | Query hierarchical data |
| 8 | Window Functions | Use ranking and analytical functions |
| 9 | Stored Procedures | Create reusable SQL procedures |
| 10 | Triggers | Implement automatic database operations |
| 11 | Views | Create reusable database views |
| 12 | Materialized Views | Understand stored query results |
| 13 | Indexing | Create appropriate indexes |
| 14 | Composite Indexes | Understand multi-column indexing |
| 15 | Full-Text Search | Implement text search |
| 16 | EXPLAIN | Analyze query execution plans |
| 17 | Query Optimization | Improve SQL performance |
| 18 | N+1 Optimization | Reduce unnecessary database queries |
| 19 | Locking | Understand optimistic and pessimistic locking |
| 20 | Isolation Levels | Understand transaction isolation |
| 21 | Redis | Connect Redis with TypeScript |
| 22 | Redis Data Structures | Use Redis strings, hashes, lists and sets |
| 23 | TTL | Configure key expiration |
| 24 | Cache-Aside | Implement cache-aside architecture |
| 25 | Cache Invalidation | Keep cache data fresh |
| 26 | Cache Stampede | Prevent repeated cache rebuilds |
| 27 | Rate Limiting | Implement Redis-based rate limiting |
| 28 | Distributed Caching | Share cache across servers |
| 29 | Distributed Locks | Coordinate distributed operations |
| 30 | Backup and Recovery | Implement recovery strategies |
| 31 | Monitoring | Monitor database health and performance |

---

# 41. What Comes Next?

You have now covered advanced database design, SQL optimization, indexing, transactions, Redis, caching strategies and production data management.

The next phase will focus on testing, code quality, architecture and maintainability in large TypeScript applications.

## Phase 51: Advanced TypeScript – Testing, Jest, Vitest, Mocking, Integration Testing, End-to-End Testing and Test-Driven Development

Upcoming topics:

1. Software Testing Fundamentals.
2. Testing Pyramid.
3. Unit Testing.
4. Integration Testing.
5. End-to-End Testing.
6. Jest with TypeScript.
7. Vitest with TypeScript.
8. Test Configuration.
9. Test Suites.
10. Test Cases.
11. Assertions.
12. Matchers.
13. Setup and Teardown.
14. Mock Functions.
15. Mock Modules.
16. Spies.
17. Fake Timers.
18. Mocking Database Operations.
19. Mocking External APIs.
20. Testing Express APIs.
21. Supertest.
22. Testing Controllers.
23. Testing Services.
24. Testing Repositories.
25. Testing Middleware.
26. Testing Authentication.
27. Testing Authorization.
28. Testing Redis.
29. Test Coverage.
30. Code Coverage Reports.
31. Test-Driven Development (TDD).
32. Behavior-Driven Development (BDD).
33. Test Fixtures and Factories.
34. Continuous Integration Testing.
35. Production Testing Strategies.

**Phase 50 is complete.**