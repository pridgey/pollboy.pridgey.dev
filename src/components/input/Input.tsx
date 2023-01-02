import { Show } from "solid-js";
import styles from "./Input.module.css";
import { InfoTip } from "../infotip";

export type InputProps = {
  Error?: string;
  Label: string;
  Placeholder?: string;
  Name: string;
  Tooltip?: string;
  Type: "text" | "password" | "date";
};

export const Input = (props: InputProps) => {
  return (
    <label class={styles.inputlabel}>
      <div class={styles.labelspread}>
        <span>{props.Label}</span>
        <Show when={props.Tooltip?.length}>
          <InfoTip Text={props.Tooltip || ""} />
        </Show>
      </div>
      <input
        id={`${props.Name}-input`}
        type={props.Type}
        placeholder={props.Placeholder}
        name={props.Name}
        class={styles.inputcontrol}
      />
      <Show when={props.Error}>
        <span role="alert" class={styles.inputerror}>
          {props.Error}
        </span>
      </Show>
    </label>
  );
};
