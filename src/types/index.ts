export type Predicate = {
  name: string;
  args: string[];
  universeArgs: string[];
};

export type Model = {
  universe: Map<string, string[]>;
  constants: Map<string, string>;
  predicates: Predicate[];
};

export type LanguageCode = "en" | "uk" | "sk";

export type ErrorType = "lex" | "parse";

export type SyntaxError = {
  source: "universe" | "constants" | "predicates" | "query";
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

export type QueryTerm =
  | { kind: "Const"; name: string }
  | { kind: "Var"; name: string };

export type Atom = {
  kind: "Atom";
  name: string;
  args: QueryTerm[];
};

export type NotExpression = {
  kind: "Not";
  operand: QueryExpression;
};

export type AndExpression = {
  kind: "And";
  left: QueryExpression;
  right: QueryExpression;
};

export type OrExpression = {
  kind: "Or";
  left: QueryExpression;
  right: QueryExpression;
};

export type ImpliesExpression = {
  kind: "Implies";
  left: QueryExpression;
  right: QueryExpression;
};

export type IffExpression = {
  kind: "Iff";
  left: QueryExpression;
  right: QueryExpression;
};

export type QuantifierKind = "ForAll" | "Exists";

export type QuantifierExpr = {
  kind: "Quantifier";
  quantifier: QuantifierKind;
  vars: { kind: "Var"; name: string }[];
  body: QueryExpression;
};

export type QueryExpression =
  | Atom
  | NotExpression
  | AndExpression
  | OrExpression
  | ImpliesExpression
  | IffExpression
  | QuantifierExpr;

export type Binding = Map<string, string>;

export type QueryResult = {
  value: boolean | Binding[] | null;
  errors: SyntaxError[];
};
