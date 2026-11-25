# Phase 63: Advanced TypeScript – Advanced System Design, Scalability, High Availability, Database Sharding, Replication, CAP Theorem, Distributed Algorithms and Large-Scale Architecture

**Level:** Expert / Advanced System Design  
**Prerequisites:** TypeScript, JavaScript, Node.js, Express.js, SQL, MongoDB, Redis, Microservices, Docker, Kubernetes and Phase 62.

---

# 1. Learning Objectives

In this phase, you will learn how to design applications that can handle millions of users, large volumes of data, high traffic and distributed infrastructure.

By the end of this phase, you should understand:

1. System design fundamentals.
2. Functional and non-functional requirements.
3. Vertical and horizontal scaling.
4. Load balancing and reverse proxies.
5. Advanced caching architectures.
6. Database replication and sharding.
7. Consistent hashing.
8. CAP and PACELC theorems.
9. Distributed consensus and leader election.
10. Quorum-based systems.
11. Strong and eventual consistency.
12. Database indexing at scale.
13. Search architecture and Elasticsearch.
14. Distributed rate limiting.
15. Multi-tenant architecture.
16. High availability and fault tolerance.
17. Disaster recovery.
18. Capacity planning.
19. Reliability engineering.
20. Large-scale application architecture.

---

# 2. System Design Fundamentals

## 2.1 What Is System Design?

System design is the process of defining the architecture, components, databases, APIs, communication mechanisms and infrastructure required to build a software application.

It describes how different parts of an application work together.

For example, imagine building an e-commerce application like Amazon.

You need to design:

- User authentication.
- Product catalog.
- Shopping cart.
- Order management.
- Payment processing.
- Inventory management.
- Notifications.
- Search functionality.
- Database architecture.
- Caching.
- Load balancing.
- Deployment infrastructure.

System design determines how these components interact and how the entire application handles traffic, failures and data growth.

### Example: Basic E-commerce Architecture

```text
                  Users
                    |
                    v
               CDN / DNS
                    |
                    v
              Load Balancer
                    |
                    v
               API Gateway
                    |
          +---------+---------+
          |         |         |
          v         v         v
       Auth      Product     Order
       Service   Service    Service
          |         |         |
          v         v         v
        Auth DB   Product DB  Order DB
                    |
                    v
                   Redis
                    |
                    v
              Message Broker
                    |
          +---------+---------+
          |                   |
          v                   v
     Notification         Analytics
       Service             Service
```

This is a simplified architecture. Production systems require additional infrastructure for observability, security, resilience and data management.

---

## 2.2 Functional Requirements

Functional requirements describe **what the system should do**.

Example: E-commerce application.

| Feature | Functional Requirement |
|---|---|
| Authentication | Users can register and log in. |
| Product | Users can browse products. |
| Search | Users can search products. |
| Cart | Users can add and remove products. |
| Orders | Users can place orders. |
| Payment | Users can make payments. |
| Notification | Users receive order updates. |

Functional requirements describe application behavior.

## 2.3 Non-Functional Requirements

Non-functional requirements describe **how well the system should operate**.

Examples:

| Requirement | Meaning |
|---|---|
| Scalability | Handle increasing traffic. |
| Availability | Remain accessible. |
| Reliability | Operate correctly and consistently. |
| Performance | Respond quickly. |
| Security | Protect data and operations. |
| Durability | Preserve committed data. |
| Maintainability | Be easy to modify. |
| Fault Tolerance | Continue operating despite failures. |

### Example

Suppose you are designing an application with the following requirements:

```text
Users: 10 million
Daily active users: 2 million
Peak traffic: 20,000 requests/second
API response target: 200ms
Availability target: 99.99%
Data retention: 5 years
```

These requirements influence your architecture.

For example:

- High traffic requires horizontal scaling.
- Low latency may require caching.
- High availability requires redundancy.
- Large data volumes may require database partitioning or sharding.
- Five-year retention requires storage planning.

**Important:** Never start a large-scale system design by immediately choosing technologies. First understand the requirements, constraints and workload.

---

# 3. Scalability

## 3.1 What Is Scalability?

Scalability is the ability of a system to handle increasing workloads by adding resources.

For example:

Initially:

```text
1,000 users
1 server
```

After growth:

```text
100,000 users
Multiple servers
```

Eventually:

```text
10 million users
Distributed infrastructure
```

A scalable system can grow without requiring a complete architectural redesign every time traffic increases.

There are two primary scaling strategies.

## 3.2 Vertical Scaling

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
Storage: 2 TB
```

### Advantages

- Simple implementation.
- No complex distributed architecture.
- Easier data consistency.
- Fewer infrastructure components.

### Disadvantages

- Hardware has maximum limits.
- Expensive at higher configurations.
- Can create a single point of failure.
- Scaling may require downtime.

## 3.3 Horizontal Scaling

Horizontal scaling means adding more servers instead of increasing the capacity of one server.

```text
                  Load Balancer
                       |
           +-----------+-----------+
           |           |           |
           v           v           v
        Server 1    Server 2    Server 3
           |           |           |
           +-----------+-----------+
                       |
                    Database
```

Instead of upgrading one server, you add additional instances.

### Advantages

- Handles larger workloads.
- Better fault isolation.
- Supports distributed deployments.
- Can scale out incrementally.

### Disadvantages

- More architectural complexity.
- Requires load balancing.
- Shared state becomes challenging.
- Distributed communication introduces latency and failure modes.

### Vertical vs Horizontal Scaling

| Feature | Vertical Scaling | Horizontal Scaling |
|---|---|---|
| Approach | Upgrade existing server | Add more servers |
| Complexity | Lower | Higher |
| Hardware limit | Yes | Can grow across nodes |
| Fault tolerance | Usually limited | Can improve with redundancy |
| Cost | Can become expensive | More flexible |
| Architecture | Simpler | Distributed |

### When Should You Use Them?

Vertical scaling is useful when:

- Application traffic is relatively low.
- You want to keep infrastructure simple.
- The application cannot easily be distributed.

Horizontal scaling is useful when:

- Traffic is continuously increasing.
- High availability is required.
- Workloads can be distributed.
- You need elastic infrastructure.

In real production systems, both strategies are frequently combined.

---

# 4. Stateless Architecture

## 4.1 What Is a Stateless Application?

A stateless application server does not depend on information stored only in its local memory to process future requests.

Consider two application servers:

```text
             Load Balancer
                  |
          +-------+-------+
          |               |
          v               v
       Server A         Server B
```

Suppose a user logs in through Server A.

The next request may reach Server B.

If the session exists only in Server A's memory, Server B cannot access it.

This creates a problem.

### Incorrect Approach

```javascript
const sessions = new Map();

sessions.set("user123", {
  userId: 123,
  loggedIn: true,
});
```

This session exists only inside the current Node.js process.

Another server cannot automatically access it.

### Better Approach: Shared Session Storage

```text
              Load Balancer
                    |
            +-------+-------+
            |               |
            v               v
         Server A        Server B
            |               |
            +-------+-------+
                    |
                    v
                   Redis
```

Example:

```typescript
import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});

await redis.connect();

await redis.set(
  "session:user123",
  JSON.stringify({
    userId: 123,
    loggedIn: true,
  }),
  {
    EX: 3600,
  }
);
```

Both application servers can access the shared session.

Other approaches include:

- JWT-based authentication.
- Database-backed sessions.
- External identity providers.

**Important:** Stateless application servers do not mean the entire system has no state. It means application instances do not rely on their own local memory as the source of shared user state.

---

# 5. Load Balancing

## 5.1 What Is Load Balancing?

Load balancing distributes incoming requests across multiple servers.

Its primary objectives are:

- Distribute traffic.
- Prevent server overload.
- Improve availability.
- Improve performance.
- Support horizontal scaling.

Example:

```text
                 10,000 Requests
                        |
                        v
                  Load Balancer
                        |
          +-------------+-------------+
          |             |             |
          v             v             v
       Server A      Server B      Server C
        3,300          3,400          3,300
```

The numbers are illustrative, not a guaranteed distribution.

## 5.2 Load Balancing Algorithms

### A. Round Robin

Requests are distributed sequentially.

```text
Request 1 -> Server A
Request 2 -> Server B
Request 3 -> Server C
Request 4 -> Server A
Request 5 -> Server B
```

Useful when servers have similar capacity.

### B. Weighted Round Robin

Servers receive traffic according to their assigned weights.

```text
Server A: Weight 5
Server B: Weight 3
Server C: Weight 2
```

Server A receives approximately 50% of traffic, B 30%, and C 20%, assuming the algorithm and health state permit it.

### C. Least Connections

Requests are sent to the server with the fewest active connections.

```text
Server A: 100 connections
Server B:  40 connections
Server C:  20 connections
```

The next request may go to Server C.

Useful when requests have different processing durations.

### D. IP Hash

The client IP address is hashed to select a server.

```text
Client IP
   |
   v
Hash Function
   |
   v
Selected Server
```

This can provide session affinity, but NAT, changing IP addresses and uneven client distribution can cause problems.

### E. Consistent Hashing

Requests or keys are mapped to nodes using a hash ring.

We will explore this in detail later.

## 5.3 Popular Load Balancers

- NGINX
- HAProxy
- Traefik
- AWS Elastic Load Balancing

---

# 6. Reverse Proxy Architecture

## 6.1 What Is a Reverse Proxy?

A reverse proxy is a server that receives requests from clients and forwards them to backend servers.

```text
             Client
                |
                v
           Reverse Proxy
                |
       +--------+--------+
       |        |        |
       v        v        v
    Server A Server B Server C
