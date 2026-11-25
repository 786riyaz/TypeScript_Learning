# Phase 67: Advanced TypeScript – Advanced System Design, Distributed Systems, Microservices Architecture, Scalability, High Availability, Caching, Message Queues and Enterprise Backend Architecture

**Level:** Expert / Advanced Software Architecture and System Design  
**Prerequisites:** TypeScript, JavaScript, Node.js, Express, React, Next.js, SQL, MongoDB, Redis basics, REST APIs, Docker, Kubernetes, CI/CD, AWS and backend development.

---

# 1. Learning Objectives

By completing this phase, you will understand how to:

1. Design scalable software applications.
2. Understand High-Level Design (HLD) and Low-Level Design (LLD).
3. Design monolithic and microservices architectures.
4. Understand distributed systems.
5. Apply the CAP theorem and consistency models.
6. Design scalable database architectures.
7. Implement advanced caching strategies.
8. Understand Redis architecture and advanced use cases.
9. Implement message queues using RabbitMQ and Kafka.
10. Design event-driven systems.
11. Understand CQRS, Event Sourcing and Saga patterns.
12. Implement fault-tolerant architectures.
13. Design distributed locking and idempotency.
14. Build scalable real-time applications.
15. Design enterprise-level backend systems.
16. Solve practical system design interview problems.

# 2. System Design Fundamentals

## 2.1 What is System Design?

System Design is the process of defining the architecture, components, data flow, interfaces and infrastructure required to build a software system.

It answers questions such as:

- How will the application handle millions of users?
- How will multiple services communicate?
- How will data be stored?
- How will the application handle failures?
- How will the application scale?
- How will we maintain high availability?
- How will we secure the system?

For example, consider designing an e-commerce application.

It may require:

- User authentication.
- Product management.
- Shopping cart.
- Order management.
- Payment processing.
- Inventory management.
- Notifications.
- Search.
- Reviews.

System design determines how these components interact.

## 2.2 Why is System Design Important?

Consider two applications.

**Application A**

```text
Frontend
   |
   v
Backend
   |
   v
Database
```

This architecture may work well for a small application.

But imagine:

- 10 million registered users.
- 1 million daily active users.
- 100,000 concurrent users.
- Thousands of API requests per second.

A simple architecture may become insufficient.

You may need:

- Load balancers.
- Multiple application servers.
- Distributed caching.
- Database replication.
- Message queues.
- Microservices.
- Horizontal scaling.
- Monitoring and fault tolerance.

System design helps determine when and why these components are necessary.

## 2.3 Types of System Design

There are two major categories.

| Type | Meaning |
|---|---|
| High-Level Design (HLD) | Defines the overall architecture and major components. |
| Low-Level Design (LLD) | Defines internal component structures, classes, methods and implementation details. |

### HLD Example

```text
              Users
                |
                v
           Load Balancer
                |
                v
           API Gateway
                |
       +--------+--------+
       |        |        |
       v        v        v
     User    Product   Order
    Service  Service  Service
       |        |        |
       v        v        v
      DB       DB       DB
```

HLD focuses on architectural decisions.

### LLD Example

Suppose we are designing an order service.

```text
OrderService
    |
    +---- createOrder()
    |
    +---- getOrder()
    |
    +---- cancelOrder()
    |
    +---- updateOrderStatus()
```

LLD focuses on implementation details.

## 2.4 Functional vs Non-Functional Requirements

### Functional Requirements

These describe what a system should do.

Examples for an e-commerce application:

- Users can register.
- Users can log in.
- Users can search products.
- Users can add products to a cart.
- Users can place orders.
- Users can make payments.

### Non-Functional Requirements

These describe how well a system should operate.

Examples:

- High availability.
- Low latency.
- Scalability.
- Security.
- Reliability.
- Maintainability.
- Performance.
- Fault tolerance.

### Comparison

| Functional Requirements | Non-Functional Requirements |
|---|---|
| Describe features. | Describe quality attributes. |
| What should the system do? | How should the system perform? |
| User registration. | Registration should respond within a defined latency target. |
| Product search. | Search should handle high traffic. |
| Payment processing. | Payment processing must be reliable and secure. |

---

# 3. Important System Design Terminology

## 3.1 Latency

Latency is the time taken for an operation or request to complete.

Example:

```text
API Request Started: 10:00:00.000

API Response Received: 10:00:00.250

Latency: 250ms
```

Lower latency generally means faster responses.

## 3.2 Throughput

Throughput measures how much work a system processes during a specific period.

Example:

```text
Requests per second: 5,000
```

This means the system processes 5,000 requests per second under the measured conditions.

### Latency vs Throughput

| Latency | Throughput |
|---|---|
| Time taken for an operation. | Number of operations completed per unit of time. |
| Measured in milliseconds or seconds. | Measured in requests/sec, transactions/sec, etc. |
| Measures responsiveness. | Measures processing capacity. |

## 3.3 Bandwidth

Bandwidth represents the amount of data that can be transferred per unit of time.

Example:

```text
Network Bandwidth: 1 Gbps
```

## 3.4 Availability

Availability measures how often a system is operational and accessible.

It is commonly expressed as a percentage.

| Availability | Approximate Annual Downtime |
|---|---:|
| 99% | 3.65 days |
| 99.9% | 8 hours 46 minutes |
| 99.99% | 52 minutes 34 seconds |
| 99.999% | 5 minutes 15 seconds |

These are approximate values for a 365-day year.

## 3.5 Reliability

Reliability describes the ability of a system to operate correctly and consistently over time.

Availability and reliability are related but different.

A service may be available but return incorrect results.

## 3.6 Scalability

Scalability is the ability of a system to handle increased workload by adding or improving resources.

## 3.7 Fault Tolerance

Fault tolerance is the ability of a system to continue operating when some components fail.

Example:

If one application server fails, another server continues handling requests.

## 3.8 Resilience

Resilience is the ability of a system to withstand failures, recover and return to normal operation.

---

# 4. Scalability

## 4.1 What is Scalability?

Scalability means increasing a system's capacity to handle more workload.

For example:

```text
Initial:
1,000 Users

Growth:
100,000 Users

Further Growth:
10,000,000 Users
```

The architecture must evolve to handle increasing demand.

There are two major scaling approaches.

## 4.2 Vertical Scaling

Vertical scaling means increasing the resources of an existing machine.

For example:

```text
Before:

4 CPU Cores
8 GB RAM

After:

16 CPU Cores
64 GB RAM
```

Advantages:

- Simple architecture.
- Easier to implement.
- No need to distribute application workload across multiple servers.

Disadvantages:

- Hardware limits.
- Potentially expensive upgrades.
- May require downtime.
- A single server can remain a single point of failure.

## 4.3 Horizontal Scaling

Horizontal scaling means adding more machines or application instances.

Example:

```text
Before:

Application Server 1

After:

Application Server 1
Application Server 2
Application Server 3
Application Server 4
```

Advantages:

- Better scalability.
- Better redundancy.
- Can distribute workload.
- Supports fault-tolerant architectures.

Disadvantages:

- More complex infrastructure.
- Requires load balancing.
- Requires shared or distributed state management.
- Distributed systems introduce additional failure modes.

## 4.4 Vertical vs Horizontal Scaling

| Vertical Scaling | Horizontal Scaling |
|---|---|
| Adds resources to one machine. | Adds more machines. |
| Simpler to manage. | More complex to manage. |
| Limited by machine capacity. | Can scale across multiple machines. |
| Can involve downtime. | Can support gradual scaling. |
| May retain a single point of failure. | Can improve redundancy. |

## 4.5 Stateless vs Stateful Applications

This distinction becomes extremely important when horizontally scaling applications.

### Stateless Application

A stateless application does not depend on information stored only in a particular application instance between requests.

Example:

```text
Request 1 → Server A

Request 2 → Server B

Request 3 → Server C
```

Any suitable server can handle the request.

Authentication can use validated tokens, while shared application data can be stored in databases or distributed caches.

### Stateful Application

A stateful application maintains session or operational state that may be tied to a particular instance.

Example:

```text
User Session → Server A

Next Request → Server B
```

If Server B does not have the required session state, the request may fail.

### Solution

Use centralized or distributed state storage.

Examples:

- Redis.
- Database.
- Distributed session storage.

```text
          Load Balancer
                |
       +--------+--------+
       |        |        |
       v        v        v
    Server A Server B Server C
       |        |        |
       +--------+--------+
                |
                v
              Redis
```

---

# 5. Load Balancing

## 5.1 What is Load Balancing?

Load balancing distributes incoming traffic across multiple servers.

Without load balancing:

```text
Users
  |
  v
Server A
```

With load balancing:

```text
             Users
               |
               v
         Load Balancer
               |
       +-------+-------+
       |       |       |
       v       v       v
    Server A Server B Server C
```

Benefits:

- Distributes workload.
- Improves availability.
- Prevents individual servers from becoming overloaded.
- Enables horizontal scaling.

## 5.2 Load Balancing Algorithms

### 1. Round Robin

Requests are distributed sequentially.

```text
Request 1 → Server A
Request 2 → Server B
Request 3 → Server C
Request 4 → Server A
```

### 2. Weighted Round Robin

Servers receive requests according to assigned weights.

Example:

```text
Server A: Weight 5
Server B: Weight 3
Server C: Weight 2
```

Server A receives approximately 50% of the requests under the simple weighted distribution.

### 3. Least Connections

Requests are sent to the server with the fewest active connections.

### 4. IP Hash

A client's IP address is hashed to determine the destination server.

This can provide affinity, but it does not guarantee perfect session consistency or even traffic distribution.

### 5. Least Response Time

Requests are directed toward servers based on response-time and connection-related measurements, depending on the load balancer implementation.

## 5.3 Session Persistence

Session persistence, sometimes called sticky sessions, attempts to send a client's requests to the same backend instance.

Example:

```text
User A → Server 1

User B → Server 2
```

It can be useful for legacy stateful applications, but centralized session storage is often preferable for horizontally scaled systems.

---

# 6. Reverse Proxy and API Gateway

## 6.1 What is a Reverse Proxy?

A reverse proxy sits between clients and backend servers.

It receives client requests and forwards them to the appropriate backend.

Example:

```text
              Clients
                 |
                 v
            Reverse Proxy
                 |
          +------+------+
          |             |
          v             v
       Server A      Server B
```

Popular reverse proxies:

- Nginx.
- HAProxy.
- Envoy.
- Apache HTTP Server.

### Reverse Proxy Responsibilities

- Request routing.
- SSL/TLS termination.
- Load balancing.
- Compression.
- Caching.
- Access control.
- Request filtering.

## 6.2 Forward Proxy vs Reverse Proxy

| Forward Proxy | Reverse Proxy |
|---|---|
| Acts on behalf of clients. | Acts on behalf of backend servers. |
| Sits between clients and external destinations. | Sits between clients and backend services. |
| Can control outbound access. | Can route inbound requests. |
| Commonly used in corporate networks. | Commonly used in web infrastructure. |

## 6.3 What is an API Gateway?

An API Gateway is an entry point for API clients in a system containing multiple backend services.

Example:

```text
                  Client
                    |
                    v
                API Gateway
                    |
          +---------+---------+
          |         |         |
          v         v         v
       User      Product    Order
      Service    Service   Service
```

### API Gateway Responsibilities

1. Routing.
2. Authentication.
3. Authorization integration.
4. Rate limiting.
5. Request validation.
6. Logging.
7. Monitoring.
8. Request transformation.
9. API versioning.
10. Response aggregation in some architectures.

## 6.4 Reverse Proxy vs API Gateway

