# Phase 23: Advanced TypeScript – Modules, Namespaces, Declaration Files, and Module Augmentation

**Level:** Advanced  
**Prerequisites:**
- Phase 8: Type Aliases
- Phase 9: Interfaces
- Phase 14: Generics
- Phase 21: Classes and OOP
- Phase 22: Decorators and Metadata

## Learning Objectives

By the end of this phase, you will understand:

1. JavaScript modules.
2. Named exports and imports.
3. Default exports and imports.
4. Type-only imports and exports.
5. Module resolution.
6. CommonJS vs ES Modules.
7. TypeScript namespaces.
8. Namespace merging.
9. Declaration files (`.d.ts`).
10. Ambient declarations.
11. Global declarations.
12. Module augmentation.
13. Declaration merging.
14. Triple-slash directives.
15. Typing JavaScript libraries.
16. Creating custom type declaration files.
17. Organizing large TypeScript projects.

---

# 1. What Are Modules?

A module is an independent file that contains code and can share selected functionality with other files.

In JavaScript and TypeScript, modules help organize applications into smaller, reusable units.

For example, consider a project with:

```text
src/
│
├── users/
│   ├── user.service.ts
│   ├── user.controller.ts
│   └── user.model.ts
│
├── products/
│   ├── product.service.ts
│   ├── product.controller.ts
│   └── product.model.ts
│
└── app.ts
```

Each file can contain separate functionality.

Instead of writing the entire application in one file, we divide it into modules.

### Why do we need modules?

Modules provide:

- Code organization.
- Reusability.
- Maintainability.
- Separation of concerns.
- Better dependency management.
- Easier testing.
- Reduced naming conflicts.

### Example without modules

```typescript
// app.ts

function createUser() {}

function createProduct() {}

function deleteUser() {}

function deleteProduct() {}
```

As the application grows, maintaining everything in one file becomes difficult.

Modules solve this problem.

---

# 2. Understanding Exports and Imports

Modules communicate with each other through exports and imports.

There are two primary operations:

- `export`: Makes selected declarations available to other modules.
- `import`: Allows a module to use exported declarations.

### Example project

```text
src/
│
├── math.ts
└── app.ts
```

### math.ts

```typescript
export function add(a: number, b: number): number {
    return a + b;
}

export function subtract(a: number, b: number): number {
    return a - b;
}
```

We export both functions.

### app.ts

```typescript
import { add, subtract } from "./math.js";

console.log(add(10, 20));

console.log(subtract(20, 10));
```

We import the exported functions.

**Note:** The `.js` extension is appropriate for this example when using Node.js ESM with TypeScript's `NodeNext` module resolution. Other project configurations may use different import conventions.

### Important

A file containing a top-level `import` or `export` is treated as a module.

A file without imports or exports may be treated as a script, depending on the project configuration and TypeScript's module detection settings.

---

# 3. Named Exports

Named exports allow a file to export multiple declarations.

### Example

```typescript
// user.ts

export const userName = "Riyaz";

export const userAge = 25;

export function getUser() {
    return {
        name: userName,
        age: userAge
    };
}
```

Now import them:

```typescript
// app.ts

import {
    userName,
    userAge,
    getUser
} from "./user.js";

console.log(userName);

console.log(userAge);

console.log(getUser());
```

### Import using aliases

You can rename an imported declaration using `as`.

```typescript
import {
    userName as name,
    userAge as age
} from "./user.js";
```

Now:

```typescript
console.log(name);

console.log(age);
```

### Export using aliases

```typescript
const name = "Riyaz";

function getUser() {
    return name;
}

export {
    name as userName,
    getUser
};
```

### Important rules

- A module can have multiple named exports.
- Named imports generally use the exported names.
- Aliases can change the local imported name.
- Named exports are useful when a module provides multiple related functions or types.

---

# 4. Default Exports

A module can also have one default export.

Default exports are useful when a module has one primary functionality.

### Example

```typescript
// user.ts

class User {
    constructor(
        public name: string,
        public age: number
    ) {}
}

export default User;
```

Import it:

```typescript
// app.ts

import User from "./user.js";

const user = new User("Riyaz", 25);

console.log(user);
```

Notice that we do not use curly braces.

### Default export with a function

```typescript
// greeting.ts

export default function greet(name: string): string {
    return `Hello ${name}`;
}
```

Import:

```typescript
import greet from "./greeting.js";

console.log(greet("Riyaz"));
```

### Default export with an anonymous function

```typescript
export default function (name: string) {
    return `Hello ${name}`;
}
```

### Default export using `export default`

You can also export an expression:

```typescript
const appName = "My Application";

export default appName;
```

### Named exports vs default exports

| Named export | Default export |
|---|---|
| A module can have multiple | A module has one default export |
| Imported using `{}` | Imported without `{}` |
| Normally imported by exported name | Local import name can be chosen freely |
| Useful for multiple utilities | Useful for one primary module value |

### Can a module have both?

Yes.

```typescript
// user.ts

export const role = "ADMIN";

export function getUser() {
    return "Riyaz";
}

export default class User {}
```

Import:

