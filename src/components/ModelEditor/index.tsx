import styles from "./index.module.css";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import Visualization from "./components/Visualization";

import CodeEditors from "./components/CodeEditors";

import { useModelEditor } from "../../hooks/useModelEditor";
import Button from "../Button";
import { defaultSizes } from "./constants";
import { useMediaQuery } from "../../hooks/useMediaQuery";

import textStyles from "../../textStyles.module.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type TabIndex = "model" | "visualization";

const ModelEditor = () => {
  const {
    visualization,
    code: { states, errors, syntaxErrors, handlers },
  } = useModelEditor();

  const isMobile = useMediaQuery("(max-width: 900px)");

  const { t } = useTranslation("common");

  const [tabIndex, setTabIndex] = useState<TabIndex>("model");

  const handleTabChange = (tabIndex: TabIndex) => {
    setTabIndex(tabIndex);
    if (tabIndex === "visualization") {
      visualization.generateVisualization();
    }
  };

  const showModelPanel = !isMobile || tabIndex === "model";
  const showVisualizationPanel = !isMobile || tabIndex === "visualization";

  return (
    <div className={styles.modelEditor}>
      {isMobile && (
        <nav className={styles.mobileNavigation}>
          <span
            className={`${textStyles.textBody} ${styles.mobileTab} ${
              tabIndex === "model" ? styles.mobileTabActive : ""
            }`}
            onClick={() => handleTabChange("model")}
          >
            Edit Model
          </span>
          <span
            className={`${textStyles.textBody} ${styles.mobileTab} ${
              tabIndex === "visualization" ? styles.mobileTabActive : ""
            }`}
            onClick={() => handleTabChange("visualization")}
          >
            Visualization
          </span>
        </nav>
      )}
      <PanelGroup direction="horizontal">
        {showModelPanel && (
          <Panel
            className={styles.panel}
            defaultSize={isMobile ? 100 : defaultSizes.editors}
            style={{ padding: 0 }}
            minSize={40}
          >
            <CodeEditors
              universeCode={states.universeCode}
              constantsCode={states.constantsCode}
              predicatesCode={states.predicatesCode}
              errors={errors}
              syntaxErrors={syntaxErrors}
              handlePredicatesCodeChange={handlers.handlePredicatesCodeChange}
              handleUniverseCodeChange={handlers.handleUniverseCodeChange}
              handleConstantsCodeChange={handlers.handleConstantsCodeChange}
              isMobile={isMobile}
            />
          </Panel>
        )}
        {!isMobile && (
          <PanelResizeHandle className={styles.panelResizeHandleHorizontal} />
        )}
        {showVisualizationPanel && (
          <Panel
            className={`${styles.visualizationContainer} ${styles.panel}`}
            style={{ padding: 0 }}
            defaultSize={isMobile ? 100 : defaultSizes.visualization}
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
                  variant="primary"
                />
              </div>
            )}
          </Panel>
        )}
      </PanelGroup>
    </div>
  );
};

export default ModelEditor;
