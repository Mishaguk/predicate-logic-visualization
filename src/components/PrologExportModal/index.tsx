import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../Button";
import Modal from "../Modal";
import styles from "./index.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  code: string | null;
  fileName?: string;
};

const PrologExportModal = ({
  open,
  onClose,
  code,
  fileName = "predicate-model.pl",
}: Props) => {
  const { t } = useTranslation("common");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    if (!code) return;
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <h2 className={styles.title}>{t("prologExport.title")}</h2>
          <p className={styles.subtitle}>{t("prologExport.subtitle")}</p>
        </div>
        <Button style={{ width: "auto" }} onClick={onClose} text="x" />
      </div>

      <div className={styles.codeWrap}>
        {code ? (
          <pre className={styles.code}>{code}</pre>
        ) : (
          <div className={styles.empty}>{t("prologExport.empty")}</div>
        )}
      </div>

      <div className={styles.actions}>
        <Button
          text={copied ? t("prologExport.copied") : t("actions.copy")}
          onClick={handleCopy}
          disabled={!code}
        />
        <Button
          text={t("actions.downloadPl")}
          onClick={handleDownload}
          variant="primary"
          disabled={!code}
        />
      </div>
    </Modal>
  );
};

export default PrologExportModal;
