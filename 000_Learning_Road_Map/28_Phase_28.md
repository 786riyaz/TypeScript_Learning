# Phase 28: TypeScript Design Patterns – Advanced Creational, Structural, and Behavioral Patterns

**Level:** Advanced  
**Category:** Software Design & Architecture  
**Prerequisites:** TypeScript fundamentals, OOP, interfaces, generics, SOLID principles, dependency injection, and project architecture.

## Learning Objectives

By the end of this phase, you will understand:

1. What design patterns are and why they are useful.
2. The three major categories of design patterns.
3. Advanced creational, structural, and behavioral patterns.
4. How to implement design patterns using TypeScript.
5. How to select the appropriate pattern for a particular problem.
6. How design patterns are applied in real-world applications.
7. The difference between Dependency Injection and Service Locator.

---

# 1. What Are Design Patterns?

A **Design Pattern** is a reusable solution to a commonly occurring software design problem.

Design patterns provide proven approaches to organizing classes, objects, and their interactions.

They are not ready-made code or libraries. Instead, they describe how to structure your code to solve a particular type of problem.

### Example: Without a Design Pattern

Suppose you are developing an e-commerce application.

You need to send notifications through:

- Email
- SMS
- WhatsApp

You might initially write:

```typescript
class NotificationService {
  sendNotification(type: string, message: string): void {
    if (type === "email") {
      console.log("Sending email:", message);
    } else if (type === "sms") {
      console.log("Sending SMS:", message);
    } else if (type === "whatsapp") {
      console.log("Sending WhatsApp:", message);
    }
  }
}
```

This works, but every time you introduce another notification channel, you must modify the existing class.

As the application grows, this approach becomes difficult to maintain.

### Example: Using a Design Pattern

We can use the Strategy Pattern.

```typescript
interface NotificationStrategy {
  send(message: string): void;
}

class EmailNotification implements NotificationStrategy {
  send(message: string): void {
    console.log("Sending email:", message);
  }
}

class SMSNotification implements NotificationStrategy {
  send(message: string): void {
    console.log("Sending SMS:", message);
  }
}

class WhatsAppNotification implements NotificationStrategy {
  send(message: string): void {
    console.log("Sending WhatsApp:", message);
  }
}

class NotificationService {
  constructor(
    private strategy: NotificationStrategy
  ) {}

  send(message: string): void {
    this.strategy.send(message);
  }
}

const notification = new NotificationService(
  new EmailNotification()
);

notification.send("Your order has been confirmed.");
```

Now we can introduce another notification strategy without modifying `NotificationService`.

### Benefits of Design Patterns

| Benefit | Explanation |
|---|---|
| Reusability | Reuse proven design approaches. |
| Maintainability | Make code easier to understand and modify. |
| Scalability | Support future requirements more easily. |
| Flexibility | Reduce unnecessary dependencies between components. |
| Communication | Developers can communicate using common terminology. |
| Testability | Make components easier to isolate and test. |

### Important: Design Patterns Are Not Always Necessary

Do not use a design pattern simply because you know it.

For a simple requirement, a straightforward function or class might be better.

**The goal is to solve design problems, not to increase the number of classes in your application.**

---

# 2. Three Main Categories of Design Patterns

The traditional Gang of Four (GoF) design patterns are divided into three categories.

| Category | Purpose | Examples |
|---|---|---|
| Creational | Control object creation. | Abstract Factory, Builder, Prototype |
| Structural | Organize classes and objects. | Decorator, Facade, Proxy, Composite, Bridge |
| Behavioral | Manage communication and responsibilities. | Observer, Command, State, Iterator |

Let's understand each category.

---

# PART 1: CREATIONAL DESIGN PATTERNS

Creational patterns deal with **how objects are created**.

They help separate object creation from the code that uses those objects.

## 3. Abstract Factory Pattern

### What is Abstract Factory?

The Abstract Factory Pattern provides an interface for creating families of related objects without specifying their concrete classes.

In simple words:

Instead of creating individual objects directly, you create a factory that produces a group of related objects.

### Real-World Example

Suppose you are developing an application that supports two UI themes:

- Light Theme
- Dark Theme

Each theme contains:

- Button
- Checkbox
- Input

You want to create UI components according to the selected theme.

### Implementation

**Step 1: Define product interfaces.**

```typescript
interface Button {
  render(): void;
}

interface Checkbox {
  render(): void;
}
```

**Step 2: Create Light Theme components.**

```typescript
class LightButton implements Button {
  render(): void {
    console.log("Rendering light button");
  }
}

class LightCheckbox implements Checkbox {
  render(): void {
    console.log("Rendering light checkbox");
  }
}
```

**Step 3: Create Dark Theme components.**

```typescript
class DarkButton implements Button {
  render(): void {
    console.log("Rendering dark button");
  }
}

class DarkCheckbox implements Checkbox {
  render(): void {
    console.log("Rendering dark checkbox");
  }
}
```

**Step 4: Create the Abstract Factory interface.**

```typescript
interface UIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}
```

**Step 5: Implement concrete factories.**

```typescript
class LightThemeFactory implements UIFactory {
  createButton(): Button {
    return new LightButton();
  }

  createCheckbox(): Checkbox {
    return new LightCheckbox();
  }
}

class DarkThemeFactory implements UIFactory {
  createButton(): Button {
    return new DarkButton();
  }

  createCheckbox(): Checkbox {
    return new DarkCheckbox();
  }
}
```

**Step 6: Use the factory.**

```typescript
function renderUI(factory: UIFactory): void {
  const button = factory.createButton();
  const checkbox = factory.createCheckbox();

  button.render();
  checkbox.render();
}

const factory: UIFactory = new DarkThemeFactory();

renderUI(factory);
```

Output:

```text
Rendering dark button
Rendering dark checkbox
```

### How Does It Work?

```text
              UIFactory
                  |
          -------------------
          |                 |
  LightThemeFactory  DarkThemeFactory
          |                 |
     ------------      ------------
     |          |      |          |
 LightButton  LightCheckbox  DarkButton  DarkCheckbox
```

### Real-World Use Cases

- Multiple UI themes.
- Database provider families.
- Cloud storage providers.
- Payment gateway families.
- Cross-platform UI components.

### When to Use?

Use Abstract Factory when you need to create multiple related objects that should work together.

---

## 4. Builder Pattern

### What is Builder Pattern?

The Builder Pattern constructs complex objects step by step.

It is particularly useful when an object has:

- Many properties.
- Optional properties.
- Complex initialization.
- Validation requirements.

### Problem Without Builder

Consider creating a user object.

```typescript
interface User {
  name: string;
  email: string;
  age?: number;
  phone?: string;
  address?: string;
  role?: string;
}
```

You might create an object like this:

```typescript
const user: User = {
  name: "Riyaz",
  email: "riyaz@example.com",
  age: 25,
  phone: "9876543210",
  address: "Ahmedabad",
  role: "admin"
};
```

This is perfectly acceptable for simple objects.

However, when object construction involves multiple steps, conditional logic, or validation, a Builder can be useful.

### Implementation

**Step 1: Create the User class.**

```typescript
class User {
  constructor(
    public name: string,
    public email: string,
    public age?: number,
    public phone?: string,
    public address?: string
  ) {}
}
```

**Step 2: Create UserBuilder.**

```typescript
class UserBuilder {
  private name: string = "";
  private email: string = "";
  private age?: number;
  private phone?: string;
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

  setPhone(phone: string): this {
    this.phone = phone;
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
      this.phone,
      this.address
    );
  }
}
```

**Step 3: Use the Builder.**

```typescript
const user = new UserBuilder()
  .setName("Riyaz")
  .setEmail("riyaz@example.com")
  .setAge(25)
  .setAddress("Ahmedabad")
  .build();

console.log(user);
```

### Understanding Method Chaining

Notice this:

```typescript
.setName("Riyaz")
.setEmail("riyaz@example.com")
.setAge(25)
```

Every setter returns:

```typescript
return this;
```

This allows us to call multiple methods on the same builder object.

### Real-World Use Cases

- Creating complex configuration objects.
- Generating reports.
- Building API requests.
- Creating database query objects.
- Constructing complex test data.

### When to Use?

Use Builder when object construction becomes complicated and you want to make it readable and controlled.

**Important:** Do not create a Builder for every object. A normal object literal or constructor is often sufficient.

---

## 5. Prototype Pattern

### What is Prototype Pattern?

The Prototype Pattern creates new objects by copying or cloning an existing object.

Instead of constructing a new object from scratch, you use an existing object as a prototype.

JavaScript already supports prototype-based inheritance.

### Example Using Object.create()

```typescript
const userPrototype = {
  greet() {
    console.log(`Hello, ${this.name}`);
  }
};

const user = Object.create(userPrototype);

user.name = "Riyaz";

user.greet();
```

Output:

```text
Hello, Riyaz
```

Here:

- `userPrototype` is the prototype object.
- `Object.create()` creates a new object.
- The new object inherits properties and methods from its prototype.

### Example Using Cloning

```typescript
interface Product {
  name: string;
  price: number;
}

const originalProduct: Product = {
  name: "Laptop",
  price: 75000
};

const clonedProduct: Product = {
  ...originalProduct
};

clonedProduct.price = 80000;

console.log(originalProduct.price); // 75000
console.log(clonedProduct.price);  // 80000
```

The spread operator creates a **shallow copy**, not a full deep clone.

### Shallow Copy vs Deep Copy

| Shallow Copy | Deep Copy |
|---|---|
| Copies top-level properties. | Recursively copies nested data. |
| Nested objects may remain shared. | Nested objects are copied too. |
| Usually simpler and faster. | May require more processing. |

Example:

```typescript
const original = {
  name: "Riyaz",
  address: {
    city: "Ahmedabad"
  }
};

const shallowCopy = { ...original };

shallowCopy.address.city = "Surat";

console.log(original.address.city);
```

Output:

```text
Surat
```

Why?

Because the nested `address` object is shared between both objects.

For supported data structures, you can use:

```typescript
const deepCopy = structuredClone(original);
```

However, `structuredClone()` has limitations. It does not clone functions and does not preserve arbitrary custom class prototypes.

### Real-World Use Cases

- Cloning configuration objects.
- Creating objects from predefined templates.
- Game development.
- Copying document structures.
- Creating reusable object templates.

---

## 6. Factory Method vs Abstract Factory vs Builder vs Prototype

These patterns are related, but they solve different problems.

| Pattern | Main Purpose | Example |
|---|---|---|
| Factory Method | Delegate creation of an object to a specialized creator. | Create different payment processors. |
| Abstract Factory | Create families of related objects. | Create complete Light/Dark UI component families. |
| Builder | Construct one complex object step by step. | Build a complex report. |
| Prototype | Create objects by cloning existing objects. | Clone an existing configuration. |

---

# PART 2: STRUCTURAL DESIGN PATTERNS

Structural patterns deal with **how classes and objects are organized and connected**.

They help build flexible structures without creating unnecessary dependencies.

## 7. Decorator Pattern

### What is Decorator Pattern?

The Decorator Pattern adds new behavior to an existing object without modifying its original class.

It wraps an object with another object that provides additional functionality.

### Real-World Example

Suppose you have a basic notification service.

Initially, it only sends messages.

Now you want to add:

- Logging.
- Encryption.
- Retry functionality.

Instead of modifying the original notification class, you can decorate it.

### Implementation

**Step 1: Create an interface.**

```typescript
interface Notification {
  send(message: string): void;
}
```

**Step 2: Create the basic implementation.**

```typescript
class EmailNotification implements Notification {
  send(message: string): void {
    console.log("Sending email:", message);
  }
}
```

**Step 3: Create a decorator.**

```typescript
class LoggingDecorator implements Notification {
  constructor(
    private notification: Notification
  ) {}

  send(message: string): void {
    console.log("Logging notification...");

    this.notification.send(message);
  }
}
```

**Step 4: Create another decorator.**

```typescript
class EncryptionDecorator implements Notification {
  constructor(
    private notification: Notification
  ) {}

  send(message: string): void {
    const encryptedMessage = `ENCRYPTED(${message})`;

    this.notification.send(encryptedMessage);
  }
}
```

**Step 5: Use decorators.**

```typescript
const email = new EmailNotification();

const encrypted = new EncryptionDecorator(email);

const logged = new LoggingDecorator(encrypted);

logged.send("Hello User");
```

Output:

```text
Logging notification...
Sending email: ENCRYPTED(Hello User)
```

### How Does It Work?

```text
LoggingDecorator
       |
EncryptionDecorator
       |
EmailNotification
```

Each decorator adds behavior and delegates the actual operation to the wrapped object.

### Real-World Use Cases

- Logging.
- Caching.
- Authentication.
- Encryption.
- Performance monitoring.
- Request tracking.

### Important: Decorator Pattern vs TypeScript Decorator Syntax

These are two different concepts.

**Decorator Pattern:** A software design pattern based on wrapping objects.

**TypeScript Decorator Syntax:** A language feature used to annotate or modify classes and class members.

For example:

```typescript
function Logger(
  value: Function,
  context: ClassDecoratorContext
) {
  console.log("Class:", context.name);
}

@Logger
class UserService {}
```

This is TypeScript decorator syntax, not necessarily an implementation of the Decorator design pattern.

---

## 8. Facade Pattern

### What is Facade Pattern?

The Facade Pattern provides a simple interface to a complex subsystem.

