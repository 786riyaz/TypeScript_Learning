# Phase 60: Advanced TypeScript – Performance Engineering, Profiling, Memory Management, Event Loop Optimization, Worker Threads, Streams, Caching, Database Optimization and Production Monitoring

**Level:** Expert / Advanced Performance Engineering  
**Prerequisites:** TypeScript, JavaScript, Node.js, Express.js, asynchronous programming, databases, Redis and system design.

---

# 1. Learning Objectives

By the end of this phase, you will understand how to:

1. Measure and analyze application performance.
2. Understand Node.js event loop internals.
3. Identify CPU-bound and I/O-bound operations.
4. Understand memory management and garbage collection.
5. Detect and fix memory leaks.
6. Profile CPU and memory usage.
7. Use Worker Threads for CPU-intensive operations.
8. Understand Child Processes and Cluster.
9. Implement efficient streams and backpressure.
10. Optimize asynchronous operations.
11. Optimize database queries and connection pools.
12. Implement Redis caching strategies.
13. Understand HTTP caching and CDN optimization.
14. Implement batch processing and queue-based processing.
15. Perform load testing and benchmarking.
16. Monitor production performance using APM and observability tools.

---

# 2. Performance Engineering Fundamentals

## 2.1 What Is Performance Engineering?

Performance engineering is the process of designing, measuring, analyzing and optimizing an application to ensure it performs efficiently under expected workloads.

Consider an Expense Tracker API.

A user sends:

```http
GET /api/expenses
```

The API performs:

1. Authentication.
2. Database query.
3. Data processing.
4. JSON serialization.
5. HTTP response.

If the API takes 5 seconds to respond, users experience poor performance.

Performance engineering helps identify which operation causes the delay.

### Important Performance Metrics

| Metric | Meaning |
|---|---|
| Latency | Time required to complete one operation |
| Throughput | Number of operations completed per unit of time |
| Concurrency | Number of operations being processed simultaneously |
| RPS | Requests per second |
| QPS | Queries per second |
| CPU Usage | Percentage of CPU resources being used |
| Memory Usage | Amount of memory consumed |
| Error Rate | Percentage of failed operations |
| p50 | 50th percentile response time |
| p95 | 95th percentile response time |
| p99 | 99th percentile response time |

## 2.2 Latency vs Throughput

These are two different performance measurements.

### Latency

Latency measures how long one request takes.

Example:

```text
Request A: 100 ms
Request B: 200 ms
Request C: 150 ms
```

Average latency:

```text
(100 + 200 + 150) / 3 = 150 ms
```

### Throughput

Throughput measures how many requests an application can complete within a given period.

Example:

```text
Application completes 500 requests per second.
```

Therefore:

- Latency measures response time.
- Throughput measures processing capacity.

An application can have high throughput but still have high latency.

## 2.3 Understanding Percentiles

Suppose an API handles 1,000 requests.

Its response-time measurements are:

| Percentile | Response Time |
|---|---:|
| p50 | 100 ms |
| p75 | 180 ms |
| p90 | 250 ms |
| p95 | 400 ms |
| p99 | 1,200 ms |

Interpretation:

- 50% of requests completed within 100 ms.
- 95% completed within 400 ms.
- 99% completed within 1,200 ms.

**Why are p95 and p99 important?**

Average response time can hide slow requests.

For example:

```text
Most requests: 100 ms
Some requests: 5,000 ms
```

The average might look acceptable even though some users experience extremely slow responses.

Production performance monitoring should pay attention to p95 and p99.

## 2.4 CPU-Bound vs I/O-Bound Operations

This is one of the most important concepts in Node.js performance engineering.

### CPU-Bound Operations

An operation is CPU-bound when it requires substantial processor computation.

Examples:

- Image processing.
- Video encoding.
- Complex mathematical calculations.
- Large JSON transformations.
- Encryption and compression.
- Machine learning inference.

Example:

```typescript
function calculateFactorial(number: number): number {
  if (number <= 1) {
    return 1;
  }

  return number * calculateFactorial(number - 1);
}

console.log(calculateFactorial(10));
```

This is a computational operation.

Large CPU-intensive operations can block Node.js's main JavaScript thread.

### I/O-Bound Operations

An operation is I/O-bound when it spends most of its time waiting for external resources.

Examples:

- Database queries.
- HTTP requests.
- File reading.
- Network communication.
- Redis operations.

Example:

```typescript
import fs from "node:fs/promises";

async function readFile() {
  const data = await fs.readFile("data.txt", "utf-8");

  console.log(data);
}

readFile();
```

The application waits for file I/O instead of continuously executing JavaScript instructions.

### Comparison

| CPU-Bound | I/O-Bound |
|---|---|
| Heavy computation | Waiting for external operations |
| Uses significant CPU | Often spends time waiting |
| Can block the event loop | Often handled asynchronously |
| Worker Threads can help | Async APIs are generally appropriate |
| Example: image processing | Example: database query |

**Important:** Not every asynchronous operation is automatically non-blocking internally. Some operations use libuv's thread pool, while others rely on operating-system facilities.

---

# 3. Node.js Event Loop Deep Dive

## 3.1 What Is the Event Loop?

Node.js uses an event-driven architecture.

JavaScript normally executes on one main thread per Node.js process.

The event loop allows Node.js to handle asynchronous operations without creating a separate JavaScript thread for every request.

Consider:

```typescript
console.log("Start");

setTimeout(() => {
  console.log("Timer");
}, 1000);

console.log("End");
```

Output:

```text
Start
End
Timer
```

Why?

1. `Start` executes.
2. The timer is registered.
3. `End` executes.
4. The timer callback executes when it becomes eligible to run.

The event loop coordinates callback execution.

## 3.2 Event Loop Architecture

Conceptually:

```text
              JavaScript Code
                     |
                     v
             Call Stack
                     |
                     v
              Node.js APIs
                     |
                     v
                libuv
                     |
                     v
               Event Loop
                     |
          +----------+----------+
          |          |          |
          v          v          v
        Timers     Poll       Check
          |          |          |
          +----------+----------+
                     |
                     v
               Callbacks
```

This is a simplified conceptual representation, not a complete diagram of Node.js internals.

## 3.3 Event Loop Phases

Node.js event loop has several important phases.

| Phase | Purpose |
|---|---|
| Timers | Executes eligible `setTimeout()` and `setInterval()` callbacks |
| Pending Callbacks | Executes certain deferred system-level callbacks |
| Idle / Prepare | Internal operations |
| Poll | Retrieves and processes I/O events |
| Check | Executes `setImmediate()` callbacks |
| Close Callbacks | Executes close-related callbacks |

### 1. Timers Phase

Handles callbacks scheduled using:

```typescript
setTimeout(() => {
  console.log("Timeout");
}, 1000);
```

And:

```typescript
setInterval(() => {
  console.log("Interval");
}, 1000);
```

The specified delay is a minimum threshold, not a guaranteed execution time.

### 2. Pending Callbacks Phase

Handles certain I/O callbacks deferred from previous event loop iterations.

### 3. Idle and Prepare

These phases are primarily used internally by Node.js and libuv.

### 4. Poll Phase

The poll phase is responsible for processing many I/O-related callbacks.

For example:

```typescript
import fs from "node:fs";

fs.readFile("data.txt", () => {
  console.log("File reading completed");
});
```

The callback is processed through the event loop's I/O handling.

### 5. Check Phase

Executes callbacks scheduled through:

```typescript
setImmediate(() => {
  console.log("Immediate callback");
});
```

### 6. Close Callbacks Phase

Handles certain close events.

Example:

```typescript
socket.on("close", () => {
  console.log("Socket closed");
});
```

## 3.4 Microtasks and Macrotasks

JavaScript has different callback scheduling mechanisms.

### Microtasks

Examples:

- Promise callbacks.
- `queueMicrotask()`.
- `process.nextTick()` uses a separate Node.js next-tick queue.

Example:

```typescript
console.log("Start");

Promise.resolve().then(() => {
  console.log("Promise");
});

queueMicrotask(() => {
  console.log("Microtask");
});

console.log("End");
```

Typical output:

```text
Start
End
Promise
Microtask
```

### Macrotask-Style Scheduling

Common examples include:

- `setTimeout()`
- `setInterval()`
- `setImmediate()`
- I/O callbacks

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

### Understanding process.nextTick()

Node.js provides:

```typescript
process.nextTick(() => {
  console.log("Next Tick");
});
```

Example:

```typescript
console.log("Start");

Promise.resolve().then(() => {
  console.log("Promise");
});

process.nextTick(() => {
  console.log("Next Tick");
});

console.log("End");
```