```typescript
import User, {
    role,
    getUser
} from "./user.js";
```

This is valid.

---

# 5. Re-exporting Modules

Sometimes you want to export functionality from another module without importing it into a local variable.

This is called re-exporting.

### Example structure

```text
src/
│
├── users/
│   ├── user.service.ts
│   └── user.model.ts
│
└── index.ts
```

### user.model.ts

```typescript
export type User = {
    id: number;
    name: string;
};
```

### user.service.ts

```typescript
import type { User } from "./user.model.js";

export function getUser(): User {
    return {
        id: 1,
        name: "Riyaz"
    };
}
```

### index.ts

```typescript
export * from "./users/user.model.js";

export * from "./users/user.service.js";
```

Now another file can import from one central location:

```typescript
import {
    User,
    getUser
} from "./index.js";
```

### Re-exporting with aliases

```typescript
export {
    getUser as fetchUser
} from "./users/user.service.js";
```

### Re-exporting default exports

A default export is not included by:

```typescript
export * from "./user.js";
```

You can explicitly re-export it:

```typescript
export { default as User } from "./user.js";
```

### Barrel files

A file that re-exports declarations from multiple modules is commonly called a barrel file.

For example:

```text
users/
│
├── user.model.ts
├── user.service.ts
├── user.controller.ts
└── index.ts
```

`index.ts`:

```typescript
export * from "./user.model.js";

export * from "./user.service.js";

export * from "./user.controller.js";
```

Barrel files simplify imports.

However, excessive barrel usage can introduce circular dependencies or make module loading less predictable.

---

# 6. Type-Only Imports and Exports

TypeScript provides special syntax for importing and exporting types without treating them as runtime values.

### Example

```typescript
// user.ts

export interface User {
    id: number;
    name: string;
}
```

Import the interface:

```typescript
import type { User } from "./user.js";
```

Use it:

```typescript
const user: User = {
    id: 1,
    name: "Riyaz"
};
```

The import is only needed for type checking.

It does not need to exist as a runtime JavaScript import.

### Normal import vs type-only import

```typescript
import { User } from "./user.js";
```

```typescript
import type { User } from "./user.js";
```

The second form explicitly declares that the import is type-only.

### Type-only export

```typescript
export type User = {
    id: number;
    name: string;
};
```

### Type-only re-export

```typescript
export type { User } from "./user.js";
```

### Importing both a value and a type

Suppose:

```typescript
// user.ts

export interface User {
    id: number;
}

export class UserService {}
```

You can write:

```typescript
import {
    UserService,
    type User
} from "./user.js";
```

This imports:

- `UserService` as a runtime value.
- `User` as a type.

### Important distinction: Type vs value

Consider:

```typescript
interface User {
    name: string;
}
```

The interface exists only in the TypeScript type system.

But:

```typescript
class UserService {}
```

The class exists both:

- As a TypeScript type describing instances.
- As a JavaScript runtime value representing the constructor.

This is why type-only imports matter.

---

# 7. Understanding the JavaScript Module System

JavaScript has two major module systems:

1. CommonJS.
2. ECMAScript Modules (ESM).

TypeScript supports both.

## A. CommonJS

CommonJS is traditionally used in Node.js.

It uses:

```javascript
require()
```

and:

```javascript
module.exports
```

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

### CommonJS characteristics

- Uses `require()` for imports.
- Uses `module.exports` and `exports` for exports.
- Traditionally associated with Node.js.
- Loads modules synchronously through its module loader.

## B. ECMAScript Modules (ESM)

ESM is the standardized JavaScript module system.

It uses:

```javascript
import
```

and:

```javascript
export
```

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

### ESM characteristics

- Uses `import` and `export`.
- Supports static module analysis.
- Supports top-level `await` in supported module contexts.
- Supports live bindings.
- Is the standard module system for JavaScript.

### CommonJS vs ESM

| Feature | CommonJS | ESM |
|---|---|---|
| Import | `require()` | `import` |
| Export | `module.exports` | `export` |
| Default style | Traditional Node.js | JavaScript standard |
| Static analysis | More limited | Strong static structure |
| Top-level await | Not supported in ordinary CommonJS | Supported in ESM |
| Binding behavior | Export object properties | Live bindings |
| Typical file extension | `.cjs` | `.mjs` |

---

# 8. TypeScript Module Configuration

TypeScript provides several compiler options that control module behavior.

Some important options are:

- `module`
- `moduleResolution`
- `target`
- `rootDir`
- `outDir`
- `verbatimModuleSyntax`

Let's understand them.

### A. `module`

Controls the module format TypeScript emits or models.

Example:

```json
{
    "compilerOptions": {
        "module": "NodeNext"
    }
}
```

Other commonly used options include:

- `ESNext`
- `ES2022`
- `CommonJS`
- `Node16`
- `NodeNext`
- `Preserve`

The appropriate choice depends on your runtime and build system.

### B. `moduleResolution`

Controls how TypeScript finds imported modules.

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

- `NodeNext`
- `Node16`
- `Bundler`
- `Node10` (legacy)

### C. `target`

Controls the JavaScript language version used for emitted output.

