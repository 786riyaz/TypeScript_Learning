# Phase 55: Advanced TypeScript – Microservices Architecture, Service Discovery, API Gateway, Inter-Service Communication, Docker and Kubernetes

**Level:** Expert / Advanced Backend Engineering  
**Prerequisites:** TypeScript, Node.js, Express.js, REST APIs, databases, Redis, message queues, Docker fundamentals and distributed systems.

---

# 1. Learning Objectives

By the end of this phase, you will understand how to:

1. Design and build microservices architectures.
2. Understand the differences between monolithic and microservices applications.
3. Identify service boundaries using Domain-Driven Design (DDD).
4. Implement inter-service communication.
5. Understand API Gateway architecture.
6. Implement service discovery.
7. Understand load balancing and fault tolerance.
8. Implement communication using REST, gRPC and message brokers.
9. Manage configuration and secrets across services.
10. Containerize Node.js and TypeScript applications using Docker.
11. Understand Docker Compose for multi-service applications.
12. Deploy applications using Kubernetes.
13. Understand Pods, Deployments, Services, Ingress and ConfigMaps.
14. Implement health checks and graceful shutdown.
15. Understand distributed tracing and centralized logging.
16. Design production-ready microservices architectures.

---

# 2. What Is Microservices Architecture?

Microservices architecture is an architectural approach in which an application is divided into multiple small, independently deployable services.

Each service handles a specific business capability.

For example, consider an e-commerce application.

A monolithic application might contain:

```text
E-Commerce Application
│
├── Authentication
├── User Management
├── Product Management
├── Cart Management
├── Order Management
├── Payment Management
├── Inventory Management
└── Notification Management
```

All these modules run inside one application.

In a microservices architecture, these modules become independently deployable services.

```text
                  Client Application
                         |
                         |
                    API Gateway
                         |
        ┌────────────────┼────────────────┐
        |                |                |
        v                v                v
   User Service    Product Service    Order Service
        |                |                |
        v                v                v
    User DB           Product DB         Order DB

                         |
             ┌───────────┴───────────┐
             |                       |
             v                       v
       Payment Service        Inventory Service
             |                       |
             v                       v
         Payment DB             Inventory DB

                         |
                         v
                  Notification Service
                         |
                         v
                     Email/SMS
```

Each service:

- Owns a specific business responsibility.
- Can be developed independently.
- Can be deployed independently.
- Can scale independently.
- Can use its own database.
- Communicates with other services through APIs or messaging systems.

### Example

Suppose your application receives 10,000 requests per minute for product information but only 100 requests per minute for payment processing.

In a microservices architecture, you can scale Product Service independently without scaling Payment Service.

This is one of the major advantages of microservices.

---

# 3. Monolithic Architecture vs Microservices Architecture

| Feature | Monolithic | Microservices |
|---|---|---|
| Architecture | Single application | Multiple independent services |
| Deployment | Usually deployed together | Independently deployable |
| Database | Often shared | Ideally service-owned |
| Scaling | Application-level scaling | Individual service scaling |
| Development | Simpler initially | More distributed complexity |
| Communication | Internal function calls | Network communication |
| Failure isolation | More difficult | Better isolation when designed correctly |
| Testing | Relatively straightforward | Requires integration and contract testing |
| Infrastructure | Simpler | More complex |
| Maintenance | Can become difficult as application grows | Independent service ownership |
| Monitoring | Relatively simple | Distributed monitoring required |

### Monolithic Example

```typescript
// app.ts

import express from "express";

const app = express();

app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.use("/payments", paymentRouter);

app.listen(3000);
```

Everything runs inside one application.

### Microservices Example

```text
user-service/
    src/
        app.ts
    package.json

product-service/
    src/
        app.ts
    package.json

order-service/
    src/
        app.ts
    package.json

payment-service/
    src/
        app.ts
    package.json
```

Each service runs independently.

For example:

```text
User Service      → Port 3001
Product Service   → Port 3002
Order Service     → Port 3003
Payment Service   → Port 3004
```

### Important

Microservices are not automatically better than monolithic architecture.

A monolithic application is often a better starting point for small applications and teams.

Microservices introduce additional complexity:

- Network failures.
- Service discovery.
- Distributed transactions.
- Monitoring.
- Deployment orchestration.
- Data consistency.
- Infrastructure management.

**Use microservices when independent deployment, scaling, team ownership or fault isolation justify the additional complexity.**

---

# 4. What Is Domain-Driven Design (DDD)?

Domain-Driven Design is an approach to software development that focuses on understanding and modeling the business domain.

DDD helps identify appropriate service boundaries.

Consider an e-commerce application.

Its business domains might include:

```text
E-Commerce Domain
│
├── Identity Domain
│   ├── Authentication
│   └── User Management
│
├── Catalog Domain
│   ├── Products
│   └── Categories
│
├── Ordering Domain
│   ├── Orders
│   └── Order Items
│
├── Payment Domain
│   ├── Transactions
│   └── Refunds
│
└── Inventory Domain
    ├── Stock
    └── Warehouses
```

Each domain represents a business responsibility.

## 4.1 Bounded Context

A bounded context is a boundary within which a particular domain model and its terminology are consistently defined.

For example:

In the Order Service:

```typescript
interface Order {
    id: string;
    customerId: string;
    totalAmount: number;
    status: "PENDING" | "CONFIRMED" | "CANCELLED";
}
```

In the Payment Service:

```typescript
interface Payment {
    id: string;
    orderId: string;
    amount: number;
    status: "INITIATED" | "SUCCESS" | "FAILED";
}
```

Both services may refer to the same order ID, but they maintain different domain models.

The Payment Service does not need to own the complete Order entity.

## 4.2 Why Bounded Context Matters

Without proper boundaries, services become tightly coupled.

For example:

```text
Order Service
     |
     v
Directly accesses Payment Database
     |
     v
Payment Service
```

This is undesirable because the Order Service becomes dependent on the internal database structure of the Payment Service.

Prefer:

```text
Order Service
     |
     v
Payment Service API
     |
     v
Payment Database
```

Each service owns its internal implementation.

---

# 5. Service Independence and Database-per-Service Pattern

One important microservices principle is that each service should own its data.

Example:

```text
User Service
    |
    v
User Database

Product Service
    |
    v
Product Database

Order Service
    |
    v
Order Database

Payment Service
    |
    v
Payment Database
```

### Why?

Suppose Order Service directly queries the Payment Service database.

If the Payment Service changes its database schema, the Order Service may stop working.

This creates tight coupling.

Instead, communicate through a service API or events.

### TypeScript Example

Payment Service:

```typescript
interface PaymentResponse {
    paymentId: string;
    orderId: string;
    status: "SUCCESS" | "FAILED";
}

async function getPayment(
    paymentId: string
): Promise<PaymentResponse> {

    // Fetch payment from the Payment database.

    return {
        paymentId,
        orderId: "ORD-101",
        status: "SUCCESS"
    };
}
```

Order Service should consume the Payment Service's API rather than directly querying its database.

### Important Exception

Database-per-service is a logical ownership principle.

It does not necessarily mean every service must have a separate physical database server.

Multiple services can share database infrastructure while maintaining separate schemas, access boundaries and ownership.

However, direct cross-service table access should be avoided.

---

# 6. What Is Inter-Service Communication?

In microservices architecture, services need to communicate with each other.

There are two major communication approaches:

1. Synchronous communication.
2. Asynchronous communication.

## 6.1 Synchronous Communication

One service sends a request and waits for a response.

Example:

```text
Order Service
     |
     | HTTP Request
     v
Payment Service
     |
     | HTTP Response
     v
Order Service
```

Common technologies:

- REST API
- gRPC
- GraphQL in suitable service architectures

### Example: Calling Another Service Using Fetch

```typescript
interface Product {
    id: string;
    name: string;
    price: number;
}

async function getProduct(
    productId: string
): Promise<Product> {

    const response = await fetch(
        `http://localhost:3002/products/${productId}`
    );

    if (!response.ok) {
        throw new Error("Product service request failed");
    }

    return response.json() as Promise<Product>;
}
```

Usage:

```typescript
const product = await getProduct("P101");

