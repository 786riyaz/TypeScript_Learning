# Phase 35: Advanced TypeScript – Testing, Debugging, Error Handling, and Code Quality

**Level:** Advanced to Expert  
**Prerequisites:** TypeScript fundamentals, Node.js, modules, generics, asynchronous programming, compiler configuration, and basic software testing concepts.

---

# 1. Learning Objectives

By the end of this phase, you will understand:

1. Software Testing Fundamentals.
2. Unit Testing.
3. Integration Testing.
4. End-to-End (E2E) Testing.
5. Test-Driven Development (TDD).
6. Jest and Vitest.
7. Testing TypeScript Functions.
8. Testing Asynchronous Functions.
9. Mocking and Spying.
10. Dependency Injection for Testing.
11. Testing API Endpoints.
12. Testing Databases.
13. TypeScript Debugging.
14. Source Maps in Debugging.
15. Error Handling Strategies.
16. Custom Error Classes.
17. Error Propagation.
18. Logging Strategies.
19. ESLint.
20. Prettier.
21. Static Analysis.
22. TypeScript Code Quality.
23. Production-Ready Testing Architecture.

---

# 2. What Is Software Testing?

**Software Testing** is the process of verifying that an application behaves as expected.

When developing an application, you write code to implement features. Testing helps verify that those features work correctly under different conditions.

Consider a simple function:

```typescript
function add(a: number, b: number): number {
    return a + b;
}
```

Expected behavior:

```typescript
add(10, 20); // 30
add(5, 5);   // 10
add(0, 10);  // 10
```

Instead of manually checking these results every time, we can write automated tests.

### Why Is Testing Important?

1. Detects bugs early.
2. Prevents regressions.
3. Improves code quality.
4. Makes refactoring safer.
5. Documents expected behavior.
6. Increases application reliability.
7. Improves developer confidence.
8. Helps maintain large applications.

### What Is a Bug?

A bug is an error or defect that causes software to behave incorrectly.

Example:

```typescript
function calculateDiscount(
    price: number,
    discount: number
): number {
    return price + (price * discount) / 100;
}
```

The function is supposed to calculate a discount, but it adds the discount instead of subtracting it.

For a price of ₹1,000 and a discount of 10%, the expected result is ₹900, but the function returns ₹1,100.

Testing helps identify this problem.

---

# 3. Types of Software Testing

There are several levels and categories of software testing.

The three important testing levels are:

1. Unit Testing.
2. Integration Testing.
3. End-to-End Testing.

## 3.1 Unit Testing

Unit Testing verifies individual units of code independently.

A unit can be:

- A function.
- A method.
- A class.
- A small module.

Example:

```typescript
function calculateTotal(
    price: number,
    quantity: number
): number {
    return price * quantity;
}
```

Test:

```typescript
expect(calculateTotal(100, 2)).toBe(200);
```

Here, we test only the calculation function.

We don't need a database, API, or frontend.

### Characteristics

- Tests small pieces of code.
- Usually executes quickly.
- Often isolates dependencies.
- Helps identify exactly where a failure occurs.

## 3.2 Integration Testing

Integration Testing verifies whether multiple components work correctly together.

For example, consider a user registration flow:

```text
API Request
    |
    v
Controller
    |
    v
Service
    |
    v
Repository
    |
    v
Database
```

An integration test might verify that:

1. An API receives user data.
2. The controller calls the service.
3. The service validates the data.
4. The repository saves the user.
5. The database contains the expected record.

Unlike a unit test, this test may use a real test database.

## 3.3 End-to-End Testing

E2E Testing verifies an entire application workflow from the user's perspective.

Example: User registration.

```text
Open Website
    |
    v
Enter Name
    |
    v
Enter Email
    |
    v
Enter Password
    |
    v
Click Register
    |
    v
Backend Processes Request
    |
    v
Database Saves User
    |
    v
Success Message Appears
```

An E2E test checks whether the complete flow works.

Common tools include:

- Playwright.
- Cypress.

### Comparison

| Feature | Unit Testing | Integration Testing | E2E Testing |
|---|---|---|---|
| Scope | Individual unit | Multiple components | Complete workflow |
| Speed | Usually fastest | Medium | Usually slowest |
| Dependencies | Often mocked | Some real dependencies | Realistic application environment |
| Purpose | Verify isolated logic | Verify component interactions | Verify user workflows |
| Example | Test discount function | Test API with database | Test complete checkout |

**Important:** Unit, integration, and E2E testing complement each other. A reliable application generally needs a balanced combination.

---

# 4. What Is Test-Driven Development (TDD)?

**Test-Driven Development (TDD)** is a development approach in which you write tests before implementing the actual functionality.

It follows three main steps:

1. Red.
2. Green.
3. Refactor.

### Step 1: Red

Write a test for functionality that does not exist yet.

Example:

```typescript
describe("add", () => {
    it("should return the sum of two numbers", () => {
        expect(add(10, 20)).toBe(30);
    });
});
```

At this point, `add()` may not exist, so the test fails.

### Step 2: Green

Write the minimum implementation required to pass the test.

```typescript
function add(a: number, b: number): number {
    return a + b;
}
```

Now the test passes.

### Step 3: Refactor

Improve the implementation without changing its behavior.

For example:

- Improve naming.
- Remove duplication.
- Simplify logic.
- Improve type safety.

Run the tests again to ensure nothing has broken.

### TDD Cycle

```text
Write a failing test
        |
        v
      RED
        |
        v
Write minimum implementation
        |
        v
      GREEN
        |
        v
Refactor the code
        |
        v
    REPEAT
```

### Benefits of TDD

- Encourages testable architecture.
- Helps identify requirements.
- Prevents unnecessary implementation.
- Improves regression protection.
- Encourages small development steps.

---

# 5. What Is a Testing Framework?

A testing framework provides tools to write, execute, organize, and report automated tests.

Examples:

| Framework | Purpose |
|---|---|
| Jest | JavaScript and TypeScript testing |
| Vitest | Modern testing framework commonly used with Vite |
| Mocha | JavaScript testing framework |
| Jasmine | Testing framework with built-in assertions |
| Playwright | Browser automation and E2E testing |
| Cypress | Browser-based E2E and component testing |

For this phase, we will mainly use **Vitest** and **Jest**.

---

# 6. Setting Up Vitest with TypeScript

Vitest is a modern testing framework that integrates well with TypeScript projects.

It is especially convenient for projects using Vite.

### Step 1: Create a Project

