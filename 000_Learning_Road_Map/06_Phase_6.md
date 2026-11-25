# Phase 6: Objects and Object Types in TypeScript

**Level:** Beginner to Intermediate  
**Category:** TypeScript Fundamentals

## Learning Objectives

By the end of this phase, you will understand:

1. How to define object types.
2. How to specify required and optional properties.
3. How to use `readonly` properties.
4. How to define nested object structures.
5. How TypeScript infers object types.
6. How excess property checking works.
7. How to use index signatures.
8. How object type compatibility works.
9. How to type object destructuring.
10. How to define and type object methods.

---

# 1. What Are Objects in TypeScript?

An object is a collection of properties. Each property contains a key and a value.

JavaScript example:

```javascript
const user = {
    name: "Riyaz",
    age: 25,
    isActive: true
};
```

The object contains three properties:

| Property | Value | JavaScript Type |
|---|---|---|
| name | "Riyaz" | string |
| age | 25 | number |
| isActive | true | boolean |

TypeScript allows us to define the expected structure and types of these properties.

```typescript
const user: {
    name: string;
    age: number;
    isActive: boolean;
} = {
    name: "Riyaz",
    age: 25,
    isActive: true
};
```

Now TypeScript checks that the object follows the specified structure.

For example:

```typescript
const user: {
    name: string;
    age: number;
} = {
    name: "Riyaz",
    age: "25" // Error: string is not assignable to number
};
```

**Important:** TypeScript object types describe the expected shape of an object. They do not create objects at runtime.

---

# 2. Object Type Annotations

We can define an object's structure directly using an object type annotation.

### Syntax

```typescript
let variableName: {
    property1: type;
    property2: type;
    property3: type;
};
```

### Example

```typescript
let employee: {
    id: number;
    name: string;
    salary: number;
    department: string;
};

employee = {
    id: 101,
    name: "John",
    salary: 50000,
    department: "IT"
};
```

TypeScript validates the object against the declared structure.

### Missing Properties

```typescript
let employee: {
    id: number;
    name: string;
    salary: number;
};

employee = {
    id: 101,
    name: "John"
};
```

**Error:** Property `salary` is missing.

### Incorrect Property Types

```typescript
let employee: {
    id: number;
    name: string;
};

employee = {
    id: "101",
    name: "John"
};
```

**Error:** `id` must be a number.

### Important Points

- Every property without `?` is required.
- Property types must match their declarations.
- Property names are part of the object's type.
- Semicolons separate properties inside object type declarations.

---

# 3. Defining Object Structures

Consider an application that manages products.

```typescript
let product: {
    id: number;
    name: string;
    price: number;
    inStock: boolean;
};

product = {
    id: 1,
    name: "Laptop",
    price: 75000,
    inStock: true
};
```

You can also declare and initialize the object in one statement:

```typescript
const product: {
    id: number;
    name: string;
    price: number;
    inStock: boolean;
} = {
    id: 1,
    name: "Laptop",
    price: 75000,
    inStock: true
};
```

### Accessing Object Properties

```typescript
console.log(product.name);
console.log(product.price);
```

TypeScript knows the types of these properties:

```typescript
product.name;  // string
product.price; // number
```

### Updating Properties

```typescript
product.name = "Gaming Laptop";
product.price = 90000;
```

These operations are allowed because the properties are not declared as `readonly`.

However:

```typescript
product.price = "90000"; // Error
```

The property type must remain compatible with its declaration.

---

# 4. Optional Properties

Sometimes an object does not need to contain every property.

For example, a user may or may not have a phone number.

TypeScript provides the `?` symbol to define optional properties.

### Syntax

```typescript
propertyName?: type;
```

### Example

```typescript
let user: {
    name: string;
    age: number;
    email?: string;
};

user = {
    name: "Riyaz",
    age: 25
};
```

This is valid because `email` is optional.

We can also provide it:

```typescript
user = {
    name: "Riyaz",
    age: 25,
    email: "riyaz@example.com"
};
```

Both objects are valid.

### Accessing Optional Properties

```typescript
console.log(user.email);
```

The type of `user.email` is:

```typescript
string | undefined
```

