# Phase 43: Advanced TypeScript – Performance, Security, Scalability and Production Best Practices

**Level:** Advanced to Expert  
**Prerequisites:** TypeScript fundamentals, OOP, Generics, Modules, Node.js, Express.js, React, Testing, Debugging and Error Handling.

---

# 1. Learning Objectives

In this phase, you will learn how to build secure, scalable, high-performance TypeScript applications suitable for production environments.

Topics covered:

1. TypeScript and JavaScript Runtime.
2. TypeScript Performance Optimization.
3. Compiler Performance.
4. Memory Management.
5. JavaScript Event Loop.
6. CPU-Bound vs I/O-Bound Operations.
7. Worker Threads.
8. Streams and Backpressure.
9. Type-Safe Environment Variables.
10. Application Configuration.
11. Secure TypeScript Development.
12. Input Validation and Sanitization.
13. Zod with TypeScript.
14. Authentication and Authorization.
15. JWT Security.
16. Secure API Design.
17. SQL Injection Prevention.
18. XSS and CSRF.
19. CORS and Security Headers.
20. Rate Limiting.
21. Production Error Handling.
22. Performance Monitoring.
23. Scalable Architecture.
24. Design Patterns.
25. Production Deployment.
26. Docker with TypeScript.
27. Production Build Optimization.
28. Real-World Production Architecture.

---

# PART 1: TYPESCRIPT AND JAVASCRIPT RUNTIME

## 2. How TypeScript Actually Works

Before optimizing TypeScript applications, you must understand one important concept:

**TypeScript does not run directly in the JavaScript runtime.**

TypeScript is converted into JavaScript before execution in a typical deployment workflow.

Consider:

```typescript
interface User {
    id: number;
    name: string;
}

const user: User = {
    id: 1,
    name: "John"
};

console.log(user);
```

After compilation, the JavaScript looks approximately like:

```javascript
const user = {
    id: 1,
    name: "John"
};

console.log(user);
```

Notice something important.

The following TypeScript constructs disappear:

- Interfaces.
- Type aliases.
- Type annotations.
- Generic type parameters.
- Type assertions.

They are compile-time constructs.

### 2.1 TypeScript vs JavaScript Runtime

| Feature | TypeScript | JavaScript Runtime |
|---|---|---|
| Type checking | Compile time | No TypeScript type checking |
| Interfaces | Compile-time only | Not available |
| Type aliases | Compile-time only | Not available |
| Generics | Compile-time only | Usually erased |
| Classes | Transformed as needed | Runtime constructs |
| Functions | Type information removed | Executable functions |
| Objects | Type-checked during development | Runtime objects |

### 2.2 Important Concept: Type Safety Does Not Guarantee Runtime Safety

Consider:

```typescript
interface User {
    id: number;
    name: string;
}

function getUser(user: User): void {
    console.log(user.name);
}
```

TypeScript expects a valid `User`.

But what happens if data comes from an external API?

```typescript
const response = await fetch("/api/user");

const user = await response.json() as User;

getUser(user);
```

The assertion:

```typescript
as User
```

does not validate the actual data.

Suppose the API returns:

```json
{
    "id": "invalid",
    "name": 100
}
```

TypeScript will still allow the assertion.

This is why runtime validation is essential.

**Remember:**

TypeScript provides compile-time safety.

Runtime validation protects your application from invalid external data.

---

# PART 2: TYPESCRIPT PERFORMANCE OPTIMIZATION

## 3. What Is Performance Optimization?

Performance optimization means improving an application's:

- Execution speed.
- Memory consumption.
- Response time.
- CPU utilization.
- Resource utilization.
- Scalability.

Suppose an API takes 5 seconds to respond.

After optimization, it takes 500 milliseconds.

This is a significant improvement.

However, optimization should be based on measurement rather than assumptions.

### Important Performance Metrics

| Metric | Meaning |
|---|---|
| Response Time | Time required to respond to a request |
| Latency | Delay experienced by an operation |
| Throughput | Number of requests processed per unit of time |
| CPU Usage | CPU resources consumed |
| Memory Usage | Memory consumed by an application |
| Error Rate | Percentage of failed requests |
| P95 Latency | Response time below which 95% of requests complete |
| P99 Latency | Response time below which 99% of requests complete |

### Example

Suppose your API processes 1,000 requests.

| Request | Response Time |
|---|---:|
| 1–950 | Under 200 ms |
| 951–990 | Under 500 ms |
| 991–1000 | Under 2 seconds |

P95 and P99 help you understand performance beyond the average.

A low average response time does not necessarily mean the application performs well for every user.

---

## 4. Avoid Unnecessary Computations

Consider:

```typescript
function getUsers(users: User[]): User[] {

    return users.map(user => {

        return {
            id: user.id,
            name: user.name,
            email: user.email
        };

    });

}
```

This is perfectly reasonable.

But suppose you repeatedly calculate an expensive value.

```typescript
function calculateTotal(
    products: Product[]
): number {

    return products.reduce((total, product) => {

        return total + product.price * product.quantity;

    }, 0);

}
```

If the same result is needed repeatedly and the underlying data has not changed, you may consider caching.

### 4.1 Memoization

Memoization stores previously calculated results.

Example:

```typescript
function memoize(
    fn: (value: number) => number
): (value: number) => number {

    const cache = new Map<number, number>();

    return (value: number): number => {

        if (cache.has(value)) {
            return cache.get(value)!;
        }

        const result = fn(value);

        cache.set(value, result);

        return result;

    };

}
```

Usage:

```typescript
function square(number: number): number {

    console.log("Calculating...");

    return number * number;

}

const memoizedSquare = memoize(square);

console.log(memoizedSquare(5));

console.log(memoizedSquare(5));
```

Output:

```text
Calculating...
25
25
```

The second call uses the cached result.

### When Is Memoization Useful?

- Expensive calculations.
- Repeated data transformations.
- Recursive computations.
- Repeated lookups.

### When Should You Avoid It?

- When the calculation is already cheap.
- When cache invalidation is difficult.
- When the cache can grow without limits.
- When results depend on changing external state.

---

## 5. Avoid Unnecessary Loops and Operations

Consider:

```typescript
const users = [
    { id: 1, name: "John" },
    { id: 2, name: "David" },
    { id: 3, name: "Alex" }
];

const orders = [
    { userId: 1, amount: 500 },
    { userId: 2, amount: 700 },
    { userId: 3, amount: 900 }
];
```

An inefficient approach:

```typescript
for (const user of users) {

    for (const order of orders) {

        if (user.id === order.userId) {

            console.log(user.name, order.amount);

        }

    }

}
```

Time complexity:

```text
O(n × m)
```

A better approach uses a `Map`.

```typescript
const orderMap = new Map(
    orders.map(order => [order.userId, order])
);

for (const user of users) {

    const order = orderMap.get(user.id);

    if (order) {
        console.log(user.name, order.amount);
    }

}
```

Approximate time complexity:

```text
O(n + m)
```

This can be significantly faster for large datasets.

**Important:** Big-O describes growth rate, not exact execution time. Real performance also depends on memory allocation, data size, engine optimizations and workload.

---

## 6. Database Performance Optimization

For backend developers, database optimization is often more important than optimizing small TypeScript expressions.

Suppose:

```typescript
const users = await User.findAll();
```

You have 100,000 users.

But your API only needs:

- ID.
- Name.
- Email.

Fetching every database column is unnecessary.

Better:

```typescript
const users = await User.findAll({
    attributes: [
        "id",
        "name",
        "email"
    ]
});
```

### Important Database Optimization Techniques

| Technique | Purpose |
|---|---|
| Indexing | Speeds up suitable queries |
| Pagination | Limits returned records |
| Query Optimization | Reduces unnecessary database work |
| Connection Pooling | Reuses database connections |
| Caching | Avoids repeated expensive reads |
| Selective Columns | Fetches only required fields |
| Avoid N+1 Queries | Reduces excessive database requests |
| Transactions | Maintains consistency for related operations |

### 6.1 Pagination Example

Without pagination:

```typescript
const users = await User.findAll();
```

With pagination:

```typescript
const users = await User.findAll({
    limit: 20,
    offset: 0
});
```

Here:

- `limit`: Maximum number of records.
- `offset`: Number of records to skip.

For large datasets, cursor-based pagination is often more efficient and stable than large offsets.

### 6.2 Avoid N+1 Query Problems

Suppose you retrieve 100 users and then fetch orders separately for every user.

```typescript
const users = await User.findAll();

for (const user of users) {

    const orders = await Order.findAll({
        where: {
            userId: user.id
        }
    });

}
```

This may generate 101 database queries.

A better approach might use joins or eager loading:

```typescript
const users = await User.findAll({
    include: [
        {
            model: Order
        }
    ]
});
```

The exact syntax depends on the ORM and model associations.

---

# PART 3: TYPESCRIPT COMPILER PERFORMANCE

## 7. What Is Compiler Performance?

