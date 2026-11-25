# Phase 65: Advanced TypeScript – Advanced Testing Engineering, Unit Testing, Integration Testing, E2E Testing, Jest, Vitest, Playwright, Mocking, Test Automation, TDD and CI/CD Testing Architecture

**Level:** Expert / Advanced Software Testing Engineering  
**Prerequisites:** TypeScript, JavaScript, Node.js, Express.js, React, Next.js, SQL, MongoDB, REST APIs, Git, Docker and previous phases.

---

# 1. Learning Objectives

In this phase, you will learn how to test TypeScript applications professionally, from individual functions to complete distributed application workflows.

You will understand:

1. Software testing fundamentals.
2. Testing Pyramid.
3. Unit Testing.
4. Integration Testing.
5. End-to-End Testing.
6. Regression Testing.
7. Smoke Testing.
8. Sanity Testing.
9. Acceptance Testing.
10. Jest.
11. Vitest.
12. Test Suites and Test Cases.
13. Assertions and Matchers.
14. Setup and Teardown.
15. Mock Functions.
16. Spies and Stubs.
17. Module Mocking.
18. API Testing.
19. Supertest.
20. Database Testing.
21. Test Fixtures and Factories.
22. Test Data Management.
23. Test Isolation.
24. Asynchronous Testing.
25. Timer Mocking.
26. React Component Testing.
27. React Testing Library.
28. Next.js Testing.
29. Playwright.
30. Browser Automation.
31. Cross-Browser Testing.
32. Visual Regression Testing.
33. Accessibility Testing.
34. Contract Testing.
35. Consumer-Driven Contract Testing.
36. Load Testing.
37. Stress Testing.
38. Performance Testing.
39. k6.
40. Artillery.
41. Test-Driven Development.
42. Behavior-Driven Development.
43. Code Coverage.
44. Mutation Testing.
45. Continuous Integration Testing.
46. Continuous Delivery.
47. Parallel Test Execution.
48. Flaky Test Management.
49. Test Automation Architecture.
50. Enterprise Testing Strategy.

---

# 2. Software Testing Fundamentals

## 2.1 What Is Software Testing?

Software testing is the process of verifying and validating that an application behaves as expected.

It helps identify:

- Bugs.
- Incorrect business logic.
- Integration problems.
- Performance issues.
- Security vulnerabilities.
- Unexpected behavior.
- Compatibility problems.

Consider an expense tracker.

It contains:

- User registration.
- Login.
- Expense creation.
- Expense updates.
- Expense deletion.
- Monthly reports.
- Database operations.

Suppose a user creates an expense of ₹5,000.

The application should:

1. Validate the amount.
2. Verify authentication.
3. Verify authorization.
4. Save the expense.
5. Return the correct response.
6. Display the expense in the application.

Testing verifies that these operations work correctly.

## 2.2 Why Is Testing Important?

Without testing, developers may unknowingly introduce bugs when changing existing code.

Example:

You have a function that calculates the total expense.

```typescript
function calculateTotal(
  expenses: number[]
): number {
  return expenses.reduce(
    (total, amount) => total + amount,
    0
  );
}
```

Expected behavior:

```typescript
calculateTotal([100, 200, 300]);

// Expected: 600
```

But what happens if someone accidentally changes the implementation?

```typescript
function calculateTotal(
  expenses: number[]
): number {
  return expenses.reduce(
    (total, amount) => total - amount,
    0
  );
}
```

Without testing, this bug may reach production.

A test can detect the problem immediately.

## 2.3 Verification vs Validation

These are two important testing concepts.

**Verification:** Are we building the product correctly according to specifications?

**Validation:** Are we building the right product that satisfies user needs?

| Verification | Validation |
|---|---|
| Checks requirements and implementation correctness | Checks whether the product meets user needs |
| Often involves reviews and inspections | Often involves executing and evaluating the product |
| Focuses on conformance | Focuses on suitability |

---

# 3. Types of Software Testing

Software testing can be classified in different ways.

Two commonly used classifications are:

### By testing level

- Unit Testing.
- Integration Testing.
- System Testing.
- End-to-End Testing.

### By testing objective

- Functional Testing.
- Non-Functional Testing.
- Regression Testing.
- Performance Testing.
- Security Testing.
- Compatibility Testing.

These classifications are not mutually exclusive.

For example, an integration test can also be a functional test.

---

# 4. Testing Pyramid

## 4.1 What Is the Testing Pyramid?

The Testing Pyramid is a model that describes how testing effort should generally be distributed.

```text
                 /\
                /  \
               / E2E\
              /------\
             /        \
            /Integration\
           /------------\
          /              \
         /   Unit Tests   \
        /__________________\
```

The base contains many unit tests.

The middle contains integration tests.

The top contains a smaller number of end-to-end tests.

## 4.2 Unit Tests

Test individual functions, classes or small components.

Example:

```typescript
function add(
  a: number,
  b: number
): number {
  return a + b;
}
```

Test:

```typescript
expect(add(2, 3)).toBe(5);
```

Characteristics:

- Fast.
- Isolated.
- Easy to debug.
- Usually inexpensive.

## 4.3 Integration Tests

Test whether multiple components work correctly together.

Example:

```text
Expense Controller
       |
       v
Expense Service
       |
       v
Expense Repository
       |
       v
Database
```

An integration test may verify that an expense API correctly saves a record in a real test database.

## 4.4 End-to-End Tests

Test complete user workflows.

Example:

```text
User Opens Application
       |
       v
User Logs In
       |
       v
Creates Expense
       |
       v
Expense Saved
       |
       v
Expense Appears in Dashboard
```

E2E tests validate the system from the user's perspective.

## 4.5 Testing Pyramid Comparison

| Feature | Unit | Integration | E2E |
|---|---|---|---|
| Scope | Individual units | Multiple components | Complete workflows |
| Speed | Very fast | Moderate | Slower |
| Debugging | Easier | Moderate | More difficult |
| Dependencies | Usually mocked or absent | Real selected dependencies | Most application dependencies |
| Quantity | Usually highest | Moderate | Usually lowest |

**Important:** The pyramid is a useful guideline, not a rigid rule. Your testing strategy should reflect application risks and architecture.

---

# 5. Unit Testing

## 5.1 What Is Unit Testing?

Unit testing verifies individual units of code independently.

A unit can be:

- Function.
- Method.
- Class.
- Module.
- Small component.

Example:

```typescript
export function calculateDiscount(
  price: number,
  discountPercentage: number
): number {
  return (
    price -
    (price * discountPercentage) / 100
  );
}
```

Expected results:

```text
Price: 1000
Discount: 10%

Final Price: 900
```

## 5.2 What Should Unit Tests Verify?

Consider:

```typescript
export function calculateDiscount(
  price: number,
  discountPercentage: number
): number {
  if (price < 0) {
    throw new Error("Invalid price");
  }

  if (
    discountPercentage < 0 ||
    discountPercentage > 100
  ) {
    throw new Error("Invalid discount");
  }

  return (
    price -
    (price * discountPercentage) / 100
  );
}
```

Test cases:

| Input | Expected Result |
|---|---|
| Price 1000, Discount 10 | 900 |
| Price 500, Discount 20 | 400 |
| Price 100, Discount 0 | 100 |
| Price 100, Discount 100 | 0 |
| Price -100 | Error |
| Discount 150 | Error |
| Discount -10 | Error |

A good unit test checks normal cases, boundary cases and invalid inputs.

## 5.3 Unit Testing Best Practices

1. Test one behavior at a time.
2. Keep tests independent.
3. Use descriptive test names.
4. Avoid unnecessary dependencies.
5. Test edge cases.
6. Avoid testing implementation details.
7. Keep tests deterministic.
8. Ensure failures are easy to understand.

---

# 6. Integration Testing

## 6.1 What Is Integration Testing?

Integration testing verifies whether multiple application components work correctly together.

Example:

```text
HTTP Request
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

An integration test can verify the entire request-to-database flow.

## 6.2 Example

Suppose you have an expense service:

```typescript
export class ExpenseService {
  constructor(
    private repository: ExpenseRepository
  ) {}

