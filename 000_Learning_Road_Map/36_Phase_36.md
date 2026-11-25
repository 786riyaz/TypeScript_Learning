# Phase 36: TypeScript with Node.js – Advanced Backend Development

**Level:** Advanced to Expert  
**Prerequisites:** TypeScript fundamentals, Node.js, Express.js, JavaScript async/await, TypeScript interfaces, generics, modules, SQL, and MongoDB.

---

# 1. Learning Objectives

By the end of this phase, you will understand how to build production-ready backend applications using Node.js, Express.js, and TypeScript.

You will learn:

1. Setting up a Node.js TypeScript project.
2. Understanding TypeScript in the Node.js runtime.
3. Building REST APIs with Express and TypeScript.
4. Controllers, Services, and Repositories.
5. Advanced middleware.
6. Request and Response typing.
7. Custom Express Request types.
8. Authentication and authorization.
9. JWT authentication.
10. Password hashing.
11. Database integration.
12. Sequelize with TypeScript.
13. MongoDB and Mongoose with TypeScript.
14. Runtime validation using Zod.
15. Centralized error handling.
16. File uploads.
17. Pagination, sorting, and filtering.
18. Swagger API documentation.
19. Backend security.
20. Performance optimization.
21. Testing backend applications.
22. Production deployment.

---

# 2. Understanding TypeScript with Node.js

First, let's understand how TypeScript works with Node.js.

Node.js executes JavaScript code. TypeScript is a superset of JavaScript that adds a static type system.

TypeScript code generally needs to be transformed into JavaScript before execution.

### Example

**TypeScript:**

```typescript
function calculateTotal(price: number, quantity: number): number {
    return price * quantity;
}

console.log(calculateTotal(100, 5));
```

**Compiled JavaScript:**

```javascript
function calculateTotal(price, quantity) {
    return price * quantity;
}

console.log(calculateTotal(100, 5));
```

Notice that TypeScript types are removed during compilation.

### Execution Flow

```text
TypeScript Source Code
        |
        v
    TypeScript Compiler
        |
        v
    JavaScript Output
        |
        v
      Node.js
        |
        v
    Application Runs
```

### Important Concepts

| Concept | Description |
|---|---|
| TypeScript | Adds static typing to JavaScript |
| TypeScript Compiler | Converts TypeScript into JavaScript |
| Node.js | Executes JavaScript |
| @types/node | Provides TypeScript definitions for Node.js APIs |
| tsconfig.json | Configures TypeScript compilation |

**Important:** TypeScript types do not exist at runtime. They cannot validate incoming API requests or database data automatically.

---

# 3. Setting Up a Node.js TypeScript Project

Let's create a new backend project.

### Step 1: Create a Project

```bash
mkdir typescript-backend
cd typescript-backend

npm init -y
```

### Step 2: Install Dependencies

Install TypeScript and Node.js type definitions:

```bash
npm install -D typescript @types/node
```

Install Express:

```bash
npm install express
npm install -D @types/express
```

Install development tools:

```bash
npm install -D tsx
```

### Step 3: Initialize TypeScript

```bash
npx tsc --init
```

### Step 4: Project Structure

```text
typescript-backend/
│
├── src/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── middlewares/
│   ├── models/
│   ├── utils/
│   ├── config/
│   │
│   ├── app.ts
│   └── server.ts
│
├── dist/
│
├── package.json
├── tsconfig.json
└── .env
```

### Step 5: Configure tsconfig.json

For a Node.js project using modern ECMAScript modules:

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

    "sourceMap": true,
    "declaration": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

For this configuration, add the following to `package.json`:

```json
{
  "type": "module"
}
```

**Important:** With NodeNext and native Node.js ESM, relative imports generally need to use the emitted JavaScript extension.

For example, in `server.ts`:

```typescript
import app from "./app.js";
```

Although the source file is `app.ts`, the import uses `.js` because that is the extension of the compiled output.

### Step 6: Configure package.json Scripts

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

### Understanding the Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Runs TypeScript during development |
| `npm run build` | Compiles TypeScript into JavaScript |
| `npm start` | Runs compiled JavaScript |
| `npm run typecheck` | Checks types without generating output |

**Important:** `tsx` executes TypeScript through a development-time transformation mechanism. It is not the same as compiling your project with `tsc`.

For production, a common approach is to compile using `tsc` and execute the generated JavaScript.

---

# 4. Node.js Global Objects and TypeScript Types

Node.js provides several global objects and APIs.

Examples:

- `process`
- `Buffer`
- `console`
- `setTimeout`
- `setInterval`
- `__dirname` (in CommonJS)
- `__filename` (in CommonJS)

TypeScript needs definitions for these APIs.

That's why we install:

```bash
npm install -D @types/node
```

### 4.1 Understanding process

The `process` object provides information and control over the current Node.js process.

```typescript
console.log(process.version);

console.log(process.platform);

console.log(process.cwd());

console.log(process.pid);
```

| Property | Description |
|---|---|
| `process.version` | Node.js version |
| `process.platform` | Operating system platform |
| `process.cwd()` | Current working directory |
| `process.pid` | Process ID |
| `process.env` | Environment variables |
| `process.exit()` | Terminates the process |

### 4.2 Environment Variables

Environment variables store configuration outside your source code.

Example:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=mysql://localhost:3306/mydb
JWT_SECRET=my-secret
```

Access them using:

```typescript
const port = process.env.PORT;

console.log(port);
```

However, there is an important TypeScript detail.

```typescript
const port: string | undefined = process.env.PORT;
```

Why?

Because an environment variable might not exist.

### Providing a Default Value

```typescript
const port = process.env.PORT || "5000";
```

A better approach for numeric values:

```typescript
const port = Number(process.env.PORT ?? 5000);
```

However, this does not automatically guarantee that the value is a valid port number. Production applications should validate environment variables during startup.

We will use Zod for that later.

---

# 5. Creating an Express Application with TypeScript

Now let's create our first Express application.

### app.ts

```typescript
import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("TypeScript Backend API");
});

export default app;
```

### server.ts

```typescript
import app from "./app.js";

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

Run:

```bash
npm run dev
```

Open:

```text
http://localhost:5000
```

Output:

```text
TypeScript Backend API
```

### Why Separate app.ts and server.ts?

This is an important backend architecture practice.

**app.ts:**
- Creates the Express application.
- Registers middleware.
- Registers routes.
- Configures error handling.

**server.ts:**
- Starts the HTTP server.
- Connects infrastructure if required.
- Handles process-level startup and shutdown.

This separation makes it easier to test the Express application without opening a network port.

---

# 6. Understanding Express Request and Response Types

Express provides built-in TypeScript types through `@types/express`.

The most commonly used types are:

```typescript
Request
Response
NextFunction
RequestHandler
```

### 6.1 Request

The `Request` object contains information about an incoming HTTP request.

```typescript
import { Request, Response } from "express";

function getUsers(req: Request, res: Response) {
    res.json({
        message: "Users fetched successfully"
    });
}
```

