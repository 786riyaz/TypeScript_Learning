# Phase 46: Advanced TypeScript – TypeScript Compiler, Configuration, Build Systems and Project Architecture

**Level:** Expert  
**Prerequisites:** TypeScript fundamentals, generics, advanced types, modules, JavaScript runtime fundamentals, Node.js basics and TypeScript project architecture.

---

# 1. Learning Objectives

In this phase, you will understand how TypeScript works internally as a development and compilation tool, how to configure large TypeScript projects, and how to prepare applications for production.

By the end of this phase, you should understand:

1. TypeScript Compiler Deep Dive.
2. TypeScript Compilation Process.
3. TypeScript Compiler API Fundamentals.
4. `tsconfig.json` in Depth.
5. Compiler Options and Their Practical Usage.
6. Strict Type Checking.
7. Module Systems.
8. CommonJS vs ES Modules.
9. Module Resolution Strategies.
10. Path Aliases.
11. Project References.
12. TypeScript Monorepos.
13. Declaration Files (`.d.ts`).
14. Ambient Declarations.
15. Global Type Declarations.
16. Module Augmentation.
17. Declaration Merging.
18. JavaScript Interoperability.
19. Build Tools and Bundlers.
20. TypeScript with Vite.
21. TypeScript with Webpack.
22. TypeScript with esbuild.
23. TypeScript with SWC.
24. Source Maps.
25. Build Optimization.
26. Type Checking in CI/CD.
27. Production TypeScript Project Configuration.
28. Compiler Performance Optimization.

---

# 2. Understanding the TypeScript Compiler

The TypeScript compiler is responsible for analyzing TypeScript code, checking types, resolving modules, and optionally generating JavaScript output.

The official TypeScript compiler is called `tsc`.

You can execute it using:

```bash
npx tsc
```

Check the installed version:

```bash
npx tsc --version
```

Compile a TypeScript file:

```bash
npx tsc app.ts
```

This generates:

```text
app.ts
app.js
```

The generated JavaScript depends on your compiler configuration.

## 2.1 What Does the TypeScript Compiler Do?

Consider:

```ts
const age: number = 25;

function greet(name: string): string {
    return `Hello ${name}`;
}

console.log(greet("John"));
```

The compiler performs several important operations.

### 1. Parsing

The compiler reads your source code and converts it into an internal syntax representation.

For example:

```ts
const age: number = 25;
```

It identifies:

- Variable declaration.
- Variable name.
- Type annotation.
- Initial value.

### 2. Binding

The compiler identifies declarations and establishes relationships between identifiers and their scopes.

For example:

```ts
const name = "John";

function greet() {
    console.log(name);
}
```

The compiler resolves the reference to `name` inside `greet`.

### 3. Type Checking

The compiler checks whether your code follows the declared type rules.

```ts
let age: number = 25;

// Error
age = "Twenty Five";
```

### 4. Transformation

The compiler transforms TypeScript syntax into JavaScript-compatible syntax according to the target and compiler options.

For example:

```ts
const age: number = 25;
```

The type annotation is removed.

Generated JavaScript:

```js
const age = 25;
```

### 5. Emit

The compiler can generate:

- JavaScript files.
- Declaration files.
- Source maps.
- Other compiler outputs.

**Important:** TypeScript compilation does not automatically guarantee that your JavaScript code will work correctly at runtime. Type checking and runtime execution are separate concerns.

---

# 3. TypeScript Compilation Process

Let's understand the complete compilation workflow.

Consider this project:

```text
my-project/
│
├── src/
│   ├── app.ts
│   ├── user.ts
│   └── product.ts
│
├── tsconfig.json
│
└── package.json
```

Suppose `app.ts` imports another file:

```ts
import { getUser } from "./user";

console.log(getUser());
```

The compiler needs to:

1. Read the project configuration.
2. Identify the root source files.
3. Resolve imports.
4. Parse source files.
5. Build symbol and type information.
6. Perform type checking.
7. Generate JavaScript if emission is enabled.
8. Generate declaration files if configured.

## 3.1 Compile Without a Configuration File

You can compile a single file:

```bash
npx tsc app.ts
```

However, when compiling files directly this way, TypeScript does not use the project's `tsconfig.json` in the same way as project compilation.

For a configured project, use:

```bash
npx tsc
```

This searches for `tsconfig.json` in the current directory.

## 3.2 Compile Using a Specific Configuration

```bash
npx tsc -p tsconfig.json
```

You can also use:

```bash
npx tsc --project tsconfig.json
```

## 3.3 Check Types Without Generating JavaScript

```bash
npx tsc --noEmit
```

This is useful when another tool handles JavaScript compilation.

For example:

- Vite handles bundling.
- SWC handles transpilation.
- TypeScript checks types.

This separation is common in modern applications.

---

# 4. Understanding `tsconfig.json`

The `tsconfig.json` file defines how TypeScript should process your project.

Create it using:

```bash
npx tsc --init
```

A typical configuration looks like this:

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
        "forceConsistentCasingInFileNames": true,

        "skipLibCheck": true,

        "declaration": true,
        "sourceMap": true,

        "noEmitOnError": true
    },

    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist"]
}
```

Let's understand the important options.

---

# 5. Important Compiler Options

## 5.1 `target`

The `target` option determines the JavaScript language version TypeScript emits.

Example:

```json
{
    "compilerOptions": {
        "target": "ES2022"
    }
}
```

Common values:

| Target | Description |
|---|---|
| `ES5` | Older JavaScript compatibility |
| `ES2015` | ES6 |
| `ES2017` | ES2017 |
| `ES2020` | ES2020 |
| `ES2022` | ES2022 |
| `ESNext` | Latest JavaScript features supported by the compiler |

Example:

TypeScript:

```ts
const greet = (name: string) => {
    return `Hello ${name}`;
};
```

With an older target, some syntax may be transformed.

With a modern target, the output may remain nearly identical.

**Important:** `target` does not automatically polyfill missing runtime APIs.

For example, compiling to ES5 does not automatically provide a missing `Promise` implementation in an old browser.

## 5.2 `module`

The `module` option controls the module format generated by TypeScript.

Common values:

```text
CommonJS
ESNext
ES2020
Node16
NodeNext
Preserve
```

Example:

```json
{
    "compilerOptions": {
        "module": "CommonJS"
    }
}
```

Input:

```ts
import { getUser } from "./user";

