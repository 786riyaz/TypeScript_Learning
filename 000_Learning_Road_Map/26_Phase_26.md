# Phase 26: TypeScript Configuration and Project Architecture – Advanced `tsconfig.json`

**Level:** Advanced  
**Prerequisites:**
- Phase 2: TypeScript Environment Setup
- Phase 23: Modules and Namespaces
- Phase 24: Compiler Internals
- Phase 25: Type Compatibility

## Learning Objectives

By the end of this phase, you will understand:

1. What `tsconfig.json` is.
2. How TypeScript reads compiler configuration.
3. `target` and ECMAScript versions.
4. `module` and module systems.
5. `moduleResolution`.
6. `rootDir` and `outDir`.
7. `include`, `exclude`, and `files`.
8. Strict compiler options.
9. Null-checking options.
10. Module interoperability.
11. `esModuleInterop` and `allowSyntheticDefaultImports`.
12. `baseUrl` and `paths`.
13. `types` and `typeRoots`.
14. `lib` and runtime APIs.
15. `declaration` and `declarationMap`.
16. `sourceMap` and `inlineSourceMap`.
17. `isolatedModules`.
18. `verbatimModuleSyntax`.
19. `noEmit` and `noEmitOnError`.
20. Development vs production configurations.
21. Node.js TypeScript configuration.
22. React TypeScript configuration.
23. Next.js TypeScript configuration.
24. Configuration inheritance.
25. Professional project configuration.

---

# 1. What Is `tsconfig.json`?

`tsconfig.json` is the configuration file used by the TypeScript compiler.

It tells TypeScript how to compile and check your project.

It defines things such as:

- Which files should be included.
- Which JavaScript version should be generated.
- Which module system should be used.
- Where compiled files should be generated.
- How strict type checking should be.
- How modules should be resolved.
- Whether declaration files should be generated.
- Whether source maps should be generated.

### Example

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "NodeNext",
        "strict": true,
        "rootDir": "./src",
        "outDir": "./dist"
    },
    "include": ["src"],
    "exclude": ["node_modules"]
}
```

### How does TypeScript use this file?

When you run:

```bash
npx tsc
```

TypeScript searches for a `tsconfig.json` in the current directory.

It reads the configuration and compiles the configured project.

### Creating a configuration file

```bash
npx tsc --init
```

This generates a `tsconfig.json` file containing compiler configuration options and explanatory comments.

### Important

If you run:

```bash
npx tsc app.ts
```

TypeScript compiles the specified file directly and does not use the project's `tsconfig.json` in the normal project-compilation manner.

For an explicit project configuration, use:

```bash
npx tsc -p tsconfig.json
```

---

# 2. Understanding the Structure of `tsconfig.json`

A TypeScript configuration file primarily contains these sections:

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "NodeNext",
        "strict": true
    },
    "include": [
        "src/**/*"
    ],
    "exclude": [
        "node_modules"
    ],
    "files": []
}
```

Let's understand the important properties.

| Property | Purpose |
|---|---|
| `compilerOptions` | Controls compiler behavior |
| `include` | Specifies file patterns to include |
| `exclude` | Excludes matching files from automatic inclusion |
| `files` | Explicitly specifies root source files |
| `extends` | Inherits configuration from another configuration file |
| `references` | Defines project references |

### Important

`compilerOptions` contains most of the settings you will configure in professional projects.

---

# 3. Understanding `target`

The `target` option determines the JavaScript language version that TypeScript emits.

In simple terms:

**It controls how modern the generated JavaScript syntax can be.**

### Example

```json
{
    "compilerOptions": {
        "target": "ES5"
    }
}
```

This tells TypeScript to generate JavaScript compatible with an older ECMAScript target, where possible.

Compare:

```json
{
    "compilerOptions": {
        "target": "ES2022"
    }
}
```

This allows modern JavaScript syntax to remain in the output when supported by that target.

### Common target values

| Target | Meaning |
|---|---|
| `ES5` | ECMAScript 5 |
| `ES2015` | ECMAScript 2015 |
| `ES2016` | ECMAScript 2016 |
| `ES2017` | ECMAScript 2017 |
| `ES2018` | ECMAScript 2018 |
| `ES2019` | ECMAScript 2019 |
| `ES2020` | ECMAScript 2020 |
| `ES2021` | ECMAScript 2021 |
| `ES2022` | ECMAScript 2022 |
| `ES2023` | ECMAScript 2023 |
| `ES2024` | ECMAScript 2024 |
| `ESNext` | Latest ECMAScript features supported by the compiler |

### Example

TypeScript:

```typescript
const greet = (name: string): string => {
    return `Hello ${name}`;
};
```

With a modern target, the emitted JavaScript can retain arrow functions and template literals.

With an older target, TypeScript may transform some syntax into older JavaScript equivalents.

### Important

`target` does not automatically install missing JavaScript features.

For example, compiling to ES5 does not automatically provide a runtime implementation of every modern API.

You may need polyfills for features such as:

- `Promise`
- `Map`
- `Set`
- `Array.prototype.includes()`

### `target` vs `lib`

These two options are related but different.

| `target` | `lib` |
|---|---|
| Controls JavaScript syntax emitted | Controls built-in API/type declarations available during checking |
| Influences downlevel transformations | Influences which standard library APIs TypeScript knows about |
| Affects generated JavaScript | Does not itself provide runtime implementations |

We will explore `lib` later.

---

# 4. Understanding `module`

The `module` option determines the module format TypeScript uses when emitting JavaScript.

JavaScript has different module systems.

The most important are:

1. CommonJS.
2. ECMAScript Modules (ESM).

## A. CommonJS

CommonJS is traditionally used in Node.js applications.

Example:

```typescript
import express from "express";

export function startServer(): void {
    console.log("Server started");
}
```

With:

```json
{
    "compilerOptions": {
        "module": "CommonJS"
    }
}
```

The emitted JavaScript uses CommonJS-style module operations, approximately:

```javascript
const express_1 = require("express");

function startServer() {
    console.log("Server started");
}

exports.startServer = startServer;
```

## B. ES Modules

ES Modules are the standard JavaScript module system.

Example:

```typescript
import express from "express";

export function startServer(): void {
    console.log("Server started");
}
```

With:

```json
{
    "compilerOptions": {
        "module": "ESNext"
    }
}
```

The emitted JavaScript can preserve:

```javascript
import express from "express";

export function startServer() {
    console.log("Server started");
}
```

### Common module options

| Option | Meaning |
|---|---|
| `CommonJS` | CommonJS module output |
| `ESNext` | Latest supported ECMAScript module syntax |
| `ES2022` | ECMAScript 2022 module output |
| `Node16` | Node.js-aware module behavior |
| `NodeNext` | Latest Node.js-aware module behavior |
| `Preserve` | Preserves module syntax for downstream tools |

### Important

`module` and `target` are different.

- `target` controls the JavaScript language target.
- `module` controls the module system and related output behavior.