```bash
mkdir typescript-testing
cd typescript-testing

npm init -y
```

### Step 2: Install Dependencies

```bash
npm install -D typescript vitest
```

### Step 3: Create Project Structure

```text
typescript-testing/
│
├── src/
│   └── calculator.ts
│
├── tests/
│   └── calculator.test.ts
│
├── package.json
└── tsconfig.json
```

### Step 4: Create a TypeScript File

`src/calculator.ts`

```typescript
export function add(a: number, b: number): number {
    return a + b;
}

export function subtract(a: number, b: number): number {
    return a - b;
}

export function multiply(a: number, b: number): number {
    return a * b;
}
```

### Step 5: Create a Test File

`tests/calculator.test.ts`

```typescript
import { describe, it, expect } from "vitest";

import {
    add,
    subtract,
    multiply
} from "../src/calculator";

describe("Calculator", () => {
    it("should add two numbers", () => {
        expect(add(10, 20)).toBe(30);
    });

    it("should subtract two numbers", () => {
        expect(subtract(20, 10)).toBe(10);
    });

    it("should multiply two numbers", () => {
        expect(multiply(10, 5)).toBe(50);
    });
});
```

### Step 6: Configure package.json

```json
{
    "scripts": {
        "test": "vitest",
        "test:run": "vitest run"
    }
}
```

### Step 7: Run Tests

```bash
npm test
```

Run tests once without watch mode:

```bash
npm run test:run
```

### Understanding describe(), it(), and expect()

| Function | Purpose |
|---|---|
| `describe()` | Groups related tests |
| `it()` | Defines an individual test |
| `test()` | Alternative to `it()` |
| `expect()` | Creates an assertion |
| `toBe()` | Checks strict equality |
| `toEqual()` | Checks deep equality |

### Example

```typescript
expect(10 + 20).toBe(30);

expect({ name: "Riyaz" }).toEqual({
    name: "Riyaz"
});
```

`toBe()` is generally used for primitive values and reference identity.

`toEqual()` checks the structure and values of objects and arrays.

---

# 7. Writing Different Types of Assertions

An assertion verifies that a result matches an expected condition.

Vitest and Jest provide many assertion methods.

### 7.1 toBe()

Checks strict equality.

```typescript
expect(10).toBe(10);

expect("Hello").toBe("Hello");
```

### 7.2 toEqual()

Checks deep equality.

```typescript
const user = {
    id: 1,
    name: "Riyaz"
};

expect(user).toEqual({
    id: 1,
    name: "Riyaz"
});
```

### 7.3 toBeTruthy()

Checks whether a value is truthy.

```typescript
expect(true).toBeTruthy();

expect("Hello").toBeTruthy();
```

### 7.4 toBeFalsy()

```typescript
expect(false).toBeFalsy();

expect(0).toBeFalsy();
```

### 7.5 toContain()

```typescript
const users = ["Riyaz", "Ahmed", "Ali"];

expect(users).toContain("Riyaz");
```

### 7.6 toHaveLength()

```typescript
const users = ["Riyaz", "Ahmed"];

expect(users).toHaveLength(2);
```

### 7.7 toBeGreaterThan()

```typescript
expect(100).toBeGreaterThan(50);
```

### 7.8 toThrow()

Checks whether a function throws an error.

```typescript
function divide(a: number, b: number): number {
    if (b === 0) {
        throw new Error("Division by zero");
    }

    return a / b;
}

expect(() => divide(10, 0)).toThrow(
    "Division by zero"
);
```

### Common Assertions

| Assertion | Purpose |
|---|---|
| `toBe()` | Strict equality |
| `toEqual()` | Deep equality |
| `toStrictEqual()` | Strict deep equality |
| `toBeTruthy()` | Checks truthy value |
| `toBeFalsy()` | Checks falsy value |
| `toBeNull()` | Checks null |
| `toBeUndefined()` | Checks undefined |
| `toContain()` | Checks array or string contents |
| `toHaveLength()` | Checks length |
| `toThrow()` | Checks thrown errors |
| `toBeGreaterThan()` | Checks greater-than condition |
| `toMatch()` | Checks string or regular expression matching |

---

# 8. Testing TypeScript Functions

Let's create a practical business logic example.

Suppose we are building an expense tracker.

We need to calculate the total expense.

### Implementation

`src/expense.ts`

```typescript
export type Expense = {
    id: number;
    title: string;
    amount: number;
};

export function calculateTotal(
    expenses: Expense[]
): number {
    return expenses.reduce(
        (total, expense) => total + expense.amount,
        0
    );
}
```

### Test

`tests/expense.test.ts`

```typescript
import { describe, it, expect } from "vitest";

import {
    calculateTotal,
    type Expense
} from "../src/expense";

describe("calculateTotal", () => {
    it("should calculate total expenses", () => {
        const expenses: Expense[] = [
            {
                id: 1,
                title: "Food",
                amount: 500
            },
            {
                id: 2,
                title: "Travel",
                amount: 300
            },
            {
                id: 3,
                title: "Shopping",
                amount: 200
            }
        ];

        expect(calculateTotal(expenses)).toBe(1000);
    });

    it("should return zero for empty expenses", () => {
        expect(calculateTotal([])).toBe(0);
    });
});
```

### What Are We Testing?

1. Normal input.
2. Multiple records.
3. Empty array.
4. Expected output.

A good test suite should cover both normal and edge cases.

---

# 9. Testing Edge Cases

An edge case is an input or situation that occurs at the boundary of expected behavior.

Consider:

```typescript
function calculateDiscount(
    price: number,
    discount: number
): number {
    return price - (price * discount) / 100;
}
```

What happens if:

- Price is zero?
- Discount is zero?
- Discount is 100?
- Discount is negative?
- Discount is greater than 100?
- Price is negative?

We should define the expected business rules.

### Improved Implementation

```typescript
export function calculateDiscount(
    price: number,
    discount: number
): number {
    if (price < 0) {
        throw new Error("Price cannot be negative");
    }

    if (discount < 0 || discount > 100) {
        throw new Error("Invalid discount percentage");
    }

    return price - (price * discount) / 100;
}
```

### Tests

