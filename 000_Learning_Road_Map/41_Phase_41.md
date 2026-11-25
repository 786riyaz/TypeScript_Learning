# Phase 41: Advanced TypeScript – Modules, Namespaces, Declaration Files and Compiler Internals

**Level:** Advanced to Expert  
**Prerequisites:** TypeScript fundamentals, JavaScript modules, generics, interfaces, advanced types, Node.js, npm, and basic compiler configuration.

---

# 1. Learning Objectives

In this phase, you will learn how TypeScript organizes, resolves, compiles, and distributes code in large applications and libraries.

By the end of this phase, you should understand:

1. TypeScript Modules.
2. ES Modules.
3. CommonJS Modules.
4. Module Resolution.
5. Module Augmentation.
6. Declaration Files (`.d.ts`).
7. Ambient Declarations.
8. Global Declarations.
9. Namespace Fundamentals.
10. Namespace vs Module.
11. Declaration Merging.
12. Interface Merging.
13. Function Overload Merging.
14. Global Type Augmentation.
15. Third-Party Library Typings.
16. Writing Custom Type Definitions.
17. TypeScript Compiler Architecture.
18. TypeScript Compiler API Fundamentals.
19. Advanced `tsconfig.json`.
20. Strict Compiler Options.
21. Path Mapping and Aliases.
22. Project References.
23. Monorepo TypeScript Configuration.
24. Build Performance Optimization.
25. TypeScript Package Development.
26. Publishing TypeScript Libraries to npm.
27. Real-World Module Architecture.

---

# PART 1: TYPESCRIPT MODULES

# 2. Understanding Modules

## 2.1 What Is a Module?

A Module is a file that contains code that can be exported and imported by other files.

Modules help organize applications into smaller, reusable, maintainable units.

For example, consider a Node.js application:

```text
src/
│
├── users/
│   ├── user.service.ts
│   ├── user.controller.ts
│   └── user.repository.ts
│
├── products/
│   ├── product.service.ts
│   ├── product.controller.ts
│   └── product.repository.ts
│
├── orders/
│   ├── order.service.ts
│   └── order.controller.ts
│
└── app.ts
```

Each file can export functionality that other files can import.

### Why use modules?

- Code reusability.
- Separation of concerns.
- Better maintainability.
- Avoiding unnecessary global variables.
- Better dependency management.
- Easier testing.

## 2.2 Creating a Module

Create:

`math.ts`

```typescript
export function add(
    a: number,
    b: number
): number {

    return a + b;
}

export function subtract(
    a: number,
    b: number
): number {

    return a - b;
}
```

Here, we export two functions.

Now create:

`app.ts`

```typescript
import { add, subtract } from "./math";

console.log(add(10, 20));

console.log(subtract(20, 10));
```

Output:

```text
30
10
```

The `math.ts` file is a module because it contains exports.

---

# 3. Named Exports

## 3.1 What Are Named Exports?

Named exports allow us to export multiple variables, functions, classes, or types from a module.

Example:

```typescript
// user.ts

export const name = "John";

export const age = 25;

export function getUser(): string {
    return name;
}

export class User {
    constructor(public name: string) {}
}
```

Import:

```typescript
// app.ts

import {
    name,
    age,
    getUser,
    User
} from "./user";

console.log(name);

console.log(age);

console.log(getUser());

const user = new User("David");
```

### Renaming Named Imports

You can rename imported members using `as`.

```typescript
import {
    name as userName,
    age as userAge
} from "./user";

console.log(userName);

console.log(userAge);
```

### Renaming Named Exports

```typescript
const username = "John";

export {
    username as name
};
```

Import:

```typescript
import { name } from "./user";
```

### Important

Named imports must match the exported name unless you use an alias.

---

# 4. Default Exports

## 4.1 What Is a Default Export?

A module can have one default export.

Example:

```typescript
// user.ts

export default class User {

    constructor(
        public name: string,
        public age: number
    ) {}
}
```

Import:

```typescript
// app.ts

import User from "./user";

const user = new User("John", 25);
```

Unlike named imports, the imported name does not have to match the original class name.

```typescript
import MyUser from "./user";
```

This is valid.

## 4.2 Default Export with Functions

```typescript
// calculator.ts

export default function add(
    a: number,
    b: number
): number {

    return a + b;
}
```

Import:

```typescript
import add from "./calculator";

console.log(add(10, 20));
```

## 4.3 Named Export vs Default Export

| Named Export | Default Export |
|---|---|
| A module can have multiple named exports | A module can have one default export |
| Imported using the exported name | Imported using any local name |
| Uses `{}` during import | Does not require `{}` |
| Supports aliasing | Local import name is freely chosen |

### Recommendation

For many TypeScript application modules, named exports are useful because they make dependencies explicit and support consistent import patterns.

Default exports are also valid and commonly used in framework conventions.

---

# 5. Re-Exports

## 5.1 What Are Re-Exports?

Re-Exports allow one module to export members from another module.

They are useful for creating centralized export files.

Example structure:

```text
src/
│
├── users/
│   ├── User.ts
│   └── UserService.ts
│
├── products/
│   ├── Product.ts
│   └── ProductService.ts
│
└── index.ts
```

`users/User.ts`

```typescript
export class User {
    constructor(public name: string) {}
}
```

`users/UserService.ts`

```typescript
export class UserService {

    getUsers(): string[] {
        return ["John", "David"];
    }
}
```

`products/Product.ts`

```typescript
export class Product {

    constructor(
        public name: string,
        public price: number
    ) {}
}
```

Now create:

`index.ts`

```typescript
export { User } from "./users/User";

export { UserService } from "./users/UserService";

export { Product } from "./products/Product";
```

Import everything from one location:

```typescript
import {
    User,
    UserService,
    Product
} from "./index";
```

## 5.2 Export Everything

You can also use:

```typescript
export * from "./users/User";

export * from "./users/UserService";

export * from "./products/Product";
```

However, `export *` does not re-export default exports.

Default exports must be explicitly re-exported.

```typescript
export { default as User } from "./users/User";
```

### What Is a Barrel File?

A file that centralizes exports from multiple modules is commonly called a **Barrel File**.

Example:

```typescript
// users/index.ts

export * from "./User";

export * from "./UserService";

export * from "./UserRepository";
```

Usage:

```typescript
import {
    User,
    UserService,
    UserRepository
} from "./users";
```

### Important consideration

Barrel files can introduce circular dependencies or complicate module initialization if used carelessly.

For large applications, avoid creating enormous global barrel files without a clear purpose.

---

# PART 2: ES MODULES AND COMMONJS

# 6. ES Modules (ESM)

## 6.1 What Are ES Modules?

ES Modules are the standard JavaScript module system.

They use:

- `import`
- `export`

Example:

```typescript
// math.ts

export function add(a: number, b: number) {
    return a + b;
}
```

```typescript
// app.ts

import { add } from "./math.js";

console.log(add(10, 20));
```

ES Modules are supported by:

- Modern browsers.
- Node.js.
- TypeScript.
- Modern JavaScript build tools.

### Static Nature of ES Modules

ES module imports and exports are statically analyzed.

For example:

```typescript
import { add } from "./math.js";
```

The dependency is known from the module structure.

Dynamic imports are also available:

```typescript
const module = await import("./math.js");

console.log(module.add(10, 20));
```

Dynamic imports return a Promise and are useful for lazy loading.

---

# 7. CommonJS Modules

## 7.1 What Is CommonJS?

