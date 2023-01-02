import styles from "./Toggle.module.css";
import { Show } from "solid-js";

export type ToggleProps = {
  Error?: string;
  Label: string;
  Name: string;
};

export const Toggle = (props: ToggleProps) => {
  return (
    <label class={styles.inputlabel} for={props.Name}>
      {props.Label}
      <input
        id={props.Name}
        type="checkbox"
        name={props.Name}
        class={styles.inputcontrol}
      />
      <span class={styles.toggle_display} hidden></span>
      <Show when={props.Error}>
        <span role="alert" class={styles.inputerror}>
          {props.Error}
        </span>
      </Show>
    </label>
  );
};