```typescript
import { describe, it, expect } from "vitest";

import { calculateDiscount } from "../src/discount";

describe("calculateDiscount", () => {
    it("should calculate a 10% discount", () => {
        expect(calculateDiscount(1000, 10)).toBe(900);
    });

    it("should return the original price for zero discount", () => {
        expect(calculateDiscount(1000, 0)).toBe(1000);
    });

    it("should return zero for 100% discount", () => {
        expect(calculateDiscount(1000, 100)).toBe(0);
    });

    it("should reject negative prices", () => {
        expect(() => calculateDiscount(-100, 10))
            .toThrow("Price cannot be negative");
    });

    it("should reject invalid discounts", () => {
        expect(() => calculateDiscount(1000, 150))
            .toThrow("Invalid discount percentage");
    });
});
```

**Important:** Test cases should represent the actual business requirements, not arbitrary assumptions.

---

# 10. Testing Asynchronous Functions

In JavaScript and TypeScript, many functions return Promises.

Examples:

- API requests.
- Database operations.
- File operations.
- Authentication.
- Background tasks.

Testing these functions requires waiting for their asynchronous operations to complete.

### Example Function

```typescript
export async function getUserName(): Promise<string> {
    return "Riyaz";
}
```

### Test Using async/await

```typescript
import { describe, it, expect } from "vitest";

import { getUserName } from "../src/user";

describe("getUserName", () => {
    it("should return the username", async () => {
        const result = await getUserName();

        expect(result).toBe("Riyaz");
    });
});
```

### Testing Promise Resolution

```typescript
it("should resolve with a username", async () => {
    await expect(getUserName()).resolves.toBe("Riyaz");
});
```

### Testing Promise Rejection

Implementation:

```typescript
export async function getUser(id: number) {
    if (id <= 0) {
        throw new Error("Invalid user ID");
    }

    return {
        id,
        name: "Riyaz"
    };
}
```

Test:

```typescript
it("should reject invalid user IDs", async () => {
    await expect(getUser(0))
        .rejects.toThrow("Invalid user ID");
});
```

### Important

Always make sure asynchronous operations are awaited or returned from the test.

Otherwise, a test may finish before the assertion executes.

---

# 11. What Is Mocking?

**Mocking** means replacing a real dependency with a controlled test implementation.

Suppose a function depends on an external payment service.

You do not want every unit test to make a real payment request.

Instead, you replace the payment service with a mock.

### Example

Original implementation:

```typescript
export async function processPayment(
    amount: number
): Promise<string> {
    const response = await fetch("/api/payment", {
        method: "POST",
        body: JSON.stringify({ amount })
    });

    const data = await response.json();

    return data.transactionId;
}
```

Testing this function directly would require control over the network request.

A cleaner design is to inject the dependency.

### Improved Design

```typescript
type PaymentGateway = {
    charge(amount: number): Promise<string>;
};

export async function processPayment(
    amount: number,
    paymentGateway: PaymentGateway
): Promise<string> {
    return paymentGateway.charge(amount);
}
```

Now we can supply a fake implementation.

### Test

```typescript
import { describe, it, expect, vi } from "vitest";

import { processPayment } from "../src/payment";

describe("processPayment", () => {
    it("should process a payment", async () => {
        const paymentGateway = {
            charge: vi.fn().mockResolvedValue("TXN123")
        };

        const result = await processPayment(
            1000,
            paymentGateway
        );

        expect(result).toBe("TXN123");

        expect(paymentGateway.charge)
            .toHaveBeenCalledWith(1000);
    });
});
```

Here:

- `vi.fn()` creates a mock function.
- `mockResolvedValue()` configures its resolved value.
- `toHaveBeenCalledWith()` checks the arguments.

---

# 12. Mocking vs Stubbing vs Spying

These terms are related but have different purposes.

### Mocking

A mock replaces a dependency with a controlled test double.

### Stubbing

A stub provides predefined responses.

### Spying

A spy observes function calls without necessarily replacing the original implementation.

### Example: Spy

```typescript
import { describe, it, expect, vi } from "vitest";

describe("spy example", () => {
    it("should track function calls", () => {
        const user = {
            greet(name: string) {
                return `Hello ${name}`;
            }
        };

        const spy = vi.spyOn(user, "greet");

        const result = user.greet("Riyaz");

        expect(result).toBe("Hello Riyaz");

        expect(spy).toHaveBeenCalledWith("Riyaz");
    });
});
```

### Comparison

| Technique | Purpose |
|---|---|
| Mock | Replaces dependency behavior and tracks calls |
| Stub | Provides predefined responses |
| Spy | Observes calls to a function |
| Fake | Provides a working but simplified implementation |

### Example of a Fake Repository

```typescript
type User = {
    id: number;
    name: string;
};

interface UserRepository {
    findById(id: number): Promise<User | null>;
}

class InMemoryUserRepository implements UserRepository {
    private users: User[] = [
        {
            id: 1,
            name: "Riyaz"
        }
    ];

    async findById(id: number): Promise<User | null> {
        return this.users.find(user => user.id === id) ?? null;
    }
}
```

This is a fake repository because it provides simplified working behavior without using a real database.

---

# 13. Dependency Injection for Testing

**Dependency Injection (DI)** means providing dependencies to a component instead of making the component create them internally.

This makes code easier to test.

### Without Dependency Injection

```typescript
class UserService {
    async getUser(id: number) {
        const repository = new UserRepository();

        return repository.findById(id);
    }
}
```

The service creates its own repository.

Testing becomes more difficult because the dependency is tightly coupled.

### With Dependency Injection

```typescript
interface UserRepository {
    findById(id: number): Promise<User | null>;
}

class UserService {
    constructor(
        private repository: UserRepository
    ) {}

    async getUser(id: number) {
        return this.repository.findById(id);
    }
}
```

Now we can inject different implementations.

### Test Implementation

```typescript
const fakeRepository: UserRepository = {
    async findById(id) {
        if (id === 1) {
            return {
                id: 1,
                name: "Riyaz"
            };
        }

        return null;
    }
};

const service = new UserService(fakeRepository);
```

Test:

```typescript
const user = await service.getUser(1);

console.log(user);
```

### Benefits

- Loose coupling.
- Easier unit testing.
- Easier mocking.
- Better separation of concerns.
- Easier replacement of implementations.

---

# 14. Testing API Endpoints

Backend applications frequently expose REST APIs.

We can test API endpoints using tools such as:

- Vitest.
- Jest.
- Supertest.

For an Express application, Supertest can make HTTP requests to the application without requiring a separate external server process.

### Step 1: Install Dependencies

```bash
npm install express
npm install -D vitest supertest @types/supertest @types/express @types/node
```

### Step 2: Create Express Application

`src/app.ts`

