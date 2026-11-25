# Phase 42: Advanced TypeScript – Testing, Debugging, Error Handling and Code Quality

**Level:** Advanced to Expert  
**Prerequisites:** TypeScript fundamentals, OOP, Generics, Modules, Node.js, Express.js, React basics and package management.

---

# 1. Learning Objectives

In this phase, you will learn how to build reliable TypeScript applications by understanding:

1. Testing fundamentals.
2. Unit testing.
3. Integration testing.
4. End-to-end testing.
5. Jest with TypeScript.
6. Vitest with TypeScript.
7. Testing classes and interfaces.
8. Mocking, stubbing and spying.
9. Dependency injection for testing.
10. Testing asynchronous code.
11. Testing API endpoints.
12. Supertest with Express.
13. Testing React components.
14. Playwright with TypeScript.
15. Debugging TypeScript applications.
16. Node.js debugging.
17. VS Code debugging.
18. Source maps.
19. Error handling strategies.
20. Custom error classes.
21. Error types and discriminated unions.
22. Global error handling.
23. Logging and monitoring.
24. ESLint with TypeScript.
25. Prettier.
26. Static analysis.
27. Test coverage.
28. CI/CD testing workflows.
29. Real-world testing project.

By the end of this phase, you should be able to write, test, debug and maintain production-quality TypeScript applications.

---

# PART 1: TESTING FUNDAMENTALS

## 2. What Is Software Testing?

Software testing is the process of verifying that an application behaves as expected.

Suppose you have developed an e-commerce application.

It contains:

- User registration.
- Login.
- Product listing.
- Shopping cart.
- Order creation.
- Payment processing.

You need to verify that all these features work correctly.

For example:

```typescript
function calculateTotal(price: number, quantity: number): number {
    return price * quantity;
}

console.log(calculateTotal(100, 3));
```

Expected output:

```text
300
```

But what happens when:

- Price is negative?
- Quantity is zero?
- Quantity is negative?
- Price is extremely large?

Testing helps identify these problems before users encounter them.

### Why Is Testing Important?

| Benefit | Explanation |
|---|---|
| Bug Detection | Identifies problems before production. |
| Reliability | Makes applications more dependable. |
| Maintainability | Helps developers modify existing code safely. |
| Refactoring | Ensures changes do not break existing functionality. |
| Documentation | Tests demonstrate expected behavior. |
| Regression Prevention | Prevents previously fixed bugs from returning. |

---

## 3. Types of Software Testing

There are three major testing categories you should understand.

### 3.1 Unit Testing

Unit testing verifies a small, isolated piece of code.

Usually, this means testing:

- Functions.
- Methods.
- Classes.
- Individual business logic.

Example:

```typescript
function add(a: number, b: number): number {
    return a + b;
}
```

Unit test:

```typescript
import { describe, it, expect } from "vitest";

describe("add function", () => {
    it("should return the sum of two numbers", () => {
        expect(add(10, 20)).toBe(30);
    });
});
```

The test verifies only the `add()` function.

It does not require a database, API or browser.

### 3.2 Integration Testing

Integration testing verifies whether multiple components work correctly together.

For example:

```text
API Route
    |
Controller
    |
Service
    |
Repository
    |
Database
```

An integration test might verify that:

1. An API receives a request.
2. The controller processes it.
3. The service executes business logic.
4. The repository retrieves data.
5. The API returns the correct response.

Integration testing focuses on interactions between components.

### 3.3 End-to-End Testing (E2E)

E2E testing verifies an application from the user's perspective.

Example:

```text
Open Browser
    |
Visit Website
    |
Enter Login Credentials
    |
Click Login
    |
Dashboard Opens
    |
Verify Dashboard Content
```

It tests the complete workflow.

### Comparison

| Feature | Unit Testing | Integration Testing | E2E Testing |
|---|---|---|---|
| Scope | Individual unit | Multiple components | Complete workflow |
| Speed | Very fast | Medium | Usually slower |
| Database | Usually mocked/faked | Often real test DB | Usually test environment |
| Browser | No | Usually no | Yes, for web apps |
| Complexity | Low | Medium | High |
| Main Purpose | Test isolated logic | Test component interactions | Test user journeys |

### 3.4 The Testing Pyramid

The testing pyramid is a model for organizing automated tests.

```text
             /\
            /  \
           / E2E\
          /------\
         /        \
        /Integration\
       /--------------\
      /                \
     /   Unit Tests     \
    /____________________\
```

A common strategy is:

- Many unit tests.
- A smaller number of integration tests.
- A relatively small number of E2E tests.

Why?

Unit tests are fast and inexpensive. E2E tests cover realistic workflows but usually require more setup and execution time.

**Important:** The pyramid is a guideline, not a mandatory ratio. The appropriate test distribution depends on the application.

---

## 4. Important Testing Terminology

### 4.1 Test Case

A test case describes a particular scenario that should be tested.

Example:

```text
Function: calculateTotal()

Test Case 1:
Input: price = 100, quantity = 2
Expected: 200

Test Case 2:
Input: price = 100, quantity = 0
Expected: 0
```

### 4.2 Assertion

An assertion checks whether the actual result matches the expected result.

```typescript
expect(10 + 20).toBe(30);
```

Here:

- Actual result: `30`
- Expected result: `30`

The assertion passes.

### 4.3 Test Suite

A test suite is a collection of related test cases.

```typescript
describe("Math Operations", () => {

    it("should add numbers", () => {
        expect(10 + 20).toBe(30);
    });

    it("should subtract numbers", () => {
        expect(20 - 10).toBe(10);
    });

});
```

### 4.4 Test Fixture

A test fixture is predefined data or setup required by tests.

```typescript
const user = {
    id: 1,
    name: "John",
    email: "john@example.com"
};
```

You can reuse this fixture across multiple tests.

### 4.5 Test Isolation

Each test should ideally run independently.

One test should not depend on another test's execution order or side effects.

### 4.6 Deterministic Tests

A deterministic test produces the same result when executed under the same conditions.

Avoid uncontrolled dependencies such as:

- Real external APIs.
- Uncontrolled system time.
- Random values without fixed seeds.
- Shared mutable test data.

---

# PART 2: JEST WITH TYPESCRIPT

## 5. What Is Jest?

Jest is a JavaScript testing framework commonly used for testing:

- JavaScript applications.
- TypeScript applications.
- Node.js applications.
- React applications.

It provides:

- Test execution.
- Assertions.
- Mocking.
- Spying.
- Code coverage.
- Test lifecycle hooks.

