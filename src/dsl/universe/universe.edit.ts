import type { IToken, TokenType } from "chevrotain";
import {
  UniverseLexer,
  Identifier,
  Iff,
  LCurly,
  RCurly,
  Comma,
} from "./universe.tokens";
import { parseUniverse } from "./universe.parse";

const IDENTIFIER_RE = /^[a-zA-Z0-9_]+$/;

const TARGET_SET = "universe";

export type AddMemberReason = "invalid" | "duplicate";

export type AddMemberResult =
  | { ok: true; code: string }
  | { ok: false; reason: AddMemberReason };

export const isValidMemberName = (name: string): boolean =>
  IDENTIFIER_RE.test(name);

export const getUniverseMembers = (code: string): Set<string> => {
  const { value } = parseUniverse(code);
  const members = new Set<string>();
  if (value) {
    for (const list of value.values()) {
      for (const member of list) members.add(member);
    }
  }
  return members;
};

const isType = (token: IToken, type: TokenType): boolean =>
  token.tokenType === type;

/**
 * Locate the `universe = { ... }` declaration and return the index range of the
 * tokens between its braces, so a new member can be spliced in while preserving
 * the surrounding formatting. Returns null when no such set exists.
 */
const findTargetSet = (
  tokens: IToken[],
): { lCurly: IToken; rCurly: IToken; members: IToken[] } | null => {
  for (let i = 0; i + 2 < tokens.length; i++) {
    const name = tokens[i];
    if (
      !isType(name, Identifier) ||
      name.image !== TARGET_SET ||
      !isType(tokens[i + 1], Iff) ||
      !isType(tokens[i + 2], LCurly)
    ) {
      continue;
    }

    const lCurly = tokens[i + 2];
    const members: IToken[] = [];
    for (let j = i + 3; j < tokens.length; j++) {
      const token = tokens[j];
      if (isType(token, RCurly)) {
        return { lCurly, rCurly: token, members };
      }
      if (isType(token, Identifier)) members.push(token);
    }
    return null;
  }
  return null;
};

const splice = (code: string, at: number, insert: string): string =>
  code.slice(0, at) + insert + code.slice(at);

// chevrotain types endOffset as optional; it is always set for these tokens.
const afterToken = (token: IToken): number =>
  (token.endOffset ?? token.startOffset) + 1;

/**
 * Add `rawName` to the `universe` set in the given universe-editor code.
 * Creates the set when it does not exist. Preserves existing formatting.
 */
export const addUniverseMember = (
  code: string,
  rawName: string,
): AddMemberResult => {
  const name = rawName.trim();
  if (!isValidMemberName(name)) return { ok: false, reason: "invalid" };
  if (getUniverseMembers(code).has(name)) {
    return { ok: false, reason: "duplicate" };
  }

  const lex = UniverseLexer.tokenize(code);
  const target = lex.errors.length ? null : findTargetSet(lex.tokens);

  if (!target) {
    const declaration = `${TARGET_SET} = { ${name} };`;
    if (!code.trim()) return { ok: true, code: declaration };
    const separator = code.endsWith("\n") ? "" : "\n";
    return { ok: true, code: `${code}${separator}${declaration}` };
  }

  if (target.members.length > 0) {
    const lastMember = target.members[target.members.length - 1];
    return { ok: true, code: splice(code, afterToken(lastMember), `, ${name}`) };
  }

  // Empty set: insert right after "{".
  return { ok: true, code: splice(code, afterToken(target.lCurly), ` ${name}`) };
};

/**
 * Remove the first occurrence of `member` from any universe set, splicing it
 * out by token offsets along with one adjacent comma so the set stays valid
 * (`{ a, b, c }` minus `b` → `{ a, c }`). Returns the code unchanged when the
 * member is not found or the code does not lex.
 */
export const removeUniverseMember = (code: string, member: string): string => {
  const lex = UniverseLexer.tokenize(code);
  if (lex.errors.length) return code;
  const tokens = lex.tokens;

  // Skip set names (followed by "="); only match members inside braces.
  const m = tokens.findIndex(
    (token, i) =>
      isType(token, Identifier) &&
      token.image === member &&
      tokens[i + 1]?.tokenType !== Iff,
  );
  if (m === -1) return code;

  const memberToken = tokens[m];
  const prev = tokens[m - 1];
  const next = tokens[m + 1];

  let start = memberToken.startOffset;
  let end = (memberToken.endOffset ?? memberToken.startOffset) + 1;

  if (prev && isType(prev, Comma)) {
    start = prev.startOffset;
  } else if (next && isType(next, Comma)) {
    end = (next.endOffset ?? next.startOffset) + 1;
  }

  return code.slice(0, start) + code.slice(end);
};
