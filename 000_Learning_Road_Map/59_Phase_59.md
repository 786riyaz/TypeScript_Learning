# Phase 59: Advanced TypeScript – Security Engineering, OWASP Top 10, Secure Coding, Authentication, Authorization, JWT, OAuth 2.0, OpenID Connect, RBAC, ABAC, API Security and Application Hardening

**Level:** Expert / Advanced Security Engineering  
**Prerequisites:** TypeScript, JavaScript, Node.js, Express.js, REST APIs, SQL, MongoDB, authentication, authorization, databases and software testing.

---

# 1. Learning Objectives

By the end of this phase, you will understand how to:

1. Understand application security fundamentals.
2. Apply the CIA security principles.
3. Identify common web application vulnerabilities.
4. Understand the OWASP Top 10.
5. Prevent SQL injection and NoSQL injection.
6. Prevent XSS, CSRF and SSRF attacks.
7. Implement secure password storage.
8. Understand hashing, encryption and cryptography.
9. Implement JWT authentication.
10. Understand access tokens and refresh tokens.
11. Understand OAuth 2.0 and OpenID Connect.
12. Implement RBAC and ABAC.
13. Secure REST APIs.
14. Configure rate limiting, CORS and security headers.
15. Secure file uploads and database operations.
16. Manage application secrets.
17. Implement secure session management.
18. Harden Node.js applications for production.

---

# 2. What Is Application Security?

Application Security (AppSec) refers to the practices, technologies and processes used to protect software applications from security threats.

Consider an Expense Tracker application.

It stores:

- User names.
- Email addresses.
- Password hashes.
- Financial transactions.
- Income information.
- Expense records.
- Authentication tokens.

What happens if an attacker gains unauthorized access?

Possible consequences include:

- Exposure of personal information.
- Financial data theft.
- Account takeover.
- Unauthorized transactions.
- Data modification.
- Service disruption.

Application security aims to prevent these problems.

## 2.1 Security vs Functionality

Consider two implementations of a login system.

**Implementation A:**

```typescript
function login(username: string, password: string): boolean {
    return username === "admin" && password === "admin123";
}
```

**Implementation B:**

```typescript
async function login(
    email: string,
    password: string
): Promise<boolean> {
    // Find user from database.
    // Verify password hash.
    // Apply login rate limiting.
    // Check account status.
    // Generate authentication tokens.
    // Record security audit event.

    return true;
}
```

Implementation B illustrates a more realistic security workflow.

A production authentication system requires multiple security controls, not just a username and password comparison.

---

# 3. CIA Triad – Three Fundamental Security Principles

The CIA Triad is a fundamental information security model.

CIA stands for:

1. Confidentiality.
2. Integrity.
3. Availability.



## 3.1 Confidentiality

Confidentiality ensures that information is accessible only to authorized users.

Example:

A user should only access their own financial records.

```typescript
async function getExpense(
    expenseId: string,
    authenticatedUserId: string
) {
    return ExpenseModel.findOne({
        where: {
            id: expenseId,
            userId: authenticatedUserId
        }
    });
}
```

Notice that the query checks both:

- Expense ID.
- Authenticated user ID.

This prevents users from accessing another user's expense simply by changing an ID.

## 3.2 Integrity

Integrity ensures that information cannot be modified without authorization.

Example:

A normal user should not be able to change another user's expense amount.

Security controls include:

- Access control.
- Database constraints.
- Input validation.
- Audit logging.
- Cryptographic integrity checks where appropriate.

## 3.3 Availability

Availability ensures that authorized users can access the system when needed.

Possible threats:

- Distributed Denial of Service (DDoS).
- Resource exhaustion.
- Database failures.
- Application crashes.
- Excessive API requests.

Security controls include:

- Rate limiting.
- Load balancing.
- Monitoring.
- Backups.
- Redundancy.
- Disaster recovery.

### CIA Triad Summary

| Principle | Purpose | Example |
|---|---|---|
| Confidentiality | Protect information from unauthorized access | User-specific data access |
| Integrity | Prevent unauthorized modification | Restrict expense updates |
| Availability | Keep services accessible | Rate limiting and redundancy |

---

# 4. Authentication vs Authorization

These are two of the most important security concepts.

## 4.1 Authentication

Authentication answers:

**Who are you?**

Example:

A user enters:

```text
Email: ali@example.com
Password: ********
```

The application verifies the credentials.

If valid, the application establishes an authenticated session or issues tokens.

## 4.2 Authorization

Authorization answers:

**What are you allowed to do?**

Example:

An application has two roles:

```typescript
type Role = "admin" | "user";
```

Admin permissions:

- View all users.
- Delete users.
- Manage application settings.

Normal user permissions:

- View own profile.
- Create expenses.
- Update own expenses.

### Comparison

| Authentication | Authorization |
|---|---|
| Verifies identity | Verifies permissions |
| Happens before protected access is granted | Determines access to specific resources |
| Example: Login | Example: Admin-only endpoint |
| Uses credentials, tokens or certificates | Uses roles, permissions and policies |

**Remember:** A user can be authenticated but still not be authorized to access a particular resource.

---

# 5. Security Terminology

Before learning vulnerabilities, understand these terms.

| Term | Meaning |
|---|---|
| Threat | A potential cause of harm |
| Vulnerability | A weakness that can be exploited |
| Exploit | A technique used to take advantage of a vulnerability |
| Attack | An attempt to compromise a system |
| Risk | The potential impact and likelihood of a threat exploiting a vulnerability |
| Attack Surface | All possible entry points into an application |
| Mitigation | A measure that reduces risk |
| Security Patch | An update that fixes a security issue |
| Zero-Day Vulnerability | A vulnerability that is exploited before an effective patch is available |
| Least Privilege | Giving users and systems only the permissions they need |

## 5.1 Principle of Least Privilege

Every user, service and process should have only the minimum permissions necessary.

Example:

A reporting service only needs permission to read expense records.

It should not have permission to:

- Delete users.
- Change passwords.
- Modify database schemas.
- Access unrelated financial records.

This reduces the damage if a component is compromised.

---

# 6. OWASP Top 10

The Open Worldwide Application Security Project (OWASP) publishes security guidance for web applications.

The OWASP Top 10 identifies important categories of web application security risks.

Official reference:

[OWASP Top 10](https://owasp.org/www-project-top-ten/?utm_source=chatgpt.com)

The 2025 edition is the latest published edition as of this lesson.

Its categories are:

| Category | Name |
|---|---|
| A01 | Broken Access Control |
| A02 | Security Misconfiguration |
| A03 | Software Supply Chain Failures |
| A04 | Cryptographic Failures |
| A05 | Injection |
| A06 | Insecure Design |
| A07 | Authentication Failures |
| A08 | Software or Data Integrity Failures |
| A09 | Security Logging and Alerting Failures |
| A10 | Mishandling of Exceptional Conditions |

Let's examine them.

---

# 7. A01 – Broken Access Control

Broken Access Control occurs when users can access resources or perform actions beyond their permissions.

Example:

An Expense Tracker has this endpoint:

```text
GET /expenses/100
```

User A owns expense 100.

User B changes the URL and requests the same expense.

If the backend checks only the expense ID, User B may access User A's financial information.

This is an example of Insecure Direct Object Reference (IDOR), a common access-control vulnerability.

## 7.1 Vulnerable Implementation

```typescript
app.get("/expenses/:id", async (req, res) => {
    const expense = await ExpenseModel.findByPk(req.params.id);

    res.json(expense);
});
```

Problem:

There is no ownership check.

## 7.2 Secure Implementation

```typescript
app.get("/expenses/:id", async (req, res) => {
    const userId = req.user.id;

    const expense = await ExpenseModel.findOne({
        where: {
            id: req.params.id,
            userId
        }
    });

    if (!expense) {
        res.status(404).json({
            message: "Expense not found"
        });

        return;
    }

    res.json(expense);
});
```

Here, the query checks both the resource ID and the authenticated user's ID.

`req.user` must be populated by trusted authentication middleware.

### Prevention

- Implement server-side authorization.
- Verify resource ownership.
- Apply least privilege.
- Deny access by default.
- Validate access on every protected operation.
- Never trust user-supplied role or ownership information.

**Important:** Hiding buttons in the frontend is not authorization. The backend must enforce permissions.

---

# 8. A02 – Security Misconfiguration

Security misconfiguration occurs when application, server or infrastructure settings are insecure.

Examples:

- Debug mode enabled in production.
- Default administrator credentials.
- Public database access.
- Unnecessary open ports.
- Detailed stack traces exposed to users.
- Missing security headers.
- Overly permissive CORS.
- Unnecessary services enabled.

## 8.1 Example of Insecure Error Handling

```typescript
app.get("/users", async (req, res) => {
    try {
        // Database operation
    } catch (error) {
        res.status(500).json({
            error
        });
    }
});
```

This may expose internal implementation details.

## 8.2 Better Error Handling

```typescript
app.get("/users", async (req, res) => {
    try {
        // Database operation
    } catch (error) {
        console.error("Failed to fetch users", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});
```

In production, use a centralized error handler and structured logging.

### Prevention

- Disable debug mode in production.
- Remove default credentials.
- Apply secure server configurations.
- Keep dependencies updated.
- Avoid exposing stack traces.
- Restrict network access.
- Use secure HTTP headers.

---

# 9. A03 – Software Supply Chain Failures

Modern applications depend on third-party packages, libraries, build tools and deployment systems.

For example, a Node.js project may depend on:

```json
{
    "dependencies": {
        "express": "^5.0.0",
        "sequelize": "^6.0.0",
        "jsonwebtoken": "^9.0.0"
    }
}
```

If a dependency contains a vulnerability or malicious code, your application may also become vulnerable.

## 9.1 What Is a Software Supply Chain?

A software supply chain includes:

- Third-party packages.
- Package registries.
- Source code repositories.
- Build tools.
- CI/CD pipelines.
- Deployment artifacts.
- Developer accounts and credentials.

## 9.2 Common Risks

- Malicious npm packages.
- Compromised dependencies.
- Dependency confusion.
- Typosquatting.
- Compromised build pipelines.
- Leaked deployment credentials.
- Unreviewed package updates.

## 9.3 Checking Dependencies

Run:

```bash
npm audit
```

Check outdated packages:

```bash
npm outdated
```

Inspect dependency trees:

```bash
npm ls
```

Install dependencies reproducibly in CI:

```bash
npm ci
```

### Important Security Practices

- Use trusted package maintainers.
- Review dependency changes.
- Remove unused packages.
- Commit and review lockfiles.
- Use automated dependency scanning.
- Pin critical CI/CD actions to reviewed versions or commit SHAs.
- Protect deployment credentials.
- Use software composition analysis tools.

**Important:** `npm audit fix` should not be run blindly in production projects. Review the proposed changes and run your tests afterward.

---

# 10. A04 – Cryptographic Failures

Cryptographic failures occur when sensitive information is not adequately protected.

Examples:

- Plain-text passwords.
- Weak encryption.
- Hardcoded encryption keys.
- Insecure random number generation.
- Weak cryptographic algorithms.
- Missing HTTPS.
- Incorrect certificate validation.

Let's understand cryptography.

## 10.1 Hashing vs Encryption vs Encoding

These three concepts are different.

| Concept | Meaning | Reversible? |
|---|---|---|
| Hashing | Converts data into a fixed-size digest | Generally no |
| Encryption | Converts data into protected ciphertext using a key | Yes, with the correct key |
| Encoding | Changes data representation | Yes, without a secret key |

### Hashing Example

```typescript
import crypto from "node:crypto";

const hash = crypto
    .createHash("sha256")
    .update("Hello")
    .digest("hex");

console.log(hash);
```

Hashing is one-way.

You cannot normally recover the original input from the hash.

### Encryption Example

```typescript
import crypto from "node:crypto";

const algorithm = "aes-256-gcm";

const key = crypto.randomBytes(32);

const iv = crypto.randomBytes(12);

const cipher = crypto.createCipheriv(
    algorithm,
    key,
    iv
);

let encrypted = cipher.update(
    "Sensitive information",
    "utf8",
    "hex"
);

encrypted += cipher.final("hex");

const authTag = cipher.getAuthTag();

console.log({
    encrypted,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex")
});
```

AES-256-GCM provides authenticated encryption.

It provides both:

- Confidentiality.
- Integrity/authenticity of the encrypted data.

For real applications, store encryption keys securely, use unique nonces, and design key rotation and recovery procedures.

---

# 11. Password Hashing

Never store user passwords in plain text.

Incorrect:

```typescript
const user = {
    email: "ali@example.com",
    password: "myPassword123"
};
```

If an attacker obtains the database, all passwords become exposed.

Instead, store a password hash produced by a password-hashing algorithm.

Common choices:

- Argon2id.
- bcrypt.
- scrypt.

**Recommended general-purpose choice:** Argon2id is a strong modern option for password storage.

Official references:

- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html?utm_source=chatgpt.com)
- [Node.js Crypto Documentation](https://nodejs.org/api/crypto.html?utm_source=chatgpt.com)

## 11.1 Hashing with Argon2

Install:

```bash
npm install argon2
```

Hash a password:

```typescript
import argon2 from "argon2";

async function hashPassword(
    password: string
): Promise<string> {
    return argon2.hash(password, {
        type: argon2.argon2id
    });
}
```

Usage:

```typescript
const passwordHash = await hashPassword(
    "mySecurePassword123"
);

console.log(passwordHash);
```

Argon2 generates and stores the required salt information as part of its encoded hash format.

You should not manually reuse one salt for all users.

## 11.2 Verify Password

```typescript
import argon2 from "argon2";

async function verifyPassword(
    password: string,
    storedHash: string
): Promise<boolean> {
    return argon2.verify(
        storedHash,
        password
    );
}
```

Usage:

```typescript
const isValid = await verifyPassword(
    "mySecurePassword123",
    passwordHash
);

console.log(isValid);
```

## 11.3 What Is Salt?

Salt is a random value used during password hashing.

It ensures that identical passwords do not produce identical stored hashes when different salts are used.

Example:

```text
Password: hello123

User A:
Salt A + Password → Hash A

User B:
Salt B + Password → Hash B
```

The resulting hashes differ.

## 11.4 What Is Pepper?

Pepper is an additional secret value used in password protection.

Unlike a salt, a pepper is generally shared at the application level and stored separately from the password database.

For example, it might be stored in a secrets manager.

If you use a pepper, design how it will be rotated and how existing password hashes will be migrated.

### Salt vs Pepper

| Salt | Pepper |
|---|---|
| Random per password/hash | Usually shared application secret |
| Stored with the hash | Stored separately |
| Not required to be secret | Must remain secret |
| Prevents identical passwords producing identical hashes | Adds protection if the password database is leaked |

---

# 12. A05 – Injection

Injection occurs when untrusted input is interpreted as part of a command or query.

Examples:

- SQL Injection.
- NoSQL Injection.
- Command Injection.
- LDAP Injection.

Let's understand the major types.

## 12.1 SQL Injection

SQL injection occurs when untrusted user input changes the structure or meaning of a SQL query.

### Vulnerable Example

```typescript
const email = req.body.email;

const query = `
    SELECT * FROM users
    WHERE email = '${email}'
`;
```

If input is concatenated directly into SQL, an attacker may manipulate the query.

### Secure Implementation Using Sequelize

```typescript
const user = await User.findOne({
    where: {
        email: req.body.email
    }
});
```

Sequelize safely parameterizes ordinary values in its query APIs.

For raw SQL, use bind parameters:

```typescript
const users = await sequelize.query(
    "SELECT * FROM users WHERE email = $email",
    {
        bind: {
            email: req.body.email
        },
        type: QueryTypes.SELECT
    }
);
```

Here, `QueryTypes` must be imported from Sequelize.

**Important:** SQL parameters protect values, not arbitrary SQL identifiers such as table names or column names. For dynamic identifiers, use strict allowlists.

### Prevention

- Use parameterized queries.
- Use ORM query methods correctly.
- Avoid string concatenation.
- Validate input.
- Restrict database privileges.
- Never expose database error details to clients.

---

## 12.2 NoSQL Injection

NoSQL injection occurs when untrusted input manipulates a NoSQL query.

Example using MongoDB.

### Vulnerable Implementation

```typescript
const user = await UserModel.findOne({
    email: req.body.email,
    password: req.body.password
});
```

If the request body is not validated, a malicious client may submit objects instead of strings.

For example, a field may contain a MongoDB operator such as `$ne`.

### Safer Implementation

```typescript
const { email, password } = req.body;

if (
    typeof email !== "string" ||
    typeof password !== "string"
) {
    res.status(400).json({
        message: "Invalid input"
    });

    return;
}

const user = await UserModel.findOne({
    email
});
```

Then verify the submitted password against the stored password hash.

Do not query the database using a plain-text password comparison.

### Prevention

- Validate input types.
- Use strict schemas.
- Avoid accepting arbitrary query objects.
- Restrict MongoDB operators in user-controlled data.
- Apply authentication and authorization.
- Keep database privileges limited.

---

## 12.3 Command Injection

Command injection occurs when untrusted input is included in an operating-system command.

Dangerous:

```typescript
import { exec } from "node:child_process";

exec(`convert ${req.body.filename} output.png`);
```

The input could alter the command.

Safer approach:

Use a fixed executable and pass arguments separately.

```typescript
import { spawn } from "node:child_process";

const process = spawn(
    "convert",
    [
        "input.png",
        "output.png"
    ],
    {
        shell: false
    }
);
```

If dynamic arguments are necessary:

- Validate them.
- Use allowlists.
- Avoid shell execution.
- Restrict filesystem access.
- Run processes with least privilege.

---

# 13. A06 – Insecure Design

Insecure Design refers to security weaknesses caused by missing or inadequate security controls in the system's design.

These are not necessarily implementation bugs.

Example:

An expense-sharing application allows users to create expenses for other users without requiring ownership verification.

Even if the code works exactly as implemented, the business design is insecure.

## 13.1 Examples

- No authorization model.
- No account lockout or abuse controls.
- No rate limiting for sensitive operations.
- No protection against repeated password reset requests.
- No ownership model for user resources.
- Insecure payment workflows.

## 13.2 Prevention

- Threat modeling.
- Security requirements.
- Abuse-case analysis.
- Secure architecture.
- Least privilege.
- Defense in depth.
- Security reviews.

### What Is Threat Modeling?

Threat modeling is a process used to identify possible security threats before or during application design.

For an Expense Tracker, ask:

1. What data is sensitive?
2. Who might attack the application?
3. Which endpoints are exposed?
4. What happens if a token is stolen?
5. Can one user access another user's data?
6. What happens if the database becomes publicly accessible?

A common threat-modeling framework is STRIDE.

| Letter | Threat |
|---|---|
| S | Spoofing |
| T | Tampering |
| R | Repudiation |
| I | Information Disclosure |
| D | Denial of Service |
| E | Elevation of Privilege |

---

# 14. A07 – Authentication Failures

Authentication failures occur when authentication or session-management mechanisms are weak or incorrectly implemented.

Examples:

- Weak passwords.
- Missing login rate limits.
- Predictable session IDs.
- Long-lived tokens.
- Insecure password reset flows.
- Credential stuffing.
- Missing MFA.

## 14.1 Brute-Force Attacks

A brute-force attack repeatedly attempts different passwords.

Example:

```text
admin@example.com / password1
admin@example.com / password2
admin@example.com / password3
```

### Prevention

- Login rate limiting.
- Account-based throttling.
- MFA.
- Strong password storage.
- Suspicious login detection.
- Secure password reset workflows.
- Credential-stuffing detection.

## 14.2 Multi-Factor Authentication (MFA)

MFA requires more than one authentication factor.

Common factors:

1. Something you know – Password.
2. Something you have – Security key or authenticator device.
3. Something you are – Biometric factor.

Examples:

- Password + authenticator application.
- Password + hardware security key.
- Passkey-based authentication.

MFA significantly reduces the impact of stolen passwords.

---

# 15. A08 – Software or Data Integrity Failures

This category involves failures to verify the integrity and authenticity of software, updates, data or critical processes.

Examples:

- Installing untrusted packages.
- Accepting unsigned updates.
- Insecure deserialization.
- Trusting client-side data.
- Compromised CI/CD pipelines.

## 15.1 Insecure Deserialization

Deserialization converts serialized data into objects.

For example:

```typescript
const user = JSON.parse(req.body.data);
```

JSON parsing itself is not inherently unsafe, but trusting the resulting object without validation is dangerous.

A secure approach:

```typescript
import { z } from "zod";

const UserSchema = z.object({
    name: z.string().min(1),
    email: z.string().email()
});

const parsed = UserSchema.safeParse(
    JSON.parse(req.body.data)
);

if (!parsed.success) {
    throw new Error("Invalid user data");
}
```

Runtime validation is essential because TypeScript types are erased at runtime.

---

# 16. A09 – Security Logging and Alerting Failures

Applications need security logging to detect suspicious activity and investigate incidents.

Examples of events worth logging:

- Failed login attempts.
- Password changes.
- Password reset requests.
- Permission changes.
- Account lockouts.
- Suspicious access attempts.
- Administrative operations.
- Sensitive configuration changes.

## 16.1 Example Security Logger

```typescript
interface SecurityEvent {
    event: string;
    userId?: string;
    ipAddress?: string;
    timestamp: Date;
}

function logSecurityEvent(
    event: SecurityEvent
): void {
    console.log(
        JSON.stringify(event)
    );
}
```

Usage:

```typescript
logSecurityEvent({
    event: "LOGIN_FAILED",
    userId: "USER-001",
    ipAddress: "192.0.2.10",
    timestamp: new Date()
});
```

### What Should Not Be Logged?

Never log:

- Plain-text passwords.
- Access tokens.
- Refresh tokens.
- Session IDs.
- Secret API keys.
- Full payment card details.
- Sensitive personal information without a justified need.

### Security Monitoring

Logs should be monitored for patterns such as:

- Repeated login failures.
- Unusual access locations.
- High-volume API requests.
- Privilege escalation attempts.
- Unexpected administrative actions.

Logging without monitoring and alerting is insufficient.

---

# 17. A10 – Mishandling of Exceptional Conditions

Applications frequently encounter unexpected conditions.

Examples:

- Database connection failure.
- Invalid external API responses.
- Missing files.
- Timeouts.
- Unexpected null values.
- Resource exhaustion.

Improper exception handling can expose sensitive information or leave the application in an insecure state.

## 17.1 Insecure Error Handling

```typescript
app.get("/users", async (req, res) => {
    try {
        // Database operation.
    } catch (error) {
        res.status(500).send(
            String(error)
        );
    }
});
```

This can reveal internal implementation details.

## 17.2 Better Error Handling

```typescript
app.get("/users", async (req, res, next) => {
    try {
        // Database operation.
    } catch (error) {
        next(error);
    }
});
```

Centralized error handler:

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
): void {
    console.error("Application error:", error);

    if (res.headersSent) {
        next(error);
        return;
    }

    res.status(500).json({
        message: "Internal server error"
    });
}
```

Register it after routes:

```typescript
app.use(errorHandler);
```

For production, distinguish known application errors from unexpected failures, and avoid exposing stack traces to clients.

---

# 18. A03–A10 Revision Table

| OWASP 2025 Category | Main Risk | Example |
|---|---|---|
| A01 Broken Access Control | Unauthorized access | IDOR |
| A02 Security Misconfiguration | Insecure settings | Debug mode in production |
| A03 Software Supply Chain Failures | Compromised dependencies or build systems | Malicious npm package |
| A04 Cryptographic Failures | Weak data protection | Plain-text passwords |
| A05 Injection | Untrusted input changes commands | SQL injection |
| A06 Insecure Design | Missing security controls in architecture | No resource ownership model |
| A07 Authentication Failures | Weak identity/session controls | Brute-force login |
| A08 Software or Data Integrity Failures | Untrusted software or data changes | Insecure deserialization |
| A09 Security Logging and Alerting Failures | Security events go undetected | No failed-login monitoring |
| A10 Mishandling of Exceptional Conditions | Unsafe error and failure handling | Leaking stack traces |

---

# 19. Cross-Site Scripting (XSS)

XSS occurs when an attacker causes malicious JavaScript to execute in another user's browser.

Example:

An application displays user comments without properly handling HTML.

Suppose a user submits:

```html
<script>
    alert("XSS");
