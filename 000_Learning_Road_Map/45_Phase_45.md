# Phase 45: Advanced TypeScript – Advanced Type System, Type-Level Programming and Compiler-Level Type Manipulation

**Level:** Expert  
**Prerequisites:** TypeScript fundamentals, interfaces, types, generics, union and intersection types, mapped types, conditional types, functions, and modules.

---

# 1. Learning Objectives

In this phase, you will learn how to use TypeScript's advanced type system to build reusable, highly flexible, and type-safe applications.

By the end of this phase, you should understand:

1. Advanced Type System Fundamentals.
2. Type-Level Programming.
3. Advanced Generics.
4. Generic Constraints.
5. Conditional Types.
6. Nested Conditional Types.
7. Distributive Conditional Types.
8. The `infer` Keyword.
9. Advanced Mapped Types.
10. Key Remapping in Mapped Types.
11. Template Literal Types.
12. Recursive Types.
13. Recursive Conditional Types.
14. Variadic Tuple Types.
15. Advanced Tuple Manipulation.
16. Function Overloading.
17. Advanced Function Types.
18. Higher-Order Functions.
19. Generic Function Composition.
20. Advanced Utility Types.
21. Building Custom Utility Types.
22. Type-Level String Manipulation.
23. Type-Level Number Manipulation.
24. Type-Level Object Manipulation.
25. Type-Level Validation.
26. Branded Types.
27. Nominal Typing Techniques.
28. Type-Safe Event Systems.
29. Type-Safe API Contracts.
30. Advanced Type Inference.
31. TypeScript Compiler Type Resolution.
32. Type-Level Programming Projects.

---

# 2. Deep Understanding of the TypeScript Type System

Before learning advanced type manipulation, you need to understand how TypeScript's type system works.

## 2.1 Structural Typing

TypeScript primarily uses a structural type system.

This means TypeScript checks the structure of an object rather than its declared name.

Example:

```ts
type User = {
    name: string;
    age: number;
};

type Employee = {
    name: string;
    age: number;
};

const user: User = {
    name: "John",
    age: 25
};

const employee: Employee = user;
```

This is valid because both types have compatible structures.

Even though `User` and `Employee` are different type names, their structures match.

**Important:** TypeScript does not generally require two types to have the same name. It checks whether their structures are compatible.

## 2.2 Structural Typing with Extra Properties

Consider:

```ts
type User = {
    name: string;
};

const employee = {
    name: "John",
    salary: 50000
};

const user: User = employee;
```

This is valid.

Why?

Because `employee` contains all the properties required by `User`.

However:

```ts
const user: User = {
    name: "John",
    salary: 50000
};
```

This produces an error because TypeScript performs an additional check on fresh object literals called **excess property checking**.

This is an important distinction.

Excess property checking is not the same as enforcing exact object types everywhere.

## 2.3 Understanding `any`, `unknown`, and `never`

These are three important types.

| Type | Meaning | Behavior |
|---|---|---|
| `any` | Disables normal type checking | Can be assigned to and accessed freely |
| `unknown` | Value of an unknown type | Must be narrowed before most operations |
| `never` | Impossible value | Represents something that cannot occur |

### `any`

```ts
let value: any = "Hello";

value.toUpperCase();

value = 100;

value = true;
```

TypeScript allows almost anything with `any`.

This is why excessive use of `any` reduces type safety.

### `unknown`

```ts
let value: unknown = "Hello";
```

This is not allowed:

```ts
// Error
value.toUpperCase();
```

You must narrow the type first:

```ts
if (typeof value === "string") {
    console.log(value.toUpperCase());
}
```

`unknown` is generally preferable to `any` when the actual type is not known.

### `never`

`never` represents a value that cannot exist.

Example:

```ts
function throwError(message: string): never {
    throw new Error(message);
}
```

Another example:

```ts
type Status = "success" | "error";

function handleStatus(status: Status) {
    if (status === "success") {
        console.log("Completed");
    } else if (status === "error") {
        console.log("Failed");
    } else {
        const impossible: never = status;
    }
}
```

If another status is added later, TypeScript can detect that the function does not handle every case.

This is called **exhaustive checking**.

## 2.4 Understanding `void`, `object`, and `{}`

| Type | Meaning |
|---|---|
| `void` | Usually indicates that a function does not return a useful value |
| `object` | Any non-primitive value |
| `{}` | Any non-nullish value, including primitives |

Example:

```ts
let a: object;

a = {};
a = [];
a = new Date();

// Error
// a = "hello";
```

But:

```ts
let b: {};

b = "hello";
b = 100;
b = true;
b = {};
```

The `{}` type does not mean an empty object.

For keys, TypeScript also provides:

```ts
type Key = PropertyKey;
```

`PropertyKey` represents:

```ts
string | number | symbol
```

---

# 3. Type-Level Programming

Type-level programming means writing TypeScript types that transform, calculate, or derive other types.

Normal JavaScript executes at runtime.

Type-level TypeScript operations are evaluated during compilation and type checking.

Consider:

```ts
type User = {
    id: number;
    name: string;
    email: string;
};
```

We can create another type from it:

```ts
type UserKeys = keyof User;
```

Result:

```ts
type UserKeys = "id" | "name" | "email";
```

We have performed a type-level transformation.

Another example:

```ts
type UserWithoutEmail = Omit<User, "email">;
```

Result:

```ts
type UserWithoutEmail = {
    id: number;
    name: string;
};
```

### Type-Level vs Runtime Programming

| Type-Level Programming | Runtime Programming |
|---|---|
| Works with types | Works with values |
| Evaluated during type checking | Executed by JavaScript runtime |
| Does not directly execute JavaScript | Executes JavaScript |
| Erased from compiled JavaScript | Produces runtime behavior |

Example:

```ts
type IsString<T> = T extends string ? true : false;
```

This is type-level programming.

You cannot use it to inspect an actual runtime value.

**Important:** TypeScript types are erased during compilation. They do not automatically validate external data.

---

# 4. Advanced Generics

Generics allow us to create reusable types and functions that work with different data types.

You already know basic generics.

Now let's explore advanced generics.

## 4.1 Multiple Generic Parameters

```ts
function createPair<T, U>(first: T, second: U) {
    return {
        first,
        second
    };
}

const result = createPair<string, number>("Age", 25);
```

Inferred result:

```ts
{
    first: string;
    second: number;
}
```

You can also allow TypeScript to infer both types:

```ts
const result = createPair("Age", 25);
```

## 4.2 Generic Constraints

Sometimes you want to restrict which types a generic can accept.

Use `extends`.

```ts
function getLength<T extends { length: number }>(value: T): number {
    return value.length;
}
```

Valid:

```ts
getLength("Hello");

getLength([10, 20, 30]);

getLength({
    length: 100
});
```

Invalid:

```ts
// Error
getLength(100);
```

Why?

Because a number does not have a `length` property.

## 4.3 Generic Constraints with `keyof`

Consider:

```ts
function getProperty<T, K extends keyof T>(
    object: T,
    key: K
): T[K] {
    return object[key];
}
```

Usage:

```ts
const user = {
    id: 1,
    name: "John",
    age: 25
};

const name = getProperty(user, "name");
```

Inferred type:

```ts
string
```

Another example:

```ts
const age = getProperty(user, "age");
```

Inferred type:

```ts
number
```

Invalid:

```ts
// Error
getProperty(user, "email");
```

This technique is extremely useful for reusable libraries.

## 4.4 Generic Default Types

You can provide default types for generic parameters.

```ts
type ApiResponse<T = unknown> = {
    success: boolean;
    data: T;
};
```

Usage:

```ts
type User = {
    id: number;
    name: string;
};

const response1: ApiResponse<User> = {
    success: true,
    data: {
        id: 1,
        name: "John"
    }
};

const response2: ApiResponse = {
    success: true,
    data: "Some data"
};
```

When no generic argument is supplied, `T` defaults to `unknown`.

