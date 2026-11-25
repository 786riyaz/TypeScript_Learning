# Phase 10: Union Types and Intersection Types in TypeScript

**Level:** Beginner to Intermediate  
**Category:** TypeScript Fundamentals

## Learning Objectives

By the end of this phase, you will understand:

1. What union types are.
2. How to use the union operator `|`.
3. Primitive union types.
4. Object union types.
5. Literal union types.
6. Union type narrowing.
7. Type guards.
8. `typeof` narrowing.
9. `instanceof` narrowing.
10. `in` operator narrowing.
11. Discriminated unions.
12. What intersection types are.
13. How to use the intersection operator `&`.
14. Combining object types.
15. Union vs intersection.
16. Conflicting properties.
17. Real-world use cases.

---

# PART 1: UNION TYPES

# 1. What Are Union Types?

A **union type** allows a variable, parameter, or property to accept values belonging to one or more specified types.

We use the pipe (`|`) operator to create union types.

### Syntax

```typescript
type TypeName = Type1 | Type2;
```

### JavaScript Example

In JavaScript, a variable can hold values of different types:

```javascript
let userId = 101;

userId = "USER101";
```

JavaScript allows this because it is dynamically typed.

In TypeScript, we can explicitly define the allowed types:

```typescript
let userId: number | string;

userId = 101;       // Valid
userId = "USER101"; // Valid
```

But:

```typescript
userId = true; // Error
```

Why?

Because `boolean` is not part of the declared union.

### Important Concept

```typescript
number | string
```

Means:

The value can be a number OR a string.

It does not mean the value must be both.

---

# 2. Primitive Union Types

We can combine primitive types using the union operator.

### Example 1: Number or String

```typescript
let value: number | string;

value = 100;
value = "Hello";
```

### Example 2: String or Boolean

```typescript
let status: string | boolean;

status = "Active";
status = true;
```

### Example 3: Multiple Types

```typescript
let data: string | number | boolean;

data = "Riyaz";
data = 25;
data = true;
```

### Example 4: Including Null and Undefined

```typescript
let username: string | null | undefined;

username = "Riyaz";
username = null;
username = undefined;
```

This is useful when a value may be missing or intentionally empty.

### Example 5: Function Parameters

```typescript
function displayValue(value: string | number): void {
    console.log(value);
}

displayValue("Hello");
displayValue(100);
```

Invalid:

```typescript
displayValue(true); // Error
```

### Example 6: Function Return Types

```typescript
function getValue(condition: boolean): string | number {
    if (condition) {
        return 100;
    }

    return "Hello";
}
```

The function can return either a string or a number.

---

# 3. Union Types with Arrays

Union types are frequently used with arrays.

### Example 1: Array Containing Multiple Types

```typescript
const values: (string | number)[] = [
    "Riyaz",
    25,
    "Ahmedabad",
    100
];
```

Every element can be either a string or a number.

### Important Difference

Compare these two declarations:

```typescript
const values: (string | number)[] = [
    "Riyaz",
    25
];
```

```typescript
const values: string[] | number[] = [
    "Riyaz",
    "John"
];
```

They mean different things.

| Type | Meaning |
|---|---|
| `(string \| number)[]` | One array can contain strings and numbers |
| `string[] \| number[]` | The value can be an array of strings OR an array of numbers |

For example:

```typescript
const values1: (string | number)[] = [
    "Hello",
    100
]; // Valid
```

```typescript
const values2: string[] | number[] = [
    "Hello",
    100
]; // Error
```

The second declaration expects the complete array to be either a string array or a number array.

---

# 4. Literal Union Types

A literal type represents a specific value rather than a general type.

We can combine literal types using unions.

### Example 1: String Literal Union

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

Only the declared values are allowed.

### Example 2: Number Literal Union

```typescript
type Direction = 1 | 2 | 3 | 4;

let direction: Direction;

direction = 1;
direction = 3;
```

### Example 3: Boolean Literal Union

```typescript
type VerificationStatus = true | false;

let isVerified: VerificationStatus;

isVerified = true;
isVerified = false;
```

