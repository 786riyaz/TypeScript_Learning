# Phase 20: Advanced TypeScript – Function Overloads, Advanced Function Types, and Variadic Tuples

**Level:** Advanced  
**Prerequisites:**
- Phase 7: Functions in TypeScript
- Phase 14: Generics Fundamentals
- Phase 15: Generic Constraints
- Phase 16: Conditional Types and `infer`
- Phase 19: Recursive Types and Type-Level Programming

## Learning Objectives

By the end of this phase, you will understand:

1. Function overloads in depth.
2. Overload signatures and implementation signatures.
3. Function compatibility.
4. Function parameter variance.
5. Return type compatibility.
6. Generic function overloads.
7. Arrow functions and overload limitations.
8. Variadic tuple types.
9. Rest parameters with tuples.
10. Higher-order functions.
11. Typed function composition.
12. Advanced callback typing.
13. Function parameter extraction.
14. Practical function utility types.
15. Real-world function API design.

---

# 1. Understanding Function Types in TypeScript

Before learning advanced function typing, let's revise the basic function type.

In TypeScript, we can describe a function's:

- Parameters.
- Parameter types.
- Return type.

### Example

```typescript
function add(a: number, b: number): number {
    return a + b;
}
```

The function type can also be represented separately.

```typescript
type AddFunction = (a: number, b: number) => number;
```

Now we can create a function using this type:

```typescript
const add: AddFunction = (a, b) => {
    return a + b;
};
```

TypeScript infers the parameter types from the function type.

### Function type syntax

```typescript
type FunctionName = (
    parameter1: Type1,
    parameter2: Type2
) => ReturnType;
```

Example:

```typescript
type LoginFunction = (
    email: string,
    password: string
) => boolean;
```

This means any function assigned to `LoginFunction` must accept the specified parameters and return a boolean-compatible result.

---

# 2. What Are Function Overloads?

Function overloading allows us to define multiple function signatures for the same function name.

In simple terms:

**One function can support multiple ways of being called, with different parameter types or parameter counts.**

### Example without overloading

Suppose you want a function that accepts either a string or a number.

```typescript
function display(value: string | number): string | number {
    return value;
}
```

Usage:

```typescript
const result1 = display("Hello");

const result2 = display(100);
```

The problem is that TypeScript sees the return type as:

```typescript
string | number
```

Even when you pass a string, the inferred return type remains `string | number`.

Sometimes you want more precise return types based on the input.

Function overloads solve this problem.

### Example with function overloads

```typescript
function display(value: string): string;

function display(value: number): number;

function display(value: string | number): string | number {
    return value;
}
```

Usage:

```typescript
const result1 = display("Hello");

const result2 = display(100);
```

Inferred types:

```typescript
const result1: string;

const result2: number;
```

Now TypeScript knows the relationship between the input and output types.

---

# 3. Understanding Overload Signatures and Implementation Signatures

This is one of the most important concepts in function overloading.

A function overload generally contains two parts:

1. Overload signatures.
2. Implementation signature.

### Example

```typescript
function getValue(value: string): string;

function getValue(value: number): number;

function getValue(value: string | number): string | number {
    return value;
}
```

Let's understand each part.

### A. Overload signatures

```typescript
function getValue(value: string): string;

function getValue(value: number): number;
```

These signatures describe how callers are allowed to use the function.

They define:

- Accepted parameter types.
- Number of parameters.
- Return types.

### B. Implementation signature

```typescript
function getValue(
    value: string | number
): string | number {
    return value;
}
```

This contains the actual implementation.

It must be compatible with the overload signatures.

### Important rule

The implementation signature is not directly visible to callers.

For example:

```typescript
getValue("Hello"); // Allowed

getValue(100); // Allowed

getValue(true); // Error
```

Even though the implementation parameter type is `string | number`, the function can only be called using the declared overload signatures.

### Comparison

| Overload signature | Implementation signature |
|---|---|
| Defines allowed calls | Contains actual implementation |
| Visible to callers | Not directly visible to callers |
| Can have multiple signatures | Usually one implementation |
| Does not contain a function body | Contains a function body |

---

# 4. Function Overloading with Different Parameter Counts

Overloads can also support different numbers of parameters.

### Example

Suppose a logging function supports:

- A message only.
- A message and a log level.

```typescript
function log(message: string): void;

function log(message: string, level: string): void;

function log(message: string, level?: string): void {
    if (level) {
        console.log(`[${level}] ${message}`);
    } else {
        console.log(message);
    }
}
```

Usage:

```typescript
log("Application started");

log("Database connection failed", "ERROR");
```

