# TypeScript Complete Learning Roadmap
# Phase 11: Type Narrowing and Type Guards in Depth

**Level:** Intermediate to Advanced  
**Prerequisite:** Phase 10 – Union Types and Intersection Types  
**Goal:** Learn how TypeScript identifies the actual type of a value at different points in your code and how to perform safe runtime type checks.

---

# 1. What Is Type Narrowing?

Type narrowing is the process of reducing a variable's possible types based on runtime checks.

For example, suppose a variable can contain either a string or a number.

```typescript
let value: string | number;

value = "Hello";
value = 100;
```

Because `value` has a union type, TypeScript knows it could be a `string` or a `number`.

Consider this:

```typescript
function printValue(value: string | number) {
    console.log(value.toUpperCase());
}
```

TypeScript produces an error because `toUpperCase()` is available on strings, not numbers.

We need to check the actual type before using type-specific methods.

```typescript
function printValue(value: string | number) {
    if (typeof value === "string") {
        console.log(value.toUpperCase());
    } else {
        console.log(value.toFixed(2));
    }
}
```

Here:

- Inside the `if` block, TypeScript knows `value` is a `string`.
- Inside the `else` block, TypeScript knows `value` is a `number`.

This process is called **Type Narrowing**.

### Before and After Narrowing

| Situation | TypeScript understands |
|---|---|
| Before checking | `string \| number` |
| Inside `typeof value === "string"` | `string` |
| Inside the `else` block | `number` |

**Important:** Type narrowing happens during compile-time analysis, but the checks themselves execute at runtime.

---

# 2. Control Flow Analysis

TypeScript uses a mechanism called **Control Flow Analysis (CFA)** to understand how values move through your program.

It tracks:

- Conditions
- Assignments
- Function returns
- Branches
- Unreachable code
- Type guards

This allows TypeScript to determine the most accurate type of a variable at a particular location.

### Example 1: Narrowing Through Conditions

```typescript
function calculate(value: string | number) {
    if (typeof value === "string") {
        console.log(value.toUpperCase());
    } else {
        console.log(value.toFixed(2));
    }
}
```

TypeScript tracks the condition and narrows the type accordingly.

### Example 2: Narrowing Through Return

```typescript
function process(value: string | number) {
    if (typeof value === "string") {
        return value.toUpperCase();
    }

    return value.toFixed(2);
}
```

After the first `if` block, TypeScript knows that the remaining possible type is `number`.

Why?

Because the string case has already returned.

### Example 3: Narrowing Through Assignment

```typescript
let value: string | number;

value = "Hello";

console.log(value.toUpperCase());
```

Although the declared type is `string | number`, TypeScript knows that the current value is a string.

Now consider:

```typescript
let value: string | number;

value = "Hello";

value = 100;

console.log(value.toFixed(2));
```

After assigning `100`, TypeScript understands the current type as `number`.

### Example 4: Control Flow With Multiple Conditions

```typescript
function process(value: string | number | boolean) {
    if (typeof value === "string") {
        console.log("String:", value.toUpperCase());
    } else if (typeof value === "number") {
        console.log("Number:", value.toFixed(2));
    } else {
        console.log("Boolean:", value);
    }
}
```

TypeScript tracks the remaining possibilities after every condition.

**Key takeaway:** TypeScript doesn't simply look at a variable's declared type. It also analyzes the program's execution paths.

---

# 3. typeof Type Guard

The `typeof` operator is a JavaScript operator that returns the type category of a value as a string.

TypeScript recognizes certain `typeof` checks as type guards.

### Common typeof Results

| JavaScript value | typeof result |
|---|---|
| `"Hello"` | `"string"` |
| `100` | `"number"` |
| `true` | `"boolean"` |
| `undefined` | `"undefined"` |
| `100n` | `"bigint"` |
| `Symbol()` | `"symbol"` |
| `{}` | `"object"` |
| `[]` | `"object"` |
| `null` | `"object"` |
| `function() {}` | `"function"` |

### Example 1: String and Number

```typescript
function display(value: string | number) {
    if (typeof value === "string") {
        console.log(value.toUpperCase());
    } else {
        console.log(value.toFixed(2));
    }
}
```

### Example 2: Multiple Types