In simple words:

It hides the complexity of multiple classes behind one easy-to-use class.

### Real-World Example

Consider an e-commerce checkout process.

To place an order, you need to:

1. Check product availability.
2. Process payment.
3. Create an order.
4. Send confirmation.

Without a Facade, the client must coordinate all these services.

### Implementation

**Step 1: Create subsystem classes.**

```typescript
class InventoryService {
  checkStock(): void {
    console.log("Checking product stock...");
  }
}

class PaymentService {
  processPayment(): void {
    console.log("Processing payment...");
  }
}

class OrderService {
  createOrder(): void {
    console.log("Creating order...");
  }
}

class EmailService {
  sendConfirmation(): void {
    console.log("Sending confirmation email...");
  }
}
```

**Step 2: Create CheckoutFacade.**

```typescript
class CheckoutFacade {
  private inventory = new InventoryService();
  private payment = new PaymentService();
  private order = new OrderService();
  private email = new EmailService();

  checkout(): void {
    this.inventory.checkStock();

    this.payment.processPayment();

    this.order.createOrder();

    this.email.sendConfirmation();
  }
}
```

**Step 3: Use Facade.**

```typescript
const checkout = new CheckoutFacade();

checkout.checkout();
```

Output:

```text
Checking product stock...
Processing payment...
Creating order...
Sending confirmation email...
```

The client does not need to understand how all the subsystems work internally.

### Real-World Use Cases

- Payment processing.
- Authentication workflows.
- Database access layers.
- Third-party API integrations.
- Complex application workflows.

### Important

Facade does not eliminate the underlying services.

It simply provides a simplified interface to use them.

---

## 9. Proxy Pattern

### What is Proxy Pattern?

The Proxy Pattern provides a substitute object that controls access to another object.

The proxy receives requests and decides whether, when, or how to forward them to the actual object.

### Real-World Example

Suppose you have an expensive API request.

You want to cache the result so that repeated requests do not call the API again.

You can implement a caching proxy.

### Implementation

**Step 1: Create an interface.**

```typescript
interface UserService {
  getUser(id: number): Promise<string>;
}
```

**Step 2: Create the real service.**

```typescript
class RealUserService implements UserService {
  async getUser(id: number): Promise<string> {
    console.log("Fetching user from database...");

    return `User ${id}`;
  }
}
```

**Step 3: Create a proxy.**

```typescript
class UserServiceProxy implements UserService {
  private cache = new Map<number, string>();

  constructor(
    private realService: UserService
  ) {}

  async getUser(id: number): Promise<string> {
    if (this.cache.has(id)) {
      console.log("Returning cached user");

      return this.cache.get(id)!;
    }

    const user = await this.realService.getUser(id);

    this.cache.set(id, user);

    return user;
  }
}
```

**Step 4: Use the proxy.**

```typescript
const realService = new RealUserService();

const proxy = new UserServiceProxy(realService);

async function main() {
  console.log(await proxy.getUser(1));

  console.log(await proxy.getUser(1));
}

main();
```

Output:

```text
Fetching user from database...
User 1

Returning cached user
User 1
```

### JavaScript Proxy Object

JavaScript also provides a built-in `Proxy` object.

```typescript
const user = {
  name: "Riyaz",
  age: 25
};

const proxy = new Proxy(user, {
  get(target, property) {
    console.log(`Accessing ${String(property)}`);

    return Reflect.get(target, property);
  }
});

console.log(proxy.name);
```

Output:

```text
Accessing name
Riyaz
```

The JavaScript `Proxy` object intercepts operations such as property access, assignment, and function calls.

### Real-World Use Cases

- Caching.
- Access control.
- Lazy initialization.
- Logging.
- API request interception.
- Validation.

---

## 10. Composite Pattern

### What is Composite Pattern?

The Composite Pattern allows you to treat individual objects and groups of objects uniformly.

It is especially useful when working with tree-like structures.

### Real-World Example

Consider a file system.

A file can contain data.

A folder can contain:

- Files.
- Other folders.

Both files and folders support a common operation: displaying their contents or calculating their size.

### Implementation

**Step 1: Create a common interface.**

```typescript
interface FileSystemItem {
  getSize(): number;
}
```

**Step 2: Create Leaf.**

A leaf is an individual object that does not contain other objects.

```typescript
class File implements FileSystemItem {
  constructor(
    private name: string,
    private size: number
  ) {}

  getSize(): number {
    return this.size;
  }
}
```

**Step 3: Create Composite.**

```typescript
class Folder implements FileSystemItem {
  private items: FileSystemItem[] = [];

  add(item: FileSystemItem): void {
    this.items.push(item);
  }

  getSize(): number {
    return this.items.reduce(
      (total, item) => total + item.getSize(),
      0
    );
  }
}
```

**Step 4: Use Composite.**

```typescript
const file1 = new File("image.png", 100);
const file2 = new File("document.pdf", 200);

const folder = new Folder();

folder.add(file1);
folder.add(file2);

console.log(folder.getSize());
```

Output:

```text
300
```

### Structure

```text
             Folder
               |
       -----------------
       |               |
      File           Folder
                       |
                 ------------
                 |          |
                File       File
```

### Real-World Use Cases

- File systems.
- Organization hierarchies.
- Nested menus.
- UI component trees.
- Product categories.
- Nested comments.

---

## 11. Bridge Pattern

### What is Bridge Pattern?

The Bridge Pattern separates an abstraction from its implementation so that both can evolve independently.

It is useful when two dimensions of functionality can vary independently.

### Real-World Example

Suppose you are building a notification system.

You support multiple notification types:

- Alert.
- Reminder.

You also support multiple delivery channels:

- Email.
- SMS.

Without Bridge, you might create:

```text
EmailAlert
SMSAlert
EmailReminder
SMSReminder
```

As more notification types and channels are added, the number of classes grows.

Bridge separates these two dimensions.

### Implementation

**Step 1: Create implementation interface.**

```typescript
interface NotificationChannel {
  send(message: string): void;
}
```

**Step 2: Create concrete implementations.**

```typescript
class EmailChannel implements NotificationChannel {
  send(message: string): void {
    console.log("Email:", message);
  }
}

class SMSChannel implements NotificationChannel {
  send(message: string): void {
    console.log("SMS:", message);
  }
}
```

**Step 3: Create abstraction.**

```typescript
abstract class Notification {
  constructor(
    protected channel: NotificationChannel
  ) {}

  abstract notify(message: string): void;
}
```

**Step 4: Create refined abstractions.**

```typescript
class AlertNotification extends Notification {
  notify(message: string): void {
    this.channel.send(`ALERT: ${message}`);
  }
}

class ReminderNotification extends Notification {
  notify(message: string): void {
    this.channel.send(`REMINDER: ${message}`);
  }
}
```

