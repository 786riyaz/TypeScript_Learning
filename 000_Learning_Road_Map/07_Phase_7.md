# Phase 7: Functions in TypeScript

**Level:** Beginner to Intermediate  
**Category:** TypeScript Fundamentals

## Learning Objectives

By the end of this phase, you will understand:

1. How to define function parameter types.
2. How to specify function return types.
3. Optional and default parameters.
4. Rest parameters.
5. Function declarations and function expressions.
6. Arrow functions and anonymous functions.
7. Callback functions.
8. Function type expressions.
9. `void` and `never` return types.
10. Function type inference.
11. Function overloads.
12. How to type real-world functions.

---

# 1. What Are Functions in TypeScript?

A function is a reusable block of code designed to perform a particular task.

JavaScript example:

```javascript
function add(a, b) {
    return a + b;
}

console.log(add(10, 20)); // 30
```

In JavaScript, we do not have to declare parameter types.

However, TypeScript allows us to define the expected types of function parameters and return values.

```typescript
function add(a: number, b: number): number {
    return a + b;
}

console.log(add(10, 20)); // 30
```

Here:

- `a: number` means the first parameter must be a number.
- `b: number` means the second parameter must be a number.
- `: number` after the parameter list specifies the return type.

Now consider:

```typescript
add("10", "20"); // Error
```

TypeScript detects the incorrect argument types before runtime.

### General Syntax

```typescript
function functionName(
    parameter1: type,
    parameter2: type
): returnType {
    // Function body
}
```

---

# 2. Function Parameter Types

Function parameters are the values passed to a function when it is called.

TypeScript allows us to define the expected type of each parameter.

### Example 1: Single Parameter

```typescript
function greet(name: string) {
    console.log(`Hello, ${name}`);
}

greet("Riyaz");
```

Valid:

```typescript
greet("John");
```

Invalid:

```typescript
greet(100); // Error
```

### Example 2: Multiple Parameters

```typescript
function calculateTotal(
    price: number,
    quantity: number
) {
    return price * quantity;
}

console.log(calculateTotal(500, 3));
```

### Example 3: Different Parameter Types

```typescript
function displayUser(
    name: string,
    age: number,
    isActive: boolean
) {
    console.log(name);
    console.log(age);
    console.log(isActive);
}

displayUser("Riyaz", 25, true);
```

### Example 4: Object as a Parameter

You can also pass objects to functions.

```typescript
function displayUser(user: {
    id: number;
    name: string;
    age: number;
}) {
    console.log(user.name);
    console.log(user.age);
}

displayUser({
    id: 1,
    name: "Riyaz",
    age: 25
});
```

### Example 5: Array as a Parameter

```typescript
function calculateSum(numbers: number[]) {
    let sum = 0;

    for (const number of numbers) {
        sum += number;
    }

    return sum;
}

console.log(calculateSum([10, 20, 30]));
```

### Important Points

- Every parameter can have its own type.
- Parameters are required by default.
- Passing an incorrect argument type produces a TypeScript error.
- Passing too few or too many arguments also produces errors for ordinary function calls.

---

# 3. Function Return Types

A function can return a value after executing its logic.

TypeScript allows us to specify the expected return type.

### Syntax

```typescript
function functionName(): returnType {
    return value;
}
```

### Example 1: Number Return Type

```typescript
function add(a: number, b: number): number {
    return a + b;
}

const result = add(10, 20);
```

The function must return a number.

This is invalid:

```typescript
function add(a: number, b: number): number {
    return "Hello"; // Error
}
```

### Example 2: String Return Type

```typescript
function getFullName(
    firstName: string,
    lastName: string
): string {
    return `${firstName} ${lastName}`;
}
```

### Example 3: Boolean Return Type

```typescript
function isAdult(age: number): boolean {
    return age >= 18;
}

console.log(isAdult(25)); // true
```

### Example 4: Array Return Type

```typescript
function getNumbers(): number[] {
    return [10, 20, 30, 40];
}
```

### Example 5: Object Return Type

