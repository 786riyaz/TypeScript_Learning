# Phase 54: Advanced TypeScript – Event-Driven Architecture, Message Queues, RabbitMQ, Kafka, BullMQ, Background Jobs and Distributed Systems

**Level:** Expert / Advanced Backend & Distributed Systems  
**Prerequisites:** TypeScript, Node.js, Express.js, asynchronous programming, databases, Redis, REST APIs and testing.

---

# 1. Learning Objectives

By the end of this phase, you will understand how to:

1. Design event-driven architectures.
2. Understand synchronous vs asynchronous communication.
3. Work with Node.js EventEmitter.
4. Understand Publish/Subscribe architecture.
5. Implement message queues and message brokers.
6. Work with RabbitMQ.
7. Understand exchanges, queues and routing keys.
8. Implement acknowledgements and retry mechanisms.
9. Understand Dead Letter Queues (DLQ).
10. Work with Apache Kafka.
11. Understand topics, partitions and consumer groups.
12. Implement background jobs using BullMQ.
13. Create scheduled and delayed jobs.
14. Implement job priorities and retries.
15. Understand distributed systems.
16. Implement eventual consistency.
17. Understand the Saga Pattern.
18. Implement the Transactional Outbox Pattern.
19. Handle duplicate messages and ensure idempotency.
20. Design production-ready background processing systems.

---

# 2. What Is Event-Driven Architecture?

Event-Driven Architecture (EDA) is a software architecture in which components communicate by producing and consuming events.

An event represents something that has already happened in the system.

Examples:

- UserRegistered
- OrderCreated
- PaymentCompleted
- PaymentFailed
- ProductUpdated
- InventoryReserved
- PasswordResetRequested
- InvoiceGenerated

### Traditional Architecture

Suppose a user places an order.

The Order Service directly calls other services.

```text
                  Order Service
                       |
          ┌────────────┼────────────┐
          |            |            |
          v            v            v
     Payment       Inventory   Notification
     Service        Service      Service
```

The Order Service must communicate with each service.

This creates dependencies between services.

### Event-Driven Architecture

Instead, the Order Service publishes an event.

```text
                  Order Service
                       |
                       |
                       v
                Message Broker
                       |
          ┌────────────┼────────────┐
          |            |            |
          v            v            v
      Payment      Inventory   Notification
      Service       Service      Service
```

The Order Service does not need to know which services consume the event.

Each interested service subscribes and processes it independently.

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

An event might contain:

```json
{
    "eventId": "evt-101",
    "orderId": "ORD-101",
    "customerId": "CUS-101",
    "totalAmount": 2500,
    "occurredAt": "2026-11-25T10:30:00.000Z"
}
```

Inventory Service can reserve stock.

Notification Service can send an email.

Analytics Service can update its statistics.

All these operations can happen independently.

---

# 3. Important Event-Driven Architecture Concepts

Understand these four terms.

| Concept | Meaning |
|---|---|
| Event | Something that has happened |
| Event Producer | Component that creates and publishes an event |
| Event Consumer | Component that receives and processes an event |
| Event Broker | Infrastructure that distributes messages/events |

### Example

```text
User Registration
       |
       v
User Service
       |
       | Publish UserRegistered
       v
Message Broker
       |
       ├──────────────┐
       |              |
       v              v
Email Service    Analytics Service
```

The User Service is the producer.

The Email and Analytics Services are consumers.

The broker distributes the event.

## 3.1 Event vs Command

An event and a command are different.

**Command:** Requests that something should happen.

**Event:** Announces that something has happened.

Examples:

```text
Command:
CreateOrder

Event:
OrderCreated
```

Another example:

```text
Command:
ProcessPayment

Event:
PaymentProcessed
```

A command represents an instruction.

An event represents a fact.

## 3.2 Domain Events vs Integration Events

### Domain Event

A domain event represents something important that happened inside a business domain.

Example:

```typescript
interface OrderConfirmedDomainEvent {
    orderId: string;
    confirmedAt: Date;
}
```

It may be used internally within the Order Service.

### Integration Event

An integration event communicates something important to other services.

Example:

```typescript
interface OrderConfirmedIntegrationEvent {
    eventId: string;
    orderId: string;
    customerId: string;
    totalAmount: number;
    occurredAt: string;
}
```

It is designed as a contract for external consumers.

**Important:** Avoid publishing internal database entities directly as integration events. Define stable, versionable event contracts instead.

---

# 4. Synchronous vs Asynchronous Communication

These are two major communication approaches in backend systems.

## 4.1 Synchronous Communication

One component sends a request and waits for the response.

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

TypeScript example:

```typescript
async function processPayment(
    orderId: string
): Promise<string> {

    const response = await fetch(
        "http://localhost:3002/payments",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                orderId
            })
        }
    );

    if (!response.ok) {
        throw new Error("Payment processing failed");
    }

    return response.text();
}
```

The Order Service waits for Payment Service.

### Advantages

- Easy request-response model.
- Immediate result.
- Straightforward error handling.
- Suitable for operations requiring an immediate answer.

### Disadvantages

- Both services need to be available.
- Network latency affects response time.
- Failures can propagate.
- Long-running operations can delay requests.

## 4.2 Asynchronous Communication

One component publishes a message and continues without waiting for the consumer to finish.

```text
Order Service
      |
      | Publish OrderCreated
      v
Message Broker
      |
      v
Payment Service
```

Example:

```typescript
async function createOrder(): Promise<void> {

    console.log("Order created");

    await publishOrderCreated({
        orderId: "ORD-101"
    });

    console.log("Order creation request completed");
}
```

The consumer processes the event separately.

### Advantages

- Reduced direct coupling.
- Better workload distribution.
- Consumers can process work independently.
- Useful for long-running operations.

### Disadvantages

- Eventual consistency.
- Duplicate message handling.
- More complex debugging.
- Requires broker infrastructure.

### Comparison

| Feature | Synchronous | Asynchronous |
|---|---|---|
| Response | Waits for response | Does not wait for processing |
| Coupling | Usually higher | Usually lower |
| Availability dependency | Immediate dependency | Broker availability at publishing time |
| Latency | Includes downstream response time | Can return sooner |
| Complexity | Relatively simple | More infrastructure and failure handling |
| Example | REST API | RabbitMQ, Kafka |

---

# 5. What Is Node.js EventEmitter?

Node.js provides a built-in module called `events`.

It allows objects to emit and listen for events.

EventEmitter is useful for communication between components inside the same Node.js process.

### Example

```typescript
import { EventEmitter } from "node:events";

const eventEmitter = new EventEmitter();

eventEmitter.on("userRegistered", () => {
    console.log("User registered event received");
});

eventEmitter.emit("userRegistered");
```

Output:

```text
User registered event received
```

Here:

- `on()` registers an event listener.
- `emit()` triggers an event.

## 5.1 EventEmitter Methods

| Method | Purpose |
|---|---|
| `on()` | Registers an event listener |
| `once()` | Executes listener only once |
| `emit()` | Emits an event |
| `off()` | Removes a listener |
| `removeListener()` | Removes a specific listener |
| `removeAllListeners()` | Removes all listeners |
| `listenerCount()` | Returns listener count |
| `eventNames()` | Returns registered event names |

## 5.2 Using EventEmitter with TypeScript

```typescript
import { EventEmitter } from "node:events";

interface User {
    id: string;
    name: string;
    email: string;
}

class UserEventEmitter extends EventEmitter {

    registerUser(user: User): void {

        console.log("Registering user");

        this.emit("userRegistered", user);
    }
}

const userEvents = new UserEventEmitter();

userEvents.on(
    "userRegistered",
    (user: User) => {

        console.log("Sending welcome email");

        console.log(user.email);
    }
);

userEvents.registerUser({
    id: "U101",
    name: "John",
    email: "john@example.com"
});
```

## 5.3 EventEmitter.once()

Sometimes you want a listener to execute only once.

```typescript
eventEmitter.once("serverStarted", () => {
    console.log("Server started for the first time");
});

eventEmitter.emit("serverStarted");

eventEmitter.emit("serverStarted");
```

The callback executes only for the first emission.

## 5.4 EventEmitter.off()

```typescript
function handleUserRegistration(): void {
    console.log("User registered");
}

eventEmitter.on(
    "userRegistered",
    handleUserRegistration
);

eventEmitter.off(
    "userRegistered",
    handleUserRegistration
);
```

