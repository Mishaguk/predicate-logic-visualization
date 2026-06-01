import { Handle, NodeToolbar, Position, type NodeProps } from "@xyflow/react";
import styles from "./index.module.css";
import textStyles from "../../../../../../textStyles.module.css";

import React, { useState } from "react";
import type { ConstantNode } from "../../../../../../types/visualization";

const ConstantNode = ({ data }: NodeProps<ConstantNode>) => {
  const [hover, setHover] = useState<boolean>(false);

  return (
    <div
      className={`${styles.constantNode} ${
        data.possibleVariables
          ? styles.constantNodeMatched
          : styles.constantNodeDefault
      }`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {data.possibleVariables ? (
        <span className={styles.matchBadge} aria-label="Has variable matches">
          ?
        </span>
      ) : null}
      <span className={`${styles.label} ${textStyles.textbody}`}>
        {data.label}
      </span>

      <NodeToolbar isVisible={hover && !!data.possibleVariables}>
        <div className={styles.tooltip}>
          <span className={textStyles.textBody}>{data.possibleVariables}</span>
        </div>
      </NodeToolbar>
      <Handle type="source" id="source-right" position={Position.Right} />

      <Handle type="target" id="target-left" position={Position.Left} />

      <Handle type="target" id="target-top" position={Position.Top} />

      <Handle type="target" id="target-bottom" position={Position.Bottom} />
    </div>
  );
};

export default React.memo(ConstantNode);