Both calls are valid.

But:

```typescript
log("Hello", "INFO", true); // Error
```

Because no overload allows three arguments.

### Real-world use cases

Function overloads are useful when:

- A function accepts multiple input formats.
- Different arguments produce different return types.
- An API supports different calling patterns.
- You want more precise type inference.

---

# 5. Function Overloading with Different Return Types

This is one of the most useful applications of overloads.

Suppose a function retrieves users.

It can return:

- One user when an ID is provided.
- An array of users when no ID is provided.

### Implementation

```typescript
type User = {
    id: number;
    name: string;
};

function getUser(id: number): User;

function getUser(): User[];

function getUser(id?: number): User | User[] {
    if (id !== undefined) {
        return {
            id,
            name: "Riyaz"
        };
    }

    return [
        {
            id: 1,
            name: "Riyaz"
        },
        {
            id: 2,
            name: "Ahmed"
        }
    ];
}
```

Usage:

```typescript
const user = getUser(1);

const users = getUser();
```

Inferred types:

```typescript
const user: User;

const users: User[];
```

Without overloads, TypeScript would generally infer:

```typescript
User | User[]
```

for both calls.

Overloads provide more precise return types.

---

# 6. Function Overloading with Generic Types

You can combine function overloads with generics.

### Example

Suppose you want a function that:

- Returns the first element when given a non-empty tuple.
- Returns `undefined` when given an empty array.

You can define overloads.

```typescript
function getFirst<T>(
    values: readonly [T, ...T[]]
): T;

function getFirst(
    values: readonly []
): undefined;

function getFirst<T>(
    values: readonly T[]
): T | undefined {
    return values[0];
}
```

Usage:

```typescript
const first = getFirst([10, 20, 30]);

const empty = getFirst([]);
```

Inferred types:

```typescript
const first: number;

const empty: undefined;
```

### Another example: Generic API function

```typescript
type ApiResponse<T> = {
    success: boolean;
    data: T;
};

function fetchData<T>(url: string): Promise<ApiResponse<T>> {
    throw new Error("Implementation not provided");
}
```

Usage:

```typescript
type User = {
    id: number;
    name: string;
};

const response = fetchData<User>("/api/users/1");
```

Inferred result:

```typescript
Promise<ApiResponse<User>>
```

This example uses generics rather than overloads, but generic functions can also be combined with overload signatures when different call patterns require different return types.

---

# 7. Function Overloads vs Union Types

You might wonder:

Why use function overloads when union types already allow multiple input types?

Let's compare.

### Using union types

```typescript
function process(value: string | number): string | number {
    return value;
}
```

Usage:

```typescript
const result = process("Hello");
```

Result:

```typescript
string | number
```

### Using overloads

```typescript
function process(value: string): string;

function process(value: number): number;

function process(value: string | number): string | number {
    return value;
}
```

Usage:

```typescript
const result1 = process("Hello");

const result2 = process(100);
```

Results:

```typescript
const result1: string;

const result2: number;
```

### Comparison

| Union types | Function overloads |
|---|---|
| Usually simpler | More explicit signatures |
| Can produce broader return types | Can produce input-dependent return types |
| Suitable for simple alternatives | Suitable for different calling patterns |
| One function signature | Multiple call signatures |

**Important:** Overloads are not always necessary. If a generic function or discriminated union can express the relationship more simply, prefer that approach.

---

# 8. Overload Signatures and Union Arguments

An important behavior of overloads is that a union argument does not automatically match multiple separate overloads.

Consider:

```typescript
function getValue(value: string): string;

function getValue(value: number): number;

function getValue(value: string | number): string | number {
    return value;
}
```

Now:

```typescript
declare const input: string | number;

const result = getValue(input);
```

This produces an error.

Why?

Because TypeScript sees the argument as:

```typescript
string | number
```

But neither overload accepts that complete union type.

### Solution: Add a union overload

```typescript
function getValue(value: string): string;

function getValue(value: number): number;

function getValue(value: string | number): string | number;

function getValue(value: string | number): string | number {
    return value;
}
```

Now:

```typescript
declare const input: string | number;

const result = getValue(input);
```

Result:

```typescript
string | number
```

**Key takeaway:** If callers may pass a union-typed argument, provide an overload that accepts that union when appropriate.

---

# 9. Arrow Functions and Function Overloads

JavaScript arrow functions do not support the same declaration syntax as ordinary function declarations.

For example, this is invalid:

```typescript
const getValue = (value: string): string;

const getValue = (value: number): number;
```

