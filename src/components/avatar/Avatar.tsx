import type { User } from "@supabase/supabase-js";
import { createSignal, Show } from "solid-js";
import { DropdownOptions } from "../dropdown-options";
import styles from "./Avatar.module.css";
import { createServerAction$ } from "solid-start/server";
import { logout } from "~/db/session";

export type AvatarProps = {
  User?: User;
};

export const Avatar = (props: AvatarProps) => {
  let avatarRef: HTMLButtonElement;

  const [_, handleLogout] = createServerAction$((_, { request }) =>
    logout(request)
  );

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
              Label: "Use",
              OnClick: () => undefined,
              Icon: "",
            },
            {
              Label: "Logout",
              OnClick: handleLogout,
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
