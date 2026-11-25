# TypeScript Complete Learning Roadmap
# Phase 12: Literal Types, Template Literal Types, and Advanced String Types

**Level:** Intermediate to Advanced  
**Prerequisite:** Phase 11 – Type Narrowing and Type Guards  
**Goal:** Learn how to create precise types using literal values, template literal types, and TypeScript's built-in string manipulation types.

---

# 1. What Are Literal Types?

In TypeScript, a literal type represents an exact value rather than a general type.

For example:

```typescript
let username: string = "Riyaz";
```

Here, `username` can contain any string.

But consider:

```typescript
let username: "Riyaz" = "Riyaz";
```

Now `username` can contain only the exact string `"Riyaz"`.

This is called a **String Literal Type**.

### General Type vs Literal Type

| General Type | Literal Type |
|---|---|
| `string` | `"admin"` |
| `number` | `100` |
| `boolean` | `true` |
| Any string value | Only a specified string |
| Any number value | Only a specified number |

### Example

```typescript
let role: "admin";

role = "admin"; // Valid

// Error
role = "customer";
```

TypeScript allows only the exact literal value specified in the type.

**Important:** Literal types are compile-time restrictions. They do not create runtime validation.

---

# 2. String Literal Types

A string literal type restricts a variable to one or more specific string values.

### Example 1: Single String Literal

```typescript
let direction: "left";

direction = "left"; // Valid

// Error
direction = "right";
```

### Example 2: Multiple String Literal Values

You can combine multiple literal types using a union (`|`).

```typescript
let direction: "left" | "right" | "up" | "down";

direction = "left";
direction = "right";
direction = "up";

// Error
direction = "center";
```

This is useful when a variable should accept only predefined values.

### Example 3: User Roles

```typescript
type UserRole = "admin" | "customer" | "manager";

function createUser(name: string, role: UserRole) {
    console.log(name, role);
}

createUser("Alex", "admin");
createUser("John", "customer");

// Error
createUser("Sam", "developer");
```

### Example 4: Order Status

```typescript
type OrderStatus =
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

function updateOrderStatus(status: OrderStatus) {
    console.log("Order status:", status);
}

updateOrderStatus("shipped");

// Error
updateOrderStatus("completed");
```

### Why Are String Literal Types Useful?

They are useful for:

- User roles.
- Order statuses.
- Payment statuses.
- API methods.
- Application modes.
- Configuration values.
- Button variants.
- Notification types.

Instead of accepting any string, you restrict the application to known valid values.

---

# 3. Number Literal Types

Number literal types restrict variables to specific numeric values.

### Example 1: Single Number

```typescript
let age: 25;

age = 25; // Valid

// Error
age = 30;
```

### Example 2: Multiple Number Values

```typescript
type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

function rollDice(value: DiceValue) {
    console.log("Dice value:", value);
}

rollDice(4);

// Error
rollDice(7);
```

### Example 3: HTTP Status Codes

```typescript
type HttpStatus = 200 | 201 | 400 | 401 | 404 | 500;

function handleResponse(status: HttpStatus) {
    console.log("HTTP Status:", status);
}

handleResponse(200);
handleResponse(404);

// Error
handleResponse(301);
```

### Example 4: Pagination

```typescript
type PageSize = 10 | 20 | 50 | 100;

function getUsers(limit: PageSize) {
    console.log("Fetching users:", limit);
}

getUsers(20);

// Error
getUsers(15);
```

**Important:** Number literal types are especially useful when an application supports a limited set of numeric options.

---

# 4. Boolean Literal Types

Boolean literal types restrict a value to either `true` or `false`.

JavaScript has only two boolean values, so the literal types are:

```typescript
true
false
```

### Example 1: Single Boolean Literal

```typescript
let isActive: true = true;

// Error
isActive = false;
```

### Example 2: Boolean Literal Union

```typescript
type FeatureStatus = true | false;

let isEnabled: FeatureStatus = true;

isEnabled = false;
```

This is equivalent to:

```typescript
let isEnabled: boolean;
```

Therefore, a union of `true | false` is usually unnecessary when a general boolean is sufficient.

### Example 3: Literal Boolean in Object Types

```typescript
type ApiResponse = {
    success: true;
    data: string;
};

const response: ApiResponse = {
    success: true,
    data: "User created"
};
```

