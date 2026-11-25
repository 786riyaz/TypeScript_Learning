# Phase 40: Advanced TypeScript – Type-Level Programming and Advanced Type System

**Level:** Advanced to Expert  
**Prerequisites:** TypeScript fundamentals, interfaces, types, generics, union types, intersection types, functions, classes, and utility types.

## 1. Learning Objectives

In this phase, you will learn how to use TypeScript's type system to build highly reusable, flexible, and type-safe applications.

You will understand:

1. Advanced Generics.
2. Generic Constraints.
3. Generic Default Types.
4. Generic Type Inference.
5. Conditional Types.
6. Distributive Conditional Types.
7. The `infer` Keyword.
8. Mapped Types.
9. Key Remapping.
10. Template Literal Types.
11. Recursive Types.
12. Variadic Tuple Types.
13. Advanced Utility Types.
14. Advanced `keyof`.
15. Advanced `typeof`.
16. Indexed Access Types.
17. Type Predicates.
18. Assertion Functions.
19. Branded Types.
20. Nominal Typing Techniques.
21. Type-Level Programming.
22. Advanced Type Guards.
23. Type-Safe API Design.
24. Type-Safe Event Systems.
25. Advanced TypeScript Patterns.
26. Practical Type-Level Projects.

---

# PART 1: ADVANCED GENERICS

# 2. Understanding Advanced Generics

## 2.1 What Are Generics?

Generics allow us to create reusable components that work with different data types while preserving type safety.

You already know basic generics.

Example:

```typescript
function identity<T>(value: T): T {
    return value;
}

const result1 = identity<string>("Hello");

const result2 = identity<number>(100);
```

Here:

- `T` is a type parameter.
- `string` is the supplied type argument in the first call.
- `number` is the supplied type argument in the second call.

The important advantage is that TypeScript remembers the actual type.

```typescript
const name = identity("John");

name.toUpperCase();
```

TypeScript automatically infers that `name` is a string.

Let's explore advanced generics.

---

# 3. Generic Constraints

## 3.1 What Are Generic Constraints?

Generic constraints restrict the types that can be passed to a generic function or class.

We use the `extends` keyword to define constraints.

### Example Without Constraints

```typescript
function printLength<T>(value: T): void {

    console.log(value.length);
}
```

This produces an error because TypeScript cannot guarantee that every possible `T` has a `length` property.

For example, `number` does not have a `length` property.

### Using Generic Constraints

```typescript
function printLength<T extends { length: number }>(
    value: T
): void {

    console.log(value.length);
}
```

Usage:

```typescript
printLength("Hello");       // 5

printLength([1, 2, 3]);     // 3

printLength({ length: 10 }); // 10
```

Invalid:

```typescript
printLength(100); // Error
```

Why?

Because `number` does not satisfy:

```typescript
{ length: number }
```

## 3.2 Constraints Using Interfaces

You can also use interfaces.

```typescript
interface HasId {
    id: number;
}

function getId<T extends HasId>(item: T): number {

    return item.id;
}
```

Usage:

```typescript
const user = {
    id: 101,
    name: "John",
    email: "john@example.com"
};

console.log(getId(user));
```

The function accepts objects that contain a numeric `id` property.

Notice that the original object can contain additional properties.

This is because TypeScript uses structural typing.

## 3.3 Multiple Constraints

Suppose you want an object that has both `id` and `name`.

```typescript
interface HasId {
    id: number;
}

interface HasName {
    name: string;
}
```

Use intersection types:

```typescript
function display<T extends HasId & HasName>(
    item: T
): void {

    console.log(item.id);

    console.log(item.name);
}
```

Usage:

```typescript
display({
    id: 1,
    name: "John",
    email: "john@example.com"
});
```

## 3.4 Constraint Using `keyof`

This is particularly useful when working with object properties.

```typescript
function getProperty<T, K extends keyof T>(
    object: T,
    key: K
): T[K] {

    return object[key];
}
```

Usage:

```typescript
const user = {
    id: 101,
    name: "John",
    isActive: true
};

const name = getProperty(user, "name");

const id = getProperty(user, "id");

const active = getProperty(user, "isActive");
```

TypeScript infers:

```typescript
name   // string
id     // number
active // boolean
```

Invalid:

```typescript
getProperty(user, "email");
```

Because `email` is not a key of `user`.

### Important concepts

| Syntax | Meaning |
|---|---|
| `T` | Generic type parameter |
| `T extends string` | T must satisfy string constraint |
| `T extends HasId` | T must have the required HasId structure |
| `T extends A & B` | T must satisfy both types |
| `K extends keyof T` | K must be a key of T |

---

# 4. Generic Default Types

## 4.1 What Are Generic Defaults?

Generic default types allow us to specify a default type when a caller does not explicitly provide a generic type argument.

Example:

```typescript
interface ApiResponse<T = string> {
    data: T;
    success: boolean;
}
```

Usage:

```typescript
const response1: ApiResponse = {
    data: "Hello",
    success: true
};
```

Here, `T` defaults to `string`.

You can also override the default:

```typescript
const response2: ApiResponse<number> = {
    data: 100,
    success: true
};
```

## 4.2 Multiple Generic Defaults

```typescript
interface Response<T = unknown, E = string> {
    data: T;
    error?: E;
}
```

Usage:

```typescript
const result: Response<number> = {
    data: 100
};
```

Here:

- `T` is `number`.
- `E` is `string`.

You can override both:

```typescript
const result2: Response<number, Error> = {
    data: 100,
    error: new Error("Something went wrong")
};
```

### Important rule

A required type parameter cannot follow an optional/defaulted type parameter.

Invalid:

```typescript
// Invalid generic parameter ordering
// type Example<T = string, U> = {};
```

Valid:

```typescript
type Example<T, U = string> = {
    first: T;
    second: U;
};
```

### Real-world use case

Generic API response types:

```typescript
interface ApiResponse<T = unknown> {

    success: boolean;

    data: T;

    message?: string;
}
```

This lets you reuse one response structure for different API endpoints.

---

# 5. Generic Type Inference

## 5.1 What Is Type Inference?

Type inference means TypeScript automatically determines a type from the available context.

Example:

```typescript
function identity<T>(value: T): T {
    return value;
}

const result = identity("Hello");
```

TypeScript infers:

```typescript
result: string
```

You do not need to write:

```typescript
identity<string>("Hello");
```

## 5.2 Multiple Generic Parameters

```typescript
function merge<T, U>(first: T, second: U) {

    return {
        ...first,
        ...second
    };
}
```

Usage:

```typescript
const result = merge(
    { name: "John" },
    { age: 25 }
);
```

Inferred result:

```typescript
{
    name: string;
    age: number;
}
```

## 5.3 Generic Inference with Arrays

```typescript
function getFirst<T>(items: T[]): T | undefined {

    return items[0];
}
```

Usage:

```typescript
const number = getFirst([10, 20, 30]);

const name = getFirst(["John", "David"]);
```

Inferred types:

```typescript
number // number | undefined

name   // string | undefined
```

## 5.4 Generic Inference Limitations

Consider:

```typescript
function process<T>(value: T): T {

    return value;
}
```

If you pass:

```typescript
process("Hello");
```

TypeScript can infer `string`.

However, if the generic parameter appears in several positions, inference can become more complicated.

For example:

```typescript
function combine<T>(
    first: T,
    second: T
): T[] {

    return [first, second];
}
```

Usage:

```typescript
const result = combine(10, "Hello");
```

Depending on inference context and TypeScript version, the inferred type may be a common type or union-like type.

When exact behavior matters, explicitly provide a type argument:

```typescript
const result = combine<number | string>(
    10,
    "Hello"
);
```

### When to use generic inference?

Use inference when TypeScript can determine the correct type naturally.

Use explicit generic arguments when:

- Inference produces an overly broad type.
- You want a particular union or base type.
- You need to make an API call clearer.

---

# PART 2: CONDITIONAL TYPES

# 6. Conditional Types

## 6.1 What Are Conditional Types?

Conditional Types allow us to select a type based on a condition.

Their syntax is:

```typescript
T extends U ? X : Y
```

Meaning:

- If `T` satisfies `U`, use `X`.
- Otherwise, use `Y`.

This is similar to the ternary operator in JavaScript, but it operates at the type level.

### JavaScript comparison

JavaScript:

```javascript
const result = condition ? value1 : value2;
```

TypeScript conditional type:

```typescript
type Result<T> =
    T extends string ? "String" : "Other";
```

## 6.2 Basic Example

```typescript
type IsString<T> =
    T extends string ? true : false;
```

Usage:

```typescript
type A = IsString<string>;

type B = IsString<number>;

type C = IsString<"Hello">;
```

Results:

```typescript
A // true

B // false

C // true
```

Why is `"Hello"` true?

Because a string literal type extends `string`.

## 6.3 Conditional Types with Multiple Conditions

```typescript
type DataType<T> =
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
type A = DataType<string>;

type B = DataType<number>;

type C = DataType<boolean>;

type D = DataType<Date>;
```

Results:

```typescript
A // "String"

B // "Number"

C // "Boolean"

D // "Other"
```

## 6.4 Conditional Types with Objects

```typescript
type HasName<T> =
    T extends { name: string }
        ? true
        : false;
```

Usage:

```typescript
type User = {
    name: string;
    age: number;
};

type Product = {
    title: string;
    price: number;
};

type A = HasName<User>;

type B = HasName<Product>;
```

Results:

```typescript
A // true

B // false
```

## 6.5 Practical Example: Function Return Types

```typescript
type IsFunction<T> =
    T extends (...args: any[]) => any
        ? true
        : false;
```

Usage:

```typescript
type A = IsFunction<() => void>;

type B = IsFunction<string>;

type C = IsFunction<(x: number) => number>;
```

Results:

```typescript
A // true

B // false

C // true
```

### Important

Conditional types are evaluated by TypeScript's compiler.

They do not execute JavaScript at runtime.

---

# 7. Distributive Conditional Types

## 7.1 What Is Distribution?

When a conditional type operates on a naked generic type parameter, and that parameter receives a union, TypeScript distributes the conditional over each member of the union.

Let's understand this carefully.

Example:

```typescript
type ToArray<T> =
    T extends any ? T[] : never;
```

Usage:

```typescript
type Result = ToArray<string | number>;
```

Result:

```typescript
string[] | number[]
```

Why?

TypeScript effectively evaluates:

```typescript
ToArray<string> | ToArray<number>
```

Therefore:

```typescript
string[] | number[]
```

## 7.2 Another Example

```typescript
type IsString<T> =
    T extends string ? "Yes" : "No";
```

Usage:

```typescript
type Result = IsString<string | number>;
```

Result:

```typescript
"Yes" | "No"
```

Because:

```typescript
IsString<string> | IsString<number>
```

## 7.3 Preventing Distribution

Sometimes you want to check the entire union as one type.

Use square brackets around the type parameter.

```typescript
type IsString<T> =
    [T] extends [string]
        ? true
        : false;
```

Usage:

```typescript
type A = IsString<string>;

type B = IsString<string | number>;
```

Results:

```typescript
A // true

B // false
```

Compare:

```typescript
type Distributed<T> =
    T extends string ? true : false;

type NotDistributed<T> =
    [T] extends [string] ? true : false;
```

### Comparison

| Distributed | Non-distributed |
|---|---|
| `T extends U` | `[T] extends [U]` |
| Evaluates union members individually | Checks the union as a whole |
| Useful for filtering unions | Useful for checking complete types |

---

# 8. The `infer` Keyword

## 8.1 What Is `infer`?

The `infer` keyword allows TypeScript to extract or infer a type from another type inside a conditional type.

It is commonly used to extract:

- Function return types.
- Function parameters.
- Promise values.
- Array element types.
- Tuple elements.

### Basic Syntax

```typescript
T extends SomeStructure<infer U>
    ? U
    : never
```

Here:

`infer U` tells TypeScript to infer the type that occupies that position.

## 8.2 Extract Function Return Type

Consider:

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
        name: "John"
    };
}

type UserReturnType = GetReturnType<typeof getUser>;
```

Result:

```typescript
{
    id: number;
    name: string;
}
```

## 8.3 Extract Function Parameters

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
    age: number
): void {}

type Params = GetParameters<typeof createUser>;
```

Result:

```typescript
[name: string, age: number]
```

## 8.4 Extract Promise Value

```typescript
type UnwrapPromise<T> =
    T extends Promise<infer U>
        ? U
        : T;
```

Usage:

```typescript
type A = UnwrapPromise<Promise<string>>;

type B = UnwrapPromise<Promise<number>>;

type C = UnwrapPromise<string>;
```

Results:

```typescript
A // string

B // number

C // string
```

## 8.5 Extract Array Element Type

```typescript
type ArrayElement<T> =
    T extends readonly (infer U)[]
        ? U
        : never;
```

Usage:

```typescript
type A = ArrayElement<string[]>;

type B = ArrayElement<number[]>;

type C = ArrayElement<readonly boolean[]>;
```

Results:

```typescript
A // string

B // number

C // boolean
```

## 8.6 Extract Tuple Elements

```typescript
type FirstElement<T> =
    T extends readonly [infer First, ...unknown[]]
        ? First
        : never;
```

Usage:

```typescript
type Result = FirstElement<[string, number, boolean]>;
```

Result:

```typescript
string
```

### Important

The `infer` keyword does not create a JavaScript variable.

It creates a type-level inference variable that exists only during type evaluation.

---

# PART 3: MAPPED TYPES

# 9. Mapped Types

## 9.1 What Are Mapped Types?

Mapped Types allow us to create new types by iterating over the keys of an existing type.

They are useful for transforming object types.

### Basic Example

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};
```

Suppose we want every property to become optional.

```typescript
type OptionalUser = {
    [K in keyof User]?: User[K];
};
```

Result:

```typescript
type OptionalUser = {
    id?: number;
    name?: string;
    email?: string;
};
```

Let's understand the syntax.

```typescript
[K in keyof User]?: User[K];
```

| Part | Meaning |
|---|---|
| `keyof User` | Gets all keys of User |
| `K` | Represents each key |
| `in` | Iterates over keys |
| `?` | Makes each property optional |
| `User[K]` | Gets the type of the current property |

## 9.2 Making All Properties Readonly

```typescript
type ReadonlyUser = {
    readonly [K in keyof User]: User[K];
};
```

Result:

```typescript
type ReadonlyUser = {
    readonly id: number;
    readonly name: string;
    readonly email: string;
};
```

## 9.3 Removing Optional Properties

Mapped types support property modifier removal.

```typescript
type RequiredUser = {
    [K in keyof OptionalUser]-?: OptionalUser[K];
};
```

The `-?` removes optional modifiers.

## 9.4 Removing Readonly

```typescript
type MutableUser = {
    -readonly [K in keyof ReadonlyUser]: ReadonlyUser[K];
};
```

### Mapped Type Modifier Syntax

| Syntax | Meaning |
|---|---|
| `?` | Add optional |
| `-?` | Remove optional |
| `readonly` | Add readonly |
| `-readonly` | Remove readonly |

---

# 10. Key Remapping in Mapped Types

## 10.1 What Is Key Remapping?

Key remapping allows us to transform property names while creating a new mapped type.

We use the `as` keyword.

### Example

```typescript
type User = {
    name: string;
    age: number;
};
```

We want to create property names prefixed with `get`.

```typescript
type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]:
        () => T[K];
};
```

Usage:

```typescript
type UserGetters = Getters<User>;
```

Result:

```typescript
type UserGetters = {
    getName: () => string;
    getAge: () => number;
};
```

## 10.2 Removing Properties

You can also filter keys by mapping them to `never`.

```typescript
type RemoveStringProperties<T> = {
    [K in keyof T as
        T[K] extends string ? never : K
    ]: T[K];
};
```

Usage:

```typescript
type User = {
    id: number;
    name: string;
    age: number;
    email: string;
};