```typescript
function processValue(
    value: string | number | boolean
) {
    if (typeof value === "string") {
        console.log("String:", value.length);
    } else if (typeof value === "number") {
        console.log("Number:", value.toFixed(2));
    } else {
        console.log("Boolean:", value.valueOf());
    }
}
```

### Important: typeof null

JavaScript has a historical behavior:

```typescript
console.log(typeof null); // "object"
```

Therefore, this is not a safe way to identify a non-null object:

```typescript
function process(value: object | null) {
    if (typeof value === "object") {
        console.log("Object");
    }
}
```

The condition also matches `null`.

Use:

```typescript
function process(value: object | null) {
    if (value !== null && typeof value === "object") {
        console.log("Valid object");
    }
}
```

### Important: Arrays

Arrays also return `"object"`.

```typescript
console.log(typeof []); // "object"
```

Use `Array.isArray()` to identify arrays.

```typescript
function process(value: string | string[]) {
    if (Array.isArray(value)) {
        console.log(value.length);
    } else {
        console.log(value.toUpperCase());
    }
}
```

**Remember:** `typeof` is particularly useful for narrowing primitive types.

---

# 4. instanceof Type Guard

The `instanceof` operator checks whether an object belongs to a particular class or has that class's prototype in its prototype chain.

TypeScript uses it as a type guard.

### Example 1: Basic Usage

```typescript
class Car {
    drive() {
        console.log("Car is driving");
    }
}

class Bike {
    ride() {
        console.log("Bike is riding");
    }
}

function startVehicle(vehicle: Car | Bike) {
    if (vehicle instanceof Car) {
        vehicle.drive();
    } else {
        vehicle.ride();
    }
}
```

TypeScript understands:

- `vehicle` is `Car` inside the `if` block.
- `vehicle` is `Bike` inside the `else` block.

### Example 2: Date

```typescript
function displayDate(value: string | Date) {
    if (value instanceof Date) {
        console.log(value.toISOString());
    } else {
        console.log(value.toUpperCase());
    }
}
```

### Example 3: Error

```typescript
function handleError(error: Error | string) {
    if (error instanceof Error) {
        console.log(error.message);
    } else {
        console.log(error.toUpperCase());
    }
}
```

### Important Points

1. `instanceof` works with runtime constructors.
2. It can narrow class instance types.
3. It cannot check TypeScript interfaces because interfaces do not exist at runtime.
4. It is not a general-purpose check for arbitrary object structures.

For example:

```typescript
interface User {
    name: string;
}

// Invalid: User is only a TypeScript interface.
```

You cannot reliably write:

```typescript
// user instanceof User
```

There is no runtime `User` constructor generated from that interface.

**When to use:** Use `instanceof` when checking actual class instances, such as `Date`, `Error`, and your own classes.

---

# 5. in Operator Type Guard

The JavaScript `in` operator checks whether a property exists on an object or anywhere in its prototype chain.

TypeScript also uses it to narrow union types.

### Example 1: Basic Usage

```typescript
type Admin = {
    name: string;
    permissions: string[];
};

type Customer = {
    name: string;
    purchaseHistory: string[];
};

function displayUser(user: Admin | Customer) {
    if ("permissions" in user) {
        console.log(user.permissions);
    } else {
        console.log(user.purchaseHistory);
    }
}
```

TypeScript understands:

- If `permissions` exists, the value is an `Admin`.
- Otherwise, it is a `Customer`.

### Example 2: Using Different Properties

```typescript
type EmailNotification = {
    email: string;
    subject: string;
};

type SMSNotification = {
    phone: string;
    message: string;
};

function sendNotification(
    notification: EmailNotification | SMSNotification
) {
    if ("email" in notification) {
        console.log("Sending email to:", notification.email);
    } else {
        console.log("Sending SMS to:", notification.phone);
    }
}
```

### Important: Property Existence vs Property Value

Consider:

```typescript
const user = {
    name: "Alex",
    email: undefined
};

console.log("email" in user); // true
```

The `in` operator checks whether the property exists, not whether its value is defined.

### Important: Optional Properties

```typescript
type Admin = {
    name: string;
    permissions?: string[];
};

type Customer = {
    name: string;
    purchaseHistory: string[];
};

function process(user: Admin | Customer) {
    if ("permissions" in user) {
        // Could be Admin, but permissions may be undefined.
        console.log(user.permissions);
    }
}
```

Because `permissions` is optional, checking its existence does not guarantee that its value is an array.

