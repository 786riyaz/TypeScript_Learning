# Phase 51: Advanced TypeScript – Testing, Jest, Vitest, Mocking, Integration Testing, End-to-End Testing and Test-Driven Development

**Level:** Expert / Advanced Software Testing  
**Prerequisites:** TypeScript, JavaScript, Node.js, Express.js, asynchronous programming, modules, databases, and basic backend architecture.

---

# 1. Learning Objectives

In this phase, you will learn how to test production-level TypeScript applications.

By the end of this phase, you should understand:

1. Software testing fundamentals.
2. Different levels and types of testing.
3. Unit testing and integration testing.
4. End-to-end testing.
5. Jest with TypeScript.
6. Vitest with TypeScript.
7. Test suites and test cases.
8. Assertions and matchers.
9. Setup and teardown hooks.
10. Mock functions and mock modules.
11. Spies and fake timers.
12. Testing asynchronous code.
13. Testing Express APIs.
14. Testing controllers, services, and repositories.
15. Testing database operations.
16. Testing authentication and authorization.
17. Testing Redis and external APIs.
18. Code coverage.
19. Test-Driven Development (TDD).
20. Behavior-Driven Development (BDD).
21. Test fixtures and factories.
22. Contract testing.
23. Continuous Integration testing.
24. Production testing strategies.

---

# 2. What Is Software Testing?

Software testing is the process of verifying that an application behaves as expected.

It helps identify bugs, incorrect behavior, security issues, and unexpected failures before software reaches production.

Consider an API:

```typescript
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}
```

Expected behavior:

```typescript
calculateTotal(100, 2); // 200
calculateTotal(50, 3);  // 150
calculateTotal(0, 5);   // 0
```

Testing verifies that the function produces the expected output for different inputs.

## 2.1 Verification vs Validation

| Verification | Validation |
|---|---|
| Are we building the product correctly? | Are we building the correct product? |
| Checks implementation against specifications. | Checks whether the product meets user needs. |
| Includes reviews and static analysis. | Includes functional and acceptance testing. |

## 2.2 Error, Defect, and Failure

These terms are related but different.

- **Error:** A human mistake made during development.
- **Defect (Bug):** A problem in the software caused by an error.
- **Failure:** The software behaves incorrectly when executed.

Example:

A developer writes:

```typescript
function calculateDiscount(price: number, discount: number) {
  return price + discount;
}
```

The intended operation was subtraction.

- Developer mistake: Error.
- Incorrect implementation: Defect.
- Customer receives a higher price: Failure.

---

# 3. Types of Software Testing

Different tests verify different aspects of an application.

## 3.1 Unit Testing

Unit testing verifies a small, isolated piece of code.

Usually, this means testing:

- Functions
- Methods
- Classes
- Individual business logic operations

Example:

```typescript
function add(a: number, b: number): number {
  return a + b;
}
```

Test:

```typescript
expect(add(10, 20)).toBe(30);
```

A unit test should generally execute quickly and avoid external dependencies such as databases and network requests.

## 3.2 Integration Testing

Integration testing verifies whether multiple components work together correctly.

For example:

```text
Express Controller
       |
       v
User Service
       |
       v
User Repository
       |
       v
MySQL Database
```

An integration test might verify whether the application can successfully create a user in a test database.

Unlike a unit test, an integration test may use real infrastructure.

## 3.3 End-to-End Testing (E2E)

E2E testing verifies an application from the user's perspective.

Example:

```text
User opens website
       |
       v
Enters email and password
       |
       v
Clicks Login
       |
       v
Frontend sends API request
       |
       v
Backend validates credentials
       |
       v
Database checks user
       |
       v
User receives authentication token
       |
       v
Dashboard opens
```

E2E tests verify that the complete workflow works.

Common E2E testing tools include:

- Playwright
- Cypress

## 3.4 Other Testing Types

| Testing Type | Purpose |
|---|---|
| Unit Testing | Test individual functions or classes. |
| Integration Testing | Test interactions between components. |
| E2E Testing | Test complete user workflows. |
| Regression Testing | Ensure existing functionality still works after changes. |
| Smoke Testing | Verify critical functionality after a build or deployment. |
| Sanity Testing | Verify a specific change or fix works. |
| Performance Testing | Evaluate application performance. |
| Load Testing | Evaluate behavior under expected traffic. |
| Stress Testing | Evaluate behavior beyond normal capacity. |
| Security Testing | Identify security vulnerabilities. |
| Acceptance Testing | Verify requirements from the user's perspective. |
| Contract Testing | Verify that services follow agreed API contracts. |

---

# 4. Understanding the Testing Pyramid

The testing pyramid describes how testing effort is commonly distributed.

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

### Unit Tests

- Largest number of tests.
- Fast execution.
- Test isolated business logic.
- Usually inexpensive to maintain.

### Integration Tests

- Moderate number of tests.
- Verify component interactions.
- May require databases, Redis, or other services.

### E2E Tests

- Smaller number of tests.
- Verify complete workflows.
- Usually slower and more expensive to maintain.

**Important:** The pyramid is a guideline, not a strict rule. The appropriate test distribution depends on application architecture and risk.

---

# 5. Testing TypeScript Applications

TypeScript introduces an important distinction.

**Type checking and runtime testing are two different activities.**

Consider:

```typescript
function greet(name: string): string {
  return `Hello ${name}`;
}
```

TypeScript checks whether the function follows its declared types.

However, TypeScript does not automatically verify that the function behaves correctly.

For example:

```typescript
function calculateDiscount(price: number): number {
  return price + 100;
}
```

This code is completely valid TypeScript, even if the business requirement was to subtract 100.

Therefore, we need both:

| Tool | Responsibility |
|---|---|
| TypeScript Compiler | Checks types during development/build. |
| Jest/Vitest | Executes runtime tests. |
| ESLint | Detects code quality and potential programming issues. |

Run TypeScript checking:

```bash
npx tsc --noEmit
```

This checks TypeScript errors without generating JavaScript files.

---

# 6. Introduction to Jest

Jest is a JavaScript testing framework that supports TypeScript through appropriate transformation and configuration.

It provides:

- Test runner
- Assertions
- Mock functions
- Spies
- Snapshot testing
- Code coverage
- Setup and teardown hooks