Why?

Because the property might not exist.

### Handling Optional Properties

Use an `if` condition:

```typescript
if (user.email) {
    console.log(user.email.toLowerCase());
}
```

Or use optional chaining:

```typescript
console.log(user.email?.toLowerCase());
```

Or provide a default value:

```typescript
const email = user.email ?? "No email provided";

console.log(email);
```

### Multiple Optional Properties

```typescript
let employee: {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
};
```

### Important Difference

Compare:

```typescript
email?: string;
```

And:

```typescript
email: string | undefined;
```

| Feature | `email?: string` | `email: string \| undefined` |
|---|---|---|
| Property required? | No | Yes |
| Can contain string? | Yes | Yes |
| Can contain undefined? | Yes | Yes |
| Can be omitted? | Yes | No |

Example:

```typescript
let user1: {
    email?: string;
} = {}; // Valid
```

```typescript
let user2: {
    email: string | undefined;
} = {}; // Error
```

The second object must contain the `email` property, even if its value is `undefined`.

**Note:** With `exactOptionalPropertyTypes: true`, explicitly assigning `undefined` to an optional property is not allowed unless `undefined` is included in its declared type.

---

# 5. Readonly Properties

Sometimes we want a property to be assigned only when an object is created.

After initialization, we don't want that property to be reassigned.

TypeScript provides the `readonly` modifier.

### Syntax

```typescript
readonly propertyName: type;
```

### Example

```typescript
const user: {
    readonly id: number;
    name: string;
    age: number;
} = {
    id: 101,
    name: "Riyaz",
    age: 25
};
```

We can modify normal properties:

```typescript
user.name = "John";
user.age = 30;
```

But we cannot modify the readonly property:

```typescript
user.id = 102; // Error
```

### Readonly Properties with Optional Properties

You can combine `readonly` and `?`.

```typescript
const user: {
    readonly id: number;
    readonly email?: string;
    name: string;
} = {
    id: 101,
    name: "Riyaz"
};
```

Neither `id` nor `email` can be reassigned after initialization.

### Readonly Is Not Deeply Readonly

Consider:

```typescript
const user: {
    readonly address: {
        city: string;
    };
} = {
    address: {
        city: "Ahmedabad"
    }
};
```

This is not allowed:

```typescript
user.address = {
    city: "Mumbai"
}; // Error
```

But this is allowed:

```typescript
user.address.city = "Mumbai";
```

Why?

Because `readonly` protects the `address` property from reassignment. It does not automatically make the nested object's properties readonly.

To protect the nested property too:

```typescript
const user: {
    readonly address: {
        readonly city: string;
    };
} = {
    address: {
        city: "Ahmedabad"
    }
};
```

Now this is also an error:

```typescript
user.address.city = "Mumbai";
```

**Important:** `readonly` is a TypeScript compile-time restriction. It does not automatically freeze an object at runtime.

---

# 6. Nested Object Types

Objects can contain other objects.

For example, a user may have an address object.

### Example

```typescript
const user: {
    id: number;
    name: string;
    address: {
        city: string;
        state: string;
        country: string;
    };
} = {
    id: 101,
    name: "Riyaz",
    address: {
        city: "Ahmedabad",
        state: "Gujarat",
        country: "India"
    }
};
```

### Accessing Nested Properties

```typescript
console.log(user.address.city);
console.log(user.address.state);
```

### Nested Optional Properties

You can also define optional nested properties.

```typescript
const user: {
    id: number;
    name: string;
    address?: {
        city: string;
        state: string;
    };
} = {
    id: 101,
    name: "Riyaz"
};
```

Here, the complete `address` property is optional.

Access it safely:

```typescript
console.log(user.address?.city);
```

### Optional Properties Inside Nested Objects

```typescript
const user: {
    id: number;
    name: string;
    address: {
        city: string;
        state?: string;
        country?: string;
    };
} = {
    id: 101,
    name: "Riyaz",
    address: {
        city: "Ahmedabad"
    }
};
```

Here:

- `address` is required.
- `city` is required.
- `state` is optional.
- `country` is optional.

### Objects Containing Arrays

