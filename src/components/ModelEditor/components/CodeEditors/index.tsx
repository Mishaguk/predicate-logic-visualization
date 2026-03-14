import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { defaultSizes, MIN_PANEL_SIZE } from "../../constants";
import styles from "./index.module.css";

import Chip from "../../../Chip";
import CodeEditor from "../../../CodeEditor";

import panelStyles from "../../index.module.css";
import React from "react";
import { useTranslation } from "react-i18next";
import type { Monaco } from "@monaco-editor/react";
import type { Binding, SyntaxError } from "../../../../types";
import { useMonacoMarkers } from "../../../../hooks/useMonacoMarkers";
import Button from "../../../Button";
import { chevronRight } from "../../../../assets";

type Props = {
  universeCode: string;
  constantsCode: string;
  predicatesCode: string;
  queryCode: string;
  queryResult: boolean | Binding[] | null;
  errors?: string[];
  syntaxErrors?: {
    universe: SyntaxError[];
    constants: SyntaxError[];
    predicates: SyntaxError[];
    query: SyntaxError[];
  };
  handlePredicatesCodeChange: (value: string | undefined) => void;
  handleUniverseCodeChange: (value: string | undefined) => void;
  handleConstantsCodeChange: (value: string | undefined) => void;
  handleQueryCodeChange: (value: string | undefined) => void;
  handleExecuteQuery: () => void;
  isMobile?: boolean;
};

const RenderResizeHandle = ({
  direction,
}: {
  direction: "horizontal" | "vertical";
}) =>
  direction === "vertical" ? (
    <PanelResizeHandle className={panelStyles.panelResizeHandleVertical} />
  ) : (
    <PanelResizeHandle className={panelStyles.panelResizeHandleHorizontal} />
  );

const CodeEditors = ({
  universeCode,
  constantsCode,
  predicatesCode,
  queryCode,
  queryResult,
  errors = [],
  syntaxErrors,
  handlePredicatesCodeChange,
  handleUniverseCodeChange,
  handleConstantsCodeChange,
  handleQueryCodeChange,
  handleExecuteQuery,
  isMobile = false,
}: Props) => {
  const { t } = useTranslation("common");
  const universeErrors = syntaxErrors?.universe ?? [];
  const predicateErrors = syntaxErrors?.predicates ?? [];
  const constantsErrors = syntaxErrors?.constants ?? [];
  const queryErrors = syntaxErrors?.query ?? [];

  const { handleMount: handleUniverseMount } = useMonacoMarkers({
    owner: "universe",
    errors: universeErrors,
  });
  const { handleMount: handleConstantsMount } = useMonacoMarkers({
    owner: "constants",
    errors: constantsErrors,
  });
  const { handleMount: handlePredicatesMount } = useMonacoMarkers({
    owner: "predicates",
    errors: predicateErrors,
  });

  const { handleMount: handleQueryMount } = useMonacoMarkers({
    owner: "query",
    errors: queryErrors,
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
    <PanelGroup direction="vertical">
      <Panel defaultSize={defaultSizes.topContainer} minSize={MIN_PANEL_SIZE}>
        <PanelGroup direction={isMobile ? "vertical" : "horizontal"}>
          <Panel
            defaultSize={defaultSizes.universe}
            minSize={MIN_PANEL_SIZE}
            className={panelStyles.panel}
          >
            <Chip text={t("modelElements.universe")} />
            <CodeEditor
              onChange={handleUniverseCodeChange}
              value={universeCode}
              onMount={(editor, monaco: Monaco) =>
                handleUniverseMount(editor, monaco)
              }
            />
          </Panel>
          <RenderResizeHandle
            direction={isMobile ? "vertical" : "horizontal"}
          />
          <Panel
            defaultSize={defaultSizes.errors}
            minSize={MIN_PANEL_SIZE}
            className={panelStyles.panel}
            style={{ padding: 0 }}
          >
            <Chip text={t("modelElements.compilationErrors")} />
            {/* // Padding for errors container while not expanding outer panel */}
            <div className={styles.errorsContainer}>
              <div className={styles.errors}>
                {errors.length ? (
                  errors.map((error, index) => (
                    <div className={styles.error} key={index}>
                      <div className={styles.errorText}>
                        <p style={{ display: "block", textAlign: "left" }}>
                          {error}
                        </p>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 15 15"
                        fill="none"
                      >
                        <path
                          d="M7.46665 10.1334V7.46672M7.46665 4.80005H7.47332M14.1333 7.46672C14.1333 11.1486 11.1486 14.1334 7.46665 14.1334C3.78476 14.1334 0.799988 11.1486 0.799988 7.46672C0.799988 3.78482 3.78476 0.800049 7.46665 0.800049C11.1486 0.800049 14.1333 3.78482 14.1333 7.46672Z"
                          stroke="#e22323"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  ))
                ) : (
                  <div className={styles.noErrors}>
                    <p
                      style={{ display: "block", textAlign: "left", margin: 0 }}
                    >
                      No errors were found.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </Panel>
      <RenderResizeHandle direction="vertical" />
      <Panel
        defaultSize={defaultSizes.bottomContainer}
        minSize={MIN_PANEL_SIZE + 10}
      >
        <PanelGroup direction="vertical">
          <Panel minSize={MIN_PANEL_SIZE}>
            <PanelGroup direction="horizontal">
              <Panel
                className={panelStyles.panel}
                defaultSize={defaultSizes.constants}
                minSize={MIN_PANEL_SIZE}
              >
                <Chip text={t("modelElements.constants")} />
                <CodeEditor
                  onChange={handleConstantsCodeChange}
                  value={constantsCode}
                  onMount={(editor, monaco: Monaco) =>
                    handleConstantsMount(editor, monaco)
                  }
                />
              </Panel>
              <RenderResizeHandle direction="horizontal" />
              <Panel minSize={MIN_PANEL_SIZE} className={panelStyles.panel}>
                <Chip text={t("modelElements.predicates")} />
                <CodeEditor
                  onChange={handlePredicatesCodeChange}
                  value={predicatesCode}
                  onMount={(editor, monaco: Monaco) =>
                    handlePredicatesMount(editor, monaco)
                  }
                />
              </Panel>
            </PanelGroup>
          </Panel>
          <RenderResizeHandle direction="vertical" />
          <Panel
            minSize={MIN_PANEL_SIZE}
            className={panelStyles.panel}
            style={{ gap: "12px", alignItems: "self-start" }}
          >
            <Chip text={t("modelElements.query")} />
            <CodeEditor
              onChange={handleQueryCodeChange}
              value={queryCode}
              language="queryDSL"
              onMount={(editor, monaco: Monaco) => {
                handleQueryMount(editor, monaco);
              }}
            />
            <div className={styles.queryActionRow}>
              <Button
                icon={chevronRight}
                text={t("actions.runQuery")}
                variant="primary"
                onClick={handleExecuteQuery}
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
                <span className={styles.queryResultValue}>
                  {queryResultText}
                </span>
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
};

export default React.memo(CodeEditors);
