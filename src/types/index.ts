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

export type ParseError = {
  source: "universe" | "constants" | "predicates";
  message: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
};

export type ParseResult<T> = {
  value: T | null;
  errors: ParseError[];
};
