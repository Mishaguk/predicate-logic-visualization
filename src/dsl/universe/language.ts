import type { Monaco } from "@monaco-editor/react";

export function registerUniverseLanguage(monaco: Monaco) {
  monaco.languages.register({ id: "predicateModelDSL" });

  monaco.languages.setMonarchTokensProvider("predicateModelDSL", {
    tokenizer: {
      root: [
        // Arrow first so it doesn't get split
        [/->/, "operator.arrow"],

        [/\{/, "delimiter.bracket"],
        [/\}/, "delimiter.bracket"],
        [/,/, "delimiter.comma"],

        // Identifiers
        [/[a-zA-Z_][a-zA-Z0-9_]*/, "identifier"],
      ],
    },
  });
}
