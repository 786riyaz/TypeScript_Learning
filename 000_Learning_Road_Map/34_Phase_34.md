# Phase 34: TypeScript Compiler, Configuration, Declaration Files, and Module System

**Level:** Advanced to Expert  
**Prerequisites:** TypeScript fundamentals, generics, utility types, type-level programming, JavaScript modules, Node.js, and npm.

---

# 1. Learning Objectives

By the end of this phase, you will understand:

1. TypeScript Compiler (`tsc`).
2. TypeScript Compilation Process.
3. TypeScript Compiler Architecture.
4. `tsconfig.json` in Depth.
5. `target` and `module`.
6. `moduleResolution`.
7. Strict Mode.
8. `noEmit` and `emitDeclarationOnly`.
9. Source Maps.
10. Declaration Files (`.d.ts`).
11. Ambient Declarations.
12. Global vs Module Scope.
13. Declaration Merging.
14. Module Augmentation.
15. Namespaces.
16. ES Modules vs CommonJS.
17. Type-Only Imports and Exports.
18. Path Aliases.
19. Project References.
20. Monorepo TypeScript Configuration.
21. Building and Publishing TypeScript Libraries.

---

# 2. What Is the TypeScript Compiler?

The **TypeScript Compiler (TSC)** is a tool that analyzes TypeScript code, performs type checking, and can generate JavaScript output.

JavaScript runtimes such as Node.js and browsers do not generally execute TypeScript types directly.

Therefore, TypeScript code is commonly compiled or transformed into JavaScript before execution.

### Example

Create a file named:

`app.ts`

```typescript
const name: string = "Riyaz";

function greet(name: string): string {
    return `Hello ${name}`;
}

console.log(greet(name));
```

JavaScript cannot understand TypeScript's type annotations.

We can compile it using:

```bash
tsc app.ts
```

The compiler generates:

`app.js`

```javascript
const name = "Riyaz";

function greet(name) {
    return `Hello ${name}`;
}

console.log(greet(name));
```

Notice:

```typescript
name: string
```

has been removed.

This happens because TypeScript types are erased during compilation.

### Install TypeScript

Install TypeScript globally:

```bash
npm install -g typescript
```

Or install it as a development dependency:

```bash
npm install -D typescript
```

Check the installed version:

```bash
tsc --version
```

### Important Commands

| Command | Purpose |
|---|---|
| `tsc app.ts` | Compile a TypeScript file |
| `tsc` | Compile using the current project configuration |
| `tsc --init` | Generate a starter `tsconfig.json` |
| `tsc --watch` | Watch files and recompile when they change |
| `tsc --noEmit` | Type-check without generating JavaScript |
| `tsc --project tsconfig.json` | Compile using a specified configuration |
| `tsc --listFiles` | Show files included in compilation |
| `tsc --showConfig` | Display the resolved compiler configuration |

---

# 3. TypeScript Compilation Process

Let's understand what happens when TypeScript code is compiled.

Consider:

```typescript
const age: number = 25;

function add(a: number, b: number): number {
    return a + b;
}

console.log(add(age, 10));
```

The compilation process can be understood through several stages.

### Stage 1: Source Code

You write TypeScript code.

```text
app.ts
```

### Stage 2: Parsing

The compiler reads the source code and converts it into an internal representation called an **Abstract Syntax Tree (AST)**.

The AST represents the structure of your code.

For example:

```typescript
const age: number = 25;
```

The compiler understands that this declaration contains:

- A variable declaration.
- A variable name.
- A type annotation.
- An initializer.

### Stage 3: Binding

The compiler creates symbols and connects identifiers to their declarations.

For example:

```typescript
const age = 25;

function printAge() {
    console.log(age);
}
```

The compiler resolves which declaration the identifier `age` refers to.

### Stage 4: Type Checking

The TypeScript checker verifies that your code follows the declared and inferred types.

Example:

```typescript
const age: number = "25";
```

TypeScript reports an error because a string cannot be assigned to a number.

### Stage 5: Transformation

The compiler transforms TypeScript syntax into JavaScript syntax according to the configured compilation target.

For example:

```typescript
const greet = (name: string): string => {
    return `Hello ${name}`;
};
```

Depending on the target, the compiler may preserve or transform modern JavaScript syntax.

### Stage 6: JavaScript Output

The compiler generates JavaScript files if output emission is enabled.

```text
app.ts
   |
   v
Parsing
   |
   v
AST
   |
   v
Binding
   |
   v
Type Checking
   |
   v
Transformation
   |
   v
JavaScript Output
```

**Important:** This is a conceptual overview. The TypeScript compiler has more detailed internal stages and may perform work in different orders depending on the compilation operation.

---

# 4. What Is tsconfig.json?

`tsconfig.json` is the main configuration file for a TypeScript project.

It tells the TypeScript compiler how to:

- Compile files.
- Resolve modules.
- Check types.
- Generate JavaScript.
- Handle JavaScript files.
- Include or exclude project files.
- Generate declaration files.
- Configure strictness.

### Create tsconfig.json

Run:

```bash
tsc --init
```

This generates a starter configuration.

A project may have a configuration like this:

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

    "skipLibCheck": true
  },

  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

Let's understand the important options.

---

# 5. target

The `target` option specifies the JavaScript language version that TypeScript should emit.

