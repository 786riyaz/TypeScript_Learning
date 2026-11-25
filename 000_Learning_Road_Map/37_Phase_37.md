# Phase 37: TypeScript with React – Advanced Frontend Development

**Level:** Advanced to Expert  
**Prerequisites:** JavaScript, TypeScript fundamentals, React fundamentals, JSX, components, props, state, hooks, REST APIs, and basic frontend development.

---

# 1. Learning Objectives

In this phase, you will learn how to build scalable, maintainable, and type-safe React applications using TypeScript.

We will cover:

1. Setting up React with TypeScript.
2. Understanding JSX and TSX.
3. Functional components with TypeScript.
4. Props typing.
5. State typing.
6. Event handling.
7. React Hooks with TypeScript.
8. `useState` and `useReducer`.
9. `useEffect` and `useRef`.
10. Custom Hooks.
11. Context API with TypeScript.
12. Advanced component patterns.
13. Generics in React components.
14. Forms and validation.
15. React Hook Form with Zod.
16. API integration.
17. Axios and Fetch.
18. TanStack Query.
19. Type-safe routing.
20. Authentication.
21. Performance optimization.
22. Testing React components.
23. Scalable React architecture.
24. Complete React + TypeScript project.

---

# 2. Setting Up React with TypeScript

First, let's create a React application using TypeScript.

There are several ways to create a React + TypeScript project.

For this phase, we will use Vite.

### Step 1: Create Project

```bash
npm create vite@latest react-typescript-app
```

Select:

```text
Framework: React
Variant: TypeScript
```

Alternatively:

```bash
npm create vite@latest react-typescript-app -- --template react-ts
```

### Step 2: Navigate to Project

```bash
cd react-typescript-app
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start Development Server

```bash
npm run dev
```

Your React application will start.

### Project Structure

```text
react-typescript-app/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │
│   ├── hooks/
│   │
│   ├── pages/
│   │
│   ├── services/
│   │
│   ├── types/
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Important Dependencies

A typical React + TypeScript application uses:

| Package | Purpose |
|---|---|
| `react` | React library |
| `react-dom` | React DOM rendering |
| `typescript` | TypeScript compiler |
| `@types/react` | React type definitions |
| `@types/react-dom` | React DOM type definitions |
| `vite` | Development server and build tool |

Vite's React TypeScript template includes the necessary TypeScript dependencies.

---

# 3. Understanding JSX and TSX

Before learning React with TypeScript, understand the difference between JSX and TSX.

### JSX

JSX stands for JavaScript XML.

It allows us to write HTML-like syntax inside JavaScript.

Example:

```jsx
function App() {
    return <h1>Hello React</h1>;
}

export default App;
```

File:

```text
App.jsx
```

### TSX

TSX allows us to write JSX syntax inside TypeScript.

Example:

```tsx
function App() {
    const username: string = "John";

    return <h1>Hello {username}</h1>;
}

export default App;
```

File:

```text
App.tsx
```

### JSX vs TSX

| JSX | TSX |
|---|---|
| JavaScript + JSX | TypeScript + JSX |
| Uses `.jsx` extension | Uses `.tsx` extension |
| No TypeScript static type checking | Supports TypeScript static type checking |
| JavaScript variables | TypeScript variables and types |
| Used in React JavaScript projects | Used in React TypeScript projects |

### When to Use `.ts` and `.tsx`?

| Extension | Usage |
|---|---|
| `.ts` | TypeScript files without JSX |
| `.tsx` | TypeScript files containing JSX |

Example:

```text
src/
    components/
        Button.tsx
        Header.tsx

    services/
        userService.ts

    types/
        user.types.ts
```

**Important:** You can use TypeScript types in `.tsx` files, but JSX syntax requires the `.tsx` extension.

---

# 4. Creating Functional Components with TypeScript

A React component is a reusable piece of UI.

In React with TypeScript, we can define functional components using ordinary TypeScript functions.

### JavaScript Component

```jsx
function Welcome() {
    return <h1>Welcome to React</h1>;
}

export default Welcome;
```

### TypeScript Component

```tsx
function Welcome(): React.JSX.Element {
    return <h1>Welcome to React</h1>;
}

export default Welcome;
```

Here:

```typescript
React.JSX.Element
```

represents a JSX element returned by the component.

You can also write:

```tsx
function Welcome() {
    return <h1>Welcome to React</h1>;
}
```

TypeScript can infer the return type automatically.

### Another Example

```tsx
const UserProfile = () => {
    const name: string = "John";

    const age: number = 25;

    return (
        <div>
            <h1>{name}</h1>
            <p>Age: {age}</p>
        </div>
    );
};

export default UserProfile;
```

### Important Point

You generally do not need to explicitly specify `React.FC` for every functional component.

Both approaches are valid:

```tsx
function Welcome() {
    return <h1>Hello</h1>;
}
```

And:

```tsx
const Welcome: React.FC = () => {
    return <h1>Hello</h1>;
};
```

However, ordinary function declarations or inferred function types are often simpler.

---

# 5. Props Typing in React

Props are used to pass data from a parent component to a child component.

In JavaScript, props are not checked by TypeScript.

In TypeScript, we can define exactly which props a component accepts.

### Example 1: Basic Props

```tsx
interface UserProps {
    name: string;
    age: number;
}

function UserCard({ name, age }: UserProps) {
    return (
        <div>
            <h2>{name}</h2>
            <p>Age: {age}</p>
        </div>
    );
}

export default UserCard;
```

Use the component:

```tsx
function App() {
    return (
        <UserCard
            name="John"
            age={25}
        />
    );
}
```

### What Happens If We Pass Incorrect Props?

```tsx
<UserCard
    name={123}
    age="twenty"
/>
```

TypeScript will report errors because:

- `name` expects a string.
- `age` expects a number.

### 5.1 Required Props

```tsx
interface UserProps {
    name: string;
    age: number;
}
```

Both properties are required.

### 5.2 Optional Props

Use `?` to make a property optional.

```tsx
interface UserProps {
    name: string;
    age?: number;
}
```

Now the following is valid:

```tsx
<UserCard name="John" />
```

### 5.3 Default Props

You can provide default values through destructuring.

```tsx
interface UserProps {
    name: string;
    role?: string;
}

function UserCard({
    name,
    role = "User"
}: UserProps) {
    return (
        <div>
            <h2>{name}</h2>
            <p>{role}</p>
        </div>
    );
}
```

If `role` is not passed, the default value will be `"User"`.

### 5.4 Readonly Props

You can use `readonly` to prevent reassignment of a property within TypeScript code.

```tsx
interface UserProps {
    readonly id: number;
    readonly name: string;
}
```

This prevents:

```typescript
props.name = "Updated";
```

However, `readonly` is a compile-time restriction, not runtime immutability.

### 5.5 Props with Arrays

```tsx
interface User {
    id: number;
    name: string;
}

interface UserListProps {
    users: User[];
}

function UserList({ users }: UserListProps) {
    return (
        <ul>
            {users.map(user => (
                <li key={user.id}>
                    {user.name}
                </li>
            ))}
        </ul>
    );
}
```

### 5.6 Props with Objects

```tsx
interface Address {
    city: string;
    country: string;
}

interface UserProps {
    name: string;
    address: Address;
}

function UserCard({ name, address }: UserProps) {
    return (
        <div>
            <h2>{name}</h2>
            <p>{address.city}</p>
            <p>{address.country}</p>
        </div>
    );
}
```

