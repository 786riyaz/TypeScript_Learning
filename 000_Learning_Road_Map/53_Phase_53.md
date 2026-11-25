# Phase 53: Advanced TypeScript – REST API Architecture, API Versioning, OpenAPI, Swagger, GraphQL, WebSockets and API Security

**Level:** Expert / Advanced Backend Engineering  
**Prerequisites:** TypeScript, Node.js, Express.js, REST APIs, HTTP, databases, authentication, authorization, middleware, Clean Architecture, and dependency injection.

---

# 1. Learning Objectives

In this phase, you will learn how to design, build, document, secure, and optimize production-level APIs using TypeScript.

By the end of this phase, you should understand:

1. REST API design principles.
2. RESTful resource modeling.
3. HTTP methods and status codes.
4. API request and response standards.
5. API versioning.
6. Pagination.
7. Filtering and sorting.
8. API search.
9. Request validation.
10. Response serialization.
11. Centralized error handling.
12. Idempotency.
13. Rate limiting.
14. API security.
15. CORS.
16. CSRF.
17. XSS.
18. SQL Injection.
19. API authentication.
20. API authorization.
21. OpenAPI Specification.
22. Swagger documentation.
23. GraphQL fundamentals.
24. GraphQL queries and mutations.
25. GraphQL resolvers.
26. GraphQL schema design.
27. GraphQL authentication.
28. WebSockets.
29. Socket.IO.
30. Real-time applications.
31. Server-Sent Events.
32. API Gateway.
33. Request lifecycle.
34. API performance optimization.
35. Production API best practices.

---

# 2. REST API Fundamentals

REST stands for **Representational State Transfer**.

It is an architectural style for designing network-based applications.

REST APIs allow different applications to communicate over HTTP.

For example:

```text
React / Next.js Frontend
          |
          | HTTP Request
          v
     Node.js Backend
          |
          | Database Query
          v
       MySQL
```

Suppose you are building an expense tracker.

Your frontend needs to:

- Create expenses.
- Retrieve expenses.
- Update expenses.
- Delete expenses.
- Retrieve expense reports.

You can expose REST API endpoints:

```text
GET     /api/expenses
GET     /api/expenses/10
POST    /api/expenses
PUT     /api/expenses/10
PATCH   /api/expenses/10
DELETE  /api/expenses/10
```

Each endpoint represents an operation on a resource.

## 2.1 What Is a Resource?

A resource represents an entity or object exposed by an API.

Examples:

| Resource | Endpoint |
|---|---|
| Users | `/api/users` |
| Products | `/api/products` |
| Orders | `/api/orders` |
| Expenses | `/api/expenses` |
| Categories | `/api/categories` |
| Payments | `/api/payments` |

REST APIs generally use nouns for resource names rather than action-oriented endpoint names.

Prefer:

```http
GET /api/users
```

Instead of:

```http
GET /api/getUsers
```

Prefer:

```http
POST /api/orders
```

Instead of:

```http
POST /api/createOrder
```

The HTTP method communicates the intended operation.

---

# 3. REST Architectural Constraints

REST is based on six architectural constraints.

## 3.1 Client-Server Architecture

The client and server have separate responsibilities.

```text
Client:
- User Interface
- User Interaction
- Request Creation

Server:
- Business Logic
- Authentication
- Data Processing
- Database Operations
```

They communicate through a defined interface.

## 3.2 Statelessness

Each request should contain the information required for the server to process it.

The server should not rely on hidden client-specific session state to understand the request.

Example:

```http
GET /api/profile
Authorization: Bearer eyJhbGciOi...
```

The authentication token provides the information needed to identify the user.

**Important:** Statelessness does not mean the application cannot store data in databases, caches, or other systems. It means the server does not depend on a client's previous request context to process the current request.

## 3.3 Cacheability

Responses should indicate whether they can be cached.

Example:

```http
Cache-Control: public, max-age=3600
```

This tells compliant caches that the response may be stored for up to one hour.

Sensitive responses may use:

```http
Cache-Control: no-store
```

## 3.4 Uniform Interface

The API should expose consistent resource representations and interaction rules.

For example:

```http
GET /api/products/10
```

```json
{
  "id": 10,
  "name": "Laptop",
  "price": 50000
}
```

## 3.5 Layered System

A REST API may contain multiple layers.

```text
Client
  |
  v
API Gateway
  |
  v
Load Balancer
  |
  v
Application Server
  |
  v
Database
```

The client does not need to know the internal architecture.

## 3.6 Code on Demand (Optional)

A server may provide executable code to a client.

For example, a server could deliver JavaScript that a browser executes.

This constraint is optional in REST.

---

# 4. HTTP Methods

HTTP methods define the intended action of a request.

| Method | Purpose | Typical Use |
|---|---|---|
| GET | Retrieve data | Fetch users |
| POST | Submit data or create a resource | Create user |
| PUT | Replace a resource | Replace user details |
| PATCH | Partially update a resource | Update user email |
| DELETE | Delete a resource | Remove user |
| HEAD | Retrieve headers without response body | Check resource metadata |
| OPTIONS | Discover communication options | CORS preflight |

## 4.1 GET

Retrieve information.

```http
GET /api/users
```

Response:

```json
[
  {
    "id": 1,
    "name": "Ali"
  },
  {
    "id": 2,
    "name": "Ahmed"
  }
]
```

GET requests should not be used to perform state-changing operations.

## 4.2 POST

Create a resource or submit data for processing.

```http
POST /api/users
Content-Type: application/json
```

Body:

```json
{
  "name": "Ali",
  "email": "ali@example.com"
}
```

Response:

```http
201 Created
```

```json
{
  "id": 3,
  "name": "Ali",
  "email": "ali@example.com"
}
```

## 4.3 PUT

Replace the target resource representation.

```http
PUT /api/users/3
```

Body:

```json
{
  "name": "Ahmed",
  "email": "ahmed@example.com"
}
```

PUT is generally intended to be idempotent.

Repeatedly submitting the same replacement should produce the same intended resource state.

## 4.4 PATCH

Apply a partial modification.

```http
PATCH /api/users/3
```

Body:

```json
{
  "name": "Ahmed"
}
```

Only the name is updated.

PATCH is not automatically idempotent. Its idempotency depends on the patch operation.

For example, setting a name to a fixed value is idempotent, while incrementing a balance is not.

## 4.5 DELETE

Delete a resource.

```http
DELETE /api/users/3
```

A successful deletion commonly returns:

```http
204 No Content
```

DELETE is defined as idempotent in HTTP semantics, even if the response differs between the first and subsequent requests.

---

# 5. Safe and Idempotent HTTP Methods

These concepts are important in API engineering.

## 5.1 Safe Methods

A safe method is intended to retrieve information without requesting a state change.

Examples:

- GET
- HEAD
- OPTIONS

## 5.2 Idempotent Methods

An idempotent method produces the same intended server state when the same request is repeated.

Examples:

- GET
- HEAD
- OPTIONS
- PUT
- DELETE

POST is not inherently idempotent.

PATCH is not inherently idempotent.

### Example

Consider:

```http
PUT /api/users/10
```

Body:

```json
{
  "name": "Ali"
}
```

Sending this request five times should leave the user with the same name.

Now consider:

```http
POST /api/accounts/10/increment-balance
```

Sending it five times may increase the balance five times.

That operation is not idempotent.

---

# 6. HTTP Status Codes

HTTP status codes communicate the result of an API request.

They are divided into five categories.

| Category | Range | Meaning |
|---|---|---|
| Informational | 100–199 | Request processing information |
| Success | 200–299 | Request succeeded |
| Redirection | 300–399 | Further action or redirection |
| Client Error | 400–499 | Client-side request problem |
| Server Error | 500–599 | Server-side failure |

## 6.1 Important Success Codes

| Status | Meaning | Example |
|---|---|---|
| 200 | OK | Successful GET |
| 201 | Created | Resource created |
| 202 | Accepted | Request accepted for asynchronous processing |
| 204 | No Content | Successful deletion |

## 6.2 Important Client Error Codes

| Status | Meaning | Example |
|---|---|---|
| 400 | Bad Request | Invalid request format |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permission |
| 404 | Not Found | User does not exist |
| 405 | Method Not Allowed | Unsupported HTTP method |
| 409 | Conflict | Duplicate email |
| 410 | Gone | Resource permanently unavailable |
| 413 | Content Too Large | Upload exceeds limit |
| 415 | Unsupported Media Type | Unsupported request format |
| 422 | Unprocessable Content | Semantically invalid data |
| 429 | Too Many Requests | Rate limit exceeded |

## 6.3 Important Server Error Codes

| Status | Meaning |
|---|---|
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 502 | Bad Gateway |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### 401 vs 403

This is a common interview question.

**401 Unauthorized:**

The request lacks valid authentication credentials.

Example:

```json
{
  "message": "Authentication required"
}
```

**403 Forbidden:**

The user is authenticated but does not have permission.

Example:

```json
{
  "message": "You do not have permission to access this resource"
}
```

---

