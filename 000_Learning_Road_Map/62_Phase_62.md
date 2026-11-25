# Phase 62: Advanced TypeScript – Microservices Architecture, API Gateway, Inter-Service Communication, gRPC, Message Brokers, Event-Driven Architecture and Distributed Systems

**Level:** Expert / Advanced Distributed Systems Engineering  
**Prerequisites:** TypeScript, JavaScript, Node.js, Express.js, REST APIs, databases, Redis, Docker, Kubernetes, CI/CD, system design and Phase 61.

---

# 1. Learning Objectives

By the end of this phase, you will understand how to:

1. Design microservices-based applications.
2. Understand Domain-Driven Design (DDD).
3. Identify bounded contexts.
4. Decompose monolithic applications into services.
5. Implement API Gateway architecture.
6. Understand service discovery.
7. Implement inter-service communication.
8. Compare synchronous and asynchronous communication.
9. Implement REST-based service communication.
10. Understand gRPC and Protocol Buffers.
11. Work with message brokers.
12. Implement RabbitMQ and Apache Kafka.
13. Understand event-driven architecture.
14. Implement event producers and consumers.
15. Understand eventual consistency.
16. Implement Saga and Outbox patterns.
17. Understand CQRS and Event Sourcing.
18. Implement idempotent consumers.
19. Understand message ordering and delivery guarantees.
20. Implement retries and Dead Letter Queues.
21. Understand distributed caching and locking.
22. Implement service resilience.
23. Monitor distributed systems using tracing.
24. Secure microservices.
25. Design and test production-ready distributed systems.

---

# 2. Microservices Architecture Deep Dive

## 2.1 What Are Microservices?

Microservices architecture is an architectural style in which an application is divided into small, independently deployable services.

Each service is responsible for a specific business capability.

For example, consider an e-commerce application.

Its responsibilities include:

- User management.
- Product management.
- Shopping cart.
- Order processing.
- Payments.
- Notifications.
- Inventory management.

In a monolithic application, these modules may be deployed together.

In microservices architecture, they can become independent services.

### Monolithic Architecture

```text
                 E-Commerce Application
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
       Users             Products          Orders
          |                |                |
          +----------------+----------------+
                           |
                           v
                        Payments
                           |
                           v
                         MySQL
```

Everything is deployed as one application.

### Microservices Architecture

```text
                     API Gateway
                          |
       +------------------+------------------+
       |          |        |        |        |
       v          v        v        v        v
     User      Product   Order   Payment  Inventory
    Service   Service  Service  Service   Service
       |          |        |        |        |
       v          v        v        v        v
     User DB   Product DB Order DB Payment DB Inventory DB
                          |
                          v
                    Message Broker
                          |
                          v
                   Notification Service
```

Each service can be developed, deployed and scaled independently.

## 2.2 Characteristics of Microservices

Important characteristics:

1. Independent deployment.
2. Business-capability ownership.
3. Decentralized data management.
4. Service-to-service communication.
5. Independent scaling.
6. Fault isolation.
7. Automated deployment.
8. Distributed monitoring.

**Important:** Microservices do not necessarily mean that every service must use a different programming language or database. Technology choices should be based on actual requirements.

## 2.3 Advantages

| Advantage | Explanation |
|---|---|
| Independent Deployment | Deploy one service without redeploying every service |
| Independent Scaling | Scale heavily used services separately |
| Fault Isolation | Failure in one service may be contained |
| Team Ownership | Teams can own individual business capabilities |
| Technology Flexibility | Different services can use different technologies |
| Maintainability | Smaller services can be easier to understand when boundaries are well designed |

## 2.4 Disadvantages

| Disadvantage | Explanation |
|---|---|
| Network Complexity | Services communicate through networks |
| Distributed Failures | Network requests can fail independently |
| Data Consistency | Multiple databases complicate transactions |
| Monitoring Complexity | Requires distributed observability |
| Deployment Complexity | Many services need deployment management |
| Infrastructure Cost | More infrastructure and operational overhead |

**Professional principle:** Microservices solve organizational and architectural scaling problems, but they introduce distributed-systems complexity. Do not split an application into microservices without a clear reason.

---

# 3. Domain-Driven Design (DDD)

## 3.1 What Is Domain-Driven Design?

Domain-Driven Design is an approach to software development that focuses on understanding the business domain and designing software around its concepts.

For example, consider an e-commerce application.

The business domain includes:

- Customers.
- Products.
- Orders.
- Payments.
- Inventory.
- Shipping.

DDD helps organize the application according to these business concepts.

## 3.2 Domain

A domain is the business area that an application is designed to solve problems for.

Example:

```text
E-Commerce Domain
```

It includes all the business rules related to online purchasing.

## 3.3 Subdomains

A large domain can be divided into smaller subdomains.

Example:

```text
E-Commerce
    |
    +---- Customer Management
    |
    +---- Product Management
    |
    +---- Order Management
    |
    +---- Payment Management
    |
    +---- Inventory Management
```

Subdomains can be classified as:

| Type | Meaning |
|---|---|
| Core Subdomain | Provides the main business differentiation |
| Supporting Subdomain | Supports the core business |
| Generic Subdomain | Common functionality that is not unique to the business |

Example:

For an e-commerce business:

- Core: Order optimization or specialized pricing.
- Supporting: Inventory management.
- Generic: Basic authentication.

These classifications depend on the business.

## 3.4 Bounded Context

A bounded context is an explicit boundary within which a particular domain model and its terminology have a defined meaning.

Consider the concept of a customer.

In different business contexts, a customer may have different responsibilities.

```text
Customer Context
    |
    +---- Customer Profile
    +---- Contact Information

Order Context
    |
    +---- Customer ID
    +---- Delivery Address

Payment Context
    |
    +---- Customer ID
    +---- Billing Information
```

The same business entity does not need to have an identical model in every service.

This is an important DDD concept.

## 3.5 Ubiquitous Language

Ubiquitous Language means using consistent business terminology between developers and domain experts.

For example:

If the business uses the term `Order`, developers should use the same term rather than introducing unnecessary alternative names.

This improves communication and reduces misunderstandings.

## 3.6 Aggregates and Entities

### Entity

An entity has a unique identity.

Example:

```typescript
class Order {
  constructor(
    public readonly id: string,
    public customerId: string
  ) {}
}
```

Two orders can have identical values but different identities.

### Value Object

A value object is defined by its values rather than a unique identity.

Example:

```typescript
class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string
  ) {
    if (amount < 0) {
      throw new Error("Amount cannot be negative");
    }
  }
}
```

### Aggregate

An aggregate is a group of related domain objects treated as one consistency boundary.

The aggregate root controls access to the aggregate's internal state.

Example:

```text
Order Aggregate
      |
      v
   Order
      |
      +---- Order Items
      |
      +---- Shipping Address
```

The `Order` entity can act as the aggregate root.

## 3.7 Repository Pattern

A repository abstracts data access from business logic.

Example:

```typescript
interface OrderRepository {
  findById(id: string): Promise<Order | null>;

  save(order: Order): Promise<void>;
}
```

Implementation:

```typescript
class MySqlOrderRepository
  implements OrderRepository {

  async findById(id: string): Promise<Order | null> {
    // Query MySQL using Sequelize.
    return null;
  }

  async save(order: Order): Promise<void> {
    // Persist the order.
  }
}
```

The domain logic depends on the repository interface rather than directly depending on Sequelize.

---

# 4. Service Decomposition

## 4.1 What Is Service Decomposition?

Service decomposition is the process of dividing a large application into smaller services with clear responsibilities.

Consider a monolithic Expense Tracker application.

Initially:

```text
Expense Tracker
    |
    +---- Authentication
    |
    +---- Users
    |
    +---- Expenses
    |
    +---- Categories
    |
    +---- Reports
    |
    +---- Notifications
```

Possible service decomposition:

```text
                 API Gateway
                      |
       +--------------+--------------+
       |              |              |
       v              v              v
   Auth Service   Expense Service  Report Service
       |              |              |
       v              v              v
    Auth DB        Expense DB     Report Storage
                      |
                      v
               Message Broker
                      |
                      v
              Notification Service
```

## 4.2 How to Identify Service Boundaries

Consider these factors:

1. Business capability.
2. Data ownership.
3. Business rules.
4. Independent deployment requirements.
5. Scaling requirements.
6. Team ownership.
7. Communication frequency.

### Example

An Expense Service should own expense-related operations.

```text
Expense Service
    |
    +---- Create Expense
    +---- Update Expense
    +---- Delete Expense
    +---- List Expenses
    +---- Calculate Expense Totals
```

A Notification Service should own notification-related functionality.

```text
Notification Service
    |
    +---- Send Email
    +---- Send SMS
    +---- Send Push Notification
```

## 4.3 Database per Service Pattern

In microservices architecture, each service should own its data.

Example:

```text
User Service
    |
    v
User Database

Expense Service
    |
    v
Expense Database

Payment Service
    |
    v
Payment Database
```

