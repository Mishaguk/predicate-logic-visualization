import styles from "./index.module.css";

import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
  type ImperativePanelHandle,
} from "react-resizable-panels";

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
import type { RefObject } from "react";

// type TabIndex = "model" | "visualization";

type Props = ModelEditorState & {
  hideModelEditor?: boolean;
  codePanelRef?: RefObject<ImperativePanelHandle | null>;
  onCodePanelCollapse?: () => void;
  onCodePanelExpand?: () => void;
  onOpenPrologExport?: () => void;
};

const ModelEditor = ({
  visualization,
  code,
  hideModelEditor = false,
  codePanelRef,
  onCodePanelCollapse,
  onCodePanelExpand,
  onOpenPrologExport,
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
          onOpenPrologExport={onOpenPrologExport}
          visualization={visualization}
          fitViewTrigger={fitViewTrigger}
          hideModelEditor={hideModelEditor}
          constantNames={states.constantNames}
          universeMembers={states.universeMembers}
          predicateNames={states.predicateNames}
        />
      </div>
    );
  }

  return (
    <div className={styles.modelEditor}>
      <PanelGroup direction="horizontal">
        <Panel
          id="CodeEditors"
          order={1}
          ref={codePanelRef}
          className={styles.panel}
          defaultSize={isMobile ? 60 : defaultSizes.editors}
          style={{ padding: 0 }}
          minSize={ROOT_PANEL_MIN_SIZE}
          maxSize={ROOT_PANEL_MAX_SIZE}
          collapsible
          collapsedSize={0}
          onCollapse={onCodePanelCollapse}
          onExpand={onCodePanelExpand}
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
            constantNames={states.constantNames}
            universeMembers={states.universeMembers}
            predicateNames={states.predicateNames}
          />
        </Panel>
        <PanelResizeHandle className={styles.panelResizeHandleHorizontal} />

        <Panel
          id="visualization"
          order={2}
          className={`${styles.visualizationContainer} ${styles.panel}`}
          style={{ padding: 0 }}
          defaultSize={defaultSizes.visualization}
          minSize={ROOT_PANEL_MIN_SIZE}
          collapsible={false}
        >
          <div data-tour="visualization-panel" style={{ flex: 1, display: "flex", minHeight: 0 }}>
            <Visualization
              edges={visualization.edges}
              nodes={visualization.nodes}
              onConnect={visualization.onConnect}
              onEdgesChange={visualization.onEdgesChange}
              onNodesChange={visualization.onNodesChange}
              fitViewTrigger={fitViewTrigger}
            />
          </div>

          {!isMobile && (
            <div className={styles.buttonsContainer} data-tour="export-btn">
              <Button
                text={t("actions.exportPrologCode")}
                onClick={onOpenPrologExport}
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
