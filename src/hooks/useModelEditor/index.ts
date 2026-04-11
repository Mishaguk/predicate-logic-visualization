import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  MarkerType,
  type Connection,
  type Edge,
  type EdgeChange,
  type NodeChange,
} from "@xyflow/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Binding, Model, QueryResult } from "../../types/index";
import { buildModel } from "../../semantic/buildModel";
import { executeQuery } from "../../semantic/executeQuery";
import { parseQuery } from "../../dsl/query/query.parse";
import type { ConstantNode } from "../../types/visualization";
import { serializeModelToProlog } from "./prolog";
import {
  buildBinaryEdges,
  computeLayers,
  getPositionByLayers,
  initialOrderInLayers,
} from "./graph";

const offsetX = 200;
const offsetY = 150;

const edgeStyle = {
  markerEnd: {
    type: MarkerType.Arrow,
    width: 20,
    height: 20,
  },
  style: {
    strokeWidth: 1.5,
  },
};

const DEFAULT_SOURCE_HANDLE = "source-right";
const DEFAULT_TARGET_HANDLE = "target-left";
const CYCLE_TARGET_TOP_HANDLE = "target-top";
const CYCLE_TARGET_BOTTOM_HANDLE = "target-bottom";

const getPossibleVariablesForValue = (
  value: string,
  bindings: Binding[],
): string[] => {
  const variables = new Set<string>();

  bindings.forEach((binding) => {
    binding.forEach((boundValue, variableName) => {
      if (boundValue !== value) return;
      variables.add(variableName.replace(/^\?/, ""));
    });
  });

  return Array.from(variables);
};