You may need another check:

```typescript
if (
    "permissions" in user &&
    user.permissions !== undefined
) {
    console.log(user.permissions);
}
```

**Key takeaway:** Use `in` to distinguish object structures based on their properties.

---

# 6. Equality Narrowing

TypeScript can narrow types using equality operators.

Common operators include:

- `===`
- `!==`
- `==`
- `!=`

Prefer strict equality (`===` and `!==`) in most TypeScript applications.

### Example 1: Literal Equality

```typescript
function process(value: string | number) {
    if (value === "admin") {
        console.log("Admin user");
    } else if (value === 100) {
        console.log("Value is 100");
    } else {
        console.log("Other value");
    }
}
```

### Example 2: Comparing Two Variables

```typescript
function compare(
    x: string | number,
    y: string | boolean
) {
    if (x === y) {
        console.log(x);
        console.log(y);
    }
}
```

Inside the condition, TypeScript can infer that both values must be strings.

Why?

Because `string` is the only common type between the two unions.

### Example 3: Null Checks

```typescript
function display(value: string | null) {
    if (value !== null) {
        console.log(value.toUpperCase());
    }
}
```

Inside the condition, `value` is a string.

**Important:** Equality checks are especially useful for narrowing literal unions and handling nullable values.

---

# 7. Truthiness Narrowing

JavaScript evaluates values as either truthy or falsy in conditional statements.

TypeScript uses these conditions to narrow types.

### Falsy Values in JavaScript

There are seven commonly encountered falsy values:

| Value | Type |
|---|---|
| `false` | boolean |
| `0` | number |
| `-0` | number |
| `0n` | bigint |
| `""` | string |
| `null` | null |
| `undefined` | undefined |
| `NaN` | number |

### Example 1: Basic Truthiness

```typescript
function printName(name: string | null) {
    if (name) {
        console.log(name.toUpperCase());
    } else {
        console.log("Name is empty or missing");
    }
}
```

Inside the `if` block, TypeScript knows that `name` is a string.

However, an empty string also enters the `else` block.

### Example 2: Number and Undefined

```typescript
function calculate(value: number | undefined) {
    if (value) {
        console.log(value.toFixed(2));
    }
}
```

There is a potential logical problem.

If `value` is `0`, the condition is false.

If zero is a valid value, use an explicit check:

```typescript
function calculate(value: number | undefined) {
    if (value !== undefined) {
        console.log(value.toFixed(2));
    }
}
```

### Best Practice

Use truthiness checks when you intentionally want to exclude all falsy values.

Use explicit comparisons when values such as `0`, `false`, or `""` are valid inputs.

---

# 8. Null and Undefined Checks

JavaScript has two important values:

- `null`: Represents an intentional absence of a value.
- `undefined`: Represents a value that has not been assigned or is missing.

With `strictNullChecks: true`, TypeScript treats them as separate types.

### Example 1: Checking null

```typescript
function printName(name: string | null) {
    if (name !== null) {
        console.log(name.toUpperCase());
    }
}
```

### Example 2: Checking undefined

```typescript
function printAge(age: number | undefined) {
    if (age !== undefined) {
        console.log(age.toFixed(2));
    }
}
```

### Example 3: Checking Both

```typescript
function display(value: string | null | undefined) {
    if (value !== null && value !== undefined) {
        console.log(value.toUpperCase());
    }
}
```

You can also use:

```typescript
if (value != null) {
    console.log(value.toUpperCase());
}
```

With JavaScript's loose equality rules, `value != null` excludes both `null` and `undefined`.

### Optional Chaining

Optional chaining (`?.`) safely accesses properties when a value might be null or undefined.

```typescript
type User = {
    name: string;
    address?: {
        city: string;
    };
};

const user: User = {
    name: "Alex"
};

console.log(user.address?.city);
```

Output:

```text
undefined
```

Without optional chaining, accessing `user.address.city` could produce a runtime error.

### Nullish Coalescing

The `??` operator provides a fallback only when the left-hand value is `null` or `undefined`.

```typescript
const username = null;

const result = username ?? "Guest";

console.log(result); // Guest
```

### Difference Between || and ??

| Operator | Uses fallback when |
|---|---|
| `||` | Left side is any falsy value |
| `??` | Left side is `null` or `undefined` |

Example:

```typescript
const count = 0;

console.log(count || 10); // 10
console.log(count ?? 10); // 0
```

