# Phase 27: TypeScript Project Architecture – Folder Structure, Design Patterns, and Scalable Application Architecture

**Level:** Advanced to Professional  
**Prerequisites:**
- Phase 8: Type Aliases
- Phase 9: Interfaces
- Phase 14: Generics
- Phase 20: Advanced Function Types
- Phase 21: Classes and OOP
- Phase 23: Modules
- Phase 26: TypeScript Configuration

## Learning Objectives

By the end of this phase, you will understand:

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
25. Full-stack TypeScript architecture.

---

# 1. What Is Software Architecture?

Software architecture refers to the overall structure and organization of an application.

It defines:

- How different parts of an application are organized.
- How components communicate.
- How data flows through the application.
- How responsibilities are divided.
- How dependencies are managed.
- How the application can grow over time.

Consider a simple Node.js application.

Without proper architecture:

```text
project/
│
├── app.ts
├── database.ts
├── routes.ts
└── package.json
```

As the application grows, everything may end up inside a few large files.

For example, `app.ts` might contain:

- Database queries.
- Authentication logic.
- API routes.
- Business logic.
- Validation.
- Error handling.

This creates a maintenance problem.

A better architecture separates responsibilities.

```text
project/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   └── app.ts
│
└── package.json
```

Now each part has a clearer responsibility.

### Why is architecture important?

| Benefit | Explanation |
|---|---|
| Maintainability | Code is easier to understand and modify |
| Scalability | New features can be added systematically |
| Reusability | Common functionality can be reused |
| Testability | Individual components can be tested independently |
| Separation of concerns | Each component has a focused responsibility |
| Collaboration | Multiple developers can work on different modules |
| Debugging | Problems are easier to isolate |
| Flexibility | Infrastructure and implementation details can be replaced more easily |

### Important

Good architecture does not mean creating the maximum number of folders or classes.

It means organizing code according to the complexity and requirements of the application.

---

# 2. Understanding Monolithic Architecture

A monolithic application is an application structured and deployed as one main application unit.

Its components may be organized internally, but they are generally part of the same deployable application.

### Example

Imagine an e-commerce application containing:

- Authentication.
- Users.
- Products.
- Orders.
- Payments.
- Notifications.

In a monolithic application:

```text
ecommerce/
│
├── src/
│   ├── auth/
│   ├── users/
│   ├── products/
│   ├── orders/
│   ├── payments/
│   └── notifications/
│
└── package.json
```

All these modules belong to one application.

### Advantages

1. Easier to start developing.
2. Simpler deployment.
3. Easier local development.
4. Internal function calls are straightforward.
5. Often suitable for small and medium-sized applications.

### Disadvantages

1. The codebase can become difficult to maintain without modular boundaries.
2. Large changes may affect many parts of the application.
3. The application generally scales as a deployment unit.
4. Different modules cannot necessarily be deployed independently.

### Important

Monolithic does not mean poorly structured.

A monolithic application can have excellent internal architecture.

A modular monolith is often a very practical choice for professional applications.

---

# 3. Understanding Microservices Architecture

Microservices architecture divides an application into independently deployable services.

Each service owns a particular business capability.

### Example

An e-commerce platform might contain:

```text
E-commerce Platform
│
├── Auth Service
│
├── User Service
│
├── Product Service
│
├── Order Service
│
├── Payment Service
│
└── Notification Service
```

Each service may have:

- Its own codebase.
- Its own deployment.
- Its own database or data ownership boundary.
- Its own API.
- Its own development and release lifecycle.

Services communicate through mechanisms such as:

- HTTP APIs.
- REST.
- gRPC.
- Message queues.
- Event-driven messaging.

### Advantages

- Independent deployment.
- Independent scaling.
- Separate technology choices.
- Better organizational ownership for large teams.
- Fault isolation when designed correctly.

### Disadvantages

- More infrastructure.
- Network communication complexity.
- Distributed debugging.
- Data consistency challenges.
- Service discovery and observability requirements.
- More complicated deployment and operations.

### Monolith vs Microservices

| Monolithic | Microservices |
|---|---|
| One main deployable application | Multiple independently deployable services |
| Usually simpler infrastructure | More infrastructure complexity |
| Often easier for smaller teams | Can support larger independent teams |
| Internal calls can be direct | Communication often crosses network boundaries |
| Simpler transactional operations | Distributed consistency requires additional design |
| Can scale as an application unit | Services can scale independently |

### Professional recommendation

Do not start with microservices just because an application is expected to grow.

Start with a well-structured modular monolith unless there is a genuine reason to introduce distributed services.

---

# 4. Understanding Modular Architecture

Modular architecture divides an application into independent logical modules.

Each module is responsible for a particular feature or business domain.

### Example

```text
src/
│
├── modules/
│   ├── users/
│   ├── products/
│   ├── orders/
│   └── payments/
│
├── config/
├── shared/
└── app.ts
```

The users module handles user-related functionality.

The products module handles product-related functionality.

The orders module handles order-related functionality.

### Example: Users module

```text
users/
│
├── user.controller.ts
├── user.service.ts
├── user.repository.ts
├── user.routes.ts
├── user.types.ts
└── user.validation.ts
```

### Benefits

- Better feature organization.
- Reduced coupling.
- Easier testing.
- Clear ownership.
- Easier future extraction into separate services if needed.

### Important

A module should ideally expose a clear public interface rather than allowing every other module to access its internal implementation details.

---

# 5. Understanding Layered Architecture

Layered architecture divides an application into layers based on responsibility.

A common backend architecture contains:

1. Presentation layer.
2. Business logic layer.
3. Data access layer.
4. Database or infrastructure layer.

### Architecture diagram

```text
           Client
             |
             v
      Presentation Layer
         Controllers
             |
             v
       Business Layer
          Services
             |
             v
        Data Layer
        Repositories
             |
             v
       Database Layer
          MySQL
```

Let's understand each layer.

## A. Presentation Layer

Responsible for handling incoming requests and producing responses.

Examples:

- Express controllers.
- API route handlers.
- Request validation.
- HTTP status codes.
- Response formatting.

## B. Business Logic Layer

Responsible for application rules and business operations.

Examples:

- User registration.
- Order creation.
- Payment calculation.
- Discount calculation.
- Inventory validation.

## C. Data Access Layer

Responsible for accessing and manipulating data.

Examples:

- Database queries.
- ORM operations.
- Repository implementations.
- Data persistence.

## D. Database Layer

Responsible for storing application data.

Examples:

- MySQL.
- PostgreSQL.
- MongoDB.
- Redis.

### Important

The database is infrastructure, not necessarily a layer containing business logic.

The layered model is a logical separation of responsibilities. It does not require every layer to have a separate server or deployment.

---

# 6. Separation of Concerns (SoC)

Separation of concerns means dividing an application into components where each component handles a specific responsibility.

### Poor example

```typescript
import express from "express";
import mysql from "mysql2/promise";

const app = express();

app.post("/users", async (req, res) => {
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "app"
    });

    const [result] = await connection.execute(
        "INSERT INTO users(name) VALUES(?)",
        [req.body.name]
    );

    res.json(result);
});
```

This route handles:

- HTTP request processing.
- Database connection.
- SQL query execution.
- Data persistence.
- HTTP response.

