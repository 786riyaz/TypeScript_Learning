# Phase 49: Advanced TypeScript – Database Integration, MySQL, PostgreSQL, Sequelize ORM, Prisma ORM and Type-Safe Data Access

**Level:** Expert / Advanced Backend Development  
**Prerequisites:** TypeScript fundamentals, advanced types, Node.js, Express.js, asynchronous programming, SQL fundamentals, and relational database concepts.

---

# 1. Learning Objectives

In this phase, you will learn how to integrate TypeScript applications with relational databases and ORM technologies.

By the end of this phase, you should understand:

1. Database Integration with TypeScript.
2. Relational Database Architecture.
3. MySQL with TypeScript.
4. PostgreSQL with TypeScript.
5. Database Connection Management.
6. Connection Pooling.
7. Type-Safe SQL Queries.
8. SQL Injection Prevention.
9. Database Transactions.
10. ORM Fundamentals.
11. Sequelize with TypeScript.
12. Sequelize Models.
13. Sequelize Model Types.
14. Sequelize Associations.
15. One-to-One Relationships.
16. One-to-Many Relationships.
17. Many-to-Many Relationships.
18. Sequelize Migrations.
19. Sequelize Transactions.
20. Sequelize Hooks.
21. Sequelize Scopes.
22. Prisma ORM.
23. Prisma Schema.
24. Prisma Client.
25. Prisma Relations.
26. Prisma Migrations.
27. Prisma Transactions.
28. Prisma Type Inference.
29. Repository Pattern with ORM.
30. Database Pagination and Filtering.
31. Type-Safe Database Services.
32. Database Error Handling.
33. Database Testing.
34. Production Database Architecture.

---

# 2. Introduction to Database Integration with TypeScript

A backend application usually needs to store and retrieve data.

For example, consider an application containing:

- Users.
- Products.
- Orders.
- Payments.
- Categories.
- Reviews.

You need a database to store this information permanently.

A typical architecture looks like this:

```text
Client
  |
  v
Express API
  |
  v
Controller
  |
  v
Service
  |
  v
Repository
  |
  v
Database Driver / ORM
  |
  v
Database
```

TypeScript provides compile-time type checking, while the database stores the actual data.

These are different responsibilities.

For example:

```ts
interface User {
    id: number;
    name: string;
    email: string;
}
```

This interface describes the expected structure of a user in TypeScript.

But it does not create a database table.

You still need SQL or an ORM to create and manage database structures.

## 2.1 What Is a Database Driver?

A database driver is a library that allows your application to communicate with a database.

Examples:

| Database | Common Node.js Driver |
|---|---|
| MySQL | `mysql2` |
| PostgreSQL | `pg` |
| MongoDB | `mongodb` |
| SQLite | `better-sqlite3` |

Example:

```bash
npm install mysql2
```

The driver allows Node.js to execute SQL queries against MySQL.

## 2.2 What Is an ORM?

ORM stands for Object-Relational Mapping.

An ORM maps relational database tables and records to objects and programming-language structures.

Without an ORM:

```sql
SELECT * FROM users WHERE id = 1;
```

With an ORM:

```ts
const user = await User.findByPk(1);
```

ORMs help reduce repetitive SQL code and provide abstractions for database operations.

Popular TypeScript-compatible ORMs:

- Sequelize.
- Prisma.
- TypeORM.
- Drizzle ORM.

We will focus primarily on Sequelize and Prisma.

---

# 3. Understanding Relational Database Structure

Before connecting TypeScript to a database, understand the fundamental relational database concepts.

Consider a `users` table:

| id | name | email |
|---:|---|---|
| 1 | John | john@example.com |
| 2 | David | david@example.com |
| 3 | Sarah | sarah@example.com |

This table contains three records.

## 3.1 Table

A table stores related information.

Example:

```text
users
products
orders
payments
```

## 3.2 Row

A row represents one record.

Example:

```text
1 | John | john@example.com
```

## 3.3 Column

A column represents a particular attribute.

Example:

```text
id
name
email
```

## 3.4 Primary Key

A primary key uniquely identifies each row.

```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150)
);
```

## 3.5 Foreign Key

A foreign key establishes a relationship between tables.

Example:

```sql
CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT,
    total DECIMAL(10, 2),

    FOREIGN KEY (user_id)
    REFERENCES users(id)
);
```

Here:

`orders.user_id` references `users.id`.

## 3.6 Database Relationships

There are three major relationship types.

| Relationship | Meaning | Example |
|---|---|---|
| One-to-One | One record relates to one record | User → Profile |
| One-to-Many | One record relates to multiple records | User → Orders |
| Many-to-Many | Multiple records relate to multiple records | Students ↔ Courses |

These relationships will become important when working with Sequelize and Prisma.

---

# 4. Connecting MySQL with TypeScript

Let's start with MySQL.

Install:

```bash
npm install mysql2
```

The `mysql2` package supports:

- MySQL connections.
- Connection pooling.
- Prepared statements.
- Promise-based queries.
- TypeScript declarations.

## 4.1 Create Database

Execute:

```sql
CREATE DATABASE typescript_app;

USE typescript_app;
```

Create a users table:

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    age INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 4.2 Configure Environment Variables

Create `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=typescript_app
```

Install dotenv:

```bash
npm install dotenv
```

Load environment variables:

```ts
import "dotenv/config";
```

Never hardcode production database credentials directly into source code.

## 4.3 Create Database Connection

Create:

```text
src/config/database.ts
```

Code:

```ts
import mysql from "mysql2/promise";

export const pool = mysql.createPool({
    host: process.env.DB_HOST,

    port: Number(process.env.DB_PORT ?? 3306),

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0
});
```

Here we use:

```ts
mysql.createPool()
```

instead of:

```ts
mysql.createConnection()
```

because a pool manages multiple database connections.

---

# 5. Understanding Connection Pooling

Connection pooling is an important database performance concept.

Without connection pooling, an application might create a new database connection for every request.

Example:

```ts
const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "typescript_app"
});
```

Repeatedly creating connections introduces overhead.

Instead, a connection pool maintains reusable connections.

```ts
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "typescript_app",
    connectionLimit: 10
});
```

When a request needs a connection:

1. The pool checks for an available connection.
2. If one is available, it provides it.
3. The query executes.
4. The connection becomes available for reuse.

Conceptually:

```text
              Connection Pool
             /       |       \
            /        |        \
       Connection Connection Connection
            \        |        /
             \       |       /
                 Database
```

## 5.1 Connection Pool Configuration

| Option | Purpose |
|---|---|
| `connectionLimit` | Maximum number of connections |
| `waitForConnections` | Wait when all connections are busy |
| `queueLimit` | Maximum queued connection requests |
| `host` | Database server |
| `port` | Database port |
| `user` | Database username |
| `password` | Database password |
| `database` | Database name |

The appropriate pool size depends on application concurrency, database capacity, and deployment architecture.

Do not independently configure a large pool in every application instance without considering the database's total connection limit.

## 5.2 Test Database Connection

```ts
import { pool } from "./database.js";

async function testConnection() {
    try {
        const connection = await pool.getConnection();

        console.log("Database connected successfully");

        connection.release();

    } catch (error) {
        console.error("Database connection failed", error);

        throw error;
    }
}

await testConnection();
```

Notice:

```ts
connection.release();
```

It returns the acquired connection to the pool.

When you use:

```ts
pool.query()
```

