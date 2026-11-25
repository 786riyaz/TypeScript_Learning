# Phase 32: Advanced JavaScript and TypeScript – Functional Programming, Immutability, Pure Functions, Higher-Order Functions, and Composition

**Level:** Advanced  
**Prerequisites:** JavaScript functions, arrays, objects, closures, TypeScript generics, union types, and JavaScript runtime concepts.

---

# 1. Learning Objectives

By the end of this phase, you will understand:

1. Functional Programming (FP).
2. Functional Programming vs Object-Oriented Programming.
3. First-Class Functions.
4. Higher-Order Functions.
5. Pure and Impure Functions.
6. Side Effects.
7. Immutability.
8. Mutable vs Immutable Data.
9. Shallow Copy vs Deep Copy.
10. `Object.freeze()`, `Object.seal()`, and `Object.assign()`.
11. Function Composition.
12. Currying and Partial Application.
13. Closures in Functional Programming.
14. `map()`, `filter()`, `reduce()`, and `flatMap()`.
15. Declarative vs Imperative Programming.
16. Recursion.
17. Memoization.
18. Lazy Evaluation.
19. Functional Error Handling.
20. Functional Programming with TypeScript.
21. Practical Functional Programming Patterns.

---

# 2. What Is Functional Programming?

**Functional Programming (FP)** is a programming paradigm in which applications are built by combining functions and transforming data.

It emphasizes:

- Pure functions.
- Immutability.
- Function composition.
- First-class functions.
- Higher-order functions.
- Declarative programming.
- Minimizing side effects.

The main idea is:

**Take some input → Process it using functions → Return a new output.**

### Example: Traditional Approach

```javascript
let price = 100;
let tax = 18;

function calculatePrice() {
    price = price + (price * tax) / 100;
}

calculatePrice();

console.log(price); // 118
```

Here, the function directly modifies an external variable.

This introduces a side effect.

### Functional Approach

```javascript
function calculatePrice(price, tax) {
    return price + (price * tax) / 100;
}

const finalPrice = calculatePrice(100, 18);

console.log(finalPrice); // 118
```

Here:

- Input is provided explicitly.
- The function calculates a result.
- It does not modify external variables.
- The output is returned.

This is a more functional approach.

### Important Characteristics

| Characteristic | Meaning |
|---|---|
| Pure Functions | Same input produces the same output without observable side effects. |
| Immutability | Existing data is not modified. |
| First-Class Functions | Functions can be assigned, passed, and returned like other values. |
| Higher-Order Functions | Functions can accept or return other functions. |
| Composition | Combining small functions to build larger operations. |
| Declarative Style | Describing what should happen rather than every step of how to do it. |

**Important:** Functional Programming does not mean that you cannot use classes, objects, or loops. JavaScript supports multiple programming paradigms, and you can combine them.

---

# 3. Functional Programming vs Object-Oriented Programming

Both are programming paradigms, but they organize application logic differently.

### Object-Oriented Programming (OOP)

OOP organizes code around objects that combine:

- Data.
- Methods.
- State.
- Behavior.

Example:

```typescript
class ShoppingCart {
    private items: number[] = [];

    addItem(price: number): void {
        this.items.push(price);
    }

    getTotal(): number {
        return this.items.reduce(
            (total, price) => total + price,
            0
        );
    }
}

const cart = new ShoppingCart();

cart.addItem(100);
cart.addItem(200);

console.log(cart.getTotal()); // 300
```

The object manages its internal state.

### Functional Programming

FP emphasizes functions that transform data.

```typescript
function addItem(
    items: readonly number[],
    price: number
): number[] {
    return [...items, price];
}

function calculateTotal(
    items: readonly number[]
): number {
    return items.reduce(
        (total, price) => total + price,
        0
    );
}

let cart: readonly number[] = [];

cart = addItem(cart, 100);
cart = addItem(cart, 200);

console.log(calculateTotal(cart)); // 300
```

Here, the functions receive data and return transformed data.

### Comparison

| Feature | OOP | Functional Programming |
|---|---|---|
| Main concept | Objects | Functions |
| Data management | Often encapsulated in objects | Often passed between functions |
| State | Can be mutable | Prefers immutable data |
| Code organization | Classes and objects | Composable functions |
| Data transformation | Methods modify or return data | Functions transform data |
| Side effects | Often managed through object methods | Preferably isolated |
| Reusability | Inheritance and composition | Function composition and reuse |

**Real-world note:** React, Node.js, and TypeScript applications frequently combine both approaches.

---

# 4. First-Class Functions

JavaScript treats functions as **first-class citizens**.

This means functions can be used like other values.

You can:

1. Store functions in variables.
2. Pass functions as arguments.
3. Return functions from other functions.
4. Store functions inside objects and arrays.

### 4.1 Assign a Function to a Variable

```typescript
const greet = function (): void {
    console.log("Hello");
};

greet();
```

You can also use arrow functions:

```typescript
const greet = (): void => {
    console.log("Hello");
};

greet();
```

### 4.2 Pass a Function as an Argument

```typescript
function execute(callback: () => void): void {
    callback();
}

function greet(): void {
    console.log("Hello");
}

execute(greet);
```

Output:

```text
Hello
```

### 4.3 Return a Function

```typescript
function createGreeting(): () => void {
    return function () {
        console.log("Hello");
    };
}

const greet = createGreeting();

greet();
```

### 4.4 Store Functions in an Array

```typescript
const operations: Array<(a: number, b: number) => number> = [
    (a, b) => a + b,
    (a, b) => a - b,
    (a, b) => a * b
];

console.log(operations[0](10, 5)); // 15
console.log(operations[1](10, 5)); // 5
console.log(operations[2](10, 5)); // 50
```

**Remember:** First-class functions are a fundamental feature of JavaScript that makes Functional Programming possible.

---

# 5. Higher-Order Functions (HOF)

A **Higher-Order Function** is a function that does at least one of the following:

1. Accepts another function as an argument.
2. Returns another function.

### Example 1: Function Accepting Another Function

```typescript
function calculate(
    a: number,
    b: number,
    operation: (x: number, y: number) => number
): number {
    return operation(a, b);
}

function add(a: number, b: number): number {
    return a + b;
}

function multiply(a: number, b: number): number {
    return a * b;
}

console.log(calculate(10, 20, add));      // 30
console.log(calculate(10, 20, multiply)); // 200
```

Here, `calculate()` is a Higher-Order Function because it accepts another function.

### Example 2: Function Returning Another Function

```typescript
function multiplier(factor: number) {
    return function (number: number): number {
        return number * factor;
    };
}

const double = multiplier(2);
const triple = multiplier(3);

console.log(double(10)); // 20
console.log(triple(10)); // 30
```

`multiplier()` is also a Higher-Order Function because it returns another function.

### Common Higher-Order Functions in JavaScript