</script>
```

If the application renders this as executable HTML, the browser may execute it.

## 19.1 Types of XSS

There are three major categories.

### Stored XSS

Malicious content is stored on the server.

Example:

- User submits a malicious comment.
- Application stores it in the database.
- Other users open the comment.
- Browser executes the injected script.

### Reflected XSS

Malicious input is immediately included in a server response.

Example:

An application reflects a query parameter into an HTML response without escaping it.

### DOM-Based XSS

Client-side JavaScript manipulates the DOM using unsafe input.

Example:

```typescript
const params = new URLSearchParams(
    window.location.search
);

const name = params.get("name");

document.body.innerHTML = name ?? "";
```

This is unsafe because `innerHTML` interprets input as HTML.

## 19.2 Preventing XSS

Use:

- Context-aware output encoding.
- Safe templating.
- Sanitization when user-generated HTML is required.
- Content Security Policy.
- Avoidance of unsafe DOM sinks.

Safer DOM operation:

```typescript
const params = new URLSearchParams(
    window.location.search
);

const name = params.get("name");

const element = document.createElement("div");

element.textContent = name ?? "";

document.body.appendChild(element);
```

`textContent` treats the input as text rather than executable HTML.

### React and XSS

React escapes ordinary string values rendered in JSX.

Safer:

```tsx
function UserComment({ comment }: { comment: string }) {
    return <div>{comment}</div>;
}
```

Potentially unsafe:

```tsx
function UserComment({ comment }: { comment: string }) {
    return (
        <div
            dangerouslySetInnerHTML={{
                __html: comment
            }}
        />
    );
}
```

Only use `dangerouslySetInnerHTML` with carefully sanitized and trusted HTML.

---

# 20. Cross-Site Request Forgery (CSRF)

CSRF tricks an authenticated user's browser into sending an unwanted request to a website where the user is already logged in.

Example:

A user is logged into a banking application.

An attacker tricks the user into visiting a malicious website.

The malicious website attempts to trigger a money-transfer request to the banking application.

If the browser automatically includes the user's authentication cookie and the server lacks appropriate CSRF protections, the request might succeed.

## 20.1 Why Does CSRF Happen?

Browsers automatically attach certain credentials, particularly cookies, to matching requests.

The server may incorrectly assume that the request was intentionally initiated by the user.

## 20.2 CSRF Prevention

Common protections include:

1. CSRF tokens.
2. SameSite cookie attributes.
3. Origin/Referer validation where appropriate.
4. Requiring non-simple request headers for relevant APIs.
5. Avoiding state-changing GET requests.

### SameSite Cookies

```typescript
res.cookie("session", sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: "lax"
});
```

Possible SameSite values:

| Value | Behavior |
|---|---|
| Strict | Cookie is restricted in cross-site contexts |
| Lax | Cookie is sent in certain top-level cross-site navigations |
| None | Cookie can be sent cross-site, requiring Secure |

SameSite is useful defense in depth, but it is not a universal replacement for CSRF protection.

### When Is CSRF Protection Especially Important?

It is particularly important when authentication uses browser cookies that are automatically sent with requests.

A typical API that uses bearer tokens supplied explicitly in an Authorization header has a different CSRF risk profile, but XSS and token theft remain concerns.

---

# 21. Server-Side Request Forgery (SSRF)

SSRF occurs when an attacker manipulates a server into making requests to unintended destinations.

Example:

An application allows users to import an image from a URL.

```typescript
app.post("/import-image", async (req, res) => {
    const response = await fetch(req.body.url);

    // Process response.
});
```

If the server accepts arbitrary URLs, an attacker may try to access:

- Internal network services.
- Cloud metadata endpoints.
- Internal administrative systems.
- Local services.

## 21.1 Prevention

- Prefer allowlisting trusted destinations.
- Restrict URL schemes.
- Block private and loopback IP ranges.
- Validate DNS resolution.
- Revalidate destinations after redirects.
- Disable redirects or tightly control them.
- Apply network-level egress restrictions.
- Use timeouts and response-size limits.

**Important:** Simple string checks on a URL are not sufficient. SSRF defenses must account for DNS resolution, IP ranges, redirects and DNS rebinding.

---

# 22. JWT Authentication

JWT stands for JSON Web Token.

It is a compact token format commonly used to carry signed claims between systems.

Official specification:

[JWT RFC 7519](https://www.rfc-editor.org/rfc/rfc7519?utm_source=chatgpt.com)

A JWT commonly contains:

1. Header.
2. Payload.
3. Signature.



## 22.1 JWT Structure

A JWT has three Base64URL-encoded parts separated by dots.

```text
HEADER.PAYLOAD.SIGNATURE
```

Example:

```text
xxxxx.yyyyy.zzzzz
```

### Header

The header contains token metadata.

```json
{
    "alg": "HS256",
    "typ": "JWT"
}
```

### Payload

The payload contains claims.

```json
{
    "sub": "USER-001",
    "role": "admin",
    "iat": 1790000000,
    "exp": 1790003600
}
```

### Signature

The signature verifies that the token has not been modified and was signed using the expected key.

For HMAC-based JWTs, the signature is calculated using a shared secret.

## 22.2 Important JWT Claims

| Claim | Meaning |
|---|---|
| `iss` | Issuer |
| `sub` | Subject |
| `aud` | Audience |
| `exp` | Expiration time |
| `nbf` | Not valid before |
| `iat` | Issued at |
| `jti` | JWT ID |

### Important

A signed JWT is not necessarily encrypted.

Its payload can generally be decoded by anyone who has the token.

Never store passwords, API keys or highly sensitive personal information inside an ordinary signed JWT payload.

---

# 23. Implementing JWT Authentication in Node.js

Install:

```bash
npm install jsonwebtoken
```

Development types:

```bash
npm install --save-dev @types/jsonwebtoken
```

Official documentation:

[jsonwebtoken GitHub Repository](https://github.com/auth0/node-jsonwebtoken?utm_source=chatgpt.com)

## 23.1 Generate JWT

```typescript
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
}

