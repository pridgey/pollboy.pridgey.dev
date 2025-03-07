import { useSubmission } from "@solidjs/router";
import { Show } from "solid-js";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { Flex } from "~/components/Flex";
import { Input } from "~/components/Input";
import { Text } from "~/components/Text";
import { resetPassword } from "~/lib/auth";

type ResetPasswordCardProps = {
  token: string;
};

export const ResetPasswordCard = (props: ResetPasswordCardProps) => {
  const resettingPassword = useSubmission(resetPassword);

  return (
    <Card padding="large">
      <form action={resetPassword} method="post">
        <Flex Direction="column" Gap="medium">
          <Text Align="center" As="h1" FontSize="large" FontWeight="semibold">
            Reset Password
          </Text>
          <Text Align="center" As="h2" FontSize="header">
            Please enter a new password
          </Text>
          <Show when={resettingPassword?.error}>
            <Text
              Align="center"
              Color="error"
              FontSize="small"
              FontWeight="semibold"
            >
              {resettingPassword?.error?.message}
            </Text>
          </Show>
          <input type="hidden" name="token" value={props.token} />
          <Input
            Label="Password"
            Name="password"
            Placeholder="Password"
            Type="password"
          />
          <Input
            Label="Confirm Password"
            Name="confirm"
            Placeholder="Confirm Password"
            Type="password"
          />
          <Flex AlignItems="center" Direction="row" JustifyContent="flex-end">
            <Button
              Pending={resettingPassword.pending}
              Type="submit"
              Variant="full"
            >
              Reset
            </Button>
          </Flex>
        </Flex>
      </form>
    </Card>
  );
};
