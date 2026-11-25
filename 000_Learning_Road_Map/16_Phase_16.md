# Phase 16: Advanced Generics – Conditional Types and Type Inference

**Level:** Advanced  
**Prerequisite:** Phase 14 – Generics Fundamentals and Phase 15 – Generic Constraints, `keyof`, and Indexed Access Types.

## Learning Objectives

By the end of this phase, you will understand:

1. What conditional types are.
2. Conditional type syntax and how it works.
3. The difference between generic constraints and conditional types.
4. Conditional types with generic parameters.
5. Nested conditional types.
6. Distributive conditional types.
7. Non-distributive conditional types.
8. The `infer` keyword.
9. Inferring function return types and parameters.
10. Inferring array and tuple element types.
11. Inferring Promise values.
12. Conditional types with union types.
13. Recursive conditional types.
14. Built-in TypeScript utility types based on conditional types.
15. Real-world advanced generic utilities.

---

# 1. What Are Conditional Types?

A **conditional type** allows TypeScript to select one type or another based on a condition.

It works similarly to the ternary operator in JavaScript.

### JavaScript ternary operator

```javascript
const age = 20;

const result = age >= 18 ? "Adult" : "Minor";

console.log(result);
```

Syntax:

```javascript
condition ? valueIfTrue : valueIfFalse;
```

### TypeScript conditional type

```typescript
type Result<T> = T extends string ? string : number;
```

Syntax:

```typescript
type TypeName<T> = Condition ? TrueType : FalseType;
```

Here:

- `T` is a generic type parameter.
- `extends` checks whether `T` is assignable to the specified type.
- `?` separates the condition from the true branch.
- `:` separates the true branch from the false branch.

**Important:** Conditional types operate at the type level. They do not execute JavaScript code at runtime.

---

# 2. Basic Conditional Types

Let's understand conditional types with examples.

### Example 1: Check whether a type is a string

```typescript
type IsString<T> = T extends string ? true : false;

type Result1 = IsString<string>;
type Result2 = IsString<number>;
type Result3 = IsString<boolean>;
```

Result:

```typescript
type Result1 = true;
type Result2 = false;
type Result3 = false;
```

Explanation:

| Type argument | Condition | Result |
|---|---|---|
| `string` | `string extends string` | `true` |
| `number` | `number extends string` | `false` |
| `boolean` | `boolean extends string` | `false` |

### Example 2: Return different types based on input

```typescript
type ResponseType<T> =
    T extends string
        ? { message: T }
        : { data: T };

type StringResponse = ResponseType<string>;

type NumberResponse = ResponseType<number>;
```

Conceptual results:

```typescript
type StringResponse = {
    message: string;
};

type NumberResponse = {
    data: number;
};
```

### Example 3: Check whether a type is an array

```typescript
type IsArray<T> = T extends unknown[] ? true : false;

type A = IsArray<string[]>;
type B = IsArray<number[]>;
type C = IsArray<string>;
```

Results:

```typescript
type A = true;
type B = true;
type C = false;
```

We will learn how to extract array element types later in this phase.

---

# 3. Understanding `extends` in Conditional Types

You have already learned `extends` in generic constraints.

However, `extends` is used in two different ways.

### A. Generic constraints

In generic constraints, `extends` restricts which types can be passed.

```typescript
function getLength<T extends { length: number }>(value: T): number {
    return value.length;
}

getLength("Hello");
getLength([10, 20, 30]);

// Error
getLength(100);
```

Here, `T` must have a `length` property of type `number`.

### B. Conditional types

In conditional types, `extends` checks whether one type is assignable to another.

```typescript
type Check<T> = T extends string ? "Yes" : "No";

type A = Check<string>; // "Yes"
type B = Check<number>; // "No"
```

### Difference

| Generic constraint | Conditional type |
|---|---|
| Restricts accepted types | Selects a type based on a condition |
| Uses `extends` in a generic declaration | Uses `extends` inside a conditional expression |
| Invalid arguments produce errors | Condition selects the true or false branch |
| `T extends string` | `T extends string ? A : B` |

Remember:

**Generic constraints restrict types. Conditional types evaluate types.**

---

# 4. Conditional Types with Generic Parameters

Conditional types become especially powerful when combined with generics.

Consider:

```typescript
type CheckType<T> = T extends number ? "Numeric" : "Non-Numeric";
```

Now use different types:

```typescript
type A = CheckType<number>;
type B = CheckType<string>;
type C = CheckType<boolean>;
type D = CheckType<bigint>;
```

Results:

```typescript
type A = "Numeric";
type B = "Non-Numeric";
type C = "Non-Numeric";
type D = "Non-Numeric";
```

The same reusable type works with different type arguments.

### Practical Example: API Response

Suppose an API can return either a success response or an error response.

```typescript
type ApiResponse<T> =
    T extends string
        ? {
            status: "success";
            message: T;
        }
        : {
            status: "success";
            data: T;
        };

type UserResponse = ApiResponse<{
    id: number;
    name: string;
}>;

type MessageResponse = ApiResponse<string>;
```

Conceptual results:

```typescript
type UserResponse = {
    status: "success";
    data: {
        id: number;
        name: string;
    };
};

type MessageResponse = {
    status: "success";
    message: string;
};
```

This allows us to create reusable types whose structures depend on their input types.

---

# 5. Nested Conditional Types

You can put one conditional type inside another conditional type.

This is called a **nested conditional type**.

### Example

```typescript
type CheckType<T> =
    T extends string
        ? "String"
        : T extends number
            ? "Number"
            : T extends boolean
                ? "Boolean"
                : "Other";
```

Usage:

```typescript
type A = CheckType<string>;
type B = CheckType<number>;
type C = CheckType<boolean>;
type D = CheckType<object>;
```

Results:

```typescript
type A = "String";
type B = "Number";
type C = "Boolean";
type D = "Other";
```

### How does it work?

TypeScript evaluates the conditions from top to bottom.

For example:

```typescript
type Result = CheckType<number>;
```

Evaluation:

1. Is `number` assignable to `string`? No.
2. Is `number` assignable to `number`? Yes.
3. Return `"Number"`.

### Another Example: Classify API Data

```typescript
type DataCategory<T> =
    T extends string
        ? "Text"
        : T extends number
            ? "Numeric"
            : T extends unknown[]
                ? "Collection"
                : T extends object
                    ? "Object"
                    : "Other";
```

Usage:

```typescript
type A = DataCategory<string>; 
// "Text"

type B = DataCategory<number>; 
// "Numeric"

type C = DataCategory<string[]>; 
// "Collection"

type D = DataCategory<{ id: number }>; 
// "Object"
```

**Note:** The order of conditions matters. Arrays are also objects in JavaScript and structurally compatible with object types, so checking arrays before general objects is important.

---

# 6. Distributive Conditional Types

This is one of the most important concepts in advanced TypeScript.

A conditional type can automatically distribute over union types.

Let's understand this step by step.

### Example 1: Conditional type with a union

```typescript
type Check<T> = T extends string ? "String" : "Other";

type Result = Check<string | number>;
```

What will be the result?

Many developers initially expect:

```typescript
type Result = "Other";
```

But the actual result is:

```typescript
type Result = "String" | "Other";
```

Why?

Because TypeScript evaluates the conditional type separately for each member of the union.

Conceptually:

```typescript
Check<string | number>
```

Becomes:

```typescript
Check<string> | Check<number>
```

Which becomes:

```typescript
"String" | "Other"
```

This behavior is called **distributive conditional types**.

### Example 2: Another example

```typescript
type ToArray<T> = T extends unknown ? T[] : never;

type Result = ToArray<string | number>;
```

Result:

```typescript
type Result = string[] | number[];
```

Evaluation:

```typescript
ToArray<string> | ToArray<number>
```

Then:

```typescript
string[] | number[]
```

### Important distinction

Compare these two types:

```typescript
type A = (string | number)[];
type B = string[] | number[];
```

They are not equivalent.

| Type | Meaning |
|---|---|
| `(string \| number)[]` | One array can contain both strings and numbers |
| `string[] \| number[]` | The value must be either a string array or a number array |

For example:

```typescript
const first: (string | number)[] = ["Hello", 100, "World"];

const second: string[] | number[] = ["Hello", "World"];

// Error
const third: string[] | number[] = ["Hello", 100];
```

### When is distributivity useful?

It is useful when you want to process every member of a union independently.

For example:

```typescript
type RemoveNull<T> = T extends null ? never : T;

type Result = RemoveNull<string | number | null>;
```

Result:

```typescript
type Result = string | number;
```

We will explore this pattern in more detail shortly.

