import { createToken, Lexer } from "chevrotain";

export const Arrow = createToken({
  name: "Arrow",
  pattern: "->",
});

export const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z_][a-zA-Z0-9_]*/,
});

export const UniverseElement = createToken({
  name: "UniverseElement",
  pattern: /[a-zA-Z0-9_]+/,
  categories: Identifier,
});
export const Semicolon = createToken({ name: "Semicolon", pattern: ";" });

Arrow.LABEL = "'->'";
Identifier.LABEL = "identifier";
UniverseElement.LABEL = "universe element";
Semicolon.LABEL = "';'";

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
  WhiteSpace,
  NewLine,
  Arrow,
  UniverseElement,
  Identifier,
  Semicolon,
];

export const ConstantsLexer = new Lexer(allTokens);
