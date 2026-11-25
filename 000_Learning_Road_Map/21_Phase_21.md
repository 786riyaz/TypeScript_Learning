# Phase 21: Advanced TypeScript – Classes, Abstract Classes, and Object-Oriented Programming

**Level:** Advanced  
**Prerequisites:**
- Phase 6: Objects and Object Types
- Phase 8: Type Aliases
- Phase 9: Interfaces
- Phase 10: Union and Intersection Types
- Phase 14: Generics
- Phase 20: Advanced Function Types

## Learning Objectives

By the end of this phase, you will understand:

1. Classes in TypeScript.
2. Constructors and initialization.
3. Access modifiers: `public`, `private`, and `protected`.
4. Readonly class properties.
5. Parameter properties.
6. Getters and setters.
7. Inheritance and method overriding.
8. Abstract classes and abstract methods.
9. Interfaces with classes.
10. Static properties and methods.
11. Implementing multiple interfaces.
12. Method overloading in classes.
13. Polymorphism.
14. Composition vs inheritance.
15. Generics with classes.
16. Real-world OOP architecture.

---

# 1. What Is a Class?

A class is a blueprint for creating objects.

It defines:

- Properties (data).
- Methods (behavior).
- Constructors (initialization logic).

TypeScript supports object-oriented programming through classes.

### JavaScript example

```javascript
class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    introduce() {
        console.log(`My name is ${this.name}`);
    }
}

const user = new User("Riyaz", 25);

user.introduce();
```

### TypeScript example

```typescript
class User {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    introduce(): void {
        console.log(`My name is ${this.name}`);
    }
}

const user = new User("Riyaz", 25);

user.introduce();
```

### Understanding the syntax

```typescript
class User {
    name: string;
    age: number;
}
```

We define a class named `User` with two properties.

```typescript
constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
}
```

The constructor initializes the object when it is created.

```typescript
const user = new User("Riyaz", 25);
```

The `new` keyword creates an instance of the class.

### Important terminology

| Term | Meaning |
|---|---|
| Class | Blueprint for creating objects |
| Object | An instance of a class |
| Instance | A specific object created from a class |
| Property | Data belonging to an object |
| Method | Function belonging to a class |
| Constructor | Special method used to initialize an instance |

---

# 2. Class Properties and Type Annotations

In TypeScript, class properties can have explicit types.

```typescript
class Product {
    id: number;
    title: string;
    price: number;
    inStock: boolean;

    constructor(
        id: number,
        title: string,
        price: number,
        inStock: boolean
    ) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.inStock = inStock;
    }
}
```

Usage:

```typescript
const product = new Product(
    1,
    "Laptop",
    50000,
    true
);
```

Accessing properties:

```typescript
console.log(product.title);
console.log(product.price);
```

### Property initialization

Consider:

```typescript
class User {
    name: string;
}
```

With strict property initialization enabled, TypeScript reports an error because `name` is not initialized.

There are several ways to solve this.

**Method 1: Initialize directly**

```typescript
class User {
    name: string = "Guest";
}
```

**Method 2: Initialize through the constructor**

```typescript
class User {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}
```

**Method 3: Make the property optional**

```typescript
class User {
    name?: string;
}
```

Now `name` can be undefined.

**Method 4: Definite assignment assertion**

```typescript
class User {
    name!: string;
}
```

The `!` tells TypeScript that the property will be initialized through some mechanism that the compiler cannot verify.

Use it carefully. It does not initialize the property at runtime.

---

# 3. Constructors in TypeScript

A constructor is a special method that runs automatically when an object is created.

### Syntax

```typescript
class ClassName {
    constructor(parameters) {
        // Initialization
    }
}
```

### Example

```typescript
class Employee {
    name: string;
    salary: number;

    constructor(name: string, salary: number) {
        this.name = name;
        this.salary = salary;
    }
}

const employee = new Employee("Ahmed", 50000);
```

### Important constructor rules

1. A class can have only one constructor implementation.
2. Constructors cannot declare a return type.
3. Constructors execute when an instance is created.
4. A constructor can accept parameters.
5. A constructor can call methods and initialize properties.

### Constructor with default parameters

```typescript
class User {
    name: string;
    role: string;

    constructor(
        name: string,
        role: string = "USER"
    ) {
        this.name = name;
        this.role = role;
    }
}

const user1 = new User("Riyaz");

const user2 = new User("Ahmed", "ADMIN");
```

### Constructor with optional parameters

```typescript
class User {
    constructor(
        public name: string,
        public age?: number
    ) {}
}
```

Here, `age` is optional.

---

# 4. Access Modifiers in TypeScript

Access modifiers control where class members can be accessed.

TypeScript provides three primary access modifiers:

1. `public`
2. `private`
3. `protected`

## A. Public

