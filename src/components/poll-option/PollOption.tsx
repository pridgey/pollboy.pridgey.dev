import styles from "./PollOption.module.css";

export type PollOptionProps = {
  PollID: number;
  OptionName: string;
  OptionDescription: string;
  UserID?: string;
  CreatedAt?: string;
  Votes?: number;
  VotePercentage?: number;
};

export const PollOption = (props: PollOptionProps) => {
  return (
    <div class={styles.optioncontainer}>
      <div class={styles.optioncheck}></div>
      <h1 class={styles.optiontitle}>{props.OptionName}</h1>
      <div
        style={`--data-percent: ${props.VotePercentage}%`}
        class={styles.optionpercent}
      ></div>
      <h2 class={styles.optionsubtitle}>{props.OptionDescription}</h2>
    </div>
  );
};
