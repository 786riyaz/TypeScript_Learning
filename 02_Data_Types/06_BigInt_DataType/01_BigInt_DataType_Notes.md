## 1. What is `bigint` in TypeScript?

`bigint` represents **integers of arbitrary size**—numbers that exceed the safe limits of JavaScript `number`.

```ts
let value: bigint = 123456789012345678901234567890n;
```

Key point:

* `bigint` is for **whole numbers only**
* No decimals allowed

---

## 2. Why `bigint` Exists (The Core Problem)

JavaScript `number` is limited to:

```ts
Number.MAX_SAFE_INTEGER; // 9007199254740991 (2^53 - 1)
```

Beyond this limit, numbers **lose precision**:

```ts
9007199254740992 === 9007199254740993; // true ❌
```

`bigint` solves this problem.

---

## 3. How to Create a `bigint`

### a) Using `n` suffix (Most common)

```ts
let id = 9007199254740993n;
```

---

### b) Using `BigInt()` constructor

```ts
let value = BigInt("9007199254740993");
```

⚠️ Decimal strings are not allowed:

```ts
BigInt("10.5"); // ❌ Error
```

---

## 4. `bigint` vs `BigInt` (Critical Difference)

| `bigint`       | `BigInt`              |
| -------------- | --------------------- |
| Primitive type | Constructor / wrapper |
| Recommended    | Used only to create   |
| Safer          | Avoid storing as type |

```ts
let a: bigint = 10n; // ✅
let b: BigInt = 10n; // ❌ Avoid
```

Always use lowercase **`bigint`** as the type.

---

## 5. Arithmetic with `bigint`

Supported operators:

* `+`
* `-`
* `*`
* `/`
* `%`
* `**`

```ts
let a = 10n;
let b = 3n;

a + b; // 13n
a / b; // 3n (integer division!)
```

⚠️ Division **truncates decimals**.

---

## 6. Mixing `bigint` and `number` (Not Allowed)

```ts
10n + 5; // ❌ TypeError
```

You must convert explicitly.

### Convert `number` → `bigint`

```ts
BigInt(10);
```

### Convert `bigint` → `number` (Risky)

```ts
Number(10n);
```

⚠️ May lose precision.

---

## 7. Comparison with `number`

```ts
10n === 10; // false
10n == 10;  // true (avoid!)
```

Always use strict equality.

```ts
10n > 5; // true
```

---

## 8. `bigint` in Functions

```ts
function add(a: bigint, b: bigint): bigint {
  return a + b;
}
```

Used in:

* Financial systems
* Blockchain
* Counters
* Databases with BIGINT columns

---

## 9. `bigint` in Objects & APIs

```ts
type Transaction = {
  id: bigint;
  amount: bigint;
};
```

⚠️ JSON does NOT support `bigint`.

```ts
JSON.stringify({ id: 10n }); // ❌ Error
```

Solution:

```ts
JSON.stringify({ id: id.toString() });
```

---

## 10. `bigint` vs `number` (Decision Table)

| Use Case                  | Choose   |
| ------------------------- | -------- |
| Normal calculations       | `number` |
| Decimal values            | `number` |
| IDs beyond safe limit     | `bigint` |
| Financial ledger          | `bigint` |
| Performance-critical math | `number` |

---

## 11. `bigint` with Strict Mode

TypeScript enforces safety:

```ts
let x: bigint = 10n;
x = 10; // ❌ Error
```

Prevents silent bugs.

---

## 12. `bigint` Limitations (Must Know)

❌ No decimals
❌ Not serializable in JSON
❌ Cannot mix with `number`
❌ Not supported in older browsers

---

## 13. Common Mistakes

❌ Forgetting `n` suffix
❌ Mixing `number` and `bigint`
❌ Using `==` instead of `===`
❌ Returning `bigint` in REST APIs

---

## 14. When You SHOULD Use `bigint`

* Database IDs (`BIGINT`)
* Blockchain balances
* Cryptographic counters
* Large financial calculations

---

## 15. When You SHOULD NOT Use `bigint`

* UI values
* Prices with decimals
* JSON-heavy APIs
* Math-heavy real-time systems

---

## 16. Interview-Ready Summary

* `bigint` handles integers of unlimited size
* Solves `Number.MAX_SAFE_INTEGER` problem
* Cannot mix with `number`
* Not JSON-compatible
* Best for precision-critical domains

---

## 17. Golden Rule

> **If precision matters more than performance, use `bigint`.
> If decimals exist, do NOT use `bigint`.**