import { Editor, type EditorProps } from "@monaco-editor/react";
import { useEffect } from "react";
import { useTheme } from "../../context/theme/useTheme";
import { setMonacoTheme, THEME_DARK, THEME_LIGHT } from "./theme";
import styles from "./index.module.css";

const CodeEditor = (props: EditorProps) => {
  const { theme } = useTheme();
  const themeName = theme === "dark" ? THEME_DARK : THEME_LIGHT;

  useEffect(() => {
    setMonacoTheme(theme);
  }, [theme]);

  return (
    <div
      className={styles.editorFrame}
      onMouseDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onKeyUp={(e) => e.stopPropagation()}
    >
      <div className={styles.editorHost}>
        <Editor
          theme={themeName}
          defaultLanguage="predicateModelDSL"
          options={{
            minimap: { enabled: false },
            overviewRulerLanes: 0,
            fixedOverflowWidgets: true,
            scrollbar: {
              vertical: "hidden",
            },
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: 14,
            lineHeight: 20,
            fontLigatures: true,
            fontWeight: "400",
          }}
          {...props}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