This particular example is equivalent to using `boolean`.

### Example 4: HTTP Methods

```typescript
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

function request(method: HttpMethod): void {
    console.log(`Sending ${method} request`);
}

request("GET");
request("POST");
```

Invalid:

```typescript
request("FETCH"); // Error
```

### Example 5: User Roles

```typescript
type UserRole = "admin" | "customer" | "manager" | "guest";

function checkPermission(role: UserRole): void {
    console.log(`Checking permissions for ${role}`);
}
```

### Why Are Literal Union Types Useful?

They are useful when a value should be selected from a fixed set of options.

Common examples:

- User roles
- Order statuses
- Payment methods
- API request methods
- Application themes
- Workflow states

---

# 5. Union Types with Objects

Union types can also combine different object structures.

### Example

```typescript
type Admin = {
    id: number;
    name: string;
    permissions: string[];
};

type Customer = {
    id: number;
    name: string;
    purchaseCount: number;
};

type User = Admin | Customer;
```

Now a `User` can be an `Admin` or a `Customer`.

### Admin Object

```typescript
const admin: User = {
    id: 1,
    name: "Riyaz",
    permissions: ["read", "write", "delete"]
};
```

### Customer Object

```typescript
const customer: User = {
    id: 2,
    name: "John",
    purchaseCount: 10
};
```

Both are valid.

### Accessing Common Properties

```typescript
function displayUser(user: User): void {
    console.log(user.id);
    console.log(user.name);
}
```

This works because both `Admin` and `Customer` contain `id` and `name`.

### Accessing Type-Specific Properties

```typescript
function displayUser(user: User): void {
    console.log(user.id);
    console.log(user.name);

    console.log(user.permissions); // Error
}
```

Why?

Because `permissions` exists only in `Admin`.

TypeScript cannot guarantee that every `User` has this property.

We need **type narrowing**.

---

# 6. Union Type Narrowing

Type narrowing means reducing a variable's possible types based on some condition or check.

Consider:

```typescript
function displayValue(value: string | number): void {
    console.log(value);
}
```

Inside the function, `value` could be a string or a number.

Suppose we want to call a string-specific method.

```typescript
function displayValue(value: string | number): void {
    console.log(value.toUpperCase()); // Error
}
```

Why?

Because `toUpperCase()` exists on strings, not numbers.

We need to check the type first.

```typescript
function displayValue(value: string | number): void {
    if (typeof value === "string") {
        console.log(value.toUpperCase());
    } else {
        console.log(value.toFixed(2));
    }
}
```

Now TypeScript understands:

- Inside the `if` block, `value` is a string.
- Inside the `else` block, `value` is a number.

This is called **type narrowing**.

### Before Narrowing

```typescript
string | number
```

### After Narrowing

Inside the first block:

```typescript
string
```

Inside the second block:

```typescript
number
```

### Important Point

Type narrowing does not change the original declared type permanently.

It allows TypeScript to determine a more specific type within a particular code path.

---

# 7. Type Guards

A type guard is a condition or expression that helps TypeScript determine a more specific type.

Common type guards include:

1. `typeof`
2. `instanceof`
3. `in`
4. Equality checks
5. Custom type predicates
6. Discriminated union checks

We will study the first three and equality checks in this phase.

---

# 8. `typeof` Type Guard

JavaScript provides the `typeof` operator to check the runtime type category of a value.

TypeScript uses it for type narrowing.

### Syntax

```typescript
if (typeof variable === "type") {
    // Narrowed type
}
```

### Example 1: String or Number

```typescript
function processValue(value: string | number): void {
    if (typeof value === "string") {
        console.log(value.toUpperCase());
    } else {
        console.log(value.toFixed(2));
    }
}
```

### Example 2: String, Number, or Boolean

```typescript
function displayValue(value: string | number | boolean): void {
    if (typeof value === "string") {
        console.log(value.toUpperCase());
    } else if (typeof value === "number") {
        console.log(value.toFixed(2));
    } else {
        console.log(value ? "Yes" : "No");
    }
}
```