interface AuthPayload {
    userId: string;
    role: "admin" | "user";
}

function generateToken(payload: AuthPayload): string {
    return jwt.sign(
        payload,
        JWT_SECRET,
        {
            expiresIn: "15m",
            issuer: "expense-tracker",
            audience: "expense-tracker-api"
        }
    );
}
```

Usage:

```typescript
const token = generateToken({
    userId: "USER-001",
    role: "user"
});

console.log(token);
```

## 23.2 Verify JWT

```typescript
import jwt, {
    JwtPayload
} from "jsonwebtoken";

interface AuthTokenPayload extends JwtPayload {
    userId: string;
    role: "admin" | "user";
}

function verifyToken(token: string): AuthTokenPayload {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is missing");
    }

    const decoded = jwt.verify(
        token,
        secret,
        {
            algorithms: ["HS256"],
            issuer: "expense-tracker",
            audience: "expense-tracker-api"
        }
    );

    if (
        typeof decoded === "string" ||
        typeof decoded.userId !== "string" ||
        !["admin", "user"].includes(decoded.role)
    ) {
        throw new Error("Invalid token payload");
    }

    return decoded as AuthTokenPayload;
}
```

The explicit algorithm allowlist prevents accepting unexpected algorithms.

For systems using asymmetric signing, configure the appropriate public key and permitted algorithm instead.

---

# 24. JWT Authentication Middleware

Let's integrate JWT into Express.

```typescript
import {
    Request,
    Response,
    NextFunction
} from "express";

import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        role: "admin" | "user";
    };
}

export function authenticateToken(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        res.status(401).json({
            message: "Authentication required"
        });

        return;
    }

    const token = authorization.slice(7);

    try {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error("JWT_SECRET is missing");
        }

        const decoded = jwt.verify(
            token,
            secret,
            {
                algorithms: ["HS256"],
                issuer: "expense-tracker",
                audience: "expense-tracker-api"
            }
        );

        if (
            typeof decoded === "string" ||
            typeof decoded.userId !== "string" ||
            !["admin", "user"].includes(decoded.role)
        ) {
            res.status(401).json({
                message: "Invalid token"
            });

            return;
        }

        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };

        next();
    } catch {
        res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}
```

Protected route:

```typescript
app.get(
    "/profile",
    authenticateToken,
    (req: AuthenticatedRequest, res) => {
        res.json({
            user: req.user
        });
    }
);
```

For a larger application, place the request type augmentation in a dedicated TypeScript declaration file.

---

# 25. Access Tokens vs Refresh Tokens

Modern authentication systems often use two types of tokens.

## 25.1 Access Token

An access token is used to access protected resources.

Typical characteristics:

- Short lifetime.
- Sent with API requests.
- Contains limited claims.
- Can be a JWT or opaque token.

Example:

```text
Lifetime: 15 minutes
```

## 25.2 Refresh Token

A refresh token is used to obtain a new access token.

Typical characteristics:

- Longer lifetime.
- More sensitive than an access token.
- Must be stored securely.
- Should support revocation and rotation.

Example:

```text
Lifetime: Several days or weeks
```

### Comparison

| Access Token | Refresh Token |
|---|---|
| Accesses APIs | Obtains new access tokens |
| Short-lived | Longer-lived |
| Used frequently | Used when renewing authentication |
| Should have limited scope | Requires stronger protection |

## 25.3 Token Refresh Workflow

```text
User Login
    |
    v
Server Issues Tokens
    |
    ├── Access Token
    |
    └── Refresh Token
            |
            v
User Calls Protected API
            |
            v
Access Token Expires
            |
            v
Client Sends Refresh Token
            |
            v
Server Validates Refresh Token
            |
            v
