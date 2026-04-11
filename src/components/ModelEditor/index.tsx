import styles from "./index.module.css";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import Visualization from "./components/Visualization";

import CodeEditors from "./components/CodeEditors";
import MobileLayout from "./components/MobileLayout";

import type { ModelEditorState } from "../../hooks/useModelEditor";
import Button from "../Button";
import {
  defaultSizes,
  ROOT_PANEL_MAX_SIZE,
  ROOT_PANEL_MIN_SIZE,
} from "./constants";
import { useMediaQuery } from "../../hooks/useMediaQuery";

import { useTranslation } from "react-i18next";
import React from "react";

// type TabIndex = "model" | "visualization";

type Props = ModelEditorState & {
  hideModelEditor?: boolean;
};

const ModelEditor = ({
  visualization,
  code,
  hideModelEditor = false,
}: Props) => {
  const { states, errors, syntaxErrors, handlers } = code;

  const isMobile = useMediaQuery("(max-width: 900px)");
  const fitViewTrigger = `${hideModelEditor}`;

  const { t } = useTranslation("common");

  if (isMobile) {
    return (
      <div className={styles.modelEditor}>
        <MobileLayout
          universeCode={states.universeCode}
          constantsCode={states.constantsCode}
          predicatesCode={states.predicatesCode}
          queryCode={states.queryCode}
          queryResult={states.queryResult}
          errors={errors}
          syntaxErrors={syntaxErrors}
          handlePredicatesCodeChange={handlers.handlePredicatesCodeChange}
          handleUniverseCodeChange={handlers.handleUniverseCodeChange}
          handleConstantsCodeChange={handlers.handleConstantsCodeChange}
          handleQueryCodeChange={handlers.handleQueryCodeChange}
          handleExecuteQuery={handlers.handleExecuteQuery}
          handleExportPrologCode={handlers.handleExportPrologCode}
          visualization={visualization}
          fitViewTrigger={fitViewTrigger}
          hideModelEditor={hideModelEditor}
        />
      </div>
    );
  }

  return (
    <div className={styles.modelEditor}>
      <PanelGroup direction="horizontal">
        {!hideModelEditor && (
          <Panel
            id="CodeEditors"
            order={1}
            className={styles.panel}
            defaultSize={isMobile ? 60 : defaultSizes.editors}
            style={{ padding: 0 }}
            minSize={ROOT_PANEL_MIN_SIZE}
            maxSize={ROOT_PANEL_MAX_SIZE}
            collapsible={false}
          >
            <CodeEditors
              universeCode={states.universeCode}
              constantsCode={states.constantsCode}
              predicatesCode={states.predicatesCode}
              queryCode={states.queryCode}
              queryResult={states.queryResult}
              errors={errors}
              syntaxErrors={syntaxErrors}
              handlePredicatesCodeChange={handlers.handlePredicatesCodeChange}
              handleUniverseCodeChange={handlers.handleUniverseCodeChange}
              handleConstantsCodeChange={handlers.handleConstantsCodeChange}
              handleQueryCodeChange={handlers.handleQueryCodeChange}
              handleExecuteQuery={handlers.handleExecuteQuery}
            />
          </Panel>
        )}
        {!hideModelEditor && (
          <PanelResizeHandle className={styles.panelResizeHandleHorizontal} />
        )}

        <Panel
          id="visualization"
          order={2}
          className={`${styles.visualizationContainer} ${styles.panel}`}
          style={{ padding: 0 }}
          defaultSize={hideModelEditor ? 100 : defaultSizes.visualization}
          minSize={ROOT_PANEL_MIN_SIZE}
          collapsible={false}
        >
          <Visualization
            edges={visualization.edges}
            nodes={visualization.nodes}
            onConnect={visualization.onConnect}
            onEdgesChange={visualization.onEdgesChange}
            onNodesChange={visualization.onNodesChange}
            fitViewTrigger={fitViewTrigger}
          />

          {!isMobile && (
            <div className={styles.buttonsContainer}>
              <Button
                text={t("actions.exportPrologCode")}
                onClick={handlers.handleExportPrologCode}
                variant="primary"
                style={{ width: "auto" }}
              />
            </div>
          )}
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default React.memo(ModelEditor);