```typescript
function getUser(): {
    id: number;
    name: string;
    age: number;
} {
    return {
        id: 1,
        name: "Riyaz",
        age: 25
    };
}
```

### Example 6: Union Return Type

Sometimes a function can return more than one type.

```typescript
function getValue(isNumber: boolean): number | string {
    if (isNumber) {
        return 100;
    }

    return "One Hundred";
}
```

The return type is:

```typescript
number | string
```

### Important Rule

The function's returned value must be compatible with its declared return type.

---

# 4. Function Type Inference

TypeScript can automatically infer a function's return type.

You do not always need to explicitly declare it.

### Example

```typescript
function add(a: number, b: number) {
    return a + b;
}
```

TypeScript infers:

```typescript
(a: number, b: number) => number
```

Another example:

```typescript
function greet(name: string) {
    return `Hello, ${name}`;
}
```

Inferred return type:

```typescript
string
```

### Example with Conditional Returns

```typescript
function getValue(condition: boolean) {
    if (condition) {
        return 100;
    }

    return "Hello";
}
```

Inferred return type:

```typescript
number | string
```

### Explicit Return Type vs Inference

| Explicit Return Type | Inferred Return Type |
|---|---|
| Developer declares the return type | TypeScript calculates it |
| Makes the contract visible | Reduces unnecessary annotations |
| Useful for public APIs and important functions | Useful for straightforward functions |

### Best Practice

Use inference when the return type is obvious.

Use explicit return types when they improve readability, document an important function contract, or help maintain a stable API.

For example:

```typescript
function calculateDiscount(
    price: number,
    discount: number
): number {
    return price - (price * discount / 100);
}
```

---

# 5. Optional Parameters

Sometimes a function does not require every parameter.

TypeScript provides `?` to declare optional parameters.

### Syntax

```typescript
function functionName(
    parameter1: type,
    parameter2?: type
) {
    // Logic
}
```

### Example

```typescript
function greet(name: string, age?: number) {
    console.log(`Hello, ${name}`);

    if (age !== undefined) {
        console.log(`Age: ${age}`);
    }
}

greet("Riyaz");
greet("John", 25);
```

Both calls are valid.

### Optional Parameter Type

Consider:

```typescript
function greet(name: string, age?: number) {
    console.log(age);
}
```

Inside the function, `age` has the type:

```typescript
number | undefined
```

Therefore, you should handle the possibility that it is `undefined`.

### Incorrect Example

```typescript
function greet(name: string, age?: number) {
    console.log(age.toFixed(2)); // Error
}
```

Correct:

```typescript
function greet(name: string, age?: number) {
    if (age !== undefined) {
        console.log(age.toFixed(2));
    }
}
```

### Important Rule: Optional Parameters Must Come After Required Parameters

Valid:

```typescript
function createUser(
    name: string,
    age: number,
    email?: string
) {}
```

Invalid:

```typescript
function createUser(
    name?: string,
    age: number
) {} // Error
```

Why?

Because TypeScript requires the mandatory parameter to be provided, but an optional parameter before it would make positional arguments ambiguous.

### Important Difference: Optional Parameter vs Union with Undefined

Consider:

```typescript
function greet(name: string, age?: number) {}
```

The second argument can be omitted.

Now:

```typescript
function greet(name: string, age: number | undefined) {}
```

The second argument is still required, but its value can be `undefined`.

```typescript
greet("Riyaz", undefined); // Valid
greet("Riyaz");           // Error
```

---

# 6. Default Parameters

A default parameter provides a fallback value when an argument is omitted or explicitly passed as `undefined`.

### Syntax

```typescript
function functionName(
    parameter: type = defaultValue
) {
    // Logic
}
```

### Example

```typescript
function greet(name: string = "Guest") {
    console.log(`Hello, ${name}`);
}

greet("Riyaz"); // Hello, Riyaz
greet();        // Hello, Guest
```

### Example with Multiple Parameters

```typescript
function calculatePrice(
    price: number,
    quantity: number = 1
): number {
    return price * quantity;
}

console.log(calculatePrice(500));    // 500
console.log(calculatePrice(500, 3)); // 1500
```