CommonJS is a module system historically used by Node.js.

It uses:

- `require()`
- `module.exports`
- `exports`

Example:

```javascript
// math.js

function add(a, b) {
    return a + b;
}

module.exports = {
    add
};
```

Import:

```javascript
// app.js

const math = require("./math");

console.log(math.add(10, 20));
```

## 7.2 CommonJS with TypeScript

TypeScript can compile TypeScript source files to CommonJS JavaScript.

Example configuration:

```json
{
    "compilerOptions": {
        "target": "ES2020",
        "module": "CommonJS",
        "outDir": "./dist",
        "strict": true
    }
}
```

TypeScript:

```typescript
export function add(
    a: number,
    b: number
): number {
    return a + b;
}
```

Compiled JavaScript uses CommonJS-compatible exports.

### Important

Do not assume that writing `import` in TypeScript always produces ES module output.

The generated module format depends on your compiler configuration.

---

# 8. ES Modules vs CommonJS

| Feature | ES Modules | CommonJS |
|---|---|---|
| Import | `import` | `require()` |
| Export | `export` | `module.exports` |
| Standard | JavaScript standard | Node.js module system |
| Loading | Static imports and dynamic imports | Primarily synchronous `require()` |
| Tree-shaking | Generally easier for bundlers | More difficult in many cases |
| Browser support | Native support in modern browsers | Requires a bundler or compatible runtime |
| Node.js support | Supported | Supported |

### Which Should You Use?

For new TypeScript projects, ES Modules are generally a good default when your runtime and dependencies support them.

However, many existing Node.js projects still use CommonJS.

Choose based on:

- Node.js version.
- Existing dependencies.
- Deployment environment.
- Framework conventions.
- Package compatibility.

---

# 9. Understanding `package.json` Module Configuration

Node.js uses package configuration to determine how JavaScript files are interpreted.

Example:

```json
{
    "name": "typescript-app",
    "version": "1.0.0",
    "type": "module"
}
```

The `"type": "module"` field tells Node.js to treat `.js` files in that package scope as ES modules.

Without this setting, `.js` files are generally treated as CommonJS by default, unless another applicable configuration or file extension determines otherwise.

### Important file extensions

| Extension | Typical Meaning |
|---|---|
| `.js` | Determined by package configuration |
| `.mjs` | ES Module |
| `.cjs` | CommonJS |
| `.ts` | TypeScript source |
| `.mts` | TypeScript ES Module source |
| `.cts` | TypeScript CommonJS source |
| `.d.ts` | TypeScript declaration file |
| `.d.mts` | ES module declaration file |
| `.d.cts` | CommonJS declaration file |

### TypeScript with Node.js ESM

For a modern Node.js project, a configuration may look like this:

`package.json`

```json
{
    "name": "typescript-node-app",
    "version": "1.0.0",
    "type": "module",
    "scripts": {
        "build": "tsc",
        "start": "node dist/index.js",
        "dev": "tsx watch src/index.ts"
    }
}
```

`tsconfig.json`

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
        "skipLibCheck": true
    },
    "include": ["src"]
}
```

Source:

```typescript
// src/index.ts

import { add } from "./math.js";

console.log(add(10, 20));
```

Notice the `.js` extension in the TypeScript import.

With NodeNext module resolution, TypeScript understands that this refers to the corresponding TypeScript source file during compilation and preserves the runtime-compatible `.js` import.

---

# PART 3: MODULE RESOLUTION

# 10. What Is Module Resolution?

Module Resolution is the process TypeScript uses to locate a file or package when it encounters an import statement.

Example:

```typescript
import { User } from "./models/User";
```

TypeScript must locate the appropriate module.

It may examine files such as:

```text
models/User.ts
models/User.tsx
models/User.d.ts
models/User.js
```

The exact resolution behavior depends on the configured module resolution strategy.

## 10.1 Common Module Resolution Strategies

Important values include:

| Strategy | Purpose |
|---|---|
| `classic` | Legacy TypeScript resolution strategy |
| `node10` | Older Node.js resolution behavior |
| `node16` | Node.js ESM/CommonJS-aware resolution |
| `nodenext` | Node.js module resolution aligned with modern Node.js behavior |
| `bundler` | Resolution designed for modern bundlers |

For modern projects, `NodeNext` or `bundler` is commonly appropriate, depending on whether Node.js or a bundler controls runtime module loading.

## 10.2 NodeNext Resolution

Example:

```json
{
    "compilerOptions": {
        "module": "NodeNext",
        "moduleResolution": "NodeNext"
    }
}
```

This allows TypeScript to model Node.js ESM and CommonJS module behavior.

It considers:

- Package `"type"` fields.
- File extensions.
- Package exports.
- Package imports.
- Conditional exports.

## 10.3 Bundler Resolution

Example:

```json
{
    "compilerOptions": {
        "module": "ESNext",
        "moduleResolution": "Bundler"
    }
}
```

This is suitable when tools such as Vite, esbuild, or other bundlers handle module resolution and output.

It supports modern package resolution patterns while being more flexible about extension handling than Node.js runtime resolution.

### Important

`moduleResolution: "bundler"` does not mean Node.js itself can automatically execute every import accepted by TypeScript.

Your runtime or bundler must actually support the generated imports.

---

# 11. How TypeScript Resolves Packages

Suppose you write:

```typescript
import express from "express";
```

TypeScript searches for the package in applicable `node_modules` directories and follows the package's resolution metadata.

A package might contain:

```text
node_modules/
│
└── express/
    ├── package.json
    ├── index.js
    └── ...
```

Its `package.json` may contain fields such as:

```json
{
    "name": "express",
    "main": "index.js",
    "types": "index.d.ts"
}
```

These fields have different purposes:

| Field | Purpose |
|---|---|
| `main` | Traditional runtime entry point |
| `module` | Non-standard field often used by bundlers |
| `types` | TypeScript declaration entry point |
| `typings` | Alternative field for declaration entry point |
| `exports` | Controls package entry points and conditional resolution |
| `imports` | Defines package-internal import mappings |

Modern packages may use `exports` to define both runtime and type entry points.

Example:

```json
{
    "name": "my-package",
    "exports": {
        ".": {
            "types": "./dist/index.d.ts",
            "import": "./dist/index.js",
            "require": "./dist/index.cjs"
        }
    }
}
```

This tells tools which entry point to use depending on the import context.

---

# PART 4: DECLARATION FILES

# 12. What Are Declaration Files?

A Declaration File is a file with the `.d.ts` extension.

It describes the types of JavaScript code without containing the implementation.

### Example

Suppose you have a JavaScript file:

`math.js`

```javascript
export function add(a, b) {
    return a + b;
}
```

TypeScript does not automatically know the intended types of `a` and `b`.

You can create:

`math.d.ts`

```typescript
export declare function add(
    a: number,
    b: number
): number;
```

Now TypeScript understands the function's type.

### Important

A declaration file describes an implementation.

It does not implement the function.

The actual JavaScript code must exist separately.

---

# 13. Understanding `declare`

The `declare` keyword tells TypeScript that something exists elsewhere and its implementation is not being provided here.

Example:

```typescript
declare const API_URL: string;
```

This tells TypeScript that a variable named `API_URL` exists.

It does not create that variable at runtime.

### Function Declaration

```typescript
declare function calculateTotal(
    price: number,
    quantity: number
): number;
```

### Class Declaration

```typescript
declare class Database {

    connect(): void;

