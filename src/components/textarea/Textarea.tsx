import { Show } from "solid-js";
import styles from "./Textarea.module.css";
import { InfoTip } from "../infotip";

export type TextareaProps = {
  Error?: string;
  Label: string;
  Name: string;
  Placeholder?: string;
  Rows?: number;
  Tooltip?: string;
};

export const Textarea = (props: TextareaProps) => {
  return (
    <label class={styles.textarealabel}>
      <div class={styles.labelspread}>
        <span>{props.Label}</span>
        <Show when={props.Tooltip?.length}>
          <InfoTip Text={props.Tooltip || ""} />
        </Show>
      </div>
      <textarea
        id={`${props.Name}-input`}
        placeholder={props.Placeholder}
        name={props.Name}
        class={styles.textareacontrol}
        rows={props.Rows || 4}
      />
      <Show when={props.Error}>
        <span role="alert" class={styles.textareaerror}>
          {props.Error}
        </span>
      </Show>
    </label>
  );
};
