# Phase 8: Type Aliases in TypeScript

**Level:** Beginner to Intermediate  
**Category:** TypeScript Fundamentals

## Learning Objectives

By the end of this phase, you will understand:

1. What type aliases are and why we use them.
2. How to create custom types using the `type` keyword.
3. Primitive type aliases.
4. Object type aliases.
5. Union type aliases.
6. Intersection type aliases.
7. Function type aliases.
8. Array type aliases.
9. Tuple type aliases.
10. Nested type aliases.
11. Reusing and combining type aliases.
12. Type aliases vs interfaces.
13. Naming conventions and best practices.

---

# 1. What Are Type Aliases?

A **type alias** allows us to give a custom name to an existing type or type structure.

We create type aliases using the `type` keyword.

### Without Type Alias

Consider this function:

```typescript
function displayUser(user: {
    id: number;
    name: string;
    age: number;
    email: string;
}) {
    console.log(user.name);
}
```

Now suppose we have multiple functions that accept the same object structure.

We would need to repeat the same type declaration.

```typescript
function createUser(user: {
    id: number;
    name: string;
    age: number;
    email: string;
}) {}

function updateUser(user: {
    id: number;
    name: string;
    age: number;
    email: string;
}) {}

function deleteUser(user: {
    id: number;
    name: string;
    age: number;
    email: string;
}) {}
```

This creates unnecessary duplication.

### With Type Alias

We can define the structure once and reuse it.

```typescript
type User = {
    id: number;
    name: string;
    age: number;
    email: string;
};
```

Now we can reuse it:

```typescript
function createUser(user: User) {}

function updateUser(user: User) {}

function deleteUser(user: User) {}
```

Much cleaner!

### Important Points

- `type` is a TypeScript keyword.
- `User` is the name of our custom type.
- A type alias can describe primitive types, objects, arrays, tuples, functions, unions, intersections, and more.
- Type aliases exist only during compile-time type checking. They do not create JavaScript classes or constructors at runtime.

---

# 2. Type Alias Syntax

### General Syntax

```typescript
type TypeName = ExistingType;
```

For an object:

```typescript
type TypeName = {
    property1: type;
    property2: type;
};
```

### Example

```typescript
type Employee = {
    id: number;
    name: string;
    salary: number;
};

const employee: Employee = {
    id: 101,
    name: "Riyaz",
    salary: 50000
};
```

Here:

- `Employee` is the type alias.
- The alias describes an object structure.
- `employee` is a variable whose type is `Employee`.

### Naming Convention

Type aliases generally use PascalCase.

Recommended:

```typescript
type User = {};
type Product = {};
type EmployeeDetails = {};
type ApiResponse = {};
```

Avoid inconsistent naming:

```typescript
type user = {};
type product_details = {};
```

---

# 3. Primitive Type Aliases

We can create aliases for primitive types.

### Example 1: String Alias

```typescript
type Username = string;

let name: Username = "Riyaz";
```

The `Username` type behaves like `string`.

```typescript
let user: Username = 123; // Error
```

### Example 2: Number Alias

```typescript
type Age = number;

let userAge: Age = 25;
```

### Example 3: Boolean Alias

```typescript
type IsActive = boolean;

let status: IsActive = true;
```

### Example 4: Multiple Primitive Aliases

```typescript
type UserId = number;
type Username = string;
type Email = string;
type IsVerified = boolean;

const id: UserId = 101;
const name: Username = "Riyaz";
const email: Email = "riyaz@example.com";
const verified: IsVerified = true;
```

**Important:** These aliases improve readability, but they do not create distinct primitive types.

For example:

```typescript
type UserId = number;
type ProductId = number;

let userId: UserId = 101;

let productId: ProductId = userId; // Valid
```

Both aliases resolve to `number`, so TypeScript considers them compatible.

We will study branded types later for creating stronger distinctions between structurally identical types.

---

# 4. Object Type Aliases

One of the most common uses of type aliases is defining object structures.

### Example

