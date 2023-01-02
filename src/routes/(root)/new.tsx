import { useRouteData } from "solid-start";
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server";
import { getUser, logout } from "~/db/session";
import styles from "~/css/new.module.css";
import {
  Button,
  Input,
  Textarea,
  Toggle,
  PollCard,
  SVGPark,
} from "~/components";
import { Switch, Match } from "solid-js";
import { FormError } from "solid-start/data";
import { createPoll } from "~/db/poll";

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
      const poll_name = form.get("name");
      const poll_desc = form.get("description");
      const expire_at = form.get("expiration");
      const public_can_add = form.get("add_options");
      const multivote = form.get("multivote");

      console.log({ multivote });

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
      //   const fieldErrors = {
      //     email: validateEmail(email),
      //     password: validatePassword(password),
      //   };

      //   if (Object.values(fieldErrors).some(Boolean)) {
      //     throw new FormError("There are some field format issues", {
      //       fieldErrors,
      //       fields,
      //     });
      //   }

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

      return redirect("/");
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
            Label="Poll Name"
            Name="name"
            Type="text"
            Placeholder="What's your favorite Backstreet Boys song?"
          />
        </span>
        <span class={styles.form_expiry}>
          <Input
            Label="Poll Expiration"
            Name="expiration"
            Type="date"
            Placeholder="When does this poll end?"
          />
        </span>
        <span class={styles.form_desc}>
          <Textarea
            Label="Description"
            Name="description"
            Placeholder="Add some additional info"
          />
        </span>
        <span class={styles.form_add}>
          <Toggle Label="Users Can Add" Name="add_options" />
        </span>
        <span class={styles.form_multi}>
          <Toggle Label="Multiple Votes" Name="multivote" />
        </span>
        <span class={styles.form_button}>
          <Button Type="submit">Create Poll</Button>
        </span>
      </Form>
    </div>
  );
}