### Example

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "NodeNext"
    }
}
```

This is a common configuration approach for Node.js applications using modern ESM.

---

# 5. Understanding `moduleResolution`

The `moduleResolution` option determines how TypeScript resolves imported modules.

Consider:

```typescript
import { getUser } from "./services/userService";
```

TypeScript needs to locate the module.

Module resolution determines how it searches for the corresponding file or package.

### Common resolution strategies

| Strategy | Purpose |
|---|---|
| `Classic` | Older TypeScript resolution strategy |
| `Node10` | Legacy Node.js resolution behavior |
| `Node16` | Modern Node.js module resolution |
| `NodeNext` | Latest Node.js-aware module resolution |
| `Bundler` | Resolution designed for modern bundlers |

### A. NodeNext

Used for Node.js projects that follow Node.js module rules.

```json
{
    "compilerOptions": {
        "module": "NodeNext",
        "moduleResolution": "NodeNext"
    }
}
```

This understands Node.js ESM and CommonJS package behavior.

### B. Bundler

Used in applications built with bundlers such as:

- Vite.
- Webpack.
- Rollup.
- esbuild-based tooling.

Example:

```json
{
    "compilerOptions": {
        "module": "ESNext",
        "moduleResolution": "Bundler"
    }
}
```

### Important

`moduleResolution: "Bundler"` supports resolution behavior commonly used by bundlers, including package export maps and extension handling that differs from Node.js ESM rules.

### NodeNext vs Bundler

| NodeNext | Bundler |
|---|---|
| Models Node.js module resolution | Models bundler-style resolution |
| Useful for Node.js applications | Useful for frontend applications |
| Follows Node.js ESM/CJS rules | Supports bundler-oriented import resolution |
| Relative ESM imports generally need explicit emitted extensions | Bundlers often resolve extensionless imports |

### Example

In a Node.js ESM project:

```typescript
import { getUser } from "./user.js";
```

Even though the source file is `user.ts`, the import can use `.js` because the emitted JavaScript file is `user.js`.

In a bundler-based frontend project:

```typescript
import { getUser } from "./user";
```

The bundler can resolve the source file according to its resolution rules.

---

# 6. Understanding `rootDir`

The `rootDir` option specifies the root directory of source files for determining the structure of emitted output.

### Example project

```text
project/
│
├── src/
│   ├── app.ts
│   ├── server.ts
│   │
│   └── controllers/
│       └── userController.ts
│
└── tsconfig.json
```

Configuration:

```json
{
    "compilerOptions": {
        "rootDir": "./src"
    }
}
```

TypeScript treats `src` as the root of the source directory structure.

### What does this mean?

If the source file is:

```text
src/controllers/userController.ts
```

Its relative location under `rootDir` is:

```text
controllers/userController.ts
```

That relative structure is preserved under the output directory.

### Important

`rootDir` does not determine which files are included.

It controls the source directory structure used for output and enforces that emitted source files belong under the specified root.

Use `include`, `files`, and project references to control the compilation inputs.

---

# 7. Understanding `outDir`

The `outDir` option specifies where compiled JavaScript and other emitted files should be placed.

### Example

```json
{
    "compilerOptions": {
        "rootDir": "./src",
        "outDir": "./dist"
    }
}
```

Project:

```text
project/
│
├── src/
│   ├── app.ts
│   └── controllers/
│       └── userController.ts
│
├── dist/
└── tsconfig.json
```

After compilation:

```text
project/
│
├── src/
│   ├── app.ts
│   └── controllers/
│       └── userController.ts
│
├── dist/
│   ├── app.js
│   └── controllers/
│       └── userController.js
│
└── tsconfig.json
```

### `rootDir` vs `outDir`

| `rootDir` | `outDir` |
|---|---|
| Defines the source root for emitted structure | Defines the output directory |
| Works with source files | Receives generated files |
| Example: `./src` | Example: `./dist` |

### Important

TypeScript generally preserves the relative directory structure from `rootDir` inside `outDir`.

---

# 8. Understanding `include`

The `include` option specifies file patterns that TypeScript should include as root files.

### Example

```json
{
    "include": [
        "src"
    ]
}
```

This includes supported TypeScript and JavaScript files under `src`, subject to the relevant compiler settings.

### More specific example

```json
{
    "include": [
        "src/**/*.ts",
        "src/**/*.tsx"
    ]
}
```

This includes:

- `.ts` files.
- `.tsx` files.

### Multiple directories

```json
{
    "include": [
        "src",
        "tests",
        "scripts"
    ]
}
```

### Important

The `include` patterns determine root files.

Imported dependencies can also become part of the program even if they are not directly listed in `include`.

---

# 9. Understanding `exclude`

The `exclude` option removes matching files from automatic inclusion through `include`.

### Example

```json
{
    "include": [
        "src"
    ],
    "exclude": [
        "node_modules",
        "dist",
        "tests"
    ]
}
```

This excludes the matching files from the automatic root-file discovery performed through `include`.

### Important clarification

`exclude` does not guarantee that a file will never be part of the TypeScript program.

A file excluded through `exclude` can still be included if it is imported by another included file or explicitly listed through `files`.

### Example

Suppose:

```text
src/
├── app.ts
└── helpers/
    └── utility.ts
```

Configuration:

```json
{
    "include": ["src"],
    "exclude": ["src/helpers"]
}
```

If `app.ts` imports:

```typescript
import { helper } from "./helpers/utility";
```

Then `utility.ts` can still become part of the program through the import.

### Remember

- `include`: Finds root files.
- `exclude`: Filters automatic root-file discovery.
- Imports: Can bring additional files into the program.

---

# 10. Understanding `files`

The `files` option explicitly lists the root source files.

### Example

```json
{
    "files": [
        "src/app.ts",
        "src/server.ts"
    ]
}
```

Only these files are specified as root files.

However, their imported dependencies can also be included.

### `files` vs `include`

| `files` | `include` |
|---|---|
| Explicit file list | File pattern matching |
| Useful for a small fixed set of files | Useful for larger projects |
| Does not use glob patterns | Supports glob patterns |

### Can both be used?

Yes.

```json
{
    "files": [
        "src/global.d.ts"
    ],
    "include": [
        "src/**/*.ts"
    ]
}
```

This includes the explicitly listed file and files matching the include patterns.

---

# 11. Understanding `strict`

The `strict` option enables a collection of strict type-checking options.

### Example

```json
{
    "compilerOptions": {
        "strict": true
    }
}
```

This enables several checks, including:

- `noImplicitAny`
- `strictNullChecks`
- `strictFunctionTypes`
- `strictBindCallApply`
- `strictPropertyInitialization`
- `noImplicitThis`
- `useUnknownInCatchVariables`
- `alwaysStrict`
- `strictBuiltinIteratorReturn`

The exact set is defined by the TypeScript compiler version.

### Why use strict mode?

Without strict mode, TypeScript may allow code that contains potentially unsafe assumptions.

Example:

```typescript
function greet(name) {
    return name.toUpperCase();
}
```

With `noImplicitAny` enabled, TypeScript reports an error because `name` has an implicit `any` type.

Better:

```typescript
function greet(name: string): string {
    return name.toUpperCase();
}
```

### Professional recommendation

For new TypeScript projects, use:

```json
{
    "compilerOptions": {
        "strict": true
    }
}
```

You can selectively disable individual strict checks if a project has a specific requirement.

---

# 12. Understanding `noImplicitAny`

This option reports cases where TypeScript would otherwise infer an implicit `any` type.

### Example

```typescript
function add(a, b) {
    return a + b;
}
```

With:

```json
{
    "compilerOptions": {
        "noImplicitAny": true
    }
}
```

TypeScript reports errors because the parameters have implicit `any` types.

### Correct version

```typescript
function add(a: number, b: number): number {
    return a + b;
}
```

### Important

`noImplicitAny` does not prohibit explicitly writing `any`.

This is still accepted:

```typescript
function process(value: any): any {
    return value;
}
```

To avoid unsafe `any`, use `unknown` where appropriate.

---

# 13. Understanding `strictNullChecks`

This option makes `null` and `undefined` distinct types that must be handled explicitly.

### Without strict null checking

TypeScript allows more assignments involving `null` and `undefined`.

### With strict null checking

```json
{
    "compilerOptions": {
        "strictNullChecks": true
    }
}
```

Consider:

```typescript
let username: string = "Riyaz";

username = null;
```

This is invalid.

Why?

`null` is not assignable to `string`.

### Correct approach

```typescript
let username: string | null = "Riyaz";

username = null;
```

### Function example

```typescript
function getUsername(): string | undefined {
    return undefined;
}
```

Usage:

```typescript
const username = getUsername();

console.log(username.toUpperCase());
```

This produces an error because `username` may be `undefined`.

### Safe version

```typescript
if (username !== undefined) {
    console.log(username.toUpperCase());
}
```

### Why is this important?

It prevents many common runtime errors involving:

- Missing database records.
- Optional API fields.
- DOM elements that may not exist.
- Uninitialized variables.
- Optional function results.

---

# 14. Understanding `strictFunctionTypes`

This option checks function parameter compatibility more strictly.

```json
{
    "compilerOptions": {
        "strictFunctionTypes": true
    }
}
```

It primarily enforces contravariant parameter checking for ordinary function types.

### Example

```typescript
interface Animal {
    name: string;
}

