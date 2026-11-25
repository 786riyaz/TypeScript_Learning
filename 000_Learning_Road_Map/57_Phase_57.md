# Phase 57: Advanced TypeScript – Design Patterns, SOLID Principles, Clean Architecture, Hexagonal Architecture, Domain-Driven Design, Dependency Injection and Enterprise Application Architecture

**Level:** Expert / Advanced Software Architecture  
**Prerequisites:** TypeScript, OOP, Node.js, Express.js, REST APIs, databases, testing and system design.

---

# 1. Learning Objectives

By the end of this phase, you will understand how to:

1. Design maintainable and scalable software.
2. Apply the five SOLID principles.
3. Understand and implement common design patterns.
4. Use Dependency Injection (DI) and Inversion of Control (IoC).
5. Design applications using Clean Architecture.
6. Implement Hexagonal Architecture (Ports and Adapters).
7. Understand Onion Architecture.
8. Apply Domain-Driven Design (DDD).
9. Separate business logic from infrastructure.
10. Build enterprise-level TypeScript applications.

---

# 2. Software Design Principles

Software design principles are guidelines that help developers build software that is:

- Maintainable
- Reusable
- Testable
- Scalable
- Extensible
- Easy to understand

Before learning design patterns, understand these fundamental concepts.

## 2.1 Modularity

Modularity means dividing a large application into smaller, independent modules.

For example, an Expense Tracker application might contain:

```text
expense-tracker/
│
├── users/
├── expenses/
├── categories/
├── reports/
└── notifications/
```

Each module manages a specific responsibility.

**Benefits:**
- Easier maintenance.
- Better code organization.
- Easier testing.
- Reduced complexity.

## 2.2 Abstraction

Abstraction means exposing essential functionality while hiding implementation details.

Example:

```typescript
interface PaymentGateway {
    pay(amount: number): Promise<boolean>;
}
```

Different payment providers can implement this interface.

```typescript
class StripePayment implements PaymentGateway {
    async pay(amount: number): Promise<boolean> {
        console.log("Processing Stripe payment:", amount);
        return true;
    }
}

class RazorpayPayment implements PaymentGateway {
    async pay(amount: number): Promise<boolean> {
        console.log("Processing Razorpay payment:", amount);
        return true;
    }
}
```

The application depends on the payment abstraction rather than a specific provider.

## 2.3 Encapsulation

Encapsulation means keeping internal data and implementation details protected behind controlled methods.

```typescript
class BankAccount {
    private balance: number = 0;

    deposit(amount: number): void {
        if (amount <= 0) {
            throw new Error("Amount must be positive");
        }

        this.balance += amount;
    }

    getBalance(): number {
        return this.balance;
    }
}
```

You cannot directly modify the private balance:

```typescript
const account = new BankAccount();

account.deposit(1000);

console.log(account.getBalance()); // 1000

// account.balance = 5000; // Error
```

## 2.4 Cohesion

Cohesion describes how closely related the responsibilities of a module or class are.

**High cohesion:** A class performs closely related operations.

```typescript
class ExpenseCalculator {
    calculateTotal(expenses: number[]): number {
        return expenses.reduce((total, expense) => total + expense, 0);
    }

    calculateAverage(expenses: number[]): number {
        if (expenses.length === 0) {
            return 0;
        }

        return this.calculateTotal(expenses) / expenses.length;
    }
}
```

Both methods are related to expense calculations.

**Low cohesion:** A class performs unrelated responsibilities.

```typescript
class ApplicationManager {
    calculateExpense(): number {
        return 1000;
    }

    sendEmail(): void {}

    generatePDF(): void {}

    connectDatabase(): void {}

    authenticateUser(): void {}
}
```

This class has too many unrelated responsibilities.

## 2.5 Coupling

Coupling describes the level of dependency between different modules.

**Tight coupling:**

```typescript
class MySQLDatabase {
    connect(): void {
        console.log("Connected to MySQL");
    }
}

class UserService {
    private database = new MySQLDatabase();

    getUsers(): void {
        this.database.connect();
    }
}
```

`UserService` directly depends on `MySQLDatabase`.

Changing the database implementation requires modifying `UserService`.

**Loose coupling:**

```typescript
interface Database {
    connect(): void;
}

class MySQLDatabase implements Database {
    connect(): void {
        console.log("Connected to MySQL");
    }
}

class MongoDatabase implements Database {
    connect(): void {
        console.log("Connected to MongoDB");
    }
}

class UserService {
    constructor(private database: Database) {}

    getUsers(): void {
        this.database.connect();
    }
}
```

Now `UserService` depends on an abstraction.

You can inject either implementation.

### High Cohesion and Low Coupling

A good software architecture generally aims for:

| Concept | Desired design |
|---|---|
| Cohesion | High |
| Coupling | Low |
| Modularity | High |
| Separation of concerns | Clear |
| Abstraction | Appropriate |

## 2.6 Separation of Concerns (SoC)

Separation of Concerns means dividing an application according to different responsibilities.

For example:

| Layer | Responsibility |
|---|---|
| Controller | Handle HTTP requests and responses |
| Service | Coordinate application operations |
| Repository | Handle data access |
| Database | Persist data |
| Validator | Validate input |
| Middleware | Handle cross-cutting HTTP concerns |

A controller should not contain database queries, complex business rules, and email delivery logic all together.

## 2.7 Composition Over Inheritance

Composition means building complex functionality by combining smaller objects instead of relying heavily on inheritance.

**Inheritance:**

```typescript
class Animal {
    eat(): void {
        console.log("Eating");
    }
}

class Dog extends Animal {
    bark(): void {
        console.log("Barking");
    }
}
```

**Composition:**

```typescript
class Logger {
    log(message: string): void {
        console.log(message);
    }
}

class UserService {
    constructor(private logger: Logger) {}

    createUser(): void {
        this.logger.log("User created");
    }
}
```

Composition allows functionality to be combined more flexibly.

**Important:** Inheritance is not inherently bad. Use it when there is a genuine subtype relationship and behavioral substitutability.

---

# 3. SOLID Principles

SOLID is a collection of five object-oriented software design principles.

| Letter | Principle |
|---|---|
| S | Single Responsibility Principle |
| O | Open/Closed Principle |
| L | Liskov Substitution Principle |
| I | Interface Segregation Principle |
| D | Dependency Inversion Principle |

These principles help developers create maintainable and extensible applications.

---

# 4. Single Responsibility Principle (SRP)

**Definition:**

A class should have one reason to change.

This means a class should have one primary responsibility.

### 4.1 Incorrect Implementation

```typescript
class User {
    constructor(
        public name: string,
        public email: string
    ) {}

    saveToDatabase(): void {
        console.log("Saving user");
    }

    sendWelcomeEmail(): void {
        console.log("Sending email");
    }

    generatePDF(): void {
        console.log("Generating PDF");
    }
}
```

This class handles:

1. User data.
2. Database persistence.
3. Email delivery.
4. PDF generation.

These responsibilities can change independently.

### 4.2 Correct Implementation

Separate responsibilities into different classes.

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
    save(user: User): void {
        console.log("Saving user to database");
    }
}
```

Email responsibility:

```typescript
class EmailService {
    sendWelcomeEmail(user: User): void {
        console.log(`Welcome email sent to ${user.email}`);
    }
}
```

PDF responsibility:

```typescript
class UserPDFGenerator {
    generate(user: User): void {
        console.log(`Generating PDF for ${user.name}`);
    }
}
```

Now every class has a focused responsibility.

### 4.3 Real-World Example

In an Express application:

```text
src/
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
├── services/
│   └── email.service.ts
```

The separation makes the application easier to maintain.

**Important:** SRP does not mean one class must contain only one method. A class can contain multiple methods as long as they belong to the same responsibility.

---

# 5. Open/Closed Principle (OCP)

**Definition:**

Software entities should be:

- Open for extension.
- Closed for modification.

You should be able to introduce new functionality without repeatedly modifying stable existing code.

### 5.1 Incorrect Implementation

Imagine an application supporting multiple payment methods.

```typescript
class PaymentService {
    processPayment(type: string, amount: number): void {
        if (type === "stripe") {
            console.log("Processing Stripe payment");
        } else if (type === "razorpay") {
            console.log("Processing Razorpay payment");
        } else if (type === "paypal") {
            console.log("Processing PayPal payment");
        }
    }
}
```

Every time you introduce a new provider, you modify this class.

### 5.2 Correct Implementation

Create an abstraction.

```typescript
interface PaymentMethod {
    pay(amount: number): void;
}
```

Implement different payment methods.

```typescript
class StripePayment implements PaymentMethod {
    pay(amount: number): void {
        console.log(`Stripe payment: ${amount}`);
    }
}

class RazorpayPayment implements PaymentMethod {
    pay(amount: number): void {
        console.log(`Razorpay payment: ${amount}`);
    }
}

class PayPalPayment implements PaymentMethod {
    pay(amount: number): void {
        console.log(`PayPal payment: ${amount}`);
    }
}
```

Payment service:

```typescript
class PaymentService {
    constructor(private paymentMethod: PaymentMethod) {}

    process(amount: number): void {
        this.paymentMethod.pay(amount);
    }
}
```

Usage:

```typescript
const payment = new PaymentService(
    new StripePayment()
);

payment.process(1000);
```

Adding a new payment provider only requires implementing `PaymentMethod`.

### Benefits

- Easier extension.
- Less modification to existing code.
- Better testability.
- Reduced regression risk.

**Important:** OCP does not mean existing code can never be changed. It means designing stable areas of the system so common extensions do not require changes to their core logic.

---

# 6. Liskov Substitution Principle (LSP)

**Definition:**

Objects of a superclass should be replaceable with objects of its subclasses without breaking the expected behavior of the application.

In simple terms:

A subclass should behave consistently with the contract of its parent type.

### 6.1 Incorrect Implementation

```typescript
class Bird {
    fly(): void {
        console.log("Flying");
    }
}

class Sparrow extends Bird {}

class Penguin extends Bird {
    fly(): void {
        throw new Error("Penguins cannot fly");
    }
}
```

Problem:

A `Penguin` is a `Bird`, but it cannot satisfy the behavior promised by `Bird.fly()`.

This violates LSP.

### 6.2 Correct Implementation

Separate bird behavior from flying behavior.

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
    eat(): void {
        console.log("Sparrow eating");
    }

    fly(): void {
        console.log("Sparrow flying");
    }
}
```

Penguin:

```typescript
class Penguin implements Bird {
    eat(): void {
        console.log("Penguin eating");
    }
}
```

Now the type system represents the actual capabilities.

### Important LSP Rules

