# Phase 19: Advanced TypeScript – Recursive Types and Type-Level Programming

**Level:** Advanced  
**Prerequisites:**
- Phase 14: Generics Fundamentals
- Phase 15: Generic Constraints and `keyof`
- Phase 16: Conditional Types and `infer`
- Phase 17: Mapped Types
- Phase 18: Advanced Type Manipulation

## Learning Objectives

By the end of this phase, you will understand:

1. What type-level programming is.
2. What recursive types are.
3. Recursive type aliases.
4. Recursive object types.
5. Recursive JSON types.
6. Recursive array and tuple types.
7. Recursive conditional types.
8. Recursive string manipulation.
9. Tuple manipulation at the type level.
10. Type-level arithmetic concepts.
11. Building advanced utility types.
12. Recursive type limitations.
13. TypeScript compiler recursion limits.
14. Practical recursive type patterns.

---

# 1. What Is Type-Level Programming?

In TypeScript, we normally write code that operates on JavaScript values.

For example:

```typescript
function add(a: number, b: number): number {
    return a + b;
}

const result = add(10, 20);
```

Here:

- `a` and `b` are runtime values.
- `add()` executes at runtime.
- `result` contains the actual result.

But TypeScript also allows us to write logic that operates on types.

This is called **type-level programming**.

Instead of manipulating runtime values, we manipulate TypeScript types.

### Example: Runtime programming

```typescript
function getArrayLength(arr: unknown[]): number {
    return arr.length;
}

console.log(getArrayLength([10, 20, 30]));
```

Output:

```text
3
```

### Example: Type-level programming

```typescript
type ArrayLength<T extends readonly unknown[]> = T["length"];

type Result = ArrayLength<[string, number, boolean]>;
```

Result:

```typescript
type Result = 3;
```

Notice the difference:

| Runtime programming | Type-level programming |
|---|---|
| Works with values | Works with types |
| Executes JavaScript | Evaluated by TypeScript |
| Produces runtime results | Produces types |
| Uses functions and statements | Uses generics, conditional types, mapped types, etc. |

**Important:** Type-level programming does not generate runtime JavaScript logic. Its purpose is to improve compile-time type safety and expressiveness.

---

# 2. What Are Recursive Types?

A recursive type is a type that references itself in its own definition.

You already know recursive functions in JavaScript.

### Recursive function example

```javascript
function countdown(number) {
    if (number <= 0) {
        return;
    }

    console.log(number);

    countdown(number - 1);
}

countdown(5);
```

Output:

```text
5
4
3
2
1
```

The function calls itself.

Similarly, a recursive type refers to itself.

### Basic example

```typescript
type NestedNumber = number | NestedNumber[];
```

This type allows:

- A number.
- An array of numbers.
- An array containing other arrays of numbers.
- Arbitrarily nested arrays of numbers.

Usage:

```typescript
const value1: NestedNumber = 10;

const value2: NestedNumber = [10, 20, 30];

const value3: NestedNumber = [
    10,
    [20, 30],
    [[40, 50]]
];
```

All are valid.

But this is invalid:

```typescript
const value4: NestedNumber = [
    10,
    "Hello"
];
```

Because strings are not included in the type.

### Visual representation

```text
NestedNumber
    |
    |-- number
    |
    |-- NestedNumber[]
            |
            |-- number
            |
            |-- NestedNumber[]
                    |
                    |-- number
                    |
                    |-- ...
```

The type can continue nesting recursively.

---

# 3. Recursive Object Types

Recursive object types are useful when an object can contain other objects of the same structure.

### Example: Employee hierarchy

Suppose an employee can have multiple subordinates.

```typescript
type Employee = {
    id: number;
    name: string;
    subordinates: Employee[];
};
```

Here, `Employee` contains an array of `Employee`.

Usage:

```typescript
const company: Employee = {
    id: 1,
    name: "CEO",
    subordinates: [
        {
            id: 2,
            name: "Manager",
            subordinates: [
                {
                    id: 3,
                    name: "Developer",
                    subordinates: []
                }
            ]
        }
    ]
};
```

This structure can represent an arbitrarily deep hierarchy.

### Another example: Categories

```typescript
type Category = {
    id: number;
    name: string;
    children: Category[];
};
```

Usage:

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

### Real-world use cases