Typical output in CommonJS:

```text
Start
End
Next Tick
Promise
```

The next-tick queue is generally processed before the Promise microtask queue at Node.js callback boundaries.

However, ordering can differ depending on whether code runs in CommonJS, ES modules, or inside a particular event-loop callback.

**Important:** Excessive recursive use of `process.nextTick()` can starve the event loop.

## 3.5 setTimeout() vs setImmediate()

| setTimeout() | setImmediate() |
|---|---|
| Executes after a minimum timer threshold | Executes in the check phase |
| Timer-based scheduling | Check-phase scheduling |
| Timing depends on event loop state | Often useful after I/O callbacks |

Example:

```typescript
setTimeout(() => {
  console.log("Timeout");
}, 0);

setImmediate(() => {
  console.log("Immediate");
});
```

Do not assume one always executes first when scheduled from the main module. The ordering can depend on event-loop timing.

Inside an I/O callback, `setImmediate()` generally runs before a zero-delay timer scheduled in the same callback.

## 3.6 Blocking vs Non-Blocking Code

Consider:

```typescript
import fs from "node:fs";

console.log("Start");

const data = fs.readFileSync("data.txt", "utf-8");

console.log(data);

console.log("End");
```

`readFileSync()` blocks the JavaScript thread until the operation finishes.

Now consider:

```typescript
import fs from "node:fs";

console.log("Start");

fs.readFile("data.txt", "utf-8", (error, data) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log(data);
});

console.log("End");
```

The second version allows JavaScript to continue executing while file reading is in progress.

**Production rule:** Avoid synchronous I/O operations inside request handlers because they can block other requests handled by the same process.

---

# 4. libuv Thread Pool

Node.js uses libuv to provide event-loop and asynchronous I/O functionality.

Some operations use the libuv thread pool.

Examples include:

- Certain filesystem operations.
- DNS lookup through `dns.lookup()`.
- Some cryptographic operations.
- Compression operations using zlib.

The default libuv thread pool size is generally four threads.

You can configure it using:

```bash
UV_THREADPOOL_SIZE=8 node dist/server.js
```

On Windows CMD:

```cmd
set UV_THREADPOOL_SIZE=8
node dist/server.js
```

### Important Distinction

Do not confuse:

1. The Node.js event loop.
2. The libuv thread pool.
3. Worker Threads.

They serve different purposes.

| Component | Purpose |
|---|---|
| Event Loop | Coordinates asynchronous callbacks |
| libuv Thread Pool | Handles certain operations outside the main JavaScript thread |
| Worker Threads | Execute JavaScript in separate threads |

Increasing the libuv thread pool size does not automatically improve every application.

Measure the workload before changing it.

---

# 5. Memory Management in Node.js

## 5.1 What Is Memory Management?

Memory management is the process of allocating, using and releasing memory during application execution.

Consider:

```typescript
const user = {
  name: "John",
  age: 25,
};
```

JavaScript allocates memory to store the object.

When an object is no longer reachable, garbage collection can reclaim its memory.

## 5.2 Stack vs Heap Memory

JavaScript runtime memory is commonly explained using two broad concepts.

### Stack

The stack stores function execution information and local execution context.

Example:

```typescript
function calculate() {
  const number = 10;

  return number * 2;
}

calculate();
```

### Heap

The heap stores dynamically allocated objects and other data structures.

Example:

```typescript
const user = {
  name: "John",
  age: 25,
};
```

Simplified representation:

```text
Stack
+----------------------+
| calculate() context  |
| number = 10          |
+----------------------+

Heap
+----------------------+
| User Object          |
| name: John           |
| age: 25              |
+----------------------+
```

This is a conceptual model. Actual V8 memory management is more sophisticated.

## 5.3 V8 Garbage Collection

Node.js uses the V8 JavaScript engine.

V8 automatically manages JavaScript memory through garbage collection.

One important principle is reachability.

An object can be collected when it is no longer reachable from relevant roots.

### Generational Garbage Collection

V8 uses generational memory management.

Conceptually, objects are grouped by age.

| Generation | Description |
|---|---|
| Young Generation | Newly allocated objects |
| Old Generation | Objects that survive garbage collection |

Young objects are generally collected more frequently.

Objects that survive multiple collection cycles may be promoted to the old generation.

### Example

```typescript
function createUser() {
  const user = {
    name: "John",
  };

  return user;
}

let result = createUser();
```

The returned object remains reachable through `result`.

Now:

```typescript
result = null;
```

If no other references exist, the object becomes eligible for garbage collection.

**Important:** Setting a variable to `null` does not force immediate garbage collection.

## 5.4 Monitoring Memory Usage

Node.js provides:

```typescript
console.log(process.memoryUsage());
```

Example output:

```typescript
{
  rss: 85000000,
  heapTotal: 50000000,
  heapUsed: 30000000,
  external: 2000000,
  arrayBuffers: 1000000
}
```

Important properties:

| Property | Meaning |
|---|---|
| rss | Total resident memory used by the process |
| heapTotal | Total V8 heap memory allocated |
| heapUsed | V8 heap memory currently used |
| external | Memory associated with native objects |
| arrayBuffers | Memory used by ArrayBuffers and related buffers |

RSS includes more than the V8 heap.

Therefore, an application can have relatively low `heapUsed` while still consuming substantial memory.

---

# 6. Memory Leaks

## 6.1 What Is a Memory Leak?

A memory leak occurs when an application unnecessarily retains memory that it no longer needs.

Example:

```typescript
const users: unknown[] = [];

function addUser(user: unknown) {
  users.push(user);
}
```

If users are continuously added without removing old entries, the array keeps growing.

This can cause increasing memory consumption.

## 6.2 Common Causes of Memory Leaks

### 1. Unnecessary Global References

```typescript
const cache: Record<string, unknown> = {};

function storeData(key: string, value: unknown) {
  cache[key] = value;
}
```

If the cache grows indefinitely, memory usage can increase continuously.

Solution: Use bounded caching with eviction and expiration.

### 2. Unremoved Event Listeners

```typescript
import { EventEmitter } from "node:events";

const emitter = new EventEmitter();

function handleEvent() {
  console.log("Event received");
}

emitter.on("data", handleEvent);
```

If listeners are no longer required, remove them:

```typescript
emitter.off("data", handleEvent);
```

### 3. Uncleaned Timers

```typescript
const timer = setInterval(() => {
  console.log("Running");
}, 1000);
```

Stop the timer when it is no longer required:

```typescript
clearInterval(timer);
```

### 4. Closures Retaining Large Objects

```typescript
function createHandler() {
  const largeData = new Array(1000000).fill("data");

  return () => {
    console.log(largeData.length);
  };
}

const handler = createHandler();
```

The returned closure retains access to `largeData`.

This is not inherently a leak, but it can become one if the closure is retained longer than necessary.

## 6.3 Detecting Memory Leaks

Useful approaches:

1. Monitor RSS and heap usage over time.
2. Capture heap snapshots.
3. Inspect retained objects.
4. Monitor garbage collection behavior.
5. Run controlled load tests.
6. Compare memory usage before and after workloads.

### Heap Snapshot

Run:

```bash
node --inspect dist/server.js
```

Then:

1. Open Chrome.
2. Navigate to `chrome://inspect`.
3. Connect to the Node.js process.
4. Open the Memory tab.
5. Capture a heap snapshot.
6. Inspect objects retaining memory.

You can also generate snapshots using Node.js diagnostic facilities.

**Production warning:** Heap snapshots can temporarily consume significant memory and pause the application. Capture them carefully.

---

# 7. CPU Profiling

## 7.1 What Is CPU Profiling?

CPU profiling helps identify which functions consume the most CPU time.

Consider:

```typescript
function heavyCalculation() {
  let total = 0;

  for (let i = 0; i < 100000000; i++) {
    total += i;
  }

  return total;
}

heavyCalculation();
```

This function consumes substantial CPU time.

Profiling helps identify it as a performance bottleneck.

## 7.2 CPU Profiling with Node.js

Node.js supports CPU profiling through:

```bash
node --cpu-prof dist/server.js
```

The process generates a CPU profile file when it exits.

You can inspect the profile using Chrome DevTools.

### Using the Inspector

```bash
node --inspect dist/server.js
```

Then:

1. Open `chrome://inspect`.
2. Select the Node.js process.
3. Open the Profiler section.
4. Start CPU profiling.
5. Execute the workload.
6. Stop profiling.
7. Inspect the results.

## 7.3 Understanding Flame Graphs