Example:

```json
{
    "compilerOptions": {
        "target": "ES2022"
    }
}
```

### D. `rootDir`

Specifies the source directory.

```json
{
    "compilerOptions": {
        "rootDir": "./src"
    }
}
```

### E. `outDir`

Specifies where compiled JavaScript files are generated.

```json
{
    "compilerOptions": {
        "outDir": "./dist"
    }
}
```

### F. `verbatimModuleSyntax`

Controls how imports and exports are preserved or removed.

Example:

```json
{
    "compilerOptions": {
        "verbatimModuleSyntax": true
    }
}
```

With this option, type-only imports should be written explicitly using `import type`.

### Example complete configuration

For a Node.js ESM project:

**package.json**

```json
{
    "type": "module",
    "scripts": {
        "build": "tsc",
        "start": "node dist/app.js"
    }
}
```

**tsconfig.json**

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "rootDir": "./src",
        "outDir": "./dist",
        "strict": true,
        "verbatimModuleSyntax": true,
        "esModuleInterop": true
    },
    "include": ["src"]
}
```

Project structure:

```text
project/
│
├── src/
│   ├── app.ts
│   └── math.ts
│
├── dist/
│
├── package.json
└── tsconfig.json
```

**Important:** In a NodeNext project with `"type": "module"`, relative TypeScript source imports commonly use the emitted JavaScript extension:

```typescript
import { add } from "./math.js";
```

TypeScript resolves that specifier to the corresponding TypeScript source file during compilation.

---

# 9. Module Resolution

Module resolution is the process TypeScript uses to locate an imported module.

Consider:

```typescript
import { add } from "./math.js";
```

TypeScript needs to determine which file corresponds to this import.

It considers:

- The module specifier.
- The importing file's location.
- `moduleResolution`.
- Package metadata.
- File extensions.
- Package export maps.
- Type declaration files.

### Relative module imports

```typescript
import { User } from "./user.js";
```

This refers to a module relative to the current file.

### Package imports

```typescript
import express from "express";
```

TypeScript searches for the package and its associated type information.

### Path aliases

You can define aliases in `tsconfig.json`.

```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"],
            "@users/*": ["src/users/*"]
        }
    }
}
```

Now you can write:

```typescript
import { UserService } from "@/users/user.service";
```

### Important limitation of path aliases

TypeScript's `paths` option helps the compiler resolve imports.

It does not automatically rewrite the emitted JavaScript import paths.

Your runtime, bundler, test runner, or build tool must also understand the alias.

For example, Next.js, Vite, and other tools may support aliases through their own configuration or integration.

### Why module resolution matters

Incorrect module resolution can cause:

- Cannot find module errors.
- Missing type declarations.
- Runtime import failures.
- Incorrect package entry-point resolution.
- ESM/CommonJS compatibility problems.

---

# 10. What Are Namespaces?

A namespace is a way to group related declarations under one named scope.

Namespaces are a TypeScript feature.

They can contain:

- Variables.
- Functions.
- Classes.
- Interfaces.
- Type aliases.
- Other namespaces.

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

### Why use namespaces?

Namespaces help organize related declarations and prevent naming conflicts.

For example:

```typescript
namespace UserModule {
    export class User {}
}

namespace ProductModule {
    export class User {}
}
```

Both namespaces can contain a class named `User`.

They are accessed separately:

```typescript
const user = new UserModule.User();

const productUser = new ProductModule.User();
```

### Important

Members inside a namespace are not automatically accessible outside it.

You generally need `export` to expose them.

Example:

```typescript
namespace App {
    const version = "1.0";

    export function getVersion(): string {
        return version;
    }
}
```

Usage:

```typescript
App.getVersion();
```

But:

```typescript
App.version;
```

is invalid because `version` is not exported.

---

# 11. Nested Namespaces

Namespaces can contain other namespaces.

### Example

```typescript
namespace App {
    export namespace Users {
        export class User {
            constructor(public name: string) {}
        }
    }

    export namespace Products {
        export class Product {
            constructor(public title: string) {}
        }
    }
}
```

Usage:

```typescript
const user = new App.Users.User("Riyaz");

const product = new App.Products.Product("Laptop");
```

This is useful for grouping related functionality.

### Nested namespace syntax

```typescript
namespace Parent {
    export namespace Child {
        // Declarations
    }
}
```

### Important

Modern TypeScript applications generally prefer ES modules for organizing code across files.

Namespaces are still useful in certain scenarios, including:

- Legacy TypeScript code.
- Global scripts.
- Declaration files.
- Some library typing patterns.

---

# 12. Namespace Merging

TypeScript supports declaration merging for namespaces.

You can declare the same namespace multiple times, and TypeScript combines the declarations.

### Example

```typescript
namespace App {
    export function start(): void {
        console.log("Application started");
    }
}
```

Another declaration:

```typescript
namespace App {
    export function stop(): void {
        console.log("Application stopped");
    }
}
```

Now both functions are available:

```typescript
App.start();

App.stop();
```

### What happens?

TypeScript merges the declarations into one namespace.

Conceptually:

```typescript
namespace App {
    export function start(): void {}