console.log(product);
```

### Advantages

- Simple request-response model.
- Easy to understand.
- Immediate response.
- Suitable for queries requiring current data.

### Disadvantages

- Services become dependent on each other's availability.
- Network latency increases response time.
- Cascading failures are possible.
- Timeouts and retries must be managed.

---

## 6.2 Asynchronous Communication

One service publishes a message or event without waiting for the receiving service to finish processing it.

Example:

```text
Order Service
     |
     | Publish OrderCreated Event
     v
Message Broker
     |
     ├───────────────┐
     |               |
     v               v
Inventory Service  Notification Service
```

Common technologies:

- RabbitMQ
- Apache Kafka
- Redis Streams
- BullMQ for background jobs

### Example

When an order is created:

```typescript
interface OrderCreatedEvent {
    eventId: string;
    orderId: string;
    customerId: string;
    totalAmount: number;
    occurredAt: string;
}
```

Publishing:

```typescript
async function publishOrderCreated(
    event: OrderCreatedEvent
): Promise<void> {

    // Publish event to a message broker.

    console.log("Order event published", event);
}
```

The Inventory Service and Notification Service can process the event independently.

### Advantages

- Loose coupling.
- Better workload distribution.
- Improved resilience when properly configured.
- Services can process tasks independently.

### Disadvantages

- Eventual consistency.
- Duplicate message handling.
- More complex debugging.
- Message ordering considerations.
- Additional infrastructure.

---

# 7. What Is an API Gateway?

An API Gateway is a single entry point through which external clients access multiple backend services.

Without an API Gateway:

```text
Frontend
   |
   ├── User Service
   |
   ├── Product Service
   |
   ├── Order Service
   |
   └── Payment Service
```

The frontend must know the address of every service.

With an API Gateway:

```text
                  Frontend
                     |
                     v
                API Gateway
                     |
       ┌─────────────┼─────────────┐
       |             |             |
       v             v             v
  User Service  Product Service  Order Service
