import {
  createAsync,
  useAction,
  useParams,
  useSubmission,
} from "@solidjs/router";
import { BsThreeDotsVertical } from "solid-icons/bs";
import {
  createMemo,
  createSignal,
  For,
  Match,
  onMount,
  Show,
  Suspense,
  Switch,
} from "solid-js";
import { Button } from "~/components/Button";
import { DropdownOptions, Option } from "~/components/DropdownOptions";
import { Modal } from "~/components/Modal";
import { PollForm } from "~/compositions/PollForm/PollForm";
import { PollOption } from "~/compositions/PollOption";
import { PollOptionForm } from "~/compositions/PollOptionForm";
import { OptionVotes, PollResults } from "~/compositions/PollResults";
import {
  createPollOptionAction,
  deletePollAction,
  editPollAction,
  getFullPoll,
} from "~/lib/api";
import { getUser } from "~/lib/auth";
import styles from "~/styles/poll.module.css";
import { PollOptionRecord, PollRecord } from "~/types/pocketbase";

/**
 * Utility function to determine if a poll option should show as disabled
 * @param multivote Is this poll multi-vote?
 * @param userHasVotedForThisOption  Has the user voted for this option?
 * @param userHasVotedForOtherOptions Has the user voted for other options?
 * @returns boolean
 */
const calculateOptionStatus = (
  multivote: boolean,
  userHasVotedForThisOption: boolean,
  userHasVotedForOtherOptions: boolean
): boolean => {
  if (multivote) {
    return false;
  }

  if (userHasVotedForThisOption) {
    return false;
  }

  if (userHasVotedForOtherOptions) {
    return true;
  }

  // multivote is off, user has not voted for any options
  return false;
};

/**
 * Route representing /poll/[id]/[slug]
 * Shows the poll and its options, allowing for users to interact and vote with the poll
 */
