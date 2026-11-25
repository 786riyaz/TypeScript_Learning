# TypeScript Complete Learning Roadmap
# Phase 15: Generic Constraints, keyof, and Advanced Generic Techniques

**Level:** Intermediate to Advanced  
**Prerequisite:** Phase 14 – Generics in TypeScript  
**Goal:** Learn how to restrict generic types, control which values can be passed to generic functions, and safely access object properties using `keyof` and generic constraints.

---

# 1. What Are Generic Constraints?

In the previous phase, we learned that generics allow us to create reusable functions that work with different types.

For example:

```typescript
function display<T>(value: T): T {
    return value;
}
```

This function accepts almost any type.

But sometimes we want to restrict which types can be passed.

Consider:

```typescript
function getLength<T>(value: T): number {
    return value.length;
}
```

This produces an error.

Why?

Because TypeScript doesn't know whether `T` has a `length` property.

For example:

```typescript
getLength("Hello"); // Has length

getLength([10, 20]); // Has length

getLength(100); // Does not have length
```

We need to tell TypeScript that `T` must have a `length` property.

This is where **Generic Constraints** come in.

Generic constraints allow us to restrict generic type parameters to types that satisfy a particular requirement.

The keyword used for this is:

```typescript
extends
```

### Basic Syntax

```typescript
function functionName<T extends SomeType>(value: T) {
    // Function implementation
}
```

It means:

`T` can be any type that satisfies the requirements of `SomeType`.

**Important:** In generic constraints, `extends` means "must be compatible with" rather than necessarily inheriting from a class.

---

# 2. Why Do We Need Generic Constraints?

Let's understand the problem with a practical example.

### Without Generic Constraints

```typescript
function getLength<T>(value: T): number {
    return value.length;
}
```

TypeScript reports an error because `T` could be a number, boolean, or another type without a `length` property.

### With Generic Constraints

```typescript
function getLength<T extends { length: number }>(
    value: T
): number {
    return value.length;
}
```

Now TypeScript understands that `T` must contain a `length` property of type `number`.

Usage:

```typescript
getLength("Hello"); // Valid

getLength([10, 20, 30]); // Valid

getLength({
    name: "Alex",
    length: 100
}); // Valid
```

Invalid:

```typescript
getLength(100); // Error

getLength(true); // Error
```

### Why Are These Valid?

| Value | Has `length: number`? | Result |
|---|---|---|
| `"Hello"` | Yes | Valid |
| `[10, 20, 30]` | Yes | Valid |
| `{ name: "Alex", length: 100 }` | Yes | Valid |
| `100` | No | Error |
| `true` | No | Error |

**Key takeaway:** Generic constraints let you use specific properties and methods safely inside generic functions.

---

# 3. Using extends With Primitive Types

You can restrict generics to primitive types.

### Example 1: String Constraint

```typescript
function display<T extends string>(value: T): T {
    console.log(value.toUpperCase());
    return value;
}
```

Usage:

```typescript
display("Hello"); // Valid

// Error
display(100);
```

### Example 2: Number Constraint

```typescript
function calculate<T extends number>(value: T): T {
    console.log(value.toFixed(2));
    return value;
}
```

Usage:

```typescript
calculate(100);
calculate(25.5);

// Error
calculate("100");
```

### Example 3: Union Constraint

You can constrain a generic to a union of types.

```typescript
function display<T extends string | number>(value: T): T {
    console.log(value);
    return value;
}
```

Usage:

```typescript
display("Hello");
display(100);

// Error
display(true);
```

### Example 4: Literal Union Constraint

```typescript
type UserRole = "admin" | "manager" | "customer";

function createUser<T extends UserRole>(role: T): T {
    return role;
}
```

Usage:

```typescript
createUser("admin");
createUser("customer");

// Error
createUser("developer");
```

---

# 4. Constraining Generic Objects

You can restrict a generic parameter to objects with specific properties.

### Example 1: Object With an ID

```typescript
function getId<T extends { id: number }>(value: T): number {
    return value.id;
}
```

Usage:

