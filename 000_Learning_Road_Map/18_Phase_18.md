# Phase 18: Advanced Type Manipulation – Combining Generics, Conditional Types, and Mapped Types

**Level:** Advanced  
**Prerequisites:**
- Phase 14: Generics Fundamentals
- Phase 15: Generic Constraints, `keyof`, and Indexed Access Types
- Phase 16: Conditional Types and `infer`
- Phase 17: Mapped Types and Advanced Object Transformations

## Learning Objectives

By the end of this phase, you will understand:

1. How to combine generics, conditional types, and mapped types.
2. How to filter object properties based on their value types.
3. How to create `PickByType` and `OmitByType`.
4. How to transform properties conditionally.
5. How to create advanced object transformation utilities.
6. How to build recursive mapped types.
7. How to handle arrays, tuples, functions, and special objects in recursive types.
8. How to use advanced `infer` patterns.
9. How to create reusable utility types from scratch.
10. How to apply these concepts in real-world applications.

---

# 1. Understanding Advanced Type Manipulation

In previous phases, you learned three important TypeScript features.

### A. Generics

Generics allow us to create reusable types and functions.

```typescript
type Box<T> = {
    value: T;
};

type StringBox = Box<string>;

type NumberBox = Box<number>;
```

### B. Conditional Types

Conditional types allow us to select types based on conditions.

```typescript
type IsString<T> =
    T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
```

### C. Mapped Types

Mapped types allow us to transform object properties.

```typescript
type ReadonlyObject<T> = {
    readonly [Key in keyof T]: T[Key];
};
```

### Combining all three

The real power of TypeScript's type system comes from combining these features.

Consider:

```typescript
type User = {
    id: number;
    name: string;
    email: string;
    active: boolean;
};
```

Suppose you want to create a new type that:

- Keeps only string properties.
- Makes those properties optional.
- Makes those properties readonly.

You can achieve this with one advanced utility:

```typescript
type StringFields<T> = {
    readonly [Key in keyof T as
        T[Key] extends string ? Key : never
    ]?: T[Key];
};
```

Usage:

```typescript
type Result = StringFields<User>;
```

Result:

```typescript
type Result = {
    readonly name?: string;
    readonly email?: string;
};
```

This single example combines:

| Feature | Usage |
|---|---|
| Generics | `<T>` |
| `keyof` | `keyof T` |
| Indexed access | `T[Key]` |
| Conditional types | `T[Key] extends string ? ... : ...` |
| Key remapping | `as ...` |
| Mapped types | `[Key in keyof T]` |
| Mapping modifiers | `readonly` and `?` |

This is the foundation of advanced TypeScript type programming.

---

# 2. Creating PickByType

Suppose you have an object:

```typescript
type User = {
    id: number;
    name: string;
    email: string;
    age: number;
    active: boolean;
};
```

You want to create a utility that selects properties based on their value types.

For example:

**Pick only string properties.**

Expected:

```typescript
type Result = {
    name: string;
    email: string;
};
```

### Implementation

```typescript
type PickByType<T, ValueType> = {
    [Key in keyof T as
        T[Key] extends ValueType ? Key : never
    ]: T[Key];
};
```

Usage:

```typescript
type StringProperties = PickByType<User, string>;

type NumberProperties = PickByType<User, number>;

type BooleanProperties = PickByType<User, boolean>;
```

Results:

```typescript
type StringProperties = {
    name: string;
    email: string;
};

type NumberProperties = {
    id: number;
    age: number;
};

type BooleanProperties = {
    active: boolean;
};
```

### Understanding the implementation

Let's break it down.

```typescript
[Key in keyof T]
```

Iterates over all properties.

```typescript
T[Key]
```

Extracts the current property's type.

```typescript
T[Key] extends ValueType
```

Checks whether the property type is assignable to `ValueType`.

```typescript
? Key : never
```

Keeps the property key if the condition is true; otherwise, removes it.

### Important clarification: Optional properties

Consider:

```typescript
type User = {
    name: string;
    nickname?: string;
};
```

Now:

```typescript
type Result = PickByType<User, string>;
```

The result contains only:

```typescript
type Result = {
    name: string;
};
```

Why?

When reading an optional property, its type includes `undefined`.

Conceptually:

```typescript
type Nickname = string | undefined;
```

And:

```typescript
string | undefined extends string
```

is false.

If you want to include optional string properties, use `NonNullable`.

```typescript
type PickByNonNullableType<T, ValueType> = {
    [Key in keyof T as
        NonNullable<T[Key]> extends ValueType ? Key : never
    ]: T[Key];
};
```

Now:

```typescript
type Result = PickByNonNullableType<User, string>;
```

Result:

```typescript
type Result = {
    name: string;
    nickname?: string;
};
```

---

# 3. Creating OmitByType

`PickByType` selects properties based on their value types.