This does not necessarily mean every service needs a separate physical database server.

Multiple services may share database infrastructure while maintaining separate schemas or logical ownership boundaries.

However, services should not freely access or modify another service's private tables.

### Why?

Suppose the Expense Service directly queries the User Service's database.

Now the Expense Service depends on:

- User database schema.
- User database availability.
- User database credentials.
- User database query structure.

This creates tight coupling.

Better approach:

Use an API or event contract to obtain the required information.

---

# 5. API Gateway Pattern

## 5.1 What Is an API Gateway?

An API Gateway is an entry point through which clients access backend services.

Instead of calling multiple services directly, the frontend communicates with one gateway.

### Without API Gateway

```text
Frontend
   |
   +---- User Service
   |
   +---- Expense Service
   |
   +---- Report Service
   |
   +---- Notification Service
```

The frontend needs to know multiple backend endpoints.

### With API Gateway

```text
                 Frontend
                     |
                     v
                API Gateway
                     |
       +-------------+-------------+
       |             |             |
       v             v             v
   User Service Expense Service Report Service
```

## 5.2 Responsibilities

An API Gateway can handle:

- Request routing.
- Authentication.
- Authorization enforcement.
- Rate limiting.
- Request validation.
- TLS termination.
- Request aggregation.
- API version routing.
- Logging.
- Correlation IDs.

Not every responsibility must live in the gateway. Business authorization and domain rules should remain enforced by the relevant services.

## 5.3 API Gateway Example

Consider this route:

```http
GET /api/expenses
```

The gateway forwards it to:

```http
http://expense-service:3001/expenses
```

Example Express gateway:

```typescript
import express from "express";

const app = express();

app.use("/api/expenses", async (req, res) => {
  try {
    const response = await fetch(
      "http://expense-service:3001/expenses"
    );

    const data = await response.json();

    res.status(response.status).json(data);
  } catch {
    res.status(502).json({
      message: "Expense service unavailable",
    });
  }
});

app.listen(3000);
```

This is a simplified demonstration.

A production gateway must also handle:

- HTTP methods.
- Path forwarding.
- Query parameters.
- Request bodies.
- Headers.
- Authentication context.
- Timeouts.
- Response streaming where appropriate.
- Cancellation.
- Logging and tracing.

## 5.4 API Gateway Products

Common options include:

- Kong Gateway
- NGINX
- AWS API Gateway
- Traefik

---

# 6. Service Discovery

## 6.1 What Is Service Discovery?

Service discovery is the process through which one service finds the network location of another service.

Consider:

```text
Order Service
     |
     v
Payment Service
```

The Order Service needs to know where the Payment Service is running.

In dynamic environments, service IP addresses can change.

Hardcoding IP addresses is therefore problematic.

## 6.2 Service Discovery Approaches

### 1. Client-Side Discovery

The calling service queries a service registry and chooses an available instance.

```text
Order Service
      |
      v
Service Registry
      |
      v
Payment Instances
```

### 2. Server-Side Discovery

The client sends requests to a load balancer or gateway.

The intermediary finds a suitable service instance.

```text
Order Service
      |
      v
Load Balancer
      |
      +---- Payment Instance 1
      |
      +---- Payment Instance 2
```

## 6.3 Kubernetes Service Discovery

Kubernetes provides DNS-based service discovery.

Suppose a Service is named:

```text
payment-service
```

Another Pod can communicate with it using:

```text
http://payment-service:3000
```

For cross-namespace access, a fully qualified service DNS name can be used.

Example:

```text
payment-service.payments.svc.cluster.local
```

This is one of the reasons Kubernetes Services are important.

---

# 7. Inter-Service Communication

Microservices communicate with one another to complete business workflows.

There are two major communication styles.

## 7.1 Synchronous Communication

In synchronous communication, one service sends a request and waits for a response.

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

REST and gRPC are common synchronous communication technologies.

### Example

```typescript
async function getPayment(paymentId: string) {
  const response = await fetch(
    `http://payment-service:3002/payments/${paymentId}`
  );

  if (!response.ok) {
    throw new Error("Payment request failed");
  }

  return response.json();
}
```

### Advantages

- Simple request-response model.
- Immediate response.
- Easy to understand.
- Suitable for queries requiring immediate results.

### Disadvantages

- Services become runtime-dependent.
- Network failures affect request completion.
- Slow dependencies increase latency.
- Cascading failures can occur.

## 7.2 Asynchronous Communication

In asynchronous communication, one service sends a message or event without waiting for the receiving service to finish processing it.

Example:

```text
Order Service
     |
     v
Message Broker
     |
     v
Notification Service
     |
     v
Send Email
```

The Order Service can continue its work after publishing the event.

### Advantages

- Reduced direct coupling.
- Better workload buffering.
- Independent processing.
- Better support for background jobs.

### Disadvantages

- Eventual consistency.
- More complex debugging.
- Duplicate messages may occur.
- Requires message-processing reliability.

## 7.3 Synchronous vs Asynchronous Communication

| Feature | Synchronous | Asynchronous |
|---|---|---|
| Response | Immediate response expected | Response may arrive later |
| Coupling | Higher runtime dependency | Lower direct runtime dependency |
| Latency | Can increase with dependencies | Work can be deferred |
| Failure handling | Request-level errors and timeouts | Retries and message handling |
| Examples | REST, gRPC | RabbitMQ, Kafka |
| Use cases | Fetching current account details | Sending notifications |

**Important:** Asynchronous communication does not automatically guarantee reliability. Durable publishing, acknowledgements, retries and idempotency must be designed appropriately.

---

# 8. REST-Based Service Communication

## 8.1 What Is REST?

REST is an architectural style for designing networked APIs.

Common HTTP methods:

| Method | Purpose |
|---|---|
| GET | Retrieve resources |
| POST | Create resources or initiate processing |
| PUT | Replace a resource |
| PATCH | Partially update a resource |
| DELETE | Delete a resource |

## 8.2 Example: Order Service Calling Payment Service

Order Service:

```typescript
interface PaymentResponse {
  paymentId: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
}

