# Phase 29: Advanced TypeScript Architecture – Hexagonal Architecture, CQRS, Event-Driven Architecture, and Domain-Driven Design

**Level:** Advanced  
**Category:** Software Architecture & Backend Engineering  
**Prerequisites:** TypeScript, OOP, SOLID principles, design patterns, dependency injection, repository pattern, and layered architecture.

## Learning Objectives

By the end of this phase, you will understand:

1. What Hexagonal Architecture is.
2. What Ports and Adapters mean.
3. How Domain-Driven Design (DDD) works.
4. Entities, Value Objects, Aggregates, and Domain Services.
5. Domain Events and Application Services.
6. What CQRS is and how it works.
7. Command Handlers and Query Handlers.
8. Event-Driven Architecture.
9. Eventual Consistency.
10. Event Sourcing fundamentals.
11. Differences between CRUD, CQRS, DDD, and Event-Driven Architecture.
12. How to implement these concepts using TypeScript and Node.js.

---

# PART 1: HEXAGONAL ARCHITECTURE

## 1. What Is Hexagonal Architecture?

Hexagonal Architecture is a software architecture pattern introduced by Alistair Cockburn.

It is also known as:

**Ports and Adapters Architecture.**

The main goal is to keep business logic independent of external technologies such as:

- Databases.
- REST APIs.
- GraphQL APIs.
- Message queues.
- Third-party services.
- User interfaces.
- Frameworks.

In traditional applications, business logic often becomes tightly coupled with databases and frameworks.

Hexagonal Architecture solves this problem by placing the application's core logic at the center and allowing external systems to communicate with it through defined interfaces.

### Traditional Architecture

Consider a typical Node.js application:

```text
Client
  |
  v
Express Controller
  |
  v
Business Logic
  |
  v
MongoDB
```

Suppose your business logic directly uses Mongoose:

```typescript
import { UserModel } from "./models/User";

class UserService {
  async getUser(id: string) {
    return UserModel.findById(id);
  }
}
```

Here, `UserService` directly depends on Mongoose and MongoDB-specific functionality.

If you switch to PostgreSQL, you may need to modify your business logic.

This creates tight coupling.

### Hexagonal Architecture

In Hexagonal Architecture, business logic does not directly depend on external technologies.

Instead, it communicates through interfaces called Ports.

```text
              External World

       REST API       Message Queue
           |               |
           v               v
      API Adapter     Queue Adapter
           |               |
           v               v
      ---------------------------
      |                         |
      |     Application Core    |
      |                         |
      |     Business Logic      |
      |                         |
      ---------------------------
                  |
                  v
             Repository Port
                  |
                  v
            Database Adapter
                  |
                  v
                MongoDB
```

The diagram is conceptual. A hexagon represents the application core, and its sides represent different interaction points.

### Main Principle

**The application core should not depend on external infrastructure.**

External systems should adapt to the application's interfaces.

---

## 2. What Are Ports?

A Port is an interface that defines how the application communicates with something outside itself.

In TypeScript, Ports are commonly represented using interfaces or abstract classes.

There are two major categories:

1. Primary Ports.
2. Secondary Ports.

### A. Primary Ports

Primary Ports define operations that the outside world can request from the application.

They are also called:

- Driving Ports.
- Inbound Ports.

Example:

```typescript
interface CreateUserUseCase {
  execute(input: CreateUserInput): Promise<User>;
}
```

This interface defines what the application allows external systems to do.

An HTTP controller can call this interface.

A message consumer can also call it.

### B. Secondary Ports

Secondary Ports define services that the application needs from the outside world.

They are also called:

- Driven Ports.
- Outbound Ports.

Example:

```typescript
interface UserRepository {
  save(user: User): Promise<void>;

  findById(id: string): Promise<User | null>;
}
```

The application needs a repository to save and retrieve users.

However, it does not need to know whether the repository uses MongoDB, MySQL, PostgreSQL, or an in-memory database.

### Primary vs Secondary Ports

| Primary Ports | Secondary Ports |
|---|---|
| Define operations provided by the application. | Define dependencies required by the application. |
| Represent inbound interactions. | Represent outbound interactions. |
| Called by external actors. | Implemented by external adapters. |
| Example: CreateUserUseCase. | Example: UserRepository. |

---

## 3. What Are Adapters?

An Adapter connects an external technology to a Port.

It translates between an external system's interface and the application's interface.

There are two major categories.

### A. Primary Adapters

Primary Adapters communicate with the application.

Examples:

- Express controllers.
- REST API controllers.
- GraphQL resolvers.
- CLI commands.
- Message consumers.
- WebSocket handlers.

Example:

```typescript
class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase
  ) {}

  async create(req: any, res: any): Promise<void> {
    const user = await this.createUserUseCase.execute({
      name: req.body.name,
      email: req.body.email
    });

    res.status(201).json(user);
  }
}
```

The controller does not implement the business logic.

It translates an HTTP request into an application use-case call.

### B. Secondary Adapters

Secondary Adapters implement the interfaces required by the application.

Examples:

- MongoDB repository.
- MySQL repository.
- Redis cache.
- SMTP email service.
- Payment gateway integration.
- External API client.

Example:

```typescript
class MongoUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    console.log("Saving user to MongoDB", user);
  }

  async findById(id: string): Promise<User | null> {
    console.log("Fetching user from MongoDB", id);

    return null;
  }
}
```

This class implements the `UserRepository` Port.

The application can use it without knowing the details of MongoDB.

### Ports vs Adapters

| Ports | Adapters |
|---|---|
| Define contracts. | Implement or connect to contracts. |
| Usually interfaces or abstract classes. | Usually concrete classes or functions. |
| Describe what is required or exposed. | Describe how the connection works. |
| Example: UserRepository. | Example: MongoUserRepository. |

---

## 4. Primary and Secondary Flow

Let's understand the complete request flow.

Suppose a client wants to register a user.

```text
                 HTTP Request
                      |
                      v
              Express Controller
                (Primary Adapter)
                      |
                      v
              CreateUserUseCase
                (Primary Port)
                      |
                      v
               Application Service
                      |
                      v
               UserRepository
               (Secondary Port)
                      |
                      v
             MongoUserRepository
              (Secondary Adapter)
                      |
                      v
                   MongoDB
```

### What Happens?

1. Client sends an HTTP request.
2. Express controller receives the request.
3. Controller calls the application use case.
4. Application service validates business requirements.
5. Application service calls the repository interface.
6. MongoDB adapter implements the repository operation.
7. Data is stored in MongoDB.
8. The result returns to the client.

Notice that the application service does not directly import MongoDB.

This is the main advantage of Hexagonal Architecture.

---

## 5. Implementing Hexagonal Architecture Using TypeScript

Let's create a small user registration example.

### Step 1: Create Domain Entity

```typescript
class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string
  ) {
    if (!name.trim()) {
      throw new Error("Name is required");
    }

    if (!email.includes("@")) {
      throw new Error("Invalid email");
    }
  }
}
```

This class represents a user in the domain.

It contains basic domain validation.

### Step 2: Create Secondary Port

```typescript
interface UserRepository {
  save(user: User): Promise<void>;

  findByEmail(email: string): Promise<User | null>;
}
```

This interface defines the repository operations required by the application.

### Step 3: Create Input DTO

```typescript
interface CreateUserInput {
  name: string;
  email: string;
}
```

DTO stands for **Data Transfer Object**.

It defines the data transferred into a use case.

### Step 4: Create Primary Port

```typescript
interface CreateUserUseCase {
  execute(input: CreateUserInput): Promise<User>;
}
```

This interface defines the user registration operation.

### Step 5: Implement Application Service