This removes the registered listener.

## 5.5 Important EventEmitter Behavior

Node.js EventEmitter listeners execute synchronously by default.

Consider:

```typescript
eventEmitter.on("test", () => {
    console.log("Listener executed");
});

console.log("Before event");

eventEmitter.emit("test");

console.log("After event");
```

Output:

```text
Before event
Listener executed
After event
```

The listener runs during `emit()`.

### Important Limitations

EventEmitter is:

- In-process.
- Not durable.
- Not distributed.
- Not a message broker.
- Not designed to retain messages for offline consumers.

If your Node.js process crashes, its in-memory events disappear.

Also, an emitted `"error"` event without a registered error listener can throw and terminate the process.

**Use EventEmitter for local application events, not as a replacement for RabbitMQ or Kafka.**

---

# 6. What Is Publish/Subscribe Architecture?

Publish/Subscribe (Pub/Sub) is a messaging pattern in which publishers send messages without knowing the identities of subscribers.

Subscribers receive messages for the topics or channels they subscribe to.

### Architecture

```text
             Publisher
                 |
                 v
             Message Broker
                 |
          ┌──────┼──────┐
          |      |      |
          v      v      v
       Subscriber A
              Subscriber B
                     Subscriber C
```

A publisher publishes a message.

The broker distributes it to subscribers.

### Example

Suppose a customer registers.

The User Service publishes:

```text
UserRegistered
```

Subscribers:

- Email Service.
- Analytics Service.
- CRM Service.

All can react to the event independently.

## 6.1 Redis Pub/Sub

Redis supports Pub/Sub communication.

Install:

```bash
npm install redis
```

### Publisher

```typescript
import { createClient } from "redis";

const publisher = createClient({
    url: "redis://localhost:6379"
});

publisher.on("error", (error) => {
    console.error("Redis error:", error);
});

await publisher.connect();

await publisher.publish(
    "user-events",
    JSON.stringify({
        event: "USER_REGISTERED",
        userId: "U101"
    })
);
```

### Subscriber

```typescript
import { createClient } from "redis";

const subscriber = createClient({
    url: "redis://localhost:6379"
});

subscriber.on("error", (error) => {
    console.error("Redis error:", error);
});

await subscriber.connect();

await subscriber.subscribe(
    "user-events",
    (message) => {

        const event = JSON.parse(message);

        console.log("Received event:", event);
    }
);
```

### Important Redis Pub/Sub Limitation

Redis Pub/Sub does not provide a durable message backlog.

If a subscriber is disconnected when a message is published, it generally misses that message.

It also does not provide the acknowledgement and replay model of a durable queue.

For persistent stream processing, consider Redis Streams instead.

### Redis Pub/Sub vs Redis Streams

| Feature | Redis Pub/Sub | Redis Streams |
|---|---|---|
| Message persistence | No durable backlog | Yes |
| Offline subscriber recovery | No | Possible |
| Consumer groups | No | Yes |
| Message acknowledgement | No | Yes, using consumer groups |
| Replay | No | Yes |
| Best use case | Live notifications | Persistent event processing |

---

# 7. What Is a Message Queue?

A message queue is a mechanism that stores messages until consumers process them.

It allows producers and consumers to operate independently.

### Architecture

```text
       Producer
          |
          v
       Message Queue
          |
          v
       Consumer
```

Example:

A user uploads a large Excel file containing 50,000 records.

Should your API process all records before responding?

Usually not.

Instead:

1. Upload the file.
2. Save its metadata.
3. Add a processing job to a queue.
4. Return an accepted response.
5. Let a background worker process the records.
6. Store the processing status.

```text
Frontend
   |
   v
API Server
   |
   v
Message Queue
   |
   v
Background Worker
   |
   v
Database
```

### Benefits

- Background processing.
- Workload distribution.
- Reduced API response time.
- Retry support.
- Better traffic handling.
- Independent worker scaling.

---

# 8. Message Delivery Guarantees

Message brokers may provide different delivery guarantees.

Understanding these is essential.

## 8.1 At-Most-Once Delivery

A message is delivered zero or one time.

It may be lost, but it is not intentionally redelivered.

```text
Producer → Queue → Consumer
```

If processing fails after the message has been removed, it may be lost.

## 8.2 At-Least-Once Delivery

A message is delivered one or more times.

The consumer may receive duplicates.

```text
Producer → Queue → Consumer
                    |
                    X Failure before acknowledgement
                    |
                    v
                  Retry
                    |
                    v
                 Consumer
```

The consumer must handle duplicate messages safely.

## 8.3 Exactly-Once Processing

Exactly-once processing is difficult in distributed systems.

A broker may provide exactly-once guarantees within specific operations or transaction boundaries, but this does not automatically guarantee that an external database update, payment or email happens exactly once.

In practice, systems often achieve effectively-once business behavior using:

- Idempotency keys.
- Unique constraints.
- Transactional Outbox.
- Inbox/deduplication tables.
- Atomic database transactions.

### Comparison

| Guarantee | Meaning |
|---|---|
| At-most-once | Zero or one delivery |
| At-least-once | One or more deliveries |
| Exactly-once | A defined operation is processed once within a specified scope |

---

# 9. What Is a Message Broker?

A message broker is software that receives, stores, routes and delivers messages between applications.

Popular message brokers and streaming platforms include:

- RabbitMQ
- Apache Kafka
- Redis

### Message Broker Responsibilities

1. Receive messages from producers.
2. Route messages.
3. Store messages when configured.
4. Deliver messages to consumers.
5. Manage acknowledgements.
6. Support retry and failure handling.
7. Distribute workload.

### Message Queue vs Message Broker

A queue is a messaging structure that stores messages.

A broker is the infrastructure responsible for receiving, routing and delivering messages.

A broker can manage multiple queues, exchanges, topics or streams.

---

# 10. RabbitMQ Fundamentals

RabbitMQ is a message broker that supports several messaging patterns.

It is commonly used for:

- Background jobs.
- Order processing.
- Email notifications.
- Payment workflows.
- Task distribution.
- Inter-service communication.

### RabbitMQ Architecture

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

The important components are:

1. Producer.
2. Exchange.
3. Binding.
4. Routing Key.
5. Queue.
6. Consumer.

## 10.1 Producer

A producer creates and publishes messages.

Example:

```text
Order Service → RabbitMQ
```

## 10.2 Exchange

An exchange receives messages from producers and routes them to queues.

RabbitMQ has several exchange types.

| Exchange | Purpose |
|---|---|
| Direct | Routes based on exact routing-key match |
| Fanout | Broadcasts to all bound queues |
| Topic | Routes based on routing-key patterns |
| Headers | Routes based on message headers |

## 10.3 Queue

A queue stores messages until they are delivered and acknowledged.

Example:

```text
order-queue
payment-queue
notification-queue
```

## 10.4 Binding

A binding connects an exchange to a queue.

It may include routing rules.

## 10.5 Routing Key

A routing key helps determine where a message should be delivered.

Example:

```text
order.created
payment.completed
payment.failed
```

---

# 11. RabbitMQ Exchange Types

Let's understand the four major exchange types.

## 11.1 Direct Exchange

Routes messages based on an exact routing-key match.

Example:

```text
                Direct Exchange
                       |
             ┌─────────┴─────────┐
             |                   |
             v                   v
         payment-queue      order-queue
             |                   |
             v                   v
         Payment Service     Order Service
```

Bindings:

```text
payment.completed → payment-queue
order.created     → order-queue
```

A message with routing key `order.created` is routed to the matching queue.

## 11.2 Fanout Exchange

Broadcasts a message to every queue bound to the exchange.

```text
               Fanout Exchange
                      |
           ┌──────────┼──────────┐
           |          |          |
           v          v          v
        Queue A    Queue B    Queue C
```

Example:

When a new user registers, multiple services may need to receive the event.

## 11.3 Topic Exchange

Routes messages using wildcard patterns.

Example routing keys:

```text
order.created
order.cancelled
payment.completed
payment.failed
```

Common wildcards:

- `*` matches exactly one word.
- `#` matches zero or more words.

Examples:

```text
order.*
```

Matches:

```text
order.created
order.cancelled
```

But not:

```text
order.payment.completed
```

Another example:

```text
order.#
```

Matches:

```text
order.created
order.cancelled
order.payment.completed
```

## 11.4 Headers Exchange

Routes messages based on message headers rather than routing keys.

It can match one or multiple header conditions.

This is useful when routing depends on message metadata.

---

# 12. Setting Up RabbitMQ

You can run RabbitMQ using Docker.

```bash
docker run -d \
  --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:4-management
```

Ports:

| Port | Purpose |
|---|---|
| 5672 | AMQP messaging |
| 15672 | Management dashboard |

Open the RabbitMQ Management UI:

```text
http://localhost:15672
```

For the default development image, the default credentials are commonly:

```text
Username: guest
Password: guest
```

Use dedicated credentials and appropriate network restrictions in production.

---

# 13. Connecting RabbitMQ with TypeScript

We will use the `amqplib` package.

### Installation

```bash
npm install amqplib
npm install -D @types/amqplib
```

## 13.1 Create a RabbitMQ Connection

```typescript
import amqp from "amqplib";

async function connectRabbitMQ() {

    const connection = await amqp.connect(
        "amqp://localhost"
    );

    const channel = await connection.createChannel();

    console.log("RabbitMQ connected");

    return {
        connection,
        channel
    };
}
```

The connection represents the connection to RabbitMQ.

The channel is used to publish and consume messages.

In production, manage connection failures, channel recreation, shutdown and reconnection carefully.

## 13.2 Creating a Queue

```typescript
const { channel } = await connectRabbitMQ();

await channel.assertQueue(
    "order-queue",
    {
        durable: true
    }
);
```

`durable: true` means the queue definition survives broker restarts.

## 13.3 Publishing a Message

```typescript
const order = {
    orderId: "ORD-101",
    customerId: "CUS-101",
    totalAmount: 2500
};

channel.sendToQueue(
    "order-queue",
    Buffer.from(JSON.stringify(order)),
    {
        persistent: true,
        contentType: "application/json"
    }
);
```

The `persistent: true` option marks the message as persistent.

**Important:** `sendToQueue()` returning `true` does not mean the broker has durably confirmed the message. For reliable publishing, use publisher confirms.

## 13.4 Consuming Messages

```typescript
const { channel } = await connectRabbitMQ();

await channel.assertQueue(
    "order-queue",
    {
        durable: true
    }
);

await channel.consume(
    "order-queue",
    async (message) => {

        if (!message) {
            return;
        }

        try {

            const order = JSON.parse(
                message.content.toString()
            );

            console.log("Processing order:", order);

            // Perform business processing here.

            channel.ack(message);

        } catch (error) {

            console.error("Processing failed:", error);

            channel.nack(
                message,
                false,
                false
            );
        }
    }
);
```

### Understanding Acknowledgements

**ack():**

Confirms successful processing.

**nack():**

Indicates that processing failed.

The third argument controls whether the message should be requeued.

```typescript
channel.nack(message, false, true);
```

This requeues the message.

```typescript
channel.nack(message, false, false);
```

This does not requeue it. Depending on the queue's dead-letter configuration, it may be dead-lettered or discarded.

### Important

Do not acknowledge a message before the business operation is safely completed.

Otherwise, a crash may result in lost work.

---

# 14. RabbitMQ Message Acknowledgements and Prefetch

RabbitMQ supports manual acknowledgements.

Why are they important?

Suppose a worker receives 100 messages.

If it crashes while processing, unacknowledged messages can be delivered again.

### Prefetch

Prefetch limits the number of unacknowledged messages delivered to a consumer.

Example:

```typescript
await channel.prefetch(10);
```

This means RabbitMQ should deliver at most 10 unacknowledged messages to that consumer at a time.

### Why Is Prefetch Useful?

- Controls worker workload.
- Prevents excessive message delivery.
- Provides backpressure.
- Helps avoid memory exhaustion.

### Important

Acknowledgements and prefetch do not automatically guarantee exactly-once processing.

Consumers must still handle duplicate deliveries.

---

# 15. Publisher Confirms

There are two separate acknowledgement mechanisms in RabbitMQ.

| Mechanism | Meaning |
|---|---|
| Consumer acknowledgement | Consumer confirms processing |
| Publisher confirmation | Broker confirms handling of a published message |

These are not interchangeable.

For reliable publishing, use a confirm channel.

Example:

```typescript
import amqp from "amqplib";

const connection = await amqp.connect(
    "amqp://localhost"
);

const channel = await connection.createConfirmChannel();

await channel.assertQueue(
    "order-queue",
    {
        durable: true
    }
);

channel.sendToQueue(
    "order-queue",
    Buffer.from(
        JSON.stringify({
            orderId: "ORD-101"
        })
    ),
    {
        persistent: true
    }
);

await channel.waitForConfirms();

console.log("Broker confirmed published messages");
```

This example waits for the broker's publisher confirmations.

For production, also handle:

- Unroutable messages.
- Connection failures.
- Confirm timeouts.
- Channel errors.
- Duplicate publishing after uncertain failures.

---

# 16. What Is a Dead Letter Queue (DLQ)?

A Dead Letter Queue stores messages that cannot be successfully processed through their normal queue workflow.

Example:

Suppose a payment message repeatedly fails.

Instead of retrying forever, you can move it to a DLQ.

```text
             payment-queue
                    |
                    v
              Payment Worker
                    |
               Processing
                    |
                    X
                    |
                    v
               Retry Policy
                    |
                    X
                    |
                    v
             Dead Letter Queue
```

Common reasons for dead-lettering include:

- Message rejection without requeue.
- Message expiration.
- Queue length limits, depending on configuration.

### Why Use DLQ?

- Inspect failed messages.
- Debug processing failures.
- Prevent endless retry loops.
- Replay messages after fixing an issue.
- Track poison messages.

A poison message is one that repeatedly fails processing.

---

# 17. RabbitMQ Retry Mechanisms

A retry mechanism attempts to process a failed message again.

A simple retry strategy:

```text
Message Received
       |
       v
Processing
       |
   ┌───┴────┐
   |        |
Success   Failure
   |        |
   v        v
  ACK    Retry Policy
             |
        ┌────┴────┐
        |         |
     Retry    Max Attempts
        |         |
        v         v
   Processing    DLQ
```

### Retry Strategies

| Strategy | Description |
|---|---|
| Immediate Retry | Retry immediately |
| Fixed Delay | Wait a fixed time |
| Exponential Backoff | Increase delay after each failure |
| Dead Letter | Move failed message to DLQ |

### Exponential Backoff Example

Suppose the initial delay is 1 second.

```text
Attempt 1 → 1 second
Attempt 2 → 2 seconds
Attempt 3 → 4 seconds
Attempt 4 → 8 seconds
Attempt 5 → 16 seconds
```

Jitter adds randomness to the delay to prevent many consumers from retrying simultaneously.

### Important

Do not continuously requeue failed RabbitMQ messages without a bounded retry strategy.

This can create hot retry loops.

A production retry system should track retry attempts and eventually route permanently failing messages to a DLQ.

---

# 18. What Is Apache Kafka?

Apache Kafka is a distributed event-streaming platform.

It is designed to handle large volumes of event data and support real-time streaming, event-driven architectures and data pipelines.

Common use cases:

- Financial transaction streams.
- User activity tracking.
- Real-time analytics.
- Log aggregation.
- Event sourcing.
- Data synchronization.

### Kafka Architecture

```text
             Producer
                 |
                 v
              Kafka
                 |
          ┌──────┼──────┐
          |      |      |
          v      v      v
       Topic A Topic B Topic C
          |      |      |
          v      v      v
       Consumer Consumer Consumer
```

Unlike a traditional queue, Kafka retains records according to configured retention or compaction policies.

Consumers track their positions in the stream using offsets.

---

# 19. Kafka Core Concepts

## 19.1 Broker

A Kafka broker is a server that stores and serves event data.

A Kafka cluster contains one or more brokers.

## 19.2 Topic

A topic is a named stream of records.

Examples:

```text
orders
payments
users
notifications
```

## 19.3 Partition

A topic is divided into partitions.

Example:

```text
Topic: orders

Partition 0
Partition 1
Partition 2
```

Partitions allow Kafka to distribute storage and processing across multiple brokers.

### Important

Ordering is guaranteed within a partition, not globally across all partitions of a topic.

If events must be processed in order for a specific order ID, use that order ID as the partition key.

