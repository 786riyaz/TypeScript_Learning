# Phase 30: TypeScript Configuration, Compiler Internals, Build Systems, and Advanced Project Setup

**Level:** Advanced  
**Category:** TypeScript Compiler & Project Configuration  
**Prerequisites:** TypeScript fundamentals, Node.js, JavaScript modules, TypeScript architecture, and backend development.

## Learning Objectives

By the end of this phase, you will understand:

1. How the TypeScript compiler works.
2. How TypeScript code is compiled into JavaScript.
3. The difference between type checking and transpilation.
4. How to configure TypeScript using `tsconfig.json`.
5. Important TypeScript compiler options.
6. How module systems work in TypeScript.
7. CommonJS vs ES Modules.
8. How TypeScript resolves modules.
9. How to configure TypeScript for Node.js.
10. How to configure TypeScript for frontend applications.
11. What declaration files are.
12. How source maps work.
13. How incremental compilation works.
14. How project references work.
15. How to configure TypeScript monorepos.
16. The differences between `tsc`, `tsx`, `ts-node`, and bundlers.
17. How to prepare a production-ready TypeScript project.

---

# PART 1: TYPESCRIPT COMPILER FUNDAMENTALS

## 1. What Is the TypeScript Compiler?

The TypeScript Compiler is a tool that converts TypeScript code into JavaScript.

It is commonly called **TSC**.

The compiler executable is:

```bash
tsc
```

TypeScript is a superset of JavaScript that adds a static type system and other development features.

However, JavaScript engines such as V8 do not directly execute TypeScript syntax.

Therefore, TypeScript generally needs to be transformed into JavaScript before execution.

### Example

TypeScript code:

```typescript
const username: string = "Riyaz";

function greet(name: string): string {
  return `Hello ${name}`;
}

console.log(greet(username));
```

After compilation, JavaScript might look like:

```javascript
const username = "Riyaz";

function greet(name) {
    return `Hello ${name}`;
}

console.log(greet(username));
```

Notice:

- `: string` has been removed.
- Function parameter types have been removed.
- JavaScript functionality remains.

The generated JavaScript is what the JavaScript runtime executes.

### Important

TypeScript types generally exist only during development and compilation.

They are not automatically available at runtime.

For example:

```typescript
interface User {
  name: string;
  age: number;
}
```

After compilation, the interface disappears.

JavaScript does not have a runtime `User` interface.

---

## 2. How TypeScript Compilation Works

Let's understand the compilation process.

```text
          TypeScript Source Code
                  |
                  v
               Scanner
                  |
                  v
                Parser
                  |
                  v
              AST Creation
                  |
                  v
             Type Checker
                  |
                  v
             Transformation
                  |
                  v
             JavaScript Output
```

This is a simplified conceptual representation of the TypeScript compiler pipeline.

### Step 1: Scanner

The scanner reads the source code and converts it into tokens.

Example:

```typescript
const age: number = 25;
```

The scanner identifies tokens such as:

```text
const
age
:
number
=
25
;
```

### Step 2: Parser

The parser analyzes the tokens and builds an Abstract Syntax Tree (AST).

An AST represents the structure of source code.

For example:

```typescript
const age: number = 25;
```

The AST conceptually represents:

```text
Variable Declaration
       |
   ----------
   |        |
  Name    Initializer
   |        |
  age      25
```

The actual TypeScript AST is more detailed.

### Step 3: Type Checker

The TypeScript compiler checks whether the code follows the type system.

Example:

```typescript
let age: number = 25;

age = "twenty-five";
```

TypeScript reports an error because a string cannot be assigned to a variable declared as `number`.

### Step 4: Transformation

TypeScript-specific syntax that needs transformation is converted into JavaScript-compatible syntax according to the selected compiler settings.

Some syntax, such as interfaces and type annotations, is removed.

### Step 5: JavaScript Output

The compiler generates JavaScript files.

Example:

```bash
tsc app.ts
```

Output:

```text
app.ts
app.js
```

### Important

TypeScript compilation does not guarantee that your application will work correctly at runtime.

For example:

```typescript
const user = JSON.parse('{"name":"Riyaz"}') as {
  name: string;
  age: number;
};

console.log(user.age.toFixed(2));
```

TypeScript accepts this assertion, but `user.age` is actually `undefined`.

The application fails at runtime.

**TypeScript provides static type checking, not automatic runtime validation.**

---

## 3. Type Checking vs Transpilation

These are two different responsibilities.

### Type Checking

Type checking verifies whether your code follows TypeScript's type rules.

Example:

```typescript
const age: number = "25";
```

This produces a type error.

### Transpilation

Transpilation transforms source code into another language or language version.

Example:

```typescript
const name: string = "Riyaz";
```

Becomes:

```javascript
const name = "Riyaz";
```

### Comparison

| Type Checking | Transpilation |
|---|---|
| Checks type correctness. | Converts source syntax. |
| Finds type errors. | Produces JavaScript output. |
| Uses TypeScript's type system. | Uses compiler transformation rules. |
| Does not execute application code. | Does not guarantee runtime correctness. |

### Important Compiler Option: `noEmit`

Suppose you only want TypeScript to check your code.

You can use:

```bash
tsc --noEmit
```

This performs type checking without generating JavaScript files.

This is useful in:

- CI/CD pipelines.
- Development workflows.
- Projects where another tool handles transpilation.

---

# PART 2: TYPESCRIPT INSTALLATION AND COMMANDS

## 4. Installing TypeScript

You can install TypeScript globally:

```bash
npm install -g typescript
```

Verify installation:

```bash
tsc --version
```

However, for most projects, installing TypeScript locally as a development dependency is preferable.

```bash
npm install -D typescript
```

Now the project can use its own TypeScript version.

### Why Local Installation?

Suppose:

- Project A uses TypeScript version X.
- Project B uses TypeScript version Y.

Global installation can create version inconsistencies.

Local installation ensures that each project uses its configured compiler version.

### Useful Commands

| Command | Purpose |
|---|---|
| `tsc --version` | Shows compiler version. |
| `tsc app.ts` | Compiles a TypeScript file. |
| `tsc` | Compiles the project using `tsconfig.json`. |
| `tsc --init` | Creates a `tsconfig.json`. |
| `tsc --noEmit` | Checks types without generating files. |
| `tsc --watch` | Watches files and recompiles changes. |
| `tsc --build` | Builds projects using project references. |
| `tsc --listFiles` | Lists files included in compilation. |
| `tsc --showConfig` | Displays resolved compiler configuration. |

---

# PART 3: TSCONFIG.JSON

## 5. What Is tsconfig.json?

`tsconfig.json` is the configuration file used by the TypeScript compiler.

It defines how TypeScript should:

- Find source files.
- Check types.
- Resolve modules.
- Generate JavaScript.
- Handle strict type checking.
- Generate declaration files.
- Generate source maps.
- Organize build output.

### Create tsconfig.json

Run:

```bash
tsc --init
```

