# Phase 33: Advanced TypeScript – Type-Level Programming, Conditional Types, Mapped Types, Template Literal Types, and Recursive Types

**Level:** Expert  
**Prerequisites:** TypeScript fundamentals, interfaces, type aliases, generics, union types, intersection types, utility types, and functional programming.

---

# 1. Learning Objectives

By the end of this phase, you will understand:

1. What is Type-Level Programming?
2. Type System vs Runtime System.
3. `keyof` Operator.
4. `typeof` Operator in TypeScript.
5. Indexed Access Types.
6. Conditional Types.
7. `infer` Keyword.
8. Mapped Types.
9. Key Remapping with `as`.
10. Template Literal Types.
11. Recursive Types.
12. Distributive Conditional Types.
13. Utility Types Internals.
14. Building Custom Utility Types.
15. Advanced Generic Constraints.
16. Type-Level Function Patterns.
17. Practical Advanced TypeScript Examples.

---

# 2. What Is Type-Level Programming?

Type-Level Programming means writing TypeScript code that operates on types instead of runtime values.

Normally, when writing JavaScript or TypeScript, we work with values.

For example:

```typescript
const name: string = "Riyaz";

const age: number = 25;

function add(a: number, b: number): number {
    return a + b;
}
```

Here, we are working with runtime values.

However, TypeScript also allows us to write logic that transforms and manipulates types.

### Example: Normal Programming

```typescript
function getValue(value: string | number) {
    if (typeof value === "string") {
        return value.toUpperCase();
    }

    return value * 2;
}
```

This logic executes at runtime.

### Example: Type-Level Programming

```typescript
type IsString<T> = T extends string ? true : false;

type Result1 = IsString<string>;
// true

type Result2 = IsString<number>;
// false
```

Here:

- `IsString<T>` is a generic type.
- `T extends string` is a conditional type.
- `true` and `false` are types.

TypeScript evaluates this expression during type checking.

There is no JavaScript function execution involved.

### Important Difference

| Normal Programming | Type-Level Programming |
|---|---|
| Works with runtime values | Works with types |
| Executes at runtime | Evaluated during type checking |
| Uses variables and functions | Uses type aliases and type operators |
| Produces runtime results | Produces types |
| JavaScript can execute it | TypeScript compiler evaluates it |

**Important:** Type-level programming does not generate runtime functionality by itself. TypeScript types are erased during compilation.

---

# 3. Type System vs Runtime System

JavaScript has a runtime system that executes actual application code.

TypeScript adds a static type system that checks your code before execution.

Consider:

```typescript
type User = {
    id: number;
    name: string;
};

const user: User = {
    id: 1,
    name: "Riyaz"
};
```

At compile time, TypeScript checks whether the object matches the `User` type.

But the `User` type does not exist in the generated JavaScript.

Conceptually, the JavaScript output is:

```javascript
const user = {
    id: 1,
    name: "Riyaz"
};
```

### Another Example

```typescript
type ID = string | number;

function getUser(id: ID): void {
    console.log(id);
}
```

The type `ID` is removed during compilation.

### Why Is This Important?

Type-level programming can:

- Detect incorrect types.
- Infer return types.
- Transform existing types.
- Restrict function arguments.
- Generate reusable type definitions.
- Improve API type safety.
- Create complex reusable abstractions.

It cannot validate external runtime data by itself.

For runtime validation, use actual JavaScript logic or a validation library such as Zod.

---

# 4. keyof Operator

The `keyof` operator creates a union of the property keys of an object type.

### Example

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

This means `UserKeys` can only contain one of these property names.

### Practical Example

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};

function getProperty<T, K extends keyof T>(
    object: T,
    key: K
): T[K] {
    return object[key];
}
```

Usage:

```typescript
const user: User = {
    id: 1,
    name: "Riyaz",
    email: "riyaz@example.com"
};

const name = getProperty(user, "name");

const email = getProperty(user, "email");

const id = getProperty(user, "id");
```

TypeScript automatically infers:

```typescript
// name: string
// email: string
// id: number
```

This is useful because the key and returned value remain connected.

### Invalid Property

```typescript
getProperty(user, "age");
```

TypeScript reports an error because `"age"` is not a key of `User`.

### keyof with Index Signatures

```typescript
type Dictionary = {
    [key: string]: string;
};

type DictionaryKeys = keyof Dictionary;
```

The resulting type is:

```typescript
type DictionaryKeys = string | number;
```

Why does it include `number`?

Because JavaScript object property keys can be accessed using numeric values, which are converted to strings in ordinary object property access.

---

# 5. typeof Operator in TypeScript

JavaScript has a runtime `typeof` operator.

TypeScript also supports using `typeof` in type positions to extract the type of an existing variable or value.

### Runtime typeof

```typescript
const name = "Riyaz";

console.log(typeof name);
// string
```

This executes at runtime.

### Type-Level typeof

```typescript
const user = {
    id: 1,
    name: "Riyaz",
    active: true
};

