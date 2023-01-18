import { createClient } from "@supabase/supabase-js";
import { createEffect, createSignal, For, Show } from "solid-js";
import { refetchRouteData, RouteDataArgs, useRouteData } from "solid-start";
import { createServerData$, redirect } from "solid-start/server";
import {
  Button,
  DropdownOptions,
  MenuDots,
  PollOption,
  PollOptionsModal,
  PollResults,
} from "~/components";
import styles from "~/css/poll.module.css";
import { getPollBySlug, getPollResults, PollOptionProps } from "~/db/poll";
import { getUser } from "~/db/session";

export function routeData({ params }: RouteDataArgs) {
  return createServerData$(
    async (key, { request }) => {
      const user = await getUser(request);

      if (!user) {
        throw redirect("/login");
      }

      const poll = await getPollBySlug(request, key[0]);
      const results = await getPollResults(request, poll.id || 0);

      return { userID: user.user.id, poll, results };
    },
    {
      key: () => [params.id],
    }
  );
}

export default function Poll() {
  let pollMenuRef: HTMLButtonElement | undefined;
  const pollData = useRouteData<typeof routeData>();

  const [isMobile, setIsMobile] = createSignal(false);

  createEffect(() => {
    if (window.innerWidth < 480) {
      setIsMobile(true);
      setShowStats(false);
    }
  });

  createEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL || "no_url_found";
    const key = import.meta.env.VITE_SUPABASE_KEY || "no_key_found";

    const client = createClient(url, key);

    client
      .channel("listen")
      .on("postgres_changes", { event: "*", schema: "public" }, (payload) => {
        console.log({ payload });
        refetchRouteData().then((val) => console.log({ val }));
      })
      .subscribe();
  });

  const [showNewOptionModal, setShowNewOptionModal] = createSignal(false);
  const [showPollMenu, setShowPollMenu] = createSignal(false);
  const [showStats, setShowStats] = createSignal(!isMobile());

  return (
    <div class={styles.container}>
      {/* Title Text */}
      <h1 class={styles.polltitle}>{pollData()?.poll?.poll_name}</h1>
      <h2 class={styles.pollsubtitle}>{pollData()?.poll?.poll_desc}</h2>
      {/* Poll Context Menu */}
      <button
        type="button"
        class={styles.menu}
        ref={pollMenuRef}
        onClick={() => setShowPollMenu(!showPollMenu())}
      >
        <MenuDots />
      </button>
      {/* Votable Options */}
      <div class={styles.optionscontainer}>
        <For each={pollData()?.poll?.options}>
          {(polloption: PollOptionProps, index) => {
            return (
              <PollOption
                CanModify={!!polloption.can_modify}
                ID={polloption?.id || 0}
                PollID={pollData()?.poll?.id || 0}
                OptionName={polloption?.option_name}
                OptionDescription={polloption?.option_desc}
                UserVoted={polloption?.user_voted}
                VotePercentage={100 / (index() + 1)}
              />
            );
          }}
        </For>
        <Button Type="button" OnClick={() => setShowNewOptionModal(true)}>
          Add Option
        </Button>
      </div>
      {/* The Voting Results */}
      <Show when={showStats()}>
        <div class={styles.results}>
          <PollResults
            OnClose={() => setShowStats(false)}
            Results={[...(pollData()?.results || [])]}
          />
        </div>
      </Show>

      {/* Modals */}
      <Show when={showNewOptionModal()}>
        <PollOptionsModal
          PollID={pollData()?.poll?.id}
          OnClose={() => setShowNewOptionModal(false)}
        />
      </Show>
      <Show when={showPollMenu()}>
        <DropdownOptions
          Options={[
            {
              Label: "Edit Poll",
              Icon: "",
              OnClick: () => {
                console.log("Edit Poll");
              },
            },
            {
              Label: "Delete Poll",
              Icon: "",
              OnClick: () => {
                console.log("Delete Poll");
              },
            },
          ].concat(
            isMobile()
              ? [
                  {
                    Label: "Show Results",
                    Icon: "",
                    OnClick: () => {
                      setShowStats(true);
                      setShowPollMenu(false);
                    },
                  },
                ]
              : []
          )}
          OnOutsideClick={() => setShowPollMenu(false)}
          PositionRef={pollMenuRef}
          HorizontalAlign="right"
          VerticalGap={10}
        />
      </Show>
    </div>
  );
}