### Summary

| Concept | TypeScript Syntax |
|---|---|
| Required prop | `name: string` |
| Optional prop | `name?: string` |
| Array prop | `users: User[]` |
| Object prop | `address: Address` |
| Readonly prop | `readonly id: number` |
| Default prop | `name = "Guest"` |

---

# 6. Understanding children Props

In React, `children` represents content placed between a component's opening and closing tags.

Example:

```tsx
<Card>
    <h1>Hello World</h1>
</Card>
```

The content inside `Card` is available through `children`.

### Typing Children

React provides:

```typescript
React.ReactNode
```

`ReactNode` represents content React can render, including:

- JSX elements.
- Strings.
- Numbers.
- Fragments.
- Arrays of renderable nodes.
- `null`.
- `undefined`.

Example:

```tsx
interface CardProps {
    children: React.ReactNode;
}

function Card({ children }: CardProps) {
    return (
        <div className="card">
            {children}
        </div>
    );
}
```

Usage:

```tsx
function App() {
    return (
        <Card>
            <h1>Welcome</h1>
            <p>This is a card component.</p>
        </Card>
    );
}
```

### Optional Children

```tsx
interface CardProps {
    children?: React.ReactNode;
}
```

Now the component can also be used without children.

---

# 7. Typing Function Props

Sometimes a parent component passes a function to a child component.

For example, a button component receives a callback.

### Example

```tsx
interface ButtonProps {
    onClick: () => void;
}

function CustomButton({ onClick }: ButtonProps) {
    return (
        <button onClick={onClick}>
            Click Me
        </button>
    );
}
```

Usage:

```tsx
function App() {
    function handleClick() {
        console.log("Button clicked");
    }

    return (
        <CustomButton onClick={handleClick} />
    );
}
```

### Function with Parameters

```tsx
interface UserProps {
    onSelect: (userId: number) => void;
}

function UserCard({ onSelect }: UserProps) {
    return (
        <button onClick={() => onSelect(101)}>
            Select User
        </button>
    );
}
```

### Function with Return Value

```tsx
interface CalculatorProps {
    calculate: (a: number, b: number) => number;
}
```

Example:

```tsx
function Calculator({
    calculate
}: CalculatorProps) {
    const result = calculate(10, 20);

    return <h1>{result}</h1>;
}
```

### Function Types Summary

| Function | Type |
|---|---|
| No arguments, no return | `() => void` |
| One string argument | `(name: string) => void` |
| One number argument | `(id: number) => void` |
| Two number arguments, returns number | `(a: number, b: number) => number` |
| Returns boolean | `() => boolean` |

---

# 8. State Typing with useState

`useState` is one of the most commonly used React Hooks.

It allows functional components to maintain state.

In TypeScript, we can define the type of state explicitly.

### Example 1: Number State

```tsx
import { useState } from "react";

function Counter() {
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

Here:

```typescript
useState<number>(0)
```

means the state must be a number.

### Example 2: String State

```tsx
const [name, setName] = useState<string>("John");
```

### Example 3: Boolean State

```tsx
const [isLoggedIn, setIsLoggedIn] =
    useState<boolean>(false);
```

### Example 4: Array State

```tsx
interface User {
    id: number;
    name: string;
}

const [users, setUsers] = useState<User[]>([]);
```

Adding a user:

```tsx
setUsers(previousUsers => [
    ...previousUsers,
    {
        id: 1,
        name: "John"
    }
]);
```

### Example 5: Object State

```tsx
interface User {
    name: string;
    age: number;
    email: string;
}

const [user, setUser] = useState<User>({
    name: "John",
    age: 25,
    email: "john@example.com"
});
```

Update state:

```tsx
setUser(previousUser => ({
    ...previousUser,
    age: 26
}));
```

### Example 6: Union Types in State

Suppose a modal can be:

- Open.
- Closed.

We can use a boolean:

```tsx
const [isOpen, setIsOpen] = useState<boolean>(false);
```

For a more complex status:

```tsx
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```

### Example 7: Nullable State

Sometimes the initial state is `null`, but later it contains an object.

```tsx
interface User {
    id: number;
    name: string;
}

const [user, setUser] = useState<User | null>(null);
```

Now:

```tsx
setUser({
    id: 1,
    name: "John"
});
```

Access safely:

```tsx
{user && <h1>{user.name}</h1>}
```

### Important: Type Inference

You don't always need to specify the generic type.

Example:

```tsx
const [count, setCount] = useState(0);
```

TypeScript automatically infers:

```typescript
number
```

However, explicitly defining the type is useful when:

- The initial value is `null`.
- The state contains multiple possible types.
- The initial array is empty.
- The state has a complex structure.

---

# 9. Event Handling with TypeScript

React provides several event types for handling user interactions.

Common events include:

- Click.
- Change.
- Submit.
- Mouse events.
- Keyboard events.
- Focus events.
- Form events.

### 9.1 Button Click Event

```tsx
function Button() {
    const handleClick = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        console.log("Clicked");
    };

    return (
        <button onClick={handleClick}>
            Click
        </button>
    );
}
```

### 9.2 Input Change Event

```tsx
function InputExample() {
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        console.log(event.target.value);
    };

    return (
        <input
            type="text"
            onChange={handleChange}
        />
    );
}
```

### 9.3 Form Submit Event

```tsx
function LoginForm() {
    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        console.log("Form submitted");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" />

            <button type="submit">
                Login
            </button>
        </form>
    );
}
```

### 9.4 Select Change Event

```tsx
function SelectExample() {
    const handleChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        console.log(event.target.value);
    };

    return (
        <select onChange={handleChange}>
            <option value="india">India</option>
            <option value="usa">USA</option>
        </select>
    );
}
```

### 9.5 Keyboard Event

```tsx
function KeyboardExample() {
    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === "Enter") {
            console.log("Enter pressed");
        }
    };

    return (
        <input onKeyDown={handleKeyDown} />
    );
}
```

### Important React Event Types

| Event | Type |
|---|---|
| Button click | `React.MouseEvent<HTMLButtonElement>` |
| Input change | `React.ChangeEvent<HTMLInputElement>` |
| Form submit | `React.FormEvent<HTMLFormElement>` |
| Keyboard | `React.KeyboardEvent<HTMLInputElement>` |
| Select change | `React.ChangeEvent<HTMLSelectElement>` |
| Focus | `React.FocusEvent<HTMLInputElement>` |

**Important:** React event types are not exactly the same as native browser event types. React uses its own event system with `SyntheticEvent` and specialized event interfaces.

---

# 10. useEffect with TypeScript

`useEffect` allows functional components to synchronize with external systems.

Common use cases:

- API requests.
- Event listeners.
- Timers.
- Subscriptions.
- Browser APIs.

### Example 1: Basic useEffect

```tsx
import { useEffect, useState } from "react";

