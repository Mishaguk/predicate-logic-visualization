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
import type { AnyVisualizationNode } from "../../types/visualization";
import type { ProjectFile } from "../../persistence/projectFile";

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

  const constantNames = useMemo(
    () => (model ? [...model.constants.keys()] : []),
    [model],
  );

  const universeMembers = useMemo(
    () => (model ? [...model.universe.values()].flat() : []),
    [model],
  );

  const predicateNames = useMemo(
    () =>
      model ? [...new Set(model.predicates.map((p) => p.name))] : [],
    [model],
  );

  const { queryResult, execute } = useQueryExecutor(
    model,
    code.queryCode,
    errors,
  );

  const graph = useGraphVisualization(model, queryResult, errors);
  const { setNodes, setEdges } = graph;

  const onNodesChange = useCallback(
    (changes: NodeChange<AnyVisualizationNode>[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleLoadProject = useCallback(
    (project: ProjectFile) => {
      code.setUniverseCode(project.universe);
      code.setConstantsCode(project.constants);
      code.setPredicatesCode(project.predicates);
      code.setQueryCode(project.query);
    },
    [code],
  );

  const handleClearModel = useCallback(() => {
    code.setUniverseCode("");
    code.setConstantsCode("");
    code.setPredicatesCode("");
    code.setQueryCode("");
  }, [code]);

  const getPrologCode = useCallback((): string | null => {
    if (!model || errors.length) return null;
    return serializeModelToProlog({
      model,
      queryAst: queryParseResult.value,
    });
  }, [model, errors, queryParseResult.value]);

  return {
    code: {
      states: {
        predicatesCode: code.predicatesCode,
        constantsCode: code.constantsCode,
        universeCode: code.universeCode,
        queryCode: code.queryCode,
        queryResult,
        constantNames,
        universeMembers,
        predicateNames,
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
        handleLoadProject,
        handleClearModel,
        getPrologCode,
      },
      errors,
      syntaxErrors,
    },
    visualization: {
      nodes: graph.nodes,
      edges: graph.edges,
      onNodesChange,
      onEdgesChange,
      onConnect,
    },
  };
};

export type ModelEditorState = ReturnType<typeof useModelEditor>;