## 19.4 Producer

A producer publishes records to Kafka topics.

## 19.5 Consumer

A consumer reads records from topics.

## 19.6 Consumer Group

A consumer group allows multiple consumers to coordinate processing of a topic.

Example:

```text
Topic: orders

Consumer Group: order-processors

    Consumer 1 → Partition 0
    Consumer 2 → Partition 1
    Consumer 3 → Partition 2
```

Within one consumer group, a partition is assigned to at most one consumer at a time.

Different consumer groups can independently read the same topic.

## 19.7 Offset

An offset identifies a record's position within a partition.

Example:

```text
Partition 0

Offset 0
Offset 1
Offset 2
Offset 3
Offset 4
```

Consumers use offsets to track their progress.

### Important

Consuming a Kafka record does not normally delete it.

Kafka retains records according to retention and compaction policies.

---

# 20. Kafka vs RabbitMQ

Both technologies support messaging, but their architecture and typical use cases differ.

| Feature | RabbitMQ | Kafka |
|---|---|---|
| Primary model | Message broker | Distributed event log |
| Main abstraction | Exchange and queue | Topic and partition |
| Message retention | Queue lifecycle and configuration | Configured retention/compaction |
| Message replay | More limited queue-based patterns | Native offset-based replay |
| Routing | Rich exchange routing | Topic partitioning |
| Ordering | Queue-specific ordering considerations | Within a partition |
| Work distribution | Competing consumers | Consumer groups |
| Typical use | Task queues and message routing | Event streaming and data pipelines |

### When Should You Use RabbitMQ?

- Background task processing.
- Work queues.
- Complex message routing.
- Task distribution.
- Request/reply messaging.

### When Should You Use Kafka?

- High-volume event streams.
- Event replay.
- Real-time analytics.
- Data integration.
- Event-driven systems with multiple independent consumers.

Neither is universally better.

Choose according to delivery, retention, routing, replay and operational requirements.

---

# 21. Using Kafka with TypeScript

We will use KafkaJS.

### Installation

```bash
npm install kafkajs
```

### Step 1: Create Kafka Client

```typescript
import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "order-service",
    brokers: ["localhost:9092"]
});
```

### Step 2: Create Producer

```typescript
const producer = kafka.producer();

await producer.connect();

await producer.send({
    topic: "orders",

    messages: [
        {
            key: "ORD-101",

            value: JSON.stringify({
                orderId: "ORD-101",
                totalAmount: 2500
            })
        }
    ]
});

console.log("Order event published");
```

The message key can influence partition selection.

Using the order ID as a key can help keep events for the same order in the same partition under a consistent partitioning strategy.

### Step 3: Create Consumer

```typescript
const consumer = kafka.consumer({
    groupId: "order-processors"
});

await consumer.connect();

await consumer.subscribe({
    topic: "orders",
    fromBeginning: false
});

await consumer.run({

    eachMessage: async ({
        topic,
        partition,
        message
    }) => {

        const value = message.value?.toString();

        if (!value) {
            return;
        }

        const order = JSON.parse(value);

        console.log({
            topic,
            partition,
            offset: message.offset,
            order
        });

        // Process order here.
    }

});
```

### Important

KafkaJS supports automatic offset management and manual offset management.

The choice affects delivery behavior.

For example, committing an offset before business processing finishes can result in lost work if the consumer crashes.

Committing after processing generally supports at-least-once behavior, but a crash between the database update and offset commit can result in duplicate processing.

Your consumer must be idempotent.

---

# 22. Kafka Producer Idempotency and Transactions

Kafka supports producer idempotency and transactional messaging features.

These features help prevent certain duplicate writes and support atomic operations within Kafka's supported transactional boundaries.

However, they do not automatically make external database updates exactly-once.

For example:

```text
Kafka Consumer
      |
      v
Update MySQL
      |
      X
      |
   Crash before committing Kafka offset
```

The record may be processed again.

To prevent duplicate business effects, use database-level idempotency.

Examples:

- Unique event IDs.
- Unique transaction constraints.
- Inbox tables.
- Atomic database transactions.

---

# 23. What Is BullMQ?

BullMQ is a Redis-backed job queue library for Node.js.

It is useful for managing background jobs.

Common use cases:

- Email sending.
- PDF generation.
- Image processing.
- Excel imports.
- Report generation.
- Scheduled tasks.
- Notifications.
- Data synchronization.

### Architecture

```text
             API Server
                 |
                 v
              BullMQ
                 |
                 v
               Redis
                 |
                 v
              Worker
                 |
                 v
           Process Job
```

### BullMQ Components

| Component | Responsibility |
|---|---|
| Queue | Adds and manages jobs |
| Worker | Processes jobs |
| Job | Represents a unit of work |
| QueueEvents | Observes queue-level events |
| Scheduler mechanisms | Manage scheduled and recurring work |

---

# 24. Setting Up BullMQ

Install:

```bash
npm install bullmq ioredis
```

Start Redis:

```bash
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:7
```

### Project Structure

```text
bullmq-project/
│
├── src/
│   ├── queue.ts
│   ├── worker.ts
│   └── producer.ts
│
├── package.json
└── tsconfig.json
```

---

# 25. Creating a BullMQ Queue

**queue.ts**

```typescript
import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
    host: "localhost",
    port: 6379,
    maxRetriesPerRequest: null
});

export const emailQueue = new Queue(
    "email-queue",
    {
        connection
    }
);
```

Here:

- `Queue` creates a job queue.
- `IORedis` provides the Redis connection.
- `email-queue` is the queue name.

---

# 26. Adding Jobs to BullMQ

**producer.ts**

```typescript
import { emailQueue } from "./queue";

async function addEmailJob(): Promise<void> {

    const job = await emailQueue.add(
        "send-welcome-email",
        {
            userId: "U101",
            email: "john@example.com",
            subject: "Welcome!"
        }
    );

    console.log("Job added:", job.id);
}

addEmailJob();
```

### Understanding Queue.add()

```typescript
emailQueue.add(
    "send-welcome-email",
    {
        userId: "U101"
    }
);
```

The first argument is the job name.

The second argument is the job data.

BullMQ stores and manages the job through Redis.

---

# 27. Creating a BullMQ Worker

**worker.ts**

```typescript
import { Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
    host: "localhost",
    port: 6379,
    maxRetriesPerRequest: null
});

const emailWorker = new Worker(
    "email-queue",

    async (job) => {

        console.log("Processing job:", job.id);

        const {
            userId,
            email,
            subject
        } = job.data;

        console.log({
            userId,
            email,
            subject
        });

        // Integrate an email provider here.

        return {
            success: true
        };
    },

    {
        connection,
        concurrency: 5
    }
);

emailWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

emailWorker.on("failed", (job, error) => {
    console.error(
        `Job ${job?.id} failed:`,
        error
    );
});
```

### What Does Concurrency Mean?

```typescript
concurrency: 5
```

This allows the worker to process up to five jobs concurrently, subject to the worker's processing behavior and available resources.

---

# 28. BullMQ Job Retries

What happens if an email provider temporarily becomes unavailable?

You may want to retry the job.

BullMQ supports attempts and backoff options.

```typescript
await emailQueue.add(
    "send-email",
    {
        email: "john@example.com"
    },
    {
        attempts: 5,

        backoff: {
            type: "exponential",
            delay: 1000
        }
    }
);
```

This configures up to five attempts with exponential backoff.

Conceptually:

```text
Attempt 1 → Immediate
Attempt 2 → Approximately 1 second
Attempt 3 → Approximately 2 seconds
Attempt 4 → Approximately 4 seconds
Attempt 5 → Approximately 8 seconds
```

### Important

Retries are useful for temporary failures.

Do not blindly retry permanent failures such as:

- Invalid email addresses.
- Invalid request data.
- Unsupported file formats.
- Missing required fields.

Validate input before enqueueing jobs where possible.

---

# 29. BullMQ Delayed Jobs

A delayed job runs after a configured delay.

Example:

Send a reminder email after 30 minutes.

```typescript
await emailQueue.add(
    "send-reminder",
    {
        userId: "U101"
    },
    {
        delay: 30 * 60 * 1000
    }
);
```

The delay is expressed in milliseconds.

Another example:

```typescript
await emailQueue.add(
    "send-reminder",
    {
        userId: "U101"
    },
    {
        delay: 60000
    }
);
```

