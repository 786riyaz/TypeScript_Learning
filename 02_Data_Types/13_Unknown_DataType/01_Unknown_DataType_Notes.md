## 1. What is `unknown` in TypeScript?

The `unknown` type represents a value whose **type is not known at compile time**, but **must be verified before use**.

In simple terms:

> **`unknown` = safe version of `any`**

You can assign **any value** to `unknown`, but you **cannot use it** until you prove what it is.

---

## 2. Why Was `unknown` Introduced?

`any` disables all type checking and causes runtime errors.

`unknown` was introduced to:

* Preserve **type safety**
* Force **explicit validation**
* Prevent unsafe property or method access

---

## 3. Basic Usage

```ts
let value: unknown;

value = 10;
value = "Riyaz";
value = true;
```

✔ Assignment allowed
❌ Direct usage not allowed

```ts
value.toUpperCase(); // ❌ Error
```

---

## 4. Type Narrowing (Mandatory)

You **must narrow** `unknown` before using it.

### Using `typeof`

```ts
if (typeof value === "string") {
  console.log(value.toUpperCase());
}
```

### Using `instanceof`

```ts
if (value instanceof Date) {
  console.log(value.toISOString());
}
```

---

## 5. `unknown` vs `any`

| Feature             | `unknown` | `any`     |
| ------------------- | --------- | --------- |
| Type safety         | ✔ Strong  | ❌ None    |
| Property access     | ❌ Blocked | ✔ Allowed |
| Compile-time errors | ✔ Yes     | ❌ No      |
| Recommended         | ✔ Yes     | ❌ Avoid   |

```ts
let a: any = "hello";
a.toUpperCase(); // Allowed (unsafe)

let b: unknown = "hello";
b.toUpperCase(); // Compile-time error
```

---

## 6. `unknown` in Function Parameters

Used when input can be **anything**, but you want safety.

```ts
function processInput(input: unknown) {
  if (typeof input === "number") {
    return input * 2;
  }
  if (typeof input === "string") {
    return input.trim();
  }
  throw new Error("Invalid input");
}
```

---

## 7. `unknown` as Function Return Type

```ts
function parseJSON(json: string): unknown {
  return JSON.parse(json);
}
```

Caller must validate before use.

---

## 8. `unknown` in Catch Blocks (Best Practice)

```ts
try {
  throw new Error("Something went wrong");
} catch (err: unknown) {
  if (err instanceof Error) {
    console.log(err.message);
  }
}
```

✔ Prevents unsafe error handling
✔ Recommended by TypeScript

---

## 9. Assignability Rules

| From   | To `unknown` |
| ------ | ------------ |
| any    | ✔            |
| string | ✔            |
| number | ✔            |

| From `unknown` | To |
| -------------- | -- |
| unknown        | ✔  |
| any            | ✔  |
| string         | ❌  |
| number         | ❌  |

You must narrow or assert first.

---

## 10. Type Assertion with `unknown`

```ts
let val: unknown = "Riyaz";

let name = val as string;
console.log(name.toUpperCase());
```

⚠️ Use assertions carefully—this bypasses safety.

---

## 11. `unknown` with Objects

```ts
let data: unknown = { id: 1 };

if (
  typeof data === "object" &&
  data !== null &&
  "id" in data
) {
  console.log((data as { id: number }).id);
}
```

---

## 12. When Should You Use `unknown`?

✔ Recommended for:

* External API responses
* User input
* JSON parsing
* `catch` blocks
* Library boundaries

❌ Avoid when:

* Structure is known
* Strong typing is possible

---

## 13. `unknown` vs Union Types

| Use Case                | Better Choice |
| ----------------------- | ------------- |
| Known possible types    | Union         |
| Completely unknown data | `unknown`     |

---

## 14. Summary

* `unknown` accepts any value
* Forces **type checking before use**
* Prevents runtime errors
* Best replacement for `any`
* Essential for safe TypeScript code