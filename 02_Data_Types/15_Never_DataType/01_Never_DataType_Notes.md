## 1. What is `never` in TypeScript?

The `never` type represents values that **never occur**.

In simple terms:

> **`never` = a function or variable that can never produce a value**

This is **not the same** as `void` or `undefined`.

---

## 2. When Does `never` Occur?

`never` is used when:

1. A function **always throws an error**
2. A function **never finishes execution** (infinite loop)
3. TypeScript determines a code path is **impossible**

---

## 3. `never` vs `void` (Very Important)

| Feature          | `void`                | `never`                |
| ---------------- | --------------------- | ---------------------- |
| Function returns | Nothing               | Never returns          |
| Execution ends   | ✔                     | ❌                      |
| Use case         | Logging, side effects | Errors, infinite loops |

### Example

```ts
function log(msg: string): void {
  console.log(msg);
}

function crash(msg: string): never {
  throw new Error(msg);
}
```

---

## 4. Functions That Throw Errors

```ts
function throwError(message: string): never {
  throw new Error(message);
}
```

✔ Function ends program flow
✔ Nothing is returned

---

## 5. Infinite Loop Functions

```ts
function runForever(): never {
  while (true) {
    console.log("Running...");
  }
}
```

✔ Function never completes
✔ No return value possible

---

## 6. `never` in Union Types

`never` represents **no possible value**.

```ts
type Result = string | number | never;
```

Here, `never` has **no effect** and is removed.

---

## 7. Exhaustive Type Checking (Very Important Use Case)

Used with union types to ensure **all cases are handled**.

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side * shape.side;
    default:
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}
```

✔ Compiler error if a case is missing
✔ Very useful in production code

---

## 8. `never` in Variables

```ts
let x: never;

// x = 10; ❌ Error
```

A variable of type `never` **cannot be assigned any value**.

---

## 9. `never` vs `unknown`

| Feature            | `never`           | `unknown`      |
| ------------------ | ----------------- | -------------- |
| Represents         | Impossible value  | Unknown value  |
| Assignment allowed | ❌ No              | ✔ Yes          |
| Use case           | Exhaustive checks | External input |

---

## 10. Common Mistakes

### ❌ Using `never` instead of `void`

```ts
function log(msg: string): never {
  console.log(msg); // ❌ Wrong
}
```

### ✅ Correct

```ts
function log(msg: string): void {
  console.log(msg);
}
```

---

## 11. When Should You Use `never`?

✔ Error-throwing functions
✔ Infinite loops
✔ Exhaustive switch checks
✔ Advanced type safety

❌ Normal functions
❌ Optional returns
❌ Logging functions

---

## 12. Summary

* `never` means **no value is possible**
* Used for **errors, infinite loops, and unreachable code**
* Critical for **exhaustive type checking**
* Different from `void`, `null`, and `undefined`