A subtype should not:

1. Require stronger preconditions than its parent contract.
2. Provide weaker postconditions.
3. Break expected invariants.
4. Throw unexpected exceptions for operations that the parent contract promises to support.

LSP is about behavioral compatibility, not simply matching method names and signatures.

---

# 7. Interface Segregation Principle (ISP)

**Definition:**

Clients should not be forced to depend on methods they do not use.

Prefer multiple small, focused interfaces over one large interface.

### 7.1 Incorrect Implementation

```typescript
interface Worker {
    work(): void;
    eat(): void;
    sleep(): void;
    attendMeeting(): void;
}
```

Now imagine a robot worker.

A robot can work, but it does not eat or sleep.

Implementing this interface forces irrelevant methods.

```typescript
class Robot implements Worker {
    work(): void {
        console.log("Robot working");
    }

    eat(): void {
        throw new Error("Not supported");
    }

    sleep(): void {
        throw new Error("Not supported");
    }

    attendMeeting(): void {
        console.log("Robot attending meeting");
    }
}
```

### 7.2 Correct Implementation

Separate interfaces by responsibility.

```typescript
interface Workable {
    work(): void;
}

interface Eatable {
    eat(): void;
}

interface Sleepable {
    sleep(): void;
}
```

Human:

```typescript
class Human implements Workable, Eatable, Sleepable {
    work(): void {
        console.log("Human working");
    }

    eat(): void {
        console.log("Human eating");
    }

    sleep(): void {
        console.log("Human sleeping");
    }
}
```

Robot:

```typescript
class Robot implements Workable {
    work(): void {
        console.log("Robot working");
    }
}
```

### Benefits

- Smaller interfaces.
- Better flexibility.
- Less unnecessary implementation.
- Reduced coupling.

---

# 8. Dependency Inversion Principle (DIP)

**Definition:**

High-level modules should not depend directly on low-level modules. Both should depend on abstractions.

### 8.1 Incorrect Implementation

```typescript
class MySQLDatabase {
    save(data: string): void {
        console.log("Saving to MySQL:", data);
    }
}

class UserService {
    private database = new MySQLDatabase();

    createUser(): void {
        this.database.save("New User");
    }
}
```

Problem:

`UserService` directly depends on `MySQLDatabase`.

If you switch to MongoDB, you must modify `UserService`.

### 8.2 Correct Implementation

Create an abstraction.

```typescript
interface Database {
    save(data: string): void;
}
```

MySQL implementation:

```typescript
class MySQLDatabase implements Database {
    save(data: string): void {
        console.log("Saving to MySQL:", data);
    }
}
```

MongoDB implementation:

```typescript
class MongoDatabase implements Database {
    save(data: string): void {
        console.log("Saving to MongoDB:", data);
    }
}
```

High-level service:

```typescript
class UserService {
    constructor(private database: Database) {}

    createUser(): void {
        this.database.save("New User");
    }
}
```

Usage:

```typescript
const database = new MySQLDatabase();

const userService = new UserService(database);

userService.createUser();
```

Switching the database:

```typescript
const database = new MongoDatabase();

const userService = new UserService(database);

userService.createUser();
```

`UserService` does not need modification.

### DIP vs Dependency Injection

These concepts are related but different.

| DIP | Dependency Injection |
|---|---|
| Design principle | Implementation technique |
| Focuses on dependency direction | Focuses on supplying dependencies |
| Encourages abstraction-based dependencies | Passes dependencies from outside |
| Architectural concept | Programming technique |

**Remember:** Dependency Injection is one way to implement Dependency Inversion, but they are not the same thing.

---

# 9. DRY, KISS and YAGNI

These are three additional software engineering principles.

## 9.1 DRY – Don't Repeat Yourself

Avoid duplicating the same business logic in multiple places.

Incorrect:

```typescript
function calculateUserDiscount(price: number): number {
    return price * 0.10;
}

function calculateProductDiscount(price: number): number {
    return price * 0.10;
}
```

Correct, if both operations genuinely follow the same discount rule:

```typescript
function calculateDiscount(
    price: number,
    percentage: number
): number {
    return price * percentage / 100;
}
```

Usage:

```typescript
calculateDiscount(1000, 10);
```

**Important:** Avoid premature abstraction. Two pieces of code that look similar today may represent different business rules and may need to evolve independently.

## 9.2 KISS – Keep It Simple, Stupid

Prefer simple solutions over unnecessary complexity.

Unnecessarily complicated:

```typescript
class NumberProcessor {
    process(value: number): number {
        return Number(
            String(value)
                .split("")
                .join("")
        );
    }
}
```

Simple:

```typescript
function process(value: number): number {
    return value;
}
```

## 9.3 YAGNI – You Aren't Gonna Need It

Do not implement functionality until it is actually required.

Example:

You are building an Expense Tracker.

Currently required:

- Add expense.
- Update expense.
- Delete expense.
- View expenses.

You should not immediately build:

- AI-based financial predictions.
- Cryptocurrency integrations.
- Multi-currency investment analytics.
- Automated tax filing.

Build according to actual requirements.

---

# 10. Introduction to Design Patterns

Design patterns are reusable solutions to commonly occurring software design problems.

They are not ready-made code snippets. They are established approaches to organizing software.

The Gang of Four (GoF) traditionally classifies 23 design patterns into three categories.

| Category | Purpose |
|---|---|
| Creational | Object creation |
| Structural | Object and class composition |
| Behavioral | Communication and responsibilities |

---

# 11. Creational Design Patterns

Creational patterns deal with object creation.

They help control how objects are instantiated.

We will cover five important patterns.

---

## 11.1 Singleton Pattern

**Definition:**

Singleton ensures that a class has one controlled instance within a particular application context.

Example:

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

    connect(): void {
        console.log("Connected to database");
    }
}
```

Usage:

```typescript
const db1 = DatabaseConnection.getInstance();

const db2 = DatabaseConnection.getInstance();

console.log(db1 === db2); // true
```

Both variables reference the same instance.

### How It Works

1. The constructor is private.
2. External code cannot directly instantiate the class.
3. The class maintains a static instance.
4. `getInstance()` creates the instance only when needed.
5. Future calls return the same instance.

### Real-World Use Cases

- Application-wide configuration.
- Certain logging services.
- Shared connection managers.
- Controlled resource managers.

### Important Limitations

Singleton can introduce:

- Global mutable state.
- Difficult unit testing.
- Hidden dependencies.
- Problems with concurrent initialization if implemented incorrectly.
- State leakage between tests or requests.

In Node.js, module-level objects are often already cached per module instance, so an explicit Singleton class may be unnecessary.

**Use Singleton only when a genuinely shared instance is required.**

---

## 11.2 Factory Pattern

**Definition:**

Factory centralizes object creation and hides the concrete instantiation logic from the client.

Example: Notification system.

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

class SMSNotification implements Notification {
    send(message: string): void {
        console.log("SMS:", message);
    }
}

class PushNotification implements Notification {
    send(message: string): void {
        console.log("Push:", message);
    }
}
```

Factory:

```typescript
class NotificationFactory {
    static create(type: string): Notification {
        switch (type) {
            case "email":
                return new EmailNotification();

            case "sms":
                return new SMSNotification();

            case "push":
                return new PushNotification();

            default:
                throw new Error("Invalid notification type");
        }
    }
}
```

Usage:

```typescript
const notification = NotificationFactory.create("email");

notification.send("Your account was created");
```

### Benefits

- Centralized object creation.
- Client does not need to know concrete classes.
- Easier to introduce implementations.

### Real-World Use Cases

- Payment provider selection.
- Notification provider selection.
- Database driver creation.
- File format processors.

**Note:** This is a simple factory. The GoF Factory Method pattern specifically uses an overridable creation method to let subclasses determine which product to instantiate.

---

## 11.3 Abstract Factory Pattern

**Definition:**

Abstract Factory provides an interface for creating families of related objects without specifying their concrete classes.

Imagine an application supporting different UI themes.

```typescript
interface Button {
    render(): void;
}

interface Input {
    render(): void;
}
```

Light theme components:

```typescript
class LightButton implements Button {
    render(): void {
        console.log("Light button");
    }
}

class LightInput implements Input {
    render(): void {
        console.log("Light input");
    }
}
```

Dark theme components:

```typescript
class DarkButton implements Button {
    render(): void {
        console.log("Dark button");
    }
}

class DarkInput implements Input {
    render(): void {
        console.log("Dark input");
    }
}
```

Abstract Factory:

```typescript
interface UIFactory {
    createButton(): Button;
    createInput(): Input;
}
```

Light factory:

```typescript
class LightThemeFactory implements UIFactory {
    createButton(): Button {
        return new LightButton();
    }

    createInput(): Input {
        return new LightInput();
    }
}
```

Dark factory:

```typescript
class DarkThemeFactory implements UIFactory {
    createButton(): Button {
        return new DarkButton();
    }

    createInput(): Input {
        return new DarkInput();
    }
}
```

Usage:

```typescript
function renderUI(factory: UIFactory): void {
    const button = factory.createButton();
    const input = factory.createInput();

    button.render();
    input.render();
}

renderUI(new DarkThemeFactory());
```

### Difference Between Factory and Abstract Factory

| Factory | Abstract Factory |
|---|---|
| Creates an object or product | Creates a family of related products |
| Usually simpler | Usually more elaborate |
| Example: NotificationFactory | Example: ThemeFactory |

---

## 11.4 Builder Pattern

**Definition:**

Builder separates complex object construction from the final representation.

It is particularly useful when an object has many optional properties or construction steps.

Without Builder:

```typescript
interface User {
    name: string;
    email: string;
    age?: number;
    phone?: string;
    address?: string;
    isActive?: boolean;
}

const user: User = {
    name: "Ali",
    email: "ali@example.com",
    age: 25,
    phone: "9999999999",
    address: "Ahmedabad",
    isActive: true
};
```

For complex construction logic, Builder can make the process more controlled.

```typescript
class UserBuilder {
    private user: User = {
        name: "",
        email: ""
    };

    setName(name: string): this {
        this.user.name = name;
        return this;
    }

    setEmail(email: string): this {
        this.user.email = email;
        return this;
    }

    setAge(age: number): this {
        this.user.age = age;
        return this;
    }

    setPhone(phone: string): this {
        this.user.phone = phone;
        return this;
    }

    setAddress(address: string): this {
        this.user.address = address;
        return this;
    }

    setActive(isActive: boolean): this {
        this.user.isActive = isActive;
        return this;
    }

    build(): User {
        if (!this.user.name || !this.user.email) {
            throw new Error("Name and email are required");
        }

        return { ...this.user };
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
    .setActive(true)
    .build();

console.log(user);
```

