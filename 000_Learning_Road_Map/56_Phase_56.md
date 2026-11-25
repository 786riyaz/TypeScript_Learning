# Phase 56: Advanced TypeScript – System Design, High-Level Design (HLD), Low-Level Design (LLD), Scalability, Caching, Database Sharding, Replication, CDN, Performance Optimization and Production Architecture

**Level:** Expert / Advanced System Design & Backend Engineering  
**Prerequisites:** TypeScript, JavaScript, Node.js, Express.js, SQL, MongoDB, Redis, REST APIs, Microservices, Message Queues, Docker and distributed systems.

---

# 1. Learning Objectives

By the end of this phase, you will understand how to:

1. Understand system design fundamentals.
2. Differentiate High-Level Design (HLD) and Low-Level Design (LLD).
3. Gather functional and non-functional requirements.
4. Design scalable backend architectures.
5. Understand vertical and horizontal scaling.
6. Design stateless and stateful systems.
7. Understand database replication and sharding.
8. Understand database partitioning and indexing.
9. Implement distributed caching using Redis.
10. Understand Cache-Aside, Write-Through and Write-Behind patterns.
11. Handle cache invalidation.
12. Understand Content Delivery Networks (CDNs).
13. Design load balancing strategies.
14. Optimize database connection pooling.
15. Implement read/write separation.
16. Design high-availability systems.
17. Understand fault tolerance and disaster recovery.
18. Optimize application performance.
19. Design URL shorteners, e-commerce platforms and chat applications.
20. Design production-ready systems using TypeScript and Node.js.

---

# 2. What Is System Design?

System Design is the process of defining the architecture, components, databases, communication mechanisms and infrastructure required to build a software system.

It answers questions such as:

- How will the application handle millions of users?
- Which database should we use?
- How will services communicate?
- How will we handle failures?
- How will we scale the application?
- How will we store and retrieve data efficiently?
- How will we protect the system from high traffic?
- How will we ensure high availability?

### Example: Expense Tracker Application

Suppose you want to build an expense tracker.

Initially, it may look like this:

```text
Frontend
   |
   v
Node.js API
   |
   v
MySQL Database
```

This architecture may be sufficient for a small application.

But imagine the application grows to:

- 10 million registered users.
- 1 million daily active users.
- 100,000 concurrent users.
- Millions of expense records.
- Thousands of API requests per second.

The original architecture may no longer be sufficient.

You may need:

- Load balancers.
- Multiple application servers.
- Redis caching.
- Database replication.
- Database partitioning.
- Message queues.
- CDN.
- Monitoring infrastructure.

System design helps you decide when and how to introduce these components.

---

# 3. Types of System Design

System design is commonly divided into two major categories.

1. High-Level Design (HLD).
2. Low-Level Design (LLD).

## 3.1 High-Level Design (HLD)

HLD describes the overall architecture of the system.

It focuses on major components and how they communicate.

Example:

```text
                 Client
                   |
                   v
              Load Balancer
                   |
          ┌────────┼────────┐
          |        |        |
          v        v        v
       Server 1 Server 2 Server 3
          |        |        |
          └────────┼────────┘
                   |
                   v
                 Redis
                   |
                   v
              MySQL Database
```

HLD answers questions such as:

- Which services are required?
- Which database should be used?
- How will services communicate?
- How will the system scale?
- Where will caching be implemented?
- How will failures be handled?

### HLD Components

| Component | Purpose |
|---|---|
| Client | Sends requests |
| Load Balancer | Distributes traffic |
| API Gateway | Routes requests |
| Application Server | Executes business logic |
| Database | Stores persistent data |
| Cache | Stores frequently accessed data |
| Message Broker | Handles asynchronous communication |
| CDN | Delivers static content |
| Object Storage | Stores files |
| Monitoring | Tracks system health |

## 3.2 Low-Level Design (LLD)

LLD describes the internal implementation of individual components.

It focuses on:

- Classes.
- Interfaces.
- Functions.
- Database schemas.
- Design patterns.
- Relationships.
- Business logic.
- API contracts.

Example:

```typescript
interface Expense {
    id: string;
    userId: string;
    title: string;
    amount: number;
    category: string;
    createdAt: Date;
}

class ExpenseService {

    async createExpense(
        expense: Expense
    ): Promise<Expense> {

        // Business logic

        return expense;
    }

    async getExpenseById(
        id: string
    ): Promise<Expense | null> {

        // Database query

        return null;
    }
}
```

### HLD vs LLD

| Feature | HLD | LLD |
|---|---|---|
| Focus | Overall architecture | Internal implementation |
| Scope | Entire system | Individual components |
| Details | High-level components | Classes, functions and schemas |
| Audience | Architects and technical leads | Developers and engineers |
| Example | Microservices architecture | OrderService implementation |
| Diagram | Architecture diagram | Class diagram, sequence diagram |

### Simple Understanding

HLD answers:

**How will the complete system work?**

LLD answers:

**How will each component be implemented?**

---

# 4. Functional and Non-Functional Requirements

Before designing any system, identify its requirements.

There are two major categories.

## 4.1 Functional Requirements

Functional requirements describe what the system must do.

Example: Expense Tracker.

1. User registration.
2. User login.
3. Create expense.
4. Update expense.
5. Delete expense.
6. View expense history.
7. Filter expenses by category.
8. Generate monthly reports.
9. Export expenses to Excel.
10. Manage recurring expenses.

These describe application features.

## 4.2 Non-Functional Requirements

Non-functional requirements describe how well the system should operate.

Examples:

- Performance.
- Scalability.
- Availability.
- Reliability.
- Security.
- Maintainability.
- Consistency.
- Fault tolerance.

### Comparison

| Functional Requirement | Non-Functional Requirement |
|---|---|
| User can create an expense | API response should be under 200 ms for a defined workload |
| User can log in | Authentication should be secure |
| User can generate reports | Reports should complete within an acceptable time |
| User can upload files | System should handle concurrent uploads |
| User can view transactions | System should maintain required data consistency |

### Important

Non-functional requirements should be measurable wherever possible.

For example:

Instead of:

"Application should be fast."

Define:

"95% of read API requests should complete within 200 ms under the target production workload."

This is called an SLO-style performance target.

---

# 5. How to Approach a System Design Problem

A systematic approach is important during system design interviews and real-world architecture discussions.

Follow these steps.

```text
1. Understand Requirements
          |
          v
2. Estimate Traffic and Storage
          |
          v
3. Define API Contracts
          |
          v
4. Design Database
          |
          v
5. Create High-Level Architecture
          |
          v
6. Identify Bottlenecks
          |
          v
7. Design Scaling Strategy
          |
          v
8. Handle Failures
          |
          v
9. Add Security and Monitoring
          |
          v
10. Evaluate Trade-offs
```

## Step 1: Understand Requirements

Clarify what the application needs to do.

## Step 2: Estimate Traffic

Understand expected users, requests and data volume.

## Step 3: Define APIs

Identify the major API endpoints.

## Step 4: Design Database

Choose database technology and schema.

## Step 5: Design Architecture

Identify services and infrastructure.

## Step 6: Identify Bottlenecks

Find components that may become overloaded.

## Step 7: Design Scaling

Decide how to scale the application.

## Step 8: Handle Failures

Plan for service and database failures.

## Step 9: Add Security and Monitoring

Include authentication, authorization, logs, metrics and tracing.

## Step 10: Evaluate Trade-offs

Every architectural choice has advantages and disadvantages.

There is rarely one universally correct architecture.

---

# 6. Capacity Planning and Traffic Estimation

Capacity planning means estimating the infrastructure required to handle expected traffic and data.