A `public` member can be accessed from anywhere.

It is also the default access level when no modifier is specified.

```typescript
class User {
    public name: string;

    constructor(name: string) {
        this.name = name;
    }
}

const user = new User("Riyaz");

console.log(user.name);
```

This is valid.

The following declarations are equivalent:

```typescript
class User {
    name: string;
}
```

```typescript
class User {
    public name: string;
}
```

## B. Private

A `private` member can only be accessed inside the declaring class.

```typescript
class BankAccount {
    private balance: number = 10000;

    getBalance(): number {
        return this.balance;
    }
}

const account = new BankAccount();

console.log(account.getBalance());

// Error
console.log(account.balance);
```

Why?

Because `balance` is private.

It cannot be accessed directly outside the class.

### Modifying private properties

```typescript
class BankAccount {
    private balance: number = 10000;

    deposit(amount: number): void {
        this.balance += amount;
    }

    getBalance(): number {
        return this.balance;
    }
}

const account = new BankAccount();

account.deposit(5000);

console.log(account.getBalance());
```

Output:

```text
15000
```

The balance is modified through a public method.

## C. Protected

A `protected` member can be accessed:

- Inside the declaring class.
- Inside subclasses.

It cannot be accessed directly through an instance.

```typescript
class Person {
    protected name: string;

    constructor(name: string) {
        this.name = name;
    }
}

class Employee extends Person {
    displayName(): void {
        console.log(this.name);
    }
}

const employee = new Employee("Riyaz");

employee.displayName();

// Error
console.log(employee.name);
```

The subclass can access `name` because it is protected.

### Comparison

| Modifier | Inside class | Subclass | Outside class |
|---|---|---|---|
| public | Yes | Yes | Yes |
| private | Yes | No | No |
| protected | Yes | Yes | No |

### Important: TypeScript `private` vs JavaScript `#private`

TypeScript's `private` modifier is primarily a compile-time restriction.

```typescript
class User {
    private password: string = "secret";
}
```

It does not provide the same runtime privacy guarantee as JavaScript's `#private` fields.

For actual JavaScript runtime private fields:

```typescript
class User {
    #password: string = "secret";

    verifyPassword(value: string): boolean {
        return this.#password === value;
    }
}
```

Now JavaScript enforces the private field restriction at runtime.

### Comparison

| TypeScript `private` | JavaScript `#private` |
|---|---|
| TypeScript access restriction | JavaScript runtime restriction |
| Usually erased as a modifier during compilation | Remains a private field in JavaScript |
| Can be bypassed through certain type-system escape hatches | Cannot be accessed normally outside the declaring class |
| Useful for TypeScript encapsulation | Useful for runtime encapsulation |

**Best practice:** Use TypeScript `private` for ordinary compile-time encapsulation. Use `#private` when runtime privacy is required.

---

# 5. Readonly Properties in Classes

The `readonly` modifier prevents a property from being reassigned after initialization.

### Example

```typescript
class User {
    readonly id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}
```

Usage:

```typescript
const user = new User(1, "Riyaz");

user.name = "Ahmed"; // Allowed

user.id = 2; // Error
```

### Important rules

- A readonly property can be initialized at declaration.
- It can also be initialized in the constructor.
- It cannot normally be reassigned afterward.
- It does not automatically make nested objects deeply readonly.
- It is a TypeScript compile-time restriction, not runtime freezing.

### Example with an object

```typescript
class User {
    readonly profile: {
        name: string;
    } = {
        name: "Riyaz"
    };
}
```

This is allowed:

```typescript
const user = new User();

user.profile.name = "Ahmed";
```

But this is not:

```typescript
user.profile = {
    name: "Ahmed"
};
```

The property reference is readonly, but the nested object remains mutable.

---

# 6. Parameter Properties

Parameter properties provide a shorter way to declare and initialize class properties through constructor parameters.

### Traditional approach

```typescript
class User {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}
```

### Using parameter properties

```typescript
class User {
    constructor(
        public name: string,
        public age: number
    ) {}
}
```

Both examples define the same public properties.

### Parameter properties with access modifiers

```typescript
class User {
    constructor(
        public name: string,
        private password: string,
        protected age: number,
        readonly id: number
    ) {}
}
```

Usage:

```typescript
const user = new User(
    "Riyaz",
    "secret",
    25,
    1
);

console.log(user.name);
console.log(user.id);
```

The `password` and `age` properties cannot be accessed directly outside the class.

### Parameter properties can use

- `public`
- `private`
- `protected`
- `readonly`

They reduce boilerplate code.

**Important:** A normal constructor parameter does not automatically become a class property.

For example:

```typescript
class User {
    constructor(name: string) {
        // name is only a constructor parameter
    }
}
```

To create a property, use a parameter property or explicitly declare and assign one.

