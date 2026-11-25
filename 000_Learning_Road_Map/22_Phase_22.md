# Phase 22: Advanced TypeScript – Decorators, Metadata, and Metaprogramming

**Level:** Advanced  
**Prerequisites:**
- Phase 9: Interfaces
- Phase 14: Generics
- Phase 16: Conditional Types
- Phase 20: Advanced Function Types
- Phase 21: Classes and Object-Oriented Programming

## Learning Objectives

By the end of this phase, you will understand:

1. What decorators are.
2. How decorators work in TypeScript.
3. Standard decorators vs legacy decorators.
4. Class decorators.
5. Method decorators.
6. Property and field decorators.
7. Accessor decorators.
8. Parameter decorators.
9. Decorator factories.
10. Decorator composition and execution order.
11. Decorators with generics.
12. Metadata and reflection.
13. `reflect-metadata`.
14. Decorators in NestJS.
15. Real-world logging, validation, and authorization decorators.
16. Metaprogramming concepts.

---

# 1. What Are Decorators?

A decorator is a special function that can be attached to a class or one of its members to modify, observe, or extend its behavior.

Decorators allow us to add reusable functionality without repeatedly writing the same code inside every class or method.

They are commonly used for:

- Logging.
- Validation.
- Authentication.
- Authorization.
- Dependency injection.
- Caching.
- Measuring execution time.
- Framework configuration.
- Routing.

### Example without decorators

Suppose you have multiple methods that need logging.

```typescript
class UserService {
    getUser(): void {
        console.log("Method started");

        console.log("Fetching user");

        console.log("Method completed");
    }

    createUser(): void {
        console.log("Method started");

        console.log("Creating user");

        console.log("Method completed");
    }
}
```

You have to repeat the logging logic in every method.

### Using a decorator

```typescript
function Log(
    originalMethod: Function,
    context: ClassMethodDecoratorContext
) {
    console.log("Decorator registered");
}

class UserService {
    @Log
    getUser(): void {
        console.log("Fetching user");
    }

    @Log
    createUser(): void {
        console.log("Creating user");
    }
}
```

The decorator is applied to the methods.

We can use decorators to centralize reusable behavior.

**Important:** The example above uses modern standard decorators, which we will study first.

---

# 2. Two Decorator Systems in TypeScript

This is one of the most important concepts in this phase.

TypeScript supports two decorator systems:

1. Standard decorators.
2. Legacy experimental decorators.

They have different APIs and behavior.

## A. Standard Decorators

Standard decorators follow the modern JavaScript decorator model.

They are supported in TypeScript 5.0 and later.

They use:

- Decorator values.
- Context objects.
- Optional replacement functions or values.
- Initializer functions.

Example:

```typescript
function Log(
    value: Function,
    context: ClassMethodDecoratorContext
) {
    console.log(context.name);
}
```

Standard decorators do not require:

```json
{
    "compilerOptions": {
        "experimentalDecorators": true
    }
}
```

## B. Legacy Decorators

Legacy decorators use TypeScript's older experimental decorator implementation.

They are commonly used by frameworks such as NestJS.

They generally require:

```json
{
    "compilerOptions": {
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    }
}
```

Legacy decorators use different function signatures.

For example, a legacy method decorator receives:

1. Target.
2. Property key.
3. Property descriptor.

```typescript
function Log(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    console.log(propertyKey);
}
```

### Comparison

| Feature | Standard decorators | Legacy decorators |
|---|---|---|
| TypeScript support | TS 5.0+ | Older TypeScript decorator implementation |
| Specification | Modern JavaScript decorator model | TypeScript experimental implementation |
| Context object | Yes | No |
| Method decorator arguments | Method value and context | Target, key, descriptor |
| Parameter decorators | Not supported | Supported |
| `emitDecoratorMetadata` | Not supported by this model | Supported |
| `experimentalDecorators` | Not required | Required |
| NestJS ecosystem | Not the traditional NestJS decorator model | Commonly used |

**Important:** Do not mix standard and legacy decorator examples. Their signatures and capabilities are different.

We will learn standard decorators first and then study legacy decorators separately.

---

# 3. Setting Up a Decorator Project

For standard decorators, you can use a normal TypeScript configuration.

Example:

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "NodeNext",
        "strict": true,
        "outDir": "./dist",
        "rootDir": "./src"
    },
    "include": ["src"]
}
```

For legacy decorators, configure:

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "CommonJS",
        "strict": true,
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,
        "outDir": "./dist"
    }
}
```

Install the metadata library if you plan to use legacy metadata reflection:

```bash
npm install reflect-metadata
```

**Note:** The two configurations are illustrative. You can use different module systems depending on your project.

---

# 4. Understanding Decorator Syntax

A decorator is applied using the `@` symbol.

### Basic syntax

```typescript
@DecoratorName
class User {}
```

Here:

- `@` identifies a decorator application.
- `DecoratorName` refers to the decorator function.
- The decorator is associated with the class.

Decorators can also be applied to class members.

```typescript
class User {
    @Log
    getUser(): void {}
}
```

### Important terminology

| Term | Meaning |
|---|---|
| Decorator | Function applied to a declaration |
| Decorator expression | Expression evaluated to obtain a decorator |
| Decorator factory | Function that returns a decorator |
| Context | Information about the decorated element |
| Metadata | Additional information associated with an element |
| Metaprogramming | Writing programs that inspect or modify other program structures |

---

# 5. Class Decorators – Standard Decorators

A class decorator is applied to a class declaration.

It receives:

1. The class constructor.
2. A class context object.

### Example

```typescript
function LogClass(
    value: Function,
    context: ClassDecoratorContext
) {
    console.log("Class name:", context.name);
}

@LogClass
class User {
    constructor(public name: string) {}
}
```

Output:

```text
Class name: User
```

### Understanding the parameters

```typescript
function LogClass(
    value: Function,
    context: ClassDecoratorContext
)
```