### Benefits

- Readable object construction.
- Better control over validation.
- Useful for complex objects.
- Avoids extremely long constructors.

---

## 11.5 Prototype Pattern

**Definition:**

Prototype creates new objects by cloning an existing object.

Example:

```typescript
interface Product {
    name: string;
    price: number;
}

const originalProduct: Product = {
    name: "Laptop",
    price: 50000
};

const clonedProduct: Product = {
    ...originalProduct
};

clonedProduct.price = 45000;

console.log(originalProduct.price); // 50000
console.log(clonedProduct.price);   // 45000
```

### Important: Shallow Copy vs Deep Copy

Object spread creates a shallow copy.

```typescript
const original = {
    name: "Laptop",
    details: {
        brand: "Lenovo"
    }
};

const clone = { ...original };

clone.details.brand = "Dell";

console.log(original.details.brand); // Dell
```

The nested `details` object is still shared.

For supported data types, `structuredClone()` can create a deep copy:

```typescript
const deepClone = structuredClone(original);
```

However, it has limitations for certain values such as functions and some custom object behaviors.

### Use Cases

- Cloning configuration objects.
- Creating similar objects efficiently.
- Template-based object creation.

---

# 12. Structural Design Patterns

Structural patterns describe how objects and classes are organized to build larger structures.

We will cover six patterns.

---

## 12.1 Adapter Pattern

**Definition:**

Adapter allows incompatible interfaces to work together.

Imagine your application expects a standard payment interface, but an external provider exposes a different method.

Your application expects:

```typescript
interface PaymentGateway {
    pay(amount: number): void;
}
```

External provider:

```typescript
class ExternalPaymentProvider {
    makeTransaction(value: number): void {
        console.log("External transaction:", value);
    }
}
```

Adapter:

```typescript
class PaymentAdapter implements PaymentGateway {
    constructor(
        private provider: ExternalPaymentProvider
    ) {}

    pay(amount: number): void {
        this.provider.makeTransaction(amount);
    }
}
```

Usage:

```typescript
const provider = new ExternalPaymentProvider();

const paymentGateway = new PaymentAdapter(provider);

paymentGateway.pay(1000);
```

### Real-World Use Cases

- Integrating third-party APIs.
- Switching payment providers.
- Legacy system integration.
- Adapting different database interfaces.

---

## 12.2 Decorator Pattern

**Definition:**

Decorator adds behavior to an existing object without changing its original class.

Example: Notification with additional logging.

```typescript
interface Notifier {
    send(message: string): void;
}
```

Base implementation:

```typescript
class EmailNotifier implements Notifier {
    send(message: string): void {
        console.log("Email sent:", message);
    }
}
```

Decorator:

```typescript
class LoggingNotifier implements Notifier {
    constructor(private notifier: Notifier) {}

    send(message: string): void {
        console.log("Logging notification");

        this.notifier.send(message);
    }
}
```

Usage:

```typescript
const email = new EmailNotifier();

const notifier = new LoggingNotifier(email);

notifier.send("Welcome");
```

Output:

```text
Logging notification
Email sent: Welcome
```

### Real-World Use Cases

- Logging.
- Caching.
- Authorization.
- Request monitoring.
- Adding compression or encryption behavior.

**Important distinction:** The Decorator design pattern is different from TypeScript's decorator syntax (`@decorator`). They are related concepts but not the same implementation technique.

---

## 12.3 Facade Pattern

**Definition:**

Facade provides a simplified interface to a complex subsystem.

Imagine an order-processing system requiring several operations.

```typescript
class InventoryService {
    checkStock(): void {
        console.log("Checking stock");
    }
}

class PaymentService {
    processPayment(): void {
        console.log("Processing payment");
    }
}

class ShippingService {
    arrangeShipping(): void {
        console.log("Arranging shipping");
    }
}
```

Without a Facade, the client must coordinate all three services.

Facade:

```typescript
class OrderFacade {
    constructor(
        private inventory: InventoryService,
        private payment: PaymentService,
        private shipping: ShippingService
    ) {}

    placeOrder(): void {
        this.inventory.checkStock();

        this.payment.processPayment();

        this.shipping.arrangeShipping();
    }
}
```

Usage:

```typescript
const order = new OrderFacade(
    new InventoryService(),
    new PaymentService(),
    new ShippingService()
);

order.placeOrder();
```

### Benefits

- Simplifies client code.
- Hides subsystem complexity.
- Provides a clear entry point.

---

## 12.4 Proxy Pattern

**Definition:**

Proxy provides a substitute object that controls access to another object.

Example: Lazy loading a report.

```typescript
interface Report {
    generate(): void;
}
```

Real object:

```typescript
class ExpensiveReport implements Report {
    generate(): void {
        console.log("Generating expensive report...");
    }
}
```

Proxy:

```typescript
class ReportProxy implements Report {
    private report?: ExpensiveReport;

    generate(): void {
        if (!this.report) {
            console.log("Creating report object");

            this.report = new ExpensiveReport();
        }

        this.report.generate();
    }
}
```

Usage:

```typescript
const report = new ReportProxy();

report.generate();

report.generate();
```

The actual report object is created only when required.

### Real-World Use Cases

- Lazy loading.
- Access control.
- Caching.
- Logging.
- Remote service proxies.

---

## 12.5 Composite Pattern

**Definition:**

Composite allows individual objects and groups of objects to be treated uniformly.

Example: File system.

```typescript
interface FileSystemItem {
    getName(): string;
}
```

File:

```typescript
class File implements FileSystemItem {
    constructor(private name: string) {}

    getName(): string {
        return this.name;
    }
}
```

Folder:

```typescript
class Folder implements FileSystemItem {
    private items: FileSystemItem[] = [];

    constructor(private name: string) {}

    add(item: FileSystemItem): void {
        this.items.push(item);
    }

    getName(): string {
        return this.name;
    }

    getItems(): FileSystemItem[] {
        return this.items;
    }
}
```

Usage:

```typescript
const root = new Folder("Root");

const documents = new Folder("Documents");

const file1 = new File("resume.pdf");

const file2 = new File("notes.txt");

documents.add(file1);

documents.add(file2);

root.add(documents);

console.log(root.getName());
```

A folder can contain files or other folders.

---

## 12.6 Bridge Pattern

**Definition:**

Bridge separates an abstraction from its implementation so both can evolve independently.

Example: Notification delivery through different channels.

```typescript
interface MessageSender {
    sendMessage(message: string): void;
}
```

Implementations:

```typescript
class EmailSender implements MessageSender {
    sendMessage(message: string): void {
        console.log("Email:", message);
    }
}

class SMSSender implements MessageSender {
    sendMessage(message: string): void {
        console.log("SMS:", message);
    }
}
```

Abstraction:

```typescript
class Notification {
    constructor(
        protected sender: MessageSender
    ) {}

    send(message: string): void {
        this.sender.sendMessage(message);
    }
}
```

Extended abstraction:

```typescript
class UrgentNotification extends Notification {
    send(message: string): void {
        this.sender.sendMessage(`URGENT: ${message}`);
    }
}
```

Usage:

```typescript
const emailNotification = new Notification(
    new EmailSender()
);

emailNotification.send("Account created");

const urgentSMS = new UrgentNotification(
    new SMSSender()
);

urgentSMS.send("Security alert");
```

The notification abstraction and delivery mechanism can change independently.

---

# 13. Behavioral Design Patterns

Behavioral patterns focus on communication and the distribution of responsibilities between objects.

We will cover six important patterns.

---

## 13.1 Strategy Pattern

**Definition:**

Strategy allows you to define multiple algorithms and select one at runtime.

Example: Discount calculation.

```typescript
interface DiscountStrategy {
    calculate(price: number): number;
}
```

Strategies:

```typescript
class NoDiscount implements DiscountStrategy {
    calculate(price: number): number {
        return price;
    }
}

class PercentageDiscount implements DiscountStrategy {
    constructor(private percentage: number) {}

    calculate(price: number): number {
        return price - (price * this.percentage / 100);
    }
}

class FixedDiscount implements DiscountStrategy {
    constructor(private discount: number) {}

    calculate(price: number): number {
        return Math.max(0, price - this.discount);
    }
}
```

Context:

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
const percentagePricing = new PricingService(
    new PercentageDiscount(10)
);

console.log(percentagePricing.calculateFinalPrice(1000));
// 900

const fixedPricing = new PricingService(
    new FixedDiscount(100)
);

console.log(fixedPricing.calculateFinalPrice(1000));
// 900
```

### Real-World Use Cases

- Payment algorithms.
- Discount calculations.
- Authentication methods.
- File compression algorithms.
- Sorting algorithms.

---

## 13.2 Observer Pattern

**Definition:**

Observer allows one object to notify multiple dependent objects when its state changes.

Example: YouTube-style subscription notifications.

```typescript
interface Observer {
    update(message: string): void;
}
```

Subscribers:

```typescript
class Subscriber implements Observer {
    constructor(private name: string) {}

    update(message: string): void {
        console.log(`${this.name} received: ${message}`);
    }
}
```

Subject:

```typescript
class YouTubeChannel {
    private subscribers: Observer[] = [];

    subscribe(observer: Observer): void {
        this.subscribers.push(observer);
    }

    unsubscribe(observer: Observer): void {
        this.subscribers = this.subscribers.filter(
            subscriber => subscriber !== observer
        );
    }

    uploadVideo(title: string): void {
        const message = `New video uploaded: ${title}`;

        this.subscribers.forEach(subscriber => {
            subscriber.update(message);
        });
    }
}
```

Usage:

```typescript
const channel = new YouTubeChannel();

const user1 = new Subscriber("Ali");

const user2 = new Subscriber("Ahmed");

channel.subscribe(user1);

channel.subscribe(user2);

channel.uploadVideo("TypeScript Advanced Concepts");
```

### Observer vs Pub/Sub

These concepts are related but have different structures.

| Observer | Publish/Subscribe |
|---|---|
| Subject directly notifies observers | Publisher communicates through a broker or event channel |
| Direct object relationships | More decoupled communication |
| Often in-process | Often supports distributed systems |
| Example: UI event listeners | Example: RabbitMQ, Kafka, Redis Pub/Sub |

---

## 13.3 Command Pattern

**Definition:**

Command encapsulates a request as an object.

It separates the object requesting an operation from the object performing it.

Example:

```typescript
interface Command {
    execute(): void;
}
```

Receiver:

```typescript
class Light {
    turnOn(): void {
        console.log("Light ON");
    }