### Common `typeof` Results

| JavaScript Value | `typeof` Result |
|---|---|
| `"Hello"` | `"string"` |
| `100` | `"number"` |
| `true` | `"boolean"` |
| `undefined` | `"undefined"` |
| `100n` | `"bigint"` |
| `Symbol()` | `"symbol"` |
| `function() {}` | `"function"` |
| `null` | `"object"` |
| `{}` | `"object"` |
| `[]` | `"object"` |

### Important: The `null` Special Case

In JavaScript:

```typescript
console.log(typeof null); // "object"
```

Therefore, `typeof value === "object"` does not prove that a value is a non-null object.

Use an explicit null check:

```typescript
function displayValue(value: string | null): void {
    if (value !== null) {
        console.log(value.toUpperCase());
    }
}
```

### Important Limitation

`typeof` is useful for primitive types, but it cannot distinguish ordinary objects by their custom structure.

For example:

```typescript
typeof { name: "Riyaz" } // "object"
typeof [1, 2, 3]         // "object"
```

For class instances, use `instanceof`. For object properties, you can use the `in` operator or other appropriate checks.

---

# 9. `instanceof` Type Guard

The `instanceof` operator checks whether an object is an instance of a particular class or constructor.

TypeScript uses it for narrowing.

### Example 1: Basic Example

```typescript
class Car {
    drive(): void {
        console.log("Car is driving");
    }
}

class Bike {
    ride(): void {
        console.log("Bike is riding");
    }
}
```

Create a union type:

```typescript
type Vehicle = Car | Bike;
```

Now create a function:

```typescript
function startVehicle(vehicle: Vehicle): void {
    if (vehicle instanceof Car) {
        vehicle.drive();
    } else {
        vehicle.ride();
    }
}
```

TypeScript understands:

- If `vehicle instanceof Car`, it is a `Car`.
- Otherwise, it is a `Bike`.

### Example 2: Built-in Classes

```typescript
function processDate(value: Date | string): void {
    if (value instanceof Date) {
        console.log(value.getFullYear());
    } else {
        console.log(value.toUpperCase());
    }
}
```

### `typeof` vs `instanceof`

| `typeof` | `instanceof` |
|---|---|
| Checks JavaScript primitive type categories | Checks whether an object belongs to a constructor's prototype chain |
| Useful for strings, numbers, booleans, etc. | Useful for classes and built-in constructors |
| Returns a string | Returns a boolean |
| Example: `typeof value === "string"` | Example: `value instanceof Date` |

**Important:** `instanceof` is not a general-purpose structural type checker. It works with runtime constructors and their prototype chains.

---

# 10. `in` Operator Type Guard

The `in` operator checks whether a property exists on an object or somewhere in its prototype chain.

TypeScript can use this check to narrow union object types.

### Example

```typescript
type Admin = {
    id: number;
    name: string;
    permissions: string[];
};

type Customer = {
    id: number;
    name: string;
    purchaseCount: number;
};

type User = Admin | Customer;
```

Now:

```typescript
function displayUser(user: User): void {
    if ("permissions" in user) {
        console.log(user.permissions);
    } else {
        console.log(user.purchaseCount);
    }
}
```

TypeScript understands:

- If `permissions` exists, the object is an `Admin`.
- Otherwise, it is a `Customer`.

### Another Example

```typescript
type EmailNotification = {
    email: string;
};

type SmsNotification = {
    phone: string;
};

type Notification = EmailNotification | SmsNotification;

function sendNotification(notification: Notification): void {
    if ("email" in notification) {
        console.log(`Sending email to ${notification.email}`);
    } else {
        console.log(`Sending SMS to ${notification.phone}`);
    }
}
```

### Important

The `in` operator checks for property presence, not necessarily whether its value is non-undefined.

For example:

```typescript
const user = {
    name: "Riyaz",
    email: undefined
};

console.log("email" in user); // true
```

The property exists even though its value is `undefined`.

---

