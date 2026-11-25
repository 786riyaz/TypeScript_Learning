# Phase 9: Interfaces in TypeScript

**Level:** Beginner to Intermediate  
**Category:** TypeScript Fundamentals

## Learning Objectives

By the end of this phase, you will understand:

1. What interfaces are and why we use them.
2. How to create interfaces using the `interface` keyword.
3. Interface property types.
4. Optional properties.
5. Readonly properties.
6. Interface methods.
7. Function types in interfaces.
8. Extending interfaces.
9. Extending multiple interfaces.
10. Interface declaration merging.
11. Interface inheritance.
12. Implementing interfaces in classes.
13. Interface vs type alias.
14. Real-world interface examples.
15. Best practices and common mistakes.

---

# 1. What Are Interfaces in TypeScript?

An **interface** is a TypeScript feature used to define the structure or contract that an object should follow.

It describes:

- Which properties an object should contain.
- What types those properties should have.
- Which properties are optional.
- Which methods an object should implement.

Consider this JavaScript object:

```javascript
const user = {
    id: 101,
    name: "Riyaz",
    age: 25
};
```

In TypeScript, we can define its structure using an interface.

```typescript
interface User {
    id: number;
    name: string;
    age: number;
}
```

Now we can use this interface to type an object.

```typescript
const user: User = {
    id: 101,
    name: "Riyaz",
    age: 25
};
```

TypeScript checks whether the object follows the `User` interface.

### Why Do We Need Interfaces?

Imagine you are building an application with multiple functions:

```typescript
function createUser(user: User) {}

function updateUser(user: User) {}

function deleteUser(user: User) {}

function displayUser(user: User) {}
```

All these functions use the same object structure.

Instead of repeatedly defining the structure, we define it once using an interface.

### Important Points

- Interfaces define contracts or structures.
- Interfaces are commonly used for objects and classes.
- Interfaces support inheritance through `extends`.
- Interfaces support declaration merging.
- Interfaces are compile-time TypeScript constructs.
- Interfaces do not generate JavaScript code at runtime.

---

# 2. Creating Interfaces

We use the `interface` keyword to create an interface.

### Syntax

```typescript
interface InterfaceName {
    property1: type;
    property2: type;
    property3: type;
}
```

### Example

```typescript
interface Employee {
    id: number;
    name: string;
    salary: number;
    department: string;
}

const employee: Employee = {
    id: 101,
    name: "Riyaz",
    salary: 50000,
    department: "IT"
};
```

### Accessing Properties

```typescript
console.log(employee.id);
console.log(employee.name);
console.log(employee.salary);
```

TypeScript knows the type of every property.

### Missing Properties

```typescript
interface Employee {
    id: number;
    name: string;
    salary: number;
}

const employee: Employee = {
    id: 101,
    name: "Riyaz"
};
```

**Error:** Property `salary` is missing.

### Incorrect Property Types

```typescript
interface Employee {
    id: number;
    name: string;
}

const employee: Employee = {
    id: "101",
    name: "Riyaz"
};
```

**Error:** `id` must be a number.

---

# 3. Interface Properties

An interface can contain different kinds of properties.

### Example

```typescript
interface User {
    id: number;
    name: string;
    age: number;
    email: string;
    isActive: boolean;
}
```

Supported property types include:

| Property Type | Example |
|---|---|
| String | `name: string` |
| Number | `age: number` |
| Boolean | `isActive: boolean` |
| Array | `skills: string[]` |
| Object | `address: Address` |
| Union | `id: number \| string` |
| Tuple | `coordinates: [number, number]` |
| Function | `greet: () => void` |

### Example with Multiple Property Types

```typescript
interface User {
    id: number;
    name: string;
    age: number;
    skills: string[];
    coordinates: [number, number];
    isActive: boolean;
}

const user: User = {
    id: 101,
    name: "Riyaz",
    age: 25,
    skills: ["JavaScript", "TypeScript", "React"],
    coordinates: [23.0225, 72.5714],
    isActive: true
};
```

---

# 4. Optional Properties

Sometimes an object does not need to contain every property.

We use `?` to define optional properties.

### Syntax

```typescript
interface InterfaceName {
    propertyName?: type;
}
```

### Example

```typescript
interface User {
    id: number;
    name: string;
    email?: string;
    phone?: string;
}
```

Now both objects are valid:

```typescript
const user1: User = {
    id: 1,
    name: "Riyaz"
};
```

