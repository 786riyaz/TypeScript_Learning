# Phase 69: Advanced TypeScript – Advanced TypeScript Language Engineering, Type-Level Programming, Generics Mastery, Conditional Types, Mapped Types, Template Literal Types, Recursive Types, Type Inference and Compiler Internals

**Level:** Expert / Advanced TypeScript Language Engineering  
**Prerequisites:** TypeScript fundamentals, JavaScript, interfaces, classes, generics, unions, intersections, utility types, Node.js, React and Next.js.

---

# 1. Learning Objectives

In this phase, you will learn how to use TypeScript's type system at an advanced level.

By the end of this phase, you should be able to:

1. Understand TypeScript's internal type system.
2. Write advanced generic functions and classes.
3. Understand covariance, contravariance and invariance.
4. Create conditional and distributive conditional types.
5. Use the `infer` keyword.
6. Build custom mapped types.
7. Use key remapping and template literal types.
8. Create recursive types.
9. Develop custom utility types.
10. Implement advanced type guards and assertion functions.
11. Work with advanced function signatures and tuples.
12. Understand `keyof`, `typeof` and indexed access types.
13. Use `satisfies` and `const` type parameters.
14. Work with declaration merging and module augmentation.
15. Understand TypeScript declaration files.
16. Understand TypeScript compiler architecture.
17. Implement branded types.
18. Optimize complex TypeScript types.
19. Design type-safe APIs and enterprise-level TypeScript applications.

---

# 2. Understanding the Advanced TypeScript Type System

Before learning advanced type manipulation, you need to understand how TypeScript represents and checks types.

## 2.1 Static Type Checking vs Runtime Execution

TypeScript performs type checking during development and compilation.

However, TypeScript types do not exist in JavaScript at runtime.

Example:

```typescript
interface User {
    id: number;
    name: string;
}

const user: User = {
    id: 1,
    name: "Riyaz"
};
```

After compilation, the JavaScript output is approximately:

```javascript
const user = {
    id: 1,
    name: "Riyaz"
};
```

Notice that the `User` interface disappears.

**Important:** TypeScript does not automatically validate external data at runtime.

For example:

```typescript
const response = await fetch("/api/users");

const user: User = await response.json();
```

This does not guarantee that the response actually contains a valid `User`.

You need runtime validation for untrusted data.

For example, using Zod:

```typescript
import { z } from "zod";

const UserSchema = z.object({
    id: z.number(),
    name: z.string()
});

const response = await fetch("/api/users");

const data: unknown = await response.json();

const user = UserSchema.parse(data);
```

Now the data is validated at runtime.

## 2.2 Type Space vs Value Space

TypeScript has two important conceptual spaces.

| Type Space | Value Space |
|---|---|
| Types | Runtime values |
| Interfaces | Variables |
| Type aliases | Functions |
| Generic type parameters | Objects |
| Type annotations | Classes as runtime values |

Example:

```typescript
interface User {
    name: string;
}

const user: User = {
    name: "John"
};
```

Here:

- `User` exists in type space.
- `user` exists in value space.

You cannot use an interface as a runtime value:

```typescript
console.log(User); // Error
```

However, classes exist in both type and value spaces.

```typescript
class Product {
    constructor(public name: string) {}
}

const product: Product = new Product("Laptop");

console.log(Product); // Runtime class value
```

## 2.3 Structural Typing

TypeScript primarily uses structural typing.

It checks whether an object contains the required properties rather than requiring an explicitly declared relationship.

Example:

```typescript
interface Person {
    name: string;
    age: number;
}

const employee = {
    name: "John",
    age: 25,
    salary: 50000
};

const person: Person = employee;
```

This works because `employee` contains all required properties of `Person`.

It does not matter that `employee` was not explicitly declared as a `Person`.

### Structural Typing vs Nominal Typing

| Structural Typing | Nominal Typing |
|---|---|
| Based on structure | Based on declared identity |
| Focuses on properties | Focuses on declared type identity |
| Used by TypeScript by default | Common in languages such as Java and C# |
| Similar shapes can be compatible | Different declared types may remain incompatible |

We will explore how to simulate nominal typing later in this phase.

## 2.4 Type Widening

Type widening occurs when TypeScript converts a specific literal type into a broader type.

Example:

```typescript
let status = "active";
```

TypeScript generally infers:

```typescript
let status: string;
```

It does not preserve `"active"` as the variable's permanent type because `let` variables can be reassigned.

Compare:

```typescript
const status = "active";
```

In this case, TypeScript infers:

```typescript
const status: "active" = "active";
```

Because a `const` variable cannot be reassigned, its type can remain the literal type.

You can also preserve literal types using `as const`.

```typescript
const config = {
    environment: "production",
    retries: 3
} as const;
```

Inferred type:

```typescript
{
    readonly environment: "production";
    readonly retries: 3;
}
```

## 2.5 Understanding `any`, `unknown` and `never`

These three types have very different purposes.

### any

`any` disables most type checking.

```typescript
let value: any = "Hello";

value.toUpperCase();

value = 100;

value.someUnknownMethod();
```

TypeScript allows these operations even when they may fail at runtime.

### unknown

`unknown` represents a value whose type is not currently known.

You must narrow it before using type-specific operations.

```typescript
let value: unknown = "Hello";

if (typeof value === "string") {
    console.log(value.toUpperCase());
}
```

### never

`never` represents a value that cannot occur.

It is commonly used for impossible states and exhaustive checking.

```typescript
function throwError(message: string): never {
    throw new Error(message);
}
```

Comparison:

| Type | Meaning | Requires Narrowing? |
|---|---|---|
| `any` | Disable type checking | No |
| `unknown` | Unknown value | Yes |
| `never` | Impossible value | Not applicable |

**Best practice:** Prefer `unknown` over `any` when handling untrusted or dynamically typed data.

---

# 3. Type-Level Programming

Type-level programming means writing TypeScript types that transform, calculate or derive other types.

Unlike JavaScript functions, these transformations happen during compilation.

## 3.1 Normal JavaScript Programming

Consider:

```typescript
function getFirstElement<T>(items: T[]): T {
    return items[0];
}
```

This is runtime programming with generic type information used by the compiler.

## 3.2 Type-Level Programming

Consider:

```typescript
type FirstElement<T extends unknown[]> =
    T extends [infer First, ...unknown[]]
        ? First
        : never;
```

Usage:

```typescript
type Result = FirstElement<[string, number, boolean]>;
```

Result:

```typescript
type Result = string;
```

No JavaScript function runs.

TypeScript calculates the resulting type during type checking.

## 3.3 Why Is Type-Level Programming Useful?

Type-level programming helps you:

- Create reusable type transformations.
- Build strongly typed API clients.
- Generate types from existing structures.
- Prevent invalid function arguments.
- Create type-safe configuration systems.
- Build reusable libraries and frameworks.

For example, you can derive a type from an existing object:

```typescript
const routes = {
    users: "/api/users",
    products: "/api/products",
    orders: "/api/orders"
} as const;

type RouteName = keyof typeof routes;
```

Result:

```typescript
type RouteName =
    | "users"
    | "products"
    | "orders";
```

You did not manually define the union.

TypeScript generated it from the existing object.

---

# 4. Advanced Generics

You already know that generics allow reusable components and functions to work with multiple types.

Now let's explore advanced generic behavior.

## 4.1 Generic Constraints Using `extends`

A generic constraint restricts which types can be passed as generic arguments.

Example:

```typescript
function getLength<T extends { length: number }>(value: T): number {
    return value.length;
}
```

Valid usage:

```typescript
getLength("Hello");

getLength([10, 20, 30]);

getLength({
    length: 100
});
```

Invalid usage:

```typescript
getLength(100); // Error
```

Why?

Because a number does not have a `length` property.

The constraint:

```typescript
T extends { length: number }
```

means that `T` must satisfy the required structure.

It does not necessarily mean class inheritance.

## 4.2 Multiple Generic Parameters

You can define multiple generic parameters.

```typescript
function createPair<T, U>(first: T, second: U) {
    return {
        first,
        second
    };
}
```

Usage:

```typescript
const result = createPair("John", 25);
```

Inferred type:

```typescript
{
    first: string;
    second: number;
}
```

Another example:

```typescript
function mergeObjects<T extends object, U extends object>(
    first: T,
    second: U
): T & U {
    return {
        ...first,
        ...second
    };
}
```

Usage:

```typescript
const result = mergeObjects(
    { name: "John" },
    { age: 25 }
);
```

Result:

```typescript
{
    name: string;
    age: number;
}
```

## 4.3 Generic Default Parameters

You can provide default types for generic parameters.

```typescript
interface ApiResponse<T = unknown> {
    success: boolean;
    data: T;
    message?: string;
}
```

Usage without specifying a generic:

```typescript
const response: ApiResponse = {
    success: true,
    data: "Some data"
};
```

Here, `T` defaults to `unknown`.

Usage with a generic:

```typescript
interface User {
    id: number;
    name: string;
}

const userResponse: ApiResponse<User> = {
    success: true,
    data: {
        id: 1,
        name: "John"
    }
};
```

## 4.4 Generic Inference

TypeScript can automatically infer generic arguments.

```typescript
function identity<T>(value: T): T {
    return value;
}
```

Usage:

```typescript
const result = identity("Hello");
```

TypeScript infers:

```typescript
T = string
```

You do not need to write:

```typescript
identity<string>("Hello");
```

However, you can explicitly specify the type when necessary.

## 4.5 Preserving Input and Output Relationships

One major benefit of generics is preserving relationships between types.

Consider:

```typescript
function getValue<T>(value: T): T {
    return value;
}
```

The function returns the same type it receives.

Compare this with:

```typescript
function getValue(value: unknown): unknown {
    return value;
}
```

The second function loses the specific input-output relationship.

Example:

```typescript
const result1 = getValue("Hello");
```

With the generic version, `result1` is inferred as `string`.

With the `unknown` version, it is `unknown`.

**Important:** Generics are not just about accepting different types. They also preserve relationships between input types, output types and other type parameters.

---

# 5. Variance: Covariance, Contravariance and Invariance

Variance describes how assignability between generic types changes when their type arguments have a subtype relationship.

This is an important advanced TypeScript concept.

Assume:

```typescript
class Animal {
    name = "Animal";
}

class Dog extends Animal {
    bark() {
        console.log("Woof!");
    }
}
```

Here:

```typescript
Dog extends Animal
```

A Dog can be used where an Animal is expected.

## 5.1 Covariance

Covariance generally means that a more specific type can be substituted in an output position.

Example:

```typescript
interface Producer<T> {
    get(): T;
}
```

A producer of Dog can be used where a producer of Animal is expected.

Conceptually:

```typescript
Producer<Dog> → Producer<Animal>
```

Why?

Because anything produced as a Dog is also an Animal.

## 5.2 Contravariance

Contravariance generally applies to input positions.

Example:

```typescript
interface Consumer<T> {
    consume: (value: T) => void;
}
```

A consumer capable of accepting any Animal can safely consume a Dog.

Conceptually:

```typescript
Consumer<Animal> → Consumer<Dog>
```

Why?

Because a function that accepts all Animals can certainly accept a Dog.

## 5.3 Invariance

Invariance means that neither direction of assignment is generally safe.

Imagine a container that both reads and writes values.

```typescript
interface Box<T> {
    get(): T;
    set(value: T): void;
}
```

If a `Box<Dog>` were treated as a `Box<Animal>`, someone could insert a Cat into it.

That would violate the original expectation that the box contains Dogs.

## 5.4 Comparison

| Variance | Main Position | General Relationship |
|---|---|---|
| Covariance | Output | Specific → General |
| Contravariance | Input | General → Specific |
| Invariance | Input and output | Neither direction generally |

### Important TypeScript Detail

TypeScript uses structural compatibility and has some deliberate variance exceptions.

For example:

- `strictFunctionTypes` enables stricter checking of function parameter positions.
- Method declarations retain certain bivariant parameter behavior for compatibility.
- Generic variance may depend on how a type parameter is used.

Enable strict checking:

```json
{
    "compilerOptions": {
        "strict": true,
        "strictFunctionTypes": true
    }
}
```

Do not assume every generic type behaves according to a simple covariance or contravariance rule. The actual structure and compiler rules matter.

---

# 6. Conditional Types

Conditional types allow TypeScript to choose a type based on a condition.

Syntax:

```typescript
T extends U ? X : Y
```

Meaning:

- If `T` is assignable to `U`, use `X`.
- Otherwise, use `Y`.

## 6.1 Basic Conditional Type

```typescript
type IsString<T> =
    T extends string
        ? true
        : false;
```

Usage:

```typescript
type Result1 = IsString<string>;
type Result2 = IsString<number>;
```

Results:

```typescript
type Result1 = true;
type Result2 = false;
```

## 6.2 Conditional Type with Union

```typescript
type Check<T> =
    T extends string
        ? "String"
        : "Not String";
```

Usage:

```typescript
type Result = Check<string | number>;
```

Result:

```typescript
type Result = "String" | "Not String";
```

Why?

Because conditional types distribute over unions when the checked type is a naked type parameter.

This is called a distributive conditional type.

## 6.3 Distributive Conditional Types

Consider:

```typescript
type ToArray<T> = T extends unknown ? T[] : never;
```

Usage:

```typescript
type Result = ToArray<string | number>;
```

Result:

```typescript
type Result = string[] | number[];
```

The conditional is evaluated separately for each union member.

First:

```typescript
string extends unknown ? string[] : never
```

Result:

```typescript
string[]
```

Second:

```typescript
number extends unknown ? number[] : never
```

Result:

```typescript
number[]
```

Final result:

```typescript
string[] | number[]
```

## 6.4 Disabling Distribution

You can prevent distribution by wrapping the checked type in a tuple.

```typescript
type ToArray<T> =
    [T] extends [unknown]
        ? T[]
        : never;
```

Usage:

```typescript
type Result = ToArray<string | number>;
```

Result:

```typescript
(string | number)[]
```

Compare:

| Type | Result |
|---|---|
| `ToArray<string \| number>` with naked `T` | `string[] \| number[]` |
| `ToArray<string \| number>` with `[T]` | `(string \| number)[]` |

This distinction is important when building advanced utility types.

---

# 7. The `infer` Keyword

The `infer` keyword allows TypeScript to infer a type inside a conditional type.

It is commonly used to extract types from complex structures.

## 7.1 Extracting Array Element Types

```typescript
type ArrayElement<T> =
    T extends (infer U)[]
        ? U
        : never;
```

Usage:

```typescript
type Result = ArrayElement<string[]>;
```

Result:

```typescript
type Result = string;
```

Here:

```typescript
infer U
```

asks TypeScript to infer the array element type.

## 7.2 Extracting Function Return Types

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
        name: "John"
    };
}

type UserResult = MyReturnType<typeof getUser>;
```

Result:

```typescript
{
    id: number;
    name: string;
}
```

TypeScript infers the return type into `R`.

## 7.3 Extracting Function Parameters

```typescript
type MyParameters<T> =
    T extends (...args: infer P) => any
        ? P
        : never;
```

Usage:

```typescript
function createUser(
    name: string,
    age: number
) {
    return { name, age };
}

type ParametersResult = MyParameters<typeof createUser>;
```

Result:

```typescript
[name: string, age: number]
```

## 7.4 Extracting Promise Types

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
string
```

TypeScript also provides the built-in `Awaited<T>` utility type, which handles more complex promise-like types and nested promise resolution.

---

# 8. Mapped Types

Mapped types allow you to transform properties of an existing type.

They are especially useful for building reusable utility types.

## 8.1 Basic Mapped Type

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}
```

Create a type where every property becomes optional:

```typescript
type OptionalUser<T> = {
    [K in keyof T]?: T[K];
};
```

Usage:

```typescript
type UserOptional = OptionalUser<User>;
```

Result:

```typescript
{
    id?: number;
    name?: string;
    email?: string;
}
```

Let's understand the syntax:

```typescript
[K in keyof T]
```

- `keyof T` gets all keys of T.
- `K` represents each key.
- `T[K]` gets the value type associated with that key.

## 8.2 Making Properties Readonly

```typescript
type MyReadonly<T> = {
    readonly [K in keyof T]: T[K];
};
```

Usage:

```typescript
type ReadonlyUser = MyReadonly<User>;
```

Now all properties are readonly.

## 8.3 Removing Optional Modifiers

You can remove optional modifiers using `-?`.

```typescript
type RequiredProperties<T> = {
    [K in keyof T]-?: T[K];
};
```

## 8.4 Removing Readonly Modifiers

Use `-readonly`.

```typescript
type Mutable<T> = {
    -readonly [K in keyof T]: T[K];
};
```

Modifier syntax:

| Syntax | Purpose |
|---|---|
| `?` | Add optional |
| `-?` | Remove optional |
| `readonly` | Add readonly |
| `-readonly` | Remove readonly |

## 8.5 Key Remapping Using `as`

Key remapping allows you to rename keys inside mapped types.

Example:

```typescript
interface User {
    id: number;
    name: string;
}
```

Create getters for every property:

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
{
    getId: () => number;
    getName: () => string;
}
```

