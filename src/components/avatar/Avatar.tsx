import type { User } from "@supabase/supabase-js";
import { createSignal, Show } from "solid-js";
import { DropdownOptions } from "../dropdown-options";
import styles from "./Avatar.module.css";

export type AvatarProps = {
  User?: User;
};

export const Avatar = (props: AvatarProps) => {
  let avatarRef: HTMLButtonElement;

  const [optionsOpen, setOptionsOpen] = createSignal<boolean>(false);

  return (
    <>
      <button
        ref={avatarRef}
        onClick={() => {
          if (props.User) {
            setOptionsOpen(!optionsOpen());
          }
        }}
        type="button"
        class={styles.avatarbubble}
      >
        {props.User?.user_metadata?.username?.split("")?.[0] ||
          props.User?.email?.split("")?.[0] ||
          ""}
      </button>
      <Show when={optionsOpen()}>
        <DropdownOptions
          HorizontalAlign="right"
          VerticalGap={15}
          PositionRef={avatarRef}
          OnOutsideClick={() => setOptionsOpen(false)}
          Options={[
            {
              Label: "Hello",
              OnClick: () => undefined,
              Icon: "",
            },
            {
              Label: "Logout",
              OnClick: () => {
                console.log("Click!");
                fetch("/api/logout");
              },
              Icon: "",
            },
            {
              Label: "Delete",
              OnClick: () => undefined,
              Icon: "",
            },
          ]}
        />
      </Show>
    </>
  );
};