| Function | Purpose |
|---|---|
| `map()` | Transform array elements |
| `filter()` | Select elements |
| `reduce()` | Accumulate values |
| `forEach()` | Execute a callback for each element |
| `find()` | Find the first matching element |
| `some()` | Check whether at least one element matches |
| `every()` | Check whether all elements match |
| `sort()` | Sort elements using a comparator |
| `flatMap()` | Map elements and flatten one level |

---

# 6. Pure Functions

A **Pure Function** is a function that:

1. Produces the same output for the same input.
2. Does not produce observable side effects.

### Example: Pure Function

```typescript
function add(a: number, b: number): number {
    return a + b;
}

console.log(add(10, 20)); // 30
console.log(add(10, 20)); // 30
console.log(add(10, 20)); // 30
```

The function always returns the same result for the same inputs.

It does not modify anything outside itself.

### Another Example

```typescript
function calculateDiscount(
    price: number,
    discount: number
): number {
    return price - (price * discount) / 100;
}

console.log(calculateDiscount(1000, 10)); // 900
```

### Example: Impure Function

```typescript
let total = 0;

function addToTotal(amount: number): number {
    total += amount;

    return total;
}

console.log(addToTotal(100)); // 100
console.log(addToTotal(100)); // 200
```

The same input produces different outputs because the function depends on and modifies external state.

Therefore, it is impure.

### Pure vs Impure Functions

| Pure Function | Impure Function |
|---|---|
| Same input produces the same output | Output may depend on external state |
| Does not modify external state | May modify external state |
| Easier to test | Can be harder to test |
| Easier to reason about | Depends on surrounding conditions |
| Predictable | May be unpredictable |

### Important: Not Every Function That Uses Objects Is Impure

Consider:

```typescript
type User = {
    name: string;
};

function getUppercaseName(user: User): string {
    return user.name.toUpperCase();
}
```

This function is pure if `user.name` remains stable during the call and the function does not modify anything.

It receives an object, but it only reads its data.

Now consider:

```typescript
function updateName(user: User): void {
    user.name = "Updated";
}
```

This function modifies the supplied object.

It is impure because it changes externally observable state.

---

# 7. Side Effects

A **Side Effect** occurs when a function interacts with or changes something outside its local computation.

Common side effects include:

1. Modifying global variables.
2. Modifying external objects.
3. Writing to a database.
4. Making HTTP requests.
5. Reading or writing files.
6. Logging to the console.
7. Updating the DOM.
8. Accessing the current date or time.
9. Generating random numbers.

### Example: Side Effect

```typescript
function createUser(name: string): void {
    console.log(`Creating user: ${name}`);
}
```

The function writes to the console.

Therefore, it has a side effect.

### Example: Database Side Effect

```typescript
async function saveUser(user: {
    name: string;
    email: string;
}) {
    await database.users.insert(user);
}
```

This function modifies external database state.

It is not pure.

### How to Handle Side Effects?

A useful functional programming principle is:

**Keep business logic pure and isolate side effects at the application boundaries.**

Example:

```typescript
type Product = {
    price: number;
    quantity: number;
};

// Pure function
function calculateTotal(products: Product[]): number {
    return products.reduce(
        (total, product) =>
            total + product.price * product.quantity,
        0
    );
}

// Impure function
async function saveOrder(order: object): Promise<void> {
    await database.orders.insert(order);
}
```

The calculation can be tested independently from the database.

This is particularly useful in backend applications.

---

# 8. Referential Transparency

**Referential Transparency** means an expression can be replaced with its resulting value without changing the program's behavior.

Consider:

```typescript
function add(a: number, b: number): number {
    return a + b;
}

const result = add(10, 20);
```

Because `add(10, 20)` always returns `30`, you can replace:

```typescript
const result = add(10, 20);
```

with:

```typescript
const result = 30;
```

The behavior remains the same.

This property makes programs easier to understand, test, and optimize.

### Example of Non-Referential Transparency

```typescript
let counter = 0;

function increment(): number {
    counter++;

    return counter;
}
```

Calling `increment()` changes the program's state.

Replacing it with a fixed value would not preserve behavior.

---

# 9. What Is Immutability?

**Immutability** means that once data is created, you do not modify the existing data directly.

Instead, you create a new value containing the required changes.

### Mutable Example

```typescript
const user = {
    name: "Riyaz",
    age: 25
};

user.age = 26;

console.log(user);
```

The existing object is modified.

### Immutable Example

```typescript
const user = {
    name: "Riyaz",
    age: 25
};

const updatedUser = {
    ...user,
    age: 26
};

console.log(user.age);        // 25
console.log(updatedUser.age); // 26
```

The original object remains unchanged.

A new object is created.

### Why Is Immutability Important?

1. Predictable state changes.
2. Easier debugging.
3. Safer shared data.
4. Easier testing.
5. Simpler state comparison.
6. Fewer accidental mutations.
7. Better support for predictable state management.

### Where Is It Useful?

- React state management.
- Redux.
- Shopping cart calculations.
- Application configuration.
- Data transformation.
- Complex business logic.

**Important:** Immutability does not mean JavaScript objects cannot be changed. It is a programming discipline, and TypeScript and JavaScript provide tools to help enforce it.

---

# 10. Mutable vs Immutable Data

### Mutable Array

```typescript
const numbers = [10, 20, 30];

numbers.push(40);

console.log(numbers);
// [10, 20, 30, 40]
```

The original array is modified.

### Immutable Array Update

```typescript
const numbers = [10, 20, 30];

const updatedNumbers = [...numbers, 40];

console.log(numbers);
// [10, 20, 30]

console.log(updatedNumbers);
// [10, 20, 30, 40]
```

### Removing an Element Immutably

```typescript
const numbers = [10, 20, 30, 40];

const updatedNumbers = numbers.filter(
    number => number !== 20
);

console.log(updatedNumbers);
// [10, 30, 40]
```

### Updating an Object Immutably

```typescript
type User = {
    id: number;
    name: string;
    age: number;
};

const user: User = {
    id: 1,
    name: "Riyaz",
    age: 25
};

const updatedUser: User = {
    ...user,
    age: 26
};
```

### Important Difference: `const` Does Not Mean Immutable

```typescript
const user = {
    name: "Riyaz"
};

user.name = "Ahmed"; // Allowed
```

Why?

Because `const` prevents reassignment of the variable binding. It does not make the object immutable.

This is not allowed:

```typescript
user = {
    name: "Ahmed"
};
```

The distinction is:

| Concept | Meaning |
|---|---|
| `const` | Prevents reassignment of a variable |
| Immutability | Prevents modification of existing data |
| `readonly` | Prevents assignment through a TypeScript-checked property |
| `Object.freeze()` | Prevents certain runtime modifications to an object |

---

# 11. Shallow Copy vs Deep Copy

This is one of the most important topics when working with JavaScript objects.

## 11.1 Shallow Copy