## 4.5 Generic Relationships

Generics are especially powerful when one parameter determines another parameter's type.

```ts
function identity<T>(value: T): T {
    return value;
}
```

The input and output types are connected.

```ts
const result = identity("Hello");
```

TypeScript understands:

```ts
// result: string
```

This relationship is more important than simply using generic syntax.

**Key concept:** A generic type parameter is useful when it establishes a relationship between multiple parts of a type or function signature.

---

# 5. Conditional Types

Conditional types allow you to select one type based on another type.

Syntax:

```ts
T extends U ? X : Y
```

Meaning:

- If `T` is assignable to `U`, use `X`.
- Otherwise, use `Y`.

## 5.1 Basic Conditional Type

```ts
type IsString<T> = T extends string ? true : false;
```

Usage:

```ts
type A = IsString<string>;
type B = IsString<number>;
```

Results:

```ts
type A = true;
type B = false;
```

## 5.2 Nested Conditional Types

You can use multiple conditions.

```ts
type DataType<T> =
    T extends string ? "String" :
    T extends number ? "Number" :
    T extends boolean ? "Boolean" :
    "Other";
```

Usage:

```ts
type A = DataType<string>;
type B = DataType<number>;
type C = DataType<boolean>;
type D = DataType<Date>;
```

Results:

```ts
type A = "String";
type B = "Number";
type C = "Boolean";
type D = "Other";
```

## 5.3 Conditional Types with Objects

```ts
type HasName<T> =
    T extends { name: string } ? true : false;
```

Usage:

```ts
type User = {
    name: string;
    age: number;
};

type Product = {
    title: string;
};

type A = HasName<User>;
type B = HasName<Product>;
```

Results:

```ts
type A = true;
type B = false;
```

## 5.4 Distributive Conditional Types

This is one of the most important advanced TypeScript concepts.

Consider:

```ts
type Filter<T> = T extends string ? T : never;
```

Now:

```ts
type Result = Filter<string | number | boolean>;
```

Result:

```ts
type Result = string;
```

Why?

Because conditional types distribute over unions when the checked type is a naked type parameter.

Conceptually, TypeScript evaluates:

```ts
Filter<string>
| Filter<number>
| Filter<boolean>
```

Which becomes:

```ts
string | never | never
```

Finally:

```ts
string
```

## 5.5 Understanding `never` in Conditional Types

Consider:

```ts
type ExcludeStrings<T> =
    T extends string ? never : T;
```

Usage:

```ts
type Result = ExcludeStrings<string | number | boolean>;
```

Result:

```ts
number | boolean
```

The `string` member becomes `never`, which disappears from the resulting union.

This is how TypeScript's built-in `Exclude` utility works.

## 5.6 Preventing Distribution

Sometimes you want to check the entire union rather than each member separately.

Use tuple wrapping:

```ts
type IsEntirelyString<T> =
    [T] extends [string] ? true : false;
```

Usage:

```ts
type A = IsEntirelyString<string>;

type B = IsEntirelyString<string | number>;
```

Results:

```ts
type A = true;
type B = false;
```

Compare:

```ts
type Distributed<T> =
    T extends string ? true : false;

type NotDistributed<T> =
    [T] extends [string] ? true : false;
```

| Type | Distributed | Not Distributed |
|---|---|---|
| `string` | `true` | `true` |
| `string \| number` | `true \| false` | `false` |
| `number \| boolean` | `false` | `false` |

**Interview point:** Distribution occurs when a conditional type checks a naked type parameter. Wrapping the parameter in a tuple prevents distribution.

---

# 6. The `infer` Keyword

The `infer` keyword allows TypeScript to extract a type from another type inside a conditional type.

It is commonly used for advanced type transformations.

## 6.1 Extracting a Function Return Type

```ts
type MyReturnType<T> =
    T extends (...args: any[]) => infer R
        ? R
        : never;
```

Usage:

```ts
function getUser() {
    return {
        id: 1,
        name: "John"
    };
}

type Result = MyReturnType<typeof getUser>;
```

Result:

```ts
{
    id: number;
    name: string;
}
```

Here:

```ts
infer R
```

captures the function's return type.

## 6.2 Extracting Function Parameters

```ts
type MyParameters<T> =
    T extends (...args: infer P) => any
        ? P
        : never;
```

Usage:

```ts
function createUser(
    name: string,
    age: number
) {
    return {
        name,
        age
    };
}

type Params = MyParameters<typeof createUser>;
```

Result:

```ts
[name: string, age: number]
```

## 6.3 Extracting Promise Values

```ts
type PromiseValue<T> =
    T extends Promise<infer U>
        ? U
        : T;
```

Usage:

```ts
type A = PromiseValue<Promise<string>>;
type B = PromiseValue<Promise<number>>;
type C = PromiseValue<boolean>;
```

Results:

```ts
type A = string;
type B = number;
type C = boolean;
```

## 6.4 Extracting Array Element Types

```ts
type ArrayElement<T> =
    T extends readonly (infer U)[]
        ? U
        : never;
```

Usage:

```ts
type A = ArrayElement<string[]>;
type B = ArrayElement<number[]>;
```

Results:

```ts
type A = string;
type B = number;
```

## 6.5 Extracting Tuple Elements

```ts
type FirstElement<T extends readonly unknown[]> =
    T extends readonly [infer First, ...unknown[]]
        ? First
        : never;
```

Usage:

```ts
type Result = FirstElement<[string, number, boolean]>;
```

Result:

```ts
string
```

You can also extract the remaining elements:

```ts
type Tail<T extends readonly unknown[]> =
    T extends readonly [unknown, ...infer Rest]
        ? Rest
        : [];
```

Usage:

```ts
type Result = Tail<[string, number, boolean]>;
```

Result:

```ts
[number, boolean]
```

**Important:** `infer` introduces a type variable inside the conditional type branch. It does not create a runtime variable.

---

# 7. Advanced Mapped Types

Mapped types allow you to create new types by iterating over the keys of an existing type.

Basic syntax:

```ts
type NewType<T> = {
    [K in keyof T]: T[K];
};
```

## 7.1 Making All Properties Optional

```ts
type MyPartial<T> = {
    [K in keyof T]?: T[K];
};
```

Usage:

```ts
type User = {
    id: number;
    name: string;
    email: string;
};

type OptionalUser = MyPartial<User>;
```

Result:

```ts
type OptionalUser = {
    id?: number;
    name?: string;
    email?: string;
};
```

## 7.2 Making All Properties Readonly

```ts
type MyReadonly<T> = {
    readonly [K in keyof T]: T[K];
};
```

## 7.3 Removing Optional Properties

```ts
type MyRequired<T> = {
    [K in keyof T]-?: T[K];
};
```

The `-?` removes optional modifiers.

## 7.4 Removing Readonly

```ts
type Mutable<T> = {
    -readonly [K in keyof T]: T[K];
};
```

The `-readonly` modifier removes readonly restrictions.

## 7.5 Mapping Only Selected Properties

```ts
type User = {
    id: number;
    name: string;
    email: string;
    age: number;
};

type UserDetails = {
    [K in "name" | "email"]: User[K];
};
```

Result:

```ts
type UserDetails = {
    name: string;
    email: string;
};
```

## 7.6 Key Remapping

Key remapping allows you to change property names while creating a new type.

Syntax:

```ts
type NewType<T> = {
    [K in keyof T as NewKey]: T[K];
};
```

Example:

```ts
type User = {
    name: string;
    age: number;
};
```

Create getters:

```ts
type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]:
        () => T[K];
};
```

Result:

```ts
type UserGetters = Getters<User>;
```

Equivalent to:

```ts
type UserGetters = {
    getName: () => string;
    getAge: () => number;
};
```

## 7.7 Filtering Properties Using `never`

You can remove properties by mapping their keys to `never`.

```ts
type RemoveStringProperties<T> = {
    [K in keyof T as T[K] extends string ? never : K]: T[K];
};
```

