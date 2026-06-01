import { parsePredicates } from "./predicates.parse";
import {
  PredicatesLexer,
  Identifier,
  LBracket,
  RBracket,
  Semicolon,
} from "./predicates.tokens";

const IDENTIFIER_RE = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

export type AddPredicateReason = "invalid" | "duplicate" | "unresolved";

export type AddPredicateResult =
  | { ok: true; code: string }
  | { ok: false; reason: AddPredicateReason };

export const isValidPredicateName = (name: string): boolean =>
  IDENTIFIER_RE.test(name);

/**
 * Append a `name(arg1, arg2, ...)` predicate to the predicates-editor code.
 * `args` are constant names (already resolved from universe members by the
 * caller). Rejects an invalid name or an exact duplicate of an existing
 * statement. Preserves existing formatting.
 */
export const addPredicate = (
  code: string,
  rawName: string,
  args: string[],
): AddPredicateResult => {
  const name = rawName.trim();
  if (!isValidPredicateName(name)) return { ok: false, reason: "invalid" };

  const { value } = parsePredicates(code);
  if (value) {
    const exists = value.some(
      (predicate) =>
        predicate.name === name &&
        predicate.args.length === args.length &&
        predicate.args.every((arg, i) => arg === args[i]),
    );
    if (exists) return { ok: false, reason: "duplicate" };
  }

  const statement = `${name}(${args.join(", ")})`;
  if (!code.trim()) return { ok: true, code: statement };
  const separator = code.endsWith("\n") ? "" : "\n";
  return { ok: true, code: `${code}${separator}${statement}` };
};

/**
 * Remove the first `name(arg1, arg2, ...)` statement matching `name` + `args`
 * (constant names) from the predicates-editor code, splicing it out by token
 * offsets so surrounding statements and formatting are preserved. Also trims
 * the statement's indentation, an optional trailing `;`, and one trailing
 * newline so no blank line is left behind. Returns the code unchanged when no
 * matching statement is found (or the code does not lex).
 */
export const removePredicate = (
  code: string,
  name: string,
  args: string[],
): string => {
  const lex = PredicatesLexer.tokenize(code);
  if (lex.errors.length) return code;
  const tokens = lex.tokens;

  for (let i = 0; i < tokens.length; i++) {
    if (
      tokens[i].tokenType !== Identifier ||
      tokens[i + 1]?.tokenType !== LBracket
    ) {
      continue;
    }

    const predName = tokens[i].image;
    const predArgs: string[] = [];
    let j = i + 2;
    while (j < tokens.length && tokens[j].tokenType !== RBracket) {
      if (tokens[j].tokenType === Identifier) predArgs.push(tokens[j].image);
      j++;
    }

    // tokens[j] is the closing RBracket (or end of input on malformed code).
    let endToken = tokens[j] ?? tokens[tokens.length - 1];
    if (tokens[j + 1]?.tokenType === Semicolon) endToken = tokens[j + 1];

    const matches =
      predName === name &&
      predArgs.length === args.length &&
      predArgs.every((arg, k) => arg === args[k]);

    if (matches) {
      let start = tokens[i].startOffset;
      while (start > 0 && (code[start - 1] === " " || code[start - 1] === "\t")) {
        start--;
      }
      let end = (endToken.endOffset ?? endToken.startOffset) + 1;
      if (code[end] === "\r") end++;
      if (code[end] === "\n") end++;
      return code.slice(0, start) + code.slice(end);
    }

    i = j;
  }

  return code;
};
