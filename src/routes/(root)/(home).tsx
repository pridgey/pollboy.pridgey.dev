import { A, useRouteData } from "solid-start";
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
    // reorder polls
    const sortedActivePolls =
      userPolls
        ?.filter((poll) => !poll.hasPollExpired)
        .sort((a, b) => {
          const a_created = a.created_at || "";
          const b_created = b.created_at || "";
          if (a_created > b_created) return 1;
          if (a_created < b_created) return -1;
          return 0;
        }) ?? [];
    const expiredPolls = userPolls?.filter((poll) => poll.hasPollExpired) ?? [];

    return { user, userPolls: [...sortedActivePolls, ...expiredPolls] };
  });
}

export default function Home() {
  const data = useRouteData<typeof routeData>();

  return (
    <div class={styles.container}>
      <Switch>
        <Match when={data()?.userPolls?.length}>
          <h1 class={styles.poll_title}>Pollboy</h1>
          <div class={styles.pollbox}>
            <For each={data()?.userPolls}>
              {(poll) => <PollCard Poll={poll} />}
            </For>
          </div>
          <Button Href="new">Create a New Poll</Button>
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
