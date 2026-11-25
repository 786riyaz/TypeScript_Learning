# Phase 58: Advanced TypeScript – Testing, Test-Driven Development (TDD), Jest, Vitest, Unit Testing, Integration Testing, API Testing, Mocking, Contract Testing and Test Automation

**Level:** Expert / Advanced Software Engineering  
**Prerequisites:** TypeScript, JavaScript, Node.js, Express.js, REST APIs, databases, OOP, SOLID principles, Dependency Injection and Clean Architecture.

---

# 1. Learning Objectives

By the end of this phase, you will understand how to:

1. Understand software testing fundamentals.
2. Differentiate manual and automated testing.
3. Understand the testing pyramid.
4. Write unit tests using Jest and Vitest.
5. Implement Test-Driven Development (TDD).
6. Write integration tests.
7. Test REST APIs using Supertest.
8. Mock dependencies, modules and functions.
9. Test asynchronous TypeScript code.
10. Test Express middleware and authentication.
11. Test database operations.
12. Understand code coverage.
13. Implement contract testing.
14. Automate tests using CI/CD pipelines.
15. Build a professional testing architecture for TypeScript applications.

---

# 2. What Is Software Testing?

Software testing is the process of evaluating an application to verify that it behaves as expected.

The primary purpose is to identify defects and ensure software quality.

Consider an Expense Tracker application.

Requirements:

- Users can register.
- Users can log in.
- Users can create expenses.
- Users can update expenses.
- Users can delete expenses.
- Users can generate reports.

How do you know these features work correctly?

You test them.

For example:

```typescript
function calculateTotal(expenses: number[]): number {
    return expenses.reduce(
        (total, expense) => total + expense,
        0
    );
}

console.log(calculateTotal([100, 200, 300]));
```

Expected output:

```text
600
```

But what happens when the array is empty?

```typescript
console.log(calculateTotal([]));
```

Expected output:

```text
0
```

Testing verifies these expected behaviors.

## 2.1 Why Is Testing Important?

| Benefit | Explanation |
|---|---|
| Bug Detection | Identifies defects before production |
| Reliability | Ensures consistent application behavior |
| Maintainability | Makes future modifications safer |
| Regression Prevention | Detects when new changes break existing functionality |
| Documentation | Tests demonstrate expected behavior |
| Refactoring Safety | Allows developers to improve code with confidence |
| Security | Helps detect authorization and validation problems |

## 2.2 What Is a Bug?

A bug is an error or defect that causes software to behave incorrectly or unexpectedly.

Example:

```typescript
function calculateDiscount(
    price: number,
    percentage: number
): number {
    return price - percentage;
}
```

Expected:

```text
Price = 1000
Discount = 10%

Final Price = 900
```

Actual:

```text
1000 - 10 = 990
```

The implementation is incorrect.

Correct implementation:

```typescript
function calculateDiscount(
    price: number,
    percentage: number
): number {
    return price - (price * percentage / 100);
}
```

---

# 3. Manual Testing vs Automated Testing

There are two major approaches to testing.

## 3.1 Manual Testing

Manual testing means a human tester executes test scenarios without relying on automated test scripts.

Example:

1. Open the Expense Tracker.
2. Navigate to the login page.
3. Enter an email.
4. Enter a password.
5. Click Login.
6. Verify that the dashboard opens.

### Advantages

- Useful for exploratory testing.
- Helps evaluate user experience.
- Requires less initial automation setup.
- Useful for checking visual behavior.

### Disadvantages

- Time-consuming.
- Repetitive.
- Prone to human error.
- Difficult to repeat consistently at scale.

## 3.2 Automated Testing

Automated testing uses scripts and testing tools to execute test cases.

Example:

```typescript
describe("Login", () => {
    test("should return successful login response", async () => {
        const result = {
            success: true,
            message: "Login successful"
        };

        expect(result.success).toBe(true);
    });
});
```

A test runner executes the test and reports whether it passes.

### Advantages

- Fast repeated execution.
- Consistent results.
- Suitable for CI/CD.
- Helps prevent regression bugs.
- Reduces repetitive manual work.

### Disadvantages

- Initial setup takes time.
- Tests require maintenance.
- Poorly designed tests can become brittle.
- Automated tests do not automatically guarantee good test coverage or quality.

## 3.3 Manual vs Automated Testing

| Feature | Manual Testing | Automated Testing |
|---|---|---|
| Execution | Human | Script/tool |
| Speed | Usually slower | Usually faster for repeated checks |
| Repetition | Requires repeated effort | Easily repeatable |
| Exploratory testing | Excellent | Limited |
| Regression testing | Time-consuming | Well suited |
| Initial setup | Usually low | Can be significant |
| CI/CD integration | Limited | Excellent |

**Professional recommendation:** Use both. Automated tests handle repeatable verification, while manual and exploratory testing help discover usability and unexpected behavioral issues.

---

# 4. Types of Software Testing

Software testing is divided into several categories.

Important categories include:

1. Unit Testing.
2. Integration Testing.
3. System Testing.
4. End-to-End Testing.
5. Regression Testing.
6. Smoke Testing.
7. Sanity Testing.
8. Performance Testing.
9. Security Testing.
10. Acceptance Testing.

Let's understand each.

## 4.1 Unit Testing

Unit testing verifies a small, isolated unit of code.

A unit might be:

- A function.
- A class method.
- A class.
- A business rule.

Example:

```typescript
function add(a: number, b: number): number {
    return a + b;
}
```

Unit test:

```typescript
test("should add two numbers", () => {
    expect(add(10, 20)).toBe(30);
});
```

The test checks only the `add()` function.

It does not require a database or HTTP server.

## 4.2 Integration Testing

Integration testing verifies whether multiple components work correctly together.

Example:

```text
ExpenseService
      |
      v
ExpenseRepository
      |
      v
MySQL Database
```

An integration test might verify that:

1. The service receives an expense.
2. The repository executes a database operation.
3. The database stores the record.
4. The saved record can be retrieved.

Unlike a unit test, this test may use a real test database.

## 4.3 System Testing

System testing evaluates the complete application as an integrated system.

Example:

- Start the backend.
- Start the frontend.
- Connect the database.
- Test major application workflows.

## 4.4 End-to-End Testing (E2E)

E2E testing verifies complete user workflows from the user's perspective.

Example:

```text
User opens application
        |
        v
Registers account
        |
        v
Logs in
        |
        v
Creates expense
        |
        v
Views expense list
        |
        v
Logs out
```

E2E tests often use browser automation tools such as:

