# Phase 52: Advanced TypeScript – Clean Architecture, SOLID Principles, Design Patterns, Dependency Injection and Scalable Project Structure

**Level:** Expert / Advanced Software Architecture  
**Prerequisites:** TypeScript, JavaScript, Node.js, Express.js, OOP, interfaces, classes, generics, asynchronous programming, database integration, and testing.

---

# 1. Learning Objectives

In this phase, you will learn how to design professional, maintainable, scalable TypeScript applications.

By the end of this phase, you should understand:

1. Software architecture fundamentals.
2. Monolithic vs Microservices architecture.
3. Layered architecture.
4. Clean Architecture.
5. Hexagonal Architecture.
6. SOLID principles.
7. Single Responsibility Principle.
8. Open/Closed Principle.
9. Liskov Substitution Principle.
10. Interface Segregation Principle.
11. Dependency Inversion Principle.
12. Dependency Injection.
13. Inversion of Control.
14. Repository Pattern.
15. Service Layer Pattern.
16. Factory Pattern.
17. Singleton Pattern.
18. Strategy Pattern.
19. Observer Pattern.
20. Adapter Pattern.
21. Decorator Pattern.
22. Builder Pattern.
23. Command Pattern.
24. Middleware Pattern.
25. Domain-Driven Design fundamentals.
26. DTOs and Data Mapping.
27. Application and Domain Layers.
28. Dependency Management.
29. Scalable TypeScript folder structures.
30. Production-level application architecture.

---

# 2. Software Architecture Fundamentals

Software architecture refers to the high-level structure and organization of an application.

It defines:

- How application components are organized.
- How different modules communicate.
- Where business logic lives.
- How data flows through the application.
- How dependencies are managed.
- How the application handles growth.
- How the application can be tested and maintained.

Consider a basic Node.js application.

Without a proper architecture:

```text
src/
  app.ts
  server.ts
  user.ts
  product.ts
  order.ts
  payment.ts
  database.ts
```

As the application grows, everything can become tightly coupled.

For example:

```typescript
import mysql from "mysql2/promise";

export async function createUser(
  name: string,
  email: string
) {

  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "app"
  });

  const [result] = await connection.execute(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email]
  );

  return result;

}
```

Problems:

1. Business logic and database logic are mixed.
2. Database configuration is embedded in the function.
3. Testing becomes difficult.
4. Changing MySQL to PostgreSQL requires modifying application code.
5. Reusing the business logic becomes harder.

Software architecture helps solve these problems by separating responsibilities.

## 2.1 Main Goals of Good Architecture

| Goal | Explanation |
|---|---|
| Maintainability | Code should be easy to modify. |
| Scalability | Application should support growth. |
| Testability | Components should be easy to test. |
| Reusability | Components should be reusable. |
| Flexibility | Dependencies should be replaceable. |
| Extensibility | New features should be easy to add. |
| Reliability | Changes should not unnecessarily break existing functionality. |

**Important:** Good architecture does not mean creating the maximum number of folders, interfaces, classes, or abstractions. It means organizing code around clear responsibilities and meaningful boundaries.

---

# 3. Monolithic vs Microservices Architecture

These are two common architectural styles.

## 3.1 Monolithic Architecture

A monolithic application is deployed as one application unit.

Example:

```text
             E-Commerce Application
                       |
       +---------------+---------------+
       |               |               |
       v               v               v
    Users           Products         Orders
       |               |               |
       v               v               v
    MySQL            MySQL            MySQL
```

A typical project:

```text
src/
  modules/
    users/
    products/
    orders/
    payments/

  database/
  middleware/
  app.ts
  server.ts
```

All modules are part of the same application deployment.

### Advantages

- Easier initial development.
- Simple deployment.
- Easier local debugging.
- Straightforward communication between modules.
- Usually lower infrastructure complexity.

### Disadvantages

- Large applications can become difficult to maintain.
- Independent module deployment is difficult.
- Scaling individual components independently is limited.
- Poor modularity can create tight coupling.

## 3.2 Microservices Architecture

Microservices architecture divides an application into independently deployable services.

Example:

```text
                API Gateway
                     |
       +-------------+-------------+
       |             |             |
       v             v             v
   User Service  Product Service  Order Service
       |             |             |
       v             v             v
   User DB        Product DB     Order DB
```

Each service owns a specific business capability.

Possible project structure:

```text
ecommerce/
  api-gateway/
  user-service/
  product-service/
  order-service/
  payment-service/
  notification-service/
```

Services can communicate using:

- HTTP REST APIs.
- gRPC.
- Message queues.
- Event streaming.

### Advantages

- Independent deployment.
- Independent scaling.
- Technology flexibility.
- Better organizational boundaries for larger teams.
- Failures can sometimes be isolated between services.

### Disadvantages

- Distributed system complexity.
- Network failures.
- Data consistency challenges.
- More complicated monitoring.
- Distributed tracing requirements.
- More deployment and infrastructure overhead.

## 3.3 Monolith vs Microservices

| Feature | Monolith | Microservices |
|---|---|---|
| Deployment | One application unit | Multiple services |
| Complexity | Lower initially | Higher |
| Communication | Mostly in-process | Network or messaging |
| Scaling | Usually application-level | Per-service |
| Database | Often shared | Prefer service-owned data |
| Development | Simpler initially | Requires service coordination |
| Testing | Easier integration setup | Distributed testing challenges |
| Infrastructure | Simpler | More complex |

### When Should You Use Each?

**Choose a modular monolith when:**

- Starting a new application.
- Working with a small development team.
- Business requirements are evolving.
- Independent deployment is not necessary.
- Infrastructure simplicity is important.

**Consider microservices when:**

- Business domains have clear boundaries.
- Different components need independent scaling.
- Teams need independent deployment.
- Operational infrastructure is mature enough.

**Professional recommendation:** Start with a well-structured modular monolith unless you have a concrete reason to introduce distributed services.

---

# 4. Layered Architecture

Layered architecture separates an application into logical layers.

A common backend architecture contains:

```text
        Presentation Layer
                |
                v
        Application Layer
                |
                v
          Domain Layer
                |
                v
      Infrastructure Layer
```

Each layer has a specific responsibility.

## 4.1 Presentation Layer

Responsible for receiving and returning HTTP requests and responses.

Examples:

- Express controllers.
- Routes.
- Request validation.
- Response formatting.

Example:

```typescript
// controllers/userController.ts

import { Request, Response } from "express";

export function getUser(
  req: Request,
  res: Response
) {

  const id = Number(req.params.id);

  return res.status(200).json({
    id,
    name: "Ali"
  });

}
```

## 4.2 Application Layer

Responsible for coordinating application operations.

Examples:

- Use cases.
- Application services.
- Workflow orchestration.
- Transaction coordination.

Example:

```typescript
// application/createUser.ts

export class CreateUser {

  async execute(name: string, email: string) {

    // Coordinate user creation workflow

  }

}
```

## 4.3 Domain Layer

Contains the core business rules.

Examples:

- Entities.
- Value objects.
- Domain services.
- Business invariants.
- Domain events.

Example:

```typescript
// domain/User.ts

export class User {

  constructor(
    public readonly id: number,
    public name: string,
    public email: string
  ) {}

  changeEmail(email: string) {

    if (!email.includes("@")) {
      throw new Error("Invalid email");
    }

    this.email = email;

  }

}
```

## 4.4 Infrastructure Layer

Contains technical implementations.

Examples:

- Database connections.
- Prisma repositories.
- MySQL repositories.
- Redis clients.
- External API clients.
- Email providers.

Example:

```typescript
// infrastructure/database.ts

import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
```

### Benefits of Layered Architecture

- Responsibilities are separated.
- Code is easier to navigate.
- Components can be tested independently.
- Business logic becomes easier to understand.
- Changes can be localized.

