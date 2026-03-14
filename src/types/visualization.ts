import type { Node } from "@xyflow/react";

export type ConstantNodeData = {
  label: string;
  possibleVariables: string | null;
};

export type ConstantNode = Node<ConstantNodeData, "constant">;
