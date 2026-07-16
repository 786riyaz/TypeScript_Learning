## 1. What is `symbol` in TypeScript?

`symbol` represents a **unique and immutable identifier**.

```ts
const id: symbol = Symbol();
```

Key characteristics:

* Every `symbol` value is **guaranteed to be unique**
* Used primarily as **object property keys**
* Prevents name collisions

At runtime, it is JavaScript’s **Symbol primitive**.

---

## 2. Why `symbol` Exists (The Problem It Solves)

Before `symbol`, object keys were limited to strings:

```ts
const user = {
  id: 1,
  id: 2 // overwrites
};
```

With `symbol`, keys never collide:

```ts
const ID = Symbol("id");
const user = {
  [ID]: 1
};
```

Even if another symbol uses the same description, it is still unique.

---

## 3. Creating Symbols

### a) Basic symbol

```ts
const sym = Symbol();
```

---

### b) Symbol with description (for debugging only)

```ts
const sym = Symbol("userId");
```

Description is **not the value**, only metadata.

---

## 4. `symbol` vs `Symbol` (Critical Difference)

| `symbol`       | `Symbol`               |
| -------------- | ---------------------- |
| Primitive type | Global constructor     |
| Used as a type | Used to create symbols |
| Recommended    | Required               |

```ts
let a: symbol = Symbol(); // ✅
let b: Symbol = Symbol(); // ❌ Avoid
```

Always use lowercase **`symbol`** as the type.

---

## 5. Symbol Uniqueness (Core Property)

```ts
const a = Symbol("id");
const b = Symbol("id");

a === b; // false
```

Even with the same description, symbols are **never equal**.

---

## 6. Symbols as Object Keys (Primary Use Case)

```ts
const ID = Symbol("id");

const user = {
  name: "Riyaz",
  [ID]: 101
};
```

* Not accessible via `user.ID`
* Must use the symbol reference

```ts
user[ID]; // 101
```

---

## 7. Symbols Are Not Enumerable by Default

```ts
Object.keys(user); // ["name"]
```

Symbol keys are hidden from:

* `Object.keys`
* `for...in`
* `JSON.stringify`

To access them:

```ts
Object.getOwnPropertySymbols(user);
```

---

## 8. `symbol` in TypeScript Typing

### a) Declaring symbol-typed properties

```ts
const uniqueKey = Symbol();

type Data = {
  [uniqueKey]: number;
};
```

---

### b) Using `unique symbol` (Advanced & Important)

```ts
const TOKEN: unique symbol = Symbol();
```

* This symbol has a **singleton type**
* Cannot be reassigned
* Used in advanced library typing

```ts
type Secure = {
  [TOKEN]: string;
};
```

---

## 9. `symbol` vs `string` Keys

| Symbol Key         | String Key  |
| ------------------ | ----------- |
| Unique             | Can collide |
| Hidden             | Enumerable  |
| Safe for internals | Public APIs |

Use symbols for **internal metadata**, not user-facing data.

---

## 10. Global Symbols (`Symbol.for`)

```ts
const a = Symbol.for("app.id");
const b = Symbol.for("app.id");

a === b; // true
```

Stored in the **global symbol registry**.

Use case:

* Shared identifiers across modules
* Framework internals

Avoid unless you need global coordination.

---

## 11. Well-Known Symbols (Advanced)

JavaScript defines built-in symbols:

* `Symbol.iterator`
* `Symbol.toStringTag`
* `Symbol.toPrimitive`

Example:

```ts
const obj = {
  [Symbol.iterator]() {
    return {
      next() {
        return { value: 1, done: true };
      }
    };
  }
};
```

This makes the object iterable.

---

## 12. `symbol` Limitations (Must Know)

❌ Cannot be serialized to JSON
❌ Cannot be auto-stringified
❌ Not usable as database keys
❌ Not supported in very old environments

---

## 13. Common Mistakes

❌ Using `Symbol` instead of `symbol`
❌ Expecting symbols to appear in JSON
❌ Using symbols for API responses
❌ Losing the symbol reference

---

## 14. When to Use `symbol`

Use `symbol` when:

* You need **collision-free keys**
* Creating **library internals**
* Extending objects safely
* Implementing protocols (`Symbol.iterator`)

Do NOT use `symbol` when:

* Data must be serialized
* Keys must be user-readable
* API contracts require strings

---

## 15. Real-World Use Cases

* Framework internals (Angular, React, Redux)
* Private-like object properties
* Metadata injection
* Polyfills and shims

---

## 16. Interview-Ready Summary

* `symbol` creates unique identifiers
* Symbols are immutable and non-enumerable
* Prefer `unique symbol` for strong typing
* Not JSON-serializable
* Ideal for internal and low-level design

---

## 17. Golden Rule

> **Use `symbol` to protect internals,
> not to communicate data.**
