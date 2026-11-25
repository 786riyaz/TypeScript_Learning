# Phase 64: Advanced TypeScript – Advanced Security Engineering, Application Security, Authentication, Authorization, Cryptography, OWASP, Zero Trust and Secure System Architecture

**Level:** Expert / Advanced Security Engineering  
**Prerequisites:** TypeScript, JavaScript, Node.js, Express.js, React, Next.js, SQL, MongoDB, Redis, Microservices, Distributed Systems and Phase 63.

---

# 1. Learning Objectives

In this phase, you will learn how to design, develop and maintain secure applications using TypeScript and modern backend technologies.

You will understand:

1. Security engineering fundamentals.
2. CIA Triad.
3. Authentication vs Authorization.
4. Session-based authentication.
5. JWT architecture.
6. Access tokens and refresh tokens.
7. OAuth 2.0.
8. OpenID Connect.
9. Single Sign-On (SSO).
10. SAML authentication.
11. RBAC and ABAC.
12. Password hashing.
13. bcrypt, Argon2 and scrypt.
14. Cryptography fundamentals.
15. Symmetric and asymmetric encryption.
16. RSA and Elliptic Curve Cryptography.
17. Digital signatures.
18. TLS and HTTPS.
19. Certificate management.
20. Key Management Systems.
21. OWASP Top 10.
22. SQL Injection.
23. Cross-Site Scripting (XSS).
24. Cross-Site Request Forgery (CSRF).
25. Server-Side Request Forgery (SSRF).
26. Broken Access Control.
27. Security misconfiguration.
28. CORS security.
29. Content Security Policy.
30. API security.
31. Brute-force protection.
32. Secure file uploads.
33. Secrets management.
34. Dependency and supply chain security.
35. Zero Trust Architecture.
36. Secure microservices.
37. Security logging and monitoring.
38. Threat modeling.
39. Security testing.
40. Secure TypeScript and Node.js architecture.

---

# 2. Security Engineering Fundamentals

## 2.1 What Is Security Engineering?

Security engineering is the discipline of designing, implementing and maintaining systems that protect applications, infrastructure and data from unauthorized access, attacks and misuse.

Consider an expense management application.

It stores:

- User credentials.
- Personal information.
- Financial records.
- Transaction history.
- Company information.
- Authentication tokens.

If an attacker gains access to this information, the application may suffer financial, legal and reputational damage.

Security engineering focuses on preventing such situations.

### Security Engineering Responsibilities

1. Protect user identities.
2. Protect sensitive data.
3. Prevent unauthorized access.
4. Secure API endpoints.
5. Encrypt sensitive communication.
6. Detect suspicious activities.
7. Prevent common application vulnerabilities.
8. Manage secrets securely.
9. Monitor security events.
10. Respond to security incidents.

## 2.2 Security vs Privacy

These concepts are related but different.

| Security | Privacy |
|---|---|
| Protects systems and information from unauthorized access | Controls how personal information is collected and used |
| Focuses on confidentiality, integrity and availability | Focuses on appropriate handling of personal information |
| Includes encryption and access control | Includes consent, retention and data minimization |

For example:

- Encryption is a security control.
- Collecting only necessary user information is a privacy practice.

Both are important when developing applications.

---

# 3. CIA Triad

The CIA Triad is a fundamental security model.

CIA stands for:

1. Confidentiality.
2. Integrity.
3. Availability.

## 3.1 Confidentiality

Confidentiality ensures that information is accessible only to authorized users.

Example:

A user should not be able to access another user's financial records.

Possible security mechanisms:

- Authentication.
- Authorization.
- Encryption.
- Access control.
- Secure key management.

## 3.2 Integrity

Integrity ensures that data cannot be modified improperly or without authorization.

Example:

A user should not be able to change a transaction amount from ₹500 to ₹50,000 without authorization.

Possible mechanisms:

- Database constraints.
- Digital signatures.
- Cryptographic hashes.
- Audit logs.
- Authorization checks.

## 3.3 Availability

Availability ensures that authorized users can access the system when needed.

Example:

An online banking application should remain accessible despite individual server failures.

Possible mechanisms:

- Load balancing.
- Redundancy.
- DDoS protection.
- Backups.
- Disaster recovery.
- Fault tolerance.

### CIA Triad Comparison

| Principle | Main Objective | Example |
|---|---|---|
| Confidentiality | Prevent unauthorized disclosure | Encrypt user information |
| Integrity | Prevent unauthorized modification | Verify digital signatures |
| Availability | Keep services accessible | Use redundant servers |

**Interview Point:** A secure application must consider all three properties. Improving one property does not automatically guarantee the other two.

---

# 4. Authentication vs Authorization

These are two of the most important concepts in application security.

## 4.1 Authentication

Authentication answers:

**Who are you?**

It verifies the identity of a user or system.

Examples:

- Email and password.
- OTP.
- Passkeys.
- Biometrics.
- Authentication tokens.
- Hardware security keys.

Example:

```text
User enters:

Email: user@example.com
Password: ********

        |
        v

Authentication System

        |
        v

Identity Verified
```

## 4.2 Authorization

Authorization answers:

**What are you allowed to do?**

It determines which resources or operations an authenticated identity can access.

Example:

```text
User: John

Role: Employee

Permissions:
- View own expenses
- Create expenses
- Update own expenses

Not Allowed:
- Delete another employee's expenses
- Manage company users
```

## 4.3 Authentication vs Authorization

| Feature | Authentication | Authorization |
|---|---|---|
| Purpose | Verify identity | Verify permissions |
| Question | Who are you? | What can you access? |
| Happens | Before authorization | After identity is established |
| Example | Login | Access admin dashboard |
| Failure | 401 Unauthorized | 403 Forbidden |

### HTTP Status Codes

**401 Unauthorized**

The request lacks valid authentication credentials.

**403 Forbidden**

The server understood the request but refuses to authorize the operation.

### TypeScript Example

```typescript
interface User {
  id: number;
  email: string;
  role: "admin" | "user";
}

function authenticate(
  token: string
): User | null {
  // Verify token and return trusted identity.
  return null;
}

function authorize(
  user: User,
  requiredRole: User["role"]
): boolean {
  return user.role === requiredRole;
}
```

This is a conceptual example. Real authentication must cryptographically verify credentials or tokens.

---

# 5. Session-Based Authentication

## 5.1 What Is Session-Based Authentication?

Session-based authentication stores authentication state on the server.

After a successful login, the server creates a session and gives the client a session identifier.

The browser sends that identifier with subsequent requests.

### Architecture

```text
              Browser
                 |
                 | Email + Password
                 v
             Backend API
                 |
                 v
          Verify Credentials
                 |
                 v
           Create Session
                 |
                 v
              Redis
                 |
                 v
       Set Session Cookie
                 |
                 v
              Browser
```

## 5.2 Authentication Flow

Step 1: User submits credentials.

```http
POST /login
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
```

Step 2: Backend verifies the password.

Step 3: Backend creates a session.

```json
{
  "userId": 101,
  "role": "user",
  "createdAt": 1795700000
}
```

Step 4: Backend stores the session in Redis or another session store.

Step 5: Backend sends a session cookie.

```http
Set-Cookie: sessionId=opaque-session-id; HttpOnly; Secure; SameSite=Lax
```

Step 6: Browser automatically sends the cookie on eligible requests.

## 5.3 Express Session Example

Install dependencies:

```bash
npm install express express-session connect-redis redis
```

Example:

```typescript
import express from "express";
import session from "express-session";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";

const app = express();

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

await redisClient.connect();

app.use(
  session({
    store: new RedisStore({
      client: redisClient,
    }),

    secret: process.env.SESSION_SECRET!,

    resave: false,

    saveUninitialized: false,

    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    },
  })
);
```

Production considerations:

- Use a cryptographically random session secret.
- Never use the default in-memory session store in production.
- Configure trusted proxy settings correctly when behind a proxy.
- Use HTTPS.
- Regenerate the session ID after login and privilege changes.
- Destroy the session during logout.
- Configure session expiration and renewal.
- Add CSRF protection when using cookie-based authentication.

## 5.4 Session Fixation

Session fixation occurs when an attacker causes a victim to use a session identifier known to the attacker.

A defensive measure is to regenerate the session identifier after authentication.

Conceptually:

```typescript
req.session.regenerate((error) => {
  if (error) {
    return;
  }

  req.session.userId = authenticatedUser.id;
});
```

## 5.5 Session-Based Authentication Advantages

- Server controls session validity.
- Sessions can be revoked centrally.
- Sensitive session data stays on the server.
- Suitable for traditional web applications.

## 5.6 Disadvantages

- Requires shared session storage for multiple servers.
- Requires session lifecycle management.
- Cross-origin cookie configuration can be complicated.

---

# 6. JSON Web Token (JWT) Architecture

## 6.1 What Is JWT?

JWT stands for JSON Web Token.

It is a compact token format used to transmit claims between parties.

JWT is commonly used for authentication and authorization workflows.

A JWT generally has three parts:

```text
HEADER.PAYLOAD.SIGNATURE
```

Example:

```text
xxxxx.yyyyy.zzzzz
```

## 6.2 JWT Structure

### Part 1: Header

The header describes the token type and signing algorithm.

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Part 2: Payload

The payload contains claims.

```json
{
  "sub": "101",
  "email": "user@example.com",
  "role": "admin",
  "iat": 1795700000,
  "exp": 1795703600
}
```

Common claims:

| Claim | Meaning |
|---|---|
| sub | Subject |
| iss | Issuer |
| aud | Audience |
| exp | Expiration time |
| iat | Issued at |
| nbf | Not before |
| jti | JWT ID |

### Part 3: Signature

The signature helps verify that the token has not been modified and was signed by an entity possessing the appropriate signing key.

## 6.3 Important: JWT Is Not Encrypted by Default

A normal signed JWT is encoded, not encrypted.

Anyone who obtains it can decode and inspect its payload.

Therefore, never place:

- Passwords.
- Private keys.
- API secrets.
- Sensitive personal information.

inside an ordinary signed JWT.

## 6.4 JWT Authentication Flow