A flame graph visualizes where CPU time is spent.

Example:

```text
Request Handler
|
+-- Validate Request
|
+-- Calculate Report
|   |
|   +-- calculateTotal()
|   |
|   +-- sortTransactions()
|
+-- Generate Response
```

If `sortTransactions()` consumes most of the CPU time, it may be the function that needs optimization.

**Important:** Profile representative workloads. Optimizing a function that consumes almost no production CPU time rarely produces meaningful improvements.

---

# 8. Worker Threads

## 8.1 What Are Worker Threads?

Worker Threads allow Node.js to execute JavaScript in separate threads.

They are particularly useful for CPU-intensive operations.

Without Worker Threads, a heavy JavaScript computation can block the main event loop.

With Worker Threads, the computation can run separately.

## 8.2 Worker Threads Architecture

```text
             Main Thread
                 |
                 |
          Worker Thread
                 |
          Heavy Calculation
                 |
                 |
           Return Result
```

## 8.3 Basic Worker Thread Example

Create two files.

### worker.ts

```typescript
import { parentPort, workerData } from "node:worker_threads";

function calculateSum(limit: number): number {
  let total = 0;

  for (let i = 0; i <= limit; i++) {
    total += i;
  }

  return total;
}

const result = calculateSum(workerData);

parentPort?.postMessage(result);
```

### main.ts

```typescript
import { Worker } from "node:worker_threads";
import path from "node:path";

function runWorker(limit: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      path.join(__dirname, "worker.js"),
      {
        workerData: limit,
      }
    );

    worker.on("message", (result: number) => {
      resolve(result);
    });

    worker.on("error", reject);

    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with code ${code}`));
      }
    });
  });
}

async function main() {
  const result = await runWorker(100000000);

  console.log("Result:", result);
}

main();
```

This example assumes the TypeScript files are compiled into corresponding JavaScript files and that the worker path is correct.

The worker performs the computation separately from the main JavaScript thread.

## 8.4 When Should You Use Worker Threads?

Good use cases:

- Image processing.
- Large mathematical calculations.
- Data transformation.
- CPU-intensive parsing.
- Encryption workloads.
- Complex report generation.

Poor use cases:

- Simple database queries.
- Normal HTTP requests.
- Small calculations.
- Operations already handled efficiently through asynchronous APIs.

Worker creation has overhead. Creating a new worker for every tiny operation is usually inefficient.

## 8.5 Worker Pools

Instead of creating workers repeatedly, maintain a pool of reusable workers.

Example architecture:

```text
               Main Thread
                    |
                    v
                Worker Pool
              /     |      \
             v      v       v
          Worker  Worker  Worker
             |      |       |
             v      v       v
          Task 1  Task 2  Task 3
```

Libraries such as Piscina can help implement worker pools.

Official documentation:

[Piscina GitHub Repository](https://github.com/piscinajs/piscina?utm_source=chatgpt.com)

## 8.6 SharedArrayBuffer and Atomics

Worker Threads can communicate through messages.

For certain workloads, they can also share memory using `SharedArrayBuffer`.

Example:

```typescript
const sharedBuffer = new SharedArrayBuffer(4);

const sharedArray = new Int32Array(sharedBuffer);
```

Multiple threads can access the shared memory.

However, concurrent modifications require synchronization.

JavaScript provides `Atomics`:

```typescript
Atomics.add(sharedArray, 0, 1);
```

This performs an atomic addition.

Use shared memory carefully because race conditions and synchronization errors can make applications difficult to debug.

---

# 9. Child Processes

## 9.1 What Is a Child Process?

A child process is a separate operating-system process started by another process.

Node.js provides the `child_process` module.

It is useful when you need to:

- Execute external commands.
- Run separate applications.
- Isolate workloads.
- Communicate with another process.
- Run CPU-intensive work in another process.

## 9.2 Important Child Process Methods

| Method | Description |
|---|---|
| `spawn()` | Starts a process and streams its output |
| `exec()` | Executes a command through a shell and buffers output |
| `fork()` | Starts another Node.js process with IPC support |
| `execFile()` | Executes a specific executable without a shell by default |

### Example: spawn()

```typescript
import { spawn } from "node:child_process";

const process = spawn(
  "node",
  ["--version"],
  {
    shell: false,
  }
);

process.stdout.on("data", (data) => {
  console.log(`Output: ${data}`);
});

process.stderr.on("data", (data) => {
  console.error(`Error: ${data}`);
});

process.on("close", (code) => {
  console.log("Process exited:", code);
});
```

### Worker Threads vs Child Processes

| Worker Threads | Child Processes |
|---|---|
| Separate JavaScript threads | Separate OS processes |
| Share process-level resources | Separate process memory |
| Can share memory explicitly | Usually communicate through IPC |
| Lower isolation | Stronger process isolation |
| Good for CPU-heavy JavaScript | Good for external programs and process isolation |

**Security consideration:** Avoid interpolating untrusted user input into shell commands. Prefer fixed executables, argument arrays and `shell: false`.

---

# 10. Cluster Module

## 10.1 What Is the Cluster Module?

The Cluster module allows Node.js to create multiple processes that can share a server port.

Each worker is a separate Node.js process.

Example:

```typescript
import cluster from "node:cluster";
import os from "node:os";
import http from "node:http";

if (cluster.isPrimary) {
  const cpuCount = os.availableParallelism();

  console.log(`Primary process: ${process.pid}`);

  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }
} else {
  const server = http.createServer((req, res) => {
    res.end(`Worker Process: ${process.pid}`);
  });

  server.listen(3000);
}
```

### Architecture

```text
                Primary Process
                       |
          +------------+------------+
          |            |            |
          v            v            v
       Worker 1     Worker 2     Worker 3
          |            |            |
          v            v            v
       Server       Server       Server
          |            |            |
          +------------+------------+
                       |
                   Port 3000
```

### Why Use Cluster?

A single Node.js process generally executes JavaScript on one main thread.

Cluster allows an application to use multiple processes and better utilize multiple CPU cores.

### Important Considerations

Multiple processes do not automatically share memory.

Therefore:

- Use Redis for shared cache.
- Use a shared database for persistent state.
- Use shared session storage when necessary.
- Handle graceful shutdown.
- Monitor worker failures.
- Consider sticky sessions when required by your networking architecture.

In modern production environments, containers, orchestration platforms and process managers are also common scaling approaches.

---

# 11. Streams in Node.js

## 11.1 What Are Streams?

Streams allow applications to process data incrementally instead of loading everything into memory.

Consider reading a 5 GB file.

### Without Streams

```typescript
import fs from "node:fs";

const data = fs.readFileSync("large-file.txt");

console.log(data.length);
```

The entire file is loaded into memory.

This can cause memory pressure.

### With Streams

```typescript
import fs from "node:fs";

const stream = fs.createReadStream("large-file.txt");

stream.on("data", (chunk) => {
  console.log("Chunk size:", chunk.length);
});

stream.on("end", () => {
  console.log("File completed");
});

stream.on("error", (error) => {
  console.error(error);
});
```

The file is processed in chunks.

## 11.2 Types of Streams

Node.js has four primary stream types.

| Stream | Description |
|---|---|
| Readable | Reads data |
| Writable | Writes data |
| Duplex | Reads and writes data |
| Transform | Reads data, transforms it and writes output |

### Readable Stream

```typescript
import fs from "node:fs";

const readable = fs.createReadStream("input.txt");
```

### Writable Stream

```typescript
import fs from "node:fs";

const writable = fs.createWriteStream("output.txt");
```

### Duplex Stream

A TCP socket is an example of a Duplex stream because it supports both reading and writing.

### Transform Stream

Example:

```typescript
import {
  Transform,
} from "node:stream";

const uppercaseStream = new Transform({
  transform(chunk, encoding, callback) {
    callback(
      null,
      chunk.toString().toUpperCase()
    );
  },
});
```

This transforms incoming text into uppercase text.

## 11.3 Stream Pipeline

The `pipeline()` utility connects streams and handles errors more safely than manually wiring multiple streams.

```typescript
import fs from "node:fs";
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";

async function compressFile() {
  await pipeline(
    fs.createReadStream("input.txt"),
    createGzip(),
    fs.createWriteStream("input.txt.gz")
  );

  console.log("Compression completed");
}

compressFile().catch(console.error);
```

The pipeline is:

```text
input.txt
    |
    v
Readable Stream
    |
    v
Gzip Transform
    |
    v
Writable Stream
    |
    v
