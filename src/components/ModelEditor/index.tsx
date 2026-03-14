import styles from "./index.module.css";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import Visualization from "./components/Visualization";

import CodeEditors from "./components/CodeEditors";

import type { ModelEditorState } from "../../hooks/useModelEditor";
import Button from "../Button";
import { defaultSizes } from "./constants";
import { useMediaQuery } from "../../hooks/useMediaQuery";

import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation("common");

  return (
    <div className={styles.modelEditor}>
      <PanelGroup direction="horizontal">
        {!hideModelEditor && (
          <Panel
            id="CodeEditors"
            order={1}
            className={styles.panel}
            defaultSize={isMobile ? 100 : defaultSizes.editors}
            style={{ padding: 0 }}
            minSize={40}
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
              isMobile={isMobile}
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
          minSize={30}
        >
          <Visualization
            edges={visualization.edges}
            nodes={visualization.nodes}
            onConnect={visualization.onConnect}
            onEdgesChange={visualization.onEdgesChange}
            onNodesChange={visualization.onNodesChange}
          />

          {!isMobile && (
            <div className={styles.buttonsContainer}>
              <Button
                text={t("actions.createVisualization")}
                onClick={() => visualization.generateVisualization()}
                variant="primary"
              />
              <Button
                text={t("actions.exportPrologCode")}
                onClick={() => handlers.handleExportPrologCode()}
                variant="primary"
              />
            </div>
          )}
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default ModelEditor;
