import styles from "./Input.module.css";

export type InputProps = {
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
    </label>
  );
};