Recursive object types are useful for:

- Organization hierarchies.
- Category trees.
- Comments and replies.
- File system directories.
- Nested menus.
- Tree data structures.
- Document structures.

---

# 4. Recursive JSON Types

JSON supports nested objects and arrays.

Consider:

```json
{
    "name": "Riyaz",
    "age": 25,
    "active": true,
    "skills": ["JavaScript", "TypeScript"],
    "address": {
        "city": "Ahmedabad",
        "country": "India"
    }
}
```

JSON values can contain:

- Strings.
- Numbers.
- Booleans.
- Null.
- Arrays of JSON values.
- Objects containing JSON values.

We can represent this structure using a recursive type.

### Implementation

```typescript
type JsonPrimitive =
    | string
    | number
    | boolean
    | null;

type JsonValue =
    | JsonPrimitive
    | JsonValue[]
    | { [key: string]: JsonValue };
```

### Understanding the implementation

First:

```typescript
type JsonPrimitive =
    | string
    | number
    | boolean
    | null;
```

This represents primitive JSON values.

Then:

```typescript
type JsonValue =
    | JsonPrimitive
    | JsonValue[]
    | { [key: string]: JsonValue };
```

This allows:

1. A primitive JSON value.
2. An array containing JSON values.
3. An object whose properties contain JSON values.

### Usage

```typescript
const data: JsonValue = {
    name: "Riyaz",
    age: 25,
    active: true,
    skills: [
        "JavaScript",
        "TypeScript"
    ],
    address: {
        city: "Ahmedabad",
        country: "India"
    }
};
```

This is valid.

### Invalid example

```typescript
const invalidData: JsonValue = {
    name: "Riyaz",
    createdAt: new Date()
};
```

A `Date` object is not one of the JSON value types.

**Important:** This type describes values that can be represented as JSON. It does not guarantee that an object can always be serialized successfully. For example, JSON serialization has special behavior for `undefined`, functions, circular references, and other JavaScript values.

---

# 5. Recursive Types for File Systems

A file system contains directories and files.

A directory can contain:

- Files.
- Other directories.

This is naturally represented using recursive types.

### Implementation

```typescript
type File = {
    type: "file";
    name: string;
    size: number;
};

type Directory = {
    type: "directory";
    name: string;
    children: FileSystemItem[];
};

type FileSystemItem = File | Directory;
```

Notice:

```typescript
children: FileSystemItem[];
```

A directory can contain another directory or a file.

### Usage

```typescript
const root: Directory = {
    type: "directory",
    name: "root",
    children: [
        {
            type: "file",
            name: "index.html",
            size: 1200
        },
        {
            type: "directory",
            name: "src",
            children: [
                {
                    type: "file",
                    name: "app.ts",
                    size: 2500
                },
                {
                    type: "file",
                    name: "utils.ts",
                    size: 1800
                }
            ]
        }
    ]
};
```

### Type narrowing

Because `FileSystemItem` is a union, we can use its discriminant property.

```typescript
function displayItem(item: FileSystemItem): void {
    if (item.type === "file") {
        console.log(item.name, item.size);
    } else {
        console.log(item.name, item.children);
    }
}
```

This combines recursive types with discriminated unions.

---

# 6. Recursive Conditional Types

So far, we have used recursive type aliases.

Now let's explore recursive conditional types.

A recursive conditional type is a conditional type that refers to itself inside one of its branches.

### Example: Deeply unwrap arrays

Suppose you have:

```typescript
type Data = string[][][];
```

You want to extract the innermost element type.

Expected:

```typescript
type Result = string;
```

### Implementation

```typescript
type DeepArrayElement<T> =
    T extends readonly (infer U)[]
        ? DeepArrayElement<U>
        : T;
```

Usage:

```typescript
type A = DeepArrayElement<string[]>;

type B = DeepArrayElement<number[][]>;

type C = DeepArrayElement<boolean[][][]>;
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
type Result = DeepArrayElement<string[][][]>;
```

**Step 1:**

```typescript
string[][][] extends readonly (infer U)[]
```

Yes.

Therefore:

```typescript
U = string[][]
```

The type becomes:

```typescript
DeepArrayElement<string[][]>
```

**Step 2:**

Extract again:

```typescript
DeepArrayElement<string[]>
```