Too many responsibilities are combined.

### Better approach

Separate the responsibilities:

```text
users/
│
├── user.controller.ts
├── user.service.ts
└── user.repository.ts
```

Each file has one primary responsibility.

### Example responsibilities

| Component | Responsibility |
|---|---|
| Controller | Handles HTTP requests and responses |
| Service | Contains business logic |
| Repository | Handles data access |
| Validator | Validates incoming data |
| Model/Entity | Represents domain data |
| Middleware | Handles cross-cutting request processing |

### Important

Separation of concerns does not mean every function needs its own file.

Separate components when they have distinct responsibilities or meaningful reuse and testing boundaries.

---

# 7. Understanding Controllers

A controller handles incoming requests and coordinates the response.

In an Express application, controllers typically:

1. Read request parameters.
2. Read request body and query values.
3. Call services.
4. Handle the result.
5. Return an HTTP response.

### Example

`user.controller.ts`

```typescript
import type {
    Request,
    Response,
    NextFunction
} from "express";

import { UserService } from "./user.service.js";

const userService = new UserService();

export class UserController {
    async create(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
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
}
```

### Important

The controller should not contain extensive business logic or database queries.

It should coordinate the request flow.

### Controller responsibilities

- HTTP-specific processing.
- Calling application services.
- Selecting response status codes.
- Returning response data.
- Forwarding errors to error middleware.

---

# 8. Understanding Services

A service contains business logic or application operations.

For example:

- Registering a user.
- Calculating an order total.
- Applying discounts.
- Verifying payment eligibility.
- Checking inventory availability.

### Example

`user.service.ts`

```typescript
import { UserRepository } from "./user.repository.js";

interface CreateUserInput {
    name: string;
    email: string;
}

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(input: CreateUserInput) {
        const existingUser =
            await this.userRepository.findByEmail(input.email);

        if (existingUser) {
            throw new Error("Email already registered");
        }

        return this.userRepository.create(input);
    }
}
```

### What does this service do?

1. Receives user information.
2. Checks whether the email already exists.
3. Rejects duplicate registration.
4. Creates the user through the repository.

### Important

The service should focus on business operations rather than HTTP-specific details.

For example, avoid returning Express `Response` objects from a business service.

That would couple the service to Express.

---

# 9. Understanding Repositories

A repository handles data access.

It separates database operations from business logic.

### Example

`user.repository.ts`

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}

interface CreateUserInput {
    name: string;
    email: string;
}

export class UserRepository {
    async findByEmail(email: string): Promise<User | null> {
        // Database query goes here.

        return null;
    }

    async create(input: CreateUserInput): Promise<User> {
        // Insert database record here.

        return {
            id: 1,
            name: input.name,
            email: input.email
        };
    }
}
```

### Why use repositories?

Without a repository:

```typescript
class UserService {
    async getUser(id: number) {
        // Direct SQL query here.
    }
}
```

The service becomes tightly coupled to the database implementation.

With a repository:

```typescript
class UserService {
    async getUser(id: number) {
        return this.userRepository.findById(id);
    }
}
```

The service depends on a data-access abstraction.

### Important

A repository is useful when it creates a meaningful boundary around persistence.

Do not introduce repositories automatically for every tiny application or every ORM operation.

---

# 10. Understanding the DTO Pattern

DTO stands for **Data Transfer Object**.

A DTO defines the shape of data transferred between different parts of an application.

It is commonly used for:

- API request bodies.
- API responses.
- Service inputs.
- Data transfer between application layers.

### Example

Suppose your database user contains:

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
}
```

You should not expose the entire database record in a public API response.

Create a response DTO:

```typescript
interface UserResponseDTO {
    id: number;
    name: string;
    email: string;
}
```

### Mapping

```typescript
function toUserResponseDTO(user: User): UserResponseDTO {
    return {
        id: user.id,
        name: user.name,
        email: user.email
    };
}
```

Now:

```typescript
const response = toUserResponseDTO(user);
```

The password hash is not exposed.

### Request DTO

```typescript
interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}
```

This describes what the client is allowed to send.

### Why are DTOs important?

- Prevent accidental exposure of internal fields.
- Define stable API contracts.
- Separate external data from internal domain models.
- Make validation easier.
- Support API versioning.

### Important

A TypeScript interface is not runtime validation.

A request DTO still needs runtime validation.

For example, a request body can be validated using Zod, Joi, or another validation library.

---

# 11. Understanding Models and Entities

These terms are related but are not always interchangeable.

## A. Model

A model represents data and may be associated with database operations, depending on the ORM or architecture.

Example using Sequelize-style concepts:

```typescript
interface UserAttributes {
    id: number;
    name: string;
    email: string;
}
```

## B. Entity

In Domain-Driven Design (DDD), an entity is an object defined by its identity and lifecycle.

For example, two users may have identical names and email addresses but still represent different entities because they have different IDs.

```typescript
class User {
    constructor(
        public readonly id: number,
        public name: string,
        public email: string
    ) {}
}
```

### Entity vs DTO vs Database Model

| Concept | Purpose |
|---|---|
| Entity | Represents a domain concept with identity |
| Database model | Represents persistence structure |
| DTO | Represents data transferred between boundaries |
| API response type | Defines data exposed by an endpoint |

### Important

A simple application may use the same type for multiple purposes.

As complexity grows, separating these concepts can improve maintainability and security.

---

# 12. Understanding Dependency Injection (DI)

Dependency Injection is a technique in which an object receives its dependencies from outside rather than creating them internally.

### Without dependency injection

```typescript
class UserService {
    private repository = new UserRepository();

    async getUser(id: number) {
        return this.repository.findById(id);
    }
}
```

Problem:

`UserService` directly creates `UserRepository`.

This makes it harder to replace the repository with:

- A mock repository.
- A different database implementation.
- A cached repository.
- An in-memory implementation.

### With dependency injection

```typescript
interface IUserRepository {
    findById(id: number): Promise<User | null>;
}

class UserService {
    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async getUser(id: number) {
        return this.userRepository.findById(id);
    }
}
```

Now the dependency is supplied externally.

### Create an implementation

```typescript
class MySQLUserRepository implements IUserRepository {
    async findById(id: number): Promise<User | null> {
        // MySQL query here.

        return null;
    }
}
```

### Inject the dependency

```typescript
const repository = new MySQLUserRepository();

const userService = new UserService(repository);
```

### Benefits

- Loose coupling.
- Easier testing.
- Easier implementation replacement.
- Better separation of responsibilities.
- Improved maintainability.

---

# 13. Types of Dependency Injection

There are three common forms.

## A. Constructor Injection

Dependencies are passed through the constructor.

```typescript
class UserService {
    constructor(
        private readonly repository: IUserRepository
    ) {}
}
```

This is commonly preferred for required dependencies.

## B. Setter Injection

Dependencies are provided through a setter.

```typescript
class UserService {
    private repository!: IUserRepository;

    setRepository(repository: IUserRepository): void {
        this.repository = repository;
    }
}
```

This is useful when a dependency is optional or needs to be changed after construction, although it requires careful initialization management.

## C. Method Injection

Dependencies are passed directly to a method.