**Best practice:** Use `??` when zero, false, or an empty string are valid values.

---

# 9. Custom Type Guards

Sometimes built-in type guards are not enough.

For example, imagine receiving user data from an API.

You want to check whether an unknown value represents a valid user.

You can create your own type guard.

### Example 1: Basic Custom Type Guard

```typescript
type User = {
    id: number;
    name: string;
};

function isUser(value: unknown): value is User {
    return (
        typeof value === "object" &&
        value !== null &&
        "id" in value &&
        "name" in value
    );
}
```

The important syntax is:

```typescript
value is User
```

This is called a **Type Predicate**.

It tells TypeScript:

"If this function returns true, treat the value as a User."

### Example 2: Using a Custom Type Guard

```typescript
function displayUser(value: unknown) {
    if (isUser(value)) {
        console.log(value.id);
        console.log(value.name);
    } else {
        console.log("Invalid user");
    }
}
```

TypeScript now recognizes `value` as a `User` inside the `if` block.

### Example 3: Stronger Runtime Validation

The previous example only checked whether the properties existed. It did not validate their types.

A stronger implementation:

```typescript
type User = {
    id: number;
    name: string;
};

function isUser(value: unknown): value is User {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    if (!("id" in value) || !("name" in value)) {
        return false;
    }

    return (
        typeof value.id === "number" &&
        typeof value.name === "string"
    );
}
```

Now the function checks:

1. The value is an object.
2. The value is not null.
3. The `id` property exists.
4. The `name` property exists.
5. The `id` is a number.
6. The `name` is a string.

### Important: Type Predicates Are Not Automatically Verified

TypeScript trusts your declared type predicate.

It does not prove that your runtime checks are correct.

For example:

```typescript
function isUser(value: unknown): value is User {
    return true;
}
```

This is technically accepted by TypeScript, but it is unsafe because every value will be treated as a `User`.

**Best practice:** A custom type guard must perform real runtime validation.

---

# 10. Type Predicates Using `is`

Let's understand type predicates in more detail.

A type predicate has this structure:

```typescript
function functionName(
    value: SomeType
): value is AnotherType {
    // Runtime validation
}
```

The `is` keyword tells TypeScript which type should be assumed when the function returns `true`.

### Example 1: String Guard

```typescript
function isString(value: unknown): value is string {
    return typeof value === "string";
}

const value: unknown = "Hello";

if (isString(value)) {
    console.log(value.toUpperCase());
}
```

### Example 2: Number Guard

```typescript
function isNumber(value: unknown): value is number {
    return typeof value === "number";
}

const value: unknown = 100;

if (isNumber(value)) {
    console.log(value.toFixed(2));
}
```

### Example 3: Admin Guard

```typescript
type Admin = {
    id: number;
    role: "admin";
    permissions: string[];
};

type Customer = {
    id: number;
    role: "customer";
    orders: number;
};

function isAdmin(user: Admin | Customer): user is Admin {
    return user.role === "admin";
}
```

Usage:

```typescript
function checkAccess(user: Admin | Customer) {
    if (isAdmin(user)) {
        console.log(user.permissions);
    } else {
        console.log(user.orders);
    }
}
```

### Type Predicate vs Boolean Return Type

Compare:

```typescript
function isString(value: unknown): boolean {
    return typeof value === "string";
}
```

And:

```typescript
function isString(value: unknown): value is string {
    return typeof value === "string";
}
```

The first function only returns a boolean.

The second function communicates a type-narrowing relationship to TypeScript.

That distinction is important.

---

# 11. Assertion Functions Using asserts

Custom type guards narrow a type when they return `true`.

Assertion functions work differently.

They tell TypeScript that if the function returns normally, a particular condition or type must hold.

If the assertion fails, the function should throw an error.

### Example 1: Basic Assertion Function

```typescript
function assert(condition: unknown): asserts condition {
    if (!condition) {
        throw new Error("Assertion failed");
    }
}
```

Usage:

```typescript
const value: string | undefined = "Hello";

assert(value !== undefined);

console.log(value.toUpperCase());
```

After the assertion succeeds, TypeScript knows that `value` is not undefined.

### Example 2: Assertion Function for a Specific Type