type User = typeof user;
```

TypeScript infers:

```typescript
type User = {
    id: number;
    name: string;
    active: boolean;
};
```

### Practical Example

Suppose you have a configuration object:

```typescript
const config = {
    apiUrl: "https://example.com",
    timeout: 5000,
    retries: 3
};
```

Instead of manually writing its type:

```typescript
type Config = {
    apiUrl: string;
    timeout: number;
    retries: number;
};
```

You can derive it:

```typescript
type Config = typeof config;
```

### typeof with as const

```typescript
const config = {
    apiUrl: "https://example.com",
    environment: "production"
} as const;

type Config = typeof config;
```

Result:

```typescript
type Config = {
    readonly apiUrl: "https://example.com";
    readonly environment: "production";
};
```

Notice that `as const` preserves literal values and readonly properties.

### typeof with Functions

```typescript
function add(a: number, b: number): number {
    return a + b;
}

type AddFunction = typeof add;
```

Result:

```typescript
type AddFunction = (
    a: number,
    b: number
) => number;
```

---

# 6. Indexed Access Types

Indexed Access Types allow you to access a particular property type from another type.

The syntax is:

```typescript
type Result = SomeType["property"];
```

### Example

```typescript
type User = {
    id: number;
    name: string;
    age: number;
};
```

Extract the type of `name`:

```typescript
type UserName = User["name"];
```

Result:

```typescript
type UserName = string;
```

Extract multiple property types:

```typescript
type UserInfo = User["name" | "age"];
```

Result:

```typescript
type UserInfo = string | number;
```

### Extract All Property Values

```typescript
type UserValues = User[keyof User];
```

Result:

```typescript
type UserValues = number | string;
```

Because:

```typescript
keyof User
```

produces:

```typescript
"id" | "name" | "age"
```

And:

```typescript
User["id" | "name" | "age"]
```

produces:

```typescript
number | string
```

### Practical Example

```typescript
type Product = {
    id: number;
    name: string;
    price: number;
    category: string;
};

type ProductPrice = Product["price"];
// number

type ProductName = Product["name"];
// string
```

### Indexed Access with Arrays

```typescript
const users = [
    {
        id: 1,
        name: "Riyaz"
    },
    {
        id: 2,
        name: "Ahmed"
    }
];

type User = typeof users[number];
```

Result:

```typescript
type User = {
    id: number;
    name: string;
};
```

Why `[number]`?

Because it extracts the type of an element at any numeric index.

This is a common TypeScript technique for deriving array element types.

---

# 7. Conditional Types

Conditional Types allow TypeScript to select a type based on a condition.

The syntax is:

```typescript
type Result = Condition extends Type
    ? TrueType
    : FalseType;
```

This is similar to the ternary operator in JavaScript.

### JavaScript Ternary

```javascript
const result = age >= 18 ? "Adult" : "Minor";
```

### TypeScript Conditional Type

```typescript
type IsString<T> =
    T extends string
        ? true
        : false;
```

Usage:

```typescript
type A = IsString<string>;
// true

type B = IsString<number>;
// false
```

### Example 2: Check Whether a Type Is a Number

```typescript
type IsNumber<T> =
    T extends number
        ? "Yes"
        : "No";
```

Usage:

```typescript
type Result1 = IsNumber<100>;
// "Yes"

type Result2 = IsNumber<string>;
// "No"
```

### Example 3: Extract Array Element Type

```typescript
type ElementType<T> =
    T extends (infer U)[]
        ? U
        : T;
```

Usage:

```typescript
type A = ElementType<string[]>;
// string

type B = ElementType<number[]>;
// number

type C = ElementType<boolean>;
// boolean
```

We will understand `infer` shortly.

### Practical Example: Return Type Based on Input

```typescript
type ResponseType<T> =
    T extends string
        ? string[]
        : number[];

type A = ResponseType<string>;
// string[]

type B = ResponseType<number>;
// number[]
```

---

# 8. infer Keyword

The `infer` keyword allows TypeScript to infer and capture a type inside a conditional type.

It is particularly useful when extracting types from complex structures.

### Example 1: Extract Function Return Type

```typescript
type GetReturnType<T> =
    T extends (...args: any[]) => infer R
        ? R
        : never;
```

Let's understand this:

```typescript
T extends (...args: any[]) => infer R
```

This checks whether `T` is a function.

If it is, TypeScript infers the function's return type and stores it in `R`.

### Usage

```typescript
function add(a: number, b: number): number {
    return a + b;
}

function greet(name: string): string {
    return `Hello ${name}`;
}

type AddReturn = GetReturnType<typeof add>;
// number

type GreetReturn = GetReturnType<typeof greet>;
// string
```

### Example 2: Extract Promise Value

```typescript
type UnwrapPromise<T> =
    T extends Promise<infer U>
        ? U
        : T;
```

Usage:

```typescript
type A = UnwrapPromise<Promise<string>>;
// string

type B = UnwrapPromise<Promise<number>>;
// number

