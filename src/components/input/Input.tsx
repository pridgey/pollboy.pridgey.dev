import { Show } from "solid-js";
import styles from "./Input.module.css";

export type InputProps = {
  Error?: string;
  Label: string;
  Placeholder?: string;
  Name: string;
  Type: "text" | "password";
};

export const Input = (props: InputProps) => {
  return (
    <label class={styles.inputlabel}>
      {props.Label}
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
