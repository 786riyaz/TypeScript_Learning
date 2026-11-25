# Phase 48: Advanced TypeScript – Express.js, Middleware Architecture, Controllers, Services, Validation and REST API Development

**Level:** Expert  
**Prerequisites:** TypeScript fundamentals, advanced generics, Node.js runtime APIs, asynchronous programming, HTTP fundamentals, and backend architecture.

---

# 1. Learning Objectives

In this phase, you will learn how to build professional backend applications using Express.js and TypeScript.

By the end of this phase, you should understand:

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

---

# 2. Introduction to Express.js

Express.js is a lightweight web application framework built on top of Node.js.

It simplifies the development of HTTP servers and REST APIs.

Without Express.js, you need to handle many HTTP operations manually using Node.js's built-in HTTP module.

With Express.js, you get convenient abstractions for:

- Routing.
- Middleware.
- Request handling.
- Response handling.
- Error handling.
- HTTP methods.
- Application configuration.

## 2.1 Node.js HTTP vs Express.js

### Using Native Node.js

```ts
import { createServer } from "node:http";

const server = createServer((req, res) => {
    if (req.method === "GET" && req.url === "/users") {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(
            JSON.stringify({
                message: "Users fetched"
            })
        );

        return;
    }

    res.writeHead(404);

    res.end("Not Found");
});

server.listen(5000);
```

### Using Express.js

```ts
import express from "express";

const app = express();

app.get("/users", (req, res) => {
    res.json({
        message: "Users fetched"
    });
});

app.listen(5000);
```

Express reduces boilerplate and provides a structured way to build APIs.

## 2.2 Why Use Express with TypeScript?

Express handles HTTP operations, while TypeScript provides compile-time type checking.

For example:

```ts
interface User {
    id: number;
    name: string;
    email: string;
}

const user: User = {
    id: 1,
    name: "John",
    email: "john@example.com"
};
```

You can use these types throughout your backend application.

Benefits:

- Better autocomplete.
- Fewer type-related errors.
- Clearer API contracts.
- Easier refactoring.
- Improved maintainability.
- Better developer experience.

**Important:** TypeScript does not automatically validate incoming HTTP requests. Runtime validation is still necessary.

---

# 3. Setting Up Express.js with TypeScript

Let's create a new project.

## 3.1 Initialize Project

```bash
mkdir express-typescript
cd express-typescript

npm init -y
```

## 3.2 Install Dependencies

Install Express:

```bash
npm install express
```

Install TypeScript and development dependencies:

```bash
npm install -D typescript tsx @types/node @types/express
```

Install Zod for request validation:

```bash
npm install zod
```

Install development testing dependencies:

```bash
npm install -D vitest supertest @types/supertest
```

## 3.3 Initialize TypeScript

```bash
npx tsc --init
```

## 3.4 Configure tsconfig.json

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

        "forceConsistentCasingInFileNames": true,

        "sourceMap": true,

        "declaration": true
    },

    "include": ["src/**/*", "tests/**/*"],
    "exclude": ["node_modules", "dist"]
}
```

For this example, use ES modules.

Add the following to `package.json`:

```json
{
    "type": "module"
}
```

## 3.5 Configure Scripts

Add:

```json
{
    "scripts": {
        "dev": "tsx watch src/server.ts",
        "build": "tsc",
        "start": "node dist/server.js",
        "typecheck": "tsc --noEmit",
        "test": "vitest run"
    }
}
```

You can now use:

```bash
npm run dev
```

to start development.

---

# 4. Express Application Architecture

Before writing code, understand how a professional Express application is organized.

A basic application might look like this:

```text
express-typescript/
│
├── src/
│   │
│   ├── config/
│   │   ├── env.ts
│   │   └── database.ts
│   │
│   ├── controllers/
│   │   └── user.controller.ts
│   │
│   ├── services/
│   │   └── user.service.ts
│   │
│   ├── repositories/
│   │   └── user.repository.ts
│   │
│   ├── routes/
│   │   └── user.routes.ts
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   │
│   ├── validators/
│   │   └── user.validator.ts
│   │
│   ├── types/
│   │   └── express.d.ts
│   │
│   ├── utils/
│   │   └── async-handler.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── tests/
│
├── package.json
└── tsconfig.json
```

## 4.1 Responsibilities of Each Layer

| Layer | Responsibility |
|---|---|
| Routes | Define API endpoints |
| Controllers | Handle HTTP requests and responses |
| Services | Implement business logic |
| Repositories | Handle data access |
| Middlewares | Execute cross-cutting request logic |
| Validators | Validate incoming data |
| Config | Manage application configuration |
| Types | Store shared TypeScript types |
| Utils | Store reusable utility functions |
| App | Configure Express application |
| Server | Start the HTTP server |

The most important separation is:

```text
Client
  |
  v
Route
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
Repository
  |
  v
Database
```

Not every application needs every layer. Introduce abstractions when they provide meaningful separation or testability.

---

# 5. Creating Your First Express Server

Create:

```text
src/app.ts
```

Code:

```ts
import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to Express TypeScript API");
});

export default app;
```

Create:

```text
src/server.ts
```

Code:

```ts
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

Response:

```text
Welcome to Express TypeScript API
```

## 5.1 Why Separate `app.ts` and `server.ts`?

This is an important architectural decision.

`app.ts`:

- Creates Express application.
- Registers middleware.
- Registers routes.
- Registers error handlers.
- Exports the application.

`server.ts`:

- Starts the HTTP server.
- Manages process signals.
- Coordinates startup and shutdown.

This separation makes application testing easier because tests can import `app.ts` without automatically opening a network port.

---

# 6. Understanding Express Type Definitions

Express provides TypeScript types through `@types/express`.

Important types include:

```ts
import type {
    Request,
    Response,
    NextFunction,
    RequestHandler,
    Application,
    Router
} from "express";
```

Let's understand them.

| Type | Purpose |
|---|---|
| `Request` | Incoming HTTP request |
| `Response` | Outgoing HTTP response |
| `NextFunction` | Moves execution to the next middleware |
| `RequestHandler` | Type of an Express request handler |
| `Application` | Express application |
| `Router` | Express router |

Example:

```ts
import type {
    Request,
    Response
} from "express";

function getUsers(
    req: Request,
    res: Response
) {
    res.json({
        message: "Users fetched"
    });
}
```

You can also use:

```ts
import type {
    RequestHandler
} from "express";

const getUsers: RequestHandler = (req, res) => {
    res.json({
        message: "Users fetched"
    });
};
```

`RequestHandler` is especially useful when creating reusable middleware and controllers.

---

# 7. Type-Safe Express Requests and Responses

An Express request contains several properties.

```ts
req.params;

req.query;

req.body;

req.headers;

req.method;

req.url;
```

Let's understand how to type them.

The Express `Request` type supports generic parameters.

Conceptually:

```ts
Request<
    Params,
    ResponseBody,
    RequestBody,
    Query,
    Locals
>
```

These represent:

1. Route parameters.
2. Response body type.
3. Request body type.
4. Query parameter type.
5. Response local variables type.

## 7.1 Typing Request Body

Suppose an API accepts:

```json
{
    "name": "John",
    "email": "john@example.com"
}
```

Define:

```ts
interface CreateUserRequest {
    name: string;
    email: string;
}
```

Use it:

```ts
import type {
    Request,
    Response
} from "express";

function createUser(
    req: Request<
        {},
        {},
        CreateUserRequest
    >,
    res: Response
) {
    const name = req.body.name;

    const email = req.body.email;

    res.json({
        name,
        email
    });
}
```

