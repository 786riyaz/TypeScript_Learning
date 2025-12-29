## 1. What is `type` in TypeScript?

In TypeScript, `type` is used to create a **type alias**.

> A **type alias** gives a **name to a type** so it can be reused.

```ts
type ID = number;
```

Now `ID` behaves exactly like `number`.

---

## 2. Why Do We Need `type`?

`type` helps to:

* Improve **readability**
* Avoid **repetition**
* Create **complex types**
* Model **real-world data**
* Write **scalable and maintainable** code

---

## 3. Basic Type Alias

```ts
type UserName = string;

let name: UserName = "Riyaz";
```

This is especially useful when the meaning of a value matters more than its primitive type.

---

## 4. `type` with Objects

```ts
type User = {
  id: number;
  name: string;
  email: string;
};

const user: User = {
  id: 1,
  name: "Riyaz",
  email: "riyaz@example.com"
};
```

✔ Enforces structure
✔ Prevents extra or missing fields

---

## 5. `type` with Optional & Readonly Properties

```ts
type Product = {
  readonly id: number;
  name: string;
  price?: number;
};
```

* `readonly` → cannot be modified
* `?` → optional property

---

## 6. `type` with Union Types

One of the **most common uses** of `type`.

```ts
type Status = "success" | "error" | "loading";

let state: Status;
state = "success";   // ✔
state = "failed";    // ❌
```

📌 Interfaces **cannot** create unions—`type` can.

---

## 7. `type` with Intersection Types

```ts
type Person = {
  name: string;
};

type Employee = {
  id: number;
};

type Staff = Person & Employee;
```

Result:

```ts
{
  name: string;
  id: number;
}
```

---

## 8. `type` with Primitive Combinations

```ts
type ID = string | number;
type Flag = boolean | 0 | 1;
```

This is **not possible** with `interface`.

---

## 9. `type` for Function Signatures

```ts
type Add = (a: number, b: number) => number;

const add: Add = (a, b) => a + b;
```

Clean and reusable.

---

## 10. `type` with Tuples

```ts
type Coordinates = [number, number];

const point: Coordinates = [10, 20];
```

---

## 11. `type` with Generics

```ts
type ApiResponse<T> = {
  data: T;
  status: number;
};

type UserResponse = ApiResponse<User>;
```

Very powerful for APIs and libraries.

---

## 12. `type` vs `interface` (Critical Comparison)

| Feature             | `type` | `interface`   |
| ------------------- | ------ | ------------- |
| Object shapes       | ✔      | ✔ (preferred) |
| Union types         | ✔      | ❌             |
| Intersection types  | ✔      | ✔             |
| Primitive aliases   | ✔      | ❌             |
| Declaration merging | ❌      | ✔             |
| Extending           | ✔      | ✔             |

### Rule of Thumb

* Use **`interface`** for object models
* Use **`type`** for unions, primitives, tuples, and complex compositions

---

## 13. Declaration Merging (Important Limitation)

❌ This is NOT allowed with `type`:

```ts
type User = { name: string };
type User = { age: number }; // ❌ Error
```

Interfaces allow this, `type` does not.

---

## 14. Real-World Use Cases

### API Response

```ts
type ApiResult =
  | { status: "success"; data: string }
  | { status: "error"; message: string };
```

### React Props

```ts
type ButtonProps = {
  label: string;
  onClick: () => void;
};
```

### IDs & Flags

```ts
type UserID = string | number;
```

---

## 15. Common Mistakes

### ❌ Using `type` where interface merging is needed

Libraries prefer `interface`.

### ❌ Overusing `type` for simple objects

Interfaces are clearer for models.

---

## 16. Mental Model (Very Important)

* `type` = **what a value can be**
* `interface` = **what an object must look like**

---

## 17. Summary

* `type` creates a **type alias**
* Extremely powerful and flexible
* Best for:

  * Unions
  * Intersections
  * Tuples
  * Function signatures
  * Primitive combinations
* Complements `interface`, does not replace it