```

The frontend communicates with one endpoint.

For example:

```text
https://api.example.com/users
https://api.example.com/products
https://api.example.com/orders
```

The gateway forwards requests to the appropriate service.

## 7.1 Responsibilities of API Gateway

An API Gateway can handle:

1. Request routing.
2. Authentication.
3. Rate limiting.
4. Request validation.
5. TLS termination.
6. Logging.
7. Response transformation.
8. Load balancing.
9. API version management.
10. Request aggregation.

### Example Routing

```text
/api/users/*      → User Service
/api/products/*   → Product Service
/api/orders/*     → Order Service
/api/payments/*   → Payment Service
```

## 7.2 API Gateway vs Reverse Proxy

| API Gateway | Reverse Proxy |
|---|---|
| API-focused entry point | General request forwarding |
| Can handle authentication | May handle authentication |
| Can enforce API policies | Often handles routing and TLS |
| Can aggregate multiple APIs | Usually forwards requests |
| Can transform API requests/responses | May support transformations |

An API Gateway often uses reverse-proxy functionality internally.

## 7.3 Popular API Gateway Solutions

- Kong Gateway
- NGINX
- Amazon API Gateway
- Traefik
- Envoy Proxy

**Important:** An API Gateway can become a bottleneck or single point of failure if it is not deployed redundantly.

---

# 8. Implementing a Simple API Gateway Using Express.js

Let's create a basic API Gateway using Express and `http-proxy-middleware`.

### Installation

```bash
npm install express http-proxy-middleware
npm install -D typescript tsx @types/node @types/express
```

### Project Structure

```text
api-gateway/
│
├── src/
│   └── server.ts
│
├── package.json
└── tsconfig.json
```

### server.ts

```typescript
import express from "express";

import {
    createProxyMiddleware
} from "http-proxy-middleware";

const app = express();

app.use(
    "/users",
    createProxyMiddleware({
        target: "http://localhost:3001",
        changeOrigin: true
    })
);

app.use(
    "/products",
    createProxyMiddleware({
        target: "http://localhost:3002",
        changeOrigin: true
    })
);

app.use(
    "/orders",
    createProxyMiddleware({
        target: "http://localhost:3003",
        changeOrigin: true
    })
);

app.listen(3000, () => {
    console.log("API Gateway running on port 3000");
});
```

Now clients can access all services through port `3000`.

```text
http://localhost:3000/users
http://localhost:3000/products
http://localhost:3000/orders
```

This is an educational example. A production gateway also needs authentication, authorization, timeouts, observability, rate limiting and careful request-header handling.

---

# 9. What Is Service Discovery?

In a microservices architecture, service instances may start, stop, restart or move between machines.

How does one service discover the address of another?

This is the problem solved by service discovery.

### Without Service Discovery

Suppose the Order Service calls the Payment Service:

```typescript
const PAYMENT_SERVICE_URL =
    "http://192.168.1.20:3004";
```

This creates a problem.

What happens if the Payment Service moves to another server?

You must update the address in every dependent service.

This is not scalable.

### With Service Discovery

```text
             Service Registry
                    |
          ┌─────────┼─────────┐
          |         |         |
          v         v         v
      User       Product    Payment
     Service     Service    Service
          ^         ^         ^
          |         |         |
          └─────────┼─────────┘
                    |
              Order Service
```

Services register their availability and network addresses.

Other services discover them through the registry or platform networking.

## 9.1 Types of Service Discovery

### A. Client-Side Discovery

The client queries the service registry and selects an available instance.

```text
Order Service
     |
     v
Service Registry
     |
     v
Available Payment Instances
     |
     v
Selected Payment Instance
```

The client handles instance selection and potentially load balancing.

### B. Server-Side Discovery

The client sends the request to a load balancer or proxy.

That component discovers and selects an available service instance.

```text
Order Service
     |
     v
Load Balancer
     |
     v
Payment Service Instance
```

The client does not need to know individual instance addresses.

## 9.2 Service Discovery Tools

Examples:

- Consul
- etcd
- Netflix Eureka
- Kubernetes DNS-based service discovery.

### Important

When running services inside Kubernetes, you generally do not need to introduce a separate service registry just for basic service discovery.

Kubernetes Services and cluster DNS already provide service discovery.

---

# 10. What Is Load Balancing?

Load balancing distributes incoming requests across multiple instances of an application.

Suppose you have three instances of Product Service:

```text
                 Load Balancer
                       |
          ┌────────────┼────────────┐
          |            |            |
          v            v            v
      Instance 1   Instance 2   Instance 3
```

Instead of sending every request to one server, the load balancer distributes traffic.

## 10.1 Common Load Balancing Algorithms

| Algorithm | Description |
|---|---|
| Round Robin | Distributes requests sequentially |
| Weighted Round Robin | Distributes according to assigned weights |
| Least Connections | Selects instance with fewer active connections |
| IP Hash | Uses client IP to select an instance |
| Random | Selects an instance randomly |

### Round Robin Example

```text
Request 1 → Instance 1
Request 2 → Instance 2
Request 3 → Instance 3
Request 4 → Instance 1
Request 5 → Instance 2
```

### Why Is Load Balancing Important?

- Better traffic distribution.
- Improved availability.
- Horizontal scalability.
- Reduced load on individual instances.

### Health Checks

A load balancer should avoid routing traffic to unhealthy instances.

A typical health endpoint:

```typescript
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy"
    });
});
```

In production, distinguish between liveness and readiness:

- **Liveness:** Is the process alive and able to continue?
- **Readiness:** Is the service ready to receive traffic?

A service can be alive but not ready because its database connection has not been established.

---

# 11. What Is gRPC?

gRPC is a high-performance Remote Procedure Call (RPC) framework.

It allows one service to call a function exposed by another service over a network.

Instead of designing an HTTP endpoint manually, you define a service contract using Protocol Buffers.

### REST Example

```http
GET /users/101
```

### gRPC Concept

```typescript
const user = await userClient.getUser({
    id: "101"
});
```

The client calls a remote procedure that behaves somewhat like a local function call.

However, network failures, timeouts and serialization still apply.

## 11.1 Protocol Buffers

Protocol Buffers (Protobuf) is a language-neutral serialization format.

Example:

**user.proto**

```protobuf
syntax = "proto3";

package user;

service UserService {
    rpc GetUser (UserRequest) returns (UserResponse);
}

message UserRequest {
    string id = 1;
}

message UserResponse {
    string id = 1;
    string name = 2;
    string email = 3;
}
```

This defines:

- A service called `UserService`.
- An RPC method called `GetUser`.
- A request message.
- A response message.

Client and server code can be generated from the contract.

## 11.2 gRPC Communication Types

gRPC supports four major communication patterns:

| Type | Description |
|---|---|
| Unary RPC | One request, one response |
| Server Streaming | One request, multiple responses |
| Client Streaming | Multiple requests, one response |
| Bidirectional Streaming | Multiple requests and responses |

### Unary RPC

```text
Client → Request → Server
Client ← Response ← Server
```

### Server Streaming

```text
Client → Request → Server
Client ← Response 1
Client ← Response 2
Client ← Response 3
```

### Client Streaming

```text
Client → Request 1
Client → Request 2
Client → Request 3
Client ← Response
```

### Bidirectional Streaming

```text
Client ⇄ Server
```

Both sides can send multiple messages.

## 11.3 REST vs gRPC

| Feature | REST | gRPC |
|---|---|---|
| Communication | HTTP-based resource APIs | RPC |
| Typical data format | JSON | Protobuf |
| Serialization | Usually text-based | Binary |
| Contract | OpenAPI commonly used | Protobuf |
| Browser support | Excellent | Often requires gRPC-Web or a gateway |
| Streaming | Possible, with suitable HTTP mechanisms | Built-in streaming patterns |
| Performance | Depends on implementation and payload | Often efficient |
| Use case | Public APIs and general web services | Internal service communication |

### When Should You Use gRPC?

Use gRPC when:

- You need strongly defined service contracts.
- Internal services communicate frequently.
- Streaming is useful.
- Binary serialization is beneficial.
- You control both service clients and servers.

REST is often more convenient for public-facing APIs and browser applications.

---

# 12. What Is a Circuit Breaker Pattern?

Imagine the Order Service depends on the Payment Service.

If Payment Service becomes unavailable, the Order Service continues making requests.

Every request times out.

This can consume connections, threads or other resources and eventually cause cascading failures.

The Circuit Breaker pattern prevents continuous calls to an unhealthy dependency.

## 12.1 Circuit Breaker States

There are three primary states.

### A. Closed

Requests are allowed.

```text
Order Service
     |
     v
Payment Service
```

Failures are monitored.

### B. Open

When failures exceed a configured threshold, the circuit opens.

Requests are rejected immediately or handled through a fallback.

```text
Order Service
     |
     v
Circuit Breaker
     |
     X
Payment Service
```

### C. Half-Open

After a waiting period, a limited number of test requests are allowed.

If they succeed, the circuit closes.

If they fail, it opens again.

```text
Closed → Open → Half-Open → Closed
```

## 12.2 Example Using Opossum

Install:

```bash
npm install opossum
npm install -D @types/opossum
```

Example:

```typescript
import CircuitBreaker from "opossum";

async function callPaymentService(): Promise<string> {

    const response = await fetch(
        "http://localhost:3004/payments",
        {
            signal: AbortSignal.timeout(3000)
        }
    );

    if (!response.ok) {
        throw new Error("Payment service failed");
    }

    return response.text();
}

const breaker = new CircuitBreaker(
    callPaymentService,
    {
        timeout: 4000,
        errorThresholdPercentage: 50,
        resetTimeout: 10000
    }
);

breaker.fallback(() => {
    return "Payment service temporarily unavailable";
});

const result = await breaker.fire();

console.log(result);
```

### Important

A circuit breaker does not fix the failing service.

It protects dependent services from repeatedly waiting on an unhealthy dependency.

A production design should also consider:

- Request timeouts.
- Bounded retries.
- Exponential backoff.
- Jitter.
- Bulkheads.
- Fallback behavior.

Avoid retrying every failed request immediately because this can make an outage worse.

---

# 13. What Is the Bulkhead Pattern?

The Bulkhead pattern isolates resources so that failure in one component does not exhaust resources needed by other components.

The name comes from compartments in a ship.

If one compartment floods, other compartments remain protected.

### Example

Suppose your application calls:

- Payment Service.
- Notification Service.
- Inventory Service.

If Notification Service becomes extremely slow, it should not consume all available resources and block payment operations.

A bulkhead can provide:

- Separate connection pools.
- Separate worker pools.
- Independent concurrency limits.
- Resource isolation.

### Architecture

```text
                Order Service
                      |
          ┌───────────┼───────────┐
          |           |           |
          v           v           v
       Payment   Notification  Inventory
       Pool       Pool          Pool
          |           |           |
          v           v           v
       Payment    Notification  Inventory
       Service    Service       Service
```

Each dependency has a controlled resource allocation.

---

# 14. What Is Distributed Configuration Management?

In a monolithic application, you may manage configuration in one environment file.

In microservices, every service may have its own configuration.

Example:

```text
User Service
    └── .env

Product Service
    └── .env

Order Service
    └── .env

Payment Service
    └── .env
```

Common configuration values include:

- Database connection strings.
- Service URLs.
- Redis URLs.
- Message broker URLs.
- API keys.
- JWT secrets.
- Logging levels.

## 14.1 Environment Variables in Node.js

```typescript
const PORT = Number(process.env.PORT ?? 3000);

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
}
```

### Why Use Environment Variables?

They allow you to deploy the same application to different environments without changing source code.

```text
Development
    DATABASE_URL=localhost

Staging
    DATABASE_URL=staging-db

Production
    DATABASE_URL=production-db
```

### Important Security Rules

Never commit sensitive `.env` files to Git.

Use dedicated secret management systems for production credentials.

Examples:

- AWS Secrets Manager.
- HashiCorp Vault.
- Kubernetes Secrets with appropriate encryption and access controls.

Environment variables are configuration delivery mechanisms, not a complete secret-management solution.

---

# 15. What Is Containerization?

Containerization packages an application and its dependencies into a standardized executable environment.

A container includes:

- Application code.
- Runtime dependencies.
- Required system libraries.
- Configuration defaults.
- Startup instructions.

The most common containerization platform is Docker.

### Without Docker

You might face:

```text
Developer Machine:
Node.js 22
Application works

Production Server:
Node.js 18
Application fails
```

Different environments may have different dependency versions.

### With Docker

You package the application into a container image.

```text
Developer Machine
        |
        v
   Docker Image
        |
        v
   Production Server
        |
        v
   Docker Container
```

The application runs in a more consistent environment.

---

# 16. Docker Fundamentals

Before creating Dockerfiles, understand these concepts.

| Concept | Meaning |
|---|---|
| Dockerfile | Instructions for building an image |
| Image | Read-only template used to create containers |
| Container | Running instance of an image |
| Registry | Stores and distributes images |
| Volume | Persists or shares data |
| Network | Enables container communication |
| Docker Engine | Builds and runs containers |
| Docker Compose | Defines and manages multi-container applications |

### Image vs Container

```text
Docker Image
     |
     | docker run
     v
Docker Container
```

An image is the template.

A container is an instance created from that template.

You can create multiple containers from the same image.

---

# 17. Creating a Dockerfile for a TypeScript Application

Suppose you have a Node.js TypeScript application.

Project structure:

```text
user-service/
│
├── src/
│   └── server.ts
│
├── package.json
├── package-lock.json
├── tsconfig.json
└── Dockerfile
```

### Step 1: Create package.json

```json
{
    "name": "user-service",
    "version": "1.0.0",
    "scripts": {
        "build": "tsc",
        "start": "node dist/server.js",
        "dev": "tsx watch src/server.ts"
    },
    "dependencies": {
        "express": "^5.0.0"
    },
    "devDependencies": {
        "@types/express": "^5.0.0",
        "@types/node": "^22.0.0",
        "tsx": "^4.0.0",
        "typescript": "^5.0.0"
    }
}
```

The versions are illustrative. Use compatible versions in your actual project.

### Step 2: Create tsconfig.json

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "CommonJS",
        "rootDir": "./src",
        "outDir": "./dist",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true
    },
    "include": ["src"]
}
```

### Step 3: Create server.ts

```typescript
import express from "express";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        service: "user-service"
    });
});

app.get("/users", (req, res) => {
    res.json([
        {
            id: 1,
            name: "John"
        },
        {
            id: 2,
            name: "Alex"
        }
    ]);
});

const PORT = Number(process.env.PORT ?? 3001);

app.listen(PORT, "0.0.0.0", () => {
    console.log(`User Service running on ${PORT}`);
});
```

Notice:

```typescript
app.listen(PORT, "0.0.0.0");
```

Binding to `0.0.0.0` makes the server accessible through the container's network interface rather than only its loopback interface.

### Step 4: Create Dockerfile

```dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY tsconfig.json ./

COPY src ./src

RUN npm run build


FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/server.js"]
```

### Understanding the Dockerfile

**FROM**

```dockerfile
FROM node:22-alpine
```

Defines the base image.

**WORKDIR**

```dockerfile
WORKDIR /app
```

Defines the working directory inside the container.

**COPY**

```dockerfile
COPY package*.json ./
```

Copies package manifests.

**RUN**

```dockerfile
RUN npm ci
```

Executes a command during image building.

**EXPOSE**

```dockerfile
EXPOSE 3001
```

Documents the port the application listens on. It does not publish the port automatically.

**CMD**

```dockerfile
CMD ["node", "dist/server.js"]
```

Defines the default command when the container starts.

### What Is Multi-Stage Building?

Our Dockerfile contains two stages:

```text
Builder Stage
    |
    ├── Install development dependencies
    ├── Compile TypeScript
    └── Generate dist/
             |
             v
Production Stage
    |
    ├── Install production dependencies
    ├── Copy dist/
    └── Start application
```

The production image does not need TypeScript compiler dependencies.

This can reduce image size and attack surface.

---

# 18. Docker Commands You Must Know

### Build an Image

```bash
docker build -t user-service .
```

### Run a Container

```bash
docker run -d -p 3001:3001 --name user-service user-service
```

### List Running Containers

```bash
docker ps
```

### List All Containers

```bash
docker ps -a
```

### View Logs

```bash
docker logs user-service
```

### Follow Logs

```bash
docker logs -f user-service
```

### Stop Container

```bash
docker stop user-service
```

### Start Container

```bash
docker start user-service
```

### Remove Container

```bash
docker rm user-service
```

### Remove Image

```bash
docker rmi user-service
```

### Execute Command Inside Container

```bash
docker exec -it user-service sh
```

### Inspect Container

```bash
docker inspect user-service
```

### View Images

```bash
docker images
```

### Important

Removing a container does not necessarily remove its associated persistent volumes.

Also, data stored only in a container's writable filesystem can be lost when that container is removed.

---

# 19. What Is Docker Compose?

Docker Compose is a tool for defining and running multi-container applications.

Suppose your application contains:

```text
API Gateway
User Service
Product Service
Order Service
MongoDB
Redis
```

Without Docker Compose, you need to configure and start every container individually.

With Docker Compose, you define the complete environment in one YAML file.

### Example Architecture

```text
             Docker Compose
                   |
       ┌───────────┼───────────┐
       |           |           |
       v           v           v
   API Gateway  User Service Product Service
       |           |           |
       └───────────┼───────────┘
                   |
                   v
                MongoDB
```

## 19.1 docker-compose.yml

```yaml
services:

  api-gateway:
    build: ./api-gateway
    ports:
      - "3000:3000"
    depends_on:
      - user-service
      - product-service

  user-service:
    build: ./user-service
    environment:
      PORT: 3001
    expose:
      - "3001"

  product-service:
    build: ./product-service
    environment:
      PORT: 3002
    expose:
      - "3002"

  mongodb:
    image: mongo:8
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

This is a simplified example. It assumes the gateway has corresponding service routes and the services are configured to use the MongoDB service where needed.

### Start All Services

```bash
docker compose up
```

### Start in Background

```bash
docker compose up -d
```

### Stop Services

```bash
docker compose down
```

### Rebuild Images

```bash
docker compose up --build
```

### View Logs

```bash
docker compose logs
```

### View Specific Service Logs

```bash
docker compose logs user-service
```

## 19.2 Service-to-Service Communication

Docker Compose creates a network for the application.

Containers can communicate using service names as DNS hostnames.

For example:

```typescript
const USER_SERVICE_URL =
    "http://user-service:3001";
```

Inside the Docker Compose network, the service name `user-service` resolves to the appropriate container address.

You generally should not use `localhost` to reach another container.

Inside a container, `localhost` refers to that same container.

### Important: depends_on

This:

```yaml
depends_on:
  - user-service
```

controls startup ordering, but does not automatically guarantee that User Service is ready to accept requests.

Use health checks and appropriate readiness/retry handling when service readiness matters.

---

# 20. What Is Kubernetes?

Kubernetes is an open-source container orchestration platform.

Docker helps you build and run containers.

Kubernetes helps you manage containerized applications across a cluster of machines.

### Why Do We Need Kubernetes?

Imagine your application has:

```text
User Service:       5 containers
Product Service:   10 containers
Order Service:      8 containers
Payment Service:    4 containers
```

Managing these containers manually becomes difficult.

You need:

- Automatic deployment.
- Scaling.
- Load balancing.
- Health monitoring.
- Restarting failed containers.
- Rolling updates.
- Service discovery.
- Resource management.

Kubernetes provides these capabilities.

### Kubernetes Architecture

```text
                    Kubernetes Cluster
                           |
                ┌──────────┴──────────┐
                |                     |
                v                     v
           Control Plane          Worker Nodes
                |                     |
                |              ┌──────┴──────┐
                |              |             |
                v              v             v
          API Server         Node 1        Node 2
          Scheduler            |             |
          Controller           v             v
          Manager            Pods          Pods
          etcd
```

The control plane manages the cluster.

Worker nodes run application workloads.

---

# 21. Kubernetes Core Components

Let's understand the most important Kubernetes concepts.

## 21.1 Cluster

A Kubernetes cluster is a collection of machines that run containerized applications.

It consists of:

- Control plane.
- Worker nodes.

## 21.2 Node

A Node is a machine in the Kubernetes cluster.

It can be a physical machine or a virtual machine.

## 21.3 Pod

A Pod is the smallest deployable unit in Kubernetes.

A Pod contains one or more containers.

Example:

```text
Kubernetes Node
      |
      v
     Pod
      |
      ├── Container 1
      |
      └── Container 2
```

Containers inside the same Pod share:

- Network namespace.
- Pod IP address.
- Port space.
- Configured shared volumes.

They are typically used together when they need tightly coupled lifecycle or resource sharing.

### Important

A Pod is not the same as a Docker container.

A Pod is a Kubernetes abstraction that can contain one or multiple containers.

## 21.4 Deployment

A Deployment manages a set of replicated Pods.

Suppose you want three instances of User Service.

```text
User Service Deployment
          |
     ┌────┼────┐
     |    |    |
     v    v    v
    Pod  Pod  Pod
```

Kubernetes tries to maintain the desired number of replicas.

If a managed Pod disappears, the Deployment's controller works to restore the desired state.

## 21.5 Service

A Kubernetes Service provides a stable network endpoint for accessing a group of Pods.

Why is this needed?

Pods can be recreated, and their IP addresses can change.

A Service gives clients a stable DNS name and virtual IP.

```text
Order Service
      |
      v
User Service
      |
      v
Kubernetes Service
      |
   ┌──┴──┐
   |     |
   v     v
 Pod 1  Pod 2
```

## 21.6 Ingress

Ingress manages external HTTP/HTTPS access to services inside a Kubernetes cluster.

Example:

```text
api.example.com/users
        |
        v
     Ingress
        |
        v
   User Service
```

An Ingress resource needs an Ingress Controller to implement its routing behavior.

## 21.7 ConfigMap

A ConfigMap stores non-sensitive configuration data.

Example:

```yaml
apiVersion: v1
kind: ConfigMap

metadata:
  name: user-service-config

data:
  PORT: "3001"
  NODE_ENV: "production"
```

## 21.8 Secret

A Kubernetes Secret stores sensitive configuration values such as credentials.

Example:

```yaml
apiVersion: v1
kind: Secret

metadata:
  name: user-service-secret

type: Opaque

stringData:
  DATABASE_PASSWORD: "example-password"
```

**Security note:** Kubernetes Secrets are not automatically encrypted in every storage configuration. Configure encryption at rest, restrict RBAC access and avoid committing real credentials to Git.

---

# 22. Kubernetes Deployment Example

Let's deploy our TypeScript User Service.

First, build and publish the Docker image to a container registry accessible to your cluster.

For illustration:

```bash
docker build -t your-registry/user-service:1.0.0 .

docker push your-registry/user-service:1.0.0
```

## 22.1 Create user-deployment.yaml

```yaml
apiVersion: apps/v1

kind: Deployment

metadata:
  name: user-service

spec:

  replicas: 3

  selector:
    matchLabels:
      app: user-service

  template:

    metadata:
      labels:
        app: user-service

    spec:

      containers:

        - name: user-service

          image: your-registry/user-service:1.0.0

          ports:
            - containerPort: 3001

          env:
            - name: PORT
              value: "3001"
```

### Understanding the Configuration

```yaml
replicas: 3
```

Requests three Pod replicas.

```yaml
selector:
  matchLabels:
    app: user-service
```

Identifies the Pods managed by this Deployment.

```yaml
image: your-registry/user-service:1.0.0
```

Specifies the container image.

```yaml
containerPort: 3001
```

Documents the application port inside the container.

## 22.2 Create user-service.yaml

```yaml
apiVersion: v1

kind: Service

metadata:
  name: user-service

spec:

  selector:
    app: user-service

  ports:
    - protocol: TCP
      port: 3001
      targetPort: 3001

  type: ClusterIP
```

This creates an internal Kubernetes Service.

Other Pods can communicate with it using:

```text
http://user-service:3001
```

## 22.3 Apply the Configurations

```bash
kubectl apply -f user-deployment.yaml

kubectl apply -f user-service.yaml
```

## 22.4 Check Pods

```bash
kubectl get pods
```

## 22.5 Check Deployments

```bash
kubectl get deployments
```

## 22.6 Check Services

```bash
kubectl get services
```

## 22.7 View Logs

```bash
kubectl logs <pod-name>
```

## 22.8 Describe a Pod

```bash
kubectl describe pod <pod-name>
```

---

# 23. Kubernetes Horizontal Pod Autoscaling (HPA)

What happens if traffic increases?

Suppose your application currently runs three replicas.

During peak traffic, three instances may not be sufficient.

Kubernetes Horizontal Pod Autoscaler can automatically adjust the number of Pod replicas according to configured metrics.

Example:

```yaml
apiVersion: autoscaling/v2

kind: HorizontalPodAutoscaler

metadata:
  name: user-service-hpa

spec:

  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: user-service

  minReplicas: 3
  maxReplicas: 10

  metrics:
    - type: Resource

      resource:
        name: cpu

        target:
          type: Utilization
          averageUtilization: 70
```

This configuration requests:

- Minimum replicas: 3.
- Maximum replicas: 10.
- Target average CPU utilization: 70%.

Kubernetes can increase or decrease replicas based on observed metrics.

### Important

HPA requires an appropriate metrics source, commonly Metrics Server for resource metrics.

Also, CPU-based scaling does not always represent application load accurately. Queue depth, request latency and custom metrics may be better scaling signals for some workloads.

---

# 24. Kubernetes Health Checks

Kubernetes supports three important probe types.

| Probe | Purpose |
|---|---|
| Liveness Probe | Determines whether a container should be restarted |
| Readiness Probe | Determines whether a Pod should receive traffic |
| Startup Probe | Allows slow-starting applications time to initialize |

### Example

```yaml
containers:

  - name: user-service

    image: your-registry/user-service:1.0.0

    ports:
      - containerPort: 3001

    startupProbe:
      httpGet:
        path: /health
        port: 3001
      periodSeconds: 5
      failureThreshold: 30

    livenessProbe:
      httpGet:
        path: /health
        port: 3001
      periodSeconds: 10

    readinessProbe:
      httpGet:
        path: /ready
        port: 3001
      periodSeconds: 5
```

The application must implement both endpoints.

Example:

```typescript
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "alive"
    });
});

app.get("/ready", async (req, res) => {

    const databaseReady = true; // Replace with real dependency check.

    if (!databaseReady) {
        return res.status(503).json({
            status: "not-ready"
        });
    }

    return res.status(200).json({
        status: "ready"
    });
});
```

Do not make a liveness check depend on every external service.

For example, a temporary database outage should not automatically restart every application instance if the process itself is healthy.

---

# 25. Graceful Shutdown in Node.js

When a service receives a termination signal, it should shut down safely.

For example, Kubernetes may terminate a Pod during:

- Deployment updates.
- Scaling operations.
- Node maintenance.
- Pod replacement.

If your application shuts down immediately, active requests may fail.

### Example

```typescript
import express from "express";

const app = express();

const server = app.listen(3001, () => {
    console.log("Server running on port 3001");
});

let shuttingDown = false;

app.get("/ready", (req, res) => {

    if (shuttingDown) {
        return res.status(503).json({
            status: "shutting-down"
        });
    }

    return res.json({
        status: "ready"
    });
});

async function shutdown(): Promise<void> {

    console.log("Graceful shutdown started");

    shuttingDown = true;

    server.close(async (error) => {

        if (error) {
            console.error(error);
            process.exitCode = 1;
        }

        // Close database pools, Redis clients,
        // message broker connections and workers here.

        console.log("Server shutdown completed");

        process.exit();
    });
}

process.on("SIGTERM", shutdown);

process.on("SIGINT", shutdown);
```

This is a simplified example. A production shutdown should also have:

- A shutdown timeout.
- Protection against repeated signal handling.
- Active request draining.
- Database and broker connection cleanup.
- Worker shutdown coordination.

Avoid calling `process.exit()` before cleanup has completed.

---

# 26. What Is Distributed Logging?

In a monolithic application, logs may be available in one place.

In microservices, each service produces separate logs.

```text
User Service       → Logs
Product Service    → Logs
Order Service      → Logs
Payment Service    → Logs
Notification       → Logs
```

Finding the complete lifecycle of one request becomes difficult.

Distributed logging collects logs from multiple services in a centralized system.

Popular tools include:

- Elasticsearch
- Logstash
- Kibana
- Grafana Loki
- Fluent Bit

## 26.1 Structured Logging

Instead of logging plain text:

```typescript
console.log("Order created successfully");
```

Use structured JSON:

```typescript
console.log(
    JSON.stringify({
        level: "info",
        service: "order-service",
        event: "ORDER_CREATED",
        orderId: "ORD-101",
        timestamp: new Date().toISOString()
    })
);
```

Structured logs are easier to search, filter and analyze.

## 26.2 Correlation ID

A correlation ID helps identify related operations across multiple services.

Example:

```text
Client Request
     |
     v
API Gateway
     |
     | correlationId: req-123
     v
Order Service
     |
     | correlationId: req-123
     v
Payment Service
     |
     | correlationId: req-123
     v
Notification Service
```

All services include the same correlation ID in their logs.

This makes debugging distributed workflows easier.

---

# 27. What Is Distributed Tracing?

Distributed tracing tracks a request as it travels across multiple services.

Example:

```text
Client Request
      |
      v
API Gateway
      |
      v
Order Service
      |
      v
Payment Service
      |
      v
Inventory Service
      |
      v
Notification Service
```

A distributed trace contains multiple spans.

Each span represents an operation or part of the request lifecycle.

Example:

```text
Trace ID: abc123

Span 1: API Gateway       20ms
Span 2: Order Service     40ms
Span 3: Payment Service  150ms
Span 4: Inventory         30ms
Span 5: Notification      80ms
```

You can identify which service is consuming the most time.

### Popular Tools

- OpenTelemetry
- Jaeger
- Zipkin
- Grafana Tempo

### What Is OpenTelemetry?

OpenTelemetry is a collection of APIs, SDKs and tools for generating and exporting:

1. Traces.
2. Metrics.
3. Logs.

It helps standardize observability across services.

---

# 28. What Is Service Mesh?

A Service Mesh is an infrastructure layer that manages communication between services.

It can provide:

- Service-to-service security.
- Mutual TLS (mTLS).
- Traffic management.
- Observability.
- Retries and timeouts.
- Traffic splitting.

Example:

```text
           Kubernetes Cluster

       ┌──────────────────────┐
       |                      |
       |   User Service       |
       |       |              |
       |   Sidecar Proxy      |
       |                      |
       └──────────────────────┘

                 |
                 |
       ┌──────────────────────┐
       |                      |
       |   Order Service      |
       |       |              |
       |   Sidecar Proxy      |
       |                      |
       └──────────────────────┘
```

The proxies handle some communication concerns independently of application code.

### Popular Service Mesh Technologies

- Istio
- Linkerd
- Consul

### Do You Always Need a Service Mesh?

No.

For small and medium-sized systems, a service mesh may introduce unnecessary complexity.

Adopt it when its traffic management, security and observability capabilities justify its operational cost.

---

# 29. What Is a Distributed System?

A distributed system consists of multiple independent computers or services that communicate over a network to accomplish a common objective.

Examples:

- E-commerce platforms.
- Banking systems.
- Payment platforms.
- Ride-sharing applications.
- Social media platforms.
- Cloud computing platforms.

### Challenges in Distributed Systems

1. Network latency.
2. Network failures.
3. Partial failures.
4. Data inconsistency.
5. Duplicate messages.
6. Clock synchronization.
7. Concurrent updates.
8. Service availability.
9. Distributed transactions.
10. Monitoring complexity.

### Important Concept: Partial Failure

In a monolithic application, one process may fail.

In a distributed system, one service can fail while the rest of the system continues running.

Example:

```text
User Service       → Available
Product Service    → Available
Order Service      → Available
Payment Service    → Unavailable
Notification       → Available
```

The entire system does not necessarily need to stop.

The application should handle the unavailable dependency gracefully.

---

# 30. What Is the CAP Theorem?

The CAP theorem describes trade-offs in distributed data systems during a network partition.

CAP stands for:

- Consistency.
- Availability.
- Partition Tolerance.

### Consistency

Every successful read receives the latest committed value, according to the system's consistency model.

### Availability

Every request to a non-failing node receives a response, even if that response may not contain the latest data.

### Partition Tolerance

The system continues operating despite communication failures between parts of the distributed system.

### Important CAP Principle

When a network partition occurs, a distributed system must make trade-offs between consistency and availability.

```text
             CAP
              |
       ┌──────┼──────┐
       |      |      |
       C      A      P
```

It is misleading to say that a distributed system simply chooses any two properties under all circumstances.

Partition tolerance is generally necessary in distributed environments. The important trade-off during a partition is between consistency and availability.

---

# 31. What Is Eventual Consistency?

Eventual consistency is a consistency model in which replicas or services may temporarily contain different data but are expected to converge if updates stop and communication succeeds.

Example:

An order is created.

```text
Order Service
     |
     v
Order Status = CONFIRMED
     |
     v
Event Published
     |
     v
Inventory Service
     |
     v
Inventory Updated
```

There may be a short delay before Inventory Service reflects the latest order event.

During this period, services may temporarily disagree.

### Real-World Example

Suppose a user places an order.

The Order Service immediately stores:

```json
{
    "orderId": "ORD-101",
    "status": "CONFIRMED"
}
```

The Notification Service may receive the event a few milliseconds later.

The notification is not necessarily sent at exactly the same moment as the database update.

This is normal in asynchronous distributed systems.

### Important

Eventual consistency is not an excuse for uncontrolled inconsistency.

Your system should define:

- Expected propagation delays.
- Retry behavior.
- Failure handling.
- Reconciliation procedures.
- User-visible status transitions.

---

# 32. What Is the Saga Pattern?

In microservices, one business transaction may involve multiple services.

Example:

Placing an order may require:

1. Create Order.
2. Process Payment.
3. Reserve Inventory.
4. Arrange Shipment.

These operations may involve different databases.

You cannot generally wrap all these operations in one ordinary database transaction.

The Saga pattern coordinates a distributed business workflow through a sequence of local transactions.

### Example

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
Create Shipment
     |
     v
Order Completed
```

What if inventory reservation fails?

The system may need to compensate for the payment operation.

```text
Create Order
     |
     v
Process Payment
     |
     v
Reserve Inventory
     |
     X
     |
     v
Refund Payment
     |
     v
Cancel Order
```

## 32.1 Compensating Transactions

A compensating transaction performs a business action to counteract an earlier operation.

Examples:

| Original Operation | Compensation |
|---|---|
| Payment captured | Refund payment |
| Inventory reserved | Release inventory |
| Order created | Cancel order |
| Shipment arranged | Cancel shipment if possible |

A compensation is not necessarily an exact rollback.

For example, a payment refund may take time and may involve additional fees.

## 32.2 Saga Choreography

In choreography, services react to events published by other services.

```text
Order Service
     |
     | OrderCreated
     v
Payment Service
     |
     | PaymentCompleted
     v
Inventory Service
     |
     | InventoryReserved
     v
Shipping Service
```

No central coordinator controls every step.

## 32.3 Saga Orchestration

In orchestration, a central coordinator decides which service should execute the next step.

```text
          Order Saga
          Orchestrator
                |
       ┌────────┼────────┐
       |        |        |
       v        v        v
    Payment  Inventory Shipping
    Service   Service   Service
```

### Choreography vs Orchestration

| Feature | Choreography | Orchestration |
|---|---|---|
| Coordination | Event-driven | Central coordinator |
| Central controller | No | Yes |
| Complexity | Can grow with many participants | Coordinator adds complexity |
| Visibility | Workflow may be harder to follow | Central workflow visibility |
| Best suited for | Simpler event-driven workflows | Complex business workflows |

---

# 33. What Is the Transactional Outbox Pattern?

Suppose Order Service performs two operations:

1. Save an order to its database.
2. Publish an `OrderCreated` event to RabbitMQ or Kafka.

What if the database operation succeeds but message publishing fails?

```text
Save Order
    |
    v
Database Success
    |
    v
Publish Event
    |
    X
    |
    v
Message Broker Failure
```

Now the order exists, but other services do not know about it.

This is called the dual-write problem.

The Transactional Outbox Pattern solves this problem by saving the business record and an outgoing event record in the same database transaction.

### Architecture

```text
            Order Service
                 |
                 v
           Database Transaction
                 |
          ┌──────┴──────┐
          |             |
          v             v
      Save Order   Save Outbox Event
          |             |
          └──────┬──────┘
                 |
                 v
             Commit
                 |
                 v
          Outbox Publisher
                 |
                 v
            Message Broker
```

### Example Database Tables

Orders:

```sql
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) NOT NULL
);
```

Outbox:

```sql
CREATE TABLE outbox_events (
    id VARCHAR(50) PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    payload JSON NOT NULL,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL
);
```

### TypeScript Concept

```typescript
interface OutboxEvent {
    id: string;
    eventType: string;
    payload: Record<string, unknown>;
    publishedAt: Date | null;
}
```

Inside a database transaction:

```typescript
await sequelize.transaction(async (transaction) => {

    const order = await Order.create(
        {
            id: "ORD-101",
            customerId: "CUS-101",
            totalAmount: 1500,
            status: "PENDING"
        },
        {
            transaction
        }
    );

    await OutboxEventModel.create(
        {
            id: crypto.randomUUID(),
            eventType: "ORDER_CREATED",
            payload: {
                orderId: order.id,
                customerId: order.customerId
            }
        },
        {
            transaction
        }
    );

});
```

A separate publisher periodically reads unpublished outbox records and sends them to the broker.

After successful publication, it marks the record as published.

### Important

The database transaction does not include the broker publication.

A publisher can crash after sending an event but before marking it published.

Therefore, duplicate publication is possible.

Consumers must be idempotent.

---

# 34. What Is Distributed Deployment?

In a microservices environment, services can be deployed independently.

Example:

```text
Production Environment
│
├── API Gateway
│
├── User Service
│
├── Product Service
│
├── Order Service
│
├── Payment Service
│
├── Notification Service
│
├── Redis
│
├── RabbitMQ
│
└── Databases
```

Each service may have its own:

- Source code repository.
- Docker image.
- CI/CD pipeline.
- Configuration.
- Monitoring.
- Deployment schedule.

### Why Independent Deployment Matters

Suppose you need to update the Notification Service.

You should not need to redeploy the Payment Service if no dependency contract has changed.

This reduces unnecessary deployment risk.

---

# 35. CI/CD for Microservices

CI/CD stands for:

- Continuous Integration.
- Continuous Delivery or Deployment.

### Typical Pipeline

```text
Developer Pushes Code
         |
         v
    Git Repository
         |
         v
    Automated Tests
         |
         v
    TypeScript Build
         |
         v
    Docker Image Build
         |
         v
    Security Scanning
         |
         v
    Push Image to Registry
         |
         v
    Deploy to Kubernetes
         |
         v
    Health Verification
```

### Common Tools

- GitHub Actions
- Jenkins
- GitLab CI/CD
- Argo CD

### Important

CI/CD pipelines should test service contracts and integration points, not just whether each individual service compiles.

A service can build successfully but still break communication with another service.

---

# 36. Microservices Security

Security becomes more complex when an application has multiple independently communicating services.

Important practices:

### 1. Authentication

Verify the identity of the user or service.

### 2. Authorization

Verify whether the authenticated identity is allowed to perform an operation.

### 3. Service-to-Service Authentication

Services should authenticate one another.

### 4. TLS

Encrypt network communication.

### 5. Mutual TLS

Both communicating services authenticate each other using certificates.

### 6. Secrets Management

Avoid hardcoding:

- Database passwords.
- API keys.
- JWT secrets.
- Broker credentials.

### 7. Network Policies

Restrict which services can communicate with each other.

### 8. Least Privilege

Give each service only the permissions it needs.

### 9. Input Validation

Validate messages and requests received from other services.

### 10. Audit Logging

Record security-relevant operations.

**Important:** Internal network traffic should not automatically be considered trusted. A compromised internal service can still become a security threat.

---

# 37. Microservices Testing Strategy

Testing microservices requires several levels of testing.

| Testing Type | Purpose |
|---|---|
| Unit Testing | Tests individual functions and classes |
| Integration Testing | Tests interactions with databases and external components |
| Contract Testing | Verifies communication contracts between services |
| End-to-End Testing | Tests complete business workflows |
| Performance Testing | Measures throughput and latency |
| Resilience Testing | Tests behavior during failures |

### Example: Unit Test

```typescript
function calculateTotal(
    price: number,
    quantity: number
): number {

    return price * quantity;
}
```

Test:

```typescript
import { describe, it, expect } from "vitest";

describe("calculateTotal", () => {

    it("should calculate the total amount", () => {

        const result = calculateTotal(100, 3);

        expect(result).toBe(300);

    });

});
```

### Contract Testing

Suppose Order Service expects:

```typescript
interface PaymentResponse {
    paymentId: string;
    status: "SUCCESS" | "FAILED";
}
```

Payment Service must continue returning a compatible response.

Contract testing verifies that communication expectations remain valid.

Tools include:

- Pact

---

# 38. Complete Practical Project: E-Commerce Microservices Architecture

Now let's combine the concepts into one practical project.

## Project Overview

Build an e-commerce backend using:

- TypeScript.
- Node.js.
- Express.js.
- MongoDB or MySQL.
- Redis.
- RabbitMQ.
- Docker.
- Docker Compose.
- Kubernetes.

## 38.1 Architecture

```text
                       Frontend
                          |
                          v
                     API Gateway
                          |
          ┌───────────────┼────────────────┐
          |               |                |
          v               v                v
     User Service    Product Service   Order Service
          |               |                |
          v               v                v
       User DB         Product DB        Order DB
                                           |
                                           v
                                      RabbitMQ
                                           |
                            ┌──────────────┼──────────────┐
                            |              |              |
                            v              v              v
                      Payment Service Inventory     Notification
                            |           Service        Service
                            v              |              |
                        Payment DB      Inventory DB   Email/SMS
```

## 38.2 Suggested Project Structure

```text
ecommerce-microservices/
│
├── api-gateway/
│
├── services/
│   │
│   ├── user-service/
│   │
│   ├── product-service/
│   │
│   ├── order-service/
│   │
│   ├── payment-service/
│   │
│   ├── inventory-service/
│   │
│   └── notification-service/
│
├── infrastructure/
│   │
│   ├── docker/
│   │
│   ├── kubernetes/
│   │
│   └── rabbitmq/
│
├── docker-compose.yml
│
└── README.md
```

## 38.3 Service Responsibilities

| Service | Responsibility |
|---|---|
| API Gateway | Routes external requests |
| User Service | Authentication and user management |
| Product Service | Product catalog |
| Order Service | Order creation and management |
| Payment Service | Payment processing |
| Inventory Service | Stock management |
| Notification Service | Email and SMS notifications |

## 38.4 Order Processing Workflow

When a customer places an order:

**Step 1:** Frontend sends an order request to API Gateway.

**Step 2:** API Gateway forwards the request to Order Service.

**Step 3:** Order Service validates the order and saves it with a pending status.

**Step 4:** Order Service writes an `OrderCreated` event to its outbox in the same database transaction.

**Step 5:** Outbox Publisher sends the event to RabbitMQ.

**Step 6:** Payment Service consumes the event and processes payment.

**Step 7:** Payment Service publishes a `PaymentCompleted` or `PaymentFailed` event.

**Step 8:** Inventory Service reacts to the payment result and reserves stock when appropriate.

**Step 9:** Order Service updates the order status.

**Step 10:** Notification Service sends the customer an email or SMS.

The workflow should use idempotent consumers, bounded retries and compensating actions.

---

# 39. Important Microservices Design Principles

Remember these principles when designing production applications.

| Principle | Explanation |
|---|---|
| Single Responsibility | Each service should own a clear business capability |
| Loose Coupling | Avoid unnecessary dependencies between services |
| High Cohesion | Related business logic should stay together |
| Database Ownership | Services should control their own data |
| Independent Deployment | Services should be deployable independently |
| Fault Isolation | One service failure should not unnecessarily crash others |
| Observability | Logs, metrics and traces should be available |
| Resilience | Handle timeouts, failures and retries |
| Idempotency | Repeated requests or messages should not duplicate business effects |
| Security | Authenticate and authorize service communication |

---

# 40. Common Microservices Mistakes

### Mistake 1: Splitting Every Module Into a Service

Not every module needs to become an independent service.

Too many small services increase operational complexity.

### Mistake 2: Sharing One Database Without Ownership Boundaries

Multiple services directly modifying the same tables creates tight coupling.

### Mistake 3: Too Many Synchronous Calls

A long chain of synchronous calls increases latency and creates cascading failure risks.

### Mistake 4: Ignoring Distributed Transactions

A business workflow involving multiple services needs explicit failure and compensation strategies.

### Mistake 5: No Centralized Monitoring

Without centralized observability, diagnosing production problems becomes difficult.

### Mistake 6: No Timeout Configuration

Network requests should have appropriate timeouts.

### Mistake 7: Unlimited Retries

Unlimited retries can overload already unhealthy services.

### Mistake 8: Treating Internal Services as Automatically Trusted

Internal services still need authentication, authorization and network security.

### Mistake 9: Running Everything in Kubernetes Too Early

Kubernetes is powerful, but its operational complexity may be unnecessary for a small application.

### Mistake 10: Ignoring Data Consistency

Asynchronous communication can introduce temporary inconsistency. Design the user experience and business workflow around that reality.

---

# 41. Interview Questions and Answers

### Q1. What is microservices architecture?

An architectural style in which an application is divided into independently deployable services, each responsible for a specific business capability.

### Q2. What is the difference between monolithic and microservices architecture?

A monolithic application runs its components as one application, while microservices divide the system into independent services communicating over a network.

### Q3. What is Domain-Driven Design?

DDD is an approach to software design that models the software around business domains and their rules.

### Q4. What is a bounded context?

A bounded context is a boundary within which a domain model and its terminology have a specific, consistent meaning.

### Q5. What is database-per-service?

A design principle in which each service owns and controls its data rather than allowing other services to directly access its database.

### Q6. What is an API Gateway?

A single entry point that routes external client requests to appropriate backend services.

### Q7. What is service discovery?

A mechanism that allows services to locate available instances of other services dynamically.

### Q8. What is the difference between client-side and server-side discovery?

Client-side discovery lets the client select an instance using a registry. Server-side discovery delegates selection to a load balancer or proxy.

### Q9. What is load balancing?

Distributing incoming requests across multiple service instances.

### Q10. What is gRPC?

A high-performance RPC framework that commonly uses Protocol Buffers for service contracts and serialization.

### Q11. What is Protocol Buffers?

A language-neutral binary serialization format used to define and exchange structured data.

### Q12. What is a circuit breaker?

A resilience pattern that stops repeated calls to a failing dependency and allows it time to recover.

### Q13. What are the circuit breaker states?

Closed, Open and Half-Open.

### Q14. What is the bulkhead pattern?

A pattern that isolates resources so failure or overload in one component does not exhaust resources needed by others.

### Q15. What is containerization?

Packaging an application and its dependencies into a standardized container image.

### Q16. What is Docker?

A platform for building, distributing and running containerized applications.

### Q17. What is the difference between a Docker image and a container?

An image is a template; a container is a running or stopped instance created from an image.

### Q18. What is Docker Compose?

A tool for defining and managing multi-container applications through a YAML configuration.

### Q19. Why do we use Kubernetes?

To orchestrate containers, manage deployments, scale workloads, provide service discovery and maintain desired application state.

### Q20. What is a Kubernetes Pod?

The smallest deployable Kubernetes unit, containing one or more containers.

### Q21. What is a Kubernetes Deployment?

A Kubernetes resource that manages replicated Pods and their desired state.

### Q22. What is a Kubernetes Service?

A resource that provides a stable network endpoint for accessing a set of Pods.

### Q23. What is Ingress?

A Kubernetes API resource that defines external HTTP/HTTPS routing to cluster services.

### Q24. What is ConfigMap?

A Kubernetes resource used to store non-sensitive configuration data.

### Q25. What is Kubernetes Secret?

A Kubernetes resource designed to hold sensitive configuration values.

### Q26. What is HPA?

Horizontal Pod Autoscaler automatically adjusts the number of replicas based on configured metrics.

### Q27. What is the difference between liveness and readiness probes?

Liveness determines whether a container should be restarted. Readiness determines whether it should receive traffic.

### Q28. What is distributed tracing?

A technique for tracking requests as they travel across multiple services.

### Q29. What is OpenTelemetry?

An observability framework that provides APIs, SDKs and tools for generating traces, metrics and logs.

### Q30. What is a service mesh?

An infrastructure layer that manages service-to-service communication, security and traffic policies.

### Q31. What is eventual consistency?

A consistency model in which distributed replicas may temporarily disagree but are expected to converge.

### Q32. What is the CAP theorem?

A theorem describing consistency and availability trade-offs during network partitions in distributed data systems.

### Q33. What is the Saga pattern?

A distributed transaction pattern that coordinates a sequence of local transactions with compensating actions when necessary.

### Q34. What is Saga choreography?

A Saga implementation in which services coordinate through events without a central orchestrator.

### Q35. What is Saga orchestration?

A Saga implementation in which a central coordinator manages the workflow.

### Q36. What is the Transactional Outbox Pattern?

A pattern that saves business data and outgoing events in the same database transaction, then publishes the events separately.

### Q37. What is the dual-write problem?

A reliability problem that occurs when an application writes to two independent systems, such as a database and a message broker, and only one operation succeeds.

### Q38. What is graceful shutdown?

A process of stopping a service safely by rejecting new work, allowing active requests to finish and closing resources.

### Q39. What is the difference between Docker Compose and Kubernetes?

Docker Compose is commonly used to define and run multi-container environments, while Kubernetes orchestrates containerized workloads across a cluster.

### Q40. When should you choose microservices over monolithic architecture?

When independent deployment, scaling, team ownership or fault isolation justify the additional distributed-system complexity.

---

# 42. Practical Exercises

Complete these exercises before moving to the next phase.

## Beginner Level

1. Explain monolithic and microservices architecture with diagrams.
2. Create a basic User Service using Express and TypeScript.
3. Create a Product Service using Express and TypeScript.
4. Make User Service and Product Service run on separate ports.
5. Implement a simple API Gateway.
6. Configure environment variables for each service.
7. Create a Dockerfile for User Service.
8. Build and run the User Service container.

## Intermediate Level

9. Create Docker Compose configuration for three services.
10. Connect two services using REST APIs.
11. Implement service health endpoints.
12. Implement request timeouts.
13. Implement a basic circuit breaker.
14. Add structured logging.
15. Implement correlation IDs.
16. Add database-per-service boundaries.
17. Create Kubernetes Deployment and Service manifests.
18. Configure readiness and liveness probes.

## Advanced Level

19. Implement gRPC communication between two TypeScript services.
20. Implement a Saga workflow for order processing.
21. Implement the Transactional Outbox Pattern.
22. Configure RabbitMQ communication between services.
23. Add centralized logging.
24. Implement distributed tracing with OpenTelemetry.
25. Deploy multiple services to a Kubernetes cluster.
26. Configure Horizontal Pod Autoscaling.
27. Implement graceful shutdown.
28. Design a complete e-commerce microservices system.

---

# 43. Phase 55 Completion Checklist

Use this checklist to evaluate your understanding.

| No. | Topic | Status |
|---|---|---|
| 1 | Microservices Architecture | ☐ |
| 2 | Monolithic vs Microservices | ☐ |
| 3 | Domain-Driven Design | ☐ |
| 4 | Bounded Context | ☐ |
| 5 | Database per Service | ☐ |
| 6 | Inter-Service Communication | ☐ |
| 7 | Synchronous vs Asynchronous Communication | ☐ |
| 8 | API Gateway | ☐ |
| 9 | Service Discovery | ☐ |
| 10 | Load Balancing | ☐ |
| 11 | gRPC | ☐ |
| 12 | Circuit Breaker | ☐ |
| 13 | Bulkhead Pattern | ☐ |
| 14 | Configuration Management | ☐ |
| 15 | Docker | ☐ |
| 16 | Dockerfile | ☐ |
| 17 | Docker Compose | ☐ |
| 18 | Kubernetes Architecture | ☐ |
| 19 | Pods and Deployments | ☐ |
| 20 | Kubernetes Services | ☐ |
| 21 | Ingress | ☐ |
| 22 | ConfigMaps and Secrets | ☐ |
| 23 | Horizontal Pod Autoscaling | ☐ |
| 24 | Health Checks | ☐ |
| 25 | Graceful Shutdown | ☐ |
| 26 | Distributed Logging | ☐ |
| 27 | Distributed Tracing | ☐ |
| 28 | Service Mesh | ☐ |
| 29 | Distributed Systems | ☐ |
| 30 | CAP Theorem | ☐ |
| 31 | Eventual Consistency | ☐ |
| 32 | Saga Pattern | ☐ |
| 33 | Transactional Outbox | ☐ |
| 34 | CI/CD | ☐ |
| 35 | Microservices Security | ☐ |
| 36 | Microservices Testing | ☐ |

---

# 44. What Comes Next?

**Phase 56: Advanced TypeScript – System Design, High-Level Design (HLD), Low-Level Design (LLD), Scalability, Caching, Database Sharding, Replication, CDN, Performance Optimization and Production Architecture**

Upcoming topics:

1. System Design Fundamentals.
2. High-Level Design (HLD).
3. Low-Level Design (LLD).
4. Functional and Non-Functional Requirements.
5. Scalability.
6. Vertical vs Horizontal Scaling.
7. Stateless vs Stateful Architecture.
8. Database Replication.
9. Database Sharding.
10. Database Partitioning.
11. Database Indexing Strategies.
12. Distributed Caching.
13. Redis Advanced Concepts.
14. Cache-Aside Pattern.
15. Write-Through and Write-Behind Caching.
16. Cache Invalidation.
17. CDN Architecture.
18. Load Balancing Strategies.
19. Database Connection Pooling.
20. Read and Write Separation.
21. High Availability.
22. Fault Tolerance.
23. Disaster Recovery.
24. Performance Optimization.
25. Designing URL Shortener.
26. Designing an E-Commerce System.
27. Designing a Chat Application.
28. Designing a Notification System.
29. Designing a Video Streaming Platform.
30. Production-Ready System Design.

**Phase 55 is complete.**