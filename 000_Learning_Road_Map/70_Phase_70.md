# Phase 70: Advanced TypeScript – TypeScript with Node.js, Express.js, REST APIs, Middleware, Authentication, Authorization, Database Integration, Sequelize, MongoDB and Enterprise Backend Development

**Level:** Advanced / Expert Backend Development  
**Prerequisites:** TypeScript fundamentals, advanced generics, interfaces, classes, Node.js, Express.js, JavaScript, SQL, MongoDB and REST API concepts.

---

# 1. Learning Objectives

In this phase, you will learn how to build production-ready backend applications using TypeScript.

By the end of this phase, you should be able to:

1. Set up a professional TypeScript backend project.
2. Understand TypeScript with Node.js.
3. Configure Express.js with TypeScript.
4. Create strongly typed routes and controllers.
5. Implement custom middleware.
6. Create centralized error handling.
7. Build type-safe REST APIs.
8. Validate API requests using Zod.
9. Implement authentication using JWT.
10. Implement authorization using Role-Based Access Control.
11. Integrate MySQL using Sequelize.
12. Integrate MongoDB using Mongoose.
13. Implement Repository and Service patterns.
14. Implement database transactions.
15. Build pagination, filtering and sorting.
16. Implement file uploads.
17. Secure backend applications.
18. Implement logging and monitoring.
19. Write unit and integration tests.
20. Build a complete enterprise backend application.

---

# 2. TypeScript with Node.js

Before using Express.js, understand how TypeScript works with Node.js.

Node.js executes JavaScript, not TypeScript source directly in the traditional workflow.

TypeScript code generally needs to be transformed into JavaScript before production execution, although modern Node.js versions also support limited TypeScript type-stripping execution.

For predictable production builds, a compiler-based workflow remains useful.

## 2.1 Create a TypeScript Node.js Project

Create a project:

```bash
mkdir typescript-backend
cd typescript-backend
```

Initialize npm:

```bash
npm init -y
```

Install TypeScript:

```bash
npm install -D typescript
```

Install Node.js type definitions:

```bash
npm install -D @types/node
```

Initialize TypeScript:

```bash
npx tsc --init
```

Your project now contains:

```text
typescript-backend/
│
├── node_modules/
├── package.json
├── package-lock.json
└── tsconfig.json
```

## 2.2 Configure tsconfig.json

A practical starting configuration:

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

        "noImplicitAny": true,
        "strictNullChecks": true,
        "noUncheckedIndexedAccess": true
    },

    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist"]
}
```

### Important Configuration Options

| Option | Purpose |
|---|---|
| `target` | JavaScript version to generate |
| `module` | Module format |
| `moduleResolution` | How imports are resolved |
| `rootDir` | Source directory |
| `outDir` | Compiled output directory |
| `strict` | Enables strict type checking |
| `esModuleInterop` | Improves interoperability with CommonJS packages |
| `declaration` | Generates `.d.ts` files |
| `sourceMap` | Generates source maps |
| `noUncheckedIndexedAccess` | Makes potentially missing indexed values include `undefined` |

**Important:** With `NodeNext`, module behavior depends on Node.js package configuration. Set the appropriate `"type": "module"` or use the CommonJS configuration consistently.

For this lesson, we will use the ESM approach.

Add to `package.json`:

```json
{
    "type": "module"
}
```

## 2.3 Create Your First TypeScript File

Create:

```text
src/
└── index.ts
```

Code:

```typescript
const message: string = "Hello from TypeScript";

console.log(message);
```

Compile:

```bash
npx tsc
```

Generated JavaScript:

```text
dist/
└── index.js
```

Execute:

```bash
node dist/index.js
```

Output:

```text
Hello from TypeScript
```

## 2.4 Configure Development Scripts

Install development dependencies:

```bash
npm install -D tsx
```

Update `package.json` scripts:

```json
{
    "scripts": {
        "dev": "tsx watch src/index.ts",
        "build": "tsc",
        "start": "node dist/index.js",
        "typecheck": "tsc --noEmit"
    }
}
```

Run development mode:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Production:

```bash
npm start
```

Type checking without generating files:

```bash
npm run typecheck
```

### tsx vs tsc

| Tool | Purpose |
|---|---|
| `tsx` | Executes TypeScript during development |
| `tsc` | Type-checks and compiles TypeScript |
| `node` | Executes JavaScript |
| `ts-node` | Executes TypeScript through Node.js integration |

**Best practice:** Use `tsx` for convenient development and `tsc` for production builds and type checking.

---

# 3. TypeScript with Express.js

Express.js is a Node.js web framework used to build APIs and backend applications.

It provides:

- Routing.
- Middleware.
- Request handling.
- Response handling.
- Error handling.
- HTTP server integration.

Let's integrate Express with TypeScript.

## 3.1 Install Express

```bash
npm install express
```

Install Express type definitions:

```bash
npm install -D @types/express
```

## 3.2 Create Your First Express Server

Create:

```text
src/
├── app.ts
└── server.ts
```

### app.ts

```typescript
import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("TypeScript Express Server");
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

Notice the `.js` extension in the relative import.

With NodeNext ESM output, TypeScript commonly expects the emitted JavaScript extension in source imports.

Run:

```bash
npm run dev
```

Open:

```text
http://localhost:5000
```

Response:

```text
TypeScript Express Server
```

## 3.3 Understanding Express Request and Response Types

Express provides several important types.

```typescript
import {
    Request,
    Response,
    NextFunction
} from "express";
```

A basic route:

```typescript
import { Request, Response } from "express";

function getUsers(
    req: Request,
    res: Response
) {
    res.json({
        message: "Users fetched successfully"
    });
}
```

Here:

- `Request` represents incoming HTTP requests.
- `Response` represents outgoing HTTP responses.
- `NextFunction` represents the middleware continuation function.

## 3.4 Strongly Typed Request Parameters

Suppose your route is:

```text
GET /users/:id
```

You can define the parameter type.

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
        id: userId
    });
}
```

**Important:** Express route parameters are strings, even when they represent numbers.

Convert and validate them before numeric operations.

```typescript
const userId = Number(req.params.id);

if (!Number.isInteger(userId) || userId <= 0) {
    res.status(400).json({
        message: "Invalid user ID"
    });

    return;
}
```

## 3.5 Strongly Typed Request Body

Suppose you want to create a user.

```typescript
interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
}
```

Route:

```typescript
import { Request, Response } from "express";

function createUser(
    req: Request<{}, {}, CreateUserRequest>,
    res: Response
) {
    const { name, email, password } = req.body;

    res.status(201).json({
        message: "User created",
        name,
        email
    });
}
```

Express's `Request` generic parameters are commonly structured as:

```typescript
Request<
    Params,
    ResponseBody,
    RequestBody,
    Query,
    Locals