```typescript
type User = {
    id: number;
    name: string;
    age: number;
    email: string;
    isActive: boolean;
};

const user: User = {
    id: 101,
    name: "Riyaz",
    age: 25,
    email: "riyaz@example.com",
    isActive: true
};
```

### Optional Properties

We can define optional properties using `?`.

```typescript
type User = {
    id: number;
    name: string;
    email?: string;
    phone?: string;
};
```

Example:

```typescript
const user: User = {
    id: 101,
    name: "Riyaz"
};
```

This is valid because `email` and `phone` are optional.

### Readonly Properties

We can use `readonly` with type aliases.

```typescript
type User = {
    readonly id: number;
    name: string;
    age: number;
};

const user: User = {
    id: 101,
    name: "Riyaz",
    age: 25
};

user.name = "John"; // Valid

user.id = 102; // Error
```

### Index Signatures

Type aliases can also contain index signatures.

```typescript
type Settings = {
    [key: string]: string;
};

const settings: Settings = {
    theme: "dark",
    language: "English",
    timezone: "IST"
};
```

### Object Type with Nested Properties

```typescript
type Address = {
    city: string;
    state: string;
    country: string;
};

type User = {
    id: number;
    name: string;
    address: Address;
};

const user: User = {
    id: 101,
    name: "Riyaz",
    address: {
        city: "Ahmedabad",
        state: "Gujarat",
        country: "India"
    }
};
```

We will explore nested and reusable type aliases in more detail later in this phase.

---

# 5. Union Type Aliases

A union type allows a variable to hold values belonging to one of multiple specified types.

We use the `|` operator.

### Without Type Alias

```typescript
let userId: number | string;

userId = 101;
userId = "USER101";
```

### With Type Alias

```typescript
type UserId = number | string;

let userId: UserId;

userId = 101;
userId = "USER101";
```

Now the same union can be reused.

### Example 1: Multiple Primitive Types

```typescript
type UserInput = string | number | boolean;

let input1: UserInput = "Riyaz";
let input2: UserInput = 25;
let input3: UserInput = true;
```

### Example 2: Status Types

```typescript
type Status = "pending" | "approved" | "rejected";

let orderStatus: Status;

orderStatus = "pending";
orderStatus = "approved";
orderStatus = "rejected";
```

Invalid:

```typescript
orderStatus = "completed"; // Error
```

This is called a **string literal union type**.

### Example 3: Payment Method

```typescript
type PaymentMethod = "cash" | "card" | "upi" | "netbanking";

function processPayment(method: PaymentMethod) {
    console.log(`Processing ${method} payment`);
}

processPayment("upi");
processPayment("card");
```

### Example 4: Union of Object Types

```typescript
type Admin = {
    role: "admin";
    permissions: string[];
};

type Customer = {
    role: "customer";
    purchaseCount: number;
};

type User = Admin | Customer;
```

Usage:

```typescript
const user1: User = {
    role: "admin",
    permissions: ["create", "update", "delete"]
};

const user2: User = {
    role: "customer",
    purchaseCount: 10
};
```

### Accessing Properties of Union Types

Consider:

```typescript
function displayUser(user: User) {
    console.log(user.role);
}
```

This works because both object types contain `role`.

But:

```typescript
function displayUser(user: User) {
    console.log(user.permissions); // Error
}
```

Why?

Because `permissions` exists only in the `Admin` type.

We need to narrow the union.

```typescript
function displayUser(user: User) {
    if (user.role === "admin") {
        console.log(user.permissions);
    } else {
        console.log(user.purchaseCount);
    }
}
```

This is called **discriminated union narrowing**.

We will study union narrowing in a later phase.

---

# 6. Intersection Type Aliases

An intersection type combines multiple types into one.

We use the `&` operator.

### Syntax

```typescript
type CombinedType = Type1 & Type2;
```

### Example 1: Combining Two Object Types

```typescript
type User = {
    id: number;
    name: string;
};

type Employee = {
    salary: number;
    department: string;
};

type EmployeeUser = User & Employee;
```

Now `EmployeeUser` contains all four properties.

