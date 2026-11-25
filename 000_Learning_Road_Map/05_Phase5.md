# Phase 5: Arrays and Tuples in TypeScript
**Level: Beginner to Intermediate**

In this phase, we will learn how to work with arrays and tuples in TypeScript.

JavaScript provides arrays for storing multiple values in a single variable. TypeScript extends this functionality by allowing us to define the types of array elements and enforce their structure.

Tuples are another important feature of TypeScript that allow us to define arrays with a fixed structure and specific types at particular positions.

## What You Will Learn

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

---

# 1. What Is an Array?

An array is a data structure that stores multiple values in a single variable.

JavaScript arrays can contain values of different types.

### JavaScript Example

```javascript
let numbers = [10, 20, 30, 40];

let names = ["Riyaz", "Ahmed", "Ali"];

let mixed = ["Riyaz", 25, true];
```

JavaScript allows all these arrays.

However, TypeScript allows us to define which types of values an array should contain.

### TypeScript Example

```typescript
let numbers: number[] = [10, 20, 30, 40];

let names: string[] = ["Riyaz", "Ahmed", "Ali"];

let statuses: boolean[] = [true, false, true];
```

Now TypeScript checks the types of array elements.

---

# 2. Declaring Typed Arrays

There are two commonly used syntaxes for declaring arrays in TypeScript.

## Method 1: Type[] Syntax

This is the most commonly used syntax.

### Syntax

```typescript
let arrayName: type[] = [];
```

### Example: Number Array

```typescript
let numbers: number[] = [10, 20, 30, 40, 50];
```

Only numbers are allowed.

```typescript
numbers.push(60); // Valid

numbers.push("70"); // Error
```

### Example: String Array

```typescript
let names: string[] = [
    "Riyaz",
    "Ahmed",
    "Ali"
];
```

Only strings are allowed.

```typescript
names.push("Rahul"); // Valid

names.push(100); // Error
```

### Example: Boolean Array

```typescript
let statuses: boolean[] = [
    true,
    false,
    true
];
```

Only boolean values are allowed.

### Example: Object Array

```typescript
let users: {
    name: string;
    age: number;
}[] = [
    {
        name: "Riyaz",
        age: 25
    },
    {
        name: "Ahmed",
        age: 28
    }
];
```

Each element must have the specified object structure.

---

## Method 2: Array<Type> Syntax

TypeScript also supports generic array syntax.

### Syntax

```typescript
let arrayName: Array<type> = [];
```

### Examples

```typescript
let numbers: Array<number> = [10, 20, 30];

let names: Array<string> = ["Riyaz", "Ahmed"];

let statuses: Array<boolean> = [true, false];
```

Both syntaxes are valid.

### Comparison

| Syntax | Example |
|---|---|
| `Type[]` | `let numbers: number[] = [10, 20]` |
| `Array<Type>` | `let numbers: Array<number> = [10, 20]` |

**Best Practice:** Use `Type[]` for ordinary arrays. Generic array syntax is also useful when working with complex generic types.

---

# 3. Type Inference with Arrays

You do not always need to specify array types manually.

TypeScript can infer the element types from the initial values.

### Example

```typescript
let numbers = [10, 20, 30, 40];
```

Inferred type:

```typescript
let numbers: number[];
```

Similarly:

```typescript
let names = ["Riyaz", "Ahmed", "Ali"];
```

Inferred type:

```typescript
let names: string[];
```

### Mixed Values

```typescript
let values = [10, "Riyaz", 20, "Ahmed"];
```

TypeScript infers approximately:

```typescript
let values: (string | number)[];
```

This means each array element can be either a string or a number.

### Important

TypeScript's inference depends on the context.

For example:

```typescript
let values = [];
```

Depending on the compiler settings and how the array is used, TypeScript may infer an evolving array type or an implicit `any[]` type.

For predictable behavior, explicitly annotate empty arrays:

```typescript
let numbers: number[] = [];
```

---

# 4. Accessing Array Elements

Array elements are accessed using their indexes.

JavaScript arrays use zero-based indexing.

### Example

