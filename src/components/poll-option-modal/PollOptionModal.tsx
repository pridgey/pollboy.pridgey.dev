import { createEffect, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { FormError } from "solid-start/data";
import { createServerAction$ } from "solid-start/server";
import { Button, ButtonBar, Input, Loader } from "~/components";
import { createPollOption, modifyPollOption } from "~/db/poll";
import { validate } from "~/lib/Validate";
import styles from "./PollOptionModal.module.css";

type PollOptionModalProps = {
  ID?: number;
  OptionDescription?: string;
  OptionName?: string;
  PollID?: number;
  OnClose: () => void;
};

export const PollOptionsModal = (props: PollOptionModalProps) => {
  // Action to create/modify a poll option
  const [creatingOption, { Form }] = createServerAction$(
    async (form: FormData, { request }) => {
      // Get all the data from the form
      const option_name = form.get("option_name");
      const option_desc = form.get("option_desc");
      const poll_id = form.get("poll_id");
      const option_id = Number(form.get("option_id"));

      // Used to determine if this will be a create or modify action
      const doesOptionExist = option_id > 0;

      // Quick validation
      if (
        typeof option_name !== "string" ||
        typeof option_desc !== "string" ||
        typeof poll_id !== "string"
      ) {
        throw new FormError(`Form not submitted correctly.`);
      }

      // More validation
      const fields = {
        option_name,
        option_desc,
      };
      const fieldErrors = {
        option_name: new validate(option_name)
          .required("Option Title is a required field.")
          .run(),
      };

      if (Object.values(fieldErrors).some((field) => !field.valid)) {
        throw new FormError("There are some field format issues", {
          fieldErrors,
          fields,
        });
      }

      if (doesOptionExist) {
        const modifyResponse = await modifyPollOption(request, {
          id: option_id,
          option_desc,
          option_name,
          poll_id: Number(poll_id),
        });

        return modifyResponse;
      } else {
        const createResponse = await createPollOption(request, {
          option_name,
          option_desc,
          poll_id: Number(poll_id),
        });

        return createResponse;
      }
    }
  );

  createEffect(() => {
    if (!creatingOption.pending && creatingOption.result) {
      props.OnClose();
    }
  });

  return (
    <Portal>
      <div class={styles.container}>
        <div class={styles.modal}>
          <Form class={styles.form}>
            <h1 class={styles.title}>{props.ID ? "Modify" : "New"} Option</h1>
            <input type="hidden" name="option_id" value={props.ID || -1} />
            <input type="hidden" name="poll_id" value={props.PollID} />
            <Input
              DefaultValue={props.OptionName}
              Type="text"
              Name="option_name"
              Label="Option Title"
              Error={creatingOption?.error?.fieldErrors?.option_name?.error}
              Placeholder="The Option Title"
            />
            <Input
              DefaultValue={props.OptionDescription}
              Type="text"
              Name="option_desc"
              Label="Option Description"
              Placeholder="Some Flavor Text"
            />
            <ButtonBar Split="right-heavy">
              <Button
                Type="button"
                BackgroundColor="transparent"
                OnClick={() => props.OnClose()}
              >
                Cancel
              </Button>
              <Button Type="submit">{props.ID ? "Update" : "Create"}</Button>
            </ButtonBar>
          </Form>
          <Show when={creatingOption.pending}>
            <Loader />
          </Show>
        </div>
      </div>
    </Portal>
  );
};