`value` represents the class constructor.

`context` provides information about the decorated class.

For example:

```typescript
context.name
```

Returns the class name when available.

### Class decorator that modifies a class

A standard class decorator can return a replacement class.

Example:

```typescript
function AddTimestamp<
    T extends new (...args: any[]) => {}
>(
    value: T,
    context: ClassDecoratorContext
) {
    return class extends value {
        createdAt = new Date();
    };
}
```

Usage:

```typescript
@AddTimestamp
class User {
    constructor(public name: string) {}
}
```

Now:

```typescript
const user = new User("Riyaz");

console.log(user.name);

console.log(user.createdAt);
```

The replacement class adds a `createdAt` property.

### Important

A class decorator can:

- Observe the class.
- Return a replacement class.
- Register initialization behavior.
- Associate metadata with the class.

A replacement must remain compatible with the original class type.

---

# 6. Method Decorators – Standard Decorators

Method decorators are applied to class methods.

They can inspect or replace the original method.

### Example

```typescript
function LogMethod(
    originalMethod: Function,
    context: ClassMethodDecoratorContext
) {
    console.log("Method name:", context.name);
}

class UserService {
    @LogMethod
    getUser(): void {
        console.log("Fetching user");
    }
}
```

Output:

```text
Method name: getUser
```

### Understanding the context

The context object provides useful information.

Some important properties and methods include:

| Property or method | Purpose |
|---|---|
| `context.kind` | Identifies the decorated element kind |
| `context.name` | Name of the decorated member |
| `context.static` | Whether the member is static |
| `context.private` | Whether the member is private |
| `context.access` | Provides access-related operations |
| `context.addInitializer()` | Registers an initializer |
| `context.metadata` | Provides decorator metadata when available |

For a method decorator:

```typescript
context.kind
```

returns:

```text
method
```

### Replacing a method

Now let's create a decorator that logs method execution.

```typescript
function LogMethod<
    This,
    Args extends unknown[],
    Return
>(
    originalMethod: (
        this: This,
        ...args: Args
    ) => Return,
    context: ClassMethodDecoratorContext<
        This,
        (this: This, ...args: Args) => Return
    >
) {
    return function (
        this: This,
        ...args: Args
    ): Return {
        console.log(`Executing ${String(context.name)}`);

        const result = originalMethod.apply(this, args);

        console.log("Execution completed");

        return result;
    };
}
```

Usage:

```typescript
class UserService {
    @LogMethod
    getUser(id: number): string {
        console.log("Fetching user:", id);

        return "Riyaz";
    }
}
```

Execution:

```typescript
const service = new UserService();

const user = service.getUser(1);
```

Output:

```text
Executing getUser
Fetching user: 1
Execution completed
```

### What happens internally?

The decorator receives the original method.

It returns a replacement function.

The replacement:

1. Logs method execution.
2. Calls the original method.
3. Returns the original result.

### Important

The generic parameters preserve:

- The `this` type.
- The argument tuple.
- The return type.

This makes the decorator reusable across different methods.

---

# 7. Property and Field Decorators – Standard Decorators

Standard decorators distinguish between fields and accessors.

A field decorator receives:

- The field initializer value, which is `undefined` in the decorator API.
- A field context object.

It can return an initializer function.

### Example

```typescript
function DefaultValue(
    value: undefined,
    context: ClassFieldDecoratorContext
) {
    return function (initialValue: unknown) {
        return initialValue ?? "Guest";
    };
}
```

Usage:

```typescript
class User {
    @DefaultValue
    name?: string;
}
```

Now:

```typescript
const user = new User();

console.log(user.name);
```

Output:

```text
Guest
```

### Understanding the initializer

```typescript
return function (initialValue: unknown) {
    return initialValue ?? "Guest";
};
```

The returned function transforms the initial field value.

### Another example

```typescript
function Uppercase(
    value: undefined,
    context: ClassFieldDecoratorContext
) {
    return function (initialValue: string) {
        return initialValue.toUpperCase();
    };
}
```

Usage:

```typescript
class User {
    @Uppercase
    name = "riyaz";
}
```

Result:

```typescript
const user = new User();

console.log(user.name);
```

Output:

```text
RIYAZ
```

**Important:** This decorator example is specifically for a field initialized with a string. A production decorator should use more precise typing and account for other possible initial values.

### Field decorator limitations

A standard field decorator does not receive the property descriptor used by legacy decorators.

It also cannot directly replace a field with a getter/setter descriptor in the same way a legacy property descriptor decorator can.

For more advanced property behavior, standard decorators provide accessor decorators.

---

# 8. Accessor Decorators – Standard Decorators

An accessor decorator is applied to an auto-accessor.

An auto-accessor uses the `accessor` keyword.

### Example

```typescript
class User {
    accessor name: string = "Riyaz";
}
```

TypeScript generates the underlying getter and setter behavior.

Now let's create a decorator that transforms values.

```typescript
function UppercaseAccessor(
    target: ClassAccessorDecoratorTarget<object, string>,
    context: ClassAccessorDecoratorContext<object, string>
) {
    return {
        set(this: object, value: string) {
            target.set.call(this, value.toUpperCase());
        }
    };
}
```

Usage:

```typescript
class User {
    @UppercaseAccessor
    accessor name: string = "riyaz";
}
```

Now:

```typescript
const user = new User();

console.log(user.name);
```

Output:

```text
RIYAZ
```

Assignment:

```typescript
user.name = "ahmed";

console.log(user.name);
```

Output:

```text
AHMED
```

### Understanding the accessor decorator

The original accessor provides operations such as:

- `get`
- `set`

The decorator can replace one or both operations.

In this example, we replace the setter and transform the assigned value before storing it.

### When should you use accessor decorators?

They are useful for:

- Data transformation.
- Property validation.
- Tracking changes.
- Logging assignments.
- Implementing controlled property access.