**Important:** Traditional layered architecture can still become tightly coupled if upper layers directly depend on infrastructure implementations. Clean Architecture addresses this through dependency inversion.

---

# 5. Clean Architecture

Clean Architecture is an architectural approach that organizes software around business rules rather than external technologies.

The central idea:

**Business logic should not depend directly on frameworks, databases, or external services.**

A common representation:

```text
        +---------------------------+
        |     Presentation Layer   |
        |                           |
        |      Controllers          |
        +---------------------------+
                    |
                    v
        +---------------------------+
        |     Application Layer    |
        |                           |
        |       Use Cases            |
        +---------------------------+
                    |
                    v
        +---------------------------+
        |        Domain Layer       |
        |                           |
        |       Entities             |
        |       Business Rules       |
        +---------------------------+
                    ^
                    |
        +---------------------------+
        |    Infrastructure Layer  |
        |                           |
        |       Database             |
        |       External APIs        |
        +---------------------------+
```

The diagram is conceptual. The important rule is that dependencies should point inward toward stable business rules.

## 5.1 Main Layers

### Domain Layer

Contains:

- Entities.
- Value Objects.
- Domain Services.
- Domain Errors.
- Business Rules.

It should not depend on Express, Prisma, MySQL, or Redis.

### Application Layer

Contains:

- Use Cases.
- Application Services.
- Repository Interfaces.
- External Service Interfaces.
- Application DTOs.

It coordinates domain operations.

### Infrastructure Layer

Contains:

- Database implementations.
- Repository implementations.
- Email services.
- Payment gateways.
- External API integrations.

### Presentation Layer

Contains:

- Controllers.
- Routes.
- HTTP request and response handling.
- Framework-specific code.

## 5.2 Dependency Rule

The dependency rule is one of the most important ideas in Clean Architecture.

```text
Infrastructure ---> Application ---> Domain
Presentation  ----> Application ---> Domain
```

The arrows represent compile-time dependencies.

For example:

- Application code can depend on domain types.
- Infrastructure code can implement application interfaces.
- Application code should not import a concrete Prisma repository.

### Why?

Imagine switching from Prisma to Sequelize.

With good dependency boundaries:

```text
Application
     |
     v
IUserRepository
     ^
     |
PrismaUserRepository
```

You can replace:

```text
PrismaUserRepository
```

with:

```text
SequelizeUserRepository
```

without changing the business use case.

---

# 6. Clean Architecture – Practical TypeScript Example

Let's build a user creation workflow.

## 6.1 Project Structure

```text
src/
│
├── domain/
│   ├── entities/
│   │   └── User.ts
│   │
│   └── errors/
│       └── DomainError.ts
│
├── application/
│   ├── interfaces/
│   │   └── IUserRepository.ts
│   │
│   ├── dto/
│   │   └── CreateUserDTO.ts
│   │
│   └── use-cases/
│       └── CreateUserUseCase.ts
│
├── infrastructure/
│   └── repositories/
│       └── PrismaUserRepository.ts
│
├── presentation/
│   ├── controllers/
│   │   └── UserController.ts
│   │
│   └── routes/
│       └── userRoutes.ts
│
├── config/
│   └── database.ts
│
├── app.ts
└── server.ts
```

## 6.2 Domain Entity

**domain/entities/User.ts**

```typescript
export class User {

  constructor(
    public readonly id: number | null,
    public readonly name: string,
    public readonly email: string
  ) {

    if (!name.trim()) {
      throw new Error("User name is required");
    }

    if (!email.includes("@")) {
      throw new Error("Invalid email address");
    }

  }

}
```

This class contains basic domain validation.

Notice that it does not depend on Express or Prisma.

## 6.3 Repository Interface

**application/interfaces/IUserRepository.ts**

```typescript
import { User } from "../../domain/entities/User";

export interface IUserRepository {

  findByEmail(email: string): Promise<User | null>;

  create(user: User): Promise<User>;

}
```

This interface defines what the application needs from persistence.

It does not specify how data is stored.

## 6.4 DTO

**application/dto/CreateUserDTO.ts**

```typescript
export interface CreateUserDTO {

  name: string;

  email: string;

}
```

DTO stands for Data Transfer Object.

It represents data passed between application boundaries.

## 6.5 Use Case

**application/use-cases/CreateUserUseCase.ts**

```typescript
import { User } from "../../domain/entities/User";

import { IUserRepository } from "../interfaces/IUserRepository";

import { CreateUserDTO } from "../dto/CreateUserDTO";

export class CreateUserUseCase {

  constructor(
    private userRepository: IUserRepository
  ) {}

  async execute(data: CreateUserDTO): Promise<User> {

    const existingUser =
      await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = new User(
      null,
      data.name,
      data.email
    );

    return this.userRepository.create(user);

  }

}
```

This use case:

1. Checks whether the email already exists.
2. Creates a domain entity.
3. Saves the entity through the repository interface.
4. Returns the created user.

It does not know whether the database is MySQL, PostgreSQL, or MongoDB.

## 6.6 Infrastructure Repository

**infrastructure/repositories/PrismaUserRepository.ts**

```typescript
import { PrismaClient } from "@prisma/client";

import { User } from "../../domain/entities/User";

import { IUserRepository } from "../../application/interfaces/IUserRepository";

export class PrismaUserRepository implements IUserRepository {

  constructor(
    private prisma: PrismaClient
  ) {}

  async findByEmail(email: string): Promise<User | null> {

    const record = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!record) {
      return null;
    }

    return new User(
      record.id,
      record.name,
      record.email
    );

  }

  async create(user: User): Promise<User> {

    const record = await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email
      }
    });

    return new User(
      record.id,
      record.name,
      record.email
    );

  }

}
```

This class implements the application-defined repository interface.

The Prisma dependency stays inside infrastructure.

## 6.7 Controller

**presentation/controllers/UserController.ts**

```typescript
import { Request, Response } from "express";

import { CreateUserUseCase } from "../../application/use-cases/CreateUserUseCase";

export class UserController {

  constructor(
    private createUserUseCase: CreateUserUseCase
  ) {}

  create = async (req: Request, res: Response) => {

    try {

      const user = await this.createUserUseCase.execute(
        req.body
      );

      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Internal server error";

      return res.status(400).json({
        message
      });

    }

  };

}
```

In a production application, use dedicated validation and error types to distinguish invalid input, duplicate records, and unexpected server failures.

## 6.8 Dependency Composition

**config/container.ts**

```typescript
import { PrismaClient } from "@prisma/client";

import { PrismaUserRepository } from "../infrastructure/repositories/PrismaUserRepository";

import { CreateUserUseCase } from "../application/use-cases/CreateUserUseCase";

import { UserController } from "../presentation/controllers/UserController";

const prisma = new PrismaClient();

const userRepository = new PrismaUserRepository(prisma);

const createUserUseCase = new CreateUserUseCase(
  userRepository
);

const userController = new UserController(
  createUserUseCase
);

export {
  prisma,
  userController
};
```

This file is responsible for constructing the dependency graph.

The application use case does not create its own Prisma repository.

That is a major architectural improvement.

---

# 7. Hexagonal Architecture (Ports and Adapters)

Hexagonal Architecture is also called Ports and Adapters Architecture.

Its goal is to isolate business logic from external systems.

The central application is surrounded by adapters.

```text
          HTTP Adapter
               |
               v
      +-------------------+
      |                   |
      |    Application    |
      |                   |
      +-------------------+
          ^           ^
          |           |
          v           v
      Database      Email
      Adapter       Adapter
```

## 7.1 What Are Ports?

A port is an interface that defines how the application communicates with something outside its core.

Example:

```typescript
export interface PaymentGateway {

  charge(
    amount: number,
    customerId: string
  ): Promise<boolean>;

}
```