function Counter() {
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        console.log("Count changed:", count);
    }, [count]);

    return (
        <button onClick={() => setCount(count + 1)}>
            {count}
        </button>
    );
}
```

### Example 2: Run Once After Mount

```tsx
useEffect(() => {
    console.log("Component mounted");
}, []);
```

An empty dependency array means the effect has no reactive dependencies. In development Strict Mode, React may run an additional setup-and-cleanup cycle to help identify bugs.

### Example 3: Cleanup Function

```tsx
useEffect(() => {
    const timer = setInterval(() => {
        console.log("Running...");
    }, 1000);

    return () => {
        clearInterval(timer);
    };
}, []);
```

The cleanup function runs before the effect is re-established and when the component unmounts.

### Example 4: API Request with TypeScript

```tsx
import { useEffect, useState } from "react";

interface User {
    id: number;
    name: string;
    email: string;
}

function Users() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        async function fetchUsers() {
            const response = await fetch(
                "https://jsonplaceholder.typicode.com/users"
            );

            const data: User[] = await response.json();

            setUsers(data);
        }

        fetchUsers();
    }, []);

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

**Important:** The annotation `const data: User[]` does not validate the server response at runtime. External API responses should be validated when their correctness matters.

Also, production API effects should generally handle loading states, errors, cancellation, and stale requests.

---

# 11. useRef with TypeScript

`useRef` is used to:

1. Reference DOM elements.
2. Store mutable values between renders.
3. Access values without causing re-renders.

### 11.1 Referencing Input Elements

```tsx
import { useRef } from "react";

function SearchInput() {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFocus = () => {
        inputRef.current?.focus();
    };

    return (
        <div>
            <input ref={inputRef} />

            <button onClick={handleFocus}>
                Focus Input
            </button>
        </div>
    );
}
```

### Understanding the Type

```typescript
useRef<HTMLInputElement>(null)
```

means:

- The reference points to an HTML input element.
- Initially, the element may not exist.
- Therefore, `current` can be `null`.

### 11.2 Referencing Different DOM Elements

```tsx
const buttonRef = useRef<HTMLButtonElement>(null);

const divRef = useRef<HTMLDivElement>(null);

const formRef = useRef<HTMLFormElement>(null);

const textareaRef = useRef<HTMLTextAreaElement>(null);
```

### 11.3 Storing Mutable Values

```tsx
const renderCount = useRef<number>(0);

renderCount.current += 1;
```

Unlike state, changing `ref.current` does not trigger a component re-render.

### useState vs useRef

| useState | useRef |
|---|---|
| Stores component state | Stores mutable references |
| Updates trigger re-renders | Updates do not trigger re-renders |
| Used for UI state | Used for DOM references and mutable values |
| State updates are scheduled by React | Ref updates are immediate mutations |

---

# 12. useReducer with TypeScript

`useReducer` is useful for managing complex state logic.

It is especially helpful when:

- State has multiple properties.
- Multiple actions update the same state.
- State transitions are complex.
- You want centralized update logic.

### Example: Counter Reducer

First, define the state type.

```tsx
interface CounterState {
    count: number;
}
```

Define action types:

```tsx
type CounterAction =
    | { type: "INCREMENT" }
    | { type: "DECREMENT" }
    | { type: "RESET" };
```

Create the reducer:

```tsx
function counterReducer(
    state: CounterState,
    action: CounterAction
): CounterState {
    switch (action.type) {
        case "INCREMENT":
            return {
                count: state.count + 1
            };

        case "DECREMENT":
            return {
                count: state.count - 1
            };

        case "RESET":
            return {
                count: 0
            };

        default:
            return state;
    }
}
```

Use it:

```tsx
import { useReducer } from "react";

function Counter() {
    const [state, dispatch] = useReducer(
        counterReducer,
        { count: 0 }
    );

    return (
        <div>
            <h1>{state.count}</h1>

            <button
                onClick={() => dispatch({
                    type: "INCREMENT"
                })}
            >
                Increment
            </button>

            <button
                onClick={() => dispatch({
                    type: "DECREMENT"
                })}
            >
                Decrement
            </button>

            <button
                onClick={() => dispatch({
                    type: "RESET"
                })}
            >
                Reset
            </button>
        </div>
    );
}
```

### Understanding Discriminated Unions

This is a particularly important TypeScript concept.

```typescript
type CounterAction =
    | { type: "INCREMENT" }
    | { type: "DECREMENT" }
    | { type: "RESET" };
```

The `type` property identifies which action is being performed.

TypeScript narrows the action type inside each `switch` case.

### Example with Payload

```tsx
type Action =
    | {
        type: "SET_NAME";
        payload: string;
    }
    | {
        type: "SET_AGE";
        payload: number;
    };
```

Now each action has a different payload type.

---

# 13. Creating Custom Hooks with TypeScript

Custom Hooks allow us to reuse stateful logic between React components.

A custom Hook is simply a JavaScript or TypeScript function whose name starts with `use` and that follows the Rules of Hooks.

### Example: useCounter

Create:

```text
src/hooks/useCounter.ts
```

```tsx
import { useState } from "react";

function useCounter(initialValue: number = 0) {
    const [count, setCount] = useState(initialValue);

    const increment = () => {
        setCount(previous => previous + 1);
    };

    const decrement = () => {
        setCount(previous => previous - 1);
    };

    const reset = () => {
        setCount(initialValue);
    };

    return {
        count,
        increment,
        decrement,
        reset
    };
}

export default useCounter;
```

Use it:

```tsx
function Counter() {
    const {
        count,
        increment,
        decrement,
        reset
    } = useCounter(10);

    return (
        <div>
            <h1>{count}</h1>

            <button onClick={increment}>
                +
            </button>

            <button onClick={decrement}>
                -
            </button>

            <button onClick={reset}>
                Reset
            </button>
        </div>
    );
}
```

TypeScript infers the return type of this custom Hook.

### Example: useToggle

```tsx
import { useState } from "react";

function useToggle(initialValue: boolean = false) {
    const [value, setValue] = useState(initialValue);

    const toggle = () => {
        setValue(previous => !previous);
    };

    return {
        value,
        toggle
    };
}

export default useToggle;
```

### Example: useFetch

We can create a generic data-fetching Hook.

```tsx
import { useEffect, useState } from "react";

interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

function useFetch<T>(url: string) {
    const [state, setState] = useState<FetchState<T>>({
        data: null,
        loading: true,
        error: null
    });

    useEffect(() => {
        const controller = new AbortController();

        async function fetchData() {
            try {
                setState({
                    data: null,
                    loading: true,
                    error: null
                });

                const response = await fetch(url, {
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data: T = await response.json();

                setState({
                    data,
                    loading: false,
                    error: null
                });

            } catch (error) {
                if (controller.signal.aborted) {
                    return;
                }

                setState({
                    data: null,
                    loading: false,
                    error: error instanceof Error
                        ? error.message
                        : "Unknown error"
                });
            }
        }

        fetchData();

        return () => {
            controller.abort();
        };
    }, [url]);

    return state;
}

export default useFetch;
```

Use it:

```tsx
interface User {
    id: number;
    name: string;
    email: string;
}

function Users() {
    const {
        data,
        loading,
        error
    } = useFetch<User[]>(
        "https://jsonplaceholder.typicode.com/users"
    );

    if (loading) return <p>Loading...</p>;

    if (error) return <p>{error}</p>;

    return (
        <div>
            {data?.map(user => (
                <p key={user.id}>
                    {user.name}
                </p>
            ))}
        </div>
    );
}
```

**Important:** This example demonstrates generic Hook typing. For applications with caching, retries, request deduplication, and background refetching, a dedicated data-fetching library such as TanStack Query is usually a better choice.

---

