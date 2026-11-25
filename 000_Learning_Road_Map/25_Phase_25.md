# Phase 25: Advanced TypeScript – Type Compatibility, Structural Typing, Variance, and Type System Internals

**Level:** Advanced to Expert  
**Prerequisites:**
- Phase 3: Basic Types
- Phase 8: Type Aliases
- Phase 9: Interfaces
- Phase 10: Union and Intersection Types
- Phase 11: Type Narrowing
- Phase 14: Generics
- Phase 15: Generic Constraints
- Phase 16: Conditional Types
- Phase 20: Advanced Function Types
- Phase 21: Classes
- Phase 24: Compiler Internals

## Learning Objectives

By the end of this phase, you will understand:

1. Structural typing in depth.
2. Type compatibility rules.
3. Assignability vs type identity.
4. Subtyping.
5. Excess property checking.
6. Fresh object literals.
7. Weak types.
8. Function compatibility rules.
9. Variance and bivariance.
10. Generic type compatibility.
11. Class compatibility.
12. Private and protected member compatibility.
13. Union and intersection compatibility.
14. `any`, `unknown`, and `never` compatibility.
15. Type widening and narrowing internals.
16. Soundness and unsoundness.
17. Type assertions and their limitations.
18. Advanced type compatibility examples.

---

# 1. What Is Type Compatibility?

Type compatibility determines whether a value of one type can be assigned to a variable, parameter, or property expecting another type.

In simple terms:

**Type compatibility answers whether one type can be used where another type is expected.**

### Example

```typescript
let age: number = 25;

let salary: number = age;
```

This is valid because both variables have the same type.

But:

```typescript
let age: number = 25;

let username: string = age;
```

This produces an error because `number` is not compatible with `string`.

### Another example

```typescript
type User = {
    name: string;
};

const user = {
    name: "Riyaz"
};

const person: User = user;
```

This is valid because the object contains the required structure.

### Why is type compatibility important?

It helps TypeScript determine:

- Whether an object satisfies an interface.
- Whether a function can be passed as a callback.
- Whether a class implements a contract.
- Whether a generic type can be assigned to another generic type.
- Whether one type can be used in place of another.

---

# 2. Structural Typing

TypeScript primarily uses a **structural type system**.

Structural typing means that type compatibility is determined by the structure of a value rather than the name of its declared type.

### Example

```typescript
type User = {
    name: string;
    age: number;
};

type Employee = {
    name: string;
    age: number;
};

const user: User = {
    name: "Riyaz",
    age: 25
};

const employee: Employee = user;
```

This is valid.

Why?

Because `User` and `Employee` have compatible structures.

Their names are different, but their properties match.

### Important

TypeScript does not generally require two object types to have identical names.

It checks whether their structures satisfy the required compatibility rules.

### Another example

```typescript
interface Product {
    id: number;
    name: string;
}

interface Item {
    id: number;
    name: string;
}

const product: Product = {
    id: 1,
    name: "Laptop"
};

const item: Item = product;
```

This is also valid.

### Structural typing vs nominal typing

| Structural typing | Nominal typing |
|---|---|
| Compatibility depends primarily on structure | Compatibility depends on declared identity and rules |
| Types with compatible members can be interchangeable | Different named types may be incompatible even with identical members |
| TypeScript primarily uses this system | Languages such as Java and C# commonly use nominal typing for classes and interfaces |

### Important clarification

TypeScript is not purely structural in every situation.

Private and protected class members introduce declaration-origin restrictions into class compatibility.

We will explore this later.

---

# 3. Structural Typing with Additional Properties

One important characteristic of structural typing is that a value can contain more properties than the target type requires.

### Example

```typescript
type User = {
    name: string;
};

const employee = {
    name: "Riyaz",
    salary: 50000
};

const user: User = employee;
```

This is valid.

Why?

The target type only requires:

```typescript
{
    name: string;
}
```

The source object has:

```typescript
{
    name: string;
    salary: number;
}
```

It contains everything required by `User`.

The extra `salary` property does not prevent assignment.

### Important rule

For ordinary structural object compatibility, the source generally needs to provide the required members of the target type.

The source may contain additional members.

### Visual representation

```text
Target Type: User

┌───────────────┐
│ name: string  │
└───────────────┘


Source Object: employee

┌───────────────┐
│ name: string  │
│ salary: number│
└───────────────┘
```

The source object satisfies the target structure.

---

# 4. Assignability vs Type Identity

These are related but different concepts.

## A. Type Identity

Type identity concerns whether two types represent the same type under the compiler's type-system rules.

TypeScript does not expose a universal general-purpose runtime or language-level `isExactlySameType` operator.

For example:

```typescript
type A = string;

type B = string;
```

These aliases represent the same underlying type.

### Another example

```typescript
type User = {
    name: string;
};

type Employee = {
    name: string;
};
```

These types have different names but are structurally compatible.

They are not nominally distinct merely because they have different aliases.

## B. Assignability

Assignability determines whether a value of one type can be assigned to a location expecting another type.

Example:

```typescript
type User = {
    name: string;
};

type Employee = {
    name: string;
    salary: number;
};

const employee: Employee = {
    name: "Riyaz",
    salary: 50000
};

const user: User = employee;
```

This is valid because `Employee` is assignable to `User`.

However, the reverse assignment is invalid:

```typescript
const user: User = {
    name: "Riyaz"
};

const employee: Employee = user;
```

Error: `salary` is missing.

### Comparison

| Type identity | Assignability |
|---|---|
| Concerns whether types are the same | Concerns whether one type can be used where another is expected |
| Different aliases can represent the same type | Different types can still be assignable |
| Not a universal public equality operation in TypeScript | Central to TypeScript's compatibility checks |

### Remember

**Two types do not need to be identical to be assignable.**

---

# 5. Subtyping

Subtyping is a relationship in which one type can be used wherever another type is expected.