This creates a TypeScript configuration file.

A project may contain many compiler options, but you do not need to enable every option.

Let's understand the important ones.

---

## 6. Basic tsconfig.json Structure

A simplified configuration:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

Let's understand each option.

---

# PART 4: IMPORTANT COMPILER OPTIONS

## 7. target

The `target` option specifies the JavaScript language version that TypeScript should generate.

Example:

```json
{
  "compilerOptions": {
    "target": "ES2022"
  }
}
```

This tells TypeScript to generate JavaScript targeting ES2022.

### Common Target Values

| Target | Description |
|---|---|
| ES5 | Older JavaScript environments. |
| ES2015 / ES6 | Introduced classes, `let`, `const`, promises, etc. |
| ES2017 | Added features such as `async`/`await` support. |
| ES2020 | Includes features such as optional chaining and nullish coalescing. |
| ES2022 | Includes features such as class fields and top-level await support in suitable module contexts. |
| ESNext | Targets the latest JavaScript features supported by the compiler. |

### Example

TypeScript:

```typescript
class User {
  constructor(public name: string) {}
}
```

With an older target, the generated JavaScript may need additional transformations.

With a modern target, more modern JavaScript syntax can be preserved.

### Important

`target` does not control which JavaScript features are allowed in your TypeScript source code.

It primarily controls the JavaScript output level.

Also, it does not automatically provide polyfills for missing runtime APIs.

For example, targeting ES2022 does not guarantee that an older browser supports every ES2022 feature.

---

## 8. module

The `module` option controls which JavaScript module system TypeScript generates or preserves.

JavaScript has multiple module systems.

The two important ones are:

1. CommonJS.
2. ECMAScript Modules (ESM).

### A. CommonJS

CommonJS is traditionally used in Node.js.

Example:

```javascript
const express = require("express");

module.exports = express;
```

TypeScript:

```typescript
import express from "express";

export default express;
```

With CommonJS module output, TypeScript transforms imports and exports into CommonJS-style operations.

Conceptually:

```javascript
const express = require("express");

module.exports = express;
```

### B. ES Modules

ES Modules are the standardized JavaScript module system.

Example:

```javascript
import express from "express";

export default express;
```

The syntax remains as `import` and `export` in the generated JavaScript.

### Common module values

| Value | Description |
|---|---|
| `CommonJS` | Generates CommonJS-style output. |
| `ES2015` | Generates ES Module output. |
| `ES2020` | Supports modern ESM features. |
| `ES2022` | Supports modern ESM output. |
| `ESNext` | Uses the latest supported module syntax. |
| `Node16` | Models Node.js module behavior for the Node16 module system. |
| `NodeNext` | Models modern Node.js module behavior. |
| `Preserve` | Preserves module syntax for tools that handle bundling or transformation. |

### Which Should You Use?

For a modern Node.js project, `NodeNext` is a strong option when you want TypeScript to model Node.js module behavior.

For a frontend application using a bundler such as Vite, the bundler's recommended module configuration is generally more appropriate.

Do not select `CommonJS` or `ESNext` without considering your runtime and build tool.

---

## 9. moduleResolution

The `moduleResolution` option controls how TypeScript finds imported modules.

Suppose you write:

```typescript
import { User } from "./User";
```

TypeScript needs to locate the corresponding module.

It may look for:

```text
User.ts
User.tsx
User.d.ts
```

It also resolves packages from `node_modules`.

### Common Values

| Value | Use |
|---|---|
| `Node10` | Older Node.js module resolution behavior. |
| `Node16` | Node.js-aware resolution for the Node16 module system. |
| `NodeNext` | Modern Node.js-aware resolution. |
| `Bundler` | Resolution designed for bundler-based projects. |

### NodeNext

For modern Node.js applications:

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  }
}
```

This models Node.js ESM/CommonJS resolution rules.

### Bundler

For frontend applications using Vite, Webpack, or similar tools:

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler"
  }
}
```

This allows TypeScript to resolve modules using rules commonly supported by bundlers.

### Important

`module` and `moduleResolution` are related.

For example, when using `NodeNext`, TypeScript expects compatible Node.js-aware module resolution.

For `moduleResolution: "Bundler"`, use an appropriate modern module setting such as `ESNext` or `Preserve`.

---

## 10. strict

The `strict` option enables a group of stricter type-checking options.

Example:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

It enables checks such as:

- `strictNullChecks`.
- `strictFunctionTypes`.
- `strictBindCallApply`.
- `strictPropertyInitialization`.
- `noImplicitAny`.
- `noImplicitThis`.
- `alwaysStrict`.
- `useUnknownInCatchVariables`.

Some additional strictness-related compiler options can be configured independently.

### Example Without Strict Checking

```typescript
function greet(name) {
  return "Hello " + name;
}
```

TypeScript may infer `any` for the parameter if `noImplicitAny` is disabled.

### With Strict Checking

```typescript
function greet(name: string): string {
  return "Hello " + name;
}
```

Now the parameter and return type are explicit.

### Recommendation

For new TypeScript projects:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

This helps catch many problems early.

---

## 11. strictNullChecks

This option ensures that `null` and `undefined` are handled explicitly.

Example:

```typescript
let username: string = "Riyaz";

username = null;
```

With:

```json
{
  "compilerOptions": {
    "strictNullChecks": true
  }
}
```

TypeScript reports an error.

### Correct Approach

If a value can be a string or null:

```typescript
let username: string | null = "Riyaz";

username = null;
```

Similarly:

```typescript
let age: number | undefined;
```

### Real-World Example

Consider a database query.

```typescript
async function getUser(id: string): Promise<User | null> {
  // Database lookup
  return null;
}
```

The function may return:

- A User object.
- `null` if the user does not exist.

Therefore, callers must handle both possibilities.

```typescript
const user = await getUser("101");

if (!user) {
  throw new Error("User not found");
}

console.log(user.name);
```

This prevents many runtime errors.

---

## 12. noImplicitAny

This option prevents TypeScript from silently inferring `any` in situations where a type cannot be inferred.

Example:

```typescript
function add(a, b) {
  return a + b;
}
```

With `noImplicitAny: true`, TypeScript reports errors for the untyped parameters.

Correct:

```typescript
function add(a: number, b: number): number {
  return a + b;
}
```

### What Is Any?

`any` disables most type checking for a value.

Example:

```typescript
let value: any = 10;

value = "Hello";

value = true;

value.toUpperCase();
```

The compiler allows these operations even though the final operation may fail at runtime.

### Recommendation

Avoid unnecessary `any`.

Prefer:

- Explicit types.
- Generics.
- Union types.
- `unknown` when the type is not known.

---

## 13. useUnknownInCatchVariables

This option makes catch variables have the type `unknown` by default.

Example:

```typescript
try {
  throw new Error("Something went wrong");
} catch (error) {
  console.log(error.message);
}
```

With `useUnknownInCatchVariables: true`, TypeScript reports an error because `error` is `unknown`.

Why?

