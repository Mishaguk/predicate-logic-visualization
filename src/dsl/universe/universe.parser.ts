import { CstParser, defaultParserErrorProvider, tokenLabel } from "chevrotain";
import {
  allTokens,
  Comma,
  Identifier,
  LCurly,
  RCurly,
} from "./universe.tokens";

export class UniverseParser extends CstParser {
  constructor() {
    super(allTokens, {
      errorMessageProvider: {
        ...defaultParserErrorProvider,
        buildMismatchTokenMessage: ({ expected }) =>
          `Parsing error: ${tokenLabel(expected)} expected`,
      },
    });
    this.performSelfAnalysis();
  }

  public universe = this.RULE("universe", () => {
    this.CONSUME(LCurly);
    this.AT_LEAST_ONE_SEP({
      SEP: Comma,
      DEF: () => {
        this.CONSUME(Identifier);
      },
    });
    this.CONSUME(RCurly);
  });
}