```typescript
getId({
    id: 1,
    name: "Alex"
});

getId({
    id: 2,
    price: 500
});
```

Both are valid because both objects have an `id` property of type `number`.

Invalid:

```typescript
getId({
    name: "Alex"
});
```

This object does not have an `id` property.

### Example 2: Multiple Required Properties

```typescript
function displayUser<
    T extends {
        id: number;
        name: string;
    }
>(user: T) {
    console.log(user.id);
    console.log(user.name);
}
```

Usage:

```typescript
displayUser({
    id: 1,
    name: "Alex"
});
```

You can also pass objects with additional properties:

```typescript
displayUser({
    id: 2,
    name: "John",
    email: "john@example.com",
    age: 25
});
```

This is valid because the object satisfies the required structure.

### Important Concept: Structural Typing

TypeScript uses structural typing.

It generally cares about whether an object has the required properties and compatible types, rather than whether it was created from a particular named interface.

For example:

```typescript
type User = {
    id: number;
    name: string;
};

type Product = {
    id: number;
    name: string;
    price: number;
};
```

Both can satisfy:

```typescript
T extends {
    id: number;
    name: string;
}
```

---

# 5. Generic Constraints With Interfaces

You can use interfaces to define generic constraints.

This is useful when the required object structure is complex or reused across multiple functions.

### Example 1: Basic Interface Constraint

```typescript
interface HasId {
    id: number;
}

function getId<T extends HasId>(value: T): number {
    return value.id;
}
```

Usage:

```typescript
const user = {
    id: 1,
    name: "Alex"
};

const product = {
    id: 101,
    price: 500
};

getId(user);
getId(product);
```

Both objects satisfy the `HasId` interface.

### Example 2: Multiple Properties

```typescript
interface UserInfo {
    id: number;
    name: string;
    email: string;
}

function displayInfo<T extends UserInfo>(user: T) {
    console.log(user.id);
    console.log(user.name);
    console.log(user.email);
}
```

Usage:

```typescript
displayInfo({
    id: 1,
    name: "Alex",
    email: "alex@example.com",
    age: 25
});
```

Additional properties are allowed.

### Example 3: Interface With Optional Properties

```typescript
interface HasContact {
    name: string;
    email?: string;
}

function displayContact<T extends HasContact>(value: T) {
    console.log(value.name);

    if (value.email !== undefined) {
        console.log(value.email);
    }
}
```

Usage:

```typescript
displayContact({
    name: "Alex",
    email: "alex@example.com"
});

displayContact({
    name: "John"
});
```

The optional property remains optional inside the generic function.

---

# 6. Generic Constraints With Type Aliases

You can also use type aliases for generic constraints.

### Example 1

```typescript
type HasName = {
    name: string;
};

function getName<T extends HasName>(value: T): string {
    return value.name;
}
```

Usage:

```typescript
getName({
    name: "Alex"
});

getName({
    name: "John",
    age: 25
});
```

### Example 2: Product Constraint

```typescript
type ProductInfo = {
    id: number;
    name: string;
    price: number;
};

function displayProduct<T extends ProductInfo>(product: T) {
    console.log(product.name);
    console.log(product.price);
}
```

Usage:

```typescript
displayProduct({
    id: 1,
    name: "Laptop",
    price: 50000
});
```

### Interface vs Type Alias in Generic Constraints

Both can be used.

```typescript
interface HasId {
    id: number;
}
```

Or:

```typescript
type HasId = {
    id: number;
};
```

Then:

```typescript
function getId<T extends HasId>(value: T) {
    return value.id;
}
```

For this purpose, both approaches work.

---

# 7. What Is the keyof Operator?

The `keyof` operator is a TypeScript operator that extracts the property names of an object type and creates a union of those property names.

Let's understand it.

### Example 1: Basic keyof

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};
```

Now:

```typescript
type UserKeys = keyof User;
```

The resulting type is:

```typescript
type UserKeys = "id" | "name" | "email";
```

In other words, `keyof` extracts the keys of an object type.

### Example 2: Using keyof With Variables

```typescript
type Product = {
    id: number;
    name: string;
    price: number;
    category: string;
};

