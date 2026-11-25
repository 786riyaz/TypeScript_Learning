# TypeScript Complete Learning Roadmap
# Phase 14: Generics in TypeScript – Fundamentals

**Level:** Intermediate  
**Prerequisite:** Phase 13 – Enums in TypeScript  
**Goal:** Understand generics and learn how to create reusable, flexible, and type-safe functions, interfaces, classes, and type aliases.

---

# 1. What Are Generics?

Generics allow you to create reusable components that work with different data types while maintaining type safety.

In simple terms:

**Generics allow you to write code once and use it with multiple types without losing type information.**

Consider a function that returns the value passed to it.

Without generics:

```typescript
function getValue(value: any): any {
    return value;
}

const result = getValue("Hello");

console.log(result);
```

The problem is that `any` disables type checking.

For example:

```typescript
const result = getValue("Hello");

console.log(result.toFixed(2));
```

TypeScript does not report an error because `result` has the type `any`, even though `toFixed()` is not a string method.

We need a better solution.

### Using Generics

```typescript
function getValue<T>(value: T): T {
    return value;
}
```

Usage:

```typescript
const stringValue = getValue<string>("Hello");

const numberValue = getValue<number>(100);

const booleanValue = getValue<boolean>(true);
```

TypeScript understands:

```typescript
stringValue;  // string
numberValue;  // number
booleanValue; // boolean
```

Now this produces an error:

```typescript
const result = getValue("Hello");

// Error
result.toFixed(2);
```

Why?

Because TypeScript knows that `result` is a string.

### Understanding `<T>`

In this example:

```typescript
function getValue<T>(value: T): T {
    return value;
}
```

`T` is a generic type parameter.

It acts as a placeholder for a type that will be determined when the function is used.

You can think of it like a variable, but instead of storing a runtime value, it represents a type.

For example:

```typescript
getValue<string>("Hello");
```

Here, `T` becomes `string`.

And:

```typescript
getValue<number>(100);
```

Here, `T` becomes `number`.

**Important:** Generic type parameters exist only in TypeScript's type system. They do not create runtime variables or runtime type information.

---

# 2. Why Do We Need Generics?

Let's understand the problem that generics solve.

Suppose you want to create functions that return the same value passed to them.

### Approach 1: Using any

```typescript
function identity(value: any): any {
    return value;
}
```

Problem:

- No proper type safety.
- Return type information is lost.
- TypeScript cannot reliably detect invalid operations.

### Approach 2: Using Union Types

```typescript
function identity(value: string | number): string | number {
    return value;
}
```

This works for strings and numbers.

But what if you also need:

- Boolean
- Arrays
- Objects
- Tuples
- Custom interfaces

You would have to keep expanding the union.

Also, the return type would remain a union rather than preserving the exact relationship between the input and output.

### Approach 3: Using Generics

```typescript
function identity<T>(value: T): T {
    return value;
}
```

Now the same function supports different types.

```typescript
identity<string>("Hello");

identity<number>(100);

identity<boolean>(true);

identity<{ name: string }>({
    name: "Alex"
});
```

The input type and return type remain connected.

### Comparison

| Approach | Reusable | Type Safety | Preserves Input Type |
|---|---|---|---|
| `any` | Yes | No | No |
| Union types | Limited | Yes | Not always |
| Generics | Yes | Yes | Yes |

**Key takeaway:** Generics allow reusable code without sacrificing type information.

---

# 3. Generic Type Parameters

A generic type parameter is a placeholder representing a type.

You can name it almost anything, but common conventions include:

| Parameter | Common Meaning |
|---|---|
| `T` | Type |
| `U` | Second type |
| `K` | Key |
| `V` | Value |
| `E` | Element or error |
| `R` | Result or return type |

These are conventions, not TypeScript keywords.

### Example

```typescript
function display<T>(value: T): T {
    console.log(value);
    return value;
}
```

Here:

- `<T>` declares a generic type parameter.
- `value: T` means the parameter has type `T`.
- `: T` means the function returns type `T`.

You could also write:

```typescript
function display<Type>(value: Type): Type {
    return value;
}
```

Both are valid.

### Multiple Generic Parameters

You can define more than one generic parameter.

```typescript
function combine<T, U>(first: T, second: U) {
    return {
        first,
        second
    };
}
```

Usage:

```typescript
const result = combine<string, number>("Age", 25);
```

Inferred result:

```typescript
{
    first: string;
    second: number;
}
```

---

# 4. Generic Functions

Generic functions are functions that accept generic type parameters.

They can work with multiple data types while preserving their type information.

### Example 1: Basic Generic Function

```typescript
function getData<T>(data: T): T {
    return data;
}
```

Usage:

```typescript
const name = getData<string>("Riyaz");

const age = getData<number>(25);

const isActive = getData<boolean>(true);
```

### Example 2: Generic Function With Objects

```typescript
function getUser<T>(user: T): T {
    return user;
}

const user = getUser({
    id: 1,
    name: "Alex"
});
```

TypeScript automatically infers:

```typescript
{
    id: number;
    name: string;
}
```

### Example 3: Generic Function With Arrays

```typescript
function getArray<T>(items: T[]): T[] {
    return items;
}
```

Usage:

```typescript
const names = getArray<string>([
    "Alex",
    "John",
    "Sam"
]);

const numbers = getArray<number>([
    10,
    20,
    30
]);
```

The returned types are:

```typescript
string[]
number[]
```

### Example 4: Generic Function With Tuples

```typescript
function getTuple<T, U>(first: T, second: U): [T, U] {
    return [first, second];
}
```

Usage:

```typescript
const result = getTuple<string, number>("Age", 25);
```

Result type:

```typescript
[string, number]
```

---

# 5. Generic Type Inference

You don't always need to explicitly specify generic types.

TypeScript can often infer generic type parameters from function arguments.

This is called **Generic Type Inference**.

### Example 1: Without Explicit Type Arguments

```typescript
function getValue<T>(value: T): T {
    return value;
}

const name = getValue("Alex");

const age = getValue(25);
```

TypeScript automatically infers:

```typescript
name; // string
age;  // number
```

### Example 2: Explicit vs Inferred Types

Explicit:

```typescript
const result = getValue<string>("Hello");
```

Inferred:

```typescript
const result = getValue("Hello");
```

Both produce the same useful type information.

### Example 3: Generic Type Inference With Multiple Parameters

```typescript
function combine<T, U>(first: T, second: U) {
    return [first, second];
}

const result = combine("Alex", 25);
```

TypeScript infers:

```typescript
(string | number)[]
```

Why is this an array rather than a tuple?

Because the function's return expression is an ordinary array literal.

If you want a tuple, explicitly annotate the return type:

```typescript
function combine<T, U>(first: T, second: U): [T, U] {
    return [first, second];
}

const result = combine("Alex", 25);
```

Now the result is:

```typescript
[string, number]
```

**Best practice:** Prefer type inference when TypeScript can determine the correct generic types clearly.

---

# 6. Explicit Generic Type Arguments

You can explicitly specify generic types when calling a function.

The syntax is:

```typescript
functionName<Type>(arguments);
```

### Example 1

```typescript
function display<T>(value: T): T {
    return value;
}

const result = display<string>("Hello");
```

Here, you explicitly specify that `T` is `string`.

### Example 2: Multiple Types

```typescript
function combine<T, U>(first: T, second: U): [T, U] {
    return [first, second];
}

const result = combine<string, number>("Age", 25);
```

### Example 3: Object Type

```typescript
type User = {
    id: number;
    name: string;
};

function getData<T>(data: T): T {
    return data;
}

const user = getData<User>({
    id: 1,
    name: "Alex"
});
```

### When Should You Specify Generic Types Explicitly?

Use explicit generic arguments when:

- TypeScript cannot infer the desired type.
- You want to make the intended type clearer.
- You want to control the type instead of relying on inference.
- The function arguments do not provide enough information for inference.

Otherwise, inference is generally preferable.

---

# 7. Generic Functions With Multiple Parameters

A generic function can have multiple parameters that use the same generic type.

### Example 1: Two Values of the Same Type

```typescript
function compare<T>(first: T, second: T): boolean {
    return first === second;
}
```

Usage:

```typescript
compare<number>(10, 20);

compare<string>("Hello", "Hello");

compare<boolean>(true, false);
```

Here, both parameters must have the same inferred or specified type.

### Example 2: Different Types

```typescript
function combine<T, U>(first: T, second: U) {
    return {
        first,
        second
    };
}
```

Usage:

```typescript
const result = combine("Alex", 25);
```

The inferred type:

```typescript
{
    first: string;
    second: number;
}
```

### Example 3: Three Generic Parameters

```typescript
function createRecord<T, U, V>(
    id: T,
    name: U,
    active: V
) {
    return {
        id,
        name,
        active
    };
}
```

Usage:

```typescript
const record = createRecord(
    1,
    "Alex",
    true
);
```

Result:

```typescript
{
    id: number;
    name: string;
    active: boolean;
}
```

**Important:** Generic parameters let you express relationships between different values and types.

---

# 8. Generic Return Types

A generic function can return values using its generic type parameters.

### Example 1: Returning the Same Type

```typescript
function identity<T>(value: T): T {
    return value;
}
```

The return type is the same as the input type.

### Example 2: Returning an Array

```typescript
function createArray<T>(value: T): T[] {
    return [value];
}
```

Usage:

```typescript
const names = createArray("Alex");

const numbers = createArray(100);
```

Result:

```typescript
string[]
number[]
```

### Example 3: Returning an Object

```typescript
function wrapValue<T>(value: T) {
    return {
        data: value
    };
}
```

Usage:

```typescript
const result = wrapValue("Hello");
```

Inferred return type:

```typescript
{
    data: string;
}
```

### Example 4: Different Input and Return Types

```typescript
function createResponse<T>(
    data: T,
    message: string
): {
    success: boolean;
    message: string;
    data: T;
} {
    return {
        success: true,
        message,
        data
    };
}
```

Usage:

```typescript
const response = createResponse(
    {
        id: 1,
        name: "Alex"
    },
    "User fetched successfully"
);
```

Result:

```typescript
{
    success: boolean;
    message: string;
    data: {
        id: number;
        name: string;
    };
}
```

---

# 9. Generic Arrays

Generics are frequently used with arrays.

### Example 1: Generic Array Function

```typescript
function getFirstElement<T>(items: T[]): T | undefined {
    return items[0];
}
```

Usage:

```typescript
const firstName = getFirstElement([
    "Alex",
    "John",
    "Sam"
]);

const firstNumber = getFirstElement([
    10,
    20,
    30
]);
```

Inferred return types:

```typescript
string | undefined
number | undefined
```

Why `undefined`?

Because an array can be empty, so accessing its first element may return `undefined`.

### Example 2: Generic Array With Array<T>

You can use either syntax:

```typescript
function getItems<T>(items: T[]): T[] {
    return items;
}
```

Or:

```typescript
function getItems<T>(items: Array<T>): Array<T> {
    return items;
}
```

Both represent the same basic array type.

### Example 3: Generic Array With Readonly

```typescript
function displayItems<T>(items: readonly T[]): void {
    items.forEach(item => {
        console.log(item);
    });
}
```

This function accepts both mutable and readonly arrays but cannot modify the array through the supplied reference.

### Example 4: Generic Array Mapping

```typescript
function transformArray<T, U>(
    items: T[],
    callback: (item: T) => U
): U[] {
    return items.map(callback);
}
```

Usage:

```typescript
const names = ["Alex", "John", "Sam"];

const lengths = transformArray(
    names,
    name => name.length
);
```

Result:

```typescript
number[]
```

