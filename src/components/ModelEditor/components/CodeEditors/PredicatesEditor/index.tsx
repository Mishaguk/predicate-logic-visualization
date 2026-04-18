import React from "react";
import { useTranslation } from "react-i18next";
import type { Monaco } from "@monaco-editor/react";

import Chip from "../../../../Chip";
import CodeEditor from "../../../../CodeEditor";

import { IconArrowUpDown } from "../../../../../assets";
import type { SyntaxError } from "../../../../../types";
import { useMonacoMarkers } from "../../../../../hooks/useMonacoMarkers";

type Props = {
  value: string;
  onChange: (value: string | undefined) => void;
  syntaxErrors?: SyntaxError[];
};

const PredicatesEditor = ({ value, onChange, syntaxErrors = [] }: Props) => {
  const { t } = useTranslation("common");
  const { handleMount } = useMonacoMarkers({
    owner: "predicates",
    errors: syntaxErrors,
  });

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <IconArrowUpDown />
        <Chip text={t("modelElements.predicates")} />
      </div>
      <CodeEditor
        onChange={onChange}
        value={value}
        onMount={(editor, monaco: Monaco) => handleMount(editor, monaco)}
      />
    </>
  );
};

export default React.memo(PredicatesEditor);