# 11. Equality Narrowing

TypeScript can also narrow types through equality checks.

### Example 1: String or Null

```typescript
function greet(name: string | null): void {
    if (name !== null) {
        console.log(name.toUpperCase());
    } else {
        console.log("Name is not available");
    }
}
```

### Example 2: Literal Union

```typescript
type Status = "success" | "error" | "loading";

function handleStatus(status: Status): void {
    if (status === "success") {
        console.log("Operation completed");
    } else if (status === "error") {
        console.log("Something went wrong");
    } else {
        console.log("Please wait");
    }
}
```

### Example 3: Boolean Narrowing

```typescript
function checkStatus(status: boolean | string): void {
    if (status === true) {
        console.log("Active");
    } else if (status === false) {
        console.log("Inactive");
    } else {
        console.log(status.toUpperCase());
    }
}
```

TypeScript narrows the value based on the comparison.

---

# 12. Discriminated Unions

Discriminated unions are one of the most important TypeScript concepts.

They allow us to represent multiple object types using a common property whose value identifies the specific object type.

That common property is called a **discriminant** or **discriminant property**.

### Example

```typescript
type Admin = {
    role: "admin";
    name: string;
    permissions: string[];
};

type Customer = {
    role: "customer";
    name: string;
    purchaseCount: number;
};
```

Combine them:

```typescript
type User = Admin | Customer;
```

Notice that both types contain a common property:

```typescript
role
```

But their `role` values are different literal types.

- Admin → `"admin"`
- Customer → `"customer"`

This property acts as the discriminant.

### Example: Narrowing

```typescript
function displayUser(user: User): void {
    if (user.role === "admin") {
        console.log(user.permissions);
    } else {
        console.log(user.purchaseCount);
    }
}
```

TypeScript understands which object type is being used.

### Example: Switch Statement

```typescript
function displayUser(user: User): void {
    switch (user.role) {
        case "admin":
            console.log(user.permissions);
            break;

        case "customer":
            console.log(user.purchaseCount);
            break;
    }
}
```

### Why Are Discriminated Unions Useful?

They are particularly useful when:

- Multiple objects have different structures.
- Each object represents a different state.
- We want reliable type narrowing.
- We want exhaustive checking.

Common real-world examples:

- Payment methods
- API responses
- Authentication states
- Order statuses
- Notification types
- UI component states

---

# 13. Discriminated Union: API Response Example

Consider an API that can return either success or failure.

### Step 1: Define Success Response

```typescript
type SuccessResponse = {
    status: "success";
    data: {
        id: number;
        name: string;
    };
};
```

### Step 2: Define Error Response

```typescript
type ErrorResponse = {
    status: "error";
    message: string;
};
```

### Step 3: Combine Them

```typescript
type ApiResponse = SuccessResponse | ErrorResponse;
```

### Step 4: Create a Function

```typescript
function handleResponse(response: ApiResponse): void {
    if (response.status === "success") {
        console.log(response.data.name);
    } else {
        console.log(response.message);
    }
}
```

Now TypeScript understands which properties are available in each branch.

### Example Calls

```typescript
handleResponse({
    status: "success",
    data: {
        id: 1,
        name: "Riyaz"
    }
});
```

```typescript
handleResponse({
    status: "error",
    message: "User not found"
});
```

### Important

A discriminated union usually uses:

1. Multiple object types.
2. A common property.
3. Different literal values for that property.
4. A union combining the object types.

---

# 14. Exhaustive Checking with Discriminated Unions

Exhaustive checking ensures that every possible union member has been handled.

We use `never` to detect missing cases.

### Example

```typescript
type PaymentMethod =
    | {
        type: "upi";
        upiId: string;
    }
    | {
        type: "card";
        cardNumber: string;
    }
    | {
        type: "cash";
    };
```

Create a helper function:

```typescript
function assertNever(value: never): never {
    throw new Error(`Unexpected value: ${value}`);
}
```

Now handle the union:

```typescript
function processPayment(payment: PaymentMethod): void {
    switch (payment.type) {
        case "upi":
            console.log(payment.upiId);
            break;

        case "card":
            console.log(payment.cardNumber);
            break;

        case "cash":
            console.log("Cash payment");
            break;

        default:
            assertNever(payment);
    }
}
```

This is exhaustive because all three cases are handled.

### What Happens When We Add Another Type?

```typescript
type PaymentMethod =
    | {
        type: "upi";
        upiId: string;
    }
    | {
        type: "card";
        cardNumber: string;
    }
    | {
        type: "cash";
    }
    | {
        type: "netbanking";
        bankName: string;
    };
```

Now the existing switch statement produces an error in the default branch.

Why?

Because `payment` could still be the `"netbanking"` variant. It is no longer `never`.

We must handle it:

```typescript
case "netbanking":
    console.log(payment.bankName);
    break;
```

**Best Practice:** Use exhaustive checking when handling important application states, especially payments, API responses, and workflows.

---

# PART 2: INTERSECTION TYPES

# 15. What Are Intersection Types?

An **intersection type** combines multiple types into one type.

We use the ampersand (`&`) operator.

### Syntax

```typescript
type CombinedType = Type1 & Type2;
```

A value of an intersection type must satisfy all the combined type requirements.

### Example

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

Now `EmployeeDetails` requires all four properties.

```typescript
const employee: EmployeeDetails = {
    name: "Riyaz",
    age: 25,
    salary: 50000,
    department: "IT"
};
```

### Important Concept

```typescript
Person & Employee
```

Means:

The resulting value must satisfy both `Person` AND `Employee`.

---

# 16. Combining Multiple Object Types

We can combine multiple object types using intersections.

### Example 1: User and Contact

```typescript
type User = {
    id: number;
    name: string;
};

type Contact = {
    email: string;
    phone: string;
};

type UserDetails = User & Contact;
```

Example:

```typescript
const user: UserDetails = {
    id: 1,
    name: "Riyaz",
    email: "riyaz@example.com",
    phone: "9876543210"
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

The resulting `User` type contains all properties.

### Example 3: Adding Extra Properties

Suppose we have an existing user type.

```typescript
type User = {
    id: number;
    name: string;
};
```

Now we want an admin type with additional properties.

```typescript
type Admin = User & {
    permissions: string[];
    isAdmin: boolean;
};
```

Example:

```typescript
const admin: Admin = {
    id: 1,
    name: "Riyaz",
    permissions: ["read", "write", "delete"],
    isAdmin: true
};
```

### Example 4: Intersections with Primitive Types

Intersections are not limited to objects.

```typescript
type Impossible = string & number;
```

No ordinary value can satisfy both `string` and `number`, so this type is effectively `never`.

This illustrates that intersections mean satisfying all requirements simultaneously.

---

# 17. Intersection Types with Interfaces

You can combine interfaces using intersections too.

### Example

```typescript
interface Person {
    name: string;
}

interface Employee {
    salary: number;
}

type EmployeeDetails = Person & Employee;
```

Implementation:

```typescript
const employee: EmployeeDetails = {
    name: "Riyaz",
    salary: 50000
};
```

You can also extend multiple interfaces directly:

```typescript
interface EmployeeDetails extends Person, Employee {}
```

Both approaches are useful.

### `extends` vs Intersection

| Interface `extends` | Intersection `&` |
|---|---|
| Used in interface declarations | Used in type expressions |
| Creates an inherited interface contract | Combines existing types |
| Checks inherited property compatibility | Combines requirements, potentially creating conflicting properties |
| Example: `interface C extends A, B` | Example: `type C = A & B` |

---

# 18. Conflicting Properties in Intersection Types

This is an important concept.

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

What should the type of `value` be?

It must be:

```typescript
string & number
```

But no ordinary value is both a string and a number.

Therefore, `value` effectively becomes `never`.

### Example

```typescript
const data: C = {
    value: "Hello"
}; // Error
```

Even this fails:

```typescript
const data: C = {
    value: 100
}; // Error
```

### Why Does This Happen?

An intersection requires a value to satisfy all the properties of all combined types.

Since the property requirements conflict, there is no valid ordinary value.

### How to Avoid This Problem

If you want to override a property, an intersection may not be the right tool.

One option is to use `Omit`, which we will study in the utility types phase.

Example:

```typescript
type A = {
    id: number;
    value: string;
};

