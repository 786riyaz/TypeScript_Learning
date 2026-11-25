# Phase 38: TypeScript with Next.js – Advanced Full-Stack Development

**Level:** Advanced to Expert  
**Prerequisites:** TypeScript fundamentals, React with TypeScript, Next.js fundamentals, Node.js, REST APIs, authentication, databases, and asynchronous JavaScript.

---

# 1. Learning Objectives

In this phase, you will learn how to build production-ready full-stack applications using Next.js and TypeScript.

We will cover:

1. Next.js with TypeScript setup.
2. App Router architecture.
3. Server Components.
4. Client Components.
5. Server and Client boundaries.
6. Type-safe routing.
7. Dynamic routes.
8. Layouts and templates.
9. Loading and error boundaries.
10. Server Actions.
11. API Routes and Route Handlers.
12. Request and Response typing.
13. Data fetching.
14. Caching and revalidation.
15. Middleware and authentication.
16. Auth.js concepts.
17. Database integration.
18. Zod validation.
19. Forms with Server Actions.
20. Metadata and SEO.
21. Image optimization.
22. Environment variables.
23. Error handling.
24. Performance optimization.
25. Production deployment.
26. Complete Next.js + TypeScript project.

---

# 2. Setting Up Next.js with TypeScript

Next.js provides built-in TypeScript support.

We don't need to manually configure TypeScript from scratch.

### Step 1: Create a Next.js Project

Run:

```bash
npx create-next-app@latest nextjs-typescript-app
```

Select:

```text
Would you like to use TypeScript? Yes
Would you like to use ESLint? Yes
Would you like to use Tailwind CSS? Yes
Would you like your code inside a src/ directory? Yes
Would you like to use App Router? Yes
```

### Step 2: Navigate to Project

```bash
cd nextjs-typescript-app
```

### Step 3: Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Step 4: Understand Project Structure

```text
nextjs-typescript-app/
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │
│   ├── hooks/
│   │
│   ├── lib/
│   │
│   ├── services/
│   │
│   └── types/
│
├── next.config.ts
├── tsconfig.json
├── package.json
└── postcss.config.mjs
```

### Important Files

| File | Purpose |
|---|---|
| `page.tsx` | Defines a route's UI |
| `layout.tsx` | Defines shared layouts |
| `loading.tsx` | Defines loading UI |
| `error.tsx` | Defines error UI |
| `not-found.tsx` | Defines not-found UI |
| `route.ts` | Defines an API Route Handler |
| `middleware.ts` / `proxy.ts` | Handles request interception, depending on Next.js version |
| `next.config.ts` | Next.js configuration |
| `tsconfig.json` | TypeScript configuration |

**Important:** Next.js has evolved its request interception conventions. In current Next.js versions, the newer `proxy.ts` convention replaces the older `middleware.ts` convention for this purpose. We will discuss the distinction later.

---

# 3. Understanding the Next.js App Router

The App Router is Next.js's file-system-based routing system.

It uses the `app` directory to define application routes.

Consider this structure:

```text
src/app/
│
├── page.tsx
│
├── about/
│   └── page.tsx
│
├── contact/
│   └── page.tsx
│
└── dashboard/
    └── page.tsx
```

The routes will be:

| File | URL |
|---|---|
| `app/page.tsx` | `/` |
| `app/about/page.tsx` | `/about` |
| `app/contact/page.tsx` | `/contact` |
| `app/dashboard/page.tsx` | `/dashboard` |

### Example: Home Page

```tsx
export default function HomePage() {
    return (
        <h1>Home Page</h1>
    );
}
```

File:

```text
src/app/page.tsx
```

### Example: About Page

```tsx
export default function AboutPage() {
    return (
        <h1>About Page</h1>
    );
}
```

File:

```text
src/app/about/page.tsx
```

### Important Rule

In the App Router, a folder does not automatically become a public route.

A folder becomes a route segment, and its `page.tsx` file exposes the route's UI.

For example:

```text
app/
    users/
        page.tsx
```

Creates:

```text
/users
```

But:

```text
app/
    users/
        components/
            UserCard.tsx
```

does not create another public route.

---

# 4. Server Components in Next.js

One of the most important concepts in modern Next.js is React Server Components.

In the App Router, components are Server Components by default.

A Server Component renders on the server and can access server-side resources.

### Example

```tsx
interface User {
    id: number;
    name: string;
    email: string;
}

export default async function UsersPage() {
    const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
    );

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    const users: User[] = await response.json();

    return (
        <div>
            <h1>Users</h1>

            {users.map(user => (
                <div key={user.id}>
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                </div>
            ))}
        </div>
    );
}
```

Notice:

```tsx
export default async function UsersPage()
```

The component is asynchronous.

This allows us to fetch data directly inside a Server Component.

### Advantages of Server Components

1. Access server-side resources.
2. Fetch data close to its source.
3. Keep sensitive server-side logic out of browser bundles.
4. Reduce the amount of JavaScript sent to the browser.
5. Improve initial rendering opportunities.
6. Avoid unnecessary client-side data-fetching code.

### What Can Server Components Access?

They can access:

- Databases through server-side libraries.
- Server-only modules.
- Environment variables that are not exposed to the client.
- Filesystem APIs where supported by the runtime.
- Backend services.
- Server-side authentication information.

### Important Limitation

Server Components cannot directly use browser-only APIs such as:

```typescript
window
document
localStorage
```

They also cannot use client-only React Hooks such as:

```typescript
useState
useEffect
useReducer
```

For interactive UI, we use Client Components.

---

# 5. Client Components in Next.js

Client Components are components that use client-side React features.

They are needed for:

- State management.
- Event handling.
- Browser APIs.
- Effects.
- Interactive UI.
- Client-side libraries.

To create a Client Component, add:

```tsx
"use client";
```

at the top of the file.

### Example

```tsx
"use client";

import { useState } from "react";

export default function Counter() {
    const [count, setCount] = useState<number>(0);

    return (
        <div>
            <h1>{count}</h1>

            <button
                onClick={() => setCount(count + 1)}
            >
                Increment
            </button>
        </div>
    );
}
```

### What Does "use client" Mean?

It declares a client-side module boundary.

The component and its imported dependencies become part of the client module graph.

It does not mean that the component is never rendered on the server. Next.js can still prerender Client Components into HTML during initial rendering.

### Server vs Client Components

| Server Components | Client Components |
|---|---|
| Default in App Router | Require `"use client"` |
| Can access server-side resources | Can access browser APIs |
| Cannot use `useState` | Can use `useState` |
| Cannot use `useEffect` | Can use `useEffect` |
| Cannot handle browser events directly | Can handle browser events |
| Keep server-only logic on server | Participate in client-side interactivity |
| Suitable for data fetching | Suitable for interactive UI |