Example:

```json
{
  "compilerOptions": {
    "target": "ES2022"
  }
}
```

This tells TypeScript to generate JavaScript compatible with the selected ECMAScript target, subject to the compiler's transformations.

### Common Targets

| Target | Description |
|---|---|
| `ES5` | Older JavaScript compatibility |
| `ES2015` | ES6 |
| `ES2016` | ES7 |
| `ES2017` | ES8 |
| `ES2020` | Modern JavaScript features |
| `ES2022` | Modern JavaScript features |
| `ESNext` | Latest ECMAScript features supported by the compiler |

### Example

TypeScript:

```typescript
const greet = (name: string) => {
    console.log(`Hello ${name}`);
};
```

With an older target, some syntax may be transformed into older JavaScript syntax.

With a modern target, the arrow function may remain unchanged.

### Important

`target` does not automatically provide polyfills for missing runtime APIs.

For example, compiling code that uses:

```typescript
const users = await fetch("/api/users");
```

does not automatically install or implement `fetch` in an older runtime.

You must ensure the runtime supports the APIs your application uses.

---

# 6. module

The `module` option determines the module system used for generated JavaScript.

Example:

```json
{
  "compilerOptions": {
    "module": "CommonJS"
  }
}
```

### Common Module Options

| Module | Description |
|---|---|
| `CommonJS` | CommonJS module system |
| `ES2015` | ES Modules |
| `ES2020` | ES Modules with additional syntax support |
| `ESNext` | Latest module syntax supported |
| `Node16` | Node.js-aware module behavior |
| `NodeNext` | Modern Node.js module behavior |
| `Preserve` | Preserves module syntax for a later tool to handle |

### Example: ES Module

TypeScript:

```typescript
export function add(a: number, b: number): number {
    return a + b;
}
```

ES Module output:

```javascript
export function add(a, b) {
    return a + b;
}
```

### Example: CommonJS

TypeScript:

```typescript
export function add(a: number, b: number): number {
    return a + b;
}
```

CommonJS output is conceptually similar to:

```javascript
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.add = add;

function add(a, b) {
    return a + b;
}
```

### Important

Choosing `module` is not just a formatting decision.

It affects how imports and exports are interpreted and emitted.

For Node.js applications, `NodeNext` or `Node16` is often appropriate when you want TypeScript to follow Node.js's module resolution rules.

For frontend applications, bundler-oriented configurations are often used.

---

# 7. moduleResolution

The `moduleResolution` option determines how TypeScript locates imported modules.

Suppose you write:

```typescript
import { add } from "./utils/add";
```

TypeScript must find the corresponding module.

It checks possible files and package entry points according to the selected module resolution strategy.

### Common Options

| Option | Purpose |
|---|---|
| `Classic` | Legacy TypeScript resolution strategy |
| `Node10` | Older Node.js-style resolution |
| `Node16` | Node.js-aware ESM/CommonJS resolution |
| `NodeNext` | Modern Node.js module resolution |
| `Bundler` | Resolution designed for bundler-based applications |

### Example: Bundler Configuration

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler"
  }
}
```

This is commonly suitable for applications built using modern bundlers.

### Example: Node.js Configuration

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  }
}
```

This follows Node.js's modern module resolution behavior.

### Why Are module and moduleResolution Related?

The compiler needs to understand:

1. Which module system your application uses.
2. How imports should be resolved.
3. Whether a file is treated as ESM or CommonJS.
4. Which package export conditions apply.

For `Node16` and `NodeNext`, TypeScript uses Node.js-aware resolution rules. Their corresponding `moduleResolution` modes are designed to be paired with the matching `module` setting.

---

# 8. Strict Mode

The `strict` option enables a collection of stricter type-checking rules.

Example:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

This is strongly recommended for most new TypeScript projects.

### Important Strict Options

| Option | Purpose |
|---|---|
| `strictNullChecks` | Checks `null` and `undefined` |
| `noImplicitAny` | Reports implicit `any` types |
| `strictFunctionTypes` | Applies stricter function parameter checking |
| `strictBindCallApply` | Checks `bind`, `call`, and `apply` arguments |
| `strictPropertyInitialization` | Checks class property initialization |
| `noImplicitThis` | Reports implicit `any` for `this` |
| `alwaysStrict` | Parses and emits JavaScript in strict mode |

### Example: noImplicitAny

Without strict checking:

```typescript
function greet(name) {
    return `Hello ${name}`;
}
```

The parameter may implicitly become `any`.

With `noImplicitAny`, TypeScript reports an error.

Correct:

```typescript
function greet(name: string): string {
    return `Hello ${name}`;
}
```

### Example: strictNullChecks

```typescript
let name: string = "Riyaz";

name = null;
```

With `strictNullChecks`, TypeScript reports an error.

Correct:

```typescript
let name: string | null = "Riyaz";

name = null;
```

### Why Use Strict Mode?

- Better type safety.
- Fewer runtime errors.
- More predictable code.
- Better API contracts.
- Easier maintenance.

---

# 9. noEmit

The `noEmit` option tells TypeScript to perform type checking without generating JavaScript files.

Configuration:

```json
{
  "compilerOptions": {
    "noEmit": true
  }
}
```

Run:

```bash
tsc
```

TypeScript checks the project but does not produce JavaScript output.