export default getUser;
```

CommonJS output will use mechanisms such as `require` and `exports`.

With an ES module configuration, import/export syntax is generally preserved.

The correct setting depends on your runtime and build tools.

## 5.3 `moduleResolution`

This controls how TypeScript resolves imported modules.

Example:

```json
{
    "compilerOptions": {
        "module": "NodeNext",
        "moduleResolution": "NodeNext"
    }
}
```

Common strategies include:

| Strategy | Typical Use |
|---|---|
| `Classic` | Legacy TypeScript resolution |
| `Node10` | Older Node.js resolution behavior |
| `Node16` | Modern Node.js package resolution |
| `NodeNext` | Modern Node.js ESM/CommonJS behavior |
| `Bundler` | Applications using modern bundlers |

For modern Node.js applications, `NodeNext` is often appropriate when using Node's native module system.

For Vite-based applications, `Bundler` is commonly appropriate.

## 5.4 `rootDir`

Defines the root directory of source files for output structure.

```json
{
    "compilerOptions": {
        "rootDir": "./src"
    }
}
```

Example:

```text
src/
    app.ts
    controllers/
        user.controller.ts
```

## 5.5 `outDir`

Defines where compiled JavaScript files should be generated.

```json
{
    "compilerOptions": {
        "outDir": "./dist"
    }
}
```

Example:

```text
src/
    app.ts

dist/
    app.js
```

## 5.6 `strict`

Enables a collection of stricter type-checking options.

```json
{
    "compilerOptions": {
        "strict": true
    }
}
```

This is strongly recommended for new TypeScript projects.

## 5.7 `noEmit`

Prevents TypeScript from generating output files.

```json
{
    "compilerOptions": {
        "noEmit": true
    }
}
```

Useful when Vite, SWC, or another tool handles transpilation.

## 5.8 `declaration`

Generates `.d.ts` declaration files.

```json
{
    "compilerOptions": {
        "declaration": true
    }
}
```

This is particularly useful when developing reusable libraries.

## 5.9 `sourceMap`

Generates source maps.

```json
{
    "compilerOptions": {
        "sourceMap": true
    }
}
```

Source maps help connect generated JavaScript back to the original TypeScript during debugging.

## 5.10 `skipLibCheck`

```json
{
    "compilerOptions": {
        "skipLibCheck": true
    }
}
```

Skips type checking of declaration files (`.d.ts`).

This can reduce compilation time in some projects.

However, it does not disable checking of your own application code.

## 5.11 `removeComments`

```json
{
    "compilerOptions": {
        "removeComments": true
    }
}
```

Removes comments from generated JavaScript.

This does not affect TypeScript type checking.

## 5.12 `noEmitOnError`

```json
{
    "compilerOptions": {
        "noEmitOnError": true
    }
}
```

Prevents TypeScript from emitting output when errors are reported.

This is useful for build pipelines.

---

# 6. Strict Type Checking

The `strict` option enables several important compiler checks.

Let's understand them individually.

## 6.1 `strictNullChecks`

Without strict null checking, `null` and `undefined` can be assigned to many other types.

With:

```json
{
    "compilerOptions": {
        "strictNullChecks": true
    }
}
```

Consider:

```ts
let name: string = "John";

// Error
name = null;
```

You must explicitly allow null:

```ts
let name: string | null = "John";

name = null;
```

## 6.2 `noImplicitAny`

Prevents TypeScript from silently inferring `any` in situations where it cannot determine a type.

```ts
function greet(name) {
    console.log(name);
}
```

With `noImplicitAny`, this can produce an error because `name` has an implicit `any` type.

Correct:

```ts
function greet(name: string) {
    console.log(name);
}
```

## 6.3 `strictFunctionTypes`

Enables stricter checking of function parameter compatibility.

This helps prevent unsafe function assignments.

## 6.4 `strictPropertyInitialization`

Checks whether class properties are initialized appropriately.

Example:

```ts
class User {
    name: string;
}
```

This can produce an error because `name` is not initialized.

Correct:

```ts
class User {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}
```

Or:

```ts
class User {
    name = "John";
}
```

## 6.5 `noImplicitThis`

Prevents `this` from implicitly having an `any` type in certain contexts.

## 6.6 `useUnknownInCatchVariables`

Makes catch clause variables default to `unknown`.

```ts
try {
    throw new Error("Something failed");
} catch (error) {
    if (error instanceof Error) {
        console.log(error.message);
    }
}
```

This encourages safe error handling.

## 6.7 `noUncheckedIndexedAccess`

Consider:

```ts
const users = ["John", "David"];

const user = users[10];
```

Without additional checking, TypeScript may treat the result as `string`.

With:

```json
{
    "compilerOptions": {
        "noUncheckedIndexedAccess": true
    }
}
```

The result includes `undefined`:

```ts
string | undefined
```

This reflects the fact that the requested array element may not exist.

## 6.8 `exactOptionalPropertyTypes`

Consider:

```ts
type User = {
    name?: string;
};
```

With this option enabled, an optional property means that the property may be absent.

It does not automatically mean that explicitly assigning `undefined` is allowed.

```ts
const user1: User = {};

// Error with exactOptionalPropertyTypes
const user2: User = {
    name: undefined
};
```

If you want to permit explicit `undefined`:

```ts
type User = {
    name?: string | undefined;
};
```

### Strict Options Summary

| Option | Purpose |
|---|---|
| `strict` | Enables strict checking options |
| `strictNullChecks` | Checks null and undefined |
| `noImplicitAny` | Prevents implicit any |
| `strictFunctionTypes` | Stricter function parameter checking |
| `strictPropertyInitialization` | Checks class property initialization |
| `noImplicitThis` | Checks implicit this types |
| `useUnknownInCatchVariables` | Makes catch variables unknown |
| `noUncheckedIndexedAccess` | Adds undefined to unchecked indexed access |
| `exactOptionalPropertyTypes` | Distinguishes missing properties from explicit undefined |

---

# 7. Understanding Module Systems

Modules allow developers to divide applications into reusable files.

JavaScript has two major module systems:

1. CommonJS.
2. ECMAScript Modules (ESM).

TypeScript supports both, depending on the compiler configuration and runtime.

## 7.1 CommonJS

CommonJS is commonly associated with traditional Node.js applications.

Export:

```js
// user.js

function getUser() {
    return {
        id: 1,
        name: "John"
    };
}

module.exports = {
    getUser
};
```

Import:

```js
// app.js