Usage:

```ts
type User = {
    id: number;
    name: string;
    age: number;
    email: string;
};

type Result = RemoveStringProperties<User>;
```

Result:

```ts
type Result = {
    id: number;
    age: number;
};
```

This is useful for creating filtered object types.

---

# 8. Template Literal Types

Template literal types allow you to create string types using template syntax.

They were introduced in TypeScript 4.1.

## 8.1 Basic Template Literal Types

```ts
type Greeting = `Hello ${string}`;
```

Valid:

```ts
const message1: Greeting = "Hello John";
const message2: Greeting = "Hello World";
```

Invalid:

```ts
// Error
const message3: Greeting = "Good morning";
```

## 8.2 Combining Union Types

```ts
type Size = "small" | "medium" | "large";

type ButtonClass = `btn-${Size}`;
```

Result:

```ts
type ButtonClass =
    | "btn-small"
    | "btn-medium"
    | "btn-large";
```

## 8.3 Creating Event Names

```ts
type UserEvent = "created" | "updated" | "deleted";

type EventName = `user:${UserEvent}`;
```

Result:

```ts
type EventName =
    | "user:created"
    | "user:updated"
    | "user:deleted";
```

## 8.4 Built-in String Manipulation Types

TypeScript provides four intrinsic string manipulation types.

| Utility | Function |
|---|---|
| `Uppercase<T>` | Converts to uppercase |
| `Lowercase<T>` | Converts to lowercase |
| `Capitalize<T>` | Capitalizes the first character |
| `Uncapitalize<T>` | Lowercases the first character |

Example:

```ts
type A = Uppercase<"hello">;
type B = Lowercase<"HELLO">;
type C = Capitalize<"hello">;
type D = Uncapitalize<"Hello">;
```

Results:

```ts
type A = "HELLO";
type B = "hello";
type C = "Hello";
type D = "hello";
```

## 8.5 Creating API Route Types

```ts
type Method = "GET" | "POST" | "PUT" | "DELETE";

type Resource = "users" | "products" | "orders";

type ApiRoute = `/${Resource}`;

type ApiEndpoint = `${Method} ${ApiRoute}`;
```

Possible values include:

```ts
"GET /users"
"POST /users"
"PUT /users"
"DELETE /users"
"GET /products"
"POST /products"
```

This technique is useful for defining route contracts.

**Performance warning:** Combining large unions can produce a very large number of possible string types. Avoid unnecessarily huge template literal combinations.

---

# 9. Recursive Types

A recursive type references itself.

This is useful when working with nested data structures.

## 9.1 Basic Recursive Type

```ts
type NestedNumber = {
    value: number;
    child?: NestedNumber;
};
```

Usage:

```ts
const data: NestedNumber = {
    value: 1,
    child: {
        value: 2,
        child: {
            value: 3
        }
    }
};
```

## 9.2 JSON Value Type

JSON can contain:

- Strings
- Numbers
- Booleans
- Null
- Arrays
- Objects

We can represent this using recursive types.

```ts
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

Usage:

```ts
const response: JSONValue = {
    user: {
        name: "John",
        age: 25,
        active: true
    },
    skills: ["JavaScript", "TypeScript"],
    address: null
};
```

## 9.3 DeepReadonly

The built-in `Readonly<T>` only makes the top-level properties readonly.

It does not recursively make nested properties readonly.

We can create a custom utility.

```ts
type DeepReadonly<T> =
    T extends (...args: any[]) => any
        ? T
        : T extends object
            ? {
                readonly [K in keyof T]: DeepReadonly<T[K]>
            }
            : T;
```

Usage:

```ts
type User = {
    name: string;
    address: {
        city: string;
        country: string;
    };
};

type ReadonlyUser = DeepReadonly<User>;
```

Now nested properties are also readonly.

```ts
const user: ReadonlyUser = {
    name: "John",
    address: {
        city: "Ahmedabad",
        country: "India"
    }
};

// Error
// user.address.city = "Mumbai";
```

This example illustrates recursive mapped types.

For production utility libraries, consider special handling for built-in objects such as `Date`, `Map`, `Set`, and class instances. A generic recursive mapped type does not automatically provide the desired semantics for every object.

## 9.4 DeepPartial

```ts
type DeepPartial<T> =
    T extends (...args: any[]) => any
        ? T
        : T extends object
            ? {
                [K in keyof T]?: DeepPartial<T[K]>
            }
            : T;
```

Example:

```ts
type User = {
    id: number;
    profile: {
        name: string;
        address: {
            city: string;
        };
    };
};

type PartialUser = DeepPartial<User>;
```

Now you can provide partial nested objects:

```ts
const user: PartialUser = {
    profile: {
        address: {
            city: "Ahmedabad"
        }
    }
};
```

## 9.5 Recursive Types with Arrays

```ts
type TreeNode<T> = {
    value: T;
    children: TreeNode<T>[];
};
```

Usage:

```ts
const tree: TreeNode<string> = {
    value: "Root",
    children: [
        {
            value: "Child 1",
            children: []
        },
        {
            value: "Child 2",
            children: []
        }
    ]
};
```

This pattern is useful for:

- Folder structures.
- Organization charts.
- Comments and replies.
- Category trees.
- Menu systems.
- Abstract syntax trees.

---

# 10. Recursive Conditional Types

Recursive conditional types allow types to repeatedly transform themselves.

Example:

```ts
type Flatten<T> =
    T extends readonly (infer U)[]
        ? Flatten<U>
        : T;
```

Usage:

```ts
type Result = Flatten<number[][][]>;
```

Result:

```ts
number
```

Another example:

```ts
type AwaitedValue<T> =
    T extends PromiseLike<infer U>
        ? AwaitedValue<U>
        : T;
```

Usage:

```ts
type Result = AwaitedValue<Promise<Promise<string>>>;
```

Result:

```ts
string
```

TypeScript also provides a built-in utility:

```ts
type Result = Awaited<Promise<Promise<string>>>;
```

### Important Consideration

Recursive types can become expensive for the compiler.

Excessive recursion may result in errors such as:

```text
Type instantiation is excessively deep and possibly infinite.
```

Avoid unnecessarily complicated recursive type definitions.

---

# 11. Variadic Tuple Types

Variadic tuple types allow tuples to contain spread elements.

They are especially useful for function composition, middleware, and reusable function wrappers.

## 11.1 Basic Tuple Spread

```ts
type First = [string, number];

type Second = [boolean, Date];

type Combined = [...First, ...Second];
```

Result:

```ts
type Combined = [
    string,
    number,
    boolean,
    Date
];
```

## 11.2 Generic Tuple Combination

```ts
type Concat<A extends unknown[], B extends unknown[]> =
    [...A, ...B];
```

Usage:

```ts
type Result = Concat<
    [string, number],
    [boolean, Date]
>;
```

Result:

```ts
[string, number, boolean, Date]
```

## 11.3 Function Argument Preservation

Consider:

```ts
function logArguments<T extends unknown[]>(
    ...args: T
): T {
    console.log(args);

    return args;
}
```

Usage:

```ts
const result = logArguments("John", 25, true);
```

TypeScript infers the argument tuple from the supplied values.

## 11.4 Typed Function Wrappers

Suppose you want to create a reusable logging wrapper.

```ts
function withLogging<T extends (...args: any[]) => any>(
    fn: T
): (...args: Parameters<T>) => ReturnType<T> {

    return (...args: Parameters<T>): ReturnType<T> => {
        console.log("Function called");

        return fn(...args);
    };
}
```

Usage:

```ts
function add(a: number, b: number): number {
    return a + b;
}

const loggedAdd = withLogging(add);

loggedAdd(10, 20);
```

TypeScript preserves the function's parameter and return types.

---

# 12. Advanced Function Types

Functions are first-class values in JavaScript.

TypeScript provides several advanced techniques for describing their signatures.

## 12.1 Function Type Aliases

```ts
type Operation = (
    a: number,
    b: number
) => number;
```

Usage:

```ts
const add: Operation = (a, b) => a + b;