input.txt.gz
```

## 11.4 What Is Backpressure?

Backpressure occurs when data is produced faster than it can be consumed.

Example:

```text
Producer Speed: 100 MB/s

Consumer Speed: 10 MB/s
```

If the producer continues generating data without considering the consumer, memory usage can increase.

Backpressure allows the producer to slow down when the consumer cannot keep up.

### Understanding highWaterMark

Streams use a buffering threshold called `highWaterMark`.

Example:

```typescript
import fs from "node:fs";

const stream = fs.createReadStream(
  "large-file.txt",
  {
    highWaterMark: 64 * 1024,
  }
);
```

Here:

```text
64 * 1024 = 64 KB
```

This sets the stream's buffering threshold in bytes for this binary stream.

It does not guarantee that the stream will always allocate exactly 64 KB.

### Important Writable Stream Concept

When writing manually:

```typescript
const canContinue = writable.write(data);
```

If `write()` returns `false`, stop writing until the stream emits `drain`.

The `pipeline()` utility generally handles this coordination for you.

---

# 12. Buffer Management

## 12.1 What Is a Buffer?

A Buffer is a Node.js object used to work with binary data.

Examples:

- Images.
- PDFs.
- Videos.
- Audio.
- Network packets.
- File contents.

Example:

```typescript
const buffer = Buffer.from("Hello World");

console.log(buffer);
```

Output:

```text
<Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>
```

## 12.2 Buffer vs String

| Buffer | String |
|---|---|
| Represents binary data | Represents text |
| Uses bytes | Uses characters |
| Useful for files and network data | Useful for textual content |
| Supports encoding conversions | Uses Unicode string representation |

Example:

```typescript
const buffer = Buffer.from("Hello");

const text = buffer.toString("utf-8");

console.log(text);
```

## 12.3 Buffer Optimization

Avoid unnecessary copies when processing large binary data.

Example:

```typescript
const buffer = Buffer.from("Hello World");

const view = buffer.subarray(0, 5);

console.log(view.toString());
```

`subarray()` creates a view over the existing memory rather than copying the selected bytes.

However, this means the view can retain the original backing memory.

If a small view is retained for a long time, it may keep a much larger underlying allocation alive.

Use copying when independent ownership is required:

```typescript
const independentBuffer = Buffer.from(view);
```

---

# 13. Asynchronous Performance Optimization

## 13.1 Avoid Unnecessary Sequential Await

Consider:

```typescript
async function getDashboard() {
  const user = await getUser();

  const expenses = await getExpenses();

  const categories = await getCategories();

  return {
    user,
    expenses,
    categories,
  };
}
```

The operations execute sequentially.

If they are independent, this creates unnecessary waiting.

### Better Approach

```typescript
async function getDashboard() {
  const [
    user,
    expenses,
    categories,
  ] = await Promise.all([
    getUser(),
    getExpenses(),
    getCategories(),
  ]);

  return {
    user,
    expenses,
    categories,
  };
}
```

Now the operations run concurrently.

**Important:** `Promise.all()` rejects when one of its promises rejects. It does not automatically cancel the other operations.

## 13.2 Promise.all vs Promise.allSettled

| Promise.all | Promise.allSettled |
|---|---|
| Rejects when a promise rejects | Waits for every promise to settle |
| Useful when all results are required | Useful for independent operations |
| Returns successful results together | Returns success/failure status for each |

Example:

```typescript
const results = await Promise.allSettled([
  getUser(),
  getExpenses(),
  getCategories(),
]);

console.log(results);
```

## 13.3 Avoid Unbounded Concurrency

Consider:

```typescript
const results = await Promise.all(
  users.map((user) => sendEmail(user))
);
```

If there are 100,000 users, this may create too many concurrent operations.

Problems:

- Memory pressure.
- Database connection exhaustion.
- API rate limits.
- Network overload.

### Use Concurrency Control

A library such as `p-limit` can limit concurrent operations.

[p-limit GitHub Repository](https://github.com/sindresorhus/p-limit?utm_source=chatgpt.com)

Example:

```typescript
import pLimit from "p-limit";

const limit = pLimit(10);

const results = await Promise.all(
  users.map((user) =>
    limit(() => sendEmail(user))
  )
);
```

Now a maximum of 10 operations run concurrently through this limiter.

## 13.4 Cancellation with AbortController

Some asynchronous operations should be cancelled when no longer needed.

Example:

```typescript
const controller = new AbortController();

setTimeout(() => {
  controller.abort();
}, 3000);

try {
  const response = await fetch(
    "https://example.com/api/data",
    {
      signal: controller.signal,
    }
  );

  const data = await response.json();

  console.log(data);
} catch (error) {
  if ((error as Error).name === "AbortError") {
    console.log("Request cancelled");
  } else {
    console.error(error);
  }
}
```

This helps prevent unnecessary work.

---

# 14. Database Query Optimization

Database performance is often one of the biggest factors affecting backend application performance.

## 14.1 Avoid SELECT *

Poor query:

```sql
SELECT *
FROM expenses;
```

This retrieves every column.

Better:

```sql
SELECT
    id,
    amount,
    category,
    created_at
FROM expenses;
```

Retrieve only the fields required by the application.

## 14.2 Use Indexes

Suppose:

```sql
SELECT *
FROM expenses
WHERE user_id = 101;
```

Without a suitable index, the database may scan many rows.

Create an index:

```sql
CREATE INDEX idx_expenses_user_id
ON expenses(user_id);
```

The database can use the index to locate matching records more efficiently.

However, indexes also introduce costs:

- Additional storage.
- Slower writes in some cases.
- Maintenance overhead.

Create indexes based on actual query patterns.

## 14.3 Avoid N+1 Queries

Suppose you retrieve 100 users.

Then you execute one additional query for each user to retrieve their expenses.

```typescript
const users = await User.findAll();

for (const user of users) {
  const expenses = await Expense.findAll({
    where: {
      userId: user.id,
    },
  });
}
```

This can execute:

```text
1 query for users
100 queries for expenses

Total: 101 queries
```

This is the N+1 query problem.

### Better Approach: Eager Loading

Using Sequelize:

```typescript
const users = await User.findAll({
  include: [
    {
      model: Expense,
    },
  ],
});
```

This can reduce database round trips.

The actual SQL generated depends on your model associations and query configuration.

## 14.4 Use Pagination

Poor approach:

```typescript
const expenses = await Expense.findAll();
```

This could retrieve millions of records.

Better:

```typescript
const expenses = await Expense.findAll({
  limit: 20,
  offset: 0,
});
```

Pagination prevents unnecessarily large result sets.

## 14.5 Use Database Query Plans

For MySQL:

```sql
EXPLAIN
SELECT *
FROM expenses
WHERE user_id = 101;
```

This helps inspect how MySQL plans to execute the query.

Depending on the MySQL version, `EXPLAIN ANALYZE` can also provide actual execution information.

Use query plans to identify:

- Full table scans.
- Index usage.
- Join strategies.
- Estimated rows.
- Actual execution behavior.

## 14.6 Connection Pool Optimization

Creating a new database connection for every request is inefficient.

Instead, use a connection pool.

Example with Sequelize:

```typescript
const sequelize = new Sequelize(
  "expense_tracker",
  "root",
  "password",
  {
    host: "localhost",
    dialect: "mysql",

    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
  }
);
```

### Connection Pool Properties

| Property | Meaning |
|---|---|
| max | Maximum number of connections |
| min | Minimum number of connections |
| acquire | Maximum time to wait for a connection |
| idle | Time before an unused connection can be released |

**Important:** Pool limits apply per application process.

For example:

```text
5 application instances
× 10 maximum connections

= 50 potential database connections
```

Your total pool capacity must be compatible with database connection limits.

## 14.7 Avoid Long-Running Transactions

Transactions can hold locks and database connections.

Example:

```typescript
const transaction = await sequelize.transaction();

try {
  await Expense.create(
    {
      amount: 1000,
      category: "Food",
    },
    {
      transaction,
    }
  );

  await transaction.commit();
} catch (error) {
  await transaction.rollback();

  throw error;
}
```

Keep transactions as short as practical.

Avoid unnecessary external HTTP requests inside database transactions because they can keep locks and connections occupied for too long.

---

# 15. Redis Caching Strategies

## 15.1 What Is Caching?

Caching stores frequently accessed data in a faster storage layer to reduce repeated expensive operations.

Example:

```text
Client
  |
  v
Node.js API
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
       Store in Redis
           |
           v
       Return Data