```typescript
let names: string[] = [
    "Riyaz",
    "Ahmed",
    "Ali"
];

console.log(names[0]);

console.log(names[1]);

console.log(names[2]);
```

Output:

```text
Riyaz
Ahmed
Ali
```

### Accessing Invalid Indexes

```typescript
let names: string[] = ["Riyaz", "Ahmed"];

console.log(names[10]);
```

By default, TypeScript generally allows this and considers the result a string.

However, with the compiler option:

```json
{
    "compilerOptions": {
        "noUncheckedIndexedAccess": true
    }
}
```

The resulting type becomes:

```typescript
string | undefined
```

This is safer because an array index might not exist.

Example:

```typescript
let username = names[10];

if (username !== undefined) {
    console.log(username.toUpperCase());
}
```

---

# 5. Modifying Arrays

TypeScript supports standard JavaScript array methods.

Because the array has a defined element type, TypeScript checks the values passed to these methods.

### push()

Adds elements to the end.

```typescript
let numbers: number[] = [10, 20, 30];

numbers.push(40);

console.log(numbers);
```

Output:

```text
[10, 20, 30, 40]
```

### pop()

Removes the last element.

```typescript
let numbers: number[] = [10, 20, 30];

numbers.pop();

console.log(numbers);
```

Output:

```text
[10, 20]
```

### unshift()

Adds elements to the beginning.

```typescript
let numbers: number[] = [20, 30];

numbers.unshift(10);

console.log(numbers);
```

Output:

```text
[10, 20, 30]
```

### shift()

Removes the first element.

```typescript
let numbers: number[] = [10, 20, 30];

numbers.shift();

console.log(numbers);
```

Output:

```text
[20, 30]
```

### splice()

Removes or inserts elements.

```typescript
let numbers: number[] = [10, 20, 30, 40];

numbers.splice(1, 2);

console.log(numbers);
```

Output:

```text
[10, 40]
```

### slice()

Returns a portion of an array without modifying the original.

```typescript
let numbers: number[] = [10, 20, 30, 40];

let result = numbers.slice(1, 3);

console.log(result);
```

Output:

```text
[20, 30]
```

### Important

TypeScript does not change how JavaScript array methods work.

It adds compile-time type checking to their usage.

---

# 6. Iterating Over Typed Arrays

TypeScript supports all standard JavaScript iteration techniques.

### Traditional for Loop

```typescript
let numbers: number[] = [10, 20, 30];

for (let i = 0; i < numbers.length; i++) {
    console.log(numbers[i]);
}
```

### for...of

```typescript
let names: string[] = ["Riyaz", "Ahmed", "Ali"];

for (const name of names) {
    console.log(name);
}
```

Here, TypeScript infers that `name` is a string.

### forEach()

```typescript
let numbers: number[] = [10, 20, 30];

numbers.forEach((number) => {
    console.log(number);
});
```

The callback parameter `number` is automatically inferred as a number.

### map()

```typescript
let numbers: number[] = [10, 20, 30];

let doubled = numbers.map((number) => {
    return number * 2;
});
```

Inferred type:

```typescript
let doubled: number[];
```

### filter()

```typescript
let numbers: number[] = [10, 15, 20, 25, 30];

let evenNumbers = numbers.filter((number) => {
    return number % 2 === 0;
});
```

Inferred type:

```typescript
let evenNumbers: number[];
```

---

# 7. Readonly Arrays

A readonly array is an array whose elements cannot be modified through that readonly reference.

TypeScript provides two ways to declare readonly arrays.

## Method 1: readonly Type[]

```typescript
let numbers: readonly number[] = [10, 20, 30];
```

Reading values is allowed:

```typescript
console.log(numbers[0]);
```

But modifying the array is not allowed:

```typescript
numbers.push(40); // Error

numbers.pop(); // Error

numbers[0] = 100; // Error
```

## Method 2: ReadonlyArray<Type>

```typescript
let names: ReadonlyArray<string> = [
    "Riyaz",
    "Ahmed",
    "Ali"
];
```

This is also valid.

### Readonly Array vs Normal Array

