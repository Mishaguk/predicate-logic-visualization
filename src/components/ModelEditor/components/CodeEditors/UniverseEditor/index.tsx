import React from "react";
import { useTranslation } from "react-i18next";

import Chip from "../../../../Chip";
import CodeEditor from "../../../../CodeEditor";

import type { SyntaxError } from "../../../../../types";
import { useMonacoMarkers } from "../../../../../hooks/useMonacoMarkers";
import type { Monaco } from "@monaco-editor/react";
import { IconGlobe } from "../../../../../assets";

type Props = {
  value: string;
  onChange: (value: string | undefined) => void;
  syntaxErrors?: SyntaxError[];
};

const UniverseEditor = ({ value, onChange, syntaxErrors = [] }: Props) => {
  const { t } = useTranslation("common");
  const { handleMount } = useMonacoMarkers({
    owner: "universe",
    errors: syntaxErrors,
  });

  return (
    <div data-tour="universe-editor" style={{ display: "flex", flexDirection: "column", flex: 1, gap: "8px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <IconGlobe />
        <Chip text={t("modelElements.universe")} />
      </div>
      <CodeEditor
        onChange={onChange}
        value={value}
        onMount={(editor, monaco: Monaco) => handleMount(editor, monaco)}
      />
    </div>
  );
};

export default React.memo(UniverseEditor);
