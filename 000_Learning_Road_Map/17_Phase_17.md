# Phase 17: Mapped Types and Advanced Object Type Transformations

**Level:** Advanced  
**Prerequisite:** Phase 8 – Type Aliases, Phase 12 – Template Literal Types, Phase 15 – `keyof` and Indexed Access Types, and Phase 16 – Conditional Types and `infer`.

## Learning Objectives

By the end of this phase, you will understand:

1. What mapped types are.
2. How mapped types work internally.
3. How to use `keyof` with mapped types.
4. How to map over object properties.
5. How to preserve property types.
6. How to add or remove `readonly`.
7. How to add or remove optional properties.
8. How to use mapping modifiers.
9. How to remap property keys using `as`.
10. How to combine mapped types with template literal types.
11. How to filter object properties.
12. How to create custom utility types.
13. How to transform nested objects.
14. How built-in utility types use mapped types.
15. Real-world applications of mapped types.

---

# 1. What Are Mapped Types?

A **mapped type** allows you to create a new object type by transforming the properties of an existing type.

In simple terms:

You have an existing object type, and you want to generate another object type based on its properties.

For example, suppose you have:

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};
```

Now imagine you want another type where all properties are optional.

You could manually write:

```typescript
type OptionalUser = {
    id?: number;
    name?: string;
    email?: string;
};
```

But imagine an object has 50 properties.

Manually rewriting all properties would be inconvenient.

Mapped types solve this problem.

### Basic syntax

```typescript
type NewType<T> = {
    [Key in keyof T]: T[Key];
};
```

Let's understand each part:

| Syntax | Meaning |
|---|---|
| `T` | Original object type |
| `keyof T` | Union of property keys |
| `Key` | Current property key |
| `in` | Iterates over the keys |
| `T[Key]` | Type of the current property |
| `[Key in keyof T]` | Maps over all properties |

### Example

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};

type MyUser = {
    [Key in keyof User]: User[Key];
};
```

Result:

```typescript
type MyUser = {
    id: number;
    name: string;
    email: string;
};
```

This example produces the same structure as the original type.

But now we can modify its properties.

---

# 2. Understanding How Mapped Types Work

Let's understand the previous example step by step.

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};

type MyUser = {
    [Key in keyof User]: User[Key];
};
```

### Step 1: `keyof User`

TypeScript extracts the keys:

```typescript
type UserKeys = "id" | "name" | "email";
```

### Step 2: Mapping over keys

```typescript
[Key in keyof User]
```

Conceptually, TypeScript processes:

```typescript
Key = "id";
Key = "name";
Key = "email";
```

### Step 3: Extracting property types

```typescript
User[Key]
```

For each key:

| Key | `User[Key]` |
|---|---|
| `"id"` | `number` |
| `"name"` | `string` |
| `"email"` | `string` |

### Step 4: Creating the resulting type

TypeScript generates:

```typescript
type MyUser = {
    id: number;
    name: string;
    email: string;
};
```

**Important:** Mapped types transform types at compile time. They do not create JavaScript objects or modify runtime data.

---

# 3. Creating a Readonly Object Using Mapped Types

Suppose you want to make every property of an object readonly.

You can use the `readonly` modifier inside a mapped type.

### Example

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};

type ReadonlyUser = {
    readonly [Key in keyof User]: User[Key];
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

Usage:

```typescript
const user: ReadonlyUser = {
    id: 1,
    name: "Riyaz",
    email: "riyaz@example.com"
};

user.name = "Ahmed"; // Error
user.email = "new@example.com"; // Error
```

All properties are now readonly.

### Reusable utility

Instead of writing this for every object, create a generic utility.

```typescript
type MyReadonly<T> = {
    readonly [Key in keyof T]: T[Key];
};
```

Usage:

```typescript
type Product = {
    id: number;
    title: string;
    price: number;
};

type ReadonlyProduct = MyReadonly<Product>;
```

This works with any compatible object type.

### Built-in `Readonly<T>`

TypeScript already provides:

```typescript
type ReadonlyProduct = Readonly<Product>;
```

This is equivalent in purpose to our custom implementation.

**Note:** `Readonly<T>` is shallow. It prevents reassignment of top-level properties, but does not automatically make nested objects deeply readonly.

---

# 4. Creating an Optional Object Using Mapped Types

Suppose you want to make every property optional.

You can use the `?` modifier.

### Example

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};

type OptionalUser = {
    [Key in keyof User]?: User[Key];
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

Now:

```typescript
const user1: OptionalUser = {};