Here:

- `T` is `string`.
- `U` is `number`.

The input array contains strings, while the output array contains numbers.

---

# 10. Generic Type Aliases

You can use generics with type aliases.

This allows you to create reusable type definitions.

### Example 1: Basic Generic Type Alias

```typescript
type Container<T> = {
    value: T;
};
```

Usage:

```typescript
const stringContainer: Container<string> = {
    value: "Hello"
};

const numberContainer: Container<number> = {
    value: 100
};
```

The resulting types are:

```typescript
Container<string>
Container<number>
```

### Example 2: Generic API Response

This is an extremely common pattern in frontend and backend development.

```typescript
type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};
```

Usage with a user:

```typescript
type User = {
    id: number;
    name: string;
};

const userResponse: ApiResponse<User> = {
    success: true,
    message: "User fetched",
    data: {
        id: 1,
        name: "Alex"
    }
};
```

Usage with products:

```typescript
type Product = {
    id: number;
    name: string;
    price: number;
};

const productResponse: ApiResponse<Product> = {
    success: true,
    message: "Products fetched",
    data: {
        id: 101,
        name: "Laptop",
        price: 50000
    }
};
```

The same `ApiResponse<T>` type works with different data structures.

### Example 3: Generic List Response

```typescript
type ListResponse<T> = {
    total: number;
    items: T[];
};
```

Usage:

```typescript
const users: ListResponse<User> = {
    total: 2,
    items: [
        {
            id: 1,
            name: "Alex"
        },
        {
            id: 2,
            name: "John"
        }
    ]
};
```

### Example 4: Generic Result Type

```typescript
type Result<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: string;
};
```

Usage:

```typescript
const result: Result<User> = {
    success: true,
    data: {
        id: 1,
        name: "Alex"
    }
};
```

This combines generics with discriminated unions.

---

# 11. Generic Interfaces

Interfaces can also accept generic type parameters.

### Example 1: Basic Generic Interface

```typescript
interface Box<T> {
    value: T;
}
```

Usage:

```typescript
const stringBox: Box<string> = {
    value: "Hello"
};

const numberBox: Box<number> = {
    value: 100
};
```

### Example 2: Generic User Interface

```typescript
interface User<T> {
    id: number;
    name: string;
    metadata: T;
}
```

Usage:

```typescript
const user: User<string> = {
    id: 1,
    name: "Alex",
    metadata: "Premium User"
};
```

Another example:

```typescript
const anotherUser: User<{
    department: string;
    experience: number;
}> = {
    id: 2,
    name: "John",
    metadata: {
        department: "Engineering",
        experience: 5
    }
};
```

### Example 3: Generic Repository Interface

A repository is an abstraction commonly used to organize database operations.

```typescript
interface Repository<T> {
    findAll(): T[];

    findById(id: number): T | undefined;

    create(data: T): T;

    update(id: number, data: Partial<T>): T | undefined;

    delete(id: number): boolean;
}
```

This interface can describe repositories for users, products, orders, and other entities.

For example:

```typescript
type Product = {
    id: number;
    name: string;
    price: number;
};

type ProductRepository = Repository<Product>;
```

Now `ProductRepository` represents a repository specifically for products.

### Example 4: Generic Interface With Multiple Parameters

```typescript
interface KeyValue<K, V> {
    key: K;
    value: V;
}
```

Usage:

```typescript
const userRecord: KeyValue<number, string> = {
    key: 1,
    value: "Alex"
};
```

Result:

- `K` is `number`.
- `V` is `string`.

---

# 12. Generic Classes

Classes can also use generic type parameters.

This allows a class to work with different data types while preserving type safety.

### Example 1: Basic Generic Class

```typescript
class Box<T> {
    value: T;

    constructor(value: T) {
        this.value = value;
    }

    getValue(): T {
        return this.value;
    }
}
```

Usage:

```typescript
const stringBox = new Box<string>("Hello");

const numberBox = new Box<number>(100);
```

