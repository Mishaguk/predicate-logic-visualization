import React from "react";
import { useTranslation } from "react-i18next";
import type { Monaco } from "@monaco-editor/react";
import { languages } from "monaco-editor";

import Chip from "../../../../Chip";
import CodeEditor from "../../../../CodeEditor";

import { IconArrowUpDown } from "../../../../../assets";
import type { SyntaxError } from "../../../../../types";
import { useMonacoMarkers } from "../../../../../hooks/useMonacoMarkers";
import { useCompletionProvider } from "../../../../../hooks/useCompletionProvider";

type Props = {
  value: string;
  onChange: (value: string | undefined) => void;
  syntaxErrors?: SyntaxError[];
  constantNames: string[];
};

const PredicatesEditor = ({
  value,
  onChange,
  syntaxErrors = [],
  constantNames,
}: Props) => {
  const { t } = useTranslation("common");
  const { handleMount: handleMarkersMount } = useMonacoMarkers({
    owner: "predicates",
    errors: syntaxErrors,
  });
  const { handleMount: handleCompletionMount } = useCompletionProvider({
    language: "predicateModelDSL",
    suggestions: constantNames,
    triggerCharacters: ["(", ","],
    kind: languages.CompletionItemKind.Variable,
  });

  return (
    <div
      data-tour="predicates-editor"
      style={{ display: "flex", flexDirection: "column", flex: 1, gap: "8px" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <IconArrowUpDown />
        <Chip text={t("modelElements.predicates")} />
      </div>
      <CodeEditor
        onChange={onChange}
        value={value}
        onMount={(editor, monaco: Monaco) => {
          handleMarkersMount(editor, monaco);
          handleCompletionMount(editor, monaco);
        }}
      />
    </div>
  );
};

export default React.memo(PredicatesEditor);