const user2: OptionalUser = {
    name: "Riyaz"
};

const user3: OptionalUser = {
    id: 1,
    email: "riyaz@example.com"
};
```

All these values are valid.

### Reusable utility

```typescript
type MyPartial<T> = {
    [Key in keyof T]?: T[Key];
};
```

Usage:

```typescript
type Product = {
    id: number;
    title: string;
    price: number;
};

type PartialProduct = MyPartial<Product>;
```

### Built-in `Partial<T>`

TypeScript provides:

```typescript
type PartialProduct = Partial<Product>;
```

This makes all properties optional.

### Real-world use case: Update API

Suppose you have a user update API.

You don't always want users to provide every property.

```typescript
type User = {
    id: number;
    name: string;
    email: string;
    age: number;
};

type UpdateUserRequest = Partial<User>;
```

Now:

```typescript
const updateData: UpdateUserRequest = {
    name: "New Name"
};
```

This is particularly useful for PATCH-style update operations.

---

# 5. Mapping Modifiers: Adding and Removing Modifiers

Mapped types support modifiers that let you change property characteristics.

There are two important modifiers:

| Modifier | Purpose |
|---|---|
| `readonly` | Makes properties readonly |
| `?` | Makes properties optional |

You can also remove these modifiers using `-`.

Let's understand this.

## A. Adding readonly

```typescript
type MakeReadonly<T> = {
    readonly [Key in keyof T]: T[Key];
};
```

## B. Removing readonly

```typescript
type RemoveReadonly<T> = {
    -readonly [Key in keyof T]: T[Key];
};
```

Example:

```typescript
type User = {
    readonly id: number;
    readonly name: string;
    email: string;
};

type EditableUser = RemoveReadonly<User>;
```

Result:

```typescript
type EditableUser = {
    id: number;
    name: string;
    email: string;
};
```

Now the properties are mutable through an `EditableUser` reference.

## C. Adding optional properties

```typescript
type MakeOptional<T> = {
    [Key in keyof T]?: T[Key];
};
```

## D. Removing optional properties

```typescript
type MakeRequired<T> = {
    [Key in keyof T]-?: T[Key];
};
```

Example:

```typescript
type User = {
    id?: number;
    name?: string;
    email: string;
};

type RequiredUser = MakeRequired<User>;
```

Result:

```typescript
type RequiredUser = {
    id: number;
    name: string;
    email: string;
};
```

### Important syntax

```typescript
readonly [Key in keyof T]
```

Adds `readonly`.

```typescript
-readonly [Key in keyof T]
```

Removes `readonly`.

```typescript
[Key in keyof T]?
```

Adds optional.

```typescript
[Key in keyof T]-?
```

Removes optional.

### Combining modifiers

You can combine them.

```typescript
type ImmutableRequired<T> = {
    readonly [Key in keyof T]-?: T[Key];
};
```

This makes all properties:

- Required.
- Readonly.

Example:

```typescript
type User = {
    id?: number;
    name?: string;
};

type Result = ImmutableRequired<User>;
```

Result:

```typescript
type Result = {
    readonly id: number;
    readonly name: string;
};
```

---

# 6. Understanding `keyof` with Mapped Types

The `keyof` operator is one of the most important building blocks of mapped types.

It extracts the keys of an object type as a union.

Example:

```typescript
type Product = {
    id: number;
    title: string;
    price: number;
};

type ProductKeys = keyof Product;
```

Result:

```typescript
type ProductKeys = "id" | "title" | "price";
```

Now combine it with a mapped type:

```typescript
type ProductValues = {
    [Key in keyof Product]: Product[Key];
};
```

The mapped type iterates over all these keys.

### Generic version

```typescript
type CopyType<T> = {
    [Key in keyof T]: T[Key];
};
```

Usage:

```typescript
type User = {
    id: number;
    name: string;
};

type Product = {
    id: number;
    title: string;
    price: number;
};

type UserCopy = CopyType<User>;