async function createPayment(
  orderId: string,
  amount: number
): Promise<PaymentResponse> {
  const response = await fetch(
    "http://payment-service:3002/payments",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        orderId,
        amount,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Payment service returned ${response.status}`
    );
  }

  return response.json() as Promise<PaymentResponse>;
}
```

Payment Service:

```typescript
import express from "express";

const app = express();

app.use(express.json());

app.post("/payments", async (req, res) => {
  const { orderId, amount } = req.body;

  // Validate input.
  // Create payment record.
  // Process payment.

  res.status(201).json({
    paymentId: "payment_101",
    status: "PENDING",
    orderId,
    amount,
  });
});

app.listen(3002);
```

### Important REST Design Rules

1. Use resource-oriented URLs.
2. Use appropriate HTTP methods.
3. Return meaningful status codes.
4. Validate all incoming requests.
5. Define stable API contracts.
6. Implement timeouts.
7. Use authentication between services.
8. Avoid exposing internal database models directly.

## 8.3 API Versioning

Versioning helps maintain compatibility as APIs evolve.

Example:

```text
/api/v1/orders
/api/v2/orders
```

An older client can continue using version 1 while newer clients use version 2.

Avoid introducing breaking changes without a migration strategy.

---

# 9. Inter-Service Reliability

Network communication can fail for many reasons:

- Service unavailable.
- Network timeout.
- DNS resolution failure.
- Connection refused.
- Rate limiting.
- Temporary infrastructure problems.

A distributed application must expect these failures.

## 9.1 Timeouts

Always set appropriate timeouts for network calls.

Example:

```typescript
async function callPaymentService() {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 3000);

  try {
    const response = await fetch(
      "http://payment-service:3002/payments",
      {
        signal: controller.signal,
      }
    );

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}
```

A timeout prevents a request from waiting indefinitely.

## 9.2 Retries

Retries can help recover from temporary failures.

However, retries should be:

- Limited.
- Applied selectively.
- Delayed using backoff.
- Randomized with jitter where appropriate.
- Used carefully for non-idempotent operations.

Example:

```typescript
async function retry<T>(
  operation: () => Promise<T>,
  maxAttempts: number
): Promise<T> {
  let lastError: unknown;

  for (
    let attempt = 1;
    attempt <= maxAttempts;
    attempt++
  ) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts) {
        break;
      }

      const delay =
        500 * Math.pow(2, attempt - 1);

      await new Promise((resolve) =>
        setTimeout(resolve, delay)
      );
    }
  }

  throw lastError;
}
```

This is a basic exponential-backoff example. Production implementations should also consider jitter, retryable status codes, cancellation and an overall request deadline.

## 9.3 Avoid Retry Storms

Suppose a payment service is unavailable.

If 10,000 clients retry continuously, the service may become even more overloaded.

Use:

- Exponential backoff.
- Jitter.
- Retry limits.
- Circuit breakers.
- Rate limits.
- Bulkheads.

---

# 10. gRPC Fundamentals

## 10.1 What Is gRPC?

gRPC is a high-performance remote procedure call framework.

It enables services to communicate using strongly defined service contracts.

Official documentation:

[gRPC Documentation](https://grpc.io/docs/?utm_source=chatgpt.com)

gRPC commonly uses:

- HTTP/2.
- Protocol Buffers.
- Generated client and server code.
- Streaming communication.

## 10.2 REST vs gRPC

| Feature | REST | gRPC |
|---|---|---|
| Common protocol | HTTP/1.1 or HTTP/2 | HTTP/2 |
| Data format | Commonly JSON | Commonly Protocol Buffers |
| Contract | Often OpenAPI | `.proto` definitions |
| Browser support | Native | Usually needs gRPC-Web or a gateway |
| Streaming | Possible, with suitable mechanisms | Built-in streaming patterns |
| Performance | Depends on implementation and payload | Often efficient for service-to-service communication |

## 10.3 What Are Protocol Buffers?

Protocol Buffers (Protobuf) is a language-neutral serialization format.

It defines structured data using `.proto` files.

Example:

```protobuf
syntax = "proto3";

package payment;

service PaymentService {
  rpc GetPayment (PaymentRequest)
      returns (PaymentResponse);
}

message PaymentRequest {
  string paymentId = 1;
}

message PaymentResponse {
  string paymentId = 1;
  string status = 2;
  double amount = 3;
}
```

Explanation:

- `service` defines an RPC service.
- `rpc` defines an operation.
- `message` defines a data structure.
- Field numbers identify fields in the encoded format.

Field numbers should remain stable. Avoid reusing numbers from deleted fields.

## 10.4 Types of gRPC Communication

There are four major RPC patterns.

| Type | Description |
|---|---|
| Unary RPC | One request and one response |
| Server Streaming | One request and multiple responses |
| Client Streaming | Multiple requests and one response |
| Bidirectional Streaming | Both sides stream messages |

### Unary RPC

```text
Client ---- Request ----> Server
Client <--- Response ---- Server
```

### Server Streaming

```text
Client ---- Request ----> Server
Client <--- Response 1 -- Server
Client <--- Response 2 -- Server
Client <--- Response 3 -- Server
```

### Client Streaming

```text
Client ---- Request 1 ---> Server
Client ---- Request 2 ---> Server
Client ---- Request 3 ---> Server
Client <--- Response ----- Server
```

### Bidirectional Streaming

```text
Client <---- Stream ----> Server
```

## 10.5 TypeScript gRPC Example

Install:

```bash
npm install @grpc/grpc-js @grpc/proto-loader
```

Create:

```text
payment.proto
```

```protobuf
syntax = "proto3";

package payment;

service PaymentService {
  rpc GetPayment (PaymentRequest)
      returns (PaymentResponse);
}

message PaymentRequest {
  string paymentId = 1;
}

message PaymentResponse {
  string paymentId = 1;
  string status = 2;
}
```

### Server Example

```typescript
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const packageDefinition = protoLoader.loadSync(
  "payment.proto"
);

const paymentProto = grpc.loadPackageDefinition(
  packageDefinition
) as any;

const server = new grpc.Server();

server.addService(
  paymentProto.payment.PaymentService.service,
  {
    GetPayment: (
      call: any,
      callback: Function
    ) => {
      callback(null, {
        paymentId: call.request.paymentId,
        status: "SUCCESS",
      });
    },
  }
);

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  (error) => {
    if (error) {
      console.error(error);
      return;
    }

    server.start();

    console.log("gRPC server running on port 50051");
  }
);
```

This is a learning example. In production:

- Use TLS or an appropriately secured service mesh.
- Validate request fields.
- Define explicit request and response types.
- Handle gRPC status codes.
- Set deadlines.
- Implement authentication and authorization.
- Avoid `any` by using generated TypeScript types or typed wrappers.

## 10.6 When Should You Use gRPC?

Good use cases:

- Internal service communication.
- High-volume RPC calls.
- Strong service contracts.
- Streaming communication.
- Polyglot microservices.

REST is often simpler for public APIs and browser-facing applications.

---

# 11. Message Brokers

## 11.1 What Is a Message Broker?

A message broker is software that receives messages from producers and delivers them to consumers.

Example:

```text
Order Service
     |
     v
Message Broker
     |
     +----------------+
     |                |
     v                v
Email Consumer   Analytics Consumer
```

The Order Service does not need to call both consumers directly.

## 11.2 Important Components

| Component | Meaning |
|---|---|
| Producer | Sends messages |
| Consumer | Receives messages |
| Broker | Manages message delivery |
| Queue | Holds messages for consumers |
| Topic | Logical stream or category of messages |
| Exchange | Routes messages in RabbitMQ |
| Partition | Subdivision of a Kafka topic |

## 11.3 Why Use Message Brokers?

Benefits:

- Asynchronous processing.
- Reduced direct service coupling.
- Workload buffering.
- Independent consumer scaling.
- Message durability when configured.
- Event-driven workflows.

---

# 12. RabbitMQ

## 12.1 What Is RabbitMQ?

RabbitMQ is a message broker that supports message routing and queue-based communication.

Official documentation:

[RabbitMQ Documentation](https://www.rabbitmq.com/docs?utm_source=chatgpt.com)

RabbitMQ commonly uses AMQP 0-9-1.

## 12.2 RabbitMQ Architecture

```text
                Producer
                    |
                    v
                 Exchange
                    |
          +---------+---------+
          |                   |
          v                   v
       Queue A              Queue B
          |                   |
          v                   v
       Consumer A          Consumer B
```

## 12.3 RabbitMQ Exchange Types

| Exchange | Purpose |
|---|---|
| Direct | Routes using exact routing-key matches |
| Fanout | Broadcasts to bound queues |
| Topic | Routes using routing-key patterns |
| Headers | Routes using message headers |

### Direct Exchange

A message is routed according to its exact routing key.

Example:

```text
Routing Key: order.created
```

### Fanout Exchange

A message is broadcast to all bound queues.

### Topic Exchange

Supports routing patterns.

Example:

```text
order.*
order.#
```

`*` matches one word.

`#` matches zero or more words.

## 12.4 Install RabbitMQ

For local learning, Docker Compose is convenient.

```yaml
services:
  rabbitmq:
    image: rabbitmq:4-management

    ports:
      - "5672:5672"
      - "15672:15672"
```

Start:

```bash
docker compose up -d
```

Management interface:

```text
http://localhost:15672
```

Use a dedicated non-default account and strong credentials for real deployments.

## 12.5 RabbitMQ with TypeScript

Install:

```bash
npm install amqplib
npm install -D @types/amqplib
```

### Producer

```typescript
import amqp from "amqplib";

async function publishMessage() {
  const connection = await amqp.connect(
    "amqp://localhost"
  );

  const channel = await connection.createChannel();

  const queue = "order-queue";

  await channel.assertQueue(queue, {
    durable: true,
  });

  const message = {
    orderId: "order_101",
    customerId: "user_101",
    amount: 1500,
  };

  channel.sendToQueue(
    queue,
    Buffer.from(JSON.stringify(message)),
    {
      persistent: true,
    }
  );

  console.log("Message published");

  await channel.close();
  await connection.close();
}

publishMessage().catch(console.error);
```

### Consumer

```typescript
import amqp from "amqplib";

async function consumeMessages() {
  const connection = await amqp.connect(
    "amqp://localhost"
  );

  const channel = await connection.createChannel();

  const queue = "order-queue";

  await channel.assertQueue(queue, {
    durable: true,
  });

  await channel.prefetch(10);

  await channel.consume(queue, async (message) => {
    if (!message) {
      return;
    }

    try {
      const data = JSON.parse(
        message.content.toString()
      );

      console.log("Processing order:", data);

      // Process the order here.

      channel.ack(message);
    } catch (error) {
      console.error(error);

      channel.nack(message, false, false);
    }
  });
}

consumeMessages().catch(console.error);
```

### Understanding Acknowledgements

`ack()` tells RabbitMQ that the message was successfully processed.

`nack()` indicates that the message was not successfully processed.

With `requeue: false`, the message is not immediately returned to the same queue. It may be discarded or routed to a configured dead-letter exchange.

For production systems, configure:

- Durable queues.
- Persistent messages.
- Publisher confirms.
- Consumer acknowledgements.
- Dead-letter exchanges.
- Retry policies.
- Prefetch limits.

**Important:** Durable queues and persistent messages do not alone guarantee every possible end-to-end delivery scenario. Publisher confirms and consumer acknowledgements are important parts of reliable processing.

---

# 13. Apache Kafka

## 13.1 What Is Apache Kafka?

Apache Kafka is a distributed event-streaming platform.

It is designed to handle high-throughput event streams and persistent event storage.

Official documentation:

[Apache Kafka Documentation](https://kafka.apache.org/documentation/?utm_source=chatgpt.com)

Kafka is commonly used for:

- Event streaming.
- Activity tracking.
- Analytics pipelines.
- Log aggregation.
- Event-driven microservices.
- Data integration.

## 13.2 Kafka Architecture

```text
                  Producers
                      |
                      v
                 Kafka Topic
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
      Partition 0 Partition 1 Partition 2
          |           |           |
          +-----------+-----------+
                      |
                      v
                  Consumers
```

## 13.3 What Is a Kafka Topic?

A topic is a named category of events.

Examples:

```text
orders
payments
users
notifications
inventory
```

## 13.4 What Is a Partition?

A partition is an ordered sequence of records within a Kafka topic.

Partitions allow Kafka to distribute data and processing across brokers and consumers.

## 13.5 What Is an Offset?

An offset is a position identifying a record within a partition.

Example:

```text
Topic: orders

Partition 0:
Offset 0
Offset 1
Offset 2
Offset 3
```

Consumers track their progress using offsets.

## 13.6 Consumer Groups

A consumer group is a group of consumers cooperating to process records from a topic.

Within one consumer group, a partition is assigned to one consumer at a time.

Example:

```text
Topic: orders

Partition 0 ---> Consumer 1
Partition 1 ---> Consumer 2
Partition 2 ---> Consumer 3
```

If there are more consumers than partitions, some consumers may remain idle.

## 13.7 Kafka vs RabbitMQ

| Feature | RabbitMQ | Kafka |
|---|---|---|
| Main model | Message broker | Distributed event log/streaming platform |
| Storage | Queue-based message storage | Persistent partitioned logs |
| Consumption | Message delivery and acknowledgement | Consumer reads records and tracks offsets |
| Replay | Depends on queue and message-retention configuration | Native log replay within retention |
| Ordering | Queue ordering with concurrency considerations | Ordering within a partition |
| Common use | Task queues and routing | Event streaming and analytics |

Neither is universally better.

Choose based on the messaging and streaming requirements.

## 13.8 Kafka with TypeScript

A popular Node.js library is KafkaJS.

Official documentation:

[KafkaJS Documentation](https://kafka.js.org/?utm_source=chatgpt.com)

Install:

```bash
npm install kafkajs
```

### Producer

```typescript
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "order-service",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

async function publishOrder() {
  await producer.connect();

  await producer.send({
    topic: "orders",

    messages: [
      {
        key: "order_101",

        value: JSON.stringify({
          orderId: "order_101",
          amount: 1500,
        }),
      },
    ],
  });

  await producer.disconnect();
}

publishOrder().catch(console.error);
```

### Consumer

```typescript
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "notification-service",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({
  groupId: "notification-group",
});

async function consumeOrders() {
  await consumer.connect();

  await consumer.subscribe({
    topic: "orders",
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({
      topic,
      partition,
      message,
    }) => {
      const data = JSON.parse(
        message.value?.toString() || "{}"
      );

      console.log({
        topic,
        partition,
        order: data,
      });
    },
  });
}

consumeOrders().catch(console.error);
```

This is a basic demonstration. Production consumers need graceful shutdown, error handling, schema validation, retry strategy and careful offset-commit behavior.

---

# 14. Event-Driven Architecture

## 14.1 What Is Event-Driven Architecture?

Event-Driven Architecture (EDA) is an architectural style where services communicate by producing and consuming events.

An event represents something that has already happened.

Examples:

```text
UserRegistered
OrderCreated
PaymentCompleted
InventoryReserved
ExpenseCreated
```

### Example

When an order is created:

```text
Order Service
     |
     v
OrderCreated Event
     |
     v
Message Broker
     |
     +----------------+
     |                |
     v                v
Payment Service  Notification Service
     |                |
     v                v
Process Payment   Send Email
```

The Order Service does not need to know how every consumer implements its behavior.

## 14.2 Command vs Event

This distinction is important.

### Command

A command asks a system to perform an action.

Example:

```typescript
interface CreateOrderCommand {
  customerId: string;
  productId: string;
  quantity: number;
}
```

### Event

An event records something that has happened.

Example:

```typescript
interface OrderCreatedEvent {
  eventId: string;
  orderId: string;
  customerId: string;
  occurredAt: string;
}
```

Comparison:

| Command | Event |
|---|---|
| Requests an action | Records a fact |
| May be rejected | Represents something that happened |
| Usually directed to a handler | May be consumed by many subscribers |
| Example: CreateOrder | Example: OrderCreated |

## 14.3 Event Schema Design

A production event should include metadata.

Example:

```typescript
interface DomainEvent<T> {
  eventId: string;

  eventType: string;

  eventVersion: number;

  occurredAt: string;

  aggregateId: string;

  correlationId: string;

  payload: T;
}
```

Example event:

```typescript
const orderCreatedEvent: DomainEvent<{
  orderId: string;
  customerId: string;
  amount: number;
}> = {
  eventId: "evt_101",

  eventType: "OrderCreated",

  eventVersion: 1,

  occurredAt: new Date().toISOString(),

  aggregateId: "order_101",

  correlationId: "request_101",

  payload: {
    orderId: "order_101",
    customerId: "user_101",
    amount: 1500,
  },
};
```

The event schema should be versioned and validated by consumers.

---

# 15. Eventual Consistency

## 15.1 What Is Eventual Consistency?

Eventual consistency is a consistency model in which distributed replicas or services may temporarily have different data, but are expected to converge when updates are successfully propagated and processed.

Example:

A customer creates an order.

```text
Order Service
     |
     v
Order Created
     |
     v
Message Broker
     |
     +-------------------+
     |                   |
     v                   v
Inventory Service   Analytics Service
     |                   |
     v                   v
Inventory Updated   Report Updated
```

These updates may not happen at exactly the same moment.

For a short period:

- Order Service knows the order exists.
- Inventory Service may not have processed the event.
- Analytics Service may still show the previous total.

Eventually, the services converge.

## 15.2 Strong Consistency vs Eventual Consistency

| Strong Consistency | Eventual Consistency |
|---|---|
| Reads reflect committed updates according to the chosen consistency guarantee | Reads may temporarily return stale data |
| Useful for strict consistency requirements | Useful for many distributed workflows |
| May require coordination | Can allow more independent processing |
| Example: Some account-balance operations | Example: Analytics dashboards |

**Important:** Eventual consistency is not an excuse for uncontrolled inconsistency. Define acceptable delays, reconciliation procedures and failure handling.

---

# 16. Saga Pattern

## 16.1 What Is the Saga Pattern?

The Saga pattern manages long-running business transactions across multiple services.

A distributed business operation is divided into smaller local transactions.

If a step fails, compensating actions can reverse or mitigate earlier steps.

Consider an e-commerce order:

1. Create order.
2. Reserve inventory.
3. Process payment.
4. Confirm order.

### Normal Workflow

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

What happens if payment fails after inventory is reserved?

The system needs a compensating action.

### Saga with Compensation

```text
Create Order
     |
     v
Reserve Inventory
     |
     v
Process Payment
     |
     X Payment Failed
     |
     v
Release Inventory
     |
     v
Cancel Order
```

## 16.2 Compensating Transactions

| Original Transaction | Compensation |
|---|---|
| Create Order | Cancel Order |
| Reserve Inventory | Release Inventory |
| Authorize Payment | Void Authorization |
| Book Shipment | Cancel Shipment |

A compensation does not necessarily erase history. It performs a business action that counteracts the earlier operation.

## 16.3 Saga Implementation Styles

### 1. Choreography

Each service reacts to events and publishes new events.

```text
OrderCreated
     |
     v
Inventory Service
     |
     v
InventoryReserved
     |
     v
Payment Service
     |
     v
PaymentCompleted
     |
     v
Order Confirmed
```

Advantages:

- Less centralized orchestration.
- Services communicate through events.

Disadvantages:

- Complex workflows can become difficult to understand.
- Event dependencies can be difficult to trace.

### 2. Orchestration

A central orchestrator coordinates the workflow.

```text
            Saga Orchestrator
                    |
          +---------+---------+
          |         |         |
          v         v         v
      Inventory  Payment   Shipping
       Service   Service   Service
```

Advantages:

- Centralized workflow logic.
- Easier visibility into business steps.

Disadvantages:

- Orchestrator becomes an important component.
- Poorly designed orchestrators can become tightly coupled.

---

# 17. Distributed Transactions

## 17.1 What Is a Distributed Transaction?

A distributed transaction is a transaction involving multiple independently managed resources or services.

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

Traditional database transactions generally cannot atomically commit changes across independent service databases without additional coordination mechanisms.

## 17.2 Two-Phase Commit

Two-Phase Commit (2PC) is a coordination protocol for distributed transactions.

It has two main phases.

### Phase 1: Prepare

The coordinator asks participants whether they can commit.

```text
Coordinator
    |
    +---- Prepare ----> Database A
    |
    +---- Prepare ----> Database B
```

Participants prepare and respond.

### Phase 2: Commit or Abort

If all required participants are prepared, the coordinator asks them to commit.

Otherwise, it asks them to abort.

```text
Coordinator
    |
    +---- Commit ----> Database A
    |
    +---- Commit ----> Database B
```

### Limitations

- Coordination overhead.
- Blocking risks.
- More complicated failure recovery.
- Not suitable for every service-oriented workflow.

In many microservices systems, Saga is preferred for business workflows that can be expressed using local transactions and compensating actions.

---

# 18. Transactional Outbox Pattern

## 18.1 What Problem Does It Solve?

Suppose the Order Service needs to:

1. Save an order in MySQL.
2. Publish an `OrderCreated` event to Kafka.

Consider:

```typescript
await Order.create(order);

await kafkaProducer.send({
  topic: "orders",
  messages: [
    {
      value: JSON.stringify(order),
    },
  ],
});
```

A failure can occur between these two operations.

### Scenario A

The database saves the order, but Kafka publishing fails.

Result:

```text
Order exists.
Event was not published.
```

### Scenario B

The event is published, but the database transaction fails.

Result:

```text
Event exists.
Order does not exist.
```

This is called the dual-write problem.

## 18.2 Outbox Solution

Save the business record and the event record in the same database transaction.

```text
        Database Transaction
                |
        +-------+-------+
        |               |
        v               v
     Save Order     Save Outbox Event
        |               |
        +-------+-------+
                |
             Commit
                |
                v
          Outbox Worker
                |
                v
          Message Broker
```

Example schema:

```sql
CREATE TABLE outbox_events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    event_id VARCHAR(100) NOT NULL UNIQUE,
    event_type VARCHAR(100) NOT NULL,
    payload JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP NULL
);
```

Example Sequelize transaction:

```typescript
await sequelize.transaction(async (transaction) => {
  const order = await Order.create(
    {
      customerId: "user_101",
      amount: 1500,
    },
    {
      transaction,
    }
  );

  await OutboxEvent.create(
    {
      eventId: crypto.randomUUID(),
      eventType: "OrderCreated",
      payload: {
        orderId: order.id,
        customerId: order.customerId,
        amount: order.amount,
      },
    },
    {
      transaction,
    }
  );
});
```

An outbox publisher later reads unpublished records and publishes them.

### Important Considerations

- Publishing may happen more than once.
- Consumers must be idempotent.
- Outbox records need a cleanup or archival policy.
- Multiple publishers require safe claiming or locking.
- A CDC-based approach can also publish outbox records.

The Outbox pattern makes the database write and event record atomic. It does not magically provide exactly-once end-to-end processing.

---

# 19. CQRS – Command Query Responsibility Segregation

## 19.1 What Is CQRS?

CQRS stands for Command Query Responsibility Segregation.

It separates the model used to change data from the model used to read data.

### Traditional Architecture

```text
Client
  |
  v
Application
  |
  v
Single Data Model
  |
  v
Database
```

### CQRS Architecture

```text
              Client
                 |
         +-------+-------+
         |               |
         v               v
       Command          Query
         |               |
         v               v
    Write Model      Read Model
         |               |
         v               v
    Write Store      Read Store
```

## 19.2 Commands

Commands change application state.

Examples:

```text
CreateOrder
UpdateExpense
DeleteUser
```

## 19.3 Queries

Queries retrieve data without changing application state.

Examples:

```text
GetOrder
ListExpenses
GetUserProfile
```

## 19.4 TypeScript Example

Command:

```typescript
interface CreateExpenseCommand {
  userId: string;
  amount: number;
  category: string;
}
```

Query:

```typescript
interface GetExpenseQuery {
  expenseId: string;
}
```

Command handler:

```typescript
async function createExpense(
  command: CreateExpenseCommand
) {
  return Expense.create({
    userId: command.userId,
    amount: command.amount,
    category: command.category,
  });
}
```

Query handler:

```typescript
async function getExpense(
  query: GetExpenseQuery
) {
  return Expense.findByPk(
    query.expenseId
  );
}
```

## 19.5 Benefits of CQRS

- Separate read and write optimization.
- Different data models for different workloads.
- Independent scaling opportunities.
- Better fit for complex domains.

## 19.6 Disadvantages

- Additional architecture complexity.
- Data synchronization challenges.
- Eventual consistency may occur.
- More infrastructure and maintenance.

**Important:** CQRS does not require Event Sourcing. They are separate patterns and can be used independently.

---

# 20. Event Sourcing

## 20.1 What Is Event Sourcing?

Event Sourcing is a pattern in which application state is derived from a sequence of stored events.

Instead of storing only the latest state, the system stores the events that produced that state.

### Traditional Data Storage

```text
Account
-------
ID: 101
Balance: 7000
```

Only the current balance is stored in this example.

### Event-Sourced Storage

```text
Account Events

AccountCreated: 10000
MoneyWithdrawn: 2000
MoneyDeposited: 1000
MoneyWithdrawn: 2000
```

Current balance:

```text
10000 - 2000 + 1000 - 2000 = 7000
```

The current state is reconstructed by applying the events.

## 20.2 Event Store

An event store stores an append-oriented sequence of events.

Example:

```typescript
interface AccountEvent {
  eventId: string;

  accountId: string;

  type:
    | "AccountCreated"
    | "MoneyDeposited"
    | "MoneyWithdrawn";

  amount: number;

  occurredAt: string;
}
```

## 20.3 Rebuilding State

```typescript
function calculateBalance(
  events: AccountEvent[]
): number {
  let balance = 0;

  for (const event of events) {
    switch (event.type) {
      case "AccountCreated":
      case "MoneyDeposited":
        balance += event.amount;
        break;

      case "MoneyWithdrawn":
        balance -= event.amount;
        break;
    }
  }

  return balance;
}
```

## 20.4 Snapshots

Replaying millions of events can be expensive.

A snapshot stores an intermediate state.

Example:

```text
Events 1-1000
      |
      v
Snapshot: Balance = 5000
      |
      v
Events 1001-1100
      |
      v
Current Balance
```

The application can load the snapshot and replay only the newer events.

## 20.5 Event Sourcing Advantages

- Complete historical record.
- Auditability.
- State reconstruction.
- Temporal analysis.
- Alternative read models.

## 20.6 Event Sourcing Disadvantages

- Complex event evolution.
- Event versioning.
- Replay costs.
- More complicated querying.
- Privacy and data-retention challenges.

Event Sourcing is useful for domains that benefit from a complete business history, but it is not necessary for every application.

---

# 21. Idempotent Consumers

## 21.1 What Is Idempotency?

An operation is idempotent if repeating it produces the same intended effect as performing it once.

Example:

```text
Set Order Status = PAID
```

Repeating this operation does not necessarily create additional effects.

However:

```text
Charge Customer ₹1000
```

Repeating this operation can charge the customer twice.

This is not naturally idempotent.

## 21.2 Why Is Idempotency Important?

Message brokers can redeliver messages.

A consumer may process a message successfully but fail before acknowledging it.

The broker may then deliver the same message again.

Therefore, consumers must be designed to handle duplicates.

## 21.3 Idempotency Using a Database

Create:

```sql
CREATE TABLE processed_events (
    event_id VARCHAR(100) PRIMARY KEY,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Example:

```typescript
async function processOrderEvent(
  eventId: string,
  orderId: string
) {
  await sequelize.transaction(async (transaction) => {
    const [record, created] =
      await ProcessedEvent.findOrCreate({
        where: {
          eventId,
        },
        defaults: {
          eventId,
        },
        transaction,
      });

    if (!created) {
      return;
    }

    await Order.update(
      {
        status: "CONFIRMED",
      },
      {
        where: {
          id: orderId,
        },
        transaction,
      }
    );
  });
}
```

The unique primary key protects against concurrent duplicate event processing, provided the event record and business update occur in the same transaction.

The exact handling of database uniqueness races should be tested with your chosen ORM and database.

---

# 22. Message Ordering and Delivery Guarantees

## 22.1 Message Ordering

Suppose an order produces these events:

```text
OrderCreated
PaymentCompleted
OrderShipped
```

The intended order is important.

If `OrderShipped` is processed before `PaymentCompleted`, the system may reach an invalid business state.

### Kafka Ordering

Kafka guarantees ordering within a partition.

Messages with the same key are typically routed to the same partition by the standard keyed partitioner.

Example:

```typescript
await producer.send({
  topic: "orders",

  messages: [
    {
      key: "order_101",

      value: JSON.stringify({
        type: "OrderCreated",
      }),
    },
  ],
});
```

Using the same order ID as the key helps keep related events in the same partition.

## 22.2 At-Most-Once Delivery

A message is delivered zero or one time.

Possible result:

- Message may be lost.
- Message is not intentionally redelivered.

## 22.3 At-Least-Once Delivery

A message is delivered one or more times.

Possible result:

- Message may be delivered more than once.
- Consumers must handle duplicates.

## 22.4 Exactly-Once Semantics

Exactly-once behavior is complicated.

A broker may provide exactly-once capabilities within a defined scope, but this does not automatically guarantee that an external database update or payment API call happens exactly once.

A robust design typically combines:

- Idempotency.
- Transactions.
- Deduplication.
- Reliable publishing.
- Carefully managed offsets.
- External idempotency keys.

### Comparison

| Delivery Model | Behavior |
|---|---|
| At-most-once | Zero or one delivery |
| At-least-once | One or more deliveries |
| Exactly-once | Effect occurs once within a defined transactional scope |

---

# 23. Retry Queues and Dead Letter Queues

## 23.1 What Is a Retry Queue?

A retry queue stores messages that failed processing and need another attempt later.

Example:

```text
Main Queue
    |
    v
Consumer
    |
    X Processing Failed
    |
    v
Retry Queue
    |
    v
Consumer Retry
```

## 23.2 What Is a Dead Letter Queue?

A Dead Letter Queue (DLQ) stores messages that cannot be successfully processed under the configured retry policy.

Example:

```text
Main Queue
    |
    v
Consumer
    |
    X Failed
    |
    v
Retry Attempts
    |
    X Failed Again
    |
    v
Dead Letter Queue
```

## 23.3 Why Is DLQ Important?

Without a DLQ, a permanently invalid message may repeatedly block or consume processing resources.

A DLQ allows operators to:

- Inspect failed messages.
- Identify root causes.
- Correct bad data.
- Retry after fixing the issue.
- Track processing failures.

## 23.4 Retry Strategy

A typical strategy:

```text
Attempt 1: Immediately
Attempt 2: After 1 second
Attempt 3: After 5 seconds
Attempt 4: After 30 seconds
Final: Move to DLQ
```

Actual delays should be chosen based on the dependency and business requirements.

Do not retry permanent errors such as invalid payloads indefinitely.

---

# 24. Distributed Caching

## 24.1 What Is Distributed Caching?

Distributed caching stores data in a cache system that can be accessed by multiple application instances.

Example:

```text
              API Gateway
                   |
          +--------+--------+
          |                 |
          v                 v
       API Pod 1          API Pod 2
          |                 |
          +--------+--------+
                   |
                   v
                 Redis
                   |
                   v
                 MySQL
```

Both API instances can access the same Redis cache.

## 24.2 Why Use Distributed Caching?

Without shared caching:

```text
API Instance 1 -> Local Cache 1
API Instance 2 -> Local Cache 2
```

Each instance may hold different values.

With Redis:

```text
API Instance 1
       |
       v
     Redis
       ^
       |
API Instance 2
```

The instances can share cached values.

## 24.3 Distributed Cache Challenges

- Cache invalidation.
- Stale data.
- Cache stampede.
- Network failures.
- Serialization overhead.
- Memory limits.
- Multi-tenant isolation.

---

# 25. Distributed Locking

## 25.1 What Is a Distributed Lock?

A distributed lock coordinates access to a shared resource across multiple processes or machines.

Example:

Two worker instances attempt to process the same invoice.

Without coordination:

```text
Worker 1 ---> Process Invoice 101
Worker 2 ---> Process Invoice 101
```

Both may process it simultaneously.

A distributed lock can help coordinate access.

## 25.2 Redis-Based Lock

Redis supports atomic operations such as `SET` with `NX` and expiration.

Conceptual command:

```text
SET invoice:101:lock unique-token NX PX 10000
```

Meaning:

- `NX`: Set only if the key does not already exist.
- `PX`: Set expiration in milliseconds.

Example:

```typescript
import { randomUUID } from "node:crypto";

async function acquireLock(
  key: string,
  ttl: number
) {
  const token = randomUUID();

  const result = await redis.set(
    key,
    token,
    "PX",
    ttl,
    "NX"
  );

  if (result !== "OK") {
    return null;
  }

  return token;
}
```

To release a lock safely, verify that the stored token matches the token belonging to the lock owner.

Use an atomic Lua script rather than separate `GET` and `DEL` operations.

Example:

```lua
if redis.call("GET", KEYS[1]) == ARGV[1] then
    return redis.call("DEL", KEYS[1])
else
    return 0
end
```

### Important Distributed Lock Considerations

- Locks must expire.
- Ownership tokens must be unique.
- Release must verify ownership.
- Lock timeouts must be appropriate.
- Processes can pause unexpectedly.
- Lease expiry can allow another worker to acquire the lock while the original worker is still running.

For critical operations, use fencing tokens or database-level constraints where appropriate.

A Redis lock should not replace strong transactional safeguards for financial operations.

---

# 26. Service Resilience

Distributed systems must tolerate partial failures.

## 26.1 Circuit Breaker

A circuit breaker prevents repeated requests to a failing service.

Three states:

```text
CLOSED
  |
  | Failures exceed threshold
  v
OPEN
  |
  | Wait period expires
  v
HALF-OPEN
  |
  +---- Success ----> CLOSED
  |
  +---- Failure ----> OPEN
```

## 26.2 Bulkhead Pattern

Bulkhead isolates resources so that one failing dependency does not consume all available resources.

Example:

```text
API Server
    |
    +---- Payment Connection Pool
    |
    +---- Notification Connection Pool
    |
    +---- Report Worker Pool
```

A slow notification service should not exhaust all resources required for payment processing.

## 26.3 Timeout + Retry + Circuit Breaker

These patterns work together.

```text
Service A
   |
   v
Timeout
   |
   v
Retry Policy
   |
   v
Circuit Breaker
   |
   v
Service B
```

Each pattern addresses a different failure mode.

---

# 27. Distributed Tracing

## 27.1 What Is Distributed Tracing?

Distributed tracing follows a request across multiple services.

Suppose a user creates an order.

```text
Client
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

A single user request can produce multiple service operations.

Distributed tracing helps understand the complete request path.

## 27.2 Trace and Span

A trace represents the complete journey of a request.

A span represents one operation within the trace.

Example:

```text
Trace: Create Order

Span 1: API Gateway          20 ms
Span 2: Order Service        50 ms
Span 3: Payment Service     200 ms
Span 4: Inventory Service   100 ms
Span 5: Notification         30 ms
```

## 27.3 OpenTelemetry

OpenTelemetry is an observability framework for collecting traces, metrics and logs.

Official documentation:

[OpenTelemetry Documentation](https://opentelemetry.io/docs/?utm_source=chatgpt.com)

It supports:

- Distributed tracing.
- Metrics.
- Context propagation.
- Instrumentation.
- Exporting telemetry to observability platforms.

## 27.4 Correlation IDs

A correlation ID helps connect related operations across multiple services.

Example:

```text
Request ID: req_101
```

Pass it through service requests and message metadata.

```typescript
const correlationId = req.headers[
  "x-correlation-id"
] || crypto.randomUUID();
```

For HTTP calls:

```typescript
await fetch(
  "http://payment-service:3002/payments",
  {
    headers: {
      "x-correlation-id": String(correlationId),
    },
  }
);
```

For messaging, include the correlation ID in event metadata or message headers.

Use standardized trace-context propagation, such as W3C Trace Context, when implementing distributed tracing.

---

# 28. Microservices Security

Security must be enforced across service boundaries.

## 28.1 Authentication Between Services

A service should not automatically trust another service simply because it runs inside the same network.

Common approaches:

- OAuth 2.0 access tokens.
- Mutual TLS (mTLS).
- Workload identity.
- Short-lived service credentials.

## 28.2 Mutual TLS

In ordinary TLS, the client verifies the server's identity.

In mutual TLS, both client and server authenticate each other using certificates.

```text
Service A
    |
    | Client Certificate
    v
Service B
    |
    | Server Certificate
    v
Authenticated Connection
```

This is useful for securing service-to-service communication.

## 28.3 Zero Trust

Zero Trust is a security approach based on the principle that network location alone should not establish trust.

Important principles:

1. Verify every identity.
2. Enforce least privilege.
3. Authenticate service communication.
4. Monitor access.
5. Restrict network permissions.
6. Reassess authorization continuously where appropriate.

## 28.4 Service Authorization

Example:

```typescript
interface ServicePrincipal {
  serviceName: string;
  permissions: string[];
}

function hasPermission(
  principal: ServicePrincipal,
  permission: string
): boolean {
  return principal.permissions.includes(permission);
}
```

Example:

```typescript
const service: ServicePrincipal = {
  serviceName: "order-service",
  permissions: [
    "payment:create",
    "payment:read",
  ],
};

console.log(
  hasPermission(service, "payment:create")
);
```

In a real application, the principal must come from verified credentials, not an untrusted request body.

---

# 29. Microservices Testing

Testing distributed systems requires multiple testing levels.

## 29.1 Unit Testing

Tests individual functions or components.

Example:

```typescript
function calculateTotal(
  amount: number,
  tax: number
): number {
  return amount + tax;
}
```

Test:

```typescript
import { describe, it, expect } from "vitest";

describe("calculateTotal", () => {
  it("calculates total amount", () => {
    expect(
      calculateTotal(1000, 100)
    ).toBe(1100);
  });
});
```

## 29.2 Integration Testing

Tests interactions with:

- Databases.
- Redis.
- Message brokers.
- External APIs.

## 29.3 Contract Testing

Contract testing verifies that service communication follows agreed API or message contracts.

Example:

```text
Order Service
     |
     v
Payment Service Contract
```

The contract defines:

- Request schema.
- Response schema.
- Status codes.
- Required fields.
- Error behavior.

Tools such as Pact support consumer-driven contract testing.

Official documentation:

[Pact Documentation](https://docs.pact.io/?utm_source=chatgpt.com)

## 29.4 End-to-End Testing

Tests complete business workflows.

Example:

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
    |
    v
Send Notification
```

## 29.5 Chaos Testing

Chaos testing deliberately introduces controlled failures to validate system resilience.

Examples:

- Terminate an application Pod.
- Temporarily block a dependency.
- Introduce network latency.
- Restart a database replica.

Only perform chaos testing in environments and scopes where it is authorized and safe.

---

# 30. Real-World Project: E-Commerce Microservices

Let's design a production-style e-commerce application.

## 30.1 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js |
| Backend | Node.js + TypeScript |
| API Gateway | Kong or custom gateway |
| Service Communication | REST + gRPC |
| Message Broker | RabbitMQ or Kafka |
| Database | MySQL |
| Cache | Redis |
| Containerization | Docker |
| Orchestration | Kubernetes |
| CI/CD | GitHub Actions |
| Monitoring | OpenTelemetry + Prometheus + Grafana |

## 30.2 Microservices

We will create these services:

```text
ecommerce-platform/
│
├── api-gateway/
│
├── user-service/
│
├── product-service/
│
├── order-service/
│
├── payment-service/
│
├── inventory-service/
│
├── notification-service/
│
└── analytics-service/
```

## 30.3 Service Responsibilities

| Service | Responsibility |
|---|---|
| User Service | Authentication and user profiles |
| Product Service | Product catalog |
| Order Service | Order creation and management |
| Payment Service | Payment processing |
| Inventory Service | Stock management |
| Notification Service | Email and SMS |
| Analytics Service | Reporting and analytics |

Each service owns its business data.

## 30.4 Order Creation Workflow

```text
              Client
                |
                v
            API Gateway
                |
                v
           Order Service
                |
                v
           Create Order
                |
                v
          OrderCreated Event
                |
                v
           Message Broker
                |
       +--------+--------+
       |                 |
       v                 v
 Inventory Service  Payment Service
       |                 |
       v                 v
Stock Reserved     Payment Completed
       |                 |
       +--------+--------+
                |
                v
           Order Service
                |
                v
          Confirm Order
                |
                v
        Notification Service
                |
                v
          Send Confirmation
```

A production implementation should define the Saga state machine, event contracts, idempotency keys, timeouts and compensation behavior explicitly.

---

# 31. Common Microservices Mistakes

| Mistake | Better Approach |
|---|---|
| Splitting every module into a service | Decompose by business capabilities |
| Sharing every service's database tables | Give services clear data ownership |
| Making too many synchronous calls | Use asynchronous communication where appropriate |
| Ignoring network failures | Implement timeouts and resilience |
| Assuming messages arrive once | Implement idempotent consumers |
| Ignoring event versioning | Version event schemas |
| Publishing events directly after database commits | Consider the Outbox pattern |
| Using distributed transactions everywhere | Prefer local transactions and Saga where appropriate |
| Using Kafka for every background task | Select a broker based on requirements |
| Ignoring message ordering | Use partitioning and ordering strategies |
| Retrying indefinitely | Use bounded retries and DLQs |
| Logging without correlation IDs | Implement distributed tracing |
| Trusting internal services automatically | Authenticate and authorize service communication |
| Building microservices too early | Start with a modular monolith when appropriate |

---

# 32. Interview Questions and Answers

## Basic to Intermediate

### Q1. What are microservices?

Microservices are independently deployable services organized around business capabilities.

### Q2. What is the difference between monolithic and microservices architecture?

A monolith is generally deployed as one application unit, while microservices divide functionality into independently deployable services.

### Q3. What is Domain-Driven Design?

DDD is an approach to designing software around business domains and their rules.

### Q4. What is a bounded context?

A bounded context defines the boundary within which a particular domain model and its terminology have a consistent meaning.

### Q5. What is ubiquitous language?

It is a shared business vocabulary used consistently by developers and domain experts.

### Q6. What is an aggregate?

An aggregate is a group of related domain objects treated as a consistency boundary.

### Q7. What is the Repository pattern?

The Repository pattern abstracts data access behind an interface.

### Q8. What is service decomposition?

Service decomposition is the process of dividing an application into smaller services with clear responsibilities.

### Q9. What is the Database per Service pattern?

It is a design principle where each microservice owns and manages its data rather than allowing other services to directly modify its database tables.

### Q10. What is an API Gateway?

An API Gateway is an entry point that routes client requests to backend services and can handle cross-cutting concerns.

### Q11. What is service discovery?

Service discovery allows services to locate other services dynamically.

### Q12. What is synchronous communication?

Synchronous communication occurs when a service sends a request and waits for a response.

### Q13. What is asynchronous communication?

Asynchronous communication allows a service to send a message without waiting for the receiver to finish processing it.

### Q14. What is REST?

REST is an architectural style for designing networked APIs.

### Q15. What is API versioning?

API versioning allows different API contract versions to coexist while clients migrate.

## Advanced

### Q16. What is gRPC?

gRPC is a remote procedure call framework that supports strongly defined service contracts and efficient communication.

### Q17. What is Protocol Buffers?

Protocol Buffers is a language-neutral mechanism for serializing structured data.

### Q18. What are the four gRPC communication types?

Unary, server streaming, client streaming and bidirectional streaming.

### Q19. What is a message broker?

A message broker receives, routes and delivers messages between producers and consumers.

### Q20. What is RabbitMQ?

RabbitMQ is a message broker commonly used for queue-based asynchronous communication.

### Q21. What is Apache Kafka?

Kafka is a distributed event-streaming platform that stores and distributes persistent event streams.

### Q22. What is a Kafka topic?

A topic is a named category of events.

### Q23. What is a Kafka partition?

A partition is an ordered sequence of records within a Kafka topic.

### Q24. What is a Kafka consumer group?

A consumer group is a set of consumers that cooperate to process records from one or more topics.

### Q25. What is event-driven architecture?

It is an architecture in which services communicate by publishing and consuming events.

### Q26. What is the difference between a command and an event?

A command requests an action, while an event records something that has already happened.

### Q27. What is eventual consistency?

It is a consistency model in which distributed data may temporarily differ but is expected to converge after successful propagation.

### Q28. What is the Saga pattern?

Saga manages distributed business transactions through local transactions and compensating actions.

### Q29. What is the difference between Saga choreography and orchestration?

Choreography coordinates through events exchanged between services, while orchestration uses a central coordinator to manage the workflow.

### Q30. What is a compensating transaction?

A compensating transaction performs a business action that counteracts an earlier successful operation.

### Q31. What is Two-Phase Commit?

2PC is a distributed transaction coordination protocol involving prepare and commit/abort phases.

### Q32. What is the Outbox pattern?

The Outbox pattern stores business data and an event record in the same database transaction, allowing reliable asynchronous publishing.

### Q33. What is CQRS?

CQRS separates the models used to modify application state from those used to read application data.

### Q34. Does CQRS require Event Sourcing?

No. CQRS and Event Sourcing are separate patterns and can be implemented independently.

### Q35. What is Event Sourcing?

Event Sourcing stores application changes as a sequence of events from which the current state can be reconstructed.

### Q36. What is a snapshot in Event Sourcing?

A snapshot stores an intermediate application state to reduce the cost of replaying a long event history.

### Q37. What is idempotency?

Idempotency ensures that repeating an operation produces the same intended effect as executing it once.

### Q38. What is at-least-once delivery?

It is a delivery guarantee where a message is delivered one or more times, so duplicate processing must be considered.

### Q39. What is a Dead Letter Queue?

A DLQ stores messages that cannot be processed successfully under the configured retry policy.

### Q40. What is distributed caching?

Distributed caching provides shared cached data across multiple application instances.

### Q41. What is distributed locking?

Distributed locking coordinates access to shared resources across multiple processes or machines.

### Q42. What is a circuit breaker?

A circuit breaker temporarily blocks calls to a failing dependency to prevent repeated failures and resource exhaustion.

### Q43. What is distributed tracing?

Distributed tracing follows a request across multiple services to identify latency and failures.

### Q44. What is a correlation ID?

A correlation ID identifies related operations across service boundaries.

### Q45. What is mutual TLS?

Mutual TLS is a security mechanism where both client and server authenticate each other using certificates.

### Q46. What is Zero Trust?

Zero Trust is a security approach that does not automatically trust a user or service based only on its network location.

### Q47. What is contract testing?

Contract testing verifies that communicating services follow an agreed API or message contract.

### Q48. What is chaos testing?

Chaos testing introduces controlled failures to validate the resilience of a system.

### Q49. Why is exactly-once processing difficult?

Because broker delivery, database transactions and external side effects often have separate failure boundaries. Exactly-once guarantees are therefore limited to specific transactional scopes.

### Q50. When should you choose microservices?

When independent deployment, scaling, business ownership or organizational boundaries justify the additional distributed-systems complexity.

---

# 33. Practical Exercises

Complete these exercises to strengthen your understanding.

## Exercise 1: Design a Microservices Architecture

Design an e-commerce application.

Requirements:

1. User Service.
2. Product Service.
3. Order Service.
4. Payment Service.
5. Inventory Service.
6. Notification Service.
7. API Gateway.
8. Separate data ownership.

Draw the complete architecture.

## Exercise 2: Build an API Gateway

Create an Express API Gateway.

Requirements:

1. `/api/users` routes to User Service.
2. `/api/products` routes to Product Service.
3. `/api/orders` routes to Order Service.
4. Add request validation.
5. Add authentication.
6. Add request timeouts.
7. Add centralized error handling.

## Exercise 3: Implement Service-to-Service REST Communication

Create:

```text
order-service
payment-service
```

Requirements:

1. Order Service calls Payment Service.
2. Implement request validation.
3. Implement timeouts.
4. Handle service failures.
5. Add correlation IDs.
6. Add integration tests.

## Exercise 4: Implement gRPC

Create a Payment Service using gRPC.

Requirements:

1. Define `payment.proto`.
2. Implement gRPC server.
3. Implement gRPC client.
4. Implement unary RPC.
5. Implement server streaming.
6. Add error handling.
7. Add deadlines.

## Exercise 5: Implement RabbitMQ

Create:

```text
order-service
notification-service
```

Requirements:

1. Order Service publishes `OrderCreated`.
2. Notification Service consumes the message.
3. Send an email notification.
4. Use durable queues.
5. Implement acknowledgements.
6. Configure retries and DLQ.

## Exercise 6: Implement Kafka

Create a Kafka topic:

```text
orders
```

Requirements:

1. Create a producer.
2. Create two consumers in a consumer group.
3. Publish 100 order events.
4. Observe partition assignment.
5. Track offsets.
6. Test consumer restart and message replay.

## Exercise 7: Implement Event-Driven Architecture

Create this workflow:

```text
OrderCreated
     |
     v
InventoryReserved
     |
     v
PaymentCompleted
     |
     v
OrderConfirmed
```

Requirements:

1. Use RabbitMQ or Kafka.
2. Create event interfaces.
3. Validate event payloads.
4. Add event IDs.
5. Implement idempotent consumers.
6. Add retry handling.

## Exercise 8: Implement Saga Pattern

Create an order-processing Saga.

Requirements:

1. Create order.
2. Reserve inventory.
3. Process payment.
4. Confirm order.
5. If payment fails, release inventory.
6. Cancel the order.
7. Store Saga execution status.

## Exercise 9: Implement Transactional Outbox

Requirements:

1. Create an orders table.
2. Create an outbox table.
3. Save both records in one database transaction.
4. Create an outbox publisher.
5. Publish events to RabbitMQ.
6. Mark events as published.
7. Handle duplicate publishing safely.

## Exercise 10: Implement CQRS

Create an Expense Tracker CQRS module.

Requirements:

1. Create Expense Command.
2. Create Expense Query.
3. Implement separate handlers.
4. Maintain a read model.
5. Update the read model using events.
6. Handle eventual consistency.

## Exercise 11: Implement Event Sourcing

Create a bank account module.

Requirements:

1. AccountCreated event.
2. MoneyDeposited event.
3. MoneyWithdrawn event.
4. Store events.
5. Reconstruct account balance.
6. Create snapshots.
7. Test event replay.

## Exercise 12: Distributed Tracing

Requirements:

1. Instrument API Gateway.
2. Instrument Order Service.
3. Instrument Payment Service.
4. Propagate trace context.
5. Collect distributed traces.
6. Visualize traces in an observability platform.
7. Identify the slowest service.

---

# 34. Phase 62 Completion Checklist

| No. | Topic | Status |
|---:|---|---|
| 1 | Microservices Architecture | ☐ |
| 2 | Domain-Driven Design | ☐ |
| 3 | Domain and Subdomains | ☐ |
| 4 | Bounded Contexts | ☐ |
| 5 | Ubiquitous Language | ☐ |
| 6 | Entities and Value Objects | ☐ |
| 7 | Aggregates | ☐ |
| 8 | Repository Pattern | ☐ |
| 9 | Service Decomposition | ☐ |
| 10 | Database per Service | ☐ |
| 11 | API Gateway | ☐ |
| 12 | Service Discovery | ☐ |
| 13 | Synchronous Communication | ☐ |
| 14 | Asynchronous Communication | ☐ |
| 15 | REST Communication | ☐ |
| 16 | API Versioning | ☐ |
| 17 | Inter-Service Reliability | ☐ |
| 18 | gRPC | ☐ |
| 19 | Protocol Buffers | ☐ |
| 20 | Message Brokers | ☐ |
| 21 | RabbitMQ | ☐ |
| 22 | Kafka | ☐ |
| 23 | Kafka Topics and Partitions | ☐ |
| 24 | Consumer Groups | ☐ |
| 25 | Event-Driven Architecture | ☐ |
| 26 | Commands vs Events | ☐ |
| 27 | Eventual Consistency | ☐ |
| 28 | Saga Pattern | ☐ |
| 29 | Saga Choreography | ☐ |
| 30 | Saga Orchestration | ☐ |
| 31 | Distributed Transactions | ☐ |
| 32 | Two-Phase Commit | ☐ |
| 33 | Transactional Outbox | ☐ |
| 34 | CQRS | ☐ |
| 35 | Event Sourcing | ☐ |
| 36 | Snapshots | ☐ |
| 37 | Idempotent Consumers | ☐ |
| 38 | Message Ordering | ☐ |
| 39 | Delivery Guarantees | ☐ |
| 40 | Retry Queues | ☐ |
| 41 | Dead Letter Queues | ☐ |
| 42 | Distributed Caching | ☐ |
| 43 | Distributed Locking | ☐ |
| 44 | Circuit Breaker | ☐ |
| 45 | Bulkhead Pattern | ☐ |
| 46 | Distributed Tracing | ☐ |
| 47 | Correlation IDs | ☐ |
| 48 | Microservices Security | ☐ |
| 49 | Mutual TLS | ☐ |
| 50 | Contract Testing | ☐ |
| 51 | Chaos Testing | ☐ |
| 52 | Production Microservices Design | ☐ |

---

# 35. Final Summary

Phase 62 covered the architecture and communication patterns used in distributed applications.

The most important distinctions:

| Concept | Primary Purpose |
|---|---|
| Microservices | Independent business services |
| DDD | Model software around business domains |
| API Gateway | Central client entry point |
| Service Discovery | Locate service instances |
| REST | HTTP-based service communication |
| gRPC | Contract-based RPC communication |
| RabbitMQ | Queue-based messaging |
| Kafka | Distributed event streaming |
| Event-Driven Architecture | Communicate through events |
| Saga | Coordinate distributed business transactions |
| Outbox | Reliably publish database-backed events |
| CQRS | Separate read and write models |
| Event Sourcing | Store state changes as events |
| Idempotency | Prevent duplicate side effects |
| Distributed Tracing | Track requests across services |

**Professional principle:** Distributed systems must be designed with the assumption that network failures, duplicate messages, delayed events and partial service outages will happen.

---

# 36. Next Phase Preview

## Phase 63: Advanced TypeScript – Advanced System Design, Scalability, High Availability, Database Sharding, Replication, CAP Theorem, Distributed Algorithms and Large-Scale Architecture

Upcoming topics:

1. System Design Fundamentals.
2. Functional and Non-Functional Requirements.
3. Scalability.
4. Vertical vs Horizontal Scaling.
5. Load Balancing.
6. Reverse Proxy Architecture.
7. Caching Architecture.
8. Database Replication.
9. Database Sharding.
10. Partitioning Strategies.
11. Consistent Hashing.
12. CAP Theorem.
13. PACELC Theorem.
14. Strong vs Eventual Consistency.
15. Distributed Consensus.
16. Leader Election.
17. Raft Algorithm.
18. Quorum-Based Systems.
19. Distributed Transactions.
20. Read and Write Strategies.
21. Database Indexing at Scale.
22. Search Architecture.
23. Elasticsearch.
24. Rate Limiting Algorithms.
25. Token Bucket.
26. Leaky Bucket.
27. Sliding Window.
28. Distributed Rate Limiting.
29. Multi-Tenant Architecture.
30. High Availability.
31. Fault Tolerance.
32. Disaster Recovery.
33. Capacity Planning.
34. Reliability Engineering.
35. Designing Large-Scale Applications.

**Phase 62 completed.** When you're ready, say **"OK, Phase 63"** to continue.