# Phase 4: Variables and Type Annotations in TypeScript
**Level: Beginner to Intermediate**

In Phase 3, we learned about TypeScript's basic types, including `string`, `number`, `boolean`, `any`, `unknown`, `void`, and `never`.

In this phase, we will understand how to work with variables and apply type annotations in different situations.

This phase is important because variables are used in almost every TypeScript application.

## What You Will Learn

1. Type annotations with `let`.
2. Type annotations with `const`.
3. Type inference with variables.
4. Explicit vs implicit typing.
5. Type annotations with functions.
6. Type annotations with objects.
7. Type annotations with arrays.
8. Type narrowing basics.
9. Reassigning typed variables.
10. Type compatibility.

---

# 1. Variables in TypeScript

A variable is a named storage location used to store data.

JavaScript provides three ways to declare variables:

- `var`
- `let`
- `const`

TypeScript supports all three.

### Example

```typescript
var username = "Riyaz";

let age = 25;

const city = "Ahmedabad";
```

TypeScript adds type annotations to variable declarations.

### Example

```typescript
let username: string = "Riyaz";

let age: number = 25;

const isActive: boolean = true;
```

Here:

- `let` and `const` declare variables.
- `username`, `age`, and `isActive` are variable names.
- `string`, `number`, and `boolean` are types.
- `:` separates the variable name from its type annotation.

### Syntax

```typescript
let variableName: type = value;

const variableName: type = value;

var variableName: type = value;
```

---

# 2. Type Annotations with let

The `let` keyword declares a block-scoped variable that can be reassigned.

### Example

```typescript
let age: number = 25;

age = 30;

age = 35;

console.log(age);
```

Output:

```text
35
```

The variable can be reassigned because `let` allows reassignment.

However, the assigned value must remain compatible with the declared type.

### Incorrect Example

```typescript
let age: number = 25;

age = "Thirty"; // Error
```

TypeScript reports:

```text
Type 'string' is not assignable to type 'number'.
```

### Multiple Examples

```typescript
let username: string = "Riyaz";

username = "Ahmed";

let salary: number = 50000;

salary = 60000;

let isLoggedIn: boolean = true;

isLoggedIn = false;
```

All these assignments are valid.

### Important

The type annotation defines the allowed type of values, not the exact value.

For example:

```typescript
let age: number = 25;

age = 30; // Valid

age = 40; // Valid

age = 50; // Valid
```

All numbers are allowed.

---

# 3. Type Annotations with const

The `const` keyword declares a block-scoped variable that cannot be reassigned.

### Example

```typescript
const username: string = "Riyaz";

console.log(username);
```

The following assignment is invalid:

```typescript
const username: string = "Riyaz";

username = "Ahmed"; // Error
```

Why?

Because `const` variables cannot be reassigned.

### const with Different Types

```typescript
const age: number = 25;

const salary: number = 50000;

const isActive: boolean = true;
```

### Type Inference with const

Consider:

```typescript
const age = 25;
```

TypeScript infers:

```typescript
const age: 25 = 25;
```

Notice something interesting.

With `let`:

```typescript
let age = 25;
```

The inferred type is:

```typescript
let age: number;
```

With `const`:

```typescript
const age = 25;
```

The inferred type is:

```typescript
const age: 25;
```

Why?

Because a `const` variable cannot be reassigned, so TypeScript can preserve its literal type.

### let vs const

| Feature | let | const |
|---|---|---|
| Reassignment | Allowed | Not allowed |
| Scope | Block scope | Block scope |
| Type inference | Usually broader types | Can preserve literal types |
| Initialization | Can be delayed | Required during declaration |
| Redeclaration in same scope | Not allowed | Not allowed |

### Important: const with Objects

This is a very important JavaScript and TypeScript concept.

```typescript
const user = {
    name: "Riyaz",
    age: 25
};

user.name = "Ahmed"; // Valid

user.age = 30; // Valid
```

But:

```typescript
user = {
    name: "Ali",
    age: 28
}; // Error
```

Why?

Because `const` prevents reassignment of the variable reference. It does not automatically make the object's properties immutable.

We will study readonly properties later.

---