---

# 9. Parameter Decorators

Parameter decorators are an important topic, especially when learning NestJS.

However, there is a critical distinction:

**Standard decorators do not support parameter decorators.**

Parameter decorators are available in TypeScript's legacy decorator system.

### Legacy parameter decorator example

```typescript
function LogParameter(
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
) {
    console.log(
        "Method:",
        propertyKey,
        "Parameter index:",
        parameterIndex
    );
}
```

Usage:

```typescript
class UserService {
    getUser(
        @LogParameter id: number,
        @LogParameter name: string
    ): void {
        console.log(id, name);
    }
}
```

Output during class definition:

```text
Method: getUser Parameter index: 1
Method: getUser Parameter index: 0
```

The exact order reflects how the legacy parameter decorators are applied.

### Understanding the parameters

| Parameter | Meaning |
|---|---|
| `target` | Class prototype for instance methods, or constructor for static methods |
| `propertyKey` | Name of the method |
| `parameterIndex` | Zero-based position of the parameter |

### Real-world use

Parameter decorators are used in frameworks to identify:

- Request parameters.
- Route parameters.
- Injected dependencies.
- Query parameters.
- Body parameters.

For example, NestJS uses decorators such as:

```typescript
@Get(":id")
getUser(@Param("id") id: string) {
    return this.userService.getUser(id);
}
```

This is part of NestJS's legacy decorator-based programming model.

---

# 10. Decorator Factories

A decorator factory is a function that returns a decorator.

Why do we need it?

Because sometimes we want to pass configuration to a decorator.

### Basic example

```typescript
function LogMessage(message: string) {
    return function (
        value: Function,
        context: ClassMethodDecoratorContext
    ) {
        console.log(message);
    };
}
```

Usage:

```typescript
class UserService {
    @LogMessage("Fetching user details")
    getUser(): void {
        console.log("User fetched");
    }
}
```

Output during decorator application:

```text
Fetching user details
```

### Understanding the structure

```typescript
function LogMessage(message: string)
```

This is the factory.

It accepts configuration.

```typescript
return function (value, context) {}
```

This is the actual decorator.

### Another example: Permission decorator

```typescript
function RequireRole(role: string) {
    return function (
        value: Function,
        context: ClassMethodDecoratorContext
    ) {
        console.log(`Required role: ${role}`);
    };
}
```

Usage:

```typescript
class AdminService {
    @RequireRole("ADMIN")
    deleteUser(): void {
        console.log("User deleted");
    }
}
```

This example only demonstrates configuration. It does not actually enforce authorization.

We will implement a real authorization wrapper later.

---

# 11. Decorator Composition

You can apply multiple decorators to the same declaration.

### Example

```typescript
function First(
    value: Function,
    context: ClassMethodDecoratorContext
) {
    console.log("First decorator");
}

function Second(
    value: Function,
    context: ClassMethodDecoratorContext
) {
    console.log("Second decorator");
}

class UserService {
    @First
    @Second
    getUser(): void {
        console.log("Getting user");
    }
}
```

### Important execution order

For standard decorators, decorator expressions are evaluated in source order, but the decorators are applied in reverse order.

For the example above:

```typescript
@First
@Second
getUser() {}
```

The decorators are applied in this order:

1. `Second`
2. `First`

### Understanding decorator composition

Conceptually:

```typescript
@First
@Second
method
```

is similar to:

```typescript
First(Second(method))
```

This is function composition.

The result returned by one decorator can become the input to another decorator.

### Important distinction

Decorator evaluation and decorator application are different operations.

- Evaluation determines the decorator function.
- Application invokes the decorator with the decorated element and its context.

---

# 12. Decorator Initializers

Standard decorators provide:

```typescript
context.addInitializer()
```

This allows a decorator to register initialization logic.

### Example

```typescript
function Bound(
    originalMethod: Function,
    context: ClassMethodDecoratorContext
) {
    const methodName = context.name;

    if (context.private || context.static) {
        throw new Error("This decorator supports public instance methods only");
    }

    context.addInitializer(function () {
        const instance = this as Record<PropertyKey, unknown>;

        instance[methodName] =
            (originalMethod as Function).bind(this);
    });
}
```

Usage:

```typescript
class UserService {
    name = "Riyaz";

    @Bound
    greet(): void {
        console.log(`Hello ${this.name}`);
    }
}
```

Now:

```typescript
const service = new UserService();

const greet = service.greet;

greet();
```

Output:

```text
Hello Riyaz
```

Without binding, extracting a method can lose its original `this` context.

### What does `addInitializer()` do?

It registers a function that runs during instance or class initialization, depending on the decorator kind.

For an instance method decorator, the initializer runs when an instance is initialized.

### Use cases

- Binding methods.
- Registering instances.
- Setting up internal state.
- Attaching additional initialization behavior.

**Important:** Initializers should be used carefully. Avoid unnecessary mutation of instances or surprising side effects.

---

# 13. Decorators with Generics

Decorators can use generics to preserve the types of the decorated members.

### Example: Generic method logger

```typescript
function Logger<
    This,
    Args extends unknown[],
    Return
>(
    originalMethod: (
        this: This,
        ...args: Args
    ) => Return,
    context: ClassMethodDecoratorContext<
        This,
        (this: This, ...args: Args) => Return
    >
) {
    return function (
        this: This,
        ...args: Args
    ): Return {
        console.log("Method:", String(context.name));

        console.log("Arguments:", args);

        return originalMethod.apply(this, args);
    };
}
```

Usage:

```typescript
class ProductService {
    @Logger
    getProduct(id: number): string {
        return `Product ${id}`;
    }

    @Logger
    createProduct(title: string, price: number): boolean {
        console.log(title, price);

        return true;
    }
}
```

Both methods retain their original parameter and return types.

### Why use generics?

Without generics, a decorator might lose information about the method's signature.

Generics allow us to preserve:

- Parameter types.
- Return types.
- `this` types.

This is particularly important when creating reusable decorators for application frameworks.

---

# 14. Legacy Class Decorators

Now let's understand the older decorator system.

Legacy decorators are frequently encountered in existing TypeScript projects.

A legacy class decorator receives the constructor.

### Example

```typescript
function LogClass(
    constructor: Function
) {
    console.log("Class:", constructor.name);
}
```

Usage:

```typescript
@LogClass
class User {
    constructor(public name: string) {}
}
```

Output:

```text
Class: User
```

### Legacy class decorator with constructor replacement

```typescript
function AddTimestamp<T extends new (...args: any[]) => {}>(
    constructor: T
) {
    return class extends constructor {
        createdAt = new Date();
    };
}
```

Usage:

```typescript
@AddTimestamp
class User {
    constructor(public name: string) {}
}
```

Now:

```typescript
const user = new User("Riyaz");

console.log(user.createdAt);
```

The decorator replaces the original constructor with a derived constructor.

### Important

Legacy class decorators can return a replacement constructor.

However, TypeScript's static type checking around replacement constructors has limitations. The compiler does not always expose newly added instance properties through the original class type.

---

# 15. Legacy Method Decorators

A legacy method decorator receives three arguments:

1. Target.
2. Property key.
3. Property descriptor.

### Example

```typescript
function LogMethod(
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    console.log("Method:", propertyKey);
}
```

Usage:

```typescript
class UserService {
    @LogMethod
    getUser(): void {
        console.log("Fetching user");
    }
}
```

### Understanding the parameters

#### Target

For instance methods, this is generally the class prototype.

For static methods, it is the class constructor.

#### Property key

The name of the decorated method.

#### Property descriptor

Contains information about the property, including its function value.

For a method:

```typescript
descriptor.value
```

contains the original method.

### Replacing a method

```typescript
function LogMethod(
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
        console.log(`Executing ${propertyKey}`);

        const result = originalMethod.apply(this, args);

        console.log("Completed");

        return result;
    };
}
```

Usage:

```typescript
class UserService {
    @LogMethod
    getUser(id: number): string {
        console.log("Fetching:", id);

        return "Riyaz";
    }
}
```

Execution:

```typescript
const service = new UserService();

service.getUser(1);
```

Output:

```text
Executing getUser
Fetching: 1
Completed
```

### Standard vs legacy method decorators

| Standard | Legacy |
|---|---|
| Receives method value | Receives target |
| Receives context | Receives property key |
| Can return replacement method | Can replace `descriptor.value` |
| Does not use property descriptors in the same way | Uses `PropertyDescriptor` |

---

# 16. Legacy Property Decorators

A legacy property decorator receives:

1. Target.
2. Property key.

### Example

```typescript
function LogProperty(
    target: Object,
    propertyKey: string
) {
    console.log("Property:", propertyKey);
}
```

Usage:

```typescript
class User {
    @LogProperty
    name: string = "Riyaz";
}
```

Output:

```text
Property: name
```

### Important limitation

A legacy property decorator does not receive a property descriptor.

It cannot directly replace a field's initializer through the decorator return value.

This is different from a legacy method decorator.

### Example use cases

- Registering property names.
- Recording validation rules.
- Collecting metadata.
- Defining framework configuration.

---

# 17. Legacy Accessor Decorators

Legacy accessor decorators receive:

1. Target.
2. Property key.
3. Property descriptor.

### Example

```typescript
function LogAccessor(
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    console.log("Accessor:", propertyKey);
}
```

Usage:

```typescript
class User {
    private _name = "Riyaz";

    @LogAccessor
    get name(): string {
        return this._name;
    }
}
```

Accessor decorators are similar to method decorators because they receive a property descriptor.

### Important

In legacy TypeScript decorators, getter and setter decorators are applied to the accessor pair, not independently as two unrelated decorators.

---

# 18. Legacy Parameter Decorators

We introduced parameter decorators earlier.

Let's look at another example.

```typescript
function Inject(
    token: string
) {
    return function (
        target: Object,
        propertyKey: string | symbol | undefined,
        parameterIndex: number
    ) {
        console.log("Injection token:", token);

        console.log("Parameter index:", parameterIndex);
    };
}
```

Usage:

```typescript
class UserService {
    constructor(
        @Inject("DATABASE")
        private database: string
    ) {}
}
```

The decorator receives the parameter's position.

### Why are parameter decorators useful?

They help frameworks understand what should be injected into a constructor or method parameter.

For example, a dependency injection framework might use a parameter decorator to register the dependency token.

**Remember:** Parameter decorators are part of the legacy decorator model, not standard decorators.

---

# 19. Decorator Factories in Legacy Decorators

Decorator factories work with legacy decorators too.

### Example

```typescript
function Role(role: string) {
    return function (
        target: Object,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        console.log(`Required role: ${role}`);
    };
}
```

Usage:

```typescript
class AdminService {
    @Role("ADMIN")
    deleteUser(): void {
        console.log("Deleting user");
    }
}
```

The factory receives the configuration and returns the actual method decorator.

This pattern is heavily used in frameworks.

Examples include:

- `@Get()`
- `@Post()`
- `@Injectable()`
- `@Controller()`
- `@UseGuards()`

---

# 20. Understanding Metadata

Metadata is additional information associated with a program element.

For example, you may want to associate information with a class:

```text
Class: User
Table: users
Primary key: id
```

Or with a method:

```text
Method: deleteUser
Required role: ADMIN
```

This information can be used by frameworks at runtime.

### Metadata example

Imagine a class:

```typescript
class User {
    name: string;
}
```

You may want to associate metadata:

```text
User table name = users
```

Then a database framework could read that information.

This is the general idea behind metadata-driven frameworks.

### Important distinction

A TypeScript type annotation does not automatically become runtime metadata.

For example:

```typescript
class User {
    name: string;
}
```

