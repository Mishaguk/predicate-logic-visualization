import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "../../index.module.css";
import codeEditorStyles from "../CodeEditors/index.module.css";
import Visualization from "../Visualization";
import Chip from "../../../Chip";
import Button from "../../../Button";
import ConstantsEditor from "../CodeEditors/ConstantsEditor";
import PredicatesEditor from "../CodeEditors/PredicatesEditor";
import QueryEditor from "../CodeEditors/QueryEditor";
import UniverseEditor from "../CodeEditors/UniverseEditor";
import type { Binding, SyntaxError } from "../../../../types";
import type { ModelEditorState } from "../../../../hooks/useModelEditor";
import { IconCircleAlert, IconShIeldX } from "../../../../assets";

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
  handleClearModel?: () => void;
  onOpenPrologExport?: () => void;
  constantNames: string[];
  universeMembers: string[];
  predicateNames: string[];
  visualization: ModelEditorState["visualization"];
  fitViewTrigger?: string;
  hideModelEditor?: boolean;
};

type MobileTab = "code" | "errors" | "visualization";

const MobileLayout = ({
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
  handleClearModel,
  onOpenPrologExport,
  visualization,
  fitViewTrigger,
  hideModelEditor = false,
  constantNames,
  universeMembers,
  predicateNames,
}: Props) => {
  const { t } = useTranslation("common");
  const universeErrors = syntaxErrors?.universe ?? [];
  const predicateErrors = syntaxErrors?.predicates ?? [];
  const constantsErrors = syntaxErrors?.constants ?? [];
  const queryErrors = syntaxErrors?.query ?? [];
  const hasErrors = errors.length > 0;
  const [activeTab, setActiveTab] = useState<MobileTab>(
    hideModelEditor ? "visualization" : "code",
  );

  return (
    <div className={styles.mobileLayout}>
      {!hideModelEditor && (
        <div className={styles.mobileNavigation}>
          <button
            type="button"
            className={`${styles.mobileTab} ${
              activeTab === "code" ? styles.mobileTabActive : ""
            }`}
            onClick={() => setActiveTab("code")}
          >
            {t("modelElements.model")}
          </button>
          <button
            type="button"
            className={`${styles.mobileTab} ${
              activeTab === "errors" ? styles.mobileTabActive : ""
            } ${hasErrors ? styles.mobileTabAlert : ""}`}
            onClick={() => setActiveTab("errors")}
          >
            <span className={styles.mobileTabLabel}>
              {hasErrors && (
                <IconCircleAlert
                  aria-hidden="true"
                  className={styles.mobileTabIcon}
                />
              )}
              {t("modelElements.compilationErrors")}
            </span>
          </button>
          <button
            type="button"
            className={`${styles.mobileTab} ${
              activeTab === "visualization" ? styles.mobileTabActive : ""
            }`}
            onClick={() => setActiveTab("visualization")}
          >
            {t("guide.visualization.title")}
          </button>
        </div>
      )}

      <div className={styles.mobileContent}>
        {activeTab === "code" ? (
          <div className={styles.mobileEditors}>
            <div className={styles.mobileEditorSection}>
              <UniverseEditor
                value={universeCode}
                onChange={handleUniverseCodeChange}
                syntaxErrors={universeErrors}
              />
            </div>
            <div className={styles.mobileEditorSection}>
              <ConstantsEditor
                value={constantsCode}
                onChange={handleConstantsCodeChange}
                syntaxErrors={constantsErrors}
                universeMembers={universeMembers}
              />
            </div>
            <div className={styles.mobileEditorSection}>
              <PredicatesEditor
                value={predicatesCode}
                onChange={handlePredicatesCodeChange}
                syntaxErrors={predicateErrors}
                constantNames={constantNames}
              />
            </div>
            <div className={styles.mobileEditorSection}>
              <QueryEditor
                value={queryCode}
                onChange={handleQueryCodeChange}
                onExecute={handleExecuteQuery}
                onClear={handleClearModel}
                queryResult={queryResult}
                syntaxErrors={queryErrors}
                predicateNames={predicateNames}
                constantNames={constantNames}
              />
            </div>
          </div>
        ) : activeTab === "errors" ? (
          <div
            className={`${styles.mobileEditorSection} ${styles.mobileFullSection}`}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <IconShIeldX />
              <Chip text={t("modelElements.compilationErrors")} />
            </div>
            <div className={codeEditorStyles.errorsContainer}>
              <div className={codeEditorStyles.errors}>
                {hasErrors ? (
                  errors.map((error, index) => (
                    <div className={codeEditorStyles.error} key={index}>
                      <div className={codeEditorStyles.errorText}>
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
                  <div className={codeEditorStyles.noErrors}>
                    <p
                      style={{ display: "block", textAlign: "left", margin: 0 }}
                    >
                      {t("placeholders.noErrorsFound")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`${styles.mobileEditorSection} ${styles.mobileFullSection}`}
          >
            <Visualization
              edges={visualization.edges}
              nodes={visualization.nodes}
              onConnect={visualization.onConnect}
              onEdgesChange={visualization.onEdgesChange}
              onNodesChange={visualization.onNodesChange}
              fitViewTrigger={fitViewTrigger}
            />
            <div className={styles.mobileVisualizationButtons}>
              <Button
                text={t("actions.exportPrologCode")}
                onClick={onOpenPrologExport}
                variant="primary"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MobileLayout);