This interface is a port.

The application needs payment functionality, but it does not care which provider implements it.

## 7.2 What Are Adapters?

Adapters implement ports.

For example:

```typescript
export class StripePaymentAdapter
  implements PaymentGateway {

  async charge(
    amount: number,
    customerId: string
  ): Promise<boolean> {

    // Call Stripe API

    return true;

  }

}
```

Another adapter:

```typescript
export class MockPaymentAdapter
  implements PaymentGateway {

  async charge(): Promise<boolean> {

    return true;

  }

}
```

Both adapters satisfy the same port.

## 7.3 Benefits

- External systems can be replaced.
- Business logic remains independent.
- Testing becomes easier.
- Multiple adapters can support different environments.

### Clean Architecture vs Hexagonal Architecture

They share many principles.

| Clean Architecture | Hexagonal Architecture |
|---|---|
| Organizes code around inward dependency rules. | Organizes code around ports and adapters. |
| Emphasizes domain and application boundaries. | Emphasizes isolation from external systems. |
| Often described using concentric layers. | Often described using a central application and surrounding adapters. |
| Can use interfaces and dependency inversion. | Explicitly uses ports and adapters. |

They are compatible architectural approaches, not mutually exclusive alternatives.

---

# 8. SOLID Principles

SOLID is a set of five object-oriented design principles.

These principles help create maintainable and extensible software.

SOLID stands for:

| Letter | Principle |
|---|---|
| S | Single Responsibility Principle |
| O | Open/Closed Principle |
| L | Liskov Substitution Principle |
| I | Interface Segregation Principle |
| D | Dependency Inversion Principle |

Let's understand each principle with TypeScript examples.

---

# 9. Single Responsibility Principle (SRP)

**A class should have one primary responsibility and one coherent reason to change.**

Consider this class:

```typescript
class User {

  constructor(
    public name: string,
    public email: string
  ) {}

  saveToDatabase() {
    // Save user
  }

  sendWelcomeEmail() {
    // Send email
  }

  generatePDF() {
    // Generate PDF
  }

}
```

Problems:

The class is responsible for:

1. User data.
2. Database persistence.
3. Email delivery.
4. PDF generation.

These are different responsibilities.

If email logic changes, the User class must change.

If database logic changes, the User class must also change.

This violates SRP.

## 9.1 Apply SRP

Separate responsibilities:

```typescript
class User {

  constructor(
    public name: string,
    public email: string
  ) {}

}
```

Database responsibility:

```typescript
class UserRepository {

  save(user: User) {
    // Save user to database
  }

}
```

Email responsibility:

```typescript
class EmailService {

  sendWelcomeEmail(user: User) {
    // Send email
  }

}
```

PDF responsibility:

```typescript
class UserPdfGenerator {

  generate(user: User) {
    // Generate PDF
  }

}
```

Now each class has a clear purpose.

### Benefits of SRP

- Smaller classes.
- Easier testing.
- Better maintainability.
- Lower coupling.
- Easier modification.

**Important:** SRP does not mean every class must contain only one method. It means each class should represent one cohesive responsibility.

---

# 10. Open/Closed Principle (OCP)

**Software entities should be open for extension but closed for modification.**

Meaning:

You should be able to add new functionality without repeatedly modifying stable existing code.

Consider:

```typescript
class PaymentService {

  processPayment(
    type: string,
    amount: number
  ) {

    if (type === "stripe") {
      console.log("Processing Stripe payment");
    }

    else if (type === "paypal") {
      console.log("Processing PayPal payment");
    }

    else if (type === "razorpay") {
      console.log("Processing Razorpay payment");
    }

  }

}
```

Problem:

Every time a new payment provider is introduced, we modify the same class.

## 10.1 Apply OCP Using Interfaces

Define an interface:

```typescript
interface PaymentProvider {

  pay(amount: number): Promise<void>;

}
```

Stripe implementation:

```typescript
class StripePayment implements PaymentProvider {

  async pay(amount: number) {

    console.log("Stripe payment:", amount);

  }

}
```

PayPal implementation:

```typescript
class PayPalPayment implements PaymentProvider {

  async pay(amount: number) {

    console.log("PayPal payment:", amount);

  }

}
```

Razorpay implementation:

```typescript
class RazorpayPayment implements PaymentProvider {

  async pay(amount: number) {

    console.log("Razorpay payment:", amount);

  }

}
```

Payment service:

```typescript
class PaymentService {

  constructor(
    private provider: PaymentProvider
  ) {}

  async process(amount: number) {

    await this.provider.pay(amount);

  }

}
```

Usage:

```typescript
const stripe = new StripePayment();

const payment = new PaymentService(stripe);

await payment.process(1000);
```

To add another provider, create another implementation.

The existing PaymentService does not need to change.

### Benefits

- Easier extension.
- Reduced modification of stable code.
- Better separation of responsibilities.
- Easier unit testing.

---

# 11. Liskov Substitution Principle (LSP)

**Objects of a subtype should be usable wherever objects of the parent type are expected without breaking correctness.**

Consider:

```typescript
class Bird {

  fly() {
    console.log("Flying");
  }

}
```

Now:

```typescript
class Sparrow extends Bird {}

class Penguin extends Bird {

  fly() {
    throw new Error("Penguins cannot fly");
  }

}
```

Problem:

Penguin is a Bird, but it cannot satisfy the behavior expected by code that assumes every Bird can fly.

This violates the behavioral expectation of the parent class.

## 11.1 Better Design

Separate general bird behavior from flying behavior.

```typescript
interface Bird {
  eat(): void;
}

interface FlyingBird extends Bird {
  fly(): void;
}
```

Sparrow:

```typescript
class Sparrow implements FlyingBird {

  eat() {
    console.log("Sparrow eating");
  }

  fly() {
    console.log("Sparrow flying");
  }

}
```

Penguin:

```typescript
class Penguin implements Bird {

  eat() {
    console.log("Penguin eating");
  }

}
```

Now the types accurately represent capabilities.

### Benefits of LSP

- Reliable inheritance.
- Better abstractions.
- Fewer unexpected runtime errors.
- More predictable polymorphism.

**Important:** LSP is about behavioral compatibility, not simply whether a class can technically extend another class.

---

# 12. Interface Segregation Principle (ISP)

**Clients should not be forced to depend on methods they do not use.**

Consider:

```typescript
interface Machine {

  print(): void;

  scan(): void;

  fax(): void;

}
```

A simple printer only needs `print()`.

However, implementing the interface forces it to implement all three methods.

Bad implementation:

```typescript
class SimplePrinter implements Machine {

  print() {
    console.log("Printing");
  }

  scan() {
    throw new Error("Not supported");
  }

  fax() {
    throw new Error("Not supported");
  }

}
```

This design is unnecessarily restrictive.

## 12.1 Apply ISP

Create smaller interfaces:

```typescript
interface Printer {
  print(): void;
}

interface Scanner {
  scan(): void;
}

interface FaxMachine {
  fax(): void;
}
```

Simple printer:

```typescript
class SimplePrinter implements Printer {

  print() {
    console.log("Printing");
  }

}
```

Advanced machine:

```typescript
class AdvancedPrinter
  implements Printer, Scanner, FaxMachine {

  print() {
    console.log("Printing");
  }

  scan() {
    console.log("Scanning");
  }

  fax() {
    console.log("Faxing");
  }

}
```

### Benefits

- Smaller interfaces.
- Less unnecessary implementation.
- Better modularity.
- Easier testing.

---

# 13. Dependency Inversion Principle (DIP)

**High-level modules should not depend directly on low-level modules. Both should depend on abstractions.**

Consider:

```typescript
class MySQLDatabase {

  connect() {
    console.log("Connected to MySQL");
  }

}
```