    turnOff(): void {
        console.log("Light OFF");
    }
}
```

Commands:

```typescript
class TurnOnCommand implements Command {
    constructor(private light: Light) {}

    execute(): void {
        this.light.turnOn();
    }
}

class TurnOffCommand implements Command {
    constructor(private light: Light) {}

    execute(): void {
        this.light.turnOff();
    }
}
```

Invoker:

```typescript
class RemoteControl {
    executeCommand(command: Command): void {
        command.execute();
    }
}
```

Usage:

```typescript
const light = new Light();

const remote = new RemoteControl();

remote.executeCommand(new TurnOnCommand(light));

remote.executeCommand(new TurnOffCommand(light));
```

### Real-World Use Cases

- Background job processing.
- Undo/redo operations.
- Audit logging.
- Task queues.
- Transaction commands.

---

## 13.4 State Pattern

**Definition:**

State allows an object to change its behavior when its internal state changes.

Example: Order management.

```typescript
interface OrderState {
    next(order: Order): void;
}
```

States:

```typescript
class PendingState implements OrderState {
    next(order: Order): void {
        console.log("Order moved to processing");

        order.setState(new ProcessingState());
    }
}

class ProcessingState implements OrderState {
    next(order: Order): void {
        console.log("Order shipped");

        order.setState(new ShippedState());
    }
}

class ShippedState implements OrderState {
    next(order: Order): void {
        console.log("Order already shipped");
    }
}
```

Context:

```typescript
class Order {
    constructor(
        private state: OrderState = new PendingState()
    ) {}

    setState(state: OrderState): void {
        this.state = state;
    }

    next(): void {
        this.state.next(this);
    }
}
```

Usage:

```typescript
const order = new Order();

order.next();

order.next();

order.next();
```

Output:

```text
Order moved to processing
Order shipped
Order already shipped
```

### Use Cases

- Order lifecycle.
- Payment lifecycle.
- Authentication state.
- Workflow management.

---

## 13.5 Template Method Pattern

**Definition:**

Template Method defines the structure of an algorithm in a base class while allowing subclasses to customize individual steps.

Example: Data import process.

```typescript
abstract class DataImporter {
    import(): void {
        this.readData();

        this.validateData();

        this.saveData();
    }

    protected abstract readData(): void;

    protected abstract validateData(): void;

    protected abstract saveData(): void;
}
```

CSV importer:

```typescript
class CSVImporter extends DataImporter {
    protected readData(): void {
        console.log("Reading CSV");
    }

    protected validateData(): void {
        console.log("Validating CSV");
    }

    protected saveData(): void {
        console.log("Saving CSV data");
    }
}
```

Excel importer:

```typescript
class ExcelImporter extends DataImporter {
    protected readData(): void {
        console.log("Reading Excel");
    }

    protected validateData(): void {
        console.log("Validating Excel");
    }

    protected saveData(): void {
        console.log("Saving Excel data");
    }
}
```

Usage:

```typescript
const importer = new CSVImporter();

importer.import();
```

The overall algorithm remains consistent, but individual steps vary.

---

## 13.6 Chain of Responsibility Pattern

**Definition:**

Chain of Responsibility passes a request through a sequence of handlers.

Each handler can process the request or pass it to the next handler.

Example: Authentication middleware pipeline.

```typescript
interface Handler {
    setNext(handler: Handler): Handler;

    handle(request: string): string | null;
}
```

Base handler:

```typescript
abstract class BaseHandler implements Handler {
    private nextHandler?: Handler;

    setNext(handler: Handler): Handler {
        this.nextHandler = handler;

        return handler;
    }

    handle(request: string): string | null {
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }

        return null;
    }
}
```

Handlers:

```typescript
class AuthenticationHandler extends BaseHandler {
    handle(request: string): string | null {
        if (request !== "authenticated") {
            return "Authentication failed";
        }

        return super.handle(request);
    }
}

class AuthorizationHandler extends BaseHandler {
    handle(request: string): string | null {
        console.log("Checking authorization");

        return super.handle(request);
    }
}

class LoggingHandler extends BaseHandler {
    handle(request: string): string | null {
        console.log("Logging request");

        return super.handle(request);
    }
}
```

Usage:

```typescript
const auth = new AuthenticationHandler();

const authorization = new AuthorizationHandler();

const logging = new LoggingHandler();

auth.setNext(authorization).setNext(logging);

console.log(auth.handle("authenticated"));
```

### Real-World Use Cases

- Express middleware.
- Request validation.
- Authentication pipelines.
- Logging pipelines.
- Approval workflows.

---

# 14. Enterprise Application Design Patterns

Enterprise applications often use additional architectural patterns to organize business logic and infrastructure.

Important patterns include:

1. Repository Pattern.
2. Unit of Work Pattern.
3. Data Mapper Pattern.
4. Active Record Pattern.
5. Data Transfer Object (DTO).
6. Service Layer Pattern.

---

## 14.1 Repository Pattern

**Definition:**

Repository provides an abstraction between business logic and data access.

Instead of directly executing database queries inside business services, the application communicates through repository interfaces.

### Without Repository

```typescript
class ExpenseService {
    async createExpense(data: any): Promise<void> {
        await sequelize.models.Expense.create(data);
    }
}
```

Problem:

Business logic directly depends on Sequelize.

### With Repository

First, define the entity:

```typescript
interface Expense {
    id: string;
    title: string;
    amount: number;
}
```

Repository interface:

```typescript
interface ExpenseRepository {
    create(expense: Expense): Promise<void>;

    findById(id: string): Promise<Expense | null>;

    findAll(): Promise<Expense[]>;

    delete(id: string): Promise<void>;
}
```

Implementation:

```typescript
class MySQLExpenseRepository implements ExpenseRepository {
    async create(expense: Expense): Promise<void> {
        console.log("Saving expense to MySQL");
    }

    async findById(id: string): Promise<Expense | null> {
        console.log("Finding expense:", id);

        return null;
    }

    async findAll(): Promise<Expense[]> {
        return [];
    }

    async delete(id: string): Promise<void> {
        console.log("Deleting expense:", id);
    }
}
```

Service:

```typescript
class ExpenseService {
    constructor(
        private repository: ExpenseRepository
    ) {}

    async createExpense(expense: Expense): Promise<void> {
        await this.repository.create(expense);
    }
}
```

Usage:

```typescript
const repository = new MySQLExpenseRepository();

const service = new ExpenseService(repository);
```

### Benefits

- Business logic does not depend on a specific database.
- Easier unit testing.
- Easier database replacement.
- Centralized persistence logic.

**Important:** An ORM already provides some data-access abstractions. You should introduce a separate repository layer when it provides meaningful separation, business semantics, or testability—not simply because every project must have one.

---

## 14.2 Unit of Work Pattern

**Definition:**

Unit of Work tracks multiple changes and coordinates their persistence as one logical transaction.

Imagine creating an order with multiple order items.

All related database changes should succeed or fail together.

Example using Sequelize:

```typescript
import { Sequelize } from "sequelize";

async function createOrder(
    sequelize: Sequelize
): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
        await sequelize.models.Order.create(
            {
                total: 1000
            },
            { transaction }
        );

        await sequelize.models.OrderItem.create(
            {
                productId: 1,
                quantity: 2
            },
            { transaction }
        );

        await transaction.commit();

        console.log("Order created successfully");
    } catch (error) {
        await transaction.rollback();

        throw error;
    }
}
```

### Why Unit of Work?

Without a transaction:

- Order might be created.
- Order item might fail.
- Database could contain incomplete data.

With a transaction:

- All operations commit together.
- Or all operations roll back.

**Important:** A database transaction is not automatically the same as a complete Unit of Work implementation. A full Unit of Work can also track pending changes and coordinate repositories.

---

## 14.3 Data Mapper Pattern

**Definition:**

Data Mapper separates domain objects from database persistence logic.

The domain object does not need to know how it is stored.

Example:

```typescript
class User {
    constructor(
        public id: string,
        public name: string,
        public email: string
    ) {}
}
```

Mapper:

```typescript
class UserMapper {
    toDatabase(user: User): object {
        return {
            id: user.id,
            name: user.name,
            email: user.email
        };
    }

    toDomain(row: any): User {
        return new User(
            row.id,
            row.name,
            row.email
        );
    }
}
```

The mapper converts between persistence representations and domain objects.

## 14.4 Active Record Pattern

**Definition:**

Active Record combines data and persistence behavior inside the same object or model.

Example using Sequelize:

```typescript
import {
    Model,
    DataTypes
} from "sequelize";

class UserModel extends Model {
    declare id: number;
    declare name: string;
    declare email: string;
}

UserModel.init(
    {
        name: DataTypes.STRING,
        email: DataTypes.STRING
    },
    {
        sequelize,
        modelName: "User"
    }
);
```

Usage:

```typescript
const user = await UserModel.create({
    name: "Ali",
    email: "ali@example.com"
});
```

The model provides both data representation and persistence functionality.

### Data Mapper vs Active Record

| Data Mapper | Active Record |
|---|---|
| Separates domain and persistence | Combines data and persistence behavior |
| Domain objects can remain persistence-independent | Models commonly know persistence operations |
| Useful for complex domains | Useful for simpler CRUD-oriented applications |
| More architectural separation | Often less boilerplate |

---

## 14.5 Data Transfer Object (DTO)

**Definition:**

DTO is an object used to transfer data between different layers or systems.

It defines the shape of data exchanged at an application boundary.

Example:

```typescript
interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}
```

Controller:

```typescript
async function createUserController(req: any, res: any) {
    const data: CreateUserDTO = req.body;

    // Pass validated DTO to application service.

    res.status(201).json({
        message: "User created"
    });
}
```

### Why DTO?

- Controls which fields clients can submit.
- Avoids exposing internal database models.
- Separates API contracts from domain models.
- Supports validation.
- Helps prevent accidental mass assignment.

**Important:** TypeScript types disappear at runtime. Validate incoming request data using runtime validation tools such as Zod or Joi.

---

## 14.6 Service Layer Pattern

**Definition:**

Service Layer organizes application operations and coordinates business workflows.

Example:

```typescript
class ExpenseService {
    constructor(
        private repository: ExpenseRepository
    ) {}

    async createExpense(expense: Expense): Promise<void> {
        if (expense.amount <= 0) {
            throw new Error("Invalid expense amount");
        }

        await this.repository.create(expense);
    }
}
```

A service layer keeps controllers focused on HTTP concerns rather than business workflows.

---

# 15. Dependency Injection (DI)

Dependency Injection is one of the most important concepts in enterprise TypeScript development.

**Definition:**

Dependency Injection means providing an object with its required dependencies from outside instead of allowing it to create those dependencies internally.

### 15.1 Without Dependency Injection

```typescript
class EmailService {
    send(): void {
        console.log("Email sent");
    }
}

