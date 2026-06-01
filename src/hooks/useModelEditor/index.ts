import { useCallback, useMemo } from "react";
import { useCodeState } from "./useCodeState";
import { useModelBuilder } from "./useModelBuilder";
import { parseQuery } from "../../dsl/query/query.parse";
import { useQueryExecutor } from "./useQueryExecutor";
import { useGraphVisualization } from "./useGraphVisualization";
import { serializeModelToProlog } from "./prolog";
import {
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type EdgeChange,
  type NodeChange,
} from "@xyflow/react";
import type {
  AnyVisualizationNode,
  PredicateEdgeData,
} from "../../types/visualization";
import type { ProjectFile } from "../../persistence/projectFile";
import {
  addUniverseMember,
  removeUniverseMember,
  type AddMemberResult,
} from "../../dsl/universe/universe.edit";
import {
  addConstantMapping,
  removeConstantMapping,
} from "../../dsl/constants/constants.edit";
import {
  addPredicate,
  removePredicate,
  type AddPredicateResult,
} from "../../dsl/predicates/predicates.edit";

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
    () => (model ? [...new Set(model.predicates.map((p) => p.name))] : []),
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

  const handleConnect = useCallback(
    (source: string, target: string, name: string): AddPredicateResult => {
      // Node ids are universe members; resolve each back to a constant name
      // that points to it (predicates are written with constant names).
      const memberToConstant = new Map<string, string>();
      if (model) {
        for (const [constName, member] of model.constants) {
          if (!memberToConstant.has(member)) {
            memberToConstant.set(member, constName);
          }
        }
      }

      const sourceConst = memberToConstant.get(source);
      const targetConst = memberToConstant.get(target);
      if (!sourceConst || !targetConst) {
        return { ok: false, reason: "unresolved" };
      }

      // Connecting a node to itself is a self-loop → a unary predicate
      // (e.g. Loves(ann)); otherwise source is always the first argument.
      const args =
        source === target ? [sourceConst] : [sourceConst, targetConst];
      const result = addPredicate(code.predicatesCode, name, args);
      if (result.ok) code.setPredicatesCode(result.code);
      return result;
    },
    [code, model],
  );

  const handleDeleteEdges = useCallback(
    (deleted: Edge[]) => {
      // Each edge carries the predicate statement it was derived from; remove
      // those from the buffer and let the graph re-derive without them.
      // Functional update so it composes with node deletion when the Delete key
      // removes a node and its connected edges in the same batch.
      code.setPredicatesCode((prev) => {
        let next = prev;
        for (const edge of deleted) {
          const predicate = (edge.data as PredicateEdgeData | undefined)
            ?.predicate;
          if (predicate) next = removePredicate(next, predicate.name, predicate.args);
        }
        return next;
      });
    },
    [code],
  );

  const handleDeleteNodes = useCallback(
    (deleted: AnyVisualizationNode[]) => {
      if (!model) return;
      // Node ids are universe members; only constant nodes map to one.
      const members = new Set(
        deleted.filter((node) => node.type === "constant").map((node) => node.id),
      );
      if (members.size === 0) return;

      // Cascade: drop predicates referencing the member (by resolved arg),
      // the constants pointing at it, then the universe member itself.
      const predicatesToRemove = model.predicates.filter((predicate) =>
        predicate.universeArgs.some((arg) => members.has(arg)),
      );
      const constantsToRemove = [...model.constants]
        .filter(([, member]) => members.has(member))
        .map(([name]) => name);

      code.setPredicatesCode((prev) => {
        let next = prev;
        for (const predicate of predicatesToRemove) {
          next = removePredicate(next, predicate.name, predicate.args);
        }
        return next;
      });
      code.setConstantsCode((prev) => {
        let next = prev;
        for (const name of constantsToRemove) {
          next = removeConstantMapping(next, name);
        }
        return next;
      });
      code.setUniverseCode((prev) => {
        let next = prev;
        for (const member of members) {
          next = removeUniverseMember(next, member);
        }
        return next;
      });
    },
    [code, model],
  );

  const handleAddNode = useCallback(
    (name: string): AddMemberResult => {
      const result = addUniverseMember(code.universeCode, name);
      if (result.ok) {
        code.setUniverseCode(result.code);
        code.setConstantsCode(
          addConstantMapping(code.constantsCode, name.trim()),
        );
      }
      return result;
    },
    [code],
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
      handleConnect,
      handleAddNode,
      handleDeleteEdges,
      handleDeleteNodes,
    },
  };
};

export type ModelEditorState = ReturnType<typeof useModelEditor>;
