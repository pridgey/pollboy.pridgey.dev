import { TextField } from "@kobalte/core";
import styles from "./Input.module.css";
import { Match, Show, Switch, createEffect, createSignal } from "solid-js";

export type InputProps = {
  DefaultValue?: string;
  Error?: string;
  FontSize?: "mini" | "small" | "text" | "header" | "large" | "extra-large";
  FontWeight?: "light" | "normal" | "semibold" | "bold";
  HelperText?: string;
  HideLabel?: boolean;
  Label: string;
  Multiline?: boolean;
  Name?: string;
  OnChange?: (newValue: string) => void;
  Placeholder?: string;
  Type?: "text" | "password" | "number" | "time" | "date";
  Width?: string;
  Variant?: "inline" | "outlined";
};

export const Input = (props: InputProps) => {
  const [error, setError] = createSignal(props.Error);

  createEffect(() => {
    setError(props.Error);
  });

  return (
    <TextField.Root
      class={styles.input_root}
      defaultValue={props.DefaultValue}
      name={props.Name}
      onChange={props.OnChange}
      style={{
        "--input-background":
          props.Variant === "inline"
            ? "transparent"
            : "var(--color-fullbackground)",
        "--input-border":
          props.Variant === "inline" ? "unset" : "1px solid var(--color-gray)",
        "--input-width": props.Width ?? "100%",
      }}
      validationState={!!props.Error ? "invalid" : "valid"}
    >
      <Show when={!props.HideLabel}>
        <TextField.Label class={styles.input_label}>
          {props.Label}
        </TextField.Label>
      </Show>
      <Switch>
        <Match when={props.Multiline}>
          <TextField.TextArea
            aria-label={props.Label}
            classList={{
              [styles.input_control]: true,
              [styles.input_multiline]: true,
            }}
            placeholder={props.Placeholder}
            style={{
              "font-size": `var(--font-size-${props.FontSize ?? "text"})`,
              "font-weight": `var(--font-weight-${
                props.FontWeight ?? "unset"
              })`,
              height: "unset",
            }}
            value={props.DefaultValue}
          />
        </Match>
        <Match when={!props.Multiline}>
          <TextField.Input
            aria-label={props.Label}
            class={styles.input_control}
            placeholder={props.Placeholder}
            style={{
              "font-size": `var(--font-size-${props.FontSize ?? "text"})`,
              "font-weight": `var(--font-weight-${
                props.FontWeight ?? "unset"
              })`,
            }}
            type={props.Type}
          />
        </Match>
      </Switch>
      <TextField.Description class={styles.input_helper}>
        {props.HelperText}
      </TextField.Description>
      <TextField.ErrorMessage class={styles.input_error}>
        {props.Error}
      </TextField.ErrorMessage>
    </TextField.Root>
  );
};
