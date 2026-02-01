import { type SyntaxError } from "../types";

export const toParseError = (
  error: unknown,
  source: SyntaxError["source"],
): SyntaxError => {
  const anyError = error as {
    message?: string;
    line?: number;
    column?: number;
    previousToken?: {
      startLine?: number;
      startColumn?: number;
      endLine?: number;
      endColumn?: number;
    };
  };

  const previousToken = anyError?.previousToken;

  const line = anyError?.line ?? previousToken?.startLine ?? 1;
  const column = anyError?.column ?? previousToken?.startColumn ?? 1;

  return {
    source,
    message: anyError?.message ?? "Parsing error",
    line,
    column,
    endLine: previousToken?.endLine ?? line,
    endColumn: previousToken?.endColumn ?? column + 1,
    kind: "parse",
  };
};

export const toLexError = (
  error: unknown,
  source: SyntaxError["source"],
): SyntaxError => {
  const anyError = error as {
    message?: string;
    line?: number;
    column?: number;
    length?: number;
    offset: number;
  };

  return {
    source,
    message: anyError.message ?? "Lexing error",
    line: anyError.line ?? 1,
    column: anyError.column ?? 1,
    kind: "lex",
  };
};
