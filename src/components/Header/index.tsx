import { iconHelp, iconLayers } from "../../assets";
import { useTranslation } from "react-i18next";
import Button from "../Button";
import LanguageSwitch from "../LanguageSwitch";
import ThemeSwitch from "../ThemeSwitch";
import styles from "./index.module.css";
import React from "react";
import CheckBox from "../Checkbox";

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

  return (
    <div className={styles.header}>
      <div className={styles.headerButtons}>
        <CheckBox
          isChecked={isCodePanelHidden}
          onCheck={onCodePanelHiddenChange}
          text="hide model editor"
        />
        <LanguageSwitch />
        <ThemeSwitch />
      </div>
      <div className={styles.headerButtons}>
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
    </div>
  );
};

export default React.memo(Header);
