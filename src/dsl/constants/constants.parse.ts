import { ConstantsLexer } from "./constants.tokens";
import { ConstantsParser } from "./constants.parser";
import { ConstantsVisitor } from "./constants.visitor";
import type { SyntaxError, ParseResult } from "../../types";
import { toLexError, toParseError } from "../errors";

const parser = new ConstantsParser();
const visitor = new ConstantsVisitor();

export function parseConstants(
  input: string,
): ParseResult<Map<string, string>> {
  if (!input.trim()) {
    return { value: new Map(), errors: [] };
  }

  const lexResult = ConstantsLexer.tokenize(input);
  const errors: SyntaxError[] = [];

  if (lexResult.errors.length) {
    errors.push(
      ...lexResult.errors.map((error) => toLexError(error, "constants")),
    );
    return { value: null, errors };
  }

  parser.input = lexResult.tokens;

  const cst = parser.constants();

  if (parser.errors.length) {
    errors.push(
      ...parser.errors.map((error) => toParseError(error, "constants")),
    );
    return { value: null, errors };
  }

  return { value: visitor.visit(cst), errors };
}
