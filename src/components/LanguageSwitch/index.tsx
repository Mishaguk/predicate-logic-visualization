import { useTranslation } from "react-i18next";
import type { LanguageCode } from "../../types";
import textStyles from "../../textStyles.module.css";
import styles from "./index.module.css";

const LanguageSwitch = () => {
  const { i18n } = useTranslation("common");
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language;
  const handleLanguageChange = (languageCode: LanguageCode) => {
    try {
      localStorage.setItem("appLanguage", languageCode);
    } catch (error) {
      console.error("Failed to persist language preference.", error);
    }
    i18n.changeLanguage(languageCode);
  };

  const languages: { code: LanguageCode; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "uk", label: "UA" },
    { code: "sk", label: "SK" },
  ];

  return (
    <div className={styles.switch} role="group" aria-label="Language switch">
      {languages.map((language) => {
        const isActive = currentLanguage === language.code;
        return (
          <button
            key={language.code}
            type="button"
            className={`${styles.option} ${isActive ? styles.active : ""}`}
            onClick={() => handleLanguageChange(language.code)}
            aria-pressed={isActive}
          >
            <span className={textStyles.textBody}>{language.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitch;
