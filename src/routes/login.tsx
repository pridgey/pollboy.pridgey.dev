import { useSubmission, type RouteSectionProps } from "@solidjs/router";
import { Show } from "solid-js";
import { AuthCard } from "~/compositions/AuthCard";
import { login } from "~/lib/auth";
import styles from "~/styles/auth.module.css";

export default function Login(props: RouteSectionProps) {
  const loggingIn = useSubmission(login);

  return (
    <main
      classList={{
        [styles.container]: true,
        "dark-override": true,
      }}
      class={styles.container}
    >
      <div class={styles.card_side}>
        <AuthCard />
      </div>
      <div class={styles.auth_side_image} />
    </main>
  );
}
