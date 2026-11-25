# Phase 31: TypeScript and JavaScript Internals – Runtime Behavior, Memory Management, Execution Context, Event Loop, and Type Erasure

**Level:** Advanced  
**Category:** JavaScript Internals & TypeScript Runtime  
**Prerequisites:** JavaScript fundamentals, TypeScript fundamentals, asynchronous JavaScript, Node.js, and TypeScript compiler configuration.

## Learning Objectives

By the end of this phase, you will understand:

1. How TypeScript works at runtime.
2. TypeScript vs JavaScript at runtime.
3. Type Erasure.
4. Compile-Time vs Runtime.
5. JavaScript execution context.
6. Global Execution Context.
7. Function Execution Context.
8. Call Stack.
9. Memory Heap.
10. Stack vs Heap Memory.
11. JavaScript memory management.
12. Garbage Collection.
13. Mark-and-Sweep Algorithm.
14. Memory Leaks.
15. Closures and memory.
16. JavaScript Event Loop.
17. Call Stack vs Task Queue.
18. Microtask Queue.
19. Macrotask Queue.
20. Promises and Async/Await internals.
21. How TypeScript handles generics at runtime.
22. Interfaces vs Classes at runtime.
23. `typeof`, `instanceof`, and Type Guards.
24. Runtime Validation vs Static Types.
25. JavaScript prototypes and TypeScript classes.
26. Advanced runtime debugging.

---

# PART 1: TYPESCRIPT VS JAVASCRIPT AT RUNTIME

## 1. What Happens When TypeScript Code Runs?

First, understand one important concept:

**TypeScript is primarily a compile-time technology, while JavaScript is the runtime language.**

JavaScript engines such as V8 execute JavaScript.

They do not ordinarily execute TypeScript-specific syntax directly.

Consider this TypeScript code:

```typescript
interface User {
  id: number;
  name: string;
}

function greet(user: User): string {
  return `Hello ${user.name}`;
}

const user: User = {
  id: 1,
  name: "Riyaz"
};

console.log(greet(user));
```

TypeScript checks:

- Whether `user` has the required properties.
- Whether `id` is a number.
- Whether `name` is a string.
- Whether the function returns a string.

After compilation, the JavaScript may look like:

```javascript
function greet(user) {
  return `Hello ${user.name}`;
}

const user = {
  id: 1,
  name: "Riyaz"
};

console.log(greet(user));
```

Notice that the following disappeared:

```typescript
interface User {}
```

And:

```typescript
user: User
```

And:

```typescript
: string
```

The JavaScript runtime receives ordinary JavaScript code.

### Compilation Flow

```text
       TypeScript Code
              |
              v
       TypeScript Compiler
              |
              v
       Type Checking
              |
              v
       TypeScript Syntax
          Transformation
              |
              v
       Generated JavaScript
              |
              v
       JavaScript Engine
              |
              v
          Execution
```

### Important

TypeScript does not normally provide runtime type enforcement.

For example:

```typescript
function add(a: number, b: number): number {
  return a + b;
}

console.log(add("10" as any, 20));
```

TypeScript allows this because of `any`.

At runtime:

```javascript
console.log("10" + 20);
```

Output:

```text
1020
```

JavaScript performs string concatenation.

The TypeScript type annotation does not protect the function at runtime.

---

## 2. What Is Type Erasure?

Type Erasure means removing TypeScript-only type information during compilation.

TypeScript types are primarily used during development and compilation.

They generally do not exist in the generated JavaScript.

### Example 1: Type Annotation

TypeScript:

```typescript
let age: number = 25;
```

JavaScript:

```javascript
let age = 25;
```

The type annotation disappears.

### Example 2: Interface

TypeScript:

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
}
```

JavaScript:

```javascript
// No corresponding runtime code.
```

### Example 3: Type Alias

TypeScript:

```typescript
type Status = "pending" | "completed" | "cancelled";
```

JavaScript:

```javascript
// No corresponding runtime code.
```

### Example 4: Generic

TypeScript:

```typescript
function identity<T>(value: T): T {
  return value;
}

identity<number>(100);
```

JavaScript:

```javascript
function identity(value) {
  return value;
}

identity(100);
```

The generic type parameter `T` disappears.

### Example 5: Union Type

TypeScript:

```typescript
function printValue(value: string | number): void {
  console.log(value);
}
```

JavaScript:

```javascript
function printValue(value) {
  console.log(value);
}
```

The union type disappears.

### What Does Not Disappear?

JavaScript runtime constructs remain.

For example:

```typescript
class User {
  constructor(public name: string) {}

  greet() {
    console.log(`Hello ${this.name}`);
  }
}
```

JavaScript output:

```javascript
class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(`Hello ${this.name}`);
  }
}
```

The class remains because JavaScript supports classes at runtime.

### Comparison

| TypeScript Construct | Runtime Presence |
|---|---|
| Interface | Removed |
| Type alias | Removed |
| Type annotation | Removed |
| Generic type parameter | Removed |
| Union type | Removed |
| Intersection type | Removed |
| Type assertion | Removed |
| Class | Remains |
| Object | Remains |
| Function | Remains |
| JavaScript variable | Remains |
| JavaScript array | Remains |
| JavaScript Promise | Remains |
| JavaScript enum | Generally generates runtime code |

**Important exception:** `const enum` is generally inlined and erased when compiled by TypeScript under the relevant settings. Other enum configurations can produce JavaScript runtime objects.

---

## 3. What Is Compile-Time?

Compile-time is the stage when TypeScript analyzes your source code before runtime execution.

During this stage, TypeScript can:

- Check types.
- Detect invalid assignments.
- Check function arguments.
- Validate property access.
- Check generic constraints.
- Check interfaces.
- Generate JavaScript when configured to emit.

Example:

```typescript
let age: number = 25;

age = "Twenty-five";
```

TypeScript reports:

```text
Type 'string' is not assignable to type 'number'.
```

This is a compile-time error.

The JavaScript runtime has not executed the assignment.

### More Examples

```typescript
interface User {
  name: string;
}

const user: User = {
  name: "Riyaz",
  age: 25
};
```

TypeScript reports an error because `age` is not declared in the interface when assigning this object literal directly.

Another example:

```typescript
function multiply(a: number, b: number): number {
  return a * b;
}

multiply(10, "20");
```

TypeScript reports an error because the second argument is a string.

---

## 4. What Is Runtime?

Runtime is the period when your JavaScript application is actually executing.

For Node.js:

```bash
node app.js
```

For a browser application, JavaScript runs inside the browser's JavaScript engine.

At runtime, JavaScript handles:

- Variable assignments.
- Function calls.
- Object creation.
- Memory allocation.
- Promise execution.
- Timers.
- Event handling.
- Network operations.
- DOM operations in browsers.

### Compile-Time vs Runtime

| Compile-Time | Runtime |
|---|---|
| Happens before execution. | Happens during execution. |
| TypeScript checks types. | JavaScript executes instructions. |
| Detects many type errors. | Produces runtime behavior. |
| Interfaces are available to the type checker. | Interfaces are not available as JavaScript runtime objects. |
| Generic types are checked. | Generic parameters are erased. |
| Uses the TypeScript compiler. | Uses a JavaScript runtime. |

### Example: Compile-Time Error vs Runtime Error

Compile-time:

```typescript
const age: number = "25";
```

Runtime:

```typescript
const user = null;