Result:

```typescript
stringBox.getValue(); // string
numberBox.getValue(); // number
```

### Example 2: Generic Class With Inference

You don't always need to specify the generic type explicitly.

```typescript
const box = new Box("Hello");
```

TypeScript infers:

```typescript
Box<string>
```

### Example 3: Generic Stack Class

A stack is a data structure that follows the LIFO principle:

**Last In, First Out.**

```typescript
class Stack<T> {
    private items: T[] = [];

    push(item: T): void {
        this.items.push(item);
    }

    pop(): T | undefined {
        return this.items.pop();
    }

    peek(): T | undefined {
        return this.items[this.items.length - 1];
    }

    size(): number {
        return this.items.length;
    }
}
```

Usage:

```typescript
const numberStack = new Stack<number>();

numberStack.push(10);
numberStack.push(20);
numberStack.push(30);

console.log(numberStack.pop()); // 30
```

Another stack:

```typescript
const stringStack = new Stack<string>();

stringStack.push("A");
stringStack.push("B");

console.log(stringStack.pop()); // B
```

The same class works with different types.

### Example 4: Generic Data Store

```typescript
class DataStore<T> {
    private data: T[] = [];

    add(item: T): void {
        this.data.push(item);
    }

    getAll(): T[] {
        return this.data;
    }

    getByIndex(index: number): T | undefined {
        return this.data[index];
    }
}
```

Usage:

```typescript
const userStore = new DataStore<User>();

userStore.add({
    id: 1,
    name: "Alex"
});
```

You can also create:

```typescript
const productStore = new DataStore<Product>();
```

---

# 13. Generic Type Parameters With Multiple Types

You can use multiple generic parameters in functions, interfaces, aliases, and classes.

### Example 1: Generic Pair

```typescript
type Pair<T, U> = {
    first: T;
    second: U;
};
```

Usage:

```typescript
const pair: Pair<string, number> = {
    first: "Age",
    second: 25
};
```

### Example 2: Generic API Response

```typescript
type ApiResponse<T, E> = {
    data: T;
    error: E;
};
```

Usage:

```typescript
type User = {
    id: number;
    name: string;
};

type ApiError = {
    code: number;
    message: string;
};

const response: ApiResponse<User, ApiError> = {
    data: {
        id: 1,
        name: "Alex"
    },
    error: {
        code: 0,
        message: ""
    }
};
```

This example represents both data and error structures.

In a real API design, you may instead prefer a discriminated union where success and error states are mutually exclusive.

### Example 3: Generic Function

```typescript
function createObject<T, U>(
    first: T,
    second: U
): {
    first: T;
    second: U;
} {
    return {
        first,
        second
    };
}
```

Usage:

```typescript
const result = createObject(
    "Username",
    100
);
```

---

# 14. Generic Functions With Callbacks

Generics are frequently used when working with callback functions.

### Example 1: Basic Callback

```typescript
function processValue<T>(
    value: T,
    callback: (data: T) => void
): void {
    callback(value);
}
```

Usage:

```typescript
processValue<string>(
    "Hello",
    value => {
        console.log(value.toUpperCase());
    }
);
```

### Example 2: Transforming Data

```typescript
function transform<T, U>(
    value: T,
    callback: (value: T) => U
): U {
    return callback(value);
}
```

Usage:

```typescript
const result = transform(
    "Hello",
    value => value.length
);
```

TypeScript infers:

```typescript
result; // number
```

Here:

- `T` is `string`.
- `U` is `number`.

### Example 3: Filtering Data

```typescript
function filterItems<T>(
    items: T[],
    callback: (item: T) => boolean
): T[] {
    return items.filter(callback);
}
```

Usage:

```typescript
const numbers = [10, 20, 30, 40, 50];

const filtered = filterItems(
    numbers,
    number => number > 25
);
```

Result:

```typescript
[30, 40, 50]
```

This is a simplified generic filtering function. Later, we will explore how type predicates can make filtering narrow the output type as well.