Because JavaScript allows throwing any value.

For example:

```typescript
throw "Something went wrong";

throw 404;

throw {
  message: "Failed"
};
```

Therefore, TypeScript cannot assume that every caught value is an Error object.

### Correct Approach

```typescript
try {
  throw new Error("Something went wrong");
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
  } else {
    console.log("Unknown error:", error);
  }
}
```

This is safer.

---

## 14. noEmit

The `noEmit` option prevents TypeScript from generating JavaScript output.

```json
{
  "compilerOptions": {
    "noEmit": true
  }
}
```

TypeScript still checks the source code.

### When to Use?

Useful when another tool handles JavaScript generation.

Examples:

- Vite.
- esbuild.
- SWC.
- Babel.

For example, a frontend application may use TypeScript for type checking while Vite handles the actual build.

---

## 15. declaration

The `declaration` option generates TypeScript declaration files.

```json
{
  "compilerOptions": {
    "declaration": true
  }
}
```

It generates `.d.ts` files alongside JavaScript output.

### Example

Source:

```typescript
export function add(
  a: number,
  b: number
): number {
  return a + b;
}
```

Generated JavaScript:

```javascript
export function add(a, b) {
  return a + b;
}
```

Generated declaration file:

```typescript
export declare function add(
  a: number,
  b: number
): number;
```

### Why Are Declaration Files Useful?

They describe the public types of a JavaScript library.

For example, when you install a package, TypeScript may use its `.d.ts` files to understand:

- Available functions.
- Class properties.
- Function parameters.
- Return types.
- Interfaces.

This is particularly important when publishing TypeScript libraries.

---

## 16. declarationMap

The `declarationMap` option generates source maps for declaration files.

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true
  }
}
```

It helps editors navigate from generated declaration files back to their original TypeScript source.

This is useful when developing:

- Shared packages.
- Monorepos.
- TypeScript libraries.
- Internal SDKs.

---

## 17. sourceMap

The `sourceMap` option generates source map files.

```json
{
  "compilerOptions": {
    "sourceMap": true
  }
}
```

A source map connects generated JavaScript code to the original TypeScript source.

### Example

Original:

```typescript
function divide(a: number, b: number): number {
  return a / b;
}

console.log(divide(10, 2));
```

Generated files:

```text
dist/
  app.js
  app.js.map
```

The `.map` file contains mapping information.

### Why Is It Useful?

Suppose an error occurs in generated JavaScript.

Without source maps, debugging may show:

```text
dist/app.js:15
```

With source maps enabled, your debugging tools can map the location back to:

```text
src/app.ts:2
```

This makes debugging easier.

---

## 18. outDir and rootDir

These options control source and output directory organization.

### rootDir

Specifies the root directory for source files that are included in the compilation.

```json
{
  "compilerOptions": {
    "rootDir": "./src"
  }
}
```

### outDir

Specifies where generated JavaScript files should be placed.

```json
{
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

### Example Project

```text
project/
│
├── src/
│   ├── app.ts
│   ├── server.ts
│   └── utils/
│       └── helper.ts
│
├── dist/
│
└── tsconfig.json
```

Configuration:

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  }
}
```

After compilation:

```text
project/
│
├── src/
│   ├── app.ts
│   ├── server.ts
│   └── utils/
│       └── helper.ts
│
├── dist/
│   ├── app.js
│   ├── server.js
│   └── utils/
│       └── helper.js
│
└── tsconfig.json
```

### Important Difference

| rootDir | outDir |
|---|---|
| Controls the source directory structure used for output layout. | Controls the generated output directory. |
| Does not determine which files are included. | Determines where generated files go. |
| Example: `./src`. | Example: `./dist`. |

---

## 19. include, exclude, and files

These options control which files are included in the TypeScript project.

### A. include

Specifies file patterns to include.

```json
{
  "include": ["src/**/*"]
}
```

This includes files under `src`.

### B. exclude

Specifies file patterns to exclude from the files found through `include`.

```json
{
  "exclude": [
    "node_modules",
    "dist",
    "tests"
  ]
}
```

### C. files

Specifies individual files to include.

```json
{
  "files": [
    "src/app.ts",
    "src/server.ts"
  ]
}
```

### Comparison

| Option | Purpose |
|---|---|
| `files` | Explicitly lists files. |
| `include` | Includes files using patterns. |
| `exclude` | Excludes matching files discovered through `include`. |

### Important

`exclude` is not a strict prohibition.

A file excluded through the configuration can still enter the compilation if it is imported by an included file or referenced through another inclusion mechanism.

Also, when you specify `files` or `include`, TypeScript still includes relevant declaration files from installed packages and standard libraries according to the compiler configuration.

---

# PART 5: ADDITIONAL IMPORTANT COMPILER OPTIONS

## 20. allowJs and checkJs

These options help projects migrate gradually from JavaScript to TypeScript.

### allowJs

Allows JavaScript files to be included in the TypeScript project.

```json
{
  "compilerOptions": {
    "allowJs": true
  }
}
```

### checkJs

Enables type checking for JavaScript files.

```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true
  }
}
```

Example:

```javascript
// app.js

/**
 * @param {number} a
 * @param {number} b
 */
function add(a, b) {
  return a + b;
}

add(10, "20");
```

With JavaScript checking enabled, TypeScript can report the incorrect argument.

### Why Is This Useful?

Suppose you have an existing Node.js application containing 100 JavaScript files.

You do not need to convert everything immediately.

You can gradually migrate files to TypeScript.

---

## 21. noUnusedLocals and noUnusedParameters

These options help identify unused variables and function parameters.

### noUnusedLocals

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
```

If `username` is never used, TypeScript reports an error.

### noUnusedParameters

```json
{
  "compilerOptions": {
    "noUnusedParameters": true
  }
}
```

Example:

```typescript
function greet(name: string, age: number): string {
  return `Hello ${name}`;
}
```

The `age` parameter is unused.

TypeScript reports an error.

### When to Use?

These options are useful for keeping code clean.

However, existing projects may need gradual adoption because enabling them can reveal many pre-existing warnings.

---

## 22. removeComments

This option controls whether comments are removed from emitted JavaScript.

```json
{
  "compilerOptions": {
    "removeComments": true
  }
}
```

Example:

TypeScript:

```typescript
// This function adds two numbers.

function add(a: number, b: number): number {
  return a + b;
}
```

Generated JavaScript will omit comments when `removeComments` is enabled.

### Important

This does not affect type checking.

It only affects emitted JavaScript.

---

## 23. skipLibCheck

This option skips type checking of declaration files (`.d.ts`).

