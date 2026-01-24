import { ConstantsLexer } from "./constants.tokens";
import { ConstantsParser } from "./constants.parser";
import { ConstantsVisitor } from "./constants.visitor";

const parser = new ConstantsParser();
const visitor = new ConstantsVisitor();

export function parseConstants(input: string): Map<string, string> {
  if (!input.trim()) {
    return new Map();
  }

  const lexResult = ConstantsLexer.tokenize(input);

  if (lexResult.errors.length) {
    throw lexResult.errors[0];
  }

  parser.input = lexResult.tokens;

  const cst = parser.constants();

  if (parser.errors.length) {
    throw parser.errors[0];
  }

  return visitor.visit(cst);
}
