# TypeScript Complete Learning Roadmap
# Phase 13: Enums in TypeScript

**Level:** Intermediate  
**Prerequisite:** Phase 12 – Literal Types and Template Literal Types  
**Goal:** Understand enums, their different types, how they work internally, and when to use enums versus union literal types in real-world applications.

---

# 1. What Are Enums?

An **Enum (Enumeration)** is a TypeScript feature that allows you to define a collection of named constants.

Instead of repeatedly writing individual values throughout your application, you can group related values under a single enum.

### Example Without Enum

```typescript
let orderStatus: string;

orderStatus = "pending";
orderStatus = "processing";
orderStatus = "shipped";
orderStatus = "delivered";
```

There is a problem here.

The variable accepts any string, including invalid values.

```typescript
orderStatus = "something-invalid";
```

TypeScript allows this because the variable is declared as `string`.

### Example With Enum

```typescript
enum OrderStatus {
    Pending,
    Processing,
    Shipped,
    Delivered
}

let orderStatus: OrderStatus;

orderStatus = OrderStatus.Pending;
orderStatus = OrderStatus.Shipped;

// Error
orderStatus = "something-invalid";
```

Now the variable accepts only members of the `OrderStatus` enum.

### Why Do We Need Enums?

Enums are useful when:

- You have a fixed collection of related constants.
- You want readable names instead of unexplained numeric values.
- You want to represent application states.
- You want to group related values together.
- You want to reuse predefined values across multiple files.

---

# 2. Numeric Enums

By default, TypeScript enums use numeric values.

If you don't assign values explicitly, TypeScript automatically starts from `0` and increments each subsequent member by `1`.

### Example

```typescript
enum Direction {
    North,
    South,
    East,
    West
}
```

The generated values are:

| Enum Member | Value |
|---|---:|
| `Direction.North` | 0 |
| `Direction.South` | 1 |
| `Direction.East` | 2 |
| `Direction.West` | 3 |

Usage:

```typescript
console.log(Direction.North); // 0
console.log(Direction.South); // 1
console.log(Direction.East);  // 2
console.log(Direction.West);  // 3
```

### Example 2: Using Numeric Enums

```typescript
enum UserRole {
    Admin,
    Manager,
    Customer
}

function checkRole(role: UserRole) {
    if (role === UserRole.Admin) {
        console.log("Admin Access");
    } else if (role === UserRole.Manager) {
        console.log("Manager Access");
    } else {
        console.log("Customer Access");
    }
}

checkRole(UserRole.Admin);
checkRole(UserRole.Customer);
```

### Important

The first enum member starts at `0` by default.

You can change this behavior by assigning a different starting value.

---

# 3. Explicit Numeric Enum Values

You can manually assign numeric values to enum members.

### Example

```typescript
enum StatusCode {
    Success = 200,
    Created = 201,
    BadRequest = 400,
    Unauthorized = 401,
    NotFound = 404,
    ServerError = 500
}
```

Usage:

```typescript
console.log(StatusCode.Success); // 200
console.log(StatusCode.NotFound); // 404
```

### Example 2: Custom Starting Value

```typescript
enum Priority {
    Low = 1,
    Medium,
    High,
    Critical
}
```

Values:

| Member | Value |
|---|---:|
| Low | 1 |
| Medium | 2 |
| High | 3 |
| Critical | 4 |

Once you assign a numeric value, subsequent members automatically increment from that value.

### Example 3: Non-Sequential Values

```typescript
enum UserRole {
    Admin = 10,
    Manager = 20,
    Customer = 30
}
```

Each member has its explicitly assigned value.

### Important: Duplicate Values

TypeScript allows duplicate numeric enum values.

```typescript
enum Status {
    Success = 200,
    Completed = 200
}
```

However, duplicate values can make reverse mapping ambiguous. Avoid them unless there is a specific reason.

---

# 4. String Enums

String enums allow you to assign string values to enum members.

Unlike numeric enums, string enum members must have explicit string initializers.

### Example

```typescript
enum OrderStatus {
    Pending = "PENDING",
    Processing = "PROCESSING",
    Shipped = "SHIPPED",
    Delivered = "DELIVERED",
    Cancelled = "CANCELLED"
}
```

Usage:

```typescript
console.log(OrderStatus.Pending);
// PENDING

console.log(OrderStatus.Delivered);
// DELIVERED
```