Let's consider an application with:

- 1 million daily active users.
- Each user makes 20 requests per day.
- Average request size: 10 KB.
- Average response size: 50 KB.

### Step 1: Calculate Daily Requests

```text
Daily Users = 1,000,000

Requests Per User = 20

Total Requests =
1,000,000 × 20

= 20,000,000 requests/day
```

### Step 2: Calculate Average Requests Per Second

There are 86,400 seconds in one day.

```text
Average RPS = Daily Requests / 86,400

= 20,000,000 / 86,400

≈ 231.5 requests/second
```

Average traffic is approximately 232 requests per second.

### Step 3: Estimate Peak Traffic

Traffic is rarely uniform.

Assume peak traffic is five times average traffic.

```text
Peak RPS = 231.5 × 5

≈ 1,158 requests/second
```

Your infrastructure should be tested against the expected peak, with an appropriate safety margin.

### Step 4: Estimate Daily Data Transfer

Average request:

10 KB.

Average response:

50 KB.

Total per request:

```text
10 KB + 50 KB = 60 KB
```

Daily transfer:

```text
20,000,000 × 60 KB

= 1,200,000,000 KB
```

Approximately 1.2 TB of decimal data transfer per day.

This is a simplified estimate. Real systems must account for compression, caching, retries, protocol overhead and traffic distribution.

### Important Terms

| Term | Meaning |
|---|---|
| RPS | Requests Per Second |
| QPS | Queries Per Second |
| TPS | Transactions Per Second |
| Throughput | Amount of work processed per unit of time |
| Latency | Time taken to complete an operation |
| Concurrency | Number of operations active simultaneously |

---

# 7. Scalability

Scalability is the ability of a system to handle increased workload by adding or improving resources.

There are two major scaling approaches:

1. Vertical Scaling.
2. Horizontal Scaling.

## 7.1 Vertical Scaling

Vertical scaling means increasing the resources of an existing server.

For example:

```text
Before:

CPU: 2 Cores
RAM: 4 GB
Storage: 100 GB

After:

CPU: 16 Cores
RAM: 64 GB
Storage: 1 TB
```

The same server becomes more powerful.

### Advantages

- Simple architecture.
- No need to distribute application instances.
- Easier to implement initially.
- Often useful for database workloads.

### Disadvantages

- Hardware limits.
- Higher cost at larger sizes.
- Potential downtime during upgrades.
- Does not automatically improve fault tolerance.

## 7.2 Horizontal Scaling

Horizontal scaling means adding more servers or application instances.

Example:

Before:

```text
Application
    |
    v
Server 1
```

After:

```text
           Load Balancer
                 |
       ┌─────────┼─────────┐
       |         |         |
       v         v         v
    Server 1  Server 2  Server 3
```

### Advantages

- Supports higher traffic.
- Better fault isolation.
- Can scale individual components.
- Supports distributed workloads.

### Disadvantages

- More infrastructure complexity.
- Requires load balancing.
- Requires careful state management.
- Distributed consistency becomes important.

### Comparison

| Vertical Scaling | Horizontal Scaling |
|---|---|
| Adds resources to one machine | Adds more machines or instances |
| Simpler | More complex |
| Limited by hardware capacity | Can scale across many machines |
| Often creates a larger single failure domain | Can improve availability with redundancy |
| Example: Upgrade RAM | Example: Add more API servers |

---

# 8. Stateless vs Stateful Architecture

This is a fundamental concept in scalable system design.

## 8.1 Stateful Application

A stateful application stores session or user-specific state inside the application instance.

Example:

```typescript
const userSessions = new Map<string, string>();

userSessions.set("session-101", "user-101");
```

The application stores sessions in its own memory.

### Problem

Suppose you have two application servers.

```text
             Load Balancer
                  |
          ┌───────┴───────┐
          |               |
          v               v
       Server 1        Server 2
          |               |
          v               v
      Session A       No Session A
```

The user logs in through Server 1.

The next request goes to Server 2.

Server 2 does not know about the session.

This can create authentication problems.

## 8.2 Stateless Application

A stateless application does not depend on local instance memory to retain user session state between requests.

Session information can be stored externally.

Example:

```text
             Load Balancer
                  |
          ┌───────┴───────┐
          |               |
          v               v
       Server 1        Server 2
          |               |
          └───────┬───────┘
                  |
                  v
                Redis
```

Both servers can access shared session data.

### Example with Redis

```typescript
interface Session {
    userId: string;
    expiresAt: number;
}
```

You can store session data in Redis instead of an in-memory JavaScript Map.

### Benefits

- Easier horizontal scaling.
- Flexible load balancing.
- Better support for multiple instances.
- Application instances can be replaced independently.

### Important

Stateless does not mean the entire system has no state.

The database and Redis still store state. The application instances simply avoid depending on their own local memory for persistent user state.

---

# 9. What Is High Availability?

High Availability (HA) means designing a system to remain accessible despite certain failures.

Example:

```text
               Load Balancer
                     |
           ┌─────────┴─────────┐
           |                   |
           v                   v
        Server 1            Server 2
           |                   |
           └─────────┬─────────┘
                     |
                     v
               Database Cluster
```

If Server 1 fails, traffic can be routed to Server 2.

### Availability Percentage

Availability is commonly calculated as:

```text
Availability =
Uptime / Total Scheduled Time × 100
```

### Common Availability Targets

| Availability | Approximate Annual Downtime |
|---|---:|
| 99% | 3.65 days |
| 99.9% | 8.76 hours |
| 99.95% | 4.38 hours |
| 99.99% | 52.56 minutes |
| 99.999% | 5.26 minutes |

These are theoretical annual downtime budgets, not guarantees of actual performance.

### Important

High availability requires more than multiple application servers.

You must also consider:

- Database redundancy.
- Network redundancy.
- Load balancer redundancy.
- Storage redundancy.
- Dependency availability.
- Recovery procedures.

A single database server can still become a single point of failure.

---

# 10. Fault Tolerance

Fault tolerance is the ability of a system to continue operating when components fail.

Example:

```text
Application
    |
    v
Service A
    |
    X Failure
    |
    v
Fallback Mechanism
```

Common fault-tolerance techniques:

1. Replication.
2. Redundancy.
3. Failover.
4. Circuit breakers.
5. Retries with backoff.
6. Bulkheads.
7. Health checks.
8. Graceful degradation.

### Example: Graceful Degradation

Suppose an e-commerce application depends on:

- Product Service.
- Recommendation Service.
- Payment Service.

If Recommendation Service fails, the application should still allow users to browse products and make purchases.

Recommendations can be temporarily disabled.

This is graceful degradation.

---

# 11. Database Replication

Database replication means maintaining copies of database data across multiple database servers.

Replication can improve:

- Read scalability.
- Availability.
- Disaster recovery.
- Geographic distribution.

### Primary-Replica Architecture

```text
               Application
                    |
                    v
              Primary Database
                    |
             Replication Stream
                    |
          ┌─────────┴─────────┐
          |                   |
          v                   v
      Replica 1           Replica 2
```

The primary handles writes.

Replicas receive copies of the data and can serve reads.

This is commonly called primary-replica architecture.

## 11.1 Primary Database

The primary database accepts writes.

Example:

```sql
INSERT INTO users (
    name,
    email
)
VALUES (
    'John',
    'john@example.com'
);
```

## 11.2 Replica Database

The replica receives changes through the database's replication mechanism.

It can serve read queries.

Example:

```sql
SELECT *
FROM users
WHERE id = 101;
```

### Advantages

- Distributes read workload.
- Provides additional copies of data.
- Can support recovery.
- Can reduce load on primary.

