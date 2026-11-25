# Phase 47: Advanced TypeScript – Node.js Integration, Runtime APIs, Streams, Buffers, File System and Process Management

**Level:** Expert  
**Prerequisites:** TypeScript fundamentals, advanced types, Node.js fundamentals, modules, asynchronous JavaScript, Promises, Event Loop, and TypeScript compiler configuration.

---

# 1. Learning Objectives

In this phase, you will learn how to use TypeScript with Node.js runtime APIs to develop robust backend applications.

By the end of this phase, you should understand:

1. TypeScript with Node.js.
2. Node.js Type Definitions.
3. Understanding `@types/node`.
4. Node.js Runtime Types.
5. Global Objects in Node.js.
6. Process Management.
7. Environment Variables.
8. Type-Safe Configuration Management.
9. File System APIs.
10. Synchronous vs Asynchronous File Operations.
11. Promise-Based File System.
12. Path Module.
13. OS Module.
14. Events Module.
15. EventEmitter with TypeScript.
16. Buffer in TypeScript.
17. Binary Data Handling.
18. Streams in TypeScript.
19. Readable Streams.
20. Writable Streams.
21. Transform Streams.
22. Duplex Streams.
23. Stream Piping.
24. Error Handling in Streams.
25. Child Processes.
26. Worker Threads.
27. HTTP Module.
28. Type-Safe HTTP Servers.
29. Type-Safe Environment Variables.
30. Node.js Performance and Memory Management.
31. Graceful Shutdown.
32. Production Node.js Application Architecture.

---

# 2. TypeScript with Node.js

Node.js is a JavaScript runtime that allows you to execute JavaScript outside the browser.

TypeScript adds static type checking to JavaScript development.

You can use TypeScript with Node.js to develop:

- REST APIs.
- Backend applications.
- CLI tools.
- File-processing applications.
- Automation scripts.
- Background workers.
- WebSocket servers.
- Microservices.
- Database applications.

## 2.1 Basic Node.js TypeScript Project

Create a project:

```bash
mkdir node-typescript
cd node-typescript
npm init -y
```

Install dependencies:

```bash
npm install -D typescript tsx @types/node
```

Initialize TypeScript:

```bash
npx tsc --init
```

Create this structure:

```text
node-typescript/
│
├── src/
│   └── app.ts
│
├── package.json
└── tsconfig.json
```

### app.ts

```ts
const message: string = "Hello from TypeScript and Node.js";

console.log(message);
```

Run:

```bash
npx tsx src/app.ts
```

Output:

```text
Hello from TypeScript and Node.js
```

Here, `tsx` executes TypeScript using a development-friendly runtime transformation workflow.

For production, you can compile TypeScript into JavaScript and execute the generated files using Node.js.

## 2.2 Development vs Production

Development:

```bash
npx tsx watch src/app.ts
```

Production build:

```bash
npx tsc
```

Production execution:

```bash
node dist/app.js
```

The workflow is:

```text
TypeScript Source
       |
       v
   Type Checking
       |
       v
   Compilation
       |
       v
 JavaScript Output
       |
       v
   Node.js Runtime
       |
       v
   Application
```

**Important:** Node.js also has built-in TypeScript type-stripping support in modern releases. However, type stripping does not perform type checking or automatically transform every TypeScript feature. For this phase, we will use the conventional `tsc` build workflow.

---

# 3. Node.js Type Definitions

Node.js provides many built-in APIs.

Examples:

```ts
process.env;

Buffer.from("Hello");

setTimeout(() => {
    console.log("Done");
}, 1000);
```

TypeScript needs type definitions to understand these APIs.

This is where `@types/node` becomes important.

## 3.1 What Is `@types/node`?

`@types/node` is a package containing TypeScript declarations for Node.js APIs.

Install it:

```bash
npm install -D @types/node
```

It provides type information for:

- `process`
- `Buffer`
- `NodeJS`
- `fs`
- `path`
- `os`
- `events`
- `http`
- `stream`
- `crypto`
- `child_process`
- `worker_threads`

Example:

```ts
import { readFile } from "node:fs/promises";

const content = await readFile("example.txt", "utf8");

console.log(content);
```

TypeScript understands:

- The function parameters.
- The return type.
- The Promise result.
- The possible errors and runtime behavior.

## 3.2 Why Is `@types/node` a Development Dependency?

Because it provides compile-time type information.

Your Node.js runtime does not need the package to execute ordinary JavaScript.

Therefore, it is commonly installed as a development dependency:

```bash
npm install -D @types/node
```

## 3.3 Check Installed Types

```bash
npm list @types/node
```

To inspect TypeScript declaration files:

```text
node_modules/
    @types/
        node/
            index.d.ts
            buffer.d.ts
            process.d.ts
            fs.d.ts
            stream.d.ts
```

These files describe Node.js APIs to TypeScript.

**Important:** Choose an `@types/node` version compatible with the Node.js version and APIs your project actually uses.

---

# 4. Node.js Runtime Types

Node.js provides several global objects.

Let's understand their TypeScript usage.

## 4.1 `process`

The `process` object provides information and control over the current Node.js process.

```ts
console.log(process.pid);

console.log(process.platform);

console.log(process.version);

console.log(process.cwd());
```

Important properties:

| Property | Purpose |
|---|---|
| `process.pid` | Current process ID |
| `process.ppid` | Parent process ID |
| `process.platform` | Operating system platform |
| `process.arch` | CPU architecture |
| `process.version` | Node.js version |
| `process.cwd()` | Current working directory |
| `process.env` | Environment variables |
| `process.argv` | Command-line arguments |
| `process.memoryUsage()` | Memory usage |
| `process.uptime()` | Process uptime |

## 4.2 `__dirname`

In traditional CommonJS modules, `__dirname` provides the current module's directory.

Example:

```ts
console.log(__dirname);
```

However, native ES modules do not provide `__dirname` automatically.

In ESM, use:

```ts
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

console.log(__dirname);
```

## 4.3 `global`

Node.js provides a global object.

```ts
globalThis.appName = "My Application";
```

However, you should generally avoid adding unnecessary application-specific properties to the global scope.

Prefer modules and dependency injection.

---

# 5. Process Management

A process is an executing instance of a program.

Node.js provides the `process` object for interacting with the current process.

## 5.1 Process Information

```ts
console.log("PID:", process.pid);

console.log("Platform:", process.platform);

console.log("Architecture:", process.arch);

console.log("Node Version:", process.version);
```

## 5.2 Current Working Directory

```ts
console.log(process.cwd());
```

Example output:

```text
C:\Projects\node-typescript
```

The current working directory is where the Node.js process was started.

It is not necessarily the directory containing the current source file.

## 5.3 Process Exit

You can terminate the process using:

```ts
process.exit(0);
```

Common exit codes:

| Exit Code | Meaning |
|---|---|
| `0` | Successful execution |
| `1` | General failure |
| Other values | Application-specific or system-specific errors |

Example:

```ts
function validateConfig() {
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
        console.error("API_KEY is missing");

        process.exitCode = 1;

        return;
    }

    console.log("Configuration is valid");
}

validateConfig();
```

Prefer setting `process.exitCode` when possible instead of immediately calling `process.exit()`.

Immediate termination can interrupt pending asynchronous operations and output.

## 5.4 Process Arguments

Node.js exposes command-line arguments through:

```ts
process.argv
```

Example:

```ts
console.log(process.argv);
```

Run:

```bash
npx tsx src/app.ts John 25
```

Example output:

```text
[
    'node',
    '/path/to/app.ts',
    'John',
    '25'
]
```

The first two entries generally represent the executable and script path.

Your custom arguments start from index `2`.

```ts
const name = process.argv[2];

const age = Number(process.argv[3]);

console.log({
    name,
    age
});
```

## 5.5 Process Memory Usage

