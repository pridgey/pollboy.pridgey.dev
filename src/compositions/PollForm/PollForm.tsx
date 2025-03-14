import { createAsync } from "@solidjs/router";
import { Input } from "~/components/Input";
import { getPollById } from "~/lib/api";
import { PollRecord } from "~/types/pocketbase";
import styles from "./PollForm.module.css";
import { Toggle } from "~/components/Toggle/Toggle";
import { Button } from "~/components/Button";
import { createEffect, createSignal, Match, Switch } from "solid-js";

type PollFormProps = {
  PollId?: string;
  OnChange: (poll: PollRecord) => void;
};

/**
 * Composition to display a form for Poll data. Allows a user to create or edit polls
 */
export const PollForm = (props: PollFormProps) => {
  // Fetch any poll data, if no PollId it will return null
  const pollData = createAsync<PollRecord | null>(() =>
    getPollById(props.PollId ?? "")
  );

  // Holds the state for current data
  const [pollState, updatePollState] = createSignal<PollRecord | Object>(
    pollData() ?? {}
  );

  // If the async fetch comes back, update the state with that data
  createEffect(() => {
    if (!!pollData()) {
      updatePollState({
        ...pollData(),
      });
    }
  });

  // When state updates, call onchange
  createEffect(() => {
    if (Object.hasOwn(pollState(), "poll_name")) {
      props.OnChange({
        ...(pollState() as PollRecord),
      });
    }
  });

  return (
    <section class={styles.form_container}>
      <span class={styles.form_label}>
        <Input
          DefaultValue={pollData()?.poll_name || undefined}
          Label="Poll Name"
          OnChange={(newPollName) =>
            updatePollState({
              ...pollState(),
              poll_name: newPollName,
            })
          }
          Name="poll_name"
          Type="text"
          Placeholder="Poll Name"
        />
      </span>
      <span class={styles.form_expiry}>
        <Input
          DefaultValue={
            pollData()
              ? new Date(pollData()!.expire_at).toISOString().split("T").at(0)
              : undefined
          }
          Label="Poll Expiration"
          Name="poll_expiration"
          OnChange={(newPollExpiration) =>
            updatePollState({
              ...pollState(),
              expire_at: newPollExpiration,
            })
          }
          Type="date"
          Placeholder="When does this poll end?"
        />
      </span>
      <span class={styles.form_desc}>
        <Input
          DefaultValue={pollData()?.poll_desc || undefined}
          Label="Description"
          Multiline={true}
          Name="poll_description"
          OnChange={(newPollDescription) =>
            updatePollState({
              ...pollState(),
              poll_desc: newPollDescription,
            })
          }
          Placeholder="Add some additional info"
        />
      </span>
      <span class={styles.form_add}>
        <Toggle
          DefaultChecked={pollData()?.public_can_add || false}
          Label="Users Can Add Poll Options"
          Name="poll_add_options"
          OnChange={(canPublicAdd) =>
            updatePollState({
              ...pollState(),
              public_can_add: canPublicAdd,
            })
          }
        />
      </span>
      <span class={styles.form_multi}>
        <Toggle
          DefaultChecked={pollData()?.multivote || false}
          Label="Allow Voting on Multiple Options"
          Name="poll_multivote"
          OnChange={(canMultivote) =>
            updatePollState({
              ...pollState(),
              multivote: canMultivote,
            })
          }
        />
      </span>
    </section>
  );
};
