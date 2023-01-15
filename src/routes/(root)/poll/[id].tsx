import { For, createSignal, Show, createEffect } from "solid-js";
import { RouteDataArgs, useRouteData, refetchRouteData } from "solid-start";
import { createServerData$, redirect, useRequest } from "solid-start/server";
import { Button, NewOptionsModal, PollOption } from "~/components";
import styles from "~/css/poll.module.css";
import { getPollBySlug, PollOptionProps } from "~/db/poll";
import { getUser, getUserSession } from "~/db/session";
import { createClient } from "@supabase/supabase-js";

export function routeData({ params }: RouteDataArgs) {
  return createServerData$(
    async (key, { request }) => {
      const user = await getUser(request);

      if (!user) {
        throw redirect("/login");
      }

      const poll = await getPollBySlug(request, key[0]);
      const session = await getUserSession(request);

      const token = await session.get("token");

      return { user, poll, token };
    },
    {
      key: () => [params.id],
    }
  );
}

export default function Poll() {
  const pollData = useRouteData<typeof routeData>();

  createEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL || "no_url_found";
    const key = import.meta.env.VITE_SUPABASE_KEY || "no_key_found";

    if (pollData()?.token) {
      const client = createClient(url, key, {
        global: {
          headers: { Authorization: `Bearer ${pollData()?.token}` },
        },
      });

      client
        .channel("listen")
        .on("postgres_changes", { event: "*", schema: "public" }, (payload) => {
          console.log({ payload });
          refetchRouteData();
        })
        .subscribe();
    }
  });

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
            CanModify={polloption?.user_id === pollData()?.user?.user?.id}
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
        <NewOptionsModal
          PollID={pollData()?.poll?.id}
          OnClose={() => setShowNewOptionModal(false)}
        />
      </Show>
    </div>
  );
}