**Step 3:**

Extract again:

```typescript
DeepArrayElement<string>
```

**Step 4:**

`string` is not an array.

Return:

```typescript
string
```

This is recursive type computation.

---

# 7. Recursive Conditional Types with Nested Promises

You learned Promise extraction in Phase 16.

Let's revisit it using recursive conditional types.

Consider:

```typescript
type Result = Promise<
    Promise<
        Promise<string>
    >
>;
```

You want:

```typescript
type FinalResult = string;
```

### Implementation

```typescript
type DeepUnwrapPromise<T> =
    T extends PromiseLike<infer U>
        ? DeepUnwrapPromise<U>
        : T;
```

Usage:

```typescript
type A = DeepUnwrapPromise<Promise<string>>;

type B = DeepUnwrapPromise<Promise<Promise<number>>>;

type C = DeepUnwrapPromise<
    Promise<Promise<Promise<boolean>>>
>;
```

Results:

```typescript
type A = string;

type B = number;

type C = boolean;
```

### Why use `PromiseLike`?

`PromiseLike<T>` represents an object that has a Promise-compatible `then()` method.

This makes the utility work with Promise-compatible types, not only the built-in `Promise<T>` type.

### Built-in alternative

TypeScript already provides:

```typescript
type Result = Awaited<
    Promise<Promise<string>>
>;
```

Result:

```typescript
type Result = string;
```

Prefer `Awaited<T>` for ordinary Promise unwrapping.

---

# 8. Recursive String Manipulation

TypeScript template literal types allow us to process strings at the type level.

By combining them with recursive conditional types, we can create advanced string utilities.

### Example 1: Extract the first character

```typescript
type FirstCharacter<T extends string> =
    T extends `${infer First}${infer Rest}`
        ? First
        : never;
```

Usage:

```typescript
type Result1 = FirstCharacter<"Hello">;

type Result2 = FirstCharacter<"TypeScript">;
```

Results:

```typescript
type Result1 = "H";

type Result2 = "T";
```

### Understanding the pattern

```typescript
T extends `${infer First}${infer Rest}`
```

TypeScript attempts to divide the string into:

- `First`: First character.
- `Rest`: Remaining string.

### Example 2: Remove the first character

```typescript
type RemoveFirstCharacter<T extends string> =
    T extends `${infer First}${infer Rest}`
        ? Rest
        : "";
```

Usage:

```typescript
type Result = RemoveFirstCharacter<"Hello">;
```

Result:

```typescript
type Result = "ello";
```

### Example 3: Extract the last character

```typescript
type LastCharacter<T extends string> =
    T extends `${infer Rest}${infer Last}`
        ? Last
        : never;
```

Usage:

```typescript
type Result = LastCharacter<"Hello">;
```

Result:

```typescript
type Result = "o";
```

### Important clarification

These patterns operate on string literal types.

For a broad type such as:

```typescript
type Value = string;
```

TypeScript does not know the actual characters, so it cannot extract a specific first or last character.

---

# 9. Recursive String Utilities

Now let's build more useful recursive string transformations.

## A. Reverse a String

Suppose:

```typescript
type Input = "hello";
```

Expected:

```typescript
type Result = "olleh";
```

### Implementation

```typescript
type ReverseString<
    T extends string,
    Result extends string = ""
> =
    T extends `${infer First}${infer Rest}`
        ? ReverseString<Rest, `${First}${Result}`>
        : Result;
```

Usage:

```typescript
type Result = ReverseString<"hello">;
```

Result:

```typescript
type Result = "olleh";
```

### How does it work?

The generic parameter `Result` stores the reversed string being constructed.

| Iteration | First | Rest | Result |
|---|---|---|---|
| 1 | `h` | `ello` | `h` |
| 2 | `e` | `llo` | `eh` |
| 3 | `l` | `lo` | `leh` |
| 4 | `l` | `o` | `lleh` |
| 5 | `o` | `""` | `olleh` |

This is a type-level accumulator.

## B. Remove a Specific Character

Suppose you want to remove all occurrences of `"a"`.

Input:

```typescript
type Input = "banana";
```

Expected:

```typescript
type Result = "bnn";
```

### Implementation