`OmitByType` does the opposite: it removes properties based on their value types.

Consider:

```typescript
type User = {
    id: number;
    name: string;
    email: string;
    age: number;
    active: boolean;
};
```

You want to remove all string properties.

Expected:

```typescript
type Result = {
    id: number;
    age: number;
    active: boolean;
};
```

### Implementation

```typescript
type OmitByType<T, ValueType> = {
    [Key in keyof T as
        T[Key] extends ValueType ? never : Key
    ]: T[Key];
};
```

Usage:

```typescript
type Result = OmitByType<User, string>;
```

Result:

```typescript
type Result = {
    id: number;
    age: number;
    active: boolean;
};
```

### Comparing PickByType and OmitByType

| Utility | Purpose |
|---|---|
| `PickByType<T, U>` | Keeps properties assignable to `U` |
| `OmitByType<T, U>` | Removes properties assignable to `U` |

The key difference is the conditional result:

```typescript
// Pick
T[Key] extends ValueType ? Key : never
```

```typescript
// Omit
T[Key] extends ValueType ? never : Key
```

---

# 4. Creating PickByValue and OmitByValue

Sometimes you don't want to filter properties by their types.

Instead, you want to filter properties based on their actual literal values.

Consider:

```typescript
type Config = {
    environment: "production";
    debug: false;
    version: 1;
    name: "My Application";
};
```

Suppose you want to select properties whose types are exactly `false`.

```typescript
type PickByValue<T, Value> = {
    [Key in keyof T as
        T[Key] extends Value ? Key : never
    ]: T[Key];
};
```

Usage:

```typescript
type FalseProperties = PickByValue<Config, false>;
```

Result:

```typescript
type FalseProperties = {
    debug: false;
};
```

### Another example

```typescript
type ProductionProperties = PickByValue<
    Config,
    "production"
>;
```

Result:

```typescript
type ProductionProperties = {
    environment: "production";
};
```

### Important: Assignability versus exact equality

This utility checks assignability, not strict type equality.

For example:

```typescript
type Data = {
    status: "success" | "failed";
};
```

Then:

```typescript
type Result = PickByValue<Data, "success">;
```

The result is:

```typescript
type Result = {};
```

Why?

Because:

```typescript
"success" | "failed" extends "success"
```

is false.

The entire property type must be assignable to the requested type.

If you want to check exact type equality, you can create a separate utility.

### Exact type equality

```typescript
type Equal<X, Y> =
    (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2)
        ? true
        : false;
```

Then:

```typescript
type PickExact<T, Value> = {
    [Key in keyof T as
        Equal<T[Key], Value> extends true
            ? Key
            : never
    ]: T[Key];
};
```

Example:

```typescript
type Data = {
    status: "success" | "failed";
    active: false;
    enabled: boolean;
};

type Result = PickExact<Data, boolean>;
```

Result:

```typescript
type Result = {
    enabled: boolean;
};
```

Because `false` and `boolean` are different types.

**Note:** Type equality utilities are advanced techniques. TypeScript's type system has edge cases involving `any`, intersections, and special types, so equality helpers should be tested against the cases your application needs.

---

# 5. Conditionally Transforming Object Properties

Now let's go beyond filtering.

Suppose you have:

```typescript
type User = {
    id: number;
    name: string;
    email: string;
    active: boolean;
};
```

You want:

- String properties to become optional.
- Number properties to become readonly.
- Boolean properties to remain unchanged.

### Implementation

```typescript
type TransformUser<T> = {
    [Key in keyof T]:
        T[Key] extends string
            ? T[Key] | undefined
            : T[Key];
};
```

This example adds `undefined` to string property types, but it does not make the properties optional.

Result:

```typescript
type Result = {
    id: number;
    name: string | undefined;
    email: string | undefined;
    active: boolean;
};
```

### Making string properties actually optional

To make the property optional, use key remapping to separate the properties into two groups.

```typescript
type OptionalStringFields<T> = {
    [Key in keyof T as
        T[Key] extends string ? Key : never
    ]?: T[Key];
} & {
    [Key in keyof T as
        T[Key] extends string ? never : Key
    ]: T[Key];
};
```

Usage:

```typescript
type User = {
    id: number;
    name: string;
    email: string;
    active: boolean;
};

type Result = OptionalStringFields<User>;
```

Result:

```typescript
type Result = {
    name?: string;
    email?: string;
} & {
    id: number;
    active: boolean;
};
```

Conceptually:

```typescript
type Result = {
    id: number;
    name?: string;
    email?: string;
    active: boolean;
};
```

This technique is useful when different property types need different transformations.

---

# 6. Creating a Conditional Readonly Utility

Suppose you want only certain properties to become readonly.

Consider:

```typescript
type User = {
    id: number;
    name: string;
    email: string;
    age: number;
};
```

You want:

- `id` to be readonly.
- All other properties to remain mutable.

### Implementation

```typescript
type ReadonlyKeys<T, K extends keyof T> = {
    readonly [Key in keyof T as
        Key extends K ? Key : never
    ]: T[Key];
} & {
    [Key in keyof T as
        Key extends K ? never : Key
    ]: T[Key];
};
```

Usage:

```typescript
type UserWithReadonlyId = ReadonlyKeys<User, "id">;
```

Result conceptually:

```typescript
type UserWithReadonlyId = {
    readonly id: number;
    name: string;
    email: string;
    age: number;
};
```

Now:

```typescript
const user: UserWithReadonlyId = {
    id: 1,
    name: "Riyaz",
    email: "riyaz@example.com",
    age: 25
};

user.name = "Ahmed"; // Allowed

user.id = 2; // Error
```

### Why use intersection (`&`)?

We create two separate object types:

1. One containing readonly selected properties.
2. Another containing the remaining mutable properties.

Then combine them using intersection.

This is a useful pattern for selective property transformations.

---

# 7. Advanced Recursive Mapped Types

You already learned `DeepReadonly` and `DeepPartial` in Phase 17.

Now let's improve our understanding of recursive transformations.

A recursive mapped type:

1. Iterates over object properties.
2. Checks each property's type.
3. Recursively transforms nested structures.
4. Stops when it reaches a type that should not be transformed.

The important part is deciding which types require special handling.

## A. Improved DeepReadonly

Consider:

```typescript
type User = {
    id: number;
    profile: {
        name: string;
        address: {
            city: string;
        };
    };
};
```

A recursive utility can transform it:

```typescript
type DeepReadonly<T> =
    T extends (...args: any[]) => any
        ? T
        : T extends readonly unknown[]
            ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
            : T extends object
                ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
                : T;
```

Usage:

```typescript
type ReadonlyUser = DeepReadonly<User>;
```

Result:

```typescript
type ReadonlyUser = {
    readonly id: number;
    readonly profile: {
        readonly name: string;
        readonly address: {
            readonly city: string;
        };
    };
};
```

### Why check functions first?

Functions are objects in JavaScript.

If we treated a function as a regular object, we would attempt to map over its properties and call signatures.

We generally want to preserve its original callable type.

### Why check arrays?

Arrays are also objects.

A generic object transformation can otherwise handle their structure in an unintended way.

By checking arrays explicitly, we can recursively transform their element types and preserve readonly behavior.

---

# 8. Handling Tuples in Recursive Types

Tuples are different from ordinary arrays because they have fixed positions and potentially different types at each position.

Example:

```typescript
type UserRecord = [
    number,
    string,
    {
        city: string;
    }
];
```

We want:

```typescript
type ReadonlyUserRecord = [
    number,
    string,
    {
        readonly city: string;
    }
];
```

Our previous `DeepReadonly` implementation already handles tuples through:

```typescript
T extends readonly unknown[]
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
```

Example:

```typescript
type DeepReadonly<T> =
    T extends (...args: any[]) => any
        ? T
        : T extends readonly unknown[]
            ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
            : T extends object
                ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
                : T;
```

Usage:

```typescript
type RecordData = [
    number,
    string,
    {
        city: string;
        coordinates: [number, number];
    }
];

type Result = DeepReadonly<RecordData>;
```

The resulting tuple and nested properties become readonly.

### Important distinction

```typescript
type A = DeepReadonly<string[]>;
```

Produces a readonly array of strings.

```typescript
type B = DeepReadonly<[string, number]>;
```

Produces a readonly tuple.

Both are handled by the same array branch.

---

# 9. Handling Special Objects in Recursive Types

There is an important problem with this implementation:

```typescript
type DeepReadonly<T> =
    T extends object
        ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
        : T;
```

It treats every object recursively.

But JavaScript has special built-in objects.

Examples:

- `Date`
- `RegExp`
- `Map`
- `Set`
- `Promise`
- `Error`

For example:

```typescript
type Data = {
    createdAt: Date;
};
```

A generic object transformation may recursively map over Date's properties and methods.

This is usually not what we want.

### Improved version with built-in exceptions

```typescript
type Primitive =
    | string
    | number
    | boolean
    | bigint
    | symbol
    | null
    | undefined;

type DeepReadonly<T> =
    T extends Primitive
        ? T
        : T extends Function
            ? T
            : T extends Date | RegExp
                ? T
                : T extends Map<infer K, infer V>
                    ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
                    : T extends Set<infer U>
                        ? ReadonlySet<DeepReadonly<U>>
                        : T extends Promise<infer U>
                            ? Promise<DeepReadonly<U>>
                            : T extends readonly unknown[]
                                ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
                                : T extends object
                                    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
                                    : T;
```

### What does this implementation handle?

