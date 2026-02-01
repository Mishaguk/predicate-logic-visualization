import { AnimatePresence, motion } from "framer-motion";
import styles from "./index.module.css";
import Button from "../Button";

export type Example = {
  title: string;
  description: string;
  universe: string;
  constants: string;
  predicates: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSelectExample?: (example: Example) => void;
};

const EXAMPLES: Example[] = [
  {
    title: "Friends",
    description: "Symmetric friendship between a few people.",
    universe: "People = {a,b,c};",
    constants: "Ann -> a\nBob -> b\nCara -> c",
    predicates: "Friend(Ann, Bob)\nFriend(Bob, Ann)\nFriend(Ann, Cara)",
  },
  {
    title: "Loves",
    description: "Simple binary predicate with two constants.",
    universe: "People = {a,b};",
    constants: "Ann -> a\nPeter -> b",
    predicates: "Loves(Ann, Peter)\nLoves(Peter, Ann)",
  },
  {
    title: "Parent",
    description: "Small family tree with a parent relation.",
    universe: "People = {a,b,c,d};",
    constants: "Ann -> a\nBen -> b\nCara -> c\nDan -> d",
    predicates: "Parent(Ann, Ben)\nParent(Ann, Cara)\nParent(Ben, Dan)",
  },
  {
    title: "Unary Property",
    description: "Single-argument predicate over a small universe.",
    universe: "Animals = {a,b,c};",
    constants: "Cat -> a\nDog -> b\nBird -> c",
    predicates: "Pet(Cat)\nPet(Dog)",
  },
];

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 8, scale: 0.98 },
};

const ExamplesModal = ({ open, onClose, onSelectExample }: Props) => {
  const handleSelect = (example: Example) => {
    onSelectExample?.(example);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.18, ease: "easeOut" }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Examples"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.header}>
              <div className={styles.titleBlock}>
                <h2 className={styles.title}>Examples</h2>
                <p className={styles.subtitle}>
                  Click a card to paste an example model.
                </p>
              </div>
              <Button onClick={onClose} text="x" />
            </div>
            <div className={styles.list}>
              {EXAMPLES.map((example) => (
                <button
                  key={example.title}
                  className={styles.card}
                  onClick={() => handleSelect(example)}
                >
                  <div className={styles.cardTitle}>{example.title}</div>
                  <div className={styles.cardDescription}>
                    {example.description}
                  </div>
                  <div className={styles.cardAction}>Paste example {"->"}</div>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExamplesModal;