---

# 7. Non-Distributive Conditional Types

Sometimes you do not want TypeScript to distribute a conditional type over union members.

You want to check the entire union as a single type.

You can achieve this by wrapping the generic type parameter in a tuple.

### Example

```typescript
type Check<T> = [T] extends [string] ? "String" : "Other";
```

Usage:

```typescript
type A = Check<string>;
type B = Check<number>;
type C = Check<string | number>;
```

Results:

```typescript
type A = "String";
type B = "Other";
type C = "Other";
```

Why?

Because TypeScript checks the complete type:

```typescript
[string | number] extends [string]
```

The entire union is not assignable to `string`, so the result is `"Other"`.

### Distributive vs Non-Distributive

| Distributive | Non-distributive |
|---|---|
| `T extends U ? X : Y` | `[T] extends [U] ? X : Y` |
| Checks union members individually | Checks the union as a whole |
| Distributes over unions when `T` is a naked type parameter | Does not distribute |
| Useful for filtering union members | Useful for checking an entire type |

**Important rule:**

A conditional type distributes over a union when the checked type is a naked type parameter.

A naked type parameter means the parameter appears directly before `extends`, without being wrapped in another type.

For example:

```typescript
type A<T> = T extends string ? true : false;
```

This is distributive.

```typescript
type B<T> = [T] extends [string] ? true : false;
```

This is non-distributive.

---

# 8. Understanding `never` in Conditional Types

The `never` type has special behavior with distributive conditional types.

Consider:

```typescript
type Check<T> = T extends string ? true : false;

type Result = Check<never>;
```

The result is:

```typescript
type Result = never;
```

Why?

A distributive conditional type distributes over union members.

`never` represents an empty union: it has no members to distribute over.

Therefore, the result is also `never`.

### Non-distributive version

```typescript
type Check<T> = [T] extends [string] ? true : false;

type Result = Check<never>;
```

Result:

```typescript
type Result = true;
```

This happens because the complete type `never` is assignable to `string`.

This is an important distinction when writing advanced utility types.

---

# 9. What Is the `infer` Keyword?

The `infer` keyword allows TypeScript to **extract or infer a type from another type inside a conditional type**.

In simple terms:

Instead of manually specifying a type, we ask TypeScript to identify a part of an existing type.

### Basic syntax

```typescript
type ExtractType<T> =
    T extends SomeStructure<infer U>
        ? U
        : never;
```

Here:

- `T` is the input type.
- `infer U` tells TypeScript to infer a type and assign it to `U`.
- `U` can then be used in the true branch.

**Important:** `infer` is only allowed within the `extends` pattern of a conditional type.

Let's understand its practical applications.

---

# 10. Inferring Function Return Types

Suppose you have a function:

```typescript
function getUser() {
    return {
        id: 1,
        name: "Riyaz"
    };
}
```

Its return type is:

```typescript
{
    id: number;
    name: string;
}
```

Now suppose you want to extract the return type of any function.

You can use `infer`.

### Example

```typescript
type GetReturnType<T> =
    T extends (...args: any[]) => infer R
        ? R
        : never;
```

Usage:

```typescript
function getUser() {
    return {
        id: 1,
        name: "Riyaz"
    };
}

type User = GetReturnType<typeof getUser>;
```

Result:

```typescript
type User = {
    id: number;
    name: string;
};
```

### Understanding the pattern

```typescript
T extends (...args: any[]) => infer R
```

This asks:

1. Is `T` a function type?
2. If yes, infer its return type.
3. Store the inferred return type in `R`.
4. Return `R`.

Otherwise, return `never`.

### Example with different functions

```typescript
function getName() {
    return "Riyaz";
}

function getAge() {
    return 25;
}

function isActive() {
    return true;
}

type Name = GetReturnType<typeof getName>;
type Age = GetReturnType<typeof getAge>;
type Active = GetReturnType<typeof isActive>;
```

Results:

```typescript
type Name = string;
type Age = number;
type Active = boolean;
```

### Built-in `ReturnType<T>`

TypeScript already provides a utility type for this:

```typescript
type Name = ReturnType<typeof getName>;
```

It extracts the return type of a function.

We will explore more built-in utility types in a later section.

---

# 11. Inferring Function Parameter Types

We can also extract function parameter types using `infer`.

### Example

```typescript
type GetParameters<T> =
    T extends (...args: infer P) => any
        ? P
        : never;
```