### Practical Example

```text
app/
    dashboard/
        page.tsx
        components/
            Counter.tsx
```

**page.tsx**

```tsx
import Counter from "./components/Counter";

export default function DashboardPage() {
    return (
        <div>
            <h1>Dashboard</h1>

            <Counter />
        </div>
    );
}
```

**Counter.tsx**

```tsx
"use client";

import { useState } from "react";

export default function Counter() {
    const [count, setCount] = useState(0);

    return (
        <button onClick={() => setCount(count + 1)}>
            Count: {count}
        </button>
    );
}
```

Here:

- `DashboardPage` is a Server Component.
- `Counter` is a Client Component.

This is a common Next.js architecture.

---

# 6. Understanding Server and Client Boundaries

This is an important advanced topic.

A Server Component can render a Client Component.

Example:

```tsx
// Server Component

import UserProfile from "./UserProfile";

export default function Dashboard() {
    return (
        <div>
            <h1>Dashboard</h1>

            <UserProfile />
        </div>
    );
}
```

Client Component:

```tsx
"use client";

import { useState } from "react";

export default function UserProfile() {
    const [name, setName] = useState("John");

    return (
        <div>
            <h2>{name}</h2>

            <button onClick={() => setName("David")}>
                Change Name
            </button>
        </div>
    );
}
```

### Can a Client Component Import a Server Component?

A Client Component cannot directly import and execute a Server Component as an ordinary component.

However, a Server Component can create a Server Component element and pass it as a `children` or another suitable slot prop to a Client Component.

### Example

**Server Component:**

```tsx
import ClientWrapper from "./ClientWrapper";
import ServerContent from "./ServerContent";

export default function Page() {
    return (
        <ClientWrapper>
            <ServerContent />
        </ClientWrapper>
    );
}
```

**Client Component:**

```tsx
"use client";

import { ReactNode } from "react";

interface ClientWrapperProps {
    children: ReactNode;
}

export default function ClientWrapper({
    children
}: ClientWrapperProps) {
    return (
        <div>
            <button onClick={() => alert("Clicked")}>
                Click Me
            </button>

            {children}
        </div>
    );
}
```

**Server Component:**

```tsx
export default function ServerContent() {
    return <h1>Server-rendered content</h1>;
}
```

This pattern is called **component composition across the Server/Client boundary**.

### Important Serialization Rule

Props passed from Server Components to Client Components must be compatible with React's serialization requirements.

Do not pass ordinary database connections, arbitrary class instances, or server-only objects as Client Component props.

---

# 7. Type-Safe Routing in Next.js

Next.js supports file-system-based routing.

You can organize routes using folders.

Example:

```text
app/
│
├── page.tsx
│
├── about/
│   └── page.tsx
│
├── products/
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
│
└── dashboard/
    └── page.tsx
```

### Understanding Dynamic Routes

Consider:

```text
/products/101
/products/102
/products/103
```

Instead of creating separate folders, use:

```text
products/
    [id]/
        page.tsx
```

### Example

```tsx
interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProductPage({
    params
}: ProductPageProps) {
    const { id } = await params;

    return (
        <h1>Product ID: {id}</h1>
    );
}
```

In modern App Router versions, `params` is asynchronous.

### Important

Route parameters are strings.

If you need a number:

```tsx
const productId = Number(id);
```

Validate the result before using it.

### Static Route vs Dynamic Route

| Static Route | Dynamic Route |
|---|---|
| `/about` | `/products/101` |
| Fixed route segment | Variable route segment |
| `about/page.tsx` | `products/[id]/page.tsx` |
| No dynamic parameter required | Receives route parameters |

---

# 8. Catch-All and Optional Catch-All Routes

Next.js supports catch-all dynamic segments.

### 8.1 Catch-All Route

Folder:

```text
app/
    docs/
        [...slug]/
            page.tsx
```

Matches:

```text
/docs/getting-started
/docs/getting-started/install
/docs/api/authentication
```

Type:

```tsx
interface DocsPageProps {
    params: Promise<{
        slug: string[];
    }>;
}
```

Example:

```tsx
export default async function DocsPage({
    params
}: DocsPageProps) {
    const { slug } = await params;

    return (
        <h1>
            {slug.join(" / ")}
        </h1>
    );
}
```

### 8.2 Optional Catch-All Route

Folder:

```text
app/
    docs/
        [[...slug]]/
            page.tsx
```

Matches:

```text
/docs
/docs/getting-started
/docs/api/authentication
```

Type:

```tsx
interface DocsPageProps {
    params: Promise<{
        slug?: string[];
    }>;
}
```

### Comparison

| Route | Matches |
|---|---|
| `[slug]` | One segment |
| `[...slug]` | One or more segments |
| `[[...slug]]` | Zero or more segments |

---

# 9. Layouts in Next.js

Layouts define shared UI across multiple pages.

For example:

- Header.
- Sidebar.
- Footer.
- Navigation.
- Dashboard layout.

Create:

```text
app/
    layout.tsx
    page.tsx
    about/
        page.tsx
```

### Root Layout

```tsx
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
    title: "My Application",
    description: "Next.js TypeScript application"
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({
    children
}: RootLayoutProps) {
    return (
        <html lang="en">
            <body>
                <header>
                    <h1>My Website</h1>
                </header>

                <main>
                    {children}
                </main>

                <footer>
                    Copyright 2026
                </footer>
            </body>
        </html>
    );
}
```

### Important Concepts

| Concept | Purpose |
|---|---|
| Root Layout | Shared application shell |
| Nested Layout | Shared UI for a route segment |
| Children | Nested page or layout content |
| Metadata | SEO and page metadata |

### Nested Layout Example

```text
app/
    layout.tsx
    dashboard/
        layout.tsx
        page.tsx
        users/
            page.tsx
```

Dashboard layout:

```tsx
interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({
    children
}: DashboardLayoutProps) {
    return (
        <div className="dashboard">
            <aside>
                Sidebar
            </aside>

            <section>
                {children}
            </section>
        </div>
    );
}
```

Both `/dashboard` and `/dashboard/users` share this layout.

---

# 10. Templates in Next.js

Templates are similar to layouts, but they create a new component instance when their segment is navigated.

File:

```text
app/
    template.tsx
```

Example:

```tsx
interface TemplateProps {
    children: React.ReactNode;
}

export default function Template({
    children
}: TemplateProps) {
    return (
        <div className="page-template">
            {children}
        </div>
    );
}
```

### Layout vs Template

| Layout | Template |
|---|---|
| Preserves state across navigation where possible | Creates a new instance on navigation |
| Does not normally remount for child navigation | Remounts when its segment is navigated |
| Suitable for shared persistent UI | Suitable when fresh component state is required |
| Common for dashboards and navigation | Useful for transition or reset behavior |

