# Phase 44: Advanced TypeScript – Architecture, Design Patterns, SOLID Principles and Enterprise Application Development

**Level:** Advanced to Expert  
**Prerequisites:** TypeScript fundamentals, OOP, Generics, Modules, Node.js, Express.js, Databases, Testing, Security, Performance and Production Deployment.

---

# 1. Learning Objectives

In this phase, you will learn how to design large, maintainable and scalable TypeScript applications using professional software engineering principles.

Topics covered:

1. Software Architecture Fundamentals.
2. SOLID Principles.
3. Single Responsibility Principle.
4. Open/Closed Principle.
5. Liskov Substitution Principle.
6. Interface Segregation Principle.
7. Dependency Inversion Principle.
8. Clean Architecture.
9. Hexagonal Architecture.
10. Onion Architecture.
11. Domain-Driven Design (DDD).
12. Domain Models and Entities.
13. Value Objects.
14. Aggregates and Aggregate Roots.
15. Domain Services.
16. Application Services.
17. Repository Pattern in Depth.
18. Unit of Work Pattern.
19. Factory and Abstract Factory.
20. Builder Pattern.
21. Strategy Pattern.
22. Observer Pattern.
23. Adapter Pattern.
24. Decorator Pattern.
25. Command Pattern.
26. CQRS.
27. Event-Driven Architecture.
28. Dependency Injection Containers.
29. Modular Monolith Architecture.
30. Microservices Fundamentals.
31. TypeScript Monorepos.
32. Enterprise Project Structure.
33. Real-World Enterprise Application.

---

# PART 1: SOFTWARE ARCHITECTURE FUNDAMENTALS

## 2. What Is Software Architecture?

Software architecture describes the high-level structure of an application.

It defines:

- How components are organized.
- How different modules communicate.
- How responsibilities are distributed.
- How data flows through the application.
- How dependencies are managed.
- How the application can evolve.

Consider a simple Express application.

```text
src/
│
├── controllers/
│
├── routes/
│
├── models/
│
├── middleware/
│
└── server.ts
```

This is a basic project structure.

However, as the application grows, you may need more separation.

For example:

```text
src/
│
├── modules/
│
├── infrastructure/
│
├── shared/
│
├── config/
│
└── server.ts
```

The second structure introduces more architectural boundaries.

### 2.1 Why Is Software Architecture Important?

Suppose you are developing an e-commerce application.

Initially, it contains:

- Authentication.
- Users.
- Products.
- Orders.
- Payments.

Later, you add:

- Inventory.
- Shipping.
- Notifications.
- Coupons.
- Reviews.
- Analytics.

If all business logic is written inside controllers, the application becomes difficult to maintain.

Architecture helps organize complexity.

### 2.2 Characteristics of Good Architecture

| Characteristic | Explanation |
|---|---|
| Maintainability | Easy to modify existing code |
| Scalability | Supports increasing workloads |
| Testability | Components can be tested independently |
| Reusability | Components can be reused |
| Extensibility | New features can be added easily |
| Separation of Concerns | Different responsibilities remain separate |
| Low Coupling | Components have fewer unnecessary dependencies |
| High Cohesion | Related functionality stays together |

### 2.3 Coupling and Cohesion

These are two fundamental software design concepts.

**Coupling:** How strongly one component depends on another.

**Cohesion:** How closely related the responsibilities inside one component are.

Generally, good architecture aims for:

- Low coupling.
- High cohesion.

Example of high coupling:

```typescript
class UserService {

    private mysql = new MySQLDatabase();

    async getUser(id: number) {

        return this.mysql.query(
            `SELECT * FROM users WHERE id = ${id}`
        );

    }

}
```

The service directly depends on a specific database implementation.

Better:

```typescript
interface UserRepository {

    findById(id: number): Promise<User | null>;

}

class UserService {

    constructor(
        private repository: UserRepository
    ) {}

    async getUser(id: number): Promise<User | null> {

        return this.repository.findById(id);

    }

}
```

Now the service depends on an abstraction.

This makes the code easier to test and modify.

---

# PART 2: SOLID PRINCIPLES

## 3. What Are SOLID Principles?

SOLID is a collection of five object-oriented design principles.

They help developers create maintainable and extensible applications.

SOLID stands for:

| Letter | Principle |
|---|---|
| S | Single Responsibility Principle |
| O | Open/Closed Principle |
| L | Liskov Substitution Principle |
| I | Interface Segregation Principle |
| D | Dependency Inversion Principle |

These principles are not strict rules that must be applied mechanically. They are guidelines for reducing unnecessary coupling and improving software design.

---

## 4. Single Responsibility Principle (SRP)

**Definition: A class should have one reason to change.**

This means a class should have one clearly defined responsibility.

### 4.1 Incorrect Implementation

```typescript
class UserService {

    createUser(): void {

        // Create user in database

    }

    sendEmail(): void {

        // Send welcome email

    }

    generatePDF(): void {

        // Generate user PDF

    }

}
```

This class handles:

- User creation.
- Email sending.
- PDF generation.

These are different responsibilities.

Changes to email functionality might require modifying `UserService`.

That violates the intended separation of responsibilities.

### 4.2 Correct Implementation

Create separate classes.

```typescript
class UserRepository {

    createUser(): void {

        // Database operation

    }

}
```

```typescript
class EmailService {

    sendEmail(): void {

        // Email operation

    }

}
```

```typescript
class PDFService {

    generatePDF(): void {

        // PDF generation

    }

}
```

Now each class has a focused responsibility.

### 4.3 Practical Example

Consider an order system.

Incorrect:

```typescript
class OrderService {

    createOrder(): void {}

    calculateTax(): void {}

    sendNotification(): void {}

    generateInvoice(): void {}

    updateInventory(): void {}

}
```

Better separation:

```text
OrderService
    |
    ├── OrderRepository
    ├── TaxService
    ├── NotificationService
    ├── InvoiceService
    └── InventoryService
```

The order service can coordinate the workflow while the other components own their respective responsibilities.

### When Should You Apply SRP?

Apply SRP when:

- A class handles unrelated responsibilities.
- A class becomes difficult to test.
- Changes in one feature repeatedly break another feature.
- A class becomes excessively large.

**Important:** SRP does not mean every method needs its own class. Excessive splitting can create unnecessary complexity.

---

## 5. Open/Closed Principle (OCP)

**Definition: Software entities should be open for extension but closed for modification.**

This means you should be able to introduce new behavior without repeatedly modifying stable existing code.

### 5.1 Incorrect Implementation

Suppose you support multiple payment methods.

```typescript
class PaymentService {

    processPayment(
        type: string,
        amount: number
    ): void {

        if (type === "card") {

            console.log("Processing card payment");

        } else if (type === "upi") {

            console.log("Processing UPI payment");

        } else if (type === "paypal") {

            console.log("Processing PayPal payment");

        }

    }

}
```

Every time you introduce a new payment method, you modify this class.

### 5.2 Correct Implementation

Define an abstraction:

```typescript
interface PaymentMethod {

    pay(amount: number): void;

}
```

Implement different payment methods:

```typescript
class CardPayment implements PaymentMethod {

    pay(amount: number): void {

        console.log(`Card payment: ${amount}`);

    }

}
```

```typescript
class UpiPayment implements PaymentMethod {

    pay(amount: number): void {

        console.log(`UPI payment: ${amount}`);

    }

}
```

```typescript
class PayPalPayment implements PaymentMethod {

    pay(amount: number): void {

        console.log(`PayPal payment: ${amount}`);

    }

}
```

Payment service:

```typescript
class PaymentService {

    processPayment(
        paymentMethod: PaymentMethod,
        amount: number
    ): void {

        paymentMethod.pay(amount);

    }

}
```

Usage:

```typescript
const paymentService = new PaymentService();

paymentService.processPayment(
    new CardPayment(),
    1000
);

paymentService.processPayment(
    new UpiPayment(),
    2000
);
```

Now you can add a new payment method by implementing `PaymentMethod`.

The existing service does not need to know the details of every payment provider.

### Benefits

- Easier extension.
- Less conditional logic.
- Better testability.
- Reduced risk of modifying stable code.

---

## 6. Liskov Substitution Principle (LSP)

**Definition: Objects of a subtype should be usable wherever objects of their base type are expected without breaking correctness.**

In simple terms:

A child class should correctly follow the behavior expected from its parent abstraction.

### 6.1 Incorrect Implementation

Consider:

```typescript
class Bird {

    fly(): void {

        console.log("Flying");

    }

}
```

Now create a penguin:

```typescript
class Penguin extends Bird {

    fly(): void {

        throw new Error("Penguins cannot fly");

    }

}
```

Problem:

A function expecting a `Bird` might call `fly()`.

```typescript
function makeBirdFly(bird: Bird): void {

    bird.fly();

}
```

Passing a penguin causes an unexpected error.

The inheritance relationship is inappropriate.

### 6.2 Correct Implementation

Separate capabilities into interfaces.

```typescript
interface Bird {

    eat(): void;

}

interface FlyingBird extends Bird {

    fly(): void;

}

interface SwimmingBird extends Bird {

    swim(): void;

}
```

Implement:

```typescript
class Eagle implements FlyingBird {

    eat(): void {
        console.log("Eagle eating");
    }

    fly(): void {
        console.log("Eagle flying");
    }

}
```

```typescript
class Penguin implements SwimmingBird {

    eat(): void {
        console.log("Penguin eating");
    }

    swim(): void {
        console.log("Penguin swimming");
    }

}
```

Now the abstractions represent actual capabilities.

### Important LSP Rules

A subtype should not:

- Break expected parent behavior.
- Require stronger preconditions.
- Provide weaker postconditions.
- Violate important behavioral guarantees.

LSP is about behavioral compatibility, not just matching method signatures.

---

## 7. Interface Segregation Principle (ISP)

**Definition: Clients should not be forced to depend on interfaces they do not use.**

In simple terms:

Prefer smaller, focused interfaces over large interfaces containing unrelated methods.

### 7.1 Incorrect Implementation

```typescript
interface Machine {

    print(): void;

    scan(): void;

    fax(): void;

}
```

Now consider a basic printer:

```typescript
class BasicPrinter implements Machine {

    print(): void {

        console.log("Printing");

    }

    scan(): void {

        throw new Error("Not supported");

    }

    fax(): void {

        throw new Error("Not supported");

    }

}
```