However, you can describe an overloaded function using a type with multiple call signatures.

### Example

```typescript
type GetValue = {
    (value: string): string;
    (value: number): number;
};
```

Now assign an arrow function:

```typescript
const getValue: GetValue = (value: string | number) => {
    return value;
};
```

Usage:

```typescript
const a = getValue("Hello");

const b = getValue(100);
```

Inferred types:

```typescript
const a: string;

const b: number;
```

### Understanding the syntax

```typescript
type GetValue = {
    (value: string): string;
    (value: number): number;
};
```

This is an object type containing multiple call signatures.

It describes one callable value with multiple supported calling patterns.

### Important distinction

An arrow function can implement an overloaded callable type, but you cannot declare multiple arrow-function implementations with the same variable name.

---

# 10. Function Compatibility

Function compatibility determines whether one function type can be assigned to another.

Consider:

```typescript
type Add = (a: number, b: number) => number;

const add: Add = (a, b) => {
    return a + b;
};
```

This is valid.

But:

```typescript
const add: Add = (a: string, b: string) => {
    return a + b;
};
```

This produces an error because the parameter types are incompatible.

### Example: Return type compatibility

```typescript
type GetNumber = () => number;

const getNumber: GetNumber = () => {
    return 100;
};
```

Valid.

But:

```typescript
const getNumber: GetNumber = () => {
    return "Hello";
};
```

Invalid because the function returns a string instead of a number.

### General rule

A function assigned to another function type must be compatible with the expected parameter and return types.

Function compatibility becomes more interesting when parameters and return types have inheritance relationships.

---

# 11. Function Parameter Variance

This is an important advanced TypeScript concept.

Variance describes how assignability behaves when types have subtype relationships.

Let's understand it step by step.

Suppose:

```typescript
type Animal = {
    name: string;
};

type Dog = Animal & {
    breed: string;
};
```

A `Dog` is also an `Animal`, because it contains all required Animal properties.

```typescript
const dog: Dog = {
    name: "Tommy",
    breed: "Labrador"
};

const animal: Animal = dog;
```

This is valid.

Now consider function types.

```typescript
type AnimalHandler = (animal: Animal) => void;

type DogHandler = (dog: Dog) => void;
```

The important question:

Can a `DogHandler` be used where an `AnimalHandler` is expected?

### Example

```typescript
const handleDog: DogHandler = (dog) => {
    console.log(dog.breed);
};

const handleAnimal: AnimalHandler = handleDog;
```

Under `strictFunctionTypes: true`, this assignment is rejected.

Why?

Because `AnimalHandler` promises to accept any `Animal`.

But `handleDog` requires a `Dog`.

An ordinary animal may not have a `breed` property.

### Safe assignment in the opposite direction

```typescript
const handleAnimal: AnimalHandler = (animal) => {
    console.log(animal.name);
};

const handleDog: DogHandler = handleAnimal;
```

This is safe.

Why?

A function that can handle any animal can also handle a dog.

### Understanding contravariance

For function parameters, TypeScript generally applies contravariant checking under `strictFunctionTypes` for ordinary function types.

In simple terms:

A function that accepts a broader parameter type can safely be used where a narrower parameter type is expected.

### Important exception: Method parameters

TypeScript treats method parameter types more permissively in certain compatibility checks.

For example:

```typescript
type AnimalMethod = {
    handle(animal: Animal): void;
};

type DogMethod = {
    handle(dog: Dog): void;
};
```

Method parameter checking has a bivariance exception.

This is one reason function properties are often preferred over method syntax when strict parameter variance matters.

### Function property example

```typescript
type AnimalHandlerObject = {
    handle: (animal: Animal) => void;
};
```

This uses a function-valued property and follows strict function parameter checking.

### Summary

| Concept | Meaning |
|---|---|
| Covariance | Accepts a more specific result type |
| Contravariance | Allows a function to accept a broader parameter type |
| Bivariance | Allows compatibility in both directions |
| Invariance | Requires types to match without widening or narrowing |

---

# 12. Return Type Covariance

Function return types generally follow covariance.

Consider:

```typescript
type Animal = {
    name: string;
};

type Dog = Animal & {
    breed: string;
};
```

Now:

```typescript
type GetAnimal = () => Animal;

type GetDog = () => Dog;
```

A function returning `Dog` can be assigned to a function expected to return `Animal`.

```typescript
const getDog: GetDog = () => ({
    name: "Tommy",
    breed: "Labrador"
});

const getAnimal: GetAnimal = getDog;
```

This is valid.

Why?

Because every `Dog` is also an `Animal`.