    disconnect(): void;
}
```

### Variable Declaration

```typescript
declare const VERSION: string;
```

These declarations describe existing runtime functionality.

---

# 14. Creating a Custom Declaration File

Suppose you have a JavaScript library that does not provide TypeScript definitions.

Example:

`my-library.js`

```javascript
function greet(name) {
    return `Hello ${name}`;
}

function add(a, b) {
    return a + b;
}

module.exports = {
    greet,
    add
};
```

You can create:

`my-library.d.ts`

```typescript
declare module "my-library" {

    export function greet(
        name: string
    ): string;

    export function add(
        a: number,
        b: number
    ): number;
}
```

Now TypeScript understands the library.

Usage:

```typescript
import {
    greet,
    add
} from "my-library";

console.log(greet("John"));

console.log(add(10, 20));
```

### Why declaration files matter

Many JavaScript libraries are used inside TypeScript projects.

Declaration files provide compile-time type information for those libraries.

---

# 15. Generating Declaration Files Automatically

TypeScript can generate `.d.ts` files from your source code.

Example:

`src/math.ts`

```typescript
export function add(
    a: number,
    b: number
): number {

    return a + b;
}
```

Configure:

`tsconfig.json`

```json
{
    "compilerOptions": {
        "declaration": true,
        "declarationMap": true,
        "outDir": "./dist",
        "rootDir": "./src",
        "target": "ES2020",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "strict": true
    },
    "include": ["src"]
}
```

Run:

```bash
npx tsc
```

Output:

```text
dist/
│
├── math.js
├── math.d.ts
└── math.d.ts.map
```

Generated declaration:

```typescript
export declare function add(
    a: number,
    b: number
): number;
```

### Important Compiler Options

| Option | Purpose |
|---|---|
| `declaration` | Generates `.d.ts` files |
| `declarationMap` | Generates declaration source maps |
| `emitDeclarationOnly` | Generates declarations without JavaScript output |
| `declarationDir` | Specifies declaration output directory |
| `stripInternal` | Removes declarations marked `@internal` from generated declarations |

---

# PART 5: AMBIENT DECLARATIONS

# 16. What Are Ambient Declarations?

Ambient declarations describe functionality that exists outside the current TypeScript module.

They are useful when working with:

- JavaScript libraries.
- Browser globals.
- Node.js globals.
- External scripts.
- Runtime-provided variables.

### Example

Suppose an external script creates:

```javascript
window.applicationVersion = "1.0.0";
```

TypeScript may not know about this custom property.

You can declare it:

```typescript
declare global {

    interface Window {
        applicationVersion: string;
    }

}
```

Now:

```typescript
console.log(window.applicationVersion);
```

TypeScript understands the property.

However, the declaration does not create the property. The external script must still initialize it.

---

# 17. Ambient Variables

Suppose a runtime or external script provides:

```javascript
globalThis.API_URL = "https://api.example.com";
```

You can describe it:

```typescript
declare const API_URL: string;
```

Now:

```typescript
console.log(API_URL);
```

TypeScript accepts the reference.

But the runtime must actually provide `API_URL`.

### Important distinction

| `declare const` | `const` |
|---|---|
| Describes an existing variable | Declares a variable |
| Does not generate initialization | Generates runtime code |
| Used in declaration contexts | Used in implementation code |

---

# 18. Ambient Module Declarations

Ambient module declarations describe external modules that do not have their own TypeScript definitions.

Example:

```typescript
declare module "legacy-library" {

    export function initialize(): void;

    export function execute(
        command: string
    ): boolean;

}
```

Now you can import:

```typescript
import {
    initialize,
    execute
} from "legacy-library";
```

### Wildcard Module Declarations

You can declare types for assets.

Example:

```typescript
declare module "*.png" {

    const imageUrl: string;

    export default imageUrl;
}
```

Now:

```typescript
import logo from "./logo.png";

console.log(logo);
```

This is useful in frontend applications using bundlers.

The bundler still needs to know how to process the image file.

---

# PART 6: NAMESPACES

# 19. What Are Namespaces?

Namespaces provide a way to organize related code under a named scope.

They were commonly used before ES Modules became standard.

Example:

```typescript
namespace MathUtils {

    export function add(
        a: number,
        b: number
    ): number {

        return a + b;
    }

    export function subtract(
        a: number,
        b: number
    ): number {

        return a - b;
    }
}
```

Usage:

```typescript
console.log(MathUtils.add(10, 20));

console.log(MathUtils.subtract(20, 10));
```

### Important

Members inside a namespace are not accessible outside it unless they are exported.

Example:

```typescript
namespace UserUtils {

    export function getName(): string {
        return "John";
    }

    function getInternalId(): number {
        return 101;
    }
}
```

This works:

```typescript
UserUtils.getName();
```

This does not:

```typescript
// Error
UserUtils.getInternalId();
```

---

# 20. Nested Namespaces

Namespaces can contain other namespaces.

```typescript
namespace App {

    export namespace Users {

        export function getUser(): string {
            return "John";
        }
    }

    export namespace Products {

        export function getProduct(): string {
            return "Laptop";
        }
    }
}
```

Usage:

```typescript
App.Users.getUser();

App.Products.getProduct();
```

This can be useful for organizing legacy codebases.

However, for most modern application development, ES Modules are generally preferred.

---

# 21. Namespace vs Module

| Namespace | Module |
|---|---|
| Uses the `namespace` keyword | Uses `import` and `export` |
| Organizes declarations under a named scope | Organizes code into files |
| Can be compiled into a shared global namespace or emitted namespace code | Uses the module system |
| Common in older TypeScript projects | Preferred in modern TypeScript applications |
| Can work without module imports | Explicitly uses module imports and exports |

### Which Should You Use?

For modern Node.js, React, Next.js, and TypeScript applications, prefer ES Modules.

Namespaces are still relevant when:

- Maintaining older TypeScript applications.
- Working with certain global script environments.
- Supporting legacy declaration files.
- Organizing ambient declarations.

---

# PART 7: DECLARATION MERGING

# 22. What Is Declaration Merging?

Declaration Merging is a TypeScript feature that combines multiple declarations with the same name into one declaration.

This is particularly useful when extending existing types.

### Example

```typescript
interface User {
    id: number;
}

interface User {
    name: string;
}
```

TypeScript combines them.

Equivalent result:

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
    name: "John"
};
```

### Important

Not all declarations can merge.

TypeScript supports merging for particular declaration combinations.

---

# 23. Interface Merging

Interfaces can be declared multiple times using the same name within the same declaration scope.

Example:

```typescript
interface Product {
    id: number;
}

interface Product {
    name: string;
}

interface Product {
    price: number;
}
```

Combined type:

```typescript
interface Product {
    id: number;
    name: string;
    price: number;
}
```

### Conflicting Properties

Consider:

```typescript
interface User {
    name: string;
}

// Error: incompatible duplicate property
interface User {
    name: number;
}
```

Duplicate non-function properties must have compatible types.

---

# 24. Function Overload Merging

Function declarations with the same name can contribute overload signatures.

Example:

```typescript
function getValue(value: string): string;

function getValue(value: number): number;

function getValue(
    value: string | number
): string | number {

    return value;
}
```

Usage:

```typescript
const a = getValue("Hello");

const b = getValue(100);
```

Inferred types:

```typescript
a // string

b // number
```

### Overload implementation

The implementation signature must be compatible with all overload signatures.

Only the overload signatures are visible to callers, not the broad implementation signature.

---

# 25. Class and Namespace Merging