  async createExpense(
    userId: number,
    amount: number
  ) {
    if (amount <= 0) {
      throw new Error("Invalid amount");
    }

    return this.repository.create({
      userId,
      amount,
    });
  }
}
```

An integration test might use:

- A real test database.
- The actual repository implementation.
- The actual service.

It verifies that the record is correctly persisted.

## 6.3 Integration Testing Strategies

### A. Big Bang Integration

All components are integrated and tested together.

Disadvantage: Finding the source of failures can be difficult.

### B. Top-Down Integration

Testing begins with higher-level components and progressively integrates lower-level dependencies.

### C. Bottom-Up Integration

Testing begins with lower-level components and progressively integrates higher-level components.

### D. Incremental Integration

Components are integrated and tested gradually.

This often makes failures easier to isolate.

---

# 7. End-to-End Testing

## 7.1 What Is E2E Testing?

End-to-End testing validates complete application workflows from the user's perspective.

For example, in an expense tracker:

```text
1. Open Login Page
2. Enter Email
3. Enter Password
4. Click Login
5. Open Dashboard
6. Click Add Expense
7. Enter Expense Details
8. Submit Form
9. Verify Expense Appears
```

The test checks whether the workflow works across the frontend, backend and required infrastructure.

## 7.2 E2E Testing Characteristics

- Tests complete workflows.
- Uses browser or API interactions.
- Can involve multiple services.
- Usually slower than unit tests.
- Useful for detecting integration failures.

## 7.3 What Should Be Tested Using E2E?

Focus on important business workflows:

- User registration.
- Login and logout.
- Password reset.
- Checkout.
- Payment.
- Order creation.
- Expense creation.
- Report generation.

Avoid creating hundreds of E2E tests for small details that are better tested at lower levels.

---

# 8. Regression Testing

## 8.1 What Is Regression Testing?

Regression testing verifies that existing functionality still works after code changes.

Example:

You add a new discount feature to an e-commerce application.

Before the change:

```text
Product Price = ₹1,000
```

After the change:

```text
Product Price = ₹1,000
Discount = 10%
Final Price = ₹900
```

The new feature should not break:

- Product listing.
- Cart calculations.
- Checkout.
- Payment.
- Order history.

Regression tests help detect unintended side effects.

## 8.2 When Is Regression Testing Needed?

- After bug fixes.
- After adding features.
- After refactoring.
- After dependency upgrades.
- Before production releases.
- After database migrations.

---

# 9. Smoke Testing and Sanity Testing

## 9.1 Smoke Testing

Smoke testing checks whether the major application functions work after a new build or deployment.

Example:

```text
Application Starts       PASS
Login API                 PASS
Database Connection       PASS
Dashboard Loads           PASS
Critical API              PASS
```

It checks whether the build is stable enough for deeper testing.

## 9.2 Sanity Testing

Sanity testing checks whether a specific change or bug fix works as expected.

Example:

A bug was reported in the expense update feature.

After fixing it, sanity testing focuses on:

- Updating expense amount.
- Updating expense description.
- Saving the changes.
- Confirming the updated information.

## 9.3 Smoke vs Sanity

| Feature | Smoke Testing | Sanity Testing |
|---|---|---|
| Purpose | Check overall build stability | Check specific changes |
| Scope | Broad and shallow | Narrow and focused |
| Timing | After a new build or deployment | After a change or bug fix |
| Example | Login, dashboard, API availability | Verify expense update fix |

---

# 10. Acceptance Testing

## 10.1 What Is Acceptance Testing?

Acceptance testing verifies whether an application satisfies the acceptance criteria and is ready for its intended use.

It is often performed by product owners, business users, QA teams or customers.

Example:

Requirement:

```text
A manager must be able to approve
an employee expense.
```

Acceptance criteria:

1. Manager can view pending expenses.
2. Manager can approve an expense.
3. Approved expense status changes.
4. Employee can see the updated status.
5. Unauthorized employees cannot approve expenses.

The application is evaluated against these conditions.

## 10.2 Types of Acceptance Testing

- User Acceptance Testing (UAT).
- Business Acceptance Testing.
- Operational Acceptance Testing.
- Contract Acceptance Testing.

---

# 11. Jest Fundamentals

## 11.1 What Is Jest?

Jest is a JavaScript testing framework that supports TypeScript through suitable transformation or compilation configurations.

It provides:

- Test runner.
- Assertions.
- Mocking.
- Spies.
- Code coverage.
- Setup and teardown hooks.

Official documentation: [Jest Documentation](https://jestjs.io/docs/getting-started?utm_source=chatgpt.com)

## 11.2 Install Jest for TypeScript

For a TypeScript project using `ts-jest`:

```bash
npm install -D jest ts-jest @types/jest
```

Initialize configuration:

```bash
npx ts-jest config:init
```

This creates a Jest configuration suitable for the installed `ts-jest` version.

## 11.3 Example Project Structure

```text
src/
│
├── utils/
│   ├── calculator.ts
│   └── calculator.test.ts
│
├── services/
│
└── app.ts
```

## 11.4 First Jest Test

`calculator.ts`

```typescript
export function add(
  a: number,
  b: number
): number {
  return a + b;
}

export function subtract(
  a: number,
  b: number
): number {
  return a - b;
}
```

`calculator.test.ts`

```typescript
import {
  add,
  subtract,
} from "./calculator";

describe("Calculator", () => {
  test("should add two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  test("should subtract two numbers", () => {
    expect(subtract(5, 3)).toBe(2);
  });
});
```

Run:

```bash
npx jest
```

## 11.5 Understanding describe() and test()

`describe()` groups related tests.

`test()` defines an individual test case.

Example:

```typescript
describe("User Service", () => {
  test("should create user", () => {
    // Test logic
  });

  test("should find user", () => {
    // Test logic
  });
});
```

`it()` is an alias for `test()` in Jest.

---

# 12. Assertions and Matchers

## 12.1 What Is an Assertion?

An assertion checks whether the actual result matches the expected result.

Example:

```typescript
expect(add(2, 3)).toBe(5);
```

If the result is not 5, the test fails.

## 12.2 Common Jest Matchers

| Matcher | Purpose |
|---|---|
| toBe() | Strict equality |
| toEqual() | Deep equality |
| toStrictEqual() | Strict deep equality |
| toBeTruthy() | Checks truthiness |
| toBeFalsy() | Checks falsiness |
| toBeNull() | Checks null |
| toBeUndefined() | Checks undefined |
| toContain() | Checks collection or string membership |
| toHaveLength() | Checks length |
| toThrow() | Checks thrown errors |
| toMatch() | Checks string or regular expression match |
| toHaveBeenCalled() | Checks mock invocation |
| toHaveBeenCalledWith() | Checks arguments |

## 12.3 toBe() vs toEqual()

Example:

```typescript
const user1 = {
  name: "John",
};

const user2 = {
  name: "John",
};
```

Using:

```typescript
expect(user1).toBe(user2);
```

This fails because they are different object references.

Using:

```typescript
expect(user1).toEqual(user2);
```

This passes because their contents are deeply equal.

## 12.4 Testing Errors

```typescript
function divide(
  a: number,
  b: number
): number {
  if (b === 0) {
    throw new Error(
      "Cannot divide by zero"
    );
  }

  return a / b;
}
```

Test:

```typescript
test("should throw when divisor is zero", () => {
  expect(() => divide(10, 0)).toThrow(
    "Cannot divide by zero"
  );
});
```

---

# 13. Test Suites and Test Cases

## 13.1 What Is a Test Suite?

A test suite is a collection of related test cases.

Example:

```typescript
describe("Expense Calculator", () => {
  test("calculates total", () => {});

  test("calculates average", () => {});

  test("handles empty array", () => {});

  test("handles invalid input", () => {});
});
```

## 13.2 Test Naming

Good test names describe expected behavior.

Weak:

```typescript
test("test 1", () => {});
```

Better:

```typescript
test(
  "should return zero when there are no expenses",
  () => {}
);
```

A useful pattern is:

```text
should [expected behavior] when [condition]
```

---

# 14. Setup and Teardown

## 14.1 What Are Setup and Teardown?

Setup prepares resources before tests.

Teardown cleans up resources after tests.

Examples:

- Database connections.
- Test records.
- Mock configurations.
- Temporary files.
- HTTP servers.

## 14.2 Jest Hooks

| Hook | Purpose |
|---|---|
| beforeEach | Runs before each test |
| afterEach | Runs after each test |
| beforeAll | Runs once before a test suite |
| afterAll | Runs once after a test suite |

Example:

```typescript
describe("Database Tests", () => {
  beforeAll(async () => {
    // Connect to test database.
  });

  beforeEach(async () => {
    // Reset test data.
  });

  afterEach(async () => {
    // Clean test data.
  });

  afterAll(async () => {
    // Disconnect database.
  });

  test("should create user", async () => {
    // Test logic.
  });
});
```

**Important:** Avoid sharing mutable test state between tests unless it is deliberately controlled. Tests should be isolated and repeatable.

---

# 15. Mock Functions

## 15.1 What Is Mocking?

Mocking replaces a real dependency with a controlled test implementation.

Example:

Suppose an order service calls a payment provider.

During unit testing, you do not want to make an actual payment.

Instead, you replace the payment provider with a mock.

```text
Order Service
      |
      v
Payment Provider

Production:
Real Payment Provider

Unit Test:
Mock Payment Provider
```

## 15.2 Jest Mock Function

```typescript
test("should call payment provider", async () => {
  const paymentMock = jest.fn();

  paymentMock("order-101");

  expect(paymentMock).toHaveBeenCalled();

  expect(paymentMock).toHaveBeenCalledWith(
    "order-101"
  );
});
```

## 15.3 Mock Return Value

```typescript
const mockFunction = jest.fn();

