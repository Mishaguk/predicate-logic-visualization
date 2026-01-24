import type { CstNode, ICstVisitor, IToken } from "chevrotain";

export interface PredicatesCstNode extends CstNode {
  name: "predicates";
  children: PredicatesCstChildren;
}

export type PredicatesCstChildren = {
  statement?: StatementCstNode[];
};

export interface StatementCstNode extends CstNode {
  name: "statement";
  children: StatementCstChildren;
}

export type StatementCstChildren = {
  predicate: PredicateCstNode[];
  Semicolon?: IToken[];
};

export interface PredicateCstNode extends CstNode {
  name: "predicate";
  children: PredicateCstChildren;
}

export type PredicateCstChildren = {
  Identifier: IToken[];
  LBracket: IToken[];
  argument: ArgumentCstNode[];
  Comma: IToken[];
  RBracket: IToken[];
};

export interface ArgumentCstNode extends CstNode {
  name: "argument";
  children: ArgumentCstChildren;
}

export type ArgumentCstChildren = {
  Identifier: IToken[];
};

export interface ICstNodeVisitor<IN, OUT> extends ICstVisitor<IN, OUT> {
  predicates(children: PredicatesCstChildren, param?: IN): OUT;
  statement(children: StatementCstChildren, param?: IN): OUT;
  predicate(children: PredicateCstChildren, param?: IN): OUT;
  argument(children: ArgumentCstChildren, param?: IN): OUT;
}