or:

```ts
pool.execute()
```

the pool manages connection acquisition and release for you.

---

# 6. Type-Safe SQL Queries with MySQL

Now let's execute SQL queries using TypeScript.

## 6.1 Define User Interface

```ts
interface User {
    id: number;
    name: string;
    email: string;
    age: number;
}
```

## 6.2 Fetch All Users

```ts
import { pool } from "../config/database.js";

async function getAllUsers(): Promise<User[]> {

    const [rows] = await pool.query(
        "SELECT id, name, email, age FROM users"
    );

    return rows as User[];
}
```

However, notice this:

```ts
rows as User[]
```

This is a TypeScript assertion.

It does not verify that the database actually returned the expected structure.

For stronger runtime guarantees, validate database results when the source or schema cannot be fully trusted.

## 6.3 Use Typed Query Results

The `mysql2` package supports generic query result typing.

```ts
import type {
    RowDataPacket
} from "mysql2";

interface UserRow extends RowDataPacket {
    id: number;
    name: string;
    email: string;
    age: number;
}
```

Query:

```ts
async function getAllUsers(): Promise<UserRow[]> {

    const [rows] = await pool.query<UserRow[]>(
        "SELECT id, name, email, age FROM users"
    );

    return rows;
}
```

This provides better type checking than an unrestricted assertion.

However, SQL result types still depend on your database schema, selected expressions, driver configuration, and runtime data.

---

# 7. INSERT Queries with TypeScript

Define:

```ts
interface CreateUserInput {
    name: string;
    email: string;
    age: number;
}
```

Create user:

```ts
async function createUser(
    input: CreateUserInput
) {

    const [result] = await pool.execute(
        `INSERT INTO users (name, email, age)
         VALUES (?, ?, ?)`,
        [
            input.name,
            input.email,
            input.age
        ]
    );

    return result;
}
```

The `?` placeholders represent parameterized query values.

This is important for SQL injection prevention.

## 7.1 Understanding Parameterized Queries

Unsafe approach:

```ts
const sql = `
    SELECT * FROM users
    WHERE email = '${email}'
`;
```

If an attacker supplies malicious input, the query may be manipulated.

Safer approach:

```ts
const [rows] = await pool.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
);
```

The database driver binds the value separately from the SQL statement.

**Important:** Parameter placeholders generally represent values, not table names or column identifiers. Dynamic identifiers should be selected from a strict allowlist.

---

# 8. UPDATE and DELETE Queries

## 8.1 Update User

```ts
async function updateUser(
    id: number,
    input: {
        name: string;
        email: string;
        age: number;
    }
) {

    const [result] = await pool.execute(
        `UPDATE users
         SET name = ?, email = ?, age = ?
         WHERE id = ?`,
        [
            input.name,
            input.email,
            input.age,
            id
        ]
    );

    return result;
}
```

## 8.2 Delete User

```ts
async function deleteUser(id: number) {

    const [result] = await pool.execute(
        "DELETE FROM users WHERE id = ?",
        [id]
    );

    return result;
}
```

## 8.3 Find User by ID

```ts
async function findUserById(
    id: number
): Promise<UserRow | undefined> {

    const [rows] = await pool.execute<UserRow[]>(
        "SELECT id, name, email, age FROM users WHERE id = ?",
        [id]
    );

    return rows[0];
}
```

---

# 9. Database Transactions with MySQL

A transaction groups multiple database operations into one logical unit.

Suppose you are transferring money between two accounts.

Account A has ₹10,000.

Account B has ₹5,000.

You transfer ₹2,000 from A to B.

Two operations must happen:

1. Deduct ₹2,000 from A.
2. Add ₹2,000 to B.

What happens if the first operation succeeds but the second fails?

The database could become inconsistent.

Transactions solve this problem.

## 9.1 ACID Properties

Transactions commonly follow four ACID properties.

| Property | Meaning |
|---|---|
| Atomicity | All operations succeed or none do |
| Consistency | Database rules remain valid |
| Isolation | Concurrent transactions are controlled |
| Durability | Committed changes persist |

## 9.2 MySQL Transaction Example

```ts
import { pool } from "../config/database.js";

async function transferMoney(
    fromAccount: number,
    toAccount: number,
    amount: number
) {

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();

        await connection.execute(
            `UPDATE accounts
             SET balance = balance - ?
             WHERE id = ?`,
            [amount, fromAccount]
        );

        await connection.execute(
            `UPDATE accounts
             SET balance = balance + ?
             WHERE id = ?`,
            [amount, toAccount]
        );

        await connection.commit();

        return {
            success: true
        };

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();
    }
}
```

This example illustrates transaction structure. A real money-transfer implementation must also verify account existence, sufficient funds, affected row counts, positive amounts, currency consistency, and appropriate locking or concurrency control.

## 9.3 Transaction Methods

| Method | Purpose |
|---|---|
| `beginTransaction()` | Start transaction |
| `commit()` | Permanently apply changes |
| `rollback()` | Undo uncommitted changes |
| `release()` | Return connection to pool |

**Important:** Always release manually acquired connections in a `finally` block.

---

# 10. Connecting PostgreSQL with TypeScript

PostgreSQL is another popular relational database.

Install:

```bash
npm install pg
```

Install TypeScript declarations if needed:

```bash
npm install -D @types/pg
```

## 10.1 Create PostgreSQL Database

```sql
CREATE DATABASE typescript_app;
```

Create table:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) UNIQUE NOT NULL,

    age INTEGER NOT NULL
);
```

Notice the difference:

MySQL:

```sql
AUTO_INCREMENT
```

PostgreSQL:

```sql
SERIAL
```

Modern PostgreSQL also supports identity columns:

```sql
id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY
```

## 10.2 Configure PostgreSQL Connection

Create:

```text
src/config/postgres.ts
```

Code:

```ts
import { Pool } from "pg";

export const pgPool = new Pool({
    host: process.env.DB_HOST,

    port: Number(process.env.DB_PORT ?? 5432),

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    max: 10,

    idleTimeoutMillis: 30000,

    connectionTimeoutMillis: 2000
});
```

PostgreSQL's `Pool` manages reusable database connections.

## 10.3 Test Connection

```ts
import { pgPool } from "./postgres.js";