interface Dog extends Animal {
    breed: string;
}

type AnimalHandler = (animal: Animal) => void;

type DogHandler = (dog: Dog) => void;

const handleDog: DogHandler = (dog) => {
    console.log(dog.breed);
};

const handleAnimal: AnimalHandler = handleDog;
```

With strict function checking, this assignment is invalid.

Why?

An `AnimalHandler` may receive an ordinary animal, but `handleDog` requires a dog.

### Important

Method declarations and constructor declarations retain a bivariance exception.

---

# 15. Understanding `strictPropertyInitialization`

This option checks whether class properties are initialized.

It is enabled by `strict: true`.

### Example

```typescript
class User {
    name: string;
}
```

TypeScript reports an error because `name` is not initialized.

### Solution 1: Initialize in the declaration

```typescript
class User {
    name: string = "Riyaz";
}
```

### Solution 2: Initialize in the constructor

```typescript
class User {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}
```

### Solution 3: Use a definite assignment assertion

```typescript
class User {
    name!: string;
}
```

This tells TypeScript that you will initialize the property through some other mechanism.

### Important

The `!` does not initialize the property at runtime.

Use it only when you can guarantee initialization.

---

# 16. Understanding `noImplicitThis`

This option reports cases where `this` has an implicit `any` type.

### Example

```typescript
function greet() {
    console.log(this.name);
}
```

Depending on the context, TypeScript may report an implicit `any` error for `this`.

### Better approach

Define an explicit `this` parameter:

```typescript
interface User {
    name: string;
}

function greet(this: User): void {
    console.log(this.name);
}
```

Usage:

```typescript
const user: User = {
    name: "Riyaz"
};

greet.call(user);
```

### Important

The `this` parameter is a TypeScript-only declaration.

It does not appear as a normal runtime parameter in the generated JavaScript.

---

# 17. Understanding `noUncheckedIndexedAccess`

This option adds `undefined` to types obtained through potentially missing indexed properties.

### Example

```typescript
const users = ["Riyaz", "Ahmed"];

const username = users[10];
```

Without this option, TypeScript generally treats `username` as `string`.

But the index may not exist.

Enable:

```json
{
    "compilerOptions": {
        "noUncheckedIndexedAccess": true
    }
}
```

Now:

```typescript
const username = users[10];
```

The inferred type includes:

```typescript
string | undefined
```

### Safe usage

```typescript
if (username !== undefined) {
    console.log(username.toUpperCase());
}
```

### Important

This option is especially useful when working with:

- Arrays.
- Dynamic object keys.
- Dictionaries.
- Database lookup results.
- API response maps.

---

# 18. Understanding `exactOptionalPropertyTypes`

This option changes how optional properties are treated.

### Example

```typescript
interface User {
    name?: string;
}
```

Without `exactOptionalPropertyTypes`, this is generally accepted:

```typescript
const user: User = {
    name: undefined
};
```

With:

```json
{
    "compilerOptions": {
        "exactOptionalPropertyTypes": true
    }
}
```

The assignment is invalid unless the type explicitly includes `undefined`.

Correct version:

```typescript
interface User {
    name?: string | undefined;
}
```

### Difference

| `name?: string` | Meaning |
|---|---|
| Property absent | Allowed |
| Property present with string | Allowed |
| Property present with `undefined` | Depends on `exactOptionalPropertyTypes` |

### Why use this option?

It helps distinguish between:

- A property that does not exist.
- A property that exists but has an undefined value.

This distinction can matter in API updates and object serialization.

---

# 19. Understanding `esModuleInterop`

This option improves interoperability between CommonJS and ES module import syntax.

### Example

Suppose you are using a CommonJS package:

```javascript
module.exports = function greet() {
    console.log("Hello");
};
```

You may want to import it using:

```typescript
import greet from "some-package";
```

With:

```json
{
    "compilerOptions": {
        "esModuleInterop": true
    }
}
```

TypeScript enables compatibility behavior that makes common default-import patterns work more naturally with CommonJS modules.

It also enables `allowSyntheticDefaultImports`.

### What does it change?

Depending on the module target and emit settings, TypeScript may generate interoperability helper code.

### Important

`esModuleInterop` does not convert a CommonJS package into a native ES module.

It changes TypeScript's interoperability behavior.

### Practical example

```typescript
import express from "express";

