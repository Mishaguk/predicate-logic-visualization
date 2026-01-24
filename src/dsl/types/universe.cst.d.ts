import type { CstNode, ICstVisitor, IToken } from "chevrotain";

export interface UniverseCstNode extends CstNode {
  name: "universe";
  children: UniverseCstChildren;
}

export type UniverseCstChildren = {
  LCurly: IToken[];
  Identifier: IToken[];
  Comma?: IToken[];
  RCurly: IToken[];
};

export interface ICstNodeVisitor<IN, OUT> extends ICstVisitor<IN, OUT> {
  universe(children: UniverseCstChildren, param?: IN): OUT;
}