```typescript
const user2: User = {
    id: 2,
    name: "John",
    email: "john@example.com",
    phone: "9876543210"
};
```

### Accessing Optional Properties

```typescript
console.log(user1.email);
```

The type of `email` is:

```typescript
string | undefined
```

Therefore, we should handle the possibility of `undefined`.

```typescript
if (user1.email !== undefined) {
    console.log(user1.email.toLowerCase());
}
```

Or use optional chaining:

```typescript
console.log(user1.email?.toLowerCase());
```

### Important Difference

```typescript
email?: string;
```

This means the property can be omitted.

Whereas:

```typescript
email: string | undefined;
```

This means the property must exist, but its value can be `undefined`.

---

# 5. Readonly Properties

Sometimes we want a property to be assigned during object creation but not reassigned afterward.

We use the `readonly` modifier.

### Syntax

```typescript
interface InterfaceName {
    readonly propertyName: type;
}
```

### Example

```typescript
interface User {
    readonly id: number;
    name: string;
    age: number;
}

const user: User = {
    id: 101,
    name: "Riyaz",
    age: 25
};
```

Updating normal properties is allowed:

```typescript
user.name = "John";
user.age = 30;
```

But:

```typescript
user.id = 102; // Error
```

### Readonly with Optional Properties

```typescript
interface User {
    readonly id: number;
    readonly email?: string;
    name: string;
}
```

### Important: Readonly Is Shallow

Consider:

```typescript
interface User {
    readonly address: {
        city: string;
        state: string;
    };
}

const user: User = {
    address: {
        city: "Ahmedabad",
        state: "Gujarat"
    }
};
```

This is not allowed:

```typescript
user.address = {
    city: "Mumbai",
    state: "Maharashtra"
}; // Error
```

But this is allowed:

```typescript
user.address.city = "Mumbai";
```

Why?

Because `readonly` protects the `address` property from reassignment. It does not automatically make nested properties readonly.

To protect nested properties:

```typescript
interface User {
    readonly address: {
        readonly city: string;
        readonly state: string;
    };
}
```

Now nested properties cannot be reassigned through this readonly reference either.

**Remember:** `readonly` is a compile-time restriction, not a runtime object-freezing mechanism.

---

# 6. Methods in Interfaces

An interface can define methods that an object must provide.

### Syntax

```typescript
interface InterfaceName {
    methodName(parameters): returnType;
}
```

### Example 1: Basic Method

```typescript
interface User {
    name: string;

    greet(): void;
}
```

Implementation:

```typescript
const user: User = {
    name: "Riyaz",

    greet() {
        console.log(`Hello, ${this.name}`);
    }
};

user.greet();
```

The object must implement the `greet` method.

### Example 2: Method with Parameters

```typescript
interface Calculator {
    add(a: number, b: number): number;
    subtract(a: number, b: number): number;
}
```

Implementation:

```typescript
const calculator: Calculator = {
    add(a, b) {
        return a + b;
    },

    subtract(a, b) {
        return a - b;
    }
};
```

### Example 3: Optional Methods

We can define optional methods using `?`.

```typescript
interface User {
    name: string;

    greet(): void;

    logout?(): void;
}
```

Implementation without `logout`:

```typescript
const user: User = {
    name: "Riyaz",

    greet() {
        console.log("Hello!");
    }
};
```

This is valid because `logout` is optional.

Call it safely:

```typescript
user.logout?.();
```

### Example 4: Method Returning an Object

```typescript
interface User {
    id: number;
    name: string;
}

interface UserService {
    createUser(name: string): User;
}
```

Implementation:

```typescript
const userService: UserService = {
    createUser(name) {
        return {
            id: Date.now(),
            name
        };
    }
};
```

---

# 7. Function Types in Interfaces

An interface can also describe a function's signature.

There are two common approaches.

## Approach 1: Function as a Property

```typescript
interface Calculator {
    add: (a: number, b: number) => number;
}
```

Implementation:

```typescript
const calculator: Calculator = {
    add: (a, b) => {
        return a + b;
    }
};
```

Here, `add` is a function-valued property.

## Approach 2: Call Signature

An interface itself can describe a callable function.

```typescript
interface AddFunction {
    (a: number, b: number): number;
}
```

Implementation:

```typescript
const add: AddFunction = (a, b) => {
    return a + b;
};

console.log(add(10, 20));
```

The difference is:

- Function property: the object has a property containing a function.
- Call signature: the value itself can be called like a function.

### Function Property vs Call Signature

| Function Property | Call Signature |
|---|---|
| `add: (a, b) => number` | `(a, b): number` |
| Describes a function-valued property | Describes a callable value |
| Commonly used in object interfaces | Commonly used for function contracts |

### Interface with Multiple Function Properties

```typescript
interface Calculator {
    add: (a: number, b: number) => number;
    subtract: (a: number, b: number) => number;
    multiply: (a: number, b: number) => number;
    divide: (a: number, b: number) => number;
}

const calculator: Calculator = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => a / b
};
```

---

# 8. Extending Interfaces

One interface can inherit the properties and methods of another interface.

We use the `extends` keyword.

This is useful when multiple interfaces share common properties.

### Example

First, define a `Person` interface:

```typescript
interface Person {
    name: string;
    age: number;
}
```

Now extend it:

```typescript
interface Employee extends Person {
    salary: number;
    department: string;
}
```

The `Employee` interface now contains:

- `name`
- `age`
- `salary`
- `department`

Example:

```typescript
const employee: Employee = {
    name: "Riyaz",
    age: 25,
    salary: 50000,
    department: "IT"
};
```

### Understanding Interface Inheritance

You can think of it like this:

```text
Person
  |
  | extends
  |
Employee
  |
  ├── name
  ├── age
  ├── salary
  └── department
```

The child interface inherits the structure of the parent interface.

### Example: User and Admin

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}

interface Admin extends User {
    permissions: string[];
    isAdmin: boolean;
}
```

Usage:

```typescript
const admin: Admin = {
    id: 1,
    name: "Riyaz",
    email: "riyaz@example.com",
    permissions: ["read", "write", "delete"],
    isAdmin: true
};
```

### Can We Override Properties?

An extending interface can redeclare an inherited property with a compatible subtype.

For example:

```typescript
interface Person {
    name: string | number;
}

interface Employee extends Person {
    name: string;
}
```

This is valid because `string` is compatible with the broader `string | number` property type.

But this is invalid:

```typescript
interface Person {
    name: string;
}

interface Employee extends Person {
    name: number;
}
```

Why?

Because the child interface cannot replace the inherited `string` property with an incompatible `number` property.

---

# 9. Extending Multiple Interfaces

An interface can extend multiple interfaces.

This allows us to combine multiple contracts.

### Syntax

```typescript
interface Child extends Parent1, Parent2 {
    // Additional properties
}
```

### Example

```typescript
interface Person {
    name: string;
    age: number;
}

interface Contact {
    email: string;
    phone: string;
}

interface Address {
    city: string;
    country: string;
}

interface User extends Person, Contact, Address {
    id: number;
}
```

Now `User` contains all properties from the three parent interfaces, plus `id`.

Implementation:

```typescript
const user: User = {
    id: 101,
    name: "Riyaz",
    age: 25,
    email: "riyaz@example.com",
    phone: "9876543210",
    city: "Ahmedabad",
    country: "India"
};
```

### Important Rule

If multiple parent interfaces define the same property, their declarations must be compatible.

For example:

```typescript
interface A {
    id: number;
}

interface B {
    id: number;
}

interface C extends A, B {
    name: string;
}
```

This is valid.

But incompatible declarations can cause an error:

```typescript
interface A {
    id: number;
}

interface B {
    id: string;
}

interface C extends A, B {
    name: string;
}
```

TypeScript cannot safely combine the conflicting property declarations.

---

# 10. Interface Declaration Merging

One special feature of interfaces is **declaration merging**.

It means TypeScript can combine multiple interface declarations with the same name into one interface.

### Example

```typescript
interface User {
    id: number;
    name: string;
}
```

Later, we declare another interface with the same name:

```typescript
interface User {
    age: number;
    email: string;
}
```

TypeScript merges them.

The resulting interface is equivalent to:

```typescript
interface User {
    id: number;
    name: string;
    age: number;
    email: string;
}
```

Now:

```typescript
const user: User = {
    id: 1,
    name: "Riyaz",
    age: 25,
    email: "riyaz@example.com"
};
```

This is valid.

### Why Is Declaration Merging Useful?

It is especially useful when:

- Extending existing library types.
- Adding custom properties to global interfaces.
- Extending browser or Node.js type definitions.
- Working with third-party packages.

### Important Rule

If two declarations contain the same property, their types must be compatible.

For example:

```typescript
interface User {
    name: string;
}