# 14. Context API with TypeScript

Context API allows us to share data between components without passing props through every intermediate component.

This problem is commonly called **Prop Drilling**.

### Example Scenario

Suppose we have:

```text
App
 |
 v
Header
 |
 v
Navbar
 |
 v
UserProfile
```

If every component needs user information, passing props through all intermediate components becomes inconvenient.

Context API solves this problem.

### Step 1: Define User Type

```tsx
interface User {
    id: number;
    name: string;
    email: string;
}
```

### Step 2: Create Context

```tsx
import { createContext } from "react";

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}
```

Create the context:

```tsx
const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);
```

### Why Use `undefined`?

Initially, the context may not have a provider.

Using `undefined` allows us to detect incorrect usage when a component tries to consume the context outside its provider.

### Step 3: Create Provider

```tsx
import {
    createContext,
    useState,
    ReactNode
} from "react";

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({
    children
}: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);

    const login = (user: User) => {
        setUser(user);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
```

### Step 4: Create Custom Context Hook

```tsx
import { useContext } from "react";

import AuthContext from "./AuthContext";

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}
```

### Step 5: Wrap Application

```tsx
import { AuthProvider } from "./context/AuthContext";

function App() {
    return (
        <AuthProvider>
            <Dashboard />
        </AuthProvider>
    );
}
```

### Step 6: Access Context

```tsx
import { useAuth } from "./context/useAuth";

function UserProfile() {
    const {
        user,
        login,
        logout
    } = useAuth();

    return (
        <div>
            {user ? (
                <>
                    <h1>{user.name}</h1>

                    <button onClick={logout}>
                        Logout
                    </button>
                </>
            ) : (
                <button
                    onClick={() => login({
                        id: 1,
                        name: "John",
                        email: "john@example.com"
                    })}
                >
                    Login
                </button>
            )}
        </div>
    );
}
```

### When Should You Use Context API?

Context is useful for:

- Authentication state.
- Theme settings.
- Language preferences.
- Global application settings.
- Shared UI state.

Avoid putting every piece of application state into one large Context. Frequent context updates can cause unnecessary re-renders in consuming components.

---

# 15. Advanced Component Patterns

Now let's understand some reusable component patterns.

## 15.1 Conditional Props

Sometimes a component accepts different properties depending on its configuration.

Example: A button can either navigate to a URL or execute a callback.

```tsx
type ButtonProps =
    | {
        variant: "link";
        href: string;
    }
    | {
        variant: "action";
        onClick: () => void;
    };
```

Now:

```tsx
function CustomButton(props: ButtonProps) {
    if (props.variant === "link") {
        return (
            <a href={props.href}>
                Navigate
            </a>
        );
    }

    return (
        <button onClick={props.onClick}>
            Execute
        </button>
    );
}
```

This is an example of a discriminated union.

## 15.2 Component Composition

Component composition means building complex UI by combining smaller components.

Example:

```tsx
interface CardProps {
    children: React.ReactNode;
}

function Card({ children }: CardProps) {
    return (
        <div className="card">
            {children}
        </div>
    );
}
```

Usage:

```tsx
<Card>
    <h1>User Profile</h1>
    <p>John Doe</p>
</Card>
```

## 15.3 Component Props Inheritance

Suppose we want to create a custom button that supports all native HTML button attributes.

We can use:

```tsx
type CustomButtonProps =
    React.ComponentProps<"button"> & {
        variant?: "primary" | "secondary";
    };
```

Component:

```tsx
function CustomButton({
    variant = "primary",
    children,
    ...props
}: CustomButtonProps) {
    return (
        <button
            className={`btn ${variant}`}
            {...props}
        >
            {children}
        </button>
    );
}
```

Usage:

```tsx
<CustomButton
    variant="primary"
    disabled={false}
    onClick={() => console.log("Clicked")}
>
    Submit
</CustomButton>
```

This is useful when building reusable UI component libraries.

## 15.4 HTML Attribute Types

React provides types for common HTML elements.

Examples:

```tsx
React.ComponentProps<"button">
```

```tsx
React.ComponentProps<"input">
```

```tsx
React.ComponentProps<"form">
```

```tsx
React.ComponentProps<"div">
```

You can reuse these types rather than manually defining every HTML attribute.

---

# 16. Generics in React Components

Generics allow us to create reusable components that work with multiple data types.

You studied generics in earlier TypeScript phases. Now let's apply them to React.

### Example: Generic List Component

```tsx
interface ListProps<T> {
    items: T[];
    renderItem: (item: T) => React.ReactNode;
}

function List<T>({
    items,
    renderItem
}: ListProps<T>) {
    return (
        <ul>
            {items.map((item, index) => (
                <li key={index}>
                    {renderItem(item)}
                </li>
            ))}
        </ul>
    );
}
```

### Using the Generic Component

```tsx
interface User {
    id: number;
    name: string;
}

const users: User[] = [
    {
        id: 1,
        name: "John"
    },
    {
        id: 2,
        name: "David"
    }
];
```

Use:

```tsx
<List
    items={users}
    renderItem={(user) => (
        <span>{user.name}</span>
    )}
/>
```

TypeScript infers that `user` is of type `User`.

### Another Example: Generic Table

```tsx
interface TableProps<T> {
    data: T[];
    getKey: (item: T) => string | number;
    renderRow: (item: T) => React.ReactNode;
}

function Table<T>({
    data,
    getKey,
    renderRow
}: TableProps<T>) {
    return (
        <table>
            <tbody>
                {data.map(item => (
                    <tr key={getKey(item)}>
                        {renderRow(item)}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
```

Usage:

```tsx
<Table
    data={users}
    getKey={(user) => user.id}
    renderRow={(user) => (
        <>
            <td>{user.id}</td>
            <td>{user.name}</td>
        </>
    )}
/>
```

### Why Are Generics Useful in React?

They help us build:

- Reusable tables.
- Dropdown components.
- Data lists.
- Select components.
- Form components.
- Generic UI libraries.
- Reusable hooks.

---

# 17. Forms in React with TypeScript

Forms are an important part of frontend development.

Examples:

- Login forms.
- Registration forms.
- Contact forms.
- Product forms.
- Profile forms.

Let's understand controlled forms.

### Example: Login Form

```tsx
import { useState } from "react";

interface LoginForm {
    email: string;
    password: string;
}

function Login() {
    const [formData, setFormData] = useState<LoginForm>({
        email: "",
        password: ""
    });

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target;

        setFormData(previous => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        console.log(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
            />

            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
            />

            <button type="submit">
                Login
            </button>
        </form>
    );
}
```

### Understanding Controlled Components

A controlled component is a form element whose value is controlled by React state.

Example:

```tsx
<input
    value={formData.email}
    onChange={handleChange}
/>
```

Here:

- React state stores the value.
- The input displays the state value.
- `onChange` updates the state.

### Controlled vs Uncontrolled Components

| Controlled | Uncontrolled |
|---|---|
| Value managed by React state | Value managed by the DOM |
| Uses `value` or `checked` | Often uses `defaultValue` or `defaultChecked` |
| Updates through event handlers | Values can be read using refs |
| Useful for dynamic validation | Useful for simpler form interactions |

---

# 18. React Hook Form with TypeScript

React Hook Form is a popular library for managing forms.

It helps reduce unnecessary re-renders and simplifies form validation.