type ProductCopy = CopyType<Product>;
```

One utility works with both types.

### Important clarification

`keyof` does not retrieve actual runtime keys.

For runtime keys, JavaScript provides:

```typescript
Object.keys(product);
```

The difference:

| `keyof` | `Object.keys()` |
|---|---|
| TypeScript type operator | JavaScript runtime method |
| Produces a union of property key types | Returns an array of strings |
| Exists only during type checking | Executes at runtime |

---

# 7. Key Remapping Using `as`

This is one of the most powerful features of mapped types.

Normally, mapped types preserve the original property names.

But sometimes you want to change property names while creating a new type.

For this, TypeScript provides **key remapping using `as`**.

### Basic syntax

```typescript
type NewType<T> = {
    [Key in keyof T as NewKey]: T[Key];
};
```

Here:

- `Key` represents the original property key.
- `as` allows us to transform that key.
- `NewKey` represents the new property name.

### Example 1: Add a prefix to property names

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};

type PrefixedUser = {
    [Key in keyof User as `user_${Key}`]: User[Key];
};
```

Result:

```typescript
type PrefixedUser = {
    user_id: number;
    user_name: string;
    user_email: string;
};
```

Notice how we used a template literal type:

```typescript
`user_${Key}`
```

### Example 2: Add a suffix

```typescript
type User = {
    id: number;
    name: string;
};

type SuffixedUser = {
    [Key in keyof User as `${Key}_field`]: User[Key];
};
```

Result:

```typescript
type SuffixedUser = {
    id_field: number;
    name_field: string;
};
```

### Example 3: Convert property names to uppercase

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};

type UppercaseUser = {
    [Key in keyof User as Uppercase<Key & string>]: User[Key];
};
```

Result:

```typescript
type UppercaseUser = {
    ID: number;
    NAME: string;
    EMAIL: string;
};
```

Why use `Key & string`?

Because `keyof T` can include string, number, or symbol keys.

The built-in `Uppercase<T>` utility expects a string type.

`Key & string` ensures the key is treated as a string-compatible type.

---

# 8. Filtering Properties Using Key Remapping

Key remapping is not only useful for renaming properties.

It can also be used to remove properties from an object type.

The key idea:

If you map a property key to `never`, that property is omitted.

### Example 1: Remove a specific property

```typescript
type User = {
    id: number;
    name: string;
    email: string;
    password: string;
};

type RemovePassword<T> = {
    [Key in keyof T as Key extends "password" ? never : Key]: T[Key];
};
```

Usage:

```typescript
type PublicUser = RemovePassword<User>;
```

Result:

```typescript
type PublicUser = {
    id: number;
    name: string;
    email: string;
};
```

The `password` property is removed.

### How does it work?

Consider:

```typescript
[Key in keyof T as Key extends "password" ? never : Key]
```

For every property:

| Original key | Condition | Resulting key |
|---|---|---|
| `"id"` | Not password | `"id"` |
| `"name"` | Not password | `"name"` |
| `"email"` | Not password | `"email"` |
| `"password"` | Is password | `never` |

The property mapped to `never` is removed.

### Example 2: Keep only selected properties

```typescript
type User = {
    id: number;
    name: string;
    email: string;
    age: number;
};