---

# 7. Getters and Setters

Getters and setters allow controlled access to class properties.

- A getter retrieves a value.
- A setter modifies a value.

They are useful when you want to apply validation or additional logic during property access.

## A. Getter

```typescript
class User {
    private _name: string = "Riyaz";

    get name(): string {
        return this._name;
    }
}
```

Usage:

```typescript
const user = new User();

console.log(user.name);
```

Notice that we access it like a property:

```typescript
user.name
```

We do not call it like a method:

```typescript
user.name()
```

## B. Setter

```typescript
class User {
    private _name: string = "Riyaz";

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }
}
```

Usage:

```typescript
const user = new User();

user.name = "Ahmed";

console.log(user.name);
```

### Getter and setter with validation

```typescript
class BankAccount {
    private _balance: number = 0;

    get balance(): number {
        return this._balance;
    }

    set balance(value: number) {
        if (value < 0) {
            throw new Error("Balance cannot be negative");
        }

        this._balance = value;
    }
}
```

Usage:

```typescript
const account = new BankAccount();

account.balance = 10000;

console.log(account.balance);
```

Invalid assignment:

```typescript
account.balance = -5000;
```

This throws an error.

### Important rules

1. A getter must return a value.
2. A setter accepts exactly one parameter.
3. Getter and setter types must be compatible.
4. A setter does not have a return type.
5. A property with only a getter is effectively readonly from ordinary external code.

---

# 8. Inheritance in TypeScript

Inheritance allows one class to reuse properties and methods from another class.

TypeScript uses the `extends` keyword.

### Parent class

```typescript
class Animal {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    eat(): void {
        console.log(`${this.name} is eating`);
    }
}
```

### Child class

```typescript
class Dog extends Animal {
    bark(): void {
        console.log(`${this.name} is barking`);
    }
}
```

Usage:

```typescript
const dog = new Dog("Tommy");

dog.eat();

dog.bark();
```

Output:

```text
Tommy is eating
Tommy is barking
```

The `Dog` class inherits:

- The `name` property.
- The `eat()` method.

It also defines its own `bark()` method.

### Important terminology

| Term | Meaning |
|---|---|
| Parent class | Class being inherited from |
| Child class | Class that inherits another class |
| Base class | Another name for parent class |
| Derived class | Another name for child class |
| `extends` | Keyword used for class inheritance |

### Important rule

TypeScript classes support single class inheritance.

A class cannot extend multiple classes directly.

However, it can implement multiple interfaces.

---

# 9. Using `super` in Inheritance

The `super` keyword allows a child class to access the parent class's constructor and methods.

### A. Calling the parent constructor

```typescript
class Animal {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

class Dog extends Animal {
    breed: string;

    constructor(name: string, breed: string) {
        super(name);

        this.breed = breed;
    }
}
```

Usage:

```typescript
const dog = new Dog("Tommy", "Labrador");

console.log(dog.name);
console.log(dog.breed);
```

### Why use `super(name)`?

The parent class already handles initialization of `name`.

Instead of duplicating that logic, the child class calls the parent constructor.

### Important rule

If a derived class defines its own constructor, it must call `super()` before accessing `this`.

Incorrect:

```typescript
class Animal {
    constructor(public name: string) {}
}

class Dog extends Animal {
    constructor(name: string) {
        this.name = name; // Error

        super(name);
    }
}
```

Correct:

```typescript
class Dog extends Animal {
    constructor(name: string) {
        super(name);
    }
}
```

### B. Calling a parent method

```typescript
class Animal {
    eat(): void {
        console.log("Animal is eating");
    }
}

class Dog extends Animal {
    eat(): void {
        super.eat();

        console.log("Dog is eating");
    }
}
```

Usage:

```typescript
const dog = new Dog();

dog.eat();
```

Output:

```text
Animal is eating
Dog is eating
```

---

# 10. Method Overriding

Method overriding occurs when a child class provides its own implementation of a method inherited from its parent.

### Example

```typescript
class Animal {
    makeSound(): void {
        console.log("Animal makes a sound");
    }
}

class Dog extends Animal {
    override makeSound(): void {
        console.log("Dog barks");
    }
}
```

Usage:

```typescript
const dog = new Dog();

dog.makeSound();
```

Output:

```text
Dog barks
```

### Understanding `override`

The `override` keyword explicitly indicates that a method is intended to override a member inherited from a base class.

It helps TypeScript catch mistakes.

For example:

```typescript
class Dog extends Animal {
    override makeSounds(): void {
        console.log("Dog barks");
    }
}
```

This produces an error because `makeSounds()` does not override an existing member.

### Enable explicit override checking

You can configure:

```json
{
    "compilerOptions": {
        "noImplicitOverride": true
    }
}
```

This requires the `override` modifier when overriding inherited members.