console.log(user.name);
```

The second example produces a runtime error because JavaScript attempts to access a property on `null`.

---

# PART 2: JAVASCRIPT EXECUTION CONTEXT

## 5. What Is an Execution Context?

An Execution Context is the environment in which JavaScript code is evaluated and executed.

Whenever JavaScript executes code, it does so within an execution context.

An execution context manages information such as:

- Variables.
- Function declarations.
- Scope information.
- The value of `this`.
- References to outer environments.

### Types of Execution Context

There are three commonly discussed categories:

1. Global Execution Context.
2. Function Execution Context.
3. Eval Execution Context.

The `eval` execution context is associated with code executed through `eval()`.

In normal application development, you will mostly deal with global and function execution contexts.

---

## 6. Global Execution Context

The Global Execution Context is created when JavaScript starts executing a script or module.

Example:

```javascript
const username = "Riyaz";

function greet() {
  console.log("Hello");
}

console.log(username);
greet();
```

The global code is evaluated within the global execution context.

### Responsibilities

It provides the environment for:

- Top-level declarations.
- Global scope.
- Global `this` behavior.
- Global object access.

### Global Object

In browsers:

```javascript
window
```

In Node.js:

```javascript
global
```

In both environments, JavaScript also provides:

```javascript
globalThis
```

`globalThis` is the standard cross-environment way to access the global object.

### Important: Script vs Module

Top-level declarations behave differently depending on whether code is running as a classic script or an ES Module.

For example, in a browser classic script:

```javascript
var username = "Riyaz";
```

may create a property on `window`.

But a top-level `let` or `const` does not create a corresponding `window` property.

ES Modules also have their own module scope.

Therefore, do not assume every top-level variable is automatically a global object property.

---

## 7. Function Execution Context

Whenever a function is called, JavaScript creates a function execution context for that invocation.

Example:

```javascript
function greet(name) {
  const message = `Hello ${name}`;

  console.log(message);
}

greet("Riyaz");
```

When `greet()` is called, a new function execution context is created.

It manages:

- Function parameters.
- Local variables.
- Function execution state.
- Scope information.
- The value of `this`.

### Example with Multiple Calls

```javascript
function add(a, b) {
  const result = a + b;

  return result;
}

const first = add(10, 20);

const second = add(30, 40);
```

Conceptually:

```text
Global Execution Context
          |
          |
      add(10, 20)
          |
          v
   Function Context 1
          |
       Returns
          |
          v
      add(30, 40)
          |
          v
   Function Context 2
          |
       Returns
          |
          v
    Global Context
```

Each function invocation has its own local execution environment.

---

## 8. Creation Phase and Execution Phase

A useful conceptual model divides execution-context setup into two phases.

1. Creation phase.
2. Execution phase.

### Creation Phase

JavaScript establishes the execution environment.

It prepares:

- Scope information.
- Variable bindings.
- Function declarations.
- `this` binding.
- Other execution state.

### Execution Phase

JavaScript executes the statements.

Example:

```javascript
console.log(username);

var username = "Riyaz";

greet();

function greet() {
  console.log("Hello");
}
```

Output:

```text
undefined
Hello
```

Why?

Because `var` declarations are initialized with `undefined` during environment setup, while the function declaration is available before its textual position is executed.

This behavior is commonly explained using hoisting.

### Important

`let` and `const` are also registered during environment setup, but they remain uninitialized until their declaration is evaluated.

This period is called the Temporal Dead Zone (TDZ).

Example:

```javascript
console.log(age);

let age = 25;
```

Result:

```text
ReferenceError
```

---

# PART 3: CALL STACK

## 9. What Is the Call Stack?

The Call Stack is a Last-In, First-Out (LIFO) data structure used by JavaScript to track function execution.

Whenever a function is called, its execution is tracked on the call stack.

When it returns, its execution frame is removed.

### Example

```javascript
function first() {
  console.log("First");
  second();
}

function second() {
  console.log("Second");
  third();
}

function third() {
  console.log("Third");
}

first();
```

Output:

```text
First
Second
Third
```

### Call Stack Visualization

When `first()` executes:

```text
|             |
|             |
|  first()    |
|-------------|
```

When `second()` is called:

```text
|             |
|  second()   |
|-------------|
|  first()    |
|-------------|
```

When `third()` is called:

```text
|  third()    |
|-------------|
|  second()   |
|-------------|
|  first()    |
|-------------|
```

After `third()` returns:

```text
|             |
|  second()   |
|-------------|
|  first()    |
|-------------|
```

The process continues until all functions return.

### Important

JavaScript commonly executes application code on a single main thread per JavaScript agent.

The call stack tracks synchronous execution.

Asynchronous operations are coordinated through the runtime and event loop rather than by keeping the JavaScript call stack occupied while waiting for every operation.

---

## 10. Stack Overflow

A stack overflow occurs when the call stack exceeds its available capacity.

A common cause is uncontrolled recursion.

Example:

```javascript
function run() {
  run();
}

