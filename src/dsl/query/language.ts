import type { Monaco } from "@monaco-editor/react";

import type { editor, Position } from "monaco-editor";

export function registerQueryLanguage(monaco: Monaco) {
  monaco.languages.register({ id: "queryDSL" });

  monaco.languages.setMonarchTokensProvider("queryDSL", {
    tokenizer: {
      root: [
        // Quantifiers
        [/\u2200|\\forall/i, "operator.forall"],
        [/\u2203|\\exists/i, "operator.exists"],

        // Logical operators
        [/and|&&|\u2227|\\land/i, "operator.and"],
        [/or|\|\||\u2228|\\lor/i, "operator.or"],
        [/not|!|\u00AC|\\neg/i, "operator.not"],
        [/->|\u2192|\\to|\\implies/i, "operator.implies"],
        [/<->|\u2194|\\leftrightarrow/i, "operator.iff"],

        [/\(/, "delimiter.bracket"],
        [/\)/, "delimiter.bracket"],
        [/,/, "delimiter.comma"],
        [/:/, "delimiter.colon"],

        [/\?[a-zA-Z_][a-zA-Z0-9_]*/, "variable"],
        [/[a-zA-Z_][a-zA-Z0-9_]*/, "identifier"],
      ],
    },
  });

  monaco.languages.registerCompletionItemProvider("queryDSL", {
    triggerCharacters: ["\\"],
    provideCompletionItems: (
      model: editor.IReadOnlyModel,
      position: Position,
    ) => {
      const line = model.getLineContent(position.lineNumber);
      const textUntilCursor = line.slice(0, position.column - 1);

      const match = textUntilCursor.match(/\\\w*$/);
      if (!match) return { suggestions: [] };

      const startColumn = position.column - match[0].length;

      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn,
        endColumn: position.column,
      };

      return {
        suggestions: [
          {
            label: "\\forall",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: "\u2200",
            documentation: "For all (\u2200)",
            range,
          },
          {
            label: "\\exists",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: "\u2203",
            documentation: "Exists (\u2203)",
            range,
          },
          {
            label: "\\and",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: "\u2227",
            documentation: "And (\u2227)",
            range,
          },
          {
            label: "\\or",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: "\u2228",
            documentation: "Or (\u2228)",
            range,
          },
          {
            label: "\\not",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: "\u00AC",
            documentation: "Not (\u00AC)",
            range,
          },
          {
            label: "\\implies",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: "\u2192",
            documentation: "Implies (\u2192)",
            range,
          },
          {
            label: "\\Iff",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: "\u2194",
            documentation: "Iff (\u2194)",
            range,
          },
        ],
      };
    },
  });
}
