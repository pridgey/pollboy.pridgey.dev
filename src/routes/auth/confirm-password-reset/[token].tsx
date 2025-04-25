import { useParams } from "@solidjs/router";
import { Flex } from "~/components/Flex";
import { ResetPasswordCard } from "~/compositions/ResetPasswordCard";
import styles from "~/styles/reset-password.module.css";

export default function ConfirmPasswordReset() {
  const params = useParams();

  return (
    <main class={styles.container}>
      <section class={styles.content}>
        <Flex Direction="row" JustifyContent="center">
          <ResetPasswordCard token={params.token} />
        </Flex>
      </section>
    </main>
  );
}
