# Phase 68: Advanced TypeScript – Advanced Software Architecture, Design Patterns, SOLID Principles, Clean Architecture, Domain-Driven Design, Dependency Injection and Enterprise Application Design

**Level:** Expert / Advanced Software Architecture  
**Prerequisites:** TypeScript, JavaScript, Node.js, Express, React, Next.js, SQL, MongoDB, REST APIs, OOP, System Design and Microservices Architecture.

---

# 1. Learning Objectives

By completing this phase, you will understand how to:

1. Design maintainable enterprise applications.
2. Understand different software architectural styles.
3. Implement Layered Architecture.
4. Understand Clean Architecture.
5. Implement Hexagonal Architecture.
6. Understand Onion Architecture.
7. Apply all five SOLID principles.
8. Understand and implement 23 Gang of Four Design Patterns.
9. Implement Dependency Injection.
10. Understand Inversion of Control.
11. Implement Repository and Unit of Work patterns.
12. Understand Service Layer and DTO patterns.
13. Apply Domain-Driven Design.
14. Understand Entities, Value Objects and Aggregates.
15. Implement Domain Events.
16. Understand Bounded Contexts.
17. Apply architectural patterns in TypeScript applications.
18. Design enterprise-grade applications with maintainable code.

# 2. Software Architecture Fundamentals

## 2.1 What is Software Architecture?

Software Architecture describes the fundamental structure of a software system.

It defines:

- Components.
- Modules.
- Responsibilities.
- Dependencies.
- Communication.
- Data flow.
- Technology choices.
- Architectural boundaries.

Example:

Imagine developing an e-commerce application.

```text
                E-Commerce Application
                          |
           +--------------+--------------+
           |              |              |
           v              v              v
       User Module    Product Module   Order Module
           |              |              |
           v              v              v
       User Logic    Product Logic    Order Logic
           |              |              |
           +--------------+--------------+
                          |
                          v
                       Database
```

Software architecture determines how these modules are organized and interact.

## 2.2 Why is Software Architecture Important?

Without proper architecture:

- Code becomes tightly coupled.
- Business logic becomes difficult to maintain.
- Testing becomes complicated.
- Adding new features becomes expensive.
- Changing databases becomes difficult.
- Multiple developers may interfere with each other's work.
- Bugs become harder to isolate.

Good architecture helps achieve:

1. Maintainability.
2. Scalability.
3. Testability.
4. Reusability.
5. Flexibility.
6. Separation of concerns.
7. Modularity.
8. Extensibility.

## 2.3 Architecture vs Design

| Software Architecture | Software Design |
|---|---|
| Defines the overall system structure. | Defines the internal implementation of components. |
| Focuses on major components and boundaries. | Focuses on classes, methods and algorithms. |
| Includes architectural styles and technology decisions. | Includes design patterns and object relationships. |
| Example: Microservices. | Example: Factory Pattern. |

Architecture and design are related. They operate at different levels of abstraction.

---

# 3. Architectural Styles

An architectural style defines a general way of organizing a software system.

Common architectural styles include:

| Architecture | Description |
|---|---|
| Layered Architecture | Organizes software into logical layers. |
| Monolithic Architecture | Deploys the application as one primary unit. |
| Microservices Architecture | Divides functionality into independently deployable services. |
| Event-Driven Architecture | Components communicate through events. |
| Hexagonal Architecture | Separates business logic from external systems using ports and adapters. |
| Clean Architecture | Organizes dependencies around business rules. |
| Onion Architecture | Places the domain model at the center. |
| Serverless Architecture | Uses managed event-driven compute services. |
| Pipe-and-Filter Architecture | Processes data through connected processing stages. |
| Client-Server Architecture | Separates clients from centralized services. |

## 3.1 Choosing an Architecture

There is no universally best architecture.

Consider:

- Application size.
- Business complexity.
- Team size.
- Deployment requirements.
- Performance requirements.
- Expected changes.
- Operational capabilities.
- Infrastructure costs.

For a small application, a modular monolith may be more practical than microservices.

For a large enterprise platform with independently owned business capabilities, microservices may be appropriate.

---

# 4. Layered Architecture

## 4.1 What is Layered Architecture?

Layered Architecture divides an application into layers, with each layer having a specific responsibility.

A common structure is:

```text
          Presentation Layer
                   |
                   v
           Business Layer
                   |
                   v
          Persistence Layer
                   |
                   v
              Database
```

### Layer 1: Presentation Layer

Responsible for interacting with users or external clients.

Examples:

- React components.
- Next.js pages.
- Express controllers.
- API endpoints.

### Layer 2: Business Layer

Contains business rules and application logic.

Examples:

- User registration.
- Order creation.
- Payment validation.
- Inventory calculations.

### Layer 3: Persistence Layer

Responsible for storing and retrieving data.

Examples:

- Repository classes.
- Sequelize models.
- MongoDB queries.
- MySQL queries.

### Layer 4: Database

Stores application data.

Examples:

- MySQL.
- PostgreSQL.
- MongoDB.

## 4.2 Example Project Structure

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
├── models/
│   └── user.model.ts
│
├── routes/
│   └── user.routes.ts
│
├── database/
│   └── connection.ts
│
└── app.ts
```

## 4.3 Example Implementation

### User Controller

```typescript
import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  async getUser(
    req: Request,
    res: Response
  ) {
    const user = await this.userService.getUser(
      Number(req.params.id)
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.json(user);
  }
}
```

### User Service

```typescript
import { UserRepository } from "../repositories/user.repository";

export class UserService {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async getUser(id: number) {
    if (id <= 0) {
      throw new Error("Invalid user ID");
    }

    return this.userRepository.findById(id);
  }
}
```

### User Repository

```typescript
export interface User {
  id: number;
  name: string;
  email: string;
}

export class UserRepository {
  private users: User[] = [
    {
      id: 1,
      name: "John",
      email: "john@example.com"
    }
  ];

  async findById(id: number) {
    return this.users.find(
      user => user.id === id
    ) ?? null;
  }
}
```

This example uses an in-memory repository to demonstrate the architectural separation.

## 4.4 Advantages

- Easy to understand.
- Clear separation of responsibilities.
- Suitable for many business applications.
- Easier to organize development teams.
- Supports testing.

## 4.5 Disadvantages

- Layers can become tightly coupled.
- Business logic may leak into controllers.
- Excessive layers can create unnecessary complexity.
- Traditional layered designs can make domain logic depend on database-specific implementation details.

---

# 5. Separation of Concerns

## 5.1 What is Separation of Concerns?

Separation of Concerns (SoC) means dividing software into independent sections, each responsible for a specific concern.

Example:

A user management application has these concerns:

- Authentication.
- Authorization.
- User management.
- Database access.
- Email notifications.
- Logging.

These responsibilities should not all be implemented inside one large controller.

### Poor Design

```typescript
async function registerUser(req: any, res: any) {
  // Validate request.

  // Hash password.

  // Connect to database.

  // Insert user.

  // Generate token.

  // Send email.

  // Log activity.

  // Return response.
}
```

This function handles too many responsibilities.

### Better Design

```text
UserController
      |
      v
UserService
      |
      +---- UserRepository
      |
      +---- PasswordService
      |
      +---- TokenService
      |
      +---- EmailService
```

Each component has a clearly defined responsibility.

## 5.2 Benefits

- Easier testing.
- Easier debugging.
- Reduced coupling.
- Better maintainability.
- Improved reusability.

---

# 6. Coupling and Cohesion

These two concepts are fundamental to software design.

## 6.1 What is Coupling?

Coupling measures how strongly one component depends on another component.

### Tight Coupling

```typescript
class UserService {
  private database = new MySQLDatabase();

  getUser(id: number) {
    return this.database.findUser(id);
  }
}
```

Here, `UserService` directly depends on `MySQLDatabase`.

Changing the database implementation may require modifying the service.

### Loose Coupling

```typescript
interface UserRepository {
  findUser(id: number): Promise<User | null>;
}

class UserService {
  constructor(
    private readonly repository: UserRepository
  ) {}

  getUser(id: number) {
    return this.repository.findUser(id);
  }
}
```

Now `UserService` depends on an abstraction rather than a specific database implementation.

## 6.2 What is Cohesion?

Cohesion describes how closely related the responsibilities within a module are.

### Low Cohesion

```typescript
class ApplicationService {
  createUser() {}

  generateInvoice() {}

  sendEmail() {}

  calculateTax() {}

  uploadImage() {}
}
```

These operations belong to different business responsibilities.

### High Cohesion

```typescript
class InvoiceService {
  createInvoice() {}

  calculateTotal() {}

  calculateTax() {}
}
```

The methods are closely related to invoice processing.

## 6.3 Coupling vs Cohesion

| Coupling | Cohesion |
|---|---|
| Measures dependencies between components. | Measures relatedness within a component. |
| Prefer low coupling. | Prefer high cohesion. |
| Concerns relationships between modules. | Concerns responsibilities within modules. |

**Goal: Low Coupling + High Cohesion.**

---

# 7. SOLID Principles

SOLID is a collection of five object-oriented design principles.

SOLID stands for:

| Letter | Principle |
|---|---|
| S | Single Responsibility Principle |
| O | Open/Closed Principle |
| L | Liskov Substitution Principle |
| I | Interface Segregation Principle |
| D | Dependency Inversion Principle |

These principles help create maintainable and extensible software.

---

# 8. Single Responsibility Principle (SRP)

## 8.1 Definition

A class should have one reason to change.

This does not mean a class can have only one method.

It means a class should have one clearly defined responsibility.

## 8.2 Bad Example

```typescript
class User {
  saveToDatabase() {}

  sendEmail() {}

  generateReport() {}

  validatePassword() {}
}
```

This class has multiple responsibilities:

- User data management.
- Database persistence.
- Email delivery.
- Report generation.
- Password validation.

Changes to unrelated features can require modifying the same class.

## 8.3 Better Example

```typescript
class User {
  constructor(
    public name: string,
    public email: string
  ) {}
}

class UserRepository {
  save(user: User) {
    console.log("Saving user");
  }
}

class EmailService {
  sendWelcomeEmail(user: User) {
    console.log("Sending email");
  }
}

class UserValidator {
  validate(user: User) {
    return user.email.includes("@");
  }
}
```

Now each class has one primary responsibility.

## 8.4 Benefits

- Easier maintenance.
- Better testability.
- Reduced coupling.
- Easier feature development.

## 8.5 Interview Question

**Q: Does SRP mean one class should contain only one method?**

No. SRP means one class should have one primary responsibility and one reason to change, not just one method.

---

# 9. Open/Closed Principle (OCP)

## 9.1 Definition

Software entities should be:

- Open for extension.
- Closed for modification.

This means new functionality should ideally be introduced without repeatedly changing stable existing code.

## 9.2 Bad Example

Suppose an application supports multiple payment methods.

```typescript
class PaymentService {
  processPayment(
    type: string,
    amount: number
  ) {
    if (type === "CARD") {
      console.log("Processing card payment");
    } else if (type === "UPI") {
      console.log("Processing UPI payment");
    } else if (type === "PAYPAL") {
      console.log("Processing PayPal payment");
    }
  }
}
```

Every time a new payment method is introduced, this class must be modified.

## 9.3 Better Example

Define an abstraction:

```typescript
interface PaymentMethod {
  pay(amount: number): void;
}
```

Implement different payment methods:

```typescript
class CardPayment implements PaymentMethod {
  pay(amount: number) {
    console.log(`Card payment: ${amount}`);
  }
}

class UpiPayment implements PaymentMethod {
  pay(amount: number) {
    console.log(`UPI payment: ${amount}`);
  }
}