If type `A` is a subtype of type `B`, we can express the relationship as:

```text
A <: B
```

This means `A` is a subtype of `B`.

### Example

```typescript
type Animal = {
    name: string;
};

type Dog = {
    name: string;
    breed: string;
};

const dog: Dog = {
    name: "Tommy",
    breed: "Labrador"
};

const animal: Animal = dog;
```

`Dog` has all the required properties of `Animal`, plus an additional property.

Conceptually:

```text
Dog <: Animal
```

Therefore, a `Dog` can be used where an `Animal` is expected.

### Reverse assignment

```typescript
const animal: Animal = {
    name: "Tommy"
};

const dog: Dog = animal;
```

This is invalid because the `breed` property is missing.

### Important distinction

Subtyping and assignability are closely related, but they are not always identical concepts in TypeScript.

TypeScript's assignability rules include practical exceptions and special types such as:

- `any`
- `unknown`
- Type assertions
- Function parameter compatibility
- Enum compatibility rules

Therefore, do not assume every assignment relationship is a pure mathematical subtype relationship.

---

# 6. Excess Property Checking

Excess property checking is a special check TypeScript performs when an object literal is directly assigned to a type or passed to a function expecting that type.

### Example

```typescript
type User = {
    name: string;
};

const user: User = {
    name: "Riyaz",
    age: 25
};
```

TypeScript reports an error because `age` is not defined in `User`.

But earlier, we saw that extra properties can be allowed.

Why?

Because this example uses a **fresh object literal**.

### Compare these examples

**Example A: Direct object literal**

```typescript
type User = {
    name: string;
};

const user: User = {
    name: "Riyaz",
    age: 25
};
```

This produces an excess property error.

**Example B: Intermediate variable**

```typescript
type User = {
    name: string;
};

const employee = {
    name: "Riyaz",
    age: 25
};

const user: User = employee;
```

This is valid.

### Why?

In Example A, TypeScript performs excess property checking on the fresh object literal.

In Example B, the value already has an inferred object type. TypeScript applies ordinary structural compatibility.

### Important

Excess property checking is not the same as exact object typing.

It is a special check intended to catch likely mistakes in object literals.

---

# 7. Fresh Object Literals

A fresh object literal is an object literal that is being checked directly in a context expecting a particular object type.

### Example

```typescript
type Product = {
    id: number;
    name: string;
};

function createProduct(product: Product): void {
    console.log(product);
}
```

Direct call:

```typescript
createProduct({
    id: 1,
    name: "Laptop",
    price: 50000
});
```

This reports an excess property error because `price` is not part of `Product`.

### Using an intermediate variable

```typescript
const laptop = {
    id: 1,
    name: "Laptop",
    price: 50000
};

createProduct(laptop);
```

This is valid.

### Why is this useful?

It helps catch spelling mistakes.

For example:

```typescript
type User = {
    name: string;
};

const user: User = {
    name: "Riyaz",
    nmae: "Ahmed"
};
```

The compiler can detect the unexpected `nmae` property.

### Important clarification: `satisfies`

The `satisfies` operator also checks an expression against a target type.

```typescript
type User = {
    name: string;
};

const user = {
    name: "Riyaz",
    age: 25
} satisfies User;
```

This produces an excess property error.

However, `satisfies` does not simply replace the inferred type with `User`. It checks compatibility while preserving the expression's inferred type.

---

# 8. Weak Types

A weak type is an object type in which all properties are optional.

### Example

```typescript
type UserOptions = {
    name?: string;
    age?: number;
    email?: string;
};
```

Every property is optional.

This means the type is a weak type.

### Weak type detection

Consider:

```typescript
type UserOptions = {
    name?: string;
    age?: number;
};

const settings = {
    username: "Riyaz"
};

const options: UserOptions = settings;
```

TypeScript reports an error because there are no properties in common between the source and target types.

### But this is valid:

```typescript
const settings = {
    name: "Riyaz",
    username: "riyaz123"
};

const options: UserOptions = settings;
```

Why?

Because the source and target share a property named `name`.

### Important

Weak type detection helps catch accidental assignments.

It does not mean that an object must contain every optional property.

### Practical example

```typescript
type SearchOptions = {
    query?: string;
    limit?: number;
    sort?: "asc" | "desc";
};

function search(options: SearchOptions): void {
    console.log(options);
}

search({
    query: "laptop"
});
```

This is valid.

---

# 9. Function Compatibility

Function compatibility determines whether one function can be assigned to another function type.

This involves:

- Parameter types.
- Parameter counts.
- Optional parameters.
- Rest parameters.
- Return types.
- Parameter variance.

### Basic example

```typescript
type AddFunction = (
    a: number,
    b: number
) => number;

const add: AddFunction = (
    x: number,
    y: number
) => {
    return x + y;
};
```

This is valid.

### Return type compatibility

```typescript
type GetNumber = () => number;

const getNumber: GetNumber = () => {
    return 100;
};
```

Valid.

But:

```typescript
type GetNumber = () => number;

const getNumber: GetNumber = () => {
    return "100";
};
```

Invalid.

### Function with fewer parameters

```typescript
type Callback = (
    name: string,
    age: number
) => void;

const callback: Callback = (name) => {
    console.log(name);
};
```

This is valid.

Why?

A function that ignores an argument can still be used where the caller may supply that argument.

### Important

The reverse situation is generally unsafe.

```typescript
type Callback = (
    name: string
) => void;

const callback: Callback = (
    name: string,
    age: number
) => {
    console.log(name, age);
};
```

Under strict function checking, this is invalid because the caller is only required to provide `name`, not `age`.

### Comparison

| Function | Compatibility |
|---|---|
| Expected 2 parameters, implementation uses 1 | Generally valid |
| Expected 1 parameter, implementation requires 2 | Invalid under strict checking |
| Return type is compatible | Valid |
| Return type is incompatible | Invalid |

---