Official website: [Jest Documentation](https://jestjs.io/docs/getting-started?utm_source=chatgpt.com)

---

## 6. Setting Up Jest with TypeScript

Create a Node.js project:

```bash
mkdir typescript-testing
cd typescript-testing

npm init -y
```

Install dependencies:

```bash
npm install -D typescript jest ts-jest @types/jest
```

Initialize TypeScript:

```bash
npx tsc --init
```

Initialize Jest configuration:

```bash
npx ts-jest config:init
```

This generates a Jest configuration file.

A typical configuration looks like:

```typescript
import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/*.test.ts"]
};

export default config;
```

**Note:** Jest's configuration depends on whether your project uses CommonJS or native ESM. The example above is a basic setup, not a universal configuration for every module system.

### 6.1 Project Structure

```text
typescript-testing/
│
├── src/
│   └── calculator.ts
│
├── tests/
│   └── calculator.test.ts
│
├── jest.config.ts
├── tsconfig.json
└── package.json
```

### 6.2 Create a Function

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

export function divide(a: number, b: number): number {

    if (b === 0) {
        throw new Error("Cannot divide by zero");
    }

    return a / b;
}
```

### 6.3 Write Your First Test

`tests/calculator.test.ts`

```typescript
import { describe, it, expect } from "@jest/globals";

import {
    add,
    subtract,
    multiply,
    divide
} from "../src/calculator";

describe("Calculator Functions", () => {

    it("should add two numbers", () => {
        expect(add(10, 20)).toBe(30);
    });

    it("should subtract two numbers", () => {
        expect(subtract(20, 10)).toBe(10);
    });

    it("should multiply two numbers", () => {
        expect(multiply(10, 5)).toBe(50);
    });

    it("should divide two numbers", () => {
        expect(divide(20, 5)).toBe(4);
    });

    it("should throw an error when dividing by zero", () => {
        expect(() => divide(10, 0))
            .toThrow("Cannot divide by zero");
    });

});
```

### 6.4 Understanding Jest Functions

| Function | Purpose |
|---|---|
| `describe()` | Groups related tests. |
| `it()` | Defines an individual test. |
| `test()` | Alternative to `it()`. |
| `expect()` | Creates an assertion. |
| `beforeEach()` | Runs before every test. |
| `afterEach()` | Runs after every test. |
| `beforeAll()` | Runs once before the test suite. |
| `afterAll()` | Runs once after the test suite. |

### 6.5 Common Jest Matchers

```typescript
expect(10).toBe(10);

expect("Hello").toBe("Hello");

expect(true).toBeTruthy();

expect(false).toBeFalsy();

expect(null).toBeNull();

expect(undefined).toBeUndefined();

expect([1, 2, 3]).toContain(2);

expect([1, 2]).toEqual([1, 2]);

expect({ name: "John" })
    .toEqual({ name: "John" });

expect(100).toBeGreaterThan(50);

expect(50).toBeLessThan(100);
```

Important distinction:

```typescript
const obj1 = { name: "John" };
const obj2 = { name: "John" };

expect(obj1).toBe(obj2);    // Fails
expect(obj1).toEqual(obj2); // Passes
```

`toBe()` checks equality using `Object.is()`.

`toEqual()` checks whether values have equivalent structure.

---

## 7. Jest Lifecycle Hooks

Lifecycle hooks allow you to execute setup and cleanup operations.

Example:

```typescript
describe("User Service", () => {

    let users: string[];

    beforeEach(() => {
        users = [];
    });

    afterEach(() => {
        users = [];
    });

    it("should add a user", () => {

        users.push("John");

        expect(users).toContain("John");

    });

    it("should start with an empty array", () => {

        expect(users).toEqual([]);

    });

});
```

### Difference Between Lifecycle Hooks

| Hook | Execution |
|---|---|
| `beforeAll()` | Once before all tests in the relevant scope |
| `afterAll()` | Once after all tests in the relevant scope |
| `beforeEach()` | Before every test |
| `afterEach()` | After every test |

Use these hooks for:

- Database setup.
- Database cleanup.
- Creating test objects.
- Starting test servers.
- Closing connections.

---

## 8. Running Jest Tests

Add scripts to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage:

```bash
npm run test:coverage
```

### Important: Jest Does Not Type-Check Your Entire Project

Jest can transform TypeScript for execution, but this does not replace TypeScript type checking.

Run both:

```bash
npx tsc --noEmit
npm test
```

---

# PART 3: VITEST WITH TYPESCRIPT

## 9. What Is Vitest?

Vitest is a testing framework designed to work closely with the Vite ecosystem.

It supports:

- TypeScript.
- JavaScript.
- React.
- Vue.
- Node.js.
- Mocking.
- Assertions.
- Coverage.
- Watch mode.

Official documentation: [Vitest Documentation](https://vitest.dev/guide/?utm_source=chatgpt.com)

### Jest vs Vitest

| Feature | Jest | Vitest |
|---|---|---|
| TypeScript | Requires appropriate transform/setup | Supported through Vite pipeline |
| Vite integration | Separate configuration | Native integration |
| Mocking | `jest.fn()` | `vi.fn()` |
| Spying | `jest.spyOn()` | `vi.spyOn()` |
| Watch mode | Yes | Yes |
| Coverage | Yes | Yes |
| React testing | Supported | Supported |
| Best fit | Broad JavaScript ecosystem | Vite-based projects |

Vitest is often convenient for modern Vite applications. Jest remains widely used, particularly in established projects.

---

## 10. Setting Up Vitest

Install dependencies:

```bash
npm install -D vitest
```

Create `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        globals: false
    }
});
```

Update `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

Create a function:

`src/math.ts`

```typescript
export function add(a: number, b: number): number {
    return a + b;
}
```

Create a test:

`src/math.test.ts`

```typescript
import { describe, it, expect } from "vitest";

import { add } from "./math";

describe("Math Operations", () => {

    it("should add two numbers", () => {

        const result = add(10, 20);

        expect(result).toBe(30);

    });

});
```

Run:

```bash
npm run test:run
```

### Important Vitest Functions

| Jest | Vitest |
|---|---|
| `jest.fn()` | `vi.fn()` |
| `jest.spyOn()` | `vi.spyOn()` |
| `jest.mock()` | `vi.mock()` |
| `jest.clearAllMocks()` | `vi.clearAllMocks()` |
| `jest.resetAllMocks()` | `vi.resetAllMocks()` |

The concepts are similar, but their configurations and APIs are not identical in every situation.

---

# PART 4: TESTING FUNCTIONS, CLASSES AND INTERFACES

## 11. Testing Pure Functions

A pure function:

1. Produces the same output for the same input.
2. Does not modify external state.
3. Does not produce unintended side effects.

Example:

```typescript
export function calculateDiscount(
    price: number,
    discount: number
): number {

    return price - (price * discount / 100);

}
```

Test:

```typescript
import { describe, it, expect } from "vitest";

import { calculateDiscount } from "./discount";

describe("Discount Calculation", () => {

    it("should calculate a 10% discount", () => {

        expect(calculateDiscount(1000, 10))
            .toBe(900);

    });

    it("should calculate a 50% discount", () => {

        expect(calculateDiscount(1000, 50))
            .toBe(500);

    });

});
```

### Test Edge Cases

You should also test:

```typescript
calculateDiscount(1000, 0);
calculateDiscount(1000, 100);
calculateDiscount(0, 10);
```

Also consider invalid inputs, depending on your business requirements.

---

## 12. Testing TypeScript Classes

Consider a `BankAccount` class.

```typescript
export class BankAccount {

    private balance: number;

    constructor(initialBalance: number) {
        this.balance = initialBalance;
    }

    deposit(amount: number): void {

        if (amount <= 0) {
            throw new Error("Invalid deposit amount");
        }

        this.balance += amount;
    }

    withdraw(amount: number): void {

        if (amount <= 0) {
            throw new Error("Invalid withdrawal amount");
        }

        if (amount > this.balance) {
            throw new Error("Insufficient balance");
        }

        this.balance -= amount;
    }

    getBalance(): number {
        return this.balance;
    }

}
```

Test:

```typescript
import { describe, it, expect } from "vitest";

import { BankAccount } from "./BankAccount";

describe("BankAccount", () => {

    it("should initialize with the given balance", () => {

        const account = new BankAccount(1000);

        expect(account.getBalance()).toBe(1000);

    });

    it("should deposit money", () => {

        const account = new BankAccount(1000);

        account.deposit(500);

        expect(account.getBalance()).toBe(1500);

    });

    it("should withdraw money", () => {

        const account = new BankAccount(1000);

        account.withdraw(300);

        expect(account.getBalance()).toBe(700);

    });

    it("should prevent withdrawal beyond balance", () => {

        const account = new BankAccount(1000);

        expect(() => account.withdraw(1500))
            .toThrow("Insufficient balance");

    });

});
```

### What Should You Test in Classes?

- Constructor behavior.
- Public methods.
- Return values.
- State changes.
- Error conditions.
- Boundary conditions.

Avoid directly testing private implementation details. Test observable behavior through the public API.

---

## 13. Testing Interfaces

This is an important TypeScript concept.

Consider:

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}
```

Can you directly create an object using the interface?

```typescript
const user = new User();
```

No.

Why?

Because TypeScript interfaces are removed during compilation.

They do not exist as JavaScript runtime constructors.

Instead, create an object that satisfies the interface:

```typescript
const user: User = {
    id: 1,
    name: "John",
    email: "john@example.com"
};
```

You can test this object:

```typescript
import { it, expect } from "vitest";

it("should create a valid user", () => {

    const user: User = {
        id: 1,
        name: "John",
        email: "john@example.com"
    };

    expect(user.name).toBe("John");
    expect(user.email).toBe("john@example.com");

});
```

### Important Concept

You cannot directly test an interface because it is a compile-time construct.

Instead, test:

- Objects implementing interfaces.
- Classes implementing interfaces.
- Functions accepting interface types.
- Runtime behavior of concrete implementations.

---

# PART 5: MOCKING, STUBBING AND SPYING

## 14. What Is Mocking?

Mocking means replacing a real dependency with a controlled test implementation.

Suppose your application uses an external payment service.

```typescript
class PaymentService {

    async charge(amount: number): Promise<boolean> {

        // Real payment gateway integration

        return true;
    }

}
```

You don't want every unit test to make a real payment.

Instead, you can replace the payment dependency with a mock.

### Why Mocking Is Important

- Avoids external API calls.
- Makes tests faster.
- Prevents unnecessary database operations.
- Controls error scenarios.
- Makes tests predictable.

---

## 15. Mock vs Stub vs Spy vs Fake

These terms are related but have different meanings.

| Type | Meaning |
|---|---|
| Mock | Test double with predefined behavior and often interaction expectations |
| Stub | Returns predefined responses |
| Spy | Records how a function or method was called |
| Fake | Working simplified implementation used instead of a real dependency |

### 15.1 Mock Example

Using Vitest:

```typescript
import { vi, it, expect } from "vitest";

it("should call payment gateway", async () => {

    const paymentGateway = {
        charge: vi.fn().mockResolvedValue(true)
    };

    const result = await paymentGateway.charge(1000);

    expect(result).toBe(true);

    expect(paymentGateway.charge)
        .toHaveBeenCalledWith(1000);

});
```

### 15.2 Stub Example

```typescript
const userRepository = {
    findById: async (id: number) => {
        return {
            id,
            name: "John"
        };
    }
};
```

This is a simple stub implementation.

It returns predefined data.

### 15.3 Spy Example

```typescript
import { vi, it, expect } from "vitest";