```ts
console.log(process.memoryUsage());
```

Example result:

```ts
{
    rss: 50000000,
    heapTotal: 20000000,
    heapUsed: 15000000,
    external: 2000000,
    arrayBuffers: 1000000
}
```

Important fields:

| Field | Meaning |
|---|---|
| `rss` | Total resident memory used by the process |
| `heapTotal` | Total allocated V8 heap |
| `heapUsed` | Currently used V8 heap |
| `external` | Memory associated with C++ objects bound to JavaScript |
| `arrayBuffers` | Memory used by ArrayBuffers and related buffers |

---

# 6. Environment Variables

Environment variables store configuration outside application source code.

They are commonly used for:

- Database connection strings.
- API keys.
- JWT secrets.
- Port numbers.
- Environment names.
- Third-party credentials.

Example:

```ts
console.log(process.env.PORT);
```

## 6.1 Accessing Environment Variables

```ts
const port = process.env.PORT;

console.log(port);
```

**Important:** Environment variables are strings or `undefined`.

Even if you define:

```env
PORT=5000
```

Node.js reads:

```ts
"5000"
```

Not:

```ts
5000
```

Convert explicitly:

```ts
const port = Number(process.env.PORT);
```

## 6.2 Using a `.env` File

Install dotenv:

```bash
npm install dotenv
```

Create:

```text
.env
```

Example:

```env
PORT=5000

NODE_ENV=development

DATABASE_URL=mysql://root:password@localhost:3306/app_db

JWT_SECRET=my-secret-key
```

Load it:

```ts
import "dotenv/config";

console.log(process.env.PORT);
```

You can also use:

```ts
import dotenv from "dotenv";

dotenv.config();
```

Node.js also provides native environment-file support in modern releases, but the exact options depend on the installed runtime version.

## 6.3 Protect Environment Variables

Never commit sensitive `.env` files.

Add:

```gitignore
.env
.env.*
!.env.example
```

Create a safe example file:

```env
PORT=5000

NODE_ENV=development

DATABASE_URL=

JWT_SECRET=
```

The example file documents required configuration without exposing secrets.

---

# 7. Type-Safe Configuration Management

One common problem is repeatedly accessing environment variables throughout an application.

Example:

```ts
const port = Number(process.env.PORT);

const databaseUrl = process.env.DATABASE_URL;

const jwtSecret = process.env.JWT_SECRET;
```

This creates several problems:

- Missing values.
- Invalid numbers.
- Inconsistent defaults.
- Repeated validation.
- Configuration logic scattered across the project.

A better approach is to centralize configuration.

## 7.1 Create a Configuration Module

Structure:

```text
src/
    config/
        env.ts
```

Code:

```ts
import "dotenv/config";

function getRequiredEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`${name} is required`);
    }

    return value;
}

function getNumberEnv(
    name: string,
    defaultValue: number
): number {
    const rawValue = process.env[name];

    if (rawValue === undefined) {
        return defaultValue;
    }

    const value = Number(rawValue);

    if (!Number.isFinite(value)) {
        throw new Error(`${name} must be a valid number`);
    }

    return value;
}

export const env = {
    PORT: getNumberEnv("PORT", 5000),

    NODE_ENV: process.env.NODE_ENV ?? "development",

    DATABASE_URL: getRequiredEnv("DATABASE_URL"),

    JWT_SECRET: getRequiredEnv("JWT_SECRET")
} as const;
```

Usage:

```ts
import { env } from "./config/env.js";

console.log(env.PORT);

console.log(env.DATABASE_URL);
```

Now configuration is centralized.

## 7.2 Type-Safe Environment Schema with Zod

For larger applications, a runtime validation library is useful.

Install:

```bash
npm install zod
```

Create:

```ts
// src/config/env.ts

import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().int().positive().default(5000),

    NODE_ENV: z.enum([
        "development",
        "production",
        "test"
    ]).default("development"),

    DATABASE_URL: z.string().min(1),

    JWT_SECRET: z.string().min(20)
});

export const env = envSchema.parse(process.env);
```

Now TypeScript infers the configuration type from the schema.

If an environment variable is missing or invalid, application initialization fails with a validation error.

This is more reliable than simply declaring that every environment variable exists.

**Important distinction:**

```ts
process.env.PORT as unknown as number
```

does not convert the string to a number.

Runtime parsing performs the actual conversion.

---

# 8. File System APIs

Node.js provides the `fs` module to interact with files and directories.

You can:

- Create files.
- Read files.
- Update files.
- Delete files.
- Create directories.
- Rename files.
- Copy files.
- Inspect file metadata.
- Watch files and directories.

Import:

```ts
import fs from "node:fs";
```

Or:

```ts
import * as fs from "node:fs";
```

## 8.1 Read a File Synchronously

```ts
import fs from "node:fs";

const content = fs.readFileSync(
    "example.txt",
    "utf8"
);

console.log(content);
```

This blocks the JavaScript thread until the file operation completes.

## 8.2 Write a File Synchronously

```ts
import fs from "node:fs";

fs.writeFileSync(
    "example.txt",
    "Hello TypeScript"
);
```

If the file does not exist, Node.js creates it.

If it exists, its content is replaced by default.

## 8.3 Append to a File

```ts
import fs from "node:fs";

fs.appendFileSync(
    "example.txt",
    "\nNew line"
);
```

## 8.4 Delete a File

```ts
import fs from "node:fs";

fs.unlinkSync("example.txt");
```

## 8.5 Create a Directory

```ts
import fs from "node:fs";

fs.mkdirSync("uploads");
```

For nested directories:

```ts
fs.mkdirSync("uploads/images", {
    recursive: true
});
```

## 8.6 Read Directory Contents

```ts
import fs from "node:fs";

const files = fs.readdirSync("./uploads");

console.log(files);
```

The result is an array of entry names.

## 8.7 Get File Information

```ts
import fs from "node:fs";

const stats = fs.statSync("example.txt");

console.log(stats.size);

console.log(stats.isFile());

console.log(stats.isDirectory());
```

---

# 9. Synchronous vs Asynchronous File Operations

Node.js provides synchronous and asynchronous APIs.

Consider:

```ts
fs.readFileSync("large.txt", "utf8");
```

This blocks the event loop while the operation completes.

Compare:

```ts
fs.readFile("large.txt", "utf8", (error, data) => {
    if (error) {
        console.error(error);
        return;
    }

    console.log(data);
});
```

This uses a callback-based asynchronous API.

## 9.1 Comparison

| Feature | Synchronous | Asynchronous |
|---|---|---|
| Execution | Blocks current thread | Does not block while I/O is pending |
| API style | Direct return | Callback or Promise |
| Event loop | Blocked during operation | Can process other work |
| Error handling | `try/catch` | Callback or Promise rejection |
| Typical use | Small scripts and startup tasks | Backend request handling |

### Example: Synchronous

```ts
import fs from "node:fs";

try {
    const data = fs.readFileSync(
        "example.txt",
        "utf8"
    );

    console.log(data);
} catch (error) {
    console.error(error);
}
```

### Example: Asynchronous Callback

```ts
import fs from "node:fs";

fs.readFile("example.txt", "utf8", (error, data) => {
    if (error) {
        console.error(error);
        return;
    }

    console.log(data);
});
```

**Professional recommendation:** Prefer asynchronous file operations for request-handling code in Node.js servers. Synchronous operations can be appropriate for small startup scripts or simple command-line tools.

---

# 10. Promise-Based File System

Node.js provides a Promise-based file system API.

Import:

```ts
import fs from "node:fs/promises";
```

Or:

```ts
import {
    readFile,
    writeFile,
    appendFile
} from "node:fs/promises";
```

## 10.1 Read a File