## 8.6 Filtering Properties

You can filter keys using `as`.

Example:

```typescript
interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
}
```

Create a type containing only string properties:

```typescript
type StringProperties<T> = {
    [K in keyof T as T[K] extends string ? K : never]: T[K];
};
```

Usage:

```typescript
type StringProduct = StringProperties<Product>;
```

Result:

```typescript
{
    name: string;
    description: string;
}
```

Why does it work?

When a key maps to `never`, that key is removed from the resulting object type.

---

# 9. Template Literal Types

Template literal types allow you to create string types using other types.

They are useful for event names, route names, property names and type-safe configuration.

## 9.1 Basic Example

```typescript
type UserEvent = `user_${string}`;
```

Valid:

```typescript
const event1: UserEvent = "user_created";
const event2: UserEvent = "user_deleted";
```

Invalid:

```typescript
const event3: UserEvent = "product_created";
```

## 9.2 Combining Union Types

```typescript
type Action = "create" | "update" | "delete";

type Entity = "user" | "product";

type EventName = `${Entity}_${Action}`;
```

Result:

```typescript
type EventName =
    | "user_create"
    | "user_update"
    | "user_delete"
    | "product_create"
    | "product_update"
    | "product_delete";
```

TypeScript generates all combinations.

## 9.3 Intrinsic String Manipulation Types

TypeScript provides four built-in string manipulation types.

| Utility | Purpose |
|---|---|
| `Uppercase<T>` | Converts string to uppercase |
| `Lowercase<T>` | Converts string to lowercase |
| `Capitalize<T>` | Capitalizes first character |
| `Uncapitalize<T>` | Makes first character lowercase |

Example:

```typescript
type A = Uppercase<"hello">;
type B = Lowercase<"HELLO">;
type C = Capitalize<"hello">;
type D = Uncapitalize<"Hello">;
```

Results:

```typescript
type A = "HELLO";
type B = "hello";
type C = "Hello";
type D = "hello";
```

## 9.4 Type-Safe Event Names

```typescript
interface User {
    name: string;
    age: number;
}

type UserEvents = `${keyof User}Changed`;
```

Result:

```typescript
type UserEvents =
    | "nameChanged"
    | "ageChanged";
```

Now create a function:

```typescript
function onUserEvent(event: UserEvents) {
    console.log(event);
}
```

Usage:

```typescript
onUserEvent("nameChanged");

onUserEvent("ageChanged");

// Error
onUserEvent("emailChanged");
```

This prevents invalid event names at compile time.

---

# 10. Recursive Types

A recursive type references itself.

Recursive types are useful for representing nested structures such as:

- JSON.
- Trees.
- File systems.
- Nested categories.
- Organizational structures.
- Menu structures.

## 10.1 Recursive Interface

```typescript
interface TreeNode {
    value: string;
    children: TreeNode[];
}
```

Example:

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

A node can contain other nodes of the same type.

## 10.2 Recursive JSON Type

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

This represents valid JSON-like values.

## 10.3 DeepReadonly

The built-in `Readonly<T>` only makes the first-level properties readonly.

It does not recursively make nested properties readonly.

You can create a custom type:

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
interface User {
    name: string;
    address: {
        city: string;
        country: string;
    };
}

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

// Error
user.address.city = "Mumbai";
```

This is a compile-time restriction, not runtime freezing.

## 10.4 DeepPartial

A recursive version of `Partial<T>`:

```typescript
type DeepPartial<T> =
    T extends object
        ? {
            [K in keyof T]?: DeepPartial<T[K]>
        }
        : T;
```

Example:

```typescript
interface Product {
    id: number;
    name: string;
    details: {
        description: string;
        dimensions: {
            width: number;
            height: number;
        };
    };
}

type PartialProduct = DeepPartial<Product>;
```

Now even nested properties can be omitted.

**Important:** Production-grade recursive utility types often need special handling for functions, arrays, tuples, maps, sets and special object types. The example above demonstrates the core concept, not a universal implementation.

## 10.5 Recursive Type Performance

Avoid excessively complicated recursive types.

Problems can include:

- Slow compilation.
- Type instantiation depth errors.
- Difficult error messages.
- Complex editor suggestions.
- Difficult maintenance.

Use recursive types only when they provide meaningful value.

---

# 11. Advanced Utility Types

TypeScript provides several built-in utility types.

Let's understand them with examples.

Assume:

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    age?: number;
}
```

## 11.1 Partial<T>

Makes all properties optional.

```typescript
type PartialUser = Partial<User>;
```

## 11.2 Required<T>

Makes all properties required.

```typescript
type RequiredUser = Required<User>;
```

## 11.3 Readonly<T>

Makes all top-level properties readonly.

```typescript
type ReadonlyUser = Readonly<User>;
```

## 11.4 Pick<T, K>

Selects specific properties.

```typescript
type UserBasicInfo = Pick<User, "id" | "name">;
```

## 11.5 Omit<T, K>

Removes specific properties.

```typescript
type PublicUser = Omit<User, "email">;
```

## 11.6 Record<K, T>

Creates an object type using keys and a value type.

```typescript
type UserRoles = Record<
    "admin" | "editor" | "viewer",
    string
>;
```

Result:

```typescript
{
    admin: string;
    editor: string;
    viewer: string;
}
```

## 11.7 Exclude<T, U>

Removes types from a union.

```typescript
type Status = "pending" | "success" | "failed";

type ActiveStatus = Exclude<Status, "failed">;
```

Result:

```typescript
"pending" | "success"
```

## 11.8 Extract<T, U>

Keeps matching types from a union.

```typescript
type Result = Extract<
    string | number | boolean,
    string | boolean
>;
```

Result:

```typescript
string | boolean
```

## 11.9 NonNullable<T>

Removes `null` and `undefined`.

```typescript
type Result = NonNullable<string | null | undefined>;
```

Result:

```typescript
string
```

## 11.10 Parameters<T>

Extracts function parameters.

```typescript
function createUser(name: string, age: number) {
    return { name, age };
}

type CreateUserParams = Parameters<typeof createUser>;
```

Result:

```typescript
[name: string, age: number]
```

## 11.11 ReturnType<T>

Extracts a function's return type.

```typescript
type CreateUserResult = ReturnType<typeof createUser>;
```

## 11.12 ConstructorParameters<T>

Extracts constructor parameters.

```typescript
class Product {
    constructor(
        public name: string,
        public price: number
    ) {}
}

type ProductParams = ConstructorParameters<typeof Product>;
```

## 11.13 InstanceType<T>

Extracts the instance type created by a constructor.

```typescript
type ProductInstance = InstanceType<typeof Product>;
```

## 11.14 Awaited<T>

Extracts the resolved type of a Promise-like value.

```typescript
type Result = Awaited<Promise<Promise<string>>>;
```

Result:

```typescript
string
```

## 11.15 ThisParameterType<T>

Extracts the declared `this` parameter type of a function.

```typescript
function printName(this: { name: string }) {
    console.log(this.name);
}

type ThisType = ThisParameterType<typeof printName>;
```

Result:

```typescript
{
    name: string;
}
```

## 11.16 OmitThisParameter<T>

Creates a function type without its explicit `this` parameter.

```typescript
type WithoutThis = OmitThisParameter<typeof printName>;
```

## 11.17 NoInfer<T>

`NoInfer<T>` prevents a particular position from contributing to generic type inference.

Example:

```typescript
function createStatus<C extends string>(
    choices: C[],
    defaultChoice: NoInfer<C>
): C {
    return defaultChoice;
}
```

Usage:

```typescript
createStatus(
    ["pending", "success"],
    "pending"
);

// Error: "failed" is not one of the choices.
createStatus(
    ["pending", "success"],
    "failed"
);
```

The `choices` argument determines the inferred type of `C`. The second argument must match it rather than widening the inferred type.

`NoInfer` is available in modern TypeScript versions.

---

# 12. Creating Custom Utility Types

Now let's build some reusable utility types.

## 12.1 Nullable<T>

```typescript
type Nullable<T> = T | null;
```

Usage:

```typescript
type UserName = Nullable<string>;
```

Result:

```typescript
string | null
```

## 12.2 Mutable<T>

