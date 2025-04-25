import { useSubmission, type RouteSectionProps } from "@solidjs/router";
import { AuthCard } from "~/compositions/AuthCard";
import { login } from "~/lib/auth";
import styles from "~/styles/auth.module.css";

export default function Login(props: RouteSectionProps) {
  const loggingIn = useSubmission(login);

  return (
    <section
      classList={{
        [styles.container]: true,
      }}
      class={styles.container}
    >
      <AuthCard />
    </section>
  );
}