Usage:

```typescript
function createUser(
    name: string,
    age: number,
    active: boolean
) {
    return {
        name,
        age,
        active
    };
}

type ParametersOfCreateUser = GetParameters<typeof createUser>;
```

Result:

```typescript
type ParametersOfCreateUser = [
    name: string,
    age: number,
    active: boolean
];
```

Why is the result a tuple?

Because function parameters have a specific order and individual types.

The inferred parameter type is represented as a tuple.

### Built-in `Parameters<T>`

TypeScript provides this functionality:

```typescript
type UserParameters = Parameters<typeof createUser>;
```

It extracts the parameter tuple of a function.

---

# 12. Inferring Array Element Types

Suppose you have an array:

```typescript
const numbers = [10, 20, 30];
```

Its inferred type is:

```typescript
number[]
```

What if you want to extract the element type from an array?

You can use `infer`.

### Example

```typescript
type ElementType<T> =
    T extends readonly (infer U)[]
        ? U
        : never;
```

Usage:

```typescript
type A = ElementType<string[]>;
type B = ElementType<number[]>;
type C = ElementType<boolean[]>;
```

Results:

```typescript
type A = string;
type B = number;
type C = boolean;
```

### Why use `readonly`?

This pattern:

```typescript
T extends readonly (infer U)[]
```

matches both mutable arrays and readonly arrays.

For example:

```typescript
type A = ElementType<string[]>;
type B = ElementType<readonly number[]>;
```

Results:

```typescript
type A = string;
type B = number;
```

### Inferring tuple element types

You can also extract a specific tuple element.

```typescript
type FirstElement<T> =
    T extends readonly [infer First, ...unknown[]]
        ? First
        : never;
```

Usage:

```typescript
type Result1 = FirstElement<[string, number, boolean]>;

type Result2 = FirstElement<[number, string]>;
```

Results:

```typescript
type Result1 = string;
type Result2 = number;
```

This is useful when working with function arguments, tuple-based APIs, and structured data.

---

# 13. Inferring Promise Values

Promises are common in JavaScript and TypeScript, especially in asynchronous applications.

Consider:

```typescript
async function getUser() {
    return {
        id: 1,
        name: "Riyaz"
    };
}
```

The return type is:

```typescript
Promise<{
    id: number;
    name: string;
}>
```

Sometimes you want to extract the value inside the Promise rather than the Promise itself.

### Example

```typescript
type UnwrapPromise<T> =
    T extends Promise<infer U>
        ? U
        : T;
```

Usage:

```typescript
type Result = UnwrapPromise<Promise<string>>;
```

Result:

```typescript
type Result = string;
```

Another example:

```typescript
type User = {
    id: number;
    name: string;
};

type Result = UnwrapPromise<Promise<User>>;
```

Result:

```typescript
type Result = User;
```

### What about nested Promises?

Consider:

```typescript
type Result = Promise<Promise<string>>;
```

Our previous utility extracts only one level:

```typescript
type UnwrapPromise<T> =
    T extends Promise<infer U>
        ? U
        : T;
```

The result would be:

```typescript
type Result = Promise<string>;
```

If you want to recursively extract nested Promise values, you can use a recursive conditional type.

---

# 14. Recursive Conditional Types

A recursive conditional type is a type that refers to itself inside its own definition.

This is similar to recursive functions in JavaScript.

### Example: Recursively unwrap Promises

```typescript
type DeepUnwrapPromise<T> =
    T extends Promise<infer U>
        ? DeepUnwrapPromise<U>
        : T;
```

Usage:

```typescript
type A = DeepUnwrapPromise<Promise<string>>;

type B = DeepUnwrapPromise<Promise<Promise<number>>>;

type C = DeepUnwrapPromise<Promise<Promise<Promise<boolean>>>>;
```

Results:

```typescript
type A = string;

type B = number;

type C = boolean;
```

### How does it work?

Consider:

```typescript
type Result = DeepUnwrapPromise<Promise<Promise<string>>>;
```

Evaluation:

**Step 1:**

```typescript
Promise<Promise<string>>
```

Extract:

```typescript
Promise<string>
```

**Step 2:**

The extracted type is still a Promise.

Extract again:

```typescript
string
```

**Step 3:**

`string` is not a Promise.

Return:

```typescript
string
```

### Using `PromiseLike`