# 10. Function Parameter Variance

Variance describes how type compatibility behaves when types are used inside more complex types.

There are three major concepts:

1. Covariance.
2. Contravariance.
3. Invariance.

Bivariance is another behavior relevant to TypeScript function compatibility.

Let's understand them carefully.

---

# 11. Covariance

Covariance means that a more specific type can be used where a more general type is expected.

### Example

```typescript
type Animal = {
    name: string;
};

type Dog = {
    name: string;
    breed: string;
};

type DogProvider = () => Dog;

type AnimalProvider = () => Animal;
```

A function returning a `Dog` can be assigned to a function expected to return an `Animal`.

```typescript
const getDog: DogProvider = () => ({
    name: "Tommy",
    breed: "Labrador"
});

const getAnimal: AnimalProvider = getDog;
```

This is valid.

Why?

A `Dog` contains everything required by `Animal`.

Therefore, the returned value is safe to use as an `Animal`.

### Relationship

```text
Dog <: Animal

() => Dog <: () => Animal
```

This is covariance in return types.

### Practical example

```typescript
interface Animal {
    name: string;
}

interface Dog extends Animal {
    breed: string;
}

function getDog(): Dog {
    return {
        name: "Tommy",
        breed: "Labrador"
    };
}

const getAnimal: () => Animal = getDog;
```

---

# 12. Contravariance

Contravariance is the opposite direction of covariance.

For function parameters, a function that accepts a more general type can safely be used where a function accepting a more specific type is expected.

### Example

```typescript
type Animal = {
    name: string;
};

type Dog = {
    name: string;
    breed: string;
};

type AnimalHandler = (animal: Animal) => void;

type DogHandler = (dog: Dog) => void;
```

Consider:

```typescript
const handleAnimal: AnimalHandler = (animal) => {
    console.log(animal.name);
};

const handleDog: DogHandler = handleAnimal;
```

This is valid under strict function parameter checking.

Why?

A `DogHandler` is expected to handle dogs.

But `handleAnimal` can handle any animal, including dogs.

It requires less specific input.

### Relationship

```text
Dog <: Animal

(Animal) => void <: (Dog) => void
```

The parameter relationship goes in the opposite direction.

That is contravariance.

### Visual explanation

```text
Expected input: Dog

         |
         v

Function accepts: Animal

         |
         v

Dog is an Animal

         |
         v

Safe
```

### Practical example

```typescript
interface Animal {
    name: string;
}

interface Dog extends Animal {
    breed: string;
}

function processAnimal(animal: Animal): void {
    console.log(animal.name);
}

const processDog: (dog: Dog) => void = processAnimal;
```

This is valid.

---

# 13. Invariance

Invariance means that neither direction of type substitution is allowed.

A type is invariant when both directions of assignment are prevented by the relevant compatibility rules.

### Conceptual example

Suppose we have a mutable container:

```typescript
interface Box<T> {
    value: T;
}
```

Consider:

```typescript
interface Animal {
    name: string;
}

interface Dog extends Animal {
    breed: string;
}
```

If mutable boxes were freely covariant, this could be unsafe:

```typescript
const dogBox: Box<Dog> = {
    value: {
        name: "Tommy",
        breed: "Labrador"
    }
};
```

Imagine assigning it to a general animal box and then inserting a non-dog:

```typescript
const animalBox: Box<Animal> = dogBox;

animalBox.value = {
    name: "Lion"
};
```

Now `dogBox.value` is no longer guaranteed to be a `Dog`.

That would violate the original type guarantee.

### Important TypeScript detail

Do not assume that every mutable generic object is automatically invariant in TypeScript.

TypeScript's structural compatibility rules can permit covariance in certain generic object structures, including mutable property containers.

The example above illustrates why unrestricted covariance would be unsafe, not a universal compiler rule.

To enforce invariance, a type design may use both input and output positions with appropriate function-property signatures, or another explicit type-level technique.

### Conceptual summary

| Variance | Relationship |
|---|---|
| Covariance | Same direction |
| Contravariance | Opposite direction |
| Invariance | Neither direction |
| Bivariance | Either direction is accepted |

---

# 14. Bivariance

Bivariance means that both covariant and contravariant substitutions are accepted.

TypeScript has some intentionally permissive compatibility rules involving method parameters.

### Example

```typescript
interface Animal {
    name: string;
}

interface Dog extends Animal {
    breed: string;
}

interface AnimalContainer {
    handle(animal: Animal): void;
}

interface DogContainer {
    handle(dog: Dog): void;
}
```

Method parameter checking has a special bivariance rule in TypeScript.

This differs from ordinary function-property checking under `strictFunctionTypes`.

### Compare method syntax and function-property syntax

**Method syntax:**

```typescript
interface AnimalHandler {
    handle(animal: Animal): void;
}

interface DogHandler {
    handle(dog: Dog): void;
}
```

**Function-property syntax:**

```typescript
interface AnimalHandler {
    handle: (animal: Animal) => void;
}

interface DogHandler {
    handle: (dog: Dog) => void;
}
```

Under `strictFunctionTypes`, function-property parameters are checked contravariantly, while method and constructor declarations retain a bivariance exception.

### Why does TypeScript do this?

It preserves compatibility with common JavaScript and TypeScript patterns, particularly class hierarchies and callback APIs.

### Important

For safer callback APIs, prefer function-property syntax when strict parameter variance is important.

---

# 15. Variance Summary

Let's summarize all four concepts.

Assume:

```text
Dog <: Animal
```

| Variance | Function relationship | Meaning |
|---|---|---|
| Covariance | `() => Dog` assignable to `() => Animal` | Specific output can be used as general output |
| Contravariance | `(Animal) => void` assignable to `(Dog) => void` | General input handler can handle specific input |
| Invariance | Neither direction | Both directions are restricted |
| Bivariance | Either direction may be accepted | Permissive compatibility |

### Easy way to remember