### Default Parameter with Explicit Type

```typescript
function getCountry(
    country: string = "India"
): string {
    return country;
}
```

The parameter type can often be inferred from the default value, but an explicit type can improve clarity.

### Default Parameter vs Optional Parameter

| Optional Parameter | Default Parameter |
|---|---|
| Uses `?` | Uses `=` |
| May be `undefined` | Uses a fallback value when omitted or passed as `undefined` |
| Type includes `undefined` inside the function | Parameter type is generally the declared value type |
| No automatic fallback | Provides a fallback |

Example:

```typescript
function greet1(name?: string) {
    console.log(name);
}
```

```typescript
function greet2(name: string = "Guest") {
    console.log(name);
}
```

### Important: Passing `undefined`

```typescript
function greet(name: string = "Guest") {
    console.log(name);
}

greet(undefined); // Guest
```

The default value is used.

But `null` does not trigger the default:

```typescript
greet(null); // Error under strictNullChecks
```

---

# 7. Rest Parameters

Sometimes we don't know how many arguments a function will receive.

For example, a function may calculate the sum of any number of values.

TypeScript provides rest parameters using `...`.

### Syntax

```typescript
function functionName(...parameters: type[]) {
    // Logic
}
```

### Example 1: Sum of Multiple Numbers

```typescript
function calculateSum(...numbers: number[]): number {
    let sum = 0;

    for (const number of numbers) {
        sum += number;
    }

    return sum;
}

console.log(calculateSum(10, 20));
console.log(calculateSum(10, 20, 30));
console.log(calculateSum(10, 20, 30, 40));
```

All calls are valid.

### Example 2: Rest Parameter with Other Parameters

```typescript
function displayUser(
    name: string,
    ...skills: string[]
) {
    console.log(`Name: ${name}`);
    console.log("Skills:", skills);
}

displayUser(
    "Riyaz",
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js"
);
```

### Important Rules

1. A function can have only one rest parameter.
2. A rest parameter must be the last parameter.
3. Its type must be an array or tuple type.
4. It collects remaining arguments into an array.

### Incorrect Example

```typescript
function test(
    ...numbers: number[],
    name: string
) {} // Error
```

The rest parameter must come last.

---

# 8. Function Declarations

A function declaration defines a named function using the `function` keyword.

### Syntax

```typescript
function functionName(parameters): returnType {
    // Function body
}
```

### Example

```typescript
function multiply(a: number, b: number): number {
    return a * b;
}

console.log(multiply(10, 20));
```

### Function Declaration Hoisting

JavaScript function declarations are hoisted.

This means you can call a function before its declaration.

```typescript
console.log(add(10, 20));

function add(a: number, b: number): number {
    return a + b;
}
```

This works because function declarations are available throughout their scope.

### Important

Function declarations are different from function expressions in how they are initialized and hoisted.

---

# 9. Function Expressions

A function expression is a function assigned to a variable.

### Example

```typescript
const add = function(a: number, b: number): number {
    return a + b;
};

console.log(add(10, 20));
```

Here:

- `add` is a variable.
- The assigned value is a function.
- The function has two number parameters.
- The function returns a number.

### Explicit Function Type

```typescript
const add: (a: number, b: number) => number = function(a, b) {
    return a + b;
};
```

The variable `add` has a function type.

The parameter types and return type are inferred from the annotation.

### Function Declaration vs Function Expression

| Function Declaration | Function Expression |
|---|---|
| Declared using `function` | Assigned to a variable |
| Usually has a function name | Can be anonymous or named |
| Can be called before declaration in the same scope | Cannot be called before the variable is initialized |
| Function declaration hoisting applies | Variable initialization rules apply |

---

# 10. Arrow Functions

Arrow functions provide a shorter syntax for writing functions.

They were introduced in ECMAScript 2015 (ES6).

### Syntax

```typescript
const functionName = (parameters): returnType => {
    // Function body
};
```

### Example 1: Basic Arrow Function

```typescript
const add = (a: number, b: number): number => {
    return a + b;
};

console.log(add(10, 20));
```