A shallow copy creates a new outer object, but nested objects are still shared references.

Example:

```typescript
const user = {
    name: "Riyaz",
    address: {
        city: "Ahmedabad",
        country: "India"
    }
};

const copiedUser = { ...user };
```

Now:

```typescript
console.log(user === copiedUser); // false

console.log(user.address === copiedUser.address);
// true
```

Why?

Because the outer object is new, but the nested `address` object is shared.

### Demonstration

```typescript
copiedUser.name = "Ahmed";

copiedUser.address.city = "Mumbai";

console.log(user.name);
// Riyaz

console.log(user.address.city);
// Mumbai
```

The nested object modification also affects the original object.

### Why?

Because both objects reference the same nested address object.

Visual representation:

```text
user
 |
 |---- name: "Riyaz"
 |
 |---- address -----------+
                          |
                          v
                    { city: "Ahmedabad" }
                          ^
                          |
copiedUser                |
 |
 |---- name: "Riyaz"      |
 |
 |---- address -----------+
```

## 11.2 Deep Copy

A deep copy creates independent copies of nested objects as well.

### Using `structuredClone()`

```typescript
const user = {
    name: "Riyaz",
    address: {
        city: "Ahmedabad",
        country: "India"
    }
};

const copiedUser = structuredClone(user);

copiedUser.address.city = "Mumbai";

console.log(user.address.city);
// Ahmedabad

console.log(copiedUser.address.city);
// Mumbai
```

The nested objects are independent.

### What Is `structuredClone()`?

`structuredClone()` is a built-in JavaScript function that creates a deep copy of supported values using the structured clone algorithm.

It supports many data types, including:

- Objects.
- Arrays.
- Dates.
- Maps.
- Sets.
- ArrayBuffers.
- Typed arrays.

However, it has limitations:

- Functions cannot be cloned.
- DOM nodes cannot be cloned.
- Some custom class behavior and prototypes are not preserved as you might expect.
- Certain values, such as symbols, cannot be cloned.

### JSON-Based Deep Copy

You may also see:

```typescript
const copiedUser = JSON.parse(
    JSON.stringify(user)
);
```

This approach has significant limitations.

It does not properly preserve:

- `undefined` values.
- Functions.
- Symbols.
- `BigInt`.
- `Date` objects as Date instances.
- Circular references.

For modern applications, prefer `structuredClone()` when its supported data types and behavior fit your requirements.

### Shallow Copy vs Deep Copy

| Feature | Shallow Copy | Deep Copy |
|---|---|---|
| Outer object | New | New |
| Nested objects | Shared references | Independently copied |
| Performance | Generally faster | Generally more expensive |
| Memory usage | Usually lower | Usually higher |
| Example | `{ ...obj }` | `structuredClone(obj)` |

---

# 12. Object.freeze()

`Object.freeze()` prevents certain modifications to an object.

After freezing:

- Existing properties cannot be reassigned.
- New properties cannot be added.
- Existing properties cannot be deleted.
- Properties cannot be reconfigured.

### Example

```typescript
const user = {
    name: "Riyaz",
    age: 25
};

Object.freeze(user);

user.age = 26;

console.log(user.age);
```

In strict mode, attempting to modify a frozen property throws a `TypeError`.

In non-strict mode, the assignment generally fails silently.

JavaScript modules and TypeScript's emitted module code normally execute in strict mode.

### Important: Object.freeze() Is Shallow

Consider:

```typescript
const user = {
    name: "Riyaz",
    address: {
        city: "Ahmedabad"
    }
};

Object.freeze(user);

user.name = "Ahmed"; // Fails in strict mode

user.address.city = "Mumbai"; // Allowed

console.log(user.address.city);
// Mumbai
```

Why?

Because `Object.freeze()` only freezes the outer object.

The nested address object is not frozen.

### Deep Freeze Concept

To freeze nested objects, you need a recursive implementation.

```typescript
function deepFreeze<T>(object: T): T {
    if (
        object === null ||
        typeof object !== "object" ||
        Object.isFrozen(object)
    ) {
        return object;
    }

    Object.freeze(object);

    for (const key of Reflect.ownKeys(object)) {
        const value = (object as any)[key];

        if (
            value !== null &&
            typeof value === "object"
        ) {
            deepFreeze(value);
        }
    }

    return object;
}
```

Usage:

```typescript
const user = {
    name: "Riyaz",
    address: {
        city: "Ahmedabad"
    }
};

deepFreeze(user);
```

This is a simplified implementation for ordinary object graphs. Production-grade deep-freezing utilities may need additional considerations for special objects, accessors, proxies, and other edge cases.

---

# 13. Object.seal()

`Object.seal()` prevents adding and deleting properties from an object.

However, existing writable properties can still be modified.

### Example

```typescript
const user = {
    name: "Riyaz",
    age: 25
};

Object.seal(user);

user.age = 26; // Allowed

user.city = "Ahmedabad"; // Not allowed

delete user.name; // Not allowed

console.log(user);
```

### Comparison: freeze vs seal

| Feature | `Object.freeze()` | `Object.seal()` |
|---|---|---|
| Add properties | No | No |
| Delete properties | No | No |
| Modify existing writable properties | No | Yes |
| Reconfigure properties | No | No |

### What Is Object.preventExtensions()?

There is another method:

```typescript
Object.preventExtensions(user);
```

It prevents new properties from being added.

But existing properties can still be modified or deleted, subject to their property descriptors.

### Comparison

| Method | Add | Delete | Modify Existing Writable Properties |
|---|---|---|---|
| `preventExtensions()` | No | Yes | Yes |
| `seal()` | No | No | Yes |
| `freeze()` | No | No | No |

---

# 14. Object.assign()

`Object.assign()` copies enumerable own properties from one or more source objects into a target object.

### Syntax

```typescript
Object.assign(target, source1, source2);
```

### Example

```typescript
const user = {
    name: "Riyaz",
    age: 25
};

const additionalInfo = {
    city: "Ahmedabad",
    country: "India"
};

const result = Object.assign(
    {},
    user,
    additionalInfo
);

console.log(result);
```

Output:

```javascript
{
    name: "Riyaz",
    age: 25,
    city: "Ahmedabad",
    country: "India"
}
```

### Important: Object.assign() Mutates the Target

```typescript
const target = {
    name: "Riyaz"
};

const source = {
    age: 25
};

Object.assign(target, source);

console.log(target);
// { name: "Riyaz", age: 25 }
```

The original target object was modified.

### Object.assign() vs Spread Operator

```typescript
const updatedUser = {
    ...user,
    age: 26
};
```

This creates a new outer object.

Comparison:

| Feature | `Object.assign()` | Spread Operator |
|---|---|---|
| Copies properties | Yes | Yes |
| Shallow copy | Yes | Yes |
| Mutates target | Yes | No, when using a new object literal |
| Creates a new object automatically | No | Yes, in object literals |
| Multiple sources | Yes | Yes |

