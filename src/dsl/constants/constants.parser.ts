import { CstParser, defaultParserErrorProvider, tokenLabel } from "chevrotain";
import {
  allTokens,
  Arrow,
  Identifier,
  Semicolon,
  UniverseElement,
} from "./constants.tokens";

export class ConstantsParser extends CstParser {
  constructor() {
    super(allTokens, {
      errorMessageProvider: {
        ...defaultParserErrorProvider,
        buildNotAllInputParsedMessage: ({ firstRedundant }) =>
          `Syntax Error: expected end of statement but found '${firstRedundant.image}'`,
        buildMismatchTokenMessage: ({ expected }) =>
          `Parsing error: ${tokenLabel(expected)} expected`,
      },
    });
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
    this.CONSUME(UniverseElement);
    this.OPTION(() => {
      this.CONSUME(Semicolon);
    });
  });
}