A namespace can merge with a class, function, or enum under supported declaration-merging rules.

Example:

```typescript
class User {

    constructor(
        public name: string
    ) {}
}

namespace User {

    export function create(
        name: string
    ): User {

        return new User(name);
    }
}
```

Usage:

```typescript
const user = User.create("John");
```

Here:

- `User` is a class.
- `User` is also a namespace.
- The namespace adds a static-like helper function.

This is a supported declaration-merging pattern.

---

# PART 8: MODULE AUGMENTATION

# 26. What Is Module Augmentation?

Module Augmentation allows you to extend the types of an existing module.

It is especially useful when working with third-party libraries.

### Real-world example

Suppose a library defines:

```typescript
export interface Request {
    body: unknown;
}
```

You want to add a custom property called `user`.

You can augment the module.

```typescript
import "some-library";

declare module "some-library" {

    interface Request {
        user?: {
            id: number;
            name: string;
        };
    }

}
```

Now TypeScript understands:

```typescript
request.user?.name;
```

### Important

Module augmentation changes TypeScript's understanding of a module.

It does not automatically add runtime functionality.

Your application must still attach the actual `user` property at runtime.

---

# 27. Express.js Module Augmentation

This is a common real-world TypeScript use case.

Suppose you are using Express.js.

You want to add a custom authenticated user property to `Request`.

Create:

`src/types/express.d.ts`

```typescript
import "express";

declare global {

    namespace Express {

        interface User {
            id: number;
            email: string;
            role: string;
        }

        interface Request {
            user?: User;
        }

    }

}
```

Now in your controller:

```typescript
import { Request, Response } from "express";

export function getProfile(
    req: Request,
    res: Response
): void {

    const user = req.user;

    if (!user) {
        res.status(401).json({
            message: "Unauthorized"
        });

        return;
    }

    res.json({
        id: user.id,
        email: user.email,
        role: user.role
    });
}
```

TypeScript recognizes `req.user`.

### Why is this useful?

In authentication middleware, you may attach a decoded user to the request.

```typescript
function authenticationMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): void {

    // Verify token and obtain authenticated user.

    req.user = {
        id: 1,
        email: "john@example.com",
        role: "admin"
    };

    next();
}
```

This example assumes the authentication process has already verified the token.

**Important:** Never trust user information supplied directly by the client. The middleware must derive it from a validated authentication mechanism.

---

# PART 9: THIRD-PARTY TYPE DEFINITIONS

# 28. What Are Third-Party Type Definitions?

Many JavaScript libraries are used in TypeScript projects.

Some packages provide their own TypeScript definitions.

Others depend on external declaration packages.

Example:

```bash
npm install express
```

For Express versions that use the community-maintained type definitions:

```bash
npm install -D @types/express
```

Now you can write:

```typescript
import express, {
    Request,
    Response
} from "express";

const app = express();

app.get(
    "/users",
    (req: Request, res: Response) => {

        res.json({
            message: "Users fetched"
        });
    }
);
```

### What Is DefinitelyTyped?

DefinitelyTyped is a community project that maintains TypeScript declaration files for many JavaScript libraries.

Its packages are commonly published under the `@types` scope.

Examples:

```bash
npm install -D @types/node
```

```bash
npm install -D @types/express
```

```bash
npm install -D @types/lodash
```

### Important

Not every library needs an `@types` package.

Many modern packages include their own declaration files.

Always check the package before installing an additional type package.

---

# 29. Understanding `typeRoots` and `types`

These are different TypeScript compiler options.

## 29.1 `typeRoots`

Specifies directories where TypeScript should look for automatically included type packages.

Example:

```json
{
    "compilerOptions": {
        "typeRoots": [
            "./node_modules/@types",
            "./src/types"
        ]
    }
}
```

This changes the default type package lookup locations.

Be careful: specifying `typeRoots` can prevent TypeScript from automatically including other default type package locations that are not listed.

## 29.2 `types`

Controls which type packages are included in the global scope.

Example:

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

This limits automatic global type package inclusion to the listed packages.

### Comparison

| Option | Purpose |
|---|---|
| `typeRoots` | Specifies where type packages are searched |
| `types` | Specifies which type packages are automatically included |

---

# PART 10: ADVANCED TSCONFIG

# 30. Understanding `tsconfig.json`

The `tsconfig.json` file defines how TypeScript compiles and checks your project.

It controls:

- Target JavaScript version.
- Module system.
- Module resolution.
- Strictness.
- Output directory.
- Declaration generation.
- Source maps.
- Path aliases.
- Included files.
- Excluded files.

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
        "skipLibCheck": true
    },
    "include": ["src"],
    "exclude": ["node_modules", "dist"]
}
```

Let's understand advanced compiler options.

---

# 31. Important Compiler Options

## 31.1 `target`

Specifies the JavaScript language version TypeScript should emit.

```json
{
    "compilerOptions": {
        "target": "ES2022"
    }
}
```

Possible values include:

- `ES5`
- `ES2015`
- `ES2017`
- `ES2020`
- `ES2022`
- `ESNext`

The correct target depends on your runtime environment.

## 31.2 `module`

Controls the JavaScript module format generated by TypeScript.

```json
{
    "compilerOptions": {
        "module": "NodeNext"
    }
}
```

Other options include:

- `CommonJS`
- `ESNext`
- `Node16`
- `NodeNext`
- `Preserve`

The available options and their behavior depend on the TypeScript version.

## 31.3 `moduleResolution`

Controls how TypeScript locates imported modules.

```json
{
    "compilerOptions": {
        "moduleResolution": "NodeNext"
    }
}
```

## 31.4 `rootDir`

Defines the expected source directory structure for emitted files.

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
├── index.ts
└── users/
    └── user.ts
```

## 31.5 `outDir`

Specifies where compiled JavaScript files are emitted.

```json
{
    "compilerOptions": {
        "outDir": "./dist"
    }
}
```

## 31.6 `noEmit`

Prevents TypeScript from generating output files.

```json
{
    "compilerOptions": {
        "noEmit": true
    }
}
```

Useful when another tool, such as Vite or Next.js, handles compilation and bundling.

## 31.7 `sourceMap`

Generates source maps.

```json
{
    "compilerOptions": {
        "sourceMap": true
    }
}
```

Source maps help debugging compiled JavaScript by mapping it back to original TypeScript.

## 31.8 `removeComments`

Controls whether comments are removed from emitted JavaScript.

```json
{
    "compilerOptions": {
        "removeComments": true
    }
}
```

## 31.9 `incremental`

Enables incremental compilation.

```json
{
    "compilerOptions": {
        "incremental": true
    }
}
```

TypeScript stores build information to help subsequent compilations.

## 31.10 `composite`

Enables project-reference-compatible project settings.

```json
{
    "compilerOptions": {
        "composite": true
    }
}
```

This is important for multi-project TypeScript builds.

---

# PART 11: STRICT COMPILER OPTIONS

# 32. Understanding Strict Mode

Strict Mode enables a group of stricter type-checking options.

```json
{
    "compilerOptions": {
        "strict": true
    }
}
```

This is generally recommended for new TypeScript applications.

Let's explore important options.

## 32.1 `noImplicitAny`

Prevents TypeScript from silently inferring `any` in situations where a type cannot be determined.

Without it:

```typescript
function add(a, b) {
    return a + b;
}
```

With `noImplicitAny: true`, TypeScript reports errors for implicitly typed parameters.

Better:

```typescript
function add(
    a: number,
    b: number
): number {

    return a + b;
}
```