```typescript
class ReportService {
    generateReport(repository: IUserRepository): void {
        // Generate report.
    }
}
```

This is useful when the dependency is only needed for one operation.

### Comparison

| Injection type | Where dependency is provided |
|---|---|
| Constructor injection | Constructor |
| Setter injection | Setter method |
| Method injection | Method parameter |

---

# 14. Understanding Dependency Inversion Principle (DIP)

The Dependency Inversion Principle is one of the SOLID principles.

It states:

1. High-level modules should not depend directly on low-level modules.
2. Both should depend on abstractions.
3. Abstractions should not depend on details.
4. Details should depend on abstractions.

### Without DIP

```text
UserService
    |
    v
MySQLUserRepository
```

The business service directly depends on a specific database implementation.

### With DIP

```text
        UserService
             |
             v
     IUserRepository
             ^
             |
    MySQLUserRepository
```

The service depends on an abstraction.

The database implementation satisfies that abstraction.

### Example

```typescript
interface IUserRepository {
    findById(id: number): Promise<User | null>;
}
```

Business service:

```typescript
class UserService {
    constructor(
        private readonly repository: IUserRepository
    ) {}

    async getUser(id: number) {
        return this.repository.findById(id);
    }
}
```

Database implementation:

```typescript
class MySQLUserRepository implements IUserRepository {
    async findById(id: number): Promise<User | null> {
        // MySQL implementation.
        return null;
    }
}
```

### Important

Dependency Injection and Dependency Inversion are related but different.

| Dependency Injection | Dependency Inversion |
|---|---|
| A technique for supplying dependencies | A design principle about dependency direction |
| Can be implemented through constructors or containers | Encourages dependence on abstractions |
| Helps achieve loose coupling | Guides the overall architecture |

---

# 15. Understanding the Repository Pattern

The Repository Pattern provides an abstraction over data persistence.

It allows business logic to interact with data without knowing the underlying database details.

### Architecture

```text
Controller
    |
    v
Service
    |
    v
Repository Interface
    |
    v
Repository Implementation
    |
    v
Database
```

### Step 1: Define the entity

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}
```

### Step 2: Define the repository interface

```typescript
interface IUserRepository {
    findById(id: number): Promise<User | null>;

    findAll(): Promise<User[]>;

    create(data: Omit<User, "id">): Promise<User>;

    delete(id: number): Promise<boolean>;
}
```

### Step 3: Implement the repository

```typescript
class MySQLUserRepository implements IUserRepository {
    async findById(id: number): Promise<User | null> {
        // SELECT query.
        return null;
    }

    async findAll(): Promise<User[]> {
        // SELECT all query.
        return [];
    }

    async create(data: Omit<User, "id">): Promise<User> {
        // INSERT query.
        return {
            id: 1,
            ...data
        };
    }

    async delete(id: number): Promise<boolean> {
        // DELETE query.
        return true;
    }
}
```

### Step 4: Use it in a service

```typescript
class UserService {
    constructor(
        private readonly repository: IUserRepository
    ) {}

    async getUser(id: number): Promise<User | null> {
        return this.repository.findById(id);
    }
}
```

### Benefits

- Database independence at the service boundary.
- Easier unit testing.
- Centralized persistence logic.
- Easier substitution of data sources.

### Important

An ORM already provides some repository-like abstractions.

A custom repository layer is most useful when it adds meaningful separation rather than merely wrapping every ORM method without adding value.

---

# 16. Understanding the Factory Pattern

The Factory Pattern centralizes object creation.

Instead of creating objects directly in many places, a factory handles the construction process.

### Without a factory

```typescript
const mysqlRepository = new MySQLUserRepository();

const userService = new UserService(mysqlRepository);
```

This construction logic may be repeated in multiple places.

### With a factory

```typescript
class UserServiceFactory {
    static create(): UserService {
        const repository = new MySQLUserRepository();

        return new UserService(repository);
    }
}
```

Usage:

```typescript
const userService = UserServiceFactory.create();
```

### Real-world use cases

- Database repository creation.
- Payment provider creation.
- Notification service creation.
- File storage provider creation.
- Different application configurations.

### Example: Payment factory

```typescript
interface PaymentProvider {
    pay(amount: number): Promise<void>;
}

class StripePayment implements PaymentProvider {
    async pay(amount: number): Promise<void> {
        console.log("Stripe payment:", amount);
    }
}

class RazorpayPayment implements PaymentProvider {
    async pay(amount: number): Promise<void> {
        console.log("Razorpay payment:", amount);
    }
}

class PaymentFactory {
    static create(provider: string): PaymentProvider {
        switch (provider) {
            case "stripe":
                return new StripePayment();

            case "razorpay":
                return new RazorpayPayment();

            default:
                throw new Error("Unsupported payment provider");
        }
    }
}
```

Usage:

```typescript
const payment = PaymentFactory.create("stripe");

await payment.pay(1000);
```

---

# 17. Understanding the Singleton Pattern

The Singleton Pattern ensures that a class has one shared instance within a particular application context.

### Example

```typescript
class DatabaseConnection {
    private static instance: DatabaseConnection;

    private constructor() {
        console.log("Database connection initialized");
    }

    static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }

        return DatabaseConnection.instance;
    }
}
```

Usage:

```typescript
const db1 = DatabaseConnection.getInstance();

const db2 = DatabaseConnection.getInstance();

console.log(db1 === db2);
```

Output:

```text
true
```

### Why use Singleton?

Potential use cases:

- Application configuration.
- A shared logger.
- A database connection manager.
- A shared cache client.

### Important

A Singleton does not automatically mean one instance across:

- Multiple Node.js processes.
- Multiple servers.
- Multiple containers.
- Multiple machines.

It generally controls instance creation within its own JavaScript module/runtime context.

Also, module-level singleton instances are often sufficient without writing a Singleton class.

---

# 18. Understanding the Adapter Pattern

The Adapter Pattern allows incompatible interfaces to work together.

Suppose your application supports multiple payment providers.

Each provider may expose a different API.

### Without an adapter

```typescript
class StripePayment {
    async makePayment(amount: number): Promise<void> {
        console.log("Stripe:", amount);
    }
}

class RazorpayPayment {
    async createOrder(value: number): Promise<void> {
        console.log("Razorpay:", value);
    }
}
```

The method names differ.

This makes it difficult for the application to use both providers consistently.

### Define a common interface

```typescript
interface PaymentGateway {
    pay(amount: number): Promise<void>;
}
```

### Create an adapter

```typescript
class StripeAdapter implements PaymentGateway {
    constructor(
        private readonly stripe: StripePayment
    ) {}

    async pay(amount: number): Promise<void> {
        await this.stripe.makePayment(amount);
    }
}
```

```typescript
class RazorpayAdapter implements PaymentGateway {
    constructor(
        private readonly razorpay: RazorpayPayment
    ) {}

    async pay(amount: number): Promise<void> {
        await this.razorpay.createOrder(amount);
    }
}
```

### Usage

```typescript
const stripe = new StripePayment();

const gateway = new StripeAdapter(stripe);