async function testPostgresConnection() {

    try {

        const result = await pgPool.query(
            "SELECT NOW()"
        );

        console.log(result.rows[0]);

    } catch (error) {

        console.error(error);

        throw error;
    }
}
```

## 10.4 Query PostgreSQL

PostgreSQL uses `$1`, `$2`, etc. as parameter placeholders.

```ts
interface User {
    id: number;
    name: string;
    email: string;
    age: number;
}
```

Insert:

```ts
async function createUser(
    name: string,
    email: string,
    age: number
) {

    const result = await pgPool.query<User>(
        `INSERT INTO users (name, email, age)
         VALUES ($1, $2, $3)
         RETURNING id, name, email, age`,
        [name, email, age]
    );

    return result.rows[0];
}
```

Fetch:

```ts
async function getUsers() {

    const result = await pgPool.query<User>(
        "SELECT id, name, email, age FROM users"
    );

    return result.rows;
}
```

The generic on `pgPool.query<User>()` provides a compile-time result type. It does not perform runtime validation of the database result.

---

# 11. MySQL vs PostgreSQL

Both are relational database management systems.

| Feature | MySQL | PostgreSQL |
|---|---|---|
| Database Type | Relational | Relational |
| SQL Support | Yes | Yes |
| JSON Support | Yes | Yes |
| Transactions | Yes | Yes |
| Foreign Keys | Yes | Yes |
| Connection Pooling | Yes | Yes |
| Type System | Broad | Advanced |
| Common Driver | `mysql2` | `pg` |
| Default Port | 3306 | 5432 |
| Placeholder Style | `?` | `$1`, `$2` |

Both are suitable for professional backend development.

The right choice depends on your application's data model, operational requirements, ecosystem, and team experience.

---

# 12. What Is an ORM?

ORM stands for Object-Relational Mapping.

It connects object-oriented programming concepts with relational database structures.

Consider a database table:

```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150)
);
```

Without an ORM:

```ts
const [rows] = await pool.query(
    "SELECT * FROM users"
);
```

With an ORM:

```ts
const users = await User.findAll();
```

The ORM manages much of the database interaction.

## 12.1 ORM Responsibilities

An ORM commonly provides:

- Model definitions.
- CRUD operations.
- Relationship management.
- Query building.
- Migrations.
- Transactions.
- Data mapping.
- Type inference or model typing.

## 12.2 Popular TypeScript ORMs

| ORM | Main Characteristics |
|---|---|
| Sequelize | Mature ORM with model and association support |
| Prisma | Schema-driven ORM with generated TypeScript client |
| TypeORM | Decorator-oriented entity modeling |
| Drizzle | TypeScript-first SQL-oriented ORM |

In this phase, we will study Sequelize and Prisma in detail.

---

# 13. Sequelize with TypeScript

Sequelize is a popular Node.js ORM supporting relational databases such as:

- MySQL.
- PostgreSQL.
- MariaDB.
- SQLite.
- Microsoft SQL Server.

Install Sequelize for MySQL:

```bash
npm install sequelize mysql2
```

Sequelize has built-in TypeScript support through its model APIs and type definitions.

We will use the modern Sequelize model approach with `InferAttributes` and `InferCreationAttributes`.

## 13.1 Configure Sequelize

Create:

```text
src/config/sequelize.ts
```

Code:

```ts
import {
    Sequelize
} from "sequelize";

export const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASSWORD!,
    {
        host: process.env.DB_HOST,

        port: Number(process.env.DB_PORT ?? 3306),

        dialect: "mysql",

        logging: false,

        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);
```

The non-null assertion operator `!` tells TypeScript that the value is not null or undefined.

However, it does not check the value at runtime.

For production, validate environment variables during application startup.

---

# 14. Creating Sequelize Models with TypeScript

A model represents a database table.

Create:

```text
src/models/user.model.ts
```

Code:

```ts
import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional
} from "sequelize";

import { sequelize } from "../config/sequelize.js";

export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {

    declare id: CreationOptional<number>;

    declare name: string;

    declare email: string;

    declare age: number;

    declare createdAt: CreationOptional<Date>;

    declare updatedAt: CreationOptional<Date>;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true
        },

        age: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        createdAt: DataTypes.DATE,

        updatedAt: DataTypes.DATE
    },
    {
        sequelize,
        tableName: "users",
        timestamps: true
    }
);
```

Let's understand the important types.

## 14.1 `Model`

Base class for Sequelize models.

```ts
class User extends Model {
}
```

## 14.2 `InferAttributes`

Infers the attributes declared on your model class.

```ts
InferAttributes<User>
```

## 14.3 `InferCreationAttributes`

Infers the attributes required when creating a record.

## 14.4 `CreationOptional`

Marks an attribute as optional during record creation.

For example:

```ts
declare id: CreationOptional<number>;
```

The database generates the ID automatically.

Therefore, you do not need to provide it when creating a user.

---

# 15. Sequelize CRUD Operations

Once the model is defined, you can perform database operations.

## 15.1 Create User

```ts
const user = await User.create({
    name: "John",
    email: "john@example.com",
    age: 25
});
```

The `id` does not need to be supplied because it is generated automatically.

## 15.2 Find All Users

```ts
const users = await User.findAll();
```

## 15.3 Find User by Primary Key

```ts
const user = await User.findByPk(1);
```

This returns:

```ts
User | null
```

Always handle the possibility that the user does not exist.

```ts
const user = await User.findByPk(1);

if (!user) {
    throw new Error("User not found");
}
```

## 15.4 Find One User

```ts
const user = await User.findOne({
    where: {
        email: "john@example.com"
    }
});
```

## 15.5 Update User

```ts
const user = await User.findByPk(1);

if (!user) {
    throw new Error("User not found");
}

await user.update({
    name: "John Updated"
});
```

## 15.6 Delete User

```ts
const user = await User.findByPk(1);

if (!user) {
    throw new Error("User not found");
}

await user.destroy();
```

## 15.7 Bulk Update

```ts
await User.update(
    {
        age: 30
    },
    {
        where: {
            id: 1
        }
    }
);
```

## 15.8 Bulk Delete

```ts
await User.destroy({
    where: {
        age: {
            [Op.lt]: 18
        }
    }
});
```

Import:

```ts
import { Op } from "sequelize";
```

This example deletes users whose age is below 18. In a real application, ensure the operation is intentional and appropriately scoped.

---

# 16. Sequelize Query Operators

Sequelize provides operators for filtering records.

Import:

```ts
import { Op } from "sequelize";
```

## 16.1 Comparison Operators

```ts
const users = await User.findAll({
    where: {
        age: {
            [Op.gt]: 18
        }
    }
});
```

This means:

```sql
WHERE age > 18
```

Common operators:

| Sequelize Operator | SQL Meaning |
|---|---|
| `Op.eq` | Equal |
| `Op.ne` | Not equal |
| `Op.gt` | Greater than |
| `Op.gte` | Greater than or equal |
| `Op.lt` | Less than |
| `Op.lte` | Less than or equal |
| `Op.in` | IN |
| `Op.notIn` | NOT IN |
| `Op.like` | LIKE |
| `Op.between` | BETWEEN |
| `Op.is` | IS |

## 16.2 IN Operator

```ts
const users = await User.findAll({
    where: {
        id: {
            [Op.in]: [1, 2, 3]
        }
    }
});
```

Equivalent SQL:

```sql
SELECT *
FROM users
WHERE id IN (1, 2, 3);
```

## 16.3 LIKE Operator

```ts
const users = await User.findAll({
    where: {
        name: {
            [Op.like]: "%John%"
        }
    }
});
```

Equivalent SQL:

```sql
WHERE name LIKE '%John%'
```

## 16.4 AND Operator

```ts
const users = await User.findAll({
    where: {
        [Op.and]: [
            {
                age: {
                    [Op.gt]: 18
                }
            },
            {
                name: "John"
            }
        ]
    }
});
```

## 16.5 OR Operator

```ts
const users = await User.findAll({
    where: {
        [Op.or]: [
            {
                name: "John"
            },
            {
                name: "David"
            }
        ]
    }
});
```

---

# 17. Sequelize Associations

Associations define relationships between database models.

The four commonly used Sequelize association methods are:

```ts
hasOne()
belongsTo()
hasMany()
belongsToMany()
```

Let's understand each.

## 17.1 One-to-One Relationship

Example:

One user has one profile.

```text
users
-----
id
name

profiles
--------
id
userId
bio
```

Association:

```ts
User.hasOne(Profile, {
    foreignKey: "userId"
});