```text
              User
                |
                v
            Login API
                |
                v
       Verify Credentials
                |
                v
         Generate JWT
                |
                v
          Return Token
                |
                v
              User
                |
                v
       Authorization Header
                |
                v
          Backend API
                |
                v
        Verify JWT Signature
                |
                v
         Validate Claims
                |
                v
          Allow / Reject
```

## 6.5 Generate JWT Using TypeScript

Install:

```bash
npm install jsonwebtoken
npm install -D @types/jsonwebtoken
```

Example:

```typescript
import jwt from "jsonwebtoken";

interface AccessTokenPayload {
  userId: number;
  role: string;
}

const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET!;

function generateAccessToken(
  user: AccessTokenPayload
): string {
  return jwt.sign(
    {
      userId: user.userId,
      role: user.role,
    },
    accessTokenSecret,
    {
      expiresIn: "15m",
      issuer: "my-api",
      audience: "my-client",
    }
  );
}
```

## 6.6 Verify JWT

```typescript
import jwt from "jsonwebtoken";

function verifyAccessToken(token: string) {
  try {
    return jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
      {
        issuer: "my-api",
        audience: "my-client",
        algorithms: ["HS256"],
      }
    );
  } catch {
    return null;
  }
}
```

Never decode a JWT and treat the decoded information as trusted without verifying the signature and required claims.

## 6.7 JWT Security Considerations

1. Use strong signing keys.
2. Validate expiration.
3. Validate issuer.
4. Validate audience.
5. Explicitly allow expected algorithms.
6. Reject unsigned or unexpected algorithm tokens.
7. Keep access tokens short-lived.
8. Avoid sensitive payload data.
9. Implement revocation or rotation strategies where needed.
10. Protect token storage and transport.

---

# 7. Access Tokens and Refresh Tokens

## 7.1 What Is an Access Token?

An access token is a credential used to access protected resources.

Example:

```text
Lifetime: 15 Minutes
```

It is sent with API requests.

```http
Authorization: Bearer ACCESS_TOKEN
```

## 7.2 What Is a Refresh Token?

A refresh token is a longer-lived credential used to obtain new access tokens without requiring the user to log in again.

Example:

```text
Access Token: 15 Minutes
Refresh Token: 7 Days
```

These durations are examples, not universal security recommendations.

## 7.3 Why Use Two Tokens?

If an access token is stolen, a short expiration limits its useful lifetime.

A refresh token allows legitimate users to obtain new access tokens.

### Authentication Flow

```text
              User Login
                  |
                  v
          Verify Credentials
                  |
                  v
         Generate Two Tokens
             /         \
            v           v
      Access Token  Refresh Token
            |           |
            v           v
       API Requests   Secure Storage
```

When the access token expires:

```text
Client
  |
  v
Access Token Expired
  |
  v
Refresh Endpoint
  |
  v
Validate Refresh Token
  |
  v
Issue New Access Token
```

## 7.4 Refresh Token Rotation

Refresh token rotation means issuing a new refresh token whenever an existing refresh token is successfully used.

The previous refresh token is invalidated.

Example:

```text
Refresh Token A
       |
       v
Refresh Request
       |
       v
Issue Token B
       |
       v
Invalidate Token A
```

This helps detect refresh token replay.

If an already-used refresh token is presented again, the system may identify possible token theft and revoke the affected token family.

## 7.5 Token Storage

| Storage | Consideration |
|---|---|
| Local Storage | Accessible to JavaScript; exposed if XSS occurs |
| Session Storage | Also accessible to JavaScript |
| HttpOnly Cookie | Not accessible to JavaScript, but cookie-based requests need CSRF protection |
| Server-Side Storage | Provides centralized control and revocation |

A common web application approach is to use appropriately configured HttpOnly, Secure cookies.

## 7.6 Refresh Token Database Design

Example:

```sql
CREATE TABLE refresh_tokens (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    family_id VARCHAR(100) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Store a cryptographic hash of the refresh token rather than the raw token.

This reduces the impact of a database leak.

---

# 8. OAuth 2.0

## 8.1 What Is OAuth 2.0?

OAuth 2.0 is an authorization framework that allows a client application to access protected resources on behalf of a user or itself.

It is commonly used when an application needs access to resources controlled by another service.

Example:

You want your application to access a user's Google Calendar.

Instead of asking the user for their Google password, your application redirects the user through an authorization process.

The user grants permission.

Your application receives an access token with appropriate permissions.

## 8.2 OAuth 2.0 Participants

| Participant | Meaning |
|---|---|
| Resource Owner | User who owns the data |
| Client | Application requesting access |
| Authorization Server | Issues access tokens |
| Resource Server | Hosts protected resources |

### Architecture

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
          Access Token
                |
                v
          Resource Server
                |
                v
          Protected Data
```

## 8.3 Authorization Code Flow

The Authorization Code Flow is commonly used for applications that can securely manage a client credential.

```text
1. User opens application.

2. Application redirects user to authorization server.

3. User authenticates.

4. User grants permission.

5. Authorization server redirects with authorization code.

6. Client exchanges code for tokens.

7. Client uses access token to access resources.
```

## 8.4 PKCE

PKCE stands for Proof Key for Code Exchange.

It protects authorization code flows against authorization code interception.

The client generates:

- Code Verifier.
- Code Challenge.

The authorization server associates the challenge with the authorization request.

During token exchange, the client supplies the verifier.

The server checks that it corresponds to the original challenge.

PKCE is required for public clients under modern OAuth security guidance and is strongly recommended more broadly.

## 8.5 OAuth 2.0 Grant Types

Important flows include:

| Flow | Typical Use |
|---|---|
| Authorization Code + PKCE | User-facing applications |
| Client Credentials | Machine-to-machine access |
| Device Authorization | Devices with limited input capabilities |
| Refresh Token | Obtain replacement access tokens |

The Resource Owner Password Credentials grant should not be used for new applications.

Implicit flow is also no longer recommended for modern applications.

## 8.6 OAuth Scopes

Scopes define what access the client requests.

Example:

```text
profile
email
calendar.readonly
```

The user may authorize access to only the requested resources.

**Important:** OAuth 2.0 is an authorization framework. It does not, by itself, define a standardized user authentication protocol.

That is where OpenID Connect comes in.

---

# 9. OpenID Connect (OIDC)

## 9.1 What Is OpenID Connect?

OpenID Connect is an identity layer built on top of OAuth 2.0.

It allows applications to authenticate users and obtain standardized identity information.

OAuth 2.0 primarily addresses authorization.

OIDC adds authentication.

## 9.2 OIDC Components

OIDC commonly introduces:

- ID Token.
- UserInfo Endpoint.
- Standard identity claims.
- Discovery metadata.
- JWKS endpoint.

## 9.3 ID Token vs Access Token

| Feature | ID Token | Access Token |
|---|---|---|
| Purpose | Communicate authentication information | Access protected resources |
| Audience | Client application | Resource server |
| Contains identity claims | Usually | Not necessarily |
| Used for API authorization | Generally no | Yes, according to the resource server's policy |

Example ID token payload:

```json
{
  "iss": "https://identity.example.com",
  "sub": "user-101",
  "aud": "client-123",
  "email": "user@example.com",
  "email_verified": true
}
```

## 9.4 OIDC Authentication Flow

```text
User
 |
 v
Application
 |
 v
Identity Provider
 |
 v
User Authentication
 |
 v
Authorization Code
 |
 v
Token Endpoint
 |
 +------> ID Token
 |
 +------> Access Token
 |
 v
Application
```

The application must validate the ID token's signature, issuer, audience, expiration, nonce where applicable and other required claims.

## 9.5 Popular Identity Providers

- Google
- Microsoft
- Auth0
- Keycloak

---

# 10. Single Sign-On (SSO) and SAML

## 10.1 What Is Single Sign-On?

Single Sign-On allows users to authenticate once with an identity provider and access multiple applications without independently logging in to each application.

Example:

A company uses:

- HR application.
- Expense application.
- Project management application.
- Internal dashboard.

Employees authenticate through one corporate identity provider.

```text
                 Employee
                     |
                     v
               Identity Provider
                     |
          +----------+----------+
          |          |          |
          v          v          v
         HR       Expense     Project
         App       App         App
```

## 10.2 What Is SAML?

SAML stands for Security Assertion Markup Language.

It is an XML-based standard commonly used for enterprise identity federation and Single Sign-On.

SAML uses signed assertions to communicate authentication and authorization-related information between identity providers and service providers.

## 10.3 SAML Participants

| Participant | Meaning |
|---|---|
| Identity Provider (IdP) | Authenticates the user |
| Service Provider (SP) | Application the user wants to access |
| SAML Assertion | Signed XML statement about the authentication or user attributes |

## 10.4 SAML Authentication Flow

```text
User
 |
 v
Service Provider
 |
 v
Identity Provider
 |
 v
User Authentication
 |
 v
Signed SAML Assertion
 |
 v
Service Provider
 |
 v
User Access Granted
```

The service provider validates the assertion's signature, issuer, audience, timestamps and other required conditions.

## 10.5 SAML vs OIDC

| Feature | SAML | OIDC |
|---|---|---|
| Data format | XML | JSON / JWT commonly |
| Main use | Enterprise SSO | Modern web/mobile authentication |
| Protocol basis | XML-based federation standard | Identity layer over OAuth 2.0 |
| Typical integration | Enterprise identity systems | Web, mobile and API ecosystems |

---

# 11. Role-Based Access Control (RBAC)

## 11.1 What Is RBAC?

RBAC stands for Role-Based Access Control.

Permissions are assigned to roles, and users receive permissions through their assigned roles.

Example:

```text
Admin:
- Create users
- Delete users
- View reports
- Manage settings

Manager:
- View reports
- Approve expenses

Employee:
- Create expenses
- View own expenses
```

## 11.2 RBAC Architecture

```text
User
 |
 v
Role
 |
 v
Permissions
 |
 v
Allowed Operations
```

## 11.3 Database Design

