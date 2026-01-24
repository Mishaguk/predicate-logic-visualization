import type { Predicate } from "../../types";
import { PredicatesParser } from "./predicates.parser";
import { PredicatesLexer } from "./predicates.tokens";
import { PredicatesVisitor } from "./predicates.visitor";

// const parser = new PredicatesParser();
// const productions = parser.getGAstProductions();
// console.log(generateCstDts(productions));

const parser = new PredicatesParser();
const visitor = new PredicatesVisitor();

export function parsePredicates(input: string): Predicate[] {
  if (!input.trim()) {
    return [];
  }

  const lexResult = PredicatesLexer.tokenize(input);

  if (lexResult.errors.length) {
    throw lexResult.errors[0];
  }

  parser.input = lexResult.tokens;

  // Concrete Syntax Tree
  const cst = parser.predicates();

  if (parser.errors.length) {
    console.log(parser.errors);

    throw parser.errors[0];
  }
  // CST → AST

  return visitor.visit(cst);
}