```json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

### Why Is It Useful?

Large applications often depend on many packages.

Each package may contain declaration files.

Checking every declaration file can increase compilation time.

`skipLibCheck` can improve performance.

### Does It Mean TypeScript Ignores All Library Types?

No.

TypeScript still uses library declarations for type information.

It skips checking the declaration files themselves for errors.

### Recommendation

It is commonly enabled in application projects, but it should not be treated as a substitute for fixing problems in your own code.

---

## 24. esModuleInterop

This option improves interoperability between CommonJS and ES Module imports.

Example:

```typescript
import express from "express";
```

Depending on the package's export format and TypeScript module settings, interoperability settings can affect how imports are handled.

Configuration:

```json
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}
```

It enables compatibility behavior for default imports from certain CommonJS modules.

### Related Option: allowSyntheticDefaultImports

This option allows certain default import syntax during type checking even when the module does not explicitly declare a default export.

```json
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true
  }
}
```

### Difference

| esModuleInterop | allowSyntheticDefaultImports |
|---|---|
| Provides interoperability behavior and affects emitted CommonJS helpers. | Primarily affects type-checking acceptance of default imports. |
| Also enables synthetic default import behavior. | Does not itself generate interoperability helpers. |

**Important:** With native Node.js ESM and `NodeNext`, module interoperability follows Node.js rules. Do not assume that enabling `esModuleInterop` makes every CommonJS package import work identically in every runtime.

---

## 25. forceConsistentCasingInFileNames

This option ensures that imports use consistent file-name casing.

```json
{
  "compilerOptions": {
    "forceConsistentCasingInFileNames": true
  }
}
```

Suppose the actual file is:

```text
UserService.ts
```

But you import:

```typescript
import { UserService } from "./userservice";
```

This might work on a case-insensitive filesystem but fail on a case-sensitive filesystem.

This option helps catch such problems.

It is especially useful when developers work across Windows, Linux, and macOS.

---

## 26. incremental

The `incremental` option enables incremental compilation.

```json
{
  "compilerOptions": {
    "incremental": true
  }
}
```

TypeScript stores information about previous compilation in a build information file.

Usually:

```text
tsconfig.tsbuildinfo
```

### Without Incremental Compilation

```text
Change one file
      |
      v
Compile entire project
```

### With Incremental Compilation

```text
Change one file
      |
      v
Analyze changed files
      |
      v
Reuse previous build information
      |
      v
Perform necessary compilation work
```

### Benefits

- Faster rebuilds.
- Better performance in large projects.
- Useful for development and CI builds.

### Important

Incremental compilation does not mean TypeScript will always compile only one file.

Changes can affect dependent files, so the compiler may need to recheck additional parts of the project.

---

## 27. composite

The `composite` option enables a project to participate in TypeScript Project References.

```json
{
  "compilerOptions": {
    "composite": true
  }
}
```

It imposes additional project requirements, including explicit source-file inclusion and declaration generation.

It is especially useful in large monorepos.

We will discuss Project References later in this phase.

---

# PART 6: COMMONJS VS ES MODULES

## 28. What Are JavaScript Modules?

A module is a separate file or unit of code that can expose functionality to other files.

Modules help organize applications.

Example:

```typescript
// math.ts

export function add(a: number, b: number): number {
  return a + b;
}
```

Another file:

```typescript
// app.ts

import { add } from "./math.js";

console.log(add(10, 20));
```

This is the ES Module system.

### Why Do We Need Modules?

Without modules, large applications would become difficult to organize.

Modules provide:

- Code organization.
- Reusability.
- Encapsulation.
- Dependency management.
- Separation of concerns.

---

## 29. CommonJS

CommonJS is a module system traditionally used by Node.js.

### Export

```javascript
// math.js

function add(a, b) {
  return a + b;
}

module.exports = {
  add
};
```

### Import

```javascript
// app.js

const { add } = require("./math");

console.log(add(10, 20));
```

### Important CommonJS Objects

| Object | Purpose |
|---|---|
| `require()` | Imports modules. |
| `module.exports` | Exports module functionality. |
| `exports` | Shortcut referencing `module.exports` initially. |
| `__dirname` | Current module directory in CommonJS. |
| `__filename` | Current module filename in CommonJS. |

---

## 30. ES Modules (ESM)

ES Modules are the standardized JavaScript module system.

### Export

```javascript
// math.js

export function add(a, b) {
  return a + b;
}
```

### Import

```javascript
// app.js

import { add } from "./math.js";

console.log(add(10, 20));
```

### Common ESM Syntax

Named export:

```typescript
export const username = "Riyaz";
```

Named import:

```typescript
import { username } from "./user.js";
```

Default export:

```typescript
export default class User {}
```

Default import:

```typescript
import User from "./User.js";
```

### CommonJS vs ESM

| CommonJS | ES Modules |
|---|---|
| Uses `require()`. | Uses `import`. |
| Uses `module.exports`. | Uses `export`. |
| Traditionally used by Node.js. | Standardized JavaScript module system. |
| Module loading is commonly synchronous. | Supports static imports and asynchronous module loading. |
| `__dirname` is available. | `__dirname` is not directly available. |

### Important

Modern Node.js supports both CommonJS and ES Modules.

However, the module system must be configured consistently.

Do not mix module assumptions without understanding how Node.js will interpret the emitted files.

---

# PART 7: TYPESCRIPT WITH NODE.JS

## 31. Configuring TypeScript for Node.js

Let's create a practical Node.js TypeScript application.

### Step 1: Create Project

```bash
mkdir node-typescript-app

cd node-typescript-app

npm init -y
```

### Step 2: Install Dependencies

```bash
npm install express
```

Development dependencies:

```bash
npm install -D typescript @types/node @types/express
```

### What Are @types Packages?

Some JavaScript packages provide their own TypeScript declarations.

Others rely on separately installed declaration packages.

For example:

```bash
npm install -D @types/express
```

This provides TypeScript type declarations for Express.

`@types/node` provides declarations for Node.js APIs.

---

## 32. Node.js Project Structure

```text
node-typescript-app/
│
├── src/
│   ├── controllers/
│   │   └── user.controller.ts
│   │
│   ├── routes/
│   │   └── user.routes.ts
│   │
│   ├── services/
│   │   └── user.service.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── dist/
│
├── package.json
│
└── tsconfig.json
```

---

## 33. Node.js ESM Configuration

For a modern Node.js ESM project, use a configuration such as:

### package.json

```json
{
  "name": "node-typescript-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "tsx watch src/server.ts",
    "typecheck": "tsc --noEmit"
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
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,

    "sourceMap": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Why `"type": "module"`?

In Node.js, the package setting:

```json
"type": "module"
```

makes `.js` files in that package scope be interpreted as ES Modules by default.

This works with the `NodeNext` module configuration.

### Important: File Extensions in Imports

When using Node.js ESM with TypeScript, write runtime-compatible `.js` extensions in relative imports.

Example:

```typescript
// src/server.ts

import { app } from "./app.js";
```

Even though the source file is:

```text
src/app.ts
```

TypeScript's NodeNext resolution understands that the `.js` import corresponds to the TypeScript source file during compilation.

The generated JavaScript will contain:

```javascript
import { app } from "./app.js";
```

This is important because Node.js executes the generated JavaScript, not the TypeScript source.

---

## 34. Node.js CommonJS Configuration

If your project uses CommonJS:

### package.json

```json
{
  "name": "node-typescript-app",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

Do not set `"type": "module"` if you intend to use the default CommonJS interpretation for `.js` files in this package scope.

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",

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

### TypeScript Code

```typescript
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello TypeScript");
});