The request contains:

| Property | Purpose |
|---|---|
| `req.params` | Route parameters |
| `req.query` | Query parameters |
| `req.body` | Request body |
| `req.headers` | HTTP headers |
| `req.method` | HTTP method |
| `req.path` | Request path |
| `req.ip` | Request IP address, subject to proxy configuration |

### 6.2 Response

The `Response` object is used to send responses to clients.

```typescript
function getUser(req: Request, res: Response) {
    res.status(200).json({
        id: 1,
        name: "John"
    });
}
```

### 6.3 NextFunction

`NextFunction` passes control to the next middleware or error handler.

```typescript
import {
    Request,
    Response,
    NextFunction
} from "express";

function middleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log("Middleware executed");

    next();
}
```

---

# 7. Advanced Request and Response Typing

Express allows us to define the types of route parameters, response bodies, request bodies, and query parameters.

The generic structure of `Request` is:

```typescript
Request<
    Params,
    ResBody,
    ReqBody,
    ReqQuery
>
```

Let's understand each parameter.

| Generic | Purpose |
|---|---|
| `Params` | Type of route parameters |
| `ResBody` | Type of response body |
| `ReqBody` | Type of request body |
| `ReqQuery` | Type of query parameters |

### Example 1: Typing Route Parameters

Consider this API:

```text
GET /users/101
```

Here, `101` is a route parameter.

```typescript
import { Request, Response } from "express";

interface UserParams {
    id: string;
}

function getUser(
    req: Request<UserParams>,
    res: Response
) {
    const userId = req.params.id;

    res.json({
        userId
    });
}
```

Now TypeScript understands that `req.params.id` is a string.

### Example 2: Typing Request Body

Consider:

```text
POST /users
```

Request body:

```json
{
    "name": "John",
    "email": "john@example.com",
    "age": 25
}
```

Define an interface:

```typescript
interface CreateUserDTO {
    name: string;
    email: string;
    age: number;
}
```

Use it in the request:

```typescript
function createUser(
    req: Request<
        {},
        {},
        CreateUserDTO
    >,
    res: Response
) {
    const { name, email, age } = req.body;

    res.status(201).json({
        name,
        email,
        age
    });
}
```

**Important:** This only provides compile-time typing. It does not validate the actual JSON sent by the client.

A client can still send:

```json
{
    "name": 123,
    "email": "invalid",
    "age": "twenty"
}
```

We will solve this using Zod.

### Example 3: Typing Query Parameters

Consider:

```text
GET /users?page=1&limit=10
```

Define:

```typescript
interface UserQuery {
    page?: string;
    limit?: string;
}
```

Use:

```typescript
function getUsers(
    req: Request<
        {},
        {},
        {},
        UserQuery
    >,
    res: Response
) {
    const page = Number(req.query.page ?? 1);

    const limit = Number(req.query.limit ?? 10);

    res.json({
        page,
        limit
    });
}
```

Remember that query parameters normally arrive as strings, not numbers.

---

# 8. Understanding DTOs in TypeScript

DTO stands for **Data Transfer Object**.

A DTO defines the structure of data transferred between different parts of an application.

For example, when a client creates a user, it might send:

```json
{
    "name": "John",
    "email": "john@example.com",
    "password": "password123"
}
```

We can define:

```typescript
interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}
```

### Why Use DTOs?

DTOs help us:

1. Define API request structures.
2. Control which fields clients can submit.
3. Separate API contracts from database models.
4. Avoid exposing sensitive database fields.
5. Maintain consistent data structures.

### DTO vs Entity

| DTO | Entity |
|---|---|
| Represents transferred data | Represents a domain or persistence object |
| Used at API boundaries | Used in business/domain or database layers |
| May contain only selected fields | May contain internal properties |
| Can exclude passwords or internal IDs | May contain sensitive/internal fields |

Example:

```typescript
// DTO
interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}

// User entity
interface User {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
}
```

Notice that the DTO contains a plain password because that is what the client submits, while the entity stores a password hash.

Never store the plain password in the database.

---

# 9. Understanding Backend Architecture

A professional backend application should not contain all its logic inside route handlers.

Instead, we can divide the application into different layers.

The most common structure is:

```text
Client
  |
  v
Routes
  |
  v
Controllers
  |
  v
Services
  |
  v
Repositories
  |
  v
Database
```

Let's understand each layer.

### 9.1 Routes

Routes define API endpoints.

Example:

```typescript
router.get("/users", getUsers);
router.post("/users", createUser);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
```

### 9.2 Controllers

Controllers handle HTTP requests and responses.

Their responsibilities include:

- Reading request data.
- Calling service methods.
- Returning HTTP responses.
- Passing errors to error-handling middleware.

Example:

```typescript
import { Request, Response, NextFunction } from "express";

export async function getUsers(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const users = await userService.getAllUsers();

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        next(error);
    }
}
```

### 9.3 Services

Services contain business logic.

Example:

```typescript
class UserService {
    async getAllUsers() {
        // Business logic
        return [
            {
                id: 1,
                name: "John"
            }
        ];
    }
}

export const userService = new UserService();
```

### 9.4 Repositories

Repositories handle database operations.

Example:

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}

class UserRepository {
    async findAll(): Promise<User[]> {
        // Database query goes here

        return [];
    }
}

export const userRepository = new UserRepository();
```

### Why Separate These Layers?

Consider a user registration API.

Without separation:

```text
Route Handler
    |
    |-- Validate input
    |-- Check email
    |-- Hash password
    |-- Insert into database
    |-- Generate response
```

With separation:

```text
Route
  |
  v
Controller
  |
  v
User Service
  |
  |-- Business validation
  |-- Password hashing
  |-- Registration rules
  |
  v
User Repository
  |
  v
Database
```

This architecture improves:

- Maintainability.
- Testability.
- Reusability.
- Separation of concerns.
- Code organization.

**Important:** A repository layer is an architectural choice, not a mandatory requirement for every application. It is particularly useful when database access needs to be isolated from business logic.

---

# 10. Advanced Express Middleware with TypeScript

Middleware functions execute during the request-response lifecycle.

Common middleware includes:

- Authentication middleware.
- Authorization middleware.
- Validation middleware.
- Logging middleware.
- Rate-limiting middleware.
- Error-handling middleware.

### Example: Request Logging Middleware

```typescript
import {
    Request,
    Response,
    NextFunction
} from "express";

function requestLogger(
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log({
        method: req.method,
        url: req.originalUrl,
        time: new Date()
    });

    next();
}

export default requestLogger;
```

Register it:

```typescript
app.use(requestLogger);
```

### Example: Authentication Middleware

```typescript
import {
    Request,
    Response,
    NextFunction
} from "express";

function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.headers.authorization;

    if (!token) {
        res.status(401).json({
            message: "Authentication required"
        });

        return;
    }

    next();
}
```

This is only a basic illustration. A real authentication middleware must verify the token cryptographically rather than simply checking whether a header exists.

### Understanding Middleware Execution Order

```typescript
app.use(express.json());