Users:

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    email VARCHAR(255) UNIQUE
);
```

Roles:

```sql
CREATE TABLE roles (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100) UNIQUE
);
```

Permissions:

```sql
CREATE TABLE permissions (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100) UNIQUE
);
```

User roles:

```sql
CREATE TABLE user_roles (
    user_id BIGINT,
    role_id BIGINT,
    PRIMARY KEY (user_id, role_id)
);
```

Role permissions:

```sql
CREATE TABLE role_permissions (
    role_id BIGINT,
    permission_id BIGINT,
    PRIMARY KEY (role_id, permission_id)
);
```

## 11.4 TypeScript RBAC Example

```typescript
type Permission =
  | "user:create"
  | "user:delete"
  | "expense:create"
  | "expense:read"
  | "expense:approve";

type Role =
  | "admin"
  | "manager"
  | "employee";

const rolePermissions: Record<
  Role,
  Permission[]
> = {
  admin: [
    "user:create",
    "user:delete",
    "expense:create",
    "expense:read",
    "expense:approve",
  ],

  manager: [
    "expense:read",
    "expense:approve",
  ],

  employee: [
    "expense:create",
    "expense:read",
  ],
};

function hasPermission(
  role: Role,
  permission: Permission
): boolean {
  return rolePermissions[role].includes(
    permission
  );
}

console.log(
  hasPermission("manager", "expense:approve")
);
```

This is a simplified example. Real applications should load permissions from trusted server-side state and enforce resource-level ownership checks.

---

# 12. Attribute-Based Access Control (ABAC)

## 12.1 What Is ABAC?

ABAC stands for Attribute-Based Access Control.

It makes access decisions based on attributes of:

- User.
- Resource.
- Action.
- Environment.

Example:

A manager may approve an expense only when:

- The expense belongs to their department.
- The amount is below ₹50,000.
- The expense status is pending.
- The manager has an active account.

## 12.2 ABAC Example

```typescript
interface UserContext {
  userId: number;
  departmentId: number;
  role: string;
}

interface Expense {
  id: number;
  departmentId: number;
  amount: number;
  status: "pending" | "approved";
}

function canApproveExpense(
  user: UserContext,
  expense: Expense
): boolean {
  return (
    user.role === "manager" &&
    user.departmentId === expense.departmentId &&
    expense.amount <= 50000 &&
    expense.status === "pending"
  );
}
```

## 12.3 RBAC vs ABAC

| Feature | RBAC | ABAC |
|---|---|---|
| Access based on | Roles | Attributes and policies |
| Complexity | Lower | Higher |
| Flexibility | Role-oriented | More granular |
| Example | Admin can delete users | Manager can approve expenses under a threshold |
| Best for | Standard role structures | Context-sensitive authorization |

Many enterprise applications combine RBAC and ABAC.

---

# 13. Password Security and Hashing

## 13.1 Why Should Passwords Be Hashed?

Passwords should never be stored in plaintext.

Incorrect:

```sql
INSERT INTO users (
    email,
    password
)
VALUES (
    'user@example.com',
    'MyPassword123'
);
```

If the database is compromised, attackers immediately obtain user passwords.

Instead, store password hashes.

## 13.2 Hashing vs Encryption

| Feature | Hashing | Encryption |
|---|---|---|
| Direction | One-way | Reversible with key |
| Original value recovery | Not normally possible | Possible with correct key |
| Purpose | Password verification, integrity checks | Confidentiality |
| Example | Argon2id | AES-256-GCM |

Password hashing should use a dedicated password hashing algorithm, not a fast general-purpose hash such as plain SHA-256.

## 13.3 Password Verification

Registration:

```text
Password
   |
   v
Password Hashing Algorithm
   |
   v
Password Hash
   |
   v
Database
```

Login:

```text
Entered Password
      |
      v
Stored Password Hash
      |
      v
Verification Function
      |
      v
Match / No Match
```

The application verifies the password using the stored hash's parameters and salt.

---

# 14. bcrypt, Argon2 and scrypt

These are password hashing algorithms designed to make password guessing expensive.

## 14.1 bcrypt

bcrypt is a password hashing algorithm designed to resist brute-force attacks.

Install:

```bash
npm install bcrypt
npm install -D @types/bcrypt
```

Example:

```typescript
import bcrypt from "bcrypt";

async function hashPassword(
  password: string
): Promise<string> {
  const saltRounds = 12;

  return bcrypt.hash(
    password,
    saltRounds
  );
}

async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  return bcrypt.compare(
    password,
    storedHash
  );
}
```

The cost factor should be benchmarked for your production environment.

## 14.2 Argon2

Argon2 is a modern password hashing algorithm.

Argon2id combines data-independent and data-dependent memory access characteristics and is commonly recommended for password storage.

Install:

```bash
npm install argon2
```

Example:

```typescript
import argon2 from "argon2";

async function hashPassword(
  password: string
): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
}

