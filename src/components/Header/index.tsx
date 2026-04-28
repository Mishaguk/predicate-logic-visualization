import {
  IconHelp,
  IconLayers,
  IconMenu,
  IconBook,
  IconSave,
  IconLoad,
} from "../../assets";
import { useTranslation } from "react-i18next";
import Button from "../Button";
import LanguageSwitch from "../LanguageSwitch";
import ThemeSwitch from "../ThemeSwitch";
import styles from "./index.module.css";
import React, { useEffect, useRef, useState } from "react";
import CheckBox from "../Checkbox";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  onOpenExamples: () => void;
  onOpenSyntaxGuide: () => void;
  isCodePanelHidden?: boolean;
  onToggleCodePanel: () => void;
  onStartTour: () => void;
  onSaveProject: () => void;
  onLoadProject: (file: File) => void;
};

const panelVariants = {
  hidden: { opacity: 0, y: -6, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.98 },
};

const Header = ({
  onOpenExamples,
  onOpenSyntaxGuide,
  isCodePanelHidden,
  onToggleCodePanel,
  onStartTour,
  onSaveProject,
  onLoadProject,
}: Props) => {
  const { t } = useTranslation("common");
  const isMobile = useMediaQuery("(max-width: 1140px)");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const burgerRef = useRef<HTMLDivElement | null>(null);

  const shouldShowMenuContent = !isMobile || isMenuOpen;

  useEffect(() => {
    if (!isBurgerOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        burgerRef.current &&
        !burgerRef.current.contains(event.target as Node)
      ) {
        setIsBurgerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isBurgerOpen]);

  const handleSaveClick = () => {
    onSaveProject();
    setIsBurgerOpen(false);
  };

  const handleLoadClick = () => {
    fileInputRef.current?.click();
    setIsBurgerOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onLoadProject(file);
    event.target.value = "";
  };

  return (
    <div className={styles.header} data-tour="header">
      {isMobile && (
        <button
          className={styles.menuToggle}
          type="button"
          aria-label={t("nav.menu")}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <IconMenu />
        </button>
      )}

      {shouldShowMenuContent && (
        <>
          <div className={`${styles.headerButtons}`}>
            {isMobile ? (
              <>
                <Button
                  text={t("nav.saveProject")}
                  icon={IconSave}
                  onClick={handleSaveClick}
                  data-tour="save-project-btn"
                />
                <Button
                  text={t("nav.loadProject")}
                  icon={IconLoad}
                  onClick={handleLoadClick}
                  data-tour="load-project-btn"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json,.json"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </>
            ) : (
              <div className={styles.burgerWrapper} ref={burgerRef}>
                <Button
                  text={t("nav.projectMenu")}
                  icon={IconMenu}
                  onClick={() => setIsBurgerOpen((prev) => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={isBurgerOpen}
                  data-tour="project-menu-btn"
                />
                <AnimatePresence>
                  {isBurgerOpen && (
                    <motion.div
                      className={styles.burgerPanel}
                      role="menu"
                      variants={panelVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                      <Button
                        text={t("nav.saveProject")}
                        icon={IconSave}
                        onClick={handleSaveClick}
                        data-tour="save-project-btn"
                      />
                      <Button
                        text={t("nav.loadProject")}
                        icon={IconLoad}
                        onClick={handleLoadClick}
                        data-tour="load-project-btn"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json,.json"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
            )}
            <Button
              text={t("nav.examples")}
              icon={IconLayers}
              onClick={onOpenExamples}
              data-tour="examples-btn"
            />
            {!isMobile && (
              <Button
                text={t("nav.tour")}
                icon={IconBook}
                onClick={onStartTour}
                data-tour="tour-btn"
              />
            )}
            <Button
              text={t("nav.syntaxGuide")}
              icon={IconHelp}
              onClick={onOpenSyntaxGuide}
              data-tour="syntax-guide-btn"
            />
          </div>
          <div className={`${styles.headerButtons}`}>
            {!isMobile && (
              <CheckBox
                isChecked={isCodePanelHidden}
                onCheck={onToggleCodePanel}
                text={t("nav.hideModelEditor")}
              />
            )}

            <LanguageSwitch />
            <ThemeSwitch />
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(Header);