app.use(requestLogger);

app.use("/api/users", userRoutes);

app.use(errorHandler);
```

The order matters.

Express executes middleware in the order in which it is registered.

---

# 11. Custom Request Types and Module Augmentation

Sometimes we need to attach custom properties to the Express request object.

For example, after authentication, we may want to attach the authenticated user's information.

```typescript
req.user = {
    id: 101,
    email: "john@example.com",
    role: "admin"
};
```

However, TypeScript does not know that `req.user` exists by default.

We can solve this using **Module Augmentation**.

### Step 1: Create a Custom Type Declaration

Create:

```text
src/types/express.d.ts
```

Add:

```typescript
declare global {
    namespace Express {
        interface User {
            id: number;
            email: string;
            role: "admin" | "user";
        }

        interface Request {
            user?: User;
        }
    }
}

export {};
```

### Step 2: Use It in Middleware

```typescript
import {
    Request,
    Response,
    NextFunction
} from "express";

function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    req.user = {
        id: 101,
        email: "john@example.com",
        role: "admin"
    };

    next();
}
```

### Step 3: Access It in Controllers

```typescript
function getProfile(
    req: Request,
    res: Response
) {
    if (!req.user) {
        res.status(401).json({
            message: "Unauthorized"
        });

        return;
    }

    res.json({
        user: req.user
    });
}
```

### What Is Module Augmentation?

Module augmentation allows us to extend the types of an existing module.

In this example, we extended Express's existing `Request` interface.

**Important:** Module augmentation only changes TypeScript's understanding of the type. It does not automatically create `req.user` at runtime. Authentication middleware must assign the property.

---

# 12. Runtime Validation with Zod

This is one of the most important topics in professional TypeScript backend development.

Remember:

**TypeScript checks types during development and compilation. It does not validate untrusted runtime input.**

Consider an API expecting:

```typescript
interface CreateUserDTO {
    name: string;
    email: string;
    age: number;
}
```

A client can still send invalid data.

We need runtime validation.

One popular solution is Zod.

### Step 1: Install Zod

```bash
npm install zod
```

### Step 2: Create a Schema

```typescript
import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string().min(3),

    email: z.string().email(),

    age: z.number().min(18)
});
```

This schema defines runtime validation rules.

### Step 3: Infer the Type

```typescript
export type CreateUserDTO =
    z.infer<typeof createUserSchema>;
```

Now we have both:

- Runtime validation.
- Compile-time TypeScript types.

This avoids maintaining a separate interface with the same fields.

### Step 4: Validate Request Data

```typescript
import { Request, Response } from "express";

function createUser(req: Request, res: Response) {
    const result = createUserSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            errors: result.error.issues
        });

        return;
    }

    const userData = result.data;

    res.status(201).json({
        message: "User created",
        user: userData
    });
}
```

### Understanding safeParse()

`safeParse()` returns a discriminated union.

On success:

```typescript
{
    success: true,
    data: ...
}
```

On failure:

```typescript
{
    success: false,
    error: ...
}
```

TypeScript automatically narrows the result based on the `success` property.

### parse() vs safeParse()

| parse() | safeParse() |
|---|---|
| Returns validated data | Returns a result object |
| Throws an error if validation fails | Does not throw for validation failure |
| Useful when exceptions are desired | Useful for explicit validation handling |

### Step 5: Create Reusable Validation Middleware

```typescript
import {
    Request,
    Response,
    NextFunction
} from "express";

import { ZodSchema } from "zod";

function validateBody(schema: ZodSchema) {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({
                message: "Validation failed",
                errors: result.error.issues
            });

            return;
        }

        req.body = result.data;

        next();
    };
}

export default validateBody;
```

Use it:

```typescript
router.post(
    "/users",
    validateBody(createUserSchema),
    createUser
);
```

### Why Is Zod Important?

Zod is useful for validating:

- Request bodies.
- Route parameters.
- Query parameters.
- Environment variables.
- Configuration objects.
- External API responses.

---

# 13. Authentication vs Authorization

These two concepts are related but different.

### Authentication

Authentication answers:

**Who are you?**

Example:

A user logs in using an email and password.

The backend verifies their credentials and establishes their authenticated identity.

### Authorization

Authorization answers:

**What are you allowed to do?**

Example:

An authenticated user may view their profile but cannot delete another user's account.

### Comparison

| Authentication | Authorization |
|---|---|
| Verifies identity | Checks permissions |
| Happens before protected access | Happens after identity is established |
| Login and token verification | Roles and permissions |
| Answers who you are | Answers what you can do |

Typical authentication mechanisms include:

- Session-based authentication.
- JWT-based authentication.
- OAuth 2.0 / OpenID Connect.

---

# 14. Password Hashing with TypeScript

Passwords must never be stored as plain text.

Suppose a user registers with:

```text
password123
```

We should store a password hash rather than the original password.

A password-hashing algorithm transforms the password into a one-way representation.

Popular options include:

- Argon2id.
- bcrypt.

### Example Using bcrypt

Install:

```bash
npm install bcrypt
npm install -D @types/bcrypt
```

### Hash Password

```typescript
import bcrypt from "bcrypt";

async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12;

    const hashedPassword = await bcrypt.hash(
        password,
        saltRounds
    );

    return hashedPassword;
}
```

Usage:

```typescript
const password = "password123";

const hashedPassword = await hashPassword(password);

console.log(hashedPassword);
```

### Compare Password

During login:

```typescript
async function verifyPassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}
```

Usage:

```typescript
const isValid = await verifyPassword(
    "password123",
    hashedPassword
);

console.log(isValid);
```

### Important Points

1. Never store plain-text passwords.
2. Never encrypt passwords reversibly instead of hashing them.
3. Use an established password-hashing algorithm.
4. Never expose password hashes through API responses.
5. Store secrets outside source code.
6. Apply reasonable password policies and rate limits to login attempts.

For new systems, Argon2id is also an excellent password-hashing choice.

---

# 15. JWT Authentication with TypeScript

JWT stands for **JSON Web Token**.

JWT is a compact token format commonly used for transmitting claims between systems.

A JWT generally consists of three parts:

```text
Header.Payload.Signature
```

### 15.1 JWT Structure

Example:

```text
xxxxx.yyyyy.zzzzz
```

| Part | Purpose |
|---|---|
| Header | Contains token metadata, such as signing algorithm |
| Payload | Contains claims |
| Signature | Protects token integrity |

**Important:** A normal signed JWT is not encrypted. Its payload can be decoded and read. Do not store passwords or other secrets inside it.

### 15.2 Install JWT Library

```bash
npm install jsonwebtoken
npm install -D @types/jsonwebtoken
```

### 15.3 Generate JWT

```typescript
import jwt from "jsonwebtoken";

interface TokenPayload {
    id: number;
    email: string;
    role: "admin" | "user";
}

function generateToken(user: TokenPayload): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is missing");
    }

    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        secret,
        {
            expiresIn: "15m"
        }
    );
}
```

### 15.4 Verify JWT

```typescript
import jwt from "jsonwebtoken";

