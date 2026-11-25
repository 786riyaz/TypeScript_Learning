# Phase 39: Advanced TypeScript – Design Patterns and Software Architecture

**Level:** Advanced to Expert  
**Prerequisites:** TypeScript fundamentals, OOP, interfaces, abstract classes, generics, modules, Node.js, Express.js, React, and basic software development experience.

---

# 1. Learning Objectives

In this phase, you will learn how to design scalable, maintainable, reusable, and testable software using TypeScript.

By the end of this phase, you should understand:

1. What software design patterns are.
2. The three major categories of design patterns.
3. Creational design patterns.
4. Structural design patterns.
5. Behavioral design patterns.
6. Dependency Injection (DI).
7. SOLID principles.
8. Clean Architecture.
9. Domain-Driven Design (DDD).
10. Repository and Unit of Work patterns.
11. Event-Driven Architecture.
12. How to combine these concepts in a real-world TypeScript application.

---

# 2. What Are Software Design Patterns?

A **Design Pattern** is a reusable solution to a commonly occurring software design problem.

Design patterns are not complete implementations or ready-made code. They are proven approaches that help developers organize code and solve recurring architectural problems.

### Example: Without a Design Pattern

Imagine you are building an e-commerce application.

You need to support three payment providers:

- Stripe
- PayPal
- Razorpay

You might write:

```typescript
function processPayment(
    provider: string,
    amount: number
): void {

    if (provider === "stripe") {
        console.log("Processing Stripe payment");
    }

    else if (provider === "paypal") {
        console.log("Processing PayPal payment");
    }

    else if (provider === "razorpay") {
        console.log("Processing Razorpay payment");
    }
}
```

This works initially.

However, when you add another payment provider, you must modify the existing function.

As the application grows, this function becomes difficult to maintain.

### Using a Design Pattern

We can introduce the Strategy Pattern.

```typescript
interface PaymentStrategy {
    pay(amount: number): void;
}

class StripePayment implements PaymentStrategy {
    pay(amount: number): void {
        console.log(`Stripe payment: ${amount}`);
    }
}

class PayPalPayment implements PaymentStrategy {
    pay(amount: number): void {
        console.log(`PayPal payment: ${amount}`);
    }
}

class RazorpayPayment implements PaymentStrategy {
    pay(amount: number): void {
        console.log(`Razorpay payment: ${amount}`);
    }
}
```

Now we can select a payment strategy dynamically.

```typescript
class PaymentService {

    constructor(
        private paymentStrategy: PaymentStrategy
    ) {}

    process(amount: number): void {
        this.paymentStrategy.pay(amount);
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

To use PayPal:

```typescript
const payment = new PaymentService(
    new PayPalPayment()
);

payment.process(2000);
```

The `PaymentService` does not need to know how individual payment providers work.

**Key takeaway:** Design patterns help reduce tight coupling and improve maintainability, extensibility, and testability.

---

# 3. Categories of Design Patterns

The classic Gang of Four (GoF) design patterns are divided into three categories.

| Category | Purpose | Examples |
|---|---|---|
| Creational | Object creation | Singleton, Factory, Builder |
| Structural | Object composition | Adapter, Decorator, Facade |
| Behavioral | Object communication and behavior | Observer, Strategy, Command |

Let's explore each category.

# PART 1: CREATIONAL DESIGN PATTERNS

Creational patterns deal with object creation.

They help control how objects are instantiated and configured.

---

# 4. Singleton Pattern

## 4.1 What Is the Singleton Pattern?

The Singleton Pattern ensures that a class has only one shared instance within a particular application scope and provides a common access point to it.

### Real-world examples

- Application configuration.
- Shared database client.
- Logging service.
- Cache manager.

### Without Singleton

```typescript
class Database {
    connect(): void {
        console.log("Database connected");
    }
}

const db1 = new Database();
const db2 = new Database();

console.log(db1 === db2); // false
```

Every time we use `new Database()`, a new object is created.

### Using Singleton

```typescript
class Database {

    private static instance: Database;

    private constructor() {
        console.log("Database instance created");
    }

    static getInstance(): Database {

        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }

    connect(): void {
        console.log("Database connected");
    }
}
```

Usage:

```typescript
const db1 = Database.getInstance();
const db2 = Database.getInstance();

console.log(db1 === db2); // true
```

### Understanding the implementation

**1. Private constructor**

```typescript
private constructor() {}
```

Prevents external code from creating instances using `new Database()`.

**2. Static instance**

```typescript
private static instance: Database;
```

Stores the shared instance at the class level.

**3. Static getInstance()**

```typescript
static getInstance(): Database {}
```

Provides access to the shared instance.

**4. Lazy initialization**

```typescript
if (!Database.instance) {
    Database.instance = new Database();
}
```

The instance is created only when it is first requested.

## 4.2 Module-Level Singleton

In Node.js and TypeScript applications, you can often achieve a singleton-like pattern through module caching.

```typescript
// database.ts

class Database {
    connect(): void {
        console.log("Database connected");
    }
}

const database = new Database();

export default database;
```

Usage:

```typescript
import database from "./database";

database.connect();
```

Importing this module normally reuses the same exported object within the same module-loading context.

### Important limitations

A Singleton does not necessarily mean one instance across:

- Multiple Node.js processes.
- Multiple server instances.
- Multiple containers.
- Distributed application environments.

Also, avoid using Singleton as an excuse to introduce global mutable state.

**Use Singleton carefully:** It can make unit testing and dependency management more difficult when overused.

---

# 5. Factory Pattern

## 5.1 What Is the Factory Pattern?

The Factory Pattern provides a centralized way to create objects without exposing all object-creation details to the calling code.

### Real-world example

Suppose your application supports multiple notification channels:

- Email
- SMS
- WhatsApp

Instead of directly creating different notification classes throughout the application, we can centralize their creation.

### Step 1: Create an interface

```typescript
interface Notification {
    send(message: string): void;
}
```

### Step 2: Create implementations

```typescript
class EmailNotification implements Notification {

    send(message: string): void {
        console.log(`Email: ${message}`);
    }
}

class SMSNotification implements Notification {

    send(message: string): void {
        console.log(`SMS: ${message}`);
    }
}

class WhatsAppNotification implements Notification {

    send(message: string): void {
        console.log(`WhatsApp: ${message}`);
    }
}
```

### Step 3: Create a Factory

```typescript
class NotificationFactory {

    static create(
        type: string
    ): Notification {

        switch (type) {

            case "email":
                return new EmailNotification();

            case "sms":
                return new SMSNotification();

            case "whatsapp":
                return new WhatsAppNotification();

            default:
                throw new Error("Invalid notification type");
        }
    }
}
```

### Step 4: Use the Factory

```typescript
const notification =
    NotificationFactory.create("email");

notification.send("Welcome to our application");
```

Output:

```text
Email: Welcome to our application
```

### Why use a Factory?

Without a factory:

```typescript
const email = new EmailNotification();
const sms = new SMSNotification();
const whatsapp = new WhatsAppNotification();
```

The calling code must know which concrete class to instantiate.

With a factory, object creation is centralized.

### Factory Method vs Simple Factory

These terms are often confused.

| Simple Factory | Factory Method |
|---|---|
| Centralizes object creation in one factory | Uses a creator abstraction with a creation method |
| Often uses conditional logic | Subclasses can determine which product to create |
| Not one of the original GoF patterns | A GoF creational pattern |

The previous example is commonly called a **Simple Factory**.

A simplified Factory Method example:

```typescript
interface Notification {
    send(message: string): void;
}

class EmailNotification implements Notification {
    send(message: string): void {
        console.log("Email:", message);
    }
}

abstract class NotificationCreator {

    abstract createNotification(): Notification;

    sendNotification(message: string): void {

        const notification =
            this.createNotification();

        notification.send(message);
    }
}

class EmailNotificationCreator
    extends NotificationCreator {

    createNotification(): Notification {
        return new EmailNotification();
    }
}
```

Usage:

```typescript
const creator = new EmailNotificationCreator();

creator.sendNotification("Hello!");
```

---

# 6. Abstract Factory Pattern

## 6.1 What Is Abstract Factory?

Abstract Factory provides an interface for creating families of related objects without specifying their concrete classes.

### Real-world example

Imagine you are developing an application that supports multiple cloud providers.

Each provider offers:

- File storage.
- Database service.
- Message queue.

You want to create related services from one provider.

### Step 1: Define product interfaces

```typescript
interface Storage {
    upload(file: string): void;
}

interface Database {
    connect(): void;
}
```

### Step 2: Create AWS implementations

```typescript
class S3Storage implements Storage {

    upload(file: string): void {
        console.log(`Uploading ${file} to S3`);
    }
}

class AWSDatabase implements Database {

    connect(): void {
        console.log("Connecting to AWS database");
    }
}
```

### Step 3: Create Azure implementations

```typescript
class AzureStorage implements Storage {

    upload(file: string): void {
        console.log(`Uploading ${file} to Azure`);
    }
}

class AzureDatabase implements Database {

    connect(): void {
        console.log("Connecting to Azure database");
    }
}
```

### Step 4: Create Abstract Factory

```typescript
interface CloudFactory {