---

# 11. Loading UI with loading.tsx

Next.js provides a special `loading.tsx` file.

It creates a loading UI for a route segment.

Structure:

```text
app/
    users/
        page.tsx
        loading.tsx
```

### Example

**loading.tsx**

```tsx
export default function Loading() {
    return (
        <div>
            <h2>Loading users...</h2>
        </div>
    );
}
```

**page.tsx**

```tsx
interface User {
    id: number;
    name: string;
}

export default async function UsersPage() {
    const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
    );

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    const users: User[] = await response.json();

    return (
        <div>
            {users.map(user => (
                <p key={user.id}>
                    {user.name}
                </p>
            ))}
        </div>
    );
}
```

### How It Works

The loading UI can be displayed while the route segment's content is being prepared.

Next.js uses Suspense boundaries to support this behavior.

### Common Uses

- Dashboard loading.
- Product list loading.
- User profile loading.
- API-dependent pages.
- Large content sections.

---

# 12. Error Handling with error.tsx

Next.js provides `error.tsx` for handling errors within route segments.

It must be a Client Component.

### Structure

```text
app/
    dashboard/
        page.tsx
        error.tsx
```

### Example

```tsx
"use client";

interface ErrorPageProps {
    error: Error & {
        digest?: string;
    };

    reset: () => void;
}

export default function ErrorPage({
    error,
    reset
}: ErrorPageProps) {
    return (
        <div>
            <h2>Something went wrong!</h2>

            <p>{error.message}</p>

            <button onClick={reset}>
                Try Again
            </button>
        </div>
    );
}
```

### Understanding Props

| Property | Purpose |
|---|---|
| `error` | Contains error information |
| `reset` | Attempts to re-render the failed segment |

### Important

- `error.tsx` creates an error boundary for its route segment.
- It catches errors in nested segments below it.
- It does not catch errors in the layout at the same segment level.
- Root-level layout errors require `global-error.tsx`.

### global-error.tsx

This handles errors affecting the root layout.

It must provide its own `<html>` and `<body>` elements.

```tsx
"use client";

export default function GlobalError({
    reset
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <h1>Application Error</h1>

                <button onClick={reset}>
                    Try Again
                </button>
            </body>
        </html>
    );
}
```

---

# 13. not-found.tsx in Next.js

The `not-found.tsx` file handles missing resources or routes.

Example:

```text
app/
    not-found.tsx
```

```tsx
export default function NotFound() {
    return (
        <div>
            <h1>404 - Page Not Found</h1>

            <p>The requested page does not exist.</p>
        </div>
    );
}
```

### Trigger Not Found Programmatically

Next.js provides:

```tsx
import { notFound } from "next/navigation";
```

Example:

```tsx
import { notFound } from "next/navigation";

interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProductPage({
    params
}: ProductPageProps) {
    const { id } = await params;

    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return <h1>{product.name}</h1>;
}
```

Here, `notFound()` terminates rendering for the current route segment and displays the appropriate not-found UI.

---

# 14. Server Actions in Next.js

Server Actions allow us to execute server-side functions directly from React components.

They are useful for:

- Form submissions.
- Database operations.
- Creating records.
- Updating records.
- Deleting records.
- Mutating application data.

Server Actions reduce the need to create a separate API endpoint for every form operation.

### Understanding Server Actions

A Server Action is an asynchronous server-side function marked with:

```tsx
"use server";
```

### Example 1: Basic Server Action

Create:

```text
app/actions.ts
```

```tsx
"use server";

export async function createUser() {
    console.log("Server Action executed");

    return {
        success: true,
        message: "User created"
    };
}
```

### Example 2: Use Server Action in a Component

```tsx
import { createUser } from "./actions";

export default function UserPage() {
    return (
        <form action={createUser}>
            <button type="submit">
                Create User
            </button>
        </form>
    );
}
```

When the form is submitted, the Server Action executes on the server.

### Important Security Point

Server Actions are remotely invocable server endpoints.

Therefore, always:

- Validate incoming data.
- Authenticate the user.
- Check authorization.
- Avoid trusting hidden form fields.
- Protect sensitive operations.
- Return only appropriate data.

---

# 15. Server Actions with TypeScript and FormData

Now let's create a registration form.

### Step 1: Create Server Action

```tsx
"use server";

export async function registerUser(
    formData: FormData
) {
    const name = formData.get("name");

    const email = formData.get("email");

    const password = formData.get("password");

    console.log({
        name,
        email,
        password
    });

    return {
        success: true
    };
}
```

### Step 2: Create Form

```tsx
import { registerUser } from "./actions";

export default function RegisterPage() {
    return (
        <form action={registerUser}>
            <input
                name="name"
                placeholder="Name"
            />

            <input
                name="email"
                type="email"
                placeholder="Email"
            />

            <input
                name="password"
                type="password"
                placeholder="Password"
            />

            <button type="submit">
                Register
            </button>
        </form>
    );
}
```

### Understanding FormData

`FormData` is a browser and web-platform API used to represent form fields and their values.

Important methods:

| Method | Purpose |
|---|---|
| `get()` | Gets a field value |
| `getAll()` | Gets all values for a field |
| `append()` | Adds a field |
| `set()` | Sets or replaces a field |
| `delete()` | Removes a field |
| `entries()` | Iterates through entries |

### Important TypeScript Detail

This:

```typescript
formData.get("name")
```

returns:

```typescript
FormDataEntryValue | null
```

It does not automatically return a string.

You should validate it before using it.

---

# 16. Server Actions with Zod Validation

We can combine Server Actions with Zod.

### Step 1: Create Schema

```tsx
import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(3),

    email: z.string().email(),

    password: z.string().min(8)
});

export type RegisterDTO = z.infer<
    typeof registerSchema
>;
```

### Step 2: Create Server Action

```tsx
"use server";

import { registerSchema } from "./schema";

export async function registerUser(
    formData: FormData
) {
    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password")
    };

    const result = registerSchema.safeParse(rawData);

    if (!result.success) {
        return {
            success: false,
            errors: result.error.flatten().fieldErrors
        };
    }

    const userData = result.data;

    // Hash password.
    // Save user in database.

    return {
        success: true,
        message: "Registration successful"
    };
}
```

Now the server validates data before processing it.

**Important:** Client-side validation improves the user experience, but server-side validation is mandatory because clients can bypass frontend validation.

---

# 17. useActionState with TypeScript

`useActionState` is a React Hook used to manage state returned by an Action.

It is useful for:

- Form submission status.
- Validation errors.
- Success messages.
- Server Action results.

### Step 1: Define State Type

```tsx
interface FormState {
    success: boolean;
    message: string;
}
```

### Step 2: Create Server Action