const { getUser } = require("./user");

console.log(getUser());
```

Important syntax:

```js
module.exports = {};
```

And:

```js
const value = require("./file");
```

## 7.2 ES Modules

ES Modules are the standard JavaScript module system.

Export:

```ts
// user.ts

export function getUser() {
    return {
        id: 1,
        name: "John"
    };
}
```

Import:

```ts
// app.ts

import { getUser } from "./user";

console.log(getUser());
```

You can also use default exports:

```ts
export default function getUser() {
    return {
        id: 1,
        name: "John"
    };
}
```

Import:

```ts
import getUser from "./user";
```

## 7.3 CommonJS vs ES Modules

| Feature | CommonJS | ES Modules |
|---|---|---|
| Import | `require()` | `import` |
| Export | `module.exports` | `export` |
| Loading | Traditionally synchronous in Node.js | Static module structure |
| Standard | Node.js ecosystem convention | JavaScript language standard |
| Tree shaking | Less straightforward | Better static analysis support |
| Browser support | Requires bundling or compatibility tooling | Native browser support |
| Dynamic loading | `require()` | `import()` |

### Important Differences

ES Modules use static import declarations:

```ts
import { getUser } from "./user";
```

Dynamic imports are also supported:

```ts
const module = await import("./user");
```

CommonJS:

```js
const module = require("./user");
```

### Which Should You Use?

For new frontend applications, ES Modules are generally the standard choice.

For Node.js applications, choose the module system based on your runtime, dependencies, and deployment environment.

Do not mix CommonJS and ESM syntax without understanding the interoperability rules.

---

# 8. TypeScript with CommonJS

Let's configure a basic Node.js project using CommonJS.

Project structure:

```text
node-app/
│
├── src/
│   ├── app.ts
│   └── user.ts
│
├── dist/
│
├── package.json
└── tsconfig.json
```

### package.json

```json
{
    "name": "node-app",
    "version": "1.0.0",
    "main": "dist/app.js",
    "scripts": {
        "build": "tsc",
        "start": "node dist/app.js",
        "dev": "tsx watch src/app.ts"
    },
    "devDependencies": {
        "@types/node": "^22.0.0",
        "tsx": "^4.0.0",
        "typescript": "^5.0.0"
    }
}
```

The versions above are illustrative. Use compatible versions for your project.

### tsconfig.json

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "CommonJS",
        "moduleResolution": "Node10",

        "rootDir": "./src",
        "outDir": "./dist",

        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true
    },

    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist"]
}
```

### app.ts

```ts
import { getUser } from "./user";

console.log(getUser());
```

### user.ts

```ts
export function getUser() {
    return {
        id: 1,
        name: "John"
    };
}
```

Build:

```bash
npm run build
```

Run:

```bash
npm start
```

Development:

```bash
npm run dev
```

`tsx` executes TypeScript files with a fast development workflow. It does not replace a separate type-checking step.

**Note:** For a modern CommonJS Node.js project, `moduleResolution: "Node10"` is a compatibility choice. For modern Node.js ESM or dual-module packages, consider `NodeNext`.

---

# 9. TypeScript with ES Modules

For a modern Node.js ESM project, use a compatible package configuration.

### package.json

```json
{
    "name": "node-app",
    "version": "1.0.0",
    "type": "module",
    "scripts": {
        "build": "tsc",
        "start": "node dist/app.js",
        "dev": "tsx watch src/app.ts"
    }
}
```

### tsconfig.json

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

        "declaration": true,
        "sourceMap": true,

        "skipLibCheck": true
    },

    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist"]
}
```

### app.ts

```ts
import { getUser } from "./user.js";

console.log(getUser());
```

Notice:

```ts
"./user.js"
```

Even though the source file is `user.ts`, the import specifier uses `.js`.

With NodeNext resolution, this is a common approach because the emitted JavaScript file will be named `user.js`.

### Important

The `"type": "module"` property tells Node.js to interpret `.js` files in that package scope as ES modules.

The exact behavior depends on Node.js module rules, file extensions, and package boundaries.

---

# 10. Module Resolution Strategies

Module resolution determines how TypeScript finds imported files.

Consider:

```ts
import { getUser } from "./services/user";
```

TypeScript needs to locate the correct module.

It considers:

- Relative paths.
- Package names.
- Package exports.
- File extensions.
- Directory structure.
- `package.json` metadata.
- Module resolution configuration.

## 10.1 Relative Imports

```ts
import { getUser } from "./user";
```

```ts
import { getProduct } from "../products/product";
```

Relative imports are resolved from the importing file.

## 10.2 Package Imports

```ts
import express from "express";
```

TypeScript searches for the package using the configured module resolution strategy.

## 10.3 NodeNext Resolution

```json
{
    "compilerOptions": {
        "module": "NodeNext",
        "moduleResolution": "NodeNext"
    }
}
```

This follows modern Node.js ESM and CommonJS resolution rules.

## 10.4 Bundler Resolution

```json
{
    "compilerOptions": {
        "module": "ESNext",
        "moduleResolution": "Bundler"
    }
}
```

This is designed for bundler-based environments.

It supports modern package resolution behavior used by tools such as Vite.

### Comparison

| Feature | NodeNext | Bundler |
|---|---|---|
| Intended environment | Native Node.js | Bundler-based applications |
| Package exports | Supported | Supported |
| Node.js ESM rules | Respected | Not fully enforced as native Node rules |
| Bundler-style extension handling | Not the primary goal | Supported |
| Typical use | Node.js applications and libraries | Vite and other bundled applications |

---

# 11. Path Aliases

Path aliases allow you to avoid long relative import paths.

Consider:

```ts
import { getUser } from "../../../services/user.service";
```

This becomes difficult to maintain in large applications.

Instead, define an alias.

## 11.1 Configure `baseUrl` and `paths`

```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"],
            "@services/*": ["src/services/*"],
            "@controllers/*": ["src/controllers/*"]
        }
    }
}
```

Now you can write:

```ts
import { getUser } from "@services/user.service";
```

Or:

```ts
import { UserController } from "@controllers/user.controller";
```

## 11.2 Important: TypeScript Path Aliases Are Not Automatically Runtime Aliases

This is an important concept.

The following configuration:

```json
{
    "compilerOptions": {
        "paths": {
            "@/*": ["src/*"]
        }
    }
}
```

helps TypeScript resolve imports.

But it does not automatically rewrite the import paths in emitted JavaScript.

For example:

```ts
import { getUser } from "@/services/user";
```

May remain:

```js
import { getUser } from "@/services/user";
```

Node.js does not automatically understand this alias.

You need a runtime or build-tool configuration that supports the same alias.

### Vite Example

```ts
import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    }
});
```

You should keep the TypeScript and Vite alias configurations consistent.

---

# 12. Project References

Project references allow you to divide a large TypeScript codebase into smaller, independently configured projects.

This is useful for:

- Monorepos.
- Large applications.
- Shared libraries.
- Incremental builds.
- Separating backend and frontend packages.

## 12.1 Example Structure

```text
project/
│
├── packages/
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
├── tsconfig.json
└── package.json
```

## 12.2 Root Configuration

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

## 12.3 Shared Package Configuration

```json
{
    "compilerOptions": {
        "composite": true,
        "declaration": true,
        "declarationMap": true,

        "rootDir": "./src",
        "outDir": "./dist",

        "strict": true
    },

    "include": ["src/**/*"]
}
```

## 12.4 Backend References Shared

Backend configuration:

```json
{
    "compilerOptions": {
        "composite": true,
        "declaration": true,

        "rootDir": "./src",
        "outDir": "./dist",

        "strict": true
    },

    "references": [
        {
            "path": "../shared"
        }
    ],

    "include": ["src/**/*"]
}
```

## 12.5 Build the Complete Project

Use:

```bash
npx tsc --build
```

Or:

```bash
npx tsc -b
```

TypeScript builds the referenced projects in dependency order.

For larger projects, incremental build information can help avoid unnecessary rebuilds.

---

# 13. TypeScript Monorepos

A monorepo is a single repository containing multiple related projects or packages.

For example:

```text
my-company/
│
├── apps/
│   ├── web/
│   ├── admin/
│   └── api/
│
├── packages/
│   ├── shared-types/
│   ├── ui/
│   ├── validation/
│   └── utilities/
│
├── package.json
└── tsconfig.base.json
```

This structure allows multiple applications to reuse common code.

## 13.1 Why Use a Monorepo?

Suppose you have:

- Next.js frontend.
- React admin panel.
- Node.js backend.

All three applications may need common types.

Instead of duplicating types, create:

```text
packages/shared-types/
```

Example:

```ts
// packages/shared-types/src/user.ts