```typescript
class CreateUserService implements CreateUserUseCase {
  constructor(
    private userRepository: UserRepository
  ) {}

  async execute(input: CreateUserInput): Promise<User> {
    const existingUser =
      await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = new User(
      crypto.randomUUID(),
      input.name,
      input.email
    );

    await this.userRepository.save(user);

    return user;
  }
}
```

Notice:

```typescript
private userRepository: UserRepository
```

The application service depends on an interface, not a MongoDB implementation.

### Step 6: Create MongoDB Adapter

For simplicity, this example simulates database operations.

```typescript
class MongoUserRepository implements UserRepository {
  private users: User[] = [];

  async save(user: User): Promise<void> {
    this.users.push(user);

    console.log("User saved to MongoDB");
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(
      user => user.email === email
    ) ?? null;
  }
}
```

In a real application, this class would use Mongoose or the MongoDB driver.

### Step 7: Configure Dependencies

```typescript
const userRepository = new MongoUserRepository();

const createUserService = new CreateUserService(
  userRepository
);
```

This is called the **Composition Root**.

It is where the application connects its implementations to their dependencies.

### Step 8: Execute the Use Case

```typescript
async function main() {
  const user = await createUserService.execute({
    name: "Riyaz",
    email: "riyaz@example.com"
  });

  console.log(user);
}

main();
```

### Important Architectural Observation

If you replace MongoDB with MySQL, you only need another implementation:

```typescript
class MySQLUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    console.log("Saving user to MySQL");
  }

  async findByEmail(email: string): Promise<User | null> {
    console.log("Searching user in MySQL");

    return null;
  }
}
```

Then change the dependency configuration:

```typescript
const userRepository = new MySQLUserRepository();

const createUserService = new CreateUserService(
  userRepository
);
```

The business logic remains unchanged.

**That is the power of Ports and Adapters Architecture.**

---

# PART 2: DOMAIN-DRIVEN DESIGN (DDD)

## 6. What Is Domain-Driven Design?

Domain-Driven Design (DDD) is a software development approach introduced by Eric Evans.

It focuses on designing software around the business domain and its rules.

A Domain is the business area that your application is designed to solve problems for.

Examples:

| Application | Domain |
|---|---|
| Banking application | Banking |
| E-commerce application | Commerce |
| Hospital management system | Healthcare |
| School management system | Education |
| Expense tracker | Personal finance |

### Why Do We Need DDD?

Consider an e-commerce application.

You have different business rules:

- A customer cannot purchase an unavailable product.
- An order cannot be shipped before confirmation.
- A refunded payment cannot be refunded again.
- An order total must be calculated correctly.
- Discounts must follow specific conditions.

If all these rules are placed inside controllers or database models, the application becomes difficult to maintain.

DDD encourages you to represent important business concepts and rules explicitly.

### Main DDD Building Blocks

1. Entities.
2. Value Objects.
3. Aggregates.
4. Aggregate Roots.
5. Repositories.
6. Domain Services.
7. Application Services.
8. Domain Events.
9. Bounded Contexts.
10. Ubiquitous Language.

Let's understand them.

---

## 7. What Is an Entity?

An Entity is an object that has a unique identity.

Its identity remains the same even when its properties change.

### Example: User

```typescript
class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string
  ) {}

  changeName(name: string): void {
    this.name = name;
  }
}
```

Suppose:

```typescript
const user = new User(
  "user-101",
  "Riyaz",
  "riyaz@example.com"
);
```

Later, the user changes their name:

```typescript
user.changeName("Riyaz Khan");
```

The name changes, but the identity remains:

```text
user-101
```

Therefore, it is still the same Entity.

### Entity Characteristics

- Has a unique identity.
- Can have mutable properties.
- Represents an important domain concept.
- Often contains business behavior.

### Real-World Examples

- User.
- Customer.
- Order.
- Product.
- Employee.
- Invoice.

---

## 8. What Is a Value Object?

A Value Object represents something defined by its values rather than its identity.

Two Value Objects are considered equal when their relevant values are equal.

### Example: Money

Suppose you have:

```typescript
const money1 = {
  amount: 100,
  currency: "INR"
};

const money2 = {
  amount: 100,
  currency: "INR"
};
```

Both represent the same monetary value.

Their identity is not important.

### Implementation

```typescript
class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string
  ) {
    if (amount < 0) {
      throw new Error("Amount cannot be negative");
    }

    if (!currency.trim()) {
      throw new Error("Currency is required");
    }

    Object.freeze(this);
  }

  equals(other: Money): boolean {
    return (
      this.amount === other.amount &&
      this.currency === other.currency
    );
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
const money1 = new Money(100, "INR");

const money2 = new Money(200, "INR");

const total = money1.add(money2);

console.log(total);
```

Output:

```text
Money {
  amount: 300,
  currency: 'INR'
}
```

### Important Characteristics

- Usually immutable.
- No independent identity.
- Equality is based on values.
- Contains validation and domain-specific operations.

`Object.freeze()` is shallow, so nested objects would require additional care.

### Entity vs Value Object

| Entity | Value Object |
|---|---|
| Has unique identity. | Has no independent identity. |
| Identity matters. | Values matter. |
| May be mutable. | Usually immutable. |
| Example: User. | Example: Money. |
| Two users with different IDs are different entities. | Two Money objects with equal amount and currency represent equal values. |

---

## 9. What Is an Aggregate?

An Aggregate is a group of related domain objects that are treated as one consistency boundary.

It ensures that business rules are maintained when objects are modified.

### Real-World Example: Order

An order may contain:

- Order details.
- Order items.
- Total amount.
- Order status.

Instead of allowing external code to modify every part independently, the Aggregate controls changes.

### Conceptual Structure

```text
              Order Aggregate
                     |
                     v
                Order (Root)
                     |
          -----------------------
          |                     |
          v                     v
      OrderItem              OrderItem
          |                     |
          v                     v
        Product               Product
```

The Order controls the changes that must remain consistent within its boundary.

### Why Do We Need Aggregates?

Suppose an order contains multiple items.

You should not allow external code to modify the order total independently of the order items.

Otherwise, you could end up with:

```text
Order Items Total: ₹5,000

Stored Order Total: ₹3,000
```

This violates a business invariant.

An Aggregate helps maintain such invariants.

---

## 10. What Is an Aggregate Root?

An Aggregate Root is the main Entity through which external code accesses and modifies an Aggregate.

In our example:

**Order is the Aggregate Root.**

External code should use the Order's methods to modify its items.

### Implementation

First, create an OrderItem:

```typescript
class OrderItem {
  constructor(
    public readonly productId: string,
    public readonly price: Money,
    public readonly quantity: number
  ) {
    if (quantity <= 0) {
      throw new Error("Quantity must be positive");
    }
  }

  getTotal(): Money {
    return new Money(
      this.price.amount * this.quantity,
      this.price.currency
    );
  }
}
```

Now create the Order Aggregate Root:

```typescript
type OrderStatus =
  | "pending"
  | "confirmed"
  | "cancelled";

class Order {
  private items: OrderItem[] = [];

  private status: OrderStatus = "pending";

  constructor(
    public readonly id: string
  ) {}

  addItem(item: OrderItem): void {
    if (this.status !== "pending") {
      throw new Error(
        "Items can only be added to pending orders"
      );
    }

    this.items.push(item);
  }

  getTotal(): Money {
    if (this.items.length === 0) {
      return new Money(0, "INR");
    }

    return this.items
      .map(item => item.getTotal())
      .reduce((total, item) => total.add(item));
  }

  confirm(): void {
    if (this.status !== "pending") {
      throw new Error("Order cannot be confirmed");
    }

    if (this.items.length === 0) {
      throw new Error("Cannot confirm an empty order");
    }

    this.status = "confirmed";
  }

  getStatus(): OrderStatus {
    return this.status;
  }
}
```

