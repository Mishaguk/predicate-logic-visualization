import type { Predicate } from "../../types";
import type {
  ArgumentCstChildren,
  PredicateCstChildren,
  PredicatesCstChildren,
  StatementCstChildren,
} from "../types/predicates.cst";
import { PredicatesParser } from "./predicates.parser";

const parser = new PredicatesParser();
const BaseUniverseVisitor = parser.getBaseCstVisitorConstructor();

export class PredicatesVisitor extends BaseUniverseVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  predicates(ctx: PredicatesCstChildren): Predicate[] {
    return ctx.statement?.map((statement) => this.visit(statement)) ?? [];
  }

  statement(ctx: StatementCstChildren) {
    return this.visit(ctx.predicate[0]);
  }

  predicate(ctx: PredicateCstChildren): Predicate {
    const name = ctx.Identifier[0].image;
    const args = ctx.argument.map((a) => this.visit(a));
    return { name, args, universeArgs: [] };
  }
  argument(ctx: ArgumentCstChildren) {
    return ctx.Identifier[0].image;
  }
}
