import styles from "./index.module.css";
import textStyles from "../../textStyles.module.css";
import type { ButtonHTMLAttributes } from "react";
import Icon from "../Icon";
type Props = {
  text: string;
  icon?: string;
  variant?: "white" | "primary";
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ text, icon, variant = "white", ...props }: Props) => {
  return (
    <button
      className={`${styles.button} ${variant === "primary" ? styles.primary : ""}`}
      {...props}
    >
      <div className={styles.buttonContent}>
        {icon && <Icon src={icon} alt="" />}
        <span
          className={textStyles.textBody}
          style={{ textTransform: "capitalize" }}
        >
          {text}
        </span>
      </div>
    </button>
  );
};

export default Button;
