# Phase 24: Advanced TypeScript – Compiler Architecture, Type Checking, and Compiler Internals

**Level:** Advanced to Expert  
**Prerequisites:**
- Phase 2: TypeScript Environment Setup
- Phase 3: Basic Types
- Phase 11: Type Narrowing
- Phase 16: Conditional Types
- Phase 19: Recursive Types
- Phase 23: Modules and Declaration Files

## Learning Objectives

By the end of this phase, you will understand:

1. What the TypeScript compiler does.
2. TypeScript compiler architecture.
3. Lexical analysis and parsing.
4. Abstract Syntax Trees (AST).
5. Binding and symbol tables.
6. Type checking.
7. Type inference internals.
8. Control-flow analysis.
9. Type erasure.
10. JavaScript code generation.
11. Compiler diagnostics.
12. TypeScript compiler API.
13. `Program` and `SourceFile` objects.
14. `TypeChecker` API.
15. AST traversal.
16. Writing a basic TypeScript analysis tool.
17. Compiler performance.
18. Incremental compilation.
19. Build mode and project references.

---

# 1. What Is the TypeScript Compiler?

The TypeScript compiler is a tool that processes TypeScript source code and performs several operations.

Its primary responsibilities are:

1. Read TypeScript source files.
2. Parse the source code.
3. Build an internal representation of the code.
4. Resolve symbols and declarations.
5. Perform type checking.
6. Report errors and warnings.
7. Generate JavaScript output when configured to emit.

The TypeScript compiler is commonly invoked using:

```bash
npx tsc
```

### Example

Consider this TypeScript file:

```typescript
// app.ts

const name: string = "Riyaz";

const age: number = 25;

function greet(user: string): string {
    return `Hello ${user}`;
}

console.log(greet(name));
```

Compile it:

```bash
npx tsc app.ts
```

The compiler generates JavaScript:

```javascript
const name = "Riyaz";
const age = 25;

function greet(user) {
    return `Hello ${user}`;
}

console.log(greet(name));
```

Notice that the TypeScript type annotations have disappeared.

This is called **type erasure**.

### Important

The TypeScript compiler is not simply a JavaScript converter.

It also provides:

- Static type checking.
- Type inference.
- Control-flow analysis.
- Module resolution.
- Declaration generation.
- Compiler diagnostics.

---

# 2. Understanding the TypeScript Compiler Architecture

The TypeScript compiler performs several stages while processing source code.

A simplified architecture looks like this:

```text
          TypeScript Source Code
                   |
                   v
          1. Lexical Analysis
                   |
                   v
              Tokens
                   |
                   v
             2. Parsing
                   |
                   v
       Abstract Syntax Tree (AST)
                   |
                   v
          3. Binding
                   |
                   v
       Symbols and Relationships
                   |
                   v
          4. Type Checking
                   |
                   v
        Compiler Diagnostics
                   |
                   v
          5. Transformation
                   |
                   v
          6. Code Generation
                   |
                   v
            JavaScript Output
```

This is a conceptual overview rather than a strict description of every internal compiler operation.

Let's understand each stage.

| Stage | Responsibility |
|---|---|
| Lexical analysis | Converts source characters into tokens |
| Parsing | Builds an AST from tokens |
| Binding | Establishes symbols and declaration relationships |
| Type checking | Checks types and language rules |
| Transformation | Transforms the internal representation |
| Code generation | Produces JavaScript and optional declaration files |

---

# 3. Lexical Analysis

Lexical analysis is the process of converting source code characters into tokens.

A token is a meaningful unit of source code.

Consider:

```typescript
const age: number = 25;
```

The lexer identifies tokens such as:

| Source | Token |
|---|---|
| `const` | Keyword |
| `age` | Identifier |
| `:` | Punctuation |
| `number` | Type reference identifier |
| `=` | Assignment operator |
| `25` | Numeric literal |
| `;` | Statement terminator |

### Another example

```typescript
function add(a: number, b: number): number {
    return a + b;
}
```

The lexer recognizes:

- `function`
- `add`
- `(`
- `a`
- `:`
- `number`
- `,`
- `b`
- `)`
- `{`
- `return`
- `+`
- `}`

### Why is lexical analysis important?

The parser needs tokens to understand the structure of the program.

The lexer does not need to understand the complete meaning of the program.

It primarily identifies the individual lexical units.

### Important terminology

| Term | Meaning |
|---|---|
| Lexeme | Actual text in the source code |
| Token | Classified lexical unit |
| Keyword | Reserved language word |
| Identifier | Name used for a variable, function, class, etc. |
| Literal | Directly written value |
| Operator | Symbol representing an operation |

---

# 4. Parsing

After lexical analysis, the compiler parses the tokens.

Parsing means analyzing the token sequence according to the language grammar.

The parser determines how the tokens are related.

### Example

```typescript
const result = 10 + 20;
```

The parser understands that:

- `const` begins a variable declaration.
- `result` is the variable name.
- `10 + 20` is an expression.
- The expression is assigned to the variable.

It then builds an Abstract Syntax Tree.

### Syntax errors

Consider:

```typescript
const result = 10 + ;
```

This is syntactically invalid.

The parser identifies the problem because the expression is incomplete.

### Important distinction

Parsing and type checking are different.

Consider:

```typescript
const age: number = "25";
```

This is syntactically valid TypeScript.

However, it has a type error.

The parser can understand the structure, but the type checker reports the incompatible assignment.

### Comparison

| Parsing | Type checking |
|---|---|
| Checks grammatical structure | Checks type correctness |
| Builds AST | Analyzes types and relationships |
| Detects syntax errors | Detects type errors |
| Works with language grammar | Works with type-system rules |

---

# 5. Abstract Syntax Tree (AST)

An Abstract Syntax Tree is a tree representation of source code.

It describes the structure of a program.

The AST removes irrelevant formatting details and represents meaningful program constructs.

### Example

```typescript
const age: number = 25;
```

A simplified AST representation looks like:

```text
VariableDeclaration
│
├── Identifier: age
│
├── TypeAnnotation
│   └── NumberKeyword
│
└── Initializer
    └── NumericLiteral: 25
```

The actual TypeScript compiler AST uses specific node kinds and additional information.

### Another example

```typescript
function add(a: number, b: number): number {
    return a + b;
}
```