class PaypalPayment implements PaymentMethod {
  pay(amount: number) {
    console.log(`PayPal payment: ${amount}`);
  }
}
```

Payment service:

```typescript
class PaymentService {
  process(
    paymentMethod: PaymentMethod,
    amount: number
  ) {
    paymentMethod.pay(amount);
  }
}
```

Usage:

```typescript
const paymentService = new PaymentService();

paymentService.process(
  new UpiPayment(),
  1000
);
```

Now another payment method can be added by implementing `PaymentMethod`.

The existing payment service does not need modification.

## 9.4 Important Note

OCP does not mean existing code must never change.

It means stable code should be designed so that predictable extensions do not require unnecessary modifications.

---

# 10. Liskov Substitution Principle (LSP)

## 10.1 Definition

Objects of a parent type should be replaceable with objects of its child types without breaking the expected behavior of the program.

## 10.2 Bad Example

Consider a rectangle and square.

```typescript
class Rectangle {
  constructor(
    public width: number,
    public height: number
  ) {}

  setWidth(width: number) {
    this.width = width;
  }

  setHeight(height: number) {
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}
```

Now create a square:

```typescript
class Square extends Rectangle {
  setWidth(width: number) {
    this.width = width;
    this.height = width;
  }

  setHeight(height: number) {
    this.width = height;
    this.height = height;
  }
}
```

Usage:

```typescript
function calculateArea(
  rectangle: Rectangle
) {
  rectangle.setWidth(10);
  rectangle.setHeight(5);

  return rectangle.getArea();
}

const rectangle = new Rectangle(2, 3);

console.log(calculateArea(rectangle)); // 50
```

With a square:

```typescript
const square = new Square(2, 2);

console.log(calculateArea(square)); // 25
```

The function expects rectangle behavior, but the square changes the expected behavior.

This violates the substitution expectation.

## 10.3 Better Design

Use a shared abstraction without forcing an inappropriate inheritance relationship.

```typescript
interface Shape {
  getArea(): number;
}

class Rectangle implements Shape {
  constructor(
    private width: number,
    private height: number
  ) {}

  getArea() {
    return this.width * this.height;
  }
}

class Square implements Shape {
  constructor(
    private side: number
  ) {}

  getArea() {
    return this.side * this.side;
  }
}
```

## 10.4 Benefits

- Predictable inheritance.
- Correct polymorphism.
- Reduced unexpected behavior.
- More reliable abstractions.

---

# 11. Interface Segregation Principle (ISP)

## 11.1 Definition

Clients should not be forced to depend on interfaces they do not use.

In simple terms:

Prefer smaller, focused interfaces instead of large interfaces containing unrelated methods.

## 11.2 Bad Example

```typescript
interface Machine {
  print(): void;

  scan(): void;

  fax(): void;
}
```

A simple printer may only support printing.

But implementing this interface forces it to provide scan and fax methods.

## 11.3 Better Example

```typescript
interface Printer {
  print(): void;
}

interface Scanner {
  scan(): void;
}

interface Fax {
  fax(): void;
}
```

A basic printer:

```typescript
class BasicPrinter implements Printer {
  print() {
    console.log("Printing document");
  }
}
```

A multifunction printer:

```typescript
class MultiFunctionPrinter
  implements Printer, Scanner, Fax {

  print() {
    console.log("Printing");
  }

  scan() {
    console.log("Scanning");
  }

  fax() {
    console.log("Sending fax");
  }
}
```

## 11.4 Benefits

- Smaller interfaces.
- Reduced unnecessary dependencies.
- Better maintainability.
- More flexible implementations.

---

# 12. Dependency Inversion Principle (DIP)

## 12.1 Definition

High-level modules should not depend directly on low-level modules.

Both should depend on abstractions.

Abstractions should not depend on details. Details should depend on abstractions.

## 12.2 Bad Example

```typescript
class MySQLDatabase {
  save(data: string) {
    console.log("Saving to MySQL:", data);
  }
}

class UserService {
  private database = new MySQLDatabase();

  saveUser(name: string) {
    this.database.save(name);
  }
}
```

Problem:

`UserService` is directly dependent on `MySQLDatabase`.

## 12.3 Better Example

Create an abstraction:

```typescript
interface Database {
  save(data: string): void;
}
```

Implement it:

```typescript
class MySQLDatabase implements Database {
  save(data: string) {
    console.log("Saving to MySQL:", data);
  }
}
```

Another implementation:

```typescript
class MongoDatabase implements Database {
  save(data: string) {
    console.log("Saving to MongoDB:", data);
  }
}
```

High-level module:

```typescript
class UserService {
  constructor(
    private readonly database: Database
  ) {}

  saveUser(name: string) {
    this.database.save(name);
  }
}
```

Usage:

```typescript
const database = new MySQLDatabase();

const userService = new UserService(database);

userService.saveUser("John");
```

We can replace MySQL with MongoDB without changing `UserService`.

## 12.4 Benefits

- Loose coupling.
- Easier testing.
- Database independence.
- Better extensibility.

---

# 13. SOLID Principles Summary

| Principle | Main Idea | Common Problem It Prevents |
|---|---|---|
| SRP | One responsibility per class. | Classes doing unrelated work. |
| OCP | Extend behavior without unnecessary modification. | Repeatedly changing stable code. |
| LSP | Child types must preserve expected parent behavior. | Incorrect inheritance. |
| ISP | Prefer focused interfaces. | Large interfaces forcing unused methods. |
| DIP | Depend on abstractions. | High-level code tightly coupled to implementations. |

**Important:** SOLID principles are design guidelines, not rigid rules. Applying them should make code simpler, not introduce unnecessary abstractions.

---

# 14. Design Patterns Fundamentals

## 14.1 What is a Design Pattern?

A Design Pattern is a reusable solution to a commonly occurring software design problem.

A design pattern is not a complete implementation or a library.

It describes a proven approach that can be adapted to a particular problem.

Example:

Suppose an application supports multiple payment providers.

Instead of scattering provider-selection logic throughout the application, you can use the Strategy Pattern.

## 14.2 Gang of Four (GoF) Design Patterns

The Gang of Four introduced 23 well-known object-oriented design patterns.

They are divided into three categories.

| Category | Purpose | Number |
|---|---|---:|
| Creational | Object creation. | 5 |
| Structural | Object and class composition. | 7 |
| Behavioral | Object communication and behavior. | 11 |
| **Total** | | **23** |

---

# 15. Creational Design Patterns

Creational patterns focus on how objects are created.

The five patterns are:

1. Singleton.
2. Factory Method.
3. Abstract Factory.
4. Builder.
5. Prototype.

---

# 16. Singleton Pattern

## 16.1 What is Singleton?

Singleton ensures that a class has only one managed instance and provides a shared access point to that instance.

Example use cases:

- Application configuration.
- Shared connection managers.
- Logging infrastructure.
- Some centralized resource managers.

## 16.2 Implementation

```typescript
class DatabaseConnection {
  private static instance: DatabaseConnection;

  private constructor() {
    console.log("Database initialized");
  }

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance =
        new DatabaseConnection();
    }