| Reverse Proxy | API Gateway |
|---|---|
| Primarily handles traffic forwarding. | Handles API-specific management and policies. |
| Often provides load balancing and TLS termination. | Can provide authentication, quotas and rate limiting. |
| General-purpose infrastructure component. | API-focused entry point. |
| May operate without understanding API semantics. | Often understands API routes and policies. |

An API Gateway commonly uses reverse-proxy functionality internally.

---

# 7. Monolithic Architecture

## 7.1 What is a Monolithic Architecture?

A monolithic application is built and deployed as one application unit.

Example:

```text
             Frontend
                |
                v
          Monolithic Backend
                |
       +--------+--------+
       |        |        |
       v        v        v
     Users   Products   Orders
       |        |        |
       +--------+--------+
                |
                v
             Database
```

All major business modules are part of the same deployable application.

## 7.2 Example Project Structure

```text
ecommerce/
│
├── src/
│   ├── modules/
│   │   ├── users/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── payments/
│   │   └── inventory/
│   │
│   ├── config/
│   ├── middleware/
│   ├── database/
│   └── app.ts
│
├── package.json
└── tsconfig.json
```

## 7.3 Advantages

- Simple development setup.
- Easier initial deployment.
- Easier local debugging.
- Direct function calls between modules.
- Simpler transactional database operations.
- Lower infrastructure complexity.

## 7.4 Disadvantages

- Large codebases can become difficult to maintain.
- Independent module deployment is difficult.
- Scaling individual components is less flexible.
- A poorly structured application can become tightly coupled.
- Large deployments may require rebuilding the entire application.

## 7.5 When Should You Use Monolithic Architecture?

Use a monolith when:

- Building a small or medium application.
- Working with a small team.
- Business requirements are still evolving.
- Operational simplicity is important.
- Independent service scaling is not necessary.

**Important:** A monolithic architecture is not automatically bad. A well-structured monolith can support substantial traffic and business complexity.

---

# 8. Microservices Architecture

## 8.1 What are Microservices?

Microservices architecture divides an application into smaller, independently deployable services.

Each service is responsible for a particular business capability.

Example:

```text
                  API Gateway
                       |
        +--------------+--------------+
        |              |              |
        v              v              v
   User Service   Product Service  Order Service
        |              |              |
        v              v              v
     User DB        Product DB      Order DB

                       |
                       v
                 Payment Service
                       |
                       v
                    Payment DB
```

## 8.2 Example Microservices

For an e-commerce application:

| Service | Responsibility |
|---|---|
| User Service | Authentication and profiles. |
| Product Service | Product catalog. |
| Cart Service | Shopping carts. |
| Order Service | Order management. |
| Payment Service | Payment processing. |
| Inventory Service | Stock management. |
| Notification Service | Emails and notifications. |
| Search Service | Product search. |

## 8.3 Advantages

- Independent deployment.
- Independent scaling.
- Technology flexibility.
- Clearer business boundaries.
- Failure isolation when properly designed.
- Independent team ownership.

## 8.4 Disadvantages

- More infrastructure complexity.
- Network communication failures.
- Distributed transactions become difficult.
- Monitoring and debugging become more complex.
- Data consistency challenges.
- Higher operational overhead.

## 8.5 Monolith vs Microservices

| Monolith | Microservices |
|---|---|
| One primary deployable application. | Multiple independently deployable services. |
| Often shares one application database. | Services commonly own their data. |
| Internal function calls. | Network-based communication is common. |
| Simpler operations initially. | More complex operations. |
| Often scales as a whole. | Services can scale independently. |
| Easier local debugging. | Distributed tracing is often needed. |

## 8.6 When Should You Use Microservices?

Consider microservices when:

- The application has clearly separated business capabilities.
- Multiple teams need independent ownership.
- Different services have significantly different scaling requirements.
- Independent deployment is valuable.
- The organization can operate distributed infrastructure.

Avoid adopting microservices simply because they are popular.

---

# 9. Modular Monolith

## 9.1 What is a Modular Monolith?

A modular monolith is a single deployable application divided into well-defined modules with controlled dependencies.

Example:

```text
               Application
                    |
       +------------+------------+
       |            |            |
       v            v            v
    Users        Products       Orders
    Module        Module        Module
       |            |            |
       +------------+------------+
                    |
                Database
```

Each module has its own domain logic and interfaces.

## 9.2 Why is it Useful?

It provides:

- Simpler deployment than microservices.
- Clear module boundaries.
- Better maintainability.
- Lower infrastructure complexity.
- Easier future extraction of services.

## 9.3 Example TypeScript Structure

```text
src/
│
├── modules/
│   ├── users/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.repository.ts
│   │   └── user.types.ts
│   │
│   ├── products/
│   │   ├── product.controller.ts
│   │   ├── product.service.ts
│   │   ├── product.repository.ts
│   │   └── product.types.ts
│   │
│   └── orders/
│       ├── order.controller.ts
│       ├── order.service.ts
│       ├── order.repository.ts
│       └── order.types.ts
│
└── app.ts
```

A modular monolith is often an excellent intermediate architecture before introducing microservices.

---

# 10. Service-Oriented Architecture (SOA)

## 10.1 What is SOA?

Service-Oriented Architecture is an architectural approach in which business capabilities are exposed as reusable services.

SOA often emphasizes enterprise integration, service contracts and interoperability.

Example:

```text
              Enterprise System
                     |
              Service Integration
                     |
        +------------+------------+
        |            |            |
        v            v            v
    Customer      Finance      Inventory
     Service      Service       Service
```

## 10.2 SOA vs Microservices

| SOA | Microservices |
|---|---|
| Often enterprise-wide integration. | Often organized around bounded business capabilities. |
| May use centralized enterprise integration infrastructure. | Commonly emphasizes independently deployable services. |
| Services can be larger and more broadly shared. | Services are often smaller and more autonomous. |
| Shared infrastructure is common in some SOA implementations. | Decentralized ownership is common. |

The distinction is not absolute. Modern microservices and SOA share many principles.

---

# 11. Distributed Systems Fundamentals

## 11.1 What is a Distributed System?

A distributed system consists of multiple independent computers or services that communicate over a network to achieve a common objective.

Example:

```text
              Users
                |
                v
           API Gateway
                |
       +--------+--------+
       |        |        |
       v        v        v
    Server A Server B Server C
       |        |        |
       +--------+--------+
                |
                v
             Database
```

Examples:

- Banking platforms.
- E-commerce applications.
- Social media platforms.
- Cloud platforms.
- Payment systems.
- Messaging applications.

## 11.2 Characteristics

1. Multiple independent components.
2. Network communication.
3. Independent failures.
4. Data distributed across locations.
5. Concurrent processing.
6. Coordination between services.
7. Partial failure possibilities.

## 11.3 What is Partial Failure?

In a distributed system, one component can fail while the rest continue operating.

Example:

```text
User Service       Working
Product Service    Working
Payment Service    Failed
Order Service      Working
```

The whole application may not be completely down, but some workflows are affected.

This is one of the most important differences between distributed systems and simple single-process applications.

## 11.4 Network Is Not Reliable

Network requests can:

- Time out.
- Fail.
- Be delayed.
- Be duplicated.
- Arrive out of order.
- Lose responses after the server has processed the request.

Therefore, distributed systems require careful timeout, retry, idempotency and consistency strategies.

---

# 12. CAP Theorem

## 12.1 What is CAP Theorem?

The CAP theorem describes a trade-off involving three properties of a distributed data system during a network partition.

CAP stands for:

- Consistency.
- Availability.
- Partition Tolerance.

### Consistency (C)

Every successful read returns the latest committed value, according to the consistency model being considered.

### Availability (A)

Every request received by a non-failing node receives a response, although that response may not contain the latest value.

### Partition Tolerance (P)

The system continues operating despite communication failures between parts of the distributed system.

## 12.2 Understanding CAP

When a network partition occurs, a distributed system generally must choose between preserving strong consistency and continuing to serve every request.

```text
                CAP
                 |
       +---------+---------+
       |         |         |
       v         v         v
  Consistency Availability Partition
                         Tolerance
```

### CP Systems

During a partition, a CP system may reject or delay some requests to preserve consistency.

### AP Systems

During a partition, an AP system may continue accepting requests but allow temporarily inconsistent results.

### What about CA?

A CA system can provide consistency and availability when there is no network partition. In a genuinely distributed system, partition tolerance cannot simply be ignored.

**Important:** CAP does not mean a database permanently chooses only two properties in all situations. It describes trade-offs specifically when a partition occurs.

## 12.3 Practical Example

Imagine two database replicas:

```text
Replica A: Balance = ₹1,000

Replica B: Balance = ₹1,000
```

A network partition separates them.

A withdrawal of ₹500 occurs on Replica A.

Replica A now has:

```text
Balance = ₹500
```

Replica B still has:

```text
Balance = ₹1,000
```

The system must decide how to handle reads and writes while replicas cannot communicate.

For financial operations, allowing stale data to drive critical decisions can be dangerous.

---

# 13. Consistency Models

Consistency describes how updates become visible across distributed components.

## 13.1 Strong Consistency

After a successful write, subsequent reads return the latest committed value, according to the system's guarantees.

Example:

```text
Write:
Balance = ₹500

Next Read:
Balance = ₹500
```

Useful for operations where stale reads are unacceptable.

## 13.2 Eventual Consistency

Updates may not become visible everywhere immediately, but replicas are expected to converge if no new updates occur and communication recovers.

Example:

```text
Time 1:

Replica A = Product Price ₹500
Replica B = Product Price ₹450

Time 2:

Replication occurs.

Replica A = ₹500
Replica B = ₹500
```

Useful for:

- Social media likes.
- Product catalog replication.
- Analytics.
- Distributed caching.
- Some search indexing workflows.

## 13.3 Read-Your-Writes Consistency

A user sees their own successful updates in subsequent reads.

Example:

```text
User updates profile name.

Subsequent profile read:
Returns updated name.
```

## 13.4 Consistency Comparison

| Model | Description |
|---|---|
| Strong Consistency | Reads reflect the latest committed update. |
| Eventual Consistency | Replicas converge over time. |
| Read-Your-Writes | Users see their own successful writes. |
| Monotonic Reads | Once a newer value is observed, later reads do not move backward to an older value. |

---

# 14. Database Replication

## 14.1 What is Database Replication?

Database replication copies data from one database server to another.

Example:

```text
             Primary Database
                    |
             Replication
                    |
          +---------+---------+
          |                   |
          v                   v
      Replica 1           Replica 2
```

## 14.2 Why Use Replication?

- Improve read scalability.
- Improve availability.
- Support disaster recovery.
- Distribute read traffic.
- Maintain additional copies of data.

## 14.3 Primary-Replica Architecture

In a primary-replica architecture:

- Primary handles writes.
- Replicas receive replicated changes.
- Reads may be directed to replicas.

Example:

```text
Write Requests
      |
      v
Primary Database
      |
      v
Replication
      |
 +----+----+
 |         |
 v         v
Replica A Replica B
 |         |
 +----+----+
      |
      v
Read Requests
```

## 14.4 Synchronous vs Asynchronous Replication

### Synchronous Replication

The primary waits for required replica acknowledgements before confirming a write, depending on the implementation.

Advantages:

- Stronger durability/consistency guarantees under the configured protocol.

Disadvantages:

- Increased write latency.
- Availability may be affected by replica/network failures.

### Asynchronous Replication

The primary confirms the write without waiting for all replicas.

Advantages:

- Lower write latency.
- Better tolerance of temporary replica delays.

Disadvantages:

- Replicas may temporarily contain stale data.
- Recent writes can be lost in some failover scenarios.

---

# 15. Database Sharding

## 15.1 What is Sharding?

Sharding is a database partitioning technique in which data is distributed across multiple independent database nodes.

Each node stores a subset of the overall dataset.

Example:

```text
                Application
                     |
                     v
               Shard Router
                     |
          +----------+----------+
          |          |          |
          v          v          v
       Shard 1    Shard 2    Shard 3
       Users      Users      Users
       1-1000     1001-2000  2001-3000
```

## 15.2 Why Use Sharding?

Imagine a database with billions of records.

One database server may become a bottleneck.

Sharding distributes data and workload across multiple servers.

Benefits:

- Horizontal data scaling.
- Increased storage capacity.
- Distributed query workload.
- Potentially improved throughput.

## 15.3 Sharding Strategies

### 1. Range-Based Sharding

Data is divided according to a range.

Example:

```text
User IDs:

1-1000       → Shard 1
1001-2000    → Shard 2
2001-3000    → Shard 3
```

Disadvantage: Some ranges may receive significantly more traffic.

### 2. Hash-Based Sharding

A hash function determines the destination shard.

Example:

```typescript
function getShard(userId: number): number {
  return userId % 4;
}
```

This distributes users across four shards in this simplified example.

Disadvantage: Changing the number of shards can require substantial data redistribution.

### 3. Geographic Sharding

Data is distributed according to geographical regions.

Example:

```text
India Users     → India Database
US Users        → US Database
Europe Users    → Europe Database
```

Useful for geographical data residency, latency and regional isolation requirements.

## 15.4 What is a Shard Key?

A shard key determines how records are distributed.

A good shard key should:

- Distribute workload evenly.
- Avoid hotspots.
- Support common query patterns.
- Minimize cross-shard queries.

Poor shard keys can create uneven data distribution and performance problems.

---

# 16. Database Partitioning

## 16.1 What is Partitioning?

Partitioning divides a large database table into smaller logical or physical sections.

Example:

A transaction table containing millions of records can be partitioned by month.

```text
Transactions
     |
     +---- January Partition
     |
     +---- February Partition
     |
     +---- March Partition
```

## 16.2 Types of Partitioning

| Type | Description |
|---|---|
| Range Partitioning | Divides records by value ranges. |
| List Partitioning | Divides records by specified values. |
| Hash Partitioning | Uses a hash function to distribute records. |
| Composite Partitioning | Combines multiple partitioning strategies. |

## 16.3 Partitioning vs Sharding

| Partitioning | Sharding |
|---|---|
| Divides a dataset into smaller parts. | Distributes dataset across independent database nodes. |
| Can happen within one database instance. | Commonly involves multiple database instances. |
| Often used for manageability and query optimization. | Often used for horizontal database scaling. |
| May be transparent to applications. | Often requires shard routing or database support. |

---

# 17. Caching Architecture

## 17.1 What is Caching?

Caching stores frequently accessed data in a faster storage layer to reduce repeated computation or database access.

Example:

Without caching:

```text
Client
  |
  v
Node.js API
  |
  v
Database
  |
  v
Response
```

With caching:

```text
Client
  |
  v
Node.js API
  |
  v
Redis Cache
  |
  +---- Cache Hit ----> Response
  |
  +---- Cache Miss
          |
          v
       Database
          |
          v
       Redis
          |
          v
       Response
```

## 17.2 Why Use Caching?

- Reduce database load.
- Improve response times.
- Reduce repeated computations.
- Improve application scalability.
- Reduce infrastructure costs in some workloads.

## 17.3 Cache Hit vs Cache Miss

### Cache Hit

Requested data exists in the cache.

```text
Request
   |
   v
Cache
   |
   v
Data Found
   |
   v
Response
```

### Cache Miss

Requested data is not available in the cache.

```text
Request
   |
   v
Cache
   |
   v
Data Not Found
   |
   v
Database
   |
   v
Cache Update
   |
   v
Response
```

## 17.4 Cache Hit Ratio

Cache hit ratio measures the percentage of cache lookups served successfully from cache.

Formula:

```text
Cache Hit Ratio =
Cache Hits / Total Cache Requests × 100
```

Example:

```text
Total Requests: 10,000

Cache Hits: 8,000

Cache Hit Ratio: 80%
```

A high cache hit ratio can be useful, but it does not automatically mean the caching strategy is correct.

---

# 18. Caching Strategies

## 18.1 Cache-Aside Pattern

Cache-aside is one of the most commonly used caching strategies.

The application checks the cache first.

If the data is missing, it retrieves the data from the database and stores it in the cache.

```text
Application
     |
     v
   Cache
     |
  +--+--+
  |     |
 Hit   Miss
  |     |
  v     v
Return Database
        |
        v
       Cache
        |
        v
      Return
```

Example:

```typescript
async function getProduct(productId: string) {
  const cacheKey = `product:${productId}`;

  const cachedProduct = await redis.get(cacheKey);

  if (cachedProduct) {
    return JSON.parse(cachedProduct);
  }

  const product = await database.getProduct(productId);

  if (product) {
    await redis.set(
      cacheKey,
      JSON.stringify(product),
      "EX",
      300
    );
  }

  return product;
}
```

## 18.2 Write-Through Cache

When an application writes data, it updates the cache and database as part of the write operation.

```text
Application
     |
     v
   Cache
     |
     v
  Database
```

Advantages:

- Cache remains relatively fresh.
- Reduces cache misses after writes.

Disadvantages:

- Write operations may be slower.
- Requires careful handling of partial failures.

## 18.3 Write-Behind Cache

The application writes to the cache first, and database updates happen asynchronously.

```text
Application
     |
     v
   Cache
     |
     v
  Async Queue
     |
     v
  Database
```

Advantages:

- Fast write acknowledgement.
- Can batch database writes.

Disadvantages:

- Data may be lost if the cache or queue fails before persistence.
- More complex consistency and durability requirements.

## 18.4 Read-Through Cache

The cache layer retrieves missing data from the database automatically.

The application interacts with the cache abstraction rather than implementing the entire cache-miss process itself.

## 18.5 Comparison

| Strategy | Read Behavior | Write Behavior |
|---|---|---|
| Cache-Aside | Application checks cache and loads on miss. | Application updates database and manages invalidation/update. |
| Read-Through | Cache loads missing data. | Depends on write strategy. |
| Write-Through | Cache reads are supported. | Cache and database are updated together. |
| Write-Behind | Cache reads are supported. | Database update is deferred asynchronously. |

---

# 19. Cache Invalidation

## 19.1 What is Cache Invalidation?

Cache invalidation means removing or updating cached data when the underlying data changes.

Example:

```text
Database Product Price = ₹500

Cache Product Price = ₹500
```

The price changes:

```text
Database Product Price = ₹600

Cache Product Price = ₹500
```

Now the cache contains stale data.

## 19.2 Invalidation Strategies

### 1. Time-To-Live (TTL)

Cached data expires automatically after a configured duration.

Example:

```typescript
await redis.set(
  "product:101",
  JSON.stringify(product),
  "EX",
  300
);
```

The cache entry expires after 300 seconds.

### 2. Explicit Invalidation

Delete the cache entry after updating the database.

```typescript
await database.updateProduct(productId, updatedData);

await redis.del(`product:${productId}`);
```

### 3. Event-Based Invalidation

A service publishes an event when data changes.

Other components receive the event and invalidate related cache entries.

### 4. Versioned Cache Keys

Use versioned keys to avoid accidentally serving old cached data.

Example:

```text
product:101:v1
product:101:v2
```

## 19.3 Common Caching Problems

| Problem | Explanation |
|---|---|
| Stale Data | Cache contains outdated information. |
| Cache Stampede | Many requests simultaneously rebuild expired data. |
| Cache Penetration | Repeated requests for non-existent records bypass the cache. |
| Cache Avalanche | Many cache entries expire around the same time. |
| Hot Key | One cache key receives excessive traffic. |

### Preventing Cache Stampede

Possible techniques:

- Randomized TTL.
- Request coalescing.
- Distributed locks.
- Background refresh.
- Stale-while-revalidate strategies.

---

# 20. Redis Advanced

## 20.1 What is Redis?

Redis is an in-memory data structure server commonly used for:

- Caching.
- Session storage.
- Counters.
- Rate limiting.
- Distributed coordination.
- Pub/Sub.
- Queues and streams.

Official documentation:

[Redis Documentation](https://redis.io/docs/latest/?utm_source=chatgpt.com)

## 20.2 Redis Data Structures

| Data Structure | Use Case |
|---|---|
| String | Cache values, counters and tokens. |
| Hash | User profiles and structured records. |
| List | Ordered collections and simple queues. |
| Set | Unique values. |
| Sorted Set | Rankings and leaderboards. |
| Stream | Event streams and consumer groups. |
| Bitmap | Compact boolean tracking. |
| HyperLogLog | Approximate cardinality counting. |
| Geospatial | Location-based queries. |

## 20.3 Redis String

```bash
SET user:1 "Riyaz"

GET user:1
```

Counter:

```bash
INCR page:views
```

Set expiry:

```bash
EXPIRE user:1 300
```

## 20.4 Redis Hash

```bash
HSET user:1 name "Riyaz" age 25
```

Read:

```bash
HGETALL user:1
```

## 20.5 Redis Set

```bash
SADD skills javascript typescript nodejs
```

Read:

```bash
SMEMBERS skills
```

Sets automatically prevent duplicate members.

## 20.6 Redis Sorted Set

Useful for leaderboards.

```bash
ZADD leaderboard 100 user1
ZADD leaderboard 200 user2
ZADD leaderboard 150 user3
```

Get rankings:

```bash
ZREVRANGE leaderboard 0 9 WITHSCORES
```

## 20.7 Redis Persistence

Redis supports persistence mechanisms such as:

- RDB snapshots.
- AOF (Append Only File).

RDB creates snapshots of data.

AOF records write operations for recovery.

The correct persistence strategy depends on durability, recovery and performance requirements.

## 20.8 Redis Replication and Cluster

Redis replication maintains copies of data across instances.

Redis Cluster distributes data across multiple nodes using hash slots.

These capabilities can help scale Redis and improve availability, but require careful configuration and operational management.

---

# 21. Message Queues

## 21.1 What is a Message Queue?

A message queue allows services to communicate asynchronously.

Instead of waiting for another service to finish processing a request, an application can publish a message for later processing.

Example:

Without a queue:

```text
User Places Order
       |
       v
Order Service
       |
       v
Payment Service
       |
       v
Email Service
       |
       v
Response
```

The user may need to wait for every operation.

With a queue:

```text
User Places Order
       |
       v
Order Service
       |
       v
Message Queue
       |
       +------> Payment Worker
       |
       +------> Email Worker
       |
       +------> Inventory Worker
```

The order service can respond after the critical synchronous operations are complete and the required events are durably accepted.

## 21.2 Why Use Message Queues?

- Asynchronous processing.
- Workload buffering.
- Decoupling services.
- Retry handling.
- Load smoothing.
- Background processing.
- Improved resilience.

## 21.3 Important Message Queue Concepts

| Concept | Meaning |
|---|---|
| Producer | Publishes messages. |
| Consumer | Processes messages. |
| Queue | Stores messages awaiting processing. |
| Broker | Manages message delivery. |
| Acknowledgement | Confirms message processing. |
| Retry | Attempts processing again. |
| Dead Letter Queue | Stores messages that cannot be successfully processed. |

---

# 22. RabbitMQ

## 22.1 What is RabbitMQ?

RabbitMQ is a message broker that supports multiple messaging protocols, including AMQP.

It is commonly used for:

- Task queues.
- Background jobs.
- Event distribution.
- Service communication.
- Workload buffering.

Official documentation:

[RabbitMQ Documentation](https://www.rabbitmq.com/docs?utm_source=chatgpt.com)

## 22.2 RabbitMQ Architecture

```text
Producer
   |
   v
Exchange
   |
   v
Binding
   |
   v
Queue
   |
   v
Consumer
```

### Important Components

**Producer:** Sends messages.

**Exchange:** Receives messages and routes them.

**Binding:** Defines routing relationships between exchanges and queues.

**Queue:** Stores messages.

**Consumer:** Processes messages.

## 22.3 Types of RabbitMQ Exchanges

| Exchange | Behavior |
|---|---|
| Direct | Routes using an exact routing key. |
| Fanout | Broadcasts to bound queues. |
| Topic | Routes using pattern matching. |
| Headers | Routes based on message headers. |

## 22.4 RabbitMQ Example Using Node.js

Install:

```bash
npm install amqplib
npm install -D @types/amqplib
```

Producer:

```typescript
import amqp from "amqplib";

async function sendMessage() {
  const connection = await amqp.connect(
    "amqp://localhost"
  );

  const channel = await connection.createChannel();

  const queue = "email_queue";

  await channel.assertQueue(queue, {
    durable: true
  });

  channel.sendToQueue(
    queue,
    Buffer.from(
      JSON.stringify({
        email: "user@example.com",
        subject: "Welcome"
      })
    ),
    {
      persistent: true
    }
  );

  console.log("Message sent");

  await channel.close();
  await connection.close();
}

sendMessage();
```

Consumer:

```typescript
import amqp from "amqplib";

async function consumeMessages() {
  const connection = await amqp.connect(
    "amqp://localhost"
  );

  const channel = await connection.createChannel();

  const queue = "email_queue";

  await channel.assertQueue(queue, {
    durable: true
  });

  channel.prefetch(1);

  await channel.consume(queue, async (message) => {
    if (!message) return;

    try {
      const data = JSON.parse(
        message.content.toString()
      );

      console.log("Processing:", data);

      // Perform email operation here.

      channel.ack(message);

    } catch (error) {
      console.error(error);

      channel.nack(message, false, false);
    }
  });
}

consumeMessages();
```

In production, configure connection recovery, durable exchanges and queues, appropriate message persistence, publisher confirms, dead-letter handling and idempotent consumers.

---

# 23. Apache Kafka

## 23.1 What is Kafka?

Apache Kafka is a distributed event streaming platform.

It is designed to handle high-throughput event streams and retain events for configurable periods.

Common use cases:

- Real-time analytics.
- Event-driven architectures.
- Log aggregation.
- Data pipelines.
- Activity tracking.
- Event distribution.

Official documentation:

[Apache Kafka Documentation](https://kafka.apache.org/documentation/?utm_source=chatgpt.com)

## 23.2 Kafka Architecture

```text
Producer
   |
   v
Kafka Cluster
   |
   +------ Topic A
   |          |
   |          +---- Partition 0
   |          |
   |          +---- Partition 1
   |
   +------ Topic B
              |
              +---- Partition 0
              |
              +---- Partition 1
```

Consumers read events from topics.

## 23.3 Important Kafka Concepts

| Concept | Description |
|---|---|
| Producer | Publishes events. |
| Consumer | Reads events. |
| Topic | Named event stream. |
| Partition | Ordered sequence of records within a topic. |
| Broker | Kafka server. |
| Consumer Group | Group of consumers sharing topic partitions. |
| Offset | Position of a record within a partition. |
| Replication Factor | Number of copies maintained across brokers. |

## 23.4 Kafka Topic

A topic is a logical category for events.

Example:

```text
user-events
order-events
payment-events
notification-events
```

## 23.5 Kafka Partitions

Partitions allow parallel processing and horizontal scaling.

Example:

```text
Topic: order-events

Partition 0
Partition 1
Partition 2
```

Records with the same key are generally routed to the same partition by the default keyed partitioning strategy, preserving their order within that partition.

Kafka does not guarantee global ordering across all partitions.

## 23.6 Kafka Consumer Groups

A consumer group allows multiple consumers to share processing work.

Example:

```text
Topic: order-events
        |
   +----+----+
   |    |    |
   v    v    v
  P0   P1   P2
   |    |    |
   v    v    v
  C1   C2   C3
```

Within a consumer group, each partition is assigned to one consumer at a time.

Adding more consumers than available partitions does not increase parallelism for that group.

## 23.7 RabbitMQ vs Kafka

| RabbitMQ | Kafka |
|---|---|
| Traditional message broker. | Distributed event streaming platform. |
| Commonly used for task queues. | Commonly used for event streams and data pipelines. |
| Message acknowledgement controls delivery. | Consumers track offsets. |
| Messages are commonly removed or moved according to acknowledgement and queue configuration. | Events are retained according to topic retention settings. |
| Supports exchange-based routing. | Uses topics and partitions. |
| Strong fit for task distribution and routing patterns. | Strong fit for high-throughput event streaming. |

Neither is universally better. Choose according to workload and delivery requirements.

---

# 24. Event-Driven Architecture

## 24.1 What is Event-Driven Architecture?

Event-Driven Architecture (EDA) is an architectural style in which components communicate by producing and consuming events.

An event represents something that has happened.

Examples:

- UserRegistered.
- OrderPlaced.
- PaymentCompleted.
- ProductUpdated.
- InventoryReserved.

## 24.2 Architecture

```text
Order Service
     |
     v
OrderPlaced Event
     |
     v
Message Broker
     |
 +---+---+---+
 |   |   |   |
 v   v   v   v
Email Inventory Analytics Shipping
Service Service   Service  Service
```

## 24.3 Advantages

- Loose coupling.
- Asynchronous processing.
- Better scalability for independent consumers.
- Easier integration between services.
- Supports event-driven workflows.

## 24.4 Disadvantages

- Eventual consistency.
- More difficult debugging.
- Duplicate message handling.
- Event ordering challenges.
- Requires monitoring of event pipelines.

## 24.5 Command vs Event

| Command | Event |
|---|---|
| Requests an action. | Describes something that happened. |
| Usually imperative. | Usually a statement of fact. |
| May be rejected. | Represents a completed occurrence. |
| Example: CreateOrder. | Example: OrderCreated. |

---

# 25. Event Sourcing

## 25.1 What is Event Sourcing?

Event Sourcing is an architectural pattern in which the application stores changes as a sequence of events rather than only storing the latest state.

Example:

Traditional database:

```text
Account Balance = ₹500
```

Event Sourcing:

```text
AccountOpened: ₹1,000

MoneyDeposited: ₹500

MoneyWithdrawn: ₹1,000

Current Balance = ₹500
```

The current state can be reconstructed by replaying events.

## 25.2 Event Sourcing Architecture

```text
Command
   |
   v
Command Handler
   |
   v
Event Store
   |
   v
Events
   |
   v
Projection
   |
   v
Read Model
```

## 25.3 Example

Suppose we have a bank account.

```typescript
type AccountEvent =
  | {
      type: "DEPOSIT";
      amount: number;
    }
  | {
      type: "WITHDRAW";
      amount: number;
    };

function calculateBalance(
  events: AccountEvent[]
): number {
  return events.reduce((balance, event) => {
    if (event.type === "DEPOSIT") {
      return balance + event.amount;
    }

    return balance - event.amount;
  }, 0);
}

const events: AccountEvent[] = [
  {
    type: "DEPOSIT",
    amount: 1000
  },
  {
    type: "WITHDRAW",
    amount: 300
  },
  {
    type: "DEPOSIT",
    amount: 500
  }
];

console.log(calculateBalance(events)); // 1200
```

## 25.4 Advantages

- Complete historical record.
- Ability to reconstruct previous states.
- Auditability.
- Supports event-driven integrations.
- Enables multiple read models.

## 25.5 Disadvantages

- More complex architecture.
- Event schema evolution.
- Event replay costs.
- Storage growth.
- Data privacy and deletion challenges.
- Eventual consistency between projections.

## 25.6 What is a Snapshot?

A snapshot stores the computed state at a particular point.

Instead of replaying millions of events, the system loads a snapshot and replays only subsequent events.

---

# 26. CQRS

## 26.1 What is CQRS?

CQRS stands for Command Query Responsibility Segregation.

It separates operations that change application state from operations that read application state.

### Traditional Architecture

```text
Application
     |
     v
   Service
     |
     v
  Database
```

The same model may handle reads and writes.

### CQRS Architecture

```text
              Application
                    |
              +-----+-----+
              |           |
              v           v
           Commands     Queries
              |           |
              v           v
         Write Model   Read Model
              |           |
              v           v
          Write DB     Read DB
```

## 26.2 Commands

Commands request changes.

Examples:

- CreateOrder.
- UpdateProduct.
- CancelOrder.
- DepositMoney.

## 26.3 Queries

Queries retrieve information without changing application state.

Examples:

- GetOrder.
- GetProducts.
- GetUserProfile.
- GetAccountBalance.

## 26.4 Advantages

- Read and write workloads can scale independently.
- Read models can be optimized for specific queries.
- Business commands can be modeled explicitly.
- Can support complex reporting requirements.

## 26.5 Disadvantages

- More infrastructure.
- Data synchronization complexity.
- Eventual consistency in many implementations.
- More difficult testing and maintenance.

## 26.6 CQRS vs Event Sourcing

These concepts are related but different.

| CQRS | Event Sourcing |
|---|---|
| Separates reads and writes. | Stores state changes as events. |
| Can use ordinary relational tables. | Uses an event store or equivalent event log. |
| Does not require event sourcing. | Does not automatically require separate read/write models. |

You can implement CQRS without Event Sourcing, and Event Sourcing without full CQRS.

---

# 27. Saga Pattern

## 27.1 What is the Saga Pattern?

The Saga pattern manages distributed business transactions across multiple services using a sequence of local transactions.

Example: Placing an e-commerce order.

```text
Create Order
     |
     v
Reserve Inventory
     |
     v
Process Payment
     |
     v
Arrange Shipment
     |
     v
Complete Order
```

Each service manages its own local transaction.

There is no single database transaction covering every service.

## 27.2 What Happens When Something Fails?

Suppose:

```text
1. Order Created
2. Inventory Reserved
3. Payment Failed
```

The system must release the reserved inventory and cancel the order.

This is handled through compensating actions.

## 27.3 Compensation Flow

```text
Create Order
     |
     v
Reserve Inventory
     |
     v
Payment Failed
     |
     v
Release Inventory
     |
     v
Cancel Order
```

## 27.4 Saga Approaches

### Choreography

Services communicate through events.

```text
Order Service
     |
 OrderCreated
     |
     v
Inventory Service
     |
 InventoryReserved
     |
     v
Payment Service
```

There is no single central orchestrator controlling every step.

### Orchestration

A central saga orchestrator coordinates the workflow.

```text
       Saga Orchestrator
              |
      +-------+-------+
      |       |       |
      v       v       v
    Order Inventory Payment
   Service  Service  Service
```

## 27.5 Choreography vs Orchestration

| Choreography | Orchestration |
|---|---|
| Services react to events. | Central coordinator controls workflow. |
| Less centralized control. | Explicit workflow control. |
| Can become difficult to understand as events grow. | Easier to visualize complex workflows. |
| Suitable for simpler event-driven workflows. | Suitable for complex multi-step transactions. |

---

# 28. Circuit Breaker Pattern

## 28.1 What is Circuit Breaker?

Circuit Breaker is a resilience pattern that prevents repeated requests to a failing service.

Example:

```text
Order Service
      |
      v
Payment Service
      |
      v
Repeated Failures
      |
      v
Circuit Breaker Opens
      |
      v
Requests Rejected Quickly
```

It prevents one failing dependency from consuming all available resources in other services.

## 28.2 Circuit Breaker States

### Closed

Requests are allowed.

```text
Order Service → Payment Service
```

### Open

Requests are blocked or failed fast.

```text
Order Service → Circuit Breaker → Rejected
```

### Half-Open

A limited number of test requests are allowed to determine whether the dependency has recovered.

```text
Circuit Breaker
      |
      v
 Test Request
      |
  +---+---+
  |       |
Success  Failure
  |       |
Closed   Open
```

## 28.3 Circuit Breaker Example

Simplified TypeScript implementation:

```typescript
type CircuitState =
  | "CLOSED"
  | "OPEN"
  | "HALF_OPEN";

class CircuitBreaker {
  private state: CircuitState = "CLOSED";

  private failures = 0;

  private lastFailureTime = 0;

  constructor(
    private readonly threshold = 3,
    private readonly timeout = 5000
  ) {}

  async execute<T>(
    operation: () => Promise<T>
  ): Promise<T> {
    if (this.state === "OPEN") {
      const elapsed =
        Date.now() - this.lastFailureTime;

      if (elapsed < this.timeout) {
        throw new Error("Circuit is OPEN");
      }

      this.state = "HALF_OPEN";
    }

    try {
      const result = await operation();

      this.failures = 0;
      this.state = "CLOSED";

      return result;

    } catch (error) {
      this.failures++;

      this.lastFailureTime = Date.now();

      if (this.failures >= this.threshold) {
        this.state = "OPEN";
      }

      throw error;
    }
  }
}
```

This is an educational implementation. Production circuit breakers should also account for concurrent half-open requests, rolling failure windows, timeouts and failure classification.

---

# 29. Retry and Backoff Strategies

## 29.1 What is Retry?

Retry means attempting an operation again after a failure.

Example:

```text
Request 1 → Failed

Request 2 → Failed

Request 3 → Success
```

Retries are useful for temporary failures.

However, blindly retrying every failure can make an outage worse.

## 29.2 Exponential Backoff

Exponential backoff increases the waiting time between retries.

Formula:

```text
Delay = Base Delay × 2^Attempt
```

Example with a base delay of 1 second:

| Attempt | Delay |
|---|---:|
| 1 | 1 second |
| 2 | 2 seconds |
| 3 | 4 seconds |
| 4 | 8 seconds |
| 5 | 16 seconds |

## 29.3 Jitter

Jitter adds randomness to retry delays.

This prevents many clients from retrying simultaneously.

Example:

```typescript
function calculateRetryDelay(
  attempt: number
): number {
  const baseDelay = 1000;

  const maxDelay = 30000;

  const exponentialDelay = Math.min(
    baseDelay * 2 ** attempt,
    maxDelay
  );

  return Math.random() * exponentialDelay;
}
```

## 29.4 Retry Best Practices

- Use bounded retries.
- Use timeouts.
- Add jitter.
- Retry only transient errors.
- Avoid retrying non-idempotent operations without protection.
- Monitor retry rates.
- Combine retries with circuit breakers where appropriate.

---

# 30. Rate Limiting

## 30.1 What is Rate Limiting?

Rate limiting restricts the number of requests a client can make during a defined period.

Example:

```text
Maximum:
100 Requests / Minute / User
```

If a user exceeds the limit, the API may return:

```http
HTTP/1.1 429 Too Many Requests
```

## 30.2 Why Use Rate Limiting?

- Prevent abuse.
- Reduce denial-of-service impact.
- Protect backend resources.
- Control API consumption.
- Enforce usage quotas.

## 30.3 Rate Limiting Algorithms

### 1. Fixed Window

Allows a maximum number of requests during a fixed time interval.

Example:

```text
100 requests per minute.
```

Disadvantage: Requests can burst at window boundaries.

### 2. Sliding Window Log

Stores timestamps of requests and counts those within the current time window.

Advantages:

- Accurate sliding-window enforcement.

Disadvantages:

- Higher storage requirements.

### 3. Sliding Window Counter

Uses weighted counts from adjacent windows to estimate usage.

### 4. Token Bucket

Tokens are added to a bucket at a configured rate.

Each request consumes a token.

### 5. Leaky Bucket

Requests enter a queue and are processed at a controlled rate.

## 30.4 Token Bucket Example

```text
Bucket Capacity: 10 Tokens

Token Refill: 1 Token / Second

Request:
Consumes 1 Token

No Tokens:
Request Rejected
```

## 30.5 Rate Limiting with Redis

A simplified fixed-window example:

```typescript
async function rateLimit(
  userId: string
): Promise<boolean> {
  const key = `rate:${userId}`;

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 60);
  }

  return count <= 100;
}
```

For production, use an atomic Redis operation or Lua script to avoid races between incrementing the counter and setting its expiration.

---

# 31. Distributed Locking

## 31.1 What is a Distributed Lock?

A distributed lock coordinates access to a shared resource across multiple processes or machines.

Example:

Two workers try to process the same payment simultaneously.

Without locking:

```text
Worker A → Process Payment

Worker B → Process Payment

Result: Duplicate Processing
```

With appropriate coordination:

```text
Worker A → Acquire Lock
Worker B → Cannot Acquire Lock
Worker A → Process Payment
Worker A → Release Lock
```

## 31.2 Redis Distributed Lock

A basic lock can be created using:

```bash
SET payment:lock unique-token NX PX 10000
```

Explanation:

- `NX`: Set only if the key does not exist.
- `PX 10000`: Expire after 10,000 milliseconds.
- `unique-token`: Unique ownership token.

## 31.3 Why Use a Unique Token?

Suppose Worker A's lock expires.

Worker B acquires the lock.

If Worker A later tries to release the lock, it must not accidentally delete Worker B's lock.

Therefore, a lock should be released only if the stored token matches the owner's token.

A Lua script can perform this check atomically.

```lua
if redis.call("GET", KEYS[1]) == ARGV[1] then
    return redis.call("DEL", KEYS[1])
else
    return 0
end
```

## 31.4 Distributed Locking Challenges

- Lock expiration.
- Network failures.
- Process crashes.
- Ownership verification.
- Clock and timing assumptions.
- Fencing tokens.
- Split-brain scenarios.

A distributed lock alone does not guarantee that a stale worker cannot modify a resource after its lease expires. For critical systems, fencing tokens or resource-side version checks may be necessary.

---

# 32. Idempotency

## 32.1 What is Idempotency?

An operation is idempotent when repeating the same operation produces the same intended final effect as performing it once.

Example:

```text
PUT /users/101

Set Name = "Riyaz"
```

Repeating this request produces the same user name.

But consider:

```text
POST /payments

Charge ₹1,000
```

Repeating the request may charge the customer multiple times.

## 32.2 Why is Idempotency Important?

Network failures can produce ambiguous outcomes.

Example:

```text
Client sends payment request.

Payment succeeds.

Response gets lost.

Client retries request.
```

Without idempotency protection, the payment may be processed twice.

## 32.3 Idempotency Key

A client sends a unique key:

```http
POST /payments
Idempotency-Key: payment-abc-123
```

The server stores the result associated with that key.

When the same request arrives again, the server returns the previous result rather than performing the payment again.

## 32.4 Example

```typescript
async function processPayment(
  idempotencyKey: string,
  amount: number
) {
  const existing = await database.findPaymentByKey(
    idempotencyKey
  );

  if (existing) {
    return existing;
  }

  return database.transaction(async (tx) => {
    const payment = await tx.createPayment({
      idempotencyKey,
      amount
    });

    return payment;
  });
}
```

**Important:** This example assumes a database-level unique constraint on `idempotencyKey`. The lookup and insert must be designed to handle concurrent requests safely.

---

# 33. Service Discovery

## 33.1 What is Service Discovery?

Service discovery allows services to locate other services dynamically.

In a distributed architecture, service IP addresses may change.

Hardcoding them creates maintenance problems.

Without service discovery:

```text
Order Service
     |
     v
Hardcoded IP:
10.0.0.15
     |
     v
Payment Service
```

With service discovery:

```text
Order Service
     |
     v
Service Discovery
     |
     v
Payment Service Address
```

## 33.2 Types of Service Discovery

### Client-Side Discovery

The client queries a service registry and selects an available instance.

### Server-Side Discovery

The client sends a request to a load balancer or proxy, which resolves the destination.

## 33.3 Examples

- Kubernetes DNS.
- Consul.
- Eureka.
- Cloud service discovery systems.

---

# 34. Distributed Transactions

## 34.1 What is a Distributed Transaction?

A distributed transaction involves multiple services or databases participating in a single logical business operation.

Example:

```text
Order Database
      |
      v
Payment Database
      |
      v
Inventory Database
```

A traditional database transaction cannot automatically guarantee atomicity across all independent services.

## 34.2 Two-Phase Commit (2PC)

Two-Phase Commit is a distributed transaction protocol.

It has two phases.

### Phase 1: Prepare

The coordinator asks participants whether they can commit.

```text
Coordinator
    |
    +----> Database A: Prepare
    |
    +----> Database B: Prepare
    |
    +----> Database C: Prepare
```

### Phase 2: Commit or Abort

If all participants are ready, the coordinator instructs them to commit.

Otherwise, it instructs them to abort.

```text
All Prepared
     |
     v
Commit
```

## 34.3 Advantages and Disadvantages

Advantages:

- Provides atomic commit semantics under the protocol's assumptions.
- Useful for some tightly coordinated transactional systems.

Disadvantages:

- Coordination overhead.
- Potential blocking if the coordinator fails.
- Reduced availability in some failure scenarios.
- Difficult across loosely coupled microservices.

## 34.4 Saga vs 2PC

| Saga | Two-Phase Commit |
|---|---|
| Uses local transactions and compensation. | Uses coordinated prepare and commit phases. |
| Supports long-running workflows. | Typically suited to tightly coordinated transactional resources. |
| Often eventually consistent. | Provides atomic commit semantics under protocol assumptions. |
| Common in microservices. | Can introduce blocking and coordination overhead. |

---

# 35. API Design at Scale

## 35.1 REST API Design

REST is an architectural style for designing network-based APIs.

Example:

```http
GET /api/products
GET /api/products/101
POST /api/products
PUT /api/products/101
PATCH /api/products/101
DELETE /api/products/101
```

Use HTTP methods according to their intended semantics.

## 35.2 API Versioning

Versioning allows APIs to evolve while maintaining compatibility.

Examples:

```text
/api/v1/users
/api/v2/users
```

Another approach uses headers or media types.

## 35.3 Pagination

Avoid returning millions of records in one response.

### Offset Pagination

```http
GET /products?page=2&limit=20
```

Advantages:

- Simple implementation.
- Easy page-number navigation.

Disadvantages:

- Large offsets can be expensive.
- Concurrent inserts/deletes can cause inconsistent pages.

### Cursor Pagination

```http
GET /products?cursor=eyJpZCI6MTAwfQ&limit=20
```

Advantages:

- Better for large datasets.
- More stable for continuously changing data.
- Can use indexed cursor fields.

## 35.4 API Rate Limits

Example:

```http
HTTP/1.1 429 Too Many Requests

Retry-After: 30
```

## 35.5 API Gateway Responsibilities

At scale, an API Gateway may handle:

- Authentication.
- Rate limiting.
- Request validation.
- Routing.
- API versioning.
- Logging.
- Metrics.
- Traffic policies.

---

# 36. Database Architecture at Scale

## 36.1 Database Selection

Different database types serve different workloads.

| Database Type | Typical Use |
|---|---|
| Relational | Transactions and structured relationships. |
| Document | Flexible document-based data. |
| Key-Value | Caching and fast key lookups. |
| Wide-Column | Large-scale distributed data workloads. |
| Graph | Relationship-heavy queries. |
| Search Engine | Full-text search and indexing. |
| Time-Series | Time-stamped metrics and events. |

## 36.2 SQL vs NoSQL

| SQL | NoSQL |
|---|---|
| Relational data model. | Multiple data models. |
| Structured schemas. | Often flexible schemas. |
| SQL querying. | Query mechanisms vary. |
| Strong transaction support in many systems. | Consistency and transaction capabilities vary. |
| Good for relational data and complex joins. | Often optimized for specific access patterns and distributed workloads. |

Neither category is universally superior.

## 36.3 Database Indexing

Indexes improve data retrieval performance.

Example:

```sql
CREATE INDEX idx_users_email
ON users(email);
```

Query:

```sql
SELECT *
FROM users
WHERE email = 'user@example.com';
```

An appropriate index can reduce the amount of data the database must scan.

However, indexes also have costs:

- Additional storage.
- Slower writes.
- Maintenance overhead.
- Potentially poor performance if incorrectly designed.

## 36.4 Connection Pooling

Opening a new database connection for every request is expensive.

Connection pooling reuses a managed set of database connections.

```text
Node.js Application
        |
        v
  Connection Pool
        |
    +---+---+
    |   |   |
    v   v   v
   DB  DB  DB
Connection Connections
```

Benefits:

- Reduced connection overhead.
- Controlled database connection usage.
- Better resource management.

---

# 37. Search Architecture

## 37.1 What is Search Architecture?

Search architecture provides fast search capabilities over large datasets.

For example, an e-commerce application needs:

- Product search.
- Autocomplete.
- Filters.
- Sorting.
- Full-text search.
- Faceted navigation.

A relational database may handle simple search requirements, but specialized search engines can be useful for complex search workloads.

## 37.2 Elasticsearch / OpenSearch Architecture

```text
Application
    |
    v
Search API
    |
    v
Search Engine
    |
    v
Indexes
    |
    v
Search Results
```

Popular technologies:

- Elasticsearch.
- OpenSearch.
- Apache Solr.

## 37.3 What is an Inverted Index?

An inverted index maps terms to the documents containing them.

Example:

Documents:

```text
Document 1: Node.js TypeScript

Document 2: React TypeScript

Document 3: Node.js MongoDB
```

Inverted index:

```text
Node.js     → Document 1, Document 3

TypeScript  → Document 1, Document 2

React       → Document 2

MongoDB     → Document 3
```

This enables efficient full-text retrieval.

---

# 38. Real-Time System Design

## 38.1 What is a Real-Time Application?

A real-time application delivers information with minimal delay as events occur.

Examples:

- Chat applications.
- Live sports updates.
- Stock market dashboards.
- Multiplayer games.
- Collaborative editing.
- Real-time notifications.

## 38.2 Real-Time Communication Technologies

| Technology | Purpose |
|---|---|
| Polling | Client repeatedly requests updates. |
| Long Polling | Server holds a request until data becomes available or a timeout occurs. |
| Server-Sent Events (SSE) | Server sends one-way updates to clients. |
| WebSocket | Full-duplex communication between client and server. |
| WebRTC | Real-time peer-to-peer media and data communication. |

---

# 39. WebSocket Architecture

## 39.1 What is WebSocket?

WebSocket is a communication protocol that enables full-duplex communication over a persistent connection.

Unlike ordinary request-response HTTP communication, both client and server can send messages over the established connection.



## 39.2 HTTP vs WebSocket

| HTTP | WebSocket |
|---|---|
| Usually request-response. | Full-duplex communication. |
| Requests are generally independent. | Persistent connection. |
| Suitable for standard APIs. | Suitable for real-time updates. |
| Client typically initiates requests. | Both sides can send messages after connection establishment. |

## 39.3 WebSocket Workflow

```text
Client
  |
  v
HTTP Upgrade Request
  |
  v
WebSocket Handshake
  |
  v
Persistent Connection
  |
  +------ Client Messages
  |
  +------ Server Messages
```

## 39.4 WebSocket Example Using Node.js

Install:

```bash
npm install ws
npm install -D @types/ws
```

Server:

```typescript
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({
  port: 8080
});

wss.on("connection", (socket) => {
  console.log("Client connected");

  socket.send(
    JSON.stringify({
      type: "WELCOME",
      message: "Connected successfully"
    })
  );

  socket.on("message", (message) => {
    console.log("Received:", message.toString());

    socket.send(
      JSON.stringify({
        type: "MESSAGE_RECEIVED",
        data: message.toString()
      })
    );
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});
```

Client:

```typescript
const socket = new WebSocket(
  "ws://localhost:8080"
);

socket.onopen = () => {
  socket.send("Hello Server");
};

socket.onmessage = (event) => {
  console.log(event.data);
};
```

## 39.5 Scaling WebSocket Applications

Suppose a chat application runs on three servers.

```text
              Load Balancer
                    |
          +---------+---------+
          |         |         |
          v         v         v
        WS 1      WS 2      WS 3
```

A user connected to Server 1 may need to send a message to another user connected to Server 3.

A shared message broker or distributed messaging infrastructure can distribute messages between instances.

Sticky sessions may be required depending on the load balancer and protocol configuration, particularly when using connection-related HTTP fallback mechanisms.

---

# 40. Notification System Design

## 40.1 Requirements

Imagine designing a notification system supporting:

- Email.
- SMS.
- Push notifications.
- In-app notifications.

## 40.2 Architecture

```text
          Application
               |
               v
       Notification API
               |
               v
          Message Queue
               |
       +-------+-------+
       |       |       |
       v       v       v
     Email    SMS     Push
    Worker   Worker  Worker
       |       |       |
       v       v       v
   Provider Provider Provider
```

## 40.3 Important Design Considerations

- Message prioritization.
- Retry mechanisms.
- Delivery status tracking.
- Rate limiting.
- Duplicate prevention.
- Dead-letter queues.
- User preferences.
- Provider failures.
- Delivery analytics.

## 40.4 Notification Data Model

```typescript
interface Notification {
  id: string;

  userId: string;

  type: "EMAIL" | "SMS" | "PUSH";

  title: string;

  message: string;

  status:
    | "PENDING"
    | "PROCESSING"
    | "SENT"
    | "FAILED";

  createdAt: Date;

  sentAt?: Date;
}
```

---

# 41. Chat Application Architecture

## 41.1 Requirements

Design a chat application similar to WhatsApp.

Functional requirements:

- User registration.
- One-to-one messaging.
- Group messaging.
- Message delivery.
- Message read status.
- Online/offline status.
- Media sharing.
- Message history.
- Notifications.

Non-functional requirements:

- Low latency.
- High availability.
- Message durability.
- Scalability.
- Secure communication.

## 41.2 High-Level Architecture



```text
                  Clients
                     |
                     v
               Load Balancer
                     |
                     v
               WebSocket Layer
                     |
           +---------+---------+
           |         |         |
           v         v         v
         WS 1      WS 2      WS 3
           |         |         |
           +---------+---------+
                     |
                     v
                Message Broker
                     |
           +---------+---------+
           |         |         |
           v         v         v
        Message   Notification Delivery
        Service    Service     Service
           |
           v
        Database
           |
           v
       Object Storage
```

## 41.3 Database Design

`users`

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100),
    created_at TIMESTAMP
);
```

`conversations`

```sql
CREATE TABLE conversations (
    id BIGINT PRIMARY KEY,
    type VARCHAR(20),
    created_at TIMESTAMP
);
```

`messages`

```sql
CREATE TABLE messages (
    id BIGINT PRIMARY KEY,
    conversation_id BIGINT,
    sender_id BIGINT,
    message TEXT,
    created_at TIMESTAMP
);
```

`conversation_members`

```sql
CREATE TABLE conversation_members (
    conversation_id BIGINT,
    user_id BIGINT,
    PRIMARY KEY (conversation_id, user_id)
);
```

## 41.4 Message Flow

```text
User A
  |
  v
WebSocket Server
  |
  v
Message Service
  |
  v
Persist Message
  |
  v
Message Broker
  |
  v
User B's Connected Server
  |
  v
User B
```

If User B is offline, the system stores the message and delivers it later.

## 41.5 Important Chat Concepts

- Message IDs.
- Sequence numbers.
- Delivery acknowledgements.
- Read receipts.
- Offline message delivery.
- Presence tracking.
- Reconnection.
- Duplicate message prevention.
- Group message fan-out.
- Message ordering.

---

# 42. E-Commerce System Design

## 42.1 Requirements

An e-commerce system requires:

- User management.
- Product catalog.
- Search.
- Shopping cart.
- Checkout.
- Orders.
- Payments.
- Inventory.
- Shipping.
- Notifications.

## 42.2 High-Level Architecture

```text
                  Users
                    |
                    v
               API Gateway
                    |
       +------------+------------+
       |            |            |
       v            v            v
    User         Product        Cart
   Service       Service       Service
       |            |            |
       v            v            v
    User DB     Product DB     Redis
                    |
                    v
               Order Service
                    |
          +---------+---------+
          |         |         |
          v         v         v
      Inventory  Payment   Shipping
       Service   Service   Service
          |         |         |
          v         v         v
        Stock     Payment   Delivery
         DB        DB       System
```

## 42.3 Important Challenges

1. Prevent overselling.
2. Handle payment failures.
3. Prevent duplicate orders.
4. Maintain inventory accuracy.
5. Handle concurrent checkout requests.
6. Process asynchronous notifications.
7. Support high traffic during sales.
8. Maintain audit records.

## 42.4 Inventory Reservation

Suppose:

```text
Product Stock = 10

Customer A Orders 3

Customer B Orders 4

Customer C Orders 5
```

The system must prevent total accepted orders from exceeding available stock.

A common approach uses atomic database updates or reservation records.

Example SQL:

```sql
UPDATE products
SET stock = stock - 3
WHERE id = 101
  AND stock >= 3;
```

Then check the affected row count.

If one row was updated, the reservation succeeded.

If zero rows were updated, there was insufficient stock or the product did not exist.

For more complex workflows, reservation expiration and Saga compensation may be required.

---

# 43. Payment System Design

## 43.1 Requirements

A payment system must support:

- Payment initiation.
- Payment authorization.
- Payment capture.
- Payment status.
- Refunds.
- Payment retries.
- Idempotency.
- Audit logs.
- Fraud checks.
- Reconciliation.

## 43.2 Architecture

```text
Client
  |
  v
Payment API
  |
  v
Payment Service
  |
  +------ Payment Database
  |
  +------ Payment Gateway
  |
  +------ Message Queue
               |
               v
         Payment Workers
               |
               v
         Order Service
```

## 43.3 Important Concepts

### Authorization

Confirms whether a payment can be approved.

### Capture

Collects the authorized funds, depending on the payment method and provider workflow.

### Refund

Returns previously captured funds.

### Idempotency

Prevents duplicate processing when requests are repeated.

### Reconciliation

Compares internal payment records with provider or bank records to identify discrepancies.

## 43.4 Payment Status Model

```typescript
type PaymentStatus =
  | "PENDING"
  | "AUTHORIZED"
  | "CAPTURED"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";
```

Never assume that a timeout means a payment failed. The payment provider may have completed the operation even though the response was lost.

Use provider webhooks, status queries and reconciliation workflows.

---

# 44. URL Shortener System Design

## 44.1 Requirements

Design a service similar to Bitly.

Functional requirements:

- Accept a long URL.
- Generate a short URL.
- Redirect to the original URL.
- Track clicks.
- Support optional expiration.

Non-functional requirements:

- Low-latency redirects.
- High availability.
- Large-scale storage.
- Unique short codes.

## 44.2 Architecture

```text
User
 |
 v
URL API
 |
 v
Short Code Generator
 |
 v
Database
 |
 v
Redis Cache
 |
 v
Redirect Service
 |
 v
Original URL
```

## 44.3 Short Code Generation

One approach is Base62 encoding.

Base62 uses:

```text
0-9
a-z
A-Z
```

There are 62 possible characters.

For a six-character code:

```text
62^6 = 56,800,235,584
```

Possible combinations are approximately 56.8 billion.

Example TypeScript function:

```typescript
const characters =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function encodeBase62(value: number): string {
  if (value === 0) return "0";

  let result = "";

  while (value > 0) {
    const remainder = value % 62;

    result =
      characters[remainder] + result;

    value = Math.floor(value / 62);
  }

  return result;
}

console.log(encodeBase62(123456));
```

Production systems must handle unique ID generation, collisions, distributed allocation and code enumeration/security considerations.

---

# 45. Social Media System Design

## 45.1 Requirements

A social media application may support:

- User profiles.
- Following and followers.
- Posts.
- Likes.
- Comments.
- News feeds.
- Notifications.
- Media uploads.
- Search.

## 45.2 Feed Generation

Two common approaches:

### Fan-Out on Write

When a user creates a post, the post is distributed to followers' feed stores.

Advantages:

- Fast feed reads.

Disadvantages:

- Expensive writes for users with many followers.
- Large fan-out workloads.

### Fan-Out on Read

When a user opens their feed, the system retrieves posts from followed users and combines them.

Advantages:

- Simpler post creation.
- Avoids precomputing every follower's feed.

Disadvantages:

- Feed reads can be expensive.

### Hybrid Approach

Use fan-out on write for normal accounts and fan-out on read for accounts with extremely large follower counts.

---

# 46. Video Streaming Architecture

## 46.1 Requirements

A video streaming platform needs:

- Video upload.
- Video processing.
- Multiple resolutions.
- Video storage.
- CDN delivery.
- Playback.
- Analytics.

## 46.2 Architecture



```text
User Upload
    |
    v
Upload API
    |
    v
Object Storage
    |
    v
Processing Queue
    |
    v
Transcoding Workers
    |
    v
Multiple Video Qualities
    |
    v
Object Storage
    |
    v
CDN
    |
    v
Video Player
```

## 46.3 Video Transcoding

Transcoding converts a video into different formats, codecs or resolutions.

Example:

```text
Original Video
      |
      +---- 1080p
      |
      +---- 720p
      |
      +---- 480p
      |
      +---- 360p
```

## 46.4 HLS

HTTP Live Streaming (HLS) is a streaming protocol that divides media into smaller segments.

The player selects suitable segments based on network conditions and device capabilities.

Adaptive bitrate streaming improves playback under varying network conditions.

---

# 47. High Availability

## 47.1 What is High Availability?

High Availability (HA) means designing a system to remain accessible with minimal interruption.

Example:

Without redundancy:

```text
Users
  |
  v
Server A
```

If Server A fails, the application becomes unavailable.

With redundancy:

```text
           Load Balancer
                 |
          +------+------+
          |             |
          v             v
       Server A      Server B
```

If Server A fails, Server B can continue handling traffic.

## 47.2 High Availability Techniques

- Multiple application instances.
- Load balancing.
- Multi-AZ deployment.
- Database failover.
- Replication.
- Health checks.
- Automated recovery.
- Redundant network components.
- Backups and disaster recovery.

## 47.3 Single Point of Failure

A Single Point of Failure (SPOF) is a component whose failure can cause the entire system or a critical part of it to become unavailable.

Example:

```text
Multiple Application Servers
             |
             v
       Single Database
```

Even if application servers are redundant, a single database may remain a critical SPOF.

The database therefore needs an appropriate availability and recovery strategy.

---

# 48. Fault Tolerance

## 48.1 What is Fault Tolerance?

Fault tolerance allows a system to continue operating when one or more components fail.

Examples:

- Database failover.
- Multiple application servers.
- Replicated storage.
- Redundant network connections.
- Message queue replication.

## 48.2 Bulkhead Pattern

The Bulkhead pattern isolates system components so a failure in one area does not exhaust resources across the entire system.

Example:

```text
Application
    |
    +---- Payment Thread Pool
    |
    +---- Email Thread Pool
    |
    +---- Reporting Thread Pool
```

If the reporting service becomes slow, it should not consume every available resource needed by payment processing.

## 48.3 Failover

Failover transfers operations from a failed component to a standby component.

Example:

```text
Primary Database
       |
       X
    Failure
       |
       v
Standby Database
       |
       v
   Operations Continue
```

Failover mechanisms require monitoring, health detection and carefully managed data consistency.

---

# 49. Disaster Recovery

## 49.1 What is Disaster Recovery?

Disaster Recovery (DR) is the process of restoring systems and data after a major disruption.

Examples:

- Data center outage.
- Accidental deletion.
- Ransomware attack.
- Cloud region failure.
- Database corruption.
- Infrastructure failure.

## 49.2 RTO

Recovery Time Objective (RTO) defines the maximum acceptable time to restore a service after disruption.

Example:

```text
RTO = 2 Hours
```

The service should be restored within two hours.

## 49.3 RPO

Recovery Point Objective (RPO) defines the maximum acceptable amount of data loss measured in time.

Example:

```text
RPO = 15 Minutes
```

The recovery strategy should limit data loss to approximately the last 15 minutes.

## 49.4 RTO vs RPO

| RTO | RPO |
|---|---|
| Recovery time target. | Data recovery point target. |
| Measures downtime. | Measures potential data loss. |
| How quickly must we recover? | How much data can we afford to lose? |

## 49.5 Disaster Recovery Strategies

| Strategy | Description |
|---|---|
| Backup and Restore | Restore infrastructure and data from backups. |
| Pilot Light | Maintain a minimal core environment. |
| Warm Standby | Maintain a smaller but functioning environment. |
| Multi-Site Active/Active | Operate across multiple locations simultaneously. |

---

# 50. Enterprise System Design Best Practices

When designing enterprise applications, consider the following principles.

## 50.1 Separation of Concerns

Each component should have a clear responsibility.

## 50.2 Loose Coupling

Components should depend on stable interfaces rather than implementation details.

## 50.3 High Cohesion

Related functionality should be grouped together.

## 50.4 SOLID Principles

SOLID principles help structure maintainable object-oriented software.

| Principle | Meaning |
|---|---|
| S | Single Responsibility Principle |
| O | Open/Closed Principle |
| L | Liskov Substitution Principle |
| I | Interface Segregation Principle |
| D | Dependency Inversion Principle |

## 50.5 Domain-Driven Design (DDD)

Domain-Driven Design organizes software around business domains.

Important concepts:

- Domain.
- Subdomain.
- Bounded Context.
- Entity.
- Value Object.
- Aggregate.
- Repository.
- Domain Event.
- Ubiquitous Language.

Example:

```text
E-Commerce Domain
      |
      +---- User Context
      |
      +---- Product Context
      |
      +---- Order Context
      |
      +---- Payment Context
      |
      +---- Inventory Context
```

A bounded context defines the boundary within which a particular domain model and its terminology apply.

## 50.6 Clean Architecture

Clean Architecture separates business rules from infrastructure details.

Example:

```text
        Presentation Layer
                |
                v
        Application Layer
                |
                v
           Domain Layer
                |
                v
        Infrastructure Layer
```

The central idea is that business rules should not depend directly on frameworks, databases or external services.

---

# 51. System Design Interview Framework

A systematic approach helps solve system design questions.

Follow these steps.

### Step 1: Understand Requirements

Clarify:

- Who are the users?
- What features are required?
- What are the important use cases?
- What is outside the scope?

### Step 2: Estimate Scale

Estimate:

- Registered users.
- Daily active users.
- Concurrent users.
- Requests per second.
- Storage requirements.
- Bandwidth requirements.

### Step 3: Define APIs

Example:

```http
POST /api/orders

GET /api/orders/:id

GET /api/users/:id
```

### Step 4: Design Data Models

Identify:

- Entities.
- Relationships.
- Primary keys.
- Indexes.
- Access patterns.

### Step 5: Draw High-Level Architecture

Identify:

- Clients.
- Load balancers.
- API gateways.
- Application services.
- Databases.
- Caches.
- Queues.
- Storage.

### Step 6: Identify Bottlenecks

Examples:

- Database overload.
- Expensive queries.
- Hot cache keys.
- High network latency.
- Uneven traffic distribution.

### Step 7: Improve Scalability and Reliability

Consider:

- Horizontal scaling.
- Replication.
- Caching.
- Asynchronous processing.
- Load balancing.
- Fault tolerance.

### Step 8: Discuss Trade-Offs

Every architectural choice has trade-offs.

For example:

- SQL vs NoSQL.
- Strong consistency vs eventual consistency.
- Synchronous vs asynchronous communication.
- Monolith vs microservices.
- Cost vs availability.

A good system design answer explains why a particular approach was selected.

---

# 52. Important System Design Interview Questions and Answers

## Q1. What is System Design?

System Design is the process of defining the architecture, components, communication, data storage and infrastructure of a software system.

## Q2. What is HLD?

High-Level Design describes the overall architecture and major components of a system.

## Q3. What is LLD?

Low-Level Design describes implementation details such as classes, interfaces, methods and component interactions.

## Q4. What is the difference between functional and non-functional requirements?

Functional requirements describe what the system does. Non-functional requirements describe quality attributes such as scalability, availability and performance.

## Q5. What is scalability?

Scalability is the ability of a system to handle increased workload by adding resources.

## Q6. What is vertical scaling?

Vertical scaling increases the resources of an existing machine.

## Q7. What is horizontal scaling?

Horizontal scaling adds more machines or application instances.

## Q8. What is a stateless application?

A stateless application does not depend on state stored only within a particular application instance between requests.

## Q9. What is a load balancer?

A load balancer distributes incoming traffic across multiple backend servers.

## Q10. What is a reverse proxy?

A reverse proxy receives client requests and forwards them to backend servers.

## Q11. What is an API Gateway?

An API Gateway provides a centralized entry point for API clients and can handle routing, authentication, rate limiting and other API policies.

## Q12. What is monolithic architecture?

A monolithic application is built and deployed as one primary application unit.

## Q13. What is microservices architecture?

Microservices architecture divides an application into independently deployable services organized around business capabilities.

## Q14. What is a modular monolith?

A modular monolith is a single deployable application divided into well-defined modules with controlled dependencies.

## Q15. What is SOA?

Service-Oriented Architecture is an approach that organizes business capabilities as reusable services.

## Q16. What is a distributed system?

A distributed system consists of multiple independent computers or services communicating over a network.

## Q17. What is partial failure?

Partial failure occurs when one component of a distributed system fails while other components continue operating.

## Q18. What is the CAP theorem?

CAP describes the trade-off between consistency and availability during a network partition in a distributed data system.

## Q19. What is eventual consistency?

Eventual consistency means replicas may temporarily contain different values but are expected to converge when updates stop and communication recovers.

## Q20. What is database replication?

Replication maintains copies of database data across multiple database instances.

## Q21. What is database sharding?

Sharding distributes subsets of a dataset across multiple database nodes.

## Q22. What is database partitioning?

Partitioning divides a large dataset into smaller logical or physical sections.

## Q23. What is caching?

Caching stores frequently accessed data in a faster storage layer to improve performance and reduce repeated computation or database access.

## Q24. What is cache-aside?

Cache-aside is a strategy in which the application checks the cache first and loads missing data from the database.

## Q25. What is cache invalidation?

Cache invalidation removes or updates cached data when the original data changes.

## Q26. What is cache stampede?

Cache stampede occurs when many requests simultaneously attempt to rebuild expired or missing cached data.

## Q27. What is Redis?

Redis is an in-memory data structure server used for caching, counters, sessions, messaging and other workloads.

## Q28. What is a message queue?

A message queue enables asynchronous communication between producers and consumers.

## Q29. What is RabbitMQ?

RabbitMQ is a message broker used for message routing, task queues and asynchronous service communication.

## Q30. What is Kafka?

Apache Kafka is a distributed event streaming platform designed for high-throughput event processing and data pipelines.

## Q31. What is a Kafka partition?

A Kafka partition is an ordered sequence of records within a topic.

## Q32. What is a consumer group?

A consumer group is a collection of Kafka consumers that share the processing of topic partitions.

## Q33. What is Event-Driven Architecture?

It is an architectural style in which components communicate through events.

## Q34. What is Event Sourcing?

Event Sourcing stores changes as a sequence of events from which application state can be reconstructed.

## Q35. What is CQRS?

CQRS separates operations that modify data from operations that retrieve data.

## Q36. What is the Saga pattern?

Saga coordinates a distributed business transaction using a sequence of local transactions and compensating actions.

## Q37. What is the Circuit Breaker pattern?

Circuit Breaker prevents repeated calls to an unhealthy dependency and helps avoid cascading failures.

## Q38. What is exponential backoff?

Exponential backoff increases the delay between retry attempts exponentially.

## Q39. What is rate limiting?

Rate limiting restricts the number of requests a client can make within a defined period.

## Q40. What is distributed locking?

Distributed locking coordinates access to shared resources across multiple processes or machines.

## Q41. What is idempotency?

Idempotency means repeating an operation produces the same intended final effect as performing it once.

## Q42. What is service discovery?

Service discovery allows services to locate other services dynamically.

## Q43. What is a distributed transaction?

A distributed transaction is a logical transaction involving multiple independent services or databases.

## Q44. What is WebSocket?

WebSocket is a protocol that supports persistent, full-duplex communication between a client and server.

## Q45. What is high availability?

High availability is the ability of a system to remain accessible with minimal interruption.

## Q46. What is fault tolerance?

Fault tolerance is the ability of a system to continue operating when components fail.

## Q47. What is a single point of failure?

A single point of failure is a component whose failure can cause a critical system or service to become unavailable.

## Q48. What is RTO?

Recovery Time Objective is the maximum acceptable time to restore a service after a disruption.

## Q49. What is RPO?

Recovery Point Objective is the maximum acceptable amount of data loss measured in time.

## Q50. What is Domain-Driven Design?

Domain-Driven Design is an approach that structures software around business domains and their models.

---

# 53. Practical Exercises

Complete these exercises in order.

## Beginner Level

### Exercise 1: Design a URL Shortener

Requirements:

- Accept long URLs.
- Generate short URLs.
- Redirect users.
- Track clicks.

Deliverables:

- HLD diagram.
- Database schema.
- API endpoints.
- Short-code generation implementation.

### Exercise 2: Implement Redis Caching

Create a Node.js API with:

- Product listing.
- Product details.
- Redis cache.
- Cache TTL.
- Cache invalidation.

Compare API response times with and without caching.

### Exercise 3: Implement Rate Limiting

Create an Express middleware that:

- Limits requests by user or IP.
- Uses Redis.
- Returns HTTP 429 when limits are exceeded.
- Supports a configurable time window.

### Exercise 4: Build a Background Job System

Create an application that:

- Accepts a job.
- Publishes it to RabbitMQ.
- Processes it through a worker.
- Retries failed jobs.
- Uses a dead-letter queue.

## Intermediate Level

### Exercise 5: Build a Real-Time Chat Application

Requirements:

- React frontend.
- Node.js backend.
- TypeScript.
- WebSocket.
- MongoDB or MySQL.
- Redis for presence tracking.

Features:

- One-to-one messaging.
- Message history.
- Online/offline status.
- Delivery acknowledgement.
- Reconnection.

### Exercise 6: Implement a Circuit Breaker

Create a TypeScript circuit breaker that supports:

- Closed state.
- Open state.
- Half-open state.
- Failure threshold.
- Recovery timeout.
- Request timeout.

### Exercise 7: Implement Idempotent Payments

Create an API that:

- Accepts an idempotency key.
- Prevents duplicate payment processing.
- Stores payment status.
- Handles concurrent requests.
- Returns the previous result for repeated requests.

### Exercise 8: Implement Database Replication

Set up a database environment that demonstrates primary-replica replication.

Test:

- Write operations.
- Read operations.
- Replication delay.
- Replica failure.
- Recovery behavior.

## Advanced Level

### Exercise 9: Design an E-Commerce Microservices Architecture

Create services for:

- User.
- Product.
- Cart.
- Order.
- Payment.
- Inventory.
- Notification.

Define:

- Service responsibilities.
- API contracts.
- Database ownership.
- Communication patterns.
- Failure handling.

### Exercise 10: Implement a Saga Pattern

Build an order workflow:

```text
Create Order
     |
     v
Reserve Inventory
     |
     v
Process Payment
     |
     v
Confirm Order
```

Handle failures through compensating transactions.

### Exercise 11: Implement Kafka Event Processing

Create:

- Order producer.
- Kafka topic.
- Payment consumer.
- Notification consumer.
- Consumer group.
- Retry strategy.

### Exercise 12: Design a Social Media Feed

Support:

- User profiles.
- Following.
- Posts.
- Likes.
- Comments.
- News feed.

Compare fan-out on write with fan-out on read.

## Expert Level

### Exercise 13: Design a Payment Platform

Include:

- Payment authorization.
- Capture.
- Refund.
- Idempotency.
- Webhooks.
- Event processing.
- Reconciliation.
- Audit logging.

### Exercise 14: Design a Video Streaming Platform

Include:

- Upload API.
- Object storage.
- Transcoding workers.
- Processing queue.
- Multiple resolutions.
- CDN.
- HLS streaming.

### Exercise 15: Design a Highly Available Application

Design a system with:

- Multiple application instances.
- Load balancing.
- Database replication.
- Redis.
- Message queue.
- Monitoring.
- Disaster recovery.

Define realistic RTO and RPO targets.

---

# 54. Phase 67 Completion Checklist

Use this checklist to evaluate your understanding.

| No. | Topic | Status |
|---|---|---|
| 1 | System Design Fundamentals | ☐ |
| 2 | HLD and LLD | ☐ |
| 3 | Functional Requirements | ☐ |
| 4 | Non-Functional Requirements | ☐ |
| 5 | Latency and Throughput | ☐ |
| 6 | Availability and Reliability | ☐ |
| 7 | Scalability | ☐ |
| 8 | Vertical Scaling | ☐ |
| 9 | Horizontal Scaling | ☐ |
| 10 | Stateless vs Stateful Applications | ☐ |
| 11 | Load Balancing | ☐ |
| 12 | Reverse Proxy | ☐ |
| 13 | API Gateway | ☐ |
| 14 | Monolithic Architecture | ☐ |
| 15 | Microservices Architecture | ☐ |
| 16 | Modular Monolith | ☐ |
| 17 | SOA | ☐ |
| 18 | Distributed Systems | ☐ |
| 19 | CAP Theorem | ☐ |
| 20 | Consistency Models | ☐ |
| 21 | Database Replication | ☐ |
| 22 | Database Sharding | ☐ |
| 23 | Database Partitioning | ☐ |
| 24 | Caching Architecture | ☐ |
| 25 | Cache-Aside | ☐ |
| 26 | Write-Through and Write-Behind | ☐ |
| 27 | Cache Invalidation | ☐ |
| 28 | Redis Advanced | ☐ |
| 29 | Message Queues | ☐ |
| 30 | RabbitMQ | ☐ |
| 31 | Apache Kafka | ☐ |
| 32 | Event-Driven Architecture | ☐ |
| 33 | Event Sourcing | ☐ |
| 34 | CQRS | ☐ |
| 35 | Saga Pattern | ☐ |
| 36 | Circuit Breaker | ☐ |
| 37 | Retry and Backoff | ☐ |
| 38 | Rate Limiting | ☐ |
| 39 | Distributed Locking | ☐ |
| 40 | Idempotency | ☐ |
| 41 | Service Discovery | ☐ |
| 42 | Distributed Transactions | ☐ |
| 43 | API Design at Scale | ☐ |
| 44 | Database Architecture | ☐ |
| 45 | Search Architecture | ☐ |
| 46 | WebSocket Architecture | ☐ |
| 47 | Notification System | ☐ |
| 48 | Chat Application Design | ☐ |
| 49 | E-Commerce System Design | ☐ |
| 50 | Payment System Design | ☐ |
| 51 | URL Shortener Design | ☐ |
| 52 | Social Media Design | ☐ |
| 53 | Video Streaming Design | ☐ |
| 54 | High Availability | ☐ |
| 55 | Fault Tolerance | ☐ |
| 56 | Disaster Recovery | ☐ |
| 57 | Domain-Driven Design | ☐ |
| 58 | Clean Architecture | ☐ |
| 59 | Enterprise System Design | ☐ |

---

# 55. What Comes Next?

The next phase will focus on advanced software architecture and engineering patterns.

## Phase 68: Advanced TypeScript – Advanced Software Architecture, Design Patterns, SOLID Principles, Clean Architecture, Domain-Driven Design, Dependency Injection and Enterprise Application Design

Upcoming topics:

1. Software Architecture Fundamentals.
2. Architectural Styles.
3. Layered Architecture.
4. Hexagonal Architecture.
5. Onion Architecture.
6. Clean Architecture.
7. SOLID Principles.
8. Single Responsibility Principle.
9. Open/Closed Principle.
10. Liskov Substitution Principle.
11. Interface Segregation Principle.
12. Dependency Inversion Principle.
13. Creational Design Patterns.
14. Singleton Pattern.
15. Factory Pattern.
16. Abstract Factory Pattern.
17. Builder Pattern.
18. Prototype Pattern.
19. Structural Design Patterns.
20. Adapter Pattern.
21. Bridge Pattern.
22. Composite Pattern.
23. Decorator Pattern.
24. Facade Pattern.
25. Proxy Pattern.
26. Flyweight Pattern.
27. Behavioral Design Patterns.
28. Strategy Pattern.
29. Observer Pattern.
30. Command Pattern.
31. Chain of Responsibility.
32. State Pattern.
33. Template Method.
34. Iterator Pattern.
35. Mediator Pattern.
36. Visitor Pattern.
37. Dependency Injection.
38. Inversion of Control.
39. Repository Pattern.
40. Unit of Work Pattern.
41. Service Layer Pattern.
42. DTO Pattern.
43. Specification Pattern.
44. Domain-Driven Design Advanced.
45. Bounded Context.
46. Aggregates and Aggregate Roots.
47. Entities and Value Objects.
48. Domain Events.
49. Anti-Corruption Layer.
50. Enterprise Application Architecture.

**To continue, say: `OK, Continue to Phase 68`.**