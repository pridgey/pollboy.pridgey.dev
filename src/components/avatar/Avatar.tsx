import type { User } from "@supabase/supabase-js";
import { createSignal, Show } from "solid-js";
import { createServerAction$ } from "solid-start/server";
import { logout } from "~/db/session";
import { DropdownOptions } from "../dropdown-options";
import styles from "./Avatar.module.css";
import { useNavigate } from "solid-start";

export type AvatarProps = {
  AvatarUrl?: string;
  User?: User;
};

export const Avatar = (props: AvatarProps) => {
  let avatarRef: HTMLButtonElement | undefined;
  const navigate = useNavigate();

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
        style={{ "background-image": `url('${props.AvatarUrl}')` }}
      >
        <Show when={!props.AvatarUrl?.length}>
          {props.User?.user_metadata?.username?.split("")?.[0] ||
            props.User?.email?.split("")?.[0] ||
            ""}
        </Show>
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
              OnClick: () => {
                setOptionsOpen(false);
                navigate("/settings");
              },
              Icon: "",
            },
            {
              Label: "Buy Me A Pizza Slice?",
              Icon: "🍕",
              OnClick: () => {
                window.open(
                  "https://www.buymeacoffee.com/pridgey",
                  "_blank",
                  "noopener,noreferrer"
                );
              },
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