### Example 2: Arrow Function with One Parameter

```typescript
const square = (number: number): number => {
    return number * number;
};
```

Parentheses around a single parameter can be omitted in some cases:

```typescript
const square = (number: number) => number * number;
```

### Example 3: Implicit Return

When the function body contains only one expression, you can omit the curly braces and `return`.

```typescript
const multiply = (a: number, b: number): number => a * b;
```

### Example 4: Arrow Function Returning an Object

When returning an object directly, wrap the object literal in parentheses.

```typescript
const getUser = () => ({
    id: 1,
    name: "Riyaz"
});
```

Without parentheses, JavaScript interprets the curly braces as a function body.

### Example 5: Array Methods

Arrow functions are frequently used with array methods.

```typescript
const numbers: number[] = [1, 2, 3, 4, 5];

const doubled = numbers.map((number) => number * 2);

console.log(doubled);
```

### Arrow Functions vs Regular Functions

| Regular Function | Arrow Function |
|---|---|
| Uses `function` keyword | Uses `=>` |
| Has its own `this` depending on how it is called | Inherits `this` from surrounding scope |
| Can be used as a constructor with `new` | Cannot be used as a constructor |
| Supports `arguments` object | Does not have its own `arguments` |
| Can be a function declaration or expression | Always an expression |

**Important:** Arrow functions are especially useful for callbacks, but regular methods are often preferable when an object method needs its own `this`.

---

# 11. Anonymous Functions

An anonymous function is a function without an explicit function name.

### Example

```typescript
const greet = function(name: string) {
    console.log(`Hello, ${name}`);
};
```

The function itself has no name.

The variable `greet` holds a reference to that function.

### Anonymous Function as a Callback

```typescript
const numbers = [10, 20, 30];

numbers.forEach(function(number) {
    console.log(number);
});
```

Here, the anonymous function is passed directly to `forEach`.

### Anonymous Arrow Function

```typescript
numbers.forEach((number) => {
    console.log(number);
});
```

### Named vs Anonymous Functions

| Named Function | Anonymous Function |
|---|---|
| Has an explicit function name | Has no explicit function name |
| Useful for reusable functions | Commonly used for callbacks |
| Easier to identify by function name in some debugging contexts | Often used inline |

**Note:** A function expression can be named or anonymous.

---

# 12. Callback Functions

A callback is a function passed as an argument to another function.

The receiving function can execute the callback when needed.

Callbacks are commonly used in:

- Array methods
- Event handling
- Timers
- Asynchronous programming
- Node.js APIs

### Example 1: Basic Callback

```typescript
function greet(
    name: string,
    callback: () => void
): void {
    console.log(`Hello, ${name}`);

    callback();
}

function sayGoodbye() {
    console.log("Goodbye!");
}

greet("Riyaz", sayGoodbye);
```

Here:

- `greet` is the main function.
- `sayGoodbye` is passed as a callback.
- `callback: () => void` describes the callback's function type.

### Example 2: Callback with Parameters

```typescript
function processUser(
    name: string,
    callback: (name: string) => void
): void {
    callback(name);
}

processUser("Riyaz", (name) => {
    console.log(`Processing ${name}`);
});
```

### Example 3: Callback Returning a Value

```typescript
function calculate(
    a: number,
    b: number,
    callback: (x: number, y: number) => number
): number {
    return callback(a, b);
}

const result = calculate(10, 20, (x, y) => x + y);

console.log(result);
```

### Example 4: Array Callback

```typescript
const numbers: number[] = [1, 2, 3, 4, 5];

const result = numbers.filter((number) => number > 2);

console.log(result);
```

TypeScript understands that `number` is a number because the `filter` method expects a callback receiving an array element.

This is called **contextual typing**.

### Example 5: setTimeout Callback

```typescript
setTimeout(() => {
    console.log("Hello after 2 seconds");
}, 2000);
```

The callback is executed after the specified delay.

### Important: Callback Type and Function Type

A callback is not a separate TypeScript type category. It is a function used in the role of an argument.