| Feature | Normal Array | Readonly Array |
|---|---|---|
| Read elements | Yes | Yes |
| Modify elements | Yes | No |
| push() | Allowed | Not allowed |
| pop() | Allowed | Not allowed |
| Delete elements | Allowed | Not allowed |
| TypeScript restriction | Mutable | Readonly through that reference |

### Important: Readonly Is Compile-Time Protection

Consider:

```typescript
const numbers: readonly number[] = [10, 20, 30];
```

TypeScript prevents modifications through `numbers`.

However, readonly types do not automatically freeze the underlying JavaScript array at runtime.

JavaScript's `Object.freeze()` provides runtime protection against modifying the frozen array's own elements, although it is shallow.

---

# 8. Multidimensional Arrays

A multidimensional array is an array that contains other arrays.

For example:

- Two-dimensional arrays.
- Three-dimensional arrays.

## 8.1 Two-Dimensional Arrays

A two-dimensional array represents rows and columns.

### Syntax

```typescript
let arrayName: type[][] = [];
```

### Example

```typescript
let matrix: number[][] = [
    [10, 20],
    [30, 40],
    [50, 60]
];
```

Structure:

```text
[
    [10, 20],
    [30, 40],
    [50, 60]
]
```

### Accessing Elements

```typescript
console.log(matrix[0][0]);

console.log(matrix[0][1]);

console.log(matrix[1][0]);

console.log(matrix[2][1]);
```

Output:

```text
10
20
30
60
```

### Iterating

```typescript
let matrix: number[][] = [
    [10, 20],
    [30, 40],
    [50, 60]
];

for (let i = 0; i < matrix.length; i++) {

    for (let j = 0; j < matrix[i].length; j++) {

        console.log(matrix[i][j]);

    }

}
```

## 8.2 Three-Dimensional Arrays

A three-dimensional array contains arrays of two-dimensional arrays.

### Example

```typescript
let data: number[][][] = [
    [
        [1, 2],
        [3, 4]
    ],
    [
        [5, 6],
        [7, 8]
    ]
];
```

Accessing values:

```typescript
console.log(data[0][0][0]);

console.log(data[1][1][1]);
```

Output:

```text
1
8
```

### Practical Use Cases

Multidimensional arrays are useful for:

- Matrices.
- Game boards.
- Image pixel data.
- Tables.
- Grid-based applications.
- Scientific calculations.

---

# 9. Mixed-Type Arrays

Sometimes an array needs to contain multiple types of values.

For example:

```typescript
let values = [
    "Riyaz",
    25,
    true
];
```

TypeScript can infer a union of the element types.

However, we can explicitly define the allowed types.

### Example

```typescript
let values: (string | number | boolean)[] = [
    "Riyaz",
    25,
    true
];
```

Now each element can be:

- A string.
- A number.
- A boolean.

### Adding Values

```typescript
values.push("Ahmed");

values.push(30);

values.push(false);
```

All valid.

But:

```typescript
values.push(null); // Error
```

### Important Difference

Consider these two declarations:

```typescript
let first: (string | number)[] = ["Riyaz", 25];
```

And:

```typescript
let second: [string, number] = ["Riyaz", 25];
```

The first is an array that can contain strings and numbers in any order.

The second is a tuple that specifies a string followed by a number.

This brings us to the next important topic.

---

# 10. What Are Tuples?

A tuple is a special array type that allows us to specify the type of each element at a particular position.

Unlike a normal array, a tuple describes an ordered structure.

### Example

```typescript
let user: [string, number] = ["Riyaz", 25];
```

Here:

- First element must be a string.
- Second element must be a number.

### Valid Example

```typescript
let user: [string, number] = ["Riyaz", 25];
```

### Invalid Example

```typescript
let user: [string, number] = [25, "Riyaz"];
```

Error because the positions have incorrect types.

### Another Invalid Example

```typescript
let user: [string, number] = ["Riyaz"];
```

Error because the second required element is missing.

### Another Invalid Example

```typescript
let user: [string, number] = ["Riyaz", 25, true];
```

Error because the tuple expects exactly two elements in its declared structure.

### Syntax

```typescript
let tupleName: [type1, type2, type3] = [
    value1,
    value2,
    value3
];
```

---

# 11. Array vs Tuple

This is an important interview topic.