    export function stop(): void {}
}
```

### Important rules

- Namespace declarations with the same name can merge.
- Exported members are accessible outside the namespace.
- Non-exported members remain private to their original declaration body.
- Not every declaration kind supports merging.

---

# 13. Declaration Merging

Declaration merging means TypeScript combines multiple declarations with the same name into a single definition.

We already studied namespace merging.

Now let's explore other forms.

TypeScript supports declaration merging for:

- Interfaces.
- Namespaces.
- Classes with namespaces.
- Functions with namespaces.
- Enums with namespaces.

### A. Interface merging

```typescript
interface User {
    name: string;
}

interface User {
    age: number;
}
```

Now TypeScript treats the interface as:

```typescript
interface User {
    name: string;
    age: number;
}
```

Usage:

```typescript
const user: User = {
    name: "Riyaz",
    age: 25
};
```

### Important rule

If two interfaces declare the same property, their declarations must be compatible.

For example:

```typescript
interface User {
    name: string;
}

interface User {
    name: number;
}
```

This produces an error.

### B. Namespace merging with a function

```typescript
function createUser(name: string) {
    return {
        name
    };
}

namespace createUser {
    export const version = "1.0";
}
```

Usage:

```typescript
const user = createUser("Riyaz");

console.log(createUser.version);
```

The namespace adds a property to the function's associated value.

### C. Namespace merging with a class

```typescript
class User {
    constructor(public name: string) {}
}

namespace User {
    export const role = "CUSTOMER";
}
```

Usage:

```typescript
const user = new User("Riyaz");

console.log(User.role);
```

### D. Namespace merging with an enum

```typescript
enum Direction {
    Up,
    Down
}

namespace Direction {
    export function reverse(direction: Direction): Direction {
        return direction === Direction.Up
            ? Direction.Down
            : Direction.Up;
    }
}
```

Usage:

```typescript
console.log(Direction.reverse(Direction.Up));
```

### Important

Declaration merging is a TypeScript type-system and declaration feature, but some combinations also have runtime JavaScript implications.

Do not assume that every merged declaration creates runtime functionality.

---

# 14. What Are Declaration Files?

A declaration file is a file with the `.d.ts` extension.

It describes the types of JavaScript code without containing the actual implementation.

For example:

```text
user.js
user.d.ts
```

The JavaScript file contains implementation.

The declaration file describes its types.

### Example JavaScript file

```javascript
// math.js

export function add(a, b) {
    return a + b;
}
```

### Declaration file

```typescript
// math.d.ts

export function add(a: number, b: number): number;
```

Now TypeScript can understand how to use the JavaScript function.

### Why are declaration files important?

They allow TypeScript to work with:

- JavaScript libraries.
- Third-party packages.
- Existing JavaScript projects.
- Browser APIs.
- Node.js APIs.
- Custom JavaScript modules.

### Important

A declaration file does not implement the function.

It only describes the function's type contract.

---

# 15. Understanding `.d.ts` Files in npm Packages

Many npm packages include TypeScript declaration files.

For example, a package may contain:

```text
node_modules/
│
└── some-package/
    │
    ├── package.json
    ├── index.js
    └── index.d.ts
```

The JavaScript file contains the actual implementation.

The `.d.ts` file provides type information.

### Example declaration

```typescript
export declare function connect(
    url: string
): Promise<boolean>;
```

The `declare` keyword tells TypeScript that the implementation exists elsewhere.

### Packages without built-in types

Some JavaScript packages do not provide their own TypeScript declarations.

In such cases, you may find community-maintained declarations through DefinitelyTyped.

Many packages are installed using:

```bash
npm install -D @types/package-name
```

Example:

```bash
npm install -D @types/lodash
```

This is not necessary for packages that already provide compatible types.

---

# 16. Ambient Declarations

An ambient declaration describes something that exists at runtime but whose implementation is not available in the current TypeScript source.

Use the `declare` keyword.

### Example

Suppose a JavaScript library provides:

```javascript
// utility.js

function greet(name) {
    return `Hello ${name}`;
}
```

You can describe it:

```typescript
declare function greet(name: string): string;
```

Now TypeScript understands:

```typescript
const message = greet("Riyaz");
```

### Important

The declaration does not create the function.

If the function does not exist at runtime, your program will still fail.

### Ambient class declaration

```typescript
declare class Database {
    connect(): Promise<void>;

    disconnect(): void;
}
```

This tells TypeScript that a `Database` class exists.

### Ambient variable declaration

```typescript
declare const API_URL: string;
```

Now TypeScript recognizes:

```typescript
console.log(API_URL);
```

But something else must provide the actual runtime variable.

### Ambient module declaration

You can describe an untyped module.

```typescript
declare module "legacy-library" {
    export function initialize(): void;

    export function shutdown(): void;
}
```

Now TypeScript understands:

```typescript
import {
    initialize,
    shutdown
} from "legacy-library";
```

The module must still exist at runtime.

---

# 17. Creating Custom Declaration Files

Let's create a practical declaration file.

Suppose you have an existing JavaScript utility.

### Project structure

```text
project/
│
├── src/
│   ├── app.ts
│   └── legacy.js
│
├── types/
│   └── legacy.d.ts
│
└── tsconfig.json
```

### legacy.js

```javascript
export function greet(name) {
    return `Hello ${name}`;
}