```typescript
import express from "express";

const app = express();

app.use(express.json());

app.get("/users", (req, res) => {
    res.json([
        {
            id: 1,
            name: "Riyaz"
        },
        {
            id: 2,
            name: "Ahmed"
        }
    ]);
});

app.get("/users/:id", (req, res) => {
    const id = Number(req.params.id);

    if (id !== 1) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json({
        id: 1,
        name: "Riyaz"
    });
});

export default app;
```

### Step 3: Create Server Entry Point

`src/server.ts`

```typescript
import app from "./app";

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

### Step 4: Write API Tests

`tests/app.test.ts`

```typescript
import { describe, it, expect } from "vitest";

import request from "supertest";

import app from "../src/app";

describe("User API", () => {
    it("should return all users", async () => {
        const response = await request(app)
            .get("/users");

        expect(response.status).toBe(200);

        expect(response.body).toHaveLength(2);
    });

    it("should return a user", async () => {
        const response = await request(app)
            .get("/users/1");

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            id: 1,
            name: "Riyaz"
        });
    });

    it("should return 404 for missing users", async () => {
        const response = await request(app)
            .get("/users/2");

        expect(response.status).toBe(404);
    });
});
```

### Important

Exporting the Express app separately from the server startup makes it easier to test.

The tests can import the app without opening a permanent listening port.

---

# 15. Testing Databases

Database integration tests verify that application code interacts correctly with a database.

For example, a user repository may perform:

- Insert.
- Find.
- Update.
- Delete.

### Example Repository

```typescript
type User = {
    id: number;
    name: string;
};

interface UserRepository {
    create(user: User): Promise<User>;
    findById(id: number): Promise<User | null>;
}
```

An actual repository may use Sequelize, Prisma, Mongoose, or raw SQL.

### What Should Be Tested?

1. Can a user be inserted?
2. Can the user be retrieved?
3. Does a missing user return `null`?
4. Are unique constraints respected?
5. Are invalid values rejected?
6. Are database transactions handled correctly?

### Database Testing Strategies

| Strategy | Description |
|---|---|
| Mock Repository | Replace database operations with mocks |
| In-Memory Database | Use an in-memory implementation |
| Test Database | Use a separate real database |
| Containerized Database | Run a disposable database using containers |

### Important Best Practices

- Never run integration tests against production databases.
- Use isolated test data.
- Clean up test records.
- Avoid tests depending on execution order.
- Use transactions where appropriate.
- Ensure parallel tests do not conflict.

For MongoDB projects, a temporary test database or an in-memory MongoDB setup may be useful.

For MySQL projects, use a dedicated test database or disposable database instance.

---

# 16. Testing React Components with TypeScript

Testing is not limited to backend applications.

You can also test React components.

A common tool combination is:

- Vitest.
- React Testing Library.
- `@testing-library/jest-dom`.

### Example Component

`src/components/Greeting.tsx`

```tsx
type GreetingProps = {
    name: string;
};

export function Greeting({ name }: GreetingProps) {
    return <h1>Hello {name}</h1>;
}
```

### Install Dependencies

```bash
npm install -D vitest jsdom \
    @testing-library/react \
    @testing-library/jest-dom
```

### Example Test

```tsx
import { describe, it, expect } from "vitest";

import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom/vitest";

import { Greeting } from "../src/components/Greeting";

describe("Greeting", () => {
    it("should display the user's name", () => {
        render(<Greeting name="Riyaz" />);

        expect(
            screen.getByText("Hello Riyaz")
        ).toBeInTheDocument();
    });
});
```

### What Are We Testing?

We verify that:

1. The component renders.
2. The expected text appears.
3. The component receives and uses its props correctly.

### Important

React component tests should generally focus on observable behavior rather than implementation details.

For complete browser workflows, Playwright or Cypress is more appropriate.

---

# 17. What Is TypeScript Debugging?

Debugging is the process of identifying and fixing problems in a program.

A debugger allows you to inspect the program while it is executing.

You can:

- Set breakpoints.
- Inspect variables.
- Step through code.
- Inspect the call stack.
- Evaluate expressions.
- Find the source of errors.

### Example

```typescript
function calculateTotal(
    price: number,
    quantity: number
): number {
    const total = price * quantity;

    return total;
}

const result = calculateTotal(100, 5);

console.log(result);
```

Suppose you want to inspect how `total` is calculated.

You can place a breakpoint on:

```typescript
const total = price * quantity;
```

Then execute the application in debug mode.

---

# 18. Debugging TypeScript in Visual Studio Code

Visual Studio Code provides built-in debugging support for JavaScript and Node.js.

### Step 1: Open Your Project

Open the TypeScript project in VS Code.

### Step 2: Create a Breakpoint

Click on the left side of a code line.

A red dot appears.

### Step 3: Open the Run and Debug Panel

Use:

```text
Ctrl + Shift + D
```

### Step 4: Configure Debugging

For a compiled Node.js application, a configuration may look like:

`.vscode/launch.json`

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Debug Application",
            "program": "${workspaceFolder}/dist/server.js",
            "preLaunchTask": "npm: build",
            "outFiles": [
                "${workspaceFolder}/dist/**/*.js"
            ]
        }
    ]
}
```

This example assumes:

- Your TypeScript compiler generates JavaScript into `dist`.
- Your application entry point is `dist/server.js`.
- Your build script compiles the project.

### Step 5: Start Debugging

Press:

```text
F5
```

The debugger will:

1. Build the application if configured.
2. Start the generated JavaScript.
3. Stop at breakpoints.
4. Allow variable inspection.

---

# 19. Source Maps in Debugging

When TypeScript is compiled into JavaScript, the generated JavaScript may not have the same structure as the original TypeScript.

Source maps help debugging tools map generated JavaScript back to the original TypeScript.

### Enable Source Maps

`tsconfig.json`

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "sourceMap": true,
        "outDir": "./dist"
    }
}
```

Generated output:

```text
src/
  app.ts

dist/
  app.js
  app.js.map
```

### Why Are Source Maps Important?

Without source maps, debugging compiled JavaScript may be confusing.

With source maps, you can inspect the original TypeScript source.

This is especially helpful when:

- Debugging Node.js applications.
- Debugging frontend applications.
- Investigating production stack traces.
- Debugging transpiled code.

---

# 20. Error Handling Strategies

Error handling is an important part of production software development.

A reliable application should handle errors without crashing unnecessarily or hiding important problems.

### Types of Errors

Common categories include:

1. Syntax Errors.
2. Type Errors.
3. Runtime Errors.
4. Validation Errors.
5. Network Errors.
6. Database Errors.
7. Business Logic Errors.

### Example: Runtime Error

```typescript
const user = null;

