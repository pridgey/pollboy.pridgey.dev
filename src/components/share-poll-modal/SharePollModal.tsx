import { Portal } from "solid-js/web";
import { Button } from "~/components";
import styles from "./SharePollModal.module.css";
import QRCode from "qrcode-svg";
import { onMount } from "solid-js";

type SharePollModalProps = {
  OnClose: (confirm: boolean) => void;
};

export const SharePollModal = (props: SharePollModalProps) => {
  onMount(() => {
    document.getElementById("qr-container")!.innerHTML = new QRCode({
      content: window.location.href,
      container: "svg-viewbox", //Responsive use
      join: true, //Crisp rendering and 4-5x reduced file size
    }).svg();
  });

  return (
    <Portal>
      <div class={styles.container}>
        <div class={styles.modal}>
          <h1 class={styles.title}>Share Poll</h1>
          <div id="qr-container"></div>
          <Button Type="button" OnClick={() => props.OnClose(false)}>
            Close
          </Button>
        </div>
      </div>
    </Portal>
  );
};