function verifyToken(token: string) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is missing");
    }

    return jwt.verify(token, secret);
}
```

The returned value can be a string or a decoded JWT payload. If you need a specific payload type, validate or narrow it rather than blindly asserting its type.

### 15.5 Authentication Middleware

```typescript
import {
    Request,
    Response,
    NextFunction
} from "express";

import jwt from "jsonwebtoken";

function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            res.status(401).json({
                message: "Authentication token required"
            });

            return;
        }

        const token = authHeader.split(" ")[1];

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error("JWT_SECRET is missing");
        }

        const decoded = jwt.verify(token, secret);

        // Validate and assign the decoded identity here.
        // A production implementation should validate
        // the expected payload structure.

        req.user = decoded as Express.User;

        next();

    } catch {
        res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}
```

The assertion above is illustrative, not a substitute for payload validation. A production implementation should validate the decoded claims before assigning them to `req.user`.

### 15.6 Access Tokens and Refresh Tokens

Many production applications use two types of tokens.

| Access Token | Refresh Token |
|---|---|
| Short-lived | Longer-lived |
| Used to access APIs | Used to obtain new access tokens |
| Sent with protected API requests | Sent to refresh endpoint |
| Usually expires quickly | Requires careful storage and rotation |

A secure refresh-token system should consider:

- Refresh-token rotation.
- Token revocation.
- Secure storage.
- Expiration.
- Reuse detection.

For browser applications, an `HttpOnly`, `Secure`, and appropriately configured `SameSite` cookie is often suitable for refresh tokens. Cookie-based authentication also requires consideration of CSRF protection.

---

# 16. Role-Based Access Control (RBAC)

RBAC stands for **Role-Based Access Control**.

It allows us to assign permissions based on user roles.

Example roles:

```typescript
type Role = "admin" | "manager" | "user";
```

Different roles can have different permissions.

| Feature | Admin | Manager | User |
|---|---|---|---|
| View profile | Yes | Yes | Yes |
| Create users | Yes | Yes | No |
| Delete users | Yes | No | No |
| Manage system | Yes | No | No |

### Create Authorization Middleware

```typescript
import {
    Request,
    Response,
    NextFunction
} from "express";

type Role = "admin" | "manager" | "user";

function authorize(...allowedRoles: Role[]) {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        if (!req.user) {
            res.status(401).json({
                message: "Unauthorized"
            });

            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                message: "Forbidden"
            });

            return;
        }

        next();
    };
}
```

Usage:

```typescript
router.delete(
    "/users/:id",
    authenticate,
    authorize("admin"),
    deleteUser
);
```

### 401 vs 403

| Status | Meaning |
|---|---|
| 401 Unauthorized | Authentication is missing or invalid |
| 403 Forbidden | User is authenticated but lacks permission |

This distinction is frequently asked in backend interviews.

---

# 17. Database Integration with TypeScript

A backend application usually communicates with a database.

Common databases include:

| Database | Type |
|---|---|
| MySQL | Relational |
| PostgreSQL | Relational |
| MongoDB | Document-oriented |
| SQLite | Relational |

TypeScript can work with all of these through suitable database drivers and ORMs.

An ORM stands for **Object-Relational Mapping**.

It allows developers to interact with relational databases through objects and models instead of writing every SQL query manually.

Popular tools:

- Sequelize.
- Prisma.
- TypeORM.
- Drizzle ORM.

For MongoDB, Mongoose is commonly used.

---

# 18. Sequelize with TypeScript

Since Sequelize is commonly used in Node.js applications, let's understand its TypeScript integration.

### Step 1: Install Dependencies

```bash
npm install sequelize mysql2
```

### Step 2: Configure Database Connection

Create:

```text
src/config/database.ts
```

```typescript
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    "my_database",
    "root",
    "password",
    {
        host: "localhost",
        dialect: "mysql",
        logging: false
    }
);

export default sequelize;
```

For a real application, read database credentials from validated environment variables rather than hardcoding them.

### Step 3: Define User Model

Create:

```text
src/models/user.model.ts
```

```typescript
import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional
} from "sequelize";

import sequelize from "../config/database.js";

class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
    declare id: CreationOptional<number>;

    declare name: string;

    declare email: string;

    declare passwordHash: string;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: "users",
        timestamps: true
    }
);

export default User;
```

### Understanding Important Sequelize Types

| Type | Purpose |
|---|---|
| `Model` | Base class for Sequelize models |
| `InferAttributes` | Infers model attributes |
| `InferCreationAttributes` | Infers attributes used during creation |
| `CreationOptional` | Marks an attribute optional during creation |
| `DataTypes` | Defines database column types |

### Step 4: Create a User

```typescript
const user = await User.create({
    name: "John",
    email: "john@example.com",
    passwordHash: "hashed_password"
});
```

The `id` field is optional because the database generates it.

### Step 5: Fetch Users

```typescript
const users = await User.findAll();

console.log(users);
```

### Step 6: Find a User by ID

```typescript
const user = await User.findByPk(1);

if (!user) {
    throw new Error("User not found");
}
```

### Step 7: Update a User

```typescript
const user = await User.findByPk(1);

if (!user) {
    throw new Error("User not found");
}

await user.update({
    name: "Updated Name"
});
```

### Step 8: Delete a User

```typescript
const user = await User.findByPk(1);

if (!user) {
    throw new Error("User not found");
}

await user.destroy();
```

### Important Sequelize Concepts

You should also understand:

1. Models.
2. Associations.
3. One-to-One relationships.
4. One-to-Many relationships.
5. Many-to-Many relationships.
6. Transactions.
7. Migrations.
8. Hooks.
9. Scopes.
10. Eager loading.
11. Lazy loading.
12. Connection pooling.

**Important:** Use migrations to manage database schema changes in production. Do not depend on automatically synchronizing a production schema with `sync({ alter: true })`.

---

# 19. MongoDB and Mongoose with TypeScript

Mongoose is an ODM (Object Data Modeling) library for MongoDB.

It provides:

- Schema definitions.
- Models.
- Validation.
- Middleware/hooks.
- Query APIs.
- Relationships through references.

### Step 1: Install Dependencies

```bash
npm install mongoose
```

### Step 2: Connect to MongoDB

```typescript
import mongoose from "mongoose";

async function connectDatabase(): Promise<void> {
    await mongoose.connect(
        process.env.MONGODB_URI!
    );

    console.log("MongoDB connected");
}

export default connectDatabase;
```

The non-null assertion (`!`) only tells TypeScript to assume the value exists. It does not validate the environment variable. Validate it before connecting.

### Step 3: Define User Schema

```typescript
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        passwordHash: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);
```

### Step 4: Infer the Type

```typescript
type User = mongoose.InferSchemaType<typeof userSchema>;
```

This derives a TypeScript type from the schema.

### Step 5: Create Model

```typescript
const UserModel = mongoose.model("User", userSchema);