console.log(user.name);
```

This causes a runtime error because you cannot access `name` on `null`.

### Example: Validation Error

```typescript
function validateAge(age: number): void {
    if (age < 18) {
        throw new Error("User must be at least 18");
    }
}
```

### Example: Database Error

```typescript
async function getUser(id: number) {
    return await database.users.findById(id);
}
```

The database operation may fail due to:

- Connection problems.
- Query errors.
- Timeouts.
- Database unavailability.

The application should handle these failures appropriately.

---

# 21. try...catch...finally

JavaScript provides `try`, `catch`, and `finally` for handling exceptions.

### Syntax

```typescript
try {
    // Code that may throw an error
} catch (error) {
    // Handle the error
} finally {
    // Always executes when control leaves try/catch
}
```

### Example

```typescript
function divide(a: number, b: number): number {
    if (b === 0) {
        throw new Error("Division by zero");
    }

    return a / b;
}

try {
    const result = divide(10, 0);

    console.log(result);
} catch (error) {
    console.error("Error:", error);
} finally {
    console.log("Execution completed");
}
```

### Important

The `finally` block executes when control leaves the `try`/`catch` construct, including when an error is thrown.

It is useful for cleanup operations.

For example:

- Closing connections.
- Releasing locks.
- Clearing resources.

Avoid returning from `finally` because it can override an earlier return value or suppress a thrown error.

---

# 22. Understanding unknown in Catch Blocks

In TypeScript, an error caught by `catch` should not automatically be assumed to be an `Error` instance.

Consider:

```typescript
try {
    throw new Error("Something went wrong");
} catch (error) {
    console.log(error.message);
}
```

With `useUnknownInCatchVariables` enabled, the caught value has type `unknown`.

Why?

Because JavaScript allows throwing any value:

```typescript
throw "Something went wrong";

throw 100;

throw {
    message: "Error"
};
```

Therefore, TypeScript cannot safely assume every caught value is an `Error`.

### Correct Approach

```typescript
try {
    throw new Error("Something went wrong");
} catch (error: unknown) {
    if (error instanceof Error) {
        console.error(error.message);
    } else {
        console.error("Unknown error:", error);
    }
}
```

### Create a Reusable Error Message Function

```typescript
function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    return String(error);
}
```

Usage:

```typescript
try {
    throw new Error("Database connection failed");
} catch (error: unknown) {
    console.error(getErrorMessage(error));
}
```

---

# 23. Custom Error Classes

Sometimes the built-in `Error` class is not sufficient.

You may want different error types for different situations.

TypeScript supports custom error classes.

### Example 1: ValidationError

```typescript
class ValidationError extends Error {
    constructor(message: string) {
        super(message);

        this.name = "ValidationError";
    }
}
```

Usage:

```typescript
function createUser(name: string): void {
    if (!name.trim()) {
        throw new ValidationError("Name is required");
    }
}

try {
    createUser("");
} catch (error) {
    if (error instanceof ValidationError) {
        console.log(error.message);
    }
}
```

### Example 2: NotFoundError

```typescript
class NotFoundError extends Error {
    constructor(message: string) {
        super(message);

        this.name = "NotFoundError";
    }
}
```

### Example 3: DatabaseError

```typescript
class DatabaseError extends Error {
    constructor(
        message: string,
        public readonly originalError?: unknown
    ) {
        super(message);

        this.name = "DatabaseError";
    }
}
```

### Why Use Custom Error Classes?

They allow you to:

- Categorize errors.
- Handle errors differently.
- Add metadata.
- Improve logging.
- Map internal errors to appropriate HTTP responses.

### Example: Error Hierarchy

```text
Error
  |
  ├── ValidationError
  |
  ├── NotFoundError
  |
  ├── DatabaseError
  |
  └── AuthenticationError
```

---

# 24. Error Propagation

Error Propagation means allowing an error to travel through function calls until a suitable layer handles it.

Consider:

```typescript
async function getUserFromDatabase(id: number) {
    return await database.users.findById(id);
}

async function getUser(id: number) {
    return await getUserFromDatabase(id);
}

async function handleRequest(id: number) {
    try {
        const user = await getUser(id);

        return user;
    } catch (error) {
        console.error(error);

        throw error;
    }
}
```

The database error propagates through the functions.

The request handler catches it.

### Important Principle

Handle an error where you have enough context to make a meaningful decision.

Do not catch every error simply to log it and throw it again without adding useful information or taking an appropriate action.

### Example: Add Context

```typescript
async function getUser(id: number) {
    try {
        return await database.users.findById(id);
    } catch (error) {
        throw new DatabaseError(
            `Failed to retrieve user ${id}`,
            error
        );
    }
}
```

Here, the error contains additional context.

---

# 25. Error Handling in Express with TypeScript

Express applications commonly use centralized error-handling middleware.

### Step 1: Create Custom Errors

```typescript
class AppError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number
    ) {
        super(message);

        this.name = "AppError";
    }
}
```

### Step 2: Create a Controller

```typescript
import { Request, Response, NextFunction } from "express";

export async function getUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            throw new AppError(
                "Invalid user ID",
                400
            );
        }

        const user = await database.users.findById(id);

        if (!user) {
            throw new AppError(
                "User not found",
                404
            );
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
}
```

### Step 3: Centralized Error Middleware

```typescript
import {
    Request,
    Response,
    NextFunction
} from "express";