type ProductKeys = keyof Product;
```

Result:

```typescript
"id" | "name" | "price" | "category"
```

### Example 3: Using keyof With Variables at Runtime

Remember that `keyof` works at the type level.

If you want to get object keys at runtime, use JavaScript:

```typescript
const user = {
    id: 1,
    name: "Alex",
    email: "alex@example.com"
};

console.log(Object.keys(user));
```

Output:

```text
["id", "name", "email"]
```

### Important Difference

| `keyof` | `Object.keys()` |
|---|---|
| TypeScript operator | JavaScript method |
| Works at compile time | Works at runtime |
| Produces a union of property key types | Returns an array of strings |
| Used for type-safe property access | Used to inspect actual object properties |

---

# 8. keyof With Generic Constraints

Now let's combine `keyof` with generics.

This is one of the most important patterns in TypeScript.

### Example 1: Basic Usage

```typescript
function getProperty<T, K extends keyof T>(
    object: T,
    key: K
) {
    return object[key];
}
```

Let's understand it step by step.

**Step 1:**

```typescript
T
```

Represents the object type.

**Step 2:**

```typescript
keyof T
```

Extracts all valid keys of that object type.

**Step 3:**

```typescript
K extends keyof T
```

Restricts `K` to one of the valid keys of `T`.

**Step 4:**

```typescript
object[key]
```

Accesses the property using a key that TypeScript knows is valid.

### Example 2: Using getProperty()

```typescript
const user = {
    id: 1,
    name: "Alex",
    email: "alex@example.com",
    age: 25
};
```

Usage:

```typescript
const userName = getProperty(user, "name");

const userAge = getProperty(user, "age");

const userEmail = getProperty(user, "email");
```

Inferred types:

```typescript
userName;  // string
userAge;   // number
userEmail; // string
```

Invalid:

```typescript
getProperty(user, "address");
```

TypeScript reports an error because `"address"` is not a key of `user`.

### Why Is This Useful?

Without `keyof`, you might write:

```typescript
function getProperty(object: any, key: string): any {
    return object[key];
}
```

This loses type safety.

With generics and `keyof`, TypeScript knows which properties are valid and what their respective types are.

---

# 9. Understanding Indexed Access Types

In the previous example, we used:

```typescript
object[key]
```

There is a related TypeScript feature called **Indexed Access Types**.

It allows you to extract the type of a property from another type.

### Example 1: Extracting One Property Type

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};

type UserName = User["name"];
```

Result:

```typescript
type UserName = string;
```

### Example 2: Extracting Multiple Property Types

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};

type UserProperties = User["id" | "name"];
```

Result:

```typescript
type UserProperties = number | string;
```

### Example 3: Extracting All Property Types

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};

type UserValues = User[keyof User];
```

Result:

```typescript
type UserValues = number | string;
```

Why?

Because:

```typescript
keyof User
```

Produces:

```typescript
"id" | "name" | "email"
```

And:

```typescript
User[keyof User]
```

Extracts the corresponding property types.

### Example 4: Combining With Generics

We can improve our previous function by explicitly defining its return type.

```typescript
function getProperty<T, K extends keyof T>(
    object: T,
    key: K
): T[K] {
    return object[key];
}
```

Here:

```typescript
T[K]
```

Means the type of the selected property.

For example:

```typescript
const user = {
    id: 1,
    name: "Alex"
};

const name = getProperty(user, "name");
```

The return type is `string`.

And:

```typescript
const id = getProperty(user, "id");
```

The return type is `number`.

This is a powerful generic programming pattern.

---

# 10. Generic Functions With Object Properties

Let's explore more examples.

### Example 1: Updating an Object Property

```typescript
function updateProperty<
    T,
    K extends keyof T
>(
    object: T,
    key: K,
    value: T[K]
): T {
    object[key] = value;

    return object;
}
```

Usage:

```typescript
const user = {
    id: 1,
    name: "Alex",
    age: 25
};

updateProperty(user, "name", "John");

updateProperty(user, "age", 30);
```

Invalid:

```typescript
updateProperty(user, "age", "Thirty");
```