const subtract: Operation = (a, b) => a - b;
```

## 12.2 Function Overloading

Function overloading allows one function to support multiple call signatures.

Example:

```ts
function format(value: string): string;

function format(value: number): string;

function format(value: string | number): string {
    return String(value);
}
```

Usage:

```ts
format("Hello");

format(100);
```

Invalid:

```ts
// Error
// format(true);
```

### Important: Overload Signatures vs Implementation Signature

The function implementation signature is not directly exposed as an additional call signature.

Only the overload declarations determine the supported calls.

## 12.3 Overloading vs Union Types

Sometimes a union parameter is simpler.

```ts
function format(value: string | number): string {
    return String(value);
}
```

Use overloads when different input types need meaningfully different return types or call behavior.

Example:

```ts
function getValue(value: string): string[];

function getValue(value: number): number[];

function getValue(value: string | number): string[] | number[] {
    if (typeof value === "string") {
        return value.split("");
    }

    return [value];
}
```

## 12.4 Generic Function Signatures

```ts
type Identity = <T>(value: T) => T;
```

Usage:

```ts
const identity: Identity = value => value;
```

This type describes a generic function.

Compare:

```ts
type FixedString = (value: string) => string;
```

The generic version supports multiple types while preserving the relationship between input and output.

## 12.5 Understanding `this` Parameters

TypeScript supports explicit `this` parameter declarations.

```ts
interface User {
    name: string;
}

function printName(this: User) {
    console.log(this.name);
}
```

Usage:

```ts
const user: User = {
    name: "John"
};

printName.call(user);
```

The `this` parameter is a TypeScript-only declaration. It is not a normal runtime parameter.

---

# 13. Higher-Order Functions

A higher-order function is a function that:

1. Accepts another function as an argument.
2. Returns another function.
3. Or does both.

Example:

```ts
function greet(name: string): string {
    return `Hello ${name}`;
}

function execute(
    callback: (name: string) => string
) {
    return callback("John");
}

execute(greet);
```

Higher-order functions are widely used in:

- React hooks.
- Middleware.
- Express applications.
- Functional programming.
- Logging systems.
- Authentication wrappers.

## 13.1 Creating a Generic Higher-Order Function

```ts
function createLogger<T extends (...args: any[]) => any>(
    fn: T
): T {
    return ((...args: Parameters<T>) => {
        console.log("Executing function");

        return fn(...args);
    }) as T;
}
```

Usage:

```ts
function multiply(a: number, b: number): number {
    return a * b;
}

const loggedMultiply = createLogger(multiply);

const result = loggedMultiply(10, 5);
```

This preserves the apparent function signature.

However, the assertion is required here because TypeScript cannot prove that the wrapper exactly preserves every possible feature of `T`, such as specialized overloads or explicit `this` behavior.

Use assertions carefully.

## 13.2 Generic Function Composition

Composition means combining multiple functions.

Example:

```ts
const double = (value: number) => value * 2;

const addTen = (value: number) => value + 10;

const result = addTen(double(5));
```

Result:

```ts
20
```

The output of one function becomes the input of another.

A basic composition function:

```ts
function compose<A, B, C>(
    first: (value: A) => B,
    second: (value: B) => C
) {
    return (value: A): C => {
        return second(first(value));
    };
}
```

Usage:

```ts
const double = (value: number) => value * 2;

const addTen = (value: number) => value + 10;

const calculate = compose(double, addTen);

const result = calculate(5);
```

Result:

```ts
20
```

TypeScript ensures that the output of `first` is compatible with the input of `second`.

For a production-quality `pipe` or `compose` supporting arbitrary numbers of functions, variadic tuples and carefully designed overloads or recursive type transformations are often needed.

---

# 14. Advanced Utility Types

TypeScript provides built-in utility types for transforming existing types.

Here are the most important ones.

## 14.1 Object Utility Types

| Utility | Purpose |
|---|---|
| `Partial<T>` | Makes all properties optional |
| `Required<T>` | Makes all properties required |
| `Readonly<T>` | Makes all properties readonly |
| `Pick<T, K>` | Selects specific properties |
| `Omit<T, K>` | Removes specific properties |
| `Record<K, T>` | Creates an object type with keys `K` and values `T` |

Example:

```ts
type User = {
    id: number;
    name: string;
    email: string;
};
```

```ts
type OptionalUser = Partial<User>;

type RequiredUser = Required<User>;

type ReadonlyUser = Readonly<User>;

type UserDetails = Pick<User, "name" | "email">;

type UserWithoutEmail = Omit<User, "email">;
```

## 14.2 Union Utility Types

| Utility | Purpose |
|---|---|
| `Exclude<T, U>` | Removes members assignable to `U` |
| `Extract<T, U>` | Keeps members assignable to `U` |
| `NonNullable<T>` | Removes `null` and `undefined` |

Example:

```ts
type Status =
    | "success"
    | "error"
    | "pending";
```

```ts
type FinalStatus = Exclude<Status, "pending">;
```

Result:

```ts
"success" | "error"
```

Another example:

```ts
type Result = Extract<
    string | number | boolean,
    string | number
>;
```

Result:

```ts
string | number
```

## 14.3 Function Utility Types

| Utility | Purpose |
|---|---|
| `Parameters<T>` | Extracts function parameters |
| `ReturnType<T>` | Extracts return type |
| `ConstructorParameters<T>` | Extracts constructor parameters |
| `InstanceType<T>` | Extracts constructed instance type |
| `ThisParameterType<T>` | Extracts explicit `this` parameter |
| `OmitThisParameter<T>` | Removes explicit `this` parameter |

Example:

```ts
function createUser(
    name: string,
    age: number
) {
    return {
        name,
        age
    };
}
```

```ts
type Params = Parameters<typeof createUser>;

type Result = ReturnType<typeof createUser>;
```

Results:

```ts
type Params = [name: string, age: number];

type Result = {
    name: string;
    age: number;
};
```

**Overload limitation:** `Parameters<T>` and `ReturnType<T>` generally infer from the last overload signature. They do not automatically produce a union of every overload's parameter or return types.

## 14.4 `Awaited<T>`

Extracts the resolved type of a Promise-like value.

```ts
type Result = Awaited<Promise<string>>;
```

Result:

```ts
string
```

Nested promises are also unwrapped:

```ts
type Result = Awaited<Promise<Promise<number>>>;
```

Result:

```ts
number
```

## 14.5 `NoInfer<T>`

`NoInfer<T>` prevents a particular location from contributing inference candidates for `T`.

It is useful when one argument should determine a generic type and another argument should only be checked against it.

```ts
function chooseColor<C extends string>(
    colors: C[],
    defaultColor?: NoInfer<C>
): C | undefined {
    return defaultColor ?? colors[0];
}
```

Usage:

```ts
chooseColor(
    ["red", "green"],
    "red"
);
```

Invalid:

```ts
// Error
chooseColor(
    ["red", "green"],
    "blue"
);
```

Here, TypeScript infers `C` from the `colors` argument rather than expanding it to accommodate `defaultColor`.

`NoInfer` is built into TypeScript starting with version 5.4.

---

# 15. Building Custom Utility Types

Now let's implement some useful utility types ourselves.

## 15.1 Custom `Pick`

```ts
type MyPick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

Usage:

```ts
type User = {
    id: number;
    name: string;
    email: string;
};

type UserInfo = MyPick<User, "name" | "email">;
```

## 15.2 Custom `Omit`

```ts
type MyOmit<T, K extends PropertyKey> =
    Pick<T, Exclude<keyof T, K>>;
```

Usage:

```ts
type User = {
    id: number;
    name: string;
    email: string;
};

type PublicUser = MyOmit<User, "email">;
```

## 15.3 Custom `ValueOf`

