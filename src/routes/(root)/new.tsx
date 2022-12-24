import { useRouteData } from "solid-start";
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server";
import { getUser, logout } from "~/db/session";
import styles from "~/css/new.module.css";
import { Button, Input, PollCard, SVGPark } from "~/components";
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

      // Quick validation
      if (typeof poll_name !== "string" || typeof poll_desc !== "string") {
        throw new FormError(`Form not submitted correctly.`);
      }

      // More validation
      const fields = { poll_name, poll_desc };
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
        <Input
          Label="Poll Name"
          Name="name"
          Type="text"
          Placeholder="What's your favorite Backstreet Boys song?"
        />
        <Input
          Label="Description"
          Name="description"
          Type="text"
          Placeholder="Add some additional info"
        />
        <Button Type="submit">Create Poll</Button>
      </Form>
    </div>
  );
}
