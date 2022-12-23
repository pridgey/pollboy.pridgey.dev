import styles from "./Button.module.css";

export type ButtonProps = {
  BackgroundColor?: string;
  children: string;
  Type: "button" | "submit";
};

export const Button = (props: ButtonProps) => {
  const buttonColor = props.BackgroundColor?.includes("--")
    ? `var(${props.BackgroundColor})`
    : props.BackgroundColor?.length
    ? props.BackgroundColor
    : "var(--color-orange)";

  return (
    <button
      class={styles.button}
      style={{ "background-color": buttonColor }}
      type={props.Type}
    >
      {props.children}
    </button>
  );
};