Extracts all property value types from an object.

```ts
type ValueOf<T> = T[keyof T];
```

Usage:

```ts
type User = {
    id: number;
    name: string;
    active: boolean;
};

type Result = ValueOf<User>;
```

Result:

```ts
number | string | boolean
```

## 15.4 Optional Keys

Extract keys that are optional.

```ts
type OptionalKeys<T> = {
    [K in keyof T]-?:
        {} extends Pick<T, K>
            ? K
            : never
}[keyof T];
```

Usage:

```ts
type User = {
    id: number;
    name?: string;
    email?: string;
};

type Result = OptionalKeys<User>;
```

Result:

```ts
"name" | "email"
```

## 15.5 Required Keys

```ts
type RequiredKeys<T> = {
    [K in keyof T]-?:
        {} extends Pick<T, K>
            ? never
            : K
}[keyof T];
```

Usage:

```ts
type User = {
    id: number;
    name?: string;
    email: string;
};

type Result = RequiredKeys<User>;
```

Result:

```ts
"id" | "email"
```

## 15.6 Union to Intersection

This is an advanced utility type.

```ts
type UnionToIntersection<U> =
    (
        U extends unknown
            ? (value: U) => void
            : never
    ) extends (value: infer I) => void
        ? I
        : never;
```

Usage:

```ts
type A = {
    name: string;
};

type B = {
    age: number;
};

type Result = UnionToIntersection<A | B>;
```

Result:

```ts
{
    name: string;
} & {
    age: number;
}
```

Conceptually, the result requires both structures.

This technique uses distributive conditional types and inference from function parameter positions. It is powerful but should be used only when the resulting intersection is meaningful.

---

# 16. Type-Level String Manipulation

Template literal types allow you to manipulate strings at compile time.

Let's build a few examples.

## 16.1 Convert a String into an Event Name

```ts
type EventName<T extends string> = `${T}Changed`;
```

Usage:

```ts
type UserEvent = EventName<"user">;
```

Result:

```ts
"userChanged"
```

## 16.2 Create Getter Names

```ts
type GetterNames<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]:
        () => T[K];
};
```

Usage:

```ts
type Product = {
    name: string;
    price: number;
};

type ProductGetters = GetterNames<Product>;
```

Result:

```ts
type ProductGetters = {
    getName: () => string;
    getPrice: () => number;
};
```

## 16.3 Create Setter Names

```ts
type SetterNames<T> = {
    [K in keyof T as `set${Capitalize<string & K>}`]:
        (value: T[K]) => void;
};
```

Result:

```ts
type ProductSetters = SetterNames<Product>;
```

Equivalent to:

```ts
type ProductSetters = {
    setName: (value: string) => void;
    setPrice: (value: number) => void;
};
```

---

# 17. Type-Level Number Manipulation

TypeScript does not provide general-purpose arithmetic operators for numeric types.

For example, this is invalid:

```ts
// Invalid type-level arithmetic
// type Result = 10 + 20;
```

However, we can perform limited arithmetic using tuple types.

## 17.1 Creating a Tuple from a Number

```ts
type BuildTuple<
    N extends number,
    T extends unknown[] = []
> =
    T["length"] extends N
        ? T
        : BuildTuple<N, [...T, unknown]>;
```

Usage:

```ts
type Result = BuildTuple<3>;
```

Result:

```ts
[unknown, unknown, unknown]
```

## 17.2 Adding Two Small Numbers

```ts
type Add<
    A extends number,
    B extends number
> = [
    ...BuildTuple<A>,
    ...BuildTuple<B>
]["length"];
```

Usage:

```ts
type Result = Add<2, 3>;
```

Result:

```ts
5
```

This technique works for small non-negative integer literal types within practical compiler recursion limits.

It is not suitable for arbitrary numbers, decimals, negative numbers, or large numeric calculations.

For actual runtime arithmetic, use JavaScript.

---

# 18. Type-Level Object Manipulation

Type-level object manipulation allows you to transform object structures without writing runtime code.

## 18.1 Extract Object Keys

```ts
type User = {
    id: number;
    name: string;
    email: string;
};

type Keys = keyof User;
```

Result:

```ts
"id" | "name" | "email"
```

## 18.2 Extract Property Types

```ts
type NameType = User["name"];
```

Result:

```ts
string
```

## 18.3 Extract All Property Values

```ts
type UserValues = User[keyof User];
```

Result:

```ts
number | string
```

## 18.4 Create a Nested Object Path Type

Consider:

```ts
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

We want to generate paths such as:

```ts
"id"
"profile"
"profile.name"
"profile.address"
"profile.address.city"
"profile.address.country"
```

We can create a recursive type:

```ts
type Paths<T> = {
    [K in keyof T & string]:
        T[K] extends object
            ? K | `${K}.${Paths<T[K]>}`
            : K
}[keyof T & string];
```

Usage:

```ts
type UserPaths = Paths<User>;
```

This is a simplified example. A production version should handle arrays, functions, dates, and other non-plain objects deliberately.

---

# 19. Type-Level Validation

TypeScript can validate whether a type satisfies a particular structural requirement.

However, compile-time type validation does not replace runtime validation.

## 19.1 Required Properties

```ts
type RequireId<T> =
    T extends { id: number }
        ? T
        : never;
```

Usage:

```ts
type User = {
    id: number;
    name: string;
};

type Product = {
    name: string;
};

type A = RequireId<User>;
type B = RequireId<Product>;
```

Results:

```ts
type A = User;
type B = never;
```

## 19.2 XOR Types

Sometimes you want an object to contain either one property or another, but not both.

Example:

```ts
type EmailLogin = {
    email: string;
    password: string;
    phone?: never;
};

type PhoneLogin = {
    phone: string;
    password: string;
    email?: never;
};

type Login = EmailLogin | PhoneLogin;
```

Valid:

```ts
const login1: Login = {
    email: "john@example.com",
    password: "123456"
};
```

Also valid:

```ts
const login2: Login = {
    phone: "9999999999",
    password: "123456"
};
```

Invalid:

```ts
// Error
const login3: Login = {
    email: "john@example.com",
    phone: "9999999999",
    password: "123456"
};
```

For reusable XOR types involving multiple object types, a mapped-type-based utility can be created. However, exactness still has limitations under TypeScript's structural type system.

## 19.3 Non-Empty Arrays

A normal array can be empty.

```ts
type NonEmptyArray<T> = [T, ...T[]];
```

Usage:

```ts
const numbers: NonEmptyArray<number> = [10, 20, 30];
```

Invalid:

```ts
// Error
const empty: NonEmptyArray<number> = [];
```

This is useful when a function requires at least one item.

## 19.4 Runtime Validation Is Still Necessary

Consider:

```ts
type User = {
    name: string;
    age: number;
};
```

This does not validate incoming API data:

```ts
const user = JSON.parse(apiResponse) as User;
```

The assertion only tells TypeScript to trust you.

It does not inspect the actual data.

For external data, use runtime validation libraries such as Zod or write explicit validation logic.

---

# 20. Branded Types

TypeScript primarily uses structural typing.

Sometimes you want two values with the same underlying primitive type to be treated as different types.

Example:

```ts
type UserId = number;

type ProductId = number;
```

Both types are effectively numbers.

Therefore:

```ts
const userId: UserId = 1;

const productId: ProductId = userId;
```

This is valid.

But perhaps you want to prevent this.

Branded types help solve this problem.

## 20.1 Creating a Branded Type

```ts
declare const brand: unique symbol;

type Brand<T, Name extends string> =
    T & {
        readonly [brand]: Name;
    };
```

Now:

```ts
type UserId = Brand<number, "UserId">;

type ProductId = Brand<number, "ProductId">;
```

These types are now distinguishable.

## 20.2 Creating Branded Values

```ts
function createUserId(value: number): UserId {
    if (!Number.isInteger(value) || value <= 0) {
        throw new Error("Invalid user ID");
    }

    return value as UserId;
}
```

Usage:

```ts
const userId = createUserId(101);
```

Now:

```ts
function getUser(id: UserId) {
    console.log(id);
}