As TypeScript projects grow, compilation and type checking can become slower.

For example:

```text
Small Project:
50 TypeScript Files
Compilation: Fast

Large Project:
5,000 TypeScript Files
Compilation: Slower
```

Compiler performance matters in:

- Large applications.
- Monorepos.
- Shared libraries.
- Enterprise projects.

### 7.1 Enable Incremental Compilation

In `tsconfig.json`:

```json
{
    "compilerOptions": {
        "incremental": true
    }
}
```

This allows TypeScript to save information about previous compilations and potentially reduce subsequent build time.

### 7.2 Use Project References

For large projects, split code into separate TypeScript projects.

Example:

```text
project/
│
├── packages/
│   │
│   ├── shared/
│   │   ├── src/
│   │   └── tsconfig.json
│   │
│   ├── backend/
│   │   ├── src/
│   │   └── tsconfig.json
│   │
│   └── frontend/
│       ├── src/
│       └── tsconfig.json
│
└── tsconfig.json
```

Root configuration:

```json
{
    "files": [],
    "references": [
        {
            "path": "./packages/shared"
        },
        {
            "path": "./packages/backend"
        },
        {
            "path": "./packages/frontend"
        }
    ]
}
```

Build:

```bash
npx tsc -b
```

### 7.3 Avoid Excessively Complex Types

Consider:

```typescript
type ComplexType<T> =
    T extends string
        ? string
        : T extends number
            ? number
            : T extends boolean
                ? boolean
                : never;
```

Advanced conditional types are useful, but deeply nested conditional and recursive types can increase type-checking complexity.

Prefer understandable types when possible.

### 7.4 Use Type-Only Imports

```typescript
import type { User } from "./User";
```

Instead of:

```typescript
import { User } from "./User";
```

When only the type is needed, `import type` communicates that clearly and ensures it is erased from emitted JavaScript.

### 7.5 Measure Compiler Performance

Useful commands:

```bash
npx tsc --noEmit --extendedDiagnostics
```

Generate a compiler trace:

```bash
npx tsc --generateTrace trace
```

This helps investigate expensive type-checking operations.

### Important Optimization Techniques

- Use incremental compilation.
- Use project references.
- Avoid unnecessary imports.
- Avoid extremely complex types where simpler types work.
- Keep dependencies under control.
- Separate frontend and backend TypeScript projects when appropriate.
- Measure before optimizing.

---

# PART 4: MEMORY MANAGEMENT

## 8. How JavaScript Memory Management Works

JavaScript automatically manages memory through garbage collection.

You generally do not manually allocate and free memory like you might in C or C++.

However, memory leaks can still occur.

### 8.1 Memory Lifecycle

A simplified memory lifecycle:

```text
Memory Allocation
       |
       v
Object Creation
       |
       v
Object Usage
       |
       v
Object Becomes Unreachable
       |
       v
Garbage Collection
       |
       v
Memory Reclaimed
```

### 8.2 Stack vs Heap

JavaScript engines use memory areas with different responsibilities.

A simplified conceptual model:

**Stack:**

- Function call frames.
- Local execution context information.
- References and primitive values in implementation-dependent ways.

**Heap:**

- Objects.
- Arrays.
- Functions and other dynamically allocated data.

Example:

```typescript
function calculate(): void {

    const age = 25;

    const user = {
        name: "John",
        age: 25
    };

}
```

The exact placement of values is an implementation detail of the JavaScript engine. Do not assume every local variable is physically stored on the stack.

---

## 9. What Is a Memory Leak?

A memory leak occurs when memory is no longer needed but remains reachable and cannot be reclaimed.

Example:

```typescript
const users: User[] = [];

function addUser(user: User): void {

    users.push(user);

}
```

If users are continuously added and never removed, the array grows indefinitely.

This may cause increasing memory usage.

### 9.1 Common Causes of Memory Leaks

1. Unbounded global arrays.
2. Unnecessary object references.
3. Event listeners not removed.
4. Timers not cleared.
5. Caches without expiration or size limits.
6. Long-lived closures retaining large objects.
7. Unclosed resources.

### 9.2 Event Listener Memory Leak

```typescript
function addListener(): void {

    const button = document.getElementById("button");

    button?.addEventListener("click", () => {
        console.log("Clicked");
    });

}
```

If listeners are repeatedly registered, unnecessary references and duplicated behavior may accumulate.

Better:

```typescript
function addListener(): () => void {

    const button = document.getElementById("button");

    const handleClick = (): void => {
        console.log("Clicked");
    };

    button?.addEventListener("click", handleClick);

    return () => {
        button?.removeEventListener("click", handleClick);
    };

}
```

Usage:

```typescript
const cleanup = addListener();

// Later:
cleanup();
```

### 9.3 React useEffect Cleanup

```tsx
import { useEffect } from "react";

function Timer(): null {

    useEffect(() => {

        const timer = setInterval(() => {
            console.log("Running...");
        }, 1000);

        return () => {
            clearInterval(timer);
        };

    }, []);

    return null;

}
```

The cleanup function prevents the interval from continuing after the component is removed.

### 9.4 WeakMap and WeakSet

JavaScript provides:

- `WeakMap`
- `WeakSet`

These collections hold weak references to objects.

Example:

```typescript
const userMetadata = new WeakMap<object, string>();

const user = {
    id: 1,
    name: "John"
};

userMetadata.set(user, "Premium User");

console.log(userMetadata.get(user));
```

A WeakMap does not keep its object keys alive solely because they are keys in the map.

This can be useful for metadata associated with objects.

---

# PART 5: EVENT LOOP AND ASYNCHRONOUS EXECUTION

## 10. Understanding the JavaScript Event Loop

JavaScript is often described as single-threaded at the execution level.

However, JavaScript environments provide mechanisms for asynchronous operations.

For Node.js, important components include:

- Call Stack.
- Event Loop.
- Task Queues.
- Microtask Queue.
- Runtime APIs.
- libuv.

### Simplified Architecture

```text
          JavaScript Code
                 |
                 v
             Call Stack
                 |
                 v
          Event Loop
                 |
        -----------------
        |               |
        v               v
   Microtasks       Task Queues
        |               |
        -----------------
                 |
                 v
             Call Stack
```

This is a simplified illustration. Browser and Node.js event-loop implementations have important differences.

---

## 11. Synchronous vs Asynchronous Code

### Synchronous Example

```typescript
console.log("Start");

console.log("Middle");

console.log("End");
```

Output:

```text
Start
Middle
End
```

Execution happens sequentially.

### Asynchronous Example

```typescript
console.log("Start");

setTimeout(() => {
    console.log("Timeout");
}, 0);

console.log("End");
```

Output:

```text
Start
End
Timeout
```

Why?

The timer callback runs later, after the current synchronous execution completes.

A zero-millisecond timer does not mean immediate execution.

---

## 12. Microtasks vs Macrotasks

Common microtask sources:

- Promise callbacks.
- `queueMicrotask()`.
- MutationObserver callbacks in browsers.

Common task sources include:

- `setTimeout()`.
- `setInterval()`.
- DOM events in browsers.

Node.js also has additional event-loop phases and special behavior for `process.nextTick()`.

Example:

```typescript
console.log("Start");

setTimeout(() => {
    console.log("Timeout");
}, 0);

Promise.resolve().then(() => {
    console.log("Promise");
});

console.log("End");
```

Typical output:

```text
Start
End
Promise
Timeout
```

Why?

1. Synchronous code executes first.
2. Promise callbacks are queued as microtasks.
3. Timer callbacks execute later.

### Important Node.js Detail

`process.nextTick()` has special scheduling behavior and is not simply another Promise microtask.

Excessive recursive use of `process.nextTick()` can starve other event-loop work.

---

# PART 6: CPU-BOUND VS I/O-BOUND OPERATIONS

## 13. What Is an I/O-Bound Operation?

An I/O-bound operation spends significant time waiting for external resources.

Examples:

- Database queries.
- HTTP requests.
- File operations.
- Network communication.

Example:

```typescript
import { readFile } from "node:fs/promises";

async function readData(): Promise<void> {

    const data = await readFile(
        "data.txt",
        "utf-8"
    );

    console.log(data);

}
```

The application can perform other work while waiting for the file operation.

## 14. What Is a CPU-Bound Operation?

A CPU-bound operation requires significant processor computation.

Examples:

- Image processing.
- Video encoding.
- Complex calculations.
- Large data transformations.
- Cryptographic computations.

Example:

```typescript
function calculate(): number {

    let result = 0;

    for (let i = 0; i < 1_000_000_000; i++) {

        result += i;

    }

    return result;

}
```

This operation consumes CPU time.

If executed on Node.js's main JavaScript thread, it blocks that thread.

### Comparison

| Feature | I/O-Bound | CPU-Bound |
|---|---|---|
| Main Bottleneck | External resource waiting | CPU computation |
| Example | Database query | Image processing |
| Async I/O | Often effective | Does not automatically help |
| Worker Threads | Usually unnecessary | Can help |
| Main Thread Blocking | Usually less likely | Common with heavy synchronous work |

