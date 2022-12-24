import { A } from "solid-start";
import styles from "./Button.module.css";

type ButtonCommonProps = {
  BackgroundColor?: string;
  children: string;
  TextColor?: string;
};

type ButtonEleProps = ButtonCommonProps & {
  Type: "button" | "submit";
};

type ButtonAnchorProps = ButtonCommonProps & {
  Href: string;
};

export type ButtonProps = ButtonEleProps | ButtonAnchorProps;

export const Button = (props: ButtonProps) => {
  const buttonColor = props.BackgroundColor?.includes("--")
    ? `var(${props.BackgroundColor})`
    : props.BackgroundColor?.length
    ? props.BackgroundColor
    : "var(--color-orange)";

  const textColor = props.TextColor?.includes("--")
    ? `var(${props.TextColor})`
    : props.TextColor?.length
    ? props.TextColor
    : "black";

  if ((props as ButtonAnchorProps).Href) {
    return (
      <A
        class={styles.button}
        href={(props as ButtonAnchorProps).Href}
        style={{ "background-color": buttonColor, color: textColor }}
      >
        {props.children}
      </A>
    );
  }

  return (
    <button
      class={styles.button}
      style={{ "background-color": buttonColor, color: textColor }}
      type={(props as ButtonEleProps).Type}
    >
      {props.children}
    </button>
  );
};