### Disadvantages

- Replication lag.
- Additional infrastructure.
- More complex failover.
- Replica reads may return stale data.

---

# 12. Synchronous vs Asynchronous Replication

## 12.1 Synchronous Replication

The primary waits for acknowledgement from one or more replicas according to the configured commit policy.

Simplified architecture:

```text
Application
    |
    v
Primary DB
    |
    v
Replica DB
    |
    v
Acknowledgement
    |
    v
Commit Confirmation
```

### Advantages

- Stronger durability guarantees under the configured policy.
- Lower risk of losing acknowledged transactions during certain failures.

### Disadvantages

- Higher write latency.
- Network delays affect transactions.
- Availability can be reduced if required replicas are unavailable.

## 12.2 Asynchronous Replication

The primary commits first and sends changes to replicas asynchronously.

```text
Application
    |
    v
Primary DB
    |
    ├──────────> Replica 1
    |
    └──────────> Replica 2
```

### Advantages

- Lower write latency.
- Better write availability in some configurations.
- Suitable for read scaling.

### Disadvantages

- Replication lag.
- Recent writes may not immediately appear on replicas.
- Some acknowledged writes may be lost during certain failover scenarios.

### Comparison

| Synchronous | Asynchronous |
|---|---|
| Waits for configured acknowledgement | Primary can commit without waiting for replica application |
| Stronger consistency/durability under chosen policy | Eventual consistency is common |
| Higher latency | Lower latency |
| Depends on replica availability | More tolerant of temporary replica delays |

---

# 13. Read Replicas and Read/Write Separation

When an application receives many read requests, the primary database may become overloaded.

You can distribute reads across replicas.

```text
                 Application
                      |
             ┌────────┴────────┐
             |                 |
             v                 v
          Writes             Reads
             |                 |
             v                 v
        Primary DB       Read Replicas
                              |
                     ┌────────┴────────┐
                     |                 |
                     v                 v
                 Replica 1         Replica 2
```

### Example in TypeScript

```typescript
interface DatabaseConfig {
    host: string;
    username: string;
    password: string;
    database: string;
}
```

With Sequelize, you can configure read and write pools.

```typescript
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
    dialect: "mysql",

    database: "app_db",

    username: "app_user",

    password: process.env.DB_PASSWORD,

    replication: {

        write: {
            host: "primary-db.example.com"
        },

        read: [
            {
                host: "replica-1.example.com"
            },
            {
                host: "replica-2.example.com"
            }
        ]
    },

    pool: {
        max: 20,
        min: 2,
        acquire: 30000,
        idle: 10000
    }
});
```

This is a simplified configuration; production credentials and database connection details should be managed securely.

### Important: Read-After-Write Consistency

Suppose a user updates their profile.

The write goes to the primary database.

Immediately afterward, the application reads from a replica.

If replication has not completed, the user may see old data.

Possible solutions:

1. Read recent writes from the primary.
2. Use session-based consistency strategies.
3. Wait for replication confirmation where supported.
4. Design the UI to tolerate temporary inconsistency.

---

# 14. What Is Database Sharding?

Database sharding is a technique for distributing data across multiple independent database servers.

Each shard stores a subset of the total dataset.

### Without Sharding

```text
             Application
                  |
                  v
             MySQL Server
                  |
             100 Million Rows
```

As data grows, one database may become difficult to scale.

### With Sharding

```text
                 Application
                      |
                      v
                 Shard Router
                      |
          ┌───────────┼───────────┐
          |           |           |
          v           v           v
       Shard 1     Shard 2     Shard 3
       Users       Users       Users
       1-100K      100K-200K   200K-300K
```

Each shard stores part of the data.

### Example

Suppose you have 1 million users.

You divide users across four shards.

```text
Shard 1 → Users 1–250,000

Shard 2 → Users 250,001–500,000

Shard 3 → Users 500,001–750,000

Shard 4 → Users 750,001–1,000,000
```

This is range-based sharding.

---

# 15. Sharding Strategies

There are several common sharding strategies.

## 15.1 Range-Based Sharding

Data is distributed according to ranges of a key.

Example:

```text
User ID 1–1000       → Shard 1
User ID 1001–2000    → Shard 2
User ID 2001–3000    → Shard 3
```

### Advantages

- Easy to understand.
- Range queries can be efficient when data locality is useful.

### Disadvantages

- Uneven distribution.
- Hot shards.
- Sequential writes may overload one shard.

## 15.2 Hash-Based Sharding

A hash function determines the shard.

Example:

```typescript
function getShard(
    userId: number,
    totalShards: number
): number {

    return userId % totalShards;
}
```

Usage:

```typescript
const shard = getShard(12345, 4);

console.log(shard);
```

The result identifies the shard.

### Advantages

- Often distributes records more evenly.
- Simple routing logic.

### Disadvantages

- Range queries become difficult.
- Changing shard count can remap many records.

## 15.3 Consistent Hashing

Consistent hashing distributes keys across a logical hash ring.

When nodes are added or removed, only a portion of keys generally need to move.

Virtual nodes can help improve distribution.

It is commonly used in distributed caching and some sharding systems.

## 15.4 Geographic Sharding

Data is distributed based on geographical location.

Example:

```text
India Users    → India Database
Europe Users   → Europe Database
US Users       → US Database
```

This can improve locality and support regional data requirements.

### Comparison

| Strategy | Distribution Basis | Main Benefit |
|---|---|---|
| Range-Based | Key ranges | Efficient range locality |
| Hash-Based | Hash function | Generally even distribution |
| Consistent Hashing | Hash ring | Easier node changes |
| Geographic | Location | Regional locality |

---

# 16. Sharding vs Replication

These concepts are different.

**Sharding distributes different data across servers.**

**Replication copies the same data across servers.**

### Sharding

```text
Shard 1 → Users 1–1000

Shard 2 → Users 1001–2000

Shard 3 → Users 2001–3000
```

### Replication

```text
Primary DB
     |
     ├── Replica 1 (Copy of data)
     |
     └── Replica 2 (Copy of data)
```

### Comparison

| Feature | Sharding | Replication |
|---|---|---|
| Purpose | Distribute data | Copy data |
| Data | Different subsets | Same logical dataset |
| Main benefit | Storage and workload scaling | Read scaling and availability |
| Complexity | High | Moderate to high |
| Example | Users distributed across shards | Primary with read replicas |

They can be combined.

Each shard can have its own replicas.

---

# 17. What Is Database Partitioning?

Database partitioning divides a large table into smaller logical pieces.

Unlike sharding, partitioning can happen within one database instance.

Example:

A transaction table contains 100 million rows.

You can partition it by year.

```text
transactions
    |
    ├── partition_2024
    |
    ├── partition_2025
    |
    └── partition_2026
```

A query for 2026 data may only need to scan the relevant partition when partition pruning is possible.

## 17.1 Types of Partitioning

### Range Partitioning

Partitions based on ranges.

Example:

```text
2024 → Partition 1
2025 → Partition 2
2026 → Partition 3
```

### List Partitioning

Partitions based on specific values.

Example:

```text
Gujarat → Partition 1
Maharashtra → Partition 2
Rajasthan → Partition 3
```

### Hash Partitioning

Partitions based on a hash function.

### Composite Partitioning

Combines multiple partitioning strategies.

### Partitioning vs Sharding

| Partitioning | Sharding |
|---|---|
| Can exist within one database instance | Distributes data across independent database nodes |
| Simplifies large-table management | Supports distributed storage and scaling |
| Database often manages partitions internally | Application or sharding layer may route requests |
| Example: Partition transactions by year | Distribute users across multiple database servers |

