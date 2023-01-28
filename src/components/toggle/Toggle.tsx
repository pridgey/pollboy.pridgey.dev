import styles from "./Toggle.module.css";
import { Show } from "solid-js";
import { InfoTip } from "../infotip";

export type ToggleProps = {
  DefaultValue?: boolean;
  Error?: string;
  Label: string;
  Name: string;
  Tooltip?: string;
};

export const Toggle = (props: ToggleProps) => {
  return (
    <label class={styles.inputlabel} for={props.Name}>
      <div class={styles.labelspread}>
        <span>{props.Label}</span>
        <Show when={props.Tooltip?.length}>
          <InfoTip Text={props.Tooltip || ""} />
        </Show>
      </div>
      <input
        id={props.Name}
        type="checkbox"
        name={props.Name}
        class={styles.inputcontrol}
        checked={props.DefaultValue}
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