class UserService {
    private emailService = new EmailService();

    createUser(): void {
        console.log("User created");

        this.emailService.send();
    }
}
```

Problem:

`UserService` creates its own dependency.

It is difficult to replace `EmailService` with another implementation.

### 15.2 With Dependency Injection

```typescript
interface EmailProvider {
    send(): void;
}

class SMTPEmailService implements EmailProvider {
    send(): void {
        console.log("Email sent using SMTP");
    }
}

class SendGridEmailService implements EmailProvider {
    send(): void {
        console.log("Email sent using SendGrid");
    }
}
```

Service:

```typescript
class UserService {
    constructor(
        private emailProvider: EmailProvider
    ) {}

    createUser(): void {
        console.log("User created");

        this.emailProvider.send();
    }
}
```

Inject dependency:

```typescript
const emailProvider = new SMTPEmailService();

const userService = new UserService(emailProvider);

userService.createUser();
```

Change implementation:

```typescript
const emailProvider = new SendGridEmailService();

const userService = new UserService(emailProvider);

userService.createUser();
```

The `UserService` class remains unchanged.

---

# 16. Types of Dependency Injection

There are three commonly discussed forms of DI.

## 16.1 Constructor Injection

Dependencies are passed through the constructor.

```typescript
class UserService {
    constructor(
        private emailService: EmailService
    ) {}
}
```

This is generally the preferred approach for required dependencies.

## 16.2 Property Injection

Dependencies are assigned through properties.

```typescript
class UserService {
    emailService!: EmailService;
}
```

Usage:

```typescript
const service = new UserService();

service.emailService = new EmailService();
```

Potential problem: The dependency might not be initialized before use.

## 16.3 Method Injection

Dependencies are passed directly into a method.

```typescript
class ReportService {
    generate(emailService: EmailService): void {
        emailService.send();
    }
}
```

Useful when a dependency is required only for a particular operation.

### Comparison

| Type | Dependency location | Typical use |
|---|---|---|
| Constructor Injection | Constructor | Required dependencies |
| Property Injection | Property | Framework-managed dependencies |
| Method Injection | Method argument | Operation-specific dependencies |

---

# 17. Dependency Injection Containers

In larger applications, manually creating and passing dependencies can become repetitive.

A DI container manages dependency registration and resolution.

Popular TypeScript DI libraries include:

- [InversifyJS](https://inversify.io/?utm_source=chatgpt.com)
- [TSyringe](https://github.com/microsoft/tsyringe?utm_source=chatgpt.com)

Conceptually, a container works like this:

```typescript
container.register(
    "EmailProvider",
    SMTPEmailService
);

container.register(
    "UserService",
    UserService
);
```

Later:

```typescript
const userService = container.resolve(UserService);
```

The container resolves and supplies required dependencies.

### Common DI Lifetimes

| Lifetime | Meaning |
|---|---|
| Singleton | One shared instance per container |
| Transient | New instance each time it is resolved |
| Request-scoped | One instance per request scope |

**Important:** A singleton should not retain request-specific state. Doing so can cause data leakage between requests. Request-scoped services must also be handled carefully when resolving dependencies from longer-lived services.

### Service Locator Anti-Pattern

Avoid hiding dependencies inside a global container lookup.

```typescript
class UserService {
    createUser(): void {
        const email = Container.resolve(EmailService);

        email.send();
    }
}
```

This is called the Service Locator approach.

It hides dependencies instead of explicitly declaring them.

Prefer constructor injection:

```typescript
class UserService {
    constructor(
        private email: EmailService
    ) {}

    createUser(): void {
        this.email.send();
    }
}
```

---

# 18. Inversion of Control (IoC)

**Definition:**

Inversion of Control means transferring control of certain application responsibilities from your code to an external framework or container.

Consider Express:

```typescript
import express from "express";

const app = express();

app.get("/users", (req, res) => {
    res.json({
        message: "Users"
    });
});

app.listen(3000);
```

You define the route handler, but Express controls when that handler is executed.

This is an example of IoC.

### IoC vs DI

| IoC | DI |
|---|---|
| Broad architectural principle | Specific technique |
| Control is transferred to an external component | Dependencies are supplied externally |
| Can be implemented through frameworks and event systems | Commonly implements IoC |
| Example: Express invokes route handlers | Example: Constructor receives a repository |

**Remember:** DI is one form of IoC, not the only form.

---

# 19. Clean Architecture

Clean Architecture is an architectural approach that separates business rules from infrastructure and external frameworks.

Its central idea is:

**Business logic should not depend directly on external technologies.**

The architecture is commonly represented using four layers.



## 19.1 Four Main Layers

### Layer 1: Entities

Contains core business rules and domain objects.

Example:

```typescript
class Expense {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly amount: number
    ) {
        if (amount <= 0) {
            throw new Error("Expense must be positive");
        }
    }
}
```

Entities should not depend on Express, Sequelize, MongoDB, or HTTP.

### Layer 2: Use Cases

Contains application-specific business workflows.

Example:

```typescript
class CreateExpenseUseCase {
    constructor(
        private repository: ExpenseRepository
    ) {}

    async execute(expense: Expense): Promise<void> {
        await this.repository.create(expense);
    }
}
```

### Layer 3: Interface Adapters

Converts data between external formats and internal application structures.

Examples:

- Controllers.
- Presenters.
- Repository implementations.
- DTO mappers.

### Layer 4: Frameworks and Drivers

Contains external technologies.

Examples:

- Express.js.
- Sequelize.
- MySQL.
- MongoDB.
- Redis.
- External APIs.

## 19.2 Dependency Rule

The most important Clean Architecture rule:

**Source code dependencies must point inward.**

For example:

```text
Express Controller
       |
       v
CreateExpenseUseCase
       |
       v
ExpenseRepository Interface
       ^
       |
MySQLExpenseRepository
```

The use case knows the repository interface.

The MySQL implementation depends on that interface.

The use case does not need to know that MySQL exists.

---

# 20. Clean Architecture – Practical TypeScript Implementation

Let's design an Expense Tracker feature.

Requirements:

1. Create an expense.
2. Validate its amount.
3. Save it through a repository.
4. Return an HTTP response.

### 20.1 Recommended Folder Structure

```text
src/
│
├── domain/
│   └── entities/
│       └── Expense.ts
│
├── application/
│   ├── interfaces/
│   │   └── ExpenseRepository.ts
│   │
│   └── use-cases/
│       └── CreateExpenseUseCase.ts
│
├── infrastructure/
│   └── database/
│       └── MySQLExpenseRepository.ts
│
├── presentation/
│   └── controllers/
│       └── ExpenseController.ts
│
├── config/
│   └── container.ts
│
└── server.ts
```

### 20.2 Domain Entity

`domain/entities/Expense.ts`

```typescript
export class Expense {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly amount: number
    ) {
        if (!title.trim()) {
            throw new Error("Title is required");
        }

        if (!Number.isFinite(amount) || amount <= 0) {
            throw new Error("Invalid expense amount");
        }
    }
}
```

### 20.3 Repository Interface

`application/interfaces/ExpenseRepository.ts`

```typescript
import { Expense } from "../../domain/entities/Expense";

export interface ExpenseRepository {
    create(expense: Expense): Promise<void>;
}
```

### 20.4 Use Case

`application/use-cases/CreateExpenseUseCase.ts`

```typescript
import { Expense } from "../../domain/entities/Expense";

import {
    ExpenseRepository
} from "../interfaces/ExpenseRepository";

export class CreateExpenseUseCase {
    constructor(
        private repository: ExpenseRepository
    ) {}

    async execute(expense: Expense): Promise<void> {
        await this.repository.create(expense);
    }
}
```

### 20.5 Database Repository Implementation

`infrastructure/database/MySQLExpenseRepository.ts`

```typescript
import { Expense } from "../../domain/entities/Expense";

import {
    ExpenseRepository
} from "../../application/interfaces/ExpenseRepository";

export class MySQLExpenseRepository implements ExpenseRepository {
    async create(expense: Expense): Promise<void> {
        // Replace with an actual Sequelize model operation.

        console.log("Saving expense to MySQL:", expense);
    }
}
```

### 20.6 Controller

`presentation/controllers/ExpenseController.ts`

```typescript
import { Request, Response } from "express";

import { Expense } from "../../domain/entities/Expense";

import {
    CreateExpenseUseCase
} from "../../application/use-cases/CreateExpenseUseCase";

export class ExpenseController {
    constructor(
        private createExpenseUseCase: CreateExpenseUseCase
    ) {}

    create = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const { id, title, amount } = req.body;

            const expense = new Expense(
                id,
                title,
                amount
            );

            await this.createExpenseUseCase.execute(expense);

            res.status(201).json({
                message: "Expense created successfully"
            });
        } catch (error) {
            res.status(400).json({
                message: error instanceof Error
                    ? error.message
                    : "Something went wrong"
            });
        }
    };
}
```

In production, validate the request body before constructing the entity, use a trusted ID generator, and map domain/application errors to appropriate HTTP status codes.

### 20.7 Dependency Wiring

`config/container.ts`

```typescript
import {
    MySQLExpenseRepository
} from "../infrastructure/database/MySQLExpenseRepository";

import {
    CreateExpenseUseCase
} from "../application/use-cases/CreateExpenseUseCase";

import {
    ExpenseController
} from "../presentation/controllers/ExpenseController";

const expenseRepository = new MySQLExpenseRepository();

const createExpenseUseCase = new CreateExpenseUseCase(
    expenseRepository
);

export const expenseController = new ExpenseController(
    createExpenseUseCase
);
```

### 20.8 Express Route

`server.ts`

```typescript
import express from "express";

import {
    expenseController
} from "./config/container";

const app = express();

app.use(express.json());

