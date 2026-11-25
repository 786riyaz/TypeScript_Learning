# Phase 2: TypeScript Environment Setup
**Level: Beginner**

In this phase, we will set up a complete TypeScript development environment on your computer.

By the end of this phase, you will be able to:

- Install TypeScript.
- Understand the TypeScript compiler.
- Create TypeScript projects.
- Configure TypeScript.
- Compile `.ts` files into `.js` files.
- Execute TypeScript programs using Node.js.
- Understand `tsconfig.json`.
- Use TypeScript with VS Code.
- Understand different ways of running TypeScript.

We will use **Node.js, npm, TypeScript and VS Code**.

---

# 1. Prerequisites

Before installing TypeScript, you should have the following tools:

| Tool | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| npm | Package manager |
| VS Code | Code editor |
| TypeScript | Programming language and compiler |

Since you already work with Node.js and JavaScript, you should be familiar with most of these tools.

### Check Node.js Installation

Open your terminal and execute:

```bash
node -v
```

Example output:

```text
v22.x.x
```

### Check npm Installation

```bash
npm -v
```

Example:

```text
10.x.x
```

If both commands return version numbers, Node.js and npm are installed.

---

# 2. What Is TypeScript Compiler (tsc)?

The TypeScript compiler is a tool that converts TypeScript code into JavaScript.

Its command-line executable is called `tsc`.

For example:

```text
app.ts
  |
  |
  v
TypeScript Compiler (tsc)
  |
  |
  v
app.js
```

The compiler also performs static type checking.

### Example

TypeScript file:

`app.ts`

```typescript
let username: string = "Riyaz";

console.log(username);
```

Compile it:

```bash
tsc app.ts
```

The compiler generates:

`app.js`

```javascript
var username = "Riyaz";

console.log(username);
```

Notice that the TypeScript type annotation is removed.

**Important:** The exact generated JavaScript depends on the compiler configuration and target.

---

# 3. Installing TypeScript

There are two common ways to install TypeScript.

1. Globally.
2. Locally inside a project.

Let's understand both.

## 3.1 Global Installation

Global installation makes the TypeScript compiler available from different directories through your terminal.

Execute:

```bash
npm install -g typescript
```

Verify installation:

```bash
tsc -v
```

Example:

```text
Version 5.x.x
```

Your installed version may be different.

### Advantages

- Can execute `tsc` from different projects.
- Convenient for experimentation.
- No need to install the compiler globally for every project.

### Disadvantages

- Different projects may require different TypeScript versions.
- Global compiler versions can cause inconsistencies.

## 3.2 Local Installation

Local installation installs TypeScript inside a particular project.

First, create a project:

```bash
mkdir typescript-learning
```

Navigate into it:

```bash
cd typescript-learning
```

Initialize npm:

```bash
npm init -y
```

Install TypeScript:

```bash
npm install -D typescript
```

Here:

- `npm install` installs a package.
- `-D` means `--save-dev`.
- `typescript` is the package name.

Check the installed package:

```bash
npm list typescript
```

You can execute the local compiler using:

```bash
npx tsc -v
```

### Global vs Local Installation

| Feature | Global | Local |
|---|---|---|
| Installation | System-wide | Project-specific |
| Command | `tsc` | `npx tsc` |
| Version | Shared global version | Project-specific version |
| Multiple project versions | Less convenient | Supported |
| Professional projects | Not necessary | Recommended |

**Best Practice:** Use local TypeScript installation for professional projects.

---

# 4. Create Your First TypeScript Project

Let's create a proper project structure.

### Step 1: Create Project Folder

```bash
mkdir typescript-learning
cd typescript-learning
```

### Step 2: Initialize npm

```bash
npm init -y
```

This creates:

```text
package.json
```

### Step 3: Install TypeScript

```bash
npm install -D typescript
```

### Step 4: Create TypeScript File

Create:

```text
app.ts
```

Add the following code:

```typescript
let username: string = "Riyaz";

let age: number = 25;

function introduce(name: string, userAge: number): string {
    return `My name is ${name} and I am ${userAge} years old.`;
}

console.log(introduce(username, age));
```

### Step 5: Compile TypeScript

```bash
npx tsc app.ts
```

This generates:

```text
app.js
```

### Step 6: Execute JavaScript

```bash
node app.js
```

Output:

```text
My name is Riyaz and I am 25 years old.
```

Congratulations! You have successfully executed your first TypeScript program.

---

# 5. Understanding TypeScript Compilation

Let's understand what happens during compilation.

Suppose you have:

`app.ts`

```typescript
let age: number = 25;

age = "Twenty Five";

console.log(age);
```