```typescript
type User = {
    id: number;
    name: string;
};

function assertIsUser(value: unknown): asserts value is User {
    if (
        typeof value !== "object" ||
        value === null ||
        !("id" in value) ||
        !("name" in value) ||
        typeof value.id !== "number" ||
        typeof value.name !== "string"
    ) {
        throw new Error("Invalid user");
    }
}
```

Usage:

```typescript
const data: unknown = {
    id: 1,
    name: "Alex"
};

assertIsUser(data);

console.log(data.name);
console.log(data.id);
```

After `assertIsUser(data)` completes successfully, TypeScript treats `data` as a `User`.

### Type Guard vs Assertion Function

| Feature | Type Guard | Assertion Function |
|---|---|---|
| Return behavior | Usually returns `true` or `false` | Returns normally or throws |
| Syntax | `value is User` | `asserts value is User` |
| Usage | `if (isUser(value))` | `assertIsUser(value)` |
| Failure handling | Caller handles false | Function throws |
| Narrowing | Within the true branch | After successful call |

### When Should You Use Assertion Functions?

Use them when:

- A condition must be true for execution to continue.
- Invalid input should immediately stop processing.
- You want to validate configuration.
- You want to enforce required application conditions.

**Important:** TypeScript trusts assertion signatures too. An incorrect assertion function can make your code unsafe.

---

# 12. Discriminated Union Narrowing

A discriminated union is a union of object types that share a common property with different literal values.

That common property is called a **Discriminant**.

This is one of the most useful TypeScript patterns in real-world development.

### Example 1: Basic Discriminated Union

```typescript
type Admin = {
    role: "admin";
    permissions: string[];
};

type Customer = {
    role: "customer";
    orders: number;
};

type User = Admin | Customer;
```

Both types have a common property:

```typescript
role
```

But their values are different.

- Admin: `"admin"`
- Customer: `"customer"`

Now use it:

```typescript
function displayUser(user: User) {
    if (user.role === "admin") {
        console.log(user.permissions);
    } else {
        console.log(user.orders);
    }
}
```

TypeScript automatically narrows the type based on the `role` property.

### Example 2: Switch Statement

```typescript
type Payment =
    | {
        status: "success";
        transactionId: string;
    }
    | {
        status: "failed";
        error: string;
    }
    | {
        status: "pending";
        estimatedTime: number;
    };

function processPayment(payment: Payment) {
    switch (payment.status) {
        case "success":
            console.log(payment.transactionId);
            break;

        case "failed":
            console.log(payment.error);
            break;

        case "pending":
            console.log(payment.estimatedTime);
            break;
    }
}
```

Each case provides the appropriate type.

### Why Are Discriminated Unions Useful?

They are particularly useful for:

- API responses
- Authentication states
- Payment processing
- Order statuses
- Notification types
- Application state management
- Redux-style actions

### Example 3: API Response

```typescript
type ApiResponse =
    | {
        status: "success";
        data: {
            id: number;
            name: string;
        };
    }
    | {
        status: "error";
        message: string;
    };

function handleResponse(response: ApiResponse) {
    if (response.status === "success") {
        console.log(response.data.name);
    } else {
        console.log(response.message);
    }
}
```

This prevents you from accidentally accessing properties belonging to the wrong response type.

---

# 13. Exhaustiveness Checking Using never

Exhaustiveness checking ensures that every possible member of a union has been handled.

This is particularly useful with discriminated unions.

### Example 1: Without Exhaustiveness Checking

```typescript
type Status =
    | "success"
    | "failed"
    | "pending";

function processStatus(status: Status) {
    switch (status) {
        case "success":
            console.log("Success");
            break;

        case "failed":
            console.log("Failed");
            break;
    }
}
```

We forgot to handle `"pending"`.

TypeScript does not necessarily report this omission automatically.

### Example 2: Using never

```typescript
type Status =
    | "success"
    | "failed"
    | "pending";

function assertNever(value: never): never {
    throw new Error(`Unexpected value: ${value}`);
}

function processStatus(status: Status) {
    switch (status) {
        case "success":
            console.log("Success");
            break;

        case "failed":
            console.log("Failed");
            break;

        case "pending":
            console.log("Pending");
            break;

        default:
            assertNever(status);
    }
}
```

Why does this work?

After all possible cases have been handled, TypeScript expects `status` to have the type `never`.

If you forget a case, the remaining type is not `never`, so TypeScript reports an error.

### Example 3: Adding a New Status