The type of the callback is still a function type.

---

# 13. Function Type Expressions

Sometimes we want to define a function type separately and reuse it in multiple places.

TypeScript supports function type expressions.

### Syntax

```typescript
type FunctionType = (parameter: type) => returnType;
```

### Example 1: Basic Function Type

```typescript
type AddFunction = (a: number, b: number) => number;

const add: AddFunction = (a, b) => {
    return a + b;
};
```

Now the `AddFunction` type can be reused.

```typescript
const subtract: AddFunction = (a, b) => {
    return a - b;
};

const multiply: AddFunction = (a, b) => {
    return a * b;
};
```

### Example 2: Function Type with String

```typescript
type GreetFunction = (name: string) => string;

const greet: GreetFunction = (name) => {
    return `Hello, ${name}`;
};
```

### Example 3: Function Type with No Return Value

```typescript
type Logger = (message: string) => void;

const logMessage: Logger = (message) => {
    console.log(message);
};
```

### Example 4: Function Type with Optional Parameter

```typescript
type GreetFunction = (name: string, age?: number) => void;

const greet: GreetFunction = (name, age) => {
    console.log(name);

    if (age !== undefined) {
        console.log(age);
    }
};
```

### Example 5: Function Type as an Object Property

```typescript
type User = {
    name: string;
    greet: (message: string) => void;
};

const user: User = {
    name: "Riyaz",

    greet(message) {
        console.log(message);
    }
};
```

### Function Type vs Function Implementation

Consider:

```typescript
type AddFunction = (a: number, b: number) => number;
```

This only describes the expected function structure.

It does not implement the function.

The implementation is:

```typescript
const add: AddFunction = (a, b) => {
    return a + b;
};
```

---

# 14. The `void` Return Type

`void` is used when a function does not return a meaningful value.

### Example

```typescript
function greet(): void {
    console.log("Hello!");
}
```

The function performs an action but does not return a value.

### Another Example

```typescript
function logMessage(message: string): void {
    console.log(message);
}
```

### `void` vs `undefined`

These are related but not identical.

| `void` | `undefined` |
|---|---|
| Commonly describes a function whose return value should not be used | A specific JavaScript value and TypeScript type |
| Used as a return type for functions that do not return meaningful values | Can be explicitly returned |
| Has special function compatibility behavior | Represents an actual value |

Example:

```typescript
function test(): void {
    return;
}
```

This is valid.

But:

```typescript
function test(): void {
    return 100; // Error
}
```

### Important Exception: Contextual `void`

Consider:

```typescript
type Logger = () => void;

const logger: Logger = () => {
    return 100;
};
```

This is allowed.

Why?

When a function is assigned to a function type returning `void`, TypeScript allows the implementation to return a value, but callers are expected to ignore it.

```typescript
const result = logger(); // result is void
```

This behavior is useful for callback functions.

---

# 15. The `never` Return Type

`never` represents values that never occur.

For functions, it is used when the function cannot complete normally by returning a value.

Common situations include:

1. Functions that always throw an error.
2. Functions that never terminate.
3. Exhaustiveness checking.

### Example 1: Function That Always Throws

```typescript
function throwError(message: string): never {
    throw new Error(message);
}
```

The function throws an exception and does not return normally.

### Example 2: Infinite Loop

```typescript
function infiniteLoop(): never {
    while (true) {
        console.log("Running...");
    }
}
```

The function never reaches a normal return.

### Example 3: Exhaustiveness Checking

Consider:

```typescript
type Status = "success" | "error" | "loading";

function handleStatus(status: Status): string {
    switch (status) {
        case "success":
            return "Operation successful";

        case "error":
            return "Something went wrong";

        case "loading":
            return "Please wait";

        default:
            const exhaustiveCheck: never = status;
            return exhaustiveCheck;
    }
}
```

Why is `never` useful here?

Because TypeScript knows that all possible values of `Status` have already been handled.

If you add another status:

```typescript
type Status = "success" | "error" | "loading" | "pending";
```

The `default` case will produce an error until you handle `"pending"`.

