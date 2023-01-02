import styles from "./InfoTip.module.css";

export type InfotipProps = {
  Gap?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  Text: string;
};

export const InfoTip = (props: InfotipProps) => {
  return (
    <div
      data-gap={`${props.Gap || 2}rem`}
      data-text={props.Text}
      class={styles.container}
    >
      i
    </div>
  );
};
