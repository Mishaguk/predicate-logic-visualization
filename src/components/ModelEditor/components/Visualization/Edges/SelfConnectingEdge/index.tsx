import {
  BaseEdge,
  BezierEdge,
  EdgeLabelRenderer,
  type EdgeProps,
} from "@xyflow/react";
import React from "react";
import styles from "./index.module.css";

const SelfConnectingEdge = (props: EdgeProps) => {
  const {
    source,
    target,
    sourceX,
    sourceY,
    targetX,
    targetY,
    markerEnd,
    style,
    label,
  } = props;

  if (source !== target) {
    return <BezierEdge {...props} />;
  }

  const radiusX = (sourceX - targetX) * 0.6;
  const radiusY = 50;
  const edgePath = `M ${sourceX - 5} ${sourceY} A ${radiusX} ${radiusY} 0 1 0 ${
    targetX + 2
  } ${targetY}`;

  const labelX = sourceX;
  const labelY = -radiusY + sourceY;

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
            }}
            className={styles.label}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default React.memo(SelfConnectingEdge);