Usage:

```typescript
const order = new Order("order-101");

order.addItem(
  new OrderItem(
    "product-1",
    new Money(500, "INR"),
    2
  )
);

console.log(order.getTotal());

order.confirm();

console.log(order.getStatus());
```

### Important Rules

- External code should interact with the Aggregate through its Root.
- The Aggregate Root protects business invariants.
- A repository usually loads and saves an Aggregate Root.
- Aggregate boundaries should be designed around consistency requirements.

**Professional Note:** Not every related object belongs in one Aggregate. Large Aggregates can create performance and concurrency problems. Keep Aggregate boundaries as small as practical while preserving business invariants.

---

## 11. What Is a Repository in DDD?

A Repository provides an abstraction for retrieving and storing domain objects.

It allows domain logic to work without depending on a specific database.

Example:

```typescript
interface OrderRepository {
  save(order: Order): Promise<void>;

  findById(id: string): Promise<Order | null>;
}
```

MongoDB implementation:

```typescript
class MongoOrderRepository implements OrderRepository {
  async save(order: Order): Promise<void> {
    console.log("Saving order to MongoDB");
  }

  async findById(id: string): Promise<Order | null> {
    console.log("Fetching order:", id);

    return null;
  }
}
```

### Why Use Repository?

Without a Repository:

```typescript
class OrderService {
  async createOrder() {
    // Direct database operations
  }
}
```

With a Repository:

```typescript
class OrderService {
  constructor(
    private orderRepository: OrderRepository
  ) {}

  async saveOrder(order: Order): Promise<void> {
    await this.orderRepository.save(order);
  }
}
```

The business logic depends on an abstraction rather than a database implementation.

### Important Distinction

A Repository is not necessarily a class that wraps every database query.

In DDD, a Repository typically provides collection-like access to Aggregate Roots.

---

## 12. What Is a Domain Service?

A Domain Service contains business logic that does not naturally belong to one specific Entity or Value Object.

### Example: Money Transfer

Suppose a banking application transfers money between two accounts.

The operation involves two different Account entities.

It may be appropriate to implement the transfer rule in a Domain Service.

```typescript
class Account {
  constructor(
    public readonly id: string,
    private balance: Money
  ) {}

  debit(amount: Money): void {
    if (amount.currency !== this.balance.currency) {
      throw new Error("Currency mismatch");
    }

    if (amount.amount > this.balance.amount) {
      throw new Error("Insufficient balance");
    }

    this.balance = new Money(
      this.balance.amount - amount.amount,
      this.balance.currency
    );
  }

  credit(amount: Money): void {
    if (amount.currency !== this.balance.currency) {
      throw new Error("Currency mismatch");
    }

    this.balance = this.balance.add(amount);
  }
}
```

Domain Service:

```typescript
class MoneyTransferService {
  transfer(
    from: Account,
    to: Account,
    amount: Money
  ): void {
    from.debit(amount);

    to.credit(amount);
  }
}
```

Usage:

```typescript
const account1 = new Account(
  "account-1",
  new Money(5000, "INR")
);

const account2 = new Account(
  "account-2",
  new Money(1000, "INR")
);

const transferService = new MoneyTransferService();

transferService.transfer(
  account1,
  account2,
  new Money(500, "INR")
);
```

This is a simplified domain example. A production banking transfer would also need transactional persistence, concurrency control, and reliable failure handling.

### Domain Service vs Application Service

| Domain Service | Application Service |
|---|---|
| Contains domain business rules. | Coordinates application workflows. |
| Focuses on domain behavior. | Focuses on use-case execution. |
| Should not depend on HTTP or database frameworks. | May coordinate repositories, transactions, and external services. |
| Example: MoneyTransferService. | Example: TransferMoneyUseCase. |

---

## 13. What Is an Application Service?

An Application Service coordinates a specific use case.

It generally:

1. Receives input.
2. Loads required domain objects.
3. Calls domain methods or services.
4. Saves changes.
5. Coordinates external operations when required.
6. Returns an appropriate result.

Example:

```typescript
class TransferMoneyUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private transferService: MoneyTransferService
  ) {}

  async execute(
    fromId: string,
    toId: string,
    amount: Money
  ): Promise<void> {
    const from = await this.accountRepository.findById(fromId);

    const to = await this.accountRepository.findById(toId);

    if (!from || !to) {
      throw new Error("Account not found");
    }

    this.transferService.transfer(
      from,
      to,
      amount
    );

    await this.accountRepository.save(from);

    await this.accountRepository.save(to);
  }
}
```

Here:

- Application Service coordinates the workflow.
- Domain Service contains the transfer operation.
- Account contains its own business rules.
- Repository handles persistence.

**Important:** In a real banking system, saving two accounts separately without a database transaction could result in inconsistent balances. The application must use appropriate transactional guarantees.

---

## 14. What Are Domain Events?

A Domain Event represents something important that has happened in the business domain.

Domain Events are generally named in the past tense.

Examples:

- UserRegistered.
- OrderPlaced.
- PaymentCompleted.
- ProductShipped.
- InvoiceGenerated.

### Example

Suppose a customer places an order.

After the order is successfully placed, several things may happen:

- Send confirmation email.
- Update analytics.
- Notify the warehouse.
- Generate an invoice.

Instead of directly coupling all these operations to the Order class, you can publish a Domain Event.

### Implementation

```typescript
class OrderPlacedEvent {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly occurredAt: Date
  ) {}
}
```

Create an Event Handler:

```typescript
class SendOrderConfirmationHandler {
  handle(event: OrderPlacedEvent): void {
    console.log(
      `Sending confirmation for order ${event.orderId}`
    );
  }
}
```

Another handler:

```typescript
class UpdateAnalyticsHandler {
  handle(event: OrderPlacedEvent): void {
    console.log(
      `Updating analytics for order ${event.orderId}`
    );
  }
}
```

Execute handlers:

```typescript
const event = new OrderPlacedEvent(
  "order-101",
  "customer-101",
  new Date()
);

const emailHandler = new SendOrderConfirmationHandler();

const analyticsHandler = new UpdateAnalyticsHandler();

emailHandler.handle(event);

analyticsHandler.handle(event);
```

### Domain Event vs Regular Function Call

| Regular Function Call | Domain Event |
|---|---|
| Caller directly invokes another operation. | An event announces something that happened. |
| Often creates direct dependencies. | Can decouple the producer from consumers. |
| Usually synchronous unless explicitly asynchronous. | Can be processed synchronously or asynchronously. |
| Example: `sendEmail()`. | Example: `OrderPlaced`. |

---

## 15. What Is Ubiquitous Language?

Ubiquitous Language is a shared vocabulary used by developers and business stakeholders.

The goal is to ensure that everyone understands domain concepts consistently.

### Example

Suppose you are building an e-commerce application.

Your business team uses these terms:

- Customer.
- Shopping Cart.
- Order.
- Payment.
- Refund.
- Shipment.

Your code should use the same business terminology.

Good:

```typescript
class Order {
  place(): void {}

  cancel(): void {}

  refund(): void {}
}
```

Less meaningful:

```typescript
class DataProcessor {
  executeAction1(): void {}

  executeAction2(): void {}
}
```

Using consistent terminology improves communication and reduces misunderstandings.

---

## 16. What Are Bounded Contexts?

A Bounded Context is a clearly defined boundary within which a particular domain model and its terminology apply.

This is an important DDD concept.