Server Issues New Tokens
```

## 25.4 Refresh Token Rotation

Refresh token rotation means issuing a new refresh token whenever a valid refresh token is used.

The old token becomes invalid.

Benefits:

- Limits reuse of stolen tokens.
- Helps detect token replay.
- Supports revocation of token families.

A production implementation should store refresh-token identifiers or hashes, track token families, and revoke related tokens when reuse is detected.

### Important Security Practices

- Use short-lived access tokens.
- Protect refresh tokens carefully.
- Rotate refresh tokens.
- Support logout and revocation.
- Validate token issuer and audience.
- Use secure transport.
- Never log tokens.

---

# 26. Where Should You Store JWTs?

This is an important frontend security decision.

Common storage options:

1. Memory.
2. Browser localStorage.
3. Browser sessionStorage.
4. Secure HttpOnly cookies.

## 26.1 localStorage

```typescript
localStorage.setItem("accessToken", token);
```

Advantages:

- Easy to use.
- Survives page refreshes.
- Accessible across application components.

Disadvantages:

- JavaScript can read it.
- XSS can steal the token.
- No automatic CSRF protection because the token is not automatically attached by the browser.

## 26.2 sessionStorage

```typescript
sessionStorage.setItem("accessToken", token);
```

Advantages:

- Scoped to the browser tab/session.
- JavaScript accessible.

Disadvantages:

- Vulnerable to token theft through XSS.
- Not shared automatically between tabs.

## 26.3 HttpOnly Cookies

```typescript
res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/auth/refresh"
});
```

Advantages:

- JavaScript cannot directly read HttpOnly cookies.
- Browser handles cookie transmission.

Disadvantages:

- Requires careful CSRF protection.
- Cookie domain, path and SameSite configuration matter.

### Comparison

| Storage | JavaScript Access | XSS Token Theft Risk | CSRF Consideration |
|---|---|---|---|
| localStorage | Yes | High | Usually not automatically attached |
| sessionStorage | Yes | High | Usually not automatically attached |
| HttpOnly Cookie | No direct JavaScript access | Reduced | Must be considered carefully |
| Memory | Yes, within application runtime | Possible while active | Depends on transport |

**Important:** No storage mechanism eliminates all browser security risks. XSS can still perform actions as the authenticated user even when tokens are stored in HttpOnly cookies.

---

# 27. OAuth 2.0

OAuth 2.0 is an authorization framework.

It allows an application to obtain limited access to resources on behalf of a user or application.

Official specification:

[OAuth 2.0 RFC 6749](https://www.rfc-editor.org/rfc/rfc6749?utm_source=chatgpt.com)

Example:

You want to build an application that allows users to connect their Google Calendar.

You do not need to ask users for their Google password.

Instead:

1. Your application redirects users to the authorization server.
2. Users authenticate there.
3. Users grant requested permissions.
4. Your application receives authorization.
5. Your application obtains an access token.
6. Your application accesses permitted resources.



## 27.1 OAuth Participants

| Component | Meaning |
|---|---|
| Resource Owner | User who owns the data |
| Client | Application requesting access |
| Authorization Server | Issues tokens |
| Resource Server | Hosts protected resources |

## 27.2 OAuth Grant Types

Modern OAuth implementations commonly use:

- Authorization Code Flow.
- Authorization Code Flow with PKCE.
- Client Credentials Flow.
- Device Authorization Grant.
- Refresh Token Grant.

The Resource Owner Password Credentials grant should not be used for new systems.

## 27.3 Authorization Code Flow

```text
User
 |
 v
Client Application
 |
 v
Authorization Server
 |
 v
User Grants Permission
 |
 v
Authorization Code
 |
 v
Client Exchanges Code
 |
 v
Access Token
 |
 v
Resource Server
```

The authorization code is exchanged for tokens.

## 27.4 PKCE

PKCE stands for Proof Key for Code Exchange.

It protects the authorization code flow against authorization-code interception attacks.

It is especially important for public clients such as:

- Browser-based applications.
- Mobile applications.
- Desktop applications.

PKCE uses:

- Code Verifier.
- Code Challenge.

The client creates a random code verifier and derives a challenge from it.

The authorization server binds the authorization code to the challenge.

During token exchange, the client proves possession of the original verifier.

### Important

For modern OAuth applications, prefer Authorization Code Flow with PKCE.

---

# 28. OpenID Connect (OIDC)

OpenID Connect is an identity layer built on top of OAuth 2.0.

OAuth 2.0 primarily provides authorization.

OpenID Connect adds standardized authentication and identity information.

Official specification:

[OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html?utm_source=chatgpt.com)

## 28.1 OAuth vs OIDC

| OAuth 2.0 | OpenID Connect |
|---|---|
| Authorization framework | Authentication and identity layer |
| Provides access tokens | Adds ID tokens |
| Grants access to resources | Communicates authenticated user identity |
| Does not standardize user authentication by itself | Standardizes identity claims and authentication behavior |

## 28.2 ID Token

An ID token communicates information about the authenticated user.

Example claims:

```json
{
    "iss": "https://identity.example.com",
    "sub": "USER-001",
    "aud": "my-client-id",
    "exp": 1790003600,
    "iat": 1790000000
}
```

Important claims:

- `iss`: Issuer.
- `sub`: Subject identifier.
- `aud`: Intended audience.
- `exp`: Expiration.
- `iat`: Issued-at time.

### Access Token vs ID Token

An ID token is intended for the client application.

An access token is intended for the resource server.

Do not use an ID token as an API access token unless a protocol explicitly defines such usage.

---

# 29. Role-Based Access Control (RBAC)

RBAC stands for Role-Based Access Control.

It grants permissions based on user roles.

Example:

```text
Admin
  |
  ├── View Users
  ├── Delete Users
  ├── Manage Expenses
  └── Manage Settings

User
  |
  ├── View Own Expenses
  ├── Create Expenses
  └── Update Own Expenses
```

## 29.1 Define Roles

```typescript
type Role = "admin" | "manager" | "user";
```

## 29.2 Define Permissions

```typescript
type Permission =
    | "user:read"
    | "user:delete"
    | "expense:create"
    | "expense:read"
    | "expense:update"
    | "expense:delete";
```

## 29.3 Define Role Permissions

```typescript
const rolePermissions: Record<Role, Permission[]> = {
    admin: [
        "user:read",
        "user:delete",
        "expense:create",
        "expense:read",
        "expense:update",
        "expense:delete"
    ],

    manager: [
        "user:read",
        "expense:read",
        "expense:update"
    ],

    user: [
        "expense:create",
        "expense:read",
        "expense:update"
    ]
};
```

## 29.4 Permission Checking

```typescript
function hasPermission(
    role: Role,
    permission: Permission
): boolean {
    return rolePermissions[role].includes(permission);
}
```

Usage:

```typescript
console.log(
    hasPermission("admin", "user:delete")
); // true

console.log(
    hasPermission("user", "user:delete")
); // false
```

## 29.5 Express Authorization Middleware

```typescript
import {
    Request,
    Response,
    NextFunction
} from "express";

function authorize(
    permission: Permission
) {
    return (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): void => {
        if (!req.user) {
            res.status(401).json({
                message: "Authentication required"
            });

            return;
        }

        const allowed = hasPermission(
            req.user.role,
            permission
        );

        if (!allowed) {
            res.status(403).json({
                message: "Forbidden"
            });

            return;
        }

        next();
    };
}
```

Usage:

```typescript
app.delete(
    "/users/:id",
    authenticateToken,
    authorize("user:delete"),
    deleteUserController
);
```

---

# 30. Attribute-Based Access Control (ABAC)

ABAC stands for Attribute-Based Access Control.

It makes access decisions using attributes rather than relying only on roles.

Attributes can belong to:

- User.
- Resource.
- Action.
- Environment.

Example:

A user can view an expense only if:

- The user is authenticated.
- The expense belongs to the user.
- The expense belongs to the current organization.
- The requested action is allowed.

## 30.1 ABAC Example

```typescript
interface UserContext {
    userId: string;
    department: string;
    role: string;
}

interface ExpenseResource {
    id: string;
    ownerId: string;
    department: string;
}

function canViewExpense(
    user: UserContext,
    expense: ExpenseResource
): boolean {
    return (
        user.userId === expense.ownerId ||
        (
            user.role === "manager" &&
            user.department === expense.department
        )
    );
}
```

Usage:

```typescript
const user = {
    userId: "USER-001",
    department: "Finance",
    role: "manager"
};

const expense = {
    id: "EXP-001",
    ownerId: "USER-002",
    department: "Finance"
};

console.log(
    canViewExpense(user, expense)
); // true
```

The manager can view the expense because both belong to the Finance department.

## 30.2 RBAC vs ABAC

| RBAC | ABAC |
|---|---|
| Based on roles | Based on attributes |
| Easier to implement | More flexible |
| Suitable for role-based applications | Suitable for complex policies |
| Example: Admin can delete users | Example: Manager can access records in their department |

Many enterprise applications combine RBAC and ABAC.

For example, a user must have the `expense:read` permission and must also own the expense.

---

# 31. API Security

REST APIs are common attack surfaces.

A secure API should implement multiple layers of protection.

## 31.1 Input Validation

Never trust client input.

Example using Zod:

Install:

```bash
npm install zod
```

Schema:

```typescript
import { z } from "zod";

const CreateExpenseSchema = z.object({
    title: z.string().trim().min(1).max(100),

    amount: z.number().positive(),

    categoryId: z.string().uuid()
});
```

Validate:

```typescript
const result = CreateExpenseSchema.safeParse(req.body);