```ts
import { readFile } from "node:fs/promises";

async function readData() {
    try {
        const content = await readFile(
            "example.txt",
            "utf8"
        );

        console.log(content);
    } catch (error) {
        console.error(error);
    }
}

readData();
```

## 10.2 Write a File

```ts
import { writeFile } from "node:fs/promises";

async function saveData() {
    await writeFile(
        "example.txt",
        "Hello from Node.js"
    );
}

saveData();
```

## 10.3 Append Data

```ts
import { appendFile } from "node:fs/promises";

await appendFile(
    "example.txt",
    "\nNew content"
);
```

## 10.4 Delete a File

```ts
import { unlink } from "node:fs/promises";

await unlink("example.txt");
```

## 10.5 Rename a File

```ts
import { rename } from "node:fs/promises";

await rename(
    "old-name.txt",
    "new-name.txt"
);
```

## 10.6 Copy a File

```ts
import { copyFile } from "node:fs/promises";

await copyFile(
    "source.txt",
    "destination.txt"
);
```

## 10.7 Create a Directory

```ts
import { mkdir } from "node:fs/promises";

await mkdir("uploads/images", {
    recursive: true
});
```

## 10.8 Read Directory Entries

```ts
import { readdir } from "node:fs/promises";

const files = await readdir("./uploads", {
    withFileTypes: true
});

for (const file of files) {
    console.log({
        name: file.name,
        isFile: file.isFile(),
        isDirectory: file.isDirectory()
    });
}
```

---

# 11. File System Operations with TypeScript

Let's build a reusable file service.

Create:

```text
src/
    services/
        file.service.ts
```

Code:

```ts
import {
    readFile,
    writeFile,
    appendFile,
    unlink,
    stat
} from "node:fs/promises";

import type { Stats } from "node:fs";

export class FileService {

    async read(path: string): Promise<string> {
        return await readFile(path, "utf8");
    }

    async write(
        path: string,
        content: string
    ): Promise<void> {
        await writeFile(path, content, "utf8");
    }

    async append(
        path: string,
        content: string
    ): Promise<void> {
        await appendFile(path, content, "utf8");
    }

    async delete(path: string): Promise<void> {
        await unlink(path);
    }

    async getStats(path: string): Promise<Stats> {
        return await stat(path);
    }
}
```

Usage:

```ts
const fileService = new FileService();

await fileService.write(
    "data.txt",
    "Hello World"
);

const content = await fileService.read("data.txt");

console.log(content);
```

This is an example of encapsulating Node.js runtime APIs behind a reusable service.

---

# 12. File System Watchers

Node.js allows you to monitor files and directories for changes.

Use:

```ts
import { watch } from "node:fs";
```

Example:

```ts
import { watch } from "node:fs";

const watcher = watch("./uploads", (eventType, filename) => {
    console.log("Event:", eventType);

    console.log("Filename:", filename);
});
```

Possible event types include:

```text
rename
change
```

Stop watching:

```ts
watcher.close();
```

### Practical Uses

- Monitoring uploaded files.
- Development tools.
- File synchronization.
- Automated processing.
- Configuration reload systems.

**Important:** File watcher behavior differs across operating systems and filesystems. Events may be duplicated or coalesced, and filenames may not always be provided. Do not treat a watcher event as a guaranteed one-event-per-file-operation notification.

---

# 13. Path Module

The `path` module provides utilities for working with file and directory paths.

Import:

```ts
import path from "node:path";
```

This is especially important because Windows and Linux use different path separators.

Windows:

```text
C:\Users\John\Documents
```

Linux:

```text
/home/john/documents
```

The `path` module handles these differences.

## 13.1 `path.join()`

Combines path segments.

```ts
const filePath = path.join(
    "uploads",
    "images",
    "photo.png"
);

console.log(filePath);
```

## 13.2 `path.resolve()`

Creates an absolute path.

```ts
const absolutePath = path.resolve(
    "uploads",
    "images"
);

console.log(absolutePath);
```

Difference:

| Method | Purpose |
|---|---|
| `path.join()` | Combines path segments |
| `path.resolve()` | Resolves segments into an absolute path |

## 13.3 `path.basename()`

Returns the final portion of a path.

```ts
const result = path.basename(
    "/uploads/images/photo.png"
);

console.log(result);
```

Output:

```text
photo.png
```

## 13.4 `path.dirname()`

Returns the directory portion.

```ts
const result = path.dirname(
    "/uploads/images/photo.png"
);

console.log(result);
```

Output:

```text
/uploads/images
```

## 13.5 `path.extname()`

Returns the file extension.

```ts
const result = path.extname("photo.png");

console.log(result);
```

Output:

```text
.png
```

## 13.6 `path.parse()`

Returns detailed path information.

```ts
const result = path.parse(
    "/uploads/images/photo.png"
);

console.log(result);
```

Result conceptually:

```ts
{
    root: "/",
    dir: "/uploads/images",
    base: "photo.png",
    ext: ".png",
    name: "photo"
}
```

## 13.7 `path.format()`

Creates a path from a parsed path object.

```ts
const result = path.format({
    dir: "/uploads/images",
    name: "photo",
    ext: ".png"
});

console.log(result);
```

## 13.8 `path.sep`

Returns the operating system's path separator.

```ts
console.log(path.sep);
```

Windows:

```text
\
```

Linux/macOS:

```text
/
```

---

# 14. Safe File Path Handling

When accepting file paths from users, you must consider path traversal vulnerabilities.

Example malicious input:

```text
../../.env
```

A careless application might allow access to files outside the intended directory.

Consider:

```ts
const filePath = path.join(
    "uploads",
    userInput
);
```

This is not sufficient security validation.

A safer approach is to resolve the path and verify that it remains inside the intended directory.

```ts
import path from "node:path";

function resolveUploadPath(
    rootDirectory: string,
    userInput: string
): string {
    const root = path.resolve(rootDirectory);

    const target = path.resolve(root, userInput);

    const relative = path.relative(root, target);

    if (
        relative === ".." ||
        relative.startsWith(`..${path.sep}`) ||
        path.isAbsolute(relative)
    ) {
        throw new Error("Invalid file path");
    }

    return target;
}
```

Usage:

```ts
const safePath = resolveUploadPath(
    "./uploads",
    "images/photo.png"
);
```

This helps prevent straightforward path traversal.

However, if attackers can manipulate filesystem symlinks or directories concurrently, additional protections are required. For high-security file handling, also control the upload directory, file creation options, and filesystem permissions.

---

# 15. OS Module

The `os` module provides information about the operating system.

Import:

```ts
import os from "node:os";
```

## 15.1 Operating System Platform

```ts
console.log(os.platform());
```

Possible values include:

```text
win32
linux
darwin
```

## 15.2 CPU Information

```ts
const cpus = os.cpus();

console.log(cpus);
```

Get CPU count:

```ts
console.log(os.cpus().length);
```

## 15.3 Total Memory

```ts
console.log(os.totalmem());
```

## 15.4 Free Memory

```ts
console.log(os.freemem());
```

Convert bytes into GB:

```ts
const totalMemoryGB =
    os.totalmem() / (1024 ** 3);

console.log(totalMemoryGB);
```

## 15.5 System Uptime

```ts
console.log(os.uptime());
```

Returns uptime in seconds.

## 15.6 Home Directory

```ts
console.log(os.homedir());
```

## 15.7 Temporary Directory

```ts
console.log(os.tmpdir());
```

## 15.8 Network Interfaces

```ts
console.log(os.networkInterfaces());
```

This returns network interface information.

Be careful when logging network details in production because they can reveal infrastructure information.

---

# 16. Events Module

Node.js provides an event-driven architecture.

The `events` module allows objects to emit and listen for events.

Import:

```ts
import { EventEmitter } from "node:events";
```

## 16.1 Basic EventEmitter

