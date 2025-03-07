import { Card } from "~/components/Card";
import { Flex } from "~/components/Flex";
import { Text } from "~/components/Text";
import styles from "~/styles/forgot-password.module.css";

export default function ForgotPassword() {
  return (
    <main class={styles.container}>
      <section class={styles.content}>
        <Flex Direction="row" JustifyContent="center">
          <Card padding="large" width="400px">
            <Text Align="center" As="h1" FontSize="large" FontWeight="semibold">
              Forgot Password
            </Text>
            <Text Align="center">
              The Forgot Password email has been sent to the address listed on
              the account.
            </Text>
            <Text Align="center">You may close this tab.</Text>
          </Card>
        </Flex>
      </section>
    </main>
  );
}