Simplified AST:

```text
FunctionDeclaration
│
├── Name: add
│
├── Parameters
│   ├── Parameter: a
│   │   └── Type: number
│   │
│   └── Parameter: b
│       └── Type: number
│
├── ReturnType: number
│
└── Body
    └── ReturnStatement
        └── BinaryExpression
            ├── Identifier: a
            ├── Operator: +
            └── Identifier: b
```

### Why is AST useful?

ASTs are used by:

- Compilers.
- Linters.
- Code formatters.
- Static analysis tools.
- Refactoring tools.
- Code generators.
- IDEs.
- Build tools.

For example, ESLint and TypeScript-aware development tools analyze source code structures to provide diagnostics and suggestions.

---

# 6. Understanding AST Nodes

Every meaningful element in the AST is represented by a node.

TypeScript provides many different node types.

Some examples:

| Node | Represents |
|---|---|
| `SourceFile` | A complete source file |
| `VariableDeclaration` | Variable declaration |
| `FunctionDeclaration` | Function declaration |
| `ClassDeclaration` | Class declaration |
| `InterfaceDeclaration` | Interface declaration |
| `MethodDeclaration` | Class method |
| `PropertyDeclaration` | Class property |
| `CallExpression` | Function call |
| `BinaryExpression` | Binary operation |
| `ReturnStatement` | Return statement |
| `ImportDeclaration` | Import declaration |
| `ExportDeclaration` | Export declaration |

### Example

```typescript
const total = add(10, 20);
```

Important nodes include:

- Variable declaration.
- Identifier.
- Call expression.
- Numeric literals.
- Variable initializer.

### Important

An AST is not simply a copy of the source code.

It is a structured representation of the program.

Comments and whitespace are not represented as ordinary syntax nodes in the same way as declarations and expressions, although TypeScript can preserve and expose source trivia through its source-text APIs.

---

# 7. Exploring AST Using TypeScript Compiler API

TypeScript provides a compiler API that allows us to inspect source files programmatically.

First, install TypeScript:

```bash
npm install -D typescript
```

Create:

```text
project/
│
├── src/
│   └── app.ts
│
├── ast.ts
└── package.json
```

### app.ts

```typescript
const name: string = "Riyaz";

function add(a: number, b: number): number {
    return a + b;
}

console.log(add(10, 20));
```

### ast.ts

```typescript
import ts from "typescript";

const sourceFile = ts.createSourceFile(
    "app.ts",
    `
        const name: string = "Riyaz";

        function add(a: number, b: number): number {
            return a + b;
        }
    `,
    ts.ScriptTarget.Latest,
    true
);

console.log(sourceFile.kind);
```

The `createSourceFile()` function creates a source file representation and parses the supplied text.

### Understanding the arguments

```typescript
ts.createSourceFile(
    fileName,
    sourceText,
    languageVersion,
    setParentNodes
);
```

| Argument | Meaning |
|---|---|
| `fileName` | Name of the source file |
| `sourceText` | Actual source code |
| `languageVersion` | Language version used for parsing |
| `setParentNodes` | Whether parent relationships should be populated |

### Important

`createSourceFile()` parses source text.

It does not perform complete project-wide type checking or module resolution by itself.

For that, you need a `Program` and its `TypeChecker`.

---

# 8. Traversing an AST

AST traversal means visiting nodes in the syntax tree.

TypeScript provides:

```typescript
ts.forEachChild()
```

This function visits the immediate child nodes of a node.

### Example

```typescript
import ts from "typescript";

const sourceCode = `
    const name: string = "Riyaz";

    function greet(user: string) {
        return "Hello " + user;
    }
`;

const sourceFile = ts.createSourceFile(
    "app.ts",
    sourceCode,
    ts.ScriptTarget.Latest,
    true
);

function visit(node: ts.Node): void {
    console.log(ts.SyntaxKind[node.kind]);

    ts.forEachChild(node, visit);
}

visit(sourceFile);
```

Possible output includes:

```text
SourceFile
FirstStatement
VariableDeclarationList
VariableDeclaration
Identifier
StringKeyword
StringLiteral
FunctionDeclaration
Identifier
Parameter
Identifier
StringKeyword
Block
ReturnStatement
BinaryExpression
StringLiteral
PlusToken
Identifier
EndOfFileToken
```

The exact output depends on the syntax and compiler version.

### Understanding the recursive function

```typescript
function visit(node: ts.Node): void {
    console.log(ts.SyntaxKind[node.kind]);

    ts.forEachChild(node, visit);
}
```

The function:

1. Receives a node.
2. Prints its kind.
3. Visits its child nodes.
4. Repeats the process recursively.

This is a depth-first traversal.

### Real-world applications

AST traversal can help build:

- Code analyzers.
- Import analyzers.
- Function extractors.
- Custom lint rules.
- Documentation generators.
- Automated code transformations.

---

# 9. Understanding the Binding Process

After parsing, the compiler performs binding.

Binding establishes relationships between declarations and references.

It helps the compiler understand which declaration a particular identifier refers to.

### Example

```typescript
const name = "Riyaz";

function greet() {
    console.log(name);
}
```

When the compiler processes `name` inside `greet()`, it needs to determine which declaration it refers to.

Binding establishes this relationship.

### What is a symbol?

A symbol represents a named entity in the program.

Examples include:

- Variables.
- Functions.
- Classes.
- Interfaces.
- Namespaces.
- Properties.
- Parameters.

### Example

```typescript
class User {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}
```

Important symbols include:

- `User` class symbol.
- `name` property symbol.
- Constructor parameter symbol.

### Why is binding important?

Binding helps the compiler:

- Resolve identifiers.
- Understand scopes.
- Connect declarations and references.
- Detect duplicate declarations.
- Support type checking.

### Important

Binding is not the same as type checking.

Binding establishes declaration relationships.

Type checking uses those relationships to determine whether operations are valid.

---

# 10. Scope and Symbol Tables

A scope determines where a declaration is accessible.

TypeScript and JavaScript have different scopes, including:

- Global scope.
- Module scope.
- Function scope.
- Block scope.
- Class-related scopes.

### Example

```typescript
const globalName = "Riyaz";

function greet() {
    const message = "Hello";

    console.log(globalName);

    console.log(message);
}
```

