import styles from "./Button.module.css";

export type ButtonProps = {
  children: string;
  Type: "button" | "submit";
};

export const Button = (props: ButtonProps) => {
  return (
    <button class={styles.button} type={props.Type}>
      {props.children}
    </button>
  );
};