Both perform shallow copying of enumerable own properties.

---

# 15. Spread and Rest Operators in Immutable Programming

The spread syntax is frequently used to create new arrays and objects.

### 15.1 Add an Array Element

```typescript
const numbers = [10, 20, 30];

const updatedNumbers = [...numbers, 40];
```

### 15.2 Remove an Array Element

```typescript
const numbers = [10, 20, 30, 40];

const updatedNumbers = numbers.filter(
    number => number !== 20
);
```

### 15.3 Update an Array Element

```typescript
const users = [
    { id: 1, name: "Riyaz" },
    { id: 2, name: "Ahmed" }
];

const updatedUsers = users.map(user =>
    user.id === 1
        ? { ...user, name: "Riyaz Khan" }
        : user
);
```

### 15.4 Update a Nested Object

```typescript
const user = {
    name: "Riyaz",
    address: {
        city: "Ahmedabad",
        country: "India"
    }
};

const updatedUser = {
    ...user,
    address: {
        ...user.address,
        city: "Mumbai"
    }
};
```

Notice that we copied both the outer object and the nested address object.

This is important when performing immutable updates.

---

# 16. Function Composition

**Function Composition** means combining multiple small functions to create a larger function.

Instead of writing one large function, we create smaller reusable functions and combine them.

### Example

Suppose we have three functions:

```typescript
function addTen(number: number): number {
    return number + 10;
}

function multiplyByTwo(number: number): number {
    return number * 2;
}

function subtractFive(number: number): number {
    return number - 5;
}
```

We can execute them individually:

```typescript
const result = subtractFive(
    multiplyByTwo(
        addTen(10)
    )
);

console.log(result); // 35
```

Execution:

```text
10
 |
 v
addTen(10)
 |
 v
20
 |
 v
multiplyByTwo(20)
 |
 v
40
 |
 v
subtractFive(40)
 |
 v
35
```

This is function composition.

## 16.1 What Is compose()?

A `compose()` function combines functions from right to left.

For example:

```typescript
compose(f, g, h)(value)
```

Means:

```typescript
f(g(h(value)))
```

### Implementation

```typescript
type NumberFunction = (value: number) => number;

function compose(
    ...functions: NumberFunction[]
): NumberFunction {
    return (value: number) => {
        return functions.reduceRight(
            (result, fn) => fn(result),
            value
        );
    };
}
```

Usage:

```typescript
const addTen = (n: number) => n + 10;
const multiplyByTwo = (n: number) => n * 2;
const subtractFive = (n: number) => n - 5;

const calculate = compose(
    subtractFive,
    multiplyByTwo,
    addTen
);

console.log(calculate(10)); // 35
```

## 16.2 What Is pipe()?

`pipe()` performs composition from left to right.

```typescript
pipe(f, g, h)(value)
```

Means:

```typescript
h(g(f(value)))
```

### Implementation

```typescript
type NumberFunction = (value: number) => number;

function pipe(
    ...functions: NumberFunction[]
): NumberFunction {
    return (value: number) => {
        return functions.reduce(
            (result, fn) => fn(result),
            value
        );
    };
}
```

Usage:

```typescript
const addTen = (n: number) => n + 10;
const multiplyByTwo = (n: number) => n * 2;
const subtractFive = (n: number) => n - 5;

const calculate = pipe(
    addTen,
    multiplyByTwo,
    subtractFive
);

console.log(calculate(10)); // 35
```

### compose() vs pipe()

| Feature | compose() | pipe() |
|---|---|---|
| Execution direction | Right to left | Left to right |
| First function applied | Last argument | First argument |
| Readability | Can feel mathematical | Often reads like a sequence |
| Example | `f(g(h(x)))` | `h(g(f(x)))` |

**Note:** These examples use functions that accept and return numbers. Composing functions with different input and output types requires more advanced TypeScript typing.

---

# 17. Currying

**Currying** is a technique that transforms a function accepting multiple arguments into a sequence of functions, each accepting one argument.

### Normal Function

```typescript
function add(a: number, b: number): number {
    return a + b;
}

console.log(add(10, 20)); // 30
```

### Curried Function

```typescript
function add(a: number) {
    return function (b: number): number {
        return a + b;
    };
}
```

Usage:

```typescript
console.log(add(10)(20)); // 30
```

### Arrow Function Version

```typescript
const add = (a: number) =>
    (b: number) =>
        a + b;

console.log(add(10)(20)); // 30
```

### How Does It Work?

```typescript
const addTen = add(10);
```

Now `addTen` is a function that remembers `10`.

```typescript
console.log(addTen(5));  // 15
console.log(addTen(20)); // 30
```

This works because of closures.

### Practical Example

```typescript
const calculateDiscount =
    (discount: number) =>
    (price: number): number =>
        price - (price * discount) / 100;

const tenPercentDiscount = calculateDiscount(10);

console.log(tenPercentDiscount(1000)); // 900
console.log(tenPercentDiscount(2000)); // 1800
```

The discount is configured once and reused.

---

# 18. Partial Application

**Partial Application** means creating a new function by fixing some arguments of an existing function.

### Normal Function

```typescript
function multiply(
    a: number,
    b: number,
    c: number
): number {
    return a * b * c;
}
```

### Partial Application

```typescript
function multiplyByTwo(
    b: number,
    c: number
): number {
    return multiply(2, b, c);
}

console.log(multiplyByTwo(3, 4)); // 24
```

We fixed the first argument to `2`.

### Generic Partial Application Example

```typescript
function partial(
    a: number,
    b: number
) {
    return function (c: number): number {
        return a + b + c;
    };
}

const addTenAndTwenty = partial(10, 20);

console.log(addTenAndTwenty(30)); // 60
```

### Currying vs Partial Application

| Feature | Currying | Partial Application |
|---|---|---|
| Meaning | Converts a multi-argument function into nested single-argument functions | Fixes some arguments to create a new function |
| Input structure | One argument at a time | Can accept multiple arguments |
| Output | Sequence of functions | A function with fewer remaining arguments |
| Example | `add(10)(20)` | `multiplyByTwo(3, 4)` |

**Remember:** Currying and partial application are related, but they are not the same thing.

---

# 19. Closures in Functional Programming

A closure occurs when a function remembers variables from its outer lexical scope, even after that outer function has finished executing.

### Example

```typescript
function createCounter() {
    let count = 0;

    return function () {
        count++;

        return count;
    };
}

const counter = createCounter();

console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

The returned function remembers `count`.

### Practical Example: Create a Configured Function

```typescript
function createTaxCalculator(taxRate: number) {
    return function (price: number): number {
        return price + (price * taxRate) / 100;
    };
}

const calculateGST = createTaxCalculator(18);

