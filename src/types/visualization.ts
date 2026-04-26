import type { Node } from "@xyflow/react";

export type ConstantNodeData = {
  label: string;
  possibleVariables: string | null;
};

export type ConstantNode = Node<ConstantNodeData, "constant">;

export type HyperEdgeNodeData = {
  label: string;
};

export type HyperEdgeNode = Node<HyperEdgeNodeData, "hyperEdge">;

export type AnyVisualizationNode = ConstantNode | HyperEdgeNode;