```typescript
type Mutable<T> = {
    -readonly [K in keyof T]: T[K];
};
```

## 12.3 RequireAtLeastOne<T>

Sometimes you want an object to have at least one of several optional properties.

```typescript
type RequireAtLeastOne<T> = {
    [K in keyof T]-?:
        Required<Pick<T, K>> &
        Partial<Omit<T, K>>
}[keyof T];
```

Example:

```typescript
interface SearchOptions {
    name?: string;
    email?: string;
    phone?: string;
}

type ValidSearchOptions = RequireAtLeastOne<SearchOptions>;
```

Valid:

```typescript
const search1: ValidSearchOptions = {
    name: "John"
};

const search2: ValidSearchOptions = {
    email: "john@example.com",
    phone: "1234567890"
};
```

Invalid:

```typescript
const search3: ValidSearchOptions = {};
```

At least one property is required.

## 12.4 PickByValue<T, V>

Select properties whose values are compatible with a given type.

```typescript
type PickByValue<T, V> = {
    [K in keyof T as T[K] extends V ? K : never]: T[K];
};
```

Usage:

```typescript
interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    active: boolean;
}

type StringFields = PickByValue<Product, string>;
```

Result:

```typescript
{
    name: string;
    description: string;
}
```

---

# 13. Advanced Type Guards

Type guards help TypeScript narrow a broad type into a more specific type.

## 13.1 Built-in Type Guards

### typeof

```typescript
function printValue(value: string | number) {
    if (typeof value === "string") {
        console.log(value.toUpperCase());
    } else {
        console.log(value.toFixed(2));
    }
}
```

### instanceof

```typescript
function handleError(error: Error | string) {
    if (error instanceof Error) {
        console.log(error.message);
    } else {
        console.log(error);
    }
}
```

### in

```typescript
interface Admin {
    name: string;
    permissions: string[];
}

interface Customer {
    name: string;
    purchases: number;
}

function handleUser(user: Admin | Customer) {
    if ("permissions" in user) {
        console.log(user.permissions);
    } else {
        console.log(user.purchases);
    }
}
```

## 13.2 User-Defined Type Predicates

You can define your own type guard.

Syntax:

```typescript
value is Type
```

Example:

```typescript
interface User {
    id: number;
    name: string;
}

function isUser(value: unknown): value is User {
    return (
        typeof value === "object" &&
        value !== null &&
        "id" in value &&
        typeof value.id === "number" &&
        "name" in value &&
        typeof value.name === "string"
    );
}
```

Usage:

```typescript
const data: unknown = {
    id: 1,
    name: "John"
};

if (isUser(data)) {
    console.log(data.name);
}
```

Inside the `if` block, TypeScript knows that `data` is a `User`.

## 13.3 Assertion Functions

Assertion functions tell TypeScript that execution can continue only if a condition is satisfied.

Example:

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
const value: unknown = "Hello";

assertString(value);

console.log(value.toUpperCase());
```

After the assertion, TypeScript treats `value` as a string.

Another example:

```typescript
function assert(condition: unknown): asserts condition {
    if (!condition) {
        throw new Error("Assertion failed");
    }
}
```

**Important:** Type predicates and assertion signatures are promises made by your implementation to the compiler. If the implementation does not actually validate the value, the compiler may accept unsafe code.

---

# 14. Discriminated Unions and Exhaustive Checking

Discriminated unions are useful for modeling states and operations.

Example:

```typescript
type ApiResponse =
    | {
        status: "success";
        data: string;
    }
    | {
        status: "error";
        message: string;
    }
    | {
        status: "loading";
    };
```

Each object has a common property:

```typescript
status
```

This property distinguishes the union members.

## 14.1 Narrowing Discriminated Unions

```typescript
function handleResponse(response: ApiResponse) {
    switch (response.status) {
        case "success":
            console.log(response.data);
            break;

        case "error":
            console.log(response.message);
            break;

        case "loading":
            console.log("Loading...");
            break;
    }
}
```

TypeScript knows which properties are available in each case.

## 14.2 Exhaustive Type Checking Using `never`

Suppose you add a new state later.

```typescript
type ApiResponse =
    | {
        status: "success";
        data: string;
    }
    | {
        status: "error";
        message: string;
    }
    | {
        status: "loading";
    }
    | {
        status: "cancelled";
    };
```

You may forget to handle `"cancelled"`.

Create an exhaustive checking helper:

```typescript
function assertNever(value: never): never {
    throw new Error(`Unexpected value: ${value}`);
}
```

Now:

```typescript
function handleResponse(response: ApiResponse) {
    switch (response.status) {
        case "success":
            console.log(response.data);
            break;

        case "error":
            console.log(response.message);
            break;

        case "loading":
            console.log("Loading...");
            break;

        default:
            assertNever(response);
    }
}
```

TypeScript reports an error because `response` is not `never` in the default branch. It can still be the `"cancelled"` variant.

This forces you to handle the new state.

**Real-world use cases:**

- Payment status.
- Order status.
- Authentication state.
- API responses.
- Background job status.
- WebSocket event types.

---

# 15. Advanced Function Types

TypeScript supports several advanced function type features.

## 15.1 Function Overloads

Function overloads allow one function to support multiple signatures.

Example:

```typescript
function format(value: string): string;

function format(value: number): string;

function format(value: string | number): string {
    return String(value);
}
```

Usage:

```typescript
format("Hello");

format(100);
```

Both are valid.

However:

```typescript
format(true); // Error
```

The implementation signature is not directly exposed as a public overload.

## 15.2 Generic Function Signatures

```typescript
interface Identity {
    <T>(value: T): T;
}
```

Usage:

```typescript
const identity: Identity = value => value;

const result = identity("Hello");
```

## 15.3 Explicit `this` Parameter

TypeScript allows you to declare the expected `this` type in a function signature.

```typescript
interface User {
    name: string;
}

function printName(this: User) {
    console.log(this.name);
}
```

Usage:

```typescript
const user: User = {
    name: "John"
};

printName.call(user);
```

The `this` parameter is only a TypeScript type declaration. It does not become a real JavaScript parameter.

## 15.4 Variadic Tuple Types

Variadic tuples allow tuples to contain spread elements whose types are themselves tuples.

Example:

```typescript
type FirstAndRest<T extends unknown[]> =
    [first: string, ...rest: T];
```

Usage:

```typescript
type Result = FirstAndRest<[number, boolean]>;
```

Result:

```typescript
[string, number, boolean]
```

### Practical Example: Combining Function Parameters

```typescript
function combine<T extends unknown[], U extends unknown[]>(
    first: (...args: T) => void,
    second: (...args: U) => void
) {
    return (...args: [...T, ...U]) => {
        first(...args.slice(0, 1) as unknown as T);
        second(...args.slice(1) as unknown as U);
    };
}
```

This demonstrates variadic tuple syntax, but the implementation uses casts because ordinary array slicing does not preserve tuple positions at runtime.

The important concept is that tuple types can be spread into other tuple types.

A simpler example:

```typescript
type RouteParams = [
    method: string,
    path: string
];

type AuthParams = [
    token: string
];

type RequestParams = [
    ...RouteParams,
    ...AuthParams
];
```

Result:

```typescript
[
    method: string,
    path: string,
    token: string
]
```

---

# 16. `keyof`, `typeof` and Indexed Access Types

These three operators are essential for advanced type manipulation.

## 16.1 keyof

`keyof` produces a union of an object's property keys.

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}

type UserKeys = keyof User;
```

Result:

```typescript
"id" | "name" | "email"
```

## 16.2 typeof

At the type level, `typeof` retrieves the type of an existing value.

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
{
    id: number;
    name: string;
    active: boolean;
}
```

## 16.3 Indexed Access Types

Indexed access types allow you to retrieve the type of a particular property.

```typescript
interface User {
    id: number;
    name: string;
    active: boolean;
}

type UserName = User["name"];
```

Result:

```typescript
string
```

You can also retrieve multiple properties:

```typescript
type UserBasicInfo = User["id" | "name"];
```

Result:

```typescript
number | string
```

## 16.4 Combining All Three

```typescript
const user = {
    id: 1,
    name: "John",
    active: true
};

type User = typeof user;

type UserKeys = keyof User;

type UserValues = User[keyof User];
```

Results:

```typescript
type UserKeys = "id" | "name" | "active";

