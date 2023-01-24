import { RouteDataArgs, useRouteData } from "solid-start";
import { FormError } from "solid-start/data";
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server";
import { PollForm } from "~/components";
import { editPoll, getPollBySlug } from "~/db/poll";
import { getUser } from "~/db/session";
import { validate } from "~/lib/Validate";
import styles from "~/css/new.module.css";

export function routeData({ params }: RouteDataArgs) {
  return createServerData$(
    async (key, { request }) => {
      const user = await getUser(request);

      if (!user) {
        throw redirect("/login");
      }

      const poll = await getPollBySlug(request, key[0]);

      if (!poll || poll.user_id !== user.user.id) {
        throw redirect("/404");
      }

      return { userID: user.user.id, poll };
    },
    {
      key: () => [params.id],
    }
  );
}

const EditPollPage = () => {
  const pollData = useRouteData<typeof routeData>();

  // Server action for editing a poll
  const [modifyingPoll, { Form }] = createServerAction$(
    async (form: FormData, { request }) => {
      // Get all the data from the form
      const id = form.get("poll_id");
      const slug = form.get("poll_slug");
      const poll_name = form.get("poll_name");
      const poll_desc = form.get("poll_description");
      const expire_at = form.get("poll_expiration");
      const public_can_add = form.get("poll_add_options");
      const multivote = form.get("poll_multivote");

      // Quick validation
      if (
        typeof poll_name !== "string" ||
        typeof poll_desc !== "string" ||
        typeof expire_at !== "string" ||
        typeof id !== "string" ||
        typeof slug !== "string"
      ) {
        throw new FormError(`Form not submitted correctly.`);
      }

      // More validation
      const fields = {
        id,
        poll_name,
        poll_desc,
        expire_at,
        public_can_add,
        multivote,
        slug,
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

      const response = await editPoll(request, {
        id: Number(id),
        poll_desc,
        poll_name,
        expire_at,
        public_can_add: public_can_add === "on",
        multivote: multivote === "on",
        slug,
      });

      if (!response) {
        throw new FormError("That didn't work. Please try again", {
          fields,
        });
      }

      return redirect(`/poll/${slug}`);
    }
  );

  return (
    <div class={styles.container}>
      <h1 class={styles.title}>Modifying: {pollData()?.poll.poll_name}</h1>
      <Form class={styles.form}>
        <input type="hidden" value={pollData()?.poll.id} name="poll_id" />
        <input type="hidden" value={pollData()?.poll.slug} name="poll_slug" />
        <PollForm
          FormLoading={false}
          FormValues={{
            PollDescription: pollData()?.poll?.poll_desc || "",
            PollName: pollData()?.poll?.poll_name || "",
            MultipleVotes: pollData()?.poll?.multivote || false,
            PollExpiration: pollData()?.poll?.expire_at || "",
            UsersCanAdd: pollData()?.poll?.public_can_add || false,
          }}
        />
      </Form>
    </div>
  );
};

export default EditPollPage;