if (!result.success) {
    res.status(400).json({
        message: "Invalid input",
        errors: result.error.flatten()
    });

    return;
}
```

The validated output should be used instead of the original untrusted request body.

## 31.2 Output Validation

You should also control what your API returns.

Avoid exposing:

- Password hashes.
- Internal database fields.
- Authentication secrets.
- Internal error messages.
- Sensitive personal information.

Example:

```typescript
function toUserResponse(user: UserModel) {
    return {
        id: user.id,
        name: user.name,
        email: user.email
    };
}
```

Do not blindly return the complete database model.

## 31.3 Rate Limiting

Rate limiting restricts the number of requests a client can make within a given time period.

Example:

```text
100 requests per minute per IP
```

It helps protect against:

- Brute-force attempts.
- API abuse.
- Resource exhaustion.
- Excessive automated requests.

Install:

```bash
npm install express-rate-limit
```

Configuration:

```typescript
import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        message: "Too many requests"
    }
});

app.use("/api", apiLimiter);
```

For login endpoints, use a stricter policy.

```typescript
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false
});

app.use("/auth/login", loginLimiter);
```

**Important:** In a multi-instance production deployment, use a shared rate-limit store. The default in-memory store is not sufficient for globally consistent limits across multiple application instances.

Also consider limits by account, IP and device signals, not just IP address.

---

# 32. CORS – Cross-Origin Resource Sharing

CORS is a browser security mechanism that controls whether a web page from one origin can access resources from another origin.

Example:

Frontend:

```text
https://frontend.example.com
```

Backend:

```text
https://api.example.com
```

These are different origins.

The backend must provide appropriate CORS headers for permitted browser access.

Install:

```bash
npm install cors
```

Development:

```typescript
import cors from "cors";

app.use(cors({
    origin: "http://localhost:3000"
}));
```

Production:

```typescript
app.use(cors({
    origin: [
        "https://example.com",
        "https://www.example.com"
    ],
    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE"
    ],
    credentials: true
}));
```

### Important CORS Rules

- Avoid wildcard origins when using credentialed requests.
- Use an explicit origin allowlist.
- Restrict methods where practical.
- Restrict request headers where practical.
- Understand that CORS is not authentication.
- CORS does not stop non-browser clients from calling your API.

---

# 33. Security Headers with Helmet

Helmet is an Express middleware package that sets various HTTP security headers.

Install:

```bash
npm install helmet
```

Usage:

```typescript
import helmet from "helmet";

app.use(helmet());
```

Helmet helps configure headers such as:

- Content-Security-Policy.
- X-Content-Type-Options.
- Referrer-Policy.
- Strict-Transport-Security, when configured appropriately.
- X-Frame-Options or related framing controls.

## 33.1 Content Security Policy (CSP)

CSP restricts the sources from which browsers can load certain resources.

Example:

```typescript
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'"],
                imgSrc: ["'self'", "data:"]
            }
        }
    })
);
```

CSP needs to match the actual application's requirements.

Avoid blindly copying restrictive settings without testing them.

---

# 34. Secure Cookies

Cookies are commonly used for session management and refresh tokens.

A secure cookie configuration may look like:

```typescript
res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000
});
```

## 34.1 Cookie Security Attributes

| Attribute | Purpose |
|---|---|
| HttpOnly | Prevents direct JavaScript access |
| Secure | Sends cookie only over HTTPS |
| SameSite | Controls cross-site cookie sending |
| Path | Restricts URL paths where cookie is sent |
| Domain | Controls applicable hosts |
| Max-Age | Defines cookie lifetime |

### Important

- Use `Secure` in production HTTPS environments.
- Prefer `HttpOnly` for sensitive authentication cookies.
- Choose `SameSite` based on your architecture.
- Use CSRF defenses where necessary.
- Avoid unnecessarily broad cookie domains.

---

# 35. HTTPS and TLS

HTTPS is HTTP communication protected by TLS.

TLS stands for Transport Layer Security.

It protects communication between clients and servers.



## 35.1 Why HTTPS Is Important

Without HTTPS, network attackers may be able to:

- Read transmitted data.
- Modify transmitted data.
- Impersonate a server.
- Steal authentication credentials.

HTTPS provides:

1. Confidentiality.
2. Integrity.
3. Server authentication.

## 35.2 TLS Certificate

A TLS certificate helps the browser verify the server's identity.

Certificates are commonly issued by trusted Certificate Authorities (CAs).

## 35.3 Production Best Practices

- Use valid TLS certificates.
- Redirect HTTP to HTTPS.
- Enable modern TLS versions.
- Avoid mixed content.
- Use HSTS where appropriate.
- Keep certificates renewed.
- Never disable certificate validation in production.

---

# 36. Secrets Management

Secrets are sensitive values used by applications.

Examples:

- Database passwords.
- JWT signing keys.
- API keys.
- OAuth client secrets.
- Encryption keys.
- SMTP credentials.

## 36.1 Incorrect Implementation

```typescript
const JWT_SECRET = "my-secret-key";
```

Never hardcode production secrets in source code.

## 36.2 Environment Variables

```typescript
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
}
```

Example `.env`:

```env
JWT_SECRET=replace-with-a-long-random-secret
DB_PASSWORD=replace-with-database-password
API_KEY=replace-with-api-key
```

Add `.env` to `.gitignore`:

```gitignore
.env
.env.local
.env.production
```

## 36.3 Generate a Random Secret

Using Node.js:

```typescript
import crypto from "node:crypto";

const secret = crypto.randomBytes(32).toString("hex");

console.log(secret);
```

This creates 32 random bytes represented as hexadecimal.

## 36.4 Production Secrets Management

For production, prefer dedicated secret-management systems where appropriate.

Examples:

- [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/?utm_source=chatgpt.com)
- [HashiCorp Vault](https://www.vaultproject.io/?utm_source=chatgpt.com)
- [Azure Key Vault](https://azure.microsoft.com/products/key-vault/?utm_source=chatgpt.com)

Benefits:

- Centralized secret storage.
- Access control.
- Secret rotation.
- Audit logs.
- Reduced exposure in deployment systems.

---

# 37. Session Management

Session management maintains authenticated user state across multiple HTTP requests.

HTTP is stateless, so applications need a mechanism to associate requests with authenticated users.

Common approaches:

1. Server-side sessions.
2. Token-based authentication.

## 37.1 Server-Side Sessions

A typical workflow:

```text
User Login
    |
    v
Server Validates Credentials
    |
    v
Server Creates Session
    |
    v
Session Stored in Redis/Database
    |
    v
Session ID Sent in Cookie
    |
    v
Browser Sends Cookie
    |
    v
Server Loads Session
    |
    v
User Authenticated
```

Install:

```bash
npm install express-session
```

Example:

```typescript
import session from "express-session";

app.use(
    session({
        name: "app.sid",
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 1000
        }
    })
);
```

**Important:** The default Express session MemoryStore is not suitable for production. Use a persistent shared session store such as Redis or another supported store.

Also, session secrets should be validated at startup rather than assumed to exist.

## 37.2 Session Security Best Practices

- Regenerate the session ID after login.
- Destroy sessions on logout.
- Set secure cookie attributes.
- Apply idle and absolute expiration.
- Protect session endpoints against CSRF.
- Store sessions in a suitable shared store.
- Avoid storing sensitive data directly in browser-accessible storage.

---

# 38. Secure File Uploads

File uploads are a common attack surface.

Consider an application that allows users to upload profile images.

Potential risks:

- Malicious executable uploads.
- Oversized files.
- Path traversal.
- MIME type spoofing.
- Malicious image content.
- Storage exhaustion.
- Public access to private files.

## 38.1 Basic Upload Validation

Install:

```bash
npm install multer
```

Example:

```typescript
import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 2 * 1024 * 1024,
        files: 1
    },

    fileFilter: (req, file, callback) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            callback(
                new Error("Unsupported file type")
            );

            return;
        }

        callback(null, true);
    }
});
```

Route:

```typescript
app.post(
    "/upload",
    upload.single("image"),
    (req, res) => {
        if (!req.file) {
            res.status(400).json({
                message: "Image required"
            });

            return;
        }

        res.status(200).json({
            message: "Upload received"
        });
    }
);
```

### Important Security Limitations

Checking `file.mimetype` alone is insufficient because it is supplied by the client.

A production upload pipeline should:

1. Validate file size.
2. Validate the extension.
3. Inspect file signatures/magic bytes.
4. Decode and validate image content where appropriate.
5. Generate a random server-side filename.
6. Store files outside the executable application directory.
7. Prevent path traversal.
8. Scan files when risk warrants it.
9. Restrict public access.
10. Apply authorization before downloading files.

Never trust a client-provided filename or MIME type.

---

# 39. Secure Database Access

Database security is not limited to preventing SQL injection.

Other important controls include:

## 39.1 Least Privilege

Your application's database account should have only the permissions it needs.

For example:

A reporting service may need:

```text
SELECT
```

It probably does not need:

```text
DROP DATABASE
ALTER USER
CREATE USER
```

## 39.2 Secure Connection Configuration

- Use TLS for remote database connections where supported.
- Restrict network access.
- Use strong credentials.
- Rotate database passwords.
- Avoid exposing database ports publicly.
- Monitor database access.

## 39.3 Avoid Mass Assignment

Suppose your database model contains:

```typescript
interface User {
    name: string;
    email: string;
    role: string;
    isAdmin: boolean;
}
```

Dangerous:

```typescript
await UserModel.update(
    req.body,
    {
        where: {
            id: userId
        }
    }
);
```

A user might submit:

```json
{
    "name": "Ali",
    "isAdmin": true,
    "role": "admin"
}
```

Better:

```typescript
const { name, email } = req.body;