Now modify the union:

```typescript
type Status =
    | "success"
    | "failed"
    | "pending"
    | "cancelled";
```

If you don't add a `"cancelled"` case, this line will produce a type error:

```typescript
assertNever(status);
```

This helps identify incomplete logic whenever your union changes.

**Best practice:** Use exhaustive checking for important discriminated unions and state-handling logic.

---

# 14. Type Narrowing With Arrays

TypeScript can narrow array types using built-in methods and custom type guards.

This is especially useful when working with mixed data.

### Example 1: Array.isArray()

```typescript
function process(value: string | string[]) {
    if (Array.isArray(value)) {
        console.log(value.length);
    } else {
        console.log(value.toUpperCase());
    }
}
```

TypeScript understands that `value` is an array inside the `if` block.

### Example 2: Filtering Mixed Arrays

Suppose you have:

```typescript
const values: (string | number)[] = [
    "Hello",
    100,
    "World",
    200
];
```

You want only strings.

```typescript
const strings = values.filter(
    (value): value is string => typeof value === "string"
);

console.log(strings);
```

The resulting type is:

```typescript
string[]
```

The callback uses a type predicate:

```typescript
(value): value is string
```

### Example 3: Filtering Objects

```typescript
type User = {
    id: number;
    name: string;
};

type Admin = {
    id: number;
    permissions: string[];
};

const users: (User | Admin)[] = [
    {
        id: 1,
        name: "Alex"
    },
    {
        id: 2,
        permissions: ["read", "write"]
    }
];
```

Create a type guard:

```typescript
function isAdmin(value: User | Admin): value is Admin {
    return "permissions" in value;
}
```

Filter:

```typescript
const admins = users.filter(isAdmin);
```

TypeScript understands:

```typescript
Admin[]
```

### Example 4: Filtering Valid API Data

```typescript
type Product = {
    id: number;
    name: string;
    price: number;
};

function isProduct(value: unknown): value is Product {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    if (
        !("id" in value) ||
        !("name" in value) ||
        !("price" in value)
    ) {
        return false;
    }

    return (
        typeof value.id === "number" &&
        typeof value.name === "string" &&
        typeof value.price === "number"
    );
}

const data: unknown[] = [
    { id: 1, name: "Laptop", price: 50000 },
    { id: 2, name: "Mouse", price: 500 },
    { id: "3", name: "Keyboard", price: 1000 },
    "Invalid data"
];

const products = data.filter(isProduct);

console.log(products);
```

The result is typed as:

```typescript
Product[]
```

### Important: Array.isArray() Does Not Validate Elements

Consider:

```typescript
const data: unknown = [1, "Hello", true];

if (Array.isArray(data)) {
    // The array check does not prove every element is a number.
}
```

`Array.isArray()` checks only whether the value is an array.

It does not validate the elements inside it.

For stronger validation, check each element:

```typescript
function isNumberArray(value: unknown): value is number[] {
    return (
        Array.isArray(value) &&
        value.every(item => typeof item === "number")
    );
}
```

---

# 15. Real-World Type Guard Implementations

Let's combine what we have learned with practical application scenarios.

## Example 1: API Response Validation

Imagine your backend receives data from an external API.

You should not blindly trust external data.

```typescript
type ApiUser = {
    id: number;
    name: string;
    email: string;
};

function isApiUser(value: unknown): value is ApiUser {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    if (
        !("id" in value) ||
        !("name" in value) ||
        !("email" in value)
    ) {
        return false;
    }

    return (
        typeof value.id === "number" &&
        typeof value.name === "string" &&
        typeof value.email === "string"
    );
}
```

Usage:

```typescript
async function fetchUser() {
    const response = await fetch("/api/user");

    const data: unknown = await response.json();

    if (isApiUser(data)) {
        console.log(data.name);
        console.log(data.email);
    } else {
        throw new Error("Invalid API response");
    }
}
```

Here, the external data is treated as `unknown` until validated.

Note that this is a simplified validator. Production validation may also need to check nested properties, email format, allowed values, and additional constraints.

## Example 2: Handling Different Notification Types

```typescript
type EmailNotification = {
    type: "email";
    recipient: string;
    subject: string;
};

type SMSNotification = {
    type: "sms";
    phone: string;
    message: string;
};

type PushNotification = {
    type: "push";
    deviceId: string;
    message: string;
};

type Notification =
    | EmailNotification
    | SMSNotification
    | PushNotification;
```