This type requires `success` to be exactly `true`.

You can also define:

```typescript
type SuccessResponse = {
    success: true;
    data: string;
};

type ErrorResponse = {
    success: false;
    message: string;
};

type Response = SuccessResponse | ErrorResponse;
```

Now TypeScript can narrow the response using the `success` property.

```typescript
function handleResponse(response: Response) {
    if (response.success) {
        console.log(response.data);
    } else {
        console.log(response.message);
    }
}
```

This is another example of a discriminated union.

---

# 5. Literal Type Inference

TypeScript can automatically infer literal types in certain situations.

However, the inference behavior depends on whether you use `let`, `const`, or an explicit annotation.

### Example 1: let

```typescript
let role = "admin";
```

TypeScript generally infers:

```typescript
let role: string;
```

Why?

Because `let` variables can be reassigned.

```typescript
role = "customer";
role = "manager";
```

TypeScript therefore uses the wider `string` type.

### Example 2: const

```typescript
const role = "admin";
```

TypeScript infers:

```typescript
const role: "admin";
```

Why?

Because a `const` variable cannot be reassigned.

Its value remains `"admin"`.

### Comparison

| Declaration | Inferred type |
|---|---|
| `let name = "Alex"` | `string` |
| `const name = "Alex"` | `"Alex"` |
| `let age = 25` | `number` |
| `const age = 25` | `25` |
| `let active = true` | `boolean` |
| `const active = true` | `true` |

### Example 3: Object Properties

Consider:

```typescript
const user = {
    name: "Alex",
    role: "admin"
};
```

You might expect:

```typescript
{
    name: "Alex";
    role: "admin";
}
```

But TypeScript generally infers:

```typescript
{
    name: string;
    role: string;
}
```

Why?

Because object properties can still be modified, even when the object variable is declared using `const`.

```typescript
user.role = "customer";
```

This is allowed.

### Important Concept

`const` prevents reassignment of the variable, not modification of its object properties.

```typescript
const user = {
    name: "Alex"
};

// Valid
user.name = "John";

// Error
user = {
    name: "Sam"
};
```

---

# 6. The as const Assertion

The `as const` assertion tells TypeScript to infer the narrowest possible literal types and make object properties and arrays readonly.

It is particularly useful when defining configuration objects, constants, and fixed collections of values.

### Example 1: Without as const

```typescript
const user = {
    name: "Alex",
    role: "admin"
};
```

Inferred type:

```typescript
{
    name: string;
    role: string;
}
```

### Example 2: With as const

```typescript
const user = {
    name: "Alex",
    role: "admin"
} as const;
```

Inferred type:

```typescript
{
    readonly name: "Alex";
    readonly role: "admin";
}
```

Now:

```typescript
// Error
user.name = "John";

// Error
user.role = "customer";
```

Both properties are readonly.

### Example 3: Arrays

Without `as const`:

```typescript
const roles = ["admin", "customer", "manager"];
```

Inferred type:

```typescript
string[]
```

With `as const`:

```typescript
const roles = ["admin", "customer", "manager"] as const;
```

Inferred type:

```typescript
readonly ["admin", "customer", "manager"]
```

This is a readonly tuple containing three exact string literal types.

### Example 4: Deriving a Union From an Array

This is an important real-world TypeScript pattern.

```typescript
const roles = [
    "admin",
    "customer",
    "manager"
] as const;

type UserRole = typeof roles[number];
```

Now:

```typescript
type UserRole = "admin" | "customer" | "manager";
```

Let's understand the syntax.

**Step 1:**

```typescript
typeof roles
```

This obtains the type of the `roles` variable.

Result:

```typescript
readonly ["admin", "customer", "manager"]
```

**Step 2:**

```typescript
typeof roles[number]
```

This accesses the type of an element at a numeric index.

Result:

```typescript
"admin" | "customer" | "manager"
```

**Step 3: Use the generated union.**

```typescript
function createUser(role: UserRole) {
    console.log(role);
}

createUser("admin");

// Error
createUser("developer");
```

### Example 5: Configuration Object

```typescript
const appConfig = {
    appName: "My Application",
    environment: "production",
    version: 1
} as const;
```

Inferred type:

```typescript
{
    readonly appName: "My Application";
    readonly environment: "production";
    readonly version: 1;
}
```