Profile.belongsTo(User, {
    foreignKey: "userId"
});
```

Meaning:

- A user has one profile.
- A profile belongs to one user.

## 17.2 One-to-Many Relationship

Example:

One user can have multiple orders.

```text
users
-----
id
name

orders
------
id
userId
total
```

Association:

```ts
User.hasMany(Order, {
    foreignKey: "userId"
});

Order.belongsTo(User, {
    foreignKey: "userId"
});
```

Meaning:

One user can have many orders.

Each order belongs to one user.

## 17.3 Many-to-Many Relationship

Example:

Students can enroll in multiple courses.

Courses can contain multiple students.

```text
students
--------
id
name

courses
-------
id
title

student_courses
---------------
studentId
courseId
```

Create association:

```ts
Student.belongsToMany(Course, {
    through: StudentCourse,
    foreignKey: "studentId"
});

Course.belongsToMany(Student, {
    through: StudentCourse,
    foreignKey: "courseId"
});
```

The `StudentCourse` model represents the junction table.

## 17.4 Association Summary

| Sequelize Method | Relationship |
|---|---|
| `hasOne()` | One-to-One |
| `belongsTo()` | Defines the model containing the foreign key relationship |
| `hasMany()` | One-to-Many |
| `belongsToMany()` | Many-to-Many |

A useful rule:

- `hasMany()` usually places the foreign key in the related table.
- `belongsTo()` identifies the model that references another model through a foreign key.
- `belongsToMany()` uses a junction table.

---

# 18. Sequelize Eager Loading

Eager loading allows you to retrieve associated records in a query.

Example:

```ts
const users = await User.findAll({
    include: [
        {
            model: Order
        }
    ]
});
```

Conceptually, Sequelize retrieves users and their related orders.

If you have:

```ts
User.hasMany(Order);
```

Then the result can include associated order data.

## 18.1 Aliased Associations

Association:

```ts
User.hasMany(Order, {
    as: "orders",
    foreignKey: "userId"
});
```

Query:

```ts
const users = await User.findAll({
    include: [
        {
            model: Order,
            as: "orders"
        }
    ]
});
```

The alias must match the association definition.

## 18.2 Nested Associations

```ts
const users = await User.findAll({
    include: [
        {
            model: Order,
            as: "orders",

            include: [
                {
                    model: Product,
                    as: "products"
                }
            ]
        }
    ]
});
```

This is useful for retrieving related records in a nested structure.

Be careful with eager loading large relationships because it can produce expensive queries and large result sets.

---

# 19. Sequelize Migrations

A migration is a version-controlled database schema change.

Instead of manually creating tables, you define schema changes in migration files.

Example:

```text
migrations/
    001-create-users.ts
    002-create-orders.ts
    003-add-age-to-users.ts
```

Sequelize commonly uses Sequelize CLI for migration workflows.

Install:

```bash
npm install -D sequelize-cli
```

A migration file generally contains two methods:

```ts
up()
down()
```

## 19.1 `up()`

Applies the migration.

Example:

```ts
await queryInterface.createTable("users", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    name: {
        type: Sequelize.STRING,
        allowNull: false
    },

    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
});
```

## 19.2 `down()`

Reverses the migration.

```ts
await queryInterface.dropTable("users");
```

## 19.3 Why Migrations Matter

Suppose your application has ten developers.

If each developer manually changes their local database, database structures may become inconsistent.

Migrations provide a version-controlled sequence of schema changes.

Benefits:

- Reproducible database changes.
- Easier deployment.
- Better team collaboration.
- Controlled schema evolution.
- Rollback support when appropriate.

**Important:** Sequelize CLI's standard generated migration templates are JavaScript-oriented. For a TypeScript project, configure an appropriate TypeScript migration workflow rather than assuming every `.ts` migration will execute automatically.

---

# 20. Sequelize Transactions

Sequelize supports managed and unmanaged transactions.

## 20.1 Managed Transaction

A managed transaction automatically commits when the callback succeeds and rolls back when it throws.

```ts
import { sequelize } from "../config/sequelize.js";

await sequelize.transaction(async (transaction) => {

    await Account.decrement("balance", {
        by: 2000,

        where: {
            id: 1
        },

        transaction
    });

    await Account.increment("balance", {
        by: 2000,

        where: {
            id: 2
        },

        transaction
    });

});
```

If the callback throws an error, Sequelize rolls back the transaction.

## 20.2 Unmanaged Transaction

```ts
const transaction = await sequelize.transaction();

try {

    await User.create(
        {
            name: "John",
            email: "john@example.com",
            age: 25
        },
        {
            transaction
        }
    );

    await transaction.commit();

} catch (error) {

    await transaction.rollback();

    throw error;
}
```

## 20.3 Managed vs Unmanaged

| Managed | Unmanaged |
|---|---|
| Sequelize handles commit/rollback | Developer handles commit/rollback |
| Uses callback | Explicit transaction object |
| Less boilerplate | More control |
| Good for most use cases | Useful for special workflows |

---

# 21. Sequelize Hooks

Hooks are functions executed at specific stages of model operations.

Examples:

- Before creating a user.
- After creating a user.
- Before updating a record.
- Before deleting a record.

## 21.1 Before Create Hook

```ts
User.beforeCreate(async (user) => {

    console.log("Creating user");

    user.name = user.name.trim();
});
```

## 21.2 After Create Hook

```ts
User.afterCreate(async (user) => {

    console.log("User created:", user.id);
});
```

## 21.3 Common Hooks

| Hook | Purpose |
|---|---|
| `beforeValidate` | Before validation |
| `afterValidate` | After validation |
| `beforeCreate` | Before insertion |
| `afterCreate` | After insertion |
| `beforeUpdate` | Before update |
| `afterUpdate` | After update |
| `beforeDestroy` | Before deletion |
| `afterDestroy` | After deletion |

Hooks are useful for model-level behavior, but avoid hiding important business workflows inside them. Explicit service logic is often easier to understand and test.

---

# 22. Sequelize Scopes

Scopes allow you to define reusable query conditions.

Example:

```ts
User.init(
    {
        // Attributes
    },
    {
        sequelize,

        scopes: {
            adults: {
                where: {
                    age: {
                        [Op.gte]: 18
                    }
                }
            },

            johnUsers: {
                where: {
                    name: "John"
                }
            }
        }
    }
);
```

Usage:

```ts
const users = await User.scope("adults").findAll();
```

Multiple scopes:

```ts
const users = await User.scope(
    "adults",
    "johnUsers"
).findAll();
```

Scopes help reuse common filtering logic.

---

# 23. Prisma ORM Introduction

Now let's study Prisma.

Prisma is a modern ORM with strong TypeScript integration.

It uses a schema file to define:

- Database models.
- Fields.
- Data types.
- Relationships.
- Constraints.
- Indexes.

Prisma generates a TypeScript client from this schema.

This generated client provides type-safe database operations.

## 23.1 Install Prisma

For a MySQL project, install:

```bash
npm install -D prisma

npm install @prisma/client
```

Initialize:

```bash
npx prisma init --datasource-provider mysql
```

This creates a Prisma configuration structure, including a schema file and environment configuration.

---

# 24. Prisma Schema

Open:

```text
prisma/schema.prisma
```

Example:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "mysql"
}
```

For a MySQL database, configure the connection URL through the Prisma configuration supported by your installed Prisma version.

A typical `.env` value:

```env
DATABASE_URL="mysql://root:password@localhost:3306/typescript_app"
```

**Version note:** Prisma configuration has evolved. Recent Prisma versions use `prisma.config.ts` for certain datasource configuration settings, while older Prisma 6 projects commonly declare `url = env("DATABASE_URL")` inside the datasource block. Follow the configuration generated by the version installed in your project.

## 24.1 Define User Model

```prisma
model User {
  id        Int      @id @default(autoincrement())

  name      String

  email     String   @unique

  age       Int

  createdAt DateTime @default(now())

  updatedAt DateTime @updatedAt
}
```

Let's understand these fields.

| Prisma Attribute | Meaning |
|---|---|
| `@id` | Primary key |
| `@default()` | Default value |
| `@unique` | Unique constraint |
| `@updatedAt` | Automatically updates timestamp |
| `@relation` | Defines a relationship |
| `@@index` | Defines an index |

---

# 25. Prisma Client Generation

After defining your schema, generate the Prisma Client.

```bash
npx prisma generate
```

Depending on your Prisma version and generator configuration, generated files are placed in the configured output directory.

The Prisma Client gives you TypeScript-aware database operations.

Example:

```ts
import {
    PrismaClient
} from "./generated/prisma/client.js";

const prisma = new PrismaClient();
```

Use a single shared Prisma Client instance in a typical long-running application rather than creating a new instance for every HTTP request.

## 25.1 Database Migration

Create a migration:

```bash
npx prisma migrate dev --name init
```

This command:

1. Detects schema changes.
2. Creates a migration.
3. Applies the migration to the development database.
4. Regenerates the Prisma Client when needed.

For production:

```bash
npx prisma migrate deploy
```

Production deployments should apply committed migrations, not use development migration commands.

---

# 26. Prisma CRUD Operations

Let's perform database operations.

## 26.1 Create User

```ts
const user = await prisma.user.create({
    data: {
        name: "John",
        email: "john@example.com",
        age: 25
    }
});
```

Notice that TypeScript understands the expected fields.

For example, omitting a required field produces a TypeScript error.

## 26.2 Find All Users

```ts
const users = await prisma.user.findMany();
```

## 26.3 Find User by ID

```ts
const user = await prisma.user.findUnique({
    where: {
        id: 1
    }
});
```

This returns a user or `null`.

## 26.4 Find First User

```ts
const user = await prisma.user.findFirst({
    where: {
        age: {
            gt: 18
        }
    }
});
```

## 26.5 Update User

```ts
const user = await prisma.user.update({
    where: {
        id: 1
    },

    data: {
        name: "Updated John"
    }
});
```

`update()` throws if the record does not exist.

## 26.6 Delete User

```ts
const user = await prisma.user.delete({
    where: {
        id: 1
    }
});
```

## 26.7 Upsert

Upsert means:

- Update if the record exists.
- Create if it does not exist.

```ts
const user = await prisma.user.upsert({
    where: {
        email: "john@example.com"
    },

    update: {
        name: "John Updated"
    },

    create: {
        name: "John",
        email: "john@example.com",
        age: 25
    }
});
```

---

# 27. Prisma Filtering and Sorting

Prisma provides a type-safe query API.

## 27.1 Filtering

```ts
const users = await prisma.user.findMany({
    where: {
        age: {
            gt: 18
        }
    }
});
```

Equivalent SQL concept:

```sql
SELECT *
FROM users
WHERE age > 18;
```

## 27.2 Multiple Conditions

```ts
const users = await prisma.user.findMany({
    where: {
        AND: [
            {
                age: {
                    gt: 18
                }
            },
            {
                name: {
                    contains: "John"
                }
            }
        ]
    }
});
```

## 27.3 OR Conditions

```ts
const users = await prisma.user.findMany({
    where: {
        OR: [
            {
                name: "John"
            },
            {
                name: "David"
            }
        ]
    }
});
```

## 27.4 Sorting

```ts
const users = await prisma.user.findMany({
    orderBy: {
        createdAt: "desc"
    }
});
```

## 27.5 Pagination

```ts
const users = await prisma.user.findMany({
    skip: 10,
    take: 10
});
```

This retrieves ten records after skipping the first ten.

---

# 28. Prisma Relationships

Let's understand how Prisma represents database relationships.

## 28.1 One-to-One Relationship

Example:

One user has one profile.

```prisma
model User {
  id      Int      @id @default(autoincrement())

  name    String

  profile Profile?
}

model Profile {
  id     Int    @id @default(autoincrement())

  bio    String

  userId Int    @unique

  user   User   @relation(fields: [userId], references: [id])
}
```

The `@unique` constraint on `userId` ensures that one user cannot have multiple profiles through this relation.

## 28.2 One-to-Many Relationship

One user can have multiple orders.

```prisma
model User {
  id     Int     @id @default(autoincrement())

  name   String

  orders Order[]
}

model Order {
  id     Int    @id @default(autoincrement())

  total  Float

  userId Int

  user   User   @relation(fields: [userId], references: [id])
}
```

Here:

```prisma
orders Order[]
```

means a user can have multiple orders.

## 28.3 Many-to-Many Relationship

Example:

Students can enroll in multiple courses.

```prisma
model Student {
  id      Int      @id @default(autoincrement())

  name    String

  courses Course[]
}

model Course {
  id       Int       @id @default(autoincrement())

  title    String

  students Student[]
}
```

Prisma supports implicit many-to-many relationships when the junction table does not need additional fields.

If the relationship requires additional data, such as enrollment date or grade, use an explicit junction model.

Example:

```prisma
model Student {
  id          Int               @id @default(autoincrement())

  name        String

  enrollments StudentCourse[]
}

model Course {
  id          Int               @id @default(autoincrement())

  title       String

  enrollments StudentCourse[]
}

model StudentCourse {
  studentId  Int

  courseId   Int

  enrolledAt DateTime @default(now())

  student    Student @relation(fields: [studentId], references: [id])

  course     Course  @relation(fields: [courseId], references: [id])

  @@id([studentId, courseId])
}
```

---

# 29. Prisma Relations and Include

Suppose you want to fetch a user with all their orders.

```ts
const user = await prisma.user.findUnique({
    where: {
        id: 1
    },

    include: {
        orders: true
    }
});
```

The result contains:

```ts
{
    id: 1,
    name: "John",
    orders: [
        {
            id: 101,
            total: 500
        },
        {
            id: 102,
            total: 1000
        }
    ]
}
```

The exact generated result type is inferred from the query.

This is one of Prisma's major TypeScript advantages.

## 29.1 Select Specific Fields

Instead of returning every field:

```ts
const users = await prisma.user.findMany({
    select: {
        id: true,
        name: true,
        email: true
    }
});
```

The result type contains only the selected fields.

This is particularly useful for building API response DTOs.

---

# 30. Prisma Transactions

Prisma supports database transactions.

There are two commonly used approaches.

## 30.1 Sequential Transaction

Use `$transaction()` with an array of operations.

```ts
const [user, profile] = await prisma.$transaction([
    prisma.user.create({
        data: {
            name: "John",
            email: "john@example.com",
            age: 25
        }
    }),

    prisma.profile.create({
        data: {
            bio: "Software Developer",
            userId: 1
        }
    })
]);
```

This is a conceptual example. The second operation must reference the actual newly created user ID; a fixed ID such as `1` is not reliable.

## 30.2 Interactive Transaction