await gateway.pay(1000);
```

### Benefits

- Integrates third-party libraries.
- Hides incompatible interfaces.
- Reduces coupling.
- Makes provider replacement easier.

---

# 19. Understanding the Strategy Pattern

The Strategy Pattern allows you to select different algorithms or behaviors through a common interface.

### Example

Suppose an application supports multiple discount strategies:

- No discount.
- Percentage discount.
- Fixed discount.

### Define an interface

```typescript
interface DiscountStrategy {
    calculate(price: number): number;
}
```

### Strategy 1: Percentage discount

```typescript
class PercentageDiscount implements DiscountStrategy {
    constructor(
        private readonly percentage: number
    ) {}

    calculate(price: number): number {
        return price - (price * this.percentage / 100);
    }
}
```

### Strategy 2: Fixed discount

```typescript
class FixedDiscount implements DiscountStrategy {
    constructor(
        private readonly discount: number
    ) {}

    calculate(price: number): number {
        return Math.max(0, price - this.discount);
    }
}
```

### Strategy 3: No discount

```typescript
class NoDiscount implements DiscountStrategy {
    calculate(price: number): number {
        return price;
    }
}
```

### Context class

```typescript
class PriceCalculator {
    constructor(
        private strategy: DiscountStrategy
    ) {}

    setStrategy(strategy: DiscountStrategy): void {
        this.strategy = strategy;
    }

    calculate(price: number): number {
        return this.strategy.calculate(price);
    }
}
```

### Usage

```typescript
const calculator = new PriceCalculator(
    new PercentageDiscount(10)
);

console.log(calculator.calculate(1000));
```

Output:

```text
900
```

Change strategy:

```typescript
calculator.setStrategy(new FixedDiscount(100));

console.log(calculator.calculate(1000));
```

Output:

```text
900
```

### Why use Strategy?

- Avoids large conditional statements.
- Makes algorithms interchangeable.
- Supports extension.
- Makes individual strategies easier to test.

---

# 20. Understanding Middleware Architecture

Middleware is a function that executes during the request-response lifecycle.

In Express, middleware can:

- Read requests.
- Modify requests.
- Validate authentication.
- Log requests.
- Handle errors.
- Pass control to the next middleware.

### Middleware flow

```text
Incoming Request
       |
       v
  Logging Middleware
       |
       v
 Authentication Middleware
       |
       v
 Authorization Middleware
       |
       v
 Validation Middleware
       |
       v
     Controller
       |
       v
    Response
```

### Example: Logging middleware

```typescript
import type {
    Request,
    Response,
    NextFunction
} from "express";

export function logger(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    console.log(req.method, req.url);

    next();
}
```

### Example: Authentication middleware

```typescript
import type {
    Request,
    Response,
    NextFunction
} from "express";

export function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const token = req.headers.authorization;

    if (!token) {
        res.status(401).json({
            message: "Unauthorized"
        });

        return;
    }

    next();
}
```

This is only a simplified example. Production authentication must verify the token's signature, expiration, issuer, audience, and other relevant claims.

### Register middleware

```typescript
import express from "express";

import { logger } from "./middlewares/logger.js";
import { authenticate } from "./middlewares/authenticate.js";

const app = express();

app.use(express.json());

app.use(logger);

app.get("/profile", authenticate, (req, res) => {
    res.json({
        message: "Profile data"
    });
});
```

### Important

Middleware order matters.

A middleware executes according to its registration and route order.

---

# 21. Understanding Centralized Error Handling

In a professional backend application, error handling should be consistent.

Instead of writing different error responses in every controller, use centralized error handling.

### Step 1: Create a custom application error

`app-error.ts`

```typescript
export class AppError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number
    ) {
        super(message);

        this.name = "AppError";
    }
}
```

### Step 2: Throw errors from services

```typescript
import { AppError } from "../errors/app-error.js";

export class UserService {
    async getUser(id: number) {
        const user = null;

        if (!user) {
            throw new AppError("User not found", 404);
        }

        return user;
    }
}
```

### Step 3: Forward errors from controllers

```typescript
import type {
    Request,
    Response,
    NextFunction
} from "express";

export async function getUser(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = Number(req.params.id);

        const user = await userService.getUser(id);

        res.json(user);
    } catch (error) {
        next(error);
    }
}
```

### Step 4: Create error middleware

```typescript
import type {
    Request,
    Response,
    NextFunction
} from "express";

import { AppError } from "../errors/app-error.js";

export function errorHandler(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
): void {
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
        message: "Internal server error"
    });
}
```

### Register error middleware last

```typescript
app.use(errorHandler);
```

### Important

Express 5 automatically forwards rejected promises from async route handlers to error middleware.

In Express 4, you generally need explicit `try/catch`, a wrapper, or another async error-forwarding approach.

The examples above use explicit forwarding to make the flow clear.

---

# 22. Understanding Configuration Management

Configuration management means organizing application settings in a centralized and consistent way.

Examples:

- Database connection details.
- Port numbers.
- API keys.
- JWT secrets.
- SMTP credentials.
- Cloud storage configuration.

### Poor approach

```typescript
const PORT = 3000;

const DB_HOST = "localhost";

const DB_USER = "root";

const DB_PASSWORD = "password";
```

Hardcoding configuration creates security and deployment problems.

### Better approach

Use environment variables.

`.env`:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=secret
DB_NAME=my_database
```

Load them using a suitable environment configuration library.

For example:

```bash
npm install dotenv
```

### config.ts

```typescript
import "dotenv/config";

export const config = {
    port: Number(process.env.PORT ?? 3000),

    database: {
        host: process.env.DB_HOST ?? "localhost",
        user: process.env.DB_USER ?? "",
        password: process.env.DB_PASSWORD ?? "",
        name: process.env.DB_NAME ?? ""
    }
};
```

Usage:

```typescript
import { config } from "./config/config.js";

console.log(config.port);
```

### Important

`process.env` values are strings or undefined.

This means:

```typescript
process.env.PORT
```

does not automatically have the type `number`.

Convert and validate environment variables explicitly.

---

# 23. Environment Variable Validation with Zod

TypeScript types alone cannot guarantee that environment variables exist at runtime.

Use runtime validation.

Install Zod:

```bash
npm install zod
```

### config.ts

```typescript
import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(3000),

    DB_HOST: z.string().min(1),

    DB_USER: z.string().min(1),

    DB_PASSWORD: z.string(),

    DB_NAME: z.string().min(1)
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error(
        "Invalid environment configuration:",
        parsedEnv.error.flatten()
    );

    throw new Error("Invalid environment variables");
}

export const env = parsedEnv.data;
```

Now:

```typescript
import { env } from "./config.js";

console.log(env.PORT);
```

TypeScript knows the validated configuration shape.

### Benefits

- Detects missing variables.
- Validates data types.
- Provides centralized configuration.
- Prevents invalid configuration from silently entering the application.

### Important

Never commit real secrets to Git.

Add `.env` to `.gitignore` and provide a safe `.env.example` file.

---

# 24. Understanding Shared Types and Utilities

As applications grow, common types and utility functions are often reused across modules.

A shared directory can organize these resources.

### Example structure

```text
src/
│
├── modules/
│
├── shared/
│   ├── types/
│   │   ├── api-response.ts
│   │   └── pagination.ts
│   │
│   ├── utils/
│   │   ├── date.ts
│   │   └── string.ts
│   │
│   ├── constants/
│   │   └── roles.ts
│   │
│   └── errors/
│       └── app-error.ts
│
└── app.ts
```

