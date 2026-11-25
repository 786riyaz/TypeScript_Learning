# Phase 3: Basic Types in TypeScript
**Level: Beginner | Foundation of TypeScript**

In this phase, we will learn the TypeScript type system and understand how to define, infer, and restrict the types of values.

Types are one of the most important concepts in TypeScript. Almost every advanced TypeScript concept is built on top of them.

By the end of this phase, you should understand:

- What types are.
- How TypeScript handles types.
- Type annotations.
- Type inference.
- Primitive types.
- Special types.
- Literal types.
- Type compatibility.
- Type checking.
- Practical type safety.

---

# 1. What Are Types?

A type defines what kind of value a variable can hold and what operations are valid for that value.

For example:

```typescript
let age: number = 25;

let username: string = "Riyaz";

let isActive: boolean = true;
```

Here:

| Variable | Type | Value |
|---|---|---|
| age | number | 25 |
| username | string | "Riyaz" |
| isActive | boolean | true |

TypeScript uses these types to determine whether your code is valid.

### Example

```typescript
let age: number = 25;

age = 30;       // Valid

age = "Hello";  // Error
```

Why?

Because `age` is declared as a number, and `"Hello"` is a string.

TypeScript checks the compatibility of these values.

### Why Are Types Important?

1. Prevent incompatible assignments.
2. Improve code readability.
3. Provide better autocomplete.
4. Detect errors during development.
5. Make applications easier to maintain.
6. Help developers understand expected data structures.

---

# 2. Type Annotations

A type annotation means explicitly specifying the type of a variable, parameter, property, or return value.

Type annotations use a colon (`:`).

### Syntax

```typescript
let variableName: type = value;
```

### Example

```typescript
let username: string = "Riyaz";

let age: number = 25;

let isLoggedIn: boolean = true;
```

Here:

- `username` must contain a string.
- `age` must contain a number.
- `isLoggedIn` must contain a boolean.

### More Examples

```typescript
let salary: number = 50000;

let city: string = "Ahmedabad";

let isAvailable: boolean = false;

let score: number = 95.5;
```

### Incorrect Assignments

```typescript
let salary: number = 50000;

salary = "Fifty Thousand"; // Error
```

### Important Rule

Type annotations do not change the actual runtime value.

They only provide type information to TypeScript.

For example:

```typescript
let age: number = 25;
```

Compiled JavaScript:

```javascript
let age = 25;
```

The `number` annotation disappears during compilation.

---

# 3. Type Inference

Type inference means TypeScript automatically determines the type of a variable based on its initial value or surrounding context.

You do not always need to explicitly specify types.

### Example

```typescript
let username = "Riyaz";

let age = 25;

let isActive = true;
```

TypeScript automatically infers:

```typescript
let username: string = "Riyaz";

let age: number = 25;

let isActive: boolean = true;
```

You do not need to write these annotations manually.

### Example: Type Inference with Variables

```typescript
let price = 500;

price = 1000; // Valid

price = "Five Hundred"; // Error
```

Why does TypeScript generate an error?

Because it inferred that `price` has the type `number`.

### Example: Type Inference with Functions

```typescript
function add(a: number, b: number) {
    return a + b;
}
```

TypeScript automatically infers the return type:

```typescript
function add(a: number, b: number): number {
    return a + b;
}
```

### Example: Type Inference with Arrays

```typescript
let numbers = [10, 20, 30, 40];
```

TypeScript infers:

```typescript
let numbers: number[];
```

### Type Annotation vs Type Inference

| Feature | Type Annotation | Type Inference |
|---|---|---|
| Meaning | Developer explicitly defines a type | TypeScript determines the type |
| Syntax | Uses `:` | No explicit annotation required |
| Example | `let age: number = 25` | `let age = 25` |
| Control | Developer specifies the intended type | Compiler derives it from context |

### Best Practice

Use type inference when the type is obvious.

Use explicit annotations when they improve clarity or when TypeScript cannot infer the intended type correctly.

---

