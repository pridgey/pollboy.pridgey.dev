import type { User } from "@supabase/supabase-js";
import styles from "./Avatar.module.css";

export type AvatarProps = {
  User?: User;
};

export const Avatar = (props: AvatarProps) => {
  return (
    <button type="button" class={styles.avatarbubble}>
      {props.User?.user_metadata?.username?.split("")?.[0] ||
        props.User?.email?.split("")?.[0] ||
        ""}
    </button>
  );
};