### Overriding rules

- The child method must be compatible with the inherited method.
- It cannot arbitrarily change the method's contract.
- It can provide a more specific return type when assignability permits.
- Use `override` to make the intention explicit.

---

# 11. Abstract Classes

An abstract class is a class that cannot be instantiated directly.

It is designed to be extended by other classes.

It can contain:

- Normal properties.
- Normal methods.
- Constructors.
- Abstract methods.

### Example

```typescript
abstract class Animal {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    eat(): void {
        console.log(`${this.name} is eating`);
    }

    abstract makeSound(): void;
}
```

Notice:

```typescript
abstract makeSound(): void;
```

This is an abstract method.

It has no implementation in the abstract class.

### Child class

```typescript
class Dog extends Animal {
    makeSound(): void {
        console.log("Dog barks");
    }
}
```

Usage:

```typescript
const dog = new Dog("Tommy");

dog.eat();

dog.makeSound();
```

### Cannot instantiate abstract classes

```typescript
const animal = new Animal("Animal");
```

This produces an error.

Because `Animal` is abstract.

### Important rules

1. Abstract classes cannot be instantiated directly.
2. They can contain both abstract and concrete methods.
3. A non-abstract child class must implement inherited abstract members.
4. Abstract classes can have constructors.
5. Abstract classes can define access modifiers.
6. Abstract classes can implement interfaces.

---

# 12. Abstract Properties

Abstract classes can also define abstract properties.

### Example

```typescript
abstract class Employee {
    abstract name: string;

    abstract calculateSalary(): number;

    displayName(): void {
        console.log(this.name);
    }
}
```

Child class:

```typescript
class Developer extends Employee {
    name: string;

    constructor(name: string) {
        super();

        this.name = name;
    }

    calculateSalary(): number {
        return 80000;
    }
}
```

Usage:

```typescript
const developer = new Developer("Riyaz");

developer.displayName();

console.log(developer.calculateSalary());
```

The child class must provide the required abstract members.

### Abstract properties with readonly

```typescript
abstract class User {
    abstract readonly id: number;
}
```

A concrete subclass must provide a compatible implementation.

---

# 13. Interfaces with Classes

An interface defines a contract.

A class can implement that contract using the `implements` keyword.

### Example

```typescript
interface User {
    id: number;
    name: string;

    introduce(): void;
}
```

Class implementation:

```typescript
class Customer implements User {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    introduce(): void {
        console.log(`My name is ${this.name}`);
    }
}
```

Usage:

```typescript
const customer = new Customer(1, "Riyaz");

customer.introduce();
```

### What does `implements` do?

It checks whether the class satisfies the interface's instance-side contract.

It does not automatically create properties or methods.

For example:

```typescript
interface User {
    name: string;
}

class Customer implements User {
    // Error: name is missing
}
```

You must implement the property yourself.

### Important distinction

```typescript
class Dog extends Animal {}
```

`extends` means inheritance.

```typescript
class Customer implements User {}
```

`implements` means contract checking.

---

# 14. Implementing Multiple Interfaces

A class can implement multiple interfaces.

### Example

```typescript
interface Printable {
    print(): void;
}

interface Downloadable {
    download(): void;
}
```

Now:

```typescript
class Document implements Printable, Downloadable {
    print(): void {
        console.log("Printing document");
    }

    download(): void {
        console.log("Downloading document");
    }
}
```

Usage:

```typescript
const document = new Document();

document.print();

document.download();
```

### Syntax

```typescript
class ClassName implements Interface1, Interface2, Interface3 {
    // Implement all required members
}
```

### Important

A class can:

- Extend one class.
- Implement multiple interfaces.

Example:

```typescript
class Child extends Parent implements Interface1, Interface2 {}
```

---

# 15. Static Properties and Methods

Static members belong to the class itself rather than individual instances.

Use the `static` keyword.

### Example

```typescript
class MathUtility {
    static PI: number = 3.14159;

    static square(value: number): number {
        return value * value;
    }
}
```

Usage:

```typescript
console.log(MathUtility.PI);

console.log(MathUtility.square(5));
```

You access static members through the class name.

Not through an instance:

```typescript
const utility = new MathUtility();

// Error
console.log(utility.PI);
```

### Instance members vs static members

```typescript
class User {
    static totalUsers: number = 0;

    constructor(public name: string) {
        User.totalUsers++;
    }

    introduce(): void {
        console.log(this.name);
    }

    static getTotalUsers(): number {
        return User.totalUsers;
    }
}
```

Usage:

```typescript
const user1 = new User("Riyaz");

const user2 = new User("Ahmed");

console.log(User.getTotalUsers());
```

Output:

```text
2
```

### Comparison