- **Covariance:** Output.
- **Contravariance:** Input.
- **Invariance:** No substitution in either direction.
- **Bivariance:** Both directions accepted.

This is a useful mental model, although actual TypeScript behavior depends on the declaration form and type structure.

---

# 16. Understanding `strictFunctionTypes`

This compiler option controls how TypeScript checks function parameter compatibility.

It is enabled by:

```json
{
    "compilerOptions": {
        "strict": true
    }
}
```

Or independently:

```json
{
    "compilerOptions": {
        "strictFunctionTypes": true
    }
}
```

### Example

```typescript
interface Animal {
    name: string;
}

interface Dog extends Animal {
    breed: string;
}

type AnimalHandler = (animal: Animal) => void;

type DogHandler = (dog: Dog) => void;

const handleDog: DogHandler = (dog) => {
    console.log(dog.breed);
};

const handleAnimal: AnimalHandler = handleDog;
```

With `strictFunctionTypes: true`, this assignment is rejected.

Why?

The receiving code may call `handleAnimal` with an ordinary `Animal` that does not contain `breed`.

But `handleDog` requires a `Dog`.

### Reverse direction

```typescript
const handleAnimal: AnimalHandler = (animal) => {
    console.log(animal.name);
};

const handleDog: DogHandler = handleAnimal;
```

This is valid.

The general handler can safely process a dog.

### Important

`strictFunctionTypes` applies to ordinary function types, but method and constructor declarations have the bivariance exception described earlier.

---

# 17. Generic Type Compatibility

Generic types also participate in structural compatibility.

### Example

```typescript
interface Box<T> {
    value: T;
}

const numberBox: Box<number> = {
    value: 100
};

const anotherNumberBox: Box<number> = numberBox;
```

This is valid.

### Different generic arguments

```typescript
const stringBox: Box<string> = {
    value: "Hello"
};

const numberBox: Box<number> = stringBox;
```

This is invalid because their property types are incompatible.

### Generic parameter usage matters

Consider:

```typescript
interface Empty<T> {}

let first: Empty<number>;

let second: Empty<string>;

first = second;
```

This is allowed.

Why?

The generic parameter `T` does not affect the resulting structure of `Empty<T>`.

Both types have the same empty structure.

### Compare

```typescript
interface Box<T> {
    value: T;
}
```

Here, `T` affects the structure because it determines the type of `value`.

Therefore:

```typescript
Box<number>
```

and:

```typescript
Box<string>
```

are incompatible.

### Important rule

Generic compatibility depends on how generic parameters are used in the resulting structure.

---

# 18. Generic Functions and Compatibility

Generic functions have additional compatibility rules.

### Example

```typescript
function identity<T>(value: T): T {
    return value;
}
```

This function is generic.

Its type is conceptually:

```typescript
<T>(value: T) => T
```

### Generic function assignment

```typescript
let first: <T>(value: T) => T;

first = identity;
```

This is valid.

### Another example

```typescript
let second: (value: string) => string;

second = identity;
```

This is also valid.

The generic function can be instantiated for `string`.

### Reverse assignment

```typescript
let genericFunction: <T>(value: T) => T;

let stringFunction: (value: string) => string = value => value;

genericFunction = stringFunction;
```

This is invalid.

Why?

The generic function must work for any type `T`, not just `string`.

### Important

A generic function that supports every type is more flexible than a function that supports only one specific type.

---

# 19. Class Compatibility

TypeScript uses structural compatibility for classes too.

### Example

```typescript
class User {
    name: string;
}

class Employee {
    name: string;
}

const user = new User();

const employee: Employee = user;
```

This is valid because both classes have compatible public structures.

### Different structures

```typescript
class User {
    name: string;
}

class Employee {
    name: string;
    salary: number;
}

const user = new User();

const employee: Employee = user;
```

This is invalid because `salary` is missing.

### Important

Two classes do not need to be related through `extends` to be structurally compatible.

---

# 20. Private and Protected Members in Class Compatibility

Private and protected members introduce a special rule.

When comparing class instance types, private and protected members must originate from the same class declaration to be compatible.

### Example

```typescript
class User {
    private id: number = 1;
}

class Employee {
    private id: number = 1;
}

const user = new User();

const employee: Employee = user;
```

This is invalid.

Even though both classes have a private property named `id` with the same type, the members originate from different declarations.

### Inheritance example

```typescript
class User {
    protected id: number = 1;
}

class Employee extends User {}

const user = new User();

const employee: Employee = user;
```

This assignment is allowed because the protected member originates from the same base class declaration.

### Important rule

| Member | Compatibility behavior |
|---|---|
| Public | Structural compatibility |
| Private | Must originate from the same class declaration |
| Protected | Must originate from the same class declaration, with additional derived-class restrictions |

### Why is this important?

It prevents unrelated classes with private or protected implementation details from being treated as interchangeable simply because their visible structures look similar.

---

# 21. Union Type Compatibility

A union type represents one of several possible types.

### Example

```typescript
type ID = string | number;

let id: ID;

id = 100;

id = "USER-101";
```

Both assignments are valid.

### Assigning a union to a specific type

```typescript
let value: string | number;

let username: string = value;
```

This is invalid.

Why?

The union may contain a number.

TypeScript cannot guarantee that it is a string.

### After narrowing

```typescript
let value: string | number = "Riyaz";

if (typeof value === "string") {
    let username: string = value;
}
```

Now the assignment is valid.

### Assigning a specific type to a union

```typescript
let age: number = 25;

let value: string | number = age;
```

This is valid.

A number is one of the allowed union members.

### Important rule

A value can be assigned to a union if it is compatible with an allowed member.

But a union cannot automatically be assigned to one of its members because it may contain another possibility.

---

# 22. Intersection Type Compatibility

An intersection combines requirements from multiple types.

### Example

```typescript
type Person = {
    name: string;
};

type Employee = {
    salary: number;
};

type WorkingPerson = Person & Employee;
```