console.log(calculateGST(1000)); // 1180
```

### Why Are Closures Useful?

- Function factories.
- Encapsulating state.
- Creating reusable callbacks.
- Currying.
- Partial application.
- Memoization.
- Event handlers.

Closures are particularly important in JavaScript because functions can access their surrounding lexical environment.

---

# 20. map(), filter(), and reduce()

These are among the most commonly used higher-order array methods in JavaScript.

## 20.1 map()

`map()` transforms every element of an array and returns a new array.

### Syntax

```typescript
array.map(callback);
```

### Example

```typescript
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(number => number * 2);

console.log(doubled);
// [2, 4, 6, 8, 10]
```

The original array remains unchanged.

### Real-World Example

```typescript
type User = {
    id: number;
    name: string;
};

const users: User[] = [
    { id: 1, name: "Riyaz" },
    { id: 2, name: "Ahmed" },
    { id: 3, name: "Ali" }
];

const names = users.map(user => user.name);

console.log(names);
// ["Riyaz", "Ahmed", "Ali"]
```

Use `map()` when you want to transform each element.

---

## 20.2 filter()

`filter()` selects elements that satisfy a condition.

### Example

```typescript
const numbers = [1, 2, 3, 4, 5, 6];

const evenNumbers = numbers.filter(
    number => number % 2 === 0
);

console.log(evenNumbers);
// [2, 4, 6]
```

### Real-World Example

```typescript
type Product = {
    name: string;
    price: number;
};

const products: Product[] = [
    { name: "Laptop", price: 50000 },
    { name: "Mouse", price: 500 },
    { name: "Keyboard", price: 1500 },
    { name: "Monitor", price: 12000 }
];

const expensiveProducts = products.filter(
    product => product.price > 10000
);

console.log(expensiveProducts);
```

Use `filter()` when you want to select elements.

---

## 20.3 reduce()

`reduce()` processes an array and combines its elements into a single accumulated result.

### Syntax

```typescript
array.reduce(callback, initialValue);
```

The callback receives:

1. Accumulator.
2. Current element.
3. Current index.
4. Original array.

### Example: Calculate Total

```typescript
const prices = [100, 200, 300, 400];

const total = prices.reduce(
    (accumulator, currentValue) => {
        return accumulator + currentValue;
    },
    0
);

console.log(total); // 1000
```

### How Does It Work?

| Iteration | Accumulator | Current Value | Result |
|---|---:|---:|---:|
| 1 | 0 | 100 | 100 |
| 2 | 100 | 200 | 300 |
| 3 | 300 | 300 | 600 |
| 4 | 600 | 400 | 1000 |

The final result is `1000`.

### Example: Count Occurrences

```typescript
const fruits = [
    "apple",
    "banana",
    "apple",
    "orange",
    "banana",
    "apple"
];

const result = fruits.reduce<Record<string, number>>(
    (accumulator, fruit) => {
        accumulator[fruit] =
            (accumulator[fruit] ?? 0) + 1;

        return accumulator;
    },
    {}
);

console.log(result);
```

Output:

```javascript
{
    apple: 3,
    banana: 2,
    orange: 1
}
```

**Important:** This reducer mutates its local accumulator object. That is generally acceptable because the accumulator is created for this reduction and is not shared externally. However, if you want a strictly immutable accumulator, you can return a new object each iteration:

```typescript
const result = fruits.reduce<Record<string, number>>(
    (accumulator, fruit) => ({
        ...accumulator,
        [fruit]: (accumulator[fruit] ?? 0) + 1
    }),
    {}
);
```

This version creates a new object on every iteration and may be less efficient for large arrays.

---

# 21. flatMap()

`flatMap()` performs two operations:

1. Maps each element.
2. Flattens the resulting array by one level.

### Example

```typescript
const numbers = [1, 2, 3];

const result = numbers.flatMap(number => [
    number,
    number * 2
]);

console.log(result);
// [1, 2, 2, 4, 3, 6]
```

### Equivalent Using map() and flat()

```typescript
const result = numbers
    .map(number => [number, number * 2])
    .flat();
```

### Practical Example

Suppose each user has multiple roles.

```typescript
const users = [
    {
        name: "Riyaz",
        roles: ["Admin", "Editor"]
    },
    {
        name: "Ahmed",
        roles: ["User"]
    }
];

const roles = users.flatMap(user => user.roles);

console.log(roles);
// ["Admin", "Editor", "User"]
```

### map() vs flatMap()

| Feature | map() | flatMap() |
|---|---|---|
| Transforms elements | Yes | Yes |
| Flattens result | No | One level |
| Return type | New array | New array |
| Common use | Transformation | Transformation + flattening |

---

# 22. Declarative vs Imperative Programming

These are two different ways to express program logic.

## 22.1 Imperative Programming

Imperative programming describes **how to perform a task step by step**.

Example:

```typescript
const numbers = [1, 2, 3, 4, 5];

const result: number[] = [];

for (const number of numbers) {
    if (number % 2 === 0) {
        result.push(number);
    }
}

console.log(result);
// [2, 4]
```

We explicitly describe:

1. Create an empty array.
2. Iterate through the array.
3. Check each number.
4. Push matching numbers into the result.

## 22.2 Declarative Programming

Declarative programming describes **what result we want**.

```typescript
const numbers = [1, 2, 3, 4, 5];

const result = numbers.filter(
    number => number % 2 === 0
);

console.log(result);
// [2, 4]
```

We simply describe the condition for selecting values.

### Comparison

| Feature | Imperative | Declarative |
|---|---|---|
| Focus | How to do something | What result is needed |
| Code | Step-by-step instructions | Expression of desired result |
| Common constructs | Loops, assignments | map, filter, reduce |
| Readability | Can become verbose | Often concise |
| Control | More explicit | More abstracted |

**Important:** Declarative code does not automatically mean Functional Programming. SQL is declarative, for example, but it is not the same thing as writing a functional program.

---

# 23. Recursion

**Recursion** is a programming technique in which a function calls itself to solve a problem.

Every recursive function should have:

1. A base case.
2. A recursive case.

### Example: Countdown

```typescript
function countdown(number: number): void {
    if (number <= 0) {
        console.log("Finished");
        return;
    }

    console.log(number);

    countdown(number - 1);
}

countdown(5);
```

Output:

```text
5
4
3
2
1
Finished
```

### Example: Factorial

Factorial of 5:

```text
5! = 5 × 4 × 3 × 2 × 1 = 120
```

Implementation:

```typescript
function factorial(number: number): number {
    if (number <= 1) {
        return 1;
    }

    return number * factorial(number - 1);
}

console.log(factorial(5)); // 120
```

### How Does It Work?

```text
factorial(5)
    |
    v
5 * factorial(4)
        |
        v
        4 * factorial(3)
                |
                v
                3 * factorial(2)
                        |
                        v
                        2 * factorial(1)
                                |
                                v
                                1