export function add(a, b) {
    return a + b;
}
```

### legacy.d.ts

```typescript
export function greet(name: string): string;

export function add(a: number, b: number): number;
```

### app.ts

```typescript
import {
    greet,
    add
} from "./legacy.js";

console.log(greet("Riyaz"));

console.log(add(10, 20));
```

TypeScript now understands the JavaScript functions.

### Important

Your `.d.ts` file must be discoverable by TypeScript.

A typical configuration includes:

```json
{
    "compilerOptions": {
        "strict": true,
        "allowJs": true,
        "checkJs": false
    },
    "include": [
        "src",
        "types"
    ]
}
```

For larger projects, you may organize declarations in a dedicated `types` directory.

---

# 18. Global Declarations

Sometimes you need to define global variables or types.

You can use global declaration files.

### Example

Create:

```text
src/
│
├── app.ts
└── global.d.ts
```

### global.d.ts

```typescript
declare global {
    var appName: string;

    interface Window {
        appVersion: string;
    }
}

export {};
```

### app.ts

```typescript
console.log(appName);
```

In a browser environment:

```typescript
window.appVersion = "1.0.0";
```

### Understanding `declare global`

It allows you to augment the global scope from within a module.

The final:

```typescript
export {};
```

makes the declaration file a module, allowing the `declare global` block.

### Important

A global declaration only tells TypeScript that something exists.

It does not create the runtime variable.

For example:

```typescript
declare var appName: string;
```

does not assign a value to `appName`.

Your application must define it.

---

# 19. Module Augmentation

Module augmentation allows you to extend the type declarations of an existing module.

This is useful when:

- A library is missing a property in its types.
- You add a custom property to an existing library object.
- You extend framework request or response types.
- You want to add custom functionality to a library.

### Example

Suppose you have:

```typescript
// user.ts

export interface User {
    name: string;
}
```

Now you want to add an `age` property to the `User` interface from another file.

### user-augmentation.d.ts

```typescript
import "./user.js";

declare module "./user.js" {
    interface User {
        age: number;
    }
}
```

Now TypeScript merges the interface declarations.

Usage:

```typescript
import type { User } from "./user.js";

const user: User = {
    name: "Riyaz",
    age: 25
};
```

### Important

Module augmentation changes the type declarations.

It does not automatically add runtime properties.

You still need to ensure the actual JavaScript object contains the property.

### Important restrictions

Module augmentation:

- Can augment existing declarations.
- Cannot introduce arbitrary new top-level declarations into the target module.
- Cannot augment default exports by directly naming `default`.
- Must use module resolution that identifies the intended module.

---

# 20. Real-World Example: Express Request Augmentation

This is a common backend TypeScript use case.

Suppose you use Express and want to attach an authenticated user to the request object.

You may need to extend the Express request type.

### Step 1: Install dependencies

```bash
npm install express
```

```bash
npm install -D typescript @types/express @types/node
```

### Step 2: Create a declaration file

```text
src/
│
├── app.ts
├── middleware/
│   └── auth.middleware.ts
└── types/
    └── express.d.ts
```

### Step 3: Define augmentation

```typescript
// src/types/express.d.ts

export {};

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
                role: string;
            };
        }
    }
}
```

This extends the existing Express `Request` interface through declaration merging.

### Step 4: Use the extended request type

```typescript
import express, {
    Request,
    Response
} from "express";

const app = express();

app.get(
    "/profile",
    (req: Request, res: Response) => {
        console.log(req.user?.email);

        res.json({
            user: req.user
        });
    }
);
```

TypeScript now recognizes:

```typescript
req.user
```

### Step 5: Populate the property in middleware

```typescript
import {
    Request,
    Response,
    NextFunction
} from "express";

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    req.user = {
        id: 1,
        email: "user@example.com",
        role: "ADMIN"
    };

    next();
}
```

### Important

The declaration file only changes TypeScript's understanding of `Request`.

The middleware is responsible for actually assigning the property.

Also, production authentication middleware must populate `req.user` only after verifying trusted credentials.

---

# 21. Declaration Merging vs Module Augmentation

These concepts are related, but they are not identical.

### Declaration merging

TypeScript combines multiple declarations with the same name.

Example:

```typescript
interface User {
    name: string;
}

interface User {
    age: number;
}
```

### Module augmentation

You add a declaration to an existing module from another module.

Example:

```typescript
import "some-library";

