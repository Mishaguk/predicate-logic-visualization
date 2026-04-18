import React from "react";
import { useTranslation } from "react-i18next";
import type { Monaco } from "@monaco-editor/react";

import Chip from "../../../../Chip";
import CodeEditor from "../../../../CodeEditor";
import Button from "../../../../Button";

import styles from "../index.module.css";

import type { Binding, SyntaxError } from "../../../../../types";
import { useMonacoMarkers } from "../../../../../hooks/useMonacoMarkers";
import { IconCIrclePlay, IconChevronRight } from "../../../../../assets";

type Props = {
  value: string;
  onChange: (value: string | undefined) => void;
  onExecute: () => void;
  queryResult: boolean | Binding[] | null;
  syntaxErrors?: SyntaxError[];
};

const QueryEditor = ({
  value,
  onChange,
  onExecute,
  queryResult,
  syntaxErrors = [],
}: Props) => {
  const { t } = useTranslation("common");
  const { handleMount } = useMonacoMarkers({
    owner: "query",
    errors: syntaxErrors,
  });

  const hasSolutions = Array.isArray(queryResult);
  const isTruthyResult = hasSolutions ? queryResult.length > 0 : queryResult;

  const formatBinding = (binding: Binding): string => {
    const pairs = Array.from(binding.entries()).map(
      ([variable, value]) => `${variable} -> ${value}`,
    );

    return pairs.join(", ");
  };

  const queryResultText = (() => {
    if (queryResult === null) return "-";
    if (typeof queryResult === "boolean") return queryResult ? "true" : "false";
    if (!queryResult.length) return "no solutions";

    return queryResult.map((binding) => formatBinding(binding)).join(" | ");
  })();

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <IconCIrclePlay />
        <Chip text={t("modelElements.query")} />
      </div>
      <CodeEditor
        onChange={onChange}
        value={value}
        language="queryDSL"
        onMount={(editor, monaco: Monaco) => handleMount(editor, monaco)}
      />
      <div className={styles.queryActionRow}>
        <Button
          icon={IconChevronRight}
          text={t("actions.runQuery")}
          variant="primary"
          style={{ width: "auto" }}
          onClick={onExecute}
        />
        <div
          className={`${styles.queryResult} ${
            queryResult === null
              ? styles.queryResultEmpty
              : isTruthyResult
                ? styles.queryResultTrue
                : styles.queryResultFalse
          }`}
        >
          <span className={styles.queryResultLabel}>
            {t("modelElements.result")}
          </span>
          <span className={styles.queryResultValue}>{queryResultText}</span>
        </div>
      </div>
    </>
  );
};

export default React.memo(QueryEditor);
