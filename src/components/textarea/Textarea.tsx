import { Show } from "solid-js";
import styles from "./Textarea.module.css";

export type TextareaProps = {
  Error?: string;
  Label: string;
  Placeholder?: string;
  Rows?: number;
  Name: string;
};

export const Textarea = (props: TextareaProps) => {
  return (
    <label class={styles.textarealabel}>
      {props.Label}
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