| Type | Transformation |
|---|---|
| Primitive | Preserved |
| Function | Preserved |
| Date | Preserved |
| RegExp | Preserved |
| Map | Converted to ReadonlyMap |
| Set | Converted to ReadonlySet |
| Promise | Recursively transforms resolved value |
| Array | Makes it readonly and transforms elements |
| Tuple | Makes it readonly and transforms elements |
| Plain object | Recursively makes properties readonly |

**Important:** This is an educational utility, not a universal deep immutability solution. Class instances, custom collections, weak collections, and other special types may need additional branches. Also, `ReadonlyMap` and `ReadonlySet` restrict mutation through that TypeScript reference; they do not freeze the underlying runtime objects.

---

# 10. Advanced `infer` Patterns

You learned basic `infer` in Phase 16.

Now let's explore more advanced extraction patterns.

## A. Extract the first function parameter

```typescript
type FirstParameter<T> =
    T extends (first: infer P, ...args: any[]) => any
        ? P
        : never;
```

Usage:

```typescript
function createUser(
    name: string,
    age: number
) {
    return {
        name,
        age
    };
}

type FirstArg = FirstParameter<typeof createUser>;
```

Result:

```typescript
type FirstArg = string;
```

## B. Extract the last tuple element

```typescript
type Last<T extends readonly unknown[]> =
    T extends readonly [...unknown[], infer L]
        ? L
        : never;
```

Usage:

```typescript
type A = Last<[string, number, boolean]>;

type B = Last<[number, string]>;
```

Results:

```typescript
type A = boolean;

type B = string;
```

## C. Extract the first and last tuple elements

```typescript
type FirstAndLast<T extends readonly unknown[]> =
    T extends readonly [infer F, ...unknown[], infer L]
        ? [F, L]
        : never;
```

Usage:

```typescript
type Result = FirstAndLast<
    [string, number, boolean, Date]
>;
```

Result:

```typescript
type Result = [string, Date];
```

## D. Extract the Promise value

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

## E. Extract the element type of nested arrays

```typescript
type DeepArrayElement<T> =
    T extends readonly (infer U)[]
        ? DeepArrayElement<U>
        : T;
```

Usage:

```typescript
type Result = DeepArrayElement<
    string[][][]
>;
```

Result:

```typescript
type Result = string;
```

This recursively unwraps array element types until it reaches a non-array type.

---

# 11. Creating a DeepPartial Utility with Better Array Handling

Let's improve `DeepPartial`.

The simple implementation from Phase 17 was:

```typescript
type DeepPartial<T> = {
    [Key in keyof T]?: T[Key] extends object
        ? DeepPartial<T[Key]>
        : T[Key];
};
```

However, arrays and tuples are also objects.

We should handle them explicitly.

### Improved implementation

```typescript
type DeepPartial<T> =
    T extends (...args: any[]) => any
        ? T
        : T extends readonly unknown[]
            ? { [K in keyof T]?: DeepPartial<T[K]> }
            : T extends object
                ? { [K in keyof T]?: DeepPartial<T[K]> }
                : T;
```

Usage:

```typescript
type User = {
    id: number;
    profile: {
        name: string;
        address: {
            city: string;
            country: string;
        };
    };
    tags: string[];
};
```

```typescript
type PartialUser = DeepPartial<User>;
```

Now nested object properties and array positions/elements are transformed recursively.

**Important:** This version treats tuples and arrays similarly through mapped properties, and optional tuple positions can have nuanced behavior. For production-grade libraries, test tuple labels, rest elements, optional tuple elements, and readonly behavior carefully.

---

# 12. Creating a DeepRequired Utility

We already know how to make properties required using `Required<T>`.

Now let's make every nested property required.

### Implementation

```typescript
type DeepRequired<T> =
    T extends (...args: any[]) => any
        ? T
        : T extends readonly unknown[]
            ? { [K in keyof T]-?: DeepRequired<T[K]> }
            : T extends object
                ? { [K in keyof T]-?: DeepRequired<T[K]> }
                : T;
```

Usage:

```typescript
type User = {
    id?: number;
    profile?: {
        name?: string;
        address?: {
            city?: string;
        };
    };
};
```

```typescript
type RequiredUser = DeepRequired<User>;
```

Result conceptually:

```typescript
type RequiredUser = {
    id: number;
    profile: {
        name: string;
        address: {
            city: string;
        };
    };
};
```

This removes optional property modifiers recursively.

**Important:** Removing optional modifiers is not always the same as removing `undefined` from explicitly declared value types. With `exactOptionalPropertyTypes` disabled, reading optional properties also introduces `undefined`. For more precise transformations, consider whether you need to apply `NonNullable<T[K]>` as well.

---

# 13. Creating a DeepNullable Utility

Sometimes you want to allow every nested property to contain `null`.

### Implementation

