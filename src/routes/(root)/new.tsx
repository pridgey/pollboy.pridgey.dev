import { FormError } from "solid-start/data";
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server";
import { PollForm } from "~/components";
import styles from "~/css/new.module.css";
import { createPoll } from "~/db/poll";
import { getUser } from "~/db/session";
import { validate } from "~/lib/Validate";

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const user = await getUser(request);

    if (!user) {
      throw redirect("/login");
    }

    return user;
  });
}

export default function New() {
  const [creatingPoll, { Form }] = createServerAction$(
    async (form: FormData, { request }) => {
      // Get all the data from the form
      const poll_name = form.get("poll_name");
      const poll_desc = form.get("poll_description");
      const expire_at = form.get("poll_expiration");
      const public_can_add = form.get("poll_add_options");
      const multivote = form.get("poll_multivote");

      // Quick validation
      if (
        typeof poll_name !== "string" ||
        typeof poll_desc !== "string" ||
        typeof expire_at !== "string"
      ) {
        throw new FormError(`Form not submitted correctly.`);
      }

      // More validation
      const fields = {
        poll_name,
        poll_desc,
        expire_at,
        public_can_add,
        multivote,
      };
      const fieldErrors = {
        poll_name: new validate(poll_name)
          .required("Poll Name is a required field.")
          .run(),
        poll_description: new validate(poll_desc)
          .required("Poll Description is a required field.")
          .run(),
        poll_expiration: new validate(expire_at)
          .required("Expiration Date is a required field.")
          .run(),
      };

      if (Object.values(fieldErrors).some((field) => !field.valid)) {
        throw new FormError("There are some field format issues", {
          fieldErrors,
          fields,
        });
      }

      const response = await createPoll(request, {
        poll_desc,
        poll_name,
        expire_at,
        public_can_add: public_can_add === "on",
        multivote: multivote === "on",
      });

      if (!response) {
        throw new FormError("That didn't work. Please try again", {
          fields,
        });
      }

      return redirect(`/poll/${response}`);
    }
  );

  return (
    <div class={styles.container}>
      <h1 class={styles.title}>Create a Poll</h1>
      <h2 class={styles.subtitle}>Get feedback, gather opinions</h2>
      <Form class={styles.form}>
        <PollForm
          FormLoading={creatingPoll.pending}
          FormErrors={creatingPoll?.error?.fieldErrors}
        />
      </Form>
    </div>
  );
}