run();
```

The function continuously calls itself.

Every call creates another execution frame.

Eventually, JavaScript throws an error similar to:

```text
RangeError: Maximum call stack size exceeded
```

### Correct Recursion

```javascript
function countdown(number) {
  if (number <= 0) {
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
```

The base condition prevents infinite recursion.

### Practical Example

```javascript
function factorial(number) {
  if (number <= 1) {
    return 1;
  }

  return number * factorial(number - 1);
}

console.log(factorial(5));
```

Output:

```text
120
```

---

# PART 4: MEMORY MANAGEMENT

## 11. How JavaScript Manages Memory

JavaScript automatically manages memory.

You generally do not manually allocate and free memory as you would in languages such as C.

The JavaScript engine handles:

1. Memory allocation.
2. Memory usage.
3. Garbage collection.
4. Memory reclamation.

### Basic Memory Lifecycle

```text
       Memory Allocation
               |
               v
        Memory Usage
               |
               v
      Object Becomes Unused
               |
               v
       Garbage Collection
               |
               v
       Memory Reclamation
```

### Example

```javascript
const user = {
  name: "Riyaz",
  age: 25
};
```

When this object is created, the JavaScript engine allocates memory for the object and its data.

The variable `user` provides a reference to that object.

As long as the object remains reachable, the garbage collector must preserve it.

---

## 12. Stack Memory vs Heap Memory

JavaScript engines use memory structures and strategies that are more sophisticated than a simple stack-versus-heap model.

However, the stack and heap distinction is useful for understanding execution and memory behavior.

### Stack

The call stack tracks active function execution.

It contains execution-related information such as:

- Function call frames.
- Local bindings.
- Parameters.
- Return locations.
- Other engine-specific execution data.

### Heap

The heap is commonly used for dynamically allocated objects and other data.

Examples include:

- Objects.
- Arrays.
- Functions.
- Many other dynamically allocated values.

### Example

```javascript
const age = 25;

const user = {
  name: "Riyaz",
  age: 25
};
```

Conceptually:

```text
Execution-Related Storage
-------------------------
age = 25
user = reference
-------------------------

Heap
-------------------------
{
  name: "Riyaz",
  age: 25
}
-------------------------
```

### Comparison

| Stack | Heap |
|---|---|
| Tracks active execution. | Stores dynamically allocated data. |
| Used for call frames. | Used for objects and other allocated values. |
| Managed by execution flow. | Managed by the garbage collector and engine. |
| Function returns remove its frame. | Objects remain while reachable. |

### Important

Do not assume every primitive is always physically stored on the stack or every object is always physically stored on the heap.

These are useful conceptual models, not guaranteed implementation details.

JavaScript engines can optimize storage internally.

---

## 13. Primitive Values vs Reference Values

JavaScript has primitive types and objects.

### Primitive Types

JavaScript primitive types are:

1. String.
2. Number.
3. BigInt.
4. Boolean.
5. Undefined.
6. Symbol.
7. Null.

Primitive values are immutable.

Example:

```javascript
let age = 25;

let anotherAge = age;

anotherAge = 30;

console.log(age);
console.log(anotherAge);
```

Output:

```text
25
30
```

The assignment copies the primitive value.

### Objects

Objects are reference values.

Example:

```javascript
const user1 = {
  name: "Riyaz"
};

const user2 = user1;

user2.name = "Ahmed";

console.log(user1.name);
```

Output:

```text
Ahmed
```

Why?

Because both variables refer to the same object.

Conceptually:

```text
user1 --------\
               \
                ---> { name: "Ahmed" }
               /
user2 --------/
```

### Important

JavaScript passes all arguments by value.

When the value being copied is an object reference, the copied value refers to the same object.

This is often described as **pass-by-value of the reference**.

Example:

```javascript
function updateUser(user) {
  user.name = "Ahmed";
}

const user = {
  name: "Riyaz"
};

updateUser(user);

console.log(user.name);
```

Output:

```text
Ahmed
```

However, reassigning the parameter does not reassign the caller's variable.

```javascript
function replaceUser(user) {
  user = {
    name: "Ahmed"
  };
}

const user = {
  name: "Riyaz"
};

replaceUser(user);

console.log(user.name);
```

Output:

```text
Riyaz
```

The parameter receives a copy of the reference. Reassigning that local parameter does not change the original variable.

---

# PART 5: GARBAGE COLLECTION

## 14. What Is Garbage Collection?

Garbage Collection (GC) is the automatic process of identifying and reclaiming memory that is no longer needed.

JavaScript engines perform garbage collection automatically.

You do not normally need to manually free objects.

### Example

```javascript
let user = {
  name: "Riyaz"
};

user = null;
```

Initially:

```text
user ------> { name: "Riyaz" }
```

After reassignment:

```text
user ------> null

{ name: "Riyaz" }  (no longer referenced here)
```

If no other reachable references exist, the object becomes eligible for garbage collection.

### Important

Be precise:

**An object becoming unreachable makes it eligible for garbage collection.**

It does not guarantee immediate collection.

The engine decides when to perform garbage collection.

---

## 15. Mark-and-Sweep Algorithm

Mark-and-Sweep is a common garbage collection strategy.

It conceptually works in two main phases.

### Phase 1: Mark

The garbage collector starts from roots, such as:

- Global references.
- Active execution contexts.
- Other engine-managed roots.

It identifies reachable objects.

### Phase 2: Sweep

Objects that are not marked as reachable can be reclaimed.

### Example

```javascript
const user = {
  name: "Riyaz"
};

let product = {
  name: "Laptop"
};

product = null;
```

Conceptually:

```text
              Roots
                |
                v
              user
                |
                v
        { name: "Riyaz" }


        { name: "Laptop" }
             No reachable
              reference
```

The user object remains reachable.

The product object may be reclaimed.

### Why Mark-and-Sweep Is Better Than Simple Reference Counting

Consider two objects referencing each other:

```javascript
let objectA = {};
let objectB = {};

objectA.other = objectB;
objectB.other = objectA;

objectA = null;
objectB = null;
```

The objects reference each other.

A simple reference-counting algorithm might fail to reclaim them because their reference counts remain nonzero.

A tracing garbage collector can identify that neither object is reachable from the roots and reclaim the cycle.

### Important

Modern JavaScript engines use sophisticated garbage collectors with techniques beyond a simple Mark-and-Sweep implementation.

Mark-and-Sweep is a foundational concept, not a complete description of every engine's current GC implementation.

---

## 16. What Is a Memory Leak?

A memory leak occurs when memory that is no longer useful remains reachable and therefore cannot be reclaimed.

A memory leak can cause:

- Increasing memory consumption.
- Slower application performance.
- Increased garbage collection activity.
- Application instability.
- Process termination in severe cases.

### Example 1: Accidental Global Reference

```javascript
function processData() {
  leakedData = new Array(1000000).fill("data");
}

processData();
```

In non-strict scripts, assigning to an undeclared variable may create a global property.

In strict mode and ES Modules, this assignment throws a `ReferenceError` instead.

Better:

```javascript
function processData() {
  const data = new Array(1000000).fill("data");

  return data.length;
}

processData();
```

Now the local array can become unreachable after the function returns, provided nothing else retains it.

### Example 2: Unremoved Event Listener

```javascript
const button = document.querySelector("button");

function handleClick() {
  console.log("Clicked");
}

button.addEventListener("click", handleClick);
```

Suppose you repeatedly create and destroy UI components but never remove their event listeners.

References may remain longer than expected.

Correct cleanup:

```javascript
button.removeEventListener("click", handleClick);
```

### Example 3: Uncontrolled Cache

```javascript
const cache = new Map();

function saveData(id, data) {
  cache.set(id, data);
}
```

If entries are added indefinitely and never removed, memory usage can continue increasing.

Possible solution:

```javascript
function removeData(id) {
  cache.delete(id);
}
```

Or use a cache with a maximum size or expiration policy.

---

# PART 6: CLOSURES AND MEMORY

## 17. What Is a Closure?

A closure is created when a function retains access to variables from its surrounding lexical environment, even after that outer function has finished executing.

Example:

```javascript
function outer() {
  const message = "Hello";

  function inner() {
    console.log(message);
  }

  return inner;
}

const greet = outer();

greet();
```

Output:

```text
Hello
```

Why?

Because `inner()` retains access to the lexical environment in which it was created.

Even though `outer()` has returned, the required binding remains available.

### Visualization

```text
outer()
   |
   | Creates message
   |
   | Creates inner()
   |
   | Returns inner
   v

greet = inner()

   |
   v

inner() accesses message
```

### Important

A closure does not necessarily keep every local variable from an outer function alive.

The JavaScript engine can optimize which bindings need to remain accessible.

---

## 18. Practical Uses of Closures

### A. Data Privacy

```javascript
function createBankAccount(initialBalance) {
  let balance = initialBalance;

  return {
    deposit(amount) {
      balance += amount;
    },

    withdraw(amount) {
      balance -= amount;
    },

    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount(1000);

account.deposit(500);

console.log(account.getBalance());
```

Output:

```text
1500
```

The `balance` variable cannot be accessed directly from outside the returned object.

It is accessible through the returned methods.

### B. Function Factory

```javascript
function multiplyBy(number) {
  return function (value) {
    return value * number;
  };
}

const double = multiplyBy(2);

console.log(double(10));
```

Output:

```text
20
```

### C. Event Handlers

Closures are commonly used in callbacks and event handlers.

```javascript
function createCounter() {
  let count = 0;

  return function () {
    count++;

    console.log(count);
  };
}

const counter = createCounter();

counter();
counter();
counter();
```

Output:

```text
1
2
3
```

---

## 19. Closures and Memory Leaks

Closures can keep data reachable longer than intended.

Example:

```javascript
function createHandler() {
  const largeData = new Array(1000000).fill("data");

  return function handleClick() {
    console.log(largeData.length);
  };
}

const handler = createHandler();
```

The returned function needs `largeData`, so the relevant data remains reachable.

This is not automatically a memory leak.

It becomes a problem if the handler is retained indefinitely when it is no longer needed.

### Best Practices

- Remove event listeners when components are destroyed.
- Avoid unnecessary long-lived closures.
- Release references to unused data.
- Keep caches bounded.
- Clean up timers and subscriptions.

---

# PART 7: JAVASCRIPT EVENT LOOP

## 20. What Is the Event Loop?

JavaScript uses an event loop to coordinate synchronous execution with asynchronous operations.

The event loop allows JavaScript to handle tasks such as:

- Timers.
- Network operations.
- Promise callbacks.
- User interactions.
- I/O operations.

### Main Components

```text
          JavaScript Runtime
                  |
          -------------------
          |                 |
          v                 v
       Call Stack       Runtime APIs
          |                 |
          |                 v
          |           Async Operations
          |                 |
          |                 v
          |          Task Scheduling
          |                 |
          |       ---------------------
          |       |                   |
          |       v                   v
          |   Microtask Queue    Task Queue
          |       |                   |
          --------|-------------------|
                  |
                  v
              Event Loop
```

This is a simplified conceptual model.

The exact event-loop architecture differs between browsers and Node.js.

---

## 21. Synchronous vs Asynchronous JavaScript

### Synchronous Code

Synchronous code executes sequentially.

Example:

```javascript
console.log("First");

console.log("Second");

console.log("Third");
```

Output:

```text
First
Second
Third
```

Each statement executes before the next one.

### Asynchronous Code

Asynchronous operations allow the program to continue while waiting for an operation to complete.

Example:

```javascript
console.log("First");

setTimeout(() => {
  console.log("Second");
}, 1000);

console.log("Third");
```

Output:

```text
First
Third
Second
```

Why?

1. `First` executes.
2. `setTimeout` registers a timer.
3. JavaScript continues.
4. `Third` executes.
5. After the timer becomes eligible, its callback is scheduled.
6. The event loop eventually executes the callback when the call stack is available.

### Important

`setTimeout(callback, 1000)` does not guarantee that the callback runs exactly after one second.

It means the callback becomes eligible to run after at least the specified delay, subject to runtime scheduling and other work.

---

## 22. What Is the Task Queue?

The Task Queue is commonly used to describe a queue of callbacks waiting for execution.

It is also frequently called the Macrotask Queue in educational explanations.

Examples of tasks include:

- Timer callbacks.
- Some browser event callbacks.
- Some I/O callbacks.

### Example

```javascript
console.log("Start");

setTimeout(() => {
  console.log("Timer");
}, 0);

console.log("End");
```

Output:

```text
Start
End
Timer
```

Even though the timer delay is zero, the callback does not interrupt the current synchronous execution.

---

## 23. What Is the Microtask Queue?

The Microtask Queue holds higher-priority scheduled work that is processed at specific points in the event loop.

Common microtasks include:

- Promise `.then()` callbacks.
- Promise `.catch()` callbacks.
- Promise `.finally()` callbacks.
- `queueMicrotask()` callbacks.
- MutationObserver callbacks in browsers.

### Example

```javascript
console.log("Start");

Promise.resolve().then(() => {
  console.log("Promise");
});

console.log("End");
```

Output:

```text
Start
End
Promise
```

The Promise callback runs after the current synchronous execution finishes.

---

## 24. Microtask Queue vs Task Queue

Example:

```javascript
console.log("Start");

setTimeout(() => {
  console.log("Timer");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise");
});

console.log("End");
```

Output:

```text
Start
End
Promise
Timer
```

### Why?

Step-by-step:

**Step 1**

```javascript
console.log("Start");
```

Output:

```text
Start
```

**Step 2**

```javascript
setTimeout(() => {
  console.log("Timer");
}, 0);
```

A timer callback is scheduled.

**Step 3**

```javascript
Promise.resolve().then(() => {
  console.log("Promise");
});
```

A Promise reaction is scheduled as a microtask.

**Step 4**

```javascript
console.log("End");
```

Output:

```text
End
```

**Step 5**

The current synchronous execution finishes.

The microtask queue is processed.

Output:

```text
Promise
```

**Step 6**

The event loop proceeds to an eligible task.

Output:

```text
Timer
```

### Comparison

| Microtask Queue | Task Queue |
|---|---|
| Holds microtasks. | Holds scheduled tasks. |
| Promise reactions are common examples. | Timer callbacks are common examples. |
| Processed at microtask checkpoints. | Processed according to event-loop scheduling. |
| Usually processed before the next task is selected. | Tasks run in event-loop task selection order. |

### Important

Do not assume that every asynchronous API uses the same queue.

Different APIs follow different scheduling rules.

---

## 25. What Is queueMicrotask()?

`queueMicrotask()` schedules a callback as a microtask.

Example:

```javascript
console.log("Start");

queueMicrotask(() => {
  console.log("Microtask");
});

console.log("End");
```

Output:

```text
Start
End
Microtask
```

It is useful when you want to schedule work after the current synchronous execution without creating a Promise.

---

# PART 8: PROMISES AND ASYNC/AWAIT INTERNALS

## 26. What Is a Promise?

A Promise represents the eventual completion or failure of an asynchronous operation.

A Promise has three states:

1. Pending.
2. Fulfilled.
3. Rejected.

### Promise Lifecycle

```text
       Pending
          |
      -----------
      |         |
      v         v
  Fulfilled  Rejected
```

Once a Promise is fulfilled or rejected, it is settled.

A settled Promise does not change to another state.

### Example

```javascript
const promise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve("Operation successful");
  } else {
    reject(new Error("Operation failed"));
  }
});

promise
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
```

Output:

```text
Operation successful
```

---

## 27. How Promise Callbacks Are Scheduled

Consider:

```javascript
console.log("A");

Promise.resolve().then(() => {
  console.log("B");
});

console.log("C");
```

Output:

```text
A
C
B
```

The `.then()` callback is scheduled as a microtask.

It does not execute immediately when `.then()` is called.

### Important

The Promise executor function itself executes synchronously when the Promise is constructed.

Example:

```javascript
console.log("Start");

const promise = new Promise((resolve) => {
  console.log("Executor");

  resolve("Done");
});

promise.then((result) => {
  console.log(result);
});

console.log("End");
```

Output:

```text
Start
Executor
End
Done
```

The executor runs synchronously.

The `.then()` callback runs as a microtask.

---

## 28. What Is Async/Await?

`async` and `await` provide syntax for working with Promises.

### Example

```javascript
async function getUser() {
  return "Riyaz";
}

getUser().then((user) => {
  console.log(user);
});
```

Output:

```text
Riyaz
```

An `async` function always returns a Promise.

Even if you return a normal value, JavaScript wraps the result in a fulfilled Promise.

### Example with Await

```javascript
async function fetchData() {
  console.log("First");

  const result = await Promise.resolve("Data");

  console.log(result);

  console.log("Last");
}

fetchData();

console.log("Outside");
```

Output:

```text
First
Outside
Data
Last
```

### Why?

1. `fetchData()` starts executing.
2. `First` is printed.
3. `await` suspends the async function's continuation.
4. Control returns to the surrounding code.
5. `Outside` is printed.
6. The Promise continuation is scheduled.
7. `Data` and `Last` are printed.

### Important

`await` does not block the JavaScript thread.

It suspends the execution of the current async function until the awaited Promise settles.

Other JavaScript work can continue.

---

## 29. Async/Await Error Handling

Use `try...catch` to handle rejected Promises.

```javascript
async function getUser() {
  try {
    const response = await fetch(
      "https://example.com/api/users"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }

    throw error;
  }
}
```

### Important

`fetch()` does not reject merely because the server responds with an HTTP error status such as 404 or 500.

You should inspect:

```javascript
response.ok
```

and handle unsuccessful HTTP responses explicitly.

---

# PART 9: EVENT LOOP IN NODE.JS

## 30. How Node.js Handles Asynchronous Operations

Node.js uses:

- V8 JavaScript engine.
- Node.js runtime APIs.
- libuv.
- Event-loop phases.
- Operating-system facilities.
- A thread pool for certain operations.

Node.js is not simply a browser event loop running outside the browser.

It has its own event-loop implementation and scheduling behavior.

### Simplified Architecture

```text
             Node.js Application
                     |
                     v
               JavaScript Code
                     |
                     v
                V8 Engine
                     |
                     v
              Node.js Runtime
                     |
                     v
                   libuv
                     |
          -----------------------
          |                     |
          v                     v
      Event Loop            Thread Pool
          |                     |
          v                     v
     Callback Scheduling   Certain Operations
```

### What Is libuv?

libuv is a cross-platform library used by Node.js for asynchronous I/O and event-loop functionality.

It provides:

- Event-loop implementation.
- Asynchronous I/O support.
- Thread-pool functionality.
- Timer handling.
- Platform abstraction.

---

## 31. Node.js Event Loop Phases

Node.js has several event-loop phases.

Important phases include:

1. Timers.
2. Pending callbacks.
3. Idle and prepare.
4. Poll.
5. Check.
6. Close callbacks.

### Simplified Flow

```text
        Timers
           |
           v
   Pending Callbacks
           |
           v
      Idle/Prepare
           |
           v
         Poll
           |
           v
         Check
           |
           v
     Close Callbacks
           |
           v
      Next Iteration
```

### 1. Timers

Executes eligible timer callbacks registered through APIs such as:

```javascript
setTimeout()
setInterval()
```

### 2. Pending Callbacks

Executes certain system-level callbacks deferred from previous operations.

### 3. Idle and Prepare

Internal phases used by Node.js and libuv.

### 4. Poll

Handles many I/O-related callbacks.

It can also wait for I/O events when appropriate.

### 5. Check

Executes callbacks registered using:

```javascript
setImmediate()
```

### 6. Close Callbacks

Handles certain close-related callbacks.

Example:

```javascript
socket.on("close", () => {
  console.log("Socket closed");
});
```

### Important

The precise scheduling behavior can depend on Node.js version and context.

For example, timer scheduling details changed with the libuv update in Node.js 20.

Avoid memorizing simplified diagrams as if they describe every possible callback ordering.

---

## 32. process.nextTick() vs Promise Microtasks

Node.js provides:

```javascript
process.nextTick()
```

This schedules a callback in Node.js's next-tick queue.

Example:

```javascript
console.log("Start");

process.nextTick(() => {
  console.log("Next Tick");
});

Promise.resolve().then(() => {
  console.log("Promise");
});

console.log("End");
```

A common Node.js output is:

```text
Start
End
Next Tick
Promise
```

### Comparison

| process.nextTick() | Promise.then() |
|---|---|
| Node.js-specific API. | Standard JavaScript Promise API. |
| Uses the next-tick queue. | Uses the microtask queue. |
| Often runs before Promise reactions at Node.js checkpoints. | Runs as a Promise microtask. |
| Can starve I/O if recursively scheduled. | Can also contribute to starvation if microtasks are continuously queued. |

### Important

Do not use `process.nextTick()` everywhere.

Excessive recursive scheduling can prevent the event loop from making progress on I/O.

---

## 33. setImmediate() vs setTimeout()

Both are Node.js timer-related APIs, but they behave differently.

### setTimeout()

```javascript
setTimeout(() => {
  console.log("Timeout");
}, 0);
```

Schedules a timer callback that becomes eligible after the specified delay.

### setImmediate()

```javascript
setImmediate(() => {
  console.log("Immediate");
});
```

Schedules a callback for the check phase.

### Example

```javascript
setTimeout(() => {
  console.log("Timeout");
}, 0);

setImmediate(() => {
  console.log("Immediate");
});
```

The order can vary depending on the context and timing.

Do not assume one always executes first.

However, when both are scheduled from inside an I/O callback, `setImmediate()` generally runs before a zero-delay timer callback in the next relevant event-loop iteration.

---

# PART 10: HOW TYPESCRIPT HANDLES GENERICS AT RUNTIME

## 34. Do Generics Exist at Runtime?

No. TypeScript generic type parameters are erased during compilation.

Example:

```typescript
function identity<T>(value: T): T {
  return value;
}

const result = identity<number>(100);
```

Generated JavaScript:

```javascript
function identity(value) {
  return value;
}

const result = identity(100);
```

The generic type `T` and `<number>` are removed.

### Another Example

```typescript
class Repository<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  getAll(): T[] {
    return this.items;
  }
}
```

JavaScript output is conceptually:

```javascript
class Repository {
  items = [];