| Instance member | Static member |
|---|---|
| Belongs to an instance | Belongs to the class |
| Accessed using an object | Accessed using class name |
| Can use instance `this` | Cannot use instance `this` |
| Each instance has its own instance state | Shared through the class itself |

### Important

A static method cannot directly access instance properties.

```typescript
class User {
    name: string = "Riyaz";

    static showName(): void {
        // Error: instance property is not accessible here
        // console.log(this.name);
    }
}
```

Static methods can access other static members through `this`.

---

# 16. Static Blocks

TypeScript supports JavaScript static initialization blocks.

They allow complex static initialization logic.

### Example

```typescript
class Configuration {
    static environment: string;

    static {
        const isProduction = false;

        Configuration.environment = isProduction
            ? "production"
            : "development";
    }
}
```

Usage:

```typescript
console.log(Configuration.environment);
```

Output:

```text
development
```

### Why use static blocks?

They are useful when:

- Static initialization requires multiple steps.
- You need conditional initialization.
- You want to initialize related static properties together.

Static blocks execute when the class is initialized.

---

# 17. Method Overloading in Classes

Just like ordinary functions, class methods can have multiple overload signatures.

### Example

```typescript
class Calculator {
    add(a: number, b: number): number;

    add(a: string, b: string): string;

    add(
        a: number | string,
        b: number | string
    ): number | string {
        if (typeof a === "number" && typeof b === "number") {
            return a + b;
        }

        if (typeof a === "string" && typeof b === "string") {
            return a + b;
        }

        throw new Error("Invalid arguments");
    }
}
```

Usage:

```typescript
const calculator = new Calculator();

const result1 = calculator.add(10, 20);

const result2 = calculator.add("Hello ", "World");
```

Inferred types:

```typescript
const result1: number;

const result2: string;
```

Invalid usage:

```typescript
calculator.add(10, "Hello");
```

This is rejected because no overload supports that combination.

### Important

Like normal function overloads:

- Multiple overload signatures are allowed.
- One implementation is provided.
- The implementation signature is not directly available to callers.

---

# 18. Polymorphism

Polymorphism means that different classes can provide different implementations of the same interface or inherited method.

In simple terms:

**One common contract can have multiple implementations.**

### Example

```typescript
abstract class Animal {
    abstract makeSound(): void;
}

class Dog extends Animal {
    makeSound(): void {
        console.log("Bark");
    }
}

class Cat extends Animal {
    makeSound(): void {
        console.log("Meow");
    }
}
```

Now:

```typescript
function playSound(animal: Animal): void {
    animal.makeSound();
}
```

Usage:

```typescript
const dog = new Dog();

const cat = new Cat();

playSound(dog);

playSound(cat);
```

Output:

```text
Bark
Meow
```

The same function works with different object types.

### Why is this useful?

Suppose you build a payment system.

You might have:

- CreditCardPayment.
- UpiPayment.
- WalletPayment.

Each payment method implements the same payment contract.

Your application can work with the common contract rather than depending on individual implementations.

---

# 19. Composition vs Inheritance

Both composition and inheritance help organize and reuse code.

However, they solve problems differently.

## A. Inheritance

Inheritance creates an "is-a" relationship.

Example:

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

A dog is an animal.

Therefore, inheritance makes sense.

## B. Composition

Composition creates a "has-a" relationship.

Instead of inheriting behavior, a class receives or uses another object.

### Example

```typescript
class Engine {
    start(): void {
        console.log("Engine started");
    }
}

class Car {
    private engine: Engine;

    constructor(engine: Engine) {
        this.engine = engine;
    }

    start(): void {
        this.engine.start();

        console.log("Car started");
    }
}
```

Usage:

```typescript
const engine = new Engine();

const car = new Car(engine);

car.start();
```

A car has an engine.

It is not an engine.

Therefore, composition is a better model.

### Comparison

| Inheritance | Composition |
|---|---|
| Represents an is-a relationship | Represents a has-a relationship |
| Uses `extends` | Uses object references or dependencies |
| Creates a parent-child hierarchy | Combines independent components |
| Can tightly couple classes | Often provides looser coupling |
| Useful for genuine specialization | Useful for reusable behavior |

### Professional recommendation

Prefer composition when it provides a simpler and more flexible design.

Use inheritance when there is a genuine subtype relationship.

---

# 20. Generics with Classes

TypeScript supports generic classes.

This allows a class to work with different types while preserving type safety.

### Example

```typescript
class Box<T> {
    value: T;

    constructor(value: T) {
        this.value = value;
    }

    getValue(): T {
        return this.value;
    }
}
```

Usage:

```typescript
const numberBox = new Box<number>(100);

const stringBox = new Box<string>("Hello");
```

Inferred return types:

```typescript
number

string
```

### Type inference

You don't always need to specify the generic argument.