app.listen(3000);
```

TypeScript generates CommonJS-style JavaScript according to the configuration.

---

# PART 8: PATH ALIASES

## 35. What Are Path Aliases?

Path aliases allow you to import files using shorter, more readable paths.

Consider this import:

```typescript
import { UserService } from "../../../services/UserService";
```

In large projects, relative paths can become difficult to manage.

Instead, you can define aliases.

Example:

```typescript
import { UserService } from "@services/UserService";
```

### Configure paths

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@services/*": ["src/services/*"],
      "@controllers/*": ["src/controllers/*"],
      "@models/*": ["src/models/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

### Example Project

```text
src/
│
├── services/
│   └── UserService.ts
│
├── controllers/
│   └── UserController.ts
│
└── app.ts
```

Now:

```typescript
import { UserService } from "@services/UserService";
```

### Important: TypeScript Paths Are Not Automatically Runtime Aliases

This is a very important concept.

The `paths` option helps TypeScript resolve imports during development and type checking.

It does not automatically rewrite import paths in emitted JavaScript.

For example:

```typescript
import { UserService } from "@services/UserService";
```

May remain:

```javascript
import { UserService } from "@services/UserService";
```

Node.js does not automatically understand this custom alias.

You need a compatible runtime or build-tool configuration.

Possible approaches include:

- Bundler alias configuration.
- Node.js package imports.
- Runtime alias resolution tools.
- Build-time path rewriting tools.

### Node.js Package Imports

For modern Node.js projects, package imports can provide runtime-supported internal aliases.

Example `package.json`:

```json
{
  "imports": {
    "#services/*": "./dist/services/*.js"
  }
}
```

Then TypeScript and Node.js must be configured consistently for this mapping.

For many Node.js applications, relative imports are perfectly acceptable and simpler.

---

# PART 9: DECLARATION FILES

## 36. What Are .d.ts Files?

A declaration file describes the types of JavaScript code.

Its extension is:

```text
.d.ts
```

It does not normally contain the actual runtime implementation.

It tells TypeScript:

- Which functions exist.
- Which classes exist.
- What parameters they accept.
- What values they return.
- Which properties are available.

### Example

Suppose you have a JavaScript library:

```javascript
// calculator.js

function add(a, b) {
  return a + b;
}

module.exports = { add };
```

You can create a declaration file:

```typescript
// calculator.d.ts

export function add(
  a: number,
  b: number
): number;
```

Now TypeScript can understand how to use the JavaScript function.

### Using It

```typescript
import { add } from "./calculator";

const result = add(10, 20);
```

TypeScript knows:

- `add` accepts two numbers.
- `add` returns a number.

### Important

The declaration file does not implement `add()`.

The actual implementation remains in JavaScript.

---

## 37. What Is DefinitelyTyped?

DefinitelyTyped is a community-maintained repository containing TypeScript declaration packages for many JavaScript libraries.

These packages are commonly published under:

```text
@types/package-name
```

Examples:

```bash
npm install -D @types/node

npm install -D @types/express

npm install -D @types/lodash
```

Not every package needs an `@types` package.

Some libraries include their own TypeScript declarations.

### How Does TypeScript Find Types?

TypeScript generally searches for declarations through:

1. Package-provided type definitions.
2. Package export/type metadata.
3. Relevant declaration files.
4. Installed `@types` packages.
5. TypeScript standard library declarations.

The exact resolution process depends on the module resolution mode and package configuration.

---

# PART 10: PROJECT REFERENCES

## 38. What Are TypeScript Project References?

Project References allow a large TypeScript application to be divided into smaller TypeScript projects.

Each project can have its own `tsconfig.json`.

Other projects can reference it.

This is especially useful in monorepos.

### Problem Without Project References

Suppose you have:

```text
application/
│
├── frontend/
│
├── backend/
│
└── shared/
```

Each project may depend on shared code.

As the project grows, compiling everything together can become inefficient.

### With Project References

```text
             Root Project
                  |
          -------------------
          |        |        |
          v        v        v
       Frontend  Backend  Shared