JavaScript libraries sometimes use Promise-compatible objects that implement the Promise-like interface.

You can use `PromiseLike` instead:

```typescript
type DeepUnwrap<T> =
    T extends PromiseLike<infer U>
        ? DeepUnwrap<U>
        : T;
```

### Built-in `Awaited<T>`

TypeScript provides a built-in utility type called `Awaited<T>`.

```typescript
type A = Awaited<Promise<string>>;

type B = Awaited<Promise<Promise<number>>>;

type C = Awaited<boolean>;
```

Results:

```typescript
type A = string;

type B = number;

type C = boolean;
```

It models the type produced by `await`.

For most real-world applications, prefer the built-in `Awaited<T>` instead of implementing your own Promise-unwrapping utility.

---

# 15. Conditional Types with Union Types

Conditional types are particularly useful for manipulating union types.

Let's explore some common patterns.

### Example 1: Remove a specific type from a union

```typescript
type RemoveString<T> =
    T extends string
        ? never
        : T;
```

Usage:

```typescript
type Result = RemoveString<string | number | boolean>;
```

Result:

```typescript
type Result = number | boolean;
```

Why?

TypeScript distributes the conditional type:

```typescript
RemoveString<string>
    | RemoveString<number>
    | RemoveString<boolean>
```

Results:

```typescript
never | number | boolean
```

Since `never` disappears from a union:

```typescript
number | boolean
```

### Example 2: Extract a specific type from a union

```typescript
type ExtractString<T> =
    T extends string
        ? T
        : never;
```

Usage:

```typescript
type Result = ExtractString<string | number | boolean>;
```

Result:

```typescript
type Result = string;
```

### Example 3: Remove null and undefined

```typescript
type RemoveNullish<T> =
    T extends null | undefined
        ? never
        : T;
```

Usage:

```typescript
type User = {
    name: string;
    age: number | null;
    email: string | undefined;
};

type Age = RemoveNullish<User["age"]>;

type Email = RemoveNullish<User["email"]>;
```

Results:

```typescript
type Age = number;

type Email = string;
```

These patterns are the foundation of several built-in TypeScript utility types.

---

# 16. Understanding Built-in Conditional Utility Types

TypeScript provides several built-in utility types that use conditional types and type inference.

Let's understand the most important ones.

## A. `Exclude<T, U>`

Removes types from `T` that are assignable to `U`.

```typescript
type Result = Exclude<string | number | boolean, string>;
```

Result:

```typescript
type Result = number | boolean;
```

Custom implementation:

```typescript
type MyExclude<T, U> =
    T extends U ? never : T;
```

## B. `Extract<T, U>`

Extracts types from `T` that are assignable to `U`.

```typescript
type Result = Extract<string | number | boolean, string | number>;
```

Result:

```typescript
type Result = string | number;
```

Custom implementation:

```typescript
type MyExtract<T, U> =
    T extends U ? T : never;
```

## C. `NonNullable<T>`

Removes `null` and `undefined` from a type.

```typescript
type Result = NonNullable<string | number | null | undefined>;
```

Result:

```typescript
type Result = string | number;
```

Conceptually, it can be implemented using a distributive conditional type:

```typescript
type MyNonNullable<T> =
    T extends null | undefined ? never : T;
```

## D. `ReturnType<T>`

Extracts the return type of a function.

```typescript
function getUser() {
    return {
        id: 1,
        name: "Riyaz"
    };
}

type User = ReturnType<typeof getUser>;
```

Result:

```typescript
type User = {
    id: number;
    name: string;
};
```

## E. `Parameters<T>`

Extracts the parameter types of a function as a tuple.

```typescript
function login(email: string, password: string) {
    return true;
}

type LoginParameters = Parameters<typeof login>;
```

Result:

```typescript
type LoginParameters = [email: string, password: string];
```

## F. `Awaited<T>`

Extracts the resolved value type from a Promise-like type.

```typescript
type Result = Awaited<Promise<Promise<string>>>;
```

Result:

```typescript
type Result = string;
```

### Summary

| Utility type | Purpose |
|---|---|
| `Exclude<T, U>` | Removes matching types from a union |
| `Extract<T, U>` | Keeps matching types from a union |
| `NonNullable<T>` | Removes `null` and `undefined` |
| `ReturnType<T>` | Extracts a function's return type |
| `Parameters<T>` | Extracts a function's parameter tuple |
| `Awaited<T>` | Extracts the resolved Promise-like value |