export default UserModel;
```

### Step 6: Create User

```typescript
const user = await UserModel.create({
    name: "John",
    email: "john@example.com",
    passwordHash: "hashed_password"
});
```

### Step 7: Find Users

```typescript
const users = await UserModel.find();
```

### Step 8: Find by ID

```typescript
const user = await UserModel.findById("some-id");

if (!user) {
    throw new Error("User not found");
}
```

### Sequelize vs Mongoose

| Sequelize | Mongoose |
|---|---|
| ORM | ODM |
| Primarily for relational databases | For MongoDB |
| Models represent tables | Models represent collections |
| Records are rows | Documents are stored in collections |
| Supports SQL relationships | Supports document references and population |
| Supports SQL transactions | Supports MongoDB transactions |

**Important:** TypeScript types and Mongoose schema validation serve different purposes. TypeScript provides static type checking; Mongoose validates documents at runtime according to its schema.

---

# 20. Database Transactions

A transaction is a group of database operations treated as one logical unit.

Consider a bank transfer.

Suppose we transfer ₹1,000 from Account A to Account B.

Two operations are required:

1. Deduct ₹1,000 from Account A.
2. Add ₹1,000 to Account B.

What happens if the first operation succeeds but the second fails?

The database could become inconsistent.

A transaction solves this problem.

### ACID Properties

| Property | Meaning |
|---|---|
| Atomicity | All operations succeed or fail together |
| Consistency | Data remains valid |
| Isolation | Concurrent transactions are controlled |
| Durability | Committed changes persist |

### Sequelize Transaction Example

```typescript
import sequelize from "./config/database.js";
import Account from "./models/account.model.js";

async function transferMoney(
    fromId: number,
    toId: number,
    amount: number
) {
    const transaction = await sequelize.transaction();

    try {
        const fromAccount = await Account.findByPk(
            fromId,
            { transaction }
        );

        const toAccount = await Account.findByPk(
            toId,
            { transaction }
        );

        if (!fromAccount || !toAccount) {
            throw new Error("Account not found");
        }

        if (fromAccount.balance < amount) {
            throw new Error("Insufficient balance");
        }

        await fromAccount.decrement("balance", {
            by: amount,
            transaction
        });

        await toAccount.increment("balance", {
            by: amount,
            transaction
        });

        await transaction.commit();

    } catch (error) {
        await transaction.rollback();

        throw error;
    }
}
```

This is a simplified illustration. Production financial operations also need appropriate locking or concurrency controls, amount validation, and idempotency considerations.

### Why Are Transactions Important?

They are useful for:

- Financial operations.
- Order creation.
- Inventory management.
- Multi-table updates.
- Payment processing.
- Critical business operations.

---

# 21. File Uploads with TypeScript

Many backend applications need file uploads.

Examples:

- Profile pictures.
- Documents.
- Product images.
- Resume uploads.
- Videos.

A popular Express middleware for handling multipart uploads is Multer.

### Step 1: Install Multer

```bash
npm install multer
npm install -D @types/multer
```

### Step 2: Configure Multer

```typescript
import multer from "multer";

const storage = multer.diskStorage({
    destination: "./uploads",

    filename: (req, file, callback) => {
        const uniqueName =
            `${Date.now()}-${file.originalname}`;

        callback(null, uniqueName);
    }
});

const upload = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

export default upload;
```

This limits file size to 5 MB.

### Step 3: Create Upload Route

```typescript
import express from "express";
import upload from "./middlewares/upload.js";

const router = express.Router();

router.post(
    "/upload",
    upload.single("file"),
    (req, res) => {
        if (!req.file) {
            res.status(400).json({
                message: "File is required"
            });

            return;
        }

        res.json({
            message: "File uploaded",
            filename: req.file.filename
        });
    }
);
```

### Understanding Multer Methods

| Method | Purpose |
|---|---|
| `single()` | Upload one file |
| `array()` | Upload multiple files using the same field |
| `fields()` | Upload files from multiple fields |
| `none()` | Accept only text fields |

### File Upload Security

Never trust the uploaded file blindly.

You should:

1. Restrict allowed file types.
2. Limit file sizes.
3. Generate safe server-side filenames.
4. Validate actual file content where appropriate.
5. Avoid executable upload directories.
6. Store sensitive uploads outside public directories.
7. Consider malware scanning.
8. Use object storage such as S3 or Cloudinary where appropriate.

**Important:** `file.mimetype` is supplied through the upload request and can be spoofed. It is not sufficient by itself to establish that a file is safe.

---

# 22. Pagination, Sorting, and Filtering

When an API returns thousands of records, returning everything at once is inefficient.

Pagination divides records into smaller groups.

Consider:

```text
GET /users?page=1&limit=10
```

This requests the first 10 users.

### 22.1 Offset-Based Pagination

Formula:

```text
offset = (page - 1) * limit
```

Example:

```typescript
const page = 2;
const limit = 10;

const offset = (page - 1) * limit;

console.log(offset); // 10
```

### 22.2 Sequelize Pagination

```typescript
const page = 1;
const limit = 10;

const offset = (page - 1) * limit;

const users = await User.findAndCountAll({
    limit,
    offset
});
```

### 22.3 Sorting

Consider:

```text
GET /users?sortBy=name&order=ASC
```

Example:

```typescript
const users = await User.findAll({
    order: [["name", "ASC"]]
});
```

Never directly interpolate an unvalidated client-supplied column name into raw SQL. Use an allowlist of sortable columns.

### 22.4 Filtering

Consider:

```text
GET /users?role=admin
```

Example:

```typescript
const users = await User.findAll({
    where: {
        role: "admin"
    }
});
```

### 22.5 Recommended API Response

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "John"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "totalRecords": 100,
        "totalPages": 10
    }
}
```

### Offset vs Cursor Pagination

| Offset Pagination | Cursor Pagination |
|---|---|
| Uses page and limit | Uses cursor and limit |
| Easy to implement | More complex |
| Can become expensive at large offsets | Often performs better for large datasets |
| Records may shift between pages | More stable with suitable ordering |
| Good for many admin tables | Useful for feeds and large datasets |

For production APIs, validate page numbers and impose a maximum page size.

---

# 23. API Documentation with Swagger

Swagger is commonly used to document REST APIs.

It allows developers to understand:

- Available endpoints.
- HTTP methods.
- Request parameters.
- Request body.
- Response structures.
- Authentication requirements.

Swagger UI provides an interactive interface for exploring API documentation.

### Install Dependencies

```bash
npm install swagger-jsdoc swagger-ui-express

npm install -D @types/swagger-jsdoc @types/swagger-ui-express
```

### Basic Swagger Configuration

```typescript
import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "User API",
            version: "1.0.0",
            description: "User management API"
        },

        servers: [
            {
                url: "http://localhost:5000"
            }
        ]
    },

    apis: ["./src/routes/*.ts"]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
```

### Register Swagger UI

```typescript
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);
```

Access:

```text
http://localhost:5000/api-docs
```