>
```

Example:

```typescript
Request<
    { id: string },
    { success: boolean },
    CreateUserRequest,
    { search?: string },
    {}
>
```

**Important:** These generic parameters provide compile-time typing. They do not validate the actual HTTP request body.

An external client can still send invalid JSON structures.

We will solve that using runtime validation later.

---

# 4. Professional Express Project Structure

For larger backend applications, avoid placing every route and business operation inside `app.ts`.

Use a modular architecture.

Example:

```text
src/
│
├── config/
│   ├── database.ts
│   └── environment.ts
│
├── controllers/
│   └── user.controller.ts
│
├── services/
│   └── user.service.ts
│
├── repositories/
│   └── user.repository.ts
│
├── routes/
│   └── user.routes.ts
│
├── middlewares/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── validation.middleware.ts
│
├── validators/
│   └── user.validator.ts
│
├── types/
│   └── express.d.ts
│
├── utils/
│   └── response.ts
│
├── app.ts
└── server.ts
```

### Responsibility of Each Layer

| Layer | Responsibility |
|---|---|
| Routes | Define API endpoints |
| Controllers | Handle HTTP requests and responses |
| Services | Implement business logic |
| Repositories | Handle data access |
| Models | Represent database structures |
| Middlewares | Process requests before or after controllers |
| Validators | Validate external input |
| Config | Manage environment and infrastructure configuration |
| Utils | Reusable helper functions |

This separation makes the application easier to maintain and test.

---

# 5. Controllers, Services and Routes

Let's implement a simple user module.

## 5.1 Define User Types

Create:

`src/types/user.types.ts`

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

Notice that the public User type does not contain the password.

## 5.2 Create the Service

`src/services/user.service.ts`

```typescript
import type {
    User,
    CreateUserDTO
} from "../types/user.types.js";

class UserService {
    private users: User[] = [];

    private nextId = 1;

    async getAllUsers(): Promise<User[]> {
        return this.users;
    }

    async getUserById(id: number): Promise<User | undefined> {
        return this.users.find(user => user.id === id);
    }

    async createUser(data: CreateUserDTO): Promise<User> {
        const user: User = {
            id: this.nextId++,
            name: data.name,
            email: data.email
        };

        this.users.push(user);

        return user;
    }
}

export default new UserService();
```

For this example, we are using an in-memory array.

A real application would use a database repository.

## 5.3 Create the Controller

`src/controllers/user.controller.ts`

```typescript
import type {
    Request,
    Response
} from "express";

import userService from "../services/user.service.js";

import type {
    CreateUserDTO
} from "../types/user.types.js";

class UserController {

    async getAllUsers(
        req: Request,
        res: Response
    ) {
        const users = await userService.getAllUsers();

        res.status(200).json({
            success: true,
            data: users
        });
    }

    async getUserById(
        req: Request<{ id: string }>,
        res: Response
    ) {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });

            return;
        }

        const user = await userService.getUserById(id);

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });

            return;
        }

        res.status(200).json({
            success: true,
            data: user
        });
    }

    async createUser(
        req: Request<{}, {}, CreateUserDTO>,
        res: Response
    ) {
        const user = await userService.createUser(req.body);

        res.status(201).json({
            success: true,
            data: user
        });
    }
}

export default new UserController();
```

## 5.4 Create Routes

`src/routes/user.routes.ts`

```typescript
import { Router } from "express";

import userController from "../controllers/user.controller.js";

const router = Router();

router.get("/", userController.getAllUsers);

router.get("/:id", userController.getUserById);

router.post("/", userController.createUser);

export default router;
```

## 5.5 Register Routes

Update `src/app.ts`:

```typescript
import express from "express";

import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

export default app;
```

Your endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get one user |
| POST | `/api/users` | Create a user |

This is the basic modular structure of a TypeScript Express application.

**Production note:** Before using these endpoints publicly, add request validation, password hashing, error handling and database persistence.

---

# 6. Middleware in Express with TypeScript

Middleware is one of the most important concepts in Express.

A middleware function executes during the HTTP request-response lifecycle.

It can:

- Read request data.
- Modify the request.
- Modify the response.
- Validate authentication.
- Log requests.
- Handle errors.
- Pass control to the next middleware.

## 6.1 Middleware Syntax

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

Register it:

```typescript
app.use(middleware);
```

## 6.2 Middleware Execution Flow

Consider:

```typescript
app.use(middleware1);

app.use(middleware2);

app.get("/", controller);
```

Execution:

```text
HTTP Request
     |
     v
Middleware 1
     |
     v
Middleware 2
     |
     v
Controller
     |
     v
HTTP Response
```

Calling `next()` passes control to the next middleware or route handler.

If middleware sends a response and does not call `next()`, the request processing stops there.

## 6.3 Request Logging Middleware

```typescript
import {
    Request,
    Response,
    NextFunction
} from "express";

function logger(
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log({
        method: req.method,
        url: req.originalUrl,
        timestamp: new Date()
    });

    next();
}
```

Register:

```typescript
app.use(logger);
```

## 6.4 Middleware with Configuration

You can create middleware factories.

```typescript
import {
    Request,
    Response,
    NextFunction
} from "express";

function requireRole(role: string) {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        console.log("Required role:", role);

        next();
    };
}
```

Usage:

```typescript
app.get(
    "/admin",
    requireRole("admin"),
    adminController
);
```

This is useful for reusable authentication and authorization middleware.

---

# 7. Extending Express Request Types

Suppose you authenticate a user and want to attach their information to the request.

You may want to access:

```typescript
req.currentUser
```

Express does not know this property by default.

You can extend its Request interface.

## 7.1 Create a Custom Type

Create:

`src/types/express.d.ts`

```typescript
export {};

declare global {
    namespace Express {
        interface User {
            id: number;
            email: string;
            role: "admin" | "user";
        }

        interface Request {
            currentUser?: User;
        }
    }
}
```

Now Express requests support:

```typescript
req.currentUser
```

Example:

```typescript
import {
    Request,
    Response,
    NextFunction
} from "express";

function checkUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.currentUser) {
        res.status(401).json({
            message: "Unauthorized"
        });

        return;
    }

    console.log(req.currentUser.email);

    next();
}
```

Make sure the declaration file is included in your `tsconfig.json`.

For example:

```json
{
    "include": ["src/**/*"]
}
```

**Important:** This only changes TypeScript's understanding of the request. Your authentication middleware must actually assign `req.currentUser`.

---

# 8. Asynchronous Error Handling

Most backend operations are asynchronous.

Examples:

- Database queries.
- HTTP requests.
- File operations.
- Password hashing.
- Authentication.

These operations can fail.

You should implement centralized error handling.

## 8.1 Basic Try-Catch

```typescript
async function getUsers(
    req: Request,
    res: Response
) {
    try {
        const users = await userService.getAllUsers();

        res.json(users);

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
```

This works, but repeating try-catch in every controller creates unnecessary duplication.

## 8.2 Create an Async Handler

```typescript
import type {
    RequestHandler
} from "express";

type AsyncHandler = (
    handler: RequestHandler
) => RequestHandler;

const asyncHandler: AsyncHandler = handler => {
    return (req, res, next) => {
        Promise.resolve(
            handler(req, res, next)
        ).catch(next);
    };
};

export default asyncHandler;
```

Usage:

```typescript
router.get(
    "/",
    asyncHandler(async (req, res) => {
        const users = await userService.getAllUsers();

        res.json(users);
    })
);
```

For Express 5, rejected promises returned by route handlers are automatically forwarded to error handling middleware. This wrapper remains useful in Express 4 projects.

## 8.3 Create a Custom Application Error

`src/errors/app-error.ts`

```typescript
class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string
    ) {
        super(message);

        this.name = "AppError";
    }
}

export default AppError;
```

Usage:

```typescript
throw new AppError(404, "User not found");
```

## 8.4 Centralized Error Middleware

`src/middlewares/error.middleware.ts`

```typescript
import type {
    Request,
    Response,
    NextFunction
} from "express";

import AppError from "../errors/app-error.js";

function errorMiddleware(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (res.headersSent) {
        next(error);
        return;
    }

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
        message: "Internal Server Error"
    });
}

export default errorMiddleware;
```

Register it after routes:

```typescript
app.use(errorMiddleware);
```

Express identifies error-handling middleware by its four parameters.

### Error Flow

```text
Request
   |
   v
Middleware
   |
   v
Controller
   |
   v
Service
   |
   v
Error Occurs
   |
   v
next(error)
   |
   v
Error Middleware
   |
   v
HTTP Error Response
```

---

# 9. Request Validation Using Zod

TypeScript interfaces cannot validate external input at runtime.

Consider:

```typescript
interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}
```

This only describes the expected structure to the compiler.

A client could still send:

```json
{
    "name": 123,
    "email": "invalid",
    "password": false
}
```

You need runtime validation.

Zod is a TypeScript-friendly schema validation library.

## 9.1 Install Zod

```bash
npm install zod
```

## 9.2 Create a Validation Schema

`src/validators/user.validator.ts`

```typescript
import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string().min(2).max(100),

    email: z.string().email(),

    password: z.string().min(8)
});

export type CreateUserInput =
    z.infer<typeof createUserSchema>;
```

Notice:

```typescript
z.infer<typeof createUserSchema>
```

This automatically derives the TypeScript type from the Zod schema.

You do not need to maintain the schema and interface separately.

## 9.3 Validate Request Body

```typescript
import {
    Request,
    Response,
    NextFunction
} from "express";

import { createUserSchema } from "../validators/user.validator.js";

function validateCreateUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = createUserSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            success: false,
            errors: result.error.issues
        });

        return;
    }

    req.body = result.data;

    next();
}
```

Usage:

```typescript
router.post(
    "/",
    validateCreateUser,
    userController.createUser
);
```

Now invalid request bodies are rejected before reaching the controller.

### parse vs safeParse

| Method | Behavior |
|---|---|
| `parse()` | Returns validated data or throws an error |
| `safeParse()` | Returns a success/error result without throwing for validation failure |

## 9.4 Validating Query Parameters

Suppose your endpoint is:

```text
GET /api/users?page=1&limit=10
```

Schema:

```typescript
import { z } from "zod";

const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10)
});
```

Why use `z.coerce.number()`?

Because query parameters arrive as strings.

For example:

```text
?page=2
```

Express receives:

```typescript
{
    page: "2"
}
```

The coercion converts it to:

```typescript
{
    page: 2
}
```

---

# 10. Building a Type-Safe REST API

REST APIs expose resources through HTTP methods and URLs.

Let's understand standard REST conventions.

## 10.1 HTTP Methods

| Method | Purpose | Example |
|---|---|---|
| GET | Retrieve resources | Get users |
| POST | Create resources | Create user |
| PUT | Replace a resource | Replace user |
| PATCH | Partially update | Update user email |
| DELETE | Delete resource | Delete user |

## 10.2 HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Content |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

## 10.3 Standard API Response Type

```typescript
interface ApiSuccess<T> {
    success: true;
    message: string;
    data: T;
}

interface ApiFailure {
    success: false;
    message: string;
    errors?: unknown;
}

type ApiResponse<T> =
    | ApiSuccess<T>
    | ApiFailure;
```

Create a reusable response helper:

```typescript
import type { Response } from "express";

function sendSuccess<T>(
    res: Response,
    data: T,
    message: string,
    statusCode = 200
) {
    res.status(statusCode).json({
        success: true,
        message,
        data
    });
}

export default sendSuccess;
```

Usage:

```typescript
sendSuccess(
    res,
    user,
    "User created successfully",
    201
);
```

---

# 11. Authentication with TypeScript and JWT

Authentication determines who the user is.

Authorization determines what the authenticated user is allowed to do.

Let's implement JWT authentication.

## 11.1 Install Required Packages

```bash
npm install jsonwebtoken bcrypt
```

Install type definitions:

```bash
npm install -D @types/jsonwebtoken @types/bcrypt
```

## 11.2 What Is JWT?

JWT stands for JSON Web Token.

It is a token format commonly used to transmit claims between systems.

A JWT commonly contains three parts:

```text
Header.Payload.Signature
```

Example conceptual structure:

```text
xxxxx.yyyyy.zzzzz
```

### Header

Contains information such as the signing algorithm and token type.

### Payload

Contains claims.

Example:

```json
{
    "userId": 101,
    "role": "admin"
}
```

### Signature

Used to verify token integrity and authenticity.

**Important:** A signed JWT is not automatically encrypted. Its payload is generally readable by anyone who possesses the token.

Do not put passwords, secret keys or sensitive private information in JWT payloads.

## 11.3 Create JWT Configuration

Environment variable:

```env
JWT_SECRET=your-long-random-secret
JWT_EXPIRES_IN=15m
```

Load environment variables using:

```bash
npm install dotenv
```

In your configuration:

```typescript
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
}

export { JWT_SECRET };
```

In production, use a secure secret-management mechanism rather than committing secrets to source control.

## 11.4 Create Token Generation Function

```typescript
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../config/environment.js";

interface JwtPayload {
    userId: number;
    role: "admin" | "user";
}

function generateToken(payload: JwtPayload): string {
    return jwt.sign(
        payload,
        JWT_SECRET,
        {
            expiresIn: "15m",
            algorithm: "HS256"
        }
    );
}

export default generateToken;
```

## 11.5 Verify JWT

```typescript
import jwt from "jsonwebtoken";

import {
    Request,
    Response,
    NextFunction
} from "express";

import { JWT_SECRET } from "../config/environment.js";

