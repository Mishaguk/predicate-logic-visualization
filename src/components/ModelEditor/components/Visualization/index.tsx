import ConstantNode from "./Nodes/ConstantNode";
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
import type { ConstantNode as ConstantNodeT } from "../../../../types/visualization";

const nodeTypes = {
  constant: ConstantNode,
};

const edgeTypes = {
  selfConnecting: SelfConnectingEdge,
};

type Props = {
  nodes: ConstantNodeT[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange<ConstantNodeT>[]) => void;
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

  const graphKey = useMemo(() => {
    if (!nodes.length && !edges.length) return "";

    const nodeIds = [...nodes]
      .map((node) => node.id)
      .sort()
      .join("|");
    const edgeIds = [...edges]
      .map((edge) => edge.id)
      .sort()
      .join("|");

    return `${nodeIds}::${edgeIds}`;
  }, [nodes, edges]);

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
      fitView
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