This is useful when configuration values should remain fixed at the type level.

### Important: as const Is Not Object.freeze()

`as const` affects TypeScript's type system. It does not freeze an object at runtime.

```typescript
const user = {
    name: "Alex"
} as const;
```

TypeScript prevents:

```typescript
user.name = "John";
```

But JavaScript runtime immutability is a separate concern.

If you need runtime freezing, JavaScript provides:

```typescript
Object.freeze(user);
```

Also, `Object.freeze()` is shallow by default.

---

# 7. What Are Template Literal Types?

Template literal types allow you to create new string types using existing string literal types.

They use syntax similar to JavaScript template literals.

JavaScript template literal:

```typescript
const message = `Hello ${username}`;
```

TypeScript template literal type:

```typescript
type Greeting = `Hello ${string}`;
```

The second example defines a type for strings that begin with `"Hello "`.

### Example 1: Basic Template Literal Type

```typescript
type Greeting = `Hello ${string}`;

let message: Greeting;

message = "Hello Alex";
message = "Hello Riyaz";

// Error
message = "Good Morning Alex";
```

### Example 2: Combining Literal Types

```typescript
type Color = "red" | "green" | "blue";

type BackgroundColor = `bg-${Color}`;
```

The resulting type is equivalent to:

```typescript
type BackgroundColor =
    | "bg-red"
    | "bg-green"
    | "bg-blue";
```

Usage:

```typescript
let background: BackgroundColor;

background = "bg-red";
background = "bg-blue";

// Error
background = "bg-yellow";
```

### Example 3: Combining Multiple Unions

```typescript
type Size = "small" | "medium" | "large";

type Color = "red" | "blue";

type ButtonClass = `${Size}-${Color}`;
```

The resulting union is:

```typescript
type ButtonClass =
    | "small-red"
    | "small-blue"
    | "medium-red"
    | "medium-blue"
    | "large-red"
    | "large-blue";
```

TypeScript generates all combinations.

This is called a **Cartesian Product** of the union members.

### Example 4: API Routes

```typescript
type Resource = "users" | "products" | "orders";

type ApiRoute = `/api/${Resource}`;
```

Result:

```typescript
type ApiRoute =
    | "/api/users"
    | "/api/products"
    | "/api/orders";
```

Usage:

```typescript
function fetchResource(route: ApiRoute) {
    console.log("Fetching:", route);
}

fetchResource("/api/users");

// Error
fetchResource("/api/customers");
```

### Example 5: Event Names

```typescript
type EventName = "click" | "focus" | "blur";

type HandlerName = `on${Capitalize<EventName>}`;
```

Result:

```typescript
type HandlerName =
    | "onClick"
    | "onFocus"
    | "onBlur";
```

This is particularly useful when creating reusable component APIs.

---

# 8. Template Literal Types With Multiple Variables

Template literal types can contain multiple placeholders.

### Example 1: Combining Two Literal Unions

```typescript
type Language = "en" | "hi";

type Page = "home" | "about" | "contact";

type TranslationKey = `${Language}_${Page}`;
```

Result:

```typescript
type TranslationKey =
    | "en_home"
    | "en_about"
    | "en_contact"
    | "hi_home"
    | "hi_about"
    | "hi_contact";
```

### Example 2: CSS Utility Classes

```typescript
type Direction = "top" | "bottom" | "left" | "right";

type Spacing = 1 | 2 | 3 | 4;

type MarginClass = `m-${Direction}-${Spacing}`;
```

Some valid values:

```typescript
const margin1: MarginClass = "m-top-1";
const margin2: MarginClass = "m-left-3";
const margin3: MarginClass = "m-bottom-4";
```

Invalid:

```typescript
// Error
const margin4: MarginClass = "m-center-5";
```

### Example 3: Database Column Names

```typescript
type Entity = "user" | "product" | "order";

type Field = "id" | "name" | "status";

type DatabaseColumn = `${Entity}_${Field}`;
```

Example valid values:

```typescript
const column1: DatabaseColumn = "user_id";
const column2: DatabaseColumn = "product_name";
const column3: DatabaseColumn = "order_status";
```

### Important Note

When multiple union types are interpolated, TypeScript generates combinations of their members.

Large unions can produce a very large number of combinations, potentially increasing type-checking complexity.

Use template literal types thoughtfully.

---