### Example 2: User Roles

```typescript
enum UserRole {
    Admin = "ADMIN",
    Manager = "MANAGER",
    Customer = "CUSTOMER"
}

function createUser(name: string, role: UserRole) {
    console.log(name, role);
}

createUser("Alex", UserRole.Admin);
createUser("John", UserRole.Customer);
```

### Example 3: Payment Status

```typescript
enum PaymentStatus {
    Pending = "pending",
    Success = "success",
    Failed = "failed",
    Refunded = "refunded"
}

function processPayment(status: PaymentStatus) {
    switch (status) {
        case PaymentStatus.Pending:
            console.log("Payment is pending");
            break;

        case PaymentStatus.Success:
            console.log("Payment successful");
            break;

        case PaymentStatus.Failed:
            console.log("Payment failed");
            break;

        case PaymentStatus.Refunded:
            console.log("Payment refunded");
            break;
    }
}
```

### Why Are String Enums Useful?

String enums are particularly useful for:

- API status values.
- User roles.
- Payment statuses.
- Order statuses.
- Application configuration.
- Database-related constants.

String values are often easier to understand when inspecting API requests, database records, and application logs.

---

# 5. Numeric Enums vs String Enums

Let's compare both.

| Feature | Numeric Enum | String Enum |
|---|---|---|
| Values | Numbers | Strings |
| Automatic values | Yes | No |
| Explicit initialization | Optional | Required |
| Default first value | `0` | No default |
| Reverse mapping | Yes | No |
| Readability in logs | Often less readable | Generally more readable |
| Common usage | Numeric codes and internal states | API and application statuses |

### Example

Numeric:

```typescript
enum Direction {
    North,
    South
}

console.log(Direction.North); // 0
```

String:

```typescript
enum Direction {
    North = "NORTH",
    South = "SOUTH"
}

console.log(Direction.North); // NORTH
```

**Best practice:** Prefer string enums when the values represent meaningful textual identifiers, especially when they are exchanged with APIs or persisted in a database.

---

# 6. Heterogeneous Enums

A heterogeneous enum contains both numeric and string members.

### Example

```typescript
enum Data {
    Id = 1,
    Name = "Riyaz",
    Age = 25
}
```

Here:

- `Id` is a number.
- `Name` is a string.
- `Age` is a number.

Usage:

```typescript
console.log(Data.Id);
console.log(Data.Name);
console.log(Data.Age);
```

### Should We Use Heterogeneous Enums?

Generally, no.

They mix different value types and make the enum less predictable.

Prefer separate enums or a suitable object/type definition.

For example:

```typescript
enum UserStatus {
    Active = "ACTIVE",
    Inactive = "INACTIVE"
}
```

**Best practice:** Avoid heterogeneous enums unless a specific interoperability requirement makes them necessary.

---

# 7. Default Enum Values

When you declare a numeric enum without explicit values, TypeScript assigns values automatically.

```typescript
enum Status {
    Pending,
    Processing,
    Completed
}
```

Equivalent values:

```typescript
enum Status {
    Pending = 0,
    Processing = 1,
    Completed = 2
}
```

You can also partially assign values.

```typescript
enum Status {
    Pending = 10,
    Processing,
    Completed
}
```

Result:

```text
Pending = 10
Processing = 11
Completed = 12
```

### Important Rule

If a numeric enum member has no initializer, its value is automatically calculated from the previous member.

However, if a non-constant computed member appears before an uninitialized member, TypeScript cannot automatically determine the next value.

Example:

```typescript
function getValue() {
    return 10;
}

enum Status {
    First = getValue(),

    // Error: enum member must have an initializer.
    Second
}
```

A computed numeric member can be followed by another member if that next member has an explicit initializer.

---

# 8. Reverse Mapping in Numeric Enums

One interesting feature of numeric enums is **Reverse Mapping**.

It means you can access an enum member by its numeric value.

### Example

```typescript
enum Direction {
    North,
    South,
    East,
    West
}
```

Normal mapping:

```typescript
console.log(Direction.North); // 0
console.log(Direction.South); // 1
```

Reverse mapping:

```typescript
console.log(Direction[0]); // North
console.log(Direction[1]); // South
console.log(Direction[2]); // East
```