it("should track function calls", () => {

    const logger = {
        log(message: string) {
            console.log(message);
        }
    };

    const spy = vi.spyOn(logger, "log");

    logger.log("Hello");

    expect(spy).toHaveBeenCalledWith("Hello");

});
```

A spy observes the method call.

### 15.4 Fake Example

Suppose you have a database repository interface:

```typescript
interface UserRepository {
    findById(id: number): Promise<User | null>;
}
```

A fake implementation:

```typescript
class FakeUserRepository implements UserRepository {

    private users: User[] = [
        {
            id: 1,
            name: "John",
            email: "john@example.com"
        }
    ];

    async findById(id: number): Promise<User | null> {

        return this.users.find(user => user.id === id) ?? null;

    }

}
```

This fake repository behaves like a simplified database.

---

# PART 6: DEPENDENCY INJECTION FOR TESTING

## 16. What Is Dependency Injection?

Dependency Injection (DI) is a design technique in which a class receives its dependencies from outside rather than creating them internally.

Consider this tightly coupled implementation:

```typescript
class UserService {

    private repository = new UserRepository();

}
```

Problem:

`UserService` directly creates its repository.

Replacing the repository during testing becomes difficult.

### Better Approach: Constructor Injection

First, define an interface:

```typescript
interface UserRepository {
    findById(id: number): Promise<User | null>;
}
```

Create the service:

```typescript
class UserService {

    constructor(
        private repository: UserRepository
    ) {}

    async getUser(id: number): Promise<User | null> {

        return this.repository.findById(id);

    }

}
```

Now create the actual repository:

```typescript
class MySQLUserRepository implements UserRepository {

    async findById(id: number): Promise<User | null> {

        // Actual MySQL query

        return {
            id,
            name: "John",
            email: "john@example.com"
        };

    }

}
```

Inject it:

```typescript
const repository = new MySQLUserRepository();

const userService = new UserService(repository);
```

### 16.1 Testing with a Fake Dependency

```typescript
import { it, expect } from "vitest";

class FakeUserRepository implements UserRepository {

    async findById(id: number): Promise<User | null> {

        if (id === 1) {
            return {
                id: 1,
                name: "John",
                email: "john@example.com"
            };
        }

        return null;
    }

}

it("should return user details", async () => {

    const repository = new FakeUserRepository();

    const service = new UserService(repository);

    const user = await service.getUser(1);

    expect(user?.name).toBe("John");

});
```

### Benefits of Dependency Injection

- Loose coupling.
- Easier testing.
- Better maintainability.
- Easier dependency replacement.
- Improved separation of concerns.

**Important:** TypeScript interfaces do not exist at runtime. If a DI container needs runtime tokens, use class constructors, symbols, strings or another runtime token mechanism.

---

# PART 7: TESTING ASYNCHRONOUS CODE

## 17. Testing Promises

In Node.js applications, asynchronous operations are extremely common.

Examples:

- Database queries.
- HTTP requests.
- File operations.
- Authentication.
- Payment processing.

Consider:

```typescript
export function getUser(): Promise<string> {

    return Promise.resolve("John");

}
```

Test:

```typescript
import { it, expect } from "vitest";

it("should return user name", async () => {

    const result = await getUser();

    expect(result).toBe("John");

});
```

### 17.1 Testing Promise Resolution

```typescript
it("should resolve successfully", async () => {

    await expect(getUser())
        .resolves.toBe("John");

});
```

### 17.2 Testing Promise Rejection

```typescript
function getUser(): Promise<string> {

    return Promise.reject(
        new Error("User not found")
    );

}
```

Test:

```typescript
it("should reject when user is missing", async () => {

    await expect(getUser())
        .rejects.toThrow("User not found");

});
```

**Important:** Always `await` or return asynchronous assertions. Otherwise, a test may finish before the assertion completes.

---

## 18. Testing Async Functions with Mocking

Consider:

```typescript
interface UserRepository {
    findById(id: number): Promise<User | null>;
}

class UserService {

    constructor(
        private repository: UserRepository
    ) {}

