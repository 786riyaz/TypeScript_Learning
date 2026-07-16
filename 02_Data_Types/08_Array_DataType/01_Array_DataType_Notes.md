## 1. What is an Array in TypeScript?

An **array** represents an **ordered collection of values of the same type**.

```ts
let numbers: number[] = [1, 2, 3];
```

At runtime, TypeScript arrays are **JavaScript arrays**:

* Zero-based indexed
* Dynamic size
* Mutable (unlike strings)

---

## 2. Ways to Declare Arrays (Must Know)

### a) Using `type[]` (Most Common)

```ts
let names: string[] = ["A", "B"];
```

### b) Using `Array<T>` (Generic Form)

```ts
let names: Array<string> = ["A", "B"];
```

Both are equivalent.
**Best practice:** Use `type[]` for readability.

---

## 3. Type Inference with Arrays

```ts
let scores = [90, 80, 70];
```

TypeScript infers:

```ts
number[]
```

⚠️ Mixed values cause union inference:

```ts
let data = [1, "a"]; // (number | string)[]
```

---

## 4. Arrays Are Mutable (Important)

```ts
let arr = [1, 2, 3];
arr.push(4); // allowed
```

This mutability is a **major source of bugs** in large systems.

---

## 5. Array Indexing & Safety

```ts
let values: number[] = [10, 20];
values[0]; // number
values[5]; // undefined at runtime
```

With strict options:

```ts
// if "noUncheckedIndexedAccess": true
values[5]; // number | undefined
```

This forces safe access:

```ts
if (values[5] !== undefined) { }
```

---

## 6. Common Array Methods (Must Know)

### a) Mutating methods

```ts
arr.push(4);
arr.pop();
arr.shift();
arr.unshift(1);
arr.splice(1, 1);
```

These **modify the original array**.

---

### b) Non-mutating methods (Preferred)

```ts
arr.map(x => x * 2);
arr.filter(x => x > 2);
arr.slice(0, 2);
arr.concat([4, 5]);
```

These **return new arrays**.

---

## 7. Arrays with Objects

```ts
type User = {
  id: number;
  name: string;
};

let users: User[] = [
  { id: 1, name: "Riyaz" }
];
```

This is extremely common in real projects.

---

## 8. Arrays and Functions

### a) Array as parameter

```ts
function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}
```

---

### b) Returning arrays

```ts
function getNames(): string[] {
  return ["A", "B"];
}
```

---

## 9. Readonly Arrays (Very Important)

Prevent accidental mutation.

```ts
const nums: readonly number[] = [1, 2, 3];
```

Now:

```ts
nums.push(4); // ❌ Error
```

Also available as:

```ts
ReadonlyArray<number>
```

Highly recommended for:

* Function parameters
* Redux state
* Configuration data

---

## 10. Tuple vs Array (Key Difference)

| Array           | Tuple              |
| --------------- | ------------------ |
| Variable length | Fixed length       |
| Same type       | Specific types     |
| `number[]`      | `[number, string]` |

```ts
let arr: number[] = [1, 2, 3];
let tup: [number, string] = [1, "A"];
```

---

## 11. Union Arrays

```ts
let data: (number | string)[] = [1, "A"];
```

Each element can be **either type**.

---

## 12. Array Destructuring

```ts
const [first, second] = [10, 20];
```

With defaults:

```ts
const [a = 0, b = 0] = [];
```

---

## 13. Spread Operator with Arrays

```ts
const a = [1, 2];
const b = [...a, 3, 4];
```

Preferred over `push` for immutability.

---

## 14. Arrays and `any` (Danger Zone)

```ts
let arr: any[] = [1, "a", true];
```

Avoid this. It removes all type safety.

---

## 15. Arrays and `unknown` (Safer Alternative)

```ts
let arr: unknown[] = [1, "a"];
```

Forces type checks before use.

---

## 16. Arrays in JSON & APIs

```json
[
  { "id": 1 },
  { "id": 2 }
]
```

Typically mapped as:

```ts
User[]
```

---

## 17. Performance Considerations

* `map`, `filter`, `reduce` are readable but create new arrays
* Use mutating methods only when necessary
* Prefer immutability in UI/state systems

---

## 18. Common Mistakes

❌ Forgetting union parentheses
❌ Using `any[]`
❌ Mutating shared arrays
❌ Unsafe index access

---

## 19. When to Use Arrays

Use arrays for:

* Ordered lists
* Collections of same-type data
* Iteration-heavy data

Avoid arrays for:

* Key-value lookups → use objects or `Map`

---

## 20. Interview-Ready Summary

* Arrays are ordered, mutable collections
* Use `type[]` syntax
* Prefer `readonly` arrays
* Use non-mutating methods
* Enable `noUncheckedIndexedAccess`

---

## 21. Golden Rule

> **If data should not change, make the array `readonly`.
> Mutation is the root of most array bugs.**

---

If you want next, I can explain:

* Tuples in depth
* Array vs `Map` / `Set`
* Advanced array typing patterns
* Functional programming with arrays in TypeScript