interface User {
    name: number; // Error
}
```

The declarations conflict.

### Declaration Merging vs Interface Extending

| Declaration Merging | Interface Extending |
|---|---|
| Uses the same interface name | Uses a different child interface name |
| TypeScript combines declarations | Child inherits parent properties |
| No `extends` keyword required | Uses `extends` |
| Useful for augmentation | Useful for building related contracts |

---

# 11. Implementing Interfaces in Classes

One of the most important uses of interfaces is defining contracts for classes.

A class can implement an interface using the `implements` keyword.

### Syntax

```typescript
class ClassName implements InterfaceName {
    // Implementation
}
```

### Example 1: Basic Implementation

```typescript
interface User {
    id: number;
    name: string;
}

class UserAccount implements User {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}
```

Create an instance:

```typescript
const user = new UserAccount(1, "Riyaz");

console.log(user.name);
```

### What Does `implements` Do?

It checks whether the class provides the required instance structure specified by the interface.

For example:

```typescript
interface User {
    id: number;
    name: string;
}

class UserAccount implements User {
    id: number;

    constructor(id: number) {
        this.id = id;
    }
}
```

This produces an error because `name` is missing.

### Example 2: Implementing Methods

```typescript
interface Payment {
    amount: number;

    processPayment(): void;
}

class UpiPayment implements Payment {
    amount: number;

    constructor(amount: number) {
        this.amount = amount;
    }

    processPayment(): void {
        console.log(`Processing UPI payment of ${this.amount}`);
    }
}
```

Usage:

```typescript
const payment = new UpiPayment(500);

payment.processPayment();
```

### Example 3: Multiple Interfaces

A class can implement multiple interfaces.

```typescript
interface User {
    name: string;
}

interface Logger {
    log(message: string): void;
}

class UserAccount implements User, Logger {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    log(message: string): void {
        console.log(message);
    }
}
```

### Important: `extends` vs `implements`

| `extends` | `implements` |
|---|---|
| Used for interface inheritance | Used by classes to satisfy interfaces |
| An interface extends another interface | A class implements an interface |
| Inherits interface members | Checks that the class provides required members |
| Can also be used for class inheritance | Does not provide method implementations |

Example:

```typescript
interface Person {
    name: string;
}

interface Employee extends Person {
    salary: number;
}
```

```typescript
class UserAccount implements Person {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}
```

**Important:** `implements` is a compile-time check. It does not automatically create properties or methods in the class.

---

# 12. Interface Inheritance vs Class Inheritance

These concepts are related but different.

### Interface Inheritance

```typescript
interface Person {
    name: string;
}

interface Employee extends Person {
    salary: number;
}
```

Here, `Employee` inherits the type contract of `Person`.

### Class Inheritance

```typescript
class Person {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

class Employee extends Person {
    salary: number;

    constructor(name: string, salary: number) {
        super(name);
        this.salary = salary;
    }
}
```

Here, `Employee` inherits the actual class implementation and behavior of `Person`.

### Comparison

| Interface Inheritance | Class Inheritance |
|---|---|
| Uses interfaces | Uses classes |
| Shares type contracts | Shares implementation and behavior |
| Uses `extends` | Uses `extends` |
| No runtime implementation is inherited | Runtime methods and properties are inherited |
| Supports extending multiple interfaces | A class can extend only one class |

---

# 13. Interfaces with Arrays

We can use interfaces to define the structure of array elements.

### Example 1: Array of Users

```typescript
interface User {
    id: number;
    name: string;
    age: number;
}

const users: User[] = [
    {
        id: 1,
        name: "John",
        age: 25
    },
    {
        id: 2,
        name: "David",
        age: 30
    },
    {
        id: 3,
        name: "Riyaz",
        age: 25
    }
];
```

### Alternative Syntax

```typescript
const users: Array<User> = [];
```

Both are valid.

### Example 2: Readonly Array

```typescript
interface Product {
    id: number;
    name: string;
    price: number;
}

const products: readonly Product[] = [
    {
        id: 1,
        name: "Laptop",
        price: 75000
    }
];
```

You cannot modify the array through this readonly reference.

```typescript
products.push({
    id: 2,
    name: "Keyboard",
    price: 2000
}); // Error
```

However, readonly array typing does not automatically make each product object deeply readonly.

---

# 14. Interfaces with Nested Objects

Interfaces can reuse other interfaces to define nested object structures.

### Example

```typescript
interface Address {
    city: string;
    state: string;
    country: string;
}

interface Contact {
    email: string;
    phone: string;
}

interface User {
    id: number;
    name: string;
    address: Address;
    contact: Contact;
}
```

Create an object:

```typescript
const user: User = {
    id: 101,
    name: "Riyaz",

    address: {
        city: "Ahmedabad",
        state: "Gujarat",
        country: "India"
    },

    contact: {
        email: "riyaz@example.com",
        phone: "9876543210"
    }
};
```

### Why Is This Useful?

Imagine an application with:

- Users
- Employees
- Customers
- Companies
- Orders
- Addresses

Many of these structures can reuse common interfaces.

This reduces duplication and improves maintainability.

---

# 15. Extending Interfaces with Index Signatures

Interfaces also support index signatures.

### Example

```typescript
interface Settings {
    [key: string]: string;
}

const settings: Settings = {
    theme: "dark",
    language: "English",
    timezone: "IST"
};
```

### Index Signature with Explicit Properties

```typescript
interface User {
    name: string;
    age: number;