```typescript
const student: {
    id: number;
    name: string;
    subjects: string[];
} = {
    id: 1,
    name: "John",
    subjects: ["Maths", "Science", "English"]
};
```

### Arrays Containing Objects

```typescript
const users: {
    id: number;
    name: string;
    age: number;
}[] = [
    {
        id: 1,
        name: "John",
        age: 25
    },
    {
        id: 2,
        name: "David",
        age: 30
    }
];
```

You can also write:

```typescript
const users: Array<{
    id: number;
    name: string;
    age: number;
}> = [
    {
        id: 1,
        name: "John",
        age: 25
    }
];
```

Both syntaxes are valid.

---

# 7. Object Type Inference

TypeScript can automatically identify object property types.

You do not always need to write explicit type annotations.

### Example

```typescript
const user = {
    name: "Riyaz",
    age: 25,
    isActive: true
};
```

TypeScript infers the type approximately as:

```typescript
{
    name: string;
    age: number;
    isActive: boolean;
}
```

You can verify this through editor IntelliSense.

### Type Inference During Updates

```typescript
let product = {
    name: "Laptop",
    price: 75000
};

product.name = "Desktop"; // Valid
product.price = 50000;    // Valid
```

But:

```typescript
product.price = "50000"; // Error
```

### Adding New Properties

```typescript
let user = {
    name: "Riyaz",
    age: 25
};

user.email = "riyaz@example.com"; // Error
```

Why?

Because TypeScript inferred an object type containing only `name` and `age`.

If you need additional properties, declare them beforehand:

```typescript
let user: {
    name: string;
    age: number;
    email?: string;
} = {
    name: "Riyaz",
    age: 25
};

user.email = "riyaz@example.com"; // Valid
```

### `let` vs `const` Object Inference

Consider:

```typescript
let user = {
    name: "Riyaz"
};
```

The property is generally inferred as:

```typescript
{
    name: string;
}
```

Now consider:

```typescript
const user = {
    name: "Riyaz"
};
```

The property is still generally inferred as `string`, not the literal type `"Riyaz"`.

Why?

Because object properties can still be modified, even when the variable is declared with `const`.

```typescript
user.name = "John"; // Valid
```

If you want literal types:

```typescript
const user = {
    name: "Riyaz"
} as const;
```

Now the inferred type is:

```typescript
{
    readonly name: "Riyaz";
}
```

---

# 8. Excess Property Checking

This is an important TypeScript concept.

TypeScript checks whether an object contains unexpected properties when you directly assign an object literal to a variable with an explicitly declared object type.

### Example

```typescript
type User = {
    name: string;
    age: number;
};

const user: User = {
    name: "Riyaz",
    age: 25,
    email: "riyaz@example.com"
};
```

**Error:** Object literal may only specify known properties.

Why?

Because the declared `User` type does not contain an `email` property.

### Correct Example

```typescript
type User = {
    name: string;
    age: number;
    email?: string;
};

const user: User = {
    name: "Riyaz",
    age: 25,
    email: "riyaz@example.com"
};
```

This is valid.

### Important: Excess Property Checking vs Structural Typing

Consider:

```typescript
type User = {
    name: string;
    age: number;
};

const userData = {
    name: "Riyaz",
    age: 25,
    email: "riyaz@example.com"
};

const user: User = userData;
```

Surprisingly, this is valid.

Why?

Because TypeScript primarily uses **structural typing**.

The `userData` object contains all the properties required by `User`. Having an additional property does not automatically make it incompatible.

### Direct Assignment vs Intermediate Variable

| Direct object literal | Intermediate variable |
|---|---|
| Excess property checking applies | Normal structural compatibility applies |
| Unexpected properties can produce errors | Extra properties are generally allowed |
| Checks the fresh object literal | Checks whether required structure is compatible |

**Remember:** TypeScript object types are not automatically exact object types. Excess property checking is a special check for fresh object literals, not a universal rule that prohibits additional properties.

---

# 9. Index Signatures

Sometimes we don't know all the property names in advance.

For example, imagine a system that stores dynamic configuration values:

```typescript
const settings = {
    theme: "dark",
    language: "English",
    timezone: "IST"
};
```