# 4. Number Type

The `number` type represents numeric values.

It supports:

- Integers
- Decimal numbers
- Positive numbers
- Negative numbers
- Zero
- Floating-point values

### Example

```typescript
let age: number = 25;

let price: number = 99.99;

let temperature: number = -5;

let quantity: number = 0;
```

### Mathematical Operations

```typescript
let a: number = 10;

let b: number = 20;

let addition = a + b;

let subtraction = a - b;

let multiplication = a * b;

let division = a / b;

let remainder = a % b;

console.log(addition);
console.log(subtraction);
console.log(multiplication);
console.log(division);
console.log(remainder);
```

Output:

```text
30
-10
200
0.5
10
```

### Special Numeric Values

JavaScript has several special numeric values.

TypeScript also supports them through the `number` type.

#### NaN

`NaN` means Not-a-Number.

```typescript
let result: number = NaN;

console.log(result);
```

Output:

```text
NaN
```

#### Infinity

```typescript
let result: number = Infinity;

console.log(result);
```

Output:

```text
Infinity
```

#### Negative Infinity

```typescript
let result: number = -Infinity;

console.log(result);
```

Output:

```text
-Infinity
```

### Important Note

TypeScript's `number` type follows JavaScript's number behavior. It uses IEEE 754 double-precision floating-point numbers.

---

# 5. String Type

The `string` type represents textual data.

### Example

```typescript
let username: string = "Riyaz";

let city: string = "Ahmedabad";

let message: string = "Welcome to TypeScript";
```

### Three Ways to Create Strings

**1. Double Quotes**

```typescript
let name: string = "Riyaz";
```

**2. Single Quotes**

```typescript
let name: string = 'Riyaz';
```

**3. Template Literals**

```typescript
let name: string = `Riyaz`;
```

All three are valid.

### String Interpolation

Template literals allow us to insert variables into strings.

```typescript
let username: string = "Riyaz";

let age: number = 25;

let message: string = `My name is ${username} and I am ${age} years old.`;

console.log(message);
```

Output:

```text
My name is Riyaz and I am 25 years old.
```

### Common String Methods

```typescript
let message: string = "Hello TypeScript";

console.log(message.length);

console.log(message.toUpperCase());

console.log(message.toLowerCase());

console.log(message.includes("TypeScript"));

console.log(message.startsWith("Hello"));

console.log(message.endsWith("Script"));

console.log(message.slice(0, 5));

console.log(message.replace("Hello", "Welcome"));
```

### Important

TypeScript provides autocomplete and type checking for string methods.

For example:

```typescript
let username: string = "Riyaz";

username.toUpperCase(); // Valid

username.toFixed(2); // Error
```

`toFixed()` is a number method, not a string method.

---

# 6. Boolean Type

The `boolean` type represents logical values.

It has only two possible values:

- `true`
- `false`

### Example

```typescript
let isLoggedIn: boolean = true;

let isAdmin: boolean = false;

let isAvailable: boolean = true;
```

### Boolean with Conditions

```typescript
let age: number = 25;

let isAdult: boolean = age >= 18;

console.log(isAdult);
```

Output:

```text
true
```

### Boolean with Functions

```typescript
function isEligible(age: number): boolean {
    return age >= 18;
}

console.log(isEligible(25));

console.log(isEligible(15));
```

Output:

```text
true
false
```

### Important

JavaScript also has truthy and falsy values.

However, these are not boolean values themselves.

For example:

```typescript
let username = "Riyaz";

if (username) {
    console.log("Username exists");
}
```

The condition works because JavaScript evaluates the string's truthiness.

We will study truthiness and type narrowing in detail later.

---

# 7. Null Type

`null` represents the intentional absence of a value.

### Example

```typescript
let selectedUser: null = null;
```

This variable can only contain `null`.

However, in practical applications, we often want a variable to contain either an object or `null`.

For example:

```typescript
let selectedUser: string | null = null;

selectedUser = "Riyaz";

selectedUser = null;
```