app.post(
    "/expenses",
    expenseController.create
);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
```

### What Did We Achieve?

The controller does not directly communicate with MySQL.

The use case does not depend on Sequelize.

The domain entity does not depend on Express.

The database implementation can be replaced without changing the use case.

This is the central benefit of Clean Architecture.

---

# 21. Hexagonal Architecture (Ports and Adapters)

Hexagonal Architecture was introduced by Alistair Cockburn.

It is also known as **Ports and Adapters Architecture**.

Its primary goal is to isolate the application core from external systems.



## 21.1 Core Concept

Imagine an application that interacts with:

- Express API.
- CLI.
- MySQL.
- MongoDB.
- Redis.
- Email provider.

Instead of allowing these technologies to directly control business logic, the application defines ports.

Adapters connect external technologies to those ports.

## 21.2 Ports

Ports are interfaces that define how the application communicates with the outside world.

There are two major categories.

### Primary Ports (Driving Ports)

These define how external actors can interact with the application.

Examples:

- CreateExpenseUseCase.
- LoginUseCase.
- GenerateReportUseCase.

### Secondary Ports (Driven Ports)

These define what the application needs from external systems.

Examples:

- ExpenseRepository.
- EmailProvider.
- PaymentGateway.
- FileStorage.

## 21.3 Adapters

Adapters implement or connect to ports.

Examples:

| Port | Adapter |
|---|---|
| ExpenseRepository | MySQLExpenseRepository |
| ExpenseRepository | MongoExpenseRepository |
| EmailProvider | SMTPEmailAdapter |
| PaymentGateway | StripePaymentAdapter |
| Driving port | ExpressExpenseController |
| Driving port | CLIExpenseAdapter |

### Example Architecture

```text
             External Actors
                    |
           -------------------
           |                 |
       Express API         CLI
           |                 |
           v                 v
        Primary Ports / Application
                    |
              Business Logic
                    |
             Secondary Ports
                    |
          ---------------------
          |         |         |
        MySQL      Redis    Email API
        Adapter   Adapter   Adapter
```

### Why Is This Useful?

You can use the same business logic through different entry points.

For example:

```text
Express API ──────┐
                  |
CLI Application ─┼── CreateExpenseUseCase
                  |
Queue Consumer ──┘
```

All three use the same application core.

You can also replace the database adapter without changing the business rules.

---

# 22. Onion Architecture

Onion Architecture was popularized by Jeffrey Palermo.

It emphasizes placing the domain model at the center of the application.



## 22.1 Main Layers

Typical Onion Architecture includes:

1. Domain Model.
2. Domain Services.
3. Application Services.
4. Infrastructure.

### Domain Model

Contains:

- Entities.
- Value Objects.
- Business rules.
- Domain interfaces.

### Domain Services

Contains business operations that do not naturally belong to one entity.

### Application Services

Coordinates use cases.

### Infrastructure

Contains:

- Database implementations.
- External APIs.
- File storage.
- Messaging.
- Framework integrations.

## 22.2 Dependency Direction

Dependencies point toward the domain core.

```text
Infrastructure
      |
      v
Application Services
      |
      v
Domain Model
```

The domain model should not depend on the database or web framework.

---

# 23. Clean vs Hexagonal vs Onion Architecture

These three architectures share an important principle: keeping business logic independent from infrastructure.

| Feature | Clean Architecture | Hexagonal Architecture | Onion Architecture |
|---|---|---|---|
| Main idea | Separate business rules into layers | Isolate application using ports and adapters | Keep domain at the center |
| Focus | Dependency direction | External communication | Domain independence |
| Core | Entities and use cases | Application core | Domain model |
| External systems | Outer layer | Adapters | Infrastructure |
| Communication | Interfaces and adapters | Ports and adapters | Interfaces and services |

### Are They Completely Different?

No.

They have substantial conceptual overlap.

All encourage:

- Separation of concerns.
- Dependency inversion.
- Framework independence.
- Testability.
- Domain independence.

The differences are mainly in terminology, emphasis, and implementation structure.

---

# 24. Domain-Driven Design (DDD)

Domain-Driven Design is an approach to software development that focuses on understanding and modeling complex business domains.

It was popularized by Eric Evans.

The central idea:

**The software model should accurately represent the business domain and its rules.**

DDD is particularly useful when business logic is complex.

Examples:

- Banking systems.
- E-commerce platforms.
- Healthcare management.
- Insurance systems.
- Enterprise resource planning.

## 24.1 What Is a Domain?

A domain is the business area that your application serves.

Examples:

| Application | Domain |
|---|---|
| Expense Tracker | Personal finance |
| E-commerce | Online commerce |
| Banking application | Financial services |
| Hospital management | Healthcare |
| Learning platform | Education |

## 24.2 What Is a Domain Model?

A domain model represents business concepts, rules, and relationships in software.

For an Expense Tracker:

```text
User
 |
 ├── Expense
 │     ├── Amount
 │     ├── Date
 │     └── Category
 │
 ├── Income
 │
 └── Budget
```

A domain model should represent meaningful business concepts rather than simply copying database tables.

---

# 25. Strategic DDD

Strategic DDD focuses on understanding and dividing a large business domain.

Important concepts:

1. Ubiquitous Language.
2. Bounded Context.
3. Context Map.
4. Subdomains.

## 25.1 Ubiquitous Language

Ubiquitous Language means using a common vocabulary shared by developers, domain experts, and business stakeholders.

Imagine an e-commerce application.

Business terms might include:

- Customer.
- Cart.
- Order.
- Payment.
- Shipment.
- Refund.

Developers should use the same concepts in code.

Example:

```typescript
class Order {
    // Business concept represented in code.
}
```

Avoid using unclear names such as:

```typescript
class DataManager {
    // Unclear business meaning.
}
```

The code should communicate business intent.

## 25.2 Bounded Context

A Bounded Context is an explicit boundary within which a particular domain model and its terminology apply.

Consider an e-commerce application.

It may contain:

```text
E-Commerce
│
├── Sales Context
│
├── Payment Context
│
├── Inventory Context
│
└── Shipping Context
```

The concept of a product may differ across contexts.

For example:

**Sales Context:**

```typescript
interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
}
```

**Inventory Context:**

```typescript
interface Product {
    id: string;
    sku: string;
    stockQuantity: number;
    warehouseId: string;
}
```

Both represent products, but their models serve different purposes.

### Why Bounded Context?

- Reduces model complexity.
- Clarifies responsibilities.
- Supports independent development.
- Helps organize modular monoliths and microservices.

## 25.3 Context Map

A Context Map describes how different bounded contexts interact.

Example:

```text
Sales Context
     |
     v
Payment Context
     |
     v
Inventory Context
     |
     v
Shipping Context
```

Real systems can use APIs, events, messaging, or translation layers to coordinate these contexts.

## 25.4 Subdomains

A large domain can be divided into smaller subdomains.

DDD commonly distinguishes:

| Subdomain | Meaning |
|---|---|
| Core Domain | Main business differentiator |
| Supporting Subdomain | Supports the core business |
| Generic Subdomain | Common functionality that may use existing solutions |

Example for an e-commerce company:

| Subdomain | Classification |
|---|---|
| Product recommendation engine | Core |
| Order management | Supporting or core, depending on business |
| Email delivery | Generic |

Classification depends on the actual business strategy.

---

# 26. Tactical DDD

Tactical DDD focuses on modeling the domain using programming constructs.

Important concepts:

1. Entity.
2. Value Object.
3. Aggregate.
4. Aggregate Root.
5. Repository.
6. Domain Service.
7. Domain Event.
8. Factory.

---

## 26.1 Entity

An Entity is an object identified by its identity rather than only by its attributes.

Example:

```typescript
class User {
    constructor(
        public readonly id: string,
        public name: string,
        public email: string
    ) {}
}
```

Two users may have identical names and emails but different IDs.

They are different entities.

## 26.2 Value Object

A Value Object is an object defined by its values rather than a unique identity.

Example: Money.

```typescript
class Money {
    constructor(
        public readonly amount: number,
        public readonly currency: string
    ) {
        if (!Number.isFinite(amount)) {
            throw new Error("Invalid amount");
        }

        if (!currency.trim()) {
            throw new Error("Currency is required");
        }
    }

    equals(other: Money): boolean {
        return (
            this.amount === other.amount &&
            this.currency === other.currency
        );
    }
}
```

Usage:

```typescript
const money1 = new Money(1000, "INR");

const money2 = new Money(1000, "INR");

console.log(money1.equals(money2)); // true
```

They are equal because their values are equal.

### Entity vs Value Object

| Entity | Value Object |
|---|---|
| Has identity | No independent identity |
| Identity remains important when attributes change | Equality is based on values |
| Often mutable | Prefer immutable design |
| Example: User | Example: Money |

## 26.3 Aggregate

An Aggregate is a group of related domain objects treated as one consistency boundary.

It ensures that business invariants are maintained.

Example:

```text
Order Aggregate
│
├── Order
│
├── OrderItem
│
└── ShippingAddress
```

The Order acts as the Aggregate Root.

## 26.4 Aggregate Root

Aggregate Root is the main entry point through which external code modifies an aggregate.

Example:

```typescript
class OrderItem {
    constructor(
        public readonly productId: string,
        public quantity: number,
        public readonly price: number
    ) {}
}
```

Order aggregate root:

```typescript
class Order {
    private items: OrderItem[] = [];

    constructor(
        public readonly id: string
    ) {}

    addItem(item: OrderItem): void {
        if (item.quantity <= 0) {
            throw new Error("Invalid quantity");
        }

        this.items.push(item);
    }

    getItems(): readonly OrderItem[] {
        return [...this.items];
    }
}
```

Usage:

```typescript
const order = new Order("ORDER-001");

order.addItem(
    new OrderItem("PRODUCT-001", 2, 500)
);
```

The application interacts with the aggregate through `Order`.

### Why Aggregate Root?

It protects business rules.

For example:

- Order cannot contain zero-quantity items.
- A cancelled order cannot accept new items.
- A payment cannot exceed allowed business limits.

### Important Aggregate Design Rule

Keep aggregates as small as practical.

Do not place every related entity inside one enormous aggregate.

An aggregate is a consistency boundary, not simply a collection of related database tables.

## 26.5 Repository in DDD

A DDD repository typically provides access to aggregate roots.

Example:

```typescript
interface OrderRepository {
    save(order: Order): Promise<void>;

    findById(id: string): Promise<Order | null>;
}
```

The domain or application layer defines the required abstraction.

Infrastructure implements persistence.

## 26.6 Domain Service

A Domain Service contains business logic that does not naturally belong to a particular entity or value object.

Example:

```typescript
class TransferService {
    transfer(
        fromBalance: number,
        toBalance: number,
        amount: number
    ): {
        fromBalance: number;
        toBalance: number;
    } {
        if (amount <= 0) {
            throw new Error("Invalid amount");
        }

        if (fromBalance < amount) {
            throw new Error("Insufficient balance");
        }

        return {
            fromBalance: fromBalance - amount,
            toBalance: toBalance + amount
        };
    }
}
```

## 26.7 Domain Event

A Domain Event represents something meaningful that happened in the business domain.

Examples:

- UserRegistered.
- OrderPlaced.
- PaymentCompleted.
- ExpenseCreated.

Example:

```typescript
interface DomainEvent {
    occurredAt: Date;
}