    createStorage(): Storage;

    createDatabase(): Database;
}
```

### Step 5: Implement factories

```typescript
class AWSFactory implements CloudFactory {

    createStorage(): Storage {
        return new S3Storage();
    }

    createDatabase(): Database {
        return new AWSDatabase();
    }
}

class AzureFactory implements CloudFactory {

    createStorage(): Storage {
        return new AzureStorage();
    }

    createDatabase(): Database {
        return new AzureDatabase();
    }
}
```

### Step 6: Use the factory

```typescript
function initializeCloud(factory: CloudFactory): void {

    const storage = factory.createStorage();

    const database = factory.createDatabase();

    storage.upload("document.pdf");

    database.connect();
}
```

Usage:

```typescript
initializeCloud(new AWSFactory());
```

Or:

```typescript
initializeCloud(new AzureFactory());
```

### Factory vs Abstract Factory

| Factory | Abstract Factory |
|---|---|
| Creates an object or product | Creates families of related products |
| Usually simpler | Usually involves multiple factory methods |
| Example: Notification Factory | Example: AWS and Azure service factories |

---

# 7. Builder Pattern

## 7.1 What Is Builder?

The Builder Pattern constructs complex objects step by step.

It is useful when an object has many optional or configurable properties.

### Without Builder

```typescript
interface User {
    name: string;
    email: string;
    age?: number;
    address?: string;
    phone?: string;
    isActive?: boolean;
}

const user: User = {
    name: "John",
    email: "john@example.com",
    age: 25,
    address: "New York",
    phone: "1234567890",
    isActive: true
};
```

This is perfectly acceptable for simple objects.

However, complex construction logic can make object creation difficult to manage.

### Using Builder

```typescript
class User {

    constructor(
        public name: string,
        public email: string,
        public age?: number,
        public address?: string
    ) {}
}
```

Builder implementation:

```typescript
class UserBuilder {

    private name = "";
    private email = "";
    private age?: number;
    private address?: string;

    setName(name: string): this {
        this.name = name;
        return this;
    }

    setEmail(email: string): this {
        this.email = email;
        return this;
    }

    setAge(age: number): this {
        this.age = age;
        return this;
    }

    setAddress(address: string): this {
        this.address = address;
        return this;
    }

    build(): User {

        if (!this.name || !this.email) {
            throw new Error("Name and email are required");
        }

        return new User(
            this.name,
            this.email,
            this.age,
            this.address
        );
    }
}
```

Usage:

```typescript
const user = new UserBuilder()
    .setName("John")
    .setEmail("john@example.com")
    .setAge(25)
    .setAddress("New York")
    .build();

console.log(user);
```

### Benefits

- Step-by-step object creation.
- Better readability.
- Centralized validation.
- Supports optional properties.
- Can enforce object invariants during construction.

**Important:** You do not need a Builder for every object. For simple objects, an object literal or constructor is usually sufficient.

---

# 8. Prototype Pattern

## 8.1 What Is Prototype?

The Prototype Pattern creates new objects by copying or cloning existing objects.

Instead of constructing an object from scratch, we create a copy of an existing object.

### Example

```typescript
class User {

    constructor(
        public name: string,
        public role: string
    ) {}

    clone(): User {
        return new User(this.name, this.role);
    }
}
```

Usage:

```typescript
const original = new User("John", "Admin");

const copied = original.clone();

copied.name = "David";

console.log(original.name); // John
console.log(copied.name);   // David
```

### Shallow Copy vs Deep Copy

Consider:

```typescript
const user = {
    name: "John",
    address: {
        city: "New York"
    }
};
```

Shallow copy:

```typescript
const copiedUser = { ...user };

copiedUser.address.city = "London";

console.log(user.address.city); // London
```

Why?

Because nested objects are still shared references.

Deep copy:

```typescript
const copiedUser = structuredClone(user);

copiedUser.address.city = "London";

console.log(user.address.city); // New York
```

`structuredClone()` supports many structured data types but does not preserve arbitrary class prototypes or clone functions.

### When to use Prototype?

- Cloning configuration objects.
- Duplicating templates.
- Creating copies of complex objects.
- Reducing repeated initialization work.

---

# PART 2: STRUCTURAL DESIGN PATTERNS

Structural patterns explain how objects and classes can be combined to create larger structures.

---

# 9. Adapter Pattern

## 9.1 What Is Adapter?

The Adapter Pattern allows two incompatible interfaces to work together.

It acts as a bridge between an existing implementation and the interface expected by your application.

### Real-world example

Suppose your application expects payment providers to implement:

```typescript
interface PaymentProcessor {

    processPayment(amount: number): void;
}
```

But an external payment SDK provides a different method:

```typescript
class ExternalPaymentSDK {

    makeTransaction(value: number): void {
        console.log(`External payment: ${value}`);
    }
}
```

The SDK does not implement your expected interface.

### Create an Adapter

```typescript
class PaymentAdapter implements PaymentProcessor {

    constructor(
        private externalSDK: ExternalPaymentSDK
    ) {}

    processPayment(amount: number): void {

        this.externalSDK.makeTransaction(amount);
    }
}
```

Usage:

```typescript
const sdk = new ExternalPaymentSDK();

const adapter = new PaymentAdapter(sdk);

adapter.processPayment(5000);
```

Output:

```text
External payment: 5000
```

### Why use Adapter?

Suppose you replace one external SDK with another.

Instead of changing your entire application, you can implement a new adapter.

**Common use cases:**

- Third-party APIs.
- Legacy systems.
- Payment gateways.
- Cloud storage providers.
- Different database libraries.

---

# 10. Decorator Pattern

## 10.1 What Is Decorator?

The Decorator Pattern dynamically adds additional behavior to an existing object without modifying its original implementation.

### Example

Suppose you have a basic notification service.

```typescript
interface NotificationService {
    send(message: string): void;
}

class BasicNotification implements NotificationService {

    send(message: string): void {
        console.log(`Sending notification: ${message}`);
    }
}
```

Now you want to add logging functionality.

Instead of modifying the original class, create a decorator.

```typescript
class LoggingDecorator implements NotificationService {

    constructor(
        private notification: NotificationService
    ) {}

    send(message: string): void {

        console.log("Logging started");

        this.notification.send(message);

        console.log("Logging completed");
    }
}
```

Usage:

```typescript
const basic = new BasicNotification();

const decorated = new LoggingDecorator(basic);

decorated.send("Welcome!");
```

Output:

```text
Logging started
Sending notification: Welcome!
Logging completed
```

### Multiple Decorators

You can wrap objects multiple times.

```typescript
const notification =
    new LoggingDecorator(
        new BasicNotification()
    );
```

You could add additional decorators for:

- Authentication.
- Logging.
- Metrics.
- Caching.
- Encryption.

### Important distinction

There are two different concepts:

1. **Decorator Design Pattern:** Wraps an object to add behavior.
2. **TypeScript Decorator Syntax:** Uses language-level decorator declarations on classes, methods, properties, and other supported declarations.

They are related conceptually but are not the same thing.

---

# 11. Facade Pattern

## 11.1 What Is Facade?

The Facade Pattern provides a simplified interface to a complex subsystem.

It hides unnecessary internal complexity from the calling code.

### Example: E-commerce Order Processing

An order may require:

1. Payment processing.
2. Inventory updates.
3. Email notification.
4. Shipping arrangement.

Without a Facade:

```typescript
class PaymentService {
    process(): void {
        console.log("Payment processed");
    }
}

class InventoryService {
    update(): void {
        console.log("Inventory updated");
    }
}

class EmailService {
    send(): void {
        console.log("Email sent");
    }
}

class ShippingService {
    createShipment(): void {
        console.log("Shipment created");
    }
}
```

The calling code must coordinate everything.

```typescript
const payment = new PaymentService();
const inventory = new InventoryService();
const email = new EmailService();
const shipping = new ShippingService();

payment.process();
inventory.update();
email.send();
shipping.createShipment();
```

### Using Facade

```typescript
class OrderFacade {

    private payment = new PaymentService();
    private inventory = new InventoryService();
    private email = new EmailService();
    private shipping = new ShippingService();

    placeOrder(): void {

        this.payment.process();

        this.inventory.update();

        this.shipping.createShipment();

        this.email.send();

        console.log("Order completed");
    }
}
```

Usage:

```typescript
const order = new OrderFacade();

order.placeOrder();
```

### Benefits

- Simplifies complex workflows.
- Reduces coupling between the client and subsystem.
- Improves readability.
- Centralizes orchestration.

**Note:** A Facade does not automatically provide transaction management or guarantee that all operations succeed. Production workflows still need proper error handling and compensation logic.

---

# 12. Proxy Pattern

## 12.1 What Is Proxy?

The Proxy Pattern provides a substitute object that controls access to another object.

A proxy can perform additional operations before or after forwarding a request.

### Common use cases

- Access control.
- Lazy initialization.
- Logging.
- Caching.
- Rate limiting.

### Example: Access Control

```typescript
interface DocumentService {
    readDocument(): void;
}

class RealDocumentService implements DocumentService {

    readDocument(): void {
        console.log("Reading confidential document");
    }
}
```

Create a Proxy:

```typescript
class DocumentProxy implements DocumentService {