```ts
import { EventEmitter } from "node:events";

const emitter = new EventEmitter();

emitter.on("userCreated", () => {
    console.log("User created");
});

emitter.emit("userCreated");
```

Output:

```text
User created
```

## 16.2 Events with Parameters

```ts
import { EventEmitter } from "node:events";

const emitter = new EventEmitter();

emitter.on("userCreated", (user) => {
    console.log(user);
});

emitter.emit("userCreated", {
    id: 1,
    name: "John"
});
```

JavaScript allows flexible event payloads, but TypeScript needs additional typing for stronger guarantees.

## 16.3 `once()`

Registers a listener that executes only once.

```ts
emitter.once("connected", () => {
    console.log("Connected once");
});
```

## 16.4 `off()`

Removes a listener.

```ts
function handleEvent() {
    console.log("Event handled");
}

emitter.on("message", handleEvent);

emitter.off("message", handleEvent);
```

## 16.5 `removeAllListeners()`

Removes listeners.

```ts
emitter.removeAllListeners("message");
```

Use this carefully because it can remove listeners registered by other parts of your application.

---

# 17. Type-Safe EventEmitter with TypeScript

Now let's create a strongly typed event system.

Define the event map:

```ts
type AppEvents = {
    userCreated: {
        id: number;
        name: string;
    };

    userDeleted: {
        id: number;
    };

    orderPlaced: {
        orderId: number;
        total: number;
    };
};
```

Create a typed emitter:

```ts
import { EventEmitter } from "node:events";

class TypedEventEmitter<
    Events extends {
        [K in keyof Events]: unknown[];
    }
> extends EventEmitter {

    on<K extends keyof Events>(
        event: K,
        listener: (...args: Events[K]) => void
    ): this {
        return super.on(
            event as string | symbol,
            listener
        );
    }

    emit<K extends keyof Events>(
        event: K,
        ...args: Events[K]
    ): boolean {
        return super.emit(
            event as string | symbol,
            ...args
        );
    }
}
```

The event map can use tuple types to represent the arguments passed to each listener.

For example:

```ts
type Events = {
    userCreated: [
        user: {
            id: number;
            name: string;
        }
    ];

    userDeleted: [
        id: number
    ];

    orderPlaced: [
        orderId: number,
        total: number
    ];
};
```

Create the emitter:

```ts
const appEvents = new TypedEventEmitter<Events>();
```

Register a listener:

```ts
appEvents.on("userCreated", (user) => {
    console.log(user.name);
});
```

Emit:

```ts
appEvents.emit("userCreated", {
    id: 1,
    name: "John"
});
```

Another event:

```ts
appEvents.emit("orderPlaced", 101, 2500);
```

Invalid:

```ts
// Type error: incorrect event arguments
// appEvents.emit("orderPlaced", "101", 2500);
```

This technique is useful for strongly typed event-driven Node.js applications.

---

# 18. Buffer in TypeScript

A Buffer represents a sequence of bytes.

Node.js uses Buffers for binary data.

Common use cases:

- Reading images.
- Processing audio.
- Handling PDFs.
- Network communication.
- File uploads.
- Encoding and decoding data.

Import:

```ts
import { Buffer } from "node:buffer";
```

## 18.1 Create a Buffer from a String

```ts
const buffer = Buffer.from("Hello World");

console.log(buffer);
```

Output will contain byte values.

## 18.2 Convert Buffer to String

```ts
const buffer = Buffer.from("Hello World");

const result = buffer.toString("utf8");

console.log(result);
```

Output:

```text
Hello World
```

## 18.3 Create an Empty Buffer

```ts
const buffer = Buffer.alloc(10);

console.log(buffer);
```

This creates a zero-initialized Buffer of 10 bytes.

## 18.4 Create a Buffer Without Initialization

```ts
const buffer = Buffer.allocUnsafe(10);
```

This can be faster because memory is not initialized.

However, it may contain old memory contents until overwritten.

Do not expose its contents before writing safe values into the entire relevant region.

## 18.5 Buffer Length

```ts
const buffer = Buffer.from("Hello");

console.log(buffer.length);
```

Output:

```text
5
```

The length is measured in bytes, not necessarily characters.

For example:

```ts
const buffer = Buffer.from("😊");

console.log(buffer.length);
```

Output:

```text
4
```

The emoji uses four bytes in UTF-8.

## 18.6 Buffer Encoding

```ts
const buffer = Buffer.from("Hello", "utf8");

console.log(buffer.toString("hex"));

console.log(buffer.toString("base64"));
```

Common encodings:

| Encoding | Description |
|---|---|
| `utf8` | Unicode text encoding |
| `hex` | Hexadecimal representation |
| `base64` | Base64 representation |
| `ascii` | ASCII-oriented encoding |
| `latin1` | Single-byte character mapping |
| `base64url` | URL-safe Base64 representation |

---

# 19. Binary Data Handling

Binary data consists of bytes rather than ordinary text characters.

For example:

- PNG images.
- JPEG images.
- MP3 audio.
- MP4 videos.
- PDF documents.
- ZIP files.

## 19.1 Reading an Image as Buffer

```ts
import { readFile } from "node:fs/promises";

const imageBuffer = await readFile("photo.png");

console.log(imageBuffer);
```

The returned value is a Buffer.

## 19.2 Writing Binary Data

```ts
import { writeFile } from "node:fs/promises";

const buffer = Buffer.from("Hello");

await writeFile("output.bin", buffer);
```

## 19.3 Base64 Conversion

Buffer to Base64:

```ts
const buffer = Buffer.from("Hello World");

const base64 = buffer.toString("base64");

console.log(base64);
```

Base64 to Buffer:

```ts
const decoded = Buffer.from(base64, "base64");

console.log(decoded.toString("utf8"));
```

## 19.4 Buffer Concatenation

```ts
const first = Buffer.from("Hello ");

const second = Buffer.from("World");

const combined = Buffer.concat([
    first,
    second
]);

console.log(combined.toString());
```

Output:

```text
Hello World
```

---

# 20. Streams in Node.js

Streams allow you to process data in chunks rather than loading the entire data into memory.

This is one of the most important Node.js concepts for backend development.

Consider reading a large file.

### Without Streams

```ts
import { readFile } from "node:fs/promises";

const data = await readFile("large-file.mp4");

console.log(data.length);
```

The entire file is loaded into memory.

For very large files, this can consume substantial memory.

### With Streams

```ts
import { createReadStream } from "node:fs";

const stream = createReadStream("large-file.mp4");

stream.on("data", (chunk) => {
    console.log(chunk.length);
});
```

The file is processed in chunks.

## 20.1 What Is a Stream?

A stream is an abstraction for handling data incrementally.

Instead of receiving all data at once, you receive it piece by piece.

Examples:

- Reading a file.
- Uploading a file.
- Downloading a file.
- Processing a video.
- Receiving HTTP requests.
- Sending HTTP responses.

## 20.2 Types of Node.js Streams

Node.js provides four fundamental stream types.

| Stream Type | Purpose |
|---|---|
| Readable | Reads data |
| Writable | Writes data |
| Duplex | Reads and writes data |
| Transform | Reads, modifies, and writes data |

Let's understand each.

---

# 21. Readable Streams

A readable stream provides data to consumers.

Example:

```ts
import { createReadStream } from "node:fs";

const stream = createReadStream("large.txt", {
    encoding: "utf8"
});

stream.on("data", (chunk) => {
    console.log(chunk);
});

stream.on("end", () => {
    console.log("Reading completed");
});

stream.on("error", (error) => {
    console.error(error);
});
```

## 21.1 Important Readable Events

| Event | Purpose |
|---|---|
| `data` | A chunk of data is available |
| `end` | No more data will be provided |
| `error` | An error occurred |
| `close` | The underlying resource has closed |

## 21.2 Reading a File Using Async Iteration

Modern Node.js supports asynchronous iteration over readable streams.