```typescript
const employee: EmployeeUser = {
    id: 101,
    name: "Riyaz",
    salary: 50000,
    department: "IT"
};
```

### Example 2: Multiple Intersections

```typescript
type Person = {
    name: string;
    age: number;
};

type Contact = {
    email: string;
    phone: string;
};

type Address = {
    city: string;
    country: string;
};

type User = Person & Contact & Address;
```

Example:

```typescript
const user: User = {
    name: "Riyaz",
    age: 25,
    email: "riyaz@example.com",
    phone: "9876543210",
    city: "Ahmedabad",
    country: "India"
};
```

### Example 3: Adding Extra Properties

Suppose we already have a `User` type.

```typescript
type User = {
    id: number;
    name: string;
};

type Admin = User & {
    permissions: string[];
    isAdmin: boolean;
};
```

Now an `Admin` contains all properties of `User`, plus additional properties.

```typescript
const admin: Admin = {
    id: 1,
    name: "Riyaz",
    permissions: ["read", "write", "delete"],
    isAdmin: true
};
```

### Union vs Intersection

This is one of the most important distinctions in TypeScript.

| Union `\|` | Intersection `&` |
|---|---|
| Allows one of multiple types | Combines multiple types |
| A value must satisfy at least one union member | A value must satisfy all intersected types |
| Example: `string \| number` | Example: `User & Employee` |
| Useful for alternatives | Useful for combining structures |

### Important: Conflicting Properties

Consider:

```typescript
type A = {
    value: string;
};

type B = {
    value: number;
};

type C = A & B;
```

Now `C` requires `value` to be both a string and a number.

There is no ordinary value that satisfies both requirements, so the property effectively becomes `never`.

```typescript
const data: C = {
    value: "Hello" // Error
};
```

Be careful when intersecting object types with conflicting property declarations.

---

# 7. Function Type Aliases

Type aliases can describe function signatures.

This is particularly useful when multiple functions share the same structure.

### Example 1: Basic Function Type

```typescript
type AddFunction = (a: number, b: number) => number;
```

Now use it:

```typescript
const add: AddFunction = (a, b) => {
    return a + b;
};
```

### Example 2: Multiple Functions Using the Same Type

```typescript
type Calculator = (a: number, b: number) => number;

const add: Calculator = (a, b) => a + b;

const subtract: Calculator = (a, b) => a - b;

const multiply: Calculator = (a, b) => a * b;

const divide: Calculator = (a, b) => a / b;
```

### Example 3: Function with Optional Parameter

```typescript
type GreetFunction = (name: string, age?: number) => void;

const greet: GreetFunction = (name, age) => {
    console.log(`Hello, ${name}`);

    if (age !== undefined) {
        console.log(`Age: ${age}`);
    }
};
```

### Example 4: Function with Object Parameter

```typescript
type User = {
    id: number;
    name: string;
};

type UserCallback = (user: User) => void;

const displayUser: UserCallback = (user) => {
    console.log(user.name);
};
```

### Example 5: Function Returning an Object

```typescript
type User = {
    id: number;
    name: string;
};

type CreateUser = (name: string) => User;

const createUser: CreateUser = (name) => {
    return {
        id: Date.now(),
        name
    };
};
```

### Example 6: Callback Type Alias

```typescript
type Callback = (message: string) => void;

function processTask(callback: Callback) {
    callback("Task completed");
}

processTask((message) => {
    console.log(message);
});
```

**Important:** A function type alias describes the function's signature. It does not contain the function implementation.

---

# 8. Array Type Aliases

We can create reusable aliases for arrays.

### Example 1: Number Array

```typescript
type Numbers = number[];

const marks: Numbers = [80, 90, 85, 95];
```

### Example 2: String Array

```typescript
type Skills = string[];

const skills: Skills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js"
];
```

### Example 3: Array of Objects

```typescript
type User = {
    id: number;
    name: string;
    age: number;
};

type Users = User[];

const users: Users = [
    {
        id: 1,
        name: "John",
        age: 25
    },
    {
        id: 2,
        name: "David",
        age: 30
    }
];
```