# 9. Built-in String Manipulation Types

TypeScript provides four built-in utility types for transforming string literal types.

These are:

1. `Uppercase<T>`
2. `Lowercase<T>`
3. `Capitalize<T>`
4. `Uncapitalize<T>`

They are implemented using TypeScript's intrinsic string manipulation types.

## 9.1 Uppercase<T>

Converts string literal types to uppercase.

```typescript
type Name = "riyaz";

type UpperName = Uppercase<Name>;
```

Result:

```typescript
type UpperName = "RIYAZ";
```

Multiple values:

```typescript
type Role = "admin" | "customer" | "manager";

type UpperRole = Uppercase<Role>;
```

Result:

```typescript
type UpperRole = "ADMIN" | "CUSTOMER" | "MANAGER";
```

## 9.2 Lowercase<T>

Converts string literal types to lowercase.

```typescript
type Role = "ADMIN";

type LowerRole = Lowercase<Role>;
```

Result:

```typescript
type LowerRole = "admin";
```

## 9.3 Capitalize<T>

Converts the first character of a string literal type to uppercase.

```typescript
type Name = "riyaz";

type CapitalizedName = Capitalize<Name>;
```

Result:

```typescript
type CapitalizedName = "Riyaz";
```

For a union:

```typescript
type Events = "click" | "focus" | "blur";

type CapitalizedEvents = Capitalize<Events>;
```

Result:

```typescript
type CapitalizedEvents = "Click" | "Focus" | "Blur";
```

## 9.4 Uncapitalize<T>

Converts the first character of a string literal type to lowercase.

```typescript
type Name = "Riyaz";

type UncapitalizedName = Uncapitalize<Name>;
```

Result:

```typescript
type UncapitalizedName = "riyaz";
```

### Quick Comparison

| Utility Type | Transformation |
|---|---|
| `Uppercase<T>` | Converts entire string to uppercase |
| `Lowercase<T>` | Converts entire string to lowercase |
| `Capitalize<T>` | Capitalizes first character |
| `Uncapitalize<T>` | Lowercases first character |

### Important

These types operate on string literal types at compile time.

They do not transform JavaScript values at runtime.

For runtime conversion, use:

```typescript
const name = "riyaz";

console.log(name.toUpperCase());
console.log(name.toLowerCase());
```

---

# 10. Combining Template Literal Types With String Manipulation

You can combine template literal types with the four built-in string manipulation types.

### Example 1: Event Handler Names

```typescript
type Event = "click" | "focus" | "blur";

type EventHandler = `on${Capitalize<Event>}`;
```

Result:

```typescript
type EventHandler =
    | "onClick"
    | "onFocus"
    | "onBlur";
```

### Example 2: Environment Variables

```typescript
type Environment = "development" | "production" | "testing";

type EnvironmentVariable = `APP_${Uppercase<Environment>}`;
```

Result:

```typescript
type EnvironmentVariable =
    | "APP_DEVELOPMENT"
    | "APP_PRODUCTION"
    | "APP_TESTING";
```

### Example 3: CSS Class Names

```typescript
type Color = "primary" | "secondary" | "danger";

type ButtonClass = `btn-${Capitalize<Color>}`;
```

Result:

```typescript
type ButtonClass =
    | "btn-Primary"
    | "btn-Secondary"
    | "btn-Danger";
```

### Example 4: API Method Names

```typescript
type Resource = "user" | "product" | "order";

type Action = "create" | "update" | "delete";

type ApiMethod = `${Capitalize<Action>}${Capitalize<Resource>}`;
```

Result:

```typescript
type ApiMethod =
    | "CreateUser"
    | "CreateProduct"
    | "CreateOrder"
    | "UpdateUser"
    | "UpdateProduct"
    | "UpdateOrder"
    | "DeleteUser"
    | "DeleteProduct"
    | "DeleteOrder";
```

This technique is useful for generating strongly typed names from smaller sets of values.

---

# 11. Template Literal Types With Generic Types

Template literal types can also be used with generics.

Generics will be covered in greater detail in a later phase. For now, understand how they work together.

### Example 1: Prefixing a String Type

```typescript
type AddPrefix<T extends string> = `app-${T}`;

type User = AddPrefix<"user">;

type Product = AddPrefix<"product">;
```

Result:

```typescript
type User = "app-user";

type Product = "app-product";
```