Implementation:

```typescript
function sendNotification(notification: Notification) {
    switch (notification.type) {
        case "email":
            console.log(
                "Sending email to:",
                notification.recipient
            );
            break;

        case "sms":
            console.log(
                "Sending SMS to:",
                notification.phone
            );
            break;

        case "push":
            console.log(
                "Sending push notification to:",
                notification.deviceId
            );
            break;
    }
}
```

This is a clean and scalable approach to handling multiple notification types.

## Example 3: Authentication State

```typescript
type AuthState =
    | {
        status: "loggedOut";
    }
    | {
        status: "loading";
    }
    | {
        status: "loggedIn";
        user: {
            id: number;
            name: string;
        };
        token: string;
    };
```

Implementation:

```typescript
function displayAuthState(state: AuthState) {
    switch (state.status) {
        case "loggedOut":
            console.log("Please log in");
            break;

        case "loading":
            console.log("Loading...");
            break;

        case "loggedIn":
            console.log("Welcome:", state.user.name);
            console.log("Token:", state.token);
            break;
    }
}
```

The compiler prevents accidental access to `user` when the state is `"loggedOut"` or `"loading"`.

---

# 16. Common Mistakes in Type Narrowing

### Mistake 1: Using typeof for Arrays

Incorrect:

```typescript
if (typeof value === "array") {
    // This never works.
}
```

Correct:

```typescript
if (Array.isArray(value)) {
    // Array
}
```

### Mistake 2: Forgetting null With typeof object

Incorrect:

```typescript
if (typeof value === "object") {
    // value could be null.
}
```

Correct:

```typescript
if (value !== null && typeof value === "object") {
    // Non-null object
}
```

### Mistake 3: Assuming in Checks the Property Value

Incorrect assumption:

```typescript
if ("email" in user) {
    // email is definitely a string.
}
```

A property can exist with an `undefined` value.

Correct:

```typescript
if (
    "email" in user &&
    typeof user.email === "string"
) {
    console.log(user.email);
}
```

### Mistake 4: Using Truthiness When Zero Is Valid

Incorrect:

```typescript
if (price) {
    console.log(price);
}
```

Correct:

```typescript
if (price !== undefined) {
    console.log(price);
}
```

### Mistake 5: Using any Instead of unknown

Avoid:

```typescript
function process(data: any) {
    console.log(data.name.toUpperCase());
}
```

Prefer:

```typescript
function process(data: unknown) {
    if (
        typeof data === "object" &&
        data !== null &&
        "name" in data &&
        typeof data.name === "string"
    ) {
        console.log(data.name.toUpperCase());
    }
}
```

### Mistake 6: Incorrect Custom Type Guards

Avoid:

```typescript
function isAdmin(value: unknown): value is Admin {
    return true;
}
```

A type predicate must be supported by actual runtime validation.

### Mistake 7: Using instanceof With Interfaces

Incorrect:

```typescript
interface User {
    name: string;
}

// Interfaces do not exist at runtime.
```

Use a custom type guard to validate interface-shaped objects.

---

# 17. Interview Questions and Answers

### Q1. What is type narrowing in TypeScript?

Type narrowing is the process of reducing a variable's possible types based on runtime checks, allowing TypeScript to identify the more specific type at a particular point in the program.

### Q2. What is a type guard?

A type guard is an expression or function that helps TypeScript determine the actual type of a value.

Examples include:

- `typeof`
- `instanceof`
- `in`
- Equality checks
- Custom type predicates

### Q3. What is control flow analysis?

Control Flow Analysis is the process through which TypeScript analyzes conditions, assignments, branches, and return statements to determine the type of variables at different execution points.

### Q4. What is the difference between typeof and instanceof?

| typeof | instanceof |
|---|---|
| Checks primitive type categories and functions | Checks runtime constructor/prototype relationships |
| Returns a string | Returns a boolean |
| Useful for strings, numbers, booleans, etc. | Useful for classes and built-in objects |
| Cannot distinguish arrays from ordinary objects | Can identify specific class instances |

### Q5. Why does typeof null return object?

It is a historical JavaScript behavior that has been retained for backward compatibility.

### Q6. Can we use instanceof with interfaces?

No. Interfaces are removed during compilation and do not exist at runtime.

