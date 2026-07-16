## 1. What is an Enum in TypeScript?

An **enum** (enumeration) is a way to define a **set of named constants**.

> **Enum = fixed set of related values with readable names**

Enums help replace “magic numbers/strings” with meaningful identifiers.

```ts
enum Direction {
  Up,
  Down,
  Left,
  Right
}
```

---

## 2. Why Use Enums?

Enums provide:

* Better **readability**
* **Type safety**
* Centralized constants
* Fewer hard-coded values
* Clear intent in APIs and business logic

---

## 3. Numeric Enums (Default)

By default, enums are **numeric** and auto-incremented starting from `0`.

```ts
enum Status {
  Pending,
  Approved,
  Rejected
}
```

Internally:

```ts
Pending  = 0
Approved = 1
Rejected = 2
```

Usage:

```ts
let s: Status = Status.Approved;
```

---

## 4. Custom Numeric Values

You can explicitly assign numbers.

```ts
enum HttpCode {
  OK = 200,
  BadRequest = 400,
  Unauthorized = 401
}
```

Auto-increment continues from the last value if needed.

---

## 5. String Enums (Recommended)

String enums are clearer and safer at runtime.

```ts
enum Role {
  Admin = "ADMIN",
  User = "USER",
  Guest = "GUEST"
}
```

Advantages:

* Human-readable values
* No reverse mapping surprises
* Safer for logging, APIs, and storage

Usage:

```ts
function checkRole(role: Role) {
  if (role === Role.Admin) {
    // admin logic
  }
}
```

---

## 6. Heterogeneous Enums (Not Recommended)

Mixing string and number values is allowed but discouraged.

```ts
enum Mixed {
  Yes = 1,
  No = "NO"
}
```

Reason to avoid:

* Confusing semantics
* Harder maintenance

---

## 7. Enum Reverse Mapping (Numeric Enums Only)

Numeric enums support reverse lookup.

```ts
enum Color {
  Red,
  Blue
}

Color.Red      // 0
Color[0]       // "Red"
```

⚠️ String enums **do not** support reverse mapping.

---

## 8. Enums in Functions

```ts
enum PaymentStatus {
  Success,
  Failed
}

function handlePayment(status: PaymentStatus): void {
  if (status === PaymentStatus.Success) {
    // success logic
  }
}
```

---

## 9. Enums vs Union of Literals

### Union (often preferred)

```ts
type Status = "success" | "error" | "loading";
```

### Enum

```ts
enum Status {
  Success = "success",
  Error = "error",
  Loading = "loading"
}
```

| Aspect           | Enum     | Union    |
| ---------------- | -------- | -------- |
| Runtime presence | ✔ Yes    | ❌ No     |
| Tree-shaking     | ❌ Worse  | ✔ Better |
| Type safety      | ✔        | ✔        |
| Simplicity       | Moderate | Simple   |

📌 **Modern TypeScript often prefers unions** unless runtime presence is needed.

---

## 10. `const enum` (Compile-Time Optimization)

```ts
const enum Direction {
  Up,
  Down
}

let d = Direction.Up;
```

Compiled JS (inlined):

```js
let d = 0;
```

✔ Smaller output
✔ Faster
❌ Cannot be used with `--isolatedModules`

---

## 11. Enums in Objects and APIs

```ts
enum Environment {
  Dev = "dev",
  Prod = "prod"
}

type Config = {
  env: Environment;
};

const cfg: Config = {
  env: Environment.Dev
};
```

---

## 12. Common Mistakes

### ❌ Comparing with raw values

```ts
if (role === "ADMIN") { } // ❌
```

### ✅ Correct

```ts
if (role === Role.Admin) { }
```

---

## 13. When Should You Use Enums?

✔ Use enums when:

* Values are **fixed and finite**
* You need **runtime constants**
* Working with **external systems** (codes, states)

❌ Avoid enums when:

* You only need types (use unions)
* Bundle size is critical
* You want better tree-shaking

---

## 14. Best Practices

* Prefer **string enums** over numeric enums
* Avoid heterogeneous enums
* Consider **union types** as an alternative
* Use `const enum` carefully

---

## 15. Summary

* Enums define a fixed set of named constants
* Numeric enums auto-increment and support reverse mapping
* String enums are safer and clearer
* Enums exist at runtime; unions do not
* Choose enums when runtime presence matters