The function promises to return an `Animal`, and returning a more specific `Dog` satisfies that requirement.

### Reverse assignment

```typescript
const getAnimal: GetAnimal = () => ({
    name: "Tommy"
});

const getDog: GetDog = getAnimal;
```

This is rejected.

Why?

Because the returned `Animal` may not have a `breed` property.

### Key takeaway

For ordinary function types:

- Parameters are generally contravariant under strict checking.
- Return types are generally covariant.

---

# 13. Understanding `this` in Function Types

JavaScript functions can have a `this` value.

TypeScript allows you to explicitly define the expected `this` type of a function.

### Example

```typescript
type User = {
    name: string;
    greet(this: User): void;
};
```

Implementation:

```typescript
const user: User = {
    name: "Riyaz",

    greet() {
        console.log(`Hello ${this.name}`);
    }
};
```

Usage:

```typescript
user.greet();
```

Output:

```text
Hello Riyaz
```

### What does `this: User` mean?

```typescript
greet(this: User): void;
```

It tells TypeScript that the function expects to be called with a `this` value compatible with `User`.

It is a TypeScript-only parameter declaration.

It does not become a normal JavaScript function argument.

### Another example

```typescript
function introduce(this: User) {
    console.log(this.name);
}
```

You can call it with an appropriate `this` context:

```typescript
introduce.call(user);
```

TypeScript checks that the supplied context is compatible with `User`.

---

# 14. Variadic Tuple Types

Now let's learn one of the most important features in advanced function typing.

A **variadic tuple type** allows us to use tuple types with spread syntax.

It is particularly useful when the number and types of function parameters need to be preserved.

### Basic example

```typescript
type Names = [string, string];

type ExtendedNames = [...Names, number];
```

Result:

```typescript
type ExtendedNames = [string, string, number];
```

We can also use generic tuples.

```typescript
type Append<T extends unknown[], U> = [...T, U];
```

Usage:

```typescript
type Result = Append<[string, number], boolean>;
```

Result:

```typescript
type Result = [string, number, boolean];
```

### Understanding the syntax

```typescript
[...T, U]
```

This means:

1. Include every element from tuple `T`.
2. Append another element of type `U`.

Variadic tuples are especially useful for function parameter manipulation.

---

# 15. Variadic Tuples with Function Parameters

Suppose you have a function:

```typescript
function createUser(
    name: string,
    age: number
): void {
    console.log(name, age);
}
```

Its parameters can be represented as a tuple:

```typescript
type Parameters = [string, number];
```

Now suppose you want to append another parameter.

### Example

```typescript
type AppendParameter<
    T extends unknown[],
    U
> = [...T, U];
```

Usage:

```typescript
type Original = [string, number];

type Updated = AppendParameter<Original, boolean>;
```

Result:

```typescript
type Updated = [string, number, boolean];
```

### Another example: Prepend a parameter

```typescript
type PrependParameter<
    T extends unknown[],
    U
> = [U, ...T];
```

Usage:

```typescript
type Result = PrependParameter<[number, boolean], string>;
```

Result:

```typescript
type Result = [string, number, boolean];
```

### Practical use cases

Variadic tuples are useful for:

- Function wrappers.
- Middleware.
- Logging utilities.
- Event systems.
- Function composition.
- Parameter manipulation.
- Higher-order functions.

---

# 16. Using Variadic Tuples to Type Function Arguments

Consider a generic function:

```typescript
function execute<T extends unknown[], R>(
    fn: (...args: T) => R,
    ...args: T
): R {
    return fn(...args);
}
```

Let's understand it.

### Function definition

```typescript
function execute<T extends unknown[], R>(
    fn: (...args: T) => R,
    ...args: T
): R
```

Here:

- `T` represents the complete parameter tuple.
- `R` represents the return type.
- `fn` is a function that accepts parameters described by `T`.
- `args` must match the same tuple.
- The function returns `R`.

### Usage

```typescript
function add(a: number, b: number): number {
    return a + b;
}

const result = execute(add, 10, 20);
```

Result:

```typescript
const result: number;
```

Now try:

```typescript
execute(add, "10", "20");
```

TypeScript reports an error.

Because the argument types do not match the original function's parameter tuple.

### Another example

```typescript
function createProduct(
    title: string,
    price: number,
    active: boolean
) {
    return {
        title,
        price,
        active
    };
}

const product = execute(
    createProduct,
    "Laptop",
    50000,
    true
);
```

Inferred result:

```typescript
{
    title: string;
    price: number;
    active: boolean;
}
```

