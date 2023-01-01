import styles from "./Toggle.module.css";
import { Show } from "solid-js";

export type ToggleProps = {
  Error?: string;
  Label: string;
  Name: string;
};

export const Toggle = (props: ToggleProps) => {
  return (
    <label class={styles.inputlabel}>
      {props.Label}
      <input
        id={`${props.Name}-input`}
        type="checkbox"
        name={props.Name}
        class={styles.inputcontrol}
      />
      <div class={styles.toggle}></div>
      <Show when={props.Error}>
        <span role="alert" class={styles.inputerror}>
          {props.Error}
        </span>
      </Show>
    </label>
  );
};