Now TypeScript understands the expected body structure.

However, this type does not guarantee that the client actually sends valid data.

Runtime validation is necessary.

## 7.2 Typing Route Parameters

Consider:

```text
GET /users/123
```

Route:

```ts
app.get("/users/:id", (req, res) => {
    console.log(req.params.id);
});
```

Define:

```ts
interface UserParams {
    id: string;
}
```

Use:

```ts
import type {
    Request,
    Response
} from "express";

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

**Important:** Route parameters are strings, even if they represent numeric IDs.

Convert and validate them:

```ts
const userId = Number(req.params.id);

if (!Number.isInteger(userId) || userId <= 0) {
    res.status(400).json({
        message: "Invalid user ID"
    });

    return;
}
```

## 7.3 Typing Query Parameters

Consider:

```text
GET /users?page=2&limit=10
```

Define:

```ts
interface UserQuery {
    page?: string;
    limit?: string;
}
```

Use:

```ts
import type {
    Request,
    Response
} from "express";

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

Query parameters are typically parsed as strings or arrays/objects depending on the query parser configuration.

Do not assume that a query parameter is already a number.

---

# 8. Type-Safe Request and Response Contracts

A clean API should define request and response contracts.

Example:

```ts
interface User {
    id: number;
    name: string;
    email: string;
}

interface CreateUserRequest {
    name: string;
    email: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
```

Use:

```ts
import type {
    Request,
    Response
} from "express";

function createUser(
    req: Request<
        {},
        ApiResponse<User>,
        CreateUserRequest
    >,
    res: Response<ApiResponse<User>>
) {
    const user: User = {
        id: 1,
        name: req.body.name,
        email: req.body.email
    };

    res.status(201).json({
        success: true,
        message: "User created",
        data: user
    });
}
```

Now the response structure is also documented in TypeScript.

**Important:** Express response generics help with compile-time checking of your code. They do not validate JSON sent over the network.

---

# 9. Express Middleware Architecture

Middleware is one of the most important concepts in Express.

A middleware function executes during the request-response cycle.

It can:

1. Execute code.
2. Read the request.
3. Modify the request or response.
4. End the response.
5. Pass control to the next middleware.

General structure:

```ts
function middleware(
    req,
    res,
    next
) {
    // Logic

    next();
}
```

## 9.1 Middleware Execution Flow

Consider:

```ts
app.use(middleware1);

app.use(middleware2);

app.get("/", controller);
```

Execution:

```text
Incoming Request
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
 Response
```

Middleware executes in registration order.

## 9.2 Types of Middleware

| Middleware Type | Purpose |
|---|---|
| Application-level | Registered on the Express application |
| Router-level | Registered on an Express router |
| Built-in | Provided by Express |
| Third-party | Provided by external packages |
| Error-handling | Handles errors |
| Authentication | Identifies users |
| Authorization | Checks permissions |
| Validation | Validates incoming data |

---

# 10. Built-in Express Middleware

Express provides several built-in middleware functions.

## 10.1 `express.json()`

Parses incoming JSON request bodies.

```ts
app.use(express.json());
```

Without it, JSON request bodies are not automatically parsed into `req.body`.

Example request:

```json
{
    "name": "John"
}
```

After parsing:

```ts
req.body.name;
```

## 10.2 `express.urlencoded()`

Parses URL-encoded form data.

```ts
app.use(express.urlencoded({
    extended: true
}));
```

Example:

```text
name=John&age=25
```

## 10.3 `express.static()`

Serves static files.

```ts
app.use(
    "/uploads",
    express.static("uploads")
);
```

Now files inside the uploads directory can be accessed through:

```text
/uploads/photo.png
```

**Security consideration:** Do not expose sensitive files or private upload directories through public static middleware.

---

# 11. Creating Custom Middleware

Let's create a logging middleware.

```ts
import type {
    Request,
    Response,
    NextFunction
} from "express";

function loggerMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): void {

    console.log({
        method: req.method,
        url: req.originalUrl,
        time: new Date().toISOString()
    });

    next();
}
```

Register it:

```ts
app.use(loggerMiddleware);
```

Now every request passing through this middleware is logged.

## 11.1 Middleware with `RequestHandler`

You can also write:

```ts
import type {
    RequestHandler
} from "express";

const loggerMiddleware: RequestHandler = (
    req,
    res,
    next
) => {

    console.log(req.method, req.url);

    next();
};
```

This is a clean approach for reusable middleware.

## 11.2 Middleware That Ends the Request

Middleware does not always need to call `next()`.

```ts
const maintenanceMiddleware: RequestHandler = (
    req,
    res,
    next
) => {

    const maintenanceMode = false;

    if (maintenanceMode) {
        res.status(503).json({
            message: "Service temporarily unavailable"
        });

        return;
    }

    next();
};
```

If middleware sends a response, it should not continue to the next handler.

---

# 12. Middleware Execution Order

Consider:

```ts
app.use(loggerMiddleware);

app.use(express.json());

app.use(authMiddleware);

app.use("/users", userRoutes);

app.use(errorMiddleware);
```

Execution order:

```text
Request
  |
  v
Logger Middleware
  |
  v
JSON Middleware
  |
  v
Authentication Middleware
  |
  v
User Routes
  |
  v
Controller
  |
  v
Response
```

The error middleware is registered last.

This is important because error handlers generally need to be registered after the routes and middleware that may forward errors to them.

---

# 13. Router-Level Middleware

Express Router allows you to organize routes into separate modules.

Create:

```text
src/routes/user.routes.ts
```

Code:

```ts
import {
    Router
} from "express";

const router = Router();

router.get("/", (req, res) => {
    res.json({
        message: "Get all users"
    });
});

router.get("/:id", (req, res) => {
    res.json({
        message: "Get user by ID",
        id: req.params.id
    });
});

export default router;
```

Register:

```ts
import userRoutes from "./routes/user.routes.js";

app.use("/api/users", userRoutes);
```

Now the routes become:

```text
GET /api/users

GET /api/users/:id
```

## 13.1 Router-Level Middleware

```ts
const router = Router();

router.use((req, res, next) => {
    console.log("User router middleware");

    next();
});

router.get("/", (req, res) => {
    res.json({
        message: "Users"
    });
});
```

This middleware executes for requests handled by the router after its registration.

---

# 14. Custom Request Types

Sometimes you need to attach additional properties to the Express request object.

For example, after authentication, you might want:

```ts
req.user
```

But Express's default Request type does not include your application's custom user property.

There are two common approaches.

## 14.1 Approach One: Extend Request

Create:

```text
src/types/express.d.ts
```

Code:

```ts
export {};

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
```

Now you can access:

```ts
req.user;
```

with TypeScript support.

Ensure the declaration file is included by `tsconfig.json`.

## 14.2 Using the Custom Property

```ts
import type {
    RequestHandler
} from "express";

const exampleMiddleware: RequestHandler = (
    req,
    res,
    next
) => {

    req.user = {
        id: 1,
        email: "john@example.com",
        role: "admin"
    };

    next();
};
```

Later:

```ts
const getProfile: RequestHandler = (
    req,
    res
) => {

    if (!req.user) {
        res.status(401).json({
            message: "Unauthorized"
        });

        return;
    }

    res.json({
        user: req.user
    });
};
```

Notice that `user` remains optional because not every request necessarily passes through authentication middleware.

## 14.3 Approach Two: Use a Custom Request Interface