export interface User {
    id: number;
    name: string;
    email: string;
}
```

Frontend:

```ts
import type { User } from "@company/shared-types";
```

Backend:

```ts
import type { User } from "@company/shared-types";
```

Now both applications can share the same type definitions.

## 13.2 Workspace Configuration

A root `package.json` can use npm workspaces:

```json
{
    "name": "my-company",
    "private": true,
    "workspaces": [
        "apps/*",
        "packages/*"
    ]
}
```

You can use npm, pnpm, or Yarn workspaces to manage packages.

Popular monorepo tools include:

- [Turborepo](https://turborepo.com/?utm_source=chatgpt.com)
- [Nx](https://nx.dev/?utm_source=chatgpt.com)

These tools help with task orchestration, dependency graphs, caching, and builds.

### Important Distinction

A monorepo is a repository organization strategy.

Project references are a TypeScript compilation feature.

Workspaces manage packages and dependencies.

They solve related but different problems.

---

# 14. Declaration Files (`.d.ts`)

Declaration files describe the types of JavaScript code.

They do not contain normal runtime implementation logic.

Example:

```text
src/
    user.js
    user.d.ts
```

JavaScript implementation:

```js
// user.js

function getUser() {
    return {
        id: 1,
        name: "John"
    };
}

module.exports = {
    getUser
};
```

Declaration file:

```ts
// user.d.ts

export function getUser(): {
    id: number;
    name: string;
};
```

Now TypeScript can understand the JavaScript module's type information.

## 14.1 Why Are Declaration Files Important?

They are used by:

- JavaScript libraries.
- npm packages.
- TypeScript applications.
- Third-party dependencies.
- Global APIs.

For example, many JavaScript packages provide TypeScript declaration files.

## 14.2 Generate Declaration Files

Configure:

```json
{
    "compilerOptions": {
        "declaration": true,
        "declarationMap": true,
        "emitDeclarationOnly": false
    }
}
```

Then:

```bash
npx tsc
```

TypeScript generates `.d.ts` files alongside the configured output.

## 14.3 Declaration-Only Output

You can generate declarations without JavaScript:

```json
{
    "compilerOptions": {
        "declaration": true,
        "emitDeclarationOnly": true
    }
}
```

This is useful when another tool generates the JavaScript bundle.

---

# 15. Ambient Declarations

Ambient declarations describe existing JavaScript values or APIs that TypeScript does not know about.

They use the `declare` keyword.

Example:

```ts
declare const APP_VERSION: string;
```

Now TypeScript understands:

```ts
console.log(APP_VERSION);
```

However, this declaration does not create the variable.

The runtime environment must provide it.

## 15.1 Declaring a Global Function

```ts
declare function showNotification(
    message: string
): void;
```

Now:

```ts
showNotification("Welcome");
```

TypeScript accepts the call.

But the actual function must exist at runtime.

## 15.2 Declaring a Global Object

```ts
declare const appConfig: {
    environment: string;
    version: string;
};
```

Usage:

```ts
console.log(appConfig.environment);
```

Again, this only describes the value.

It does not create it.

---

# 16. Global Type Declarations

Sometimes you want to extend the global TypeScript environment.

Create:

```text
src/
    types/
        global.d.ts
```

Example:

```ts
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string;
            JWT_SECRET: string;
            NODE_ENV: "development" | "production" | "test";
        }
    }
}

export {};
```

Now TypeScript can provide more useful types for:

```ts
process.env.DATABASE_URL;
```

### Important

This does not validate environment variables at runtime.

You still need to check that the variables actually exist.

Example:

```ts
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing");
}
```

A runtime validation library is another good option.

---

# 17. Module Augmentation

Module augmentation allows you to extend the types of an existing module.

Suppose a library provides:

```ts
interface Request {
    headers: Record<string, string>;
}
```

You want to add an authenticated user property.

You can augment the module.

```ts
declare module "some-library" {
    interface Request {
        user?: {
            id: number;
            email: string;
        };
    }
}
```

Now TypeScript understands the additional property.

## 17.1 Express Example

Suppose you are using Express.

Create:

```text
src/
    types/
        express.d.ts