The function can access `globalName` because it is declared in an outer scope.

But:

```typescript
console.log(message);
```

outside the function is invalid.

### Symbol tables

A symbol table is a compiler data structure that tracks symbols and their relationships.

Conceptually:

```text
Global Scope
│
├── globalName
│
└── greet
    │
    └── Function Scope
        │
        └── message
```

### Important

This is a simplified conceptual model.

The actual TypeScript compiler uses internal symbol structures and scope-related mechanisms that are more complex.

---

# 11. Type Checking

Type checking is the process of verifying whether operations are compatible with the type system.

### Example

```typescript
const age: number = 25;

const name: string = "Riyaz";
```

Both are valid.

But:

```typescript
const age: number = "25";
```

Produces an error.

### Function type checking

```typescript
function add(a: number, b: number): number {
    return a + b;
}
```

Valid:

```typescript
add(10, 20);
```

Invalid:

```typescript
add("10", "20");
```

### Object type checking

```typescript
type User = {
    id: number;
    name: string;
};

const user: User = {
    id: 1,
    name: "Riyaz"
};
```

Invalid:

```typescript
const user: User = {
    id: "1",
    name: "Riyaz"
};
```

### What does the type checker examine?

It analyzes:

- Variable assignments.
- Function arguments.
- Return values.
- Property access.
- Operators.
- Generic constraints.
- Inheritance relationships.
- Interface compatibility.
- Control-flow narrowing.
- Module and declaration relationships.

### Important

TypeScript primarily uses structural typing.

It compares the structure of types rather than requiring every value to come from a particular declared class or interface.

---

# 12. Type Inference Internals

Type inference is the process by which TypeScript determines types without explicit annotations.

### Example 1: Variable inference

```typescript
const name = "Riyaz";
```

TypeScript infers:

```typescript
string
```

For a `const` declaration, the inferred type may preserve a literal type in certain contexts.

```typescript
const role = "ADMIN";
```

In this example, TypeScript infers:

```typescript
"ADMIN"
```

### Example 2: Function return inference

```typescript
function add(a: number, b: number) {
    return a + b;
}
```

TypeScript infers:

```typescript
number
```

### Example 3: Array inference

```typescript
const numbers = [10, 20, 30];
```

TypeScript infers:

```typescript
number[]
```

### Example 4: Generic inference

```typescript
function identity<T>(value: T): T {
    return value;
}

const result = identity(100);
```

TypeScript infers:

```typescript
number
```

### Where does inference come from?

TypeScript uses information such as:

- Initializer expressions.
- Function arguments.
- Return expressions.
- Contextual types.
- Generic constraints.
- Control-flow analysis.
- Assignment relationships.

### Important

Type inference is not the same as runtime type detection.

TypeScript infers types during static analysis.

It does not inspect the runtime value to determine TypeScript types.

---

# 13. Contextual Typing

Contextual typing means TypeScript infers a type based on the surrounding context.

### Example

```typescript
const numbers: number[] = [10, 20, 30];

numbers.forEach((number) => {
    console.log(number.toFixed(2));
});
```

TypeScript knows that `number` is a number.

Why?

Because the `forEach()` callback expects a numeric element.

### Event handler example

```typescript
document.addEventListener("click", (event) => {
    console.log(event.clientX);
});
```

TypeScript infers the callback parameter type from the event listener signature.

### Function assignment

```typescript
type Callback = (value: string) => void;

const callback: Callback = (value) => {
    console.log(value.toUpperCase());
};
```

TypeScript infers:

```typescript
value: string
```

### Contextual typing vs type inference

| Type inference | Contextual typing |
|---|---|
| Determines types from expressions and usage | Determines types from surrounding expected types |
| Example: `const age = 25` | Example: callback parameter type |
| Can infer variable and return types | Commonly applies to callbacks and expressions |

---

# 14. Control-Flow Analysis

TypeScript uses control-flow analysis to understand how types change across different execution paths.

### Example

```typescript
function printValue(value: string | number): void {
    if (typeof value === "string") {
        console.log(value.toUpperCase());
    } else {
        console.log(value.toFixed(2));
    }
}
```

Initially:

```typescript
string | number
```

Inside the first branch:

```typescript
string
```

Inside the second branch:

```typescript
number
```

TypeScript analyzes the control flow and narrows the type.

### Example with assignments

```typescript
function example() {
    let value: string | number;

    value = "Hello";

    console.log(value.toUpperCase());
}
```

At the point of the method call, TypeScript knows that `value` contains a string according to the analyzed control flow.

### Example with early return

```typescript
function process(value: string | number): string {
    if (typeof value === "number") {
        return value.toFixed(2);
    }

    return value.toUpperCase();
}
```

After the first branch returns, the remaining code only executes for strings.

### Why is this important?

Control-flow analysis powers:

- Type narrowing.
- Null checking.
- Discriminated unions.
- Exhaustiveness checking.
- Safe property access.
- Definite assignment analysis.

---

# 15. Type Erasure

Type erasure means TypeScript removes type-only syntax during JavaScript emission.

Consider:

```typescript
interface User {
    id: number;
    name: string;
}

type Role = "ADMIN" | "USER";

function greet(user: User): string {
    return `Hello ${user.name}`;
}
```

Generated JavaScript:

```javascript
function greet(user) {
    return `Hello ${user.name}`;
}
```

The following are removed:

- Interface declarations.
- Type aliases.
- Type annotations.
- Generic type parameters.
- Type-only imports and exports.

### What is preserved?

Runtime JavaScript constructs remain.

For example:

```typescript
class User {
    constructor(public name: string) {}
}
```

The class remains as JavaScript code.

TypeScript removes the type-level syntax while preserving the runtime behavior.

### Important distinction

Not everything that looks like a type-related declaration disappears.

Enums and namespaces can produce JavaScript output because they may have runtime behavior.

For example:

```typescript
enum Role {
    Admin,
    User
}
```

A normal enum produces runtime JavaScript.

A `const enum` may be inlined depending on compiler configuration and compilation behavior.

### Why is type erasure important?

It explains why TypeScript types cannot generally be inspected at runtime.

For runtime validation, you need actual JavaScript logic or a schema-validation library.

---

# 16. JavaScript Code Generation

After type checking and necessary transformations, the compiler can generate JavaScript.

