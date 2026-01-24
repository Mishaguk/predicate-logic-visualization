import type { Monaco } from "@monaco-editor/react";

export const THEME_NAME = "primary-light";

export const defineTheme = (monaco: Monaco) => {
  monaco.editor.defineTheme(THEME_NAME, {
    base: "vs",
    inherit: true,
    rules: [
      { token: "delimiter.bracket", foreground: "#6B7280", fontStyle: "bold" },

      { token: "identifier", foreground: "#1D4ED8" },

      { token: "delimiter.comma", foreground: "#B45309" },

      { token: "operator.arrow", foreground: "#15803D", fontStyle: "bold" },
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
      "editor.lineHighlightBackground": "#f5eef7",

      // Bracket match
      "editorBracketMatch.background": "#E5E7EB",
      "editorBracketMatch.border": "#9CA3AF",

      // Find
      "editor.findMatchBackground": "#FEF3C7",
      "editor.findMatchHighlightBackground": "#FDE68A",
    },
  });

  monaco.editor.setTheme(THEME_NAME);
};
