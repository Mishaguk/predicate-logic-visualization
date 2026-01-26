import { createToken, Lexer } from "chevrotain";

export const LCurly = createToken({ name: "LCurly", pattern: "{" });
export const RCurly = createToken({ name: "RCurly", pattern: "}" });
export const Comma = createToken({ name: "Comma", pattern: "," });

export const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z_][a-zA-Z0-9_]*/,
});

LCurly.LABEL = "'{'";
RCurly.LABEL = "'}'";
Comma.LABEL = "','";
Identifier.LABEL = "identifier";

export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

export const allTokens = [WhiteSpace, LCurly, RCurly, Comma, Identifier];

export const UniverseLexer = new Lexer(allTokens);