# 7. RESTful Resource Modeling

Good API design begins with identifying resources and their relationships.

Consider an e-commerce application.

Resources:

```text
Users
Products
Orders
Categories
Payments
Reviews
```

Possible endpoints:

```http
GET /api/users
GET /api/users/10

GET /api/products
GET /api/products/20

GET /api/orders
GET /api/orders/30

GET /api/users/10/orders
GET /api/products/20/reviews
```

## 7.1 Nested Resources

Nested endpoints represent relationships.

Example:

```http
GET /api/users/10/orders
```

This retrieves orders belonging to user 10.

Another example:

```http
GET /api/orders/30/items
```

This retrieves items belonging to order 30.

Avoid unnecessarily deep nesting.

For example:

```http
GET /api/companies/1/departments/2/employees/3/tasks/4
```

This can become difficult to maintain.

## 7.2 Naming Conventions

Recommended:

```http
GET /api/users
GET /api/products
GET /api/orders
```

Avoid:

```http
GET /api/getUsers
GET /api/fetchProducts
GET /api/showOrders
```

Use consistent naming conventions:

- Prefer plural resource names.
- Use lowercase.
- Separate words with hyphens where necessary.
- Use nouns instead of action verbs.
- Keep URL structure predictable.

Example:

```http
GET /api/order-items
```

---

# 8. API Request and Response Standards

Production APIs should use consistent request and response structures.

## 8.1 Request Body

Example:

```http
POST /api/users
Content-Type: application/json
```

```json
{
  "name": "Ali",
  "email": "ali@example.com",
  "password": "StrongPassword123!"
}
```

## 8.2 Standard Success Response

One possible response convention:

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "name": "Ali",
    "email": "ali@example.com"
  }
}
```

## 8.3 Standard Error Response

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

This is an application-level response convention, not a mandatory REST format.

## 8.4 Response Consistency

Try to maintain consistent conventions for:

- Success responses.
- Error responses.
- Pagination metadata.
- Date formats.
- Field naming.
- Validation errors.
- Null values.

Example date:

```json
{
  "createdAt": "2026-11-25T12:30:00.000Z"
}
```

ISO 8601 is commonly used for date-time representations.

---

# 9. API Versioning

API versioning allows an API to evolve without unexpectedly breaking existing clients.

Suppose you initially provide:

```http
GET /api/users
```

Response:

```json
{
  "id": 1,
  "name": "Ali"
}
```

Later, you change the response:

```json
{
  "userId": 1,
  "fullName": "Ali",
  "emailAddress": "ali@example.com"
}
```

Existing frontend applications may break.

Versioning allows both versions to coexist.

## 9.1 URI Versioning

The most common approach:

```http
GET /api/v1/users
GET /api/v2/users
```

Example:

```text
src/
  modules/
    users/
      v1/
        user.controller.ts
        user.routes.ts

      v2/
        user.controller.ts
        user.routes.ts
```

Express:

```typescript
import express from "express";

const app = express();

app.use("/api/v1/users", userV1Routes);

app.use("/api/v2/users", userV2Routes);
```

## 9.2 Header Versioning

Version can also be specified through a custom header.

```http
GET /api/users
API-Version: 2
```

## 9.3 Media Type Versioning

Versioning can be represented through the Accept header.

```http
Accept: application/vnd.example.v2+json
```

## 9.4 Query Parameter Versioning

Another possible approach:

```http
GET /api/users?version=2
```

### Versioning Comparison

| Approach | Example |
|---|---|
| URI Versioning | `/api/v1/users` |
| Header Versioning | `API-Version: 2` |
| Media Type Versioning | `application/vnd.example.v2+json` |
| Query Parameter | `?version=2` |

### Which Should You Use?

For most Node.js applications, URI versioning is straightforward and easy to maintain.

However, the best approach depends on API consumers, organizational standards, and compatibility requirements.

**Important:** Do not create a new API version for every small change. Backward-compatible additions often do not require a new major API version.

---

# 10. Pagination

Pagination divides large datasets into smaller portions.

Suppose your database contains 100,000 users.

Returning every user in one response is inefficient.

Instead:

```http
GET /api/users?page=1&limit=10
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Ali"
    },
    {
      "id": 2,
      "name": "Ahmed"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100000,
    "totalPages": 10000
  }
}
```

## 10.1 Offset-Based Pagination

The SQL query:

```sql
SELECT *
FROM users
ORDER BY id
LIMIT 10 OFFSET 0;
```

For page 2:

```sql
SELECT *
FROM users
ORDER BY id
LIMIT 10 OFFSET 10;
```

Formula:

```text
offset = (page - 1) * limit
```

TypeScript:

```typescript
function calculateOffset(
  page: number,
  limit: number
): number {

  return (page - 1) * limit;

}
```

Example:

```typescript
calculateOffset(1, 10); // 0
calculateOffset(2, 10); // 10
calculateOffset(3, 10); // 20
```

## 10.2 Express Pagination

```typescript
app.get("/api/users", async (req, res) => {

  const page = Math.max(
    1,
    Number(req.query.page) || 1
  );

  const limit = Math.min(
    100,
    Math.max(1, Number(req.query.limit) || 10)
  );

  const offset = (page - 1) * limit;

  const users = await prisma.user.findMany({
    skip: offset,
    take: limit,
    orderBy: {
      id: "asc"
    }
  });

  const total = await prisma.user.count();

  return res.json({
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });

});
```

## 10.3 Cursor-Based Pagination

Offset pagination can become inefficient for very large datasets or deep pages.

Cursor-based pagination uses a position marker.

Example:

```http
GET /api/users?cursor=100&limit=10
```

Prisma example:

```typescript
const users = await prisma.user.findMany({
  take: 10,

  skip: cursor ? 1 : 0,

  cursor: cursor
    ? { id: Number(cursor) }
    : undefined,

  orderBy: {
    id: "asc"
  }
});
```

Response:

```json
{
  "data": [
    {
      "id": 101,
      "name": "Ali"
    }
  ],
  "nextCursor": 110
}
```

This is a simplified example. In production, generate the next cursor from the last returned record and handle empty pages and invalid cursors.

### Offset vs Cursor Pagination

| Feature | Offset | Cursor |
|---|---|---|
| Implementation | Simple | More involved |
| Page navigation | Easy | Usually sequential |
| Deep pagination | Can become expensive | Often more efficient |
| Concurrent inserts | Can shift page boundaries | More stable with suitable ordering |
| Best Use | Admin tables, small datasets | Feeds, timelines, large datasets |

**Important:** Cursor pagination requires deterministic ordering. Use a unique tie-breaker when sorting by a non-unique column.

---

# 11. Filtering

Filtering allows clients to retrieve only matching records.

Example:

```http
GET /api/products?category=electronics
```

Another example:

```http
GET /api/products?minPrice=1000&maxPrice=50000
```

Multiple filters:

```http
GET /api/products?category=electronics&brand=dell&inStock=true
```

## 11.1 Express Filtering Example

```typescript
app.get("/api/products", async (req, res) => {

  const {
    category,
    minPrice,
    maxPrice
  } = req.query;

  const products = await prisma.product.findMany({
    where: {
      category: category
        ? String(category)
        : undefined,

      price: {
        gte: minPrice
          ? Number(minPrice)
          : undefined,

        lte: maxPrice
          ? Number(maxPrice)
          : undefined
      }
    }
  });

  res.json(products);

});
```

In production, validate numeric values and reject invalid ranges rather than silently accepting malformed query parameters.

## 11.2 Filtering with Multiple Conditions

Example:

```http
GET /api/orders?status=completed&paymentStatus=paid
```

Possible SQL:

```sql
SELECT *
FROM orders
WHERE status = 'completed'
AND payment_status = 'paid';
```

---

# 12. Sorting

Sorting allows clients to control result order.

Example:

```http
GET /api/products?sortBy=price&order=asc
```

Another:

```http
GET /api/products?sortBy=createdAt&order=desc
```

Possible implementation:

```typescript
const allowedSortFields = [
  "price",
  "createdAt",
  "name"
] as const;

type SortField = typeof allowedSortFields[number];

function isValidSortField(
  value: string
): value is SortField {

  return allowedSortFields.includes(
    value as SortField
  );

}
```

Usage:

```typescript
const sortBy = String(req.query.sortBy || "createdAt");

const order =
  req.query.order === "asc"
    ? "asc"
    : "desc";

if (!isValidSortField(sortBy)) {
  return res.status(400).json({
    message: "Invalid sort field"
  });
}

