import ConstantNode from "./Nodes/ConstantNode";
import HyperEdgeNode from "./Nodes/HyperEdge";
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  useReactFlow,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type Edge,
  Controls,
  Panel,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import SelfConnectingEdge from "./Edges/SelfConnectingEdge";

import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../context/theme/useTheme";
import styles from "./index.module.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { AnyVisualizationNode } from "../../../../types/visualization";
import AddNode from "./AddNode";
import AddEdge from "./AddEdge";
import { IconTrash } from "../../../../assets";
import type { AddMemberResult } from "../../../../dsl/universe/universe.edit";
import type { AddPredicateResult } from "../../../../dsl/predicates/predicates.edit";
import Button from "../../../Button";

const DELETE_KEY_CODES = ["Delete", "Backspace"];

const nodeTypes = {
  constant: ConstantNode,
  hyperEdge: HyperEdgeNode,
};

const edgeTypes = {
  selfConnecting: SelfConnectingEdge,
};

type Props = {
  nodes: AnyVisualizationNode[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange<AnyVisualizationNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  handleConnect: (
    source: string,
    target: string,
    name: string,
  ) => AddPredicateResult;
  handleAddNode: (name: string) => AddMemberResult;
  handleDeleteEdges: (edges: Edge[]) => void;
  handleDeleteNodes: (nodes: AnyVisualizationNode[]) => void;
  fitViewTrigger?: string | number;
};

type AutoFitViewProps = {
  fitKey: string;
};

const AutoFitView = ({ fitKey }: AutoFitViewProps) => {
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (!fitKey) return;

    const frameId = requestAnimationFrame(() => {
      void fitView({ padding: 0.2, duration: 300 });
    });

    return () => cancelAnimationFrame(frameId);
  }, [fitView, fitKey]);

  return null;
};

const Visualization = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  handleConnect,
  handleAddNode,
  handleDeleteEdges,
  handleDeleteNodes,
  fitViewTrigger,
}: Props) => {
  const { t } = useTranslation("common");
  const { theme } = useTheme();

  const selectedEdges = useMemo(
    () => edges.filter((edge) => edge.selected),
    [edges],
  );
  const selectedNodes = useMemo(
    () => nodes.filter((node) => node.selected && node.type === "constant"),
    [nodes],
  );

  // Compute stable string keys from IDs only — positions don't affect these,
  // so drag events don't change nodeIdStr/edgeIdStr values and downstream
  // memos (graphKey, fitKey) stay stable during drag.
  const nodeIdStr = useMemo(
    () =>
      nodes
        .map((n) => n.id)
        .sort()
        .join("|"),
    [nodes],
  );
  const edgeIdStr = useMemo(
    () =>
      edges
        .map((e) => e.id)
        .sort()
        .join("|"),
    [edges],
  );

  const graphKey = useMemo(() => {
    if (!nodeIdStr && !edgeIdStr) return "";
    return `${nodeIdStr}::${edgeIdStr}`;
  }, [nodeIdStr, edgeIdStr]);

  const fitKey = useMemo(() => {
    if (!graphKey) return "";
    return `${graphKey}::${String(fitViewTrigger ?? "")}`;
  }, [graphKey, fitViewTrigger]);

  // Connecting two nodes opens a prompt (AddEdge) for the predicate name; the
  // predicate flows back through the model rather than as a transient edge.
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(
    null,
  );
  const onConnect = useCallback(
    (params: Connection) => setPendingConnection(params),
    [],
  );
  const clearConnection = useCallback(() => setPendingConnection(null), []);

  return (
    <ReactFlow
      className={styles.reactflow}
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      colorMode={theme}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onEdgesDelete={handleDeleteEdges}
      onNodesDelete={handleDeleteNodes}
      deleteKeyCode={DELETE_KEY_CODES}
      nodesDraggable
      nodesConnectable
      panOnDrag
      zoomOnScroll
      proOptions={{
        hideAttribution: true,
      }}
    >
      <AutoFitView fitKey={fitKey} />
      <AddNode onAdd={handleAddNode} />
      <AddEdge
        connection={pendingConnection}
        onSubmit={handleConnect}
        onClose={clearConnection}
      />
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      <Panel position="top-right">
        {selectedNodes.length > 0 && (
          <Button
            text={t("actions.deleteNode")}
            icon={IconTrash}
            onClick={() => handleDeleteNodes(selectedNodes)}
          />
        )}
        {selectedEdges.length > 0 && (
          <Button
            text={t("actions.deleteEdge")}
            icon={IconTrash}
            onClick={() => handleDeleteEdges(selectedEdges)}
          />
        )}
      </Panel>
      <Controls position="bottom-right" />
    </ReactFlow>
  );
};

export default React.memo(Visualization);