    constructor(
        private realService: RealDocumentService,
        private isAuthenticated: boolean
    ) {}

    readDocument(): void {

        if (!this.isAuthenticated) {
            throw new Error("Access denied");
        }

        this.realService.readDocument();
    }
}
```

Usage:

```typescript
const realService = new RealDocumentService();

const proxy = new DocumentProxy(realService, true);

proxy.readDocument();
```

### JavaScript Proxy API

JavaScript also provides a built-in `Proxy` object.

```typescript
const user = {
    name: "John",
    age: 25
};

const proxy = new Proxy(user, {

    get(target, property) {

        console.log(`Accessing ${String(property)}`);

        return Reflect.get(target, property);
    },

    set(target, property, value) {

        console.log(`Updating ${String(property)}`);

        return Reflect.set(target, property, value);
    }
});

console.log(proxy.name);

proxy.age = 30;
```

### Important distinction

- GoF Proxy is a design pattern.
- JavaScript `Proxy` is a language feature.

JavaScript's Proxy API can be used to implement proxy-like behavior, but the two concepts are not identical.

---

# 13. Composite Pattern

## 13.1 What Is Composite?

The Composite Pattern allows you to represent individual objects and groups of objects using the same interface.

It is especially useful for hierarchical tree structures.

### Real-world examples

- File systems.
- Organization structures.
- Nested menus.
- Product categories.
- UI component trees.

### Example: File System

```typescript
interface FileSystemItem {
    show(): void;
}
```

File:

```typescript
class File implements FileSystemItem {

    constructor(
        private name: string
    ) {}

    show(): void {
        console.log(`File: ${this.name}`);
    }
}
```

Folder:

```typescript
class Folder implements FileSystemItem {

    private items: FileSystemItem[] = [];

    constructor(
        private name: string
    ) {}

    add(item: FileSystemItem): void {
        this.items.push(item);
    }

    show(): void {

        console.log(`Folder: ${this.name}`);

        for (const item of this.items) {
            item.show();
        }
    }
}
```

Usage:

```typescript
const root = new Folder("Root");

const documents = new Folder("Documents");

documents.add(new File("resume.pdf"));
documents.add(new File("report.pdf"));

root.add(documents);

root.add(new File("photo.png"));

root.show();
```

Output:

```text
Folder: Root
Folder: Documents
File: resume.pdf
File: report.pdf
File: photo.png
```

Both `File` and `Folder` implement the same interface.

That allows the folder to contain individual files as well as other folders.

---

# PART 3: BEHAVIORAL DESIGN PATTERNS

Behavioral patterns focus on communication and responsibilities between objects.

---

# 14. Observer Pattern

## 14.1 What Is Observer?

The Observer Pattern establishes a one-to-many relationship between objects.

When one object changes its state, all registered observers are notified.

### Real-world examples

- Event listeners.
- Notification systems.
- Stock price updates.
- UI state subscriptions.
- Real-time dashboards.

### Example

```typescript
interface Observer {
    update(message: string): void;
}
```

Create observers:

```typescript
class EmailSubscriber implements Observer {

    update(message: string): void {
        console.log(`Email received: ${message}`);
    }
}

class SMSSubscriber implements Observer {

    update(message: string): void {
        console.log(`SMS received: ${message}`);
    }
}
```

Create Subject:

```typescript
class NotificationPublisher {

    private observers: Observer[] = [];

    subscribe(observer: Observer): void {
        this.observers.push(observer);
    }

    unsubscribe(observer: Observer): void {

        this.observers =
            this.observers.filter(
                item => item !== observer
            );
    }

    notify(message: string): void {

        for (const observer of this.observers) {
            observer.update(message);
        }
    }
}
```

Usage:

```typescript
const publisher = new NotificationPublisher();

const email = new EmailSubscriber();
const sms = new SMSSubscriber();

publisher.subscribe(email);
publisher.subscribe(sms);

publisher.notify("New order received!");
```

Output:

```text
Email received: New order received!
SMS received: New order received!
```

### Important concepts

- Subject: Object that maintains observers.
- Observer: Object that receives updates.
- Subscribe: Register an observer.
- Unsubscribe: Remove an observer.
- Notify: Send updates to observers.

### Observer vs Pub/Sub

| Observer | Publish/Subscribe |
|---|---|
| Usually direct relationship between subject and observers | Usually uses an event broker or channel |
| Subject manages observers | Publisher and subscriber are more decoupled |
| Often in-process | Can be distributed |
| Example: UI event listener | Example: RabbitMQ or Redis Pub/Sub |

**Important:** Always consider unsubscribe behavior and memory leaks when implementing observers in long-running applications.

---

# 15. Strategy Pattern

## 15.1 What Is Strategy?

The Strategy Pattern defines multiple interchangeable algorithms and allows the application to select one at runtime.

### Real-world examples

- Payment methods.
- Discount calculation.
- Sorting algorithms.
- Shipping cost calculation.
- Authentication strategies.

### Example: Discount Calculation

Define an interface:

```typescript
interface DiscountStrategy {
    calculate(price: number): number;
}
```

Create strategies:

```typescript
class NoDiscount implements DiscountStrategy {

    calculate(price: number): number {
        return price;
    }
}

class PercentageDiscount implements DiscountStrategy {

    constructor(
        private percentage: number
    ) {}

    calculate(price: number): number {
        return price - (price * this.percentage / 100);
    }
}

class FixedDiscount implements DiscountStrategy {

    constructor(
        private discount: number
    ) {}

    calculate(price: number): number {
        return Math.max(0, price - this.discount);
    }
}
```

Create Context:

```typescript
class ShoppingCart {

    constructor(
        private strategy: DiscountStrategy
    ) {}

    calculateTotal(price: number): number {
        return this.strategy.calculate(price);
    }
}
```

Usage:

```typescript
const cart = new ShoppingCart(
    new PercentageDiscount(20)
);

console.log(cart.calculateTotal(1000));
```

Output:

```text
800
```

Change strategy:

```typescript
const cart2 = new ShoppingCart(
    new FixedDiscount(100)
);

console.log(cart2.calculateTotal(1000));
```

Output:

```text
900
```

### Why use Strategy?

Without Strategy, you may end up writing large conditional statements.

```typescript
if (discountType === "percentage") {
    // ...
} else if (discountType === "fixed") {
    // ...
}
```

Strategy separates algorithms into independent implementations.

---

# 16. Command Pattern

## 16.1 What Is Command?

The Command Pattern encapsulates a request as an object.

It separates the object that requests an operation from the object that performs it.

### Real-world examples

- Undo/Redo systems.
- Job queues.
- Task scheduling.
- Background processing.
- Application actions.

### Example: Light Control

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

Define Command:

```typescript
interface Command {
    execute(): void;
}
```

Create commands:

```typescript
class TurnOnCommand implements Command {

    constructor(
        private light: Light
    ) {}

    execute(): void {
        this.light.turnOn();
    }
}

class TurnOffCommand implements Command {

    constructor(
        private light: Light
    ) {}

    execute(): void {
        this.light.turnOff();
    }
}
```

Create Invoker:

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

remote.executeCommand(
    new TurnOnCommand(light)
);

remote.executeCommand(
    new TurnOffCommand(light)
);
```

### Benefits

- Separates request from execution.
- Supports undo/redo.
- Supports queuing.
- Makes commands reusable.
- Simplifies task scheduling.

For undo support, commands can expose an additional `undo()` method or store enough information to reverse their operation.

---

# 17. State Pattern

## 17.1 What Is State?

The State Pattern allows an object to change its behavior when its internal state changes.

Instead of managing many conditional statements, we represent each state using a separate class.

### Example: Order Management

An order may have these states:

- Pending.
- Confirmed.
- Shipped.
- Delivered.
- Cancelled.

### Define State Interface

```typescript
interface OrderState {
    process(order: Order): void;
}
```

Create Order:

```typescript
class Order {

    constructor(
        public state: OrderState
    ) {}

    process(): void {
        this.state.process(this);
    }

    setState(state: OrderState): void {
        this.state = state;
    }
}
```

Create states:

```typescript
class PendingState implements OrderState {

    process(order: Order): void {

        console.log("Order confirmed");

        order.setState(new ConfirmedState());
    }
}

class ConfirmedState implements OrderState {

    process(order: Order): void {

        console.log("Order shipped");

        order.setState(new ShippedState());
    }
}

class ShippedState implements OrderState {

    process(order: Order): void {

        console.log("Order delivered");

        order.setState(new DeliveredState());
    }
}

class DeliveredState implements OrderState {

    process(): void {
        console.log("Order already delivered");
    }
}
```

Usage:

```typescript
const order = new Order(new PendingState());

order.process();
order.process();
order.process();
order.process();
```

Output:

```text
Order confirmed
Order shipped
Order delivered
Order already delivered
```

### Why use State?

Without State, you might write:

```typescript
if (status === "pending") {
    // ...
} else if (status === "confirmed") {
    // ...
} else if (status === "shipped") {
    // ...
}
```

When states and transitions become complex, separate state classes can improve maintainability.

**Production consideration:** State transitions should be validated. For example, a delivered order should not unexpectedly transition back to pending.

