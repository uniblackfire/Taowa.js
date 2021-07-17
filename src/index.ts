import * as acorn from "acorn";
import {Node, Options} from "acorn";
import {Program, ArrayExpression} from './NodeHandler';
import {Completion, DEFAULT_OPTIONS} from './constant';
import State from './state';

const NodeHandler = {
  Program,
  ArrayExpression,
} as {
  [key: string]: typeof Program | typeof ArrayExpression
};

function getNodeHandler(name: string): Function {
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
  // private expressionProcessors: Map<string, Function> = new Map<string, Function>();
  private globalScope: object;
  private globalObject: object;


  constructor(code: string, options: Options = DEFAULT_OPTIONS) {
    this.code = code;
    this.options = options;

    this.parsedCode = acorn.parse(this.code, this.options);
    this.ast = acorn.parse(this.code, this.options);

    // this.initExpressionProcessor();
    // for (const prop in this) {
    //   console.log('this prop >>> ' + prop);
    //   const fun = this[prop];
    //   let methodName;
    //   if (typeof fun === 'function' && (methodName = prop.match(/^step([A-Z]\w*)$/))) {
    //     this.expressionProcessors.set(methodName[1], fun.bind(this));
    //   }
    // }

    this.globalScope = this.createScope(this.ast);
    // @ts-ignore
    this.globalObject = this.globalScope.object;
    const parsedPolyfill = acorn.parse(this.polyfills.join('\n'), DEFAULT_OPTIONS)

    // this.stripLocations(parsedPolyfill);

    this.stateStack = [new State(parsedPolyfill, this.globalScope)];
    debugger
    this.run();

    this.stateStack = [new State(this.ast, this.globalScope)];
  }

  createScope(ast: Node): object {

    return {object: 1};
  }

  // stripLocations(ast: Node) {
  //
  // }

  step() {
    if (!this.stateStack.length) {
      return;
    }

    const state = this.stateStack[this.stateStack.length - 1];
    let start = state.node.start;
    let end = state.node.end;
    const startTime = Date.now();
    do {
      const type: string = state.node['type'];
      if ((type === 'Program' && state.done) || this.paused) {
        return;
      }
      let nextState;
      try {
        console.log('LJP: %c%s >>> ', 'background:#ff9912;color:white;font-size:20px', 'type', type);
        debugger
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

  }
}

export default Interpreter;