Execute:

```bash
npx tsc app.ts
```

You will receive an error similar to:

```text
Type 'string' is not assignable to type 'number'.
```

But here is something important.

**TypeScript may still generate a JavaScript file despite reporting type errors.**

By default, TypeScript can emit JavaScript even when type-checking errors exist.

This behavior can be controlled using compiler options such as:

```json
{
    "compilerOptions": {
        "noEmitOnError": true
    }
}
```

Now JavaScript will not be emitted if TypeScript reports errors.

### Important Concepts

| Term | Meaning |
|---|---|
| Compilation | Transforming TypeScript into JavaScript |
| Type Checking | Checking whether values and operations are type-compatible |
| Emitting | Generating output files |
| Compiler Error | An error detected by the compiler |
| Runtime Error | An error occurring while executing the program |

---

# 6. What Is tsconfig.json?

`tsconfig.json` is the configuration file for a TypeScript project.

It tells the TypeScript compiler how to compile and check your project.

For example, it controls:

- JavaScript target version.
- Module system.
- Type-checking rules.
- Input directories.
- Output directories.
- Strict mode.
- Source maps.
- Declaration files.

### Create tsconfig.json

Inside your project, execute:

```bash
npx tsc --init
```

This generates:

```text
tsconfig.json
```

The generated file may contain many configuration options and comments.

Let's understand some important options.

### Basic Configuration

For learning purposes, you can use this configuration:

```json
{
    "compilerOptions": {
        "target": "ES2020",
        "module": "CommonJS",

        "rootDir": "./src",
        "outDir": "./dist",

        "strict": true,

        "esModuleInterop": true,
        "skipLibCheck": true,

        "forceConsistentCasingInFileNames": true,

        "noEmitOnError": true
    },

    "include": ["src/**/*"],
    "exclude": ["node_modules"]
}
```

We will study these options in detail in Phase 27 and Phase 28.

For now, understand their basic purpose.

| Option | Purpose |
|---|---|
| target | Specifies the JavaScript version to generate |
| module | Specifies the module system |
| rootDir | Defines the source directory |
| outDir | Defines the output directory |
| strict | Enables strict type-checking options |
| esModuleInterop | Improves interoperability with certain CommonJS modules |
| skipLibCheck | Skips checking declaration files of dependencies |
| noEmitOnError | Prevents output generation when errors exist |
| include | Specifies files to include |
| exclude | Specifies files to exclude |

---

# 7. Understanding Project Structure

Now let's organize our project properly.

Create the following structure:

```text
typescript-learning/
│
├── node_modules/
│
├── src/
│   └── app.ts
│
├── dist/
│
├── package.json
│
├── package-lock.json
│
└── tsconfig.json
```

### What Does Each Folder Do?

