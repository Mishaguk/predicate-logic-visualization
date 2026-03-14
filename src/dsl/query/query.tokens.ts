import { createToken, Lexer } from "chevrotain";

/* ========= Delimiters ========= */
export const LParen = createToken({ name: "LParen", pattern: "(" });
export const RParen = createToken({ name: "RParen", pattern: ")" });
export const Comma = createToken({ name: "Comma", pattern: "," });
export const Colon = createToken({ name: "Colon", pattern: /:/ });

/* ========= Quantifiers ========= */

export const ForAll = createToken({
  name: "ForAll",
  pattern: /\u2200|\\forall/i, // ∀
});

export const Exists = createToken({
  name: "Exists",
  pattern: /\u2203|\\exists/i, // ∃
});

/* ========= Logical Operators ========= */

export const And = createToken({
  name: "And",
  pattern: /and|&&|\u2227|\\land/i, // ∧
});

export const Or = createToken({
  name: "Or",
  pattern: /or|\|\||\u2228|\\lor/i, // ∨
});

export const Not = createToken({
  name: "Not",
  pattern: /not|!|\u00AC|\\neg/i, // ¬
});

export const Implies = createToken({
  name: "Implies",
  pattern: /->|\u2192|\\to|\\implies/i, // →
});

export const Iff = createToken({
  name: "Iff",
  pattern: /<->|\u2194|\\leftrightarrow/i, // ↔
});

export const Variable = createToken({
  name: "Variable",
  pattern: /\?[a-zA-Z_][a-zA-Z0-9_]*/,
});

export const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z_][a-zA-Z0-9_]*/,
});

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

LParen.LABEL = "(";
RParen.LABEL = ")";
Comma.LABEL = ",";
And.LABEL = "and";
Or.LABEL = "or";
Not.LABEL = "not";
ForAll.LABEL = "forAll";
Exists.LABEL = "Exists";
Implies.LABEL = "Implies";
Iff.LABEL = "Iff";
Variable.LABEL = "variable";
Identifier.LABEL = "identifier";
Colon.LABEL = "colon";

export const allTokens = [
  WhiteSpace,

  ForAll,
  Exists,

  And,
  Or,
  Not,
  Implies,
  Iff,

  LParen,
  RParen,
  Comma,
  Colon,

  Variable,
  Identifier,
];

export const QueryLexer = new Lexer(allTokens);