---

# 18. Template Method Pattern

## 18.1 What Is Template Method?

The Template Method Pattern defines the skeleton of an algorithm in a base class while allowing subclasses to customize specific steps.

### Example: Data Import

Suppose your application imports data from:

- CSV.
- JSON.
- XML.

All formats follow a common workflow:

1. Read file.
2. Parse content.
3. Validate data.
4. Save data.

The parsing implementation differs by format.

### Base Class

```typescript
abstract class DataImporter {

    import(): void {

        this.readFile();

        const data = this.parse();

        this.validate(data);

        this.save(data);
    }

    private readFile(): void {
        console.log("Reading file");
    }

    protected abstract parse(): unknown;

    protected validate(data: unknown): void {
        console.log("Validating data");
    }

    private save(data: unknown): void {
        console.log("Saving data");
    }
}
```

### CSV Implementation

```typescript
class CSVImporter extends DataImporter {

    protected parse(): unknown {
        console.log("Parsing CSV");
        return [];
    }
}
```

### JSON Implementation

```typescript
class JSONImporter extends DataImporter {

    protected parse(): unknown {
        console.log("Parsing JSON");
        return {};
    }
}
```

Usage:

```typescript
const importer = new CSVImporter();

importer.import();
```

### Key idea

The base class controls the overall workflow.

Subclasses customize selected steps.

---

# 19. Chain of Responsibility Pattern

## 19.1 What Is Chain of Responsibility?

The Chain of Responsibility Pattern passes a request through a sequence of handlers.

Each handler decides whether to process the request or pass it to the next handler.

### Real-world examples

- Express middleware.
- Authentication pipelines.
- Request validation.
- Logging pipelines.
- Approval workflows.

### Example: Request Validation

```typescript
interface Handler {
    setNext(handler: Handler): Handler;

    handle(request: string): string | null;
}
```

Create base handler:

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

Authentication handler:

```typescript
class AuthenticationHandler extends BaseHandler {

    handle(request: string): string | null {

        if (!request.includes("authenticated")) {
            return "Authentication failed";
        }

        return super.handle(request);
    }
}
```

Authorization handler:

```typescript
class AuthorizationHandler extends BaseHandler {

    handle(request: string): string | null {

        if (!request.includes("authorized")) {
            return "Authorization failed";
        }

        return super.handle(request);
    }
}
```

Validation handler:

```typescript
class ValidationHandler extends BaseHandler {

    handle(request: string): string | null {

        if (!request.includes("valid")) {
            return "Validation failed";
        }

        return super.handle(request);
    }
}
```

Usage:

```typescript
const authentication = new AuthenticationHandler();

const authorization = new AuthorizationHandler();

const validation = new ValidationHandler();

authentication
    .setNext(authorization)
    .setNext(validation);

const result = authentication.handle(
    "authenticated authorized valid"
);

console.log(result ?? "Request processed successfully");
```

### Connection with Express.js

Express middleware uses a similar pipeline concept.

```typescript
app.use(authenticationMiddleware);

app.use(authorizationMiddleware);

app.use(validationMiddleware);
```

Each middleware can:

- Process the request.
- Modify the request.
- Send a response.
- Pass control using `next()`.
- Pass an error to error-handling middleware.

Express middleware is a practical example of chain-like request processing, although it is not necessarily a strict implementation of the GoF pattern.

---

# PART 4: DEPENDENCY MANAGEMENT

# 20. Dependency Injection (DI)

## 20.1 What Is Dependency Injection?

Dependency Injection is a technique in which an object receives the dependencies it needs from an external source instead of creating those dependencies internally.

### Understanding Dependency

Consider:

```typescript
class EmailService {

    send(message: string): void {
        console.log(message);
    }
}
```

Now:

```typescript
class UserService {

    private emailService = new EmailService();

    registerUser(): void {

        this.emailService.send("Welcome!");
    }
}
```

Here, `UserService` directly creates `EmailService`.

This creates tight coupling.

If you want to replace email with SMS, you must modify `UserService`.

### Using Dependency Injection

Step 1: Create an interface.

```typescript
interface NotificationService {
    send(message: string): void;
}
```

Step 2: Implement the interface.

```typescript
class EmailService implements NotificationService {

    send(message: string): void {
        console.log("Email:", message);
    }
}

class SMSService implements NotificationService {

    send(message: string): void {
        console.log("SMS:", message);
    }
}
```

Step 3: Inject dependency.

```typescript
class UserService {

    constructor(
        private notificationService: NotificationService
    ) {}

    registerUser(): void {

        this.notificationService.send(
            "Welcome to our application"
        );
    }
}
```

Step 4: Provide the dependency.

```typescript
const emailService = new EmailService();

const userService = new UserService(emailService);

userService.registerUser();
```

To switch to SMS:

```typescript
const smsService = new SMSService();

const userService = new UserService(smsService);

userService.registerUser();
```

The `UserService` implementation does not need to change.

## 20.2 Types of Dependency Injection

There are three commonly discussed forms.

### 1. Constructor Injection

Dependencies are provided through the constructor.

```typescript
class UserService {

    constructor(
        private emailService: EmailService
    ) {}
}
```

This is generally the preferred approach for required dependencies.

### 2. Setter Injection

Dependencies are provided through a setter method.

```typescript
class UserService {

    private emailService?: EmailService;

    setEmailService(service: EmailService): void {
        this.emailService = service;
    }
}
```

Useful when a dependency is optional or can be replaced after construction.

### 3. Method Injection

Dependencies are provided directly to a method.

```typescript
class UserService {

    sendNotification(
        service: NotificationService,
        message: string
    ): void {

        service.send(message);
    }
}
```

Useful when a dependency is needed only for a specific operation.

## 20.3 Manual DI vs DI Container

**Manual Dependency Injection:**

```typescript
const emailService = new EmailService();

const userService = new UserService(emailService);
```

You manually create and provide dependencies.

**DI Container:**

A DI container manages dependency registration, resolution, and sometimes object lifecycle.

Popular TypeScript DI libraries include:

- InversifyJS.
- TSyringe.

A DI container is not mandatory. Manual constructor injection is often sufficient for small and medium-sized applications.

### Important TypeScript detail

TypeScript interfaces are erased at runtime.

Therefore, a DI container cannot automatically use an interface as a runtime token without additional metadata or an explicit token mechanism.

For example:

```typescript
interface Logger {
    log(message: string): void;
}
```

There is no runtime `Logger` constructor available for dependency registration.

A token can be used instead:

```typescript
const LOGGER = Symbol("LOGGER");
```

---

# 21. Dependency Inversion Principle (DIP)

Dependency Inversion is one of the five SOLID principles.

It states:

1. High-level modules should not depend directly on low-level modules. Both should depend on abstractions.
2. Abstractions should not depend on implementation details. Implementation details should depend on abstractions.

### Without DIP

```typescript
class MySQLDatabase {

    save(data: string): void {
        console.log("Saving to MySQL:", data);
    }
}

class UserService {

    private database = new MySQLDatabase();

    saveUser(): void {
        this.database.save("John");
    }
}
```

`UserService` directly depends on MySQL.

### With DIP

```typescript
interface Database {
    save(data: string): void;
}
```

Implementation:

```typescript
class MySQLDatabase implements Database {

    save(data: string): void {
        console.log("Saving to MySQL:", data);
    }
}

class MongoDatabase implements Database {

    save(data: string): void {
        console.log("Saving to MongoDB:", data);
    }
}
```

High-level module:

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
const userService = new UserService(
    new MySQLDatabase()
);
```

Now the high-level module depends on an abstraction rather than a specific database implementation.

### DI vs DIP

| Dependency Injection | Dependency Inversion |
|---|---|
| A technique | A design principle |
| Provides dependencies externally | Defines the direction of dependencies |
| Helps implement DIP | Can be supported through DI |
| Example: Constructor injection | Example: Depending on a database interface |

**Remember:** DI is a technique; DIP is a principle.

---

# PART 5: SOLID PRINCIPLES

# 22. What Are SOLID Principles?

SOLID is a collection of five object-oriented design principles.

The goal is to create software that is:

- Maintainable.
- Extensible.
- Reusable.
- Testable.
- Less tightly coupled.

SOLID stands for:

| Letter | Principle |
|---|---|
| S | Single Responsibility Principle |
| O | Open/Closed Principle |
| L | Liskov Substitution Principle |
| I | Interface Segregation Principle |
| D | Dependency Inversion Principle |

---

# 23. Single Responsibility Principle (SRP)

## Definition

A class should have one responsibility and one primary reason to change.

### Incorrect implementation

```typescript
class User {

    saveToDatabase(): void {
        console.log("Saving user");
    }

    sendEmail(): void {
        console.log("Sending email");
    }

    generateReport(): void {
        console.log("Generating report");
    }
}
```

This class handles multiple responsibilities.

- Database operations.
- Email operations.
- Report generation.

### Better implementation

```typescript
class UserRepository {

    save(): void {
        console.log("Saving user");
    }
}
```

```typescript
class EmailService {

    send(): void {
        console.log("Sending email");
    }
}
```

```typescript
class ReportService {