```tsx
"use server";

export async function submitForm(
    previousState: FormState,
    formData: FormData
): Promise<FormState> {
    const name = formData.get("name");

    if (typeof name !== "string" || name.length < 3) {
        return {
            success: false,
            message: "Name must contain at least 3 characters"
        };
    }

    return {
        success: true,
        message: "Form submitted successfully"
    };
}
```

### Step 3: Use useActionState

```tsx
"use client";

import { useActionState } from "react";

import { submitForm } from "./actions";

const initialState: FormState = {
    success: false,
    message: ""
};

export default function Form() {
    const [
        state,
        formAction,
        isPending
    ] = useActionState(
        submitForm,
        initialState
    );

    return (
        <form action={formAction}>
            <input
                name="name"
                placeholder="Name"
            />

            <button
                type="submit"
                disabled={isPending}
            >
                {isPending ? "Submitting..." : "Submit"}
            </button>

            <p>{state.message}</p>
        </form>
    );
}
```

### Important

`useActionState` is a React Hook, so it must be used inside a Client Component.

The action itself can execute on the server.

---

# 18. API Routes and Route Handlers

Next.js provides Route Handlers for creating HTTP endpoints.

They are defined using:

```text
route.ts
```

Example structure:

```text
app/
    api/
        users/
            route.ts
```

This creates:

```text
/api/users
```

### Supported HTTP Methods

Route Handlers support:

- GET
- POST
- PUT
- PATCH
- DELETE
- HEAD
- OPTIONS

### Example: GET Route

```tsx
import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        success: true,
        message: "Users fetched successfully"
    });
}
```

### Example: POST Route

```tsx
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();

    return NextResponse.json(
        {
            success: true,
            data: body
        },
        {
            status: 201
        }
    );
}
```

### Example: PUT Route

```tsx
import {
    NextRequest,
    NextResponse
} from "next/server";

export async function PUT(request: NextRequest) {
    const body = await request.json();

    return NextResponse.json({
        success: true,
        message: "User updated",
        data: body
    });
}
```

### Example: DELETE Route

```tsx
import { NextResponse } from "next/server";

export async function DELETE() {
    return NextResponse.json({
        success: true,
        message: "User deleted"
    });
}
```

### Route Handler vs Server Action

| Route Handler | Server Action |
|---|---|
| Defines an HTTP endpoint | Defines a server-side function |
| Uses HTTP methods | Usually invoked through React Actions or forms |
| Useful for REST APIs | Useful for UI-driven mutations |
| Can be consumed by external clients | Usually integrated with the application UI |
| Uses `Request` and `Response` APIs | Uses function arguments and return values |

---

# 19. Type-Safe Dynamic Route Handlers

We can also create dynamic API routes.

Structure:

```text
app/
    api/
        users/
            [id]/
                route.ts
```

Endpoint:

```text
/api/users/101
```

### Example

```tsx
import {
    NextRequest,
    NextResponse
} from "next/server";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    request: NextRequest,
    { params }: RouteContext
) {
    const { id } = await params;

    return NextResponse.json({
        userId: id
    });
}
```

### PUT Example

```tsx
export async function PUT(
    request: NextRequest,
    { params }: RouteContext
) {
    const { id } = await params;

    const body = await request.json();

    return NextResponse.json({
        success: true,
        userId: id,
        data: body
    });
}
```

### DELETE Example

```tsx
export async function DELETE(
    request: NextRequest,
    { params }: RouteContext
) {
    const { id } = await params;

    return NextResponse.json({
        success: true,
        deletedUserId: id
    });
}
```

**Note:** These examples use the modern asynchronous `params` convention. Older Next.js versions may use synchronous route parameters.

---

# 20. Data Fetching in Next.js

Next.js supports multiple approaches to data fetching.

Common approaches include:

1. Fetching in Server Components.
2. Fetching in Client Components.
3. Fetching through Route Handlers.
4. Fetching through Server Actions.
5. Fetching through database queries.

### 20.1 Server-Side Fetching

```tsx
interface Product {
    id: number;
    title: string;
    price: number;
}

export default async function ProductsPage() {
    const response = await fetch(
        "https://dummyjson.com/products"
    );

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    const result: {
        products: Product[];
    } = await response.json();

    return (
        <div>
            {result.products.map(product => (
                <div key={product.id}>
                    <h2>{product.title}</h2>
                    <p>{product.price}</p>
                </div>
            ))}
        </div>
    );
}
```

### 20.2 Client-Side Fetching

```tsx
"use client";

import { useEffect, useState } from "react";

interface Product {
    id: number;
    title: string;
}

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch(
                    "https://dummyjson.com/products"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const result = await response.json();

                setProducts(result.products);

            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            {products.map(product => (
                <p key={product.id}>
                    {product.title}
                </p>
            ))}
        </div>
    );
}
```

This example demonstrates the basic pattern. In production, also handle rejected requests, validate external data, and consider cancellation.

### Server Fetching vs Client Fetching

| Server Fetching | Client Fetching |
|---|---|
| Runs on the server | Runs in the browser |
| Can access server-side resources | Uses browser-accessible resources |
| Useful for initial page data | Useful for interactive updates |
| Can keep credentials private | Must not expose server secrets |
| Supports server rendering | Supports client-side updates |

---

# 21. Caching and Revalidation in Next.js

Caching is an important Next.js concept.

It helps reduce unnecessary network requests and improve performance.

Next.js provides several caching and revalidation mechanisms.

Important concepts include:

- Data Cache.
- Request memoization.
- Full Route Cache.
- Router Cache.
- Revalidation.

Exact caching behavior depends on the Next.js version and the configuration of the request or route.

### 21.1 Time-Based Revalidation

Example:

```tsx
const response = await fetch(
    "https://api.example.com/products",
    {
        next: {
            revalidate: 60
        }
    }
);
```

This requests revalidation after the specified time interval.

### 21.2 No Caching

```tsx
const response = await fetch(
    "https://api.example.com/products",
    {
        cache: "no-store"
    }
);
```

This requests fresh data rather than using the persistent Data Cache.

### 21.3 Revalidate a Path

Next.js provides:

```tsx
import { revalidatePath } from "next/cache";
```

Example in a Server Action:

```tsx
"use server";

import { revalidatePath } from "next/cache";

export async function createProduct() {
    // Insert product into database.

    revalidatePath("/products");
}
```

This invalidates the relevant cached route data so the page can be regenerated with fresh data.

### 21.4 Revalidate a Tag

```tsx
import { revalidateTag } from "next/cache";

export async function updateProduct() {
    // Update database.

    revalidateTag("products", "max");
}
```

To associate a tag with a fetch request:

```tsx
const response = await fetch(
    "https://api.example.com/products",
    {
        next: {
            tags: ["products"]
        }
    }
);
```

The `"max"` profile uses stale-while-revalidate behavior.

