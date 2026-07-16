## 1. What is `null` in TypeScript?

`null` represents the **intentional absence of a value**.

```ts
let value: null = null;
```

It means:

* “This variable has no value **by design**”
* Not “missing”
* Not “not initialized”

---

## 2. `null` vs JavaScript Reality

In JavaScript:

```js
typeof null; // "object" ❌ (historical bug)
```

In TypeScript:

* `null` is its **own type**
* It is **not an object**

---

## 3. `null` vs `undefined` (Conceptual Difference)

| `null`               | `undefined`        |
| -------------------- | ------------------ |
| Explicitly assigned  | Implicitly missing |
| Intentional absence  | Not provided       |
| Developer-controlled | System-controlled  |

```ts
let a = null;       // explicit
let b;             // undefined
```

**Rule of thumb**:

* Use `null` when you **set** “no value”
* Use `undefined` when something is **not yet provided**

---

## 4. `null` and `strictNullChecks` (Very Important)

With `"strict": true` → `strictNullChecks` is enabled.

```ts
let name: string = null; // ❌ Error
```

Correct:

```ts
let name: string | null = null;
```

This is one of the **biggest safety features** of TypeScript.

---

## 5. Union Types with `null` (Common Pattern)

```ts
let user: User | null = null;
```

Used when:

* Data is loaded asynchronously
* Something may or may not exist

Example:

```ts
if (user !== null) {
  console.log(user.name);
}
```

---

## 6. `null` in Functions

### a) Function returns `null`

```ts
function findUser(id: number): User | null {
  return database[id] ?? null;
}
```

---

### b) Handling returned `null`

```ts
const user = findUser(1);

if (user === null) {
  // handle not found
}
```

---

## 7. `null` vs Optional Properties

### Optional property (`?`)

```ts
type User = {
  email?: string;
};
```

### Explicit `null`

```ts
type User = {
  email: string | null;
};
```

| Case             | Meaning          |
| ---------------- | ---------------- |
| `email?: string` | May not exist    |
| `email: null`    | Exists but empty |

APIs often distinguish these.

---

## 8. `null` in JSON & APIs

JSON supports `null`.

```json
{
  "middleName": null
}
```

This means:

* Field exists
* Value is intentionally empty

Very common in REST APIs and databases.

---

## 9. Checking for `null` Safely

### ❌ Unsafe

```ts
if (value) { }
```

### ✅ Safe

```ts
if (value !== null) { }
```

---

### Nullish coalescing (`??`)

```ts
const name = user.name ?? "Guest";
```

* Only replaces `null` or `undefined`
* Does NOT affect `0`, `false`, `""`

---

## 10. Optional Chaining with `null`

```ts
user?.profile?.email;
```

Prevents runtime crashes if value is `null`.

---

## 11. `null` vs `undefined` in APIs (Best Practice)

**Choose one and stay consistent.**

Recommended:

* Use `null` for **empty values**
* Use `undefined` for **missing values**

Avoid mixing without reason.

---

## 12. Common Mistakes with `null`

❌ Forgetting to add `| null`
❌ Using loose equality (`== null`)
❌ Assuming `null` behaves like `false`
❌ Ignoring strict null checks

---

## 13. `null` with Equality Operators

```ts
null == undefined;  // true ❌
null === undefined; // false ✅
```

Always use **`===`**.

---

## 14. When to Use `null`

Use `null` when:

* Value is intentionally empty
* Resetting a field
* Representing “not found”

Do NOT use `null`:

* When value is optional
* For uninitialized variables

---

## 15. Interview-Ready Summary

* `null` means **intentional absence**
* Requires union types in strict mode
* Different from `undefined`
* Common in APIs & databases
* Use explicit checks

---

## 16. Golden Rule

> **`null` is a deliberate decision, not a mistake.
> If you use it, model it explicitly in the type.**