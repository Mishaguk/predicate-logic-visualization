import { useEffect, useState } from "react";
import "./App.css";

import { loader } from "@monaco-editor/react";
import { defineTheme } from "./components/CodeEditor/theme";
import Header from "./components/Header";
import ModelEditor from "./components/ModelEditor";
import ExamplesModal, { type Example } from "./components/ExamplesModal";
import { registerUniverseLanguage } from "./dsl/universe/language";
import { useModelEditor } from "./hooks/useModelEditor";

function App() {
  const modelEditor = useModelEditor();
  const [examplesOpen, setExamplesOpen] = useState(false);

  useEffect(() => {
    loader.init().then((monaco) => {
      registerUniverseLanguage(monaco);

      defineTheme(monaco);
    });
  }, []);

  const handleSelectExample = (example: Example) => {
    modelEditor.code.handlers.handleUniverseCodeChange(example.universe);
    modelEditor.code.handlers.handleConstantsCodeChange(example.constants);
    modelEditor.code.handlers.handlePredicatesCodeChange(example.predicates);
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
      <Header onOpenExamples={() => setExamplesOpen(true)} />
      <ModelEditor {...modelEditor} />
      <ExamplesModal
        open={examplesOpen}
        onClose={() => setExamplesOpen(false)}
        onSelectExample={handleSelectExample}
      />
    </div>
  );
}

export default App;