**Important:** Making a CPU-heavy function `async` does not automatically make its computation non-blocking.

---

# PART 7: WORKER THREADS

## 15. What Are Worker Threads?

Node.js provides Worker Threads for executing JavaScript in separate threads.

They are useful for CPU-intensive JavaScript operations.

Official documentation: [Node.js Worker Threads Documentation](https://nodejs.org/api/worker_threads.html?utm_source=chatgpt.com)

### 15.1 Main Thread Example

`main.ts`

```typescript
import { Worker } from "node:worker_threads";

const worker = new Worker(
    new URL("./worker.ts", import.meta.url)
);

worker.on("message", (result: number) => {

    console.log("Result:", result);

});

worker.on("error", (error) => {

    console.error("Worker Error:", error);

});

worker.on("exit", (code) => {

    if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
    }

});
```

### 15.2 Worker File

`worker.ts`

```typescript
import { parentPort } from "node:worker_threads";

function calculate(): number {

    let total = 0;

    for (let i = 0; i < 100_000_000; i++) {

        total += i;

    }

    return total;

}

const result = calculate();

parentPort?.postMessage(result);
```

### 15.3 How It Works

```text
Main Thread
     |
     | Creates Worker
     |
     v
Worker Thread
     |
     | Performs CPU Calculation
     |
     v
Sends Result
     |
     v
Main Thread Receives Result
```

### 15.4 Important Worker Thread Events

| Event | Purpose |
|---|---|
| `message` | Receives worker messages |
| `error` | Reports uncaught worker errors |
| `exit` | Indicates worker termination |
| `messageerror` | Reports message deserialization errors |

### When Should You Use Worker Threads?

- Image processing.
- Large calculations.
- CPU-heavy parsing.
- Compression.
- Data transformation.

### When Should You Avoid Them?

- Simple API requests.
- Ordinary database queries.
- Lightweight functions.
- Tasks where worker startup and communication cost exceeds the benefit.

For frequently executed CPU-heavy tasks, a worker pool is generally better than creating a new worker for every request.

---

# PART 8: STREAMS AND BACKPRESSURE

## 16. What Are Streams?

Streams allow applications to process data incrementally instead of loading everything into memory at once.

Consider a 5 GB video file.

A naive approach:

```typescript
import { readFile } from "node:fs/promises";

async function readVideo(): Promise<void> {

    const data = await readFile("video.mp4");

    console.log(data.length);

}
```

This attempts to load the entire file into memory.

A better approach uses streams.

### 16.1 Reading with Streams

```typescript
import { createReadStream } from "node:fs";

const stream = createReadStream("video.mp4");

stream.on("data", (chunk) => {

    console.log("Received chunk:", chunk.length);

});

stream.on("end", () => {

    console.log("File reading completed");

});

stream.on("error", (error) => {

    console.error(error);

});
```

Instead of loading the entire file, Node.js reads it in chunks.

---

## 17. Types of Node.js Streams

There are four major stream types.

| Stream | Purpose |
|---|---|
| Readable | Reads data |
| Writable | Writes data |
| Duplex | Reads and writes data |
| Transform | Reads, modifies and writes data |

Examples:

### Readable

```typescript
import { createReadStream } from "node:fs";

const readable = createReadStream("input.txt");
```

### Writable

```typescript
import { createWriteStream } from "node:fs";

const writable = createWriteStream("output.txt");
```

### Duplex

A network socket can read and write data.

### Transform

A transform stream modifies data as it passes through.

---

## 18. What Is Backpressure?

Backpressure occurs when data is produced faster than it can be consumed.

Example:

```text
Data Producer
      |
      | Produces 100 MB/sec
      |
      v
Data Consumer
      |
      | Processes 10 MB/sec
      |
      v
Problem: Consumer Cannot Keep Up
```

Without proper handling, memory usage can grow.

Streams help manage this flow through buffering and backpressure signals.

### 18.1 Handling Backpressure

For writable streams, `write()` returns `false` when the internal buffer reaches its threshold.

You should wait for the `drain` event before writing more data.

In practice, use `pipeline()` whenever possible because it handles stream flow and error propagation more safely.

```typescript
import {
    createReadStream,
    createWriteStream
} from "node:fs";

import { pipeline } from "node:stream/promises";

async function copyFile(): Promise<void> {

    await pipeline(
        createReadStream("input.txt"),
        createWriteStream("output.txt")
    );

    console.log("File copied successfully");

}

copyFile().catch(console.error);
```

This is generally preferable to manually managing multiple stream events.

---

# PART 9: TYPE-SAFE ENVIRONMENT VARIABLES

## 19. What Are Environment Variables?

Environment variables store configuration outside application source code.

Examples:

```env
PORT=3000

NODE_ENV=production

DATABASE_URL=mysql://user:password@localhost:3306/app

JWT_SECRET=your-secret
```

Access them using:

```typescript
console.log(process.env.PORT);
```

But there is a problem.

In Node.js:

```typescript
process.env.PORT
```

is typed as:

```typescript
string | undefined
```

Why?

Because environment variables may not exist.

---

## 20. Type-Safe Environment Configuration

Avoid accessing `process.env` throughout your application.

Instead, create a centralized configuration module.

`config/env.ts`

```typescript
function getRequiredEnv(key: string): string {

    const value = process.env[key];

    if (!value) {

        throw new Error(
            `Missing required environment variable: ${key}`
        );

    }

    return value;

}

export const env = {

    PORT: Number(process.env.PORT ?? 3000),

    NODE_ENV: process.env.NODE_ENV ?? "development",

    DATABASE_URL: getRequiredEnv("DATABASE_URL"),

    JWT_SECRET: getRequiredEnv("JWT_SECRET")

} as const;
```

Usage:

```typescript
import { env } from "./config/env";

console.log(env.PORT);

console.log(env.NODE_ENV);
```

### 20.1 Better Runtime Validation with Zod

Later in this phase, we will use Zod for runtime validation.

Example:

```typescript
import { z } from "zod";

const envSchema = z.object({

    PORT: z.coerce.number().int().positive().default(3000),

    NODE_ENV: z.enum([
        "development",
        "production",
        "test"
    ]).default("development"),

    DATABASE_URL: z.string().min(1),

    JWT_SECRET: z.string().min(32)

});

export const env = envSchema.parse(process.env);
```

Now your application validates configuration during startup.

### Important Security Rule

Never commit actual secrets to GitHub.

Use:

- Environment variables.
- Deployment platform secrets.
- Secret management services.
- Restricted access policies.

---

# PART 10: APPLICATION CONFIGURATION

## 21. What Is Configuration Management?

Configuration management means organizing application settings in a consistent way.

Example:

```text
src/
│
├── config/
│   ├── env.ts
│   ├── database.ts
│   ├── logger.ts
│   └── app.ts
│
├── controllers/
├── services/
├── routes/
└── server.ts
```

### Why Centralize Configuration?

- Easier maintenance.
- Better testability.
- Fewer duplicated settings.
- Environment-specific behavior.
- Easier validation.

### 21.1 Environment-Specific Configuration

```typescript
type AppEnvironment =
    | "development"
    | "production"
    | "test";

interface AppConfig {
    environment: AppEnvironment;
    port: number;
    enableLogging: boolean;
}

const config: AppConfig = {

    environment: "development",

    port: 3000,

    enableLogging: true

};
```

In a real application, values should be derived from validated environment variables rather than hardcoded.

---

# PART 11: SECURE TYPESCRIPT DEVELOPMENT

## 22. What Is Secure Development?

Secure development means designing applications to protect:

- User information.
- Authentication credentials.
- Database records.
- API endpoints.
- Application infrastructure.
- Business data.

TypeScript improves code correctness but does not automatically make an application secure.

Security requires runtime validation, authorization, secure infrastructure and careful implementation.

### Common Security Risks

| Risk | Description |
|---|---|
| SQL Injection | Malicious SQL input |
| XSS | Injected scripts execute in a browser |
| CSRF | Unauthorized actions through a user's authenticated browser session |
| Broken Authentication | Weak authentication implementation |
| Broken Authorization | Users access resources they should not |
| Brute Force | Repeated credential attempts |
| Sensitive Data Exposure | Secrets or private data become accessible |
| DoS | Application resources become exhausted |

---

# PART 12: INPUT VALIDATION AND SANITIZATION

## 23. What Is Input Validation?

Input validation checks whether incoming data follows expected rules.

Suppose an API accepts:

```json
{
    "name": "John",
    "email": "john@example.com",
    "age": 25
}
```

Expected conditions:

- Name must not be empty.
- Email must have a valid format.
- Age must be a valid positive integer within the application's allowed range.

### 23.1 Manual Validation

```typescript
interface CreateUserRequest {

    name: string;

    email: string;

    age: number;

}

function validateUser(data: CreateUserRequest): boolean {

    if (!data.name.trim()) {
        return false;
    }

    if (!data.email.includes("@")) {
        return false;
    }

    if (!Number.isInteger(data.age) || data.age < 18) {
        return false;
    }

    return true;

}
```

This works for simple cases.

However, large applications require more systematic validation.

---

## 24. Validation vs Sanitization

These are different concepts.

### Validation

Checks whether input is acceptable.

Example:

```text
Email: john@example.com

Valid: Yes
```

### Sanitization

Transforms or cleans input according to the application's requirements.

Example:

```typescript
const name = "  John  ";

const sanitizedName = name.trim();

console.log(sanitizedName);
```

Output:

```text
John
```

### Important Difference

| Validation | Sanitization |
|---|---|
| Checks input | Transforms input |
| Accepts or rejects | Normalizes or cleans |
| Example: Email validation | Example: Trimming whitespace |

Sanitization is not a substitute for context-specific output encoding.

For example, removing a few HTML characters does not reliably prevent XSS. Use safe rendering and appropriate encoding.

---

# PART 13: ZOD WITH TYPESCRIPT

## 25. What Is Zod?

Zod is a schema validation library.

It allows you to define validation schemas and infer TypeScript types from them.

Official documentation: [Zod Documentation](https://zod.dev/?utm_source=chatgpt.com)

Install:

```bash
npm install zod
```

### 25.1 Create a Schema

```typescript
import { z } from "zod";

const userSchema = z.object({

    name: z.string().min(2),

    email: z.string().email(),

    age: z.number().int().min(18)

});
```

### 25.2 Validate Data

```typescript
const user = {

    name: "John",

    email: "john@example.com",

    age: 25

};

const result = userSchema.safeParse(user);

if (result.success) {

    console.log(result.data);

} else {

    console.log(result.error.issues);

}
```

### 25.3 Infer TypeScript Types

Instead of writing the interface manually:

```typescript
interface User {
    name: string;
    email: string;
    age: number;
}
```

You can infer the type:

```typescript
type User = z.infer<typeof userSchema>;
```

Now the schema and TypeScript type remain aligned.

### 25.4 Optional Fields

```typescript
const userSchema = z.object({

    name: z.string(),

    email: z.string().email(),

    age: z.number().optional()

});
```

Here, `age` is optional.

### 25.5 Default Values

```typescript
const userSchema = z.object({

    name: z.string(),

    role: z.string().default("user")

});
```

If `role` is missing, the parsed output receives `"user"`.

### 25.6 Validate Express Request

```typescript
import express from "express";

import { z } from "zod";

const app = express();

app.use(express.json());

const createUserSchema = z.object({

    name: z.string().min(2),

    email: z.string().email(),

    age: z.number().int().min(18)

});

app.post("/api/users", (req, res) => {

    const result = createUserSchema.safeParse(req.body);

    if (!result.success) {

        res.status(400).json({
            success: false,
            errors: result.error.issues
        });

        return;

    }

    const user = result.data;

    res.status(201).json({
        success: true,
        data: user
    });

});
```

Notice:

```typescript
const user = result.data;
```

The parsed data is validated and typed.

**Important:** Zod validation can also transform data. Use the parsed result rather than assuming the original request object has been transformed.

### Why Zod Is Useful

- Runtime validation.
- Type inference.
- Schema reuse.
- API validation.
- Environment validation.
- Form validation.
- Nested object validation.

---

# PART 14: AUTHENTICATION AND AUTHORIZATION

## 26. What Is Authentication?

Authentication verifies who a user is.

Example:

```text
User Enters Credentials
          |
          v
Server Verifies Credentials
          |
          v
Authentication Successful
```

Examples:

- Email and password.
- OTP.
- OAuth login.
- Multi-factor authentication.

## 27. What Is Authorization?

Authorization determines what an authenticated user is allowed to do.

Example:

```text
Admin:
- Create User
- Delete User
- View Users

Normal User:
- View Own Profile
- Update Own Profile
```

### Authentication vs Authorization

| Authentication | Authorization |
|---|---|
| Verifies identity | Verifies permissions |
| Who are you? | What can you access? |
| Login | Access control |
| Happens before protected authorization checks | Applies after identity is established |

---

# PART 15: JWT SECURITY

## 28. What Is JWT?

JWT stands for JSON Web Token.

It is a compact token format commonly used to carry claims between systems.

Official specification: [RFC 7519 – JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519?utm_source=chatgpt.com)

A JWT has three parts:

```text
HEADER.PAYLOAD.SIGNATURE
```

### 28.1 Header

Contains token metadata.

Example:

```json
{
    "alg": "HS256",
    "typ": "JWT"
}
```

### 28.2 Payload

Contains claims.

Example:

```json
{
    "userId": 101,
    "role": "admin"
}
```

### 28.3 Signature

Verifies token integrity and authenticity according to the selected signing algorithm and key.

### Important Security Concept

JWT payloads are generally encoded, not encrypted.

Anyone possessing a normal signed JWT can decode its payload.

Never store:

- Passwords.
- Database credentials.
- Secret API keys.
- Sensitive personal information.

inside a normal JWT payload.

---

## 29. Creating JWT Tokens with TypeScript

Install:

```bash
npm install jsonwebtoken

npm install -D @types/jsonwebtoken
```

Create:

`auth/jwt.ts`

```typescript
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
}

export interface TokenPayload {
    userId: number;
    role: "admin" | "user";
}

export function generateToken(
    payload: TokenPayload
): string {

    return jwt.sign(
        payload,
        JWT_SECRET,
        {
            expiresIn: "15m"
        }
    );

}
```

Verify:

```typescript
export function verifyToken(token: string): TokenPayload {

    const decoded = jwt.verify(
        token,
        JWT_SECRET
    );

    if (
        typeof decoded !== "object" ||
        decoded === null ||
        typeof decoded.userId !== "number" ||
        (decoded.role !== "admin" && decoded.role !== "user")
    ) {
        throw new Error("Invalid token payload");
    }

    return {
        userId: decoded.userId,
        role: decoded.role
    };

}
```

The payload is validated after cryptographic verification.

### 29.1 Important JWT Security Practices

1. Use strong secrets or appropriately managed asymmetric keys.
2. Set token expiration.
3. Validate issuer and audience when applicable.
4. Use an explicit algorithm allowlist.
5. Never trust an unverified payload.
6. Plan token revocation or session invalidation.
7. Protect refresh tokens.
8. Avoid storing sensitive data in the payload.
9. Use HTTPS.
10. Rotate signing keys when required.

### 29.2 Access Token vs Refresh Token

| Access Token | Refresh Token |
|---|---|
| Used to access APIs | Used to obtain new access tokens |
| Short lifetime | Longer lifetime |
| Sent with API requests | Sent to refresh endpoint |
| Limited privileges | Requires strong protection |

A refresh-token system should include rotation, reuse detection and secure storage where appropriate.

---

# PART 16: PASSWORD SECURITY

## 30. How Should Passwords Be Stored?

Never store passwords as plain text.

Incorrect:

```typescript
const user = {
    email: "john@example.com",
    password: "password123"
};
```

If the database is compromised, passwords become immediately exposed.

Instead, store password hashes produced by a dedicated password-hashing algorithm.

Common choices:

- Argon2id.
- bcrypt.
- scrypt.

For new systems, Argon2id is generally a strong choice.

### 30.1 Hashing with bcrypt

Install:

```bash
npm install bcrypt

npm install -D @types/bcrypt
```

Hash:

```typescript
import bcrypt from "bcrypt";

async function hashPassword(
    password: string
): Promise<string> {

    const saltRounds = 12;

    return bcrypt.hash(password, saltRounds);

}
```

Verify:

```typescript
async function verifyPassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {

    return bcrypt.compare(
        password,
        hashedPassword
    );

}
```

### Hashing vs Encryption

| Hashing | Encryption |
|---|---|
| Generally one-way | Reversible with the correct key |
| Used for password storage | Used for protecting data that must be recovered |
| No decryption operation | Decryption is possible |
| Example: bcrypt | Example: AES |

Passwords should generally be hashed, not reversibly encrypted.

---

# PART 17: SECURE API DESIGN

## 31. Important API Security Principles

A secure API should implement:

1. Authentication.
2. Authorization.
3. Input validation.
4. Rate limiting.
5. Secure error handling.
6. HTTPS.
7. Request size limits.
8. Logging and monitoring.
9. Access control.
10. Dependency security.

### 31.1 Validate Every External Input

Never trust:

- Request body.
- Query parameters.
- Route parameters.
- Headers.
- Cookies.
- Uploaded files.

Even when your frontend already validates the data, the backend must validate it independently.

### 31.2 Use DTOs

DTO stands for Data Transfer Object.

A DTO defines the shape of data accepted or returned by an application layer.

Example:

```typescript
export interface CreateUserDTO {

    name: string;

    email: string;

    password: string;

}
```

Avoid passing entire database entities directly into public API responses.

Create a response DTO:

```typescript
export interface UserResponseDTO {

    id: number;

    name: string;

    email: string;

}
```

This prevents accidentally exposing sensitive fields.

---

# PART 18: SQL INJECTION PREVENTION

## 32. What Is SQL Injection?

SQL Injection is a vulnerability in which malicious input changes the meaning of a SQL query.

Consider:

```typescript
const email = req.body.email;

const query = `
    SELECT * FROM users
    WHERE email = '${email}'
`;
```

Suppose the user submits:

```text
' OR '1'='1
```

The resulting query may become:

```sql
SELECT * FROM users
WHERE email = '' OR '1'='1'
```

This can expose unauthorized records.

### 32.1 Use Parameterized Queries

With `mysql2`:

```typescript
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "my_database"
});

const email = "john@example.com";

const [rows] = await connection.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
);
```

The input is passed separately from the SQL query.

This prevents user input from being interpreted as SQL syntax in that parameter position.

### 32.2 Using Sequelize

```typescript
const user = await User.findOne({
    where: {
        email: "john@example.com"
    }
});
```

For raw queries, use replacements or bind parameters.

### Important

Never assume an ORM automatically makes every query safe.

Unsafe raw SQL construction can still introduce SQL injection.

---

# PART 19: XSS AND CSRF

## 33. What Is XSS?

XSS stands for Cross-Site Scripting.

It occurs when an attacker manages to execute malicious scripts in another user's browser.

Example:

```html
<script>
    alert("Hacked");
</script>
```

Suppose an application displays user-provided HTML without proper handling.

Malicious scripts might execute.

### 33.1 XSS Prevention

- Escape untrusted output.
- Use safe DOM APIs.
- Avoid inserting untrusted HTML.
- Sanitize HTML when rich HTML input is required.
- Apply Content Security Policy.
- Keep frontend dependencies updated.

In React:

```tsx
function UserProfile({ name }: { name: string }) {

    return <h1>{name}</h1>;

}
```

React escapes text values by default.

However, this is dangerous:

```tsx
<div
    dangerouslySetInnerHTML={{
        __html: userInput
    }}
/>
```

Only use this with appropriately sanitized HTML and a well-defined trust boundary.

---

## 34. What Is CSRF?

CSRF stands for Cross-Site Request Forgery.

It occurs when an attacker tricks a user's browser into sending an unwanted request to a site where the user is already authenticated.

For example:

A user is logged into a banking website.

An attacker tricks the user into visiting another website that attempts to submit a transaction request.

### CSRF Prevention

- Use appropriate CSRF tokens.
- Configure `SameSite` cookie attributes.
- Use `Secure` and `HttpOnly` cookie attributes where appropriate.
- Validate request origin when appropriate.
- Avoid unsafe state-changing GET endpoints.

**Important:** `SameSite` cookies are useful protection, but they are not a universal replacement for a complete CSRF strategy.

---

# PART 20: CORS AND SECURITY HEADERS

## 35. What Is CORS?

CORS stands for Cross-Origin Resource Sharing.

It is a browser security mechanism controlling whether JavaScript from one origin can access resources from another origin.

An origin consists of:

```text
Scheme + Host + Port
```

Examples:

```text
http://localhost:3000
http://localhost:4000
https://example.com
```

These are different origins.

### 35.1 Enable CORS in Express

Install:

```bash
npm install cors

npm install -D @types/cors
```

Configure:

```typescript
import express from "express";

import cors from "cors";

const app = express();

app.use(cors({
    origin: "https://example.com",
    methods: [
        "GET",
        "POST",
        "PUT",
        "DELETE"
    ],
    credentials: true
}));
```

### Important CORS Rule

If credentials are enabled:

```typescript
credentials: true
```

You cannot use:

```typescript
origin: "*"
```

for credentialed browser requests.

You must configure an explicit allowed origin.

Also, CORS is not authentication or authorization. It does not prevent non-browser clients from calling your API.

---

## 36. What Are Security Headers?

Security headers help browsers apply additional security protections.

A popular Express package is Helmet.

Install:

```bash
npm install helmet
```

Use:

```typescript
import express from "express";

import helmet from "helmet";

const app = express();

app.use(helmet());
```

Helmet configures several security-related HTTP headers.

Examples include:

- Content-Security-Policy.
- X-Content-Type-Options.
- Strict-Transport-Security.
- Referrer-Policy.

Some headers require environment-specific configuration.

Documentation: [Helmet Documentation](https://helmetjs.github.io/?utm_source=chatgpt.com)

---

# PART 21: RATE LIMITING

## 37. What Is Rate Limiting?

Rate limiting controls how frequently a client can make requests.

Example:

```text
Maximum:
100 Requests Per Minute

Client Makes:
150 Requests

Allowed:
100

Rejected:
50
```

It helps protect against:

- Brute-force attempts.
- API abuse.
- Excessive requests.
- Some forms of denial-of-service activity.

### 37.1 Express Rate Limiting

Install:

```bash
npm install express-rate-limit
```

Configure:

```typescript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    limit: 100,

    message: {
        success: false,
        message: "Too many requests"
    }

});

app.use("/api", limiter);
```

### 37.2 Login-Specific Rate Limiting

```typescript
const loginLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    limit: 5,

    message: {
        success: false,
        message: "Too many login attempts"
    }

});

app.use("/api/auth/login", loginLimiter);
```

### Important Production Considerations

If your application runs across multiple server instances, an in-memory rate limiter may not provide consistent global limits.

Use a shared store such as Redis when distributed rate limiting is required.

Also configure trusted proxies carefully. Incorrect proxy configuration can cause incorrect client IP identification.

---

# PART 22: PRODUCTION ERROR HANDLING

## 38. Development vs Production Errors

During development, detailed errors are useful.

Example:

```text
TypeError:
Cannot read properties of undefined

at UserService.getUser()
at UserController.getUser()
```

But returning this information to production clients can expose internal implementation details.

### Development Response

```json
{
    "success": false,
    "message": "Database connection failed",
    "stack": "..."
}
```

### Production Response

```json
{
    "success": false,
    "message": "Internal Server Error"
}
```

### Recommended Error Response Structure

```typescript
interface APIErrorResponse {

    success: false;

    message: string;

    code?: string;

    requestId?: string;

}
```

Example:

```json
{
    "success": false,
    "message": "User not found",
    "code": "USER_NOT_FOUND",
    "requestId": "req_123456"
}
```

### Important Production Rules

- Never expose stack traces.
- Never expose database errors directly.
- Never expose secrets.
- Log internal errors securely.
- Return consistent error formats.
- Use appropriate HTTP status codes.
- Include request IDs for debugging.

---

# PART 23: PERFORMANCE MONITORING

## 39. Monitoring Node.js Applications

A production application should provide visibility into its health.

Useful metrics include:

- CPU usage.
- Memory usage.
- Event-loop delay.
- API latency.
- Request throughput.
- Error rate.
- Database latency.
- Active connections.

### 39.1 Monitor Memory Usage

Node.js provides:

```typescript
const memory = process.memoryUsage();

console.log({
    rss: memory.rss,

    heapTotal: memory.heapTotal,

    heapUsed: memory.heapUsed,

    external: memory.external,

    arrayBuffers: memory.arrayBuffers
});
```

### Understanding Memory Metrics

| Metric | Meaning |
|---|---|
| RSS | Total resident memory used by the process |
| Heap Total | Total allocated V8 heap |
| Heap Used | Currently used V8 heap |
| External | Memory associated with native objects |
| Array Buffers | Memory used by ArrayBuffers and related buffers |

### 39.2 Monitor CPU Usage

```typescript
import os from "node:os";

console.log({
    loadAverage: os.loadavg(),

    cpuCount: os.cpus().length
});
```

`os.loadavg()` is useful on Unix-like systems. Its behavior differs on Windows.

### 39.3 Monitor Event Loop Delay

Node.js provides `monitorEventLoopDelay()`.

```typescript
import {
    monitorEventLoopDelay
} from "node:perf_hooks";

const histogram = monitorEventLoopDelay({
    resolution: 20
});

histogram.enable();

setInterval(() => {

    console.log({
        mean: histogram.mean / 1e6,

        max: histogram.max / 1e6,

        p99: histogram.percentile(99) / 1e6

    });

    histogram.reset();

}, 5000);
```

The values are converted from nanoseconds to milliseconds.

### Popular Monitoring Tools

| Tool | Purpose |
|---|---|
| Prometheus | Metrics collection |
| Grafana | Metrics visualization |
| Sentry | Error tracking |
| OpenTelemetry | Observability instrumentation |
| New Relic | Application performance monitoring |
| Datadog | Infrastructure and application monitoring |

---

# PART 24: SCALABLE APPLICATION ARCHITECTURE

## 40. What Is Scalability?

Scalability is the ability of an application to handle increasing workloads.

Suppose:

```text
Initially:
100 Users

Later:
10,000 Users

Eventually:
1,000,000 Users
```

Your architecture should be capable of handling increased traffic without unacceptable performance degradation.

There are two major scaling approaches.

### 40.1 Vertical Scaling

Increase the resources of a single server.

```text
Before:
2 CPU
4 GB RAM

After:
8 CPU
32 GB RAM
```

Advantages:

- Simple.
- Easy to implement initially.
- Minimal architectural changes.

Disadvantages:

- Hardware limits.
- Higher cost at larger sizes.
- Single-server failure risk remains.

### 40.2 Horizontal Scaling

Add more application instances.

```text
             Load Balancer
                   |
          -------------------
          |        |        |
          v        v        v
       Server 1 Server 2 Server 3
```

Advantages:

- Better capacity growth.
- Improved fault tolerance.
- Flexible scaling.

Disadvantages:

- More operational complexity.
- Shared-state management.
- Distributed coordination.

### Vertical vs Horizontal Scaling

| Feature | Vertical | Horizontal |
|---|---|---|
| Method | Increase server resources | Add servers |
| Complexity | Lower | Higher |
| Hardware Limit | Yes | Less constrained |
| Fault Tolerance | Limited | Can improve |
| Typical Use | Smaller systems | Large distributed systems |

---

# PART 25: STATELESS BACKEND ARCHITECTURE

## 41. What Is a Stateless Application?

A stateless backend does not depend on local server memory to retain important user session state between requests.

Example of a problematic design:

```typescript
const loggedInUsers = new Map<number, User>();
```

If a user logs in to Server 1, the session exists only in Server 1's memory.

The next request might go to Server 2.

Server 2 does not know about that session.

### Better Approach

Store shared state in an external system.

Examples:

- Redis.
- Database.
- Signed access tokens.
- External session stores.

Architecture:

```text
          Load Balancer
                |
       -------------------
       |        |        |
       v        v        v
    Server 1 Server 2 Server 3
       |        |        |
       -------------------
                |
                v
          Shared Redis
                |
                v
             Database
```

This allows application instances to share necessary state.

**Important:** Statelessness does not mean an application has no state. It means important cross-request state is stored or managed independently of a particular application instance.

---

# PART 26: CACHING STRATEGIES

## 42. What Is Caching?

Caching stores frequently accessed data so that future requests can be served faster.

Example:

Suppose an API retrieves product categories from a database on every request.

Instead, you can cache the result.

### 42.1 In-Memory Cache

```typescript
const cache = new Map<string, unknown>();

function setCache(
    key: string,
    value: unknown
): void {

    cache.set(key, value);

}

function getCache<T>(
    key: string
): T | undefined {

    return cache.get(key) as T | undefined;

}
```

This is a simplified example.

It does not include expiration, size limits or cache invalidation.

### 42.2 Redis Cache

Redis is commonly used as a shared cache.

Documentation: [Redis Documentation](https://redis.io/docs/latest/?utm_source=chatgpt.com)

Example architecture:

```text
Client Request
      |
      v
   API Server
      |
      v
   Check Redis
      |
   -----------
   |         |
  Found    Not Found
   |         |
   v         v
Return     Database
Cache         |
              v
          Store in Redis
              |
              v
          Return Result
```

### 42.3 Cache-Aside Pattern

The cache-aside pattern works like this:

1. Check cache.
2. If found, return cached data.
3. If not found, query database.
4. Store result in cache.
5. Return result.

Example:

```typescript
async function getProduct(id: number): Promise<Product> {

    const cacheKey = `product:${id}`;

    const cached = await redis.get(cacheKey);

    if (cached) {
        return JSON.parse(cached) as Product;
    }

    const product = await Product.findByPk(id);

    if (!product) {
        throw new Error("Product not found");
    }

    await redis.set(
        cacheKey,
        JSON.stringify(product),
        {
            EX: 300
        }
    );

    return product;

}
```

This is illustrative; configure the Redis client and serialize ORM results appropriately in a real application.

### Cache Invalidation

One of the hardest caching problems is deciding when cached data becomes outdated.

Common strategies:

- Time-to-live (TTL).
- Explicit invalidation.
- Write-through.
- Write-behind.
- Versioned cache keys.

---

# PART 27: DESIGN PATTERNS

## 43. What Are Design Patterns?

Design patterns are reusable approaches to common software design problems.

They help improve:

- Maintainability.
- Reusability.
- Flexibility.
- Separation of concerns.

### 43.1 Singleton Pattern

Ensures a class has one shared instance within a given application module context.

Example:

```typescript
class Database {

    private static instance: Database;

    private constructor() {}

    static getInstance(): Database {

        if (!Database.instance) {

            Database.instance = new Database();

        }

        return Database.instance;

    }

}

const db1 = Database.getInstance();

const db2 = Database.getInstance();

console.log(db1 === db2);
```

Output:

```text
true
```

Use carefully. A Singleton can make testing and dependency management harder if used excessively.

### 43.2 Factory Pattern

Creates objects without exposing all object-creation details to the caller.

```typescript
interface Notification {
    send(message: string): void;
}

class EmailNotification implements Notification {

    send(message: string): void {

        console.log("Email:", message);

    }

}

class SMSNotification implements Notification {

    send(message: string): void {

        console.log("SMS:", message);

    }

}

class NotificationFactory {

    static create(
        type: "email" | "sms"
    ): Notification {

        if (type === "email") {
            return new EmailNotification();
        }

        return new SMSNotification();

    }

}
```

Usage:

```typescript
const notification = NotificationFactory.create("email");

notification.send("Hello");
```

### 43.3 Strategy Pattern

Allows interchangeable algorithms.

```typescript
interface PaymentStrategy {

    pay(amount: number): void;

}

class CreditCardPayment implements PaymentStrategy {

    pay(amount: number): void {

        console.log("Credit card payment:", amount);

    }

}

class UpiPayment implements PaymentStrategy {

    pay(amount: number): void {

        console.log("UPI payment:", amount);

    }

}

class PaymentService {

    constructor(
        private strategy: PaymentStrategy
    ) {}

    executePayment(amount: number): void {

        this.strategy.pay(amount);

    }

}
```

Usage:

```typescript
const payment = new PaymentService(
    new UpiPayment()
);

payment.executePayment(1000);
```

### 43.4 Repository Pattern

Separates data-access logic from business logic.

```typescript
interface ProductRepository {

    findById(id: number): Promise<Product | null>;

    findAll(): Promise<Product[]>;

}
```

Implementations can use:

- MySQL.
- MongoDB.
- PostgreSQL.
- In-memory storage.

### 43.5 Adapter Pattern

Allows incompatible interfaces to work together.

Example:

You have an external payment gateway with a different method signature.

Your application expects:

```typescript
interface PaymentGateway {

    pay(amount: number): Promise<boolean>;

}
```

An adapter converts the external provider's API into your application's expected interface.

### 43.6 Observer Pattern

Allows multiple subscribers to receive notifications when an event occurs.

Example:

When an order is created:

- Send email.
- Update inventory.
- Send notification.
- Record analytics.

A simplified event-based implementation:

```typescript
type OrderCreatedListener = (orderId: number) => void;

class OrderEventEmitter {

    private listeners: OrderCreatedListener[] = [];

    subscribe(listener: OrderCreatedListener): void {

        this.listeners.push(listener);

    }

    emit(orderId: number): void {

        for (const listener of this.listeners) {

            listener(orderId);

        }

    }

}
```

---

# PART 28: PRODUCTION DEPLOYMENT

## 44. Preparing TypeScript Applications for Production

Development environment:

```text
Source Code
    |
    v
TypeScript Runtime/Compiler
    |
    v
Application Execution
```

Production generally uses compiled JavaScript or a deliberately selected TypeScript runtime.

A common approach is:

```text
TypeScript Source
       |
       v
TypeScript Compiler
       |
       v
JavaScript Output
       |
       v
Node.js Production Runtime
```

### 44.1 Production tsconfig.json

Example:

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",

        "rootDir": "./src",
        "outDir": "./dist",

        "strict": true,

        "esModuleInterop": true,

        "skipLibCheck": true,

        "sourceMap": true,

        "declaration": false,

        "removeComments": true
    },

    "include": [
        "src/**/*.ts"
    ],

    "exclude": [
        "node_modules",
        "tests",
        "dist"
    ]
}
```

This example assumes a Node.js ESM project configured appropriately in `package.json`.

### 44.2 Build Scripts

```json
{
    "scripts": {
        "dev": "tsx watch src/server.ts",
        "build": "tsc",
        "start": "node dist/server.js",
        "typecheck": "tsc --noEmit"
    }
}
```

Install:

```bash
npm install -D typescript tsx
```

Build:

```bash
npm run build
```

Run production application:

```bash
npm start
```

### Important Production Rule

Do not use development tools unnecessarily in production.

Keep production dependencies and development dependencies appropriately separated.

---

# PART 29: DOCKER WITH TYPESCRIPT

## 45. What Is Docker?

Docker is a platform used to package applications and their dependencies into containers.

A container provides a consistent application environment.

Documentation: [Docker Documentation](https://docs.docker.com/?utm_source=chatgpt.com)

### Why Use Docker?

- Consistent environments.
- Easier deployment.
- Dependency isolation.
- Reproducible builds.
- Simplified application packaging.

### 45.1 Create Dockerfile

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

USER node

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

This is a basic multi-stage build.

### Understanding Each Instruction

| Instruction | Purpose |
|---|---|
| `FROM` | Selects base image |
| `WORKDIR` | Sets working directory |
| `COPY` | Copies files |
| `RUN` | Executes commands during image build |
| `ENV` | Defines environment variables |
| `EXPOSE` | Documents the container's listening port |
| `USER` | Selects runtime user |
| `CMD` | Defines default startup command |

### 45.2 Build Docker Image

```bash
docker build -t typescript-api .
```

### 45.3 Run Container

```bash
docker run -p 3000:3000 typescript-api
```

Your application should now be available on port 3000.

### Important Production Considerations

- Do not copy `.env` files containing secrets into images.
- Use a non-root user.
- Use trusted, maintained base images.
- Pin or control dependency versions.
- Keep images small.
- Configure health checks where appropriate.
- Handle graceful shutdown.
- Use container orchestration when required.

---

# PART 30: PRODUCTION BUILD OPTIMIZATION

## 46. What Is Build Optimization?

Build optimization means preparing application output to be efficient and suitable for deployment.

Important techniques include:

### 46.1 Tree Shaking

Tree shaking removes unused code from a bundled application when the bundler can safely determine that code is unused.

It is particularly relevant to frontend bundling.

### 46.2 Minification

Minification reduces code size by removing unnecessary characters and sometimes shortening identifiers.

### 46.3 Code Splitting

Code splitting divides application code into smaller bundles.

This allows some code to load only when required.

### 46.4 Lazy Loading

Lazy loading delays loading a resource until it is needed.

React example:

```tsx
import { lazy, Suspense } from "react";

const Dashboard = lazy(
    () => import("./Dashboard")
);

function App() {

    return (
        <Suspense fallback={<p>Loading...</p>}>

            <Dashboard />

        </Suspense>
    );

}

export default App;
```

### 46.5 Dynamic Imports

```typescript
async function loadReport(): Promise<void> {

    const reportModule = await import("./report");

    reportModule.generateReport();

}
```

This loads the module dynamically when required, subject to the build system's module handling.

### Build Optimization Comparison

| Technique | Purpose |
|---|---|
| Tree Shaking | Remove unused code |
| Minification | Reduce output size |
| Code Splitting | Divide code into chunks |
| Lazy Loading | Load when needed |
| Dynamic Import | Load modules on demand |
| Compression | Reduce network transfer size |

---

# PART 31: REAL-WORLD PRODUCTION ARCHITECTURE

## 47. Designing a Scalable E-Commerce Backend

Now combine the concepts from this phase.

Imagine building an e-commerce platform.

### Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js |
| Backend | Node.js + Express |
| Language | TypeScript |
| Database | MySQL |
| ORM | Sequelize |
| Cache | Redis |
| Authentication | JWT / Secure Sessions |
| Validation | Zod |
| Testing | Vitest + Supertest |
| Logging | Pino |
| Deployment | Docker |
| CI/CD | GitHub Actions |

### 47.1 Architecture

```text
                 CLIENT
                   |
                   v
              NEXT.JS APP
                   |
                   v
              LOAD BALANCER
                   |
          ---------------------
          |         |         |
          v         v         v
       API 1     API 2     API 3
          |         |         |
          ---------------------
                   |
        -----------------------
        |          |          |
        v          v          v
      Redis      MySQL     Message Queue
                   |
                   v
              DATABASE
```

This is a conceptual architecture. A real application may use fewer components initially.

### 47.2 Backend Folder Structure

```text
backend/
│
├── src/
│   │
│   ├── config/
│   │   ├── env.ts
│   │   ├── database.ts
│   │   └── redis.ts
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.schema.ts
│   │   │
│   │   ├── users/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.repository.ts
│   │   │   └── user.schema.ts
│   │   │
│   │   ├── products/
│   │   │   ├── product.controller.ts
│   │   │   ├── product.service.ts
│   │   │   ├── product.repository.ts
│   │   │   └── product.schema.ts
│   │   │
│   │   └── orders/
│   │       ├── order.controller.ts
│   │       ├── order.service.ts
│   │       ├── order.repository.ts
│   │       └── order.schema.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── rateLimit.middleware.ts
│   │
│   ├── utils/
│   │   ├── logger.ts
│   │   └── response.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── tests/
├── Dockerfile
├── package.json
└── tsconfig.json
```

### 47.3 Request Lifecycle

Suppose a user creates an order.

```text
Client
  |
  v
POST /api/orders
  |
  v
Rate Limiting
  |
  v
Authentication
  |
  v
Authorization
  |
  v
Request Validation
  |
  v
Order Controller
  |
  v
Order Service
  |
  v
Database Transaction
  |
  v
Order Repository
  |
  v
Database
  |
  v
Response
```

### 47.4 Important Production Practices

**Security**

- Validate every request.
- Authenticate users.
- Enforce authorization.
- Hash passwords.
- Protect secrets.
- Use HTTPS.
- Apply rate limiting.

**Performance**

- Optimize database queries.
- Use pagination.
- Cache suitable data.
- Avoid unnecessary computations.
- Monitor event-loop delay.

**Reliability**

- Use database transactions.
- Implement consistent error handling.
- Log application failures.
- Add health checks.
- Test critical workflows.

**Scalability**

- Keep application instances stateless where practical.
- Use shared caching.
- Use background jobs for long-running work.
- Scale application instances horizontally when needed.

---

# PART 32: COMMON PRODUCTION MISTAKES

## 48. Mistakes Developers Should Avoid

| Mistake | Better Approach |
|---|---|
| Assuming TypeScript validates API data | Use runtime validation |
| Blocking Node.js with heavy CPU work | Use worker threads or separate workers |
| Loading huge files entirely into memory | Use streams |
| Keeping unlimited in-memory caches | Use TTL and size limits |
| Fetching every database record | Use pagination |
| Building SQL with string concatenation | Use parameterized queries |
| Storing plain-text passwords | Use password hashing |
| Putting secrets in source code | Use secret management |
| Trusting JWT payload without verification | Verify signature and claims |
| Exposing production stack traces | Return safe error responses |
| Using wildcard CORS with credentials | Configure explicit allowed origins |
| Relying only on frontend validation | Validate on backend |
| Using local session memory with multiple servers | Use shared session storage |
| Running as root in containers | Use a non-root user |
| Ignoring monitoring | Collect logs, metrics and traces |
| Optimizing without measurement | Profile and benchmark first |

---

# PART 33: INTERVIEW QUESTIONS AND ANSWERS

## 49. Performance and Runtime Questions

### Q1. Does TypeScript run directly in the browser or Node.js?

Typically, TypeScript is compiled or transformed into JavaScript before execution. Some runtimes and development tools can execute TypeScript through built-in or integrated transformation support.

### Q2. Does TypeScript improve runtime performance?

Not automatically. TypeScript mainly provides compile-time type checking. Runtime performance depends on the generated JavaScript, runtime engine and application implementation.

### Q3. What is memoization?

Memoization stores previously calculated results to avoid repeating expensive computations.

### Q4. What is Big-O notation?

Big-O describes how an algorithm's time or space requirements grow as input size increases.

### Q5. What is compiler performance?

Compiler performance refers to the time and resources required to parse, type-check and compile a project.

### Q6. What is incremental compilation?

Incremental compilation reuses information from previous compilation runs to reduce subsequent build time.

### Q7. What is memory management?

Memory management is the process of allocating, using and reclaiming memory during application execution.

### Q8. What is garbage collection?

Garbage collection automatically reclaims memory occupied by objects that are no longer reachable.

### Q9. What is a memory leak?

A memory leak occurs when unnecessary objects remain reachable and therefore cannot be reclaimed.

### Q10. What is the JavaScript event loop?

The event loop coordinates execution of queued callbacks and asynchronous operations around the JavaScript execution stack.

### Q11. What is the difference between microtasks and tasks?

Microtasks include Promise callbacks and `queueMicrotask()` callbacks. Tasks include timer callbacks and many event callbacks. Their scheduling behavior depends on the runtime.

### Q12. What is the difference between CPU-bound and I/O-bound operations?

CPU-bound operations require significant computation, while I/O-bound operations spend substantial time waiting for external resources.

### Q13. What are Worker Threads?

Worker Threads allow Node.js applications to execute JavaScript in separate threads.

### Q14. What are streams?

Streams allow applications to process data incrementally instead of loading everything into memory.

### Q15. What is backpressure?

Backpressure is a mechanism for controlling data flow when a consumer cannot process data as quickly as a producer generates it.

---

## 50. Security Questions

### Q16. What is runtime validation?

Runtime validation checks actual data during application execution to ensure it follows expected rules.

### Q17. What is Zod?

Zod is a TypeScript-first schema validation library that supports runtime validation and TypeScript type inference.

### Q18. What is authentication?

Authentication verifies a user's identity.

### Q19. What is authorization?

Authorization determines which resources or operations an authenticated user can access.

### Q20. What is JWT?

JWT is a compact token format used to represent claims between parties.

### Q21. Is JWT encrypted?

A typical signed JWT is not encrypted. Its payload can be decoded by anyone who has the token.

### Q22. What is the difference between access and refresh tokens?

Access tokens authorize API access, while refresh tokens are used to obtain new access tokens.

### Q23. How should passwords be stored?

Passwords should be stored using a dedicated password-hashing algorithm such as Argon2id, bcrypt or scrypt.

### Q24. What is SQL injection?

SQL injection is a vulnerability that allows malicious input to alter the meaning of a SQL query.

### Q25. How can SQL injection be prevented?

Use parameterized queries, safe ORM methods and careful handling of dynamic SQL identifiers.

### Q26. What is XSS?

Cross-Site Scripting is a vulnerability that allows malicious scripts to execute in another user's browser.

### Q27. What is CSRF?

Cross-Site Request Forgery tricks an authenticated user's browser into making unwanted requests.

### Q28. What is CORS?

Cross-Origin Resource Sharing is a browser security mechanism that controls cross-origin resource access.

### Q29. Does CORS provide authentication?

No. CORS is not an authentication or authorization mechanism.

### Q30. What is rate limiting?

Rate limiting restricts how many requests a client can make within a specified period.

---

## 51. Architecture and Deployment Questions

### Q31. What is scalability?

Scalability is the ability of a system to handle increasing workloads.

### Q32. What is vertical scaling?

Vertical scaling increases the resources of an existing server.

### Q33. What is horizontal scaling?

Horizontal scaling adds additional application instances or servers.

### Q34. What is a stateless backend?

A stateless backend does not depend on one particular application instance's local memory to preserve important cross-request state.

### Q35. What is caching?

Caching stores frequently accessed data so it can be retrieved more quickly.

### Q36. What is cache invalidation?

Cache invalidation is the process of removing or updating cached data when it becomes outdated.

### Q37. What is the Repository Pattern?

The Repository Pattern separates data-access logic from business logic.

### Q38. What is the Strategy Pattern?

The Strategy Pattern allows interchangeable algorithms or behaviors to be selected at runtime.

### Q39. What is Docker?

Docker is a platform for building and running containerized applications.

### Q40. What is a multi-stage Docker build?

A multi-stage build uses multiple build stages so that the final image contains only the runtime artifacts and dependencies needed for execution.

---

# PART 34: PRACTICAL EXERCISES

## 52. Beginner-Level Exercises

**Exercise 1: Type-Safe Environment Configuration**

Create a configuration module that validates:

- PORT.
- NODE_ENV.
- DATABASE_URL.
- JWT_SECRET.

Use Zod.

**Exercise 2: Memoization**

Create a generic memoization utility and test it with multiple inputs.

**Exercise 3: Memory Management**

Create a browser event listener and implement a cleanup function.

**Exercise 4: Event Loop**

Write a program combining:

- `console.log()`.
- `setTimeout()`.
- `Promise.resolve()`.
- `queueMicrotask()`.

Predict the execution order before running it.

---

## 53. Intermediate-Level Exercises

**Exercise 5: Worker Threads**

Create a CPU-intensive calculation and execute it using Worker Threads.

**Exercise 6: File Streaming**

Create an application that copies a large file using streams.

**Exercise 7: Zod Validation**

Create a user registration schema with:

- Name.
- Email.
- Password.
- Age.
- Phone number.

Validate incoming data.

**Exercise 8: Secure Express API**

Implement:

- Helmet.
- CORS.
- Rate limiting.
- Request validation.
- Centralized error handling.

**Exercise 9: JWT Authentication**

Create:

- Login.
- Access token.
- Token verification.
- Authentication middleware.
- Protected route.

---

## 54. Advanced-Level Exercises

**Exercise 10: Role-Based Access Control**

Implement:

```text
Admin
Manager
User
```

Each role should have different permissions.

**Exercise 11: SQL Injection Prevention**

Create an Express API using MySQL and implement parameterized queries.

**Exercise 12: Redis Caching**

Cache product data using Redis.

Implement:

- Cache lookup.
- Database fallback.
- Cache storage.
- TTL.
- Cache invalidation.

**Exercise 13: Production Docker Setup**

Create a multi-stage Dockerfile for your TypeScript backend.

**Exercise 14: Scalable Architecture**

Design a backend that supports:

- Multiple application instances.
- Redis.
- MySQL.
- Centralized logging.
- Rate limiting.
- JWT authentication.

**Exercise 15: Complete Production Project**

Build a production-oriented e-commerce backend with:

- User authentication.
- Product management.
- Shopping cart.
- Order management.
- Payment integration.
- Runtime validation.
- Testing.
- Docker.
- CI/CD.

---

# PART 35: PHASE 43 COMPLETION CHECKLIST

## 55. Knowledge Checklist

| No. | Topic | Status |
|---|---|---|
| 1 | TypeScript and JavaScript Runtime | ☐ |
| 2 | Compile-Time vs Runtime Safety | ☐ |
| 3 | Performance Optimization | ☐ |
| 4 | Memoization | ☐ |
| 5 | Algorithm Optimization | ☐ |
| 6 | Database Performance | ☐ |
| 7 | Compiler Performance | ☐ |
| 8 | Incremental Compilation | ☐ |
| 9 | Memory Management | ☐ |
| 10 | Memory Leaks | ☐ |
| 11 | WeakMap and WeakSet | ☐ |
| 12 | JavaScript Event Loop | ☐ |
| 13 | Microtasks and Tasks | ☐ |
| 14 | CPU-Bound vs I/O-Bound | ☐ |
| 15 | Worker Threads | ☐ |
| 16 | Streams | ☐ |
| 17 | Backpressure | ☐ |
| 18 | Environment Variables | ☐ |
| 19 | Configuration Management | ☐ |
| 20 | Runtime Input Validation | ☐ |
| 21 | Zod | ☐ |
| 22 | Authentication | ☐ |
| 23 | Authorization | ☐ |
| 24 | JWT | ☐ |
| 25 | Password Hashing | ☐ |
| 26 | Secure API Design | ☐ |
| 27 | SQL Injection Prevention | ☐ |
| 28 | XSS Prevention | ☐ |
| 29 | CSRF Prevention | ☐ |
| 30 | CORS | ☐ |
| 31 | Security Headers | ☐ |
| 32 | Rate Limiting | ☐ |
| 33 | Production Error Handling | ☐ |
| 34 | Performance Monitoring | ☐ |
| 35 | Scalability | ☐ |
| 36 | Stateless Architecture | ☐ |
| 37 | Caching | ☐ |
| 38 | Design Patterns | ☐ |
| 39 | Production Deployment | ☐ |
| 40 | Docker | ☐ |
| 41 | Build Optimization | ☐ |
| 42 | Production Architecture | ☐ |

---

# PHASE 43 COMPLETED

You have now covered the major concepts required to develop production-oriented TypeScript applications.

You should understand how to:

- Optimize TypeScript and Node.js applications.
- Manage memory and asynchronous execution.
- Use Worker Threads and streams.
- Validate external data.
- Implement secure authentication and authorization.
- Protect APIs against common vulnerabilities.
- Design scalable backend architectures.
- Implement caching and monitoring.
- Deploy TypeScript applications using Docker.

## Next Phase: Phase 44

**Advanced TypeScript – Architecture, Design Patterns, SOLID Principles and Enterprise Application Development**

Upcoming topics:

1. Software Architecture Fundamentals.
2. SOLID Principles.
3. Single Responsibility Principle.
4. Open/Closed Principle.
5. Liskov Substitution Principle.
6. Interface Segregation Principle.
7. Dependency Inversion Principle.
8. Clean Architecture.
9. Hexagonal Architecture.
10. Onion Architecture.
11. Domain-Driven Design (DDD).
12. Domain Models and Entities.
13. Value Objects.
14. Aggregates and Aggregate Roots.
15. Domain Services.
16. Application Services.
17. Repository Pattern in Depth.
18. Unit of Work Pattern.
19. Factory and Abstract Factory.
20. Builder Pattern.
21. Strategy Pattern.
22. Observer Pattern.
23. Adapter Pattern.
24. Decorator Pattern.
25. Command Pattern.
26. CQRS.
27. Event-Driven Architecture.
28. Dependency Injection Containers.
29. Modular Monolith Architecture.
30. Microservices Fundamentals.
31. TypeScript Monorepos.
32. Enterprise Project Structure.
33. Real-World Enterprise Application.

**When you're ready, say: `OK, Phase 44`.**