### Example 4: Union Array

```typescript
type MixedValues = (string | number)[];

const values: MixedValues = [
    "Riyaz",
    25,
    "Ahmedabad",
    100
];
```

### Example 5: Readonly Array

```typescript
type Skills = readonly string[];

const skills: Skills = [
    "JavaScript",
    "TypeScript"
];
```

This prevents array modifications through that readonly reference.

```typescript
skills.push("React"); // Error
```

Remember that readonly array types provide compile-time restrictions; they do not automatically freeze the underlying array at runtime.

---

# 9. Tuple Type Aliases

A tuple is an array-like structure where each position has a specific type.

We can define reusable tuple aliases.

### Example 1: Basic Tuple

```typescript
type UserRecord = [number, string, number];

const user: UserRecord = [1, "Riyaz", 25];
```

The positions represent:

- First element: number
- Second element: string
- Third element: number

### Example 2: Coordinates

```typescript
type Coordinates = [number, number];

const location: Coordinates = [23.0225, 72.5714];
```

### Example 3: Optional Tuple Elements

```typescript
type UserData = [number, string, number?];

const user1: UserData = [1, "Riyaz"];

const user2: UserData = [2, "John", 25];
```

### Example 4: Readonly Tuple

```typescript
type Point = readonly [number, number];

const coordinates: Point = [10, 20];

coordinates[0] = 30; // Error
```

### Example 5: Tuple with Named Elements

```typescript
type User = [
    id: number,
    name: string,
    age: number
];

const user: User = [1, "Riyaz", 25];
```

Named tuple elements improve readability, but the tuple remains positional.

---

# 10. Nested and Reusable Type Aliases

In real-world applications, object structures can become large.

Instead of defining everything inside one type, we can create smaller reusable aliases.

### Example: User Management System

First, define an address:

```typescript
type Address = {
    city: string;
    state: string;
    country: string;
    pincode: number;
};
```

Now define contact details:

```typescript
type Contact = {
    email: string;
    phone: string;
};
```

Define user skills:

```typescript
type Skills = {
    technical: string[];
    soft: string[];
};
```

Now combine them:

```typescript
type User = {
    id: number;
    name: string;
    age: number;
    contact: Contact;
    address: Address;
    skills: Skills;
};
```

Create an object:

```typescript
const user: User = {
    id: 101,
    name: "Riyaz",
    age: 25,

    contact: {
        email: "riyaz@example.com",
        phone: "9876543210"
    },

    address: {
        city: "Ahmedabad",
        state: "Gujarat",
        country: "India",
        pincode: 380001
    },

    skills: {
        technical: [
            "JavaScript",
            "TypeScript",
            "React",
            "Node.js"
        ],

        soft: [
            "Communication",
            "Problem Solving"
        ]
    }
};
```

### Why Is This Better?

1. Each type has a single responsibility.
2. We can reuse `Address` in other types.
3. Code becomes easier to read.
4. Changes can be made centrally.
5. Large application models become easier to maintain.

### Reusing Types in Multiple Structures

```typescript
type Address = {
    city: string;
    state: string;
};

type Customer = {
    id: number;
    name: string;
    address: Address;
};

type Company = {
    id: number;
    companyName: string;
    address: Address;
};
```

Both `Customer` and `Company` reuse the same `Address` type.

---

# 11. Combining Type Aliases

We can combine existing type aliases using union and intersection operators.

### Example 1: Union of Aliases

```typescript
type Admin = {
    role: "admin";
    permissions: string[];
};

type Customer = {
    role: "customer";
    purchaseCount: number;
};

type User = Admin | Customer;
```

A `User` can be an admin or a customer.

### Example 2: Intersection of Aliases

```typescript
type Person = {
    name: string;
    age: number;
};

type Employee = {
    salary: number;
    department: string;
};

type EmployeeDetails = Person & Employee;
```

An `EmployeeDetails` object must satisfy both structures.

### Example 3: Combining Union and Intersection

