import State from './state';
import {Node} from "acorn";

interface NodeHandler {
  (stateStack: Array<State>, state: State, node: Node): void;
}

export const ArrayExpression: NodeHandler = function (stateStack, state, node) {

}

export const Program: NodeHandler = function (stateStack, state, node) {
  // @ts-ignore
  const expression = node['body'].shift();
  if (expression) {
    state.done = false;
    return new State(expression, state.scope);
  }
  state.done = true;
}