---

# 15. Generic Type Parameters With Default Values

Generic parameters can have default types.

This allows callers to omit a generic argument and use a predefined default.

### Example 1: Basic Default

```typescript
type Container<T = string> = {
    value: T;
};
```

Usage:

```typescript
const first: Container = {
    value: "Hello"
};
```

Here, `T` defaults to `string`.

You can override it:

```typescript
const second: Container<number> = {
    value: 100
};
```

### Example 2: Multiple Generic Parameters

```typescript
type ApiResponse<T, U = string> = {
    data: T;
    message: U;
};
```

Usage:

```typescript
type User = {
    id: number;
    name: string;
};

const response: ApiResponse<User> = {
    data: {
        id: 1,
        name: "Alex"
    },
    message: "Success"
};
```

Here:

- `T` is `User`.
- `U` defaults to `string`.

### Important Rules

1. Required generic parameters must come before optional/defaulted ones.
2. A default generic type is used when the caller does not provide an argument for that parameter.
3. A default type must satisfy any constraint on that parameter.

Example:

```typescript
type Response<T, U = string> = {
    data: T;
    message: U;
};
```

This is valid.

But placing a required parameter after a defaulted one is not allowed:

```typescript
// Invalid generic parameter ordering
// type Response<T = string, U> = ...
```

---

# 16. Real-World Application: Generic API Response Handler

Let's build a reusable API response structure.

### Step 1: Define the Generic Type

```typescript
type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};
```

### Step 2: Define Data Types

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};

type Product = {
    id: number;
    name: string;
    price: number;
};
```

### Step 3: Create User Response

```typescript
const userResponse: ApiResponse<User> = {
    success: true,
    message: "User fetched successfully",
    data: {
        id: 1,
        name: "Alex",
        email: "alex@example.com"
    }
};
```

### Step 4: Create Product Response

```typescript
const productResponse: ApiResponse<Product[]> = {
    success: true,
    message: "Products fetched successfully",
    data: [
        {
            id: 101,
            name: "Laptop",
            price: 50000
        },
        {
            id: 102,
            name: "Mouse",
            price: 500
        }
    ]
};
```

### Step 5: Create a Generic Function

```typescript
function displayResponse<T>(response: ApiResponse<T>): void {
    console.log(response.message);
    console.log(response.data);
}
```

Usage:

```typescript
displayResponse(userResponse);

displayResponse(productResponse);
```

The same function handles both response types.

---

# 17. Real-World Application: Generic CRUD Repository

Let's create a simplified repository abstraction.

### Step 1: Define the Repository Interface

```typescript
interface Repository<T> {
    create(data: T): T;

    findAll(): T[];

    findById(id: number): T | undefined;

    delete(id: number): boolean;
}
```

### Step 2: Define a User Type

```typescript
type User = {
    id: number;
    name: string;
};
```

### Step 3: Implement the Generic Repository

```typescript
class InMemoryRepository<T extends { id: number }>
    implements Repository<T> {

    private items: T[] = [];

    create(data: T): T {
        this.items.push(data);
        return data;
    }

    findAll(): T[] {
        return this.items;
    }

    findById(id: number): T | undefined {
        return this.items.find(item => item.id === id);
    }

    delete(id: number): boolean {
        const index = this.items.findIndex(
            item => item.id === id
        );

        if (index === -1) {
            return false;
        }

        this.items.splice(index, 1);

        return true;
    }
}
```

Notice this part:

```typescript
T extends { id: number }
```

It means that `T` must be a type containing an `id` property of type `number`.

We will study generic constraints in detail in Phase 15.

### Step 4: Create a User Repository

```typescript
const userRepository = new InMemoryRepository<User>();

userRepository.create({
    id: 1,
    name: "Alex"
});

userRepository.create({
    id: 2,
    name: "John"
});
```

### Step 5: Retrieve Users

```typescript
console.log(userRepository.findAll());

