import styles from "./index.module.css";
import textStyles from "../../textStyles.module.css";
import type { DetailedHTMLProps, HTMLAttributes } from "react";
type Props = {
  text: string;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
const Chip = ({ text }: Props) => {
  return (
    <div className={styles.Chip}>
      <span className={textStyles.textBody}>{text}</span>
    </div>
  );
};

export default Chip;