## 32.2 `strictNullChecks`

Requires handling `null` and `undefined` explicitly.

```typescript
function getUser(): string | null {
    return null;
}
```

Invalid:

```typescript
const user = getUser();

console.log(user.toUpperCase());
```

Valid:

```typescript
const user = getUser();

if (user !== null) {
    console.log(user.toUpperCase());
}
```

## 32.3 `strictFunctionTypes`

Enforces stricter function parameter compatibility in relevant type positions.

This helps prevent unsafe function assignments.

## 32.4 `strictBindCallApply`

Provides stricter type checking for:

- `bind()`
- `call()`
- `apply()`

## 32.5 `strictPropertyInitialization`

Requires class properties to be initialized or explicitly handled.

Incorrect:

```typescript
class User {

    name: string;
}
```

Better:

```typescript
class User {

    name: string;

    constructor(name: string) {
        this.name = name;
    }
}
```

You can also use definite assignment assertions when initialization occurs through another mechanism:

```typescript
class User {

    name!: string;
}
```

Use this carefully because the assertion does not initialize the property.

## 32.6 `noImplicitThis`

Prevents `this` from implicitly having an `any` type in relevant contexts.

## 32.7 `useUnknownInCatchVariables`

Treats catch clause variables as `unknown` by default.

Example:

```typescript
try {

    throw new Error("Something failed");

} catch (error) {

    if (error instanceof Error) {
        console.log(error.message);
    }
}
```

## 32.8 Additional Useful Strictness Options

These are not all enabled by `strict`.

```json
{
    "compilerOptions": {
        "noUncheckedIndexedAccess": true,
        "exactOptionalPropertyTypes": true,
        "noImplicitReturns": true,
        "noFallthroughCasesInSwitch": true,
        "noPropertyAccessFromIndexSignature": true
    }
}
```

| Option | Purpose |
|---|---|
| `noUncheckedIndexedAccess` | Adds `undefined` where indexed access may be missing |
| `exactOptionalPropertyTypes` | Distinguishes omitted optional properties from explicitly assigning `undefined` |
| `noImplicitReturns` | Reports functions that do not return consistently |
| `noFallthroughCasesInSwitch` | Prevents accidental switch fallthrough |
| `noPropertyAccessFromIndexSignature` | Requires bracket access for properties supplied only through index signatures |

### Recommended Configuration

For a strict Node.js application:

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
        "exactOptionalPropertyTypes": true,
        "noImplicitReturns": true,
        "noFallthroughCasesInSwitch": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "sourceMap": true
    },
    "include": ["src"],
    "exclude": ["node_modules", "dist"]
}
```

This is a starting point. Adjust it according to your runtime and libraries.

---

# PART 12: PATH MAPPING AND ALIASES

# 33. What Are Path Aliases?

Path aliases allow you to import modules using shorter, more readable paths instead of long relative paths.

### Without aliases

```typescript
import UserService from "../../../services/UserService";

import UserRepository from "../../../repositories/UserRepository";
```

This becomes difficult to maintain when the directory structure changes.

### With aliases

```typescript
import UserService from "@/services/UserService";

import UserRepository from "@/repositories/UserRepository";
```

## 33.1 Configure `baseUrl` and `paths`

Example:

```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"],
            "@services/*": ["src/services/*"],
            "@models/*": ["src/models/*"]
        }
    }
}
```

Now:

```typescript
import UserService from "@services/UserService";
```

### Important limitation

TypeScript `paths` primarily tells the compiler how to resolve imports for type checking.

It does not automatically rewrite import paths in emitted JavaScript.

Your runtime or bundler must support the aliases.

For example:

- Next.js has built-in support for configured TypeScript path aliases.
- Vite supports aliases through its configuration.
- Node.js needs an appropriate runtime or build-time resolution strategy.

Do not assume `tsc` alone makes aliases work at runtime.

---

# PART 13: PROJECT REFERENCES

# 34. What Are Project References?

Project References allow one TypeScript project to depend on another TypeScript project.

They are useful when applications become large and need to be divided into smaller independently buildable projects.

### Example structure

```text
project/
│
├── packages/
│   ├── shared/
│   │   ├── src/
│   │   └── tsconfig.json
│   │
│   └── backend/
│       ├── src/
│       └── tsconfig.json
│
└── tsconfig.json
```

The backend depends on the shared package.

## 34.1 Shared Project Configuration

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
    "include": ["src"]
}
```

## 34.2 Backend Configuration

`packages/backend/tsconfig.json`

```json
{
    "compilerOptions": {
        "composite": true,
        "rootDir": "./src",
        "outDir": "./dist",
        "strict": true
    },
    "references": [
        {
            "path": "../shared"
        }
    ],
    "include": ["src"]
}
```

## 34.3 Root Configuration

`tsconfig.json`

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

Build:

```bash
npx tsc -b
```

### What does `tsc -b` do?

It builds projects according to their project-reference dependency graph.

It can determine the required build order and reuse existing build information.

### Benefits

- Better organization.
- Independent compilation.
- Improved build performance.
- Reusable shared packages.
- Better support for large monorepos.

---

# PART 14: MONOREPO TYPESCRIPT CONFIGURATION

# 35. What Is a Monorepo?

A Monorepo is a repository that contains multiple related projects or packages.

Example:

```text
my-company/
│
├── apps/
│   ├── web/
│   ├── admin/
│   └── api/
│
├── packages/
│   ├── shared/
│   ├── ui/
│   ├── config/
│   └── types/
│
├── package.json
└── tsconfig.base.json
```

Here:

- `web` is a frontend application.
- `admin` is an administration application.
- `api` is the backend.
- `shared` contains common utilities.
- `ui` contains reusable UI components.
- `types` contains shared type definitions.

## 35.1 Shared TypeScript Configuration

`tsconfig.base.json`

```json
{
    "compilerOptions": {
        "strict": true,
        "noUncheckedIndexedAccess": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true
    }
}
```

Individual projects can extend it.

`apps/api/tsconfig.json`

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

`apps/web/tsconfig.json`

```json
{
    "extends": "../../tsconfig.base.json",
    "compilerOptions": {
        "target": "ES2020",
        "module": "ESNext",
        "moduleResolution": "Bundler",
        "jsx": "react-jsx",
        "noEmit": true
    },
    "include": ["src"]
}
```

### Important

Each application may require a different module resolution strategy.

For example:

- Backend: NodeNext.
- Frontend: Bundler.

A shared base configuration should contain common settings, not force identical runtime-specific options on every project.

---

# PART 15: TYPESCRIPT COMPILER ARCHITECTURE

# 36. How Does the TypeScript Compiler Work?

The TypeScript compiler converts TypeScript source code into JavaScript and performs static type checking.

A simplified compiler pipeline looks like this:

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
        AST
        |
        v
     Binder
        |
        v
    Type Checker
        |
        v
     Emitter
        |
        v
   JavaScript Output
```

Let's understand each stage.

## 36.1 Scanner

The Scanner reads source code character by character and converts it into tokens.

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

## 36.2 Parser

The Parser converts tokens into an Abstract Syntax Tree.

The AST represents the structure of the source code.

For example:

```typescript
const age: number = 25;
```

Conceptually contains:

- Variable declaration.
- Variable name.
- Type annotation.
- Initializer.

## 36.3 Abstract Syntax Tree (AST)

An Abstract Syntax Tree is a tree representation of source code.

It describes the syntactic structure of a program.

Consider:

```typescript
function add(a: number, b: number): number {
    return a + b;
}
```

The AST contains nodes representing:

- Function declaration.
- Parameters.
- Type annotations.
- Return type.
- Return statement.
- Binary expression.

## 36.4 Binder

The Binder connects declarations and creates symbols.

It helps the compiler understand relationships between declarations.

For example:

```typescript
const age = 25;

