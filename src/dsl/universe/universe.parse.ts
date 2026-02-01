import { UniverseLexer } from "./universe.tokens";
import { UniverseParser } from "./universe.parser";
import type { UniverseAst } from "../types";
import { UniverseVisitor } from "./universe.visitor";
import type { SyntaxError, ParseResult } from "../../types";
import { toLexError, toParseError } from "../errors";

const parser = new UniverseParser();

// GENERATE TYPES FOR CREATED DSL
// export const productions: Record<string, Rule> = parser.getGAstProductions();
// const dts = generateCstDts(productions);
// console.log(dts);
const visitor = new UniverseVisitor();

export function parseUniverse(input: string): ParseResult<UniverseAst> {
  if (!input.trim()) {
    return { value: new Set(), errors: [] };
  }

  const lexResult = UniverseLexer.tokenize(input);
  const errors: SyntaxError[] = [];

  if (lexResult.errors.length) {
    console.log(lexResult.errors);
    errors.push(
      ...lexResult.errors.map((error) => toLexError(error, "universe")),
    );
    return { value: null, errors };
  }

  parser.input = lexResult.tokens;
  const cst = parser.universe();

  if (parser.errors.length) {
    errors.push(
      ...parser.errors.map((error) => toParseError(error, "universe")),
    );
    return { value: null, errors };
  }

  // CST -> Set<string>
  console.log(visitor.visit(cst));

  return { value: visitor.visit(cst), errors };
}