The TypeScript type `string` is erased during compilation.

You cannot generally inspect TypeScript's static type information at runtime.

Metadata must be explicitly recorded or emitted through supported mechanisms.

---

# 21. The `reflect-metadata` Library

The `reflect-metadata` package provides APIs for working with metadata in the legacy decorator ecosystem.

Install it:

```bash
npm install reflect-metadata
```

Import it before using its APIs:

```typescript
import "reflect-metadata";
```

### Define metadata

```typescript
Reflect.defineMetadata(
    "role",
    "ADMIN",
    UserService.prototype,
    "deleteUser"
);
```

### Read metadata

```typescript
const role = Reflect.getMetadata(
    "role",
    UserService.prototype,
    "deleteUser"
);

console.log(role);
```

Output:

```text
ADMIN
```

### Understanding the arguments

```typescript
Reflect.defineMetadata(
    metadataKey,
    metadataValue,
    target,
    propertyKey
);
```

| Argument | Meaning |
|---|---|
| `metadataKey` | Identifier for metadata |
| `metadataValue` | Stored information |
| `target` | Object or class prototype |
| `propertyKey` | Optional member name |

### Class-level metadata

```typescript
Reflect.defineMetadata(
    "table",
    "users",
    User
);
```

Read it:

```typescript
const tableName = Reflect.getMetadata("table", User);

console.log(tableName);
```

Output:

```text
users
```

### Important

`reflect-metadata` is a library, not part of the TypeScript language itself.

It is commonly used with legacy decorators.

---

# 22. `emitDecoratorMetadata`

TypeScript provides a compiler option:

```json
{
    "compilerOptions": {
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    }
}
```

This option emits additional design metadata for certain declarations decorated using the legacy decorator model.

For example:

```typescript
class UserService {
    constructor(
        private database: DatabaseService
    ) {}
}
```

With legacy decorators and metadata emission configured, TypeScript can emit metadata such as:

```typescript
design:paramtypes
```

This metadata can describe constructor parameter runtime types when they have suitable runtime representations.

### Example

```typescript
import "reflect-metadata";

function Injectable() {
    return function (target: Function) {
        const types = Reflect.getMetadata(
            "design:paramtypes",
            target
        );

        console.log(types);
    };
}
```

Usage:

```typescript
class DatabaseService {}

@Injectable()
class UserService {
    constructor(
        private database: DatabaseService
    ) {}
}
```

The emitted metadata can contain the `DatabaseService` constructor.

### Important limitations

Metadata emission is not full TypeScript reflection.

For example:

- Interfaces have no runtime constructor.
- Type aliases are erased.
- Generic type arguments are not fully preserved.
- Union types are not represented with their full static structure.
- Complex compile-time types are not available at runtime.

### Standard decorators limitation

The modern standard decorator model does not use `emitDecoratorMetadata` in the legacy way.

If a framework depends on `design:paramtypes`, make sure its decorator system and compiler configuration are compatible.

---

# 23. Standard Decorator Metadata

Modern standard decorators provide a metadata mechanism through the decorator context.

The context can expose:

```typescript
context.metadata
```

when the runtime supports the decorator metadata protocol.

Metadata can be shared among decorators on the same class through a metadata object.

### Example

```typescript
const metadataKey = Symbol("role");

function SetRole(role: string) {
    return function (
        value: Function,
        context: ClassMethodDecoratorContext
    ) {
        context.metadata[metadataKey] = role;
    };
}
```

Usage:

```typescript
class AdminService {
    @SetRole("ADMIN")
    deleteUser(): void {}
}
```

The decorator stores metadata on the class metadata object.

### Accessing metadata

The metadata object is associated with the class through the standard decorator metadata mechanism.

In runtimes supporting `Symbol.metadata`, it can be accessed through:

```typescript
const metadata = (
    AdminService as any
)[Symbol.metadata];

console.log(metadata?.[metadataKey]);
```

Expected value:

```text
ADMIN
```

### Important runtime consideration

Standard decorator metadata requires appropriate runtime support for `Symbol.metadata`.

Depending on the runtime, you may need a compatible implementation or polyfill.

Also, TypeScript compiler support and JavaScript runtime support are separate concerns.

**Key distinction:** Standard decorator metadata and `reflect-metadata`'s legacy APIs are different metadata systems.

---

# 24. Real-World Example: Logging Decorator

Let's build a reusable method decorator that logs execution time.

This example uses standard decorators.

### Implementation

```typescript
function MeasureTime<
    This,
    Args extends unknown[],
    Return
>(
    originalMethod: (
        this: This,
        ...args: Args
    ) => Return,
    context: ClassMethodDecoratorContext<
        This,
        (this: This, ...args: Args) => Return
    >
) {
    return function (
        this: This,
        ...args: Args
    ): Return {
        const start = performance.now();

        const result = originalMethod.apply(this, args);

        const end = performance.now();

        console.log(
            `${String(context.name)} took ${end - start} ms`
        );

        return result;
    };
}
```

Usage:

```typescript
class UserService {
    @MeasureTime
    getUsers(): string[] {
        const users = ["Riyaz", "Ahmed", "Ali"];

        return users;
    }
}
```

Execution:

```typescript
const service = new UserService();

service.getUsers();
```

Possible output:

```text
getUsers took 0.2 ms
```

The actual time will vary.

### Important limitation

This version measures synchronous execution only.

For asynchronous methods, the decorator should wait for the returned promise to settle before measuring completion.

We will explore that in a later example.

---

# 25. Real-World Example: Authorization Decorator

Let's create a method decorator that checks whether a user has the required role.

We will use standard decorators.

### Step 1: Define the user type

```typescript
type User = {
    name: string;
    role: string;
};
```

### Step 2: Create the decorator