```

Then the results return back through the call stack.

### Important: Recursion Can Cause Stack Overflow

```typescript
function infiniteRecursion(): void {
    infiniteRecursion();
}
```

This eventually causes a `RangeError: Maximum call stack size exceeded` in typical JavaScript environments.

### Recursion vs Iteration

| Feature | Recursion | Iteration |
|---|---|---|
| Technique | Function calls itself | Uses loops |
| Memory | Uses call stack | Usually uses less call-stack memory |
| Readability | Useful for recursive structures | Useful for repeated operations |
| Performance | Can have function-call overhead | Often more efficient |
| Risk | Stack overflow | Infinite loops |

**Note:** Tail-call optimization is specified for certain cases in ECMAScript, but it is not reliably implemented across mainstream JavaScript engines. Do not depend on it to prevent stack overflow.

---

# 24. Memoization

**Memoization** is an optimization technique that stores previously calculated results so they can be reused.

Instead of calculating the same result repeatedly, the function retrieves it from a cache.

### Without Memoization

```typescript
function square(number: number): number {
    console.log("Calculating...");

    return number * number;
}

console.log(square(5));
console.log(square(5));
console.log(square(5));
```

The function calculates the result every time.

### With Memoization

```typescript
function memoizedSquare() {
    const cache = new Map<number, number>();

    return function (number: number): number {
        if (cache.has(number)) {
            console.log("From cache");

            return cache.get(number)!;
        }

        console.log("Calculating...");

        const result = number * number;

        cache.set(number, result);

        return result;
    };
}

const square = memoizedSquare();

console.log(square(5)); // Calculating... 25
console.log(square(5)); // From cache 25
console.log(square(5)); // From cache 25
```

### How Does It Work?

```text
Input: 5
   |
   v
Check cache
   |
   +---- Found? ---- Yes ----> Return cached result
   |
   No
   |
   v
Calculate result
   |
   v
Store result in cache
   |
   v
Return result
```

### Practical Use Cases

- Expensive calculations.
- Repeated data transformations.
- Dynamic programming.
- Repeated API-independent computations.
- Recursive algorithms.

### Important Considerations

Memoization works best when a function is pure or when all of its relevant dependencies are included in the cache key.

For example, caching a function that depends on the current time using only its explicit argument can produce incorrect results.

Also consider:

- Cache size.
- Memory consumption.
- Cache invalidation.
- Complex object keys.
- Whether the cached result can become stale.

---

# 25. Lazy Evaluation

**Lazy Evaluation** means delaying computation until the result is actually needed.

JavaScript array methods such as `map()` and `filter()` are eager: they process their input immediately.

Generators and iterators can provide lazy processing.

### Eager Evaluation

```typescript
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(number => {
    console.log("Processing:", number);

    return number * 2;
});

console.log(doubled);
```

All elements are processed immediately when `map()` executes.

### Lazy Evaluation Using Generators

```typescript
function* generateNumbers() {
    console.log("Generating 1");
    yield 1;

    console.log("Generating 2");
    yield 2;

    console.log("Generating 3");
    yield 3;
}

const numbers = generateNumbers();

console.log("Generator created");

console.log(numbers.next());
console.log(numbers.next());
```

Output:

```text
Generator created
Generating 1
{ value: 1, done: false }
Generating 2
{ value: 2, done: false }
```

Notice that creating the generator does not execute its body immediately.

Execution starts when you request values using `.next()`.

### Why Is Lazy Evaluation Useful?

- Processing large datasets.
- Avoiding unnecessary calculations.
- Handling potentially infinite sequences.
- Improving memory efficiency.
- Building data-processing pipelines.

### Example: Infinite Number Generator

```typescript
function* infiniteNumbers() {
    let number = 1;

    while (true) {
        yield number++;
    }
}

const numbers = infiniteNumbers();

console.log(numbers.next().value); // 1
console.log(numbers.next().value); // 2
console.log(numbers.next().value); // 3
```

This generator can produce values indefinitely without creating an infinite array in memory.

---

# 26. Functional Error Handling

Traditional JavaScript error handling uses `try...catch`.

### Example

```typescript
function divide(a: number, b: number): number {
    if (b === 0) {
        throw new Error("Cannot divide by zero");
    }

    return a / b;
}

try {
    console.log(divide(10, 2));
} catch (error) {
    console.error(error);
}
```

This works, but exceptions are not always the most convenient way to represent expected business outcomes.

Functional programming often uses explicit result values.

## 26.1 Result Type

A `Result` type represents either success or failure.

```typescript
type Result<T, E> =
    | {
        success: true;
        data: T;
    }
    | {
        success: false;
        error: E;
    };
```

This is a discriminated union.

### Example

```typescript
function divide(
    a: number,
    b: number
): Result<number, string> {
    if (b === 0) {
        return {
            success: false,
            error: "Cannot divide by zero"
        };
    }

    return {
        success: true,
        data: a / b
    };
}
```

Usage:

```typescript
const result = divide(10, 2);

if (result.success) {
    console.log(result.data);
} else {
    console.log(result.error);
}
```

TypeScript understands which properties are available based on the `success` condition.

### Example: User Validation

```typescript
type User = {
    name: string;
    email: string;
};

type ValidationError = {
    field: string;
    message: string;
};

type ValidationResult =
    Result<User, ValidationError>;

function validateUser(
    name: string,
    email: string
): ValidationResult {
    if (!name.trim()) {
        return {
            success: false,
            error: {
                field: "name",
                message: "Name is required"
            }
        };
    }

    if (!email.includes("@")) {
        return {
            success: false,
            error: {
                field: "email",
                message: "Invalid email"
            }
        };
    }

    return {
        success: true,
        data: {
            name,
            email
        }
    };
}
```

This approach makes expected validation failures explicit.

### 26.2 What Is Option or Maybe?

An `Option` or `Maybe` type represents a value that may or may not exist.

A simple TypeScript representation:

```typescript
type Option<T> =
    | {
        kind: "some";
        value: T;
    }
    | {
        kind: "none";
    };
```

Example:

```typescript
function findUser(id: number): Option<string> {
    if (id === 1) {
        return {
            kind: "some",
            value: "Riyaz"
        };
    }

    return {
        kind: "none"
    };
}
```

Usage:

```typescript
const result = findUser(1);

if (result.kind === "some") {
    console.log(result.value);
} else {
    console.log("User not found");
}
```

### Result vs Option

| Type | Purpose |
|---|---|
| `Result<T, E>` | Represents success or failure, including an error |
| `Option<T>` | Represents the presence or absence of a value |

Use `Result` when the reason for failure matters.

Use `Option` when a value may simply be absent.

---

# 27. Functional Programming with TypeScript

TypeScript provides several features that help you write functional code.

## 27.1 readonly

`readonly` prevents reassignment of a property through TypeScript's type system.

```typescript
type User = {
    readonly id: number;
    name: string;
};

