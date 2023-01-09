import { For, createSignal, Show } from "solid-js";
import { RouteDataArgs, useRouteData } from "solid-start";
import { createServerData$, redirect } from "solid-start/server";
import { Button, NewOptionsModal, PollOption } from "~/components";
import styles from "~/css/poll.module.css";
import { getPollBySlug, PollOptionProps } from "~/db/poll";
import { getUser } from "~/db/session";

export function routeData({ params }: RouteDataArgs) {
  return createServerData$(
    async (key, { request }) => {
      const user = await getUser(request);

      if (!user) {
        throw redirect("/login");
      }

      const poll = await getPollBySlug(request, key[0]);

      return { user, poll };
    },
    {
      key: () => [params.id],
    }
  );
}

export default function Poll() {
  const pollData = useRouteData<typeof routeData>();

  const [showNewOptionModal, setShowNewOptionModal] = createSignal(false);

  return (
    <div class={styles.container}>
      <h1 class={styles.polltitle}>{pollData()?.poll?.poll_name}</h1>
      <h2 class={styles.pollsubtitle}>{pollData()?.poll?.poll_desc}</h2>
      <div class={styles.buttonrow}>
        <Button Type="button" BackgroundColor="transparent" TextColor="red">
          Delete
        </Button>
      </div>
      <For each={pollData()?.poll?.options}>
        {(polloption: PollOptionProps, index) => (
          <PollOption
            ID={polloption?.id || 0}
            PollID={pollData()?.poll?.id || 0}
            OptionName={polloption?.option_name}
            OptionDescription={polloption?.option_desc}
            UserVoted={polloption?.user_voted}
            VotePercentage={100 / (index() + 1)}
          />
        )}
      </For>
      <Button Type="button" OnClick={() => setShowNewOptionModal(true)}>
        Add Option
      </Button>
      <Show when={showNewOptionModal()}>
        <NewOptionsModal />
      </Show>
    </div>
  );
}