export const useModelEditor = () => {
  const [nodes, setNodes] = useState<ConstantNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const [predicatesCode, setPredicatesCode] = useState("");
  const [constantsCode, setConstantsCode] = useState("");
  const [universeCode, setUniverseCode] = useState("");
  const [queryCode, setQueryCode] = useState("");
  const [queryResult, setQueryResult] = useState<QueryResult["value"]>(null);

  const handleConstantsCodeChange = useCallback((value: string | undefined) => {
    setConstantsCode(value || "");
  }, []);

  const handleUniverseCodeChange = useCallback((value: string | undefined) => {
    setUniverseCode(value || "");
  }, []);

  const handlePredicatesCodeChange = useCallback(
    (value: string | undefined) => {
      setPredicatesCode(value || "");
    },
    [],
  );
  const handleQueryCodeChange = useCallback((value: string | undefined) => {
    setQueryCode(value || "");
  }, []);

  const onNodesChange = useCallback(
    (changes: NodeChange<ConstantNode>[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const {
    model,
    syntaxErrors: modelSyntaxErrors,
    semanticErrors,
  } = useMemo(
    () => buildModel(universeCode, constantsCode, predicatesCode),
    [universeCode, constantsCode, predicatesCode],
  );

  const queryParseResult = useMemo(() => parseQuery(queryCode), [queryCode]);

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

  /* N-arity solution: facts as nodes */
  // const getNodes = useCallback((model: Model): Node[] => {
  //   const nodeMap = new Map<string, Node>();

  //   model.predicates.forEach(({ args }) => {
  //     args.forEach((entityName, argIndex) => {
  //       if (!nodeMap.has(entityName)) {
  //         nodeMap.set(entityName, {
  //           id: entityName,
  //           position: { x: argIndex * offsetX, y: nodeMap.size * offsetY },
  //           data: { label: entityName },
  //           type: "constant",
  //         });
  //       }
  //     });
  //   });

  //   model.predicates.forEach((p, i) => {
  //     const factId = `${p.name}#${i}`;
  //     if (!nodeMap.has(factId)) {
  //       nodeMap.set(factId, {
  //         id: factId,
  //         position: { x: -offsetX, y: nodeMap.size * offsetY },
  //         data: { label: p.name },
  //         type: "predicateFact",
  //       });
  //     }
  //   });

  //   return Array.from(nodeMap.values());
  // }, []);
  //   const getEdges = useCallback((model: Model): Edge[] => {
  //   const edges: Edge[] = [];

  //   model.predicates.forEach((predicate, index) => {
  //     const factId = `${predicate.name}#${index}`;

  //     predicate.args.forEach((arg, argIndex) => {
  //       edges.push({
  //         id: `${factId}->${arg}-arg${argIndex + 1}`,
  //         source: factId,
  //         target: arg,
  //         label: `arg${argIndex + 1}`,
  //         ...edgeStyle,
  //       });
  //     });
  //   });

  //   return edges;
  // }, []);

  const getNodes = useCallback(
    (
      model: Model,
      currentNodes: ConstantNode[] = [],
      resultValue: QueryResult["value"] = null,
    ): ConstantNode[] => {
      const nodeMap = new Map<string, ConstantNode>();
      const existingPositions = new Map(
        currentNodes.map((node) => [node.id, node.position]),
      );

      const nodes = Array.from(model.universe.values()).flat();
      const binEdges = buildBinaryEdges(model);
      const layerMap = computeLayers(nodes, binEdges);
      const layerGroups = initialOrderInLayers(
        nodes,
        layerMap,
        existingPositions,
      );

      // Calculate the optimized positions
      const optimizedPositions = getPositionByLayers(
        layerGroups,
        binEdges,
        offsetX, // horizontal gap between layers
        offsetY, // vertical gap between nodes
      );

      nodes.forEach((element) => {
        const autoPos = optimizedPositions.get(element) ?? { x: 0, y: 0 };

        nodeMap.set(element, {
          id: element,
          // Priority: 1. Existing pos, 2. Optimized auto-layout
          position: existingPositions.get(element) ?? autoPos,
          data: {
            label: `${element}`,
            possibleVariables: Array.isArray(resultValue)
              ? getPossibleVariablesForValue(element, resultValue).join(", ")
              : null,
          },
          type: "constant",
        });
      });

      return Array.from(nodeMap.values());
    },
    [],
  );

  const getEdges = useCallback(
    (model: Model, currentNodes: ConstantNode[] = []): Edge[] => {
      const edges: Edge[] = [];
      const directedPairs = new Set<string>();
      const nodeYById = new Map(
        currentNodes.map((node) => [node.id, node.position.y]),
      );

      model.predicates.forEach(({ universeArgs: args }) => {
        if (args.length !== 2) return;
        const [source, target] = args;
        if (!source || !target || source === target) return;
        directedPairs.add(`${source}|${target}`);
      });

      model.predicates.forEach(({ name, universeArgs: args }) => {
        if (args.length === 1) {
          const source = args[0];
          const target = args[0];

          edges.push({
            id: `${source}->${target}-${name}`,
            source,
            target,
            label: name,
            ...edgeStyle,
            type: "selfConnecting",
          });
          return;
        }

        if (args.length === 2) {
          const [source, target] = args;
          const hasReverseEdge =
            source !== target && directedPairs.has(`${target}|${source}`);
          const useTopTargetForCycle =
            hasReverseEdge && source.localeCompare(target) > 0;
          const sourceY = nodeYById.get(source);
          const targetY = nodeYById.get(target);
          const useBottomTarget =
            useTopTargetForCycle &&
            sourceY != null &&
            targetY != null &&
            sourceY < targetY;
          const cycleTargetHandle = useBottomTarget
            ? CYCLE_TARGET_BOTTOM_HANDLE
            : CYCLE_TARGET_TOP_HANDLE;

          edges.push({
            id: `${source}->${target}-${name}`,
            source,
            target,
            label: name,
            sourceHandle: DEFAULT_SOURCE_HANDLE,
            targetHandle: useTopTargetForCycle
              ? cycleTargetHandle
              : DEFAULT_TARGET_HANDLE,
            ...edgeStyle,
            ...(source === target && { type: "selfConnecting" }),
          });
          return;
        }

        // args.length > 2: skip at this moment
      });

      return edges;
    },
    [],
  );

  const generateVisualization = useCallback(() => {
    if (!model || errors.length) return;
    setNodes((nodesSnapshot) => {
      const nextNodes = getNodes(model, nodesSnapshot, queryResult);
      setEdges(getEdges(model, nextNodes));
      return nextNodes;
    });
  }, [setNodes, getNodes, setEdges, getEdges, model, errors, queryResult]);

  useEffect(() => {
    if (!model || errors.length) {
      return;
    }

    setNodes((nodesSnapshot) => {
      const nextNodes = getNodes(model, nodesSnapshot, queryResult);
      setEdges(getEdges(model, nextNodes));
      return nextNodes;
    });
  }, [model, errors.length, getNodes, getEdges, queryResult]);

  const handleExecuteQuery = useCallback(() => {
    if (errors.length || !model) {
      return;
    }

    const result = executeQuery(queryCode, model);
    setQueryResult(result.value);
    setNodes((nodesSnapshot) =>
      nodesSnapshot.length
        ? (() => {
            const nextNodes = getNodes(model, nodesSnapshot, result.value);
            setEdges((edgesSnapshot) =>
              edgesSnapshot.length ? getEdges(model, nextNodes) : edgesSnapshot,
            );
            return nextNodes;
          })()
        : nodesSnapshot,
    );
  }, [errors, model, queryCode, getNodes, setNodes, setEdges, getEdges]);

  const handleExportPrologCode = useCallback(() => {
    if (errors.length || !model) {
      return;
    }

    const prologCode = serializeModelToProlog({
      model,
      queryAst: queryParseResult.value,
    });

    const blob = new Blob([prologCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "predicate-model.pl";
    link.click();
    URL.revokeObjectURL(url);
  }, [errors.length, model, queryParseResult.value]);

  return {
    code: {
      states: {
        predicatesCode,
        constantsCode,
        universeCode,
        queryCode,
        queryResult,
      },
      handlers: {
        handlePredicatesCodeChange,
        handleUniverseCodeChange,
        handleConstantsCodeChange,
        handleQueryCodeChange,
        handleExecuteQuery,
        handleExportPrologCode,
      },
      errors,
      syntaxErrors,
    },
    visualization: {
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      onConnect,
      generateVisualization,
    },
  };
};

export type ModelEditorState = ReturnType<typeof useModelEditor>;