---

# 18. Database Indexing Strategies

An index is a data structure that helps a database locate records efficiently.

Without an index, the database may need to scan many rows.

### Without Index

```text
SELECT *
FROM users
WHERE email = 'john@example.com';
```

The database may perform a full table scan.

### With Index

```sql
CREATE INDEX idx_users_email
ON users(email);
```

The database can use the index to find matching records more efficiently.

## 18.1 Common Index Types

| Index Type | Purpose |
|---|---|
| B-Tree | General-purpose ordered lookup |
| Hash | Equality lookup in supported engines |
| Composite | Index on multiple columns |
| Unique | Enforces uniqueness |
| Full-Text | Search text content |
| Spatial | Geographical data |
| Partial/Filtered | Indexes a subset of rows where supported |

## 18.2 Composite Index

Example:

```sql
CREATE INDEX idx_orders_user_status
ON orders(user_id, status);
```

This index is designed to help queries involving the indexed columns in a useful order.

Example:

```sql
SELECT *
FROM orders
WHERE user_id = 101
AND status = 'COMPLETED';
```

### Column Order Matters

A composite B-tree index on:

```text
(user_id, status)
```

is generally most useful for:

- `user_id`
- `user_id` and `status`

It is not generally equivalent to an index beginning with `status`.

This is related to the leftmost-prefix principle.

### Important

Indexes improve many read queries but add:

- Storage overhead.
- Write overhead.
- Maintenance cost.

Do not create indexes without understanding actual query patterns.

---

# 19. What Is Caching?

Caching stores frequently accessed data in a faster storage layer to reduce repeated computation or database access.

Example:

Suppose your application receives 10,000 requests for the same product.

Without caching:

```text
10,000 Requests
       |
       v
  MySQL Database
       |
       v
  10,000 Queries
```

With caching:

```text
10,000 Requests
       |
       v
      Redis
       |
       ├── Cache Hit → Return Data
       |
       └── Cache Miss → Query Database
```

Caching reduces database load and can improve response time.

### Common Caching Layers

1. Browser Cache.
2. CDN Cache.
3. Reverse Proxy Cache.
4. Application Cache.
5. Distributed Cache.
6. Database Buffer Cache.

---

# 20. What Is Redis?

Redis is an in-memory data store commonly used for caching, messaging, sessions, rate limiting and background job infrastructure.

Redis supports data structures such as:

- Strings.
- Hashes.
- Lists.
- Sets.
- Sorted Sets.
- Streams.
- Bitmaps.
- HyperLogLogs.
- Geospatial indexes.

### Why Is Redis Fast?

Redis primarily serves data from memory rather than relying on disk for every ordinary lookup.

Actual performance depends on data size, workload, persistence, network latency and deployment configuration.

### Redis Use Cases

| Use Case | Example |
|---|---|
| Caching | Product details |
| Sessions | User sessions |
| Rate Limiting | API request counters |
| Leaderboards | Sorted Sets |
| Queues | BullMQ |
| Pub/Sub | Real-time notifications |
| Distributed Locks | Coordinating operations |
| Counters | Page views |

---

# 21. Cache-Aside Pattern

Cache-Aside is one of the most common caching strategies.

The application checks the cache first.

If data exists, it returns the cached result.

If data does not exist, it queries the database and stores the result in the cache.

### Architecture

```text
           Client Request
                 |
                 v
            Application
                 |
                 v
             Check Cache
                 |
          ┌──────┴──────┐
          |             |
          v             v
       Cache Hit     Cache Miss
          |             |
          v             v
     Return Data    Query Database
                        |
                        v
                   Update Cache
                        |
                        v
                    Return Data
```

## 21.1 Implementation Using Redis

Install:

```bash
npm install redis
```

### Redis Connection

```typescript
import { createClient } from "redis";

export const redis = createClient({
    url: process.env.REDIS_URL ??
        "redis://localhost:6379"
});

redis.on("error", (error) => {
    console.error("Redis error:", error);
});

await redis.connect();
```

### Cache-Aside Implementation

```typescript
interface Product {
    id: string;
    name: string;
    price: number;
}

async function getProduct(
    productId: string
): Promise<Product | null> {

    const cacheKey = `product:${productId}`;

    // 1. Check cache.

    const cachedProduct = await redis.get(cacheKey);

    if (cachedProduct) {

        return JSON.parse(
            cachedProduct
        ) as Product;
    }

    // 2. Query database.

    const product = await ProductModel.findByPk(
        productId
    );

    if (!product) {
        return null;
    }

    const result: Product = {
        id: String(product.id),
        name: product.name,
        price: Number(product.price)
    };

    // 3. Store in cache.

    await redis.set(
        cacheKey,
        JSON.stringify(result),
        {
            EX: 300
        }
    );

    // 4. Return result.

    return result;
}
```

The cache expiration is five minutes.

### Advantages

- Simple implementation.
- Only frequently requested data is cached.
- Cache can be populated on demand.

### Disadvantages

- Cache misses require database queries.
- Data can become stale.
- Cache invalidation needs careful handling.

---

# 22. Write-Through Caching

In Write-Through caching, the application updates the cache and database as part of the write workflow.

Conceptually:

```text
          Application
               |
               v
          Write Request
               |
          ┌────┴────┐
          |         |
          v         v
        Cache    Database
```

The exact consistency guarantee depends on the implementation and write ordering.

### Example

```typescript
async function updateProduct(
    productId: string,
    data: {
        name: string;
        price: number;
    }
): Promise<void> {

    const updatedProduct =
        await ProductModel.update(
            data,
            {
                where: {
                    id: productId
                },
                returning: true
            }
        );

    const product = updatedProduct[1]?.[0];

    if (product) {

        await redis.set(
            `product:${productId}`,
            JSON.stringify(product),
            {
                EX: 300
            }
        );
    }
}
```

This is a simplified example. Real implementations need transaction handling and a strategy for cache/database failures.

### Advantages

- Cache is updated during writes.
- Can reduce stale cache entries.

### Disadvantages

- Write operations are more expensive.
- Cache failures complicate the workflow.
- Database and cache are separate systems, so atomicity is not automatic.

---

# 23. Write-Behind Caching

Write-Behind caching writes data to the cache first and persists it to the database asynchronously.

```text
          Application
               |
               v
             Cache
               |
               v
        Background Worker
               |
               v
            Database
```

### Example Use Case

Suppose your application records millions of page views.

Instead of writing every view immediately to MySQL, it can accumulate counts in Redis and periodically persist aggregated data.

### Advantages

- Very fast write response.
- Can batch database writes.
- Reduces write pressure on the database.

### Disadvantages

- Data may be lost if cache data is lost before persistence.
- More complex recovery.
- Requires reliable background processing.
- Not suitable for every critical transaction.

### Comparison

| Pattern | Read | Write | Main Use |
|---|---|---|---|
| Cache-Aside | Cache first | Usually DB first, then invalidate/update cache | General-purpose caching |
| Write-Through | Cache first | Update DB and cache in the write workflow | Consistent cache population |
| Write-Behind | Cache first | Cache first, DB asynchronously | High-volume writes where delayed persistence is acceptable |

---

# 24. Cache Invalidation

Cache invalidation means removing or updating cached data when the underlying source data changes.

This is one of the hardest parts of caching.

Example:

The database contains:

```json
{
    "id": "P101",
    "name": "Laptop",
    "price": 50000
}
```

Redis contains the same product.

Now the product price changes to 45000.

If the cache is not updated or invalidated, users may continue seeing the old price.

### Strategy 1: TTL-Based Expiration

Set an expiration time.