await UserModel.update(
    {
        name,
        email
    },
    {
        where: {
            id: userId
        }
    }
);
```

Only update fields the user is permitted to modify.

---

# 40. Security Testing

Security controls should be tested, not just implemented.

Examples:

| Test | Expected Behavior |
|---|---|
| Missing authentication token | 401 |
| Invalid token | 401 |
| Expired token | 401 |
| Authenticated user without permission | 403 |
| User accessing another user's expense | Denied |
| SQL injection payload | Treated as data, not SQL |
| Oversized upload | Rejected |
| Disallowed upload type | Rejected |
| Excessive login requests | Rate-limited |
| Invalid input | Rejected |
| Expired session | Authentication required |

## 40.1 Example Authorization Test

```typescript
test("should reject normal user from deleting users", async () => {
    const response = await request(app)
        .delete("/users/2")
        .set("Authorization", "Bearer valid-user-token");

    expect(response.status).toBe(403);
});
```

The token in this test should be generated or configured through a controlled test authentication setup.

## 40.2 Security Testing Tools

Useful tools include:

- [OWASP ZAP](https://www.zaproxy.org/?utm_source=chatgpt.com)
- [Burp Suite](https://portswigger.net/burp?utm_source=chatgpt.com)
- [Snyk](https://snyk.io/?utm_source=chatgpt.com)
- [npm audit documentation](https://docs.npmjs.com/cli/commands/npm-audit?utm_source=chatgpt.com)

Use security scanners against systems you own or are explicitly authorized to test.

---

# 41. Secure Node.js Production Architecture

Let's combine the concepts into a realistic architecture.

```text
                 Client
                   |
                   v
                HTTPS
                   |
                   v
              Load Balancer
                   |
                   v
              Express Server
                   |
        -------------------------
        |           |           |
        v           v           v
   Rate Limit   Helmet       CORS
        |
        v
 Authentication Middleware
        |
        v
 Authorization Middleware
        |
        v
   Input Validation
        |
        v
    Controllers
        |
        v
    Use Cases
        |
        v
    Repositories
        |
        v
       MySQL
```

Additional infrastructure:

```text
Redis
  ├── Session Storage
  ├── Rate Limit Store
  └── Caching

Secret Manager
  ├── Database Credentials
  ├── JWT Signing Keys
  └── API Secrets

Security Monitoring
  ├── Authentication Logs
  ├── Authorization Failures
  ├── Rate Limit Events
  └── Application Alerts