```typescript
type Person = {
    name: string;
    age: number;
};

type Admin = {
    role: "admin";
    permissions: string[];
};

type Customer = {
    role: "customer";
    purchaseCount: number;
};

type User = Person & (Admin | Customer);
```

This means:

- Every user must have `name` and `age`.
- Every user must also be either an admin or a customer.

Example:

```typescript
const admin: User = {
    name: "Riyaz",
    age: 25,
    role: "admin",
    permissions: ["read", "write"]
};
```

---

# 12. Type Aliases vs Interfaces

This is one of the most frequently asked TypeScript interview questions.

Both `type` and `interface` can describe object structures.

### Using a Type Alias

```typescript
type User = {
    id: number;
    name: string;
    age: number;
};
```

### Using an Interface

```typescript
interface User {
    id: number;
    name: string;
    age: number;
}
```

Both can describe the same object shape.

### Main Differences

| Feature | Type Alias | Interface |
|---|---|---|
| Keyword | `type` | `interface` |
| Object structures | Yes | Yes |
| Primitive aliases | Yes | No |
| Union types | Yes | No, not directly |
| Intersection types | Yes, with `&` | Can extend multiple interfaces |
| Function types | Yes | Can describe call signatures |
| Tuple types | Yes | Not directly |
| Declaration merging | No | Yes |
| Extending types | Through intersections | Through `extends` |
| Mapped types and conditional types | Yes | Not directly |

### Difference 1: Primitive Types

Type aliases can represent primitives:

```typescript
type UserId = number;

let id: UserId = 101;
```

An interface cannot directly represent a primitive alias.

### Difference 2: Union Types

Type aliases support unions:

```typescript
type Status = "pending" | "completed" | "failed";
```

An interface cannot directly define this kind of union.

### Difference 3: Extending Object Structures

With a type alias:

```typescript
type Person = {
    name: string;
};

type Employee = Person & {
    salary: number;
};
```

With an interface:

```typescript
interface Person {
    name: string;
}

interface Employee extends Person {
    salary: number;
}
```

Both approaches allow us to build on an existing structure.

### Difference 4: Declaration Merging

Interfaces support declaration merging.

```typescript
interface User {
    name: string;
}

interface User {
    age: number;
}
```

TypeScript merges these declarations.

The resulting interface is equivalent to:

```typescript
interface User {
    name: string;
    age: number;
}
```

Type aliases do not support this behavior.

```typescript
type User = {
    name: string;
};

type User = {
    age: number;
}; // Error: Duplicate identifier
```

### Difference 5: Extending Multiple Structures

An interface can extend multiple interfaces.

```typescript
interface Person {
    name: string;
}

interface Contact {
    email: string;
}

interface User extends Person, Contact {
    age: number;
}
```

A type alias can combine multiple structures using intersections:

```typescript
type Person = {
    name: string;
};

type Contact = {
    email: string;
};

type User = Person & Contact & {
    age: number;
};
```

### When Should You Use Type Aliases?

Use type aliases when working with:

- Union types.
- Intersection types.
- Primitive aliases.
- Tuple types.
- Function types.
- Mapped types.
- Conditional types.
- Complex type transformations.

### When Should You Use Interfaces?

Interfaces are often useful when working with:

- Object structures.
- Public API contracts.
- Class contracts.
- Extensible object models.
- Declaration merging.
- Library and framework type definitions.

### Final Recommendation

There is no universal rule that says interfaces are always better than type aliases or vice versa.

Both are important.

For your TypeScript development:

- Learn both.
- Understand their differences.
- Use `type` when you need type composition or non-object types.
- Use `interface` when you want an extensible object contract.

---

# 13. Type Aliases with Classes (Preview)

Type aliases can describe the structure of class instances.

Consider:

```typescript
type User = {
    id: number;
    name: string;
};
```

Now create a class:

```typescript
class UserAccount {
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
const user: User = new UserAccount(1, "Riyaz");
```

This works because the class instance has the required public structure.

This is another example of structural typing.

We will explore classes, inheritance, access modifiers, and interfaces in later phases.