A valid value must satisfy both structures.

```typescript
const employee: WorkingPerson = {
    name: "Riyaz",
    salary: 50000
};
```

### Assignment

```typescript
const person: Person = employee;
```

Valid.

The intersection contains everything required by `Person`.

But:

```typescript
const employee: WorkingPerson = person;
```

Invalid because `salary` is missing.

### Important

An intersection type generally requires a value to satisfy all combined type requirements.

---

# 23. Compatibility of `any`, `unknown`, and `never`

These three types have special compatibility rules.

Understanding them is essential.

## A. `any`

`any` disables many type-checking restrictions.

```typescript
let value: any = "Hello";

let age: number = value;

let username: string = value;
```

Both assignments are accepted.

`any` is assignable to almost every type, and almost every type is assignable to `any`.

However, this can hide errors.

## B. `unknown`

`unknown` represents a value whose type is not yet known.

```typescript
let value: unknown = "Hello";
```

This is valid.

But:

```typescript
let username: string = value;
```

This is invalid.

You must narrow or validate the value first.

```typescript
if (typeof value === "string") {
    let username: string = value;
}
```

## C. `never`

`never` represents a value that cannot exist.

It is assignable to every type.

```typescript
let impossible: never;

let username: string = impossible;

let age: number = impossible;
```

These assignments are valid from the type system's perspective.

But the reverse is invalid:

```typescript
let username: string = "Riyaz";

let impossible: never = username;
```

### Compatibility table

| Source | Target | Allowed? |
|---|---|---|
| `any` | `string` | Yes |
| `string` | `any` | Yes |
| `unknown` | `string` | No |
| `string` | `unknown` | Yes |
| `never` | `string` | Yes |
| `string` | `never` | No |
| `unknown` | `any` | Yes |
| `any` | `unknown` | Yes |

### Remember

- `any`: Disables many checks.
- `unknown`: Requires validation before use.
- `never`: Represents an impossible value.

---

# 24. Type Widening

Type widening occurs when TypeScript infers a broader type from a more specific value.

### Example

```typescript
let role = "ADMIN";
```

The inferred type is:

```typescript
string
```

It is not restricted to `"ADMIN"`.

Why?

Because a `let` variable can be reassigned.

```typescript
role = "USER";
```

This is allowed.

### Compare with `const`

```typescript
const role = "ADMIN";
```

The inferred type is:

```typescript
"ADMIN"
```

Because the variable cannot be reassigned.

### Object property widening

```typescript
const user = {
    role: "ADMIN"
};
```

The inferred type is generally:

```typescript
{
    role: string;
}
```

The `const` declaration prevents reassignment of `user`, but it does not make the object's properties readonly or preserve every property as a literal type.

### Using `as const`

```typescript
const user = {
    role: "ADMIN"
} as const;
```

Now the inferred type is:

```typescript
{
    readonly role: "ADMIN";
}
```

### Important

Type widening is a compile-time inference behavior.

It does not change the runtime value.

---

# 25. Type Narrowing

Type narrowing reduces a broad type to a more specific type based on control-flow information.

### Example

```typescript
function printValue(value: string | number): void {
    if (typeof value === "string") {
        console.log(value.toUpperCase());
    } else {
        console.log(value.toFixed(2));
    }
}
```

Initially:

```typescript
string | number
```

Inside the first branch:

```typescript
string
```

Inside the second branch:

```typescript
number
```

### Narrowing techniques

| Technique | Example |
|---|---|
| `typeof` | `typeof value === "string"` |
| `instanceof` | `value instanceof Date` |
| `in` | `"name" in value` |
| Equality | `value === null` |
| Truthiness | `if (value)` |
| Custom type guard | `value is User` |
| Discriminated union | `status === "success"` |

### Widening vs narrowing

| Widening | Narrowing |
|---|---|
| More specific type becomes broader | Broader type becomes more specific |
| Common with mutable variables | Common with conditional checks |
| `let role = "ADMIN"` becomes `string` | `string \| number` becomes `string` in a branch |

---

# 26. Soundness and Unsoundness

This is one of the most important concepts in understanding TypeScript's type system.

## What is Soundness?

A type system is sound if its type guarantees correctly describe runtime behavior under the language's assumptions.

In simple terms:

A sound type system should prevent a program from performing operations that are invalid for the actual runtime value.

### Example of a type-safe operation

```typescript
function greet(name: string): string {
    return name.toUpperCase();
}
```

The function expects a string.

If the caller provides a string, the operation is valid.

## What is Unsoundness?

Unsoundness means that the type system can accept code that may still fail at runtime.

TypeScript intentionally permits certain unsound behaviors to remain practical and compatible with JavaScript.

### Example 1: `any`

```typescript
let value: any = "Hello";

let age: number = value;

console.log(age.toFixed(2));
```

TypeScript accepts this.

But at runtime, `age` contains a string.

Calling `toFixed()` fails.

### Example 2: Type assertion

```typescript
const user = JSON.parse(
    '{"name":"Riyaz"}'
) as {
    name: string;
    age: number;
};

console.log(user.age.toFixed(2));
```

The assertion does not validate the JSON.

It only tells TypeScript to trust the programmer.

### Example 3: Array indexing

```typescript
const numbers = [10, 20, 30];

const value = numbers[100];

console.log(value.toFixed(2));
```

Without `noUncheckedIndexedAccess`, TypeScript generally treats this indexed access as `number`, even though the element may be missing at runtime.

Enable:

```json
{
    "compilerOptions": {
        "noUncheckedIndexedAccess": true
    }
}
```

Then indexed access can include `undefined`.

### Example 4: Non-null assertion

```typescript
const element = document.getElementById("username")!;

element.innerHTML = "Riyaz";
```

The `!` tells TypeScript to assume the value is not null or undefined.

It does not check that assumption at runtime.

### Important

