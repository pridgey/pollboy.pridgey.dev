import {
  createAsync,
  useAction,
  useSubmission,
  type RouteDefinition,
} from "@solidjs/router";
import { createEffect, createSignal, For, Match, Show, Switch } from "solid-js";
import { Button } from "~/components/Button";
import { Modal } from "~/components/Modal";
import { PollCard } from "~/compositions/PollCard";
import { PollForm } from "~/compositions/PollForm/PollForm";
import {
  createPollAction,
  getFullPoll,
  getPollOptions,
  getRelevantPolls,
} from "~/lib/api";
import { getUser } from "~/lib/auth";
import styles from "~/styles/home.module.css";
import { PollRecord, UserRecord } from "~/types/pocketbase";

export const route = {
  preload() {
    getUser();
    getRelevantPolls();
  },
} satisfies RouteDefinition;

export default function Home() {
  const user = createAsync(() => getUser(true), { deferStream: true });
  const polls = createAsync(() => getRelevantPolls());
  const createPoll = useAction(createPollAction);
  const creatingPoll = useSubmission(createPollAction);

  const [showCreatePollModal, setShowCreatePollModal] = createSignal(false);
  const [newPollState, setNewPollState] = createSignal<PollRecord | null>();

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
          OnSubmit={async () => {
            if (!!newPollState()) {
              await createPoll(newPollState() as PollRecord);
              if (!creatingPoll.error) {
                setShowCreatePollModal(false);
              }
            }
          }}
          Pending={creatingPoll.pending}
          SubmitLabel="Create Poll"
          Title="Create New Poll"
          Width="800px"
        >
          <PollForm OnChange={(poll) => setNewPollState(poll)} />
        </Modal>
      </Show>
    </section>
  );
}