**Step 5: Use Bridge.**

```typescript
const emailAlert = new AlertNotification(
  new EmailChannel()
);

const smsReminder = new ReminderNotification(
  new SMSChannel()
);

emailAlert.notify("Server is down");

smsReminder.notify("Meeting at 5 PM");
```

### Structure

```text
       Notification
             |
      ----------------
      |              |
 AlertNotification  ReminderNotification
      |              |
      ------ Bridge --
             |
     NotificationChannel
             |
       --------------
       |            |
   EmailChannel  SMSChannel
```

### Real-World Use Cases

- Notification systems.
- Payment methods and payment operations.
- Cross-platform applications.
- Database abstraction.
- Rendering engines.

### Bridge vs Adapter

| Bridge | Adapter |
|---|---|
| Separates abstraction and implementation. | Makes incompatible interfaces compatible. |
| Usually planned as part of the design. | Often introduced to integrate existing systems. |
| Both sides can evolve independently. | Converts one interface into another. |

---

# PART 3: BEHAVIORAL DESIGN PATTERNS

Behavioral patterns deal with **communication and responsibility between objects**.

They help organize how objects interact and how responsibilities are distributed.

## 12. Observer Pattern

### What is Observer Pattern?

The Observer Pattern establishes a one-to-many relationship between objects.

When one object changes its state, all registered observers are notified automatically.

### Real-World Example

Think about YouTube subscriptions.

When a channel uploads a new video, its subscribers receive notifications.

Here:

- YouTube channel = Subject.
- Subscribers = Observers.
- New video upload = Event.

### Implementation

**Step 1: Create Observer interface.**

```typescript
interface Observer {
  update(message: string): void;
}
```

**Step 2: Create Subject.**

```typescript
class YouTubeChannel {
  private observers: Observer[] = [];

  subscribe(observer: Observer): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer): void {
    this.observers = this.observers.filter(
      item => item !== observer
    );
  }

  notify(message: string): void {
    this.observers.forEach(observer => {
      observer.update(message);
    });
  }

  uploadVideo(title: string): void {
    console.log("New video uploaded:", title);

    this.notify(`New video: ${title}`);
  }
}
```

**Step 3: Create concrete observers.**

```typescript
class Subscriber implements Observer {
  constructor(
    private name: string
  ) {}

  update(message: string): void {
    console.log(`${this.name} received: ${message}`);
  }
}
```

**Step 4: Use Observer.**

```typescript
const channel = new YouTubeChannel();

const user1 = new Subscriber("User 1");
const user2 = new Subscriber("User 2");

channel.subscribe(user1);
channel.subscribe(user2);

channel.uploadVideo("Learn TypeScript");
```

Output:

```text
New video uploaded: Learn TypeScript

User 1 received: New video: Learn TypeScript
User 2 received: New video: Learn TypeScript
```

### Real-World Use Cases

- UI event handling.
- Notifications.
- Real-time applications.
- Stock price updates.
- Chat applications.
- State management.

### Important

Always provide a way to unsubscribe observers.

Otherwise, long-lived subjects may retain references to objects that are no longer needed, causing memory leaks.

---

## 13. Pub/Sub Pattern

### What is Pub/Sub?

Pub/Sub stands for **Publish/Subscribe**.

It is a messaging pattern in which publishers send messages to a topic or event channel, and subscribers receive messages from that channel.

The publisher does not need to know who the subscribers are.

### Observer vs Pub/Sub

These patterns are related but not identical.

| Observer | Pub/Sub |
|---|---|
| Subject directly maintains observers. | Publishers communicate through a broker or event channel. |
| Usually direct object communication. | More loosely coupled communication. |
| Often used within one application. | Can be used locally or across distributed systems. |
| Subject knows its observers. | Publisher does not need to know subscribers. |

### Implementation

**Step 1: Create EventBus.**

```typescript
type EventHandler = (data: unknown) => void;

class EventBus {
  private subscribers = new Map<string, EventHandler[]>();

  subscribe(
    event: string,
    handler: EventHandler
  ): void {
    const handlers = this.subscribers.get(event) ?? [];

    handlers.push(handler);

    this.subscribers.set(event, handlers);
  }

  publish(event: string, data: unknown): void {
    const handlers = this.subscribers.get(event) ?? [];

    handlers.forEach(handler => handler(data));
  }
}
```

**Step 2: Subscribe to an event.**

```typescript
const eventBus = new EventBus();

eventBus.subscribe("user.registered", (data) => {
  console.log("Sending welcome email:", data);
});

eventBus.subscribe("user.registered", (data) => {
  console.log("Creating user analytics:", data);
});
```

**Step 3: Publish an event.**

```typescript
eventBus.publish("user.registered", {
  id: 1,
  name: "Riyaz"
});
```

Output:

```text
Sending welcome email: { id: 1, name: 'Riyaz' }

Creating user analytics: { id: 1, name: 'Riyaz' }
```

### Real-World Use Cases

- Microservices communication.
- Event-driven architecture.
- Background processing.
- Notification systems.
- Message queues.
- Real-time applications.

**Professional Note:** Production-grade event systems should also consider typed event payloads, asynchronous execution, retries, error handling, and message delivery guarantees.

---

## 14. Command Pattern

### What is Command Pattern?

The Command Pattern encapsulates a request as an object.

Instead of directly executing an operation, you create an object representing that operation.

This makes it possible to:

- Queue operations.
- Log operations.
- Undo operations.
- Schedule operations.
- Execute operations later.

### Real-World Example

Consider a text editor.

You perform actions such as:

- Write text.
- Delete text.
- Undo.
- Redo.

Each action can be represented as a command.

### Implementation

**Step 1: Create Command interface.**

```typescript
interface Command {
  execute(): void;
  undo(): void;
}
```

**Step 2: Create Receiver.**

```typescript
class TextEditor {
  private content = "";

  write(text: string): void {
    this.content += text;
  }

  delete(length: number): string {
    const deleted = this.content.slice(-length);

    this.content = this.content.slice(0, -length);

    return deleted;
  }

  getContent(): string {
    return this.content;
  }
}
```

**Step 3: Create Concrete Command.**

```typescript
class WriteCommand implements Command {
  constructor(
    private editor: TextEditor,
    private text: string
  ) {}

  execute(): void {
    this.editor.write(this.text);
  }

  undo(): void {
    this.editor.delete(this.text.length);
  }
}
```

**Step 4: Create Invoker.**

```typescript
class CommandManager {
  private history: Command[] = [];

  execute(command: Command): void {
    command.execute();

    this.history.push(command);
  }

  undo(): void {
    const command = this.history.pop();

    command?.undo();
  }
}
```

**Step 5: Use Command.**