const app = express();
```

This import style is commonly used in TypeScript Node.js applications.

---

# 20. Understanding `allowSyntheticDefaultImports`

This option allows default imports from modules that do not explicitly provide a default export, when the module system or tooling supports that interoperability.

### Example

```typescript
import express from "express";
```

Some CommonJS packages do not have a native ES module default export.

This option allows TypeScript to accept certain synthetic default import patterns.

### Difference from `esModuleInterop`

| `allowSyntheticDefaultImports` | `esModuleInterop` |
|---|---|
| Mainly affects type-checking acceptance of default imports | Enables broader interoperability behavior |
| Does not itself generate interoperability helpers | Can generate helpers depending on emit configuration |
| Does not automatically change runtime module behavior | Influences emitted interop behavior |

### Important

Neither option guarantees that every runtime or bundler will interpret an import identically.

Runtime module compatibility still depends on the package format and execution environment.

---

# 21. Understanding `baseUrl`

The `baseUrl` option establishes a base directory for resolving non-relative module imports.

### Project structure

```text
project/
│
├── src/
│   ├── app.ts
│   └── services/
│       └── userService.ts
│
└── tsconfig.json
```

Without path configuration:

```typescript
import { getUser } from "./services/userService";
```

With a suitable `baseUrl`:

```json
{
    "compilerOptions": {
        "baseUrl": "./src"
    }
}
```

You can write:

```typescript
import { getUser } from "services/userService";
```

### Important

`baseUrl` affects TypeScript module resolution.

It does not automatically configure Node.js or every bundler to resolve the same import.

### Version note

Modern TypeScript supports `paths` without requiring `baseUrl` in all cases. `baseUrl` is optional for path mappings and should only be configured when its resolution behavior is needed.

---

# 22. Understanding `paths`

The `paths` option defines module path aliases for TypeScript resolution.

### Project structure

```text
project/
│
├── src/
│   ├── app.ts
│   │
│   ├── services/
│   │   └── userService.ts
│   │
│   └── utils/
│       └── helper.ts
│
└── tsconfig.json
```

Configuration:

```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@services/*": [
                "src/services/*"
            ],
            "@utils/*": [
                "src/utils/*"
            ]
        }
    }
}
```

Now you can write:

```typescript
import { getUser } from "@services/userService";

import { formatDate } from "@utils/helper";
```

### Why use aliases?

They make imports cleaner.

Without aliases:

```typescript
import { getUser } from "../../../services/userService";
```

With aliases:

```typescript
import { getUser } from "@services/userService";
```

### Important: TypeScript does not rewrite paths

The `paths` option helps TypeScript resolve imports during type checking.

It does not automatically rewrite the emitted JavaScript import paths.

For runtime compatibility, configure your bundler, runtime, or package import mapping appropriately.

For example:

- Vite: configure `resolve.alias`.
- Webpack: configure aliases.
- Node.js: use supported package imports or another appropriate runtime resolution strategy.

---

# 23. Understanding `types`

The `types` option specifies which visible `@types` packages should be included in the global scope.

### Example

```json
{
    "compilerOptions": {
        "types": [
            "node"
        ]
    }
}
```

This includes Node.js type declarations.

Install them:

```bash
npm install -D @types/node
```

### Another example

```json
{
    "compilerOptions": {
        "types": [
            "node",
            "jest"
        ]
    }
}
```

This makes the relevant global declarations available from those packages.

### Important

The `types` option controls automatic inclusion of global type packages.

It does not prevent explicitly imported packages from using their own types.

### Example

```typescript
import express from "express";
```

The type declarations associated with the imported package can still be resolved through normal module resolution.

---

# 24. Understanding `typeRoots`

The `typeRoots` option specifies directories in which TypeScript searches for type packages.

### Example

```json
{
    "compilerOptions": {
        "typeRoots": [
            "./node_modules/@types",
            "./custom-types"
        ]
    }
}
```

Project:

```text
project/
│
├── node_modules/
│   └── @types/
│
├── custom-types/
│   └── my-library/
│       └── index.d.ts
│
└── tsconfig.json
```

### `types` vs `typeRoots`

| `types` | `typeRoots` |
|---|---|
| Selects specific visible type packages | Selects directories to search |
| Example: `["node"]` | Example: `["./node_modules/@types"]` |
| Controls automatic global type inclusion | Controls type package search locations |

### Important

If you specify `typeRoots`, TypeScript uses those locations rather than its default visible `@types` package locations.

Be careful not to accidentally exclude required type packages.

---

# 25. Understanding `lib`

The `lib` option specifies which built-in JavaScript and environment API type declarations are available during type checking.

### Example

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "lib": [
            "ES2022",
            "DOM",
            "DOM.Iterable"
        ]
    }
}
```

This makes declarations available for:

- ECMAScript 2022 APIs.
- Browser APIs.
- DOM iterable APIs.

### Common libraries

| Library | Purpose |
|---|---|
| `ES5` | ECMAScript 5 declarations |
| `ES2015` | ECMAScript 2015 declarations |
| `ES2020` | ECMAScript 2020 declarations |
| `ES2022` | ECMAScript 2022 declarations |
| `ESNext` | Latest supported ECMAScript library declarations |
| `DOM` | Browser DOM APIs |
| `DOM.Iterable` | Iterable DOM interfaces |
| `WebWorker` | Web Worker APIs |
| `ScriptHost` | Script host APIs |

### Browser example

```typescript
const element = document.getElementById("username");
```

The `DOM` library provides TypeScript declarations for `document` and related browser APIs.

### Node.js example

```typescript
import fs from "node:fs";

const files = fs.readdirSync(".");
```

Node.js APIs are generally described by the Node.js type declarations:

```bash
npm install -D @types/node
```

### Important

`lib` only provides type declarations.

It does not install or implement runtime APIs.

For example, adding `DOM` to `lib` does not make `document` available inside Node.js.

---

# 26. Understanding `declaration`

The `declaration` option generates `.d.ts` declaration files.

### Configuration

```json
{
    "compilerOptions": {
        "declaration": true
    }
}
```

### Example source

```typescript
export interface User {
    id: number;
    name: string;
}

export function getUser(id: number): User {
    return {
        id,
        name: "Riyaz"
    };
}
```

The compiler can generate a declaration file similar to:

```typescript
export interface User {
    id: number;
    name: string;
}

export declare function getUser(id: number): User;
```

### Why are declaration files important?

They allow other projects to understand the public types of your package without needing its TypeScript implementation.

They are particularly useful when publishing:

- NPM packages.
- Shared libraries.
- SDKs.
- Internal company packages.
- Reusable components.

### Important

A `.d.ts` file describes types.

It does not contain the implementation of the functions.

---

# 27. Understanding `declarationMap`

The `declarationMap` option generates source maps for declaration files.

### Configuration

```json
{
    "compilerOptions": {
        "declaration": true,
        "declarationMap": true
    }
}
```

Generated files may include:

```text
dist/
├── app.js
├── app.d.ts
└── app.d.ts.map
```

### Why is this useful?

When another project consumes your library, editor navigation can connect declaration information back to the original TypeScript source.

This improves:

- Go to Definition.
- Navigation.
- Debugging.
- Library development experience.

### Important

`declarationMap` is particularly useful when publishing TypeScript libraries or using project references.

---

# 28. Understanding `sourceMap`

The `sourceMap` option generates source map files.

### Configuration

```json
{
    "compilerOptions": {
        "sourceMap": true
    }
}
```

Generated output:

```text
dist/
├── app.js
└── app.js.map
```

### What is a source map?

A source map connects generated JavaScript back to the original TypeScript source.

Suppose your TypeScript code is:

```typescript
function greet(name: string): string {
    return `Hello ${name}`;
}
```

After compilation, JavaScript is generated.

When debugging the JavaScript, source maps allow supported developer tools to display the original TypeScript source and map execution locations back to it.

### Why are source maps useful?

They help with:

- Debugging.
- Stack traces.
- Browser developer tools.
- Node.js debugging.
- Production error analysis.

### Important

Source maps do not change runtime behavior.

They provide mapping information for debugging tools.

---

# 29. Understanding `inlineSourceMap`

Instead of generating a separate `.map` file, TypeScript can embed source map information inside the generated JavaScript.

### Configuration

```json
{
    "compilerOptions": {
        "inlineSourceMap": true
    }
}
```

### Comparison

| `sourceMap` | `inlineSourceMap` |
|---|---|
| Generates a separate `.map` file | Embeds the source map in the generated file |
| JavaScript and map are separate | Map data is inside JavaScript |
| Common in many build workflows | Can be useful in specialized environments |

### Important

Do not normally enable both `sourceMap` and `inlineSourceMap`.

They represent alternative source map output strategies.

---

# 30. Understanding `noEmit`

The `noEmit` option prevents TypeScript from generating output files.

### Configuration

```json
{
    "compilerOptions": {
        "noEmit": true
    }
}
```

Now:

```bash
npx tsc
```

TypeScript checks the project but does not generate JavaScript output.

### When is this useful?

It is useful when another tool handles JavaScript transformation.

For example:

- Vite.
- Babel.
- SWC.
- esbuild.

You can use TypeScript for static checking and another tool for building the application.

### Example

```json
{
    "compilerOptions": {
        "noEmit": true,
        "strict": true
    }
}
```

Run:

```bash
npx tsc --noEmit
```

This checks the project without generating output.

---

# 31. Understanding `noEmitOnError`

This option prevents JavaScript output when TypeScript reports errors.

### Configuration

```json
{
    "compilerOptions": {
        "noEmitOnError": true
    }
}
```

### Example

```typescript
const age: number = "25";
```

This contains a type error.

Without `noEmitOnError`, TypeScript may still emit JavaScript depending on the other configuration options.

With `noEmitOnError: true`, it does not emit output when errors are reported.

### Difference

| `noEmit` | `noEmitOnError` |
|---|---|
| Never generates output | Generates output only when there are no reported errors |
| Useful for type-check-only workflows | Useful for builds that should fail without output when errors exist |

### Important

`noEmitOnError` does not mean that TypeScript stops checking after the first error.

It controls output generation.

---

# 32. Understanding `isolatedModules`

This option checks whether each file can be safely transpiled independently by tools that process one file at a time.

### Configuration

```json
{
    "compilerOptions": {
        "isolatedModules": true
    }
}
```

### Why is this useful?

Some JavaScript build tools transform TypeScript one file at a time.

Examples include:

- Babel.
- SWC.
- esbuild.

These tools generally do not perform the same whole-program type analysis as `tsc`.

`isolatedModules` helps detect certain TypeScript constructs that are incompatible with isolated single-file transformation.

### Example

Consider:

```typescript
const enum Role {
    Admin,
    User
}
```

Certain compiler and transpiler combinations may handle `const enum` differently.

Single-file transpilers cannot always reproduce TypeScript's cross-file enum inlining behavior.

`isolatedModules` helps detect problematic patterns.

### Important

`isolatedModules` does not perform type checking independently for every file.

It checks whether code is compatible with isolated transformation.

You should still run the TypeScript type checker.

---

# 33. Understanding `verbatimModuleSyntax`

This option makes TypeScript's handling of imports and exports more explicit.

### Configuration

```json
{
    "compilerOptions": {
        "verbatimModuleSyntax": true
    }
}
```

With this option, imports and exports without the `type` modifier are generally preserved as written, subject to the module output mode.

Type-only imports should be explicitly marked.

### Example

```typescript
import type { User } from "./types.js";

import { getUser } from "./services.js";
```

The first import is type-only.

The second import is a runtime import.

### Why is this useful?

It makes the distinction between type dependencies and runtime dependencies clearer.

### Type-only import

```typescript
import type { User } from "./types.js";
```

### Runtime import

```typescript
import { getUser } from "./services.js";
```

### Inline type modifier

```typescript
import { getUser, type User } from "./services.js";
```

### Important

`verbatimModuleSyntax` is especially useful in modern ESM projects because it encourages explicit import behavior.

It also affects how TypeScript handles imports that are incompatible with the configured module system.

---

# 34. Understanding `skipLibCheck`

The `skipLibCheck` option skips type checking of declaration files.

### Configuration

```json
{
    "compilerOptions": {
        "skipLibCheck": true
    }
}
```

### What are declaration files?

Declaration files generally have the `.d.ts` extension.

They describe the types of libraries and packages.

For example:

```text
node_modules/
└── @types/
    └── node/
        └── index.d.ts
```

### Why use `skipLibCheck`?

Large applications may depend on many external declaration files.

Checking every declaration file can increase compilation time.

Enabling this option can improve build performance.

### Important

`skipLibCheck` does not mean TypeScript stops checking your application source files.

Your own `.ts` and `.tsx` files are still checked.

It can also hide certain declaration-file inconsistencies, so it should not be treated as a general solution to every type error.

---

# 35. Understanding `resolveJsonModule`

This option allows TypeScript to resolve JSON files as modules.

### Configuration

```json
{
    "compilerOptions": {
        "resolveJsonModule": true
    }
}
```

### Example project

```text
project/
│
├── src/
│   └── app.ts
│
└── package.json
```

### package.json

```json
{
    "name": "typescript-project",
    "version": "1.0.0"
}
```

### app.ts

```typescript
import packageInfo from "../package.json";

console.log(packageInfo.name);
```

TypeScript can infer the structure of the imported JSON.

### Important

Runtime support depends on the module system and environment.

TypeScript's ability to resolve a JSON import does not guarantee that every runtime supports the same import syntax without additional configuration.

---

# 36. Understanding `allowJs` and `checkJs`

These options help projects that contain both JavaScript and TypeScript.

## A. `allowJs`

Allows JavaScript files to be included in the TypeScript project.

```json
{
    "compilerOptions": {
        "allowJs": true
    }
}
```

Example:

```text
project/
│
├── src/
│   ├── app.ts
│   └── helper.js
│
└── tsconfig.json
```

Both files can be included in the project.

## B. `checkJs`

Enables type checking for included JavaScript files.

```json
{
    "compilerOptions": {
        "allowJs": true,
        "checkJs": true
    }
}
```

### Example JavaScript file

```javascript
function add(a, b) {
    return a + b;
}

add("10", 20);
```

With JavaScript checking enabled, TypeScript can report type-related problems.

### Comparison

| `allowJs` | `checkJs` |
|---|---|
| Allows JS files in the project | Enables checking of JS files |
| Does not automatically mean all JS files receive full checking | Requires JavaScript files to be included |
| Useful for gradual migration | Useful for improving JavaScript code quality |

### JSDoc example

```javascript
/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function add(a, b) {
    return a + b;
}
```

JSDoc provides type information without converting the file to TypeScript.

---

# 37. Understanding `allowImportingTsExtensions`

This option controls imports that explicitly use TypeScript file extensions.

Example:

```typescript
import { getUser } from "./user.ts";
```

The compiler option is:

```json
{
    "compilerOptions": {
        "allowImportingTsExtensions": true
    }
}
```

### Important

This option is intended for workflows where another tool or runtime handles TypeScript files directly.

In ordinary JavaScript emission workflows, `.ts` import specifiers may not be suitable because the emitted JavaScript still needs to resolve the imported file.

The option has emission-related restrictions. In current TypeScript configurations, it is used with workflows that do not emit ordinary JavaScript from these imports, or with the appropriate rewriting configuration where supported.

### Practical advice

For conventional Node.js ESM projects that compile `.ts` to `.js`, using `.js` in relative import specifiers is often the appropriate approach.

---

# 38. Understanding Configuration Inheritance with `extends`

Large projects often contain multiple TypeScript configurations.

Instead of duplicating compiler options, one configuration can inherit from another.

This is done using `extends`.

### Example project

```text
project/
│
├── tsconfig.base.json
│
├── packages/
│   ├── backend/
│   │   └── tsconfig.json
│   │
│   └── frontend/
│       └── tsconfig.json
│
└── package.json
```

### tsconfig.base.json

```json
{
    "compilerOptions": {
        "strict": true,
        "noImplicitAny": true,
        "strictNullChecks": true,
        "skipLibCheck": true
    }
}
```

### Backend tsconfig.json

```json
{
    "extends": "../../tsconfig.base.json",
    "compilerOptions": {
        "target": "ES2022",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "rootDir": "./src",
        "outDir": "./dist"
    },
    "include": ["src"]
}
```

### Frontend tsconfig.json

```json
{
    "extends": "../../tsconfig.base.json",
    "compilerOptions": {
        "target": "ES2022",
        "module": "ESNext",
        "moduleResolution": "Bundler",
        "jsx": "react-jsx",
        "noEmit": true
    },
    "include": ["src"]
}
```

### Benefits

- Avoid duplicated configuration.
- Maintain consistent strictness.
- Share common compiler settings.
- Customize each project independently.
- Improve monorepo architecture.

### Important inheritance rules

When one configuration extends another:

1. Child compiler options override inherited options with the same keys.
2. `files`, `include`, and `exclude` in the child replace the corresponding inherited properties rather than merging them.
3. Relative paths are generally resolved relative to the configuration file in which they originated.
4. `references` is not inherited.

---

# 39. Development vs Production TypeScript Configuration

Professional applications sometimes use separate configurations for development and production.

However, the exact setup depends on the build tool.

### Example project

```text
project/
│
├── src/
│
├── tsconfig.json
├── tsconfig.build.json
└── package.json
```

### tsconfig.json

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "noEmit": true
    },
    "include": ["src"]
}
```

This configuration is used for type checking.

### tsconfig.build.json

```json
{
    "extends": "./tsconfig.json",
    "compilerOptions": {
        "noEmit": false,
        "rootDir": "./src",
        "outDir": "./dist",
        "declaration": true,
        "sourceMap": true
    },
    "exclude": [
        "node_modules",
        "dist",
        "**/*.test.ts"
    ]
}
```

This configuration enables JavaScript emission.

### package.json

```json
{
    "scripts": {
        "type-check": "tsc --noEmit",
        "build": "tsc -p tsconfig.build.json",
        "start": "node dist/server.js"
    }
}
```

### Important

A production build should generally include type checking, but many projects separate type checking from bundling for performance and tooling flexibility.

For example, a Vite or Next.js build may use a transpiler for JavaScript generation and run TypeScript checking separately.

---

# 40. Professional Node.js TypeScript Configuration

Let's create a practical configuration for a Node.js backend application.

### Project structure

```text
backend/
│
├── src/
│   ├── config/
│   │   └── database.ts
│   │
│   ├── controllers/
│   │   └── userController.ts
│   │
│   ├── routes/
│   │   └── userRoutes.ts
│   │
│   ├── services/
│   │   └── userService.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── dist/
│
├── package.json
└── tsconfig.json
```

### package.json

For an ESM project:

```json
{
    "name": "backend",
    "version": "1.0.0",
    "type": "module",
    "scripts": {
        "dev": "tsx watch src/server.ts",
        "build": "tsc",
        "start": "node dist/server.js",
        "type-check": "tsc --noEmit"
    },
    "devDependencies": {
        "@types/node": "^22.0.0",
        "tsx": "^4.0.0",
        "typescript": "^5.0.0"
    }
}
```

The version ranges are illustrative; use versions compatible with your installed Node.js and TypeScript environment.

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
        "noImplicitAny": true,
        "strictNullChecks": true,
        "strictFunctionTypes": true,
        "strictPropertyInitialization": true,

        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,

        "skipLibCheck": true,

        "declaration": true,
        "sourceMap": true,

        "noEmitOnError": true
    },

    "include": [
        "src/**/*.ts"
    ],

    "exclude": [
        "node_modules",
        "dist",
        "**/*.test.ts"
    ]
}
```