```ts
import type {
    Request
} from "express";

interface AuthenticatedRequest extends Request {
    user: {
        id: number;
        email: string;
        role: "admin" | "user";
    };
}
```

Use:

```ts
import type {
    Response
} from "express";

function getProfile(
    req: AuthenticatedRequest,
    res: Response
) {
    res.json(req.user);
}
```

This approach is useful when a specific handler requires an authenticated request.

However, you must ensure that authentication middleware actually runs before that handler.

---

# 15. Authentication Middleware

Authentication determines who the user is.

A typical backend authentication flow:

```text
Client
  |
  v
Login API
  |
  v
Validate Credentials
  |
  v
Generate Access Token
  |
  v
Client Stores Token
  |
  v
Protected API Request
  |
  v
Authentication Middleware
  |
  v
Verify Token
  |
  v
Attach User Information
  |
  v
Controller
```

For JWT authentication, install:

```bash
npm install jsonwebtoken
npm install -D @types/jsonwebtoken
```

## 15.1 Create JWT Utility

```text
src/utils/jwt.ts
```

Code:

```ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
}

interface JwtPayload {
    userId: number;
    role: "admin" | "user";
}

export function generateToken(
    payload: JwtPayload
): string {

    return jwt.sign(
        payload,
        JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );
}
```

This example uses a one-hour token expiration.

For a real application, use centralized configuration validation rather than accessing `process.env` in multiple modules.

## 15.2 Verify JWT

```ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
}

export function verifyToken(
    token: string
): JwtPayload {

    const decoded = jwt.verify(
        token,
        JWT_SECRET
    );

    if (
        typeof decoded !== "object" ||
        decoded === null ||
        !("userId" in decoded) ||
        !("role" in decoded) ||
        typeof decoded.userId !== "number" ||
        !["admin", "user"].includes(String(decoded.role))
    ) {
        throw new Error("Invalid token payload");
    }

    return {
        userId: decoded.userId,
        role: decoded.role as "admin" | "user"
    };
}
```

The payload must be validated because JWT decoding does not automatically prove that the payload has the structure your application expects.

## 15.3 Create Authentication Middleware

```text
src/middlewares/auth.middleware.ts
```

Code:

```ts
import type {
    RequestHandler
} from "express";

import {
    verifyToken
} from "../utils/jwt.js";

export const authMiddleware: RequestHandler = (
    req,
    res,
    next
) => {

    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        res.status(401).json({
            message: "Authentication required"
        });

        return;
    }

    const token = authorization.slice(7);

    try {
        const payload = verifyToken(token);

        req.user = {
            id: payload.userId,
            email: "",
            role: payload.role
        };

        next();

    } catch {
        res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};
```

This is a simplified illustration. In a production application, retrieve the user's current identity and relevant authorization data from a trusted source rather than assuming that every value in a JWT is current.

---

# 16. Authorization Middleware

Authentication and authorization are different concepts.

**Authentication:** Who are you?

**Authorization:** What are you allowed to do?

Example:

A user is authenticated but does not have permission to delete another user's account.

## 16.1 Role-Based Access Control

Suppose your application has:

```ts
type Role = "admin" | "user" | "moderator";
```

Create:

```text
src/middlewares/role.middleware.ts
```

Code:

```ts
import type {
    RequestHandler
} from "express";

type Role = "admin" | "user" | "moderator";

export function authorizeRoles(
    ...allowedRoles: Role[]
): RequestHandler {

    return (req, res, next) => {

        if (!req.user) {
            res.status(401).json({
                message: "Authentication required"
            });

            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                message: "Access denied"
            });

            return;
        }

        next();
    };
}
```

Usage:

```ts
app.delete(
    "/api/users/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteUser
);
```

Only authenticated administrators can access this endpoint.

## 16.2 Authentication vs Authorization

| Feature | Authentication | Authorization |
|---|---|---|
| Purpose | Identify user | Check permissions |
| Question | Who are you? | What can you access? |
| Typical mechanism | Password, token, session | Roles, permissions, policies |
| Common error | 401 Unauthorized | 403 Forbidden |

Strictly speaking, HTTP 401 means the request lacks valid authentication credentials, while 403 means the server understood the request but refuses access.

---

# 17. Error-Handling Middleware

Errors can occur anywhere in a backend application.

Examples:

- Database connection failures.
- Invalid input.
- Authentication failures.
- Missing resources.
- External API failures.
- Unexpected programming errors.

Instead of handling every error differently inside every controller, use centralized error handling.

## 17.1 Express Error Middleware

An Express error-handling middleware has four parameters:

```ts
(error, req, res, next)
```

Example:

```ts
import type {
    ErrorRequestHandler
} from "express";

export const errorMiddleware: ErrorRequestHandler = (
    error,
    req,
    res,
    next
) => {

    console.error(error);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
};
```

Register it after your routes:

```ts
app.use(errorMiddleware);
```

## 17.2 Why Four Parameters?

Express identifies error-handling middleware by its four-argument signature.

Even if you do not use `next`, keep the fourth parameter.

---

# 18. Creating a Custom AppError Class

A better approach is to create a reusable error class.

```text
src/utils/app-error.ts
```

Code:

```ts
export class AppError extends Error {

    constructor(
        public statusCode: number,
        message: string,
        public isOperational: boolean = true
    ) {
        super(message);

        this.name = "AppError";

        Error.captureStackTrace?.(this, AppError);
    }
}
```

Usage:

```ts
import { AppError } from "../utils/app-error.js";

throw new AppError(
    404,
    "User not found"
);
```

Now the error middleware can distinguish known application errors from unexpected failures.

## 18.1 Improved Error Middleware

```ts
import type {
    ErrorRequestHandler
} from "express";

import { AppError } from "../utils/app-error.js";

export const errorMiddleware: ErrorRequestHandler = (
    error,
    req,
    res,
    next
) => {

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
};
```

In production, avoid exposing internal stack traces, database details, secrets, or implementation information to clients.

---

# 19. Async Middleware and Async Error Handling

Most backend operations are asynchronous.

Examples:

- Database queries.
- Password verification.
- API calls.
- File operations.

Consider:

```ts
app.get("/users", async (req, res) => {
    const users = await userService.getAllUsers();

    res.json(users);
});
```

If an asynchronous operation rejects, the error must reach Express's error-handling pipeline.

Express 5 automatically forwards rejected promises returned by route handlers and middleware to error handling.

For Express 4, use an async wrapper or explicitly catch errors and call `next(error)`.

## 19.1 Async Handler Wrapper

Create:

```text
src/utils/async-handler.ts
```

Code:

```ts
import type {
    RequestHandler
} from "express";

export function asyncHandler(
    handler: RequestHandler
): RequestHandler {

    return (req, res, next) => {
        Promise.resolve(
            handler(req, res, next)
        ).catch(next);
    };
}
```

Usage:

```ts
import { asyncHandler } from "../utils/async-handler.js";

router.get(
    "/",
    asyncHandler(async (req, res) => {

        const users = await userService.getAllUsers();

        res.json(users);
    })
);
```

This is a useful approach for Express 4 applications.

For Express 5, it is generally unnecessary for ordinary promise-returning route handlers, though wrappers may still be useful for consistent application conventions.

---

# 20. Controller-Service-Repository Architecture

This is a major concept in professional backend development.

Let's understand the responsibilities of each layer.

## 20.1 Controller

The controller handles HTTP-related responsibilities.

It should:

- Read request parameters.
- Read request body.
- Call the service.
- Return the HTTP response.
- Forward errors.

Example:

```ts
import type {
    Request,
    Response,
    NextFunction
} from "express";

async function createUserController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const user = await userService.createUser(req.body);

        res.status(201).json({
            success: true,
            data: user
        });

    } catch (error) {
        next(error);
    }
}
```

## 20.2 Service

The service contains business logic.

Example:

```ts
interface CreateUserInput {
    name: string;
    email: string;
}

class UserService {

    async createUser(input: CreateUserInput) {

        const existingUser = await userRepository.findByEmail(
            input.email
        );

        if (existingUser) {
            throw new AppError(
                409,
                "Email already exists"
            );
        }

        return userRepository.create(input);
    }
}

const userService = new UserService();
```

The service does not need to know about Express's `Request` or `Response` objects.

This makes business logic easier to test and reuse.

## 20.3 Repository

The repository handles data access.

Example:

```ts
interface User {
    id: number;
    name: string;
    email: string;
}

interface CreateUserInput {
    name: string;
    email: string;
}

class UserRepository {

    private users: User[] = [];

    async findByEmail(
        email: string
    ): Promise<User | undefined> {

        return this.users.find(
            user => user.email === email
        );
    }

    async create(
        input: CreateUserInput
    ): Promise<User> {

        const user: User = {
            id: this.users.length + 1,
            ...input
        };

        this.users.push(user);

        return user;
    }
}

const userRepository = new UserRepository();
```

This repository uses an in-memory array for demonstration. A real implementation would communicate with a database.

## 20.4 Complete Request Flow

```text
HTTP Request
     |
     v
    Route
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
 Repository
     |
     v
 Database
```

### Why Separate These Layers?

Suppose you change your database from MySQL to MongoDB.

If database access is isolated in the repository layer, the controller and business service may require fewer changes.

Similarly, if you later expose the same business logic through a background worker, you can reuse the service without creating an HTTP request.

---

# 21. Dependency Injection

Dependency Injection (DI) means providing an object with the dependencies it needs instead of making it create those dependencies internally.

Consider:

```ts
class UserService {

    private repository = new UserRepository();

}
```

Here, `UserService` creates its own repository.

This tightly couples the two classes.

A better approach:

```ts
interface IUserRepository {
    findByEmail(email: string): Promise<User | undefined>;

    create(input: CreateUserInput): Promise<User>;
}
```

Implement the interface:

```ts
class UserRepository implements IUserRepository {

    async findByEmail(
        email: string
    ): Promise<User | undefined> {
        // Database query
        return undefined;
    }

    async create(
        input: CreateUserInput
    ): Promise<User> {
        // Database insert
        return {
            id: 1,
            ...input
        };
    }
}
```

Inject the repository:

```ts
class UserService {

    constructor(
        private readonly repository: IUserRepository
    ) {}

    async createUser(input: CreateUserInput) {

        const existing = await this.repository.findByEmail(
            input.email
        );

        if (existing) {
            throw new AppError(409, "Email already exists");
        }

        return this.repository.create(input);
    }
}
```

Create instances:

```ts
const userRepository = new UserRepository();

const userService = new UserService(userRepository);
```

## 21.1 Advantages of Dependency Injection

- Loose coupling.
- Easier unit testing.
- Better maintainability.
- Easier dependency replacement.
- Improved architecture.

## 21.2 Dependency Injection Does Not Require a Container

You can perform dependency injection manually through constructors and function parameters.

A DI container becomes useful when the application has many dependencies and complex object lifetimes.

---

# 22. Request Validation with Zod

One of the most important backend security practices is validating incoming requests.

Consider:

```ts
const user = req.body;
```

The client might send:

```json
{
    "name": 123,
    "email": "invalid-email"
}
```

TypeScript cannot automatically prevent this.

Why?

Because HTTP requests are external runtime data.

You need runtime validation.

Install:

```bash
npm install zod
```

## 22.1 Create a Validation Schema

```text
src/validators/user.validator.ts
```

Code:

```ts
import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string().min(3).max(50),

    email: z.string().email(),

    age: z.number().int().min(18)
});
```

## 22.2 Infer TypeScript Types from Zod

```ts
export type CreateUserInput = z.infer<
    typeof createUserSchema
>;
```

Now TypeScript automatically derives the type from the schema.

Conceptually:

```ts
type CreateUserInput = {
    name: string;
    email: string;
    age: number;
};
```

This avoids maintaining separate validation and TypeScript definitions.

## 22.3 Validate Data Manually

```ts
const result = createUserSchema.safeParse(req.body);

if (!result.success) {
    res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues
    });

    return;
}

const userData = result.data;
```

After successful validation, `userData` has the validated inferred type.

## 22.4 `parse()` vs `safeParse()`

| Method | Behavior |
|---|---|
| `parse()` | Returns validated data or throws an error |
| `safeParse()` | Returns a success/error result |

Example:

```ts
const user = createUserSchema.parse(req.body);
```

Or:

```ts
const result = createUserSchema.safeParse(req.body);

if (result.success) {
    console.log(result.data);
} else {
    console.log(result.error);
}
```

For middleware, `safeParse()` is often convenient because you can explicitly decide how to handle validation failures.

---

# 23. Creating Reusable Validation Middleware

Instead of validating each controller manually, create reusable middleware.

Create:

```text
src/middlewares/validation.middleware.ts
```

Code:

```ts
import type {
    RequestHandler
} from "express";

import type {
    ZodType
} from "zod";

export function validateBody(
    schema: ZodType
): RequestHandler {

    return (req, res, next) => {

        const result = schema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.issues
            });

            return;
        }

        req.body = result.data;

        next();
    };
}
```

Usage:

```ts
router.post(
    "/",
    validateBody(createUserSchema),
    createUserController
);
```

Now validation runs before the controller.

**Important:** This middleware validates the body only. Query parameters and route parameters should be validated separately when required.

Also, the middleware should be designed so that the validated data is the data consumed by subsequent handlers.

---

# 24. Advanced Validation: Body, Params and Query

A request contains different data sources.

For example:

```text
POST /users/123?notify=true
```

Request:

```json
{
    "name": "John",
    "email": "john@example.com",
    "age": 25
}
```

You may need to validate:

- Body.
- Route parameters.
- Query parameters.

Create a combined schema:

```ts
import { z } from "zod";

export const updateUserRequestSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive()
    }),

    query: z.object({
        notify: z.coerce.boolean().optional()
    }),

    body: z.object({
        name: z.string().min(3).optional(),

        email: z.string().email().optional()
    })
});
```

Validate:

```ts
const result = updateUserRequestSchema.safeParse({
    params: req.params,
    query: req.query,
    body: req.body
});
```

After validation:

```ts
if (!result.success) {
    res.status(400).json({
        errors: result.error.issues
    });

    return;
}

const {
    params,
    query,
    body
} = result.data;
```

Notice that `z.coerce.number()` converts compatible input into a number before validation.

For Boolean query parameters, be careful with coercion: JavaScript treats any non-empty string, including `"false"`, as truthy. For strict `"true"`/`"false"` parsing, use an explicit preprocessing or enum schema.

Example:

```ts
const booleanQuery = z
    .enum(["true", "false"])
    .transform(value => value === "true");
```

---

# 25. REST API Design

REST stands for Representational State Transfer.

It is an architectural style for designing network-based APIs.

REST APIs commonly use HTTP methods to represent operations on resources.

## 25.1 Common HTTP Methods

| Method | Purpose | Example |
|---|---|---|
| GET | Retrieve resources | Get users |
| POST | Create resources | Create user |
| PUT | Replace a resource | Replace user |
| PATCH | Partially update a resource | Update user's email |
| DELETE | Delete a resource | Delete user |