async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return argon2.verify(hash, password);
}
```

These settings are an example baseline, not a universal production configuration. Benchmark and tune them for your infrastructure.

## 14.3 scrypt

scrypt is another password-based key derivation function designed to be computationally and memory expensive.

It is available in Node.js:

```typescript
import {
  scrypt,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

async function hashPassword(
  password: string
): Promise<string> {
  const salt = randomBytes(16);

  const derivedKey = await scryptAsync(
    password,
    salt,
    64
  ) as Buffer;

  return [
    salt.toString("hex"),
    derivedKey.toString("hex"),
  ].join(":");
}
```

For verification, derive a new key using the stored salt and compare it with the stored derived key using a timing-safe comparison.

## 14.4 bcrypt vs Argon2 vs scrypt

| Feature | bcrypt | Argon2id | scrypt |
|---|---|---|---|
| Password hashing | Yes | Yes | Yes |
| Memory hardness | Limited | Yes | Yes |
| Configurable cost | Yes | Yes | Yes |
| Modern recommendation | Acceptable | Strong choice | Good choice |
| Typical use | Existing systems and new systems | New password storage systems | Password-based key derivation |

### Password Security Best Practices

1. Never store plaintext passwords.
2. Use Argon2id, bcrypt or scrypt.
3. Use a unique salt per password.
4. Benchmark cost parameters.
5. Apply login rate limits.
6. Prevent user enumeration.
7. Support secure password reset.
8. Never log passwords.
9. Use multi-factor authentication for sensitive accounts.
10. Consider breached-password screening.

---

# 15. Cryptography Fundamentals

## 15.1 What Is Cryptography?

Cryptography is the science of protecting information using mathematical techniques.

It helps achieve:

- Confidentiality.
- Integrity.
- Authentication.
- Non-repudiation in appropriate digital-signature contexts.

## 15.2 Important Cryptographic Terms

| Term | Meaning |
|---|---|
| Plaintext | Original readable information |
| Ciphertext | Encrypted information |
| Encryption | Transforming plaintext into ciphertext |
| Decryption | Recovering plaintext |
| Key | Secret or private cryptographic value |
| Salt | Random value used in password hashing |
| IV / Nonce | Value used by certain encryption modes |
| Hash | Fixed-length digest of input data |
| Signature | Cryptographic proof associated with a private key |

## 15.3 Three Important Cryptographic Operations

### A. Hashing

```text
Input
  |
  v
Hash Function
  |
  v
Digest
```

Example algorithms:

- SHA-256.
- SHA-512.
- SHA-3.

### B. Encryption

```text
Plaintext
    |
    v
Encryption + Key
    |
    v
Ciphertext
```

### C. Digital Signature

```text
Message
   |
   v
Private Key
   |
   v
Digital Signature
```

The corresponding public key can verify the signature.

---

# 16. Symmetric vs Asymmetric Encryption

## 16.1 Symmetric Encryption

Symmetric encryption uses the same secret key for encryption and decryption.

```text
           Secret Key
          /          \
         v            v
    Encryption     Decryption
         |            |
         v            v
      Ciphertext -> Plaintext
```

Example:

AES-256-GCM.

Advantages:

- Fast.
- Efficient for large amounts of data.
- Suitable for database and file encryption.

Disadvantages:

- Secret key distribution and management are challenging.

## 16.2 Asymmetric Encryption

Asymmetric cryptography uses a key pair:

- Public key.
- Private key.

Example:

```text
Public Key
     |
     v
Encryption
     |
     v
Ciphertext
     |
     v
Private Key
     |
     v
Decryption
```

This simplified flow describes public-key encryption. Digital signatures use the key pair differently: signing uses the private key and verification uses the public key.

Examples:

- RSA.
- Elliptic Curve Cryptography.

## 16.3 Comparison

| Feature | Symmetric | Asymmetric |
|---|---|---|
| Keys | Shared secret key | Public/private key pair |
| Speed | Generally faster | Generally slower |
| Main use | Bulk data encryption | Key exchange, signatures, selected encryption workflows |
| Example | AES-GCM | RSA, ECDSA, Ed25519 |

In modern TLS, asymmetric cryptography and key agreement help establish secure session keys, while symmetric cryptography protects application data efficiently.

---

# 17. AES Encryption with Node.js

AES stands for Advanced Encryption Standard.

AES supports key sizes of:

- 128 bits.
- 192 bits.
- 256 bits.

AES-GCM is an authenticated encryption mode that provides confidentiality and integrity protection.

### TypeScript Example

```typescript
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto";

const algorithm = "aes-256-gcm";

function encrypt(
  text: string,
  key: Buffer
) {
  const iv = randomBytes(12);

  const cipher = createCipheriv(
    algorithm,
    key,
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString("hex"),
    encrypted: encrypted.toString("hex"),
    authTag: authTag.toString("hex"),
  };
}

function decrypt(
  encryptedData: {
    iv: string;
    encrypted: string;
    authTag: string;
  },
  key: Buffer
) {
  const decipher = createDecipheriv(
    algorithm,
    key,
    Buffer.from(encryptedData.iv, "hex")
  );

  decipher.setAuthTag(
    Buffer.from(encryptedData.authTag, "hex")
  );

  const decrypted = Buffer.concat([
    decipher.update(
      Buffer.from(encryptedData.encrypted, "hex")
    ),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

const key = randomBytes(32);

const encrypted = encrypt(
  "Sensitive application data",
  key
);

const decrypted = decrypt(
  encrypted,
  key
);

console.log(decrypted);
```

### Important Security Rules

- Keep encryption keys secret.
- Use a unique nonce/IV for every encryption operation with a given key where required by the algorithm.
- Never reuse a GCM nonce with the same key.
- Store the authentication tag.
- Authenticate metadata using additional authenticated data when appropriate.
- Implement key rotation.
- Do not hardcode production keys.

---

# 18. RSA and Elliptic Curve Cryptography

## 18.1 RSA

RSA is an asymmetric cryptographic algorithm.

It is used for:

- Digital signatures.
- Public-key encryption.
- Some key-management workflows.

Its security relies on the computational difficulty of factoring sufficiently large integers.

## 18.2 ECC

ECC stands for Elliptic Curve Cryptography.

It provides public-key cryptographic capabilities using elliptic-curve mathematics.

Common algorithms include:

- ECDSA.
- ECDH.
- Ed25519.
- X25519.

## 18.3 RSA vs ECC

| Feature | RSA | ECC |
|---|---|---|
| Key size | Generally larger | Generally smaller |
| Security basis | Integer factorization | Elliptic-curve discrete logarithm |
| Common use | Signatures and legacy compatibility | Signatures and key agreement |
| Performance | Depends on operation and key size | Often efficient with smaller keys |

Do not assume all ECC algorithms perform the same operation. For example:

- ECDSA signs messages.
- ECDH establishes shared secrets.
- Ed25519 signs messages.
- X25519 performs key agreement.

---

# 19. Digital Signatures

## 19.1 What Is a Digital Signature?

A digital signature is a cryptographic mechanism used to verify the authenticity and integrity of a message.

It can also support non-repudiation, subject to key control, identity assurance and legal context.

### Signing Process

```text
Message
   |
   v
Hash Function
   |
   v
Message Digest
   |
   v
Private Key Signing
   |
   v
Digital Signature
```

### Verification Process

```text
Message + Signature
       |
       v
Public Key Verification
       |
       v
Valid / Invalid
```

## 19.2 Example: Digital Signature in Node.js

```typescript
import {
  generateKeyPairSync,
  sign,
  verify,
} from "node:crypto";

const {
  publicKey,
  privateKey,
} = generateKeyPairSync("ed25519");

const message = Buffer.from(
  "Important application message"
);

const signature = sign(
  null,
  message,
  privateKey
);

const isValid = verify(
  null,
  message,
  publicKey,
  signature
);

console.log(isValid);
```

This demonstrates signing and verification using Ed25519.

---

# 20. TLS and HTTPS

## 20.1 What Is HTTP?

HTTP is a protocol used for communication between clients and servers.

However, ordinary HTTP does not encrypt the communication channel.

An attacker who can observe or manipulate the network traffic may be able to read or modify transmitted information.

## 20.2 What Is HTTPS?

HTTPS is HTTP secured using TLS.

TLS stands for Transport Layer Security.

It provides:

- Confidentiality.
- Integrity.
- Server authentication.
- Optional client authentication.

## 20.3 HTTPS Architecture

```text
             Browser
                |
                | HTTPS
                |
                v
             TLS Layer
                |
                v
            Web Server
                |
                v
          Backend Application
```

## 20.4 TLS Handshake

A simplified modern TLS 1.3 handshake:

```text
Client
  |
  | ClientHello
  v
Server
  |
  | ServerHello
  | Certificate
  | CertificateVerify
  | Finished
  v
Client
  |
  | Finished
  v
Secure Connection
```

The handshake establishes cryptographic keys and authenticates the server.

The certificate is checked against the expected hostname and trusted certificate chain.

## 20.5 Why HTTPS Is Important

HTTPS protects:

- Login credentials.
- Session cookies.
- Access tokens.
- Personal information.
- Payment-related communication.
- API requests and responses.

**Best Practice:** Use HTTPS everywhere in production. Do not transmit authentication credentials or sensitive information over unencrypted HTTP.

---

# 21. Certificate Management

## 21.1 What Is a Digital Certificate?

A digital certificate binds an identity, such as a domain name, to a public key.

It is generally issued or signed by a Certificate Authority (CA).

Example:

```text
Domain: example.com

Public Key: ABC...

Issuer: Trusted CA

Validity:
Start Date - Expiry Date
```

## 21.2 Certificate Authority

A Certificate Authority is an entity that issues digital certificates under its trust framework.

Examples include:

- Let's Encrypt.
- DigiCert.
- GlobalSign.

## 21.3 Certificate Chain

A certificate chain establishes trust from a server certificate through intermediate certificates to a trusted root certificate.

```text
Trusted Root CA
       |
       v
Intermediate CA
       |
       v
Server Certificate
       |
       v
example.com
```

## 21.4 Certificate Management Best Practices

1. Monitor certificate expiration.
2. Automate certificate renewal.
3. Protect private keys.
4. Use appropriate key sizes and algorithms.
5. Verify hostname configuration.
6. Configure the full certificate chain.
7. Remove obsolete protocols and cipher suites.
8. Monitor certificate errors.

---

# 22. Key Management Systems (KMS)

## 22.1 What Is Key Management?

Key management is the process of generating, storing, distributing, rotating and revoking cryptographic keys.

Encryption is only as secure as its key management.

For example, AES-256-GCM provides strong cryptographic protection, but storing the encryption key directly in the source code defeats much of that protection.

## 22.2 What Is KMS?

A Key Management Service helps organizations manage encryption keys securely.

Examples:

- AWS Key Management Service
- Google Cloud Key Management Service
- Azure Key Vault
- HashiCorp Vault

## 22.3 Envelope Encryption

Envelope encryption uses one key to encrypt data and another key to protect that data-encryption key.

```text
             Master Key
                 |
                 v
        Encrypt Data Key
                 |
                 v
          Encrypted Data Key

Data
 |
 v
Data Encryption Key
 |
 v
Encrypted Data
```

The master key generally stays inside the KMS or protected key-management environment.

## 22.4 Key Rotation

Key rotation means periodically replacing cryptographic keys.

A typical strategy:

1. Generate a new key.
2. Use it for new encryption operations.
3. Retain access to old keys for decryption.
4. Re-encrypt existing data where required.
5. Retire old keys when safe.

Never delete an encryption key while data encrypted with it still needs to be recovered.

---

# 23. OWASP Top 10

## 23.1 What Is OWASP?

OWASP stands for Open Worldwide Application Security Project.

It is a nonprofit organization that publishes application security resources and standards.

One of its best-known resources is the OWASP Top 10.

The 2025 edition is the latest published OWASP Top 10 release as of this phase.

Official reference: [OWASP Top 10](https://owasp.org/www-project-top-ten/?utm_source=chatgpt.com)

## 23.2 OWASP Top 10 – 2025

| No. | Category | Meaning |
|---|---|---|
| A01 | Broken Access Control | Users access resources or actions they should not |
| A02 | Security Misconfiguration | Unsafe or incorrect security configuration |
| A03 | Software Supply Chain Failures | Risks in software dependencies, build systems and delivery |
| A04 | Cryptographic Failures | Weak or missing cryptographic protections |
| A05 | Injection | Untrusted input changes the intended behavior of a query or command |
| A06 | Insecure Design | Security weaknesses originate in design decisions |
| A07 | Authentication Failures | Authentication mechanisms are implemented incorrectly |
| A08 | Software or Data Integrity Failures | Trust and integrity controls are insufficient |
| A09 | Security Logging and Alerting Failures | Security events are not adequately detected or monitored |
| A10 | Mishandling of Exceptional Conditions | Errors and exceptional states are handled insecurely |

We will explore the major vulnerabilities individually.

---

# 24. SQL Injection

## 24.1 What Is SQL Injection?

SQL Injection occurs when an attacker manipulates SQL queries through untrusted input.

It can allow attackers to:

- Bypass authentication.
- Read unauthorized data.
- Modify database records.
- Delete information.
- Execute unintended database operations.

## 24.2 Vulnerable Example

```typescript
const email = req.body.email;

const query = `
  SELECT *
  FROM users
  WHERE email = '${email}'
`;
```

The application directly inserts user input into SQL.

An attacker may supply input that changes the query structure.

For example, a malicious input could make the condition always true.

## 24.3 Safe Approach: Parameterized Queries

```typescript
const email = req.body.email;

const [rows] = await pool.execute(
  "SELECT * FROM users WHERE email = ?",
  [email]
);
```

The database treats the supplied email as a parameter rather than executable SQL syntax.

## 24.4 ORM Protection

Using an ORM with properly parameterized query methods can reduce SQL injection risk.

Example:

```typescript
const user = await prisma.user.findUnique({
  where: {
    email: req.body.email,
  },
});
```

However, raw SQL methods can still introduce injection vulnerabilities if used incorrectly.

## 24.5 SQL Injection Prevention

1. Use parameterized queries.
2. Avoid string concatenation for SQL.
3. Validate input.
4. Use least-privilege database accounts.
5. Avoid exposing database errors.
6. Review raw SQL usage.
7. Perform security testing.

**Important:** Input validation is useful, but it does not replace parameterized queries.

---

# 25. Cross-Site Scripting (XSS)

## 25.1 What Is XSS?

Cross-Site Scripting occurs when an application allows untrusted content to execute as script in another user's browser.

It can be used to:

- Steal accessible session information.
- Perform actions as the victim.
- Modify page content.
- Redirect users.
- Display malicious forms.

## 25.2 Types of XSS

### A. Stored XSS

Malicious content is stored in the application.

Example:

```text
Attacker submits malicious comment.
       |
       v
Database stores comment.
       |
       v
Other user opens page.
       |
       v
Malicious script executes.
```

### B. Reflected XSS

Malicious input is reflected in the server's response.

Example:

A search query is inserted into HTML without proper encoding.

### C. DOM-Based XSS

Client-side JavaScript uses untrusted data in an unsafe DOM operation.

Example of unsafe code:

```typescript
element.innerHTML = userInput;
```

If `userInput` contains malicious HTML or script-capable markup, this may introduce XSS.

## 25.3 Safe Approach

Use text-based DOM APIs when displaying untrusted text.

```typescript
element.textContent = userInput;
```

In React, normal text interpolation is escaped:

```tsx
function Comment({
  message,
}: {
  message: string;
}) {
  return <p>{message}</p>;
}
```

Be careful with:

```tsx
<div
  dangerouslySetInnerHTML={{
    __html: userInput,
  }}
/>
```

This should not be used with unsanitized untrusted HTML.

## 25.4 XSS Prevention

- Escape output according to its context.
- Avoid unsafe DOM APIs.
- Sanitize HTML when HTML rendering is required.
- Use Content Security Policy.
- Avoid unnecessary inline scripts.
- Protect authentication cookies using HttpOnly where appropriate.
- Keep frontend dependencies updated.

---

# 26. Cross-Site Request Forgery (CSRF)

## 26.1 What Is CSRF?

CSRF is an attack in which a victim's browser is tricked into sending an unwanted authenticated request to a website.

This is particularly relevant when authentication relies on automatically attached cookies.

### Example

A user is logged in to a banking website.

An attacker tricks the user into visiting a malicious website.

That website attempts to submit a request to the banking website.

The browser may automatically attach eligible banking cookies.

If the application lacks suitable CSRF protection, an unwanted action may occur.

## 26.2 CSRF Architecture

```text
Victim Browser
      |
      v
Malicious Website
      |
      v
Unwanted Request
      |
      v
Banking Website
      |
      v
Cookie Automatically Sent
```

## 26.3 CSRF Protection

### A. CSRF Token

The server generates a secret token associated with the user's session.

The client sends it with state-changing requests.

The server verifies the token.

### B. SameSite Cookies

Cookie configuration:

```typescript
cookie: {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
}
```

`SameSite=Strict` provides stronger cross-site restrictions but may affect navigation flows.

`SameSite=None` requires `Secure` and is appropriate only when cross-site cookie behavior is genuinely required.

### C. Origin and Referer Validation

For sensitive browser requests, validate the expected origin.

### D. Avoid State-Changing GET Requests

GET requests should not modify application state.

## 26.4 XSS vs CSRF

| Feature | XSS | CSRF |
|---|---|---|
| Attack | Injects executable content into trusted origin | Tricks browser into sending an authenticated request |
| Main target | Browser execution context | Authenticated request behavior |
| Common prevention | Output encoding, sanitization, CSP | CSRF tokens, SameSite cookies, origin checks |
| Requires script execution in target origin? | Yes, for XSS | No |

---

# 27. Server-Side Request Forgery (SSRF)

## 27.1 What Is SSRF?

SSRF occurs when an attacker causes a server-side application to make requests to unintended destinations.

Example:

An application accepts a URL to download an image.

```typescript
const imageUrl = req.body.url;

const response = await fetch(imageUrl);
```

If the URL is not validated, an attacker may attempt to make the server access:

- Internal services.
- Private network addresses.
- Cloud metadata endpoints.
- Administrative interfaces.

## 27.2 SSRF Architecture

```text
Attacker
   |
   v
Application API
   |
   v
Server-Side HTTP Request
   |
   +------> Internal Service
   |
   +------> Private Network
   |
   +------> Metadata Endpoint
```

## 27.3 SSRF Prevention

1. Prefer allowlisting approved domains.
2. Validate URL schemes.
3. Resolve and validate destination IP addresses.
4. Block private, loopback and link-local ranges where inappropriate.
5. Revalidate redirects.
6. Disable unnecessary redirect following.
7. Use network-level egress controls.
8. Apply request timeouts.
9. Avoid passing arbitrary user URLs directly to backend fetch operations.

### Important

A hostname allowlist alone may be insufficient if DNS resolution changes between validation and connection.

Production implementations should account for DNS rebinding and validate the actual connection destination.

---

# 28. Broken Access Control

## 28.1 What Is Broken Access Control?

Broken access control occurs when users can access data or perform operations beyond their intended permissions.

Example:

```http
GET /api/users/101
```

A user changes the URL:

```http
GET /api/users/102
```

If the backend returns user 102's private information without checking ownership, the application has an access-control vulnerability.

This is often called Insecure Direct Object Reference (IDOR), a common form of broken access control.

## 28.2 Vulnerable Example

```typescript
app.get(
  "/users/:id",
  async (req, res) => {
    const user = await db.user.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    res.json(user);
  }
);
```

The application does not verify whether the authenticated user is allowed to access that record.

## 28.3 Safer Approach

```typescript
app.get(
  "/users/:id",
  authenticate,
  async (req, res) => {
    const requestedId = Number(req.params.id);

    const authenticatedUserId =
      req.user.id;

    if (requestedId !== authenticatedUserId) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const user = await db.user.findUnique({
      where: {
        id: requestedId,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json(user);
  }
);
```

An administrator may require a different authorization rule.

The important principle is that every sensitive resource operation must enforce server-side authorization.

## 28.4 Best Practices

- Validate permissions on every protected endpoint.
- Enforce resource ownership.
- Avoid trusting user-supplied role values.
- Apply tenant isolation.
- Use deny-by-default authorization.
- Test horizontal and vertical privilege escalation.

---

# 29. Security Misconfiguration

## 29.1 What Is Security Misconfiguration?

Security misconfiguration occurs when infrastructure, application servers or software components use unsafe settings.

Examples:

- Debug mode enabled in production.
- Default passwords.
- Unnecessary open ports.
- Exposed administrative interfaces.
- Missing security headers.
- Overly permissive CORS.
- Directory listing enabled.
- Publicly accessible storage buckets.

## 29.2 Example: Exposing Debug Information

Unsafe:

```typescript
app.use(
  errorHandler({
    exposeStackTrace: true,
  })
);
```

A production application should not expose stack traces or sensitive internal details to users.

Safer error response:

```typescript
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Internal server error",
  });
});
```

Detailed error information should be handled through secure server-side logging.

## 29.3 Security Configuration Checklist

- Disable production debug mode.
- Remove default credentials.
- Restrict network access.
- Configure security headers.
- Protect admin endpoints.
- Review cloud permissions.
- Disable unnecessary services.
- Keep software updated.
- Separate development and production configuration.

---

# 30. CORS Security

## 30.1 What Is CORS?

CORS stands for Cross-Origin Resource Sharing.

It is a browser security mechanism that controls whether frontend JavaScript from one origin can access resources from another origin.

An origin consists of:

```text
Scheme + Host + Port
```

Example:

```text
https://example.com
```

And:

```text
https://api.example.com
```

These are different origins.

## 30.2 CORS Example

Suppose:

```text
Frontend:
https://app.example.com

Backend:
https://api.example.com
```

The backend must permit the frontend origin if browser JavaScript needs to access it cross-origin.

## 30.3 Express CORS Configuration

Install:

```bash
npm install cors
npm install -D @types/cors
```

Example:

```typescript
import cors from "cors";

app.use(
  cors({
    origin: [
      "https://app.example.com",
    ],

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ],

    credentials: true,
  })
);
```

## 30.4 Dangerous CORS Configuration

```typescript
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
```

Browsers do not permit wildcard `Access-Control-Allow-Origin` together with credentialed CORS responses.

Avoid broad origin policies.

## 30.5 Important CORS Concepts

| Concept | Meaning |
|---|---|
| Origin | Scheme, host and port |
| Preflight | Browser's OPTIONS request checking permissions |
| Access-Control-Allow-Origin | Permitted origin |
| Access-Control-Allow-Methods | Permitted HTTP methods |
| Access-Control-Allow-Headers | Permitted request headers |
| Access-Control-Allow-Credentials | Allows credentials in CORS requests |

**Important:** CORS is not an authentication mechanism and does not protect an API from direct requests made by non-browser clients.

---

# 31. Content Security Policy (CSP)

## 31.1 What Is CSP?

Content Security Policy is a browser security mechanism that restricts which resources a page can load or execute.

It can help reduce the impact of XSS.

## 31.2 Example CSP

```http
Content-Security-Policy:
default-src 'self';
script-src 'self';
style-src 'self';
img-src 'self' https://images.example.com;
```

This policy restricts resource loading to specified sources.

## 31.3 Important CSP Directives

| Directive | Purpose |
|---|---|
| default-src | Default source policy |
| script-src | JavaScript source policy |
| style-src | CSS source policy |
| img-src | Image source policy |
| connect-src | Fetch, XHR and WebSocket connections |
| font-src | Font sources |
| frame-src | Embedded frame sources |
| object-src | Plugin/object sources |
| base-uri | Restricts base URL changes |
| frame-ancestors | Controls which sites may embed the page |

## 31.4 Express CSP Example

Install Helmet:

```bash
npm install helmet
```

Example:

```typescript
import helmet from "helmet";

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: [
          "'self'",
          "https://images.example.com",
        ],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
  })
);
```

CSP must be tested against actual application requirements. A strict policy may break third-party integrations if not configured correctly.

Prefer nonces or hashes over broadly allowing inline scripts.

---

# 32. API Security

## 32.1 What Is API Security?

API security protects endpoints, data and application operations from unauthorized access and abuse.

An API should not trust a request simply because it comes from a frontend application.

Attackers can call APIs directly.

## 32.2 API Security Layers

```text
              Client
                 |
                 v
             HTTPS / TLS
                 |
                 v
           API Gateway
                 |
                 v
          Authentication
                 |
                 v
          Authorization
                 |
                 v
           Input Validation
                 |
                 v
          Business Logic
                 |
                 v
              Database
