import { Button as KobatleButton } from "@kobalte/core";
import type { JSX } from "solid-js";
import styled from "./Button.module.css";
import { Show } from "solid-js/web";
import { TbLoader2 } from "solid-icons/tb";

export type ButtonProps = {
  Color?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "success"
    | "error"
    | "gray"
    | "fullwhite"
    | "fullblack"
    | "white"
    | "black"
    | "text"
    | "foreground"
    | "background"
    | "fullbackground"
    | "fullforeground";
  children: JSX.Element;
  Disabled?: boolean;
  DisableRadius?: boolean;
  FontSize?: "mini" | "small" | "text" | "header" | "large" | "extra-large";
  Href?: string;
  IconSize?: string;
  OnClick?: () => void;
  Padding?: "mini" | "small" | "medium" | "large" | "none";
  Pending?: boolean;
  Type?: "button" | "submit";
  Variant?: "full" | "outlined" | "text";
  Width?: string;
};

const ButtonChildren = (props: {
  children: JSX.Element;
  isPending: boolean;
}) => {
  if (typeof props.children === "string") {
    return (
      <div class={styled.button_content}>
        {props.children}
        <Show when={props.isPending}>
          <div class={styled.spin}>
            <TbLoader2 />
          </div>
        </Show>
      </div>
    );
  } else {
    // Is not a string
    return props.isPending ? (
      <div class={styled.spin}>
        <TbLoader2 />
      </div>
    ) : (
      props.children
    );
  }
};

export const Button = (props: ButtonProps) => {
  const styles = {
    "--button-color": `var(--color-${props.Color ?? "primary"})`,
    "--button-padding":
      props.Padding === "none"
        ? "0px"
        : `var(--spacing-${props.Padding ?? "medium"})`,
    "--button-radius": props.DisableRadius ? "0px" : "var(--border-radius)",
    "--button-font-size": `var(--font-size-${props.FontSize ?? "text"})`,
    "--button-icon-size": props.IconSize ?? "unset",
    "--button-width": props.Width ?? "unset",
  };

  if (!!props.Href) {
    return (
      <KobatleButton.Root
        as="a"
        class={styled.button}
        classList={{
          [styled.button]: true,
          [styled.button_link]: true,
          [styled.button_outlined]: props.Variant === "outlined",
          [styled.button_text]: props.Variant === "text",
        }}
        disabled={props.Disabled}
        href={props.Href}
        onClick={() => props.OnClick?.()}
        style={styles}
        type={props.Type ?? "button"}
      >
        {props.children}
      </KobatleButton.Root>
    );
  }

  return (
    <KobatleButton.Root
      class={styled.button}
      classList={{
        [styled.button]: true,
        [styled.button_outlined]: props.Variant === "outlined",
        [styled.button_text]: props.Variant === "text",
      }}
      disabled={props.Disabled}
      onClick={() => props.OnClick?.()}
      style={styles}
      type={props.Type ?? "button"}
    >
      <ButtonChildren isPending={props.Pending ?? false}>
        {props.children}
      </ButtonChildren>
    </KobatleButton.Root>
  );
};