Why?

Because the type of `user.age` is `number`, so the new value must also be a number.

### Example 2: Generic Property Checker

```typescript
function hasProperty<T, K extends PropertyKey>(
    object: T,
    key: K
): object is T & Record<K, unknown> {
    return (
        object !== null &&
        (typeof object === "object" ||
            typeof object === "function") &&
        key in object
    );
}
```

Usage:

```typescript
const user = {
    id: 1,
    name: "Alex"
};

if (hasProperty(user, "name")) {
    console.log(user.name);
}
```

This is a more advanced type guard.

The `PropertyKey` type represents:

```typescript
string | number | symbol
```

The `Record<K, unknown>` type expresses an object with a property key `K` whose value is unknown.

We will study utility types such as `Record` in a later phase.

---

# 11. Generic Constraints With Multiple Properties

You can require a generic type to contain multiple properties.

### Example 1: User Constraint

```typescript
type UserConstraint = {
    id: number;
    name: string;
};

function displayUser<T extends UserConstraint>(user: T) {
    console.log(user.id);
    console.log(user.name);
}
```

### Example 2: Product Constraint

```typescript
type ProductConstraint = {
    id: number;
    name: string;
    price: number;
};

function calculatePrice<T extends ProductConstraint>(
    product: T
): number {
    return product.price;
}
```

Usage:

```typescript
const product = {
    id: 1,
    name: "Laptop",
    price: 50000,
    category: "Electronics"
};

console.log(calculatePrice(product));
```

The extra `category` property is allowed.

### Example 3: Combining Constraints

You can combine multiple object types using intersections.

```typescript
type HasId = {
    id: number;
};

type HasName = {
    name: string;
};

function display<T extends HasId & HasName>(value: T) {
    console.log(value.id);
    console.log(value.name);
}
```

Usage:

```typescript
display({
    id: 1,
    name: "Alex"
});
```

Here, `T` must satisfy both `HasId` and `HasName`.

---

# 12. Generic Constraints With Unions

A generic constraint can also use a union.

### Example 1: Primitive Union

```typescript
function process<T extends string | number>(value: T): T {
    return value;
}
```

Usage:

```typescript
process("Hello");
process(100);

// Error
process(true);
```

### Example 2: Object Union

```typescript
type Admin = {
    role: "admin";
    permissions: string[];
};

type Customer = {
    role: "customer";
    orders: number;
};

function displayUser<T extends Admin | Customer>(user: T) {
    console.log(user.role);
}
```

Usage:

```typescript
displayUser({
    role: "admin",
    permissions: ["read", "write"]
});

displayUser({
    role: "customer",
    orders: 10
});
```

### Important

A generic constraint using a union allows any type that satisfies at least one member of that union.

However, inside the generic function, you can safely access only properties common to all possibilities unless you narrow the type first.

For example:

```typescript
function displayUser<T extends Admin | Customer>(user: T) {
    console.log(user.role);

    if (user.role === "admin") {
        console.log(user.permissions);
    } else {
        console.log(user.orders);
    }
}
```

The discriminant `role` allows TypeScript to narrow the object.

---

# 13. Default Generic Constraints

Generic parameters can have default types and constraints at the same time.

### Example 1

```typescript
type Container<T extends string | number = string> = {
    value: T;
};
```

Here:

- `T` must be compatible with `string | number`.
- If no type is supplied, `T` defaults to `string`.

Usage:

```typescript
const first: Container = {
    value: "Hello"
};
```

This is valid.

You can override the default:

```typescript
const second: Container<number> = {
    value: 100
};
```

Invalid:

```typescript
// Error
const third: Container<boolean> = {
    value: true
};
```

### Example 2: Generic Function

```typescript
function createValue<T extends string | number = string>(
    value: T
): T {
    return value;
}
```

Usage:

```typescript
createValue("Hello");

createValue<number>(100);
```

The default generic type is used when the type argument is not explicitly supplied and cannot be inferred from another source.

In this function, TypeScript can infer `T` from the argument.

---

# 14. Practical Example: Generic getProperty()

Let's build a reusable utility function.