mockFunction.mockReturnValue(100);

expect(mockFunction()).toBe(100);
```

## 15.4 Mock Resolved Value

```typescript
const mockFunction = jest.fn();

mockFunction.mockResolvedValue({
  id: 101,
  name: "John",
});

const result = await mockFunction();

expect(result.name).toBe("John");
```

## 15.5 Mock Rejected Value

```typescript
const mockFunction = jest.fn();

mockFunction.mockRejectedValue(
  new Error("Payment failed")
);
```

---

# 16. Spies and Stubs

These concepts are related to mocking but have different purposes.

## 16.1 Spy

A spy observes function calls.

It can track:

- Whether a function was called.
- How many times it was called.
- Which arguments were passed.
- What it returned.

Example:

```typescript
const service = {
  sendEmail: () => "sent",
};

const spy = jest.spyOn(
  service,
  "sendEmail"
);

service.sendEmail();

expect(spy).toHaveBeenCalled();
```

## 16.2 Stub

A stub provides predefined behavior for a dependency.

Example:

```typescript
const paymentGateway = {
  charge: jest.fn().mockResolvedValue({
    success: true,
  }),
};
```

This replaces the real payment operation with controlled behavior.

## 16.3 Mock vs Spy vs Stub

| Concept | Purpose |
|---|---|
| Mock | Replaces a dependency with controlled behavior and often verifies interactions |
| Spy | Observes function calls and behavior |
| Stub | Returns predefined responses |

The terminology varies between testing frameworks and testing literature. In Jest, a mock function can also act as a stub or spy.

---

# 17. Module Mocking

## 17.1 What Is Module Mocking?

Module mocking replaces an entire imported module with a controlled implementation.

Example:

```typescript
import axios from "axios";
import { getUser } from "./userService";

jest.mock("axios");

const mockedAxios = jest.mocked(axios);

test("should fetch user", async () => {
  mockedAxios.get.mockResolvedValue({
    data: {
      id: 101,
      name: "John",
    },
  });

  const user = await getUser(101);

  expect(user.name).toBe("John");
});
```

Example service:

```typescript
import axios from "axios";

export async function getUser(
  id: number
) {
  const response = await axios.get(
    `/users/${id}`
  );

  return response.data;
}
```

**Important:** Jest's module mocking behavior can differ between CommonJS and native ESM projects. ESM projects may require `jest.unstable_mockModule()` and dynamic imports. Follow the configuration for your actual module system.

---

# 18. Vitest Fundamentals

## 18.1 What Is Vitest?

Vitest is a modern testing framework designed to work particularly well with Vite-based projects.

It supports:

- Unit testing.
- Assertions.
- Mocking.
- Spies.
- Coverage.
- Browser-related testing integrations.
- TypeScript.

Official documentation: [Vitest Documentation](https://vitest.dev/guide/?utm_source=chatgpt.com)

## 18.2 Install Vitest

```bash
npm install -D vitest
```

Add scripts:

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

## 18.3 First Vitest Test

`calculator.ts`

```typescript
export function multiply(
  a: number,
  b: number
): number {
  return a * b;
}
```

`calculator.test.ts`

```typescript
import {
  describe,
  test,
  expect,
} from "vitest";

import { multiply } from "./calculator";

describe("Calculator", () => {
  test("should multiply numbers", () => {
    expect(multiply(4, 5)).toBe(20);
  });
});
```

Run:

```bash
npm run test:run
```

## 18.4 Vitest Configuration

```typescript
import {
  defineConfig,
} from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    coverage: {
      provider: "v8",
      reporter: [
        "text",
        "html",
      ],
    },
  },
});
```

The coverage provider may require an additional package depending on the installed Vitest version.

## 18.5 Jest vs Vitest

| Feature | Jest | Vitest |
|---|---|---|
| Main ecosystem | Established JavaScript testing ecosystem | Vite-oriented ecosystem |
| TypeScript | Requires suitable configuration or transformer | Strong TypeScript integration |
| Vite integration | Additional configuration | Native integration |
| Mocking | Yes | Yes |
| Coverage | Yes | Yes |
| Watch mode | Yes | Yes |
| React testing | Yes, with supporting libraries | Yes, with supporting libraries |

### Which One Should You Use?

Use Jest when:

- Your project already uses Jest.
- Your organization has an established Jest ecosystem.
- You need compatibility with existing test infrastructure.

Use Vitest when:

- You use Vite.
- You want close integration with Vite configuration.
- You are starting a modern TypeScript testing setup.

Neither framework is universally better.

---

# 19. API Testing

## 19.1 What Is API Testing?

API testing verifies that an API behaves according to its contract.

It checks:

- HTTP status codes.
- Response bodies.
- Headers.
- Authentication.
- Authorization.
- Validation.
- Error handling.
- Business logic.

Example:

```http
POST /api/expenses
Content-Type: application/json
```

Request:

```json
{
  "amount": 500,
  "description": "Internet Bill"
}
```

Expected response:

```json
{
  "id": 101,
  "amount": 500,
  "description": "Internet Bill"
}
```

## 19.2 API Testing Checklist

| Test | Expected Result |
|---|---|
| Valid request | 201 Created |
| Invalid amount | 400 Bad Request |
| Missing token | 401 Unauthorized |
| Insufficient permissions | 403 Forbidden |
| Missing resource | 404 Not Found |
| Unexpected server error | 500 Internal Server Error |

---

# 20. Supertest

## 20.1 What Is Supertest?

Supertest is a library used to test HTTP servers and APIs.

It works particularly well with Express applications.

Documentation: [Supertest GitHub Repository](https://github.com/ladjs/supertest?utm_source=chatgpt.com)

Install:

```bash
npm install -D supertest @types/supertest
```

## 20.2 Express Application

`app.ts`

```typescript
import express from "express";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: "Name and email are required",
    });
  }

  return res.status(201).json({
    id: 101,
    name,
    email,
  });
});

export default app;
```

## 20.3 API Test

`app.test.ts`

```typescript
import request from "supertest";

import app from "./app";

describe("Health API", () => {
  test("should return healthy status", async () => {
    const response = await request(app)
      .get("/health");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      status: "ok",
    });
  });
});

describe("User API", () => {
  test("should create user", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        name: "John",
        email: "john@example.com",
      });

    expect(response.status).toBe(201);

    expect(response.body.name).toBe("John");
  });

  test("should reject invalid user", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        name: "",
      });

    expect(response.status).toBe(400);
  });
});
```

Run:

```bash
npx jest
```

Or configure the project for Vitest and import the corresponding testing functions.

---

# 21. Database Testing

## 21.1 What Is Database Testing?

Database testing verifies that database operations work correctly.

It includes:

- Insert.
- Select.
- Update.
- Delete.
- Constraints.
- Transactions.
- Relationships.
- Index-related query behavior.
- Data integrity.

## 21.2 Unit Test vs Database Integration Test

Suppose you have a user repository.

```typescript
class UserRepository {
  constructor(
    private db: DatabaseClient
  ) {}

  async createUser(
    name: string,
    email: string
  ) {
    return this.db.user.create({
      data: {
        name,
        email,
      },
    });
  }
}
```

A unit test can mock `db.user.create()`.

A database integration test should use a real isolated test database to verify actual persistence behavior.

## 21.3 Database Testing Best Practices

1. Use a dedicated test database.
2. Never run destructive tests against production.
3. Reset data between tests.
4. Use transactions or cleanup strategies where appropriate.
5. Test constraints.
6. Test relationships.
7. Test rollback behavior.
8. Test concurrent operations where relevant.
9. Verify database migrations.
10. Avoid relying on shared mutable test data.

---

# 22. Test Fixtures and Factories

## 22.1 What Is Test Data?

Test data is the information used to execute tests.

Example:

```typescript
const user = {
  id: 101,
  name: "John",
  email: "john@example.com",
};
```

## 22.2 What Is a Fixture?

A fixture is predefined data or state used by tests.

Example:

```typescript
const testUser = {
  id: 101,
  name: "Test User",
  email: "test@example.com",
};
```

## 22.3 What Is a Factory?

A factory generates test objects, often with sensible defaults and customizable overrides.

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
    name: "Test User",
    email: "test@example.com",
    ...overrides,
  };
}
```

Usage:

```typescript
const user1 = createUser();

const user2 = createUser({
  id: 2,
  email: "john@example.com",
});
```

Factories are especially useful when many tests need similar data with small variations.

---

# 23. Test Data Management

## 23.1 Why Is Test Data Management Important?

Poor test data management causes:

- Test conflicts.
- Duplicate records.
- Unpredictable failures.
- Slow execution.
- Difficult debugging.

## 23.2 Common Strategies

### A. Database Reset

Clear test data before or after each test.

### B. Transactions

Run each test inside a transaction and roll it back when possible.