    async getUser(id: number): Promise<User> {

        const user = await this.repository.findById(id);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

}
```

Test:

```typescript
import { vi, it, expect } from "vitest";

it("should return user when found", async () => {

    const repository: UserRepository = {
        findById: vi.fn().mockResolvedValue({
            id: 1,
            name: "John",
            email: "john@example.com"
        })
    };

    const service = new UserService(repository);

    const user = await service.getUser(1);

    expect(user.name).toBe("John");

});

it("should throw when user does not exist", async () => {

    const repository: UserRepository = {
        findById: vi.fn().mockResolvedValue(null)
    };

    const service = new UserService(repository);

    await expect(service.getUser(10))
        .rejects.toThrow("User not found");

});
```

This tests both success and failure scenarios.

---

# PART 8: INTEGRATION TESTING

## 19. What Is Integration Testing in a Backend?

Consider a typical Express application:

```text
Client
  |
  v
Express Route
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
MySQL Database
```

A unit test might test only the service.

An integration test can verify that the route, controller, service and repository work together.

For a meaningful integration test, use real collaborating components where possible. A test with every dependency mocked is generally a unit test, not an integration test.

### Example Integration Scenario

```text
POST /api/users
       |
       v
Validate Request
       |
       v
Create User
       |
       v
Save User in Test Database
       |
       v
Return HTTP 201
```

You should verify:

- HTTP status.
- Response body.
- Database record.
- Validation behavior.
- Error handling.

---

# PART 9: SUPERTEST WITH EXPRESS

## 20. What Is Supertest?

Supertest is a library used to test HTTP applications.

It is particularly useful for testing:

- Express APIs.
- HTTP status codes.
- Request validation.
- Response bodies.
- Headers.
- Authentication behavior.

Documentation: [Supertest Documentation](https://github.com/ladjs/supertest?utm_source=chatgpt.com)

Install:

```bash
npm install -D supertest @types/supertest
```

---

## 21. Creating a Testable Express Application

Recommended project structure:

```text
src/
│
├── app.ts
├── server.ts
│
├── routes/
│   └── user.routes.ts
│
└── controllers/
    └── user.controller.ts

tests/
└── user.test.ts
```

### 21.1 Create Express Application

`src/app.ts`

```typescript
import express from "express";

const app = express();

app.use(express.json());

app.get("/api/users", (req, res) => {

    res.status(200).json({
        success: true,
        users: [
            {
                id: 1,
                name: "John"
            }
        ]
    });

});

export default app;
```

### 21.2 Create Server Separately

`src/server.ts`

```typescript
import app from "./app";

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

Why separate these files?

Because tests can import `app.ts` without starting a server on a fixed port.

### 21.3 Write API Test

`tests/user.test.ts`

```typescript
import request from "supertest";

import { describe, it, expect } from "vitest";

import app from "../src/app";

describe("GET /api/users", () => {

    it("should return users", async () => {

        const response = await request(app)
            .get("/api/users");

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.users).toHaveLength(1);

        expect(response.body.users[0].name)
            .toBe("John");

    });

});
```

Run:

```bash
npx vitest run
```

### What Should You Test in Express APIs?

| Scenario | Expected Result |
|---|---|
| Valid request | 200 or 201 |
| Invalid request | 400 |
| Missing authentication | 401 |
| Insufficient permission | 403 |
| Resource not found | 404 |
| Unexpected server error | 500 |

These are common conventions. Your API should use consistent status codes based on its actual contract.

---

# PART 10: TESTING REACT COMPONENTS WITH TYPESCRIPT

## 22. What Is React Testing Library?

React Testing Library is a library for testing React components from the user's perspective.

It encourages testing what users can see and interact with rather than internal component implementation details.

Documentation: [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/?utm_source=chatgpt.com)

Install:

```bash
npm install -D @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

For a Vite + Vitest project, configure the test environment:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "jsdom",
        setupFiles: "./src/setupTests.ts"
    }
});
```

`src/setupTests.ts`

```typescript
import "@testing-library/jest-dom/vitest";
```

---

## 23. Testing a React Component

Create a component:

`Counter.tsx`

```tsx
import { useState } from "react";

export default function Counter() {

    const [count, setCount] = useState<number>(0);

    return (
        <div>

            <h1>Count: {count}</h1>

            <button
                onClick={() => setCount(count + 1)}
            >
                Increment
            </button>

        </div>
    );
}
```

Test:

`Counter.test.tsx`

```tsx
import { describe, it, expect } from "vitest";

import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import Counter from "./Counter";

describe("Counter Component", () => {

    it("should display initial count", () => {

        render(<Counter />);

        expect(
            screen.getByText("Count: 0")
        ).toBeInTheDocument();

    });

    it("should increment count when button is clicked", async () => {

        const user = userEvent.setup();

        render(<Counter />);

        const button = screen.getByRole("button", {
            name: "Increment"
        });

        await user.click(button);

        expect(
            screen.getByText("Count: 1")
        ).toBeInTheDocument();

    });

});
```

### Important React Testing Library Methods

| Method | Purpose |
|---|---|
| `render()` | Renders component |
| `screen.getByRole()` | Finds element by accessible role |
| `screen.getByText()` | Finds element by visible text |
| `screen.getByLabelText()` | Finds form element by label |
| `screen.queryByText()` | Returns null if element is missing |
| `screen.findByText()` | Asynchronously finds element |
| `userEvent.click()` | Simulates user click |
| `userEvent.type()` | Simulates typing |

### Important Difference

`getByText()` throws an error when the element is not found.

`queryByText()` returns `null` when the element is not found.

`findByText()` waits for an element to appear asynchronously.

Prefer accessible queries such as roles and labels whenever practical.

---

# PART 11: END-TO-END TESTING WITH PLAYWRIGHT

## 24. What Is Playwright?

Playwright is a browser automation and E2E testing framework.

It supports:

- Chromium.
- Firefox.
- WebKit.
- TypeScript.
- JavaScript.
- Browser automation.
- Screenshots.
- Video recording.
- Network interception.

Documentation: [Playwright Documentation](https://playwright.dev/docs/intro?utm_source=chatgpt.com)

Install:

```bash
npm init playwright@latest
```

Choose TypeScript when prompted.

---

## 25. Basic Playwright Test

Create:

`tests/login.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test("should open login page", async ({ page }) => {

    await page.goto("http://localhost:3000/login");

    await expect(
        page.getByRole("heading", {
            name: "Login"
        })
    ).toBeVisible();

});
```

### 25.1 Testing Login

```typescript
import { test, expect } from "@playwright/test";

test("should login successfully", async ({ page }) => {

    await page.goto("http://localhost:3000/login");

    await page.getByLabel("Email").fill("john@example.com");

    await page.getByLabel("Password").fill("password123");

    await page.getByRole("button", {
        name: "Login"
    }).click();

    await expect(page).toHaveURL(/dashboard/);

});
```

### 25.2 Common Playwright Methods

| Method | Purpose |
|---|---|
| `page.goto()` | Navigate to URL |
| `page.locator()` | Find element |
| `page.getByRole()` | Find accessible element |
| `page.getByText()` | Find text |
| `page.getByLabel()` | Find form element |
| `locator.click()` | Click element |
| `locator.fill()` | Enter text |
| `locator.check()` | Check checkbox |
| `locator.selectOption()` | Select dropdown option |
| `expect()` | Assert expected behavior |

### 25.3 Playwright Configuration

`playwright.config.ts`

```typescript
import { defineConfig } from "@playwright/test";

export default defineConfig({

    testDir: "./tests",

    fullyParallel: true,

    retries: 1,

    reporter: "html",

    use: {
        baseURL: "http://localhost:3000",
        headless: true,
        screenshot: "only-on-failure",
        trace: "retain-on-failure"
    },

    projects: [
        {
            name: "chromium",
            use: {
                browserName: "chromium"
            }
        }
    ]

});
```

### 25.4 Run Tests

```bash
npx playwright test
```

Run with browser visible:

```bash
npx playwright test --headed
```

Run a particular test:

```bash
npx playwright test login.spec.ts
```

Open HTML report:

```bash
npx playwright show-report
```

### 25.5 Page Object Model (POM)

The Page Object Model is a design pattern for organizing E2E test code.

Instead of writing all browser interactions directly inside test files, create separate classes representing pages.

Example:

`pages/LoginPage.ts`

```typescript
import { Page, Locator } from "@playwright/test";

export class LoginPage {

    readonly page: Page;

    readonly emailInput: Locator;

    readonly passwordInput: Locator;

    readonly loginButton: Locator;

    constructor(page: Page) {

        this.page = page;

        this.emailInput = page.getByLabel("Email");

        this.passwordInput = page.getByLabel("Password");

        this.loginButton = page.getByRole("button", {
            name: "Login"
        });

    }

    async goto(): Promise<void> {

        await this.page.goto("/login");

    }

    async login(email: string, password: string): Promise<void> {

        await this.emailInput.fill(email);

        await this.passwordInput.fill(password);

        await this.loginButton.click();

    }

}
```

Test:

```typescript
import { test, expect } from "@playwright/test";

import { LoginPage } from "../pages/LoginPage";

test("should login successfully", async ({ page }) => {

    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
        "john@example.com",
        "password123"
    );

    await expect(page).toHaveURL(/dashboard/);

});
```

### Why Use POM?

- Reusable page interactions.
- Less duplicate code.
- Easier maintenance.
- Better separation of concerns.

Do not create excessive abstractions for simple test suites.

---

# PART 12: DEBUGGING TYPESCRIPT APPLICATIONS

## 26. What Is Debugging?

Debugging is the process of identifying, analyzing and fixing errors in an application.

Consider:

```typescript
function calculateTotal(price: number, quantity: number): number {

    const total = price + quantity;

    return total;

}

console.log(calculateTotal(100, 5));
```

Expected:

```text
500
```

Actual:

```text
105
```

The problem is that you used `+` instead of `*`.

Debugging helps identify such issues.

---

## 27. Types of Errors

### 27.1 Syntax Errors

Errors caused by invalid syntax.

```typescript
function greet() {

    console.log("Hello")

// Missing closing brace
```

### 27.2 Type Errors

Errors detected by the TypeScript compiler.

```typescript
let age: number = 25;

age = "Twenty Five";
```

TypeScript reports an error.

### 27.3 Runtime Errors

Errors that occur while the application is executing.

```typescript
const user = null;

console.log(user.name);
```

This causes a runtime error because `null` does not have a `name` property.

### 27.4 Logical Errors

The program runs without crashing but produces incorrect results.

```typescript
function calculateArea(length: number, width: number): number {

    return length + width;

}
```

Expected:

```typescript
length * width
```

Actual:

```typescript
length + width
```

### Comparison

| Error Type | When Detected |
|---|---|
| Syntax Error | Parsing/compilation |
| Type Error | Type checking |
| Runtime Error | Application execution |
| Logical Error | During verification or use |

---

# PART 13: DEBUGGING WITH VS CODE

## 28. What Is a Breakpoint?

A breakpoint pauses program execution at a specific line.

This allows you to inspect:

- Variable values.
- Function arguments.
- Call stack.
- Execution flow.
- Object properties.

Example:

```typescript
function calculateTotal(price: number, quantity: number): number {

    const subtotal = price * quantity;

    const tax = subtotal * 0.18;

    const total = subtotal + tax;

    return total;

}

console.log(calculateTotal(1000, 2));
```

Place breakpoints on:

```typescript
const subtotal = price * quantity;
```

```typescript
const tax = subtotal * 0.18;
```

```typescript
const total = subtotal + tax;
```

You can inspect each variable while execution is paused.

### 28.1 Important Debugging Controls

| Control | Purpose |
|---|---|
| Continue | Resume execution |
| Step Over | Execute current line without entering function calls |
| Step Into | Enter a function call |
| Step Out | Finish current function and return to caller |
| Restart | Restart debugging |
| Stop | Stop debugging |

### 28.2 VS Code Debug Configuration

Create:

`.vscode/launch.json`

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug TypeScript",
      "runtimeExecutable": "npx",
      "runtimeArgs": [
        "tsx",
        "src/index.ts"
      ],
      "skipFiles": [
        "<node_internals>/**"
      ],
      "console": "integratedTerminal"
    }
  ]
}
```

Install:

```bash
npm install -D tsx
```

This example runs TypeScript through `tsx`.

The exact debugging configuration can vary depending on whether you use `tsx`, `ts-node`, compiled JavaScript or a build tool.

---

# PART 14: NODE.JS DEBUGGING

## 29. Debugging Node.js Applications

Node.js includes a built-in inspector.

Start your application:

```bash
node --inspect app.js
```

The default inspector address is generally:

```text
127.0.0.1:9229
```

Start with the debugger paused at the beginning:

```bash
node --inspect-brk app.js
```

### What Is the Difference?

| Command | Behavior |
|---|---|
| `node app.js` | Normal execution |
| `node --inspect app.js` | Starts inspector and executes normally |
| `node --inspect-brk app.js` | Starts inspector and pauses at the beginning |

You can connect through Chrome DevTools or VS Code.

**Security warning:** Do not expose the Node.js inspector to an untrusted network. A debugger connection can provide powerful control over the running process.

---

# PART 15: SOURCE MAPS

## 30. What Are Source Maps?

TypeScript code is generally compiled into JavaScript.

Example:

```typescript
const message: string = "Hello";

console.log(message);
```

Compiled JavaScript:

```javascript
const message = "Hello";