## 25.2 RESTful User API

A typical API:

| Method | Endpoint | Operation |
|---|---|---|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get one user |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Replace user |
| PATCH | `/api/users/:id` | Partially update user |
| DELETE | `/api/users/:id` | Delete user |

## 25.3 Common HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 202 | Accepted |
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

Choose status codes based on the actual semantics of the operation and your API conventions.

---

# 26. Building Type-Safe CRUD APIs

Let's build a basic CRUD API.

We will use an in-memory repository first.

## 26.1 Define User Types

```ts
export interface User {
    id: number;
    name: string;
    email: string;
    age: number;
}

export interface CreateUserInput {
    name: string;
    email: string;
    age: number;
}

export interface UpdateUserInput {
    name?: string;
    email?: string;
    age?: number;
}
```

## 26.2 Create Repository

```ts
class UserRepository {

    private users: User[] = [];

    private nextId = 1;

    async findAll(): Promise<User[]> {
        return this.users;
    }

    async findById(
        id: number
    ): Promise<User | undefined> {

        return this.users.find(
            user => user.id === id
        );
    }

    async create(
        input: CreateUserInput
    ): Promise<User> {

        const user: User = {
            id: this.nextId++,
            ...input
        };

        this.users.push(user);

        return user;
    }

    async update(
        id: number,
        input: UpdateUserInput
    ): Promise<User | undefined> {

        const user = await this.findById(id);

        if (!user) {
            return undefined;
        }

        Object.assign(user, input);

        return user;
    }

    async delete(
        id: number
    ): Promise<boolean> {

        const index = this.users.findIndex(
            user => user.id === id
        );

        if (index === -1) {
            return false;
        }

        this.users.splice(index, 1);

        return true;
    }
}
```

## 26.3 Create Service

```ts
class UserService {

    constructor(
        private readonly repository: UserRepository
    ) {}

    async getAllUsers() {
        return this.repository.findAll();
    }

    async getUserById(id: number) {

        const user = await this.repository.findById(id);

        if (!user) {
            throw new AppError(404, "User not found");
        }

        return user;
    }

    async createUser(input: CreateUserInput) {

        return this.repository.create(input);
    }

    async updateUser(
        id: number,
        input: UpdateUserInput
    ) {

        const user = await this.repository.update(id, input);

        if (!user) {
            throw new AppError(404, "User not found");
        }

        return user;
    }

    async deleteUser(id: number) {

        const deleted = await this.repository.delete(id);

        if (!deleted) {
            throw new AppError(404, "User not found");
        }
    }
}
```

## 26.4 Create Controller

```ts
import type {
    RequestHandler
} from "express";

const getAllUsers: RequestHandler = async (
    req,
    res
) => {

    const users = await userService.getAllUsers();

    res.status(200).json({
        success: true,
        data: users
    });
};

const getUserById: RequestHandler = async (
    req,
    res
) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError(400, "Invalid user ID");
    }

    const user = await userService.getUserById(id);

    res.status(200).json({
        success: true,
        data: user
    });
};

const createUser: RequestHandler = async (
    req,
    res
) => {

    const user = await userService.createUser(req.body);

    res.status(201).json({
        success: true,
        message: "User created",
        data: user
    });
};

const updateUser: RequestHandler = async (
    req,
    res
) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError(400, "Invalid user ID");
    }

    const user = await userService.updateUser(
        id,
        req.body
    );

    res.status(200).json({
        success: true,
        message: "User updated",
        data: user
    });
};

const deleteUser: RequestHandler = async (
    req,
    res
) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError(400, "Invalid user ID");
    }

    await userService.deleteUser(id);

    res.status(204).send();
};
```

These controllers rely on validated request data. In a complete implementation, register the relevant body and parameter validation middleware before them.

## 26.5 Create Routes

```ts
import {
    Router
} from "express";

const router = Router();

router.get("/", getAllUsers);

router.get("/:id", getUserById);

router.post(
    "/",
    validateBody(createUserSchema),
    createUser
);

router.patch(
    "/:id",
    validateBody(updateUserSchema),
    updateUser
);

router.delete("/:id", deleteUser);

export default router;
```

## 26.6 Register Routes

```ts
import express from "express";

import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

export default app;
```

---

# 27. Pagination and Filtering

When an API returns thousands of records, returning everything at once is inefficient.

Pagination divides the data into smaller groups.

Example:

```text
GET /api/users?page=2&limit=10
```

This requests the second page containing ten records.

## 27.1 Offset-Based Pagination

Formula:

```ts
const offset = (page - 1) * limit;
```

Example:

```ts
const page = 2;

const limit = 10;

const offset = (page - 1) * limit;

console.log(offset);
```

Output:

```text
10
```

## 27.2 Define Pagination Query

```ts
interface PaginationQuery {
    page?: string;
    limit?: string;
}
```

Controller:

```ts
const getUsers: RequestHandler<
    {},
    {},
    {},
    PaginationQuery
> = async (req, res) => {

    const page = Math.max(
        1,
        Number(req.query.page ?? 1)
    );

    const limit = Math.min(
        100,
        Math.max(
            1,
            Number(req.query.limit ?? 10)
        )
    );

    const offset = (page - 1) * limit;

    const users = await userRepository.findPaginated({
        offset,
        limit
    });

    res.json({
        success: true,
        data: users,
        pagination: {
            page,
            limit
        }
    });
};
```

In production, validate pagination inputs before using them. Also consider checking that both values are finite integers.

## 27.3 Pagination Response

A useful response structure:

```json
{
    "success": true,
    "data": [],
    "pagination": {
        "page": 2,
        "limit": 10,
        "totalRecords": 100,
        "totalPages": 10
    }
}
```

## 27.4 Filtering

Example:

```text
GET /api/users?role=admin&status=active
```

Define:

```ts
interface UserFilters {
    role?: string;
    status?: string;
}
```

The repository can apply these filters to the database query.

## 27.5 Sorting

Example:

```text
GET /api/users?sortBy=createdAt&order=desc
```

Never insert arbitrary user-supplied field names directly into SQL queries.

Use an allowlist:

```ts
const allowedSortFields = [
    "name",
    "email",
    "createdAt"
] as const;

type SortField =
    typeof allowedSortFields[number];
```

Validate the requested sort field against the allowlist before building a database query.

## 27.6 Cursor-Based Pagination

Offset pagination can become inefficient for very large datasets.

Cursor-based pagination uses a stable reference point.

Example:

```text
GET /api/users?cursor=105&limit=10
```

Conceptually:

```sql
SELECT *
FROM users
WHERE id > 105
ORDER BY id ASC
LIMIT 10;
```

This is an example of keyset pagination.

For reliable cursor pagination, use a stable, unique ordering key. If sorting by a non-unique column, include a unique tie-breaker.

---

# 28. File Uploads with TypeScript

Express does not provide multipart file upload handling by default.

A commonly used library is Multer.

Install:

```bash
npm install multer

npm install -D @types/multer
```

## 28.1 Basic Upload Middleware

```ts
import multer from "multer";

const upload = multer({
    dest: "uploads/"
});
```

Create route:

```ts
router.post(
    "/upload",
    upload.single("file"),
    (req, res) => {

        res.json({
            message: "File uploaded",
            file: req.file
        });
    }
);
```

Request:

```text
POST /api/users/upload
```

Body type:

```text
multipart/form-data
```

Field:

```text
file
```

## 28.2 File Type Validation

You should not trust a file's original filename or MIME type.