type KeepIdentity<T> = {
    [Key in keyof T as Key extends "id" | "name" ? Key : never]: T[Key];
};
```

Result:

```typescript
type Identity = KeepIdentity<User>;
```

```typescript
type Identity = {
    id: number;
    name: string;
};
```

---

# 9. Filtering Properties Based on Their Value Types

Now let's make our mapped types more powerful.

Suppose you want to remove all properties whose values are not strings.

You can combine:

- `keyof`
- Indexed access types
- Conditional types
- Key remapping

### Example

```typescript
type User = {
    id: number;
    name: string;
    email: string;
    age: number;
    active: boolean;
};
```

We want:

```typescript
type StringProperties = {
    name: string;
    email: string;
};
```

### Solution

```typescript
type PickByValueType<T, ValueType> = {
    [Key in keyof T as T[Key] extends ValueType ? Key : never]: T[Key];
};
```

Usage:

```typescript
type StringProperties = PickByValueType<User, string>;
```

Result:

```typescript
type StringProperties = {
    name: string;
    email: string;
};
```

### How does it work?

Consider this part:

```typescript
T[Key] extends ValueType ? Key : never
```

For each property:

| Property | Property type | Condition | Result |
|---|---|---|---|
| `id` | `number` | number extends string? No | Removed |
| `name` | `string` | string extends string? Yes | Kept |
| `email` | `string` | string extends string? Yes | Kept |
| `age` | `number` | number extends string? No | Removed |
| `active` | `boolean` | boolean extends string? No | Removed |

This is a very useful pattern for building advanced utility types.

### Important: Optional properties

Consider:

```typescript
type User = {
    name: string;
    nickname?: string;
};
```

The type of `nickname` when read is:

```typescript
string | undefined
```

Therefore:

```typescript
type StringProperties = PickByValueType<User, string>;
```

Will keep `name` but not `nickname`.

If you want to include optional properties whose non-nullish values are strings, use `NonNullable`:

```typescript
type PickByNonNullableValueType<T, ValueType> = {
    [Key in keyof T as NonNullable<T[Key]> extends ValueType ? Key : never]: T[Key];
};
```

Now:

```typescript
type Result = PickByNonNullableValueType<User, string>;
```

Includes both `name` and `nickname`.

---

# 10. Combining Mapped Types with Template Literal Types

Mapped types become even more powerful when combined with template literal types.

You learned template literal types in Phase 12.

Now let's combine them.

### Example 1: Generate event names

Suppose:

```typescript
type User = {
    name: string;
    age: number;
    email: string;
};
```

You want to generate event names such as:

```typescript
"nameChanged"
"ageChanged"
"emailChanged"
```

You can write:

```typescript
type UserEvents = {
    [Key in keyof User as `${Key & string}Changed`]: (value: User[Key]) => void;
};
```

Result:

```typescript
type UserEvents = {
    nameChanged: (value: string) => void;
    ageChanged: (value: number) => void;
    emailChanged: (value: string) => void;
};
```

Notice that the original property type is preserved.

### Example 2: Generate getter methods

Suppose you have:

```typescript
type Product = {
    id: number;
    title: string;
    price: number;
};
```

You want:

```typescript
type ProductGetters = {
    getId: () => number;
    getTitle: () => string;
    getPrice: () => number;
};
```

Solution:

```typescript
type Getters<T> = {
    [Key in keyof T as `get${Capitalize<Key & string>}`]: () => T[Key];
};
```

Usage:

```typescript
type ProductGetters = Getters<Product>;
```

Result:

```typescript
type ProductGetters = {
    getId: () => number;
    getTitle: () => string;
    getPrice: () => number;
};
```

### Example 3: Generate setter methods

```typescript
type Setters<T> = {
    [Key in keyof T as `set${Capitalize<Key & string>}`]: (value: T[Key]) => void;
};
```

Usage:

```typescript
type User = {
    name: string;
    age: number;
};

type UserSetters = Setters<User>;
```

Result:

```typescript
type UserSetters = {
    setName: (value: string) => void;
    setAge: (value: number) => void;
};
```

This pattern is useful for designing strongly typed APIs and object interfaces.

---

# 11. Built-in Utility Types Based on Mapped Types

TypeScript provides several built-in utility types that use mapped types.

Let's understand the most important ones.

## A. `Partial<T>`

Makes all properties optional.

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};

type PartialUser = Partial<User>;
```

Conceptual implementation:

```typescript
type MyPartial<T> = {
    [Key in keyof T]?: T[Key];
};
```

## B. `Required<T>`

Makes all properties required.

```typescript
type User = {
    id?: number;
    name?: string;
    email?: string;
};

type RequiredUser = Required<User>;
```

Conceptual implementation:

```typescript
type MyRequired<T> = {
    [Key in keyof T]-?: T[Key];
};
```

## C. `Readonly<T>`

Makes all properties readonly.

```typescript
type User = {
    id: number;
    name: string;
};

type ReadonlyUser = Readonly<User>;
```

Conceptual implementation:

```typescript
type MyReadonly<T> = {
    readonly [Key in keyof T]: T[Key];
};
```

## D. `Pick<T, K>`

Selects specific properties from an object.

```typescript
type User = {
    id: number;
    name: string;
    email: string;
    age: number;
};

type UserIdentity = Pick<User, "id" | "name">;
```

Result:

```typescript
type UserIdentity = {
    id: number;
    name: string;
};
```

Conceptual implementation:

```typescript
type MyPick<T, K extends keyof T> = {
    [Key in K]: T[Key];
};
```

## E. `Omit<T, K>`

Removes specific properties from an object.

```typescript
type User = {
    id: number;
    name: string;
    email: string;
    password: string;
};

type PublicUser = Omit<User, "password">;
```

Result:

```typescript
type PublicUser = {
    id: number;
    name: string;
    email: string;
};
```

Conceptually, `Omit` can be implemented using `Pick` and `Exclude`:

```typescript
type MyOmit<T, K extends PropertyKey> =
    Pick<T, Exclude<keyof T, K>>;
```

`PropertyKey` is a built-in type equivalent to:

```typescript
type PropertyKey = string | number | symbol;
```