This helps prevent missing cases when working with unions.

### `void` vs `never`

| `void` | `never` |
|---|---|
| Function completes normally without returning a meaningful value | Function does not complete normally |
| Can reach the end of the function | Cannot reach a normal completion |
| Common for logging functions | Common for throwing functions |
| Example: `console.log()` wrapper | Example: function that always throws |

**Remember:**

- `void` means no meaningful return value.
- `never` means no normal return is possible.

---

# 16. Function Overloads

Sometimes a function needs to accept different parameter combinations and return different types depending on the arguments.

TypeScript supports function overloads.

### Example: Different Input Types

Suppose we want a function that:

- Adds two numbers when both inputs are numbers.
- Joins two strings when both inputs are strings.

We can define overload signatures.

```typescript
function combine(a: number, b: number): number;
function combine(a: string, b: string): string;

function combine(
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
```

Usage:

```typescript
const result1 = combine(10, 20);
const result2 = combine("Hello ", "World");
```

TypeScript infers:

```typescript
result1; // number
result2; // string
```

Invalid:

```typescript
combine(10, "20"); // Error
```

### Understanding Overload Structure

A function overload has two main parts.

**1. Overload signatures**

```typescript
function combine(a: number, b: number): number;

function combine(a: string, b: string): string;
```

These describe the supported ways to call the function.

**2. Implementation signature**

```typescript
function combine(
    a: number | string,
    b: number | string
): number | string {
    // Implementation
}
```

This contains the actual function body.

### Important Rules

- Overload signatures are written before the implementation.
- The implementation signature is not directly exposed as an overload.
- The implementation must be compatible with all overload signatures.
- You need runtime checks to distinguish input cases.

### Example: Different Number of Parameters

```typescript
function createUser(name: string): string;

function createUser(name: string, age: number): string;

function createUser(name: string, age?: number): string {
    if (age !== undefined) {
        return `${name} is ${age} years old`;
    }

    return name;
}
```

Usage:

```typescript
createUser("Riyaz");

createUser("Riyaz", 25);
```

Both calls are valid.

### Overloads vs Union Types

Sometimes a union type is simpler.

```typescript
function printValue(value: string | number): void {
    console.log(value);
}
```

Use overloads when different call signatures need different return types or parameter relationships.

Use union types when the same implementation and return contract work for multiple input types.

---

# 17. Contextual Typing in Functions

Contextual typing occurs when TypeScript determines a function's parameter types from the context in which the function is used.

### Example: Array Method

```typescript
const numbers = [10, 20, 30];

numbers.forEach((number) => {
    console.log(number);
});
```

TypeScript automatically knows that `number` is a number.

Why?

Because the `forEach` method expects a callback that receives an element from the array.

### Example: Explicit Function Type

```typescript
type Calculator = (a: number, b: number) => number;

const add: Calculator = (a, b) => {
    return a + b;
};
```

TypeScript infers:

- `a` is a number.
- `b` is a number.
- The return value must be a number.

### Example: Event Callback

```typescript
const button = document.querySelector("button");

button?.addEventListener("click", (event) => {
    console.log(event);
});
```

The browser DOM type definitions provide the contextual type for the event callback parameter.

### Important Difference

**Type inference:** TypeScript determines a type from an expression.

**Contextual typing:** TypeScript determines a type from the surrounding context.

Both help reduce unnecessary annotations.

---

# 18. Typing Real-World Functions

Let's apply these concepts to common full-stack application scenarios.

### Example 1: User Registration

```typescript
type User = {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
};

function registerUser(
    name: string,
    email: string
): User {

    return {
        id: Date.now(),
        name,
        email,
        isActive: true
    };
}

const user = registerUser(
    "Riyaz",
    "riyaz@example.com"
);

console.log(user);
```

### Example 2: Product Discount

```typescript
type Product = {
    id: number;
    name: string;
    price: number;
    discount?: number;
};

function calculateFinalPrice(product: Product): number {
    const discount = product.discount ?? 0;

    return product.price - (product.price * discount / 100);
}

const product: Product = {
    id: 1,
    name: "Laptop",
    price: 75000,
    discount: 10
};

console.log(calculateFinalPrice(product));
```