### How Does It Work?

For a numeric enum, the emitted JavaScript is conceptually similar to:

```javascript
var Direction;

(function (Direction) {
    Direction[Direction["North"] = 0] = "North";
    Direction[Direction["South"] = 1] = "South";
    Direction[Direction["East"] = 2] = "East";
    Direction[Direction["West"] = 3] = "West";
})(Direction || (Direction = {}));
```

The generated object contains both mappings:

```javascript
{
    0: "North",
    1: "South",
    2: "East",
    3: "West",
    North: 0,
    South: 1,
    East: 2,
    West: 3
}
```

### Important: String Enums Do Not Support Reverse Mapping

```typescript
enum Direction {
    North = "NORTH",
    South = "SOUTH"
}

console.log(Direction.North); // NORTH
```

This does not provide the corresponding reverse mapping:

```typescript
// Not a valid reverse lookup for string enums.
console.log(Direction["NORTH"]);
```

If you need reverse lookup for string enums, create an explicit mapping.

---

# 9. Const Enums

A `const enum` is a special kind of enum designed to reduce generated JavaScript code.

### Normal Enum

```typescript
enum Direction {
    North,
    South,
    East,
    West
}

const direction = Direction.North;
```

A normal enum generates a JavaScript enum object.

### Const Enum

```typescript
const enum Direction {
    North,
    South,
    East,
    West
}

const direction = Direction.North;
```

The TypeScript compiler can inline the enum value.

Conceptually, the generated JavaScript becomes:

```javascript
const direction = 0;
```

The enum object is not generated in the usual way.

### Advantages

1. Can reduce generated JavaScript.
2. Avoids the runtime enum object in typical compilation.
3. Can improve efficiency in suitable cases.

### Disadvantages

1. Can create compatibility issues across separately compiled packages.
2. Behavior depends on compiler and module tooling.
3. Some transpilers and build tools have limitations around const enums.
4. Published libraries must consider how consumers compile the code.

### Example

```typescript
const enum UserRole {
    Admin = 1,
    Customer = 2,
    Manager = 3
}

function checkRole(role: UserRole) {
    if (role === UserRole.Admin) {
        console.log("Admin");
    }
}
```

### When Should You Use Const Enums?

Use them only when you understand your build pipeline and have a reason to inline enum values.

For many modern applications, regular string unions or `as const` objects are simpler alternatives.

---

# 10. Computed Enum Members

Enum members can have computed values.

A computed member is initialized using an expression rather than a simple literal.

### Example 1: Numeric Computed Member

```typescript
enum Values {
    A = 10,
    B = A * 2,
    C = B + 5
}
```

Values:

```text
A = 10
B = 20
C = 25
```

### Example 2: String Computed Member

```typescript
enum Environment {
    Development = "DEV",
    Production = "PROD",
    Current = Environment.Development
}
```

Here, `Current` uses another enum member's value.

### Example 3: Function-Based Computed Member

```typescript
function getStatusCode() {
    return 200;
}

enum Status {
    Success = getStatusCode()
}
```

This is allowed as a computed enum member.

However, not every computed member is a constant enum expression.

Some restrictions apply when subsequent members omit their initializers.

**Important:** Enum initializers must follow TypeScript's rules for constant and computed enum expressions.

---

# 11. Enum Type Safety

Enums provide a type that represents their members.

### Example

```typescript
enum UserRole {
    Admin = "ADMIN",
    Customer = "CUSTOMER",
    Manager = "MANAGER"
}

let role: UserRole;

role = UserRole.Admin;
role = UserRole.Customer;

// Error
role = "DEVELOPER";
```

### Important: String Enum Members

String enum members are not interchangeable with arbitrary strings.

```typescript
enum Status {
    Active = "ACTIVE",
    Inactive = "INACTIVE"
}

let status: Status;

status = Status.Active; // Valid

// Error
status = "ACTIVE";
```

Even though the underlying runtime value is `"ACTIVE"`, the enum member is the intended typed value.

You can explicitly convert or validate external strings, but you should not assume an arbitrary string is a valid enum member.

### Numeric Enum Compatibility

Numeric enums have some compatibility rules that differ from string enums.

For example:

```typescript
enum Direction {
    North,
    South
}

let direction: Direction = 0;
```

This is allowed in TypeScript's numeric enum compatibility rules.

