import { Panel } from "@xyflow/react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "../../../../Button";
import { IconCross } from "../../../../../assets";
import type {
  AddMemberReason,
  AddMemberResult,
} from "../../../../../dsl/universe/universe.edit";
import { popupTransition, popupVariants } from "../animations";
import styles from "./index.module.css";

type Props = {
  onAdd: (name: string) => AddMemberResult;
};

const AddNode = ({ onAdd }: Props) => {
  const { t } = useTranslation("common");

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<AddMemberReason | null>(null);

  const open = useCallback(() => setIsOpen(true), []);

  const handleNameChange = useCallback((value: string) => {
    setName(value);
    setError(null);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setName("");
    setError(null);
  }, []);

  const submit = useCallback(() => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const result = onAdd(trimmed);
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    close();
  }, [name, onAdd, close]);

  return (
    <Panel position="top-left">
      <Button
        text={t("actions.addNode")}
        onClick={open}
        style={{ width: "auto" }}
      />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.card}
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={popupTransition}
          >
            <div className={styles.row}>
              <input
                autoFocus
                value={name}
                placeholder={t("placeholders.nodeName")}
                onChange={(event) => handleNameChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") submit();
                  if (event.key === "Escape") close();
                }}
              />
              <Button
                text={t("actions.add")}
                onClick={submit}
                variant="primary"
                style={{ width: "auto" }}
              />
              <button
                type="button"
                className={styles.close}
                onClick={close}
                aria-label={t("actions.close")}
              >
                <IconCross aria-hidden="true" />
              </button>
            </div>
            {error && (
              <span className={styles.error}>{t(`nodeErrors.${error}`)}</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Panel>
  );
};

export default AddNode;
