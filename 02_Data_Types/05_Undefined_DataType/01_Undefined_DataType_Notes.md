## 1. What is `undefined` in TypeScript?

`undefined` means **a value is missing or not provided**.

```ts
let value: undefined = undefined;
```

It usually indicates:

* A variable was declared but **not initialized**
* A function did not return a value
* A property does not exist

---

## 2. `undefined` in JavaScript vs TypeScript

In JavaScript:

```js
let x;
console.log(x); // undefined
```

In TypeScript:

* `undefined` is a **distinct type**
* Strict typing forces you to handle it explicitly

---

## 3. `undefined` vs `null` (Core Concept)

| `undefined`      | `null`                  |
| ---------------- | ----------------------- |
| Missing value    | Intentional empty value |
| System-generated | Developer-assigned      |
| Default state    | Explicit state          |

```ts
let a;          // undefined
let b = null;   // explicitly empty
```

---

## 4. `strictNullChecks` and `undefined` (Very Important)

With `"strict": true`:

```ts
let name: string = undefined; // ❌ Error
```

Correct:

```ts
let name: string | undefined;
```

This prevents **runtime crashes**.

---

## 5. Common Sources of `undefined`

### a) Uninitialized variables

```ts
let x;
```

---

### b) Missing function return

```ts
function log(): void {
  console.log("Hello");
}
```

Functions with no return implicitly return `undefined`.

---

### c) Missing object properties

```ts
const user = { name: "Riyaz" };
user.email; // undefined
```

---

### d) Array out-of-bounds access

```ts
const arr = [1, 2];
arr[5]; // undefined
```

---

## 6. Optional Properties & Parameters (`?`)

### Optional property

```ts
type User = {
  phone?: string;
};
```

Equivalent to:

```ts
phone: string | undefined;
```

---

### Optional parameter

```ts
function greet(name?: string) {
  console.log(name);
}
```

If not passed → `undefined`.

---

## 7. `undefined` in Function Parameters (Default Values)

```ts
function greet(name: string = "Guest") {
  console.log(name);
}
```

Passing `undefined` triggers default:

```ts
greet(undefined); // "Guest"
```

---

## 8. Checking for `undefined` Safely

### ❌ Unsafe

```ts
if (value) { }
```

### ✅ Safe

```ts
if (value !== undefined) { }
```

---

### Using `typeof`

```ts
if (typeof value === "undefined") { }
```

Useful for variables that may not exist.

---

## 9. `undefined` with Optional Chaining

```ts
user?.profile?.email;
```

Stops execution if any step is `undefined`.

---

## 10. `undefined` with Nullish Coalescing (`??`)

```ts
const username = input ?? "Guest";
```

* Triggers only for `undefined` or `null`
* Does NOT override `0`, `false`, or `""`

---

## 11. `undefined` in JSON & APIs

⚠️ JSON does NOT support `undefined`.

```ts
JSON.stringify({ a: undefined }); // "{}"
```

Best practice:

* Use `null` for API responses
* Avoid `undefined` in serialized data

---

## 12. `undefined` vs `void`

| `undefined`   | `void`                   |
| ------------- | ------------------------ |
| A value       | Absence of value         |
| Can be stored | Used in function returns |

```ts
function log(): void {}
```

---

## 13. Common Mistakes with `undefined`

❌ Forgetting union types
❌ Using truthy checks
❌ Sending `undefined` in APIs
❌ Assuming `undefined` equals `null`

---

## 14. When to Use `undefined`

Use `undefined` when:

* Value is optional
* Parameter is omitted
* Field is not yet initialized

Avoid `undefined` when:

* Representing “empty” data → use `null`
* Designing public APIs

---

## 15. Interview-Ready Summary

* `undefined` means “not provided”
* It is the default state
* Requires explicit handling in strict mode
* Common with optional parameters & properties
* Not valid in JSON

---

## 16. Golden Rule

> **`undefined` means missing, not empty.
> Use it for absence, not intention.**