### Where Is It Useful?

This is particularly useful when another tool handles the actual JavaScript transformation.

Examples:

- Next.js.
- Vite.
- Babel.
- SWC.
- Other build tools.

For example, a frontend build tool may transform TypeScript into JavaScript while TypeScript runs separately for type checking.

### Command-Line Alternative

```bash
tsc --noEmit
```

---

# 10. outDir and rootDir

These options control where TypeScript reads project source files from conceptually and where it places generated JavaScript.

### rootDir

Specifies the root directory for input files when calculating output paths.

```json
{
  "compilerOptions": {
    "rootDir": "./src"
  }
}
```

### outDir

Specifies the output directory.

```json
{
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

### Example Project

Before compilation:

```text
my-project/
│
├── src/
│   ├── index.ts
│   ├── app.ts
│   │
│   └── utils/
│       └── helper.ts
│
└── tsconfig.json
```

After compilation:

```text
my-project/
│
├── src/
│   ├── index.ts
│   ├── app.ts
│   └── utils/
│       └── helper.ts
│
├── dist/
│   ├── index.js
│   ├── app.js
│   │
│   └── utils/
│       └── helper.js
│
└── tsconfig.json
```

The directory structure is preserved relative to `rootDir`.

---

# 11. Declaration Files (.d.ts)

Declaration files describe the types and public API of JavaScript code.

They use the `.d.ts` extension.

A declaration file contains type information but does not implement runtime behavior.

### Example

Suppose you have a JavaScript file:

`math.js`

```javascript
export function add(a, b) {
    return a + b;
}
```

TypeScript cannot automatically know the intended types of the parameters and return value.

You can create:

`math.d.ts`

```typescript
export declare function add(
    a: number,
    b: number
): number;
```

Now TypeScript understands the function's contract.

### What Does declare Mean?

The `declare` keyword tells TypeScript that something exists elsewhere.

It describes the type without providing a runtime implementation.

### Example: JavaScript Library

Imagine an external JavaScript library provides:

```javascript
export function greet(name) {
    return `Hello ${name}`;
}
```

Its declaration file could be:

```typescript
export declare function greet(name: string): string;
```

Now TypeScript can type-check calls to the library.

### Important

A `.d.ts` file does not implement the function.

It only tells TypeScript what the function is expected to look like.

---

# 12. Generating Declaration Files

TypeScript can automatically generate declaration files from your TypeScript source code.

Enable:

```json
{
  "compilerOptions": {
    "declaration": true
  }
}
```

Example:

`math.ts`

```typescript
export function add(
    a: number,
    b: number
): number {
    return a + b;
}
```

Run:

```bash
tsc
```

TypeScript generates:

`math.d.ts`

```typescript
export declare function add(
    a: number,
    b: number
): number;
```

### Related Compiler Options

| Option | Purpose |
|---|---|
| `declaration` | Generates `.d.ts` files |
| `declarationMap` | Generates source maps for declaration files |
| `emitDeclarationOnly` | Generates declarations without JavaScript |
| `declarationDir` | Specifies declaration output directory |

### Example

```json
{
  "compilerOptions": {
    "declaration": true,
    "emitDeclarationOnly": true,
    "declarationDir": "./types"
  }
}
```

This generates declaration files in the `types` directory.

It does not generate JavaScript output.

---

# 13. Source Maps

Source maps connect generated JavaScript code back to the original TypeScript source code.

Why are they needed?

Suppose you write:

`app.ts`

```typescript
function divide(a: number, b: number): number {
    return a / b;
}

console.log(divide(10, 0));
```

After compilation, JavaScript is generated.

When debugging, you generally want to see the original TypeScript source rather than only the generated JavaScript.

Source maps help debugging tools map generated code locations back to original source locations.

### Enable Source Maps

```json
{
  "compilerOptions": {
    "sourceMap": true
  }
}
```

After compilation:

```text
src/
  app.ts

dist/
  app.js
  app.js.map
```

The `.map` file contains mapping information.

### Related Options

| Option | Purpose |
|---|---|
| `sourceMap` | Generates JavaScript source maps |
| `inlineSourceMap` | Embeds source-map data in JavaScript |
| `inlineSources` | Embeds original source content in source maps |

### Why Are Source Maps Useful?

- Debugging.
- Stack trace analysis.
- Development tooling.
- Browser developer tools.
- Node.js debugging.

---

# 14. Ambient Declarations

Ambient Declarations describe variables, functions, modules, or types that exist outside the current TypeScript implementation.

They commonly use the `declare` keyword.

### Example: Global Variable

Suppose an external JavaScript script provides:

```javascript
window.appVersion = "1.0.0";
```

TypeScript may not know about this property.

You can declare it:

```typescript
declare global {
    interface Window {
        appVersion: string;
    }
}