```

### Security Responsibilities

| Component | Responsibility |
|---|---|
| HTTPS | Protect network communication |
| Helmet | Configure security headers |
| CORS | Restrict browser cross-origin access |
| Rate Limiter | Reduce abuse |
| Authentication | Verify identity |
| Authorization | Verify permissions |
| Validation | Reject invalid input |
| Controller | Handle HTTP communication |
| Use Case | Execute application workflow |
| Repository | Access database |
| Secret Manager | Protect credentials |
| Monitoring | Detect suspicious activity |

---

# 42. Production Security Checklist

Before deploying a Node.js application, verify the following.

## Authentication

- [ ] Passwords are hashed using Argon2id, bcrypt or another appropriate password-hashing algorithm.
- [ ] Login endpoints have rate limiting.
- [ ] Access tokens have appropriate lifetimes.
- [ ] Refresh tokens can be revoked.
- [ ] Password reset flows are secure.
- [ ] MFA is considered for sensitive accounts.

## Authorization

- [ ] Every protected endpoint verifies permissions.
- [ ] Resource ownership is checked.
- [ ] Users cannot change their own role through ordinary profile updates.
- [ ] Administrative operations are restricted.
- [ ] Authorization defaults to deny.

## API Security

- [ ] Request input is validated.
- [ ] Output does not expose sensitive fields.
- [ ] Rate limiting is configured.
- [ ] CORS uses explicit trusted origins.
- [ ] Security headers are configured.
- [ ] Errors do not expose internal details.

## Database Security

- [ ] Parameterized queries are used.
- [ ] Database credentials are protected.
- [ ] Database network access is restricted.
- [ ] Database users follow least privilege.
- [ ] Backups are secured.
- [ ] Sensitive data is protected at rest where required.

## Infrastructure Security

- [ ] HTTPS is enabled.
- [ ] Secrets are not committed to Git.
- [ ] Production debug mode is disabled.
- [ ] Dependencies are scanned and maintained.
- [ ] Server ports are restricted.
- [ ] Logs are monitored.
- [ ] Backups and recovery procedures are tested.

---

# 43. Interview Questions and Answers

## Basic Questions

**Q1. What is application security?**

Application security is the process of protecting software applications against vulnerabilities and unauthorized access.

**Q2. What is the CIA Triad?**

It is a security model consisting of Confidentiality, Integrity and Availability.

**Q3. What is authentication?**

Authentication verifies the identity of a user or system.

**Q4. What is authorization?**

Authorization determines which resources or operations an authenticated user can access.

**Q5. What is the principle of least privilege?**

It means granting only the minimum permissions necessary to perform a task.

**Q6. What is OWASP?**

OWASP is an organization that publishes open security resources, tools and guidance for software developers.

**Q7. What is SQL injection?**

SQL injection occurs when untrusted input changes the structure or meaning of a SQL query.

**Q8. What is XSS?**

Cross-Site Scripting is a vulnerability where malicious scripts execute in another user's browser.

**Q9. What is CSRF?**

Cross-Site Request Forgery tricks a user's browser into sending an unintended authenticated request.

**Q10. What is SSRF?**

Server-Side Request Forgery causes a server to make unintended requests to other destinations.

## Intermediate Questions

**Q11. What is the difference between hashing and encryption?**

Hashing is designed to be one-way, while encryption is reversible with the correct key.

**Q12. Why should passwords not be encrypted instead of hashed?**

Passwords generally need verification, not recovery. Password hashing makes recovering original passwords computationally difficult.

**Q13. What is Argon2?**

Argon2 is a password-hashing algorithm. Argon2id combines protection characteristics of Argon2i and Argon2d.

**Q14. What is salt?**

Salt is a random value added during password hashing to make identical passwords produce different hashes.

**Q15. What is pepper?**

Pepper is an additional secret used in password protection and stored separately from the password database.

**Q16. What is JWT?**

JWT is a compact token format used to represent claims between systems.

**Q17. What are the three parts of JWT?**

Header, Payload and Signature.

**Q18. Is JWT encrypted by default?**

No. Ordinary signed JWTs are not encrypted.

**Q19. What is an access token?**

An access token is used to access protected resources.

**Q20. What is a refresh token?**

A refresh token is used to obtain new access tokens.

**Q21. What is refresh token rotation?**

It is the process of issuing a new refresh token and invalidating the previous one when a refresh operation succeeds.

**Q22. What is CORS?**

CORS is a browser mechanism that controls cross-origin resource access.

**Q23. Does CORS provide authentication?**

No. CORS is not an authentication or authorization mechanism.

**Q24. What is Helmet?**

Helmet is an Express middleware package that configures HTTP security headers.

**Q25. What is rate limiting?**

Rate limiting restricts how frequently a client can make requests.

## Advanced Questions

**Q26. What is OAuth 2.0?**

OAuth 2.0 is an authorization framework that allows applications to obtain limited access to protected resources.

**Q27. What is OpenID Connect?**

OpenID Connect is an identity layer built on OAuth 2.0 that standardizes authentication and identity claims.

**Q28. What is the difference between OAuth and OIDC?**

OAuth focuses on authorization, while OIDC adds authentication and standardized identity information.

**Q29. What is PKCE?**

PKCE protects OAuth authorization code flows by binding the authorization code to a client-generated verifier.

**Q30. What is RBAC?**

Role-Based Access Control grants permissions based on user roles.

**Q31. What is ABAC?**

Attribute-Based Access Control makes access decisions using user, resource, action and environment attributes.

**Q32. What is IDOR?**

Insecure Direct Object Reference is an access-control vulnerability in which users can access objects they should not be authorized to access.

**Q33. What is the difference between 401 and 403?**

401 indicates missing or invalid authentication. 403 indicates that the request is not permitted.

**Q34. Why are HttpOnly cookies useful?**

They prevent client-side JavaScript from directly reading the cookie.

**Q35. Do HttpOnly cookies completely prevent XSS attacks?**

No. They reduce direct token theft, but malicious JavaScript can still perform actions as the authenticated user.

**Q36. Why is SameSite important?**

It controls when browsers send cookies in cross-site contexts and helps mitigate certain CSRF attacks.

**Q37. What is Content Security Policy?**

CSP is a browser security mechanism that restricts the sources of scripts and other resources.

**Q38. What is a security audit log?**

It records important security-related activities for investigation and monitoring.

**Q39. Why should production errors not expose stack traces?**

They may reveal internal implementation details, file paths and other information useful to attackers.

**Q40. What is threat modeling?**

Threat modeling identifies potential security threats and helps design appropriate security controls.

**Q41. What is the STRIDE model?**

STRIDE is a threat-modeling framework covering Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service and Elevation of Privilege.

**Q42. Why is dependency scanning important?**

It identifies known vulnerabilities in third-party packages used by an application.

**Q43. What is secure session management?**

It involves securely creating, maintaining, expiring and invalidating authenticated sessions.

**Q44. What is mass assignment?**

Mass assignment occurs when an application blindly assigns user-controlled fields to an object or database model.

**Q45. Why should file uploads be validated using file signatures?**

Because client-provided MIME types and file extensions can be spoofed.

**Q46. What is HSTS?**

HTTP Strict Transport Security tells browsers to use HTTPS for a domain according to the configured policy.

**Q47. What is a supply chain attack?**

It is an attack that compromises a dependency, development tool, build system or another part of the software supply chain.

**Q48. What is defense in depth?**

Defense in depth uses multiple independent security controls so that failure of one control does not compromise the entire system.

**Q49. Why should JWT algorithms be explicitly restricted during verification?**

To prevent accepting unexpected algorithms and reduce algorithm-confusion risks.

**Q50. What is the difference between a signed JWT and an encrypted JWT?**

A signed JWT protects integrity and authenticity. An encrypted JWT also protects the confidentiality of its claims.

---

# 44. Practical Exercises

Complete these exercises to strengthen your security engineering knowledge.

## Beginner Level

### Exercise 1: Password Security

Create a registration and login system using:

- TypeScript.
- Express.js.
- Argon2.
- MySQL or MongoDB.

Requirements:

- Hash passwords during registration.
- Store only password hashes.
- Verify passwords during login.
- Never return password hashes in API responses.

### Exercise 2: JWT Authentication

Implement:

- JWT generation.
- JWT verification.
- Authentication middleware.
- Protected API endpoints.
- Token expiration.

### Exercise 3: Input Validation

Create validation schemas for:

- User registration.
- Login.
- Expense creation.
- Expense update.

Use Zod.

### Exercise 4: Security Headers

Configure:

- Helmet.
- CORS.
- HTTPS.
- Secure cookies.

## Intermediate Level

### Exercise 5: RBAC

Create three roles:

- Admin.
- Manager.
- User.

Implement permission checks for:

- Creating expenses.
- Reading expenses.
- Updating expenses.
- Deleting users.
- Managing categories.

### Exercise 6: Rate Limiting

Implement:

- Global API rate limiting.
- Login rate limiting.
- Password reset rate limiting.

Use a shared store when testing a multi-instance setup.

### Exercise 7: Prevent IDOR

Create two users.

Verify that:

- User A can access their own expenses.
- User B cannot access User A's expenses.
- User B cannot update User A's expenses.
- User B cannot delete User A's expenses.

### Exercise 8: Secure File Upload

Implement:

- File size validation.
- MIME type checks.
- File signature checks.
- Random filenames.
- Secure storage.
- Authorization for downloads.

## Advanced Level

### Exercise 9: OAuth 2.0 and OIDC

Implement login through an external identity provider using:

- Authorization Code Flow.
- PKCE.
- ID token validation.
- Secure session management.

### Exercise 10: Refresh Token Rotation

Implement:

- Short-lived access tokens.
- Refresh tokens.
- Refresh token storage.
- Token rotation.
- Token reuse detection.
- Logout and revocation.

### Exercise 11: Security Audit Logging

Record:

- Failed login attempts.
- Successful login.
- Password changes.
- Permission changes.
- Unauthorized access attempts.
- Administrative operations.

Avoid logging passwords and tokens.

### Exercise 12: Complete Security Hardening

Take your Expense Tracker application and implement:

- OWASP security controls.
- Authentication.
- Authorization.
- SQL/NoSQL injection prevention.
- XSS prevention.
- CSRF protection where applicable.
- Rate limiting.
- CORS.
- Helmet.
- Secure cookies.
- Secrets management.
- Security testing.

---

# 45. Phase 59 Completion Checklist

| Topic | Expected Knowledge |
|---|---|
| Security Fundamentals | Security concepts and risk |
| CIA Triad | Confidentiality, Integrity, Availability |
| Authentication | Identity verification |
| Authorization | Permission management |
| OWASP Top 10 | All 10 categories |
| SQL Injection | Parameterized queries |
| NoSQL Injection | Input validation |
| Command Injection | Safe process execution |
| XSS | Stored, reflected and DOM-based |
| CSRF | CSRF tokens and cookie controls |
| SSRF | Destination validation and network restrictions |
| Cryptography | Hashing, encryption and encoding |
| Password Security | Argon2id, bcrypt, salt and pepper |
| JWT | Structure, signing and verification |
| Access Tokens | Short-lived API access |
| Refresh Tokens | Rotation and revocation |
| OAuth 2.0 | Authorization framework |
| PKCE | Authorization code protection |
| OpenID Connect | Identity and authentication |
| RBAC | Role-based permissions |
| ABAC | Attribute-based policies |
| API Security | Validation and rate limiting |
| CORS | Cross-origin configuration |
| Helmet | HTTP security headers |
| Secure Cookies | HttpOnly, Secure and SameSite |
| HTTPS/TLS | Secure communication |
| Secrets Management | Protecting application credentials |
| Session Management | Secure session lifecycle |
| File Upload Security | File validation and storage |
| Database Security | Least privilege and secure queries |
| Security Testing | Verify security controls |

---

# 46. What You Should Be Able to Build After Phase 59

You should now have the knowledge required to:

1. Build a secure Node.js authentication system.
2. Implement JWT-based authentication.
3. Implement access and refresh token workflows.
4. Integrate OAuth 2.0 and OpenID Connect.
5. Build RBAC and ABAC authorization.
6. Protect REST APIs against common attacks.
7. Secure database queries.
8. Protect sensitive information.
9. Configure production security headers.
10. Implement secure session management.
11. Harden file upload functionality.
12. Perform basic application security assessments.

**Most important takeaway:**

Security should be designed into the application from the beginning. It should not be treated as a feature added just before deployment.

Authentication alone does not make an application secure. You must also protect authorization boundaries, data, dependencies, sessions, APIs, infrastructure and operational processes.

---

# Next Phase

## Phase 60: Advanced TypeScript – Performance Engineering, Profiling, Memory Management, Event Loop Optimization, Worker Threads, Streams, Caching, Database Optimization and Production Monitoring

Upcoming topics:

1. Performance Engineering Fundamentals.
2. Latency vs Throughput.
3. CPU-Bound vs I/O-Bound Operations.
4. Node.js Event Loop Deep Dive.
5. Event Loop Phases.
6. Microtasks and Macrotasks.
7. Blocking vs Non-Blocking Operations.
8. Memory Management.
9. V8 Garbage Collection.
10. Heap and Stack Memory.
11. Memory Leaks.
12. Heap Snapshots.
13. CPU Profiling.
14. Performance Profiling.
15. Node.js Worker Threads.
16. Child Processes.
17. Cluster Module.
18. Streams and Backpressure.
19. Buffer Management.
20. Async Performance Optimization.
21. Database Query Optimization.
22. Connection Pool Optimization.
23. Redis Caching Strategies.
24. HTTP Caching.
25. CDN Optimization.
26. Compression.
27. Lazy Loading.
28. Pagination and Cursor-Based Pagination.
29. Batch Processing.
30. Queue-Based Processing.
31. Load Testing.
32. Benchmarking.
33. Performance Monitoring.
34. APM Tools.
35. Production Performance Optimization.

**Phase 59 completed.**

When you're ready, say: **OK, Phase 60**.