### Example 2: Creating API Paths

```typescript
type ApiPath<T extends string> = `/api/${T}`;

type UserPath = ApiPath<"users">;

type ProductPath = ApiPath<"products">;
```

Result:

```typescript
type UserPath = "/api/users";

type ProductPath = "/api/products";
```

### Example 3: Combining Generic Types

```typescript
type EventHandler<T extends string> = `on${Capitalize<T>}`;

type ClickHandler = EventHandler<"click">;

type FocusHandler = EventHandler<"focus">;
```

Result:

```typescript
type ClickHandler = "onClick";

type FocusHandler = "onFocus";
```

**Important:** The `extends string` constraint ensures that the generic type must be compatible with a string type.

---

# 12. Real-World Application: Type-Safe Event System

Let's create a simple event system using template literal types.

### Step 1: Define Events

```typescript
type Events = "click" | "focus" | "blur";
```

### Step 2: Generate Event Handler Names

```typescript
type EventHandler = `on${Capitalize<Events>}`;
```

Result:

```typescript
type EventHandler =
    | "onClick"
    | "onFocus"
    | "onBlur";
```

### Step 3: Create a Configuration Object

```typescript
type EventConfig = {
    [K in EventHandler]: () => void;
};
```

This uses a mapped type, which will be covered in a later phase.

### Step 4: Create an Object

```typescript
const eventConfig: EventConfig = {
    onClick() {
        console.log("Clicked");
    },

    onFocus() {
        console.log("Focused");
    },

    onBlur() {
        console.log("Blurred");
    }
};
```

If you forget a required property or add an invalid property to this fresh object literal, TypeScript reports an error.

This pattern is useful when designing strongly typed event systems and component APIs.

---

# 13. Real-World Application: Type-Safe API Routes

Let's build a small route system.

### Step 1: Define Resources

```typescript
type Resource = "users" | "products" | "orders";
```

### Step 2: Define HTTP Methods

```typescript
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
```

### Step 3: Generate API Paths

```typescript
type ApiPath = `/api/${Resource}`;
```

### Step 4: Define Request Types

```typescript
type ApiRequest = {
    method: HttpMethod;
    path: ApiPath;
};
```

### Step 5: Create a Function

```typescript
function makeRequest(request: ApiRequest) {
    console.log(request.method, request.path);
}
```

Usage:

```typescript
makeRequest({
    method: "GET",
    path: "/api/users"
});

makeRequest({
    method: "POST",
    path: "/api/products"
});
```

Invalid examples:

```typescript
makeRequest({
    method: "PATCH",
    path: "/api/users"
});
```

```typescript
makeRequest({
    method: "GET",
    path: "/api/customers"
});
```

Both produce type errors.

**Important:** This example validates the method and path separately. It does not yet enforce which HTTP methods are allowed for each particular route. That requires a more advanced type design.

---

# 14. Real-World Application: Type-Safe Environment Configuration

Environment variables are commonly used in Node.js applications.

For example:

```typescript
process.env.NODE_ENV
```

Environment variables are generally typed as strings or possibly `undefined`, depending on the declaration.

You can define a limited set of environment names:

```typescript
type Environment = "development" | "production" | "testing";
```

Now create a configuration type:

```typescript
type AppConfig = {
    environment: Environment;
    debug: boolean;
};
```

Usage:

```typescript
const config: AppConfig = {
    environment: "development",
    debug: true
};
```

Invalid:

```typescript
const config: AppConfig = {
    environment: "staging",
    debug: true
};
```

TypeScript rejects `"staging"` because it is not included in the `Environment` union.

You can also generate environment variable names:

```typescript
type Environment = "development" | "production" | "testing";

type EnvKey = `APP_${Uppercase<Environment>}`;
```

Result:

```typescript
type EnvKey =
    | "APP_DEVELOPMENT"
    | "APP_PRODUCTION"
    | "APP_TESTING";
```

Remember that TypeScript types do not validate actual environment variables at runtime. You still need runtime validation when loading configuration.

---

# 15. Important Concepts and Comparisons

## 15.1 Literal Types vs Union Types

A literal type represents an exact value.

A union combines multiple possible types.

```typescript
type Role = "admin";
```

This is a single literal type.

```typescript
type Role = "admin" | "customer";
```

This is a union of two literal types.

