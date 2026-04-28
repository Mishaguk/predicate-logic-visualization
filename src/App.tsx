import { useEffect, useRef, useState } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";
import "./App.css";

import { loader } from "@monaco-editor/react";
import { defineTheme } from "./components/CodeEditor/theme";
import Header from "./components/Header";
import ModelEditor from "./components/ModelEditor";
import ExamplesModal, { type Example } from "./components/Examples";
import SyntaxGuide from "./components/SyntaxGuide";
import PrologExportModal from "./components/PrologExportModal";
import { registerUniverseLanguage } from "./dsl/universe/language";
import { useModelEditor } from "./hooks/useModelEditor";
import { registerQueryLanguage } from "./dsl/query/language";
import { useTour } from "./hooks/useTour";
import {
  downloadProjectFile,
  parseProject,
  serializeProject,
} from "./persistence/projectFile";

function App() {
  const modelEditor = useModelEditor();
  const [examplesOpen, setExamplesOpen] = useState(false);
  const [syntaxGuideOpen, setSyntaxGuideOpen] = useState(false);
  const [codePanelHidden, setCodePanelHidden] = useState(false);
  const [prologExportOpen, setPrologExportOpen] = useState(false);
  const [prologCode, setPrologCode] = useState<string | null>(null);
  const codePanelRef = useRef<ImperativePanelHandle | null>(null);

  const { startTour } = useTour({
    onBeforeStart: () => {
      if (codePanelRef.current?.isCollapsed()) codePanelRef.current.expand();
    },
  });

  const handleOpenPrologExport = () => {
    setPrologCode(modelEditor.code.handlers.getPrologCode());
    setPrologExportOpen(true);
  };

  const toggleCodePanel = () => {
    const panel = codePanelRef.current;
    if (!panel) return;
    if (panel.isCollapsed()) panel.expand();
    else panel.collapse();
  };

  useEffect(() => {
    loader.init().then((monaco) => {
      registerUniverseLanguage(monaco);
      registerQueryLanguage(monaco);
      defineTheme(monaco);
    });
  }, []);

  const handleSaveProject = () => {
    const { universeCode, constantsCode, predicatesCode, queryCode } =
      modelEditor.code.states;
    const json = serializeProject({
      universe: universeCode,
      constants: constantsCode,
      predicates: predicatesCode,
      query: queryCode,
    });
    downloadProjectFile("project.json", json);
  };

  const handleLoadProject = async (file: File) => {
    const text = await file.text();
    const result = parseProject(text);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    modelEditor.code.handlers.handleLoadProject(result.project);
  };

  const handleSelectExample = (example: Example) => {
    modelEditor.code.handlers.handleUniverseCodeChange(example.universe);
    modelEditor.code.handlers.handleConstantsCodeChange(example.constants);
    modelEditor.code.handlers.handlePredicatesCodeChange(example.predicates);
    modelEditor.code.handlers.handleQueryCodeChange(example.query);
    setExamplesOpen(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        boxSizing: "border-box",
        padding: "16px",
        height: "100%",
      }}
    >
      <Header
        onOpenExamples={() => setExamplesOpen(true)}
        onOpenSyntaxGuide={() => setSyntaxGuideOpen(true)}
        onToggleCodePanel={toggleCodePanel}
        isCodePanelHidden={codePanelHidden}
        onStartTour={startTour}
        onSaveProject={handleSaveProject}
        onLoadProject={handleLoadProject}
      />
      <ModelEditor
        {...modelEditor}
        hideModelEditor={codePanelHidden}
        codePanelRef={codePanelRef}
        onCodePanelCollapse={() => setCodePanelHidden(true)}
        onCodePanelExpand={() => setCodePanelHidden(false)}
        onOpenPrologExport={handleOpenPrologExport}
      />
      <ExamplesModal
        open={examplesOpen}
        onClose={() => setExamplesOpen(false)}
        onSelectExample={handleSelectExample}
      />
      <SyntaxGuide
        open={syntaxGuideOpen}
        onClose={() => setSyntaxGuideOpen(false)}
      />
      <PrologExportModal
        open={prologExportOpen}
        onClose={() => setPrologExportOpen(false)}
        code={prologCode}
      />
    </div>
  );
}

export default App;
