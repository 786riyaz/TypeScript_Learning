## 1. What is an Intersection Type?

An **Intersection Type** combines **multiple types into one**.

In simple words:

> **Intersection = AND (`&`) between types**

```ts
type A = { name: string };
type B = { age: number };

type C = A & B;
```

Here, `C` must satisfy **both A AND B**.

---

## 2. Union vs Intersection (Critical Difference)

| Feature | Union (`|`) | Intersection (`&`) |
|------|-----------|------------------|
| Meaning | OR | AND |
| Required properties | One of many | All combined |
| Flexibility | More | Stricter |

```ts
type U = { name: string } | { age: number };
type I = { name: string } & { age: number };
```

* `U` → either `name` **or** `age`
* `I` → must have `name` **and** `age`

---

## 3. Basic Intersection Example

```ts
type Person = {
  name: string;
};

type Employee = {
  id: number;
};

type Staff = Person & Employee;

const staff: Staff = {
  name: "Riyaz",
  id: 101
};
```

❌ Missing any property → compile-time error

---

## 4. Intersection with Interfaces

```ts
interface User {
  name: string;
}

interface Admin {
  permissions: string[];
}

type SuperUser = User & Admin;
```

Interfaces and types work together seamlessly.

---

## 5. Intersection for Reusable Models

Instead of repeating properties:

```ts
type Timestamped = {
  createdAt: Date;
};

type User = {
  name: string;
};

type UserEntity = User & Timestamped;
```

✔ Clean
✔ Reusable
✔ Scalable

---

## 6. Intersection with Function Types

```ts
type Logger = (msg: string) => void;
type ErrorLogger = (error: Error) => void;

type AppLogger = Logger & ErrorLogger;
```

The function must satisfy **both signatures**.

---

## 7. Intersection with Conflicting Properties (Important)

```ts
type A = { id: string };
type B = { id: number };

type C = A & B;
```

Result:

```ts
type C = { id: never };
```

Because `string & number` is impossible.

❌ This type can never be created.

---

## 8. Intersection vs Interface Extension

### Using `extends`

```ts
interface A {
  a: number;
}

interface B extends A {
  b: number;
}
```

### Using intersection

```ts
type B = A & { b: number };
```

| Choose    | When                        |
| --------- | --------------------------- |
| `extends` | Interfaces only             |
| `&`       | Mix types, unions, generics |

---

## 9. Intersection with Union Types

```ts
type A = { a: number };
type B = { b: number };

type Mixed = (A | B) & { c: number };
```

Meaning:

* Must have `c`
* Plus either `a` or `b`

---

## 10. Real-World Use Cases

### 1️⃣ API Models

```ts
type ApiEntity = {
  id: number;
};

type User = {
  name: string;
};

type ApiUser = ApiEntity & User;
```

---

### 2️⃣ React Props Composition

```ts
type ButtonProps = {
  onClick: () => void;
};

type StyleProps = {
  color: string;
};

type Props = ButtonProps & StyleProps;
```

---

### 3️⃣ Middleware Patterns

```ts
type Auth = { userId: string };
type Request = { body: unknown };

type AuthRequest = Auth & Request;
```

---

## 11. Common Mistakes

### ❌ Expecting OR behavior

```ts
type A = { a: number };
type B = { b: number };

type C = A & B; // NOT either/or
```

### ❌ Combining incompatible types

```ts
type X = string & number; // never
```

---

## 12. When Should You Use Intersection Types?

✔ Combine multiple object structures
✔ Add shared properties
✔ Compose reusable types
✔ Strongly enforce constraints

❌ Avoid for conflicting primitives
❌ Avoid when union is more appropriate

---

## 13. Summary

* Intersection types use `&`
* Represent **AND logic**
* Combine all properties
* Powerful for type composition
* Misuse can lead to `never`