The class is forced to implement functionality it does not support.

### 7.2 Correct Implementation

Create smaller interfaces:

```typescript
interface Printer {

    print(): void;

}
```

```typescript
interface Scanner {

    scan(): void;

}
```

```typescript
interface FaxMachine {

    fax(): void;

}
```

Basic printer:

```typescript
class BasicPrinter implements Printer {

    print(): void {

        console.log("Printing");

    }

}
```

Advanced machine:

```typescript
class MultiFunctionPrinter implements
    Printer,
    Scanner,
    FaxMachine {

    print(): void {
        console.log("Printing");
    }

    scan(): void {
        console.log("Scanning");
    }

    fax(): void {
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

## 8. Dependency Inversion Principle (DIP)

**Definition: High-level modules should not depend directly on low-level modules. Both should depend on abstractions.**

This principle is closely related to dependency injection, but they are not the same thing.

Consider:

```typescript
class MySQLDatabase {

    save(data: string): void {

        console.log("Saving to MySQL");

    }

}
```

```typescript
class UserService {

    private database = new MySQLDatabase();

    saveUser(): void {

        this.database.save("John");

    }

}
```

`UserService` directly depends on `MySQLDatabase`.

If you switch to MongoDB, you need to modify the service.

### 8.1 Apply Dependency Inversion

Create an abstraction:

```typescript
interface Database {

    save(data: string): void;

}
```

Implement MySQL:

```typescript
class MySQLDatabase implements Database {

    save(data: string): void {

        console.log("Saving to MySQL");

    }

}
```

Implement MongoDB:

```typescript
class MongoDatabase implements Database {

    save(data: string): void {

        console.log("Saving to MongoDB");

    }

}
```

Update service:

```typescript
class UserService {

    constructor(
        private database: Database
    ) {}

    saveUser(): void {

        this.database.save("John");

    }

}
```

Usage:

```typescript
const mysql = new MySQLDatabase();

const userService = new UserService(mysql);

userService.saveUser();
```

You can replace MySQL with MongoDB without modifying `UserService`.

### DIP vs Dependency Injection

| Dependency Inversion | Dependency Injection |
|---|---|
| Design principle | Implementation technique |
| Focuses on abstractions | Focuses on supplying dependencies |
| Reduces direct coupling | Makes dependencies replaceable |
| Architectural concept | Object construction strategy |

---

## 9. SOLID Principles Summary

| Principle | Main Idea | Main Benefit |
|---|---|---|
| SRP | One responsibility per class/module | Easier maintenance |
| OCP | Extend behavior without modifying stable code | Extensibility |
| LSP | Subtypes preserve expected behavior | Correct inheritance |
| ISP | Small, focused interfaces | Reduced coupling |
| DIP | Depend on abstractions | Flexibility |

### Real-World Example

In an e-commerce system:

```text
OrderService
    |
    ├── OrderRepository Interface
    ├── PaymentGateway Interface
    ├── NotificationService Interface
    └── InventoryRepository Interface
```

Concrete implementations are supplied separately.

This design makes the application easier to test and extend.

---

# PART 3: CLEAN ARCHITECTURE

## 10. What Is Clean Architecture?

Clean Architecture is an architectural approach that organizes software into layers and protects business logic from external implementation details.

The central idea:

**Business rules should not depend directly on databases, web frameworks or external services.**

A common representation is:

```text
        -----------------------
        |   Frameworks &      |
        |    Drivers          |
        |---------------------|
        |   Interface         |
        |   Adapters          |
        |---------------------|
        |   Application       |
        |   Business Rules    |
        |---------------------|
        |   Enterprise        |
        |   Business Rules    |
        -----------------------
```

The innermost layers contain the most important business logic.

Outer layers handle technical details.

---

## 11. Clean Architecture Layers

### 11.1 Entities

Entities represent important business concepts and rules.

Example:

```typescript
class User {

    constructor(
        public readonly id: number,
        public name: string,
        public email: string
    ) {}

}
```

### 11.2 Use Cases

Use cases represent application operations.

Examples:

- Create User.
- Delete User.
- Place Order.
- Process Payment.
- Cancel Order.

Example:

```typescript
interface UserRepository {

    save(user: User): Promise<void>;

}

class CreateUserUseCase {

    constructor(
        private repository: UserRepository
    ) {}

    async execute(user: User): Promise<void> {

        await this.repository.save(user);

    }

}
```

### 11.3 Interface Adapters

These convert external data into the format expected by application layers.

Examples:

- Controllers.
- Presenters.
- Repository implementations.
- Request/response mappers.

### 11.4 Frameworks and Drivers

These are external technical tools.

Examples:

- Express.
- MySQL.
- MongoDB.
- Redis.
- Payment gateways.
- File systems.

---

## 12. Dependency Rule

The dependency rule is one of the most important Clean Architecture concepts.

Dependencies should point inward.

```text
Express Controller
       |
       v
CreateUserUseCase
       |
       v
UserRepository Interface
       ^
       |
MySQLUserRepository
```

The use case defines what it needs.

The infrastructure implementation provides it.

The use case does not need to know whether the repository uses MySQL, MongoDB or another storage system.

### Incorrect Dependency

```typescript
class CreateUserUseCase {

    private repository = new MySQLUserRepository();

}
```

The use case directly depends on infrastructure.

### Better Dependency

```typescript
class CreateUserUseCase {

    constructor(
        private repository: UserRepository
    ) {}

}
```

Now the use case depends on an abstraction.

---

## 13. Clean Architecture Project Structure

Example:

```text
src/
│
├── domain/
│   │
│   ├── entities/
│   │   └── User.ts
│   │
│   ├── repositories/
│   │   └── UserRepository.ts
│   │
│   └── errors/
│       └── DomainError.ts
│
├── application/
│   │
│   └── use-cases/
│       └── CreateUser.ts
│
├── infrastructure/
│   │
│   ├── database/
│   │   └── MySQLUserRepository.ts
│   │
│   └── services/
│       └── EmailService.ts
│
├── presentation/
│   │
│   ├── controllers/
│   │   └── UserController.ts
│   │
│   └── routes/
│       └── UserRoutes.ts
│
└── main.ts
```

### Benefits

- Business logic is independent of frameworks.
- Database implementations can be replaced.
- Easier unit testing.
- Better separation of concerns.
- Easier maintenance.

### Important

Clean Architecture is not about creating as many folders and interfaces as possible.

The goal is to protect important business logic from unnecessary external dependencies.

---

# PART 4: HEXAGONAL ARCHITECTURE

## 14. What Is Hexagonal Architecture?

Hexagonal Architecture is also known as Ports and Adapters Architecture.

It was introduced by Alistair Cockburn.

The idea is to keep business logic independent of external systems.

External systems communicate with the application through defined interfaces called ports.

Adapters connect those interfaces to real technologies.

### Architecture

```text
             HTTP API
                |
             Adapter
                |
                v
        -----------------
        |               |
        |  Application  |
        |     Core      |
        |               |
        -----------------
           ^        ^
           |        |
        Adapter   Adapter
           |        |
        MySQL     Payment API
```

### 14.1 What Are Ports?

Ports are interfaces that define how the application communicates with external systems.

Example:

```typescript
interface PaymentPort {

    processPayment(
        amount: number
    ): Promise<boolean>;

}
```

### 14.2 What Are Adapters?

Adapters implement ports or translate external communication into application operations.

```typescript
class StripePaymentAdapter implements PaymentPort {

    async processPayment(
        amount: number
    ): Promise<boolean> {

        console.log("Processing Stripe payment:", amount);

        return true;

    }

}
```

Another adapter:

```typescript
class MockPaymentAdapter implements PaymentPort {

    async processPayment(
        amount: number
    ): Promise<boolean> {

        console.log("Mock payment:", amount);

        return true;

    }

}
```

Application service:

```typescript
class OrderService {

    constructor(
        private payment: PaymentPort
    ) {}

    async placeOrder(amount: number): Promise<void> {

        const result = await this.payment.processPayment(amount);

        if (!result) {
            throw new Error("Payment failed");
        }

        console.log("Order placed");

    }

}
```

### 14.3 Primary and Secondary Adapters

**Primary adapters (driving adapters):**

They initiate operations.

Examples:

- REST controllers.
- GraphQL resolvers.
- CLI commands.
- Message consumers.

**Secondary adapters (driven adapters):**

They are used by the application.

Examples:

- Database repositories.
- Email providers.
- Payment gateways.
- External APIs.

### Benefits

- Easy replacement of external services.
- Independent business logic.
- Better testability.
- Flexible integration architecture.

---

# PART 5: ONION ARCHITECTURE

## 15. What Is Onion Architecture?

Onion Architecture is an approach that organizes application code into concentric layers.

The domain model is placed at the center.

External dependencies remain toward the outside.

### Architecture

```text
          -----------------------
          | Infrastructure       |
          |----------------------|
          | Application Services |
          |----------------------|
          | Domain Services      |
          |----------------------|
          | Domain Models        |
          -----------------------
```

### Layers

**1. Domain Model**

Contains:

- Entities.
- Value objects.
- Domain rules.

**2. Domain Services**

Contains business operations that do not naturally belong to one entity.

**3. Application Services**

Coordinates use cases and workflows.

**4. Infrastructure**

Contains:

- Database implementations.
- External APIs.
- Message brokers.
- File storage.

### Main Principle

Dependencies point toward the domain.

The domain should not depend on infrastructure.

---

## 16. Clean vs Hexagonal vs Onion Architecture

| Feature | Clean Architecture | Hexagonal Architecture | Onion Architecture |
|---|---|---|---|
| Main Focus | Layer separation | Ports and adapters | Domain-centered layers |
| Core | Business rules | Application core | Domain model |
| External Systems | Outer layers | Adapters | Outer layers |
| Dependency Direction | Inward | Toward core | Inward |
| Main Benefit | Framework independence | External integration flexibility | Domain independence |

These architectures share many ideas.

They are not mutually exclusive. Real applications often combine concepts from all three.

---

# PART 6: DOMAIN-DRIVEN DESIGN (DDD)

## 17. What Is Domain-Driven Design?

Domain-Driven Design (DDD) is a software design approach that focuses on modeling complex business domains.

The central idea:

**Software architecture should reflect the business domain and its rules.**

Consider an e-commerce application.

Its domain includes:

- Customers.
- Products.
- Orders.
- Payments.
- Inventory.
- Shipping.
- Discounts.

These concepts have business rules.

For example:

- An order cannot be placed without valid items.
- A cancelled order should not be shipped.
- A product cannot be purchased if insufficient inventory exists.
- A payment must be authorized before certain order transitions.

DDD helps organize these rules in the domain model.

---

## 18. Understanding Domain Language

DDD encourages using the same terminology as business stakeholders.

Suppose your business uses these terms:

- Customer.
- Cart.
- Order.
- Shipment.
- Refund.

Your code should use meaningful names.

Good:

```typescript
class OrderService {

