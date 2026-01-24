import type {
  ConstantsCstChildren,
  MappingCstChildren,
} from "../types/constants.cst";
import { ConstantsParser } from "./constants.parser";

const parser = new ConstantsParser();
const BaseConstantsVisitor = parser.getBaseCstVisitorConstructor();

export class ConstantsVisitor extends BaseConstantsVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  constants(ctx: ConstantsCstChildren): Map<string, string> {
    return new Map(ctx.mapping.map((constant) => this.visit(constant)));
  }

  mapping(ctx: MappingCstChildren): [string, string] {
    return [ctx.Identifier[0].image, ctx.Identifier[1].image];
  }
}
