import { useCallback, useEffect, useRef } from "react";
import type { OnMount } from "@monaco-editor/react";
import type {
  IDisposable,
  languages,
  editor as MonacoEditor,
  Position,
} from "monaco-editor";

type Args = {
  language: string;
  suggestions: string[];
  triggerCharacters: string[];
  kind: languages.CompletionItemKind;
};

export const useCompletionProvider = ({
  language,
  suggestions,
  triggerCharacters,
  kind,
}: Args) => {
  const disposableRef = useRef<IDisposable | null>(null);
  const suggestionsRef = useRef(suggestions);

  useEffect(() => {
    suggestionsRef.current = suggestions;
  }, [suggestions]);

  const handleMount = useCallback<OnMount>(
    (editor, monaco) => {
      const modelUri = editor.getModel()?.uri;
      if (!modelUri) return;

      disposableRef.current = monaco.languages.registerCompletionItemProvider(
        language,
        {
          triggerCharacters,
          provideCompletionItems(
            model: MonacoEditor.IReadOnlyModel,
            position: Position,
          ) {
            if (model.uri.toString() !== modelUri.toString()) {
              return { suggestions: [] };
            }

            const word = model.getWordUntilPosition(position);
            const range = {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: word.startColumn,
              endColumn: word.endColumn,
            };

            return {
              suggestions: suggestionsRef.current.map((label) => ({
                label,
                kind,
                insertText: label,
                range,
              })),
            };
          },
        },
      );
    },
    [language, kind, triggerCharacters],
  );

  useEffect(
    () => () => {
      disposableRef.current?.dispose();
    },
    [],
  );

  return { handleMount };
};
