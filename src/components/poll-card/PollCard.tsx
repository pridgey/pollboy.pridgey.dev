import styles from "./PollCard.module.css";

export type PollCardProps = {
  AvatarUrl?: string;
  CardTitle: string;
  Description: string;
};

export const PollCard = (props: PollCardProps) => {
  const inlineAvatarStyle = { "background-image": `url('${props.AvatarUrl}')` };

  return (
    <div class={styles.container}>
      <div
        class={styles.cardimage}
        style={props.AvatarUrl?.length ? inlineAvatarStyle : undefined}
      ></div>
      <span class={styles.cardtitle}>{props.CardTitle}</span>
      <span class={styles.cardsubtitle}>{props.Description}</span>
    </div>
  );
};
