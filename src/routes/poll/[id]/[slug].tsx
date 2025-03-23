import { createAsync, useParams } from "@solidjs/router";
import { CgMenuOreos } from "solid-icons/cg";
import {
  createMemo,
  createSignal,
  For,
  Match,
  Show,
  Suspense,
  Switch,
} from "solid-js";
import { Button } from "~/components/Button";
import { DropdownOptions } from "~/components/DropdownOptions";
import { PollResults } from "~/compositions/PollResults";
import { getPollById } from "~/lib/api";
import { getUser } from "~/lib/auth";
import styles from "~/styles/poll.module.css";

/**
 * Route representing /poll/[id]/[slug]
 * Shows the poll and its options, allowing for users to interact and vote with the poll
 */
export default function Poll() {
  const params = useParams();
  const poll = createAsync(() => getPollById(params.id));
  const user = createAsync(() => getUser());

  // State to determine if we show the poll's current votes
  const [showStats, setShowStats] = createSignal(false);
  // State that determines if we are on a mobile screen size
  const [isMobile, setIsMobile] = createSignal(false);
  // State to determine if we show the poll's menu
  const [showPollMenu, setShowPollMenu] = createSignal(false);

  // Ref for the poll menu button
  let pollMenuRef;

  // Memo to determine if the current user is the poll's owner
  const isPollOwner = createMemo(() => user()?.id === poll()?.user_id);
  // Memo to determine if this poll has expired
  const hasPollExpired = createMemo(() => {
    const today = new Date();
    const expireDate = new Date(poll()?.expire_at ?? "");
    return today > expireDate;
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Match when={poll()?.slug === params.slug}>
          <div
            class={styles.container}
            style={{ overflow: showStats() ? "hidden" : "auto" }}
          >
            {/* Title Text */}
            <h1 class={styles.polltitle}>{poll()?.poll_name}</h1>
            <h2 class={styles.pollsubtitle}>{poll()?.poll_desc}</h2>
            {/* Poll Context Menu */}
            <Show when={isPollOwner() || isMobile()}>
              <button
                type="button"
                class={styles.menu}
                ref={pollMenuRef}
                onClick={() => setShowPollMenu(!showPollMenu())}
              >
                <CgMenuOreos />
              </button>
            </Show>
            <Switch>
              {/* Stats are a separate box in mobile, and when poll has expired */}
              <Match when={hasPollExpired()}>
                <div class={styles.optionscontainer}>
                  {/* Expiration banner */}
                  <div class={styles.expiredbanner}>
                    <h2 class={styles.pollsubtitle}>This Poll has Expired</h2>
                  </div>
                  {/* Show only the results */}
                  <PollResults
                    PollExpired={hasPollExpired() || false}
                    OnClose={() => setShowStats(false)}
                    Results={[...(pollData()?.results || [])]}
                  />
                </div>
              </Match>
              <Match when={!hasPollExpired() && !showStats()}>
                <div class={styles.optionscontainer}>
                  {/* Votable Options */}
                  <Show when={poll()?.options?.length === 0}>
                    <h2 class={styles.pollsubtitle}>
                      There are no options to vote for
                    </h2>
                    <Show when={poll()?.public_can_add}>
                      <h2 class={styles.pollsubtitle}>
                        Click below to get started
                      </h2>
                    </Show>
                  </Show>
                  <For each={poll()?.options}>
                    {(polloption: PollOptionProps, index) => {
                      return (
                        <PollOption
                          CanModify={!!polloption.can_modify}
                          Disabled={calculateOptionStatus(
                            !!poll()?.multivote,
                            !!polloption.user_voted,
                            !!poll()?.options?.some((opt) => opt.user_voted)
                          )}
                          ID={polloption?.id || 0}
                          MultiVote={poll()?.multivote || false}
                          PollID={poll()?.id || 0}
                          OptionName={polloption?.option_name}
                          OptionDescription={polloption?.option_desc}
                          UserVoted={polloption?.user_voted}
                          VotePercentage={100 / (index() + 1)}
                        />
                      );
                    }}
                  </For>
                </div>
                <Show when={poll()?.public_can_add}>
                  <span style={{ "grid-area": "button" }}>
                    <Button
                      Type="button"
                      OnClick={() => setShowNewOptionModal(true)}
                    >
                      Add Option
                    </Button>
                  </span>
                </Show>
                <Show when={!isMobile()}>
                  <div class={styles.results}>
                    <PollResults
                      PollExpired={hasPollExpired() || false}
                      OnClose={() => setShowStats(false)}
                      Results={[...(pollData()?.results || [])]}
                    />
                  </div>
                </Show>
              </Match>
            </Switch>

            {/* The Voting Results for mobile view */}
            <Show when={showStats() && !hasPollExpired()}>
              <div class={styles.optionscontainer}>
                <PollResults
                  PollExpired={hasPollExpired() || false}
                  OnClose={() => setShowStats(false)}
                  Results={[...(pollData()?.results || [])]}
                />
              </div>
            </Show>

            {/* Modals */}
            <Show when={showNewOptionModal()}>
              <PollOptionsModal
                PollID={poll()?.id}
                OnClose={() => setShowNewOptionModal(false)}
              />
            </Show>
            <Show when={showDeletePoll()}>
              <ConfirmDeleteModal
                Name={`Poll: "${poll().poll_name}"`}
                OnClose={async (confirm) => {
                  if (confirm) {
                    // Delete Poll
                    handleDeletePoll({ ID: poll().id || 0 });
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
                  .concat(isPollOwner() ? adminMenuOptions : [])
                  .concat(
                    isMobile() && !hasPollExpired() ? mobileMenuOptions : []
                  )}
                OnOutsideClick={() => setShowPollMenu(false)}
                PositionRef={pollMenuRef}
                HorizontalAlign="right"
                VerticalGap={10}
              />
            </Show>
          </div>
        </Match>
        <Match when={poll()?.slug !== params.slug}>
          <div>No poll found</div>
        </Match>
      </Switch>
    </Suspense>
  );
}