TypeScript is designed to provide useful static guarantees while remaining compatible with JavaScript.

It does not promise complete runtime safety.

---

# 27. Type Assertions and Their Limitations

A type assertion tells TypeScript to treat a value as a specified type.

### Syntax

```typescript
value as Type;
```

Or:

```typescript
<Type>value;
```

The angle-bracket form cannot be used in `.tsx` files because it conflicts with JSX syntax.

### Example

```typescript
const value: unknown = "Hello";

const username = value as string;

console.log(username.toUpperCase());
```

### Important

A type assertion does not:

- Convert the runtime value.
- Validate the runtime value.
- Add missing properties.
- Change the actual JavaScript object.

### Example

```typescript
const value = "100" as unknown as number;

console.log(value.toFixed(2));
```

This may compile, but it fails at runtime because the actual value is still a string.

### Double assertion

```typescript
const value = someValue as unknown as TargetType;
```

This bypasses normal compatibility checks through `unknown`.

Use it only when you have a strong external guarantee about the value.

### Better approach: Runtime validation

```typescript
function isUser(value: unknown): value is {
    name: string;
    age: number;
} {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    if (!("name" in value) || !("age" in value)) {
        return false;
    }

    return (
        typeof value.name === "string" &&
        typeof value.age === "number"
    );
}
```

Usage:

```typescript
const data: unknown = JSON.parse(
    '{"name":"Riyaz","age":25}'
);

if (isUser(data)) {
    console.log(data.name);
    console.log(data.age);
}
```

This performs actual runtime checks.

---

# 28. Type Compatibility with Optional Properties

Optional properties affect compatibility.

### Example

```typescript
type User = {
    name: string;
    age?: number;
};

const user: User = {
    name: "Riyaz"
};
```

Valid.

### Required property comparison

```typescript
type User = {
    name: string;
    age: number;
};

const employee = {
    name: "Riyaz"
};

const user: User = employee;
```

Invalid because `age` is missing.

### Reading optional properties

```typescript
type User = {
    age?: number;
};

const user: User = {};

const age = user.age;
```

The type of `age` includes `undefined`.

### With `exactOptionalPropertyTypes`

```json
{
    "compilerOptions": {
        "strict": true,
        "exactOptionalPropertyTypes": true
    }
}
```

This option distinguishes more carefully between:

- An optional property being absent.
- An optional property explicitly being present with value `undefined`.

For example:

```typescript
interface User {
    name?: string;
}

const user: User = {
    name: undefined
};
```

With `exactOptionalPropertyTypes: true`, this is invalid unless `undefined` is explicitly included:

```typescript
interface User {
    name?: string | undefined;
}
```

### Important

An optional property does not automatically mean that explicit `undefined` is accepted when `exactOptionalPropertyTypes` is enabled.

---

# 29. Type Compatibility with Index Signatures

Index signatures describe the types of properties accessible through an index.

### Example

```typescript
interface User {
    [key: string]: string | number;
}

const user: User = {
    name: "Riyaz",
    age: 25,
    city: "Ahmedabad"
};
```

All properties must be compatible with the index signature.

### Invalid example

```typescript
interface User {
    [key: string]: string | number;
}

const user: User = {
    name: "Riyaz",
    isActive: true
};
```

This is invalid because `boolean` is not allowed by the index signature.

### Important

An index signature affects compatibility of named properties as well.

---

# 30. Nominal Typing Patterns in TypeScript

Although TypeScript primarily uses structural typing, you can create nominal-like distinctions.

A common technique is **branding**.

Branding adds a unique marker to distinguish types that would otherwise have identical structures.

### Example

```typescript
type UserId = number & {
    readonly __brand: "UserId";
};

type ProductId = number & {
    readonly __brand: "ProductId";
};
```

Now these types are conceptually distinct.

### Creating branded values

```typescript
const userId = 101 as UserId;

const productId = 101 as ProductId;
```

### Function example

```typescript
function getUser(id: UserId): void {
    console.log("User ID:", id);
}

getUser(userId);
```

This is valid.

But:

```typescript
getUser(productId);
```

This is invalid because `ProductId` and `UserId` have different brands.

### Why use branding?

It helps prevent accidental mixing of values that share the same underlying primitive type.

Examples:

- User IDs vs product IDs.
- Meters vs kilometers.
- USD vs INR.
- Validated email addresses vs arbitrary strings.
- Database identifiers from different tables.

### Important

Branding is a compile-time technique.

Type assertions or unsafe code can bypass it, and the brand does not automatically exist at runtime.

---

# 31. Practical Example: Type Compatibility in an Express API

Let's apply these concepts to a backend application.

### Define types

```typescript
interface User {
    id: number;
    name: string;
}

interface Employee extends User {
    salary: number;
    department: string;
}
```

### Create an employee

```typescript
const employee: Employee = {
    id: 1,
    name: "Riyaz",
    salary: 50000,
    department: "Engineering"
};
```

### Assign employee to user

```typescript
const user: User = employee;
```

Valid.

`Employee` contains all the properties required by `User`.

### Create a function

```typescript
function sendWelcomeEmail(user: User): void {
    console.log(`Welcome ${user.name}`);
}
```

Pass an employee:

```typescript
sendWelcomeEmail(employee);
```

Valid.

The function only requires a `User`.

It does not need to know whether the supplied object is also an employee.

### Create a function handler

```typescript
type UserHandler = (user: User) => void;

const employeeHandler: UserHandler = (user) => {
    console.log(user.name);
};
```

This is a valid handler.

### What concepts did we use?

- Structural typing.
- Subtyping.
- Assignability.
- Function compatibility.
- Interface inheritance.

These concepts are used constantly in real-world React and Node.js applications.

---

# 32. Practical Example: Prevent Mixing Different IDs

Suppose your application contains:

- User IDs.
- Order IDs.
- Product IDs.

All are numbers.

Without branding:

```typescript
type UserId = number;
type OrderId = number;

function getUser(id: UserId): void {
    console.log(id);
}

const orderId: OrderId = 100;

getUser(orderId);
```

This is allowed because both aliases are simply `number`.

With branding:

```typescript
type UserId = number & {
    readonly __brand: "UserId";
};

type OrderId = number & {
    readonly __brand: "OrderId";
};

function getUser(id: UserId): void {
    console.log(id);
}
```

Now:

```typescript
const userId = 100 as UserId;

const orderId = 200 as OrderId;

getUser(userId);
```

Valid.

But:

```typescript
getUser(orderId);
```

Invalid.

This is a useful pattern in large backend applications.

---

# 33. Important Type Compatibility Rules – Revision Table

| No. | Rule | Explanation |
|---|---|---|
| 1 | Structural typing | Compatibility primarily depends on structure |
| 2 | Extra properties | Ordinary structural assignment allows extra source properties |
| 3 | Excess property checking | Fresh object literals receive additional checks |
| 4 | Required properties | Target-required properties must be present |
| 5 | Optional properties | Optional members do not need to be present |
| 6 | Weak types | All-optional object types receive special overlap checking |
| 7 | Function return types | Return values must be compatible |
| 8 | Function parameters | Checked contravariantly under `strictFunctionTypes` for ordinary function types |
| 9 | Method parameters | Have a bivariance exception |
| 10 | Generic compatibility | Depends on how type parameters affect the structure |
| 11 | Class compatibility | Public members are generally structurally checked |
| 12 | Private members | Must originate from the same declaration |
| 13 | Protected members | Must originate from the same declaration, with inheritance restrictions |
| 14 | Union types | A value must fit an allowed union member |
| 15 | Intersection types | A value must satisfy all combined requirements |
| 16 | `any` | Can bypass many compatibility checks |
| 17 | `unknown` | Requires narrowing before use as a more specific type |
| 18 | `never` | Assignable to every type |
| 19 | Widening | A specific inferred type can become broader |
| 20 | Narrowing | A broad type becomes more specific |
| 21 | Branding | Can create nominal-like distinctions |
| 22 | Type assertions | Do not perform runtime validation |

---

# 34. Common Mistakes

### Mistake 1: Thinking TypeScript uses only nominal typing

TypeScript primarily uses structural typing.

Two unrelated interfaces can be compatible if their structures match.

### Mistake 2: Thinking extra properties are always errors

Extra properties are generally allowed during ordinary structural assignment.

Excess property checking applies specially to fresh object literals.

### Mistake 3: Confusing excess property checking with exact object types

Excess property checking does not make TypeScript's object types exact.

### Mistake 4: Thinking `const` makes object properties readonly

```typescript
const user = {
    name: "Riyaz"
};

user.name = "Ahmed";
```

This is valid.

Use `readonly` or `as const` when you need compile-time property restrictions.

### Mistake 5: Confusing covariance and contravariance

Remember:

- Return positions are commonly covariant.
- Function parameter positions are contravariant under strict function checking.

### Mistake 6: Assuming all generic types are invariant

Generic variance depends on how type parameters are used and on TypeScript's structural compatibility rules.

### Mistake 7: Assuming private members are structurally compatible

Private and protected members have declaration-origin restrictions.

### Mistake 8: Assuming type assertions convert values

Assertions only affect the compiler's interpretation.

They do not transform runtime values.

### Mistake 9: Assuming TypeScript guarantees runtime safety

External data, type assertions, `any`, and other unsound behaviors can lead to runtime errors.

### Mistake 10: Confusing `unknown` and `any`

`unknown` requires validation before use.

`any` largely disables type checking.

---

# 35. Interview Questions and Answers

### Q1. What is structural typing?

Structural typing is a type system in which compatibility is primarily determined by the members and structure of types rather than their declared names.

### Q2. Does TypeScript use structural or nominal typing?

TypeScript primarily uses structural typing, with some nominal-like restrictions for private and protected class members.

### Q3. What is type compatibility?

It determines whether a value of one type can be used where another type is expected.

### Q4. What is assignability?

Assignability determines whether one type can be assigned to another.

### Q5. What is subtyping?

Subtyping is a relationship in which one type can be used wherever another, more general type is expected.

### Q6. What is excess property checking?

It is an additional check performed on fresh object literals to detect unexpected properties.

### Q7. What is a fresh object literal?

It is an object literal being checked directly in a context expecting a particular object type.

### Q8. What is a weak type?

A weak type is generally an object type in which all properties are optional.

### Q9. What is covariance?

Covariance allows a more specific output type to be used where a more general output type is expected.

### Q10. What is contravariance?

Contravariance allows a function accepting a more general input type to be used where a function accepting a more specific input type is expected.

### Q11. What is invariance?

Invariance means neither direction of type substitution is allowed.

### Q12. What is bivariance?

Bivariance means both covariant and contravariant substitutions may be accepted.

### Q13. What is `strictFunctionTypes`?

It is a compiler option that enables stricter function parameter compatibility checks, with exceptions for method and constructor declarations.

### Q14. Why can a function with fewer parameters be assigned to a function expecting more parameters?

Because the implementation can safely ignore arguments supplied by the caller.

### Q15. Why is a function requiring more parameters generally not assignable to a function requiring fewer?

Because the caller is not required to provide the additional arguments.

### Q16. How does TypeScript compare generic types?

It primarily examines their resulting structures and how generic parameters affect those structures.

### Q17. Are two classes with identical public properties compatible?

Generally, yes, because TypeScript uses structural typing.

### Q18. Why are private members treated differently?

Private and protected members must originate from the same class declaration for class instance compatibility.

### Q19. What is the difference between `any` and `unknown`?

`any` bypasses many type checks, while `unknown` requires narrowing or validation before using the value as a specific type.

### Q20. Why is `never` assignable to every type?