  add(item) {
    this.items.push(item);
  }

  getAll() {
    return this.items;
  }
}
```

The class remains, but the generic parameter disappears.

### Why Does This Matter?

You cannot use a generic type parameter as a runtime constructor.

Incorrect:

```typescript
function createInstance<T>() {
  return new T();
}
```

TypeScript reports an error because `T` is a type parameter, not a runtime constructor value.

### Correct Approach

Pass a constructor value.

```typescript
function createInstance<T>(
  Constructor: new () => T
): T {
  return new Constructor();
}

class User {
  name = "Riyaz";
}

const user = createInstance(User);
```

Now the constructor exists at runtime.

---

## 35. How to Preserve Runtime Type Information

If you need runtime information, pass it explicitly.

Example:

```typescript
function printType<T>(
  value: T,
  typeName: string
): void {
  console.log(typeName);
  console.log(value);
}

printType<number>(100, "number");
```

Output:

```text
number
100
```

Here, `typeName` is an ordinary JavaScript string.

It remains available at runtime.

Another approach is to use constructor values:

```typescript
function createObject<T>(
  Constructor: new (...args: any[]) => T,
  ...args: any[]
): T {
  return new Constructor(...args);
}
```

However, avoid using `any` unnecessarily in production code. More precise constructor types can be used depending on the application.

---

# PART 11: INTERFACES VS CLASSES AT RUNTIME

## 36. Do Interfaces Exist at Runtime?

No.

Interfaces are removed during TypeScript compilation.

Example:

```typescript
interface User {
  name: string;
  age: number;
}
```

JavaScript:

```javascript
// No runtime interface.
```

You cannot do:

```typescript
const user = {
  name: "Riyaz",
  age: 25
};