```

## 32.3 API Security Best Practices

1. Use HTTPS.
2. Authenticate protected endpoints.
3. Enforce authorization.
4. Validate request data.
5. Apply rate limiting.
6. Use secure token management.
7. Avoid excessive data exposure.
8. Implement request size limits.
9. Use appropriate HTTP methods.
10. Avoid leaking internal errors.
11. Maintain audit logs.
12. Apply least-privilege permissions.

## 32.4 Input Validation Using Zod

Install:

```bash
npm install zod
```

Example:

```typescript
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(2).max(100),

  email: z.email(),

  age: z.number().int().min(18).max(120),
});

app.post("/users", async (req, res) => {
  const result = createUserSchema.safeParse(
    req.body
  );

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: result.error.issues,
    });
  }

  const user = await db.user.create({
    data: result.data,
  });

  return res.status(201).json(user);
});
```

Validation should be applied at the server boundary, even when the frontend already validates the same data.

---

# 33. Rate Limiting and Brute-Force Protection

## 33.1 What Is a Brute-Force Attack?

A brute-force attack repeatedly attempts different credentials until a valid combination is found.

Example:

```text
Attempt 1: password123
Attempt 2: admin123
Attempt 3: qwerty123
Attempt 4: correct-password
```

## 33.2 Brute-Force Protection

Possible mechanisms:

- Per-account rate limiting.
- Per-IP rate limiting.
- Progressive delays.
- Temporary lockouts.
- Multi-factor authentication.
- Risk-based authentication.
- Suspicious login detection.
- Credential stuffing detection.

## 33.3 Express Rate Limiting

Install:

```bash
npm install express-rate-limit
```

Example:

```typescript
import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 5,

  standardHeaders: "draft-8",

  legacyHeaders: false,

  message: {
    message: "Too many login attempts",
  },
});

