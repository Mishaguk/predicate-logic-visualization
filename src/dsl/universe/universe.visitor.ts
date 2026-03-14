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
    const assignments = new Map<string, string[]>();

    for (const statementNode of ctx.statement ?? []) {
      const symbolsFromStatement = [...this.visit(statementNode)];

      assignments.set(
        statementNode.children.Identifier[0].image,
        symbolsFromStatement,
      );
    }

    return assignments;
  }

  statement(ctx: StatementCstChildren) {
    return this.visit(ctx.expression);
  }

  expression(ctx: ExpressionCstChildren): Set<string> {
    const identifierTokens = ctx.Identifier ?? [];
    return new Set(identifierTokens.map((token) => token.image));
  }
}