function errorHandler(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (res.headersSent) {
        return next(error);
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    console.error(error);

    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
}
```

Register the middleware after routes:

```typescript
app.use(errorHandler);
```

### Important

In Express 5, rejected promises returned by route handlers are automatically forwarded to error-handling middleware.

In Express 4, asynchronous errors generally need to be passed to `next(error)` or handled using an async wrapper.

The example above explicitly uses `next(error)` and works as a clear error-propagation pattern.

### Production Best Practices

Never expose:

- Database credentials.
- Internal file paths.
- Stack traces.
- Secret tokens.
- Internal infrastructure details.

Return safe messages to clients and record technical details in protected logs.

---

# 26. What Is Logging?

Logging is the process of recording information about application execution.

Logs help developers understand:

- What happened.
- When it happened.
- Where it happened.
- Why it happened.
- Which request caused the problem.

### Example: Console Logging

```typescript
console.log("User created");

console.error("Database connection failed");
```

This is acceptable for simple scripts, but production applications generally need structured logging.

### Common Log Levels

| Level | Purpose |
|---|---|
| `fatal` | Critical failure requiring immediate attention |
| `error` | Application error |
| `warn` | Potential problem |
| `info` | Important application event |
| `debug` | Debugging details |
| `trace` | Very detailed execution information |

### Example Structured Log

```json
{
    "level": "error",
    "message": "Database connection failed",
    "service": "user-service",
    "timestamp": "2026-11-25T17:00:00.000Z"
}
```

Structured logs are easier to search and analyze.

---

# 27. Logging with Pino

Pino is a popular structured logging library for Node.js.

### Install

```bash
npm install pino
```

### Create Logger

`src/config/logger.ts`

```typescript
import pino from "pino";

export const logger = pino({
    level: process.env.LOG_LEVEL ?? "info"
});
```

### Use Logger

```typescript
import { logger } from "./config/logger";

logger.info("Application started");

logger.warn("Cache is almost full");

logger.error("Database connection failed");
```

### Logging with Context

```typescript
logger.info(
    {
        userId: 1,
        action: "login"
    },
    "User logged in"
);
```

### Logging Errors

```typescript
try {
    await database.connect();
} catch (error) {
    logger.error(
        {
            err: error
        },
        "Database connection failed"
    );

    throw error;
}
```

### Important Logging Practices

- Do not log passwords.
- Do not log access tokens.
- Avoid logging sensitive personal information.
- Include request IDs where useful.
- Use structured logs.
- Set appropriate log levels.
- Avoid logging the same error repeatedly at every layer.
- Configure log retention and access controls.

---

# 28. ESLint

**ESLint** is a static analysis tool that identifies potential problems and enforces code-quality rules.

It helps detect:

- Unused variables.
- Unreachable code.
- Incorrect patterns.
- Suspicious expressions.
- Style inconsistencies.
- Certain TypeScript-specific problems.

### Install ESLint

```bash
npm install -D eslint @eslint/js typescript typescript-eslint
```

### Create eslint.config.mjs

```javascript
import js from "@eslint/js";

import tseslint from "typescript-eslint";

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended
);
```

This is a basic flat configuration.

### Example Problem

```typescript
const name = "Riyaz";

function greet() {
    console.log("Hello");
}
```

The `name` variable is unused.

ESLint can identify this issue.

### Run ESLint

```bash
npx eslint .
```

### Fix Automatically

```bash
npx eslint . --fix
```

### Why Use ESLint?

- Maintains code quality.
- Detects common mistakes.
- Enforces consistent practices.
- Helps teams follow shared conventions.
- Improves maintainability.

---

# 29. TypeScript ESLint Rules

TypeScript projects benefit from additional ESLint rules that understand TypeScript syntax.

For example:

```typescript
function processValue(value: any) {
    return value;
}
```

The `any` type removes many type-safety guarantees.

A type-aware ESLint configuration can detect potentially unsafe uses of `any` and other unsafe operations.

Useful rules include:

| Rule | Purpose |
|---|---|
| `@typescript-eslint/no-explicit-any` | Discourages explicit `any` |
| `@typescript-eslint/no-unused-vars` | Detects unused variables |
| `@typescript-eslint/no-non-null-assertion` | Discourages unsafe `!` assertions |
| `@typescript-eslint/no-floating-promises` | Detects unhandled Promises |
| `@typescript-eslint/no-misused-promises` | Detects Promises used in inappropriate contexts |
| `@typescript-eslint/consistent-type-imports` | Encourages consistent type-only imports |

Some rules require type-aware linting configuration.

For example, `no-floating-promises` generally requires TypeScript type information to be enabled in ESLint.

### Example: Floating Promise

```typescript
async function saveUser() {
    // Database operation
}

saveUser();
```

The Promise is not awaited or otherwise handled.

This can cause errors to go unnoticed.

Better:

```typescript
await saveUser();
```

Or:

```typescript
saveUser().catch(error => {
    console.error(error);
});
```

---

# 30. Prettier

Prettier is a code formatter.

It automatically formats code according to a consistent style.

### Install

```bash
npm install -D prettier
```

### Example Before Formatting

```typescript
const user={name:"Riyaz",age:25,email:"riyaz@example.com"}
```

### After Formatting

```typescript
const user = {
    name: "Riyaz",
    age: 25,
    email: "riyaz@example.com"
};
```

### Create .prettierrc

```json
{
    "semi": true,
    "singleQuote": true,
    "tabWidth": 4,
    "trailingComma": "all"
}
```

### Run Prettier

```bash
npx prettier --write .
```

Check formatting without modifying files:

```bash
npx prettier --check .
```

### ESLint vs Prettier

| Feature | ESLint | Prettier |
|---|---|---|
| Purpose | Code analysis and linting | Code formatting |
| Detects suspicious code | Yes | No |
| Formats code | Limited formatting fixes | Yes |
| Checks unused variables | Yes | No |
| Enforces formatting style | Can, but not its main purpose | Yes |

**Remember:** ESLint checks code quality and potential problems. Prettier formats code.

They complement each other.

---

# 31. Static Analysis

Static Analysis means examining code without executing the application.

TypeScript's type checker and ESLint are examples of static analysis tools.

### Example

```typescript
function add(a: number, b: number): number {
    return a + b;
}