**src/**

Contains your original TypeScript source files.

**dist/**

Contains compiled JavaScript output.

**node_modules/**

Contains installed npm packages.

**package.json**

Contains project metadata, dependencies and scripts.

**package-lock.json**

Records the resolved dependency versions.

**tsconfig.json**

Contains TypeScript compiler configuration.

### Move Your TypeScript File

Move `app.ts` into:

```text
src/app.ts
```

Now your project is organized.

---

# 8. Compile the Entire Project

Previously, we compiled individual files:

```bash
npx tsc app.ts
```

But now we have a `tsconfig.json`.

When you execute:

```bash
npx tsc
```

TypeScript automatically looks for the nearest `tsconfig.json` and compiles the project according to its configuration.

Since we configured:

```json
{
    "compilerOptions": {
        "rootDir": "./src",
        "outDir": "./dist"
    }
}
```

The output will be:

```text
src/app.ts
    |
    |
    v
TypeScript Compiler
    |
    |
    v
dist/app.js
```

Execute the generated file:

```bash
node dist/app.js
```

### Important Difference

| Command | Behavior |
|---|---|
| `npx tsc app.ts` | Compiles the specified file using command-line defaults rather than your project's tsconfig settings |
| `npx tsc` | Compiles the configured project |
| `npx tsc --watch` | Watches files and recompiles when changes occur |
| `npx tsc --noEmit` | Performs type checking without generating JavaScript |
| `npx tsc --project tsconfig.json` | Compiles the specified TypeScript project |

**Important:** When you pass input files directly, `tsconfig.json` is not used. This is a common beginner mistake.

---

# 9. Running TypeScript Directly with tsx

You might have noticed that we compile TypeScript first and then execute JavaScript.

However, there are tools that allow us to execute TypeScript files directly during development.

One popular option is `tsx`.

### Install tsx

```bash
npm install -D tsx
```

Now execute:

```bash
npx tsx src/app.ts
```

Output:

```text
My name is Riyaz and I am 25 years old.
```

Notice that we did not manually generate a JavaScript file.

`tsx` executes TypeScript using a TypeScript-compatible transformation mechanism.

**Important:** Running TypeScript using `tsx` does not automatically mean your complete project has passed TypeScript type checking.

You should still run:

```bash
npx tsc --noEmit
```

This performs type checking without generating JavaScript.

### tsx vs tsc

| Feature | tsc | tsx |
|---|---|---|
| TypeScript compiler | Yes | No, uses transformation tooling |
| Type checking | Yes | No |
| JavaScript generation | Yes | Transforms code for execution |
| Development execution | Requires separate execution step | Direct execution |
| Production builds | Commonly used | Not a replacement for type checking |

---

# 10. Running TypeScript with ts-node

Another tool is `ts-node`.

It allows you to execute TypeScript files through Node.js without manually compiling them first.

### Installation

```bash
npm install -D ts-node
```

Execute:

```bash
npx ts-node src/app.ts
```

### ts-node vs tsx

Both tools provide TypeScript execution during development.

However:

- `ts-node` integrates with the TypeScript compiler and can perform type checking.
- `tsx` focuses on fast execution and transformation.
- Both can be used in development workflows.
- Neither eliminates the need for a separate production build strategy.

For now, we will primarily use `tsc` and `tsx`.

---

# 11. TypeScript with VS Code

VS Code provides built-in TypeScript language support.

Some important features include:

### 1. IntelliSense

Provides code suggestions.

Example:

```typescript
let username: string = "Riyaz";

username.
```

VS Code suggests string methods such as:

- `toUpperCase()`
- `toLowerCase()`
- `trim()`
- `includes()`
- `slice()`

### 2. Type Checking

Example:

```typescript
let age: number = 25;

age = "Hello";
```

VS Code highlights the incorrect assignment.

### 3. Go to Definition

You can navigate to where a function, variable, interface or class is defined.

### 4. Hover Information

Hover over a variable or function to see its inferred or declared type.

### 5. Auto Import

VS Code can automatically suggest imports when using exported functions, classes and types.

### Important Note

VS Code includes its own TypeScript language service.

However, your project can use a different TypeScript version installed locally.

To select your workspace version:

1. Open a `.ts` file.
2. Press `Ctrl + Shift + P`.
3. Search for `TypeScript: Select TypeScript Version`.
4. Select `Use Workspace Version`.

---

# 12. Understanding package.json Scripts

Instead of executing long commands repeatedly, we can define scripts in `package.json`.

Open:

```text
package.json
```

Add:

```json
{
    "scripts": {
        "build": "tsc",
        "start": "node dist/app.js",
        "dev": "tsx watch src/app.ts",
        "type-check": "tsc --noEmit"
    }
}
```

Your complete package.json will also contain other generated fields and dependencies.

### Understanding Scripts

**Build:**

```bash
npm run build
```

Compiles TypeScript into JavaScript.

**Start:**

```bash
npm start
```

Executes the compiled JavaScript.

**Development:**

```bash
npm run dev
```

Runs the TypeScript application and watches for file changes.

**Type Check:**

```bash
npm run type-check
```

Checks the project for TypeScript errors without generating JavaScript.

### Recommended Workflow

During development:

```bash
npm run dev
```

Before committing your code:

```bash
npm run type-check
```

For production:

```bash
npm run build
npm start
```

---

# 13. TypeScript Playground

TypeScript also provides an online editor called TypeScript Playground.

Official website:

[TypeScript Playground](https://www.typescriptlang.org/play/?utm_source=chatgpt.com)

You can use it to:

- Write TypeScript code.
- See generated JavaScript.
- Understand type inference.
- Experiment with compiler options.
- Share code examples.
- Test TypeScript features without installing anything.

It is especially useful when learning new concepts.

---

# 14. Common Environment Setup Mistakes

Here are some mistakes beginners commonly encounter.

| Problem | Reason | Solution |
|---|---|---|
| `tsc is not recognized` | TypeScript is not globally installed or PATH is not configured | Use `npx tsc` with local installation |
| `Cannot find module` | Missing dependency | Install the required package |
| `Cannot find tsconfig.json` | Running project compilation outside the configured project | Navigate to the correct directory |
| JavaScript output not generated | Compilation errors with `noEmitOnError` enabled | Fix the errors |
| `Cannot find name 'console'` | Missing runtime/library type configuration in some setups | Configure appropriate TypeScript libraries/types |
| Wrong output directory | Incorrect `outDir` configuration | Check `tsconfig.json` |
| TypeScript file cannot run with Node.js | Runtime does not support the file's TypeScript syntax | Compile it or use a compatible TypeScript execution tool |

---

# 15. Practical Assignment

Now create a complete TypeScript project on your computer.

### Project: TypeScript Basic Setup

**Step 1:** Create a folder.

```bash
mkdir typescript-practice
cd typescript-practice
```

**Step 2:** Initialize npm.

```bash
npm init -y
```

**Step 3:** Install TypeScript and tsx.

```bash
npm install -D typescript tsx
```

**Step 4:** Generate tsconfig.

```bash
npx tsc --init
```

**Step 5:** Create the following structure.

```text
typescript-practice/
│
├── src/
│   ├── app.ts
│   ├── calculator.ts
│   └── user.ts
│
├── dist/
│
├── package.json
│
└── tsconfig.json
```

**Step 6:** Add the following code to `src/app.ts`.

```typescript
let applicationName: string = "TypeScript Learning";

let version: number = 1;

let isActive: boolean = true;

function displayApplicationInfo(
    name: string,
    appVersion: number,
    active: boolean
): void {
    console.log("Application:", name);
    console.log("Version:", appVersion);
    console.log("Active:", active);
}

displayApplicationInfo(
    applicationName,
    version,
    isActive
);
```

**Step 7:** Configure your `tsconfig.json` with:

```json
{
    "compilerOptions": {
        "target": "ES2020",
        "module": "CommonJS",
        "rootDir": "./src",
        "outDir": "./dist",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "noEmitOnError": true
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules"]
}
```

**Step 8:** Compile:

```bash
npx tsc
```

**Step 9:** Execute:

```bash
node dist/app.js
```

Expected output:

```text
Application: TypeScript Learning
Version: 1
Active: true
```

---

# 16. Interview Questions

### Q1. What is the TypeScript compiler?

The TypeScript compiler (`tsc`) is a tool that checks TypeScript code for type-related errors and transforms TypeScript into JavaScript.

### Q2. What is tsconfig.json?

It is the configuration file used to specify compiler options and project settings.

### Q3. What is the difference between global and local TypeScript installation?

Global installation makes TypeScript available system-wide, whereas local installation maintains a project-specific TypeScript version.

### Q4. What is the purpose of the `tsc` command?

It is used to compile TypeScript files or projects into JavaScript and perform type checking.

### Q5. What is the purpose of the `--watch` flag?

It continuously watches TypeScript files and recompiles them when changes occur.

### Q6. What is the difference between `tsc` and `tsx`?

`tsc` performs type checking and compilation, whereas `tsx` primarily transforms and executes TypeScript code.

### Q7. What is the purpose of the `outDir` option?

It specifies the directory where compiled JavaScript files are generated.

### Q8. What is the purpose of the `rootDir` option?

It specifies the root directory of the source files for the TypeScript project.

### Q9. What does strict mode do?

It enables a collection of stricter type-checking options to improve type safety.

### Q10. Does TypeScript always generate JavaScript when errors exist?

No. By default, it may generate JavaScript despite type errors, but `noEmitOnError: true` prevents emission when errors are reported.

---

# 17. Phase 2 Completion Checklist

| No. | Topic | Status |
|---|---|---|
| 1 | Node.js and npm requirements | ☐ |
| 2 | TypeScript compiler | ☐ |
| 3 | Global installation | ☐ |
| 4 | Local installation | ☐ |
| 5 | Creating TypeScript projects | ☐ |
| 6 | Compiling `.ts` files | ☐ |
| 7 | Understanding compilation | ☐ |
| 8 | tsconfig.json | ☐ |
| 9 | Project structure | ☐ |
| 10 | Compiling complete projects | ☐ |
| 11 | Running TypeScript with tsx | ☐ |
| 12 | Running TypeScript with ts-node | ☐ |
| 13 | VS Code integration | ☐ |
| 14 | package.json scripts | ☐ |
| 15 | TypeScript Playground | ☐ |

---

## Next Phase: Phase 3 – Basic Types

In Phase 3, we will start learning actual TypeScript types in depth.

Topics include:

1. What are types?
2. Type annotations.
3. Type inference.
4. Number.
5. String.
6. Boolean.
7. Null.
8. Undefined.
9. BigInt.
10. Symbol.
11. Any.
12. Unknown.
13. Never.
14. Void.
15. Object.
16. Literal types.

**Phase 2 complete.**

Practice the installation and compilation steps on your computer. When ready, say **`OK, Phase 3`**.