### Example: Shared API response type

```typescript
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
```

Usage:

```typescript
interface User {
    id: number;
    name: string;
}

const response: ApiResponse<User> = {
    success: true,
    message: "User fetched successfully",
    data: {
        id: 1,
        name: "Riyaz"
    }
};
```

### Example: Shared pagination type

```typescript
export interface Pagination {
    page: number;
    limit: number;
    total: number;
}
```

### Important

Do not put every reusable function into one enormous `utils` folder.

Organize shared functionality by meaningful domain or responsibility.

---

# 25. Understanding Barrel Files

A barrel file re-exports functionality from multiple modules through a central entry point.

It is commonly named:

```text
index.ts
```

### Example structure

```text
users/
│
├── user.controller.ts
├── user.service.ts
├── user.repository.ts
└── index.ts
```

### index.ts

```typescript
export { UserController } from "./user.controller.js";

export { UserService } from "./user.service.js";

export { UserRepository } from "./user.repository.js";
```

Now other modules can import from one location:

```typescript
import {
    UserController,
    UserService,
    UserRepository
} from "./users/index.js";
```

### Benefits

- Cleaner imports.
- Centralized exports.
- Easier public API management.
- Hides internal file organization.

### Disadvantages

- Can create circular dependencies.
- May make dependency relationships less obvious.
- Can accidentally expose internal implementation details.
- Large barrel files can make module boundaries harder to understand.

### Professional recommendation

Use barrel files at deliberate module boundaries rather than creating an `index.ts` in every folder automatically.

---

# 26. Understanding Circular Dependencies

A circular dependency occurs when two or more modules depend on each other directly or indirectly.

### Example

`user.service.ts`

```typescript
import { OrderService } from "../orders/order.service.js";

export class UserService {
    constructor(
        private orderService: OrderService
    ) {}
}
```

`order.service.ts`

```typescript
import { UserService } from "../users/user.service.js";

export class OrderService {
    constructor(
        private userService: UserService
    ) {}
}
```

Dependency graph:

```text
UserService
     |
     v
OrderService
     |
     v
UserService
```

This creates a circular dependency.

### Why can this be problematic?

- Module initialization can become difficult to reason about.
- Runtime values may be partially initialized.
- Testing becomes more complicated.
- Refactoring becomes harder.
- Architectural boundaries become unclear.

### Better approach: Extract a shared abstraction

For example:

```text
src/
│
├── users/
│   └── user.service.ts
│
├── orders/
│   └── order.service.ts
│
└── shared/
    └── interfaces/
        └── user-reader.ts
```

`user-reader.ts`:

```typescript
export interface IUserReader {
    findUserById(id: number): Promise<User | null>;
}
```

The modules can depend on abstractions rather than importing each other's concrete implementations.

### Other solutions

- Move shared logic into a third module.
- Use dependency injection.
- Introduce events.
- Redesign responsibilities.
- Separate application orchestration from domain services.

### Important

Not every circular dependency causes an immediate runtime failure, but it is often a sign that module boundaries need review.

---

# 27. Understanding Feature-Based Architecture

Feature-based architecture organizes code by business functionality rather than only by technical layer.

### Traditional layer-based structure

```text
src/
│
├── controllers/
│   ├── user.controller.ts
│   └── product.controller.ts
│
├── services/
│   ├── user.service.ts
│   └── product.service.ts
│
├── repositories/
│   ├── user.repository.ts
│   └── product.repository.ts
│
└── routes/
    ├── user.routes.ts
    └── product.routes.ts
```

### Feature-based structure

```text
src/
│
├── modules/
│   │
│   ├── users/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.repository.ts
│   │   ├── user.routes.ts
│   │   ├── user.dto.ts
│   │   └── user.types.ts
│   │
│   ├── products/
│   │   ├── product.controller.ts
│   │   ├── product.service.ts
│   │   ├── product.repository.ts
│   │   ├── product.routes.ts
│   │   └── product.dto.ts
│   │
│   └── orders/
│       ├── order.controller.ts
│       ├── order.service.ts
│       ├── order.repository.ts
│       ├── order.routes.ts
│       └── order.dto.ts
│
├── config/
├── middlewares/
├── shared/
└── app.ts
```

### Comparison

| Layer-based | Feature-based |
|---|---|
| Organizes by technical responsibility | Organizes by business feature |
| All controllers are together | Each feature owns its controllers |
| All services are together | Each feature owns its services |
| Can become difficult to navigate in large applications | Keeps related feature files together |
| Useful for smaller or simpler projects | Often useful for growing applications |

### Which should you choose?

For a growing Node.js application, feature-based organization combined with internal layers is a strong approach.

---

# 28. Understanding Domain-Driven Design (DDD)

Domain-Driven Design is an approach to software development that emphasizes modeling the application around its business domain.

It is particularly useful for complex business applications.

### Important concepts

| Concept | Meaning |
|---|---|
| Domain | The business problem area |
| Entity | Object with a distinct identity |
| Value Object | Object defined by its values rather than identity |
| Aggregate | Cluster of domain objects treated as a consistency boundary |
| Aggregate Root | Main entity through which an aggregate is accessed |
| Repository | Abstraction for retrieving and persisting domain objects |
| Domain Service | Domain operation that does not naturally belong to one entity |
| Bounded Context | Boundary within which a particular domain model applies |
| Domain Event | Represents something meaningful that happened in the domain |

### Example: E-commerce domain

```text
E-commerce Domain
│
├── User
│
├── Product
│
├── Order
│   ├── OrderItem
│   └── Payment
│
└── Inventory
```

### Entity example

```typescript
class Product {
    constructor(
        public readonly id: number,
        public name: string,
        private price: number
    ) {}

    getPrice(): number {
        return this.price;
    }

    changePrice(newPrice: number): void {
        if (newPrice < 0) {
            throw new Error("Price cannot be negative");
        }

        this.price = newPrice;
    }
}
```

The entity protects its own business rules.

### Value Object example

```typescript
class Money {
    constructor(
        public readonly amount: number,
        public readonly currency: string
    ) {
        if (amount < 0) {
            throw new Error("Amount cannot be negative");
        }
    }
}
```

A `Money` value is generally compared by its amount and currency rather than by a separate identity.

### Important

DDD is not required for every application.

Use it when the business domain is complex enough to benefit from explicit domain modeling.

---

# 29. Understanding SOLID Principles

SOLID is a collection of five object-oriented design principles.

They help create maintainable and extensible applications.

## S – Single Responsibility Principle

A class or module should have one primary responsibility or reason to change.

Poor example:

```typescript
class UserService {
    createUser(): void {}
    sendEmail(): void {}
    generatePDF(): void {}
    connectDatabase(): void {}
}
```

Better:

```typescript
class UserService {
    createUser(): void {}
}

class EmailService {
    sendEmail(): void {}
}

class PDFService {
    generatePDF(): void {}
}

class DatabaseService {
    connect(): void {}
}
```

## O – Open/Closed Principle

Software entities should be open for extension but closed for modification.

Example:

```typescript
interface PaymentMethod {
    pay(amount: number): void;
}

class CardPayment implements PaymentMethod {
    pay(amount: number): void {
        console.log("Card payment:", amount);
    }
}

class UpiPayment implements PaymentMethod {
    pay(amount: number): void {
        console.log("UPI payment:", amount);
    }
}
```

New payment methods can be added without rewriting the existing payment interface.

## L – Liskov Substitution Principle

Objects of a subtype should be usable wherever objects of their base type are expected without breaking expected behavior.

Example:

```typescript
interface Bird {
    eat(): void;
}

interface FlyingBird extends Bird {
    fly(): void;
}

class Sparrow implements FlyingBird {
    eat(): void {
        console.log("Eating");
    }

    fly(): void {
        console.log("Flying");
    }
}

class Penguin implements Bird {
    eat(): void {
        console.log("Eating");
    }
}
```

A penguin is a bird, but it should not be forced to implement an operation that assumes it can fly.

## I – Interface Segregation Principle

Clients should not be forced to depend on methods they do not use.

Poor example:

```typescript
interface Worker {
    work(): void;
    eat(): void;
}
```

Better:

```typescript
interface Workable {
    work(): void;
}

interface Eatable {
    eat(): void;
}
```

Classes can implement only the capabilities they require.

## D – Dependency Inversion Principle

High-level business logic should depend on abstractions rather than concrete infrastructure implementations.

Example:

```typescript
interface NotificationService {
    send(message: string): void;
}
```

```typescript
class EmailNotification implements NotificationService {
    send(message: string): void {
        console.log("Email:", message);
    }
}
```

```typescript
class SMSNotification implements NotificationService {
    send(message: string): void {
        console.log("SMS:", message);
    }
}
```

The business service can depend on the interface rather than a specific notification provider.

### SOLID summary

| Principle | Main idea |
|---|---|
| S – Single Responsibility | One primary responsibility |
| O – Open/Closed | Extend without repeatedly modifying existing code |
| L – Liskov Substitution | Subtypes should preserve expected behavior |
| I – Interface Segregation | Prefer focused interfaces |
| D – Dependency Inversion | Depend on abstractions |

---

# 30. Understanding Clean Architecture

Clean Architecture organizes an application so that business rules are independent of external infrastructure.

A simplified architecture contains:

1. Entities.
2. Use cases.
3. Interface adapters.
4. Frameworks and drivers.

### Architecture

```text
┌───────────────────────────────────────┐
│       Frameworks and Drivers          │
│                                       │
│   Express / MySQL / Redis / APIs       │
│                                       │
│   ┌───────────────────────────────┐   │
│   │       Interface Adapters      │   │
│   │                               │   │
│   │   Controllers / Repositories  │   │
│   │                               │   │
│   │   ┌───────────────────────┐   │   │
│   │   │      Use Cases        │   │   │
│   │   │                       │   │   │
│   │   │ Application Services  │   │   │
│   │   │                       │   │   │
│   │   │   ┌───────────────┐   │   │   │
│   │   │   │   Entities    │   │   │   │
│   │   │   │               │   │   │   │
│   │   │   │ Business Rules│   │   │   │
│   │   │   └───────────────┘   │   │   │
│   │   └───────────────────────┘   │   │
│   └───────────────────────────────┘   │
└───────────────────────────────────────┘
```

### Dependency Rule

Dependencies should point inward toward business rules.

For example:

- A use case should not depend directly on Express.
- A domain entity should not depend on MySQL.
- A business rule should not depend on a specific payment SDK.

### Example

A use case might depend on an interface:

```typescript
interface UserRepository {
    save(user: User): Promise<void>;
}
```

The actual MySQL implementation is supplied from the outer infrastructure layer.

### Benefits

- Business logic is independent of frameworks.
- Easier unit testing.
- Infrastructure can be replaced.
- Better separation of concerns.
- Suitable for complex applications.

### Important

Clean Architecture is an architectural approach, not a mandatory folder structure.

Do not introduce unnecessary abstraction into small applications.

---

# 31. Scalable Node.js TypeScript Project Structure

Let's combine the concepts into a practical backend architecture.

### Recommended structure

```text
backend/
│
├── src/
│   │
│   ├── config/
│   │   ├── database.ts
│   │   ├── env.ts
│   │   └── app.config.ts
│   │
│   ├── modules/
│   │   │
│   │   ├── users/
│   │   │   ├── controllers/
│   │   │   │   └── user.controller.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── user.service.ts
│   │   │   │
│   │   │   ├── repositories/
│   │   │   │   ├── user.repository.ts
│   │   │   │   └── mysql-user.repository.ts
│   │   │   │
│   │   │   ├── dto/
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   └── user-response.dto.ts
│   │   │   │
│   │   │   ├── validators/
│   │   │   │   └── user.validator.ts
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   └── user.routes.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── products/
│   │   │
│   │   ├── orders/
│   │   │
│   │   └── payments/
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── logger.middleware.ts
│   │
│   ├── shared/
│   │   ├── types/
│   │   ├── errors/
│   │   ├── utils/
│   │   └── constants/
│   │
│   ├── app.ts
│   └── server.ts
│
├── tests/
│
├── dist/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

### Architecture flow

```text
HTTP Request
     |
     v
   Routes
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
 Repository Interface
     |
     v
 Repository Implementation
     |
     v
 Database
```

### Responsibility summary

| Component | Responsibility |
|---|---|
| Routes | Define API endpoints |
| Middleware | Handle request-level cross-cutting logic |
| Controllers | Handle HTTP requests and responses |
| Services | Implement application and business operations |
| Repositories | Handle persistence |
| DTOs | Define data transfer contracts |
| Validators | Validate runtime input |
| Config | Centralize configuration |
| Shared | Reusable cross-module components |

---

# 32. Scalable React TypeScript Project Structure

Frontend architecture also matters.

For a growing React application, feature-based organization is often effective.

### Example structure

```text
frontend/
│
├── src/
│   │
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── providers.tsx
│   │
│   ├── features/
│   │   │
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   └── LoginForm.tsx
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   └── useLogin.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts
│   │   │   │
│   │   │   ├── types/
│   │   │   │   └── auth.types.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── users/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   │
│   │   └── products/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── ui/
│   │
│   ├── hooks/
│   │
│   ├── services/
│   │   └── api-client.ts
│   │
│   ├── types/
│   │
│   ├── utils/
│   │
│   ├── constants/
│   │
│   └── styles/
│
├── public/
├── package.json
└── tsconfig.json
```

### Understanding the folders

| Folder | Purpose |
|---|---|
| `app` | Application setup and routing |
| `features` | Feature-specific code |
| `components` | Reusable UI components |
| `hooks` | Reusable React hooks |
| `services` | API communication and shared services |
| `types` | Shared TypeScript types |
| `utils` | Pure utility functions |
| `constants` | Application constants |
| `styles` | Global styling |

### Example feature component

`features/users/components/UserCard.tsx`

```tsx
interface User {
    id: number;
    name: string;
    email: string;
}

interface UserCardProps {
    user: User;
}