```

Code:

```ts
import "express";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
            };
        }
    }
}
```

Now inside an Express controller:

```ts
import type { Request, Response } from "express";

export function profileController(
    req: Request,
    res: Response
) {
    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    return res.json({
        user: req.user
    });
}
```

TypeScript understands `req.user`.

**Important:** Module augmentation changes type information only. Your authentication middleware must actually populate `req.user` at runtime.

---

# 18. Declaration Merging

Declaration merging means TypeScript can combine multiple declarations with the same name under certain conditions.

## 18.1 Interface Merging

```ts
interface User {
    id: number;
}

interface User {
    name: string;
}
```

TypeScript combines them.

Result:

```ts
interface User {
    id: number;
    name: string;
}
```

## 18.2 Namespace Merging

```ts
namespace App {
    export const version = "1.0.0";
}

namespace App {
    export function getName() {
        return "My Application";
    }
}
```

Both declarations contribute to the same namespace.

## 18.3 Class and Namespace Merging

```ts
class User {
    constructor(public name: string) {}
}

namespace User {
    export function create(name: string) {
        return new User(name);
    }
}
```

Usage:

```ts
const user = User.create("John");
```

## 18.4 What Can Merge?

| Declaration Combination | Supported? |
|---|---|
| Interface + Interface | Yes |
| Namespace + Namespace | Yes |
| Class + Namespace | Yes, under supported rules |
| Function + Namespace | Yes, under supported rules |
| Enum + Namespace | Yes, under supported rules |
| Class + Class | No |
| Type Alias + Type Alias | No |

### Interface vs Type Alias

Interfaces can participate in declaration merging.

Type aliases cannot be reopened in the same way.

Use interfaces when declaration merging or library augmentation is useful.

Use type aliases when defining unions, intersections, tuples, conditional types, and other type expressions.

---

# 19. JavaScript Interoperability

TypeScript can work with existing JavaScript code.

This is important when migrating a JavaScript project to TypeScript.

## 19.1 Enable JavaScript Files

```json
{
    "compilerOptions": {
        "allowJs": true,
        "checkJs": true
    }
}
```

`allowJs` allows JavaScript files to participate in the project.

`checkJs` enables type checking for JavaScript files.

## 19.2 Using JSDoc

You can add type information to JavaScript using JSDoc.

Example:

```js
/**
 * @param {string} name
 * @returns {string}
 */
function greet(name) {
    return `Hello ${name}`;
}
```

TypeScript can understand this function's signature.

## 19.3 JavaScript Migration

Suppose your existing project is:

```text
src/
    app.js
    user.js
    product.js
```

You can gradually migrate:

```text
src/
    app.ts
    user.ts
    product.js
```

Then convert additional files over time.

A gradual migration is often safer than rewriting the entire project at once.

## 19.4 `allowImportingTsExtensions`

This option allows imports that explicitly use TypeScript file extensions in configurations designed for no-emit or declaration-only workflows.

Example:

```ts
import { getUser } from "./user.ts";
```

It has specific compiler constraints and is not a general solution for native Node.js runtime imports.

---

# 20. Build Tools and Bundlers

TypeScript compilation and application bundling are related but different tasks.

### TypeScript Compiler

Responsible for:

- Type checking.
- Type inference.
- Type resolution.
- JavaScript emission.
- Declaration generation.

### Bundler

Responsible for tasks such as:

- Combining modules.
- Dependency graph processing.
- Tree shaking.
- Code splitting.
- Asset handling.
- Production optimization.

Popular tools include:

| Tool | Main Purpose |
|---|---|
| TypeScript (`tsc`) | Type checking and compilation |
| Vite | Development server and production build |
| Webpack | Module bundling |
| esbuild | Fast JavaScript and TypeScript transformation and bundling |
| SWC | Fast JavaScript/TypeScript transformation |
| Rollup | Module bundling |
| tsx | TypeScript execution for development workflows |

A bundler may remove TypeScript syntax without performing complete TypeScript type checking.

This distinction is critical.

---

# 21. TypeScript with Vite

Vite is commonly used for modern frontend applications.

It supports TypeScript out of the box.

Create a React TypeScript project:

```bash
npm create vite@latest my-app -- --template react-ts
```

Move into the project:

```bash
cd my-app
```

Install dependencies:

```bash
npm install
```

Start development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

## 21.1 How Vite Handles TypeScript

Vite uses a fast transformation pipeline to process TypeScript.

However, Vite does not perform full TypeScript type checking as part of its normal transformation step.

You should run TypeScript separately.

Add a script:

```json
{
    "scripts": {
        "dev": "vite",
        "type-check": "tsc --noEmit",
        "build": "tsc -b && vite build"
    }
}
```

This gives you:

1. Type checking.
2. Production bundling.

### Why Is This Separation Useful?

Type checking can be computationally expensive.

A fast transpilation tool can transform files while TypeScript checks the project separately.

This provides a responsive development experience without sacrificing type safety.

---

# 22. TypeScript with Webpack

Webpack is a module bundler.

It can process TypeScript through loaders.

One common setup uses `ts-loader`.

Install:

```bash
npm install -D webpack webpack-cli typescript ts-loader
```

Create:

```text
webpack.config.js
```

Configuration:

```js
const path = require("node:path");

module.exports = {
    mode: "development",

    entry: "./src/index.ts",

    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    },

    resolve: {
        extensions: [".ts", ".js"]
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    }
};
```

Run:

```bash
npx webpack
```

## 22.1 Webpack with Type Checking

`ts-loader` can invoke TypeScript compilation and type checking.

You can also configure:

```js
{
    test: /\.ts$/,
    use: {
        loader: "ts-loader",
        options: {
            transpileOnly: true
        }
    }
}
```

With `transpileOnly: true`, type checking is skipped by that loader.

You then need a separate type-checking process, such as `tsc --noEmit` or an appropriate checking plugin.

---

# 23. TypeScript with esbuild

esbuild is a very fast JavaScript and TypeScript transformation tool.

It supports:

- TypeScript syntax.
- JavaScript transformation.
- Bundling.
- Minification.
- Source maps.
- Tree shaking.

Install:

```bash
npm install -D esbuild
```

Example:

```bash
npx esbuild src/app.ts \
    --bundle \
    --outfile=dist/app.js \
    --platform=node \
    --target=es2022
