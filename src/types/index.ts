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