This is a powerful way to preserve function parameter and return types.

---

# 17. Higher-Order Functions

A higher-order function is a function that:

1. Accepts another function as an argument, or
2. Returns another function.

### Example 1: Function accepting another function

```typescript
function calculate(
    a: number,
    b: number,
    operation: (x: number, y: number) => number
): number {
    return operation(a, b);
}
```

Usage:

```typescript
const result = calculate(10, 20, (x, y) => x + y);
```

Result:

```text
30
```

### Example 2: Function returning another function

```typescript
function multiplier(factor: number) {
    return function (value: number): number {
        return value * factor;
    };
}
```

Usage:

```typescript
const double = multiplier(2);

const result = double(10);
```

Result:

```text
20
```

### TypeScript function type

```typescript
type Multiplier = (factor: number) => (value: number) => number;
```

This describes a function that returns another function.

### Real-world use cases

Higher-order functions are common in:

- Express middleware.
- React hooks and event handlers.
- Array methods.
- Function decorators.
- Logging wrappers.
- Authentication wrappers.
- Caching utilities.

---

# 18. Creating a Type-Safe Function Wrapper

Suppose you want a function that wraps another function and logs its arguments.

The wrapper should preserve:

- Original parameter types.
- Original return type.

### Implementation

```typescript
function withLogging<T extends unknown[], R>(
    fn: (...args: T) => R
): (...args: T) => R {
    return (...args: T): R => {
        console.log("Arguments:", args);

        const result = fn(...args);

        console.log("Result:", result);

        return result;
    };
}
```

### Usage

```typescript
function add(a: number, b: number): number {
    return a + b;
}

const loggedAdd = withLogging(add);

const result = loggedAdd(10, 20);
```

TypeScript infers:

```typescript
const loggedAdd: (a: number, b: number) => number;
```

The wrapper preserves the original function signature.

### Another example

```typescript
function greet(name: string, age: number): string {
    return `Hello ${name}, age ${age}`;
}

const loggedGreet = withLogging(greet);

const message = loggedGreet("Riyaz", 25);
```

This is valid.

But:

```typescript
loggedGreet(25, "Riyaz");
```

Produces an error.

### Important limitation

This wrapper preserves the ordinary parameter tuple and return type.

It does not automatically preserve every possible function feature, such as:

- Overload signatures.
- Explicit `this` parameter types.
- Generic relationships between individual calls.
- Construct signatures.

More advanced wrappers need additional type design.

---

# 19. Typed Function Composition

Function composition means combining multiple functions so that the output of one function becomes the input of another.

Consider:

```typescript
function addOne(value: number): number {
    return value + 1;
}

function double(value: number): number {
    return value * 2;
}
```

You can compose them:

```typescript
const result = double(addOne(10));
```

Execution:

```text
10 → addOne → 11 → double → 22
```

Result:

```text
22
```

Now let's build a type-safe composition utility.

### Simple two-function composition

```typescript
function compose<A, B, C>(
    first: (value: A) => B,
    second: (value: B) => C
): (value: A) => C {
    return (value: A) => second(first(value));
}
```

Usage:

```typescript
const addOne = (value: number) => value + 1;

const toString = (value: number) => String(value);

const result = compose(addOne, toString);

const output = result(10);
```

Inferred type:

```typescript
const result: (value: number) => string;
```

Result:

```text
"11"
```

### Understanding the generic parameters

| Generic | Meaning |
|---|---|
| `A` | Input type of the first function |
| `B` | Output of the first and input of the second |
| `C` | Output type of the second function |

This ensures that the output of the first function is compatible with the input of the second.

### Invalid composition

```typescript
const toBoolean = (value: string) => value.length > 0;

const invalid = compose(addOne, toBoolean);
```

This is invalid because `addOne` returns a number, but `toBoolean` expects a string.

---

# 20. Variadic Tuple Types for Function Composition

We can use variadic tuples to create more flexible function utilities.

First, consider this type:

```typescript
type FunctionType = (...args: any[]) => any;
```

It represents a general function shape.

Now create a utility to extract the parameters of the first function and the return type of the final function.

A full implementation that safely composes an arbitrary number of functions is considerably more complex.

Let's start with a practical two-function version:

```typescript
function pipe<A extends unknown[], B, C>(
    first: (...args: A) => B,
    second: (value: B) => C
): (...args: A) => C {
    return (...args: A) => second(first(...args));
}
```

Usage:

```typescript
function getNumber(): number {
    return 10;
}

function double(value: number): number {
    return value * 2;
}

function toString(value: number): string {
    return String(value);
}

const pipeline = pipe(getNumber, double);

const result = pipeline();
```

