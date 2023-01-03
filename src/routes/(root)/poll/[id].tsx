import { RouteDataArgs, useParams } from "solid-start";
import { useRouteData } from "solid-start";
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server";
import { getUser, logout } from "~/db/session";
import styles from "~/css/poll.module.css";
import { Button, Input, PollCard, SVGPark } from "~/components";
import { For, Switch, Match } from "solid-js";
import { getPollBySlug } from "~/db/poll";

export function routeData({ params }: RouteDataArgs) {
  return createServerData$(
    async (key, { request }) => {
      const user = await getUser(request);

      if (!user) {
        throw redirect("/login");
      }

      const poll = await getPollBySlug(request, key[0]);

      return { user, poll: poll?.[0] };
    },
    {
      key: () => [params.id],
    }
  );
}

export default function Poll() {
  const pollData = useRouteData<typeof routeData>();

  return (
    <div class={styles.container}>
      <h1 class={styles.polltitle}>{pollData()?.poll?.poll_name}</h1>
      <h2 class={styles.pollsubtitle}>{pollData()?.poll?.poll_desc}</h2>
    </div>
  );
}
