import { createToken, Lexer } from "chevrotain";

export const LBracket = createToken({ name: "LBracket", pattern: "(" });
export const RBracket = createToken({ name: "RBracket", pattern: ")" });
export const Comma = createToken({ name: "Comma", pattern: "," });
export const Semicolon = createToken({ name: "Semicolon", pattern: ";" });

export const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z_][a-zA-Z0-9_]*/,
});

LBracket.LABEL = "'('";
RBracket.LABEL = "')'";
Comma.LABEL = "','";
Semicolon.LABEL = "';'";
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

export const allTokens = [
  LBracket,
  RBracket,
  Comma,
  Semicolon,
  Identifier,
  NewLine,
  WhiteSpace,
];

export const PredicatesLexer = new Lexer(allTokens);