Result:

```typescript
const result: number;
```

Now:

```typescript
const finalPipeline = pipe(pipeline, toString);

const finalResult = finalPipeline();
```

Result:

```typescript
const finalResult: string;
```

Each function's output must be compatible with the next function's input.

---

# 21. Advanced Callback Typing

Callbacks are functions passed as arguments to other functions.

Consider:

```typescript
function processUser(
    name: string,
    callback: (message: string) => void
): void {
    callback(`Hello ${name}`);
}
```

Usage:

```typescript
processUser("Riyaz", (message) => {
    console.log(message);
});
```

TypeScript automatically infers:

```typescript
message: string
```

This is called contextual typing.

### Generic callback

```typescript
function processData<T>(
    data: T,
    callback: (value: T) => void
): void {
    callback(data);
}
```

Usage:

```typescript
processData(100, (value) => {
    console.log(value.toFixed(2));
});
```

TypeScript infers:

```typescript
value: number
```

### Callback returning a value

```typescript
function transform<T, R>(
    data: T,
    callback: (value: T) => R
): R {
    return callback(data);
}
```

Usage:

```typescript
const result = transform(100, (value) => {
    return value.toString();
});
```

Inferred type:

```typescript
string
```

### Real-world example: Express-style middleware

```typescript
type Request = {
    userId?: number;
};

type NextFunction = () => void;

type Middleware = (
    request: Request,
    next: NextFunction
) => void;
```

Implementation:

```typescript
const authenticationMiddleware: Middleware = (request, next) => {
    if (request.userId) {
        next();
    }
};
```

This example demonstrates how callback types can define contracts between different application components.

---

# 22. Function Parameter Extraction

You already learned the built-in `Parameters<T>` utility in Phase 16.

Let's understand how it works in practical situations.

### Example

```typescript
function createUser(
    name: string,
    age: number,
    active: boolean
) {
    return {
        name,
        age,
        active
    };
}
```

Extract its parameter types:

```typescript
type UserParameters = Parameters<typeof createUser>;
```

Result:

```typescript
type UserParameters = [
    name: string,
    age: number,
    active: boolean
];
```

### Extract the return type

```typescript
type UserResult = ReturnType<typeof createUser>;
```

Result:

```typescript
type UserResult = {
    name: string;
    age: number;
    active: boolean;
};
```

### Extract a specific parameter

```typescript
type FirstParameter<T extends (...args: any[]) => any> =
    Parameters<T>[0];
```

Usage:

```typescript
type NameParameter = FirstParameter<typeof createUser>;
```

Result:

```typescript
string
```

### Extract the second parameter

```typescript
type SecondParameter<T extends (...args: any[]) => any> =
    Parameters<T>[1];
```

Usage:

```typescript
type AgeParameter = SecondParameter<typeof createUser>;
```

Result:

```typescript
number
```

**Important:** These examples assume the relevant parameter exists. If the index is out of bounds, the indexed access can produce an error unless you account for the possibility of an absent element.

---

# 23. Function Type Utilities

Let's build some reusable function utilities.

## A. GetFunctionArguments

```typescript
type GetFunctionArguments<T> =
    T extends (...args: infer P) => any
        ? P
        : never;
```

Usage:

```typescript
function login(email: string, password: string) {
    return true;
}

type Args = GetFunctionArguments<typeof login>;
```

Result:

```typescript
type Args = [email: string, password: string];
```

## B. GetFunctionReturn

```typescript
type GetFunctionReturn<T> =
    T extends (...args: any[]) => infer R
        ? R
        : never;
```

Usage:

```typescript
type Result = GetFunctionReturn<typeof login>;
```

Result:

```typescript
boolean
```

## C. MakeFunctionAsync

Suppose you want to transform a function type into an asynchronous function type.

```typescript
type MakeAsync<T> =
    T extends (...args: infer P) => infer R
        ? (...args: P) => Promise<R>
        : never;
```

Usage:

```typescript
type SyncFunction = (value: number) => string;

type AsyncFunction = MakeAsync<SyncFunction>;
```

Result:

```typescript
type AsyncFunction = (value: number) => Promise<string>;
```

## D. MakeFunctionReadonly

Functions themselves do not become immutable merely because their types are wrapped in `Readonly`.

However, you can use mapped types to make the properties of an object containing functions readonly.

```typescript
type ReadonlyService<T> = {
    readonly [Key in keyof T]: T[Key];
};
```

Usage:

```typescript
type UserService = {
    getUser: (id: number) => string;
    deleteUser: (id: number) => boolean;
};

type ReadonlyUserService = ReadonlyService<UserService>;
```

Now the function properties cannot be reassigned through that reference.

---

# 24. Important Concept: Generic Function Compatibility

Consider:

```typescript
type Identity = <T>(value: T) => T;
```

This represents a generic function that accepts a value of any type and returns the same type.

Now:

```typescript
const identity: Identity = (value) => value;
```

Usage:

```typescript
const a = identity("Hello");

const b = identity(100);

const c = identity(true);
```

Inferred types:

```typescript
string
number
boolean
```

### Important difference

Compare:

```typescript
type GenericIdentity = <T>(value: T) => T;
```

With:

```typescript
type StringIdentity = (value: string) => string;
```

The first function works with many types while preserving the input/output relationship.

The second only works with strings.

### Generic function vs function using a fixed generic type

Consider:

```typescript
type GenericFunction = <T>(value: T) => T;
```

And:

```typescript
type FixedFunction<T> = (value: T) => T;
```

These are different.

Example:

```typescript
const generic: GenericFunction = (value) => value;

const stringFunction: FixedFunction<string> = (value) => value;
```

The first is generic for each call.

The second is already fixed to a specific type when instantiated.

---

# 25. Common Mistakes

### Mistake 1: Forgetting overload implementation signatures

Incorrect:

```typescript
function getValue(value: string): string;

function getValue(value: number): number;
```

These are only declarations. An implementation is still needed unless you're writing an ambient declaration or an interface/type call signature.

### Mistake 2: Assuming the implementation signature is visible to callers

The implementation signature does not automatically become an additional public overload.

Only the declared overload signatures are available to callers.

### Mistake 3: Forgetting union overloads

If a caller has a `string | number` argument, separate string and number overloads may not be sufficient.

Add a union overload when that calling pattern should be supported.

### Mistake 4: Using overloads unnecessarily

A generic function may be simpler.

For example:

```typescript
function identity<T>(value: T): T {
    return value;
}
```

This does not require overloads.

### Mistake 5: Confusing function parameter and return variance

Under strict function checking:

- Parameters are generally contravariant.
- Return types are generally covariant.

### Mistake 6: Ignoring method bivariance

Method parameters have a compatibility exception compared with ordinary function-valued properties.

### Mistake 7: Losing parameter types in wrappers

Avoid writing:

```typescript
function wrapper(fn: Function) {
    // ...
}
```

The broad `Function` type loses useful information.

Prefer:

```typescript
function wrapper<T extends (...args: any[]) => any>(fn: T) {
    // ...
}
```

Or use a tuple-based generic signature when preserving arguments and return types is required.

### Mistake 8: Forgetting function composition compatibility

The return type of one function must be compatible with the next function's parameter type.

---

# 26. Interview Questions and Answers

### Q1. What is function overloading in TypeScript?

Function overloading allows one function to support multiple call signatures with different parameter or return types.

### Q2. What is the difference between overload signatures and implementation signatures?

Overload signatures describe the allowed ways to call a function.

The implementation signature defines the actual function body.

### Q3. Can arrow functions support overloads?

Arrow functions cannot use the same multiple-declaration syntax as function declarations.

However, they can implement a callable type containing multiple call signatures.

### Q4. What are variadic tuple types?

Variadic tuple types allow tuple types to be combined and manipulated using spread syntax.

Example:

```typescript
type Append<T extends unknown[], U> = [...T, U];
```

### Q5. What is a higher-order function?

A function that accepts another function as an argument or returns another function.

### Q6. What is function composition?

Function composition combines functions so the output of one function becomes the input of another.

### Q7. What is function parameter contravariance?

Under strict function checking, a function that accepts a broader parameter type can be used where a function accepting a narrower type is expected.

### Q8. What is return type covariance?

A function returning a more specific type can be used where a function returning a broader type is expected.

### Q9. What is the purpose of `Parameters<T>`?

It extracts the parameter types of a function as a tuple.

### Q10. What is the purpose of `ReturnType<T>`?

It extracts the return type of a function.

### Q11. What is contextual typing?

Contextual typing occurs when TypeScript infers types from the surrounding context.

For example, callback parameters can be inferred from the expected callback function type.

### Q12. Why are variadic tuples useful in function wrappers?

They preserve the parameter types and order of the original function.

### Q13. What is the difference between a generic function and a function using a generic type alias?

A generic function introduces a type parameter for each generic call.

A function using an already-instantiated generic alias may have its type fixed to a specific type.

### Q14. What is the difference between a union signature and overload signatures?