type UserValues = number | string | boolean;
```

This combination is extremely useful for building generic utility types.

---

# 17. The `satisfies` Operator

The `satisfies` operator checks whether an expression satisfies a type without replacing the expression's inferred type with that target type.

It was introduced in TypeScript 4.9.

## 17.1 Type Annotation vs Type Assertion vs Satisfies

Consider:

```typescript
type Color = "red" | "green" | "blue";
```

### Type Annotation

```typescript
const color: Color = "red";
```

The variable is typed as the union:

```typescript
Color
```

### Type Assertion

```typescript
const color = "red" as Color;
```

This tells TypeScript to treat the expression as `Color`.

It does not validate anything at runtime.

### Satisfies

```typescript
const color = "red" satisfies Color;
```

The expression is checked against `Color`, while its inferred type remains the specific literal type `"red"`.

## 17.2 Practical Configuration Example

```typescript
type DatabaseConfig = {
    host: string;
    port: number;
    database: string;
};

const config = {
    host: "localhost",
    port: 3306,
    database: "app_db"
} satisfies DatabaseConfig;
```

This verifies that the object satisfies the required structure while retaining useful inferred information about the expression.

If you accidentally add an invalid property to this fresh object literal:

```typescript
const config = {
    host: "localhost",
    port: 3306,
    database: "app_db",
    unknownProperty: true
} satisfies DatabaseConfig;
```

TypeScript reports an excess-property error.

**Use `satisfies` when you want compatibility checking without unnecessarily widening the inferred type.**

---

# 18. `const` Type Parameters

`const` type parameters were introduced in TypeScript 5.0.

They help preserve literal types during generic inference.

## 18.1 Normal Generic Inference

```typescript
function getConfig<T>(config: T): T {
    return config;
}

const result = getConfig({
    environment: "production"
});
```

The property may be inferred as:

```typescript
environment: string
```

## 18.2 Using a Const Type Parameter

```typescript
function getConfig<const T>(config: T): T {
    return config;
}

const result = getConfig({
    environment: "production"
});
```

Now TypeScript can preserve the literal:

```typescript
{
    readonly environment: "production";
}
```

This is useful for:

- Configuration objects.
- Route definitions.
- Event names.
- Query definitions.
- Library APIs.

**Important:** A `const` type parameter affects compile-time inference. It does not make the runtime object immutable.

---

# 19. Declaration Merging

Declaration merging means that TypeScript can combine multiple declarations with the same supported name into one definition.

## 19.1 Interface Merging

```typescript
interface User {
    name: string;
}

interface User {
    age: number;
}
```

TypeScript combines them.

Result:

```typescript
interface User {
    name: string;
    age: number;
}
```

Usage:

```typescript
const user: User = {
    name: "John",
    age: 25
};
```

## 19.2 Namespace Merging

```typescript
namespace Database {
    export function connect() {
        console.log("Connected");
    }
}

namespace Database {
    export function disconnect() {
        console.log("Disconnected");
    }
}
```

Both declarations contribute to the same namespace.

Usage:

```typescript
Database.connect();

Database.disconnect();
```

## 19.3 Declaration Merging Limitations

Not all declarations can merge freely.

| Declaration | Merging Behavior |
|---|---|
| Interface + Interface | Supported |
| Namespace + Namespace | Supported |
| Class + Interface | Supported in certain combinations |
| Function + Namespace | Supported |
| Class + Namespace | Supported |
| Type Alias + Type Alias | Not supported |
| Class + Class | Not supported |

For example:

```typescript
type User = {
    name: string;
};

type User = {
    age: number;
};
```

This produces a duplicate identifier error.

---

# 20. Module Augmentation

Module augmentation allows you to extend an existing module's type declarations.

It is commonly used when extending third-party libraries.

Example:

Imagine you want to add a custom property to an Express request.

```typescript
import "express";

declare module "express-serve-static-core" {
    interface Request {
        currentUser?: {
            id: number;
            email: string;
        };
    }
}
```

Now you can access the extended property:

```typescript
import type { Request, Response } from "express";

function getProfile(req: Request, res: Response) {
    console.log(req.currentUser?.email);

    res.json({
        user: req.currentUser
    });
}
```

The augmentation changes TypeScript's understanding of the module.

It does not automatically create or attach `currentUser` at runtime.

You must implement the corresponding middleware or runtime behavior.

---

# 21. Declaration Files (`.d.ts`)

Declaration files describe the types of JavaScript code.

They usually contain type information without runtime implementations.

Example:

```typescript
// math.d.ts

export declare function add(
    a: number,
    b: number
): number;
```

The actual JavaScript implementation could be:

```javascript
// math.js

export function add(a, b) {
    return a + b;
}
```

The declaration file tells TypeScript how to type-check calls to the JavaScript function.

## 21.1 Ambient Declarations

The `declare` keyword describes an existing variable, function, class or module.

Example:

```typescript
declare const APP_VERSION: string;
```

This tells TypeScript that a runtime variable named `APP_VERSION` exists.

It does not create that variable.

## 21.2 Declaring a Module

```typescript
declare module "legacy-library" {
    export function initialize(): void;

    export function execute(
        input: string
    ): Promise<boolean>;
}
```

This allows TypeScript to understand an otherwise untyped module.

## 21.3 Important Declaration File Concepts

| Concept | Purpose |
|---|---|
| `.d.ts` | Type declaration file |
| `declare` | Describes an existing runtime entity |
| Ambient module | Declares a module's type interface |
| `types` | Controls included type packages |
| `typeRoots` | Specifies type declaration directories |
| `paths` | Configures module path mappings |
| Module augmentation | Extends existing module declarations |

---

# 22. TypeScript Compiler Architecture

Understanding the compiler helps you diagnose type errors and compilation performance problems.

The TypeScript compiler is commonly used through:

```bash
tsc
```

Its major conceptual stages include:

## 22.1 Source Code

You write:

```typescript
const message: string = "Hello";
```

## 22.2 Scanner and Parser

The compiler reads the source code and creates an Abstract Syntax Tree (AST).

The AST represents the structure of your program.

For example, it identifies:

- Variable declarations.
- Function declarations.
- Expressions.
- Type annotations.
- Statements.

## 22.3 Binder

The binder creates symbols and establishes relationships between declarations and scopes.

For example, it helps associate a variable reference with its declaration.

## 22.4 Type Checker

The checker performs type analysis.

It checks:

- Assignability.
- Generic constraints.
- Function signatures.
- Property access.
- Type compatibility.
- Inference.
- Type errors.

## 22.5 Emitter

The emitter generates output files when configured to do so.

Depending on compiler configuration, output may include:

- JavaScript.
- Source maps.
- Declaration files.

Conceptual pipeline:

```text
TypeScript Source
       |
       v
    Scanner
       |
       v
     Parser
       |
       v
      AST
       |
       v
     Binder
       |
       v
  Type Checker
       |
       v
     Emitter
       |
       v
 JavaScript Output
```

This is a simplified conceptual model; actual compiler operations and their interactions are more complex.

## 22.6 TypeScript Compiler API

TypeScript provides a Compiler API that allows programs to inspect and manipulate source code.

For example:

```typescript
import ts from "typescript";

const sourceCode = `
    const message: string = "Hello";
`;

const sourceFile = ts.createSourceFile(
    "example.ts",
    sourceCode,
    ts.ScriptTarget.Latest,
    true
);

console.log(sourceFile.statements);
```

This creates an AST representation of the source code.

**Use cases:**

- Code analysis tools.
- Custom linting.
- Automated refactoring.
- Code generators.
- Documentation generators.
- Static analysis tools.

---

# 23. Structural Typing vs Nominal Typing: Branded Types

TypeScript is structurally typed by default.

Sometimes, however, you want two values to have the same underlying representation but remain incompatible.

For example:

- User ID.
- Product ID.
- Order ID.

All three may be numbers, but mixing them accidentally can cause bugs.

## 23.1 The Problem

```typescript
type UserId = number;
type ProductId = number;

function getUser(id: UserId) {
    console.log(id);
}

const productId: ProductId = 100;

getUser(productId);
```

TypeScript accepts this because both aliases are just `number`.

## 23.2 Using Branded Types

```typescript
declare const userIdBrand: unique symbol;
declare const productIdBrand: unique symbol;

type UserId = number & {
    readonly [userIdBrand]: "UserId";
};

type ProductId = number & {
    readonly [productIdBrand]: "ProductId";
};
```

Now the types are distinct.

```typescript
function getUser(id: UserId) {
    console.log(id);
}
```

A plain number cannot safely be passed as a `UserId`.

## 23.3 Creating Valid Branded Values

```typescript
function createUserId(value: number): UserId {
    if (!Number.isInteger(value) || value <= 0) {
        throw new Error("Invalid user ID");
    }

    return value as UserId;
}
```

Usage:

```typescript
const userId = createUserId(100);