```typescript
function RequireRole(requiredRole: string) {
    return function <
        This extends { currentUser: User },
        Args extends unknown[],
        Return
    >(
        originalMethod: (
            this: This,
            ...args: Args
        ) => Return,
        context: ClassMethodDecoratorContext<
            This,
            (this: This, ...args: Args) => Return
        >
    ) {
        return function (
            this: This,
            ...args: Args
        ): Return {
            if (this.currentUser.role !== requiredRole) {
                throw new Error("Access denied");
            }

            return originalMethod.apply(this, args);
        };
    };
}
```

### Step 3: Apply the decorator

```typescript
class AdminService {
    currentUser: User;

    constructor(user: User) {
        this.currentUser = user;
    }

    @RequireRole("ADMIN")
    deleteUser(id: number): string {
        return `User ${id} deleted`;
    }
}
```

### Step 4: Test authorization

```typescript
const adminService = new AdminService({
    name: "Riyaz",
    role: "ADMIN"
});

console.log(adminService.deleteUser(1));
```

Output:

```text
User 1 deleted
```

Now try a normal user:

```typescript
const normalService = new AdminService({
    name: "Ahmed",
    role: "USER"
});

normalService.deleteUser(1);
```

This throws:

```text
Error: Access denied
```

### Important security note

This example demonstrates decorator-based authorization logic.

A production authorization system must also:

- Authenticate the user.
- Verify the role using trusted server-side data.
- Prevent users from controlling their own role.
- Enforce authorization at the appropriate application boundary.
- Avoid relying only on client-side checks.

---

# 26. Real-World Example: Caching Decorator

Caching means storing a previous result so that repeated calls can return it without repeating expensive work.

Let's create a simple method caching decorator.

This example uses standard decorators.

```typescript
function Cache<
    This,
    Args extends unknown[],
    Return
>(
    originalMethod: (
        this: This,
        ...args: Args
    ) => Return,
    context: ClassMethodDecoratorContext<
        This,
        (this: This, ...args: Args) => Return
    >
) {
    const cache = new Map<string, Return>();

    return function (
        this: This,
        ...args: Args
    ): Return {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            console.log("Cache hit");

            return cache.get(key)!;
        }

        console.log("Cache miss");

        const result = originalMethod.apply(this, args);

        cache.set(key, result);

        return result;
    };
}
```

Usage:

```typescript
class ProductService {
    @Cache
    getProduct(id: number): string {
        console.log("Fetching product from database");

        return `Product ${id}`;
    }
}
```

Execution:

```typescript
const service = new ProductService();

service.getProduct(1);

service.getProduct(1);

service.getProduct(2);
```

Possible output:

```text
Cache miss
Fetching product from database

Cache hit

Cache miss
Fetching product from database
```

### Important limitations

This is a simplified cache implementation.

It does not handle:

- Complex object arguments reliably.
- Cache expiration.
- Memory limits.
- Concurrent requests.
- Database changes.
- Asynchronous errors.
- Different class instances sharing the same decorator cache.

For production caching, use a deliberate cache design with expiration and invalidation strategies.

---

# 27. Asynchronous Method Decorators

Many backend methods return promises.

A logging decorator should correctly measure asynchronous execution.

### Example

```typescript
function MeasureAsyncTime<
    This,
    Args extends unknown[],
    Return
>(
    originalMethod: (
        this: This,
        ...args: Args
    ) => Promise<Return>,
    context: ClassMethodDecoratorContext<
        This,
        (this: This, ...args: Args) => Promise<Return>
    >
) {
    return async function (
        this: This,
        ...args: Args
    ): Promise<Return> {
        const start = performance.now();

        try {
            return await originalMethod.apply(this, args);
        } finally {
            const end = performance.now();

            console.log(
                `${String(context.name)} took ${end - start} ms`
            );
        }
    };
}
```

Usage:

```typescript
class UserService {
    @MeasureAsyncTime
    async getUser(id: number): Promise<string> {
        await new Promise(resolve => setTimeout(resolve, 1000));

        return `User ${id}`;
    }
}
```

Execution:

```typescript
const service = new UserService();

await service.getUser(1);
```

The decorator measures the time until the promise settles.

### Why use `finally`?

The `finally` block executes whether the promise:

- Resolves successfully.
- Rejects with an error.

Therefore, timing is logged in both cases.

---

# 28. Decorators in NestJS

NestJS is a Node.js framework that uses decorators extensively.

It traditionally uses TypeScript's legacy decorator system.

Common decorators include:

| Decorator | Purpose |
|---|---|
| `@Module()` | Defines a module |
| `@Controller()` | Defines a controller |
| `@Injectable()` | Marks a class as injectable |
| `@Get()` | Defines a GET route |
| `@Post()` | Defines a POST route |
| `@Put()` | Defines a PUT route |
| `@Delete()` | Defines a DELETE route |
| `@Param()` | Extracts route parameters |
| `@Query()` | Extracts query parameters |
| `@Body()` | Extracts request body |
| `@UseGuards()` | Applies authorization guards |
| `@UseInterceptors()` | Applies interceptors |

### Example: Controller

```typescript
import {
    Controller,
    Get,
    Param
} from "@nestjs/common";

@Controller("users")
export class UserController {

    @Get(":id")
    getUser(@Param("id") id: string) {
        return {
            id,
            name: "Riyaz"
        };
    }
}
```

### Understanding the decorators

```typescript
@Controller("users")
```

Defines the controller's route prefix.

```typescript
@Get(":id")
```

Maps the method to a GET route.

```typescript
@Param("id")
```

Extracts the route parameter.

The route:

```text
GET /users/1
```

Can invoke:

```typescript
getUser("1")
```

### Example: Injectable service

```typescript
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
    getUsers() {
        return [
            { id: 1, name: "Riyaz" },
            { id: 2, name: "Ahmed" }
        ];
    }
}
```

`@Injectable()` marks the class for NestJS's dependency injection system.

### Example: Dependency injection