type C = UnwrapPromise<boolean>;
// boolean
```

### Example 3: Extract Array Element Type

```typescript
type GetElement<T> =
    T extends readonly (infer U)[]
        ? U
        : never;
```

Usage:

```typescript
type A = GetElement<string[]>;
// string

type B = GetElement<readonly number[]>;
// number
```

### Example 4: Extract Function Parameters

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

type ParametersOfCreateUser =
    GetParameters<typeof createUser>;
```

Result:

```typescript
type ParametersOfCreateUser = [
    name: string,
    age: number
];
```

### Important

TypeScript already provides utility types for many of these operations:

```typescript
ReturnType<typeof add>;

Parameters<typeof createUser>;

Awaited<Promise<string>>;
```

Learning `infer` helps you understand how such utility types can be implemented.

---

# 9. Mapped Types

Mapped Types allow you to create a new type by iterating over the properties of an existing type.

Think of them as type-level transformations.

### Example

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};
```

Suppose we want every property to become optional.

We could manually write:

```typescript
type OptionalUser = {
    id?: number;
    name?: string;
    email?: string;
};
```

But this becomes difficult for large types.

Instead, use a mapped type:

```typescript
type MyPartial<T> = {
    [K in keyof T]?: T[K];
};
```

Usage:

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};

type OptionalUser = MyPartial<User>;
```

Result:

```typescript
type OptionalUser = {
    id?: number;
    name?: string;
    email?: string;
};
```

### Understanding the Syntax

```typescript
[K in keyof T]?: T[K];
```

Breakdown:

| Syntax | Meaning |
|---|---|
| `keyof T` | Gets all property keys of T |
| `K in` | Iterates over those keys |
| `?` | Makes each property optional |
| `T[K]` | Gets the original property's type |

### Example 2: Make All Properties Readonly

```typescript
type MyReadonly<T> = {
    readonly [K in keyof T]: T[K];
};
```

Usage:

```typescript
type User = {
    id: number;
    name: string;
};

type ReadonlyUser = MyReadonly<User>;
```

Result:

```typescript
type ReadonlyUser = {
    readonly id: number;
    readonly name: string;
};
```

### Example 3: Convert All Properties to Boolean

```typescript
type BooleanProperties<T> = {
    [K in keyof T]: boolean;
};
```

Usage:

```typescript
type User = {
    id: number;
    name: string;
    active: string;
};

type UserFlags = BooleanProperties<User>;
```

Result:

```typescript
type UserFlags = {
    id: boolean;
    name: boolean;
    active: boolean;
};
```

### Example 4: Convert Every Property to an Array

```typescript
type ArrayProperties<T> = {
    [K in keyof T]: T[K][];
};
```

Usage:

```typescript
type User = {
    id: number;
    name: string;
};

type UserArrays = ArrayProperties<User>;
```

Result:

```typescript
type UserArrays = {
    id: number[];
    name: string[];
};
```

---

# 10. Mapping Modifiers

Mapped Types support modifiers that can add or remove property characteristics.

Two important modifiers are:

- `?` for optional properties.
- `readonly` for readonly properties.

You can also remove these modifiers using `-`.

### Remove Optional Modifier

```typescript
type RequiredProperties<T> = {
    [K in keyof T]-?: T[K];
};
```

### Remove Readonly Modifier

```typescript
type Mutable<T> = {
    -readonly [K in keyof T]: T[K];
};
```

### Add Readonly

```typescript
type ReadonlyProperties<T> = {
    readonly [K in keyof T]: T[K];
};
```

### Add Optional

```typescript
type OptionalProperties<T> = {
    [K in keyof T]?: T[K];
};
```

### Comparison

| Modifier | Meaning |
|---|---|
| `?` | Add optional |
| `-?` | Remove optional |
| `readonly` | Add readonly |
| `-readonly` | Remove readonly |

---

# 11. Key Remapping with as

Key Remapping allows you to change property names while creating mapped types.

It uses the `as` keyword.

### Example

```typescript
type User = {
    name: string;
    age: number;
};
```

Suppose we want to prefix every property with `get`.

Expected result:

```typescript
type UserGetters = {
    getName: string;
    getAge: number;
};
```

Implementation:

```typescript
type AddGetPrefix<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: T[K];
};
```

Usage:

```typescript
type User = {
    name: string;
    age: number;
};

type UserGetters = AddGetPrefix<User>;
```

Result:

```typescript
type UserGetters = {
    getName: string;
    getAge: number;
};
```

### Understanding the Syntax

```typescript
[K in keyof T as `get${Capitalize<string & K>}`]
```

- `keyof T`: Gets the original keys.
- `K in`: Iterates over them.
- `as`: Transforms the key.
- `Capitalize`: Capitalizes the first character.
- `string & K`: Ensures the key can be used as a string.

### Example 2: Remove a Property

You can also filter keys by remapping them to `never`.

```typescript
type RemoveProperty<T, Property> = {
    [K in keyof T as
        K extends Property ? never : K
    ]: T[K];
};
```