### Example

TypeScript:

```typescript
class User {
    constructor(
        public name: string,
        private age: number
    ) {}

    getAge(): number {
        return this.age;
    }
}
```

The emitted JavaScript depends on the selected target and module configuration.

For a modern target, the result may look approximately like:

```javascript
class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    getAge() {
        return this.age;
    }
}
```

Notice:

- Type annotations are removed.
- Access modifiers are removed as TypeScript modifiers.
- Parameter properties become assignments.
- The class and its methods remain.

### Target configuration

```json
{
    "compilerOptions": {
        "target": "ES2022"
    }
}
```

The `target` setting determines the JavaScript language level used for emitted output.

### Important

Modern build tools may also transform TypeScript.

For example:

- TypeScript compiler (`tsc`).
- Babel.
- SWC.
- esbuild.
- Vite build pipeline.

Some tools strip TypeScript syntax without performing full TypeScript type checking.

Therefore, a successful build does not always mean the code has passed TypeScript type checking.

---

# 17. Compiler Diagnostics

Compiler diagnostics are messages generated by TypeScript to report problems or provide information.

There are different categories.

### A. Syntax errors

Example:

```typescript
const age = ;
```

The syntax is invalid.

### B. Type errors

```typescript
const age: number = "25";
```

The assignment is incompatible.

### C. Configuration errors

For example, an invalid compiler option in `tsconfig.json`.

### D. Declaration errors

For example, incompatible declarations or invalid module augmentation.

### Example

```typescript
function add(a: number, b: number): number {
    return a + b;
}

add("10", 20);
```

Possible diagnostic:

```text
Argument of type 'string' is not assignable to parameter of type 'number'.
```

### Understanding diagnostic information

A diagnostic can contain:

- Error code.
- Error category.
- Error message.
- Source file.
- Source location.
- Related information.

### Common compiler commands

```bash
npx tsc
```

Compile the project.

```bash
npx tsc --noEmit
```

Type-check without emitting JavaScript.

```bash
npx tsc --watch
```

Watch for changes.

```bash
npx tsc --pretty
```

Display formatted diagnostics.

```bash
npx tsc --listFiles
```

List files included in the compilation.

```bash
npx tsc --explainFiles
```

Explain why files are included.

```bash
npx tsc --traceResolution
```

Show module resolution details.

```bash
npx tsc --extendedDiagnostics
```

Display detailed compiler performance information.

---

# 18. Understanding the TypeScript Compiler API

The TypeScript Compiler API allows developers to interact with the compiler programmatically.

You can use it to:

- Parse TypeScript source code.
- Create compiler programs.
- Inspect AST nodes.
- Retrieve type information.
- Generate diagnostics.
- Analyze dependencies.
- Transform source code.
- Build custom development tools.

Install TypeScript:

```bash
npm install -D typescript
```

Import the compiler API:

```typescript
import ts from "typescript";
```

### Important compiler API objects

| Object | Purpose |
|---|---|
| `Program` | Represents a complete compilation |
| `CompilerHost` | Provides file-system and compiler environment operations |
| `SourceFile` | Represents a parsed source file |
| `Node` | Represents an AST node |
| `Symbol` | Represents a declared entity |
| `Type` | Represents a type |
| `TypeChecker` | Provides semantic type information |
| `Diagnostic` | Represents compiler diagnostic information |

We will explore the most important objects next.

---

# 19. Understanding `SourceFile`

A `SourceFile` represents a parsed TypeScript or JavaScript file.

### Example

```typescript
import ts from "typescript";

const code = `
    const name: string = "Riyaz";

    function greet() {
        return name;
    }
`;

const sourceFile = ts.createSourceFile(
    "app.ts",
    code,
    ts.ScriptTarget.Latest,
    true
);

console.log(sourceFile.fileName);

console.log(sourceFile.statements.length);
```

### Important properties

| Property | Purpose |
|---|---|
| `fileName` | Source file name |
| `text` | Original source text |
| `statements` | Top-level statements |
| `languageVersion` | Language version |
| `endOfFileToken` | End-of-file token |
| `parseDiagnostics` | Syntax-related parse diagnostics |

### Accessing statements

```typescript
for (const statement of sourceFile.statements) {
    console.log(ts.SyntaxKind[statement.kind]);
}
```

This allows you to inspect top-level declarations.

---

# 20. Understanding `Program`

A `Program` represents the complete compilation context.

It contains information about:

- Source files.
- Compiler options.
- Module resolution.
- Dependencies.
- Type checking.
- Diagnostics.

### Creating a Program

```typescript
import ts from "typescript";

const configPath = ts.findConfigFile(
    process.cwd(),
    ts.sys.fileExists,
    "tsconfig.json"
);

if (!configPath) {
    throw new Error("tsconfig.json not found");
}

const configFile = ts.readConfigFile(
    configPath,
    ts.sys.readFile
);

if (configFile.error) {
    throw new Error("Unable to read tsconfig.json");
}

const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    process.cwd()
);

const program = ts.createProgram({
    rootNames: parsedConfig.fileNames,
    options: parsedConfig.options
});

console.log(program.getSourceFiles().length);
```

### Understanding `createProgram()`

```typescript
ts.createProgram({
    rootNames,
    options
});
```

- `rootNames`: Initial source files.
- `options`: Compiler configuration.

The compiler also resolves imported dependencies.

### Important

`Program` is the main entry point for many compiler API operations.

---

# 21. Understanding `TypeChecker`

The `TypeChecker` provides semantic information about source code.

It can answer questions such as:

- What is the type of this expression?
- What symbol does this identifier reference?
- What properties does this type contain?
- What is the return type of this function?
- Is one type assignable to another?

### Example

```typescript
import ts from "typescript";

const fileName = "example.ts";

const code = `
    const age: number = 25;

    const name: string = "Riyaz";
`;

const sourceFile = ts.createSourceFile(
    fileName,
    code,
    ts.ScriptTarget.Latest,
    true
);
```

For semantic type information, create a `Program` rather than relying only on `createSourceFile()`.

### Program and TypeChecker

```typescript
const program = ts.createProgram({
    rootNames: ["example.ts"],
    options: {
        strict: true,
        target: ts.ScriptTarget.ES2022
    }
});

const checker = program.getTypeChecker();
```