Official documentation: [Jest Documentation](https://jestjs.io/docs/getting-started?utm_source=chatgpt.com)

## 6.1 Install Jest with TypeScript

For a TypeScript Node.js project using a CommonJS-oriented Jest setup:

```bash
npm install --save-dev jest ts-jest @types/jest
```

Initialize Jest configuration:

```bash
npx ts-jest config:init
```

A typical configuration looks like:

```typescript
// jest.config.ts

import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",

  testEnvironment: "node",

  testMatch: [
    "**/__tests__/**/*.test.ts",
    "**/*.test.ts"
  ],

  clearMocks: true,

  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts"
  ]
};

export default config;
```

Configuration depends on your package's module system and the versions of Jest and ts-jest.

Jest projects using native ESM may require additional configuration.

## 6.2 Configure package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "typecheck": "tsc --noEmit"
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

---

# 7. Understanding Test Suites and Test Cases

Jest provides two important functions:

- `describe()`
- `test()` or `it()`

## 7.1 describe()

`describe()` groups related test cases.

```typescript
describe("Calculator", () => {
  // Related tests
});
```

## 7.2 test()

`test()` defines an individual test case.

```typescript
test("should add two numbers", () => {
  expect(10 + 20).toBe(30);
});
```

You can also use `it()`:

```typescript
it("should add two numbers", () => {
  expect(10 + 20).toBe(30);
});
```

Both `test()` and `it()` have the same purpose in Jest.

## 7.3 Complete Example

Create:

```text
src/
  calculator.ts

tests/
  calculator.test.ts
```

**calculator.ts**

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

**calculator.test.ts**

```typescript
import {
  add,
  subtract,
  multiply,
  divide
} from "../src/calculator";

describe("Calculator", () => {

  test("should add two numbers", () => {
    expect(add(10, 20)).toBe(30);
  });

  test("should subtract two numbers", () => {
    expect(subtract(20, 10)).toBe(10);
  });

  test("should multiply two numbers", () => {
    expect(multiply(10, 5)).toBe(50);
  });

  test("should divide two numbers", () => {
    expect(divide(20, 5)).toBe(4);
  });

  test("should throw error when dividing by zero", () => {
    expect(() => divide(10, 0)).toThrow(
      "Cannot divide by zero"
    );
  });

});
```

Run:

```bash
npm test
```

Expected result:

```text
PASS tests/calculator.test.ts

Calculator
  ✓ should add two numbers
  ✓ should subtract two numbers
  ✓ should multiply two numbers
  ✓ should divide two numbers
  ✓ should throw error when dividing by zero
```

---

# 8. Arrange, Act, Assert (AAA Pattern)

AAA is a common structure for writing readable tests.

It divides a test into three stages:

1. Arrange
2. Act
3. Assert

Example:

```typescript
test("should calculate product total", () => {

  // Arrange
  const price = 100;
  const quantity = 5;

  // Act
  const result = price * quantity;

  // Assert
  expect(result).toBe(500);

});
```

### Arrange

Prepare the required test data and dependencies.

### Act

Execute the function or operation being tested.

### Assert

Verify that the result matches expectations.

This pattern helps make tests understandable and maintainable.

---

# 9. Assertions and Matchers

Assertions verify whether the actual result matches the expected result.

Jest provides several matchers.

## 9.1 Equality Matchers

```typescript
expect(10 + 20).toBe(30);
```

`toBe()` checks strict equality using `Object.is()` semantics.

For objects and arrays:

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

Difference:

| Matcher | Purpose |
|---|---|
| `toBe()` | Checks exact value identity using `Object.is()`. |
| `toEqual()` | Recursively compares object and array contents. |
| `toStrictEqual()` | Performs a stricter recursive comparison. |

## 9.2 Truthiness Matchers

```typescript
expect(true).toBeTruthy();

expect(false).toBeFalsy();

expect(null).toBeNull();

expect(undefined).toBeUndefined();

expect(10).toBeDefined();

expect(0).toBeFalsy();
```

Remember:

```typescript
Boolean(0);         // false
Boolean("");        // false
Boolean(null);      // false
Boolean(undefined); // false
Boolean([]);        // true
Boolean({});        // true
```

## 9.3 Numeric Matchers

```typescript
expect(10).toBeGreaterThan(5);

expect(5).toBeLessThan(10);

expect(10).toBeGreaterThanOrEqual(10);

expect(5).toBeLessThanOrEqual(5);
```

## 9.4 String Matchers

```typescript
const message = "Welcome to TypeScript";

expect(message).toContain("TypeScript");

expect(message).toMatch(/Welcome/);
```

## 9.5 Array Matchers

```typescript
const users = ["Ali", "Ahmed", "Riyaz"];

expect(users).toContain("Ahmed");

expect(users).toHaveLength(3);
```

## 9.6 Object Matchers

```typescript
const user = {
  id: 1,
  name: "Ali",
  email: "ali@example.com"
};

expect(user).toHaveProperty("name");

expect(user).toHaveProperty("id", 1);

expect(user).toMatchObject({
  name: "Ali"
});
```

## 9.7 Exception Matchers

```typescript
function getUser() {
  throw new Error("User not found");
}

test("should throw an error", () => {
  expect(() => getUser()).toThrow("User not found");
});
```

For asynchronous errors:

```typescript
async function getUser() {
  throw new Error("User not found");
}

test("should reject with an error", async () => {
  await expect(getUser()).rejects.toThrow("User not found");
});
```

## 9.8 Asynchronous Matchers

For resolved promises:

```typescript
async function getValue(): Promise<number> {
  return 100;
}

test("should return 100", async () => {
  await expect(getValue()).resolves.toBe(100);
});
```

For rejected promises:

```typescript
async function getValue(): Promise<number> {
  throw new Error("Something went wrong");
}

test("should reject", async () => {
  await expect(getValue()).rejects.toThrow(
    "Something went wrong"
  );
});
```

**Important:** Always return or await asynchronous assertions. Otherwise, the test runner might finish before the assertion executes.

---

# 10. Setup and Teardown Hooks

Sometimes tests require common initialization and cleanup operations.

For example:

- Connecting to a test database.
- Creating test records.
- Clearing temporary data.
- Closing database connections.

Jest provides lifecycle hooks.

| Hook | Execution |
|---|---|
| `beforeAll()` | Once before all tests in the relevant scope. |
| `beforeEach()` | Before every test. |
| `afterEach()` | After every test. |
| `afterAll()` | Once after all tests in the relevant scope. |

Example:

```typescript
describe("User Service", () => {

  beforeAll(() => {
    console.log("Initialize test environment");
  });

  beforeEach(() => {
    console.log("Prepare test data");
  });

  afterEach(() => {
    console.log("Clean up test data");
  });

  afterAll(() => {
    console.log("Close test environment");
  });

  test("test one", () => {
    expect(10).toBe(10);
  });

  test("test two", () => {
    expect(20).toBe(20);
  });

});
```

Conceptual execution order:

```text
beforeAll

  beforeEach
  test one
  afterEach

  beforeEach
  test two
  afterEach

afterAll
```

Hooks can also be asynchronous:

```typescript
beforeAll(async () => {
  // Connect to test database
});

afterAll(async () => {
  // Close database connection
});
```

**Best practice:** Avoid shared mutable state between tests. Each test should be independent and repeatable.

---

# 11. Mock Functions

Mocking means replacing a real function or dependency with a controlled implementation during testing.

Why do we need mocking?

Suppose a service sends an email:

```typescript
async function registerUser(email: string) {
  // Save user in database

  // Send welcome email
}
```

You do not want to send an actual email every time you run a unit test.

Instead, mock the email function.

## 11.1 jest.fn()

```typescript
test("should call email function", () => {

  const sendEmail = jest.fn();

  sendEmail("user@example.com");

  expect(sendEmail).toHaveBeenCalled();

});
```

## 11.2 Verify Function Arguments

```typescript
test("should call email with correct address", () => {

  const sendEmail = jest.fn();

  sendEmail("user@example.com");

  expect(sendEmail).toHaveBeenCalledWith(
    "user@example.com"
  );

});
```

## 11.3 Mock Return Value

```typescript
test("should return mocked value", () => {

  const getPrice = jest.fn();

  getPrice.mockReturnValue(500);

  expect(getPrice()).toBe(500);

});
```

## 11.4 Mock Implementation

```typescript
const calculateTax = jest.fn((price: number) => {
  return price * 0.18;
});

expect(calculateTax(1000)).toBe(180);
```

## 11.5 Mock Resolved Promise

```typescript
const fetchUser = jest.fn();

fetchUser.mockResolvedValue({
  id: 1,
  name: "Ali"
});

test("should return mocked user", async () => {

  const user = await fetchUser();

  expect(user.name).toBe("Ali");

});
```

## 11.6 Mock Rejected Promise

```typescript
const fetchUser = jest.fn();

fetchUser.mockRejectedValue(
  new Error("Database unavailable")
);

test("should reject", async () => {

  await expect(fetchUser()).rejects.toThrow(
    "Database unavailable"
  );

});
```

## 11.7 Mock Function Information

Jest provides useful properties:

```typescript
const callback = jest.fn();

callback("Hello");

console.log(callback.mock.calls);

console.log(callback.mock.calls.length);

console.log(callback.mock.lastCall);
```

These allow you to inspect how a mocked function was called.

---

# 12. Clear, Reset, and Restore Mocks

These methods are frequently asked in interviews.

| Method | Behavior |
|---|---|
| `clearAllMocks()` | Clears mock call history and recorded results. |
| `resetAllMocks()` | Clears history and resets mock implementations. |
| `restoreAllMocks()` | Restores original implementations of spies and replaced properties where supported. |

Example:

```typescript
const mockFn = jest.fn(() => 100);

mockFn();

mockFn.mockClear();
```

After `mockClear()`:

- Previous call information is removed.
- The mock implementation remains.

After `mockReset()`:

- Previous call information is removed.
- Mock implementation is reset.

After `mockRestore()`:

- Original implementation is restored for supported spies.

**Important:** `mockRestore()` is especially useful with `jest.spyOn()`. A standalone `jest.fn()` does not have an original implementation to restore.

---

# 13. Spies in Jest

A spy allows you to observe an existing function's behavior.

Unlike a standalone mock, a spy can wrap an existing method.

Example:

```typescript
const calculator = {
  add(a: number, b: number) {
    return a + b;
  }
};

test("should spy on add method", () => {

  const spy = jest.spyOn(calculator, "add");

  const result = calculator.add(10, 20);

  expect(result).toBe(30);

  expect(spy).toHaveBeenCalled();

  expect(spy).toHaveBeenCalledWith(10, 20);

  spy.mockRestore();

});
```

The original function executes unless you provide a different implementation.

You can replace its implementation:

```typescript
const spy = jest.spyOn(calculator, "add");

spy.mockReturnValue(100);

expect(calculator.add(10, 20)).toBe(100);

spy.mockRestore();
```

### Mock vs Spy

| Mock | Spy |
|---|---|
| Creates a controlled replacement function. | Observes an existing function. |
| Can be created using `jest.fn()`. | Commonly created using `jest.spyOn()`. |
| No original implementation is required. | Usually wraps an existing method. |
| Useful for injecting dependencies. | Useful for tracking existing method calls. |

---

# 14. Mocking Modules

Sometimes a function depends on an entire module.

For example:

```typescript
import axios from "axios";
```

You do not want your unit test to make an actual HTTP request.

You can mock the dependency.

Example:

```typescript
import axios from "axios";
import { getUser } from "../src/userService";

jest.mock("axios");

const mockedAxios = jest.mocked(axios);

test("should fetch user", async () => {

  mockedAxios.get.mockResolvedValue({
    data: {
      id: 1,
      name: "Ali"
    }
  });

  const user = await getUser(1);

  expect(user.name).toBe("Ali");

});
```

Service:

```typescript
import axios from "axios";

export async function getUser(id: number) {

  const response = await axios.get(
    `https://api.example.com/users/${id}`
  );

  return response.data;
}
```

### Important Considerations

- Module mocking behavior differs between CommonJS and ESM.
- Jest module mocks are commonly hoisted by its transform system.
- Native ESM mocking can require `jest.unstable_mockModule()` and dynamic imports.
- Avoid mocking every dependency. Excessive mocking can make tests pass even when real components do not work together.

---

# 15. Fake Timers

Sometimes your code uses:

- `setTimeout()`
- `setInterval()`
- Delayed operations
- Debouncing
- Throttling
- Retry mechanisms

Waiting for actual time makes tests slow.

Fake timers allow you to control time.

Example:

```typescript
function delayedMessage(callback: () => void) {
  setTimeout(() => {
    callback();
  }, 5000);
}
```

Test:

```typescript
describe("Delayed Message", () => {

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("should execute after five seconds", () => {

    const callback = jest.fn();

    delayedMessage(callback);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(5000);

    expect(callback).toHaveBeenCalledTimes(1);

  });

});
```

Useful methods:

```typescript
jest.useFakeTimers();