export function UserCard({ user }: UserCardProps) {
    return (
        <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
        </div>
    );
}
```

### Example API service

`features/users/services/user.service.ts`

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}

export async function getUsers(): Promise<User[]> {
    const response = await fetch("/api/users");

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    return response.json() as Promise<User[]>;
}
```

**Important:** The type assertion above does not validate the API response at runtime. For untrusted API data, validate the response using a runtime schema.

### Why feature-based frontend architecture?

It keeps related code together.

For example, user-related components, hooks, services, and types remain inside the users feature.

This makes the application easier to maintain as it grows.

---

# 33. Understanding API Client Architecture

In a frontend application, multiple features may communicate with the same backend.

Instead of repeating `fetch()` configuration everywhere, create a shared API client.

### api-client.ts

```typescript
const API_BASE_URL = "http://localhost:3000/api";

export async function apiRequest<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options?.headers
            }
        }
    );

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return response.json() as Promise<T>;
}
```

### Usage

```typescript
interface User {
    id: number;
    name: string;
}

const users = await apiRequest<User[]>("/users");
```

### Benefits

- Centralized API configuration.
- Consistent headers.
- Shared error handling.
- Easier authentication integration.
- Less duplicated code.

### Important

The generic parameter `T` describes the expected response type.

It does not prove that the server actually returned that shape.

Add runtime validation when data correctness is important.

---

# 34. Understanding Dependency Injection Containers

In larger applications, manually creating and passing every dependency can become repetitive.

A Dependency Injection Container can manage object creation and dependency resolution.

### Conceptual example

```typescript
interface ILogger {
    log(message: string): void;
}

class ConsoleLogger implements ILogger {
    log(message: string): void {
        console.log(message);
    }
}

class UserService {
    constructor(
        private readonly logger: ILogger
    ) {}

    createUser(): void {
        this.logger.log("User created");
    }
}
```

Manual composition:

```typescript
const logger = new ConsoleLogger();

const userService = new UserService(logger);
```

This is already dependency injection.

A DI container automates parts of this process.

### Common tools

- InversifyJS.
- TSyringe.
- NestJS dependency injection system.

### Important

A DI container is not mandatory.

For many applications, manual constructor injection and a central composition root are sufficient.

---

# 35. Understanding Composition Root

A composition root is the place where application dependencies are created and connected.

Instead of allowing every class to create its own dependencies, create them in a controlled location.

### Example

`container.ts`

```typescript
const userRepository = new MySQLUserRepository();

const userService = new UserService(userRepository);

const userController = new UserController(userService);

export {
    userRepository,
    userService,
    userController
};
```

Routes can use the constructed controller:

```typescript
import { userController } from "../container.js";

router.post(
    "/users",
    userController.create.bind(userController)
);
```

### Benefits

- Centralized dependency construction.
- Easier testing.
- Clear application startup.
- Better control over implementations.

### Important

The composition root should be near the application's entry point, not scattered throughout business logic.

---

# 36. Understanding Testing Boundaries in Architecture

Good architecture makes testing easier.

Different components should be tested at different levels.

### Unit testing

Tests one component in isolation.

Example: test a service using a fake repository.

```typescript
class FakeUserRepository implements IUserRepository {
    async findById(id: number): Promise<User | null> {
        return {
            id,
            name: "Riyaz",
            email: "riyaz@example.com"
        };
    }
}
```

```typescript
const repository = new FakeUserRepository();

const service = new UserService(repository);
```

Now the service can be tested without a real database.

### Integration testing

Tests whether multiple components work together.

Examples:

- Repository with a real test database.
- Controller with service and repository.
- API endpoint with middleware.

### End-to-end testing

Tests the complete application flow.

Example:

```text
Browser
   |
   v
Frontend
   |
   v
Backend API
   |
   v
Database
```

### Comparison

| Test type | Focus |
|---|---|
| Unit test | Individual component |
| Integration test | Interaction between components |
| End-to-end test | Complete user workflow |

---

# 37. Common Architectural Mistakes

### Mistake 1: Putting everything in controllers

Controllers should not contain extensive business logic or database operations.

Move business rules into services and persistence logic into repositories when appropriate.

### Mistake 2: Creating unnecessarily large services

A service with hundreds of unrelated methods may need to be divided into focused services or use cases.

### Mistake 3: Making every function a class

TypeScript supports functions, modules, interfaces, and classes.

Use classes when object identity, encapsulated state, or object-oriented behavior is useful.

### Mistake 4: Creating too many abstractions

Do not create an interface, factory, repository, and adapter for every simple function.

Abstractions should solve a real design problem.

### Mistake 5: Tight coupling to infrastructure

Business logic should not depend unnecessarily on Express, MySQL, or a specific cloud provider.

### Mistake 6: Exposing database entities directly

Avoid returning sensitive database fields in API responses.

Use response DTOs or explicit mapping.

### Mistake 7: Treating TypeScript interfaces as runtime validation

Interfaces disappear during compilation.

Use runtime validation for external input.

### Mistake 8: Creating circular dependencies

Review module boundaries and dependency directions.

### Mistake 9: Overusing shared folders

Do not move feature-specific functionality into a global shared folder without a genuine reuse requirement.

### Mistake 10: Adopting microservices too early

A modular monolith is often simpler and more efficient for small and medium-sized teams.

### Mistake 11: Using Singleton everywhere

Global shared state can make testing and application behavior harder to manage.

### Mistake 12: Mixing HTTP logic with business logic

Services should not need to know about Express request or response objects.

---

# 38. Interview Questions and Answers

### Q1. What is software architecture?

Software architecture defines the overall organization of an application, its components, their responsibilities, and how they interact.

### Q2. What is monolithic architecture?

It is an architecture in which the application is built and deployed as one main application unit.

### Q3. What is microservices architecture?

It divides an application into independently deployable services organized around business capabilities.

### Q4. What is modular architecture?

It organizes an application into logical modules with clear responsibilities and boundaries.

### Q5. What is layered architecture?

It separates an application into layers such as presentation, business logic, data access, and infrastructure.

### Q6. What is separation of concerns?

It is the practice of separating different responsibilities into distinct components.

### Q7. What is a controller?

A controller handles incoming requests, coordinates application operations, and returns responses.

### Q8. What is a service?

A service contains application operations and business logic.

### Q9. What is a repository?

A repository abstracts data access and persistence operations.

### Q10. What is a DTO?

A Data Transfer Object defines the structure of data transferred between application boundaries.

### Q11. What is the difference between an entity and a DTO?

An entity represents a domain concept with identity, while a DTO represents data transferred between components or systems.

### Q12. What is Dependency Injection?

Dependency Injection is a technique in which dependencies are provided to an object from outside rather than being created internally.

### Q13. What is Dependency Inversion?

It is a SOLID principle that encourages high-level and low-level modules to depend on abstractions rather than concrete implementations.

### Q14. What is the difference between DI and DIP?

DI is a technique for supplying dependencies. DIP is a design principle governing dependency direction.

### Q15. What is the Repository Pattern?

It provides an abstraction over data persistence so business logic does not need to know the underlying database implementation.

### Q16. What is the Factory Pattern?

It centralizes object creation and hides construction details.

### Q17. What is the Singleton Pattern?

It ensures a single shared instance within a particular application context.

### Q18. What is the Adapter Pattern?