    [key: string]: string | number;
}
```

This is valid because both explicitly declared properties are compatible with the index signature.

```typescript
const user: User = {
    name: "Riyaz",
    age: 25,
    city: "Ahmedabad"
};
```

### Important Rule

Every explicitly declared property must be compatible with the index signature.

For example:

```typescript
interface User {
    name: string;

    [key: string]: number;
}
```

This is invalid because `name` is a string, while the index signature requires every string-keyed property value to be a number.

---

# 16. Interface vs Type Alias: Detailed Comparison

Let's review the differences carefully.

### Example 1: Object Structure

Using interface:

```typescript
interface User {
    id: number;
    name: string;
}
```

Using type alias:

```typescript
type User = {
    id: number;
    name: string;
};
```

Both work.

### Example 2: Extending

Interface:

```typescript
interface Person {
    name: string;
}

interface Employee extends Person {
    salary: number;
}
```

Type alias:

```typescript
type Person = {
    name: string;
};

type Employee = Person & {
    salary: number;
};
```

### Example 3: Union Types

Type alias:

```typescript
type Status = "success" | "error" | "pending";
```

An interface cannot directly represent this union.

### Example 4: Declaration Merging

Interface:

```typescript
interface User {
    name: string;
}

interface User {
    age: number;
}
```

Valid.

Type alias:

```typescript
type User = {
    name: string;
};

type User = {
    age: number;
};
```

Invalid.

### Full Comparison

| Feature | Interface | Type Alias |
|---|---|---|
| Object structure | Yes | Yes |
| Primitive types | No | Yes |
| Union types | No, not directly | Yes |
| Intersection types | Through extension | Yes, using `&` |
| Arrays | Can describe array structures | Yes |
| Tuples | Not directly | Yes |
| Function signatures | Yes | Yes |
| Optional properties | Yes | Yes |
| Readonly properties | Yes | Yes |
| Extending structures | `extends` | `&` |
| Multiple inheritance | Multiple interfaces | Multiple intersections |
| Declaration merging | Yes | No |
| Class implementation | Yes | Yes, when compatible |
| Mapped types | Not directly | Yes |

### Which One Should You Use?

For ordinary object structures, either is appropriate.

A practical guideline:

**Prefer interfaces when:**
- Defining object contracts.
- Defining class contracts.
- Designing extensible public APIs.
- Working with declaration merging.

**Prefer type aliases when:**
- Defining unions.
- Defining intersections.
- Defining tuples.
- Defining primitive aliases.
- Defining complex mapped or conditional types.

Do not choose one simply because it is universally considered better. Choose based on the type structure you need.

---

# 17. Real-World Example: E-commerce Application

Let's combine everything from this phase.

### Step 1: Define Address

```typescript
interface Address {
    city: string;
    state: string;
    country: string;
    pincode: number;
}
```

### Step 2: Define User

```typescript
interface User {
    readonly id: number;
    name: string;
    email: string;
    phone?: string;
    address: Address;
}
```

### Step 3: Define Product

```typescript
interface Product {
    readonly id: number;
    name: string;
    price: number;
    category: string;
    inStock: boolean;
}
```

### Step 4: Define Cart Item

```typescript
interface CartItem {
    product: Product;
    quantity: number;
}
```

### Step 5: Define Order

```typescript
interface Order {
    readonly id: number;
    user: User;
    items: CartItem[];
    totalAmount: number;
    status: "pending" | "processing" | "shipped" | "delivered";
}
```

### Step 6: Define Payment Interface

```typescript
interface Payment {
    amount: number;
    method: "upi" | "card" | "cash";

