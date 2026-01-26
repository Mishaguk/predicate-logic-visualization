import { useCallback, useEffect, useRef } from "react";
import type { Monaco } from "@monaco-editor/react";
import type { editor as MonacoEditor } from "monaco-editor";
import type { ParseError } from "../../types";

type UseMonacoMarkersArgs = {
  owner: string;
  errors: ParseError[];
};

export const useMonacoMarkers = ({ owner, errors }: UseMonacoMarkersArgs) => {
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const applyMarkers = useCallback(() => {
    const monaco = monacoRef.current;
    const editor = editorRef.current;
    if (!monaco || !editor) return;

    const model = editor.getModel();
    if (!model) return;

    const markers = errors.map((error) => ({
      severity: monaco.MarkerSeverity.Error,
      message: error.message,
      startLineNumber: error.line,
      startColumn: error.column,
      endLineNumber: error.endLine ?? error.line,
      endColumn: error.endColumn ?? error.column + 1,
    }));

    monaco.editor.setModelMarkers(model, owner, markers);
  }, [errors, owner]);

  const handleMount = useCallback(
    (editor: MonacoEditor.IStandaloneCodeEditor, monaco: Monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;
      applyMarkers();
    },
    [applyMarkers],
  );

  useEffect(() => {
    applyMarkers();
  }, [applyMarkers]);

  return { handleMount };
};
