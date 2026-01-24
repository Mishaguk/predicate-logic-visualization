import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  MarkerType,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from "@xyflow/react";
import { useCallback, useMemo, useState } from "react";
import type { Model } from "../../types/index";
import { buildModel, validateModel } from "../../semantic/buildModel";

const offsetX = 200;
const offsetY = 100;

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

export const useModelEditor = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const [predicatesCode, setPredicatesCode] = useState("");
  const [constantsCode, setConstantsCode] = useState("Ann -> a\nPeter -> b");
  const [universeCode, setUniverseCode] = useState("{a,b,c}");

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

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
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

  const model = useMemo(() => {
    try {
      return buildModel(universeCode, constantsCode, predicatesCode);
    } catch {
      return null;
    }
  }, [universeCode, constantsCode, predicatesCode]);

  const errors = useMemo(() => {
    if (!model) return ["Invalid model syntax"];
    return validateModel(model);
  }, [model]);

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

  const getNodes = useCallback((model: Model): Node[] => {
    const nodeMap = new Map<string, Node>();

    model.predicates.forEach((predicate) => {
      const entities = predicate.args;

      entities.forEach((entityName, argIndex) => {
        if (!entityName) return;

        if (!nodeMap.has(entityName)) {
          nodeMap.set(entityName, {
            id: entityName,
            position: {
              x: argIndex * offsetX,
              y: nodeMap.size * offsetY,
            },
            data: { label: entityName },
            type: "constant",
          });
        }
      });
    });

    return Array.from(nodeMap.values());
  }, []);

  const getEdges = useCallback((model: Model): Edge[] => {
    const edges: Edge[] = [];

    model.predicates.forEach(({ name, args }) => {
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

        edges.push({
          id: `${source}->${target}-${name}`,
          source,
          target,
          label: name,
          ...edgeStyle,
          ...(source === target && { type: "selfConnecting" }),
        });
        return;
      }

      // args.length > 2: skip at this moment
    });

    return edges;
  }, []);

  const generateVisualization = useCallback(() => {
    if (!model || errors.length) return;
    const nodes = getNodes(model);
    const edges = getEdges(model);
    setNodes(nodes);
    setEdges(edges);
  }, [setNodes, getNodes, setEdges, getEdges, model, errors]);

  return {
    code: {
      states: {
        predicatesCode,
        constantsCode,
        universeCode,
      },
      handlers: {
        handlePredicatesCodeChange,
        handleUniverseCodeChange,
        handleConstantsCodeChange,
      },
      errors,
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