```typescript
const numberBox = new Box(100);

const stringBox = new Box("Hello");
```

TypeScript infers the types.

### Generic class with multiple parameters

```typescript
class Pair<T, U> {
    constructor(
        public first: T,
        public second: U
    ) {}
}
```

Usage:

```typescript
const pair = new Pair<string, number>(
    "Age",
    25
);
```

### Generic class with constraints

```typescript
interface HasId {
    id: number;
}

class Repository<T extends HasId> {
    constructor(private items: T[]) {}

    findById(id: number): T | undefined {
        return this.items.find(item => item.id === id);
    }
}
```

Usage:

```typescript
type User = {
    id: number;
    name: string;
};

const users: User[] = [
    { id: 1, name: "Riyaz" },
    { id: 2, name: "Ahmed" }
];

const repository = new Repository(users);

const user = repository.findById(1);
```

The generic constraint ensures that every stored item has an `id`.

---

# 21. Class Types and the `typeof` Operator

An important TypeScript concept is that a class has two related sides:

1. Instance side.
2. Static side.

Consider:

```typescript
class User {
    static role = "CUSTOMER";

    constructor(public name: string) {}

    introduce(): void {
        console.log(this.name);
    }
}
```

### Instance type

```typescript
type UserInstance = User;
```

This represents an object created from the class.

It contains:

- `name`
- `introduce()`

### Constructor and static side

```typescript
type UserConstructor = typeof User;
```

This represents the class value itself.

It includes:

- The constructor signature.
- Static members such as `role`.

### Example

```typescript
const user: User = new User("Riyaz");

const UserClass: typeof User = User;
```

### Important distinction

| Expression | Meaning |
|---|---|
| `User` as a type | Instance type |
| `typeof User` | Type of the class value |
| `new User()` | Creates an instance |
| `User.role` | Accesses a static member |

This distinction is especially useful when passing classes as constructor arguments.

---

# 22. Constructor Types

Sometimes you want a function that accepts a class constructor and creates an instance.

TypeScript allows us to describe constructor signatures using `new`.

### Example

```typescript
type Constructor<T> = new (...args: any[]) => T;
```

This represents a constructor that creates an instance of type `T`.

### Generic factory function

```typescript
function createInstance<T>(
    ClassType: new (...args: any[]) => T,
    ...args: any[]
): T {
    return new ClassType(...args);
}
```

Usage:

```typescript
class User {
    constructor(public name: string) {}
}

const user = createInstance(User, "Riyaz");
```

Result:

```typescript
User
```

### Better parameter preservation with variadic tuples

```typescript
function createInstance<
    T,
    A extends unknown[]
>(
    ClassType: new (...args: A) => T,
    ...args: A
): T {
    return new ClassType(...args);
}
```

Now the constructor arguments are linked to the class constructor signature.

Usage:

```typescript
class Product {
    constructor(
        public title: string,
        public price: number
    ) {}
}

const product = createInstance(
    Product,
    "Laptop",
    50000
);
```

Incorrect arguments produce errors:

```typescript
createInstance(Product, 50000, "Laptop");
```

This is useful for dependency injection, factories, and class-based frameworks.

---

# 23. `implements` vs `extends` vs Abstract Classes

These concepts are related but serve different purposes.

| Feature | `extends` | `implements` | Abstract class |
|---|---|---|---|
| Purpose | Inheritance | Contract checking | Shared base design |
| Can contain implementation | Yes | Interface itself cannot | Yes |
| Can contain abstract methods | An abstract parent can | No interface method implementation | Yes |
| Can be instantiated | Depends on class | Not applicable | No, if abstract |
| Multiple supported | One class | Multiple interfaces | One class can extend one abstract class |
| Runtime presence | Yes | Interface is erased | Yes |

### Example combining all three

```typescript
interface Identifiable {
    id: number;
}

abstract class Person {
    constructor(public name: string) {}

    abstract introduce(): void;
}

class Employee extends Person implements Identifiable {
    constructor(
        public id: number,
        name: string
    ) {
        super(name);
    }

    introduce(): void {
        console.log(`Employee: ${this.name}`);
    }
}
```

This combines:

- Interface contract.
- Abstract base class.
- Concrete implementation.
- Inheritance.

---

# 24. Real-World Example: Payment Processing System

Let's create a small payment architecture using TypeScript classes.

### Step 1: Define a payment interface

```typescript
interface PaymentMethod {
    pay(amount: number): boolean;
}
```

### Step 2: Implement UPI payment

```typescript
class UpiPayment implements PaymentMethod {
    pay(amount: number): boolean {
        console.log(`Paid ₹${amount} using UPI`);

        return true;
    }
}
```

### Step 3: Implement card payment

```typescript
class CardPayment implements PaymentMethod {
    pay(amount: number): boolean {
        console.log(`Paid ₹${amount} using Card`);

        return true;
    }
}
```