### Step 1: Define an Object

```typescript
const product = {
    id: 101,
    name: "Laptop",
    price: 50000,
    category: "Electronics",
    inStock: true
};
```

### Step 2: Create a Generic Function

```typescript
function getProperty<T, K extends keyof T>(
    object: T,
    key: K
): T[K] {
    return object[key];
}
```

### Step 3: Access Different Properties

```typescript
const id = getProperty(product, "id");

const name = getProperty(product, "name");

const price = getProperty(product, "price");

const inStock = getProperty(product, "inStock");
```

Inferred types:

| Variable | Type |
|---|---|
| `id` | `number` |
| `name` | `string` |
| `price` | `number` |
| `inStock` | `boolean` |

### Step 4: Try an Invalid Property

```typescript
getProperty(product, "description");
```

TypeScript reports an error.

### Step 5: Create a Generic Setter

```typescript
function setProperty<T, K extends keyof T>(
    object: T,
    key: K,
    value: T[K]
): void {
    object[key] = value;
}
```

Usage:

```typescript
setProperty(product, "name", "Gaming Laptop");

setProperty(product, "price", 75000);

setProperty(product, "inStock", false);
```

Invalid:

```typescript
setProperty(product, "price", "Expensive");
```

The setter ensures that the value matches the selected property's type.

**Important:** This function mutates the supplied object. It is not suitable when the object or property is readonly.

---

# 15. Practical Example: Generic Sorting Function

Let's create a reusable function that sorts an array of objects based on a selected property.

### Step 1: Define the Product Type

```typescript
type Product = {
    id: number;
    name: string;
    price: number;
};
```

### Step 2: Create Sample Data

```typescript
const products: Product[] = [
    {
        id: 1,
        name: "Laptop",
        price: 50000
    },
    {
        id: 2,
        name: "Mouse",
        price: 500
    },
    {
        id: 3,
        name: "Keyboard",
        price: 1500
    }
];
```

### Step 3: Create a Generic Sorting Function

```typescript
function sortByProperty<
    T,
    K extends keyof T
>(
    items: T[],
    key: K
): T[] {
    return [...items].sort((a, b) => {
        const first = a[key];
        const second = b[key];

        if (first < second) {
            return -1;
        }

        if (first > second) {
            return 1;
        }

        return 0;
    });
}
```

There is one additional detail here: TypeScript does not allow `<` and `>` for arbitrary property types.

To make the function safe, we need another constraint.

### Step 4: Restrict the Property Type

```typescript
type Comparable = string | number;

function sortByProperty<
    T,
    K extends keyof T
>(
    items: T[],
    key: K & (T[K] extends Comparable ? K : never)
): T[] {
    return [...items].sort((a, b) => {
        const first = a[key];
        const second = b[key];

        if (first < second) {
            return -1;
        }

        if (first > second) {
            return 1;
        }

        return 0;
    });
}
```

This is an advanced generic pattern.

The parameter type restricts the selected key to properties whose types are compatible with `string | number`.

Usage:

```typescript
const sortedByPrice = sortByProperty(products, "price");

const sortedByName = sortByProperty(products, "name");
```

Invalid:

```typescript
// Error: boolean properties are not comparable here.
sortByProperty(
    [
        { id: 1, active: true },
        { id: 2, active: false }
    ],
    "active"
);
```

**Note:** This implementation is suitable for simple string and number properties. Production sorting may need special handling for dates, locale-aware string comparison, nullable values, and mixed unions.

---

# 16. Practical Example: Generic Pick Function

Let's build a function that selects specific properties from an object.

This pattern is related to TypeScript's built-in `Pick<T, K>` utility type, which we will cover in a later phase.

### Step 1: Define the Function

```typescript
function pick<T, K extends keyof T>(
    object: T,
    keys: K[]
): Pick<T, K> {
    const result = {} as Pick<T, K>;

    for (const key of keys) {
        result[key] = object[key];
    }

    return result;
}
```

### Step 2: Create an Object

```typescript
const user = {
    id: 1,
    name: "Alex",
    email: "alex@example.com",
    age: 25,
    city: "Ahmedabad"
};
```

