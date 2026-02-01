export type Predicate = {
  name: string;
  args: string[];
};

export type Model = {
  universe: Set<string>;
  constants: Map<string, string>;
  predicates: Predicate[];
};

export type LanguageCode = "en" | "uk" | "sk";

export type ErrorType = "lex" | "parse";

export type SyntaxError = {
  source: "universe" | "constants" | "predicates";
  kind: ErrorType;
  message: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
};

export type ParseResult<T> = {
  value: T | null;
  errors: SyntaxError[];
};