### Step 1: Install

```bash
npm install react-hook-form
```

### Step 2: Define Form Type

```tsx
interface RegisterForm {
    name: string;
    email: string;
    password: string;
}
```

### Step 3: Create Form

```tsx
import { useForm } from "react-hook-form";

function Register() {
    const {
        register,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm<RegisterForm>();

    const onSubmit = (data: RegisterForm) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input
                {...register("name", {
                    required: "Name is required"
                })}
                placeholder="Name"
            />

            {errors.name && (
                <p>{errors.name.message}</p>
            )}

            <input
                {...register("email", {
                    required: "Email is required"
                })}
                placeholder="Email"
            />

            {errors.email && (
                <p>{errors.email.message}</p>
            )}

            <input
                type="password"
                {...register("password", {
                    required: "Password is required",
                    minLength: {
                        value: 8,
                        message: "Minimum 8 characters"
                    }
                })}
                placeholder="Password"
            />

            {errors.password && (
                <p>{errors.password.message}</p>
            )}

            <button type="submit">
                Register
            </button>
        </form>
    );
}
```

### Important React Hook Form Methods

| Method | Purpose |
|---|---|
| `register()` | Registers input fields |
| `handleSubmit()` | Handles valid form submission |
| `watch()` | Watches field values |
| `setValue()` | Updates field values |
| `getValues()` | Reads form values |
| `reset()` | Resets form |
| `setError()` | Sets manual errors |
| `clearErrors()` | Clears errors |
| `formState.errors` | Contains validation errors |

---

# 19. React Hook Form with Zod

We can integrate Zod with React Hook Form.

This allows us to define validation rules using Zod schemas.

### Step 1: Install Dependencies

```bash
npm install zod @hookform/resolvers
```

### Step 2: Create Schema

```tsx
import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(3),

    email: z.string().email(),

    password: z.string().min(8)
});
```

### Step 3: Infer Type

```tsx
type RegisterForm = z.infer<typeof registerSchema>;
```

### Step 4: Integrate with React Hook Form

```tsx
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

function Register() {
    const {
        register,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = (data: RegisterForm) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input
                {...register("name")}
                placeholder="Name"
            />

            {errors.name && (
                <p>{errors.name.message}</p>
            )}

            <input
                {...register("email")}
                placeholder="Email"
            />

            {errors.email && (
                <p>{errors.email.message}</p>
            )}

            <input
                type="password"
                {...register("password")}
                placeholder="Password"
            />

            {errors.password && (
                <p>{errors.password.message}</p>
            )}

            <button type="submit">
                Register
            </button>
        </form>
    );
}
```

### Why Use React Hook Form + Zod?

| React Hook Form | Zod |
|---|---|
| Manages form state | Defines validation schemas |
| Handles form submission | Validates input data |
| Tracks field errors | Produces structured validation errors |
| Reduces boilerplate | Infers TypeScript types |

Together, they provide a powerful form-management solution.

---

# 20. API Integration with TypeScript

React applications commonly communicate with backend APIs.

For example:

```text
React Frontend
      |
      v
   HTTP Request
      |
      v
 Node.js Backend
      |
      v
   Database
```

The frontend sends a request and receives a response.

TypeScript helps us define the expected request and response structures.

### Example API Response

```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "John",
        "email": "john@example.com"
    }
}
```

Define the interface:

```tsx
interface User {
    id: number;
    name: string;
    email: string;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
}
```

Now:

```tsx
const response: ApiResponse<User> = {
    success: true,
    data: {
        id: 1,
        name: "John",
        email: "john@example.com"
    }
};
```

### Why Use Generic API Response Types?

Instead of creating separate response interfaces for every endpoint, we can reuse a generic structure.

```typescript
ApiResponse<User>
```

```typescript
ApiResponse<User[]>
```

```typescript
ApiResponse<Product>
```

```typescript
ApiResponse<Order[]>
```

This improves consistency across the frontend.

---

# 21. Fetch API with TypeScript

The Fetch API is built into modern browsers.

It allows us to make HTTP requests.

### Example: GET Request

```tsx
interface User {
    id: number;
    name: string;
    email: string;
}

async function getUsers(): Promise<User[]> {
    const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
    );

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    return response.json();
}
```

### Example: POST Request

```tsx
interface CreateUserDTO {
    name: string;
    email: string;
}

async function createUser(
    userData: CreateUserDTO
): Promise<User> {
    const response = await fetch(
        "http://localhost:5000/api/users",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(userData)
        }
    );

    if (!response.ok) {
        throw new Error("Failed to create user");
    }

    return response.json();
}
```

### Important Fetch Concepts

| Concept | Purpose |
|---|---|
| `fetch()` | Makes HTTP request |
| `response.ok` | Indicates HTTP success status |
| `response.status` | Returns HTTP status code |
| `response.json()` | Parses JSON response |
| `response.text()` | Parses text response |
| `AbortController` | Cancels requests |

**Important:** Fetch does not automatically throw an exception for HTTP errors such as 404 or 500. Check `response.ok` explicitly.

Also, the `Promise<User>` annotation does not validate the returned JSON at runtime.

---

# 22. Axios with TypeScript

Axios is a popular HTTP client library.

It provides:

- Request and response interceptors.
- Automatic JSON transformation.
- Request cancellation.
- Timeout configuration.
- Convenient error handling.
- Generic response typing.

### Step 1: Install Axios

```bash
npm install axios
```

### Step 2: Create Axios Instance

Create:

```text
src/services/api.ts
```

```tsx
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",

    timeout: 10000,

    headers: {
        "Content-Type": "application/json"
    }
});

export default api;
```

### Step 3: Define User Types

```tsx
export interface User {
    id: number;
    name: string;
    email: string;
}
```

### Step 4: GET Request

```tsx
import api from "./api";
import { User } from "../types/user.types";

async function getUsers(): Promise<User[]> {
    const response = await api.get<User[]>("/users");

    return response.data;
}
```

### Step 5: POST Request

```tsx
interface CreateUserDTO {
    name: string;
    email: string;
}

async function createUser(
    userData: CreateUserDTO
): Promise<User> {
    const response = await api.post<User>(
        "/users",
        userData
    );

    return response.data;
}
```

### Step 6: Axios Interceptors

Interceptors allow us to execute logic before requests or after responses.

Example:

```tsx
api.interceptors.request.use(
    config => {
        console.log("Request:", config.url);

        return config;
    },

    error => {
        return Promise.reject(error);
    }
);
```

Response interceptor:

```tsx
api.interceptors.response.use(
    response => {
        return response;
    },

    error => {
        return Promise.reject(error);
    }
);
```

### Fetch vs Axios

| Fetch | Axios |
|---|---|
| Built into modern browsers | External dependency |
| Requires checking `response.ok` | Rejects non-2xx responses by default |
| Uses `response.json()` | Automatically transforms JSON responses |
| Supports AbortController | Supports AbortController and its own cancellation patterns |
| No built-in interceptors | Supports interceptors |
| Lightweight | More built-in HTTP client features |

---

# 23. TanStack Query (React Query)

TanStack Query is a library for managing server state.

It helps with:

- Fetching data.
- Caching.
- Background refetching.
- Loading states.
- Error states.
- Mutations.
- Request deduplication.
- Cache invalidation.

### What Is Server State?

Server state is data that belongs to an external system, usually a backend or database.

