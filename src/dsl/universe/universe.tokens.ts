import { createToken, defaultLexerErrorProvider, Lexer } from "chevrotain";

export const LCurly = createToken({ name: "LCurly", pattern: "{" });
export const RCurly = createToken({ name: "RCurly", pattern: "}" });
export const Comma = createToken({ name: "Comma", pattern: "," });
export const Iff = createToken({ name: "Iff", pattern: "=" });
export const Semicolon = createToken({ name: "Semicolon", pattern: ";" });

export const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z0-9_]+/,
});

LCurly.LABEL = "{";
RCurly.LABEL = "}";
Comma.LABEL = ",";
Iff.LABEL = "=";
Identifier.LABEL = "identifier";
Semicolon.LABEL = ";";

export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

export const allTokens = [
  WhiteSpace,
  LCurly,
  RCurly,
  Comma,
  Iff,
  Identifier,
  Semicolon,
];

export const UniverseLexer = new Lexer(allTokens, {
  errorMessageProvider: {
    ...defaultLexerErrorProvider,
    buildUnexpectedCharactersMessage: (
      fullText,
      startOffset,
      length,
      line,
      column,
    ) => {
      const chunk = fullText.slice(startOffset, startOffset + length);
      return `Lexing error: unexpected "${chunk}" at ${line}:${column}`;
    },
  },
});