However, arbitrary numeric values are not necessarily valid enum members at runtime.

```typescript
let direction: Direction = 100;
```

Depending on the TypeScript version and enum form, this may be rejected by the compiler. Regardless, external numeric input should be validated against the allowed values.

**Best practice:** Do not treat enum annotations as runtime validation.

---

# 12. Enums vs Union Literal Types

This is one of the most important topics in modern TypeScript.

Both enums and union literal types can represent a fixed collection of values.

### Using Enum

```typescript
enum UserRole {
    Admin = "ADMIN",
    Customer = "CUSTOMER",
    Manager = "MANAGER"
}

function createUser(role: UserRole) {
    console.log(role);
}

createUser(UserRole.Admin);
```

### Using Union Literal Type

```typescript
type UserRole = "ADMIN" | "CUSTOMER" | "MANAGER";

function createUser(role: UserRole) {
    console.log(role);
}

createUser("ADMIN");
```

Both approaches restrict values to a known set.

### Detailed Comparison

| Feature | Enum | Union Literal Type |
|---|---|---|
| Defines fixed values | Yes | Yes |
| Creates a runtime object | Usually, for regular enums | No |
| Can be used as a type | Yes | Yes |
| Can use string values | Yes | Yes |
| Can use numeric values | Yes | Yes |
| Supports reverse mapping | Numeric enums | No built-in reverse mapping |
| Can be iterated at runtime | Yes, regular enum object | No, not by itself |
| Can combine with template literal types | Yes, through member types or values | Directly |
| Runtime overhead | Usually | None for the type itself |

### Which One Should You Use?

Use union literal types when:

- You need a simple fixed set of strings.
- You want lightweight type definitions.
- You are designing API request and response types.
- You want to combine values with template literal types.
- You do not need a runtime enum object.

Use enums when:

- You specifically need a runtime object.
- You want named constant members.
- You need numeric enum reverse mapping.
- You are working with an existing codebase or API that already uses enums.

**Modern TypeScript recommendation:** For many application-level string states, union literal types are a simple and flexible choice.

---

# 13. Alternative to Enums: as const Objects

You can use an object with `as const` to get many of the benefits of enums.

This pattern is common in modern TypeScript applications.

### Example 1: Defining Roles

```typescript
const UserRole = {
    Admin: "ADMIN",
    Customer: "CUSTOMER",
    Manager: "MANAGER"
} as const;
```

Now derive a type:

```typescript
type UserRole =
    typeof UserRole[keyof typeof UserRole];
```

The resulting type is:

```typescript
type UserRole = "ADMIN" | "CUSTOMER" | "MANAGER";
```

Let's understand the syntax.

### Step 1: typeof

```typescript
typeof UserRole
```

Gets the type of the object.

```typescript
{
    readonly Admin: "ADMIN";
    readonly Customer: "CUSTOMER";
    readonly Manager: "MANAGER";
}
```

### Step 2: keyof

```typescript
keyof typeof UserRole
```

Extracts the property names:

```typescript
"Admin" | "Customer" | "Manager"
```

### Step 3: Indexed Access Type

```typescript
typeof UserRole[keyof typeof UserRole]
```

Extracts the values associated with those keys:

```typescript
"ADMIN" | "CUSTOMER" | "MANAGER"
```

### Step 4: Use the Type

```typescript
function createUser(role: UserRole) {
    console.log(role);
}

createUser("ADMIN");
createUser("CUSTOMER");

// Error
createUser("DEVELOPER");
```

### Example 2: Runtime Access

Unlike a union type, the object exists at runtime.

```typescript
console.log(UserRole.Admin);
console.log(UserRole.Customer);
```

You can also iterate over its values:

```typescript
const roles = Object.values(UserRole);

console.log(roles);
```

Output:

```text
["ADMIN", "CUSTOMER", "MANAGER"]
```

### Why Is This Pattern Useful?

It gives you:

- A runtime object.
- Literal value types.
- Reusable named constants.
- No TypeScript enum-specific JavaScript generation.
- Easy interoperability with ordinary JavaScript objects.

### Enum vs as const Object

```typescript
enum Status {
    Active = "ACTIVE",
    Inactive = "INACTIVE"
}
```

Alternative:

```typescript
const Status = {
    Active: "ACTIVE",
    Inactive: "INACTIVE"
} as const;

type Status =
    typeof Status[keyof typeof Status];
```

Both provide named values, but their type-system and runtime behavior differ.

---

# 14. Enums With Functions

Enums can be used as function parameter and return types.

### Example 1: Function Parameters

```typescript
enum PaymentStatus {
    Pending = "PENDING",
    Success = "SUCCESS",
    Failed = "FAILED"
}

function updatePaymentStatus(status: PaymentStatus) {
    console.log("Payment:", status);
}

updatePaymentStatus(PaymentStatus.Success);
```

### Example 2: Return Type

```typescript
enum UserRole {
    Admin = "ADMIN",
    Customer = "CUSTOMER"
}

function getDefaultRole(): UserRole {
    return UserRole.Customer;
}
```

### Example 3: Function With Conditional Logic

```typescript
enum UserRole {
    Admin = "ADMIN",
    Manager = "MANAGER",
    Customer = "CUSTOMER"
}

function getPermissions(role: UserRole): string[] {
    switch (role) {
        case UserRole.Admin:
            return ["read", "write", "delete"];

        case UserRole.Manager:
            return ["read", "write"];

        case UserRole.Customer:
            return ["read"];
    }
}
```

### Example 4: Exhaustive Enum Handling

You can also use `never` for exhaustive checking.

```typescript
enum PaymentStatus {
    Pending = "PENDING",
    Success = "SUCCESS",
    Failed = "FAILED"
}

function assertNever(value: never): never {
    throw new Error(`Unexpected value: ${value}`);
}

function processPayment(status: PaymentStatus) {
    switch (status) {
        case PaymentStatus.Pending:
            console.log("Pending");
            break;

        case PaymentStatus.Success:
            console.log("Success");
            break;

        case PaymentStatus.Failed:
            console.log("Failed");
            break;

        default:
            assertNever(status);
    }
}
```

If you add a new enum member and forget to handle it, TypeScript can report an error at the exhaustive check.

---

# 15. Enums With Objects and Interfaces

Enums can also be used as property types inside objects and interfaces.

### Example 1: Object Property

```typescript
enum UserRole {
    Admin = "ADMIN",
    Customer = "CUSTOMER"
}

type User = {
    id: number;
    name: string;
    role: UserRole;
};

const user: User = {
    id: 1,
    name: "Alex",
    role: UserRole.Admin
};
```

### Example 2: Interface Property

```typescript
enum OrderStatus {
    Pending = "PENDING",
    Shipped = "SHIPPED",
    Delivered = "DELIVERED"
}

interface Order {
    id: number;
    total: number;
    status: OrderStatus;
}

const order: Order = {
    id: 101,
    total: 2500,
    status: OrderStatus.Pending
};
```

### Example 3: Array of Enum Values

```typescript
enum Permission {
    Read = "READ",
    Write = "WRITE",
    Delete = "DELETE"
}

const permissions: Permission[] = [
    Permission.Read,
    Permission.Write
];
```

You can use arrays of enums just like arrays of other types.

---

# 16. Enums in API Responses

Enums can represent known API response values.

### Example

```typescript
enum ApiStatus {
    Success = "success",
    Error = "error",
    Loading = "loading"
}

type ApiResponse = {
    status: ApiStatus;
    message: string;
};
```

Usage:

```typescript
const response: ApiResponse = {
    status: ApiStatus.Success,
    message: "User created successfully"
};
```

Handling:

```typescript
function handleApiResponse(response: ApiResponse) {
    switch (response.status) {
        case ApiStatus.Success:
            console.log("Success:", response.message);
            break;

        case ApiStatus.Error:
            console.log("Error:", response.message);
            break;

        case ApiStatus.Loading:
            console.log("Loading:", response.message);
            break;
    }
}
```

### Important: External API Data

Suppose an API returns:

```json
{
    "status": "success",
    "message": "User created"
}
```

TypeScript does not automatically verify that the incoming JSON contains a valid enum value.

You must validate external data at runtime.

For example:

```typescript
enum ApiStatus {
    Success = "success",
    Error = "error",
    Loading = "loading"
}

function isApiStatus(value: unknown): value is ApiStatus {
    return (
        typeof value === "string" &&
        Object.values(ApiStatus).includes(value as ApiStatus)
    );
}
```