    return DatabaseConnection.instance;
  }

  connect() {
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

## 16.3 Important Concepts

- Private constructor prevents direct construction.
- Static instance stores the managed instance.
- Static method provides access.

## 16.4 Advantages

- Centralized instance management.
- Controlled object creation.
- Shared access.

## 16.5 Disadvantages

- Hidden global state.
- Testing can become difficult.
- Can introduce tight coupling.
- Lifecycle management becomes complicated.

**Important:** In a Node.js process, a module-level singleton is usually scoped to that process or module instance. It is not automatically a singleton across multiple application servers.

---

# 17. Factory Method Pattern

## 17.1 What is Factory Method?

Factory Method delegates object creation to a method or specialized creator rather than requiring clients to instantiate concrete classes directly.

## 17.2 Example

Suppose an application supports multiple notification channels.

```typescript
interface Notification {
  send(message: string): void;
}
```

Implementations:

```typescript
class EmailNotification
  implements Notification {

  send(message: string) {
    console.log("Email:", message);
  }
}

class SMSNotification
  implements Notification {

  send(message: string) {
    console.log("SMS:", message);
  }
}
```

Factory:

```typescript
class NotificationFactory {
  static create(
    type: "EMAIL" | "SMS"
  ): Notification {

    switch (type) {
      case "EMAIL":
        return new EmailNotification();

      case "SMS":
        return new SMSNotification();
    }
  }
}
```

Usage:

```typescript
const notification =
  NotificationFactory.create("EMAIL");

notification.send("Welcome!");
```

## 17.3 Advantages

- Centralized creation logic.
- Reduces direct coupling to concrete classes.
- Simplifies adding implementations.

## 17.4 Factory Method vs Simple Factory

A Simple Factory is a commonly used object-creation helper that selects an implementation.

The formal GoF Factory Method pattern uses creator classes or methods that subclasses can override to determine which product is created.

The example above is a Simple Factory-style implementation.

---

# 18. Abstract Factory Pattern

## 18.1 What is Abstract Factory?

Abstract Factory provides an interface for creating families of related objects without specifying their concrete classes.

## 18.2 Example

Suppose an application supports two UI themes:

- Light Theme.
- Dark Theme.

Each theme provides:

- Button.
- Input.

Interfaces:

```typescript
interface Button {
  render(): void;
}

interface Input {
  render(): void;
}
```

Light implementations:

```typescript
class LightButton implements Button {
  render() {
    console.log("Light Button");
  }
}

class LightInput implements Input {
  render() {
    console.log("Light Input");
  }
}
```

Dark implementations:

```typescript
class DarkButton implements Button {
  render() {
    console.log("Dark Button");
  }
}

class DarkInput implements Input {
  render() {
    console.log("Dark Input");
  }
}
```

Factory interface:

```typescript
interface UIFactory {
  createButton(): Button;

  createInput(): Input;
}
```

Light factory:

```typescript
class LightThemeFactory implements UIFactory {
  createButton() {
    return new LightButton();
  }

  createInput() {
    return new LightInput();
  }
}
```

Dark factory:

```typescript
class DarkThemeFactory implements UIFactory {
  createButton() {
    return new DarkButton();
  }

  createInput() {
    return new DarkInput();
  }
}
```

Usage:

```typescript
function renderUI(factory: UIFactory) {
  const button = factory.createButton();

  const input = factory.createInput();

  button.render();
  input.render();
}

renderUI(new DarkThemeFactory());
```

## 18.3 Advantages

- Creates related object families.
- Maintains consistency between products.
- Hides concrete implementations.

---

# 19. Builder Pattern

## 19.1 What is Builder?

Builder Pattern constructs complex objects step by step.

It is useful when an object has many optional or configurable properties.

## 19.2 Problem Without Builder

```typescript
interface User {
  name: string;
  email: string;
  age?: number;
  address?: string;
  phone?: string;
  isActive: boolean;
}
```

Creating objects with many parameters can become difficult to read.

## 19.3 Implementation

```typescript
interface User {
  name: string;
  email: string;
  age?: number;
  address?: string;
  isActive: boolean;
}

class UserBuilder {
  private user: Partial<User> = {
    isActive: true
  };

  setName(name: string) {
    this.user.name = name;
    return this;
  }

  setEmail(email: string) {
    this.user.email = email;
    return this;
  }

  setAge(age: number) {
    this.user.age = age;
    return this;
  }

  setAddress(address: string) {
    this.user.address = address;
    return this;
  }

  build(): User {
    if (!this.user.name || !this.user.email) {
      throw new Error(
        "Name and email are required"
      );
    }

    return this.user as User;
  }
}
```

Usage:

```typescript
const user = new UserBuilder()
  .setName("John")
  .setEmail("john@example.com")
  .setAge(25)
  .setAddress("Ahmedabad")
  .build();

console.log(user);
```

## 19.4 Advantages

- Readable object creation.
- Supports optional properties.
- Separates construction from representation.
- Helps validate object creation.

---

# 20. Prototype Pattern

## 20.1 What is Prototype?

Prototype Pattern creates new objects by cloning existing objects.

It is useful when object initialization is expensive or when creating objects from configured templates.

## 20.2 Example

```typescript
interface Prototype<T> {
  clone(): T;
}

class UserProfile implements Prototype<UserProfile> {
  constructor(
    public name: string,
    public email: string,
    public preferences: {
      theme: string;
    }
  ) {}

  clone(): UserProfile {
    return new UserProfile(
      this.name,
      this.email,
      structuredClone(this.preferences)
    );
  }
}
```

Usage:

```typescript
const original = new UserProfile(
  "John",
  "john@example.com",
  {
    theme: "dark"
  }
);

const cloned = original.clone();

cloned.preferences.theme = "light";

console.log(original.preferences.theme); // dark
console.log(cloned.preferences.theme);   // light
```

## 20.3 Shallow Copy vs Deep Copy

**Shallow copy:** Copies the top-level object but nested references may remain shared.

**Deep copy:** Creates independent copies of nested data.

`structuredClone()` supports many built-in data types, but it does not clone every possible JavaScript value, such as functions.

---

# 21. Structural Design Patterns

Structural patterns explain how objects and classes can be combined into larger structures.

The seven GoF structural patterns are:

1. Adapter.
2. Bridge.
3. Composite.
4. Decorator.
5. Facade.
6. Flyweight.
7. Proxy.

---

# 22. Adapter Pattern

## 22.1 What is Adapter?

Adapter converts one interface into another interface expected by the client.

It helps incompatible systems work together.

## 22.2 Example

Suppose your application expects:

```typescript
interface PaymentGateway {
  pay(amount: number): void;
}
```

But an external provider exposes:

```typescript
class ExternalPaymentProvider {
  makePayment(amountInPaise: number) {
    console.log(
      `Payment: ${amountInPaise} paise`
    );
  }
}
```

The interfaces are different.

Create an adapter:

```typescript
class PaymentAdapter implements PaymentGateway {
  constructor(
    private provider: ExternalPaymentProvider
  ) {}

  pay(amount: number) {
    const amountInPaise = amount * 100;

    this.provider.makePayment(
      amountInPaise
    );
  }
}
```

Usage:

```typescript
const provider = new ExternalPaymentProvider();

const adapter = new PaymentAdapter(provider);

adapter.pay(100);
```

## 22.3 Real-World Use Cases

- Integrating third-party APIs.
- Connecting legacy systems.
- Integrating different payment providers.
- Converting data formats.

---

# 23. Bridge Pattern

## 23.1 What is Bridge?

Bridge separates an abstraction from its implementation so that both can evolve independently.

## 23.2 Example

Suppose an application supports multiple notification types and delivery channels.

Notification types:

- Alert.
- Reminder.

Delivery channels:

- Email.
- SMS.

Instead of creating four unrelated classes, separate both dimensions.

```typescript
interface MessageSender {
  send(message: string): void;
}

class EmailSender implements MessageSender {
  send(message: string) {
    console.log("Email:", message);
  }
}

class SMSSender implements MessageSender {
  send(message: string) {
    console.log("SMS:", message);
  }
}
```

Abstraction:

```typescript
abstract class Notification {
  constructor(
    protected sender: MessageSender
  ) {}

  abstract notify(message: string): void;
}
```

Concrete abstraction:

```typescript
class AlertNotification extends Notification {
  notify(message: string) {
    this.sender.send(
      `ALERT: ${message}`
    );
  }
}

class ReminderNotification extends Notification {
  notify(message: string) {
    this.sender.send(
      `REMINDER: ${message}`
    );
  }
}
```

Usage:

```typescript
const alert = new AlertNotification(
  new EmailSender()
);

alert.notify("Server is down");

const reminder = new ReminderNotification(
  new SMSSender()
);

reminder.notify("Meeting at 10 AM");
```

## 23.3 Advantage

You can add new notification types and delivery channels independently.

---

# 24. Composite Pattern

## 24.1 What is Composite?

Composite organizes objects into tree structures and allows individual objects and groups of objects to be treated uniformly.

## 24.2 Example

Consider a file system.

```text
Root
 |
 +---- Documents
 |        |
 |        +---- resume.pdf
 |        |
 |        +---- notes.txt
 |
 +---- Images
          |
          +---- photo.jpg
```

Implementation:

```typescript
interface FileSystemComponent {
  show(): void;
}
```

File:

```typescript
class File implements FileSystemComponent {
  constructor(
    private name: string
  ) {}

  show() {
    console.log(this.name);
  }
}
```

Folder:

```typescript
class Folder implements FileSystemComponent {
  private children: FileSystemComponent[] = [];

  constructor(
    private name: string
  ) {}

  add(component: FileSystemComponent) {
    this.children.push(component);
  }

  show() {
    console.log(this.name);

    for (const child of this.children) {
      child.show();
    }
  }
}
```

Usage:

```typescript
const root = new Folder("Root");

const documents = new Folder("Documents");

documents.add(new File("resume.pdf"));

documents.add(new File("notes.txt"));

root.add(documents);

root.add(new File("photo.jpg"));

root.show();
```

## 24.3 Use Cases

- File systems.
- UI component trees.
- Organization hierarchies.
- Menu structures.
- Nested categories.

---

# 25. Decorator Pattern

## 25.1 What is Decorator?

Decorator dynamically adds behavior to an object without changing its original class.

## 25.2 Example

Suppose we have a basic notification service.

```typescript
interface Notifier {
  send(message: string): void;
}

class EmailNotifier implements Notifier {
  send(message: string) {
    console.log("Email:", message);
  }
}
```

Create a decorator:

```typescript
class SMSDecorator implements Notifier {
  constructor(
    private notifier: Notifier
  ) {}

  send(message: string) {
    this.notifier.send(message);

    console.log("SMS:", message);
  }
}
```

Another decorator:

```typescript
class LoggingDecorator implements Notifier {
  constructor(
    private notifier: Notifier
  ) {}

  send(message: string) {
    console.log("Logging notification");

    this.notifier.send(message);
  }
}
```

Usage:

```typescript
const notifier = new LoggingDecorator(
  new SMSDecorator(
    new EmailNotifier()
  )
);

notifier.send("Order confirmed");
```

Now the same notification object can gain additional behavior through composition.

## 25.3 Use Cases

- Logging.
- Caching.
- Authorization.
- Compression.
- Monitoring.
- Request processing.

**Important:** The GoF Decorator Pattern is different from TypeScript/JavaScript decorator syntax (`@decorator`). Both use the word decorator, but they are not the same mechanism.

---

# 26. Facade Pattern

## 26.1 What is Facade?

Facade provides a simplified interface to a complex subsystem.

## 26.2 Example

Suppose checkout requires:

- Inventory validation.
- Payment processing.
- Order creation.
- Notification.

Without a facade, a client may need to coordinate every service.

Facade:

```typescript
class InventoryService {
  reserve() {
    console.log("Inventory reserved");
  }
}

class PaymentService {
  pay() {
    console.log("Payment completed");
  }
}

class OrderService {
  create() {
    console.log("Order created");
  }
}

class NotificationService {
  send() {
    console.log("Notification sent");
  }
}
```

Checkout facade:

```typescript
class CheckoutFacade {
  constructor(
    private inventory: InventoryService,
    private payment: PaymentService,
    private order: OrderService,
    private notification: NotificationService
  ) {}

  checkout() {
    this.inventory.reserve();

    this.payment.pay();

    this.order.create();

    this.notification.send();
  }
}
```

Usage:

```typescript
const checkout = new CheckoutFacade(
  new InventoryService(),
  new PaymentService(),
  new OrderService(),
  new NotificationService()
);

checkout.checkout();
```

## 26.3 Advantages

- Simplifies complex operations.
- Hides subsystem complexity.
- Reduces client dependencies.

A facade should not replace proper transaction management. In a real checkout workflow, failures may require rollback or Saga compensation.

---

# 27. Flyweight Pattern

## 27.1 What is Flyweight?

Flyweight reduces memory usage by sharing common immutable data between many objects.

It is useful when an application creates a very large number of similar objects.

## 27.2 Example

Imagine a text editor rendering millions of characters.

Each character may share formatting information.

Instead of duplicating formatting objects, share them.

```typescript
class CharacterStyle {
  constructor(
    public font: string,
    public size: number,
    public color: string
  ) {}
}
```

Factory:

```typescript
class CharacterStyleFactory {
  private styles = new Map<
    string,
    CharacterStyle
  >();

  getStyle(
    font: string,
    size: number,
    color: string
  ) {
    const key = `${font}-${size}-${color}`;

    if (!this.styles.has(key)) {
      this.styles.set(
        key,
        new CharacterStyle(
          font,
          size,
          color
        )
      );
    }

    return this.styles.get(key)!;
  }
}
```

Usage:

```typescript
const factory = new CharacterStyleFactory();

const style1 = factory.getStyle(
  "Arial",
  14,
  "black"
);

const style2 = factory.getStyle(
  "Arial",
  14,
  "black"
);

console.log(style1 === style2); // true
```

## 27.3 Important Concept

Flyweight separates:

- Intrinsic state: Shared state.
- Extrinsic state: Context-specific state supplied externally.

---

# 28. Proxy Pattern

## 28.1 What is Proxy?

Proxy provides a substitute object that controls access to another object.

It can add behavior such as:

- Access control.
- Lazy loading.
- Caching.
- Logging.
- Remote access.

## 28.2 Example

```typescript
interface UserService {
  getUser(id: number): void;
}

class RealUserService implements UserService {
  getUser(id: number) {
    console.log("Fetching user:", id);
  }
}
```

Proxy:

```typescript
class UserServiceProxy implements UserService {
  constructor(
    private service: UserService,
    private isAuthorized: boolean
  ) {}

  getUser(id: number) {
    if (!this.isAuthorized) {
      throw new Error("Access denied");
    }

    console.log("Logging request");

    this.service.getUser(id);
  }
}
```

Usage:

```typescript
const realService = new RealUserService();

const proxy = new UserServiceProxy(
  realService,
  true
);

proxy.getUser(101);
```

## 28.3 Proxy vs Decorator

| Proxy | Decorator |
|---|---|
| Controls access to an object. | Adds responsibilities or behavior. |
| Often manages access, lifecycle or remote interaction. | Often composes additional features. |
| May hide the real object. | Usually wraps an object to enhance behavior. |

The structures can look similar, but their primary intentions differ.

---

# 29. Behavioral Design Patterns

Behavioral patterns describe communication and responsibility between objects.

The eleven GoF behavioral patterns are:

1. Chain of Responsibility.
2. Command.
3. Interpreter.
4. Iterator.
5. Mediator.
6. Memento.
7. Observer.
8. State.
9. Strategy.
10. Template Method.
11. Visitor.

---

# 30. Strategy Pattern

## 30.1 What is Strategy?

Strategy Pattern defines a family of interchangeable algorithms and allows the application to select one at runtime.

## 30.2 Example

Suppose an e-commerce application supports different discount strategies.

```typescript
interface DiscountStrategy {
  calculate(amount: number): number;
}
```

Percentage discount:

```typescript
class PercentageDiscount
  implements DiscountStrategy {

  constructor(
    private percentage: number
  ) {}

  calculate(amount: number) {
    return amount -
      amount * this.percentage / 100;
  }
}
```

Fixed discount:

```typescript
class FixedDiscount
  implements DiscountStrategy {

  constructor(
    private discount: number
  ) {}

  calculate(amount: number) {
    return Math.max(
      0,
      amount - this.discount
    );
  }
}
```

Context:

```typescript
class PricingService {
  constructor(
    private strategy: DiscountStrategy
  ) {}

  calculatePrice(amount: number) {
    return this.strategy.calculate(amount);
  }
}
```

Usage:

```typescript
const pricing = new PricingService(
  new PercentageDiscount(20)
);

console.log(pricing.calculatePrice(1000)); // 800
```

## 30.3 Advantages

- Avoids large conditional blocks.
- Supports interchangeable algorithms.
- Follows OCP.
- Improves testability.

## 30.4 Real-World Examples

- Payment strategies.
- Shipping calculations.
- Discount algorithms.
- Authentication providers.
- File compression methods.

---

# 31. Observer Pattern

## 31.1 What is Observer?

Observer defines a one-to-many dependency between objects.

When one object changes state, its registered observers are notified.

## 31.2 Example

Imagine an order notification system.

When an order is created:

- Email service receives an event.
- SMS service receives an event.
- Analytics service receives an event.

```typescript
interface Observer {
  update(message: string): void;
}
```

Concrete observers:

```typescript
class EmailObserver implements Observer {
  update(message: string) {
    console.log("Email:", message);
  }
}

class SMSObserver implements Observer {
  update(message: string) {
    console.log("SMS:", message);
  }
}
```

Subject:

```typescript
class OrderSubject {
  private observers: Observer[] = [];

  subscribe(observer: Observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer) {
    this.observers =
      this.observers.filter(
        item => item !== observer
      );
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
const order = new OrderSubject();

order.subscribe(new EmailObserver());

order.subscribe(new SMSObserver());

order.notify("Order created");
```

## 31.3 Observer vs Pub/Sub

| Observer | Pub/Sub |
|---|---|
| Subject typically maintains observer references. | Publisher and subscriber are commonly decoupled through a broker. |
| Often implemented within one process. | Can operate across processes or services. |
| Direct notification is common. | Message channels or topics are common. |

---

# 32. Command Pattern

## 32.1 What is Command?

Command Pattern encapsulates a request as an object.

It separates the object that requests an action from the object that executes it.

## 32.2 Example

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

## 32.3 Use Cases

- Undo/redo.
- Job queues.
- Task scheduling.
- Transaction commands.
- Menu actions.

---

# 33. Chain of Responsibility Pattern

## 33.1 What is Chain of Responsibility?

Chain of Responsibility passes a request through a sequence of handlers.

Each handler decides whether to process the request or pass it to the next handler.

## 33.2 Example

Consider API request validation:

```text
Request
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
Business Logic
```

Implementation:

```typescript
abstract class Handler {
  protected next?: Handler;

  setNext(handler: Handler): Handler {
    this.next = handler;

    return handler;
  }

  handle(request: string): string {
    if (this.next) {
      return this.next.handle(request);
    }

    return "Request completed";
  }
}
```

Concrete handlers:

```typescript
class AuthenticationHandler extends Handler {
  handle(request: string): string {
    console.log("Authentication checked");

    return super.handle(request);
  }
}

class ValidationHandler extends Handler {
  handle(request: string): string {
    console.log("Request validated");

    return super.handle(request);
  }
}
```

Usage:

```typescript
const authentication =
  new AuthenticationHandler();

const validation =
  new ValidationHandler();

authentication.setNext(validation);

authentication.handle("REQUEST");
```

---

# 34. State Pattern

## 34.1 What is State?

State Pattern allows an object to change its behavior when its internal state changes.

## 34.2 Example

Consider an order lifecycle.

```text
PENDING
   |
   v
CONFIRMED
   |
   v
SHIPPED
   |
   v
DELIVERED
```

Implementation:

```typescript
interface OrderState {
  next(order: Order): void;
}

class PendingState implements OrderState {
  next(order: Order) {
    console.log("Order confirmed");

    order.setState(new ConfirmedState());
  }
}

class ConfirmedState implements OrderState {
  next(order: Order) {
    console.log("Order shipped");

    order.setState(new ShippedState());
  }
}

class ShippedState implements OrderState {
  next(order: Order) {
    console.log("Order delivered");

    order.setState(new DeliveredState());
  }
}

class DeliveredState implements OrderState {
  next() {
    console.log("Order already delivered");
  }
}
```

Context:

```typescript
class Order {
  constructor(
    private state: OrderState
  ) {}

  setState(state: OrderState) {
    this.state = state;
  }

  next() {
    this.state.next(this);
  }
}
```

Usage:

```typescript
const order = new Order(new PendingState());

order.next();
order.next();
order.next();
order.next();
```

A production implementation should also validate allowed transitions and handle cancellation or failure states.

---

# 35. Template Method Pattern

## 35.1 What is Template Method?

Template Method defines the structure of an algorithm in a base class while allowing subclasses to customize particular steps.

## 35.2 Example

Suppose multiple report formats share the same generation process.

```typescript
abstract class ReportGenerator {
  generate() {
    this.fetchData();

    this.processData();

    this.exportReport();
  }

  protected fetchData() {
    console.log("Fetching data");
  }

  protected abstract processData(): void;

  protected abstract exportReport(): void;
}
```

CSV implementation:

```typescript
class CSVReportGenerator
  extends ReportGenerator {

  protected processData() {
    console.log("Processing CSV data");
  }

  protected exportReport() {
    console.log("Exporting CSV");
  }
}
```

PDF implementation:

```typescript
class PDFReportGenerator
  extends ReportGenerator {

  protected processData() {
    console.log("Processing PDF data");
  }

  protected exportReport() {
    console.log("Exporting PDF");
  }
}
```

Usage:

```typescript
new CSVReportGenerator().generate();

new PDFReportGenerator().generate();
```

---

# 36. Iterator Pattern

## 36.1 What is Iterator?

Iterator provides a standard way to access elements of a collection sequentially without exposing its internal representation.

JavaScript and TypeScript already support iteration protocols.

Example:

```typescript
class NumberCollection {
  constructor(
    private numbers: number[]
  ) {}

  [Symbol.iterator]() {
    let index = 0;

    const numbers = this.numbers;

    return {
      next() {
        if (index < numbers.length) {
          return {
            value: numbers[index++],
            done: false
          };
        }

        return {
          value: undefined,
          done: true
        };
      }
    };
  }
}
```

Usage:

```typescript
const collection = new NumberCollection([
  10,
  20,
  30
]);

for (const number of collection) {
  console.log(number);
}
```

---

# 37. Mediator Pattern

## 37.1 What is Mediator?

Mediator centralizes communication between multiple objects.

Instead of objects communicating directly with each other, they communicate through a mediator.

## 37.2 Example

Consider a chat room.

```typescript
interface ChatMediator {
  sendMessage(
    message: string,
    sender: User
  ): void;
}
```

User:

```typescript
class User {
  constructor(
    public name: string,
    private mediator: ChatMediator
  ) {}

  send(message: string) {
    this.mediator.sendMessage(
      message,
      this
    );
  }

  receive(message: string) {
    console.log(
      `${this.name} received: ${message}`
    );
  }
}
```

Mediator:

```typescript
class ChatRoom implements ChatMediator {
  private users: User[] = [];

  addUser(user: User) {
    this.users.push(user);
  }

  sendMessage(
    message: string,
    sender: User
  ) {
    for (const user of this.users) {
      if (user !== sender) {
        user.receive(message);
      }
    }
  }
}
```

Usage:

```typescript
const room = new ChatRoom();

const user1 = new User("John", room);

const user2 = new User("David", room);

room.addUser(user1);

room.addUser(user2);

user1.send("Hello everyone");
```

## 37.3 Mediator vs Observer

Mediator centralizes interactions between components.

Observer notifies registered observers when a subject changes.

---

# 38. Memento Pattern

## 38.1 What is Memento?

Memento captures an object's internal state so that it can be restored later without exposing its implementation details.

## 38.2 Example

Consider a text editor with undo functionality.

```typescript
class EditorMemento {
  constructor(
    public readonly content: string
  ) {}
}
```

Editor:

```typescript
class Editor {
  private content = "";

  write(text: string) {
    this.content = text;
  }

  save(): EditorMemento {
    return new EditorMemento(this.content);
  }

  restore(memento: EditorMemento) {
    this.content = memento.content;
  }

  getContent() {
    return this.content;
  }
}
```

Usage:

```typescript
const editor = new Editor();

editor.write("Hello");

const savedState = editor.save();

editor.write("Hello World");

console.log(editor.getContent());

editor.restore(savedState);

console.log(editor.getContent()); // Hello
```

---

# 39. Visitor Pattern

## 39.1 What is Visitor?

Visitor separates operations from the object structures on which those operations are performed.

It is useful when you need to add new operations to a relatively stable set of object types.

## 39.2 Example

Suppose an application has different shapes.

```typescript
interface Shape {
  accept(visitor: ShapeVisitor): void;
}
```

Visitor interface:

```typescript
interface ShapeVisitor {
  visitCircle(circle: Circle): void;

  visitRectangle(rectangle: Rectangle): void;
}
```

Circle:

```typescript
class Circle implements Shape {
  constructor(
    public radius: number
  ) {}

  accept(visitor: ShapeVisitor) {
    visitor.visitCircle(this);
  }
}
```

Rectangle:

```typescript
class Rectangle implements Shape {
  constructor(
    public width: number,
    public height: number
  ) {}

  accept(visitor: ShapeVisitor) {
    visitor.visitRectangle(this);
  }
}
```

Area visitor:

```typescript
class AreaVisitor implements ShapeVisitor {
  visitCircle(circle: Circle) {
    console.log(
      Math.PI * circle.radius ** 2
    );
  }

  visitRectangle(rectangle: Rectangle) {
    console.log(
      rectangle.width * rectangle.height
    );
  }
}
```

Usage:

```typescript
const visitor = new AreaVisitor();

const shapes: Shape[] = [
  new Circle(5),
  new Rectangle(10, 20)
];

for (const shape of shapes) {
  shape.accept(visitor);
}
```

---

# 40. Interpreter Pattern

## 40.1 What is Interpreter?

Interpreter defines a representation for a language's grammar and an interpreter that evaluates expressions in that language.

## 40.2 Example

A simple mathematical expression:

```typescript
interface Expression {
  interpret(): number;
}

class NumberExpression implements Expression {
  constructor(
    private value: number
  ) {}

  interpret() {
    return this.value;
  }
}

class AddExpression implements Expression {
  constructor(
    private left: Expression,
    private right: Expression
  ) {}

  interpret() {
    return (
      this.left.interpret() +
      this.right.interpret()
    );
  }
}
```

Usage:

```typescript
const expression = new AddExpression(
  new NumberExpression(10),
  new NumberExpression(20)
);

console.log(expression.interpret()); // 30
```

This is a simplified expression tree, not a complete parser.

## 40.3 Use Cases

- Domain-specific languages.
- Expression evaluation.
- Rule engines.
- Query languages.
- Mathematical expression processors.

---

# 41. All 23 GoF Design Patterns Summary

## Creational Patterns

| Pattern | Purpose | Example |
|---|---|---|
| Singleton | Manages a single shared instance. | Configuration manager. |
| Factory Method | Delegates object creation. | Notification creation. |
| Abstract Factory | Creates related object families. | UI theme components. |
| Builder | Constructs complex objects step by step. | User configuration. |
| Prototype | Creates objects by cloning. | Template-based objects. |

## Structural Patterns

| Pattern | Purpose | Example |
|---|---|---|
| Adapter | Converts one interface into another. | Payment provider integration. |
| Bridge | Separates abstraction from implementation. | Notification types and channels. |
| Composite | Organizes objects into tree structures. | File system. |
| Decorator | Adds behavior through wrapping. | Logging and caching. |
| Facade | Simplifies complex subsystems. | Checkout workflow. |
| Flyweight | Shares common object state. | Text formatting. |
| Proxy | Controls access to another object. | Authorization and lazy loading. |

## Behavioral Patterns

| Pattern | Purpose | Example |
|---|---|---|
| Chain of Responsibility | Passes requests through handlers. | Request validation. |
| Command | Encapsulates requests as objects. | Undo/redo. |
| Interpreter | Evaluates expressions. | Rule engine. |
| Iterator | Sequentially accesses collection elements. | Custom collection. |
| Mediator | Centralizes object communication. | Chat room. |
| Memento | Saves and restores object state. | Editor undo. |
| Observer | Notifies dependent objects. | Event notifications. |
| State | Changes behavior according to state. | Order lifecycle. |
| Strategy | Selects interchangeable algorithms. | Discount calculation. |
| Template Method | Defines an algorithm skeleton. | Report generation. |
| Visitor | Adds operations to object structures. | Shape calculations. |

---

# 42. Dependency Injection (DI)

## 42.1 What is Dependency Injection?

Dependency Injection is a technique in which an object receives its dependencies from an external source rather than creating them internally.

Consider:

```typescript
class UserService {
  private repository = new UserRepository();
}
```

Here, `UserService` creates its own dependency.

This introduces tight coupling.

With Dependency Injection:

```typescript
class UserService {
  constructor(
    private repository: UserRepository
  ) {}
}
```

Now the dependency is provided externally.

## 42.2 Why Use Dependency Injection?

- Loose coupling.
- Better testability.
- Easier replacement of implementations.
- Improved maintainability.
- Centralized dependency management.

## 42.3 Types of Dependency Injection

### 1. Constructor Injection

Dependencies are provided through the constructor.

```typescript
class UserService {
  constructor(
    private repository: UserRepository
  ) {}
}
```

This is commonly preferred because required dependencies are explicit.

### 2. Setter Injection

Dependencies are provided through a setter.

```typescript
class UserService {
  private repository!: UserRepository;

  setRepository(repository: UserRepository) {
    this.repository = repository;
  }
}
```

Useful for optional or configurable dependencies, but the object may temporarily be incomplete.

### 3. Property Injection

Dependencies are assigned directly to properties.

```typescript
class UserService {
  repository!: UserRepository;
}
```

This is less explicit and can make initialization and testing more difficult.

## 42.4 Constructor vs Setter vs Property Injection

| Type | Description |
|---|---|
| Constructor Injection | Dependencies are provided during construction. |
| Setter Injection | Dependencies are provided after object creation. |
| Property Injection | Dependencies are assigned directly to properties. |

---

# 43. Inversion of Control (IoC)

## 43.1 What is Inversion of Control?

Inversion of Control is a design principle in which control over object creation, configuration or execution is delegated to an external mechanism.

Normally, an object may create and manage its own dependencies.

With IoC, an external container or framework can manage them.

## 43.2 Traditional Approach

```typescript
class UserService {
  private repository = new UserRepository();
}
```

The class controls dependency creation.

## 43.3 IoC Approach

```typescript
class UserService {
  constructor(
    private repository: UserRepository
  ) {}
}

const repository = new UserRepository();

const service = new UserService(repository);
```

The dependency is supplied externally.

## 43.4 IoC vs DI

| IoC | DI |
|---|---|
| Broad design principle. | Technique for implementing IoC. |
| Transfers control to an external mechanism. | Supplies dependencies from outside an object. |
| Can be implemented in different ways. | Commonly implemented through constructors, setters or properties. |

**Important:** Dependency Injection is one form of Inversion of Control, not a synonym for every form of IoC.

---

# 44. Dependency Injection Containers

## 44.1 What is a DI Container?

A DI container manages dependency registration, resolution and sometimes object lifecycle.

Instead of manually constructing every dependency, the container creates the dependency graph.

Example:

```text
UserController
      |
      v
UserService
      |
      v
UserRepository
      |
      v
DatabaseConnection
```

A DI container can resolve this dependency chain.

## 44.2 Popular TypeScript DI Libraries

| Library | Purpose |
|---|---|
| InversifyJS | Dependency injection container. |
| TSyringe | Lightweight TypeScript DI container. |
| TypeDI | Dependency injection and service management. |
| NestJS DI | Built-in dependency injection system. |

Official resources:

- [InversifyJS Documentation](https://inversify.io/?utm_source=chatgpt.com)
- [TSyringe GitHub](https://github.com/microsoft/tsyringe?utm_source=chatgpt.com)
- [NestJS Documentation](https://docs.nestjs.com/fundamentals/custom-providers?utm_source=chatgpt.com)

## 44.3 NestJS Dependency Injection Example

```typescript
import {
  Injectable,
  Controller,
  Get
} from "@nestjs/common";

@Injectable()
class UserService {
  getUsers() {
    return [
      {
        id: 1,
        name: "John"
      }
    ];
  }
}

@Controller("users")
class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }
}
```

NestJS manages the dependency resolution.

## 44.4 Provider Lifecycles

DI containers may support different object lifecycles.

| Lifecycle | Meaning |
|---|---|
| Singleton | One instance within the relevant container scope. |
| Transient | A new instance for each resolution. |
| Request-scoped | One instance per request context. |

Exact lifecycle behavior depends on the framework and container.

---

# 45. Repository Pattern

## 45.1 What is Repository Pattern?

Repository Pattern abstracts data access behind a collection-like interface.

It separates business logic from database-specific operations.

Without Repository Pattern:

```typescript
class UserService {
  async getUser(id: number) {
    return UserModel.findByPk(id);
  }
}
```

Here, the service depends directly on Sequelize.

With Repository Pattern:

```text
UserService
     |
     v
UserRepository Interface
     |
     v
SequelizeUserRepository
     |
     v
Database
```

## 45.2 Implementation

Repository interface:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

interface UserRepository {
  findById(id: number): Promise<User | null>;

  save(user: User): Promise<User>;
}
```

Implementation:

```typescript
class MySQLUserRepository
  implements UserRepository {

  async findById(id: number) {
    // Sequelize query here.

    return null;
  }

  async save(user: User) {
    // Save through Sequelize.

    return user;
  }
}
```

Service:

```typescript
class UserService {
  constructor(
    private repository: UserRepository
  ) {}

  async getUser(id: number) {
    return this.repository.findById(id);
  }
}
```

## 45.3 Advantages

- Database abstraction.
- Easier unit testing.
- Centralized data access.
- Better separation of concerns.

## 45.4 Important Consideration

Do not automatically create repositories for every ORM model.

ORMs already provide data access abstractions. A custom repository is most valuable when it expresses meaningful domain-oriented queries or protects the application from persistence-specific details.

---

# 46. Unit of Work Pattern

## 46.1 What is Unit of Work?

Unit of Work tracks changes made during a business operation and coordinates their persistence as one logical transaction.

Example:

Suppose an order operation must:

1. Create an order.
2. Create order items.
3. Update inventory.

These changes should succeed or fail together when they are part of the same database transaction.

## 46.2 Architecture

```text
Order Service
      |
      v
Unit Of Work
      |
      +---- Order Repository
      |
      +---- Order Item Repository
      |
      +---- Inventory Repository
      |
      v
Database Transaction
```

## 46.3 TypeScript Example

```typescript
interface UnitOfWork {
  begin(): Promise<void>;

  commit(): Promise<void>;

  rollback(): Promise<void>;
}
```

Service:

```typescript
class OrderService {
  constructor(
    private unitOfWork: UnitOfWork
  ) {}

  async createOrder() {
    await this.unitOfWork.begin();

    try {
      // Create order.

      // Create order items.

      // Update inventory.

      await this.unitOfWork.commit();

    } catch (error) {
      await this.unitOfWork.rollback();

      throw error;
    }
  }
}
```

This demonstrates the pattern conceptually. A real implementation must connect the repositories to the same database transaction or transaction context.

## 46.4 Advantages

- Coordinates related persistence changes.
- Supports transactional consistency.
- Separates transaction management from business logic.

---

# 47. Service Layer Pattern

## 47.1 What is Service Layer?

Service Layer provides an interface for application operations and coordinates business workflows.

Example:

```text
Controller
    |
    v
UserService
    |
    +---- UserRepository
    |
    +---- EmailService
    |
    +---- PasswordService
```

## 47.2 Example

```typescript
class UserService {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService
  ) {}

  async registerUser(user: User) {
    const savedUser =
      await this.userRepository.save(user);

    await this.emailService.sendWelcomeEmail(
      savedUser
    );

    return savedUser;
  }
}
```

## 47.3 Responsibilities

- Coordinate business workflows.
- Validate application-level rules.
- Call repositories.
- Coordinate external services.
- Manage transaction boundaries where appropriate.

A service layer should not become a collection of unrelated operations.

---

# 48. DTO Pattern

## 48.1 What is DTO?

DTO stands for Data Transfer Object.

A DTO carries data between application boundaries.

It defines the data structure accepted or returned by an API or another application component.

## 48.2 Why Use DTOs?

Suppose the database user entity contains:

```typescript
interface UserEntity {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

Returning the entire entity may expose unnecessary internal information.

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
function toUserResponse(
  user: UserEntity
): UserResponseDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}
```

## 48.3 Request DTO

```typescript
interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}
```

Controller:

```typescript
async function createUser(
  dto: CreateUserDTO
) {
  // Validate DTO.

  // Hash password.

  // Create user.

  // Return response DTO.
}
```

## 48.4 DTO vs Entity

| DTO | Entity |
|---|---|
| Transfers data across boundaries. | Represents domain identity and behavior. |
| Usually contains only necessary fields. | May contain domain rules and state. |
| Often has no business behavior. | Can have business behavior. |
| Designed around API or application contracts. | Designed around domain requirements. |

## 48.5 Important TypeScript Concepts

`interface` and `type` can both describe DTO structures.

DTO validation is separate from TypeScript typing.

TypeScript types disappear at runtime, so validate untrusted HTTP input using runtime validation libraries such as:

- Zod.
- Valibot.
- Joi.
- class-validator.

---

# 49. Specification Pattern

## 49.1 What is Specification Pattern?

Specification Pattern encapsulates a business rule or selection criterion into a reusable object.

It can be used to evaluate whether an entity satisfies a condition.

## 49.2 Example

Suppose a customer qualifies for a discount if:

- They are active.
- Their total purchases exceed ₹10,000.

```typescript
interface Customer {
  isActive: boolean;
  totalPurchases: number;
}

interface Specification<T> {
  isSatisfiedBy(candidate: T): boolean;
}
```

Specification:

```typescript
class PremiumCustomerSpecification
  implements Specification<Customer> {

  isSatisfiedBy(customer: Customer) {
    return (
      customer.isActive &&
      customer.totalPurchases > 10000
    );
  }
}
```

Usage:

```typescript
const specification =
  new PremiumCustomerSpecification();

const customer: Customer = {
  isActive: true,
  totalPurchases: 15000
};

console.log(
  specification.isSatisfiedBy(customer)
); // true
```

## 49.3 Advantages

- Reusable business rules.
- Easier testing.
- Composable criteria.
- Clearer domain logic.

---

# 50. Domain-Driven Design (DDD)

## 50.1 What is Domain-Driven Design?

Domain-Driven Design is an approach to software development that places the business domain at the center of application design.

The main goal is to build software models that accurately represent business concepts and rules.

DDD is particularly useful for complex business applications.

Examples:

- Banking systems.
- E-commerce platforms.
- Insurance applications.
- Logistics systems.
- Healthcare administration systems.

## 50.2 What is a Domain?

A domain represents the business area or problem space that the application addresses.

Example:

For an e-commerce application:

```text
E-Commerce Domain
       |
       +---- Product Management
       |
       +---- Order Management
       |
       +---- Payment Processing
       |
       +---- Inventory Management
       |
       +---- Customer Management
```

## 50.3 What is a Subdomain?

A subdomain is a smaller functional area within a larger business domain.

Example:

```text
E-Commerce
    |
    +---- Sales
    |
    +---- Inventory
    |
    +---- Payments
    |
    +---- Shipping
```

DDD commonly classifies subdomains as:

| Type | Description |
|---|---|
| Core Subdomain | Provides the business's main competitive value. |
| Supporting Subdomain | Supports core business operations. |
| Generic Subdomain | Provides common capabilities that are not unique to the business. |

## 50.4 What is Ubiquitous Language?

Ubiquitous Language is a shared vocabulary used by developers and domain experts.

Example:

In an e-commerce application, business terms might include:

- Order.
- Payment.
- Shipment.
- Refund.
- Reservation.
- Inventory.

Developers should use these terms consistently in:

- Code.
- Documentation.
- Meetings.
- Requirements.
- Tests.

This reduces misunderstanding between technical and business teams.

---

# 51. Bounded Context

## 51.1 What is Bounded Context?

A Bounded Context defines the boundary within which a particular domain model and its terminology apply.

The same business term may mean different things in different contexts.

Example:

```text
E-Commerce Platform
        |
        +---- Sales Context
        |
        +---- Inventory Context
        |
        +---- Shipping Context
```

Consider the word `Product`.

In the Sales Context:

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}
```

In the Inventory Context:

```typescript
interface Product {
  id: string;
  sku: string;
  availableStock: number;
  warehouseId: string;
}
```

The same business concept is represented differently because the contexts have different responsibilities.

## 51.2 Why Use Bounded Contexts?

- Avoids one enormous domain model.
- Clarifies ownership.
- Reduces accidental coupling.
- Supports independent development.
- Helps define microservice boundaries.

**Important:** A Bounded Context is a domain-model boundary. It does not automatically need to be a separate microservice.

---

# 52. Entities

## 52.1 What is an Entity?

An Entity is a domain object identified by a unique identity that remains meaningful even when its attributes change.

Example:

A user has an ID.

```typescript
class User {
  constructor(
    public readonly id: string,
    private name: string,
    private email: string
  ) {}

  updateName(name: string) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}
```

Even if the user's name changes, the identity remains the same.

```text
User ID: 101

Before:
Name = John

After:
Name = David

Identity:
Still User 101
```

## 52.2 Characteristics

- Has unique identity.
- Has lifecycle.
- Can change state.
- Can enforce business rules.
- Identity is more important than attribute equality.

---

# 53. Value Objects

## 53.1 What is a Value Object?

A Value Object represents a concept defined by its attributes rather than by a unique identity.

Examples:

- Money.
- Address.
- Date Range.
- Coordinates.
- Percentage.

Two value objects with equal values can be considered equivalent.

## 53.2 Example: Money

Bad design:

```typescript
const price = 1000;
const currency = "INR";
```

The amount and currency are stored separately.

Better design:

```typescript
class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string
  ) {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error("Invalid amount");
    }
  }

  equals(other: Money) {
    return (
      this.amount === other.amount &&
      this.currency === other.currency
    );
  }
}
```

Usage:

```typescript
const price1 = new Money(1000, "INR");

const price2 = new Money(1000, "INR");

console.log(price1.equals(price2)); // true
```

## 53.3 Entity vs Value Object

| Entity | Value Object |
|---|---|
| Has unique identity. | Has no independent identity. |
| Can change over time. | Ideally immutable. |
| Identity determines equality. | Attribute values determine equality. |
| Example: User. | Example: Money. |

---

# 54. Aggregates and Aggregate Roots

## 54.1 What is an Aggregate?

An Aggregate is a cluster of related domain objects treated as one consistency boundary.

It ensures that business invariants are maintained within the aggregate.

## 54.2 What is an Aggregate Root?

An Aggregate Root is the main entity through which external objects interact with the aggregate.

Example:

```text
Order Aggregate
       |
       v
   Order Root
       |
       +---- Order Items
       |
       +---- Shipping Address
```

External code should normally modify order items through the `Order` aggregate root rather than changing them independently.

## 54.3 Example

```typescript
interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

class Order {
  private items: OrderItem[] = [];

  constructor(
    public readonly id: string
  ) {}

  addItem(item: OrderItem) {
    if (item.quantity <= 0) {
      throw new Error(
        "Quantity must be positive"
      );
    }

    this.items.push(item);
  }

  getItems() {
    return [...this.items];
  }

  getTotal() {
    return this.items.reduce(
      (total, item) =>
        total + item.quantity * item.price,
      0
    );
  }
}
```

Usage:

```typescript
const order = new Order("ORDER-101");

order.addItem({
  productId: "P101",
  quantity: 2,
  price: 500
});

console.log(order.getTotal()); // 1000
```

The order controls modifications to its items.

## 54.4 Aggregate Design Principles

- Keep aggregates reasonably small.
- Protect business invariants.
- Modify aggregates through their root.
- Avoid unnecessary cross-aggregate transactions.
- Reference other aggregates by identity where appropriate.

---

# 55. Domain Events

## 55.1 What is a Domain Event?

A Domain Event represents something important that has happened in the business domain.

Examples:

- UserRegistered.
- OrderPlaced.
- PaymentCompleted.
- InventoryReserved.
- OrderCancelled.

## 55.2 Example

```typescript
interface DomainEvent {
  occurredAt: Date;
}
```

Event:

```typescript
class OrderPlacedEvent
  implements DomainEvent {

  readonly occurredAt = new Date();

  constructor(
    public readonly orderId: string,
    public readonly customerId: string
  ) {}
}
```

Event handler:

```typescript
class OrderPlacedHandler {
  handle(event: OrderPlacedEvent) {
    console.log(
      `Order placed: ${event.orderId}`
    );
  }
}
```

Usage:

```typescript
const event = new OrderPlacedEvent(
  "ORDER-101",
  "USER-101"
);

const handler = new OrderPlacedHandler();

handler.handle(event);
```

## 55.3 Domain Event vs Integration Event

| Domain Event | Integration Event |
|---|---|
| Represents an important occurrence within a domain. | Communicates an occurrence to external systems or bounded contexts. |
| Often remains internal to the domain/application. | Designed for external consumers. |
| Can use rich internal domain types. | Usually uses stable, versioned contracts. |
| Example: OrderPlaced internally. | Example: OrderPlaced published to Kafka. |

---

# 56. Domain Services

## 56.1 What is a Domain Service?

A Domain Service contains business logic that does not naturally belong to one particular entity or value object.

Example:

Suppose money transfers involve two bank accounts.

```typescript
class BankAccount {
  constructor(
    public readonly id: string,
    private balance: number
  ) {}

  debit(amount: number) {
    if (amount > this.balance) {
      throw new Error("Insufficient balance");
    }

    this.balance -= amount;
  }

  credit(amount: number) {
    this.balance += amount;
  }

  getBalance() {
    return this.balance;
  }
}
```

Domain service:

```typescript
class MoneyTransferService {
  transfer(
    from: BankAccount,
    to: BankAccount,
    amount: number
  ) {
    if (amount <= 0) {
      throw new Error("Invalid amount");
    }

    from.debit(amount);

    to.credit(amount);
  }
}
```

The transfer operation involves two accounts, so it can be modeled as a domain service.

A production implementation would also require persistence and transaction coordination.

---

# 57. Anti-Corruption Layer

## 57.1 What is an Anti-Corruption Layer?

An Anti-Corruption Layer protects one domain model from the external model of another system.

It translates external interfaces and data structures into the application's internal language.

## 57.2 Example

Suppose your application uses an external payment provider.

External response:

```typescript
interface ExternalPaymentResponse {
  txn_ref: string;
  txn_status: string;
  txn_amt: number;
}
```

Your internal model:

```typescript
interface PaymentResult {
  transactionId: string;
  status: "SUCCESS" | "FAILED";
  amount: number;
}
```

Create an adapter:

```typescript
class PaymentTranslator {
  translate(
    response: ExternalPaymentResponse
  ): PaymentResult {

    return {
      transactionId: response.txn_ref,

      status:
        response.txn_status === "SUCCESS"
          ? "SUCCESS"
          : "FAILED",

      amount: response.txn_amt
    };
  }
}
```

Now external naming and data formats do not leak into your domain model.

## 57.3 Benefits

- Protects domain boundaries.
- Reduces external dependencies.
- Makes provider replacement easier.
- Simplifies testing.
- Prevents external models from spreading through the application.

---

# 58. Domain-Driven Design Layers

A common DDD-inspired application architecture contains these layers:

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

## 58.1 Presentation Layer

Handles external interactions.

Examples:

- Controllers.
- REST endpoints.
- GraphQL resolvers.
- User interfaces.

## 58.2 Application Layer

Coordinates use cases.

Examples:

- Create order.
- Register user.
- Process payment.
- Cancel subscription.

It orchestrates domain objects and infrastructure abstractions.

## 58.3 Domain Layer

Contains core business rules.

Examples:

- Entities.
- Value Objects.
- Aggregates.
- Domain Services.
- Domain Events.

## 58.4 Infrastructure Layer

Implements technical capabilities.

Examples:

- Database repositories.
- Email providers.
- Payment integrations.
- Message brokers.
- External APIs.

---

# 59. Clean Architecture

## 59.1 What is Clean Architecture?

Clean Architecture organizes software so that business rules remain independent of external technologies.

It is associated with Robert C. Martin.

The central principle is the Dependency Rule:

**Source code dependencies should point inward, toward higher-level business policies.**

## 59.2 Architecture Diagram

```text
       +---------------------------+
       |    Frameworks & Drivers   |
       |                           |
       | Express, MySQL, Redis     |
       |                           |
       |   +-------------------+   |
       |   | Interface Adapters|   |
       |   |                   |   |
       |   | Controllers       |   |
       |   | Presenters        |   |
       |   | Repositories      |   |
       |   |                   |   |
       |   |  +-------------+  |   |
       |   |  | Use Cases   |  |   |
       |   |  |             |  |   |
       |   |  | Application |  |   |
       |   |  | Logic       |  |   |
       |   |  |             |  |   |
       |   |  | +---------+ |  |   |
       |   |  | | Entities| |  |   |
       |   |  | |         | |  |   |
       |   |  | +---------+ |  |   |
       |   |  +-------------+  |   |
       |   +-------------------+   |
       +---------------------------+
```

## 59.3 Main Layers

### Entities

Contain core enterprise business rules.

### Use Cases

Contain application-specific business workflows.

### Interface Adapters

Convert data between external systems and internal application structures.

### Frameworks and Drivers

Contain external technologies such as:

- Express.
- MySQL.
- MongoDB.
- Redis.
- React.
- External APIs.

## 59.4 Dependency Rule

The important rule is:

```text
Outer Layers → Inner Layers
```

Inner layers should not depend on outer layers.

For example:

- Domain logic should not import Express.
- Domain entities should not depend on Sequelize.
- Use cases should not depend directly on HTTP request objects.
- Database implementations should implement interfaces required by the inner application.

---

# 60. Clean Architecture Example in TypeScript

Let's create a user registration use case.

## 60.1 Project Structure

```text
src/
│
├── domain/
│   ├── entities/
│   │   └── user.ts
│   │
│   └── repositories/
│       └── user.repository.ts
│
├── application/
│   └── use-cases/
│       └── register-user.use-case.ts
│
├── infrastructure/
│   └── repositories/
│       └── mysql-user.repository.ts
│
├── presentation/
│   └── controllers/
│       └── user.controller.ts
│
└── main.ts
```

## 60.2 Domain Entity

```typescript
export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string
  ) {}
}
```

## 60.3 Repository Abstraction

```typescript
import { User } from "../entities/user";

export interface UserRepository {
  save(user: User): Promise<void>;

  findByEmail(
    email: string
  ): Promise<User | null>;
}
```

## 60.4 Application Use Case

```typescript
import { User } from "../../domain/entities/user";

import {
  UserRepository
} from "../../domain/repositories/user.repository";

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(
    name: string,
    email: string
  ) {
    const existingUser =
      await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = new User(
      crypto.randomUUID(),
      name,
      email
    );

    await this.userRepository.save(user);

    return user;
  }
}
```

## 60.5 Infrastructure Implementation

```typescript
import { User } from "../../domain/entities/user";

import {
  UserRepository
} from "../../domain/repositories/user.repository";

export class MySQLUserRepository
  implements UserRepository {

  async save(user: User): Promise<void> {
    // Insert user into MySQL.
    console.log("Saving user:", user);
  }

  async findByEmail(
    email: string
  ): Promise<User | null> {
    // Query MySQL.
    console.log("Searching:", email);

    return null;
  }
}
```

## 60.6 Presentation Controller

```typescript
import { Request, Response } from "express";

import {
  RegisterUserUseCase
} from "../../application/use-cases/register-user.use-case";

export class UserController {
  constructor(
    private readonly registerUser:
      RegisterUserUseCase
  ) {}

  async register(
    req: Request,
    res: Response
  ) {
    try {
      const user = await this.registerUser.execute(
        req.body.name,
        req.body.email
      );

      return res.status(201).json(user);

    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong"
      });
    }
  }
}
```

## 60.7 Dependency Wiring

```typescript
const userRepository =
  new MySQLUserRepository();

const registerUser =
  new RegisterUserUseCase(userRepository);

const userController =
  new UserController(registerUser);
```

The infrastructure implementation is injected into the application use case.

The use case does not need to know whether the data is stored in MySQL, MongoDB or another database.

---

# 61. Hexagonal Architecture

## 61.1 What is Hexagonal Architecture?

Hexagonal Architecture is also called Ports and Adapters Architecture.

It was introduced by Alistair Cockburn.

Its primary goal is to isolate the application core from external technologies.

## 61.2 Architecture

```text
          External Systems
                 |
                 v
             Adapters
                 |
                 v
               Ports
                 |
                 v
          Application Core
                 |
                 v
               Ports
                 |
                 v
             Adapters
                 |
                 v
          External Systems
```

The hexagon is a conceptual representation. It does not mean there must be exactly six interfaces.

## 61.3 What are Ports?

Ports are interfaces that define how the application interacts with the outside world.

Examples:

```typescript
interface PaymentPort {
  processPayment(
    amount: number
  ): Promise<boolean>;
}
```

## 61.4 What are Adapters?

Adapters implement or connect to ports.

Example:

```typescript
class StripePaymentAdapter
  implements PaymentPort {

  async processPayment(
    amount: number
  ): Promise<boolean> {

    console.log(
      "Processing through Stripe:",
      amount
    );

    return true;
  }
}
```

## 61.5 Why Use Hexagonal Architecture?

- External technologies can be replaced.
- Business logic remains independent.
- Easier testing.
- Supports multiple interfaces.
- Reduces framework coupling.

Example:

The same application core can be accessed through:

- REST API.
- GraphQL API.
- CLI.
- Message queue consumer.

Each is a different adapter.

---

# 62. Onion Architecture

## 62.1 What is Onion Architecture?

Onion Architecture places the domain model at the center and organizes dependencies around it.

It emphasizes domain independence and separation of concerns.

## 62.2 Architecture

```text
       +-------------------------+
       |    Infrastructure       |
       |                         |
       |   +-----------------+   |
       |   | Application     |   |
       |   |                 |   |
       |   |  +-----------+  |   |
       |   |  | Domain    |  |   |
       |   |  |           |  |   |
       |   |  +-----------+  |   |
       |   +-----------------+   |
       +-------------------------+
```

## 62.3 Main Layers

### Domain Model

- Entities.
- Value Objects.
- Domain Events.
- Domain Services.
- Business Rules.

### Domain Services and Application Services

The application layer coordinates use cases and interacts with domain abstractions.

### Infrastructure

- Databases.
- External APIs.
- File systems.
- Message brokers.
- Framework integrations.

## 62.4 Important Rule

Dependencies point toward the domain core.

Infrastructure implements abstractions defined by inner layers.

---

# 63. Clean Architecture vs Hexagonal vs Onion

These architectures share similar goals.

| Feature | Clean Architecture | Hexagonal Architecture | Onion Architecture |
|---|---|---|---|
| Main focus | Independence of business rules. | Separation through ports and adapters. | Domain-centric dependency structure. |
| Core | Entities and use cases. | Application core. | Domain model. |
| External integrations | Interface adapters. | Ports and adapters. | Infrastructure implementations. |
| Dependency direction | Inward. | Toward application core. | Toward domain core. |
| Main benefit | Framework independence. | External system independence. | Domain independence. |

They are not competing technologies. They share many architectural principles and can be combined.

---

# 64. Enterprise Application Architecture

Enterprise applications typically combine several of these patterns.

Example:

```text
                    Clients
                       |
                       v
                  API Gateway
                       |
                       v
                 Presentation
                       |
                       v
                 Application
                       |
                       v
                    Domain
                       |
           +-----------+-----------+
           |           |           |
           v           v           v
       Repository   Domain      Domain
       Interface    Services    Events
           |
           v
      Infrastructure
           |
     +-----+------+------+
     |     |      |      |
     v     v      v      v
    SQL  Redis  Kafka  External APIs
```

A mature enterprise architecture may include:

- Clean Architecture.
- Domain-Driven Design.
- Dependency Injection.
- Repository Pattern.
- CQRS.
- Event-Driven Architecture.
- Microservices.
- Observability.
- Automated testing.

Not every application needs every pattern.

---

# 65. Practical Enterprise Project: E-Commerce Application

Let's combine the concepts into a realistic project.

## 65.1 Project Requirements

Build an e-commerce backend using:

- TypeScript.
- Node.js.
- Express.
- MySQL.
- Sequelize.
- Redis.
- RabbitMQ.
- JWT.
- Docker.

## 65.2 Architecture

```text
                    Client
                      |
                      v
                 Express API
                      |
                      v
                Controllers
                      |
                      v
                Application
                   Use Cases
                      |
                      v
                   Domain
                      |
           +----------+----------+
           |          |          |
           v          v          v
         Users      Products    Orders
           |          |          |
           +----------+----------+
                      |
                      v
              Repository Interfaces
                      |
                      v
                Infrastructure
                      |
       +--------------+--------------+
       |              |              |
       v              v              v
     MySQL           Redis        RabbitMQ
       |                             |
       |                             v
       |                       Background Workers
       |                             |
       +-----------------------------+
```

## 65.3 Recommended Folder Structure

```text
src/
│
├── domain/
│   ├── entities/
│   │   ├── user.entity.ts
│   │   ├── product.entity.ts
│   │   └── order.entity.ts
│   │
│   ├── value-objects/
│   │   └── money.value-object.ts
│   │
│   ├── repositories/
│   │   ├── user.repository.ts
│   │   ├── product.repository.ts
│   │   └── order.repository.ts
│   │
│   └── events/
│       └── order-placed.event.ts
│
├── application/
│   ├── use-cases/
│   │   ├── register-user.use-case.ts
│   │   ├── create-order.use-case.ts
│   │   └── cancel-order.use-case.ts
│   │
│   └── dto/
│       ├── create-user.dto.ts
│       └── create-order.dto.ts
│
├── infrastructure/
│   ├── database/
│   ├── repositories/
│   ├── cache/
│   ├── messaging/
│   └── external-services/
│
├── presentation/
│   ├── controllers/
│   ├── routes/
│   ├── middlewares/
│   └── validators/
│
├── config/
│
├── container/
│
└── main.ts
```

## 65.4 Architectural Responsibilities

| Layer | Responsibility |
|---|---|
| Domain | Business rules and domain models. |
| Application | Use-case orchestration. |
| Infrastructure | Database, cache and external integrations. |
| Presentation | HTTP requests and responses. |
| Container | Dependency registration and wiring. |
| Config | Environment and application configuration. |

## 65.5 Important Design Rules

1. Controllers should not contain complex business logic.
2. Domain entities should not depend on Express.
3. Domain logic should not depend directly on Sequelize.
4. Database access should be implemented through appropriate abstractions.
5. DTOs should control API data exposure.
6. Validate external input at runtime.
7. Use dependency injection for required dependencies.
8. Keep business rules inside the domain or appropriate application use cases.
9. Use database transactions for related database updates.
10. Use asynchronous messaging for workflows that do not require immediate synchronous completion.

---

# 66. Common Architecture and Design Mistakes

| Mistake | Why It Is a Problem | Better Approach |
|---|---|---|
| God Class | One class handles too many responsibilities. | Apply SRP and separate responsibilities. |
| Tight Coupling | Components depend directly on implementations. | Use appropriate abstractions. |
| Overengineering | Adds unnecessary complexity. | Choose the simplest architecture that meets requirements. |
| Anemic Domain Model | Domain objects contain data but almost no business behavior. | Place relevant invariants and behavior in the domain model when appropriate. |
| Fat Controllers | Controllers contain business workflows. | Move workflows into application services/use cases. |
| Repository Everywhere | Adds unnecessary abstraction over simple ORM operations. | Introduce repositories where they provide meaningful value. |
| Singleton Abuse | Creates hidden global state. | Use explicit dependency management. |
| Excessive Inheritance | Creates rigid and fragile hierarchies. | Prefer composition when appropriate. |
| Circular Dependencies | Makes modules difficult to understand and test. | Revisit boundaries and dependency direction. |
| DTO and Entity Confusion | Internal data may leak through APIs. | Use explicit mapping and validation. |
| Framework-Dependent Domain | Business rules become tied to infrastructure. | Keep domain logic independent. |
| Pattern Overuse | Makes simple code unnecessarily complex. | Apply patterns when they solve a real problem. |

---

# 67. Interview Questions and Answers

## Q1. What is Software Architecture?

Software Architecture defines the major components, relationships, boundaries and technical structure of a software system.

## Q2. What is the difference between architecture and design?

Architecture focuses on overall system structure, while design focuses on the implementation details of individual components.

## Q3. What is Layered Architecture?

Layered Architecture divides software into logical layers such as presentation, business logic and persistence.

## Q4. What is Separation of Concerns?

It is the principle of dividing software into independent sections with clearly defined responsibilities.

## Q5. What is coupling?

Coupling measures how strongly one component depends on another.

## Q6. What is cohesion?

Cohesion measures how closely related the responsibilities within a module are.

## Q7. What is the ideal relationship between coupling and cohesion?

Generally, low coupling and high cohesion are desirable.

## Q8. What is SOLID?

SOLID is a collection of five object-oriented design principles that improve maintainability and extensibility.

## Q9. Explain SRP.

A class should have one primary responsibility and one reason to change.

## Q10. Explain OCP.

Software entities should be open for extension but closed for unnecessary modification.

## Q11. Explain LSP.

Subtypes should be usable in place of their parent types without breaking expected program behavior.

## Q12. Explain ISP.

Clients should not be forced to depend on interfaces they do not use.

## Q13. Explain DIP.

High-level and low-level modules should depend on abstractions rather than directly depending on one another.

## Q14. What is a Design Pattern?

A reusable approach to a commonly occurring software design problem.

## Q15. How many Gang of Four design patterns are there?

There are 23 patterns divided into three categories.

## Q16. What is Singleton?

A pattern that manages a single shared instance within its intended scope.

## Q17. What is Factory Method?

A pattern that delegates object creation to specialized creator methods or classes.

## Q18. What is Abstract Factory?

A pattern that creates families of related objects without exposing their concrete implementations.

## Q19. What is Builder?

A pattern for constructing complex objects step by step.

## Q20. What is Prototype?

A pattern that creates new objects by cloning existing objects.

## Q21. What is Adapter?

A pattern that converts one interface into another expected interface.

## Q22. What is Bridge?

A pattern that separates an abstraction from its implementation so they can evolve independently.

## Q23. What is Composite?

A pattern that organizes objects into tree structures and treats individual objects and groups uniformly.

## Q24. What is Decorator?

A pattern that adds behavior to an object through composition without modifying its original class.

## Q25. What is Facade?

A pattern that provides a simplified interface to a complex subsystem.

## Q26. What is Flyweight?

A pattern that reduces memory usage by sharing common object state.

## Q27. What is Proxy?

A pattern that controls access to another object.

## Q28. What is Strategy?

A pattern that encapsulates interchangeable algorithms.

## Q29. What is Observer?

A pattern that notifies dependent objects when a subject changes.

## Q30. What is Command?

A pattern that encapsulates a request as an object.

## Q31. What is State?

A pattern that changes object behavior according to its internal state.

## Q32. What is Chain of Responsibility?

A pattern that passes requests through a sequence of handlers.

## Q33. What is Dependency Injection?

A technique in which dependencies are provided externally rather than created internally.

## Q34. What is Inversion of Control?

A principle in which control over object creation or execution is delegated to an external mechanism.

## Q35. What is the difference between DI and IoC?

IoC is the broader principle; DI is one technique for implementing it.

## Q36. What is Repository Pattern?

A pattern that abstracts data access behind a domain-oriented interface.

## Q37. What is Unit of Work?

A pattern that coordinates multiple persistence operations as one logical transaction.

## Q38. What is DTO?

DTO is an object used to transfer data across application boundaries.

## Q39. What is Domain-Driven Design?

DDD is an approach that organizes software around business domains and their models.

## Q40. What is Ubiquitous Language?

A shared vocabulary used by business experts and developers.

## Q41. What is a Bounded Context?

A boundary within which a particular domain model and its terminology apply.

## Q42. What is an Entity?

An object identified by a unique identity that persists through changes to its attributes.

## Q43. What is a Value Object?

An object defined by its attributes rather than by a unique identity.

## Q44. What is an Aggregate?

A cluster of related domain objects treated as one consistency boundary.

## Q45. What is an Aggregate Root?

The primary entity through which an aggregate is accessed and modified.

## Q46. What is a Domain Event?

A representation of an important occurrence in the business domain.

## Q47. What is an Anti-Corruption Layer?

A translation layer that protects an internal domain model from external system models.

## Q48. What is Clean Architecture?

An architectural approach that keeps business rules independent of external frameworks and infrastructure.

## Q49. What is Hexagonal Architecture?

An architecture that isolates the application core using ports and adapters.

## Q50. What is Onion Architecture?

An architecture that places the domain model at the center and directs dependencies inward.

---

# 68. Practical Exercises

Complete these exercises in order.

## Beginner Level

### Exercise 1: Apply SRP

Take a user management class containing:

- User registration.
- Email sending.
- Password hashing.
- Database operations.
- Token generation.

Refactor it into separate responsibilities.

### Exercise 2: Apply OCP

Create a payment system supporting:

- UPI.
- Credit Card.
- PayPal.
- Bank Transfer.

Add new payment methods without repeatedly modifying the payment processing service.

### Exercise 3: Implement Factory Pattern

Build a notification factory supporting:

- Email.
- SMS.
- Push notifications.

### Exercise 4: Implement Builder Pattern

Create a `ProductBuilder` supporting:

- Name.
- Price.
- Description.
- Category.
- SKU.
- Images.

Ensure required fields are validated.

## Intermediate Level

### Exercise 5: Implement Strategy Pattern

Build a shipping cost calculator supporting:

- Standard Shipping.
- Express Shipping.
- Same-Day Shipping.

### Exercise 6: Implement Observer Pattern

Build an order notification system that notifies:

- Email service.
- SMS service.
- Analytics service.

### Exercise 7: Implement Repository Pattern

Create a user repository with implementations for:

- MySQL.
- MongoDB.
- In-memory testing.

### Exercise 8: Implement Dependency Injection

Create a Node.js application where:

- Controllers receive services.
- Services receive repositories.
- Repositories receive database connections.

Avoid directly constructing dependencies inside business classes.

## Advanced Level

### Exercise 9: Build a Clean Architecture Application

Build a user management API using:

- TypeScript.
- Express.
- MySQL.
- Sequelize.
- Zod.

Include:

- Domain entities.
- Repository interfaces.
- Use cases.
- Infrastructure implementations.
- Controllers.
- Dependency wiring.

### Exercise 10: Implement DDD

Design an e-commerce domain containing:

- Product.
- Order.
- Customer.
- Payment.
- Inventory.

Identify:

- Entities.
- Value Objects.
- Aggregates.
- Aggregate Roots.
- Domain Events.

### Exercise 11: Implement Hexagonal Architecture

Build a payment application with:

- REST API adapter.
- CLI adapter.
- Payment application core.
- Payment provider port.
- Stripe-like payment adapter.
- Mock payment adapter.

The application core should work without depending on Express or the payment provider SDK.

## Expert Level

### Exercise 12: Design an Enterprise E-Commerce Backend

Use:

- Clean Architecture.
- DDD.
- SOLID.
- Dependency Injection.
- Repository Pattern.
- Unit of Work.
- Domain Events.
- Redis.
- RabbitMQ.

### Exercise 13: Implement CQRS with DDD

Create separate commands and queries for order management.

Examples:

Commands:

- CreateOrder.
- CancelOrder.
- ConfirmOrder.

Queries:

- GetOrder.
- GetCustomerOrders.
- GetOrderHistory.

### Exercise 14: Implement an Anti-Corruption Layer

Integrate a third-party payment API whose request and response structures differ from your internal domain model.

Build adapters and mapping functions to isolate the external provider.

---

# 69. Phase 68 Completion Checklist

| No. | Topic | Status |
|---|---|---|
| 1 | Software Architecture Fundamentals | ☐ |
| 2 | Architectural Styles | ☐ |
| 3 | Layered Architecture | ☐ |
| 4 | Separation of Concerns | ☐ |
| 5 | Coupling and Cohesion | ☐ |
| 6 | SOLID Principles | ☐ |
| 7 | Single Responsibility Principle | ☐ |
| 8 | Open/Closed Principle | ☐ |
| 9 | Liskov Substitution Principle | ☐ |
| 10 | Interface Segregation Principle | ☐ |
| 11 | Dependency Inversion Principle | ☐ |
| 12 | Design Pattern Fundamentals | ☐ |
| 13 | Singleton Pattern | ☐ |
| 14 | Factory Method Pattern | ☐ |
| 15 | Abstract Factory Pattern | ☐ |
| 16 | Builder Pattern | ☐ |
| 17 | Prototype Pattern | ☐ |
| 18 | Adapter Pattern | ☐ |
| 19 | Bridge Pattern | ☐ |
| 20 | Composite Pattern | ☐ |
| 21 | Decorator Pattern | ☐ |
| 22 | Facade Pattern | ☐ |
| 23 | Flyweight Pattern | ☐ |
| 24 | Proxy Pattern | ☐ |
| 25 | Strategy Pattern | ☐ |
| 26 | Observer Pattern | ☐ |
| 27 | Command Pattern | ☐ |
| 28 | Chain of Responsibility | ☐ |
| 29 | State Pattern | ☐ |
| 30 | Template Method Pattern | ☐ |
| 31 | Iterator Pattern | ☐ |
| 32 | Mediator Pattern | ☐ |
| 33 | Memento Pattern | ☐ |
| 34 | Visitor Pattern | ☐ |
| 35 | Interpreter Pattern | ☐ |
| 36 | Dependency Injection | ☐ |
| 37 | Inversion of Control | ☐ |
| 38 | DI Containers | ☐ |
| 39 | Repository Pattern | ☐ |
| 40 | Unit of Work Pattern | ☐ |
| 41 | Service Layer Pattern | ☐ |
| 42 | DTO Pattern | ☐ |
| 43 | Specification Pattern | ☐ |
| 44 | Domain-Driven Design | ☐ |
| 45 | Ubiquitous Language | ☐ |
| 46 | Bounded Context | ☐ |
| 47 | Entities | ☐ |
| 48 | Value Objects | ☐ |
| 49 | Aggregates | ☐ |
| 50 | Aggregate Roots | ☐ |
| 51 | Domain Events | ☐ |
| 52 | Domain Services | ☐ |
| 53 | Anti-Corruption Layer | ☐ |
| 54 | Clean Architecture | ☐ |
| 55 | Hexagonal Architecture | ☐ |
| 56 | Onion Architecture | ☐ |
| 57 | Enterprise Application Architecture | ☐ |

---

# 70. What Comes Next?

## Phase 69: Advanced TypeScript – Advanced TypeScript Language Engineering, Type-Level Programming, Generics Mastery, Conditional Types, Mapped Types, Template Literal Types, Recursive Types, Type Inference and Compiler Internals

Upcoming topics:

1. Advanced TypeScript Type System.
2. Type-Level Programming.
3. Advanced Generics.
4. Generic Constraints.
5. Generic Defaults.
6. Generic Inference.
7. Variance and Type Relationships.
8. Covariance.
9. Contravariance.
10. Invariance.
11. Conditional Types.
12. Distributive Conditional Types.
13. Infer Keyword.
14. Mapped Types.
15. Key Remapping.
16. Template Literal Types.
17. Recursive Types.
18. Recursive Conditional Types.
19. Advanced Utility Types.
20. Custom Utility Types.
21. Type Guards.
22. Assertion Functions.
23. User-Defined Type Predicates.
24. Discriminated Unions.
25. Exhaustive Type Checking.
26. Advanced Function Types.
27. Overloads.
28. Variadic Tuple Types.
29. Advanced Tuple Types.
30. Indexed Access Types.
31. Lookup Types.
32. `keyof` and `typeof`.
33. `satisfies` Operator.
34. `const` Type Parameters.
35. Declaration Merging.
36. Module Augmentation.
37. Declaration Files.
38. Ambient Declarations.
39. TypeScript Compiler Architecture.
40. Type Checking Internals.
41. Structural Typing.
42. Nominal Typing Techniques.
43. Branded Types.
44. Advanced Type Inference.
45. Type Performance Optimization.
46. Compiler Configuration Internals.
47. Strict Type Checking.
48. Advanced TypeScript Design Patterns.
49. Type-Safe API Design.
50. Enterprise TypeScript Type Architecture.

**To continue, say: `OK, Continue to Phase 69`.**