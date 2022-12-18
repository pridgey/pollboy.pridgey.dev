import type { User } from "@supabase/supabase-js";
import { createSignal, Show } from "solid-js";
import { createServerAction$ } from "solid-start/server";
import { logout } from "~/db/session";
import { DropdownOptions } from "../dropdown-options";
import styles from "./Avatar.module.css";

export type AvatarProps = {
  User?: User;
};

export const Avatar = (props: AvatarProps) => {
  let avatarRef: HTMLButtonElement | undefined;

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
              Label: "User Profile",
              OnClick: () => undefined,
              Icon: "",
            },
            {
              Label: "Logout",
              OnClick: () => {
                setOptionsOpen(false);
                handleLogout();
              },
              Icon: "",
            },
          ]}
        />
      </Show>
    </>
  );
};