    placeOrder(): void {}

    cancelOrder(): void {}

    refundOrder(): void {}

}
```

Less meaningful:

```typescript
class DataService {

    process(): void {}

    update(): void {}

    handle(): void {}

}
```

### What Is Ubiquitous Language?

Ubiquitous Language is a shared vocabulary used by:

- Developers.
- Business analysts.
- Domain experts.
- Product owners.

The same terms should appear consistently in conversations, documentation and code.

---

## 19. Bounded Context

A Bounded Context is an explicit boundary within which a particular domain model and its terminology apply.

Suppose an e-commerce platform has:

```text
E-Commerce Platform
│
├── Sales Context
│   ├── Cart
│   ├── Order
│   └── Discount
│
├── Inventory Context
│   ├── Stock
│   ├── Warehouse
│   └── Reservation
│
├── Payment Context
│   ├── Payment
│   ├── Refund
│   └── Transaction
│
└── Shipping Context
    ├── Shipment
    ├── Delivery
    └── Tracking
```

The word `Product` might have different representations in different contexts.

For example:

**Sales Context:**

```typescript
interface Product {
    id: number;
    name: string;
    price: number;
}
```

**Inventory Context:**

```typescript
interface ProductStock {
    productId: number;
    availableQuantity: number;
    warehouseId: number;
}
```

Both relate to the same real-world product but serve different business purposes.

### Why Bounded Contexts Matter

- Reduce complexity.
- Prevent large models from becoming overloaded.
- Clarify ownership.
- Support independent development.
- Help define module or service boundaries.

---

# PART 7: DOMAIN MODELS AND ENTITIES

## 20. What Is a Domain Model?

A domain model represents business concepts, relationships and rules in code.

Example:

```typescript
class Order {

    constructor(
        public readonly id: number,
        public status: string,
        public total: number
    ) {}

    cancel(): void {

        if (this.status === "shipped") {

            throw new Error(
                "Shipped orders cannot be cancelled"
            );

        }

        this.status = "cancelled";

    }

}
```

The order contains a business rule.

This is preferable to scattering order cancellation logic across unrelated controllers.

---

## 21. What Is an Entity?

An entity is an object defined primarily by its identity.

Two entities may have the same attributes but still represent different objects because their identities differ.

Example:

```typescript
class User {

    constructor(
        public readonly id: number,
        public name: string,
        public email: string
    ) {}

}
```

Consider:

```typescript
const user1 = new User(
    1,
    "John",
    "john@example.com"
);

const user2 = new User(
    2,
    "John",
    "john@example.com"
);
```

These users have identical names and email addresses but different identities.

Their IDs distinguish them.

### Entity Characteristics

- Has identity.
- May change state.
- Has a lifecycle.
- Represents a business concept.

Examples:

- User.
- Order.
- Product.
- Employee.
- Invoice.

---

# PART 8: VALUE OBJECTS

## 22. What Is a Value Object?

A Value Object is an object defined by its values rather than its identity.

Two value objects are considered equivalent when their relevant values are equal.

Examples:

- Money.
- Email Address.
- Address.
- Date Range.
- Percentage.

### 22.1 Entity vs Value Object

| Entity | Value Object |
|---|---|
| Has identity | No independent identity |
| Can change state | Usually immutable |
| Equality based on identity | Equality based on values |
| Example: User | Example: Email Address |
| Example: Order | Example: Money |

### 22.2 Money Value Object

```typescript
class Money {

    constructor(
        public readonly amount: number,
        public readonly currency: string
    ) {

        if (!Number.isFinite(amount)) {
            throw new Error("Invalid amount");
        }

        if (!currency) {
            throw new Error("Currency is required");
        }

    }

    add(other: Money): Money {

        if (this.currency !== other.currency) {

            throw new Error("Currency mismatch");

        }

        return new Money(
            this.amount + other.amount,
            this.currency
        );

    }

}
```

Usage:

```typescript
const price1 = new Money(100, "INR");

const price2 = new Money(200, "INR");

const total = price1.add(price2);

console.log(total);
```

Output:

```text
Money {
    amount: 300,
    currency: 'INR'
}
```

### 22.3 Email Value Object

```typescript
class EmailAddress {

    private constructor(
        public readonly value: string
    ) {}

    static create(value: string): EmailAddress {

        const normalized = value.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {

            throw new Error("Invalid email address");

        }

        return new EmailAddress(normalized);

    }

}
```

Usage:

```typescript
const email = EmailAddress.create(
    "JOHN@EXAMPLE.COM"
);

console.log(email.value);
```

Output:

```text
john@example.com
```

### Why Use Value Objects?

- Encapsulate validation.
- Prevent invalid values.
- Improve domain clarity.
- Encourage immutability.
- Centralize business rules.

For financial applications, use appropriate decimal arithmetic rather than relying on ordinary floating-point calculations for currency.

---

# PART 9: AGGREGATES AND AGGREGATE ROOTS

## 23. What Is an Aggregate?

An Aggregate is a group of related domain objects treated as a consistency boundary.

It contains an Aggregate Root that controls access to the objects inside it.

Example:

```text
Order Aggregate
│
├── Order (Aggregate Root)
│
├── OrderItem
│
└── ShippingAddress
```

The `Order` is the Aggregate Root.

External code should use the root to modify protected aggregate state.

### 23.1 Order Item

```typescript
class OrderItem {

    constructor(
        public readonly productId: number,
        public readonly price: Money,
        public readonly quantity: number
    ) {

        if (!Number.isInteger(quantity) || quantity <= 0) {

            throw new Error("Invalid quantity");

        }

    }

    getSubtotal(): Money {

        return new Money(
            this.price.amount * this.quantity,
            this.price.currency
        );

    }

}
```

### 23.2 Order Aggregate Root

```typescript
type OrderStatus =
    | "pending"
    | "confirmed"
    | "cancelled";

class Order {

    private items: OrderItem[] = [];

    private status: OrderStatus = "pending";

    constructor(
        public readonly id: number
    ) {}

    addItem(item: OrderItem): void {

        if (this.status !== "pending") {

            throw new Error(
                "Cannot modify a non-pending order"
            );

        }

        this.items.push(item);

    }

    cancel(): void {

        if (this.status === "confirmed") {

            throw new Error(
                "Confirmed order cannot be cancelled through this operation"
            );

        }

        this.status = "cancelled";

    }

    getItems(): readonly OrderItem[] {

        return [...this.items];

    }

    getStatus(): OrderStatus {

        return this.status;

    }

}
```

### Why Use Aggregate Roots?

The aggregate root:

- Protects internal consistency.
- Enforces business rules.
- Controls changes to child objects.
- Defines a transaction boundary in many DDD designs.

**Important:** Aggregate boundaries should be designed around consistency requirements, not simply around database tables.

---

# PART 10: DOMAIN SERVICES

## 24. What Is a Domain Service?

A Domain Service contains business logic that does not naturally belong to one particular entity or value object.

Example:

Suppose you need to calculate shipping costs using:

- Order weight.
- Destination.
- Shipping method.

This operation may not naturally belong to `Order` or `Product`.

You can create a domain service.

```typescript
interface ShippingDetails {

    weight: number;

    distance: number;

    shippingType: "standard" | "express";

}

class ShippingCostService {

    calculate(
        details: ShippingDetails
    ): number {

        const baseCost = details.weight * 10;

        const distanceCost = details.distance * 2;

        const expressCost =
            details.shippingType === "express"
                ? 100
                : 0;

        return baseCost + distanceCost + expressCost;

    }

}
```

Usage:

```typescript
const shippingService = new ShippingCostService();

const cost = shippingService.calculate({

    weight: 5,

    distance: 20,

    shippingType: "express"

});

console.log(cost);
```

### When Should You Use Domain Services?

Use them when:

- Business logic spans multiple domain objects.
- Logic does not naturally belong to one entity.
- A domain operation needs multiple domain concepts.

Do not put every business operation inside a service. Keep behavior inside entities when it naturally belongs there.

---

# PART 11: APPLICATION SERVICES

## 25. What Is an Application Service?

An Application Service coordinates a use case.

It controls the workflow but should not become the place where all business rules live.

Example:

```typescript
interface OrderRepository {

    save(order: Order): Promise<void>;

}

interface PaymentGateway {

    charge(amount: Money): Promise<boolean>;

}
```

Application service:

```typescript
class PlaceOrderService {

    constructor(
        private orderRepository: OrderRepository,
        private paymentGateway: PaymentGateway
    ) {}

    async execute(order: Order): Promise<void> {

        const paymentSuccessful =
            await this.paymentGateway.charge(
                new Money(1000, "INR")
            );

        if (!paymentSuccessful) {

            throw new Error("Payment failed");

        }

        await this.orderRepository.save(order);

    }

}
```

This is an illustrative workflow.

A real payment/order implementation must account for transaction boundaries, payment idempotency, failure recovery and distributed consistency.

### Domain Service vs Application Service

| Domain Service | Application Service |
|---|---|
| Contains domain business logic | Coordinates use cases |
| Belongs to domain model | Belongs to application layer |
| Works with domain concepts | Coordinates repositories and external ports |
| Independent of web framework | Independent of web framework |

---

# PART 12: REPOSITORY PATTERN IN DEPTH

## 26. What Is the Repository Pattern?

The Repository Pattern abstracts data access behind an interface.

It allows business logic to work with domain objects without depending on a particular database.

### 26.1 Define Repository Interface

```typescript
interface UserRepository {

    findById(id: number): Promise<User | null>;

    findAll(): Promise<User[]>;

    save(user: User): Promise<void>;

    delete(id: number): Promise<void>;

}
```

### 26.2 MySQL Implementation

```typescript
class MySQLUserRepository implements UserRepository {