**Note:** Make sure your Swagger configuration scans the files containing the documentation comments. If you document compiled JavaScript instead, configure the appropriate output path.

---

# 24. Centralized Error Handling

A professional Express application should use centralized error handling.

Instead of writing separate error responses in every controller, we can create a common error-handling middleware.

### Step 1: Create Custom Error Class

```typescript
class AppError extends Error {
    statusCode: number;

    constructor(
        message: string,
        statusCode: number
    ) {
        super(message);

        this.statusCode = statusCode;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export default AppError;
```

### Step 2: Use Custom Error

```typescript
import AppError from "./errors/AppError.js";

function getUser(id: number) {
    if (id <= 0) {
        throw new AppError(
            "Invalid user ID",
            400
        );
    }
}
```

### Step 3: Create Error Middleware

```typescript
import {
    Request,
    Response,
    NextFunction
} from "express";

import AppError from "./AppError.js";

function errorHandler(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message
        });

        return;
    }

    console.error(error);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
}

export default errorHandler;
```

Register it after your routes:

```typescript
app.use(errorHandler);
```

### Express 4 vs Express 5: Async Errors

This is an important distinction.

**Express 4:** Rejected promises from async route handlers are not automatically forwarded to error middleware. Use `try/catch` with `next(error)` or an async-handler wrapper.

**Express 5:** Rejected promises from async route handlers are automatically forwarded to error-handling middleware.

Example:

```typescript
router.get("/users", async (req, res) => {
    const users = await User.findAll();

    res.json(users);
});
```

In Express 5, an unhandled rejection in this async handler is forwarded automatically.

### Why Use Centralized Error Handling?

- Consistent API responses.
- Less duplicated code.
- Easier debugging.
- Better maintainability.
- Centralized logging.
- Reduced risk of exposing internal details.

Never expose stack traces, database credentials, or sensitive internal errors in production responses.

---

# 25. Environment Variable Validation with Zod

We discussed earlier that:

```typescript
process.env.PORT
```

has the type:

```typescript
string | undefined
```

We can validate environment variables using Zod.

### Example

```typescript
import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(5000),

    NODE_ENV: z.enum([
        "development",
        "production",
        "test"
    ]).default("development"),

    JWT_SECRET: z.string().min(32)
});

const env = envSchema.parse(process.env);

export default env;
```

Now:

```typescript
console.log(env.PORT);

console.log(env.JWT_SECRET);
```

The application will fail during startup if required configuration is missing or invalid.

This is preferable to discovering missing configuration after a request reaches the server.

---

# 26. Backend Security Best Practices

Security is one of the most important responsibilities of a backend developer.

Let's understand some common security practices.

### 26.1 Helmet

Helmet helps set HTTP security headers.

Install:

```bash
npm install helmet
```

Usage:

```typescript
import helmet from "helmet";

app.use(helmet());
```

### 26.2 CORS

CORS stands for Cross-Origin Resource Sharing.

It controls which browser origins are allowed to access resources.

Install:

```bash
npm install cors
npm install -D @types/cors
```

Usage:

```typescript
import cors from "cors";

app.use(
    cors({
        origin: ["http://localhost:3000"],
        credentials: true
    })
);
```

**Important:** CORS is not an authentication or authorization mechanism. Non-browser clients are not restricted by browser CORS enforcement.

### 26.3 Rate Limiting

Rate limiting restricts how frequently a client can make requests.

Install:

```bash
npm install express-rate-limit
```

Usage:

```typescript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    limit: 100,

    message: "Too many requests"
});

app.use("/api", limiter);
```

For distributed deployments, consider a shared rate-limit store rather than relying only on in-memory counters.

### 26.4 SQL Injection Prevention

Never construct SQL queries by directly inserting user input into query strings.

**Unsafe:**

```typescript
const query = `
    SELECT * FROM users
    WHERE email = '${email}'
`;
```

**Safer:**

Use parameterized queries or ORM query methods.

Example with Sequelize:

```typescript
const user = await User.findOne({
    where: {
        email
    }
});
```

### 26.5 Other Security Practices

| Security Practice | Purpose |
|---|---|
| Input validation | Prevent invalid data |
| Password hashing | Protect passwords |
| JWT verification | Verify token integrity |
| RBAC | Restrict access |
| HTTPS | Encrypt network communication |
| Helmet | Set security headers |
| CORS configuration | Restrict browser origins |
| Rate limiting | Reduce abuse |
| Parameterized queries | Prevent SQL injection |
| Secret management | Protect credentials |
| Dependency auditing | Identify vulnerable packages |
| Request size limits | Reduce oversized request abuse |

Also consider:

- NoSQL injection prevention.
- CSRF protection for cookie-based authentication.
- Secure cookie configuration.
- File upload validation.
- Least-privilege database accounts.
- Safe logging that excludes passwords and tokens.

---

# 27. Performance Optimization in Node.js

Writing correct code is important, but production applications must also perform efficiently.

### 27.1 Avoid Blocking the Event Loop

Node.js uses an event-driven, non-blocking I/O model.

Blocking operations prevent the event loop from efficiently handling other requests.

Example of a blocking operation:

```typescript
import fs from "node:fs";

const data = fs.readFileSync("large-file.txt");

console.log(data);
```

This synchronous file operation blocks the event loop while it runs.

Prefer asynchronous I/O when appropriate:

```typescript
import fs from "node:fs/promises";

async function readFile() {
    const data = await fs.readFile(
        "large-file.txt",
        "utf-8"
    );

    console.log(data);
}
```

### 27.2 Database Connection Pooling

Connection pooling reuses database connections.

Instead of creating a new connection for every request, the application maintains a pool of reusable connections.

### 27.3 Database Indexing

Indexes improve the performance of suitable database queries.

Example:

```sql
CREATE INDEX idx_users_email
ON users(email);
```

However, indexes also have storage and write-performance costs. Create them based on actual query patterns.

### 27.4 Caching

Caching stores frequently requested data for faster retrieval.

Popular caching tools include:

- Redis.
- In-memory caching.
- CDN caching.

### 27.5 Streaming

For large files, streams can process data in chunks instead of loading the entire file into memory.

### 27.6 Compression

HTTP response compression can reduce the amount of data transmitted.

Example:

```bash
npm install compression
npm install -D @types/compression
```

```typescript
import compression from "compression";

app.use(compression());
```

### Performance Checklist

- Avoid unnecessary database queries.
- Use pagination.
- Add appropriate database indexes.
- Use connection pooling.
- Cache frequently accessed data.
- Avoid synchronous I/O in request handlers.
- Use streaming for large files.
- Monitor memory usage.
- Profile CPU-intensive operations.
- Avoid unnecessarily large API responses.

---

# 28. Testing Node.js TypeScript APIs

Testing is essential for production backend applications.

You have already studied testing concepts in Phase 35. Now let's apply them to Express APIs.

Popular tools include:

- Vitest.
- Jest.
- Supertest.

### Install Supertest

```bash
npm install -D supertest @types/supertest
```

### Example Express App