```typescript
type RemoveCharacter<
    T extends string,
    Character extends string
> =
    T extends `${infer First}${infer Rest}`
        ? First extends Character
            ? RemoveCharacter<Rest, Character>
            : `${First}${RemoveCharacter<Rest, Character>}`
        : "";
```

Usage:

```typescript
type Result = RemoveCharacter<"banana", "a">;
```

Result:

```typescript
type Result = "bnn";
```

## C. Replace a Character

Suppose you want to replace every occurrence of `"a"` with `"x"`.

### Implementation

```typescript
type ReplaceCharacter<
    T extends string,
    From extends string,
    To extends string
> =
    T extends `${infer First}${infer Rest}`
        ? First extends From
            ? `${To}${ReplaceCharacter<Rest, From, To>}`
            : `${First}${ReplaceCharacter<Rest, From, To>}`
        : "";
```

Usage:

```typescript
type Result = ReplaceCharacter<"banana", "a", "x">;
```

Result:

```typescript
type Result = "bxnxnx";
```

**Note:** These are educational examples. Type-level string splitting and inference can have limitations with broad strings, Unicode characters, and complex template literal patterns.

---

# 10. Recursive Tuple Manipulation

Tuples are ordered collections of types.

Because they preserve their length and individual element types, they are useful for type-level programming.

Consider:

```typescript
type UserData = [
    string,
    number,
    boolean
];
```

We can recursively manipulate tuple elements.

## A. Get the First Element

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
type Result = string;
```

## B. Get the Last Element

```typescript
type Last<T extends readonly unknown[]> =
    T extends readonly [...unknown[], infer L]
        ? L
        : never;
```

Usage:

```typescript
type Result = Last<[string, number, boolean]>;
```

Result:

```typescript
type Result = boolean;
```

## C. Remove the First Element

```typescript
type Tail<T extends readonly unknown[]> =
    T extends readonly [unknown, ...infer Rest]
        ? Rest
        : [];
```

Usage:

```typescript
type Result = Tail<[string, number, boolean]>;
```

Result:

```typescript
type Result = [number, boolean];
```

## D. Remove the Last Element

```typescript
type Init<T extends readonly unknown[]> =
    T extends readonly [...infer Rest, unknown]
        ? Rest
        : [];
```

Usage:

```typescript
type Result = Init<[string, number, boolean]>;
```

Result:

```typescript
type Result = [string, number];
```

## E. Reverse a Tuple

```typescript
type ReverseTuple<
    T extends readonly unknown[],
    Result extends unknown[] = []
> =
    T extends readonly [infer First, ...infer Rest]
        ? ReverseTuple<Rest, [First, ...Result]>
        : Result;
```

Usage:

```typescript
type Result = ReverseTuple<
    [string, number, boolean]
>;
```

Result:

```typescript
type Result = [boolean, number, string];
```

Notice that this implementation returns a mutable tuple even if the input is readonly.

If you want to preserve readonly output, you can use:

```typescript
type ReverseReadonlyTuple<
    T extends readonly unknown[],
    Result extends unknown[] = []
> =
    T extends readonly [infer First, ...infer Rest]
        ? ReverseReadonlyTuple<Rest, [First, ...Result]>
        : Readonly<Result>;
```

---

# 11. Type-Level Arithmetic Concepts

TypeScript does not provide general-purpose arithmetic operators for numeric literal types.

For example, you cannot directly write:

```typescript
type Result = 10 + 20;
```

This is not valid TypeScript type syntax.

However, we can perform limited arithmetic using tuples.

The idea is:

**Represent a number by the length of a tuple.**

### Example: Create a tuple of a specific length

```typescript
type BuildTuple<
    Length extends number,
    Result extends unknown[] = []
> =
    Result["length"] extends Length
        ? Result
        : BuildTuple<Length, [...Result, unknown]>;
```

Usage:

```typescript
type A = BuildTuple<3>;

type B = BuildTuple<5>;
```

Conceptual results:

```typescript
type A = [unknown, unknown, unknown];

type B = [
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
];
```

The length of the tuple represents the number.

### Example: Add two numbers

```typescript
type Add<
    A extends number,
    B extends number