class ExpenseCreatedEvent implements DomainEvent {
    occurredAt: Date;

    constructor(
        public readonly expenseId: string,
        public readonly amount: number
    ) {
        this.occurredAt = new Date();
    }
}
```

A handler could respond to this event:

```typescript
class ExpenseCreatedHandler {
    handle(event: ExpenseCreatedEvent): void {
        console.log(
            `Expense ${event.expenseId} created`
        );
    }
}
```

### Domain Event vs Integration Event

| Domain Event | Integration Event |
|---|---|
| Represents an internal business fact | Communicates a fact to another system or bounded context |
| Usually internal to a domain/application | Designed for external consumers |
| Can contain domain-specific information | Should have a stable integration contract |

For reliable event publishing, consider the transactional outbox pattern rather than assuming that a database commit and message publication happen atomically.

## 26.8 Factory in DDD

A Domain Factory encapsulates complex creation logic for entities or aggregates.

Example:

```typescript
class OrderFactory {
    static create(
        id: string,
        productId: string,
        quantity: number,
        price: number
    ): Order {
        const order = new Order(id);

        order.addItem(
            new OrderItem(
                productId,
                quantity,
                price
            )
        );

        return order;
    }
}
```

Factories are particularly useful when object construction involves business invariants or multiple related objects.

---

# 27. Domain Service vs Application Service

These two concepts are frequently confused.

| Domain Service | Application Service |
|---|---|
| Contains domain/business rules | Coordinates application workflows |
| Belongs to domain model | Belongs to application layer |
| Framework-independent | Should generally be framework-independent |
| Example: Transfer calculation | Example: Execute money transfer use case |

Example:

**Domain Service:**

```typescript
class TransferDomainService {
    calculateTransfer(
        balance: number,
        amount: number
    ): number {
        if (amount > balance) {
            throw new Error("Insufficient balance");
        }

        return balance - amount;
    }
}
```

**Application Service:**

```typescript
class TransferMoneyUseCase {
    constructor(
        private transferService: TransferDomainService,
        private accountRepository: AccountRepository
    ) {}

    async execute(
        accountId: string,
        amount: number
    ): Promise<void> {
        // Load account.
        // Apply domain rules.
        // Persist updated account.
    }
}
```

The Application Service coordinates the use case, while the Domain Service owns business logic.

---

# 28. Layered Architecture vs Clean Architecture

Traditional Layered Architecture is another common approach.

Typical structure:

```text
Presentation Layer
       |
       v
Business Layer
       |
       v
Data Access Layer
       |
       v
Database
```

### Comparison

| Feature | Layered Architecture | Clean Architecture |
|---|---|---|
| Main focus | Separate responsibilities by layers | Protect business rules from infrastructure |
| Dependency direction | Often top-to-bottom | Inward toward business rules |
| Database dependency | Business layer may depend on data layer abstractions or implementations | Business rules depend on interfaces |
| Framework independence | Varies | Strong architectural goal |
| Complexity | Often simpler | Requires more architectural structure |

### Which Should You Use?

For a small CRUD application, a simple layered architecture may be sufficient.

For complex business systems, Clean, Hexagonal, or Onion Architecture can provide stronger isolation.

Do not introduce unnecessary layers just to follow an architectural trend.

---

# 29. Monolith vs Modular Monolith vs Microservices

These architectural styles are important when designing enterprise applications.

## 29.1 Monolithic Architecture

The application is deployed as one unit.

```text
Application
│
├── Users
├── Expenses
├── Payments
└── Reports
```

Advantages:

- Simple deployment.
- Easier local development.
- Easier initial architecture.

Disadvantages:

- Modules can become tightly coupled.
- Large codebases can become difficult to maintain.
- Independent deployment is difficult.

## 29.2 Modular Monolith

A Modular Monolith is a single deployable application divided into well-defined modules.

```text
Application
│
├── Users Module
│
├── Expenses Module
│
├── Payments Module
│
└── Reports Module
```

Each module has clear boundaries and communicates through defined interfaces.

Advantages:

- Easier development than distributed microservices.
- Clear module ownership.
- Easier refactoring.
- Can evolve toward microservices when justified.

## 29.3 Microservices Architecture

An application is divided into independently deployable services.

```text
API Gateway
     |
     ├── User Service
     |
     ├── Payment Service
     |
     ├── Inventory Service
     |
     └── Notification Service
```

Advantages:

- Independent deployment.
- Independent scaling.
- Technology flexibility.
- Team autonomy.

Disadvantages:

- Network communication complexity.
- Distributed transactions.
- Observability requirements.
- Operational overhead.
- Eventual consistency challenges.

### Which Is Better?

There is no universally best architecture.

For many applications, a well-designed modular monolith is a better starting point than microservices.

---

# 30. Testing in Clean Architecture

Architecture should make testing easier.

The key advantage is that business logic can be tested without starting the entire application.

### 30.1 Unit Testing a Use Case

Imagine testing `CreateExpenseUseCase`.

We can create an in-memory fake repository.

```typescript
class FakeExpenseRepository implements ExpenseRepository {
    public expenses: Expense[] = [];

    async create(expense: Expense): Promise<void> {
        this.expenses.push(expense);
    }
}
```

Test:

```typescript
async function testCreateExpense(): Promise<void> {
    const repository = new FakeExpenseRepository();

    const useCase = new CreateExpenseUseCase(repository);

    const expense = new Expense(
        "1",
        "Groceries",
        500
    );

    await useCase.execute(expense);

    console.log(repository.expenses.length === 1);
}