Usage:

```typescript
type User = {
    id: number;
    name: string;
    password: string;
};

type PublicUser = RemoveProperty<User, "password">;
```

Result:

```typescript
type PublicUser = {
    id: number;
    name: string;
};
```

This is useful when creating public API response types.

---

# 12. Template Literal Types

Template Literal Types allow you to create new string types using template literal syntax.

They work similarly to JavaScript template literals, but at the type level.

### Example

```typescript
type Greeting = `Hello ${string}`;
```

Valid values:

```typescript
const a: Greeting = "Hello Riyaz";

const b: Greeting = "Hello Ahmed";
```

Invalid:

```typescript
const c: Greeting = "Hi Riyaz";
// TypeScript error
```

### Example 2: Create Specific String Values

```typescript
type Direction = "left" | "right";

type Position = `move-${Direction}`;
```

Result:

```typescript
type Position = "move-left" | "move-right";
```

### Example 3: Generate API Routes

```typescript
type Resource = "users" | "products" | "orders";

type ApiRoute = `/api/${Resource}`;
```

Result:

```typescript
type ApiRoute =
    | "/api/users"
    | "/api/products"
    | "/api/orders";
```

### Example 4: Generate Event Names

```typescript
type Events = "click" | "submit" | "change";

type EventHandler = `on${Capitalize<Events>}`;
```

Result:

```typescript
type EventHandler =
    | "onClick"
    | "onSubmit"
    | "onChange";
```

### Example 5: Generate CSS Property Names

```typescript
type CSSProperty =
    | "color"
    | "background"
    | "border";

type CSSVariable = `--${CSSProperty}`;
```

Result:

```typescript
type CSSVariable =
    | "--color"
    | "--background"
    | "--border";
```

---

# 13. Built-in String Utility Types

TypeScript provides several utility types for transforming string literal types.

| Utility Type | Purpose |
|---|---|
| `Uppercase<T>` | Converts string type to uppercase |
| `Lowercase<T>` | Converts string type to lowercase |
| `Capitalize<T>` | Capitalizes the first character |
| `Uncapitalize<T>` | Lowercases the first character |

### Examples

```typescript
type A = Uppercase<"hello">;
// "HELLO"

type B = Lowercase<"HELLO">;
// "hello"

type C = Capitalize<"hello">;
// "Hello"

type D = Uncapitalize<"Hello">;
// "hello"
```

### Practical Example

```typescript
type UserEvents = "create" | "update" | "delete";

type EventNames = `on${Capitalize<UserEvents>}`;
```

Result:

```typescript
type EventNames =
    | "onCreate"
    | "onUpdate"
    | "onDelete";
```

---

# 14. Recursive Types

A Recursive Type is a type that references itself.

Recursive types are useful for representing hierarchical or nested structures.

### Example 1: Nested Comments

```typescript
type Comment = {
    id: number;
    message: string;
    replies: Comment[];
};
```

A comment can contain multiple replies, and each reply can contain more replies.

This is recursive because `Comment` references itself.

### Example 2: Nested Categories

```typescript
type Category = {
    id: number;
    name: string;
    children: Category[];
};
```

Example data:

```typescript
const categories: Category[] = [
    {
        id: 1,
        name: "Electronics",
        children: [
            {
                id: 2,
                name: "Computers",
                children: [
                    {
                        id: 3,
                        name: "Laptops",
                        children: []
                    }
                ]
            }
        ]
    }
];
```

### Example 3: JSON Value Type

A JSON value can be:

- A string.
- A number.
- A boolean.
- Null.
- An array of JSON values.
- An object containing JSON values.

We can represent this recursively:

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

This is a recursive type.

### Example 4: DeepReadonly

Let's create a type that makes nested properties readonly.

```typescript
type DeepReadonly<T> =
    T extends (...args: any[]) => any
        ? T
        : T extends readonly unknown[]
            ? {
                readonly [K in keyof T]: DeepReadonly<T[K]>
            }
            : T extends object
                ? {
                    readonly [K in keyof T]: DeepReadonly<T[K]>
                }
                : T;
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

Result conceptually:

```typescript
type ReadonlyUser = {
    readonly name: string;

    readonly address: {
        readonly city: string;
        readonly country: string;
    };
};
```

This is a compile-time type transformation. It does not freeze the runtime object.

---

# 15. Distributive Conditional Types

Distributive Conditional Types are conditional types that distribute over union members.

This happens when the checked type is a naked type parameter.

### Example

```typescript
type ToArray<T> =
    T extends any
        ? T[]
        : never;
```

Usage:

```typescript
type Result = ToArray<string | number>;
```

Result:

```typescript
type Result = string[] | number[];
```

Why?

TypeScript distributes the conditional type over each union member.

Conceptually:

```typescript
ToArray<string | number>
```

becomes:

```typescript
ToArray<string> | ToArray<number>
```

Which becomes:

```typescript
string[] | number[]
```

### Another Example

```typescript
type RemoveNull<T> =
    T extends null | undefined
        ? never
        : T;