A union signature accepts a parameter whose type is a union.

Separate overload signatures can preserve more precise input/output relationships.

### Q15. Why should you avoid using the `Function` type?

It is too broad and does not preserve useful information about parameters and return types.

Prefer explicit function signatures or generic function constraints.

---

# 27. Practical Exercises

Try solving these without looking at the examples above.

## Exercise 1: Function Overloading

Create a function called `formatValue` that:

- Accepts a string and returns a string.
- Accepts a number and returns a number.
- Supports both calling patterns using overloads.

Expected:

```typescript
const a = formatValue("Hello");
// string

const b = formatValue(100);
// number
```

## Exercise 2: Different Parameter Counts

Create a `createMessage` function that supports:

```typescript
createMessage("Hello");
```

And:

```typescript
createMessage("Hello", "Riyaz");
```

Use function overloads.

## Exercise 3: User Retrieval

Create a `getUser` function that:

- Returns a single user when an ID is provided.
- Returns an array of users when no ID is provided.

## Exercise 4: Generic Function

Create a generic identity function that returns the same type as its input.

## Exercise 5: Variadic Tuple Append

Create a utility that appends an element to a tuple.

Expected:

```typescript
type Result = Append<[string, number], boolean>;

// [string, number, boolean]
```

## Exercise 6: Variadic Tuple Prepend

Create a utility that prepends an element to a tuple.

## Exercise 7: Execute Function

Create a generic `execute` function that:

- Accepts another function.
- Accepts its arguments.
- Returns the original function's return type.
- Preserves parameter types.

## Exercise 8: Function Wrapper

Create a `withLogging` utility that wraps any ordinary function without losing its parameter and return types.

## Exercise 9: Function Composition

Create a generic `compose` function that combines two compatible unary functions.

## Exercise 10: Extract First Parameter

Create a utility that extracts the first parameter type of a function.

## Exercise 11: Extract Last Parameter

Create a utility that extracts the last parameter type of a function.

## Exercise 12: Convert Function to Async

Create a utility that transforms:

```typescript
type SyncFunction = (value: number) => string;
```

Into:

```typescript
type AsyncFunction = (value: number) => Promise<string>;
```

## Exercise 13: Callback Typing

Create a generic function that accepts a value and a callback, transforms the value, and returns the callback's result type.

## Exercise 14: Function Compatibility

Create `Animal` and `Dog` types.

Then test:

- Assigning a Dog handler to an Animal handler.
- Assigning an Animal handler to a Dog handler.
- Assigning a function returning Dog to one returning Animal.

Use `strictFunctionTypes` to observe the differences.

---

# 28. Phase 20 Completion Checklist

| No. | Topic | Status |
|---|---|---|
| 1 | Function type fundamentals | ☐ |
| 2 | Function overloading | ☐ |
| 3 | Overload signatures | ☐ |
| 4 | Implementation signatures | ☐ |
| 5 | Different parameter counts | ☐ |
| 6 | Different return types | ☐ |
| 7 | Generic function overloads | ☐ |
| 8 | Overloads vs union types | ☐ |
| 9 | Union arguments with overloads | ☐ |
| 10 | Arrow function overload patterns | ☐ |
| 11 | Function compatibility | ☐ |
| 12 | Parameter variance | ☐ |
| 13 | Return type covariance | ☐ |
| 14 | Explicit `this` parameters | ☐ |
| 15 | Variadic tuple types | ☐ |
| 16 | Rest parameters with tuples | ☐ |
| 17 | Higher-order functions | ☐ |
| 18 | Type-safe function wrappers | ☐ |
| 19 | Function composition | ☐ |
| 20 | Advanced callback typing | ☐ |
| 21 | Function parameter extraction | ☐ |
| 22 | Generic function compatibility | ☐ |

---

# What Comes Next?

## Phase 21: Advanced TypeScript – Classes, Abstract Classes, and Object-Oriented Programming

In the next phase, we will explore object-oriented programming in TypeScript in depth.

Topics will include:

1. Classes and constructors.
2. Access modifiers: `public`, `private`, and `protected`.
3. Readonly class properties.
4. Parameter properties.
5. Getters and setters.
6. Inheritance and method overriding.
7. Abstract classes.
8. Abstract methods.
9. Interfaces with classes.
10. Static properties and methods.
11. Implementing multiple interfaces.
12. Method overloading in classes.
13. Polymorphism.
14. Composition vs inheritance.
15. Real-world OOP architecture.

**Phase 20 complete.** Say **"OK, Phase 21"** when you're ready to continue.