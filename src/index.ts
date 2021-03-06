import * as acorn from "acorn";
import {Node, Options} from "acorn";
import {Program, ArrayExpression} from './NodeHandler';
import {Completion, DEFAULT_OPTIONS} from './constant';
import State from './state';

function getNodeHandler(name: string): Function {
  const NodeHandler = {
    Program,
    ArrayExpression,
  } as {
    [key: string]: typeof Program | typeof ArrayExpression
  };
  return NodeHandler[name];
}

class Scope {

}

class InterpreterObject {

}

class Interpreter {
  private static getterStep: boolean = false;
  private static setterStep: boolean = false;

  private code: string;
  private parsedCode: Node | undefined;
  private ast: Node | undefined;
  private readonly options: Options;
  private paused: boolean = false;
  private polyfills: Array<Function> = [];
  private stateStack: Array<State> = [];
  private globalScope: Scope;
  private globalObject: object;


  constructor(code: string, options: Options = DEFAULT_OPTIONS) {
    this.code = code;
    this.options = options;
    this.parsedCode = acorn.parse(this.code, this.options);
    this.ast = acorn.parse(this.code, this.options);

    this.globalScope = this.createScope(this.ast);
    // @ts-ignore
    this.globalObject = this.globalScope.object;
    const parsedPolyfill = acorn.parse(this.polyfills.join('\n'), DEFAULT_OPTIONS)

    this.stateStack = [new State(parsedPolyfill, this.globalScope)];
    this.run();

    this.stateStack = [new State(this.ast, this.globalScope)];
  }

  createScope(ast: Node): Scope {

    return {object: 1};
  }

  // stripLocations(ast: Node) {
  //
  // }

  step() {
    if (!this.stateStack.length) {
      return;
    }

    const state: State = this.stateStack[this.stateStack.length - 1];
    let start: number = state.node.start;
    let end: number = state.node.end;
    const startTime: number = Date.now();
    do {
      const type: string = state.node['type'];
      if ((type === 'Program' && state.done) || this.paused) {
        return;
      }
      let nextState;
      try {
        nextState = getNodeHandler(type)(this.stateStack, state, state.node);
      } catch (e) {
        // Eat any step errors.  They have been thrown on the stack.
        // if (e !== Interpreter.STEP_ERROR) {
        // Uh oh.  This is a real error in the JS-Interpreter.  Rethrow.
        throw e;
        // }
      }
      if (nextState) {
        this.stateStack.push(nextState);
      }
      // if (Interpreter.getterStep) {
      //   // Getter from this step was not handled.
      //   throw Error('Getter not supported in this context');
      // }
      // if (Interpreter.setterStep) {
      //   // Setter from this step was not handled.
      //   throw Error('Setter not supported in this context');
      // }
      // This may be polyfill code.  Keep executing until we arrive at user code.
    } while (!state.node['end'] && startTime + 1000 > Date.now()); // this['POLYFILL_TIMEOUT']
  }

  run() {
    while (!this.paused && this.step()) {
    }
    return this.paused;
  }
}

export default Interpreter;