type B = {
    value: number;
};

type C = Omit<A, "value"> & B;
```

Now `C` contains:

```typescript
{
    id: number;
    value: number;
}
```

This works because the original `value` property was removed before combining the types.

---

# 19. Union vs Intersection

This is one of the most important TypeScript concepts.

### Union

```typescript
type User = Admin | Customer;
```

A value must satisfy at least one union member.

### Intersection

```typescript
type User = Admin & Customer;
```

A value must satisfy both types.

### Visual Understanding

**Union (`|`)**

```text
        Admin
          \
           \
            User
           /
          /
      Customer
```

A user can be an admin OR a customer.

**Intersection (`&`)**

```text
        Admin
          |
          |
          &
          |
          |
      Customer
```

The resulting value must satisfy both Admin and Customer.

### Comparison Table

| Feature | Union `\|` | Intersection `&` |
|---|---|---|
| Meaning | OR | AND |
| Combines | Alternative types | Multiple requirements |
| Object properties | May differ between members | Combines properties |
| Narrowing | Often requires checks | Usually exposes combined members directly |
| Common use | Different states or variants | Combining object structures |
| Example | `string \| number` | `Person & Employee` |

### Practical Example

Suppose we have:

```typescript
type Admin = {
    name: string;
    permissions: string[];
};

type Customer = {
    name: string;
    purchaseCount: number;
};
```

Union:

```typescript
type User = Admin | Customer;
```

A user can be either an admin or a customer.

Intersection:

```typescript
type User = Admin & Customer;
```

A user must have both `permissions` and `purchaseCount`.

---

# 20. Real-World Example: Authentication System

Let's use union and intersection types together.

### Step 1: Define Basic User

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};
```

### Step 2: Define Roles

```typescript
type Admin = {
    role: "admin";
    permissions: string[];
};

type Customer = {
    role: "customer";
    purchaseCount: number;
};
```

### Step 3: Create a Union

```typescript
type AuthUser = User & (Admin | Customer);
```

This means:

- Every authenticated user must contain the basic `User` properties.
- The user must also be either an `Admin` or a `Customer`.

### Step 4: Create a Function

```typescript
function displayDashboard(user: AuthUser): void {
    console.log(`Welcome ${user.name}`);

    if (user.role === "admin") {
        console.log("Admin permissions:", user.permissions);
    } else {
        console.log("Purchase count:", user.purchaseCount);
    }
}
```

### Step 5: Create an Admin

```typescript
const admin: AuthUser = {
    id: 1,
    name: "Riyaz",
    email: "riyaz@example.com",
    role: "admin",
    permissions: ["read", "write", "delete"]
};
```

### Step 6: Create a Customer

```typescript
const customer: AuthUser = {
    id: 2,
    name: "John",
    email: "john@example.com",
    role: "customer",
    purchaseCount: 15
};
```

This is a common pattern in authentication and authorization systems.

---

# 21. Real-World Example: API Response Handling

Let's create a reusable API response type.

### Step 1: Define Success Response

```typescript
type SuccessResponse<T> = {
    status: "success";
    data: T;
};
```

### Step 2: Define Error Response

```typescript
type ErrorResponse = {
    status: "error";
    message: string;
};
```

### Step 3: Combine Them

```typescript
type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
```

Here, `T` is a generic type parameter.

We will study generics in detail in a later phase. For now, understand that it allows the response to carry different data types.

### Step 4: Create User Response

```typescript
type User = {
    id: number;
    name: string;
};

type UserResponse = ApiResponse<User>;
```

### Step 5: Handle the Response

```typescript
function handleUserResponse(response: UserResponse): void {
    if (response.status === "success") {
        console.log(response.data.name);
    } else {
        console.log(response.message);
    }
}
```

