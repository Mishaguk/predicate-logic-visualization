import styles from "./index.module.css";
import textStyles from "../../textStyles.module.css";
import type { ButtonHTMLAttributes, ComponentType, SVGProps } from "react";

type SvgIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type Props = {
  text: string;
  icon?: string | SvgIconComponent;
  variant?: "white" | "primary";
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ text, icon, variant = "white", ...props }: Props) => {
  const IconComponent = typeof icon === "string" ? null : icon;

  return (
    <button
      className={`${styles.button} ${variant === "primary" ? styles.primary : styles.white}`}
      {...props}
    >
      <div className={styles.buttonContent}>
        {IconComponent && <IconComponent aria-hidden="true" />}
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