declare module "some-library" {
    interface User {
        age: number;
    }
}
```

### Comparison

| Declaration merging | Module augmentation |
|---|---|
| Combines compatible declarations | Extends declarations belonging to an existing module |
| Can happen in the same scope | Happens through a module augmentation declaration |
| Common with interfaces and namespaces | Common when extending third-party library types |
| Can apply to global declarations | Usually targets a specific module |

**Key takeaway:** Module augmentation uses TypeScript's declaration-merging behavior to extend a module's existing declarations.

---

# 22. Triple-Slash Directives

Triple-slash directives are special comments that provide compiler instructions.

They begin with:

```typescript
///
```

They are not ordinary JavaScript comments in terms of their TypeScript compiler meaning.

### A. Reference a declaration file

```typescript
/// <reference path="./types.d.ts" />
```

This tells TypeScript to include the referenced declaration file.

### B. Reference type packages

```typescript
/// <reference types="node" />
```

This tells TypeScript to include the specified type package.

### C. Reference a library

```typescript
/// <reference lib="es2022" />
```

This references a built-in TypeScript library declaration.

### D. No-default-lib directive

```typescript
/// <reference no-default-lib="true" />
```

This tells TypeScript that the file should not automatically include the default library declarations.

### Are triple-slash directives commonly needed?

Most modern projects use:

- `tsconfig.json`
- `include`
- `types`
- `typeRoots`
- Module imports

Triple-slash directives are more common in declaration files and specialized library projects.

---

# 23. `typeRoots`, `types`, and `include`

These three TypeScript configuration options are related to finding type declarations, but they have different purposes.

## A. `include`

Specifies which files and directories belong to the TypeScript project.

```json
{
    "include": [
        "src",
        "types"
    ]
}
```

## B. `typeRoots`

Specifies directories where TypeScript looks for type packages.

```json
{
    "compilerOptions": {
        "typeRoots": [
            "./node_modules/@types",
            "./types"
        ]
    }
}
```

When specified, it replaces the default type-root locations.

## C. `types`

Controls which visible `@types` packages are automatically included in the global scope.

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

### Comparison

| Option | Purpose |
|---|---|
| `include` | Selects project source and declaration files |
| `typeRoots` | Specifies directories containing type packages |
| `types` | Restricts automatically included ambient type packages |

### Important

These options do not mean exactly the same thing.

For example, a module imported directly in your code can still bring its own types into the program even when its package is not listed in the `types` option.

---

# 24. Understanding `skipLibCheck`

TypeScript includes a compiler option:

```json
{
    "compilerOptions": {
        "skipLibCheck": true
    }
}
```

It skips type checking of declaration files.

### Why use it?

Large projects may depend on many third-party declaration files.

Checking all declaration files can increase compilation time or expose errors in dependency typings.

`skipLibCheck` can improve build performance.

### Important

It does not mean TypeScript completely ignores the types of external libraries.

Your application still uses their declarations for type checking.

The option mainly skips checking the declaration files themselves for consistency errors.

### Recommendation

For many application projects, `skipLibCheck: true` is a practical choice.

For library authors or projects investigating declaration incompatibilities, checking declarations can be useful.

---

# 25. JavaScript Libraries Without Type Definitions

Suppose you install a JavaScript package:

```bash
npm install some-library
```

But TypeScript reports:

```text
Could not find a declaration file for module 'some-library'.
```

This means TypeScript cannot find suitable type information for the package.

There are several possible solutions.

### Solution 1: Check whether the package provides types

Inspect its `package.json`.

You may find:

```json
{
    "types": "./dist/index.d.ts"
}
```

or:

```json
{
    "typings": "./dist/index.d.ts"
}
```

### Solution 2: Install community types

```bash
npm install -D @types/some-library
```

Only do this if compatible community typings exist.

### Solution 3: Create your own declaration

Create:

```text
types/
└── some-library.d.ts
```

Content:

```typescript
declare module "some-library" {
    export function initialize(): void;

    export function getData(): string;
}
```

### Solution 4: Temporary untyped declaration

```typescript
declare module "some-library";
```

This tells TypeScript that the module exists, but it provides little type safety.

Imports from it will generally be treated as `any`.

**Best practice:** Prefer accurate declaration files instead of leaving entire dependencies untyped.

---

# 26. Understanding Module Augmentation with Third-Party Libraries

Let's consider another practical example.

Suppose a third-party library defines:

```typescript
export interface Configuration {
    port: number;
}
```

Your application wants to add a custom property.

You can augment it:

```typescript
import "some-library";

declare module "some-library" {
    interface Configuration {
        environment: "development" | "production";
    }
}
```

Now:

```typescript
import type { Configuration } from "some-library";

const config: Configuration = {
    port: 3000,
    environment: "development"
};
```

TypeScript recognizes the new property.

### Important

The third-party library's runtime implementation must also support the added property if your application expects the library itself to use it.

Type augmentation does not change the dependency's implementation.

---

# 27. Organizing a Professional TypeScript Project

Now let's combine the concepts.

Suppose you are building a Node.js Express application.

A possible project structure:

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
│   │   ├── user.model.ts
│   │   ├── user.service.ts
│   │   ├── user.controller.ts
│   │   ├── user.routes.ts
│   │   └── index.ts
│   │
│   └── products/
│       ├── product.model.ts
│       ├── product.service.ts
│       ├── product.controller.ts
│       ├── product.routes.ts
│       └── index.ts
│
├── middleware/
│   ├── auth.middleware.ts
│   └── error.middleware.ts
│
├── types/
│   └── express.d.ts
│
├── utils/
│   └── response.ts
│
├── app.ts
└── server.ts
│
├── dist/
├── package.json
└── tsconfig.json
```