It allows incompatible interfaces to work together through a common interface.

### Q19. What is the Strategy Pattern?

It allows different algorithms or behaviors to be selected through a common interface.

### Q20. What is middleware?

Middleware is a function that executes during the request-response lifecycle and can process requests, responses, or errors.

### Q21. What is centralized error handling?

It is an approach in which application errors are forwarded to a common error-handling component.

### Q22. What is Clean Architecture?

It is an architectural approach that keeps business rules independent of frameworks, databases, and external infrastructure.

### Q23. What is feature-based architecture?

It organizes code around business features instead of organizing the entire application only by technical layers.

### Q24. What is Domain-Driven Design?

DDD is an approach that models software around business concepts, rules, and domain boundaries.

### Q25. What are SOLID principles?

They are five object-oriented design principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.

### Q26. What is a circular dependency?

It occurs when modules depend on each other directly or indirectly.

### Q27. What is a composition root?

It is the application location where dependencies are constructed and connected.

### Q28. What is the difference between unit and integration testing?

Unit testing checks individual components in isolation, while integration testing checks interactions between components.

### Q29. Why should controllers avoid business logic?

Keeping business logic outside controllers improves testability, reusability, and separation of concerns.

### Q30. Should every application use microservices?

No. A modular monolith is often a better starting point. Microservices are useful when independent deployment, scaling, ownership, or organizational requirements justify their complexity.

---

# 39. Practical Projects and Exercises

Complete these exercises to understand how professional architecture works.

## Exercise 1: Basic Layered Architecture

Create a simple User API with:

- Controller.
- Service.
- Repository.
- Database connection.

Implement CRUD operations.

## Exercise 2: Feature-Based Architecture

Create these modules:

- Users.
- Products.
- Orders.

Give each module its own controller, service, repository, and routes.

## Exercise 3: DTO Implementation

Create:

- `CreateUserDTO`.
- `UpdateUserDTO`.
- `UserResponseDTO`.

Ensure sensitive fields are never exposed in API responses.

## Exercise 4: Dependency Injection

Create an `IUserRepository` interface.

Implement:

- `MySQLUserRepository`.
- `InMemoryUserRepository`.

Inject both implementations into the same service in different test scenarios.

## Exercise 5: Repository Pattern

Implement repository methods:

```typescript
findById()
findAll()
create()
update()
delete()
```

Connect them to a database.

## Exercise 6: Factory Pattern

Create a notification factory supporting:

- Email.
- SMS.
- Push notifications.

## Exercise 7: Singleton Pattern

Create a configuration manager that exposes one shared instance.

Compare it with a simple exported module-level object.

## Exercise 8: Adapter Pattern

Create adapters for two payment providers with different method names.

Expose a common `PaymentGateway` interface.

## Exercise 9: Strategy Pattern

Implement:

- Percentage discount.
- Fixed discount.
- No discount.

Allow strategies to be changed at runtime.

## Exercise 10: Middleware Architecture

Create:

- Logger middleware.
- Authentication middleware.
- Authorization middleware.
- Validation middleware.
- Error middleware.

Register them in the correct order.

## Exercise 11: Centralized Error Handling

Create custom error classes:

- `ValidationError`.
- `NotFoundError`.
- `UnauthorizedError`.
- `AppError`.

Implement centralized error handling.

## Exercise 12: Environment Configuration

Use environment variables for:

- Database credentials.
- Server port.
- JWT secret.

Validate them with Zod.

## Exercise 13: Circular Dependency Resolution

Create two modules with circular imports.

Then redesign them using a shared abstraction or event-based communication.

## Exercise 14: SOLID Principles

Create examples demonstrating all five SOLID principles.

## Exercise 15: Clean Architecture

Build a small User Management API with:

- Domain entity.
- Repository interface.
- Create-user use case.
- Controller.
- Database repository implementation.

Ensure the use case does not depend directly on Express or MySQL.

## Exercise 16: Scalable React Architecture

Create a React application containing:

- Authentication.
- Users.
- Products.
- Orders.

Use feature-based folder organization.

## Exercise 17: Full-Stack Architecture

Build a small full-stack application with:

**Backend:**
- Node.js.
- Express.
- TypeScript.
- MySQL.
- Repository Pattern.
- Dependency Injection.

**Frontend:**
- React.
- TypeScript.
- Feature-based architecture.
- Shared API client.

---

# 40. Phase 27 Completion Checklist

| No. | Topic | Status |
|---|---|---|
| 1 | Software architecture fundamentals | ☐ |
| 2 | Monolithic architecture | ☐ |
| 3 | Microservices architecture | ☐ |
| 4 | Modular architecture | ☐ |
| 5 | Layered architecture | ☐ |
| 6 | Separation of concerns | ☐ |
| 7 | Controllers | ☐ |
| 8 | Services | ☐ |
| 9 | Repositories | ☐ |
| 10 | DTOs | ☐ |
| 11 | Models and entities | ☐ |
| 12 | Dependency Injection | ☐ |
| 13 | Constructor injection | ☐ |
| 14 | Setter injection | ☐ |
| 15 | Method injection | ☐ |
| 16 | Dependency Inversion Principle | ☐ |
| 17 | Repository Pattern | ☐ |
| 18 | Factory Pattern | ☐ |
| 19 | Singleton Pattern | ☐ |
| 20 | Adapter Pattern | ☐ |
| 21 | Strategy Pattern | ☐ |
| 22 | Middleware architecture | ☐ |
| 23 | Centralized error handling | ☐ |
| 24 | Configuration management | ☐ |
| 25 | Environment variable validation | ☐ |
| 26 | Shared types and utilities | ☐ |
| 27 | Barrel files | ☐ |
| 28 | Circular dependencies | ☐ |
| 29 | Feature-based architecture | ☐ |
| 30 | Domain-Driven Design | ☐ |
| 31 | SOLID principles | ☐ |
| 32 | Clean Architecture | ☐ |
| 33 | Node.js project architecture | ☐ |
| 34 | React project architecture | ☐ |
| 35 | API client architecture | ☐ |
| 36 | DI containers | ☐ |
| 37 | Composition root | ☐ |
| 38 | Testing boundaries | ☐ |

---

# What Comes Next?

## Phase 28: TypeScript Design Patterns – Advanced Creational, Structural, and Behavioral Patterns

In the next phase, we will explore design patterns in greater depth.

### Topics

1. What are design patterns?
2. Creational design patterns.
3. Structural design patterns.
4. Behavioral design patterns.
5. Abstract Factory Pattern.
6. Builder Pattern.
7. Prototype Pattern.
8. Decorator Pattern.
9. Facade Pattern.
10. Proxy Pattern.
11. Composite Pattern.
12. Bridge Pattern.
13. Observer Pattern.
14. Pub/Sub Pattern.
15. Command Pattern.
16. State Pattern.
17. Chain of Responsibility Pattern.
18. Iterator Pattern.
19. Template Method Pattern.
20. Mediator Pattern.
21. Visitor Pattern.
22. Dependency Injection vs Service Locator.
23. Choosing the right design pattern.
24. Practical TypeScript implementations.
25. Real-world application examples.

**Phase 27 complete.** Say **"OK, Phase 28"** when you're ready to continue.