Use a callback when later operations depend on earlier results.

```ts
await prisma.$transaction(async (tx) => {

    const user = await tx.user.create({
        data: {
            name: "John",
            email: "john@example.com",
            age: 25
        }
    });

    await tx.profile.create({
        data: {
            bio: "Developer",
            userId: user.id
        }
    });

});
```

If an operation throws, Prisma rolls back the transaction.

## 30.3 When Should You Use Transactions?

Use transactions when multiple related operations must succeed or fail together.

Examples:

- Money transfers.
- Creating an order and its items.
- Creating a user and associated profile.
- Updating inventory and order records.
- Financial ledger entries.

Transactions do not automatically solve every concurrency problem. For complex workflows, also consider isolation levels, locking, unique constraints, and retry behavior.

---

# 31. Prisma Type Inference

One of Prisma's strongest features is generated TypeScript types.

Consider:

```ts
const users = await prisma.user.findMany();
```

Prisma automatically infers the result type.

You do not have to manually declare every result interface.

## 31.1 Select-Based Type Inference

```ts
const user = await prisma.user.findFirst({
    select: {
        id: true,
        name: true
    }
});
```

TypeScript knows that the result includes only:

```ts
{
    id: number;
    name: string;
}
```

or `null`.

## 31.2 Include-Based Type Inference

```ts
const user = await prisma.user.findFirst({
    include: {
        orders: true
    }
});
```

The inferred type includes the user's orders.

## 31.3 Reusable Prisma Types

Prisma provides utility types for extracting types from query structures.

Example:

```ts
import {
    Prisma
} from "./generated/prisma/client.js";

const userWithOrders = {
    include: {
        orders: true
    }
} satisfies Prisma.UserDefaultArgs;
```

Extract result type:

```ts
type UserWithOrders =
    Prisma.UserGetPayload<typeof userWithOrders>;
```

This allows you to create reusable query definitions and corresponding inferred types.

---

# 32. Sequelize vs Prisma

Both are capable ORM solutions, but their approaches differ.

| Feature | Sequelize | Prisma |
|---|---|---|
| Approach | Model-based ORM | Schema-driven ORM |
| Model Definition | TypeScript classes and model initialization | Prisma schema |
| Type Generation | Model typings and inference | Generated TypeScript client |
| Query Style | Model methods and operators | Generated query API |
| Associations | Explicit association methods | Schema relations |
| Migrations | Migration files | Prisma Migrate |
| SQL Access | Raw queries supported | Raw queries supported |
| Type Inference | Good with correct model definitions | Strong generated inference |
| Learning Curve | Familiar to traditional ORM users | Requires learning Prisma schema |
| Database Support | Multiple relational databases | Multiple supported databases |

## 32.1 When to Choose Sequelize?

Sequelize can be suitable when:

- You already have a Sequelize-based application.
- Your team understands its model and association system.
- You want a mature ORM with established Node.js conventions.
- You need to maintain an existing Sequelize codebase.

## 32.2 When to Choose Prisma?

Prisma can be suitable when:

- You want generated TypeScript database types.
- You prefer schema-first database modeling.
- You want a structured query API.
- You want convenient relation handling.
- You are starting a new TypeScript backend project.

Neither ORM is universally better. Choose based on project requirements and ecosystem compatibility.

---

# 33. Repository Pattern with TypeScript and ORM

The Repository Pattern separates database access from business logic.

Suppose you use Prisma.

Instead of directly accessing Prisma inside your controller, create a repository.

## 33.1 Define Repository Interface

```ts
interface User {
    id: number;
    name: string;
    email: string;
    age: number;
}

interface CreateUserInput {
    name: string;
    email: string;
    age: number;
}

interface IUserRepository {

    findAll(): Promise<User[]>;

    findById(id: number): Promise<User | null>;

    create(input: CreateUserInput): Promise<User>;

    delete(id: number): Promise<User>;
}
```

## 33.2 Implement Repository with Prisma

```ts
class PrismaUserRepository implements IUserRepository {

    async findAll(): Promise<User[]> {

        return prisma.user.findMany();
    }

    async findById(id: number): Promise<User | null> {

        return prisma.user.findUnique({
            where: {
                id
            }
        });
    }

    async create(
        input: CreateUserInput
    ): Promise<User> {

        return prisma.user.create({
            data: input
        });
    }

    async delete(id: number): Promise<User> {

        return prisma.user.delete({
            where: {
                id
            }
        });
    }
}
```

## 33.3 Implement Service

```ts
class UserService {

    constructor(
        private readonly repository: IUserRepository
    ) {}

    async getUsers() {

        return this.repository.findAll();
    }

    async getUser(id: number) {

        const user = await this.repository.findById(id);

        if (!user) {
            throw new AppError(404, "User not found");
        }

        return user;
    }

    async createUser(input: CreateUserInput) {

        return this.repository.create(input);
    }

    async deleteUser(id: number) {

        const user = await this.repository.findById(id);

        if (!user) {
            throw new AppError(404, "User not found");
        }

        return this.repository.delete(id);
    }
}
```

## 33.4 Inject Dependencies

```ts
const userRepository = new PrismaUserRepository();

const userService = new UserService(userRepository);
```

Now the service depends on an abstraction rather than directly depending on Prisma.

You can replace the repository implementation without changing the service interface.

---

# 34. Type-Safe Pagination with Prisma

Pagination is commonly required in REST APIs.

Consider:

```text
GET /api/users?page=2&limit=10
```

Create:

```ts
interface PaginationInput {
    page: number;
    limit: number;
}
```

Implement:

```ts
async function getUsers(
    input: PaginationInput
) {

    const page = Math.max(1, input.page);

    const limit = Math.min(
        100,
        Math.max(1, input.limit)
    );

    const skip = (page - 1) * limit;

    const [users, total] = await prisma.$transaction([

        prisma.user.findMany({
            skip,
            take: limit,
            orderBy: {
                id: "asc"
            }
        }),

        prisma.user.count()
    ]);

    return {
        users,

        pagination: {
            page,
            limit,
            totalRecords: total,
            totalPages: Math.ceil(total / limit)
        }
    };
}
```

The transaction ensures both queries execute as one transaction, but under common isolation levels it does not necessarily guarantee that the count and page represent exactly the same snapshot under concurrent writes.

For stricter consistency, choose an appropriate transaction isolation level supported by your database.

---

# 35. Database Error Handling

Database operations can fail for many reasons.

Examples:

- Duplicate email.
- Foreign key constraint failure.
- Database unavailable.
- Record not found.
- Invalid query.
- Transaction failure.
- Connection timeout.

Your application should handle these errors consistently.

## 35.1 Prisma Error Handling

Prisma provides known request error classes.

Example:

```ts
import {
    Prisma
} from "./generated/prisma/client.js";

try {

    const user = await prisma.user.create({
        data: {
            name: "John",
            email: "john@example.com",
            age: 25
        }
    });

} catch (error) {

    if (
        error instanceof
        Prisma.PrismaClientKnownRequestError
    ) {

        if (error.code === "P2002") {
            throw new AppError(
                409,
                "Email already exists"
            );
        }
    }

    throw error;
}
```

Common Prisma error codes:

| Code | Meaning |
|---|---|
| `P2002` | Unique constraint violation |
| `P2003` | Foreign key constraint violation |
| `P2025` | Required record not found |
| `P1001` | Cannot reach database server |

