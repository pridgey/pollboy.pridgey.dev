import styles from "./buttonbar.module.css";

type SplitType = "left-heavy" | "even-split" | "right-heavy";

export type ButtonBarProps = {
  children: any;
  Split: SplitType;
};

const SplitDictionary: { [key in SplitType]: string } = {
  "even-split": "1fr 1fr",
  "left-heavy": "1fr min-content",
  "right-heavy": "min-content 1fr",
};

export const ButtonBar = (props: ButtonBarProps) => {
  return (
    <div
      class={styles.container}
      style={{ "grid-template-columns": SplitDictionary[props.Split] }}
    >
      {props.children}
    </div>
  );
};