getUser(userId);
```

The constructor function validates the value before applying the brand.

**Important:** A brand is a compile-time technique. It does not automatically validate runtime values. Keep the branding operation inside controlled constructors or validation functions.

---

# 24. Advanced Type Inference

Type inference allows TypeScript to determine types without requiring explicit annotations everywhere.

Let's explore some important concepts.

## 24.1 Contextual Typing

TypeScript can infer a type from the context where an expression appears.

Example:

```typescript
type ClickHandler = (
    event: MouseEvent
) => void;

const handleClick: ClickHandler = event => {
    console.log(event.clientX);
};
```

TypeScript understands that `event` is a `MouseEvent`.

## 24.2 Best Common Type

Consider:

```typescript
const values = [10, 20, 30];
```

TypeScript infers:

```typescript
number[]
```

For mixed values:

```typescript
const values = [10, "Hello", true];
```

TypeScript infers a union-like element type:

```typescript
(string | number | boolean)[]
```

## 24.3 Literal Widening

```typescript
let status = "active";
```

Type:

```typescript
string
```

But:

```typescript
const status = "active";
```

Type:

```typescript
"active"
```

## 24.4 Explicit Generic Inference

```typescript
function createArray<T>(value: T): T[] {
    return [value];
}

const numbers = createArray(10);
```

Inferred type:

```typescript
number[]
```

## 24.5 When to Use Explicit Types

Type inference is useful, but explicit annotations improve clarity at important boundaries.

Prefer explicit types for:

- Public function signatures.
- API contracts.
- Complex return types.
- Domain entities.
- Shared interfaces.
- Critical business logic.

You do not need to annotate every local variable if TypeScript already infers the correct type.

---

# 25. Type Performance Optimization

Complex type-level programming can slow down TypeScript compilation.

This becomes important in large enterprise applications and reusable libraries.

## 25.1 Avoid Excessive Nested Conditional Types

Hard-to-read example:

```typescript
type Complex<T> =
    T extends string
        ? T extends "admin"
            ? true
            : false
        : T extends number
            ? T extends 0
                ? "zero"
                : "number"
            : never;
```

Sometimes, breaking the logic into smaller types improves readability.

```typescript
type IsAdmin<T> =
    T extends "admin" ? true : false;

type NumberResult<T> =
    T extends 0 ? "zero" : "number";

type Complex<T> =
    T extends string
        ? IsAdmin<T>
        : T extends number
            ? NumberResult<T>
            : never;
```

## 25.2 Avoid Huge Union Types

Combining many template literal types can create enormous unions.

Example:

```typescript
type Method = "GET" | "POST" | "PUT" | "DELETE";

type Resource =
    | "users"
    | "products"
    | "orders"
    | "payments";
```

Combining these types creates many possible strings.

This is manageable here, but large combinations can become expensive.

## 25.3 Use Named Intermediate Types

Instead of writing deeply nested expressions repeatedly, create named types.

```typescript
type UserId = number;

type UserName = string;

interface User {
    id: UserId;
    name: UserName;
}
```

This improves maintainability.

## 25.4 Useful Compiler Diagnostics

Check types without generating JavaScript:

```bash
npx tsc --noEmit
```

Get extended compiler diagnostics:

```bash
npx tsc --extendedDiagnostics
```

Generate a performance trace:

```bash
npx tsc --generateTrace trace-output
```

These tools help investigate compilation performance.

---

# 26. Advanced TypeScript Compiler Configuration

Your `tsconfig.json` controls how TypeScript checks and compiles your application.

Let's understand some important settings.

## 26.1 Strict Mode

```json
{
    "compilerOptions": {
        "strict": true
    }
}
```

Enables a group of stricter type-checking options.

Important examples include:

- `strictNullChecks`
- `strictFunctionTypes`
- `strictBindCallApply`
- `noImplicitAny`
- `noImplicitThis`
- `strictPropertyInitialization`
- `useUnknownInCatchVariables`

## 26.2 Important Strictness Options

| Option | Purpose |
|---|---|
| `strict` | Enables strict checking options |
| `strictNullChecks` | Distinguishes nullable and non-nullable values |
| `strictFunctionTypes` | Applies stricter function parameter checking |
| `noImplicitAny` | Prevents unintended implicit `any` |
| `exactOptionalPropertyTypes` | Distinguishes omitted optional properties from explicit `undefined` assignments in relevant cases |
| `noUncheckedIndexedAccess` | Adds `undefined` to potentially missing indexed values |
| `useUnknownInCatchVariables` | Types catch variables as `unknown` by default |

### Example: noUncheckedIndexedAccess

Without this option:

```typescript
const users = ["John", "David"];

const user = users[10];
```

TypeScript may treat `user` as `string`.

With:

```json
{
    "compilerOptions": {
        "noUncheckedIndexedAccess": true
    }
}
```

The type becomes:

```typescript
string | undefined
```

This is more accurate because index 10 may not exist.

## 26.3 Other Important Compiler Options

| Option | Purpose |
|---|---|
| `target` | JavaScript output language level |
| `module` | JavaScript module system output |
| `moduleResolution` | How modules are resolved |
| `lib` | Built-in environment type libraries |
| `types` | Included ambient type packages |
| `paths` | Module import path mappings |
| `declaration` | Generates `.d.ts` files |
| `composite` | Enables project-reference support |
| `incremental` | Enables incremental compilation |
| `noEmit` | Prevents output generation |
| `skipLibCheck` | Skips checking declaration files |

**Important:** `skipLibCheck` does not disable type checking for your application source files. It skips checking declaration files, which can reduce compilation time.

Also, `moduleResolution` should match the runtime or bundler environment. A configuration appropriate for Node.js may differ from one intended for a frontend bundler.

---

# 27. Type-Safe API Design

Advanced TypeScript is especially useful when designing APIs.

Let's build a small example.

## 27.1 Define API Response Types

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}

type ApiResult<T> =
    | {
        success: true;
        data: T;
    }
    | {
        success: false;
        error: {
            code: string;
            message: string;
        };
    };
```

## 27.2 Create a Typed API Function

```typescript
async function fetchUser(
    id: number
): Promise<ApiResult<User>> {
    try {
        const response = await fetch(`/api/users/${id}`);

        if (!response.ok) {
            return {
                success: false,
                error: {
                    code: "USER_FETCH_FAILED",
                    message: "Unable to fetch user"
                }
            };
        }

        const data: unknown = await response.json();

        // In production, validate data using a runtime schema.
        const user = UserSchema.parse(data);

        return {
            success: true,
            data: user
        };
    } catch {
        return {
            success: false,
            error: {
                code: "NETWORK_ERROR",
                message: "Something went wrong"
            }
        };
    }
}
```

Assume `UserSchema` is a Zod schema that validates the expected user structure.

## 27.3 Handle the Response

```typescript
const result = await fetchUser(1);

if (result.success) {
    console.log(result.data.name);
} else {
    console.log(result.error.message);
}
```

TypeScript automatically narrows the response.

This is a clean approach to type-safe API design.

### Why Is This Better?

- Clear success and failure states.
- No unnecessary `any`.
- Predictable return types.
- Better IDE autocomplete.
- Compile-time protection.
- Runtime validation at the API boundary.

Remember that compile-time types alone do not guarantee the shape of an HTTP response.

---

# 28. Advanced TypeScript Design Patterns

Let's look at several patterns used in real-world TypeScript applications.

## 28.1 Result Pattern

Instead of throwing exceptions for every expected failure, represent success and failure as a union.

```typescript
type Result<T, E> =
    | {
        success: true;
        value: T;
    }
    | {
        success: false;
        error: E;
    };
```

Usage:

```typescript
type LoginError = {
    message: string;
};

function login(
    email: string,
    password: string
): Result<string, LoginError> {
    if (!email || !password) {
        return {
            success: false,
            error: {
                message: "Invalid credentials"
            }
        };
    }

    return {
        success: true,
        value: "token"
    };
}
```

## 28.2 Type-Safe Event Map

```typescript
interface EventMap {
    userCreated: {
        id: number;
        name: string;
    };

    orderPlaced: {
        orderId: number;
        total: number;
    };
}
```

Create a generic event handler:

```typescript
function emit<K extends keyof EventMap>(
    event: K,
    payload: EventMap[K]
) {
    console.log(event, payload);
}
```