These utility types are widely used in professional TypeScript applications.

---

# 17. Conditional Types with Object Properties

You can use conditional types to extract properties from objects.

### Example

Suppose different objects may or may not contain a `message` property.

```typescript
type MessageOf<T> =
    T extends { message: unknown }
        ? T["message"]
        : never;
```

Usage:

```typescript
type Success = {
    message: string;
    status: number;
};

type ErrorResponse = {
    message: {
        error: string;
    };
    status: number;
};

type User = {
    id: number;
    name: string;
};

type A = MessageOf<Success>;

type B = MessageOf<ErrorResponse>;

type C = MessageOf<User>;
```

Results:

```typescript
type A = string;

type B = {
    error: string;
};

type C = never;
```

Explanation:

- If `T` has a required `message` property, extract its type.
- Otherwise, return `never`.

Notice that this example uses indexed access types:

```typescript
T["message"]
```

You learned indexed access types in Phase 15.

---

# 18. Using `infer` to Extract Object Property Types

We can also use `infer` to extract a property type.

```typescript
type ExtractMessage<T> =
    T extends { message: infer M }
        ? M
        : never;
```

Usage:

```typescript
type Result = ExtractMessage<{
    message: string;
    status: number;
}>;
```

Result:

```typescript
type Result = string;
```

Here:

```typescript
infer M
```

allows TypeScript to infer the type of the `message` property.

Compare:

```typescript
type A<T> =
    T extends { message: unknown }
        ? T["message"]
        : never;
```

And:

```typescript
type B<T> =
    T extends { message: infer M }
        ? M
        : never;
```

Both can extract the property type.

The `infer` approach is particularly useful when extracting types from complex structures.

---

# 19. Real-World Example: Extract API Response Data

Suppose your backend returns different API response structures.

```typescript
type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};
```

Now define a user:

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};
```

Create a response:

```typescript
type UserApiResponse = ApiResponse<User>;
```

Now suppose you want to extract the type of the `data` property from any API response.

### Custom utility

```typescript
type DataOf<T> =
    T extends { data: infer D }
        ? D
        : never;
```

Usage:

```typescript
type UserData = DataOf<UserApiResponse>;
```

Result:

```typescript
type UserData = {
    id: number;
    name: string;
    email: string;
};
```

### Why is this useful?

Imagine your application has many API response types:

```typescript
type ProductResponse = ApiResponse<{
    id: number;
    title: string;
    price: number;
}>;

type OrderResponse = ApiResponse<{
    id: number;
    total: number;
    status: string;
}>;
```

You can extract their data types without manually rewriting the structures.

```typescript
type ProductData = DataOf<ProductResponse>;

type OrderData = DataOf<OrderResponse>;
```

This is especially useful when building reusable API clients and service layers.

---

# 20. Real-World Example: Extract Function Return Data from an API Service

Consider a service function:

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};

async function fetchUser(): Promise<User> {
    return {
        id: 1,
        name: "Riyaz",
        email: "riyaz@example.com"
    };
}
```

Now extract the resolved return type:

```typescript
type UserData = Awaited<ReturnType<typeof fetchUser>>;
```

Result:

```typescript
type UserData = {
    id: number;
    name: string;
    email: string;
};
```

Let's break it down.

### Step 1: `typeof fetchUser`

Gets the function's type.

### Step 2: `ReturnType<typeof fetchUser>`

Extracts its return type:

```typescript
Promise<User>
```

### Step 3: `Awaited<Promise<User>>`

Extracts the resolved value:

```typescript
User
```

This pattern is extremely useful when working with API service functions.

You do not need to define the same response type separately if TypeScript can infer it from the service function.

---

# 21. Important Concept: Conditional Types Can Be Deferred

Sometimes TypeScript cannot immediately determine which branch of a conditional type should be selected.

This happens when a generic parameter is not yet known.

### Example

```typescript
type Result<T> =
    T extends string
        ? "String"
        : "Other";
```

Now create a generic function:

```typescript
function check<T>(value: T): Result<T> {
    throw new Error("Implementation not provided");
}
```

Here, `T` is not known when the function is declared.

Therefore, TypeScript cannot immediately resolve:

```typescript
Result<T>
```

The conditional type remains unresolved until a specific type is supplied or inferred.

For example:

```typescript
type A = Result<string>;

type B = Result<number>;
```

Results:

```typescript
type A = "String";

type B = "Other";
```

This behavior is called **deferred conditional type resolution**.

It is important when designing generic functions and reusable utility types.

---

# 22. Important Concept: Conditional Types Are Not Runtime Validation

This is a very important distinction.

Consider:

```typescript
type IsString<T> = T extends string ? true : false;
```

This checks types during TypeScript's type checking.

It does not check actual JavaScript values at runtime.

For example:

```typescript
const value: unknown = "Hello";
```

To validate this value at runtime, you still need JavaScript logic:

```typescript
if (typeof value === "string") {
    console.log("Value is a string");
}
```

### Type-level vs Runtime

| Conditional types | Runtime checks |
|---|---|
| Operate on types | Operate on values |
| Evaluated by TypeScript | Executed by JavaScript |
| Do not exist at runtime | Exist at runtime |
| Used for type transformations | Used for actual validation |

**Remember:** TypeScript types are erased during compilation. Conditional types cannot validate API responses, database records, or user input at runtime.

---

# 23. Common Mistakes

### Mistake 1: Confusing constraints with conditional types

Incorrect understanding:

```typescript
type Check<T extends string> = T;
```

This is a generic constraint, not a conditional type.

A conditional type looks like:

```typescript
type Check<T> = T extends string ? true : false;
```

### Mistake 2: Assuming all conditional types distribute

This distributes:

```typescript
type A<T> = T extends string ? true : false;
```

This does not:

```typescript
type B<T> = [T] extends [string] ? true : false;
```

### Mistake 3: Forgetting that `never` disappears from unions

```typescript
type Result = string | never | number;
```

Result:

```typescript
type Result = string | number;
```

### Mistake 4: Using `infer` outside a conditional type

Incorrect:

```typescript
type Result<T> = infer U;
```

Correct:

```typescript
type Result<T> =
    T extends Promise<infer U>
        ? U
        : never;
```

### Mistake 5: Confusing `ReturnType` with `Awaited`

```typescript
async function getUser() {
    return {
        id: 1,
        name: "Riyaz"
    };
}
```

This:

```typescript
type A = ReturnType<typeof getUser>;
```

Produces:

```typescript
Promise<{
    id: number;
    name: string;
}>
```

This:

```typescript
type B = Awaited<ReturnType<typeof getUser>>;
```

Produces:

```typescript
{
    id: number;
    name: string;
}
```

### Mistake 6: Assuming TypeScript types validate API data

Conditional types only transform types at compile time. They do not validate actual API responses.

### Mistake 7: Writing unnecessarily complicated conditional types

Nested conditional types can become difficult to understand.

Prefer:

- Small reusable utility types.
- Meaningful type names.
- Clear conditions.
- Built-in utility types when available.

---

# 24. Interview Questions and Answers

### Q1. What are conditional types in TypeScript?

Conditional types allow us to select one type or another based on a type relationship.

Syntax:

```typescript
T extends U ? X : Y;
```

### Q2. What is the purpose of `extends` in conditional types?

It checks whether one type is assignable to another.

If the condition is true, TypeScript selects the first branch; otherwise, it selects the second branch.

### Q3. What is the difference between generic constraints and conditional types?

Generic constraints restrict the types that can be passed to a generic parameter.

Conditional types select a resulting type based on a condition.

### Q4. What are distributive conditional types?

A distributive conditional type automatically evaluates each member of a union separately when the checked type is a naked type parameter.

### Q5. How can you prevent conditional type distribution?

Wrap the checked type parameter in a tuple.

```typescript
type Check<T> = [T] extends [string] ? true : false;
```

### Q6. What is the `infer` keyword?

`infer` allows TypeScript to extract and assign a type to a new type variable inside a conditional type.

### Q7. How can you extract the return type of a function?

Using the built-in `ReturnType<T>` utility.

```typescript
type Result = ReturnType<typeof myFunction>;
```

### Q8. How can you extract function parameters?

Using `Parameters<T>`.

```typescript
type Args = Parameters<typeof myFunction>;
```

### Q9. What is the difference between `ReturnType` and `Awaited<ReturnType<T>>`?

`ReturnType<T>` extracts the declared return type of a function.

`Awaited<ReturnType<T>>` additionally unwraps Promise-like values.

### Q10. What happens when a distributive conditional type receives `never`?