```typescript
const editor = new TextEditor();

const manager = new CommandManager();

manager.execute(
  new WriteCommand(editor, "Hello ")
);

manager.execute(
  new WriteCommand(editor, "TypeScript")
);

console.log(editor.getContent());

manager.undo();

console.log(editor.getContent());
```

Output:

```text
Hello TypeScript

Hello
```

### Real-World Use Cases

- Undo/redo functionality.
- Task queues.
- Background jobs.
- Transaction processing.
- GUI actions.
- Audit logging.

---

## 15. State Pattern

### What is State Pattern?

The State Pattern allows an object to change its behavior when its internal state changes.

Instead of writing many conditional statements, you represent different states as separate objects or well-defined state types.

### Real-World Example

Consider an order management system.

An order can have these states:

```text
Pending
   |
   v
Confirmed
   |
   v
Shipped
   |
   v
Delivered
```

An order's behavior depends on its current state.

For example:

- A pending order can be confirmed.
- A confirmed order can be shipped.
- A shipped order can be delivered.

### Implementation Using Discriminated Unions

```typescript
type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered";

class Order {
  private status: OrderStatus = "pending";

  confirm(): void {
    if (this.status !== "pending") {
      throw new Error("Only pending orders can be confirmed");
    }

    this.status = "confirmed";
  }

  ship(): void {
    if (this.status !== "confirmed") {
      throw new Error("Only confirmed orders can be shipped");
    }

    this.status = "shipped";
  }

  deliver(): void {
    if (this.status !== "shipped") {
      throw new Error("Only shipped orders can be delivered");
    }

    this.status = "delivered";
  }

  getStatus(): OrderStatus {
    return this.status;
  }
}
```

Usage:

```typescript
const order = new Order();

console.log(order.getStatus());

order.confirm();

console.log(order.getStatus());

order.ship();

console.log(order.getStatus());

order.deliver();

console.log(order.getStatus());
```

Output:

```text
pending
confirmed
shipped
delivered
```

### Another Implementation: State Objects

When each state has significantly different behavior, separate state classes can be more appropriate.

```typescript
interface OrderState {
  confirm(order: OrderContext): void;
  ship(order: OrderContext): void;
}
```

For example:

```typescript
class PendingState implements OrderState {
  confirm(order: OrderContext): void {
    console.log("Order confirmed");

    order.setState(new ConfirmedState());
  }

  ship(): void {
    throw new Error("Pending order cannot be shipped");
  }
}

class ConfirmedState implements OrderState {
  confirm(): void {
    throw new Error("Order is already confirmed");
  }

  ship(order: OrderContext): void {
    console.log("Order shipped");

    order.setState(new ShippedState());
  }
}

class ShippedState implements OrderState {
  confirm(): void {
    throw new Error("Shipped order cannot be confirmed");
  }

  ship(): void {
    throw new Error("Order is already shipped");
  }
}

class OrderContext {
  constructor(
    private state: OrderState = new PendingState()
  ) {}

  setState(state: OrderState): void {
    this.state = state;
  }

  confirm(): void {
    this.state.confirm(this);
  }

  ship(): void {
    this.state.ship(this);
  }
}
```

Usage:

```typescript
const order = new OrderContext();

order.confirm();

order.ship();
```

### When to Use?

Use State when an object has multiple states and its permitted operations or behavior depend on its current state.

### Real-World Use Cases

- Order management.
- Payment processing.
- Authentication workflows.
- Workflow engines.
- Media players.
- Connection management.

---

## 16. Chain of Responsibility Pattern

### What is Chain of Responsibility?

The Chain of Responsibility Pattern passes a request through a sequence of handlers.

Each handler decides whether to process the request or pass it to the next handler.

### Real-World Example

Consider an API request pipeline.

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
Controller
```

Each stage performs a particular responsibility.

### Implementation

```typescript
interface Handler {
  setNext(handler: Handler): Handler;

  handle(request: string): string | null;
}
```

Create a base handler:

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

Create concrete handlers:

```typescript
class AuthenticationHandler extends BaseHandler {
  handle(request: string): string | null {
    console.log("Checking authentication...");

    if (request !== "authenticated") {
      return "Authentication failed";
    }

    return super.handle(request);
  }
}

class ValidationHandler extends BaseHandler {
  handle(request: string): string | null {
    console.log("Validating request...");

    return super.handle(request);
  }
}

class ControllerHandler extends BaseHandler {
  handle(request: string): string | null {
    console.log("Processing request...");

    return "Request completed";
  }
}
```

Connect handlers:

```typescript
const authentication = new AuthenticationHandler();
const validation = new ValidationHandler();
const controller = new ControllerHandler();

authentication
  .setNext(validation)
  .setNext(controller);

console.log(authentication.handle("authenticated"));
```

Output:

```text
Checking authentication...
Validating request...
Processing request...
Request completed
```

### Real-World Use Cases

- Express.js middleware.
- Authentication pipelines.
- Request validation.
- Logging pipelines.
- Event processing.
- Approval workflows.

---

## 17. Iterator Pattern

### What is Iterator Pattern?

The Iterator Pattern provides a standard way to access elements of a collection sequentially without exposing the collection's internal implementation.

JavaScript already has built-in iterator support.

### Example

```typescript
const numbers = [10, 20, 30, 40];

const iterator = numbers[Symbol.iterator]();

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
```

Output:

```typescript
{ value: 10, done: false }
{ value: 20, done: false }
{ value: 30, done: false }
{ value: 40, done: false }
{ value: undefined, done: true }
```

### Understanding Symbol.iterator

An object is iterable when it implements the iterable protocol through:

```typescript
Symbol.iterator
```

The method returns an iterator.

An iterator implements:

```typescript
next(): IteratorResult<T>
```

### Creating a Custom Iterator

```typescript
class NumberCollection implements Iterable<number> {
  constructor(
    private numbers: number[]
  ) {}