> = [
    ...BuildTuple<A>,
    ...BuildTuple<B>
]["length"];
```

Usage:

```typescript
type Result = Add<3, 4>;
```

Result:

```typescript
type Result = 7;
```

### How does it work?

First:

```typescript
BuildTuple<3>
```

Produces:

```typescript
[unknown, unknown, unknown]
```

Second:

```typescript
BuildTuple<4>
```

Produces:

```typescript
[unknown, unknown, unknown, unknown]
```

Combine them:

```typescript
[
    ...BuildTuple<3>,
    ...BuildTuple<4>
]
```

Produces a tuple with seven elements.

Finally:

```typescript
["length"]
```

Extracts:

```typescript
7
```

### Important limitation

This approach works best with small non-negative integer literal types.

It does not directly support arbitrary numbers, negative numbers, decimals, or broad `number` types.

Large tuple computations can also become expensive for the TypeScript compiler.

---

# 12. Type-Level Subtraction

We can also implement subtraction using tuple manipulation.

The idea:

1. Create a tuple representing the first number.
2. Remove a number of elements equal to the second number.
3. Return the remaining tuple length.

### Implementation

```typescript
type Subtract<
    A extends number,
    B extends number
> =
    BuildTuple<A> extends [
        ...BuildTuple<B>,
        ...infer Rest
    ]
        ? Rest["length"]
        : never;
```

Usage:

```typescript
type A = Subtract<7, 3>;

type B = Subtract<10, 5>;
```

Results:

```typescript
type A = 4;

type B = 5;
```

What happens if the second number is greater than the first?

```typescript
type Result = Subtract<3, 5>;
```

Result:

```typescript
type Result = never;
```

Our utility does not support negative results.

This is intentional.

---

# 13. Type-Level Comparison

We can use tuples to compare small non-negative integer literal types.

### Example: Less Than or Equal

```typescript
type LessThanOrEqual<
    A extends number,
    B extends number
> =
    BuildTuple<B> extends [
        ...BuildTuple<A>,
        ...unknown[]
    ]
        ? true
        : false;
```

Usage:

```typescript
type A = LessThanOrEqual<3, 5>;

type B = LessThanOrEqual<5, 3>;

type C = LessThanOrEqual<5, 5>;
```

Results:

```typescript
type A = true;

type B = false;

type C = true;
```

### Explanation

Consider:

```typescript
type Result = LessThanOrEqual<3, 5>;
```

TypeScript checks whether a tuple of length 5 can be divided into:

- A tuple of length 3.
- Another tuple containing the remaining elements.

Since this is possible, the result is `true`.

**Important:** These examples are demonstrations of type-level computation, not recommended replacements for runtime arithmetic.

---

# 14. Recursive Type for Nested Object Paths

This is one of the most useful practical applications of recursive type programming.

Suppose you have:

```typescript
type User = {
    id: number;
    name: string;
    profile: {
        email: string;
        address: {
            city: string;
            country: string;
        };
    };
};
```

You want to generate all possible nested property paths.

Expected:

```typescript
"id"
"name"
"profile"
"profile.email"
"profile.address"
"profile.address.city"
"profile.address.country"
```

### Implementation

```typescript
type Paths<T> = {
    [Key in keyof T & string]:
        T[Key] extends object
            ? Key | `${Key}.${Paths<T[Key]>}`
            : Key;
}[keyof T & string];
```

Usage:

```typescript
type UserPaths = Paths<User>;
```

Result:

```typescript
type UserPaths =
    | "id"
    | "name"
    | "profile"
    | "profile.email"
    | "profile.address"
    | "profile.address.city"
    | "profile.address.country";
```

### Understanding the implementation

Consider:

```typescript
T[Key] extends object
```

If the property is an object, recursively extract its nested paths.

Otherwise, return the property name.

This part:

```typescript
`${Key}.${Paths<T[Key]>}`
```

Combines the parent property with nested property paths.

Finally:

```typescript
[keyof T & string]
```

Extracts the generated mapped property values into a union.

### Important limitation

This simplified utility assumes ordinary nested objects.

It does not specially handle arrays, tuples, functions, dates, or circular class structures.

Production-grade path utilities generally need explicit handling for these cases.

---

# 15. Creating a Type-Safe Nested Property Accessor

Now let's use the nested paths concept to build a type-safe property accessor.

We want a function like:

```typescript
getValue(user, "profile.address.city");
```

And TypeScript should infer that the result is a string.

### Step 1: Define the object

```typescript
type User = {
    id: number;
    name: string;
    profile: {
        email: string;
        address: {
            city: string;
            country: string;
        };
    };
};
```

### Step 2: Define nested paths

```typescript
type Paths<T> = {
    [Key in keyof T & string]:
        T[Key] extends object
            ? Key | `${Key}.${Paths<T[Key]>}`
            : Key;
}[keyof T & string];
```

### Step 3: Create a path value extractor

```typescript
type PathValue<T, P extends string> =
    P extends `${infer Key}.${infer Rest}`
        ? Key extends keyof T
            ? PathValue<T[Key], Rest>
            : never
        : P extends keyof T
            ? T[P]
            : never;