app.post(
  "/login",
  loginLimiter,
  loginController
);
```

This is a basic single-process configuration.

For multi-instance production deployments, use an appropriate shared store or gateway-level distributed rate limiter.

Also consider account-based limits. IP-only limits can be bypassed or can unintentionally block multiple legitimate users behind a shared network.

---

# 34. Secure File Uploads

## 34.1 Why Are File Uploads Dangerous?

File uploads can introduce risks such as:

- Malware upload.
- Executable file upload.
- Path traversal.
- Storage exhaustion.
- Malicious file content.
- Public exposure of private files.
- Server-side code execution.

## 34.2 Unsafe Approach

```typescript
const fileName = req.file.originalname;

await saveFile(fileName);
```

The original filename should not be trusted.

## 34.3 Secure Upload Strategy

1. Authenticate the uploader.
2. Authorize upload access.
3. Enforce file size limits.
4. Allowlist permitted file types.
5. Inspect actual file content.
6. Generate server-side filenames.
7. Store uploads outside executable web roots.
8. Scan files for malware where appropriate.
9. Use private storage by default.
10. Apply download authorization.

## 34.4 Example with Multer

Install:

```bash
npm install multer
npm install -D @types/multer
```

Example:

```typescript
import multer from "multer";
import crypto from "node:crypto";

const storage = multer.diskStorage({
  destination: "private-uploads/",

  filename: (req, file, callback) => {
    const filename =
      crypto.randomUUID();

    callback(null, filename);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];

    if (
      allowedMimeTypes.includes(
        file.mimetype
      )
    ) {
      callback(null, true);
    } else {
      callback(
        new Error("Unsupported file type")
      );
    }
  },
});
```

### Important Limitation

`file.mimetype` comes from client-supplied metadata and is not sufficient to verify file contents.

A production implementation should inspect file signatures (magic bytes), use robust file parsers where necessary and consider malware scanning.

Never use a user-supplied filename as a trusted filesystem path.

---

# 35. Secrets Management

## 35.1 What Are Secrets?

Secrets are sensitive values used by applications and infrastructure.

Examples:

```text
DATABASE_URL
JWT_SECRET
AWS_ACCESS_KEY
API_KEY
ENCRYPTION_KEY
SESSION_SECRET
```

## 35.2 Incorrect Secret Management

```typescript
const jwtSecret =
  "my-super-secret-key";
```

Hardcoding secrets creates risks:

- Accidental source-control exposure.
- Difficult rotation.
- Shared secrets across environments.
- Unauthorized access.

## 35.3 Environment Variables

A basic development approach:

```typescript
const jwtSecret =
  process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error(
    "JWT_SECRET is required"
  );
}
```

Environment variables are useful, but they are not a complete secrets-management solution.

## 35.4 Production Secrets Management

Use dedicated secret-management systems.

Examples:

- AWS Secrets Manager.
- AWS Systems Manager Parameter Store.
- HashiCorp Vault.
- Azure Key Vault.
- Google Secret Manager.

## 35.5 Secrets Management Best Practices

1. Never commit secrets to Git.
2. Use different secrets for each environment.
3. Rotate credentials periodically and after exposure.
4. Restrict access using least privilege.
5. Avoid logging secret values.
6. Monitor secret access.
7. Use short-lived credentials where possible.
8. Revoke compromised credentials immediately.

---

# 36. Dependency Security

## 36.1 What Is Dependency Security?

Modern applications depend on external packages.

For example:

```json
{
  "dependencies": {
    "express": "^5.0.0",
    "jsonwebtoken": "^9.0.0",
    "zod": "^4.0.0"
  }
}
```

A vulnerability in a dependency can introduce a vulnerability into your application.

## 36.2 Common Dependency Risks

- Known vulnerable packages.
- Abandoned dependencies.
- Malicious packages.
- Dependency confusion.
- Typosquatting.
- Compromised maintainer accounts.
- Malicious installation scripts.

## 36.3 npm Audit

Run:

```bash
npm audit
```

To attempt automatic fixes:

```bash
npm audit fix
```

Do not blindly force major dependency upgrades just to eliminate audit warnings. Review the proposed changes and test the application.

## 36.4 Dependency Security Best Practices

- Keep dependencies updated.
- Review security advisories.
- Remove unused packages.
- Commit lockfiles.
- Use trusted package sources.
- Review package ownership and maintenance.
- Use automated dependency scanning.
- Audit build and installation scripts.

---

# 37. Software Supply Chain Security

## 37.1 What Is Software Supply Chain Security?

Software supply chain security protects the complete process through which software is developed, built, distributed and deployed.

It includes:

- Source code.
- Dependencies.
- Build tools.
- CI/CD pipelines.
- Container images.
- Deployment credentials.
- Artifact repositories.

## 37.2 Software Supply Chain Architecture

```text
Developer
    |
    v
Source Code Repository
    |
    v
Dependency Installation
    |
    v
Build Pipeline
    |
    v
Security Scanning
    |
    v
Artifact Registry
    |
    v
Deployment
    |
    v
Production
```

## 37.3 Important Security Practices

1. Protect Git repositories.
2. Require code reviews.
3. Scan dependencies.
4. Protect CI/CD credentials.
5. Pin and verify dependencies where appropriate.
6. Generate Software Bills of Materials (SBOMs).
7. Sign build artifacts.
8. Verify container images.
9. Restrict deployment permissions.
10. Audit production changes.

### What Is an SBOM?

SBOM stands for Software Bill of Materials.

It is a structured inventory of software components and dependencies included in an application.

It helps identify affected components when vulnerabilities are discovered.

---

# 38. Zero Trust Architecture

## 38.1 What Is Zero Trust?

Zero Trust is a security approach based on the principle that no user, device or service should be trusted automatically.

Traditional security often assumes that internal networks are trusted.

Zero Trust removes that assumption.

Its central principle is:

**Never trust implicitly; continuously verify.**

## 38.2 Traditional Security vs Zero Trust

Traditional approach:

```text
Internet
   |
   v
Firewall
   |
   v
Trusted Internal Network
```

Zero Trust approach:

```text
User / Device / Service
          |
          v
      Identity Check
          |
          v
    Device / Context Check
          |
          v
 Authorization Policy
          |
          v
 Least-Privilege Access
```

## 38.3 Zero Trust Principles

1. Verify identity.
2. Verify device or workload context where relevant.
3. Apply least privilege.
4. Authenticate services.
5. Encrypt communication.
6. Continuously evaluate access.
7. Monitor suspicious behavior.
8. Assume breach is possible.

## 38.4 Example in Microservices

```text
API Gateway
     |
     v
Order Service
     |
     v
Payment Service
```

The Payment Service should not trust a request merely because it originates from the internal network.

It should verify the calling service's identity and enforce its own authorization rules.

---

# 39. Secure Microservices Architecture

## 39.1 Why Do Microservices Need Security?

In a microservices architecture, many independent services communicate over networks.

Every communication boundary creates a security concern.

Potential risks:

- Unauthorized service calls.
- Stolen service credentials.
- Excessive permissions.
- Token leakage.
- Unencrypted internal communication.
- Insecure message processing.

## 39.2 Secure Microservices Architecture

```text
                 Users
                   |
                   v
              API Gateway
                   |
             Authentication
                   |
          +--------+--------+
          |                 |
          v                 v
      Order Service     User Service
          |
          v
     Payment Service
          |
          v
      Payment Provider
