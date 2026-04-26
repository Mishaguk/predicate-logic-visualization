import { useCallback, useEffect, useRef, useState } from "react";
import type {
  AnyVisualizationNode,
  ConstantNode,
  HyperEdgeNode,
} from "../../../types/visualization";
import { MarkerType, type Edge } from "@xyflow/react";
import type { Binding, Model, QueryResult } from "../../../types";

import {
  computeLayers,
  buildBinaryEdges,
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

const hyperEdgeId = (name: string, args: string[]) =>
  `hyperedge-${name}-${args.join("|")}`;

const computeHyperEdgeNodes = (
  model: Model,
  existingPositions: Map<string, { x: number; y: number }>,
  constantPositions: Map<string, { x: number; y: number }>,
): HyperEdgeNode[] =>
  model.predicates
    .filter(({ universeArgs: args }) => args.length > 2)
    .map(({ name, universeArgs: args }) => {
      const id = hyperEdgeId(name, args);
      const connected = args.flatMap((a) => {
        const p = constantPositions.get(a);
        return p ? [p] : [];
      });
      const centroid =
        connected.length > 0
          ? {
              x: connected.reduce((s, p) => s + p.x, 0) / connected.length,
              y: connected.reduce((s, p) => s + p.y, 0) / connected.length,
            }
          : { x: 0, y: 0 };
      return {
        id,
        position: existingPositions.get(id) ?? centroid,
        data: { label: name },
        type: "hyperEdge" as const,
      };
    });

const computeNodes = (
  model: Model,
  currentNodes: AnyVisualizationNode[],
  resultValue: QueryResult["value"],
): ConstantNode[] => {
  const nodeMap = new Map<string, ConstantNode>();
  const existingPositions = new Map(
    currentNodes.map((node) => [node.id, node.position]),
  );

  const nodes = Array.from(model.universe.values()).flat();
  const binEdges = buildBinaryEdges(model);
  const layerMap = computeLayers(nodes, binEdges);
  const layerGroups = initialOrderInLayers(nodes, layerMap, existingPositions);

  const optimizedPositions = getPositionByLayers(
    layerGroups,
    binEdges,
    offsetX,
    offsetY,
  );

  nodes.forEach((element) => {
    const autoPos = optimizedPositions.get(element) ?? { x: 0, y: 0 };

    nodeMap.set(element, {
      id: element,
      position: existingPositions.get(element) ?? autoPos,
      data: {
        label: element,
        possibleVariables: Array.isArray(resultValue)
          ? getPossibleVariablesForValue(element, resultValue).join(", ")
          : null,
      },
      type: "constant",
    });
  });

  return Array.from(nodeMap.values());
};

const closestHyperEdgeHandle = (
  src: { x: number; y: number },
  tgt: { x: number; y: number },
): string => {
  const dx = Math.abs(src.x - tgt.x);
  const dy = src.y - tgt.y;
  if (Math.abs(dy) > dx) return dy < 0 ? "target-top" : "target-bottom";
  return src.x < tgt.x ? DEFAULT_TARGET_HANDLE : "target-right";
};

const computeEdges = (
  model: Model,
  currentNodes: AnyVisualizationNode[],
): Edge[] => {
  const edges: Edge[] = [];
  const directedPairs = new Set<string>();
  const nodePosById = new Map(
    currentNodes.map((node) => [node.id, node.position]),
  );
  const nodeYById = new Map(
    currentNodes.map((node) => [node.id, node.position.y]),
  );

  model.predicates.forEach(({ universeArgs: args }) => {
    if (args.length === 2) {
      const [source, target] = args;
      if (source && target && source !== target) {
        directedPairs.add(`${source}|${target}`);
      }
    }
  });

  model.predicates.forEach(({ name, universeArgs: args }) => {
    if (args.length === 1) {
      const node = args[0];
      edges.push({
        id: `${node}->${node}-${name}`,
        source: node,
        target: node,
        label: name,
        ...edgeStyle,
        type: "selfConnecting",
      });
      return;
    }

    if (args.length === 2) {
      const [source, target] = args;
      const hasReverse = directedPairs.has(`${target}|${source}`);

      const useCycleLayout = hasReverse && source.localeCompare(target) > 0;

      const sourceY = nodeYById.get(source);
      const targetY = nodeYById.get(target);

      const useBottom =
        useCycleLayout &&
        sourceY != null &&
        targetY != null &&
        sourceY < targetY;

      const cycleHandle = useBottom
        ? CYCLE_TARGET_BOTTOM_HANDLE
        : CYCLE_TARGET_TOP_HANDLE;

      edges.push({
        id: `${source}->${target}-${name}`,
        source,
        target,
        label: name,
        sourceHandle: DEFAULT_SOURCE_HANDLE,
        targetHandle: useCycleLayout ? cycleHandle : DEFAULT_TARGET_HANDLE,
        ...edgeStyle,
      });
      return;
    }

    if (args.length > 2) {
      const hub = hyperEdgeId(name, args);
      const hubPos = nodePosById.get(hub);
      args.forEach((arg, i) => {
        const srcPos = nodePosById.get(arg);
        const targetHandle =
          srcPos && hubPos
            ? closestHyperEdgeHandle(srcPos, hubPos)
            : DEFAULT_TARGET_HANDLE;
        edges.push({
          id: `${arg}->hyperedge-${name}-${i}`,
          source: arg,
          target: hub,
          sourceHandle: DEFAULT_SOURCE_HANDLE,
          targetHandle,
          ...edgeStyle,
        });
      });
    }
  });

  return edges;
};

export const useGraphVisualization = (
  model: Model | null,
  queryResult: QueryResult["value"],
  errors: string[],
) => {
  const [nodes, setNodes] = useState<AnyVisualizationNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const nodesRef = useRef<AnyVisualizationNode[]>([]);

  const isValid = model && errors.length === 0;

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  const createGraph = useCallback(() => {
    if (!isValid || !model) {
      return;
    }

    const constantNodes = computeNodes(model, nodesRef.current, queryResult);
    const constantPositions = new Map(
      constantNodes.map((n) => [n.id, n.position]),
    );
    const existingPositions = new Map(
      nodesRef.current.map((n) => [n.id, n.position]),
    );
    const hyperEdgeNodes = computeHyperEdgeNodes(
      model,
      existingPositions,
      constantPositions,
    );
    const nextNodes: AnyVisualizationNode[] = [
      ...constantNodes,
      ...hyperEdgeNodes,
    ];
    const nextEdges = computeEdges(model, nextNodes);

    nodesRef.current = nextNodes;
    setNodes(nextNodes);
    setEdges(nextEdges);
  }, [isValid, model, queryResult]);

  useEffect(() => {
    createGraph();
  }, [createGraph]);

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    createGraph,
  };
};