```

### Step 4: Test the utility

```typescript
type City = PathValue<
    User,
    "profile.address.city"
>;

type Email = PathValue<
    User,
    "profile.email"
>;

type Id = PathValue<
    User,
    "id"
>;
```

Results:

```typescript
type City = string;

type Email = string;

type Id = number;
```

### How does `PathValue` work?

Consider:

```typescript
type City = PathValue<
    User,
    "profile.address.city"
>;
```

First, TypeScript splits:

```text
profile.address.city
```

Into:

```text
Key = "profile"
Rest = "address.city"
```

It extracts:

```typescript
User["profile"]
```

Then recursively processes:

```typescript
PathValue<User["profile"], "address.city">
```

Next:

```typescript
Key = "address"
Rest = "city"
```

Then:

```typescript
PathValue<User["profile"]["address"], "city">
```

Finally:

```typescript
User["profile"]["address"]["city"]
```

Result:

```typescript
string
```

### Important note

This is a type-level path extractor, not a complete runtime accessor.

A production implementation must also handle invalid paths, optional properties, arrays, and runtime checks.

---

# 16. Understanding Recursive Type Limitations

Recursive types are powerful, but they have limitations.

### A. Excessive recursion

Consider a recursive type that keeps expanding indefinitely.

```typescript
type Infinite<T> = {
    value: Infinite<T>;
};
```

This describes a recursively nested structure.

Recursive structures are not automatically invalid, but operations that attempt to fully expand an infinitely growing type can become problematic.

### B. Type instantiation depth

TypeScript limits how deeply it instantiates types to protect compiler performance.

For example, deeply recursive conditional types may eventually produce an error similar to:

```text
Type instantiation is excessively deep and possibly infinite.
```

The exact limits and compiler behavior depend on the TypeScript version and the complexity of the type.

### C. Compiler performance

Complex type-level computations can make:

- Type checking slower.
- Editor autocomplete less responsive.
- Error messages harder to understand.
- Builds slower.

### D. Avoid unnecessary recursion

For example, if you only need to make top-level properties optional, use:

```typescript
type Result = Partial<User>;
```

Do not implement a complicated recursive utility unnecessarily.

### Best practices

1. Keep recursive types simple.
2. Use clear termination conditions.
3. Avoid unnecessary nested conditional types.
4. Prefer built-in utility types when possible.
5. Test recursive utilities with edge cases.
6. Avoid excessive type-level arithmetic.
7. Consider compile-time performance when designing library APIs.

---

# 17. Advanced Practical Example: Nested API Response

Suppose an API returns deeply nested data.

```typescript
type ApiResponse = {
    success: boolean;
    data: {
        user: {
            id: number;
            name: string;
            profile: {
                email: string;
                address: {
                    city: string;
                    country: string;
                };
            };
        };
        permissions: string[];
    };
};
```

We can use recursive utilities to extract nested paths.

```typescript
type ResponsePaths = Paths<ApiResponse>;
```

Examples of generated paths:

```typescript
"success"
"data"
"data.user"
"data.user.id"
"data.user.name"
"data.user.profile.email"
"data.user.profile.address.city"
"data.permissions"
```

Now extract a particular property's type:

```typescript
type City = PathValue<
    ApiResponse,
    "data.user.profile.address.city"
