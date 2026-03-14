import { CstParser, defaultParserErrorProvider, tokenLabel } from "chevrotain";

import {
  allTokens,
  Identifier,
  LParen,
  RParen,
  Comma,
  And,
  Not,
  Or,
  Variable,
  Implies,
  Iff,
  ForAll,
  Exists,
  Colon,
} from "./query.tokens";

export class QueryParser extends CstParser {
  constructor() {
    super(allTokens, {
      errorMessageProvider: {
        ...defaultParserErrorProvider,

        buildNotAllInputParsedMessage: ({ firstRedundant }) =>
          `Syntax Error: unexpected '${firstRedundant.image}'`,

        buildMismatchTokenMessage: ({ expected }) =>
          `Parsing error: '${tokenLabel(expected)}' expected`,
      },
    });

    this.performSelfAnalysis();
  }

  // Entry
  public query = this.RULE("query", () => {
    this.SUBRULE(this.orExpr);
  });

  // orExpr := andExpr (Or andExpr)*
  private orExpr = this.RULE("orExpr", () => {
    this.SUBRULE(this.andExpr);
    this.MANY(() => {
      this.CONSUME(Or);
      this.SUBRULE2(this.andExpr);
    });
  });

  // andExpr := unaryExpr (And unaryExpr)*
  private andExpr = this.RULE("andExpr", () => {
    this.SUBRULE(this.impliesExpr);
    this.MANY(() => {
      this.CONSUME(And);
      this.SUBRULE2(this.impliesExpr);
    });
  });

  // impliesExpr := IffExpr (Implies impliesExpr)?   // right-assoc
  private impliesExpr = this.RULE("impliesExpr", () => {
    this.SUBRULE(this.IffExpr);
    this.OPTION(() => {
      this.CONSUME(Implies);
      this.SUBRULE2(this.impliesExpr);
    });
  });
  private IffExpr = this.RULE("IffExpr", () => {
    this.SUBRULE(this.unaryExpr);
    this.OPTION(() => {
      this.CONSUME(Iff);
      this.SUBRULE2(this.unaryExpr);
    });
  });

  // unaryExpr := (Not unaryExpr) | primary
  private unaryExpr = this.RULE("unaryExpr", () => {
    this.OR([
      {
        ALT: () => {
          this.CONSUME(Not);
          this.SUBRULE(this.unaryExpr);
        },
      },
      { ALT: () => this.SUBRULE(this.quantifiedExpr) },
      { ALT: () => this.SUBRULE(this.primary) },
    ]);
  });

  private quantifiedExpr = this.RULE("quantifiedExpr", () => {
    this.OR([
      { ALT: () => this.CONSUME(ForAll) },
      { ALT: () => this.CONSUME(Exists) },
    ]);

    this.SUBRULE(this.quantVariables);

    this.CONSUME(Colon);
    this.SUBRULE(this.orExpr);
  });

  private quantVariables = this.RULE("quantVariables", () => {
    this.CONSUME(Variable);
    this.MANY(() => {
      this.CONSUME(Comma);
      this.CONSUME2(Variable);
    });
  });

  // primary := atom | "(" orExpr ")"
  private primary = this.RULE("primary", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.atom) },
      {
        ALT: () => {
          this.CONSUME(LParen);
          this.SUBRULE(this.orExpr);
          this.CONSUME(RParen);
        },
      },
    ]);
  });

  private atom = this.RULE("atom", () => {
    this.CONSUME(Identifier); // predicate name
    this.CONSUME(LParen);

    this.SUBRULE(this.argument);

    this.MANY(() => {
      this.CONSUME(Comma);
      this.SUBRULE2(this.argument);
    });

    this.CONSUME(RParen);
  });

  private argument = this.RULE("argument", () => {
    this.OR([
      { ALT: () => this.CONSUME(Variable) },
      { ALT: () => this.CONSUME(Identifier) },
    ]);
  });
}