Here:

```typescript
string | null
```

means the variable can contain either a string or null.

The `|` operator represents a union type.

We will study union types in Phase 10.

### Null with Strict Mode

When `strictNullChecks` is enabled:

```typescript
let username: string = "Riyaz";

username = null; // Error
```

But:

```typescript
let username: string | null = "Riyaz";

username = null; // Valid
```

**Important:** TypeScript treats `null` as a distinct type when strict null checking is enabled.

---

# 8. Undefined Type

`undefined` represents a value that has not been assigned or is unavailable.

### Example

```typescript
let username: undefined = undefined;
```

This variable can only contain `undefined`.

### Uninitialized Variables

```typescript
let age: number;

console.log(age);
```

The value of `age` is `undefined` at runtime.

However, TypeScript normally reports an error if you try to read a local variable before assigning it.

### Example with Union Type

```typescript
let username: string | undefined = undefined;

username = "Riyaz";

username = undefined;
```

Both values are allowed.

### Null vs Undefined

| Feature | Null | Undefined |
|---|---|---|
| Meaning | Intentional absence of value | Missing or unassigned value |
| Assignment | `null` | `undefined` |
| TypeScript type | `null` | `undefined` |
| JavaScript type using `typeof` | `object` | `undefined` |

Example:

```typescript
console.log(typeof null);

console.log(typeof undefined);
```

Output:

```text
object
undefined
```

The `typeof null === "object"` behavior is a historical JavaScript quirk.

---

# 9. BigInt Type

The `bigint` type represents integers larger than the safe integer range of JavaScript's `number` type.

JavaScript's maximum safe integer is:

```typescript
Number.MAX_SAFE_INTEGER
```

Its value is:

```text
9007199254740991
```

If you need integers beyond this range with exact integer precision, you can use `bigint`.

### Example

```typescript
let bigNumber: bigint = 9007199254740992n;

console.log(bigNumber);
```

Notice the `n` suffix.

It indicates a BigInt literal.

### Another Example

```typescript
let first: bigint = 100000000000000000n;

let second: bigint = 200000000000000000n;

let result: bigint = first + second;

console.log(result);
```

Output:

```text
300000000000000000n
```

### Important Rules

You cannot directly mix `number` and `bigint` in arithmetic operations.

```typescript
let a: number = 100;

let b: bigint = 200n;

let result = a + b; // Error
```

You must convert them explicitly where appropriate.

```typescript
let result = BigInt(a) + b;
```

Or:

```typescript
let result = a + Number(b);
```

However, converting a large BigInt to a number may lose precision.

### Use Cases

- Large integer calculations.
- Financial systems requiring large integer representations.
- Cryptographic operations.
- Large identifiers represented as integers.

---

# 10. Symbol Type

A `symbol` represents a unique primitive value.

Even when two symbols contain the same description, they are different values.

### Example

```typescript
let first: symbol = Symbol("id");

let second: symbol = Symbol("id");

console.log(first === second);
```

Output:

```text
false
```

Why?

Because every call to `Symbol()` creates a unique symbol.

### Using Symbols as Object Keys

```typescript
const userId: symbol = Symbol("userId");

const user = {
    name: "Riyaz",
    [userId]: 101
};

console.log(user.name);

console.log(user[userId]);
```

Output:

```text
Riyaz
101
```

### Symbol.for()

`Symbol.for()` uses a global symbol registry.

```typescript
const first = Symbol.for("user");

const second = Symbol.for("user");

console.log(first === second);
```

Output:

```text
true
```

### Use Cases

- Creating unique property keys.
- Avoiding property-name collisions.
- Defining well-known symbol behavior.
- Implementing specialized object behavior.

---

# 11. Any Type

The `any` type disables most TypeScript type checking for a particular value.

It allows a variable to hold values of different types.

### Example

```typescript
let value: any = 100;

value = "Hello";

value = true;

value = {
    name: "Riyaz"
};
```

All these assignments are valid.

### Any with Functions

