import type { Predicate } from "../../types";
import { PredicatesParser } from "./predicates.parser";
import { PredicatesLexer } from "./predicates.tokens";
import { PredicatesVisitor } from "./predicates.visitor";
import type { SyntaxError, ParseResult } from "../../types";
import { toParseError } from "../errors";

// const parser = new PredicatesParser();
// const productions = parser.getGAstProductions();
// console.log(generateCstDts(productions));

const parser = new PredicatesParser();
const visitor = new PredicatesVisitor();

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

  return { value: visitor.visit(cst), errors };
}