```

This bundles the application into one JavaScript output file.

## 23.1 Important Limitation

esbuild removes TypeScript-specific syntax but does not perform complete TypeScript type checking.

Therefore, use:

```bash
npx tsc --noEmit
```

when you need TypeScript type validation.

---

# 24. TypeScript with SWC

SWC is a fast JavaScript/TypeScript compiler and transformation tool written in Rust.

It is used by several modern frameworks and build systems.

SWC can:

- Transform TypeScript.
- Transform JSX.
- Transform modern JavaScript.
- Minify JavaScript.
- Support source maps.

Install:

```bash
npm install -D @swc/core @swc/cli
```

Create:

```text
.swcrc
```

Configuration:

```json
{
    "jsc": {
        "parser": {
            "syntax": "typescript"
        },
        "target": "es2022"
    },
    "module": {
        "type": "es6"
    }
}
```

Run:

```bash
npx swc src -d dist
```

### SWC vs TypeScript Compiler

| Feature | TypeScript Compiler | SWC |
|---|---|---|
| Type checking | Yes | No |
| TypeScript transformation | Yes | Yes |
| Fast transformation | Good | Designed for speed |
| Declaration generation | Yes | Not its normal role |
| Rust implementation | No | Yes |
| Typical use | Type checking and compilation | Fast transformation |

**Remember:** SWC is not a replacement for TypeScript's type checker.

---

# 25. Source Maps

Source maps connect generated JavaScript back to the original TypeScript source.

Suppose you have:

```text
src/
    app.ts

dist/
    app.js
    app.js.map
```

The file:

```text
app.js.map
```

contains mapping information.

This allows debugging tools to show the original TypeScript code when execution occurs in the generated JavaScript.

## 25.1 Enable Source Maps

```json
{
    "compilerOptions": {
        "sourceMap": true
    }
}
```

## 25.2 Inline Source Maps

```json
{
    "compilerOptions": {
        "inlineSourceMap": true
    }
}
```

This embeds source map data inside the generated JavaScript file.

Do not enable both `sourceMap` and `inlineSourceMap` together.

## 25.3 Inline Sources

```json
{
    "compilerOptions": {
        "sourceMap": true,
        "inlineSources": true
    }
}
```

This includes the original source content in the source map.

### Why Are Source Maps Useful?

They help with:

- Debugging.
- Stack trace analysis.
- Production error investigation.
- Browser developer tools.
- Node.js debugging.

---

# 26. Build Optimization

Production builds should be optimized for performance and reliability.

Some important techniques:

## 26.1 Use a Modern Target

```json
{
    "compilerOptions": {
        "target": "ES2022"
    }
}
```

Choose a target based on the actual runtime support you need.

## 26.2 Separate Development and Production Configurations

Example:

```text
tsconfig.json
tsconfig.build.json
```

Base configuration:

```json
{
    "compilerOptions": {
        "strict": true,
        "target": "ES2022",
        "module": "NodeNext",
        "moduleResolution": "NodeNext"
    }
}
```

Production build configuration:

```json
{
    "extends": "./tsconfig.json",
    "compilerOptions": {
        "outDir": "./dist",
        "rootDir": "./src",
        "sourceMap": true,
        "declaration": true
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

Build:

```bash
npx tsc -p tsconfig.build.json
```

## 26.3 Incremental Compilation

Enable:

```json
{
    "compilerOptions": {
        "incremental": true
    }
}
```

TypeScript stores build information so it can reuse previous compilation work.

The build information file can be configured using:

```json
{
    "compilerOptions": {
        "incremental": true,
        "tsBuildInfoFile": "./.cache/tsbuildinfo"
    }
}
```

## 26.4 Avoid Unnecessary Imports

Prefer:

```ts
import type { User } from "./types";
```

When importing only a type.

This makes type-only dependencies explicit.

It is especially useful when managing module output and avoiding unnecessary runtime imports.

## 26.5 Tree Shaking

Tree shaking removes unused code from production bundles when the bundler can safely determine that it is unused.

Example:

```ts
// math.ts

export function add(a: number, b: number) {
    return a + b;
}

export function subtract(a: number, b: number) {
    return a - b;
}
```

If another module imports only `add`, a suitable bundler may remove unused `subtract` code from the production bundle.

Tree shaking is a bundler optimization, not a TypeScript type-checking feature.

---

# 27. Type Checking in CI/CD

CI/CD stands for:

- Continuous Integration.
- Continuous Delivery or Deployment.

TypeScript projects should perform type checking automatically before deployment.

Suppose you use GitHub Actions.

Create:

```text
.github/
    workflows/
        ci.yml
```

Example:

```yaml
name: TypeScript CI

on:
  push:
    branches:
      - main

  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install Dependencies
        run: npm ci

      - name: Type Check
        run: npx tsc --noEmit

      - name: Build
        run: npm run build
```

This workflow:

1. Checks out the repository.
2. Installs Node.js.
3. Installs dependencies.
4. Runs TypeScript type checking.
5. Builds the application.

You can add testing and linting steps too.

**Important:** CI should use the same TypeScript configuration and build commands that are used locally.

---

# 28. Production TypeScript Project Configuration

Now let's create a practical configuration for a Node.js backend application.

This example uses:

- Node.js.
- TypeScript.
- Express.
- ES Modules.
- Strict type checking.
- Declaration generation.
- Source maps.

## 28.1 Project Structure

```text
backend/
│
├── src/
│   ├── config/
│   │   └── database.ts
│   │
│   ├── controllers/
│   │   └── user.controller.ts
│   │
│   ├── routes/
│   │   └── user.routes.ts
│   │
│   ├── services/
│   │   └── user.service.ts
│   │
│   ├── types/
│   │   └── user.ts
│   │
│   └── app.ts
│
├── dist/
│
├── package.json
├── tsconfig.json
└── .gitignore
```

## 28.2 Install Dependencies

```bash
npm init -y
```

Install Express:

```bash
npm install express
```

Install development dependencies:

```bash
npm install -D typescript tsx @types/node @types/express
```

## 28.3 package.json

```json
{
    "name": "typescript-backend",
    "version": "1.0.0",
    "private": true,
    "type": "module",

    "scripts": {
        "dev": "tsx watch src/app.ts",
        "type-check": "tsc --noEmit",
        "build": "tsc -p tsconfig.json",
        "start": "node dist/app.js"
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

These dependency versions are illustrative. Install versions compatible with your environment.

## 28.4 tsconfig.json

```json
{
    "compilerOptions": {
        "target": "ES2022",

        "module": "NodeNext",
        "moduleResolution": "NodeNext",

        "rootDir": "./src",
        "outDir": "./dist",

        "strict": true,

        "noImplicitAny": true,
        "strictNullChecks": true,
        "strictFunctionTypes": true,
        "strictPropertyInitialization": true,

        "noUncheckedIndexedAccess": true,
        "exactOptionalPropertyTypes": true,

        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,

        "skipLibCheck": true,

        "declaration": true,
        "sourceMap": true,

        "noEmitOnError": true
    },

    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist"]
}
```

## 28.5 Define User Type

```ts
// src/types/user.ts

export interface User {
    id: number;
    name: string;
    email: string;
}
```

## 28.6 Create User Service

```ts
// src/services/user.service.ts

import type { User } from "../types/user.js";

const users: User[] = [
    {
        id: 1,
        name: "John",
        email: "john@example.com"
    }
];

export function getUsers(): User[] {
    return users;
}

export function getUserById(id: number): User | undefined {
    return users.find(user => user.id === id);
}
```

## 28.7 Create Controller

```ts
// src/controllers/user.controller.ts

import type { Request, Response } from "express";

import {
    getUsers,
    getUserById
} from "../services/user.service.js";

export function getAllUsers(
    req: Request,
    res: Response
) {
    return res.json(getUsers());
}

export function getSingleUser(
    req: Request,
    res: Response
) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid user ID"
        });
    }

    const user = getUserById(id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    return res.json(user);
}
```

## 28.8 Create Routes

```ts
// src/routes/user.routes.ts

