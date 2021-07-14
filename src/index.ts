import * as acorn from "acorn";
import {Node, Options} from "acorn";

const DEFAULT_OPTIONS: Options = {ecmaVersion: 2019}

class State {

}

class Interpreter {
  private code: string;
  private parsedCode: Node | undefined;
  private ast: Node | undefined;
  private options: Options;
  private paused: boolean = false;
  private polyfills: Array<Function> = [];
  private stepFunctions: Map<string, Function> = new Map<string, Function>();
  private globalScope: object;
  private globalObject: object;

  constructor(code: string, options: Options = DEFAULT_OPTIONS) {
    this.code = code;
    this.options = options;

    this.parsedCode = acorn.parse(this.code, this.options);
    this.ast = acorn.parse(this.code, this.options);

    for (const prop in this) {
      const fun = this[prop];
      let methodName;
      if (typeof fun === 'function' && (methodName = prop.match(/^step([A-Z]\w*)$/))) {
        this.stepFunctions.set(methodName[1], fun.bind(this));
      }
    }

    this.globalScope = this.createScope(this.ast);
    // @ts-ignore
    this.globalObject = this.globalScope.object;
    const parsedPolyfill = acorn.parse(this.polyfills.join('\n'), DEFAULT_OPTIONS)
  }

  createScope(ast: Node) : object {

    return {object: 1};
  }

  stripLocations(ast: Node) {

  }

  stepA() {

  }
}

export default Interpreter;