### Array Example

```typescript
let user: (string | number)[] = [
    "Riyaz",
    25
];

user.push(30);

user.push("Ahmed");

user.push(100);
```

All these operations are valid because each element can be a string or number.

### Tuple Example

```typescript
let user: [string, number] = [
    "Riyaz",
    25
];
```

The intended structure is:

```text
Index 0 → string
Index 1 → number
```

### Comparison

| Feature | Array | Tuple |
|---|---|---|
| Element types | Usually one or more allowed types | Can specify a type per position |
| Order | Elements can generally appear in any order | Positions have specific types |
| Length | Generally dynamic | Fixed in its declared structure |
| Access | Index-based | Index-based |
| Use case | Collections of similar data | Fixed structured data |

### Important Tuple Limitation

Tuples are not completely fixed-length at runtime.

Consider:

```typescript
let user: [string, number] = ["Riyaz", 25];

user.push("Ahmed");
```

Surprisingly, TypeScript generally allows this operation.

The tuple's declared structure remains `[string, number]`, but `push()` can extend the underlying array.

Therefore, ordinary tuples provide positional type checking, but they are not guaranteed to have an immutable length.

For stricter compile-time protection, use a readonly tuple.

---

# 12. Optional Tuple Elements

Sometimes a tuple may contain optional elements.

We can use `?` to mark an element as optional.

### Example

```typescript
let user: [string, number?] = ["Riyaz"];
```

Here:

- First element is required.
- Second element is optional.

Both are valid:

```typescript
let first: [string, number?] = ["Riyaz"];

let second: [string, number?] = ["Riyaz", 25];
```

### Invalid Example

```typescript
let user: [string, number?] = [25];
```

The first element must still be a string.

### Multiple Optional Elements

```typescript
let employee: [
    string,
    number?,
    boolean?
] = ["Riyaz"];
```

All these are valid:

```typescript
let employee1: [string, number?, boolean?] = ["Riyaz"];

let employee2: [string, number?, boolean?] = ["Riyaz", 25];

let employee3: [string, number?, boolean?] = ["Riyaz", 25, true];
```

### Important Rule

Optional tuple elements must follow required tuple elements.

You cannot place a required element after an optional element in an ordinary tuple declaration.

---

# 13. Named Tuple Elements

Named tuples allow us to assign meaningful names to tuple positions.

They improve code readability.

### Without Named Elements

```typescript
let user: [string, number, boolean] = [
    "Riyaz",
    25,
    true
];
```

We know the types but not what each position represents.

### With Named Elements

```typescript
let user: [
    name: string,
    age: number,
    isActive: boolean
] = [
    "Riyaz",
    25,
    true
];
```

Now the tuple is more readable.

### Another Example

```typescript
let product: [
    productName: string,
    price: number,
    quantity: number
] = [
    "Laptop",
    75000,
    2
];
```

Named tuple elements do not change runtime behavior.

They only improve type information and readability.

---

# 14. Readonly Tuples

Readonly tuples prevent modifications through the readonly reference.

### Example

```typescript
let user: readonly [string, number] = [
    "Riyaz",
    25
];
```

Reading is allowed:

```typescript
console.log(user[0]);

console.log(user[1]);
```

Modifying is not allowed:

```typescript
user[0] = "Ahmed"; // Error

user.push(30); // Error

user.pop(); // Error
```

### Alternative Syntax

You can also use `as const`.

```typescript
const user = ["Riyaz", 25] as const;
```

Inferred type:

```typescript
readonly ["Riyaz", 25]
```

This creates a readonly tuple with literal element types.

### Readonly Tuple vs Normal Tuple

| Feature | Normal Tuple | Readonly Tuple |
|---|---|---|
| Read elements | Yes | Yes |
| Modify elements | Yes | No |
| push() | Generally allowed | Not allowed |
| pop() | Generally allowed | Not allowed |
| Element types | Position-specific | Position-specific |
| Length protection | Not guaranteed | Mutation blocked through the readonly reference |

---

# 15. Rest Elements in Tuples

Tuples also support rest elements.

A rest element allows a tuple to contain a variable number of elements of a specified type.

### Example

