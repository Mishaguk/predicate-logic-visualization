import styles from "./index.module.css";
import Button from "../Button";
import Modal from "../Modal";

export type Example = {
  title: string;
  description: string;
  universe: string;
  constants: string;
  predicates: string;
  query?: string;
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
    universe: "Humans = {Ann, Boris, Eve};",
    constants: "ann -> Ann\nboris -> Boris\neve -> Eve",
    predicates: "Friend(ann, boris)\nFriend(boris, ann)\nFriend(ann, eve)",
    query: "Friend(?x, ann) and Friend(ann, ?x)",
  },
  {
    title: "Love",
    description: "Simple binary predicate with two constants.",
    universe: "Humans = {Eve, Peter};",
    constants: "eve -> Eve\npeter -> Peter",
    predicates: "Loves(eve, peter)\nLoves(peter, eve)",
    query: "∀ ?x: ∃ ?y: Loves(?x, ?y)",
  },
  {
    title: "Parent",
    description: "Small family tree with a parent relation.",
    universe: "People = {Ann, Ben, Cara, Dan};",
    constants: "ann -> Ann\nben -> Ben\ncara -> Cara\ndan -> Dan",
    predicates:
      "Parent(ann, ben)\nParent(ann, cara)\nParent(ben, dan)\nSiblings(ben, cara)",
    query: "Parent(?x, dan)",
  },
  {
    title: "Unary Property",
    description: "Single-argument predicate over a small universe.",
    universe: "Animals = {Cat, Dog, Bird};",
    constants: "cat -> Cat\ndog -> Dog\nbird -> Bird",
    predicates: "Pet(cat)\nPet(dog)",
    query: "Pet(?x) and not Pet(bird)",
  },
  {
    title: "Course Prerequisites",
    description: "Dependencies between courses in a study plan.",
    universe: "Courses = {Calc1, Calc2, Logic, AI};",
    constants: "calc1 -> Calc1\ncalc2 -> Calc2\nlogic -> Logic\nai -> AI",
    predicates:
      "Prereq(calc1, calc2)\nPrereq(logic, ai)\nPrereq(calc2, ai)\nCore(logic)",
    query: "Prereq(?x, ai) and not Core(?x)",
  },
  {
    title: "Number Chain",
    description: "Numeric-like domain with successor and parity.",
    universe: "Numbers = {0, 1, 2, 3};",
    constants: "n0 -> 0\nn1 -> 1\nn2 -> 2\nn3 -> 3",
    predicates: "Succ(n0, n1)\nSucc(n1, n2)\nSucc(n2, n3)\nEven(n0)\nEven(n2)",
    query: "∃ ?x: Even(?x) and Succ(?x, n3)",
  },
  {
    title: "Colors",
    description: "Warm/cool color grouping with complement pairs.",
    universe: "Colors = {Red, Blue, Yellow, Green, Orange, Purple};",
    constants:
      "red -> Red\nblue -> Blue\nyellow -> Yellow\ngreen -> Green\norange -> Orange\npurple -> Purple",
    predicates:
      "Warm(red)\nWarm(orange)\nWarm(yellow)\nCool(blue)\nCool(green)\nCool(purple)\nComplement(red, green)\nComplement(blue, orange)\nComplement(yellow, purple)",
    query: "Warm(?x) and Complement(?x, ?y)",
  },
];

const Examples = ({ open, onClose, onSelectExample }: Props) => {
  return (
    <Modal open={open} onClose={onClose}>
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
            onClick={() => onSelectExample?.(example)}
          >
            <div className={styles.cardTitle}>{example.title}</div>
            <div className={styles.cardDescription}>{example.description}</div>
            <div className={styles.cardAction}>Paste example {"->"}</div>
          </button>
        ))}
      </div>
    </Modal>
  );
};

export default Examples;