```

Usage:

```typescript
type Result = RemoveNull<
    string | number | null | undefined
>;
```

Result:

```typescript
type Result = string | number;
```

This works because the conditional type distributes across the union.

### How to Disable Distribution

Wrap the checked type in a tuple.

```typescript
type IsEntirelyString<T> =
    [T] extends [string]
        ? true
        : false;
```

Usage:

```typescript
type A = IsEntirelyString<string>;
// true

type B = IsEntirelyString<string | number>;
// false
```

Compare with:

```typescript
type IsString<T> =
    T extends string
        ? true
        : false;
```

For:

```typescript
type Result = IsString<string | number>;
```

The result is:

```typescript
type Result = true | false;
```

Because the conditional distributes over the union.

### Important Difference

| Syntax | Behavior |
|---|---|
| `T extends U ? X : Y` | Can distribute over unions |
| `[T] extends [U] ? X : Y` | Checks the union as a whole |

---

# 16. Advanced Generic Constraints

Generic Constraints restrict which types can be passed to a generic type or function.

### Example 1: Basic Constraint

```typescript
function getLength<T extends { length: number }>(
    value: T
): number {
    return value.length;
}
```

Usage:

```typescript
getLength("Hello"); 
getLength([1, 2, 3]);
```

Both work because strings and arrays have a `length` property.

But:

```typescript
getLength(100);
```

Produces a TypeScript error.

### Example 2: Restrict to Specific Types

```typescript
function printValue<T extends string | number>(
    value: T
): void {
    console.log(value);
}
```

Allowed:

```typescript
printValue("Hello");
printValue(100);
```

Not allowed:

```typescript
printValue(true);
```

### Example 3: Generic Constraint with keyof

```typescript
function getProperty<T, K extends keyof T>(
    object: T,
    key: K
): T[K] {
    return object[key];
}
```

This guarantees that only valid keys can be accessed.

### Example 4: Multiple Constraints

```typescript
type Entity = {
    id: number;
};

function updateEntity<
    T extends Entity & { name: string }
>(entity: T): T {
    return entity;
}
```

Here, `T` must contain both:

- `id: number`.
- `name: string`.

---

# 17. Utility Types Internals

TypeScript provides many built-in utility types.

Some are implemented using mapped types, conditional types, and other type-system features.

Let's understand how some of them work.

## 17.1 Partial<T>

Makes all properties optional.

```typescript
type MyPartial<T> = {
    [K in keyof T]?: T[K];
};
```

Usage:

```typescript
type User = {
    id: number;
    name: string;
};

type PartialUser = Partial<User>;
```

## 17.2 Required<T>

Makes all properties required.

```typescript
type MyRequired<T> = {
    [K in keyof T]-?: T[K];
};
```

## 17.3 Readonly<T>

Makes all properties readonly.

```typescript
type MyReadonly<T> = {
    readonly [K in keyof T]: T[K];
};
```

## 17.4 Pick<T, K>

Selects specific properties.

```typescript
type MyPick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

Usage:

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};

type UserPreview = Pick<User, "id" | "name">;
```

Result:

```typescript
type UserPreview = {
    id: number;
    name: string;
};
```

## 17.5 Omit<T, K>

Removes selected properties.

```typescript
type MyOmit<T, K extends keyof any> =
    Pick<T, Exclude<keyof T, K>>;
```

Usage:

```typescript
type User = {
    id: number;
    name: string;
    password: string;
};

type PublicUser = Omit<User, "password">;
```

## 17.6 Exclude<T, U>

Removes types assignable to `U` from a union.

```typescript
type MyExclude<T, U> =
    T extends U ? never : T;
```

Usage:

```typescript
type Result = Exclude<
    string | number | boolean,
    string
>;
```

Result:

```typescript
type Result = number | boolean;
```

## 17.7 Extract<T, U>

Extracts types assignable to `U`.

```typescript
type MyExtract<T, U> =
    T extends U ? T : never;
```

Usage:

```typescript
type Result = Extract<
    string | number | boolean,
    string | number
>;
```

Result:

```typescript
type Result = string | number;
```

## 17.8 NonNullable<T>

Removes `null` and `undefined`.

```typescript
type MyNonNullable<T> =
    T & {};
```

Usage:

```typescript
type Result = NonNullable<
    string | number | null | undefined
>;
```

Result:

```typescript
type Result = string | number;
```

The built-in `NonNullable` is implemented by TypeScript using its own utility-type definition. The simplified expression above illustrates one way to understand its behavior in modern TypeScript.

## 17.9 Record<K, T>

Creates an object type with keys `K` and values `T`.

Conceptually:

```typescript
type MyRecord<K extends keyof any, T> = {
    [P in K]: T;
};
```

Usage:

```typescript
type UserRoles = Record<
    "admin" | "editor" | "user",
    boolean