It evaluates to `never` because there are no union members to distribute over.

### Q11. Can conditional types validate data at runtime?

No. They are compile-time type transformations. Runtime validation requires JavaScript checks or a runtime validation library.

### Q12. What is a recursive conditional type?

A conditional type that refers to itself in one of its branches.

For example, a utility that recursively unwraps nested Promises.

---

# 25. Practical Exercises

Try to solve these exercises yourself before checking the solutions.

## Exercise 1: Check String

Create a generic conditional type that returns:

- `"String"` if the type is a string.
- `"Not String"` otherwise.

Expected:

```typescript
type A = CheckString<string>; // "String"
type B = CheckString<number>; // "Not String"
```

## Exercise 2: Check Array

Create a conditional type that checks whether a type is an array.

Expected:

```typescript
type A = IsArray<string[]>; // true
type B = IsArray<number>;   // false
```

## Exercise 3: Extract Array Element

Create a utility type that extracts the element type of an array.

Expected:

```typescript
type A = ElementType<string[]>; // string
type B = ElementType<number[]>; // number
```

## Exercise 4: Extract Function Return Type

Create a custom utility that extracts the return type of a function.

Expected:

```typescript
function getProduct() {
    return {
        id: 1,
        title: "Laptop",
        price: 50000
    };
}

type Product = MyReturnType<typeof getProduct>;
```

## Exercise 5: Remove Null

Create a conditional type that removes `null` from a union.

Expected:

```typescript
type Result = RemoveNull<string | number | null>;

// string | number
```

## Exercise 6: Extract Promise Value

Create a utility that extracts the value inside a Promise.

Expected:

```typescript
type Result = Unwrap<Promise<string>>;

// string
```

## Exercise 7: Extract API Data

Create a generic utility that extracts the `data` property from an API response.

Expected:

```typescript
type Response = {
    success: boolean;
    data: {
        id: number;
        name: string;
    };
};

type Result = DataOf<Response>;
```

Result:

```typescript
{
    id: number;
    name: string;
}
```

## Exercise 8: Extract First Tuple Element

Create a utility that extracts the first element from a tuple.

Expected:

```typescript
type A = First<[string, number, boolean]>;
// string

type B = First<[number, string]>;
// number
```

## Exercise 9: Distributive Conditional Type

Create a utility that converts every union member into an array.

Expected:

```typescript
type Result = ToArray<string | number>;

// string[] | number[]
```

## Exercise 10: Non-Distributive Conditional Type

Create a utility that checks whether the entire type is assignable to `string`.

Expected:

```typescript
type A = IsEntirelyString<string>; 
// true

type B = IsEntirelyString<string | number>;
// false
```

---

# 26. Phase 16 Completion Checklist

Before moving to the next phase, make sure you understand these concepts:

| No. | Topic | Status |
|---|---|---|
| 1 | Conditional types | ☐ |
| 2 | Conditional type syntax | ☐ |
| 3 | `extends` in conditional types | ☐ |
| 4 | Generic constraints vs conditional types | ☐ |
| 5 | Conditional types with generics | ☐ |
| 6 | Nested conditional types | ☐ |
| 7 | Distributive conditional types | ☐ |
| 8 | Non-distributive conditional types | ☐ |
| 9 | `never` in conditional types | ☐ |
| 10 | `infer` keyword | ☐ |
| 11 | Function return type inference | ☐ |
| 12 | Function parameter inference | ☐ |
| 13 | Array element inference | ☐ |
| 14 | Tuple element inference | ☐ |
| 15 | Promise value inference | ☐ |
| 16 | Recursive conditional types | ☐ |
| 17 | Built-in utility types | ☐ |
| 18 | Extracting object property types | ☐ |
| 19 | API response type extraction | ☐ |
| 20 | Compile-time vs runtime validation | ☐ |

---

## What Comes Next?

**Phase 17: Mapped Types and Advanced Object Type Transformations**

In the next phase, we will learn:

1. What are mapped types?
2. How to use `keyof` with mapped types.
3. Mapping over object properties.
4. Adding and removing `readonly`.
5. Adding and removing optional properties.
6. Key remapping using `as`.
7. Template literal types with mapped types.
8. Filtering object properties.
9. Creating custom utility types.
10. Real-world object transformations.

**Phase 16 complete.** When you're ready, say **"OK, Phase 17"** to continue.