```typescript
import express from "express";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK"
    });
});

export default app;
```

### Example API Test

```typescript
import request from "supertest";
import { describe, it, expect } from "vitest";

import app from "../src/app.js";

describe("Health API", () => {
    it("should return OK", async () => {
        const response = await request(app)
            .get("/health");

        expect(response.status).toBe(200);

        expect(response.body.status).toBe("OK");
    });
});
```

### What Should You Test?

| Test Type | Example |
|---|---|
| Unit Test | Test user service |
| Integration Test | Test database operations |
| API Test | Test Express endpoints |
| Authentication Test | Test valid and invalid tokens |
| Authorization Test | Test role permissions |
| Validation Test | Test invalid request data |
| Error Test | Test expected error responses |

---

# 29. Production Deployment

After development and testing, we need to deploy the application.

A typical deployment process looks like this:

```text
Developer
    |
    v
GitHub Repository
    |
    v
Build Process
    |
    v
TypeScript Compilation
    |
    v
JavaScript Output
    |
    v
Production Server
    |
    v
Node.js Application
```

### Step 1: Build

```bash
npm run build
```

This generates JavaScript files inside:

```text
dist/
```

### Step 2: Start Production Server

```bash
npm start
```

### Step 3: Environment Variables

Production configuration should be provided through environment variables or a secure secrets manager.

Example:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secure_secret
```

Never commit production secrets to GitHub.

### Step 4: Process Management

PM2 is a popular process manager for Node.js.

Install:

```bash
npm install -g pm2
```

Start:

```bash
pm2 start dist/server.js --name typescript-backend
```

Useful commands:

```bash
pm2 list

pm2 logs

pm2 restart typescript-backend

pm2 stop typescript-backend
```

### Step 5: Production Considerations

Before deployment, ensure:

- TypeScript compilation succeeds.
- Tests pass.
- Environment variables are validated.
- Database migrations are applied.
- HTTPS is configured.
- Logging is configured.
- Health checks are available.
- Graceful shutdown is implemented.
- Secrets are protected.
- Monitoring is enabled.

### Graceful Shutdown

A production server should handle shutdown signals properly.

```typescript
import app from "./app.js";
import http from "node:http";

const PORT = Number(process.env.PORT ?? 5000);

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

function shutdown() {
    console.log("Shutting down server...");

    server.close(() => {
        console.log("HTTP server closed");

        process.exit(0);
    });
}

process.on("SIGTERM", shutdown);

process.on("SIGINT", shutdown);
```

This is a basic example. Production applications should also close database connections, stop accepting new background jobs, and implement a shutdown timeout.

---

# 30. Recommended Professional Backend Project Structure

Here is a scalable folder structure for a larger TypeScript backend application.

```text
src/
│
├── config/
│   ├── database.ts
│   ├── env.ts
│   └── swagger.ts
│
├── modules/
│   │
│   ├── users/
│   │   ├── user.routes.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.repository.ts
│   │   ├── user.model.ts
│   │   ├── user.schema.ts
│   │   └── user.types.ts
│   │
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.schema.ts
│   │
│   └── products/
│       ├── product.routes.ts
│       ├── product.controller.ts
│       ├── product.service.ts
│       ├── product.repository.ts
│       └── product.model.ts
│
├── middlewares/
│   ├── authenticate.ts
│   ├── authorize.ts
│   ├── validate.ts
│   ├── errorHandler.ts
│   └── requestLogger.ts
│
├── errors/
│   └── AppError.ts
│
├── utils/
│   ├── jwt.ts
│   ├── password.ts
│   └── response.ts
│
├── types/
│   └── express.d.ts
│
├── app.ts
└── server.ts
│
tests/
│
├── unit/
├── integration/
└── api/
```

### Why Use Feature-Based Organization?

Instead of grouping every controller in one folder and every service in another, we group related files by feature.

For example:

```text
modules/
    users/
    auth/
    products/
    orders/
