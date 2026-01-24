import { UniverseLexer } from "./universe.tokens";
import { UniverseParser } from "./universe.parser";
import type { UniverseAst } from "../types";
import { UniverseVisitor } from "./universe.visitor";

const parser = new UniverseParser();
// export const productions: Record<string, Rule> = parser.getGAstProductions();
// const dts = generateCstDts(productions);
// console.log(dts);
const visitor = new UniverseVisitor();

export function parseUniverse(input: string): UniverseAst {
  if (!input.trim()) {
    return new Set();
  }
  const lexResult = UniverseLexer.tokenize(input);

  if (lexResult.errors.length) {
    throw new Error("Lexing error");
  }

  parser.input = lexResult.tokens;

  const cst = parser.universe();

  if (parser.errors.length) {
    console.log(parser);
  }

  // CST → Set<string>
  return visitor.visit(cst);
}