// Invalid: User is only a type.
console.log(user instanceof User);
```

There is no runtime `User` constructor.

### Why?

An interface describes a type contract.

It does not create a JavaScript object or constructor.

---

## 37. Do Classes Exist at Runtime?

Yes.

A TypeScript class is generally transformed into JavaScript class syntax or equivalent JavaScript code.

Example:

```typescript
class User {
  constructor(public name: string) {}

  greet() {
    return `Hello ${this.name}`;
  }
}
```

JavaScript:

```javascript
class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello ${this.name}`;
  }
}
```

You can use:

```javascript
const user = new User("Riyaz");

console.log(user instanceof User);
```

Output:

```text
true
```

### Comparison

| Interface | Class |
|---|---|
| Compile-time type contract. | Runtime constructor and type contract. |
| Removed during compilation. | Generally remains in JavaScript. |
| Cannot create instances. | Can create instances. |
| Cannot be used with `instanceof`. | Can be used with `instanceof`. |
| Supports structural typing. | Supports structural typing in TypeScript, with runtime prototype behavior. |

### Important

TypeScript classes also have compile-time types.

A class declaration provides both a runtime value (the constructor) and a TypeScript type (the instance type).

---

# PART 12: TYPEOF, INSTANCEOF, AND TYPE GUARDS

## 38. What Is typeof?

`typeof` is a JavaScript runtime operator that returns a string describing the type category of a value.

Example:

```javascript
console.log(typeof "Hello");
console.log(typeof 100);
console.log(typeof true);
console.log(typeof undefined);
console.log(typeof {});
console.log(typeof function () {});
```

Output:

```text
string
number
boolean
undefined
object
function
```

### Important

There is a historical JavaScript behavior:

```javascript
typeof null
```

Output:

```text
object
```

This is a longstanding language quirk.

### TypeScript typeof

TypeScript also uses `typeof` in type positions.

Example:

```typescript
const user = {
  name: "Riyaz",
  age: 25
};

type User = typeof user;
```