```typescript
type DeepNullable<T> =
    T extends (...args: any[]) => any
        ? T
        : T extends readonly unknown[]
            ? { [K in keyof T]: DeepNullable<T[K]> | null }
            : T extends object
                ? { [K in keyof T]: DeepNullable<T[K]> | null }
                : T | null;
```

Usage:

```typescript
type User = {
    id: number;
    profile: {
        name: string;
        age: number;
    };
};
```

```typescript
type NullableUser = DeepNullable<User>;
```

Now properties at every level can contain `null`.

For example:

```typescript
const user: NullableUser = {
    id: null,
    profile: {
        name: null,
        age: 25
    }
};
```

This is a simplified recursive utility. Special handling may be necessary for dates, maps, sets, and other built-in objects.

---

# 14. Combining Conditional Types with Mapped Types for API Models

Let's create a practical utility for API response objects.

Suppose:

```typescript
type ApiResponse = {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    active: boolean;
};
```

You want to generate a response type that:

- Removes sensitive properties.
- Makes remaining properties readonly.
- Keeps all property types unchanged.

### Implementation

```typescript
type PublicResponse<T> = {
    readonly [Key in keyof T as
        Key extends "password" ? never : Key
    ]: T[Key];
};
```

Usage:

```typescript
type UserResponse = PublicResponse<ApiResponse>;
```

Result:

```typescript
type UserResponse = {
    readonly id: number;
    readonly name: string;
    readonly email: string;
    readonly createdAt: Date;
    readonly active: boolean;
};
```

### Generalizing the utility

Instead of hardcoding `"password"`, make the excluded keys generic.

```typescript
type PublicResponse<
    T,
    K extends keyof T
> = {
    readonly [Key in keyof T as
        Key extends K ? never : Key
    ]: T[Key];
};
```

Usage:

```typescript
type UserResponse = PublicResponse<
    ApiResponse,
    "password"
>;
```

You can reuse this utility for different models and different excluded properties.

**Security reminder:** This is only a type transformation. Your backend must still remove sensitive properties from the actual response object.

---

# 15. Creating a Typed Configuration Utility

Suppose you are building an application with this configuration:

```typescript
type AppConfig = {
    appName: string;
    port: number;
    debug: boolean;
    database: {
        host: string;
        port: number;
    };
};
```

You want to generate a type where:

- Every property is readonly.
- Every nested property is also readonly.
- Functions, if present, retain their function signatures.

You can use the improved `DeepReadonly` utility from Section 9.

```typescript
type Config = DeepReadonly<AppConfig>;
```

Usage:

```typescript
const config: Config = {
    appName: "My Application",
    port: 3000,
    debug: false,
    database: {
        host: "localhost",
        port: 3306
    }
};
```

The following assignments produce TypeScript errors:

```typescript
config.port = 4000;

config.database.host = "127.0.0.1";
```

This is useful for defining immutable application configuration types.

Remember that compile-time readonly does not automatically freeze the runtime object.

---

# 16. Creating a Type-Safe Event System

Let's build a more advanced example combining:

- Generics.
- `keyof`.
- Indexed access types.
- Mapped types.
- Template literal types.

Suppose:

```typescript
type User = {
    name: string;
    age: number;
    active: boolean;
};
```

You want to generate events for each property.

For example:

```typescript
"nameChanged"
"ageChanged"
"activeChanged"
```

Each event should accept the corresponding property type.

### Step 1: Create the event handler type

```typescript
type EventHandlers<T> = {
    [Key in keyof T as `${Key & string}Changed`]:
        (value: T[Key]) => void;
};
```

### Step 2: Generate the event structure

```typescript
type UserEvents = EventHandlers<User>;
```

Result:

```typescript
type UserEvents = {
    nameChanged: (value: string) => void;
    ageChanged: (value: number) => void;
    activeChanged: (value: boolean) => void;
};
```

### Step 3: Use it

```typescript
const userEvents: UserEvents = {
    nameChanged: (value) => {
        console.log("Name:", value);
    },

    ageChanged: (value) => {
        console.log("Age:", value);
    },

    activeChanged: (value) => {
        console.log("Active:", value);
    }
};
```

TypeScript automatically infers the callback parameter types.

For example:

```typescript
userEvents.ageChanged(25);

// Error
userEvents.ageChanged("25");
```

This is a powerful pattern for event-driven applications.

---

# 17. Understanding Type Distribution in Advanced Utilities

Conditional types can distribute over unions, as you learned in Phase 16.

This behavior becomes especially important when combining them with mapped types.

Consider:

```typescript
type Status = "pending" | "success" | "failed";
```

Create:

```typescript
type StatusObject = {
    [Key in Status]: {
        status: Key;
    };
};
```

Result:

```typescript
type StatusObject = {
    pending: {
        status: "pending";
    };

    success: {
        status: "success";
    };

    failed: {
        status: "failed";
    };
};
```