Because `never` represents an impossible value, so a value of type `never` can never violate the requirements of another type.

### Q21. What is type widening?

It is the process of inferring a broader type from a more specific value.

### Q22. What is type narrowing?

It is the process of reducing a broad type to a more specific type using control-flow information.

### Q23. What is type branding?

Branding is a technique used to create nominal-like distinctions between structurally similar types.

### Q24. Is TypeScript completely sound?

No. TypeScript intentionally permits certain unsound behaviors to maintain JavaScript compatibility and practical usability.

### Q25. Does a type assertion validate a value?

No. It changes the compiler's interpretation but does not perform runtime validation.

---

# 36. Practical Exercises

Complete these exercises to strengthen your understanding.

## Exercise 1: Structural Typing

Create two interfaces with different names but identical properties.

Check whether values of one interface can be assigned to the other.

## Exercise 2: Additional Properties

Create an object with three properties.

Assign it to an interface requiring only two properties.

Test both:

- Direct object literal assignment.
- Assignment through an intermediate variable.

Explain the difference.

## Exercise 3: Excess Property Checking

Create a function accepting a `User` object.

Pass an object literal containing an additional property.

Then pass an intermediate variable containing the same properties.

Observe the difference.

## Exercise 4: Weak Types

Create an interface containing only optional properties.

Try assigning an object with no overlapping properties.

Then add one overlapping property and test again.

## Exercise 5: Function Compatibility

Create two function types with different parameter counts.

Test assignment in both directions.

## Exercise 6: Covariance

Create `Animal` and `Dog` types.

Create functions returning each type.

Test whether a function returning `Dog` can be assigned to one returning `Animal`.

## Exercise 7: Contravariance

Create:

```typescript
type AnimalHandler = (animal: Animal) => void;
```

And:

```typescript
type DogHandler = (dog: Dog) => void;
```

Test assignment in both directions with `strictFunctionTypes: true`.

## Exercise 8: Method Bivariance

Repeat Exercise 7 using:

- Method signatures.
- Function-property signatures.

Observe how TypeScript treats them differently.

## Exercise 9: Generic Compatibility

Create:

```typescript
interface Box<T> {
    value: T;
}
```

Test compatibility between:

```typescript
Box<number>
Box<string>
```

Then create an empty generic interface and test it with different type arguments.

## Exercise 10: Class Compatibility

Create two classes with identical public properties.

Test assignment.

Then add private properties to both classes and test again.

## Exercise 11: Union Compatibility

Create a union of `string | number`.

Test assignments to:

- `string`
- `number`
- `unknown`
- `any`

Use narrowing where required.

## Exercise 12: `any`, `unknown`, and `never`

Create examples demonstrating assignment rules for all three types.

## Exercise 13: Type Widening

Compare inferred types for:

```typescript
let role = "ADMIN";

const role = "ADMIN";

const user = {
    role: "ADMIN"
};

const user = {
    role: "ADMIN"
} as const;
```

## Exercise 14: Runtime Validation

Create a custom type guard that validates an object containing:

```typescript
{
    id: number;
    name: string;
    email: string;
}
```

Use it to validate the result of `JSON.parse()`.

## Exercise 15: Branded Types

Create separate branded types for:

- User ID.
- Product ID.
- Order ID.

Write functions that accept only the appropriate branded type.

---

# 37. Phase 25 Completion Checklist

| No. | Topic | Status |
|---|---|---|
| 1 | Type compatibility | ☐ |
| 2 | Structural typing | ☐ |
| 3 | Additional properties | ☐ |
| 4 | Assignability | ☐ |
| 5 | Type identity | ☐ |
| 6 | Subtyping | ☐ |
| 7 | Excess property checking | ☐ |
| 8 | Fresh object literals | ☐ |
| 9 | Weak types | ☐ |
| 10 | Function compatibility | ☐ |
| 11 | Function parameter variance | ☐ |
| 12 | Covariance | ☐ |
| 13 | Contravariance | ☐ |
| 14 | Invariance | ☐ |
| 15 | Bivariance | ☐ |
| 16 | `strictFunctionTypes` | ☐ |
| 17 | Generic compatibility | ☐ |
| 18 | Generic function compatibility | ☐ |
| 19 | Class compatibility | ☐ |
| 20 | Private and protected member compatibility | ☐ |
| 21 | Union type compatibility | ☐ |
| 22 | Intersection type compatibility | ☐ |
| 23 | `any`, `unknown`, and `never` compatibility | ☐ |
| 24 | Type widening | ☐ |
| 25 | Type narrowing | ☐ |
| 26 | Soundness and unsoundness | ☐ |
| 27 | Type assertions | ☐ |
| 28 | Optional property compatibility | ☐ |
| 29 | Index signature compatibility | ☐ |
| 30 | Nominal-like typing through branding | ☐ |

---

# What Comes Next?

## Phase 26: TypeScript Configuration and Project Architecture – Advanced `tsconfig.json`

In the next phase, we will study how to configure TypeScript professionally for real-world applications.

Topics will include:

1. Understanding `tsconfig.json` in depth.
2. `target` and ECMAScript versions.
3. `module` and module systems.
4. `moduleResolution`.
5. `rootDir` and `outDir`.
6. `include`, `exclude`, and `files`.
7. Strict compiler options.
8. Null-checking options.
9. Module interoperability.
10. `esModuleInterop` and `allowSyntheticDefaultImports`.
11. `baseUrl` and `paths`.
12. `types` and `typeRoots`.
13. `lib` and runtime APIs.
14. `declaration` and `declarationMap`.
15. `sourceMap` and `inlineSourceMap`.
16. `isolatedModules`.
17. `verbatimModuleSyntax`.
18. `noEmit` and `noEmitOnError`.
19. Development vs production configurations.
20. Node.js, React, and Next.js TypeScript configurations.

**Phase 25 complete.** Say **"OK, Phase 26"** when you're ready to continue.