export {};
```

Now:

```typescript
console.log(window.appVersion);
```

is recognized by TypeScript.

### Example: Declare a Global Function

Suppose a JavaScript library provides:

```javascript
function calculateTax(price) {
    return price * 0.18;
}
```

You can declare:

```typescript
declare function calculateTax(
    price: number
): number;
```

Now TypeScript understands the function.

But the declaration does not create the actual function.

The JavaScript implementation must exist at runtime.

### Example: Declare a Module

Suppose you have an untyped JavaScript module:

```javascript
export function greet(name) {
    return `Hello ${name}`;
}
```

You can declare its type:

```typescript
declare module "my-library" {
    export function greet(name: string): string;
}
```

This tells TypeScript how to type-check imports from that module.

---

# 15. Global Scope vs Module Scope

Understanding the difference between scripts and modules is important in TypeScript.

### Global Script

A file without imports or exports can be treated as a script.

Declarations in such a file can contribute to the global scope.

Example:

`file1.ts`

```typescript
const appName = "My Application";
```

`file2.ts`

```typescript
console.log(appName);
```

Depending on the project configuration and whether these files are treated as scripts, declarations can be shared globally.

### Module

A file containing a top-level import or export is treated as a module.

Example:

`user.ts`

```typescript
export const userName = "Riyaz";
```

`app.ts`

```typescript
import { userName } from "./user";

console.log(userName);
```

The value is accessed through an explicit module import.

### Comparison

| Feature | Script | Module |
|---|---|---|
| Scope | Can contribute to global scope | Has its own module scope |
| Imports/exports | No top-level module syntax | Uses import/export |
| Variable sharing | May share global declarations | Requires imports/exports |
| Modern application use | Less common | Standard approach |

### Important

A file can be made into a module explicitly:

```typescript
export {};
```

This marks the file as a module even if it exports no actual values.

---

# 16. Declaration Merging

Declaration Merging is a TypeScript feature that allows certain declarations with the same name to be combined.

It is especially useful when extending existing interfaces.

### Example: Interface Merging

```typescript
interface User {
    id: number;
}

interface User {
    name: string;
}
```

TypeScript combines them.

The resulting type is equivalent to:

```typescript
interface User {
    id: number;
    name: string;
}
```

Usage:

```typescript
const user: User = {
    id: 1,
    name: "Riyaz"
};
```

### Example: Namespace Merging

```typescript
function createUser(name: string) {
    return {
        name
    };
}

namespace createUser {
    export const version = "1.0";
}

console.log(createUser("Riyaz"));
console.log(createUser.version);
```

This is a specialized declaration-merging pattern.

### Important Declaration Merging Rules

| Declaration | Can Merge? |
|---|---|
| Interface + Interface | Yes |
| Namespace + Namespace | Yes |
| Class + Namespace | Yes |
| Function + Namespace | Yes |
| Enum + Namespace | Yes |
| Class + Class | No |
| Type Alias + Type Alias | No |
| Interface + Type Alias | No |

Some declaration combinations have additional rules and restrictions.

---

# 17. Module Augmentation

Module Augmentation allows you to extend the type declarations of an existing module.

It is commonly used when a library provides a type that needs to be extended.

### Example

Suppose an external library defines:

```typescript
// library.ts

export interface User {
    id: number;
    name: string;
}
```

Now suppose we want to add an `email` property to the interface.

We can augment the module:

```typescript
// custom-types.ts

import "library";

declare module "library" {
    interface User {
        email: string;
    }
}
```

Now TypeScript understands:

```typescript
import { User } from "library";

const user: User = {
    id: 1,
    name: "Riyaz",
    email: "riyaz@example.com"
};
```

### Important Rules

- Module augmentation extends existing declarations.
- It does not create a runtime implementation.
- It generally works by merging compatible declarations.
- It cannot arbitrarily introduce new top-level declarations into a module.
- The augmented module must be resolvable by TypeScript.

### Practical Use Case: Express Request

Suppose you want to add an authenticated user to the Express request type.

Example:

```typescript
import "express";

declare module "express-serve-static-core" {
    interface Request {
        user?: {
            id: number;
            email: string;
        };
    }
}
```

Now Express request objects can have a typed `user` property.

Your authentication middleware must still assign the actual runtime value.

---

# 18. Namespaces

Namespaces provide a way to organize related declarations under a named scope.

They were more commonly used in older TypeScript applications.

### Example

```typescript
namespace MathUtils {
    export function add(a: number, b: number): number {
        return a + b;
    }

    export function subtract(a: number, b: number): number {
        return a - b;
    }
}
```

Usage:

```typescript
console.log(MathUtils.add(10, 20));

console.log(MathUtils.subtract(20, 10));
```

### Nested Namespace

```typescript
namespace App {
    export namespace Users {
        export function create(name: string) {
            return {
                name
            };
        }
    }
}
```

Usage:

```typescript
App.Users.create("Riyaz");
```

### Namespaces vs ES Modules

| Feature | Namespace | ES Module |
|---|---|---|
| Organization | Named namespace | Separate files and modules |
| Scope | Namespace scope | Module scope |
| Import/export | Namespace-specific exports | Standard import/export |
| Modern application use | Less common | Recommended for most applications |
| File organization | Can exist in one or multiple files | Typically file-based |

**Important:** Namespaces still have legitimate use cases, especially in certain declaration files and legacy systems. However, ES Modules are generally preferred for modern application architecture.

---

# 19. ES Modules vs CommonJS

JavaScript has two major module systems commonly encountered in Node.js applications.

## 19.1 CommonJS

CommonJS traditionally uses:

- `require()`
- `module.exports`
- `exports`

Example:

`math.js`

```javascript
function add(a, b) {
    return a + b;
}

module.exports = {
    add
};
```

Import:

```javascript
const { add } = require("./math");