```typescript
let user: [string, ...number[]] = [
    "Riyaz",
    25,
    100,
    200,
    300
];
```

Here:

- The first element must be a string.
- All remaining elements must be numbers.

### Another Example

```typescript
let values: [number, ...string[]] = [
    100,
    "Riyaz",
    "Ahmed",
    "Ali"
];
```

### Rest Elements at the Beginning

```typescript
let values: [...string[], number] = [
    "Riyaz",
    "Ahmed",
    100
];
```

Here:

- Zero or more strings can appear first.
- The final element must be a number.

### Practical Use Case

```typescript
type LogArguments = [
    message: string,
    ...details: unknown[]
];

function logMessage(...args: LogArguments): void {
    console.log(args);
}

logMessage("User created", 101, true);
```

This is useful when defining flexible function argument structures.

---

# 16. Tuples with Functions

Tuples are particularly useful when a function needs to return multiple values with specific types.

### Example

```typescript
function getUser(): [string, number] {
    return ["Riyaz", 25];
}

const user = getUser();

console.log(user[0]);

console.log(user[1]);
```

Output:

```text
Riyaz
25
```

### Destructuring Tuple Values

```typescript
function getUser(): [string, number, boolean] {
    return ["Riyaz", 25, true];
}

const [name, age, isActive] = getUser();

console.log(name);

console.log(age);

console.log(isActive);
```

TypeScript infers:

```typescript
name: string
age: number
isActive: boolean
```

### Another Example: Function Result

```typescript
function calculate(
    a: number,
    b: number
): [number, number, number] {

    return [
        a + b,
        a - b,
        a * b
    ];

}

const [addition, subtraction, multiplication] = calculate(10, 5);

console.log(addition);
console.log(subtraction);
console.log(multiplication);
```

Output:

```text
15
5
50
```

---

# 17. Tuples with Rest Parameters

Rest parameters can use tuple types to define the arguments accepted by a function.

### Example

```typescript
function createUser(
    ...user: [string, number, boolean]
): void {

    console.log("Name:", user[0]);

    console.log("Age:", user[1]);

    console.log("Active:", user[2]);

}

createUser("Riyaz", 25, true);
```

TypeScript enforces the order and types of the arguments.

### Invalid Call

```typescript
createUser(25, "Riyaz", true);
```

This produces a type error.

---

# 18. Type Inference with Tuples

An important difference exists between arrays and tuples.

Consider:

```typescript
const user = ["Riyaz", 25];
```

TypeScript generally infers:

```typescript
(string | number)[]
```

It does not automatically infer a fixed tuple in this case.

### Using Explicit Tuple Annotation

```typescript
const user: [string, number] = ["Riyaz", 25];
```

Now the type is a tuple.

### Using as const

```typescript
const user = ["Riyaz", 25] as const;
```

Inferred type:

```typescript
readonly ["Riyaz", 25]
```

### Comparison

| Declaration | Inferred Type |
|---|---|
| `let a = [10, 20]` | `number[]` |
| `const a = [10, 20]` | `number[]` |
| `let a: [number, number] = [10, 20]` | `[number, number]` |
| `const a = [10, 20] as const` | `readonly [10, 20]` |

**Important:** `const` alone does not make an array a readonly tuple. You need an explicit tuple annotation or `as const`.

---

# 19. Advanced Array and Tuple Type Patterns

Let's understand some useful patterns.

## 19.1 Array of Tuples

An array can contain multiple tuples.

Example:

```typescript
let users: [string, number][] = [
    ["Riyaz", 25],
    ["Ahmed", 28],
    ["Ali", 30]
];
```

Each element must be a tuple containing:

- A string.
- A number.

This is useful for storing structured records.

## 19.2 Tuple of Arrays

A tuple can also contain arrays.

```typescript
let data: [string[], number[]] = [
    ["Riyaz", "Ahmed", "Ali"],
    [25, 28, 30]
];
```

Here:

- First position contains a string array.
- Second position contains a number array.

## 19.3 Nested Tuples

```typescript
let data: [
    [string, number],
    [string, number]
] = [
    ["Riyaz", 25],
    ["Ahmed", 28]
];
```

