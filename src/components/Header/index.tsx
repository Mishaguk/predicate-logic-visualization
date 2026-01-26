import { iconHelp, iconLayers } from "../../assets";
import { useTranslation } from "react-i18next";
import Button from "../Button";
import LanguageSwitch from "../LanguageSwitch";
import ThemeSwitch from "../ThemeSwitch";
import styles from "./index.module.css";

const Header = () => {
  const { t } = useTranslation("common");

  return (
    <div className={styles.header}>
      <div className={styles.headerButtons}>
        <LanguageSwitch />
        <ThemeSwitch />
      </div>
      <div className={styles.headerButtons}>
        <Button text={t("nav.examples")} icon={iconLayers} />
        <Button text={t("nav.syntaxGuide")} icon={iconHelp} />
      </div>
    </div>
  );
};

export default Header;
