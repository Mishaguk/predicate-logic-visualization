import { parseConstants } from "./constants.parse";
import { ConstantsLexer, Arrow, Semicolon } from "./constants.tokens";

const STARTS_WITH_DIGIT = /^[0-9]/;

/**
 * Derive a constant name for a universe member: the lowercased member, with an
 * "n" prefix when it starts with a digit. Constant names must start with a
 * letter or underscore (see constants grammar), so `0 -> 0` is invalid while
 * `n0 -> 0` is fine.
 */
export const toConstantName = (member: string): string => {
  const lower = member.toLowerCase();
  return STARTS_WITH_DIGIT.test(lower) ? `n${lower}` : lower;
};

/**
 * Append a `constName -> member` mapping to the constants-editor code. Skips
 * (returns the code unchanged) when the member is already mapped or the derived
 * constant name is already in use. Preserves existing formatting.
 */
export const addConstantMapping = (code: string, member: string): string => {
  const constName = toConstantName(member);
  const { value } = parseConstants(code);

  if (value) {
    for (const [name, mapped] of value) {
      if (name === constName || mapped === member) return code;
    }
  }

  const mapping = `${constName} -> ${member}`;
  if (!code.trim()) return mapping;
  const separator = code.endsWith("\n") ? "" : "\n";
  return `${code}${separator}${mapping}`;
};

/**
 * Remove the first `constName -> member` mapping for `constName` from the
 * constants-editor code, splicing it out by token offsets and trimming its
 * indentation, an optional trailing `;`, and one trailing newline so no blank
 * line is left. Returns the code unchanged when not found or it does not lex.
 */
export const removeConstantMapping = (
  code: string,
  constName: string,
): string => {
  const lex = ConstantsLexer.tokenize(code);
  if (lex.errors.length) return code;
  const tokens = lex.tokens;

  for (let i = 0; i + 1 < tokens.length; i++) {
    if (tokens[i + 1].tokenType !== Arrow || tokens[i].image !== constName) {
      continue;
    }

    // tokens[i+2] is the mapped member; an optional ";" may follow.
    let endToken = tokens[i + 2] ?? tokens[i + 1];
    if (tokens[i + 3]?.tokenType === Semicolon) endToken = tokens[i + 3];

    let start = tokens[i].startOffset;
    while (start > 0 && (code[start - 1] === " " || code[start - 1] === "\t")) {
      start--;
    }
    let end = (endToken.endOffset ?? endToken.startOffset) + 1;
    if (code[end] === "\r") end++;
    if (code[end] === "\n") end++;
    return code.slice(0, start) + code.slice(end);
  }

  return code;
};