### Step 3: Select Properties

```typescript
const selectedUser = pick(user, [
    "id",
    "name"
]);
```

Result:

```typescript
{
    id: number;
    name: string;
}
```

Invalid:

```typescript
pick(user, ["id", "address"]);
```

TypeScript reports an error because `"address"` is not a key of `user`.

### Understanding the Function

```typescript
<T, K extends keyof T>
```

- `T` represents the complete object type.
- `K` represents selected keys.
- `K` must be a valid key of `T`.

```typescript
Pick<T, K>
```

Represents a type containing only the selected properties.

The `as` assertion is used here because TypeScript cannot prove that the initially empty object will be fully populated by the loop.

The function is safe for the supplied key array because every selected key comes from `keyof T`.

---

# 17. Common Mistakes in Generic Constraints

### Mistake 1: Using a Property Without a Constraint

Incorrect:

```typescript
function getId<T>(value: T) {
    return value.id;
}
```

Correct:

```typescript
function getId<T extends { id: number }>(value: T) {
    return value.id;
}
```

### Mistake 2: Confusing extends With Class Inheritance

In generic constraints:

```typescript
T extends { id: number }
```

This does not mean `T` must inherit from a class.

It means `T` must satisfy the specified type structure.

### Mistake 3: Using string Instead of keyof T

Avoid:

```typescript
function getProperty<T>(
    object: T,
    key: string
) {
    return object[key];
}
```

This is not type-safe.

Prefer:

```typescript
function getProperty<T, K extends keyof T>(
    object: T,
    key: K
): T[K] {
    return object[key];
}
```

### Mistake 4: Forgetting That keyof Produces a Union

```typescript
type User = {
    id: number;
    name: string;
};

type Keys = keyof User;
```

Result:

```typescript
"id" | "name"
```

It does not produce an array.

### Mistake 5: Confusing keyof With Object.keys()

`keyof` operates at compile time.

`Object.keys()` operates at runtime.

They serve different purposes.

### Mistake 6: Assuming Every Property Can Be Compared

A generic object property might be a string, number, object, function, or another type.

You need appropriate constraints before performing operations such as `<` and `>`.

### Mistake 7: Using Type Assertions to Hide Type Errors

Avoid using `as any` simply to make a generic function compile.

Instead, design the constraints so that the required operations are genuinely type-safe.

---

# 18. Interview Questions and Answers

### Q1. What are generic constraints?

Generic constraints restrict generic type parameters to types that satisfy specified requirements.

### Q2. Which keyword is used for generic constraints?

The `extends` keyword.

### Q3. Why do we need generic constraints?

They allow developers to safely access specific properties and methods inside generic functions.

### Q4. What is the keyof operator?

`keyof` extracts the property keys of an object type and produces a union of those keys.

### Q5. What is the difference between keyof and Object.keys()?

`keyof` is a TypeScript compile-time operator, whereas `Object.keys()` is a JavaScript runtime method.

### Q6. What does K extends keyof T mean?

It means that `K` must be one of the valid keys of type `T`.

### Q7. What is T[K]?

It is an indexed access type that extracts the type of property `K` from type `T`.

### Q8. What is the purpose of getProperty()?

It provides type-safe access to object properties while preserving the property's actual type.

### Q9. Can generic constraints use interfaces?

Yes. Interfaces are commonly used to define reusable structural requirements for generic types.

### Q10. Can generic constraints use type aliases?

Yes. Object type aliases, unions, intersections, and other compatible types can be used as constraints.

### Q11. Can generic constraints contain multiple properties?

Yes.

```typescript
T extends {
    id: number;
    name: string;
}
```

### Q12. Can generic constraints use unions?

Yes.

```typescript
T extends string | number
```

### Q13. What is the difference between T and K in getProperty()?

`T` represents the object type, while `K` represents one of its valid property keys.

### Q14. What is an indexed access type?

It extracts the type of a property using syntax such as:

```typescript
User["name"]
```

### Q15. Can generic parameters have default values and constraints?

Yes.

```typescript
type Container<T extends string | number = string> = {
    value: T;
};
```