Here:

- Runtime `typeof` returns a string.
- TypeScript type-query `typeof` extracts the static type of a value.

These are two different uses of the same keyword.

---

## 39. What Is instanceof?

`instanceof` checks whether an object's prototype chain contains the prototype of a specified constructor.

Example:

```typescript
class User {}

const user = new User();

console.log(user instanceof User);
```

Output:

```text
true
```

Another example:

```javascript
const date = new Date();

console.log(date instanceof Date);
```

Output:

```text
true
```

### Important

`instanceof` does not work with interfaces or type aliases because they do not exist at runtime.

Incorrect:

```typescript
interface User {
  name: string;
}

// user instanceof User
```

There is no runtime `User` constructor.

### Cross-Realm Consideration

`instanceof` can produce unexpected results when objects come from different JavaScript realms, such as different browser frames.

This happens because constructors and prototypes may be different objects in different realms.

---

## 40. What Are Type Guards?

Type Guards are conditions or functions that help TypeScript narrow a value to a more specific type.

There are several approaches.

### A. typeof Type Guard

```typescript
function printValue(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toFixed(2));
  }
}
```

TypeScript understands:

- Inside the first branch, `value` is a string.
- Inside the second branch, `value` is a number.

### B. instanceof Type Guard

```typescript
class Dog {
  bark() {
    console.log("Woof");
  }
}

class Cat {
  meow() {
    console.log("Meow");
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}
```

### C. in Operator Type Guard

```typescript
type Admin = {
  name: string;
  permissions: string[];
};

type Customer = {
  name: string;
  purchasedProducts: string[];
};

function handleUser(user: Admin | Customer) {
  if ("permissions" in user) {
    console.log(user.permissions);
  } else {
    console.log(user.purchasedProducts);
  }
}
```

### D. Custom Type Guard

A custom type guard uses a return type predicate.

```typescript
interface User {
  name: string;
  age: number;
}

function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "name" in value &&
    typeof value.name === "string" &&
    "age" in value &&
    typeof value.age === "number"
  );
}
```

Usage:

```typescript
const data: unknown = {
  name: "Riyaz",
  age: 25
};

if (isUser(data)) {
  console.log(data.name);
}
```

TypeScript now understands that `data` is a `User` inside the `if` block.

### Important

A type predicate does not automatically validate data.

The function body must perform the actual runtime checks.

You can write an incorrect type guard that lies to TypeScript:

```typescript
function isUser(value: unknown): value is User {
  return true;
}
```

TypeScript trusts the declared predicate.

Therefore, custom type guards must be implemented carefully.

---

# PART 13: RUNTIME VALIDATION VS STATIC TYPES

## 41. Why Do We Need Runtime Validation?

TypeScript protects code during development.

However, external data can come from:

- HTTP APIs.
- Database records.
- User input.
- JSON files.
- Third-party services.
- Environment variables.
- Message queues.

TypeScript cannot automatically guarantee that external data matches your declared type.

### Example: API Response

```typescript
interface User {
  id: number;
  name: string;
}

async function getUser(): Promise<User> {
  const response = await fetch("/api/user");

  return response.json();
}
```

This example is unsafe.

The API may return:

```json
{
  "id": "wrong-value",
  "name": null
}
```

TypeScript does not automatically validate the response.

### Better Approach

Use `unknown` and validate the data.

```typescript
async function getUser(): Promise<User> {
  const response = await fetch("/api/user");

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  const data: unknown = await response.json();

  if (!isUser(data)) {
    throw new Error("Invalid user response");
  }

  return data;
}
```

Now the returned data is validated at runtime.

---

## 42. Runtime Validation with Zod

Zod is a TypeScript-friendly schema validation library.

It allows you to define runtime schemas and infer TypeScript types from them.

### Install

```bash
npm install zod
```

### Define Schema

```typescript
import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email()
});
```

### Infer Type

```typescript
type User = z.infer<typeof UserSchema>;
```

Now the TypeScript type is inferred from the runtime schema.

### Validate Data

```typescript
const data: unknown = {
  id: 1,
  name: "Riyaz",
  email: "riyaz@example.com"
};

const result = UserSchema.safeParse(data);

if (result.success) {
  console.log(result.data.name);
} else {
  console.log(result.error.issues);
}
```

### What Happens?

Zod performs actual runtime validation.

If the data is valid:

```typescript
result.success === true
```

If invalid:

```typescript
result.success === false
```

### Static Type vs Runtime Schema

| TypeScript Interface | Zod Schema |
|---|---|
| Compile-time type contract. | Runtime validation schema. |
| Removed during compilation. | Remains executable JavaScript code. |
| Does not validate external data. | Validates external data. |
| No automatic parsing. | Can parse and validate values. |
| Used by TypeScript compiler. | Used by application code at runtime. |

### Professional Recommendation

Use TypeScript types for internal code correctness.

Use runtime validation for data entering your application from external boundaries.

This is particularly important for backend APIs, database input, and environment configuration.

---

# PART 14: JAVASCRIPT PROTOTYPES AND TYPESCRIPT CLASSES

## 43. What Is a Prototype?

JavaScript uses prototype-based inheritance.

Every ordinary object has an internal prototype link, which points to another object or `null`.

When JavaScript cannot find a property directly on an object, it may look up the prototype chain.

### Example

```javascript
const user = {
  name: "Riyaz"
};

console.log(user.toString());
```

You did not define `toString()` on `user`.

JavaScript finds it through the object's prototype chain.

### Prototype Chain

```text
user
  |
  v
Object.prototype
  |
  v
null
```

This mechanism is called prototype-chain lookup.

---

## 44. What Is a Constructor Function?

Before ES6 classes, constructor functions were commonly used to create objects with shared methods.

Example:

```javascript
function User(name) {
  this.name = name;
}

User.prototype.greet = function () {
  console.log(`Hello ${this.name}`);
};

const user1 = new User("Riyaz");

user1.greet();
```

Output:

```text
Hello Riyaz
```

The `greet` method is stored on `User.prototype`.

Instances share the same method through the prototype chain.

---

## 45. How Do JavaScript Classes Work?

JavaScript classes provide a cleaner syntax over prototype-based inheritance.

Example:

```javascript
class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(`Hello ${this.name}`);
  }
}

const user = new User("Riyaz");

user.greet();
```

The `greet()` method is placed on:

```javascript
User.prototype
```

You can verify:

```javascript
console.log(
  User.prototype.hasOwnProperty("greet")
);
```

Output:

```text
true
```

### Important

JavaScript classes are not a completely separate inheritance system from prototypes.

They use JavaScript's prototype-based object model.

---

## 46. TypeScript Classes and Prototypes

TypeScript classes follow JavaScript class behavior.

Example:

```typescript
class User {
  constructor(public name: string) {}

  greet(): void {
    console.log(`Hello ${this.name}`);
  }
}

const user = new User("Riyaz");
```

At runtime:

```javascript
class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(`Hello ${this.name}`);
  }
}
```

The prototype behavior remains the same.

### Inheritance Example

```typescript
class Animal {
  move(): void {
    console.log("Moving");
  }
}

class Dog extends Animal {
  bark(): void {
    console.log("Woof");
  }
}

const dog = new Dog();

dog.move();
dog.bark();
```

Prototype chain conceptually:

```text
dog
 |
 v
Dog.prototype
 |
 v
Animal.prototype
 |
 v
Object.prototype
 |
 v
null
```

The `dog` instance can access methods defined on its prototype and inherited prototypes.

---

# PART 15: THIS KEYWORD AND EXECUTION CONTEXT

## 47. What Is this?

`this` is a JavaScript keyword whose value depends on how a function is invoked, with special rules for arrow functions, classes, and modules.