### C. Unique Test Data

Generate unique identifiers to prevent collisions.

### D. Seed Data

Insert a controlled dataset before running tests.

Example:

```typescript
async function seedTestData() {
  await db.user.create({
    data: {
      name: "Test User",
      email: "test@example.com",
    },
  });
}
```

### Important

Parallel tests should not depend on shared records that another test can modify.

---

# 24. Test Isolation

## 24.1 What Is Test Isolation?

Test isolation means that one test should not unintentionally affect another test.

Example:

Test A creates a user.

Test B should not fail because Test A deleted that user or changed its properties.

Bad:

```typescript
let balance = 1000;

test("withdraw", () => {
  balance -= 100;
});

test("check balance", () => {
  expect(balance).toBe(1000);
});
```

The second test depends on the first test's execution and state.

Better:

```typescript
test("withdraw", () => {
  let balance = 1000;

  balance -= 100;

  expect(balance).toBe(900);
});

test("check balance", () => {
  const balance = 1000;

  expect(balance).toBe(1000);
});
```

## 24.2 Isolation Best Practices

- Avoid shared mutable variables.
- Reset mocks.
- Clean up database records.
- Use unique test identifiers.
- Avoid depending on test execution order.
- Control external services.
- Use independent browser contexts for E2E tests.

---

# 25. Asynchronous Testing

## 25.1 Why Is Async Testing Important?

Modern TypeScript applications frequently use asynchronous operations.

Examples:

- Database queries.
- API calls.
- File operations.
- Redis.
- Message queues.
- Background workers.

Testing must wait for these operations to complete.

## 25.2 Testing with async/await

```typescript
async function getUser() {
  return {
    id: 101,
    name: "John",
  };
}
```

Test:

```typescript
test("should return user", async () => {
  const user = await getUser();

  expect(user.id).toBe(101);
});
```

## 25.3 Testing Rejected Promises

```typescript
async function getData() {
  throw new Error("Request failed");
}
```

Test:

```typescript
test("should reject", async () => {
  await expect(
    getData()
  ).rejects.toThrow("Request failed");
});
```

## 25.4 Promise Resolution

```typescript
test("should resolve with data", async () => {
  await expect(
    Promise.resolve(100)
  ).resolves.toBe(100);
});
```

**Important:** Always return or await asynchronous work in your tests. Otherwise, the test runner may finish before the assertion executes.

---

# 26. Timer Mocking

## 26.1 What Is Timer Mocking?

Timer mocking replaces real time-based functions with controlled virtual time.

Useful for testing:

- setTimeout.
- setInterval.
- Debouncing.
- Throttling.
- Retry delays.
- Token expiration.

Example:

```typescript
function delayedMessage(
  callback: () => void
) {
  setTimeout(callback, 1000);
}
```

Jest test:

```typescript
test("should execute callback after 1 second", () => {
  jest.useFakeTimers();

  const callback = jest.fn();

  delayedMessage(callback);

  expect(callback).not.toHaveBeenCalled();

  jest.advanceTimersByTime(1000);

  expect(callback).toHaveBeenCalledTimes(1);

  jest.useRealTimers();
});
```

Use `afterEach()` to restore real timers even when an assertion fails.

---

# 27. React Component Testing

## 27.1 Why Test React Components?

React component testing verifies:

- Rendering.
- User interactions.
- Form validation.
- Conditional rendering.
- State updates.
- Accessibility.
- Error states.

Example component:

```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({
  label,
  onClick,
}: ButtonProps) {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  );
}
```

A component test should verify the behavior visible to the user.

---

# 28. React Testing Library

## 28.1 What Is React Testing Library?

React Testing Library helps test React components by interacting with them in ways similar to real users.

Its philosophy is to test behavior rather than implementation details.

Documentation: [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/?utm_source=chatgpt.com)

## 28.2 Install

For a Vitest-based React project:

```bash
npm install -D \
  @testing-library/react \
  @testing-library/user-event \
  @testing-library/jest-dom \
  jsdom
```

## 28.3 Component Example

`Counter.tsx`

```tsx
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>

      <button
        onClick={() => {
          setCount((value) => value + 1);
        }}
      >
        Increment
      </button>
    </div>
  );
}
```

## 28.4 Component Test

`Counter.test.tsx`

```tsx
import {
  render,
  screen,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
  describe,
  test,
  expect,
} from "vitest";

import { Counter } from "./Counter";

describe("Counter", () => {
  test("should increment count", async () => {
    const user = userEvent.setup();

    render(<Counter />);

    expect(
      screen.getByText("Count: 0")
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Increment",
      })
    );

    expect(
      screen.getByText("Count: 1")
    ).toBeInTheDocument();
  });
});
```

## 28.5 Important Testing Library Queries

| Query | Purpose |
|---|---|
| getByRole | Finds elements by accessibility role |
| getByLabelText | Finds form controls by label |
| getByText | Finds elements by visible text |
| getByPlaceholderText | Finds elements by placeholder |
| getByTestId | Finds elements by test ID |
| queryByText | Returns null when not found |
| findByText | Waits for an element to appear |

Prefer accessible queries such as `getByRole()` and `getByLabelText()` when possible.

---

# 29. Next.js Testing

## 29.1 Why Does Next.js Need Special Testing?

Next.js applications can include:

- Server Components.
- Client Components.
- Server Actions.
- Route Handlers.
- Middleware or Proxy logic, depending on version.
- Dynamic routes.
- Data fetching.
- Server-side rendering.
- Static rendering.

Different features require different testing approaches.

## 29.2 Testing Next.js Components

For Client Components, React Testing Library can be used.

Example:

```tsx
"use client";

import { useState } from "react";

export default function SearchBox() {
  const [query, setQuery] = useState("");

  return (
    <div>
      <input
        aria-label="Search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
        }}
      />

      <p>Query: {query}</p>
    </div>
  );
}
```

The component can be rendered and tested using React Testing Library.

## 29.3 Testing Route Handlers

Example:

```typescript
// app/api/health/route.ts

export async function GET() {
  return Response.json({
    status: "ok",
  });
}
```

Test:

```typescript
import {
  GET,
} from "./route";

test("should return healthy status", async () => {
  const response = await GET();

  const body = await response.json();

  expect(response.status).toBe(200);

  expect(body.status).toBe("ok");
});
```

For more complex handlers, test authentication, validation and database interactions separately.

## 29.4 Testing Server Components

Server Components can involve server-only modules, asynchronous data access and framework-specific behavior.

Use:

- Unit tests for extracted business logic.
- Integration tests for server-side data access.
- E2E tests for complete rendered workflows.

Do not assume every Server Component can be tested like a conventional browser-side React component.

---

# 30. Playwright

## 30.1 What Is Playwright?

Playwright is a browser automation and end-to-end testing framework.

It supports:

- Chromium.
- Firefox.
- WebKit.
- Browser automation.
- API testing.
- Screenshots.
- Video recording.
- Network interception.
- Parallel execution.