    generate(): void {
        console.log("Generating report");
    }
}
```

Each class has a focused responsibility.

### Key takeaway

A class should not become a container for unrelated functionality.

---

# 24. Open/Closed Principle (OCP)

## Definition

Software entities should be open for extension but closed for modification.

This means we should be able to introduce new functionality without repeatedly changing stable existing code.

### Incorrect implementation

```typescript
class DiscountService {

    calculate(
        type: string,
        price: number
    ): number {

        if (type === "percentage") {
            return price * 0.9;
        }

        if (type === "fixed") {
            return price - 100;
        }

        return price;
    }
}
```

Every new discount type requires modifying this class.

### Better implementation

```typescript
interface Discount {
    calculate(price: number): number;
}
```

```typescript
class PercentageDiscount implements Discount {

    calculate(price: number): number {
        return price * 0.9;
    }
}
```

```typescript
class FixedDiscount implements Discount {

    calculate(price: number): number {
        return price - 100;
    }
}
```

```typescript
class DiscountService {

    constructor(
        private discount: Discount
    ) {}

    calculate(price: number): number {
        return this.discount.calculate(price);
    }
}
```

Now new discount strategies can be introduced without modifying `DiscountService`.

---

# 25. Liskov Substitution Principle (LSP)

## Definition

Objects of a superclass should be replaceable with objects of its subclasses without breaking the expected behavior of the application.

### Incorrect example

```typescript
class Bird {

    fly(): void {
        console.log("Flying");
    }
}

class Penguin extends Bird {

    fly(): void {
        throw new Error("Penguins cannot fly");
    }
}
```

A penguin is a bird, but it cannot satisfy the behavioral expectation that every `Bird` can fly.

### Better implementation

Separate the capabilities.

```typescript
interface Bird {
    eat(): void;
}
```

```typescript
interface FlyingBird extends Bird {
    fly(): void;
}
```

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
class Penguin implements Bird {

    eat(): void {
        console.log("Penguin eating");
    }
}
```

### Key takeaway

Inheritance should preserve behavioral expectations, not merely represent a superficial relationship.

---

# 26. Interface Segregation Principle (ISP)

## Definition

Clients should not be forced to depend on methods they do not use.

Prefer smaller, focused interfaces instead of large interfaces containing unrelated operations.

### Incorrect implementation

```typescript
interface Worker {

    work(): void;

    eat(): void;

    sleep(): void;
}
```

A robot worker does not need to eat or sleep.

### Better implementation

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
class HumanWorker implements
    Workable,
    Eatable,
    Sleepable {

    work(): void {}
    eat(): void {}
    sleep(): void {}
}
```

Robot:

```typescript
class RobotWorker implements Workable {

    work(): void {
        console.log("Robot working");
    }
}
```

### Key takeaway

Create focused interfaces based on actual capabilities.

---

# 27. Dependency Inversion Principle (DIP)

We discussed DIP earlier, but it is also the fifth SOLID principle.

### Incorrect

```typescript
class MySQLDatabase {}

class UserService {

    private database = new MySQLDatabase();
}
```

### Better

```typescript
interface Database {}

class MySQLDatabase implements Database {}

class MongoDatabase implements Database {}

class UserService {

    constructor(
        private database: Database
    ) {}
}
```

The high-level business logic depends on an abstraction rather than a concrete database.

### SOLID Summary

| Principle | Main Idea |
|---|---|
| SRP | One focused responsibility |
| OCP | Extend behavior without modifying stable code |
| LSP | Subtypes should preserve expected behavior |
| ISP | Prefer smaller, focused interfaces |
| DIP | Depend on abstractions rather than concrete implementations |

---

# PART 6: SOFTWARE ARCHITECTURE

# 28. What Is Software Architecture?

Software Architecture describes the high-level structure and organization of a software system.

It defines:

- Major components.
- Responsibilities.
- Communication between components.
- Dependency relationships.
- Data flow.
- Technology boundaries.
- Deployment structure.

### Example: E-commerce Application

A typical architecture may contain:

```text
E-Commerce Application
│
├── Frontend
│   ├── React
│   └── Next.js
│
├── Backend
│   ├── Authentication
│   ├── Users
│   ├── Products
│   ├── Orders
│   └── Payments
│
├── Database
│   ├── MySQL
│   └── MongoDB
│
├── External Services
│   ├── Payment Gateway
│   ├── Email Provider
│   └── Cloud Storage
│
└── Infrastructure
    ├── AWS
    ├── Docker
    └── Nginx
```

This is a high-level architecture.

Design patterns, on the other hand, generally address smaller recurring design problems within components.

---

# 29. Clean Architecture

## 29.1 What Is Clean Architecture?

Clean Architecture is an architectural approach that organizes software into layers while keeping core business rules independent of external frameworks and infrastructure.

Its central idea is:

**Dependencies should point inward, toward business rules.**

A common representation contains four layers.

```text
┌──────────────────────────────────────┐
│       Frameworks & Drivers           │
│                                      │
│  Express, MySQL, MongoDB, APIs        │
│                                      │
│  ┌────────────────────────────────┐  │
│  │       Interface Adapters       │  │
│  │                                │  │
│  │  Controllers, Repositories     │  │
│  │                                │  │
│  │  ┌──────────────────────────┐  │  │
│  │  │       Application        │  │  │
│  │  │                          │  │  │
│  │  │  Use Cases, Services     │  │  │
│  │  │                          │  │  │
│  │  │  ┌────────────────────┐  │  │  │
│  │  │  │       Domain       │  │  │  │
│  │  │  │                    │  │  │  │
│  │  │  │ Business Rules     │  │  │  │
│  │  │  └────────────────────┘  │  │  │
│  │  └──────────────────────────┘  │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

Let's understand each layer.

## 29.2 Domain Layer

The Domain Layer contains the core business concepts and rules.

Examples:

- User.
- Order.
- Product.
- Payment.
- Business validation rules.

It should not depend on Express, MySQL, MongoDB, or other infrastructure details.

Example:

```typescript
class Order {

    constructor(
        public readonly id: string,
        public readonly total: number
    ) {
        if (total <= 0) {
            throw new Error("Invalid order total");
        }
    }
}
```

## 29.3 Application Layer

The Application Layer contains use cases.

A use case represents a specific operation the application performs.

Examples:

- Create User.
- Place Order.
- Cancel Order.
- Process Payment.

```typescript
class CreateOrderUseCase {

    execute(): void {
        console.log("Creating order");
    }
}
```

It coordinates domain objects and external dependencies through abstractions.

## 29.4 Interface Adapters Layer

This layer converts data between external systems and application/domain models.

Examples:

- Controllers.
- Presenters.
- Repository implementations.
- API request/response mappers.

```typescript
class OrderController {

    constructor(
        private createOrder: CreateOrderUseCase
    ) {}

    create(): void {
        this.createOrder.execute();
    }
}
```

## 29.5 Frameworks and Drivers Layer

This layer contains external technologies.

Examples:

- Express.js.
- Next.js.
- MySQL.
- MongoDB.
- Redis.
- AWS.
- Third-party APIs.

The application should be able to replace an external technology without rewriting its core business rules.

### Example Project Structure

```text
src/
│
├── domain/
│   ├── entities/
│   │   └── Order.ts
│   │
│   ├── interfaces/
│   │   └── OrderRepository.ts
│   │
│   └── errors/
│       └── OrderError.ts
│
├── application/
│   └── use-cases/
│       └── CreateOrderUseCase.ts
│
├── infrastructure/
│   ├── database/
│   │   └── MySQLConnection.ts
│   │
│   └── repositories/
│       └── MySQLOrderRepository.ts
│
├── presentation/
│   └── controllers/
│       └── OrderController.ts
│
├── config/
│   └── container.ts
│
└── main.ts
```

### Why Clean Architecture?

- Business logic is independent of frameworks.
- Database implementations can be replaced.
- Unit testing becomes easier.
- Dependencies become more explicit.
- Large applications become easier to maintain.

**Important:** Clean Architecture does not require exactly four folders or layers. The important concept is dependency direction and separation of responsibilities.

---

# 30. Domain-Driven Design (DDD)

## 30.1 What Is DDD?

Domain-Driven Design is an approach to software development that focuses on understanding and modeling the business domain.

It is especially useful when the business rules are complex.

### Example

Consider an e-commerce application.

Business concepts include:

- Customers.
- Orders.
- Products.
- Payments.
- Shipping.
- Refunds.

Instead of designing the entire system around database tables, DDD encourages us to model the actual business concepts and rules.

Let's understand its important concepts.

## 30.2 Entity

An Entity is an object that has a unique identity.

Its identity remains the same even if some of its properties change.

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

Two users may have the same name but different identities.

```typescript
const user1 = new User("1", "John", "john@example.com");

const user2 = new User("2", "John", "john@example.com");
```

They are different entities because their IDs differ.

## 30.3 Value Object

A Value Object is defined by its values rather than a unique identity.