# 4. Type Annotations with var

JavaScript also provides the `var` keyword.

TypeScript supports it as well.

### Example

```typescript
var age: number = 25;

age = 30;

console.log(age);
```

Output:

```text
30
```

### var vs let vs const

| Feature | var | let | const |
|---|---|---|---|
| Scope | Function scope | Block scope | Block scope |
| Reassignment | Yes | Yes | No |
| Redeclaration | Yes | No | No |
| Hoisting | Yes | Yes, but inaccessible before initialization | Yes, but inaccessible before initialization |
| Initialization required | No | No | Yes |

### Best Practice

Prefer:

- `const` when reassignment is unnecessary.
- `let` when reassignment is required.
- Avoid `var` in modern TypeScript development.

---

# 5. Type Inference with Variables

Type inference means TypeScript automatically determines a variable's type from its assigned value or context.

You do not always need explicit type annotations.

### Example

```typescript
let username = "Riyaz";

let age = 25;

let salary = 50000;

let isActive = true;
```

TypeScript automatically infers:

```typescript
let username: string;

let age: number;

let salary: number;

let isActive: boolean;
```

### Example: Reassignment

```typescript
let age = 25;

age = 30; // Valid

age = "Thirty"; // Error
```

Even without explicitly declaring `number`, TypeScript knows that `age` is a number.

### Example: Function Return Inference

```typescript
function add(a: number, b: number) {
    return a + b;
}
```

TypeScript infers:

```typescript
function add(a: number, b: number): number {
    return a + b;
}
```

### Example: Array Inference

```typescript
let numbers = [10, 20, 30];
```

Inferred type:

```typescript
let numbers: number[];
```

### Example: Object Inference

```typescript
let user = {
    name: "Riyaz",
    age: 25,
    isActive: true
};
```

TypeScript infers approximately:

```typescript
let user: {
    name: string;
    age: number;
    isActive: boolean;
};
```

### When Does Type Inference Work?

TypeScript can infer types from:

1. Initial variable values.
2. Function return statements.
3. Function parameters in certain contextual situations.
4. Object properties.
5. Array elements.
6. Expressions.
7. Contextual typing.

We will explore contextual typing and more advanced inference later.

---

# 6. Explicit vs Implicit Typing

These are two ways TypeScript obtains type information.

## Explicit Typing

The developer manually specifies the type.

```typescript
let username: string = "Riyaz";

let age: number = 25;

let isActive: boolean = true;
```

Here, we explicitly specify the types.

## Implicit Typing

TypeScript automatically determines the types.

```typescript
let username = "Riyaz";

let age = 25;

let isActive = true;
```

Here, TypeScript infers the types.

### Comparison

| Feature | Explicit Typing | Implicit Typing |
|---|---|---|
| Type declaration | Developer specifies | TypeScript determines |
| Syntax | Uses `:` | No annotation needed |
| Code length | Sometimes longer | Usually shorter |
| Readability | Makes intended types explicit | Works well when types are obvious |
| Example | `let age: number = 25` | `let age = 25` |

### Professional Best Practice

Use inference when TypeScript can clearly determine the intended type.

Use explicit typing when:

- Function parameters need types.
- Function return types should be documented.
- Variables are declared before initialization.
- The intended type is broader than the initial value.
- Complex object structures need clear definitions.

### Example: Explicit Type Is Necessary

```typescript
let username: string;

username = "Riyaz";
```

Here, we declare the variable without immediately assigning a value.

We need an explicit type annotation because there is no initial value from which TypeScript can infer the intended type.

---

# 7. Type Annotations with Functions

Functions can have type annotations for:

1. Parameters.
2. Return values.

This is one of the most important areas of TypeScript.

## 7.1 Function Parameter Types

### JavaScript

```javascript
function greet(name) {
    return `Hello ${name}`;
}
```

JavaScript does not enforce a specific parameter type.

### TypeScript

```typescript
function greet(name: string) {
    return `Hello ${name}`;
}
```

Here, `name` must be a string.

Valid:

```typescript
greet("Riyaz");
```

Invalid:

```typescript
greet(100); // Error
```

### Multiple Parameters