### Summary

| Utility | Purpose |
|---|---|
| `Partial<T>` | Makes all properties optional |
| `Required<T>` | Makes all properties required |
| `Readonly<T>` | Makes all properties readonly |
| `Pick<T, K>` | Selects specified properties |
| `Omit<T, K>` | Removes specified properties |

These utilities are used extensively in professional TypeScript applications.

---

# 12. Combining Multiple Mapped Type Transformations

You can combine mapped types with other utility types.

Suppose you have:

```typescript
type User = {
    id: number;
    name: string;
    email: string;
    age: number;
    password: string;
};
```

You want to:

1. Remove the password.
2. Make all remaining properties optional.
3. Make all remaining properties readonly.

You can write:

```typescript
type UpdateUser = Readonly<Partial<Omit<User, "password">>>;
```

Result:

```typescript
type UpdateUser = {
    readonly id?: number;
    readonly name?: string;
    readonly email?: string;
    readonly age?: number;
};
```

### Breaking it down

**Step 1:**

```typescript
Omit<User, "password">
```

Removes the password property.

**Step 2:**

```typescript
Partial<Omit<User, "password">>
```

Makes all remaining properties optional.

**Step 3:**

```typescript
Readonly<Partial<Omit<User, "password">>>
```

Makes all remaining properties readonly.

This is a common way to compose reusable utility types.

---

# 13. Deep Mapped Types

So far, our mapped types have transformed only the top-level properties.

Consider:

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
};
```

If you write:

```typescript
type ReadonlyUser = Readonly<User>;
```

The result is conceptually:

```typescript
type ReadonlyUser = {
    readonly id: number;
    readonly profile: {
        name: string;
        address: {
            city: string;
            country: string;
        };
    };
};
```

Notice:

- `id` is readonly.
- `profile` cannot be reassigned.
- `profile.name` is still mutable.
- `profile.address.city` is still mutable.

This is called a **shallow transformation**.

What if you want to make every nested property readonly?

You need a recursive mapped type.

### Example: DeepReadonly

```typescript
type DeepReadonly<T> = {
    readonly [Key in keyof T]:
        T[Key] extends object
            ? DeepReadonly<T[Key]>
            : T[Key];
};
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
};

type ReadonlyUser = DeepReadonly<User>;
```

Result conceptually:

```typescript
type ReadonlyUser = {
    readonly id: number;
    readonly profile: {
        readonly name: string;
        readonly address: {
            readonly city: string;
            readonly country: string;
        };
    };
};
```

Now nested properties are also readonly.

### Important limitation

This simple implementation treats every object recursively.

However, some JavaScript objects need special handling:

- Functions
- Dates
- Maps
- Sets
- Class instances
- Other built-in objects

For example, a `Date` has methods that modify its internal state. Making its properties readonly does not automatically make the Date immutable.

Therefore, production-grade deep utility types often require additional conditional branches.

### Improved version

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

This version:

- Preserves function types.
- Recursively transforms array and tuple elements.
- Recursively transforms object properties.
- Leaves primitive types unchanged.

It is still a simplified implementation; specialized built-in types may need additional handling.

---

# 14. Transforming Nested Objects

Let's create another useful utility.

Suppose you want to make all nested properties optional.

### Example

```typescript
type User = {
    id: number;
    profile: {
        name: string;
        email: string;
    };
};
```

Normal `Partial<User>` produces:

```typescript
type PartialUser = {
    id?: number;
    profile?: {
        name: string;
        email: string;
    };
};
```

Notice that `name` and `email` are still required if `profile` is provided.

What if you want all nested properties to be optional too?

Use a recursive mapped type.

```typescript
type DeepPartial<T> = {
    [Key in keyof T]?: T[Key] extends object
        ? DeepPartial<T[Key]>
        : T[Key];
};
```

Usage:

```typescript
type PartialUser = DeepPartial<User>;
```

Conceptual result:

```typescript
type PartialUser = {
    id?: number;
    profile?: {
        name?: string;
        email?: string;
    };
};
```

Now:

```typescript
const updateUser: PartialUser = {
    profile: {
        name: "New Name"
    }
};
```

This is valid.

### Real-world use cases

Deep partial types are useful for:

- Nested configuration updates.
- Complex form updates.
- JSON configuration objects.
- Partial document updates.

**Important:** Like `DeepReadonly`, this is a simplified version. Arrays, tuples, functions, dates, maps, and other special objects may require separate handling.

---

# 15. Mapping Over Union Types

Mapped types can also work with unions of keys and object types.

Consider:

```typescript
type Status = "pending" | "success" | "failed";
```

You can create an object type using those values as keys.

```typescript
type StatusMessages = {
    [Key in Status]: string;
};
```

Result:

```typescript
type StatusMessages = {
    pending: string;
    success: string;
    failed: string;
};
```

### Example: Status configuration

```typescript
type Status = "pending" | "success" | "failed";

