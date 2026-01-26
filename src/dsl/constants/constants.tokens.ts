import { createToken, Lexer } from "chevrotain";

export const Arrow = createToken({
  name: "Arrow",
  pattern: "->",
});

export const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z_][a-zA-Z0-9_]*/,
});

Arrow.LABEL = "'->'";
Identifier.LABEL = "identifier";

export const NewLine = createToken({
  name: "NewLine",
  pattern: /\r?\n/,
  group: Lexer.SKIPPED,
});

export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /[ \t]+/,
  group: Lexer.SKIPPED,
});

export const allTokens = [WhiteSpace, NewLine, Arrow, Identifier];

export const ConstantsLexer = new Lexer(allTokens);