function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        res.status(401).json({
            message: "Authentication required"
        });

        return;
    }

    const token = authorization.slice(7);

    try {
        const decoded = jwt.verify(
            token,
            JWT_SECRET,
            {
                algorithms: ["HS256"]
            }
        );

        if (
            typeof decoded === "string" ||
            typeof decoded.userId !== "number" ||
            (decoded.role !== "admin" && decoded.role !== "user")
        ) {
            res.status(401).json({
                message: "Invalid token payload"
            });

            return;
        }

        req.currentUser = {
            id: decoded.userId,
            email: "",
            role: decoded.role
        };

        next();

    } catch {
        res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

export default authenticate;
```

This example demonstrates verification and request typing. In a real application, load the current user from the database or trusted identity store rather than treating an incomplete token payload as a complete user record.

A better request context might contain only authenticated claims:

```typescript
interface AuthenticatedUser {
    id: number;
    role: "admin" | "user";
}
```

## 11.6 Protect Routes

```typescript
router.get(
    "/profile",
    authenticate,
    userController.getProfile
);
```

Now only requests with a valid token can access the endpoint.

## 11.7 Password Hashing with bcrypt

Never store plain-text passwords.

Hash passwords before storing them.

```typescript
import bcrypt from "bcrypt";

async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}
```

Verify:

```typescript
async function comparePassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}
```

Example:

```typescript
const passwordHash = await hashPassword("MyPassword123");

const isValid = await comparePassword(
    "MyPassword123",
    passwordHash
);
```

Do not store the original password.

---

# 12. Authorization with Role-Based Access Control

Authentication answers:

**Who are you?**

Authorization answers:

**What are you allowed to do?**

Role-Based Access Control (RBAC) assigns permissions based on user roles.

Example roles:

```typescript
type UserRole =
    | "admin"
    | "manager"
    | "user";
```

## 12.1 Create Role Middleware

```typescript
import {
    Request,
    Response,
    NextFunction
} from "express";

import type { UserRole } from "../types/auth.types.js";

function authorize(...allowedRoles: UserRole[]) {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        if (!req.currentUser) {
            res.status(401).json({
                message: "Authentication required"
            });

            return;
        }

        if (!allowedRoles.includes(req.currentUser.role)) {
            res.status(403).json({
                message: "Permission denied"
            });

            return;
        }

        next();
    };
}

export default authorize;
```

## 12.2 Use Authorization Middleware

```typescript
router.delete(
    "/users/:id",
    authenticate,
    authorize("admin"),
    userController.deleteUser
);
```

Now only administrators can delete users.

## 12.3 Authentication vs Authorization

| Authentication | Authorization |
|---|---|
| Verifies identity | Verifies permissions |
| Happens before protected access | Happens after identity is established |
| JWT verification is one possible mechanism | RBAC or ABAC can enforce access |
| Answers who you are | Answers what you can do |

**Important:** In real systems, roles and permissions should come from trusted data. For high-security applications, account for role changes, token revocation and stale claims.

---

# 13. TypeScript with MySQL and Sequelize

Now let's connect the backend application to MySQL.

Sequelize is an ORM that supports TypeScript through its model APIs.

## 13.1 Install Dependencies

```bash
npm install sequelize mysql2
```

## 13.2 Configure Database Connection

`src/config/database.ts`

```typescript
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASSWORD!,
    {
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
        logging: false
    }
);

export default sequelize;
```

For production, validate all required environment variables instead of relying on non-null assertions.

## 13.3 Define a Sequelize Model

`src/models/user.model.ts`

```typescript
import {
    DataTypes,
    Model,
    Optional
} from "sequelize";

import sequelize from "../config/database.js";

interface UserAttributes {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
}

interface UserCreationAttributes
    extends Optional<UserAttributes, "id"> {}

class UserModel
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes {

    declare id: number;

    declare name: string;

    declare email: string;

    declare passwordHash: string;
}