type StatusConfig = {
    [Key in Status]: {
        message: string;
        code: number;
    };
};
```

Result:

```typescript
type StatusConfig = {
    pending: {
        message: string;
        code: number;
    };

    success: {
        message: string;
        code: number;
    };

    failed: {
        message: string;
        code: number;
    };
};
```

Usage:

```typescript
const config: StatusConfig = {
    pending: {
        message: "Request is processing",
        code: 102
    },

    success: {
        message: "Request completed",
        code: 200
    },

    failed: {
        message: "Request failed",
        code: 500
    }
};
```

This pattern is useful for creating strongly typed configuration objects.

---

# 16. Real-World Example: Form State Types

Suppose you have a form:

```typescript
type RegistrationForm = {
    name: string;
    email: string;
    password: string;
    age: number;
};
```

You want to create a validation error object.

Each property should have a corresponding error message, but the error message is optional.

### Solution

```typescript
type FormErrors<T> = {
    [Key in keyof T]?: string;
};
```

Usage:

```typescript
type RegistrationErrors = FormErrors<RegistrationForm>;
```

Result:

```typescript
type RegistrationErrors = {
    name?: string;
    email?: string;
    password?: string;
    age?: string;
};
```

Now:

```typescript
const errors: RegistrationErrors = {
    email: "Invalid email address",
    password: "Password is too short"
};
```

### Extend the example

Suppose you want every field to have:

- Its original value type.
- An optional error message.
- A touched status.

You can create:

```typescript
type FormField<T> = {
    value: T;
    error?: string;
    touched: boolean;
};

type FormState<T> = {
    [Key in keyof T]: FormField<T[Key]>;
};
```

Usage:

```typescript
type RegistrationForm = {
    name: string;
    email: string;
    age: number;
};

type RegistrationState = FormState<RegistrationForm>;
```

Result:

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
};
```

This is a practical example of how mapped types can generate complex object structures automatically.

---

# 17. Real-World Example: Database Model Transformation

Suppose your application has a database model:

```typescript
type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
};
```

Different application layers may need different versions of this type.

### A. Create User Request

When creating a user, the database generates the ID and timestamps.

```typescript
type CreateUserRequest = Omit<
    User,
    "id" | "createdAt" | "updatedAt"
>;
```

Result:

```typescript
type CreateUserRequest = {
    name: string;
    email: string;
    password: string;
};
```

### B. Update User Request

During an update, all fields should be optional, except perhaps the ID.

```typescript
type UpdateUserRequest = Partial<
    Omit<User, "id" | "createdAt" | "updatedAt">
>;
```

Result:

```typescript
type UpdateUserRequest = {
    name?: string;
    email?: string;
    password?: string;
};
```

### C. Public User Response

The password should not be exposed.

```typescript
type PublicUserResponse = Omit<User, "password">;
```

Result:

```typescript
type PublicUserResponse = {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
};
```

### Important security clarification

These types only describe the expected TypeScript structures.

They do not automatically remove passwords from database records or API responses.

You must still explicitly exclude sensitive fields in your runtime code.

For example:

```typescript
const publicUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
};
```

Never rely on TypeScript types alone for runtime data security.

---

# 18. Important Concept: Homomorphic Mapped Types

You may encounter the term **homomorphic mapped type** in advanced TypeScript documentation.

A mapped type such as:

```typescript
type Copy<T> = {
    [Key in keyof T]: T[Key];
};
```

is commonly described as homomorphic.

In practical terms, a homomorphic mapped type maps over the properties of a type parameter while preserving important property characteristics from the original type.

For example:

```typescript
type User = {
    readonly id: number;
    name?: string;
};

type CopyUser = Copy<User>;
```

The resulting type preserves:

```typescript
type CopyUser = {
    readonly id: number;
    name?: string;
};
```

Notice:

- `readonly` remains on `id`.
- Optionality remains on `name`.

This is why a simple mapped type can preserve modifiers without explicitly specifying them.

### Compare with explicit transformations