>;
```

Result:

```typescript
type UserRoles = {
    admin: boolean;
    editor: boolean;
    user: boolean;
};
```

## 17.10 ReturnType<T>

Extracts the return type of a function.

```typescript
type MyReturnType<T> =
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

type User = ReturnType<typeof getUser>;
```

## Utility Types Summary

| Utility Type | Purpose |
|---|---|
| `Partial<T>` | Makes all properties optional |
| `Required<T>` | Makes all properties required |
| `Readonly<T>` | Makes all properties readonly |
| `Pick<T, K>` | Selects specific properties |
| `Omit<T, K>` | Removes specific properties |
| `Exclude<T, U>` | Removes matching union members |
| `Extract<T, U>` | Extracts matching union members |
| `NonNullable<T>` | Removes null and undefined |
| `Record<K, T>` | Creates an object type |
| `ReturnType<T>` | Extracts function return type |
| `Parameters<T>` | Extracts function parameter types |
| `Awaited<T>` | Recursively unwraps Promise-like types |

---

# 18. Building Custom Utility Types

Now let's create some practical custom utility types.

## 18.1 Create a Nullable Type

```typescript
type Nullable<T> = T | null;
```

Usage:

```typescript
type UserName = Nullable<string>;
```

Result:

```typescript
type UserName = string | null;
```

## 18.2 Create a Deep Partial Type

```typescript
type DeepPartial<T> =
    T extends (...args: any[]) => any
        ? T
        : T extends readonly unknown[]
            ? {
                [K in keyof T]?: DeepPartial<T[K]>
            }
            : T extends object
                ? {
                    [K in keyof T]?: DeepPartial<T[K]>
                }
                : T;
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

type PartialUser = DeepPartial<User>;
```

Now even nested properties can be optional.

## 18.3 Create a Mutable Type

```typescript
type Mutable<T> = {
    -readonly [K in keyof T]: T[K];
};
```

Usage:

```typescript
type User = {
    readonly id: number;
    readonly name: string;
};

type MutableUser = Mutable<User>;
```

## 18.4 Create a Function Property Type

```typescript
type FunctionProperties<T> = {
    [K in keyof T as
        T[K] extends (...args: any[]) => any
            ? K
            : never
    ]: T[K];
};
```

Usage:

```typescript
type User = {
    id: number;
    name: string;
    login(): void;
    logout(): void;
};

type UserMethods = FunctionProperties<User>;
```

Result:

```typescript
type UserMethods = {
    login: () => void;
    logout: () => void;
};
```

## 18.5 Create a Non-Function Property Type

```typescript
type NonFunctionProperties<T> = {
    [K in keyof T as
        T[K] extends (...args: any[]) => any
            ? never
            : K
    ]: T[K];
};
```

Usage:

```typescript
type User = {
    id: number;
    name: string;
    login(): void;
};

type UserData = NonFunctionProperties<User>;
```

Result:

```typescript
type UserData = {
    id: number;
    name: string;
};
```

---

# 19. Type-Level Function Patterns

TypeScript allows you to build reusable transformations that behave like functions at the type level.

### Example 1: Convert a Type into an Array

```typescript
type ToArray<T> = T[];
```

Usage:

```typescript
type Numbers = ToArray<number>;
// number[]
```

### Example 2: Extract Promise Data

```typescript
type Unwrap<T> =
    T extends Promise<infer U>
        ? U
        : T;
```

Usage:

```typescript
type Result = Unwrap<Promise<string>>;
// string
```

### Example 3: Create API Response Types

```typescript
type ApiResponse<T> = {
    success: boolean;
    data: T;
    message: string;
};
```

Usage:

```typescript
type User = {
    id: number;
    name: string;
};

type UserResponse = ApiResponse<User>;
```

Result:

```typescript
type UserResponse = {
    success: boolean;
    data: User;
    message: string;
};
```

### Example 4: Extract Array Element Types

```typescript
type ElementOf<T> =
    T extends readonly (infer U)[]
        ? U
        : never;
```

Usage:

```typescript
type Result = ElementOf<readonly string[]>;
// string
```

### Example 5: Create an Event Map

```typescript
type EventMap = {
    userCreated: {
        id: number;
        name: string;
    };

    userDeleted: {
        id: number;
    };

    orderPlaced: {
        orderId: number;
        amount: number;
    };
};
```

Now create a type-safe event emitter interface:

```typescript
type EventEmitter<T> = {
    on<K extends keyof T>(
        event: K,
        callback: (data: T[K]) => void
    ): void;
};
```

This ensures that each event receives the correct payload type.

Example:

```typescript
declare const emitter: EventEmitter<EventMap>;

emitter.on("userCreated", user => {
    console.log(user.id);
    console.log(user.name);
});

emitter.on("orderPlaced", order => {
    console.log(order.orderId);
    console.log(order.amount);
});
```

The compiler understands the correct payload based on the selected event.

---

# 20. Practical Project: Type-Safe API Response System

Let's build a reusable API response type system.

### Step 1: Define API Response

```typescript
type ApiResponse<T> = {
    success: boolean;
    data: T;
    message: string;
};
```

### Step 2: Define User Type

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};
```

