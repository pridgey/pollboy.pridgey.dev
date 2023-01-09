import { Portal } from "solid-js/web";
import { Input } from "~/components";
import styles from "./NewOptionModal.module.css";

export const NewOptionsModal = () => {
  return (
    <Portal>
      <div class={styles.container}>
        <div class={styles.modal}>Make new options</div>
      </div>
    </Portal>
  );
};