jest.advanceTimersByTime(1000);

jest.runAllTimers();

jest.runOnlyPendingTimers();

jest.clearAllTimers();

jest.useRealTimers();
```

**Important:** Fake timers can interact with promises and microtasks. For complex asynchronous timer logic, use the asynchronous timer APIs provided by your test runner and await them.

---

# 16. Testing Asynchronous TypeScript Code

Modern Node.js applications use asynchronous operations extensively.

For example:

- Database queries
- HTTP requests
- File operations
- Redis operations
- Authentication
- Background jobs

Consider:

```typescript
export async function getUserName(): Promise<string> {
  return "Ali";
}
```

Test:

```typescript
test("should return user name", async () => {

  const result = await getUserName();

  expect(result).toBe("Ali");

});
```

## 16.1 Testing Promise Resolution

```typescript
test("should resolve with user name", async () => {

  await expect(getUserName()).resolves.toBe("Ali");

});
```

## 16.2 Testing Promise Rejection

```typescript
export async function getUser() {
  throw new Error("User not found");
}
```

```typescript
test("should reject when user does not exist", async () => {

  await expect(getUser()).rejects.toThrow(
    "User not found"
  );

});
```

## 16.3 Testing Multiple Async Operations

```typescript
async function getUsers() {
  return [
    { id: 1, name: "Ali" },
    { id: 2, name: "Ahmed" }
  ];
}
```

```typescript
test("should return two users", async () => {

  const users = await getUsers();

  expect(users).toHaveLength(2);

  expect(users[0].name).toBe("Ali");

});
```

**Best practice:** Always test both successful and failed asynchronous operations.

---

# 17. Introduction to Vitest

Vitest is a modern testing framework designed to work particularly well with Vite projects.

It also supports standalone Node.js TypeScript projects.

Vitest provides:

- Test runner
- Assertions
- Mocking
- Spies
- Fake timers
- Code coverage
- Watch mode

Official documentation: [Vitest Documentation](https://vitest.dev/guide/?utm_source=chatgpt.com)

## 17.1 Install Vitest

```bash
npm install --save-dev vitest
```

For a basic Node.js TypeScript project, Vite itself is not necessarily required.

## 17.2 Configure Vitest

Create:

```typescript
// vitest.config.ts

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",

    include: [
      "tests/**/*.test.ts",
      "src/**/*.test.ts"
    ],

    clearMocks: true
  }
});
```

## 17.3 Configure package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

Run:

```bash
npm test
```

For a single non-watch run:

```bash
npm run test:run
```

## 17.4 Create a Vitest Test

```typescript
// calculator.test.ts

import {
  describe,
  test,
  expect
} from "vitest";

function add(a: number, b: number) {
  return a + b;
}

describe("Calculator", () => {

  test("should add two numbers", () => {

    expect(add(10, 20)).toBe(30);

  });

});
```

The testing structure is very similar to Jest.

## 17.5 Mocking with Vitest

Jest:

```typescript
const mockFn = jest.fn();

mockFn.mockReturnValue(100);
```

Vitest:

```typescript
import { vi } from "vitest";

const mockFn = vi.fn();

mockFn.mockReturnValue(100);
```

## 17.6 Spying with Vitest

```typescript
import { vi, expect, test } from "vitest";

const calculator = {
  add(a: number, b: number) {
    return a + b;
  }
};

test("should spy on calculator", () => {

  const spy = vi.spyOn(calculator, "add");

  calculator.add(10, 20);

  expect(spy).toHaveBeenCalledWith(10, 20);

  spy.mockRestore();

});
```

## 17.7 Mocking Modules with Vitest

```typescript
import { vi, test, expect } from "vitest";

import axios from "axios";

import { getUser } from "../src/userService";

vi.mock("axios");

const mockedAxios = vi.mocked(axios);

test("should fetch user", async () => {

  mockedAxios.get.mockResolvedValue({
    data: {
      id: 1,
      name: "Ali"
    }
  });

  const user = await getUser(1);

  expect(user.name).toBe("Ali");

});
```

Vitest also has module-mocking and hoisting behavior that should be understood when using ESM.

---

# 18. Jest vs Vitest

| Feature | Jest | Vitest |
|---|---|---|
| TypeScript | Supported with configuration | Supported |
| Unit Testing | Yes | Yes |
| Integration Testing | Yes | Yes |
| Mocking | Yes | Yes |
| Spies | Yes | Yes |
| Fake Timers | Yes | Yes |
| Code Coverage | Yes | Yes |
| Watch Mode | Yes | Yes |
| Vite Integration | Requires separate integration | Native |
| Ecosystem | Mature and widely adopted | Modern and growing |

### Which One Should You Learn?

Both are valuable.

**Choose Jest when:**

- Working with an existing Jest codebase.
- Joining a project that already uses Jest.
- Working with a mature testing ecosystem.

**Choose Vitest when:**

- Starting a modern project.
- Using Vite.
- Wanting a testing framework with a similar API to Jest.

For a TypeScript developer, understanding both is useful. You do not need to use both in the same project.

---

# 19. Testing Service Layers

In a well-structured backend application, business logic should be separated from database operations.

Consider:

```text
src/
  controllers/
    userController.ts

  services/
    userService.ts

  repositories/
    userRepository.ts

  routes/
    userRoutes.ts