```

The client communicates with the reverse proxy rather than directly selecting a backend server.

### Responsibilities

1. Load balancing.
2. SSL/TLS termination.
3. Request routing.
4. Compression.
5. Caching.
6. Rate limiting.
7. Security filtering.

## 6.2 Reverse Proxy vs Forward Proxy

| Feature | Forward Proxy | Reverse Proxy |
|---|---|---|
| Represents | Client | Server infrastructure |
| Position | In front of clients | In front of backend servers |
| Main purpose | Control outbound traffic | Manage inbound traffic |
| Example | Corporate internet proxy | NGINX |

### Forward Proxy

```text
Client -> Forward Proxy -> Internet
```

### Reverse Proxy

```text
Internet -> Reverse Proxy -> Backend Server
```

## 6.3 Layer 4 vs Layer 7 Load Balancing

| Feature | Layer 4 | Layer 7 |
|---|---|---|
| OSI Layer | Transport | Application |
| Routing information | IP, TCP/UDP ports | HTTP information |
| URL-based routing | No | Yes |
| Header-based routing | No | Yes |
| Protocol awareness | Limited | Higher |

Example:

Layer 7 routing:

```text
/api/users    -> User Service
/api/products -> Product Service
/api/orders   -> Order Service
```

Layer 4 routing generally works with transport-level connection information rather than HTTP paths.

---

# 7. Caching Architecture

## 7.1 What Is Caching?

Caching stores frequently accessed data in a faster storage layer so that future requests can retrieve it more quickly.

Example:

Without caching:

```text
User Request
     |
     v
Application Server
     |
     v
Database
     |
     v
Response
```

With caching:

```text
User Request
     |
     v
Application Server
     |
     v
    Redis
     |
     +------ Cache Hit ------> Response
     |
     +------ Cache Miss
                  |
                  v
               Database
                  |
                  v
             Update Cache
                  |
                  v
               Response