Usage:

```typescript
const status: unknown = "success";

if (isApiStatus(status)) {
    console.log("Valid status:", status);
} else {
    console.log("Invalid status");
}
```

This is a simplified validator for a string enum.

---

# 17. Enums in Node.js and React Applications

Let's look at practical applications.

## 17.1 Node.js Backend

Consider an order management system.

```typescript
enum OrderStatus {
    Pending = "PENDING",
    Confirmed = "CONFIRMED",
    Shipped = "SHIPPED",
    Delivered = "DELIVERED",
    Cancelled = "CANCELLED"
}
```

A service function:

```typescript
function updateOrder(
    orderId: number,
    status: OrderStatus
) {
    console.log("Updating order:", orderId);
    console.log("New status:", status);
}
```

Usage:

```typescript
updateOrder(101, OrderStatus.Confirmed);
updateOrder(102, OrderStatus.Shipped);
```

This prevents accidental use of unsupported statuses inside your TypeScript code.

## 17.2 React Application

You can use enums to define component variants.

```typescript
enum ButtonVariant {
    Primary = "primary",
    Secondary = "secondary",
    Danger = "danger"
}
```

Component:

```tsx
type ButtonProps = {
    variant: ButtonVariant;
    children: React.ReactNode;
};

function Button({ variant, children }: ButtonProps) {
    return (
        <button className={`btn btn-${variant}`}>
            {children}
        </button>
    );
}
```

Usage:

```tsx
<Button variant={ButtonVariant.Primary}>
    Save
</Button>
```

For simple component variants, a union literal type is also a good option:

```typescript
type ButtonVariant = "primary" | "secondary" | "danger";
```

---

# 18. Common Mistakes and Best Practices

### Mistake 1: Forgetting That Numeric Enums Start at Zero

```typescript
enum Status {
    Pending,
    Completed
}
```

Values:

```text
Pending = 0
Completed = 1
```

If these numbers are stored externally, changing enum member order can change their values.

**Best practice:** Explicitly assign numeric values when they must remain stable.

### Mistake 2: Using Numeric Enums for API Strings

Avoid using numeric enum values when an external API expects textual identifiers.

Prefer:

```typescript
enum Status {
    Success = "SUCCESS",
    Failed = "FAILED"
}
```

### Mistake 3: Using Heterogeneous Enums

Avoid mixing strings and numbers without a specific requirement.

### Mistake 4: Assuming Enums Validate External Data

Enums provide compile-time type information, not automatic runtime validation.

Validate API responses and user input.

### Mistake 5: Assuming String Enums Support Reverse Mapping

Only numeric enums generate the built-in reverse mapping.

### Mistake 6: Using Const Enums Without Understanding the Build Toolchain

`const enum` can behave differently across compilation and transpilation setups.

Test your build configuration before using them in shared packages or libraries.

### Mistake 7: Using Enums for Every Fixed Set of Strings

For simple fixed values, this is often enough:

```typescript
type Status = "pending" | "completed" | "failed";
```

You do not always need an enum.

---

# 19. Interview Questions and Answers

### Q1. What is an enum in TypeScript?

An enum is a feature that allows developers to define a named collection of related constant values.

### Q2. What are the different types of enums?

The main categories are:

- Numeric enums.
- String enums.
- Heterogeneous enums.
- Const enums.

### Q3. What are numeric enums?

Numeric enums assign numeric values to their members. By default, values start at zero and increment automatically.

### Q4. What are string enums?

String enums assign explicit string values to their members.

### Q5. What is a heterogeneous enum?

A heterogeneous enum contains both numeric and string members. It is generally discouraged because it mixes different value types.

### Q6. What is reverse mapping?

Reverse mapping allows you to access numeric enum member names using their numeric values.

Example:

```typescript
enum Direction {
    North,
    South
}

console.log(Direction[0]); // North
```

### Q7. Do string enums support reverse mapping?

No. TypeScript does not generate built-in reverse mapping for string enums.

### Q8. What is a const enum?

A const enum is a special enum that TypeScript can inline during compilation instead of generating a regular runtime enum object.

### Q9. What are computed enum members?

Computed enum members use expressions to determine their values instead of simple literal initializers.

### Q10. What is the difference between enum and union literal types?

Enums can generate runtime objects, while union literal types exist only in the type system and are erased during compilation.