    async findById(id: number): Promise<User | null> {

        // Execute MySQL query

        throw new Error("Implementation pending");

    }

    async findAll(): Promise<User[]> {

        // Fetch users from MySQL

        throw new Error("Implementation pending");

    }

    async save(user: User): Promise<void> {

        // Save user to MySQL

    }

    async delete(id: number): Promise<void> {

        // Delete user from MySQL

    }

}
```

### 26.3 MongoDB Implementation

```typescript
class MongoUserRepository implements UserRepository {

    async findById(id: number): Promise<User | null> {

        // Fetch from MongoDB

        throw new Error("Implementation pending");

    }

    async findAll(): Promise<User[]> {

        // Fetch users from MongoDB

        throw new Error("Implementation pending");

    }

    async save(user: User): Promise<void> {

        // Save to MongoDB

    }

    async delete(id: number): Promise<void> {

        // Delete from MongoDB

    }

}
```

### 26.4 Use Repository in Service

```typescript
class UserService {

    constructor(
        private repository: UserRepository
    ) {}

    async getUser(id: number): Promise<User | null> {

        return this.repository.findById(id);

    }

}
```

### Benefits

- Database independence.
- Better unit testing.
- Centralized data access.
- Easier implementation replacement.

### Important Architectural Consideration

Do not create repositories for every table automatically.

A repository should represent a meaningful collection or aggregate from the domain perspective.

Also, avoid exposing database-specific query objects throughout your domain and application layers.

---

# PART 13: UNIT OF WORK PATTERN

## 27. What Is the Unit of Work Pattern?

The Unit of Work Pattern coordinates multiple related database changes as one logical operation.

It helps maintain consistency when several repositories participate in one transaction.

Consider placing an order.

You need to:

1. Create an order.
2. Reduce inventory.
3. Create a payment record.

If one operation fails, the related database changes may need to be rolled back.

### 27.1 Without Unit of Work

```typescript
await orderRepository.save(order);

await inventoryRepository.reduceStock(
    productId,
    quantity
);

await paymentRepository.save(payment);
```

If payment saving fails, earlier changes may already have been committed.

### 27.2 Define Unit of Work

```typescript
interface UnitOfWork {

    begin(): Promise<void>;

    commit(): Promise<void>;

    rollback(): Promise<void>;

}
```

### 27.3 Use It

```typescript
class PlaceOrderService {

    constructor(
        private unitOfWork: UnitOfWork,
        private orderRepository: OrderRepository,
        private inventoryRepository: InventoryRepository,
        private paymentRepository: PaymentRepository
    ) {}

    async execute(): Promise<void> {

        await this.unitOfWork.begin();

        try {

            // Create order
            // Update inventory
            // Save payment

            await this.unitOfWork.commit();

        } catch (error) {

            await this.unitOfWork.rollback();

            throw error;

        }

    }

}
```

This demonstrates the concept.

A real implementation must ensure all participating repositories use the same transaction or database session.

### Benefits

- Consistent transactions.
- Coordinated repository operations.
- Rollback support.
- Better separation of transaction management.

**Important:** A database transaction cannot automatically guarantee atomicity across independent databases or external payment providers. Distributed workflows require additional patterns such as sagas and compensating actions.

---

# PART 14: DESIGN PATTERNS

## 28. What Are Design Patterns?

Design patterns are reusable solutions to common software design problems.

They are not ready-made code templates.

They are approaches that can be adapted to your application.

We will cover six important patterns in this phase.

---

## 29. Factory Pattern

The Factory Pattern centralizes object creation.

Suppose your application supports different notification types.

```typescript
interface Notification {

    send(message: string): void;

}
```

Implementations:

```typescript
class EmailNotification implements Notification {

    send(message: string): void {

        console.log("Email:", message);

    }

}
```

```typescript
class SMSNotification implements Notification {

    send(message: string): void {

        console.log("SMS:", message);

    }

}
```

Factory:

```typescript
class NotificationFactory {

    static create(
        type: "email" | "sms"
    ): Notification {

        switch (type) {

            case "email":
                return new EmailNotification();

            case "sms":
                return new SMSNotification();

        }

    }

}
```

Usage:

```typescript
const notification = NotificationFactory.create("email");

notification.send("Welcome!");
```

### When to Use?

- Multiple implementation types.
- Complex object creation.
- Centralized construction logic.
- Runtime selection of implementations.

---

## 30. Abstract Factory Pattern

Abstract Factory provides an interface for creating families of related objects.

Suppose you support two payment providers.

Each provider requires:

- Payment processor.
- Refund processor.

### Define Interfaces

```typescript
interface PaymentProcessor {

    pay(amount: number): void;

}

interface RefundProcessor {

    refund(amount: number): void;

}
```

### Provider A

```typescript
class ProviderAPayment implements PaymentProcessor {

    pay(amount: number): void {

        console.log("Provider A payment:", amount);

    }

}
```

```typescript
class ProviderARefund implements RefundProcessor {

    refund(amount: number): void {

        console.log("Provider A refund:", amount);

    }

}
```

### Provider B

```typescript
class ProviderBPayment implements PaymentProcessor {

    pay(amount: number): void {

        console.log("Provider B payment:", amount);

    }

}
```

```typescript
class ProviderBRefund implements RefundProcessor {

    refund(amount: number): void {

        console.log("Provider B refund:", amount);

    }

}
```

### Abstract Factory

```typescript
interface PaymentFactory {

    createPayment(): PaymentProcessor;

    createRefund(): RefundProcessor;

}
```

### Concrete Factories

```typescript
class ProviderAFactory implements PaymentFactory {

    createPayment(): PaymentProcessor {

        return new ProviderAPayment();

    }

    createRefund(): RefundProcessor {

        return new ProviderARefund();

    }

}
```

```typescript
class ProviderBFactory implements PaymentFactory {

    createPayment(): PaymentProcessor {

        return new ProviderBPayment();

    }

    createRefund(): RefundProcessor {

        return new ProviderBRefund();

    }

}
```

The client can select a provider without knowing how its individual objects are created.

### Factory vs Abstract Factory

| Factory | Abstract Factory |
|---|---|
| Creates an object | Creates related families of objects |
| Usually simpler | More extensive abstraction |
| Example: Notification Factory | Example: Payment Provider Factory |

---

## 31. Builder Pattern

The Builder Pattern constructs complex objects step by step.

Consider an order object with many optional properties.

```typescript
interface OrderData {

    customerId: number;

    items: string[];

    coupon?: string;

    shippingAddress?: string;

    notes?: string;

}
```

Builder:

```typescript
class OrderBuilder {

    private data: Partial<OrderData> = {
        items: []
    };

    setCustomer(customerId: number): this {

        this.data.customerId = customerId;

        return this;

    }

    addItem(item: string): this {

        this.data.items ??= [];

        this.data.items.push(item);

        return this;

    }

    setCoupon(coupon: string): this {

        this.data.coupon = coupon;

        return this;

    }

    setShippingAddress(address: string): this {

        this.data.shippingAddress = address;

        return this;

    }

    setNotes(notes: string): this {

        this.data.notes = notes;

        return this;

    }

    build(): OrderData {

        if (this.data.customerId === undefined) {

            throw new Error("Customer ID is required");

        }

        return {
            customerId: this.data.customerId,
            items: [...(this.data.items ?? [])],
            coupon: this.data.coupon,
            shippingAddress: this.data.shippingAddress,
            notes: this.data.notes
        };

    }

}
```

Usage:

```typescript
const order = new OrderBuilder()
    .setCustomer(101)
    .addItem("Laptop")
    .addItem("Mouse")
    .setCoupon("SAVE10")
    .setShippingAddress("Ahmedabad")
    .build();

console.log(order);
```

### When to Use?

- Complex objects.
- Many optional parameters.
- Step-by-step object construction.
- Multiple object configurations.

---

## 32. Strategy Pattern

The Strategy Pattern allows you to select different algorithms without changing the client.

Example: Discount calculation.

```typescript
interface DiscountStrategy {

    calculate(price: number): number;

}
```

Implementations:

```typescript
class NoDiscount implements DiscountStrategy {

    calculate(price: number): number {

        return price;

    }

}
```

```typescript
class FestivalDiscount implements DiscountStrategy {

    calculate(price: number): number {

        return price * 0.80;

    }

}
```

```typescript
class PremiumDiscount implements DiscountStrategy {

    calculate(price: number): number {

        return price * 0.90;

    }

}
```

Service:

```typescript
class PricingService {

    constructor(
        private strategy: DiscountStrategy
    ) {}

    calculateFinalPrice(price: number): number {

        return this.strategy.calculate(price);

    }

}
```

Usage:

```typescript
const pricing = new PricingService(
    new FestivalDiscount()
);

console.log(
    pricing.calculateFinalPrice(1000)
);
```

Output:

```text
800
```

### When to Use?

- Multiple algorithms.
- Different pricing strategies.
- Different payment methods.
- Multiple shipping methods.
- Different authentication strategies.

---

## 33. Observer Pattern

The Observer Pattern allows multiple objects to subscribe to events.

When an event occurs, subscribers receive notifications.

Example:

When an order is created:

- Email notification is sent.
- Inventory is updated.
- Analytics are recorded.

### Implementation

```typescript
type OrderListener = (orderId: number) => void;

class OrderEvent {

    private listeners: OrderListener[] = [];

    subscribe(listener: OrderListener): void {

        this.listeners.push(listener);

    }

    unsubscribe(listener: OrderListener): void {

        this.listeners = this.listeners.filter(
            item => item !== listener
        );

    }

    notify(orderId: number): void {

        for (const listener of this.listeners) {

            listener(orderId);

        }

    }

}
```

Usage:

```typescript
const orderEvent = new OrderEvent();

const sendEmail = (id: number): void => {

    console.log("Email sent for order:", id);

};

const updateInventory = (id: number): void => {

    console.log("Inventory updated for order:", id);

};

orderEvent.subscribe(sendEmail);

orderEvent.subscribe(updateInventory);

orderEvent.notify(101);
```

Output:

```text
Email sent for order: 101
Inventory updated for order: 101
```

### Observer vs Event-Driven Architecture

Observer is a design pattern that describes how objects notify subscribers.

Event-driven architecture is a broader architectural approach that uses events to coordinate components or services.

---

## 34. Adapter Pattern

The Adapter Pattern allows two incompatible interfaces to work together.

Suppose your application expects:

```typescript
interface PaymentGateway {