Now consider a conditional type:

```typescript
type StatusResult<T> =
    T extends "success"
        ? { data: string }
        : { error: string };
```

Usage:

```typescript
type Result = StatusResult<"success" | "failed">;
```

Result:

```typescript
type Result =
    | { data: string }
    | { error: string };
```

Why?

Because the conditional type distributes over the union.

Now combine this with mapped types:

```typescript
type StatusMap = {
    [Key in Status]: StatusResult<Key>;
};
```

Result:

```typescript
type StatusMap = {
    pending: { error: string };
    success: { data: string };
    failed: { error: string };
};
```

Each key is processed independently.

This is a common pattern when defining state machines and API status structures.

---

# 18. Understanding `keyof` with Union Types

This is an important advanced concept.

Consider:

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};

type Admin = {
    id: number;
    name: string;
    permissions: string[];
};
```

Create a union:

```typescript
type Person = User | Admin;
```

Now:

```typescript
type Keys = keyof Person;
```

The result is:

```typescript
type Keys = "id" | "name";
```

Why are `email` and `permissions` missing?

Because `keyof` on a union type gives keys that are safe to access on every member of the union.

Both `User` and `Admin` have:

- `id`
- `name`

But only one of them has `email`, and only the other has `permissions`.

### Getting all keys from a union

If you want all keys from all union members, you can use a distributive conditional type.

```typescript
type AllKeys<T> =
    T extends unknown ? keyof T : never;
```

Usage:

```typescript
type Keys = AllKeys<User | Admin>;
```

Result:

```typescript
type Keys = "id" | "name" | "email" | "permissions";
```

### Why does this work?

Because the conditional type distributes over the union.

Conceptually:

```typescript
AllKeys<User | Admin>
```

Becomes:

```typescript
keyof User | keyof Admin
```

Which becomes:

```typescript
"id" | "name" | "email"
    | "id" | "name" | "permissions"
```

Duplicates disappear in a union.

Final result:

```typescript
"id" | "name" | "email" | "permissions"
```

### Important distinction

| Expression | Result |
|---|---|
| `keyof (User \| Admin)` | Keys common to both types |
| `AllKeys<User \| Admin>` | Keys from all union members |

This distinction is very useful when building advanced utility types for discriminated unions.

---

# 19. Creating a Utility to Extract Optional Keys

Suppose:

```typescript
type User = {
    id: number;
    name: string;
    email?: string;
    age?: number;
    active: boolean;
};
```

You want to extract only optional property names.

Expected:

```typescript
type OptionalKeys = "email" | "age";
```

### Implementation

```typescript
type OptionalKeys<T> = {
    [Key in keyof T]-?:
        {} extends Pick<T, Key>
            ? Key
            : never;
}[keyof T];
```

Usage:

```typescript
type Keys = OptionalKeys<User>;
```

Result:

```typescript
type Keys = "email" | "age";
```

### Understanding the implementation

This utility combines several concepts.

**Step 1:**

```typescript
Pick<T, Key>
```

Creates an object containing only the current property.

**Step 2:**

```typescript
{} extends Pick<T, Key>
```

Checks whether an empty object is assignable to that single-property object type.

If the property is optional, it is possible.

If the property is required, it is not.

**Step 3:**

```typescript
? Key : never
```

Keeps optional keys and removes required keys.

**Step 4:**

```typescript
[keyof T]
```

Extracts the values from the mapped type as a union.

This is a powerful type-level programming technique.

---

# 20. Creating a Utility to Extract Required Keys

We can use the same approach to extract required properties.

```typescript
type RequiredKeys<T> = {
    [Key in keyof T]-?:
        {} extends Pick<T, Key>
            ? never
            : Key;
}[keyof T];
```

Usage:

```typescript
type User = {
    id: number;
    name: string;
    email?: string;
    age?: number;
    active: boolean;
};

