import { QueryParser } from "./query.parser";
import type { ParseResult, QueryExpression, SyntaxError } from "../../types";
import { QueryLexer } from "./query.tokens";
import { toLexError, toParseError } from "../errors";
import { QueryVisitor } from "./query.visitor";

// const parser = new QueryParser();

const parser = new QueryParser();
const visitor = new QueryVisitor();

// const productions = parser.getGAstProductions();
// console.log(generateCstDts(productions));

export function parseQuery(input: string): ParseResult<QueryExpression> {
  if (!input.trim()) {
    return { value: null, errors: [] };
  }

  const lexResult = QueryLexer.tokenize(input);
  const errors: SyntaxError[] = [];

  if (lexResult.errors.length) {
    errors.push(...lexResult.errors.map((error) => toLexError(error, "query")));
    return { value: null, errors };
  }

  parser.input = lexResult.tokens;

  const cst = parser.query();

  if (parser.errors.length) {
    errors.push(...parser.errors.map((error) => toParseError(error, "query")));
    return { value: null, errors };
  }

  //CST -> AST
  return { value: visitor.visit(cst), errors };
}