export default function Poll() {
  const params = useParams();
  const poll = createAsync(() => getFullPoll(params.id));
  const user = createAsync(() => getUser());

  // Server action to create a new poll option
  const [newPollOption, updateNewPollOption] =
    createSignal<PollOptionRecord | null>();
  const createPollOption = useAction(createPollOptionAction);
  const creatingPollOption = useSubmission(createPollOptionAction);

  // Server action to delete a poll
  const deletePoll = useAction(deletePollAction);
  const deletingPoll = useSubmission(deletePollAction);

  // Server action to edit a poll
  const [modifiedPoll, setModifiedPoll] = createSignal<PollRecord | null>();
  const editPoll = useAction(editPollAction);
  const editingPoll = useSubmission(editPollAction);

  // State to determine if we show the poll's current votes
  const [showStats, setShowStats] = createSignal(false);
  // State to determine if we show the poll's menu
  const [showPollMenu, setShowPollMenu] = createSignal(false);
  // State to determine if we show a modal for the creation of a new poll
  const [showNewOptionModal, setShowNewOptionModal] = createSignal(false);
  // State to determine if we show a modal to delete the poll
  const [showDeletePoll, setShowDeletePoll] = createSignal(false);
  // State to determine if we show a modal to edit the poll
  const [showEditPoll, setShowEditPoll] = createSignal(false);
  // State that determines if we are on a mobile screen size
  const [isMobile, setIsMobile] = createSignal(false);
  onMount(() => {
    if (window.innerWidth < 600) {
      setIsMobile(true);
      setShowStats(!!params.so && isMobile());
    }
  });

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

  /**
   * Utiltiy function to handle copying
   */
  const handleCopy = () => {
    const shareData = {
      url: window.location.href,
    };

    if (
      !!navigator.canShare &&
      navigator.canShare(shareData) &&
      navigator.clipboard
    ) {
      navigator.share(shareData);
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
  };

  // Additional Menu Options
  const adminMenuOptions: Option[] = [
    {
      Label: "Edit Poll",
      Icon: "",
      OnClick: () => setShowEditPoll(true),
    },
    {
      Label: "Delete Poll",
      Icon: "",
      OnClick: () => {
        setShowDeletePoll(!showDeletePoll());
      },
    },
    {
      Label: "Copy Poll Link",
      Icon: "",
      OnClick: () => handleCopy(),
    },
  ];

  const mobileMenuOptions: Option[] = [
    {
      Label: "Show Results",
      Icon: "",
      OnClick: () => {
        setShowStats(true);
        // navigate("?so=true", { replace: true });
        setShowPollMenu(false);
      },
    },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Match when={poll()?.slug === params.slug}>
          <div class={styles.container} style={{ overflow: "auto" }}>
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
                <BsThreeDotsVertical style={{ height: "30px" }} />
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
                    Results={poll()?.rankings as OptionVotes[]}
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
                    {(polloption: PollOptionRecord, index) => {
                      return (
                        <PollOption
                          CanModify={!!polloption.can_modify}
                          Disabled={calculateOptionStatus(
                            !!poll()?.multivote,
                            !!polloption.user_voted,
                            !!poll()?.options?.some((opt) => opt.user_voted)
                          )}
                          ID={polloption?.id || "unknown poll option Id"}
                          MultiVote={poll()?.multivote || false}
                          PollID={poll()?.id || "unknown poll Id"}
                          OptionName={polloption?.option_name}
                          OptionDescription={polloption?.option_desc}
                          UserVoted={polloption?.user_voted}
                          VotePercentage={100 / (index() + 1)}
                        />
                      );
                    }}
                  </For>
                </div>
                <Show
                  when={
                    poll()?.public_can_add || poll()?.user_id === user()?.id
                  }
                >
                  <span style={{ "grid-area": "button" }}>
                    <Button
                      Type="button"
                      OnClick={() => setShowNewOptionModal(true)}
                    >
                      Add Option
                    </Button>
                  </span>
                </Show>
                <div class={styles.results}>
                  <PollResults
                    PollExpired={hasPollExpired() || false}
                    OnClose={() => setShowStats(false)}
                    Results={poll()?.rankings as OptionVotes[]}
                  />
                </div>
              </Match>
            </Switch>

            {/* The Voting Results for mobile view */}
            <Show when={showStats() && !hasPollExpired()}>
              <div class={styles.optionscontainer}>
                <PollResults
                  PollExpired={hasPollExpired() || false}
                  OnClose={() => setShowStats(false)}
                  Results={poll()?.rankings as OptionVotes[]}
                />
              </div>
            </Show>

            {/* Modals */}
            {/* Create new Poll Option */}
            <Show when={showNewOptionModal()}>
              <Modal
                OnClose={() => setShowNewOptionModal(false)}
                Title="New Poll Option"
                OnSubmit={async () => {
                  createPollOption(newPollOption() as PollOptionRecord);
                  setShowNewOptionModal(false);
                }}
                Pending={creatingPollOption.pending}
                SubmitLabel="Create Poll Option"
              >
                <PollOptionForm
                  OnChange={(newPollOption) => {
                    updateNewPollOption({
                      ...newPollOption,
                      poll_id: poll()?.id ?? "",
                    });
                  }}
                />
              </Modal>
            </Show>
            {/* Confirm poll deletion */}
            <Show when={showDeletePoll()}>
              <Modal
                OnClose={() => setShowDeletePoll(false)}
                Title="Delete Poll"
                OnSubmit={async () => {
                  await deletePoll(poll()?.id ?? "", true);
                }}
                Pending={deletingPoll.pending}
                SubmitColor="danger"
                SubmitLabel="Delete Poll"
              >
                Deleting the Poll {poll()?.poll_name} is irreversable. Continue?
              </Modal>
            </Show>
            {/* Edit poll */}
            <Show when={showEditPoll()}>
              <Modal
                OnClose={() => setShowEditPoll(false)}
                Title="Modify Poll"
                OnSubmit={() => {
                  editPoll(modifiedPoll() as PollRecord);
                  setShowEditPoll(false);
                }}
                SubmitLabel="Edit Poll"
                Pending={editingPoll.pending}
                Width="800px"
              >
                <PollForm
                  PollId={poll()?.id ?? ""}
                  OnChange={(editedPoll) => {
                    setModifiedPoll({
                      ...modifiedPoll(),
                      ...editedPoll,
                    });
                  }}
                />
              </Modal>
            </Show>
            {/* <Show when={showQR()}>
              <SharePollModal OnClose={() => setShowQR(false)} />
            </Show> */}
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