---

# 14. Type Aliases with API Responses

One of the most useful applications of type aliases is defining API response structures.

Imagine an API returns this JSON:

```json
{
    "success": true,
    "message": "Users fetched successfully",
    "data": [
        {
            "id": 1,
            "name": "John",
            "email": "john@example.com"
        },
        {
            "id": 2,
            "name": "David",
            "email": "david@example.com"
        }
    ]
}
```

We can represent it using type aliases.

### Step 1: Define User

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};
```

### Step 2: Define API Response

```typescript
type ApiResponse = {
    success: boolean;
    message: string;
    data: User[];
};
```

### Step 3: Use the Type

```typescript
const response: ApiResponse = {
    success: true,
    message: "Users fetched successfully",

    data: [
        {
            id: 1,
            name: "John",
            email: "john@example.com"
        },
        {
            id: 2,
            name: "David",
            email: "david@example.com"
        }
    ]
};
```

### Step 4: Use in a Function

```typescript
function displayUsers(response: ApiResponse): void {
    response.data.forEach((user) => {
        console.log(user.name);
    });
}
```

This is a common pattern in React, Next.js, Express, and other TypeScript applications.

**Important:** Declaring an API response type does not validate incoming JSON at runtime. External data should be validated when necessary using runtime validation techniques, which we will cover later.

---

# 15. Common Mistakes

### Mistake 1: Using `=` Incorrectly

Correct:

```typescript
type User = {
    name: string;
};
```

Incorrect:

```typescript
type User {
    name: string;
}
```

A type alias requires `=`.

### Mistake 2: Confusing Union and Intersection

```typescript
type User = Person | Employee;
```

This represents alternatives.

```typescript
type User = Person & Employee;
```

This combines requirements.

### Mistake 3: Assuming Primitive Aliases Create New Types

```typescript
type UserId = number;
type ProductId = number;

let userId: UserId = 101;

let productId: ProductId = userId; // Valid
```

Both aliases represent the same underlying primitive type.

### Mistake 4: Repeating the Same Structure

Avoid defining identical object types repeatedly.

Create a reusable alias instead.

### Mistake 5: Using `type` and `interface` Interchangeably Without Understanding Their Differences

Both can define object structures, but their capabilities differ.

### Mistake 6: Assuming Type Aliases Exist at Runtime

```typescript
type User = {
    name: string;
};
```

This type is removed during compilation.

You cannot do this:

```typescript
console.log(User); // Error
```

Type aliases are compile-time constructs, not runtime objects.

---

# 16. Interview Questions and Answers

### Q1. What is a type alias in TypeScript?

A type alias allows us to create a custom name for an existing type or type structure using the `type` keyword.

### Q2. Why do we use type aliases?

They improve readability, reduce duplication, and allow us to reuse complex type definitions across an application.

### Q3. Can we create aliases for primitive types?

Yes.

```typescript
type Age = number;
type Username = string;
```

### Q4. Can a type alias represent an object?

Yes.

```typescript
type User = {
    id: number;
    name: string;
};
```

### Q5. What is a union type alias?

It represents one of multiple possible types using the `|` operator.

### Q6. What is an intersection type alias?

It combines multiple types using the `&` operator.

### Q7. What is the difference between union and intersection?

A union represents alternatives, whereas an intersection combines requirements from multiple types.

### Q8. Can type aliases represent function types?

Yes.

```typescript
type Add = (a: number, b: number) => number;
```

### Q9. Can type aliases represent arrays and tuples?

Yes.

```typescript
type Numbers = number[];

type Point = [number, number];
```

### Q10. What is the difference between type aliases and interfaces?

Both can describe object structures. Type aliases support a broader range of type expressions, while interfaces support declaration merging and are designed for extensible object contracts.

### Q11. Can interfaces represent union types?

Not directly. Type aliases are used for union types.

### Q12. What is declaration merging?

Declaration merging is a TypeScript feature that combines multiple declarations with the same interface name into one interface.

### Q13. Can we extend a type alias?

We can combine it with another type using an intersection.

```typescript
type Person = {
    name: string;
};