### Q11. What is the difference between enum and as const objects?

An enum is a TypeScript language feature. An `as const` object is an ordinary JavaScript object whose properties receive narrow readonly types.

### Q12. Can enums be used in interfaces?

Yes. Enum types can be used for interface properties.

### Q13. Can enums be used as function return types?

Yes. A function can return a value belonging to a specific enum type.

### Q14. Are enums available at runtime?

Regular enums generate JavaScript objects and are available at runtime. TypeScript's type-only constructs, such as union types, are erased.

### Q15. Should we always use enums instead of union types?

No. For many fixed string values, union literal types are simpler and more flexible. Use enums when their runtime representation or named member structure is useful.

---

# 20. Practical Exercises

Complete these exercises before moving to Phase 14.

### Exercise 1: User Role Enum

Create an enum named `UserRole` containing:

- Admin
- Manager
- Customer
- Developer

Use string values.

Create a function that accepts a `UserRole`.

### Exercise 2: Order Status

Create an enum named `OrderStatus` containing:

- Pending
- Processing
- Shipped
- Delivered
- Cancelled

Use meaningful string values.

Create a function that displays the order status.

### Exercise 3: Numeric Enum

Create a numeric enum named `Priority`:

```text
Low = 1
Medium = 2
High = 3
Critical = 4
```

Write a function that accepts a priority.

### Exercise 4: Reverse Mapping

Create a numeric enum:

```typescript
enum Direction {
    North,
    South,
    East,
    West
}
```

Print:

- Each member's numeric value.
- Each member's name using reverse mapping.

### Exercise 5: String Enum

Create an enum named `PaymentStatus`.

Include:

- Pending
- Success
- Failed
- Refunded

Create a function that handles each status using `switch`.

### Exercise 6: Const Enum

Create a `const enum` named `HttpMethod`:

- GET
- POST
- PUT
- DELETE

Compile the project and inspect the generated JavaScript.

Compare it with a normal enum.

### Exercise 7: Enum vs Union

Implement the same `UserRole` functionality twice:

1. Using an enum.
2. Using a union literal type.

Compare the resulting code and generated JavaScript.

### Exercise 8: as const Alternative

Create:

```typescript
const UserRole = {
    Admin: "ADMIN",
    Manager: "MANAGER",
    Customer: "CUSTOMER"
} as const;
```

Derive the union type using:

```typescript
typeof UserRole[keyof typeof UserRole]
```

Create a function that accepts only valid roles.

### Exercise 9: API Response

Create an API response system with:

- Success
- Error
- Loading

Use an enum to represent the status.

Write a function that handles each status.

### Exercise 10: Real-World Order Management

Build a small order management example.

Requirements:

1. Define an `OrderStatus` enum.
2. Create an `Order` interface.
3. Create an array of orders.
4. Write a function to update order status.
5. Write a function to filter orders by status.
6. Write a function to count orders by status.

---

# 21. Phase 13 Completion Checklist

You should now understand:

- [ ] What enums are.
- [ ] Why enums are used.
- [ ] Numeric enums.
- [ ] Explicit numeric values.
- [ ] String enums.
- [ ] Heterogeneous enums.
- [ ] Default enum values.
- [ ] Custom enum values.
- [ ] Reverse mapping.
- [ ] Const enums.
- [ ] Computed enum members.
- [ ] Enum type safety.
- [ ] Enums vs union literal types.
- [ ] `as const` object alternatives.
- [ ] Enums with functions.
- [ ] Enums with interfaces and objects.
- [ ] Enums in API responses.
- [ ] Enums in Node.js and React applications.
- [ ] Enum best practices.

---

## What's Next?

# Phase 14: Generics in TypeScript – Fundamentals

Generics are among the most important concepts in TypeScript.

In the next phase, we will cover:

1. What are generics?
2. Why do we need generics?
3. Problems with using `any`.
4. Generic functions.
5. Generic parameters `<T>`.
6. Generic functions with multiple parameters.
7. Generic return types.
8. Generic arrays.
9. Generic interfaces.
10. Generic type aliases.
11. Generic classes.
12. Multiple generic type parameters.
13. Generic type inference.
14. Explicit generic type arguments.
15. Real-world generic implementations.

**When you're ready, say: `OK, Phase 14`.**