getUser(userId);
```

Invalid:

```ts
// Error
// getUser(101);
```

## 20.3 Practical Branded Type Examples

You can use branded types for:

- User IDs.
- Product IDs.
- Order IDs.
- Email addresses.
- Validated phone numbers.
- Currency amounts.
- Meters and kilometers.
- Access tokens.

Example:

```ts
type Email = Brand<string, "Email">;

function createEmail(value: string): Email {
    if (!value.includes("@")) {
        throw new Error("Invalid email");
    }

    return value as Email;
}
```

**Important:** Branded types provide compile-time distinctions, not runtime security. Type assertions can bypass them. Use trusted constructors and runtime validation to establish branded values.

---

# 21. Nominal Typing Techniques

Nominal typing means types are distinguished by their declared identity rather than only their structure.

TypeScript is structurally typed by default, but nominal-like behavior can be achieved through branding.

Another technique is private or protected class members.

Example:

```ts
class UserId {
    private readonly __brand!: void;

    constructor(public readonly value: number) {}
}

class ProductId {
    private readonly __brand!: void;

    constructor(public readonly value: number) {}
}
```

These classes are incompatible because their private members originate from different class declarations.

Usage:

```ts
const userId = new UserId(1);

const productId = new ProductId(2);
```

A function can require a specific ID:

```ts
function getUser(id: UserId) {
    console.log(id.value);
}

getUser(userId);

// Error
// getUser(productId);
```

### Structural vs Nominal Typing

| Structural Typing | Nominal Typing |
|---|---|
| Based on compatible structure | Based on declared identity |
| Common TypeScript behavior | Can be approximated in TypeScript |
| Similar objects are compatible | Distinct types remain separate |
| Flexible | More restrictive |

---

# 22. Type-Safe Event Systems

Now let's build something practical.

Suppose you are developing a Node.js application.

You want an event system that supports:

- `userCreated`
- `userDeleted`
- `orderPlaced`

Each event should have a different payload.

## 22.1 Define Event Payloads

```ts
type Events = {
    userCreated: {
        id: number;
        name: string;
    };

    userDeleted: {
        id: number;
    };

    orderPlaced: {
        orderId: number;
        total: number;
    };
};
```

## 22.2 Create a Type-Safe Event Emitter

```ts
type EventHandler<T> = (payload: T) => void;

class EventEmitter<EventMap extends object> {
    private listeners = new Map<
        keyof EventMap,
        Set<(payload: any) => void>
    >();

    on<K extends keyof EventMap>(
        event: K,
        handler: EventHandler<EventMap[K]>
    ): void {
        const handlers = this.listeners.get(event) ?? new Set();

        handlers.add(handler);

        this.listeners.set(event, handlers);
    }

    emit<K extends keyof EventMap>(
        event: K,
        payload: EventMap[K]
    ): void {
        const handlers = this.listeners.get(event);

        handlers?.forEach(handler => handler(payload));
    }
}
```

Usage:

```ts
const emitter = new EventEmitter<Events>();
```

Register listener:

```ts
emitter.on("userCreated", (user) => {
    console.log(user.name);
});
```

Emit event:

```ts
emitter.emit("userCreated", {
    id: 1,
    name: "John"
});
```

Invalid:

```ts
// Error: incorrect payload
emitter.emit("userCreated", {
    id: 1
});
```

Also invalid:

```ts
// Error: unknown event
emitter.emit("paymentCompleted", {});
```

This demonstrates how generics, `keyof`, and indexed access types work together.

The internal `any` is confined to the storage implementation; the public API remains strongly typed. A production event emitter should also handle unsubscribe behavior, listener exceptions, asynchronous handlers, and memory cleanup.

---

# 23. Type-Safe API Contracts

In full-stack development, frontend and backend applications need consistent API contracts.

Let's create a simple API contract using TypeScript.

## 23.1 Define API Endpoints

```ts
type ApiEndpoints = {
    "/users": {
        GET: {
            response: {
                id: number;
                name: string;
            }[];
        };

        POST: {
            body: {
                name: string;
                email: string;
            };

            response: {
                id: number;
                name: string;
                email: string;
            };
        };
    };

    "/products": {
        GET: {
            response: {
                id: number;
                title: string;
                price: number;
            }[];
        };
    };
};
```

## 23.2 Create a Generic API Client

```ts
type Method = "GET" | "POST";

type Endpoint = keyof ApiEndpoints;

type EndpointMethod<E extends Endpoint> =
    keyof ApiEndpoints[E];

type RequestBody<
    E extends Endpoint,
    M extends EndpointMethod<E>
> =
    ApiEndpoints[E][M] extends { body: infer B }
        ? B
        : never;

type ResponseBody<
    E extends Endpoint,
    M extends EndpointMethod<E>
> =
    ApiEndpoints[E][M] extends { response: infer R }
        ? R
        : never;
```

Now create a client:

```ts
declare function apiRequest<
    E extends Endpoint,
    M extends EndpointMethod<E>
>(
    endpoint: E,
    method: M,
    ...args: RequestBody<E, M> extends never
        ? []
        : [body: RequestBody<E, M>]
): Promise<ResponseBody<E, M>>;
```

Usage:

```ts
const users = apiRequest("/users", "GET");
```

The response is inferred as:

```ts
Promise<{
    id: number;
    name: string;
}[]>
```

POST request:

```ts
const newUser = apiRequest("/users", "POST", {
    name: "John",
    email: "john@example.com"
});
```

Invalid:

```ts
// Error: missing email
// apiRequest("/users", "POST", {
//     name: "John"
// });
```

This example demonstrates a type-level API contract.

The function is declared with `declare` only to illustrate the type signature. A real API client needs a runtime implementation.

**Production recommendation:** Consider using a shared schema-based contract or tools such as Zod and OpenAPI when validating and sharing API contracts across frontend and backend applications.

---

# 24. Advanced Type Inference

Type inference is the process by which TypeScript determines types automatically.

Advanced TypeScript development requires understanding how inference works.

## 24.1 Basic Inference

```ts
const name = "John";

const age = 25;
```

TypeScript infers:

```ts
name: string
age: number
```

## 24.2 Literal Inference

Consider:

```ts
const status = "success";
```

TypeScript can infer:

```ts
"success"
```

But:

```ts
let status = "success";
```

Usually infers:

```ts
string
```

This is because a `let` variable can be reassigned.

## 24.3 Using `as const`

```ts
const user = {
    name: "John",
    age: 25
} as const;
```

The resulting type is approximately:

```ts
{
    readonly name: "John";
    readonly age: 25;
}
```

This preserves literal values and makes properties readonly at the type level.

It does not freeze the object at runtime.

## 24.4 Contextual Typing

TypeScript can infer types from the context in which an expression is used.

```ts
type User = {
    name: string;
    age: number;
};

const user: User = {
    name: "John",
    age: 25
};
```

Here, the declared `User` type provides context for the object literal.

Another example:

```ts
const numbers = [1, 2, 3];

numbers.map(number => number * 2);
```

TypeScript understands that `number` is a number.

## 24.5 The `satisfies` Operator

The `satisfies` operator checks whether an expression is compatible with a type without simply replacing its inferred type with that target type.

```ts
type Colors = {
    primary: string;
    secondary: string;
};
```

Using a type annotation:

```ts
const colors: Colors = {
    primary: "blue",
    secondary: "green"
};
```

Using `satisfies`:

```ts
const colors = {
    primary: "blue",
    secondary: "green"
} satisfies Colors;
```

The second approach checks compatibility while retaining more specific information from the expression's inferred type.

A useful example:

```ts
type Routes = {
    home: string;
    about: string;
};

