import { Portal } from "solid-js/web";
import { Button, ButtonBar } from "~/components";
import styles from "./ConfirmDeleteModal.module.css";

type ConfirmDeleteModalProps = {
  Name: string;
  OnClose: (confirm: boolean) => void;
};

export const ConfirmDeleteModal = (props: ConfirmDeleteModalProps) => {
  return (
    <Portal>
      <div class={styles.container}>
        <div class={styles.modal}>
          <h1 class={styles.title}>Confirm Delete</h1>
          <h2 class={styles.subtitle}>
            Are you sure you would like to delete <strong>{props.Name}</strong>?
            It cannot be recovered.
          </h2>
          <ButtonBar Split="even-split">
            <Button
              Type="button"
              BackgroundColor="transparent"
              OnClick={() => props.OnClose(false)}
            >
              Cancel
            </Button>
            <Button
              Type="button"
              BackgroundColor="red"
              TextColor="white"
              OnClick={() => props.OnClose(true)}
            >
              Delete
            </Button>
          </ButtonBar>
        </div>
      </div>
    </Portal>
  );
};
