import { UniverseLexer } from "./universe.tokens";
import { UniverseParser } from "./universe.parser";
import type { UniverseAst } from "../types";
import { UniverseVisitor } from "./universe.visitor";
import type { ParseError, ParseResult } from "../../types";

const parser = new UniverseParser();
// export const productions: Record<string, Rule> = parser.getGAstProductions();
// const dts = generateCstDts(productions);
// console.log(dts);
const visitor = new UniverseVisitor();

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
    previousToken?: {
      startLine?: number;
      startColumn?: number;
      endLine?: number;
      endColumn?: number;
    };
  };

  const token = anyError?.token;
  const previousToken = anyError?.previousToken;
  const hasTokenPos =
    Number.isFinite(token?.startLine) && Number.isFinite(token?.startColumn);
  const posSource = hasTokenPos ? token : previousToken;

  const line = anyError?.line ?? posSource?.startLine ?? 1;
  const column = anyError?.column ?? posSource?.startColumn ?? 1;

  return {
    source,
    message: anyError?.message ?? "Parsing error",
    line,
    column,
    endLine: posSource?.endLine ?? line,
    endColumn: posSource?.endColumn ?? column + 1,
  };
};

export function parseUniverse(input: string): ParseResult<UniverseAst> {
  if (!input.trim()) {
    return { value: new Set(), errors: [] };
  }

  const lexResult = UniverseLexer.tokenize(input);
  const errors: ParseError[] = [];

  if (lexResult.errors.length) {
    errors.push(
      ...lexResult.errors.map((error) => toParseError(error, "universe")),
    );
    return { value: null, errors };
  }

  parser.input = lexResult.tokens;
  const cst = parser.universe();

  if (parser.errors.length) {
    console.log(parser.errors);
    errors.push(
      ...parser.errors.map((error) => toParseError(error, "universe")),
    );
    return { value: null, errors };
  }

  // CST -> Set<string>
  return { value: visitor.visit(cst), errors: [] };
}