const routes = {
    home: "/",
    about: "/about"
} satisfies Routes;
```

This is useful when defining configuration objects.

## 24.6 Const Type Parameters

TypeScript 5.0 introduced `const` type parameters.

They improve literal inference for generic function calls.

Without a const type parameter:

```ts
function createArray<T extends readonly string[]>(value: T): T {
    return value;
}

const result = createArray(["red", "green"]);
```

With a const type parameter:

```ts
function createArray<const T extends readonly string[]>(value: T): T {
    return value;
}

const result = createArray(["red", "green"]);
```

The second version preserves a readonly tuple-like literal type:

```ts
readonly ["red", "green"]
```

This is useful when building reusable configuration and library APIs.

---

# 25. TypeScript Compiler Type Resolution

Now let's understand what happens when TypeScript analyzes your code.

The TypeScript compiler performs several important tasks.

## 25.1 Parsing

The compiler reads source code and creates an internal representation of its syntax.

Example:

```ts
const age: number = 25;
```

The compiler parses:

- Variable declaration.
- Variable name.
- Type annotation.
- Initial value.

## 25.2 Type Checking

The compiler checks whether values are compatible with declared types.

Example:

```ts
let age: number = 25;

// Error
age = "Twenty Five";
```

The compiler detects the mismatch.

## 25.3 Type Inference

The compiler determines types without explicit annotations.

```ts
const user = {
    id: 1,
    name: "John"
};
```

Inferred type:

```ts
{
    id: number;
    name: string;
}
```

## 25.4 Type Resolution

The compiler resolves relationships between types.

Example:

```ts
type User = {
    id: number;
    name: string;
};

function getUser(): User {
    return {
        id: 1,
        name: "John"
    };
}
```

The compiler checks the returned object against `User`.

## 25.5 Overload Resolution

Consider:

```ts
function process(value: string): string;

function process(value: number): number;

function process(value: string | number): string | number {
    return value;
}
```

When you call:

```ts
const result = process("Hello");
```

TypeScript selects the compatible overload and infers:

```ts
string
```

## 25.6 Compiler Diagnostics

The compiler provides diagnostics when it detects problems.

Example:

```ts
const age: number = "25";
```

A diagnostic explains that a string cannot be assigned to a number.

You can run type checking using:

```bash
npx tsc --noEmit
```

This checks your TypeScript project without emitting JavaScript files.

### Useful Compiler Configuration

```json
{
    "compilerOptions": {
        "strict": true,
        "noImplicitAny": true,
        "strictNullChecks": true,
        "noUncheckedIndexedAccess": true,
        "exactOptionalPropertyTypes": true,
        "noEmit": true
    }
}
```

These options help detect additional type-related problems.

Compiler internals are more complex than this overview, and implementation details can change between TypeScript releases. The concepts above describe the main stages and behaviors you need when developing applications.

---

# 26. Complete Practical Project 1: Advanced Type Utility Library

Let's combine several concepts into one reusable utility library.

Create:

```text
src/
    types/
        utility-types.ts
```

Code:

```ts
// Make every property deeply readonly

export type DeepReadonly<T> =
    T extends (...args: any[]) => any
        ? T
        : T extends object
            ? {
                readonly [K in keyof T]: DeepReadonly<T[K]>
            }
            : T;


// Make every property deeply optional

export type DeepPartial<T> =
    T extends (...args: any[]) => any
        ? T
        : T extends object
            ? {
                [K in keyof T]?: DeepPartial<T[K]>
            }
            : T;


// Extract all property values

export type ValueOf<T> = T[keyof T];


// Extract optional keys

export type OptionalKeys<T> = {
    [K in keyof T]-?:
        {} extends Pick<T, K>
            ? K
            : never
}[keyof T];


// Extract required keys

export type RequiredKeys<T> = {
    [K in keyof T]-?:
        {} extends Pick<T, K>
            ? never
            : K
}[keyof T];


// Extract array element

export type ElementOf<T> =
    T extends readonly (infer U)[]
        ? U
        : never;


// Extract Promise value

export type UnwrapPromise<T> =
    T extends PromiseLike<infer U>
        ? UnwrapPromise<U>
        : T;


// Convert union to intersection

export type UnionToIntersection<U> =
    (
        U extends unknown
            ? (value: U) => void
            : never
    ) extends (value: infer I) => void
        ? I
        : never;
```

This small library demonstrates:

- Generics.
- Conditional types.
- Mapped types.
- Recursive types.
- Indexed access types.
- `infer`.
- Distributive conditional types.

---

# 27. Complete Practical Project 2: Type-Safe Event System

Create:

```text
src/
    events/
        event-map.ts
        event-emitter.ts
```

### event-map.ts

```ts
export type AppEvents = {
    userCreated: {
        id: number;
        name: string;
        email: string;
    };

    userUpdated: {
        id: number;
        name: string;
    };

    userDeleted: {
        id: number;
    };

    orderCreated: {
        orderId: number;
        total: number;
    };
};
```

### event-emitter.ts

```ts
import type { AppEvents } from "./event-map";

type EventHandler<T> = (payload: T) => void;

export class EventEmitter<
    Events extends object
> {
    private listeners = new Map<
        keyof Events,
        Set<(payload: any) => void>
    >();

    on<K extends keyof Events>(
        event: K,
        handler: EventHandler<Events[K]>
    ) {
        const handlers =
            this.listeners.get(event) ?? new Set();

        handlers.add(handler);

        this.listeners.set(event, handlers);
    }

    emit<K extends keyof Events>(
        event: K,
        payload: Events[K]
    ) {
        const handlers = this.listeners.get(event);

        handlers?.forEach(handler => {
            handler(payload);
        });
    }
}

export const appEvents =
    new EventEmitter<AppEvents>();
```

### Usage

```ts
import { appEvents } from "./event-emitter";

appEvents.on("userCreated", (user) => {
    console.log(user.email);
});