### Example: user.model.ts

```typescript
export interface User {
    id: number;
    name: string;
    email: string;
}
```

### Example: user.service.ts

```typescript
import type { User } from "./user.model.js";

export class UserService {
    getUsers(): User[] {
        return [
            {
                id: 1,
                name: "Riyaz",
                email: "riyaz@example.com"
            }
        ];
    }
}
```

### Example: user.controller.ts

```typescript
import { UserService } from "./user.service.js";

export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    getUsers() {
        return this.userService.getUsers();
    }
}
```

### Example: users/index.ts

```typescript
export * from "./user.model.js";

export * from "./user.service.js";

export * from "./user.controller.js";
```

### Example: app.ts

```typescript
import {
    UserService,
    UserController
} from "./modules/users/index.js";

const userService = new UserService();

const userController = new UserController(userService);

console.log(userController.getUsers());
```

This structure separates responsibilities and makes the application easier to maintain.

---

# 28. Common Mistakes

### Mistake 1: Confusing named and default imports

Named export:

```typescript
export const name = "Riyaz";
```

Import:

```typescript
import { name } from "./user.js";
```

Default export:

```typescript
export default class User {}
```

Import:

```typescript
import User from "./user.js";
```

### Mistake 2: Importing types as runtime values

Prefer:

```typescript
import type { User } from "./user.js";
```

when the import is only needed for type checking.

### Mistake 3: Confusing CommonJS and ESM

Do not mix:

```javascript
require()
```

with:

```javascript
import
```

without understanding the module configuration and runtime interoperability.

### Mistake 4: Assuming `paths` rewrites imports

TypeScript path aliases do not automatically rewrite emitted JavaScript paths.

### Mistake 5: Assuming namespaces are the same as modules

Namespaces group declarations within a named scope.

ES modules organize code across files.

### Mistake 6: Assuming `.d.ts` files contain implementation

Declaration files describe types. They do not implement runtime behavior.

### Mistake 7: Forgetting that `declare` does not create values

Ambient declarations tell TypeScript something exists.

They do not create that variable, class, or function.

### Mistake 8: Assuming module augmentation changes runtime objects

It changes the type declarations only.

### Mistake 9: Using `any` unnecessarily in declaration files

Accurate declarations preserve type safety.

### Mistake 10: Overusing barrel files

Large barrel structures can cause circular dependencies and make imports harder to trace.

---

# 29. Interview Questions and Answers

### Q1. What is a module in TypeScript?

A module is an independent file that can export declarations and import functionality from other files.

### Q2. What is the difference between import and export?

`export` makes declarations available to other modules.

`import` allows a module to use exported declarations.

### Q3. What is the difference between named exports and default exports?

Named exports allow multiple exported declarations and use named imports.

A module can have one default export, which is imported without curly braces.

### Q4. What is a type-only import?

A type-only import imports declarations exclusively for type checking and does not require a runtime import.

### Q5. What is the difference between CommonJS and ESM?

CommonJS uses `require()` and `module.exports`.

ESM uses `import` and `export`.

### Q6. What is module resolution?

Module resolution is the process TypeScript uses to locate imported modules and their type information.

### Q7. What are namespaces?

Namespaces are TypeScript constructs used to group related declarations under one named scope.

### Q8. What is namespace merging?

Namespace merging occurs when multiple namespace declarations with the same name are combined.

### Q9. What is declaration merging?

Declaration merging is a TypeScript feature that combines compatible declarations with the same name.

### Q10. Can interfaces be merged?

Yes. Multiple interface declarations with the same name can be merged.

### Q11. What is a declaration file?

A `.d.ts` file describes the types of JavaScript code without providing its implementation.

### Q12. What is an ambient declaration?

An ambient declaration describes a runtime value or module that exists elsewhere.

### Q13. What does the `declare` keyword do?

It tells TypeScript that a declaration exists without providing its implementation.

### Q14. What is module augmentation?

Module augmentation extends the type declarations of an existing module.

### Q15. What is the difference between module augmentation and declaration merging?

Declaration merging combines compatible declarations with the same name.

Module augmentation extends declarations belonging to an existing module and relies on declaration merging.

### Q16. What is `typeRoots`?

It specifies directories where TypeScript searches for type packages.

### Q17. What is the purpose of the `types` option?

It controls which ambient `@types` packages are automatically included in the global scope.

### Q18. What is `skipLibCheck`?

It skips checking declaration files for type consistency errors, potentially improving compilation performance.

### Q19. What is DefinitelyTyped?

DefinitelyTyped is a community project that provides TypeScript declaration files for JavaScript libraries.

### Q20. What are triple-slash directives?

They are special TypeScript comments used to provide compiler instructions or references to declaration files and libraries.

### Q21. Does a `.d.ts` file create runtime functionality?

No. It provides type information only.

### Q22. Can TypeScript interfaces be inspected at runtime?

No. Interfaces are erased during compilation.

### Q23. Why do we use barrel files?