console.log(add(10, 20));
```

## 19.2 ES Modules

ES Modules use:

- `import`
- `export`

Example:

`math.js`

```javascript
export function add(a, b) {
    return a + b;
}
```

Import:

```javascript
import { add } from "./math.js";

console.log(add(10, 20));
```

### Comparison

| Feature | CommonJS | ES Modules |
|---|---|---|
| Import | `require()` | `import` |
| Export | `module.exports` | `export` |
| Loading model | Traditionally synchronous | Supports static linking and asynchronous module loading |
| Main use | Traditional Node.js projects | Modern JavaScript applications |
| Dynamic loading | `require()` | `import()` |
| Browser support | Requires tooling | Native support |

### Important: Node.js Module Configuration

In Node.js, the `"type"` field in `package.json` influences how `.js` files are interpreted.

ES Module package:

```json
{
    "type": "module"
}
```

CommonJS package:

```json
{
    "type": "commonjs"
}
```

Without an explicit package type, Node.js uses its default interpretation rules, which can vary with file extensions and configuration.

### File Extensions

| Extension | Typical Meaning |
|---|---|
| `.js` | JavaScript; interpretation depends on package configuration |
| `.mjs` | ES Module |
| `.cjs` | CommonJS |
| `.ts` | TypeScript; module interpretation depends on configuration and context |
| `.mts` | TypeScript ES Module |
| `.cts` | TypeScript CommonJS |

### TypeScript with NodeNext

For a modern Node.js TypeScript project:

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "strict": true,
        "outDir": "./dist"
    }
}
```

You should also configure the package module type appropriately.

**Important:** With NodeNext, TypeScript follows Node.js's module rules. Relative ESM imports commonly need their emitted JavaScript extensions in the TypeScript source.

Example:

```typescript
import { add } from "./math.js";
```

Even if the source file is `math.ts`, the import can correctly resolve to the emitted `math.js`.

---

# 20. Type-Only Imports and Exports

Sometimes you need to import a type without importing a runtime value.

TypeScript supports `import type` and `export type`.

### Example

```typescript
import type { User } from "./types";

function getUser(): User {
    return {
        id: 1,
        name: "Riyaz"
    };
}
```

The import is used only for type checking.

It does not need to remain as a runtime JavaScript import.

### Normal Import vs Type-Only Import

Normal import:

```typescript
import { User } from "./types";
```

Type-only import:

```typescript
import type { User } from "./types";
```

The second form explicitly indicates that the imported symbol is used only as a type.

### Example: Type-Only Export

```typescript
export type User = {
    id: number;
    name: string;
};
```

### Mixed Imports

```typescript
import { createUser, type User } from "./users";
```

Here:

- `createUser` is a runtime value.
- `User` is a type.

### Why Is This Useful?

- Clear separation between types and values.
- Better module dependency management.
- Cleaner emitted JavaScript.
- Helpful when using strict module syntax settings.

---

# 21. Path Aliases

Path aliases allow you to create shorter import paths.

Without aliases:

```typescript
import { User } from "../../../types/user";
import { database } from "../../../config/database";
```

This becomes difficult to maintain in deeply nested projects.

### Configure Aliases

In `tsconfig.json`:

```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"],
            "@types/*": ["src/types/*"],
            "@config/*": ["src/config/*"]
        }
    }
}
```

Now you can write:

```typescript
import { User } from "@types/user";

import { database } from "@config/database";
```

### Example Project Structure

```text
src/
│
├── config/
│   └── database.ts
│
├── types/
│   └── user.ts
│
├── services/
│   └── userService.ts
│
└── app.ts
```

### Important: TypeScript Paths Are Not Runtime Rewriting

This is a critical point.

`paths` helps TypeScript resolve imports during type checking and compilation.

It does not automatically rewrite import paths into runtime-compatible paths.

For example:

```typescript
import { User } from "@types/user";
```

may remain unchanged in emitted JavaScript.

Your runtime or bundler must know how to resolve the alias.

Depending on your project, configure:

- Vite aliases.
- Webpack aliases.
- Next.js aliases.
- Node.js-compatible runtime resolution.
- A build tool that rewrites paths.

### Next.js Example

Next.js supports TypeScript path aliases through `tsconfig.json`.

```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": ["./src/*"]
        }
    }
}
```

Then:

```typescript
import { User } from "@/types/user";
```

---

# 22. Project References

Project References allow you to divide a large TypeScript codebase into smaller TypeScript projects.

This is useful when applications contain multiple packages or modules.

### Why Are Project References Needed?

Imagine a large project:

```text
project/
│
├── packages/
│   ├── shared/
│   ├── database/
│   └── api/
│
├── apps/
│   ├── backend/
│   └── frontend/
│
└── tsconfig.json
```

Instead of compiling everything as one large project, we can configure separate TypeScript projects.

### Example: Root tsconfig.json

```json
{
    "files": [],
    "references": [
        {
            "path": "./packages/shared"
        },
        {
            "path": "./packages/database"
        },
        {
            "path": "./apps/backend"
        }
    ]
}
```

### Shared Package Configuration

`packages/shared/tsconfig.json`

```json
{
    "compilerOptions": {
        "composite": true,
        "declaration": true,
        "declarationMap": true,
        "outDir": "./dist",
        "rootDir": "./src",
        "strict": true
    },
    "include": ["src"]
}
```