It is not simply determined by where a normal function is written.

### Example 1: Object Method

```javascript
const user = {
  name: "Riyaz",

  greet() {
    console.log(this.name);
  }
};

user.greet();
```

Output:

```text
Riyaz
```

Here, `this` refers to the object used as the method receiver.

### Example 2: Standalone Function

```javascript
function greet() {
  console.log(this);
}

greet();
```

In strict mode, `this` is `undefined` for a normal function called without a receiver.

ES Modules execute in strict mode.

Classic non-strict scripts have different behavior.

### Example 3: Arrow Function

```javascript
const user = {
  name: "Riyaz",

  greet: () => {
    console.log(this.name);
  }
};

user.greet();
```

An arrow function does not create its own `this`.

It captures `this` lexically from the surrounding scope.

Therefore, it is generally not suitable as an object method when you expect `this` to refer to the object.

### Example 4: bind()

```javascript
function greet() {
  console.log(this.name);
}

const user = {
  name: "Riyaz"
};

const boundGreet = greet.bind(user);

boundGreet();
```

Output:

```text
Riyaz
```

`bind()` creates a function with a specified `this` value.

---

## 48. call(), apply(), and bind()

These methods control the `this` value of a normal function.

### call()

Invokes a function immediately with the specified `this` value and individual arguments.

```javascript
function greet(city) {
  console.log(this.name, city);
}

const user = {
  name: "Riyaz"
};

greet.call(user, "Ahmedabad");
```

### apply()

Similar to `call()`, but accepts arguments in an array-like value.

```javascript
greet.apply(user, ["Ahmedabad"]);
```

### bind()

Returns a new function with a bound `this` value.

```javascript
const newGreet = greet.bind(user, "Ahmedabad");

newGreet();
```

### Comparison

| Method | Executes Immediately? | Arguments |
|---|---|---|
| `call()` | Yes | Individual arguments |
| `apply()` | Yes | Array or array-like value |
| `bind()` | No | Returns a new function |

### Important

`call()`, `apply()`, and `bind()` cannot change the lexical `this` of an arrow function.

---

# PART 16: JAVASCRIPT MEMORY AND PERFORMANCE OPTIMIZATION

## 49. Common Causes of Performance Problems

Several JavaScript patterns can increase memory consumption or reduce performance.

### 1. Unbounded Arrays

```javascript
const logs = [];

function addLog(message) {
  logs.push(message);
}
```

If logs are never removed, memory consumption can increase continuously.

### 2. Large Unbounded Maps

```javascript
const cache = new Map();
```

If entries are stored indefinitely, the cache can grow without limits.

### 3. Unremoved Event Listeners

```javascript
window.addEventListener("resize", handleResize);
```

If the listener is no longer needed, remove it.

### 4. Uncleaned Timers

```javascript
const timer = setInterval(() => {
  console.log("Running");
}, 1000);
```

Stop the timer when it is no longer needed:

```javascript
clearInterval(timer);
```

### 5. Retained Closures

Avoid retaining large data through closures longer than necessary.

### 6. Large DOM Structures

In frontend applications, unnecessarily large DOM trees can increase memory usage and rendering costs.

---

## 50. WeakMap and WeakSet

JavaScript provides `WeakMap` and `WeakSet`.

They hold weak references to their object keys or values, allowing garbage collection when those objects are otherwise unreachable.

### WeakMap

```javascript
const metadata = new WeakMap();

let user = {
  name: "Riyaz"
};

metadata.set(user, {
  lastLogin: Date.now()
});

console.log(metadata.get(user));
```

If `user` becomes unreachable elsewhere, its WeakMap entry does not by itself keep the key object alive.

### WeakSet

```javascript
const processedUsers = new WeakSet();

let user = {
  name: "Riyaz"
};

processedUsers.add(user);

console.log(processedUsers.has(user));
```

### WeakMap vs Map

| Map | WeakMap |
|---|---|
| Keys can be any values. | Keys must be objects or non-registered symbols where supported. |
| Strongly retains object keys. | Weakly references object keys. |
| Iterable. | Not iterable. |
| Has `size`. | No `size` property. |
| Entries remain until removed or Map becomes unreachable. | Entries can disappear when keys become unreachable. |

### When to Use WeakMap?

Useful for:

- Private metadata associated with objects.
- Caching information associated with object lifetimes.
- Avoiding certain memory-retention problems.

### Important

WeakMap does not guarantee that memory will be reclaimed immediately.

You also cannot manually inspect its entries through iteration.

---

# PART 17: PRACTICAL EXECUTION-ORDER EXERCISES

## 51. Predict the Output – Exercise 1

```javascript
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

console.log("C");
```

**Answer:**

```text
A
C
B
```

Reason: Synchronous code executes before the timer callback.

---

## 52. Predict the Output – Exercise 2

```javascript
console.log("A");

Promise.resolve().then(() => {
  console.log("B");
});

console.log("C");
```

**Answer:**

```text
A
C
B
```

Reason: Promise reactions are microtasks.

---

## 53. Predict the Output – Exercise 3

```javascript
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
});

console.log("D");
```

**Answer:**

```text
A
D
C
B
```

Reason: Synchronous code first, then the Promise microtask, then the eligible timer task.

---

## 54. Predict the Output – Exercise 4

```javascript
async function test() {
  console.log("A");

  await Promise.resolve();

  console.log("B");
}

console.log("C");

test();

console.log("D");
```

**Answer:**

```text
C
A
D
B
```

Reason: The async function starts synchronously but resumes after the awaited Promise settles.

---

## 55. Predict the Output – Exercise 5

```javascript
function outer() {
  let count = 0;

  return function inner() {
    count++;

    console.log(count);
  };
}

const counter1 = outer();

counter1();
counter1();
counter1();

const counter2 = outer();

counter2();
```

**Answer:**

```text
1
2
3
1
```

Reason: Each call to `outer()` creates a separate lexical environment.

---

# PART 18: INTERVIEW QUESTIONS AND ANSWERS

## 56. JavaScript and TypeScript Internals Interview Questions

### Q1. Does TypeScript run directly in the JavaScript engine?

TypeScript-specific syntax must generally be transformed before execution. JavaScript engines execute JavaScript.

### Q2. What is type erasure?

It is the removal of TypeScript-only type information during compilation.

### Q3. Do interfaces exist at runtime?

No. Interfaces are removed during compilation.

### Q4. Do classes exist at runtime?

Yes. TypeScript classes are generally transformed into JavaScript classes or equivalent JavaScript code.

### Q5. Do generics exist at runtime?

No. Generic type parameters are erased.

### Q6. What is an execution context?

It is the environment in which JavaScript code is evaluated and executed.

### Q7. What are the main types of execution context?

Global, function, and eval execution contexts.

### Q8. What is the call stack?

A LIFO structure used to track active function execution.

### Q9. What is a stack overflow?

It occurs when the call stack exceeds its capacity, commonly due to uncontrolled recursion.

### Q10. What is the heap?

It is a memory area commonly used for dynamically allocated objects and other data.

### Q11. What is garbage collection?

It is the automatic process of reclaiming memory that is no longer needed.

### Q12. What is Mark-and-Sweep?

A garbage collection strategy that identifies reachable objects and reclaims unreachable ones.

### Q13. What is a memory leak?

A situation where memory that is no longer useful remains reachable and cannot be reclaimed.

### Q14. What is a closure?

A function combined with its retained access to the lexical environment in which it was created.

### Q15. Can closures cause memory leaks?

Yes, if they retain large objects or data longer than necessary.

### Q16. What is the event loop?

A mechanism that coordinates synchronous JavaScript execution with asynchronous callbacks and tasks.

### Q17. What is the microtask queue?