```typescript
type MakeRequired<T> = {
    [Key in keyof T]-?: T[Key];
};
```

Here, we deliberately remove optionality.

```typescript
type MakeReadonly<T> = {
    readonly [Key in keyof T]: T[Key];
};
```

Here, we deliberately add readonly.

**Key takeaway:** Mapped types can preserve existing property modifiers or explicitly modify them.

---

# 19. Common Mistakes

### Mistake 1: Confusing `keyof` with runtime keys

Incorrect understanding:

`keyof` returns an actual array of keys.

Correct:

```typescript
type Keys = keyof User;
```

It creates a type-level union.

For runtime keys, use:

```typescript
Object.keys(user);
```

### Mistake 2: Forgetting the `in` keyword

Incorrect:

```typescript
type Result<T> = {
    [Key keyof T]: T[Key];
};
```

Correct:

```typescript
type Result<T> = {
    [Key in keyof T]: T[Key];
};
```

### Mistake 3: Confusing `?` and `-?`

```typescript
type Optional<T> = {
    [Key in keyof T]?: T[Key];
};
```

Adds optionality.

```typescript
type Required<T> = {
    [Key in keyof T]-?: T[Key];
};
```

Removes optionality.

### Mistake 4: Confusing `readonly` and `-readonly`

```typescript
type A<T> = {
    readonly [Key in keyof T]: T[Key];
};
```

Adds readonly.

```typescript
type B<T> = {
    -readonly [Key in keyof T]: T[Key];
};
```

Removes readonly.

### Mistake 5: Forgetting `never` in key remapping

```typescript
type RemoveEmail<T> = {
    [Key in keyof T as Key extends "email" ? never : Key]: T[Key];
};
```

Here, `never` removes the property.

### Mistake 6: Assuming `Readonly<T>` is deeply readonly

`Readonly<T>` only transforms top-level properties.

For nested objects, you need a recursive utility.

### Mistake 7: Assuming mapped types modify runtime objects

Mapped types exist only in TypeScript's type system.

They do not rename, remove, or modify actual JavaScript object properties.

### Mistake 8: Assuming `Omit` removes runtime properties

This:

```typescript
type PublicUser = Omit<User, "password">;
```

Only changes the type.

It does not remove the password from an object.

---

# 20. Interview Questions and Answers

### Q1. What are mapped types in TypeScript?

Mapped types allow us to create new object types by iterating over the properties of an existing type and transforming them.

### Q2. What is the basic syntax of a mapped type?

```typescript
type NewType<T> = {
    [Key in keyof T]: T[Key];
};
```

### Q3. What is the purpose of `keyof` in mapped types?

It extracts the property keys of an object type as a union, allowing the mapped type to iterate over them.

### Q4. How can you make all properties optional?

```typescript
type MyPartial<T> = {
    [Key in keyof T]?: T[Key];
};
```

### Q5. How can you make all properties readonly?

```typescript
type MyReadonly<T> = {
    readonly [Key in keyof T]: T[Key];
};
```

### Q6. How can you remove readonly modifiers?

Use `-readonly`.

```typescript
type Mutable<T> = {
    -readonly [Key in keyof T]: T[Key];
};
```

### Q7. How can you remove optional modifiers?

Use `-?`.

```typescript
type Required<T> = {
    [Key in keyof T]-?: T[Key];
};
```

### Q8. What is key remapping?

Key remapping allows us to rename or filter property keys in a mapped type using the `as` keyword.

### Q9. How can you remove a property using mapped types?

Map the property key to `never`.

```typescript
type RemovePassword<T> = {
    [Key in keyof T as Key extends "password" ? never : Key]: T[Key];
};
```

### Q10. What is the difference between `Pick` and `Omit`?

- `Pick<T, K>` selects specified properties.
- `Omit<T, K>` removes specified properties.

### Q11. What is a homomorphic mapped type?

It is a mapped type that transforms the properties of a type parameter while preserving important property characteristics, such as optionality and readonly modifiers.

### Q12. What is the difference between `Partial<T>` and `DeepPartial<T>`?

- `Partial<T>` makes only top-level properties optional.
- `DeepPartial<T>` recursively makes nested properties optional.

### Q13. Can mapped types modify actual JavaScript objects?

No. They transform types at compile time, not runtime objects.

### Q14. Can mapped types work with template literal types?

Yes. Template literal types can transform property names during key remapping.

### Q15. What is the difference between mapped types and conditional types?

Mapped types iterate over properties to create or transform object types.

Conditional types select types based on type relationships.