### What Is composite?

The `composite` option enables a project to be referenced by another TypeScript project.

It also imposes certain requirements on project configuration.

### Build Referenced Projects

Use:

```bash
tsc --build
```

This builds projects in dependency order.

### Useful Commands

```bash
tsc --build
```

Build referenced projects.

```bash
tsc --build --watch
```

Watch referenced projects.

```bash
tsc --build --clean
```

Remove outputs produced by the build.

### Benefits

- Better project separation.
- Incremental builds.
- Improved build performance in suitable projects.
- Clear package boundaries.
- Easier monorepo organization.

---

# 23. Monorepo TypeScript Configuration

A **Monorepo** is a repository that contains multiple applications and packages.

Example:

```text
my-monorepo/
│
├── apps/
│   ├── frontend/
│   └── backend/
│
├── packages/
│   ├── shared/
│   ├── types/
│   └── database/
│
├── package.json
└── tsconfig.base.json
```

### What Is tsconfig.base.json?

It is a shared configuration file containing common TypeScript settings.

Example:

`tsconfig.base.json`

```json
{
    "compilerOptions": {
        "strict": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true
    }
}
```

### Frontend Configuration

`apps/frontend/tsconfig.json`

```json
{
    "extends": "../../tsconfig.base.json",
    "compilerOptions": {
        "target": "ES2022",
        "module": "ESNext",
        "moduleResolution": "Bundler",
        "jsx": "react-jsx"
    },
    "include": ["src"]
}
```

### Backend Configuration

`apps/backend/tsconfig.json`

```json
{
    "extends": "../../tsconfig.base.json",
    "compilerOptions": {
        "target": "ES2022",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "outDir": "./dist",
        "rootDir": "./src"
    },
    "include": ["src"]
}
```

Notice that the frontend and backend have different module-resolution requirements.

This is common in monorepos.

---

# 24. Building and Publishing TypeScript Libraries

Now let's understand how to create a reusable TypeScript package.

Suppose you want to create a utility library called:

`my-utils`

### Step 1: Initialize Project

```bash
mkdir my-utils

cd my-utils

npm init -y
```

### Step 2: Install TypeScript

```bash
npm install -D typescript
```

### Step 3: Create Project Structure

```text
my-utils/
│
├── src/
│   ├── index.ts
│   └── math.ts
│
├── package.json
└── tsconfig.json
```

### Step 4: Create Functions

`src/math.ts`

```typescript
export function add(a: number, b: number): number {
    return a + b;
}

export function subtract(a: number, b: number): number {
    return a - b;
}
```

### Step 5: Export Functions

`src/index.ts`

```typescript
export * from "./math";
```

### Step 6: Configure TypeScript

`tsconfig.json`

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",

        "rootDir": "./src",
        "outDir": "./dist",

        "declaration": true,
        "declarationMap": true,
        "sourceMap": true,

        "strict": true,
        "skipLibCheck": true
    },

    "include": ["src"]
}
```

For a NodeNext ESM package, configure the package as an ES module.

### Step 7: Configure package.json

```json
{
    "name": "my-utils",
    "version": "1.0.0",
    "type": "module",
    "main": "./dist/index.js",
    "types": "./dist/index.d.ts",
    "exports": {
        ".": {
            "types": "./dist/index.d.ts",
            "import": "./dist/index.js"
        }
    },
    "files": [
        "dist"
    ],
    "scripts": {
        "build": "tsc"
    },
    "devDependencies": {
        "typescript": "^5.0.0"
    }
}
```

The TypeScript version shown here is illustrative; use a compatible current version for your project.

### Step 8: Build the Package

```bash
npm run build
```

Generated structure:

```text
my-utils/
│
├── src/
│   ├── index.ts
│   └── math.ts
│
├── dist/
│   ├── index.js
│   ├── index.d.ts
│   ├── index.js.map
│   ├── math.js
│   ├── math.d.ts
│   └── math.js.map
│
├── package.json
└── tsconfig.json
```

### Step 9: Publish

Before publishing, verify:

- Package name availability.
- Correct entry points.
- Correct declaration files.
- Runtime compatibility.
- Package contents.
- Dependencies.

Then:

```bash
npm login
```

And:

```bash
npm publish
```

For a scoped package that should be public, you may need:

```bash
npm publish --access public
```

### Important: Real-World Library Publishing

The example above provides an ESM package entry point.

A library intended to support both ESM and CommonJS consumers may need separate builds and conditional exports.

For example:

```json
{
    "exports": {
        ".": {
            "types": "./dist/index.d.ts",
            "import": "./dist/esm/index.js",
            "require": "./dist/cjs/index.js"
        }
    }
}
```

The actual output directories and declaration files must match your build configuration.

---

# 25. Recommended tsconfig.json for Different Projects

Different project types require different configurations.

## 25.1 Node.js Backend

For a modern Node.js backend using ESM:

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

        "sourceMap": true
    },

    "include": ["src"],
    "exclude": ["node_modules", "dist"]
}
```