It is generally designed to be immutable.

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

    equals(other: Money): boolean {

        return (
            this.amount === other.amount &&
            this.currency === other.currency
        );
    }
}
```

Two Money objects with the same amount and currency are considered equal by value.

## 30.4 Aggregate

An Aggregate is a cluster of domain objects treated as a consistency boundary.

It ensures that related objects maintain business invariants together.

Example:

```text
Order Aggregate
│
├── Order (Aggregate Root)
│
├── OrderItem
│
└── OrderItem
```

## 30.5 Aggregate Root

The Aggregate Root is the main entity through which external code interacts with the aggregate.

Example:

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
        return this.items;
    }
}
```

External code should interact with order items through the `Order` aggregate root rather than modifying internal collections directly.

## 30.6 Repository

A Repository provides an abstraction for retrieving and persisting domain objects.

```typescript
interface OrderRepository {

    save(order: Order): Promise<void>;

    findById(id: string): Promise<Order | null>;
}
```

## 30.7 Domain Service

A Domain Service contains business logic that does not naturally belong to a single entity or value object.

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

## 30.8 Domain Event

A Domain Event represents something meaningful that happened in the business domain.

Examples:

- OrderPlaced.
- PaymentCompleted.
- UserRegistered.
- ProductOutOfStock.

```typescript
class OrderPlacedEvent {

    constructor(
        public readonly orderId: string,
        public readonly occurredAt: Date
    ) {}
}
```

## 30.9 Bounded Context

A Bounded Context defines a boundary within which a particular domain model and its terminology have a specific meaning.

For example:

```text
E-Commerce System
│
├── Sales Context
│   ├── Order
│   └── Customer
│
├── Inventory Context
│   ├── Stock
│   └── Warehouse
│
├── Payment Context
│   ├── Transaction
│   └── Refund
│
└── Shipping Context
    ├── Shipment
    └── Delivery
```

The concept of an Order in Sales may differ from the concept of an Order in Shipping.

### 30.10 Ubiquitous Language

Ubiquitous Language means using a shared vocabulary between developers and domain experts.

For example, if the business calls a transaction a "Refund", the code should preferably use that term rather than introducing unrelated terminology.

### DDD Summary

| Concept | Meaning |
|---|---|
| Entity | Object with unique identity |
| Value Object | Object defined by its values |
| Aggregate | Cluster of related objects with consistency rules |
| Aggregate Root | Main entry point to an aggregate |
| Repository | Persistence abstraction |
| Domain Service | Business logic not naturally owned by one entity |
| Domain Event | Something meaningful that happened |
| Bounded Context | Boundary of a particular domain model |
| Ubiquitous Language | Shared business and development vocabulary |

**Important:** DDD is not simply creating folders named `domain`, `entities`, and `repositories`. It is primarily about understanding and modeling business complexity.

---

# 31. Repository Pattern

## 31.1 What Is Repository Pattern?

The Repository Pattern provides an abstraction between business logic and data persistence.

It separates database operations from the application logic.

### Without Repository

```typescript
class UserService {

    async getUsers() {

        // Direct database query

        // SELECT * FROM users
    }
}
```

Here, the service is directly responsible for database operations.

### With Repository

First, define an interface.

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}

interface UserRepository {

    findAll(): Promise<User[]>;

    findById(id: number): Promise<User | null>;

    save(user: User): Promise<void>;
}
```

Create an implementation:

```typescript
class MySQLUserRepository implements UserRepository {

    async findAll(): Promise<User[]> {
        console.log("Fetching users from MySQL");
        return [];
    }

    async findById(id: number): Promise<User | null> {
        console.log("Fetching user:", id);
        return null;
    }

    async save(user: User): Promise<void> {
        console.log("Saving user:", user);
    }
}
```

Create a service:

```typescript
class UserService {

    constructor(
        private userRepository: UserRepository
    ) {}

    async getUsers(): Promise<User[]> {

        return this.userRepository.findAll();
    }
}
```

Usage:

```typescript
const repository = new MySQLUserRepository();

const service = new UserService(repository);

service.getUsers();
```

### Benefits

- Separates database operations from business logic.
- Makes testing easier.
- Allows database implementation replacement.
- Centralizes persistence logic.

### Important consideration

Do not create unnecessary generic repositories for every project.

For simple CRUD applications, a service directly using a well-designed ORM abstraction may be sufficient.

Use repositories when they provide meaningful separation between domain/application logic and persistence.

---

# 32. Unit of Work Pattern

## 32.1 What Is Unit of Work?

The Unit of Work Pattern coordinates multiple database operations as one logical transaction.

Its purpose is to ensure that related changes are committed together or rolled back together.

### Real-world example: Money Transfer

Suppose you transfer ₹1,000 from Account A to Account B.

Two operations are required:

1. Deduct ₹1,000 from Account A.
2. Add ₹1,000 to Account B.

What happens if the first operation succeeds but the second fails?

The data becomes inconsistent.

Both operations should belong to one database transaction.

### Conceptual TypeScript Example

```typescript
interface AccountRepository {

    deduct(
        accountId: string,
        amount: number
    ): Promise<void>;

    deposit(
        accountId: string,
        amount: number
    ): Promise<void>;
}
```

Unit of Work:

```typescript
interface UnitOfWork {

    accounts: AccountRepository;

    commit(): Promise<void>;

    rollback(): Promise<void>;
}
```

Transfer service:

```typescript
class TransferService {

    constructor(
        private unitOfWork: UnitOfWork
    ) {}

    async transfer(
        fromAccount: string,
        toAccount: string,
        amount: number
    ): Promise<void> {

        try {

            await this.unitOfWork.accounts.deduct(
                fromAccount,
                amount
            );

            await this.unitOfWork.accounts.deposit(
                toAccount,
                amount
            );

            await this.unitOfWork.commit();

        } catch (error) {

            await this.unitOfWork.rollback();

            throw error;
        }
    }
}
```

This is a conceptual abstraction. The actual implementation must connect `commit()` and `rollback()` to the same database transaction used by both repository operations.

### Example with Sequelize

```typescript
import { sequelize } from "./database";

async function transferMoney(): Promise<void> {

    const transaction = await sequelize.transaction();

    try {

        await Account.decrement(
            "balance",
            {
                by: 1000,
                where: { id: 1 },
                transaction
            }
        );

        await Account.increment(
            "balance",
            {
                by: 1000,
                where: { id: 2 },
                transaction
            }
        );

        await transaction.commit();

    } catch (error) {

        await transaction.rollback();

        throw error;
    }
}
```

### Repository vs Unit of Work

| Repository | Unit of Work |
|---|---|
| Handles persistence operations | Coordinates a group of operations |
| Focuses on retrieving and saving objects | Focuses on transaction boundaries |
| Abstracts data access | Ensures related changes are committed or rolled back together |

---

# 33. Event-Driven Architecture (EDA)

## 33.1 What Is Event-Driven Architecture?

Event-Driven Architecture is an architectural style in which components communicate by producing and consuming events.

An event represents something that has happened.

### Real-world example

When a customer places an order:

```text
Customer Places Order
        |
        v
    Order Service
        |
        v
    OrderPlaced Event
        |
        ├── Payment Service
        |
        ├── Inventory Service
        |
        ├── Notification Service
        |
        └── Analytics Service
```

Each service can react independently to the event.

### Step 1: Define an Event

```typescript
interface OrderPlacedEvent {
    orderId: string;
    customerId: string;
    total: number;
}
```

### Step 2: Create Event Handlers

```typescript
class PaymentHandler {

    handle(event: OrderPlacedEvent): void {
        console.log("Processing payment:", event.orderId);
    }
}
```

```typescript
class InventoryHandler {

    handle(event: OrderPlacedEvent): void {
        console.log("Updating inventory:", event.orderId);
    }
}
```

```typescript
class EmailHandler {

    handle(event: OrderPlacedEvent): void {
        console.log("Sending order confirmation:", event.orderId);
    }
}
```

### Step 3: Create Event Publisher

```typescript
class EventBus {

    private handlers: Array<
        (event: OrderPlacedEvent) => void
    > = [];

    subscribe(
        handler: (event: OrderPlacedEvent) => void
    ): void {
        this.handlers.push(handler);
    }

    publish(event: OrderPlacedEvent): void {

        for (const handler of this.handlers) {
            handler(event);
        }
    }
}
```

### Step 4: Use the Event Bus

```typescript
const eventBus = new EventBus();

const payment = new PaymentHandler();
const inventory = new InventoryHandler();
const email = new EmailHandler();

eventBus.subscribe(
    event => payment.handle(event)
);

eventBus.subscribe(
    event => inventory.handle(event)
);

eventBus.subscribe(
    event => email.handle(event)
);

