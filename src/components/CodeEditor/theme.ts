import type { Monaco } from "@monaco-editor/react";

export const THEME_LIGHT = "primary-light";
export const THEME_DARK = "primary-dark";
export const THEME_NAME = THEME_LIGHT;

let monacoInstance: Monaco | null = null;

export const setMonacoTheme = (theme: "light" | "dark") => {
  if (!monacoInstance) return;
  monacoInstance.editor.setTheme(theme === "dark" ? THEME_DARK : THEME_LIGHT);
};

export const defineTheme = (monaco: Monaco) => {
  monacoInstance = monaco;

  monaco.editor.defineTheme(THEME_LIGHT, {
    base: "vs",
    inherit: true,
    rules: [
      { token: "delimiter.bracket", foreground: "#667085", fontStyle: "bold" },
      { token: "delimiter.comma", foreground: "#2a2352" },
      { token: "delimiter.colon", foreground: "#2a2352" },
      { token: "delimiter.LParen", foreground: "#667085", fontStyle: "bold" },
      { token: "delimiter.RParen", foreground: "#667085", fontStyle: "bold" },

      { token: "identifier", foreground: "#2a2352" },
      { token: "variable", foreground: "#2a2352", fontStyle: "italic" },

      { token: "operator.arrow", foreground: "#22a06b", fontStyle: "bold" },
      { token: "operator.and", foreground: "#22a06b", fontStyle: "bold" },
      { token: "operator.or", foreground: "#22a06b", fontStyle: "bold" },
      { token: "operator.not", foreground: "#22a06b", fontStyle: "bold" },
      { token: "operator.implies", foreground: "#22a06b", fontStyle: "bold" },
      { token: "operator.iff", foreground: "#22a06b", fontStyle: "bold" },
      { token: "operator.forall", foreground: "#22a06b" },
      { token: "operator.exists", foreground: "#22a06b" },
    ],
    colors: {
      // Background / text
      "editor.background": "#f6f7f9",
      "editor.foreground": "#181a1f",

      // Cursor / selection
      "editorCursor.foreground": "#22a06b",
      "editor.selectionBackground": "#d4ccff",
      "editor.inactiveSelectionBackground": "#ece9ff",

      // Line highlight
      "editor.lineHighlightBackground": "#ece9ff",

      // Bracket match
      "editorBracketMatch.background": "#ece9ff",
      "editorBracketMatch.border": "#cfd8e3",

      // Find
      "editor.findMatchBackground": "#d4ccff",
      "editor.findMatchHighlightBackground": "#ece9ff",
    },
  });

  monaco.editor.defineTheme(THEME_DARK, {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "delimiter.bracket", foreground: "#9aa4b2", fontStyle: "bold" },
      { token: "delimiter.comma", foreground: "#f1f0ff" },
      { token: "delimiter.colon", foreground: "#f1f0ff" },

      { token: "identifier", foreground: "#f1f0ff" },
      { token: "variable", foreground: "#f1f0ff", fontStyle: "italic" },

      { token: "operator.arrow", foreground: "#22c55e", fontStyle: "bold" },
      { token: "operator.and", foreground: "#22c55e", fontStyle: "bold" },
      { token: "operator.or", foreground: "#22c55e", fontStyle: "bold" },
      { token: "operator.not", foreground: "#22c55e", fontStyle: "bold" },
      { token: "operator.implies", foreground: "#22c55e", fontStyle: "bold" },
      { token: "operator.iff", foreground: "#22c55e", fontStyle: "bold" },
      { token: "operator.forall", foreground: "#22c55e" },
      { token: "operator.exists", foreground: "#22c55e" },
    ],
    colors: {
      // Background / text
      "editor.background": "#161b22",
      "editor.foreground": "#E5E7EB",

      // Cursor / selection
      "editorCursor.foreground": "#22c55e",
      "editor.selectionBackground": "#2b2a45",
      "editor.inactiveSelectionBackground": "#3a375c",

      // Line highlight
      "editor.lineHighlightBackground": "#1d2430",

      // Bracket match
      "editorBracketMatch.background": "#2A3240",
      "editorBracketMatch.border": "#2A3240",

      // Find
      "editor.findMatchBackground": "#2b2a45",
      "editor.findMatchHighlightBackground": "#3a375c",
    },
  });
};