We may want to allow additional properties without declaring each property individually.

TypeScript provides **index signatures**.

### Syntax

```typescript
type TypeName = {
    [key: string]: valueType;
};
```

### Example

```typescript
type UserDetails = {
    [key: string]: string;
};

const user: UserDetails = {
    name: "Riyaz",
    city: "Ahmedabad",
    country: "India"
};
```

Here:

- Property names must be strings.
- Property values must be strings.
- Additional properties are allowed.

### Number Index Signature

```typescript
type Scores = {
    [key: number]: number;
};

const marks: Scores = {
    1: 80,
    2: 90,
    3: 85
};
```

JavaScript object keys are ultimately strings or symbols, but TypeScript supports number index signatures for numeric property access.

### Mixed Property Types

Suppose we want an object with a fixed `name` property and dynamic numeric properties.

```typescript
type User = {
    name: string;
    [key: string]: string | number;
};

const user: User = {
    name: "Riyaz",
    age: 25,
    city: "Ahmedabad"
};
```

This is valid.

But:

```typescript
type User = {
    name: string;
    [key: string]: number;
};
```

This is invalid because the `name` property is a string, which is not compatible with the index signature's value type.

**Important rule:** Every explicitly declared property must be compatible with the applicable index signature.

### Reading Values from an Index Signature

```typescript
type UserDetails = {
    [key: string]: string;
};

const user: UserDetails = {
    name: "Riyaz",
    city: "Ahmedabad"
};

const name = user["name"];
```

The type of `name` is `string`.

If `noUncheckedIndexedAccess` is enabled, reading a potentially missing indexed property may produce a type that includes `undefined`.

### Index Signature vs Optional Properties

| Index Signature | Optional Property |
|---|---|
| Allows dynamic property names | Defines a known property that may be absent |
| Applies to many possible keys | Applies to a specific key |
| Example: `[key: string]: number` | Example: `age?: number` |

---

# 10. Object Type Compatibility

TypeScript primarily uses structural typing.

This means TypeScript checks whether an object has the required structure, rather than whether it was explicitly declared using a particular type name.

### Example

```typescript
type Person = {
    name: string;
    age: number;
};

const user = {
    name: "Riyaz",
    age: 25
};

const person: Person = user;
```

This is valid.

Why?

Because `user` contains all the properties required by `Person`, with compatible types.

### Different Property Names

```typescript
type Person = {
    name: string;
    age: number;
};

const user = {
    username: "Riyaz",
    age: 25
};

const person: Person = user; // Error
```

Why?

Because `Person` requires a `name` property, but `user` contains `username`.

### Additional Properties

```typescript
type Person = {
    name: string;
};

const user = {
    name: "Riyaz",
    age: 25
};

const person: Person = user; // Valid
```

Additional properties are generally allowed when assigning an existing variable.

### Structural Typing vs Nominal Typing

| Structural Typing | Nominal Typing |
|---|---|
| Based on object structure | Based on declared identity |
| Compatible structures can be assigned | Types generally need an explicit relationship |
| TypeScript primarily uses this approach | Languages such as Java commonly use nominal typing |

**Important:** TypeScript is not purely structural in every situation. Features such as private and protected class members, and certain branded-type patterns, introduce nominal-like compatibility restrictions.

---

# 11. Object Destructuring with Types

Object destructuring allows us to extract properties into variables.

JavaScript example:

```javascript
const user = {
    name: "Riyaz",
    age: 25
};

const { name, age } = user;
```

TypeScript can infer the types automatically.

```typescript
const user = {
    name: "Riyaz",
    age: 25
};

const { name, age } = user;

console.log(name); // string
console.log(age);  // number
```

### Explicitly Typing Destructured Objects

You can annotate the entire destructuring pattern:

```typescript
const user = {
    name: "Riyaz",
    age: 25
};

const { name, age }: {
    name: string;
    age: number;
} = user;
```

### Destructuring with Aliases

You can rename extracted properties.

```typescript
const user = {
    name: "Riyaz",
    age: 25
};

const { name: userName, age: userAge } = user;

console.log(userName);
console.log(userAge);
```

