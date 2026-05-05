import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { defaultSizes, MIN_PANEL_SIZE } from "../../constants";
import styles from "./index.module.css";

import Chip from "../../../Chip";
import ConstantsEditor from "./ConstantsEditor";
import PredicatesEditor from "./PredicatesEditor";
import QueryEditor from "./QueryEditor";
import UniverseEditor from "./UniverseEditor";

import panelStyles from "../../index.module.css";
import React from "react";
import { useTranslation } from "react-i18next";
import type { Binding, SyntaxError } from "../../../../types";
import { IconShIeldX } from "../../../../assets";

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
  constantNames: string[];
  universeMembers: string[];
  predicateNames: string[];
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
  handleClearModel,
  constantNames,
  universeMembers,
  predicateNames,
}: Props) => {
  const { t } = useTranslation("common");
  const universeErrors = syntaxErrors?.universe ?? [];
  const predicateErrors = syntaxErrors?.predicates ?? [];
  const constantsErrors = syntaxErrors?.constants ?? [];
  const queryErrors = syntaxErrors?.query ?? [];

  return (
    <PanelGroup direction="vertical">
      <Panel
        defaultSize={defaultSizes.topContainer}
        minSize={MIN_PANEL_SIZE}
        maxSize={70}
        collapsible={false}
      >
        <PanelGroup direction="horizontal">
          <Panel
            defaultSize={defaultSizes.universe}
            minSize={MIN_PANEL_SIZE}
            maxSize={75}
            collapsible={false}
            className={panelStyles.panel}
            style={{ gap: "8px" }}
          >
            <UniverseEditor
              value={universeCode}
              onChange={handleUniverseCodeChange}
              syntaxErrors={universeErrors}
            />
          </Panel>
          <RenderResizeHandle direction="horizontal" />
          <Panel
            defaultSize={defaultSizes.errors}
            minSize={MIN_PANEL_SIZE}
            maxSize={60}
            collapsible={false}
            className={panelStyles.panel}
            style={{ gap: "8px", alignItems: "self-start" }}
          >
            <div
              data-tour="errors-panel"
              style={{ display: "flex", alignItems: "center", gap: "4px" }}
            >
              <IconShIeldX />
              <Chip text={t("modelElements.compilationErrors")} />
            </div>

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
                      {t("placeholders.noErrorsFound")}
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
        maxSize={65}
        collapsible={false}
      >
        <PanelGroup direction="vertical">
          <Panel minSize={MIN_PANEL_SIZE} maxSize={70} collapsible={false}>
            <PanelGroup direction="horizontal">
              <Panel
                className={panelStyles.panel}
                defaultSize={defaultSizes.constants}
                minSize={MIN_PANEL_SIZE}
                maxSize={65}
                collapsible={false}
                style={{ gap: "8px" }}
              >
                <ConstantsEditor
                  value={constantsCode}
                  onChange={handleConstantsCodeChange}
                  syntaxErrors={constantsErrors}
                  universeMembers={universeMembers}
                />
              </Panel>
              <RenderResizeHandle direction="horizontal" />
              <Panel
                minSize={MIN_PANEL_SIZE}
                maxSize={70}
                collapsible={false}
                className={panelStyles.panel}
                style={{ gap: "8px" }}
              >
                <PredicatesEditor
                  value={predicatesCode}
                  onChange={handlePredicatesCodeChange}
                  syntaxErrors={predicateErrors}
                  constantNames={constantNames}
                />
              </Panel>
            </PanelGroup>
          </Panel>
          <RenderResizeHandle direction="vertical" />
          <Panel
            minSize={MIN_PANEL_SIZE - 20}
            maxSize={60}
            collapsible={false}
            className={panelStyles.panel}
            style={{ gap: "8px" }}
          >
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
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
};

export default React.memo(CodeEditors);