Now you can inspect types.

### Example: Getting a variable's type

```typescript
const sourceFile = program.getSourceFile("example.ts");

if (!sourceFile) {
    throw new Error("Source file not found");
}

function visit(node: ts.Node): void {
    if (ts.isVariableDeclaration(node)) {
        const type = checker.getTypeAtLocation(node.name);

        console.log(
            node.name.getText(sourceFile),
            checker.typeToString(type)
        );
    }

    ts.forEachChild(node, visit);
}

visit(sourceFile);
```

Possible output:

```text
age number
name string
```

### Important

`TypeChecker` uses semantic information available through the `Program`.

This is why a `Program` is necessary for reliable project-level type analysis.

---

# 22. Understanding Symbols

A symbol represents a declaration or entity in the TypeScript program.

Consider:

```typescript
const name = "Riyaz";
```

The identifier `name` has a symbol associated with its declaration.

### Example using the compiler API

```typescript
import ts from "typescript";

const program = ts.createProgram({
    rootNames: ["example.ts"],
    options: {}
});

const checker = program.getTypeChecker();

const sourceFile = program.getSourceFile("example.ts");

if (!sourceFile) {
    throw new Error("File not found");
}

function visit(node: ts.Node): void {
    if (ts.isIdentifier(node) && node.text === "name") {
        const symbol = checker.getSymbolAtLocation(node);

        if (symbol) {
            console.log(symbol.getName());
        }
    }

    ts.forEachChild(node, visit);
}

visit(sourceFile);
```

Output:

```text
name
```

### Why are symbols useful?

They help build tools that understand:

- Variable declarations.
- Function declarations.
- Class members.
- Imported references.
- Exported declarations.
- Identifier relationships.

For example, an IDE's "Go to Definition" feature needs to understand which declaration an identifier refers to.

---

# 23. Getting Function Return Types Through the Compiler API

Suppose you have:

```typescript
function add(a: number, b: number) {
    return a + b;
}
```

You want to inspect the return type.

The compiler API can do this.

### Example

```typescript
import ts from "typescript";

const program = ts.createProgram({
    rootNames: ["example.ts"],
    options: {
        strict: true
    }
});

const checker = program.getTypeChecker();

const sourceFile = program.getSourceFile("example.ts");

if (!sourceFile) {
    throw new Error("Source file not found");
}

function visit(node: ts.Node): void {
    if (ts.isFunctionDeclaration(node) && node.name) {
        const signature = checker.getSignatureFromDeclaration(node);

        if (signature) {
            const returnType = checker.getReturnTypeOfSignature(signature);

            console.log(
                node.name.text,
                checker.typeToString(returnType)
            );
        }
    }

    ts.forEachChild(node, visit);
}

visit(sourceFile);
```

Possible output:

```text
add number
```

### Important methods

| Method | Purpose |
|---|---|
| `getTypeAtLocation()` | Gets the type of a node |
| `getSymbolAtLocation()` | Gets the associated symbol |
| `getSignatureFromDeclaration()` | Gets a function signature |
| `getReturnTypeOfSignature()` | Gets a signature's return type |
| `typeToString()` | Converts a type into readable text |

---

# 24. Compiler Diagnostics Using the API

You can also create a program and retrieve diagnostics programmatically.

### Example

```typescript
import ts from "typescript";

const program = ts.createProgram({
    rootNames: ["example.ts"],
    options: {
        strict: true,
        noEmit: true
    }
});

const diagnostics = ts.getPreEmitDiagnostics(program);

for (const diagnostic of diagnostics) {
    const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
    );

    console.log(message);
}
```

This retrieves diagnostics produced by the compiler before emission.

### Why is this useful?

You can build:

- Custom validation tools.
- CI checks.
- Type analysis utilities.
- Editor integrations.
- Code quality tools.

---

# 25. Writing a Basic TypeScript Analysis Tool

Now let's build a small practical tool.

**Goal:** Analyze a TypeScript file and print all declared function names and return types.

### Project structure

```text
project/
│
├── src/
│   └── app.ts
│
├── analyzer.ts
├── package.json
└── tsconfig.json
```

### src/app.ts

```typescript
function add(a: number, b: number): number {
    return a + b;
}

function greet(name: string): string {
    return `Hello ${name}`;
}

function isActive(): boolean {
    return true;
}
```

### analyzer.ts

```typescript
import ts from "typescript";

const fileName = "src/app.ts";

const program = ts.createProgram({
    rootNames: [fileName],
    options: {
        strict: true,
        target: ts.ScriptTarget.ES2022
    }
});

const checker = program.getTypeChecker();

const sourceFile = program.getSourceFile(fileName);

if (!sourceFile) {
    throw new Error(`File not found: ${fileName}`);
}

function analyze(node: ts.Node): void {
    if (ts.isFunctionDeclaration(node) && node.name) {
        const signature = checker.getSignatureFromDeclaration(node);

        if (signature) {
            const returnType = checker.getReturnTypeOfSignature(signature);

            console.log({
                functionName: node.name.text,
                returnType: checker.typeToString(returnType)
            });
        }
    }

    ts.forEachChild(node, analyze);
}

analyze(sourceFile);
```

### Possible output

```text
{
    functionName: 'add',
    returnType: 'number'
}

{
    functionName: 'greet',
    returnType: 'string'
}

{
    functionName: 'isActive',
    returnType: 'boolean'
}
```

### What did we build?

We created a basic static analysis tool.

It:

1. Creates a TypeScript program.
2. Retrieves the type checker.
3. Gets a source file.
4. Traverses its AST.
5. Finds function declarations.
6. Extracts return types.
7. Prints the results.

This is the foundation of many advanced TypeScript development tools.

---

# 26. Understanding AST Transformations

AST transformation means changing the AST or its representation to produce different output.

For example, a tool might transform:

```typescript
const name = "Riyaz";
```

Into:

```typescript
const name = "RIYAZ";
```

A transformation can:

- Add code.
- Remove code.
- Replace expressions.
- Modify declarations.
- Generate new structures.

### Important compiler API functions

Some relevant functions include:

```typescript
ts.factory.createIdentifier()
```

Creates an identifier node.

```typescript
ts.factory.createStringLiteral()
```

Creates a string literal node.

```typescript
ts.factory.createVariableDeclaration()
```