```typescript
function add(a: number, b: number) {
    return a + b;
}

console.log(add(10, 20));
```

Both parameters must be numbers.

## 7.2 Function Return Types

We can explicitly specify the return type of a function.

### Syntax

```typescript
function functionName(): returnType {
    // Function body
}
```

### Example

```typescript
function add(a: number, b: number): number {
    return a + b;
}
```

Here:

- `a: number` defines the first parameter.
- `b: number` defines the second parameter.
- `: number` after the parentheses specifies the return type.

### Incorrect Return Type

```typescript
function add(a: number, b: number): number {
    return "Hello"; // Error
}
```

The function promises to return a number, but it returns a string.

### Function Returning String

```typescript
function getUsername(): string {
    return "Riyaz";
}
```

### Function Returning Boolean

```typescript
function isAdult(age: number): boolean {
    return age >= 18;
}
```

### Function Returning Nothing

```typescript
function displayMessage(): void {
    console.log("Welcome");
}
```

### Function Return Type Inference

You do not always need to specify return types.

```typescript
function multiply(a: number, b: number) {
    return a * b;
}
```

TypeScript automatically infers `number`.

### Best Practice

Explicit return types are particularly useful for public functions, APIs, exported functions, and complex business logic.

---

# 8. Type Annotations with Arrow Functions

TypeScript supports type annotations with arrow functions.

### Example

```typescript
const greet = (name: string): string => {
    return `Hello ${name}`;
};
```

### Multiple Parameters

```typescript
const add = (a: number, b: number): number => {
    return a + b;
};
```

### Arrow Function with Void

```typescript
const display = (message: string): void => {
    console.log(message);
};
```

### Arrow Function with Type Inference

```typescript
const multiply = (a: number, b: number) => {
    return a * b;
};
```

TypeScript infers the return type.

### Important

Type annotations go on parameters and the return type.

```typescript
const functionName = (parameter: type): returnType => {
    // Logic
};
```

---

# 9. Type Annotations with Objects

TypeScript allows you to specify the structure of an object directly.

### Example

```typescript
let user: {
    name: string;
    age: number;
    isActive: boolean;
} = {
    name: "Riyaz",
    age: 25,
    isActive: true
};
```

Here:

- `name` must be a string.
- `age` must be a number.
- `isActive` must be a boolean.

### Incorrect Example

```typescript
let user: {
    name: string;
    age: number;
} = {
    name: "Riyaz",
    age: "Twenty Five"
};
```

Error:

```text
Type 'string' is not assignable to type 'number'.
```

### Missing Property

```typescript
let user: {
    name: string;
    age: number;
} = {
    name: "Riyaz"
};
```

This produces an error because `age` is required.

### Additional Property

```typescript
let user: {
    name: string;
    age: number;
} = {
    name: "Riyaz",
    age: 25,
    city: "Ahmedabad"
};
```

This produces an excess property checking error because the object literal contains an undeclared property.

### Important

We are writing the object type directly here.

In real applications, we usually use interfaces or type aliases to define reusable object structures.

We will study these in Phases 8 and 9.

---

# 10. Type Annotations with Arrays

We can also specify the type of elements allowed inside an array.

There are two common syntaxes.

### Syntax 1: Type[]

```typescript
let numbers: number[] = [10, 20, 30];

let names: string[] = ["Riyaz", "Ahmed", "Ali"];

let statuses: boolean[] = [true, false, true];
```

### Syntax 2: Array<Type>

```typescript
let numbers: Array<number> = [10, 20, 30];

let names: Array<string> = ["Riyaz", "Ahmed"];
```

Both syntaxes are valid.

### Incorrect Assignment

```typescript
let numbers: number[] = [10, 20, 30];

numbers.push(40); // Valid

numbers.push("50"); // Error
```

### Mixed-Type Array

Suppose an array should contain both strings and numbers.

```typescript
let values: (string | number)[] = [
    "Riyaz",
    25,
    "Ahmedabad",
    50000
];
```

This is valid.

The parentheses make it clear that the array elements can be either strings or numbers.

We will study unions in Phase 10.

---

# 11. Type Narrowing Basics