function getAge() {
    return age;
}
```

The Binder helps associate the reference to `age` with its declaration.

## 36.5 Type Checker

The Type Checker performs static type analysis.

Example:

```typescript
const age: number = "Twenty Five";
```

The Type Checker reports an error because a string is not assignable to a number.

It also checks:

- Function arguments.
- Return types.
- Generic constraints.
- Property access.
- Type compatibility.
- Module declarations.

## 36.6 Emitter

The Emitter generates output files based on compiler settings.

Example:

```typescript
const message: string = "Hello";
```

Compiled JavaScript:

```javascript
const message = "Hello";
```

The type annotation is removed.

### Important

TypeScript is primarily a static type checker and source-to-source compiler.

It does not generally perform runtime type validation.

---

# 37. TypeScript Compiler Commands

| Command | Purpose |
|---|---|
| `tsc` | Compiles the current TypeScript project |
| `tsc --init` | Creates a tsconfig file |
| `tsc --noEmit` | Checks types without generating output |
| `tsc --watch` | Watches files and recompiles |
| `tsc --build` | Builds project references |
| `tsc --showConfig` | Displays resolved configuration |
| `tsc --listFiles` | Lists files included in compilation |
| `tsc --traceResolution` | Shows module resolution details |
| `tsc --explainFiles` | Explains why files are included |
| `tsc --diagnostics` | Displays compiler performance information |
| `tsc --extendedDiagnostics` | Displays detailed performance information |

### Example

```bash
npx tsc --noEmit
```

This performs type checking without emitting JavaScript.

Useful in CI pipelines.

---

# PART 16: TYPESCRIPT COMPILER API

# 38. What Is the TypeScript Compiler API?

The TypeScript Compiler API allows developers to interact with the TypeScript compiler programmatically.

It can be used to:

- Read TypeScript source files.
- Inspect AST nodes.
- Analyze types.
- Generate code.
- Build custom tools.
- Create code transformations.
- Develop custom linting or analysis utilities.

Install TypeScript:

```bash
npm install -D typescript
```

## 38.1 Reading a Source File

```typescript
import ts from "typescript";

const sourceFile = ts.createSourceFile(
    "example.ts",
    `
        const name: string = "John";

        function greet() {
            return "Hello";
        }
    `,
    ts.ScriptTarget.Latest,
    true
);

console.log(sourceFile.fileName);

console.log(sourceFile.statements.length);
```

## 38.2 Traversing AST Nodes

```typescript
import ts from "typescript";

const source = `
    const age: number = 25;

    function add(a: number, b: number) {
        return a + b;
    }
`;

const sourceFile = ts.createSourceFile(
    "example.ts",
    source,
    ts.ScriptTarget.Latest,
    true
);

function visit(node: ts.Node): void {

    console.log(
        ts.SyntaxKind[node.kind]
    );

    ts.forEachChild(node, visit);
}

visit(sourceFile);
```

This recursively traverses the AST.

You can inspect different node types.

For example:

```typescript
if (ts.isFunctionDeclaration(node)) {
    console.log(node.name?.text);
}
```

## 38.3 Creating a TypeScript Program

The Compiler API can create a program using the compiler host.

```typescript
import ts from "typescript";

const configPath = ts.findConfigFile(
    process.cwd(),
    ts.sys.fileExists,
    "tsconfig.json"
);

if (!configPath) {
    throw new Error("tsconfig.json not found");
}

const configFile = ts.readConfigFile(
    configPath,
    ts.sys.readFile
);

const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    process.cwd()
);

const program = ts.createProgram({
    rootNames: parsedConfig.fileNames,
    options: parsedConfig.options
});

const diagnostics =
    ts.getPreEmitDiagnostics(program);

for (const diagnostic of diagnostics) {

    console.log(
        ts.flattenDiagnosticMessageText(
            diagnostic.messageText,
            "\n"
        )
    );
}
```

This programmatically checks a TypeScript project.

### When is the Compiler API useful?

- Custom static analysis.
- Code generators.
- Automated refactoring tools.
- Documentation generators.
- Dependency analysis.
- Advanced development tooling.

---

# PART 17: BUILD PERFORMANCE OPTIMIZATION

# 39. Improving TypeScript Build Performance

Large TypeScript applications can take time to compile.

Here are useful optimization techniques.

## 39.1 Use Incremental Compilation

```json
{
    "compilerOptions": {
        "incremental": true
    }
}
```

TypeScript stores build information to speed up later builds.

## 39.2 Use Project References

Split large projects into smaller independently buildable projects.

```text
packages/
├── shared/
├── database/
└── backend/
```

## 39.3 Avoid Extremely Complex Types

Deep recursive types and complicated conditional types can increase type-checking time.

Prefer simpler abstractions when possible.

## 39.4 Avoid Unnecessary Type Imports

Import only the types and modules you need.

```typescript
import type { User } from "./User";
```

This clearly identifies a type-only dependency.

## 39.5 Use `skipLibCheck` Carefully

```json
{
    "compilerOptions": {
        "skipLibCheck": true
    }
}
```

This skips checking declaration files during type checking.

It can improve compilation performance, but it does not fix incorrect declarations or validate your application code more thoroughly.

## 39.6 Use `isolatedModules` When Required

```json
{
    "compilerOptions": {
        "isolatedModules": true
    }
}
```

This checks whether each file can be safely transpiled independently by tools that do not perform whole-program type checking.

It is particularly useful with transpilers such as Babel or esbuild.

## 39.7 Separate Type Checking from Bundling

Some tools transpile TypeScript without performing full type checking.

For example, esbuild and many Vite configurations transform TypeScript but rely on separate type-checking commands.

A typical workflow:

```json
{
    "scripts": {
        "build": "vite build",
        "typecheck": "tsc --noEmit"
    }
}
```

This separates:

- JavaScript transformation and bundling.
- Type checking.

### Recommended practices

| Practice | Benefit |
|---|---|
| Incremental compilation | Faster repeated builds |
| Project references | Better large-project organization |
| Avoid complex types | Lower type-checking overhead |
| Type-only imports | Clearer type dependencies |
| Separate type checking | Better build workflow |
| `skipLibCheck` | Potentially faster checking of dependencies |

---

# PART 18: TYPESCRIPT PACKAGE DEVELOPMENT

# 40. Creating a Reusable TypeScript Package

Let's build a simple reusable TypeScript utility package.

Example package name:

`my-utils`

Project structure:

```text
my-utils/
│
├── src/
│   ├── math.ts
│   ├── string.ts
│   └── index.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

## 40.1 Create Utility Functions

`src/math.ts`

```typescript
export function add(
    a: number,
    b: number
): number {

    return a + b;
}

export function multiply(
    a: number,
    b: number
): number {

    return a * b;
}
```

`src/string.ts`

```typescript
export function capitalize(
    value: string
): string {

    return value.charAt(0).toUpperCase() +
        value.slice(1);
}
```

## 40.2 Create the Package Entry Point

`src/index.ts`

```typescript
export * from "./math.js";

export * from "./string.js";
```

