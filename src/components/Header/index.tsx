import { iconHelp, iconLayers, iconMenu } from "../../assets";
import { useTranslation } from "react-i18next";
import Button from "../Button";
import LanguageSwitch from "../LanguageSwitch";
import ThemeSwitch from "../ThemeSwitch";
import styles from "./index.module.css";
import React, { useState } from "react";
import CheckBox from "../Checkbox";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import Icon from "../Icon";

type Props = {
  onOpenExamples: () => void;
  onOpenSyntaxGuide: () => void;
  isCodePanelHidden?: boolean;
  onCodePanelHiddenChange: (value: boolean) => void;
};

const Header = ({
  onOpenExamples,
  onOpenSyntaxGuide,
  isCodePanelHidden,
  onCodePanelHiddenChange,
}: Props) => {
  const { t } = useTranslation("common");
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const shouldShowMenuContent = !isMobile || isMenuOpen;

  return (
    <div className={styles.header}>
      {isMobile && (
        <button
          className={styles.menuToggle}
          type="button"
          aria-label={t("nav.menu")}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <Icon src={iconMenu} alt={t("nav.menu")} />
        </button>
      )}

      {shouldShowMenuContent && (
        <>
          <div className={`${styles.headerButtons} ${styles.headerControls}`}>
            {!isMobile && (
              <CheckBox
                isChecked={isCodePanelHidden}
                onCheck={onCodePanelHiddenChange}
                text="hide model editor"
              />
            )}

            <LanguageSwitch />
            <ThemeSwitch />
          </div>
          <div className={`${styles.headerButtons} ${styles.headerActions}`}>
            <Button
              text={t("nav.examples")}
              icon={iconLayers}
              onClick={onOpenExamples}
            />
            <Button
              text={t("nav.syntaxGuide")}
              icon={iconHelp}
              onClick={onOpenSyntaxGuide}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(Header);