import { Router } from "express";

import {
    getAllUsers,
    getSingleUser
} from "../controllers/user.controller.js";

const router = Router();

router.get("/", getAllUsers);

router.get("/:id", getSingleUser);

export default router;
```

## 28.9 Create Application

```ts
// src/app.ts

import express from "express";

import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

## 28.10 Run the Application

Development:

```bash
npm run dev
```

Type checking:

```bash
npm run type-check
```

Production build:

```bash
npm run build
```

Start:

```bash
npm start
```

Now you have a structured TypeScript backend project with a separate development, type-checking, and production build workflow.

---

# 29. Compiler Performance Optimization

Large TypeScript projects can experience slow compilation and editor responsiveness.

Let's understand how to improve performance.

## 29.1 Avoid Extremely Complex Types

Avoid unnecessary nested conditional types and complicated recursive transformations.

Prefer smaller reusable types.

Instead of writing one enormous conditional type, split it into several understandable utilities.

## 29.2 Avoid Large Union Expansions

Example:

```ts
type A = "a" | "b" | "c" | "d";

type B = "1" | "2" | "3" | "4";

type Result = `${A}-${B}`;
```

This produces combinations of both unions.

As the unions grow, the number of possible combinations grows rapidly.

Keep generated unions manageable.

## 29.3 Use Project References

For very large codebases, divide the project into smaller compilation units.

This can improve build organization and enable incremental builds.

## 29.4 Use Incremental Builds

```json
{
    "compilerOptions": {
        "incremental": true
    }
}
```

This allows TypeScript to reuse build information.

## 29.5 Use `skipLibCheck` Where Appropriate

```json
{
    "compilerOptions": {
        "skipLibCheck": true
    }
}
```

This may reduce checking time for dependency declaration files.

It does not fix incorrect dependency types; it merely skips checking those declaration files.

## 29.6 Understand TypeScript Diagnostic Tools

You can inspect compilation performance using:

```bash
npx tsc --extendedDiagnostics
```

This provides information such as:

- Files processed.
- Types created.
- Instantiations.
- Memory usage.
- Check time.
- Total compilation time.

For more detailed tracing:

```bash
npx tsc --generateTrace trace-output
```

This generates tracing information that can help investigate compiler performance.

## 29.7 Avoid Importing Unnecessary Modules

Keep dependencies focused.

Import only what your application needs.

Use type-only imports when appropriate:

```ts
import type { User } from "./user.js";
```

This helps clarify which imports are needed only for compile-time checking.

---

# 30. Common TypeScript Configuration Mistakes

| Mistake | Problem | Better Approach |
|---|---|---|
| Setting `strict` to false without reason | Reduces type safety | Enable strict mode |
| Confusing `target` with runtime compatibility | Target does not polyfill APIs | Configure runtime support separately |
| Confusing `module` with `moduleResolution` | They solve different problems | Configure both appropriately |
| Assuming `paths` rewrites imports | Runtime may not understand aliases | Configure bundler or runtime |
| Assuming Vite performs full type checking | Transformation is not full type checking | Run `tsc --noEmit` |
| Assuming SWC checks types | SWC transforms syntax | Use TypeScript checker separately |
| Ignoring declaration files | Library consumers lose type information | Generate `.d.ts` when publishing libraries |
| Mixing ESM and CommonJS carelessly | Can cause runtime module errors | Understand Node.js module rules |
| Ignoring source maps | Debugging becomes harder | Enable source maps where appropriate |
| Building without type checking | Type errors can reach deployment | Add type-checking to CI/CD |
| Using `any` to fix compiler errors | Hides actual problems | Resolve the underlying type mismatch |

---

# 31. Advanced TypeScript Interview Questions and Answers

### Q1. What is the TypeScript compiler?

The TypeScript compiler analyzes TypeScript code, performs type checking, resolves modules, and can generate JavaScript and declaration files.

### Q2. What is `tsc`?

`tsc` is the command-line TypeScript compiler.

### Q3. What is `tsconfig.json`?

It is the configuration file that defines how TypeScript processes a project.

### Q4. What is the purpose of `target`?

It controls the JavaScript language version emitted by the TypeScript compiler.

### Q5. Does `target` automatically add polyfills?

No. It controls syntax transformation, not automatic runtime API polyfills.

### Q6. What is the purpose of `module`?

It controls the module format used in emitted JavaScript.

### Q7. What is `moduleResolution`?

It determines how TypeScript locates imported modules and packages.

### Q8. What is the difference between CommonJS and ESM?

CommonJS uses `require` and `module.exports`, while ESM uses `import` and `export`.

### Q9. What is `strict`?

It enables a collection of strict type-checking options.

### Q10. What is `strictNullChecks`?

It makes `null` and `undefined` distinct types that must be handled explicitly.

### Q11. What is `noImplicitAny`?

It prevents implicit `any` types in situations where TypeScript cannot infer a suitable type.