### Q16. What does T extends HasId mean?

It means that `T` must have a structure compatible with the `HasId` type.

### Q17. Can keyof work with arrays?

Yes. For arrays, `keyof` includes array-related keys and methods, along with numeric indexing-related keys. It does not simply produce a union of array element values.

---

# 19. Practical Exercises

Complete these exercises before moving to Phase 16.

### Exercise 1: Generic Constraint

Create:

```typescript
function getLength<T extends { length: number }>(
    value: T
): number
```

Requirements:

- Accept strings.
- Accept arrays.
- Accept objects containing a numeric `length`.
- Reject numbers and booleans.

### Exercise 2: ID Constraint

Create an interface:

```typescript
interface HasId {
    id: number;
}
```

Create a generic function that accepts only objects satisfying `HasId`.

### Exercise 3: Multiple Property Constraints

Create a generic function that accepts objects containing:

```typescript
{
    id: number;
    name: string;
    email: string;
}
```

Print all three properties.

### Exercise 4: keyof

Create:

```typescript
type Product = {
    id: number;
    name: string;
    price: number;
    category: string;
};
```

Derive a union of all valid property keys using `keyof`.

### Exercise 5: Generic getProperty

Create:

```typescript
function getProperty<T, K extends keyof T>(
    object: T,
    key: K
): T[K]
```

Test it with:

- User objects.
- Product objects.
- Order objects.

Verify that the return type matches the selected property.

### Exercise 6: Generic setProperty

Create a function that updates an object's property.

Requirements:

- Accept an object.
- Accept a valid property key.
- Accept a value matching that property's type.
- Reject invalid keys and values.

### Exercise 7: Generic pick

Create a function that selects specific properties from an object.

Example:

```typescript
const user = {
    id: 1,
    name: "Alex",
    email: "alex@example.com",
    age: 25
};
```

Expected usage:

```typescript
pick(user, ["id", "name"]);
```

Expected result type:

```typescript
{
    id: number;
    name: string;
}
```

### Exercise 8: Generic Union Constraint

Create a generic function that accepts only:

```typescript
string | number | boolean
```

### Exercise 9: Generic Sorting

Create a sorting function that sorts an array of objects by a selected string or numeric property.

### Exercise 10: Generic Repository

Create a generic repository that:

1. Accepts objects containing an `id` property.
2. Adds records.
3. Retrieves records by ID.
4. Updates records by ID.
5. Deletes records by ID.
6. Returns correctly typed values.

---

# 20. Phase 15 Completion Checklist

You should now understand:

- [ ] What generic constraints are.
- [ ] Why generic constraints are needed.
- [ ] Using `extends` with generics.
- [ ] Constraints with primitive types.
- [ ] Constraints with unions.
- [ ] Constraints with object types.
- [ ] Constraints with multiple properties.
- [ ] Constraints with interfaces.
- [ ] Constraints with type aliases.
- [ ] Structural typing in generic constraints.
- [ ] What `keyof` does.
- [ ] `keyof` vs `Object.keys()`.
- [ ] Using `keyof` with generics.
- [ ] What indexed access types are.
- [ ] Understanding `T[K]`.
- [ ] Generic property access.
- [ ] Generic property updates.
- [ ] Generic constraints with intersections.
- [ ] Default generic types.
- [ ] Generic `getProperty()` implementation.
- [ ] Generic `pick()` implementation.
- [ ] Generic sorting patterns.

---

## What's Next?

# Phase 16: Advanced Generics – Conditional Types and Type Inference

In the next phase, we will cover:

1. What are conditional types?
2. Conditional type syntax.
3. The `extends` keyword in conditional types.
4. True and false branches.
5. Conditional types with generics.
6. Nested conditional types.
7. Distributive conditional types.
8. Non-distributive conditional types.
9. The `infer` keyword.
10. Inferring function return types.
11. Inferring array element types.
12. Inferring promise values.
13. Conditional types with unions.
14. Practical conditional type implementations.
15. Real-world advanced generic utilities.

**When you're ready, say: `OK, Phase 16`.**