Creates a variable declaration node.

```typescript
ts.factory.createCallExpression()
```

Creates a call expression node.

### Example: Create a string literal

```typescript
import ts from "typescript";

const node = ts.factory.createStringLiteral("Hello");

console.log(ts.SyntaxKind[node.kind]);
```

Output:

```text
StringLiteral
```

### Important

Creating a node is not the same as transforming a complete source file.

For full transformations, you generally use the compiler transformation APIs and understand how nodes are visited and replaced.

---

# 27. Understanding `ts.transpileModule()`

The TypeScript API provides:

```typescript
ts.transpileModule()
```

It transforms a TypeScript source string into JavaScript.

### Example

```typescript
import ts from "typescript";

const source = `
    const name: string = "Riyaz";

    console.log(name);
`;

const result = ts.transpileModule(source, {
    compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext
    }
});

console.log(result.outputText);
```

Output:

```javascript
const name = "Riyaz";
console.log(name);
```

### Important limitation

`transpileModule()` is a single-file transformation API.

It does not perform full project-wide type checking.

For semantic type checking, use:

- `createProgram()`
- `getTypeChecker()`
- Compiler diagnostics APIs

### Comparison

| `transpileModule()` | `createProgram()` |
|---|---|
| Transforms source text | Represents a compilation project |
| Suitable for quick transpilation | Suitable for full compiler analysis |
| No complete semantic type checking | Provides semantic type checking |
| Single-source transformation | Supports project-level module resolution |

---

# 28. Compiler Performance

As a TypeScript application grows, type checking and compilation can become slower.

Several factors can affect performance:

- Large project size.
- Complex generic types.
- Deeply recursive conditional types.
- Large union types.
- Extensive mapped types.
- Complex module resolution.
- Large declaration files.
- Circular dependencies.
- Excessive type instantiation.

### Example of potentially expensive types

```typescript
type DeepTransform<T> = {
    [K in keyof T]:
        T[K] extends object
            ? DeepTransform<T[K]>
            : T[K];
};
```

This recursive mapped type can become expensive when applied to large and deeply nested structures.

### Best practices

**1. Avoid unnecessary type complexity.**

Do not create extremely complex generic types when a simpler type is sufficient.

**2. Avoid unnecessary recursive types.**

Use recursive type utilities only when they provide meaningful benefits.

**3. Break large projects into smaller logical modules.**

This improves maintainability and can help with project-level compilation strategies.

**4. Use appropriate library types.**

Avoid repeatedly recreating complex types that TypeScript already provides.

**5. Use incremental compilation.**

It can reduce repeated compilation work.

**6. Investigate compiler diagnostics.**

Use:

```bash
npx tsc --extendedDiagnostics
```

to inspect compiler performance information.

### Important

A complicated type is not automatically slow.

Actual performance depends on how the compiler instantiates, resolves, and compares it.

---

# 29. Incremental Compilation

Incremental compilation allows TypeScript to reuse information from previous compilations.

Instead of rebuilding everything from scratch, the compiler can use cached build information.

Enable it:

```json
{
    "compilerOptions": {
        "incremental": true
    }
}
```

Now run:

```bash
npx tsc
```

TypeScript can generate a build information file, commonly:

```text
tsconfig.tsbuildinfo
```

### What does it contain?

It stores information that helps the compiler perform subsequent incremental builds.

### Benefits

- Faster repeated compilation.
- Less unnecessary work.
- Better development experience in larger projects.

### Important

The build information file is a cache.

It is not the application's JavaScript output.

It can generally be regenerated if removed.

---

# 30. Watch Mode

Watch mode automatically recompiles the project when source files change.

Run:

```bash
npx tsc --watch
```

Or:

```bash
npx tsc -w
```

### Example workflow

1. Start the compiler in watch mode.
2. Edit a `.ts` file.
3. TypeScript detects the change.
4. The project is rechecked.
5. JavaScript is emitted when configured to do so.

### Watch options

You can configure:

```json
{
    "compilerOptions": {
        "incremental": true
    },
    "watchOptions": {
        "watchFile": "useFsEvents",
        "watchDirectory": "useFsEvents",
        "fallbackPolling": "dynamicPriority"
    }
}
```

The exact options should be selected based on the operating system and project environment.

### Important distinction

Watch mode and incremental compilation are related but different.

| Watch mode | Incremental compilation |
|---|---|
| Monitors file changes | Reuses previous compilation information |
| Automatically triggers recompilation | Makes subsequent builds more efficient |
| Used during development | Can be used in development and build workflows |

---

# 31. Project References

Project references allow you to divide a large TypeScript codebase into smaller TypeScript projects.

They are particularly useful in monorepos and large applications.

### Example structure

```text
project/
│
├── packages/
│   │
│   ├── shared/
│   │   ├── src/
│   │   └── tsconfig.json
│   │
│   ├── backend/
│   │   ├── src/
│   │   └── tsconfig.json
│   │
│   └── frontend/
│       ├── src/
│       └── tsconfig.json
│
└── tsconfig.json
```

### Root tsconfig.json

```json
{
    "files": [],
    "references": [
        {
            "path": "./packages/shared"
        },
        {
            "path": "./packages/backend"
        },
        {
            "path": "./packages/frontend"
        }
    ]
}
```

### Shared project tsconfig.json

```json
{
    "compilerOptions": {
        "composite": true,
        "declaration": true,
        "declarationMap": true,
        "outDir": "dist",
        "rootDir": "src",
        "strict": true
    },
    "include": ["src"]
}
```

### Backend project tsconfig.json

```json
{
    "compilerOptions": {
        "composite": true,
        "declaration": true,
        "outDir": "dist",
        "rootDir": "src",
        "strict": true
    },
    "include": ["src"],
    "references": [
        {
            "path": "../shared"
        }
    ]
}
```

The frontend project can also reference the shared project.

### What is `composite`?

The `composite` option enables a project to participate in project references.

It also imposes certain project configuration requirements.

### What is `declaration`?

It generates `.d.ts` declaration files alongside compiled output.

### What is `declarationMap`?

It generates source maps for declaration files.

This can improve navigation from generated declaration files back to their original TypeScript source.

### Building referenced projects

Run:

```bash
npx tsc --build
```

Or:

```bash
npx tsc -b
```

TypeScript builds referenced projects in dependency order.

### Cleaning build outputs

```bash
npx tsc --build --clean
```

This cleans build outputs associated with the build.

---

# 32. Build Mode

Build mode is used with TypeScript project references.

It understands project dependencies and builds projects in the correct order.

### Common commands

Build all referenced projects:

```bash
npx tsc --build
```

Build with verbose output:

```bash
npx tsc --build --verbose
```

Build without emitting files:

```bash
npx tsc --build --dry
```

Clean build outputs:

```bash
npx tsc --build --clean
```

Build in watch mode:

```bash
npx tsc --build --watch
```

### Why use build mode?

Suppose your application has:

```text
shared → backend
shared → frontend
```

The backend and frontend both depend on shared code.

Build mode understands these dependencies and builds projects in the required order.

### Important

Project references are not simply import aliases.

They define relationships between TypeScript projects and help coordinate builds.

---

# 33. Important Compiler Options – Advanced Revision

Let's review some important compiler options.

| Option | Purpose |
|---|---|
| `strict` | Enables strict type-checking options |
| `noImplicitAny` | Reports inferred implicit `any` types |
| `strictNullChecks` | Makes null and undefined checking stricter |
| `strictFunctionTypes` | Applies stricter function parameter checking |
| `strictPropertyInitialization` | Checks class property initialization |
| `noImplicitThis` | Reports implicit `any` types for `this` |
| `noUnusedLocals` | Reports unused local declarations |
| `noUnusedParameters` | Reports unused parameters |
| `noFallthroughCasesInSwitch` | Reports fallthrough between switch cases |
| `noImplicitReturns` | Reports functions that may not return a value on all paths |
| `noUncheckedIndexedAccess` | Adds undefined possibilities to certain indexed access types |
| `noEmit` | Prevents JavaScript output |
| `noEmitOnError` | Prevents output when errors are reported |
| `declaration` | Generates `.d.ts` files |
| `declarationMap` | Generates declaration source maps |
| `sourceMap` | Generates JavaScript source maps |
| `incremental` | Enables incremental compilation |
| `composite` | Enables project-reference support |
| `skipLibCheck` | Skips checking declaration files |
| `isolatedModules` | Checks compatibility with single-file transpilation |
| `verbatimModuleSyntax` | Controls preservation of import/export syntax |

### Important distinction

`strict: true` enables a collection of strict checking options.

Some compiler options remain independent and must be enabled separately.

---

# 34. TypeScript Compiler vs Runtime

This is a fundamental concept.

TypeScript is not a runtime environment.

It is a language and type system that can be transformed into JavaScript.

### Example

```typescript
const age: number = 25;
```

At compile time:

TypeScript checks that the assigned value is compatible with `number`.

At runtime:

JavaScript executes:

```javascript
const age = 25;
```

There is no TypeScript `number` type annotation at runtime.

### Comparison

| TypeScript compiler | JavaScript runtime |
|---|---|
| Performs static analysis | Executes JavaScript |
| Checks types | Works with actual values |
| Generates JavaScript when configured | Runs the generated code |
| Understands interfaces and type aliases | Does not have TypeScript interfaces or aliases |
| Reports compile-time diagnostics | Reports runtime errors |

### Important

A program can pass TypeScript type checking and still fail at runtime.

Example:

```typescript
const user = JSON.parse('{"name":"Riyaz"}') as {
    name: string;
    age: number;
};

console.log(user.age.toFixed(2));
```

TypeScript trusts the assertion.

But the parsed object does not contain `age`.

At runtime, this can fail.

**Key takeaway:** Static type checking does not replace runtime validation.

---

# 35. Common Mistakes

### Mistake 1: Thinking TypeScript executes directly

TypeScript requires a compatible runtime or transformation tool.

Node.js does not execute TypeScript type syntax as ordinary JavaScript.

Some tools provide direct TypeScript execution or syntax stripping, but that does not mean the TypeScript compiler's full type checking happens at runtime.

### Mistake 2: Confusing parsing and type checking

Parsing checks syntax.

Type checking checks semantic type compatibility.

### Mistake 3: Assuming AST contains complete type information

An AST represents source structure.

To inspect semantic types, use the `TypeChecker` associated with a `Program`.

### Mistake 4: Assuming type annotations exist at runtime

Most TypeScript type information is erased during JavaScript emission.

### Mistake 5: Using `createSourceFile()` for full type checking

`createSourceFile()` parses a file.

It does not provide complete project-level semantic analysis.

### Mistake 6: Confusing `transpileModule()` with full compilation

`transpileModule()` transforms source text but does not perform full semantic type checking.

### Mistake 7: Ignoring compiler configuration

Different `target`, `module`, and `moduleResolution` settings can produce different output and resolution behavior.

### Mistake 8: Assuming incremental compilation prevents all recompilation

It reduces repeated work, but changes to dependencies can still require dependent projects to be rebuilt.

### Mistake 9: Overusing complex types

Deeply recursive and highly complex types can increase compiler workload.

### Mistake 10: Assuming a successful build guarantees runtime correctness

TypeScript cannot guarantee that external API responses, database records, or user input match their declared types.

---

# 36. Interview Questions and Answers

### Q1. What is the TypeScript compiler?

The TypeScript compiler processes TypeScript source code, performs type checking, reports diagnostics, and can generate JavaScript output.

### Q2. What are the main stages of TypeScript compilation?

A simplified view includes lexical analysis, parsing, binding, type checking, transformation, and code generation.

### Q3. What is lexical analysis?

Lexical analysis converts source code characters into meaningful tokens.

### Q4. What is parsing?

Parsing analyzes tokens according to the language grammar and builds an AST.

### Q5. What is an AST?

An Abstract Syntax Tree is a structured representation of source code.

### Q6. What is binding?

Binding connects declarations and references, establishing symbol relationships and scopes.

### Q7. What is a symbol?

A symbol represents a named program entity such as a variable, function, class, or property.

### Q8. What is type checking?

Type checking verifies whether expressions, assignments, function calls, and other operations are compatible with the type system.

### Q9. What is type inference?

Type inference is the process by which TypeScript determines types from expressions and contextual information.

### Q10. What is contextual typing?

Contextual typing means TypeScript infers types from the surrounding expected type.