```

Each project can be built separately.

### Example Structure

```text
project/
│
├── packages/
│   │
│   ├── shared/
│   │   ├── src/
│   │   │   └── index.ts
│   │   └── tsconfig.json
│   │
│   └── backend/
│       ├── src/
│       │   └── server.ts
│       └── tsconfig.json
│
└── tsconfig.json
```

### Shared Project Configuration

`packages/shared/tsconfig.json`

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

### Backend Project Configuration

`packages/backend/tsconfig.json`

```json
{
  "compilerOptions": {
    "composite": true,
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
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

### Root tsconfig.json

```json
{
  "files": [],
  "references": [
    {
      "path": "./packages/shared"
    },
    {
      "path": "./packages/backend"
    }
  ]
}
```

### Build

```bash
tsc --build
```

TypeScript builds referenced projects in the correct dependency order.

### Watch Mode

```bash
tsc --build --watch
```

### Benefits

- Better organization.
- Faster incremental builds.
- Independent compilation.
- Clear project boundaries.
- Useful for monorepos.

### Important

Project References are a TypeScript compiler feature.

They do not automatically create npm packages or configure runtime imports between packages. You still need proper package and module configuration.

---

# PART 11: TYPESCRIPT BUILD TOOLS

## 39. What Is ts-node?

`ts-node` allows you to execute TypeScript files through Node.js with runtime TypeScript compilation support.

Instead of manually compiling first:

```bash
tsc

node dist/app.js
```

You can use:

```bash
npx ts-node src/app.ts
```

### Install

```bash
npm install -D ts-node typescript
```

### Use

```bash
npx ts-node src/app.ts
```

### Advantages

- Convenient development workflow.
- Avoids a separate manual compilation step.
- Supports TypeScript execution through Node.js integration.

### Limitations

- Can be slower than lightweight transpilation tools.
- Requires correct module configuration.
- Runtime execution and type-checking behavior depend on its configuration.

---

## 40. What Is tsx?

`tsx` is a tool for running TypeScript and TSX files in Node.js.

It uses esbuild-based transformation.

### Install

```bash
npm install -D tsx
```

### Execute

```bash
npx tsx src/app.ts
```

Watch mode:

```bash
npx tsx watch src/app.ts
```

### Why Is tsx Popular?

- Fast startup.
- Simple configuration.
- Supports modern JavaScript and TypeScript syntax.
- Useful for development.

### Important

`tsx` primarily transforms TypeScript for execution.

Do not assume that running a file with `tsx` performs full TypeScript type checking.

Use:

```bash
npx tsc --noEmit
```

when you want a full TypeScript type check.

---

## 41. What Is esbuild?

esbuild is a fast JavaScript and TypeScript bundler and transformer.

It can:

- Transform TypeScript into JavaScript.
- Bundle multiple files.
- Minify JavaScript.
- Optimize builds.
- Process modern JavaScript syntax.

### Example

Install:

```bash
npm install -D esbuild
```

Build:

```bash
npx esbuild src/app.ts \
  --bundle \
  --platform=node \
  --outfile=dist/app.js
```

### Important

esbuild removes TypeScript syntax but does not perform full TypeScript type checking.

You should run the TypeScript compiler separately when type checking is required.

---

## 42. What Is SWC?

SWC is a fast JavaScript and TypeScript compiler written in Rust.

It can transform TypeScript and modern JavaScript into JavaScript.

It is commonly used in modern development tooling.

### Install

```bash
npm install -D @swc/core
```

SWC is often integrated into tools and frameworks rather than being used directly for every project build.

### Important

Like esbuild, SWC focuses on transformation and does not replace TypeScript's full type checker.

---

## 43. What Is Babel?

Babel is a JavaScript compiler and transformation tool.

It can process TypeScript syntax through its TypeScript preset.

Install:

```bash
npm install -D @babel/core @babel/preset-typescript
```

Configuration:

```json
{
  "presets": [
    "@babel/preset-typescript"
  ]
}
```

### Important

Babel strips TypeScript syntax but does not perform TypeScript type checking.

You should use `tsc --noEmit` separately for type checking.

---

## 44. tsc vs ts-node vs tsx vs esbuild vs SWC vs Babel

This comparison is important.

| Tool | Main Purpose | Full Type Checking? |
|---|---|---|
| `tsc` | Type checking and TypeScript compilation. | Yes |
| `ts-node` | Execute TypeScript in Node.js. | Can type-check, depending on configuration. |
| `tsx` | Fast TypeScript execution. | No full type checking by default. |
| `esbuild` | Fast transformation and bundling. | No |
| `SWC` | Fast transformation and compilation. | No |
| `Babel` | JavaScript transformation. | No |

### Recommended Development Workflow

For a Node.js TypeScript application:

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

This separates development execution, production compilation, and type checking.

---

# PART 12: FRONTEND TYPESCRIPT CONFIGURATION

## 45. TypeScript with React and Vite

Frontend projects usually use a bundler.

For example:

- Vite.
- Webpack.
- Rollup.

The bundler handles the transformation and packaging of application files.

TypeScript handles type checking.

### Example Configuration

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],

    "module": "ESNext",
    "moduleResolution": "Bundler",

    "jsx": "react-jsx",

    "strict": true,
    "noEmit": true,

    "skipLibCheck": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

### Understanding Important Options

**lib**

Specifies which built-in JavaScript and environment API declarations are available during type checking.

Example:

```json
"lib": ["ES2022", "DOM"]
```

This includes types for:

- Modern JavaScript APIs.
- Browser APIs.
- DOM elements.
- Browser events.

**jsx**

Controls how JSX syntax is handled.

Common values:

| Value | Purpose |
|---|---|
| `preserve` | Leaves JSX for another tool to process. |
| `react` | Uses the classic React JSX transformation. |
| `react-jsx` | Uses the modern automatic JSX runtime. |
| `react-jsxdev` | Uses the development JSX runtime. |

### Example React Component

```tsx
interface UserProps {
  name: string;
  age: number;
}

function UserCard({ name, age }: UserProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{age}</p>
    </div>
  );
}

export default UserCard;
```

### Why `noEmit: true`?

Because Vite or another build tool handles JavaScript generation.

TypeScript is used for type checking.

---

# PART 13: TYPESCRIPT WITH NEXT.JS

## 46. TypeScript Configuration in Next.js

Next.js supports TypeScript directly.

You can create a Next.js project using:

```bash
npx create-next-app@latest my-app
```

Choose TypeScript during project setup.

Next.js creates and manages the TypeScript configuration.

### Example tsconfig.json

A simplified Next.js configuration may look like:

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

The exact generated configuration may vary by Next.js version and project setup.

### Important Options

| Option | Purpose |
|---|---|
| `noEmit` | Prevents TypeScript from generating JavaScript. |
| `moduleResolution: bundler` | Uses bundler-oriented module resolution. |
| `jsx: react-jsx` | Enables modern JSX transformation support. |
| `isolatedModules` | Ensures files can be safely processed independently by certain transpilers. |
| `incremental` | Enables incremental type-checking information. |
| `paths` | Defines import aliases. |
| `plugins` | Enables framework-specific TypeScript tooling integration. |

### Important

Next.js uses its own build pipeline.

Do not blindly replace the generated `tsconfig.json` with a generic Node.js configuration.

---

# PART 14: ADDITIONAL ADVANCED OPTIONS

## 47. isolatedModules

The `isolatedModules` option ensures that each TypeScript file can be safely transpiled independently.

```json
{
  "compilerOptions": {
    "isolatedModules": true
  }
}
```

This is useful when using tools such as:

- Babel.
- SWC.
- esbuild.
- Vite.

### Example: Type-Only Imports

```typescript
import type { User } from "./User";
```

This explicitly indicates that `User` is used only as a type.

It helps transpilers distinguish type dependencies from runtime dependencies.

### Important

`isolatedModules` does not perform compilation.

It reports patterns that may not work correctly when files are transformed independently.

---

## 48. verbatimModuleSyntax

This option controls how TypeScript handles imports and exports.

```json
{
  "compilerOptions": {
    "verbatimModuleSyntax": true
  }
}
```

It encourages explicit separation between type imports and runtime imports.

Example:

```typescript
import type { User } from "./types.js";

import { createUser } from "./user-service.js";
```

### Why Is It Useful?

It makes it clear which imports are needed only for type checking and which are required at runtime.

This is particularly useful in modern ESM projects and build pipelines.

---

## 49. resolveJsonModule

This option allows TypeScript to import JSON files.

```json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

Example:

`config.json`

```json
{
  "appName": "My Application",
  "version": "1.0.0"
}
```

Import:

```typescript
import config from "./config.json";

console.log(config.appName);
```

TypeScript can infer the JSON structure.

---

## 50. lib

The `lib` option controls which built-in API declarations TypeScript includes.

Example:

```json
{
  "compilerOptions": {
    "lib": [
      "ES2022",
      "DOM"
    ]
  }
}
```

### Common Libraries

| Library | Provides |
|---|---|
| ES5 | Older JavaScript declarations. |
| ES2015 | ES6 declarations. |
| ES2020 | Modern JavaScript APIs. |
| ES2022 | ES2022 APIs. |
| DOM | Browser DOM APIs. |
| DOM.Iterable | Iterable DOM APIs. |
| WebWorker | Web Worker APIs. |

### Important

`lib` controls available type declarations.

It does not automatically install or polyfill those APIs.

For example, including `DOM` makes `document` available to the TypeScript type checker, but it does not create a browser DOM in Node.js.

---

# PART 15: BUILD OPTIMIZATION AND PRODUCTION

## 51. Development vs Production Build

Development and production builds have different requirements.

### Development

Common requirements:

- Fast startup.
- Watch mode.
- Source maps.
- Quick feedback.
- Type checking.

Example:

```bash
npx tsx watch src/server.ts
```

### Production

Common requirements:

- Compiled JavaScript.
- Optimized dependencies.
- Predictable module resolution.
- Correct runtime configuration.
- Environment validation.
- Reliable startup commands.

Example:

```bash
npm run build

npm start
```

### Important

Do not run a production server directly from development TypeScript execution tooling unless you have deliberately chosen that deployment strategy.

For conventional Node.js deployments, compiling to JavaScript and running the generated output is a straightforward approach.

---

## 52. Example Production-Ready Node.js Configuration

Let's combine the important options.

### package.json

```json
{
  "name": "typescript-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "typecheck": "tsc --noEmit",
    "clean": "node -e \"require('fs').rmSync('dist', { recursive: true, force: true })\""
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

*The version ranges above are illustrative; install compatible current versions for your environment.*

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
    "useUnknownInCatchVariables": true,

    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,

    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    "incremental": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Development

```bash
npm run dev
```

### Type Checking

```bash
npm run typecheck
```

### Production Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Resulting Structure

```text
typescript-backend/
│
├── src/
│   ├── server.ts
│   ├── app.ts
│   └── ...
│
├── dist/
│   ├── server.js
│   ├── server.js.map
│   ├── server.d.ts
│   ├── app.js
│   └── ...
│
├── package.json
└── tsconfig.json
```

---

# PART 16: DEBUGGING AND COMPILER DIAGNOSTICS

## 53. How to Debug TypeScript Compilation

TypeScript provides several useful compiler commands.

### A. Show Resolved Configuration

```bash
tsc --showConfig
```

This shows the effective compiler configuration.

Useful when configuration is inherited from multiple files.

### B. List Included Files

```bash
tsc --listFiles
```

Shows files included in the compilation.

### C. Explain File Inclusion

```bash
tsc --explainFiles
```

Explains why particular files are included.

### D. Trace Module Resolution

```bash
tsc --traceResolution
```

Useful when TypeScript cannot find an imported module.

### E. Generate Compiler Performance Information

```bash
tsc --extendedDiagnostics
```

Provides compilation statistics such as:

- Files processed.
- Memory usage.
- Type checking time.
- Program creation time.

### F. Build in Watch Mode

```bash
tsc --watch
```

Automatically recompiles when files change.

### Useful Debugging Commands

| Command | Purpose |
|---|---|
| `tsc --showConfig` | View resolved configuration. |
| `tsc --listFiles` | List included files. |
| `tsc --explainFiles` | Explain file inclusion. |
| `tsc --traceResolution` | Debug module resolution. |
| `tsc --extendedDiagnostics` | Analyze compilation performance. |
| `tsc --watch` | Automatically recompile changes. |
| `tsc --build --verbose` | Display project build details. |

---

# PART 17: COMMON CONFIGURATION MISTAKES

## 54. Mistakes to Avoid

| Mistake | Explanation |
|---|---|
| Using `any` everywhere | Removes much of TypeScript's type safety. |
| Ignoring `strict` | Allows many preventable errors. |
| Wrong `module` configuration | Can produce incompatible JavaScript output. |
| Wrong `moduleResolution` | Can cause imports to fail. |
| Confusing `target` with `module` | They control different aspects of compilation. |
| Assuming `paths` rewrites imports | TypeScript paths do not automatically create runtime aliases. |
| Incorrect `rootDir` | Can cause output-layout or file-inclusion errors. |
| Incorrect `outDir` | Can mix generated JavaScript with source files. |
| Ignoring ESM/CommonJS rules | Can create runtime import errors. |
| Using `skipLibCheck` to hide all errors | It does not fix application type errors. |
| Using `tsx` as a type checker | It does not perform full type checking by default. |
| Assuming types validate API data | TypeScript types disappear at runtime. |
| Ignoring source maps | Makes debugging generated JavaScript harder. |
| Misusing project references | Can cause incorrect build dependencies. |

### Professional Recommendations

For a new Node.js TypeScript project:

1. Use a local TypeScript dependency.
2. Enable `strict`.
3. Select a module system deliberately.
4. Use `NodeNext` for Node.js-aware module behavior when appropriate.
5. Keep source files separate from generated output.
6. Use `tsc --noEmit` for type checking.
7. Use `tsc` or a suitable build tool for production output.
8. Use runtime validation for external data.
9. Keep `tsconfig.json` understandable.
10. Avoid unnecessary compiler options.

---

# PART 18: INTERVIEW QUESTIONS AND ANSWERS

## 55. TypeScript Compiler Interview Questions

### Q1. What is the TypeScript compiler?

The TypeScript compiler transforms TypeScript code into JavaScript and performs static type checking.

### Q2. What is TSC?

TSC stands for TypeScript Compiler. It is the command-line compiler provided by TypeScript.

### Q3. What is tsconfig.json?

It is the configuration file that defines how TypeScript should compile and check a project.

### Q4. What is the difference between type checking and transpilation?

Type checking verifies type correctness, while transpilation transforms source code into another language or syntax level.

### Q5. Does TypeScript execute directly in Node.js?

Node.js primarily executes JavaScript. TypeScript must be transformed or handled by a runtime/tool that supports TypeScript.

### Q6. What is the target option?

It controls the JavaScript language version generated by TypeScript.

### Q7. What is the module option?

It controls the JavaScript module system used in generated or preserved output.

### Q8. What is moduleResolution?

It determines how TypeScript locates imported modules.

### Q9. What is strict mode?

It enables a collection of stricter TypeScript type-checking options.

### Q10. What is strictNullChecks?

It requires explicit handling of `null` and `undefined`.

### Q11. What is noImplicitAny?

It prevents TypeScript from silently inferring `any` in certain situations.

### Q12. What is noEmit?

It prevents TypeScript from generating JavaScript output.

### Q13. What is declaration?

It generates `.d.ts` declaration files.

### Q14. What is sourceMap?

It generates mapping information that connects generated JavaScript to the original TypeScript source.

### Q15. What is outDir?

It specifies where generated files should be placed.

### Q16. What is rootDir?

It specifies the root directory of source files used for output layout.

### Q17. What is skipLibCheck?

It skips type checking of declaration files, often improving compilation performance.

### Q18. What is incremental compilation?

It reuses information from previous compilations to make subsequent builds more efficient.

### Q19. What is a declaration file?

A `.d.ts` file describes the types of JavaScript code without necessarily containing its implementation.

### Q20. What is DefinitelyTyped?

It is a community-maintained repository providing TypeScript declaration packages for JavaScript libraries.

### Q21. What is the difference between CommonJS and ESM?

CommonJS uses `require()` and `module.exports`, whereas ESM uses `import` and `export`.

### Q22. What is the difference between `NodeNext` and `Bundler` module resolution?

`NodeNext` models Node.js module resolution rules, while `Bundler` models module resolution used by modern bundlers.

### Q23. What is ts-node?

It is a tool for executing TypeScript files in Node.js through runtime compilation support.

### Q24. What is tsx?

It is a fast tool for executing TypeScript and TSX files in Node.js.

### Q25. Does esbuild perform TypeScript type checking?

No. It transforms TypeScript syntax but does not perform full TypeScript type checking.

### Q26. What is SWC?

SWC is a fast JavaScript and TypeScript compiler written in Rust.

### Q27. What is isolatedModules?

It ensures that TypeScript files can be safely transformed independently by tools that process files one at a time.

### Q28. What are path aliases?

Path aliases provide shorter import paths for modules.

### Q29. Do TypeScript path aliases automatically work in Node.js?

No. They need compatible runtime or build-tool resolution.

### Q30. What are Project References?

They allow TypeScript projects to depend on other TypeScript projects and build them in dependency order.

### Q31. What is composite?

It enables a project to participate in TypeScript Project References.

### Q32. What is the difference between `lib` and `target`?

`target` controls generated JavaScript syntax, while `lib` controls the built-in API declarations available during type checking.

### Q33. What is `verbatimModuleSyntax`?

It makes import and export handling more explicit, especially regarding type-only imports.

### Q34. What is `resolveJsonModule`?

It allows TypeScript to import JSON files and infer their types.

### Q35. Why is `tsc --noEmit` useful?

It performs type checking without generating JavaScript files.

---

# PART 19: PRACTICAL EXERCISES

## 56. Exercise 1: Create a TypeScript Project

Create a new Node.js TypeScript project.

Requirements:

- Install TypeScript.
- Create `tsconfig.json`.
- Configure `src` and `dist`.
- Enable strict mode.
- Create `app.ts`.
- Compile it using `tsc`.
- Execute the generated JavaScript.

## Exercise 2: Experiment with Compiler Options

Try changing:

```json
"target": "ES5"
```

Then:

```json
"target": "ES2022"
```

Observe how the generated JavaScript changes for supported syntax transformations.

## Exercise 3: CommonJS vs ESM

Create two small projects.

Project A:

- CommonJS.
- `require()`.
- `module.exports`.

Project B:

- ES Modules.
- `import`.
- `export`.

Run both projects in Node.js.

## Exercise 4: Create a Node.js ESM Project

Build an Express API using:

- TypeScript.
- NodeNext.
- Express.
- `@types/node`.
- `@types/express`.
- tsx.

Create these routes:

```text
GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id
DELETE /users/:id
```

## Exercise 5: Declaration Files

Create a JavaScript utility library.

Write a `.d.ts` file describing its functions.

Import the library into a TypeScript project.

## Exercise 6: Path Aliases

Configure these aliases:

```text
@controllers/*
@services/*
@models/*
@repositories/*
@utils/*
```

Make sure they work in both TypeScript and your chosen runtime/build tool.

## Exercise 7: Incremental Compilation

Enable:

```json
"incremental": true
```

Compile your project.

Inspect the generated `.tsbuildinfo` file.

Modify one source file and compile again.

## Exercise 8: Project References

Create a monorepo with:

```text
packages/
   |
   |--- shared
   |
   |--- backend
   |
   |--- frontend
```

Configure Project References and build the projects using:

```bash
tsc --build
```

## Exercise 9: Frontend Configuration

Create a React + TypeScript + Vite application.

Understand:

- JSX.
- DOM types.
- Bundler module resolution.
- `noEmit`.
- Path aliases.

## Exercise 10: Production Build

Create a complete Node.js TypeScript backend with:

- Development script.
- Type-check script.
- Build script.
- Production start script.
- Source maps.
- Declaration files.
- Strict type checking.

---

# 57. Phase 30 Completion Checklist

Before moving forward, make sure you understand the following.

### TypeScript Compiler

- [ ] What is TSC?
- [ ] How TypeScript compilation works.
- [ ] Scanner and Parser.
- [ ] Abstract Syntax Tree.
- [ ] Type Checker.
- [ ] Transpilation.
- [ ] Type Checking vs Transpilation.

### tsconfig.json

- [ ] What is tsconfig.json?
- [ ] `target`.
- [ ] `module`.
- [ ] `moduleResolution`.
- [ ] `strict`.
- [ ] `strictNullChecks`.
- [ ] `noImplicitAny`.
- [ ] `noEmit`.
- [ ] `declaration`.
- [ ] `declarationMap`.
- [ ] `sourceMap`.
- [ ] `rootDir`.
- [ ] `outDir`.
- [ ] `include`.
- [ ] `exclude`.
- [ ] `files`.
- [ ] `allowJs`.
- [ ] `checkJs`.
- [ ] `skipLibCheck`.
- [ ] `esModuleInterop`.
- [ ] `incremental`.
- [ ] `composite`.
- [ ] `isolatedModules`.
- [ ] `verbatimModuleSyntax`.
- [ ] `resolveJsonModule`.
- [ ] `lib`.

### Module Systems

- [ ] CommonJS.
- [ ] ES Modules.
- [ ] `require()`.
- [ ] `module.exports`.
- [ ] `import`.
- [ ] `export`.
- [ ] NodeNext.
- [ ] Bundler module resolution.

### Build Tools

- [ ] TSC.
- [ ] ts-node.
- [ ] tsx.
- [ ] esbuild.
- [ ] SWC.
- [ ] Babel.
- [ ] Type checking vs transformation.

### Advanced Configuration

- [ ] Declaration files.
- [ ] DefinitelyTyped.
- [ ] Path aliases.
- [ ] Project References.
- [ ] Monorepo configuration.
- [ ] Incremental builds.
- [ ] Source maps.
- [ ] Production build configuration.

---

# 58. What Comes Next?

## Phase 31: TypeScript and JavaScript Internals – Runtime Behavior, Memory Management, Execution Context, Event Loop, and Type Erasure

In the next phase, we will cover:

1. TypeScript vs JavaScript at runtime.
2. Type Erasure.
3. Compile-Time vs Runtime.
4. JavaScript Execution Context.
5. Global Execution Context.
6. Function Execution Context.
7. Call Stack.
8. Memory Heap.
9. Stack vs Heap Memory.
10. JavaScript Memory Management.
11. Garbage Collection.
12. Mark-and-Sweep Algorithm.
13. Memory Leaks.
14. Closures and Memory.
15. JavaScript Event Loop.
16. Call Stack vs Task Queue.
17. Microtask Queue.
18. Macrotask Queue.
19. Promises and Async/Await Internals.
20. How TypeScript Handles Generics at Runtime.
21. Interfaces vs Classes at Runtime.
22. `typeof`, `instanceof`, and Type Guards.
23. Runtime Validation vs Static Types.
24. JavaScript Prototypes and TypeScript Classes.
25. Advanced Runtime Debugging.

**Phase 30 is complete.**

When you're ready, say **"OK, Phase 31"** to continue.