```typescript
await redis.set(
    "product:P101",
    JSON.stringify(product),
    {
        EX: 300
    }
);
```

The cache expires after five minutes.

### Strategy 2: Delete Cache After Update

```typescript
async function updateProductPrice(
    productId: string,
    price: number
): Promise<void> {

    await ProductModel.update(
        {
            price
        },
        {
            where: {
                id: productId
            }
        }
    );

    await redis.del(
        `product:${productId}`
    );
}
```

The next request will fetch fresh data from the database.

### Strategy 3: Update Cache Directly

After updating the database, update the cached value.

### Strategy 4: Event-Driven Invalidation

When product data changes, publish an event.

```text
Product Service
      |
      v
ProductUpdated Event
      |
      v
Message Broker
      |
      v
Cache Invalidation Worker
      |
      v
Redis
```

The worker invalidates the corresponding cache key.

### Important: Cache Stampede

A cache stampede occurs when many requests simultaneously experience a cache miss and query the database.

Possible solutions:

- Request coalescing.
- Distributed locking where appropriate.
- Early refresh.
- TTL jitter.
- Stale-while-revalidate strategies.

---

# 25. Redis Cache Eviction Policies

Redis may need to remove cached keys when memory reaches configured limits.

Eviction policies determine which keys are removed.

Common policies include:

| Policy | Description |
|---|---|
| `noeviction` | Reject writes when memory limit is reached |
| `allkeys-lru` | Evict least recently used keys |
| `allkeys-lfu` | Evict least frequently used keys |
| `volatile-lru` | Evict least recently used keys with expiration |
| `volatile-lfu` | Evict least frequently used expiring keys |
| `volatile-ttl` | Prefer keys with shorter remaining TTL |

### LRU vs LFU

**LRU:** Least Recently Used.

Removes keys that have not been accessed recently.

**LFU:** Least Frequently Used.

Removes keys that have been accessed less frequently.

### Example

Suppose your cache contains:

```text
Product A → Accessed 100 times
Product B → Accessed 5 times
Product C → Accessed 1 time
```

LFU is more likely to retain Product A.

LRU considers recency rather than total access frequency.

Choose the policy according to workload characteristics.

---

# 26. What Is a Content Delivery Network (CDN)?

A Content Delivery Network is a geographically distributed network of servers that delivers content closer to users.

It is commonly used for:

- Images.
- Videos.
- CSS.
- JavaScript.
- Fonts.
- Static files.
- Downloadable documents.

### Without CDN

Suppose your server is located in Mumbai.

A user from the United States requests an image.

```text
US User
   |
   v
Mumbai Server
   |
   v
Image Response
```

The request travels a long geographical distance.

### With CDN

```text
                 CDN Network
                     |
         ┌───────────┼───────────┐
         |           |           |
         v           v           v
      US Edge    India Edge  Europe Edge
         |           |           |
         v           v           v
       Users       Users       Users
```

The CDN serves content from a nearby edge location when available.

If content is not cached, the CDN may fetch it from the origin server.

### CDN Benefits

1. Lower latency.
2. Reduced origin server load.
3. Better static content delivery.
4. Improved global performance.
5. Support for traffic spikes.
6. Additional security capabilities.

### Popular CDN Providers

- Cloudflare
- Amazon CloudFront
- Akamai
- Fastly

---

# 27. CDN Caching Fundamentals

A CDN can cache content based on HTTP caching rules.

Important headers:

### Cache-Control

```http
Cache-Control: public, max-age=3600
```

This allows shared caches to store the response for up to one hour, subject to cache rules.

### Private Cache

```http
Cache-Control: private, max-age=300
```

This allows private caches, such as the user's browser, to cache the response for five minutes.

### No Store

```http
Cache-Control: no-store
```

This tells caches not to store the response.

Useful for sensitive responses where caching is inappropriate.

### ETag

An ETag is a validator identifying a particular version of a resource.

Example:

```http
ETag: "product-v10"
```

A client can send:

```http
If-None-Match: "product-v10"
```

If the resource has not changed, the server can return:

```http
304 Not Modified
```

### Important

Avoid publicly caching personalized or sensitive responses unless the cache key and access controls are explicitly designed to prevent data leakage.

---

# 28. What Is Load Balancing?

Load balancing distributes incoming requests across multiple servers or application instances.

Example:

```text
              Client Requests
                     |
                     v
                Load Balancer
                     |
          ┌──────────┼──────────┐
          |          |          |
          v          v          v
       Server 1   Server 2   Server 3
```

### Common Load Balancing Algorithms

| Algorithm | Description |
|---|---|
| Round Robin | Distributes requests sequentially |
| Weighted Round Robin | Assigns traffic based on server weights |
| Least Connections | Sends traffic to the instance with fewer active connections |
| IP Hash | Selects instance based on client IP |
| Random | Selects an instance randomly |

### Layer 4 vs Layer 7 Load Balancing

**Layer 4:**

Works at the transport layer, typically using IP addresses and TCP/UDP ports.

**Layer 7:**

Works at the application layer, using HTTP-level information such as paths, hosts and headers.

Example:

```text
/api/users      → User Service
/api/products   → Product Service
/api/orders     → Order Service
```

Layer 7 load balancing can make routing decisions based on HTTP requests.

---

# 29. Database Connection Pooling

Opening a new database connection for every request is expensive.

A connection pool maintains reusable database connections.

### Without Connection Pooling

```text
Request 1 → Create Connection → Query → Close
Request 2 → Create Connection → Query → Close
Request 3 → Create Connection → Query → Close
```

Repeated connection creation adds overhead.

### With Connection Pooling

```text
             Application
                  |
                  v
             Connection Pool
                  |
          ┌───────┼───────┐
          |       |       |
          v       v       v
       Conn 1  Conn 2  Conn 3
          |       |       |
          └───────┼───────┘
                  |
                  v
               Database
```

Connections are reused.

### Sequelize Example

```typescript
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    process.env.DATABASE_URL!,
    {
        dialect: "mysql",

        pool: {
            max: 20,
            min: 2,
            acquire: 30000,
            idle: 10000
        }
    }
);
```

### Pool Configuration

| Option | Meaning |
|---|---|
| max | Maximum pool connections |
| min | Minimum pool connections |
| acquire | Maximum wait time to obtain a connection |
| idle | Time before an idle connection may be released |

### Important

Suppose you run 10 application instances.

Each instance has a maximum pool size of 20.

Potential total connections:

```text
10 × 20 = 200 connections
```

The database must be sized to support the aggregate connection demand, including administrative and background connections.

---

# 30. Database Query Optimization

Database queries are often a major source of performance problems.

### Poor Query

```sql
SELECT *
FROM orders;
```

This retrieves every column and every row.

### Better Query

```sql
SELECT
    id,
    user_id,
    total_amount,
    status
FROM orders
WHERE user_id = 101
ORDER BY created_at DESC
LIMIT 20;
```

This query:

- Retrieves only required columns.
- Filters by user.
- Limits the result.
- Uses ordering.

An appropriate index may further improve performance.

### Avoid N+1 Queries

Suppose you retrieve 100 orders and then query the customer separately for each order.

```text
1 Query → Get Orders

100 Queries → Get Customers
```

Total:

101 queries.

A join or batch-loading strategy may reduce this.

Example:

```sql
SELECT
    orders.id,
    orders.total_amount,
    users.name
FROM orders
JOIN users
    ON users.id = orders.user_id
WHERE orders.user_id = 101;
```

### Other Optimization Techniques

1. Add appropriate indexes.
2. Avoid unnecessary columns.
3. Use pagination.
4. Analyze execution plans.
5. Avoid repeated queries.
6. Use batching.
7. Use connection pooling.
8. Cache frequently accessed data.
9. Avoid unbounded result sets.
10. Monitor slow queries.

