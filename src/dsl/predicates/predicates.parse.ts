import type { Predicate } from "../../types";
import { PredicatesParser } from "./predicates.parser";
import { PredicatesLexer } from "./predicates.tokens";
import { PredicatesVisitor } from "./predicates.visitor";
import type { SyntaxError, ParseResult } from "../../types";

// const parser = new PredicatesParser();
// const productions = parser.getGAstProductions();
// console.log(generateCstDts(productions));

const parser = new PredicatesParser();
const visitor = new PredicatesVisitor();

const toParseError = (
  error: unknown,
  source: SyntaxError["source"],
): SyntaxError => {
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

export function parsePredicates(input: string): ParseResult<Predicate[]> {
  if (!input.trim()) {
    return { value: [], errors: [] };
  }

  const lexResult = PredicatesLexer.tokenize(input);
  const errors: SyntaxError[] = [];

  if (lexResult.errors.length) {
    errors.push(
      ...lexResult.errors.map((error) => toParseError(error, "predicates")),
    );
    return { value: null, errors };
  }

  parser.input = lexResult.tokens;

  // Concrete Syntax Tree
  const cst = parser.predicates();

  if (parser.errors.length) {
    errors.push(
      ...parser.errors.map((error) => toParseError(error, "predicates")),
    );
    return { value: null, errors };
  }
  // CST -> AST

  return { value: visitor.visit(cst), errors: [] };
}