- [Playwright](https://playwright.dev/?utm_source=chatgpt.com)
- [Cypress](https://www.cypress.io/?utm_source=chatgpt.com)

## 4.5 Regression Testing

Regression testing checks whether existing functionality still works after code changes.

Example:

You modify the payment calculation logic.

You should verify that:

- Existing payment methods still work.
- Discount calculations remain correct.
- Order totals are still correct.
- Refund calculations have not broken.

## 4.6 Smoke Testing

Smoke testing checks whether the most important functionality works after a new build or deployment.

Example:

- Server starts.
- Database connects.
- Login endpoint responds.
- Main dashboard loads.
- Critical API endpoints are available.

## 4.7 Sanity Testing

Sanity testing is a focused check of a particular area after a small change or bug fix.

Example:

A bug in expense deletion was fixed.

You test:

- Expense deletion.
- Related expense listing.
- Any directly affected behavior.

## 4.8 Performance Testing

Performance testing evaluates how an application behaves under different workloads.

Common measurements:

- Response time.
- Throughput.
- Requests per second.
- CPU usage.
- Memory usage.
- Concurrent users.

Tools include:

- [k6](https://k6.io/?utm_source=chatgpt.com)
- [Apache JMeter](https://jmeter.apache.org/?utm_source=chatgpt.com)

## 4.9 Security Testing

Security testing checks for vulnerabilities.

Examples:

- SQL injection.
- Cross-site scripting (XSS).
- Broken authentication.
- Broken access control.
- Insecure password storage.
- Unauthorized data access.

## 4.10 Acceptance Testing

Acceptance testing determines whether software satisfies business requirements.

It can involve:

- Business stakeholders.
- Product owners.
- Clients.
- End users.

### Testing Types Summary

| Testing Type | Main Purpose |
|---|---|
| Unit | Test individual units |
| Integration | Test component interactions |
| System | Test the complete integrated system |
| E2E | Test complete user workflows |
| Regression | Ensure existing features still work |
| Smoke | Verify critical functionality |
| Sanity | Verify a focused change |
| Performance | Measure speed and capacity |
| Security | Identify vulnerabilities |
| Acceptance | Verify business requirements |

---

# 5. Testing Pyramid

The Testing Pyramid describes how automated tests should generally be distributed.



It has three main levels.

## 5.1 Unit Tests – Bottom Layer

Unit tests should generally form the largest part of your automated test suite.

Characteristics:

- Fast.
- Isolated.
- Easy to execute.
- Focused on individual units.

Example:

```typescript
expect(calculateTotal([100, 200])).toBe(300);
```

## 5.2 Integration Tests – Middle Layer

Integration tests verify interactions between components.

Examples:

- Service and repository.
- Repository and database.
- API and authentication middleware.
- Application and external service adapter.

## 5.3 E2E Tests – Top Layer

E2E tests verify complete workflows.

They are generally:

- Slower.
- More expensive to maintain.
- More dependent on external infrastructure.
- Valuable for critical user journeys.

### Recommended Distribution

There is no universal fixed percentage, but a common starting point is:

| Test Type | Illustrative Distribution |
|---|---:|
| Unit Tests | 60–70% |
| Integration Tests | 20–30% |
| E2E Tests | 5–10% |

These are guidelines, not mandatory targets.

**Important:** Do not write unnecessary unit tests just to increase their count. The objective is meaningful confidence in application behavior.

---

# 6. Introduction to Testing Frameworks

A testing framework provides tools to organize, execute, and evaluate tests.

Popular JavaScript and TypeScript testing tools include:

| Tool | Purpose |
|---|---|
| Jest | JavaScript/TypeScript test framework |
| Vitest | Modern test framework with Vite integration |
| Mocha | Test framework |
| Chai | Assertion library |
| Sinon | Stubs, spies and mocks |
| Supertest | HTTP API testing |
| Playwright | Browser automation and E2E testing |
| Cypress | Browser automation and E2E testing |

In this phase, we will focus primarily on Jest and Vitest.

---

# 7. Jest Fundamentals

Jest is a popular JavaScript testing framework.

Official documentation:

[Jest Documentation](https://jestjs.io/docs/getting-started?utm_source=chatgpt.com)

Jest provides:

- Test execution.
- Assertions.
- Mock functions.
- Spies.
- Module mocking.
- Code coverage.
- Setup and teardown.
- Snapshot testing.

## 7.1 Installing Jest with TypeScript

For a TypeScript Node.js project:

```bash
npm install --save-dev jest ts-jest @types/jest typescript
```

Initialize Jest configuration:

```bash
npx ts-jest config:init
```

This creates a Jest configuration file.

A typical configuration might look like:

```typescript
import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: [
        "**/*.test.ts",
        "**/*.spec.ts"
    ],
    clearMocks: true
};

export default config;
```

## 7.2 Configure package.json

```json
{
    "scripts": {
        "test": "jest",
        "test:watch": "jest --watch",
        "test:coverage": "jest --coverage"
    }
}
```

Run:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

Coverage:

```bash
npm run test:coverage
```

## 7.3 Your First Jest Test

Create:

```text
src/
├── calculator.ts
└── calculator.test.ts
```

`calculator.ts`

```typescript
export function add(a: number, b: number): number {
    return a + b;
}

export function subtract(a: number, b: number): number {
    return a - b;
}
```

`calculator.test.ts`

```typescript
import {
    add,
    subtract
} from "./calculator";

describe("Calculator", () => {
    test("should add two numbers", () => {
        expect(add(10, 20)).toBe(30);
    });

    test("should subtract two numbers", () => {
        expect(subtract(20, 10)).toBe(10);
    });
});
```

Run:

```bash
npm test
```

Expected result:

```text
PASS src/calculator.test.ts

Calculator
  ✓ should add two numbers
  ✓ should subtract two numbers
```

---

# 8. Test Suites and Test Cases

Two fundamental concepts in testing are:

1. Test Suite.
2. Test Case.

## 8.1 Test Suite

A test suite groups related tests.

In Jest:

```typescript
describe("User Service", () => {
    // Related tests go here.
});
```

`describe()` creates a test grouping.

## 8.2 Test Case

A test case verifies one specific behavior.

```typescript
test("should create a user", () => {
    // Test implementation.
});
```

Jest also supports:

```typescript
it("should create a user", () => {
    // Test implementation.
});
```

`test()` and `it()` are functionally equivalent in Jest.

## 8.3 Nested Test Suites

```typescript
describe("User Service", () => {
    describe("createUser", () => {
        test("should create a valid user", () => {});

        test("should reject invalid email", () => {});
    });

    describe("deleteUser", () => {
        test("should delete an existing user", () => {});
    });
});
```

This organization becomes useful when an application has many test cases.

---

# 9. AAA Pattern – Arrange, Act, Assert

AAA is a common structure for writing readable tests.

It contains three steps.

| Step | Meaning |
|---|---|
| Arrange | Prepare test data and dependencies |
| Act | Execute the operation |
| Assert | Verify the expected result |

Example:

```typescript
function multiply(a: number, b: number): number {
    return a * b;
}
```

Test:

```typescript
test("should multiply two numbers", () => {
    // Arrange
    const a = 10;
    const b = 20;

    // Act
    const result = multiply(a, b);

    // Assert
    expect(result).toBe(200);
});
```

AAA makes tests easier to understand and maintain.

---

# 10. Jest Assertions and Matchers

Assertions verify whether actual behavior matches expected behavior.

Jest provides many matchers.

## 10.1 toBe()

Checks primitive values and object identity.

```typescript
expect(10).toBe(10);

expect("Hello").toBe("Hello");
```

## 10.2 toEqual()

Checks deep equality.

```typescript
const user = {
    name: "Ali",
    age: 25
};

expect(user).toEqual({
    name: "Ali",
    age: 25
});
```

Difference:

```typescript
const obj1 = { name: "Ali" };
const obj2 = { name: "Ali" };

expect(obj1).toEqual(obj2); // Pass

// expect(obj1).toBe(obj2); // Fail
```

The two objects have equal values but are different references.

## 10.3 toBeTruthy()

```typescript
expect(true).toBeTruthy();

expect("Hello").toBeTruthy();

expect(100).toBeTruthy();
```

## 10.4 toBeFalsy()

```typescript
expect(false).toBeFalsy();

expect(0).toBeFalsy();

expect("").toBeFalsy();

expect(null).toBeFalsy();
```

## 10.5 toBeNull()

```typescript
expect(null).toBeNull();
```

## 10.6 toBeUndefined()

```typescript
let value;

expect(value).toBeUndefined();
```

## 10.7 toContain()

```typescript
const names = ["Ali", "Ahmed", "Rizwan"];

expect(names).toContain("Ali");
```

## 10.8 toHaveLength()

```typescript
const users = ["Ali", "Ahmed"];

expect(users).toHaveLength(2);
```

## 10.9 toBeGreaterThan()

```typescript
expect(100).toBeGreaterThan(50);
```

## 10.10 toBeLessThan()

```typescript
expect(10).toBeLessThan(20);
```

## 10.11 toMatch()

```typescript
expect("ali@example.com").toMatch(/@example\.com$/);
```

## 10.12 toThrow()

```typescript
function divide(a: number, b: number): number {
    if (b === 0) {
        throw new Error("Cannot divide by zero");
    }

    return a / b;
}
```

Test:

```typescript
test("should throw error when dividing by zero", () => {
    expect(() => divide(10, 0))
        .toThrow("Cannot divide by zero");
});
```

### Common Jest Matchers

| Matcher | Purpose |
|---|---|
| `toBe()` | Strict equality |
| `toEqual()` | Deep equality |
| `toStrictEqual()` | Deep equality with stricter object checks |
| `toBeTruthy()` | Truthy value |
| `toBeFalsy()` | Falsy value |
| `toBeNull()` | Null |
| `toBeUndefined()` | Undefined |
| `toContain()` | Array/string contains value |
| `toHaveLength()` | Checks length |
| `toMatch()` | String/regex match |
| `toThrow()` | Checks thrown error |
| `toHaveBeenCalled()` | Checks mock invocation |
| `toHaveBeenCalledWith()` | Checks invocation arguments |

---

# 11. Setup and Teardown

Sometimes tests need preparation before execution and cleanup afterward.

For example:

- Connect to a test database.
- Create test records.
- Clear test records.
- Close database connections.

Jest provides lifecycle hooks.

## 11.1 beforeEach()

Runs before every test in the relevant scope.

```typescript
let count = 0;

beforeEach(() => {
    count = 0;
});

test("first test", () => {
    count++;

    expect(count).toBe(1);
});

test("second test", () => {
    count++;

    expect(count).toBe(1);
});
```

## 11.2 afterEach()

Runs after every test.

```typescript
afterEach(() => {
    console.log("Test completed");
});
```

## 11.3 beforeAll()

Runs once before the tests in its scope.

```typescript
beforeAll(async () => {
    console.log("Connecting to test database");
});
```

## 11.4 afterAll()

Runs once after the tests in its scope.

```typescript
afterAll(async () => {
    console.log("Closing test database connection");
});
```

### Comparison

| Hook | Execution |
|---|---|
| beforeEach | Before every test |
| afterEach | After every test |
| beforeAll | Once before the relevant tests |
| afterAll | Once after the relevant tests |

**Important:** The scope of lifecycle hooks matters. Hooks inside a nested `describe()` block apply to that block's tests.

---

# 12. Test-Driven Development (TDD)

TDD stands for Test-Driven Development.

It is a software development approach in which developers write tests before implementing the corresponding functionality.

The central workflow is called:

**Red → Green → Refactor**



## 12.1 Red Phase

Write a test for functionality that does not exist yet.

Example:

```typescript
test("should calculate discount", () => {
    expect(calculateDiscount(1000, 10)).toBe(900);
});
```

If `calculateDiscount()` does not exist, the test fails.

This is Red.

## 12.2 Green Phase

Implement the minimum code required to make the test pass.

```typescript
function calculateDiscount(
    price: number,
    percentage: number
): number {
    return price - (price * percentage / 100);
}
```

Run the test again.

It should pass.

This is Green.

## 12.3 Refactor Phase

Improve the code while preserving its behavior.

For example:

```typescript
function calculateDiscount(
    price: number,
    percentage: number
): number {
    if (price < 0 || percentage < 0 || percentage > 100) {
        throw new Error("Invalid discount parameters");
    }

    const discount = price * percentage / 100;

    return price - discount;
}
```

Run the tests again.

They should continue to pass.

This is Refactor.

### TDD Workflow

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
Refactor implementation
        |
        v
Run tests again
        |
        v
      REPEAT
```

## 12.4 Advantages of TDD

- Encourages testable code.
- Clarifies expected behavior.
- Helps detect defects early.
- Supports safer refactoring.
- Reduces unnecessary implementation.

## 12.5 Limitations of TDD

- Requires discipline.
- Can initially slow development.
- Tests can be poorly designed.
- Not every activity is naturally test-first.
- UI exploration and certain integration tasks may need different approaches.

**Important:** TDD is a development methodology, not a testing framework. You can practice TDD using Jest, Vitest, or other test runners.

---

# 13. Behavior-Driven Development (BDD)

BDD stands for Behavior-Driven Development.

It focuses on describing application behavior using language understandable to developers, testers, and business stakeholders.

BDD often uses a Given-When-Then structure.

## 13.1 Given-When-Then

| Section | Meaning |
|---|---|
| Given | Initial condition |
| When | Action performed |
| Then | Expected result |

Example:

```text
Feature: Expense Creation

Scenario: Create a valid expense

Given the user is authenticated

When the user submits an expense
with title "Groceries" and amount 500

Then the expense should be created successfully
```

## 13.2 BDD vs TDD

| TDD | BDD |
|---|---|
| Focuses on tests and implementation behavior | Focuses on expected business behavior |
| Often developer-oriented | Encourages collaboration with stakeholders |
| Red-Green-Refactor | Given-When-Then is common |
| Usually implemented with unit tests | Can include acceptance and integration tests |

Popular BDD tools include:

- [Cucumber](https://cucumber.io/?utm_source=chatgpt.com)
- [Playwright BDD integrations and examples](https://playwright.dev/docs/test-annotations?utm_source=chatgpt.com)

---

# 14. Vitest Fundamentals

Vitest is a modern testing framework with strong integration into the Vite ecosystem.

Official documentation:

[Vitest Documentation](https://vitest.dev/guide/?utm_source=chatgpt.com)

Vitest supports:

- Test execution.
- Assertions.
- Mocking.
- Spying.
- Code coverage.
- Watch mode.
- Setup files.

Its API is largely compatible with Jest.

## 14.1 Installing Vitest

```bash
npm install --save-dev vitest typescript
```

For a TypeScript Node.js application, you can start with:

```json
{
    "scripts": {
        "test": "vitest",
        "test:run": "vitest run",
        "test:coverage": "vitest run --coverage"
    }
}
```

If you use the coverage provider, install the appropriate coverage package for your Vitest version, commonly:

```bash
npm install --save-dev @vitest/coverage-v8
```

## 14.2 Vitest Configuration

Create `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        include: [
            "**/*.test.ts",
            "**/*.spec.ts"
        ],
        clearMocks: true
    }
});
```

## 14.3 Your First Vitest Test

`calculator.ts`

```typescript
export function add(a: number, b: number): number {
    return a + b;
}
```

`calculator.test.ts`

```typescript
import {
    describe,
    test,
    expect
} from "vitest";

import { add } from "./calculator";

describe("Calculator", () => {
    test("should add two numbers", () => {
        expect(add(10, 20)).toBe(30);
    });
});
```

Run:

```bash
npm run test
```

Run once:

```bash
npm run test:run
```

## 14.4 Jest vs Vitest

| Feature | Jest | Vitest |
|---|---|---|
| Language | JavaScript/TypeScript | JavaScript/TypeScript |
| Test runner | Yes | Yes |
| Assertions | Built in | Built in |
| Mocking | Built in | Built in |
| TypeScript | Requires suitable transformation/configuration | Works well with TypeScript projects |
| Vite integration | Not native | Excellent |
| Watch mode | Yes | Yes |
| Code coverage | Yes | Yes |
| Ecosystem | Mature and extensive | Modern and growing |

### Which Should You Learn?

Learn both at a conceptual level.

For a new Vite-based application, Vitest is a natural choice.

For an existing Jest-based Node.js project, Jest is a strong choice.

For Next.js and other frameworks, check the framework's current testing guidance before choosing the setup.

---

# 15. Mocking Fundamentals

Mocking is an important concept in automated testing.

**Definition:**

Mocking means replacing a real dependency with a controlled test implementation.

Why is it necessary?

Imagine testing a UserService that sends emails.

```text
UserService
     |
     v
Email Provider
     |
     v
External SMTP Server
```

You do not necessarily want to send a real email every time you run a unit test.

Instead, replace the email provider with a mock.

## 15.1 What Is a Mock Function?

A mock function is a test function that records information about how it was called.

Example with Jest:

```typescript
const mockFunction = jest.fn();

mockFunction();

expect(mockFunction).toHaveBeenCalled();
```

With Vitest:

```typescript
import { vi } from "vitest";

const mockFunction = vi.fn();

mockFunction();

expect(mockFunction).toHaveBeenCalled();
```

## 15.2 Mock Function with Return Value

Jest:

```typescript
const mockFunction = jest.fn();

mockFunction.mockReturnValue(100);

expect(mockFunction()).toBe(100);
```

Vitest:

```typescript
const mockFunction = vi.fn();

mockFunction.mockReturnValue(100);

expect(mockFunction()).toBe(100);
```

## 15.3 Mock Function with Arguments

```typescript
const mockFunction = jest.fn();

mockFunction("Ali", 25);

expect(mockFunction).toHaveBeenCalledWith("Ali", 25);
```

## 15.4 Mock Function with Implementation

```typescript
const mockFunction = jest.fn((a: number, b: number) => {
    return a + b;
});

expect(mockFunction(10, 20)).toBe(30);
```

---

# 16. Test Doubles: Dummy, Stub, Fake, Mock and Spy

These terms describe different kinds of test doubles.

A test double is an object or function used in place of a real dependency during testing.

## 16.1 Dummy

A Dummy object is passed to a function but is not actually used.

Example:

```typescript
interface Logger {
    log(message: string): void;
}

const dummyLogger: Logger = {
    log() {}
};
```

## 16.2 Stub

A Stub provides predefined responses.

```typescript
interface UserRepository {
    findById(id: string): Promise<User | null>;
}

const stubRepository: UserRepository = {
    async findById() {
        return {
            id: "1",
            name: "Ali",
            email: "ali@example.com"
        };
    }
};
```

## 16.3 Fake

A Fake is a simplified working implementation.

Example:

```typescript
class FakeUserRepository implements UserRepository {
    private users: User[] = [];

    async findById(id: string): Promise<User | null> {
        return this.users.find(user => user.id === id) ?? null;
    }

    async save(user: User): Promise<void> {
        this.users.push(user);
    }
}
```

This behaves like a repository but stores data in memory.

## 16.4 Mock

A Mock is configured with expected interactions.

```typescript
const sendEmail = jest.fn();

sendEmail("Welcome");

expect(sendEmail).toHaveBeenCalledWith("Welcome");
```

The test verifies that a particular interaction occurred.

## 16.5 Spy

A Spy observes calls to an existing function, often while preserving its original behavior.

```typescript
const calculator = {
    add(a: number, b: number): number {
        return a + b;
    }
};

const spy = jest.spyOn(calculator, "add");

calculator.add(10, 20);

expect(spy).toHaveBeenCalledWith(10, 20);

spy.mockRestore();
```

### Comparison

| Test Double | Main Purpose |
|---|---|
| Dummy | Satisfies a dependency requirement |
| Stub | Returns predefined responses |
| Fake | Provides simplified working behavior |
| Mock | Verifies expected interactions |
| Spy | Observes function calls |

**Remember:** A mock and a spy are not always interchangeable. A mock commonly verifies interactions, while a spy observes calls to an existing method.

---

# 17. Testing Asynchronous Functions

Node.js applications frequently use asynchronous operations.

Examples:

- Database queries.
- HTTP requests.
- File operations.
- Authentication.
- Email delivery.

Testing these functions requires handling Promises correctly.

## 17.1 Testing a Promise

Function:

```typescript
function getUser(): Promise<string> {
    return Promise.resolve("Ali");
}
```

Jest test:

```typescript
test("should return user name", async () => {
    const result = await getUser();

    expect(result).toBe("Ali");
});
```

## 17.2 Using .resolves

```typescript
test("should resolve user name", async () => {
    await expect(getUser()).resolves.toBe("Ali");
});
```

## 17.3 Testing Promise Rejection

Function:

```typescript
function getUser(): Promise<string> {
    return Promise.reject(
        new Error("User not found")
    );
}
```

Test:

```typescript
test("should reject when user is missing", async () => {
    await expect(getUser()).rejects.toThrow(
        "User not found"
    );
});
```

## 17.4 Common Mistake

Incorrect:

```typescript
test("should return user", () => {
    getUser().then(result => {
        expect(result).toBe("Ali");
    });
});
```

The test does not return or await the Promise.

The test runner might finish before the assertion executes.

Correct:

```typescript
test("should return user", async () => {
    const result = await getUser();

    expect(result).toBe("Ali");
});
```

---

# 18. Testing TypeScript Classes

Let's test a simple ExpenseService.

`Expense.ts`

```typescript
export interface Expense {
    id: string;
    title: string;
    amount: number;
}
```

`ExpenseService.ts`

```typescript
import { Expense } from "./Expense";

export class ExpenseService {
    calculateTotal(expenses: Expense[]): number {
        return expenses.reduce(
            (total, expense) => total + expense.amount,
            0
        );
    }

    getExpenseById(
        expenses: Expense[],
        id: string
    ): Expense | undefined {
        return expenses.find(expense => expense.id === id);
    }
}
```

Test:

```typescript
import { describe, test, expect } from "vitest";

import { ExpenseService } from "./ExpenseService";

describe("ExpenseService", () => {
    const service = new ExpenseService();

    const expenses = [
        {
            id: "1",
            title: "Groceries",
            amount: 500
        },
        {
            id: "2",
            title: "Transport",
            amount: 200
        }
    ];

    test("should calculate total expenses", () => {
        const total = service.calculateTotal(expenses);

        expect(total).toBe(700);
    });

    test("should find expense by ID", () => {
        const expense = service.getExpenseById(
            expenses,
            "1"
        );

        expect(expense).toEqual({
            id: "1",
            title: "Groceries",
            amount: 500
        });
    });

    test("should return undefined for missing expense", () => {
        const expense = service.getExpenseById(
            expenses,
            "999"
        );

        expect(expense).toBeUndefined();
    });
});
```

---

# 19. Mocking Dependencies

Now let's test a service that depends on a repository.

`UserRepository.ts`

```typescript
export interface User {
    id: string;
    name: string;
    email: string;
}

export interface UserRepository {
    findById(id: string): Promise<User | null>;
}
```

`UserService.ts`

```typescript
import {
    User,
    UserRepository
} from "./UserRepository";

export class UserService {
    constructor(
        private repository: UserRepository
    ) {}

    async getUser(id: string): Promise<User> {
        const user = await this.repository.findById(id);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }
}
```

## 19.1 Unit Test with Mock Repository

Using Vitest:

```typescript
import {
    describe,
    test,
    expect,
    vi
} from "vitest";

import { UserService } from "./UserService";

import { UserRepository } from "./UserRepository";

describe("UserService", () => {
    test("should return user when found", async () => {
        const mockUser = {
            id: "1",
            name: "Ali",
            email: "ali@example.com"
        };

        const mockRepository: UserRepository = {
            findById: vi.fn().mockResolvedValue(mockUser)
        };

        const service = new UserService(mockRepository);

        const result = await service.getUser("1");

        expect(result).toEqual(mockUser);

        expect(mockRepository.findById)
            .toHaveBeenCalledWith("1");
    });

    test("should throw error when user is missing", async () => {
        const mockRepository: UserRepository = {
            findById: vi.fn().mockResolvedValue(null)
        };

        const service = new UserService(mockRepository);

        await expect(
            service.getUser("999")
        ).rejects.toThrow("User not found");
    });
});
```

### What Did We Achieve?

We tested `UserService` without:

- Connecting to MySQL.
- Connecting to MongoDB.
- Starting an Express server.
- Calling external services.

This is one of the major advantages of Dependency Injection.

---

# 20. Mocking Modules

Sometimes you need to replace an entire module rather than one dependency instance.

For example, a service imports an email module.

`email.ts`

```typescript
export async function sendEmail(
    email: string
): Promise<boolean> {
    console.log("Sending email to:", email);

    return true;
}
```

`registration.ts`

```typescript
import { sendEmail } from "./email";

export async function registerUser(
    email: string
): Promise<boolean> {
    return sendEmail(email);
}
```

Using Vitest:

```typescript
import {
    describe,
    test,
    expect,
    vi
} from "vitest";

import { sendEmail } from "./email";

import { registerUser } from "./registration";

vi.mock("./email", () => ({
    sendEmail: vi.fn()
}));

describe("Registration", () => {
    test("should send registration email", async () => {
        vi.mocked(sendEmail).mockResolvedValue(true);

        const result = await registerUser("ali@example.com");

        expect(result).toBe(true);

        expect(sendEmail).toHaveBeenCalledWith(
            "ali@example.com"
        );
    });
});
```

### Important

Module mocking behavior depends on the module system and test runner configuration.

Vitest uses `vi.mock()`. Jest uses `jest.mock()`.

---

# 21. Testing Express.js APIs

Backend developers frequently need to test REST APIs.

For example:

```text
GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id
DELETE /users/:id
```

You need to verify:

- HTTP status codes.
- Response body.
- Headers.
- Validation.
- Authentication.
- Authorization.
- Error handling.

A popular library for testing Node.js HTTP servers is Supertest.

Official documentation:

[Supertest GitHub Repository](https://github.com/ladjs/supertest?utm_source=chatgpt.com)

## 21.1 Install Dependencies

```bash
npm install express
```

Development dependencies:

```bash
npm install --save-dev supertest @types/supertest vitest @types/express
```

## 21.2 Create Express Application

`app.ts`

```typescript
import express from "express";

const app = express();

app.use(express.json());

app.get("/users", (req, res) => {
    res.status(200).json({
        users: [
            {
                id: "1",
                name: "Ali"
            }
        ]
    });
});

app.post("/users", (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        res.status(400).json({
            message: "Name and email are required"
        });

        return;
    }

    res.status(201).json({
        message: "User created",
        user: {
            name,
            email
        }
    });
});

export default app;
```

## 21.3 Create Server Separately

`server.ts`

```typescript
import app from "./app";

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

Why separate `app.ts` and `server.ts`?

Because tests can import the Express application without opening a real listening port.

## 21.4 Test GET API

`app.test.ts`

```typescript
import {
    describe,
    test,
    expect
} from "vitest";

import request from "supertest";

import app from "./app";

describe("GET /users", () => {
    test("should return users", async () => {
        const response = await request(app)
            .get("/users");

        expect(response.status).toBe(200);

        expect(response.body.users).toHaveLength(1);

        expect(response.body.users[0].name).toBe("Ali");
    });
});
```

## 21.5 Test POST API

```typescript
describe("POST /users", () => {
    test("should create a user", async () => {
        const response = await request(app)
            .post("/users")
            .send({
                name: "Ali",
                email: "ali@example.com"
            });

        expect(response.status).toBe(201);

        expect(response.body.message).toBe("User created");

        expect(response.body.user.email)
            .toBe("ali@example.com");
    });

    test("should reject missing fields", async () => {
        const response = await request(app)
            .post("/users")
            .send({
                name: "Ali"
            });

        expect(response.status).toBe(400);

        expect(response.body.message)
            .toBe("Name and email are required");
    });
});
```

### Important

Supertest can test an Express application without manually starting a listening server.

This makes API tests easier to isolate and execute.

---

# 22. Testing HTTP Status Codes

HTTP status codes communicate the result of an API request.

Your API tests should verify them.

| Status | Meaning | Example |
|---|---|---|
| 200 | OK | Successful GET |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permission |
| 404 | Not Found | Resource missing |
| 409 | Conflict | Duplicate resource |
| 422 | Unprocessable Content | Semantically invalid input |
| 500 | Internal Server Error | Unexpected server failure |

Example:

```typescript
test("should return 404 for missing user", async () => {
    const response = await request(app)
        .get("/users/999");

    expect(response.status).toBe(404);
});
```

Always test both successful and unsuccessful scenarios.

---

# 23. Testing Express Middleware

Middleware is an important part of Express applications.

Examples:

- Authentication middleware.
- Authorization middleware.
- Request validation.
- Logging.
- Rate limiting.

Let's test an authentication middleware.

`auth.middleware.ts`

```typescript
import {
    Request,
    Response,
    NextFunction
} from "express";

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const token = req.headers.authorization;

    if (!token) {
        res.status(401).json({
            message: "Unauthorized"
        });

        return;
    }

    next();
}
```

Test it through an Express route:

```typescript
import express from "express";

import request from "supertest";

import {
    describe,
    test,
    expect
} from "vitest";

import {
    authMiddleware
} from "./auth.middleware";

const app = express();

app.get(
    "/protected",
    authMiddleware,
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

    test("should allow request with authorization header", async () => {
        const response = await request(app)
            .get("/protected")
            .set("Authorization", "Bearer test-token");

        expect(response.status).toBe(200);
    });
});
```

**Important:** This middleware only checks whether a header exists. It does not verify whether the token is valid. A production authentication middleware must validate the token's signature, expiry, issuer, audience, and relevant claims.

A good test suite should also verify invalid and expired tokens.

---

# 24. Testing Authentication and Authorization

Authentication and authorization are different concepts.

| Authentication | Authorization |
|---|---|
| Verifies who the user is | Verifies what the user can access |
| Login and token validation | Role and permission checking |
| Example: JWT verification | Example: Admin-only endpoint |

Example:

```typescript
type Role = "admin" | "user";

interface AuthenticatedUser {
    id: string;
    role: Role;
}

function canDeleteUser(user: AuthenticatedUser): boolean {
    return user.role === "admin";
}
```

Tests:

```typescript
test("admin should be allowed to delete users", () => {
    expect(
        canDeleteUser({
            id: "1",
            role: "admin"
        })
    ).toBe(true);
});

test("normal user should not delete users", () => {
    expect(
        canDeleteUser({
            id: "2",
            role: "user"
        })
    ).toBe(false);
});
```

For a production application, also test:

- Missing token.
- Invalid token.
- Expired token.
- Missing role.
- Insufficient permissions.
- Cross-user data access.
- Access to resources owned by another user.

---

# 25. Database Integration Testing

Database integration tests verify whether application components interact correctly with a database.

For example:

```text
ExpenseService
      |
      v
ExpenseRepository
      |
      v
Sequelize
      |
      v
Test MySQL Database
```

Unlike a unit test, this test should exercise actual database behavior.

## 25.1 Why Use a Test Database?

Never run destructive integration tests against your production database.

Use:

- A separate test database.
- A temporary database instance.
- An isolated database container.
- A transaction-based test strategy where appropriate.

## 25.2 Example Using Sequelize

Assume you have a Sequelize model:

```typescript
import {
    Model,
    DataTypes,
    Sequelize
} from "sequelize";

export class ExpenseModel extends Model {
    declare id: number;
    declare title: string;
    declare amount: number;
}

export function initializeExpenseModel(
    sequelize: Sequelize
): void {
    ExpenseModel.init(
        {
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },

            amount: {
                type: DataTypes.FLOAT,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: "Expense",
            tableName: "expenses"
        }
    );
}
```

Integration test:

```typescript
import {
    Sequelize
} from "sequelize";

import {
    beforeAll,
    afterAll,
    beforeEach,
    describe,
    test,
    expect
} from "vitest";

import {
    ExpenseModel,
    initializeExpenseModel
} from "./ExpenseModel";

let sequelize: Sequelize;

describe("ExpenseModel Integration", () => {
    beforeAll(async () => {
        sequelize = new Sequelize(
            "sqlite::memory:",
            {
                logging: false
            }
        );

        initializeExpenseModel(sequelize);

        await sequelize.sync({ force: true });
    });

    beforeEach(async () => {
        await ExpenseModel.destroy({
            where: {},
            truncate: true
        });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test("should create an expense", async () => {
        const expense = await ExpenseModel.create({
            title: "Groceries",
            amount: 500
        });

        expect(expense.id).toBeDefined();

        expect(expense.title).toBe("Groceries");

        expect(Number(expense.amount)).toBe(500);
    });
});
```

For this example, install the SQLite driver:

```bash
npm install --save-dev sqlite3
```

**Important:** SQLite in-memory tests are useful for basic model behavior, but they do not fully reproduce MySQL or PostgreSQL behavior. For database-specific integration tests, use the same database engine as production.

## 25.3 Testing Database Transactions

A transaction test should verify:

- Successful operations commit.
- Failed operations roll back.
- Related records are not partially persisted.
- Constraints are enforced.

Example concept:

```typescript
test("should rollback failed transaction", async () => {
    const transaction = await sequelize.transaction();

    try {
        await ExpenseModel.create(
            {
                title: "Test Expense",
                amount: 500
            },
            { transaction }
        );

        throw new Error("Simulated failure");
    } catch {
        await transaction.rollback();
    }

    const count = await ExpenseModel.count();

    expect(count).toBe(0);
});
```

---

# 26. Testing MongoDB Applications

MongoDB applications also require integration tests.

Common approaches:

1. Use a dedicated test MongoDB instance.
2. Use a temporary MongoDB database.
3. Use an in-memory MongoDB testing solution.
4. Use containers.

A popular option is:

[MongoDB Memory Server](https://github.com/typegoose/mongodb-memory-server?utm_source=chatgpt.com)

It can provide temporary MongoDB instances for tests.

### Example Concept

```typescript
import mongoose from "mongoose";

import {
    MongoMemoryServer
} from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();

    await mongoServer.stop();
});
```

You can now test actual Mongoose model operations against an isolated MongoDB instance.

Example:

```typescript
test("should create a user", async () => {
    const user = await UserModel.create({
        name: "Ali",
        email: "ali@example.com"
    });

    expect(user.name).toBe("Ali");
});
```

This example assumes `UserModel` has already been defined.

---

# 27. Testing External APIs

Applications frequently depend on external APIs.

Examples:

- Payment providers.
- Email services.
- SMS services.
- Cloud storage.
- Third-party authentication.

You should generally avoid calling real external services in ordinary unit tests.

Instead, mock the external dependency.

Example:

```typescript
interface PaymentGateway {
    charge(amount: number): Promise<boolean>;
}

class PaymentService {
    constructor(
        private gateway: PaymentGateway
    ) {}

    async processPayment(amount: number): Promise<boolean> {
        if (amount <= 0) {
            throw new Error("Invalid amount");
        }

        return this.gateway.charge(amount);
    }
}
```

Test:

```typescript
import {
    test,
    expect,
    vi
} from "vitest";

test("should process payment successfully", async () => {
    const mockGateway: PaymentGateway = {
        charge: vi.fn().mockResolvedValue(true)
    };

    const service = new PaymentService(mockGateway);

    const result = await service.processPayment(1000);

    expect(result).toBe(true);

    expect(mockGateway.charge)
        .toHaveBeenCalledWith(1000);
});
```

### When Should You Call Real APIs?

Use real services in carefully controlled integration or sandbox tests.

For example, payment providers often offer test environments.

Do not make routine unit tests depend on:

- Internet availability.
- Real payment credentials.
- External service uptime.
- Production customer data.

---

# 28. Test Isolation

Test isolation means that one test should not unintentionally affect another test.

Incorrect:

```typescript
let users = ["Ali"];

test("should add user", () => {
    users.push("Ahmed");

    expect(users).toHaveLength(2);
});

test("should have one user", () => {
    expect(users).toHaveLength(1);
});
```

The second test may fail because the first test changed shared state.

Correct:

```typescript
let users: string[];

beforeEach(() => {
    users = ["Ali"];
});

test("should add user", () => {
    users.push("Ahmed");

    expect(users).toHaveLength(2);
});

test("should start with one user", () => {
    expect(users).toHaveLength(1);
});
```

### Best Practices

- Create fresh test data.
- Reset mocks.
- Clean up database records.
- Close open connections.
- Avoid shared mutable state.
- Avoid test execution order dependencies.
- Use isolated test environments.

---

# 29. Test Fixtures and Factories

A test fixture is predefined data used during testing.

A test factory creates test objects conveniently.

Example:

```typescript
interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
}
```

Factory:

```typescript
function createUser(
    overrides: Partial<User> = {}
): User {
    return {
        id: "1",
        name: "Ali",
        email: "ali@example.com",
        role: "user",
        ...overrides
    };
}
```

Usage:

```typescript
const user1 = createUser();

const user2 = createUser({
    id: "2",
    name: "Ahmed",
    role: "admin"
});
```

### Benefits

- Less repetitive test data.
- Consistent test objects.
- Easier edge-case testing.
- Easier test maintenance.

---

# 30. Code Coverage

Code coverage measures how much of your code is executed by your tests.

It helps identify areas that may not be tested.

Common coverage metrics include:

1. Statement Coverage.
2. Branch Coverage.
3. Function Coverage.
4. Line Coverage.

## 30.1 Statement Coverage

Measures the percentage of executable statements that tests execute.

## 30.2 Branch Coverage

Measures whether possible decision branches have been executed.

Example:

```typescript
function checkAge(age: number): string {
    if (age >= 18) {
        return "Adult";
    }

    return "Minor";
}
```

To cover both branches, test:

```typescript
expect(checkAge(20)).toBe("Adult");

expect(checkAge(15)).toBe("Minor");
```

## 30.3 Function Coverage

Measures how many functions have been called during testing.

## 30.4 Line Coverage

Measures the percentage of executable lines that have been executed.

### Coverage Example

```text
File             % Stmts   % Branch   % Funcs   % Lines
calculator.ts      100       100        100       100
user.ts             80        60         90        80
expense.ts          70        50         75        70
```

## 30.5 Generate Coverage with Vitest

```bash
npm run test:coverage
```

## 30.6 Generate Coverage with Jest

```bash
npm run test:coverage
```

### Is 100% Coverage Necessary?

No.

High code coverage does not guarantee that the tests verify meaningful behavior.

For example:

```typescript
function calculateDiscount(price: number): number {
    return price * 0.9;
}
```

A test could execute this function and achieve 100% coverage while failing to check important business rules.

**Remember:**

Code coverage measures execution, not test quality.

---

# 31. Contract Testing

Contract testing verifies that two systems communicate according to an agreed interface or contract.

It is particularly useful in microservices and distributed systems.

Imagine:

```text
Order Service
      |
      v
Payment Service
```

The Order Service expects the Payment Service to provide:

```json
{
    "paymentId": "PAY-001",
    "status": "success"
}
```

But the Payment Service changes its response:

```json
{
    "id": "PAY-001",
    "paymentStatus": "completed"
}
```

The Order Service may break.

Contract testing helps detect these incompatibilities.

## 31.1 API Contract

Example TypeScript contract:

```typescript
interface PaymentResponse {
    paymentId: string;
    status: "success" | "failed";
}
```

Validation function:

```typescript
function processPaymentResponse(
    response: PaymentResponse
): string {
    return response.paymentId;
}
```

The contract defines the expected structure.

However, TypeScript interfaces alone do not validate actual network responses at runtime.

Use runtime schemas such as Zod for external data.

## 31.2 Consumer-Driven Contract Testing

Consumer-driven contract testing works as follows:

1. Consumer defines what it expects from a provider.
2. Contract is created from those expectations.
3. Provider verifies that it satisfies the contract.
4. Both teams can detect breaking changes before deployment.

A popular tool is:

[Pact Documentation](https://docs.pact.io/?utm_source=chatgpt.com)

### Contract Testing vs Integration Testing

| Contract Testing | Integration Testing |
|---|---|
| Verifies communication expectations | Verifies actual component interaction |
| Often tests interfaces between services | Often tests multiple components together |
| Can run without deploying the complete system | May require connected components |
| Useful for microservices | Useful for databases, APIs and modules |

---

# 32. Snapshot Testing

Snapshot testing compares current output against a previously stored snapshot.

It is commonly used for:

- UI components.
- Serialized data.
- Complex structured output.

Example:

```typescript
const user = {
    id: 1,
    name: "Ali",
    role: "admin"
};

test("should match user snapshot", () => {
    expect(user).toMatchSnapshot();
});
```

Jest stores a snapshot file.

On subsequent runs, Jest compares the current output with the stored snapshot.

### When Is Snapshot Testing Useful?

- UI component rendering.
- Stable serialized output.
- Complex structures that are difficult to compare manually.

### Common Mistake

Blindly updating snapshots whenever tests fail.

A changed snapshot does not automatically mean the new behavior is correct.

Review the difference before updating it.

---

# 33. API Testing Best Practices

For a professional Express.js backend, test the following.

### Successful Scenarios

- Valid registration.
- Successful login.
- Expense creation.
- Expense retrieval.
- Expense update.
- Expense deletion.

### Validation Scenarios

- Missing required fields.
- Invalid email.
- Invalid amount.
- Invalid date.
- Incorrect data types.
- Unexpected additional fields.

### Authentication Scenarios

- Missing token.
- Invalid token.
- Expired token.
- Valid token.

### Authorization Scenarios

- Admin access.
- User access.
- Access to another user's resources.
- Restricted operations.

### Error Scenarios

- Database unavailable.
- Record not found.
- Duplicate record.
- Unexpected server error.
- External API failure.

### Example API Test Matrix

| Endpoint | Scenario | Expected Status |
|---|---|---:|
| POST /users | Valid registration | 201 |
| POST /users | Missing email | 400 |
| POST /login | Valid credentials | 200 |
| POST /login | Invalid credentials | 401 |
| GET /expenses | Valid authentication | 200 |
| POST /expenses | Invalid amount | 400 |
| GET /expenses/999 | Missing expense | 404 |
| DELETE /expenses/1 | Unauthorized request | 401 |

The exact status code should follow your API's documented error contract.

---

# 34. CI/CD Testing Automation

CI/CD stands for:

- Continuous Integration.
- Continuous Delivery.
- Continuous Deployment.

Automated tests are commonly executed during CI/CD pipelines.

A typical pipeline:

```text
Developer Pushes Code
        |
        v
GitHub Repository
        |
        v
Install Dependencies
        |
        v
Run Linter
        |
        v
Run TypeScript Checks
        |
        v
Run Unit Tests
        |
        v
Run Integration Tests
        |
        v
Build Application
        |
        v
Deploy Application
```

The deployment stage should depend on the required quality gates passing.

## 34.1 GitHub Actions

GitHub Actions automates workflows directly within GitHub repositories.

Official documentation:

[GitHub Actions Documentation](https://docs.github.com/en/actions?utm_source=chatgpt.com)

Create:

```text
.github/
└── workflows/
    └── test.yml
```

Example workflow:

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

      - name: TypeScript check
        run: npx tsc --noEmit

      - name: Run tests
        run: npm run test:run

      - name: Build application
        run: npm run build
```

This example assumes your project has the corresponding scripts.

For production, pin GitHub Actions to reviewed commit SHAs and use appropriate permissions.

### Benefits

- Tests run automatically.
- Pull requests can be checked before merging.
- Broken code is detected earlier.
- Teams get consistent quality checks.

---

# 35. Test Automation Strategy for a TypeScript Backend

Let's define a practical testing strategy for an Express.js Expense Tracker.

### Project Structure

```text
src/
│
├── modules/
│   ├── users/
│   │   ├── user.service.ts
│   │   ├── user.repository.ts
│   │   └── user.controller.ts
│   │
│   └── expenses/
│       ├── expense.service.ts
│       ├── expense.repository.ts
│       └── expense.controller.ts
│
├── middleware/
│   └── auth.middleware.ts
│
├── config/
│   └── database.ts
│
└── app.ts

tests/
│
├── unit/
│   ├── user.service.test.ts
│   └── expense.service.test.ts
│
├── integration/
│   ├── user.repository.test.ts
│   └── expense.repository.test.ts
│
├── api/
│   ├── user.api.test.ts
│   └── expense.api.test.ts
│
└── e2e/
    └── expense-flow.test.ts
```

### Testing Responsibilities

| Layer | Testing Type |
|---|---|
| Utility functions | Unit |
| Business services | Unit |
| Repository implementation | Integration |
| Express controllers and routes | API/Integration |
| Authentication middleware | Unit/Integration |
| Complete expense workflow | E2E |

### Recommended Testing Workflow

1. Write unit tests for business rules.
2. Test repository behavior against a test database.
3. Test REST endpoints with Supertest.
4. Test authentication and authorization.
5. Run selected E2E tests for critical user workflows.
6. Run the test suite automatically in CI/CD.

---

# 36. Common Testing Mistakes

| Mistake | Why It Is a Problem | Better Approach |
|---|---|---|
| Testing only successful cases | Error scenarios remain untested | Test success and failure paths |
| Using production database | Risk of damaging real data | Use isolated test databases |
| Not awaiting Promises | Tests may finish too early | Use `await` or return Promises |
| Excessive mocking | Tests stop representing real behavior | Mock only necessary boundaries |
| Shared mutable state | Tests become order-dependent | Reset state between tests |
| Testing implementation details | Refactoring breaks tests unnecessarily | Test observable behavior |
| No negative tests | Invalid input may go unnoticed | Test validation and errors |
| Blind snapshot updates | Incorrect output may be accepted | Review snapshot changes |
| Chasing 100% coverage | Coverage may not reflect meaningful verification | Focus on important behaviors |
| Slow E2E-heavy suite | Feedback becomes expensive | Use a balanced testing pyramid |
| No test cleanup | Resources and data leak between tests | Use teardown hooks |
| Real external API calls in unit tests | Tests become unreliable | Mock external boundaries |

---

# 37. Jest vs Vitest – Quick Revision

| Feature | Jest | Vitest |
|---|---|---|
| Test runner | Yes | Yes |
| Assertions | Yes | Yes |
| Mock functions | `jest.fn()` | `vi.fn()` |
| Spying | `jest.spyOn()` | `vi.spyOn()` |
| Module mocking | `jest.mock()` | `vi.mock()` |
| Setup hooks | `beforeEach()` | `beforeEach()` |
| Async testing | Yes | Yes |
| Coverage | Yes | Yes |
| Watch mode | Yes | Yes |
| TypeScript | Requires suitable configuration | Works well with TypeScript |
| Vite integration | Not native | Native |

**Important:** Jest and Vitest have similar APIs, but their configuration, module mocking, ESM handling and runtime behavior are not identical.

---

# 38. Interview Questions and Answers

## Basic Questions

**Q1. What is software testing?**

Software testing is the process of verifying that an application behaves according to its expected requirements.

**Q2. What is the difference between manual and automated testing?**

Manual testing is executed by humans, whereas automated testing uses scripts and tools to execute test cases.

**Q3. What is unit testing?**

Unit testing verifies individual functions, methods, classes, or other isolated units.

**Q4. What is integration testing?**

Integration testing verifies that multiple components work correctly together.

**Q5. What is E2E testing?**

End-to-end testing verifies complete application workflows from the user's perspective.

**Q6. What is regression testing?**

Regression testing verifies that existing functionality continues working after code changes.

**Q7. What is smoke testing?**

Smoke testing verifies that critical application functionality works after a build or deployment.

**Q8. What is the testing pyramid?**

It is a model that recommends a broad foundation of unit tests, a smaller number of integration tests, and fewer E2E tests.

**Q9. What is Jest?**

Jest is a JavaScript testing framework that provides a test runner, assertions, mocking and coverage.

**Q10. What is Vitest?**

Vitest is a modern testing framework with strong integration into the Vite ecosystem.

## Intermediate Questions

**Q11. What is a test suite?**

A test suite is a group of related test cases.

**Q12. What is an assertion?**

An assertion checks whether actual behavior matches the expected result.

**Q13. What is the AAA pattern?**

AAA means Arrange, Act and Assert.

**Q14. What is TDD?**

Test-Driven Development is a methodology in which tests are written before the corresponding implementation.

**Q15. What is Red-Green-Refactor?**

It is the TDD cycle of writing a failing test, making it pass, and then improving the implementation.

**Q16. What is BDD?**

Behavior-Driven Development focuses on describing software behavior using language shared by developers and business stakeholders.

**Q17. What is mocking?**

Mocking replaces real dependencies with controlled test implementations.

**Q18. What is the difference between a Stub and a Mock?**

A Stub provides predefined responses, while a Mock commonly verifies expected interactions.

**Q19. What is a Spy?**

A Spy observes function calls and can often preserve the original implementation.

**Q20. What is a Fake?**

A Fake is a simplified working implementation of a real dependency.

**Q21. What is test isolation?**

Test isolation ensures that one test does not unintentionally affect another test.

**Q22. What is code coverage?**

Code coverage measures how much code is executed during testing.

**Q23. What is branch coverage?**

Branch coverage measures whether different decision branches have been executed.

**Q24. What is Supertest?**

Supertest is a library used to test HTTP servers and APIs in Node.js.

**Q25. Why should app.ts and server.ts be separate?**

Separating them allows tests to import the Express application without starting a real listening server.

## Advanced Questions

**Q26. What is contract testing?**

Contract testing verifies that communicating systems follow an agreed interface or contract.

**Q27. What is consumer-driven contract testing?**

It is a technique in which consumers define their expectations and providers verify that they satisfy those expectations.

**Q28. What is snapshot testing?**

Snapshot testing compares current output against previously stored snapshots.

**Q29. What is the difference between unit and integration testing?**

Unit tests focus on isolated units, while integration tests verify interactions between components.

**Q30. Why should external APIs be mocked during unit testing?**

To isolate business logic from network failures, external service availability and unpredictable responses.

**Q31. What is the difference between Authentication and Authorization testing?**

Authentication testing verifies identity; authorization testing verifies permissions.

**Q32. Why should tests not use a production database?**

Tests may create, update or delete data and could damage real application records.

**Q33. What is a test fixture?**

A test fixture is predefined data used to prepare test scenarios.

**Q34. What is a test factory?**

A test factory creates test objects with default values and optional overrides.

**Q35. What is CI/CD testing?**

It is the automated execution of tests within a continuous integration and delivery pipeline.

**Q36. Does 100% code coverage guarantee bug-free software?**

No. Coverage measures code execution, not whether the tests verify all important behaviors.

**Q37. What is the difference between Jest and Vitest?**

Both are testing frameworks, but Vitest has native Vite integration and a largely Jest-compatible API.

**Q38. Why is asynchronous testing important in Node.js?**

Because Node.js applications frequently use Promises and asynchronous operations for databases, HTTP requests and file operations.

**Q39. What is the purpose of beforeEach and afterEach?**

They prepare and clean up test state before and after each test.

**Q40. What should you test in a REST API?**

Status codes, response bodies, validation, authentication, authorization, error handling and business behavior.

**Q41. What is a flaky test?**

A flaky test sometimes passes and sometimes fails under apparently identical conditions.

**Q42. What is test coverage versus test quality?**

Coverage measures execution, while test quality measures how effectively tests detect incorrect behavior.

**Q43. What is the difference between a unit test and an API test?**

A unit test verifies an isolated unit, whereas an API test verifies behavior through an HTTP interface.

**Q44. What is a mock server?**

A mock server simulates an external HTTP service and returns controlled responses.

**Q45. Should every function have a unit test?**

Not necessarily. Prioritize meaningful behavior, important business rules and areas where defects would have significant impact.

---

# 39. Practical Exercises

Complete these exercises before moving to the next phase.

## Beginner Level

### Exercise 1: Calculator Testing

Create a calculator supporting:

- Addition.
- Subtraction.
- Multiplication.
- Division.

Write tests for normal inputs and division by zero.

### Exercise 2: Discount Calculator

Create a discount calculator supporting:

- Percentage discount.
- Fixed discount.
- Zero discount.
- Invalid discount percentage.

Write unit tests using Vitest.

### Exercise 3: User Validation

Create a user validator supporting:

- Name validation.
- Email validation.
- Password validation.
- Required field validation.

Test valid and invalid inputs.

### Exercise 4: TDD Practice

Implement a function to calculate the total of an array.

Follow:

```text
Red → Green → Refactor
```

Write tests before implementing the function.

## Intermediate Level

### Exercise 5: Expense Service Testing

Create an ExpenseService supporting:

- Create expense.
- Get expense by ID.
- Calculate total expenses.
- Delete expense.

Write unit tests for all operations.

### Exercise 6: Mock Repository

Create a UserService with a UserRepository dependency.

Test:

- User found.
- User not found.
- Repository failure.
- Correct repository method calls.

### Exercise 7: Express API Testing

Create an Express application with:

```text
GET    /expenses
GET    /expenses/:id
POST   /expenses
PUT    /expenses/:id
DELETE /expenses/:id
```

Write API tests using Supertest.

### Exercise 8: Authentication Testing

Test:

- Missing token.
- Invalid token.
- Expired token.
- Valid token.
- Admin-only routes.
- User-only access restrictions.

## Advanced Level

### Exercise 9: Database Integration Testing

Create a Sequelize Expense model.

Write tests for:

- Create.
- Read.
- Update.
- Delete.
- Validation.
- Transaction rollback.

Use an isolated test database.

### Exercise 10: MongoDB Testing

Create a Mongoose User model.

Write integration tests for:

- User creation.
- Duplicate email.
- Invalid data.
- User retrieval.
- User deletion.

### Exercise 11: Contract Testing

Create two services:

- Order Service.
- Payment Service.

Define a payment API contract and verify that the provider satisfies the consumer's expectations.

### Exercise 12: Complete Testing Architecture

Build an Expense Tracker testing suite containing:

- Unit tests.
- Integration tests.
- API tests.
- Authentication tests.
- Database tests.
- E2E tests.
- Code coverage.
- GitHub Actions CI pipeline.

---

# 40. Phase 58 Completion Checklist

| Topic | Expected Knowledge |
|---|---|
| Testing Fundamentals | Purpose and importance |
| Manual Testing | Manual test execution |
| Automated Testing | Automated test scripts |
| Testing Pyramid | Unit, integration and E2E |
| Unit Testing | Isolated testing |
| Integration Testing | Component interaction |
| E2E Testing | Complete user workflows |
| Jest | Configuration and test execution |
| Vitest | Configuration and test execution |
| Assertions | Jest/Vitest matchers |
| AAA Pattern | Arrange, Act, Assert |
| Setup and Teardown | Lifecycle hooks |
| TDD | Red-Green-Refactor |
| BDD | Given-When-Then |
| Mocking | Functions, modules and dependencies |
| Test Doubles | Dummy, Stub, Fake, Mock and Spy |
| Async Testing | Promises and async functions |
| API Testing | Express and Supertest |
| Middleware Testing | Authentication and authorization |
| Database Testing | Sequelize and MongoDB |
| External API Testing | Mocking and sandbox integration |
| Code Coverage | Statement, branch, function and line |
| Contract Testing | Consumer/provider compatibility |
| Snapshot Testing | Output comparison |
| Test Isolation | Independent execution |
| CI/CD | Automated testing pipelines |

---

# 41. What You Should Be Able to Build After Phase 58

You should now have the knowledge required to:

1. Write unit tests for TypeScript applications.
2. Test Node.js and Express.js APIs.
3. Test database integrations.
4. Mock external services.
5. Test asynchronous functions.
6. Implement TDD workflows.
7. Test authentication and authorization.
8. Build reliable integration test suites.
9. Measure code coverage.
10. Automate testing through GitHub Actions.
11. Design a complete testing strategy for enterprise applications.

**Most important takeaway:**

Testing is not simply about checking whether code works. It is about building confidence that your application behaves correctly, including when users provide invalid input, dependencies fail, unexpected conditions occur, or developers modify existing functionality.

---

# Next Phase

## Phase 59: Advanced TypeScript – Security Engineering, OWASP Top 10, Secure Coding, Authentication, Authorization, JWT, OAuth 2.0, OpenID Connect, RBAC, ABAC, API Security and Application Hardening

Upcoming topics:

1. Security Fundamentals.
2. CIA Triad.
3. Authentication vs Authorization.
4. OWASP Top 10.
5. SQL Injection.
6. NoSQL Injection.
7. Cross-Site Scripting (XSS).
8. Cross-Site Request Forgery (CSRF).
9. Server-Side Request Forgery (SSRF).
10. Broken Access Control.
11. Security Misconfiguration.
12. Cryptography Fundamentals.
13. Hashing vs Encryption.
14. Password Hashing with Argon2 and bcrypt.
15. Salt and Pepper.
16. JWT Authentication.
17. Access Tokens and Refresh Tokens.
18. OAuth 2.0.
19. OpenID Connect.
20. Role-Based Access Control (RBAC).
21. Attribute-Based Access Control (ABAC).
22. API Security.
23. Rate Limiting.
24. CORS.
25. Helmet and Security Headers.
26. Secure Cookies.
27. Secrets Management.
28. Environment Variable Security.
29. Input Validation and Sanitization.
30. Secure Database Queries.
31. File Upload Security.
32. HTTPS and TLS.
33. Session Management.
34. Logging and Security Auditing.
35. Production Security Best Practices.

**Phase 58 completed.**

When you're ready, say: **OK, Phase 59**.