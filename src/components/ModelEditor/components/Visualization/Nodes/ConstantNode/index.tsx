import { Handle, Position } from "@xyflow/react";
import styles from "./index.module.css";
import textStyles from "../../../../../../textStyles.module.css";
import type { ConstantNodeProps } from "../../../../types";
import React from "react";

const ConstantNode = ({ data }: ConstantNodeProps) => {
  return (
    <div className={styles.constantNode}>
      <span className={textStyles.textbody}>{data.label}</span>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: "none",
          border: "none",
          right: "4px",
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: "none",
          border: "none",
        }}
      />
    </div>
  );
};

export default React.memo(ConstantNode);