```typescript
@Controller("users")
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get()
    getUsers() {
        return this.userService.getUsers();
    }
}
```

NestJS resolves the dependency and provides the service to the controller.

### Why does NestJS use decorators?

Decorators allow NestJS to define application structure declaratively.

Instead of manually registering every controller, route, and dependency, the framework can inspect the decorator information and build the application.

**Important:** NestJS's traditional decorator system is based on legacy TypeScript decorators. Do not assume that replacing its configuration with standard decorators will work without checking framework compatibility.

---

# 29. Metaprogramming

Metaprogramming means writing code that works with other code as data.

In ordinary programming, you write instructions to perform tasks.

In metaprogramming, you write code that can:

- Inspect program structures.
- Modify behavior.
- Register metadata.
- Generate functionality.
- Configure application components.

Decorators are one form of metaprogramming.

### Example without metaprogramming

```typescript
class UserService {
    getUser(): void {
        console.log("Fetching user");
    }
}
```

### Example with metaprogramming

```typescript
function Log(
    method: Function,
    context: ClassMethodDecoratorContext
) {
    console.log("Registered:", context.name);
}

class UserService {
    @Log
    getUser(): void {
        console.log("Fetching user");
    }
}
```

The decorator interacts with the class method during class definition.

### Other JavaScript metaprogramming features

| Feature | Purpose |
|---|---|
| Decorators | Extend or customize declarations |
| `Proxy` | Intercept object operations |
| `Reflect` | Perform reflective operations |
| `Object.defineProperty()` | Define property descriptors |
| `Object.getOwnPropertyDescriptors()` | Inspect property descriptors |
| Metadata APIs | Associate additional information with declarations |

### Decorators vs Proxy

These are related to metaprogramming, but they solve different problems.

**Decorator:**

Used to customize a class or class member during class definition.

**Proxy:**

Used to intercept operations on an object at runtime.

Example:

```typescript
const user = {
    name: "Riyaz"
};

const proxy = new Proxy(user, {
    get(target, property) {
        console.log("Accessing:", property);

        return Reflect.get(target, property);
    }
});

console.log(proxy.name);
```

Output:

```text
Accessing: name
Riyaz
```

We will explore `Proxy` and `Reflect` more deeply in a later metaprogramming phase.

---

# 30. Important Decorator Execution Rules

Let's summarize the important execution rules.

### Standard decorators

For standard decorators:

1. Decorator expressions are evaluated in source order.
2. Decorators are applied in reverse order.
3. Replacement values returned by decorators can affect the final declaration.
4. Initializers registered using `addInitializer()` run during the relevant initialization process.

### Legacy decorators

Legacy decorator execution has its own ordering rules.

For a class with decorated members:

- Instance member decorators are applied before class decorators.
- Static member decorators are applied before class decorators.
- Parameter decorators are applied before their associated method or constructor decorator.
- Multiple decorators on one declaration are applied in reverse order.

The exact order of decorator expressions and their application should not be confused.

**Best practice:** When decorator order matters, test the behavior with a small example instead of assuming both decorator systems behave identically.

---

# 31. Common Mistakes

### Mistake 1: Confusing standard and legacy decorators

Incorrect assumption:

All decorators receive:

```typescript
target, propertyKey, descriptor
```

This is the legacy method decorator signature.

Standard decorators receive a value and a context object.

### Mistake 2: Assuming standard decorators support parameter decorators

They do not.

Parameter decorators belong to the legacy TypeScript decorator system.

### Mistake 3: Forgetting decorator configuration

Legacy decorators generally require:

```json
{
    "experimentalDecorators": true
}
```

Standard decorators do not require this option.

### Mistake 4: Assuming TypeScript types exist at runtime

TypeScript erases most type annotations.

For example:

```typescript
interface User {
    name: string;
}
```

There is no runtime `User` constructor to inspect.

### Mistake 5: Assuming `emitDecoratorMetadata` preserves all types

It does not.

It emits limited runtime design metadata, not complete TypeScript type information.

### Mistake 6: Forgetting to import `reflect-metadata`

If you use the legacy metadata library, make sure it is loaded before using its APIs.

```typescript
import "reflect-metadata";
```

### Mistake 7: Not preserving `this`

When replacing methods, preserve the original receiver.

```typescript
originalMethod.apply(this, args);
```

### Mistake 8: Losing generic information

Avoid broad function types when building reusable decorators.

Prefer generic signatures that preserve arguments and return types.

### Mistake 9: Using decorators for everything

Not every reusable behavior needs a decorator.

Sometimes a normal function, middleware, service, or higher-order function is easier to understand and maintain.

### Mistake 10: Treating decorators as security boundaries

A decorator alone does not guarantee security.

Authorization must be enforced using trusted server-side information and appropriate application architecture.

---

# 32. Interview Questions and Answers

### Q1. What are decorators in TypeScript?

Decorators are special functions applied to classes or class members to observe, customize, or extend their behavior.

### Q2. What is the purpose of decorators?

They help implement reusable cross-cutting functionality such as logging, validation, authorization, caching, and dependency injection.

### Q3. What is the difference between standard and legacy decorators?

Standard decorators follow the modern JavaScript decorator model and receive a context object.

Legacy decorators use TypeScript's older experimental implementation and use target, property key, and descriptor arguments for methods.

### Q4. What are class decorators?

Class decorators are applied to class declarations and can inspect or replace the class constructor.

### Q5. What are method decorators?

Method decorators are applied to class methods and can inspect or replace method behavior.

### Q6. What are property decorators?

Property decorators are applied to class fields to customize initialization or associate additional information, depending on the decorator model.

### Q7. What are parameter decorators?

Parameter decorators are legacy decorators applied to constructor or method parameters.

They are not supported by standard decorators.

### Q8. What is a decorator factory?

A decorator factory is a function that accepts configuration and returns a decorator.

### Q9. What is decorator composition?

Decorator composition means applying multiple decorators to the same declaration.