Usage:

```typescript
emit("userCreated", {
    id: 1,
    name: "John"
});

emit("orderPlaced", {
    orderId: 100,
    total: 500
});
```

Invalid payloads are rejected:

```typescript
emit("userCreated", {
    orderId: 100,
    total: 500
});
```

## 28.3 Type-Safe Environment Variables

```typescript
interface Environment {
    PORT: number;
    NODE_ENV: "development" | "production";
    DATABASE_URL: string;
}
```

Create a parser:

```typescript
function parseEnvironment(
    env: NodeJS.ProcessEnv
): Environment {
    const port = Number(env.PORT);

    if (!Number.isInteger(port) || port <= 0) {
        throw new Error("Invalid PORT");
    }

    const nodeEnv = env.NODE_ENV;

    if (
        nodeEnv !== "development" &&
        nodeEnv !== "production"
    ) {
        throw new Error("Invalid NODE_ENV");
    }

    if (!env.DATABASE_URL) {
        throw new Error("DATABASE_URL is required");
    }

    return {
        PORT: port,
        NODE_ENV: nodeEnv,
        DATABASE_URL: env.DATABASE_URL
    };
}
```

This combines static typing with runtime validation.

---

# 29. Enterprise TypeScript Type Architecture

In large applications, organizing types is just as important as writing them correctly.

Consider an e-commerce application.

A possible structure:

```text
src/
│
├── shared/
│   ├── types/
│   │   ├── common.types.ts
│   │   ├── api.types.ts
│   │   └── result.types.ts
│   │
│   ├── utilities/
│   │   ├── type-guards.ts
│   │   └── validators.ts
│   │
│   └── errors/
│       └── application-error.ts
│
├── modules/
│   │
│   ├── users/
│   │   ├── user.types.ts
│   │   ├── user.entity.ts
│   │   ├── user.dto.ts
│   │   ├── user.repository.ts
│   │   └── user.service.ts
│   │
│   ├── products/
│   │   ├── product.types.ts
│   │   ├── product.entity.ts
│   │   ├── product.dto.ts
│   │   ├── product.repository.ts
│   │   └── product.service.ts
│   │
│   └── orders/
│       ├── order.types.ts
│       ├── order.entity.ts
│       ├── order.dto.ts
│       ├── order.repository.ts
│       └── order.service.ts
│
├── infrastructure/
│   ├── database/
│   └── external-services/
│
└── app.ts
```

## 29.1 Different Types for Different Layers

Avoid using one interface for everything.

For example:

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
}
```

You should not expose the entire object in a public API.

Create separate types:

```typescript
interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}

interface UserEntity {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
}