This delays execution by approximately one minute.

---

# 30. BullMQ Job Priorities

Some jobs may be more important than others.

For example:

- Payment processing.
- Password reset emails.
- Regular promotional emails.

You can assign priorities.

```typescript
await emailQueue.add(
    "password-reset",
    {
        email: "john@example.com"
    },
    {
        priority: 1
    }
);
```

Another job:

```typescript
await emailQueue.add(
    "promotional-email",
    {
        email: "john@example.com"
    },
    {
        priority: 10
    }
);
```

Lower numerical priority values represent higher priority in BullMQ.

Priorities influence processing order, but do not guarantee that an urgent job immediately interrupts a job already being processed.

---

# 31. BullMQ Job Status

BullMQ jobs can move through several states.

| Status | Meaning |
|---|---|
| Waiting | Job is waiting to be processed |
| Active | Worker is processing the job |
| Completed | Job finished successfully |
| Failed | Job processing failed |
| Delayed | Job is waiting for its scheduled execution time |
| Waiting-Children | Job is waiting for dependent jobs |

You can inspect job states.

```typescript
const job = await emailQueue.getJob("123");

if (job) {

    const state = await job.getState();

    console.log("Job state:", state);
}
```

This is useful when building job-monitoring dashboards.

---

# 32. BullMQ Job Events

BullMQ supports job and queue event monitoring.

Example:

```typescript
import { QueueEvents } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
    host: "localhost",
    port: 6379,
    maxRetriesPerRequest: null
});

const queueEvents = new QueueEvents(
    "email-queue",
    {
        connection
    }
);

await queueEvents.waitUntilReady();

queueEvents.on("completed", ({ jobId }) => {

    console.log(
        `Job completed: ${jobId}`
    );

});

queueEvents.on("failed", ({ jobId, failedReason }) => {

    console.error(
        `Job failed: ${jobId}`,
        failedReason
    );

});
```

QueueEvents uses Redis Streams internally to observe queue-level events.

This is different from basic Redis Pub/Sub.

---

# 33. BullMQ Scheduled and Recurring Jobs

Scheduled jobs execute at a specific future time or according to a recurring schedule.

Examples:

- Daily report generation.
- Weekly summary email.
- Monthly invoice generation.
- Automatic cleanup.
- Scheduled data synchronization.

### Cron Expression

A cron expression commonly has five fields:

```text
* * * * *
| | | | |
| | | | └── Day of week
| | | └──── Month
| | └────── Day of month
| └──────── Hour
└────────── Minute
```

Examples:

| Cron Expression | Meaning |
|---|---|
| `* * * * *` | Every minute |
| `0 * * * *` | Every hour |
| `0 9 * * *` | Every day at 9 AM |
| `0 0 * * *` | Every day at midnight |
| `0 9 * * 1` | Every Monday at 9 AM |

### Important: Time Zones

Cron schedules need an explicit time-zone decision.

For example, 9 AM UTC is not 9 AM India time.

Also consider:

- Daylight Saving Time.
- Missed executions.
- Overlapping runs.
- Duplicate scheduling.
- Multiple application instances.

### BullMQ Scheduling

BullMQ scheduling APIs have evolved across versions.

Modern versions support job schedulers for recurring work. For example, with a compatible current BullMQ version:

```typescript
await emailQueue.upsertJobScheduler(
    "daily-report",

    {
        pattern: "0 9 * * *",
        tz: "Asia/Kolkata"
    },

    {
        name: "generate-daily-report",

        data: {
            reportType: "daily"
        }
    }
);
```

Verify the API against the installed BullMQ major version before implementing it.

Do not assume older repeatable-job examples are compatible with every current version.

---

# 34. BullMQ Rate Limiting

Rate limiting controls how frequently a worker processes jobs.

Suppose an external email provider allows only 100 requests per minute.

You should control your job-processing rate.

BullMQ supports worker-level rate limiting.

Example:

```typescript
const worker = new Worker(
    "email-queue",

    async (job) => {

        console.log("Sending email:", job.data.email);

    },

    {
        connection,

        limiter: {
            max: 100,
            duration: 60000
        }
    }
);
```

This configures a maximum of 100 jobs per 60 seconds for the queue's rate-limited processing.

Check the installed BullMQ version for the supported limiter configuration.

---

# 35. Job Idempotency

This is one of the most important concepts in background processing.

Suppose your worker sends a payment request.

The worker processes the job successfully, but crashes before marking the job completed.

The queue may retry the job.

Now the payment could be processed twice.

### Solution: Idempotency

An operation is idempotent when repeating it produces the same intended business result as performing it once.

Example:

```typescript
interface PaymentJob {
    orderId: string;
    idempotencyKey: string;
}
```

Processing:

```typescript
async function processPayment(
    job: PaymentJob
): Promise<void> {

    // Check database for an existing transaction
    // with this idempotency key.

    // If already processed, return the existing result.

    // Otherwise, process payment and save the result
    // using an atomic database transaction.
}
```

A unique database constraint is often essential.

For example:

```sql
CREATE TABLE payments (
    id VARCHAR(50) PRIMARY KEY,
    idempotency_key VARCHAR(100) NOT NULL UNIQUE,
    order_id VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL
);
```

### Important

BullMQ job IDs and duplicate-job prevention can help, but they are not a replacement for business-level idempotency.

External side effects still require appropriate idempotency handling.

---

# 36. What Are Background Jobs?

A background job is a task executed outside the normal request-response lifecycle.

Examples:

| Task | Why Use a Background Job? |
|---|---|
| Sending emails | External provider calls may be slow |
| PDF generation | CPU and memory intensive |
| Excel import | May involve thousands of records |
| Video processing | Time-consuming |
| Image resizing | CPU-intensive |
| Report generation | Can involve large queries |
| Notifications | Do not need to block the main request |
| Data synchronization | Often runs periodically |

### Without Background Jobs

```text
Frontend
   |
   v
API Request
   |
   v
Process Excel File
   |
   v
Save 50,000 Records
   |
   v
Return Response
```

The request may take several minutes and time out.

### With Background Jobs

```text
Frontend
   |
   v
API Request
   |
   v
Add Job to Queue
   |
   v
Return 202 Accepted
   |
   v
Background Worker
   |
   v
Process Excel File
```

The API can respond quickly.

The frontend can later check processing status.

---

# 37. Returning HTTP 202 Accepted

When an API accepts a task for asynchronous processing, it can return HTTP 202.

Example:

```typescript
import express from "express";
import { emailQueue } from "./queue";

const app = express();

app.use(express.json());

app.post("/send-email", async (req, res) => {

    const {
        email,
        subject
    } = req.body;

    const job = await emailQueue.add(
        "send-email",
        {
            email,
            subject
        }
    );

    return res.status(202).json({
        message: "Email job accepted",
        jobId: job.id,
        status: "QUEUED"
    });
});

app.listen(3000);
```

### What Does 202 Mean?

The request has been accepted for processing, but processing has not necessarily completed.

It does not mean the email has already been sent.

---

# 38. Checking Background Job Status

You can expose a status endpoint.

```typescript
app.get("/jobs/:jobId", async (req, res) => {

    const job = await emailQueue.getJob(
        req.params.jobId
    );

    if (!job) {
        return res.status(404).json({
            message: "Job not found"
        });
    }

    const state = await job.getState();

    return res.json({
        jobId: job.id,
        state,
        result: job.returnvalue,
        failedReason: job.failedReason
    });
});
```

Frontend can poll:

```text
GET /jobs/123
```

Example response:

```json
{
    "jobId": "123",
    "state": "completed",
    "result": {
        "success": true
    }
}
```

For larger applications, you may store durable business-level job status in your own database rather than relying exclusively on queue retention.

---

# 39. Cron Jobs vs Background Queues

A cron job executes a task according to a schedule.

A background queue executes tasks asynchronously.

They solve related but different problems.

| Feature | Cron Job | Background Queue |
|---|---|---|
| Main purpose | Scheduling | Task processing |
| Trigger | Time-based | Job submission |
| Retry support | Depends on implementation | Commonly built in |
| Job status | Must be implemented | Queue tracks states |
| Concurrency | Must be managed | Usually supported |
| Distribution | Requires coordination | Designed for distributed workers |

### Example Cron Job

Using `node-cron`:

```bash
npm install node-cron
```