```

Each service should enforce the authorization rules relevant to its own responsibilities.

## 39.3 Mutual TLS (mTLS)

mTLS means mutual Transport Layer Security.

In normal server-authenticated TLS:

- Client verifies server identity.

In mTLS:

- Client verifies server identity.
- Server also verifies client identity.

This is useful for service-to-service authentication.

## 39.4 Service-to-Service Security

Best practices:

- Use mTLS where appropriate.
- Use short-lived service credentials.
- Apply service-level authorization.
- Avoid shared unrestricted secrets.
- Validate tokens and claims.
- Restrict network access.
- Encrypt sensitive messages.
- Rotate credentials.
- Log security events.

## 39.5 Message Broker Security

For RabbitMQ and Kafka:

- Enable authentication.
- Use TLS.
- Restrict topic and queue permissions.
- Use separate service identities.
- Avoid exposing broker management interfaces publicly.
- Validate message schemas.
- Handle untrusted message payloads safely.

---

# 40. Security Logging and Monitoring

## 40.1 What Is Security Logging?

Security logging records events relevant to application and infrastructure security.

Examples:

- Login success.
- Login failure.
- Password reset.
- Permission changes.
- Suspicious API requests.
- Token validation failures.
- Administrative operations.

## 40.2 Example Security Log

```json
{
  "event": "LOGIN_FAILED",
  "userId": 101,
  "ip": "203.0.113.10",
  "timestamp": "2026-11-26T12:00:00Z",
  "reason": "INVALID_CREDENTIALS"
}
```

Use appropriate data minimization and retention controls.

## 40.3 What Should Never Be Logged?

Avoid logging:

- Plaintext passwords.
- Access tokens.
- Refresh tokens.
- Session IDs.
- Private keys.
- Encryption keys.
- Full payment card data.
- Sensitive personal information unless specifically justified and protected.

## 40.4 Monitoring and Alerting

Monitor:

- Repeated failed logins.
- Unexpected privilege changes.
- Unusual access patterns.
- High API error rates.
- Unusual data exports.
- Suspicious administrative actions.
- Unexpected traffic spikes.

Useful monitoring tools include:

- Prometheus
- Grafana
- OpenTelemetry
- Wazuh

---

# 41. Threat Modeling

## 41.1 What Is Threat Modeling?

Threat modeling is a structured process for identifying possible security threats before they become vulnerabilities in production.

It helps developers understand:

- What needs protection?
- Who might attack the system?
- What attack paths exist?
- What controls reduce the risk?

## 41.2 STRIDE Model

STRIDE is a threat classification model.

| Category | Meaning |
|---|---|
| S – Spoofing | Pretending to be another identity |
| T – Tampering | Unauthorized modification |
| R – Repudiation | Denying an action without adequate evidence |
| I – Information Disclosure | Exposing confidential information |
| D – Denial of Service | Making a system unavailable |
| E – Elevation of Privilege | Gaining higher permissions |

## 41.3 Example: Expense Tracker

Assets:

- User credentials.
- Expense records.
- Financial reports.
- Company data.
- Authentication tokens.

Possible threats:

| Threat | Example | Mitigation |
|---|---|---|
| Spoofing | Stolen user credentials | MFA, secure authentication |
| Tampering | Changing expense amount | Authorization and audit logs |
| Repudiation | User denies approving expense | Tamper-resistant audit trail |
| Information Disclosure | Reading another tenant's expenses | Tenant isolation |
| Denial of Service | Flooding report endpoint | Rate limiting and load shedding |
| Elevation of Privilege | Employee becomes admin | Server-side authorization |

## 41.4 Threat Modeling Process

```text
Identify Assets
      |
      v
Map Architecture
      |
      v
Identify Trust Boundaries
      |
      v
Identify Threats
      |
      v
Assess Risk
      |
      v
Define Mitigations
      |
      v
Validate Controls
```

---

# 42. Security Testing

## 42.1 What Is Security Testing?

Security testing identifies weaknesses in application code, infrastructure and deployment configuration.

It should be integrated into the software development lifecycle.

## 42.2 Types of Security Testing

### A. SAST

Static Application Security Testing analyzes source code without executing the application.

Examples:

- Semgrep
- CodeQL
- SonarQube

### B. DAST

Dynamic Application Security Testing examines a running application.

Example:

- OWASP ZAP

### C. Dependency Scanning

Identifies known vulnerabilities in third-party dependencies.

Examples:

- npm audit.
- Snyk.
- Dependabot.

### D. Penetration Testing

Authorized security professionals attempt to identify and exploit vulnerabilities under an agreed scope.

### E. Container Security Scanning

Scans container images for vulnerable operating-system packages, libraries and configuration problems.

### F. Infrastructure Security Testing

Checks infrastructure configuration for weaknesses.

## 42.3 Security Testing Comparison

| Testing Type | What It Tests |
|---|---|
| SAST | Source code |
| DAST | Running application |
| Dependency Scanning | Third-party packages |
| Penetration Testing | Practical attack paths |
| Container Scanning | Container images |
| Infrastructure Scanning | Deployment and infrastructure configuration |

## 42.4 Security Testing in CI/CD

```text
Developer Push
      |
      v
   Build
      |
      v
   Unit Tests
      |
      v
   SAST Scan
      |
      v
Dependency Scan
      |
      v
 Container Scan
      |
      v
 Security Checks
      |
      v
   Deployment
