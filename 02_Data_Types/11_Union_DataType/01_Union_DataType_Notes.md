## 1. What is a Union Type in TypeScript?

A **Union Type** allows a variable to hold **one of multiple specified types**.

In simple terms:

> **Union = OR (`|`) between types**

```ts
let value: string | number;
```

This means:

* `value` can be a `string`
* **OR** a `number`
* Nothing else

---

## 2. Why Do We Need Union Types?

JavaScript is flexible, but unsafe:

```js
let id = "123";
id = 123;
```

TypeScript uses **union types** to:

* Model **real-world variability**
* Handle **API responses**
* Avoid `any`
* Maintain type safety

---

## 3. Basic Union Type Example

```ts
let userId: number | string;

userId = 101;       // Valid
userId = "A101";    // Valid
userId = true;      // ❌ Error
```

---

## 4. Union Types with Functions

### Function Parameters

```ts
function printId(id: number | string) {
  console.log(id);
}
```

### Function Return Type

```ts
function getStatus(): string | number {
  return Math.random() > 0.5 ? "OK" : 200;
}
```

---

## 5. Type Narrowing (Very Important)

When using union types, you **must narrow** the type before using type-specific operations.

### Using `typeof`

```ts
function process(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toFixed(2));
  }
}
```

---

## 6. Union vs `any`

| Feature             | Union         | any     |
| ------------------- | ------------- | ------- |
| Type safety         | ✔ Yes         | ❌ No    |
| Compile-time checks | ✔             | ❌       |
| Best practice       | ✔ Recommended | ❌ Avoid |

```ts
let x: any = 10;
x.toUpperCase(); // Runtime error

let y: string | number = 10;
y.toUpperCase(); // Compile-time error
```

---

## 7. Union with Object Types

```ts
type Admin = {
  role: "admin";
  permissions: string[];
};

type User = {
  role: "user";
};

type Account = Admin | User;
```

---

## 8. Discriminated (Tagged) Unions

This is a **powerful and common pattern**.

```ts
type Success = {
  status: "success";
  data: string;
};

type ErrorResponse = {
  status: "error";
  message: string;
};

type ApiResponse = Success | ErrorResponse;
```

### Usage

```ts
function handleResponse(res: ApiResponse) {
  if (res.status === "success") {
    console.log(res.data);
  } else {
    console.log(res.message);
  }
}
```

✔ Clean
✔ Safe
✔ Scalable

---

## 9. Union with Arrays

```ts
let values: (string | number)[];

values = [1, "two", 3];
```

❗ Parentheses are important.

---

## 10. Union of Literal Types

```ts
type Direction = "up" | "down" | "left" | "right";

let move: Direction;
move = "up";    // Valid
move = "back";  // ❌ Error
```

Commonly used in:

* Enums replacement
* API flags
* UI state management

---

## 11. Union vs Intersection (Quick Comparison)

| Union (`|`) | Intersection (`&`) |
|-----------|------------------|
| OR | AND |
| One of many types | Must satisfy all |
| Flexible | Strict |

```ts
type A = { name: string };
type B = { age: number };

type C = A | B;  // name OR age
type D = A & B;  // name AND age
```

---

## 12. Common Mistakes

### ❌ Accessing properties without narrowing

```ts
function log(val: string | number) {
  console.log(val.length); // Error
}
```

### ✅ Correct approach

```ts
if (typeof val === "string") {
  console.log(val.length);
}
```

---

## 13. When Should You Use Union Types?

| Scenario                    | Use Union?       |
| --------------------------- | ---------------- |
| Multiple valid input types  | ✔ Yes            |
| API responses               | ✔ Yes            |
| Optional states             | ✔ Yes            |
| Unknown data                | ❌ Use `unknown`  |
| Overuse for complex objects | ❌ Use interfaces |

---

## 14. Summary

* Union types allow **multiple possible types**
* Represent **real-world OR logic**
* Require **type narrowing**
* Essential for **safe, flexible TypeScript**