Examples:

- User profiles.
- Product lists.
- Orders.
- Notifications.
- Dashboard statistics.

This differs from local UI state, such as whether a modal is open.

### Step 1: Install

```bash
npm install @tanstack/react-query
```

### Step 2: Create Query Client

```tsx
import {
    QueryClient,
    QueryClientProvider
} from "@tanstack/react-query";

const queryClient = new QueryClient();
```

### Step 3: Wrap Application

```tsx
function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Dashboard />
        </QueryClientProvider>
    );
}
```

### Step 4: Create API Function

```tsx
interface User {
    id: number;
    name: string;
    email: string;
}

async function getUsers(): Promise<User[]> {
    const response = await fetch(
        "http://localhost:5000/api/users"
    );

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    return response.json();
}
```

### Step 5: Use useQuery

```tsx
import { useQuery } from "@tanstack/react-query";

function Users() {
    const {
        data,
        isLoading,
        isError,
        error
    } = useQuery<User[], Error>({
        queryKey: ["users"],
        queryFn: getUsers
    });

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (isError) {
        return <p>{error.message}</p>;
    }

    return (
        <div>
            {data.map(user => (
                <p key={user.id}>
                    {user.name}
                </p>
            ))}
        </div>
    );
}
```

### Understanding useQuery Properties

| Property | Purpose |
|---|---|
| `queryKey` | Unique identifier for cached data |
| `queryFn` | Function that fetches data |
| `data` | Retrieved data |
| `isLoading` | Initial loading state |
| `isError` | Indicates an error |
| `error` | Error object |
| `refetch` | Manually refetches data |

### Step 6: useMutation

Mutations are used for operations that create, update, or delete data.

Example:

```tsx
import {
    useMutation,
    useQueryClient
} from "@tanstack/react-query";

interface CreateUserDTO {
    name: string;
    email: string;
}

function CreateUser() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (
            userData: CreateUserDTO
        ) => {
            const response = await fetch(
                "http://localhost:5000/api/users",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(userData)
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create user");
            }

            return response.json();
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["users"]
            });
        }
    });

    return (
        <button
            onClick={() => mutation.mutate({
                name: "John",
                email: "john@example.com"
            })}
        >
            Create User
        </button>
    );
}
```

### useQuery vs useMutation

| useQuery | useMutation |
|---|---|
| Primarily retrieves server data | Creates, updates, or deletes server data |
| Uses query caching | Manages mutation state |
| Supports automatic refetching | Usually triggered by user actions |
| Uses query keys | Uses mutation functions |

---

# 24. Type-Safe Routing with React Router

React Router is commonly used for navigation in React applications.

### Step 1: Install

```bash
npm install react-router-dom
```

### Step 2: Create Pages

```text
src/
    pages/
        Home.tsx
        About.tsx
        Users.tsx
        UserDetails.tsx
```

### Step 3: Configure Routes

```tsx
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Users from "./pages/Users";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/about"
                    element={<About />}
                />

                <Route
                    path="/users"
                    element={<Users />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
```

### Step 4: Dynamic Route Parameters

Example:

```text
/users/101
```

Route:

```tsx
<Route
    path="/users/:id"
    element={<UserDetails />}
/>
```

Access parameter:

```tsx
import { useParams } from "react-router-dom";

function UserDetails() {
    const { id } = useParams<"id">();

    return <h1>User ID: {id}</h1>;
}
```

Remember that route parameters are strings and may be undefined.

### Step 5: Navigate Programmatically

```tsx
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    function handleLogin() {
        navigate("/dashboard");
    }

    return (
        <button onClick={handleLogin}>
            Login
        </button>
    );
}
```

### Important Routing Concepts

- BrowserRouter.
- Routes.
- Route.
- Link.
- NavLink.
- useNavigate.
- useParams.
- useLocation.
- Nested routes.
- Protected routes.
- Error routes.

---

# 25. Authentication in React with TypeScript

Now let's connect frontend authentication with the backend authentication concepts from Phase 36.

A typical authentication flow:

```text
User
 |
 v
Login Form
 |
 v
React Frontend
 |
 v
POST /api/auth/login
 |
 v
Node.js Backend
 |
 v
Verify Credentials
 |
 v
Generate Authentication
 |
 v
Return Response
 |
 v
React Updates Auth State
 |
 v
Protected Dashboard
```

### Step 1: Define User Type

```tsx
export interface User {
    id: number;
    name: string;
    email: string;
    role: "admin" | "user";
}
```

### Step 2: Define Authentication Context

```tsx
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
}
```

### Step 3: Create Login Function

A simplified example:

```tsx
async function loginUser(
    email: string,
    password: string
): Promise<User> {
    const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        }
    );

    if (!response.ok) {
        throw new Error("Login failed");
    }

    const result = await response.json();

    return result.user as User;
}
```

The assertion here is only illustrative. In production, validate the API response before trusting it.

### Step 4: Protected Routes

A protected route prevents unauthenticated users from accessing certain frontend pages.

```tsx
import {
    Navigate,
    Outlet
} from "react-router-dom";

function ProtectedRoute() {
    const isAuthenticated = true;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
```

Use it:

```tsx
<Routes>
    <Route path="/login" element={<Login />} />

    <Route element={<ProtectedRoute />}>
        <Route
            path="/dashboard"
            element={<Dashboard />}
        />

        <Route
            path="/profile"
            element={<Profile />}
        />
    </Route>
</Routes>
```

**Important:** Frontend protected routes are only a UI/navigation mechanism. They do not secure backend resources. Every protected backend endpoint must independently verify authentication and authorization.

### Where Should Tokens Be Stored?

This is an important security consideration.

For browser applications:

- Avoid storing sensitive authentication credentials in insecure locations.
- `HttpOnly`, `Secure`, and appropriately configured `SameSite` cookies are commonly used for refresh tokens.
- Cookie-based authentication requires CSRF considerations.
- Access tokens should have short lifetimes.
- Refresh tokens should support rotation and revocation.

Do not assume that hiding a page in React protects its API.

---

# 26. Performance Optimization in React with TypeScript

Performance optimization helps applications render efficiently.

Let's understand important techniques.

### 26.1 React.memo

`React.memo` prevents unnecessary re-rendering of a component when its props have not changed according to its comparison behavior.

Example:

```tsx
import React from "react";

interface UserProps {
    name: string;
}

const UserCard = React.memo(function UserCard({
    name
}: UserProps) {
    console.log("UserCard rendered");

    return <h1>{name}</h1>;
});

export default UserCard;
```

### 26.2 useMemo

`useMemo` caches a calculated value between renders.

Example:

```tsx
import { useMemo } from "react";

function ProductList() {
    const products = [
        {
            id: 1,
            price: 100
        },
        {
            id: 2,
            price: 200
        }
    ];

    const total = useMemo(() => {
        return products.reduce(
            (sum, product) => sum + product.price,
            0
        );
    }, []);

    return <h1>Total: {total}</h1>;
}
```

### 26.3 useCallback

`useCallback` caches a function definition between renders.

Example:

```tsx
import { useCallback, useState } from "react";

function Counter() {
    const [count, setCount] = useState(0);

    const increment = useCallback(() => {
        setCount(previous => previous + 1);
    }, []);

    return (
        <button onClick={increment}>
            {count}
        </button>
    );
}
```