type Employee = Person & {
    salary: number;
};
```

### Q14. Do type aliases exist at runtime?

No. They are removed during TypeScript compilation.

### Q15. Can a type alias reference another type alias?

Yes. This is a common practice for creating reusable and nested type structures.

---

# 17. Practical Exercises

Complete these exercises yourself.

## Exercise 1: Primitive Aliases

Create these aliases:

- `UserId` → number
- `Username` → string
- `Email` → string
- `IsActive` → boolean

Create variables using each alias.

## Exercise 2: User Type

Create a `User` type containing:

- `id`: number
- `name`: string
- `age`: number
- `email`: optional string
- `isActive`: boolean

Create three users.

## Exercise 3: Union Type

Create a type called `OrderStatus`.

It should accept only:

- `"pending"`
- `"processing"`
- `"shipped"`
- `"delivered"`
- `"cancelled"`

Create a function that accepts an `OrderStatus`.

## Exercise 4: Intersection Type

Create:

- `Person`
- `Employee`
- `Contact`

Combine them into an `EmployeeDetails` type.

Create an object using that type.

## Exercise 5: Function Type Alias

Create a reusable `Calculator` type.

It should accept two numbers and return a number.

Use it to create:

- `add`
- `subtract`
- `multiply`
- `divide`

## Exercise 6: Array Type Alias

Create aliases for:

- Number array
- String array
- Boolean array
- Array of users

Create variables using each alias.

## Exercise 7: Tuple Type Alias

Create:

- `Coordinates` → two numbers
- `UserRecord` → number, string, number
- `ProductRecord` → number, string, number, boolean

Create example values.

## Exercise 8: Nested Type Aliases

Create:

- `Address`
- `Contact`
- `Skills`
- `User`

The `User` type should reuse all three other aliases.

## Exercise 9: Type Alias vs Interface

Create the same `User` structure using both:

- A type alias.
- An interface.

Then create a separate `Employee` structure extending each version.

Observe the differences in syntax.

## Exercise 10: API Response

Create a type structure for this API response:

```json
{
    "success": true,
    "message": "Products fetched successfully",
    "data": [
        {
            "id": 1,
            "name": "Laptop",
            "price": 75000,
            "inStock": true
        },
        {
            "id": 2,
            "name": "Keyboard",
            "price": 2000,
            "inStock": false
        }
    ]
}
```

Create a variable using your API response type.

## Exercise 11: Real-World Project

Build a small e-commerce type system.

Create these aliases:

1. `User`
2. `Address`
3. `Product`
4. `Category`
5. `CartItem`
6. `Order`
7. `Payment`
8. `OrderStatus`
9. `PaymentMethod`
10. `ApiResponse`

Requirements:

- Reuse aliases wherever possible.
- Use optional properties where appropriate.
- Use readonly properties for identifiers where appropriate.
- Use union types for statuses and payment methods.
- Use intersections where combining structures makes sense.

---

# 18. Phase 8 Completion Checklist

Before moving to the next phase, make sure you understand:

- [ ] What type aliases are
- [ ] Type alias syntax
- [ ] Primitive type aliases
- [ ] Object type aliases
- [ ] Optional properties
- [ ] Readonly properties
- [ ] Union type aliases
- [ ] String literal unions
- [ ] Intersection type aliases
- [ ] Function type aliases
- [ ] Array type aliases
- [ ] Tuple type aliases
- [ ] Nested type aliases
- [ ] Reusing type aliases
- [ ] Combining multiple aliases
- [ ] Type aliases vs interfaces
- [ ] Declaration merging
- [ ] Type aliases with classes
- [ ] API response typing

---

## Next Phase: Phase 9 — Interfaces in TypeScript

In the next phase, we will cover:

1. What are interfaces?
2. Creating interfaces using `interface`.
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
13. Interface vs type alias in depth.
14. Real-world interface examples.
15. Best practices and common mistakes.

**When you're ready, say: `OK, Phase 9`.**