### Example 3: Filter Active Users

```typescript
type User = {
    id: number;
    name: string;
    isActive: boolean;
};

function getActiveUsers(users: User[]): User[] {
    return users.filter((user) => user.isActive);
}

const users: User[] = [
    { id: 1, name: "John", isActive: true },
    { id: 2, name: "David", isActive: false },
    { id: 3, name: "Riyaz", isActive: true }
];

console.log(getActiveUsers(users));
```

### Example 4: Generic-Looking Callback

```typescript
type Operation = (a: number, b: number) => number;

function performOperation(
    a: number,
    b: number,
    operation: Operation
): number {
    return operation(a, b);
}

const result = performOperation(
    10,
    20,
    (a, b) => a * b
);

console.log(result);
```

We will study generics in a later phase. For now, focus on how function types make callback contracts reusable.

---

# 19. Common Mistakes

### Mistake 1: Missing Parameter Types

```typescript
function add(a, b) {
    return a + b;
}
```

With `noImplicitAny: true`, TypeScript reports errors because the parameters have implicit `any` types.

Correct:

```typescript
function add(a: number, b: number): number {
    return a + b;
}
```

### Mistake 2: Incorrect Return Type

```typescript
function getAge(): number {
    return "25";
}
```

Correct:

```typescript
function getAge(): number {
    return 25;
}
```

### Mistake 3: Accessing Optional Parameters Without Checking

```typescript
function greet(name: string, age?: number) {
    console.log(age.toFixed(2));
}
```

Correct:

```typescript
function greet(name: string, age?: number) {
    if (age !== undefined) {
        console.log(age.toFixed(2));
    }
}
```

### Mistake 4: Putting Required Parameters After Optional Parameters

```typescript
function createUser(name?: string, age: number) {}
```

Correct:

```typescript
function createUser(name: string, age?: number) {}
```

### Mistake 5: Incorrect Rest Parameter Position

```typescript
function calculate(...numbers: number[], name: string) {}
```

Correct:

```typescript
function calculate(name: string, ...numbers: number[]) {}
```

### Mistake 6: Confusing `void` and `never`

```typescript
function greet(): never {
    console.log("Hello");
}
```

This is incorrect because the function completes normally.

Correct:

```typescript
function greet(): void {
    console.log("Hello");
}
```

### Mistake 7: Assuming Arrow Functions Have Their Own `this`

Arrow functions inherit `this` from their surrounding scope. They do not create their own `this`.

### Mistake 8: Confusing Function Types with Function Implementations

```typescript
type Add = (a: number, b: number) => number;
```

This only describes a function's type. It does not implement the function.

---

# 20. Interview Questions and Answers

### Q1. What is a function in TypeScript?

A function is a reusable block of code that performs a particular task. TypeScript allows us to define parameter and return types.

### Q2. What are function parameter types?

They specify the expected data types of values passed to a function.

### Q3. What is a function return type?

It defines the type of value that a function is expected to return.

### Q4. What is the difference between optional and default parameters?

An optional parameter may be omitted and can be `undefined`. A default parameter provides a fallback value when the argument is omitted or explicitly passed as `undefined`.

### Q5. What are rest parameters?

Rest parameters collect multiple remaining arguments into an array.

### Q6. What is a function expression?

A function expression is a function assigned to a variable or used as part of an expression.

### Q7. What is an arrow function?

An arrow function is a shorter function syntax introduced in ES6. It inherits `this` from its surrounding lexical scope.

### Q8. What is an anonymous function?

An anonymous function is a function without an explicit function name.

### Q9. What is a callback function?

A callback is a function passed as an argument to another function so that the receiving function can execute it.

### Q10. What is a function type expression?

It is a TypeScript syntax for describing the parameter and return types of a function.

```typescript
type Add = (a: number, b: number) => number;
```

### Q11. What is the difference between `void` and `never`?

`void` describes a function that completes without returning a meaningful value. `never` describes a function that cannot complete normally.

