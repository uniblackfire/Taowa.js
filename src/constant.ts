import {Options} from "acorn";

export const DEFAULT_OPTIONS: Options = {ecmaVersion: 2019};

export enum Completion {
  NORMAL,
  BREAK,
  CONTINUE,
  RETURN,
  THROW,
}