```ts
import { createReadStream } from "node:fs";

const stream = createReadStream("large.txt", {
    encoding: "utf8"
});

for await (const chunk of stream) {
    console.log(chunk);
}
```

This is often easier to work with than manually registering events.

---

# 22. Writable Streams

Writable streams allow data to be written incrementally.

Example:

```ts
import { createWriteStream } from "node:fs";

const stream = createWriteStream("output.txt");

stream.write("Hello ");

stream.write("World");

stream.end();
```

The file receives:

```text
Hello World
```

## 22.1 Handling Completion

```ts
import { createWriteStream } from "node:fs";

const stream = createWriteStream("output.txt");

stream.on("finish", () => {
    console.log("Writing completed");
});

stream.on("error", (error) => {
    console.error(error);
});

stream.write("First line\n");

stream.write("Second line\n");

stream.end();
```

## 22.2 `write()` and Backpressure

The `write()` method returns a boolean.

```ts
const canContinue = stream.write("Some data");
```

If it returns:

```ts
true
```

The internal buffer can accept more data without requiring the producer to pause.

If it returns:

```ts
false
```

The producer should stop writing temporarily and wait for the `drain` event before continuing.

This behavior is called **backpressure**.

Example:

```ts
import { createWriteStream } from "node:fs";

const stream = createWriteStream("output.txt");

let index = 0;

function writeData() {
    while (index < 100000) {
        const canContinue = stream.write(
            `Line ${index}\n`
        );

        index++;

        if (!canContinue) {
            stream.once("drain", writeData);

            return;
        }
    }

    stream.end();
}

writeData();
```

Backpressure prevents a fast producer from overwhelming a slower consumer.

---

# 23. Duplex Streams

A Duplex stream supports both readable and writable operations.

Example:

```ts
import {
    Duplex
} from "node:stream";

const duplex = new Duplex({
    read() {},

    write(chunk, encoding, callback) {
        console.log("Received:", chunk.toString());

        callback();
    }
});

duplex.write("Hello from writable side");

duplex.push("Hello from readable side");

duplex.push(null);

duplex.on("data", (chunk) => {
    console.log("Output:", chunk.toString());
});
```

Duplex streams are useful for:

- Network sockets.
- Communication channels.
- Custom bidirectional protocols.

A socket connection is a common example of a Duplex stream.

---

# 24. Transform Streams

Transform streams are Duplex streams that modify data as it passes through.

Example:

```ts
import {
    Transform
} from "node:stream";

const upperCaseTransform = new Transform({
    transform(chunk, encoding, callback) {
        const result = chunk
            .toString()
            .toUpperCase();

        callback(null, result);
    }
});
```

Usage:

```ts
upperCaseTransform.on("data", (chunk) => {
    console.log(chunk.toString());
});

upperCaseTransform.write("hello ");

upperCaseTransform.write("world");

upperCaseTransform.end();
```

Output:

```text
HELLO 
WORLD
```

## 24.1 Practical Transform Stream

Suppose you want to remove extra spaces from text.

```ts
import { Transform } from "node:stream";

const trimTransform = new Transform({
    transform(chunk, encoding, callback) {
        const result = chunk
            .toString()
            .trim();

        callback(null, result);
    }
});
```

This demonstrates how data can be transformed while flowing through a stream.

**Important:** For text processing where chunks may split multibyte characters or logical records, use an appropriate decoder or maintain state between chunks. A chunk is not guaranteed to contain a complete line or character sequence.

---

# 25. Stream Piping

Piping connects streams.

The output of one stream becomes the input of another.

Example:

```ts
import {
    createReadStream,
    createWriteStream
} from "node:fs";

const readable = createReadStream("source.txt");

const writable = createWriteStream("destination.txt");

readable.pipe(writable);
```

Data flows like this:

```text
Source File
    |
    v
Readable Stream
    |
    v
Writable Stream
    |
    v
Destination File
```

## 25.1 Using Transform Streams with Pipe

```ts
import {
    createReadStream,
    createWriteStream
} from "node:fs";

import { Transform } from "node:stream";

const upperCase = new Transform({
    transform(chunk, encoding, callback) {
        callback(
            null,
            chunk.toString().toUpperCase()
        );
    }
});

createReadStream("source.txt")
    .pipe(upperCase)
    .pipe(createWriteStream("output.txt"));
```

Now the file content is converted to uppercase during processing.

## 25.2 Using `pipeline()`

For more robust stream composition, prefer `pipeline()`.

```ts
import {
    pipeline
} from "node:stream/promises";

import {
    createReadStream,
    createWriteStream
} from "node:fs";

await pipeline(
    createReadStream("source.txt"),
    createWriteStream("destination.txt")
);
```

`pipeline()` coordinates stream completion and error propagation more reliably than manually chaining `pipe()` calls.

It also supports cancellation through an `AbortSignal`.

---

# 26. Error Handling in Streams

Streams can fail because of:

- Missing files.
- Permission problems.
- Network interruptions.
- Disk errors.
- Invalid data.
- Connection termination.

Example:

```ts
import {
    createReadStream
} from "node:fs";

const stream = createReadStream("missing.txt");

stream.on("error", (error) => {
    console.error("Stream failed:", error.message);
});
```

With `pipeline()`:

```ts
import { pipeline } from "node:stream/promises";

import {
    createReadStream,
    createWriteStream
} from "node:fs";

try {
    await pipeline(
        createReadStream("source.txt"),
        createWriteStream("output.txt")
    );

    console.log("Pipeline completed");
} catch (error) {
    console.error("Pipeline failed:", error);
}
```

This is generally easier to maintain than manually managing multiple stream error events.

---

# 27. Practical Project: Large File Copy Using Streams

Let's create a file-copy utility.

Structure:

```text
src/
    file-copy.ts
```

Code:

```ts
import {
    createReadStream,
    createWriteStream
} from "node:fs";

import { pipeline } from "node:stream/promises";

async function copyFile(
    source: string,
    destination: string
): Promise<void> {

    try {
        await pipeline(
            createReadStream(source),
            createWriteStream(destination)
        );

        console.log("File copied successfully");

    } catch (error) {
        console.error("Copy failed:", error);

        throw error;
    }
}

copyFile(
    "large-video.mp4",
    "backup-video.mp4"
);
```

Advantages:

- Does not load the entire file into memory.
- Handles backpressure.
- Handles stream failures.
- Works with large files.

This technique is useful for file uploads, backups, and media processing.

---

# 28. Child Processes

A child process is a separate process started by another process.

Node.js provides the `child_process` module.

Import:

```ts
import {
    spawn,
    exec,
    execFile,
    fork
} from "node:child_process";
```

Child processes are useful for:

- Running shell commands.
- Executing external programs.
- Running FFmpeg.
- Running database utilities.
- Executing scripts.
- Delegating CPU-heavy work to another process.

## 28.1 `exec()`

Runs a command through a shell and collects its output.

```ts
import { exec } from "node:child_process";

exec("node --version", (error, stdout, stderr) => {
    if (error) {
        console.error(error);
        return;
    }

    console.log(stdout);
});
```

Use it for commands with relatively limited output.

**Security warning:** Never concatenate untrusted user input into a shell command.

## 28.2 `spawn()`

Starts a process and exposes its standard input, output, and error streams.

```ts
import { spawn } from "node:child_process";

const child = spawn("node", ["--version"]);

child.stdout.on("data", (data) => {
    console.log(data.toString());
});

child.stderr.on("data", (data) => {
    console.error(data.toString());
});

child.on("close", (code) => {
    console.log("Process exited:", code);
});
```

`spawn()` is useful for commands that produce continuous or large output.

## 28.3 `execFile()`

Runs an executable directly without using a shell by default.

