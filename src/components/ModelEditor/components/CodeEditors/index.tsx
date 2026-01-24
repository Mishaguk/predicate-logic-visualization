import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { defaultSizes, MIN_PANEL_SIZE } from "../../constants";
import styles from "./index.module.css";

import Chip from "../../../Chip";
import CodeEditor from "../../../CodeEditor";

import panelStyles from "../../index.module.css";
import React from "react";
import { useTranslation } from "react-i18next";
import type { Monaco } from "@monaco-editor/react";

type Props = {
  universeCode: string;
  constantsCode: string;
  predicatesCode: string;
  errors?: string[];
  handlePredicatesCodeChange: (value: string | undefined) => void;
  handleUniverseCodeChange: (value: string | undefined) => void;
  handleConstantsCodeChange: (value: string | undefined) => void;
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

function addHardcodedError(monaco: Monaco, editor: any) {
  const model = editor.getModel();
  if (!model) return;

  monaco.editor.setModelMarkers(model, "hardcoded", [
    {
      severity: monaco.MarkerSeverity.Error,
      message: "Hardcoded error (test)",
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: 1,
      endColumn: 6,
    },
  ]);
}

function registerHardcodedHover(monaco: Monaco) {
  monaco.languages.registerHoverProvider("predicateModelDSL", {
    provideHover(model, position) {
      return {
        range: new monaco.Range(
          1,
          1,
          model.getLineCount(),
          model.getLineMaxColumn(model.getLineCount()),
        ),
        contents: [
          { value: "**Hardcoded error**" },
          { value: "This is a test hover message." },
        ],
      };
    },
  });
}

const CodeEditors = ({
  universeCode,
  constantsCode,
  predicatesCode,
  errors = [],
  handlePredicatesCodeChange,
  handleUniverseCodeChange,
  handleConstantsCodeChange,
  isMobile = false,
}: Props) => {
  const { t } = useTranslation("common");

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
              onMount={(editor, monaco: Monaco) => {
                addHardcodedError(monaco, editor);
                registerHardcodedHover(monaco);
              }}
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
            <div
              style={{
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
              }}
            >
              <div className={styles.errors}>
                {errors.map((error, index) => (
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
                ))}
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </Panel>
      <RenderResizeHandle direction="vertical" />
      <Panel
        defaultSize={defaultSizes.bottomContainer}
        minSize={MIN_PANEL_SIZE}
      >
        <PanelGroup direction={isMobile ? "vertical" : "horizontal"}>
          <Panel
            className={panelStyles.panel}
            defaultSize={defaultSizes.constants}
            minSize={MIN_PANEL_SIZE}
          >
            <Chip text={t("modelElements.constants")} />
            <CodeEditor
              onChange={handleConstantsCodeChange}
              value={constantsCode}
            />
          </Panel>
          <RenderResizeHandle
            direction={isMobile ? "vertical" : "horizontal"}
          />
          <Panel minSize={MIN_PANEL_SIZE}>
            <PanelGroup direction="vertical">
              <Panel
                className={panelStyles.panel}
                defaultSize={defaultSizes.predicates}
                minSize={MIN_PANEL_SIZE}
              >
                <Chip text={t("modelElements.predicates")} />
                <CodeEditor
                  onChange={handlePredicatesCodeChange}
                  value={predicatesCode}
                />
              </Panel>
              <RenderResizeHandle direction="vertical" />
              <Panel
                defaultSize={defaultSizes.functions}
                minSize={MIN_PANEL_SIZE}
                className={panelStyles.panel}
              >
                <Chip text={t("modelElements.functions")} />
                <CodeEditor />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
};

export default React.memo(CodeEditors);