A queue used for microtasks such as Promise reactions and `queueMicrotask()` callbacks.

### Q18. What is the task queue?

A general term for queued tasks such as timer callbacks and certain event callbacks.

### Q19. Which executes first: Promise callbacks or setTimeout callbacks?

In the usual case where both are scheduled during the same synchronous execution, Promise microtasks run before the timer task.

### Q20. Does setTimeout(fn, 0) execute immediately?

No. It schedules a timer callback that becomes eligible after the delay and runs when the event loop can process it.

### Q21. Does await block JavaScript execution?

No. It suspends the current async function's continuation while allowing other work to proceed.

### Q22. Does an async function return a Promise?

Yes. An async function always returns a Promise.

### Q23. Does the Promise executor execute synchronously?

Yes. The executor runs synchronously when the Promise is constructed.

### Q24. What is libuv?

A cross-platform library that provides Node.js event-loop and asynchronous I/O functionality.

### Q25. What is process.nextTick()?

A Node.js-specific API that schedules a callback in the next-tick queue.

### Q26. What is the difference between setImmediate and setTimeout?

`setImmediate()` schedules a callback for the check phase, while `setTimeout()` schedules a timer callback.

### Q27. What is the difference between typeof and instanceof?

`typeof` returns a string describing a value's type category, while `instanceof` checks whether an object's prototype chain contains a constructor's prototype.

### Q28. Can instanceof check TypeScript interfaces?

No. Interfaces do not exist at runtime.

### Q29. What is a Type Guard?

A condition or function that helps TypeScript narrow a value to a more specific type.

### Q30. What is runtime validation?

It is the process of checking actual values while the application executes.

### Q31. Why is runtime validation important?

Because external data may not match the TypeScript types declared by the application.

### Q32. What is the difference between Map and WeakMap?

Map strongly retains keys and is iterable. WeakMap weakly references object keys and is not iterable.

### Q33. What is a prototype?

An object used in JavaScript's prototype-chain mechanism for property and method lookup.

### Q34. Are JavaScript classes prototype-based?

Yes. JavaScript classes use the prototype-based inheritance system.

### Q35. What is the difference between call, apply, and bind?

`call` and `apply` invoke functions immediately with a chosen `this`; `bind` returns a new function with a bound `this`.

---

# PART 19: PRACTICAL EXERCISES

## 57. Exercise 1: Understand Type Erasure

Write TypeScript code using:

- Interface.
- Type alias.
- Generic function.
- Class.
- Enum.
- Type assertion.

Compile the code and inspect the generated JavaScript.

Identify which constructs disappear and which remain.

## Exercise 2: Execution Context

Create nested functions.

Observe:

- Function invocation order.
- Local variables.
- Scope.
- Call stack.
- Return behavior.

Use browser developer tools or Node.js debugging.

## Exercise 3: Closure-Based Counter

Create a counter using closures.

Requirements:

- `increment()`.
- `decrement()`.
- `getCount()`.
- Keep the internal count private.

## Exercise 4: Memory Leak Demonstration

Create an application that:

- Stores objects in an array.
- Adds objects continuously.
- Measures memory usage.
- Removes unnecessary references.
- Observes memory behavior.

Use Node.js:

```javascript
console.log(process.memoryUsage());
```

Observe:

- `heapUsed`.
- `heapTotal`.
- `rss`.
- `external`.

Remember that memory usage does not necessarily decrease immediately after removing references because garbage collection is not guaranteed to run immediately.

## Exercise 5: Event Loop Practice

Write programs using:

- `setTimeout`.
- `setImmediate`.
- `Promise.then`.
- `queueMicrotask`.
- `process.nextTick`.
- `async/await`.

Predict execution order before running each program.

## Exercise 6: Runtime Validation

Create a User API.

Requirements:

- Define a TypeScript User type.
- Receive JSON data.
- Treat the incoming value as `unknown`.
- Validate it using Zod.
- Return an error for invalid data.

## Exercise 7: Prototype Exploration

Create a class and inspect:

```javascript
Object.getPrototypeOf(instance);
```

Also inspect:

```javascript
ClassName.prototype;
```

Understand how methods are shared through the prototype chain.

## Exercise 8: Async API Execution

Create an Express endpoint that:

1. Receives a request.
2. Calls a service.
3. Executes an asynchronous database operation.
4. Awaits the result.
5. Handles errors.
6. Sends the response.

Explain how the call stack and event loop coordinate the execution.

## Exercise 9: WeakMap

Create a WeakMap that stores private metadata for user objects.

Test what happens when references to those objects are removed.

Do not expect to inspect exactly when garbage collection occurs.

## Exercise 10: Complete Runtime Analysis

Create a TypeScript application containing:

- Interfaces.
- Classes.
- Generics.
- Closures.
- Promises.
- Async/await.
- Type guards.
- Runtime validation.

Compile the application and analyze the generated JavaScript.

---

# 58. Phase 31 Completion Checklist

### TypeScript Runtime

- [ ] TypeScript vs JavaScript at runtime.
- [ ] Type Erasure.
- [ ] Compile-Time vs Runtime.
- [ ] Interfaces at runtime.
- [ ] Classes at runtime.
- [ ] Generics at runtime.
- [ ] Runtime type validation.

### JavaScript Execution

- [ ] Execution Context.
- [ ] Global Execution Context.
- [ ] Function Execution Context.
- [ ] Creation Phase.
- [ ] Execution Phase.
- [ ] Hoisting.
- [ ] Temporal Dead Zone.
- [ ] Call Stack.
- [ ] Stack Overflow.

### Memory Management

- [ ] Stack vs Heap.
- [ ] Primitive Values.
- [ ] Reference Values.
- [ ] Garbage Collection.
- [ ] Mark-and-Sweep.
- [ ] Memory Leaks.
- [ ] Closures and Memory.
- [ ] WeakMap.
- [ ] WeakSet.

### Event Loop

- [ ] Event Loop.
- [ ] Synchronous vs Asynchronous.
- [ ] Task Queue.
- [ ] Microtask Queue.
- [ ] Promise Scheduling.
- [ ] queueMicrotask.
- [ ] Async/Await Internals.
- [ ] Node.js Event Loop.
- [ ] libuv.
- [ ] process.nextTick.
- [ ] setImmediate.
- [ ] setTimeout.

### JavaScript Internals

- [ ] typeof.
- [ ] instanceof.
- [ ] Type Guards.
- [ ] Custom Type Guards.
- [ ] Prototypes.
- [ ] Prototype Chain.
- [ ] JavaScript Classes.
- [ ] this.
- [ ] call().
- [ ] apply().
- [ ] bind().

---

# 59. What Comes Next?

## Phase 32: Advanced JavaScript and TypeScript – Functional Programming, Immutability, Pure Functions, Higher-Order Functions, and Composition

Topics:

1. What is Functional Programming?
2. Functional vs Object-Oriented Programming.
3. Pure Functions.
4. Impure Functions.
5. Side Effects.
6. Immutability.
7. Mutable vs Immutable Data.
8. Shallow Copy vs Deep Copy.
9. Object.freeze().
10. Object.seal().
11. Object.assign().
12. Spread Operator Internals.
13. Higher-Order Functions.
14. First-Class Functions.
15. Function Composition.
16. Currying.
17. Partial Application.
18. Closures in Functional Programming.
19. Map, Filter, and Reduce.
20. FlatMap.
21. Declarative vs Imperative Programming.
22. Recursion.
23. Memoization.
24. Lazy Evaluation.
25. Functional Error Handling.
26. Discriminated Unions for Result Types.
27. Functional Programming with TypeScript.
28. Practical Functional Programming Patterns.

**Phase 31 is complete.**

When you're ready, say **"OK, Phase 32"** to continue.