### Q12. What is function overloading?

Function overloading allows us to define multiple supported call signatures for a function with one implementation.

### Q13. What is contextual typing?

Contextual typing is when TypeScript infers types from the surrounding context.

### Q14. Can a function return multiple types?

Yes. You can use a union return type.

```typescript
function getValue(): string | number {
    return Math.random() > 0.5 ? "Hello" : 100;
}
```

### Q15. Can arrow functions be used as constructors?

No. Arrow functions do not have the internal constructor behavior required by `new`.

---

# 21. Practical Exercises

Complete these exercises before moving to the next phase.

## Exercise 1: Basic Calculator

Create these functions:

- `add(a, b)`
- `subtract(a, b)`
- `multiply(a, b)`
- `divide(a, b)`

Requirements:

- Both parameters must be numbers.
- Every function must return a number.
- Handle division by zero.

## Exercise 2: User Greeting

Create a function `greetUser`.

Parameters:

- `name`: required string
- `age`: optional number
- `country`: optional string

Display a suitable greeting based on the supplied values.

## Exercise 3: Default Parameters

Create a function `createProfile`.

Parameters:

- `name`: required string
- `role`: default value `"User"`
- `isActive`: default value `true`

Return an object containing all three properties.

## Exercise 4: Rest Parameters

Create a function called `calculateAverage`.

Requirements:

- Accept any number of numeric arguments.
- Calculate their average.
- Return a number.
- Handle the case where no numbers are provided.

## Exercise 5: Function Expressions

Create a function expression called `findMaximum`.

Requirements:

- Accept two numbers.
- Return the greater number.
- Explicitly define its parameter and return types.

## Exercise 6: Arrow Functions

Create arrow functions for:

- Checking whether a number is even.
- Calculating the square of a number.
- Converting a string to uppercase.
- Finding the length of a string.

## Exercise 7: Callback Functions

Create a function called `processNumber`.

Parameters:

- A number.
- A callback function that accepts a number and returns a number.

Use the callback to perform a calculation.

## Exercise 8: Function Type

Create a reusable function type called `StringOperation`.

It should:

- Accept two strings.
- Return a string.

Use it to implement:

- String concatenation.
- String comparison.
- String formatting.

## Exercise 9: `void` and `never`

Create:

1. A logging function returning `void`.
2. An error function returning `never`.
3. A status-handling function using exhaustive checking.

## Exercise 10: Function Overloading

Create a function called `formatValue`.

It should support:

- A number input that returns a formatted number string.
- A string input that returns an uppercase string.

Define proper overload signatures and one implementation.

## Exercise 11: Real-World Project

Build a small user management module with these functions:

```typescript
createUser()
getUserById()
updateUser()
deleteUser()
getActiveUsers()
```

Requirements:

- Define a `User` type.
- Use appropriate parameter types.
- Define return types.
- Use optional parameters where appropriate.
- Use callbacks for at least one operation.
- Handle missing users appropriately.

---

# 22. Phase 7 Completion Checklist

Before proceeding, make sure you understand:

- [ ] Function parameter types
- [ ] Function return types
- [ ] Function type inference
- [ ] Optional parameters
- [ ] Default parameters
- [ ] Rest parameters
- [ ] Function declarations
- [ ] Function expressions
- [ ] Arrow functions
- [ ] Anonymous functions
- [ ] Callback functions
- [ ] Function type expressions
- [ ] `void` return type
- [ ] `never` return type
- [ ] Function overloads
- [ ] Contextual typing
- [ ] Real-world function typing

---

## Next Phase: Phase 8 — Type Aliases in TypeScript

In the next phase, we will cover:

1. What are type aliases?
2. Creating custom types using `type`.
3. Primitive type aliases.
4. Object type aliases.
5. Union type aliases.
6. Intersection type aliases.
7. Function type aliases.
8. Array type aliases.
9. Tuple type aliases.
10. Nested type aliases.
11. Reusing type aliases.
12. Type aliases vs interfaces.
13. Naming conventions and best practices.

**When you're ready, say: `OK, Phase 8`.**