### Success Example

```typescript
const successResponse: UserResponse = {
    status: "success",
    data: {
        id: 1,
        name: "Riyaz"
    }
};
```

### Error Example

```typescript
const errorResponse: UserResponse = {
    status: "error",
    message: "User not found"
};
```

This pattern is frequently used in backend and frontend TypeScript applications.

**Important:** TypeScript types describe the expected response structure. They do not validate external JSON at runtime.

---

# 22. Common Mistakes

### Mistake 1: Confusing Union and Intersection

Incorrect understanding:

```typescript
type User = Admin | Customer;
```

This does not mean every user must have all properties of both types.

It means the value can satisfy either union member.

### Mistake 2: Incorrect Array Union Syntax

```typescript
const values: string | number[] = [];
```

This means the value is either a string or a number array.

It does not mean an array containing strings and numbers.

Correct:

```typescript
const values: (string | number)[] = [];
```

### Mistake 3: Accessing Type-Specific Properties Without Narrowing

```typescript
type User = Admin | Customer;

function display(user: User) {
    console.log(user.permissions); // Error
}
```

Correct:

```typescript
function display(user: User) {
    if ("permissions" in user) {
        console.log(user.permissions);
    }
}
```

### Mistake 4: Using `typeof` to Identify Custom Objects

```typescript
if (typeof value === "object") {
    // This does not tell us which custom object type it is.
}
```

Use an appropriate property check, discriminant, or custom type guard.

### Mistake 5: Assuming `instanceof` Works for Interfaces

Interfaces do not exist at runtime.

Therefore, this is invalid:

```typescript
interface User {
    name: string;
}

if (user instanceof User) {
    // Error
}
```

Use structural checks or discriminated unions instead.

### Mistake 6: Ignoring Conflicting Intersection Properties

```typescript
type A = {
    id: string;
};

type B = {
    id: number;
};

type C = A & B;
```

The `id` property effectively becomes `never`.

Avoid combining incompatible property declarations.

---

# 23. Interview Questions and Answers

### Q1. What is a union type?

A union type allows a value to belong to one of multiple specified types. It uses the `|` operator.

### Q2. What is an intersection type?

An intersection type combines multiple types into one using the `&` operator.

### Q3. What is the difference between union and intersection?

A union represents alternatives (OR), while an intersection combines requirements (AND).

### Q4. What is type narrowing?

Type narrowing is the process of reducing a variable's possible types using conditions or checks.

### Q5. What is a type guard?

A type guard is a condition or expression that helps TypeScript determine a more specific type.

### Q6. What is the `typeof` operator?

It is a JavaScript operator that returns a string describing the runtime type category of a value. TypeScript also uses it for narrowing.

### Q7. What is the `instanceof` operator?

It checks whether an object belongs to a constructor's prototype chain.

### Q8. What is the `in` operator?

It checks whether a property exists on an object or its prototype chain and can help narrow union object types.

### Q9. What is a discriminated union?

A discriminated union combines multiple object types that share a common property with different literal values.

### Q10. What is a discriminant?

A discriminant is the common property used to distinguish members of a discriminated union.

### Q11. Can union types contain object types?

Yes. Multiple object structures can be combined using a union.

### Q12. Can intersection types combine multiple interfaces?

Yes. Use the `&` operator.

### Q13. What happens when intersection types contain conflicting properties?

The conflicting property must satisfy both types. If the requirements are incompatible, the property can become `never`.

### Q14. Can interfaces represent union types directly?

No. Use a type alias to define a union of interfaces or object types.

### Q15. What is exhaustive checking?

Exhaustive checking ensures that all possible members of a union have been handled. The `never` type is commonly used for this purpose.

### Q16. What is the difference between `(string | number)[]` and `string[] | number[]`?

The first allows one array containing strings and numbers. The second allows either a string array or a number array.

### Q17. Can we use `instanceof` with interfaces?

No. Interfaces are erased during compilation and do not exist at runtime.