```

Redis is frequently used as an in-memory caching system.

## 15.2 Cache-Aside Pattern

Cache-aside is a commonly used caching strategy.

Steps:

1. Check whether the data exists in Redis.
2. If found, return it.
3. If missing, query the database.
4. Store the result in Redis.
5. Return the result.

Example:

```typescript
async function getUser(userId: number) {
  const cacheKey = `user:${userId}`;

  const cachedUser = await redis.get(cacheKey);

  if (cachedUser) {
    return JSON.parse(cachedUser);
  }

  const user = await User.findByPk(userId);

  if (!user) {
    return null;
  }

  await redis.set(
    cacheKey,
    JSON.stringify(user),
    "EX",
    300
  );

  return user;
}
```

The cache expiration is 300 seconds.

The exact Redis client API varies by library.

## 15.3 Cache Invalidation

Suppose a user updates their profile.

The cached profile may now be outdated.

One solution is to invalidate the cache after updating the database.

```typescript
async function updateUser(
  userId: number,
  name: string
) {
  await User.update(
    {
      name,
    },
    {
      where: {
        id: userId,
      },
    }
  );

  await redis.del(`user:${userId}`);
}
```

The next request loads the updated data from the database.

## 15.4 TTL

TTL means Time To Live.

It determines how long cached data remains valid.

Example:

```typescript
await redis.set(
  "dashboard:101",
  JSON.stringify(data),
  "EX",
  60
);
```

The cache expires after 60 seconds.

## 15.5 Cache Stampede

A cache stampede occurs when many requests simultaneously experience a cache miss and query the database.

Example:

```text
Cache expires
     |
     v
1000 requests arrive
     |
     v
1000 database queries
```

Possible solutions:

- Request coalescing.
- Distributed locking where appropriate.
- Background refresh.
- TTL jitter.
- Stale-while-revalidate strategies.

### TTL Jitter

Instead of giving every cache entry the exact same expiration time, add a random variation.

```typescript
const baseTTL = 300;

const jitter = Math.floor(
  Math.random() * 60
);

const ttl = baseTTL + jitter;
```

This helps distribute cache expirations over time.

## 15.6 Cache Key Design

Good cache keys should be predictable and unambiguous.

Examples:

```text
user:101
user:101:profile
expenses:user:101
expenses:user:101:page:1
dashboard:user:101
```

Include relevant filters, pagination and tenant identifiers where necessary.

Never accidentally share personalized cached data between different users.

---

# 16. HTTP Caching

HTTP caching allows browsers, proxies and CDNs to reuse previously retrieved responses.

## 16.1 Cache-Control

Example:

```http
Cache-Control: public, max-age=3600
```

This allows shared caches to store the response for up to one hour, subject to HTTP caching rules.

Important directives:

| Directive | Meaning |
|---|---|
| public | Response may be stored by shared caches |
| private | Response is intended for private caches |
| no-cache | Stored response must be revalidated before reuse |
| no-store | Response should not be stored |
| max-age | Maximum freshness lifetime in seconds |
| s-maxage | Freshness lifetime for shared caches |

**Important:** `no-cache` does not mean the response cannot be stored. Use `no-store` when storage itself should be prevented.

For sensitive personalized responses, an appropriate policy might be:

```http
Cache-Control: private, no-store
```

## 16.2 ETag

An ETag identifies a particular version of a resource.

Example response:

```http
HTTP/1.1 200 OK
ETag: "abc123"
```

The client later sends:

```http
If-None-Match: "abc123"
```

If the resource has not changed, the server can respond:

```http
HTTP/1.1 304 Not Modified
```

This avoids transferring the complete response body again.

## 16.3 Last-Modified

A server can provide:

```http
Last-Modified: Wed, 25 Nov 2026 10:00:00 GMT
```

The client can later send:

```http
If-Modified-Since: Wed, 25 Nov 2026 10:00:00 GMT
```

The server checks whether the resource has changed since that time.

---

# 17. CDN Optimization

## 17.1 What Is a CDN?

CDN stands for Content Delivery Network.

A CDN distributes cached content across geographically distributed edge servers.

Examples include:

- Cloudflare.
- AWS CloudFront.
- Akamai.

### Without CDN

```text
User in India
      |
      v
Server in USA
      |
      v
Response
```

### With CDN

```text
User in India
      |
      v
Nearby CDN Edge
      |
      v
Cached Content
```

If the content is cached at the nearby edge, the CDN can respond without contacting the origin server.

## 17.2 What Should You Cache on a CDN?

Common examples:

- Images.
- CSS.
- JavaScript bundles.
- Fonts.
- Videos.
- Public static documents.

Avoid publicly caching sensitive user-specific responses.

## 17.3 Cache-Control for Static Assets

For versioned assets:

```http
Cache-Control: public, max-age=31536000, immutable
```

This is appropriate when the asset URL changes whenever its content changes.

For example:

```text
app.a8f31c.js
app.9d2e11.js
```

Different content receives a different URL.

---

# 18. Compression

Compression reduces the amount of data transferred over the network.

Common algorithms:

| Algorithm | Description |
|---|---|
| gzip | Widely supported compression |
| Brotli | Often provides better compression for web content |
| Deflate | Older compression format |

Example using Express:

```typescript
import express from "express";
import compression from "compression";

const app = express();

app.use(compression());

app.get("/api/data", (req, res) => {
  res.json({
    message: "Compressed response",
  });
});

app.listen(3000);
```

Install:

```bash
npm install compression
npm install -D @types/compression
```

### Compression Trade-offs

Benefits:

- Smaller response payloads.
- Reduced network transfer.
- Faster responses on bandwidth-constrained connections.

Costs:

- CPU usage.
- Additional processing time.
- Potentially limited benefits for already-compressed files.

Avoid compressing tiny responses unnecessarily.

Also avoid double compression when a proxy or CDN already handles compression.

---

# 19. Lazy Loading

## 19.1 What Is Lazy Loading?

Lazy loading means loading resources only when they are needed.

In backend development, it can mean delaying the loading of modules or expensive data.

### Dynamic Import

```typescript
async function generateReport() {
  const reportModule = await import("./report");

  return reportModule.generateReport();
}
```

The module is loaded when the function executes.

### Lazy Data Loading

Instead of loading every transaction immediately:

```typescript
const expenses = await Expense.findAll({
  where: {
    userId: 101,
  },
  limit: 20,
});
```

Load only the data required by the current operation.

### Benefits

- Reduced initial work.
- Lower memory consumption in some workloads.
- Faster startup in suitable architectures.
- Better resource utilization.

Lazy loading is useful, but excessive lazy-loading can introduce additional latency during the first access.

---

# 20. Pagination Optimization

Pagination is essential when dealing with large datasets.

There are two major approaches.

## 20.1 Offset-Based Pagination

Example:

```sql
SELECT *
FROM expenses
ORDER BY id
LIMIT 20 OFFSET 40;
```

This retrieves the next 20 records after skipping 40 records.

### Sequelize Example

```typescript
const expenses = await Expense.findAll({
  limit: 20,
  offset: 40,
  order: [["id", "ASC"]],
});
```

### Advantages

- Simple implementation.
- Easy page-number navigation.
- Suitable for relatively small datasets.

### Disadvantages

- Large offsets can become expensive.
- Inserts and deletes can shift page boundaries.
- The database may need to scan or skip many records.

## 20.2 Cursor-Based Pagination

Cursor-based pagination uses a value from the last returned record to determine where the next page starts.

Example:

```sql
SELECT *
FROM expenses
WHERE id > 100
ORDER BY id ASC
LIMIT 20;
```

The next request uses the last returned ID as the cursor.

### Sequelize Example

```typescript
const expenses = await Expense.findAll({
  where: {
    id: {
      [Op.gt]: lastId,
    },
  },
  limit: 20,
  order: [["id", "ASC"]],
});
```

You need to import `Op`:

```typescript
import { Op } from "sequelize";
```

### Comparison

| Offset Pagination | Cursor Pagination |
|---|---|
| Uses offset | Uses cursor |
| Easy page navigation | Efficient for sequential navigation |
| Large offsets can be expensive | Often better for large datasets |
| More sensitive to shifting records | Can provide more stable traversal |
| Good for small datasets | Good for feeds and large datasets |

**Important:** Cursor pagination should use a stable, deterministic ordering. If sorting by a non-unique field such as `createdAt`, use a unique secondary key such as `id`.

---

# 21. Batch Processing

## 21.1 What Is Batch Processing?

Batch processing means processing multiple records together instead of processing each record through a separate operation.

Example:

You need to insert 10,000 expenses.

### Individual Inserts

```typescript
for (const expense of expenses) {
  await Expense.create(expense);
}
```

This can create many database round trips.

### Bulk Insert

```typescript
await Expense.bulkCreate(expenses);
```

This can significantly reduce the number of database operations.

### Batch Processing Architecture

```text
10,000 Records
      |
      v