### Important Caching Concepts

| Concept | Purpose |
|---|---|
| `cache: "no-store"` | Avoid persistent Data Cache for a fetch |
| `revalidate` | Configure time-based revalidation |
| `revalidatePath()` | Invalidate cache associated with a route |
| `revalidateTag()` | Invalidate data associated with a tag |
| `tags` | Associate fetch data with cache tags |

---

# 22. Database Integration with Next.js

Next.js can communicate directly with databases through server-side code.

You do not always need a separate Express backend.

For example:

```text
Next.js Application
       |
       v
Server Component / Server Action
       |
       v
Database Library / ORM
       |
       v
MySQL / MongoDB / PostgreSQL
```

### Example Using Prisma

Prisma is a popular ORM.

Install:

```bash
npm install prisma @prisma/client
```

Initialize:

```bash
npx prisma init
```

### Example Prisma Model

In `prisma/schema.prisma`:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
}
```

Configure your database connection using the environment variable generated in the Prisma setup.

### Create Prisma Client

Create:

```text
src/lib/prisma.ts
```

```tsx
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
```

This pattern helps avoid creating unnecessary Prisma Client instances during development hot reloads.

### Fetch Users from a Server Component

```tsx
import { prisma } from "@/lib/prisma";

export default async function UsersPage() {
    const users = await prisma.user.findMany();

    return (
        <div>
            {users.map(user => (
                <div key={user.id}>
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                </div>
            ))}
        </div>
    );
}
```

### Important Database Security Rules

1. Access databases only from server-side code.
2. Never expose database credentials to the browser.
3. Do not import database clients into Client Components.
4. Validate incoming data.
5. Use appropriate authorization checks.
6. Use transactions for related operations.
7. Handle database errors safely.

You can also use Sequelize or Mongoose in Next.js server-side code if your application requires them.

---

# 23. Authentication with Next.js and Auth.js

Authentication is a major part of full-stack applications.

Auth.js is a popular authentication solution for applications including Next.js.

It supports several authentication approaches:

- OAuth providers.
- Email-based authentication.
- Credentials-based authentication.
- Database sessions.
- JWT sessions.

### Basic Authentication Architecture

```text
User
 |
 v
Login Page
 |
 v
Auth.js
 |
 v
Authentication Provider
 |
 v
Session / Token
 |
 v
Protected Application
```

### Important Concepts

| Concept | Purpose |
|---|---|
| Authentication Provider | Defines how users authenticate |
| Session | Represents authenticated user state |
| JWT | Token-based session strategy |
| Database Session | Stores session information in a database |
| Callbacks | Customize authentication lifecycle |
| Events | Execute logic when authentication events occur |

### Example Configuration Concept

A simplified Auth.js configuration:

```tsx
import NextAuth from "next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: []
});
```

This configuration does not enable authentication by itself. You must configure at least one provider and the required session/database settings.

### Route Handler Integration

Example:

```tsx
// app/api/auth/[...nextauth]/route.ts

import { handlers } from "@/auth";

export const {
    GET,
    POST
} = handlers;
```

### Access Session in Server Component

```tsx
import { auth } from "@/auth";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        return <h1>Please log in</h1>;
    }

    return (
        <h1>
            Welcome {session.user.name}
        </h1>
    );
}
```

### Important Security Considerations

- Verify authentication on the server.
- Perform authorization checks for sensitive operations.
- Do not trust client-side session state alone.
- Configure secure cookies.
- Validate callback URLs.
- Protect sensitive routes and data.
- Avoid exposing secrets.

---

# 24. Middleware and Proxy in Next.js

Next.js supports request interception before a request is completed.

Historically, this feature used:

```text
middleware.ts
```

In newer Next.js versions, the convention is moving to:

```text
proxy.ts
```

Use the convention supported by the Next.js version installed in your project.

### Example: Proxy

Create:

```text
src/proxy.ts
```

```tsx
import {
    NextRequest,
    NextResponse
} from "next/server";

export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    if (pathname.startsWith("/dashboard")) {
        const isAuthenticated = false;

        if (!isAuthenticated) {
            return NextResponse.redirect(
                new URL("/login", request.url)
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*"
    ]
};
```

This is an illustrative request interception example. A real implementation should use a trustworthy authentication mechanism rather than a hardcoded boolean.

### Common Uses

- Redirects.
- URL rewriting.
- Request header manipulation.
- Lightweight authentication checks.
- Locale handling.
- Request filtering.

### Important Security Note

Proxy or middleware checks should not be the only authorization layer.

Sensitive database operations and Server Actions must perform their own authorization checks.

---

# 25. Metadata and SEO in Next.js

SEO stands for Search Engine Optimization.

Next.js provides a Metadata API.

We can define metadata using TypeScript.

### Static Metadata

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home Page",
    description: "Welcome to our website"
};

export default function HomePage() {
    return <h1>Home Page</h1>;
}
```

### Dynamic Metadata

Suppose we have product pages.

We can generate metadata based on product information.

```tsx
import type { Metadata } from "next";

interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({
    params
}: ProductPageProps): Promise<Metadata> {
    const { id } = await params;

    const product = await getProduct(id);

    if (!product) {
        return {
            title: "Product Not Found"
        };
    }

    return {
        title: product.name,
        description: product.description
    };
}

export default async function ProductPage({
    params
}: ProductPageProps) {
    const { id } = await params;

    const product = await getProduct(id);

    if (!product) {
        return <h1>Product not found</h1>;
    }

    return <h1>{product.name}</h1>;
}
```

### Other SEO Features

Next.js supports:

- Open Graph metadata.
- Twitter metadata.
- Canonical URLs.
- Robots metadata.
- Sitemap generation.
- Robots.txt generation.
- Metadata templates.

### Sitemap Example

Create:

```text
app/sitemap.ts
```

```tsx
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://example.com",
            lastModified: new Date()
        },
        {
            url: "https://example.com/about",
            lastModified: new Date()
        }
    ];
}
```

---

# 26. Image Optimization with Next.js

Next.js provides the `Image` component.

It offers optimized image loading and rendering features.

Import:

```tsx
import Image from "next/image";
```

### Example

```tsx
import Image from "next/image";

export default function Profile() {
    return (
        <Image
            src="/profile.jpg"
            alt="Profile picture"
            width={300}
            height={300}
        />
    );
}
```

### Remote Images

For remote images, configure allowed image sources in `next.config.ts`.

Example:

```tsx
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.example.com"
            }
        ]
    }
};

export default nextConfig;
```

Use:

```tsx
<Image
    src="https://images.example.com/product.jpg"
    alt="Product"
    width={500}
    height={500}
/>
```

### Important Image Properties

| Property | Purpose |
|---|---|
| `src` | Image source |
| `alt` | Alternative text |
| `width` | Image width |
| `height` | Image height |
| `fill` | Fills the parent container |
| `priority` | Prioritizes loading |
| `sizes` | Provides responsive image size hints |
| `quality` | Controls output quality |

### Image Optimization Benefits

- Responsive image delivery.
- Optimized formats where supported.
- Lazy loading by default in suitable cases.
- Reduced image transfer sizes.
- Better loading performance.

---

# 27. Environment Variables in Next.js

Environment variables store configuration outside source code.

Example `.env.local`:

```env
DATABASE_URL="mysql://localhost:3306/mydb"

JWT_SECRET="your-secret"

NEXT_PUBLIC_API_URL="http://localhost:5000"
```

### Server-Side Environment Variables

```tsx
const databaseUrl = process.env.DATABASE_URL;
```

These are intended for server-side use.

### Client-Side Environment Variables

Variables prefixed with:

```text
NEXT_PUBLIC_
```

can be exposed to browser-side code.

Example:

```tsx
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

### Important Difference

| Variable | Availability |
|---|---|
| `DATABASE_URL` | Server-side |
| `JWT_SECRET` | Server-side |
| `NEXT_PUBLIC_API_URL` | Can be exposed to browser code |

**Never use `NEXT_PUBLIC_` for secrets.**

### Validate Environment Variables

We can use Zod.

```tsx
import { z } from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string().min(1),

    JWT_SECRET: z.string().min(32)
});

