import {
  CstParser,
  defaultParserErrorProvider,
  EOF,
  tokenLabel,
} from "chevrotain";
import {
  allTokens,
  Comma,
  Iff,
  Identifier,
  LCurly,
  RCurly,
  Semicolon,
} from "./universe.tokens";

export class UniverseParser extends CstParser {
  constructor() {
    super(allTokens, {
      errorMessageProvider: {
        ...defaultParserErrorProvider,
        buildNotAllInputParsedMessage: ({ firstRedundant }) =>
          `Syntax Error: expected end of statement but found '${firstRedundant.image}'`,

        buildMismatchTokenMessage: ({ expected }) =>
          `Parsing error: ' ${tokenLabel(expected)} ' expected`,
      },
    });
    this.performSelfAnalysis();
  }

  public universe = this.RULE("universe", () => {
    this.MANY(() => this.SUBRULE(this.statement));
    this.CONSUME(EOF);
  });

  private statement = this.RULE("statement", () => {
    this.CONSUME(Identifier);
    this.CONSUME(Iff);
    this.SUBRULE(this.expression);
    this.CONSUME(Semicolon);
  });

  private expression = this.RULE("expression", () => {
    this.CONSUME(LCurly);

    this.OPTION(() => {
      this.AT_LEAST_ONE_SEP({
        SEP: Comma,
        DEF: () => this.CONSUME(Identifier),
      });
    });

    this.CONSUME(RCurly);
  });
}
