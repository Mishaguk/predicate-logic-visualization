import { useTranslation } from "react-i18next";
import { visualizationExample } from "../../assets";
import textStyles from "../../textStyles.module.css";
import Button from "../Button";
import Modal from "../Modal";
import styles from "./index.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
};

const SyntaxGuide = ({ open, onClose }: Props) => {
  const { t } = useTranslation("common");

  return (
    <Modal open={open} onClose={onClose}>
      <div className={textStyles.guideReadable}>
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <h2 className={styles.title}>{t("guide.title")}</h2>
            <p className={styles.subtitle}>{t("guide.subtitle")}</p>
          </div>
          <Button onClick={onClose} text="x" />
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>{t("guide.overview.title")}</h3>
            <p className={styles.text}>{t("guide.overview.text")}</p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>{t("guide.define.title")}</h3>
            <div className={styles.item}>
              <div className={styles.itemTitle}>
                {t("guide.define.universe.title")}
              </div>
              <p className={styles.text}>{t("guide.define.universe.text")}</p>
              <pre className={styles.code}>People = {"{Ann, Ben, Cara};"}</pre>
            </div>
            <div className={styles.item}>
              <div className={styles.itemTitle}>
                {t("guide.define.constants.title")}
              </div>
              <p className={styles.text}>{t("guide.define.constants.text")}</p>
              <pre className={styles.code}>
                ann -&gt; Ann{"\n"}ben -&gt; Ben
              </pre>
            </div>
            <div className={styles.item}>
              <div className={styles.itemTitle}>
                {t("guide.define.predicates.title")}
              </div>
              <p className={styles.text}>{t("guide.define.predicates.text")}</p>
              <pre className={styles.code}>
                Parent(ann, ben){"\n"}Sibling(ben, cara)
              </pre>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>{t("guide.query.title")}</h3>
            <p className={styles.text}>{t("guide.query.whatItDoes")}</p>
            <ul className={styles.featureList}>
              <li>{t("guide.query.syntax.atom")}</li>
              <li>{t("guide.query.syntax.terms")}</li>
              <li>{t("guide.query.syntax.logical")}</li>
              <li>{t("guide.query.syntax.quantifiers")}</li>
              <li>{t("guide.query.syntax.grouping")}</li>
            </ul>
            <pre className={styles.code}>
              {t("guide.query.examples.title")}
              {"\n"}
              Parent(?x, ben)
              {"\n"}
              Parent(?x, ben) and not Sibling(?x, ben)
              {"\n"}
              forAll ?x: exists ?y: Parent(?x, ?y)
            </pre>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              {t("guide.visualization.title")}
            </h3>
            <p className={styles.text}>{t("guide.visualization.text")}</p>
            <ul className={styles.featureList}>
              <li>{t("guide.visualization.items.nodes")}</li>
              <li>{t("guide.visualization.items.edges")}</li>
              <li>{t("guide.visualization.items.highlight")}</li>
            </ul>
            <figure className={styles.imageWrap}>
              <img
                src={visualizationExample}
                alt={t("guide.visualization.exampleAlt")}
                className={styles.image}
              />
              <figcaption className={styles.caption}>
                {t("guide.visualization.exampleCaption")}
              </figcaption>
            </figure>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>{t("guide.features.title")}</h3>
            <ul className={styles.featureList}>
              <li>{t("guide.features.items.validation")}</li>
              <li>{t("guide.features.items.visualization")}</li>
              <li>{t("guide.features.items.queryExecution")}</li>
              <li>{t("guide.features.items.examples")}</li>
              <li>{t("guide.features.items.results")}</li>
            </ul>
          </section>
        </div>
      </div>
    </Modal>
  );
};

export default SyntaxGuide;
