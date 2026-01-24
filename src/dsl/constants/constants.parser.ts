import { CstParser } from "chevrotain";
import { allTokens, Arrow, Identifier } from "./constants.tokens";

export class ConstantsParser extends CstParser {
  constructor() {
    super(allTokens);
    this.performSelfAnalysis();
  }

  public constants = this.RULE("constants", () => {
    this.AT_LEAST_ONE(() => {
      this.SUBRULE(this.mapping);
    });
  });

  private mapping = this.RULE("mapping", () => {
    this.CONSUME(Identifier);
    this.CONSUME(Arrow);
    this.CONSUME2(Identifier);
  });
}