```

The service should not need to know how the database is implemented.

## 19.1 Define a User Type

```typescript
export interface User {
  id: number;
  name: string;
  email: string;
}
```

## 19.2 Define Repository Interface

```typescript
import { User } from "../types/user";

export interface IUserRepository {
  findById(id: number): Promise<User | null>;

  create(
    data: Omit<User, "id">
  ): Promise<User>;
}
```

## 19.3 Create User Service

```typescript
import { IUserRepository } from "../repositories/IUserRepository";

export class UserService {

  constructor(
    private userRepository: IUserRepository
  ) {}

  async getUser(id: number) {

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

}
```

Notice that the service depends on an interface, not a specific database implementation.

## 19.4 Unit Test the User Service

```typescript
import { UserService } from "../src/services/userService";

import { IUserRepository } from "../src/repositories/IUserRepository";

describe("UserService", () => {

  let userService: UserService;

  let mockRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {

    mockRepository = {
      findById: jest.fn(),
      create: jest.fn()
    };

    userService = new UserService(mockRepository);

  });

  test("should return user when found", async () => {

    mockRepository.findById.mockResolvedValue({
      id: 1,
      name: "Ali",
      email: "ali@example.com"
    });

    const user = await userService.getUser(1);

    expect(user.id).toBe(1);

    expect(mockRepository.findById).toHaveBeenCalledWith(1);

  });

  test("should throw error when user does not exist", async () => {

    mockRepository.findById.mockResolvedValue(null);

    await expect(
      userService.getUser(100)
    ).rejects.toThrow("User not found");

  });

});
```

### What Are We Testing?

We are testing:

1. Whether the service calls the repository.
2. Whether the service returns the correct user.
3. Whether the service handles missing users.
4. Whether the service propagates errors correctly.

We are not testing MySQL or MongoDB here.

This is a **unit test** because the repository dependency is mocked.

---

# 20. Testing Express APIs

Testing Express APIs is an important backend skill.

Consider an API:

```text
GET /api/users/1
```

Expected response:

```json
{
  "id": 1,
  "name": "Ali",
  "email": "ali@example.com"
}
```

We want to test:

- HTTP status.
- Response body.
- Headers.
- Validation.
- Error responses.
- Authentication.

A useful library is Supertest.

Official documentation: [Supertest GitHub Repository](https://github.com/ladjs/supertest?utm_source=chatgpt.com)

## 20.1 Install Supertest

```bash
npm install --save-dev supertest @types/supertest
```

## 20.2 Separate App from Server

This is an important architectural practice.

**app.ts**

```typescript
import express from "express";

const app = express();

app.use(express.json());

app.get("/api/users/:id", (req, res) => {

  const id = Number(req.params.id);

  res.status(200).json({
    id,
    name: "Ali",
    email: "ali@example.com"
  });

});

export default app;
```

**server.ts**

```typescript
import app from "./app";

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Why separate these files?

Because tests should be able to import the Express application without starting a real network server.

## 20.3 Write API Integration Test

```typescript
import request from "supertest";

import app from "../src/app";

describe("GET /api/users/:id", () => {

  test("should return user details", async () => {

    const response = await request(app)
      .get("/api/users/1");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      id: 1,
      name: "Ali",
      email: "ali@example.com"
    });

  });

});
```

This test sends an HTTP request through the Express application and verifies its response.

Supertest can do this without manually binding your app to a port.

---

# 21. Testing Express Controllers

Controllers handle HTTP-related responsibilities.

Example:

```typescript
import { Request, Response } from "express";

export function getUser(
  req: Request,
  res: Response
) {

  const id = Number(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Invalid user ID"
    });
  }

  return res.status(200).json({
    id,
    name: "Ali"
  });

}
```

You can test this controller through an Express application and Supertest.

This is generally preferable when you want to verify actual HTTP behavior.

You can also test a controller directly with mocked `Request` and `Response` objects, but direct tests may become coupled to Express implementation details.

**Recommendation:** Use Supertest for controller and HTTP behavior. Use direct unit tests only when they provide a clear benefit.

---

# 22. Testing Express Middleware

Middleware performs operations between receiving a request and executing a route handler.

Examples:

- Authentication
- Authorization
- Logging
- Validation
- Rate limiting
- Error handling

Consider an authentication middleware:

```typescript
import { Request, Response, NextFunction } from "express";

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  next();

}
```

Testing it through Supertest:

```typescript
import express from "express";
import request from "supertest";
import { authenticate } from "../src/middleware/authenticate";

const app = express();

app.get(
  "/protected",
  authenticate,
  (req, res) => {
    res.status(200).json({
      message: "Access granted"
    });
  }
);

describe("Authentication Middleware", () => {

  test("should reject request without token", async () => {

    const response = await request(app)
      .get("/protected");

    expect(response.status).toBe(401);

  });

  test("should allow request with token header", async () => {

    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer test-token");

    expect(response.status).toBe(200);

  });

});
```

**Important:** This example only checks whether a header exists. It does not verify the token's signature, expiration, or validity. Production authentication middleware must perform those checks.

---

# 23. Testing Authentication and Authorization

Authentication and authorization are different concepts.

| Authentication | Authorization |
|---|---|
| Determines who the user is. | Determines what the user can access. |
| Usually verifies credentials or tokens. | Usually checks roles and permissions. |
| Example: Valid JWT. | Example: Admin-only route. |

You should test these scenarios:

### Authentication Tests

1. Missing token.
2. Invalid token.
3. Expired token.
4. Invalid token signature.
5. Malformed token.
6. Valid token.
7. Missing authentication header.

### Authorization Tests

1. Admin can access admin resources.
2. Normal user cannot access admin resources.
3. User can access their own profile.
4. User cannot access another user's private data without permission.
5. Insufficient permissions return the correct response.

Example:

```typescript
type Role = "admin" | "user";

function canDeleteUser(role: Role): boolean {
  return role === "admin";
}
```

Test:

```typescript
describe("Authorization", () => {

  test("admin should be allowed to delete users", () => {
    expect(canDeleteUser("admin")).toBe(true);
  });

  test("normal user should not be allowed", () => {
    expect(canDeleteUser("user")).toBe(false);
  });

});
```

This is a simple unit test of the authorization rule. Real middleware should also be tested through HTTP requests.

---

# 24. Database Integration Testing

Unit testing a service with a mocked repository does not prove that the database implementation works.

For that, we need integration testing.

Consider:

```text
User Service
      |
      v
User Repository
      |
      v
MySQL Database
```

An integration test should verify that these components work together.

## 24.1 Database Testing Strategies

There are two common approaches.

### Approach 1: Mock the Database

Useful for unit testing.

```typescript
const mockRepository = {
  findById: jest.fn()
};
```

Advantages:

- Fast.
- No database required.
- Easy to control responses.

Disadvantages:

- Does not test actual SQL queries.
- Does not verify database constraints.
- Does not verify real ORM behavior.

### Approach 2: Use a Real Test Database

Useful for integration testing.

```text
Application
    |
    v
Repository
    |
    v
Test Database
```

Advantages:

- Verifies actual queries.
- Verifies database constraints.
- Verifies relationships.
- Verifies migrations and transactions.

Disadvantages:

- Slower.
- Requires database setup.
- Requires test data cleanup.

**Best practice:** Use mocks for unit tests and a dedicated test database for database integration tests.

Never run destructive test operations against your production database.

---

# 25. Testing Prisma Applications

Suppose your application uses Prisma ORM.

A repository might look like:

```typescript
import { PrismaClient } from "@prisma/client";

export class UserRepository {

  constructor(
    private prisma: PrismaClient
  ) {}

  async findById(id: number) {

    return this.prisma.user.findUnique({
      where: { id }
    });

  }

}
```

There are two testing approaches.

### Unit Testing

Mock the repository when testing a service.

```typescript
const mockRepository = {
  findById: jest.fn()
};
```

This avoids depending on Prisma internals.

### Integration Testing

Use a real isolated test database.

Typical process:

```text
Start Test Database
        |
        v
Apply Migrations
        |
        v
Create Prisma Client
        |
        v
Run Integration Tests
        |
        v
Clean Test Data
        |
        v
Disconnect Prisma
```

Example setup:

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

A real integration test can verify:

```typescript
test("should create a user", async () => {

  const user = await prisma.user.create({
    data: {
      name: "Ali",
      email: "ali@example.com"
    }
  });

  expect(user.id).toBeDefined();

  expect(user.name).toBe("Ali");

});
```

You must prepare and clean the test database appropriately.

For reliable tests, use unique test data and ensure cleanup even when assertions fail.

---

# 26. Testing Sequelize Applications

If you use Sequelize with MySQL, integration testing should use a separate test database.

Example:

```typescript
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.TEST_DATABASE_URL!,
  {
    logging: false
  }
);

beforeAll(async () => {
  await sequelize.authenticate();
});

afterAll(async () => {
  await sequelize.close();
});
```

Testing should follow this structure:

```text
Connect to Test Database
          |
          v
Run Migrations
          |
          v
Execute Tests
          |
          v
Clean Test Records
          |
          v
Close Connection
```

For more complex applications, transactions can isolate test data.

However, transaction-based cleanup must account for how the application obtains its database connections. A transaction created by the test will not automatically contain queries executed on unrelated connections.

---

# 27. Testing Redis

Suppose your application uses Redis for caching.

You should test:

- Cache insertion.
- Cache retrieval.
- Cache expiration.
- Cache invalidation.
- Cache miss behavior.
- Redis connection errors.

There are two strategies.

### Unit Testing

Mock Redis operations.

```typescript
const mockRedis = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn()
};
```

### Integration Testing

Use a separate Redis instance or isolated test database.

Important practices:

- Use unique key prefixes.
- Clean keys after tests.
- Avoid sharing mutable data.
- Test expiration behavior.
- Never flush a shared or production Redis instance.

Example:

```typescript
test("should store and retrieve cache value", async () => {

  const key = `test:user:${Date.now()}`;

  await redis.set(key, JSON.stringify({
    id: 1,
    name: "Ali"
  }));

  const result = await redis.get(key);

  expect(JSON.parse(result!)).toEqual({
    id: 1,
    name: "Ali"
  });

  await redis.del(key);

});
```

This is a Redis integration test because it communicates with a real Redis instance.

---

# 28. Mocking External APIs

Applications frequently integrate with external APIs.

Examples:

- Payment gateways
- Email services
- SMS providers
- Weather APIs
- AI APIs
- Third-party authentication services

Consider:

```typescript
export async function getWeather(city: string) {

  const response = await fetch(
    `https://api.example.com/weather?city=${city}`
  );

  if (!response.ok) {
    throw new Error("Weather API failed");
  }

  return response.json();

}
```

You generally should not depend on a live external service during ordinary unit tests.

Instead, mock the external boundary.

For example:

```typescript
test("should return weather information", async () => {

  const mockFetch = jest.fn().mockResolvedValue({
    ok: true,

    json: async () => ({
      city: "Ahmedabad",
      temperature: 30
    })
  });

  const response = await mockFetch();

  const data = await response.json();

  expect(data.temperature).toBe(30);

});
```

This example tests the mock itself rather than the `getWeather()` function. A complete test should inject the fetch dependency into the function or mock the actual module/global fetch used by the service.

A more testable implementation:

```typescript
type FetchFunction = typeof fetch;

export async function getWeather(
  city: string,
  fetcher: FetchFunction = fetch
) {

  const response = await fetcher(
    `https://api.example.com/weather?city=${city}`
  );

  if (!response.ok) {
    throw new Error("Weather API failed");
  }

  return response.json();

}
```

Test:

```typescript
test("should fetch weather successfully", async () => {

  const mockFetcher = jest.fn().mockResolvedValue({
    ok: true,

    json: async () => ({
      city: "Ahmedabad",
      temperature: 30
    })
  });

  const result = await getWeather(
    "Ahmedabad",
    mockFetcher
  );

  expect(result.temperature).toBe(30);

  expect(mockFetcher).toHaveBeenCalled();

});
```

This is an example of **dependency injection** making testing easier.

For more realistic HTTP mocking, tools such as Mock Service Worker (MSW) or Nock can be used.

---

# 29. Code Coverage

Code coverage measures how much of your code is executed during testing.

It helps identify untested areas.

Common coverage metrics:

| Metric | Meaning |
|---|---|
| Statement Coverage | Percentage of executable statements executed. |
| Branch Coverage | Percentage of decision branches executed. |
| Function Coverage | Percentage of functions executed. |
| Line Coverage | Percentage of executable lines executed. |

Consider:

```typescript
function calculateDiscount(price: number, isPremium: boolean) {

  if (isPremium) {
    return price * 0.2;
  }

  return price * 0.1;

}
```

There are two branches:

```text
if (isPremium)
     /       \
  true       false
   |           |
  20%         10%
```

If your test only executes the premium branch, branch coverage is incomplete.

You should test both:

```typescript
test("premium user receives 20% discount", () => {
  expect(calculateDiscount(1000, true)).toBe(200);
});

test("normal user receives 10% discount", () => {
  expect(calculateDiscount(1000, false)).toBe(100);
});
```

## 29.1 Generate Coverage Reports

Jest:

```bash
npm run test:coverage
```

Vitest:

```bash
npm install --save-dev @vitest/coverage-v8
```

Then:

```bash
npx vitest run --coverage
```

Coverage reports commonly contain:

```text
File             | % Stmts | % Branch | % Funcs | % Lines
-----------------|---------|----------|---------|--------
userService.ts   | 95      | 90       | 100     | 95
authService.ts   | 80      | 70       | 90      | 80
```

## 29.2 Coverage Thresholds

You can define minimum coverage requirements.

Jest example:

```typescript
const config = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};

export default config;
```

Coverage thresholds can help maintain consistency.

However:

**100% code coverage does not guarantee bug-free software.**

Coverage measures execution, not whether your assertions are meaningful.

---

# 30. Test-Driven Development (TDD)

TDD stands for Test-Driven Development.

It is a software development approach in which tests are written before implementing the actual functionality.

TDD follows three steps:

```text
       RED
        |
        v
       GREEN
        |
        v
      REFACTOR
        |
        v
       RED
```

## 30.1 Red Phase

Write a test for functionality that does not exist yet.

Example:

```typescript
test("should calculate total price", () => {

  expect(calculateTotal(100, 2)).toBe(200);

});
```

Initially, this test fails because `calculateTotal()` does not exist.

That is the Red phase.

## 30.2 Green Phase

Write the minimum implementation required to pass the test.

```typescript
function calculateTotal(price: number, quantity: number) {
  return price * quantity;
}
```

Now the test passes.

That is the Green phase.

## 30.3 Refactor Phase

Improve the code without changing its behavior.

For example:

```typescript
export function calculateTotal(
  price: number,
  quantity: number
): number {

  if (price < 0 || quantity < 0) {
    throw new Error("Invalid input");
  }

  return price * quantity;

}
```

Add tests for invalid input as well.

That is the Refactor phase.

### TDD Advantages

- Encourages testable architecture.
- Helps identify requirements early.
- Reduces regression risk.
- Improves confidence when refactoring.
- Encourages small development iterations.

### TDD Limitations

- Requires discipline.
- Initial development may feel slower.
- Tests can become brittle if poorly designed.
- Not every task benefits equally from strict TDD.

---

# 31. Behavior-Driven Development (BDD)

BDD stands for Behavior-Driven Development.

It focuses on describing how software should behave from the perspective of users and business requirements.

BDD commonly uses:

```text
Given
When
Then
```

Example:

**Requirement:** A registered user should be able to log in using valid credentials.

```text
Given:
A registered user exists.

When:
The user enters valid email and password.

Then:
The application should authenticate the user.
```

Another example:

```text
Feature: User Login

Scenario: Login with valid credentials

Given the user has an existing account

When the user submits valid credentials