### Step 4: Create a payment service

```typescript
class PaymentService {
    constructor(
        private paymentMethod: PaymentMethod
    ) {}

    processPayment(amount: number): boolean {
        if (amount <= 0) {
            throw new Error("Invalid payment amount");
        }

        return this.paymentMethod.pay(amount);
    }
}
```

### Step 5: Use the system

```typescript
const upiPayment = new UpiPayment();

const paymentService = new PaymentService(upiPayment);

paymentService.processPayment(1000);
```

Now change the payment method:

```typescript
const cardPayment = new CardPayment();

const cardService = new PaymentService(cardPayment);

cardService.processPayment(2000);
```

### Why is this architecture useful?

The `PaymentService` does not need to know how UPI or card payments work.

It only depends on the `PaymentMethod` interface.

This is an example of dependency injection and programming against an abstraction.

In a larger application, this design makes it easier to add new payment methods without changing the payment service.

**Important:** This example demonstrates architecture and type safety. A production payment system would also require secure provider integration, transaction verification, idempotency, error handling, and persistence.

---

# 25. Common Mistakes

### Mistake 1: Forgetting to initialize properties

Incorrect:

```typescript
class User {
    name: string;
}
```

With strict property initialization enabled, this produces an error.

### Mistake 2: Using `private` when subclasses need access

If child classes need to access a property, consider `protected`.

### Mistake 3: Thinking `implements` creates class members

It only checks that the class provides the required members.

### Mistake 4: Forgetting `super()`

When a derived class has a constructor, it must call `super()` before accessing `this`.

### Mistake 5: Trying to instantiate an abstract class

Abstract classes cannot be instantiated directly.

### Mistake 6: Accessing static members through instances

Incorrect:

```typescript
class User {
    static role = "ADMIN";
}

const user = new User();

// Incorrect
// user.role
```

Correct:

```typescript
User.role;
```

### Mistake 7: Confusing overriding and overloading

- Overriding replaces inherited behavior in a subclass.
- Overloading provides multiple supported call signatures.

### Mistake 8: Using inheritance for every kind of code reuse

Not every relationship should be modeled with inheritance.

Consider composition when a class simply needs another object's behavior.

### Mistake 9: Assuming readonly means deeply immutable

`readonly` restricts reassignment of the property, not necessarily mutations inside nested objects.

### Mistake 10: Assuming TypeScript `private` guarantees runtime privacy

Use JavaScript `#private` fields when runtime enforcement is required.

---

# 26. Interview Questions and Answers

### Q1. What is a class in TypeScript?

A class is a blueprint for creating objects. It defines properties, methods, and initialization behavior.

### Q2. What is a constructor?

A constructor is a special method that runs when an instance is created. It is commonly used to initialize object properties.

### Q3. What are access modifiers?

Access modifiers control where class members can be accessed.

TypeScript provides `public`, `private`, and `protected`.

### Q4. What is the difference between private and protected?

`private` members are accessible only inside the declaring class.

`protected` members are accessible inside the declaring class and its subclasses.

### Q5. What is the difference between TypeScript private and JavaScript private fields?

TypeScript `private` is primarily a compile-time restriction.

JavaScript `#private` fields provide runtime privacy enforcement.

### Q6. What are parameter properties?

Parameter properties allow constructor parameters to declare and initialize class properties using modifiers such as `public`, `private`, `protected`, and `readonly`.

### Q7. What are getters and setters?

Getters retrieve property values, while setters modify them. They are useful for validation and controlled property access.

### Q8. What is inheritance?

Inheritance allows a class to reuse and extend the behavior of another class using `extends`.

### Q9. What is the purpose of `super()`?

`super()` calls the parent class constructor from a child class constructor.

### Q10. What is method overriding?

Method overriding occurs when a child class provides its own implementation of an inherited method.

### Q11. What is an abstract class?

An abstract class is a class that cannot be instantiated directly. It can provide shared implementation and require subclasses to implement abstract members.

### Q12. Can an abstract class contain normal methods?

Yes. It can contain both abstract methods and methods with implementations.

### Q13. What is the difference between `implements` and `extends`?

`extends` creates an inheritance relationship.

`implements` checks whether a class satisfies an interface contract.

### Q14. Can a class implement multiple interfaces?

Yes. A class can implement multiple interfaces.

### Q15. What are static members?

Static properties and methods belong to the class itself rather than individual instances.

### Q16. What is polymorphism?

Polymorphism allows different classes to provide different implementations of a common contract or inherited method.

### Q17. What is composition?

Composition is a design approach in which a class uses other objects to provide functionality instead of inheriting all behavior.

### Q18. What is the difference between composition and inheritance?

Inheritance represents an is-a relationship.

