import styles from "./index.module.css";

type Props = {
  isChecked?: boolean;
  onCheck: (value: boolean) => void;
  text?: string;
};

const CheckBox = ({ isChecked, onCheck, text }: Props) => {
  return (
    <label className={styles.checkbox}>
      <input
        className={styles.input}
        type="checkbox"
        onChange={(e) => onCheck(e.target.checked)}
        checked={isChecked}
      />
      {text && <span className={styles.text}>{text}</span>}
    </label>
  );
};

export default CheckBox;