const products = await prisma.product.findMany({
  orderBy: {
    [sortBy]: order
  }
});
```

**Important:** Never blindly interpolate client-provided column names into SQL queries. Use allowlists and parameterized queries.

---

# 13. API Search

Search is different from filtering.

Filtering selects records based on specific conditions.

Search usually finds records matching a search term.

Example:

```http
GET /api/products?search=laptop
```

Possible SQL:

```sql
SELECT *
FROM products
WHERE name LIKE '%laptop%';
```

With Prisma:

```typescript
const products = await prisma.product.findMany({
  where: {
    name: {
      contains: searchTerm,
      mode: "insensitive"
    }
  }
});
```

Case-insensitive filtering support depends on the database provider.

## 13.1 Advanced Search

A production application may support:

- Full-text search.
- Multiple fields.
- Exact matching.
- Partial matching.
- Search relevance.
- Search suggestions.
- Typo tolerance.

For advanced search, consider:

- PostgreSQL Full Text Search.
- MySQL Full-Text Indexes.
- Elasticsearch.
- OpenSearch.

---

# 14. Request Validation

Never trust incoming API data.

Even if the frontend validates input, attackers can send requests directly to your backend.

Consider:

```typescript
app.post("/api/users", async (req, res) => {

  const { name, email, age } = req.body;

  // Directly saving unvalidated input is dangerous.

});
```

Problems:

- Missing fields.
- Incorrect types.
- Invalid email.
- Unexpected values.
- Excessively long strings.
- Malicious payloads.

## 14.1 Validation Using Zod

Zod is a TypeScript-first schema validation library.

Official documentation: [Zod Documentation](https://zod.dev/?utm_source=chatgpt.com)

Install:

```bash
npm install zod
```

Create a schema:

```typescript
import { z } from "zod";

const createUserSchema = z.object({

  name: z.string().min(2).max(100),

  email: z.email(),

  age: z.number().int().min(18).optional()

});
```

Validate:

```typescript
const result = createUserSchema.safeParse(req.body);

if (!result.success) {

  return res.status(400).json({
    message: "Validation failed",
    errors: result.error.issues
  });

}

const data = result.data;
```

Notice:

`safeParse()` returns a result object rather than throwing an exception for ordinary validation failures.

## 14.2 Reusable Validation Middleware

```typescript
import {
  Request,
  Response,
  NextFunction
} from "express";

import { z } from "zod";

export function validateBody(
  schema: z.ZodType
) {

  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    const result = schema.safeParse(req.body);

    if (!result.success) {

      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues
      });

    }

    req.body = result.data;

    next();

  };

}
```

Usage:

```typescript
app.post(
  "/api/users",
  validateBody(createUserSchema),
  createUserController
);
```

You should also validate:

- Route parameters.
- Query parameters.
- Request headers where relevant.
- File upload metadata.

---

# 15. Response Serialization

Serialization converts application data into a format suitable for transmission.

For example:

```typescript
const user = {
  id: 1,
  name: "Ali",
  email: "ali@example.com",
  passwordHash: "secret-hash"
};
```

Returning this object directly could expose sensitive information.

Instead:

```typescript
function serializeUser(user: User) {

  return {
    id: user.id,
    name: user.name,
    email: user.email
  };

}
```

Usage:

```typescript
res.json(serializeUser(user));
```

## 15.1 Why Serialization Matters

- Prevents sensitive field exposure.
- Maintains consistent response formats.
- Separates database structures from API contracts.
- Allows field renaming.
- Supports API versioning.

**Best practice:** Explicitly select or map fields rather than relying on accidental omission of sensitive fields.

---

# 16. Centralized Error Handling

Without centralized error handling, every controller may contain repetitive try-catch blocks.

Example:

```typescript
app.get("/users", async (req, res) => {

  try {

    // Business logic

  } catch (error) {

    return res.status(500).json({
      message: "Internal server error"
    });

  }

});
```

For a large application, this becomes difficult to maintain.

## 16.1 Create Custom API Error

```typescript
export class AppError extends Error {

  constructor(
    public statusCode: number,
    message: string
  ) {

    super(message);

    this.name = "AppError";

  }

}
```

## 16.2 Use Custom Errors

```typescript
import { AppError } from "./AppError";

