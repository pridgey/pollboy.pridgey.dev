import styles from "./PollOption.module.css";
import { createSignal, Show } from "solid-js";
import { optionVote } from "~/db/poll";
import { createServerAction$ } from "solid-start/server";
import { DropdownOptions, MenuDots } from "~/components";

export type PollOptionProps = {
  ID: number;
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

export const PollOption = (props: PollOptionProps) => {
  let menuRef: HTMLButtonElement | undefined;

  const [voting, handleVote] = createServerAction$(
    async (args: VoteActionArgs, { request }) => {
      await optionVote(request, args.PollID, args.ID);
    }
  );

  const [selected, setSelected] = createSignal(props.UserVoted);
  const [showMenu, setShowMenu] = createSignal(false);

  return (
    <div class={styles.container}>
      <button
        class={styles.optioncontents}
        onClick={async () => {
          if (!voting.pending) {
            handleVote({ PollID: props.PollID, ID: props.ID });
            setSelected(!selected());
          }
        }}
      >
        <div class={styles.optioncheck}>
          <Show when={selected()}>✓</Show>
        </div>
        <h1 class={styles.optiontitle}>{props.OptionName}</h1>
        <h2 class={styles.optionsubtitle}>{props.OptionDescription}</h2>
      </button>
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
            VerticalGap={15}
            PositionRef={menuRef}
            OnOutsideClick={() => setShowMenu(false)}
            Options={[
              {
                Label: "Edit Option",
                OnClick: () => {
                  console.log("Edit");
                },
                Icon: "",
              },
              {
                Label: "Delete Option",
                OnClick: () => {
                  console.log("Delete");
                },
                Icon: "",
              },
            ]}
          />
        </Show>
      </div>
    </div>
  );
};
