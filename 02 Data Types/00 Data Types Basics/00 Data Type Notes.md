## 1. Primitive Data Types

### 1.1 `number`

Represents **all numeric values** (integers, floats, negatives).

```ts
let age: number = 25;
let price: number = 99.99;
```

---

### 1.2 `string`

Represents textual data.

```ts
let name: string = "Riyaz";
let message: string = `Hello, ${name}`;
```

---

### 1.3 `boolean`

Represents `true` or `false`.

```ts
let isLoggedIn: boolean = true;
```

---

### 1.4 `bigint`

Used for very large integers (beyond `Number.MAX_SAFE_INTEGER`).

```ts
let bigValue: bigint = 12345678901234567890n;
```

---

### 1.5 `symbol`

Creates unique identifiers (commonly used as object keys).

```ts
let id: symbol = Symbol("id");
```

---

## 2. Special Types

### 2.1 `any`

Disables type checking (not recommended unless necessary).

```ts
let value: any = 10;
value = "text";
```

Use case: legacy code or dynamic data.

---

### 2.2 `unknown`

Safer alternative to `any`. Requires type checking before use.

```ts
let data: unknown = "Hello";

if (typeof data === "string") {
  console.log(data.toUpperCase());
}
```

---

### 2.3 `void`

Used when a function returns nothing.

```ts
function logMessage(): void {
  console.log("Hello");
}
```

---

### 2.4 `null` and `undefined`

Represents absence of value.

```ts
let a: null = null;
let b: undefined = undefined;
```

---

### 2.5 `never`

Represents values that **never occur** (function never finishes).

```ts
function throwError(): never {
  throw new Error("Error occurred");
}
```

---

## 3. Object and Reference Types

### 3.1 `object`

Represents non-primitive types.

```ts
let user: object = { name: "Riyaz", age: 22 };
```

---

### 3.2 Object Type Literals

Used for defining object shape.

```ts
let user: { name: string; age: number } = {
  name: "Riyaz",
  age: 22
};
```

---

### 3.3 `Array`

Used for lists of values.

```ts
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["A", "B"];
```

---

### 3.4 `Tuple`

Fixed-length array with fixed types.

```ts
let userInfo: [number, string] = [1, "Riyaz"];
```

---

## 4. Type Aliases and Interfaces

### 4.1 Type Alias

Creates reusable custom types.

```ts
type User = {
  name: string;
  age: number;
};

let u: User = { name: "Riyaz", age: 22 };
```

---

### 4.2 Interface

Similar to type but extendable and preferred for objects.

```ts
interface User {
  name: string;
  age: number;
}
```

---

## 5. Union and Intersection Types

### 5.1 Union (`|`)

Variable can be one of multiple types.

```ts
let id: number | string;
id = 101;
id = "A101";
```

---

### 5.2 Intersection (`&`)

Combines multiple types.

```ts
type Admin = { role: string };
type User = { name: string };

type AdminUser = Admin & User;
```

---

## 6. Literal Types

### 6.1 String Literal

Restricts to exact values.

```ts
let status: "success" | "error";
status = "success";
```

---

### 6.2 Numeric Literal

```ts
let direction: 1 | -1;
```

---

## 7. Enum

### 7.1 Numeric Enum

```ts
enum Status {
  Pending,
  Success,
  Failed
}
```

---

### 7.2 String Enum

```ts
enum Role {
  Admin = "ADMIN",
  User = "USER"
}
```

---

## 8. Function Types

### 8.1 Function Parameters & Return Type

```ts
function add(a: number, b: number): number {
  return a + b;
}
```

---

### 8.2 Optional & Default Parameters

```ts
function greet(name: string, age?: number) {}
```

---

## 9. Advanced Types (Very Important)

### 9.1 Type Inference

TypeScript automatically infers types.

```ts
let count = 10; // inferred as number
```

---

### 9.2 Type Assertions

Manually tell TS the type.

```ts
let value: unknown = "Hello";
let length = (value as string).length;
```

---

### 9.3 `Readonly`

```ts
type User = {
  readonly id: number;
  name: string;
};
```

---

### 9.4 `Partial`, `Required`, `Pick`, `Omit`

```ts
interface User {
  id: number;
  name: string;
  age: number;
}

type PartialUser = Partial<User>;
type NameOnly = Pick<User, "name">;
```

---

### 9.5 Generics

```ts
function identity<T>(value: T): T {
  return value;
}
```

---

## 10. Summary Table

| Category  | Types                                                  |
| --------- | ------------------------------------------------------ |
| Primitive | `number`, `string`, `boolean`, `bigint`, `symbol`      |
| Special   | `any`, `unknown`, `void`, `null`, `undefined`, `never` |
| Objects   | `object`, arrays, tuples                               |
| Advanced  | union, intersection, literal, enum                     |
| Utility   | `Partial`, `Pick`, `Omit`, `Readonly`                  |
| Generics  | `<T>`                                                  |

---

### Recommendation for You
focus strongly on:

* `unknown` vs `any`
* Union types
* Interfaces vs Types
* Utility types
* Generics