>;
```

Result:

```typescript
type City = string;
```

This technique is useful in:

- Form libraries.
- API clients.
- State management libraries.
- Nested configuration systems.
- Type-safe object access utilities.

---

# 18. Advanced Practical Example: Recursive Menu Structure

Let's create a menu system.

Each menu item can have:

- A title.
- A URL.
- Optional child items.

### Type definition

```typescript
type MenuItem = {
    title: string;
    url: string;
    children?: MenuItem[];
};
```

### Usage

```typescript
const menu: MenuItem[] = [
    {
        title: "Home",
        url: "/"
    },
    {
        title: "Products",
        url: "/products",
        children: [
            {
                title: "Laptops",
                url: "/products/laptops"
            },
            {
                title: "Mobiles",
                url: "/products/mobiles",
                children: [
                    {
                        title: "Android",
                        url: "/products/mobiles/android"
                    },
                    {
                        title: "iPhone",
                        url: "/products/mobiles/iphone"
                    }
                ]
            }
        ]
    }
];
```

### Recursive function

You can process this structure using a recursive function.

```typescript
function displayMenu(items: MenuItem[]): void {
    for (const item of items) {
        console.log(item.title);

        if (item.children) {
            displayMenu(item.children);
        }
    }
}
```

This example demonstrates the relationship between recursive types and recursive runtime functions.

Remember:

- The recursive type defines the allowed structure.
- The recursive function processes actual values.

They are related concepts, but they operate at different levels.

---

# 19. Common Mistakes

### Mistake 1: Confusing recursive types with recursive functions

Recursive types describe nested type structures.

Recursive functions execute repeatedly at runtime.

### Mistake 2: Forgetting the base case

A recursive conditional type needs a condition that eventually stops recursion.

Example:

```typescript
type DeepArrayElement<T> =
    T extends readonly (infer U)[]
        ? DeepArrayElement<U>
        : T;
```

When `T` is no longer an array, recursion stops.

### Mistake 3: Using recursive types for simple transformations

Use built-in utilities when possible.

For example:

```typescript
type OptionalUser = Partial<User>;
```

Instead of writing a custom utility unnecessarily.

### Mistake 4: Assuming TypeScript supports normal arithmetic in type declarations

This is invalid:

```typescript
type Result = 10 + 20;
```

Tuple-based techniques can implement limited arithmetic.

### Mistake 5: Forgetting arrays are objects

Recursive object transformations should usually handle arrays and tuples explicitly.

### Mistake 6: Ignoring compiler performance

Extremely complex recursive types can make TypeScript compilation slow.

### Mistake 7: Assuming recursive types validate runtime data

A recursive JSON type does not automatically validate incoming JSON.

Runtime validation still requires actual JavaScript checks or a validation library.

---

# 20. Interview Questions and Answers

### Q1. What is type-level programming?

Type-level programming is the process of creating and transforming types using TypeScript's type system rather than manipulating runtime values.

### Q2. What are recursive types?

Recursive types are types that reference themselves in their own definitions.

They are useful for representing nested and hierarchical data.

### Q3. Give an example of a recursive type.

```typescript
type NestedNumber = number | NestedNumber[];
```

### Q4. What is a recursive conditional type?

A conditional type that references itself in one of its branches.

### Q5. What is the purpose of `infer` in recursive conditional types?

It extracts a type from a structure so that the extracted type can be processed recursively.

### Q6. How can you represent JSON values using TypeScript?

```typescript
type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonValue[]
    | { [key: string]: JsonValue };
```

### Q7. How can you reverse a tuple using TypeScript?

Use recursive conditional types and tuple inference.

### Q8. Can TypeScript perform arithmetic on numeric literal types?

Not directly using ordinary arithmetic operators. Limited arithmetic can be implemented using tuple manipulation.

### Q9. What is `BuildTuple`?

It is a recursive utility that creates a tuple containing a specified number of elements.

It can be used for tuple-length-based type-level computations.

### Q10. What happens when recursive types become too complex?

The TypeScript compiler may produce a type-instantiation-depth error or experience slower type checking.

### Q11. What is the difference between recursive types and recursive mapped types?

Recursive types describe structures that refer to themselves.

Recursive mapped types transform properties recursively through nested structures.

### Q12. What are template literal types used for in recursive string manipulation?

They allow us to split, extract, and reconstruct string literal types.

### Q13. Can recursive types represent file systems?

Yes. A directory can contain files and other directories, so recursive types are a natural fit.

### Q14. Are recursive type transformations executed at runtime?

No. They are evaluated during TypeScript's type checking.

### Q15. What is the difference between `Awaited<T>` and a custom recursive Promise utility?

Both can unwrap Promise-like values, but `Awaited<T>` is TypeScript's built-in utility and should generally be preferred.

---

# 21. Practical Exercises

Try to implement these utilities independently.

## Exercise 1: Nested Number

Create a recursive type that accepts:

- Numbers.
- Arrays of numbers.
- Nested arrays of numbers.

Expected:

```typescript
type A = NestedNumber;