type Result = RemoveStringProperties<User>;
```

Result:

```typescript
type Result = {
    id: number;
    age: number;
};
```

String-valued properties have been removed.

## 10.3 Rename Properties

```typescript
type RenameKeys<T> = {
    [K in keyof T as
        K extends "name" ? "fullName" : K
    ]: T[K];
};
```

Usage:

```typescript
type User = {
    id: number;
    name: string;
};

type UpdatedUser = RenameKeys<User>;
```

Result:

```typescript
type UpdatedUser = {
    id: number;
    fullName: string;
};
```

---

# PART 4: TEMPLATE LITERAL TYPES

# 11. Template Literal Types

## 11.1 What Are Template Literal Types?

Template Literal Types allow us to construct new string types using template literal syntax.

They use backticks, similar to JavaScript template literals.

### JavaScript Example

```javascript
const message = `Hello ${name}`;
```

### TypeScript Example

```typescript
type Greeting = `Hello ${string}`;
```

This represents strings beginning with `"Hello "`.

## 11.2 Basic Example

```typescript
type Direction = "left" | "right";

type Position = `${Direction}-position`;
```

Result:

```typescript
type Position =
    | "left-position"
    | "right-position";
```

## 11.3 Multiple Unions

```typescript
type Size = "small" | "large";

type Color = "red" | "blue";

type Product = `${Size}-${Color}`;
```

Result:

```typescript
type Product =
    | "small-red"
    | "small-blue"
    | "large-red"
    | "large-blue";
```

TypeScript generates every combination.

## 11.4 Built-in String Utility Types

TypeScript provides several string manipulation types.

| Utility | Purpose |
|---|---|
| `Uppercase<T>` | Converts to uppercase |
| `Lowercase<T>` | Converts to lowercase |
| `Capitalize<T>` | Capitalizes first character |
| `Uncapitalize<T>` | Lowercases first character |

Example:

```typescript
type A = Uppercase<"hello">;

type B = Lowercase<"HELLO">;

type C = Capitalize<"hello">;

type D = Uncapitalize<"Hello">;
```

Results:

```typescript
A // "HELLO"

B // "hello"

C // "Hello"

D // "hello"
```

## 11.5 Type-Safe Event Names

Suppose you have:

```typescript
type User = {
    name: string;
    age: number;
    email: string;
};
```

You want event names like:

- `nameChanged`
- `ageChanged`
- `emailChanged`

Create:

```typescript
type ChangeEvents<T> = {
    [K in keyof T as
        `${string & K}Changed`
    ]: (value: T[K]) => void;
};
```

Usage:

```typescript
type UserEvents = ChangeEvents<User>;
```

Result:

```typescript
type UserEvents = {
    nameChanged: (value: string) => void;
    ageChanged: (value: number) => void;
    emailChanged: (value: string) => void;
};
```

This is especially useful for strongly typed event systems.

---

# PART 5: RECURSIVE TYPES

# 12. Recursive Types

## 12.1 What Are Recursive Types?

A Recursive Type is a type that refers to itself.

It is useful for representing nested or hierarchical structures.

### Real-world examples

- Nested comments.
- File systems.
- Tree structures.
- JSON.
- Nested categories.
- Organizational structures.

## 12.2 Recursive Object Type

```typescript
type TreeNode = {
    value: string;
    children: TreeNode[];
};
```

Usage:

```typescript
const tree: TreeNode = {

    value: "Root",

    children: [
        {
            value: "Child 1",
            children: []
        },
        {
            value: "Child 2",
            children: [
                {
                    value: "Grandchild",
                    children: []
                }
            ]
        }
    ]
};
```

The `TreeNode` type references itself through `children`.

## 12.3 Recursive JSON Type

```typescript
type JSONValue =
    | string
    | number
    | boolean
    | null
    | JSONValue[]
    | {
        [key: string]: JSONValue;
    };
```

This type represents valid JSON values.

Example:

```typescript
const data: JSONValue = {

    name: "John",

    age: 25,

    active: true,

    address: {
        city: "Ahmedabad",
        country: "India"
    },

    skills: [
        "JavaScript",
        "TypeScript"
    ]
};
```

## 12.4 Recursive Utility Type: DeepReadonly

Suppose you want every nested property to become readonly.

First:

```typescript
type DeepReadonly<T> = {

    readonly [K in keyof T]:
        T[K] extends object
            ? DeepReadonly<T[K]>
            : T[K];

};
```

Usage:

```typescript
type User = {
    name: string;

    address: {
        city: string;
        country: string;
    };
};

type ReadonlyUser = DeepReadonly<User>;
```

Now nested properties are readonly too.

```typescript
const user: ReadonlyUser = {
    name: "John",
    address: {
        city: "Ahmedabad",
        country: "India"
    }
};
```

Invalid:

```typescript
user.name = "David";

user.address.city = "Mumbai";
```

### Important improvement

The simple `DeepReadonly` implementation treats all object types recursively. For production utility types, special cases may be needed for:

- Functions.
- Arrays and tuples.
- Maps and Sets.
- Dates.
- Other built-in objects.

For example, a function should generally remain callable rather than being transformed into a mapped object type.

---

# PART 6: VARIADIC TUPLE TYPES

# 13. Understanding Variadic Tuple Types

## 13.1 What Is a Tuple?

A tuple is an array type with a fixed or known sequence of element types.

Example:

```typescript
type User = [string, number, boolean];
```

Meaning:

```typescript
const user: User = [
    "John",
    25,
    true
];
```

Unlike a normal array, tuple positions have specific types.

## 13.2 What Are Variadic Tuple Types?

Variadic Tuple Types allow tuples to contain generic sequences of elements using rest elements.

Example:

```typescript
type Numbers = [number, ...number[]];
```

This represents a tuple starting with a number, followed by zero or more numbers.

## 13.3 Combining Tuples

```typescript
type First = [string, number];

type Second = [boolean, Date];

type Combined = [...First, ...Second];
```

Result:

```typescript
type Combined = [
    string,
    number,
    boolean,
    Date
];
```

## 13.4 Generic Tuple Function

```typescript
function concat<T extends unknown[], U extends unknown[]>(
    first: [...T],
    second: [...U]
): [...T, ...U] {

    return [...first, ...second];
}
```

Usage:

```typescript
const result = concat(
    ["John", 25],
    [true, "Developer"]
);
```

The resulting tuple preserves the element sequence:

```typescript
[string, number, boolean, string]
```

## 13.5 Partial Function Application

Variadic tuples are also useful for creating partially applied functions.

```typescript
function partialCall<
    T extends unknown[],
    U extends unknown[],
    R
