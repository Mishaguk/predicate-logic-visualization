import { useCallback, useMemo } from "react";
import { useCodeState } from "./useCodeState";
import { useModelBuilder } from "./useModelBuilder";
import { parseQuery } from "../../dsl/query/query.parse";
import { useQueryExecutor } from "./useQueryExecutor";
import { useGraphVisualization } from "./useGraphVisualization";
import { serializeModelToProlog } from "./prolog";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from "@xyflow/react";
import type { ConstantNode } from "../../types/visualization";

export const useModelEditor = () => {
  const code = useCodeState();

  const {
    model,
    syntaxErrors: modelSyntaxErrors,
    semanticErrors,
  } = useModelBuilder(
    code.universeCode,
    code.constantsCode,
    code.predicatesCode,
  );

  const queryParseResult = useMemo(
    () => parseQuery(code.queryCode),
    [code.queryCode],
  );

  const syntaxErrors = useMemo(
    () => ({
      ...modelSyntaxErrors,
      query: queryParseResult.errors,
    }),
    [modelSyntaxErrors, queryParseResult.errors],
  );

  const errors = useMemo(() => {
    const syntaxMessages = [
      ...syntaxErrors.universe,
      ...syntaxErrors.constants,
      ...syntaxErrors.predicates,
      ...syntaxErrors.query,
    ].map((error) => error.message);
    return [...syntaxMessages, ...semanticErrors];
  }, [syntaxErrors, semanticErrors]);

  const { queryResult, execute } = useQueryExecutor(
    model,
    code.queryCode,
    errors,
  );

  const graph = useGraphVisualization(model, queryResult, errors);

  const handleExportPrologCode = useCallback(() => {
    if (!model || errors.length) return;

    const prologCode = serializeModelToProlog({
      model,
      queryAst: queryParseResult.value,
    });

    const blob = new Blob([prologCode], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "predicate-model.pl";
    link.click();

    URL.revokeObjectURL(url);
  }, [model, errors, queryParseResult.value]);

  return {
    code: {
      states: {
        predicatesCode: code.predicatesCode,
        constantsCode: code.constantsCode,
        universeCode: code.universeCode,
        queryCode: code.queryCode,
        queryResult,
      },
      handlers: {
        handlePredicatesCodeChange: (value: string | undefined) =>
          code.setPredicatesCode(value || ""),
        handleConstantsCodeChange: (value: string | undefined) =>
          code.setConstantsCode(value || ""),
        handleUniverseCodeChange: (value: string | undefined) =>
          code.setUniverseCode(value || ""),
        handleQueryCodeChange: (value: string | undefined) =>
          code.setQueryCode(value || ""),
        handleExecuteQuery: execute,
        handleExportPrologCode,
      },
      errors,
      syntaxErrors,
    },
    visualization: {
      nodes: graph.nodes,
      edges: graph.edges,
      onNodesChange: (changes: NodeChange<ConstantNode>[]) =>
        graph.setNodes((nds) => applyNodeChanges(changes, nds)),
      onEdgesChange: (changes: EdgeChange[]) =>
        graph.setEdges((eds) => applyEdgeChanges(changes, eds)),
      onConnect: (params: Connection) =>
        graph.setEdges((eds) => addEdge(params, eds)),
    },
  };
};

export type ModelEditorState = ReturnType<typeof useModelEditor>;
