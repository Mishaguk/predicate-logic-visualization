import type { Atom, QueryExpression, QueryTerm } from "../../types";
import type {
  AndExprCstChildren,
  ArgumentCstChildren,
  AtomCstChildren,
  IffExprCstChildren,
  ImpliesExprCstChildren,
  OrExprCstChildren,
  PrimaryCstChildren,
  QuantifiedExprCstChildren,
  QuantVariablesCstChildren,
  QueryCstChildren,
  UnaryExprCstChildren,
} from "../types/query.cst";
import { QueryParser } from "./query.parser";

const parser = new QueryParser();
const BaseQueryVisitor = parser.getBaseCstVisitorConstructor();

export class QueryVisitor extends BaseQueryVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  query(ctx: QueryCstChildren): QueryExpression {
    return this.visit(ctx.orExpr[0]);
  }

  orExpr(ctx: OrExprCstChildren): QueryExpression {
    let expr = this.visit(ctx.andExpr[0]) as QueryExpression;
    for (let i = 1; i < ctx.andExpr.length; i++) {
      expr = {
        kind: "Or",
        left: expr,
        right: this.visit(ctx.andExpr[i]) as QueryExpression,
      };
    }
    return expr;
  }

  andExpr(ctx: AndExprCstChildren): QueryExpression {
    let expr = this.visit(ctx.impliesExpr[0]) as QueryExpression;
    for (let i = 1; i < ctx.impliesExpr.length; i++) {
      expr = {
        kind: "And",
        left: expr,
        right: this.visit(ctx.impliesExpr[i]) as QueryExpression,
      };
    }
    return expr;
  }

  impliesExpr(ctx: ImpliesExprCstChildren): QueryExpression {
    let expr = this.visit(ctx.IffExpr[0]) as QueryExpression;

    for (let i = 1; i < ctx.IffExpr.length; i++) {
      expr = {
        kind: "Implies",
        left: expr,
        right: this.visit(ctx.IffExpr[i]) as QueryExpression,
      };
    }
    return expr;
  }

  IffExpr(ctx: IffExprCstChildren): QueryExpression {
    const left = this.visit(ctx.unaryExpr[0]) as QueryExpression;
    if (!ctx.Iff) return left;

    const right = this.visit(ctx.unaryExpr[1]) as QueryExpression;
    return { kind: "Iff", left, right };
  }

  unaryExpr(ctx: UnaryExprCstChildren): QueryExpression {
    if (ctx.Not?.length) {
      return {
        kind: "Not",
        operand: this.visit(ctx.unaryExpr![0]) as QueryExpression,
      };
    }

    if (ctx.quantifiedExpr?.length) {
      return this.visit(ctx.quantifiedExpr[0]);
    }

    if (ctx.primary?.length) {
      return this.visit(ctx.primary[0]);
    }

    throw new Error("Invalid unary expression.");
  }

  quantifiedExpr(ctx: QuantifiedExprCstChildren): QueryExpression {
    const quantifier = ctx.ForAll?.length
      ? "ForAll"
      : ctx.Exists?.length
        ? "Exists"
        : (() => {
            throw new Error("Quantifier token missing.");
          })();

    const vars = ctx.quantVariables.flatMap((qv) => this.visit(qv)) as {
      kind: "Var";
      name: string;
    }[];

    const body = this.visit(ctx.orExpr[0]) as QueryExpression;

    return {
      kind: "Quantifier",
      quantifier,
      vars,
      body,
    };
  }

  quantVariables(ctx: QuantVariablesCstChildren): {
    kind: "Var";
    name: string;
  }[] {
    return ctx.Variable.map((t) => ({ kind: "Var", name: t.image }));
  }
  primary(ctx: PrimaryCstChildren): QueryExpression {
    if (ctx.atom?.length) {
      return this.visit(ctx.atom[0]);
    }

    if (ctx.orExpr?.length) {
      return this.visit(ctx.orExpr[0]);
    }

    throw new Error("Invalid primary expression.");
  }

  atom(ctx: AtomCstChildren): Atom {
    const name = ctx.Identifier[0].image;
    const args = ctx.argument.map((a) => this.visit(a));
    return { kind: "Atom", name, args };
  }

  argument(ctx: ArgumentCstChildren): QueryTerm | null {
    if (ctx.Variable?.length) {
      return { kind: "Var", name: ctx.Variable[0].image };
    } else if (ctx.Identifier?.length) {
      return { kind: "Const", name: ctx.Identifier[0].image };
    }

    return null;
  }
}