    processPayment(amount: number): Promise<boolean>;

}
```

But an external provider has:

```typescript
class ExternalPaymentProvider {

    async makeTransaction(
        amountInPaise: number
    ): Promise<string> {

        console.log("Payment:", amountInPaise);

        return "SUCCESS";

    }

}
```

Create an adapter:

```typescript
class PaymentAdapter implements PaymentGateway {

    constructor(
        private provider: ExternalPaymentProvider
    ) {}

    async processPayment(
        amount: number
    ): Promise<boolean> {

        const amountInPaise = Math.round(amount * 100);

        const result = await this.provider.makeTransaction(
            amountInPaise
        );

        return result === "SUCCESS";

    }

}
```

Usage:

```typescript
const provider = new ExternalPaymentProvider();

const adapter = new PaymentAdapter(provider);

const result = await adapter.processPayment(100);

console.log(result);
```

### When to Use?

- Integrating external APIs.
- Replacing third-party libraries.
- Connecting legacy systems.
- Translating incompatible data structures.

---

## 35. Decorator Pattern

The Decorator Pattern adds functionality to an existing object without changing its original implementation.

Example:

```typescript
interface NotificationService {

    send(message: string): void;

}
```

Basic implementation:

```typescript
class EmailService implements NotificationService {

    send(message: string): void {

        console.log("Email sent:", message);

    }

}
```

Decorator:

```typescript
class LoggingNotificationDecorator
    implements NotificationService {

    constructor(
        private service: NotificationService
    ) {}

    send(message: string): void {

        console.log("Logging notification");

        this.service.send(message);

    }

}
```

Usage:

```typescript
const email = new EmailService();

const decoratedEmail =
    new LoggingNotificationDecorator(email);

decoratedEmail.send("Welcome");
```

Output:

```text
Logging notification
Email sent: Welcome
```

### When to Use?

- Logging.
- Caching.
- Authorization checks.
- Metrics collection.
- Adding behavior without modifying the original component.

**Important:** The Decorator design pattern is different from TypeScript's experimental or framework-specific decorator syntax. They are related concepts but not the same thing.

---

## 36. Command Pattern

The Command Pattern encapsulates an operation as an object.

This allows operations to be:

- Queued.
- Logged.
- Scheduled.
- Retried.
- Executed later.

Example:

```typescript
interface Command {

    execute(): void;

}
```

Create a command:

```typescript
class CreateUserCommand implements Command {

    constructor(
        private name: string
    ) {}

    execute(): void {

        console.log(`Creating user: ${this.name}`);

    }

}
```

Command executor:

```typescript
class CommandInvoker {

    execute(command: Command): void {

        command.execute();

    }

}
```

Usage:

```typescript
const command = new CreateUserCommand("John");

const invoker = new CommandInvoker();

invoker.execute(command);
```

### When to Use?

- Background job systems.
- Undo/redo functionality.
- Task queues.
- Scheduled operations.
- Audit logging.

---

# PART 15: CQRS

## 37. What Is CQRS?

CQRS stands for Command Query Responsibility Segregation.

It is an architectural pattern that separates operations that change data from operations that read data.

Two main concepts:

**Command:** Changes application state.

**Query:** Retrieves application data.

### 37.1 Traditional Architecture

```text
       User Service
            |
      -------------
      |           |
      v           v
    Create      Get User
     User
      |           |
      v           v
   Database   Database
```

### 37.2 CQRS Architecture

```text
              Application
                   |
          -------------------
          |                 |
          v                 v
       Commands           Queries
          |                 |
          v                 v
    Write Operations   Read Operations
          |                 |
          v                 v
      Write Model       Read Model
          |                 |
          -------------------
                   |
              Data Storage
```

### 37.3 Command Example

```typescript
interface CreateUserCommand {

    name: string;

    email: string;

}
```

Handler:

```typescript
class CreateUserHandler {

    constructor(
        private repository: UserRepository
    ) {}

    async execute(
        command: CreateUserCommand
    ): Promise<void> {

        const user = new User(
            1,
            command.name,
            command.email
        );

        await this.repository.save(user);

    }

}
```

### 37.4 Query Example

```typescript
interface GetUserQuery {

    userId: number;

}
```

Handler:

```typescript
class GetUserHandler {

    constructor(
        private repository: UserRepository
    ) {}

    async execute(
        query: GetUserQuery
    ): Promise<User | null> {

        return this.repository.findById(
            query.userId
        );

    }

}
```

### Important CQRS Rules

Commands:

- Represent intent.
- Change state.
- Should enforce business rules.

Queries:

- Retrieve data.
- Should not change application state.

### Does CQRS Require Separate Databases?

No.

CQRS can use:

1. One database with separate read/write code paths.
2. Separate read and write models.
3. Separate databases with synchronization.

### Benefits

- Independent read and write optimization.
- Better separation of responsibilities.
- Useful for complex business operations.
- Supports different read models.

### Disadvantages

- More complexity.
- More infrastructure.
- Potential eventual consistency.
- More complicated debugging.

**Important:** CQRS is not necessary for every CRUD application. Use it when the complexity or performance requirements justify it.

---

# PART 16: EVENT-DRIVEN ARCHITECTURE

## 38. What Is Event-Driven Architecture?

Event-Driven Architecture (EDA) is an architectural style in which components communicate through events.

An event represents something that has already happened.

Examples:

- UserRegistered.
- OrderPlaced.
- PaymentCompleted.
- ProductCreated.
- InventoryUpdated.

### 38.1 Basic Architecture

```text
       Order Service
             |
             v
        OrderPlaced
             |
             v
        Event Broker
             |
       -------------
       |           |
       v           v
 Notification   Inventory
   Service       Service
```

The producer publishes an event.

Consumers subscribe to and process it.

### 38.2 Create an Event

```typescript
interface OrderPlacedEvent {

    eventId: string;

    orderId: number;

    customerId: number;

    total: number;

    occurredAt: Date;

}
```

### 38.3 Event Publisher Interface

```typescript
interface EventPublisher {

    publish<T>(
        eventName: string,
        payload: T
    ): Promise<void>;

}
```

### 38.4 Example Publisher

```typescript
class ConsoleEventPublisher implements EventPublisher {

    async publish<T>(
        eventName: string,
        payload: T
    ): Promise<void> {

        console.log({
            eventName,
            payload
        });

    }

}
```

### 38.5 Publish Event

```typescript
class OrderService {

    constructor(
        private publisher: EventPublisher
    ) {}

    async placeOrder(orderId: number): Promise<void> {

        await this.publisher.publish(
            "OrderPlaced",
            {
                orderId,
                occurredAt: new Date()
            }
        );

    }

}
```

### 38.6 Event Consumers

```typescript
class NotificationConsumer {

    async handle(
        event: OrderPlacedEvent
    ): Promise<void> {

        console.log(
            "Sending order confirmation:",
            event.orderId
        );

    }

}
```

```typescript
class InventoryConsumer {

    async handle(
        event: OrderPlacedEvent
    ): Promise<void> {

        console.log(
            "Updating inventory:",
            event.orderId
        );

    }

}
```

These consumers are illustrative. A production event system needs event transport, serialization, retries, delivery guarantees and failure handling.

---

## 39. Event-Driven Communication Tools

Popular technologies include:

| Technology | Purpose |
|---|---|
| RabbitMQ | Message broker |
| Apache Kafka | Distributed event streaming |
| AWS SQS | Managed message queue |
| Redis Streams | Stream-based messaging |
| NATS | Messaging system |

### Important Event-Driven Concepts

**Event Producer:** Publishes events.

**Event Consumer:** Processes events.

**Event Broker:** Transports events between components.

**Event Schema:** Defines the structure of an event.

**Dead Letter Queue:** Stores messages that cannot be processed successfully after configured attempts.

### 39.1 Important Reliability Concepts

**Idempotency**

Processing the same event multiple times should not create unintended duplicate effects.

**Retry**

Failed messages may be retried according to a defined policy.

**Dead Letter Queue**

Repeatedly failing messages can be moved to a separate queue for investigation.

**Outbox Pattern**

The Outbox Pattern stores business changes and outgoing events in the same database transaction. A separate publisher then sends the events to the message broker.

This reduces the risk of saving a database change without publishing its corresponding event.

---

# PART 17: DEPENDENCY INJECTION CONTAINERS

## 40. What Is Dependency Injection?

Dependency Injection means supplying an object's dependencies from outside instead of constructing them internally.

We already studied constructor injection.

Now we will understand DI containers.

### Without DI Container

```typescript
const repository = new MySQLUserRepository();

const service = new UserService(repository);

const controller = new UserController(service);
```

As the application grows, constructing dependencies manually can become complicated.

A DI container manages object creation and dependency resolution.

### 40.1 DI Container Concept

```text
DI Container
    |
    ├── UserRepository
    |
    ├── UserService
    |
    ├── UserController
    |
    └── EmailService
```

### 40.2 Simple Manual Container

```typescript
class Container {

    private dependencies = new Map<string, unknown>();

    register<T>(
        key: string,
        dependency: T
    ): void {

        this.dependencies.set(key, dependency);

    }

    resolve<T>(key: string): T {

        const dependency = this.dependencies.get(key);

        if (!dependency) {

            throw new Error(
                `Dependency not found: ${key}`
            );

        }

        return dependency as T;

    }

}
```

Usage:

```typescript
const container = new Container();

const repository = new MySQLUserRepository();

container.register(
    "UserRepository",
    repository
);

const resolvedRepository =
    container.resolve<UserRepository>(
        "UserRepository"
    );