Service:

```typescript
class UserService {

  private database = new MySQLDatabase();

  getUsers() {

    this.database.connect();

  }

}
```

Problem:

UserService directly depends on MySQLDatabase.

Changing to MongoDB requires modifying UserService.

## 13.1 Apply DIP

Create an abstraction:

```typescript
interface Database {

  connect(): void;

}
```

MySQL implementation:

```typescript
class MySQLDatabase implements Database {

  connect() {
    console.log("Connected to MySQL");
  }

}
```

MongoDB implementation:

```typescript
class MongoDatabase implements Database {

  connect() {
    console.log("Connected to MongoDB");
  }

}
```

Service:

```typescript
class UserService {

  constructor(
    private database: Database
  ) {}

  getUsers() {

    this.database.connect();

  }

}
```

Usage:

```typescript
const mysql = new MySQLDatabase();

const userService = new UserService(mysql);
```

Or:

```typescript
const mongo = new MongoDatabase();

const userService = new UserService(mongo);
```

The service does not need to know which database is used.

### Benefits

- Loose coupling.
- Easier dependency replacement.
- Better unit testing.
- More flexible architecture.

---

# 14. Understanding Dependency Injection (DI)

Dependency Injection is a technique where an object receives its dependencies from outside rather than creating them internally.

Consider:

```typescript
class EmailService {

  sendEmail() {
    console.log("Email sent");
  }

}
```

Without DI:

```typescript
class UserService {

  private emailService = new EmailService();

  register() {

    this.emailService.sendEmail();

  }

}
```

UserService creates its own EmailService.

This creates tight coupling.

## 14.1 Constructor Injection

Instead, inject the dependency through the constructor.

```typescript
class UserService {

  constructor(
    private emailService: EmailService
  ) {}

  register() {

    this.emailService.sendEmail();

  }

}
```

Usage:

```typescript
const emailService = new EmailService();

const userService = new UserService(emailService);

userService.register();
```

Now UserService does not create EmailService itself.

## 14.2 Interface-Based Dependency Injection

An even more flexible approach:

```typescript
interface EmailProvider {

  sendEmail(): void;

}
```

Implementations:

```typescript
class GmailProvider implements EmailProvider {

  sendEmail() {
    console.log("Email sent through Gmail");
  }

}
```

```typescript
class SendGridProvider implements EmailProvider {

  sendEmail() {
    console.log("Email sent through SendGrid");
  }

}
```

Service:

```typescript
class UserService {

  constructor(
    private emailProvider: EmailProvider
  ) {}

  register() {

    this.emailProvider.sendEmail();

  }

}
```

Now the service depends on an abstraction.

---

# 15. Types of Dependency Injection

There are three commonly discussed forms.

## 15.1 Constructor Injection

Dependencies are provided through the constructor.

```typescript
class UserService {

  constructor(
    private repository: UserRepository
  ) {}

}
```

This is usually the preferred approach for required dependencies.

## 15.2 Setter Injection

Dependencies are provided through a setter method.

```typescript
class UserService {

  private repository!: UserRepository;

  setRepository(repository: UserRepository) {

    this.repository = repository;

  }

}
```

Useful when a dependency is optional or needs to be replaced after construction, though it can create partially initialized objects.

## 15.3 Method Injection

Dependencies are passed directly to a method.

```typescript
class ReportService {

  generate(
    database: Database
  ) {

    database.connect();

  }

}
```

Useful when a dependency is needed only for one operation.

### Comparison

| Injection Type | Where Dependency Is Provided |
|---|---|
| Constructor Injection | Constructor |
| Setter Injection | Setter method |
| Method Injection | Individual method |

---

# 16. Inversion of Control (IoC)

Inversion of Control is a broader design principle in which control over object creation or execution is delegated to another component or framework.

Normally:

```text
Application
     |
     v
Creates Dependencies
     |
     v
Executes Logic
```

With IoC:

```text
Container / Framework
        |
        v
Creates Dependencies
        |
        v
Provides Them to Application
```

Dependency Injection is one way to implement IoC.

### DI vs IoC

| Dependency Injection | Inversion of Control |
|---|---|
| A specific technique. | A broader principle. |
| Provides dependencies from outside. | Transfers control to another component or framework. |
| Can be implemented manually. | Can be implemented through DI containers, frameworks, callbacks, and other mechanisms. |

**Important:** IoC and DI are related, but they are not identical concepts.

---

# 17. Dependency Injection Containers

In larger applications, manually constructing every dependency can become difficult.

A DI container manages object creation and dependency resolution.

Popular TypeScript DI tools include:

- InversifyJS
- TSyringe
- TypeDI

Official documentation:

- [InversifyJS](https://inversify.io/?utm_source=chatgpt.com)
- [TSyringe](https://github.com/microsoft/tsyringe?utm_source=chatgpt.com)

However, a DI framework is not mandatory.

A simple composition root can be sufficient:

```typescript
const repository = new UserRepository();

const emailService = new EmailService();

const userService = new UserService(
  repository,
  emailService
);
```

The important part is that dependency construction is kept outside business logic.

---

# 18. Repository Pattern

The Repository Pattern separates data access logic from business logic.

It provides an abstraction over data persistence.

Without Repository Pattern:

```typescript
class UserService {

  async getUser(id: number) {

    return prisma.user.findUnique({
      where: { id }
    });

  }

}
```

The service directly depends on Prisma.

## 18.1 Create Repository Interface

```typescript
interface IUserRepository {

  findById(id: number): Promise<User | null>;

  findAll(): Promise<User[]>;

  create(user: User): Promise<User>;

}
```

## 18.2 Create Repository Implementation

```typescript
class PrismaUserRepository implements IUserRepository {

  async findById(id: number) {

    return prisma.user.findUnique({
      where: { id }
    });

  }

  async findAll() {

    return prisma.user.findMany();

  }

  async create(user: User) {

    return prisma.user.create({
      data: user
    });

  }

}
```

## 18.3 Use Repository in Service

```typescript
class UserService {

  constructor(
    private repository: IUserRepository
  ) {}

  async getUser(id: number) {

    return this.repository.findById(id);

  }

}
```

### Benefits

- Separates persistence logic.
- Supports dependency injection.
- Simplifies service testing.
- Allows alternative persistence implementations.

### Important Consideration

Do not automatically create a repository for every model.

If an ORM already provides a suitable data access abstraction, an additional repository layer may introduce unnecessary indirection.

Use repositories when they provide meaningful separation, domain-specific queries, or a useful persistence boundary.

---

# 19. Service Layer Pattern

The Service Layer Pattern organizes business operations into dedicated services.

For example:

```text
controllers/
  userController.ts

services/
  userService.ts

repositories/
  userRepository.ts
```

Controller:

```typescript
class UserController {

  constructor(
    private userService: UserService
  ) {}

  async getUser(req: Request, res: Response) {

    const user = await this.userService.getUser(
      Number(req.params.id)
    );

    return res.json(user);

  }

}
```

Service:

```typescript
class UserService {

  constructor(
    private repository: IUserRepository
  ) {}

  async getUser(id: number) {

    if (id <= 0) {
      throw new Error("Invalid ID");
    }

    return this.repository.findById(id);

  }

}
```

Repository:

```typescript
class UserRepository implements IUserRepository {

  async findById(id: number) {

    // Database query

  }

}
```

### Responsibilities

| Component | Responsibility |
|---|---|
| Controller | HTTP request and response. |
| Service | Business operations. |
| Repository | Data persistence. |

**Important:** A service should coordinate business operations, not become a dumping ground for every function in the application.

---

# 20. Factory Pattern

The Factory Pattern centralizes object creation.

It is useful when object creation involves complex conditions or multiple implementations.

Consider:

```typescript
class StripePayment {}

class PayPalPayment {}

class RazorpayPayment {}
```

Without a factory:

```typescript
let payment;

if (type === "stripe") {
  payment = new StripePayment();
}

else if (type === "paypal") {
  payment = new PayPalPayment();
}

else {
  payment = new RazorpayPayment();
}
```

This logic might be repeated throughout the application.

## 20.1 Apply Factory Pattern

```typescript
interface PaymentProvider {

  pay(amount: number): void;

}
```

Implementations:

```typescript
class StripePayment implements PaymentProvider {

  pay(amount: number) {
    console.log("Stripe:", amount);
  }

}
```

```typescript
class PayPalPayment implements PaymentProvider {

  pay(amount: number) {
    console.log("PayPal:", amount);
  }

}
```

Factory:

```typescript
class PaymentFactory {

  static create(type: string): PaymentProvider {

    switch (type) {

      case "stripe":
        return new StripePayment();

      case "paypal":
        return new PayPalPayment();

      default:
        throw new Error("Unsupported payment provider");

    }

  }

}
```

Usage:

```typescript
const payment = PaymentFactory.create("stripe");

payment.pay(1000);
```

### Benefits

- Centralizes object creation.
- Hides implementation details.
- Reduces repeated construction logic.
- Simplifies selection between implementations.

---

# 21. Singleton Pattern

The Singleton Pattern ensures that a class provides one shared instance within a given application scope.

Example:

```typescript
class DatabaseConnection {

  private static instance: DatabaseConnection;

  private constructor() {}

  static getInstance(): DatabaseConnection {

    if (!DatabaseConnection.instance) {

      DatabaseConnection.instance =
        new DatabaseConnection();

    }

    return DatabaseConnection.instance;

  }

}
```

Usage:

```typescript
const db1 = DatabaseConnection.getInstance();

const db2 = DatabaseConnection.getInstance();

console.log(db1 === db2); // true
```

### Common Use Cases

- Shared configuration.
- Logger instances.
- Database client management.
- Application-wide registries.

### Important Considerations

A Singleton can introduce global mutable state and make tests harder.

Also, a Singleton instance is generally unique only within its JavaScript module/runtime context, not automatically across:

- Multiple Node.js processes.
- Multiple containers.
- Multiple servers.
- Serverless invocations.

For example, a database connection pool in a Node.js process is commonly created once and reused, but it is not a globally shared connection across an entire distributed application.

**Professional recommendation:** Use Singleton deliberately, not automatically. Dependency injection often provides better control.

---

# 22. Strategy Pattern

The Strategy Pattern allows an application to select between different algorithms through a common interface.

Example: Different discount calculation strategies.

```typescript
interface DiscountStrategy {

  calculate(price: number): number;

}
```

Regular discount:

```typescript
class RegularDiscount implements DiscountStrategy {

  calculate(price: number) {

    return price * 0.05;

  }

}
```

Premium discount:

```typescript
class PremiumDiscount implements DiscountStrategy {

  calculate(price: number) {

    return price * 0.15;

  }

}
```

Festival discount:

```typescript
class FestivalDiscount implements DiscountStrategy {

  calculate(price: number) {

    return price * 0.25;

  }

}
```

Context:

```typescript
class DiscountService {

  constructor(
    private strategy: DiscountStrategy
  ) {}

  calculateDiscount(price: number) {

    return this.strategy.calculate(price);

  }

}
```

Usage:

```typescript
const strategy = new PremiumDiscount();

const discountService = new DiscountService(strategy);

console.log(
  discountService.calculateDiscount(1000)
);
```

### Advantages

- Avoids large conditional statements.
- Supports new algorithms.
- Improves testability.
- Follows OCP.

### Real-World Applications

- Payment methods.
- Shipping calculations.
- Discount rules.
- Authentication providers.
- File processing strategies.

---

# 23. Observer Pattern

The Observer Pattern allows one object to notify multiple subscribers when an event occurs.

Example:

When a user registers:

- Send a welcome email.
- Send an SMS.
- Record an analytics event.
- Notify an administrator.

Without the Observer Pattern, all these operations may be tightly coupled to user registration.

## 23.1 Simple Observer Example

```typescript
interface Observer {

  update(message: string): void;

}
```

Email observer:

```typescript
class EmailObserver implements Observer {

  update(message: string) {

    console.log("Email:", message);

  }

}
```

SMS observer:

```typescript
class SMSObserver implements Observer {

  update(message: string) {

    console.log("SMS:", message);

  }

}
```

Subject:

```typescript
class EventManager {

  private observers: Observer[] = [];

  subscribe(observer: Observer) {

    this.observers.push(observer);

  }

  unsubscribe(observer: Observer) {

    this.observers =
      this.observers.filter(item => item !== observer);

  }

  notify(message: string) {

    for (const observer of this.observers) {

      observer.update(message);

    }

  }

}
```

Usage:

```typescript
const eventManager = new EventManager();

eventManager.subscribe(new EmailObserver());

eventManager.subscribe(new SMSObserver());

eventManager.notify("New user registered");
```

Output:

```text
Email: New user registered
SMS: New user registered
```

### Real-World Applications

- Event systems.
- UI event handling.
- Notification systems.
- Domain event handlers.
- Application state updates.

### Important Distinction

The Observer Pattern usually describes in-process notification.

For reliable asynchronous communication between distributed services, message brokers and event-driven architectures may be more appropriate.

---

# 24. Adapter Pattern

The Adapter Pattern allows incompatible interfaces to work together.

Imagine your application expects:

```typescript
interface PaymentGateway {

  processPayment(amount: number): Promise<boolean>;

}
```

But an external payment provider exposes:

```typescript
class ExternalPaymentSDK {

  async makePayment(
    value: number
  ) {

    console.log("External payment:", value);

    return {
      success: true
    };

  }

}
```

The interfaces are different.

Create an adapter:

```typescript
class PaymentAdapter implements PaymentGateway {

  constructor(
    private sdk: ExternalPaymentSDK
  ) {}

  async processPayment(amount: number) {

    const response = await this.sdk.makePayment(amount);

    return response.success;

  }

}
```

Usage:

```typescript
const sdk = new ExternalPaymentSDK();

const adapter = new PaymentAdapter(sdk);

const result = await adapter.processPayment(1000);
```

### Benefits

- Integrates third-party libraries.
- Hides external implementation details.
- Makes external systems replaceable.
- Keeps application interfaces consistent.

### Real-World Applications

- Payment gateway integrations.
- Cloud storage providers.
- Legacy API integration.
- Different database clients.
- Third-party authentication providers.

---

# 25. Decorator Pattern

The Decorator Pattern adds behavior to an existing object without changing its original implementation.

Consider:

```typescript
interface Notification {

  send(message: string): void;

}
```

Basic notification:

```typescript
class EmailNotification implements Notification {

  send(message: string) {

    console.log("Email:", message);

  }

}
```

Now we want logging.

Instead of modifying the original class, create a decorator:

```typescript
class LoggingNotification implements Notification {

  constructor(
    private notification: Notification
  ) {}

  send(message: string) {

    console.log("Sending notification...");

    this.notification.send(message);

    console.log("Notification sent");

  }

}
```

Usage:

```typescript
const email = new EmailNotification();

const notification = new LoggingNotification(email);

notification.send("Hello");
```

Output:

```text
Sending notification...
Email: Hello
Notification sent
```

### Benefits

- Adds functionality dynamically.
- Avoids modifying original classes.
- Supports composition.
- Encourages reusable behavior.

### Common Applications

- Logging.
- Caching.
- Authorization checks.
- Metrics.
- Retry behavior.

**Important:** The Decorator Design Pattern is different from TypeScript's `@decorator` language feature. They are related conceptually in some applications, but they are not the same thing.

---

# 26. Builder Pattern

The Builder Pattern is useful when creating complex objects with multiple optional properties.

Without Builder:

```typescript
const user = {
  name: "Ali",
  email: "ali@example.com",
  age: 25,
  address: "Ahmedabad",
  phone: "9999999999"
};
```

For complex objects, construction can become difficult to manage.

## 26.1 Implement Builder Pattern

```typescript
interface UserData {

  name: string;

  email: string;

  age?: number;

  address?: string;

}
```

Builder:

```typescript
class UserBuilder {

  private data: Partial<UserData> = {};

  setName(name: string) {

    this.data.name = name;

    return this;

  }

  setEmail(email: string) {

    this.data.email = email;

    return this;

  }

  setAge(age: number) {

    this.data.age = age;

    return this;

  }

  setAddress(address: string) {

    this.data.address = address;

    return this;

  }

  build(): UserData {

    if (!this.data.name || !this.data.email) {
      throw new Error("Name and email are required");
    }

    return this.data as UserData;

  }

}
```

Usage:

```typescript
const user = new UserBuilder()
  .setName("Ali")
  .setEmail("ali@example.com")
  .setAge(25)
  .setAddress("Ahmedabad")
  .build();
```

### Benefits

- Readable object creation.
- Supports optional properties.
- Separates construction from representation.
- Can enforce required fields during construction.

**Note:** A builder is not always necessary. For simple objects, object literals and typed factory functions are usually sufficient.

---

# 27. Command Pattern

The Command Pattern encapsulates an operation as an object.

It separates the object requesting an operation from the object executing it.

Example:

```typescript
interface Command {

  execute(): void;

}
```

Receiver:

```typescript
class Light {

  turnOn() {
    console.log("Light ON");
  }

  turnOff() {
    console.log("Light OFF");
  }

}
```

Commands:

```typescript
class TurnOnCommand implements Command {

  constructor(
    private light: Light
  ) {}

  execute() {

    this.light.turnOn();

  }

}
```

```typescript
class TurnOffCommand implements Command {

  constructor(
    private light: Light
  ) {}

  execute() {

    this.light.turnOff();

  }

}
```

Invoker:

```typescript
class RemoteControl {

  executeCommand(command: Command) {

    command.execute();

  }

}
```

Usage:

```typescript
const light = new Light();

const remote = new RemoteControl();

remote.executeCommand(
  new TurnOnCommand(light)
);
```

### Real-World Applications

- Job queues.
- Undo/redo operations.
- Background tasks.
- Transaction commands.
- Task scheduling.
- User actions.

---

# 28. Middleware Pattern

Middleware is a common architectural pattern in Node.js and Express applications.

Middleware functions process requests before they reach the final route handler.

Example:

```text
Incoming Request
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

Example:

```typescript
import { Request, Response, NextFunction } from "express";

function logger(
  req: Request,
  res: Response,
  next: NextFunction
) {

  console.log(req.method, req.url);

  next();

}
```

Usage:

```typescript
app.use(logger);
```

### Common Middleware Responsibilities

- Authentication.
- Authorization.
- Request validation.
- Logging.
- Rate limiting.
- Error handling.
- Request transformation.

Middleware allows cross-cutting concerns to be separated from individual controllers.

---

# 29. Domain-Driven Design (DDD) Fundamentals

Domain-Driven Design is an approach to software development that places emphasis on understanding and modeling the business domain.

It is especially useful for complex business applications.

Consider an e-commerce system.

Business concepts include:

- Customer.
- Product.
- Shopping Cart.
- Order.
- Payment.
- Shipment.
- Refund.

These concepts form the business domain.

## 29.1 Domain

A domain represents the business area the application addresses.

Examples:

- Banking.
- Healthcare.
- E-commerce.
- Inventory management.
- Education.

## 29.2 Entity

An entity is an object that has a distinct identity.

Example:

```typescript
class Customer {

  constructor(
    public readonly id: string,
    public name: string,
    public email: string
  ) {}

}
```

Two customers can have identical names but different identities.

## 29.3 Value Object

A value object represents a concept based on its value rather than identity.

Example:

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

Two Money objects with the same amount and currency may be considered equal by value.

## 29.4 Aggregate

An aggregate is a cluster of related domain objects treated as a consistency boundary.

An aggregate root controls access to the objects inside the aggregate.

Example:

```text
Order (Aggregate Root)
   |
   +---- OrderItem
   |
   +---- OrderItem
   |
   +---- OrderItem
```

The Order entity controls operations that modify its items.

## 29.5 Repository

In DDD, repositories provide a way to retrieve and persist domain aggregates.

## 29.6 Domain Service

A domain service represents domain logic that does not naturally belong to a single entity or value object.

Example:

```typescript
class ShippingCostService {

  calculate(
    weight: number,
    distance: number
  ): number {

    return weight * distance * 0.05;

  }

}
```

## 29.7 Bounded Context

A Bounded Context defines a boundary within which a domain model and its terminology have a specific meaning.

Example:

```text
E-Commerce System
       |
       +---- Sales Context
       |
       +---- Inventory Context
       |
       +---- Shipping Context
       |
       +---- Billing Context
```

The word "Product" may have different meanings in the Sales and Inventory contexts.

### DDD Benefits

- Better business alignment.
- Clearer domain boundaries.
- More expressive models.
- Reduced conceptual complexity.
- Better organization of large business systems.

**Important:** DDD is not simply creating classes named Entity, Repository, and Service. It is primarily about modeling business complexity correctly.

---

# 30. DTOs – Data Transfer Objects

DTO stands for Data Transfer Object.

A DTO defines the data transferred between application boundaries.

Suppose a database user contains:

```typescript
interface UserEntity {

  id: number;

  name: string;

  email: string;

  passwordHash: string;

  createdAt: Date;

  updatedAt: Date;

}
```

You should not expose the entire database object to the client.

Instead, define a response DTO:

```typescript
interface UserResponseDTO {

  id: number;

  name: string;

  email: string;

}
```

Mapping:

```typescript
function toUserResponseDTO(
  user: UserEntity
): UserResponseDTO {

  return {
    id: user.id,
    name: user.name,
    email: user.email
  };

}
```

Usage:

```typescript
const response = toUserResponseDTO(user);

res.json(response);
```

### Why DTOs Matter

1. Prevent exposing sensitive information.
2. Control API response structure.
3. Separate database models from API contracts.
4. Reduce coupling.
5. Support validation and transformation.

### Entity vs DTO

| Entity | DTO |
|---|---|
| Represents a domain concept. | Represents transferred data. |
| Contains domain identity and behavior. | Usually contains data fields. |
| Used in business logic. | Used across application boundaries. |
| May enforce business invariants. | Usually focuses on data shape. |

---

# 31. Domain Layer vs Application Layer

These layers are often confused.

Let's distinguish them.

## Domain Layer

Contains business rules.

Example:

```typescript
class Order {

  constructor(
    public readonly id: number,
    private total: number
  ) {}

  applyDiscount(discount: number) {

    if (discount < 0 || discount > this.total) {
      throw new Error("Invalid discount");
    }

    this.total -= discount;

  }

  getTotal() {

    return this.total;

  }

}
```

The Order entity knows how to apply a valid discount.

## Application Layer

Coordinates use cases.

Example:

```typescript
class ApplyOrderDiscount {

  constructor(
    private orderRepository: OrderRepository
  ) {}

  async execute(
    orderId: number,
    discount: number
  ) {

    const order = await this.orderRepository.findById(
      orderId
    );

    if (!order) {
      throw new Error("Order not found");
    }

    order.applyDiscount(discount);

    await this.orderRepository.save(order);

  }

}
```

### Difference

| Domain Layer | Application Layer |
|---|---|
| Contains business rules. | Coordinates business operations. |
| Defines entities and value objects. | Defines use cases. |
| Independent of infrastructure. | Depends on domain abstractions. |
| Enforces business invariants. | Controls workflows. |

---

# 32. Dependency Management and Composition Root

As applications grow, dependencies become more complicated.

Consider:

```text
UserController
      |
      v
CreateUserUseCase
      |
      +------> UserRepository
      |
      +------> EmailService
      |
      +------> EventPublisher
```

Instead of creating these dependencies inside every class, construct them at a central location.

This is called the **Composition Root**.

Example:

```typescript
const userRepository = new PrismaUserRepository(prisma);

const emailService = new SendGridEmailService(config);

const eventPublisher = new RedisEventPublisher(redis);

const createUserUseCase = new CreateUserUseCase(
  userRepository,
  emailService,
  eventPublisher
);

const userController = new UserController(
  createUserUseCase
);
```

### Why Is This Useful?

- Dependency creation is centralized.
- Application configuration is easier.
- Testing becomes easier.
- Implementations can be replaced.
- Business classes remain independent.

---

# 33. Scalable TypeScript Project Structures

There are several ways to organize large TypeScript applications.

## 33.1 Layer-Based Structure

```text
src/
  controllers/
  services/
  repositories/
  models/
  routes/
  middleware/
  utils/
```

Advantages:

- Simple.
- Easy to understand.
- Suitable for smaller applications.

Disadvantages:

- Features become spread across folders.
- Large applications can become difficult to navigate.

## 33.2 Feature-Based Structure

```text
src/
  modules/
    users/
      user.controller.ts
      user.service.ts
      user.repository.ts
      user.routes.ts
      user.types.ts

    products/
      product.controller.ts
      product.service.ts
      product.repository.ts
      product.routes.ts

    orders/
      order.controller.ts
      order.service.ts
      order.repository.ts
      order.routes.ts

  shared/
  config/
  app.ts
  server.ts
```

Advantages:

- Related code stays together.
- Easier feature development.
- Better modularity.
- Easier ownership by teams.

## 33.3 Clean Architecture Structure

```text
src/
  domain/
    entities/
    value-objects/
    services/
    errors/

  application/
    use-cases/
    interfaces/
    dto/

  infrastructure/
    database/
    repositories/
    external-services/

  presentation/
    controllers/
    routes/
    middleware/

  config/
  app.ts
  server.ts
```

Advantages:

- Strong dependency boundaries.
- Better separation of business logic.
- Easier testing.
- Suitable for complex applications.

## 33.4 Recommended Modular Clean Architecture

For a larger application, you can combine feature-based organization with Clean Architecture.

```text
src/
│
├── modules/
│   │
│   ├── users/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   └── errors/
│   │   │
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   └── interfaces/
│   │   │
│   │   ├── infrastructure/
│   │   │   └── repositories/
│   │   │
│   │   └── presentation/
│   │       ├── controllers/
│   │       └── routes/
│   │
│   ├── products/
│   │
│   └── orders/
│
├── shared/
│   ├── errors/
│   ├── types/
│   └── utils/
│
├── infrastructure/
│   ├── database/
│   ├── redis/
│   └── messaging/
│
├── config/
│
├── app.ts
└── server.ts
```

This approach keeps related feature code together while preserving architectural boundaries.

However, not every project needs this level of structure.

---

# 34. Production-Level Architecture Best Practices

For professional TypeScript applications:

1. Keep controllers thin.
2. Keep business rules out of controllers.
3. Separate domain logic from infrastructure.
4. Use dependency injection where it improves flexibility.
5. Prefer interfaces at meaningful architectural boundaries.
6. Avoid unnecessary abstractions.
7. Keep modules cohesive.
8. Use DTOs at external boundaries.
9. Validate incoming data at runtime.
10. Centralize error handling.
11. Avoid circular dependencies.
12. Keep configuration outside business logic.
13. Use a composition root for dependency construction.
14. Keep database implementations replaceable where needed.
15. Test domain logic independently.
16. Test infrastructure integrations separately.
17. Avoid global mutable state.
18. Use domain language consistently.
19. Introduce microservices only when justified.
20. Document important architectural decisions.

---

# 35. Common Architecture Mistakes

| Mistake | Problem | Better Approach |
|---|---|---|
| Putting all logic in controllers | Controllers become difficult to maintain. | Use application services or use cases. |
| Making services depend directly on Prisma | Business logic becomes ORM-dependent. | Use repository abstractions where valuable. |
| Creating too many interfaces | Adds unnecessary complexity. | Abstract meaningful boundaries. |
| Using Singleton everywhere | Creates global state and testing problems. | Prefer explicit dependency injection. |
| Creating microservices too early | Adds distributed-system complexity. | Start with a modular monolith. |
| Mixing domain and database models | Couples business rules to persistence. | Separate them when the distinction matters. |
| Using inheritance unnecessarily | Creates fragile hierarchies. | Prefer composition when appropriate. |
| Building one giant service | Creates a difficult-to-maintain component. | Separate cohesive responsibilities. |
| Exposing database entities directly | Can expose sensitive fields and couple APIs to persistence. | Use response DTOs. |
| Overengineering small applications | Slows development. | Match architecture to complexity. |
| Circular module dependencies | Makes code difficult to reason about. | Redesign module boundaries. |

---

# 36. Interview Questions and Answers

## Basic Questions

**Q1. What is software architecture?**

Software architecture describes the high-level organization of an application, its components, their relationships, and the principles guiding its design.

**Q2. What is monolithic architecture?**

It is an architectural style where an application is developed and deployed as one application unit.

**Q3. What is microservices architecture?**

It divides an application into independently deployable services, each responsible for a specific business capability.

**Q4. What is layered architecture?**

It organizes an application into layers with distinct responsibilities, such as presentation, application, domain, and infrastructure.

**Q5. What is Clean Architecture?**

Clean Architecture organizes code around business rules and keeps those rules independent of external frameworks and infrastructure.

**Q6. What is Hexagonal Architecture?**

Hexagonal Architecture isolates the core application using ports and adapters.

**Q7. What is SOLID?**

SOLID is a collection of five object-oriented design principles that improve maintainability and flexibility.

**Q8. What is SRP?**

The Single Responsibility Principle states that a class should have one cohesive responsibility and one primary reason to change.

**Q9. What is OCP?**

The Open/Closed Principle states that software entities should support extension without requiring unnecessary modifications to existing stable code.

**Q10. What is LSP?**

The Liskov Substitution Principle states that subtypes should preserve the behavioral expectations of their parent abstractions.

## Intermediate Questions

**Q11. What is ISP?**

The Interface Segregation Principle says clients should not depend on methods they do not need.

**Q12. What is DIP?**

The Dependency Inversion Principle says high-level and low-level modules should depend on abstractions rather than directly on each other.

**Q13. What is Dependency Injection?**

Dependency Injection is a technique where dependencies are supplied to a component from outside instead of being created internally.

**Q14. What is Inversion of Control?**

IoC is a broader principle where control is delegated to an external component or framework.

**Q15. What is the difference between DI and IoC?**

DI is one technique for implementing IoC. IoC is the broader concept.

**Q16. What is the Repository Pattern?**

It abstracts data access operations behind an interface or component.

**Q17. What is the Service Layer Pattern?**

It organizes application or business operations into dedicated services.

**Q18. What is the Factory Pattern?**

It centralizes object creation and hides construction details.

**Q19. What is the Singleton Pattern?**

It provides a shared instance through a controlled creation mechanism.

**Q20. What is the Strategy Pattern?**

It allows interchangeable algorithms to be selected through a common interface.

**Q21. What is the Observer Pattern?**

It allows an object to notify multiple subscribers when an event occurs.

**Q22. What is the Adapter Pattern?**

It allows incompatible interfaces to work together.

**Q23. What is the Decorator Pattern?**

It adds behavior to an object through composition without changing the original implementation.

**Q24. What is the Builder Pattern?**

It separates complex object construction from the final object representation.

**Q25. What is the Command Pattern?**

It encapsulates an operation as an object.

## Advanced Questions

**Q26. What is the difference between Clean Architecture and Hexagonal Architecture?**

Clean Architecture emphasizes inward dependency rules and business-centered layers. Hexagonal Architecture emphasizes ports and adapters. Both aim to isolate business logic from external systems.

**Q27. What is a Composition Root?**

It is the central location where application dependencies are constructed and connected.

**Q28. What is a Domain Entity?**

An entity is a domain object with a distinct identity and potentially mutable state.

**Q29. What is a Value Object?**

A value object represents a concept based on its values rather than a unique identity.

**Q30. What is an Aggregate?**

An aggregate is a group of related domain objects treated as a consistency boundary.

**Q31. What is an Aggregate Root?**

It is the primary entity through which an aggregate is accessed and modified.

**Q32. What is a Bounded Context?**

It defines a boundary within which a domain model and its terminology have a specific meaning.

**Q33. What is DDD?**

Domain-Driven Design is an approach that structures software around business domains and their models.

**Q34. What is a DTO?**

A Data Transfer Object represents data transferred across application boundaries.

**Q35. Why should we not expose database entities directly?**

Because doing so can expose sensitive data and tightly couple the API contract to the persistence model.

**Q36. What is the difference between domain and application layers?**

The domain layer contains business rules. The application layer coordinates use cases using those rules.

**Q37. Why is dependency injection useful in testing?**

It allows real dependencies to be replaced with mocks, fakes, or test implementations.

**Q38. What is tight coupling?**

Tight coupling occurs when components depend heavily on specific implementations or internal details of other components.

**Q39. What is loose coupling?**

Loose coupling means components interact through well-defined contracts without depending unnecessarily on implementation details.

**Q40. What is high cohesion?**

High cohesion means the responsibilities within a module are closely related and contribute to one clear purpose.

**Q41. Why is composition often preferred over inheritance?**

Composition allows behavior to be combined flexibly without creating rigid class hierarchies.

**Q42. What is the difference between an Adapter and a Decorator?**

An Adapter changes an interface to make components compatible. A Decorator adds behavior while preserving the interface.

**Q43. What is the difference between a Factory and a Builder?**

A Factory focuses on selecting or creating an object. A Builder focuses on constructing a complex object step by step.

**Q44. What is the difference between an Observer and a message queue?**

An Observer typically provides in-process notifications. A message queue provides asynchronous communication between components or services, often with persistence and delivery guarantees depending on configuration.

**Q45. Should every TypeScript application use Clean Architecture?**

No. Architecture should match the application's complexity. Small applications may benefit more from a simpler modular structure.

**Q46. Why should a monolith be modular?**

Modularity creates clear boundaries, reduces coupling, improves testability, and makes future changes easier.

**Q47. What is a domain service?**

A domain service contains business logic that does not naturally belong to a single entity or value object.

**Q48. What is an application service?**

An application service coordinates use cases and application workflows.

**Q49. What is the purpose of a repository interface in Clean Architecture?**

It defines the persistence operations required by the application without specifying their technical implementation.

**Q50. What is the most important principle of Clean Architecture?**

Business rules should remain independent of external implementation details, with dependencies pointing toward stable inner layers.

---

# 37. Practical Exercises

## Beginner Level

1. Create a simple User class following SRP.
2. Separate database operations from user business logic.
3. Implement a repository interface.
4. Implement constructor-based dependency injection.
5. Create a PaymentProvider interface.
6. Implement Stripe and PayPal payment strategies.
7. Implement a Notification Observer.
8. Create a simple Factory for payment providers.
9. Implement an Adapter for a third-party API.
10. Create a User DTO that excludes sensitive fields.

## Intermediate Level

11. Refactor an Express application using Layered Architecture.
12. Implement SOLID principles in a User Management API.
13. Build a Repository Pattern using MySQL.
14. Implement dependency injection without a DI framework.
15. Create a Singleton database client.
16. Implement the Strategy Pattern for shipping calculations.
17. Implement the Decorator Pattern for logging.
18. Create a Builder for complex order objects.
19. Implement the Command Pattern for background jobs.
20. Separate domain and application layers.

## Advanced Level

21. Build a complete Clean Architecture User Management API.
22. Implement Prisma repositories using interfaces.
23. Create unit tests for all use cases.
24. Create infrastructure integration tests.
25. Implement an event-driven notification system.
26. Build a modular monolith with Users, Products, and Orders modules.
27. Model an e-commerce domain using DDD.
28. Implement Order as an aggregate root.
29. Create a payment gateway abstraction with multiple adapters.
30. Design a production-level application architecture with authentication, authorization, Redis, MySQL, and background jobs.

---

# 38. Phase 52 Completion Checklist

| Topic | Status |
|---|---|
| Software Architecture Fundamentals | ☐ |
| Monolithic Architecture | ☐ |
| Microservices Architecture | ☐ |
| Layered Architecture | ☐ |
| Clean Architecture | ☐ |
| Hexagonal Architecture | ☐ |
| SOLID Principles | ☐ |
| Single Responsibility Principle | ☐ |
| Open/Closed Principle | ☐ |
| Liskov Substitution Principle | ☐ |
| Interface Segregation Principle | ☐ |
| Dependency Inversion Principle | ☐ |
| Dependency Injection | ☐ |
| Inversion of Control | ☐ |
| DI Containers | ☐ |
| Repository Pattern | ☐ |
| Service Layer Pattern | ☐ |
| Factory Pattern | ☐ |
| Singleton Pattern | ☐ |
| Strategy Pattern | ☐ |
| Observer Pattern | ☐ |
| Adapter Pattern | ☐ |
| Decorator Pattern | ☐ |
| Builder Pattern | ☐ |
| Command Pattern | ☐ |
| Middleware Pattern | ☐ |
| Domain-Driven Design | ☐ |
| Entities and Value Objects | ☐ |
| Aggregates and Aggregate Roots | ☐ |
| Bounded Contexts | ☐ |
| DTOs and Data Mapping | ☐ |
| Domain vs Application Layers | ☐ |
| Composition Root | ☐ |
| Scalable Project Structures | ☐ |
| Production Architecture Best Practices | ☐ |

---

# 39. What Comes Next?

You have now covered advanced software architecture, SOLID principles, design patterns, and dependency management.

The next phase will focus on advanced backend API engineering.

## Phase 53: Advanced TypeScript – REST API Architecture, API Versioning, OpenAPI, Swagger, GraphQL, WebSockets and API Security

Upcoming topics:

1. REST API Design Principles.
2. RESTful Resource Modeling.
3. HTTP Methods and Status Codes.
4. API Request and Response Standards.
5. API Versioning.
6. Pagination.
7. Filtering and Sorting.
8. API Search.
9. Request Validation.
10. Response Serialization.
11. Centralized Error Handling.
12. Idempotency.
13. Rate Limiting.
14. API Security.
15. CORS.
16. CSRF.
17. XSS.
18. SQL Injection.
19. API Authentication.
20. API Authorization.
21. OpenAPI Specification.
22. Swagger Documentation.
23. GraphQL Fundamentals.
24. GraphQL Queries and Mutations.
25. GraphQL Resolvers.
26. GraphQL Schema Design.
27. GraphQL Authentication.
28. WebSockets.
29. Socket.IO.
30. Real-Time Applications.
31. Server-Sent Events.
32. API Gateway.
33. Request Lifecycle.
34. API Performance Optimization.
35. Production API Best Practices.

**When you're ready, say: `OK, Phase 53`.**