### 26.4 Lazy Loading

Lazy loading allows us to load components when they are needed.

```tsx
import {
    lazy,
    Suspense
} from "react";

const Dashboard = lazy(
    () => import("./Dashboard")
);

function App() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <Dashboard />
        </Suspense>
    );
}
```

### 26.5 Code Splitting

Code splitting divides application JavaScript into smaller bundles.

It helps avoid loading the entire application upfront.

### 26.6 List Virtualization

When rendering thousands of records, rendering every item can be expensive.

List virtualization renders only the visible items.

Libraries such as TanStack Virtual can help.

### Performance Techniques Summary

| Technique | Purpose |
|---|---|
| React.memo | Avoid some unnecessary component renders |
| useMemo | Cache calculated values |
| useCallback | Cache function definitions |
| Lazy loading | Load components when needed |
| Code splitting | Reduce initial bundle size |
| Virtualization | Efficiently render large lists |
| Debouncing | Reduce frequent event-triggered operations |
| Throttling | Limit operation frequency |

**Important:** Memoization is not automatically beneficial. Apply it when there is a measurable performance reason.

---

# 27. Testing React Components with TypeScript

Testing helps ensure that React components behave correctly.

Popular testing tools include:

- Vitest.
- Jest.
- React Testing Library.
- Playwright.

### Step 1: Install Dependencies

For a Vite application:

```bash
npm install -D vitest jsdom
npm install -D @testing-library/react
npm install -D @testing-library/jest-dom
npm install -D @testing-library/user-event
```

### Step 2: Create a Component

```tsx
interface ButtonProps {
    label: string;
    onClick: () => void;
}

function Button({
    label,
    onClick
}: ButtonProps) {
    return (
        <button onClick={onClick}>
            {label}
        </button>
    );
}

export default Button;
```

### Step 3: Write a Test

```tsx
import {
    render,
    screen
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
    describe,
    it,
    expect,
    vi
} from "vitest";

import Button from "./Button";

describe("Button Component", () => {
    it("should display button label", () => {
        render(
            <Button
                label="Submit"
                onClick={() => {}}
            />
        );

        expect(
            screen.getByRole("button", {
                name: "Submit"
            })
        ).toBeInTheDocument();
    });

    it("should execute click handler", async () => {
        const user = userEvent.setup();

        const handleClick = vi.fn();

        render(
            <Button
                label="Submit"
                onClick={handleClick}
            />
        );

        await user.click(
            screen.getByRole("button", {
                name: "Submit"
            })
        );

        expect(handleClick).toHaveBeenCalled();
    });
});
```

### What Should You Test?

| Component | Test |
|---|---|
| Button | Click behavior |
| Login Form | Validation |
| User List | Data rendering |
| Modal | Open and close |
| Authentication | Protected content |
| API Component | Loading and error states |
| Navigation | Route changes |

---

# 28. Scalable React + TypeScript Architecture

For larger React applications, a well-organized folder structure is important.

Recommended structure:

```text
src/
│
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx
│
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   │
│   └── layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
│
├── features/
│   │
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── pages/
│   │
│   ├── users/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── pages/
│   │
│   └── products/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       └── pages/
│
├── hooks/
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
│
├── services/
│   └── api.ts
│
├── types/
│   └── common.types.ts
│
├── utils/
│   ├── formatDate.ts
│   └── formatCurrency.ts
│
└── main.tsx
```

### Feature-Based Architecture

Instead of organizing everything only by technical category, organize related code by application feature.

For example:

```text
features/
    auth/
    users/
    products/
    orders/
```

Each feature contains its own:

- Components.
- Hooks.
- API services.
- Types.
- Pages.
- Validation schemas.

### Benefits

1. Better maintainability.
2. Clear separation of concerns.
3. Easier collaboration.
4. Reusable components.
5. Easier testing.
6. Better scalability.

---

# 29. Important React TypeScript Utility Types

You have already studied TypeScript utility types. Let's see how they are used in React applications.

### 29.1 Partial

Makes all properties optional.

```tsx
interface User {
    name: string;
    email: string;
    age: number;
}

type UpdateUserDTO = Partial<User>;
```

Useful for update forms.

### 29.2 Pick

Selects specific properties.

```tsx
type UserPreview = Pick<User, "name" | "email">;
```

Useful when a component needs only a few properties.

### 29.3 Omit

Removes specific properties.

```tsx
type CreateUserDTO = Omit<User, "age">;
```

### 29.4 Required

Makes all properties required.

```tsx
type CompleteUser = Required<User>;
```

### 29.5 Record

Creates an object type with specified keys and values.

```tsx
type Status = "loading" | "success" | "error";

type StatusMessages = Record<Status, string>;

const messages: StatusMessages = {
    loading: "Loading...",
    success: "Success!",
    error: "Something went wrong"
};
```

### 29.6 ComponentProps

Extracts the props of an existing React component or intrinsic element.

```tsx
type ButtonProps = React.ComponentProps<"button">;
```

This is particularly useful for building reusable UI components.

---

# 30. Common Mistakes in React with TypeScript

| Mistake | Better Approach |
|---|---|
| Using `any` for component props | Define proper interfaces |
| Ignoring optional props | Use `?` appropriately |
| Incorrect event types | Use React event types |
| Using `useState` without understanding inference | Define types for complex state |
| Using `null` without union types | Use `User \| null` |
| Mutating state directly | Use immutable updates |
| Using `useEffect` for every operation | Use effects only for synchronization with external systems |
| Ignoring effect cleanup | Clean up subscriptions and timers |
| Using Context for everything | Separate local and shared state |
| Trusting API response types | Validate untrusted data |
| Using `any` for API responses | Define response types |
| Ignoring loading states | Handle loading, error, and success states |
| Storing unnecessary data in state | Derive values when possible |
| Overusing memoization | Optimize based on measured performance |
| Using array indexes as keys indiscriminately | Prefer stable unique identifiers |
| Relying only on frontend route protection | Secure backend endpoints independently |

---

# 31. Important Interview Questions and Answers

### Q1. What is TSX?

TSX is a TypeScript syntax extension that allows JSX markup inside TypeScript files.

### Q2. Difference between JSX and TSX?

JSX is used with JavaScript, whereas TSX is used with TypeScript and supports static type checking.

### Q3. What is the difference between `.ts` and `.tsx`?

`.ts` is used for TypeScript files without JSX, while `.tsx` supports JSX syntax.

### Q4. How do you type React component props?

We can define an interface or type alias and use it as the component's props type.

### Q5. What is React.ReactNode?

It is a type representing values that React can render as children.

### Q6. What is the difference between ReactNode and ReactElement?

`ReactNode` represents a broad range of renderable values, while `ReactElement` represents a React element object.

### Q7. What is useState?

`useState` is a React Hook used to manage state in functional components.

### Q8. How do you define state types in TypeScript?

By using generic syntax such as:

```tsx
useState<number>(0);
```

### Q9. What is the difference between useState and useRef?

State updates trigger re-renders, whereas changing a ref does not trigger a re-render.

### Q10. What is useEffect?

It is a React Hook used to synchronize a component with external systems.

### Q11. What is useReducer?

It is a Hook used to manage state through a reducer function and dispatched actions.

### Q12. What is a custom Hook?

A custom Hook is a reusable function that uses React Hooks to share stateful logic.

### Q13. What is Context API?