```typescript
import cron from "node-cron";

cron.schedule(
    "0 9 * * *",
    () => {

        console.log("Generating daily report");

    },
    {
        timezone: "Asia/Kolkata"
    }
);
```

This is a simple scheduler.

### Important

An in-memory cron scheduler is not automatically durable.

If your process is stopped at the scheduled time, the execution may be missed.

If you run multiple replicas, every replica may execute the same schedule unless you coordinate them.

For durable, distributed scheduling, use a scheduler or queue system with appropriate coordination.

---

# 40. Distributed Systems Fundamentals

A distributed system consists of multiple independent computers or services communicating through a network.

Examples:

- E-commerce platforms.
- Banking applications.
- Payment systems.
- Ride-sharing platforms.
- Social networks.

### Challenges

1. Network failures.
2. Partial failures.
3. Network latency.
4. Data inconsistency.
5. Duplicate messages.
6. Concurrent updates.
7. Clock synchronization.
8. Service availability.
9. Distributed transactions.

### Partial Failure

Suppose your application contains:

```text
Order Service       → Available
Payment Service     → Available
Inventory Service   → Unavailable
Notification Service → Available
```

Only Inventory Service has failed.

A well-designed distributed system should not necessarily bring down every other service.

It should handle the failure gracefully.

---

# 41. Eventual Consistency

Eventual consistency means that distributed services or replicas may temporarily contain different data but are expected to converge when updates stop and communication succeeds.

Example:

A user places an order.

```text
Order Service
     |
     v
Order Created
     |
     v
Event Published
     |
     v
Inventory Service
     |
     v
Stock Updated
```

There may be a small delay between order creation and inventory update.

During that period, both services may have different views of the workflow.

### Important

Eventual consistency requires careful business design.

You should define:

- Expected propagation delay.
- Retry policies.
- Failure handling.
- Reconciliation processes.
- User-visible statuses.

---

# 42. The Saga Pattern

A distributed business workflow may involve multiple services.

Example:

Placing an order requires:

1. Create Order.
2. Process Payment.
3. Reserve Inventory.
4. Arrange Shipment.

These operations generally cannot be wrapped in one normal database transaction across independently owned databases.

The Saga Pattern coordinates these operations using local transactions and compensating actions.

### Architecture

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
Arrange Shipment
     |
     v
Order Completed
```

What happens if Inventory Service fails?

The system may need to refund the payment and cancel the order.

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

## 42.1 Compensating Transactions

A compensating transaction performs a business action to counteract an earlier operation.

| Original Operation | Compensation |
|---|---|
| Payment captured | Refund payment |
| Inventory reserved | Release inventory |
| Order created | Cancel order |
| Shipment arranged | Cancel shipment if possible |

A compensation is not always an exact rollback.

For example, a refund may take several days to complete.

## 42.2 Saga Choreography

In choreography, services communicate through events.

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

There is no central workflow controller.

## 42.3 Saga Orchestration

In orchestration, a central coordinator manages the workflow.

```text
             Saga Orchestrator
                    |
          ┌─────────┼─────────┐
          |         |         |
          v         v         v
       Payment  Inventory  Shipping
       Service   Service   Service
```

### Comparison

| Choreography | Orchestration |
|---|---|
| Event-driven coordination | Central workflow coordinator |
| No central controller | Central controller exists |
| Can become difficult to follow | Workflow is easier to inspect centrally |
| Useful for simpler event-driven workflows | Useful for complex business workflows |

---

# 43. The Transactional Outbox Pattern

Consider this operation:

1. Save an order to MySQL.
2. Publish an `OrderCreated` event to RabbitMQ.

What happens if MySQL succeeds but RabbitMQ publishing fails?

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
Broker Failure
```

The order exists, but other services never receive the event.

This is known as the dual-write problem.

### Solution: Transactional Outbox

Save the business record and event record in the same database transaction.

```text
              Order Service
                   |
                   v
            Database Transaction
                   |
             ┌─────┴─────┐
             |           |
             v           v
         Save Order   Save Event
             |           |
             └─────┬─────┘
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

### Example Tables

Orders:

```sql
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) NOT NULL
);
```

Outbox Events:

```sql
CREATE TABLE outbox_events (
    id VARCHAR(50) PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    payload JSON NOT NULL,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL
);
```

### TypeScript Example with Sequelize

```typescript
import crypto from "node:crypto";

await sequelize.transaction(async (transaction) => {

    const order = await Order.create(
        {
            id: "ORD-101",
            customerId: "CUS-101",
            totalAmount: 2500,
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
                customerId: order.customerId,
                totalAmount: order.totalAmount
            },

            publishedAt: null
        },
        {
            transaction
        }
    );

});
```

A separate publisher reads unpublished records and sends them to the broker.

### Important

The database transaction does not include the message broker.

If the publisher sends the event but crashes before marking it published, the event may be published again.

Therefore, consumers must be idempotent.

---

# 44. Distributed Transactions and Two-Phase Commit

A distributed transaction involves multiple independent resources.

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

One traditional approach is Two-Phase Commit (2PC).

## Phase 1: Prepare

The coordinator asks participating resources whether they can commit.

```text
Coordinator
     |
     ├── Order DB: Prepare
     ├── Payment DB: Prepare
     └── Inventory DB: Prepare
```

Each participant prepares its transaction and votes.

## Phase 2: Commit or Abort

If all participants vote to commit, the coordinator instructs them to commit.

If a participant cannot commit, the coordinator can instruct them to abort.

### Limitations

- Requires coordination.
- Can hold database resources while waiting.
- Adds operational complexity.
- Coordinator failures need careful handling.
- Not always supported across different services and databases.

In microservices architectures, Saga and Transactional Outbox patterns are commonly preferred for many business workflows.

---

# 45. Retry Strategies in Distributed Systems

Failures happen in distributed environments.

A service might temporarily fail because of:

- Network problems.
- Database overload.
- Temporary broker unavailability.
- Rate limits.
- External API outages.

A retry strategy helps recover from transient failures.

### Common Retry Strategies

| Strategy | Description |
|---|---|
| Immediate | Retry immediately |
| Fixed Delay | Retry after a constant delay |
| Exponential Backoff | Increase delay after each failure |
| Exponential Backoff with Jitter | Add randomness to exponential delays |

### Example

```typescript
async function retryOperation<T>(
    operation: () => Promise<T>,
    maxAttempts = 3
): Promise<T> {

    let attempt = 0;

    while (attempt < maxAttempts) {

        try {

            return await operation();

        } catch (error) {

            attempt++;

            if (attempt >= maxAttempts) {
                throw error;
            }

            const baseDelay = 1000 * 2 ** (attempt - 1);

            const jitter = Math.random() * 500;

            const delay = baseDelay + jitter;

            await new Promise((resolve) => {
                setTimeout(resolve, delay);
            });
        }
    }

    throw new Error("Operation failed");
}
```

Usage:

```typescript
const result = await retryOperation(
    async () => {

        const response = await fetch(
            "https://api.example.com/data"
        );

        if (!response.ok) {
            throw new Error("API request failed");
        }

        return response.json();
    },
    3
);
```

### Important

This example is educational.

A production retry implementation should:

- Retry only transient errors.
- Respect `Retry-After` when appropriate.
- Use an overall deadline.
- Avoid retrying permanent validation failures.
- Avoid multiplying retries across multiple layers.
- Include circuit breakers where appropriate.

---

# 46. Observability for Message Processing

How do you monitor a system that contains multiple queues and workers?

You need observability.

Important metrics include:

| Metric | Purpose |
|---|---|
| Queue Depth | Number of waiting messages |
| Consumer Lag | How far consumers are behind |
| Processing Time | How long each job takes |
| Retry Count | Number of retry attempts |
| Failure Rate | Percentage of failed jobs |
| DLQ Count | Number of dead-lettered messages |
| Throughput | Messages processed per second |
| Worker Utilization | Worker resource usage |

### Structured Logging

```typescript
console.log(
    JSON.stringify({
        level: "info",
        service: "payment-worker",
        event: "PAYMENT_PROCESSED",
        orderId: "ORD-101",
        correlationId: "req-123",
        timestamp: new Date().toISOString()
    })
);
```

### Correlation ID

Use a correlation ID to connect related operations across services.

```text
API Gateway
    |
    | correlationId: req-123
    v