```ts
import { execFile } from "node:child_process";

execFile(
    "node",
    ["--version"],
    (error, stdout) => {
        if (error) {
            console.error(error);
            return;
        }

        console.log(stdout);
    }
);
```

It is often preferable when you know the executable and its arguments.

## 28.4 `fork()`

Creates a new Node.js process with an IPC communication channel.

```ts
import { fork } from "node:child_process";

const child = fork("./worker.js");

child.send({
    task: "process-data"
});

child.on("message", (message) => {
    console.log("From child:", message);
});
```

The child process can communicate with its parent using IPC messages.

---

# 29. Child Process Security

Never construct shell commands using untrusted user input.

Unsafe:

```ts
import { exec } from "node:child_process";

const filename = userInput;

exec(`cat ${filename}`);
```

An attacker might inject additional shell commands.

Safer approach:

```ts
import { execFile } from "node:child_process";

execFile(
    "cat",
    [filename],
    (error, stdout) => {
        if (error) {
            console.error(error);
            return;
        }

        console.log(stdout);
    }
);
```

Even with `execFile`, you must validate arguments and restrict which files or operations are allowed.

Use:

- Allowlisted executable paths.
- Validated arguments.
- Restricted filesystem permissions.
- Appropriate process timeouts.
- Controlled execution environments.

---

# 30. Worker Threads

Node.js executes JavaScript on a main thread by default.

CPU-intensive JavaScript can block that thread.

Worker Threads allow JavaScript to run in separate threads.

Import:

```ts
import {
    Worker,
    isMainThread,
    parentPort,
    workerData
} from "node:worker_threads";
```

## 30.1 Main Thread

Create:

```text
src/
    main.ts
    worker.ts
```

`main.ts`:

```ts
import { Worker } from "node:worker_threads";

const worker = new Worker(
    new URL("./worker.js", import.meta.url),
    {
        workerData: {
            number: 10
        }
    }
);

worker.on("message", (result) => {
    console.log("Result:", result);
});

worker.on("error", (error) => {
    console.error(error);
});

worker.on("exit", (code) => {
    console.log("Worker exited:", code);
});
```

## 30.2 Worker File

`worker.ts`:

```ts
import {
    parentPort,
    workerData
} from "node:worker_threads";

const number: number = workerData.number;

const result = number * number;

parentPort?.postMessage(result);
```

The main thread sends data when creating the worker.

The worker calculates the result and sends it back.

## 30.3 Worker Threads vs Child Processes

| Feature | Worker Threads | Child Processes |
|---|---|---|
| Execution | Separate thread | Separate process |
| Memory | Can share memory | Separate process memory |
| Communication | Messages and shared memory | IPC and standard streams |
| Startup overhead | Generally lower | Generally higher |
| Isolation | Thread-level | Process-level |
| Best use | CPU-intensive JavaScript tasks | External programs and process isolation |

### When Should You Use Worker Threads?

Useful for:

- Large calculations.
- Image processing.
- Data transformations.
- CPU-heavy parsing.
- Computational algorithms.

They are generally unnecessary for ordinary database queries and file I/O because Node.js already provides asynchronous I/O mechanisms.

---

# 31. HTTP Module

Node.js provides a built-in HTTP module.

Import:

```ts
import {
    createServer
} from "node:http";
```

## 31.1 Basic HTTP Server

```ts
import { createServer } from "node:http";

const server = createServer((req, res) => {
    res.statusCode = 200;

    res.setHeader(
        "Content-Type",
        "text/plain"
    );

    res.end("Hello from Node.js");
});

server.listen(5000, () => {
    console.log("Server running on port 5000");
});
```

Open:

```text
http://localhost:5000
```

## 31.2 Understanding Request and Response

The callback receives:

```ts
(req, res) => {}
```

`req` represents the incoming request.

`res` represents the outgoing response.

Important request properties:

```ts
req.method;

req.url;

req.headers;
```

Important response methods:

```ts
res.writeHead();

res.setHeader();

res.write();

res.end();
```

## 31.3 Handling Routes

```ts
import { createServer } from "node:http";

const server = createServer((req, res) => {
    if (req.method === "GET" && req.url === "/") {
        res.writeHead(200, {
            "Content-Type": "text/plain"
        });

        res.end("Home Page");

        return;
    }

    if (req.method === "GET" && req.url === "/users") {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(
            JSON.stringify([
                {
                    id: 1,
                    name: "John"
                }
            ])
        );

        return;
    }

    res.writeHead(404, {
        "Content-Type": "application/json"
    });

    res.end(
        JSON.stringify({
            message: "Not Found"
        })
    );
});

server.listen(5000);
```

This is a basic HTTP server without Express.

---

# 32. Type-Safe HTTP Servers

Let's create a reusable request handler type.

```ts
import type {
    IncomingMessage,
    ServerResponse
} from "node:http";

type RequestHandler = (
    req: IncomingMessage,
    res: ServerResponse
) => void;
```

Use it:

```ts
const handler: RequestHandler = (req, res) => {
    res.statusCode = 200;

    res.end("Hello");
};
```

Create the server:

```ts
import { createServer } from "node:http";

const server = createServer(handler);

server.listen(5000);
```

## 32.1 Type-Safe JSON Response Helper

```ts
import type { ServerResponse } from "node:http";

function sendJson<T>(
    res: ServerResponse,
    statusCode: number,
    data: T
): void {

    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(data));
}
```

Usage:

```ts
sendJson(res, 200, {
    success: true,
    data: {
        id: 1,
        name: "John"
    }
});
```

The generic type allows the helper to accept different response structures.

However, it does not validate the response at runtime.

---

# 33. Node.js Performance and Memory Management

Performance is important for production backend applications.

Let's understand the major areas.

## 33.1 Event Loop Blocking

Consider:

```ts
function heavyCalculation() {
    let total = 0;

    for (let i = 0; i < 1_000_000_000; i++) {
        total += i;
    }

    return total;
}

heavyCalculation();

console.log("Completed");
```

This blocks the main JavaScript thread while the loop executes.

During that time, other JavaScript callbacks cannot run on the same event loop thread.

Possible solutions:

- Optimize the algorithm.
- Use Worker Threads for CPU-intensive JavaScript.
- Use a separate process.
- Move heavy work to a background job system.

## 33.2 Avoid Loading Large Files into Memory

Avoid:

```ts
const file = await readFile("huge-file.mp4");
```

For large files, prefer streaming.

```ts
import { createReadStream } from "node:fs";

const stream = createReadStream("huge-file.mp4");
```

## 33.3 Memory Leaks

Common causes:

- Unremoved event listeners.
- Unbounded caches.
- Global arrays holding unnecessary data.
- Timers that are never cleared.
- Unclosed streams.
- Long-lived references to large objects.

Example:

```ts
const cache = new Map<string, unknown>();
```

If entries are continuously added and never removed, memory usage can grow.

Use an appropriate cache expiration and eviction strategy.

## 33.4 Monitor Memory

```ts
import process from "node:process";

setInterval(() => {
    const memory = process.memoryUsage();

    console.log({
        rss: memory.rss,
        heapUsed: memory.heapUsed,
        heapTotal: memory.heapTotal
    });
}, 5000);
```

## 33.5 Monitor Event Loop Delay

Node.js provides performance monitoring utilities.

Example:

```ts
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
        max: histogram.max / 1e6
    });
}, 5000);
```

The values are converted from nanoseconds to milliseconds.

This can help identify event-loop delays.

---

# 34. Graceful Shutdown

Graceful shutdown means allowing an application to stop safely.

Suppose your backend server is running and receives a shutdown signal.

You should ideally:

1. Stop accepting new connections.
2. Allow ongoing requests to complete.
3. Close database connections.
4. Stop background workers.
5. Close other resources.
6. Exit the process.

## 34.1 Basic Signal Handling

```ts
process.on("SIGINT", () => {
    console.log("Received SIGINT");

    process.exit(0);
});
```