Divide Into Batches
      |
      +------+
      |      |
      v      v
   Batch 1 Batch 2
      |      |
      v      v
  Database Database
```

Example:

```typescript
async function processBatches<T>(
  records: T[],
  batchSize: number
) {
  for (
    let i = 0;
    i < records.length;
    i += batchSize
  ) {
    const batch = records.slice(
      i,
      i + batchSize
    );

    await Expense.bulkCreate(batch);
  }
}
```

### Why Use Batches?

- Reduces database round trips.
- Controls memory consumption.
- Improves processing efficiency.
- Makes large workloads easier to manage.

Batch size should be chosen based on database limits, row size, transaction behavior and workload measurements.

---

# 22. Queue-Based Processing

## 22.1 What Is a Message Queue?

A message queue allows applications to process tasks asynchronously.

Consider an application where users upload resumes.

After uploading, the application must:

1. Read the resume.
2. Extract text.
3. Parse information.
4. Store extracted data.
5. Generate a report.

Performing all these tasks inside the HTTP request may cause long response times.

Instead, use a background queue.

### Architecture

```text
              Client
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
       +--------+--------+
       |        |        |
       v        v        v
     Parse   Extract   Database
    Resume    Data      Save
```

The API can return:

```json
{
  "message": "Resume processing started",
  "jobId": "job_123"
}
```

The client can check job status later.

## 22.2 BullMQ

BullMQ is a Redis-based queue library for Node.js.

Official documentation:

[BullMQ Documentation](https://docs.bullmq.io/?utm_source=chatgpt.com)

Install:

```bash
npm install bullmq ioredis
```

### Producer

```typescript
import { Queue } from "bullmq";

const connection = {
  host: "localhost",
  port: 6379,
};

const resumeQueue = new Queue(
  "resume-processing",
  {
    connection,
  }
);

async function addResumeJob() {
  const job = await resumeQueue.add(
    "parse-resume",
    {
      resumeId: 101,
      filePath: "uploads/resume.pdf",
    }
  );

  console.log("Job ID:", job.id);
}

addResumeJob();
```

### Consumer

```typescript
import { Worker } from "bullmq";

const worker = new Worker(
  "resume-processing",
  async (job) => {
    console.log("Processing:", job.data);

    // Perform resume parsing here.

    return {
      status: "completed",
      resumeId: job.data.resumeId,
    };
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(
    `Job ${job?.id} failed:`,
    error.message
  );
});
```

## 22.3 Important Queue Concepts

| Concept | Meaning |
|---|---|
| Producer | Adds jobs to a queue |
| Consumer/Worker | Processes jobs |
| Retry | Attempts failed jobs again |
| Delay | Schedules jobs for later |
| Concurrency | Number of jobs processed simultaneously |
| Dead Letter Queue | Holds jobs that repeatedly fail |
| Idempotency | Ensures repeated processing does not cause incorrect duplicate effects |

### Why Is Idempotency Important?

Suppose a payment-processing job runs twice.

Without idempotency, the customer might be charged twice.

A robust system uses an idempotency key or unique transaction reference to prevent duplicate effects.

Retries should be designed carefully, particularly for operations that modify external systems.

---

# 23. Load Testing

## 23.1 What Is Load Testing?

Load testing measures how an application behaves under a specified workload.

For example:

```text
100 concurrent users
500 concurrent users
1,000 concurrent users
```

You can measure:

- Response time.
- Throughput.
- CPU usage.
- Memory usage.
- Error rate.
- Database performance.

## 23.2 Types of Performance Testing

| Test | Purpose |
|---|---|
| Load Testing | Test expected workload |
| Stress Testing | Find system limits |
| Spike Testing | Test sudden traffic increases |
| Soak Testing | Test sustained workload over time |
| Scalability Testing | Evaluate behavior as resources or load increase |
| Capacity Testing | Determine maximum sustainable workload |

## 23.3 Popular Load Testing Tools

### 1. k6

[Grafana k6 Documentation](https://grafana.com/docs/k6/latest/?utm_source=chatgpt.com)

### 2. Artillery

[Artillery Documentation](https://www.artillery.io/docs?utm_source=chatgpt.com)

### 3. Autocannon

[Autocannon GitHub Repository](https://github.com/mcollina/autocannon?utm_source=chatgpt.com)

## 23.4 Load Testing with Autocannon

Install:

```bash
npm install -D autocannon
```

Run:

```bash
npx autocannon -c 100 -d 30 http://localhost:3000
```

Parameters:

| Parameter | Meaning |
|---|---|
| `-c 100` | 100 concurrent connections |
| `-d 30` | Run test for 30 seconds |

Example:

```text
Running 30s test

100 connections

Requests/sec: 1500
Latency:
  Average: 65 ms
  p95: 120 ms
  p99: 250 ms
```

These are illustrative numbers, not guaranteed performance.

**Important:** Load-test only systems you own or are explicitly authorized to test. Use realistic workloads and avoid overwhelming production services.

---

# 24. Benchmarking

## 24.1 What Is Benchmarking?

Benchmarking measures the performance of a specific operation or system.

Example:

Compare two functions.

```typescript
function methodOne(numbers: number[]) {
  return numbers.map((number) => number * 2);
}

function methodTwo(numbers: number[]) {
  const result: number[] = [];

  for (const number of numbers) {
    result.push(number * 2);
  }

  return result;
}
```

Benchmarking helps compare their execution time under controlled conditions.

## 24.2 Using performance.now()

Node.js provides the Performance API.

```typescript
import { performance } from "node:perf_hooks";

const start = performance.now();

let total = 0;

for (let i = 0; i < 10000000; i++) {
  total += i;
}

const end = performance.now();

console.log(`Execution time: ${end - start} ms`);
```

### Important Benchmarking Rules

1. Run multiple iterations.
2. Warm up the JavaScript engine.
3. Use realistic data.
4. Avoid measuring unrelated work.
5. Compare equivalent workloads.
6. Consider garbage collection effects.
7. Measure more than one metric.

A microbenchmark does not necessarily represent real application performance.

---

# 25. Event Loop Monitoring

Event loop delay indicates how late event-loop callbacks are running relative to their expected scheduling.

Node.js provides `monitorEventLoopDelay()`.

Example:

```typescript
import {
  monitorEventLoopDelay,
} from "node:perf_hooks";

const histogram = monitorEventLoopDelay({
  resolution: 20,
});

histogram.enable();

setInterval(() => {
  console.log({
    min: histogram.min / 1e6,
    max: histogram.max / 1e6,
    mean: histogram.mean / 1e6,
    p95: histogram.percentile(95) / 1e6,
    p99: histogram.percentile(99) / 1e6,
  });

  histogram.reset();
}, 5000);
```

The values are converted from nanoseconds to milliseconds.

High event-loop delay may indicate:

- CPU-heavy JavaScript.
- Blocking synchronous operations.
- Excessive garbage collection pauses.
- Event-loop starvation.

This is an important production monitoring metric for Node.js applications.

---

# 26. Performance Monitoring and APM

## 26.1 What Is APM?

APM stands for Application Performance Monitoring.

APM tools help monitor application performance in production.

They can track:

- Request latency.
- Database query duration.
- Error rates.
- External API latency.
- CPU usage.
- Memory usage.
- Distributed traces.

## 26.2 Popular APM and Monitoring Tools

| Tool | Purpose |
|---|---|
| OpenTelemetry | Vendor-neutral observability instrumentation |
| Prometheus | Metrics collection |
| Grafana | Monitoring dashboards |
| Datadog | Application monitoring |
| New Relic | Application performance monitoring |
| Elastic APM | Application performance monitoring |

Useful documentation:

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/?utm_source=chatgpt.com)
- [Prometheus Documentation](https://prometheus.io/docs/introduction/overview/?utm_source=chatgpt.com)
- [Grafana Documentation](https://grafana.com/docs/?utm_source=chatgpt.com)

## 26.3 RED Method

The RED method focuses on three important service metrics.

| Metric | Meaning |
|---|---|
| Rate | Requests per second |
| Errors | Number or percentage of failed requests |
| Duration | Request processing time |

For example:

```text
API: GET /api/expenses

