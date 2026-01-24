import styles from "./index.module.css";
import textStyles from "../../textStyles.module.css";
import type { ButtonHTMLAttributes } from "react";
type Props = {
  text: string;
  icon?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ text, icon, ...props }: Props) => {
  return (
    <button className={styles.button} {...props}>
      <div className={styles.buttonContent}>
        {icon && <img src={icon} />}
        <span className={textStyles.textBody}>{text}</span>
      </div>
    </button>
  );
};

export default Button;