```typescript
let username: any = "Riyaz";

username.toUpperCase();

username.toFixed(2);
```

TypeScript does not report an error for these method calls.

But at runtime:

```typescript
username.toFixed(2);
```

will throw an error because `toFixed()` is not a string method.

### Any with Objects

```typescript
let user: any = {
    name: "Riyaz"
};

console.log(user.age);

console.log(user.address.city);
```

TypeScript does not protect you against these invalid property accesses.

### Why Is Any Dangerous?

It removes many of the benefits of TypeScript.

Consider:

```typescript
function calculateTotal(price: any, quantity: any): any {
    return price * quantity;
}
```

This function accepts almost anything.

TypeScript cannot provide meaningful guarantees about the arguments.

### Best Practice

Avoid `any` whenever possible.

Prefer `unknown` when the type of a value is not known.

---

# 12. Unknown Type

The `unknown` type represents a value whose type is not currently known.

Unlike `any`, TypeScript does not allow you to perform arbitrary operations on an unknown value without first checking or narrowing its type.

### Example

```typescript
let value: unknown = "Hello";
```

You can assign different values:

```typescript
value = 100;

value = true;

value = {
    name: "Riyaz"
};
```

These assignments are valid.

However, you cannot directly use arbitrary methods.

```typescript
let value: unknown = "Hello";

value.toUpperCase(); // Error
```

Why?

Because TypeScript does not know whether `value` is actually a string.

### Solution: Type Checking

```typescript
let value: unknown = "Hello";

if (typeof value === "string") {
    console.log(value.toUpperCase());
}
```

Output:

```text
HELLO
```

Now TypeScript knows that `value` is a string inside the `if` block.

### Another Example

```typescript
function processValue(value: unknown): void {

    if (typeof value === "number") {
        console.log(value.toFixed(2));
    }

    if (typeof value === "string") {
        console.log(value.toUpperCase());
    }
}

processValue(100);

processValue("Riyaz");
```

### Any vs Unknown

This is an extremely important interview topic.

| Feature | Any | Unknown |
|---|---|---|
| Accepts any value | Yes | Yes |
| Allows arbitrary operations | Yes | No |
| Requires type checking | No | Yes, before unsafe operations |
| Type safety | Low | Higher |
| Recommended | Avoid when possible | Prefer for genuinely unknown values |

**Remember:**

`any` means: "I don't want TypeScript to check this value."

`unknown` means: "I don't know the type yet, so check it before using it."

---

# 13. Void Type

The `void` type represents the absence of a useful return value from a function.

It is commonly used with functions that perform an action but do not return a result.

### Example

```typescript
function greet(): void {
    console.log("Hello Riyaz");
}
```

The function prints a message but does not return a value.

### Void with Parameters

```typescript
function displayUser(name: string): void {
    console.log(`Welcome ${name}`);
}

displayUser("Riyaz");
```

### Void vs Undefined

These concepts are related but different.

Consider:

```typescript
function greet(): void {
    console.log("Hello");
}
```

The function does not return a useful value.

Now consider:

```typescript
function getValue(): undefined {
    return undefined;
}
```

This function explicitly returns `undefined`.

### Difference

| Void | Undefined |
|---|---|
| Primarily used to describe functions that do not return a useful value | Represents a specific JavaScript primitive value |
| Function may omit a return statement | Function must return `undefined` when explicitly annotated this way |
| Commonly used in callback types | Can be used as a value type |

### Important

In TypeScript, a function returning `void` can sometimes return a value that will simply be ignored by its caller, depending on the function's type context.

We will study function return types in more detail in Phase 7.

---

# 14. Never Type

The `never` type represents values that never occur.

It is used when a function never successfully completes by returning a value.

Common examples:

- Functions that always throw errors.
- Functions that never terminate.
- Exhaustiveness checking.

### Example 1: Throwing an Error

```typescript
function throwError(): never {
    throw new Error("Something went wrong");
}
```

The function always throws an error.

It never returns normally.

### Example 2: Infinite Loop

