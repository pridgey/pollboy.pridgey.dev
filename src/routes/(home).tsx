import { createAsync, type RouteDefinition } from "@solidjs/router";
import { For, Match, Switch } from "solid-js";
import { Button } from "~/components/Button";
import { Flex } from "~/components/Flex";
import { Text } from "~/components/Text";
import { PollCard } from "~/compositions/PollCard";
import { getRelevantPolls } from "~/lib/api";
import { getUser } from "~/lib/auth";
import styles from "~/styles/home.module.css";
import { UserRecord } from "~/types/pocketbase";

export const route = {
  preload() {
    getUser();
    getRelevantPolls();
  },
} satisfies RouteDefinition;

export default function Home() {
  const user = createAsync(() => getUser(true), { deferStream: true });
  const polls = createAsync(() => getRelevantPolls());

  return (
    <section class={styles.container}>
      <Switch>
        <Match when={polls()?.length}>
          <h1 class={styles.poll_title}>Pollboy</h1>
          <div class={styles.pollbox}>
            <For each={polls()}>
              {(poll) => (
                <PollCard Poll={poll} User={user() as unknown as UserRecord} />
              )}
            </For>
          </div>
          <Button Href="new">Create a New Poll</Button>
        </Match>
        <Match when={!polls()?.length}>
          <div class={styles.not_found}>
            {/* <SVGPark /> */}
            <h2 class={styles.poll_subtitle}>
              On a breezy day, not a Poll was found...
            </h2>
            <Button Color="secondary" Href="new" Variant="text">
              Create a New Poll
            </Button>
          </div>
        </Match>
      </Switch>
    </section>
  );
}
