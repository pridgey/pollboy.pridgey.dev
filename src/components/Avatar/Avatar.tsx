import { useAction, useNavigate } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { logout } from "~/lib/auth";
import { UserRecord } from "~/types/pocketbase";
import { DropdownOptions } from "../DropdownOptions";
import styles from "./Avatar.module.css";

export type AvatarProps = {
  User?: Partial<UserRecord>;
};

/**
 * Avatar component used to display user information and allow access to settings and such
 */
export const Avatar = (props: AvatarProps) => {
  let avatarRef: HTMLButtonElement | undefined;
  const navigate = useNavigate();
  const logoutAction = useAction(logout);

  const [optionsOpen, setOptionsOpen] = createSignal<boolean>(false);

  return (
    <>
      <button
        ref={avatarRef}
        onClick={() => {
          console.log("Click avatar", props.User);
          if (props.User) {
            setOptionsOpen(!optionsOpen());
          }
        }}
        type="button"
        class={styles.avatarbubble}
        style={{ "background-image": `url('')` }} // TO-DO: implement avatars, ensure Show boolean below only shows if no avatar
      >
        {/* If no avatar image, show the first letter of their username or email */}
        <Show when={true}>
          {props.User?.name?.at(0) || props.User?.email?.at(0) || ""}
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
              OnClick: async () => {
                setOptionsOpen(false);
                await logoutAction();
              },
              Icon: "",
            },
          ]}
        />
      </Show>
    </>
  );
};
