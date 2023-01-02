import { FormError } from "solid-start/data";
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server";
import { Button, Input, Textarea, Toggle } from "~/components";
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
      <h1 class={styles.title}>Get feedback, gather opinions</h1>
      <h2 class={styles.subtitle}>
        Simply provide a question and some options for people to choose from.
        You can also customize the poll by adding a description, setting a
        deadline, and choosing whether to allow multiple votes.
      </h2>
      <Form class={styles.form}>
        <span class={styles.form_label}>
          <Input
            Error={creatingPoll?.error?.fieldErrors?.poll_name?.error}
            Label="Poll Name"
            Name="poll_name"
            Type="text"
            Tooltip="This is the title of the poll. It'll be used to identify the poll."
            Placeholder="What's your favorite Backstreet Boys song?"
          />
        </span>
        <span class={styles.form_expiry}>
          <Input
            Error={creatingPoll?.error?.fieldErrors?.poll_expiration?.error}
            Label="Poll Expiration"
            Name="poll_expiration"
            Tooltip="This is the last day someone can vote on this poll."
            Type="date"
            Placeholder="When does this poll end?"
          />
        </span>
        <span class={styles.form_desc}>
          <Textarea
            Error={creatingPoll?.error?.fieldErrors?.poll_description?.error}
            Label="Description"
            Name="poll_description"
            Tooltip="The description of the Poll. It's helpful for users to understand the poll."
            Placeholder="Add some additional info"
          />
        </span>
        <span class={styles.form_add}>
          <Toggle
            Label="Users Can Add"
            Name="poll_add_options"
            Tooltip="Can users add options to this poll?"
          />
        </span>
        <span class={styles.form_multi}>
          <Toggle
            Label="Multiple Votes"
            Name="poll_multivote"
            Tooltip="Can users vote for more than one option on this poll?"
          />
        </span>
        <span class={styles.form_button}>
          <Button Disabled={creatingPoll?.pending} Type="submit">
            Create Poll
          </Button>
        </span>
      </Form>
    </div>
  );
}