### Q18. Why are discriminated unions useful?

They make it easier to represent different object states and safely access type-specific properties through narrowing.

---

# 24. Practical Exercises

Complete these exercises yourself.

## Exercise 1: Basic Union

Create a variable that accepts:

- String
- Number
- Boolean

Assign different values to it.

## Exercise 2: Union Function

Create a function called `displayValue`.

It should accept:

- String
- Number

If the value is a string, convert it to uppercase.

If it is a number, format it to two decimal places.

## Exercise 3: Literal Union

Create a type called `OrderStatus`.

Allowed values:

- `"pending"`
- `"confirmed"`
- `"processing"`
- `"shipped"`
- `"delivered"`
- `"cancelled"`

Create a function that accepts this type.

## Exercise 4: Array Union

Create two arrays:

1. An array that can contain both strings and numbers.
2. A variable that can hold either an array of strings or an array of numbers.

Observe the difference.

## Exercise 5: Object Union

Create:

- `Admin`
- `Customer`

Combine them using a union.

Add a function that identifies which type of user was passed.

## Exercise 6: `typeof` Narrowing

Create a function that accepts:

```typescript
string | number | boolean
```

Use `typeof` to handle all three types.

## Exercise 7: `instanceof` Narrowing

Create two classes:

- `Car`
- `Bike`

Each class should have a different method.

Create a function that accepts a union of both classes and uses `instanceof` to call the correct method.

## Exercise 8: `in` Operator

Create:

- `EmailNotification`
- `SmsNotification`
- `PushNotification`

Use the `in` operator to identify each notification type.

## Exercise 9: Discriminated Union

Create a payment system with:

- UPI
- Card
- Cash
- Net Banking

Use a common property called `type`.

Create a function that processes each payment type.

## Exercise 10: Exhaustive Checking

Create an `OrderStatus` union.

Handle all statuses using a switch statement.

Use `never` to ensure every possible status is handled.

## Exercise 11: Intersection

Create:

- `Person`
- `Employee`
- `Contact`

Combine all three using intersections.

Create an object that satisfies the combined type.

## Exercise 12: Conflicting Properties

Create two types:

```typescript
type A = {
    value: string;
};

type B = {
    value: number;
};
```

Combine them using an intersection.

Observe what happens to `value`.

## Exercise 13: Real-World Project

Build a small API response handler.

Requirements:

- Create success and error response types.
- Use a discriminated union.
- Include user data in the success response.
- Include an error message in the error response.
- Create a function to process the response.
- Use exhaustive checking where appropriate.

---

# 25. Phase 10 Completion Checklist

Before proceeding, make sure you understand:

- [ ] What union types are
- [ ] Union operator `|`
- [ ] Primitive union types
- [ ] Union types with arrays
- [ ] Literal union types
- [ ] Union types with objects
- [ ] Type narrowing
- [ ] Type guards
- [ ] `typeof` narrowing
- [ ] `instanceof` narrowing
- [ ] `in` operator narrowing
- [ ] Equality narrowing
- [ ] Discriminated unions
- [ ] Exhaustive checking
- [ ] `never` in exhaustive checking
- [ ] What intersection types are
- [ ] Intersection operator `&`
- [ ] Combining object types
- [ ] Combining interfaces
- [ ] Conflicting intersection properties
- [ ] Union vs intersection
- [ ] Real-world API response patterns

---

## Next Phase: Phase 11 — Type Narrowing and Type Guards in Depth

In the next phase, we will study type narrowing more deeply:

1. What is type narrowing?
2. Control-flow analysis.
3. `typeof` type guards.
4. `instanceof` type guards.
5. `in` operator.
6. Equality narrowing.
7. Truthiness narrowing.
8. Null and undefined checks.
9. Custom type guards.
10. Type predicates using `is`.
11. Assertion functions using `asserts`.
12. Discriminated union narrowing.
13. Exhaustiveness checking.
14. Type narrowing with arrays.
15. Real-world type guard implementations.

**When you're ready, say: `OK, Phase 11`.**