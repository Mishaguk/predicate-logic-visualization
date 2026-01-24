import { Editor, type EditorProps } from "@monaco-editor/react";
import { THEME_NAME } from "./theme";
import styles from "./index.module.css";

const CodeEditor = (props: EditorProps) => {
  return (
    <div
      className={styles.editorFrame}
      onMouseDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onKeyUp={(e) => e.stopPropagation()}
    >
      <div className={styles.editorHost}>
        <Editor
          theme={THEME_NAME}
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
