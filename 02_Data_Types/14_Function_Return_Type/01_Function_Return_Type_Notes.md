## 1. What is a Function Return Type?

A **function return type** defines **what type of value a function returns**.

In TypeScript:

> The return type ensures that a function **returns exactly what it promises**.

```ts
function add(a: number, b: number): number {
  return a + b;
}
```

Here, `: number` is the **return type**.

---

## 2. Why Are Return Types Important?

Return types:

* Enforce **type safety**
* Prevent accidental wrong returns
* Improve **readability**
* Help IDEs with autocomplete
* Avoid silent bugs

---

## 3. Explicit vs Inferred Return Types

### Explicit Return Type (Recommended)

```ts
function greet(name: string): string {
  return `Hello ${name}`;
}
```

✔ Clear
✔ Safe
✔ Self-documented

---

### Inferred Return Type

```ts
function greet(name: string) {
  return `Hello ${name}`;
}
```

TypeScript infers `string`.

📌 **Inference is fine for small functions**, but explicit types are preferred in:

* Public APIs
* Libraries
* Team projects

---

## 4. Common Return Types

### 1️⃣ `number`, `string`, `boolean`

```ts
function isAdult(age: number): boolean {
  return age >= 18;
}
```

---

### 2️⃣ `void` (No return value)

```ts
function logMessage(msg: string): void {
  console.log(msg);
}
```

Returning anything is not allowed.

---

### 3️⃣ `never` (Function never finishes)

```ts
function throwError(msg: string): never {
  throw new Error(msg);
}
```

Used when:

* Function always throws
* Infinite loop

---

### 4️⃣ `any` (Avoid)

```ts
function parse(input: string): any {
  return JSON.parse(input);
}
```

❌ No safety
✔ Only for quick prototyping

---

### 5️⃣ `unknown` (Preferred over `any`)

```ts
function parse(input: string): unknown {
  return JSON.parse(input);
}
```

Caller must validate.

---

## 5. Returning Objects

```ts
function getUser(): { id: number; name: string } {
  return {
    id: 1,
    name: "Riyaz"
  };
}
```

✔ Structure enforced
✔ Extra/missing fields cause errors

---

## 6. Using Type Alias / Interface for Return Types

### Type Alias

```ts
type User = {
  id: number;
  name: string;
};

function getUser(): User {
  return { id: 1, name: "Riyaz" };
}
```

✔ Clean
✔ Reusable

---

## 7. Union Return Types

```ts
function getStatus(code: number): string | number {
  return code === 200 ? "OK" : code;
}
```

Caller must handle both types.

---

## 8. Tuple Return Types

Used when returning **multiple fixed values**.

```ts
function getCoordinates(): [number, number] {
  return [10, 20];
}
```

---

## 9. Function Returning Function

```ts
function multiplier(factor: number): (value: number) => number {
  return (value) => value * factor;
}
```

---

## 10. Async Function Return Types

Async functions always return a **Promise**.

```ts
async function fetchData(): Promise<string> {
  return "data";
}
```

❌ Wrong

```ts
async function fetchData(): string { }
```

---

## 11. Arrow Function Return Types

```ts
const sum = (a: number, b: number): number => {
  return a + b;
};
```

---

## 12. Optional Returns (`undefined`)

```ts
function findUser(id: number): User | undefined {
  if (id === 1) return { id: 1, name: "Riyaz" };
}
```

Caller must check for `undefined`.

---

## 13. Common Mistakes

### ❌ Missing return in all paths

```ts
function test(flag: boolean): number {
  if (flag) return 1;
}
```

### ✅ Correct

```ts
function test(flag: boolean): number {
  return flag ? 1 : 0;
}
```

---

## 14. Best Practices

✔ Explicit return types for public functions
✔ Use `void` instead of returning nothing implicitly
✔ Use `never` for errors
✔ Avoid `any`
✔ Use union or tuple where applicable

---

## 15. Summary

* Return types define **function output**
* TypeScript enforces correctness
* Supports primitives, objects, unions, tuples, promises
* Crucial for maintainable, bug-free code