A basic filter:

```ts
import multer from "multer";

const upload = multer({
    dest: "uploads/",

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, callback) => {

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            callback(new Error("Unsupported file type"));

            return;
        }

        callback(null, true);
    }
});
```

This checks the supplied MIME type, but that value is client-controlled.

For production security, also inspect file signatures (magic bytes), generate safe server-side filenames, store uploads outside public web roots when private, and enforce access controls.

## 28.3 File Upload Security

Important practices:

- Limit file size.
- Validate file signatures.
- Restrict allowed file types.
- Generate server-side filenames.
- Prevent path traversal.
- Avoid trusting client-provided MIME types.
- Store sensitive files privately.
- Scan files when the threat model requires it.
- Restrict access to uploaded files.

---

# 29. Authentication with JWT

Let's understand the complete authentication process.

## 29.1 Login Request

Example:

```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

The backend should:

1. Validate the request.
2. Find the user.
3. Verify the password hash.
4. Generate an access token.
5. Return the token or set it in a secure cookie.

## 29.2 Password Hashing

Never store plain-text passwords.

Use a password hashing algorithm designed for passwords, such as:

- Argon2id.
- bcrypt.

For bcrypt:

```bash
npm install bcrypt

npm install -D @types/bcrypt
```

Hash a password:

```ts
import bcrypt from "bcrypt";

const password = "password123";

const hashedPassword = await bcrypt.hash(
    password,
    12
);
```

Verify:

```ts
const isValid = await bcrypt.compare(
    password,
    hashedPassword
);
```

Password hashing is different from ordinary encryption.

Hashing is designed to be one-way.

## 29.3 Login Service Example

```ts
import bcrypt from "bcrypt";

class AuthService {

    async login(
        email: string,
        password: string
    ) {

        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw new AppError(
                401,
                "Invalid credentials"
            );
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            throw new AppError(
                401,
                "Invalid credentials"
            );
        }

        const token = generateToken({
            userId: user.id,
            role: user.role
        });

        return {
            token
        };
    }
}
```

The repository's user model would contain a password hash. Do not return that hash in API responses.

For a production authentication system, also consider:

- Refresh token rotation.
- Token revocation strategy.
- Secure token storage.
- Rate limiting on login endpoints.
- Account lockout or abuse controls.
- Password reset workflows.
- Secret rotation.
- Consistent authentication error messages.

---

# 30. Role-Based Access Control (RBAC)

RBAC means Role-Based Access Control.

Users receive roles, and roles determine what actions they can perform.

Example:

```ts
type Role =
    | "admin"
    | "manager"
    | "user";
```

Permissions:

| Role | Create User | Read User | Update User | Delete User |
|---|---|---|---|---|
| Admin | Yes | Yes | Yes | Yes |
| Manager | Yes | Yes | Yes | No |
| User | No | Limited | No | No |

## 30.1 Permission-Based Authorization

For larger applications, permission-based authorization can be more flexible than checking roles directly.

Define:

```ts
type Permission =
    | "user:create"
    | "user:read"
    | "user:update"
    | "user:delete";
```

Create a role-permission mapping:

```ts
const rolePermissions: Record<Role, Permission[]> = {
    admin: [
        "user:create",
        "user:read",
        "user:update",
        "user:delete"
    ],

    manager: [
        "user:create",
        "user:read",
        "user:update"
    ],

    user: [
        "user:read"
    ]
};
```

Create middleware:

```ts
function authorizePermission(
    permission: Permission
): RequestHandler {

    return (req, res, next) => {

        if (!req.user) {
            res.status(401).json({
                message: "Authentication required"
            });

            return;
        }

        const permissions = rolePermissions[
            req.user.role as Role
        ];

        if (!permissions.includes(permission)) {
            res.status(403).json({
                message: "Permission denied"
            });

            return;
        }

        next();
    };
}
```

Usage:

```ts
router.delete(
    "/:id",
    authMiddleware,
    authorizePermission("user:delete"),
    deleteUser
);
```

In a production application, define role and permission types centrally and ensure authorization is checked against current, trusted user permissions. Do not blindly trust stale role claims in long-lived tokens.

---

# 31. API Error Handling Strategy

A professional API should return predictable error structures.

Example:

```json
{
    "success": false,
    "message": "Validation failed",
    "errors": [
        {
            "field": "email",
            "message": "Invalid email address"
        }
    ]
}
```

## 31.1 Standardize API Responses

Create reusable response types:

```ts
export interface SuccessResponse<T> {
    success: true;
    message: string;
    data: T;
}

export interface ErrorResponse {
    success: false;
    message: string;
    errors?: unknown[];
}
```

Example:

```ts
const response: SuccessResponse<User> = {
    success: true,
    message: "User fetched successfully",
    data: user
};
```

## 31.2 Error Categories

| Error | HTTP Status |
|---|---:|
| Invalid input | 400 |
| Missing authentication | 401 |
| Insufficient permission | 403 |
| Resource not found | 404 |
| Duplicate resource | 409 |
| Validation failure | 422 or 400 |
| Rate limit exceeded | 429 |
| Internal error | 500 |
| Temporary service failure | 503 |

Choose one consistent convention for validation failures.

---

# 32. Logging and Monitoring

Logging helps you understand what happens inside a backend application.

You should log:

- Incoming requests.
- Response status codes.
- Request duration.
- Unexpected errors.
- Database failures.
- Background job failures.
- Application startup and shutdown.

Avoid logging:

- Passwords.
- JWT secrets.
- Access tokens.
- Full payment card details.
- Sensitive personal information.

## 32.1 Basic Request Logger

```ts
import type {
    RequestHandler
} from "express";

export const requestLogger: RequestHandler = (
    req,
    res,
    next
) => {

    const start = Date.now();

    res.on("finish", () => {

        const duration = Date.now() - start;

        console.log({
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            duration
        });
    });

    next();
};
```

## 32.2 Structured Logging

Instead of plain strings:

```ts
console.log("User created");
```

Use structured information:

```ts
console.log({
    event: "user.created",
    userId: 101,
    timestamp: new Date().toISOString()
});
```

For production applications, consider a structured logging library such as Pino or Winston.

## 32.3 Request IDs

A request ID helps correlate logs belonging to the same HTTP request.

Example:

```ts
import { randomUUID } from "node:crypto";

import type {
    RequestHandler
} from "express";

export const requestIdMiddleware: RequestHandler = (
    req,
    res,
    next
) => {

    const requestId = randomUUID();

    res.setHeader("X-Request-ID", requestId);

    res.locals.requestId = requestId;

    next();
};
```

You can then include `requestId` in every log generated while processing that request.

---

# 33. Testing Express Applications

Testing is essential for reliable backend development.

There are several types of tests.

| Testing Type | Purpose |
|---|---|
| Unit Testing | Test individual functions/classes |
| Integration Testing | Test interactions between components |
| API Testing | Test HTTP endpoints |
| End-to-End Testing | Test complete application workflows |

We will use:

- Vitest.
- Supertest.

## 33.1 Create a Simple Express App

```ts
import express from "express";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

export default app;
```

## 33.2 Create an Integration Test

Create:

```text
tests/app.test.ts
```

Code:

```ts
import {
    describe,
    it,
    expect
} from "vitest";

import request from "supertest";

import app from "../src/app.js";