### Why this configuration?

| Option | Reason |
|---|---|
| `target: ES2022` | Modern JavaScript output |
| `module: NodeNext` | Node.js-aware ESM/CJS behavior |
| `moduleResolution: NodeNext` | Node.js module resolution |
| `rootDir` | Source directory |
| `outDir` | Compiled output directory |
| `strict` | Strict type checking |
| `esModuleInterop` | CommonJS interoperability |
| `skipLibCheck` | Reduces declaration checking overhead |
| `declaration` | Generates declaration files |
| `sourceMap` | Helps debugging |
| `noEmitOnError` | Avoids emitting output when errors exist |

### Example source file

`src/server.ts`:

```typescript
import express from "express";

const app = express();

const PORT = 3000;

app.get("/", (_req, res) => {
    res.send("Server is running");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

Notice the use of `.js` extensions for relative ESM imports when importing local TypeScript modules.

For example:

```typescript
import { connectDatabase } from "./config/database.js";
```

This is a common NodeNext pattern because the emitted JavaScript file will use the `.js` extension.

---

# 41. Professional React TypeScript Configuration

React applications commonly use a bundler such as Vite.

### Project structure

```text
frontend/
│
├── src/
│   ├── components/
│   │   └── User.tsx
│   │
│   ├── pages/
│   │   └── Home.tsx
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── public/
│
├── package.json
└── tsconfig.json
```

### Example tsconfig.json

```json
{
    "compilerOptions": {
        "target": "ES2022",

        "module": "ESNext",
        "moduleResolution": "Bundler",

        "jsx": "react-jsx",

        "strict": true,

        "noEmit": true,

        "skipLibCheck": true,

        "esModuleInterop": true,

        "forceConsistentCasingInFileNames": true,

        "noUnusedLocals": true,
        "noUnusedParameters": true,

        "noFallthroughCasesInSwitch": true
    },

    "include": [
        "src"
    ]
}
```

### Understanding `jsx`

The `jsx` option controls how TypeScript handles JSX syntax.

Common values:

| Option | Meaning |
|---|---|
| `preserve` | Keeps JSX for another tool to transform |
| `react` | Transforms JSX using the classic React runtime |
| `react-jsx` | Uses the automatic React JSX runtime |
| `react-jsxdev` | Uses the development automatic JSX runtime |
| `react-native` | Preserves JSX for React Native tooling |

### Example

```tsx
function App() {
    return <h1>Hello React</h1>;
}
```

With:

```json
{
    "compilerOptions": {
        "jsx": "react-jsx"
    }
}
```

TypeScript understands JSX and uses the automatic JSX runtime model.

### Important

A Vite project commonly uses `noEmit: true` because Vite handles application transformation and bundling.

TypeScript is used separately for type checking.

---

# 42. Professional Next.js TypeScript Configuration

Next.js manages much of its own TypeScript configuration.

A typical Next.js configuration may look like:

```json
{
    "compilerOptions": {
        "target": "ES2017",

        "lib": [
            "dom",
            "dom.iterable",
            "esnext"
        ],

        "allowJs": true,

        "skipLibCheck": true,

        "strict": true,

        "noEmit": true,

        "esModuleInterop": true,

        "module": "esnext",

        "moduleResolution": "bundler",

        "resolveJsonModule": true,

        "isolatedModules": true,

        "jsx": "react-jsx",

        "incremental": true,

        "plugins": [
            {
                "name": "next"
            }
        ],

        "paths": {
            "@/*": [
                "./src/*"
            ]
        }
    },

    "include": [
        "next-env.d.ts",
        ".next/types/**/*.ts",
        ".next/dev/types/**/*.ts",
        "**/*.ts",
        "**/*.tsx"
    ],

    "exclude": [
        "node_modules"
    ]
}
```

This is an illustrative configuration, not a universal configuration for every Next.js version or project structure.

### Important options

**1. `allowJs`**

Allows JavaScript files to participate in the project.

**2. `noEmit`**

Next.js handles the application build process, so TypeScript generally does not need to emit JavaScript.

**3. `moduleResolution: "bundler"`**

Supports modern bundler-oriented module resolution.

**4. `jsx: "react-jsx"`**

Enables the automatic React JSX runtime.

**5. `incremental`**

Allows TypeScript to reuse build information.

**6. `plugins`**

Enables Next.js-specific TypeScript language-service integration.

**7. `paths`**

Provides convenient import aliases.

### Example alias

```typescript
import Header from "@/components/Header";
```

### Important

When creating a Next.js project, let Next.js generate its initial TypeScript configuration.

Modify it carefully instead of replacing it with a generic Node.js configuration.

---

# 43. Understanding `forceConsistentCasingInFileNames`

This option ensures that import paths use consistent file-name casing.

### Configuration

```json
{
    "compilerOptions": {
        "forceConsistentCasingInFileNames": true
    }
}
```

### Example project

```text
src/
└── services/
    └── userService.ts