```

This makes larger applications easier to maintain.

---

# 31. Common Mistakes in TypeScript Backend Development

| Mistake | Better Approach |
|---|---|
| Using `any` everywhere | Use proper types and `unknown` |
| Trusting request body types | Validate input at runtime |
| Storing plain passwords | Use password hashing |
| Hardcoding secrets | Use environment variables |
| Writing all logic in controllers | Separate business logic into services |
| Exposing database models directly | Use DTOs and response mapping |
| Ignoring rejected promises | Use proper async error handling |
| Returning internal errors | Use centralized error handling |
| Using unrestricted CORS | Configure allowed origins |
| Skipping rate limiting | Apply suitable request limits |
| Trusting uploaded MIME types | Inspect file content where appropriate |
| Returning thousands of records | Use pagination |
| Using synchronous I/O in APIs | Prefer asynchronous operations |
| Ignoring database transactions | Use transactions for related operations |
| Using `!` on environment variables | Validate configuration |
| Using unsafe raw SQL | Use parameterized queries |
| Skipping integration tests | Test API and database interactions |

---

# 32. Important Backend Interview Questions and Answers

### Q1. What is TypeScript in Node.js?

TypeScript is a statically typed superset of JavaScript. It helps developers detect type-related errors during development and compilation.

### Q2. Can Node.js execute TypeScript directly?

Traditionally, TypeScript is compiled or transformed into JavaScript before execution. Modern Node.js versions also provide limited native TypeScript type stripping, but this does not replace full TypeScript compilation and type checking.

### Q3. What is Express.js?

Express.js is a minimal web framework for Node.js used to build REST APIs and web applications.

### Q4. What is middleware?

Middleware is a function that executes during the HTTP request-response lifecycle and can access the request, response, and next function.

### Q5. What is the difference between Request and Response?

`Request` contains incoming client information, while `Response` is used to send data back to the client.

### Q6. What is DTO?

DTO stands for Data Transfer Object. It defines the structure of data transferred between application layers or across API boundaries.

### Q7. What is the difference between Controller and Service?

A controller handles HTTP-related operations, while a service contains business logic.

### Q8. What is the Repository Pattern?

The Repository Pattern separates data-access logic from business logic.

### Q9. What is dependency injection?

Dependency injection is a technique in which an object receives its dependencies from an external source instead of creating them internally.

### Q10. What is Zod?

Zod is a TypeScript-first schema validation library that provides runtime data validation and TypeScript type inference.

### Q11. Why is runtime validation necessary in TypeScript?

Because TypeScript types are removed during compilation and cannot validate untrusted runtime data.

### Q12. What is JWT?

JWT is a compact token format used to transmit claims between systems.

### Q13. What are the three parts of JWT?

Header, Payload, and Signature.

### Q14. Is JWT encrypted?

A typical signed JWT is not encrypted. Its payload can be decoded and read.

### Q15. What is password hashing?

Password hashing transforms a password into a one-way hash representation that can be verified without storing the original password.

### Q16. What is bcrypt?

bcrypt is a password-hashing algorithm designed to make password guessing computationally expensive.

### Q17. What is RBAC?

Role-Based Access Control restricts application functionality according to assigned user roles.

### Q18. Difference between authentication and authorization?

Authentication verifies identity, while authorization determines permissions.

### Q19. Difference between 401 and 403?

401 indicates missing or invalid authentication. 403 indicates that the authenticated user does not have sufficient permission.

### Q20. What is Sequelize?

Sequelize is an ORM for Node.js that supports relational databases such as MySQL and PostgreSQL.

### Q21. What is Mongoose?

Mongoose is an ODM library used to work with MongoDB through schemas and models.

### Q22. Difference between ORM and ODM?

ORM maps application objects to relational database structures, while ODM provides object-oriented modeling for document databases.

### Q23. What is a database transaction?

A transaction groups database operations into a logical unit that either commits or rolls back.

### Q24. What are ACID properties?

Atomicity, Consistency, Isolation, and Durability.

### Q25. What is pagination?

Pagination divides large datasets into smaller groups to improve API performance and usability.

### Q26. What is Swagger?

Swagger is a collection of tools and specifications used to describe, document, and explore APIs.

### Q27. What is CORS?

CORS is a browser security mechanism that controls cross-origin requests.

### Q28. Does CORS protect an API from unauthorized access?

No. CORS is not an authentication or authorization mechanism.

### Q29. What is Helmet?

Helmet is Express middleware that helps configure HTTP security headers.

### Q30. What is rate limiting?

Rate limiting restricts the number of requests a client can make within a specified period.

### Q31. What is connection pooling?

Connection pooling maintains reusable database connections to reduce the overhead of repeatedly creating connections.

### Q32. What is graceful shutdown?

Graceful shutdown allows an application to stop accepting new requests and finish or clean up ongoing operations before terminating.

### Q33. What is the difference between Express 4 and Express 5 async error handling?

Express 5 automatically forwards rejected promises from async route handlers to error middleware. Express 4 generally requires explicit error forwarding or an async wrapper.

### Q34. What is the Event Loop in Node.js?

The Event Loop coordinates asynchronous callbacks and non-blocking operations, allowing Node.js to handle many concurrent I/O operations efficiently.

### Q35. What is the difference between TypeScript validation and Zod validation?

TypeScript performs static type checking, while Zod validates actual runtime data.

---

# 33. Practical Exercises

Complete these exercises to strengthen your understanding.

## Exercise 1: Basic TypeScript API

Create an Express API with:

```text
GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id
DELETE /users/:id
```

Requirements:

- Use TypeScript.
- Define request and response types.
- Use controllers.
- Use services.

## Exercise 2: User Registration API

Create:

```text
POST /api/auth/register
```

Requirements:

- Name.
- Email.
- Password.
- Zod validation.
- Password hashing.
- Database insertion.
- Proper error handling.

## Exercise 3: Login API

Create:

```text
POST /api/auth/login
```

Requirements:

- Validate email and password.
- Find user in database.
- Compare password hash.
- Generate JWT.
- Return appropriate response.

## Exercise 4: Authentication Middleware

Create middleware that:

- Reads the Authorization header.
- Extracts the Bearer token.
- Verifies JWT.
- Validates token claims.
- Attaches user information to `req.user`.

## Exercise 5: Role-Based Access Control

Implement:

```text
GET    /api/admin/users
DELETE /api/admin/users/:id
```

Only administrators should be allowed to access these endpoints.

## Exercise 6: Database Integration

Build a CRUD API using either:

- MySQL + Sequelize.
- MongoDB + Mongoose.

Implement proper model typing and database error handling.

## Exercise 7: File Upload API

Create:

```text
POST /api/upload
```

Requirements:

- Upload profile pictures.
- Maximum size: 5 MB.
- Allow only approved image formats.
- Generate unique filenames.
- Return uploaded file information.

## Exercise 8: Pagination and Filtering

Create:

```text
GET /api/products?page=1&limit=10&sortBy=price&order=ASC&category=electronics
```

Requirements:

- Pagination.
- Sorting.
- Filtering.
- Query validation.
- Maximum page size.

## Exercise 9: API Documentation

Integrate Swagger and document all user and authentication endpoints.

## Exercise 10: Complete Backend Project

Build a complete **User and Product Management API**.

Required features:

- Registration.
- Login.
- JWT authentication.
- Role-based authorization.
- User CRUD.
- Product CRUD.
- Database integration.
- Zod validation.
- Centralized error handling.
- File uploads.
- Pagination.
- Sorting.
- Filtering.
- Swagger documentation.
- Unit tests.
- Integration tests.
- Production deployment.

---

# 34. Phase 36 Completion Checklist

Before moving to the next phase, make sure you understand these concepts.

| Topic | Completion |
|---|---|
| Node.js + TypeScript setup | ☐ |
| TypeScript compilation | ☐ |
| Express with TypeScript | ☐ |
| Request and Response typing | ☐ |
| DTOs | ☐ |
| Controllers and Services | ☐ |
| Repository Pattern | ☐ |
| Express Middleware | ☐ |
| Module Augmentation | ☐ |
| Zod Validation | ☐ |
| Authentication | ☐ |
| Authorization | ☐ |
| Password Hashing | ☐ |
| JWT | ☐ |
| RBAC | ☐ |
| Sequelize | ☐ |
| Mongoose | ☐ |
| Database Transactions | ☐ |
| File Uploads | ☐ |
| Pagination | ☐ |
| Sorting and Filtering | ☐ |
| Swagger | ☐ |
| Centralized Error Handling | ☐ |
| Backend Security | ☐ |
| Performance Optimization | ☐ |
| API Testing | ☐ |
| Production Deployment | ☐ |

---

# 35. What You Should Be Able to Build After Phase 36

After completing this phase and its practical exercises, you should be able to design and develop a professional backend application using:

```text
Node.js
    +
TypeScript
    +
Express.js
    +
MySQL / MongoDB
    +
Sequelize / Mongoose
    +
Zod
    +
JWT
    +
REST APIs
    +
Testing
```

You should understand how to organize backend code, validate incoming requests, implement authentication, manage database operations, handle errors, secure APIs, and deploy applications.

---

# Next Phase

## Phase 37: TypeScript with React – Advanced Frontend Development

In the next phase, we will cover:

1. Setting Up React with TypeScript.
2. TypeScript in JSX (TSX).
3. Functional Components.
4. Props Typing.
5. State Typing.
6. Event Handling.
7. React Hooks with TypeScript.
8. useState and useReducer.
9. useEffect and useRef.
10. Custom Hooks.
11. Context API with TypeScript.
12. Advanced Component Patterns.
13. Generics in React Components.
14. React Forms and Validation.
15. React Hook Form with Zod.
16. API Integration with TypeScript.
17. Axios and Fetch.
18. React Query / TanStack Query.
19. Type-safe Routing.
20. Authentication in React.
21. Performance Optimization.
22. Testing React Components.
23. Scalable React Architecture.
24. Complete React + TypeScript Project.

**When you're ready, say: `OK, Phase 37`.**