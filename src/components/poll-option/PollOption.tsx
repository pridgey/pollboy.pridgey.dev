import styles from "./PollOption.module.css";
import { createSignal, Show } from "solid-js";
import { optionVote } from "~/db/poll";
import { createServerAction$ } from "solid-start/server";

export type PollOptionProps = {
  ID: number;
  OptionName: string;
  OptionDescription: string;
  PollID: number;
  Votes?: number;
  VotePercentage?: number;
};

export const PollOption = (props: PollOptionProps) => {
  const [_, handleVote] = createServerAction$(async (args, { request }) => {
    await optionVote(request, args.PollID, args.ID);
  });

  const [selected, setSelected] = createSignal(false);
  return (
    <button
      class={styles.optioncontainer}
      onClick={async () => {
        handleVote({ PollID: props.PollID, ID: props.ID });
        setSelected(!selected());
      }}
    >
      <div class={styles.optioncheck}>
        <Show when={selected()}>✓</Show>
      </div>
      <h1 class={styles.optiontitle}>{props.OptionName}</h1>
      <h2 class={styles.optionsubtitle}>{props.OptionDescription}</h2>
    </button>
  );
};
