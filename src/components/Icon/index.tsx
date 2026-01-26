import { useTheme } from "../../context/theme/useTheme";
import styles from "./index.module.css";

type Props = {
  src: string;
  alt?: string;
  className?: string;
};

const Icon = ({ src, alt = "", className }: Props) => {
  const { theme } = useTheme();
  const themeClass = theme === "dark" ? styles.dark : "";
  return (
    <img
      src={src}
      alt={alt}
      className={`${styles.icon} ${themeClass} ${className ?? ""}`}
    />
  );
};

export default Icon;