export const env = envSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET
});
```

---

# 28. Centralized Error Handling in Next.js

Next.js provides different error-handling mechanisms depending on where an error occurs.

### 28.1 Route Segment Errors

Use:

```text
error.tsx
```

### 28.2 Root Layout Errors

Use:

```text
global-error.tsx
```

### 28.3 Not Found Errors

Use:

```text
not-found.tsx
```

### 28.4 Server Action Errors

Return structured results for expected validation or business errors.

Example:

```tsx
"use server";

interface ActionResult {
    success: boolean;
    message: string;
}

export async function createProduct(
    formData: FormData
): Promise<ActionResult> {
    const name = formData.get("name");

    if (typeof name !== "string" || !name.trim()) {
        return {
            success: false,
            message: "Product name is required"
        };
    }

    // Database operation.

    return {
        success: true,
        message: "Product created"
    };
}
```

### Expected vs Unexpected Errors

| Expected Errors | Unexpected Errors |
|---|---|
| Invalid form data | Database connection failure |
| User not found | Programming errors |
| Duplicate email | Unexpected infrastructure failure |
| Insufficient permissions | Unexpected runtime failure |

Expected errors can often be represented as structured return values.

Unexpected errors should be logged and handled through error boundaries or centralized error-handling mechanisms.

---

# 29. Performance Optimization in Next.js

Next.js provides several features for performance optimization.

### 29.1 Server Components

Use Server Components where possible to reduce client-side JavaScript.

### 29.2 Dynamic Imports

Dynamic imports allow components to be loaded on demand.

```tsx
"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(
    () => import("./Chart"),
    {
        loading: () => <p>Loading chart...</p>
    }
);

export default function Dashboard() {
    return <Chart />;
}
```

### 29.3 Streaming

Streaming allows parts of a page to be sent to the browser as they become ready.

It can be implemented using Suspense boundaries.

```tsx
import { Suspense } from "react";

export default function Dashboard() {
    return (
        <div>
            <h1>Dashboard</h1>

            <Suspense fallback={<p>Loading users...</p>}>
                <Users />
            </Suspense>
        </div>
    );
}
```

### 29.4 Parallel Data Fetching

Instead of fetching independent resources sequentially:

```tsx
const users = await getUsers();

const products = await getProducts();
```

Fetch them in parallel:

```tsx
const [users, products] = await Promise.all([
    getUsers(),
    getProducts()
]);
```

This can reduce total waiting time.

### 29.5 Avoid Unnecessary Client Components

Do not add `"use client"` to every component.

Use Client Components only when client-side interactivity is required.

### Performance Checklist

- Prefer Server Components for non-interactive UI.
- Use Client Components selectively.
- Optimize images.
- Use caching appropriately.
- Fetch independent data in parallel.
- Use streaming where beneficial.
- Avoid unnecessarily large client bundles.
- Implement pagination for large datasets.
- Use database indexes.
- Monitor Core Web Vitals.

---

# 30. Testing Next.js Applications with TypeScript

Testing is essential for reliable applications.

Popular tools include:

- Vitest.
- Jest.
- React Testing Library.
- Playwright.

### Unit Testing

Test individual functions.

Example:

```tsx
export function calculateTotal(
    price: number,
    quantity: number
): number {
    return price * quantity;
}
```

Test:

```tsx
import {
    describe,
    it,
    expect
} from "vitest";

import { calculateTotal } from "./calculateTotal";

describe("calculateTotal", () => {
    it("should calculate total price", () => {
        expect(
            calculateTotal(100, 5)
        ).toBe(500);
    });
});
```

### Component Testing

Test individual React components.

```tsx
import {
    render,
    screen
} from "@testing-library/react";

import { expect, it } from "vitest";

import HomePage from "./page";

it("should render heading", () => {
    render(<HomePage />);

    expect(
        screen.getByText("Welcome")
    ).toBeInTheDocument();
});
```

### End-to-End Testing

Playwright can simulate real browser interactions.

Example:

```typescript
import {
    test,
    expect
} from "@playwright/test";

test("home page should load", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await expect(
        page.getByRole("heading", {
            name: "Welcome"
        })
    ).toBeVisible();
});
```

### What Should You Test?

| Area | Testing |
|---|---|
| Components | UI rendering |
| Forms | Validation |
| Server Actions | Data mutations |
| Route Handlers | HTTP responses |
| Authentication | Session handling |
| Authorization | Permission checks |
| Database | CRUD operations |
| Navigation | Routing |
| Full Application | End-to-end workflows |

---

# 31. Production Deployment

After development, we need to deploy the Next.js application.

Common deployment platforms include:

- Vercel.
- AWS.
- Docker-based hosting.
- Node.js servers.
- Other compatible hosting providers.

### Step 1: Build Application

```bash
npm run build
```

### Step 2: Start Production Server

```bash
npm run start
```

### Step 3: Configure Environment Variables

Production environment:

```env
DATABASE_URL=production_database_url

JWT_SECRET=production_secret

NEXT_PUBLIC_API_URL=https://api.example.com
```

### Step 4: Deployment Considerations

Before deployment:

- Build successfully.
- Validate environment variables.
- Configure database access.
- Apply database migrations.
- Configure authentication.
- Configure allowed origins.
- Test API endpoints.
- Review image configuration.
- Enable HTTPS.
- Configure logging and monitoring.

### Deployment Architecture

```text
User
 |
 v