Type narrowing means reducing a variable's possible types through checks.

For example, a variable might contain either a string or a number.

We can check its type before performing specific operations.

### Example

```typescript
let value: string | number = "Riyaz";
```

This variable can contain:

- A string.
- A number.

Now:

```typescript
function displayValue(value: string | number): void {

    if (typeof value === "string") {
        console.log(value.toUpperCase());
    }

    else {
        console.log(value.toFixed(2));
    }

}
```

### How Does It Work?

Inside the first condition:

```typescript
if (typeof value === "string")
```

TypeScript knows that `value` is a string.

Therefore:

```typescript
value.toUpperCase();
```

is valid.

Inside the `else` block, TypeScript knows that `value` must be a number.

Therefore:

```typescript
value.toFixed(2);
```

is valid.

### Another Example

```typescript
function printLength(value: string | null): void {

    if (value !== null) {
        console.log(value.length);
    }

}
```

Here, TypeScript understands that `value` is a string inside the `if` block.

### Common Narrowing Techniques

| Technique | Example |
|---|---|
| typeof | `typeof value === "string"` |
| Truthiness | `if (value)` |
| Equality | `value !== null` |
| instanceof | `value instanceof Date` |
| in operator | `"name" in user` |

We will study all these techniques in detail in Phase 11.

---

# 12. Reassigning Typed Variables

A variable's type determines which values can be assigned to it.

### Example 1: Number

```typescript
let age: number = 25;

age = 30; // Valid

age = 35; // Valid

age = "Thirty"; // Error
```

### Example 2: String

```typescript
let username: string = "Riyaz";

username = "Ahmed"; // Valid

username = 100; // Error
```

### Example 3: Union Type

A variable can support multiple types using a union.

```typescript
let value: string | number = "Riyaz";

value = 25; // Valid

value = "Ahmed"; // Valid

value = true; // Error
```

### Example 4: Literal Type

```typescript
let status: "active" | "inactive" = "active";

status = "inactive"; // Valid

status = "pending"; // Error
```

### Important: Type Annotation vs Reassignment

Consider:

```typescript
let age: number = 25;
```

The variable's declared type is `number`.

It does not mean that the variable must always contain `25`.

It can contain any valid number.

---

# 13. Type Compatibility

Type compatibility determines whether a value can be assigned to a particular variable or passed to a function.

TypeScript primarily uses structural typing.

Let's understand some examples.

### Example 1: Same Types

```typescript
let first: number = 100;

let second: number = first;
```

Valid because both are numbers.

### Example 2: Different Types

```typescript
let first: string = "Riyaz";

let second: number = first; // Error
```

Invalid because a string is not compatible with a number.

### Example 3: Object Compatibility

```typescript
let user: {
    name: string;
} = {
    name: "Riyaz"
};

let employee: {
    name: string;
} = user;
```

Valid because the required object structures are compatible.

### Example 4: Function Parameter Compatibility

```typescript
function greet(name: string): void {
    console.log(`Hello ${name}`);
}

greet("Riyaz"); // Valid

greet(100); // Error
```

TypeScript checks whether the supplied argument is compatible with the parameter type.

---

# 14. Type Annotations with Destructuring

Destructuring is a JavaScript feature that extracts values from arrays or objects.

TypeScript supports type annotations with destructuring.

### Object Destructuring

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

Here, we specify the expected structure of the object being destructured.

### Array Destructuring

```typescript
const numbers: number[] = [10, 20, 30];

const [first, second, third]: number[] = numbers;
```

The variables are inferred as numbers.

### Function Parameter Destructuring

```typescript
function displayUser(
    { name, age }: {
        name: string;
        age: number;
    }
): void {

    console.log(name);
    console.log(age);
}

displayUser({
    name: "Riyaz",
    age: 25
});
```

This is useful when working with functions that receive objects.

---

# 15. Type Annotations with Default Parameters

JavaScript allows default parameter values.

TypeScript supports this feature with type annotations.

### Example

```typescript
function greet(
    name: string = "Guest"
): string {

    return `Hello ${name}`;
}

console.log(greet());

console.log(greet("Riyaz"));
```

Output:

```text
Hello Guest
Hello Riyaz
```

Here, `name` is inferred as a string.

### Explicit Annotation

You can also write:

```typescript
function greet(
    name: string = "Guest"
): string {
    return `Hello ${name}`;
}
```

### Important

A parameter with a default value is optional when calling the function.

We will study optional and default parameters in detail in Phase 7.

---

# 16. Type Annotations with Multiple Variables

You can declare multiple variables in a single statement.

```typescript
let firstName: string = "Riyaz",
    lastName: string = "Khan",
    city: string = "Ahmedabad";
```

However, for readability, separate declarations are often preferable.

### Different Types

```typescript
let username: string = "Riyaz";

let age: number = 25;

let isActive: boolean = true;
```

You should generally avoid combining unrelated variables in a single declaration.

---

# 17. Type Annotations with Expressions

TypeScript can infer the result type of expressions.

### Example: Arithmetic

```typescript
let first: number = 10;

let second: number = 20;

let result = first + second;
```

Inferred type:

```typescript
let result: number;
```

### Example: String Concatenation

```typescript
let firstName: string = "Riyaz";

let lastName: string = "Khan";

let fullName = firstName + " " + lastName;
```

Inferred type:

```typescript
let fullName: string;
```

### Example: Comparison

```typescript
let age: number = 25;

let isAdult = age >= 18;
```

Inferred type:

```typescript
let isAdult: boolean;
```

### Example: Conditional Expression

```typescript
let age: number = 25;

let result = age >= 18 ? "Adult" : "Minor";
```

Inferred type:

```typescript
let result: string;
```

TypeScript can infer the resulting type based on both possible expressions.

---

# 18. Complete Practical Example

Let's combine the concepts into a small user management example.

```typescript
// User information

let username: string = "Riyaz";

let age: number = 25;

let city: string = "Ahmedabad";

let isActive: boolean = true;


// User object

let user: {
    name: string;
    age: number;
    city: string;
    isActive: boolean;
} = {
    name: username,
    age: age,
    city: city,
    isActive: isActive
};


// Function

function displayUser(
    user: {
        name: string;
        age: number;
        city: string;
        isActive: boolean;
    }
): void {

    console.log("User Name:", user.name);

    console.log("Age:", user.age);

    console.log("City:", user.city);

    console.log("Active:", user.isActive);
}


// Execute

displayUser(user);
```

Output:

```text
User Name: Riyaz
Age: 25
City: Ahmedabad
Active: true
```

This example demonstrates:

- Variable declarations.
- Type annotations.
- Object typing.
- Function parameter typing.
- Function return types.
- Type compatibility.

---

# 19. Common Beginner Mistakes

| Mistake | Problem | Correct Approach |
|---|---|---|
| Using `let` when reassignment is unnecessary | Less clear variable intent | Prefer `const` |
| Assigning incorrect values | Type mismatch | Use compatible types |
| Annotating every variable unnecessarily | Redundant code | Use type inference |
| Forgetting function parameter types | Implicit `any` under strict settings | Annotate parameters |
| Confusing `const` with immutability | Object properties can still change | Use readonly when necessary |
| Using `object` for detailed structures | Properties are not known | Define specific object types |
| Ignoring null values | Possible runtime errors | Use null checks and union types |
| Assuming inferred types never change | Type inference depends on context | Understand widening and narrowing |

---

# 20. Interview Questions and Answers

### Q1. What is the difference between let and const in TypeScript?

Both declare block-scoped variables. `let` allows reassignment, whereas `const` does not.

### Q2. What is the difference between explicit and implicit typing?

Explicit typing means the developer specifies the type. Implicit typing means TypeScript automatically infers the type.

### Q3. Does TypeScript require type annotations for every variable?

No. TypeScript supports type inference and can automatically determine types from values and context.

### Q4. Can we change the type of a variable after declaration?

Not beyond its declared type. A variable declared as `number` cannot later hold a string unless its type explicitly allows both.

### Q5. What is type widening?

Type widening occurs when TypeScript infers a broader type instead of retaining a specific literal type.

### Q6. What is contextual typing?

Contextual typing is when TypeScript determines a type based on the surrounding context.

