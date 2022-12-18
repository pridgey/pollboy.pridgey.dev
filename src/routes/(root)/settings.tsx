import { useRouteData } from "solid-start";
import styles from "~/css/settings.module.css";
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server";
import { getUser } from "~/db/session";
import { Switch, Match, createEffect, createSignal } from "solid-js";
import { FormError } from "solid-start/data";
import { getUserSettings, updateUserSettings } from "~/db/settings";
import { Button, Input } from "~/components";

export const routeData = () => {
  const userData = createServerData$(async (_, { request }) => {
    const user = await getUser(request);

    if (!user) {
      throw redirect("/login");
    }

    return user;
  });

  const settingsData = createServerData$(async (_, { request }) => {
    const settings = await getUserSettings(request);

    return settings;
  });

  return { userData, settingsData };
};

const Settings = () => {
  // Grab user info from route data above
  const data = useRouteData<typeof routeData>();
  const { userData, settingsData } = data;

  console.log("Settings:", { data: settingsData() });

  // Signal for the formatted date_created string
  const [createdString, setCreatedString] = createSignal("");

  // Update and format the date_created string when data comes in
  createEffect(() => {
    const dateCreated = userData()?.user.created_at;
    if (dateCreated) {
      const dateCreated_Date = new Date(dateCreated);
      if (!isNaN(dateCreated_Date.valueOf())) {
        const formatedDateString = new Intl.DateTimeFormat("default", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(dateCreated_Date);

        setCreatedString(formatedDateString);
      }
    }
  });

  // Update user profile
  const [updatingProfile, { Form }] = createServerAction$(
    async (form: FormData, { request }) => {
      // Get all the data from the form
      const username = form.get("username");

      // Quick validation
      if (typeof username !== "string") {
        throw new FormError(`Form not submitted correctly.`);
      }

      // More validation
      const fields = { username };
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

      const response = await updateUserSettings(request, {
        display_name: username,
      });

      if (!response) {
        throw new FormError("That didn't work. Please try again", {
          fields,
        });
      }

      return response;
    }
  );

  return (
    <div class={styles.container}>
      <div class={styles.profilecard}>
        <Switch>
          <Match when={!!userData()?.user?.user_metadata?.avatarurl?.length}>
            <img
              alt="user profile image"
              class={styles.profileimage}
              src={userData()?.user?.user_metadata?.avatarurl}
            />
          </Match>
          <Match when={!userData()?.user?.user_metadata?.avatarurl?.length}>
            <div class={styles.profileimage}></div>
          </Match>
        </Switch>
        <h1 class={styles.profiletitle}>
          {userData()?.user?.user_metadata?.username || userData()?.user?.email}
        </h1>
        <div class={styles.profileinfogroup}>
          <h2 class={styles.profileinfolabel}>email</h2>
          <h3 class={styles.profileinfodatum}>{userData()?.user?.email}</h3>
        </div>
        <div class={styles.profileinfogroup}>
          <h2 class={styles.profileinfolabel}>created</h2>
          <h3 class={styles.profileinfodatum}>{createdString()}</h3>
        </div>
      </div>
      <div class={styles.profilecard} style={{ "align-items": "flex-start" }}>
        <h1 class={styles.profiletitle}>User Profile</h1>
        <Form>
          <Input
            Label="Display Name"
            Name="username"
            Type="text"
            Placeholder="What to call you"
          />
          <Button Type="submit">Save Settings</Button>
        </Form>
      </div>
    </div>
  );
};

export default Settings;
