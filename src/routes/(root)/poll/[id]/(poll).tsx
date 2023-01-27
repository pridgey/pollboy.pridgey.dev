import { createClient } from "@supabase/supabase-js";
import { createEffect, createSignal, For, Match, Show, Switch } from "solid-js";
import {
  refetchRouteData,
  RouteDataArgs,
  useRouteData,
  useNavigate,
} from "solid-start";
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server";
import {
  Button,
  ConfirmDeleteModal,
  DropdownOptions,
  MenuDots,
  Option,
  PollOption,
  PollOptionsModal,
  PollResults,
  SharePollModal,
} from "~/components";
import styles from "~/css/poll.module.css";
import {
  deletePoll,
  getPollBySlug,
  getPollResults,
  PollOptionProps,
} from "~/db/poll";
import { getUser } from "~/db/session";

export function routeData({ params }: RouteDataArgs) {
  return createServerData$(
    async (key, { request }) => {
      const user = await getUser(request);

      if (!user) {
        throw redirect("/login");
      }

      const poll = await getPollBySlug(request, key[0]);

      if (!poll) {
        throw redirect("/404");
      }

      const results = await getPollResults(request, poll.id || 0);

      return { userID: user.user.id, poll, results };
    },
    {
      key: () => [params.id],
    }
  );
}

type DeletePollActionArgs = {
  ID: number;
};

export default function Poll() {
  let pollMenuRef: HTMLButtonElement | undefined;
  const pollData = useRouteData<typeof routeData>();
  const navigate = useNavigate();

  // Server action to handle deleting a poll
  const [deleting, handleDeletePoll] = createServerAction$(
    async (args: DeletePollActionArgs, { request }) => {
      await deletePoll(request, args.ID);
    }
  );

  const [isMobile, setIsMobile] = createSignal(false);

  const adminMenuOptions: Option[] = [
    {
      Label: "Edit Poll",
      Icon: "",
      OnClick: () => {
        navigate(`edit`);
      },
    },
    {
      Label: "Delete Poll",
      Icon: "",
      OnClick: () => {
        setShowDeletePoll(!showDeletePoll());
      },
    },
    {
      Label: "Share Link",
      Icon: "",
      OnClick: () => {
        if (navigator.clipboard) {
          navigator.share({
            url: window.location.href,
          });
        } else if (document) {
          // No Navigator, use the old method
          const ele = document.createElement("textarea");
          document.body.appendChild(ele);
          ele.value = window.location.href;
          ele.select();
          document.execCommand("copy");
          document.body.removeChild(ele);
        }
        setShowPollMenu(false);
      },
    },
    {
      Label: "Share QR Code",
      Icon: "",
      OnClick: () => {
        setShowQR(!showQR());
        setShowPollMenu(false);
      },
    },
  ];

  const mobileMenuOptions: Option[] = [
    {
      Label: "Show Results",
      Icon: "",
      OnClick: () => {
        setShowStats(true);
        setShowPollMenu(false);
      },
    },
  ];

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
      .on("postgres_changes", { event: "*", schema: "public" }, () => {
        refetchRouteData().then((val) => console.log({ val }));
      })
      .subscribe();
  });

  const [showNewOptionModal, setShowNewOptionModal] = createSignal(false);
  const [showPollMenu, setShowPollMenu] = createSignal(false);
  const [showDeletePoll, setShowDeletePoll] = createSignal(false);
  const [showQR, setShowQR] = createSignal(false);
  const [showStats, setShowStats] = createSignal(!isMobile());

  return (
    <div
      class={styles.container}
      style={{ overflow: showStats() ? "hidden" : "auto" }}
    >
      {/* Title Text */}
      <h1 class={styles.polltitle}>{pollData()?.poll?.poll_name}</h1>
      <h2 class={styles.pollsubtitle}>{pollData()?.poll?.poll_desc}</h2>
      {/* Poll Context Menu */}
      <Show when={pollData()?.poll?.isPollOwner || isMobile()}>
        <button
          type="button"
          class={styles.menu}
          ref={pollMenuRef}
          onClick={() => setShowPollMenu(!showPollMenu())}
        >
          <MenuDots />
        </button>
      </Show>
      <div class={styles.optionscontainer}>
        <Switch>
          {/* Stats are a separate box in mobile, and when poll has expired */}
          <Match
            when={
              (isMobile() && showStats()) || pollData()?.poll?.hasPollExpired
            }
          >
            <Show when={pollData()?.poll?.hasPollExpired}>
              <div class={styles.expiredbanner}>
                <h2 class={styles.pollsubtitle}>This Poll has Expired</h2>
              </div>
            </Show>
            <PollResults
              PollExpired={pollData()?.poll?.hasPollExpired || false}
              OnClose={() => setShowStats(false)}
              Results={[...(pollData()?.results || [])]}
            />
          </Match>
          <Match when={!pollData()?.poll?.hasPollExpired}>
            {/* Votable Options */}
            <Show when={pollData()?.poll?.options?.length === 0}>
              <h2 class={styles.pollsubtitle}>
                There are no options to vote for
              </h2>
              <Show when={pollData()?.poll?.canUserAddOptions}>
                <h2 class={styles.pollsubtitle}>Click below to get started</h2>
              </Show>
            </Show>
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
            <Show when={pollData()?.poll?.canUserAddOptions}>
              <Button Type="button" OnClick={() => setShowNewOptionModal(true)}>
                Add Option
              </Button>
            </Show>
          </Match>
        </Switch>
      </div>

      {/* The Voting Results */}
      <Show when={showStats() && !pollData()?.poll?.hasPollExpired}>
        <div class={styles.results}>
          <PollResults
            PollExpired={pollData()?.poll?.hasPollExpired || false}
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
      <Show when={showDeletePoll()}>
        <ConfirmDeleteModal
          Name={`Poll: "${pollData()?.poll.poll_name}"`}
          OnClose={async (confirm) => {
            if (confirm) {
              // Delete Poll
              handleDeletePoll({ ID: pollData()?.poll.id || 0 });
              navigate("/");
            }
            setShowDeletePoll(false);
          }}
        />
      </Show>
      <Show when={showQR()}>
        <SharePollModal OnClose={() => setShowQR(false)} />
      </Show>
      <Show when={showPollMenu()}>
        <DropdownOptions
          Options={([] as Option[])
            .concat(pollData()?.poll?.isPollOwner ? adminMenuOptions : [])
            .concat(isMobile() ? mobileMenuOptions : [])}
          OnOutsideClick={() => setShowPollMenu(false)}
          PositionRef={pollMenuRef}
          HorizontalAlign="right"
          VerticalGap={10}
        />
      </Show>
    </div>
  );
}
