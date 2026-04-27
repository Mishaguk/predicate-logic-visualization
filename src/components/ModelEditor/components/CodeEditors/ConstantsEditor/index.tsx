import React from "react";
import { useTranslation } from "react-i18next";
import type { Monaco } from "@monaco-editor/react";
import { languages } from "monaco-editor";

import Chip from "../../../../Chip";
import CodeEditor from "../../../../CodeEditor";

import { IconDatabase } from "../../../../../assets";
import type { SyntaxError } from "../../../../../types";
import { useMonacoMarkers } from "../../../../../hooks/useMonacoMarkers";
import { useCompletionProvider } from "../../../../../hooks/useCompletionProvider";

type Props = {
  value: string;
  onChange: (value: string | undefined) => void;
  syntaxErrors?: SyntaxError[];
  universeMembers: string[];
};

const ConstantsEditor = ({
  value,
  onChange,
  syntaxErrors = [],
  universeMembers,
}: Props) => {
  const { t } = useTranslation("common");
  const { handleMount: handleMarkersMount } = useMonacoMarkers({
    owner: "constants",
    errors: syntaxErrors,
  });
  const { handleMount: handleCompletionMount } = useCompletionProvider({
    language: "predicateModelDSL",
    suggestions: universeMembers,
    triggerCharacters: [">"],
    kind: languages.CompletionItemKind.EnumMember,
  });

  return (
    <div
      data-tour="constants-editor"
      style={{ display: "flex", flexDirection: "column", flex: 1, gap: "8px" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <IconDatabase />
        <Chip text={t("modelElements.constants")} />
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

export default React.memo(ConstantsEditor);