>(
    fn: (...args: [...T, ...U]) => R,
    ...head: T
) {

    return (...tail: U): R => {

        return fn(...head, ...tail);
    };
}
```

Usage:

```typescript
function add(
    a: number,
    b: number,
    c: number
): number {

    return a + b + c;
}

const addFive = partialCall(add, 5);

console.log(addFive(10, 20));
```

Output:

```text
35
```

### Why use Variadic Tuples?

- Function wrappers.
- Middleware.
- Function composition.
- Partial application.
- Type-safe argument forwarding.

---

# PART 7: ADVANCED TYPE OPERATORS

# 14. Advanced `keyof`

## 14.1 What Is `keyof`?

The `keyof` operator produces a union of an object's property keys.

Example:

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};

type UserKeys = keyof User;
```

Result:

```typescript
"id" | "name" | "email"
```

## 14.2 `keyof` with Index Signatures

```typescript
type Dictionary = {
    [key: string]: string;
};

type Keys = keyof Dictionary;
```

Result:

```typescript
string | number
```

Why does `number` appear?

Because JavaScript object property keys can be accessed using numeric values, which are converted to strings.

## 14.3 `keyof` with Arrays

```typescript
type Keys = keyof string[];
```

This includes array property and method names, along with numeric indexing behavior represented through array-related types.

You generally should not assume that `keyof string[]` is simply `number`.

## 14.4 Practical Example

```typescript
function updateProperty<
    T,
    K extends keyof T
>(
    object: T,
    key: K,
    value: T[K]
): void {

    object[key] = value;
}
```

Usage:

```typescript
const user = {
    name: "John",
    age: 25
};

updateProperty(user, "name", "David");

updateProperty(user, "age", 30);
```

Invalid:

```typescript
updateProperty(user, "age", "Thirty");
```

Because `age` requires a number.

---

# 15. Advanced `typeof`

## 15.1 What Is `typeof` in TypeScript?

TypeScript supports `typeof` in type positions to obtain the type of an existing value.

Example:

```typescript
const user = {
    id: 1,
    name: "John",
    active: true
};

type User = typeof user;
```

Result:

```typescript
type User = {
    id: number;
    name: string;
    active: boolean;
};
```

This is useful when you want to derive a type from an existing value.

## 15.2 `typeof` with Functions

```typescript
function add(a: number, b: number) {
    return a + b;
}

type AddFunction = typeof add;
```

Result:

```typescript
type AddFunction =
    (a: number, b: number) => number;
```

## 15.3 `typeof` with Objects

```typescript
const config = {
    appName: "My Application",
    port: 3000,
    debug: true
};

type Config = typeof config;
```

## 15.4 `typeof` with `as const`

Consider:

```typescript
const roles = ["admin", "user", "guest"];
```

TypeScript infers:

```typescript
string[]
```

But suppose you want literal types.

```typescript
const roles = [
    "admin",
    "user",
    "guest"
] as const;
```

Now the inferred type is:

```typescript
readonly ["admin", "user", "guest"]
```

You can extract a union:

```typescript
type Role = typeof roles[number];
```

Result:

```typescript
"admin" | "user" | "guest"
```

### Understanding `typeof roles[number]`

- `typeof roles` obtains the tuple type.
- `[number]` accesses the type of elements at numeric positions.
- The result is the union of all tuple element types.

This technique is extremely useful for defining enums-like unions.

---

# 16. Indexed Access Types

## 16.1 What Are Indexed Access Types?

Indexed Access Types allow you to retrieve a type by using another type's property key.

Syntax:

```typescript
T[K]
```

Example:

```typescript
type User = {
    id: number;
    name: string;
    active: boolean;
};
```

Extract a property type:

```typescript
type UserName = User["name"];
```

Result:

```typescript
string
```

## 16.2 Extract Multiple Properties

```typescript
type UserBasicInfo = User["id" | "name"];
```

Result:

```typescript
number | string
```

## 16.3 Extract All Property Types

```typescript
type UserValues = User[keyof User];
```

Result:

```typescript
number | string | boolean
```

## 16.4 Indexed Access with Arrays

```typescript
type Users = {
    id: number;
    name: string;
}[];

type User = Users[number];
```

Result:

```typescript
{
    id: number;
    name: string;
}
```

## 16.5 Practical Example

```typescript
type Product = {
    id: number;
    name: string;
    price: number;
    category: string;
};

type ProductPrice = Product["price"];

type ProductProperties = keyof Product;

type ProductValues = Product[keyof Product];
```

Results:

```typescript
ProductPrice
// number

ProductProperties
// "id" | "name" | "price" | "category"

ProductValues
// number | string
```

---

# PART 8: TYPE GUARDS AND ASSERTIONS

# 17. Type Predicates

## 17.1 What Is a Type Predicate?

A Type Predicate is a special return type that tells TypeScript when a function has verified that a value belongs to a particular type.

Syntax:

```typescript
parameterName is Type
```

### Example

```typescript
interface User {
    id: number;
    name: string;
}

interface Product {
    id: number;
    price: number;
}
```

Create a type guard:

```typescript
function isUser(
    value: User | Product
): value is User {

    return "name" in value;
}
```

Usage:

```typescript
function display(
    value: User | Product
): void {

    if (isUser(value)) {

        console.log(value.name);

    } else {

        console.log(value.price);
    }
}
```

TypeScript understands the type inside each branch.

## 17.2 Type Predicate with Arrays

```typescript
function isString(
    value: unknown
): value is string {

    return typeof value === "string";
}
```

Usage:

```typescript
const values: unknown[] = [
    "Hello",
    100,
    "World",
    true
];

const strings = values.filter(isString);
```

The result is inferred as:

```typescript
string[]
```

## 17.3 Why Use `unknown` Instead of `any`?

`any` disables most type checking.

`unknown` requires you to verify the value before using it.

Example:

```typescript
function process(value: unknown): void {

    if (typeof value === "string") {
        console.log(value.toUpperCase());
    }
}
```

This is safer than using `any`.

### Important

A type predicate does not automatically validate data.

You must implement the runtime check correctly.

TypeScript trusts the predicate's declared result, so an incorrect predicate can make your code unsound.

---

# 18. Assertion Functions

## 18.1 What Are Assertion Functions?

Assertion functions validate conditions and tell TypeScript that a particular condition must be true after the function successfully completes.

They use the `asserts` keyword.

### Example

```typescript
function assertString(
    value: unknown
): asserts value is string {

    if (typeof value !== "string") {
        throw new Error("Value must be a string");
    }
}
```

Usage:

```typescript
function process(value: unknown): void {

    assertString(value);

    console.log(value.toUpperCase());
}
```

After `assertString(value)` completes successfully, TypeScript treats `value` as a string.

## 18.2 Assertion Without a Type Predicate

```typescript
function assert(condition: unknown): asserts condition {

    if (!condition) {
        throw new Error("Assertion failed");
    }
}
```

Usage:

```typescript
const age: number = 25;

assert(age >= 18);

console.log("Eligible");
```

The assertion tells TypeScript that the condition must hold if execution continues.

### Difference: Type Predicate vs Assertion Function

| Type Predicate | Assertion Function |
|---|---|
| Returns a boolean | Throws if assertion fails |
| Uses `value is Type` | Uses `asserts value is Type` |
| Used in conditional narrowing | Used to establish a condition |
| Example: `isUser()` | Example: `assertUser()` |

---

# PART 9: BRANDED AND NOMINAL TYPES

# 19. Branded Types

## 19.1 What Is a Branded Type?

TypeScript primarily uses structural typing.

This means two types with the same structure are generally compatible.

Example:

```typescript
type UserId = string;

type ProductId = string;
```

Now:

```typescript
const userId: UserId = "USER-101";

const productId: ProductId = userId;
```

This is allowed.

But sometimes you want to prevent accidental mixing of logically different values.

Branded Types can help.

## 19.2 Creating Branded Types

```typescript
type UserId = string & {
    readonly __brand: "UserId";
};

type ProductId = string & {
    readonly __brand: "ProductId";
};
```

Now create values through controlled constructors:

```typescript
function createUserId(value: string): UserId {

    return value as UserId;
}

function createProductId(value: string): ProductId {

    return value as ProductId;
}
```

Usage:

```typescript
const userId = createUserId("USER-101");

const productId = createProductId("PRODUCT-101");
```

This is invalid:

```typescript
const id: UserId = productId;
```

Because the branded types are structurally different.

## 19.3 Practical Example: Email Address

```typescript
type Email = string & {
    readonly __brand: "Email";
};
```

Create a validation function:

```typescript
function createEmail(value: string): Email {

    if (!value.includes("@")) {
        throw new Error("Invalid email");
    }

    return value as Email;
}
```

Usage:

```typescript
const email = createEmail("john@example.com");
```

Now functions can require a validated email:

```typescript
function sendEmail(email: Email): void {

    console.log("Sending email to:", email);
}
```

Invalid:

```typescript
sendEmail("john@example.com");
```

Valid:

```typescript
sendEmail(email);
```

### Important limitation

Branded Types are compile-time techniques.

They do not create runtime validation or security boundaries.

The assertion `as Email` can bypass the intended validation if used carelessly.

---

# 20. Nominal Typing Techniques

## 20.1 Structural vs Nominal Typing

TypeScript primarily uses structural typing.

Let's understand the difference.

### Structural Typing

Two types are compatible when their structures are compatible.

```typescript
type Point = {
    x: number;
    y: number;
};

const point = {
    x: 10,
    y: 20,
    z: 30
};

const position: Point = point;
```

This is allowed.

### Nominal Typing

Nominal typing identifies types based on their declared identity rather than only their structure.

TypeScript does not provide general-purpose nominal typing for ordinary interfaces and type aliases.

However, we can simulate it.

## 20.2 Using `unique symbol`

```typescript
declare const UserIdBrand: unique symbol;

type UserId = string & {
    readonly [UserIdBrand]: true;
};
```

Another branded type:

```typescript
declare const ProductIdBrand: unique symbol;

type ProductId = string & {
    readonly [ProductIdBrand]: true;
};
```

Now they are distinct types.

## 20.3 Using Classes with Private Members

TypeScript also uses private and protected members when checking compatibility between class instances.

```typescript
class UserId {

    private brand!: void;

    constructor(
        public readonly value: string
    ) {}
}

class ProductId {

    private brand!: void;

    constructor(
        public readonly value: string
    ) {}
}
```

Even though the public properties are structurally similar, their private members originate from different classes.

Therefore, their instances are incompatible.

### Comparison

| Technique | Purpose |
|---|---|
| Structural typing | Compatibility based on structure |
| Branded types | Distinguish logically different values |
| `unique symbol` | Create unique compile-time property identities |
| Private class members | Introduce nominal-like compatibility restrictions |

---

# PART 10: TYPE-LEVEL PROGRAMMING

# 21. What Is Type-Level Programming?

Type-Level Programming means using TypeScript's type system to perform transformations, computations, and validation at compile time.

Normal programming operates on runtime values.

Type-level programming operates on types.

### Runtime Programming

```typescript
function add(a: number, b: number): number {
    return a + b;
}

const result = add(10, 20);
```

This calculation happens at runtime.

### Type-Level Programming

```typescript
type IsString<T> =
    T extends string ? true : false;

type Result = IsString<string>;
```

This evaluation happens during type checking.

No JavaScript code is generated for the type alias.

## 21.1 Type-Level Filtering

```typescript
type ExtractStrings<T> =
    T extends string ? T : never;
```

Usage:

```typescript
type Result = ExtractStrings<
    string | number | boolean | "Hello"
>;
```

Result:

```typescript
string
```

The conditional distributes over union members.

## 21.2 Type-Level Exclusion

```typescript
type ExcludeNumbers<T> =
    T extends number ? never : T;
```

Usage:

```typescript
type Result = ExcludeNumbers<
    string | number | boolean
>;
```

Result:

```typescript
string | boolean
```

## 21.3 Type-Level Object Transformation

```typescript
type Nullable<T> = {
    [K in keyof T]: T[K] | null;
};
```

Usage:

```typescript
type User = {
    id: number;
    name: string;
};

type NullableUser = Nullable<User>;
```

Result:

```typescript
type NullableUser = {
    id: number | null;
    name: string | null;
};
```

## 21.4 Type-Level Tuple Length

```typescript
type Length<T extends readonly unknown[]> =
    T["length"];
```

Usage:

```typescript
type Result = Length<[string, number, boolean]>;
```

Result:

```typescript
3
```

## 21.5 Type-Level First Element

```typescript
type First<T extends readonly unknown[]> =
    T extends readonly [infer F, ...unknown[]]
        ? F
        : never;
```

Usage:

```typescript
type Result = First<[string, number, boolean]>;
```

Result:

```typescript
string
```

### Why is Type-Level Programming useful?

- Building reusable libraries.
- Creating strongly typed APIs.
- Validating configuration structures.
- Creating type-safe event systems.
- Building advanced utility types.
- Improving developer experience.

### Important limitation

Very complicated type-level computations can increase compilation time and make errors difficult to understand.

Prefer readable types over unnecessarily clever types.

---

# PART 11: ADVANCED UTILITY TYPES

# 22. Understanding Utility Types Internals

TypeScript provides built-in utility types that transform existing types.

You have already learned several common utility types.

Let's understand their implementations conceptually.

## 22.1 Partial

Makes all properties optional.

```typescript
type MyPartial<T> = {
    [K in keyof T]?: T[K];
};
```

Usage:

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}

type PartialUser = MyPartial<User>;
```

## 22.2 Required

Makes all properties required.

```typescript
type MyRequired<T> = {
    [K in keyof T]-?: T[K];
};
```

## 22.3 Readonly

Makes all properties readonly.

```typescript
type MyReadonly<T> = {
    readonly [K in keyof T]: T[K];
};
```

## 22.4 Pick

Selects specific properties.

```typescript
type MyPick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

Usage:

```typescript
type UserInfo = MyPick<User, "id" | "name">;
```

## 22.5 Omit

Removes selected properties.

```typescript
type MyOmit<T, K extends PropertyKey> =
    Pick<T, Exclude<keyof T, K>>;
```

Usage:

```typescript
type PublicUser = MyOmit<User, "email">;
```

## 22.6 Record

Creates an object type with specific keys and values.

```typescript
type MyRecord<
    K extends PropertyKey,
    T
> = {
    [P in K]: T;
};
```

Usage:

```typescript
type Roles = "admin" | "user" | "guest";

type RolePermissions = MyRecord<
    Roles,
    string[]
>;
```

Result:

```typescript
type RolePermissions = {
    admin: string[];
    user: string[];
    guest: string[];
};
```

## 22.7 Exclude

Removes members assignable to a particular type.

```typescript
type MyExclude<T, U> =
    T extends U ? never : T;
```

Usage:

```typescript
type Result = MyExclude<
    string | number | boolean,
    number
>;
```

Result:

```typescript
string | boolean
```

## 22.8 Extract

Keeps members assignable to a particular type.

```typescript
type MyExtract<T, U> =
    T extends U ? T : never;
```