testCreateExpense();
```

Expected output:

```text
true
```

### 30.2 Testing Categories

| Test Type | Purpose |
|---|---|
| Unit Test | Test individual functions or classes |
| Integration Test | Test interaction between components |
| API Test | Test HTTP endpoints |
| Contract Test | Verify communication contracts |
| End-to-End Test | Test complete application workflows |

### Important Testing Principle

Test business behavior rather than implementation details.

Avoid mocking every internal method. Excessive mocking can make tests fragile and less meaningful.

---

# 31. Production-Ready TypeScript Project Architecture

Let's combine the concepts into a realistic Expense Tracker architecture.

### 31.1 Recommended Folder Structure

```text
expense-tracker/
│
├── src/
│   │
│   ├── modules/
│   │   │
│   │   ├── expenses/
│   │   │   │
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   ├── value-objects/
│   │   │   │   ├── events/
│   │   │   │   └── repositories/
│   │   │   │
│   │   │   ├── application/
│   │   │   │   ├── use-cases/
│   │   │   │   ├── services/
│   │   │   │   └── dto/
│   │   │   │
│   │   │   ├── infrastructure/
│   │   │   │   ├── database/
│   │   │   │   └── repositories/
│   │   │   │
│   │   │   └── presentation/
│   │   │       ├── controllers/
│   │   │       ├── routes/
│   │   │       └── validators/
│   │   │
│   │   ├── users/
│   │   ├── categories/
│   │   ├── budgets/
│   │   └── reports/
│   │
│   ├── shared/
│   │   ├── errors/
│   │   ├── interfaces/
│   │   ├── utils/
│   │   └── constants/
│   │
│   ├── infrastructure/
│   │   ├── database/
│   │   ├── redis/
│   │   ├── email/
│   │   └── logging/
│   │
│   ├── config/
│   │   └── container.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── package.json
└── tsconfig.json
```

### 31.2 Architectural Responsibilities

| Component | Responsibility |
|---|---|
| Domain | Core business concepts and rules |
| Application | Use cases and workflows |
| Infrastructure | Database, cache, external APIs |
| Presentation | HTTP controllers, routes and validation |
| Shared | Reusable cross-module components |
| Config | Dependency registration and wiring |
| Tests | Unit, integration and E2E testing |

### 31.3 Important Production Considerations

A production-ready architecture should also consider:

- Centralized error handling.
- Structured logging.
- Request validation.
- Authentication and authorization.
- Database transactions.
- Database migrations.
- Configuration management.
- Secrets management.
- Observability and metrics.
- API versioning.
- Rate limiting.
- Automated tests.
- Graceful shutdown.
- Background job processing.
- Security and audit logging.

Architecture is not just about folders and classes. It is about controlling dependencies and protecting business rules.

---

# 32. Common Design Mistakes and Anti-Patterns

| Mistake | Problem | Better Approach |
|---|---|---|
| God Class | One class handles too many responsibilities | Apply SRP |
| Tight Coupling | Modules depend directly on concrete implementations | Use appropriate abstractions |
| Overengineering | Too many unnecessary interfaces and layers | Follow KISS and YAGNI |
| Singleton Abuse | Global state and testing difficulties | Use explicit dependency management |
| Fat Controller | Business logic inside controllers | Move workflows to use cases/services |
| Anemic Domain Model | Domain objects contain no behavior despite complex business rules | Put relevant invariants and behavior in the domain |
| Service Locator | Dependencies are hidden | Prefer constructor injection |
| Circular Dependencies | Modules depend on each other | Improve module boundaries |
| Premature Microservices | Distributed complexity without sufficient need | Consider a modular monolith |
| Repository Everywhere | Unnecessary abstraction over an already adequate ORM | Add repositories where they provide value |
| Huge Aggregates | Excessive consistency boundaries | Keep aggregates small |
| Framework-Dependent Domain | Business rules depend on infrastructure | Keep domain independent |

---

# 33. Design Patterns Quick Revision

| Pattern | Category | Main Purpose |
|---|---|---|
| Singleton | Creational | Controlled shared instance |
| Factory Method | Creational | Delegate object creation to subclasses |
| Abstract Factory | Creational | Create families of related objects |
| Builder | Creational | Construct complex objects step by step |
| Prototype | Creational | Create objects by cloning |
| Adapter | Structural | Make incompatible interfaces work together |
| Decorator | Structural | Add behavior dynamically |
| Facade | Structural | Simplify complex subsystems |
| Proxy | Structural | Control access to another object |
| Composite | Structural | Treat individual and grouped objects uniformly |
| Bridge | Structural | Separate abstraction from implementation |
| Strategy | Behavioral | Select an algorithm at runtime |
| Observer | Behavioral | Notify dependent objects about changes |
| Command | Behavioral | Encapsulate requests as objects |
| State | Behavioral | Change behavior based on internal state |
| Template Method | Behavioral | Define an algorithm skeleton |
| Chain of Responsibility | Behavioral | Pass requests through handlers |

---

# 34. Interview Questions and Answers

## Basic Questions

**Q1. What are design patterns?**

Design patterns are reusable approaches to commonly occurring software design problems.

**Q2. What are the three categories of GoF design patterns?**

1. Creational.
2. Structural.
3. Behavioral.

**Q3. What is SOLID?**

SOLID is a collection of five object-oriented design principles that improve maintainability, extensibility, and flexibility.

**Q4. What is SRP?**

A class should have one primary responsibility and one reason to change.

**Q5. What is OCP?**

Software entities should be open for extension but closed for modification.

**Q6. What is LSP?**

Subtypes should be behaviorally substitutable for their parent types without breaking expected behavior.

**Q7. What is ISP?**

Clients should not be forced to depend on methods they do not use.

**Q8. What is DIP?**

High-level and low-level modules should depend on abstractions rather than directly depending on each other.

**Q9. What is the difference between DIP and DI?**

DIP is a design principle; DI is a technique for supplying dependencies externally.

**Q10. What is high cohesion?**

A module has high cohesion when its responsibilities are closely related.

## Intermediate Questions

**Q11. What is tight coupling?**

Tight coupling occurs when one module strongly depends on another module's implementation.

**Q12. What is the Singleton pattern?**

Singleton controls object creation so that a class provides one shared instance within a particular context.

**Q13. What is the Factory pattern?**

Factory centralizes object creation and hides concrete instantiation details.

**Q14. What is Abstract Factory?**

It provides an interface for creating families of related objects.

**Q15. What is the Builder pattern?**

Builder separates complex object construction from its final representation.

**Q16. What is Adapter?**

Adapter allows incompatible interfaces to work together.

**Q17. What is Decorator?**

Decorator adds responsibilities to an object without modifying its original class.

**Q18. What is Facade?**

Facade provides a simplified interface to a complex subsystem.

**Q19. What is Proxy?**

Proxy controls access to another object through a substitute object.

**Q20. What is Strategy?**

Strategy encapsulates interchangeable algorithms and allows one to be selected at runtime.

**Q21. What is Observer?**

Observer allows multiple dependent objects to be notified when a subject changes.

**Q22. What is the difference between Observer and Pub/Sub?**

Observer generally uses direct object relationships, whereas Pub/Sub communicates through a broker or event channel.

**Q23. What is Dependency Injection?**

DI supplies an object's dependencies from outside instead of having the object create them internally.

**Q24. What are the types of Dependency Injection?**

1. Constructor Injection.
2. Property Injection.
3. Method Injection.

**Q25. What is IoC?**

Inversion of Control transfers control of certain application responsibilities to a framework or external component.

## Advanced Questions

**Q26. What is Clean Architecture?**

Clean Architecture separates business rules from external frameworks and infrastructure using dependency boundaries.

**Q27. What is the Dependency Rule in Clean Architecture?**

Source code dependencies should point inward toward the core business rules.

**Q28. What is Hexagonal Architecture?**

Hexagonal Architecture isolates application logic using ports and adapters.

**Q29. What is a port?**

A port is an interface defining how the application communicates with an external actor or system.

**Q30. What is an adapter?**

An adapter implements or connects to a port so that an external technology can communicate with the application.

**Q31. What is Onion Architecture?**

Onion Architecture places the domain model at the center and organizes application and infrastructure layers around it.

**Q32. What is DDD?**

Domain-Driven Design is an approach that models software around business concepts and rules.

**Q33. What is Ubiquitous Language?**

It is a shared vocabulary used by developers and domain experts.

**Q34. What is a Bounded Context?**

A Bounded Context defines the boundary within which a particular domain model and its language apply.

**Q35. What is an Entity?**

An Entity is an object with a distinct identity that remains meaningful even when its attributes change.

**Q36. What is a Value Object?**

A Value Object is defined by its attributes rather than a unique identity.

**Q37. What is an Aggregate?**

An Aggregate is a group of related domain objects treated as one consistency boundary.

**Q38. What is an Aggregate Root?**

It is the primary object through which external code interacts with and modifies an aggregate.

**Q39. What is a Domain Event?**

A Domain Event represents an important business fact that has occurred.

**Q40. What is a Repository Pattern?**

Repository abstracts persistence operations and separates business logic from database implementation details.

**Q41. What is Unit of Work?**

Unit of Work coordinates multiple persistence operations as one logical transaction.

**Q42. What is DTO?**

DTO is an object used to transfer data between application boundaries.

**Q43. What is the difference between a Domain Service and an Application Service?**

A Domain Service contains business rules; an Application Service coordinates application workflows.

**Q44. What is the difference between Layered Architecture and Clean Architecture?**

Layered Architecture separates responsibilities into layers, while Clean Architecture additionally emphasizes inward dependency direction and business-rule independence.

**Q45. What is a Modular Monolith?**

It is a single deployable application organized into well-defined, loosely coupled modules.

**Q46. What is the difference between a Monolith and Microservices?**

A monolith is generally deployed as one application, while microservices consist of independently deployable services communicating over network boundaries.

**Q47. Why is composition often preferred over inheritance?**

Composition allows functionality to be combined flexibly without creating deep inheritance hierarchies.

**Q48. What is the Service Locator anti-pattern?**

It is an approach where objects retrieve their dependencies from a global or centralized registry instead of declaring dependencies explicitly.

**Q49. Why should domain entities not depend on Sequelize or Express?**

Because domain rules should remain independent of infrastructure and framework changes.

**Q50. Should every application use Clean Architecture and DDD?**

No. Architecture should match the complexity and requirements of the application. Simple CRUD applications may not need all these layers or patterns.

---

# 35. Practical Exercises

Complete these exercises to reinforce your understanding.

## Beginner Level

**Exercise 1: SRP**

Create a User application with separate classes for:

- User.
- UserRepository.
- EmailService.
- UserPDFGenerator.

**Exercise 2: OCP**

Create a payment system supporting:

- Stripe.
- Razorpay.
- PayPal.

Add new payment methods without modifying the payment processing service.

**Exercise 3: Strategy Pattern**

Create a discount calculator supporting:

- No discount.
- Percentage discount.
- Fixed discount.

**Exercise 4: Factory Pattern**

Create a notification factory supporting:

- Email.
- SMS.
- Push notifications.

## Intermediate Level

**Exercise 5: Repository Pattern**

Create an ExpenseRepository interface with implementations for:

- MySQL.
- MongoDB.
- In-memory storage.

**Exercise 6: Dependency Injection**

Create a UserService that receives:

- UserRepository.
- EmailProvider.
- Logger.

Use constructor injection.

**Exercise 7: Decorator Pattern**

Create a logging decorator that adds logging functionality to an existing notification service.

**Exercise 8: Observer Pattern**

Create a notification system that notifies multiple subscribers whenever a new expense report is generated.

## Advanced Level

**Exercise 9: Clean Architecture**

Build an Expense Tracker module using:

- Domain entities.
- Application use cases.
- Repository interfaces.
- MySQL adapters.
- Express controllers.

**Exercise 10: Hexagonal Architecture**

Create an application that supports three ways to create expenses:

- REST API.
- CLI.
- Background queue consumer.

All three should use the same application use case.

**Exercise 11: DDD**

Design an e-commerce domain containing:

- Customer.
- Order.
- OrderItem.
- Product.
- Payment.
- Shipment.

Identify the entities, value objects, aggregates, and bounded contexts.

**Exercise 12: Enterprise Architecture**

Build a modular Expense Tracker containing:

- Authentication module.
- User module.
- Expense module.
- Category module.
- Budget module.
- Reporting module.
- Notification module.

Use appropriate SOLID principles, DI, repositories, and application services.

---

# 36. Phase 57 Completion Checklist

Before moving forward, make sure you can explain and implement the following:

| Topic | Expected Knowledge |
|---|---|
| Software Design Principles | Cohesion, coupling, abstraction, encapsulation |
| SOLID | All five principles |
| DRY, KISS, YAGNI | Practical applications |
| Creational Patterns | Singleton, Factory, Abstract Factory, Builder, Prototype |
| Structural Patterns | Adapter, Decorator, Facade, Proxy, Composite, Bridge |
| Behavioral Patterns | Strategy, Observer, Command, State, Template Method, Chain of Responsibility |
| Repository Pattern | Data access abstraction |
| Unit of Work | Transaction coordination |
| Dependency Injection | Constructor, property, method injection |
| IoC | Control inversion |
| Clean Architecture | Layers and dependency rule |
| Hexagonal Architecture | Ports and adapters |
| Onion Architecture | Domain-centered design |
| DDD | Strategic and tactical concepts |
| Entities | Identity-based objects |
| Value Objects | Value-based objects |
| Aggregates | Consistency boundaries |
| Domain Events | Business events |
| Enterprise Architecture | Modular monolith and production organization |

---

# 37. What You Should Be Able to Build After Phase 57

You should now have the architectural knowledge required to design:

1. A maintainable Node.js and TypeScript backend.
2. A modular Expense Tracker.
3. An enterprise-level REST API.
4. A database-independent business layer.
5. A payment integration system.
6. A notification system.
7. A testable application using dependency injection.
8. A Clean Architecture application.
9. A DDD-based business application.
10. A modular monolith that can evolve as requirements grow.

The most important takeaway:

**Good software architecture is not about using the maximum number of design patterns. It is about organizing code so that business logic remains understandable, testable, maintainable, and independent of unnecessary implementation details.**

---

# Next Phase

## Phase 58: Advanced TypeScript – Testing, Test-Driven Development (TDD), Jest, Vitest, Unit Testing, Integration Testing, API Testing, Mocking, Contract Testing and Test Automation

Upcoming topics:

1. Software Testing Fundamentals.
2. Manual vs Automated Testing.
3. Testing Pyramid.
4. Unit Testing.
5. Integration Testing.
6. End-to-End Testing.
7. Test-Driven Development (TDD).
8. Behavior-Driven Development (BDD).
9. Jest Fundamentals.
10. Vitest Fundamentals.
11. Test Suites and Test Cases.
12. Assertions and Matchers.
13. Setup and Teardown.
14. Mock Functions.
15. Mock Modules.
16. Spies and Stubs.
17. Dependency Mocking.
18. Testing Async Functions.
19. Testing Promises.
20. Testing Exceptions.
21. Testing TypeScript Classes.
22. Testing Express APIs.
23. Supertest.
24. Database Integration Testing.
25. Testing Sequelize Models.
26. Testing MongoDB Applications.
27. Testing Authentication and Authorization.
28. Testing Middleware.
29. Code Coverage.
30. Contract Testing.
31. Test Doubles: Dummy, Stub, Fake, Mock and Spy.
32. Test Isolation.
33. Test Fixtures and Factories.
34. CI/CD Testing Automation.
35. Production Testing Best Practices.

**Phase 57 completed.**

When you're ready, say: **OK, Phase 58**.