UserModel.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        email: {
            type: DataTypes.STRING(150),
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

export default UserModel;
```

### Understanding Optional

```typescript
interface UserCreationAttributes
    extends Optional<UserAttributes, "id"> {}
```

This means:

- When reading a user, `id` is required.
- When creating a user, `id` is optional because the database generates it.

This is a common Sequelize TypeScript pattern.

## 13.4 Test Database Connection

```typescript
import sequelize from "./config/database.js";

async function connectDatabase() {
    try {
        await sequelize.authenticate();

        console.log("Database connected successfully");

    } catch (error) {
        console.error("Database connection failed", error);

        throw error;
    }
}

export default connectDatabase;
```

## 13.5 Sync Models

```typescript
await sequelize.sync();
```

This creates missing tables based on your models.

For production systems, prefer controlled schema migrations instead of relying on automatic synchronization.

Avoid using:

```typescript
await sequelize.sync({ force: true });
```

in production because it can drop and recreate tables.

---

# 14. Repository Pattern with Sequelize

You should avoid placing database queries directly inside controllers.

Use a repository layer.

## 14.1 Create User Repository

`src/repositories/user.repository.ts`

```typescript
import UserModel from "../models/user.model.js";

import type {
    UserAttributes,
    UserCreationAttributes
} from "../types/database.types.js";

class UserRepository {

    async findAll() {
        return UserModel.findAll({
            attributes: {
                exclude: ["passwordHash"]
            }
        });
    }

    async findById(id: number) {
        return UserModel.findByPk(id, {
            attributes: {
                exclude: ["passwordHash"]
            }
        });
    }

    async findByEmail(email: string) {
        return UserModel.findOne({
            where: { email }
        });
    }

    async create(data: UserCreationAttributes) {
        return UserModel.create(data);
    }
}

export default new UserRepository();
```

For this example, define the shared database types:

`src/types/database.types.ts`

```typescript
export interface UserAttributes {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
}

export type UserCreationAttributes =
    Omit<UserAttributes, "id">;
```

In a real project, share these types with the model instead of duplicating definitions.

## 14.2 Create User Service

```typescript
import userRepository from "../repositories/user.repository.js";

import bcrypt from "bcrypt";

import AppError from "../errors/app-error.js";

class UserService {

    async register(
        name: string,
        email: string,
        password: string
    ) {
        const existingUser =
            await userRepository.findByEmail(email);

        if (existingUser) {
            throw new AppError(
                409,
                "Email already registered"
            );
        }

        const passwordHash = await bcrypt.hash(
            password,
            12
        );

        return userRepository.create({
            name,
            email,
            passwordHash
        });
    }

    async getAllUsers() {
        return userRepository.findAll();
    }

    async getUserById(id: number) {
        const user = await userRepository.findById(id);

        if (!user) {
            throw new AppError(404, "User not found");
        }

        return user;
    }
}

export default new UserService();
```

### Why Separate These Layers?

| Layer | Responsibility |
|---|---|
| Controller | HTTP handling |
| Service | Business rules |
| Repository | Database operations |
| Model | Database mapping |

This separation improves testability and maintainability.

---

# 15. TypeScript with MongoDB and Mongoose

You may also use MongoDB instead of MySQL.

Mongoose provides schema definitions, models, validation and document operations.

## 15.1 Install Mongoose

```bash
npm install mongoose
```

## 15.2 Configure MongoDB Connection

`src/config/mongodb.ts`

```typescript
import mongoose from "mongoose";

async function connectMongoDB() {
    try {
        await mongoose.connect(
            process.env.MONGODB_URI!
        );

        console.log("MongoDB connected successfully");

    } catch (error) {
        console.error("MongoDB connection failed", error);

        throw error;
    }
}

export default connectMongoDB;
```

## 15.3 Create a Mongoose User Schema

`src/models/mongo-user.model.ts`

```typescript
import mongoose, {
    Schema,
    Model
} from "mongoose";

interface IUser {
    name: string;
    email: string;
    passwordHash: string;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
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

const MongoUser: Model<IUser> =
    mongoose.model<IUser>("User", userSchema);

export default MongoUser;
```

## 15.4 Create a MongoDB Repository

```typescript
import MongoUser from "../models/mongo-user.model.js";

class MongoUserRepository {

    async findAll() {
        return MongoUser.find()
            .select("-passwordHash")
            .lean();
    }

    async findByEmail(email: string) {
        return MongoUser.findOne({ email });
    }

    async create(data: {
        name: string;
        email: string;
        passwordHash: string;
    }) {
        return MongoUser.create(data);
    }
}

export default new MongoUserRepository();
```

## 15.5 Sequelize vs Mongoose

| Feature | Sequelize | Mongoose |
|---|---|---|
| Database | Relational databases | MongoDB |
| Data structure | Tables and rows | Documents and collections |
| Schema | Model definitions | Schemas |
| Relationships | Associations | References and population |
| Transactions | Supported | Supported |
| Query style | ORM methods | MongoDB-style model queries |
| Primary purpose | SQL database modeling | MongoDB document modeling |

Choose the database according to your application's data and consistency requirements.

---

# 16. Database Transactions

A transaction groups multiple database operations into one logical unit.

The goal is to prevent partially completed operations.

Consider transferring money between two accounts.

You need to:

1. Deduct money from account A.
2. Add money to account B.

If the first operation succeeds but the second fails, the data becomes inconsistent.

Transactions solve this problem.

## 16.1 Sequelize Transaction Example

```typescript
import sequelize from "../config/database.js";

async function transferMoney(
    fromAccountId: number,
    toAccountId: number,
    amount: number
) {
    return sequelize.transaction(async transaction => {

        const fromAccount = await Account.findByPk(
            fromAccountId,
            {
                transaction,
                lock: transaction.LOCK.UPDATE
            }
        );

        const toAccount = await Account.findByPk(
            toAccountId,
            {
                transaction,
                lock: transaction.LOCK.UPDATE
            }
        );

        if (!fromAccount || !toAccount) {
            throw new Error("Account not found");
        }

        if (fromAccount.balance < amount) {
            throw new Error("Insufficient balance");
        }

        await fromAccount.update(
            {
                balance: fromAccount.balance - amount
            },
            { transaction }
        );

        await toAccount.update(
            {
                balance: toAccount.balance + amount
            },
            { transaction }
        );

        return {
            success: true
        };
    });
}
```

Here, `Account` represents a Sequelize model with a numeric `balance` property.

If the callback throws an error, Sequelize rolls back the transaction.

If it completes successfully, Sequelize commits it.

**Important:**

- Use database constraints and appropriate isolation levels.
- Validate that the transfer amount is positive.
- Prevent concurrent balance updates from causing inconsistencies.
- Ensure the database engine supports transactions.
- Do not assume a database transaction can automatically roll back external API calls.

## 16.2 MongoDB Transactions

MongoDB supports transactions when using a suitable deployment, such as a replica set or sharded cluster.

Example:

```typescript
import mongoose from "mongoose";

async function createOrder() {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {

            await Order.create(
                [{
                    total: 1000,
                    status: "pending"
                }],
                { session }
            );

            await Inventory.updateOne(
                { productId: 1 },
                {
                    $inc: {
                        quantity: -1
                    }
                },
                { session }
            );
        });

    } finally {
        await session.endSession();
    }
}
```

If an operation fails inside the transaction, the transaction is aborted.

---

# 17. Pagination, Filtering and Sorting

Large applications should not return thousands of records in one response.

Use pagination.

## 17.1 Offset-Based Pagination

Suppose the API is:

```text
GET /api/users?page=2&limit=10
```

Calculate:

```typescript
const page = 2;
const limit = 10;

const offset = (page - 1) * limit;
```

Result:

```typescript
offset = 10;
```

This means the database skips the first 10 records and retrieves the next 10.

## 17.2 Sequelize Pagination

```typescript
async function getUsers(
    page: number,
    limit: number
) {
    const offset = (page - 1) * limit;

    const result = await UserModel.findAndCountAll({
        limit,
        offset,
        order: [["createdAt", "DESC"]],
        attributes: {
            exclude: ["passwordHash"]
        }
    });

    return {
        data: result.rows,
        pagination: {
            total: result.count,
            page,
            limit,
            totalPages: Math.ceil(
                result.count / limit
            )
        }
    };
}
```

## 17.3 Filtering

Example:

```text
GET /api/users?search=john
```

Using Sequelize:

```typescript
import { Op } from "sequelize";

async function searchUsers(search: string) {
    return UserModel.findAll({
        where: {
            name: {
                [Op.like]: `%${search}%`
            }
        }
    });
}
```

## 17.4 Sorting

Example:

```text
GET /api/users?sortBy=name&order=ASC
```

Do not pass arbitrary user-provided column names directly into database query construction.

Use an allowlist:

```typescript
const allowedSortFields = [
    "name",
    "email",
    "createdAt"
] as const;

type SortField =
    typeof allowedSortFields[number];

function isSortField(
    value: string
): value is SortField {
    return (
        allowedSortFields as readonly string[]
    ).includes(value);
}
```

Now you can validate the requested sorting field before querying.

---

# 18. File Uploads with TypeScript

Many backend applications need file uploads.

Examples:

- Profile pictures.
- Product images.
- Documents.
- PDFs.
- Excel files.
- Audio files.

Express commonly uses Multer for multipart file uploads.

## 18.1 Install Multer

```bash
npm install multer
```

Install types:

```bash
npm install -D @types/multer
```

## 18.2 Configure Multer

```typescript
import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "uploads/");
    },

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

This sets a 5 MB file-size limit.

## 18.3 Create Upload Route

