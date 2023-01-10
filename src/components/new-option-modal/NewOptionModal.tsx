import { Portal } from "solid-js/web";
import { ButtonBar, Button, Input, Loader } from "~/components";
import styles from "./NewOptionModal.module.css";
import { FormError } from "solid-start/data";
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server";
import { validate } from "~/lib/Validate";
import { createPollOption } from "~/db/poll";
import { createEffect, Show } from "solid-js";

type NewOptionModalProps = {
  PollID?: number;
  OnClose: () => void;
};

export const NewOptionsModal = (props: NewOptionModalProps) => {
  const [creatingOption, { Form }] = createServerAction$(
    async (form: FormData, { request }) => {
      // Get all the data from the form
      const option_name = form.get("option_name");
      const option_desc = form.get("option_desc");
      const poll_id = form.get("poll_id");

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

      const response = await createPollOption(request, {
        option_name,
        option_desc,
        poll_id: Number(poll_id),
      });

      return response;
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
            <h1 class={styles.title}>New Option</h1>
            <input type="hidden" name="poll_id" value={props.PollID} />
            <Input
              Type="text"
              Name="option_name"
              Label="Option Title"
              Error={creatingOption?.error?.fieldErrors?.option_name?.error}
              Placeholder="The Option Title"
            />
            <Input
              Type="text"
              Name="option_desc"
              Label="Option Description"
              Placeholder="Some Flavor Text"
            />
            <ButtonBar Split="right-heavy">
              <Button
                Type="button"
                BackgroundColor="red"
                TextColor="white"
                OnClick={() => props.OnClose()}
              >
                Cancel
              </Button>
              <Button Type="submit">Submit</Button>
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
