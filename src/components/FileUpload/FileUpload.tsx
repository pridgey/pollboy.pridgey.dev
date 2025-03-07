import { FileField } from "@kobalte/core/file-field";
import { Details, FileRejection } from "@kobalte/core/src/file-field/types.js";
import styles from "./FileUpload.module.css";
import { Match, Show, Switch } from "solid-js";
import { AiOutlineLoading } from "solid-icons/ai";

type FileUploadProps = {
  buttonOnly?: boolean;
  helperText?: string;
  label: string;
  multiFile?: boolean;
  maxFiles?: number;
  onFileAccepted?: (file: File[]) => void;
  onFileRejected?: (file: FileRejection[]) => void;
  onFileChange?: (details: Details) => void;
  pending?: boolean;
  showFileList?: boolean;
};

export const FileUpload = (props: FileUploadProps) => {
  return (
    <FileField
      class={styles.FileField}
      multiple={props.multiFile ?? false}
      maxFiles={props.maxFiles}
      onFileAccept={props.onFileAccepted}
      onFileReject={props.onFileRejected}
      onFileChange={props.onFileChange}
    >
      <Switch>
        <Match when={!props.buttonOnly}>
          <FileField.Dropzone class={styles.FileField_dropzone}>
            <FileField.Label class={styles.FileField_label}>
              {props.label}
            </FileField.Label>
            <Switch>
              <Match when={!props.pending}>
                {props.helperText}
                <FileField.Trigger
                  class={styles.FileField_trigger}
                  disabled={props.pending}
                >
                  Upload File{props.multiFile ? "s" : ""}
                </FileField.Trigger>
              </Match>
              <Match when={props.pending}>
                <p>Uploading File</p>
                <AiOutlineLoading class={styles.Loading_Icon} />
              </Match>
            </Switch>
          </FileField.Dropzone>
        </Match>
        <Match when={props.buttonOnly}>
          <FileField.Trigger
            class={styles.FileField_trigger}
            disabled={props.pending}
          >
            {props.label}
            <Show when={props.pending}>
              <AiOutlineLoading class={styles.Loading_Icon_Small} />
            </Show>
          </FileField.Trigger>
        </Match>
      </Switch>
      <FileField.HiddenInput disabled={props.pending} />
      <Show when={props.showFileList}>
        <FileField.ItemList class={styles.FileField_itemList}>
          {(file) => (
            <FileField.Item class={styles.FileField_item}>
              <FileField.ItemPreviewImage
                class={styles.FileField_itemPreviewImage}
              />
              <FileField.ItemName class={styles.FileField_itemName} />
              <FileField.ItemSize class={styles.FileField_itemSize} />
              <FileField.ItemDeleteTrigger
                class={styles.FileField_itemDeleteTrigger}
              >
                Remove File
              </FileField.ItemDeleteTrigger>
            </FileField.Item>
          )}
        </FileField.ItemList>
      </Show>
    </FileField>
  );
};