## 25.2 React + TypeScript with Vite

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "ESNext",
        "moduleResolution": "Bundler",

        "jsx": "react-jsx",

        "strict": true,
        "noEmit": true,

        "skipLibCheck": true
    },

    "include": ["src"]
}
```

## 25.3 Next.js + TypeScript

Next.js generally manages much of its TypeScript configuration automatically.

A typical configuration may look like:

```json
{
    "compilerOptions": {
        "target": "ES2017",
        "lib": ["dom", "dom.iterable", "esnext"],

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
            "@/*": ["./src/*"]
        }
    },

    "include": [
        "next-env.d.ts",
        ".next/types/**/*.ts",
        ".next/dev/types/**/*.ts",
        "**/*.ts",
        "**/*.tsx"
    ],

    "exclude": ["node_modules"]
}
```

The exact generated configuration can differ between Next.js versions and project structures. Prefer the configuration generated or recommended by your installed Next.js version.

---

# 26. Important Compiler Options Reference

Here is a consolidated reference.

| Option | Purpose |
|---|---|
| `target` | JavaScript output language target |
| `module` | Module system for output and module analysis |
| `moduleResolution` | How modules are resolved |
| `strict` | Enables strict type checking |
| `noEmit` | Prevents output generation |
| `outDir` | Output directory |
| `rootDir` | Root directory for emitted file structure |
| `declaration` | Generates `.d.ts` files |
| `declarationMap` | Generates declaration source maps |
| `emitDeclarationOnly` | Generates only declaration files |
| `sourceMap` | Generates source maps |
| `removeComments` | Removes comments from emitted JavaScript |
| `esModuleInterop` | Enables compatibility helpers for certain CommonJS interop scenarios |
| `allowJs` | Allows JavaScript files in the project |
| `checkJs` | Type-checks JavaScript files |
| `resolveJsonModule` | Allows importing JSON files |
| `skipLibCheck` | Skips checking declaration files |
| `incremental` | Enables incremental compilation |
| `composite` | Enables project-reference support |
| `baseUrl` | Sets a base directory for non-relative module resolution |
| `paths` | Defines module path mappings |
| `types` | Specifies visible `@types` packages |
| `typeRoots` | Specifies directories containing type packages |
| `noUnusedLocals` | Reports unused local declarations |
| `noUnusedParameters` | Reports unused parameters |
| `noImplicitReturns` | Checks that function code paths return values consistently |
| `noFallthroughCasesInSwitch` | Reports accidental switch fallthrough |
| `isolatedModules` | Checks compatibility with single-file transpilation tools |

---

# 27. Common Mistakes

| Mistake | Correct Understanding |
|---|---|
| Thinking TypeScript runs directly in every JavaScript runtime | TypeScript-specific syntax must be transformed or otherwise handled by a compatible runtime/tooling setup. |
| Confusing `target` and `module` | `target` controls JavaScript language output; `module` controls module-system behavior. |
| Assuming `paths` rewrites runtime imports | It primarily configures TypeScript resolution. |
| Thinking `.d.ts` files contain implementations | They describe types and public APIs. |
| Assuming `declare` creates a variable or function | It only tells TypeScript that the declaration exists. |
| Thinking `noEmit` disables type checking | It disables output generation, not type checking. |
| Assuming `Object.freeze()` and `readonly` are equivalent | One is runtime behavior; the other is a compile-time restriction. |
| Mixing CommonJS and ESM without configuration | Module interpretation must be consistent with Node.js and package settings. |
| Using namespaces for every new application | ES Modules are usually preferable for modern application development. |
| Assuming declaration merging works with type aliases | Interfaces can merge, but type aliases cannot merge in the same way. |
| Assuming project references automatically solve every monorepo problem | Package dependencies and build configuration must still be designed correctly. |
| Ignoring generated declaration files when publishing | Consumers need correct type entry points. |

---

# 28. TypeScript Compiler Interview Questions

### Q1. What is the TypeScript compiler?

The TypeScript compiler analyzes TypeScript code, checks types, and can generate JavaScript output.

### Q2. What is tsc?

`tsc` is the command-line interface for the TypeScript compiler.

### Q3. What is tsconfig.json?

It is the configuration file that controls TypeScript project compilation and type checking.

### Q4. What is the difference between target and module?

`target` controls the JavaScript language version emitted by TypeScript. `module` controls module-system behavior.

### Q5. What is moduleResolution?

It determines how TypeScript locates imported modules.

### Q6. What is strict mode?

It enables a group of stricter type-checking options.

### Q7. What is noEmit?

It prevents TypeScript from generating output files while still allowing type checking.

### Q8. What is outDir?

It specifies the directory where generated files are placed.

### Q9. What is rootDir?

It specifies the root directory used when calculating the output directory structure.

### Q10. What is a declaration file?

A `.d.ts` file describes the types and public API of JavaScript code without implementing runtime behavior.

### Q11. What is ambient declaration?

An ambient declaration tells TypeScript about variables, functions, modules, or types that exist elsewhere.

### Q12. What is declaration merging?

It is a TypeScript feature that combines certain declarations with the same name, such as compatible interface declarations.

### Q13. What is module augmentation?

It extends the type declarations of an existing module.

### Q14. What is the difference between a namespace and a module?

A namespace groups declarations under a named scope. An ES module organizes code using file-based imports and exports.

### Q15. What is the difference between CommonJS and ES Modules?

CommonJS uses `require()` and `module.exports`, while ES Modules use `import` and `export`.

### Q16. What is import type?

It explicitly imports a symbol only for type checking.

### Q17. What are path aliases?

They are custom import mappings configured using TypeScript's `paths` option.

### Q18. Do path aliases automatically work in Node.js?

Not necessarily. TypeScript's `paths` option does not itself rewrite runtime import paths. Runtime or build-tool support is required.

### Q19. What are project references?

They allow a large TypeScript codebase to be split into smaller interdependent TypeScript projects.

### Q20. What is composite?

It is a compiler option that enables a project to be referenced by other TypeScript projects.

### Q21. What is a monorepo?

A repository containing multiple applications or packages.

### Q22. What is skipLibCheck?

It skips type checking of declaration files, which can reduce compilation time in some projects.

### Q23. What are source maps?

Source maps map generated JavaScript locations back to original TypeScript source locations.

### Q24. What is declarationMap?

It generates source maps for declaration files, helping tools navigate from declarations back to their original source.

### Q25. Why are declaration files important when publishing TypeScript libraries?

They allow consumers to receive type information and use the library with TypeScript type checking and editor support.

---

# 29. Practical Exercises

Complete these exercises before moving forward.

## Beginner Level

**Exercise 1: TypeScript Compiler**

Create a TypeScript project and compile a file using:

```bash
tsc app.ts
```

Observe the generated JavaScript.

**Exercise 2: tsconfig.json**

Create a configuration file and configure:

- `target`
- `module`
- `strict`
- `rootDir`
- `outDir`

**Exercise 3: Strict Mode**

Enable strict mode and fix the errors generated by TypeScript.

**Exercise 4: noEmit**

Enable `noEmit` and verify that TypeScript checks your files without generating JavaScript.

**Exercise 5: Source Maps**

Enable `sourceMap` and inspect the generated `.map` file.

## Intermediate Level

**Exercise 6: Declaration Files**

Create a JavaScript function and write a corresponding `.d.ts` file.

**Exercise 7: Ambient Declarations**

Declare an external global function and use it from TypeScript.

**Exercise 8: Declaration Merging**

Create two interfaces with the same name and observe how TypeScript combines them.

**Exercise 9: Module Augmentation**

Extend an interface from an external library.

**Exercise 10: Type-Only Imports**

Create a project using `import type` and inspect the generated JavaScript.

## Advanced Level

**Exercise 11: Path Aliases**

Configure aliases in a Node.js or React TypeScript project.

Verify that the aliases also work in your runtime or bundler.

**Exercise 12: Project References**

Create two TypeScript projects:

- `shared`
- `backend`

Make the backend project reference the shared project.

**Exercise 13: Monorepo**

Create a monorepo containing:

```text
apps/
  frontend/
  backend/

