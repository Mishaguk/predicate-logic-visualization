import ConstantNode from "./Nodes/ConstantNode";
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type Node,
  type Edge,
  Controls,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import React from "react";
import SelfConnectingEdge from "./Edges/SelfConnectingEdge";

import textStyles from "../../../../textStyles.module.css";
import { useTranslation } from "react-i18next";

const nodeTypes = {
  constant: ConstantNode,
};

const edgeTypes = {
  selfConnecting: SelfConnectingEdge,
};

type Props = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (params: Connection) => void;
};

const Visualization = ({
  nodes,
  edges,
  onEdgesChange,
  onNodesChange,
  onConnect,
}: Props) => {
  const { t } = useTranslation("common");

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
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
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
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      <Controls position="bottom-right" />
    </ReactFlow>
  );
};

export default React.memo(Visualization);