### Destructuring with Default Values

```typescript
const user = {
    name: "Riyaz"
};

const { name, age = 25 } = user;

console.log(age); // 25
```

The default value is used when the property is `undefined`.

### Destructuring Optional Properties

```typescript
type User = {
    name: string;
    email?: string;
};

const user: User = {
    name: "Riyaz"
};

const { name, email } = user;
```

The inferred types are:

```typescript
name;  // string
email; // string | undefined
```

### Important Syntax Difference

This is valid:

```typescript
const { name }: { name: string } = user;
```

But this is not the correct way to annotate the type of the destructured variable:

```typescript
const { name: string } = user;
```

In JavaScript destructuring syntax, `name: string` means "extract the `name` property and assign it to a variable called `string`." It does not declare a TypeScript type.

---

# 12. Object Methods and Typing

Objects can also contain functions as properties.

These functions are called object methods when they are defined as part of an object.

### Example

```typescript
const user = {
    name: "Riyaz",

    greet() {
        console.log("Hello!");
    }
};

user.greet();
```

TypeScript automatically infers the method's type.

### Defining Method Types Explicitly

```typescript
const user: {
    name: string;
    greet: () => void;
} = {
    name: "Riyaz",

    greet: () => {
        console.log("Hello!");
    }
};
```

Here:

```typescript
greet: () => void;
```

Means:

- `greet` is a function property.
- It accepts no parameters.
- It returns no meaningful value.

### Method with Parameters

```typescript
const calculator: {
    add: (a: number, b: number) => number;
} = {
    add: (a, b) => {
        return a + b;
    }
};

console.log(calculator.add(10, 20));
```

### Method Syntax

You can also write:

```typescript
const calculator: {
    add(a: number, b: number): number;
} = {
    add(a, b) {
        return a + b;
    }
};
```

Both approaches define a method that accepts two numbers and returns a number.

### Methods Using `this`

```typescript
const user = {
    name: "Riyaz",

    greet() {
        console.log(`Hello, ${this.name}`);
    }
};

user.greet();
```

TypeScript understands that `this` refers to the object in this method.

Be careful with arrow functions:

```typescript
const user = {
    name: "Riyaz",

    greet: () => {
        console.log(this);
    }
};
```

Arrow functions do not create their own `this`. They capture it from the surrounding scope.

For object methods that need the object as `this`, regular method syntax is usually more appropriate.

---

# 13. The Difference Between `object` and Object Types

This is an important distinction.

Consider:

```typescript
let user: object = {
    name: "Riyaz",
    age: 25
};
```

This tells TypeScript that `user` is a non-primitive object.

But TypeScript does not expose the `name` and `age` properties through the type `object`.

```typescript
console.log(user.name); // Error
```

Why?

Because `object` does not describe which properties are available.

Instead, define the actual structure:

```typescript
let user: {
    name: string;
    age: number;
} = {
    name: "Riyaz",
    age: 25
};

console.log(user.name); // Valid
```

### Comparison

| Type | Meaning |
|---|---|
| `object` | Any non-primitive value |
| `{ name: string }` | Object containing a string property called `name` |
| `{}` | Broad type accepting any non-nullish value |
| `Object` | Global JavaScript Object type; generally avoid using it as a type |

**Best Practice:** Prefer specific object types instead of using the broad `object` or `Object` types.

---

# 14. The `satisfies` Operator (Advanced Preview)

TypeScript introduced the `satisfies` operator in TypeScript 4.9.

It checks whether an expression satisfies a particular type without simply replacing the expression's inferred type with that target type.

### Example

```typescript
type User = {
    name: string;
    age: number;
};

const user = {
    name: "Riyaz",
    age: 25
} satisfies User;
```

TypeScript verifies that the object matches the `User` structure.

The inferred type of `user` remains based on the expression itself.

### Why Is It Useful?

Compare:

```typescript
type Colors = {
    primary: string;
    secondary: string;
};

const colors: Colors = {
    primary: "#000000",
    secondary: "#ffffff"
};
```

Here, the variable is viewed through the declared `Colors` type.

Now:

```typescript
const colors = {
    primary: "#000000",
    secondary: "#ffffff"
} satisfies Colors;
```

The expression retains its more specific inferred property information.

This can be useful when working with configuration objects, theme definitions, route maps, and application settings.

**Important:** `satisfies` checks compatibility; it does not make the object immutable or create an exact-object type.

---

# 15. Real-World Example: User Management

Let's combine the concepts from this phase.

```typescript
type User = {
    readonly id: number;

    name: string;
    email?: string;

    address: {
        city: string;
        state: string;
        country: string;
    };

    skills: string[];

    isActive: boolean;

    getDetails: () => string;
};

const user: User = {
    id: 101,

    name: "Riyaz",

    email: "riyaz@example.com",

    address: {
        city: "Ahmedabad",
        state: "Gujarat",
        country: "India"
    },

    skills: ["JavaScript", "TypeScript", "React"],

    isActive: true,

    getDetails() {
        return `${this.name} lives in ${this.address.city}`;
    }
};

console.log(user.getDetails());

console.log(user.address.city);

console.log(user.skills);
```

### Concepts Used

| Concept | Example |
|---|---|
| Object type | `type User = { ... }` |
| Readonly property | `readonly id: number` |
| Optional property | `email?: string` |
| Nested object | `address` |
| Array inside object | `skills: string[]` |
| Boolean property | `isActive: boolean` |
| Method typing | `getDetails: () => string` |
| `this` | `this.name` |

This structure is similar to the types you will define when building APIs and full-stack applications.

---

# 16. Common Mistakes

### Mistake 1: Forgetting Required Properties

```typescript
type User = {
    name: string;
    age: number;
};

const user: User = {
    name: "Riyaz"
};
```

**Problem:** `age` is required.

### Mistake 2: Using `?` Incorrectly

```typescript
type User = {
    name?: string;
};
```

This means `name` may be omitted. It does not mean that the property must exist.

### Mistake 3: Assuming `readonly` Makes the Entire Object Immutable

```typescript
const user: {
    readonly address: {
        city: string;
    };
} = {
    address: {
        city: "Ahmedabad"
    }
};

user.address.city = "Mumbai"; // Valid
```

The nested property remains mutable.

### Mistake 4: Assuming Excess Properties Are Always Forbidden

```typescript
type User = {
    name: string;
};

const data = {
    name: "Riyaz",
    age: 25
};

const user: User = data; // Valid
```

This works because of structural typing.

### Mistake 5: Using `object` Instead of a Specific Structure

```typescript
const user: object = {
    name: "Riyaz"
};

user.name; // Error
```

Use a specific object type when you need access to its properties.

### Mistake 6: Ignoring Optional Property Values

```typescript
type User = {
    email?: string;
};

const user: User = {};

console.log(user.email.toLowerCase()); // Error
```

The property may be `undefined`.

Correct:

```typescript
console.log(user.email?.toLowerCase());
```

---

# 17. Interview Questions and Answers

### Q1. What is an object type in TypeScript?

An object type defines the expected structure of an object, including its property names and corresponding data types.

### Q2. What is an optional property?

An optional property is a property that may or may not exist in an object. It is declared using `?`.

```typescript
type User = {
    email?: string;
};
```

### Q3. What is a readonly property?

A readonly property cannot be reassigned after initialization through that readonly reference.

```typescript
type User = {
    readonly id: number;
};
```

### Q4. Does readonly make an object immutable at runtime?

No. It is a compile-time TypeScript restriction. It does not automatically freeze the object at runtime.

### Q5. What is a nested object?

An object that contains another object as one of its properties.

```typescript
type User = {
    address: {
        city: string;
    };
};
```

### Q6. What is object type inference?

Object type inference is TypeScript's ability to automatically determine an object's property names and their types without explicit annotations.

### Q7. What is excess property checking?

It is a TypeScript check that detects unexpected properties when a fresh object literal is assigned to a target object type.

### Q8. What is an index signature?

An index signature allows an object to contain properties with dynamic keys of a specified key type and values of a specified value type.

```typescript
type User = {
    [key: string]: string;
};
```

### Q9. What is structural typing?