describe("Health API", () => {

    it("should return health status", async () => {

        const response = await request(app)
            .get("/health");

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            status: "ok"
        });
    });
});
```

Run:

```bash
npm test
```

## 33.3 Why Export the App Without Starting the Server?

Testing can import:

```ts
import app from "../src/app.js";
```

Supertest can execute requests against the application without requiring you to manually open a listening port.

This is one reason `app.ts` and `server.ts` should be separate.

---

# 34. Unit Testing Services

You can test business logic independently from Express.

Example service:

```ts
class CalculatorService {

    add(a: number, b: number): number {
        return a + b;
    }

    subtract(a: number, b: number): number {
        return a - b;
    }
}
```

Test:

```ts
import {
    describe,
    it,
    expect
} from "vitest";

describe("CalculatorService", () => {

    const calculator = new CalculatorService();

    it("should add two numbers", () => {

        const result = calculator.add(10, 20);

        expect(result).toBe(30);
    });

    it("should subtract two numbers", () => {

        const result = calculator.subtract(20, 10);

        expect(result).toBe(10);
    });
});
```

The important point is that service tests do not require HTTP requests.

This is a benefit of separating business logic from controllers.

---

# 35. Production Express Architecture

Let's combine the concepts into a production-oriented structure.

```text
src/
│
├── config/
│   ├── env.ts
│   └── database.ts
│
├── modules/
│   │
│   └── user/
│       ├── user.routes.ts
│       ├── user.controller.ts
│       ├── user.service.ts
│       ├── user.repository.ts
│       ├── user.validator.ts
│       └── user.types.ts
│
├── middlewares/
│   ├── auth.middleware.ts
│   ├── authorization.middleware.ts
│   ├── validation.middleware.ts
│   ├── error.middleware.ts
│   └── request-logger.middleware.ts
│
├── utils/
│   ├── app-error.ts
│   ├── async-handler.ts
│   ├── jwt.ts
│   └── response.ts
│
├── types/
│   └── express.d.ts
│
├── app.ts
└── server.ts

tests/
    user.test.ts
```

## 35.1 Feature-Based Architecture

Instead of organizing everything only by technical layer, you can organize by business feature.

For example:

```text
modules/
    user/
        user.routes.ts
        user.controller.ts
        user.service.ts
        user.repository.ts

    product/
        product.routes.ts
        product.controller.ts
        product.service.ts
        product.repository.ts

    order/
        order.routes.ts
        order.controller.ts
        order.service.ts
        order.repository.ts