eventBus.publish({
    orderId: "ORD-101",
    customerId: "USER-10",
    total: 5000
});
```

### Important: This example is synchronous

The handlers execute directly in the same process.

In production, distributed event-driven applications often use message brokers.

Examples:

- RabbitMQ.
- Apache Kafka.
- AWS SQS.
- Redis Streams.

## 33.2 Synchronous vs Asynchronous Events

| Synchronous | Asynchronous |
|---|---|
| Handler executes immediately | Handler executes later |
| Usually same process | Can cross services |
| Caller may wait for processing | Caller can continue |
| Simpler to implement | Requires messaging infrastructure |

## 33.3 Domain Events vs Integration Events

| Domain Event | Integration Event |
|---|---|
| Represents something that happened inside a domain | Communicates an event to external systems |
| Often internal to a bounded context | Designed for cross-system communication |
| Can contain domain-specific information | Usually has a stable, versioned contract |

## 33.4 Important Production Concepts

### 1. Eventual Consistency

In asynchronous systems, different services may not update at exactly the same time.

For example:

- Order is created.
- Inventory update is queued.
- Notification is sent later.

For a short period, the system may contain temporarily inconsistent views.

### 2. Idempotency

An operation is idempotent if executing it multiple times has the same intended effect as executing it once.

This is important because message brokers may deliver duplicate messages.

For example, a payment handler should not charge a customer twice when the same event is delivered repeatedly.

### 3. Retry Mechanism

If a handler fails temporarily, the system may retry processing.

Retries should use limits and appropriate backoff strategies.

### 4. Dead Letter Queue (DLQ)

Messages that repeatedly fail can be moved to a Dead Letter Queue for investigation.

### 5. Transactional Outbox Pattern

The Outbox Pattern helps prevent losing events when a database transaction succeeds but publishing the corresponding message fails.

A typical approach:

1. Save the business data.
2. Save the event in an outbox table.
3. Commit both in one database transaction.
4. A background worker publishes the outbox event.
5. Mark the event as published.

This improves reliability when integrating database transactions with message brokers.

---

# PART 7: PRACTICAL APPLICATION

# 34. How Design Patterns Work Together

In real-world applications, multiple patterns often work together.

Consider an Order Management API.

A request might flow like this:

```text
HTTP Request
     |
     v
Order Controller
     |
     v
Create Order Use Case
     |
     ├── Order Repository Interface
     |
     ├── Payment Strategy
     |
     └── Notification Interface
               |
               v
        Infrastructure
               |
        ├── MySQL Repository
        ├── Payment Adapter
        └── Email Adapter
```

Possible patterns:

| Component | Pattern / Concept |
|---|---|
| Order creation | Use Case |
| Database access | Repository |
| Transaction coordination | Unit of Work |
| Payment selection | Strategy |
| Payment SDK integration | Adapter |
| Dependency management | Dependency Injection |
| Event notification | Observer / Event-Driven Architecture |
| Business model | Domain-Driven Design |
| Overall structure | Clean Architecture |

The goal is not to use every pattern.

The goal is to select the appropriate pattern for the problem.

---

# 35. Complete TypeScript Architecture Example

Let's build a simplified Order Management application using several concepts from this phase.

## 35.1 Project Structure

```text
src/
│
├── domain/
│   ├── entities/
│   │   └── Order.ts
│   │
│   └── repositories/
│       └── OrderRepository.ts
│
├── application/
│   └── use-cases/
│       └── CreateOrderUseCase.ts
│
├── infrastructure/
│   ├── repositories/
│   │   └── InMemoryOrderRepository.ts
│   │
│   └── payment/
│       └── StripePayment.ts
│
├── presentation/
│   └── controllers/
│       └── OrderController.ts
│
└── main.ts
```

## 35.2 Domain Entity

`domain/entities/Order.ts`

```typescript
export class Order {

    constructor(
        public readonly id: string,
        public readonly customerId: string,
        public readonly total: number
    ) {

        if (total <= 0) {
            throw new Error("Invalid order total");
        }
    }
}
```

## 35.3 Repository Interface

`domain/repositories/OrderRepository.ts`

```typescript
import { Order } from "../entities/Order";

export interface OrderRepository {

    save(order: Order): Promise<void>;

    findById(id: string): Promise<Order | null>;
}
```

## 35.4 Repository Implementation

`infrastructure/repositories/InMemoryOrderRepository.ts`

```typescript
import { Order } from "../../domain/entities/Order";

import {
    OrderRepository
} from "../../domain/repositories/OrderRepository";

export class InMemoryOrderRepository
    implements OrderRepository {

    private orders: Order[] = [];

    async save(order: Order): Promise<void> {

        this.orders.push(order);
    }

    async findById(id: string): Promise<Order | null> {

        return this.orders.find(
            order => order.id === id
        ) ?? null;
    }
}
```

## 35.5 Payment Interface

```typescript
export interface PaymentService {

    processPayment(amount: number): Promise<void>;
}
```

## 35.6 Payment Implementation

`infrastructure/payment/StripePayment.ts`

```typescript
import { PaymentService } from "../../application/PaymentService";

export class StripePayment implements PaymentService {

    async processPayment(amount: number): Promise<void> {

        console.log(`Processing Stripe payment: ${amount}`);
    }
}
```

For this example, assume the `PaymentService` interface is stored at `application/PaymentService.ts`.

## 35.7 Create Order Use Case

`application/use-cases/CreateOrderUseCase.ts`

```typescript
import { Order } from "../../domain/entities/Order";

import {
    OrderRepository
} from "../../domain/repositories/OrderRepository";

import { PaymentService } from "../PaymentService";

export class CreateOrderUseCase {

    constructor(
        private orderRepository: OrderRepository,
        private paymentService: PaymentService
    ) {}

    async execute(
        customerId: string,
        total: number
    ): Promise<Order> {

        const order = new Order(
            crypto.randomUUID(),
            customerId,
            total
        );

        await this.paymentService.processPayment(total);

        await this.orderRepository.save(order);

        return order;
    }
}
```

## 35.8 Controller

`presentation/controllers/OrderController.ts`

```typescript
import {
    CreateOrderUseCase
} from "../../application/use-cases/CreateOrderUseCase";

export class OrderController {

    constructor(
        private createOrderUseCase: CreateOrderUseCase
    ) {}

    async createOrder(
        customerId: string,
        total: number
    ) {

        return await this.createOrderUseCase.execute(
            customerId,
            total
        );
    }
}
```

## 35.9 Composition Root

`main.ts`

```typescript
import {
    InMemoryOrderRepository
} from "./infrastructure/repositories/InMemoryOrderRepository";

import {
    StripePayment
} from "./infrastructure/payment/StripePayment";

import {
    CreateOrderUseCase
} from "./application/use-cases/CreateOrderUseCase";

import {
    OrderController
} from "./presentation/controllers/OrderController";

// Create dependencies

const orderRepository = new InMemoryOrderRepository();

const paymentService = new StripePayment();

// Inject dependencies

const createOrderUseCase = new CreateOrderUseCase(
    orderRepository,
    paymentService
);

const orderController = new OrderController(
    createOrderUseCase
);

// Execute

async function main(): Promise<void> {

    const order = await orderController.createOrder(
        "USER-101",
        5000
    );

    console.log(order);
}