const value1: A = 10;

const value2: A = [10, 20];

const value3: A = [10, [20, [30]]];
```

## Exercise 2: Recursive JSON

Create a recursive type that represents valid JSON values.

## Exercise 3: Employee Hierarchy

Create an employee type where every employee can have multiple subordinates.

## Exercise 4: DeepArrayElement

Create a utility that extracts the innermost element type of nested arrays.

Expected:

```typescript
type Result = DeepArrayElement<string[][][]>;

// string
```

## Exercise 5: DeepUnwrapPromise

Create a utility that recursively extracts nested Promise values.

Expected:

```typescript
type Result = DeepUnwrapPromise<
    Promise<Promise<Promise<number>>>
>;

// number
```

## Exercise 6: ReverseString

Create a utility that reverses a string literal type.

Expected:

```typescript
type Result = ReverseString<"hello">;

// "olleh"
```

## Exercise 7: RemoveCharacter

Create a utility that removes all occurrences of a character.

Expected:

```typescript
type Result = RemoveCharacter<"banana", "a">;

// "bnn"
```

## Exercise 8: ReverseTuple

Create a utility that reverses tuple elements.

Expected:

```typescript
type Result = ReverseTuple<
    [string, number, boolean]
>;

// [boolean, number, string]
```

## Exercise 9: BuildTuple

Create a utility that builds a tuple of a specified length.

Expected:

```typescript
type Result = BuildTuple<5>;

// A tuple containing five elements
```

## Exercise 10: Add

Implement type-level addition.

Expected:

```typescript
type Result = Add<3, 4>;

// 7
```

## Exercise 11: Extract Nested Paths

Given:

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

Create a utility that generates all nested property paths.

Expected to include:

```typescript
"id"
"profile"
"profile.name"
"profile.address"
"profile.address.city"
```

## Exercise 12: PathValue

Create a utility that extracts the type of a nested property using a dot-separated path.

Expected:

```typescript
type Result = PathValue<
    User,
    "profile.address.city"
>;

// string
```

---

# 22. Phase 19 Completion Checklist

| No. | Topic | Status |
|---|---|---|
| 1 | Type-level programming | ☐ |
| 2 | Recursive type aliases | ☐ |
| 3 | Recursive object types | ☐ |
| 4 | Recursive JSON types | ☐ |
| 5 | Recursive file system types | ☐ |
| 6 | Recursive conditional types | ☐ |
| 7 | Recursive array extraction | ☐ |
| 8 | Recursive Promise extraction | ☐ |
| 9 | Recursive string manipulation | ☐ |
| 10 | String reversal | ☐ |
| 11 | Character removal | ☐ |
| 12 | Tuple manipulation | ☐ |
| 13 | Tuple reversal | ☐ |
| 14 | Type-level arithmetic | ☐ |
| 15 | BuildTuple | ☐ |
| 16 | Type-level comparison | ☐ |
| 17 | Nested object paths | ☐ |
| 18 | PathValue | ☐ |
| 19 | Recursive type limitations | ☐ |
| 20 | Compiler performance considerations | ☐ |

---

# What Comes Next?

## Phase 20: Advanced TypeScript – Function Overloads, Advanced Function Types, and Variadic Tuples

In the next phase, we will explore advanced function typing in TypeScript.

Topics will include:

1. Function overloads in depth.
2. Overload signatures vs implementation signatures.
3. Function compatibility.
4. Function parameter variance.
5. Return type compatibility.
6. Generic function overloads.
7. Arrow functions and overload limitations.
8. Variadic tuple types.
9. Rest parameters with tuples.
10. Higher-order functions.
11. Typed function composition.
12. Advanced callback typing.
13. Function parameter extraction.
14. Practical function utility types.

**Phase 19 complete.** Say **"OK, Phase 20"** when you're ready to continue.