  [Symbol.iterator](): Iterator<number> {
    let index = 0;

    const numbers = this.numbers;

    return {
      next(): IteratorResult<number> {
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
const collection = new NumberCollection([10, 20, 30]);

for (const number of collection) {
  console.log(number);
}
```

Output:

```text
10
20
30
```

### Real-World Use Cases

- Custom collections.
- Pagination.
- Database cursors.
- Lazy data processing.
- File reading.
- Streaming data.

---

## 18. Template Method Pattern

### What is Template Method?

The Template Method Pattern defines the skeleton of an algorithm in a base class while allowing subclasses to implement or override particular steps.

In simple words:

The parent class defines the overall process, and child classes customize individual steps.

### Real-World Example

Suppose you are building a report generation system.

Every report follows these steps:

1. Fetch data.
2. Process data.
3. Generate report.
4. Export report.

However, different report types may process and export data differently.

### Implementation

```typescript
abstract class ReportGenerator {
  generate(): void {
    this.fetchData();

    this.processData();

    this.createReport();

    this.exportReport();
  }

  private fetchData(): void {
    console.log("Fetching data...");
  }

  protected abstract processData(): void;

  protected abstract createReport(): void;

  protected abstract exportReport(): void;
}
```

Create concrete implementations:

```typescript
class PDFReport extends ReportGenerator {
  protected processData(): void {
    console.log("Processing PDF data...");
  }

  protected createReport(): void {
    console.log("Creating PDF report...");
  }

  protected exportReport(): void {
    console.log("Exporting PDF...");
  }
}

class ExcelReport extends ReportGenerator {
  protected processData(): void {
    console.log("Processing Excel data...");
  }

  protected createReport(): void {
    console.log("Creating Excel report...");
  }

  protected exportReport(): void {
    console.log("Exporting Excel...");
  }
}
```

Usage:

```typescript
const report = new PDFReport();

report.generate();
```

Output:

```text
Fetching data...
Processing PDF data...
Creating PDF report...
Exporting PDF...
```

### Real-World Use Cases

- Report generation.
- Data import/export.
- Payment workflows.
- File processing.
- Application initialization.

---

## 19. Mediator Pattern

### What is Mediator Pattern?

The Mediator Pattern introduces a central object that coordinates communication between multiple objects.

Instead of objects communicating directly with each other, they communicate through a mediator.

### Real-World Example

Consider a chat application.

Users should not need to maintain direct references to every other user.

A chat room can coordinate communication.

```text
User A --------\
                \
User B ----------> ChatRoom
                /
User C --------/
```

### Implementation

**Step 1: Create Mediator interface.**

```typescript
interface ChatMediator {
  sendMessage(message: string, sender: User): void;
}
```

**Step 2: Create User class.**

```typescript
class User {
  constructor(
    public name: string,
    private mediator: ChatMediator
  ) {}

  send(message: string): void {
    this.mediator.sendMessage(message, this);
  }

  receive(message: string): void {
    console.log(`${this.name} received: ${message}`);
  }
}
```

**Step 3: Create Concrete Mediator.**

```typescript
class ChatRoom implements ChatMediator {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
  }

  sendMessage(message: string, sender: User): void {
    this.users
      .filter(user => user !== sender)
      .forEach(user => user.receive(message));
  }
}
```

**Step 4: Use Mediator.**

```typescript
const chatRoom = new ChatRoom();

const user1 = new User("Riyaz", chatRoom);
const user2 = new User("Ali", chatRoom);
const user3 = new User("Ahmed", chatRoom);

chatRoom.addUser(user1);
chatRoom.addUser(user2);
chatRoom.addUser(user3);

user1.send("Hello everyone!");
```

Output:

```text
Ali received: Hello everyone!
Ahmed received: Hello everyone!
```

### Real-World Use Cases

- Chat applications.
- UI component communication.
- Workflow coordination.
- Complex form interactions.
- Event coordination.

---

## 20. Visitor Pattern

### What is Visitor Pattern?

The Visitor Pattern allows you to add new operations to a group of existing object types without modifying those object classes.

It is useful when you have a stable set of object types but frequently need to introduce new operations.

### Real-World Example

Suppose you have an application that works with different document elements:

- Text.
- Image.
- Video.

You want to perform operations such as:

- Export.
- Calculate size.
- Generate metadata.

Instead of adding every operation directly to every element class, you can use visitors.

### Implementation

**Step 1: Create visitor interface.**

```typescript
interface DocumentVisitor {
  visitText(text: TextElement): void;
  visitImage(image: ImageElement): void;
}
```

**Step 2: Create element interface.**

```typescript
interface DocumentElement {
  accept(visitor: DocumentVisitor): void;
}
```

**Step 3: Create concrete elements.**

```typescript
class TextElement implements DocumentElement {
  constructor(
    public content: string
  ) {}

  accept(visitor: DocumentVisitor): void {
    visitor.visitText(this);
  }
}

class ImageElement implements DocumentElement {
  constructor(
    public url: string
  ) {}

  accept(visitor: DocumentVisitor): void {
    visitor.visitImage(this);
  }
}
```

**Step 4: Create concrete visitor.**

```typescript
class ExportVisitor implements DocumentVisitor {
  visitText(text: TextElement): void {
    console.log("Exporting text:", text.content);
  }

  visitImage(image: ImageElement): void {
    console.log("Exporting image:", image.url);
  }
}
```

**Step 5: Use Visitor.**

```typescript
const elements: DocumentElement[] = [
  new TextElement("Hello TypeScript"),
  new ImageElement("image.png")
];

const visitor = new ExportVisitor();

elements.forEach(element => {
  element.accept(visitor);
});
```

Output:

```text
Exporting text: Hello TypeScript
Exporting image: image.png
```

### Important Trade-off

Visitor makes it easier to add new operations.

However, adding a new element type requires updating the visitor interface and its implementations.

### Real-World Use Cases

- Compilers.
- Abstract syntax trees.
- Document processing.
- Code analysis.
- Data transformation.

---

# 21. Strategy vs State vs Command

These three behavioral patterns can sometimes look similar, but their purposes are different.

| Pattern | Main Purpose | Example |
|---|---|---|
| Strategy | Select an algorithm or behavior. | Choose payment method. |
| State | Change behavior based on current state. | Order lifecycle. |
| Command | Represent an action as an object. | Undo/redo editor action. |

### Strategy

You select an algorithm from multiple alternatives.

```typescript
interface PaymentStrategy {
  pay(amount: number): void;
}
```

### State

The object's current state determines which operations are allowed.

```typescript
type OrderStatus = "pending" | "confirmed" | "shipped";
```

### Command

An action is represented as an object.

```typescript
interface Command {
  execute(): void;
  undo(): void;
}
```

Remember:

- Strategy = Which algorithm should be used?
- State = What behavior is valid in the current state?
- Command = Which action should be executed?

---

# 22. Dependency Injection vs Service Locator

Both approaches help provide dependencies to classes.

However, they work differently.

## Dependency Injection (DI)

Dependency Injection means providing a class with the dependencies it needs from outside.

Example:

```typescript
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(message);
  }
}

class UserService {
  constructor(
    private logger: Logger
  ) {}

  createUser(): void {
    this.logger.log("User created");
  }
}

const logger = new ConsoleLogger();

const userService = new UserService(logger);

userService.createUser();
```

Here:

- `UserService` requires a Logger.
- The Logger is provided through the constructor.
- `UserService` does not create the Logger itself.

This is Constructor Injection.

## Service Locator

A Service Locator is an object or registry that stores dependencies and allows other classes to retrieve them when needed.

Example:

```typescript
class ServiceLocator {
  private static services = new Map<string, unknown>();