Rate: 500 requests/second
Error Rate: 0.5%
p95 Duration: 180 ms
```

## 26.4 USE Method

The USE method focuses on infrastructure resources.

| Metric | Meaning |
|---|---|
| Utilization | Percentage of resource capacity being used |
| Saturation | Amount of queued or waiting work |
| Errors | Resource-related errors |

Example:

```text
CPU Utilization: 85%
Memory Utilization: 75%
Database Connections: 95% of pool capacity
```

This can help identify infrastructure bottlenecks.

## 26.5 Distributed Tracing

Suppose a request travels through multiple services.

```text
Client
  |
  v
API Gateway
  |
  v
User Service
  |
  v
Expense Service
  |
  v
Database
```

If the complete request takes 2 seconds, distributed tracing helps identify which service contributes most of the latency.

Example:

| Operation | Duration |
|---|---:|
| API Gateway | 20 ms |
| User Service | 50 ms |
| Expense Service | 130 ms |
| Database | 1,800 ms |

The database is the major bottleneck.

Distributed tracing helps analyze an individual request across service boundaries.

---

# 27. Production Performance Optimization Workflow

Performance optimization should be systematic.

Do not randomly modify code based on assumptions.

Use this workflow:

### Step 1: Establish a Baseline

Measure:

- Average latency.
- p95 and p99 latency.
- Throughput.
- CPU usage.
- Memory usage.
- Error rate.
- Database query duration.

### Step 2: Identify the Bottleneck

Determine whether the problem is caused by:

- CPU.
- Memory.
- Database.
- Network.
- External APIs.
- Event loop.
- Excessive concurrency.

### Step 3: Form a Hypothesis

Example:

```text
Hypothesis:

The dashboard API is slow because it executes
multiple sequential database queries.
```

### Step 4: Implement an Optimization

For example, use parallel independent queries or improve database indexing.

### Step 5: Test Again

Run the same workload and compare the measurements.

### Step 6: Monitor Production

Observe the effect after deployment.

### Step 7: Repeat

Continue until the application meets its performance requirements.

---

# 28. Real-World Case Study: Optimizing an Expense Tracker API

Suppose you have an Expense Tracker application built using:

- Next.js frontend.
- Node.js and Express backend.
- TypeScript.
- MySQL.
- Sequelize.
- Redis.

Your dashboard API is:

```http
GET /api/dashboard
```

Initially:

```text
Average Response Time: 2,000 ms
p95 Response Time: 3,500 ms
Database Queries: 25
Memory Usage: 500 MB
```

You investigate and discover the following problems.

### Problem 1: Sequential Queries

Original:

```typescript
const user = await User.findByPk(userId);

const expenses = await Expense.findAll({
  where: {
    userId,
  },
});

const categories = await Category.findAll({
  where: {
    userId,
  },
});
```

Improvement:

```typescript
const [
  user,
  expenses,
  categories,
] = await Promise.all([
  User.findByPk(userId),

  Expense.findAll({
    where: {
      userId,
    },
  }),

  Category.findAll({
    where: {
      userId,
    },
  }),
]);
```

### Problem 2: Retrieving Unnecessary Data

Original:

```typescript
const expenses = await Expense.findAll({
  where: {
    userId,
  },
});
```

Improvement:

```typescript
const expenses = await Expense.findAll({
  where: {
    userId,
  },

  attributes: [
    "id",
    "amount",
    "categoryId",
    "createdAt",
  ],

  limit: 100,
});
```

### Problem 3: Repeated Database Queries

Cache frequently requested dashboard information in Redis.

```typescript
const cacheKey = `dashboard:${userId}`;

const cachedData = await redis.get(cacheKey);

if (cachedData) {
  return JSON.parse(cachedData);
}
```

If the cache misses, query the database and store the result with an appropriate TTL.

### Problem 4: Large Dataset

Instead of returning thousands of expenses, use pagination.

### Problem 5: Expensive Report Generation

Move CPU-intensive report generation into a Worker Thread or background queue, depending on the workload.

### Final Architecture

```text
                  Next.js Client
                       |
                       v
                  Express API
                       |
          +------------+------------+
          |            |            |
          v            v            v
        Redis        MySQL       Worker/Queue
          |            |            |
          v            v            v
        Cache       Queries     Report Tasks
          |            |            |
          +------------+------------+
                       |
                       v
                  API Response
```

The important lesson is that performance optimization is not simply about writing shorter code.

It is about selecting the right architecture, algorithms, data access patterns and resource-management strategies.

---

# 29. Common Performance Mistakes

| Mistake | Better Approach |
|---|---|
| Using synchronous file operations in request handlers | Use asynchronous APIs or streams |
| Performing CPU-heavy work on the main thread | Use Worker Threads or background workers |
| Creating a worker for every tiny task | Use a worker pool |
| Loading entire large files into memory | Use streams |
| Ignoring stream backpressure | Use `pipeline()` or respect `drain` |
| Running thousands of promises simultaneously | Apply concurrency limits |
| Executing unnecessary database queries | Optimize query patterns |
| Ignoring database indexes | Analyze query plans |
| Retrieving every database column | Select only required fields |
| Creating unlimited caches | Use TTL and eviction policies |
| Ignoring cache invalidation | Define invalidation strategies |
| Using large SQL offsets for huge datasets | Consider cursor pagination |
| Running all jobs inside HTTP requests | Use background queues |
| Optimizing without profiling | Measure first |
| Monitoring only average latency | Monitor p95 and p99 |
| Ignoring event-loop delay | Monitor event-loop health |
| Using excessive compression | Measure CPU and network trade-offs |

---

# 30. Interview Questions and Answers

## Basic to Intermediate

### Q1. What is performance engineering?

Performance engineering is the process of measuring, analyzing and optimizing an application's performance, scalability and resource utilization.

### Q2. What is latency?

Latency is the time required to complete an operation or respond to a request.

### Q3. What is throughput?

Throughput measures the number of operations completed per unit of time.

### Q4. What is the difference between CPU-bound and I/O-bound operations?

CPU-bound operations require substantial computation, while I/O-bound operations spend significant time waiting for external resources.

### Q5. Why is Node.js suitable for I/O-heavy applications?

Node.js uses an event-driven, non-blocking architecture that allows it to handle many concurrent I/O operations without requiring a separate JavaScript thread for every request.

### Q6. What is the event loop?

The event loop coordinates the execution of JavaScript callbacks and asynchronous operations.

### Q7. What are the major event loop phases?

Timers, pending callbacks, idle/prepare, poll, check and close callbacks.

### Q8. What is the difference between setTimeout and setImmediate?

`setTimeout()` schedules a callback after a timer threshold, while `setImmediate()` schedules it for the event loop's check phase.

### Q9. What is process.nextTick()?

It schedules a callback in Node.js's next-tick queue, which is processed before Promise microtasks at typical event-loop callback boundaries.

### Q10. What is libuv?

libuv is a library used by Node.js for event-loop functionality, asynchronous I/O and thread-pool operations.

### Q11. What is the default libuv thread pool size?

The default size is generally four threads.

### Q12. What is garbage collection?

Garbage collection is the automatic process of reclaiming memory occupied by objects that are no longer reachable.

### Q13. What is a memory leak?

A memory leak occurs when an application retains memory that it no longer needs.

### Q14. What is heap memory?

Heap memory is used for dynamically allocated objects and other runtime data.

### Q15. What is RSS?

RSS means Resident Set Size. It represents the amount of physical memory currently occupied by a process.

## Advanced

### Q16. What is a Worker Thread?

A Worker Thread is a separate JavaScript thread used to execute JavaScript independently from the main thread.

### Q17. When should you use Worker Threads?

Use them for CPU-intensive JavaScript operations that would otherwise block the main event loop.

### Q18. What is the difference between Worker Threads and Child Processes?

Worker Threads execute JavaScript in separate threads within one process. Child Processes run as separate operating-system processes with separate process memory.

### Q19. What is the Cluster module?

The Cluster module allows Node.js to create multiple processes that can share a server port.

### Q20. What is a stream?

A stream processes data incrementally rather than requiring the entire dataset to be loaded into memory.

### Q21. What are the four types of streams?

Readable, Writable, Duplex and Transform.

### Q22. What is backpressure?

Backpressure is a mechanism that prevents a producer from overwhelming a slower consumer.

### Q23. What is highWaterMark?

It is a buffering threshold used by Node.js streams to determine when buffering should signal that the producer needs to slow down.

### Q24. What is a Buffer?

A Buffer is a Node.js object used to handle binary data.

### Q25. What is the difference between Promise.all and Promise.allSettled?

`Promise.all()` rejects when one promise rejects. `Promise.allSettled()` waits until every promise settles and reports each result.

### Q26. What is an N+1 query problem?

It occurs when an application executes one query to retrieve records and then executes an additional query for each record.

### Q27. What is a database connection pool?

A connection pool maintains reusable database connections to reduce connection creation overhead.

### Q28. What is Redis caching?

Redis caching stores frequently accessed data in Redis to reduce repeated database queries and improve response times.

### Q29. What is cache invalidation?

Cache invalidation is the process of removing or updating cached data when its underlying source changes.

### Q30. What is a cache stampede?

A cache stampede occurs when many requests simultaneously encounter an expired or missing cache entry and overload the underlying data source.

### Q31. What is cursor-based pagination?

Cursor-based pagination uses a reference value from the previous result set to retrieve the next set of records.

### Q32. What is batch processing?

Batch processing executes operations on groups of records instead of processing every record individually.

### Q33. What is a message queue?

A message queue stores tasks for asynchronous processing by background workers.

### Q34. What is idempotency?

An operation is idempotent when repeating it produces the same intended effect as executing it once.

### Q35. What is load testing?

Load testing measures application behavior under a defined workload.

### Q36. What is stress testing?

Stress testing evaluates how an application behaves beyond its expected operating capacity.

### Q37. What is soak testing?

Soak testing evaluates application stability under sustained load over an extended period.

### Q38. What is APM?

Application Performance Monitoring is the practice of monitoring application performance, errors, dependencies and resource usage.

### Q39. What is distributed tracing?

Distributed tracing follows a request across multiple services to identify latency and failures.

### Q40. Why are p95 and p99 important?

They reveal slow requests experienced by a portion of users, which average latency can hide.

---

# 31. Practical Exercises

Complete these exercises to strengthen your understanding.

## Exercise 1: Event Loop

Predict the output:

```typescript
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
});