async function getUser(id: number) {

  if (id <= 0) {
    throw new AppError(400, "Invalid user ID");
  }

  const user = await prisma.user.findUnique({
    where: { id }
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;

}
```

## 16.3 Create Error Middleware

```typescript
import {
  Request,
  Response,
  NextFunction
} from "express";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {

  if (res.headersSent) {
    return next(error);
  }

  const statusCode =
    error instanceof AppError
      ? error.statusCode
      : 500;

  const message =
    error instanceof AppError
      ? error.message
      : "Internal server error";

  return res.status(statusCode).json({
    success: false,
    message
  });

}
```

Register it after routes:

```typescript
app.use(errorHandler);
```

## 16.4 Async Error Handling

Express 5 automatically forwards rejected promises returned by route handlers and middleware to error-handling middleware.

With Express 4, use an async wrapper or explicitly forward errors with `next(error)`.

Example wrapper:

```typescript
import {
  Request,
  Response,
  NextFunction,
  RequestHandler
} from "express";

export const asyncHandler = (
  handler: RequestHandler
): RequestHandler => {

  return (req, res, next) => {

    Promise.resolve(
      handler(req, res, next)
    ).catch(next);

  };

};
```

---

# 17. Idempotency in APIs

Idempotency ensures that repeating the same operation does not accidentally produce duplicate effects.

This is particularly important for:

- Payment APIs.
- Order creation.
- Booking systems.
- Financial transactions.
- Subscription operations.

Suppose a user clicks Pay twice because the network response is delayed.

Without protection:

```text
Request 1 → Payment Created
Request 2 → Another Payment Created
```

This can cause duplicate charges.

## 17.1 Idempotency Key

The client sends a unique key:

```http
POST /api/payments
Idempotency-Key: payment-abc-123
```

The server stores the result associated with that key.

If the same key is received again, the server returns the original result instead of executing the operation again.

Conceptual implementation:

```typescript
async function createPayment(
  idempotencyKey: string,
  amount: number
) {

  const existing = await prisma.idempotencyRecord.findUnique({
    where: {
      key: idempotencyKey
    }
  });

  if (existing) {
    return existing.response;
  }

  // Create payment and save idempotency result
}
```

This simplified implementation is not concurrency-safe by itself.

A production implementation needs:

- A unique database constraint on the idempotency key.
- Atomic processing or locking.
- Request payload consistency checks.
- A strategy for in-progress requests.
- A defined expiration/retention policy.

---

# 18. API Rate Limiting

Rate limiting controls how many requests a client can make within a time period.

Example:

```text
100 requests per minute per IP address
```

Why is it needed?

- Prevent abuse.
- Reduce automated attacks.
- Protect server resources.
- Control API consumption.
- Reduce brute-force attempts.

## 18.1 Install express-rate-limit

```bash
npm install express-rate-limit
```

Official documentation: [express-rate-limit Documentation](https://express-rate-limit.mintlify.app/?utm_source=chatgpt.com)

## 18.2 Basic Implementation

```typescript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({

  windowMs: 60 * 1000,

  limit: 100,

  message: {
    success: false,
    message: "Too many requests"
  },

  standardHeaders: "draft-8",

  legacyHeaders: false

});

app.use("/api", limiter);
```

This limits requests according to the configured rate-limit key generator and store.

## 18.3 Different Rate Limits

You may want different limits for different endpoints.

```typescript
const loginLimiter = rateLimit({

  windowMs: 15 * 60 * 1000,

  limit: 5,

  message: {
    message: "Too many login attempts"
  }

});
```

Apply:

```typescript
app.post(
  "/api/auth/login",
  loginLimiter,
  loginController
);
```

## 18.4 Distributed Rate Limiting

If you run multiple backend instances:

```text
           Load Balancer
                 |
        +--------+--------+
        |                 |
        v                 v
     Server 1          Server 2
        |                 |
        +--------+--------+
                 |
                 v
                Redis
```

Use a shared rate-limit store such as Redis.

Otherwise, each server may maintain its own independent counter, allowing clients to exceed the intended global limit.

**Important:** When deploying behind a reverse proxy, configure Express `trust proxy` correctly. Incorrect settings can cause IP identification and rate limiting to behave unexpectedly.

---

# 19. API Security Fundamentals

API security protects:

- User information.
- Authentication credentials.
- Business data.
- Payment information.
- Application infrastructure.

A secure API should implement multiple defensive layers.

Important security topics:

1. Authentication.
2. Authorization.
3. Input validation.
4. Output encoding.
5. Rate limiting.
6. HTTPS.
7. CORS.
8. CSRF protection.
9. SQL injection prevention.
10. Secure file uploads.
11. Secret management.
12. Logging and monitoring.

A useful reference is the OWASP Foundation API Security Top 10.

Official reference: [OWASP API Security Top 10](https://owasp.org/API-Security/?utm_source=chatgpt.com)

---

# 20. Authentication vs Authorization

These concepts are different.

## Authentication

Authentication verifies who the user is.

Example:

```text
Email + Password
       |
       v
Verify Credentials
       |
       v
Generate Access Token
```

## Authorization

Authorization verifies what an authenticated user can do.

Example:

```text
User Role: Admin
       |
       v
Can Delete Users?
       |
       v
Permission Granted
```

### Example

```typescript
type Role = "admin" | "user";

function canDeleteUser(role: Role) {

  return role === "admin";

}
```

In production, authorization should also consider resource ownership and fine-grained permissions where appropriate.

---

# 21. CORS (Cross-Origin Resource Sharing)

CORS is a browser-enforced mechanism that controls whether a web page can access resources from another origin.

An origin consists of:

```text
Scheme + Host + Port
```

Example:

```text
Frontend:
http://localhost:3000

Backend:
http://localhost:5000
```

These are different origins because their ports differ.

When the frontend requests the backend, the browser checks whether the backend permits that origin.

## 21.1 What Is a CORS Error?

Suppose:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:5000
```

The backend does not permit the frontend origin.

The browser may block JavaScript from accessing the response.

## 21.2 Configure CORS in Express

Install:

```bash
npm install cors

npm install --save-dev @types/cors
```

Configuration:

```typescript
import cors from "cors";

app.use(cors({

  origin: "http://localhost:3000",

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE"
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ],

  credentials: true

}));
```

## 21.3 Allow Multiple Origins

```typescript
const allowedOrigins = [
  "http://localhost:3000",
  "https://example.com"
];

app.use(cors({

  origin(origin, callback) {

    if (!origin || allowedOrigins.includes(origin)) {

      return callback(null, true);

    }

    return callback(new Error("Not allowed by CORS"));

  },

  credentials: true

}));
```

### Important CORS Rules

- CORS is primarily enforced by browsers.
- CORS is not authentication.
- CORS does not stop direct API requests made using tools such as curl or Postman.
- Credentialed requests cannot use `Access-Control-Allow-Origin: *`.
- CORS configuration should explicitly permit trusted origins.

---

# 22. CSRF (Cross-Site Request Forgery)

CSRF is an attack in which a malicious website tricks a user's browser into sending an unwanted request to another website where the user is authenticated.

Example:

```text
User logs into bank.com
          |
          v
Browser stores authentication cookie
          |
          v
User visits malicious-site.com
          |
          v
Malicious site triggers request to bank.com
          |
          v
Browser may automatically attach cookie
```

If the bank does not implement appropriate protections, the unwanted action may succeed.

## 22.1 CSRF Protection Techniques

1. CSRF tokens.
2. SameSite cookies.
3. Origin/Referer validation where appropriate.
4. Custom request headers for browser-based APIs.
5. Avoiding state-changing GET requests.

## 22.2 SameSite Cookies

Example:

```typescript
res.cookie("session", token, {

  httpOnly: true,

  secure: true,

  sameSite: "lax"

});
```

Possible SameSite values:

| Value | Behavior |
|---|---|
| Strict | Cookie is restricted in cross-site contexts. |
| Lax | Allows certain top-level cross-site navigations. |
| None | Allows cross-site cookie usage; requires Secure. |

**Important:** SameSite is useful protection but does not replace a complete CSRF strategy for every application.

---

# 23. XSS (Cross-Site Scripting)

XSS occurs when attackers inject malicious scripts into content that is executed in another user's browser.

Example:

```html
<script>
  alert("XSS");
</script>
```

If an application inserts untrusted content into HTML without proper handling, malicious JavaScript may execute.

## 23.1 Types of XSS

| Type | Explanation |
|---|---|
| Stored XSS | Malicious content is stored and later displayed. |
| Reflected XSS | Malicious input is reflected in a response. |
| DOM-Based XSS | Client-side JavaScript introduces the vulnerability. |

## 23.2 Prevention

- Context-aware output encoding.
- Avoid unsafe HTML injection.
- Sanitize HTML when rich HTML input is required.
- Use Content Security Policy.
- Keep frontend dependencies updated.
- Use secure templating practices.

For example, React escapes text values by default:

```tsx
function UserComment() {

  const comment = "<script>alert('XSS')</script>";

  return <p>{comment}</p>;

}
```

React renders this as text rather than executing it.

However, using `dangerouslySetInnerHTML` requires additional care and proper sanitization.

---

# 24. SQL Injection

SQL Injection occurs when untrusted input changes the structure of a SQL query.

Unsafe example:

```typescript
const query = `
  SELECT *
  FROM users
  WHERE email = '${email}'
`;
```

An attacker may submit specially crafted input that changes the SQL statement.

## 24.1 Use Parameterized Queries

With mysql2:

```typescript
const [rows] = await connection.execute(
  "SELECT * FROM users WHERE email = ?",
  [email]
);
```

The parameter is treated as data rather than SQL syntax.

## 24.2 Use ORM Safely

Prisma example:

```typescript
const user = await prisma.user.findUnique({
  where: {
    email
  }
});
```

ORMs help protect against common SQL injection vulnerabilities when using their safe query APIs.

However, raw SQL can still introduce vulnerabilities if user input is interpolated unsafely.

**Important:** Parameterized values generally cannot be used for table names or column names. Use strict allowlists for dynamic identifiers.

---

# 25. API Authentication Using JWT

JWT stands for JSON Web Token.

It is a token format commonly used for transmitting signed claims.

A JWT has three parts:

```text
Header.Payload.Signature
```

Example structure:

```text
xxxxx.yyyyy.zzzzz
```

## 25.1 JWT Structure

### Header

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Payload

```json
{
  "sub": "123",
  "role": "user"
}
```

### Signature

The signature is generated using the configured signing algorithm and secret or private key.

**Important:** A signed JWT is not necessarily encrypted. Its payload can usually be decoded by anyone who has the token. Never store passwords or sensitive secrets in ordinary JWT claims.

## 25.2 Install JWT Library

```bash
npm install jsonwebtoken

npm install --save-dev @types/jsonwebtoken
```

Official documentation: [jsonwebtoken Documentation](https://github.com/auth0/node-jsonwebtoken?utm_source=chatgpt.com)

## 25.3 Generate Token

```typescript
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function generateToken(userId: number) {

  return jwt.sign(
    {
      sub: userId
    },
    JWT_SECRET,
    {
      expiresIn: "15m"
    }
  );

}
```

For production, validate that the secret exists and is sufficiently strong rather than relying only on a non-null assertion.

## 25.4 Verify Token

```typescript
export function verifyToken(token: string) {

  return jwt.verify(
    token,
    JWT_SECRET
  );

}
```

## 25.5 Authentication Middleware

```typescript
import {
  Request,
  Response,
  NextFunction
} from "express";

import jwt from "jsonwebtoken";

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {

  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {

    return res.status(401).json({
      message: "Authentication required"
    });

  }

  const token = authHeader.split(" ")[1];

  try {

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    res.locals.user = payload;

    next();

  } catch {

    return res.status(401).json({
      message: "Invalid or expired token"
    });

  }

}
```

For stronger production security:

- Pin accepted algorithms.
- Validate issuer and audience.
- Validate expected token purpose.
- Use a suitable key-management strategy.
- Consider token revocation and rotation.
- Do not trust unverified token claims.

---

# 26. API Authorization – Role-Based Access Control

RBAC stands for Role-Based Access Control.

Permissions are assigned to roles.

Example:

```text
Admin
  - Create User
  - Update User
  - Delete User
  - View Reports

User
  - View Profile
  - Update Profile
```

Implementation:

```typescript
import {
  Request,
  Response,
  NextFunction
} from "express";

type Role = "admin" | "user";

export function authorize(
  ...allowedRoles: Role[]
) {

  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    const user = res.locals.user as {
      role: Role;
    } | undefined;

    if (!user || !allowedRoles.includes(user.role)) {

      return res.status(403).json({
        message: "Access denied"
      });

    }

    next();

  };

}
```

Usage:

```typescript
app.delete(
  "/api/users/:id",
  authenticate,
  authorize("admin"),
  deleteUserController
);
```

### RBAC vs ABAC

| RBAC | ABAC |
|---|---|
| Access depends on roles. | Access depends on attributes and policies. |
| Easier to implement. | More flexible. |
| Example: Admin can delete users. | Example: Manager can access records in their department. |

For more complex systems, attribute-based access control may be useful.

---

# 27. OpenAPI Specification

OpenAPI is a standard specification for describing HTTP APIs.

It allows developers and tools to understand an API without inspecting its implementation.

An OpenAPI document can describe:

- Endpoints.
- HTTP methods.
- Request parameters.
- Request bodies.
- Response schemas.
- Authentication.
- Error responses.
- API metadata.

Official documentation: [OpenAPI Specification](https://spec.openapis.org/oas/latest.html?utm_source=chatgpt.com)

## 27.1 Basic OpenAPI Document

Create:

```yaml
openapi: 3.1.0

info:
  title: User Management API
  version: 1.0.0
  description: API documentation for user management

servers:
  - url: http://localhost:5000/api/v1

paths:
  /users:
    get:
      summary: Get all users

      responses:
        "200":
          description: Users retrieved successfully

          content:
            application/json:
              schema:
                type: array

                items:
                  $ref: "#/components/schemas/User"

    post:
      summary: Create a user

      requestBody:
        required: true

        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateUser"

      responses:
        "201":
          description: User created successfully

components:
  schemas:

    User:
      type: object

      properties:
        id:
          type: integer

        name:
          type: string

        email:
          type: string
          format: email

    CreateUser:
      type: object

      required:
        - name
        - email

      properties:
        name:
          type: string

        email:
          type: string
          format: email
```

This document describes the API contract.

It does not automatically implement the endpoints.

---

# 28. Swagger Documentation

Swagger is a collection of tools built around OpenAPI.

One commonly used tool is Swagger UI.

It provides an interactive browser interface for exploring and testing documented API endpoints.

Example interface:

```text
User Management API
       |
       +---- GET /users
       |
       +---- GET /users/{id}
       |
       +---- POST /users
       |
       +---- PATCH /users/{id}
       |
       +---- DELETE /users/{id}
```

Official documentation: [Swagger Documentation](https://swagger.io/docs/?utm_source=chatgpt.com)

## 28.1 Install Swagger Tools

```bash
npm install swagger-ui-express

npm install --save-dev @types/swagger-ui-express
```

You can use a YAML or JSON OpenAPI document.

For a TypeScript-based setup, one option is to generate the document from route annotations using `swagger-jsdoc`.

```bash
npm install swagger-jsdoc

npm install --save-dev @types/swagger-jsdoc
```

## 28.2 Configure Swagger

```typescript
import swaggerJsdoc from "swagger-jsdoc";

import swaggerUi from "swagger-ui-express";

const options = {

  definition: {

    openapi: "3.1.0",

    info: {
      title: "User API",
      version: "1.0.0"
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

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);
```

Add route documentation:

```typescript
/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Successful response
 */
```

Open:

```text
http://localhost:5000/api-docs
```

You should now see interactive API documentation.

### Why Swagger Matters

- Developers can understand endpoints quickly.
- Frontend and backend teams can coordinate.
- API contracts become explicit.
- Manual documentation effort is reduced.
- API testing becomes easier.

**Best practice:** Treat your OpenAPI document as part of the API contract and keep it synchronized with actual behavior.

---

# 29. GraphQL Fundamentals

GraphQL is a query language for APIs and a runtime for executing those queries.

It was developed by Facebook and open-sourced in 2015.

Official documentation: [GraphQL Documentation](https://graphql.org/learn/?utm_source=chatgpt.com)

Unlike traditional REST APIs, GraphQL commonly exposes one endpoint where clients specify the data they need.

## 29.1 REST vs GraphQL

REST:

```http
GET /api/users/1
GET /api/users/1/orders
GET /api/orders/10/items
```

GraphQL:

```graphql
query {
  user(id: 1) {
    id
    name
    orders {
      id
      items {
        name
        price
      }
    }
  }
}
```

The client specifies the required fields.

## 29.2 GraphQL Benefits

- Flexible data queries.
- Strong schema system.
- Reduces unnecessary response fields.
- Useful for complex relationships.
- Supports multiple data sources.

## 29.3 GraphQL Challenges

- Resolver performance.
- N+1 query problem.
- Query complexity.
- Caching complexity.
- Authorization at field and resource levels.
- Operational complexity.

GraphQL is not automatically faster than REST.

---

# 30. GraphQL Schema

GraphQL uses a strongly defined schema.

Example:

```graphql
type User {
  id: ID!
  name: String!
  email: String!
}

type Query {
  users: [User!]!
  user(id: ID!): User
}
```

### Understanding Symbols

| Symbol | Meaning |
|---|---|
| `String` | String type |
| `Int` | Integer type |
| `Float` | Floating-point number |
| `Boolean` | Boolean type |
| `ID` | Identifier type |
| `!` | Non-null |
| `[User]` | List of users |
| `[User!]!` | Non-null list containing non-null users |

Example:

```graphql
email: String!
```

This means email cannot be null.

---

# 31. GraphQL Queries

A Query retrieves information.

Example:

```graphql
query {
  users {
    id
    name
    email
  }
}
```

Response:

```json
{
  "data": {
    "users": [
      {
        "id": "1",
        "name": "Ali",
        "email": "ali@example.com"
      }
    ]
  }
}
```

## 31.1 Query Arguments

```graphql
query {
  user(id: "1") {
    id
    name
  }
}
```

The client passes an argument to the `user` field.

## 31.2 Query Variables

Instead of hardcoding arguments:

```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
  }
}
```

Variables:

```json
{
  "id": "1"
}
```

This improves query reuse.

---

# 32. GraphQL Mutations

Mutations modify application data.

Common operations:

- Create.
- Update.
- Delete.

Schema:

```graphql
type Mutation {
  createUser(
    name: String!
    email: String!
  ): User!
}
```

Mutation:

```graphql
mutation {
  createUser(
    name: "Ali"
    email: "ali@example.com"
  ) {
    id
    name
    email
  }
}
```

Response:

```json
{
  "data": {
    "createUser": {
      "id": "1",
      "name": "Ali",
      "email": "ali@example.com"
    }
  }
}
```

---

# 33. GraphQL Resolvers

Resolvers are functions that provide the data for GraphQL fields.

Consider:

```graphql
type User {
  id: ID!
  name: String!
  email: String!
}

type Query {
  users: [User!]!
}
```

Resolver:

```typescript
const resolvers = {

  Query: {

    users: async () => {

      return prisma.user.findMany();

    }

  }

};
```

The resolver executes when the client requests `users`.

## 33.1 Resolver Arguments

Schema:

```graphql
type Query {
  user(id: ID!): User
}
```

Resolver:

```typescript
const resolvers = {

  Query: {

    user: async (
      parent: unknown,
      args: { id: string }
    ) => {

      return prisma.user.findUnique({
        where: {
          id: Number(args.id)
        }
      });

    }

  }

};
```

Resolver arguments commonly include:

```typescript
(parent, args, context, info)
```

| Argument | Purpose |
|---|---|
| parent | Result from the parent resolver. |
| args | Arguments passed by the client. |
| context | Shared request-specific information. |
| info | Execution metadata about the current field. |

---

# 34. Building a GraphQL API with Apollo Server

Apollo Server is a popular GraphQL server implementation.

Official documentation: [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/?utm_source=chatgpt.com)

Install:

```bash
npm install @apollo/server graphql
```

## 34.1 Define Schema

```typescript
import { gql } from "graphql-tag";

const typeDefs = gql`

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    users: [User!]!
  }

`;
```

Depending on your setup, install `graphql-tag` separately or use an available supported schema-definition approach.

## 34.2 Define Resolvers

```typescript
const resolvers = {

  Query: {

    users: async () => {

      return prisma.user.findMany();

    }

  }

};
```

## 34.3 Create Apollo Server

```typescript
import { ApolloServer } from "@apollo/server";

const server = new ApolloServer({

  typeDefs,

  resolvers

});
```

For an Express integration, use the adapter supported by your selected Apollo Server version. The exact integration package and setup differ across major versions.

**Important:** Do not copy old Apollo Server 2 or 3 Express integration examples into a modern Apollo Server project without checking compatibility.

---

# 35. GraphQL Authentication and Authorization

GraphQL authentication is commonly implemented using request context.

Example concept:

```typescript
interface GraphQLContext {

  user: {
    id: number;
    role: "admin" | "user";
  } | null;

}
```

A context function can extract and verify the authentication token.

```typescript
async function createContext(token?: string): Promise<GraphQLContext> {

  if (!token) {
    return {
      user: null
    };
  }

  // Verify token and retrieve user

  return {
    user: {
      id: 1,
      role: "user"
    }
  };

}
```

Resolver:

```typescript
const resolvers = {

  Query: {

    myProfile: async (
      parent: unknown,
      args: unknown,
      context: GraphQLContext
    ) => {

      if (!context.user) {
        throw new Error("Authentication required");
      }

      return prisma.user.findUnique({
        where: {
          id: context.user.id
        }
      });

    }

  }

};
```

### Important Security Practices

- Validate every user input.
- Enforce permissions in resolvers or shared authorization services.
- Avoid trusting client-supplied user IDs.
- Limit query depth and complexity.
- Control expensive nested queries.
- Prevent unauthorized access to nested fields.

---

# 36. GraphQL N+1 Query Problem

Consider:

```graphql
query {
  users {
    id
    name
    orders {
      id
      total
    }
  }
}
```

Suppose there are 100 users.

A naive implementation might execute:

```text
1 query to fetch users
100 queries to fetch orders
```

Total:

```text
101 database queries
```

This is the N+1 problem.

## 36.1 DataLoader

DataLoader batches and caches data loading operations within a request.

Official documentation: [DataLoader GitHub Repository](https://github.com/graphql/dataloader?utm_source=chatgpt.com)

Conceptual example:

```typescript
import DataLoader from "dataloader";

const orderLoader = new DataLoader(
  async (userIds: readonly number[]) => {

    const orders = await prisma.order.findMany({
      where: {
        userId: {
          in: [...userIds]
        }
      }
    });

    return userIds.map(userId =>
      orders.filter(order => order.userId === userId)
    );

  }
);
```

Resolver:

```typescript
const resolvers = {

  User: {

    orders: async (user: { id: number }) => {

      return orderLoader.load(user.id);

    }

  }

};
```

The example demonstrates batching. For production, instantiate loaders per request and ensure the returned array aligns exactly with the input key order.

### Benefits

- Reduces duplicate queries.
- Batches database access.
- Improves GraphQL performance.
- Provides request-scoped caching.

---

# 37. REST vs GraphQL

| Feature | REST | GraphQL |
|---|---|---|
| API Structure | Multiple resource endpoints | Usually one GraphQL endpoint |
| Data Fetching | Server-defined response | Client selects fields |
| Over-fetching | Possible | Can be reduced |
| Under-fetching | Possible | Can be reduced |
| Caching | HTTP caching is well established | Requires more deliberate strategy |
| Versioning | Commonly URI/header based | Often schema evolution |
| Learning Curve | Lower | Higher |
| Real-Time | Usually WebSockets/SSE separately | Subscriptions commonly use real-time transports |
| Best Use | Resource-oriented APIs | Complex data requirements |

### When Should You Use REST?

- CRUD applications.
- Public APIs.
- Simple service integrations.
- HTTP caching is important.
- Resource-oriented operations.

### When Should You Use GraphQL?

- Complex nested data.
- Multiple frontend clients with different data requirements.
- Flexible query selection.
- Aggregation from multiple data sources.

Both approaches can coexist in one application.

---

# 38. WebSockets Fundamentals

WebSockets provide a persistent, bidirectional communication channel between a client and a server.

Unlike normal HTTP request-response communication, both sides can send messages independently after the connection is established.

Example:

```text
Client  <-------->  Server
  |                    |
  |------ Message ---->|
  |<----- Message -----|
  |                    |
  |------ Message ---->|
```

## 38.1 HTTP vs WebSockets

| HTTP | WebSockets |
|---|---|
| Request-response model | Bidirectional communication |
| Typically separate requests | Persistent connection |
| Server responds to requests | Server can send messages independently |
| Good for CRUD APIs | Good for real-time applications |

## 38.2 WebSocket Handshake

A WebSocket connection typically begins with an HTTP upgrade request.

Example:

```http
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: ...
Sec-WebSocket-Version: 13
```

The server accepts the upgrade, and communication switches to the WebSocket protocol.

---

# 39. WebSocket Server with TypeScript

Install:

```bash
npm install ws

npm install --save-dev @types/ws
```

Official documentation: [ws GitHub Repository](https://github.com/websockets/ws?utm_source=chatgpt.com)

## 39.1 Create Server

```typescript
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({
  port: 8080
});

wss.on("connection", (socket) => {

  console.log("Client connected");

  socket.send("Welcome to WebSocket Server");

  socket.on("message", (message) => {

    console.log("Received:", message.toString());

    socket.send(
      `Server received: ${message.toString()}`
    );

  });

  socket.on("close", () => {

    console.log("Client disconnected");

  });

});
```

## 39.2 Client Connection

Browser JavaScript:

```typescript
const socket = new WebSocket(
  "ws://localhost:8080"
);

socket.onopen = () => {

  console.log("Connected");

  socket.send("Hello Server");

};

socket.onmessage = (event) => {

  console.log("Received:", event.data);

};

socket.onclose = () => {

  console.log("Disconnected");

};
```

## 39.3 Broadcasting Messages

Suppose multiple users connect to the server.

You can broadcast messages:

```typescript
wss.on("connection", (socket) => {

  socket.on("message", (message) => {

    for (const client of wss.clients) {

      if (client.readyState === 1) {

        client.send(message.toString());

      }

    }

  });

});
```

For production, use the library's ready-state constants, validate incoming messages, limit message size, and implement appropriate authorization.

---

# 40. Socket.IO

Socket.IO is a library for real-time, bidirectional communication.

It provides features beyond basic WebSockets:

- Event-based communication.
- Automatic reconnection.
- Rooms.
- Namespaces.
- Broadcasting.
- Acknowledgements.
- Transport fallback where supported.

Official documentation: [Socket.IO Documentation](https://socket.io/docs/v4/?utm_source=chatgpt.com)

## 40.1 Install Socket.IO

```bash
npm install socket.io socket.io-client
```

## 40.2 Create Server

```typescript
import express from "express";

import { createServer } from "http";

import { Server } from "socket.io";

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {

  cors: {
    origin: "http://localhost:3000"
  }

});

io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  socket.on("message", (message: string) => {

    console.log("Message:", message);

    io.emit("message", message);

  });

  socket.on("disconnect", () => {

    console.log("User disconnected");

  });

});

httpServer.listen(5000, () => {

  console.log("Server running on port 5000");

});
```

## 40.3 Client

```typescript
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("connect", () => {

  console.log("Connected:", socket.id);

});

socket.emit("message", "Hello from client");

socket.on("message", (message) => {

  console.log(message);

});
```

**Important:** Socket.IO is not a plain WebSocket implementation. Its protocol includes additional framing and features, so a standard WebSocket client cannot directly communicate with a Socket.IO server.

---

# 41. Socket.IO Rooms

Rooms allow the server to group connected clients.

Example:

```text
Chat Application
       |
       +---- Room: General
       |
       +---- Room: Technology
       |
       +---- Room: Gaming
```

Users in one room receive messages sent to that room.

## 41.1 Join Room

```typescript
io.on("connection", (socket) => {

  socket.on("join-room", (roomId: string) => {

    socket.join(roomId);

    socket.emit("joined-room", roomId);

  });

});
```

## 41.2 Send Message to Room

```typescript
socket.on(
  "send-message",
  ({ roomId, message }) => {

    io.to(roomId).emit("receive-message", {
      message
    });

  }
);
```

## 41.3 Leave Room

```typescript
socket.on("leave-room", (roomId: string) => {

  socket.leave(roomId);

});
```

### Real-World Applications

- Chat applications.
- Multiplayer games.
- Collaborative tools.
- Live dashboards.
- Real-time notifications.
- Online presence systems.

**Security warning:** Never trust a client-provided room ID as proof of permission. Verify that the user is authorized to join and send messages to that room.

---

# 42. Building a Real-Time Chat Architecture

A chat application is a practical example of combining REST APIs and WebSockets.

Architecture:

```text
                Frontend
                   |
          +--------+--------+
          |                 |
          v                 v
       REST API         Socket.IO
          |                 |
          v                 v
       Backend          Real-Time
          |              Events
          |
          v
        MySQL
          |
          v
        Redis
```

### REST API Responsibilities

- Register users.
- Login users.
- Retrieve chat history.
- Create conversations.
- Upload attachments.
- Retrieve user profiles.

### Socket.IO Responsibilities

- Send messages.
- Receive messages.
- Typing indicators.
- Online/offline presence.
- Read receipts.
- Room notifications.

### Database Responsibilities

Store:

- Users.
- Conversations.
- Messages.
- Attachments.
- Read receipts.

### Redis Responsibilities

Potential uses:

- Shared presence information.
- Distributed coordination.
- Socket.IO adapter support.
- Caching.

For multiple Socket.IO servers, use a compatible adapter such as the Redis adapter.

---

# 43. Server-Sent Events (SSE)

Server-Sent Events allow a server to send a continuous stream of events to a client over HTTP.

Unlike WebSockets, SSE is primarily one-way:

```text
Server
   |
   | Event 1
   v
Client

Server
   |
   | Event 2
   v
Client
```

The client can still send normal HTTP requests separately.

## 43.1 SSE vs WebSockets

| Feature | SSE | WebSockets |
|---|---|---|
| Communication | Server to client | Bidirectional |
| Transport | HTTP | WebSocket |
| Browser support | EventSource API | WebSocket API |
| Reconnection | Built into EventSource behavior | Usually implemented by client/library |
| Best Use | Notifications, updates, feeds | Chat, games, collaboration |

## 43.2 SSE Server Example

```typescript
import express from "express";

const app = express();

app.get("/events", (req, res) => {

  res.setHeader(
    "Content-Type",
    "text/event-stream"
  );

  res.setHeader(
    "Cache-Control",
    "no-cache"
  );

  res.setHeader(
    "Connection",
    "keep-alive"
  );

  res.flushHeaders();

  const interval = setInterval(() => {

    res.write(
      `data: ${JSON.stringify({
        message: "Hello from server",
        time: new Date().toISOString()
      })}\n\n`
    );

  }, 3000);

  req.on("close", () => {

    clearInterval(interval);

  });

});
```

## 43.3 SSE Client

```typescript
const eventSource = new EventSource(
  "http://localhost:5000/events"
);

eventSource.onmessage = (event) => {

  console.log(JSON.parse(event.data));

};
```

SSE supports event IDs, named events, and retry intervals.

For production, also consider proxy buffering, connection limits, authentication, and cleanup when clients disconnect.

---

# 44. API Gateway

An API Gateway acts as a single entry point for multiple backend services.

Example:

```text
                Frontend
                   |
                   v
               API Gateway
                   |
       +-----------+-----------+
       |           |           |
       v           v           v
   User Service Product Service Order Service
       |           |           |
       v           v           v
     User DB    Product DB    Order DB
```

## 44.1 Responsibilities

An API Gateway may handle:

- Request routing.
- Authentication.
- Rate limiting.
- Logging.
- Request transformation.
- Load balancing.
- TLS termination.
- API composition.

## 44.2 Example Routing

```text
/api/users/*     → User Service
/api/products/*  → Product Service
/api/orders/*    → Order Service
/api/payments/*  → Payment Service
```

### Benefits

- Centralized entry point.
- Simplified client communication.
- Common policies.
- Service abstraction.

### Disadvantages

- Additional infrastructure.
- Potential bottleneck.
- Single point of failure if not deployed redundantly.
- More operational complexity.

---

# 45. API Request Lifecycle

Understanding the request lifecycle helps you debug production applications.

Typical Express request flow:

```text
Incoming Request
       |
       v
CORS Middleware
       |
       v
Request Logger
       |
       v
Rate Limiter
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
Application Service
       |
       v
Repository
       |
       v
Database
       |
       v
Response Serializer
       |
       v
HTTP Response
```

Not every request requires every middleware.

For example, public endpoints may not require authentication.

The ordering of middleware matters.

Example:

```typescript
app.use(cors(corsOptions));

app.use(express.json());

app.use(requestLogger);

app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);

app.use("/api/users", authenticate, userRoutes);

app.use(errorHandler);
```

In a production application, place error handling after the routes and middleware that should forward errors to it.

---

# 46. API Performance Optimization

API performance affects user experience, infrastructure cost, and scalability.

Common performance problems include:

- Slow database queries.
- N+1 queries.
- Excessive payload sizes.
- Missing indexes.
- Unnecessary external API calls.
- Synchronous blocking operations.
- Too many network round trips.

## 46.1 Database Query Optimization

Bad:

```typescript
const users = await prisma.user.findMany();
```

If users contain many fields and relationships, this may retrieve unnecessary data.

Better:

```typescript
const users = await prisma.user.findMany({

  select: {
    id: true,
    name: true,
    email: true
  }

});
```

Retrieve only what the API needs.

## 46.2 Pagination

Avoid returning unlimited datasets.

```typescript
const users = await prisma.user.findMany({
  take: 20
});
```

## 46.3 Caching

Use Redis for frequently accessed data.

```text
Request
   |
   v
Redis Cache
   |
   +---- Cache Hit ----> Return Data
   |
   +---- Cache Miss ---> Database
                              |
                              v
                         Store in Cache
                              |
                              v
                         Return Data
```

## 46.4 Compression

Install:

```bash
npm install compression

npm install --save-dev @types/compression
```

Use:

```typescript
import compression from "compression";

app.use(compression());
```

Compression reduces response payload size where it is beneficial.

## 46.5 Connection Pooling

Database connection pooling reuses established connections rather than creating a new connection for every request.

Benefits:

- Reduced connection overhead.
- Better resource utilization.
- More predictable database access.

## 46.6 Avoid Blocking the Event Loop

Bad:

```typescript
import fs from "fs";

const data = fs.readFileSync("large-file.txt");
```

This synchronous operation blocks the event loop.

Prefer:

```typescript
import fs from "fs/promises";

const data = await fs.readFile("large-file.txt");
```

For CPU-intensive tasks, consider worker threads or separate background workers.

---

# 47. Production API Best Practices

For professional API development:

1. Use consistent resource naming.
2. Choose appropriate HTTP methods.
3. Return meaningful status codes.
4. Version APIs when breaking changes are introduced.
5. Validate request bodies, parameters, and query strings.
6. Use response DTOs and explicit serialization.
7. Implement centralized error handling.
8. Use authentication and authorization correctly.
9. Configure CORS for trusted origins.
10. Implement CSRF protections when relevant.
11. Prevent SQL injection.
12. Implement rate limiting.
13. Use HTTPS.
14. Protect secrets and credentials.
15. Use pagination for large datasets.
16. Validate sorting fields against an allowlist.
17. Use idempotency for sensitive operations.
18. Document APIs with OpenAPI.
19. Monitor API latency and error rates.
20. Optimize database queries.
21. Use caching carefully.
22. Avoid unnecessary API payloads.
23. Set request body and upload size limits.
24. Use structured logging.
25. Add health and readiness checks.
26. Test API contracts.
27. Secure WebSocket connections.
28. Control GraphQL query complexity.
29. Use timeouts and retries carefully.
30. Review security and dependencies regularly.

---

# 48. Complete Practical Project – Production-Style Expense Tracker API

Let's combine several concepts into a single project.

We will design an Expense Tracker API with:

- TypeScript.
- Node.js.
- Express.js.
- MySQL.
- Prisma.
- Zod.
- JWT.
- REST API.
- Pagination.
- Filtering.
- Sorting.
- Swagger.
- Rate limiting.
- Centralized error handling.

## 48.1 API Requirements

Users should be able to:

1. Register.
2. Login.
3. Retrieve their profile.
4. Create expenses.
5. Retrieve expenses.
6. Update expenses.
7. Delete expenses.
8. Filter expenses by category.
9. Search expenses.
10. Sort expenses by date and amount.
11. Paginate expenses.
12. Retrieve expense summaries.

## 48.2 API Endpoints

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/v1/auth/register` | Register user |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/logout` | Logout |

### Users

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/users/me` | Get profile |
| PATCH | `/api/v1/users/me` | Update profile |

### Expenses

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/expenses` | Get expenses |
| GET | `/api/v1/expenses/:id` | Get expense |
| POST | `/api/v1/expenses` | Create expense |
| PATCH | `/api/v1/expenses/:id` | Update expense |
| DELETE | `/api/v1/expenses/:id` | Delete expense |

### Reports

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/reports/summary` | Expense summary |
| GET | `/api/v1/reports/monthly` | Monthly expenses |
| GET | `/api/v1/reports/category` | Category-wise expenses |

## 48.3 Expense Model

```typescript
interface Expense {

  id: number;

  userId: number;

  title: string;

  amount: number;

  category: string;

  description?: string;

  expenseDate: Date;

  createdAt: Date;

}
```

## 48.4 Create Expense DTO

```typescript
import { z } from "zod";

export const createExpenseSchema = z.object({

  title: z.string().min(2).max(100),

  amount: z.number().positive(),

  category: z.string().min(2),

  description: z.string().max(500).optional(),

  expenseDate: z.coerce.date()

});

export type CreateExpenseDTO = z.infer<
  typeof createExpenseSchema
>;
```

## 48.5 Expense Controller

```typescript
import {
  Request,
  Response,
  NextFunction
} from "express";

import { ExpenseService } from "../services/expenseService";

export class ExpenseController {

  constructor(
    private expenseService: ExpenseService
  ) {}

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    try {

      const userId = res.locals.user.id;

      const expense = await this.expenseService.create(
        userId,
        req.body
      );

      return res.status(201).json({
        success: true,
        data: expense
      });

    } catch (error) {

      next(error);

    }

  };

}
```

## 48.6 Expense Service

```typescript
export class ExpenseService {

  constructor(
    private repository: ExpenseRepository
  ) {}

  async create(
    userId: number,
    data: CreateExpenseDTO
  ) {

    return this.repository.create({
      ...data,
      userId
    });

  }

}
```

The service receives the authenticated user ID from the application context rather than trusting a client-provided `userId`.

## 48.7 Expense Query Parameters

Example:

```http
GET /api/v1/expenses?page=1&limit=20&category=food&sortBy=amount&order=desc
```

Possible response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Lunch",
      "amount": 250,
      "category": "food"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## 48.8 Security Requirements

- JWT authentication.
- User-specific data access.
- Input validation.
- Rate limiting.
- CORS configuration.
- Centralized error handling.
- Parameterized database access.
- Secure password hashing.
- Refresh token management.
- API documentation.

## 48.9 Documentation

Create an OpenAPI specification describing:

```text
Authentication
Users
Expenses
Reports
```

Expose Swagger UI:

```text
http://localhost:5000/api-docs
```

This completes the conceptual design of a professional REST API.

---

# 49. Interview Questions and Answers

## Basic Questions

**Q1. What is REST?**

REST is an architectural style for designing network-based applications around resources and a uniform interface.

**Q2. What is a REST API?**

A REST API is an API designed around REST architectural principles, commonly using HTTP methods to interact with resources.

**Q3. What is a resource in REST?**

A resource is an identifiable object or entity exposed by an API.

**Q4. What is the difference between GET and POST?**

GET retrieves information. POST submits data or requests creation of a resource.

**Q5. What is the difference between PUT and PATCH?**

PUT generally replaces a resource representation, while PATCH applies a partial modification.

**Q6. What is an HTTP status code?**

It is a numeric code indicating the result or status of an HTTP request.

**Q7. What is the difference between 200 and 201?**

200 indicates success. 201 indicates that a resource was created.

**Q8. What is the difference between 401 and 403?**

401 indicates missing or invalid authentication credentials. 403 indicates insufficient permission.

**Q9. What is API versioning?**

API versioning allows different API contract versions to coexist.

**Q10. What is pagination?**

Pagination divides large datasets into smaller result sets.

## Intermediate Questions

**Q11. What is offset pagination?**

It retrieves records using a limit and offset.

**Q12. What is cursor pagination?**

It retrieves records based on a cursor representing a position in an ordered dataset.

**Q13. What is API filtering?**

Filtering retrieves records that satisfy specified conditions.

**Q14. What is API sorting?**

Sorting controls the order of returned records.

**Q15. What is the difference between filtering and searching?**

Filtering applies structured conditions, while searching generally matches records against a search term.

**Q16. What is request validation?**

It verifies that incoming request data follows the expected schema and constraints.

**Q17. What is response serialization?**

It converts application data into an appropriate response representation.

**Q18. What is centralized error handling?**

It manages application errors through a common error-handling mechanism.

**Q19. What is idempotency?**

Idempotency means repeating an operation produces the same intended server state.

**Q20. What is rate limiting?**

Rate limiting controls how frequently a client can access an API.

**Q21. What is CORS?**

CORS is a browser-enforced mechanism controlling cross-origin resource access.

**Q22. Does CORS protect an API from direct requests?**

No. CORS is not an authentication or authorization mechanism.

**Q23. What is CSRF?**

CSRF is an attack that tricks an authenticated browser into performing an unwanted action.

**Q24. What is XSS?**

XSS is a vulnerability where malicious scripts are executed in another user's browser.

**Q25. What is SQL Injection?**

SQL Injection occurs when untrusted input changes the structure of a SQL query.

## Advanced Questions

**Q26. What is OpenAPI?**

OpenAPI is a standard specification for describing HTTP APIs.

**Q27. What is Swagger?**

Swagger is a collection of tools for working with OpenAPI specifications, including interactive documentation.

**Q28. What is GraphQL?**

GraphQL is a query language and runtime for APIs that allows clients to request specific data fields.

**Q29. What is a GraphQL schema?**

A schema defines the available types, fields, queries, mutations, and relationships.

**Q30. What is a GraphQL resolver?**

A resolver is a function responsible for providing the data for a GraphQL field.

**Q31. What is the difference between Query and Mutation?**

Query retrieves information. Mutation performs operations that modify data.

**Q32. What is the GraphQL N+1 problem?**

It occurs when resolving nested fields generates excessive individual database queries.

**Q33. What is DataLoader?**

DataLoader batches and caches data-loading operations, commonly to reduce GraphQL N+1 queries.

**Q34. What is a WebSocket?**

A WebSocket provides a persistent, bidirectional communication channel between client and server.

**Q35. What is the difference between HTTP and WebSockets?**

HTTP generally follows request-response communication, while WebSockets allow both sides to send messages independently.

**Q36. What is Socket.IO?**

Socket.IO is a real-time communication library that provides event-based messaging, rooms, reconnection, and other features.

**Q37. Is Socket.IO the same as WebSocket?**

No. Socket.IO uses its own protocol and may use WebSocket as a transport.

**Q38. What are Socket.IO rooms?**

Rooms are groups of connected sockets that can receive targeted broadcasts.

**Q39. What are Server-Sent Events?**

SSE is a mechanism for sending continuous server-to-client events over HTTP.

**Q40. What is the difference between SSE and WebSockets?**

SSE is primarily one-way server-to-client communication. WebSockets support bidirectional communication.

**Q41. What is an API Gateway?**

An API Gateway provides a central entry point for routing and managing API requests to backend services.

**Q42. What is the difference between JWT and session authentication?**

JWT authentication commonly uses signed tokens containing claims. Session authentication commonly uses an opaque session identifier referencing server-side session state.

**Q43. Is JWT encrypted?**

Not necessarily. Ordinary signed JWTs are readable by anyone possessing the token. Signing protects integrity, not confidentiality.

**Q44. What is RBAC?**

Role-Based Access Control assigns permissions based on user roles.

**Q45. What is ABAC?**

Attribute-Based Access Control makes authorization decisions using attributes and policies.

**Q46. Why should APIs use HTTPS?**

HTTPS protects data in transit through encryption and server authentication.

**Q47. Why should API responses use DTOs?**

DTOs control response structure and prevent unnecessary exposure of internal or sensitive data.

**Q48. How do you prevent duplicate payment requests?**

Use idempotency keys with atomic processing, unique constraints, and appropriate request-state management.

**Q49. How do you secure a GraphQL API?**

Validate authentication and authorization, limit query complexity, validate input, protect nested fields, and monitor expensive queries.

**Q50. How do you optimize a REST API?**

Use pagination, database indexes, query optimization, caching, compression, connection pooling, and efficient serialization.

---

# 50. Practical Exercises

## Beginner Level

1. Create a REST API for users.
2. Implement GET, POST, PUT, PATCH, and DELETE.
3. Use appropriate HTTP status codes.
4. Create a consistent response format.
5. Implement API versioning.
6. Add pagination to a users endpoint.
7. Implement product filtering.
8. Implement sorting.
9. Implement search.
10. Validate requests using Zod.

## Intermediate Level

11. Implement centralized error handling.
12. Implement JWT authentication.
13. Implement RBAC authorization.
14. Add API rate limiting.
15. Configure CORS.
16. Implement response DTOs.
17. Create an OpenAPI specification.
18. Generate Swagger documentation.
19. Build a GraphQL API.
20. Implement GraphQL queries and mutations.

## Advanced Level

21. Implement cursor-based pagination.
22. Build an idempotent payment endpoint.
23. Implement Redis-based distributed rate limiting.
24. Create a GraphQL API with DataLoader.
25. Build a real-time chat using WebSockets.
26. Build a Socket.IO chat application with rooms.
27. Implement online/offline presence.
28. Build an SSE notification endpoint.
29. Create an API Gateway architecture.
30. Build the complete Expense Tracker API with authentication, authorization, validation, documentation, pagination, filtering, and testing.

---

# 51. Phase 53 Completion Checklist

| Topic | Status |
|---|---|
| REST API Fundamentals | ☐ |
| REST Architectural Constraints | ☐ |
| HTTP Methods | ☐ |
| Safe and Idempotent Methods | ☐ |
| HTTP Status Codes | ☐ |
| RESTful Resource Modeling | ☐ |
| Request and Response Standards | ☐ |
| API Versioning | ☐ |
| Offset Pagination | ☐ |
| Cursor Pagination | ☐ |
| Filtering | ☐ |
| Sorting | ☐ |
| API Search | ☐ |
| Request Validation | ☐ |
| Response Serialization | ☐ |
| Centralized Error Handling | ☐ |
| Idempotency | ☐ |
| Rate Limiting | ☐ |
| API Security | ☐ |
| Authentication | ☐ |
| Authorization | ☐ |
| CORS | ☐ |
| CSRF | ☐ |
| XSS | ☐ |
| SQL Injection Prevention | ☐ |
| JWT | ☐ |
| RBAC and ABAC | ☐ |
| OpenAPI | ☐ |
| Swagger | ☐ |
| GraphQL Fundamentals | ☐ |
| GraphQL Queries | ☐ |
| GraphQL Mutations | ☐ |
| GraphQL Resolvers | ☐ |
| GraphQL Authentication | ☐ |
| GraphQL DataLoader | ☐ |
| WebSockets | ☐ |
| Socket.IO | ☐ |
| Socket.IO Rooms | ☐ |
| Server-Sent Events | ☐ |
| API Gateway | ☐ |
| Request Lifecycle | ☐ |
| API Performance Optimization | ☐ |
| Production API Best Practices | ☐ |

---

# 52. What Comes Next?

You have now covered advanced API engineering, REST, GraphQL, API security, and real-time communication.

The next phase will focus on asynchronous processing and background job architecture.

## Phase 54: Advanced TypeScript – Event-Driven Architecture, Message Queues, RabbitMQ, Kafka, BullMQ, Background Jobs and Distributed Systems

Upcoming topics:

1. Event-Driven Architecture Fundamentals.
2. Synchronous vs Asynchronous Communication.
3. Events and Event Handlers.
4. Event Emitters in Node.js.
5. Pub/Sub Architecture.
6. Message Queues.
7. Message Brokers.
8. RabbitMQ.
9. Exchanges and Queues.
10. Routing Keys.
11. Dead Letter Queues.
12. Message Acknowledgements.
13. Retry Mechanisms.
14. Apache Kafka.
15. Topics and Partitions.
16. Producers and Consumers.
17. Consumer Groups.
18. Offsets.
19. Event Streaming.
20. BullMQ.
21. Redis-Based Job Queues.
22. Background Workers.
23. Scheduled Jobs.
24. Cron Jobs.
25. Delayed Jobs.
26. Repeatable Jobs.
27. Job Priorities.
28. Job Retries.
29. Job Idempotency.
30. Distributed Systems Fundamentals.
31. Eventual Consistency.
32. Saga Pattern.
33. Transactional Outbox Pattern.
34. Distributed Transactions.
35. Production Background Processing.

**When you're ready, say: `OK, Phase 54`.**