`SIGINT` is commonly generated when you press Ctrl+C in a terminal.

For production applications, immediate exit is usually not sufficient.

## 34.2 Graceful HTTP Server Shutdown

```ts
import { createServer } from "node:http";

const server = createServer((req, res) => {
    res.end("Hello World");
});

server.listen(5000);

async function shutdown(signal: string) {
    console.log(`Received ${signal}`);

    server.close((error) => {
        if (error) {
            console.error("Server shutdown failed", error);

            process.exitCode = 1;

            return;
        }

        console.log("HTTP server closed");
    });
}

process.on("SIGINT", () => {
    void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
});
```

## 34.3 Production-Style Shutdown

A more complete approach:

```ts
import { createServer } from "node:http";

const server = createServer((req, res) => {
    res.end("Hello World");
});

server.listen(5000);

let shuttingDown = false;

async function shutdown(signal: string): Promise<void> {
    if (shuttingDown) {
        return;
    }

    shuttingDown = true;

    console.log(`Received ${signal}`);

    const forceExitTimer = setTimeout(() => {
        console.error("Shutdown timed out");

        process.exit(1);
    }, 10000);

    forceExitTimer.unref();

    try {
        await new Promise<void>((resolve, reject) => {
            server.close(error => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });

        // Close database connections here.
        // Stop background workers here.
        // Close other resources here.

        console.log("Application shut down successfully");

        process.exitCode = 0;

    } catch (error) {
        console.error("Shutdown error:", error);

        process.exitCode = 1;
    }
}

process.once("SIGINT", () => {
    void shutdown("SIGINT");
});

process.once("SIGTERM", () => {
    void shutdown("SIGTERM");
});
```

For production systems, also consider:

- Readiness and liveness endpoints.
- Load balancer connection draining.
- In-flight request tracking.
- Database pool shutdown.
- Queue consumer shutdown.
- A maximum shutdown deadline.

The force-exit timer is a last-resort safeguard, not a replacement for proper resource cleanup.

---

# 35. Complete Practical Project: TypeScript File Processing System

Let's combine the concepts from this phase.

We will create an application that:

1. Accepts a directory path.
2. Reads files.
3. Processes files using streams.
4. Converts text to uppercase.
5. Saves processed output.
6. Logs processing information.
7. Handles errors.

## 35.1 Project Structure

```text
file-processor/
│
├── src/
│   ├── config/
│   │   └── env.ts
│   │
│   ├── services/
│   │   └── file-processor.service.ts
│   │
│   └── app.ts
│
├── input/
├── output/
│
├── package.json
└── tsconfig.json
```

## 35.2 Install Dependencies

```bash
npm init -y

npm install -D typescript tsx @types/node
```

## 35.3 tsconfig.json

```json
{
    "compilerOptions": {
        "target": "ES2022",

        "module": "NodeNext",
        "moduleResolution": "NodeNext",

        "rootDir": "./src",
        "outDir": "./dist",

        "strict": true,

        "noUncheckedIndexedAccess": true,

        "esModuleInterop": true,

        "skipLibCheck": true,

        "sourceMap": true
    },

    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist"]
}
```

## 35.4 Create File Processor Service

```ts
// src/services/file-processor.service.ts

import {
    createReadStream,
    createWriteStream
} from "node:fs";

import {
    mkdir,
    readdir
} from "node:fs/promises";

import path from "node:path";

import {
    Transform
} from "node:stream";

import {
    pipeline
} from "node:stream/promises";

export class FileProcessorService {

    async processDirectory(
        inputDirectory: string,
        outputDirectory: string
    ): Promise<void> {

        await mkdir(outputDirectory, {
            recursive: true
        });

        const files = await readdir(inputDirectory, {
            withFileTypes: true
        });

        for (const file of files) {

            if (!file.isFile()) {
                continue;
            }

            const inputPath = path.join(
                inputDirectory,
                file.name
            );

            const outputPath = path.join(
                outputDirectory,
                file.name
            );

            await this.processFile(
                inputPath,
                outputPath
            );
        }
    }

    private async processFile(
        inputPath: string,
        outputPath: string
    ): Promise<void> {

        const upperCaseTransform = new Transform({
            transform(chunk, encoding, callback) {
                callback(
                    null,
                    chunk.toString().toUpperCase()
                );
            }
        });

        await pipeline(
            createReadStream(inputPath),
            upperCaseTransform,
            createWriteStream(outputPath)
        );

        console.log(
            `Processed: ${path.basename(inputPath)}`
        );
    }
}
```

## 35.5 Create Application

```ts
// src/app.ts

import path from "node:path";

import { FileProcessorService } from "./services/file-processor.service.js";

const processor = new FileProcessorService();

const inputDirectory = path.resolve("input");

const outputDirectory = path.resolve("output");

async function main() {
    try {
        await processor.processDirectory(
            inputDirectory,
            outputDirectory
        );

        console.log("Processing completed");

    } catch (error) {
        console.error("Processing failed:", error);

        process.exitCode = 1;
    }
}

void main();
```

## 35.6 Run the Application

Development:

```bash
npx tsx src/app.ts
```

Production build:

```bash
npx tsc
```

Production execution:

```bash
node dist/app.js
```

**Important limitation:** This example processes text files only. It converts each incoming chunk independently. For arbitrary text encodings or transformations that depend on complete lines or records, use a streaming decoder and preserve state between chunks. Also consider processing files concurrently with a controlled concurrency limit if throughput becomes important.

---

# 36. Common Node.js and TypeScript Mistakes

| Mistake | Why It Is a Problem | Better Approach |
|---|---|---|
| Using synchronous file APIs in request handlers | Blocks the event loop | Use asynchronous APIs |
| Loading huge files with `readFile()` | Can consume excessive memory | Use streams |
| Treating environment variables as numbers | They are strings | Parse and validate |
| Using `any` for Node.js APIs | Reduces type safety | Use `@types/node` |
| Ignoring stream errors | Can cause crashes or incomplete operations | Use `pipeline()` and proper error handling |
| Ignoring backpressure | Can increase memory usage | Respect `write()` return values and `drain` |
| Using `exec()` with untrusted input | Can cause command injection | Prefer `execFile()` or `spawn()` with validated arguments |
| Using Worker Threads for ordinary I/O | Adds unnecessary complexity | Use asynchronous I/O |
| Ignoring graceful shutdown | Resources may be left open | Implement cleanup handlers |
| Assuming `__dirname` exists in ESM | It is not provided automatically | Use `import.meta.url` |
| Trusting TypeScript types for external data | Types do not validate runtime values | Use runtime validation |
| Ignoring path traversal | Can expose files outside intended directories | Resolve and validate file paths |

---

# 37. Advanced Node.js and TypeScript Interview Questions

### Q1. What is `@types/node`?

It is a package containing TypeScript declaration files for Node.js APIs.

### Q2. Why do we need `@types/node`?

It allows TypeScript to understand Node.js global objects, built-in modules, and runtime APIs.

### Q3. What is the `process` object?

It provides information and control over the currently running Node.js process.

### Q4. What is `process.argv`?

It contains the command-line arguments passed to the current process.

### Q5. What is `process.env`?

It provides access to environment variables.

### Q6. Are environment variables strings or numbers?

They are strings or `undefined`.

### Q7. What is `process.cwd()`?

It returns the current working directory of the Node.js process.

### Q8. What is the difference between `process.cwd()` and `__dirname`?

`process.cwd()` returns the process's current working directory. `__dirname` represents the directory of the current CommonJS module.

### Q9. Does ESM provide `__dirname`?

No. It can be derived using `import.meta.url` and Node.js URL/path utilities.

### Q10. What is the Node.js `fs` module?

It provides APIs for interacting with files and directories.

