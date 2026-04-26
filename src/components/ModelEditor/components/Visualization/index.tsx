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
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import SelfConnectingEdge from "./Edges/SelfConnectingEdge";

import textStyles from "../../../../textStyles.module.css";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../context/theme/useTheme";
import styles from "./index.module.css";
import React, { useEffect, useMemo } from "react";
import type { AnyVisualizationNode } from "../../../../types/visualization";

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
  onConnect: (params: Connection) => void;
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
  onConnect,
  fitViewTrigger,
}: Props) => {
  const { t } = useTranslation("common");
  const { theme } = useTheme();

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

  if (!nodes.length && !edges.length) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
        }}
      >
        <span className={textStyles.textBody} style={{ fontSize: "24px" }}>
          {t("placeholders.visualizationEmpty")}
        </span>
      </div>
    );
  }

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
      nodesDraggable
      nodesConnectable
      panOnDrag
      zoomOnScroll
      proOptions={{
        hideAttribution: true,
      }}
    >
      <AutoFitView fitKey={fitKey} />
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      <Controls position="bottom-right" />
    </ReactFlow>
  );
};

export default React.memo(Visualization);