```

This is called feature-based or modular organization.

It can make large backend projects easier to maintain because related functionality is grouped together.

---

# 36. Production Best Practices

Before deploying an Express application, consider the following.

## Security

- Validate all external inputs.
- Hash passwords using a password-hashing algorithm.
- Protect JWT secrets.
- Use HTTPS in production.
- Configure appropriate CORS policies.
- Apply rate limiting.
- Use secure HTTP headers.
- Prevent SQL injection through parameterized queries.
- Avoid exposing internal errors.
- Validate uploaded files.
- Enforce authorization at the resource level.

## Performance

- Use asynchronous I/O.
- Add database indexes.
- Implement pagination.
- Avoid unnecessary database queries.
- Use connection pooling.
- Use streams for large files.
- Avoid blocking the event loop.
- Cache appropriate data.

## Reliability

- Centralize error handling.
- Add structured logging.
- Implement graceful shutdown.
- Monitor application health.
- Handle database disconnections.
- Configure request timeouts.
- Add tests for critical business logic.

## Maintainability

- Separate controllers and services.
- Keep business logic out of route definitions.
- Use reusable validation schemas.
- Define consistent response structures.
- Use dependency injection where beneficial.
- Maintain clear module boundaries.

---

# 37. Common Mistakes in Express + TypeScript

| Mistake | Problem | Better Approach |
|---|---|---|
| Using `any` for request bodies | Removes type safety | Define request types and validate at runtime |
| Putting business logic in controllers | Makes controllers difficult to maintain | Move business logic into services |
| Accessing database directly in every controller | Creates duplication and coupling | Use repositories or dedicated data-access modules |
| Forgetting `express.json()` | JSON body is not parsed | Register JSON middleware |
| Calling `next()` after sending a response | Can cause duplicate response errors | Return after sending the response |
| Ignoring async errors | Errors may not reach the error handler | Use Express 5 promise handling or an Express 4 wrapper |
| Trusting JWT payload without validation | Incorrect assumptions about claims | Validate payload and verify current permissions |
| Storing plain-text passwords | Serious security vulnerability | Use Argon2id or bcrypt |
| Trusting TypeScript interfaces for incoming data | Interfaces do not validate runtime input | Use Zod or another runtime schema |
| Returning database records directly | May expose sensitive fields | Use response DTOs |
| Using unrestricted file uploads | Can create security and storage problems | Apply limits and content validation |
| Using arbitrary sort fields | Can create query injection risks | Use an allowlist |
| Ignoring request size limits | Can enable resource exhaustion | Configure body-size limits and rate limits |
| Logging secrets | Can expose credentials | Redact sensitive fields |

---

# 38. Advanced Express.js Interview Questions and Answers

### Q1. What is Express.js?

Express.js is a Node.js web framework used to build HTTP servers and REST APIs.

### Q2. Why use Express with TypeScript?

Express handles HTTP functionality, while TypeScript provides compile-time type checking and improved code maintainability.

### Q3. What is `@types/express`?

It provides TypeScript declaration files for Express APIs.

### Q4. What is Express middleware?

Middleware is a function that executes during the HTTP request-response cycle.

### Q5. What are the parameters of middleware?

Common middleware receives:

```ts
(req, res, next)
```

Error-handling middleware receives:

```ts
(error, req, res, next)
```

### Q6. What is `next()`?

It passes control to the next middleware or route handler.

### Q7. What is `next(error)`?

It forwards an error to Express error-handling middleware.

### Q8. What is the difference between application-level and router-level middleware?

Application-level middleware is registered on an Express application. Router-level middleware is registered on a specific router.

### Q9. What is `express.json()`?

It parses incoming JSON request bodies.

### Q10. What is `express.urlencoded()`?

It parses URL-encoded request bodies.

### Q11. What is Express Router?

It is an object used to organize route handlers and middleware into modular groups.

### Q12. What is the purpose of `RequestHandler`?

It provides a reusable TypeScript type for Express request handlers.

### Q13. How do you type an Express request body?

Use the third generic parameter of `Request`:

```ts
Request<Params, ResponseBody, RequestBody>
```

### Q14. How do you type route parameters?

Use the first generic parameter of `Request`.

### Q15. Why are route parameters usually strings?

HTTP URL parameters are textual values and need to be parsed when representing numbers or other data types.

### Q16. What is declaration merging?

It is a TypeScript feature that combines multiple declarations with the same name, allowing interfaces to be extended.

### Q17. How can you add a custom `user` property to Express Request?

Use declaration merging to extend the Express Request interface or use a custom request type.

### Q18. What is authentication?

Authentication verifies the identity of a user.

### Q19. What is authorization?

Authorization determines what an authenticated user is permitted to access or perform.

### Q20. What is the difference between 401 and 403?

401 indicates missing or invalid authentication credentials. 403 indicates that access is refused despite the request being understood.

### Q21. What is JWT?

JSON Web Token is a compact token format commonly used to transmit signed claims between parties.

### Q22. Is JWT automatically encrypted?

No. A typical signed JWT provides integrity protection, not confidentiality. Its payload can generally be decoded.

### Q23. Why should passwords be hashed?

Password hashing protects stored credentials if the password database is exposed.

### Q24. What is bcrypt?

bcrypt is a password-hashing algorithm designed to make password guessing computationally expensive.

### Q25. What is centralized error handling?

It is an approach where application errors are forwarded to one common error-handling middleware.

### Q26. What is an AppError class?

It is a custom error class that can carry application-specific information such as an HTTP status code.

### Q27. What is the purpose of an async handler?

It forwards rejected asynchronous operations to Express error handling, especially in Express 4.

### Q28. Does Express 5 require an async wrapper for every async route?

No. Express 5 automatically forwards rejected promises returned by route handlers and middleware.

### Q29. What is Controller-Service-Repository architecture?

It separates HTTP handling, business logic, and data access into distinct layers.

### Q30. What is the responsibility of a controller?

A controller receives HTTP requests, coordinates the appropriate service operation, and sends HTTP responses.

### Q31. What is the responsibility of a service?

A service implements business logic and coordinates operations needed by a use case.

### Q32. What is the responsibility of a repository?

A repository abstracts data-access operations.

### Q33. What is dependency injection?

It is a technique where an object's dependencies are supplied externally instead of being created internally.

### Q34. What is Zod?

Zod is a TypeScript-friendly runtime schema validation library.

### Q35. What is the difference between `parse()` and `safeParse()`?

`parse()` returns validated data or throws. `safeParse()` returns a structured success or failure result.

### Q36. Why is runtime validation required if TypeScript already has interfaces?

TypeScript types are erased at runtime and do not validate external HTTP data.

### Q37. What is REST?

REST is an architectural style for designing network-based systems around resources and representations.

### Q38. What is the difference between PUT and PATCH?

PUT generally replaces a resource representation. PATCH applies a partial modification.

### Q39. What is pagination?

Pagination divides large result sets into smaller groups for efficient retrieval.

### Q40. What is cursor-based pagination?

It uses a stable reference point to retrieve the next or previous group of records.

### Q41. What is Multer?

Multer is Express middleware used to process multipart/form-data, commonly for file uploads.

### Q42. Why should uploaded files be validated?

To reduce risks involving malicious files, oversized uploads, misleading extensions, and unexpected file content.

### Q43. What is RBAC?

Role-Based Access Control is an authorization model where permissions are associated with roles.

### Q44. What is permission-based authorization?

It checks whether a user has a specific permission to perform an action.

### Q45. What is structured logging?

Structured logging stores log information as organized fields rather than only unstructured text.

### Q46. What is Supertest?

Supertest is a library used to test HTTP servers and Express applications.

### Q47. What is the difference between unit and integration testing?

Unit tests verify isolated components. Integration tests verify that multiple components work together.

### Q48. Why separate `app.ts` and `server.ts`?

It separates Express application configuration from network startup, making testing and application lifecycle management easier.

### Q49. What is a DTO?

A Data Transfer Object defines the structure of data exchanged between application boundaries.

### Q50. Why should database models not always be returned directly?

Database models may contain internal fields, sensitive information, or implementation details that should not be exposed through public APIs.

---

# 39. Practical Exercises

Complete these exercises to strengthen your understanding.

## Beginner – Express Fundamentals

**Exercise 1:** Create an Express server using TypeScript.

**Exercise 2:** Create GET, POST, PUT, PATCH, and DELETE routes.

**Exercise 3:** Create a separate router for users.

**Exercise 4:** Create custom logging middleware.

**Exercise 5:** Implement request and response types.

## Intermediate – Middleware and Validation

**Exercise 6:** Create authentication middleware.

**Exercise 7:** Create authorization middleware for admin and user roles.

**Exercise 8:** Create a custom error-handling middleware.

**Exercise 9:** Build request validation using Zod.

**Exercise 10:** Validate route parameters, query parameters, and request bodies.

## Advanced – Architecture

**Exercise 11:** Implement Controller-Service-Repository architecture.

**Exercise 12:** Implement dependency injection using constructor injection.

**Exercise 13:** Build a complete User CRUD API.

**Exercise 14:** Implement pagination, filtering, and sorting.

**Exercise 15:** Implement file uploads with Multer.

## Expert – Production Backend

**Exercise 16:** Build registration and login APIs.

**Exercise 17:** Implement JWT authentication.

**Exercise 18:** Implement password hashing using bcrypt or Argon2id.

**Exercise 19:** Implement role-based and permission-based authorization.

**Exercise 20:** Implement standardized API error responses.

**Exercise 21:** Add structured logging and request IDs.

**Exercise 22:** Write unit tests for services.

**Exercise 23:** Write integration tests for Express routes.

**Exercise 24:** Build a complete production-oriented REST API with database integration.

---

# 40. Phase 48 Completion Checklist

| No. | Topic | Expected Knowledge |
|---|---|---|
| 1 | Express.js | Understand Express fundamentals |
| 2 | Type Definitions | Use Express TypeScript types |
| 3 | Request Types | Type request bodies and parameters |
| 4 | Response Types | Define API response contracts |
| 5 | Middleware | Understand middleware execution |
| 6 | Custom Middleware | Build reusable middleware |
| 7 | Router | Organize API endpoints |
| 8 | Declaration Merging | Extend Express Request |
| 9 | Authentication | Verify user identity |
| 10 | Authorization | Enforce access permissions |
| 11 | JWT | Generate and verify tokens |
| 12 | Error Handling | Build centralized error handling |
| 13 | Async Handlers | Handle asynchronous errors |
| 14 | Controllers | Separate HTTP handling |
| 15 | Services | Implement business logic |
| 16 | Repositories | Separate data access |
| 17 | Dependency Injection | Inject dependencies |
| 18 | Zod | Validate runtime input |
| 19 | REST APIs | Design resource-based APIs |
| 20 | CRUD | Implement complete CRUD operations |
| 21 | Pagination | Handle large datasets |
| 22 | Filtering | Filter and sort records |
| 23 | File Uploads | Handle multipart uploads |
| 24 | Password Hashing | Securely store passwords |
| 25 | RBAC | Implement role-based permissions |
| 26 | Logging | Monitor application behavior |
| 27 | Testing | Write unit and integration tests |
| 28 | Production Architecture | Organize scalable backend applications |

---

# 41. What Comes Next?

You now understand how to build structured, type-safe Express applications with middleware, controllers, services, repositories, validation, authentication, authorization, and testing.

The next phase will focus on integrating TypeScript with relational databases and ORM technologies.

## Phase 49: Advanced TypeScript – Database Integration, MySQL, PostgreSQL, Sequelize ORM, Prisma ORM and Type-Safe Data Access

Upcoming topics:

1. Database Fundamentals for TypeScript.
2. Relational Database Integration.
3. MySQL with TypeScript.
4. PostgreSQL with TypeScript.
5. Database Connection Management.
6. Connection Pooling.
7. Type-Safe SQL Queries.
8. Database Transactions.
9. SQL Injection Prevention.
10. ORM Fundamentals.
11. Sequelize with TypeScript.
12. Sequelize Models.
13. Sequelize Model Types.
14. Sequelize Associations.
15. One-to-One Relationships.
16. One-to-Many Relationships.
17. Many-to-Many Relationships.
18. Sequelize Migrations.
19. Sequelize Transactions.
20. Sequelize Hooks.
21. Sequelize Scopes.
22. Prisma ORM.
23. Prisma Schema.
24. Prisma Client.
25. Prisma Relations.
26. Prisma Migrations.
27. Prisma Transactions.
28. Prisma Type Inference.
29. Repository Pattern with ORM.
30. Database Pagination and Filtering.
31. Type-Safe Database Services.
32. Database Error Handling.
33. Database Testing.
34. Production Database Architecture.

**Phase 48 is complete.**