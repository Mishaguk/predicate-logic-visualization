import type { CstNode, ICstVisitor, IToken } from "chevrotain";

export interface UniverseCstNode extends CstNode {
  name: "universe";
  children: UniverseCstChildren;
}

export type UniverseCstChildren = {
  statement?: StatementCstNode[];
};

export interface StatementCstNode extends CstNode {
  name: "statement";
  children: StatementCstChildren;
}

export type StatementCstChildren = {
  Identifier: IToken[];
  Equals: IToken[];
  expression: ExpressionCstNode[];
  Semicolon: IToken[];
};

export interface ExpressionCstNode extends CstNode {
  name: "expression";
  children: ExpressionCstChildren;
}

export type ExpressionCstChildren = {
  LCurly: IToken[];
  Identifier?: IToken[];
  Comma?: IToken[];
  RCurly: IToken[];
};

export interface ICstNodeVisitor<IN, OUT> extends ICstVisitor<IN, OUT> {
  universe(children: UniverseCstChildren, param?: IN): OUT;
  statement(children: StatementCstChildren, param?: IN): OUT;
  expression(children: ExpressionCstChildren, param?: IN): OUT;
}