Context API allows data to be shared across components without manually passing props through every intermediate component.

### Q14. What is prop drilling?

Prop drilling is the process of passing props through intermediate components that do not necessarily need those props.

### Q15. What is a discriminated union?

A discriminated union is a union of object types that share a common property used to identify each variant.

### Q16. What are generic components?

Generic components are reusable components that work with different data types while preserving type safety.

### Q17. What is React Hook Form?

It is a library for managing forms and validation in React applications.

### Q18. What is Zod?

Zod is a runtime schema validation library that can infer TypeScript types.

### Q19. Why use React Hook Form with Zod?

React Hook Form manages form state and submission, while Zod provides schema-based validation.

### Q20. What is Axios?

Axios is an HTTP client library used to make API requests.

### Q21. Difference between Axios and Fetch?

Fetch is built into modern browsers, while Axios is an external library offering features such as interceptors and automatic JSON transformation.

### Q22. What is TanStack Query?

TanStack Query is a library for fetching, caching, synchronizing, and updating server state.

### Q23. Difference between useQuery and useMutation?

`useQuery` is primarily used to retrieve server data, while `useMutation` handles operations that modify server data.

### Q24. What is React.memo?

React.memo is a higher-order component that can skip rendering when props have not changed according to its comparison.

### Q25. What is useMemo?

`useMemo` caches the result of a calculation between renders.

### Q26. What is useCallback?

`useCallback` caches a function definition between renders.

### Q27. Difference between useMemo and useCallback?

`useMemo` caches a calculated value, whereas `useCallback` caches a function definition.

### Q28. What is lazy loading?

Lazy loading means loading components or resources only when they are needed.

### Q29. What is code splitting?

Code splitting divides an application into smaller JavaScript bundles.

### Q30. What is a controlled component?

A controlled component is a form element whose value is managed through React state.

### Q31. What is an uncontrolled component?

An uncontrolled component stores its current value in the DOM rather than React state.

### Q32. What is React Testing Library?

It is a testing library that helps test React components through their user-visible behavior.

### Q33. Why should we avoid any in React TypeScript?

Because `any` disables important type checking and allows many type-related errors to go undetected.

### Q34. Can TypeScript validate API responses at runtime?

No. TypeScript provides compile-time checks. Runtime validation requires tools such as Zod.

### Q35. Does a protected React route secure backend APIs?

No. Backend endpoints must independently perform authentication and authorization.

---

# 32. Practical Exercises

Complete these exercises to strengthen your understanding.

## Exercise 1: User Card Component

Create a reusable UserCard component.

Requirements:

- Name.
- Email.
- Age.
- Profile picture.
- Optional role.
- Typed props.

## Exercise 2: Counter Application

Create a counter using:

- `useState`.
- `useReducer`.
- TypeScript action types.

Implement increment, decrement, and reset.

## Exercise 3: Todo Application

Create a Todo application.

Requirements:

- Add tasks.
- Delete tasks.
- Update tasks.
- Mark tasks as completed.
- Filter completed and pending tasks.

Use TypeScript interfaces for all data structures.

## Exercise 4: Custom Hooks

Create:

```text
useCounter()
useToggle()
useDebounce()
useLocalStorage()
```

Make each Hook reusable and properly typed.

## Exercise 5: Context API

Create an authentication context.

Requirements:

- User state.
- Login.
- Logout.
- Authentication status.
- Custom `useAuth()` Hook.

## Exercise 6: Generic Components

Create:

- Generic List.
- Generic Table.
- Generic Dropdown.

Ensure the component infers data types correctly.

## Exercise 7: Registration Form

Create a registration form using:

- React Hook Form.
- Zod.
- TypeScript.

Fields:

- Name.
- Email.
- Password.
- Confirm Password.

Add appropriate validation.

## Exercise 8: API Integration

Connect React with your Node.js backend.

Implement:

- GET users.
- POST users.
- PUT users.
- DELETE users.

Use Axios and TypeScript.

## Exercise 9: TanStack Query

Implement:

- `useQuery`.
- `useMutation`.
- Cache invalidation.
- Loading states.
- Error handling.

## Exercise 10: Authentication Application

Build a frontend authentication system.

Features:

- Login.
- Registration.
- Logout.
- Protected routes.
- User profile.
- Role-based UI.
- Backend authentication integration.

## Exercise 11: Complete React + TypeScript Project

Build a **User and Product Management Dashboard**.

Required features:

- Authentication.
- Dashboard.
- User management.
- Product management.
- CRUD operations.
- Forms and validation.
- API integration.
- TanStack Query.
- Context API.
- Protected routes.
- Role-based UI.
- Pagination.
- Sorting.
- Filtering.
- File uploads.
- Responsive design.
- Component testing.

---

# 33. Phase 37 Completion Checklist

| Topic | Completion |
|---|---|
| React + TypeScript Setup | ☐ |
| JSX vs TSX | ☐ |
| Functional Components | ☐ |
| Props Typing | ☐ |
| Children Props | ☐ |
| Function Props | ☐ |
| useState | ☐ |
| Event Handling | ☐ |
| useEffect | ☐ |
| useRef | ☐ |
| useReducer | ☐ |
| Custom Hooks | ☐ |
| Context API | ☐ |
| Component Composition | ☐ |
| Conditional Props | ☐ |
| Generic Components | ☐ |
| Forms | ☐ |
| React Hook Form | ☐ |
| Zod Validation | ☐ |
| Fetch API | ☐ |
| Axios | ☐ |
| TanStack Query | ☐ |
| React Router | ☐ |
| Authentication | ☐ |
| Performance Optimization | ☐ |
| React Testing Library | ☐ |
| Scalable Architecture | ☐ |

---

# 34. What You Should Be Able to Build After Phase 37

After completing this phase, you should be able to build scalable React applications using TypeScript.

Your frontend technology stack will look like this:

```text
React
  |
  v
TypeScript
  |
  v
React Router
  |
  v
Context API
  |
  v
React Hook Form
  |
  v
Zod
  |
  v
Axios
  |
  v
TanStack Query
  |
  v
Node.js Backend
```

You should understand how to:

- Build reusable components.
- Define strongly typed props.
- Manage complex state.
- Create custom Hooks.
- Build generic components.
- Develop type-safe forms.
- Integrate REST APIs.
- Manage server state.
- Implement frontend authentication.
- Optimize React applications.
- Test components.

---

# Next Phase

## Phase 38: TypeScript with Next.js – Advanced Full-Stack Development

In the next phase, we will cover:

1. Next.js with TypeScript Setup.
2. App Router Architecture.
3. Server Components.
4. Client Components.
5. Server and Client Boundaries.
6. Type-Safe Routing.
7. Dynamic Routes.
8. Layouts and Templates.
9. Loading and Error Boundaries.
10. Server Actions.
11. API Routes and Route Handlers.
12. Request and Response Typing.
13. Data Fetching.
14. Caching and Revalidation.
15. Middleware and Authentication.
16. NextAuth / Auth.js Concepts.
17. Database Integration.
18. Zod Validation.
19. Forms with Server Actions.
20. Metadata and SEO.
21. Image Optimization.
22. Environment Variables.
23. Error Handling.
24. Performance Optimization.
25. Production Deployment.
26. Complete Next.js + TypeScript Project.

**When you're ready, say: `OK, Phase 38`.**