appEvents.emit("userCreated", {
    id: 1,
    name: "John",
    email: "john@example.com"
});
```

You now have a reusable, strongly typed event system.

---

# 28. Common Advanced TypeScript Mistakes

| Mistake | Why It Is a Problem | Better Approach |
|---|---|---|
| Using `any` everywhere | Disables type checking | Prefer `unknown` and proper types |
| Excessive type assertions | Can hide real errors | Use inference and validation |
| Overcomplicated conditional types | Difficult to maintain | Break types into smaller utilities |
| Excessive recursive types | Can slow compilation | Limit recursion and complexity |
| Huge template literal unions | Can affect compiler performance | Keep unions manageable |
| Ignoring `never` | Misses useful exhaustive checking | Use `never` for impossible cases |
| Confusing `readonly` with runtime immutability | `readonly` is a compile-time restriction | Use runtime freezing when required |
| Assuming types validate API responses | TypeScript types are erased | Use runtime schemas |
| Overusing function overloads | Makes APIs harder to maintain | Prefer unions or generics when appropriate |
| Creating unnecessary branded types | Adds complexity | Use branding where distinctions matter |

## 28.1 Type Complexity and Compiler Performance

Advanced types can affect:

- Compilation speed.
- Editor autocomplete.
- Language server responsiveness.
- Error message readability.
- Developer productivity.

For example, recursively expanding large unions can create expensive type computations.

**Professional recommendation:** A readable type that solves the problem is generally better than a clever type that is difficult to understand.

---

# 29. Advanced TypeScript Interview Questions and Answers

### Q1. What is structural typing?

Structural typing means TypeScript checks type compatibility based primarily on the structure of values rather than their declared names.

### Q2. What is nominal typing?

Nominal typing distinguishes types based on their declared identity rather than only their structure. TypeScript can approximate it through branding and private class members.

### Q3. What is type-level programming?

It is the process of creating and transforming types using TypeScript's type system.

### Q4. What are conditional types?

Conditional types select one type or another based on an assignability check.

### Q5. What is the syntax of conditional types?

```ts
T extends U ? X : Y
```

### Q6. What is a distributive conditional type?

A conditional type that distributes over union members when its checked type is a naked type parameter.

### Q7. How do you prevent conditional type distribution?

Use tuple wrapping:

```ts
[T] extends [U] ? X : Y
```

### Q8. What is `infer`?

`infer` extracts a type from a pattern inside a conditional type.

### Q9. What are mapped types?

Mapped types create new types by iterating over the keys of an existing type.

### Q10. What is key remapping?

Key remapping changes or filters property names using the `as` clause in mapped types.

### Q11. What are template literal types?

They allow you to construct string literal types using template literal syntax.

### Q12. What are recursive types?

Recursive types reference themselves and are useful for representing nested data structures.

### Q13. What are recursive conditional types?

They are conditional types that recursively evaluate or transform other types.

### Q14. What are variadic tuple types?

They allow tuple types to contain spread elements, enabling flexible tuple composition.

### Q15. What is function overloading?

It allows one function implementation to support multiple declared call signatures.

### Q16. What is a higher-order function?

A function that accepts another function, returns a function, or both.

### Q17. What is function composition?

Function composition combines functions so the output of one becomes the input of another.

### Q18. What is `ReturnType<T>`?

It extracts the return type of a function.

### Q19. What is `Parameters<T>`?

It extracts a function's parameter types as a tuple.

### Q20. What is `Awaited<T>`?

It recursively extracts the resolved type of a Promise-like value.

### Q21. What is `NoInfer<T>`?

It prevents a particular type position from contributing inference candidates for a generic parameter.

### Q22. What is a branded type?

A branded type adds a compile-time marker to an existing type to distinguish it from structurally identical types.

### Q23. Does a branded type provide runtime validation?

No. Runtime validation must be performed separately.

### Q24. What is the difference between `as const` and `Object.freeze()`?

`as const` creates readonly literal types at compile time. `Object.freeze()` freezes an object at runtime, generally shallowly.

### Q25. What is the `satisfies` operator?

It checks whether an expression satisfies a target type while preserving more specific inferred information.

### Q26. What are excess property checks?

They are additional checks TypeScript performs on fresh object literals to catch unexpected properties.

### Q27. Does TypeScript support exact object types by default?

No. TypeScript primarily uses structural typing. Excess property checks do not provide universal exact-object enforcement.

### Q28. What is `UnionToIntersection`?

It is a type-level utility that transforms a union of types into their intersection.

### Q29. Why can recursive types cause compiler errors?

Because type instantiation can become excessively deep or computationally expensive.

### Q30. Can TypeScript perform arbitrary arithmetic at the type level?

No. It supports limited techniques using tuple types, but it is not a general-purpose compile-time arithmetic language.

### Q31. What is `keyof`?

It extracts the property keys of a type as a union.

### Q32. What is indexed access typing?

It extracts property types using syntax such as:

```ts
type Name = User["name"];
```

### Q33. What is the difference between `unknown` and `any`?

`unknown` requires narrowing before most operations. `any` largely disables type checking.

### Q34. What is `never`?

It represents an impossible type and is useful for exhaustive checking and filtering union members.

### Q35. What are const type parameters?

Introduced in TypeScript 5.0, they help generic functions preserve literal types during inference.

### Q36. What is contextual typing?

Contextual typing allows TypeScript to infer types from the surrounding expected type.

### Q37. What is type inference?

Type inference is the process by which TypeScript determines types automatically from expressions and context.

### Q38. Can TypeScript types inspect runtime JSON?

No. Types are erased at runtime. Runtime validation requires actual JavaScript logic or a validation library.

### Q39. What is the difference between a union and an intersection?

A union represents one of several possible types. An intersection combines requirements from multiple types.

### Q40. Why should advanced types be kept simple?

Complex types can increase compilation costs, produce difficult error messages, and make code harder to maintain.

---

# 30. Practical Exercises

Complete these exercises to test your understanding.

## Beginner – Advanced Type Foundations

**Exercise 1:** Create a generic function that accepts an object and a key and returns the value associated with that key.

**Exercise 2:** Create a conditional type that checks whether a type is a number.

**Exercise 3:** Create a utility type that extracts array element types.

**Exercise 4:** Create a utility type that extracts Promise values.

**Exercise 5:** Create a custom `MyPartial<T>` utility.

## Intermediate – Type Transformations

**Exercise 6:** Create a `DeepReadonly<T>` utility.

**Exercise 7:** Create a `DeepPartial<T>` utility.

**Exercise 8:** Create a utility that removes all string properties from an object type.

**Exercise 9:** Create a utility that converts property names into getter names.

**Exercise 10:** Create a utility that extracts optional keys from an object.

## Advanced – Type-Level Programming

**Exercise 11:** Create a recursive type that flattens nested arrays.

**Exercise 12:** Create a type that combines two tuples.

**Exercise 13:** Create a type that extracts the first element of a tuple.

**Exercise 14:** Create a type that extracts the last element of a tuple.

**Exercise 15:** Create a type that converts a union into an intersection.

## Expert – Practical Applications

**Exercise 16:** Build a type-safe event emitter.

**Exercise 17:** Build a type-safe API endpoint contract.

**Exercise 18:** Create branded types for `UserId` and `ProductId`.

**Exercise 19:** Build a recursive type that generates nested object paths.

**Exercise 20:** Create a generic function composition utility.

---

# 31. Phase 45 Completion Checklist

You should now be comfortable with the following concepts.

| No. | Topic | Expected Knowledge |
|---|---|---|
| 1 | Structural Typing | Understand structural compatibility |
| 2 | Type-Level Programming | Understand compile-time transformations |
| 3 | Advanced Generics | Create reusable generic types and functions |
| 4 | Generic Constraints | Restrict generic parameters |
| 5 | Conditional Types | Build conditional type expressions |
| 6 | Distributive Types | Understand union distribution |
| 7 | `infer` | Extract types from other types |
| 8 | Mapped Types | Transform object properties |
| 9 | Key Remapping | Rename and filter properties |
| 10 | Template Literal Types | Generate string literal types |
| 11 | Recursive Types | Model nested structures |
| 12 | Variadic Tuples | Manipulate tuple sequences |
| 13 | Function Overloading | Create multiple function signatures |
| 14 | Higher-Order Functions | Build reusable function wrappers |
| 15 | Utility Types | Use and implement advanced utilities |
| 16 | Branded Types | Create nominal-like distinctions |
| 17 | Event Systems | Build strongly typed events |
| 18 | API Contracts | Create type-safe endpoint definitions |
| 19 | Type Inference | Understand advanced inference |
| 20 | Compiler Resolution | Understand compiler type checking |

---

# 32. What Comes Next?

After learning advanced type-level programming, the next step is understanding how TypeScript works with the JavaScript ecosystem and how to build reliable, maintainable, production-ready applications.

## Phase 46: Advanced TypeScript – TypeScript Compiler, Configuration, Build Systems and Project Architecture

Upcoming topics:

1. TypeScript Compiler Deep Dive.
2. TypeScript Compilation Process.
3. TypeScript Compiler API Fundamentals.
4. `tsconfig.json` in Depth.
5. Compiler Options and Their Practical Usage.
6. Strict Type Checking.
7. Module Systems.
8. CommonJS vs ES Modules.
9. Module Resolution Strategies.
10. Path Aliases.
11. Project References.
12. TypeScript Monorepos.
13. Declaration Files (`.d.ts`).
14. Ambient Declarations.
15. Global Type Declarations.
16. Module Augmentation.
17. Declaration Merging.
18. JavaScript Interoperability.
19. Build Tools and Bundlers.
20. TypeScript with Vite.
21. TypeScript with Webpack.
22. TypeScript with esbuild.
23. TypeScript with SWC.
24. Source Maps.
25. Build Optimization.
26. Type Checking in CI/CD.
27. Production TypeScript Project Configuration.
28. Compiler Performance Optimization.

**Phase 45 is complete.**