```

This is a basic illustration, not a full DI framework.

---

## 41. Popular Dependency Injection Libraries

### 41.1 Inversify

InversifyJS is a dependency injection framework for JavaScript and TypeScript.

Documentation: [Inversify Documentation](https://inversify.io/?utm_source=chatgpt.com)

### 41.2 TSyringe

TSyringe is a lightweight dependency injection container.

Documentation: [TSyringe GitHub Repository](https://github.com/microsoft/tsyringe?utm_source=chatgpt.com)

### 41.3 Awilix

Awilix is another dependency injection container commonly used in Node.js applications.

Documentation: [Awilix Documentation](https://github.com/jeffijoe/awilix?utm_source=chatgpt.com)

### Why Use a DI Container?

- Centralized dependency management.
- Easier dependency replacement.
- Consistent object creation.
- Support for different object lifetimes.
- Reduced manual construction code.

### Important: Dependency Lifetimes

Common lifetimes include:

| Lifetime | Meaning |
|---|---|
| Singleton | One shared instance within the container |
| Transient | New instance each time |
| Scoped | One instance within a particular scope |

For example, a database connection pool might be shared, while a request-specific context should generally not be a global singleton.

**Important:** Be careful with singleton services that store user-specific or request-specific mutable state. That can cause data leakage between concurrent requests.

---

# PART 18: MODULAR MONOLITH ARCHITECTURE

## 42. What Is a Monolith?

A monolithic application is deployed as one application unit.

Example:

```text
E-Commerce Application
│
├── Authentication
├── Users
├── Products
├── Orders
├── Payments
└── Notifications
```

All modules are part of one deployable application.

### Advantages

- Simpler deployment.
- Easier debugging.
- Easier local development.
- Lower operational complexity.
- Straightforward transactions within one database.

### Disadvantages

- Can become difficult to maintain if poorly structured.
- Deployment affects the entire application.
- Modules may become tightly coupled.
- Scaling individual components independently is difficult.

---

## 43. What Is a Modular Monolith?

A Modular Monolith is a monolithic application organized into independent, well-defined modules.

Example:

```text
Application
│
├── Auth Module
│
├── User Module
│
├── Product Module
│
├── Order Module
│
├── Payment Module
│
└── Notification Module
```

Each module owns its functionality and exposes controlled interfaces.

### 43.1 Example Module Structure

```text
src/
│
├── modules/
│   │
│   ├── users/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.repository.ts
│   │   └── user.routes.ts
│   │
│   ├── products/
│   │   ├── product.controller.ts
│   │   ├── product.service.ts
│   │   └── product.repository.ts
│   │
│   └── orders/
│       ├── order.controller.ts
│       ├── order.service.ts
│       └── order.repository.ts
│
├── shared/
│
└── server.ts
```

### 43.2 Module Communication

Suppose the Order Module needs product information.

Avoid directly importing internal implementation details from the Product Module.

Instead, expose a public interface.

```typescript
interface ProductReader {

    getProductPrice(
        productId: number
    ): Promise<number>;

}
```

The Order Module depends on this abstraction.

### Benefits of Modular Monolith

- Easier maintenance.
- Clear module ownership.
- Simpler deployment than microservices.
- Easier testing.
- Potentially easier future extraction into services.

### When Should You Use It?

For many applications, a modular monolith is a strong starting architecture.

It provides organization without introducing the operational complexity of distributed systems.

---

# PART 19: MICROSERVICES FUNDAMENTALS

## 44. What Are Microservices?

Microservices architecture divides an application into independently deployable services.

Each service owns a specific business capability.

Example:

```text
                API Gateway
                     |
       ----------------------------
       |       |       |          |
       v       v       v          v
     Auth   Product  Order     Payment
   Service  Service  Service   Service
       |       |       |          |
       v       v       v          v
      DB      DB      DB         DB
```

Each service can have its own database and deployment lifecycle.

### 44.1 Characteristics of Microservices

- Independent deployment.
- Business capability ownership.
- Service-to-service communication.
- Independent scaling.
- Distributed failure handling.
- Decentralized data management.

### 44.2 Communication Methods

Microservices commonly communicate through:

**Synchronous communication:**

- REST APIs.
- gRPC.

**Asynchronous communication:**

- RabbitMQ.
- Kafka.
- AWS SQS.
- Event-driven messaging.

### 44.3 Synchronous Example

```text
Order Service
      |
      | HTTP Request
      |
      v
Payment Service
      |
      v
Payment Result
```

### 44.4 Asynchronous Example

```text
Order Service
      |
      v
OrderPlaced Event
      |
      v
Message Broker
      |
      v
Notification Service
```

---

## 45. Monolith vs Modular Monolith vs Microservices

| Feature | Monolith | Modular Monolith | Microservices |
|---|---|---|---|
| Deployment | One application | One application | Multiple services |
| Code Organization | Can be tightly coupled | Strong module boundaries | Separate service boundaries |
| Complexity | Low initially | Moderate | High |
| Scaling | Whole application | Usually whole application | Individual services |
| Database | Commonly shared | May share infrastructure with module boundaries | Often service-owned |
| Deployment Overhead | Low | Low | High |
| Network Communication | Mostly internal calls | Mostly internal calls | Often network-based |
| Operational Cost | Lower | Lower | Higher |

### 45.1 When Should You Choose Each?

**Monolith:**

- Small applications.
- Simple business requirements.
- Small development teams.

**Modular Monolith:**

- Medium to large applications.
- Multiple business modules.
- Teams needing clear boundaries.
- Applications that may evolve over time.

**Microservices:**

- Large systems with strong independent service requirements.
- Multiple teams owning separate business capabilities.
- Independent scaling requirements.
- Mature DevOps and observability capabilities.

### Important Warning

Microservices are not automatically better than monoliths.

They introduce:

- Network latency.
- Distributed transactions.
- Service discovery.
- Deployment complexity.
- Observability requirements.
- Eventual consistency.
- More failure scenarios.

Do not choose microservices simply because they are popular.

---

# PART 20: DISTRIBUTED SYSTEM DESIGN CONCEPTS

## 46. What Is Eventual Consistency?

In distributed systems, different services may not see updated data immediately.

Instead, data becomes consistent over time.

Example:

```text
Order Service
     |
     v
Order Created
     |
     v
Event Published
     |
     v
Inventory Service
     |
     v
Inventory Updated
```

Between order creation and inventory update, the two systems may temporarily have different views of the state.

This is eventual consistency.

### When Is It Useful?

- Distributed applications.
- Event-driven systems.
- Microservices.
- Asynchronous processing.

### Important

Eventual consistency is not the same as ignoring consistency.

The system must define acceptable consistency guarantees and how failures are recovered.

---

## 47. What Is the Saga Pattern?

The Saga Pattern manages a business transaction across multiple services using a sequence of local transactions.

Example: Order placement.

```text
1. Create Order
       |
       v
2. Reserve Inventory
       |
       v
3. Process Payment
       |
       v
4. Confirm Order
```

What happens if payment fails after inventory is reserved?

The system may need a compensating operation:

```text
Payment Failed
       |
       v
Release Inventory
       |
       v
Cancel Order
```

### Two Common Saga Approaches

**Choreography:**

Services react to events and trigger subsequent operations.

**Orchestration:**

A central coordinator controls the workflow.

### Important

Compensating actions do not necessarily reverse the original operation perfectly.

For example, a refund may be a new business transaction rather than a literal rollback of a payment provider's operation.

---

# PART 21: TYPESCRIPT MONOREPOS

## 48. What Is a Monorepo?

A monorepo is a repository containing multiple related projects or packages.

Example:

```text
company-platform/
│
├── apps/
│   │
│   ├── frontend/
│   │
│   ├── backend/
│   │
│   └── admin/
│
├── packages/
│   │
│   ├── shared-types/
│   │
│   ├── validation/
│   │
│   ├── ui/
│   │
│   └── utilities/
│
├── package.json
└── tsconfig.json
```

### Why Use a Monorepo?

- Share code between projects.
- Centralize configuration.
- Manage related applications together.
- Coordinate package versions.
- Simplify cross-project changes.

### 48.1 npm Workspaces

npm supports workspaces for managing multiple packages in one repository.

Root `package.json`:

```json
{
    "name": "company-platform",
    "private": true,
    "workspaces": [
        "apps/*",
        "packages/*"
    ]
}
```

Example:

```text
apps/
    backend/
    frontend/

packages/
    shared-types/
```

Each directory can contain its own `package.json`.

### 48.2 Shared Types Package

`packages/shared-types/src/index.ts`

```typescript
export interface User {

    id: number;

    name: string;

    email: string;

}
```

The frontend and backend can both depend on the shared package.

### 48.3 Important Monorepo Considerations

- Package boundaries.
- Dependency versions.
- Build order.
- TypeScript project references.
- Shared linting.
- Shared formatting.
- Testing strategy.
- Release management.

---

## 49. Popular Monorepo Tools

| Tool | Purpose |
|---|---|
| npm Workspaces | Native package management |
| pnpm Workspaces | Workspace and dependency management |
| Turborepo | Build system for monorepos |
| Nx | Monorepo management and build orchestration |
| Lerna | Multi-package repository management |

Official resources:

- [npm Workspaces](https://docs.npmjs.com/cli/using-npm/workspaces?utm_source=chatgpt.com)
- [pnpm Workspaces](https://pnpm.io/workspaces?utm_source=chatgpt.com)
- [Turborepo Documentation](https://turborepo.dev/docs?utm_source=chatgpt.com)
- [Nx Documentation](https://nx.dev/docs?utm_source=chatgpt.com)

---

# PART 22: ENTERPRISE PROJECT STRUCTURE

## 50. What Is Enterprise Application Architecture?

Enterprise applications are generally large systems with:

- Multiple business domains.
- Many developers.
- Complex business rules.
- Security requirements.
- Integration with external systems.
- Long-term maintenance requirements.

They require clear module boundaries and consistent architectural standards.

### 50.1 Enterprise TypeScript Structure

Consider a modular e-commerce backend using Clean Architecture principles.

```text
ecommerce-backend/
│
├── src/
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   │   │
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   └── repositories/
│   │   │   │
│   │   │   ├── application/
│   │   │   │   └── use-cases/
│   │   │   │
│   │   │   ├── infrastructure/
│   │   │   │   └── repositories/
│   │   │   │
│   │   │   └── presentation/
│   │   │       ├── controllers/
│   │   │       └── routes/
│   │   │
│   │   ├── users/
│   │   ├── products/
│   │   ├── orders/
│   │   └── payments/
│   │
│   ├── shared/
│   │   ├── errors/
│   │   ├── logger/
│   │   ├── database/
│   │   └── utils/
│   │
│   ├── config/
│   │
│   ├── app.ts
│   │
│   └── server.ts
│
├── tests/
│
├── docs/
│
├── scripts/
│
├── Dockerfile
│
├── package.json
│
└── tsconfig.json
```

### 50.2 Module Responsibilities

**Domain:**

Contains business entities, value objects, domain services and repository abstractions.

**Application:**

Contains use cases and application-level coordination.

**Infrastructure:**

Contains database implementations, external integrations and technical services.

**Presentation:**

Contains HTTP controllers, routes, request handling and response mapping.

**Shared:**

Contains genuinely reusable infrastructure and utilities.

Avoid turning `shared` into a dumping ground for unrelated functionality.

---

# PART 23: REAL-WORLD ENTERPRISE PROJECT

## 51. Build an E-Commerce Order Module Using Clean Architecture

Now we will combine several concepts.

### Requirements

Build an order module with:

1. Create order.
2. Add order items.
3. Calculate total.
4. Apply discount.
5. Process payment.
6. Save order.
7. Publish an order-created event.

### Architecture

```text
HTTP Request
     |
     v