Composition represents a has-a relationship.

### Q19. What is `typeof ClassName`?

It extracts the type of the class value, including its constructor signature and static members.

### Q20. What is a constructor signature?

A constructor signature describes the parameters accepted by a class constructor and the type of instance it creates.

---

# 27. Practical Exercises

Complete these exercises to strengthen your understanding.

## Exercise 1: Create a User Class

Create a `User` class with:

- `id`
- `name`
- `email`
- `age`

Add a constructor and an `introduce()` method.

## Exercise 2: Access Modifiers

Create a `BankAccount` class with:

- A private `balance` property.
- A public `deposit()` method.
- A public `withdraw()` method.
- A public `getBalance()` method.

Prevent withdrawals that exceed the available balance.

## Exercise 3: Readonly Properties

Create a `Product` class with:

- Readonly `id`.
- Mutable `name`.
- Mutable `price`.

Ensure that the ID cannot be reassigned after initialization.

## Exercise 4: Parameter Properties

Rewrite Exercise 1 using parameter properties.

## Exercise 5: Getters and Setters

Create an `Employee` class with:

- A private `_salary` property.
- A getter for salary.
- A setter that rejects negative values.

## Exercise 6: Inheritance

Create:

- A parent class `Animal`.
- A child class `Dog`.
- A child class `Cat`.

Add a common `eat()` method and different sound methods.

## Exercise 7: Method Overriding

Create a parent class `Vehicle` with a `start()` method.

Override the method in:

- `Car`
- `Bike`
- `Truck`

## Exercise 8: Abstract Classes

Create an abstract class `Shape` with an abstract `calculateArea()` method.

Implement it in:

- `Circle`
- `Rectangle`
- `Triangle`

## Exercise 9: Multiple Interfaces

Create:

- `Printable`
- `Downloadable`
- `Shareable`

Create a `Document` class that implements all three.

## Exercise 10: Static Members

Create a `User` class that tracks the total number of instances created.

Use a static property and static method.

## Exercise 11: Method Overloading

Create a `Calculator` class with an overloaded `multiply()` method that supports:

- Two numbers.
- Three numbers.
- Two strings.

Define appropriate return types and implementations.

## Exercise 12: Polymorphism

Create a common `PaymentMethod` interface.

Implement:

- `UpiPayment`
- `CardPayment`
- `WalletPayment`

Create one service that accepts any `PaymentMethod`.

## Exercise 13: Composition

Create:

- `Engine`
- `MusicSystem`
- `Car`

The `Car` class should use the other two classes through composition.

## Exercise 14: Generic Repository

Create a generic `Repository<T>` class with:

- `add()`
- `findAll()`
- `findById()`
- `deleteById()`

Use a generic constraint requiring an `id` property.

---

# 28. Phase 21 Completion Checklist

| No. | Topic | Status |
|---|---|---|
| 1 | Classes and objects | ☐ |
| 2 | Class properties | ☐ |
| 3 | Constructors | ☐ |
| 4 | Strict property initialization | ☐ |
| 5 | Access modifiers | ☐ |
| 6 | TypeScript private vs JavaScript `#private` | ☐ |
| 7 | Readonly properties | ☐ |
| 8 | Parameter properties | ☐ |
| 9 | Getters and setters | ☐ |
| 10 | Inheritance | ☐ |
| 11 | `super()` | ☐ |
| 12 | Method overriding | ☐ |
| 13 | Abstract classes | ☐ |
| 14 | Abstract properties and methods | ☐ |
| 15 | Interfaces with classes | ☐ |
| 16 | Multiple interfaces | ☐ |
| 17 | Static properties and methods | ☐ |
| 18 | Static initialization blocks | ☐ |
| 19 | Method overloading in classes | ☐ |
| 20 | Polymorphism | ☐ |
| 21 | Composition vs inheritance | ☐ |
| 22 | Generic classes | ☐ |
| 23 | Instance type vs static side | ☐ |
| 24 | Constructor types | ☐ |
| 25 | Real-world OOP architecture | ☐ |

---

# What Comes Next?

## Phase 22: Advanced TypeScript – Decorators, Metadata, and Metaprogramming

In the next phase, we will explore decorators and advanced class customization.

Topics will include:

1. What are decorators?
2. Decorator fundamentals.
3. Class decorators.
4. Method decorators.
5. Property decorators.
6. Accessor decorators.
7. Parameter decorators.
8. Legacy decorators vs standard decorators.
9. Decorator factories.
10. Decorator composition.
11. Decorators with TypeScript classes.
12. Metadata and reflection concepts.
13. `reflect-metadata`.
14. Decorators in NestJS.
15. Real-world logging, validation, and authorization decorators.

**Phase 21 complete.** Say **"OK, Phase 22"** when you're ready to continue.