packages/
  shared/
  types/
```

Configure separate TypeScript projects.

**Exercise 14: TypeScript Library**

Build a small reusable TypeScript utility package.

Generate:

- JavaScript files.
- Declaration files.
- Source maps.

**Exercise 15: Publish-Ready Package**

Configure the package's:

- `main`
- `types`
- `exports`
- `files`
- `scripts`

Verify that another local project can install and use the package.

---

# 30. Phase 34 Completion Checklist

| No. | Topic | Status |
|---:|---|---|
| 1 | TypeScript Compiler | ☐ |
| 2 | Compilation Process | ☐ |
| 3 | Abstract Syntax Tree | ☐ |
| 4 | Binding and Type Checking | ☐ |
| 5 | tsconfig.json | ☐ |
| 6 | target | ☐ |
| 7 | module | ☐ |
| 8 | moduleResolution | ☐ |
| 9 | Strict Mode | ☐ |
| 10 | noEmit | ☐ |
| 11 | rootDir and outDir | ☐ |
| 12 | Declaration Files | ☐ |
| 13 | Generating .d.ts Files | ☐ |
| 14 | Source Maps | ☐ |
| 15 | Ambient Declarations | ☐ |
| 16 | Global vs Module Scope | ☐ |
| 17 | Declaration Merging | ☐ |
| 18 | Module Augmentation | ☐ |
| 19 | Namespaces | ☐ |
| 20 | CommonJS vs ES Modules | ☐ |
| 21 | Type-Only Imports and Exports | ☐ |
| 22 | Path Aliases | ☐ |
| 23 | Project References | ☐ |
| 24 | Monorepo Configuration | ☐ |
| 25 | Building TypeScript Libraries | ☐ |

---

# 31. What Comes Next?

## Phase 35: Advanced TypeScript – Testing, Debugging, Error Handling, and Code Quality

In the next phase, we will focus on writing reliable, maintainable, production-ready TypeScript applications.

Topics will include:

1. Unit Testing with TypeScript.
2. Integration Testing.
3. End-to-End Testing.
4. Jest and Vitest.
5. Testing TypeScript Functions.
6. Mocking and Spying.
7. Dependency Injection for Testing.
8. Testing Async Functions.
9. Testing API Endpoints.
10. TypeScript Debugging.
11. Source Maps in Debugging.
12. Error Handling Strategies.
13. Custom Error Classes.
14. Error Boundaries and Error Propagation.
15. Logging Strategies.
16. ESLint.
17. Prettier.
18. TypeScript Code Quality.
19. Static Analysis.
20. Production-Ready Testing Architecture.

**Phase 34 is complete.**

When you're ready, say **"OK, Phase 35"** to continue.