```typescript
import { Router } from "express";

import upload from "../config/multer.js";

const router = Router();

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

        res.status(201).json({
            message: "File uploaded successfully",
            filename: req.file.filename
        });
    }
);

export default router;
```

## 18.4 File Upload Security

Never trust the uploaded file's original name, extension or MIME type.

For production:

- Validate allowed file types.
- Inspect actual file contents when appropriate.
- Limit file size.
- Generate safe server-side filenames.
- Store uploads outside publicly executable directories.
- Use malware scanning where appropriate.
- Restrict access to private documents.
- Consider object storage such as AWS S3.

MIME type checking alone is not sufficient to guarantee that a file is safe.

---

# 19. Backend Security Best Practices

Security is a fundamental part of backend development.

Let's review important practices.

## 19.1 Use Helmet

Install:

```bash
npm install helmet
```

Register:

```typescript
import helmet from "helmet";

app.use(helmet());
```

Helmet configures several HTTP security headers.

## 19.2 Rate Limiting

Install:

```bash
npm install express-rate-limit
```

Example:

```typescript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false
});

app.use(limiter);
```

This limits repeated requests from a client according to the configured policy.

For distributed production environments, use an appropriate shared store rather than relying solely on process-local memory.

## 19.3 CORS

Install:

```bash
npm install cors
npm install -D @types/cors
```

Example:

```typescript
import cors from "cors";

app.use(cors({
    origin: "https://example.com",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));
```

CORS controls which browser origins are allowed to access your API.

It is not an authentication or authorization mechanism.

## 19.4 Environment Variables

Never hardcode:

- Database passwords.
- JWT secrets.
- API keys.
- Cloud credentials.

Use environment variables or a secure secrets manager.

## 19.5 Additional Security Checklist

| Security Practice | Purpose |
|---|---|
| Password hashing | Protect stored passwords |
| JWT verification | Verify token integrity |
| Input validation | Reject invalid input |
| Parameterized queries | Reduce SQL injection risk |
| RBAC | Restrict user permissions |
| Rate limiting | Reduce abuse |
| Helmet | Configure security headers |
| CORS configuration | Restrict browser origins |
| HTTPS | Encrypt network traffic |
| Secure cookies | Protect cookie-based sessions |
| Audit logging | Track important actions |
| Dependency updates | Address known vulnerabilities |

---

# 20. Logging and Monitoring

Logging helps you understand what is happening inside a backend application.

Avoid relying entirely on `console.log()` in production.

Popular logging tools include:

- Winston.
- Pino.
- Morgan.

## 20.1 Install Winston

```bash
npm install winston
```

## 20.2 Create a Logger

```typescript
import winston from "winston";

const logger = winston.createLogger({
    level: "info",

    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),

    transports: [
        new winston.transports.Console(),

        new winston.transports.File({
            filename: "logs/error.log",
            level: "error"
        }),

        new winston.transports.File({
            filename: "logs/combined.log"
        })
    ]
});

export default logger;
```

## 20.3 Use Logger

```typescript
import logger from "./config/logger.js";

logger.info("Server started");

logger.error("Database connection failed");
```

## 20.4 Important Logging Practices

Log:

- Request IDs.
- Request methods.
- Response status codes.
- Processing time.
- Database failures.
- Authentication failures.
- Important business events.

Never log:

- Plain-text passwords.
- JWT secrets.
- Private access tokens.
- Sensitive personal information unnecessarily.

For distributed applications, structured logging and request correlation IDs are especially valuable.

---

# 21. Testing TypeScript Backend Applications

Testing ensures that your backend behaves as expected.

There are several testing levels.

| Testing Type | Purpose |
|---|---|
| Unit Testing | Test individual functions |
| Integration Testing | Test multiple components together |
| API Testing | Test HTTP endpoints |
| End-to-End Testing | Test complete application workflows |

## 21.1 Install Vitest

```bash
npm install -D vitest
```

Add a script:

```json
{
    "scripts": {
        "test": "vitest"
    }
}
```

## 21.2 Create a Simple Unit Test

Create:

`src/utils/math.ts`

```typescript
export function add(
    a: number,
    b: number
): number {
    return a + b;
}
```

Create:

`src/utils/math.test.ts`

```typescript
import { describe, it, expect } from "vitest";

import { add } from "./math.js";

describe("add", () => {

    it("should add two numbers", () => {

        const result = add(10, 20);

        expect(result).toBe(30);
    });

});
```

Run:

```bash
npm test
```

## 21.3 Integration Testing with Supertest

Install:

```bash
npm install -D supertest @types/supertest
```

Supertest allows you to test HTTP endpoints.

Example:

```typescript
import request from "supertest";

import { describe, it, expect } from "vitest";

import app from "../app.js";

describe("GET /", () => {

    it("should return server response", async () => {

        const response = await request(app)
            .get("/");

        expect(response.status).toBe(200);

    });

});
```

This tests the HTTP application without manually starting a separate server.

---

# 22. Production-Ready Backend Architecture

Let's combine what you have learned.

A professional TypeScript backend may follow this structure:

```text
src/
│
├── config/
│   ├── environment.ts
│   ├── database.ts
│   ├── logger.ts
│   └── multer.ts
│
├── modules/
│   │
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.routes.ts
│   │   ├── auth.validator.ts
│   │   └── auth.types.ts
│   │
│   ├── users/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.repository.ts
│   │   ├── user.model.ts
│   │   ├── user.routes.ts
│   │   ├── user.validator.ts
│   │   └── user.types.ts
│   │
│   ├── products/
│   │   ├── product.controller.ts
│   │   ├── product.service.ts
│   │   ├── product.repository.ts
│   │   ├── product.model.ts
│   │   ├── product.routes.ts
│   │   ├── product.validator.ts
│   │   └── product.types.ts
│   │
│   └── orders/
│       ├── order.controller.ts
│       ├── order.service.ts
│       ├── order.repository.ts
│       ├── order.model.ts
│       ├── order.routes.ts
│       ├── order.validator.ts
│       └── order.types.ts
│
├── middlewares/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   ├── validation.middleware.ts
│   └── rate-limit.middleware.ts
│
├── errors/
│   └── app-error.ts
│
├── utils/
│   ├── async-handler.ts
│   └── response.ts
│
├── types/
│   └── express.d.ts
│
├── app.ts
└── server.ts
```

### Request Lifecycle

```text
Client
  |
  v
HTTP Request
  |
  v
Express Application
  |
  v
Security Middleware
  |
  v
Request Logger
  |
  v
Rate Limiter
  |
  v
Route
  |
  v
Authentication
  |
  v
Authorization
  |
  v
Validation
  |
  v
Controller
  |
  v
Service
  |
  v
Repository
  |
  v
Database
  |
  v
Response
```

This is a typical layered backend flow. The exact ordering of middleware can vary according to application requirements.

---

