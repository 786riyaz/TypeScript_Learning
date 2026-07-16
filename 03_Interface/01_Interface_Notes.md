## 1. What is an Interface in TypeScript?

An **interface** is a **contract** that defines the **structure (shape)** of an object.

It specifies:

* What properties an object must have
* The types of those properties
* Optional methods or fields

> **Interface = blueprint for an object**

---

## 2. Basic Interface Syntax

```ts
interface User {
  id: number;
  name: string;
  email: string;
}
```

Usage:

```ts
const user: User = {
  id: 1,
  name: "Riyaz",
  email: "riyaz@example.com"
};
```

✔ All required properties must exist
❌ Extra or missing properties cause errors

---

## 3. Why Use Interfaces?

Interfaces provide:

* Strong typing
* Better readability
* IDE autocomplete
* Compile-time safety
* Reusability

They are **preferred for object shapes** in TypeScript.

---

## 4. Optional Properties

Use `?` when a property is not mandatory.

```ts
interface User {
  id: number;
  name: string;
  phone?: string;
}
```

```ts
const u1: User = { id: 1, name: "Riyaz" };
```

---

## 5. Readonly Properties

Prevents modification after initialization.

```ts
interface Config {
  readonly port: number;
}

const config: Config = { port: 3000 };
// config.port = 4000 ❌ Error
```

---

## 6. Methods in Interfaces

```ts
interface Calculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
}
```

```ts
const calc: Calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};
```

---

## 7. Interface for Functions

Interfaces can define function signatures.

```ts
interface Logger {
  (message: string): void;
}

const log: Logger = (msg) => console.log(msg);
```

---

## 8. Extending Interfaces (Inheritance)

Interfaces can extend other interfaces.

```ts
interface Person {
  name: string;
}

interface Employee extends Person {
  id: number;
}
```

```ts
const emp: Employee = {
  id: 1,
  name: "Riyaz"
};
```

---

## 9. Multiple Inheritance with Interfaces

```ts
interface A {
  a: number;
}

interface B {
  b: number;
}

interface C extends A, B {
  c: number;
}
```

---

## 10. Interface vs Type Alias

| Feature                 | Interface | Type |
| ----------------------- | --------- | ---- |
| Object shapes           | ✔ Best    | ✔    |
| Declaration merging     | ✔ Yes     | ❌ No |
| Union types             | ❌ No      | ✔    |
| Extending               | ✔         | ✔    |
| Recommended for objects | ✔         | —    |

📌 **Rule of thumb**:

* Use **interface** for objects
* Use **type** for unions & primitives

---

## 11. Declaration Merging (Unique Feature)

Interfaces with the same name automatically merge.

```ts
interface User {
  name: string;
}

interface User {
  age: number;
}
```

Result:

```ts
interface User {
  name: string;
  age: number;
}
```

This is heavily used in library typings.

---

## 12. Interface with Index Signature

```ts
interface StringMap {
  [key: string]: string;
}

const data: StringMap = {
  a: "one",
  b: "two"
};
```

---

## 13. Interfaces with Classes

Classes can **implement** interfaces.

```ts
interface Animal {
  speak(): void;
}

class Dog implements Animal {
  speak() {
    console.log("Bark");
  }
}
```

✔ Enforces structure
✔ No runtime overhead

---

## 14. Interface vs Class

| Feature          | Interface | Class |
| ---------------- | --------- | ----- |
| Runtime presence | ❌ No      | ✔ Yes |
| Implementation   | ❌ No      | ✔ Yes |
| Used for typing  | ✔         | ✔     |

Interfaces are **compile-time only**.

---

## 15. Common Mistakes

### ❌ Using interface for unions

```ts
interface ID = string | number; // ❌ Invalid
```

### ✅ Correct

```ts
type ID = string | number;
```

---

## 16. When Should You Use Interface?

✔ Defining object models
✔ API request/response shapes
✔ Class contracts
✔ Shared structures in teams

❌ Union-heavy logic
❌ Primitive combinations

---

## 17. Summary

* Interface defines **object structure**
* Enforces required properties and methods
* Supports extension and merging
* Best choice for **object modeling**
* No impact on runtime performance