```typescript
function infiniteLoop(): never {
    while (true) {
        console.log("Running...");
    }
}
```

This function never finishes.

### Example 3: Exhaustiveness Checking

```typescript
type Status = "success" | "error";

function handleStatus(status: Status): string {

    switch (status) {

        case "success":
            return "Operation completed";

        case "error":
            return "Operation failed";

        default:
            const impossible: never = status;
            return impossible;
    }
}
```

Here, TypeScript knows that all possible `Status` values are handled.

If you later add another status:

```typescript
type Status = "success" | "error" | "pending";
```

TypeScript reports an error in the exhaustive check until you handle `"pending"`.

### Never vs Void

| Feature | Never | Void |
|---|---|---|
| Meaning | Function never completes normally | Function does not return a useful value |
| Normal return | Impossible | Possible to finish without returning a value |
| Common use | Error handling and exhaustive checks | Functions performing actions |
| Example | `throw new Error()` | `console.log()` |

### Important Concept

`never` is also the bottom type in TypeScript's type system.

It is assignable to other types, but ordinary values of other types are not assignable to `never`.

---

# 15. Object Type

The `object` type represents non-primitive values.

It includes values such as:

- Objects
- Arrays
- Functions

It excludes primitive values such as:

- Strings
- Numbers
- Booleans
- Symbols
- BigInts
- Null
- Undefined

### Example

```typescript
let user: object = {
    name: "Riyaz",
    age: 25
};
```

This is valid.

```typescript
let numbers: object = [10, 20, 30];
```

This is also valid because arrays are objects in JavaScript.

### Important Limitation

The `object` type does not describe the specific properties of an object.

```typescript
let user: object = {
    name: "Riyaz"
};

console.log(user.name); // Error
```

Why?

Because TypeScript only knows that `user` is an object. It does not know that it contains a `name` property.

We will learn how to define specific object structures in Phase 6.

### object vs Object vs {}

These are different TypeScript concepts.

| Type | Meaning |
|---|---|
| `object` | Non-primitive values |
| `Object` | The global JavaScript Object type; generally avoid using it as a type |
| `{}` | Any non-nullish value, including primitives |

**Best Practice:** Prefer specific object types, interfaces, or type aliases instead of using `Object` or `{}` when describing data structures.

---

# 16. Literal Types

A literal type represents a specific value rather than a broad category of values.

### Example: String Literal

```typescript
let direction: "left" = "left";
```

This variable can only contain:

```text
left
```

The following assignment produces an error:

```typescript
direction = "right";
```

### Number Literal

```typescript
let statusCode: 200 = 200;
```

Only the number `200` is allowed.

```typescript
statusCode = 404; // Error
```

### Boolean Literal

```typescript
let isActive: true = true;
```

Only `true` is allowed.

```typescript
isActive = false; // Error
```

### Literal Union Types

You can combine multiple literal values using union types.

```typescript
let direction: "left" | "right" | "up" | "down";

direction = "left";

direction = "right";

direction = "up";

// direction = "center"; // Error
```

This is useful when a variable should accept only a predefined set of values.

### Real-World Example

```typescript
type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

let orderStatus: OrderStatus = "pending";

orderStatus = "completed";

// orderStatus = "shipped"; // Error
```

We will study type aliases and unions in detail in later phases.

---

# 17. Primitive Types vs Non-Primitive Types

Let's organize the types we have studied.

### Primitive Types

JavaScript has seven primitive types:

1. String
2. Number
3. Boolean
4. Undefined
5. Null
6. BigInt
7. Symbol

TypeScript supports all seven.

### Non-Primitive Types

Examples include:

- Objects
- Arrays
- Functions
- Classes
- Other structured values

### Important Distinction

`any`, `unknown`, `never`, and `void` are TypeScript type-system concepts, not additional JavaScript primitive types.

Literal types are also TypeScript type-system concepts.

---

# 18. Type Compatibility

Type compatibility determines whether a value of one type can be assigned to a variable of another type.