```

## 7.2 Types of Caching

### A. Browser Cache

Stores static assets in the user's browser.

Examples:

- CSS files.
- JavaScript bundles.
- Images.
- Fonts.

### B. CDN Cache

A Content Delivery Network caches content closer to users geographically.

Examples:

- Cloudflare.
- AWS CloudFront.
- Akamai.

### C. Application Cache

Stores frequently used application data.

Example:

```typescript
const productCache = new Map<string, unknown>();
```

However, this cache is local to one process and is not shared across multiple application instances.

### D. Distributed Cache

Uses shared cache infrastructure such as Redis.

```typescript
await redis.set(
  "product:101",
  JSON.stringify({
    id: 101,
    name: "Laptop",
    price: 75000,
  }),
  {
    EX: 300,
  }
);
```

## 7.3 Cache Strategies

### A. Cache-Aside

The application checks the cache first.

If the data is missing, it retrieves the data from the database and stores it in the cache.

```typescript
async function getProduct(productId: number) {
  const cacheKey = `product:${productId}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (product) {
    await redis.set(
      cacheKey,
      JSON.stringify(product),
      {
        EX: 300,
      }
    );
  }

  return product;
}
```

### B. Read-Through Cache

The cache layer is responsible for retrieving data from the underlying data source when a cache miss occurs.

The application interacts with the cache abstraction rather than implementing the database fallback itself.

### C. Write-Through Cache

Data is written to the cache and underlying database as part of the write operation.

```text
Application
     |
     v
   Cache
     |
     v
  Database
```

The cache and database are updated together from the application's perspective, although actual atomicity depends on the implementation.

### D. Write-Back Cache

Data is written to the cache first and persisted to the database asynchronously.

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

This can improve write performance, but it introduces a durability risk if cached changes are lost before persistence.

### Comparison

| Strategy | Read Behavior | Write Behavior |
|---|---|---|
| Cache-Aside | Application checks cache | Application updates database and usually invalidates cache |
| Read-Through | Cache loads missing data | Depends on write strategy |
| Write-Through | Cache serves reads | Cache and database updated together |
| Write-Back | Cache serves reads | Cache updated first; database updated asynchronously |

## 7.4 Cache Invalidation

Cache invalidation means removing or updating stale cached data.

Example:

```typescript
async function updateProduct(
  productId: number,
  newPrice: number
) {
  await db.product.update({
    where: {
      id: productId,
    },
    data: {
      price: newPrice,
    },
  });

  await redis.del(`product:${productId}`);
}
```

This is a common cache-aside invalidation pattern.

## 7.5 Cache Stampede

A cache stampede occurs when many requests simultaneously experience a cache miss and all query the database.

```text
              Cache Miss
                   |
        +----------+----------+
        |          |          |
        v          v          v
      Query      Query      Query
        |          |          |
        +----------+----------+
                   |
                   v
                Database
```

Possible solutions:

- Request coalescing.
- Distributed locks.
- Randomized TTL.
- Background cache refresh.
- Stale-while-revalidate.

### Important Concepts

**TTL:** Time To Live. Determines how long cached data remains valid.

**Cache Hit:** Requested data is found in the cache.

**Cache Miss:** Requested data is not found in the cache.

**Cache Invalidation:** Removing or refreshing stale data.

---

# 8. Database Replication

## 8.1 What Is Database Replication?

Replication means maintaining copies of database data across multiple database servers.

Example:

```text
               Primary Database
                      |
             Replication Stream
                      |
           +----------+----------+
           |                     |
           v                     v
      Replica 1              Replica 2
```

The primary database handles writes, while replicas maintain copies of its data.

Replication is commonly used for:

- Read scaling.
- High availability.
- Disaster recovery support.
- Geographic distribution.

## 8.2 Primary-Replica Architecture

### Primary Database

Responsible for handling write operations.

### Replica Database

Receives changes from the primary and can serve read requests.

Example:

```text
                  Application
                       |
              +--------+--------+
              |                 |
              v                 v
           Writes             Reads
              |                 |
              v                 v
           Primary           Replica
```

## 8.3 Synchronous Replication

In synchronous replication, the primary waits for the required replica acknowledgement before considering a write committed according to the configured durability policy.

```text
Application
     |
     v
Primary Database
     |
     v
Replica Database
     |
     v
Acknowledgement
     |
     v
Application Response
```

### Advantages

- Stronger durability guarantees under the configured acknowledgement policy.
- Reduced risk of losing acknowledged writes during certain failures.

### Disadvantages

- Higher write latency.
- Availability can be affected if required replicas are unavailable.
- Cross-region synchronous replication can be expensive and slow.

## 8.4 Asynchronous Replication

In asynchronous replication, the primary can acknowledge the write before replicas have applied it.

```text
Application
     |
     v
Primary Database
     |
     +------> Acknowledge Application
     |
     v
Replica Database
```

### Advantages

- Lower write latency.
- Less dependency on replica response time.
- Useful for geographically distributed replicas.

### Disadvantages

- Replication lag.
- Recently committed writes may not immediately appear on replicas.
- Failover may lose acknowledged transactions that have not reached the promoted replica.

## 8.5 Replication Lag

Replication lag is the delay between a write occurring on the primary and becoming visible on a replica.

Example:

```text
Time 10:00:00
User updates account balance.

Primary:
Balance = 5000

Replica:
Balance = 4000

Time 10:00:03
Replica catches up.

Replica:
Balance = 5000
```

This creates a potential read-after-write problem.

### Solution: Read-After-Write Routing

After a user updates data, route subsequent reads to the primary for an appropriate period or until the required replication position has been reached.

Other solutions include:

- Session consistency mechanisms.
- Replication-position tracking.
- Synchronous replication.
- Reading from the primary for critical operations.

## 8.6 Failover

Failover means switching database operations from a failed primary to another eligible database node.

```text
Before Failure:

Primary DB
     |
     v
Replica DB


After Failure:

Replica DB
     |
     v
Promoted Primary
```

Production failover needs:

- Health checks.
- Leader or primary election.
- Fencing of the old primary.
- Replication-state verification.
- Connection redirection.
- Split-brain prevention.

## 8.7 Split-Brain Problem

Split-brain occurs when multiple nodes incorrectly believe they are the authoritative primary.

```text
       Node A
       Primary
          |
     Network Failure
          |
       Node B
       Primary
```

Both nodes may accept writes independently.

This can produce conflicting data.

Possible protections:

- Quorum-based leader election.
- Fencing tokens.
- Consensus protocols.
- Single-writer guarantees.
- Proper failure detection.

**Important:** Replication is not a backup. Accidental deletion or corruption can replicate to other nodes. Backups and point-in-time recovery are separate requirements.

---

# 9. Database Sharding

## 9.1 What Is Database Sharding?

Database sharding is a technique for distributing different subsets of data across multiple database servers.

Each subset is called a **shard**.

Example:

Imagine a users table containing 100 million records.

Instead of storing all records on one database server, we distribute them.

```text
              Application
                   |
              Shard Router
                   |
         +---------+---------+
         |         |         |
         v         v         v
      Shard 1   Shard 2   Shard 3
      Users     Users     Users
      1-33M     33-66M    66-100M
```

Each shard owns a subset of the total data.

## 9.2 Why Is Sharding Needed?

A single database server may eventually become a bottleneck because of:

- CPU limitations.
- Memory limitations.
- Disk I/O limitations.
- Storage capacity.
- Connection limits.
- High query volume.

Sharding distributes data and workload across multiple database nodes.

## 9.3 Types of Sharding

### A. Range-Based Sharding

Records are distributed based on ranges of a particular field.

Example:

```text
Shard 1: User IDs 1 - 1,000,000

Shard 2: User IDs 1,000,001 - 2,000,000

Shard 3: User IDs 2,000,001 - 3,000,000
```

Advantages:

- Easy to understand.
- Efficient range queries.

Disadvantages:

- Hotspots may occur.
- New records may overload the latest shard.

### B. Hash-Based Sharding

A hash function determines which shard receives a record.

```typescript
function getShard(
  userId: number,
  totalShards: number
): number {
  return userId % totalShards;
}

console.log(getShard(101, 4));
```

Example:

```text
User 101 -> Shard 1
User 102 -> Shard 2
User 103 -> Shard 3
User 104 -> Shard 0
```

Advantages:

- Can distribute records more evenly.
- Reduces some range-based hotspots.

Disadvantages:

- Range queries become harder.
- Changing shard count can remap many records.

### C. Directory-Based Sharding

A lookup service maintains a mapping between keys and shards.

```text
User ID       Shard

101           Shard 2
102           Shard 1
103           Shard 3
104           Shard 2
```

The application queries the mapping to find the correct shard.

Advantages:

- Flexible placement.
- Easier custom distribution.

Disadvantages:

- Directory becomes an additional dependency.
- Directory availability and performance matter.

## 9.4 Shard Key

A shard key is the field or combination of fields used to distribute data.

Example:

```json
{
  "userId": 101,
  "name": "John",
  "city": "Ahmedabad"
}
```

Possible shard keys:

```text
userId
city
email
```

Choosing a shard key is one of the most important decisions in database sharding.

A good shard key should ideally:

- Distribute data evenly.
- Distribute write traffic.
- Support common query patterns.
- Avoid hotspots.
- Minimize cross-shard operations.

## 9.5 Hotspot Problem

A hotspot occurs when one shard receives disproportionately high traffic.

Example:

```text
Shard 1: 10,000 requests/sec
Shard 2: 1,000 requests/sec
Shard 3: 900 requests/sec
```

Shard 1 becomes a bottleneck.

Possible solutions:

- Better shard-key selection.
- Consistent hashing.
- Splitting hot partitions.
- Salting keys.
- Caching frequently accessed data.

## 9.6 Cross-Shard Queries

Suppose users are distributed across three shards.

You want to find all users whose account balance exceeds ₹100,000.

The query may need to execute on every shard.

```text
              Query Router
                   |
        +----------+----------+
        |          |          |
        v          v          v
      Shard 1   Shard 2    Shard 3
        |          |          |
        +----------+----------+
                   |
                   v
             Merge Results
```

Cross-shard queries are more complex and may be expensive.

## 9.7 Sharding vs Partitioning

These concepts are related but different.

| Feature | Partitioning | Sharding |
|---|---|---|
| Meaning | Divide data into partitions | Distribute data across nodes |
| Location | Often within one database server | Across multiple database nodes |
| Main purpose | Manage large datasets and improve query efficiency | Distribute storage and workload |
| Infrastructure | May use one server | Uses multiple nodes |
| Complexity | Usually lower | Usually higher |

For example:

A PostgreSQL table can be partitioned by month while remaining on one database server.

Sharding distributes data across separate database nodes.

**Important:** Sharding and replication are often combined. Each shard may have its own replica set.

---

# 10. Consistent Hashing

## 10.1 What Is Consistent Hashing?

Consistent hashing is a hashing technique used to distribute keys across nodes while minimizing the number of keys that must move when nodes are added or removed.

It is useful in:

- Distributed caches.
- Distributed databases.
- Load balancing.
- Distributed storage systems.

## 10.2 Problem With Normal Hashing

Suppose we have three servers:

```text
Server A
Server B
Server C
```

We use:

```typescript
function getServer(
  key: string,
  totalServers: number
): number {
  return hash(key) % totalServers;
}
```

If we add another server, the modulo value changes.

A large number of keys may map to different servers.

This creates expensive data movement.

## 10.3 Hash Ring Concept

Consistent hashing places nodes and keys on a circular hash space.

```text
                 0
                 |
          Server A
                 |
        ----------------
       /                \
      /                  \
Server D                Server B
      \                  /
       \                /
        ----------------
                 |
             Server C
```

Each key is assigned to the next node clockwise on the ring.

### Example

```text
Key A -> Server A
Key B -> Server B
Key C -> Server C
```

When a new server is added, only keys in the affected ring segment generally need to move.

## 10.4 Virtual Nodes

A physical server can be represented by multiple positions on the hash ring.

```text
Physical Server A:

A-1
A-2
A-3
A-4
```

These positions are called virtual nodes.

Advantages:

- Better distribution.
- More balanced load.
- Easier node rebalancing.

### Consistent Hashing vs Normal Hashing

| Feature | Normal Modulo Hashing | Consistent Hashing |
|---|---|---|
| Node addition | Many keys may move | Usually fewer keys move |
| Node removal | Many keys may move | Usually fewer keys move |
| Distribution | Depends on hash and node count | Can be improved with virtual nodes |
| Complexity | Low | Higher |

---

# 11. CAP Theorem

## 11.1 What Is CAP Theorem?

The CAP theorem describes three properties of distributed data systems:

- Consistency.
- Availability.
- Partition Tolerance.

A distributed system cannot guarantee both consistency and availability for every operation during a network partition.

Let's understand each property.

## 11.2 Consistency (C)

Consistency in CAP refers to a strong consistency guarantee: operations behave as though they occurred atomically in a single-copy system, commonly described through linearizability.

Example:

```text
Account Balance = ₹10,000
```

A user withdraws ₹2,000.

The system should not return the old balance after acknowledging the update if it claims linearizable behavior.

## 11.3 Availability (A)

Availability means every request received by a non-failing node gets a response.

The response may not contain the latest data.

This distinction is important.

Availability does not necessarily mean the response is correct according to the newest global state.

## 11.4 Partition Tolerance (P)

A network partition occurs when nodes cannot communicate with each other because of a network failure.

Example:

```text
          Node A
             |
        Network Failure
             X
        Network Failure
             |
          Node B
```

The nodes cannot exchange messages.

Distributed systems must be designed to handle network partitions because communication failures are possible.

## 11.5 Understanding CAP During a Partition

Imagine two replicas:

```text
Replica A: Balance = ₹10,000
Replica B: Balance = ₹10,000
```

A network partition separates them.

A user requests a withdrawal of ₹2,000 through Replica A.

Replica B cannot receive the update.

The system must make a choice for affected operations.

### Option 1: Prioritize Consistency

The system refuses or delays operations that cannot be safely completed.

```text
Request -> No successful response
```

This avoids accepting conflicting updates.

### Option 2: Prioritize Availability

The system continues accepting requests.

```text
Replica A: Balance = ₹8,000
Replica B: Balance = ₹10,000
```

Now the replicas may disagree.

The system needs reconciliation or conflict resolution later.

## 11.6 CAP Summary

| Property | Meaning |
|---|---|
| Consistency | Reads observe a value consistent with the required strong consistency guarantee |
| Availability | Every request to a non-failing node receives a response |
| Partition Tolerance | System continues operating despite network partitions, according to its chosen guarantees |

**Important:** CAP is not a simple rule that a database must permanently choose only two properties. It describes a tradeoff during network partitions.

In normal operation, a system may provide both strong consistency and availability.

---

# 12. PACELC Theorem

CAP primarily describes tradeoffs during network partitions.

PACELC extends the discussion.

PACELC means:

- If Partition (P), choose between Availability (A) and Consistency (C).
- Else (E), choose between Latency (L) and Consistency (C).

In other words:

```text
If Network Partition:
    Availability vs Consistency

Else:
    Latency vs Consistency
```

## Example

Suppose a distributed database has replicas in India and the United States.

A write occurs in India.

To provide stronger cross-region consistency, the system may need to wait for remote acknowledgement.

This increases latency.

If the system prioritizes lower latency, it may acknowledge the write before every replica has received it.

This can introduce temporary inconsistency.

### CAP vs PACELC

| Feature | CAP | PACELC |
|---|---|---|
| Network partition tradeoff | Yes | Yes |
| Normal-operation tradeoff | Not explicitly | Yes |
| Focus | Consistency vs availability during partition | Partition behavior plus latency vs consistency |

---

# 13. Consistency Models

Different distributed systems provide different consistency guarantees.

## 13.1 Strong Consistency

A successful write is immediately visible to subsequent reads under the system's defined consistency guarantee.

Example:

```text
Write:
Balance = ₹5,000

Next Read:
Balance = ₹5,000
```

A common strong consistency model is linearizability.

## 13.2 Eventual Consistency

Replicas may temporarily return different values, but if no new updates occur and communication recovers, they eventually converge.

Example:

```text
Primary:
Status = Delivered

Replica:
Status = Shipped
```

After replication:

```text
Replica:
Status = Delivered
```

## 13.3 Read-Your-Writes Consistency

A user should be able to see their own successful updates in subsequent reads.

Example:

```text
User updates profile name.

User reads profile.

Updated name is returned.
```

## 13.4 Monotonic Reads

Once a user has seen a particular version of data, subsequent reads should not return an older version.

## 13.5 Causal Consistency

Operations that are causally related should be observed in an order that preserves their causal relationship.

Example:

```text
1. User creates a post.
2. Another user comments on that post.
```

The comment should not become visible before the post in a way that violates the causal relationship.

### Comparison

| Model | Guarantee |
|---|---|
| Strong / Linearizable | Operations appear to occur atomically in real-time order |
| Eventual | Replicas converge if updates stop and communication recovers |
| Read-Your-Writes | Users see their own successful writes |
| Monotonic Reads | Users do not move backward to older observed versions |
| Causal | Causally related operations preserve their order |

---

# 14. Distributed Consensus

## 14.1 What Is Distributed Consensus?

Distributed consensus is the process by which multiple nodes agree on a value, decision or sequence of operations despite failures.

It is important in systems that require coordinated decisions.

Examples:

- Leader election.
- Replicated logs.
- Distributed metadata management.
- Cluster coordination.

## 14.2 Why Is Consensus Needed?

Imagine a database cluster:

```text
Node A
Node B
Node C
```

All three nodes need to agree on which node is the primary.

If they independently select different primaries, conflicting writes may occur.

Consensus protocols help coordinate these decisions.

## 14.3 Leader Election

Leader election selects one node to coordinate a group of nodes.

```text
          Leader
             |
       +-----+-----+
       |     |     |
       v     v     v
    Follower Follower Follower
```

The leader may coordinate:

- Writes.
- Replication.
- Metadata updates.
- Cluster membership operations.

A leader can fail, in which case the system may elect another leader.

---

# 15. Raft Consensus Algorithm

## 15.1 What Is Raft?

Raft is a consensus algorithm designed to make distributed consensus easier to understand and implement.

It is used for replicated state machines.

Raft nodes operate in three main roles:

1. Leader.
2. Follower.
3. Candidate.

## 15.2 Raft Node Roles

### Follower

Receives requests and replication messages from the leader.

### Candidate

Attempts to become leader after an election timeout.

### Leader

Accepts log entries and coordinates replication.

## 15.3 Raft Leader Election

Suppose we have three nodes:

```text
Node A
Node B
Node C
```

Initially, all are followers.

If a follower does not receive a valid heartbeat within its election timeout, it may become a candidate.

The candidate requests votes from other nodes.

```text
             Candidate A
                  |
             Request Votes
              /       \
             v         v
          Node B     Node C
```

If the candidate receives votes from a majority, it becomes leader.

For three nodes:

```text
Majority = 2
```

## 15.4 Raft Log Replication

The leader receives a write operation.

```text
Client
  |
  v
Leader
  |
  +------> Follower 1
  |
  +------> Follower 2
```

The leader replicates the log entry.

Once the required majority conditions are satisfied, the entry can be committed.

The committed entry is then applied to the replicated state machine.

## 15.5 Important Raft Concepts

| Concept | Meaning |
|---|---|
| Term | Logical election period |
| Leader | Coordinates the cluster |
| Follower | Replicates leader operations |
| Candidate | Requests votes |
| Log | Ordered sequence of operations |
| Heartbeat | Leader communication to followers |
| Majority | More than half of the voting members |
| Commit Index | Highest log entry known to be committed |

**Important:** Raft is not simply a voting algorithm. It also defines log replication, safety properties and rules for leader election.

---

# 16. Quorum-Based Systems

## 16.1 What Is a Quorum?

A quorum is the minimum number of nodes that must participate or respond for an operation to satisfy a configured rule.

Example:

```text
Total Replicas = 5
Required Votes = 3
```

Three out of five nodes form a majority quorum.

## 16.2 Read and Write Quorums

In a simple replicated key-value system:

- N = Total replicas.
- R = Number of replicas required for a read.
- W = Number of replicas required for a write.

A commonly used overlap condition is:

```text
R + W > N
```

This ensures that read and write replica sets overlap in the simple quorum model.

### Example

```text
N = 3
R = 2
W = 2
```

Therefore:

```text
R + W = 4

4 > 3
```

The read and write quorums must overlap.

### Another Example

```text
N = 5
R = 3
W = 3
```

```text
R + W = 6

6 > 5
```

Again, overlap is guaranteed.

## 16.3 Quorum Tradeoffs

| Configuration | Behavior |
|---|---|
| Higher R | More read confirmation, potentially higher read latency |
| Higher W | More write confirmation, potentially higher write latency |
| Lower R | Faster reads, potentially weaker freshness |
| Lower W | Faster writes, potentially weaker durability |

**Important:** Quorum overlap alone does not guarantee linearizability. Actual consistency depends on versioning, conflict resolution, leader rules, read repair and the database's write/read semantics.

---

# 17. Distributed Transactions and Consistency Strategies

We covered distributed transactions in Phase 62. Here is how to select the appropriate approach in large-scale systems.

## 17.1 Local Database Transaction

A transaction inside one database.

```typescript
await db.$transaction(async (tx) => {
  await tx.account.update({
    where: {
      id: 1,
    },
    data: {
      balance: {
        decrement: 1000,
      },
    },
  });

  await tx.transaction.create({
    data: {
      accountId: 1,
      amount: -1000,
    },
  });
});
```

Use it when all related operations belong to the same transactional database boundary.

## 17.2 Two-Phase Commit

Two-Phase Commit coordinates a distributed transaction using:

1. Prepare.
2. Commit or Abort.

It can provide atomic transaction semantics across participating systems, but introduces coordinator dependency, blocking scenarios and operational complexity.

## 17.3 Saga Pattern

Saga coordinates multiple local transactions through a sequence of actions and compensating actions.

Example:

```text
Order Created
     |
     v
Payment Processed
     |
     v
Inventory Reserved
     |
     v
Shipping Scheduled
```

If shipping fails:

```text
Cancel Inventory Reservation
          |
          v
Refund Payment
          |
          v
Cancel Order
```

Compensation counteracts business effects; it does not necessarily erase historical records.

## 17.4 Transactional Outbox

The transactional outbox pattern solves the database dual-write problem.

```text
Database Transaction
        |
        +----> Save Order
        |
        +----> Save Outbox Event
```

A background publisher sends the event to a broker.

Because publishing can happen more than once, consumers must be idempotent.

### When to Use What?

| Scenario | Suitable Approach |
|---|---|
| One database | Local transaction |
| Multiple services with independent transactions | Saga |
| Atomic coordination across participating transactional resources | 2PC, when justified |
| Reliable event publishing from a database transaction | Transactional Outbox |

---

# 18. Database Read and Write Strategies

Large-scale applications often separate read-heavy and write-heavy workloads.

## 18.1 Read Replicas

Read requests can be distributed across replicas.

```text
                Application
                     |
             +-------+-------+
             |               |
             v               v
           Writes           Reads
             |               |
             v               v
          Primary        Read Replicas
                           /       \
                          v         v
                       Replica 1  Replica 2
```

This reduces read load on the primary.

However, replication lag must be considered.

## 18.2 CQRS

CQRS stands for Command Query Responsibility Segregation.

It separates operations that modify state from operations that read state.

```text
              Application
                   |
          +--------+--------+
          |                 |
          v                 v
       Commands           Queries
          |                 |
          v                 v
      Write Model        Read Model
          |                 |
          v                 v
      Write DB           Read DB
```

Advantages:

- Independent scaling.
- Optimized read models.
- Clear separation of responsibilities.

Disadvantages:

- More infrastructure.
- Data synchronization complexity.
- Eventual consistency may be introduced.

CQRS does not require Event Sourcing.

## 18.3 Batching

Instead of executing many individual database operations, group operations where possible.

Less efficient:

```typescript
for (const userId of userIds) {
  await db.user.findUnique({
    where: {
      id: userId,
    },
  });
}
```

More efficient for many database drivers and query patterns:

```typescript
const users = await db.user.findMany({
  where: {
    id: {
      in: userIds,
    },
  },
});
```

The second approach can reduce round trips.

## 18.4 Write Queues

For high-volume asynchronous workloads, write requests can be placed in a queue and processed by background workers.

```text
Application
     |
     v
Message Queue
     |
     v
Worker Pool
     |
     v
Database
```

This can smooth traffic spikes.

However, it introduces asynchronous completion and requires careful handling of retries, ordering, idempotency and failures.

---

# 19. Database Indexing at Scale

## 19.1 What Is a Database Index?

An index is a data structure that helps the database locate records without scanning the entire table.

Without an index:

```sql
SELECT *
FROM users
WHERE email = 'user@example.com';
```

The database may need to scan many rows.

With an appropriate index:

```sql
CREATE INDEX idx_users_email
ON users(email);
```

The database can use the index to locate matching rows more efficiently.

## 19.2 B-Tree Index

B-Tree indexes are commonly used in relational databases.

They support:

- Equality lookups.
- Range queries.
- Ordered traversal.
- Sorting in suitable query plans.

Example:

```sql
CREATE INDEX idx_orders_created_at
ON orders(created_at);
```

## 19.3 Composite Index

A composite index contains multiple columns.

```sql
CREATE INDEX idx_orders_user_status
ON orders(user_id, status);
```

This index is particularly useful for queries that filter using the leading column or a suitable leftmost prefix.

Example:

```sql
SELECT *
FROM orders
WHERE user_id = 101
  AND status = 'completed';
```

## 19.4 Covering Index

A covering index contains all the columns needed by a particular query, potentially allowing the database to answer it without fetching the full table row.

Example:

```sql
CREATE INDEX idx_orders_user_status_amount
ON orders(user_id, status, amount);
```

Query:

```sql
SELECT user_id, status, amount
FROM orders
WHERE user_id = 101;
```

The database may be able to use only the index, depending on its execution plan.

## 19.5 Index Selectivity

Selectivity measures how effectively an index narrows down the rows.

Example:

```text
Gender:
Male / Female
```

This column has relatively low cardinality.

An index on it may be less useful for certain queries.

Compare:

```text
Email:
user1@example.com
user2@example.com
user3@example.com
```

Email usually has much higher cardinality.

### Indexing Best Practices

1. Index frequently queried columns.
2. Analyze query execution plans.
3. Avoid unnecessary indexes.
4. Consider composite indexes based on actual query patterns.
5. Monitor index size.
6. Remember that indexes slow down some writes.
7. Re-evaluate indexes as workload changes.

**Important:** Indexes improve particular access patterns; they are not a universal performance solution.

---

# 20. Search Architecture

## 20.1 Why Do We Need Search Engines?

Relational databases are excellent for transactional operations.

However, advanced search requirements may need specialized search infrastructure.

Examples:

- Full-text search.
- Fuzzy matching.
- Typo tolerance.
- Relevance ranking.
- Faceted filtering.
- Search suggestions.

Example:

A user searches:

```text
wireles hedphones
```

A search engine may identify:

```text
Wireless Headphones
```

A basic SQL equality query would not naturally provide this behavior.

## 20.2 Search Architecture

```text
              Application
                   |
                   v
              Search API
                   |
                   v
              Elasticsearch
                   |
          +--------+--------+
          |                 |
          v                 v
       Shard 1            Shard 2
          |                 |
          v                 v
       Replica            Replica
```

## 20.3 What Is Elasticsearch?

Elasticsearch is a distributed search and analytics engine built around the Apache Lucene search library.

It supports:

- Full-text search.
- Filtering.
- Aggregations.
- Distributed indexing.
- Search analytics.

## 20.4 Elasticsearch Concepts

| Concept | Meaning |
|---|---|
| Index | Logical collection of documents |
| Document | Individual JSON record |
| Shard | Partition of an index |
| Replica | Copy of a shard |
| Mapping | Defines document field types |
| Analyzer | Processes text for indexing and searching |
| Inverted Index | Maps terms to documents containing them |
| Refresh | Makes recent indexing changes searchable |

## 20.5 Inverted Index

Suppose we have these documents:

```text
Document 1:
Wireless Bluetooth Headphones

Document 2:
Wired Gaming Headphones

Document 3:
Bluetooth Speakers
```

An inverted index may conceptually look like:

```text
Wireless  -> Document 1
Bluetooth -> Document 1, Document 3
Headphones -> Document 1, Document 2
Wired -> Document 2
Gaming -> Document 2
Speakers -> Document 3
```

Instead of scanning every document, the search engine uses term-to-document mappings.

## 20.6 Database vs Elasticsearch

| Feature | Relational Database | Elasticsearch |
|---|---|---|
| Main purpose | Transactional data management | Search and analytics |
| Transactions | Strong transactional capabilities | Not a replacement for relational ACID transactions |
| Full-text search | Supported | Specialized search functionality |
| Complex joins | Strong support | Different data modeling approach |
| Search relevance | More limited | Advanced relevance scoring |
| Data consistency | Depends on database configuration | Search visibility is typically near-real-time |

### Recommended Architecture

For most transactional applications:

```text
              Application
                   |
                   v
             Primary Database
                   |
                   v
             Outbox / CDC
                   |
                   v
             Message Broker
                   |
                   v
          Search Index Worker
                   |
                   v
             Elasticsearch
```

The relational database remains the authoritative source for business records.

Elasticsearch serves as a search-oriented read model.

---

# 21. Rate Limiting Algorithms

## 21.1 What Is Rate Limiting?

Rate limiting restricts how many requests a client can make during a specified period.

Example:

```text
Maximum Requests: 100
Time Window: 1 Minute
```

If the client exceeds the limit, the server may return:

```http
HTTP/1.1 429 Too Many Requests
```

Rate limiting protects:

- APIs.
- Databases.
- Authentication endpoints.
- External services.
- Infrastructure capacity.

## 21.2 Fixed Window Algorithm

The system counts requests inside fixed time intervals.

Example:

```text
10:00:00 - 10:01:00

Maximum Requests = 100
```

The counter resets at the next window.

Problem: Boundary bursts.

A client could send 100 requests just before the minute ends and another 100 immediately afterward.

## 21.3 Sliding Window Log

Stores timestamps of requests.

For every incoming request:

1. Remove timestamps outside the active window.
2. Count remaining requests.
3. Reject if the limit is reached.
4. Otherwise add the new timestamp.

This is accurate but may consume significant storage.

## 21.4 Sliding Window Counter

Combines the current and previous fixed-window counters using a weighted estimate.

It reduces boundary bursts without storing every individual request timestamp.

## 21.5 Token Bucket Algorithm

A bucket contains tokens.

Each request consumes one token.

Tokens are added at a fixed refill rate.

Example:

```text
Bucket Capacity = 10 Tokens
Refill Rate = 2 Tokens/Second
```

If a request arrives:

- Token available: Allow request.
- No token available: Reject request.

### TypeScript Implementation

```typescript
class TokenBucket {
  private tokens: number;

  private lastRefillTime: number;

  constructor(
    private capacity: number,
    private refillRate: number
  ) {
    this.tokens = capacity;
    this.lastRefillTime = Date.now();
  }

  private refill(): void {
    const now = Date.now();

    const elapsedSeconds =
      (now - this.lastRefillTime) / 1000;

    const newTokens =
      elapsedSeconds * this.refillRate;

    this.tokens = Math.min(
      this.capacity,
      this.tokens + newTokens
    );

    this.lastRefillTime = now;
  }

  allowRequest(): boolean {
    this.refill();

    if (this.tokens >= 1) {
      this.tokens -= 1;

      return true;
    }

    return false;
  }
}

const limiter = new TokenBucket(10, 2);

console.log(limiter.allowRequest());
```

This is an in-memory demonstration for one process. It is not suitable as a shared production rate limiter across multiple application instances.

## 21.6 Leaky Bucket Algorithm

The leaky bucket processes incoming requests at a controlled output rate.

```text
Incoming Requests
        |
        v
      Bucket
        |
        v
  Controlled Processing
```

It helps smooth traffic.

### Token Bucket vs Leaky Bucket

| Feature | Token Bucket | Leaky Bucket |
|---|---|---|
| Burst handling | Allows bursts up to capacity | Smooths outgoing traffic |
| Mechanism | Tokens refill over time | Requests drain at controlled rate |
| Main use | API rate limiting | Traffic shaping |
| Output | Can be bursty | More uniform |

## 21.7 Distributed Rate Limiting

A local in-memory rate limiter does not work reliably across multiple servers.

Example:

```text
           Load Balancer
                |
       +--------+--------+
       |                 |
       v                 v
    Server A          Server B
       |                 |
       v                 v
  Local Counter     Local Counter
```

Each server maintains a different counter.

A client may bypass the intended limit by sending requests to different servers.

### Solution: Redis-Based Rate Limiting

```text
           Load Balancer
                |
       +--------+--------+
       |                 |
       v                 v
    Server A          Server B
       |                 |
       +--------+--------+
                |
                v
               Redis
```

Redis provides shared state.

For correctness under concurrency, use atomic Redis operations or Lua scripts rather than separate non-atomic read/modify/write commands.

Production rate limits should consider:

- User identity.
- Tenant ID.
- API key.
- IP address.
- API route.
- Subscription plan.

Do not trust a user-supplied identity without authentication and authorization.

---

# 22. Multi-Tenant Architecture

## 22.1 What Is Multi-Tenancy?

Multi-tenancy means one application infrastructure serves multiple customers or organizations.

Each customer is called a tenant.

Example:

A SaaS application provides expense tracking to 100 companies.

```text
                 SaaS Application
                        |
          +-------------+-------------+
          |             |             |
          v             v             v
       Company A     Company B     Company C
```

Each company must access only its own data.

## 22.2 Multi-Tenant Database Strategies

### A. Shared Database, Shared Schema

All tenants share the same database and tables.

Each record includes a tenant identifier.

```sql
CREATE TABLE expenses (
    id BIGINT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    amount DECIMAL(12,2),
    description VARCHAR(255)
);
```

Query:

```sql
SELECT *
FROM expenses
WHERE tenant_id = 101;
```

Advantages:

- Lower infrastructure cost.
- Easier maintenance.
- Efficient resource utilization.

Disadvantages:

- Requires strict tenant isolation.
- Noisy-neighbor problems.
- Tenant-specific customization can be harder.

### B. Shared Database, Separate Schemas

Each tenant has its own database schema.

```text
Database
   |
   +---- tenant_a
   |
   +---- tenant_b
   |
   +---- tenant_c
```

Advantages:

- Better logical isolation.
- Easier tenant-specific schema management in some environments.

Disadvantages:

- More schema management.
- Migration complexity.
- Resource sharing remains.

### C. Separate Database Per Tenant

Each tenant gets an independent database.

```text
Application
    |
    +---- Company A DB
    |
    +---- Company B DB
    |
    +---- Company C DB
```

Advantages:

- Stronger isolation.
- Easier independent backup and restore.
- Tenant-specific scaling.

Disadvantages:

- Higher cost.
- More infrastructure.
- Operational complexity.

## 22.3 Tenant Isolation

Tenant isolation ensures that one tenant cannot access another tenant's information.

Example:

```typescript
async function getExpenses(
  tenantId: number
) {
  return db.expense.findMany({
    where: {
      tenantId,
    },
  });
}
```

In production, do not blindly trust a tenant ID provided in the request body.

Derive tenant access from authenticated identity and enforce authorization on the server.

Additional techniques:

- Database row-level security.
- Tenant-aware cache keys.
- Tenant-aware object storage paths.
- Authorization middleware.
- Automated isolation tests.

## 22.4 Noisy Neighbor Problem

A noisy neighbor occurs when one tenant consumes disproportionate shared resources.

Example:

```text
Tenant A:
10 requests/sec

Tenant B:
20,000 requests/sec

Tenant C:
15 requests/sec
```

Tenant B may degrade performance for other tenants.

Solutions:

- Per-tenant rate limits.
- Resource quotas.
- Workload isolation.
- Dedicated infrastructure for large tenants.
- Queue prioritization.

---

# 23. High Availability

## 23.1 What Is High Availability?

High availability means designing a system to remain accessible despite individual component failures.

Example:

```text
              Load Balancer
                    |
          +---------+---------+
          |         |         |
          v         v         v
        Server A Server B Server C
```

If Server A fails, traffic can be routed to B and C.

## 23.2 Redundancy

Redundancy means maintaining additional resources so that the system can continue when a component fails.

Examples:

- Multiple application servers.
- Multiple database nodes.
- Multiple network paths.
- Multiple availability zones.
- Redundant storage.

## 23.3 Active-Passive Architecture

One node handles production traffic while another waits as standby.

```text
Active Node
     |
     v
Standby Node
```

If the active node fails, the standby node takes over.

## 23.4 Active-Active Architecture

Multiple nodes handle traffic simultaneously.

```text
       +-------------+
       |             |
       v             v
    Active A      Active B
       |             |
       +------+------+
              |
          Shared Data
```

Advantages:

- Better resource utilization.
- More capacity.
- Potentially faster failover.

Disadvantages:

- Data synchronization complexity.
- Conflict resolution.
- More complicated failure handling.

Multi-region active-active writes require particular care because concurrent updates may conflict.

## 23.5 Availability Calculation

Availability is commonly calculated as:

```text
Availability =
    Uptime / Total Time
```

Another equivalent expression:

```text
Availability =
    MTBF / (MTBF + MTTR)
```

Where:

- MTBF = Mean Time Between Failures.
- MTTR = Mean Time To Repair.

### Availability Examples

| Availability | Approximate Annual Downtime |
|---|---:|
| 99% | 3.65 days |
| 99.9% | 8.76 hours |
| 99.99% | 52.56 minutes |
| 99.999% | 5.26 minutes |

These are theoretical approximations for a 365-day year.

### Important

Availability calculations often assume failures are independent.

In reality, correlated failures—such as a regional power outage or a shared software bug—can reduce actual availability.

---

# 24. Fault Tolerance

## 24.1 What Is Fault Tolerance?

Fault tolerance is the ability of a system to continue providing acceptable service when components fail.

Example:

```text
Server A -> Failed
Server B -> Working
Server C -> Working
```

The system continues operating using the remaining healthy servers.

## 24.2 Failure Domains

A failure domain is a group of resources that can fail together.

Examples:

- One server.
- One rack.
- One availability zone.
- One cloud region.
- One network provider.

Good architecture tries to avoid placing all critical resources in the same failure domain.

## 24.3 Graceful Degradation

Graceful degradation means reducing non-essential functionality instead of allowing the entire system to fail.

Example:

If recommendation services are unavailable:

```text
Product Browsing -> Working
Checkout -> Working
Recommendations -> Temporarily Disabled
```

The core application remains functional.

## 24.4 Load Shedding

Load shedding means intentionally rejecting lower-priority work when the system is overloaded.

Example:

```text
High Priority:
Payment Processing

Low Priority:
Product Recommendations
```

The system protects critical operations by temporarily dropping non-essential work.

## 24.5 Bulkheads

Bulkheads isolate components so that failures in one area do not consume all available resources.

Example:

```text
Application
    |
    +---- Payment Thread Pool
    |
    +---- Search Thread Pool
    |
    +---- Notification Thread Pool
```

If notification processing becomes slow, it should not consume every resource required by payment processing.

## 24.6 Circuit Breaker

A circuit breaker prevents repeated requests to an unhealthy dependency.

Common states:

```text
CLOSED
  |
  | Failures exceed threshold
  v
OPEN
  |
  | Wait period passes
  v
HALF-OPEN
  |
  +---- Success ---> CLOSED
  |
  +---- Failure ---> OPEN
```

### Fault Tolerance Techniques

| Technique | Purpose |
|---|---|
| Timeout | Prevent indefinite waiting |
| Retry | Recover from transient failures |
| Circuit Breaker | Stop repeated calls to unhealthy services |
| Bulkhead | Isolate resource pools |
| Load Shedding | Reject excess work |
| Graceful Degradation | Preserve core functionality |
| Redundancy | Provide replacement capacity |

---

# 25. Disaster Recovery

## 25.1 What Is Disaster Recovery?

Disaster recovery (DR) is the process of restoring application services and data after a major incident.

Examples:

- Data center failure.
- Cloud region outage.
- Database corruption.
- Ransomware attack.
- Accidental deletion.
- Infrastructure failure.

## 25.2 Backup vs Replication

| Feature | Backup | Replication |
|---|---|---|
| Purpose | Recovery of historical data | Maintain copies of current data |
| Historical recovery | Yes, depending on retention | Not necessarily |
| Protects against accidental deletion | Can, if historical backup exists | Usually not |
| Failover | Not generally immediate | Can support failover |
| Recovery speed | Depends on restore process | Often faster |

Replication is not a substitute for backups.

## 25.3 RPO

RPO stands for Recovery Point Objective.

It defines the maximum acceptable data loss measured in time.

Example:

```text
RPO = 15 minutes
```

This means the recovery strategy should limit data loss to approximately 15 minutes or less.

## 25.4 RTO

RTO stands for Recovery Time Objective.

It defines the maximum acceptable time required to restore service.

Example:

```text
RTO = 1 hour
```

This means the service should be restored within one hour under the defined recovery scenario.

### RPO vs RTO

| Feature | RPO | RTO |
|---|---|---|
| Full Form | Recovery Point Objective | Recovery Time Objective |
| Focus | Data loss | Recovery duration |
| Example | 15 minutes | 1 hour |
| Question | How much data can we lose? | How quickly must service return? |

## 25.5 Disaster Recovery Strategies

1. Backup and restore.
2. Pilot light.
3. Warm standby.
4. Hot standby.
5. Multi-region active-active.

Generally, faster recovery requires greater infrastructure investment and operational complexity.

## 25.6 DR Best Practices

- Automate backups.
- Encrypt backups.
- Store copies separately.
- Test restore procedures.
- Use point-in-time recovery where appropriate.
- Document recovery procedures.
- Conduct disaster recovery drills.
- Monitor backup success and retention.

**Important:** A backup that has never been restored and verified should not be considered a proven recovery mechanism.

---

# 26. Capacity Planning

## 26.1 What Is Capacity Planning?

Capacity planning estimates the infrastructure resources required to handle current and future workloads.

You need to estimate:

- Requests per second.
- Concurrent users.
- Database operations.
- CPU usage.
- Memory usage.
- Storage growth.
- Network bandwidth.
- Queue throughput.

## 26.2 Requests Per Second (RPS)

RPS measures how many requests a system processes per second.

Example:

```text
Daily Requests = 8,640,000

Seconds Per Day = 86,400

RPS = 8,640,000 / 86,400

RPS = 100
```

Average traffic is 100 requests per second.

However, production systems must plan for peak traffic, not just average traffic.

If peak traffic is 10 times the average:

```text
Peak RPS = 1,000
```

## 26.3 Concurrent Users

Concurrent users are users actively interacting with the system during a particular period.

For example:

```text
Total Registered Users = 1,000,000

Daily Active Users = 100,000

Concurrent Users = 10,000
```

These numbers are illustrative.

Concurrent users are not the same as simultaneous HTTP requests.

## 26.4 Little's Law

Little's Law describes the relationship between throughput, average time in the system and the average number of items in the system.

Formula:

```text
L = λ × W
```

Where:

- L = Average number of items in the system.
- λ = Average arrival rate.
- W = Average time spent in the system.

### Example

Suppose:

```text
Arrival Rate = 100 Requests/Second

Average Response Time = 0.5 Seconds
```

Then:

```text
L = 100 × 0.5

L = 50
```

The system has approximately 50 requests in progress on average.

This is useful for estimating concurrency and queue sizes.

## 26.5 Storage Estimation

Suppose:

```text
Users = 10 Million

Average Data Per User = 5 KB
```

Total raw data:

```text
10,000,000 × 5 KB

= 50,000,000 KB
```

Approximately 50 GB using decimal units.

Real storage requirements are higher because of:

- Indexes.
- Replication.
- Backups.
- Logs.
- Metadata.
- Data growth.
- Temporary files.

## 26.6 Capacity Planning Checklist

1. Estimate average traffic.
2. Estimate peak traffic.
3. Estimate request complexity.
4. Estimate database reads and writes.
5. Estimate average response size.
6. Estimate storage growth.
7. Estimate connection requirements.
8. Load-test realistic workloads.
9. Maintain sufficient headroom.
10. Revisit estimates as usage changes.

---

# 27. Reliability Engineering

## 27.1 What Is Reliability Engineering?

Reliability engineering focuses on ensuring that a system operates correctly and consistently over time.

It includes:

- Reliability measurement.
- Monitoring.
- Alerting.
- Incident response.
- Performance management.
- Failure analysis.
- Continuous improvement.

## 27.2 SLI, SLO and SLA

These three terms are important in production engineering.

### SLI: Service Level Indicator

A measurable indicator of service performance.

Examples:

- API availability.
- Request latency.
- Error rate.
- Successful payment rate.

### SLO: Service Level Objective

An internal reliability target.

Example:

```text
99.9% of API requests
must complete successfully
within the defined latency threshold.
```

### SLA: Service Level Agreement

A contractual agreement between a service provider and customer.

It may define availability commitments and consequences for failing to meet them.

### Comparison

| Term | Meaning | Example |
|---|---|---|
| SLI | Actual measurement | 99.95% successful requests |
| SLO | Target | 99.9% successful requests |
| SLA | Contractual commitment | Availability guarantee with service credits |

## 27.3 Error Budget

An error budget is the amount of unreliability permitted by an SLO.

Example:

```text
SLO = 99.9%

Error Budget = 0.1%
```

The error budget helps teams balance reliability work and product delivery.

## 27.4 RED Method

RED is commonly used for monitoring request-driven services.

| Metric | Meaning |
|---|---|
| Rate | Requests per second |
| Errors | Failed requests |
| Duration | Request latency |

## 27.5 USE Method

USE is commonly used to analyze infrastructure resources.

| Metric | Meaning |
|---|---|
| Utilization | Percentage of resource capacity used |
| Saturation | Amount of queued or waiting work |
| Errors | Resource-related errors |

### Example Monitoring Dashboard

```text
API Requests:       5,000/sec

Error Rate:         0.2%

P95 Latency:        180ms

CPU Usage:          65%

Memory Usage:       72%

Database Connections: 450
```

These values are illustrative.

## 27.6 Incident Response

A typical incident response process:

```text
Detection
    |
    v
Alert
    |
    v
Investigation
    |
    v
Mitigation
    |
    v
Recovery
    |
    v
Postmortem
```

A good postmortem identifies:

- What happened?
- What was affected?
- Why did it happen?
- How was it detected?
- How was it resolved?
- What preventive actions are needed?

The focus should be on improving the system rather than assigning personal blame.

---

# 28. Large-Scale Architecture Case Study

## Designing an Expense Tracker for 10 Million Users

Let's design a scalable expense tracking application.

### 28.1 Requirements

Functional requirements:

1. User registration.
2. Login and authentication.
3. Create expenses.
4. Update expenses.
5. Delete expenses.
6. Categorize expenses.
7. Generate monthly reports.
8. Export reports.
9. Send notifications.

Non-functional requirements:

```text
Registered Users: 10 Million

Daily Active Users: 1 Million

Peak Requests: 20,000 RPS

Availability Target: 99.99%

API Latency Target: P95 under 200ms
```

These are hypothetical design assumptions.

### 28.2 High-Level Architecture

```text
                         Users
                           |
                           v
                          CDN
                           |
                           v
                     Load Balancer
                           |
                           v
                       API Gateway
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
      Auth Service    Expense Service   Report Service
          |                |                |
          v                v                v
       Auth DB         Expense DB       Analytics DB
                           |
                           v
                         Redis
                           |
                           v
                     Message Broker
                           |
              +------------+------------+
              |                         |
              v                         v
       Notification Worker       Report Worker
              |                         |
              v                         v
        Email / SMS              Object Storage
```

### 28.3 Database Architecture

Initially, we may use a relational database with appropriate indexing.

Example table:

```sql
CREATE TABLE expenses (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id BIGINT,
    amount DECIMAL(12,2) NOT NULL,
    description VARCHAR(255),
    expense_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Important index:

```sql
CREATE INDEX idx_expenses_user_date
ON expenses(user_id, expense_date);
```

This supports common queries involving a user and expense date.

### 28.4 Scaling Strategy

As traffic grows:

1. Add more stateless application instances.
2. Introduce load balancing.
3. Cache frequently accessed reports.
4. Add read replicas.
5. Introduce background workers.
6. Partition large expense tables.
7. Consider database sharding if a single database cluster becomes insufficient.

### 28.5 Asynchronous Report Generation

Generating large reports synchronously may cause request timeouts.

Instead:

```text
User Requests Report
         |
         v
     API Server
         |
         v
     Message Queue
         |
         v
     Report Worker
         |
         v
    Generate CSV/PDF
         |
         v
    Object Storage
         |
         v
    Notify User
```

The user can download the report once it is ready.

### 28.6 Reliability Strategy

| Component | Reliability Approach |
|---|---|
| API Servers | Multiple instances |
| Load Balancer | Health checks and redundancy |
| Database | Replication, backups and failover |
| Redis | Appropriate persistence and HA configuration |
| Message Broker | Durable messaging and consumer recovery |
| Workers | Retry and dead-letter handling |
| Object Storage | Versioning and appropriate retention |
| Monitoring | Metrics, logs and distributed tracing |

### 28.7 Security Strategy

- HTTPS everywhere.
- Secure authentication.
- Role-based authorization.
- Tenant/user data isolation.
- Input validation.
- Rate limiting.
- Encryption at rest.
- Secrets management.
- Audit logging.

### 28.8 Final Architecture Principles

For this system:

- Keep application servers stateless.
- Keep financial data in a transactional database.
- Use Redis for suitable cache workloads.
- Use a message broker for asynchronous processing.
- Use replicas for read scaling where consistency requirements permit.
- Partition large tables based on measured workload.
- Introduce sharding only when justified.
- Make critical operations idempotent.
- Maintain tested backups.
- Monitor service-level objectives.

---

# 29. Common System Design Mistakes

| Mistake | Why It Is a Problem |
|---|---|
| Scaling vertically forever | Hardware limits eventually become a bottleneck |
| Introducing microservices too early | Adds operational complexity |
| Using local memory for shared sessions | Fails across multiple instances |
| Ignoring replication lag | Can produce stale reads |
| Choosing a poor shard key | Creates hotspots |
| Sharding without need | Adds unnecessary complexity |
| Treating replication as backup | Does not protect against replicated deletion or corruption |
| Ignoring cache invalidation | Produces stale data |
| Using local rate limiting in a distributed deployment | Limits become inconsistent across instances |
| Ignoring network partitions | Creates reliability and consistency problems |
| Assuming quorum overlap guarantees linearizability | Overlooks protocol and versioning requirements |
| Using Elasticsearch as the primary transactional database | Poor fit for many business transaction requirements |
| Ignoring tenant isolation | Can expose one tenant's data to another |
| Ignoring RPO and RTO | Recovery expectations remain undefined |
| Never testing backups | Recovery may fail when needed |
| Monitoring only CPU usage | Misses application and dependency failures |

---

# 30. Interview Questions and Answers

## Q1. What is system design?

System design is the process of defining an application's architecture, components, databases, APIs and infrastructure to satisfy functional and non-functional requirements.

## Q2. What is scalability?

Scalability is the ability of a system to handle increasing workload by adding resources.

## Q3. What is the difference between vertical and horizontal scaling?

Vertical scaling increases the resources of one server. Horizontal scaling adds more servers.

## Q4. What is a stateless application?

A stateless application server does not depend on its own local memory to retain shared user state between requests.

## Q5. What is load balancing?

Load balancing distributes incoming traffic across multiple servers.

## Q6. What is a reverse proxy?

A reverse proxy receives client requests and forwards them to backend servers.

## Q7. What is the difference between Layer 4 and Layer 7 load balancing?

Layer 4 uses transport-level information such as IP addresses and ports. Layer 7 can route using application-level information such as HTTP paths and headers.

## Q8. What is caching?

Caching stores frequently accessed data in faster storage to reduce latency and backend workload.

## Q9. What is cache-aside?

Cache-aside is a caching pattern where the application checks the cache first and loads missing data from the database.

## Q10. What is cache invalidation?

Cache invalidation removes or refreshes cached data when it becomes stale.

## Q11. What is cache stampede?

Cache stampede occurs when many requests simultaneously experience a cache miss and overload the underlying data source.

## Q12. What is database replication?

Replication maintains copies of database data across multiple nodes.

## Q13. What is replication lag?

Replication lag is the delay between a database update on the primary and its visibility on a replica.

## Q14. What is synchronous replication?

Synchronous replication waits for the required replica acknowledgement before confirming a write according to the configured policy.

## Q15. What is asynchronous replication?

Asynchronous replication allows the primary to acknowledge a write before all replicas have applied it.

## Q16. What is database sharding?

Sharding distributes subsets of database records across multiple database nodes.

## Q17. What is a shard key?

A shard key is the field or combination of fields used to determine where a record is stored.

## Q18. What is a hotspot in database sharding?

A hotspot occurs when one shard receives significantly more traffic or workload than other shards.

## Q19. What is the difference between replication and sharding?

Replication creates copies of data. Sharding distributes different subsets of data across nodes.

## Q20. What is consistent hashing?

Consistent hashing distributes keys across nodes while minimizing key movement when nodes are added or removed.

## Q21. What are virtual nodes?

Virtual nodes represent one physical node at multiple positions on a consistent hash ring to improve distribution.

## Q22. What is CAP theorem?

CAP describes the tradeoff between consistency and availability during a network partition in a distributed system.

## Q23. What are the three CAP properties?

Consistency, Availability and Partition Tolerance.

## Q24. What is PACELC?

PACELC extends CAP by describing the latency-consistency tradeoff during normal operation in addition to the partition tradeoff.

## Q25. What is eventual consistency?

Eventual consistency means replicas may temporarily disagree but eventually converge if updates stop and communication recovers.

## Q26. What is linearizability?

Linearizability is a strong consistency model where operations appear to occur atomically in an order that respects real-time ordering.

## Q27. What is distributed consensus?

Distributed consensus allows multiple nodes to agree on a decision or ordered sequence of operations despite failures.

## Q28. What is leader election?

Leader election is the process of selecting one node to coordinate operations within a distributed cluster.

## Q29. What is Raft?

Raft is a consensus algorithm that coordinates leader election and replicated log operations.

## Q30. What is quorum?

A quorum is the minimum number of nodes required to participate or respond for an operation to satisfy a configured rule.

## Q31. What does R + W > N mean?

In a simple quorum model, it ensures that read and write replica sets overlap.

## Q32. Does quorum overlap guarantee linearizability?

No. Additional protocol guarantees, versioning, conflict resolution and read/write semantics are required.

## Q33. What is CQRS?

CQRS separates operations that modify application state from operations that read application state.

## Q34. What is Elasticsearch?

Elasticsearch is a distributed search and analytics engine used for full-text search and related workloads.

## Q35. What is an inverted index?

An inverted index maps terms to the documents containing those terms.

## Q36. What is rate limiting?

Rate limiting restricts how many requests a client can make within a defined period.

## Q37. What is the token bucket algorithm?

Token bucket allows requests to consume available tokens while replenishing tokens at a configured rate.

## Q38. What is the leaky bucket algorithm?

Leaky bucket processes incoming traffic at a controlled rate to smooth bursts.

## Q39. Why is Redis useful for distributed rate limiting?

Redis provides shared state accessible by multiple application instances, and atomic operations can coordinate request counters.

## Q40. What is multi-tenancy?

Multi-tenancy allows one application infrastructure to serve multiple customers while maintaining data isolation.

## Q41. What is the noisy-neighbor problem?

It occurs when one tenant consumes disproportionate shared resources and negatively affects other tenants.

## Q42. What is high availability?

High availability is the ability of a system to remain accessible despite component failures.

## Q43. What is active-active architecture?

Multiple nodes handle production traffic simultaneously.

## Q44. What is active-passive architecture?

One node handles production traffic while another remains available as standby.

## Q45. What is fault tolerance?

Fault tolerance is the ability to continue providing acceptable service when components fail.

## Q46. What is graceful degradation?

Graceful degradation preserves essential functionality while temporarily disabling non-essential features during failures.

## Q47. What is RPO?

Recovery Point Objective defines the maximum acceptable data loss measured in time.

## Q48. What is RTO?

Recovery Time Objective defines the maximum acceptable time required to restore service.

## Q49. What is an SLI?

A Service Level Indicator is a measurable metric used to evaluate service performance or reliability.

## Q50. What is the difference between SLI, SLO and SLA?

- SLI: Actual measurement.
- SLO: Reliability target.
- SLA: Contractual service commitment.

---

# 31. Practical Exercises

Complete these exercises to strengthen your system design knowledge.

### Exercise 1: Scalability

Design an architecture for an application with:

```text
Users: 100,000
Daily Active Users: 20,000
Peak RPS: 500
```

Explain when you would use vertical and horizontal scaling.

### Exercise 2: Load Balancing

Design a load-balanced Node.js application with:

- Three Express servers.
- NGINX as reverse proxy.
- Health checks.
- Round-robin distribution.

### Exercise 3: Stateless Architecture

Build an Express application with:

- Multiple application instances.
- Redis session storage.
- Shared authentication state.

### Exercise 4: Caching

Implement:

- Cache-aside.
- TTL.
- Cache invalidation.
- Cache stampede protection.

### Exercise 5: Replication

Study primary-replica replication in PostgreSQL or MongoDB.

Explain:

- Replication lag.
- Failover.
- Read-after-write consistency.
- Split-brain prevention.

### Exercise 6: Sharding

Create a TypeScript function that distributes user records across four shards using hash-based sharding.

Then investigate what happens when the number of shards changes.

### Exercise 7: Consistent Hashing

Implement a simple consistent hash ring with:

- Node registration.
- Key lookup.
- Node removal.
- Virtual nodes.

### Exercise 8: CAP Theorem

Explain what happens when two database replicas become disconnected.

Compare consistency-first and availability-first behavior.

### Exercise 9: Distributed Rate Limiting

Implement Redis-based token bucket rate limiting using an atomic Lua script.

Test it with multiple Express instances.

### Exercise 10: Multi-Tenancy

Build an expense management API supporting multiple companies.

Ensure:

- Every expense has a tenant ID.
- Users can access only authorized tenant data.
- Tenant-aware cache keys are used.
- Tenant-specific rate limits are enforced.

### Exercise 11: Disaster Recovery

Define an example DR plan with:

```text
RPO: 15 Minutes

RTO: 1 Hour
```

Describe backups, replication, recovery procedures and restore testing.

### Exercise 12: Complete System Design

Design an e-commerce application capable of handling:

```text
Registered Users: 10 Million

Daily Active Users: 2 Million

Peak RPS: 25,000

Availability: 99.99%
```

Include:

- API Gateway.
- Load Balancer.
- Microservices.
- Database replication.
- Database sharding strategy.
- Redis.
- Kafka or RabbitMQ.
- Elasticsearch.
- Monitoring.
- Disaster recovery.

---

# 32. Phase 63 Completion Checklist

You should be able to explain and implement the following concepts.

| No. | Topic | Status |
|---|---|---|
| 1 | System Design Fundamentals | ☐ |
| 2 | Functional Requirements | ☐ |
| 3 | Non-Functional Requirements | ☐ |
| 4 | Scalability | ☐ |
| 5 | Vertical Scaling | ☐ |
| 6 | Horizontal Scaling | ☐ |
| 7 | Stateless Architecture | ☐ |
| 8 | Load Balancing | ☐ |
| 9 | Reverse Proxy | ☐ |
| 10 | Layer 4 vs Layer 7 | ☐ |
| 11 | Caching Architecture | ☐ |
| 12 | Cache Invalidation | ☐ |
| 13 | Database Replication | ☐ |
| 14 | Synchronous vs Asynchronous Replication | ☐ |
| 15 | Replication Lag | ☐ |
| 16 | Database Sharding | ☐ |
| 17 | Shard Key Selection | ☐ |
| 18 | Range-Based Sharding | ☐ |
| 19 | Hash-Based Sharding | ☐ |
| 20 | Consistent Hashing | ☐ |
| 21 | CAP Theorem | ☐ |
| 22 | PACELC Theorem | ☐ |
| 23 | Consistency Models | ☐ |
| 24 | Distributed Consensus | ☐ |
| 25 | Leader Election | ☐ |
| 26 | Raft Algorithm | ☐ |
| 27 | Quorum-Based Systems | ☐ |
| 28 | CQRS | ☐ |
| 29 | Database Indexing at Scale | ☐ |
| 30 | Elasticsearch | ☐ |
| 31 | Rate Limiting Algorithms | ☐ |
| 32 | Distributed Rate Limiting | ☐ |
| 33 | Multi-Tenant Architecture | ☐ |
| 34 | High Availability | ☐ |
| 35 | Fault Tolerance | ☐ |
| 36 | Disaster Recovery | ☐ |
| 37 | RPO and RTO | ☐ |
| 38 | Capacity Planning | ☐ |
| 39 | Little's Law | ☐ |
| 40 | Reliability Engineering | ☐ |
| 41 | SLI, SLO and SLA | ☐ |
| 42 | Large-Scale System Design | ☐ |

---

# 33. What's Next? Phase 64

**Phase 64: Advanced TypeScript – Advanced Security Engineering, Application Security, Authentication, Authorization, Cryptography, OWASP, Zero Trust and Secure System Architecture**

Upcoming topics:

1. Security Engineering Fundamentals.
2. CIA Triad.
3. Authentication vs Authorization.
4. Advanced JWT Architecture.
5. OAuth 2.0.
6. OpenID Connect.
7. SSO and SAML.
8. Session-Based Authentication.
9. Access Token and Refresh Token Rotation.
10. RBAC and ABAC.
11. Permission-Based Authorization.
12. Password Hashing.
13. bcrypt, Argon2 and scrypt.
14. Cryptography Fundamentals.
15. Symmetric vs Asymmetric Encryption.
16. RSA and Elliptic Curve Cryptography.
17. Digital Signatures.
18. TLS and HTTPS.
19. Certificate Management.
20. Key Management Systems.
21. OWASP Top 10.
22. SQL Injection.
23. Cross-Site Scripting (XSS).
24. Cross-Site Request Forgery (CSRF).
25. Server-Side Request Forgery (SSRF).
26. Broken Access Control.
27. Security Misconfiguration.
28. CORS Security.
29. Content Security Policy.
30. API Security.
31. Rate Limiting and Brute-Force Protection.
32. Secure File Uploads.
33. Secrets Management.
34. Dependency Security.
35. Supply Chain Security.
36. Zero Trust Architecture.
37. Secure Microservices.
38. Security Logging and Monitoring.
39. Threat Modeling.
40. Security Testing.
41. Secure TypeScript and Node.js Architecture.

**Phase 63 is complete.** When you're ready, say **"OK, Continue to Phase 64"** to begin the next phase.