interface UserResponseDTO {
    id: number;
    name: string;
    email: string;
}
```

This separation prevents accidental exposure of sensitive internal fields.

## 29.2 Domain Types vs DTOs vs Database Models

| Type | Responsibility |
|---|---|
| Domain Entity | Represents business concepts and rules |
| DTO | Transfers data between application boundaries |
| Database Model | Represents persisted database structure |
| API Response Type | Defines public response structure |
| API Request Type | Defines expected request structure |

Do not automatically make these types identical.

Each has a different responsibility.

---

# 30. Common Advanced TypeScript Mistakes

Avoid these mistakes when working on professional projects.

### Mistake 1: Using `any` Everywhere

Bad:

```typescript
function process(data: any) {
    return data.value;
}
```

Better:

```typescript
function process(data: unknown) {
    if (
        typeof data === "object" &&
        data !== null &&
        "value" in data
    ) {
        console.log(data.value);
    }
}
```

For production code, add a proper runtime schema or type guard.

### Mistake 2: Assuming Type Assertions Validate Data

Bad:

```typescript
const user = response as User;
```

This does not validate the response.

### Mistake 3: Overusing Complex Generics

Not every function needs a generic type parameter.

Use generics when they preserve or express a meaningful relationship.

### Mistake 4: Writing Excessively Complex Utility Types

Types should improve maintainability, not make code impossible to understand.

### Mistake 5: Confusing `readonly` with Runtime Immutability

```typescript
interface User {
    readonly name: string;
}
```

This prevents ordinary reassignment through that TypeScript reference.

It does not freeze the object at runtime.

### Mistake 6: Ignoring `undefined`

Array access, optional properties and object lookups can produce `undefined`.

Enable:

```json
{
    "compilerOptions": {
        "strict": true,
        "noUncheckedIndexedAccess": true
    }
}
```

### Mistake 7: Overusing Type Assertions

Avoid using `as` to silence errors without understanding why the error exists.

### Mistake 8: Treating Module Augmentation as Runtime Implementation

Adding a property to an interface does not create that property on the actual JavaScript object.

### Mistake 9: Overcomplicating Recursive Types

Deep recursive transformations can make compilation slow and error messages difficult to understand.

### Mistake 10: Mixing Domain Types and API DTOs

Keep internal business models separate from public API contracts when their responsibilities differ.

---

# 31. Advanced TypeScript Interview Questions and Answers

## Basic Advanced Concepts

**Q1. What is type-level programming?**

Type-level programming means writing types that transform or derive other types during compilation.

**Q2. Does TypeScript perform runtime type checking?**

No. TypeScript performs static checking. Runtime validation requires JavaScript logic or a validation library.

**Q3. What is structural typing?**

Structural typing determines compatibility based on the structure of types rather than their declared names.

**Q4. What is type widening?**

Type widening occurs when a specific literal type becomes a broader type, such as `"active"` becoming `string`.

**Q5. What is the difference between `unknown` and `any`?**

`any` disables most type checking, whereas `unknown` requires narrowing before type-specific operations.

**Q6. What is `never`?**

`never` represents an impossible value or a function path that cannot complete normally.

## Generics and Variance

**Q7. What are generic constraints?**

They restrict the types that can be passed to a generic parameter using `extends`.

**Q8. What are generic default parameters?**

They provide fallback types when callers do not explicitly specify generic arguments.

**Q9. What is covariance?**

Covariance allows a more specific type to be substituted in an output position where a more general type is expected.

**Q10. What is contravariance?**

Contravariance reverses the subtype relationship in input positions.

**Q11. What is invariance?**

Invariance means neither direction of generic substitution is generally safe.

**Q12. What is `strictFunctionTypes`?**

It enables stricter checking of function parameter compatibility, with certain method-related compatibility exceptions.

## Conditional and Mapped Types

**Q13. What are conditional types?**

They select a resulting type based on an assignability condition.

**Q14. What is a distributive conditional type?**

A conditional type that distributes over union members when its checked type is a naked type parameter.

**Q15. How can you prevent conditional type distribution?**

Wrap the checked type in a tuple:

```typescript
[T] extends [U]
```

**Q16. What is the purpose of `infer`?**

It allows TypeScript to infer a type variable inside a conditional type pattern.

**Q17. What are mapped types?**

Mapped types transform properties of an existing type.

**Q18. What is key remapping?**

Key remapping uses `as` in a mapped type to rename or filter property keys.

**Q19. What does `-?` do?**

It removes the optional modifier from mapped properties.

**Q20. What does `-readonly` do?**

It removes the readonly modifier from mapped properties.

## Recursive and Utility Types

**Q21. What is a recursive type?**

A type that references itself, typically to represent nested structures.

**Q22. What is the difference between `Partial<T>` and `DeepPartial<T>`?**

`Partial<T>` affects top-level properties, whereas `DeepPartial<T>` recursively affects nested properties.

**Q23. What is `Awaited<T>`?**

It extracts the resolved type of a Promise-like type, including nested promises.

**Q24. What is `Record<K, T>`?**

It creates an object type whose keys are `K` and whose values are `T`.

**Q25. What is `NoInfer<T>`?**

It prevents a position from contributing to generic type inference.

## Type Guards and Functions

**Q26. What is a user-defined type guard?**

A function with a return type such as `value is User` that narrows a value's type.

**Q27. What is an assertion function?**

A function whose assertion signature tells TypeScript that a condition or type must hold if execution continues.

**Q28. What is a discriminated union?**

A union whose members share a property that identifies which variant is present.

**Q29. How do you perform exhaustive checking?**

Use a `never`-typed helper in the default branch of a switch statement.

**Q30. What are function overloads?**

Multiple public function signatures supported by a single implementation.

**Q31. What are variadic tuple types?**

Tuple types that support spreading other tuple types into their structure.

## Advanced Language Features

**Q32. What is the `satisfies` operator?**

It checks that an expression is compatible with a type without replacing its inferred type with that target type.

**Q33. What are const type parameters?**

Generic parameters that request const-like inference to preserve literal types.

**Q34. What is declaration merging?**

The process of combining supported declarations with the same name into one definition.

**Q35. What is module augmentation?**

It extends the type declarations of an existing module.

**Q36. What is a `.d.ts` file?**

A declaration file containing type information without ordinary runtime implementation code.

**Q37. What is an ambient declaration?**

A declaration describing a runtime entity that exists elsewhere.

**Q38. What is a branded type?**

A technique that adds a distinguishing compile-time marker to a type to simulate nominal distinctions.

## Compiler and Enterprise Concepts

**Q39. What is an AST?**

An Abstract Syntax Tree represents the structural organization of source code.

**Q40. What does the TypeScript type checker do?**

It analyzes types, inference, assignability and other type-related constraints.

**Q41. What is the TypeScript emitter?**

The compiler component responsible for generating output such as JavaScript and declaration files.

**Q42. What does `noEmit` do?**

It performs compilation checks without generating output files.

**Q43. What does `skipLibCheck` do?**

It skips checking declaration files, which can improve compilation performance.

**Q44. What is `noUncheckedIndexedAccess`?**

It makes potentially missing indexed values include `undefined` in their types.

**Q45. What is `exactOptionalPropertyTypes`?**

It distinguishes an omitted optional property from explicitly assigning `undefined` in relevant assignment scenarios.

**Q46. Why should complex recursive types be avoided when unnecessary?**

They can increase compiler workload, slow type checking and produce difficult error messages.

**Q47. What is the difference between a type assertion and a type guard?**

A type assertion tells the compiler to trust a specified type. A type guard performs a runtime check that narrows the type.

**Q48. Why should API DTOs be separate from domain entities?**

They represent different boundaries and responsibilities. Separating them prevents internal implementation details from leaking into public contracts.

**Q49. What is the advantage of branded types?**

They help prevent accidental mixing of values that have the same underlying representation but different meanings.

**Q50. What is the biggest benefit of advanced TypeScript?**

It allows developers to encode more application rules into the type system, making invalid states and incorrect operations harder to represent.

---

# 32. Practical Exercises

Complete these exercises to strengthen your understanding.

## Level 1: Advanced Generics

**Exercise 1:** Create a generic function that accepts an array and returns its first element.

**Exercise 2:** Create a generic function that accepts two values of different types and returns them as an object.

**Exercise 3:** Create a generic interface for an API response with a default generic parameter.

**Exercise 4:** Create a generic function that accepts only objects containing an `id` property.

**Exercise 5:** Create a generic function that preserves the exact input and output types.

## Level 2: Conditional and Mapped Types

**Exercise 6:** Create a conditional type that checks whether a type is a string.

**Exercise 7:** Create a type that extracts array element types.

**Exercise 8:** Create a custom `MyReturnType<T>` utility.

**Exercise 9:** Create a custom `MyReadonly<T>` utility.

**Exercise 10:** Create a custom `MyPartial<T>` utility.

**Exercise 11:** Create a mapped type that converts all property names into getter methods.

**Exercise 12:** Create a mapped type that extracts only numeric properties.

## Level 3: Recursive Types

**Exercise 13:** Create a recursive type representing a tree structure.

**Exercise 14:** Create a recursive JSON type.

**Exercise 15:** Implement `DeepReadonly<T>`.

**Exercise 16:** Implement `DeepPartial<T>`.

**Exercise 17:** Create a nested category structure using recursive interfaces.

## Level 4: Advanced Type Engineering

**Exercise 18:** Create a type-safe event system using template literal types.

**Exercise 19:** Create a discriminated union for payment statuses.

**Exercise 20:** Implement exhaustive checking using `never`.

**Exercise 21:** Create a branded type for UserId and ProductId.

**Exercise 22:** Create a `RequireAtLeastOne<T>` utility.

**Exercise 23:** Create a type-safe API response system using a generic Result type.

**Exercise 24:** Use `satisfies` to validate an application configuration.

**Exercise 25:** Create a generic function using a `const` type parameter.

## Level 5: Enterprise-Level Projects

**Exercise 26: Type-Safe API Client**

Build an API client with:

- Generic request types.
- Generic response types.
- Typed HTTP methods.
- Error handling.
- Runtime validation.
- Type-safe API endpoints.

**Exercise 27: Type-Safe Event Emitter**

Build an event emitter supporting:

- Event maps.
- Generic event names.
- Event-specific payloads.
- Typed listeners.
- Event removal.

**Exercise 28: Type-Safe Form Builder**

Build a form system supporting:

- Generic form values.
- Field-specific types.
- Validation errors.
- Optional fields.
- Nested form structures.

**Exercise 29: Type-Safe Database Repository**

Build a generic repository supporting:

- Entity types.
- Create operations.
- Update operations.
- Find by ID.
- Pagination.
- Typed filters.

**Exercise 30: Enterprise Configuration System**

Build a configuration system supporting:

- Environment-specific configuration.
- Strictly typed keys.
- Runtime validation.
- Default values.
- Nested configuration.
- Type-safe accessors.

---

# 33. Phase 69 Completion Checklist

Before moving to the next phase, make sure you understand these concepts.

| No. | Topic | Completed |
|---|---|---|
| 1 | Advanced Type System | ☐ |
| 2 | Type-Level Programming | ☐ |
| 3 | Advanced Generics | ☐ |
| 4 | Generic Constraints | ☐ |
| 5 | Generic Defaults | ☐ |
| 6 | Generic Inference | ☐ |
| 7 | Covariance | ☐ |
| 8 | Contravariance | ☐ |
| 9 | Invariance | ☐ |
| 10 | Conditional Types | ☐ |
| 11 | Distributive Conditional Types | ☐ |
| 12 | Infer Keyword | ☐ |
| 13 | Mapped Types | ☐ |
| 14 | Key Remapping | ☐ |
| 15 | Template Literal Types | ☐ |
| 16 | Recursive Types | ☐ |
| 17 | Advanced Utility Types | ☐ |
| 18 | Custom Utility Types | ☐ |
| 19 | Type Guards | ☐ |
| 20 | Assertion Functions | ☐ |
| 21 | Discriminated Unions | ☐ |
| 22 | Exhaustive Checking | ☐ |
| 23 | Function Overloads | ☐ |
| 24 | Variadic Tuple Types | ☐ |
| 25 | Indexed Access Types | ☐ |
| 26 | keyof and typeof | ☐ |
| 27 | satisfies Operator | ☐ |
| 28 | const Type Parameters | ☐ |
| 29 | Declaration Merging | ☐ |
| 30 | Module Augmentation | ☐ |
| 31 | Declaration Files | ☐ |
| 32 | Ambient Declarations | ☐ |
| 33 | Compiler Architecture | ☐ |
| 34 | Structural Typing | ☐ |
| 35 | Branded Types | ☐ |
| 36 | Advanced Type Inference | ☐ |
| 37 | Type Performance Optimization | ☐ |
| 38 | Compiler Configuration | ☐ |
| 39 | Type-Safe API Design | ☐ |
| 40 | Enterprise Type Architecture | ☐ |

---

# 34. What Comes Next?

You have now covered advanced TypeScript language engineering, including generic type transformations, conditional types, mapped types, recursive types, compiler internals and enterprise type architecture.

The next phase moves from advanced language features toward practical application engineering.

## Phase 70: Advanced TypeScript – TypeScript with Node.js, Express.js, REST APIs, Middleware, Authentication, Authorization, Database Integration, Sequelize, MongoDB and Enterprise Backend Development

Upcoming topics:

1. TypeScript with Node.js.
2. TypeScript project architecture.
3. TypeScript with Express.js.
4. Express Request and Response typing.
5. Custom middleware typing.
6. Error-handling middleware.
7. Type-safe REST API development.
8. DTOs and request validation.
9. Authentication using JWT.
10. Authorization and Role-Based Access Control.
11. TypeScript with MySQL.
12. TypeScript with Sequelize ORM.
13. TypeScript with MongoDB.
14. TypeScript with Mongoose.
15. Repository and Service patterns.
16. Dependency Injection.
17. Database transactions.
18. Pagination and filtering.
19. File uploads.
20. API security.
21. Logging and monitoring.
22. Testing with Jest or Vitest.
23. Integration testing.
24. Production-ready backend architecture.
25. Complete enterprise backend project.

**Phase 69 is complete.** When you're ready, say **"OK, Continue to Phase 70"** to begin the next lesson.