import * as acorn from "acorn";
import {Options} from "acorn";

function parseCode(code: string, options: Options = {ecmaVersion: 2019}) {
  const parsedCode = acorn.parse(code, options);
}

export default parseCode;
