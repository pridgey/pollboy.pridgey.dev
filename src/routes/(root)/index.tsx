import { useRouteData } from "solid-start";
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server";
import { getUser, logout } from "~/db/session";
import styles from "~/css/home.module.css";
import { Button, Input, PollCard, SVGPark } from "~/components";
import { For, Switch, Match } from "solid-js";
import { getUserPolls } from "~/db/poll";

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const user = await getUser(request);

    if (!user) {
      throw redirect("/login");
    }

    const userPolls = await getUserPolls(request);

    return { user, userPolls };
  });
}

export default function Home() {
  const data = useRouteData<typeof routeData>();

  return (
    <div class={styles.container}>
      <Switch>
        <Match when={data()?.userPolls?.length}>
          <h1 class={styles.poll_title}>Pollboy</h1>
          <For each={data()?.userPolls}>
            {(poll) => (
              <>
                <h2 class={styles.poll_subtitle}>{poll.poll_name}</h2>
                <h2 class={styles.poll_subtitle}>{poll.poll_desc}</h2>
              </>
            )}
          </For>
        </Match>
        <Match when={!data()?.userPolls?.length}>
          <div class={styles.not_found}>
            <SVGPark />
            <h2 class={styles.poll_subtitle}>
              On a breezy day, not a Poll was found...
            </h2>
            <Button
              BackgroundColor="transparent"
              TextColor="--color-orange"
              Href="new"
            >
              Create a New Poll
            </Button>
          </div>
        </Match>
      </Switch>
    </div>
  );
}