### Real-World Example

Consider a large e-commerce application.

It may have:

1. User Management.
2. Product Catalog.
3. Order Management.
4. Payment Management.
5. Inventory Management.
6. Shipping Management.

Each module has its own business responsibilities.

The term `Product` might mean different things in different contexts.

For example:

**Product Catalog Context**

A product contains:

- Name.
- Description.
- Images.
- Category.

**Inventory Context**

A product-related inventory record contains:

- Product ID.
- Available quantity.
- Warehouse location.
- Reserved quantity.

The two contexts may refer to the same real-world product but require different models.

### Bounded Context Structure

```text
             E-Commerce Application
                       |
       -----------------------------------
       |          |          |           |
       v          v          v           v
    Catalog     Orders     Payments   Inventory
    Context     Context     Context    Context
       |          |          |           |
       v          v          v           v
    Product     Order      Payment    Inventory
     Model      Model       Model       Model
```

### Why Is It Important?

- Prevents one giant domain model.
- Separates business responsibilities.
- Allows teams to work independently.
- Helps large applications scale.
- Supports modular monoliths and microservices.

**Important:** A Bounded Context does not automatically mean a separate microservice. Multiple contexts can exist within one modular monolith.

---

# PART 3: CQRS

## 17. What Is CQRS?

CQRS stands for:

**Command Query Responsibility Segregation.**

It is an architectural pattern that separates operations that modify data from operations that read data.

There are two main types of operations:

1. Commands.
2. Queries.

### A. Commands

A Command represents an instruction to change application state.

Examples:

- CreateUser.
- UpdateUser.
- DeleteProduct.
- PlaceOrder.
- CancelOrder.
- TransferMoney.

Commands modify data.

### B. Queries

A Query requests data without modifying application state.

Examples:

- GetUserById.
- GetAllProducts.
- GetOrderDetails.
- GetSalesReport.
- SearchProducts.

Queries retrieve data.

### Basic CQRS Architecture

```text
                 Client
                   |
                   v
                API Layer
                   |
          -------------------
          |                 |
          v                 v
       Command            Query
          |                 |
          v                 v
    Command Handler    Query Handler
          |                 |
          v                 v
      Write Model       Read Model
          |                 |
          v                 v
      Write Store       Read Store
```

### Traditional CRUD vs CQRS

Traditional CRUD applications commonly use the same model and persistence structure for both reading and writing.

CQRS separates these responsibilities.

| CRUD | CQRS |
|---|---|
| Read and write operations commonly share models. | Read and write models are separated. |
| Simpler architecture. | More architectural complexity. |
| Suitable for many applications. | Useful when read/write requirements differ significantly. |
| Usually easier to implement. | Requires more design and coordination. |

### Important

CQRS does not require:

- Microservices.
- Event Sourcing.
- Separate databases.
- Message brokers.

You can implement CQRS inside a single Node.js application using one database.

---

## 18. What Is a Command Handler?

A Command Handler processes a specific Command.

It contains the application logic required to execute that command.

### Example: Create Product

Define the command:

```typescript
interface CreateProductCommand {
  name: string;
  price: number;
}
```

Define the repository:

```typescript
interface ProductRepository {
  save(product: Product): Promise<void>;
}
```

Define the Product entity:

```typescript
class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number
  ) {
    if (price < 0) {
      throw new Error("Price cannot be negative");
    }
  }
}
```

Create the Command Handler:

```typescript
class CreateProductHandler {
  constructor(
    private productRepository: ProductRepository
  ) {}

  async execute(
    command: CreateProductCommand
  ): Promise<void> {
    const product = new Product(
      crypto.randomUUID(),
      command.name,
      command.price
    );

    await this.productRepository.save(product);
  }
}
```

Usage:

```typescript
const command: CreateProductCommand = {
  name: "Laptop",
  price: 75000
};
```

The handler receives the command and performs the write operation.

---

## 19. What Is a Query Handler?

A Query Handler processes a request to retrieve data.

Unlike a Command Handler, a Query Handler should not modify application state.

### Example: Get Product

Define Query:

```typescript
interface GetProductQuery {
  productId: string;
}
```

Define a read repository:

```typescript
interface ProductReadRepository {
  findById(id: string): Promise<ProductDTO | null>;
}
```

Define DTO:

```typescript
interface ProductDTO {
  id: string;
  name: string;
  price: number;
}
```

Create Query Handler:

```typescript
class GetProductHandler {
  constructor(
    private productRepository: ProductReadRepository
  ) {}

  async execute(
    query: GetProductQuery
  ): Promise<ProductDTO | null> {
    return this.productRepository.findById(
      query.productId
    );
  }
}
```

Usage:

```typescript
const query: GetProductQuery = {
  productId: "product-101"
};
```

### Command Handler vs Query Handler

| Command Handler | Query Handler |
|---|---|
| Processes commands. | Processes queries. |
| Changes application state. | Retrieves data. |
| May return an identifier or result. | Returns requested data. |
| Example: CreateProductHandler. | Example: GetProductHandler. |

---

## 20. What Are Read Models and Write Models?

CQRS separates the representation used for writing data from the representation used for reading data.

### Write Model

The Write Model focuses on:

- Business rules.
- Data consistency.
- Validation.
- State transitions.
- Domain behavior.

Example:

```typescript
class Product {
  constructor(
    public readonly id: string,
    public name: string,
    private price: number
  ) {}

  changePrice(newPrice: number): void {
    if (newPrice <= 0) {
      throw new Error("Invalid price");
    }

    this.price = newPrice;
  }
}
```

### Read Model

The Read Model focuses on retrieving data efficiently.

For example, a product listing page might need:

```typescript
interface ProductListDTO {
  id: string;
  name: string;
  price: number;
  categoryName: string;
  averageRating: number;
  reviewCount: number;
}
```

This structure may combine data from several tables or collections.

It is designed for reading, not necessarily for enforcing business rules.

### Why Separate Them?

Imagine a product detail page.

It needs:

- Product information.
- Category name.
- Ratings.
- Reviews.
- Stock availability.

The write model may store these concepts separately.

The read model can provide a pre-combined representation for efficient retrieval.

---

## 21. Can CQRS Use the Same Database?

Yes.

CQRS does not require separate databases.

### Option 1: Same Database

```text
             Application
                  |
          -------------------
          |                 |
          v                 v
       Commands           Queries
          |                 |
          v                 v
     Write Handler     Read Handler
          |                 |
          ---------+---------
                   |
                   v
                MongoDB
```

Both operations use the same database, but their application logic is separated.

### Option 2: Separate Read and Write Databases

```text
              Application
                   |
          --------------------
          |                  |
          v                  v
       Commands            Queries
          |                  |
          v                  v
      Write Model         Read Model
          |                  |
          v                  v
      PostgreSQL          MongoDB
```

This approach may be useful when:

- Write requirements differ from read requirements.
- Read traffic is significantly higher.
- Read queries require denormalized data.
- Different storage technologies offer different advantages.

However, it introduces synchronization complexity.

---

# PART 4: EVENT-DRIVEN ARCHITECTURE

## 22. What Is Event-Driven Architecture?

Event-Driven Architecture (EDA) is an architecture in which application components communicate by producing and consuming events.

Instead of directly calling other services for every operation, a component can publish an event.

Other components subscribe to and process that event.

### Real-World Example

Consider an e-commerce order.

When an order is placed:

```text
                Order Service
                      |
                      v
                OrderPlaced Event
                      |
                      v
                  Event Broker
                      |
         -----------------------------
         |             |             |
         v             v             v
    Payment         Inventory      Notification
    Service          Service        Service
         |             |             |
         v             v             v
    Process         Reserve         Send Email
    Payment          Stock
```