### Q7. What is a custom type guard?

A custom type guard is a function that uses a type predicate such as `value is User` to communicate a type-narrowing result to TypeScript.

### Q8. What is the difference between boolean and value is Type?

`boolean` only indicates that a function returns true or false.

`value is Type` additionally tells TypeScript that a true result means the value belongs to a particular type.

### Q9. What is an assertion function?

An assertion function uses the `asserts` keyword to tell TypeScript that a condition or type is guaranteed if the function returns normally.

### Q10. What is a discriminated union?

A discriminated union is a union of object types that share a common property containing different literal values. TypeScript uses that property to narrow the union.

### Q11. What is exhaustive checking?

Exhaustive checking ensures that every possible member of a union has been handled, commonly using `never`.

### Q12. What is the difference between `||` and `??`?

`||` uses the fallback for any falsy value, whereas `??` uses the fallback only for `null` and `undefined`.

### Q13. Does Array.isArray() validate array elements?

No. It only verifies that the supplied value is an array. Element validation requires additional checks.

### Q14. Does TypeScript verify the implementation of a custom type predicate?

No. TypeScript trusts the declared predicate. Developers are responsible for making sure the runtime validation is correct.

---

# 18. Practical Exercises

Complete these exercises before moving to Phase 12.

### Exercise 1: Primitive Type Guard

Create a function that accepts:

```typescript
string | number | boolean
```

Requirements:

- Check the actual type using `typeof`.
- Convert strings to uppercase.
- Convert numbers to two decimal places.
- Display boolean values.

### Exercise 2: Object Type Guard

Create two types:

```typescript
type Admin = {
    id: number;
    permissions: string[];
};

type Customer = {
    id: number;
    orders: number;
};
```

Create a function that identifies admins and customers using the `in` operator.

### Exercise 3: Custom Type Guard

Create a `Product` type:

```typescript
type Product = {
    id: number;
    name: string;
    price: number;
};
```

Write an `isProduct()` function that validates an unknown value.

### Exercise 4: Number Array Validation

Create a function:

```typescript
function isNumberArray(value: unknown): value is number[]
```

Requirements:

- Check whether the value is an array.
- Check whether every element is a number.
- Return the appropriate boolean result.

### Exercise 5: Discriminated Union

Create a payment system with these states:

- `"success"`
- `"failed"`
- `"pending"`
- `"cancelled"`

Each state should have its own relevant properties.

Write a function that handles every state using `switch`.

### Exercise 6: Exhaustiveness Checking

Extend Exercise 5 using `never` to ensure that every payment state is handled.

### Exercise 7: Assertion Function

Write:

```typescript
function assertIsProduct(value: unknown): asserts value is Product
```

Requirements:

- Validate all required properties.
- Throw an error for invalid data.
- Access product properties safely after the assertion.

### Exercise 8: Real-World API Validation

Create an API response validator with two possible responses:

Success:

```typescript
{
    status: "success",
    data: {
        id: number,
        name: string
    }
}
```

Failure:

```typescript
{
    status: "error",
    message: string
}
```

Validate the data and handle both cases.

---

# 19. Phase 11 Completion Checklist

You should now understand:

- [ ] What type narrowing is.
- [ ] How control flow analysis works.
- [ ] `typeof` type guards.
- [ ] `instanceof` type guards.
- [ ] `in` operator narrowing.
- [ ] Equality narrowing.
- [ ] Truthiness narrowing.
- [ ] Null and undefined checks.
- [ ] Optional chaining.
- [ ] Nullish coalescing.
- [ ] Custom type guards.
- [ ] Type predicates using `is`.
- [ ] Assertion functions using `asserts`.
- [ ] Discriminated unions.
- [ ] Exhaustiveness checking using `never`.
- [ ] Array type narrowing.
- [ ] Real-world type guard implementations.

---

## What's Next?

**Phase 12: Literal Types, Template Literal Types, and Advanced String Types**

In the next phase, we will cover:

1. String literal types.
2. Number literal types.
3. Boolean literal types.
4. Literal type inference.
5. `as const` in depth.
6. Template literal types.
7. String manipulation types.
8. Intrinsic utility types: `Uppercase`, `Lowercase`, `Capitalize`, and `Uncapitalize`.
9. Combining template literal types with unions.
10. Real-world applications of advanced string types.

**When you're ready, say: `OK, Phase 12`.**