```

Incorrect import:

```typescript
import { getUser } from "./services/UserService";
```

Correct import:

```typescript
import { getUser } from "./services/userService";
```

### Why is this important?

Windows file systems are commonly case-insensitive by default, while Linux file systems are commonly case-sensitive.

An import may work on Windows but fail after deployment to Linux.

This option helps catch inconsistent casing.

---

# 44. Understanding `noUnusedLocals` and `noUnusedParameters`

These options detect unused declarations.

## A. `noUnusedLocals`

```json
{
    "compilerOptions": {
        "noUnusedLocals": true
    }
}
```

Example:

```typescript
const username = "Riyaz";

function greet(): void {
    console.log("Hello");
}
```

If `username` is never used, TypeScript reports it as unused.

## B. `noUnusedParameters`

```json
{
    "compilerOptions": {
        "noUnusedParameters": true
    }
}
```

Example:

```typescript
function greet(name: string, age: number): void {
    console.log(name);
}
```

The `age` parameter is unused.

### Ignoring intentionally unused parameters

A common convention is to prefix intentionally unused parameters with `_`.

```typescript
function greet(name: string, _age: number): void {
    console.log(name);
}
```

### Important

These options improve code cleanliness but may require adjustment for callback signatures and framework conventions.

---

# 45. Understanding `noImplicitReturns`

This option checks whether functions return values consistently across all execution paths.

### Configuration

```json
{
    "compilerOptions": {
        "noImplicitReturns": true
    }
}
```

### Example

```typescript
function getStatus(isActive: boolean): string {
    if (isActive) {
        return "Active";
    }
}
```

This function does not return a value when `isActive` is false.

TypeScript reports an error.

### Correct version

```typescript
function getStatus(isActive: boolean): string {
    if (isActive) {
        return "Active";
    }

    return "Inactive";
}
```

### Why is this useful?

It helps prevent missing return paths in:

- Business logic.
- API handlers.
- Authentication checks.
- Data-processing functions.

---

# 46. Understanding `noFallthroughCasesInSwitch`

This option reports accidental fallthrough between switch cases.

### Configuration

```json
{
    "compilerOptions": {
        "noFallthroughCasesInSwitch": true
    }
}
```

### Example

```typescript
function getRole(role: string): string {
    switch (role) {
        case "ADMIN":
            console.log("Administrator");

        case "USER":
            return "User";

        default:
            return "Unknown";
    }
}
```

The `ADMIN` case falls through into the `USER` case.

### Correct version

```typescript
function getRole(role: string): string {
    switch (role) {
        case "ADMIN":
            console.log("Administrator");
            return "Admin";

        case "USER":
            return "User";

        default:
            return "Unknown";
    }
}
```

### Important

Intentional fallthrough can be documented with comments, but accidental fallthrough should be avoided.

---

# 47. Understanding `allowUnreachableCode`

This option controls reporting of unreachable code.

Possible values:

- `true`
- `false`

### Example

```typescript
function getUser(): void {
    return;

    console.log("This code is unreachable");
}
```

With:

```json
{
    "compilerOptions": {
        "allowUnreachableCode": false
    }
}
```

TypeScript reports unreachable code.

### Important

Unreachable code diagnostics are primarily syntactic checks.

This option is different from `noUnusedLocals` and `noUnusedParameters`.

---

# 48. Understanding `allowUnusedLabels`

This option controls whether unused labels are allowed.

### Example

```typescript
function process(): void {
    unusedLabel: {
        console.log("Hello");
    }
}
```

A label is generally used with statements such as `break` or `continue`.

If a label is not used, TypeScript can report it depending on the option.

### Configuration

```json
{
    "compilerOptions": {
        "allowUnusedLabels": false
    }
}
```

This is a less commonly configured option, but useful to recognize when reviewing compiler settings.

---

# 49. Understanding `incremental`

The `incremental` option enables incremental compilation.

### Configuration

```json
{
    "compilerOptions": {
        "incremental": true
    }
}
```

TypeScript can store build information in a `.tsbuildinfo` file.

### Benefits

- Faster repeated builds.
- Reuse of previous compilation information.
- Better performance in larger projects.

### Related option

```json
{
    "compilerOptions": {
        "tsBuildInfoFile": "./.cache/typescript.tsbuildinfo"
    }
}
```

This specifies where the build information file should be stored.

### Important

Incremental compilation does not mean TypeScript never rechecks files.

Changes in a dependency can require dependent files to be reanalyzed.

---

# 50. Understanding `composite`

The `composite` option enables a TypeScript project to participate in project references.

### Configuration

```json
{
    "compilerOptions": {
        "composite": true,
        "declaration": true
    }
}
```

It also imposes additional project configuration requirements.

For example:

- Declaration generation is enabled by default for composite projects.
- The project needs a well-defined source file set.
- Imported files must fit the project-reference model.

### Why use it?

It is useful for:

- Monorepos.
- Shared TypeScript libraries.
- Large backend/frontend projects.
- Multi-package repositories.

### Important

`composite` and `incremental` are related but different.

| `composite` | `incremental` |
|---|---|
| Enables project-reference support | Enables incremental compilation |
| Has additional project configuration requirements | Can be used in ordinary projects |
| Useful for multi-project builds | Useful for faster repeated builds |

---

# 51. Understanding `tsc --showConfig`

Sometimes you want to understand the final configuration after inheritance and defaults are applied.

Use:

```bash
npx tsc --showConfig
```

This displays the resolved compiler configuration.

### Why is it useful?

Suppose you have:

```text
tsconfig.base.json
tsconfig.json
```

And your main configuration extends the base configuration.

The final configuration may contain settings inherited from both files.

`--showConfig` helps you inspect the resolved result.

---

# 52. Understanding `tsc --listFiles`

This command lists files included in the TypeScript compilation.

```bash
npx tsc --listFiles
```

### Why is it useful?

Sometimes TypeScript includes unexpected files.

This command helps you understand which source files and declaration files are part of the program.

### Related command

```bash
npx tsc --explainFiles
```

This explains why particular files were included.

### Practical use case

Suppose your project unexpectedly compiles files from a test directory.

Use:

```bash
npx tsc --listFiles
```

to inspect the actual compilation inputs.

---

# 53. Understanding `tsc --traceResolution`

This command provides detailed information about module resolution.

```bash
npx tsc --traceResolution
```

### Example problem

You write:

```typescript
import { getUser } from "@services/userService";
```

But TypeScript reports:

```text
Cannot find module '@services/userService'
```

Possible causes:

- Incorrect `paths` configuration.
- Incorrect `baseUrl`.
- Wrong directory structure.
- Incorrect file name.
- Module resolution mismatch.

Use:

```bash
npx tsc --traceResolution
```

to understand how TypeScript searches for the imported module.

---

# 54. Common Mistakes

### Mistake 1: Confusing `target` and `module`

`target` controls JavaScript syntax output.

`module` controls module format and related module behavior.

### Mistake 2: Thinking `rootDir` selects source files

`rootDir` controls the source root for emitted structure.

Use `include`, `files`, and project references to control root files.

### Mistake 3: Thinking `exclude` prevents all imports

Excluded files can still enter the program through imports or explicit file references.

### Mistake 4: Thinking `paths` rewrites runtime imports

`paths` helps TypeScript resolve imports but does not automatically rewrite emitted import paths.

### Mistake 5: Thinking `lib` installs APIs

`lib` provides type declarations, not runtime implementations.

### Mistake 6: Thinking `noEmit` means no type checking

`noEmit` prevents output generation, but TypeScript still performs type checking.

### Mistake 7: Thinking `skipLibCheck` skips checking your source files

It primarily skips checking declaration files.

### Mistake 8: Thinking `esModuleInterop` converts CommonJS into ESM

It improves interoperability behavior but does not change a package's actual runtime module format.

### Mistake 9: Using the same configuration for every project

Node.js, React, Next.js, and library projects may need different module and resolution settings.

### Mistake 10: Replacing a framework-generated configuration unnecessarily

Frameworks such as Next.js and Vite often depend on specific compiler settings.

Modify their configurations carefully.

---

# 55. Interview Questions and Answers

### Q1. What is `tsconfig.json`?

It is the configuration file used by the TypeScript compiler to define compiler options, project files, and related build settings.

### Q2. What is the purpose of `target`?

It determines the JavaScript language version emitted by TypeScript.

### Q3. What is the purpose of `module`?

It controls the module format and related module output behavior.

### Q4. What is `moduleResolution`?

It determines how TypeScript locates imported modules.

### Q5. What is the difference between `rootDir` and `outDir`?

`rootDir` defines the source root for emitted file structure, while `outDir` defines where compiled files are placed.

### Q6. What is the difference between `include` and `files`?

`include` uses file patterns, while `files` explicitly lists root source files.

### Q7. What is the purpose of `exclude`?

It filters matching files from automatic root-file discovery.

### Q8. Does `exclude` guarantee that a file is never compiled?

No. An excluded file can still be included through imports or explicit file references.

### Q9. What does `strict` do?

It enables a collection of strict type-checking options.

### Q10. What is `noImplicitAny`?

It reports cases where TypeScript infers an implicit `any` type.

### Q11. What is `strictNullChecks`?

It makes `null` and `undefined` distinct types that must be handled explicitly.

### Q12. What is `strictPropertyInitialization`?

It checks that class properties are initialized appropriately.

### Q13. What is `noUncheckedIndexedAccess`?

It adds `undefined` to types obtained through potentially missing indexed properties.

### Q14. What is `exactOptionalPropertyTypes`?

It distinguishes between an optional property being absent and explicitly being present with `undefined`.

### Q15. What is `esModuleInterop`?

It enables interoperability behavior between CommonJS modules and ES module import syntax.

### Q16. What is `allowSyntheticDefaultImports`?

It allows certain default-import patterns for modules that do not explicitly declare a default export.

### Q17. What is `baseUrl`?

It establishes a base directory for resolving non-relative module imports.

### Q18. What is `paths`?

It defines module path mappings or aliases for TypeScript resolution.

### Q19. Does `paths` rewrite emitted imports?

No. Additional runtime or bundler configuration may be required.

### Q20. What is `types`?

It specifies which visible type packages should be included in the global scope.

### Q21. What is `typeRoots`?

It specifies directories where TypeScript searches for type packages.

### Q22. What is `lib`?

It specifies which built-in JavaScript and environment API declarations are available during type checking.

### Q23. What is `declaration`?

It generates `.d.ts` declaration files.

### Q24. What is `declarationMap`?

It generates source maps for declaration files.

### Q25. What is `sourceMap`?

It generates source maps connecting emitted JavaScript to original source files.

### Q26. What is `noEmit`?

It prevents TypeScript from generating output files.

### Q27. What is `noEmitOnError`?

It prevents output generation when compiler errors are reported.

### Q28. What is `isolatedModules`?

It checks whether code is compatible with single-file TypeScript transformation tools.

### Q29. What is `verbatimModuleSyntax`?

It makes TypeScript's import and export handling more explicit, particularly for distinguishing type-only imports from runtime imports.

### Q30. What is `skipLibCheck`?

It skips type checking of declaration files.

### Q31. What is the difference between `allowJs` and `checkJs`?

`allowJs` permits JavaScript files in the project; `checkJs` enables type checking for those files.

### Q32. What is `extends`?

It allows one TypeScript configuration to inherit settings from another.

### Q33. What is `composite`?

It enables a project to participate in TypeScript project references.

### Q34. What is `incremental`?

It enables incremental compilation using stored build information.

### Q35. How do you inspect the final TypeScript configuration?

Use:

```bash
npx tsc --showConfig
```

---

# 56. Practical Exercises

Complete these exercises to gain practical experience with TypeScript configuration.

## Exercise 1: Create a Basic Configuration

Create a new TypeScript project.

Generate:

```bash
npx tsc --init
```

Configure:

- `target`
- `module`
- `strict`
- `rootDir`
- `outDir`

Compile the project.

## Exercise 2: Experiment with JavaScript Targets

Write code using:

- Arrow functions.
- Template literals.
- Classes.
- Async/await.

Compile it using different `target` values.

Compare the generated JavaScript.

## Exercise 3: Experiment with Module Systems

Create a small project.

Try:

- CommonJS.
- ESNext.
- NodeNext.

Compare the generated output and module behavior.

## Exercise 4: Configure Module Resolution

Create a project using:

```typescript
import { getUser } from "./services/userService";
```

Test:

- NodeNext.
- Bundler.

Observe their differences.

## Exercise 5: Configure `rootDir` and `outDir`

Create nested source folders.

Compile the project and inspect the generated folder structure.

## Exercise 6: Experiment with `include` and `exclude`

Create:

```text
src/
tests/
scripts/
```

Configure the compiler to include only `src`.

Then import a file from `tests` and observe what happens.

## Exercise 7: Enable Strict Mode

Enable:

```json
{
    "compilerOptions": {
        "strict": true
    }
}
```

Create examples involving:

- Implicit `any`.
- Null values.
- Optional parameters.
- Uninitialized class properties.

Fix the errors.

## Exercise 8: Experiment with `noUncheckedIndexedAccess`

Create an array and access an invalid index.

Compare the inferred type with the option enabled and disabled.

## Exercise 9: Configure Path Aliases

Create aliases for:

- `@components`
- `@services`
- `@utils`

Configure TypeScript and your bundler to resolve them.

## Exercise 10: Generate Declaration Files

Enable:

```json
{
    "compilerOptions": {
        "declaration": true
    }
}
```

Create a library with exported functions and interfaces.

Inspect the generated `.d.ts` files.

## Exercise 11: Generate Source Maps

Enable:

```json
{
    "compilerOptions": {
        "sourceMap": true
    }
}
```

Compile the project and inspect `.js.map` files.

## Exercise 12: Experiment with `noEmit`

Enable:

```json
{
    "compilerOptions": {
        "noEmit": true
    }
}
```

Run the compiler and verify that no JavaScript output is generated.

## Exercise 13: Create Configuration Inheritance

Create:

```text
tsconfig.base.json
tsconfig.json
tsconfig.build.json
```

Use `extends` to share common configuration.

## Exercise 14: Configure a Node.js Backend

Create a Node.js application using:

- TypeScript.
- Express.
- NodeNext.
- Strict mode.
- Separate `src` and `dist` folders.

Compile and run it.

## Exercise 15: Configure a React Application

Create a React application using TypeScript.

Configure:

- JSX.
- Bundler module resolution.
- Strict mode.
- Path aliases.
- `noEmit`.

## Exercise 16: Inspect Compiler Configuration

Run:

```bash
npx tsc --showConfig
```

Understand the final resolved configuration.

## Exercise 17: Inspect Included Files

Run:

```bash
npx tsc --listFiles
```

Identify all files included in the compilation.

## Exercise 18: Debug Module Resolution

Create an invalid path alias.

Run:

```bash
npx tsc --traceResolution
```

Understand why TypeScript cannot resolve the module.

---

# 57. Recommended Professional Configuration

For reference, here is a practical starting point for a conventional Node.js ESM backend.

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

        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noImplicitReturns": true,
        "noFallthroughCasesInSwitch": true,

        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,

        "skipLibCheck": true,

        "declaration": true,
        "sourceMap": true,

        "noEmitOnError": true,
        "incremental": true
    },

    "include": [
        "src/**/*.ts"
    ],

    "exclude": [
        "node_modules",
        "dist",
        "**/*.test.ts"
    ]
}
```