### Step 3: Create User Response Type

```typescript
type UserResponse = ApiResponse<User>;
```

### Step 4: Create Users Response Type

```typescript
type UsersResponse = ApiResponse<User[]>;
```

### Step 5: Create Generic API Function

```typescript
async function apiRequest<T>(
    url: string
): Promise<ApiResponse<T>> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("API request failed");
    }

    return response.json() as Promise<ApiResponse<T>>;
}
```

Usage:

```typescript
async function getUsers() {
    const response = await apiRequest<User[]>(
        "/api/users"
    );

    response.data.forEach(user => {
        console.log(user.name);
    });
}
```

### Important Runtime Consideration

This assertion:

```typescript
response.json() as Promise<ApiResponse<T>>
```

does not validate the actual API response.

It only tells TypeScript to treat the value as that type.

If the server returns invalid data, TypeScript will not automatically detect it at runtime.

For external data, use runtime validation.

For example, with Zod:

```typescript
import { z } from "zod";

const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.email()
});

type User = z.infer<typeof UserSchema>;
```

Then:

```typescript
async function getUser(url: string) {
    const response = await fetch(url);

    const data: unknown = await response.json();

    return UserSchema.parse(data);
}
```

This performs actual runtime validation.

---

# 21. Advanced TypeScript Common Mistakes

| Mistake | Correct Understanding |
|---|---|
| Thinking type-level code executes at runtime | Type-level expressions are evaluated by TypeScript's type checker. |
| Confusing runtime `typeof` with type-level `typeof` | They are used in different contexts. |
| Thinking `keyof` returns property values | It returns property keys. |
| Thinking indexed access retrieves runtime data | It extracts a property type. |
| Assuming conditional types always distribute | Distribution requires a naked type parameter on the checked side. |
| Thinking `infer` creates a runtime variable | `infer` captures a type inside a conditional type. |
| Thinking mapped types modify runtime objects | Mapped types only transform types. |
| Thinking `readonly` provides runtime protection | It is a compile-time restriction. |
| Assuming recursive types can recurse infinitely without limits | TypeScript has compiler complexity and recursion limits. |
| Thinking `as` validates data | Type assertions do not perform runtime validation. |
| Overusing advanced utility types | Prefer readable types over unnecessarily complex abstractions. |
| Using `any` everywhere in advanced types | Prefer `unknown` when the type is not yet known. |

---

# 22. Advanced TypeScript Interview Questions

### Q1. What is Type-Level Programming?

It is a technique for creating and transforming types using TypeScript's type system.

### Q2. What is the difference between runtime programming and type-level programming?

Runtime programming executes JavaScript operations on values. Type-level programming manipulates types during compilation and type checking.

### Q3. What does keyof do?

It creates a union of the property keys of an object type.

### Q4. What does typeof do in TypeScript?

In a type position, it extracts the type of an existing variable or value.

### Q5. What are Indexed Access Types?

They allow you to extract property types using syntax such as `User["name"]`.

### Q6. What are Conditional Types?

Types that select a resulting type based on a condition using `extends`, `?`, and `:`.

### Q7. What is infer?

`infer` captures a type inside a conditional type so that it can be reused.

### Q8. What are Mapped Types?

Mapped Types transform properties of an existing type by iterating over its keys.

### Q9. What is Key Remapping?

Key Remapping changes or filters property names in a mapped type using the `as` keyword.

### Q10. What are Template Literal Types?

They allow you to construct string literal types using template literal syntax.

### Q11. What are Recursive Types?

Types that reference themselves, commonly used for nested data structures.

### Q12. What are Distributive Conditional Types?

Conditional types that distribute over union members when the checked type is a naked type parameter.

### Q13. How can you prevent conditional type distribution?

Wrap the checked type in a tuple:

```typescript
[T] extends [U]
```

### Q14. What is the difference between Partial and Required?

`Partial<T>` makes properties optional, while `Required<T>` makes them required.

### Q15. What is the difference between Pick and Omit?

`Pick` selects specified properties. `Omit` removes specified properties.

### Q16. What is the difference between Exclude and Extract?

`Exclude` removes matching union members. `Extract` keeps matching union members.

### Q17. What does Record do?

It creates an object type with a specified set of keys and a common value type.

### Q18. What is ReturnType?

It extracts the return type of a function type.

### Q19. What is Awaited?

It recursively unwraps Promise-like types to obtain the resolved value type.

### Q20. Can TypeScript types validate API responses at runtime?

No. TypeScript types are erased. Runtime validation requires actual runtime code or a validation library.

### Q21. What is DeepReadonly?

It is a custom recursive mapped type that makes nested properties readonly at compile time.

### Q22. What is the difference between readonly and Object.freeze()?

`readonly` is a TypeScript compile-time restriction. `Object.freeze()` applies runtime restrictions to an object.

