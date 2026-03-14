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
      { token: "delimiter.bracket", foreground: "#6B7280", fontStyle: "bold" },
      { token: "delimiter.comma", foreground: "#B45309" },
      { token: "delimiter.colon", foreground: "#B45309" },
      { token: "delimiter.LParen", foreground: "#6B7280", fontStyle: "bold" },
      { token: "delimiter.RParen", foreground: "#6B7280", fontStyle: "bold" },

      { token: "identifier", foreground: "#1D4ED8" },
      { token: "variable", foreground: "#1D4ED8", fontStyle: "italic" },

      { token: "operator.arrow", foreground: "#15803D", fontStyle: "bold" },
      { token: "operator.and", foreground: "#15803D", fontStyle: "bold" },
      { token: "operator.or", foreground: "#15803D", fontStyle: "bold" },
      { token: "operator.not", foreground: "#15803D", fontStyle: "bold" },
      { token: "operator.implies", foreground: "#15803D", fontStyle: "bold" },
      { token: "operator.iff", foreground: "#15803D", fontStyle: "bold" },
      { token: "operator.forall", foreground: "#15803D" },
      { token: "operator.exists", foreground: "#15803D" },
    ],
    colors: {
      // Background / text
      "editor.background": "#F6F7F8",
      "editor.foreground": "#111827",

      // Cursor / selection
      "editorCursor.foreground": "#15803D",
      "editor.selectionBackground": "#BBF7D0",
      "editor.inactiveSelectionBackground": "#DCFCE7",

      // Line highlight
      "editor.lineHighlightBackground": "#F2EEF4",

      // Bracket match
      "editorBracketMatch.background": "#E5E7EB",
      "editorBracketMatch.border": "#9CA3AF",

      // Find
      "editor.findMatchBackground": "#FEF3C7",
      "editor.findMatchHighlightBackground": "#FDE68A",
    },
  });

  monaco.editor.defineTheme(THEME_DARK, {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "delimiter.bracket", foreground: "#94A3B8", fontStyle: "bold" },
      { token: "delimiter.comma", foreground: "#FBBF24" },
      { token: "delimiter.colon", foreground: "#FBBF24" },

      { token: "identifier", foreground: "#7DD3FC" },
      { token: "variable", foreground: "#7DD3FC", fontStyle: "italic" },

      { token: "operator.arrow", foreground: "#15803D", fontStyle: "bold" },
      { token: "operator.and", foreground: "#15803D", fontStyle: "bold" },
      { token: "operator.or", foreground: "#15803D", fontStyle: "bold" },
      { token: "operator.not", foreground: "#15803D", fontStyle: "bold" },
      { token: "operator.implies", foreground: "#15803D", fontStyle: "bold" },
      { token: "operator.iff", foreground: "#15803D", fontStyle: "bold" },
      { token: "operator.forall", foreground: "#15803D" },
      { token: "operator.exists", foreground: "#15803D" },
    ],
    colors: {
      // Background / text
      "editor.background": "#161b22",
      "editor.foreground": "#E5E7EB",

      // Cursor / selection
      "editorCursor.foreground": "#7EE787",
      "editor.selectionBackground": "#1F2A3A",
      "editor.inactiveSelectionBackground": "#16202D",

      // Line highlight
      "editor.lineHighlightBackground": "#1B202B",

      // Bracket match
      "editorBracketMatch.background": "#2A3240",
      "editorBracketMatch.border": "#64748B",

      // Find
      "editor.findMatchBackground": "#4C3F00",
      "editor.findMatchHighlightBackground": "#3A2F00",
    },
  });
};