console.log(message);
```

Suppose an error occurs in the generated JavaScript.

Without source maps, debugging may point to generated JavaScript locations.

Source maps connect generated JavaScript back to the original TypeScript source.

### Enable Source Maps

In `tsconfig.json`:

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

Compile:

```bash
npx tsc
```

You may get:

```text
dist/
│
├── app.js
├── app.js.map
```

### Why Are Source Maps Important?

- Debug original TypeScript.
- Understand stack traces.
- Locate errors more easily.
- Improve production error investigation.

**Important:** Source maps must be generated and made available to the debugger. Also consider whether publishing source maps in production exposes source code or internal implementation details.

---

# PART 16: ERROR HANDLING STRATEGIES

## 31. What Is Error Handling?

Error handling is the process of detecting and managing unexpected situations.

Consider:

```typescript
function divide(a: number, b: number): number {

    return a / b;

}
```

JavaScript allows division by zero:

```typescript
console.log(divide(10, 0));
```

Output:

```text
Infinity
```

But your application might consider division by zero invalid.

You should handle that explicitly.

```typescript
function divide(a: number, b: number): number {

    if (b === 0) {
        throw new Error("Division by zero is not allowed");
    }

    return a / b;

}
```

---

## 32. Try, Catch and Finally

### try

Contains code that may throw an error.

### catch

Handles an error thrown inside the associated `try` block.

### finally

Runs when control leaves the `try`/`catch` structure, whether or not an error occurred.

Example:

```typescript
try {

    const result = 10 / 0;

    console.log(result);

} catch (error) {

    console.log("An error occurred");

} finally {

    console.log("Execution completed");

}
```

### Practical Example

```typescript
async function getUser(): Promise<void> {

    try {

        const response = await fetch(
            "https://api.example.com/users/1"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch user");
        }

        const user = await response.json();

        console.log(user);

    } catch (error) {

        console.error("Error:", error);

    }

}
```

Important: `fetch()` does not reject merely because the server returns HTTP 404 or 500. Check `response.ok` or `response.status`.

---

## 33. Understanding Unknown in Catch Blocks

This is an important TypeScript concept.

Consider:

```typescript
try {

    throw new Error("Something went wrong");

} catch (error) {

    console.log(error.message);

}
```

Under strict modern TypeScript settings, catch variables are treated as `unknown`.

Why?

Because JavaScript allows throwing any value:

```typescript
throw new Error("Failed");

throw "Something failed";

throw 100;

throw {
    message: "Custom error"
};
```

Therefore, TypeScript cannot assume that the caught value is an `Error`.

### Correct Approach

```typescript
try {

    throw new Error("Something went wrong");

} catch (error: unknown) {

    if (error instanceof Error) {

        console.log(error.message);

    } else {

        console.log("Unknown error occurred");

    }

}
```

### Why Prefer Unknown Over Any?

| `any` | `unknown` |
|---|---|
| Allows unrestricted operations | Requires type narrowing |
| Disables important type checks | Preserves type safety |
| Easy to misuse | Safer for uncertain values |

---

# PART 17: CUSTOM ERROR CLASSES

## 34. What Are Custom Error Classes?

Custom error classes allow you to define application-specific errors.

Instead of throwing generic errors everywhere, you can create meaningful error types.

Example:

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
function registerUser(email: string): void {

    if (!email.includes("@")) {

        throw new ValidationError("Invalid email address");

    }

}
```

Handling:

```typescript
try {

    registerUser("invalid-email");

} catch (error: unknown) {

    if (error instanceof ValidationError) {

        console.log("Validation Error:", error.message);

    }

}
```

---

## 35. Building an Error Hierarchy

A production application may contain multiple custom error classes.

```typescript
class AppError extends Error {

    constructor(
        message: string,
        public statusCode: number
    ) {

        super(message);

        this.name = this.constructor.name;

    }

}
```

Create specialized errors:

```typescript
class NotFoundError extends AppError {

    constructor(message: string) {

        super(message, 404);

    }

}

class ValidationError extends AppError {

    constructor(message: string) {

        super(message, 400);

    }

}

class UnauthorizedError extends AppError {

    constructor(message: string) {

        super(message, 401);

    }

}
```

Usage:

```typescript
function getUser(id: number): void {

    if (id <= 0) {
        throw new ValidationError("Invalid user ID");
    }

    throw new NotFoundError("User not found");

}
```

### Benefits

- Consistent error handling.
- Better separation of error categories.
- Easier API error responses.
- Better debugging.
- Improved maintainability.

For more advanced error classes, you can also add:

- Error codes.
- Original cause.
- Metadata.
- Retryability information.

Modern JavaScript supports the `cause` option for `Error`.

---

# PART 18: ERROR HANDLING WITH DISCRIMINATED UNIONS

## 36. What Is a Discriminated Union?

A discriminated union is a TypeScript technique that uses a common property to distinguish between different object types.

Example:

```typescript
type Result<T> =
    | {
        success: true;
        data: T;
    }
    | {
        success: false;
        error: string;
    };
```

Here, `success` is the discriminant property.

### 36.1 Using Result Types

```typescript
interface User {
    id: number;
    name: string;
}

function getUser(id: number): Result<User> {

    if (id === 1) {

        return {
            success: true,
            data: {
                id: 1,
                name: "John"
            }
        };

    }

    return {
        success: false,
        error: "User not found"
    };

}
```

Handle the result:

```typescript
const result = getUser(1);

if (result.success) {

    console.log(result.data.name);

} else {

    console.log(result.error);

}
```

TypeScript automatically narrows the type based on `success`.

### 36.2 More Advanced Result Type

```typescript
type AppResult<T, E> =
    | {
        success: true;
        data: T;
    }
    | {
        success: false;
        error: E;
    };
```

Define errors:

```typescript
type UserError =
    | {
        type: "NOT_FOUND";
        message: string;
    }
    | {
        type: "INVALID_ID";
        message: string;
    }
    | {
        type: "DATABASE_ERROR";
        message: string;
    };
```

Function:

```typescript
function getUser(id: number): AppResult<User, UserError> {

    if (id <= 0) {

        return {
            success: false,
            error: {
                type: "INVALID_ID",
                message: "Invalid user ID"
            }
        };

    }

    if (id !== 1) {

        return {
            success: false,
            error: {
                type: "NOT_FOUND",
                message: "User not found"
            }
        };

    }

    return {
        success: true,
        data: {
            id: 1,
            name: "John"
        }
    };

}
```

### When Should You Use Result Types?

Use them when you want errors represented explicitly in a function's return type.

They are especially useful for:

- Business logic.
- Validation.
- Domain operations.
- Expected failure scenarios.

Use exceptions for exceptional conditions where appropriate. Result types and exceptions can coexist.

---

# PART 19: GLOBAL ERROR HANDLING IN EXPRESS

## 37. What Is Global Error Handling?

Instead of handling errors separately in every controller, Express allows you to create centralized error-handling middleware.

This keeps your controllers cleaner and makes API responses consistent.

### 37.1 Example Project Structure

```text
src/
│
├── app.ts
│
├── errors/
│   └── AppError.ts
│
├── middleware/
│   └── error.middleware.ts
│
├── controllers/
│   └── user.controller.ts
│
└── routes/
    └── user.routes.ts
```

### 37.2 Create AppError

`errors/AppError.ts`

```typescript
export class AppError extends Error {

    constructor(
        message: string,
        public statusCode: number
    ) {

        super(message);

        this.name = this.constructor.name;

    }

}
```

### 37.3 Create Error Middleware

`middleware/error.middleware.ts`

```typescript
import {
    Request,
    Response,
    NextFunction
} from "express";

import { AppError } from "../errors/AppError";

export function errorMiddleware(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
): void {

    if (res.headersSent) {
        next(error);
        return;
    }

    if (error instanceof AppError) {

        res.status(error.statusCode).json({
            success: false,
            message: error.message
        });

        return;
    }

    console.error(error);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });

}
```

### 37.4 Use Middleware

`app.ts`

```typescript
import express from "express";

import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(express.json());

app.get("/api/users/:id", (req, res, next) => {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("Invalid user ID");
        }

        res.json({
            success: true,
            user: {
                id,
                name: "John"
            }
        });

    } catch (error) {

        next(error);

    }

});

app.use(errorMiddleware);

export default app;
```

### Important Express Concept

Error-handling middleware must have four parameters:

```typescript
(err, req, res, next)
```

It should be registered after the routes and other middleware that may pass errors to it.

For Express 5, rejected promises from async route handlers are automatically forwarded to error middleware. In Express 4, use an async wrapper or explicitly forward errors with `next(error)`.

**Production rule:** Never expose internal stack traces, database credentials, SQL queries or sensitive implementation details in API responses.

---

# PART 20: LOGGING AND MONITORING

## 38. What Is Logging?

Logging means recording important application events.

Example:

```typescript
console.log("Server started");

console.error("Database connection failed");
```

However, production applications generally require structured logging.

### 38.1 Logging Levels

| Level | Purpose |
|---|---|
| `fatal` | Application cannot continue |
| `error` | Serious application error |
| `warn` | Potential problem |
| `info` | Important application event |
| `debug` | Detailed debugging information |
| `trace` | Very detailed execution information |

### 38.2 Structured Logging

Instead of:

```typescript
console.log("User John logged in");
```

Use structured data:

```typescript
console.log({
    level: "info",
    message: "User logged in",
    userId: 101,
    timestamp: new Date().toISOString()
});
```

Structured logs are easier to search, filter and analyze.

### 38.3 Popular Logging Libraries

| Library | Purpose |
|---|---|
| Pino | High-performance structured logging |
| Winston | Flexible application logging |
| Morgan | HTTP request logging for Express |

