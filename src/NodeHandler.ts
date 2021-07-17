import State from './state';
import {Node} from "acorn";

interface NodeHandler {
  (stateStack: Array<State>, state: State, node: Node): void;
}

export const ArrayExpression: NodeHandler = function (stateStack, state, node) {
  debugger
  console.log('LJP: %c%s >>> ', 'background:#ff9912;color:white;font-size:20px', '11', 11);
}

export const Program: NodeHandler = function (stateStack, state, node) {
  debugger
  console.log('LJP: %c%s >>> ', 'background:#ff9912;color:white;font-size:20px', '23222', 23222);
}