## 40.3 Configure TypeScript

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
        "strict": true,
        "sourceMap": true
    },
    "include": ["src"]
}
```

## 40.4 Configure package.json

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

The TypeScript version shown is illustrative; use a compatible version for your project.

## 40.5 Build the Package

```bash
npm run build
```

Generated structure:

```text
my-utils/
│
├── src/
│
└── dist/
    ├── index.js
    ├── index.d.ts
    ├── math.js
    ├── math.d.ts
    ├── string.js
    └── string.d.ts
```

Now the package is ready for local testing.

### Important package design considerations

A production package may also need:

- CommonJS compatibility.
- ESM compatibility.
- Correct conditional exports.
- Versioned API documentation.
- Tests.
- License.
- README.
- Changelog.
- Dependency management.

The simple example above is ESM-only.

---

# 41. Publishing a TypeScript Package to npm

Once your package is ready, you can publish it to npm.

### Step 1: Create an npm account

Visit the official npm website:

[npm](https://www.npmjs.com/?utm_source=chatgpt.com)

### Step 2: Login

```bash
npm login
```

### Step 3: Check package name

```bash
npm view my-utils
```

If the package name is already taken, choose another available name.

### Step 4: Build the package

```bash
npm run build
```

### Step 5: Check package contents

```bash
npm pack --dry-run
```

This previews the files that will be included in the package.

### Step 6: Publish

```bash
npm publish
```

For a public scoped package:

```bash
npm publish --access public
```

### Step 7: Install the package elsewhere

```bash
npm install my-utils
```

Usage:

```typescript
import {
    add,
    multiply,
    capitalize
} from "my-utils";

console.log(add(10, 20));

console.log(multiply(5, 5));

console.log(capitalize("hello"));
```

### Important

Before publishing:

- Ensure the package name is available.
- Verify the build output.
- Verify the package exports.
- Include required declaration files.
- Avoid publishing secrets.
- Check the contents with `npm pack --dry-run`.

---

# PART 19: REAL-WORLD MODULE ARCHITECTURE

# 42. Organizing a Professional TypeScript Backend

Let's combine the concepts into a realistic Node.js and Express.js application.

### Project Structure

```text
src/
│
├── config/
│   ├── database.ts
│   └── environment.ts
│
├── modules/
│   │
│   ├── users/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.repository.ts
│   │   ├── user.routes.ts
│   │   ├── user.types.ts
│   │   └── index.ts
│   │
│   ├── products/
│   │   ├── product.controller.ts
│   │   ├── product.service.ts
│   │   ├── product.repository.ts
│   │   ├── product.routes.ts
│   │   ├── product.types.ts
│   │   └── index.ts
│   │
│   └── orders/
│       ├── order.controller.ts
│       ├── order.service.ts
│       ├── order.repository.ts
│       ├── order.routes.ts
│       ├── order.types.ts
│       └── index.ts
│
├── middlewares/
│   ├── authentication.ts
│   └── errorHandler.ts
│
├── shared/
│   ├── errors/
│   ├── utils/
│   └── types/
│
├── app.ts
└── server.ts
```

## 42.1 User Types

`modules/users/user.types.ts`

```typescript
export interface User {
    id: number;
    name: string;
    email: string;
}

export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}
```

## 42.2 User Repository

`modules/users/user.repository.ts`

```typescript
import { User } from "./user.types";

export class UserRepository {

    async findAll(): Promise<User[]> {

        // Database implementation

        return [];
    }

    async findById(
        id: number
    ): Promise<User | null> {

        // Database implementation

        return null;
    }
}
```

## 42.3 User Service

`modules/users/user.service.ts`

```typescript
import { UserRepository } from "./user.repository";

export class UserService {

    constructor(
        private repository: UserRepository
    ) {}

    async getUsers() {

        return this.repository.findAll();
    }
}
```

## 42.4 User Controller

`modules/users/user.controller.ts`

```typescript
import {
    Request,
    Response,
    NextFunction
} from "express";

import { UserService } from "./user.service";

export class UserController {

    constructor(
        private service: UserService
    ) {}

    getUsers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {

        try {

            const users = await this.service.getUsers();

            res.json({
                success: true,
                data: users
            });

        } catch (error) {

            next(error);
        }
    };
}
```

## 42.5 User Routes

`modules/users/user.routes.ts`

```typescript
import { Router } from "express";

import { UserRepository } from "./user.repository";

import { UserService } from "./user.service";

import { UserController } from "./user.controller";

const router = Router();

const repository = new UserRepository();

const service = new UserService(repository);

const controller = new UserController(service);

router.get("/", controller.getUsers);

export default router;
```

## 42.6 Barrel File

`modules/users/index.ts`

```typescript
export * from "./user.types";

export * from "./user.repository";

export * from "./user.service";

export * from "./user.controller";

export { default as userRoutes } from "./user.routes";
```

## 42.7 Application Entry

`app.ts`

```typescript
import express from "express";

import userRoutes from "./modules/users/user.routes.js";

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

export default app;
```

### Architecture Flow

```text
HTTP Request
     |
     v
User Routes
     |
     v
User Controller
     |
     v
User Service
     |
     v
User Repository
     |
     v
