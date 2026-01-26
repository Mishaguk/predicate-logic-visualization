import { CstParser, defaultParserErrorProvider, tokenLabel } from "chevrotain";
import {
  allTokens,
  Comma,
  Identifier,
  LBracket,
  RBracket,
  Semicolon,
} from "./predicates.tokens";

export class PredicatesParser extends CstParser {
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

  public predicates = this.RULE("predicates", () => {
    this.MANY(() => {
      this.SUBRULE(this.statement);
    });
  });

  private statement = this.RULE("statement", () => {
    this.SUBRULE(this.predicate);
    this.OPTION(() => {
      this.CONSUME(Semicolon);
    });
  });

  private predicate = this.RULE("predicate", () => {
    this.CONSUME(Identifier);
    this.CONSUME(LBracket);
    this.SUBRULE(this.argument);
    this.OPTION(() => {
      this.CONSUME(Comma);
      this.SUBRULE2(this.argument);
    });
    this.CONSUME(RBracket);
  });

  private argument = this.RULE("argument", () => {
    this.CONSUME(Identifier);
  });
}
