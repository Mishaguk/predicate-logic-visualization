import { useMemo } from "react";
import { IconMoon, IconSun } from "../../assets";
import { useTheme } from "../../context/theme/useTheme";

import styles from "./index.module.css";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  const options = useMemo(
    () => [
      { id: "light" as const, label: "Light", icon: IconSun },
      { id: "dark" as const, label: "Dark", icon: IconMoon },
    ],
    [],
  );

  return (
    <div className={styles.switch} role="group" aria-label="Theme switch">
      {options.map((option) => {
        const isActive = theme === option.id;
        return (
          <button
            key={option.id}
            type="button"
            className={`${styles.option} ${isActive ? styles.active : ""}`}
            onClick={() => setTheme(option.id)}
            aria-pressed={isActive}
          >
            <option.icon />
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSwitch;