The exact behavior and available error types can depend on the Prisma version and operation.

## 35.2 Sequelize Error Handling

Sequelize provides database-related error classes.

Example:

```ts
import {
    UniqueConstraintError,
    ForeignKeyConstraintError
} from "sequelize";

try {

    await User.create({
        name: "John",
        email: "john@example.com",
        age: 25
    });

} catch (error) {

    if (error instanceof UniqueConstraintError) {
        throw new AppError(
            409,
            "Email already exists"
        );
    }

    if (error instanceof ForeignKeyConstraintError) {
        throw new AppError(
            400,
            "Invalid relationship"
        );
    }

    throw error;
}
```

---

# 36. Database Testing

Database testing is important because database operations can behave differently from mocked functions.

Common testing approaches:

1. Unit tests with mocked repositories.
2. Integration tests with a real test database.
3. Transaction-based test isolation.
4. Test containers or dedicated database instances.

## 36.1 Mock Repository for Unit Testing

```ts
const mockRepository: IUserRepository = {

    async findAll() {
        return [];
    },

    async findById(id) {
        return {
            id,
            name: "John",
            email: "john@example.com",
            age: 25
        };
    },

    async create(input) {
        return {
            id: 1,
            ...input
        };
    },

    async delete(id) {
        return {
            id,
            name: "John",
            email: "john@example.com",
            age: 25
        };
    }
};
```

Create service:

```ts
const userService = new UserService(mockRepository);
```

Now you can test business logic without requiring a database.

## 36.2 Integration Testing

For database integration testing:

- Create a separate test database.
- Apply migrations.
- Insert test data.
- Execute actual database queries.
- Verify returned records.
- Clean up test data.

Never run destructive integration tests against your production database.

---

# 37. Production Database Architecture

A professional TypeScript backend should have a structured database layer.

Recommended structure:

```text
src/
│
├── config/
│   ├── env.ts
│   └── database.ts
│
├── modules/
│   │
│   └── user/
│       ├── user.types.ts
│       ├── user.schema.ts
│       ├── user.repository.ts
│       ├── user.service.ts
│       ├── user.controller.ts
│       └── user.routes.ts
│
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── prisma/
│
├── middlewares/
│   └── error.middleware.ts
│
├── utils/
│   └── app-error.ts
│
├── app.ts
└── server.ts
```

## 37.1 Important Production Practices

### Connection Management

- Use connection pools.
- Configure pool limits.
- Handle connection failures.
- Avoid creating connections per request.
- Close database resources during graceful shutdown.

### Database Security

- Use parameterized queries.
- Validate incoming data.
- Use least-privilege database credentials.
- Avoid exposing credentials in source code.
- Restrict database network access.
- Protect sensitive database fields.

### Performance

- Add appropriate indexes.
- Avoid unnecessary queries.
- Use pagination.
- Select only required columns.
- Avoid N+1 query problems.
- Monitor slow queries.
- Use transactions where needed.

### Database Maintenance

- Use migrations.
- Maintain backups.
- Monitor database health.
- Review schema changes.
- Test migrations before production deployment.

---

# 38. Understanding the N+1 Query Problem

The N+1 query problem is a common ORM performance issue.

Suppose you fetch ten users:

```ts
const users = await User.findAll();
```

Then fetch each user's orders separately:

```ts
for (const user of users) {

    const orders = await Order.findAll({
        where: {
            userId: user.id
        }
    });
}
```

This produces:

- 1 query to fetch users.
- 10 additional queries to fetch orders.

Total:

```text
1 + 10 = 11 queries
```

This is the N+1 query problem.

## 38.1 Solution: Eager Loading

With Sequelize:

```ts
const users = await User.findAll({
    include: [
        {
            model: Order,
            as: "orders"
        }
    ]
});
```

With Prisma:

```ts
const users = await prisma.user.findMany({
    include: {
        orders: true
    }
});
```

Both approaches retrieve related data through fewer database operations, though the generated SQL and execution plan depend on the ORM and query.

---

# 39. Common Database and ORM Mistakes

| Mistake | Problem | Better Approach |
|---|---|---|
| Creating a connection for every request | Connection overhead | Use connection pooling |
| Using SQL string concatenation | SQL injection risk | Use parameterized queries |
| Trusting TypeScript assertions | Runtime data may differ | Validate external data |
| Forgetting transactions | Partial updates can occur | Use transactions for atomic workflows |
| Returning every database column | May expose sensitive data | Select required fields |
| Ignoring indexes | Slow queries | Add appropriate indexes |
| Using ORM without understanding SQL | Poor query performance | Understand generated SQL |
| Creating Prisma Client per request | Resource waste | Reuse a shared client |
| Forgetting connection cleanup | Resource leaks | Implement graceful shutdown |
| Running migrations manually | Schema inconsistency | Version-control migrations |
| Using excessive eager loading | Large queries and memory use | Load only required relationships |
| Ignoring N+1 queries | Excessive database calls | Use eager loading or batching |
| Trusting ORM types as runtime validation | Types do not validate external data | Use runtime validation |
| Using floating-point money values | Precision errors | Use DECIMAL or integer minor units |
| Ignoring transaction isolation | Concurrency anomalies | Understand isolation and locking |

---

# 40. Advanced Database Interview Questions and Answers

### Q1. What is a database driver?

A database driver is a library that allows an application to communicate with a database.

### Q2. What is an ORM?

ORM stands for Object-Relational Mapping. It maps relational database structures to programming-language objects and operations.

### Q3. What is the difference between a database driver and an ORM?

A driver provides low-level database communication, while an ORM provides higher-level abstractions such as models, relationships, and CRUD operations.

### Q4. What is connection pooling?

Connection pooling manages reusable database connections to reduce connection creation overhead.

### Q5. Why should we use connection pooling?

It improves resource utilization and helps applications handle concurrent database requests efficiently.

### Q6. What is SQL injection?

SQL injection is an attack where malicious input changes the intended structure or behavior of an SQL query.

### Q7. How can SQL injection be prevented?

Use parameterized queries, prepared statements, safe query builders, and strict validation of dynamic SQL identifiers.

### Q8. What are transactions?

Transactions group multiple database operations into a single logical unit.

### Q9. What are ACID properties?

Atomicity, Consistency, Isolation, and Durability.

### Q10. What is a primary key?

A primary key uniquely identifies a record in a table.

### Q11. What is a foreign key?

A foreign key establishes a relationship between records in different tables.

### Q12. What is an ORM model?

An ORM model represents a database table and defines its attributes and behavior.

### Q13. What is Sequelize?

Sequelize is a Node.js ORM supporting several relational databases.

### Q14. What is Prisma?

Prisma is a schema-driven ORM that generates a type-safe database client.

### Q15. What is the difference between Sequelize and Prisma?

Sequelize primarily uses model definitions and model methods, while Prisma uses a schema-driven generated client.

### Q16. What is `InferAttributes` in Sequelize?

It is a Sequelize utility type that infers model attributes from a model class.

### Q17. What is `CreationOptional`?

It marks an attribute as optional during Sequelize model creation.

### Q18. What is `findByPk()`?

It retrieves a Sequelize record using its primary key.

### Q19. What is eager loading?

Eager loading retrieves associated records as part of a query rather than fetching each relationship separately.

### Q20. What is the N+1 query problem?

It occurs when an application executes one query to fetch parent records and additional queries for each parent record's relationships.

### Q21. What is a migration?

