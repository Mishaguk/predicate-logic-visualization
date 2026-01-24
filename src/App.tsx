import { useEffect } from "react";
import "./App.css";

import { loader } from "@monaco-editor/react";
import { defineTheme } from "./components/CodeEditor/theme";
import Header from "./components/Header";
import ModelEditor from "./components/ModelEditor";
import { registerUniverseLanguage } from "./dsl/universe/language";

function App() {
  useEffect(() => {
    loader.init().then((monaco) => {
      registerUniverseLanguage(monaco);

      defineTheme(monaco);
    });
  }, []);

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
      <Header />
      <ModelEditor />
    </div>
  );
}

export default App;
