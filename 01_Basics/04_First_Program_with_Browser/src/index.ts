function greet(name: string): string {
  return `Hello, ${name}`;
}

const user: string = "Riyaz";
console.log(greet(user));

// The last line will cause a TypeScript error because '1' is not a string.
// To fix the error, we should pass a string argument to the greet function.
// console.log(greet("1"));
// console.log(greet(1));

