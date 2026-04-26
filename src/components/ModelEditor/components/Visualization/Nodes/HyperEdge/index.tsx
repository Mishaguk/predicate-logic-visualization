import { Handle, Position, type NodeProps } from "@xyflow/react";
import styles from "./index.module.css";
import textStyles from "../../../../../../textStyles.module.css";

import React from "react";
import type { HyperEdgeNode } from "../../../../../../types/visualization";

const HyperEdgeNode = ({ data }: NodeProps<HyperEdgeNode>) => {
  return (
    <div className={styles.hyperEdgeNode}>
      <span className={`${styles.label} ${textStyles.textbody}`}>{data.label}</span>

      <Handle
        type="target"
        id="target-right"
        position={Position.Right}
        style={{ background: "none", border: "none", right: "4px" }}
      />
      <Handle
        type="target"
        id="target-left"
        position={Position.Left}
        style={{ background: "none", border: "none" }}
      />
      <Handle
        type="target"
        id="target-top"
        position={Position.Top}
        style={{ background: "none", border: "none" }}
      />
      <Handle
        type="target"
        id="target-bottom"
        position={Position.Bottom}
        style={{ background: "none", border: "none" }}
      />
    </div>
  );
};

export default React.memo(HyperEdgeNode);