Order Service
    |
    | correlationId: req-123
    v
Payment Worker
    |
    | correlationId: req-123
    v
Notification Worker
```

For distributed tracing, OpenTelemetry can propagate trace context through supported messaging integrations.

---

# 47. Production Background Processing Best Practices

Follow these practices when building production systems.

| Practice | Why It Matters |
|---|---|
| Idempotent Consumers | Prevent duplicate business effects |
| Bounded Retries | Avoid infinite retry loops |
| Dead Letter Queues | Isolate permanently failing messages |
| Message Validation | Reject invalid payloads |
| Structured Logging | Simplify debugging |
| Correlation IDs | Trace related operations |
| Graceful Shutdown | Avoid interrupting active processing |
| Concurrency Control | Prevent resource exhaustion |
| Backpressure | Control incoming workload |
| Monitoring | Detect processing problems |
| Queue Retention | Control storage growth |
| Secret Management | Protect broker credentials |
| Schema Versioning | Support evolving event contracts |

### Graceful Worker Shutdown

A worker should stop accepting new work and finish or safely release active jobs.

For BullMQ:

```typescript
import { Worker } from "bullmq";

const worker = new Worker(
    "email-queue",
    async (job) => {

        console.log("Processing:", job.id);

        // Process job.

    },
    {
        connection
    }
);

async function shutdown(): Promise<void> {

    console.log("Worker shutting down");

    await worker.close();

    await connection.quit();

    console.log("Worker stopped");
}

process.on("SIGTERM", shutdown);

process.on("SIGINT", shutdown);
```

A complete implementation should also protect against repeated shutdown calls and set a shutdown deadline.

---

# 48. Complete Practical Project: Order Processing Pipeline

Now let's combine everything into one project.

## Project Overview

Build an asynchronous order processing system using:

- TypeScript.
- Node.js.
- Express.js.
- MySQL.
- RabbitMQ.
- Redis.
- BullMQ.

## Architecture

```text
                  Frontend
                     |
                     v
                 Express API
                     |
                     v
                Order Service
                     |
                     v
                 MySQL DB
                     |
                     v
              Outbox Publisher
                     |
                     v
                 RabbitMQ
                     |
          ┌──────────┼──────────┐
          |          |          |
          v          v          v
       Payment   Inventory   Notification
       Worker     Worker      Worker
          |          |          |
          v          v          v
      Payment DB  Inventory DB  Email/SMS
```

## 48.1 Folder Structure

```text
order-processing-system/
│
├── src/
│   │
│   ├── api/
│   │   ├── app.ts
│   │   └── routes/
│   │       └── order.routes.ts
│   │
│   ├── services/
│   │   └── order.service.ts
│   │
│   ├── events/
│   │   └── order.events.ts
│   │
│   ├── queues/
│   │   └── rabbitmq.ts
│   │
│   ├── workers/
│   │   ├── payment.worker.ts
│   │   ├── inventory.worker.ts
│   │   └── notification.worker.ts
│   │
│   ├── database/
│   │   └── connection.ts
│   │
│   └── server.ts
│
├── package.json
└── tsconfig.json
```

## 48.2 Define Order Event

```typescript
export interface OrderCreatedEvent {
    eventId: string;
    orderId: string;
    customerId: string;
    totalAmount: number;
    occurredAt: string;
}
```

## 48.3 Create Order

```typescript
interface CreateOrderInput {
    customerId: string;
    totalAmount: number;
}

async function createOrder(
    input: CreateOrderInput
) {

    const order = {
        id: crypto.randomUUID(),
        customerId: input.customerId,
        totalAmount: input.totalAmount,
        status: "PENDING"
    };

    // Save order and outbox event
    // in one database transaction.

    return order;
}
```

## 48.4 Publish Order Event

```typescript
async function publishOrderEvent(
    event: OrderCreatedEvent
): Promise<void> {

    // Publish event using RabbitMQ
    // with persistent delivery and publisher confirms.
}
```

## 48.5 Process Payment

```typescript
interface PaymentJob {
    eventId: string;
    orderId: string;
    totalAmount: number;
}

async function processPayment(
    payment: PaymentJob
): Promise<void> {

    console.log(
        "Processing payment for:",
        payment.orderId
    );

    // Check whether eventId has already been processed.
    // Process payment.
    // Save result transactionally.
    // Publish PaymentCompleted or PaymentFailed.
}
```

## 48.6 Process Inventory

```typescript
interface InventoryJob {
    orderId: string;
    productId: string;
    quantity: number;
}

async function reserveInventory(
    inventory: InventoryJob
): Promise<void> {

    console.log(
        "Reserving inventory for:",
        inventory.orderId
    );

    // Check available stock.
    // Reserve stock atomically.
    // Publish InventoryReserved or InventoryFailed.
}
```

## 48.7 Send Notification

```typescript
interface NotificationJob {
    customerId: string;
    orderId: string;
    status: string;
}