A migration is a version-controlled database schema change.

### Q22. What is the difference between `up()` and `down()` in migrations?

`up()` applies a migration, while `down()` attempts to reverse it.

### Q23. What is a Sequelize hook?

A hook is a function executed at a particular stage of a Sequelize model operation.

### Q24. What is a Sequelize scope?

A scope is a reusable query configuration containing conditions or other query options.

### Q25. What is `belongsTo()`?

It defines an association where the current model references another model through a foreign key relationship.

### Q26. What is `hasMany()`?

It defines a one-to-many relationship.

### Q27. What is `belongsToMany()`?

It defines a many-to-many relationship through a junction table.

### Q28. What is Prisma Client?

Prisma Client is a generated TypeScript/JavaScript database client based on the Prisma schema.

### Q29. What is Prisma Migrate?

It is Prisma's database migration system.

### Q30. What is `prisma generate`?

It generates Prisma Client code based on the configured Prisma schema.

### Q31. What is `findUnique()`?

It retrieves a record using a unique field or unique constraint.

### Q32. What is `upsert()`?

It updates a record if it exists or creates it if it does not.

### Q33. What is the purpose of Prisma `include`?

It retrieves related records along with the main record.

### Q34. What is the purpose of Prisma `select`?

It retrieves only the specified fields.

### Q35. What is the difference between `select` and `include`?

`select` chooses specific fields and relations to return. `include` adds related records while retaining the model's default scalar fields.

### Q36. What is a repository pattern?

It abstracts data-access operations behind a dedicated interface or module.

### Q37. Why use a repository pattern with an ORM?

It separates business logic from persistence details and can improve testability.

### Q38. What is cursor-based pagination?

It uses a stable cursor to retrieve the next or previous set of records.

### Q39. What is database indexing?

An index is a data structure that helps the database find records more efficiently.

### Q40. What is a composite index?

A composite index contains multiple columns.

### Q41. What is a unique constraint?

It ensures that duplicate values are not allowed for the constrained column or column combination.

### Q42. What is the difference between SQL and an ORM?

SQL is a database query language. An ORM is a programming abstraction that can generate or execute SQL.

### Q43. Why should you understand SQL even when using an ORM?

Because ORM operations ultimately interact with the database, and understanding SQL helps diagnose performance and correctness issues.

### Q44. What is database normalization?

Normalization organizes relational data to reduce unnecessary duplication and improve data integrity.

### Q45. What is denormalization?

Denormalization intentionally introduces some redundancy to improve particular read or reporting workloads.

### Q46. What is a database connection leak?

It occurs when acquired connections are not properly returned or released.

### Q47. Why should database clients be reused?

Reusing clients avoids unnecessary connection management overhead and helps control resource usage.

### Q48. What is the purpose of a database transaction isolation level?

It determines how concurrent transactions can observe each other's changes.

### Q49. What is the difference between `DELETE` and `TRUNCATE`?

`DELETE` removes selected rows and supports a `WHERE` clause. `TRUNCATE` removes all rows from a table using database-specific semantics.

### Q50. What is the purpose of database migrations in production?

They provide a controlled and reproducible process for evolving database schemas across environments.

---

# 41. Practical Exercises

Complete these exercises to strengthen your understanding.

## Beginner – Database Fundamentals

**Exercise 1:** Connect a TypeScript application to MySQL.

**Exercise 2:** Create a users table.

**Exercise 3:** Implement INSERT, SELECT, UPDATE, and DELETE using `mysql2`.

**Exercise 4:** Implement parameterized SQL queries.

**Exercise 5:** Connect a TypeScript application to PostgreSQL.

**Exercise 6:** Implement connection pooling.

## Intermediate – Database Operations

**Exercise 7:** Implement database transactions.

**Exercise 8:** Create a Sequelize configuration.

**Exercise 9:** Create Sequelize User and Product models.

**Exercise 10:** Implement Sequelize CRUD operations.

**Exercise 11:** Implement Sequelize query operators.

**Exercise 12:** Create one-to-one relationships.

**Exercise 13:** Create one-to-many relationships.

**Exercise 14:** Create many-to-many relationships.

**Exercise 15:** Implement Sequelize eager loading.

**Exercise 16:** Create and execute database migrations.

## Advanced – Prisma ORM

**Exercise 17:** Initialize a Prisma project.

**Exercise 18:** Create User, Product, and Order models.

**Exercise 19:** Generate Prisma Client.

**Exercise 20:** Implement Prisma CRUD operations.

**Exercise 21:** Implement Prisma filtering and sorting.

**Exercise 22:** Implement Prisma relationships.

**Exercise 23:** Implement Prisma migrations.

**Exercise 24:** Implement Prisma transactions.

**Exercise 25:** Implement Prisma pagination.

## Expert – Production Database Architecture

**Exercise 26:** Implement Repository Pattern with Prisma.

**Exercise 27:** Integrate Prisma with Express.js.

**Exercise 28:** Implement database error handling.

**Exercise 29:** Implement database integration testing.

**Exercise 30:** Solve the N+1 query problem.

**Exercise 31:** Implement a complete User Management API using TypeScript, Express, Prisma, and MySQL.

**Exercise 32:** Implement a complete E-commerce API with users, products, categories, orders, and order items.

---

# 42. Phase 49 Completion Checklist

| No. | Topic | Expected Knowledge |
|---|---|---|
| 1 | Database Fundamentals | Understand relational databases |
| 2 | MySQL | Connect TypeScript with MySQL |
| 3 | PostgreSQL | Connect TypeScript with PostgreSQL |
| 4 | Database Drivers | Understand driver functionality |
| 5 | Connection Pooling | Manage reusable connections |
| 6 | SQL Queries | Execute type-aware queries |
| 7 | Parameterized Queries | Prevent SQL injection |
| 8 | Transactions | Implement ACID workflows |
| 9 | ORM | Understand ORM fundamentals |
| 10 | Sequelize | Configure Sequelize |
| 11 | Sequelize Models | Define typed models |
| 12 | Sequelize CRUD | Implement database operations |
| 13 | Sequelize Operators | Implement complex filtering |
| 14 | Sequelize Associations | Define relationships |
| 15 | Eager Loading | Fetch related records |
| 16 | Migrations | Manage schema changes |
| 17 | Hooks | Implement model lifecycle behavior |
| 18 | Scopes | Create reusable query conditions |
| 19 | Prisma | Understand Prisma architecture |
| 20 | Prisma Schema | Define database models |
| 21 | Prisma Client | Generate database client |
| 22 | Prisma CRUD | Implement database operations |
| 23 | Prisma Relations | Define model relationships |
| 24 | Prisma Transactions | Execute atomic operations |
| 25 | Type Inference | Use generated database types |
| 26 | Repository Pattern | Separate data-access logic |
| 27 | Pagination | Retrieve data efficiently |
| 28 | Error Handling | Handle database errors |
| 29 | Database Testing | Test persistence operations |
| 30 | Production Architecture | Build maintainable database layers |

---

# 43. What Comes Next?

You now understand how TypeScript applications communicate with relational databases, how to use SQL drivers, and how to build type-safe database access layers using Sequelize and Prisma.

The next phase will move into advanced database architecture and performance.

## Phase 50: Advanced TypeScript – Database Architecture, Advanced SQL, Query Optimization, Indexing, Caching, Redis and Data Management

Upcoming topics:

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

**Phase 49 is complete.**