This is a starting configuration, not a universal rule. Adjust it according to your runtime, build system, framework, and library requirements.

---

# 58. Phase 26 Completion Checklist

| No. | Topic | Status |
|---|---|---|
| 1 | Understanding `tsconfig.json` | ☐ |
| 2 | Configuration structure | ☐ |
| 3 | `target` | ☐ |
| 4 | `module` | ☐ |
| 5 | `moduleResolution` | ☐ |
| 6 | `rootDir` | ☐ |
| 7 | `outDir` | ☐ |
| 8 | `include` | ☐ |
| 9 | `exclude` | ☐ |
| 10 | `files` | ☐ |
| 11 | `strict` | ☐ |
| 12 | `noImplicitAny` | ☐ |
| 13 | `strictNullChecks` | ☐ |
| 14 | `strictFunctionTypes` | ☐ |
| 15 | `strictPropertyInitialization` | ☐ |
| 16 | `noImplicitThis` | ☐ |
| 17 | `noUncheckedIndexedAccess` | ☐ |
| 18 | `exactOptionalPropertyTypes` | ☐ |
| 19 | `esModuleInterop` | ☐ |
| 20 | `allowSyntheticDefaultImports` | ☐ |
| 21 | `baseUrl` | ☐ |
| 22 | `paths` | ☐ |
| 23 | `types` | ☐ |
| 24 | `typeRoots` | ☐ |
| 25 | `lib` | ☐ |
| 26 | `declaration` | ☐ |
| 27 | `declarationMap` | ☐ |
| 28 | `sourceMap` | ☐ |
| 29 | `inlineSourceMap` | ☐ |
| 30 | `noEmit` | ☐ |
| 31 | `noEmitOnError` | ☐ |
| 32 | `isolatedModules` | ☐ |
| 33 | `verbatimModuleSyntax` | ☐ |
| 34 | `skipLibCheck` | ☐ |
| 35 | `resolveJsonModule` | ☐ |
| 36 | `allowJs` and `checkJs` | ☐ |
| 37 | `extends` | ☐ |
| 38 | Development/build configurations | ☐ |
| 39 | Node.js configuration | ☐ |
| 40 | React configuration | ☐ |
| 41 | Next.js configuration | ☐ |
| 42 | Compiler diagnostic commands | ☐ |

---

# What Comes Next?

## Phase 27: TypeScript Project Architecture – Folder Structure, Design Patterns, and Scalable Application Architecture

In the next phase, we will learn how to organize TypeScript applications professionally.

Topics will include:

1. Why project architecture matters.
2. Monolithic vs modular architecture.
3. Layered architecture.
4. Feature-based folder structure.
5. Separation of concerns.
6. Controllers, services, and repositories.
7. DTOs (Data Transfer Objects).
8. Models and entities.
9. Dependency injection.
10. Dependency inversion principle.
11. Repository pattern.
12. Factory pattern.
13. Singleton pattern.
14. Adapter pattern.
15. Strategy pattern.
16. Middleware architecture.
17. Error-handling architecture.
18. Configuration management.
19. Environment variables and type safety.
20. Shared types and utilities.
21. Barrel files and module organization.
22. Circular dependency management.
23. Scalable Node.js TypeScript project structure.
24. Scalable React TypeScript project structure.
25. Building a professional full-stack TypeScript architecture.

**Phase 26 complete.** Say **"OK, Phase 27"** when you're ready to continue.