Barrel files re-export declarations from multiple modules through a central entry point.

### Q24. Does TypeScript's `paths` option rewrite runtime imports?

No. It helps TypeScript resolve imports, but the runtime or build tool must support the aliases.

### Q25. Can you augment a default export directly?

No. Module augmentation cannot directly target a default export by naming `default`. A named exported declaration or another supported extension point is needed.

---

# 30. Practical Exercises

Complete these exercises to strengthen your understanding.

## Exercise 1: Named Exports

Create a `math.ts` file with:

- `add()`
- `subtract()`
- `multiply()`
- `divide()`

Export all four functions and import them into `app.ts`.

## Exercise 2: Default Export

Create a `User` class and export it as the default export.

Import it into another file and create an instance.

## Exercise 3: Type-Only Imports

Create a `Product` interface in one file.

Import it using `import type` into another file.

## Exercise 4: Re-exporting

Create three modules:

- `user.model.ts`
- `user.service.ts`
- `user.controller.ts`

Create an `index.ts` barrel file that re-exports all three.

## Exercise 5: CommonJS vs ESM

Create a small example using CommonJS.

Then rewrite it using ESM.

Understand the differences in import and export syntax.

## Exercise 6: Namespace

Create a namespace called `DatabaseUtils` containing:

- `connect()`
- `disconnect()`
- `getStatus()`

## Exercise 7: Namespace Merging

Declare the same namespace twice and add different functions.

Verify that both functions are accessible.

## Exercise 8: Interface Declaration Merging

Declare a `User` interface twice.

Add different properties in each declaration.

Create an object satisfying the merged interface.

## Exercise 9: Custom Declaration File

Create a JavaScript utility library and write a corresponding `.d.ts` file.

Use the library from a TypeScript file.

## Exercise 10: Ambient Declarations

Declare a global variable named `APP_VERSION`.

Use it in your application.

Remember that the runtime value must be provided separately.

## Exercise 11: Module Augmentation

Create a module with a `User` interface.

Augment the interface from another declaration file by adding an `age` property.

## Exercise 12: Express Request Augmentation

Extend the Express `Request` interface with:

```typescript
user?: {
    id: number;
    email: string;
    role: string;
};
```

Use the new property inside a route handler.

## Exercise 13: Module Resolution

Configure a TypeScript project using:

- `NodeNext`
- `rootDir`
- `outDir`
- `strict`
- `verbatimModuleSyntax`

Compile and execute the application.

## Exercise 14: Path Aliases

Configure:

```text
@/users/*
@/products/*
@/utils/*
```

Make sure your runtime or bundler also supports these aliases.

## Exercise 15: Professional Project Structure

Create a small Express application with:

- `config`
- `modules`
- `middleware`
- `types`
- `utils`
- `app.ts`
- `server.ts`

Use named exports, type-only imports, and barrel files appropriately.

---

# 31. Phase 23 Completion Checklist

| No. | Topic | Status |
|---|---|---|
| 1 | Module fundamentals | ☐ |
| 2 | Named exports | ☐ |
| 3 | Named imports | ☐ |
| 4 | Default exports | ☐ |
| 5 | Re-exporting modules | ☐ |
| 6 | Barrel files | ☐ |
| 7 | Type-only imports | ☐ |
| 8 | Type-only exports | ☐ |
| 9 | CommonJS | ☐ |
| 10 | ECMAScript Modules | ☐ |
| 11 | Module configuration | ☐ |
| 12 | Module resolution | ☐ |
| 13 | Path aliases | ☐ |
| 14 | Namespaces | ☐ |
| 15 | Nested namespaces | ☐ |
| 16 | Namespace merging | ☐ |
| 17 | Declaration merging | ☐ |
| 18 | Declaration files | ☐ |
| 19 | Ambient declarations | ☐ |
| 20 | Global declarations | ☐ |
| 21 | Module augmentation | ☐ |
| 22 | Triple-slash directives | ☐ |
| 23 | `typeRoots` | ☐ |
| 24 | `types` | ☐ |
| 25 | `skipLibCheck` | ☐ |
| 26 | DefinitelyTyped | ☐ |
| 27 | Custom declaration files | ☐ |
| 28 | Express Request augmentation | ☐ |
| 29 | Professional project organization | ☐ |

---

# What Comes Next?

## Phase 24: Advanced TypeScript – TypeScript Compiler, Type Checking, and Compiler Internals

In the next phase, we will understand how TypeScript works internally.

Topics will include:

1. TypeScript compiler architecture.
2. Lexical analysis and parsing.
3. Abstract Syntax Trees (AST).
4. Binding and symbol tables.
5. Type checking.
6. Type inference internals.
7. Control-flow analysis.
8. Type erasure.
9. JavaScript code generation.
10. Compiler diagnostics.
11. TypeScript compiler API.
12. Program and SourceFile objects.
13. TypeChecker API.
14. AST traversal.
15. Writing a basic TypeScript analysis tool.
16. Compiler performance.
17. Incremental compilation.
18. Build mode and project references.

**Phase 23 complete.** Say **"OK, Phase 24"** when you're ready to continue.