import { createAsync, type RouteDefinition } from "@solidjs/router";
import { createSignal, For, Match, Show, Switch } from "solid-js";
import { Button } from "~/components/Button";
import { Flex } from "~/components/Flex";
import { Modal } from "~/components/Modal";
import { Text } from "~/components/Text";
import { PollCard } from "~/compositions/PollCard";
import { PollForm } from "~/compositions/PollForm/PollForm";
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

  const [showCreatePollModal, setShowCreatePollModal] = createSignal(false);

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
          <Button OnClick={() => setShowCreatePollModal(true)}>
            Create a New Poll
          </Button>
        </Match>
        <Match when={!polls()?.length}>
          <div class={styles.not_found}>
            {/* <SVGPark /> */}
            <h2 class={styles.poll_subtitle}>
              On a breezy day, not a Poll was found...
            </h2>
            <Button
              Color="secondary"
              OnClick={() => setShowCreatePollModal(true)}
              Variant="text"
            >
              Create a New Poll
            </Button>
          </div>
        </Match>
      </Switch>
      <Show when={showCreatePollModal()}>
        <Modal
          OnClose={() => setShowCreatePollModal(false)}
          OnSubmit={() => undefined}
          SubmitLabel="Create Poll"
          Title="Create New Poll"
          Width="800px"
        >
          <PollForm />
        </Modal>
      </Show>
    </section>
  );
}
