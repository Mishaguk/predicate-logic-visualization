import type {
  ExpressionCstChildren,
  StatementCstChildren,
  UniverseCstChildren,
} from "../types/universe.cst";
import { UniverseParser } from "./universe.parser";

const parser = new UniverseParser();
const BaseUniverseVisitor = parser.getBaseCstVisitorConstructor();

export class UniverseVisitor extends BaseUniverseVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  universe(ctx: UniverseCstChildren) {
    const aggregatedSymbols = new Set<string>();

    for (const statementNode of ctx.statement ?? []) {
      const symbolsFromStatement = this.visit(statementNode) as Set<string>;

      for (const symbol of symbolsFromStatement) {
        aggregatedSymbols.add(symbol);
      }
    }

    return aggregatedSymbols;
  }

  statement(ctx: StatementCstChildren) {
    return this.visit(ctx.expression[0]) as Set<string>;
  }

  expression(ctx: ExpressionCstChildren) {
    const identifierTokens = ctx.Identifier ?? [];
    return new Set(identifierTokens.map((token) => token.image));
  }
}