Usage:

```typescript
type Result = MyExtract<
    string | number | boolean,
    string | boolean
>;
```

Result:

```typescript
string | boolean
```

## 22.9 NonNullable

Removes `null` and `undefined`.

```typescript
type MyNonNullable<T> =
    T & {};
```

Usage:

```typescript
type Result = MyNonNullable<
    string | null | undefined
>;
```

Result:

```typescript
string
```

The built-in utility is defined by TypeScript's library declarations; the implementation above illustrates the transformation.

## 22.10 Parameters

Extracts function parameter types.

```typescript
type MyParameters<
    T extends (...args: any[]) => any
> =
    T extends (...args: infer P) => any
        ? P
        : never;
```

Usage:

```typescript
function createUser(
    name: string,
    age: number
): void {}

type Params = MyParameters<typeof createUser>;
```

Result:

```typescript
[name: string, age: number]
```

## 22.11 ReturnType

Extracts the return type of a function.

```typescript
type MyReturnType<
    T extends (...args: any[]) => any
> =
    T extends (...args: any[]) => infer R
        ? R
        : never;
```

Usage:

```typescript
function getUser() {
    return {
        id: 1,
        name: "John"
    };
}

type User = MyReturnType<typeof getUser>;
```

## 22.12 Awaited

Extracts the resolved type of a Promise-like value recursively.

A simplified version:

```typescript
type MyAwaited<T> =
    T extends null | undefined
        ? T
        : T extends object & {
            then(
                onfulfilled: infer F,
                ...args: any[]
            ): any;
        }
            ? F extends (
                value: infer V,
                ...args: any[]
            ) => any
                ? MyAwaited<V>
                : never
            : T;
```

Usage:

```typescript
type A = MyAwaited<Promise<string>>;

type B = MyAwaited<Promise<Promise<number>>>;
```

Results:

```typescript
A // string

B // number
```

This is an educational illustration. The built-in `Awaited<T>` handles Promise-like thenables according to TypeScript's library definitions.

### Utility Types Summary

| Utility | Purpose |
|---|---|
| `Partial<T>` | Makes properties optional |
| `Required<T>` | Makes properties required |
| `Readonly<T>` | Makes properties readonly |
| `Pick<T, K>` | Selects properties |
| `Omit<T, K>` | Removes properties |
| `Record<K, T>` | Creates object types |
| `Exclude<T, U>` | Excludes union members |
| `Extract<T, U>` | Extracts union members |
| `NonNullable<T>` | Removes null and undefined |
| `Parameters<T>` | Extracts function parameters |
| `ReturnType<T>` | Extracts function return type |
| `Awaited<T>` | Extracts resolved Promise-like type |

---

# PART 12: TYPE-SAFE API DESIGN

# 23. Building Type-Safe API Responses

A real-world application often has many API endpoints.

Instead of defining response structures repeatedly, we can create reusable generic types.

## 23.1 Generic API Response

```typescript
interface ApiResponse<T> {

    success: boolean;

    data: T;

    message?: string;
}
```

Define User:

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}
```

Usage:

```typescript
const response: ApiResponse<User> = {

    success: true,

    data: {
        id: 1,
        name: "John",
        email: "john@example.com"
    }
};
```

## 23.2 Generic Paginated Response

```typescript
interface Pagination {
    page: number;
    limit: number;
    total: number;
}
```

```typescript
interface PaginatedResponse<T> {

    data: T[];

    pagination: Pagination;
}
```

Usage:

```typescript
const users: PaginatedResponse<User> = {

    data: [
        {
            id: 1,
            name: "John",
            email: "john@example.com"
        }
    ],

    pagination: {
        page: 1,
        limit: 10,
        total: 100
    }
};
```

## 23.3 Type-Safe API Error

```typescript
interface ApiError {
    code: string;
    message: string;
}
```

```typescript
type ApiResult<T> =
    | {
        success: true;
        data: T;
    }
    | {
        success: false;
        error: ApiError;
    };
```

Usage:

```typescript
function getUser(): ApiResult<User> {

    return {
        success: true,
        data: {
            id: 1,
            name: "John",
            email: "john@example.com"
        }
    };
}
```

Handling:

```typescript
const result = getUser();

if (result.success) {

    console.log(result.data.name);

} else {

    console.log(result.error.message);
}
```

TypeScript automatically narrows the type based on the `success` property.

This is called a **Discriminated Union**.

### Important

TypeScript types do not validate incoming HTTP request bodies.

For runtime validation, use tools such as Zod, Valibot, or another schema-validation library.

---

# PART 13: TYPE-SAFE EVENT SYSTEM

# 24. Building a Type-Safe Event Emitter

Let's build an event system where each event has a specific payload type.

## 24.1 Define Event Map

```typescript
interface AppEvents {

    userCreated: {
        id: number;
        name: string;
    };

    orderPlaced: {
        orderId: string;
        total: number;
    };

    paymentCompleted: {
        paymentId: string;
        amount: number;
    };
}
```

## 24.2 Create Event Emitter

```typescript
class EventEmitter<
    Events extends Record<keyof Events, unknown>
> {

    private listeners: {
        [K in keyof Events]?: Array<
            (payload: Events[K]) => void
        >;
    } = {};

    on<K extends keyof Events>(
        event: K,
        callback: (payload: Events[K]) => void
    ): void {

        const listeners =
            this.listeners[event] ?? [];

        listeners.push(callback);

        this.listeners[event] = listeners;
    }

    emit<K extends keyof Events>(
        event: K,
        payload: Events[K]
    ): void {

        const listeners = this.listeners[event] ?? [];

        for (const listener of listeners) {
            listener(payload);
        }
    }
}
```

## 24.3 Usage

```typescript
const emitter = new EventEmitter<AppEvents>();
```

Subscribe:

```typescript
emitter.on("userCreated", (user) => {

    console.log(user.id);

    console.log(user.name);
});
```

Emit:

```typescript
emitter.emit("userCreated", {
    id: 1,
    name: "John"
});
```

Invalid event:

```typescript
// Error: Invalid event name
emitter.emit("productCreated", {});
```

Invalid payload:

```typescript
// Error: Missing required payload properties
emitter.emit("userCreated", {
    id: 1
});
```

### What did we use?

- Generics.
- Generic constraints.
- `keyof`.
- Mapped types.
- Indexed access types.
- Generic inference.

This is an excellent example of combining advanced TypeScript features.

---

# PART 14: ADVANCED TYPESCRIPT PATTERNS

# 25. Discriminated Unions

## 25.1 What Are Discriminated Unions?

A Discriminated Union is a union of object types that share a common property with different literal values.

That common property is called the discriminant.

Example:

```typescript
type SuccessResponse = {
    status: "success";
    data: string;
};

type ErrorResponse = {
    status: "error";
    message: string;
};

type Response =
    | SuccessResponse
    | ErrorResponse;
```

Handling:

```typescript
function handleResponse(response: Response): void {

    if (response.status === "success") {

        console.log(response.data);

    } else {

        console.log(response.message);
    }
}
```

TypeScript understands which properties are available in each branch.

## 25.2 Exhaustive Checking

Use the `never` type to ensure every union case is handled.

```typescript
type PaymentStatus =
    | "pending"
    | "completed"
    | "failed";