### Q11. What is the difference between synchronous and asynchronous file operations?

Synchronous operations block the current JavaScript thread while they execute. Asynchronous operations allow the event loop to process other work while I/O is pending.

### Q12. What is `fs/promises`?

It provides Promise-based file system APIs.

### Q13. What is the purpose of the `path` module?

It provides cross-platform utilities for manipulating file and directory paths.

### Q14. What is the difference between `path.join()` and `path.resolve()`?

`join()` combines path segments. `resolve()` produces an absolute path.

### Q15. What is path traversal?

It is a vulnerability where user-controlled paths are used to access files outside an intended directory.

### Q16. What is the OS module?

It provides information about the operating system, memory, CPU, network interfaces, and other system details.

### Q17. What is EventEmitter?

It is a Node.js class that supports event-based communication through event registration and emission.

### Q18. What is the difference between `on()` and `once()`?

`on()` registers a listener for repeated events. `once()` registers a listener that executes only once.

### Q19. What is a Buffer?

A Buffer represents a sequence of bytes and is used for handling binary data.

### Q20. What is the difference between Buffer and String?

A string represents text, while a Buffer represents bytes.

### Q21. What is Base64 encoding?

It is a method of representing binary data using a set of printable characters.

### Q22. What is a stream?

A stream is an abstraction for processing data incrementally.

### Q23. What are the four types of Node.js streams?

Readable, Writable, Duplex, and Transform.

### Q24. What is a Readable stream?

A stream that provides data to consumers.

### Q25. What is a Writable stream?

A stream that accepts data to be written.

### Q26. What is a Duplex stream?

A stream that supports both reading and writing.

### Q27. What is a Transform stream?

A Duplex stream that transforms data while it passes through.

### Q28. What is backpressure?

Backpressure is a mechanism that prevents a fast producer from overwhelming a slower consumer.

### Q29. What does `write()` returning `false` mean?

The writable stream's internal buffer has reached its threshold, so the producer should pause until the `drain` event.

### Q30. What is `pipeline()`?

It connects streams and coordinates completion, error propagation, and cleanup.

### Q31. What is a child process?

It is a separate process started by another process.

### Q32. What is the difference between `exec()` and `spawn()`?

`exec()` runs a command through a shell and collects output. `spawn()` exposes streams for process input and output.

### Q33. Why can `exec()` be dangerous?

When untrusted input is incorporated into a shell command, it can enable command injection.

### Q34. What is `execFile()`?

It runs a specified executable directly, without using a shell by default.

### Q35. What is `fork()`?

It starts a new Node.js process with an IPC communication channel.

### Q36. What are Worker Threads?

They allow JavaScript to execute on separate threads within a Node.js process.

### Q37. When should you use Worker Threads?

For CPU-intensive JavaScript tasks that would otherwise block the main event loop.

### Q38. What is the difference between Worker Threads and Child Processes?

Worker Threads use separate threads within one process. Child Processes create separate processes with separate process memory.

### Q39. What is graceful shutdown?

It is the process of safely stopping an application while closing resources and allowing ongoing work to finish.

### Q40. What is event loop blocking?

It occurs when synchronous or CPU-intensive JavaScript prevents the event loop thread from processing other callbacks.

---

# 38. Practical Exercises

Complete these exercises to strengthen your understanding.

## Beginner – Node.js Runtime

**Exercise 1:** Create a TypeScript program that prints Node.js version, platform, architecture, and process ID.

**Exercise 2:** Create a CLI application that accepts a user's name and age through command-line arguments.

**Exercise 3:** Read and validate environment variables.

**Exercise 4:** Create a configuration module using TypeScript.

**Exercise 5:** Create a utility that converts bytes into KB, MB, and GB.

## Intermediate – File System

**Exercise 6:** Create a file using `writeFile()`.

**Exercise 7:** Read all files from a directory.

**Exercise 8:** Rename multiple files using the `path` module.

**Exercise 9:** Create nested directories automatically.

**Exercise 10:** Build a file watcher that monitors a directory.

## Advanced – Buffers and Streams

**Exercise 11:** Convert a string into a Buffer and then into Base64.

**Exercise 12:** Read a large file using a readable stream.

**Exercise 13:** Write data using a writable stream.

**Exercise 14:** Create a Transform stream that converts text to uppercase.

**Exercise 15:** Copy a large video file using `pipeline()`.

**Exercise 16:** Implement a stream-processing utility that handles backpressure correctly.

## Expert – Process and Backend Integration

**Exercise 17:** Execute an external program using `spawn()`.

**Exercise 18:** Create a Worker Thread that calculates factorials.

**Exercise 19:** Build a basic HTTP server using Node.js.

**Exercise 20:** Implement a graceful shutdown system.

**Exercise 21:** Build a file-processing service using streams.

**Exercise 22:** Create a production-style Node.js application with configuration validation, structured logging, and resource cleanup.

---

# 39. Phase 47 Completion Checklist

| No. | Topic | Expected Knowledge |
|---|---|---|
| 1 | TypeScript with Node.js | Build Node.js applications using TypeScript |
| 2 | `@types/node` | Understand Node.js declarations |
| 3 | Runtime Types | Understand Node.js global objects |
| 4 | Process Management | Access and control process information |
| 5 | Environment Variables | Manage application configuration |
| 6 | Type-Safe Configuration | Validate configuration at runtime |
| 7 | File System | Read, write, update and delete files |
| 8 | Async File Operations | Use Promise-based APIs |
| 9 | Path Module | Handle cross-platform paths |
| 10 | Path Security | Prevent basic path traversal |
| 11 | OS Module | Inspect operating system information |
| 12 | Events | Understand event-driven programming |
| 13 | Typed EventEmitter | Build strongly typed events |
| 14 | Buffer | Handle binary data |
| 15 | Binary Encoding | Understand UTF-8, Hex and Base64 |
| 16 | Streams | Understand incremental data processing |
| 17 | Readable Streams | Read data in chunks |
| 18 | Writable Streams | Write data incrementally |
| 19 | Duplex Streams | Handle bidirectional data |
| 20 | Transform Streams | Transform data during processing |
| 21 | Backpressure | Control data flow |
| 22 | Pipeline | Connect streams safely |
| 23 | Child Processes | Execute external programs |
| 24 | Worker Threads | Run CPU-intensive tasks separately |
| 25 | HTTP Module | Build native HTTP servers |
| 26 | Performance | Identify event-loop and memory problems |
| 27 | Graceful Shutdown | Close application resources safely |

---

# 40. What Comes Next?

You now understand how TypeScript integrates with Node.js runtime APIs, including filesystem operations, streams, buffers, processes, worker threads, and HTTP servers.

The next phase will focus on building professional backend applications using TypeScript and Express.

## Phase 48: Advanced TypeScript – Express.js, Middleware Architecture, Controllers, Services, Validation and REST API Development

Upcoming topics:

1. Express.js with TypeScript.
2. Express Application Architecture.
3. Express Type Definitions.
4. Type-Safe Express Requests and Responses.
5. Route Parameter Types.
6. Query Parameter Types.
7. Request Body Types.
8. Custom Request Types.
9. Express Middleware Architecture.
10. Custom Middleware.
11. Authentication Middleware.
12. Authorization Middleware.
13. Error-Handling Middleware.
14. Async Middleware.
15. Controller-Service-Repository Architecture.
16. Dependency Injection.
17. Request Validation with Zod.
18. Response Type Definitions.
19. REST API Design.
20. Type-Safe CRUD APIs.
21. Pagination and Filtering.
22. File Uploads with TypeScript.
23. Authentication with JWT.
24. Password Hashing.
25. Role-Based Access Control.
26. API Error Handling.
27. Logging and Monitoring.
28. Testing Express Applications.
29. Integration Testing.
30. Production Express Architecture.

**Phase 47 is complete.**