Then the application should return an authentication token
```

Popular BDD tools include:

- Cucumber
- SpecFlow (for .NET)
- Behave (for Python)

### TDD vs BDD

| TDD | BDD |
|---|---|
| Focuses on tests and implementation. | Focuses on expected behavior. |
| Commonly used by developers. | Encourages collaboration between developers, testers, and business stakeholders. |
| Red → Green → Refactor. | Given → When → Then. |
| Often describes code-level behavior. | Often describes business-level behavior. |

BDD is not simply a testing tool. It is also a collaboration and requirements-discovery approach.

---

# 32. Test Fixtures and Factories

Testing often requires sample data.

For example:

```typescript
const user = {
  id: 1,
  name: "Ali",
  email: "ali@example.com"
};
```

This is test data.

A **fixture** is predefined data used by tests.

A **factory** is a reusable function that generates test data.

## 32.1 Test Fixture

```typescript
export const testUser = {
  id: 1,
  name: "Ali",
  email: "ali@example.com"
};
```

Usage:

```typescript
test("should return user name", () => {

  expect(testUser.name).toBe("Ali");

});
```

## 32.2 Test Factory

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function createUser(
  overrides: Partial<User> = {}
): User {

  return {
    id: 1,
    name: "Default User",
    email: "default@example.com",
    ...overrides
  };

}
```

Usage:

```typescript
const user1 = createUser();

const user2 = createUser({
  id: 2,
  name: "Ahmed"
});
```

### Why Factories Are Useful

- Reduce duplicated test data.
- Make test cases readable.
- Allow controlled customization.
- Simplify complex object creation.

**Best practice:** Avoid sharing mutable test objects between tests. Generate fresh data when necessary.

---

# 33. Contract Testing

Contract testing verifies whether two systems follow an agreed communication contract.

Suppose:

```text
Frontend
   |
   v
Backend API
```

The frontend expects:

```json
{
  "id": 1,
  "name": "Ali",
  "email": "ali@example.com"
}
```

But the backend returns:

```json
{
  "userId": 1,
  "fullName": "Ali",
  "emailAddress": "ali@example.com"
}
```

The response structure has changed.

Even if the backend works correctly internally, the frontend may break.

Contract testing helps detect this kind of compatibility issue.

Common contract elements:

- HTTP methods.
- Endpoint paths.
- Request schemas.
- Response schemas.
- Status codes.
- Headers.
- Error formats.

Tools such as Pact can help implement consumer-driven contract testing.

Official documentation: [Pact Documentation](https://docs.pact.io/?utm_source=chatgpt.com)

Contract testing is particularly useful in microservice architectures.

---

# 34. Continuous Integration Testing

Continuous Integration (CI) automatically runs checks whenever developers push code or create pull requests.

Typical CI pipeline:

```text
Developer Pushes Code
         |
         v
Install Dependencies
         |
         v
Lint Code
         |
         v
TypeScript Type Check
         |
         v
Run Unit Tests
         |
         v
Run Integration Tests
         |
         v
Generate Coverage
         |
         v
Build Application
         |
         v
Pipeline Success / Failure
```

A common CI platform is GitHub Actions.

## 34.1 Example GitHub Actions Workflow

Create:

```text
.github/
  workflows/
    test.yml
```

**test.yml**

```yaml
name: TypeScript Tests

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
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run typecheck

      - name: Run tests
        run: npm run test:run

      - name: Build application
        run: npm run build
```

This example assumes your project defines `typecheck`, `test:run`, and `build` scripts.

For Jest, replace the test command with the appropriate Jest command.

### Why CI Testing Matters

- Detects bugs before merging.
- Prevents broken code from reaching production.
- Enforces consistent quality checks.
- Helps teams collaborate safely.
- Reduces manual testing effort.

**Important:** Never put production secrets or database credentials directly into workflow files. Use appropriately scoped CI secrets.

---

# 35. Production Testing Strategies

Testing does not stop after deployment.

Production systems also require continuous verification.

## 35.1 Smoke Testing

Smoke tests verify critical functionality after deployment.

Example:

```text
Deployment Complete
        |
        v
Check /health
        |
        v
Check Login API
        |
        v
Check Important API
        |
        v
Deployment Healthy?
```

Example health check:

```typescript
app.get("/health", (req, res) => {

  res.status(200).json({
    status: "OK"
  });

});
```

## 35.2 Health Checks

Health checks help monitoring systems determine whether an application is operational.

Common endpoints:

```text
GET /health
GET /ready
```

The distinction:

- **Liveness:** Is the application process alive?
- **Readiness:** Is the application ready to receive traffic?

A readiness check may verify database connectivity or other critical dependencies.

## 35.3 Load Testing

Load testing evaluates application performance under expected traffic.

For example:

```text
100 concurrent users
500 concurrent users
1,000 concurrent users
```

It helps identify:

- Slow database queries.
- Memory problems.
- CPU bottlenecks.
- API latency.
- Connection pool saturation.

Common tools:

- k6
- JMeter
- Artillery

## 35.4 Canary Testing

Canary deployment gradually releases a new version to a small portion of users.

Example:

```text
Existing Version: 90% Traffic
New Version:      10% Traffic
```

Monitor:

- Error rates.
- Response times.
- Resource utilization.
- Business metrics.

If the new version behaves incorrectly, traffic can be redirected to the previous version.

## 35.5 Synthetic Monitoring

Synthetic monitoring periodically executes predefined user journeys.

Example:

```text
Open Login Page
      |
      v
Submit Test Credentials
      |
      v
Open Dashboard
      |
      v
Verify Dashboard Content
```

This helps identify failures before users report them.

---

# 36. Complete Practical Project – User Management API Testing

Now let's combine the concepts into one practical project.

We will create a User Management API with:

- TypeScript
- Node.js
- Express.js
- Jest
- Supertest
- Repository abstraction
- Unit testing
- API integration testing

## 36.1 Project Structure

```text
user-management-api/
│
├── src/
│   ├── app.ts
│   ├── server.ts
│   │
│   ├── types/
│   │   └── user.ts
│   │
│   ├── repositories/
│   │   └── IUserRepository.ts
│   │
│   ├── services/
│   │   └── userService.ts
│   │
│   ├── controllers/
│   │   └── userController.ts
│   │
│   └── routes/
│       └── userRoutes.ts
│
├── tests/
│   ├── userService.test.ts
│   └── userApi.test.ts
│
├── jest.config.ts
├── tsconfig.json
└── package.json
```

## 36.2 User Interface

**src/types/user.ts**

```typescript
export interface User {
  id: number;
  name: string;
  email: string;
}
```

## 36.3 Repository Interface

**src/repositories/IUserRepository.ts**

```typescript
import { User } from "../types/user";

export interface IUserRepository {

  findById(id: number): Promise<User | null>;

  findAll(): Promise<User[]>;

  create(data: Omit<User, "id">): Promise<User>;

}
```

## 36.4 User Service

**src/services/userService.ts**

```typescript
import { IUserRepository } from "../repositories/IUserRepository";

export class UserService {

  constructor(
    private userRepository: IUserRepository
  ) {}

  async getUser(id: number) {

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid user ID");
    }

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async getAllUsers() {

    return this.userRepository.findAll();

  }

  async createUser(
    data: {
      name: string;
      email: string;
    }
  ) {

    if (!data.name || !data.email) {
      throw new Error("Name and email are required");
    }

    return this.userRepository.create(data);

  }

}
```

## 36.5 In-Memory Repository

For this example, we will use an in-memory repository instead of a real database.

**src/repositories/userRepository.ts**

```typescript
import { IUserRepository } from "./IUserRepository";

import { User } from "../types/user";

export class UserRepository implements IUserRepository {

  private users: User[] = [];

  private nextId = 1;

  async findById(id: number): Promise<User | null> {

    return this.users.find(user => user.id === id) ?? null;

  }

  async findAll(): Promise<User[]> {

    return this.users;

  }

  async create(
    data: Omit<User, "id">
  ): Promise<User> {

    const user: User = {
      id: this.nextId++,
      ...data
    };

    this.users.push(user);

    return user;
  }

}
```

## 36.6 Controller

**src/controllers/userController.ts**

```typescript
import { Request, Response } from "express";

import { UserService } from "../services/userService";

export class UserController {

  constructor(
    private userService: UserService
  ) {}

  getUser = async (req: Request, res: Response) => {

    try {

      const id = Number(req.params.id);

      const user = await this.userService.getUser(id);

      return res.status(200).json(user);

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Internal server error";

      const status =
        message === "User not found" ||
        message === "Invalid user ID"
          ? 404
          : 500;

      return res.status(status).json({
        message
      });

    }

  };

  getAllUsers = async (req: Request, res: Response) => {

    try {

      const users = await this.userService.getAllUsers();

      return res.status(200).json(users);

    } catch {

      return res.status(500).json({
        message: "Internal server error"
      });

    }

  };

  createUser = async (req: Request, res: Response) => {

    try {

      const user = await this.userService.createUser(req.body);

      return res.status(201).json(user);

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Internal server error";

      return res.status(400).json({
        message
      });

    }

  };

}
```

This is a simplified demonstration. In a production API, use dedicated validation, centralized error handling, and an appropriate error classification strategy. An invalid ID should normally return HTTP 400 rather than 404.

## 36.7 Routes

**src/routes/userRoutes.ts**

```typescript
import { Router } from "express";

import { UserController } from "../controllers/userController";

export function createUserRoutes(
  controller: UserController
) {

  const router = Router();

  router.get("/:id", controller.getUser);

  router.get("/", controller.getAllUsers);

  router.post("/", controller.createUser);

  return router;

}
```

## 36.8 Express Application

**src/app.ts**

```typescript
import express from "express";

import { UserRepository } from "./repositories/userRepository";

import { UserService } from "./services/userService";

import { UserController } from "./controllers/userController";

import { createUserRoutes } from "./routes/userRoutes";

const app = express();

app.use(express.json());

const repository = new UserRepository();

const service = new UserService(repository);

const controller = new UserController(service);

app.use("/api/users", createUserRoutes(controller));

export default app;
```

## 36.9 Server

**src/server.ts**

```typescript
import app from "./app";

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 36.10 Unit Tests

**tests/userService.test.ts**

```typescript
import { UserService } from "../src/services/userService";

import { IUserRepository } from "../src/repositories/IUserRepository";

describe("UserService", () => {

  let service: UserService;

  let repository: jest.Mocked<IUserRepository>;

  beforeEach(() => {

    repository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn()
    };

    service = new UserService(repository);

  });

  test("should return user by ID", async () => {

    repository.findById.mockResolvedValue({
      id: 1,
      name: "Ali",
      email: "ali@example.com"
    });

    const user = await service.getUser(1);

    expect(user.name).toBe("Ali");

    expect(repository.findById).toHaveBeenCalledWith(1);

  });

  test("should throw when user is not found", async () => {

    repository.findById.mockResolvedValue(null);

    await expect(
      service.getUser(100)
    ).rejects.toThrow("User not found");

  });

  test("should reject invalid user ID", async () => {

    await expect(
      service.getUser(-1)
    ).rejects.toThrow("Invalid user ID");

    expect(repository.findById).not.toHaveBeenCalled();

  });

  test("should create a user", async () => {

    repository.create.mockResolvedValue({
      id: 1,
      name: "Ali",
      email: "ali@example.com"
    });

    const user = await service.createUser({
      name: "Ali",
      email: "ali@example.com"
    });

    expect(user.id).toBe(1);

    expect(repository.create).toHaveBeenCalled();

  });

});
```

## 36.11 API Integration Tests

**tests/userApi.test.ts**

```typescript
import request from "supertest";