### Example

```typescript
let age: number = 25;

let anotherAge: number = age;
```

This is valid because both values are compatible with `number`.

### Incompatible Types

```typescript
let username: string = "Riyaz";

let age: number = username; // Error
```

A string cannot be assigned to a number variable.

### Structural Type Compatibility

TypeScript primarily uses structural typing.

This means compatibility is generally determined by the structure of types rather than their declared names.

Example:

```typescript
type User = {
    name: string;
};

type Employee = {
    name: string;
};

let user: User = {
    name: "Riyaz"
};

let employee: Employee = user;
```

This is valid because both types have the same required structure.

We will study structural typing in greater depth in Phase 35.

---

# 19. Type Widening

Type widening is the process where TypeScript infers a broader type from a more specific value in certain contexts.

### Example with let

```typescript
let status = "active";
```

TypeScript generally infers:

```typescript
let status: string;
```

Why not `"active"`?

Because a `let` variable can be reassigned.

```typescript
status = "inactive";
```

This is valid.

### Example with const

```typescript
const status = "active";
```

TypeScript infers:

```typescript
const status: "active";
```

Why?

Because a `const` variable cannot be reassigned.

### Comparison

| Declaration | Inferred Type |
|---|---|
| `let age = 25` | `number` |
| `const age = 25` | `25` |
| `let name = "Riyaz"` | `string` |
| `const name = "Riyaz"` | `"Riyaz"` |
| `let active = true` | `boolean` |
| `const active = true` | `true` |

This behavior is related to literal types and type inference.

---

# 20. Complete TypeScript Example

Let's combine several concepts into one practical example.

```typescript
// Basic primitive types

let username: string = "Riyaz";

let age: number = 25;

let isActive: boolean = true;

// Null and undefined

let selectedUser: string | null = null;

let optionalValue: string | undefined = undefined;

// BigInt

let largeNumber: bigint = 100000000000000n;

// Symbol

let userId: symbol = Symbol("userId");

// Any

let dynamicValue: any = "Hello";

dynamicValue = 100;

// Unknown

let unknownValue: unknown = "TypeScript";

if (typeof unknownValue === "string") {
    console.log(unknownValue.toUpperCase());
}

// Void

function greet(name: string): void {
    console.log(`Hello ${name}`);
}

// Never

function throwError(): never {
    throw new Error("Something went wrong");
}

// Literal type

let status: "active" | "inactive" = "active";

// Object

let user: object = {
    name: "Riyaz",
    age: 25
};

// Output

console.log(username);
console.log(age);
console.log(isActive);

greet(username);
```

---

# 21. Common Beginner Mistakes

| Mistake | Explanation | Better Approach |
|---|---|---|
| Using `any` everywhere | Removes type safety | Prefer specific types or `unknown` |
| Annotating everything | Creates unnecessary code | Use type inference when appropriate |
| Confusing `void` and `undefined` | They have different meanings | Understand their function and value semantics |
| Confusing `never` and `void` | One represents impossible normal completion; the other represents no useful return value | Learn their different use cases |
| Using `object` for every object | Does not describe properties | Use interfaces or object type aliases |
| Ignoring null | Can cause runtime errors | Enable `strictNullChecks` |
| Mixing number and bigint | JavaScript does not allow direct arithmetic mixing | Convert explicitly when appropriate |
| Assuming TypeScript validates API data | Type annotations disappear at runtime | Use runtime validation libraries |

---

# 22. Interview Questions and Answers

### Q1. What are types in TypeScript?

Types define the kind of values a variable, parameter, or expression can represent. TypeScript uses them to check type compatibility.

### Q2. What is type annotation?

Type annotation is the explicit declaration of a type using a colon.

Example:

```typescript
let age: number = 25;
```

### Q3. What is type inference?

Type inference is the process through which TypeScript automatically determines types from values and context.

### Q4. What are primitive types in TypeScript?

The seven JavaScript primitive types supported by TypeScript are string, number, boolean, undefined, null, bigint, and symbol.