Order Controller
     |
     v
Create Order Use Case
     |
     ├── Order Repository
     |
     ├── Payment Gateway
     |
     └── Event Publisher
```

### 51.1 Define Domain Types

`domain/OrderItem.ts`

```typescript
export class OrderItem {

    constructor(
        public readonly productId: number,
        public readonly price: number,
        public readonly quantity: number
    ) {

        if (!Number.isInteger(productId) || productId <= 0) {
            throw new Error("Invalid product ID");
        }

        if (!Number.isFinite(price) || price < 0) {
            throw new Error("Invalid price");
        }

        if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new Error("Invalid quantity");
        }

    }

    getSubtotal(): number {

        return this.price * this.quantity;

    }

}
```

### 51.2 Create Order Entity

`domain/Order.ts`

```typescript
import { OrderItem } from "./OrderItem";

export type OrderStatus =
    | "pending"
    | "confirmed"
    | "cancelled";

export class Order {

    private items: OrderItem[] = [];

    private status: OrderStatus = "pending";

    constructor(
        public readonly id: string,
        public readonly customerId: number
    ) {}

    addItem(item: OrderItem): void {

        if (this.status !== "pending") {

            throw new Error(
                "Cannot modify this order"
            );

        }

        this.items.push(item);

    }

    calculateTotal(): number {

        return this.items.reduce(
            (total, item) => total + item.getSubtotal(),
            0
        );

    }

    confirm(): void {

        if (this.items.length === 0) {

            throw new Error(
                "Cannot confirm an empty order"
            );

        }

        if (this.status !== "pending") {

            throw new Error(
                "Order cannot be confirmed"
            );

        }

        this.status = "confirmed";

    }

    getItems(): readonly OrderItem[] {

        return [...this.items];

    }

    getStatus(): OrderStatus {

        return this.status;

    }

}
```

### 51.3 Define Repository Interface

`domain/OrderRepository.ts`

```typescript
import { Order } from "./Order";

export interface OrderRepository {

    save(order: Order): Promise<void>;

    findById(id: string): Promise<Order | null>;

}
```

### 51.4 Define Payment Interface

`application/PaymentGateway.ts`

```typescript
export interface PaymentGateway {

    charge(
        customerId: number,
        amount: number
    ): Promise<boolean>;

}
```

### 51.5 Define Event Publisher

`application/EventPublisher.ts`

```typescript
export interface EventPublisher {

    publish<T>(
        eventName: string,
        payload: T
    ): Promise<void>;

}
```

### 51.6 Create Use Case

`application/CreateOrderUseCase.ts`

```typescript
import { Order } from "../domain/Order";

import { OrderItem } from "../domain/OrderItem";

import { OrderRepository } from "../domain/OrderRepository";

import { PaymentGateway } from "./PaymentGateway";

import { EventPublisher } from "./EventPublisher";

interface CreateOrderInput {

    orderId: string;

    customerId: number;

    items: {
        productId: number;
        price: number;
        quantity: number;
    }[];

}

export class CreateOrderUseCase {

    constructor(
        private orderRepository: OrderRepository,
        private paymentGateway: PaymentGateway,
        private eventPublisher: EventPublisher
    ) {}

    async execute(input: CreateOrderInput): Promise<Order> {

        const order = new Order(
            input.orderId,
            input.customerId
        );

        for (const item of input.items) {

            order.addItem(
                new OrderItem(
                    item.productId,
                    item.price,
                    item.quantity
                )
            );

        }

        const total = order.calculateTotal();

        const paymentSuccessful =
            await this.paymentGateway.charge(
                input.customerId,
                total
            );

        if (!paymentSuccessful) {

            throw new Error("Payment failed");

        }

        order.confirm();

        await this.orderRepository.save(order);

        await this.eventPublisher.publish(
            "OrderCreated",
            {
                orderId: order.id,
                customerId: order.customerId,
                total
            }
        );

        return order;

    }

}
```

### 51.7 Create Infrastructure Implementations

In-memory repository:

```typescript
import { Order } from "../../domain/Order";

import { OrderRepository } from "../../domain/OrderRepository";

export class InMemoryOrderRepository implements OrderRepository {

    private orders = new Map<string, Order>();

    async save(order: Order): Promise<void> {

        this.orders.set(order.id, order);

    }

    async findById(id: string): Promise<Order | null> {

        return this.orders.get(id) ?? null;

    }

}
```

Mock payment gateway:

```typescript
import { PaymentGateway } from "../../application/PaymentGateway";

export class MockPaymentGateway implements PaymentGateway {

    async charge(
        customerId: number,
        amount: number
    ): Promise<boolean> {

        console.log("Processing payment:", {
            customerId,
            amount
        });

        return true;

    }

}
```

Console event publisher:

```typescript
import { EventPublisher } from "../../application/EventPublisher";

export class ConsoleEventPublisher implements EventPublisher {

    async publish<T>(
        eventName: string,
        payload: T
    ): Promise<void> {

        console.log({
            eventName,
            payload
        });

    }

}
```

### 51.8 Compose the Application

`main.ts`

```typescript
import { CreateOrderUseCase } from "./application/CreateOrderUseCase";

import { InMemoryOrderRepository } from "./infrastructure/InMemoryOrderRepository";

import { MockPaymentGateway } from "./infrastructure/MockPaymentGateway";

import { ConsoleEventPublisher } from "./infrastructure/ConsoleEventPublisher";

const repository = new InMemoryOrderRepository();

const paymentGateway = new MockPaymentGateway();

const eventPublisher = new ConsoleEventPublisher();

const createOrder = new CreateOrderUseCase(
    repository,
    paymentGateway,
    eventPublisher
);

async function main(): Promise<void> {

    const order = await createOrder.execute({

        orderId: "ORDER-101",

        customerId: 1,

        items: [
            {
                productId: 101,
                price: 1000,
                quantity: 2
            },
            {
                productId: 102,
                price: 500,
                quantity: 1
            }
        ]

    });

    console.log("Order Status:", order.getStatus());

    console.log("Order Total:", order.calculateTotal());

}