const user: User = {
    id: 1,
    name: "Riyaz"
};

user.name = "Ahmed"; // Allowed

user.id = 2; // TypeScript error
```

The `id` property cannot be reassigned through this type.

However, `readonly` is a compile-time restriction. It does not automatically freeze the object at runtime.

## 27.2 Readonly<T>

TypeScript provides a utility type called `Readonly<T>`.

```typescript
type User = {
    name: string;
    age: number;
};

const user: Readonly<User> = {
    name: "Riyaz",
    age: 25
};

user.age = 26; // TypeScript error
```

It makes the properties readonly at the top level.

It is not automatically deep or recursive.

## 27.3 ReadonlyArray<T>

```typescript
const numbers: ReadonlyArray<number> = [
    10,
    20,
    30
];

numbers.push(40); // TypeScript error
```

It prevents array mutation through that TypeScript reference.

## 27.4 as const

`as const` creates a readonly literal type.

```typescript
const config = {
    apiUrl: "https://example.com",
    timeout: 5000
} as const;
```

TypeScript infers literal types:

```typescript
// {
//   readonly apiUrl: "https://example.com";
//   readonly timeout: 5000;
// }
```

This provides compile-time restrictions. It does not call `Object.freeze()`.

## 27.5 Generic Functional Functions

You can create reusable functions using generics.

### Generic map

```typescript
function mapArray<T, U>(
    items: T[],
    callback: (item: T) => U
): U[] {
    return items.map(callback);
}

const numbers = [1, 2, 3];

const strings = mapArray(
    numbers,
    number => number.toString()
);

console.log(strings);
// ["1", "2", "3"]
```

Here:

- `T` represents the input type.
- `U` represents the output type.

### Generic filter

```typescript
function filterArray<T>(
    items: T[],
    callback: (item: T) => boolean
): T[] {
    return items.filter(callback);
}

const numbers = [1, 2, 3, 4, 5, 6];

const evenNumbers = filterArray(
    numbers,
    number => number % 2 === 0
);

console.log(evenNumbers);
// [2, 4, 6]
```

---

# 28. Practical Example: Functional Shopping Cart

Let's implement a small shopping cart using functional programming principles.

### Step 1: Define Types

```typescript
type Product = {
    id: number;
    name: string;
    price: number;
    quantity: number;
};

type Cart = readonly Product[];
```

### Step 2: Add Product

```typescript
function addProduct(
    cart: Cart,
    product: Product
): Cart {
    return [...cart, product];
}
```

The function creates a new array instead of modifying the original cart.

### Step 3: Remove Product

```typescript
function removeProduct(
    cart: Cart,
    productId: number
): Cart {
    return cart.filter(
        product => product.id !== productId
    );
}
```

### Step 4: Calculate Total

```typescript
function calculateCartTotal(cart: Cart): number {
    return cart.reduce(
        (total, product) =>
            total + product.price * product.quantity,
        0
    );
}
```

### Step 5: Apply Discount

```typescript
function applyDiscount(
    total: number,
    discountPercentage: number
): number {
    return total - (
        total * discountPercentage
    ) / 100;
}
```

### Step 6: Use the Functions

```typescript
let cart: Cart = [];

cart = addProduct(cart, {
    id: 1,
    name: "Laptop",
    price: 50000,
    quantity: 1
});

cart = addProduct(cart, {
    id: 2,
    name: "Mouse",
    price: 1000,
    quantity: 2
});

const total = calculateCartTotal(cart);

const finalAmount = applyDiscount(total, 10);