```

```typescript
function assertNever(value: never): never {

    throw new Error(`Unexpected value: ${value}`);
}
```

```typescript
function processPayment(
    status: PaymentStatus
): string {

    switch (status) {

        case "pending":
            return "Payment pending";

        case "completed":
            return "Payment completed";

        case "failed":
            return "Payment failed";

        default:
            return assertNever(status);
    }
}
```

If a new status is added but not handled, TypeScript can report an error.

This is especially useful for complex business workflows.

---

# 26. Type Guards with `in`, `typeof`, and `instanceof`

TypeScript provides several ways to narrow types.

### 1. `typeof`

```typescript
function process(value: string | number): void {

    if (typeof value === "string") {
        console.log(value.toUpperCase());
    } else {
        console.log(value.toFixed(2));
    }
}
```

### 2. `instanceof`

```typescript
class Admin {
    manageUsers(): void {}
}

class Customer {
    placeOrder(): void {}
}

function processUser(user: Admin | Customer): void {

    if (user instanceof Admin) {
        user.manageUsers();
    } else {
        user.placeOrder();
    }
}
```

### 3. `in`

```typescript
type Admin = {
    role: "admin";
    permissions: string[];
};

type Customer = {
    role: "customer";
    orders: number;
};
```

```typescript
function process(
    user: Admin | Customer
): void {

    if ("permissions" in user) {
        console.log(user.permissions);
    } else {
        console.log(user.orders);
    }
}
```

### 4. Custom Type Guard

```typescript
function isAdmin(
    user: Admin | Customer
): user is Admin {

    return user.role === "admin";
}
```

---

# PART 15: PRACTICAL TYPE-LEVEL PROJECTS

# 27. Project 1: Type-Safe Configuration System

Suppose you have an application configuration.

```typescript
const config = {

    app: {
        name: "My Application",
        port: 3000
    },

    database: {
        host: "localhost",
        port: 3306
    },

    features: {
        authentication: true,
        payments: false
    }

} as const;
```

Extract its type:

```typescript
type AppConfig = typeof config;
```

Now:

```typescript
type DatabaseConfig = AppConfig["database"];
```

Result:

```typescript
{
    readonly host: "localhost";
    readonly port: 3306;
}
```

Extract possible feature names:

```typescript
type FeatureName = keyof AppConfig["features"];
```

Result:

```typescript
"authentication" | "payments"
```

Create a type-safe function:

```typescript
function isFeatureEnabled(
    feature: FeatureName
): boolean {

    return config.features[feature];
}
```

Usage:

```typescript
isFeatureEnabled("authentication");

isFeatureEnabled("payments");
```

Invalid:

```typescript
isFeatureEnabled("analytics");
```

---

# 28. Project 2: Type-Safe Object Property Updater

Create a reusable function that updates an object property while preserving its type.

```typescript
function updateObject<
    T,
    K extends keyof T
>(
    object: T,
    key: K,
    value: T[K]
): T {

    return {
        ...object,
        [key]: value
    };
}
```

Usage:

```typescript
const user = {
    id: 1,
    name: "John",
    age: 25,
    active: true
};

const updatedUser = updateObject(
    user,
    "name",
    "David"
);
```

Invalid:

```typescript
updateObject(
    user,
    "age",
    "Twenty Five"
);
```

This function guarantees that the supplied value matches the selected property type.

---

# 29. Project 3: Deep Partial Utility

Create a utility type that makes all nested properties optional.

```typescript
type DeepPartial<T> = {

    [K in keyof T]?:
        T[K] extends object
            ? DeepPartial<T[K]>
            : T[K];

};
```

Usage:

```typescript
interface User {
    id: number;

    name: string;

    address: {
        city: string;
        country: string;
    };
}
```

```typescript
type PartialUser = DeepPartial<User>;
```

Now:

```typescript
const user: PartialUser = {

    address: {
        city: "Ahmedabad"
    }
};
```

### Production improvement

This simplified version also recursively transforms arrays, dates, maps, and other objects.

For production use, special handling may be required.

---

# 30. Project 4: Type-Safe API Method Builder

Create a generic API response structure.

```typescript
type HttpMethod =
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE";
```

```typescript
interface ApiRequest<
    TBody = undefined,
    TResponse = unknown
> {

    method: HttpMethod;

    url: string;

    body?: TBody;

    response?: TResponse;
}
```

Create a generic API client:

```typescript
async function apiRequest<
    TResponse,
    TBody = undefined
>(
    request: ApiRequest<TBody, TResponse>
): Promise<TResponse> {

    const response = await fetch(request.url, {
        method: request.method,

        headers: {
            "Content-Type": "application/json"
        },

        body: request.body === undefined
            ? undefined
            : JSON.stringify(request.body)
    });

    if (!response.ok) {
        throw new Error("API request failed");
    }

    return response.json() as Promise<TResponse>;
}
```

Usage:

```typescript
interface User {
    id: number;
    name: string;
}
```

```typescript
const user = await apiRequest<User>({
    method: "GET",
    url: "/api/users/1"
});
```

The result is inferred as:

```typescript
User
```

**Important:** The assertion on `response.json()` does not validate the actual server response. Runtime validation is still required when the response is untrusted.

---

# 31. Important TypeScript Concepts Comparison

| Concept | Purpose |
|---|---|
| Generics | Reusable type-safe components |
| Generic Constraints | Restrict allowed generic types |
| Conditional Types | Select types based on conditions |
| Distributive Conditional Types | Apply conditional logic to union members |
| `infer` | Extract types from structures |
| Mapped Types | Transform object types |
| Key Remapping | Rename or filter mapped properties |
| Template Literal Types | Construct string literal types |
| Recursive Types | Represent nested structures |
| Variadic Tuples | Work with flexible tuple sequences |
| `keyof` | Extract object keys |
| `typeof` | Obtain the type of a value |
| Indexed Access | Extract a property type |
| Type Predicates | Narrow types through boolean checks |
| Assertion Functions | Establish conditions through assertions |
| Branded Types | Distinguish logically different values |
| Nominal Typing Techniques | Simulate identity-based type compatibility |
| Type-Level Programming | Compute and transform types at compile time |
| Discriminated Unions | Narrow object unions using literal properties |

---

# 32. Common Mistakes to Avoid

### 1. Using `any` Everywhere

Avoid:

```typescript
function process(data: any): any {
    return data;
}
```

Prefer generics or `unknown` when appropriate.

### 2. Overusing Type Assertions

Avoid:

```typescript
const user = data as User;
```

A type assertion does not validate the actual data.

### 3. Confusing Runtime and Compile-Time

Type aliases, interfaces, mapped types, and conditional types do not exist as runtime JavaScript structures.

### 4. Writing Extremely Complex Generic Types

Complex type-level logic can become difficult to debug.

Prefer readable, reusable types.

### 5. Ignoring `never`

The `never` type is extremely useful for exhaustive checking and filtering union members.

### 6. Using Recursive Types Without Considering Depth

Deep recursive types can cause compiler performance problems.

### 7. Forgetting Union Distribution

A conditional type using a naked type parameter may distribute over unions.

Use `[T] extends [U]` when you want to prevent distribution.

### 8. Confusing `typeof` and JavaScript Runtime `typeof`

JavaScript:

```javascript
typeof "Hello";
```

Returns:

```text
string
```

TypeScript type position:

```typescript
const name = "John";

