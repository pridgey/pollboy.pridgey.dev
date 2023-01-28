import styles from "./PollOption.module.css";
import { createSignal, Show } from "solid-js";
import { optionVote, deletePollOption } from "~/db/poll";
import { createServerAction$ } from "solid-start/server";
import {
  ConfirmDeleteModal,
  DropdownOptions,
  MenuDots,
  PollOptionsModal,
} from "~/components";

export type PollOptionProps = {
  CanModify: boolean;
  Disabled: boolean;
  ID: number;
  MultiVote: boolean;
  OptionName: string;
  OptionDescription: string;
  PollID: number;
  UserVoted?: boolean;
  Votes?: number;
  VotePercentage?: number;
};

type VoteActionArgs = {
  PollID: number;
  ID: number;
};

type DeleteOptionActionArgs = {
  ID: number;
};

export const PollOption = (props: PollOptionProps) => {
  // Ref for the menu button to show the context menu
  let menuRef: HTMLButtonElement | undefined;

  // Server action to handle voting for an option
  const [voting, handleVote] = createServerAction$(
    async (args: VoteActionArgs, { request }) => {
      await optionVote(request, args.PollID, args.ID);
    }
  );

  // Server action to handle deleting an option
  const [deleting, deleteOption] = createServerAction$(
    async (args: DeleteOptionActionArgs, { request }) => {
      await deletePollOption(request, args.ID);
    }
  );

  // Signals for option state
  const [selected, setSelected] = createSignal(props.UserVoted);
  const [showMenu, setShowMenu] = createSignal(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] =
    createSignal(false);
  const [showModifyOptionModal, setShowModifyOptionModal] = createSignal(false);

  return (
    <div
      classList={{
        [styles.containerdisabled]: props.Disabled,
        [styles.container]: true,
      }}
    >
      <button
        disabled={props.Disabled}
        class={styles.optioncontents}
        onClick={async () => {
          if (!voting.pending) {
            handleVote({ PollID: props.PollID, ID: props.ID });
            setSelected(!selected());
          }
        }}
      >
        <div
          classList={{
            [styles.optioncheck]: true,
            [styles.radio]: !props.MultiVote,
          }}
        >
          <Show when={selected()}>✓</Show>
        </div>
        <h3 class={styles.optiontitle}>{props.OptionName}</h3>
        <h4 class={styles.optionsubtitle}>{props.OptionDescription}</h4>
      </button>
      <Show when={props.CanModify}>
        <div class={styles.menucontainer}>
          <button
            ref={menuRef}
            class={styles.menu}
            onClick={() => setShowMenu(!showMenu())}
          >
            <MenuDots />
          </button>
          <Show when={showMenu()}>
            <DropdownOptions
              HorizontalAlign="right"
              VerticalGap={10}
              PositionRef={menuRef}
              OnOutsideClick={() => setShowMenu(false)}
              Options={[
                {
                  Label: "Edit Option",
                  OnClick: () => {
                    setShowModifyOptionModal(true);
                    setShowMenu(false);
                  },
                  Icon: "",
                },
                {
                  Label: "Delete Option",
                  OnClick: () => {
                    setShowConfirmDeleteModal(true);
                    setShowMenu(false);
                  },
                  Icon: "",
                },
              ]}
            />
          </Show>
          <Show when={showConfirmDeleteModal()}>
            <ConfirmDeleteModal
              Name={`Poll Option: ${props.OptionName}`}
              OnClose={(confirm) => {
                if (confirm) {
                  deleteOption({ ID: props.ID });
                }
                setShowConfirmDeleteModal(false);
              }}
            />
          </Show>
          <Show when={showModifyOptionModal()}>
            <PollOptionsModal
              OnClose={() => setShowModifyOptionModal(false)}
              ID={props.ID}
              OptionDescription={props.OptionDescription}
              OptionName={props.OptionName}
              PollID={props.PollID}
            />
          </Show>
        </div>
      </Show>
    </div>
  );
};