### Q5. What is the difference between any and unknown?

Both accept values of any type, but `unknown` requires type checking before performing operations that need a more specific type.

### Q6. What is the difference between void and never?

Void represents a function that does not return a useful value. Never represents a function that cannot complete normally.

### Q7. What is the difference between null and undefined?

Null represents intentional absence of a value, whereas undefined generally represents an unassigned or missing value.

### Q8. What is a literal type?

A literal type restricts a value to a specific literal, such as `"active"`, `100`, or `true`.

### Q9. What is type widening?

Type widening occurs when TypeScript infers a broader type from a specific literal value.

### Q10. What is the difference between object and Object?

`object` represents non-primitive values. `Object` refers to the global JavaScript Object type and is generally not recommended for describing application data.

### Q11. Can we use number and bigint together?

Not directly in arithmetic operations. Explicit conversion is required.

### Q12. Does TypeScript have a runtime type system?

TypeScript provides a compile-time type system. Its types are generally erased during compilation, so runtime validation must be implemented separately.

---

# 23. Practical Exercises

Complete these exercises yourself.

### Exercise 1: Basic Variables

Create variables for:

- Your name.
- Your age.
- Your city.
- Your salary.
- Whether you are currently working.

Assign appropriate types.

### Exercise 2: Type Inference

Create the following variables without explicit type annotations:

```typescript
let username = "Riyaz";

let age = 25;

let salary = 50000;

let isActive = true;
```

Determine the inferred type of each variable.

### Exercise 3: Any vs Unknown

Create two variables:

```typescript
let first: any = "Hello";

let second: unknown = "Hello";
```

Try calling `toUpperCase()` on both.

Understand why one works without checking and the other requires narrowing.

### Exercise 4: BigInt

Create two BigInt variables and calculate:

- Addition.
- Subtraction.
- Multiplication.
- Division.

### Exercise 5: Symbol

Create two symbols with identical descriptions.

Check whether they are equal.

### Exercise 6: Void vs Never

Create:

1. A function that prints a message and returns nothing.
2. A function that throws an error and never completes normally.

Assign appropriate return types.

### Exercise 7: Literal Types

Create a variable called `paymentStatus`.

It should only accept:

- pending
- successful
- failed
- refunded

Try assigning another value and observe the compiler error.

### Exercise 8: Type Compatibility

Create two type aliases with identical object structures.

Assign a value of one type to a variable of the other type.

Understand why TypeScript allows it.

---

# 24. Phase 3 Completion Checklist

| No. | Topic | Status |
|---|---|---|
| 1 | What are types? | ☐ |
| 2 | Type annotations | ☐ |
| 3 | Type inference | ☐ |
| 4 | Number | ☐ |
| 5 | String | ☐ |
| 6 | Boolean | ☐ |
| 7 | Null | ☐ |
| 8 | Undefined | ☐ |
| 9 | BigInt | ☐ |
| 10 | Symbol | ☐ |
| 11 | Any | ☐ |
| 12 | Unknown | ☐ |
| 13 | Void | ☐ |
| 14 | Never | ☐ |
| 15 | Object | ☐ |
| 16 | Literal types | ☐ |
| 17 | Primitive vs Non-Primitive | ☐ |
| 18 | Type compatibility | ☐ |
| 19 | Type widening | ☐ |

---

## Next Phase: Phase 4 – Variables and Type Annotations

In the next phase, we will study variables and type annotations in much greater depth.

Topics include:

1. Type annotations with `let`.
2. Type annotations with `const`.
3. Type inference with variables.
4. Explicit vs implicit typing.
5. Type annotations with functions.
6. Type annotations with objects.
7. Type annotations with arrays.
8. Type narrowing basics.
9. Reassigning typed variables.
10. Type compatibility.

**Phase 3 complete.**

Take your time with `any`, `unknown`, `void`, and `never`. These four concepts are particularly important for understanding professional TypeScript.

When ready, say **`OK, Phase 4`**.