They can also be combined to build advanced utility types.

---

# 21. Practical Exercises

Try implementing these utilities yourself.

## Exercise 1: Create MyReadonly

Create a custom utility that makes every property readonly.

Expected:

```typescript
type User = {
    id: number;
    name: string;
};

type Result = MyReadonly<User>;
```

## Exercise 2: Create MyPartial

Make every property optional.

Expected:

```typescript
type Product = {
    id: number;
    title: string;
    price: number;
};

type Result = MyPartial<Product>;
```

## Exercise 3: Create MyRequired

Remove optional modifiers from all properties.

Expected:

```typescript
type User = {
    id?: number;
    name?: string;
};

type Result = MyRequired<User>;
```

## Exercise 4: Create MyPick

Create a utility that selects only specified properties.

Expected:

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};

type Result = MyPick<User, "id" | "name">;
```

## Exercise 5: Create MyOmit

Create a utility that removes specified properties.

Expected:

```typescript
type User = {
    id: number;
    name: string;
    password: string;
};

type Result = MyOmit<User, "password">;
```

## Exercise 6: Add a Prefix

Create a utility that adds `user_` before every property name.

Expected:

```typescript
type User = {
    id: number;
    name: string;
};

type Result = AddPrefix<User>;
```

Expected result:

```typescript
type Result = {
    user_id: number;
    user_name: string;
};
```

## Exercise 7: Remove a Property

Create a utility that removes the `password` property from any object type.

## Exercise 8: Filter String Properties

Create a utility that keeps only properties whose values are strings.

Expected:

```typescript
type User = {
    id: number;
    name: string;
    email: string;
    active: boolean;
};

type Result = PickByValueType<User, string>;
```

Expected result:

```typescript
type Result = {
    name: string;
    email: string;
};
```

## Exercise 9: Generate Getter Methods

Create a utility that generates getter methods for all object properties.

Expected:

```typescript
type Product = {
    id: number;
    title: string;
};

type Result = Getters<Product>;
```

Expected result:

```typescript
type Result = {
    getId: () => number;
    getTitle: () => string;
};
```

## Exercise 10: Create DeepReadonly

Create a recursive utility that makes all nested object properties readonly.

## Exercise 11: Create DeepPartial

Create a recursive utility that makes all nested object properties optional.

## Exercise 12: Create FormState

Given:

```typescript
type RegistrationForm = {
    name: string;
    email: string;
    age: number;
};
```

Create a generic `FormState<T>` utility that transforms each property into:

```typescript
{
    value: OriginalPropertyType;
    error?: string;
    touched: boolean;
}
```

---

# 22. Phase 17 Completion Checklist

| No. | Topic | Status |
|---|---|---|
| 1 | Understanding mapped types | ☐ |
| 2 | Mapped type syntax | ☐ |
| 3 | `keyof` with mapped types | ☐ |
| 4 | `T[Key]` indexed access | ☐ |
| 5 | Creating readonly types | ☐ |
| 6 | Creating optional types | ☐ |
| 7 | Adding mapping modifiers | ☐ |
| 8 | Removing mapping modifiers | ☐ |
| 9 | Key remapping using `as` | ☐ |
| 10 | Filtering properties using `never` | ☐ |
| 11 | Filtering properties by value type | ☐ |
| 12 | Template literal types with mapped types | ☐ |
| 13 | Built-in utility types | ☐ |
| 14 | Combining mapped types | ☐ |
| 15 | Recursive mapped types | ☐ |
| 16 | DeepReadonly | ☐ |
| 17 | DeepPartial | ☐ |
| 18 | Homomorphic mapped types | ☐ |
| 19 | Real-world form transformations | ☐ |
| 20 | Database model transformations | ☐ |

---

## What Comes Next?

**Phase 18: Advanced Type Manipulation – Combining Generics, Conditional Types, and Mapped Types**

In the next phase, we will bring together the concepts learned in Phases 14–17.

Topics will include:

1. Combining generic constraints and conditional types.
2. Combining mapped types with conditional types.
3. Advanced property filtering.
4. Transforming object properties based on their value types.
5. Creating `PickByType` and `OmitByType`.
6. Building `DeepReadonly` and `DeepPartial` with improved type handling.
7. Recursive type transformations.
8. Advanced `infer` patterns.
9. Creating custom utility types from scratch.
10. Real-world TypeScript type architecture.

**Phase 17 complete.** Say **"OK, Phase 18"** when you're ready to continue.