process.nextTick(() => {
  console.log("D");
});

console.log("E");
```

Explain why the output occurs in that order.

Assume CommonJS execution.

## Exercise 2: Memory Monitoring

Create a Node.js application that:

1. Allocates objects.
2. Stores them in an array.
3. Prints memory usage every five seconds.
4. Removes references.
5. Observes memory behavior.

Use:

```typescript
process.memoryUsage();
```

## Exercise 3: CPU Profiling

Create a CPU-intensive function.

Run:

```bash
node --cpu-prof dist/server.js
```

Inspect the CPU profile and identify the function consuming the most CPU time.

## Exercise 4: Worker Threads

Create a Worker Thread that calculates the sum of numbers from 1 to 100 million.

Compare execution behavior between:

- Main-thread execution.
- Worker Thread execution.

Observe how the main thread responds to other requests in each case.

## Exercise 5: Stream Processing

Create an application that:

1. Reads a large CSV file.
2. Processes it using streams.
3. Transforms each row.
4. Writes the output to another file.
5. Uses `pipeline()`.

## Exercise 6: Database Optimization

Create a table with at least 100,000 records.

Compare:

- Query without an index.
- Query with an index.
- Query using unnecessary columns.
- Query selecting only required columns.

Use `EXPLAIN` to analyze the execution plan.

## Exercise 7: Redis Caching

Implement:

```http
GET /api/users/:id
```

Requirements:

1. Check Redis first.
2. Query MySQL if the cache misses.
3. Store the result in Redis.
4. Use a TTL of five minutes.
5. Invalidate the cache after updating the user.

## Exercise 8: Pagination

Implement both:

- Offset pagination.
- Cursor-based pagination.

Test them with 100,000 records.

Compare their performance and behavior when new records are inserted.

## Exercise 9: Queue-Based Processing

Create a resume-processing queue using BullMQ.

Requirements:

1. Accept a resume upload.
2. Create a background job.
3. Process the resume asynchronously.
4. Track job status.
5. Retry failed jobs.
6. Prevent duplicate processing.

## Exercise 10: Load Testing

Use Autocannon or k6 to test your Expense Tracker API.

Measure:

- Requests per second.
- Average latency.
- p95 latency.
- p99 latency.
- Error rate.
- CPU usage.
- Memory usage.

Record your results before and after optimization.

---

# 32. Phase 60 Completion Checklist

You should be able to explain and implement the following:

| No. | Topic | Status |
|---:|---|---|
| 1 | Performance Engineering Fundamentals | ☐ |
| 2 | Latency vs Throughput | ☐ |
| 3 | CPU-Bound vs I/O-Bound | ☐ |
| 4 | Node.js Event Loop | ☐ |
| 5 | Event Loop Phases | ☐ |
| 6 | Microtasks and Macrotasks | ☐ |
| 7 | Blocking vs Non-Blocking Operations | ☐ |
| 8 | libuv Thread Pool | ☐ |
| 9 | Stack and Heap Memory | ☐ |
| 10 | Garbage Collection | ☐ |
| 11 | Memory Leaks | ☐ |
| 12 | Heap Snapshots | ☐ |
| 13 | CPU Profiling | ☐ |
| 14 | Flame Graphs | ☐ |
| 15 | Worker Threads | ☐ |
| 16 | Worker Pools | ☐ |
| 17 | Child Processes | ☐ |
| 18 | Cluster Module | ☐ |
| 19 | Streams | ☐ |
| 20 | Backpressure | ☐ |
| 21 | Buffer Management | ☐ |
| 22 | Promise Optimization | ☐ |
| 23 | Concurrency Control | ☐ |
| 24 | Database Optimization | ☐ |
| 25 | Connection Pool Optimization | ☐ |
| 26 | Redis Caching | ☐ |
| 27 | Cache Invalidation | ☐ |
| 28 | HTTP Caching | ☐ |
| 29 | CDN Optimization | ☐ |
| 30 | Compression | ☐ |
| 31 | Lazy Loading | ☐ |
| 32 | Offset Pagination | ☐ |
| 33 | Cursor Pagination | ☐ |
| 34 | Batch Processing | ☐ |
| 35 | Queue-Based Processing | ☐ |
| 36 | Load Testing | ☐ |
| 37 | Benchmarking | ☐ |
| 38 | Event Loop Monitoring | ☐ |
| 39 | APM and Observability | ☐ |
| 40 | Production Performance Optimization | ☐ |

---

# 33. Final Summary

Performance engineering is an essential skill for building scalable production applications.

The most important concepts to remember:

1. **Event Loop:** Understand how Node.js schedules asynchronous operations.
2. **Worker Threads:** Use them for CPU-intensive JavaScript workloads.
3. **Streams:** Process large datasets without loading everything into memory.
4. **Memory Management:** Monitor heap, RSS and garbage collection behavior.
5. **Database Optimization:** Use appropriate indexes, query plans and connection pools.
6. **Redis:** Cache frequently accessed data and implement proper invalidation.
7. **Queues:** Move long-running tasks outside HTTP request-response cycles.
8. **Load Testing:** Measure application behavior under realistic traffic.
9. **Monitoring:** Track latency, throughput, errors, memory, CPU and event-loop delay.
10. **Optimization:** Measure first, identify bottlenecks, optimize and measure again.

**Professional principle:** Never optimize based only on assumptions. Measure the actual bottleneck before changing the architecture or code.

---

# 34. Next Phase Preview

## Phase 61: Advanced TypeScript – Cloud-Native Development, Docker, Kubernetes, CI/CD, Infrastructure as Code, Deployment Strategies and Production Operations

Upcoming topics:

1. Cloud-Native Architecture.
2. Monolithic vs Microservices Architecture.
3. Docker Fundamentals.
4. Docker Images and Containers.
5. Dockerfile Optimization.
6. Multi-Stage Docker Builds.
7. Docker Compose.
8. Container Networking.
9. Container Volumes.
10. Container Security.
11. Kubernetes Fundamentals.
12. Pods, Deployments and Services.
13. ConfigMaps and Secrets.
14. Ingress and Load Balancing.
15. Horizontal Pod Autoscaling.
16. Kubernetes Health Checks.
17. CI/CD Fundamentals.
18. GitHub Actions.
19. Automated Testing Pipelines.
20. Docker Image Build Pipelines.
21. Automated Deployment.
22. Infrastructure as Code.
23. Terraform Fundamentals.
24. Deployment Strategies.
25. Blue-Green Deployment.
26. Canary Deployment.
27. Rolling Deployment.
28. Environment Management.
29. Production Configuration.
30. Log Aggregation.
31. Centralized Monitoring.
32. Backup and Disaster Recovery.
33. High Availability.
34. Fault Tolerance.
35. Production Operations and Reliability Engineering.

**Phase 60 completed.** When you're ready, say **"OK, Phase 61"** to continue.