---

# 31. What Is a CDN vs Cache vs Database?

These technologies solve different problems.

| Technology | Purpose | Example |
|---|---|---|
| CDN | Delivers content close to users | Images and videos |
| Redis | Fast application data access | Product details |
| Database | Persistent structured data | Users and orders |
| Browser Cache | Stores content on user device | CSS and JS files |
| Reverse Proxy Cache | Caches HTTP responses near origin | Public API responses |

### Example Architecture

```text
               User
                 |
                 v
                CDN
                 |
                 v
             API Gateway
                 |
                 v
           Application Server
                 |
                 v
               Redis
                 |
          Cache Miss
                 |
                 v
              Database
```

Each layer has a different responsibility.

---

# 32. Performance Optimization

Performance optimization improves the speed and efficiency of an application.

It includes:

- Lower latency.
- Higher throughput.
- Reduced memory usage.
- Reduced CPU usage.
- Efficient database access.
- Reduced network traffic.

## 32.1 Frontend Optimization

Examples:

- Code splitting.
- Lazy loading.
- Image optimization.
- Browser caching.
- Minification.
- Compression.
- CDN delivery.

## 32.2 Backend Optimization

Examples:

- Efficient algorithms.
- Database indexing.
- Connection pooling.
- Redis caching.
- Async I/O.
- Request batching.
- Pagination.
- Avoiding unnecessary serialization.

## 32.3 Node.js Optimization

Node.js uses an event loop to coordinate JavaScript execution and asynchronous operations.

Long-running synchronous CPU tasks can block the event loop.

Poor example:

```typescript
function processLargeData(): void {

    for (let i = 0; i < 1_000_000_000; i++) {
        // CPU-heavy operation
    }

}
```

This blocks the event loop while executing.

Better approaches may include:

- Worker Threads.
- Child Processes.
- External job workers.
- Streaming.
- Chunked processing.

### Worker Threads Example

```typescript
import {
    Worker,
    isMainThread,
    parentPort
} from "node:worker_threads";

if (isMainThread) {

    const worker = new Worker(
        __filename
    );

    worker.on("message", (result) => {
        console.log("Result:", result);
    });

} else {

    let result = 0;

    for (let i = 0; i < 1_000_000; i++) {
        result += i;
    }

    parentPort?.postMessage(result);
}
```

This is an illustrative CommonJS-style example. When using ESM or TypeScript execution directly, worker file configuration and compilation paths need to be handled appropriately.

---

# 33. What Is Database Connection Saturation?

Database connection saturation occurs when the application requests more simultaneous database connections than the database or pool can provide.

Example:

```text
1000 Incoming Requests
          |
          v
    Application Servers
          |
          v
    Connection Pool
          |
          v
    Database Capacity
```

Suppose the database can handle only 200 active connections, but the application attempts to open 1,000.

Requests may wait or fail.

### Solutions

1. Configure connection pool limits.
2. Reduce unnecessary queries.
3. Use caching.
4. Optimize long-running transactions.
5. Scale the database appropriately.
6. Use a database proxy where suitable.
7. Avoid opening independent pools unnecessarily.

---

# 34. What Is Disaster Recovery?

Disaster Recovery (DR) is the process of restoring a system after a major failure.

Examples:

- Database corruption.
- Data center outage.
- Accidental data deletion.
- Ransomware attack.
- Storage failure.
- Regional cloud outage.

### Important DR Concepts

**RPO – Recovery Point Objective**

The maximum acceptable amount of data loss measured in time.

Example:

```text
RPO = 15 minutes
```

This means the recovery strategy should limit data loss to approximately the previous 15 minutes.

**RTO – Recovery Time Objective**

The target time within which the service should be restored.

Example:

```text
RTO = 1 hour
```

The application should be restored within one hour.

### Comparison

| Term | Meaning |
|---|---|
| RPO | How much data loss is acceptable |
| RTO | How long recovery may take |

### Disaster Recovery Strategies

1. Regular backups.
2. Database replication.
3. Cross-region backups.
4. Automated recovery.
5. Infrastructure as Code.
6. Recovery testing.
7. Documented incident procedures.

### Important

Replication is not a replacement for backups.

Accidental deletion or corrupted data can also replicate to replicas.

You need independent backups and tested restoration procedures.

---

# 35. Designing a URL Shortener

Now let's apply system design concepts.

A URL shortener converts long URLs into short URLs.

Example:

```text
Long URL:

https://example.com/products/electronics/laptop/model-123

Short URL:

https://short.ly/aB91x
```

When someone visits the short URL, the application redirects them to the original URL.

## 35.1 Functional Requirements

1. Generate short URLs.
2. Redirect users.
3. Support custom aliases.
4. Track click counts.
5. Support expiration.
6. Allow users to manage their links.

## 35.2 Non-Functional Requirements

1. High availability.
2. Low redirect latency.
3. Scalability.
4. Durable URL mappings.
5. Abuse prevention.