### Q12. What is `noUncheckedIndexedAccess`?

It adds `undefined` to types obtained through potentially unchecked indexed access.

### Q13. What is `exactOptionalPropertyTypes`?

It distinguishes between an optional property being absent and a property explicitly having the value `undefined`.

### Q14. What is `noEmit`?

It prevents TypeScript from generating output files.

### Q15. What is `outDir`?

It specifies the directory where generated files should be placed.

### Q16. What is `rootDir`?

It specifies the root directory used to preserve source structure in emitted output.

### Q17. What are declaration files?

Declaration files describe the types of JavaScript modules or APIs using `.d.ts` files.

### Q18. What is the purpose of `declaration: true`?

It instructs TypeScript to generate declaration files.

### Q19. What are ambient declarations?

They describe existing runtime variables, functions, or modules without providing their implementations.

### Q20. What is declaration merging?

It allows compatible TypeScript declarations with the same name to be combined.

### Q21. What is module augmentation?

It extends the type declarations of an existing module.

### Q22. What are global declarations?

They describe values and types that are available globally.

### Q23. What are project references?

They allow a TypeScript project to depend on other TypeScript projects through explicit references.

### Q24. What is a monorepo?

A monorepo is a single repository containing multiple related applications or packages.

### Q25. What is the difference between a monorepo and project references?

A monorepo is a repository organization strategy. Project references are a TypeScript compilation feature.

### Q26. What are path aliases?

They provide alternative import paths configured through TypeScript's `paths` option.

### Q27. Do TypeScript path aliases automatically work in Node.js?

No. TypeScript's `paths` configuration does not automatically rewrite runtime import paths.

### Q28. What is Vite?

Vite is a frontend development server and build tool that supports fast module transformation and production bundling.

### Q29. Does Vite perform full TypeScript type checking?

Not as part of its normal TypeScript transformation pipeline. Run a separate TypeScript check.

### Q30. What is Webpack?

Webpack is a module bundler that processes an application's dependency graph and generates bundles.

### Q31. What is esbuild?

esbuild is a fast JavaScript and TypeScript transformation and bundling tool.

### Q32. What is SWC?

SWC is a fast JavaScript and TypeScript transformation tool implemented in Rust.

### Q33. Does SWC perform TypeScript type checking?

No. Use the TypeScript compiler for full type checking.

### Q34. What are source maps?

Source maps connect generated JavaScript code to its original source files.

### Q35. What is tree shaking?

Tree shaking removes unused code from production bundles when the bundler can safely identify it.

### Q36. What is incremental compilation?

It reuses previously generated build information to reduce unnecessary compilation work.

### Q37. What is `skipLibCheck`?

It skips type checking of declaration files.

### Q38. What is `noEmitOnError`?

It prevents JavaScript output from being emitted when TypeScript reports errors.

### Q39. What is CI/CD?

CI/CD is a development practice that automates integration, testing, building, and delivery or deployment.

### Q40. Why should TypeScript type checking be included in CI/CD?

It prevents code containing TypeScript errors from passing the automated validation pipeline.

---

# 32. Practical Exercises

Complete these exercises to strengthen your understanding.

## Beginner – Compiler and Configuration

**Exercise 1:** Create a TypeScript project using `tsconfig.json`.

**Exercise 2:** Configure `rootDir` and `outDir`.

**Exercise 3:** Enable strict type checking.

**Exercise 4:** Configure source maps.

**Exercise 5:** Configure declaration file generation.

## Intermediate – Modules and Architecture

**Exercise 6:** Create a Node.js TypeScript application using CommonJS.

**Exercise 7:** Create the same application using ES Modules.

**Exercise 8:** Configure path aliases.

**Exercise 9:** Create a global declaration file.

**Exercise 10:** Create a custom `.d.ts` declaration for a JavaScript module.

## Advanced – Build Systems

**Exercise 11:** Create a React TypeScript application using Vite.

**Exercise 12:** Add a separate type-checking command.

**Exercise 13:** Configure Webpack to process TypeScript.

**Exercise 14:** Build a TypeScript application using esbuild.

**Exercise 15:** Configure SWC for TypeScript transformation.

## Expert – Production Architecture

**Exercise 16:** Create a monorepo containing frontend, backend, and shared-types packages.

**Exercise 17:** Configure TypeScript project references.

**Exercise 18:** Create a reusable shared-types package.

**Exercise 19:** Implement Express module augmentation.

**Exercise 20:** Create a GitHub Actions workflow that checks and builds your TypeScript application.

---

# 33. Phase 46 Completion Checklist

| No. | Topic | Expected Knowledge |
|---|---|---|
| 1 | TypeScript Compiler | Understand compiler responsibilities |
| 2 | Compilation Process | Understand parsing, binding, checking and emission |
| 3 | `tsconfig.json` | Configure projects |
| 4 | Compiler Options | Understand important configuration settings |
| 5 | Strict Mode | Enable strict type checking |
| 6 | Module Systems | Understand CommonJS and ESM |
| 7 | Module Resolution | Configure import resolution |
| 8 | Path Aliases | Create maintainable import paths |
| 9 | Project References | Divide large TypeScript projects |
| 10 | Monorepos | Share code across applications |
| 11 | Declaration Files | Create and consume `.d.ts` files |
| 12 | Ambient Declarations | Describe external runtime APIs |
| 13 | Global Declarations | Extend global types |
| 14 | Module Augmentation | Extend existing module definitions |
| 15 | Declaration Merging | Understand merging behavior |
| 16 | JavaScript Interoperability | Gradually migrate JavaScript |
| 17 | Vite | Use TypeScript with Vite |
| 18 | Webpack | Configure TypeScript loaders |
| 19 | esbuild | Understand fast transformation |
| 20 | SWC | Understand TypeScript transformation |
| 21 | Source Maps | Debug generated JavaScript |
| 22 | Build Optimization | Optimize production builds |
| 23 | CI/CD | Automate type checking and builds |
| 24 | Compiler Performance | Diagnose and improve compilation |

---

# 34. What Comes Next?

You now understand the TypeScript compiler, project configuration, module systems, declaration files, build tools, and production build workflows.

The next phase will focus on using TypeScript with JavaScript runtime APIs and advanced backend development.

## Phase 47: Advanced TypeScript – Node.js Integration, Runtime APIs, Streams, Buffers, File System and Process Management

Upcoming topics:

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

**Phase 46 is complete.**