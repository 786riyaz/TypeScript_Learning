Below is a **complete, structured explanation of the `number` data type in TypeScript**, covering **concepts you must know**, **how it behaves**, **common pitfalls**, and **best practices**. This is written from a practical developer perspective.

---

## 1. What is `number` in TypeScript?

In TypeScript, **`number` represents all numeric values**.

There is **only one numeric type**, unlike some languages that distinguish between `int`, `float`, `double`, etc.

```ts
let age: number = 25;
let price: number = 99.99;
let temperature: number = -10;
```

Internally, **TypeScript numbers follow JavaScript’s `Number` type**, which is based on **IEEE-754 double-precision floating-point format**.

---

## 2. Types of Values `number` Can Hold

### a) Integers

```ts
let count: number = 10;
```

### b) Floating-point numbers

```ts
let pi: number = 3.14159;
```

### c) Negative numbers

```ts
let debt: number = -500;
```

### d) Scientific notation

```ts
let distance: number = 5e6; // 5,000,000
```

### e) Special numeric values

```ts
let a: number = Infinity;
let b: number = -Infinity;
let c: number = NaN;
```

---

## 3. `number` vs JavaScript Runtime Reality (Very Important)

TypeScript **does not change runtime behavior**.

```ts
let result: number = 0.1 + 0.2;
console.log(result); // 0.30000000000000004
```

This is **not a TypeScript bug**—it is a **floating-point precision issue** in JavaScript itself.

### Best Practice

For financial calculations:

* Use integers (cents instead of rupees)
* Or use libraries like `decimal.js`

---

## 4. Type Inference with `number`

TypeScript can infer `number` automatically.

```ts
let score = 100; // inferred as number
```

Explicit typing is recommended when:

* Writing public APIs
* Declaring function parameters
* Working in strict codebases

---

## 5. `number` in Functions

### Parameter and return type

```ts
function add(a: number, b: number): number {
  return a + b;
}
```

### What happens if you return a wrong type?

```ts
function square(n: number): number {
  return "wrong"; // ❌ Type error
}
```

---

## 6. `number` with Strict Mode

With `"strict": true`, TypeScript **prevents unsafe usage**.

```ts
let value: number;
value = "10"; // ❌ Error
```

Without strict typing, JavaScript would silently allow this.

---

## 7. `number` vs `Number` (Critical Difference)

| `number`       | `Number`       |
| -------------- | -------------- |
| Primitive type | Wrapper object |
| Recommended    | Avoid using    |
| Faster & safer | Can cause bugs |

```ts
let a: number = 10;     // ✅ Correct
let b: Number = 10;    // ❌ Avoid
```

Always use **lowercase `number`**.

---

## 8. Numeric Operations

All arithmetic operators work with `number`.

```ts
let a = 10 + 5;
let b = 10 - 5;
let c = 10 * 5;
let d = 10 / 5;
let e = 10 % 3;
```

---

## 9. Comparison Operators with `number`

```ts
let x = 10;
let y = 20;

x > y;   // false
x <= y;  // true
x === y; // false
```

TypeScript ensures both sides are numbers when typed.

---

## 10. `number` with Arrays

```ts
let marks: number[] = [90, 85, 78];
```

Invalid values are rejected:

```ts
marks.push("100"); // ❌ Error
```

---

## 11. Union Types Involving `number`

Very common in real projects.

```ts
let id: number | string;

id = 101;
id = "A101";
```

Used heavily with APIs and databases.

---

## 12. Literal Numbers (Advanced but Important)

```ts
let dice: 1 | 2 | 3 | 4 | 5 | 6;
dice = 3; // ✅
dice = 7; // ❌
```

Useful for:

* Enums without enums
* Validation logic
* Finite state values

---

## 13. `number` vs `bigint`

| `number`                   | `bigint`            |
| -------------------------- | ------------------- |
| Max safe value: `2^53 - 1` | Arbitrary precision |
| Faster                     | Slower              |
| Common use                 | Large integers      |

```ts
let safe: number = 9007199254740991;
let big: bigint = 9007199254740991n;
```

Use `bigint` when precision matters beyond safe limits.

---

## 14. Common Mistakes to Avoid

### ❌ Assuming integers are precise

```ts
0.1 + 0.2 !== 0.3
```

### ❌ Using `Number` instead of `number`

### ❌ Trusting user input

```ts
const value: number = Number(input);
```

Always validate `NaN`.

---

## 15. When to Use `number`

Use `number` for:

* Counts
* Prices (with care)
* Measurements
* Indexes
* IDs (if numeric)

Avoid for:

* Very large integers
* Financial calculations needing exact precision

---

## 16. Key Takeaways (Interview-Ready)

* TypeScript has **one numeric type: `number`**
* It is **IEEE-754 floating-point**
* Always prefer **`number` over `Number`**
* Be aware of **precision issues**
* Combine with **union, literal, and strict typing** for safety
