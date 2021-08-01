var Interpreter = require('./dist/index.js');

const code = `
var a = 1;
console.log(123);
`;
const interpreter = new Interpreter(code);
interpreter.step();