Example:

```typescript
const numbers = [1, 2, 3];

numbers.forEach(number => {
    console.log(number.toFixed(2));
});
```

TypeScript infers that `number` is a number from the array's element type.

### Q7. Can const objects be modified?

Yes. `const` prevents reassignment of the variable, not modification of its object properties.

### Q8. What happens if we declare a variable without an initial value?

You can provide an explicit type and assign the value later.

```typescript
let age: number;

age = 25;
```

TypeScript reports an error if you read the variable before assigning it.

### Q9. What is type narrowing?

Type narrowing reduces the possible types of a variable using checks such as `typeof`, equality checks, and `instanceof`.

### Q10. What is structural typing?

Structural typing means TypeScript primarily determines type compatibility based on the structure of values rather than their declared type names.

---

# 21. Practical Exercises

Complete these exercises in your TypeScript project.

### Exercise 1: Variable Declaration

Create variables for:

- First name
- Last name
- Age
- Email
- Salary
- Is employed

Use appropriate types.

### Exercise 2: Reassignment

Create a number variable.

Assign three different numbers to it.

Then try assigning a string and observe the error.

### Exercise 3: Type Inference

Create five variables without explicit annotations.

Determine their inferred types using VS Code hover information.

### Exercise 4: Functions

Create the following functions:

1. `add()` – Accepts two numbers and returns a number.
2. `subtract()` – Accepts two numbers and returns a number.
3. `isEven()` – Accepts a number and returns a boolean.
4. `greet()` – Accepts a name and prints a greeting.
5. `getFullName()` – Accepts first and last names and returns a string.

### Exercise 5: Object Typing

Create a user object with:

```text
id
name
age
email
isActive
```

Assign appropriate types.

### Exercise 6: Array Typing

Create:

- An array of numbers.
- An array of strings.
- An array of booleans.
- An array containing strings and numbers.

### Exercise 7: Type Narrowing

Create a function that accepts either a string or a number.

If it receives a string, convert it to uppercase.

If it receives a number, format it to two decimal places.

### Exercise 8: Destructuring

Create a user object and extract its properties using object destructuring with appropriate type annotations.

### Exercise 9: Type Compatibility

Create two variables with compatible object structures and assign one to the other.

### Exercise 10: Mini Project – Employee Information System

Create a small program that:

- Stores employee information.
- Uses appropriate variable types.
- Creates an employee object.
- Creates a function to calculate annual salary.
- Creates a function to display employee details.
- Uses type annotations for parameters and return values.

---

# 22. Phase 4 Completion Checklist

| No. | Topic | Status |
|---|---|---|
| 1 | Variables in TypeScript | ☐ |
| 2 | Type annotations with let | ☐ |
| 3 | Type annotations with const | ☐ |
| 4 | Type annotations with var | ☐ |
| 5 | Type inference with variables | ☐ |
| 6 | Explicit vs implicit typing | ☐ |
| 7 | Function parameter annotations | ☐ |
| 8 | Function return annotations | ☐ |
| 9 | Arrow function annotations | ☐ |
| 10 | Object annotations | ☐ |
| 11 | Array annotations | ☐ |
| 12 | Type narrowing basics | ☐ |
| 13 | Reassigning typed variables | ☐ |
| 14 | Type compatibility | ☐ |
| 15 | Object destructuring | ☐ |
| 16 | Array destructuring | ☐ |
| 17 | Default parameters | ☐ |
| 18 | Type annotations with expressions | ☐ |

---

## Next Phase: Phase 5 – Arrays and Tuples

In Phase 5, we will explore arrays and tuples in TypeScript in detail.

Topics:

1. Declaring typed arrays.
2. Array type syntax.
3. Generic array syntax.
4. Readonly arrays.
5. Multidimensional arrays.
6. Mixed-type arrays.
7. Tuples.
8. Optional tuple elements.
9. Named tuple elements.
10. Readonly tuples.
11. Tuple vs Array.
12. Practical use cases.

**Phase 4 complete.**

Pay special attention to the difference between `const` and readonly. They are not the same concept.

When ready, say **`OK, Phase 5`**.