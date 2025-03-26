import { useAction, useSubmission } from "@solidjs/router";
import { createSignal, Match, Show, Switch } from "solid-js";
import {
  deletePollOptionAction,
  updatePollOptionAction,
  voteForOptionAction,
} from "~/lib/api";
import styles from "./PollOption.module.css";
import { BsThreeDotsVertical } from "solid-icons/bs";
import { DropdownOptions } from "~/components/DropdownOptions";
import { Modal } from "~/components/Modal";
import { Text } from "~/components/Text";
import { PollOptionForm } from "../PollOptionForm";
import { PollOptionRecord } from "~/types/pocketbase";
import { RiSystemCheckboxBlankLine } from "solid-icons/ri";
import { RiSystemCheckboxLine } from "solid-icons/ri";

export type PollOptionProps = {
  CanModify: boolean;
  Disabled: boolean;
  ID: string;
  MultiVote: boolean;
  OptionName: string;
  OptionDescription: string;
  PollID: string;
  UserVoted?: boolean;
  Votes?: number;
  VotePercentage?: number;
};

/**
 * Composition to display an individual poll option record on a poll
 */
export const PollOption = (props: PollOptionProps) => {
  // Ref for the menu button to show the context menu
  let menuRef: HTMLButtonElement | undefined;

  // Server action to handle voting for an option
  const voteForPollOption = useAction(voteForOptionAction);
  const votingForPollOption = useSubmission(voteForOptionAction);

  // Server action to handle deleting an option
  const deleteOption = useAction(deletePollOptionAction);
  const deletingOption = useSubmission(deletePollOptionAction);

  // Server action to handle updating an option
  const updateOption = useAction(updatePollOptionAction);
  const updatingOption = useSubmission(updatePollOptionAction);

  // Signals for option state
  const [selected, setSelected] = createSignal(props.UserVoted);
  const [showMenu, setShowMenu] = createSignal(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] =
    createSignal(false);
  const [showModifyOptionModal, setShowModifyOptionModal] = createSignal(false);
  // State of modified poll option, for updates
  const [modifiedPollOption, updateModifiedPollOption] =
    createSignal<PollOptionRecord | null>();

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
          if (!votingForPollOption.pending) {
            await voteForPollOption(props.ID, props.PollID);
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
          <Switch>
            <Match when={selected()}>
              <RiSystemCheckboxLine />
            </Match>
            <Match when={!selected()}>
              <RiSystemCheckboxBlankLine />
            </Match>
          </Switch>
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
            <BsThreeDotsVertical style={{ height: "26px" }} />
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
            <Modal
              OnClose={() => setShowConfirmDeleteModal(false)}
              Title="Delete Poll Option"
              OnSubmit={async () => {
                await deleteOption(props.ID);
                setShowConfirmDeleteModal(false);
              }}
              Pending={deletingOption.pending}
              SubmitColor="danger"
              SubmitLabel="Delete Poll Option"
            >
              <Text>
                Deleting the Poll Option: "{props.OptionName}" is an
                irreversable action. Do you want to proceed?
              </Text>
            </Modal>
          </Show>
          <Show when={showModifyOptionModal()}>
            <Modal
              OnClose={() => {
                setShowModifyOptionModal(false);
                updateModifiedPollOption(null);
              }}
              Title="Modify Poll Option"
              OnSubmit={async () => {
                await updateOption(
                  props.ID,
                  modifiedPollOption()?.option_name ?? "",
                  modifiedPollOption()?.option_desc ?? ""
                );
                setShowModifyOptionModal(false);
              }}
              Pending={updatingOption.pending}
            >
              <PollOptionForm
                PollOptionId={props.ID}
                OnChange={updateModifiedPollOption}
              />
            </Modal>
          </Show>
        </div>
      </Show>
    </div>
  );
};
