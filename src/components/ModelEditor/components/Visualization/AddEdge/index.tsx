import { Panel, type Connection } from "@xyflow/react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "../../../../Button";
import { IconCross } from "../../../../../assets";
import type {
  AddPredicateReason,
  AddPredicateResult,
} from "../../../../../dsl/predicates/predicates.edit";
import { popupTransition, popupVariants } from "../animations";
import styles from "./index.module.css";

type Props = {
  connection: Connection | null;
  onSubmit: (
    source: string,
    target: string,
    name: string,
  ) => AddPredicateResult;
  onClose: () => void;
};

const AddEdge = ({ connection, onSubmit, onClose }: Props) => {
  const { t } = useTranslation("common");

  const [name, setName] = useState<string>("");
  const [error, setError] = useState<AddPredicateReason | null>(null);

  // A new drag starts blank. Reset during render when a fresh connection
  // arrives (React's "adjust state on prop change" pattern) rather than in an
  // effect; only on non-null so the exit animation keeps its last contents.
  const [prevConnection, setPrevConnection] = useState<Connection | null>(
    connection,
  );
  if (connection && connection !== prevConnection) {
    setPrevConnection(connection);
    setName("");
    setError(null);
  }

  const handleNameChange = useCallback((value: string) => {
    setName(value);
    setError(null);
  }, []);

  const submit = useCallback(() => {
    if (!connection) return;
    const trimmed = name.trim();
    if (!trimmed) return;
    const { source, target } = connection;
    if (!source || !target) {
      onClose();
      return;
    }
    const result = onSubmit(source, target, trimmed);
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    onClose();
  }, [connection, name, onSubmit, onClose]);

  return (
    <Panel position="top-center">
      <AnimatePresence>
        {connection && (
          <motion.div
            className={styles.card}
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={popupTransition}
          >
            <span className={styles.label}>
              {connection.source} → {connection.target}
            </span>
            <div className={styles.row}>
              <input
                autoFocus
                value={name}
                placeholder={t("placeholders.predicateName")}
                onChange={(event) => handleNameChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") submit();
                  if (event.key === "Escape") onClose();
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
                onClick={onClose}
                aria-label={t("actions.close")}
              >
                <IconCross aria-hidden="true" />
              </button>
            </div>
            {error && (
              <span className={styles.error}>
                {t(`predicateErrors.${error}`)}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Panel>
  );
};

export default AddEdge;