Official resources:

- [Pino Documentation](https://getpino.io/?utm_source=chatgpt.com)
- [Winston Documentation](https://github.com/winstonjs/winston?utm_source=chatgpt.com)
- [Morgan Documentation](https://github.com/expressjs/morgan?utm_source=chatgpt.com)

### 38.4 What Is Monitoring?

Monitoring means observing an application's health and performance.

You might monitor:

- CPU usage.
- Memory usage.
- API response time.
- Error rate.
- Database performance.
- Request volume.
- Application availability.

### Logging vs Monitoring

| Logging | Monitoring |
|---|---|
| Records events | Tracks system health |
| Helps investigate errors | Helps identify system problems |
| Stores detailed messages | Tracks metrics and trends |
| Example: Pino | Example: Prometheus |

Monitoring and logging are complementary.

### Important Security Rule

Never log:

- Passwords.
- Authentication tokens.
- API secrets.
- Database credentials.
- Sensitive personal information.

Use request IDs or correlation IDs to connect logs belonging to the same request.

---

# PART 21: ESLINT WITH TYPESCRIPT

## 39. What Is ESLint?

ESLint is a static code analysis tool.

It identifies potential problems and enforces coding conventions.

Examples:

- Unused variables.
- Unnecessary expressions.
- Potential bugs.
- Inconsistent coding patterns.
- Unsafe TypeScript practices.

Official documentation: [ESLint Documentation](https://eslint.org/docs/latest/?utm_source=chatgpt.com)

### 39.1 Install ESLint

```bash
npm install -D eslint @eslint/js typescript typescript-eslint
```

### 39.2 Create ESLint Configuration

`eslint.config.mjs`

```javascript
import js from "@eslint/js";

import tseslint from "typescript-eslint";

export default tseslint.config(

    {
        ignores: [
            "dist/",
            "node_modules/"
        ]
    },

    js.configs.recommended,

    ...tseslint.configs.recommended

);
```

This uses ESLint's modern flat configuration format.

### 39.3 Example of an ESLint Error

```typescript
const name = "John";

console.log(name);

const age = 25;
```

Depending on the enabled rules, ESLint may report that `age` is unused.

### 39.4 Type-Aware ESLint Rules

Some ESLint rules require TypeScript's type information.

For example, rules can detect:

- Unsafe assignments.
- Floating promises.
- Unnecessary conditions.
- Unsafe function calls.

Type-aware linting requires additional parser configuration and can increase linting time.

Do not enable every rule blindly. Configure rules according to your application's requirements.

---

# PART 22: PRETTIER

## 40. What Is Prettier?

Prettier is an opinionated code formatter.

It automatically formats source code according to consistent rules.

Official documentation: [Prettier Documentation](https://prettier.io/docs/?utm_source=chatgpt.com)

### Example

Before formatting:

```typescript
const user={name:"John",age:25,email:"john@example.com"}
```

After formatting:

```typescript
const user = {
    name: "John",
    age: 25,
    email: "john@example.com"
};
```

### 40.1 Install Prettier

```bash
npm install -D prettier
```

Create:

`.prettierrc`

```json
{
    "semi": true,
    "singleQuote": true,
    "tabWidth": 2,
    "trailingComma": "all"
}
```

### 40.2 Run Prettier

Format files:

```bash
npx prettier --write .
```

Check formatting:

```bash
npx prettier --check .
```

### ESLint vs Prettier

| Feature | ESLint | Prettier |
|---|---|---|
| Main Purpose | Code analysis | Code formatting |
| Detects potential bugs | Yes | No |
| Enforces coding rules | Yes | No, formatting rules only |
| Changes formatting | Through fixable rules | Yes |
| Removes unused imports | With suitable rules/plugins | No |
| Formats indentation | Can | Yes |

**Remember:**

ESLint checks code quality.

Prettier formats code.

They are complementary tools.

If you want to avoid conflicting formatting rules, you can use `eslint-config-prettier`.

---

# PART 23: STATIC ANALYSIS AND CODE QUALITY

## 41. What Is Static Code Analysis?

Static code analysis examines source code without executing the application.

Examples:

- TypeScript compiler.
- ESLint.
- Security analysis tools.
- Dependency vulnerability scanners.

### 41.1 TypeScript Type Checking

Run:

```bash
npx tsc --noEmit
```

This checks TypeScript types without generating JavaScript output.

### 41.2 ESLint

Run:

```bash
npx eslint .
```

### 41.3 Prettier

Run:

```bash
npx prettier --check .
```

### 41.4 Build

Run:

```bash
npm run build
```

### Recommended Quality Pipeline

```text
Developer Writes Code
        |
        v
TypeScript Type Checking
        |
        v
ESLint
        |
        v
Prettier Check
        |
        v
Unit Tests
        |
        v
Integration Tests
        |
        v
Build
        |
        v
Deployment
```

Each stage should pass before the next stage proceeds.

---

# PART 24: TEST COVERAGE

## 42. What Is Test Coverage?

Test coverage measures how much of your source code is executed during tests.

Common coverage metrics include:

### 42.1 Statement Coverage

Measures how many executable statements are executed.

### 42.2 Branch Coverage

Measures whether different decision branches are executed.

Example:

```typescript
function checkAge(age: number): string {

    if (age >= 18) {
        return "Adult";
    }

    return "Minor";

}
```

You need to test both branches.

### 42.3 Function Coverage

Measures how many functions are executed during testing.

### 42.4 Line Coverage

Measures how many executable lines are covered.

### Coverage Comparison

| Metric | Measures |
|---|---|
| Statement Coverage | Executed statements |
| Branch Coverage | Executed conditional branches |
| Function Coverage | Executed functions |
| Line Coverage | Executed lines |

### 42.5 Generate Coverage Report

For Vitest:

Install:

```bash
npm install -D @vitest/coverage-v8
```

Run:

```bash
npx vitest run --coverage
```

You can configure coverage thresholds:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({

    test: {

        coverage: {

            provider: "v8",

            thresholds: {

                statements: 80,

                branches: 75,

                functions: 80,

                lines: 80

            }

        }

    }

});
```

These percentages are illustrative targets, not universal quality standards.

### Important: 100% Coverage Does Not Mean Bug-Free Code

You can achieve 100% code coverage with poor-quality tests.

Coverage only tells you which code was executed.

It does not guarantee that:

- Assertions are meaningful.
- Every business rule is correct.
- Every edge case is covered.
- The application is secure.

Focus on meaningful test cases, not just coverage percentages.

---

# PART 25: CI/CD TESTING WORKFLOWS

## 43. What Is CI/CD?

CI/CD stands for:

- Continuous Integration.
- Continuous Delivery.
- Continuous Deployment.

### Continuous Integration

Developers frequently merge code changes into a shared repository.

Automated checks run to detect problems.

### Continuous Delivery

Code is automatically built and prepared for release, but production deployment may require approval.

### Continuous Deployment

Every change that passes the required pipeline can be deployed automatically.

---

## 44. GitHub Actions with TypeScript

GitHub Actions allows you to automate workflows when code is pushed or pull requests are created.

Documentation: [GitHub Actions Documentation](https://docs.github.com/en/actions?utm_source=chatgpt.com)

Create:

`.github/workflows/ci.yml`

```yaml
name: TypeScript CI

on:
  push:
    branches:
      - main

  pull_request:
    branches:
      - main

jobs:

  test:

    runs-on: ubuntu-latest

    steps:

      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install Dependencies
        run: npm ci

      - name: Type Checking
        run: npm run typecheck

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test

      - name: Build
        run: npm run build
```

The action versions and Node.js version should match your project's supported environment.

### 44.1 Package Scripts

Your `package.json` might contain:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "test": "vitest run",
    "build": "tsc"
  }
}
```

### CI/CD Workflow

```text
Developer Pushes Code
          |
          v
     GitHub Actions
          |
          v
   Install Dependencies
          |
          v
    TypeScript Check
          |
          v
       ESLint
          |
          v
        Tests
          |
          v
        Build
          |
          v
      All Passed?
       /      \
     Yes       No
      |         |
      v         v
  Deployment  Stop Pipeline
```

Never deploy code automatically when critical quality checks fail.

---

# PART 26: REAL-WORLD PROJECT

## 45. Build a Tested User Management API

Now combine the concepts from this phase.

We will create a User Management API using:

| Technology | Purpose |
|---|---|
| TypeScript | Programming language |
| Node.js | Runtime |
| Express | Backend framework |
| Vitest | Testing framework |
| Supertest | API integration testing |
| ESLint | Code quality |
| Prettier | Code formatting |

### 45.1 Project Structure

```text
user-management/
│
├── src/
│   │
│   ├── app.ts
│   ├── server.ts
│   │
│   ├── interfaces/
│   │   └── User.ts
│   │
│   ├── repositories/
│   │   └── UserRepository.ts
│   │
│   ├── services/
│   │   └── UserService.ts
│   │
│   ├── controllers/
│   │   └── UserController.ts
│   │
│   ├── routes/
│   │   └── UserRoutes.ts
│   │
│   ├── errors/
│   │   └── AppError.ts
│   │
│   └── middleware/
│       └── errorMiddleware.ts
│
├── tests/
│   │
│   ├── unit/
│   │   └── UserService.test.ts
│   │
│   └── integration/
│       └── UserAPI.test.ts
│
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

### 45.2 Define User Interface

`interfaces/User.ts`

```typescript
export interface User {

    id: number;

    name: string;

    email: string;

}
```

### 45.3 Create Repository Interface

`repositories/UserRepository.ts`

```typescript
import { User } from "../interfaces/User";

export interface UserRepository {

    findAll(): Promise<User[]>;

    findById(id: number): Promise<User | null>;

    create(user: User): Promise<User>;

}
```

### 45.4 Create In-Memory Repository

For this learning project, we will use an in-memory repository.

In a production application, you would normally use a database implementation.

```typescript
import { User } from "../interfaces/User";

import { UserRepository } from "./UserRepository";

export class InMemoryUserRepository implements UserRepository {

    private users: User[] = [];

    private nextId = 1;

    async findAll(): Promise<User[]> {

        return [...this.users];

    }

    async findById(id: number): Promise<User | null> {

        return this.users.find(user => user.id === id) ?? null;

    }

    async create(user: User): Promise<User> {

        const newUser: User = {
            ...user,
            id: this.nextId++
        };

        this.users.push(newUser);

        return newUser;

    }

}
```

### 45.5 Create Custom Error

`errors/AppError.ts`

```typescript
export class AppError extends Error {

    constructor(
        message: string,
        public statusCode: number
    ) {

        super(message);

        this.name = this.constructor.name;

    }

}
```

### 45.6 Create User Service

`services/UserService.ts`

```typescript
import { User } from "../interfaces/User";

import { UserRepository } from "../repositories/UserRepository";

import { AppError } from "../errors/AppError";

export class UserService {

    constructor(
        private repository: UserRepository
    ) {}

    async getAllUsers(): Promise<User[]> {

        return this.repository.findAll();

    }

    async getUserById(id: number): Promise<User> {

        if (!Number.isInteger(id) || id <= 0) {

            throw new AppError("Invalid user ID", 400);

        }

        const user = await this.repository.findById(id);

        if (!user) {

            throw new AppError("User not found", 404);

        }

        return user;

    }

    async createUser(
        name: string,
        email: string
    ): Promise<User> {

        if (!name.trim()) {

            throw new AppError("Name is required", 400);

        }

        if (!email.includes("@")) {

            throw new AppError("Invalid email", 400);

        }

        return this.repository.create({
            id: 0,
            name,
            email
        });

    }

}
```

### 45.7 Create Error Middleware

`middleware/errorMiddleware.ts`

```typescript
import {
    Request,
    Response,
    NextFunction
} from "express";

import { AppError } from "../errors/AppError";

export function errorMiddleware(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
): void {

    if (res.headersSent) {
        next(error);
        return;
    }

    if (error instanceof AppError) {

        res.status(error.statusCode).json({
            success: false,
            message: error.message
        });

        return;
    }

    console.error(error);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });

}
```

### 45.8 Create User Controller

`controllers/UserController.ts`

```typescript
import {
    Request,
    Response,
    NextFunction
} from "express";

import { UserService } from "../services/UserService";

export class UserController {

    constructor(
        private service: UserService
    ) {}

    getAllUsers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {

        try {

            const users = await this.service.getAllUsers();

            res.status(200).json({
                success: true,
                data: users
            });

        } catch (error) {

            next(error);

        }

    };

    getUserById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {

        try {

            const user = await this.service.getUserById(
                Number(req.params.id)
            );

            res.status(200).json({
                success: true,
                data: user
            });

        } catch (error) {

            next(error);

        }

    };

    createUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {

        try {

            const { name, email } = req.body;

            const user = await this.service.createUser(
                name,
                email
            );

            res.status(201).json({
                success: true,
                data: user
            });

        } catch (error) {

            next(error);

        }

    };

}
```

### 45.9 Create Routes

`routes/UserRoutes.ts`

```typescript
import { Router } from "express";

import { UserController } from "../controllers/UserController";

export function createUserRoutes(
    controller: UserController
): Router {

    const router = Router();

    router.get("/", controller.getAllUsers);

    router.get("/:id", controller.getUserById);

    router.post("/", controller.createUser);

    return router;

}
```

### 45.10 Create App

`app.ts`

```typescript
import express from "express";

import { InMemoryUserRepository } from "./repositories/InMemoryUserRepository";

import { UserService } from "./services/UserService";

import { UserController } from "./controllers/UserController";

import { createUserRoutes } from "./routes/UserRoutes";

import { errorMiddleware } from "./middleware/errorMiddleware";

const app = express();

app.use(express.json());

const repository = new InMemoryUserRepository();

const service = new UserService(repository);

const controller = new UserController(service);

app.use("/api/users", createUserRoutes(controller));

app.use(errorMiddleware);

export default app;
```

### 45.11 Create Server

`server.ts`

```typescript
import app from "./app";

const PORT = 3000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});
```

---

## 46. Unit Testing the User Service

`tests/unit/UserService.test.ts`

```typescript
import { describe, it, expect } from "vitest";

import { UserService } from "../../src/services/UserService";

import { InMemoryUserRepository } from "../../src/repositories/InMemoryUserRepository";

describe("UserService", () => {

    it("should create a user", async () => {

        const repository = new InMemoryUserRepository();

        const service = new UserService(repository);

        const user = await service.createUser(
            "John",
            "john@example.com"
        );

        expect(user.name).toBe("John");

        expect(user.email).toBe("john@example.com");

    });

    it("should throw error for invalid email", async () => {

        const repository = new InMemoryUserRepository();

        const service = new UserService(repository);

        await expect(
            service.createUser("John", "invalid-email")
        ).rejects.toThrow("Invalid email");

    });

    it("should return all users", async () => {

        const repository = new InMemoryUserRepository();

        const service = new UserService(repository);

        await service.createUser(
            "John",
            "john@example.com"
        );

        const users = await service.getAllUsers();

        expect(users).toHaveLength(1);

    });

});
```

---

## 47. Integration Testing the User API

`tests/integration/UserAPI.test.ts`

```typescript
import request from "supertest";

import { describe, it, expect } from "vitest";

import app from "../../src/app";

describe("User API", () => {

    it("should create a user", async () => {

        const response = await request(app)
            .post("/api/users")
            .send({
                name: "John",
                email: "john@example.com"
            });

        expect(response.status).toBe(201);

        expect(response.body.success).toBe(true);

        expect(response.body.data.name).toBe("John");

    });

    it("should return validation error", async () => {

        const response = await request(app)
            .post("/api/users")
            .send({
                name: "",
                email: "invalid-email"
            });

        expect(response.status).toBe(400);

        expect(response.body.success).toBe(false);

    });

    it("should return user not found", async () => {

        const response = await request(app)
            .get("/api/users/999");

        expect(response.status).toBe(404);

    });

});
```

**Important project improvement:** The integration tests above use an in-memory repository created when the app module loads. For independent, repeatable tests, create an app factory that accepts dependencies and provides a fresh repository for each test suite or test. That prevents test data from leaking between tests.

Also, this is an integration test of the Express application and its in-memory repository, not a database integration test.

---

# PART 27: COMMON MISTAKES

## 48. Mistakes Developers Should Avoid

| Mistake | Correct Approach |
|---|---|
| Testing only successful scenarios | Test failure and edge cases too |
| Writing one large test | Split tests into focused scenarios |
| Depending on test execution order | Keep tests independent |
| Using real APIs in every unit test | Mock or fake external dependencies |
| Mocking everything in integration tests | Test real component interactions |
| Ignoring rejected promises | Await asynchronous assertions |
| Using `any` for caught errors | Use `unknown` and narrow |
| Exposing internal error messages | Return safe production responses |
| Logging passwords and tokens | Redact sensitive data |
| Testing private methods directly | Test observable public behavior |
| Treating coverage as quality | Focus on meaningful assertions |
| Using `console.log` as the only debugger | Use breakpoints and inspection |
| Confusing ESLint and Prettier | Use both for their respective purposes |
| Assuming TypeScript types exist at runtime | Remember type erasure |
| Running tests only manually | Automate tests in CI/CD |

---

# PART 28: INTERVIEW QUESTIONS AND ANSWERS

## 49. Testing Interview Questions

### Q1. What is software testing?

Software testing is the process of verifying that software behaves according to specified requirements.

### Q2. What is unit testing?

Unit testing verifies individual functions, methods or classes independently.

### Q3. What is integration testing?

Integration testing verifies that multiple components work correctly together.

### Q4. What is E2E testing?

End-to-end testing verifies complete application workflows from the user's perspective.

### Q5. What is the difference between unit and integration testing?

Unit testing focuses on isolated components, whereas integration testing verifies interactions between components.

### Q6. What is Jest?

Jest is a JavaScript testing framework that supports assertions, mocking, test execution and coverage.

### Q7. What is Vitest?

Vitest is a testing framework designed to integrate closely with the Vite ecosystem.

### Q8. What is an assertion?

An assertion checks whether an actual value matches an expected result.

### Q9. What is a test suite?

A test suite is a collection of related test cases.

### Q10. What is test coverage?

Test coverage measures how much of the source code is executed during automated tests.

### Q11. What is mocking?

Mocking replaces real dependencies with controlled test implementations.

### Q12. What is the difference between a mock and a stub?

A stub provides predefined responses, while a mock commonly also supports expectations about interactions.

### Q13. What is a spy?

A spy records how a function or method is called.

### Q14. What is dependency injection?

Dependency injection is a technique in which dependencies are supplied externally rather than created internally.

### Q15. Why is dependency injection useful for testing?

It allows real dependencies to be replaced with mocks or fakes.

### Q16. Can TypeScript interfaces be tested directly?

No. Interfaces are compile-time constructs and are erased during JavaScript compilation. Test their concrete implementations instead.

### Q17. How do you test asynchronous functions?

Use `async/await`, `.resolves` or `.rejects`, and ensure asynchronous assertions are awaited or returned.

### Q18. What is Supertest?

Supertest is a library used to test HTTP applications such as Express APIs.

### Q19. Why should Express app and server files be separate?

It allows tests to import the Express application without starting a listener on a fixed port.

### Q20. What is React Testing Library?

It is a library for testing React components through user-visible behavior and interactions.

### Q21. What is Playwright?

Playwright is a browser automation and end-to-end testing framework.

### Q22. What is the Page Object Model?

POM is a design pattern that separates page interactions from test cases.

### Q23. What is debugging?

Debugging is the process of identifying and fixing errors in software.

### Q24. What is a breakpoint?

A breakpoint pauses program execution at a specified location for inspection.

### Q25. What are source maps?

Source maps map generated JavaScript back to the original TypeScript source.

### Q26. What is the difference between syntax, type and runtime errors?

Syntax errors relate to invalid code syntax, type errors relate to incompatible types, and runtime errors occur during execution.

### Q27. Why is `unknown` safer than `any`?

Because `unknown` requires type checking before operations can be performed, while `any` bypasses type safety.

### Q28. What is a custom error class?

A custom error class is an application-specific class extending `Error` to represent particular error conditions.

### Q29. What is centralized error handling?

Centralized error handling processes application errors through a common handler instead of duplicating error logic across controllers.

### Q30. What is a discriminated union?

A discriminated union is a union of object types that share a property used to distinguish between their variants.

### Q31. What is structured logging?

Structured logging stores log events as organized data, usually JSON, making them easier to search and analyze.

### Q32. What is ESLint?

ESLint is a static analysis tool used to identify potential errors and enforce coding standards.

### Q33. What is Prettier?

Prettier is an opinionated code formatter that automatically formats source code.

### Q34. What is the difference between ESLint and Prettier?

ESLint focuses on code quality and potential problems, while Prettier focuses on formatting.

### Q35. Does 100% test coverage guarantee bug-free software?

No. Coverage measures execution, not whether assertions are meaningful or business logic is correct.

### Q36. What is CI/CD?

CI/CD automates software integration, verification and delivery or deployment.

### Q37. What is the purpose of `tsc --noEmit`?

It performs TypeScript type checking without generating JavaScript output.

### Q38. Why should passwords not be logged?

Logs can be accessed by multiple systems and people. Logging credentials creates serious security risks.

### Q39. What is regression testing?

Regression testing verifies that existing functionality still works after code changes.

### Q40. What is the testing pyramid?

The testing pyramid is a model that recommends a broad foundation of unit tests, fewer integration tests and a smaller number of E2E tests.

---

# PART 29: PRACTICAL EXERCISES

## 50. Beginner-Level Exercises

**Exercise 1: Calculator Testing**

Create a calculator containing:

- Addition.
- Subtraction.
- Multiplication.
- Division.

Write tests for every function.

**Exercise 2: String Utility Testing**

Create functions for:

- Reverse string.
- Count characters.
- Convert to uppercase.
- Check palindrome.

Write unit tests.

**Exercise 3: Array Utility Testing**

Create functions for:

- Find maximum number.
- Find minimum number.
- Remove duplicates.
- Sort numbers.

Test normal and edge cases.

---

## 51. Intermediate-Level Exercises

**Exercise 4: Bank Account Testing**

Create a BankAccount class.

Test:

- Deposit.
- Withdrawal.
- Invalid deposit.
- Insufficient balance.
- Initial balance.

**Exercise 5: User Service Testing**

Create:

```typescript
interface UserRepository {
    findById(id: number): Promise<User | null>;
}
```

Implement:

- UserService.
- FakeUserRepository.
- Unit tests.

**Exercise 6: Async Testing**

Create an async function that fetches user information.

Test:

- Successful response.
- Missing user.
- API failure.

**Exercise 7: Express API Testing**

Create a User API.

Test:

- GET users.
- GET user by ID.
- POST user.
- Invalid input.
- User not found.

Use Supertest.

---

## 52. Advanced-Level Exercises

**Exercise 8: React Component Testing**

Create a registration form.

Test:

- Input fields.
- Form validation.
- Submit button.
- Error messages.
- Successful submission.

**Exercise 9: Playwright E2E**

Create automated tests for:

- Login.
- Registration.
- Dashboard.
- Logout.

**Exercise 10: Custom Error System**

Create:

- AppError.
- ValidationError.
- NotFoundError.
- UnauthorizedError.
- Centralized error middleware.

**Exercise 11: Result Type**

Create a generic:

```typescript
type Result<T, E> = ...
```

Use it in a user service.

**Exercise 12: CI/CD Pipeline**

Create a GitHub Actions workflow that runs:

- Type checking.
- ESLint.
- Prettier check.
- Unit tests.
- Integration tests.
- Build.

---

# PART 30: PHASE 42 COMPLETION CHECKLIST

## 53. Knowledge Checklist

You should now understand:

| No. | Topic | Status |
|---|---|---|
| 1 | Software Testing Fundamentals | ☐ |
| 2 | Unit Testing | ☐ |
| 3 | Integration Testing | ☐ |
| 4 | E2E Testing | ☐ |
| 5 | Testing Pyramid | ☐ |
| 6 | Jest with TypeScript | ☐ |
| 7 | Vitest with TypeScript | ☐ |
| 8 | Testing Functions | ☐ |
| 9 | Testing Classes | ☐ |
| 10 | Testing Interfaces Through Implementations | ☐ |
| 11 | Mocking and Stubbing | ☐ |
| 12 | Spying and Fakes | ☐ |
| 13 | Dependency Injection | ☐ |
| 14 | Async Testing | ☐ |
| 15 | Promise Testing | ☐ |
| 16 | Supertest | ☐ |
| 17 | Express API Testing | ☐ |
| 18 | React Component Testing | ☐ |
| 19 | Playwright | ☐ |
| 20 | Page Object Model | ☐ |
| 21 | Debugging | ☐ |
| 22 | VS Code Debugging | ☐ |
| 23 | Node.js Debugging | ☐ |
| 24 | Source Maps | ☐ |
| 25 | Error Handling | ☐ |
| 26 | Custom Error Classes | ☐ |
| 27 | Discriminated Unions | ☐ |
| 28 | Global Error Middleware | ☐ |
| 29 | Logging and Monitoring | ☐ |
| 30 | ESLint | ☐ |
| 31 | Prettier | ☐ |
| 32 | Static Analysis | ☐ |
| 33 | Test Coverage | ☐ |
| 34 | CI/CD | ☐ |
| 35 | Real-World Testing Project | ☐ |

---

# PHASE 42 COMPLETED

You have now covered an important part of professional TypeScript development.

You should understand not only how to write TypeScript code, but also how to:

- Verify its correctness.
- Identify bugs.
- Debug application behavior.
- Handle errors safely.
- Maintain code quality.
- Automate testing.
- Prepare applications for production.

## Next Phase: Phase 43

**Advanced TypeScript – Performance, Security, Scalability and Production Best Practices**

Upcoming topics:

1. TypeScript Performance Optimization.
2. Compiler Performance.
3. Memory Management.
4. JavaScript Runtime and TypeScript.
5. Event Loop and Asynchronous Execution.
6. CPU-Bound vs I/O-Bound Operations.
7. Worker Threads.
8. Streams and Backpressure.
9. Type-Safe Environment Variables.
10. Application Configuration.
11. Secure TypeScript Development.
12. Input Validation and Sanitization.
13. Zod with TypeScript.
14. Authentication and Authorization.
15. JWT Security.
16. Secure API Design.
17. SQL Injection Prevention.
18. XSS and CSRF.
19. CORS and Security Headers.
20. Rate Limiting.
21. Production Error Handling.
22. Performance Monitoring.
23. Scalable Architecture.
24. Design Patterns.
25. Production Deployment.
26. Docker with TypeScript.
27. Production Build Optimization.
28. Real-World Production Architecture.

**When you're ready, say: `OK, Phase 43`.**