The Order Service does not need to directly manage every downstream operation.

It publishes an event.

Other services react to it.

### Main Components

| Component | Responsibility |
|---|---|
| Event Producer | Creates and publishes events. |
| Event Consumer | Receives and processes events. |
| Event Broker | Routes messages between producers and consumers. |
| Event Handler | Contains logic for processing an event. |
| Event Channel/Topic | Identifies the event stream or category. |

### Common Event Brokers

- RabbitMQ.
- Apache Kafka.
- AWS SNS.
- AWS SQS.
- Redis Streams.
- Google Cloud Pub/Sub.

---

## 23. Event Producer and Event Consumer

### Event Producer

A producer creates and publishes an event.

Example:

```typescript
interface EventPublisher {
  publish(
    eventName: string,
    payload: unknown
  ): Promise<void>;
}
```

Example producer:

```typescript
class OrderService {
  constructor(
    private eventPublisher: EventPublisher
  ) {}

  async placeOrder(orderId: string): Promise<void> {
    console.log("Order placed");

    await this.eventPublisher.publish(
      "order.placed",
      {
        orderId,
        occurredAt: new Date()
      }
    );
  }
}
```

### Event Consumer

A consumer receives and processes an event.

```typescript
interface EventConsumer {
  handle(payload: unknown): Promise<void>;
}
```

Example:

```typescript
class InventoryConsumer implements EventConsumer {
  async handle(payload: unknown): Promise<void> {
    console.log("Reserving inventory:", payload);
  }
}
```

In a production system, the broker's client library would handle subscription and message delivery.

---

## 24. Event-Driven Architecture vs Pub/Sub

These concepts are related, but they are not identical.

| Event-Driven Architecture | Pub/Sub |
|---|---|
| A broader architectural style. | A messaging communication pattern. |
| Uses events to coordinate application behavior. | Uses publishers, subscribers, and channels or topics. |
| Can use multiple communication mechanisms. | Commonly implemented using a broker. |
| Can be synchronous or asynchronous. | Often asynchronous, but implementation-dependent. |

Pub/Sub is one way to implement Event-Driven Architecture.

---

## 25. Synchronous vs Asynchronous Communication

### Synchronous Communication

The caller waits for the operation to finish.

Example:

```typescript
const user = await userService.createUser();

await emailService.sendWelcomeEmail(user.email);
```

The second operation waits for the first to complete.

### Asynchronous Event-Based Communication

The producer publishes an event.

A consumer processes it separately.

```typescript
await eventPublisher.publish("user.registered", {
  userId: "user-101",
  email: "riyaz@example.com"
});
```

A separate consumer handles the event:

```typescript
class WelcomeEmailConsumer {
  async handle(event: {
    userId: string;
    email: string;
  }): Promise<void> {
    console.log(
      "Sending welcome email to:",
      event.email
    );
  }
}
```

### Comparison

| Synchronous | Asynchronous |
|---|---|
| Caller waits for completion. | Caller may continue after publishing or queuing work. |
| Easier to reason about immediate results. | Useful for independent background tasks. |
| Can increase response time. | Can improve responsiveness. |
| Failure may directly affect caller. | Failures require retry and recovery mechanisms. |

**Important:** An `async` function in JavaScript does not automatically mean distributed asynchronous messaging. `async`/`await` handles asynchronous execution inside an application; a message broker provides communication between components or services.

---

# PART 5: EVENTUAL CONSISTENCY

## 26. What Is Eventual Consistency?

Eventual Consistency is a consistency model in which different parts of a distributed system may temporarily contain different data, but they are expected to converge if no new updates occur and processing succeeds.

### Real-World Example

Suppose a customer places an order.

The Order Service stores:

```text
Order Status: Confirmed
```

Then it publishes an event.

The Inventory Service receives that event and updates stock.

For a short period:

```text
Order Service:
Order = Confirmed

Inventory Service:
Stock = Not Yet Updated
```

After the event is processed:

```text
Order Service:
Order = Confirmed

Inventory Service:
Stock = Reserved
```

The system eventually reaches the expected state.

### Why Does Eventual Consistency Happen?

Because different services or databases update independently.

Messages may take time to:

- Travel through a broker.
- Reach consumers.
- Be processed.
- Be persisted.

### Strong Consistency vs Eventual Consistency

| Strong Consistency | Eventual Consistency |
|---|---|
| Reads reflect the latest committed write according to the system's consistency guarantees. | Reads may temporarily return stale data. |
| Often requires coordination. | Often supports greater availability and decoupling. |
| Useful for critical transactional operations. | Useful for distributed workflows and replicated read models. |
| May introduce latency. | May require handling temporary inconsistency. |

### Important

Eventual consistency does not mean data will automatically become correct.

The system needs reliable event delivery, retries, error handling, and reconciliation mechanisms.

---

## 27. What Is the Saga Pattern?

The Saga Pattern coordinates a long-running business transaction across multiple services.

Instead of relying on one distributed database transaction, a Saga divides the workflow into smaller local transactions.

Each step may have a corresponding compensating action.

### Real-World Example: Order Placement

Suppose an order requires:

1. Reserve inventory.
2. Process payment.
3. Arrange shipping.

What happens if payment fails after inventory has been reserved?

The system may need to release the inventory.

### Saga Workflow

```text
             Place Order
                  |
                  v
           Reserve Inventory
                  |
                  v
            Process Payment
                  |
             Payment Failed
                  |
                  v
          Release Inventory
                  |
                  v
            Cancel Order
```

### Forward Actions and Compensating Actions

| Forward Action | Compensating Action |
|---|---|
| Reserve inventory | Release inventory |
| Charge payment | Refund payment |
| Create shipment | Cancel shipment, if possible |
| Confirm order | Cancel order |

### Two Common Saga Approaches

**1. Choreography**

Each service publishes events and reacts to events from other services.

```text
Order Service
     |
     v
OrderPlaced
     |
     v
Inventory Service
     |
     v
InventoryReserved
     |
     v
Payment Service
```

There is no single central coordinator.

**2. Orchestration**

A central Saga orchestrator controls the workflow.

```text
           Saga Orchestrator
                   |
        -----------------------
        |          |          |
        v          v          v
    Inventory   Payment    Shipping
      Service   Service     Service
```

### When to Use Saga?

Use Saga when a business transaction spans multiple independently managed services and cannot be handled with a single local database transaction.

---

# PART 6: EVENT SOURCING

## 28. What Is Event Sourcing?

Event Sourcing is an architectural pattern in which changes to an entity's state are stored as a sequence of events instead of storing only its latest state.

Instead of updating a record and losing its previous state, the system records every meaningful change.

### Traditional Database Approach

Suppose a bank account starts with ₹5,000.

You deposit ₹2,000 and withdraw ₹1,000.

A traditional database might store:

```text
Account ID: 101
Balance: ₹6,000
```

Only the current balance is stored in this record.

### Event Sourcing Approach

Instead, store the events:

```text
AccountOpened: ₹5,000

MoneyDeposited: ₹2,000

MoneyWithdrawn: ₹1,000
```

The current balance is calculated by replaying these events.

```text
₹5,000 + ₹2,000 - ₹1,000 = ₹6,000
```

### Architecture

```text
             Command
                |
                v
          Command Handler
                |
                v
          Domain Aggregate
                |
                v
          Domain Events
                |
                v
           Event Store
                |
                v
         Event Stream
                |
                v
        Build Current State
```

### Event Store

An Event Store stores events in an append-only manner.

Example:

| Event ID | Account ID | Event Type | Amount |
|---|---|---|---:|
| 1 | 101 | AccountOpened | 5000 |
| 2 | 101 | MoneyDeposited | 2000 |
| 3 | 101 | MoneyWithdrawn | 1000 |

The application reconstructs the current state by applying these events in order.

---

## 29. Event Sourcing Implementation in TypeScript

Let's implement a simplified bank account.

### Step 1: Define Events

```typescript
type AccountEvent =
  | {
      type: "ACCOUNT_OPENED";
      balance: number;
    }
  | {
      type: "MONEY_DEPOSITED";
      amount: number;
    }
  | {
      type: "MONEY_WITHDRAWN";
      amount: number;
    };
```

### Step 2: Create Event Store

```typescript
class EventStore {
  private events: AccountEvent[] = [];

  append(event: AccountEvent): void {
    this.events.push(event);
  }

  getEvents(): AccountEvent[] {
    return [...this.events];
  }
}
```

This is an in-memory demonstration, not a production-grade event store.

### Step 3: Create Account Aggregate

```typescript
class BankAccount {
  private balance = 0;

  apply(event: AccountEvent): void {
    switch (event.type) {
      case "ACCOUNT_OPENED":
        this.balance = event.balance;
        break;

      case "MONEY_DEPOSITED":
        this.balance += event.amount;
        break;

      case "MONEY_WITHDRAWN":
        this.balance -= event.amount;
        break;
    }
  }

  getBalance(): number {
    return this.balance;
  }
}
```

### Step 4: Create Account Service

```typescript
class BankAccountService {
  constructor(
    private eventStore: EventStore
  ) {}

  openAccount(initialBalance: number): void {
    if (initialBalance < 0) {
      throw new Error("Invalid initial balance");
    }

    this.eventStore.append({
      type: "ACCOUNT_OPENED",
      balance: initialBalance
    });
  }

  deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error("Invalid deposit amount");
    }

    this.eventStore.append({
      type: "MONEY_DEPOSITED",
      amount
    });
  }

  withdraw(amount: number): void {
    if (amount <= 0) {
      throw new Error("Invalid withdrawal amount");
    }

    const currentBalance = this.getBalance();

    if (amount > currentBalance) {
      throw new Error("Insufficient balance");
    }

    this.eventStore.append({
      type: "MONEY_WITHDRAWN",
      amount
    });
  }

  getBalance(): number {
    const account = new BankAccount();

    for (const event of this.eventStore.getEvents()) {
      account.apply(event);
    }

    return account.getBalance();
  }
}
```

### Step 5: Use Event Sourcing

```typescript
const eventStore = new EventStore();

const accountService = new BankAccountService(eventStore);

accountService.openAccount(5000);

accountService.deposit(2000);

accountService.withdraw(1000);

console.log(accountService.getBalance());
```

Output:

```text
6000
```

### Important Limitations of This Example

This implementation demonstrates the basic idea, but it is not production-ready.

A production event-sourced system needs:

- Persistent event storage.
- Event ordering.
- Event versioning.
- Concurrency control.
- Idempotency.
- Event replay.
- Snapshotting for performance.
- Event schema evolution.
- Transactional event writes.

Also, the example assumes a single account and does not support multiple independent account streams.

---

## 30. What Are Snapshots in Event Sourcing?

As the number of events grows, rebuilding the current state by replaying every event becomes expensive.

A Snapshot stores the state of an Aggregate at a particular point in time.

### Without Snapshot

```text
Event 1
  |
Event 2
  |
Event 3
  |
...
  |
Event 10,000
  |
Rebuild Current State
```

### With Snapshot

```text
Events 1 - 5,000
       |
       v
   Snapshot
       |
       v
Events 5,001 - 5,100
       |
       v
Rebuild Current State
```

Instead of replaying all 5,100 events, the application loads the snapshot and replays only the events after it.

### Benefits

- Faster state reconstruction.
- Better performance for long event streams.
- Reduced event replay overhead.

### Important

A Snapshot is an optimization.

The Event Store remains the source of truth.

---

# PART 7: IMPORTANT ARCHITECTURAL COMPARISONS

## 31. CRUD vs CQRS vs Event Sourcing

These concepts solve different problems.

| Feature | CRUD | CQRS | Event Sourcing |
|---|---|---|---|
| Main focus | Basic data operations. | Separating reads and writes. | Recording state changes as events. |
| Data storage | Usually stores current state. | Can use one or multiple databases. | Stores event history. |
| Read model | Usually shares the main model. | Separate read model possible. | Often uses projections. |
| Write model | Usually straightforward. | Separate command model. | Produces events. |
| Complexity | Low. | Medium to high. | High. |
| Typical use | Standard applications. | Applications with distinct read/write requirements. | Systems requiring detailed historical reconstruction. |

### Important Relationship

CQRS and Event Sourcing are independent patterns.

You can use:

- CRUD without CQRS.
- CQRS without Event Sourcing.
- Event Sourcing without full CQRS.
- CQRS together with Event Sourcing.

They are often combined, but one does not require the other.

---

## 32. Clean Architecture vs Hexagonal Architecture

Both architectures aim to protect business logic from infrastructure dependencies.

However, they organize the system differently.

| Clean Architecture | Hexagonal Architecture |
|---|---|
| Organizes code into conceptual layers or rings. | Organizes code around the application core, Ports, and Adapters. |
| Emphasizes the Dependency Rule. | Emphasizes communication through Ports and Adapters. |
| Common layers include Entities, Use Cases, Interface Adapters, and Frameworks. | Common concepts include Primary Ports, Secondary Ports, and Adapters. |
| Business rules are kept independent of frameworks. | Application logic is kept independent of external systems. |

### Similarity

Both follow the principle:

**Dependencies should point toward the business logic, not toward external infrastructure.**

They can also be combined in one application.

---

## 33. DDD vs Clean Architecture vs Hexagonal Architecture vs CQRS

These concepts are not direct alternatives.

They solve different architectural problems.

| Concept | Primary Concern |
|---|---|
| DDD | Modeling complex business domains. |
| Clean Architecture | Organizing code and controlling dependencies. |
| Hexagonal Architecture | Separating the application core from external systems. |
| CQRS | Separating read and write responsibilities. |
| Event-Driven Architecture | Coordinating components through events. |
| Event Sourcing | Persisting state changes as events. |
| Saga | Coordinating distributed transactions. |

You can combine several of these approaches in one application.

For example:

```text
             Node.js Application
                      |
              Clean Architecture
                      |
             Hexagonal Architecture
                      |
                  DDD Model
                      |
               CQRS Use Cases
                      |
             Event-Driven Messaging
                      |
                Event Store
```

This is a conceptual combination, not a required architecture.

---

# PART 8: PRACTICAL PROJECT ARCHITECTURE

## 34. Recommended TypeScript Project Structure

Let's design a scalable backend project using:

- Node.js.
- Express.js.
- TypeScript.
- MongoDB.
- DDD.
- Hexagonal Architecture.
- CQRS.

Example:

```text
src/
│
├── modules/
│   │
│   ├── users/
│   │   │
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── User.ts
│   │   │   │
│   │   │   ├── value-objects/
│   │   │   │   └── Email.ts
│   │   │   │
│   │   │   ├── events/
│   │   │   │   └── UserRegistered.ts
│   │   │   │
│   │   │   ├── repositories/
│   │   │   │   └── UserRepository.ts
│   │   │   │
│   │   │   └── services/
│   │   │
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   │   └── CreateUserCommand.ts
│   │   │   │
│   │   │   ├── command-handlers/
│   │   │   │   └── CreateUserHandler.ts
│   │   │   │
│   │   │   ├── queries/
│   │   │   │   └── GetUserQuery.ts
│   │   │   │
│   │   │   ├── query-handlers/
│   │   │   │   └── GetUserHandler.ts
│   │   │   │
│   │   │   └── services/
│   │   │
│   │   ├── infrastructure/
│   │   │   ├── database/
│   │   │   │   └── MongoUserRepository.ts
│   │   │   │
│   │   │   └── messaging/
│   │   │
│   │   └── presentation/
│   │       ├── controllers/
│   │       │   └── UserController.ts
│   │       │
│   │       ├── routes/
│   │       │   └── user.routes.ts
│   │       │
│   │       └── validators/
│   │
│   ├── orders/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── presentation/
│   │
│   └── payments/
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       └── presentation/
│
├── shared/
│   ├── database/
│   ├── events/
│   ├── errors/
│   ├── logger/
│   └── utils/
│
├── config/
│
├── app.ts
│
└── server.ts
```

### Understanding the Folders

| Folder | Responsibility |
|---|---|
| domain | Business rules and domain models. |
| application | Use cases and application workflows. |
| infrastructure | Database, messaging, and external integrations. |
| presentation | HTTP controllers, routes, and request validation. |
| shared | Reusable cross-module infrastructure and utilities. |
| config | Environment and application configuration. |

### Important Dependency Rule

A good dependency direction is:

```text
Presentation
     |
     v
Application
     |
     v
Domain

Infrastructure ---> Application / Domain Interfaces
```

More precisely:

- Domain should not depend on Application or Infrastructure.
- Application may depend on Domain.
- Infrastructure implements interfaces defined by the inner layers.
- Presentation invokes Application use cases.
- The Composition Root wires implementations together.

---

## 35. How These Concepts Work Together in an E-Commerce Application

Let's combine the concepts.

Suppose a customer places an order.

### Step 1: Request

The client sends:

```http
POST /api/orders
```

### Step 2: Primary Adapter

The Express controller receives the request.

### Step 3: Application Command

The controller creates or forwards a `PlaceOrderCommand`.

### Step 4: Command Handler

The Command Handler coordinates the use case.

### Step 5: Domain Logic

The Order Aggregate validates:

- Items are valid.
- Quantities are positive.
- Order can be placed.
- Total amount is calculated correctly.

### Step 6: Repository

The Order Repository persists the Aggregate.

### Step 7: Domain Event

The application records or publishes:

```text
OrderPlaced
```

### Step 8: Event Consumers

Different consumers react:

- Inventory Service reserves stock.
- Notification Service sends confirmation.
- Analytics Service updates metrics.

### Step 9: Read Model

The Order Read Model is updated for efficient queries.

### Complete Flow

```text
                  Client
                    |
                    v
               Express API
                    |
                    v
              Order Controller
                    |
                    v
            PlaceOrder Command
                    |
                    v
             Command Handler
                    |
                    v
              Order Aggregate
                    |
                    v
             Order Repository
                    |
                    v
                 Database
                    |
                    v
              OrderPlaced Event
                    |
                    v
               Event Broker
                    |
          -----------------------
          |          |          |
          v          v          v
      Inventory  Notification Analytics
       Service     Service     Service
          |
          v
      Stock Update

```

This architecture separates responsibilities and makes the application easier to evolve.

---

# PART 9: COMMON ARCHITECTURAL MISTAKES

## 36. Mistakes to Avoid

| Mistake | Explanation |
|---|---|
| Overengineering | Applying DDD, CQRS, and Event Sourcing to simple CRUD applications without a real need. |
| Fat Controllers | Putting business rules directly inside HTTP controllers. |
| Database-dependent Domain | Making domain entities depend on Mongoose or Sequelize. |
| Giant Aggregates | Combining too many entities into one consistency boundary. |
| Wrong Bounded Contexts | Creating unclear or overlapping business boundaries. |
| CQRS Everywhere | Separating every simple read and write unnecessarily. |
| Event Overuse | Creating events for ordinary internal function calls. |
| No Idempotency | Processing the same event multiple times and producing duplicate effects. |
| No Retry Strategy | Losing messages after temporary processing failures. |
| Eventual Consistency Misunderstanding | Assuming all services update simultaneously. |
| Missing Compensation | Failing to recover when a multi-service workflow partially fails. |
| Uncontrolled Event Growth | Replaying huge event histories without snapshots. |
| Infrastructure Leakage | Allowing framework-specific objects to enter the domain layer. |

### Important Production Concepts

When building event-driven applications, also understand:

**Idempotency:** Processing the same message more than once should not cause unintended duplicate effects.

**Dead-Letter Queue (DLQ):** A place to store messages that repeatedly fail processing.

**Outbox Pattern:** A technique for reliably storing business changes and outgoing events together, usually in one local database transaction.

**Correlation ID:** An identifier used to trace related operations across services.

**Observability:** Monitoring logs, metrics, and traces to understand distributed application behavior.

These concepts are particularly important when implementing reliable event-driven systems.

---

# PART 10: INTERVIEW QUESTIONS AND ANSWERS

## 37. Advanced Architecture Interview Questions

### Q1. What is Hexagonal Architecture?

Hexagonal Architecture is an architectural pattern that isolates business logic from external systems through Ports and Adapters.

### Q2. What are Ports?

Ports are interfaces that define how the application communicates with external systems or exposes its capabilities.

### Q3. What are Adapters?

Adapters connect external technologies to the application's Ports.

### Q4. What is the difference between Primary and Secondary Adapters?

Primary Adapters initiate operations in the application, while Secondary Adapters implement services required by the application.

### Q5. What is Domain-Driven Design?

DDD is an approach to software development that focuses on modeling software around business concepts and rules.

### Q6. What is an Entity?

An Entity is an object with a unique identity that remains consistent throughout its lifecycle.

### Q7. What is a Value Object?

A Value Object is an object defined by its values rather than an independent identity.

### Q8. What is the difference between Entity and Value Object?

An Entity has identity, while a Value Object is defined by its values.

### Q9. What is an Aggregate?

An Aggregate is a group of related domain objects that form a consistency boundary.

### Q10. What is an Aggregate Root?

An Aggregate Root is the main Entity through which external code accesses and modifies an Aggregate.

### Q11. What is a Domain Service?

A Domain Service contains business logic that does not naturally belong to a specific Entity or Value Object.

### Q12. What is an Application Service?

An Application Service coordinates the execution of a particular application use case.

### Q13. What is a Domain Event?

A Domain Event represents an important business occurrence, such as OrderPlaced or UserRegistered.

### Q14. What is Ubiquitous Language?

It is a shared vocabulary used by developers and business stakeholders to describe the business domain consistently.

### Q15. What is a Bounded Context?

A Bounded Context defines the boundary within which a particular domain model and its terminology apply.

### Q16. What is CQRS?

CQRS is an architectural pattern that separates operations that modify data from operations that retrieve data.

### Q17. What is a Command?

A Command represents an instruction to change application state.

### Q18. What is a Query?

A Query requests information without changing application state.

### Q19. What is the difference between Command Handler and Query Handler?

A Command Handler processes state-changing operations, while a Query Handler retrieves data.

### Q20. Does CQRS require separate databases?

No. CQRS can use the same database for reads and writes.

### Q21. What is Event-Driven Architecture?

It is an architectural style in which components communicate by producing and consuming events.

### Q22. What is an Event Broker?

An Event Broker routes messages between producers and consumers.

### Q23. What is Eventual Consistency?

It is a consistency model where different parts of a distributed system may temporarily contain different data but are expected to converge.

### Q24. What is the Saga Pattern?

Saga coordinates long-running distributed transactions through multiple local transactions and compensating actions.