```

A production pipeline should define which findings block deployment and how exceptions are reviewed.

---

# 43. Secure TypeScript and Node.js Architecture

Now let's combine the major security principles into a practical backend architecture.

## 43.1 Recommended Project Structure

```text
src/
│
├── config/
│   ├── database.ts
│   ├── redis.ts
│   └── environment.ts
│
├── middlewares/
│   ├── authenticate.ts
│   ├── authorize.ts
│   ├── rateLimiter.ts
│   ├── validateRequest.ts
│   └── errorHandler.ts
│
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.routes.ts
│   │   └── auth.schema.ts
│   │
│   ├── users/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.routes.ts
│   │   └── user.schema.ts
│   │
│   └── expenses/
│       ├── expense.controller.ts
│       ├── expense.service.ts
│       ├── expense.routes.ts
│       └── expense.schema.ts
│
├── utils/
│   ├── password.ts
│   ├── jwt.ts
│   └── logger.ts
│
├── app.ts
└── server.ts
```

## 43.2 Security Middleware

Example authentication middleware:

```typescript
import {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

interface AuthenticatedUser {
  userId: number;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization =
    req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const token = authorization.slice(7);

  try {
    const payload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
      {
        issuer: "my-api",
        audience: "my-client",
        algorithms: ["HS256"],
      }
    );

    if (
      typeof payload === "string" ||
      typeof payload.userId !== "number" ||
      typeof payload.role !== "string"
    ) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    req.user = {
      userId: payload.userId,
      role: payload.role,
    };

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}
```

## 43.3 Authorization Middleware

```typescript
import {
  Request,
  Response,
  NextFunction,
} from "express";

export function authorize(
  ...allowedRoles: string[]
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (
      !allowedRoles.includes(req.user.role)
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };
}
```

Usage:

```typescript
app.delete(
  "/users/:id",
  authenticate,
  authorize("admin"),
  deleteUserController
);
```

**Important:** Role middleware alone is not sufficient for resource-level authorization. The controller or service must also verify that the authenticated identity can access the specific resource.

## 43.4 Secure Express Configuration

```typescript
import express from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: [
      "https://app.example.com",
    ],
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "100kb",
  })
);
```

Also implement:

- Request validation.
- Authentication.
- Authorization.
- Rate limiting.
- Secure error handling.
- Secure cookie configuration where applicable.
- Logging and monitoring.

---

# 44. Secure Application Design Checklist

Before deploying a production application, verify the following.

### Authentication

- Passwords are hashed using an appropriate password hashing algorithm.
- Access tokens have appropriate expiration.
- Refresh tokens are rotated and revocable.
- Session IDs are regenerated after login.
- MFA is available for sensitive operations.

### Authorization

- Every protected endpoint verifies authorization.
- Resource ownership is checked.
- Tenant isolation is enforced.
- Privileges follow least privilege.
- Authorization is performed server-side.

### Data Protection

- HTTPS is enabled.
- Sensitive data is encrypted where appropriate.
- Encryption keys are securely managed.
- Secrets are not committed to source control.
- Sensitive values are excluded from logs.

### API Security

- Inputs are validated.
- SQL queries use parameterization.
- Rate limiting is configured.
- CORS is restrictive.
- Error messages do not expose internals.
- Request size limits are enforced.

### Infrastructure

- Production debug mode is disabled.
- Database access is restricted.
- Redis and message brokers are protected.
- Container images are scanned.
- Dependencies are monitored.
- Backups are tested.

### Monitoring

- Authentication failures are monitored.
- Privilege changes are audited.
- Suspicious traffic generates alerts.
- Security logs are protected.
- Incident response procedures are documented.

---

# 45. Common Security Mistakes

| Mistake | Consequence |
|---|---|
| Storing plaintext passwords | Immediate credential exposure after database compromise |
| Using fast hashes for passwords | Makes password guessing cheaper |
| Storing sensitive information in ordinary JWTs | Exposes information to token holders |
| Trusting decoded JWT payloads | Allows forged claims if signature verification is skipped |
| Keeping access tokens indefinitely | Increases exposure window |
| Storing long-lived tokens in local storage | XSS can expose them |
| Allowing every CORS origin | Broadens browser access unnecessarily |
| Trusting frontend authorization | Attackers can bypass frontend controls |
| Using raw SQL string concatenation | SQL injection |
| Rendering unsanitized HTML | XSS |
| Ignoring CSRF on cookie authentication | Unauthorized browser-triggered actions |
| Accepting arbitrary URLs server-side | SSRF |
| Trusting uploaded MIME types | Malicious files may bypass checks |
| Hardcoding API secrets | Credential exposure |
| Giving services unrestricted permissions | Larger compromise impact |
| Logging authentication tokens | Credential leakage |
| Ignoring dependency vulnerabilities | Supply chain exposure |

---

# 46. Interview Questions and Answers

## Q1. What is security engineering?

Security engineering is the discipline of designing, implementing and maintaining systems that protect information, infrastructure and applications from security threats.

## Q2. What is the CIA Triad?

The CIA Triad consists of Confidentiality, Integrity and Availability.

## Q3. What is authentication?

Authentication verifies the identity of a user or system.

## Q4. What is authorization?

Authorization determines what an authenticated identity is allowed to access or perform.

## Q5. What is the difference between 401 and 403?

401 indicates missing or invalid authentication credentials. 403 indicates that the request is not permitted.

## Q6. What is session-based authentication?

It is an authentication mechanism where the server maintains session state and the client sends a session identifier with subsequent requests.

## Q7. What is session fixation?

Session fixation occurs when an attacker causes a victim to use a session identifier known to the attacker.

## Q8. What is JWT?

JWT is a compact token format containing claims that can be cryptographically signed or encrypted.

## Q9. What are the three parts of a JWT?

Header, Payload and Signature.

## Q10. Is JWT encrypted?

A normal signed JWT is not encrypted. Its payload is encoded and can be decoded by anyone possessing the token.

## Q11. What is an access token?

An access token is a credential used to access protected resources.

## Q12. What is a refresh token?

A refresh token is used to obtain replacement access tokens without requiring a complete login again.

## Q13. What is refresh token rotation?

Refresh token rotation replaces a refresh token after successful use and invalidates the previous token.

## Q14. What is OAuth 2.0?

OAuth 2.0 is an authorization framework that allows applications to access protected resources with delegated permissions.

## Q15. What is PKCE?

PKCE is a mechanism that protects OAuth authorization code flows against code interception.

## Q16. What is OpenID Connect?

OIDC is an identity layer built on OAuth 2.0 that standardizes user authentication and identity information.

## Q17. What is the difference between OAuth and OIDC?

OAuth focuses on authorization. OIDC adds authentication and standardized identity claims.

## Q18. What is an ID token?

An ID token is an OIDC token that communicates information about an authenticated user to the client.

## Q19. What is SSO?

Single Sign-On allows users to authenticate through one identity provider and access multiple applications.

## Q20. What is SAML?

SAML is an XML-based standard used for identity federation and enterprise Single Sign-On.

## Q21. What is RBAC?

Role-Based Access Control assigns permissions through user roles.

## Q22. What is ABAC?

Attribute-Based Access Control makes authorization decisions using attributes of the user, resource, action and environment.

## Q23. What is password hashing?

Password hashing transforms passwords into one-way password hashes that can be verified without storing plaintext passwords.

## Q24. What is the difference between hashing and encryption?

Hashing is designed to be one-way. Encryption is reversible with the correct key.

## Q25. What is Argon2id?

Argon2id is a memory-hard password hashing algorithm combining characteristics of Argon2i and Argon2d.

## Q26. What is AES?

AES is a symmetric encryption standard used to protect data.

## Q27. What is AES-GCM?

AES-GCM is an authenticated encryption mode that provides confidentiality and integrity protection.

## Q28. What is asymmetric encryption?

Asymmetric cryptography uses a public/private key pair for cryptographic operations.

## Q29. What is a digital signature?

A digital signature allows a recipient to verify message authenticity and integrity using the corresponding public key.

## Q30. What is TLS?

TLS is a cryptographic protocol that provides secure communication over networks.

## Q31. What is HTTPS?

HTTPS is HTTP communication secured using TLS.

## Q32. What is a digital certificate?

A digital certificate binds an identity to a public key and is generally issued or signed by a trusted certificate authority.

## Q33. What is KMS?

A Key Management Service helps generate, protect, rotate and manage cryptographic keys.

## Q34. What is envelope encryption?

Envelope encryption protects a data-encryption key using another key, commonly managed by a KMS.

## Q35. What is OWASP?

OWASP is an organization that publishes resources, standards and guidance for improving software security.

## Q36. What is SQL Injection?

SQL Injection occurs when untrusted input changes the structure or behavior of a SQL query.

## Q37. How can SQL Injection be prevented?

Use parameterized queries, safe ORM methods, input validation and least-privilege database accounts.

## Q38. What is XSS?

Cross-Site Scripting occurs when untrusted content executes as script in another user's browser.

## Q39. What are the three major types of XSS?

Stored XSS, Reflected XSS and DOM-Based XSS.

## Q40. What is CSRF?

CSRF tricks a user's browser into sending an unwanted authenticated request to a website.

## Q41. What is SSRF?

SSRF occurs when an attacker causes a server-side application to make requests to unintended destinations.

## Q42. What is IDOR?

Insecure Direct Object Reference is a vulnerability where an attacker accesses an object by manipulating its identifier without proper authorization checks.

## Q43. What is CORS?

CORS is a browser mechanism that controls whether frontend JavaScript from one origin can access resources from another origin.

## Q44. Does CORS protect an API from all unauthorized requests?

No. CORS is a browser security mechanism, not an authentication or authorization system.

## Q45. What is CSP?

Content Security Policy restricts which resources a browser page can load or execute.

## Q46. What is Zero Trust?

Zero Trust is a security model that requires continuous verification rather than automatically trusting users, devices or services based on network location.

## Q47. What is mTLS?

Mutual TLS authenticates both the client and server during a TLS connection.

## Q48. What is threat modeling?

Threat modeling systematically identifies potential security threats and defines mitigations before or during system design.

## Q49. What is STRIDE?

STRIDE is a threat classification model covering Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service and Elevation of Privilege.

## Q50. What is the difference between SAST and DAST?

SAST analyzes source code without executing the application. DAST tests a running application.

---

# 47. Practical Exercises

Complete these exercises to gain hands-on experience.

### Exercise 1: Secure Authentication

Build an authentication system using:

- Node.js.
- Express.
- TypeScript.
- MySQL or MongoDB.
- Argon2id.

Requirements:

1. Registration.
2. Login.
3. Password hashing.
4. Password verification.
5. Logout.
6. Secure error handling.

### Exercise 2: JWT Authentication

Implement:

- Access token generation.
- JWT verification.
- Token expiration.
- Issuer validation.
- Audience validation.
- Authentication middleware.

### Exercise 3: Refresh Token Rotation

Build a refresh-token system with:

- Refresh token storage.
- Hashed token storage.
- Token rotation.
- Token revocation.
- Token reuse detection.

### Exercise 4: RBAC

Create three roles:

```text
Admin
Manager
Employee
```

Implement different permissions for each role.

### Exercise 5: ABAC

Build an expense approval system where managers can approve expenses only when:

- The expense belongs to their department.
- The amount is below a configured threshold.
- The expense is pending.

### Exercise 6: SQL Injection Prevention

Build a login API using parameterized SQL queries.

Test whether malicious input can modify the intended query behavior.

### Exercise 7: XSS Prevention

Build a comment system.

Implement:

- Safe text rendering.
- HTML sanitization where necessary.
- Content Security Policy.

Verify that untrusted content cannot execute as script.

### Exercise 8: CSRF Protection

Build a cookie-based authentication system.

Implement:

- Secure cookies.
- CSRF tokens.
- SameSite configuration.
- Origin validation.

### Exercise 9: File Upload Security

Create a secure file upload API.

Requirements:

- Maximum file size.
- File signature validation.
- Allowlisted file formats.
- Generated filenames.
- Private storage.
- Authorization.

### Exercise 10: API Rate Limiting

Implement:

- Login rate limiting.
- Per-user limits.
- Per-IP limits.
- Redis-based distributed rate limiting.

### Exercise 11: OAuth 2.0 and OIDC

Integrate a trusted identity provider using Authorization Code Flow with PKCE.

Implement:

- Login redirect.
- Callback handling.
- ID token validation.
- Secure session creation.
- Logout.

### Exercise 12: Security Audit

Take one of your existing Node.js or Next.js projects and perform a security review.

Check:

- Authentication.
- Authorization.
- SQL Injection.
- XSS.
- CSRF.
- CORS.
- Secrets management.
- Dependency vulnerabilities.
- File upload security.
- Error handling.
- Logging.

---

# 48. Phase 64 Completion Checklist

| No. | Topic | Status |
|---|---|---|
| 1 | Security Engineering Fundamentals | ☐ |
| 2 | CIA Triad | ☐ |
| 3 | Authentication vs Authorization | ☐ |
| 4 | Session-Based Authentication | ☐ |
| 5 | Session Fixation | ☐ |
| 6 | JWT Architecture | ☐ |
| 7 | Access Tokens | ☐ |
| 8 | Refresh Tokens | ☐ |
| 9 | Refresh Token Rotation | ☐ |
| 10 | OAuth 2.0 | ☐ |
| 11 | PKCE | ☐ |
| 12 | OpenID Connect | ☐ |
| 13 | SSO | ☐ |
| 14 | SAML | ☐ |
| 15 | RBAC | ☐ |
| 16 | ABAC | ☐ |
| 17 | Password Hashing | ☐ |
| 18 | bcrypt | ☐ |
| 19 | Argon2id | ☐ |
| 20 | scrypt | ☐ |
| 21 | Cryptography Fundamentals | ☐ |
| 22 | Symmetric Encryption | ☐ |
| 23 | Asymmetric Encryption | ☐ |
| 24 | AES-GCM | ☐ |
| 25 | RSA | ☐ |
| 26 | ECC | ☐ |
| 27 | Digital Signatures | ☐ |
| 28 | TLS and HTTPS | ☐ |
| 29 | Certificate Management | ☐ |
| 30 | KMS | ☐ |
| 31 | Envelope Encryption | ☐ |
| 32 | OWASP Top 10 | ☐ |
| 33 | SQL Injection | ☐ |
| 34 | XSS | ☐ |
| 35 | CSRF | ☐ |
| 36 | SSRF | ☐ |
| 37 | Broken Access Control | ☐ |
| 38 | Security Misconfiguration | ☐ |
| 39 | CORS | ☐ |
| 40 | Content Security Policy | ☐ |
| 41 | API Security | ☐ |
| 42 | Brute-Force Protection | ☐ |
| 43 | Secure File Uploads | ☐ |
| 44 | Secrets Management | ☐ |
| 45 | Dependency Security | ☐ |
| 46 | Supply Chain Security | ☐ |
| 47 | Zero Trust Architecture | ☐ |
| 48 | Secure Microservices | ☐ |
| 49 | Security Logging and Monitoring | ☐ |
| 50 | Threat Modeling | ☐ |
| 51 | STRIDE | ☐ |
| 52 | Security Testing | ☐ |
| 53 | SAST and DAST | ☐ |
| 54 | Secure TypeScript Architecture | ☐ |

---

# 49. What's Next? Phase 65

**Phase 65: Advanced TypeScript – Advanced Testing Engineering, Unit Testing, Integration Testing, E2E Testing, Jest, Vitest, Playwright, Mocking, Test Automation, TDD and CI/CD Testing Architecture**

Upcoming topics:

1. Software Testing Fundamentals.
2. Testing Pyramid.
3. Unit Testing.
4. Integration Testing.
5. End-to-End Testing.
6. Regression Testing.
7. Smoke Testing.
8. Sanity Testing.
9. Acceptance Testing.
10. Jest Fundamentals.
11. Vitest Fundamentals.
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
24. Async Testing.
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
41. Test-Driven Development (TDD).
42. Behavior-Driven Development (BDD).
43. Code Coverage.
44. Mutation Testing.
45. Continuous Integration Testing.
46. Continuous Delivery.
47. Parallel Test Execution.
48. Flaky Test Management.
49. Test Automation Architecture.
50. Enterprise Testing Strategy.

**Phase 64 is complete.** When you're ready, say **"OK, Continue to Phase 65"** to begin the next phase.