Browser
 |
 v
Next.js Application
 |
 |---- Server Components
 |
 |---- Client Components
 |
 |---- Server Actions
 |
 |---- Route Handlers
 |
 v
Database
 |
 v
MySQL / MongoDB / PostgreSQL
```

### Important Deployment Concepts

| Concept | Purpose |
|---|---|
| Build | Generates production output |
| Environment Variables | Provides runtime configuration |
| HTTPS | Encrypts communication |
| CDN | Distributes static assets |
| Database Migration | Updates database schema |
| Monitoring | Tracks application health |
| Logging | Helps diagnose issues |
| CI/CD | Automates testing and deployment |

---

# 32. Recommended Professional Next.js Project Structure

For a large Next.js application, you can use the following structure:

```text
src/
│
├── app/
│   │
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   │
│   │   ├── users/
│   │   │   └── page.tsx
│   │   │
│   │   └── products/
│   │       └── page.tsx
│   │
│   ├── api/
│   │   ├── users/
│   │   │   └── route.ts
│   │   │
│   │   └── products/
│   │       └── route.ts
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── common/
│   ├── forms/
│   └── layout/
│
├── features/
│   ├── auth/
│   ├── users/
│   └── products/
│
├── actions/
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   └── utils.ts
│
├── services/
│
├── schemas/
│
├── types/
│
└── hooks/
```

### Understanding Route Groups

Notice:

```text
(auth)
(dashboard)
```

These are route groups.

They help organize routes without adding the group name to the URL.

For example:

```text
app/(auth)/login/page.tsx
```

Creates:

```text
/login
```

Not:

```text
/auth/login
```

### Why Use Feature-Based Architecture?

It keeps related functionality together.

For example:

```text
features/
    users/
        components/
        services/
        schemas/
        types/
```

This makes large applications easier to maintain.

---

# 33. Next.js Important Concepts: Quick Comparison

| Concept | Purpose |
|---|---|
| App Router | File-system-based routing |
| Server Component | Server-rendered component with server capabilities |
| Client Component | Component supporting client-side interactivity |
| `"use client"` | Declares a client module boundary |
| `"use server"` | Marks server-side functions or files |
| Server Action | Server-side function invoked through React Actions |
| Route Handler | Creates HTTP endpoints |
| Layout | Shared UI across routes |
| Template | Recreated layout-like wrapper |
| Loading | Loading boundary |
| Error | Route-level error boundary |
| Not Found | Handles missing resources |
| Metadata | SEO information |
| Revalidation | Refreshes cached data |
| Proxy | Intercepts requests before route handling |

---

# 34. Common Mistakes in Next.js with TypeScript

| Mistake | Better Approach |
|---|---|
| Using `useState` in Server Components | Create a Client Component |
| Adding `"use client"` everywhere | Use it only where needed |
| Accessing `window` on the server | Access browser APIs in client-side code |
| Exposing database credentials | Keep secrets server-side |
| Passing non-serializable props | Pass supported serializable values |
| Trusting client-side validation | Validate on the server |
| Using Server Actions without authorization | Verify permissions inside each sensitive action |
| Treating Server Actions as ordinary private functions | Remember they can be remotely invoked |
| Using middleware as the only security layer | Protect the underlying server operations |
| Returning unvalidated API data | Validate external data |
| Fetching independent APIs sequentially | Use `Promise.all` |
| Ignoring caching behavior | Configure caching intentionally |
| Using incorrect dynamic route types | Follow the installed Next.js version's route conventions |
| Exposing secrets through `NEXT_PUBLIC_` | Keep sensitive variables server-only |
| Ignoring loading and error boundaries | Implement appropriate UI boundaries |

---

# 35. Important Interview Questions and Answers

### Q1. What is Next.js?

Next.js is a React framework that provides routing, rendering, data fetching, server-side functionality, and production optimizations.

### Q2. What is the App Router?

The App Router is Next.js's file-system-based routing system built around the `app` directory.

### Q3. What is a Server Component?

A Server Component is a React component that renders on the server and can access server-side resources.

### Q4. What is a Client Component?

A Client Component supports client-side interactivity, React state, effects, event handlers, and browser APIs.

### Q5. What is the purpose of `"use client"`?

It declares a client module boundary, allowing client-side React functionality in that module and its imported dependencies.

### Q6. Are Client Components rendered on the server?

They can be prerendered into HTML on the server during the initial page load and then hydrated in the browser.

### Q7. Can Server Components use useState?

No. Server Components cannot use client-only React Hooks such as `useState` and `useEffect`.

### Q8. Can Client Components directly import Server Components?

No. However, Server Components can pass rendered Server Component content to Client Components through children or other supported slots.

### Q9. What is the difference between Server Components and SSR?

Server Components are a React component architecture. SSR is a rendering strategy that generates HTML on the server. They are related but not interchangeable concepts.

### Q10. What are dynamic routes?

Dynamic routes use variable route segments such as `[id]`.

### Q11. What is a catch-all route?

A catch-all route uses `[...slug]` to match multiple URL segments.

### Q12. What is an optional catch-all route?

An optional catch-all route uses `[[...slug]]` and can also match the parent route without additional segments.

### Q13. What is a layout?

A layout defines shared UI across multiple routes.

### Q14. Difference between layout and template?

Layouts preserve state across navigation where possible, whereas templates create a new instance when navigated.

### Q15. What is loading.tsx?

It defines a loading UI for a route segment using Suspense-based loading behavior.

### Q16. What is error.tsx?

It defines a route-level error boundary and must be a Client Component.

### Q17. What is not-found.tsx?

It defines the UI displayed when a route or requested resource is not found.

### Q18. What is a Server Action?

A Server Action is a server-side function that can be invoked through React Actions, commonly for data mutations.

### Q19. What is useActionState?

It is a React Hook that manages state associated with an Action, including returned values and pending status.

### Q20. What is a Route Handler?

A Route Handler is a Next.js file-based HTTP endpoint defined using `route.ts`.

### Q21. Difference between Server Actions and Route Handlers?

Server Actions are function-based server mutations, while Route Handlers expose HTTP endpoints.

### Q22. What is revalidatePath?

It invalidates cached data associated with a particular route path.

### Q23. What is revalidateTag?

It invalidates cached data associated with a particular cache tag.

### Q24. What is Auth.js?

Auth.js is an authentication solution that supports multiple authentication providers and session strategies.

### Q25. What is the purpose of Next.js Proxy?

Proxy intercepts requests before they reach the corresponding route and can perform lightweight request handling, redirects, and rewrites.

### Q26. What is Metadata API?

The Metadata API allows developers to define SEO-related information such as page titles and descriptions.

### Q27. What is next/image?

It is a Next.js component that provides optimized image loading and rendering capabilities.

### Q28. What is the difference between NEXT_PUBLIC and normal environment variables?

Variables prefixed with `NEXT_PUBLIC_` can be exposed to browser code, whereas ordinary environment variables are intended for server-side use.

### Q29. Can Next.js directly communicate with a database?

Yes. Server Components, Server Actions, and Route Handlers can access databases through server-side libraries.

### Q30. Why should database code not be imported into Client Components?

Because it can expose server-only dependencies and potentially sensitive implementation details or credentials.

### Q31. What is streaming?

Streaming allows a page to progressively send rendered content to the browser as different parts become ready.

### Q32. What is hydration?

Hydration is the process of attaching React's client-side behavior to HTML that was already rendered.

### Q33. What is route grouping?

Route grouping organizes related routes using parentheses without affecting the URL path.

### Q34. What is the difference between revalidate and no-store?

`revalidate` configures time-based cache revalidation, while `no-store` requests that a fetch response not be stored in the persistent Data Cache.

### Q35. Can TypeScript validate Server Action input automatically?

No. TypeScript provides compile-time checks. Server Action input must be validated at runtime.

---

# 36. Practical Exercises

Complete these exercises to strengthen your understanding.

## Exercise 1: Basic Next.js Application

Create a Next.js application using TypeScript.

Implement:

```text
/
/about
/contact
/dashboard
```

Requirements:

- App Router.
- Root layout.
- Navigation.
- TypeScript components.
- Shared components.

## Exercise 2: Dynamic Product Routes

Create:

```text
/products
/products/1
/products/2
/products/3
```

Requirements:

- Dynamic route.
- Route parameter typing.
- Product data fetching.
- Not-found handling.

## Exercise 3: Server and Client Components

Create a dashboard.

Requirements:

- Server Component for initial data.
- Client Component for interactive filters.
- Counter component.
- Search input.
- Proper Server/Client boundaries.

## Exercise 4: Loading and Error Boundaries

Implement:

- `loading.tsx`.
- `error.tsx`.
- `not-found.tsx`.
- `global-error.tsx`.

Test different error scenarios.

## Exercise 5: Server Actions

Create a user registration form.

Requirements:

- Server Action.
- FormData.
- Zod validation.
- Database insertion.
- Success and error messages.

## Exercise 6: Route Handlers

Create:

```text
GET    /api/users
POST   /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