type Keys = RequiredKeys<User>;
```

Result:

```typescript
type Keys = "id" | "name" | "active";
```

### Comparison

| Utility | Result |
|---|---|
| `OptionalKeys<T>` | Optional property keys |
| `RequiredKeys<T>` | Required property keys |

These utilities are useful when creating validation systems, form libraries, and object transformation utilities.

---

# 21. Creating a Utility to Extract Function Properties

Suppose you have:

```typescript
type UserService = {
    id: number;
    name: string;
    getUser: () => void;
    updateUser: (id: number) => void;
    deleteUser: (id: number) => boolean;
};
```

You want to select only function properties.

### Implementation

```typescript
type FunctionProperties<T> = {
    [Key in keyof T as
        T[Key] extends (...args: any[]) => any
            ? Key
            : never
    ]: T[Key];
};
```

Usage:

```typescript
type UserMethods = FunctionProperties<UserService>;
```

Result:

```typescript
type UserMethods = {
    getUser: () => void;
    updateUser: (id: number) => void;
    deleteUser: (id: number) => boolean;
};
```

### Extract non-function properties

```typescript
type NonFunctionProperties<T> = {
    [Key in keyof T as
        T[Key] extends (...args: any[]) => any
            ? never
            : Key
    ]: T[Key];
};
```

Result:

```typescript
type UserData = NonFunctionProperties<UserService>;
```

```typescript
type UserData = {
    id: number;
    name: string;
};
```

This is particularly useful when working with classes, service objects, and complex application models.

---

# 22. Creating a Utility to Extract Array Properties

Suppose:

```typescript
type Product = {
    id: number;
    title: string;
    tags: string[];
    images: string[];
    price: number;
    reviews: number[];
};
```

You want to select only array properties.

### Implementation

```typescript
type ArrayProperties<T> = {
    [Key in keyof T as
        T[Key] extends readonly unknown[]
            ? Key
            : never
    ]: T[Key];
};
```

Usage:

```typescript
type ProductArrays = ArrayProperties<Product>;
```

Result:

```typescript
type ProductArrays = {
    tags: string[];
    images: string[];
    reviews: number[];
};
```

### Why `readonly unknown[]`?

Because it matches both:

```typescript
string[]
```

and:

```typescript
readonly string[]
```

It also matches tuple types.

---

# 23. Common Mistakes

### Mistake 1: Forgetting that optional properties include `undefined` when read

```typescript
type User = {
    name?: string;
};
```

The type of:

```typescript
User["name"]
```

is `string | undefined`.

Therefore:

```typescript
T[Key] extends string
```

will not match an optional string property.

Use:

```typescript
NonNullable<T[Key]> extends string
```

when that is the intended behavior.

### Mistake 2: Confusing all keys with common keys

```typescript
type Keys = keyof (User | Admin);
```

Returns keys safe on every union member.

To collect all keys, use a distributive utility:

```typescript
type AllKeys<T> =
    T extends unknown ? keyof T : never;
```

### Mistake 3: Treating arrays as ordinary objects

Arrays and tuples need special handling in many recursive mapped types.

### Mistake 4: Forgetting that functions are objects

A function has call signatures and can have properties.

If your recursive utility should preserve functions, check for function types before the general object branch.

### Mistake 5: Assuming readonly means runtime immutability

Readonly is a compile-time restriction.

It does not automatically call `Object.freeze()`.

### Mistake 6: Creating overly complicated utility types

Advanced types can become difficult to debug.

Prefer smaller reusable utilities with meaningful names.

### Mistake 7: Assuming a type transformation changes actual data

`Omit`, `Pick`, mapped types, and conditional types only transform TypeScript types.

They do not modify JavaScript objects.

---

# 24. Interview Questions and Answers

### Q1. What happens when generics, conditional types, and mapped types are combined?

They allow us to create highly reusable utilities that can inspect, filter, and transform object properties based on their types.

### Q2. What is `PickByType<T, U>`?

It is a custom utility that selects properties whose value types are assignable to `U`.

### Q3. What is `OmitByType<T, U>`?

It removes properties whose value types are assignable to `U`.

### Q4. How can you filter object properties based on their types?

Use a mapped type with key remapping and a conditional type.

```typescript
type PickByType<T, U> = {
    [Key in keyof T as T[Key] extends U ? Key : never]: T[Key];
};
```

### Q5. How can you extract optional keys from an object?

One common implementation is:

```typescript
type OptionalKeys<T> = {
    [Key in keyof T]-?:
        {} extends Pick<T, Key> ? Key : never;
}[keyof T];
```

### Q6. What is the difference between `keyof T` and all keys of a union?

`keyof T` on a union gives keys common to all members.

A distributive conditional type can extract keys from each member and combine them.

### Q7. Why should recursive mapped types handle arrays separately?

Arrays have special structures, methods, and element types. Treating them as ordinary objects can produce unintended transformations.

### Q8. Why should recursive mapped types handle functions separately?

Functions have call signatures. A general object transformation may unintentionally transform their properties and signatures.

### Q9. What is the purpose of `infer` in advanced type utilities?

It allows TypeScript to extract types from complex structures such as functions, tuples, arrays, and Promises.

### Q10. What is a distributive conditional type?

A conditional type that automatically evaluates each member of a union independently when the checked type is a naked type parameter.

### Q11. Can mapped types transform nested objects?

Yes. By using recursive mapped types, we can recursively transform nested object properties.

### Q12. Can TypeScript create utility types that filter function properties?

Yes. Combine mapped types, indexed access types, and conditional types.

### Q13. Are advanced utility types executed at runtime?

No. They are evaluated by TypeScript's type system and erased during JavaScript compilation.

### Q14. Why is `NonNullable<T[Key]>` useful in property filtering?

It removes `null` and `undefined` from a property's type before checking whether it matches another type.

### Q15. What is the difference between a shallow and deep transformation?

A shallow transformation affects only top-level properties.

A deep transformation recursively affects nested properties.

---

# 25. Practical Exercises

Implement these utilities yourself. Try not to look at previous examples while solving them.

## Exercise 1: PickByType

Create a utility that selects properties based on their value types.

Expected:

```typescript
type User = {
    id: number;
    name: string;
    email: string;
    active: boolean;
};