main().catch(console.error);
```

Expected total:

```text
2500
```

### Important Production Improvements

This project demonstrates architectural separation, but it is not a complete production payment workflow.

A real implementation should address:

1. Runtime request validation.
2. Product price retrieval from a trusted source.
3. Inventory reservation.
4. Payment idempotency.
5. Database transactions.
6. Payment failure recovery.
7. Outbox pattern for reliable event publishing.
8. Distributed transaction handling.
9. Authentication and authorization.
10. Integration and unit tests.

In particular, do not trust product prices supplied directly by the client.

The backend should retrieve authoritative prices and enforce business rules itself.

---

# PART 24: COMMON ARCHITECTURAL MISTAKES

## 52. Mistakes Developers Should Avoid

| Mistake | Better Approach |
|---|---|
| Putting all logic in controllers | Separate application and domain logic |
| Creating excessively large services | Apply SRP |
| Depending directly on database implementations | Depend on abstractions where useful |
| Creating interfaces for every single class | Introduce abstractions when they provide value |
| Using inheritance unnecessarily | Prefer composition when appropriate |
| Creating microservices too early | Start with a modular monolith when suitable |
| Making domain models depend on Express | Keep domain independent of frameworks |
| Putting every business rule in application services | Keep domain behavior in domain models where appropriate |
| Using repositories for every database table mechanically | Design repositories around meaningful domain collections |
| Using CQRS for simple CRUD systems | Apply CQRS only when justified |
| Treating events as guaranteed delivery | Design retries, idempotency and recovery |
| Sharing all database tables across services | Define clear data ownership |
| Making a giant shared module | Keep module boundaries explicit |
| Overusing design patterns | Prefer simple solutions when possible |

---

# PART 25: INTERVIEW QUESTIONS AND ANSWERS

## 53. Software Architecture Questions

### Q1. What is software architecture?

Software architecture defines the high-level structure, responsibilities, interactions and dependencies of an application.

### Q2. What is coupling?

Coupling measures how strongly one component depends on another.

### Q3. What is cohesion?

Cohesion measures how closely related the responsibilities within a module are.

### Q4. What is the difference between high cohesion and low coupling?

High cohesion keeps related responsibilities together. Low coupling minimizes unnecessary dependencies between components.

### Q5. What are SOLID principles?

SOLID is a collection of five object-oriented design principles that improve maintainability and extensibility.

### Q6. What is SRP?

The Single Responsibility Principle states that a class or module should have one reason to change.

### Q7. What is OCP?

The Open/Closed Principle states that software entities should be open for extension but closed for modification.

### Q8. What is LSP?

The Liskov Substitution Principle states that subtypes should preserve the expected behavior of their base abstractions.

### Q9. What is ISP?

The Interface Segregation Principle states that clients should not depend on interfaces they do not use.

### Q10. What is DIP?

The Dependency Inversion Principle states that high-level and low-level modules should depend on abstractions.

---

## 54. Architecture Questions

### Q11. What is Clean Architecture?

Clean Architecture organizes software into layers and keeps business logic independent of external frameworks and infrastructure.

### Q12. What is the dependency rule?

Dependencies should point toward the inner business layers rather than toward outer infrastructure.

### Q13. What is Hexagonal Architecture?

Hexagonal Architecture uses ports and adapters to isolate application logic from external systems.

### Q14. What are ports and adapters?

Ports define communication interfaces, while adapters connect those interfaces to external technologies.

### Q15. What is Onion Architecture?

Onion Architecture organizes software into concentric layers with the domain model at the center.

### Q16. What is DDD?

Domain-Driven Design is an approach that models software around business domains and their rules.

### Q17. What is Ubiquitous Language?

It is a shared vocabulary used consistently by developers and domain experts.

### Q18. What is a Bounded Context?

A Bounded Context defines the boundary within which a particular domain model and its terminology apply.

### Q19. What is an Entity?

An entity is a domain object primarily identified by its identity.

### Q20. What is a Value Object?

A Value Object is an immutable domain object defined by its values rather than its identity.

### Q21. What is an Aggregate?

An Aggregate is a group of related domain objects treated as one consistency boundary.

### Q22. What is an Aggregate Root?

An Aggregate Root is the primary entity through which external code accesses and modifies an aggregate.

### Q23. What is a Domain Service?

A Domain Service contains business logic that does not naturally belong to a particular entity or value object.

### Q24. What is an Application Service?

An Application Service coordinates a particular use case and its dependencies.

---

## 55. Design Pattern Questions

### Q25. What is the Repository Pattern?

It abstracts data access behind an interface.

### Q26. What is the Unit of Work Pattern?

It coordinates related persistence operations within a logical transaction.

### Q27. What is the Factory Pattern?

It centralizes object creation.

### Q28. What is the Abstract Factory Pattern?

It provides an interface for creating families of related objects.

### Q29. What is the Builder Pattern?

It constructs complex objects step by step.

### Q30. What is the Strategy Pattern?

It allows interchangeable algorithms to be selected without changing the client.

### Q31. What is the Observer Pattern?

It allows multiple subscribers to receive notifications when an event occurs.

### Q32. What is the Adapter Pattern?

It makes incompatible interfaces work together.

### Q33. What is the Decorator Pattern?

It adds behavior to an object without changing its original implementation.

### Q34. What is the Command Pattern?

It encapsulates an operation as an object.

---

## 56. Advanced Architecture Questions

### Q35. What is CQRS?

CQRS separates commands that modify state from queries that retrieve data.

### Q36. Does CQRS require separate databases?

No. CQRS can use a single database or separate read and write storage systems.

### Q37. What is Event-Driven Architecture?

It is an architectural style in which components communicate through events.

### Q38. What is the difference between an event and a command?

An event describes something that has already happened. A command requests that an operation be performed.

### Q39. What is a Dead Letter Queue?

A Dead Letter Queue stores messages that cannot be processed successfully after configured retry attempts.

### Q40. What is the Outbox Pattern?

It stores outgoing events in the same database transaction as business changes and publishes them separately.

### Q41. What is a Modular Monolith?

A single deployable application organized into well-defined independent modules.

### Q42. What are Microservices?

Microservices divide an application into independently deployable services organized around business capabilities.

### Q43. What is the difference between a monolith and microservices?

A monolith is deployed as one application unit, while microservices consist of multiple independently deployable services.

### Q44. What is eventual consistency?

Eventual consistency means distributed data may temporarily differ but should converge under the system's consistency guarantees.

### Q45. What is the Saga Pattern?

The Saga Pattern coordinates distributed business transactions using a sequence of local transactions and compensating actions.

### Q46. What is a Monorepo?

A Monorepo is a single repository containing multiple related applications or packages.

### Q47. What is dependency injection?

Dependency injection supplies dependencies externally instead of constructing them internally.

### Q48. What is a DI container?

A DI container manages dependency registration, object construction and dependency resolution.

### Q49. What is the difference between a modular monolith and microservices?

A modular monolith has clear internal module boundaries but one deployable application. Microservices are independently deployable services.

### Q50. Which architecture should you choose for a new application?

Choose an architecture based on business complexity, team size, operational requirements and expected growth. A modular monolith is often a practical starting point.

---

# PART 26: PRACTICAL EXERCISES

## 57. Beginner-Level Exercises

**Exercise 1: Apply SOLID Principles**

Create a notification system using:

- EmailNotification.
- SMSNotification.
- WhatsAppNotification.
- NotificationService.

Apply all five SOLID principles where appropriate.

**Exercise 2: Repository Pattern**

Create:

```typescript
interface ProductRepository {

    findById(id: number): Promise<Product | null>;

    findAll(): Promise<Product[]>;

    save(product: Product): Promise<void>;

}
```

Implement:

- MySQL repository.
- In-memory repository.

**Exercise 3: Factory Pattern**

Create a payment factory that supports:

- UPI.
- Card.
- PayPal.

**Exercise 4: Strategy Pattern**

Create different discount calculation strategies.

---

## 58. Intermediate-Level Exercises

**Exercise 5: Clean Architecture**

Create a User Management application using:

- Domain.
- Application.
- Infrastructure.
- Presentation.

**Exercise 6: Value Objects**

Create:

- EmailAddress.
- Money.
- PhoneNumber.
- Address.

Each should validate its own values.

**Exercise 7: Aggregate Root**

Create an Order Aggregate containing:

- Order.
- OrderItem.
- ShippingAddress.

Implement business rules for adding and removing items.

**Exercise 8: Unit of Work**

Create an order workflow involving:

- Order repository.
- Inventory repository.
- Payment repository.

Use a database transaction where all participating operations share the same transaction.

**Exercise 9: Builder Pattern**

Create a ReportBuilder that constructs complex reports with optional sections.

---

## 59. Advanced-Level Exercises

**Exercise 10: CQRS**

Build a Product Management system with separate:

- CreateProductCommand.
- UpdateProductCommand.
- GetProductQuery.
- GetProductsQuery.

**Exercise 11: Event-Driven Architecture**

Create an OrderPlaced event.

Implement consumers for:

- Notification.
- Inventory.
- Analytics.

**Exercise 12: Modular Monolith**

Build an e-commerce backend with independent modules:

- Authentication.
- Users.
- Products.
- Orders.
- Payments.

Define public interfaces between modules.

**Exercise 13: Microservices Design**

Design an architecture containing:

- API Gateway.
- Auth Service.
- Product Service.
- Order Service.
- Payment Service.
- Notification Service.

Define communication methods and data ownership.

**Exercise 14: Monorepo**

Create a monorepo containing:

- Next.js frontend.
- Express backend.
- Shared TypeScript types.
- Shared validation package.

Use npm or pnpm workspaces.

---

# PART 27: PHASE 44 COMPLETION CHECKLIST

## 60. Knowledge Checklist

| No. | Topic | Status |
|---|---|---|
| 1 | Software Architecture Fundamentals | ☐ |
| 2 | Coupling and Cohesion | ☐ |
| 3 | SOLID Principles | ☐ |
| 4 | Single Responsibility Principle | ☐ |
| 5 | Open/Closed Principle | ☐ |
| 6 | Liskov Substitution Principle | ☐ |
| 7 | Interface Segregation Principle | ☐ |
| 8 | Dependency Inversion Principle | ☐ |
| 9 | Clean Architecture | ☐ |
| 10 | Dependency Rule | ☐ |
| 11 | Hexagonal Architecture | ☐ |
| 12 | Ports and Adapters | ☐ |
| 13 | Onion Architecture | ☐ |
| 14 | Domain-Driven Design | ☐ |
| 15 | Ubiquitous Language | ☐ |
| 16 | Bounded Context | ☐ |
| 17 | Domain Models | ☐ |
| 18 | Entities | ☐ |
| 19 | Value Objects | ☐ |
| 20 | Aggregates | ☐ |
| 21 | Aggregate Roots | ☐ |
| 22 | Domain Services | ☐ |
| 23 | Application Services | ☐ |
| 24 | Repository Pattern | ☐ |
| 25 | Unit of Work Pattern | ☐ |
| 26 | Factory Pattern | ☐ |
| 27 | Abstract Factory Pattern | ☐ |
| 28 | Builder Pattern | ☐ |
| 29 | Strategy Pattern | ☐ |
| 30 | Observer Pattern | ☐ |
| 31 | Adapter Pattern | ☐ |
| 32 | Decorator Pattern | ☐ |
| 33 | Command Pattern | ☐ |
| 34 | CQRS | ☐ |
| 35 | Event-Driven Architecture | ☐ |
| 36 | Outbox Pattern | ☐ |
| 37 | Dependency Injection Containers | ☐ |
| 38 | Modular Monolith | ☐ |
| 39 | Microservices | ☐ |
| 40 | Eventual Consistency | ☐ |
| 41 | Saga Pattern | ☐ |
| 42 | TypeScript Monorepos | ☐ |
| 43 | Enterprise Project Structure | ☐ |
| 44 | Real-World Enterprise Application | ☐ |

---

# PHASE 44 COMPLETED

You have now covered important enterprise-level software architecture concepts.

You should understand how to:

- Apply SOLID principles.
- Design maintainable TypeScript applications.
- Separate business logic from infrastructure.
- Implement Clean, Hexagonal and Onion Architecture.
- Model complex business domains using DDD.
- Use entities, value objects and aggregates.
- Implement important design patterns.
- Understand CQRS and Event-Driven Architecture.
- Design modular monoliths and microservices.
- Organize enterprise TypeScript projects and monorepos.

## Next Phase: Phase 45

**Advanced TypeScript – Advanced Type System, Type-Level Programming and Compiler-Level Type Manipulation**

Upcoming topics:

1. Deep Understanding of the TypeScript Type System.
2. Type-Level Programming.
3. Advanced Generics.
4. Generic Constraints.
5. Conditional Types.
6. Nested Conditional Types.
7. Distributive Conditional Types.
8. The `infer` Keyword.
9. Advanced Mapped Types.
10. Key Remapping in Mapped Types.
11. Template Literal Types.
12. Recursive Types.
13. Recursive Conditional Types.
14. Variadic Tuple Types.
15. Advanced Tuple Manipulation.
16. Function Overloading.
17. Advanced Function Types.
18. Higher-Order Functions.
19. Generic Function Composition.
20. Advanced Utility Types.
21. Building Custom Utility Types.
22. Type-Level String Manipulation.
23. Type-Level Number Manipulation.
24. Type-Level Object Manipulation.
25. Type-Level Validation.
26. Branded Types.
27. Nominal Typing Techniques.
28. Type-Safe Event Systems.
29. Type-Safe API Contracts.
30. Advanced Type Inference.
31. TypeScript Compiler Type Resolution.
32. Type-Level Programming Projects.

**When you're ready, say: `OK, Phase 45`.**