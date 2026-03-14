import { useEffect, useState } from "react";
import "./App.css";

import { loader } from "@monaco-editor/react";
import { defineTheme } from "./components/CodeEditor/theme";
import Header from "./components/Header";
import ModelEditor from "./components/ModelEditor";
import ExamplesModal, { type Example } from "./components/Examples";
import SyntaxGuide from "./components/SyntaxGuide";
import { registerUniverseLanguage } from "./dsl/universe/language";
import { useModelEditor } from "./hooks/useModelEditor";
import { registerQueryLanguage } from "./dsl/query/language";
import { useMediaQuery } from "./hooks/useMediaQuery";

function App() {
  const modelEditor = useModelEditor();
  const [examplesOpen, setExamplesOpen] = useState(false);
  const [syntaxGuideOpen, setSyntaxGuideOpen] = useState(false);
  const [codePanelHidden, setCodePanelHidden] = useState(false);

  const isSmallScreen = useMediaQuery("(max-width: 900px)");

  useEffect(() => {
    loader.init().then((monaco) => {
      registerUniverseLanguage(monaco);
      registerQueryLanguage(monaco);
      defineTheme(monaco);
    });
  }, []);

  const handleSelectExample = (example: Example) => {
    modelEditor.code.handlers.handleUniverseCodeChange(example.universe);
    modelEditor.code.handlers.handleConstantsCodeChange(example.constants);
    modelEditor.code.handlers.handlePredicatesCodeChange(example.predicates);
    modelEditor.code.handlers.handleQueryCodeChange(example.query);
    setExamplesOpen(false);
  };

  if (isSmallScreen) {
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
        Application is not supported on small screens
      </div>
    );
  }

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
        onCodePanelHiddenChange={(value) => setCodePanelHidden(value)}
        isCodePanelHidden={codePanelHidden}
      />
      <ModelEditor {...modelEditor} hideModelEditor={codePanelHidden} />
      <ExamplesModal
        open={examplesOpen}
        onClose={() => setExamplesOpen(false)}
        onSelectExample={handleSelectExample}
      />
      <SyntaxGuide
        open={syntaxGuideOpen}
        onClose={() => setSyntaxGuideOpen(false)}
      />
    </div>
  );
}

export default App;
