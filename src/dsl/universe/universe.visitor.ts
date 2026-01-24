import type { UniverseCstChildren } from "../types/universe.cst";
import { UniverseParser } from "./universe.parser";

const parser = new UniverseParser();
const BaseUniverseVisitor = parser.getBaseCstVisitorConstructor();

export class UniverseVisitor extends BaseUniverseVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  universe(ctx: UniverseCstChildren) {
    return new Set(ctx.Identifier.map((token) => token.image) ?? []);
  }
}
