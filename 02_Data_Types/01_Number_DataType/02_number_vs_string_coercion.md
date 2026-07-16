## 1. What is Coercion?

**Type coercion** means JavaScript **automatically converts one data type into another** during an operation.

TypeScript **does not change coercion rules** — it only **warns you at compile time**.

---

## 2. String → Number Coercion

### a) Using `Number()`

```ts
const value = "42";
const num = Number(value); // 42
```

If conversion fails:

```ts
Number("abc"); // NaN
```

TypeScript allows this, but **you must handle `NaN` manually**.

---

### b) Unary `+` Operator

```ts
+"123";   // 123
+"12.5";  // 12.5
+"abc";   // NaN
```

Fast but **less readable**. Use sparingly.

---

### c) `parseInt` / `parseFloat`

```ts
parseInt("10px");    // 10
parseFloat("10.5px"); // 10.5
```

Important caveat:

```ts
parseInt("10.9"); // 10 (decimal lost)
```

Always specify radix:

```ts
parseInt("10", 10);
```

---

## 3. Number → String Coercion

### a) Using `String()`

```ts
String(123); // "123"
```

### b) `.toString()`

```ts
(123).toString(); // "123"
```

⚠️ Unsafe if value may be `null` or `undefined`.

---

### c) Concatenation with `+`

```ts
10 + "5"; // "105"
```

This is **implicit coercion** and **a common bug source**.

---

## 4. Mixed Operations (Very Important)

### `+` behaves differently than other operators

| Expression | Result | Reason                   |
| ---------- | ------ | ------------------------ |
| `"5" + 2`  | `"52"` | String concatenation     |
| `"5" - 2`  | `3`    | String coerced to number |
| `"5" * 2`  | `10`   | Numeric operation        |
| `"5" / 2`  | `2.5`  | Numeric operation        |

**Rule:**
If **any operand is a string**, `+` becomes concatenation.

---

## 5. Equality & Coercion (`==` vs `===`)

### ❌ Loose Equality (`==`)

```ts
"5" == 5;   // true
"" == 0;    // true
null == undefined; // true
```

This uses coercion → **dangerous**.

---

### ✅ Strict Equality (`===`)

```ts
"5" === 5; // false
```

**Always use `===` in TypeScript projects.**

---

## 6. TypeScript’s Role in Coercion

TypeScript **prevents unsafe operations** when types are known.

```ts
let a: number = 10;
let b: string = "5";

a + b; // ❌ Error (with strict mode)
```

But TypeScript **cannot stop runtime coercion** if types are unknown:

```ts
function add(x: any, y: any) {
  return x + y; // runtime coercion risk
}
```

---

## 7. Safe Conversion Patterns (Recommended)

### a) Explicit Conversion + Validation

```ts
function toNumber(value: string): number | null {
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}
```

---

### b) Handling User Input

```ts
const input = "123";
const value = Number(input);

if (Number.isNaN(value)) {
  throw new Error("Invalid number");
}
```

---

## 8. Template Literals (Safe String Conversion)

```ts
const count = 5;
const message = `Total: ${count}`;
```

Preferred over `+` concatenation.

---

## 9. Real-World Bug Examples

### ❌ Silent Bug

```ts
let total = 10;
total += "5"; // "105"
```

### ✅ Correct

```ts
total += Number("5");
```

---

## 10. Interview-Ready Summary

* JavaScript **automatically coerces** between `number` and `string`
* `+` is **string-biased**
* Other operators (`-`, `*`, `/`) force numeric coercion
* TypeScript **warns**, but **cannot prevent runtime coercion**
* Always prefer:

  * Explicit conversion
  * `===`
  * Template literals
  * `Number.isNaN()` checks

---

## 11. Golden Rule (Memorize This)

> **Never rely on implicit coercion.
> Always convert explicitly.**