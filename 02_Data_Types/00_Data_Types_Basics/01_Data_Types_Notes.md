## 1. Array vs Tuple

### Array

* Collection of **same type elements**
* **Length is dynamic**
* Order matters, size does not

```ts
let marks: number[] = [90, 80, 70];
marks.push(60); // allowed
```

### Tuple

* Collection of **fixed number of elements**
* **Each position has a fixed type**
* Structure is strict

```ts
let user: [number, string] = [1, "Riyaz"];
// user = ["Riyaz", 1]; ❌ error
```

### Key Difference

| Feature  | Array                | Tuple           |
| -------- | -------------------- | --------------- |
| Length   | Dynamic              | Fixed           |
| Types    | Same                 | Fixed per index |
| Use Case | List of similar data | Structured data |

---

## 2. `null` vs `undefined`

### `undefined`

* Variable declared but **not assigned**
* Default value of uninitialized variables

```ts
let a: string;
console.log(a); // undefined
```

### `null`

* Explicitly assigned **no value**
* Intentional absence of value

```ts
let b: string | null = null;
```

### Key Difference

| Aspect  | undefined         | null                |
| ------- | ----------------- | ------------------- |
| Meaning | Not assigned      | Intentionally empty |
| Default | Yes               | No                  |
| Usage   | System / compiler | Developer           |

---

## 3. Type Alias vs Interface

### Type Alias

* Can represent **any type** (primitive, union, tuple, object)
* Cannot be reopened (no declaration merging)

```ts
type ID = number | string;

type User = {
  name: string;
  age: number;
};
```

### Interface

* Mainly for **object structure**
* Supports **extension & declaration merging**
* Preferred for public APIs

```ts
interface User {
  name: string;
  age: number;
}
```

### Key Difference

| Feature             | Type Alias | Interface |
| ------------------- | ---------- | --------- |
| Use for objects     | Yes        | Yes       |
| Use for unions      | Yes        | No        |
| Extendable          | Limited    | Yes       |
| Declaration merging | No         | Yes       |

---

## 4. Union vs Intersection

### Union (`|`)

* Value can be **one of many types**
* “OR” relationship

```ts
let id: number | string;
id = 101;
id = "A101";
```

### Intersection (`&`)

* Value must satisfy **all combined types**
* “AND” relationship

```ts
type User = { name: string };
type Admin = { role: string };

type AdminUser = User & Admin;

let person: AdminUser = {
  name: "Riyaz",
  role: "Admin"
};
```

### Key Difference

| Feature             | Union          | Intersection  |
| ------------------- | -------------- | ------------- |
| Meaning             | OR             | AND           |
| Required properties | Any one        | All           |
| Usage               | Flexible input | Combine types |

---

## 5. Literal vs Enum

### Literal Types

* Restrict variable to **exact values**
* Lightweight and simple

```ts
let status: "success" | "error";
status = "success";
```

### Enum

* Named collection of related constants
* Creates a runtime object

```ts
enum Status {
  Success = "SUCCESS",
  Error = "ERROR"
}
```

### Key Difference

| Feature        | Literal            | Enum               |
| -------------- | ------------------ | ------------------ |
| Runtime object | No                 | Yes                |
| Code size      | Smaller            | Larger             |
| Use case       | Simple constraints | Reusable constants |

---

## 6. Optional vs Default Parameters

### Optional Parameters (`?`)

* Parameter **may or may not be passed**
* Value becomes `undefined` if missing

```ts
function greet(name: string, age?: number) {
  console.log(age);
}
```

### Default Parameters

* Parameter has a **default value**
* Used when argument is missing

```ts
function greet(name: string, age: number = 18) {
  console.log(age);
}
```

### Key Difference

| Feature            | Optional      | Default         |
| ------------------ | ------------- | --------------- |
| Value when omitted | undefined     | Default value   |
| Type safety        | Less          | More            |
| Common use         | Optional info | Fallback values |

---

## One-Line Interview Summary

* **Array vs Tuple** → Dynamic list vs fixed structure
* **null vs undefined** → Intentional empty vs not assigned
* **Type vs Interface** → Flexible type vs extendable object contract
* **Union vs Intersection** → OR vs AND
* **Literal vs Enum** → Inline constraint vs reusable constant set
* **Optional vs Default** → May be missing vs guaranteed value

---