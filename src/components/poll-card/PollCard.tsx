import styles from "./PollCard.module.css";
import { A } from "solid-start";
import { RenderedPollProps } from "~/db/poll";
import { Show } from "solid-js";

export type PollCardProps = {
  Poll: RenderedPollProps;
};

export const PollCard = (props: PollCardProps) => {
  return (
    <A href={`/poll/${props.Poll.slug}`} class={styles.container}>
      <h1 class={styles.cardtitle}>{props.Poll.poll_name}</h1>
      <h2 class={styles.cardsubtitle}>{props.Poll.poll_desc}</h2>
      <div class={styles.tagbox}>
        <Show when={props.Poll.hasPollExpired}>
          <div class={styles.tag}>Expired</div>
        </Show>
        <div class={styles.tag}>
          Created {new Date(props.Poll.created_at || "").toLocaleDateString()}
        </div>
        <div class={styles.tag}>
          Expires {new Date(props.Poll.expire_at || "").toLocaleDateString()}
        </div>
        <Show when={props.Poll.isPollOwner}>
          <div class={styles.tag}>Created By You</div>
        </Show>
      </div>
    </A>
  );
};