### Q11. What is control-flow analysis?

Control-flow analysis tracks how execution paths affect variable types and narrows types where possible.

### Q12. What is type erasure?

Type erasure is the removal of TypeScript-only type syntax during JavaScript emission.

### Q13. What is the difference between an AST and a symbol table?

An AST represents source-code structure.

A symbol table tracks declarations and their relationships.

### Q14. What is the TypeScript Compiler API?

It is a programmatic interface that allows developers to parse, analyze, transform, and compile TypeScript code.

### Q15. What is a `SourceFile`?

It represents a parsed source file in the compiler API.

### Q16. What is a `Program`?

A `Program` represents a complete compilation context containing source files, compiler options, dependencies, and semantic information.

### Q17. What is a `TypeChecker`?

It provides semantic type information for nodes, symbols, and expressions in a TypeScript program.

### Q18. What is `transpileModule()`?

It is a TypeScript API that transforms TypeScript source text into JavaScript without performing full project-wide type checking.

### Q19. What is incremental compilation?

Incremental compilation reuses previous build information to reduce repeated compilation work.

### Q20. What is project reference?

A project reference defines a dependency between TypeScript projects and helps coordinate compilation in larger codebases.

### Q21. What is build mode?

Build mode builds referenced TypeScript projects in dependency order.

### Q22. What is `composite`?

It is a compiler option that enables a project to participate in project references.

### Q23. What is `declaration`?

It generates `.d.ts` declaration files from TypeScript source files.

### Q24. What is `skipLibCheck`?

It skips checking declaration files for type consistency errors.

### Q25. Can TypeScript guarantee runtime correctness?

No. TypeScript performs static analysis. Runtime validation is still required for untrusted external data.

---

# 37. Practical Exercises

Complete these exercises to understand the compiler internals practically.

## Exercise 1: Inspect an AST

Create a TypeScript file containing:

- Variables.
- Functions.
- Classes.
- Interfaces.
- Imports.
- Exports.

Use `createSourceFile()` to parse it.

## Exercise 2: Traverse an AST

Use:

```typescript
ts.forEachChild()
```

Print the syntax kind of every node.

## Exercise 3: Extract Function Names

Build a tool that finds all function declarations in a TypeScript file and prints their names.

## Exercise 4: Extract Variable Names

Build a tool that identifies all variable declarations.

## Exercise 5: Extract Function Return Types

Use the TypeChecker API to print function names and return types.

## Exercise 6: Extract Parameter Types

Create a tool that prints:

- Function name.
- Parameter name.
- Parameter type.

Example:

```text
Function: add
Parameter: a
Type: number

Function: add
Parameter: b
Type: number
```

## Exercise 7: Find Class Declarations

Create a tool that identifies all classes and their methods.

## Exercise 8: Detect Explicit `any`

Traverse the AST and report variables, parameters, and properties explicitly annotated with `any`.

## Exercise 9: Detect Missing Return Types

Find function declarations without explicit return type annotations.

Do not confuse an inferred return type with an explicit annotation.

## Exercise 10: Compiler Diagnostics

Create a TypeScript program and print all compiler diagnostics.

## Exercise 11: TypeScript Code Transformer

Use the compiler factory API to create an AST node representing:

```typescript
const name = "Riyaz";
```

## Exercise 12: Build a Type Analyzer

Create a tool that prints:

- Variable name.
- Inferred type.
- Source file.
- Line number.

## Exercise 13: Incremental Compilation

Enable:

```json
{
    "compilerOptions": {
        "incremental": true
    }
}
```

Compile the project twice and inspect the build information file.

## Exercise 14: Project References

Create two TypeScript projects:

- `shared`
- `backend`

Make the backend project reference shared.

Build both using:

```bash
npx tsc --build
```

## Exercise 15: Performance Analysis

Create a project with several source files.

Use:

```bash
npx tsc --extendedDiagnostics
```

Observe the compilation metrics.

---

# 38. Phase 24 Completion Checklist

| No. | Topic | Status |
|---|---|---|
| 1 | TypeScript compiler fundamentals | ☐ |
| 2 | Compiler architecture | ☐ |
| 3 | Lexical analysis | ☐ |
| 4 | Parsing | ☐ |
| 5 | Abstract Syntax Trees | ☐ |
| 6 | AST nodes | ☐ |
| 7 | AST traversal | ☐ |
| 8 | Binding | ☐ |
| 9 | Symbols and symbol tables | ☐ |
| 10 | Type checking | ☐ |
| 11 | Type inference | ☐ |
| 12 | Contextual typing | ☐ |
| 13 | Control-flow analysis | ☐ |
| 14 | Type erasure | ☐ |
| 15 | JavaScript code generation | ☐ |
| 16 | Compiler diagnostics | ☐ |
| 17 | Compiler API | ☐ |
| 18 | SourceFile | ☐ |
| 19 | Program | ☐ |
| 20 | TypeChecker | ☐ |
| 21 | Symbol inspection | ☐ |
| 22 | Function return type extraction | ☐ |
| 23 | AST transformations | ☐ |
| 24 | `transpileModule()` | ☐ |
| 25 | Compiler performance | ☐ |
| 26 | Incremental compilation | ☐ |
| 27 | Watch mode | ☐ |
| 28 | Project references | ☐ |
| 29 | Build mode | ☐ |
| 30 | Advanced compiler options | ☐ |
| 31 | TypeScript vs runtime | ☐ |

---

# What Comes Next?

## Phase 25: Advanced TypeScript – Advanced Type System Internals and Type Compatibility

In the next phase, we will explore how TypeScript compares types and determines compatibility.

Topics will include:

1. Structural typing in depth.
2. Type compatibility rules.
3. Assignability vs type identity.
4. Subtyping.
5. Excess property checking.
6. Fresh object literals.
7. Weak types.
8. Function compatibility rules.
9. Variance and bivariance.
10. Generic type compatibility.
11. Class compatibility.
12. Private and protected member compatibility.
13. Union and intersection compatibility.
14. `any`, `unknown`, and `never` compatibility.
15. Type widening and narrowing internals.
16. Soundness and unsoundness.
17. Type assertions and their limitations.
18. Advanced compatibility examples.

**Phase 24 complete.** Say **"OK, Phase 25"** when you're ready to continue.