type Result = PickByType<User, string>;
```

Expected result:

```typescript
{
    name: string;
    email: string;
}
```

## Exercise 2: OmitByType

Remove all properties whose value types are numbers.

## Exercise 3: PickOptional

Create a utility that extracts only optional properties.

Expected:

```typescript
type User = {
    id: number;
    name?: string;
    email?: string;
    active: boolean;
};

type Result = PickOptional<User>;
```

## Exercise 4: PickRequired

Create a utility that extracts only required properties.

## Exercise 5: PickFunctionProperties

Given:

```typescript
type Service = {
    id: number;
    name: string;
    getData: () => void;
    updateData: (id: number) => boolean;
};
```

Extract only function properties.

## Exercise 6: PickArrayProperties

Create a utility that extracts only array properties.

## Exercise 7: DeepReadonly

Create a recursive utility that:

- Preserves primitive types.
- Preserves function types.
- Handles arrays and tuples.
- Recursively makes object properties readonly.

## Exercise 8: DeepPartial

Create a recursive utility that makes nested object properties optional.

## Exercise 9: AllKeys

Create a utility that extracts all property keys from a union.

Expected:

```typescript
type A = {
    id: number;
    name: string;
};

type B = {
    id: number;
    email: string;
};

type Result = AllKeys<A | B>;
```

Expected result:

```typescript
"id" | "name" | "email"
```

## Exercise 10: Generate Getters

Given:

```typescript
type Product = {
    id: number;
    title: string;
    price: number;
};
```

Generate:

```typescript
type ProductGetters = {
    getId: () => number;
    getTitle: () => string;
    getPrice: () => number;
};
```

## Exercise 11: Generate Event Handlers

Given:

```typescript
type User = {
    name: string;
    age: number;
    active: boolean;
};
```

Generate:

```typescript
type UserEvents = {
    nameChanged: (value: string) => void;
    ageChanged: (value: number) => void;
    activeChanged: (value: boolean) => void;
};
```

## Exercise 12: Create a FormState Utility

Given:

```typescript
type RegistrationForm = {
    name: string;
    email: string;
    age: number;
    active: boolean;
};
```

Generate:

```typescript
type RegistrationState = {
    name: {
        value: string;
        error?: string;
        touched: boolean;
    };

    email: {
        value: string;
        error?: string;
        touched: boolean;
    };

    age: {
        value: number;
        error?: string;
        touched: boolean;
    };

    active: {
        value: boolean;
        error?: string;
        touched: boolean;
    };
};
```

---

# 26. Phase 18 Completion Checklist

| No. | Topic | Status |
|---|---|---|
| 1 | Combining generics and conditional types | ☐ |
| 2 | Combining conditional and mapped types | ☐ |
| 3 | PickByType | ☐ |
| 4 | OmitByType | ☐ |
| 5 | PickByValue | ☐ |
| 6 | Exact type equality | ☐ |
| 7 | Conditional property transformations | ☐ |
| 8 | Selective readonly properties | ☐ |
| 9 | Recursive mapped types | ☐ |
| 10 | Improved DeepReadonly | ☐ |
| 11 | Handling tuples in recursive types | ☐ |
| 12 | Handling special objects | ☐ |
| 13 | Advanced infer patterns | ☐ |
| 14 | Improved DeepPartial | ☐ |
| 15 | DeepRequired | ☐ |
| 16 | DeepNullable | ☐ |
| 17 | Extracting all keys from unions | ☐ |
| 18 | Extracting optional keys | ☐ |
| 19 | Extracting required keys | ☐ |
| 20 | Extracting function properties | ☐ |
| 21 | Extracting array properties | ☐ |
| 22 | Real-world type architecture | ☐ |

---

# What Comes Next?

## Phase 19: Advanced TypeScript – Recursive Types and Type-Level Programming

In the next phase, we will explore recursive type definitions and more advanced compile-time type computations.

Topics will include:

1. What is type-level programming?
2. Recursive type aliases.
3. Recursive object types.
4. Recursive JSON types.
5. Recursive array and tuple types.
6. Deeply nested object transformations.
7. Recursive string manipulation.
8. Tuple manipulation at the type level.
9. Type-level arithmetic concepts.
10. Building advanced utility types.
11. Type recursion limits and compiler performance.
12. Practical recursive type patterns.

**Phase 18 complete.** Say **"OK, Phase 19"** when you're ready to continue.