## 35.3 API Design

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/urls` | Create short URL |
| GET | `/:shortCode` | Redirect |
| GET | `/api/urls/:id` | Get URL details |
| DELETE | `/api/urls/:id` | Delete URL |

## 35.4 Database Design

```sql
CREATE TABLE urls (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    short_code VARCHAR(20) NOT NULL UNIQUE,
    original_url TEXT NOT NULL,
    user_id BIGINT,
    click_count BIGINT DEFAULT 0,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 35.5 High-Level Architecture

```text
                 User
                  |
                  v
              Load Balancer
                  |
                  v
             URL Shortener API
                  |
                  v
                Redis
                  |
              Cache Miss
                  |
                  v
              MySQL DB
```

### Redirect Workflow

```text
User Requests Short URL
          |
          v
       Redis Lookup
          |
     ┌────┴────┐
     |         |
    Hit       Miss
     |         |
     v         v
 Redirect   MySQL Query
               |
               v
           Update Cache
               |
               v
             Redirect
```

## 35.6 Short Code Generation

One simple strategy is Base62 encoding.

Base62 uses:

```text
0-9
a-z
A-Z
```

Total characters:

```text
10 + 26 + 26 = 62
```

Example implementation:

```typescript
const BASE62 =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function encodeBase62(value: number): string {

    if (!Number.isSafeInteger(value) || value < 0) {
        throw new Error("Invalid input");
    }

    if (value === 0) {
        return "0";
    }

    let result = "";

    while (value > 0) {

        const remainder = value % 62;

        result = BASE62[remainder] + result;

        value = Math.floor(value / 62);
    }

    return result;
}
```

Usage:

```typescript
console.log(encodeBase62(125000));
```

This demonstrates encoding, but a production system must also guarantee uniqueness, handle concurrent ID generation and consider whether sequential codes expose information.

Possible strategies include:

- Database-generated unique IDs.
- Distributed ID generators.
- Random codes with collision detection.
- Snowflake-style IDs.
- Pre-generated code pools.

---

# 36. Designing an E-Commerce System

Let's design an e-commerce platform.

## 36.1 Functional Requirements

1. User registration.
2. Product browsing.
3. Product search.
4. Cart management.
5. Order creation.
6. Payment processing.
7. Inventory management.
8. Order tracking.
9. Notifications.
10. Refunds.

## 36.2 High-Level Architecture

```text
                      Frontend
                         |
                         v
                     CDN/WAF
                         |
                         v
                    API Gateway
                         |
       ┌─────────────────┼─────────────────┐
       |                 |                 |
       v                 v                 v
  User Service     Product Service    Order Service
       |                 |                 |
       v                 v                 v
    User DB          Product DB         Order DB
                                           |
                                           v
                                      Message Broker
                                           |
                           ┌───────────────┼───────────────┐
                           |               |               |
                           v               v               v
                     Payment Service Inventory Service Notification
                           |               |               |
                           v               v               v
                       Payment DB     Inventory DB       Email/SMS
```

## 36.3 Caching Strategy

Product details are frequently read.

Cache them using Redis.

```text
Product API
    |
    v
Redis
    |
Cache Miss
    |
    v
Product Database
```

## 36.4 Database Strategy

- User data: MySQL or PostgreSQL.
- Product catalog: relational database or suitable search-backed model.
- Orders: relational database.
- Search: Elasticsearch or OpenSearch when search complexity justifies it.
- Cache: Redis.
- Files: object storage.

## 36.5 Payment Workflow

Use asynchronous events and a Saga for multi-service order processing.

```text
Create Order
     |
     v
Process Payment
     |
     v
Reserve Inventory
     |
     v
Confirm Order
     |
     v
Send Notification
```

Failure handling must include refunds, inventory release and order cancellation where appropriate.

---

# 37. Designing a Chat Application

Let's design a real-time chat application.

## 37.1 Functional Requirements

1. User registration.
2. One-to-one chat.
3. Group chat.
4. Send messages.
5. Receive messages in real time.
6. Message history.
7. Read receipts.
8. Online status.
9. File sharing.
10. Notifications.

## 37.2 High-Level Architecture

```text
                  Frontend
                     |
                     v
                Load Balancer
                     |
                     v
               WebSocket Gateway
                     |
             ┌───────┴───────┐
             |               |
             v               v
          Server 1        Server 2
             |               |
             └───────┬───────┘
                     |
                     v
                   Redis
                     |
                     v
               Message Broker
                     |
                     v
                 Message DB
```

## 37.3 Why Redis?

Redis can help with:

- Presence information.
- Distributed Pub/Sub.
- Session metadata.
- Temporary state.
- Rate limiting.

For durable message history, use a persistent database.

## 37.4 Message Database

```sql
CREATE TABLE messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    conversation_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 37.5 Scaling WebSockets

WebSocket connections are long-lived.

When users connect to different application instances, messages may need to be distributed across instances.

A shared message distribution layer can help.

Sticky sessions may be needed for some load-balancing and WebSocket deployment configurations, but they are not a substitute for shared state or cross-instance message routing.

---

# 38. Designing a Notification System

A notification system sends messages through different channels.

Examples:

- Email.
- SMS.
- Push notifications.
- In-app notifications.
- WhatsApp notifications.

## 38.1 Architecture

```text
              Application
                   |
                   v
             Notification API
                   |
                   v
               Message Queue
                   |
          ┌────────┼────────┐
          |        |        |
          v        v        v
        Email     SMS      Push
        Worker   Worker   Worker
          |        |        |
          v        v        v
       Provider Provider Provider
```

### Why Use a Queue?

Suppose 100,000 users need to receive notifications.

Sending every notification inside one HTTP request is inefficient.

A queue distributes the work to background workers.

### Important Considerations

- Delivery retries.
- Provider rate limits.
- Duplicate notifications.
- User preferences.
- Notification templates.
- Delivery status.
- Dead-letter handling.
- Monitoring.

---

# 39. Production Architecture: Putting Everything Together

A mature production system may look like this:

```text
                       Users
                         |
                         v
                      DNS
                         |
                         v
                     CDN / WAF
                         |
                         v
                   Load Balancer
                         |
                         v
                    API Gateway
                         |
       ┌─────────────────┼─────────────────┐
       |                 |                 |
       v                 v                 v
   Service A         Service B         Service C
       |                 |                 |
       └─────────────────┼─────────────────┘
                         |
              ┌──────────┴──────────┐
              |                     |
              v                     v
            Redis               Message Broker
              |                     |
              v                     v
          Cache Layer           Workers
                                    |
                                    v
                              Background Jobs

       ┌───────────────────────────────────────┐
       |                                       |
       v                                       v
  Primary Database                       Read Replicas

       |
       v
    Backups

       |
       v
 Object Storage

       |
       v
 Monitoring / Logging / Tracing
```

Not every application needs every component.

The correct architecture depends on:

- Workload.
- Scale.
- Data consistency requirements.
- Availability requirements.
- Budget.
- Team expertise.
- Operational capabilities.

---

# 40. System Design Trade-Offs

System design is about making informed trade-offs.

| Decision | Benefit | Cost |
|---|---|---|
| Add Redis | Lower database load | Cache invalidation complexity |
| Add read replicas | Better read scalability | Replication lag |
| Add sharding | Distribute large datasets | More complex queries and operations |
| Use microservices | Independent deployment | Distributed-system complexity |
| Use Kafka | Durable event streaming | Operational complexity |
| Use CDN | Faster content delivery | Cache management |
| Use synchronous replication | Stronger durability under configured policy | Higher write latency |
| Use asynchronous processing | Faster API responses | Eventual consistency |

### Important Interview Principle

Do not add technologies just because they are popular.

Explain:

1. What problem exists?
2. Why does it matter?
3. What solution addresses it?
4. What trade-offs does the solution introduce?

---

# 41. System Design Security Considerations

Security must be considered at every architectural layer.

### 1. Authentication

Verify user identity.

### 2. Authorization

Control access to resources.

### 3. API Rate Limiting

Protect against excessive requests.

### 4. Encryption in Transit

Use TLS for network communication.

### 5. Encryption at Rest

Protect stored data using suitable encryption mechanisms.

### 6. Secret Management

Store credentials securely.

### 7. Input Validation

Validate incoming requests.

### 8. Network Security

Restrict unnecessary network access.

### 9. Audit Logging

Record security-relevant actions.

### 10. Data Privacy

Minimize sensitive data exposure and retention.

---

# 42. System Design Interview Questions and Answers

### Q1. What is system design?

The process of defining the architecture, components, data storage and communication mechanisms of a software system.

### Q2. What is HLD?

High-Level Design describes the overall architecture and major components of a system.

### Q3. What is LLD?

Low-Level Design describes internal implementation details such as classes, methods, interfaces and database schemas.

### Q4. What are functional requirements?

They describe the features and operations a system must support.

### Q5. What are non-functional requirements?

They describe quality attributes such as performance, security, availability and scalability.

### Q6. What is scalability?

The ability of a system to handle increased workload by adding or improving resources.

### Q7. What is vertical scaling?

Increasing the resources of an existing machine.

### Q8. What is horizontal scaling?

Adding more machines or application instances.

### Q9. What is a stateless application?

An application that does not depend on local instance memory to preserve user state between requests.

### Q10. What is a stateful application?

An application that maintains state across operations, often within its own process or instance.

### Q11. What is high availability?

Designing a system to remain accessible despite specified component failures.

### Q12. What is fault tolerance?

The ability of a system to continue operating when some components fail.

### Q13. What is database replication?

Maintaining copies of database data across multiple database servers.

### Q14. What is a read replica?

A database replica commonly used to serve read queries.

### Q15. What is replication lag?

The delay between a write being committed on the primary and becoming visible on a replica.

### Q16. What is database sharding?

Distributing different subsets of data across multiple database servers.

### Q17. What is range-based sharding?

Distributing records according to ranges of a shard key.

### Q18. What is hash-based sharding?

Using a hash function to determine which shard stores a record.

### Q19. What is consistent hashing?

A hashing technique that distributes keys across a logical ring and reduces key remapping when nodes change.

### Q20. What is the difference between sharding and replication?

Sharding distributes different data subsets. Replication copies the same logical dataset.

### Q21. What is database partitioning?

Dividing a large table into smaller logical partitions.

### Q22. What is a database index?

A data structure that helps the database locate records efficiently.

### Q23. What is a composite index?

An index created on multiple columns.

### Q24. What is caching?

Storing frequently accessed data in a faster layer to reduce repeated work.

### Q25. What is Redis?

An in-memory data platform used for caching, messaging, sessions, counters and background jobs.

### Q26. What is Cache-Aside?

A caching pattern in which the application checks the cache first and queries the database on a cache miss.

### Q27. What is Write-Through caching?

A pattern in which cache and database updates happen together in the write workflow.

### Q28. What is Write-Behind caching?

A pattern in which cache writes happen first and database persistence occurs asynchronously.

### Q29. What is cache invalidation?

Removing or updating cached data when the source data changes.

### Q30. What is a cache stampede?

A situation where many requests simultaneously miss the cache and overload the underlying data source.

### Q31. What is a CDN?

A geographically distributed network that delivers content from locations closer to users.

### Q32. What is the difference between Layer 4 and Layer 7 load balancing?

Layer 4 operates using transport-level information, while Layer 7 can route based on application-level information such as HTTP paths and headers.

### Q33. What is connection pooling?

Reusing a managed set of database connections instead of opening a new connection for every operation.

### Q34. What is RPO?

Recovery Point Objective defines the maximum acceptable amount of data loss measured in time.

### Q35. What is RTO?

Recovery Time Objective defines the target time required to restore service after a disruption.

### Q36. What is disaster recovery?

The process of restoring systems and data after a major failure.

### Q37. Why are backups necessary if database replication exists?

Replication can copy accidental deletion or corrupted data. Independent backups provide recovery points.

### Q38. What is throughput?

The amount of work a system processes per unit of time.

### Q39. What is latency?

The time taken to complete an operation.

### Q40. What is a single point of failure?

A component whose failure can cause the entire system or a critical function to become unavailable.

### Q41. What is read/write separation?

Routing write operations to a primary database and eligible read operations to replicas.

### Q42. What is graceful degradation?

Maintaining core functionality while temporarily reducing non-essential features during failures.

### Q43. What is database connection saturation?

A situation where connection demand exceeds available database connection capacity.

### Q44. What is capacity planning?

Estimating the resources required to handle expected workload and growth.

### Q45. What is the difference between a cache and a database?

A cache prioritizes fast access to reusable data, while a database provides durable data storage and management.

---

# 43. Practical Exercises

Complete these exercises to strengthen your system design skills.

## Beginner Level

1. Explain HLD and LLD with examples.
2. Design a simple Expense Tracker architecture.
3. Identify functional and non-functional requirements.
4. Calculate RPS for an application with 100,000 daily users.
5. Explain vertical and horizontal scaling.
6. Create a stateless Express.js application.
7. Implement Redis caching.
8. Implement Cache-Aside.
9. Create database indexes for an Expense Tracker.
10. Configure Sequelize connection pooling.

## Intermediate Level

11. Design a database replication architecture.
12. Explain primary and read-replica databases.
13. Implement read/write separation.
14. Design a sharding strategy for user records.
15. Implement a simple hash-based shard router.
16. Compare sharding and partitioning.
17. Implement cache invalidation.
18. Handle cache stampede.
19. Configure CDN caching headers.
20. Design an API load-balancing architecture.
21. Optimize a slow SQL query.
22. Implement a background report-generation system.
23. Design a high-availability backend.

## Advanced Level

24. Design a URL shortener.
25. Design an e-commerce platform.
26. Design a real-time chat application.
27. Design a notification system.
28. Design a scalable file-upload service.
29. Design a video-streaming platform.
30. Design a distributed caching architecture.
31. Design a database sharding strategy for 100 million users.
32. Design disaster recovery for a production system.
33. Design a high-availability payment platform.
34. Estimate infrastructure requirements for one million daily active users.
35. Create a complete HLD and LLD document for an application of your choice.

---

# 44. Phase 56 Completion Checklist

| No. | Topic | Status |
|---|---|---|
| 1 | System Design Fundamentals | ☐ |
| 2 | HLD | ☐ |
| 3 | LLD | ☐ |
| 4 | Functional Requirements | ☐ |
| 5 | Non-Functional Requirements | ☐ |
| 6 | Capacity Planning | ☐ |
| 7 | RPS and QPS | ☐ |
| 8 | Scalability | ☐ |
| 9 | Vertical Scaling | ☐ |
| 10 | Horizontal Scaling | ☐ |
| 11 | Stateless Architecture | ☐ |
| 12 | Stateful Architecture | ☐ |
| 13 | High Availability | ☐ |
| 14 | Fault Tolerance | ☐ |
| 15 | Database Replication | ☐ |
| 16 | Synchronous Replication | ☐ |
| 17 | Asynchronous Replication | ☐ |
| 18 | Read/Write Separation | ☐ |
| 19 | Database Sharding | ☐ |
| 20 | Range-Based Sharding | ☐ |
| 21 | Hash-Based Sharding | ☐ |
| 22 | Consistent Hashing | ☐ |
| 23 | Database Partitioning | ☐ |
| 24 | Database Indexing | ☐ |
| 25 | Redis Caching | ☐ |
| 26 | Cache-Aside | ☐ |
| 27 | Write-Through | ☐ |
| 28 | Write-Behind | ☐ |
| 29 | Cache Invalidation | ☐ |
| 30 | Cache Stampede | ☐ |
| 31 | CDN | ☐ |
| 32 | Load Balancing | ☐ |
| 33 | Connection Pooling | ☐ |
| 34 | Database Optimization | ☐ |
| 35 | Performance Optimization | ☐ |
| 36 | Disaster Recovery | ☐ |
| 37 | RPO and RTO | ☐ |
| 38 | URL Shortener Design | ☐ |
| 39 | E-Commerce System Design | ☐ |
| 40 | Chat Application Design | ☐ |
| 41 | Notification System Design | ☐ |
| 42 | Production Architecture | ☐ |

---

# 45. What Comes Next?

**Phase 57: Advanced TypeScript – Design Patterns, SOLID Principles, Clean Architecture, Hexagonal Architecture, Domain-Driven Design, Dependency Injection and Enterprise Application Architecture**

Upcoming topics:

1. Software Design Principles.
2. SOLID Principles.
3. Single Responsibility Principle.
4. Open/Closed Principle.
5. Liskov Substitution Principle.
6. Interface Segregation Principle.
7. Dependency Inversion Principle.
8. DRY, KISS and YAGNI.
9. Creational Design Patterns.
10. Singleton Pattern.
11. Factory Pattern.
12. Abstract Factory Pattern.
13. Builder Pattern.
14. Prototype Pattern.
15. Structural Design Patterns.
16. Adapter Pattern.
17. Decorator Pattern.
18. Facade Pattern.
19. Proxy Pattern.
20. Composite Pattern.
21. Bridge Pattern.
22. Behavioral Design Patterns.
23. Strategy Pattern.
24. Observer Pattern.
25. Command Pattern.
26. State Pattern.
27. Template Method Pattern.
28. Chain of Responsibility.
29. Repository Pattern.
30. Unit of Work Pattern.
31. Dependency Injection.
32. Inversion of Control.
33. Clean Architecture.
34. Hexagonal Architecture.
35. Onion Architecture.
36. Domain-Driven Design.
37. Bounded Context and Aggregates.
38. Domain Services and Repositories.
39. Enterprise Application Architecture.
40. Production-Ready TypeScript Project Architecture.

**Phase 56 is complete.**