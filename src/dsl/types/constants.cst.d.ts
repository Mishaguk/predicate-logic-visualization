import type { CstNode, ICstVisitor, IToken } from "chevrotain";

export interface ConstantsCstNode extends CstNode {
  name: "constants";
  children: ConstantsCstChildren;
}

export type ConstantsCstChildren = {
  mapping: MappingCstNode[];
};

export interface MappingCstNode extends CstNode {
  name: "mapping";
  children: MappingCstChildren;
}

export type MappingCstChildren = {
  Identifier: IToken[];
  UniverseElement: IToken[];
  Arrow: IToken[];
  Semicolon?: IToken[];
};

export interface ICstNodeVisitor<IN, OUT> extends ICstVisitor<IN, OUT> {
  constants(children: ConstantsCstChildren, param?: IN): OUT;
  mapping(children: MappingCstChildren, param?: IN): OUT;
}
