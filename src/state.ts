import {Node} from "acorn";

export default class State {
  done: boolean = false;
  node: Node;
  private scope: object;

  constructor(ast: Node, scope: object) {
    this.node = ast;
    this.scope = scope;
  }
}
