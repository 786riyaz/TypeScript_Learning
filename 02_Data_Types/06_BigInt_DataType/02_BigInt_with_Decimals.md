## 1. Why `bigint` Is Not Suitable for Decimals

`bigint` is designed purely for **integer arithmetic**. It does not store fractional parts. Therefore, any division or operation that would produce a decimal is truncated to an integer.

---

## 2. The Right Tool: Arbitrary-Precision Decimal Libraries

For large or precise decimal calculations, you typically use a **dedicated arbitrary-precision library**. Examples include:

* **`decimal.js`:** A popular library for arbitrary-precision decimals in JavaScript/TypeScript.
* **`big.js`:** Another lightweight library for working with decimals with arbitrary precision.
* **`bignumber.js`:** Offers similar functionality and is often used in financial applications.

---

## 3. Using `decimal.js` for High-Precision Decimals

Here is a practical example of how to use `decimal.js` in a TypeScript project:

### a) Install the Library

```bash
npm install decimal.js
```

### b) Import and Use It

```ts
import Decimal from 'decimal.js';

const a = new Decimal('12345678901234567890.123456789');
const b = new Decimal('987654321098765432.098765432');

const sum = a.plus(b);
console.log(sum.toString()); // Outputs the precise sum as a string
```

### Why Use a Library?

* These libraries handle **both very large numbers and decimal fractions** accurately.
* They provide methods for addition, subtraction, multiplication, division, and more without losing precision.

---

## 4. Key Differences: `bigint` vs Decimal Libraries

| Aspect             | `bigint`                            | Decimal Libraries (`decimal.js`)         |
| ------------------ | ----------------------------------- | ---------------------------------------- |
| Supports Decimals  | No                                  | Yes                                      |
| Precision          | Arbitrary for integers only         | Arbitrary for both integers and decimals |
| Usage Scenarios    | Large whole numbers (IDs, counters) | Financial calculations, scientific data  |
| JSON Compatibility | No                                  | Can be converted to strings easily       |

---

## 5. Practical Applications

* **Financial Systems:** When you need to handle currency calculations without floating-point errors, libraries like `decimal.js` ensure exact decimal arithmetic.
* **Scientific Calculations:** For computations that require a high degree of accuracy with fractional values.
* **Cryptography & Blockchain:** While `bigint` is often used for large integers, any scenario requiring precise fractional arithmetic uses a decimal library.

---

## 6. Best Practices

* **Use `bigint` for large integers only:** For example, large counters, unique IDs, or any integer values beyond `Number.MAX_SAFE_INTEGER`.
* **Use a decimal library for precise decimals:** Any time you need exact arithmetic with fractions, like financial calculations, rely on a library designed for that purpose.
* **Convert to string for JSON:** When working with APIs, convert your `Decimal` values to strings before serialization.

---

## 7. Interview-Ready Summary

* `bigint` handles large whole numbers without decimals.
* For large or precise decimal numbers, use libraries like `decimal.js`.
* These libraries ensure exact decimal arithmetic and avoid floating-point precision issues.
* Always choose the right tool based on whether you need integer-only precision (`bigint`) or decimal precision (arbitrary-precision libraries).

---

## 8. Golden Rule

> **Use `bigint` for integers.
> Use an arbitrary-precision decimal library for decimals.
> Never rely on standard `number` for high-precision decimals.**