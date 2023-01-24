import styles from "./PollForm.module.css";
import { Button, Input, Textarea, Toggle } from "~/components";

type FieldError = {
  error: string;
};

type FormValues = {
  PollName: string;
  PollExpiration: string;
  PollDescription: string;
  UsersCanAdd: boolean;
  MultipleVotes: boolean;
};

type PollFormProps = {
  FormErrors?: { [key: string]: FieldError };
  FormLoading: boolean;
  FormValues?: FormValues;
};

export const PollForm = (props: PollFormProps) => {
  return (
    <>
      <span class={styles.form_label}>
        <Input
          DefaultValue={props.FormValues?.PollName}
          Error={props.FormErrors?.poll_name?.error}
          Label="Poll Name"
          Name="poll_name"
          Type="text"
          Tooltip="This is the title of the poll. It'll be used to identify the poll."
          Placeholder="What's your favorite Backstreet Boys song?"
        />
      </span>
      <span class={styles.form_expiry}>
        <Input
          DefaultValue={props.FormValues?.PollExpiration}
          Error={props.FormErrors?.poll_expiration?.error}
          Label="Poll Expiration"
          Name="poll_expiration"
          Tooltip="This is the last day someone can vote on this poll."
          Type="date"
          Placeholder="When does this poll end?"
        />
      </span>
      <span class={styles.form_desc}>
        <Textarea
          DefaultValue={props.FormValues?.PollDescription}
          Error={props.FormErrors?.poll_description?.error}
          Label="Description"
          Name="poll_description"
          Tooltip="The description of the Poll. It's helpful for users to understand the poll."
          Placeholder="Add some additional info"
        />
      </span>
      <span class={styles.form_add}>
        <Toggle
          DefaultValue={props.FormValues?.UsersCanAdd}
          Label="Users Can Add"
          Name="poll_add_options"
          Tooltip="Can users add options to this poll?"
        />
      </span>
      <span class={styles.form_multi}>
        <Toggle
          DefaultValue={props.FormValues?.MultipleVotes}
          Label="Multiple Votes"
          Name="poll_multivote"
          Tooltip="Can users vote for more than one option on this poll?"
        />
      </span>
      <span class={styles.form_button}>
        <Button Disabled={props.FormLoading} Type="submit">
          {props.FormValues ? "Modify Poll" : "Create Poll"}
        </Button>
      </span>
    </>
  );
};