main();
```

### What Did We Implement?

| Concept | Implementation |
|---|---|
| Domain Entity | `Order` |
| Repository Pattern | `OrderRepository` |
| Dependency Injection | Constructor injection |
| Dependency Inversion | Use case depends on interfaces |
| Clean Architecture | Separated layers |
| Use Case | `CreateOrderUseCase` |
| Composition Root | `main.ts` |

### Production Improvements

This is a learning example, not a complete production payment workflow.

A production implementation should additionally handle:

- Payment failures.
- Database transactions.
- Payment idempotency.
- Order status transitions.
- Input validation.
- Authentication and authorization.
- Logging and monitoring.
- Event publishing.
- Secure payment-provider integration.

Also, the payment operation and order persistence should not be treated as one atomic database transaction. External payment systems require a carefully designed workflow, often involving payment intents, idempotency keys, and compensating actions.

---

# 36. When Should You Use Which Design Pattern?

You do not need to use all patterns in every application.

Choose them based on the problem.

| Problem | Suitable Pattern |
|---|---|
| Need one shared instance | Singleton |
| Centralized object creation | Factory |
| Create related object families | Abstract Factory |
| Complex object construction | Builder |
| Clone existing objects | Prototype |
| Integrate incompatible interfaces | Adapter |
| Add behavior without modifying an object | Decorator |
| Simplify a complex subsystem | Facade |
| Control access to an object | Proxy |
| Represent hierarchical structures | Composite |
| Notify multiple subscribers | Observer |
| Switch between algorithms | Strategy |
| Encapsulate operations as objects | Command |
| Change behavior based on state | State |
| Define an algorithm skeleton | Template Method |
| Process requests through handlers | Chain of Responsibility |
| Supply dependencies externally | Dependency Injection |
| Coordinate database transactions | Unit of Work |
| Abstract persistence operations | Repository |

---

# 37. Common Design and Architecture Mistakes

Avoid these mistakes when building TypeScript applications.

### 1. Overusing Design Patterns

Not every class requires a design pattern.

Simple code is often better than unnecessary abstraction.

### 2. Creating Unnecessary Interfaces

Do not create interfaces for every class without a meaningful need.

Use interfaces when they provide a useful abstraction or boundary.

### 3. Tight Coupling

Avoid creating dependencies directly inside business services when those dependencies should be replaceable.

### 4. Misusing Singleton

A global mutable singleton can make testing and parallel execution difficult.

### 5. Ignoring SOLID

Large classes with unrelated responsibilities become difficult to maintain.

### 6. Mixing Business Logic and Database Logic

Avoid placing SQL queries directly inside controllers or domain entities.

### 7. Using Inheritance Everywhere

Prefer composition when it provides a simpler and more flexible design.

### 8. Confusing DI and DIP

Remember:

- DI is a technique.
- DIP is a principle.

### 9. Overengineering Clean Architecture

A small CRUD application may not need multiple abstraction layers.

Introduce architecture according to actual complexity.

### 10. Ignoring Transaction Boundaries

Related database changes should use appropriate transactions.

### 11. Ignoring Event Delivery Failures

Distributed event-driven systems must handle duplicate messages, retries, and failed deliveries.

### 12. Assuming TypeScript Interfaces Exist at Runtime

Interfaces and type aliases are erased during compilation.

They cannot directly be used as runtime validation mechanisms.

---

# 38. Interview Questions and Answers

## Q1. What is a Design Pattern?

A reusable solution to a commonly occurring software design problem.

## Q2. What are the three categories of GoF design patterns?

Creational, Structural, and Behavioral.

## Q3. What is Singleton?

A pattern that provides a shared instance within a defined application scope.

## Q4. What is Factory Pattern?

A pattern that centralizes object creation and hides concrete instantiation details.

## Q5. What is Abstract Factory?

A pattern that creates families of related objects without exposing their concrete classes.

## Q6. What is Builder Pattern?

A pattern that constructs complex objects step by step.

## Q7. What is Prototype Pattern?

A pattern that creates new objects by cloning existing objects.

## Q8. What is Adapter Pattern?

A pattern that allows incompatible interfaces to work together.

## Q9. What is Decorator Pattern?

A pattern that adds behavior to an object by wrapping it.

## Q10. What is Facade Pattern?

A pattern that provides a simplified interface to a complex subsystem.

## Q11. What is Proxy Pattern?

A pattern that controls access to another object through a substitute object.

## Q12. What is Composite Pattern?

A pattern that allows individual objects and groups of objects to be treated uniformly.

## Q13. What is Observer Pattern?

A pattern where registered observers receive notifications when a subject changes or publishes an update.

## Q14. What is Strategy Pattern?

A pattern that defines interchangeable algorithms and allows one to be selected at runtime.

## Q15. What is Command Pattern?

A pattern that encapsulates a request or operation as an object.

## Q16. What is State Pattern?

A pattern that changes an object's behavior according to its internal state.

## Q17. What is Template Method?

A pattern that defines an algorithm's structure in a base class and lets subclasses customize specific steps.

## Q18. What is Chain of Responsibility?

A pattern that passes requests through a sequence of handlers.

## Q19. What is Dependency Injection?

A technique in which dependencies are provided externally rather than created internally.

## Q20. What is Dependency Inversion?

A principle that requires high-level and low-level modules to depend on abstractions.

## Q21. What is the difference between DI and DIP?

DI is a technique for providing dependencies. DIP is a design principle about dependency direction.

## Q22. What are SOLID principles?

Five object-oriented design principles: SRP, OCP, LSP, ISP, and DIP.

## Q23. What is SRP?

A class should have one focused responsibility and one primary reason to change.

## Q24. What is OCP?

Software should be open for extension but closed for modification.

## Q25. What is LSP?

Subtypes should be usable in place of their base types without breaking expected behavior.

## Q26. What is ISP?

Clients should not depend on methods they do not need.

## Q27. What is Clean Architecture?

An architectural approach that separates business rules from frameworks and infrastructure.

## Q28. What is DDD?

Domain-Driven Design is an approach that models software around business concepts and rules.

## Q29. What is an Entity?

An object defined by its unique identity.

## Q30. What is a Value Object?

An object defined by its values rather than identity.

## Q31. What is an Aggregate?

A cluster of related domain objects that forms a consistency boundary.

## Q32. What is an Aggregate Root?

The main entity through which external code interacts with an aggregate.

## Q33. What is Repository Pattern?

An abstraction that separates persistence operations from business logic.

## Q34. What is Unit of Work?

A pattern that coordinates multiple database operations within a transaction.

## Q35. What is Event-Driven Architecture?

An architectural style where components communicate through events.

## Q36. What is Eventual Consistency?

A consistency model where distributed components may temporarily have different states but are expected to converge.

## Q37. What is Idempotency?

An operation is idempotent when repeating it produces the same intended result as performing it once.

## Q38. What is the difference between Repository and Unit of Work?

Repository abstracts persistence operations; Unit of Work coordinates multiple operations within a transaction.

## Q39. What is the difference between Observer and Pub/Sub?

Observer generally uses a direct subject-observer relationship, whereas Pub/Sub typically uses a broker or channel to decouple publishers and subscribers.

## Q40. Is Dependency Injection a design pattern?

DI is generally described as a dependency management technique or design principle implementation technique, rather than one of the classic GoF patterns.

---

# 39. Practical Exercises

Complete these exercises to strengthen your understanding.

### Exercise 1: Singleton

Create a Logger class that provides one shared instance.

Requirements:

- Private constructor.
- Static instance.
- `getInstance()` method.
- `log()` method.

### Exercise 2: Factory

Create a Notification Factory supporting:

- Email.
- SMS.
- WhatsApp.
- Push Notifications.

### Exercise 3: Abstract Factory

Create cloud provider factories supporting:

- AWS.
- Azure.
- Google Cloud.

Each factory should create storage and database services.

### Exercise 4: Builder

Create a `ProductBuilder` supporting:

- Name.
- Price.
- Description.
- Category.
- Stock.
- Discount.

Validate required properties before building.

### Exercise 5: Adapter

Integrate two payment SDKs that expose different method names through one common interface.

### Exercise 6: Decorator

Create a logging decorator and caching decorator for an API service.

### Exercise 7: Strategy

Create a shipping cost calculator supporting:

- Standard Shipping.
- Express Shipping.
- International Shipping.

### Exercise 8: Observer

Create an event notification system that supports:

- Email subscribers.
- SMS subscribers.
- Push notification subscribers.

Implement subscribe and unsubscribe methods.

### Exercise 9: SOLID

Take a large UserService class and refactor it using all five SOLID principles.

### Exercise 10: Dependency Injection

Build a UserService that supports MySQL and MongoDB repositories through constructor injection.

### Exercise 11: Clean Architecture

Create a simple Expense Management API with:

- Expense Entity.
- Expense Repository.
- Create Expense Use Case.
- Expense Controller.
- MySQL Repository Implementation.

### Exercise 12: Unit of Work

Implement a bank transfer operation using a database transaction.

### Exercise 13: Event-Driven Architecture

Build an OrderPlaced event system that triggers:

- Payment processing.
- Inventory updates.
- Email notifications.

### Exercise 14: Complete Project

Build a complete E-commerce Backend using:

- TypeScript.
- Node.js.
- Express.js.
- MySQL.
- Sequelize.
- JWT Authentication.
- Repository Pattern.
- Dependency Injection.
- SOLID Principles.
- Clean Architecture.
- Event-Driven Architecture.

---

# 40. Phase 39 Completion Checklist

Before moving to the next phase, make sure you understand the following topics.

**Creational Patterns**
- [ ] Singleton
- [ ] Factory
- [ ] Abstract Factory
- [ ] Builder
- [ ] Prototype

**Structural Patterns**
- [ ] Adapter
- [ ] Decorator
- [ ] Facade
- [ ] Proxy
- [ ] Composite

**Behavioral Patterns**
- [ ] Observer
- [ ] Strategy
- [ ] Command
- [ ] State
- [ ] Template Method
- [ ] Chain of Responsibility

**Dependency Management**
- [ ] Dependency Injection
- [ ] Constructor Injection
- [ ] Setter Injection
- [ ] Method Injection
- [ ] Dependency Inversion

**Software Design Principles**
- [ ] SOLID Principles
- [ ] SRP
- [ ] OCP
- [ ] LSP
- [ ] ISP
- [ ] DIP

**Software Architecture**
- [ ] Software Architecture Fundamentals
- [ ] Clean Architecture
- [ ] Domain-Driven Design
- [ ] Entities
- [ ] Value Objects
- [ ] Aggregates
- [ ] Aggregate Roots
- [ ] Domain Events
- [ ] Bounded Contexts
- [ ] Repository Pattern
- [ ] Unit of Work
- [ ] Event-Driven Architecture

---

# Next Phase

## Phase 40: Advanced TypeScript – Type-Level Programming and Advanced Type System

In the next phase, we will explore TypeScript's advanced type system in depth.

Topics will include:

1. Advanced Generics.
2. Generic Constraints.
3. Generic Defaults.
4. Generic Inference.
5. Conditional Types.
6. Distributive Conditional Types.
7. The `infer` Keyword.
8. Mapped Types.
9. Key Remapping.
10. Template Literal Types.
11. Recursive Types.
12. Variadic Tuple Types.
13. Utility Types Internals.
14. Advanced `keyof`.
15. Advanced `typeof`.
16. Indexed Access Types.
17. Type Predicates.
18. Assertion Functions.
19. Branded Types.
20. Nominal Typing Techniques.
21. Type-Level Programming.
22. Advanced Type Guards.
23. Type-Safe API Design.
24. Type-Safe Event Systems.
25. Advanced TypeScript Patterns.
26. Real-World Type-Level Projects.

**Phase 39 is complete.** When you're ready, say **OK, Phase 40** to continue.