### Q25. What is Event Sourcing?

Event Sourcing stores state changes as a sequence of events instead of storing only the latest state.

### Q26. What is an Event Store?

An Event Store is a persistence system that stores events, usually as an append-only event stream.

### Q27. What is a Snapshot in Event Sourcing?

A Snapshot stores an Aggregate's state at a particular point to reduce the amount of event replay required.

### Q28. What is the difference between CQRS and Event Sourcing?

CQRS separates read and write responsibilities. Event Sourcing stores state changes as events.

### Q29. Can CQRS be implemented without Event Sourcing?

Yes. CQRS and Event Sourcing are independent patterns.

### Q30. Can DDD be implemented in a monolithic application?

Yes. DDD is a modeling approach and does not require microservices.

### Q31. What is the Outbox Pattern?

The Outbox Pattern helps reliably publish events by storing outgoing messages in the same database transaction as the associated business changes.

### Q32. What is Idempotency?

Idempotency means repeating the same operation does not create unintended additional effects.

### Q33. What is the difference between Choreography and Orchestration?

Choreography uses events and decentralized reactions to coordinate a workflow. Orchestration uses a central coordinator to control the workflow.

### Q34. What is the difference between Clean Architecture and Hexagonal Architecture?

Clean Architecture emphasizes dependency direction across layers, while Hexagonal Architecture emphasizes Ports and Adapters around an application core.

### Q35. When should you use CQRS?

Use CQRS when read and write responsibilities have significantly different requirements or when separating them provides meaningful architectural benefits.

---

# PART 11: PRACTICAL EXERCISES

## 38. Exercise 1: Hexagonal Architecture

Build a User Management application.

Requirements:

- Create User.
- Find User.
- Update User.
- Delete User.

Use:

- Domain Entity.
- Primary Ports.
- Secondary Ports.
- Application Services.
- MongoDB Adapter.
- Express Controller.

Make sure the application service does not directly depend on Mongoose.

## Exercise 2: DDD – E-Commerce Domain

Create an e-commerce domain containing:

**Entities**
- Customer.
- Order.
- Product.

**Value Objects**
- Money.
- Address.
- Email.

**Aggregates**
- Order Aggregate.
- Customer Aggregate.

Implement business rules such as:

- Cannot place an empty order.
- Cannot add an invalid quantity.
- Cannot modify a confirmed order.
- Cannot create a negative product price.

## Exercise 3: Domain Events

Implement these events:

```text
UserRegistered
OrderPlaced
PaymentCompleted
OrderCancelled
ProductShipped
```

Create separate event handlers for:

- Email notifications.
- Analytics.
- Inventory updates.

## Exercise 4: CQRS

Build a Product Management application.

Commands:

- CreateProduct.
- UpdateProduct.
- DeleteProduct.

Queries:

- GetProductById.
- GetAllProducts.
- SearchProducts.

Keep Command Handlers and Query Handlers separate.

## Exercise 5: Event-Driven Architecture

Build an order processing system.

When an order is placed:

1. Publish `OrderPlaced`.
2. Inventory Service reserves stock.
3. Payment Service processes payment.
4. Notification Service sends confirmation.

Use an event broker such as RabbitMQ or Redis Streams for the practical implementation.

## Exercise 6: Saga Pattern

Implement an order workflow:

```text
Create Order
     |
Reserve Stock
     |
Process Payment
     |
Create Shipment
```

If payment fails:

- Release reserved stock.
- Cancel the order.

If shipment creation fails after payment succeeds, define an appropriate recovery or compensation workflow.

## Exercise 7: Event Sourcing

Build a Bank Account application.

Events:

- AccountOpened.
- MoneyDeposited.
- MoneyWithdrawn.

Requirements:

- Store events.
- Reconstruct current balance.
- Validate withdrawals.
- Implement snapshots.
- Support event replay.

## Exercise 8: Complete Architecture Project

Build an **E-Commerce Backend using TypeScript**.

### Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | HTTP API |
| TypeScript | Programming language |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| Zod | Runtime validation |
| RabbitMQ | Event messaging |
| Redis | Caching |
| Jest | Testing |

### Architecture Requirements

- Hexagonal Architecture.
- DDD.
- CQRS.
- Domain Events.
- Event-Driven Architecture.
- Repository Pattern.
- Dependency Injection.
- Centralized Error Handling.

### Modules

1. User Management.
2. Product Management.
3. Inventory Management.
4. Order Management.
5. Payment Management.
6. Notification Management.
7. Shipping Management.

---

# 39. Phase 29 Completion Checklist

Before moving forward, make sure you understand these concepts.

### Hexagonal Architecture

- [ ] Hexagonal Architecture.
- [ ] Ports and Adapters.
- [ ] Primary Ports.
- [ ] Secondary Ports.
- [ ] Primary Adapters.
- [ ] Secondary Adapters.
- [ ] Dependency direction.
- [ ] Composition Root.
- [ ] TypeScript implementation.

### Domain-Driven Design

- [ ] Domain and Domain Model.
- [ ] Entities.
- [ ] Value Objects.
- [ ] Aggregates.
- [ ] Aggregate Roots.
- [ ] Repositories.
- [ ] Domain Services.
- [ ] Application Services.
- [ ] Domain Events.
- [ ] Ubiquitous Language.
- [ ] Bounded Contexts.

### CQRS

- [ ] CQRS fundamentals.
- [ ] Commands.
- [ ] Queries.
- [ ] Command Handlers.
- [ ] Query Handlers.
- [ ] Read Models.
- [ ] Write Models.
- [ ] CRUD vs CQRS.
- [ ] Same Database vs Separate Databases.

### Event-Driven Architecture

- [ ] Event Producers.
- [ ] Event Consumers.
- [ ] Event Brokers.
- [ ] Pub/Sub.
- [ ] Synchronous vs Asynchronous Communication.
- [ ] Eventual Consistency.
- [ ] Saga Pattern.
- [ ] Choreography.
- [ ] Orchestration.

### Event Sourcing

- [ ] Event Sourcing Fundamentals.
- [ ] Event Store.
- [ ] Event Replay.
- [ ] Snapshots.
- [ ] Event Versioning.
- [ ] CQRS vs Event Sourcing.

### Professional Architecture

- [ ] Clean Architecture vs Hexagonal Architecture.
- [ ] DDD vs CQRS.
- [ ] Outbox Pattern.
- [ ] Idempotency.
- [ ] Dead-Letter Queues.
- [ ] Distributed System Fundamentals.

---

# 40. What Comes Next?

## Phase 30: TypeScript Configuration, Compiler Internals, Build Systems, and Advanced Project Setup

In the next phase, we will cover:

1. Understanding `tsconfig.json` in depth.
2. TypeScript compiler architecture.
3. How TypeScript compilation works.
4. Type checking vs transpilation.
5. TypeScript compiler options.
6. `target` and `module`.
7. `moduleResolution`.
8. `strict` mode.
9. `strictNullChecks`.
10. `noImplicitAny`.
11. `noEmit`.
12. `declaration`.
13. `sourceMap`.
14. `outDir` and `rootDir`.
15. `include`, `exclude`, and `files`.
16. TypeScript project references.
17. Monorepo configuration.
18. Build tools: `tsc`, `tsx`, `ts-node`, and bundlers.
19. TypeScript with Node.js ESM and CommonJS.
20. Path aliases.
21. Incremental compilation.
22. Declaration files (`.d.ts`).
23. Source maps and debugging.
24. Build optimization.
25. Production-ready TypeScript configuration.

**Phase 29 is complete.**

When you're ready, say **"OK, Phase 30"** to continue.