Database
```

### What did we learn?

This project uses:

- ES Modules.
- Named Exports.
- Default Exports.
- Module organization.
- TypeScript interfaces.
- Dependency injection through constructors.
- Layered architecture.
- Barrel files.

For a larger application, you may want to move dependency creation into a separate composition root instead of creating dependencies directly inside route files.

---

# 43. Common Mistakes to Avoid

### 1. Mixing CommonJS and ES Modules Carelessly

Avoid using incompatible combinations of `require()`, `import`, `module.exports`, and package configuration without understanding the runtime behavior.

### 2. Assuming TypeScript Path Aliases Work Automatically at Runtime

`paths` does not rewrite emitted JavaScript imports.

Configure your bundler or runtime accordingly.

### 3. Treating Declaration Files as Implementations

A `.d.ts` file describes code. It does not implement that code.

### 4. Overusing Namespaces

Modern TypeScript applications generally benefit more from ES Modules.

### 5. Misusing `declare`

A declaration does not initialize a variable or create a runtime object.

### 6. Overusing Global Type Augmentation

Adding many global declarations can create naming conflicts and make code harder to maintain.

### 7. Creating Circular Dependencies

Carefully manage dependencies between modules.

### 8. Publishing Without Testing Package Exports

Always test the built package, not just the TypeScript source.

### 9. Using `skipLibCheck` to Hide Application Errors

This option skips declaration-file checking. It is not a replacement for fixing application type errors.

### 10. Ignoring Module Resolution

A project may compile successfully but fail at runtime if its generated imports are incompatible with the runtime environment.

---

# 44. Interview Questions and Answers

### Q1. What is a TypeScript Module?

A file containing imports or exports that create its own module scope.

### Q2. What is the difference between a module and a namespace?

A module organizes code through file-based imports and exports. A namespace groups declarations under a named scope.

### Q3. What are Named Exports?

Exports that are imported using their declared names.

### Q4. What is a Default Export?

A module's primary default export, imported without curly braces.

### Q5. Can a module have multiple default exports?

No. A module can have only one default export.

### Q6. What are Re-Exports?

Re-Exports allow one module to export functionality from another module.

### Q7. What is a Barrel File?

A file that centralizes exports from multiple modules.

### Q8. What is ES Module?

The standard JavaScript module system based on `import` and `export`.

### Q9. What is CommonJS?

The traditional Node.js module system based on `require()` and `module.exports`.

### Q10. What is Module Resolution?

The process used to locate imported modules and packages.

### Q11. What is NodeNext?

A TypeScript module and resolution mode designed to model modern Node.js ESM and CommonJS behavior.

### Q12. What is Bundler Resolution?

A module resolution strategy designed for modern JavaScript bundlers.

### Q13. What is a Declaration File?

A `.d.ts` file that describes the types of JavaScript code.

### Q14. What does `declare` do?

It informs TypeScript that a variable, function, class, or other declaration exists elsewhere.

### Q15. What is an Ambient Declaration?

A declaration describing functionality provided by an external runtime or module.

### Q16. What is Module Augmentation?

A technique for extending the type declarations of an existing module.

### Q17. What is Declaration Merging?

A TypeScript feature that combines compatible declarations with the same name.

### Q18. Can interfaces merge?

Yes. Multiple compatible interface declarations with the same name are merged.

### Q19. What is DefinitelyTyped?

A community-maintained repository of TypeScript declaration files for JavaScript libraries.

### Q20. What is `@types`?

An npm package scope commonly used for third-party TypeScript declaration packages.

### Q21. What is `typeRoots`?

A compiler option that specifies directories where TypeScript searches for type packages.

### Q22. What is `types`?

A compiler option that specifies which type packages are automatically included in the global scope.

### Q23. What is `declaration: true`?

A compiler option that generates `.d.ts` files.

### Q24. What is `declarationMap`?

An option that generates source maps for declaration files.

### Q25. What is `noEmit`?

It prevents TypeScript from generating output files.

### Q26. What is `incremental`?

It enables incremental compilation using stored build information.

### Q27. What are Project References?

A mechanism that allows TypeScript projects to depend on other TypeScript projects.

### Q28. What is `composite`?

A compiler option that enables project-reference-compatible project settings.

### Q29. What is a Monorepo?

A repository containing multiple related projects or packages.

### Q30. What is the TypeScript Compiler?

A tool that analyzes TypeScript code, performs type checking, and can generate JavaScript and other outputs.

### Q31. What is an AST?

An Abstract Syntax Tree representing the syntactic structure of source code.

### Q32. What is the Binder?

A compiler component that connects declarations and creates symbols.

### Q33. What is the Type Checker?

The compiler component responsible for analyzing type compatibility and reporting type errors.

### Q34. What is the Emitter?

The compiler component that generates output files.

### Q35. What is the TypeScript Compiler API?

A programmatic API for analyzing, transforming, and generating TypeScript code.

### Q36. Does TypeScript generate JavaScript from declaration files?

No. Declaration files describe types and do not provide executable implementations.

### Q37. What is the difference between `typeRoots` and `types`?

`typeRoots` controls where TypeScript searches for type packages. `types` controls which type packages are automatically included.

### Q38. Does `paths` rewrite import paths?

No. It helps TypeScript resolve imports during type checking. Runtime or bundler configuration is still required.

### Q39. What is the difference between `module` and `moduleResolution`?

`module` controls the module format and related emit behavior. `moduleResolution` controls how imports are located.

### Q40. Why is `skipLibCheck` used?

To skip type checking of declaration files and potentially improve compilation performance.

---

# 45. Practical Exercises

Complete these exercises to strengthen your understanding.

| No. | Exercise | Concepts |
|---|---|---|
| 1 | Create a math module with named exports | Modules |
| 2 | Create a module using default exports | Default Export |
| 3 | Build a centralized index file | Barrel Files |
| 4 | Convert a CommonJS module into ES Modules | ESM and CommonJS |
| 5 | Configure a NodeNext TypeScript project | Module Resolution |
| 6 | Create a custom `.d.ts` file for a JavaScript library | Declaration Files |
| 7 | Declare a global application variable | Ambient Declarations |
| 8 | Create a namespace containing user utilities | Namespaces |
| 9 | Demonstrate interface declaration merging | Declaration Merging |
| 10 | Extend Express Request with a user property | Module Augmentation |
| 11 | Configure `typeRoots` and `types` | Compiler Configuration |
| 12 | Generate declaration files automatically | `declaration` |
| 13 | Configure path aliases | `paths` |
| 14 | Create a project with two TypeScript references | Project References |
| 15 | Create a small monorepo | Monorepo Architecture |
| 16 | Inspect the AST of a TypeScript file | Compiler API |
| 17 | Create a TypeScript package | Package Development |
| 18 | Publish a utility package to npm | npm |
| 19 | Configure strict TypeScript compiler options | Strict Mode |
| 20 | Build a modular Express.js backend | Real-World Architecture |

---

# 46. Phase 41 Completion Checklist

### Modules
- [ ] TypeScript Modules
- [ ] Named Exports
- [ ] Default Exports
- [ ] Re-Exports
- [ ] Barrel Files

### Module Systems
- [ ] ES Modules
- [ ] CommonJS
- [ ] ESM vs CommonJS
- [ ] `package.json` Module Configuration
- [ ] NodeNext
- [ ] Bundler Resolution

### Declaration Files
- [ ] `.d.ts` Files
- [ ] `declare`
- [ ] Ambient Declarations
- [ ] Ambient Modules
- [ ] Custom Type Definitions
- [ ] Declaration Generation

### Namespaces and Augmentation
- [ ] Namespace Fundamentals
- [ ] Nested Namespaces
- [ ] Namespace vs Module
- [ ] Declaration Merging
- [ ] Interface Merging
- [ ] Function Overload Merging
- [ ] Module Augmentation
- [ ] Global Type Augmentation

### Compiler Configuration
- [ ] Advanced `tsconfig.json`
- [ ] Strict Mode
- [ ] Strict Compiler Options
- [ ] Path Aliases
- [ ] Module Resolution
- [ ] Project References
- [ ] Monorepo Configuration

### Compiler Internals
- [ ] Scanner
- [ ] Parser
- [ ] AST
- [ ] Binder
- [ ] Type Checker
- [ ] Emitter
- [ ] Compiler API
- [ ] Compiler Diagnostics

### Package Development
- [ ] TypeScript Package Structure
- [ ] Declaration Generation
- [ ] ESM Package Configuration
- [ ] npm Publishing
- [ ] Package Exports
- [ ] Real-World Module Architecture

---

# Next Phase

## Phase 42: Advanced TypeScript – Testing, Debugging, Error Handling and Code Quality

In the next phase, we will focus on writing reliable, testable, maintainable TypeScript applications.

Topics:

1. Testing Fundamentals.
2. Unit Testing.
3. Integration Testing.
4. End-to-End Testing.
5. Jest with TypeScript.
6. Vitest with TypeScript.
7. Testing TypeScript Classes.
8. Testing Interfaces Through Implementations.
9. Mocking and Stubbing.
10. Dependency Injection for Testing.
11. Testing Asynchronous Code.
12. Testing Promises.
13. Testing API Endpoints.
14. Supertest with Express.
15. Testing React Components with TypeScript.
16. Playwright with TypeScript.
17. Debugging TypeScript Applications.
18. Node.js Debugging.
19. VS Code Debugging.
20. Source Maps.
21. Error Handling Strategies.
22. Custom Error Classes.
23. Error Types and Discriminated Unions.
24. Global Error Handling.
25. Logging and Monitoring.
26. ESLint with TypeScript.
27. Prettier.
28. Code Quality and Static Analysis.
29. Test Coverage.
30. CI/CD Testing Workflows.
31. Real-World Testing Project.

**Phase 41 is complete.**

When you're ready, say **OK, Phase 42** to continue.