# 23. Complete Practical Project: E-Commerce REST API

Now let's apply the concepts to a real-world project.

## Project: TypeScript E-Commerce Backend

### Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| TypeScript | Static typing |
| Express.js | Backend framework |
| MySQL | Relational database |
| Sequelize | ORM |
| JWT | Authentication |
| bcrypt | Password hashing |
| Zod | Runtime validation |
| Multer | File uploads |
| Winston | Logging |
| Helmet | Security headers |
| express-rate-limit | Rate limiting |
| Vitest | Unit testing |
| Supertest | API testing |

## 23.1 Functional Requirements

### Authentication Module

- User registration.
- User login.
- Password hashing.
- JWT generation.
- Token verification.
- Logout/session revocation strategy.
- Password reset workflow.

### User Module

- Get profile.
- Update profile.
- Delete account.
- Get all users (admin only).
- Change user role (admin only).

### Product Module

- Create product.
- Get products.
- Get product by ID.
- Update product.
- Delete product.
- Upload product images.
- Search products.
- Filter by category.
- Sort by price.

### Category Module

- Create category.
- Update category.
- Delete category.
- Get categories.

### Cart Module

- Add product to cart.
- Remove product from cart.
- Update quantity.
- View cart.
- Calculate cart total.

### Order Module

- Place order.
- Get order history.
- Get order details.
- Update order status.
- Cancel order.

### Admin Module

- Dashboard.
- User management.
- Product management.
- Order management.
- Sales reports.

## 23.2 Suggested Database Tables

```text
users
-----
id
name
email
password_hash
role
created_at
updated_at


products
--------
id
name
description
price
stock
category_id
created_at
updated_at


categories
----------
id
name
description


carts
-----
id
user_id
created_at


cart_items
----------
id
cart_id
product_id
quantity


orders
------
id
user_id
total_amount
status
created_at


order_items
-----------
id
order_id
product_id
quantity
price
```

Additional production considerations:

- Unique constraints.
- Foreign keys.
- Database indexes.
- Decimal monetary values.
- Inventory concurrency control.
- Order snapshots.
- Payment reconciliation.
- Audit trails.

## 23.3 Important Business Rules

1. Users cannot access another user's private cart.
2. Customers cannot modify product prices.
3. Customers cannot access admin endpoints.
4. Product stock cannot become negative.
5. An order cannot be placed with an invalid cart.
6. Order creation and inventory updates must be consistent.
7. Password hashes must never be returned in API responses.
8. Payment status must be verified using a trusted payment provider.
9. Repeated payment callbacks must not create duplicate orders or payments.
10. Sensitive administrative operations must be logged.

## 23.4 Example API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/users/profile` | Authenticated |
| PATCH | `/api/users/profile` | Authenticated |
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |
| POST | `/api/products` | Admin |
| PATCH | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |
| POST | `/api/cart/items` | Authenticated |
| GET | `/api/cart` | Authenticated |
| POST | `/api/orders` | Authenticated |
| GET | `/api/orders` | Authenticated |
| GET | `/api/admin/dashboard` | Admin |

This project combines almost every important topic from this phase.

---

# 24. Common TypeScript Backend Mistakes

| Mistake | Better Approach |
|---|---|
| Using `any` everywhere | Use specific types and `unknown` |
| Trusting request body types | Validate using Zod |
| Putting SQL queries in controllers | Use repositories |
| Putting all logic in routes | Separate controllers and services |
| Storing plain-text passwords | Use bcrypt or Argon2 |
| Exposing password hashes | Exclude sensitive fields |
| Ignoring async errors | Centralized error middleware |
| Hardcoding secrets | Use environment variables or secret managers |
| Using `sync({ force: true })` in production | Use migrations |
| Trusting JWT payload without verification | Verify signature and claims |
| Using JWT as encrypted storage | Treat signed JWT payloads as readable |
| Returning every database record | Implement pagination |
| Trusting uploaded file extensions | Validate file content and type |
| Allowing arbitrary sorting columns | Use an allowlist |
| Ignoring database transactions | Use transactions for related operations |
| Treating CORS as authentication | Implement actual authentication and authorization |

---

# 25. Advanced Interview Questions and Answers

## Node.js and TypeScript

**Q1. Why use TypeScript with Node.js?**

TypeScript provides static type checking, better autocomplete, safer refactoring and improved maintainability.

**Q2. Does Node.js execute TypeScript directly?**

Modern Node.js supports limited TypeScript type stripping, but this does not perform full TypeScript type checking or support every TypeScript feature. A compiler-based workflow is still useful.

**Q3. What is the difference between `tsx` and `tsc`?**

`tsx` executes TypeScript conveniently during development. `tsc` performs type checking and compilation.

**Q4. What is the purpose of `rootDir` and `outDir`?**

`rootDir` specifies source files' root directory, while `outDir` specifies where compiled output is written.

**Q5. Why use `strict: true`?**

It enables a group of stricter compiler checks that help identify potential errors.

## Express.js

**Q6. What is Express middleware?**

A function that executes during the request-response lifecycle and can process requests, responses or errors.

**Q7. What is the difference between `req.params`, `req.query` and `req.body`?**

- `params`: URL path parameters.
- `query`: URL query parameters.
- `body`: Request payload.

**Q8. How do you type Express request bodies?**

Use Express's `Request` generic parameters.

**Q9. What is Express error middleware?**

A middleware function with four parameters: `error`, `req`, `res` and `next`.

**Q10. Why extend the Express Request interface?**

To add application-specific properties, such as authenticated user information, to the request type.

**Q11. Does extending Request validate the request at runtime?**

No. It changes TypeScript's compile-time understanding only.

## Validation and REST APIs

**Q12. Why is runtime validation necessary?**

External clients can send arbitrary data, regardless of TypeScript interfaces.

**Q13. What is Zod?**

A schema validation library that provides runtime validation and TypeScript type inference.

**Q14. What is the difference between `parse()` and `safeParse()`?**

`parse()` throws on invalid data, while `safeParse()` returns a success/error result.

**Q15. What is the difference between PUT and PATCH?**

PUT generally replaces a resource representation, while PATCH applies a partial modification.

**Q16. What is REST?**

REST is an architectural style for designing networked applications around resources and standardized interactions.

## Authentication and Security

**Q17. What is JWT?**

JSON Web Token is a token format used to represent claims between systems.

**Q18. What are the three parts of JWT?**

Header, payload and signature.

**Q19. Is JWT payload encrypted?**

Not by default. A signed JWT payload is generally readable.

**Q20. What is the difference between authentication and authorization?**

Authentication verifies identity; authorization checks permissions.

**Q21. Why should passwords be hashed?**

To prevent stored passwords from being directly exposed if the database is compromised.

**Q22. What is RBAC?**

Role-Based Access Control assigns permissions based on user roles.

**Q23. What is CORS?**