### Q10. What is `ClassMethodDecoratorContext`?

It is a TypeScript context type that describes a method being decorated using the standard decorator model.

### Q11. What is `addInitializer()`?

It registers an initialization function that runs during the appropriate class or instance initialization process.

### Q12. What is metadata?

Metadata is additional information associated with a class or class member.

Frameworks can use it to configure application behavior.

### Q13. What is `reflect-metadata`?

It is a library that provides APIs for defining and reading metadata, commonly used with legacy TypeScript decorators.

### Q14. What is `emitDecoratorMetadata`?

It is a TypeScript compiler option that emits limited runtime design metadata for the legacy decorator ecosystem.

### Q15. Does TypeScript preserve interfaces at runtime?

No. Interfaces are erased during compilation.

### Q16. What is metaprogramming?

Metaprogramming is writing programs that inspect, customize, or generate other program behavior.

### Q17. Does NestJS use decorators?

Yes. NestJS extensively uses decorators for controllers, routes, dependency injection, guards, and other framework features.

Its traditional decorator ecosystem uses legacy TypeScript decorators.

### Q18. What is the difference between decorators and middleware?

Decorators attach reusable behavior or metadata to declarations.

Middleware processes requests or operations as they pass through an application pipeline.

### Q19. Can decorators preserve generic method types?

Yes. Carefully designed generic decorators can preserve the method's `this`, parameter tuple, and return type.

### Q20. Can decorators change a method's behavior?

Yes. A decorator can return a replacement method or wrap the original method, depending on the decorator system.

---

# 33. Practical Exercises

Complete these exercises to strengthen your understanding.

## Exercise 1: Class Decorator

Create a class decorator that logs the decorated class name.

Expected:

```typescript
@LogClass
class UserService {}
```

## Exercise 2: Method Decorator

Create a method decorator that logs:

- Method name.
- Arguments.
- Return value.

## Exercise 3: Decorator Factory

Create a decorator factory:

```typescript
@LogMessage("User created successfully")
```

It should accept a custom message.

## Exercise 4: Uppercase Field Decorator

Create a standard field decorator that transforms an initial string value into uppercase.

## Exercise 5: Accessor Decorator

Create an accessor decorator that converts assigned string values into lowercase.

## Exercise 6: Method Binding Decorator

Create a decorator that automatically binds a method to its class instance.

Test it by extracting the method into another variable.

## Exercise 7: Execution Time Decorator

Create a decorator that measures how long a synchronous method takes to execute.

## Exercise 8: Async Execution Time Decorator

Create a decorator that measures asynchronous method execution time.

Make sure it handles both resolved and rejected promises.

## Exercise 9: Authorization Decorator

Create:

```typescript
@RequireRole("ADMIN")
```

It should reject execution when the current user does not have the required role.

## Exercise 10: Caching Decorator

Create a decorator that caches the return value of a method based on its arguments.

## Exercise 11: Decorator Composition

Create two decorators:

```typescript
@First
@Second
```

Print the execution order and understand how decorators are applied.

## Exercise 12: Legacy Parameter Decorator

Create a legacy parameter decorator that prints:

- Method name.
- Parameter index.

## Exercise 13: Metadata

Use `reflect-metadata` to store and retrieve a role from a class or method.

## Exercise 14: NestJS Controller

Create a simple NestJS controller using:

- `@Controller()`
- `@Get()`
- `@Post()`
- `@Param()`
- `@Body()`

## Exercise 15: Generic Logging Decorator

Create a standard method decorator that preserves:

- `this` type.
- Parameter types.
- Return type.

Apply it to multiple methods with different signatures.

---

# 34. Phase 22 Completion Checklist

| No. | Topic | Status |
|---|---|---|
| 1 | Decorator fundamentals | ☐ |
| 2 | Standard decorators | ☐ |
| 3 | Legacy decorators | ☐ |
| 4 | Standard vs legacy differences | ☐ |
| 5 | Class decorators | ☐ |
| 6 | Method decorators | ☐ |
| 7 | Field decorators | ☐ |
| 8 | Accessor decorators | ☐ |
| 9 | Parameter decorators | ☐ |
| 10 | Decorator factories | ☐ |
| 11 | Decorator composition | ☐ |
| 12 | Decorator execution order | ☐ |
| 13 | Decorator initializers | ☐ |
| 14 | Decorators with generics | ☐ |
| 15 | Legacy method decorators | ☐ |
| 16 | Legacy property decorators | ☐ |
| 17 | Legacy parameter decorators | ☐ |
| 18 | Metadata fundamentals | ☐ |
| 19 | `reflect-metadata` | ☐ |
| 20 | `emitDecoratorMetadata` | ☐ |
| 21 | Standard decorator metadata | ☐ |
| 22 | Logging decorators | ☐ |
| 23 | Authorization decorators | ☐ |
| 24 | Caching decorators | ☐ |
| 25 | Async decorators | ☐ |
| 26 | NestJS decorators | ☐ |
| 27 | Metaprogramming fundamentals | ☐ |

---

# What Comes Next?

## Phase 23: Advanced TypeScript – Modules, Namespaces, Declaration Files, and Module Augmentation

In the next phase, we will explore how TypeScript organizes large applications and interacts with JavaScript libraries.

Topics will include:

1. JavaScript modules.
2. Named exports and imports.
3. Default exports and imports.
4. Type-only imports and exports.
5. Module resolution.
6. CommonJS vs ES Modules.
7. TypeScript namespaces.
8. Namespace merging.
9. Declaration files (`.d.ts`).
10. Ambient declarations.
11. Global declarations.
12. Module augmentation.
13. Declaration merging.
14. Triple-slash directives.
15. Typing JavaScript libraries.
16. Creating custom type declaration files.
17. Organizing large TypeScript projects.

**Phase 22 complete.** Say **"OK, Phase 23"** when you're ready to continue.