This creates a tuple containing two other tuples.

## 19.4 Generic Arrays

You can also use generic types.

```typescript
let numbers: Array<number> = [10, 20, 30];
```

Generic types will be covered in detail in Phase 16.

---

# 20. Real-World Examples

Let's understand where arrays and tuples are used in actual applications.

### Example 1: Product List

```typescript
type Product = {
    id: number;
    name: string;
    price: number;
};

const products: Product[] = [
    {
        id: 1,
        name: "Laptop",
        price: 75000
    },
    {
        id: 2,
        name: "Mobile",
        price: 25000
    }
];
```

This is an example of an array of objects.

### Example 2: API Coordinates

```typescript
type Coordinates = [number, number];

const location: Coordinates = [23.0225, 72.5714];
```

The tuple represents:

- Latitude.
- Longitude.

### Example 3: Database Query Result

```typescript
type UserRecord = [number, string, string];

const user: UserRecord = [
    101,
    "Riyaz",
    "riyaz@example.com"
];
```

This could represent:

- User ID.
- User name.
- User email.

### Example 4: Key-Value Data

```typescript
type UserEntry = [string, number];

const userScores: UserEntry[] = [
    ["Riyaz", 90],
    ["Ahmed", 85],
    ["Ali", 95]
];
```

### Example 5: API Response

```typescript
type ApiResponse = [
    statusCode: number,
    message: string,
    success: boolean
];

const response: ApiResponse = [
    200,
    "User fetched successfully",
    true
];
```

---

# 21. Common Beginner Mistakes

| Mistake | Problem | Correct Approach |
|---|---|---|
| Using `any[]` everywhere | Removes array type safety | Define specific element types |
| Confusing arrays and tuples | They have different structures | Use tuples for position-specific data |
| Assuming `const` makes arrays immutable | Array elements can still change | Use readonly arrays |
| Assuming tuples are always fixed-length | `push()` can extend mutable tuples | Use readonly tuples when appropriate |
| Forgetting parentheses in union arrays | Can cause incorrect interpretation | Use `(string \| number)[]` |
| Ignoring undefined array indexes | Access may return undefined | Use `noUncheckedIndexedAccess` |
| Assuming `as const` is runtime freezing | It only provides compile-time readonly types | Use `Object.freeze()` when runtime freezing is needed |
| Incorrect tuple order | Type mismatch | Match each position's declared type |

---

# 22. Interview Questions and Answers

### Q1. What is an array in TypeScript?

An array is a data structure that stores multiple values. TypeScript allows developers to specify the types of array elements.

### Q2. How do you declare an array of numbers?

```typescript
let numbers: number[] = [10, 20, 30];
```

Or:

```typescript
let numbers: Array<number> = [10, 20, 30];
```

### Q3. What is the difference between `number[]` and `Array<number>`?

Both represent arrays containing numbers. They are different syntaxes for the same basic array type.

### Q4. What is a readonly array?

A readonly array prevents modifications through its readonly reference.

### Q5. What is a multidimensional array?

An array containing other arrays. It is commonly used to represent matrices, grids, and tables.

### Q6. What is a tuple?

A tuple is an array type that defines the expected type of each element at a particular position.

### Q7. What is the difference between an array and a tuple?

An array generally allows a variable number of elements of specified element types, whereas a tuple defines a specific positional structure.

### Q8. What are optional tuple elements?

Optional tuple elements are elements that may or may not be present. They are declared using `?`.

### Q9. What are named tuples?

Named tuples assign descriptive names to tuple positions to improve readability.

### Q10. What is a readonly tuple?

A readonly tuple prevents modifications through its readonly reference.

### Q11. What is `as const`?

`as const` is a const assertion that preserves literal types and makes object properties and array/tuple elements readonly at the type level.

### Q12. Can tuples contain rest elements?

Yes. Tuples support rest elements using the `...` syntax.

### Q13. Can an array contain multiple types?

Yes. Union types allow arrays to contain multiple specified types.

Example:

```typescript
let values: (string | number)[] = ["Riyaz", 25];
```

### Q14. Can a tuple be extended using push()?