  static register<T>(
    name: string,
    service: T
  ): void {
    this.services.set(name, service);
  }

  static get<T>(name: string): T {
    const service = this.services.get(name);

    if (!service) {
      throw new Error(`Service not found: ${name}`);
    }

    return service as T;
  }
}
```

Register a service:

```typescript
ServiceLocator.register(
  "logger",
  new ConsoleLogger()
);
```

Retrieve it:

```typescript
class UserService {
  private logger = ServiceLocator.get<Logger>("logger");

  createUser(): void {
    this.logger.log("User created");
  }
}
```

### DI vs Service Locator

| Dependency Injection | Service Locator |
|---|---|
| Dependencies are provided externally. | Dependencies are retrieved from a central registry. |
| Dependencies are visible in constructors. | Dependencies may be hidden inside classes. |
| Easier to understand dependencies. | Can make dependencies less obvious. |
| Easier to unit test. | Testing may require configuring the locator. |
| Generally preferred for application services. | Useful in certain framework or infrastructure contexts. |

**Professional Recommendation:** Prefer Dependency Injection for application services and business logic. Service Locator can hide dependencies and make code harder to maintain if used throughout an application.

---

# 23. Important Design Pattern Comparisons

Let's summarize the patterns that are easy to confuse.

### Structural Patterns

| Pattern | What It Does |
|---|---|
| Adapter | Makes incompatible interfaces work together. |
| Bridge | Separates abstraction from implementation. |
| Decorator | Adds behavior to an existing object. |
| Facade | Simplifies access to a complex subsystem. |
| Proxy | Controls access to another object. |
| Composite | Treats individual objects and groups uniformly. |

### Behavioral Patterns

| Pattern | What It Does |
|---|---|
| Observer | Notifies registered observers when something changes. |
| Pub/Sub | Communicates through topics or event channels. |
| Command | Encapsulates an operation as an object. |
| State | Changes behavior according to internal state. |
| Strategy | Selects an interchangeable algorithm. |
| Chain of Responsibility | Passes requests through multiple handlers. |
| Iterator | Traverses a collection. |
| Template Method | Defines an algorithm's skeleton in a base class. |
| Mediator | Centralizes communication between objects. |
| Visitor | Adds operations to existing object structures. |

---

# 24. How to Choose the Right Design Pattern

Do not memorize patterns and try to force them into every application.

Instead, identify the problem first.

| Problem | Consider This Pattern |
|---|---|
| Complex object construction | Builder |
| Need related object families | Abstract Factory |
| Need to clone existing objects | Prototype |
| Need to add behavior dynamically | Decorator |
| Complex subsystem is difficult to use | Facade |
| Need to control access to an object | Proxy |
| Working with hierarchical objects | Composite |
| Need independent abstraction and implementation | Bridge |
| Need to notify multiple subscribers | Observer |
| Need decoupled event communication | Pub/Sub |
| Need undo/redo or queued operations | Command |
| Behavior depends on current state | State |
| Multiple interchangeable algorithms | Strategy |
| Request should pass through handlers | Chain of Responsibility |
| Need custom collection traversal | Iterator |
| Fixed algorithm with customizable steps | Template Method |
| Multiple objects need coordinated communication | Mediator |
| Need to add operations to stable object structures | Visitor |

### Five Questions Before Implementing a Pattern

1. What actual problem am I trying to solve?
2. Is the current implementation difficult to maintain?
3. Will the pattern reduce coupling or improve flexibility?
4. Does the pattern introduce unnecessary complexity?
5. Can a simpler implementation solve the same problem?

---

# 25. Real-World Application: Combining Multiple Design Patterns

Let's imagine you are developing an e-commerce application using:

- Node.js
- Express.js
- TypeScript
- MongoDB
- React

You might use several patterns together.

| Application Requirement | Design Pattern |
|---|---|
| Create different payment processors | Factory Method |
| Create related storage providers | Abstract Factory |
| Construct complex reports | Builder |
| Send multiple notification types | Strategy |
| Add logging to services | Decorator |
| Simplify checkout workflow | Facade |
| Cache frequently requested data | Proxy |
| Organize product categories | Composite |
| Handle user registration events | Observer / Pub/Sub |
| Undo administrative operations | Command |
| Manage order lifecycle | State |
| Process API requests | Chain of Responsibility |
| Coordinate chat participants | Mediator |
| Process different document types | Visitor |

### Example Application Architecture

```text
                    Client
                      |
                      v
                 API Routes
                      |
                      v
                  Middleware
                      |
                      v
                  Controller
                      |
                      v
                  Service Layer
                      |
           -----------------------
           |          |          |
           v          v          v
       Strategy    Facade     Repository
           |          |          |
           v          v          v
       Payment    Checkout    MongoDB
       Provider   Workflow
           |
           v
        Observer
           |
     ----------------
     |              |
     v              v
  Email Event   Analytics Event
```

This is a simplified conceptual architecture, not a mandatory folder structure.

The important point is that design patterns can work together to solve different problems within the same application.

---

# 26. Common Design Pattern Mistakes

| Mistake | Explanation |
|---|---|
| Overengineering | Using patterns when simple code is sufficient. |
| Too many interfaces | Creating unnecessary abstractions. |
| Pattern-first development | Selecting a pattern before understanding the problem. |
| Incorrect pattern selection | Using Decorator when Facade is needed, or vice versa. |
| Excessive inheritance | Building complicated inheritance hierarchies. |
| Tight coupling | Classes still depend on concrete implementations. |
| Ignoring cleanup | Forgetting to unsubscribe observers. |
| Unnecessary factories | Creating factories for simple object construction. |
| Hidden dependencies | Using Service Locator everywhere. |
| Ignoring testing | Not testing individual components independently. |

### Professional Recommendations

- Prefer composition over inheritance when it makes relationships simpler.
- Keep each class responsible for a clear purpose.
- Use interfaces where they provide meaningful abstraction.
- Avoid unnecessary abstraction layers.
- Keep business logic independent of infrastructure where practical.
- Use dependency injection to manage important dependencies.
- Write tests for important behavior and state transitions.

---

# 27. Interview Questions and Answers

### Q1. What is a design pattern?

A design pattern is a reusable solution to a commonly occurring software design problem.

### Q2. What are the three categories of GoF design patterns?

1. Creational.
2. Structural.
3. Behavioral.

### Q3. What is the difference between creational and structural patterns?

Creational patterns focus on object creation, while structural patterns focus on organizing objects and classes.

### Q4. What is Abstract Factory?

It provides an interface for creating families of related objects without specifying their concrete classes.

### Q5. What is the difference between Factory Method and Abstract Factory?

Factory Method delegates the creation of an object to specialized creators. Abstract Factory creates families of related objects.

### Q6. What is Builder Pattern?

It constructs complex objects step by step.

### Q7. What is Prototype Pattern?

It creates new objects by cloning existing objects.

### Q8. What is the difference between shallow copy and deep copy?

A shallow copy copies top-level properties but may share nested objects. A deep copy also creates copies of nested data.

### Q9. What is Decorator Pattern?

It adds behavior to an existing object without modifying its original implementation.

### Q10. What is Facade Pattern?

It provides a simplified interface to a complex subsystem.

### Q11. What is Proxy Pattern?

It provides a substitute object that controls access to another object.

### Q12. What is Composite Pattern?

It allows individual objects and groups of objects to be treated uniformly.

### Q13. What is Bridge Pattern?

It separates abstraction from implementation so both can evolve independently.

### Q14. What is the difference between Adapter and Bridge?

Adapter makes incompatible interfaces compatible, whereas Bridge separates abstraction and implementation.

### Q15. What is Observer Pattern?

It establishes a one-to-many relationship where observers are notified when the subject changes.

### Q16. What is Pub/Sub?

It is a messaging pattern in which publishers send messages through topics or channels and subscribers receive them.

### Q17. What is the difference between Observer and Pub/Sub?

Observer generally involves direct subject-to-observer relationships. Pub/Sub introduces a broker or messaging channel between publishers and subscribers.

### Q18. What is Command Pattern?

It encapsulates an operation as an object, allowing operations to be queued, logged, or undone.

### Q19. What is State Pattern?

It allows an object's behavior to change according to its current state.

### Q20. What is Strategy Pattern?

It defines interchangeable algorithms and allows the application to select one at runtime.

### Q21. What is Chain of Responsibility?

It passes a request through a sequence of handlers until it is processed or the chain ends.

### Q22. What is Iterator Pattern?

It provides a standard way to traverse a collection without exposing its internal structure.

### Q23. What is Template Method?

It defines an algorithm's structure in a base class while allowing subclasses to customize individual steps.

### Q24. What is Mediator Pattern?

It centralizes communication between multiple objects to reduce direct dependencies between them.

### Q25. What is Visitor Pattern?

It allows new operations to be added to existing object structures without modifying their element classes.

### Q26. What is the difference between Strategy and State?

Strategy selects an interchangeable algorithm. State changes an object's behavior based on its internal state.

### Q27. What is the difference between Command and Strategy?

Command represents an action as an object. Strategy represents an interchangeable algorithm.

### Q28. What is Dependency Injection?

It is a technique in which an object's dependencies are provided externally rather than created internally.

### Q29. What is Service Locator?

It is a central registry from which classes retrieve their dependencies.

### Q30. Which is better: Dependency Injection or Service Locator?

Dependency Injection is generally preferred because dependencies are explicit and easier to test.

---

# 28. Practical Exercises

Implement the following exercises using TypeScript.

## Exercise 1: Abstract Factory

Create a database factory supporting:

- MySQL.
- MongoDB.

Each factory should create:

- Database connection.
- Database query executor.

## Exercise 2: Builder

Create a `ReportBuilder` that supports:

- Report title.
- Author.
- Description.
- Creation date.
- Sections.
- Export format.

The `build()` method should validate required properties.

## Exercise 3: Prototype

Create a `Product` object and implement a cloning mechanism.

Verify the difference between shallow and deep cloning.

## Exercise 4: Decorator

Create a logging decorator for an API service.

Add:

- Request logging.
- Response logging.
- Execution time tracking.

## Exercise 5: Facade

Create a `RegistrationFacade` that coordinates:

- User creation.
- Email verification.
- Welcome email.
- User activity logging.

## Exercise 6: Proxy

Create a caching proxy for a user service.

Requirements:

- Fetch user from the database on the first request.
- Cache the result.
- Return cached data on subsequent requests.
- Support cache invalidation.

## Exercise 7: Composite

Create an organization hierarchy.

Each department can contain:

- Employees.
- Other departments.

Calculate the total number of employees.

## Exercise 8: Observer

Create a notification system.

When a new order is placed:

- Notify the customer.
- Notify the admin.
- Update analytics.

Allow subscribers to unsubscribe.

## Exercise 9: Command

Create a shopping cart with commands:

- Add product.
- Remove product.
- Update quantity.
- Undo previous operation.

## Exercise 10: State

Implement an order lifecycle:

```text
Pending
   |
Confirmed
   |
Processing
   |
Shipped
   |
Delivered
```

Prevent invalid state transitions.

## Exercise 11: Chain of Responsibility

Create an Express-style request pipeline:

```text
Authentication
      |
Authorization
      |
Validation
      |
Controller
```

Each handler should stop the request when validation fails.

## Exercise 12: Mediator

Create a chat room where multiple users communicate through a central mediator.

---

# 29. Phase 28 Completion Checklist

Before moving forward, make sure you understand the following:

**Creational Patterns**
- [ ] Abstract Factory
- [ ] Builder
- [ ] Prototype
- [ ] Factory Method vs Abstract Factory

**Structural Patterns**
- [ ] Decorator
- [ ] Facade
- [ ] Proxy
- [ ] Composite
- [ ] Bridge
- [ ] Adapter vs Bridge vs Decorator vs Proxy

**Behavioral Patterns**
- [ ] Observer
- [ ] Pub/Sub
- [ ] Command
- [ ] State
- [ ] Chain of Responsibility
- [ ] Iterator
- [ ] Template Method
- [ ] Mediator
- [ ] Visitor
- [ ] Strategy vs State vs Command

**Architecture**
- [ ] Dependency Injection
- [ ] Service Locator
- [ ] Pattern selection
- [ ] Real-world pattern combinations

---

# 30. What Comes Next?

## Phase 29: Advanced TypeScript Architecture – Hexagonal Architecture, CQRS, Event-Driven Architecture, and Domain-Driven Design

In the next phase, we will cover:

1. What is Hexagonal Architecture?
2. What is Ports and Adapters Architecture?
3. What are Ports?
4. What are Adapters?
5. Primary and Secondary Adapters.
6. What is Domain-Driven Design (DDD)?
7. Entities and Value Objects.
8. Aggregates and Aggregate Roots.
9. Repositories in DDD.
10. Domain Services.
11. Application Services.
12. Domain Events.
13. What is CQRS?
14. Command Models vs Query Models.
15. Command Handlers.
16. Query Handlers.
17. What is Event-Driven Architecture?
18. Event Producers and Consumers.
19. Event Bus.
20. Eventual Consistency.
21. CQRS vs CRUD.
22. Event Sourcing fundamentals.
23. Clean Architecture vs Hexagonal Architecture.
24. Implementing these architectures using TypeScript and Node.js.
25. Real-world backend architecture.

**Phase 28 is complete.** When you're ready, say **"OK, Phase 29"** to continue.