    processPayment(): boolean;
}
```

### Step 7: Implement Payment Interface

```typescript
class UpiPayment implements Payment {
    amount: number;
    method: "upi" = "upi";

    constructor(amount: number) {
        this.amount = amount;
    }

    processPayment(): boolean {
        console.log(`Processing UPI payment: ${this.amount}`);

        return true;
    }
}
```

### Step 8: Create an Order

```typescript
const user: User = {
    id: 1,
    name: "Riyaz",
    email: "riyaz@example.com",

    address: {
        city: "Ahmedabad",
        state: "Gujarat",
        country: "India",
        pincode: 380001
    }
};

const product: Product = {
    id: 101,
    name: "Laptop",
    price: 75000,
    category: "Electronics",
    inStock: true
};

const order: Order = {
    id: 1001,
    user,
    items: [
        {
            product,
            quantity: 1
        }
    ],
    totalAmount: 75000,
    status: "pending"
};
```

This example demonstrates how interfaces can organize the data structures of a real application.

---

# 18. Common Mistakes

### Mistake 1: Using `=` with Interfaces

Incorrect:

```typescript
interface User = {
    name: string;
};
```

Correct:

```typescript
interface User {
    name: string;
}
```

Remember:

- Type aliases use `=`.
- Interfaces do not use `=`.

### Mistake 2: Forgetting Required Properties

```typescript
interface User {
    id: number;
    name: string;
}

const user: User = {
    id: 1
}; // Error
```

The `name` property is required.

### Mistake 3: Confusing `extends` and `implements`

```typescript
interface Employee extends Person {}
```

Interface inheritance uses `extends`.

```typescript
class Employee implements Person {}
```

A class uses `implements` to satisfy an interface.

### Mistake 4: Assuming `implements` Creates Properties

```typescript
interface User {
    name: string;
}

class UserAccount implements User {}
```

This is invalid because `implements` does not automatically create the `name` property.

### Mistake 5: Incorrect Declaration Merging

```typescript
interface User {
    age: number;
}

interface User {
    age: string;
}
```

This produces an error because the same property has incompatible types.

### Mistake 6: Assuming Interfaces Exist at Runtime

```typescript
interface User {
    name: string;
}
```

Interfaces are erased during compilation.

They cannot be used as runtime constructors or values.

---

# 19. Interview Questions and Answers

### Q1. What is an interface in TypeScript?

An interface defines a contract or structure that an object or class should follow.

### Q2. Why do we use interfaces?

Interfaces help define reusable object structures, improve code organization, and enforce consistent contracts.

### Q3. What is the difference between `type` and `interface`?

Both can describe object structures. Type aliases support unions, intersections, tuples, and primitive aliases. Interfaces support declaration merging and are commonly used for extensible object contracts.

### Q4. What is interface inheritance?

Interface inheritance allows one interface to inherit the properties and methods of another interface using `extends`.

### Q5. Can an interface extend multiple interfaces?

Yes.

```typescript
interface User extends Person, Contact {}
```

### Q6. What is declaration merging?

It is a TypeScript feature that combines multiple declarations with the same interface name into one interface.

### Q7. Can we implement an interface in a class?

Yes. We use the `implements` keyword.

### Q8. What is the difference between `extends` and `implements`?

`extends` inherits a contract or class implementation, depending on whether it is used with interfaces or classes. `implements` checks whether a class satisfies an interface contract.

### Q9. Can interfaces contain methods?

Yes. Interfaces can define method signatures.

### Q10. Can interfaces contain optional methods?

Yes. Use `?` after the method name.

### Q11. Can interfaces contain readonly properties?

Yes. Use the `readonly` modifier.

### Q12. Can interfaces define arrays?

Yes. They can describe array structures and the types of array elements.

### Q13. Can interfaces define function types?

Yes. They can use function-valued properties or call signatures.

### Q14. Can interfaces contain index signatures?

Yes.

```typescript
interface Settings {
    [key: string]: string;
}
```

### Q15. Can we create an object using an interface directly?

An interface can be used as a variable's type, but it cannot create an object at runtime.

### Q16. Can a class implement multiple interfaces?

Yes.

```typescript
class User implements Person, Contact {}
```

The class must satisfy the required members of both interfaces.

### Q17. Can an interface extend a type alias?

Yes, if the type alias represents an object type that is statically known and compatible with interface extension.

```typescript
type Person = {
    name: string;
};

interface Employee extends Person {
    salary: number;
}
```

### Q18. Can a type alias implement an interface?

A type alias itself cannot use `implements`. However, a class can implement an interface while also using a type alias to describe its instance structure.

### Q19. Are interfaces available at runtime?

No. Interfaces are removed during compilation.

### Q20. Which is better: interface or type alias?

Neither is universally better. Use the feature that best represents the required type structure.

---

# 20. Practical Exercises

Complete these exercises yourself.

## Exercise 1: Basic User Interface

Create an interface called `User` with:

- `id`: number
- `name`: string
- `age`: number
- `email`: string

Create three user objects.

## Exercise 2: Optional and Readonly Properties

Create an interface called `Employee` with:

- `readonly id`: number
- `name`: string
- `salary`: number
- `email`: optional string
- `phone`: optional string

Try updating the readonly property.

## Exercise 3: Interface Methods

Create an interface called `Calculator` with:

- `add(a, b)`
- `subtract(a, b)`
- `multiply(a, b)`
- `divide(a, b)`

Implement all four methods.

## Exercise 4: Interface Inheritance

Create:

- `Person`
- `Contact`
- `Address`
- `Employee`

Make `Employee` extend all three interfaces.

## Exercise 5: Declaration Merging

Create an interface called `Product`.

Declare it twice.

First declaration:

- `id`
- `name`

Second declaration:

- `price`
- `category`

Create an object using the merged interface.

## Exercise 6: Class Implementation

Create an interface called `Vehicle` with:

- `brand`
- `model`
- `start()`
- `stop()`

Create a `Car` class that implements it.

## Exercise 7: Multiple Interface Implementation

Create:

- `Logger`
- `Database`
- `UserService`

Make a class implement all three interfaces.

## Exercise 8: Array of Interfaces

Create a `Product` interface.

Create an array containing at least five products.

Use `filter()` to find products whose price is greater than 1000.

## Exercise 9: Nested Interfaces

Create:

- `Address`
- `Contact`
- `Profile`
- `User`

Reuse the smaller interfaces inside `User`.

## Exercise 10: Interface vs Type Alias

Create an object structure using both an interface and a type alias.

Implement:

- Optional properties.
- Readonly properties.
- Nested structures.
- Function properties.

Compare the two approaches.

## Exercise 11: Real-World Project

Create a small banking application type system using interfaces.

Define:

1. `Customer`
2. `Account`
3. `Transaction`
4. `Bank`
5. `Payment`
6. `Logger`
7. `Notification`

Requirements:

- Use interface inheritance.
- Use optional properties where appropriate.
- Use readonly account identifiers.
- Use methods.
- Implement `Payment` in a class.
- Implement multiple interfaces in at least one class.

---

# 21. Phase 9 Completion Checklist

Before proceeding, make sure you understand:

- [ ] What interfaces are
- [ ] Creating interfaces
- [ ] Interface property types
- [ ] Optional properties
- [ ] Readonly properties
- [ ] Interface methods
- [ ] Optional methods
- [ ] Function properties
- [ ] Call signatures
- [ ] Extending interfaces
- [ ] Extending multiple interfaces
- [ ] Overriding compatible properties
- [ ] Declaration merging
- [ ] Interface implementation in classes
- [ ] `extends` vs `implements`
- [ ] Interface inheritance vs class inheritance
- [ ] Interfaces with arrays
- [ ] Nested interfaces
- [ ] Index signatures
- [ ] Interface vs type alias
- [ ] Real-world interface design

---

## Next Phase: Phase 10 — Union Types and Intersection Types

In the next phase, we will study these concepts in greater depth:

1. What are union types?
2. Union operator `|`
3. Primitive union types.
4. Object union types.
5. Literal union types.
6. Union type narrowing.
7. Type guards.
8. `typeof` narrowing.
9. `instanceof` narrowing.
10. `in` operator narrowing.
11. Discriminated unions.
12. What are intersection types?
13. Intersection operator `&`.
14. Combining object types.
15. Union vs intersection.
16. Conflicting properties.
17. Real-world use cases.

**When you're ready, say: `OK, Phase 10`.**