Literal types and union types are frequently used together.

## 15.2 const vs as const

| Feature | `const` | `as const` |
|---|---|---|
| Prevents variable reassignment | Yes | No, not by itself |
| Preserves primitive literal inference | Yes | Yes |
| Makes object properties readonly | No | Yes |
| Makes array a readonly tuple | No | Yes |
| Provides runtime immutability | No | No |

Example:

```typescript
const user = {
    name: "Alex"
};
```

The property `name` is generally inferred as `string`.

But:

```typescript
const user = {
    name: "Alex"
} as const;
```

The property is inferred as `readonly "Alex"`.

## 15.3 Template Literal Types vs JavaScript Template Literals

| JavaScript Template Literal | TypeScript Template Literal Type |
|---|---|
| Creates runtime strings | Creates compile-time types |
| Uses backticks | Uses backticks |
| Supports runtime expressions | Combines types |
| Produces string values | Produces string literal types |

JavaScript:

```typescript
const message = `Hello ${name}`;
```

TypeScript:

```typescript
type Message = `Hello ${string}`;
```

These look similar but serve different purposes.

---

# 16. Common Mistakes

### Mistake 1: Assuming let Preserves Literal Types

```typescript
let role = "admin";
```

The inferred type is generally `string`, not `"admin"`.

If you need a specific literal type:

```typescript
let role: "admin" = "admin";
```

### Mistake 2: Assuming const Makes Object Properties Readonly

```typescript
const user = {
    name: "Alex"
};

// Valid
user.name = "John";
```

Use `as const` if you need readonly literal properties.

### Mistake 3: Assuming as const Creates Runtime Immutability

`as const` only affects TypeScript's type system.

Use runtime mechanisms such as `Object.freeze()` when runtime freezing is required.

### Mistake 4: Using Template Literal Types With General Strings

```typescript
type ApiRoute = `/api/${string}`;
```

This allows any string after `/api/`.

It does not restrict the route to a predefined set of resources.

For stricter checking:

```typescript
type Resource = "users" | "products";

type ApiRoute = `/api/${Resource}`;
```

### Mistake 5: Expecting String Utility Types to Transform Runtime Values

```typescript
type Name = Uppercase<"riyaz">;
```

This produces a type, not a runtime string.

For runtime conversion:

```typescript
const name = "riyaz".toUpperCase();
```

### Mistake 6: Creating Extremely Large Template Literal Unions

Combining many unions can generate thousands of possible combinations.

This can increase compiler workload and make types difficult to understand.

Use smaller, meaningful unions whenever possible.

---

# 17. Interview Questions and Answers

### Q1. What is a literal type in TypeScript?

A literal type restricts a value to one or more exact values instead of allowing every value of a general type.

Example:

```typescript
type Role = "admin" | "customer";
```

### Q2. What are the three main categories of literal types?

- String literal types.
- Number literal types.
- Boolean literal types.

### Q3. What is the difference between string and string literal types?

`string` accepts any string value, whereas `"admin"` accepts only the exact string `"admin"`.

### Q4. Why does TypeScript infer string for let but a literal type for const?

A `let` variable can be reassigned, so TypeScript generally widens its inferred type. A `const` variable cannot be reassigned, so TypeScript can preserve its exact literal value.

### Q5. What is as const?

`as const` is a const assertion that prevents literal widening and makes object properties and array types readonly at the type level.

### Q6. What is the difference between const and as const?

`const` prevents reassignment of a variable. `as const` additionally preserves literal types and makes object properties or array elements readonly in the inferred type.

### Q7. What are template literal types?

Template literal types allow developers to create new string literal types by combining existing string types and literal types using template literal syntax.

### Q8. Can template literal types combine union types?

Yes. TypeScript generates combinations of the union members.

Example:

```typescript
type Color = "red" | "blue";

type Size = "small" | "large";

type Result = `${Size}-${Color}`;
```

### Q9. What are the four built-in string manipulation types?

- `Uppercase<T>`
- `Lowercase<T>`
- `Capitalize<T>`
- `Uncapitalize<T>`

### Q10. Do string manipulation types work at runtime?

No. They transform string literal types during compile-time type checking. JavaScript string methods perform runtime transformations.

### Q11. What does typeof roles[number] mean?

It extracts the type of an array or tuple's elements.

For example:

```typescript
const roles = ["admin", "customer"] as const;

type Role = typeof roles[number];
```

Result:

```typescript
type Role = "admin" | "customer";
```

### Q12. Can template literal types use generic types?

Yes. They can combine generic type parameters with string literals and other type transformations.

### Q13. Are template literal types useful for API development?

Yes. They can help create strongly typed API paths, event names, environment variable keys, and other string-based identifiers.

### Q14. Does as const freeze an object at runtime?

No. It only changes the inferred TypeScript type. Runtime immutability requires separate JavaScript mechanisms.

---

# 18. Practical Exercises

Complete these exercises to strengthen your understanding.

### Exercise 1: User Roles

Create a type named `UserRole` that accepts:

- admin
- customer
- manager
- developer

Create a function that accepts only these roles.

### Exercise 2: Order Status

Create an `OrderStatus` type that accepts:

- pending
- processing
- shipped
- delivered
- cancelled

Create a function that updates order status.

### Exercise 3: Number Literal Types

Create a `PageSize` type that accepts:

```typescript
10 | 20 | 50 | 100
```

Create a pagination function that accepts only these values.

### Exercise 4: Literal Type Inference

Predict the inferred types of these variables:

```typescript
let name = "Alex";

const city = "Ahmedabad";

let age = 25;

const isActive = true;

const user = {
    name: "Alex",
    role: "admin"
};
```

Then verify your answers using VS Code's TypeScript language service.

### Exercise 5: as const

Create an array:

```typescript
const permissions = [
    "read",
    "write",
    "delete"
] as const;
```

Derive a `Permission` union type from this array.

Create a function that accepts only valid permissions.

### Exercise 6: Template Literal Types

Create a type that generates:

```typescript
"/api/users"
"/api/products"
"/api/orders"
```

Start with:

```typescript
type Resource = "users" | "products" | "orders";
```

### Exercise 7: String Manipulation

Create a type that transforms:

```typescript
type Event = "click" | "focus" | "blur";
```

Into:

```typescript
"onClick" | "onFocus" | "onBlur"
```

### Exercise 8: Multiple Template Literal Unions

Create:

```typescript
type Size = "small" | "medium" | "large";

type Color = "red" | "green" | "blue";
```

Generate all combinations in this format:

```typescript
"small-red"
"small-green"
"small-blue"
...
```

### Exercise 9: Environment Variables

Create an `Environment` type:

```typescript
"development" | "production" | "testing"
```

Generate:

```typescript
"APP_DEVELOPMENT"
"APP_PRODUCTION"
"APP_TESTING"
```

### Exercise 10: Real-World Event Configuration

Create an event configuration system that:

1. Accepts events `click`, `focus`, and `blur`.
2. Generates handler names such as `onClick`, `onFocus`, and `onBlur`.
3. Requires all three handler functions.
4. Rejects invalid handler names.

---

# 19. Phase 12 Completion Checklist

You should now understand:

- [ ] What literal types are.
- [ ] String literal types.
- [ ] Number literal types.
- [ ] Boolean literal types.
- [ ] Literal type unions.
- [ ] Literal type inference.
- [ ] Literal widening.
- [ ] `const` vs `let`.
- [ ] `as const` assertions.
- [ ] Readonly literal objects and tuples.
- [ ] Deriving union types using `typeof array[number]`.
- [ ] Template literal types.
- [ ] Combining multiple unions.
- [ ] Cartesian product behavior.
- [ ] `Uppercase<T>`.
- [ ] `Lowercase<T>`.
- [ ] `Capitalize<T>`.
- [ ] `Uncapitalize<T>`.
- [ ] Combining template literals with string manipulation.
- [ ] Template literal types with generics.
- [ ] Real-world type-safe API routes and event names.

---

## What's Next?

# Phase 13: Enums in TypeScript

In the next phase, we will cover:

1. What are enums?
2. Why do we need enums?
3. Numeric enums.
4. String enums.
5. Heterogeneous enums.
6. Default enum values.
7. Custom enum values.
8. Reverse mapping in numeric enums.
9. Const enums.
10. Computed enum members.
11. Enum type safety.
12. Enums vs union literal types.
13. Enums in functions and objects.
14. Enums in API responses.
15. Real-world enum implementations.
16. Best practices and common mistakes.

**When you're ready, say: `OK, Phase 13`.**