async function sendOrderNotification(
    notification: NotificationJob
): Promise<void> {

    console.log(
        `Sending order notification: ${notification.orderId}`
    );

    // Integrate email or SMS provider.
}
```

These snippets illustrate the main contracts and responsibilities. They are not a complete deployable implementation: broker lifecycle management, persistence, outbox polling, idempotency, retries, DLQ configuration and Saga coordination must still be implemented.

---

# 49. Common Mistakes in Event-Driven Systems

### Mistake 1: Using EventEmitter as a Distributed Message Broker

EventEmitter works inside one Node.js process. It does not provide durable distributed messaging.

### Mistake 2: Acknowledging Messages Too Early

If a consumer acknowledges a message before successfully completing the business operation, a crash can cause lost work.

### Mistake 3: Assuming Messages Are Delivered Exactly Once

Duplicate deliveries are possible. Consumers should be idempotent.

### Mistake 4: Retrying Forever

Unlimited retries can create endless processing loops.

Use bounded retries and DLQs.

### Mistake 5: Ignoring Message Ordering

Multiple consumers and partitions can affect processing order.

Define ordering requirements explicitly.

### Mistake 6: Publishing Events Without Versioning

Event contracts evolve. Include a versioning strategy.

Example:

```typescript
interface OrderCreatedEventV1 {
    eventId: string;
    version: 1;
    orderId: string;
}
```

### Mistake 7: Putting Too Much Data in Events

Publish the information consumers need, but avoid unnecessarily large payloads and sensitive information.

### Mistake 8: No Monitoring

Without queue-depth, retry and processing-latency monitoring, failures can remain unnoticed.

### Mistake 9: Treating Kafka Like a Traditional Queue

Kafka is a retained partitioned event log. Consumer offsets and retention are central to its design.

### Mistake 10: Ignoring Idempotency in Background Jobs

A job can be retried or executed more than once. Business operations must handle that safely.

---

# 50. Interview Questions and Answers

### Q1. What is Event-Driven Architecture?

An architectural style in which components communicate by publishing and consuming events.

### Q2. What is an event?

An event is a record of something that has already happened.

### Q3. What is the difference between an event and a command?

A command requests an action. An event records a completed occurrence.

### Q4. What is EventEmitter?

A Node.js API that allows components inside the same process to emit and listen for events.

### Q5. Is EventEmitter a message broker?

No. It is an in-process event mechanism and does not provide durable distributed messaging.

### Q6. What is Pub/Sub?

A messaging pattern in which publishers send messages to topics or channels and subscribers receive relevant messages.

### Q7. What is a message queue?

A mechanism for storing messages until consumers process them.

### Q8. What is a message broker?

Software that receives, routes, stores and delivers messages between applications.

### Q9. What is RabbitMQ?

A message broker that supports exchanges, queues, routing keys and multiple messaging patterns.

### Q10. What is an exchange in RabbitMQ?

An exchange receives messages from producers and routes them to queues.

### Q11. What are RabbitMQ exchange types?

Direct, Fanout, Topic and Headers.

### Q12. What is a routing key?

A message attribute used by an exchange to determine where the message should be routed.

### Q13. What is a binding?

A relationship between an exchange and a queue, optionally containing routing conditions.

### Q14. What is message acknowledgement?

A mechanism through which a consumer confirms that a message has been successfully processed.

### Q15. What is prefetch?

A RabbitMQ setting that limits the number of unacknowledged messages delivered to a consumer.

### Q16. What is a Dead Letter Queue?

A queue that receives messages that cannot be processed normally, according to configured dead-letter conditions.

### Q17. What are publisher confirms?

A RabbitMQ mechanism through which the broker confirms handling of published messages.

### Q18. What is Apache Kafka?

A distributed event-streaming platform used for storing and processing high-volume event streams.

### Q19. What is a Kafka topic?

A named stream of records.

### Q20. What is a Kafka partition?

A subdivision of a topic that enables distributed storage and parallel processing.

### Q21. What is a Kafka consumer group?

A group of consumers that coordinate consumption of topic partitions.

### Q22. What is a Kafka offset?

A record's position within a partition.

### Q23. Is Kafka a traditional message queue?

Not exactly. Kafka is primarily a distributed event log with queue-like consumption patterns.

### Q24. What is the difference between RabbitMQ and Kafka?

RabbitMQ focuses on message routing and queue-based delivery, while Kafka focuses on retained partitioned event streams and consumer offsets.

### Q25. What is BullMQ?

A Redis-backed job queue library for Node.js.

### Q26. What is a BullMQ Worker?

A component that retrieves and processes jobs from a BullMQ queue.

### Q27. What is job concurrency?

The number of jobs a worker can process concurrently.

### Q28. What is a delayed job?

A job scheduled to become eligible for processing after a specified delay.

### Q29. What is exponential backoff?

A retry strategy in which the delay between retries increases exponentially.

### Q30. What is job idempotency?

Ensuring that repeated processing of a job does not create duplicate business effects.

### Q31. What is a background job?

A task executed outside the normal HTTP request-response lifecycle.

### Q32. What is HTTP 202 Accepted?

A response indicating that the request has been accepted for processing, but processing may not yet be complete.

### Q33. What is eventual consistency?

A consistency model in which distributed data may temporarily differ but is expected to converge.

### Q34. What is the Saga Pattern?

A pattern that coordinates distributed business operations through local transactions and compensating actions.

### Q35. What is a compensating transaction?

A business operation that counteracts the effect of an earlier operation.

### Q36. What is the Transactional Outbox Pattern?

A pattern that stores business data and outgoing event records in the same database transaction before publishing events separately.

### Q37. What is the dual-write problem?

A reliability problem that occurs when writing to two independent systems, such as a database and message broker, and only one operation succeeds.

### Q38. What is at-least-once delivery?

A delivery guarantee in which a message may be delivered one or more times.

### Q39. Why is exactly-once processing difficult?

Because a failure can occur between separate operations, such as updating a database and acknowledging a message.

### Q40. What is a poison message?

A message that repeatedly fails processing.

### Q41. What is backpressure?

A mechanism for controlling incoming work when consumers cannot process messages as quickly as producers generate them.

### Q42. What is consumer lag?

The amount of work or number of records a consumer is behind in processing an event stream.

### Q43. What is the purpose of correlation IDs?

They help identify and trace related operations across multiple services.

### Q44. What is the difference between RabbitMQ acknowledgements and publisher confirms?

Consumer acknowledgements confirm processing by a consumer. Publisher confirms indicate that the broker has handled a published message.

### Q45. Why should background workers support graceful shutdown?

To avoid interrupting active work and to release resources safely during deployment or termination.

---

# 51. Practical Exercises

Complete these exercises to strengthen your understanding.

## Beginner Level

1. Create a Node.js EventEmitter example.
2. Register multiple listeners for one event.
3. Implement `once()` and `off()`.
4. Create a Redis Pub/Sub publisher.
5. Create a Redis Pub/Sub subscriber.
6. Install RabbitMQ using Docker.
7. Create a RabbitMQ queue.
8. Publish and consume a message.

## Intermediate Level

9. Create a Direct Exchange.
10. Create a Fanout Exchange.
11. Create a Topic Exchange.
12. Implement manual acknowledgements.
13. Configure RabbitMQ prefetch.
14. Configure publisher confirms.
15. Create a Dead Letter Queue.
16. Implement bounded retry logic.
17. Set up Kafka using Docker.
18. Create a Kafka producer.
19. Create a Kafka consumer.
20. Implement a BullMQ queue and worker.
21. Add job retries and backoff.
22. Implement delayed jobs.
23. Implement job priorities.
24. Create a job-status API.
25. Implement graceful worker shutdown.

## Advanced Level

26. Implement an Excel import system using BullMQ.
27. Process 50,000 records through background workers.
28. Implement idempotent job processing.
29. Build an event-driven order processing workflow.
30. Implement a Saga for order and payment processing.
31. Implement the Transactional Outbox Pattern.
32. Implement an Inbox or deduplication table.
33. Implement distributed correlation IDs.
34. Monitor queue depth and processing latency.
35. Build a complete order-processing pipeline with retries and DLQ.

---

# 52. Phase 54 Completion Checklist

| No. | Topic | Status |
|---|---|---|
| 1 | Event-Driven Architecture | ☐ |
| 2 | Events and Commands | ☐ |
| 3 | Domain Events and Integration Events | ☐ |
| 4 | Synchronous vs Asynchronous Communication | ☐ |
| 5 | Node.js EventEmitter | ☐ |
| 6 | Pub/Sub Architecture | ☐ |
| 7 | Redis Pub/Sub | ☐ |
| 8 | Redis Streams | ☐ |
| 9 | Message Queues | ☐ |
| 10 | Message Brokers | ☐ |
| 11 | Delivery Guarantees | ☐ |
| 12 | RabbitMQ Architecture | ☐ |
| 13 | RabbitMQ Exchanges | ☐ |
| 14 | Routing Keys and Bindings | ☐ |
| 15 | Message Acknowledgements | ☐ |
| 16 | Publisher Confirms | ☐ |
| 17 | Prefetch | ☐ |
| 18 | Dead Letter Queues | ☐ |
| 19 | Retry Mechanisms | ☐ |
| 20 | Apache Kafka | ☐ |
| 21 | Kafka Topics and Partitions | ☐ |
| 22 | Kafka Producers and Consumers | ☐ |
| 23 | Consumer Groups | ☐ |
| 24 | Kafka Offsets | ☐ |
| 25 | RabbitMQ vs Kafka | ☐ |
| 26 | BullMQ | ☐ |
| 27 | Background Workers | ☐ |
| 28 | Job Retries | ☐ |
| 29 | Delayed Jobs | ☐ |
| 30 | Scheduled Jobs | ☐ |
| 31 | Cron Jobs | ☐ |
| 32 | Job Priorities | ☐ |
| 33 | Job Idempotency | ☐ |
| 34 | Distributed Systems | ☐ |
| 35 | Eventual Consistency | ☐ |
| 36 | Saga Pattern | ☐ |
| 37 | Transactional Outbox | ☐ |
| 38 | Distributed Transactions | ☐ |
| 39 | Observability | ☐ |
| 40 | Production Background Processing | ☐ |

---

# 53. What Comes Next?

**Phase 55: Advanced TypeScript – Microservices Architecture, Service Discovery, API Gateway, Inter-Service Communication, Docker and Kubernetes**

Upcoming topics:

1. Microservices Architecture Fundamentals.
2. Monolithic vs Microservices Architecture.
3. Domain-Driven Design (DDD).
4. Bounded Context.
5. Database-per-Service Pattern.
6. Inter-Service Communication.
7. Synchronous vs Asynchronous Communication.
8. API Gateway.
9. Service Discovery.
10. Client-Side vs Server-Side Discovery.
11. Load Balancing.
12. gRPC.
13. Circuit Breaker Pattern.
14. Bulkhead Pattern.
15. Distributed Configuration Management.
16. Docker Fundamentals.
17. Dockerfile for TypeScript Applications.
18. Multi-Stage Docker Builds.
19. Docker Networking.
20. Docker Volumes.
21. Docker Compose.
22. Kubernetes Architecture.
23. Pods.
24. Deployments.
25. Services.
26. Ingress.
27. ConfigMaps and Secrets.
28. Horizontal Pod Autoscaling.
29. Health Checks.
30. Graceful Shutdown.
31. Distributed Logging.
32. Distributed Tracing.
33. OpenTelemetry.
34. Service Mesh.
35. Distributed Systems.
36. CAP Theorem.
37. Eventual Consistency.
38. Saga Pattern.
39. Transactional Outbox.
40. CI/CD for Microservices.

**Phase 54 is complete.**