type Name = typeof name;
```

Produces a type representing the inferred type of the variable.

### 9. Using Branded Types as Runtime Security

Branded types provide compile-time distinctions, not runtime security or validation.

### 10. Assuming TypeScript Types Validate API Data

Always validate untrusted external data at runtime.

---

# 33. Interview Questions and Answers

### Q1. What are Generics in TypeScript?

Generics allow reusable components to work with multiple data types while maintaining type safety.

### Q2. What is a Generic Constraint?

A restriction on the types that can be supplied to a generic parameter.

### Q3. What does `extends` mean in Generics?

It restricts a generic type parameter to types compatible with a specified constraint.

### Q4. What are Generic Default Types?

They provide default types when callers do not specify generic arguments.

### Q5. What is Type Inference?

TypeScript's ability to determine types automatically from values and context.

### Q6. What are Conditional Types?

Types that select one of two possible types based on a type-level condition.

### Q7. What is the syntax of Conditional Types?

```typescript
T extends U ? X : Y
```

### Q8. What are Distributive Conditional Types?

Conditional types that distribute over union members when the checked type is a naked type parameter.

### Q9. How can you prevent conditional type distribution?

Use square brackets:

```typescript
[T] extends [U] ? X : Y
```

### Q10. What is `infer`?

A keyword used inside conditional types to infer and extract another type.

### Q11. What are Mapped Types?

Types that transform properties of an existing object type.

### Q12. What is Key Remapping?

Changing or filtering property names in mapped types using `as`.

### Q13. What are Template Literal Types?

Types that construct string literal types using template literal syntax.

### Q14. What are Recursive Types?

Types that refer to themselves to represent nested structures.

### Q15. What are Variadic Tuple Types?

Tuple types that support generic sequences of elements using rest elements.

### Q16. What does `keyof` do?

It produces a union of an object's property keys.

### Q17. What does `typeof` do in a type position?

It obtains the type of an existing value.

### Q18. What are Indexed Access Types?

Types that retrieve another type's property type using syntax such as `T[K]`.

### Q19. What is a Type Predicate?

A function return annotation that identifies a value as a particular type when the function returns true.

### Q20. What is an Assertion Function?

A function that uses the `asserts` keyword to establish a condition or type after successful execution.

### Q21. What is a Branded Type?

A technique that distinguishes logically different values using additional compile-time type information.

### Q22. What is Structural Typing?

A type compatibility system based primarily on the structure of types.

### Q23. Does TypeScript support nominal typing?

Not as its general type compatibility model, but nominal-like behavior can be simulated using brands, unique symbols, and private class members.

### Q24. What is Type-Level Programming?

Using TypeScript's type system to perform compile-time type transformations and computations.

### Q25. What is the difference between `unknown` and `any`?

`any` largely disables type checking, while `unknown` requires type narrowing before using a value.

### Q26. What is the `never` type?

A type representing values that cannot occur. It is useful for impossible states, exhaustive checking, and filtering unions.

### Q27. What is `as const`?

A const assertion that preserves literal types and makes object properties and arrays readonly at the type level.

### Q28. What is the difference between `Partial<T>` and `Required<T>`?

`Partial<T>` makes properties optional, whereas `Required<T>` removes optional modifiers.

### Q29. What does `ReturnType<T>` do?

It extracts the return type of a function type.

### Q30. What does `Awaited<T>` do?

It recursively extracts the resolved value type of a Promise-like type.

### Q31. What is a Discriminated Union?

A union of object types sharing a common property with different literal values.

### Q32. Why are Type Predicates useful?

They allow custom runtime checks to narrow TypeScript types.

### Q33. Do TypeScript types exist at runtime?

No. Most TypeScript-only type constructs are erased during compilation.

### Q34. What is the difference between `as` and `satisfies`?

- `as` asserts that a value should be treated as a particular type.
- `satisfies` checks that a value conforms to a type while generally preserving its more specific inferred type.

Example:

```typescript
type Config = {
    port: number;
};

const config = {
    port: 3000
} satisfies Config;
```

### Q35. What is the difference between a tuple and an array?

An array generally contains zero or more elements of a specified element type. A tuple represents a sequence with known positional types.

---

# 34. Practical Exercises

Complete these exercises before moving to the next phase.

| No. | Exercise | Concepts |
|---|---|---|
| 1 | Create a generic function that accepts any type | Generics |
| 2 | Create a generic function restricted to objects with an ID | Constraints |
| 3 | Create a generic API response type | Generic Defaults |
| 4 | Create a conditional type that identifies strings | Conditional Types |
| 5 | Create a type that extracts string members from a union | Distribution |
| 6 | Create a utility that extracts function return types | `infer` |
| 7 | Create a utility that extracts array element types | `infer` |
| 8 | Create a DeepReadonly utility | Mapped and Recursive Types |
| 9 | Create a DeepPartial utility | Recursive Types |
| 10 | Create a utility that removes selected properties | Key Remapping |
| 11 | Create a utility that converts property names to getters | Template Literal Types |
| 12 | Create a nested JSON type | Recursive Types |
| 13 | Create a tuple concatenation function | Variadic Tuples |
| 14 | Create a type-safe object updater | `keyof` and Indexed Access |
| 15 | Create a branded UserId and ProductId | Branded Types |
| 16 | Create a custom type guard for API responses | Type Predicates |
| 17 | Create an assertion function for validated input | Assertion Functions |
| 18 | Create a type-safe event emitter | Advanced Generics |
| 19 | Create a type-safe configuration system | `typeof` and `keyof` |
| 20 | Build a generic API client | Advanced Type System |

---

# 35. Phase 40 Completion Checklist

### Advanced Generics
- [ ] Generic Constraints
- [ ] Multiple Generic Parameters
- [ ] Generic Default Types
- [ ] Generic Type Inference

### Conditional Types
- [ ] Conditional Types
- [ ] Nested Conditional Types
- [ ] Distributive Conditional Types
- [ ] Preventing Distribution
- [ ] `infer` Keyword

### Mapped Types
- [ ] Mapped Types
- [ ] Optional Modifiers
- [ ] Readonly Modifiers
- [ ] Removing Modifiers
- [ ] Key Remapping

### Advanced Types
- [ ] Template Literal Types
- [ ] Recursive Types
- [ ] Variadic Tuple Types
- [ ] Advanced `keyof`
- [ ] Advanced `typeof`
- [ ] Indexed Access Types

### Type Safety
- [ ] Type Predicates
- [ ] Assertion Functions
- [ ] Branded Types
- [ ] Nominal Typing Techniques
- [ ] Discriminated Unions
- [ ] Exhaustive Checking

### Advanced Type-Level Programming
- [ ] Utility Type Internals
- [ ] Type-Level Filtering
- [ ] Type-Level Object Transformation
- [ ] Type-Safe API Design
- [ ] Type-Safe Event Systems
- [ ] Advanced Generic Functions

---

# Next Phase

## Phase 41: Advanced TypeScript – Modules, Namespaces, Declaration Files and Compiler Internals

In the next phase, we will explore how TypeScript works internally and how to organize large TypeScript codebases.

Topics:

1. TypeScript Modules.
2. ES Modules.
3. CommonJS Modules.
4. Module Resolution.
5. Module Augmentation.
6. Declaration Files (`.d.ts`).
7. Ambient Declarations.
8. Global Declarations.
9. Namespace Fundamentals.
10. Namespace vs Module.
11. Declaration Merging.
12. Interface Merging.
13. Function Overload Merging.
14. Global Type Augmentation.
15. Third-Party Library Typings.
16. Writing Custom Type Definitions.
17. TypeScript Compiler Architecture.
18. TypeScript Compiler API Fundamentals.
19. `tsconfig.json` Advanced Configuration.
20. Strict Compiler Options.
21. Path Mapping and Aliases.
22. Project References.
23. Monorepo TypeScript Configuration.
24. Build Performance Optimization.
25. TypeScript Package Development.
26. Publishing TypeScript Libraries to npm.
27. Real-World Module Architecture.

**Phase 40 is complete.**

When you're ready, say **OK, Phase 41** to continue.