Requirements:

- TypeScript.
- Request validation.
- Proper status codes.
- Centralized error strategy.

## Exercise 7: Database Integration

Connect Next.js with either:

- MySQL + Sequelize.
- MongoDB + Mongoose.
- PostgreSQL + Prisma.

Implement complete CRUD operations.

## Exercise 8: Authentication

Implement:

- Registration.
- Login.
- Logout.
- Session management.
- Protected pages.
- Protected server operations.
- Role-based authorization.

## Exercise 9: Caching

Practice:

- Time-based revalidation.
- `no-store`.
- `revalidatePath`.
- `revalidateTag`.

## Exercise 10: SEO

Implement:

- Static metadata.
- Dynamic metadata.
- Sitemap.
- Robots configuration.
- Open Graph metadata.

## Exercise 11: Complete Next.js Project

Build a **Product Management and E-Commerce Dashboard**.

Required features:

- Authentication.
- Admin dashboard.
- User management.
- Product management.
- Category management.
- CRUD operations.
- Database integration.
- Image uploads.
- Server Actions.
- Route Handlers.
- Zod validation.
- Pagination.
- Sorting.
- Filtering.
- Search.
- SEO.
- Loading states.
- Error boundaries.
- Testing.
- Production deployment.

---

# 37. Phase 38 Completion Checklist

| Topic | Completion |
|---|---|
| Next.js TypeScript Setup | ☐ |
| App Router | ☐ |
| Server Components | ☐ |
| Client Components | ☐ |
| Server/Client Boundaries | ☐ |
| Dynamic Routing | ☐ |
| Catch-All Routes | ☐ |
| Layouts | ☐ |
| Templates | ☐ |
| Loading UI | ☐ |
| Error Boundaries | ☐ |
| Not Found | ☐ |
| Server Actions | ☐ |
| useActionState | ☐ |
| Route Handlers | ☐ |
| Request and Response Typing | ☐ |
| Data Fetching | ☐ |
| Caching | ☐ |
| Revalidation | ☐ |
| Database Integration | ☐ |
| Authentication | ☐ |
| Proxy | ☐ |
| Zod Validation | ☐ |
| Metadata and SEO | ☐ |
| Image Optimization | ☐ |
| Environment Variables | ☐ |
| Error Handling | ☐ |
| Performance Optimization | ☐ |
| Testing | ☐ |
| Production Deployment | ☐ |

---

# 38. What You Should Be Able to Build After Phase 38

After completing this phase, you should be able to build full-stack applications using Next.js and TypeScript without necessarily maintaining a separate Express backend for every project.

Your architecture can look like this:

```text
                 Next.js
                    |
          ---------------------
          |                   |
          v                   v
    Server Components   Client Components
          |                   |
          v                   v
     Server Actions      React Hooks
          |                   |
          v                   v
     Route Handlers      TanStack Query
          |                   |
          ---------------------
                    |
                    v
              Server Logic
                    |
                    v
               Database
                    |
          ---------------------
          |         |         |
          v         v         v
         SQL      MongoDB    APIs
```

You should understand:

- How Next.js routing works.
- How Server and Client Components differ.
- How to build backend functionality inside Next.js.
- How to use Server Actions.
- How to create HTTP endpoints.
- How to integrate databases.
- How to implement authentication.
- How to validate data.
- How caching and revalidation work.
- How to optimize and deploy full-stack applications.

---

# Next Phase

## Phase 39: Advanced TypeScript – Design Patterns and Software Architecture

In the next phase, we will cover:

1. Understanding Software Design Patterns.
2. Creational Design Patterns.
3. Singleton Pattern.
4. Factory Pattern.
5. Abstract Factory Pattern.
6. Builder Pattern.
7. Prototype Pattern.
8. Structural Design Patterns.
9. Adapter Pattern.
10. Decorator Pattern.
11. Facade Pattern.
12. Proxy Pattern.
13. Composite Pattern.
14. Behavioral Design Patterns.
15. Observer Pattern.
16. Strategy Pattern.
17. Command Pattern.
18. State Pattern.
19. Template Method Pattern.
20. Chain of Responsibility.
21. Dependency Injection.
22. Dependency Inversion Principle.
23. SOLID Principles.
24. Clean Architecture.
25. Domain-Driven Design Fundamentals.
26. Repository Pattern.
27. Unit of Work Pattern.
28. Event-Driven Architecture.
29. Practical Design Patterns with TypeScript.
30. Complete Architecture-Based Project.

**When you're ready, say: `OK, Phase 39`.**