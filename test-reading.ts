import { generateReading } from './src/lib/numerology';
import util from 'util';

// Person 1: Life path 7, Expression X, Soul Y
const res1 = generateReading('John Doe', new Date('1990-01-01')); 
// Life Path calculation: 1+1+1+9+9+0 = 21 -> 3. (Wait, let's just see output)

// Person 2: Different name/dob but same Life path 3.
// 1990-02-09 -> 2+9+1+9+9+0 = 30 -> 3.
const res2 = generateReading('Alice Smith', new Date('1990-02-09'));

console.log("--- JOHN DOE (LP: " + res1.lifePathNumber + ", Exp: " + res1.expressionNumber + ") ---");
console.log(util.inspect(res1.careerModule, { depth: null, colors: true }));
console.log(util.inspect(res1.emotionsModule, { depth: null, colors: true }));

console.log("\n--- ALICE SMITH (LP: " + res2.lifePathNumber + ", Exp: " + res2.expressionNumber + ") ---");
console.log(util.inspect(res2.careerModule, { depth: null, colors: true }));
console.log(util.inspect(res2.emotionsModule, { depth: null, colors: true }));