import app from "../src/app";

describe("User API", () => {

  test("should create a user", async () => {

    const response = await request(app)
      .post("/api/users")
      .send({
        name: "Ali",
        email: "ali@example.com"
      });

    expect(response.status).toBe(201);

    expect(response.body).toMatchObject({
      name: "Ali",
      email: "ali@example.com"
    });

  });

  test("should return all users", async () => {

    const response = await request(app)
      .get("/api/users");

    expect(response.status).toBe(200);

    expect(Array.isArray(response.body)).toBe(true);

  });

  test("should return user by ID", async () => {

    const createResponse = await request(app)
      .post("/api/users")
      .send({
        name: "Ahmed",
        email: "ahmed@example.com"
      });

    const id = createResponse.body.id;

    const response = await request(app)
      .get(`/api/users/${id}`);

    expect(response.status).toBe(200);

    expect(response.body.name).toBe("Ahmed");

  });

});
```

**Important:** This example uses an in-memory repository initialized when the app is imported. Tests share that state, and their execution order should not be relied upon. A stronger production-ready setup would create the application through a factory and inject a fresh repository for each test.

---

# 37. Common Testing Mistakes

| Mistake | Why It Is a Problem | Better Approach |
|---|---|---|
| Testing only successful cases | Failure scenarios remain untested. | Test success and failure paths. |
| Using production database | Can damage real data. | Use isolated test databases. |
| Mocking everything | Real integration problems remain hidden. | Mock only appropriate boundaries. |
| Not awaiting promises | Tests may finish too early. | Use `async/await` or return promises. |
| Sharing mutable test data | Tests become order-dependent. | Create fresh fixtures. |
| Testing implementation details | Refactoring breaks tests unnecessarily. | Test observable behavior. |
| Ignoring cleanup | Connections and data leak. | Use teardown hooks. |
| Overusing snapshots | Large snapshots become difficult to review. | Prefer focused assertions. |
| Depending on live APIs | Tests become unreliable. | Mock external dependencies. |
| Assuming coverage means quality | Code can execute without meaningful assertions. | Test behavior and edge cases. |
| Running tests sequentially to hide state problems | Tests are not independent. | Isolate state and dependencies. |
| Ignoring type checking | Runtime tests do not replace static checking. | Run `tsc --noEmit`. |

---

# 38. Important Testing Best Practices

For professional TypeScript development:

1. Write small, independent tests.
2. Follow Arrange-Act-Assert.
3. Test edge cases and error scenarios.
4. Use dependency injection to improve testability.
5. Separate application initialization from server startup.
6. Use mocks for unit testing external dependencies.
7. Use real infrastructure for important integration tests.
8. Keep test data isolated.
9. Avoid production credentials and production databases.
10. Run type checking separately from tests.
11. Include tests in CI pipelines.
12. Monitor test execution time.
13. Avoid tests that depend on execution order.
14. Restore mocks and fake timers after use.
15. Measure coverage, but prioritize meaningful assertions.

---

# 39. Interview Questions and Answers

## Basic Questions

**Q1. What is software testing?**

Software testing is the process of verifying that an application behaves according to its requirements and identifying defects before release.

**Q2. What is unit testing?**

Unit testing verifies individual functions, methods, or classes in isolation.

**Q3. What is integration testing?**

Integration testing verifies whether multiple components work together correctly.

**Q4. What is end-to-end testing?**

E2E testing verifies complete application workflows from the user's perspective.

**Q5. What is the testing pyramid?**

It is a testing strategy that generally recommends many unit tests, fewer integration tests, and a smaller number of E2E tests.

**Q6. What is Jest?**

Jest is a JavaScript testing framework providing test execution, assertions, mocking, spies, and coverage.

**Q7. What is Vitest?**

Vitest is a modern JavaScript testing framework with strong Vite integration and TypeScript support.

**Q8. What is Supertest?**

Supertest is a Node.js library used to test HTTP servers and Express applications.

**Q9. What is an assertion?**

An assertion verifies whether an actual result matches an expected condition.

**Q10. What is a test suite?**

A test suite is a collection of related test cases, commonly grouped using `describe()`.

## Intermediate Questions

**Q11. What is the difference between `test()` and `describe()`?**

`test()` defines an individual test case, while `describe()` groups related test cases.

**Q12. What is the AAA pattern?**

AAA stands for Arrange, Act, Assert.

**Q13. What is mocking?**

Mocking replaces a dependency with a controlled implementation during testing.

**Q14. What is a spy?**

A spy observes an existing function and tracks its calls, arguments, and behavior.

**Q15. What is the difference between a mock and a spy?**

A mock creates a controlled replacement, while a spy generally wraps an existing method to observe its behavior.

**Q16. What is `jest.fn()`?**

It creates a mock function.

**Q17. What is `jest.spyOn()`?**

It creates a spy around an existing object method or property.

**Q18. What is `mockResolvedValue()`?**

It configures a mock function to return a resolved promise.

**Q19. What is `mockRejectedValue()`?**

It configures a mock function to return a rejected promise.

**Q20. What is the difference between `clearAllMocks()` and `resetAllMocks()`?**

`clearAllMocks()` clears recorded mock information. `resetAllMocks()` also resets mock implementations.

**Q21. What is the purpose of `restoreAllMocks()`?**

It restores original implementations of supported spies and replaced properties.

**Q22. What are fake timers?**

Fake timers allow tests to control timer-related operations without waiting for real time.

**Q23. Why should asynchronous tests use `await`?**

To ensure the test runner waits for the asynchronous operation and its assertions to finish.

**Q24. What is test coverage?**

It measures how much of the source code is executed during testing.

**Q25. Does 100% code coverage guarantee bug-free software?**

No. Coverage measures execution, not the quality or correctness of assertions.

## Advanced Questions

**Q26. What is TDD?**

Test-Driven Development is a process where tests are written before implementation.

**Q27. Explain the Red-Green-Refactor cycle.**

Red: Write a failing test. Green: Implement the minimum code to pass it. Refactor: Improve the implementation while keeping tests passing.

**Q28. What is BDD?**

Behavior-Driven Development describes application behavior using business-readable scenarios, often following Given-When-Then.

**Q29. What is contract testing?**

Contract testing verifies whether communicating systems follow agreed request and response contracts.

**Q30. Why should we separate `app.ts` and `server.ts`?**

It allows tests to import the Express application without starting a network listener.

**Q31. Why should we mock repositories in service unit tests?**

To test business logic independently of database implementation.

**Q32. Should database repositories always be mocked?**

No. Repository integration tests should use a real isolated database when verifying actual database behavior.

**Q33. How do you test database operations?**

Use a dedicated test database, apply migrations, execute tests, clean test data, and close connections.

**Q34. How do you test external APIs?**

Mock the external HTTP boundary in unit tests and use controlled integration environments when necessary.

**Q35. What is regression testing?**

Regression testing checks whether existing functionality still works after code changes.

**Q36. What is smoke testing?**

Smoke testing verifies that the application's most important functionality works after a build or deployment.

**Q37. What is the difference between authentication and authorization testing?**

Authentication testing verifies identity. Authorization testing verifies access permissions.

**Q38. Why is dependency injection useful for testing?**

It allows dependencies to be replaced with mocks, fakes, or alternative implementations.

**Q39. What is a test fixture?**

A fixture is predefined test data used by one or more test cases.

**Q40. What is a test factory?**

A factory is a reusable function that generates test data, often with customizable properties.

**Q41. What is branch coverage?**

It measures how many possible branches of conditional logic are executed.

**Q42. What is the difference between Jest and Vitest?**

Both support testing, assertions, and mocking. Vitest integrates naturally with Vite, while Jest has a mature and widely established ecosystem.

**Q43. Why should tests be independent?**

Independent tests can run in any order and produce consistent results.

**Q44. What is a flaky test?**

A flaky test sometimes passes and sometimes fails without relevant code changes.

**Q45. How can flaky tests be reduced?**

Control timing, isolate shared state, avoid unreliable network dependencies, and use deterministic test data.

**Q46. What is canary testing?**

It evaluates a new application version by exposing it to a small portion of traffic before a wider rollout.

**Q47. What is synthetic monitoring?**

It periodically executes predefined workflows to detect application failures.

**Q48. What is the difference between liveness and readiness checks?**

Liveness indicates whether the process is alive. Readiness indicates whether it can accept traffic.

**Q49. Why is TypeScript type checking not a replacement for runtime testing?**

Type checking verifies static type constraints, while runtime testing verifies actual application behavior.

**Q50. What should a TypeScript CI pipeline include?**

Dependency installation, linting, type checking, unit tests, integration tests where appropriate, coverage reporting, and application builds.

---

# 40. Practical Exercises

Complete these exercises to strengthen your testing knowledge.

## Beginner Level

1. Write unit tests for addition, subtraction, multiplication, and division.
2. Test a function that checks whether a number is even.
3. Test a function that reverses a string.
4. Test a function that calculates discounts.
5. Test an email validation function.
6. Write tests for array filtering and sorting.
7. Test a function that throws an error for invalid input.
8. Practice `toBe()`, `toEqual()`, `toContain()`, and `toThrow()`.

## Intermediate Level

9. Write tests for a UserService.
10. Mock a repository interface.
11. Mock an asynchronous API request.
12. Write tests using `beforeEach()` and `afterEach()`.
13. Test a function using fake timers.
14. Test an Express GET endpoint using Supertest.
15. Test an Express POST endpoint.
16. Test authentication middleware.
17. Test authorization middleware.
18. Generate code coverage reports.
19. Write tests for an application using Sequelize.
20. Write tests for an application using Prisma.

## Advanced Level

21. Build a complete User Management API with unit tests.
22. Add database integration tests using MySQL.
23. Add Redis integration tests.
24. Implement TDD for a payment calculation module.
25. Create test factories for complex entities.
26. Test JWT expiration and invalid signatures.
27. Write contract tests for a REST API.
28. Create a CI pipeline using GitHub Actions.
29. Add E2E tests using Playwright.
30. Build a complete testing strategy for a production-level Node.js application.

---

# 41. Phase 51 Completion Checklist

You should be able to check each item after understanding and practicing it.

| Topic | Status |
|---|---|
| Software Testing Fundamentals | ☐ |
| Unit Testing | ☐ |
| Integration Testing | ☐ |
| End-to-End Testing | ☐ |
| Testing Pyramid | ☐ |
| Jest Configuration | ☐ |
| Vitest Configuration | ☐ |
| Test Suites and Test Cases | ☐ |
| Assertions and Matchers | ☐ |
| Setup and Teardown | ☐ |
| Mock Functions | ☐ |
| Mock Modules | ☐ |
| Spies | ☐ |
| Fake Timers | ☐ |
| Async Testing | ☐ |
| Express API Testing | ☐ |
| Supertest | ☐ |
| Controller Testing | ☐ |
| Service Testing | ☐ |
| Repository Testing | ☐ |
| Middleware Testing | ☐ |
| Authentication Testing | ☐ |
| Authorization Testing | ☐ |
| Prisma Testing | ☐ |
| Sequelize Testing | ☐ |
| Redis Testing | ☐ |
| External API Mocking | ☐ |
| Code Coverage | ☐ |
| TDD | ☐ |
| BDD | ☐ |
| Test Fixtures and Factories | ☐ |
| Contract Testing | ☐ |
| CI Testing | ☐ |
| Production Testing | ☐ |

---

# 42. What Comes Next?

You have now covered the testing side of professional TypeScript development.

The next phase will focus on designing maintainable, scalable, and well-structured applications.

## Phase 52: Advanced TypeScript – Clean Architecture, SOLID Principles, Design Patterns, Dependency Injection and Scalable Project Structure

Upcoming topics:

1. Software Architecture Fundamentals.
2. Monolithic vs Microservices Architecture.
3. Layered Architecture.
4. Clean Architecture.
5. Hexagonal Architecture.
6. SOLID Principles.
7. Single Responsibility Principle.
8. Open/Closed Principle.
9. Liskov Substitution Principle.
10. Interface Segregation Principle.
11. Dependency Inversion Principle.
12. Dependency Injection.
13. Inversion of Control.
14. Repository Pattern.
15. Service Layer Pattern.
16. Factory Pattern.
17. Singleton Pattern.
18. Strategy Pattern.
19. Observer Pattern.
20. Adapter Pattern.
21. Decorator Pattern.
22. Builder Pattern.
23. Command Pattern.
24. Middleware Pattern.
25. Domain-Driven Design Fundamentals.
26. DTOs and Data Mapping.
27. Application and Domain Layers.
28. Dependency Management.
29. Scalable TypeScript Folder Structures.
30. Production-Level Architecture.

**When you're ready, say: `OK, Phase 52`.**