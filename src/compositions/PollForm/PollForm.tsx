import { createAsync } from "@solidjs/router";
import { Input } from "~/components/Input";
import { getPollById } from "~/lib/api";
import { PollRecord } from "~/types/pocketbase";
import styles from "./PollForm.module.css";
import { Toggle } from "~/components/Toggle/Toggle";
import { Button } from "~/components/Button";
import { Match, Switch } from "solid-js";

type PollFormProps = {
  PollId?: string;
  Pending?: boolean;
};

/**
 * Composition to display a form for Poll data. Allows a user to create or edit polls
 */
export const PollForm = (props: PollFormProps) => {
  // Try and fetch poll data
  const pollData = createAsync<PollRecord | null>(() =>
    // props.PollId ? getPollById(props.PollId ?? "") : new Promise(() => null)
    getPollById(props.PollId ?? "")
  );

  console.log("Poll Data", {
    pollData: pollData(),
    expireType: typeof pollData()?.expire_at,
  });

  return (
    <section class={styles.form_container}>
      <span class={styles.form_label}>
        <Input
          DefaultValue={pollData()?.poll_name || undefined}
          // Error={props.FormErrors?.poll_name?.error}
          Label="Poll Name"
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
          // Error={props.FormErrors?.poll_expiration?.error}
          Label="Poll Expiration"
          Name="poll_expiration"
          Type="date"
          Placeholder="When does this poll end?"
        />
      </span>
      <span class={styles.form_desc}>
        <Input
          DefaultValue={pollData()?.poll_desc || undefined}
          // Error={props.FormErrors?.poll_description?.error}
          Label="Description"
          Multiline={true}
          Name="poll_description"
          Placeholder="Add some additional info"
        />
      </span>
      <span class={styles.form_add}>
        <Toggle
          DefaultChecked={pollData()?.public_can_add || false}
          Label="Users Can Add Poll Options"
          Name="poll_add_options"
        />
      </span>
      <span class={styles.form_multi}>
        <Toggle
          DefaultChecked={pollData()?.multivote || false}
          Label="Allow Voting on Multiple Options"
          Name="poll_multivote"
        />
      </span>
    </section>
  );
};