Cross-Origin Resource Sharing is a browser security mechanism controlling cross-origin requests.

**Q24. Does CORS protect an API from unauthorized users?**

No. Authentication and authorization must be implemented separately.

## Database and ORM

**Q25. What is Sequelize?**

An ORM for relational databases.

**Q26. What is Mongoose?**

An ODM for MongoDB.

**Q27. What is a repository pattern?**

A pattern that separates data-access operations from business logic.

**Q28. What is a database transaction?**

A group of operations treated as a logical unit with transaction guarantees.

**Q29. What is the difference between Sequelize and Mongoose?**

Sequelize is primarily for relational databases, while Mongoose is designed for MongoDB.

**Q30. Why use migrations?**

Migrations provide controlled, versioned database schema changes.

## Testing and Production

**Q31. What is unit testing?**

Testing an individual function or component in isolation.

**Q32. What is integration testing?**

Testing how multiple components work together.

**Q33. What is Supertest?**

A library for testing HTTP servers and Express applications.

**Q34. Why use Winston or Pino?**

They provide structured application logging and configurable transports.

**Q35. What is rate limiting?**

Restricting the number of requests a client can make within a defined period.

**Q36. What is Helmet?**

An Express middleware package that configures HTTP security headers.

**Q37. Why use pagination?**

To reduce database and network load when retrieving large datasets.

**Q38. Why should database queries not be written directly inside controllers?**

Separating data access improves maintainability, testability and reuse.

**Q39. Why use dependency injection?**

It reduces tight coupling and makes dependencies easier to replace and test.

**Q40. What makes a TypeScript backend production-ready?**

Reliable architecture, validation, error handling, security, database consistency, testing, logging, monitoring and deployment practices.

---

# 26. Practical Exercises

Complete these exercises in order.

## Level 1: Node.js and Express

1. Create a TypeScript Node.js project.
2. Configure `tsconfig.json`.
3. Create a development script using `tsx`.
4. Build an Express server.
5. Create GET, POST, PUT, PATCH and DELETE routes.
6. Define strongly typed route parameters.
7. Define strongly typed request bodies.
8. Create a custom request logger.
9. Create middleware with configuration.
10. Extend the Express Request interface.

## Level 2: API Architecture

11. Create a modular Express application.
12. Separate routes, controllers and services.
13. Create a reusable async handler.
14. Implement custom application errors.
15. Implement centralized error handling.
16. Build a reusable API response helper.
17. Validate request bodies using Zod.
18. Validate route parameters.
19. Validate query parameters.
20. Build a complete CRUD API.

## Level 3: Authentication and Authorization

21. Implement user registration.
22. Hash passwords using bcrypt.
23. Implement login.
24. Generate JWT tokens.
25. Verify JWT tokens.
26. Create authentication middleware.
27. Create role-based authorization middleware.
28. Implement admin-only endpoints.
29. Implement password reset using secure tokens.
30. Design a session/token revocation strategy.

## Level 4: Database Integration

31. Connect MySQL with Sequelize.
32. Create typed Sequelize models.
33. Implement a repository layer.
34. Implement a service layer.
35. Create database migrations.
36. Implement database transactions.
37. Connect MongoDB with Mongoose.
38. Create typed Mongoose schemas.
39. Implement pagination.
40. Implement filtering and sorting.

## Level 5: Production Backend

41. Implement file uploads using Multer.
42. Implement Helmet.
43. Implement rate limiting.
44. Configure CORS.
45. Implement structured logging.
46. Write unit tests using Vitest.
47. Write API integration tests using Supertest.
48. Implement centralized environment validation.
49. Add database health checks.
50. Build a complete e-commerce backend.

---

# 27. Phase 70 Completion Checklist

| No. | Topic | Completed |
|---|---|---|
| 1 | TypeScript with Node.js | ☐ |
| 2 | tsconfig Configuration | ☐ |
| 3 | Node.js Module System | ☐ |
| 4 | Express with TypeScript | ☐ |
| 5 | Request and Response Types | ☐ |
| 6 | Route Parameter Typing | ☐ |
| 7 | Request Body Typing | ☐ |
| 8 | Project Architecture | ☐ |
| 9 | Controllers and Services | ☐ |
| 10 | Custom Middleware | ☐ |
| 11 | Express Request Augmentation | ☐ |
| 12 | Async Error Handling | ☐ |
| 13 | Centralized Error Handling | ☐ |
| 14 | Zod Validation | ☐ |
| 15 | Type-Safe REST APIs | ☐ |
| 16 | JWT Authentication | ☐ |
| 17 | Password Hashing | ☐ |
| 18 | Role-Based Authorization | ☐ |
| 19 | Sequelize Integration | ☐ |
| 20 | Sequelize Models | ☐ |
| 21 | Repository Pattern | ☐ |
| 22 | Service Pattern | ☐ |
| 23 | Mongoose Integration | ☐ |
| 24 | MongoDB Transactions | ☐ |
| 25 | SQL Transactions | ☐ |
| 26 | Pagination | ☐ |
| 27 | Filtering and Sorting | ☐ |
| 28 | File Uploads | ☐ |
| 29 | Helmet | ☐ |
| 30 | Rate Limiting | ☐ |
| 31 | CORS | ☐ |
| 32 | Environment Variables | ☐ |
| 33 | Logging | ☐ |
| 34 | Unit Testing | ☐ |
| 35 | Integration Testing | ☐ |
| 36 | Production Architecture | ☐ |
| 37 | Complete REST API Project | ☐ |

---

# 28. What Comes Next?

You have now covered TypeScript backend development with Node.js, Express.js, REST APIs, middleware, JWT authentication, authorization, MySQL, MongoDB, ORM/ODM integration, testing and production architecture.

The next phase will focus on frontend development with TypeScript.

## Phase 71: Advanced TypeScript – TypeScript with React.js, Component Architecture, Props, State, Hooks, Context API, Custom Hooks, Forms, API Integration and Enterprise React Development

Upcoming topics:

1. TypeScript with React.
2. React project setup with TypeScript.
3. Functional component typing.
4. Props and children typing.
5. Optional and default props.
6. React state typing.
7. `useState` with generics.
8. `useEffect` typing.
9. `useRef` typing.
10. `useReducer` typing.
11. Context API with TypeScript.
12. Custom hooks.
13. Event handling.
14. Form handling.
15. Form validation with Zod.
16. React component composition.
17. Generic React components.
18. Type-safe API integration.
19. React Query and TypeScript.
20. Redux Toolkit with TypeScript.
21. Zustand with TypeScript.
22. React Router with TypeScript.
23. Error boundaries.
24. Reusable component libraries.
25. Advanced React patterns.
26. Enterprise React project architecture.

**Phase 70 is complete.** Say **"OK, Continue to Phase 71"** when you are ready for the next lesson.