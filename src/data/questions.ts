export type QuestionType = 'mcq' | 'code';

export interface Question {
  id: number;
  type: QuestionType;
  title: string;
  description?: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer?: number; // Index of correct option for MCQ
  difficulty?: string;
}

export const questions: Question[] = [
  {
    id: 1,
    type: 'mcq',
    title: 'Variables & Scope',
    description: 'What will be the output?',
    codeSnippet: `let x = 10;

function test() {
  let x = 20;
  console.log(x);
}

test();`,
    options: ['10', '20', 'undefined', 'Error'],
    correctAnswer: 1, // '20'
  },
  {
    id: 2,
    type: 'mcq',
    title: 'Data Types',
    description: 'What is the result of:',
    codeSnippet: `typeof null`,
    options: ['"null"', '"object"', '"undefined"', '"number"'],
    correctAnswer: 1,
  },
  {
    id: 3,
    type: 'mcq',
    title: 'Equality',
    description: 'What will this return?',
    codeSnippet: `console.log(5 == "5");`,
    options: ['false', 'true', 'Error', 'undefined'],
    correctAnswer: 1,
  },
  {
    id: 4,
    type: 'mcq',
    title: 'Arrow Functions',
    description: 'Which is TRUE about arrow functions?',
    options: [
      'They have their own this',
      'They inherit this from the parent scope',
      'They cannot return values',
      'They must always use return'
    ],
    correctAnswer: 1,
  },
  {
    id: 5,
    type: 'mcq',
    title: 'Arrays',
    description: 'What does this return?',
    codeSnippet: `[1, 2, 3].push(4)`,
    options: ['[1,2,3,4]', '4', 'undefined', 'Error'],
    correctAnswer: 1,
  },
  {
    id: 6,
    type: 'mcq',
    title: 'Loops',
    description: 'What will be logged?',
    codeSnippet: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}`,
    options: ['0,1,2', '3,3,3', 'undefined', 'Error'],
    correctAnswer: 1,
  },
  {
    id: 7,
    type: 'mcq',
    title: 'Functions',
    description: 'What is the output?',
    codeSnippet: `function greet(name = "Guest") {
  return "Hello " + name;
}

console.log(greet());`,
    options: ['Hello', 'Hello Guest', 'undefined', 'Error'],
    correctAnswer: 1,
  },
  {
    id: 8,
    type: 'mcq',
    title: 'Objects',
    description: 'What will this return?',
    codeSnippet: `const user = { name: "Sam" };
user.age = 25;

console.log(user);`,
    options: ['{ name: "Sam" }', '{ age: 25 }', '{ name: "Sam", age: 25 }', 'Error'],
    correctAnswer: 2,
  },
  {
    id: 9,
    type: 'code',
    title: 'Challenge 9: Reverse a String',
    description: 'Write a function that reverses a string.\n\nExample:\nreverseString("hello") // "olleh"\nreverseString("Code")  // "edoC"\n\nRequirements:\n* Must return a new reversed string\n* Do not use built-in .reverse() directly (optional restriction)',
    codeSnippet: `function reverseString(str) {
  // your code
}`,
    difficulty: 'Beginner → Intermediate'
  },
  {
    id: 10,
    type: 'code',
    title: 'Challenge 10: Find the Largest Number',
    description: 'Write a function that returns the largest number in an array.\n\nExample:\nfindMax([1, 5, 3, 9, 2]) // 9\nfindMax([-10, -2, -5])   // -2\n\nRequirements:\n* Must work with negative numbers\n* Must not use Math.max(...arr) (optional restriction)',
    codeSnippet: `function findMax(arr) {
  // your code
}`,
    difficulty: 'Beginner → Intermediate'
  }
];