Structural typing is a type compatibility system where compatibility is primarily determined by the structure of types rather than their declared names.

### Q10. What is the difference between `object` and `{ name: string }`?

`object` accepts non-primitive values but does not specify their properties. `{ name: string }` describes an object that must contain a string property called `name`.

### Q11. Can an object contain arrays and functions?

Yes. Object properties can have array types, function types, nested object types, and other supported TypeScript types.

### Q12. What is the difference between `email?: string` and `email: string | undefined`?

The first property can be omitted. The second property must exist, although its value can be `undefined`.

### Q13. What is the `satisfies` operator?

It checks whether an expression is compatible with a specified type while preserving the expression's inferred type rather than simply annotating it with the target type.

### Q14. Can we add new properties to an inferred object?

Not directly if those properties are not part of its inferred type. Declare the expected properties or use a suitable index signature.

### Q15. Does TypeScript use structural or nominal typing?

TypeScript primarily uses structural typing, although some features introduce nominal-like compatibility restrictions.

---

# 18. Practical Exercises

Complete these exercises yourself before moving to the next phase.

## Exercise 1: Student Object

Create a `student` object with these properties:

- `id`: number
- `name`: string
- `age`: number
- `isEnrolled`: boolean
- `email`: optional string

Create an object using this structure.

## Exercise 2: Employee Object

Create an `employee` object with:

- `id`: readonly number
- `name`: string
- `salary`: number
- `department`: string
- `phone`: optional string

Try modifying the `id` and observe the error.

## Exercise 3: Nested Object

Create a `product` object containing:

- `id`: number
- `name`: string
- `price`: number
- `category`: an object containing `id` and `name`
- `tags`: an array of strings

## Exercise 4: Array of Objects

Create an array of five users.

Each user should contain:

- `id`
- `name`
- `age`
- `isActive`

Use a suitable object type annotation.

## Exercise 5: Index Signature

Create a `settings` object that allows dynamic string keys and string values.

Add these properties:

```typescript
theme: "dark"
language: "English"
timezone: "IST"
```

Also add two additional properties of your choice.

## Exercise 6: Object Methods

Create a calculator object with these methods:

- `add(a, b)`
- `subtract(a, b)`
- `multiply(a, b)`
- `divide(a, b)`

All parameters should be numbers, and all methods should return numbers.

## Exercise 7: Object Destructuring

Create a user object containing:

- `name`
- `age`
- `email`

Extract all three properties using destructuring.

Rename `name` to `userName`.

## Exercise 8: Excess Property Checking

Create a type called `Person` containing:

- `name`
- `age`

Try assigning an object containing an additional `email` property directly.

Then assign the same object through an intermediate variable.

Observe the difference.

## Exercise 9: Real-World Project

Create a `Product` type for an e-commerce application.

It should contain:

- `id`: readonly number
- `name`: string
- `description`: optional string
- `price`: number
- `discount`: optional number
- `category`: nested object
- `images`: array of strings
- `inStock`: boolean
- `getFinalPrice()`: method returning a number

Create at least three products.

---

# 19. Phase 6 Completion Checklist

Before proceeding, make sure you understand these concepts:

- [ ] Object type annotations
- [ ] Defining object structures
- [ ] Required properties
- [ ] Optional properties
- [ ] `readonly` properties
- [ ] Nested object types
- [ ] Objects containing arrays
- [ ] Arrays containing objects
- [ ] Object type inference
- [ ] Excess property checking
- [ ] Index signatures
- [ ] Structural typing
- [ ] Object type compatibility
- [ ] Object destructuring with types
- [ ] Object methods and function properties
- [ ] Difference between `object`, `{}`, and specific object types
- [ ] `satisfies` operator

---

## Next Phase: Phase 7 — Functions in TypeScript

In the next phase, we will cover:

1. Function parameter types
2. Function return types
3. Optional parameters
4. Default parameters
5. Rest parameters
6. Function expressions
7. Arrow functions
8. Anonymous functions
9. Callback functions
10. Function type expressions
11. `void` return type
12. `never` return type in functions
13. Function type inference
14. Function overloads
15. Typing real-world functions

**When you're ready, say: `OK, Phase 7`.**