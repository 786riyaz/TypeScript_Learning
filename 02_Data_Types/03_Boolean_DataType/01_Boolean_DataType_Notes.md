## 1. What is `boolean` in TypeScript?

In TypeScript, **`boolean` represents logical truth values**.

```ts
let isActive: boolean = true;
let isAdmin: boolean = false;
```

At runtime, it maps directly to JavaScript’s **Boolean primitive**.

Only **two valid values** exist:

* `true`
* `false`

---

## 2. `boolean` vs `Boolean` (Critical Difference)

| `boolean`             | `Boolean`           |
| --------------------- | ------------------- |
| Primitive type        | Object wrapper      |
| Recommended           | Avoid               |
| `true` / `false` only | Can be truthy/falsy |

```ts
let a: boolean = true;    // ✅
let b: Boolean = false;  // ❌
```

⚠️ **Dangerous case**:

```ts
const b = new Boolean(false);
if (b) {
  // This block EXECUTES
}
```

Always use lowercase **`boolean`**.

---

## 3. Boolean Expressions (Where booleans come from)

Most booleans are **results of expressions**, not literals.

### a) Comparison operators

```ts
10 > 5;     // true
10 === 5;   // false
```

---

### b) Logical operators

```ts
true && false; // false
true || false; // true
!true;         // false
```

---

### c) Function return values

```ts
function isEven(n: number): boolean {
  return n % 2 === 0;
}
```

---

## 4. Truthy and Falsy Values (JavaScript Reality)

JavaScript has **truthy/falsy**, but TypeScript `boolean` does NOT.

### Falsy values in JavaScript:

* `false`
* `0`
* `""`
* `null`
* `undefined`
* `NaN`

```ts
if ("") {
  // ❌ will not run
}
```

⚠️ **Important**

```ts
let flag: boolean = "yes"; // ❌ TypeScript error
```

TypeScript prevents accidental truthy/falsy misuse.

---

## 5. Boolean Coercion (Explicit vs Implicit)

### a) Explicit conversion (Recommended)

```ts
Boolean(1);      // true
Boolean(0);      // false
Boolean("text"); // true
Boolean("");     // false
```

---

### b) Double negation (`!!`)

```ts
!!"hello"; // true
!!0;       // false
```

Readable in advanced code, but avoid for beginners.

---

## 6. Boolean in Conditions (Best Practices)

### ❌ Bad (implicit coercion)

```ts
if (value) { }
```

### ✅ Good (explicit comparison)

```ts
if (value !== undefined) { }
```

Or:

```ts
if (isActive === true) { }
```

---

## 7. Boolean with `strict` Mode

With `"strict": true`, TypeScript ensures conditions are safe.

```ts
let done: boolean | undefined;

if (done) {
  // ❌ Error in strict mode
}
```

Correct:

```ts
if (done === true) { }
```

---

## 8. Boolean Literal Types (Very Important)

```ts
type LoadingState = true | false;
```

Usually implicit, but useful with unions.

### Practical example:

```ts
type ApiResult =
  | { success: true; data: string }
  | { success: false; error: string };
```

This is a **discriminated union**, heavily used in production.

---

## 9. Boolean in Objects & APIs

```ts
type User = {
  isActive: boolean;
  isVerified: boolean;
};
```

APIs frequently return booleans:

```json
{
  "success": true,
  "isAdmin": false
}
```

---

## 10. Boolean in Arrays

```ts
let flags: boolean[] = [true, false, true];
```

---

## 11. Boolean vs Logical Operators (Short-circuiting)

```ts
isLoggedIn && showDashboard();
```

* If `isLoggedIn` is false, function is NOT called.

```ts
isAdmin || redirect();
```

* Executes `redirect()` only if `isAdmin` is false.

---

## 12. Common Boolean Bugs

### ❌ Comparing with loose equality

```ts
if (value == true) { }
```

### ❌ Using Boolean object

```ts
new Boolean(false);
```

### ❌ Depending on truthy/falsy

```ts
if (count) { } // count = 0 breaks logic
```

---

## 13. Boolean with Optional & Default Values

```ts
function setFlag(enabled: boolean = true) {
  return enabled;
}
```

Default parameters work cleanly with booleans.

---

## 14. When to Use `boolean`

Use `boolean` for:

* Flags
* Feature toggles
* Permissions
* Validation results

Avoid using boolean when:

* State has more than 2 possibilities → use union strings

---

## 15. Interview-Ready Summary

* `boolean` has only `true` and `false`
* Avoid `Boolean` object
* TypeScript prevents truthy/falsy mistakes
* Explicit comparisons are safer than implicit checks
* Boolean literal unions power discriminated unions

---

## 16. Golden Rule

> **Booleans must represent facts, not guesses.
> Avoid implicit truthiness. Be explicit.**