const result = add(10, "20");
```

TypeScript reports a problem without needing to run the program.

### Static vs Dynamic Analysis

| Feature | Static Analysis | Dynamic Analysis |
|---|---|---|
| Execution required | No | Yes |
| Detects type errors | Yes, through type checking | Not inherently |
| Detects runtime behavior | Limited | Yes |
| Examples | TypeScript, ESLint | Runtime tests, profiling |
| Main purpose | Analyze source code | Analyze program execution |

### Static Analysis Tools

- TypeScript Compiler.
- ESLint.
- SonarQube.
- CodeQL.
- Dependency vulnerability scanners.

Each tool serves different purposes.

---

# 32. Code Coverage

Code Coverage measures how much of your source code is executed during tests.

Vitest supports coverage reporting through coverage providers.

### Install Coverage Provider

For V8 coverage:

```bash
npm install -D @vitest/coverage-v8
```

### Run Coverage

```bash
npx vitest run --coverage
```

### Common Coverage Metrics

| Metric | Meaning |
|---|---|
| Statement Coverage | Percentage of statements executed |
| Branch Coverage | Percentage of conditional branches executed |
| Function Coverage | Percentage of functions called |
| Line Coverage | Percentage of executable lines executed |

### Example

```typescript
function calculateDiscount(
    price: number,
    discount: number
): number {
    if (discount > 0) {
        return price - (price * discount) / 100;
    }

    return price;
}
```

There are two branches:

1. Discount greater than zero.
2. Discount not greater than zero.

If tests only cover the first branch, branch coverage is incomplete.

### Important

100% code coverage does not guarantee bug-free software.

Coverage measures execution, not whether the assertions verify every important behavior.

---

# 33. Testing Architecture for Production Applications

Let's combine what we have learned into a practical backend architecture.

Suppose we are developing a user management application.

```text
src/
│
├── controllers/
│   └── user.controller.ts
│
├── services/
│   └── user.service.ts
│
├── repositories/
│   └── user.repository.ts
│
├── models/
│   └── user.model.ts
│
├── middleware/
│   └── error.middleware.ts
│
├── errors/
│   └── app-error.ts
│
├── config/
│   └── logger.ts
│
└── app.ts

tests/
│
├── unit/
│   └── user.service.test.ts
│
├── integration/
│   └── user.repository.test.ts
│
└── e2e/
    └── user.api.test.ts
```

### Testing Responsibilities

| Layer | Testing Type | What to Test |
|---|---|---|
| Controller | Unit/Integration | Request and response behavior |
| Service | Unit | Business logic |
| Repository | Integration | Database operations |
| Middleware | Unit/Integration | Error handling |
| API | Integration/E2E | Endpoint behavior |
| Complete application | E2E | Full user workflows |

### Example: User Service

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};

interface UserRepository {
    findById(id: number): Promise<User | null>;
}

export class UserService {
    constructor(
        private readonly repository: UserRepository
    ) {}

    async getUser(id: number): Promise<User> {
        if (id <= 0) {
            throw new Error("Invalid user ID");
        }

        const user = await this.repository.findById(id);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }
}
```

### Unit Test

```typescript
import { describe, it, expect, vi } from "vitest";

import { UserService } from "../../src/services/user.service";

describe("UserService", () => {
    it("should return an existing user", async () => {
        const repository = {
            findById: vi.fn().mockResolvedValue({
                id: 1,
                name: "Riyaz",
                email: "riyaz@example.com"
            })
        };

        const service = new UserService(repository);

        const user = await service.getUser(1);

        expect(user.name).toBe("Riyaz");

        expect(repository.findById)
            .toHaveBeenCalledWith(1);
    });

    it("should reject invalid IDs", async () => {
        const repository = {
            findById: vi.fn()
        };

        const service = new UserService(repository);

        await expect(service.getUser(0))
            .rejects.toThrow("Invalid user ID");

        expect(repository.findById).not.toHaveBeenCalled();
    });

    it("should reject missing users", async () => {
        const repository = {
            findById: vi.fn().mockResolvedValue(null)
        };

        const service = new UserService(repository);

        await expect(service.getUser(100))
            .rejects.toThrow("User not found");
    });
});
```

This test verifies:

- Successful execution.
- Invalid input handling.
- Missing user handling.
- Repository interaction.

---

# 34. Common Testing and Debugging Mistakes

| Mistake | Correct Approach |
|---|---|
| Testing only successful scenarios | Test success, failure, and edge cases. |
| Writing tests that depend on each other | Make tests independent. |
| Using production databases for tests | Use isolated test databases. |
| Mocking everything | Test important integrations with real dependencies where practical. |
| Ignoring rejected Promises | Await or explicitly handle asynchronous operations. |
| Testing implementation details excessively | Prefer testing observable behavior. |
| Catching all errors without handling them | Handle errors at appropriate boundaries. |
| Returning internal errors to users | Return safe messages and log technical details securely. |
| Logging sensitive information | Exclude passwords, tokens, and secrets. |
| Assuming high coverage means high quality | Verify meaningful assertions and edge cases. |
| Using ESLint as a formatter replacement | Use Prettier for formatting. |
| Ignoring source maps | Configure source maps for easier debugging. |
| Creating tightly coupled dependencies | Use dependency injection where appropriate. |
| Writing overly large test cases | Split tests into focused scenarios. |

---

# 35. Advanced Testing Interview Questions

### Q1. What is software testing?

Software testing is the process of verifying whether software behaves according to expected requirements.

### Q2. What is unit testing?

Testing an individual function, method, class, or module independently.

### Q3. What is integration testing?

Testing whether multiple components work correctly together.

### Q4. What is E2E testing?

Testing a complete application workflow from the user's perspective.

### Q5. What is TDD?

Test-Driven Development is a development approach based on writing tests before implementing functionality.

### Q6. What are the three steps of TDD?

Red, Green, and Refactor.

### Q7. What is Vitest?

Vitest is a JavaScript and TypeScript testing framework that integrates well with Vite-based projects.

### Q8. What is Jest?

Jest is a JavaScript testing framework commonly used for unit and integration testing.

### Q9. What is the difference between toBe() and toEqual()?

`toBe()` checks strict equality, while `toEqual()` checks deep equality of objects and arrays.

### Q10. What is mocking?

Mocking replaces a real dependency with a controlled test implementation.

### Q11. What is a spy?

A spy observes function calls and can track arguments, invocation counts, and results.

### Q12. What is a stub?

A stub provides predefined behavior or responses during testing.

### Q13. What is a fake?

A fake is a simplified working implementation of a dependency.

### Q14. What is dependency injection?

It is a technique in which dependencies are provided to a component instead of being created internally.

### Q15. Why is dependency injection useful for testing?

It allows dependencies to be replaced with mocks, stubs, or fake implementations.

### Q16. How do you test asynchronous functions?

Use `async/await`, returned Promises, or asynchronous assertions such as `resolves` and `rejects`.

### Q17. What is Supertest?

Supertest is a library for testing HTTP servers and application endpoints.

### Q18. What is a test database?

A separate database environment used to execute database-related tests safely.

### Q19. What is a breakpoint?

A breakpoint pauses program execution at a selected line during debugging.

### Q20. What are source maps?

They map generated JavaScript back to the original TypeScript source.

### Q21. What is error propagation?

It is the process through which an error travels through function calls until an appropriate layer handles it.

### Q22. What is a custom error class?

A class extending `Error` to represent a specific category of application error.