console.log("Cart Total:", total);
console.log("Final Amount:", finalAmount);
```

Output:

```text
Cart Total: 52000
Final Amount: 46800
```

### Why Is This Functional?

- Business logic is separated into small functions.
- Functions receive their dependencies as arguments.
- Existing cart data is not modified.
- Calculations are pure.
- Functions can be tested independently.

In a real backend application, database operations, API requests, and payment processing would remain separate from these pure calculation functions.

---

# 29. Common Mistakes in Functional Programming

| Mistake | Correct Understanding |
|---|---|
| Thinking `const` makes objects immutable | `const` prevents reassignment, not property changes. |
| Assuming spread creates a deep copy | Spread creates a shallow copy. |
| Assuming `Object.freeze()` freezes nested objects | It freezes only the specified object. |
| Mutating external state inside pure functions | Pure functions should avoid observable side effects. |
| Using `map()` when you need `filter()` | `map()` transforms; `filter()` selects. |
| Using `reduce()` for every operation | Use the most readable method for the task. |
| Assuming currying and partial application are identical | They are related but different techniques. |
| Memoizing functions with hidden dependencies | Cache keys must represent all relevant inputs. |
| Using recursion for extremely large inputs | Stack limits can cause errors. |
| Assuming generators execute immediately | Generator bodies execute as values are requested. |
| Assuming TypeScript `readonly` freezes runtime data | It provides compile-time restrictions only. |
| Assuming Functional Programming prohibits all mutation | Mutation can be isolated at appropriate boundaries. |

---

# 30. Functional Programming Interview Questions

### Q1. What is Functional Programming?

Functional Programming is a programming paradigm that builds applications using functions, immutable data, function composition, and controlled side effects.

### Q2. What is a pure function?

A pure function produces the same output for the same input and does not produce observable side effects.

### Q3. What is an impure function?

An impure function depends on or modifies external state, or produces other observable side effects.

### Q4. What is a side effect?

A side effect is an interaction with or modification of something outside a function's local computation.

Examples include database writes, API calls, logging, and modifying global variables.

### Q5. What is immutability?

Immutability means avoiding direct modifications to existing data and creating new values when changes are required.

### Q6. Does const make an object immutable?

No. `const` prevents reassignment of the variable binding, but object properties can still be modified.

### Q7. What is the difference between shallow copy and deep copy?

A shallow copy creates a new outer object but shares nested references.

A deep copy creates independent copies of nested data.

### Q8. What is Object.freeze()?

It prevents adding, deleting, or modifying properties of the frozen object. It is shallow by default.

### Q9. What is Object.seal()?

It prevents adding and deleting properties, but existing writable properties can still be modified.

### Q10. What is a first-class function?

A function that can be assigned to variables, passed as an argument, and returned from another function.

### Q11. What is a higher-order function?

A function that accepts another function as an argument or returns a function.

### Q12. Is map() a higher-order function?

Yes. It accepts a callback function and returns a new array.

### Q13. What is function composition?

Combining multiple functions so the output of one function becomes the input of another.

### Q14. What is the difference between compose() and pipe()?

`compose()` executes functions right to left, while `pipe()` executes them left to right.

### Q15. What is currying?

Currying transforms a function accepting multiple arguments into nested functions that accept arguments one at a time.

### Q16. What is partial application?

Partial application fixes some arguments of an existing function and returns a function that accepts the remaining arguments.

### Q17. What is a closure?

A closure is a function that retains access to variables from its outer lexical environment.

### Q18. What is the difference between map() and filter()?

`map()` transforms every element, while `filter()` selects elements based on a condition.

### Q19. What is reduce()?

`reduce()` processes array elements and combines them into a single accumulated result.

### Q20. What is flatMap()?

`flatMap()` maps array elements and flattens the result by one level.

### Q21. What is declarative programming?

Declarative programming describes the desired result rather than explicitly specifying every execution step.

### Q22. What is recursion?

Recursion is a technique in which a function calls itself to solve a problem.

### Q23. What is memoization?

Memoization caches previously calculated results to avoid repeated computation.

### Q24. What is lazy evaluation?

Lazy evaluation delays computation until the result is needed.

### Q25. What is a generator?

A generator is a function that can pause execution and yield values one at a time using the `yield` keyword.

### Q26. What is the Result type?

A Result type represents either a successful value or an error, usually using a discriminated union.

### Q27. What is the difference between Result and Option?

Result represents success or failure with an error. Option represents whether a value exists.

### Q28. Is Functional Programming possible in JavaScript?

Yes. JavaScript supports first-class functions, closures, higher-order functions, generators, and immutable update patterns.

### Q29. Is Functional Programming the same as avoiding loops?

No. Functional Programming is a broader paradigm. Loops can still be used where appropriate.

### Q30. Can Functional Programming and OOP be used together?

Yes. Many modern applications combine functional data transformations with object-oriented architecture.

---

# 31. Practical Exercises

Complete these exercises yourself before moving to the next phase.

## Beginner Level

**Exercise 1: Pure Function**

Create a function that accepts two numbers and returns their sum.

Requirements:
- Do not use global variables.
- Do not modify external state.
- Return the result.

**Exercise 2: Immutable Array**

Given:

```typescript
const numbers = [10, 20, 30, 40, 50];
```

Perform the following without modifying the original array:

1. Add `60`.
2. Remove `30`.
3. Double every number.
4. Select numbers greater than `50`.

**Exercise 3: map()**

Given:

```typescript
const users = [
    { id: 1, name: "Riyaz" },
    { id: 2, name: "Ahmed" },
    { id: 3, name: "Ali" }
];
```

Return an array containing only the user names.

**Exercise 4: filter()**

Given an array of products, return products with a price greater than ₹1,000.

**Exercise 5: reduce()**

Calculate the total price of the following products:

```typescript
const products = [
    { name: "Laptop", price: 50000 },
    { name: "Mouse", price: 1000 },
    { name: "Keyboard", price: 2000 }
];
```

## Intermediate Level

**Exercise 6: Shallow vs Deep Copy**

Create a nested object.

1. Copy it using spread.
2. Copy it using `structuredClone()`.
3. Modify nested properties.
4. Observe the differences.

**Exercise 7: Function Composition**

Create three functions:

- Add 10.
- Multiply by 2.
- Subtract 5.

Combine them using `compose()` and `pipe()`.

**Exercise 8: Currying**

Convert the following function into a curried function:

```typescript
function multiply(a: number, b: number): number {
    return a * b;
}
```

Expected usage:

```typescript
multiply(10)(20);
```

**Exercise 9: Partial Application**

Create a function that calculates an employee's salary after adding bonuses.

Create another function with a fixed bonus percentage.

**Exercise 10: Implement Array Methods**

Implement your own versions of:

- `map()`
- `filter()`
- `reduce()`

Use generics wherever appropriate.

## Advanced Level

**Exercise 11: Result Type**

Create a user validation function that returns:

- Success with user data.
- Failure with validation errors.

Use TypeScript discriminated unions.

**Exercise 12: Memoization**

Implement a generic memoization utility for a function with a single string or number argument.

**Exercise 13: Lazy Evaluation**

Create a generator that produces even numbers indefinitely.

**Exercise 14: Functional Shopping Cart**

Build a shopping cart with:

- Add product.
- Remove product.
- Update quantity.
- Calculate subtotal.
- Apply discount.
- Calculate final amount.

Keep the business logic pure.

**Exercise 15: Refactor an Imperative Program**

Take a program that calculates order totals using loops and mutable variables.

Refactor it using:

- Pure functions.
- `map()`.
- `filter()`.
- `reduce()`.
- Immutable updates.

---

# 32. Phase 32 Completion Checklist

Before moving forward, make sure you can explain and implement the following:

| No. | Topic | Status |
|---:|---|---|
| 1 | Functional Programming | ☐ |
| 2 | FP vs OOP | ☐ |
| 3 | First-Class Functions | ☐ |
| 4 | Higher-Order Functions | ☐ |
| 5 | Pure Functions | ☐ |
| 6 | Impure Functions | ☐ |
| 7 | Side Effects | ☐ |
| 8 | Referential Transparency | ☐ |
| 9 | Immutability | ☐ |
| 10 | Mutable vs Immutable Data | ☐ |
| 11 | Shallow Copy vs Deep Copy | ☐ |
| 12 | Object.freeze() | ☐ |
| 13 | Object.seal() | ☐ |
| 14 | Object.assign() | ☐ |
| 15 | Spread and Rest Operators | ☐ |
| 16 | Function Composition | ☐ |
| 17 | compose() and pipe() | ☐ |
| 18 | Currying | ☐ |
| 19 | Partial Application | ☐ |
| 20 | Closures | ☐ |
| 21 | map() | ☐ |
| 22 | filter() | ☐ |
| 23 | reduce() | ☐ |
| 24 | flatMap() | ☐ |
| 25 | Declarative vs Imperative Programming | ☐ |
| 26 | Recursion | ☐ |
| 27 | Memoization | ☐ |
| 28 | Lazy Evaluation | ☐ |
| 29 | Functional Error Handling | ☐ |
| 30 | Result and Option Types | ☐ |
| 31 | Functional Programming with TypeScript | ☐ |
| 32 | Practical Functional Programming Patterns | ☐ |

---

# 33. What Comes Next?

In the next phase, we will explore advanced TypeScript features that allow you to build powerful type-safe abstractions.

**Phase 33: Advanced TypeScript – Type-Level Programming, Conditional Types, Mapped Types, Template Literal Types, and Recursive Types**

Topics will include:

1. What Is Type-Level Programming?
2. Type System vs Runtime System.
3. `keyof` Operator.
4. `typeof` Operator in TypeScript.
5. Indexed Access Types.
6. Conditional Types.
7. `infer` Keyword.
8. Mapped Types.
9. Key Remapping with `as`.
10. Template Literal Types.
11. Recursive Types.
12. Distributive Conditional Types.
13. Utility Types Internals.
14. Building Custom Utility Types.
15. Advanced Generic Constraints.
16. Type-Level Function Patterns.
17. Practical Advanced TypeScript Examples.

**Phase 32 is complete.** When you're ready, say **"OK, Phase 33"** to continue.