### Q23. What is the difference between `any` and `unknown`?

`any` disables most type checking for a value. `unknown` requires narrowing or validation before the value can be used safely.

### Q24. What is a naked type parameter?

A naked type parameter is a type parameter used directly on the checked side of a conditional type, such as `T extends U`. This allows distribution over unions.

### Q25. Why should advanced utility types be used carefully?

Highly complex types can become difficult to understand, maintain, and compile. Readability and practical type safety should take priority.

---

# 23. Practical Exercises

Complete these exercises to strengthen your understanding.

## Beginner Level

**Exercise 1: keyof**

Create a `Product` type with:

- `id`
- `name`
- `price`
- `category`

Extract all property keys using `keyof`.

**Exercise 2: typeof**

Create a configuration object and extract its type using `typeof`.

**Exercise 3: Indexed Access Types**

Extract the following types from a `User` type:

- Name type.
- Email type.
- Age type.
- All property value types.

**Exercise 4: Conditional Types**

Create a generic type called `IsArray<T>`.

Expected:

```typescript
type A = IsArray<string[]>;
// true

type B = IsArray<number>;
// false
```

**Exercise 5: infer**

Create a type that extracts the return type of a function.

---

## Intermediate Level

**Exercise 6: Mapped Types**

Implement your own versions of:

- `Partial<T>`.
- `Required<T>`.
- `Readonly<T>`.
- `Mutable<T>`.

**Exercise 7: Key Remapping**

Create a type that adds a `get` prefix to every property name.

**Exercise 8: Template Literal Types**

Create a type for API routes:

```typescript
type Resource = "users" | "products" | "orders";
```

Expected:

```typescript
"/api/users"
"/api/products"
"/api/orders"
```

**Exercise 9: Recursive Types**

Create a recursive `Category` type that supports nested categories.

**Exercise 10: Distributive Conditional Types**

Create a type that removes `null` and `undefined` from a union.

---

## Advanced Level

**Exercise 11: DeepPartial**

Create your own recursive `DeepPartial<T>`.

**Exercise 12: DeepReadonly**

Create a recursive type that makes all nested object properties readonly.

**Exercise 13: Function Properties**

Given an object type, extract only its function properties.

**Exercise 14: Non-Function Properties**

Given an object type, extract only its non-function properties.

**Exercise 15: Type-Safe Event Emitter**

Create a generic event emitter type where each event has a specific payload type.

**Exercise 16: API Response System**

Create generic API response types for:

- Single user.
- Multiple users.
- Single product.
- Multiple products.
- API errors.

**Exercise 17: Custom Utility Types**

Implement your own versions of:

- `Pick<T, K>`.
- `Omit<T, K>`.
- `Exclude<T, U>`.
- `Extract<T, U>`.
- `ReturnType<T>`.
- `Parameters<T>`.

---

# 24. Phase 33 Completion Checklist

| No. | Topic | Status |
|---:|---|---|
| 1 | Type-Level Programming | ☐ |
| 2 | Type System vs Runtime System | ☐ |
| 3 | keyof Operator | ☐ |
| 4 | typeof Operator | ☐ |
| 5 | Indexed Access Types | ☐ |
| 6 | Conditional Types | ☐ |
| 7 | infer Keyword | ☐ |
| 8 | Mapped Types | ☐ |
| 9 | Mapping Modifiers | ☐ |
| 10 | Key Remapping | ☐ |
| 11 | Template Literal Types | ☐ |
| 12 | String Utility Types | ☐ |
| 13 | Recursive Types | ☐ |
| 14 | Distributive Conditional Types | ☐ |
| 15 | Advanced Generic Constraints | ☐ |
| 16 | Utility Types Internals | ☐ |
| 17 | Custom Utility Types | ☐ |
| 18 | Type-Level Function Patterns | ☐ |
| 19 | Type-Safe API Response System | ☐ |
| 20 | Advanced TypeScript Interview Questions | ☐ |

---

# 25. What Comes Next?

## Phase 34: TypeScript Compiler, Configuration, Declaration Files, and Module System

In the next phase, we will study how TypeScript projects are compiled, configured, and integrated with JavaScript libraries.

Topics will include:

1. TypeScript Compiler (`tsc`).
2. TypeScript Compilation Process.
3. `tsconfig.json` in Depth.
4. `target` and `module`.
5. `moduleResolution`.
6. `strict` Mode.
7. `noEmit` and `emitDeclarationOnly`.
8. Source Maps.
9. Declaration Files (`.d.ts`).
10. Ambient Declarations.
11. Global vs Module Scope.
12. Declaration Merging.
13. Module Augmentation.
14. Namespaces.
15. ES Modules vs CommonJS.
16. Type-Only Imports and Exports.
17. Path Aliases.
18. Project References.
19. Monorepo TypeScript Configuration.
20. Building and Publishing TypeScript Libraries.

**Phase 33 is complete.**

When you're ready, say **"OK, Phase 34"** to continue.