A mutable tuple can generally be extended using `push()`, although the tuple's declared positional type does not change. A readonly tuple cannot be modified this way.

---

# 23. Practical Exercises

Complete these exercises in your TypeScript project.

## Exercise 1: Number Array

Create an array containing 10 numbers.

Perform:

- push()
- pop()
- shift()
- unshift()
- splice()
- slice()

Observe how each method modifies or returns array values.

## Exercise 2: String Array

Create an array of five names.

Perform:

- Convert all names to uppercase.
- Filter names longer than five characters.
- Find a particular name.
- Sort the array.
- Reverse the array.

## Exercise 3: Mixed Array

Create an array that accepts:

- Strings.
- Numbers.
- Booleans.

Try inserting an object and observe the error.

## Exercise 4: Readonly Array

Create a readonly array of numbers.

Try:

- Reading an element.
- Changing an element.
- Adding an element.
- Removing an element.

Identify which operations are allowed.

## Exercise 5: Two-Dimensional Array

Create a 3 × 3 matrix.

Example:

```text
1 2 3
4 5 6
7 8 9
```

Calculate the sum of all elements.

## Exercise 6: Basic Tuple

Create a tuple containing:

- Employee name.
- Employee ID.
- Employee salary.

Assign the correct types.

## Exercise 7: Optional Tuple

Create a tuple containing:

- Product name.
- Price.
- Optional discount.

Test it with and without the discount.

## Exercise 8: Named Tuple

Create a tuple representing a student:

- name
- age
- grade
- isPassed

Use named tuple elements.

## Exercise 9: Readonly Tuple

Create a readonly tuple containing:

- Latitude.
- Longitude.

Try modifying its values.

## Exercise 10: Array of Tuples

Create an array of student records.

Each record should contain:

- Student name.
- Roll number.
- Marks.

Store at least five students.

## Exercise 11: Function Returning Tuple

Create a function called `calculate()`.

It should accept two numbers and return:

- Addition.
- Subtraction.
- Multiplication.
- Division.

Use a tuple as the return type.

## Exercise 12: Mini Project – Student Management System

Create a small student management program.

Requirements:

1. Store multiple student records.
2. Each student should have an ID, name, age, and marks.
3. Use an array of objects.
4. Create a function to add students.
5. Create a function to display all students.
6. Create a function to calculate average marks.
7. Create a readonly array for a fixed list of subjects.
8. Use a tuple to store student name and marks.

---

# 24. Phase 5 Completion Checklist

| No. | Topic | Status |
|---|---|---|
| 1 | What are arrays? | ☐ |
| 2 | Typed arrays | ☐ |
| 3 | Type[] syntax | ☐ |
| 4 | Array<Type> syntax | ☐ |
| 5 | Array type inference | ☐ |
| 6 | Accessing array elements | ☐ |
| 7 | Array modification methods | ☐ |
| 8 | Array iteration | ☐ |
| 9 | Readonly arrays | ☐ |
| 10 | Multidimensional arrays | ☐ |
| 11 | Mixed-type arrays | ☐ |
| 12 | What are tuples? | ☐ |
| 13 | Array vs Tuple | ☐ |
| 14 | Optional tuple elements | ☐ |
| 15 | Named tuple elements | ☐ |
| 16 | Readonly tuples | ☐ |
| 17 | Rest elements in tuples | ☐ |
| 18 | Tuples with functions | ☐ |
| 19 | Type inference with tuples | ☐ |
| 20 | Advanced array and tuple patterns | ☐ |

---

## Next Phase: Phase 6 – Objects and Object Types

In Phase 6, we will study objects in TypeScript in much greater depth.

Topics:

1. Object type annotations.
2. Defining object structures.
3. Optional properties.
4. Readonly properties.
5. Nested objects.
6. Object type inference.
7. Excess property checking.
8. Index signatures.
9. Object type compatibility.
10. Object destructuring with types.
11. Object methods and typing.

**Phase 5 complete.**

Pay special attention to these three concepts:

- `number[]` vs `[number, number]`
- `readonly number[]` vs `const number[]`
- Normal tuple vs readonly tuple

These distinctions are important for writing type-safe applications.

When ready, say **`OK, Phase 6`**.