Official documentation: [Playwright Documentation](https://playwright.dev/docs/intro?utm_source=chatgpt.com)

## 30.2 Install Playwright

```bash
npm init playwright@latest
```

This setup command creates a Playwright configuration and example tests.

Install browsers if necessary:

```bash
npx playwright install
```

## 30.3 Project Structure

```text
project/
│
├── tests/
│   ├── login.spec.ts
│   ├── expense.spec.ts
│   └── dashboard.spec.ts
│
├── playwright.config.ts
│
└── package.json
```

## 30.4 First Playwright Test

```typescript
import {
  test,
  expect,
} from "@playwright/test";

test("should open homepage", async ({
  page,
}) => {
  await page.goto(
    "http://localhost:3000"
  );

  await expect(page).toHaveTitle(
    /Home/
  );
});
```

Run:

```bash
npx playwright test
```

Run with browser visible:

```bash
npx playwright test --headed
```

Open interactive UI mode:

```bash
npx playwright test --ui
```

---

# 31. Browser Automation

## 31.1 What Is Browser Automation?

Browser automation means controlling a browser programmatically.

You can:

- Open pages.
- Click buttons.
- Fill forms.
- Select options.
- Upload files.
- Download files.
- Take screenshots.
- Verify content.

## 31.2 Example: Login Workflow

```typescript
import {
  test,
  expect,
} from "@playwright/test";

test("should login successfully", async ({
  page,
}) => {
  await page.goto(
    "http://localhost:3000/login"
  );

  await page.getByLabel("Email").fill(
    "test@example.com"
  );

  await page.getByLabel("Password").fill(
    "TestPassword123!"
  );

  await page.getByRole("button", {
    name: "Login",
  }).click();

  await expect(
    page.getByText("Dashboard")
  ).toBeVisible();
});
```

## 31.3 Locator Strategies

| Locator | Purpose |
|---|---|
| getByRole() | Accessibility role |
| getByLabel() | Form label |
| getByText() | Visible text |
| getByPlaceholder() | Placeholder |
| getByTestId() | Test identifier |
| locator() | CSS or other supported selector |

Prefer role-based and label-based locators because they are generally more resilient and closer to real user interaction.

## 31.4 Waiting in Playwright

Playwright automatically waits for many relevant element actionability conditions.

Example:

```typescript
await page.getByRole(
  "button",
  {
    name: "Submit",
  }
).click();
```

Avoid unnecessary fixed waits:

```typescript
await page.waitForTimeout(5000);
```

Prefer waiting for the actual expected condition:

```typescript
await expect(
  page.getByText("Expense created")
).toBeVisible();
```

---

# 32. Cross-Browser Testing

## 32.1 What Is Cross-Browser Testing?

Cross-browser testing verifies that an application works across different browsers.

Examples:

- Chrome.
- Firefox.
- Safari.
- Edge.

Browsers may differ in:

- Rendering.
- CSS support.
- JavaScript behavior.
- Form behavior.
- Storage policies.
- Font rendering.

## 32.2 Playwright Browser Projects

Example configuration:

```typescript
import {
  defineConfig,
  devices,
} from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  projects: [
    {
      name: "chromium",

      use: {
        ...devices["Desktop Chrome"],
      },
    },

    {
      name: "firefox",

      use: {
        ...devices["Desktop Firefox"],
      },
    },

    {
      name: "webkit",

      use: {
        ...devices["Desktop Safari"],
      },
    },
  ],
});
```

Run:

```bash
npx playwright test
```

The actual browser binaries must be installed.

---

# 33. Visual Regression Testing

## 33.1 What Is Visual Regression Testing?

Visual regression testing detects unexpected visual changes in an application.

Example:

You change CSS and accidentally move the login button.

A functional test may still pass.

A visual regression test can detect the layout difference.

## 33.2 Playwright Screenshot Testing

```typescript
import {
  test,
  expect,
} from "@playwright/test";

test("homepage visual test", async ({
  page,
}) => {
  await page.goto(
    "http://localhost:3000"
  );

  await expect(page).toHaveScreenshot(
    "homepage.png"
  );
});
```

The first execution typically creates a baseline screenshot that must be reviewed and accepted.

Subsequent executions compare the current screenshot with the approved baseline.

## 33.3 Visual Testing Best Practices

- Use stable test data.
- Control animations.
- Wait for fonts and images.
- Use consistent browser versions.
- Avoid dynamic timestamps.
- Review baseline changes carefully.
- Use appropriate screenshot thresholds.

---

# 34. Accessibility Testing

## 34.1 What Is Accessibility Testing?

Accessibility testing checks whether people with disabilities can use an application.

It includes:

- Keyboard navigation.
- Screen-reader compatibility.
- Semantic HTML.
- Color contrast.
- Form labels.
- Focus management.
- Accessible error messages.

## 34.2 Example: Accessible Form

```tsx
function LoginForm() {
  return (
    <form>
      <label htmlFor="email">
        Email
      </label>

      <input
        id="email"
        type="email"
        name="email"
        required
      />

      <label htmlFor="password">
        Password
      </label>

      <input
        id="password"
        type="password"
        name="password"
        required
      />

      <button type="submit">
        Login
      </button>
    </form>
  );
}
```

## 34.3 Accessibility Testing Tools

- axe-core
- Lighthouse
- Pa11y

Automated accessibility tests detect many issues, but they cannot identify every accessibility problem. Manual keyboard and screen-reader testing remain important.

---

# 35. Contract Testing

## 35.1 What Is Contract Testing?

Contract testing verifies that two systems communicate according to an agreed interface contract.

Example:

A frontend expects an API response:

```json
{
  "id": 101,
  "name": "John",
  "email": "john@example.com"
}
```

But the backend changes the response:

```json
{
  "userId": 101,
  "fullName": "John",
  "emailAddress": "john@example.com"
}
```

The frontend may break.

Contract testing helps detect such compatibility issues.

## 35.2 API Contract

Example using OpenAPI-style schema:

```yaml
paths:
  /users/{id}:
    get:
      responses:
        "200":
          description: User found
          content:
            application/json:
              schema:
                type: object
                required:
                  - id
                  - name
                  - email
                properties:
                  id:
                    type: integer
                  name:
                    type: string
                  email:
                    type: string
```

## 35.3 Why Is Contract Testing Important?

In microservices architecture:

```text
Order Service
     |
     v
Payment Service
```

If the Payment Service changes its API contract, the Order Service may fail.

Contract testing helps verify compatibility between services before deployment.

---

# 36. Consumer-Driven Contract Testing

## 36.1 What Is Consumer-Driven Contract Testing?

Consumer-driven contract testing is an approach where the consumer defines the interactions it expects from a provider.

Example:

```text
Consumer:
Order Service

Provider:
Payment Service
```

The Order Service defines expectations for the Payment Service response.

The provider verifies that it satisfies those expectations.

## 36.2 Pact

Pact is a popular contract testing tool.

Documentation: [Pact Documentation](https://docs.pact.io/?utm_source=chatgpt.com)

### Basic Workflow

```text
Consumer Test
      |
      v
Generate Contract
      |
      v
Publish Contract
      |
      v
Provider Verification
      |
      v
Compatibility Confirmed
```

Contract testing does not replace integration or E2E testing. It addresses compatibility between independently developed systems.

---

# 37. Load Testing

## 37.1 What Is Load Testing?

Load testing evaluates how an application behaves under expected workloads.

Example:

```text
Concurrent Users: 1,000

Requests Per Second: 500

Duration: 10 Minutes
```

The objective is to verify that the application can handle expected traffic.

## 37.2 What Should Be Measured?

- Requests per second.
- Response time.
- Error rate.
- CPU usage.
- Memory usage.
- Database connections.
- Queue length.
- Throughput.

## 37.3 Load Testing vs Functional Testing

| Functional Testing | Load Testing |
|---|---|
| Verifies correctness | Verifies performance under workload |
| Checks expected output | Checks response time and throughput |
| Usually uses small request volumes | Uses controlled high request volumes |

---

# 38. Stress Testing

## 38.1 What Is Stress Testing?

Stress testing evaluates how an application behaves beyond its expected capacity.

Example:

```text
Expected Traffic: 1,000 RPS

Stress Test:
2,000 RPS
3,000 RPS
5,000 RPS
```

Objectives:

- Identify breaking points.
- Observe failure behavior.
- Detect resource bottlenecks.
- Verify recovery after overload.

## 38.2 Stress Testing vs Load Testing

| Feature | Load Testing | Stress Testing |
|---|---|---|
| Traffic | Expected workload | Beyond expected workload |
| Objective | Validate performance | Find capacity limits |
| Focus | Normal operation | Failure and recovery behavior |

---

# 39. Performance Testing

## 39.1 What Is Performance Testing?

Performance testing evaluates speed, responsiveness, stability and resource consumption.

It includes several testing categories.

| Type | Purpose |
|---|---|
| Load Testing | Test expected workload |
| Stress Testing | Test beyond expected capacity |
| Spike Testing | Test sudden traffic increases |
| Endurance Testing | Test long-running workload |
| Volume Testing | Test large data volumes |
| Scalability Testing | Evaluate behavior as resources increase |

## 39.2 Important Performance Metrics

### Response Time

Time required to complete a request.

### Throughput

Amount of work completed during a time period.

### Latency Percentiles

- P50: Median response time.
- P90: 90% of requests complete within this time.
- P95: 95% of requests complete within this time.
- P99: 99% of requests complete within this time.

Example:

```text
P50 = 80ms
P95 = 250ms
P99 = 800ms
```

This indicates that most requests are relatively fast, but the slowest 1% take considerably longer.

---

# 40. k6

## 40.1 What Is k6?

Grafana k6 is a performance testing tool used to generate controlled workloads against APIs and applications.

Documentation: [Grafana k6 Documentation](https://grafana.com/docs/k6/latest/?utm_source=chatgpt.com)

## 40.2 Example k6 Test

Create:

`load-test.js`

```javascript
import http from "k6/http";

import {
  check,
  sleep,
} from "k6";

export const options = {
  vus: 10,

  duration: "30s",
};

export default function () {
  const response = http.get(
    "http://localhost:3000/health"
  );

  check(response, {
    "status is 200": (res) =>
      res.status === 200,
  });

  sleep(1);
}
```

Run:

```bash
k6 run load-test.js
```

## 40.3 Understanding Configuration

```javascript
export const options = {
  vus: 10,
  duration: "30s",
};
```

- `vus`: Virtual users.
- `duration`: Test duration.

A virtual user repeatedly executes the default function during the test.

## 40.4 Thresholds

You can define performance expectations:

```javascript
export const options = {
  vus: 10,

  duration: "30s",

  thresholds: {
    http_req_failed: [
      "rate<0.01",
    ],

    http_req_duration: [
      "p(95)<500",
    ],
  },
};
```

This specifies:

- Request failure rate below 1%.
- P95 request duration below 500 milliseconds.

---

# 41. Artillery

## 41.1 What Is Artillery?

Artillery is a performance testing platform used to test HTTP services, APIs and other supported protocols.

Documentation: [Artillery Documentation](https://www.artillery.io/docs?utm_source=chatgpt.com)

## 41.2 Example Artillery Configuration

Create:

`load-test.yml`

```yaml
config:
  target: "http://localhost:3000"

  phases:
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: Health Check
    flow:
      - get:
          url: "/health"
```

Run:

```bash
npx artillery run load-test.yml
```

## 41.3 k6 vs Artillery

| Feature | k6 | Artillery |
|---|---|---|
| Configuration | JavaScript | YAML and JavaScript |
| API testing | Yes | Yes |
| Load testing | Yes | Yes |
| Custom logic | JavaScript | JavaScript |
| Performance metrics | Yes | Yes |
| Main strength | Programmable performance testing | Scenario-driven load testing |

---

# 42. Test-Driven Development (TDD)

## 42.1 What Is TDD?

Test-Driven Development is a software development approach in which tests are written before the implementation.

The process follows three stages:

1. Red.
2. Green.
3. Refactor.

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
        Repeat
```

## 42.2 Red Phase

Write a test for functionality that does not exist yet.

Example:

```typescript
test("should add two numbers", () => {
  expect(add(2, 3)).toBe(5);
});
```

The test initially fails because `add()` has not been implemented.

## 42.3 Green Phase

Write the minimum implementation needed to make the test pass.

```typescript
export function add(
  a: number,
  b: number
): number {
  return a + b;
}
```

Now the test passes.

## 42.4 Refactor Phase

Improve code quality without changing behavior.

Example:

- Remove duplication.
- Improve naming.
- Simplify implementation.
- Extract reusable functions.

Run tests again to verify that behavior remains correct.

## 42.5 TDD Advantages

- Encourages testable design.
- Detects regressions.
- Clarifies requirements.
- Improves confidence during refactoring.
- Helps developers consider edge cases early.

## 42.6 TDD Disadvantages

- Requires discipline.
- Can slow initial development.
- Poorly designed tests can create maintenance overhead.
- Some UI and exploratory tasks are difficult to test-first.

---

# 43. Behavior-Driven Development (BDD)

## 43.1 What Is BDD?

Behavior-Driven Development focuses on describing application behavior in language that developers, testers and business stakeholders can understand.

It builds on ideas from TDD and domain-driven collaboration.

## 43.2 Gherkin Syntax

BDD often uses Gherkin.

Example:

```gherkin
Feature: Expense Creation

  Scenario: User creates an expense

    Given the user is logged in

    When the user creates an expense
    with amount 500

    Then the expense should be saved

    And the expense should appear
    in the dashboard
```

## 43.3 Given, When, Then

| Keyword | Meaning |
|---|---|
| Given | Initial context |
| When | Action performed |
| Then | Expected outcome |
| And | Additional step |

## 43.4 BDD vs TDD

| Feature | TDD | BDD |
|---|---|---|
| Focus | Code behavior through tests | Business behavior and examples |
| Primary audience | Developers | Developers, testers and stakeholders |
| Format | Programming language | Often Gherkin |
| Objective | Guide implementation | Align behavior expectations |

BDD is not simply writing tests in English. Its value comes from collaboration and shared understanding.

---

# 44. Code Coverage

## 44.1 What Is Code Coverage?

Code coverage measures how much of your code is executed during testing.

Common coverage metrics:

1. Statement Coverage.
2. Branch Coverage.
3. Function Coverage.
4. Line Coverage.

## 44.2 Statement Coverage

Measures the percentage of executable statements that were executed.

## 44.3 Branch Coverage

Measures whether possible decision branches were executed.

Example:

```typescript
function checkAge(age: number) {
  if (age >= 18) {
    return "Adult";
  }

  return "Minor";
}
```

Tests:

```typescript
checkAge(20);
checkAge(15);
```

Both branches are executed.

## 44.4 Function Coverage

Measures whether functions were executed.

## 44.5 Line Coverage

Measures how many executable lines were executed.

## 44.6 Generate Coverage Report

For Jest:

```bash
npx jest --coverage
```

For Vitest:

```bash
npm run test:coverage
```

Example report:

```text
File              Statements   Branches   Functions   Lines

calculator.ts        100%        100%        100%       100%

userService.ts        85%         70%         90%        85%

expenseService.ts     90%         80%         95%        90%
```

## 44.7 Does 100% Coverage Mean No Bugs?

No.

Coverage measures execution, not correctness.

A test can execute every line without verifying whether the output is correct.

High coverage is useful, but test quality matters more than coverage percentage alone.

---

# 45. Mutation Testing

## 45.1 What Is Mutation Testing?

Mutation testing evaluates the quality of a test suite by deliberately introducing small changes into the code.

These changes are called mutations.

Example:

Original:

```typescript
function add(
  a: number,
  b: number
) {
  return a + b;
}
```

Mutated:

```typescript
function add(
  a: number,
  b: number
) {
  return a - b;
}
```

A good test suite should detect this change.

## 45.2 Mutation Score

A simplified mutation score:

```text
Mutation Score =
Killed Mutants /
(Total Mutants - Excluded Mutants)
× 100
```

A killed mutant is one detected by a failing test.

A surviving mutant indicates that the test suite did not detect the introduced change, although some surviving mutants may be equivalent to the original behavior.

## 45.3 Stryker

Stryker Mutator is a mutation testing framework supporting JavaScript and TypeScript.

Documentation: [Stryker Documentation](https://stryker-mutator.io/docs/?utm_source=chatgpt.com)

Mutation testing can help identify weak or missing assertions.

---

# 46. Continuous Integration Testing

## 46.1 What Is Continuous Integration?

Continuous Integration (CI) is the practice of frequently integrating code changes into a shared repository and automatically validating them.

Typical CI operations:

1. Checkout code.
2. Install dependencies.
3. Run linting.
4. Run type checking.
5. Run unit tests.
6. Run integration tests.
7. Generate coverage reports.
8. Build the application.

## 46.2 CI Architecture

```text
Developer
    |
    v
Git Push
    |
    v
CI Pipeline
    |
    +---- Install Dependencies
    |
    +---- Lint
    |
    +---- Type Check
    |
    +---- Unit Tests
    |
    +---- Integration Tests
    |
    +---- Build
    |
    v
Pipeline Result
```

## 46.3 GitHub Actions Example

GitHub Actions can automate testing workflows.

Create:

`.github/workflows/test.yml`

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
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install Dependencies
        run: npm ci

      - name: Type Check
        run: npx tsc --noEmit

      - name: Run Tests
        run: npm run test:run

      - name: Build
        run: npm run build
```

The Node version should match your project's supported runtime.

## 46.4 Why Run Type Checking in CI?

TypeScript catches many errors before runtime.

Example:

```typescript
function greet(
  name: string
): string {
  return `Hello ${name}`;
}

greet(100);
```

The TypeScript compiler detects the invalid argument.

However, TypeScript types are removed at runtime. Runtime input validation is still required for untrusted external data.

---

# 47. Continuous Delivery and Continuous Deployment

## 47.1 Continuous Delivery

Continuous Delivery ensures that code is automatically built, tested and prepared for release.

Production deployment may require manual approval.

## 47.2 Continuous Deployment

Continuous Deployment automatically deploys qualifying changes to production after they pass the required pipeline checks.

## 47.3 CI vs Continuous Delivery vs Continuous Deployment

| Concept | Meaning |
|---|---|
| CI | Frequently integrate and automatically test code |
| Continuous Delivery | Keep software ready for release |
| Continuous Deployment | Automatically release qualifying changes to production |

## 47.4 Deployment Pipeline

```text
Git Push
   |
   v
Build
   |
   v
Unit Tests
   |
   v
Integration Tests
   |
   v
Security Scans
   |
   v
E2E Tests
   |
   v
Staging Deployment
   |
   v
Smoke Tests
   |
   v
Production Approval / Deployment
```

---

# 48. Parallel Test Execution

## 48.1 What Is Parallel Testing?

Parallel testing runs multiple tests simultaneously rather than sequentially.

Example:

Sequential:

```text
Test A -> Test B -> Test C -> Test D
```

Parallel:

```text
Test A
Test B
Test C
Test D
```

The objective is to reduce total test execution time.

## 48.2 Advantages

- Faster CI pipelines.
- Better resource utilization.
- Faster feedback.
- Better support for large test suites.

## 48.3 Challenges

- Database collisions.
- Shared-state conflicts.
- Port conflicts.
- External API limits.
- Resource contention.
- Non-deterministic failures.

## 48.4 Playwright Parallelism

Example:

```typescript
import {
  defineConfig,
} from "@playwright/test";

export default defineConfig({
  fullyParallel: true,

  workers: 4,

  retries: 1,

  reporter: "html",
});
```

Choose worker count based on available CPU, memory and test environment capacity.

Parallel execution should not be enabled blindly if tests depend on shared state.

---

# 49. Flaky Test Management

## 49.1 What Is a Flaky Test?

A flaky test is a test that sometimes passes and sometimes fails without a relevant application change.

Example:

```typescript
test("should display dashboard", async ({
  page,
}) => {
  await page.goto("/dashboard");

  await page.waitForTimeout(1000);

  await expect(
    page.getByText("Dashboard")
  ).toBeVisible();
});
```

The fixed wait may be too short on a slow environment.

## 49.2 Causes of Flaky Tests

- Arbitrary timeouts.
- Network instability.
- Shared test data.
- Race conditions.
- Uncontrolled background jobs.
- External dependencies.
- Incomplete cleanup.
- Unstable selectors.

## 49.3 Prevention

1. Use deterministic test data.
2. Avoid unnecessary fixed waits.
3. Wait for actual conditions.
4. Isolate test state.
5. Control external dependencies.
6. Use stable locators.
7. Investigate retries rather than relying on them.
8. Monitor repeated intermittent failures.

Retries can help diagnose transient issues, but they should not hide underlying test instability.

---

# 50. Test Automation Architecture

## 50.1 What Is Test Automation Architecture?

Test automation architecture defines how automated tests are organized, executed, maintained and integrated into development workflows.

A good testing architecture should be:

- Reusable.
- Maintainable.
- Scalable.
- Reliable.
- Easy to debug.
- Environment-independent where possible.

## 50.2 Example Project Structure

```text
project/
│
├── src/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── routes/
│   └── utils/
│
├── tests/
│   │
│   ├── unit/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── integration/
│   │   ├── api/
│   │   └── database/
│   │
│   ├── e2e/
│   │   ├── auth.spec.ts
│   │   └── expense.spec.ts
│   │
│   ├── fixtures/
│   │
│   ├── factories/
│   │
│   └── helpers/
│
├── playwright.config.ts
├── vitest.config.ts
└── package.json
```

## 50.3 Page Object Model (POM)

The Page Object Model is a design pattern commonly used in browser automation.

It separates page interactions from test assertions and workflow logic.

Example:

`LoginPage.ts`

```typescript
import {
  Page,
} from "@playwright/test";

export class LoginPage {
  constructor(
    private page: Page
  ) {}

  async open() {
    await this.page.goto("/login");
  }

  async login(
    email: string,
    password: string
  ) {
    await this.page
      .getByLabel("Email")
      .fill(email);

    await this.page
      .getByLabel("Password")
      .fill(password);

    await this.page
      .getByRole("button", {
        name: "Login",
      })
      .click();
  }
}
```

Test:

```typescript
import {
  test,
  expect,
} from "@playwright/test";

import {
  LoginPage,
} from "./pages/LoginPage";

test("user can login", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();

  await loginPage.login(
    "test@example.com",
    "TestPassword123!"
  );

  await expect(page).toHaveURL(
    /dashboard/
  );
});
```

### POM Advantages

- Reusable page interactions.
- Less duplicated code.
- Centralized locator maintenance.
- Cleaner test cases.

Avoid creating excessive abstractions that make tests harder to understand.

---

# 51. Enterprise Testing Strategy

A mature enterprise application needs more than unit tests.

Consider an e-commerce system.

```text
                  E-Commerce System
                          |
         +----------------+----------------+
         |                |                |
         v                v                v
      Frontend         Backend          Database
         |                |                |
         v                v                v
    Component Tests   Unit Tests     DB Integration
         |                |                |
         +----------------+----------------+
                          |
                          v
                  Contract Testing
                          |
                          v
                    E2E Testing
                          |
                          v
                  Performance Testing
                          |
                          v
                    Security Testing
                          |
                          v
                    CI/CD Pipeline
```

## 51.1 Recommended Testing Strategy

| Testing Type | Example |
|---|---|
| Unit | Calculate product discount |
| Component | Render product card |
| Integration | Create order and save database record |
| API | Validate order endpoint |
| Contract | Verify payment service response |
| E2E | Complete checkout |
| Performance | Test 5,000 concurrent users |
| Security | Test authorization and injection protection |
| Accessibility | Verify keyboard navigation |
| Regression | Ensure checkout still works after changes |

## 51.2 Testing by Risk

Not every part of the application requires equal testing effort.

Prioritize:

- Payment processing.
- Authentication.
- Authorization.
- Financial calculations.
- Data deletion.
- Database migrations.
- Tenant isolation.
- Order creation.
- Critical integrations.

A small bug in a payment calculation can be more serious than a minor visual issue.

---

# 52. Common Testing Mistakes

| Mistake | Why It Is a Problem |
|---|---|
| Testing only happy paths | Edge cases remain untested |
| Testing implementation details | Tests break during harmless refactoring |
| Using shared mutable data | Causes unpredictable failures |
| Over-mocking dependencies | Important integration problems remain hidden |
| Using only E2E tests | Slow execution and difficult debugging |
| Using only unit tests | System integration problems may be missed |
| Ignoring async behavior | Tests may finish before operations complete |
| Ignoring test cleanup | Tests affect each other |
| Depending on arbitrary timeouts | Creates flaky tests |
| Treating coverage as correctness | Executed code may still be incorrect |
| Ignoring security testing | Vulnerabilities may reach production |
| Testing against production databases | Can corrupt real data |
| Ignoring CI pipelines | Defects may be introduced without automated checks |
| Retrying flaky tests indefinitely | Hides underlying reliability problems |

---

# 53. Interview Questions and Answers

## Q1. What is software testing?

Software testing is the process of verifying and validating that an application behaves correctly and meets its requirements.

## Q2. What is the difference between verification and validation?

Verification checks whether the product conforms to specifications. Validation checks whether it meets actual user needs.

## Q3. What is the Testing Pyramid?

The Testing Pyramid is a model that recommends many unit tests, a moderate number of integration tests and fewer E2E tests.

## Q4. What is unit testing?

Unit testing verifies individual functions, classes or components independently.

## Q5. What is integration testing?

Integration testing verifies that multiple components work correctly together.

## Q6. What is E2E testing?

End-to-End testing validates complete application workflows from the user's perspective.

## Q7. What is regression testing?

Regression testing verifies that existing functionality still works after code changes.

## Q8. What is smoke testing?

Smoke testing checks whether the major application functions work after a new build or deployment.

## Q9. What is sanity testing?

Sanity testing verifies that a specific change or bug fix behaves as expected.

## Q10. What is acceptance testing?

Acceptance testing checks whether the application satisfies defined business and user requirements.

## Q11. What is Jest?

Jest is a JavaScript testing framework that provides test execution, assertions, mocking and coverage functionality.

## Q12. What is Vitest?

Vitest is a modern testing framework designed for close integration with Vite-based projects.

## Q13. What is the difference between Jest and Vitest?

Jest has an established testing ecosystem, while Vitest provides native Vite integration and modern TypeScript-friendly workflows.

## Q14. What is describe()?

`describe()` groups related test cases into a test suite.

## Q15. What is test()?

`test()` defines an individual test case.

## Q16. What is an assertion?

An assertion verifies that an actual value matches an expected condition.

## Q17. What is the difference between toBe() and toEqual()?

`toBe()` checks strict equality. `toEqual()` performs deep equality comparison.

## Q18. What is mocking?

Mocking replaces a dependency with a controlled implementation during testing.

## Q19. What is a spy?

A spy observes function calls, arguments and other interactions.

## Q20. What is a stub?

A stub provides predefined behavior or responses for a dependency.

## Q21. What is Supertest?

Supertest is a library used to test HTTP servers and API endpoints.

## Q22. What is database integration testing?

It verifies that application components correctly interact with a real test database.

## Q23. What is a test fixture?

A fixture is predefined data or state used by tests.

## Q24. What is a test factory?

A test factory generates reusable test objects with default values and optional overrides.

## Q25. What is test isolation?

Test isolation ensures that one test does not unintentionally affect another test.

## Q26. How do you test asynchronous functions?

Use `async/await` or return promises so that the test runner waits for the operation to complete.

## Q27. What is React Testing Library?

React Testing Library helps test React components through user-visible behavior and accessible queries.

## Q28. What is Playwright?

Playwright is a browser automation and end-to-end testing framework.

## Q29. What is cross-browser testing?

It verifies that an application works correctly across different browsers.

## Q30. What is visual regression testing?

It detects unexpected visual changes by comparing screenshots against approved baselines.

## Q31. What is accessibility testing?

Accessibility testing verifies that an application can be used by people with different abilities and assistive technologies.

## Q32. What is contract testing?

Contract testing verifies that independently developed systems communicate according to an agreed interface contract.

## Q33. What is consumer-driven contract testing?

It is a testing approach where consumers define expected interactions and providers verify that they satisfy those expectations.

## Q34. What is load testing?

Load testing evaluates application performance under expected workload conditions.

## Q35. What is stress testing?

Stress testing evaluates system behavior beyond its expected capacity.

## Q36. What is spike testing?

Spike testing evaluates system behavior when traffic increases suddenly.

## Q37. What is endurance testing?

Endurance testing evaluates system stability under sustained workloads over an extended period.

## Q38. What is k6?

k6 is a performance testing tool used to generate workloads and measure application performance.

## Q39. What is TDD?

Test-Driven Development is a development approach in which tests are written before implementation.

## Q40. What are the three stages of TDD?

Red, Green and Refactor.

## Q41. What is BDD?

Behavior-Driven Development focuses on describing application behavior through understandable examples and collaboration.

## Q42. What is Gherkin?

Gherkin is a structured language used to describe behavior using keywords such as Given, When and Then.

## Q43. What is code coverage?

Code coverage measures how much of the code is executed during tests.

## Q44. What is branch coverage?

Branch coverage measures whether possible decision branches have been executed.

## Q45. Does 100% code coverage guarantee a bug-free application?

No. Coverage measures execution, not whether the assertions correctly verify application behavior.

## Q46. What is mutation testing?

Mutation testing introduces deliberate code changes to evaluate whether the test suite detects them.

## Q47. What is CI?

Continuous Integration automatically validates code changes as they are integrated into a shared repository.

## Q48. What is Continuous Delivery?

Continuous Delivery keeps software built, tested and ready for release.

## Q49. What is Continuous Deployment?

Continuous Deployment automatically releases qualifying changes to production after the required checks pass.

## Q50. What is a flaky test?

A flaky test is one that produces inconsistent results without a relevant application change.

---

# 54. Practical Exercises

Complete these exercises in sequence.

## Exercise 1: Unit Testing

Create a calculator module.

Implement:

- Addition.
- Subtraction.
- Multiplication.
- Division.
- Error handling.

Write tests for normal and invalid inputs.

## Exercise 2: Jest

Create a TypeScript project using Jest.

Implement:

- Test suites.
- Test cases.
- Assertions.
- Setup and teardown.
- Mock functions.

## Exercise 3: Vitest

Create a separate project using Vitest.

Test:

- Utility functions.
- Business logic.
- Async functions.
- Error handling.

Compare your experience with Jest.

## Exercise 4: Express API Testing

Build an Express API with:

```text
POST /users
GET /users
GET /users/:id
PUT /users/:id
DELETE /users/:id
```

Use Supertest to test all endpoints.

## Exercise 5: Database Integration Testing

Build an expense repository.

Use a real isolated test database.

Test:

- Insert.
- Select.
- Update.
- Delete.
- Transaction rollback.
- Unique constraints.

## Exercise 6: Mocking

Build an order service that depends on:

- Payment service.
- Inventory service.
- Notification service.

Write unit tests using mocks.

Test both successful and failed operations.

## Exercise 7: React Component Testing

Create:

- Login form.
- Registration form.
- Expense form.
- Counter component.

Use React Testing Library.

## Exercise 8: Next.js Testing

Build a Next.js application.

Test:

- Client Components.
- Route Handlers.
- Form validation.
- Loading states.
- Error states.

## Exercise 9: Playwright E2E

Build an expense tracker.

Automate this workflow:

```text
Login
  |
  v
Open Dashboard
  |
  v
Create Expense
  |
  v
Verify Expense
  |
  v
Update Expense
  |
  v
Verify Updated Data
  |
  v
Delete Expense
```

## Exercise 10: Visual Regression

Use Playwright screenshot testing.

Create baseline screenshots for:

- Login page.
- Dashboard.
- Expense form.
- Reports page.

## Exercise 11: API Performance Testing

Use k6 to test:

```text
Endpoint: GET /api/expenses

Virtual Users: 100

Duration: 2 Minutes

Target:
P95 < 500ms
```

Record the actual results.

## Exercise 12: TDD

Build a discount calculator using Red-Green-Refactor.

Write tests before implementing each feature.

## Exercise 13: Contract Testing

Create two services:

```text
Order Service
Payment Service
```

Define their API contract and test compatibility using Pact.

## Exercise 14: Complete CI Pipeline

Create a GitHub Actions workflow that runs:

1. Dependency installation.
2. Linting.
3. Type checking.
4. Unit tests.
5. Integration tests.
6. Build.
7. E2E tests against a test environment.

---

# 55. Phase 65 Completion Checklist

| No. | Topic | Status |
|---|---|---|
| 1 | Software Testing Fundamentals | ☐ |
| 2 | Verification vs Validation | ☐ |
| 3 | Testing Pyramid | ☐ |
| 4 | Unit Testing | ☐ |
| 5 | Integration Testing | ☐ |
| 6 | E2E Testing | ☐ |
| 7 | Regression Testing | ☐ |
| 8 | Smoke Testing | ☐ |
| 9 | Sanity Testing | ☐ |
| 10 | Acceptance Testing | ☐ |
| 11 | Jest | ☐ |
| 12 | Vitest | ☐ |
| 13 | Test Suites | ☐ |
| 14 | Assertions and Matchers | ☐ |
| 15 | Setup and Teardown | ☐ |
| 16 | Mock Functions | ☐ |
| 17 | Spies and Stubs | ☐ |
| 18 | Module Mocking | ☐ |
| 19 | API Testing | ☐ |
| 20 | Supertest | ☐ |
| 21 | Database Testing | ☐ |
| 22 | Test Fixtures | ☐ |
| 23 | Test Factories | ☐ |
| 24 | Test Data Management | ☐ |
| 25 | Test Isolation | ☐ |
| 26 | Asynchronous Testing | ☐ |
| 27 | Timer Mocking | ☐ |
| 28 | React Component Testing | ☐ |
| 29 | React Testing Library | ☐ |
| 30 | Next.js Testing | ☐ |
| 31 | Playwright | ☐ |
| 32 | Browser Automation | ☐ |
| 33 | Cross-Browser Testing | ☐ |
| 34 | Visual Regression Testing | ☐ |
| 35 | Accessibility Testing | ☐ |
| 36 | Contract Testing | ☐ |
| 37 | Consumer-Driven Contracts | ☐ |
| 38 | Load Testing | ☐ |
| 39 | Stress Testing | ☐ |
| 40 | Performance Testing | ☐ |
| 41 | k6 | ☐ |
| 42 | Artillery | ☐ |
| 43 | TDD | ☐ |
| 44 | BDD | ☐ |
| 45 | Code Coverage | ☐ |
| 46 | Mutation Testing | ☐ |
| 47 | Continuous Integration | ☐ |
| 48 | Continuous Delivery | ☐ |
| 49 | Parallel Testing | ☐ |
| 50 | Flaky Test Management | ☐ |
| 51 | Page Object Model | ☐ |
| 52 | Enterprise Testing Strategy | ☐ |

---

# 56. What's Next? Phase 66

**Phase 66: Advanced TypeScript – Advanced DevOps Engineering, Docker, Kubernetes, CI/CD, Infrastructure as Code, AWS, Cloud Architecture, Monitoring and Production Deployment**

Upcoming topics:

1. DevOps Fundamentals.
2. Software Development Lifecycle.
3. Git Advanced Workflows.
4. Git Branching Strategies.
5. GitHub Flow.
6. GitFlow.
7. Docker Architecture.
8. Docker Images.
9. Docker Containers.
10. Dockerfile Optimization.
11. Multi-Stage Builds.
12. Docker Compose.
13. Docker Networking.
14. Docker Volumes.
15. Container Security.
16. Kubernetes Fundamentals.
17. Kubernetes Architecture.
18. Pods.
19. Deployments.
20. ReplicaSets.
21. Services.
22. ConfigMaps.
23. Secrets.
24. Ingress.
25. Persistent Volumes.
26. Horizontal Pod Autoscaling.
27. Helm.
28. Kubernetes Networking.
29. CI/CD Architecture.
30. GitHub Actions Advanced.
31. Jenkins.
32. GitLab CI/CD.
33. Infrastructure as Code.
34. Terraform.
35. Ansible.
36. AWS Architecture.
37. EC2.
38. S3.
39. RDS.
40. VPC.
41. IAM.
42. CloudFront.
43. Route 53.
44. Load Balancing.
45. Auto Scaling.
46. Serverless Architecture.
47. AWS Lambda.
48. API Gateway.
49. Cloud Monitoring.
50. Prometheus and Grafana.
51. Centralized Logging.
52. ELK Stack.
53. OpenTelemetry.
54. Production Deployment.
55. Blue-Green Deployment.
56. Canary Deployment.
57. Rolling Deployment.
58. Infrastructure Monitoring.
59. Cost Optimization.
60. Enterprise DevOps Architecture.

**Phase 65 is complete.** When you're ready, say **"OK, Continue to Phase 66"** to begin the next phase.