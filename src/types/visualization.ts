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

// Each graph edge is derived from a predicate statement. Carrying the
// predicate's name + constant-name args lets edge deletion map back to the
// exact statement to remove from the predicates buffer.
export type PredicateEdgeData = {
  predicate: { name: string; args: string[] };
};
