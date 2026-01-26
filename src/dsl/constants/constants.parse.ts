import { ConstantsLexer } from "./constants.tokens";
import { ConstantsParser } from "./constants.parser";
import { ConstantsVisitor } from "./constants.visitor";
import type { ParseError, ParseResult } from "../../types";

const parser = new ConstantsParser();
const visitor = new ConstantsVisitor();

const toParseError = (
  error: unknown,
  source: ParseError["source"],
): ParseError => {
  const anyError = error as {
    message?: string;
    line?: number;
    column?: number;
    token?: {
      startLine?: number;
      startColumn?: number;
      endLine?: number;
      endColumn?: number;
    };
  };

  const line = anyError?.line ?? anyError?.token?.startLine ?? 1;
  const column = anyError?.column ?? anyError?.token?.startColumn ?? 1;

  return {
    source,
    message: anyError?.message ?? "Parsing error",
    line,
    column,
    endLine: anyError?.token?.endLine ?? line,
    endColumn: anyError?.token?.endColumn ?? column + 1,
  };
};

export function parseConstants(input: string): ParseResult<Map<string, string>> {
  if (!input.trim()) {
    return { value: new Map(), errors: [] };
  }

  const lexResult = ConstantsLexer.tokenize(input);
  const errors: ParseError[] = [];

  if (lexResult.errors.length) {
    errors.push(
      ...lexResult.errors.map((error) => toParseError(error, "constants")),
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

  return { value: visitor.visit(cst), errors: [] };
}