### Q23. Why should catch variables be treated as unknown?

JavaScript allows throwing any value, so TypeScript cannot assume a caught value is an `Error` instance.

### Q24. What is centralized error handling?

A design where errors are handled at a common application boundary rather than duplicating response logic throughout the application.

### Q25. What is structured logging?

Logging information in a consistent machine-readable format, commonly JSON.

### Q26. What is Pino?

Pino is a structured logging library for Node.js.

### Q27. What is ESLint?

ESLint is a static analysis tool that identifies potential code problems and enforces coding rules.

### Q28. What is Prettier?

Prettier is a code formatter that automatically formats source files.

### Q29. What is the difference between ESLint and Prettier?

ESLint focuses on code quality and potential problems. Prettier focuses on consistent formatting.

### Q30. What is code coverage?

It measures how much code is executed while tests run.

### Q31. What is branch coverage?

It measures how many possible branches of conditional logic have been executed.

### Q32. Does 100% code coverage guarantee bug-free software?

No. Coverage measures execution, not the correctness or completeness of assertions.

### Q33. What is static analysis?

Analyzing source code without executing the application.

### Q34. What is a regression test?

A test that verifies existing functionality still works after code changes.

### Q35. What is flaky testing?

A flaky test sometimes passes and sometimes fails without a relevant code change, often due to timing, shared state, or environmental dependencies.

---

# 36. Practical Exercises

Complete these exercises yourself.

## Beginner Level

**Exercise 1: Unit Testing**

Create a calculator with:

- Addition.
- Subtraction.
- Multiplication.
- Division.

Write unit tests for all operations.

**Exercise 2: Edge Cases**

Test:

- Division by zero.
- Negative numbers.
- Zero values.
- Decimal values.

**Exercise 3: Expense Tracker**

Create a function that calculates total expenses.

Write tests for:

- Empty expenses.
- One expense.
- Multiple expenses.
- Zero amount.
- Invalid input according to your business rules.

**Exercise 4: Async Testing**

Create an asynchronous function that returns user data.

Test:

- Successful result.
- Rejected Promise.
- Invalid user ID.

## Intermediate Level

**Exercise 5: Mocking**

Create a payment service.

Mock its payment gateway and test successful and failed transactions.

**Exercise 6: Dependency Injection**

Create a user service with an injected repository.

Test it using an in-memory fake repository.

**Exercise 7: Express API Testing**

Create endpoints for:

- `GET /users`
- `GET /users/:id`
- `POST /users`
- `DELETE /users/:id`

Write tests using Supertest.

**Exercise 8: Custom Error Classes**

Create:

- `ValidationError`.
- `NotFoundError`.
- `DatabaseError`.
- `AuthenticationError`.

Test how each error is handled.

**Exercise 9: Logging**

Configure Pino and create structured logs for:

- Application startup.
- User registration.
- Authentication failure.
- Database errors.

## Advanced Level

**Exercise 10: Database Integration Testing**

Create a repository using Sequelize or Mongoose.

Test:

- Create.
- Read.
- Update.
- Delete.

Use an isolated test database.

**Exercise 11: React Testing**

Create a registration form and test:

- Form rendering.
- Input changes.
- Validation errors.
- Successful submission.

**Exercise 12: Code Coverage**

Generate a coverage report.

Improve branch coverage by adding meaningful tests.

**Exercise 13: Debugging**

Create a Node.js TypeScript project and configure VS Code debugging with source maps.

**Exercise 14: Testing Architecture**

Create a complete testing structure for a user management application with:

- Unit tests.
- Integration tests.
- API tests.
- E2E tests.

**Exercise 15: CI Testing**

Configure a GitHub Actions workflow that:

1. Installs dependencies.
2. Runs TypeScript type checking.
3. Runs ESLint.
4. Runs tests.
5. Generates a production build.

---

# 37. Phase 35 Completion Checklist

| No. | Topic | Status |
|---:|---|---|
| 1 | Software Testing Fundamentals | ☐ |
| 2 | Unit Testing | ☐ |
| 3 | Integration Testing | ☐ |
| 4 | E2E Testing | ☐ |
| 5 | Test-Driven Development | ☐ |
| 6 | Vitest | ☐ |
| 7 | Jest | ☐ |
| 8 | Assertions | ☐ |
| 9 | Testing Edge Cases | ☐ |
| 10 | Async Testing | ☐ |
| 11 | Mocking | ☐ |
| 12 | Stubbing | ☐ |
| 13 | Spying | ☐ |
| 14 | Fake Implementations | ☐ |
| 15 | Dependency Injection for Testing | ☐ |
| 16 | API Testing | ☐ |
| 17 | Database Testing | ☐ |
| 18 | React Component Testing | ☐ |
| 19 | TypeScript Debugging | ☐ |
| 20 | Source Maps | ☐ |
| 21 | try/catch/finally | ☐ |
| 22 | unknown in Catch Blocks | ☐ |
| 23 | Custom Error Classes | ☐ |
| 24 | Error Propagation | ☐ |
| 25 | Centralized Error Handling | ☐ |
| 26 | Structured Logging | ☐ |
| 27 | Pino | ☐ |
| 28 | ESLint | ☐ |
| 29 | TypeScript ESLint Rules | ☐ |
| 30 | Prettier | ☐ |
| 31 | Static Analysis | ☐ |
| 32 | Code Coverage | ☐ |
| 33 | Production Testing Architecture | ☐ |

---

# 38. What Comes Next?

## Phase 36: TypeScript with Node.js – Advanced Backend Development

Now we will apply TypeScript to real-world backend development.

Topics will include:

1. Setting Up a Node.js TypeScript Project.
2. Node.js Runtime and TypeScript.
3. Express.js with TypeScript.
4. Controllers, Services, and Repositories.
5. Advanced Middleware.
6. Request and Response Typing.
7. Custom Request Types.
8. Authentication with TypeScript.
9. JWT Authentication.
10. Authorization and Role-Based Access Control.
11. Password Hashing.
12. Database Integration with TypeScript.
13. Sequelize with TypeScript.
14. MongoDB and Mongoose with TypeScript.
15. API Validation with Zod.
16. Centralized Error Handling.
17. File Uploads.
18. Pagination, Sorting, and Filtering.
19. API Documentation with Swagger.
20. Security Best Practices.
21. Performance Optimization.
22. Production Deployment.

**Phase 35 is complete.**

When you're ready, say **"OK, Phase 36"** to continue.