console.log(userRepository.findById(1));
```

### Step 6: Delete Users

```typescript
userRepository.delete(1);
```

### Step 7: Create a Product Repository

```typescript
type Product = {
    id: number;
    name: string;
    price: number;
};

const productRepository =
    new InMemoryRepository<Product>();

productRepository.create({
    id: 101,
    name: "Laptop",
    price: 50000
});
```

The same repository implementation works with different entities.

**Important:** This is an in-memory example, not a complete database repository. It demonstrates the type design. Real database implementations need additional concerns such as asynchronous operations, validation, persistence, and error handling.

---

# 18. Common Mistakes in Generics

### Mistake 1: Using any Instead of Generics

Avoid:

```typescript
function identity(value: any): any {
    return value;
}
```

Prefer:

```typescript
function identity<T>(value: T): T {
    return value;
}
```

### Mistake 2: Forgetting to Declare the Generic Parameter

Incorrect:

```typescript
// T has not been declared.
function getValue(value: T): T {
    return value;
}
```

Correct:

```typescript
function getValue<T>(value: T): T {
    return value;
}
```

### Mistake 3: Expecting Generic Parameters at Runtime

Incorrect:

```typescript
function getData<T>() {
    // T is not a runtime constructor or variable.
}
```

You cannot use `T` directly with `instanceof` or `new` because generic type parameters are erased during compilation.

### Mistake 4: Using Generics When They Are Not Necessary

For example:

```typescript
function getName<T extends string>(name: T): string {
    return name;
}
```

If you don't need to preserve the exact string subtype, this is simpler:

```typescript
function getName(name: string): string {
    return name;
}
```

Generics should express a meaningful relationship between types, not simply make every function generic.

### Mistake 5: Losing Tuple Information

Consider:

```typescript
function combine<T, U>(first: T, second: U) {
    return [first, second];
}
```

The inferred result is an array with a union element type, not necessarily a tuple.

If you need a tuple:

```typescript
function combine<T, U>(first: T, second: U): [T, U] {
    return [first, second];
}
```

### Mistake 6: Confusing Generic Parameters With Function Parameters

In:

```typescript
function getValue<T>(value: T): T {
    return value;
}
```

- `<T>` is a generic type parameter.
- `(value: T)` is a normal function parameter.
- `: T` is the return type annotation.

These are different concepts.

---

# 19. Interview Questions and Answers

### Q1. What are generics in TypeScript?

Generics allow developers to create reusable components that work with multiple data types while maintaining type safety.

### Q2. Why do we need generics?

Generics help avoid code duplication and reduce the need for `any`, while preserving relationships between input and output types.

### Q3. What does `<T>` mean?

`T` is a generic type parameter that acts as a placeholder for a type.

### Q4. What is the difference between any and generics?

`any` disables much of TypeScript's type checking. Generics preserve type information and enforce relationships between values.

### Q5. Can a generic function have multiple type parameters?

Yes.

```typescript
function combine<T, U>(first: T, second: U) {
    return [first, second];
}
```

### Q6. What is generic type inference?

Generic type inference is TypeScript's ability to determine generic type parameters automatically from function arguments and contextual information.

### Q7. Do we always need to specify generic types explicitly?

No. TypeScript can usually infer generic types. Explicit type arguments are useful when inference is insufficient or when you want to control the type.

### Q8. Can interfaces use generics?

Yes.

```typescript
interface Box<T> {
    value: T;
}
```

### Q9. Can classes use generics?

Yes. Generic classes allow class instances to work with different data types while preserving type information.

### Q10. Can type aliases use generics?

Yes.

```typescript
type Response<T> = {
    data: T;
};
```

### Q11. What are default generic type parameters?

They allow a generic parameter to use a predefined type when the caller does not specify one.

### Q12. Can generic types exist at runtime?

No. Generic type parameters are erased during TypeScript compilation.

### Q13. What is the difference between T and U?

There is no language-level difference. They are simply common naming conventions for different generic type parameters.

### Q14. Can generics work with arrays?

Yes. For example:

```typescript
function getItems<T>(items: T[]): T[] {
    return items;
}
```

### Q15. Can generics be used with callbacks?

Yes. Generic callbacks allow input and output types to remain connected.

### Q16. When should you avoid generics?

Avoid generics when they do not provide useful type relationships or improve reusability. A simple concrete type may be clearer.

---

# 20. Practical Exercises

Complete these exercises before moving to Phase 15.

### Exercise 1: Generic Identity Function

Create:

```typescript
function identity<T>(value: T): T
```

Requirements:

- Accept strings.
- Accept numbers.
- Accept booleans.
- Accept objects.
- Preserve the original type.

### Exercise 2: Generic Array Function

Create:

```typescript
function getFirstElement<T>(items: T[]): T | undefined
```

Requirements:

- Accept arrays of strings.
- Accept arrays of numbers.
- Accept arrays of objects.
- Return the first element.

### Exercise 3: Multiple Generic Parameters

Create:

```typescript
function createPair<T, U>(first: T, second: U): [T, U]
```

Test it with:

- String and number.
- Number and boolean.
- Object and string.

### Exercise 4: Generic Type Alias

Create:

```typescript
type Box<T> = {
    value: T;
};
```

Create:

- `Box<string>`
- `Box<number>`
- `Box<boolean>`
- `Box<User>`

### Exercise 5: Generic Interface

Create:

```typescript
interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
}
```

Use it with:

- User.
- Product.
- Array of users.
- Array of products.

### Exercise 6: Generic Class

Create a generic `DataStore<T>` class.

Requirements:

1. Store an array of items.
2. Add an item.
3. Remove an item.
4. Get all items.
5. Get an item by index.

### Exercise 7: Generic Callback Function

Create:

```typescript
function transform<T, U>(
    value: T,
    callback: (value: T) => U
): U
```

Test:

- String to number.
- Number to string.
- String to boolean.

### Exercise 8: Generic Default Types

Create:

```typescript
type ApiResponse<T, U = string> = {
    data: T;
    message: U;
};
```

Test it with default and custom message types.

### Exercise 9: Generic Repository

Create a generic repository with:

- `create()`
- `findAll()`
- `findById()`
- `update()`
- `delete()`

Use it for both users and products.

### Exercise 10: Generic API Response Handler

Create a generic API response handler that:

1. Accepts an API response.
2. Prints the response message.
3. Returns the response data.
4. Works with users and products.
5. Preserves the correct return type.

---

# 21. Phase 14 Completion Checklist

You should now understand:

- [ ] What generics are.
- [ ] Why generics are needed.
- [ ] Problems with `any`.
- [ ] Generic type parameters.
- [ ] Generic functions.
- [ ] Multiple generic parameters.
- [ ] Generic type inference.
- [ ] Explicit generic type arguments.
- [ ] Generic return types.
- [ ] Generic arrays.
- [ ] Readonly generic arrays.
- [ ] Generic type aliases.
- [ ] Generic interfaces.
- [ ] Generic classes.
- [ ] Generic callbacks.
- [ ] Generic default types.
- [ ] Generic API responses.
- [ ] Generic repository patterns.
- [ ] Common mistakes and best practices.

---

## What's Next?

# Phase 15: Generic Constraints, keyof, and Advanced Generic Techniques

In the next phase, we will cover:

1. What are generic constraints?
2. Why do we need `extends` in generics?
3. Constraining generic types.
4. Constraining generic objects.
5. `keyof` operator.
6. Using `keyof` with generics.
7. Generic functions with object properties.
8. Accessing object properties safely.
9. Generic constraints with multiple properties.
10. Generic constraints with interfaces.
11. Generic constraints with type aliases.
12. Default generic constraints.
13. Generic constraints with unions.
14. Practical `getProperty()` implementation.
15. Real-world generic utility functions.

**When you're ready, say: `OK, Phase 15`.**