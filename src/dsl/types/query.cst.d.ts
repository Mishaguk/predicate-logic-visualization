import type { CstNode, ICstVisitor, IToken } from "chevrotain";

export interface QueryCstNode extends CstNode {
  name: "query";
  children: QueryCstChildren;
}

export type QueryCstChildren = {
  orExpr: OrExprCstNode[];
};

export interface OrExprCstNode extends CstNode {
  name: "orExpr";
  children: OrExprCstChildren;
}

export type OrExprCstChildren = {
  andExpr: AndExprCstNode[];
  Or?: IToken[];
};

export interface AndExprCstNode extends CstNode {
  name: "andExpr";
  children: AndExprCstChildren;
}

export type AndExprCstChildren = {
  impliesExpr: ImpliesExprCstNode[];
  And?: IToken[];
};

export interface ImpliesExprCstNode extends CstNode {
  name: "impliesExpr";
  children: ImpliesExprCstChildren;
}

export type ImpliesExprCstChildren = {
  IffExpr: IffExprCstNode[];
  Implies?: IToken[];
  impliesExpr?: ImpliesExprCstNode[];
};

export interface IffExprCstNode extends CstNode {
  name: "IffExpr";
  children: IffExprCstChildren;
}

export type IffExprCstChildren = {
  unaryExpr: UnaryExprCstNode[];
  Iff?: IToken[];
};

export interface UnaryExprCstNode extends CstNode {
  name: "unaryExpr";
  children: UnaryExprCstChildren;
}

export type UnaryExprCstChildren = {
  Not?: IToken[];
  unaryExpr?: UnaryExprCstNode[];
  quantifiedExpr?: QuantifiedExprCstNode[];
  primary?: PrimaryCstNode[];
};

export interface QuantifiedExprCstNode extends CstNode {
  name: "quantifiedExpr";
  children: QuantifiedExprCstChildren;
}

export type QuantifiedExprCstChildren = {
  ForAll?: IToken[];
  Exists?: IToken[];
  quantVariables: QuantVariablesCstNode[];
  Colon: IToken[];
  orExpr: OrExprCstNode[];
};

export interface QuantVariablesCstNode extends CstNode {
  name: "quantVariables";
  children: QuantVariablesCstChildren;
}

export type QuantVariablesCstChildren = {
  Variable: IToken[];
  Comma?: IToken[];
};

export interface PrimaryCstNode extends CstNode {
  name: "primary";
  children: PrimaryCstChildren;
}

export type PrimaryCstChildren = {
  atom?: AtomCstNode[];
  LParen?: IToken[];
  orExpr?: OrExprCstNode[];
  RParen?: IToken[];
};

export interface AtomCstNode extends CstNode {
  name: "atom";
  children: AtomCstChildren;
}

export type AtomCstChildren = {
  Identifier: IToken[];
  LParen: IToken[];
  argument: ArgumentCstNode[];
  Comma?: IToken[];
  RParen: IToken[];
};

export interface ArgumentCstNode extends CstNode {
  name: "argument";
  children: ArgumentCstChildren;
}

export type ArgumentCstChildren = {
  Variable?: IToken[];
  Identifier?: IToken[];
};

export interface ICstNodeVisitor<IN, OUT> extends ICstVisitor<IN, OUT> {
  query(children: QueryCstChildren, param?: IN): OUT;
  orExpr(children: OrExprCstChildren, param?: IN): OUT;
  andExpr(children: AndExprCstChildren, param?: IN): OUT;
  impliesExpr(children: ImpliesExprCstChildren, param?: IN): OUT;
  IffExpr(children: IffExprCstChildren, param?: IN): OUT;
  unaryExpr(children: UnaryExprCstChildren, param?: IN): OUT;
  quantifiedExpr(children: QuantifiedExprCstChildren, param?: IN): OUT;
  quantVariables(children: QuantVariablesCstChildren, param?: IN): OUT;
  primary(children: PrimaryCstChildren, param?: IN): OUT;
  atom(children: AtomCstChildren, param?: IN): OUT;
  argument(children: ArgumentCstChildren, param?: IN): OUT;
}
