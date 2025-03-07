import { useAction, useSearchParams, useSubmission } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { Button } from "~/components/Button";
import { Flex } from "~/components/Flex";
import { Input } from "~/components/Input";
import { Text } from "~/components/Text";
import { forgotPassword, login } from "~/lib/auth";

/**
 * Composition to display a login card.
 */
export const LoginCard = () => {
  // Resource that holds the login submission state
  const loggingIn = useSubmission(login);
  // Resource that holds the forgot password submission state
  const forgotPasswordFlow = useSubmission(forgotPassword);
  // Callable Action to request a password reset
  const requestForgotPassword = useAction(forgotPassword);
  // State to hold the username input (used for forgot password action)
  const [username, setUsername] = createSignal("");
  // Check search params for reset flag informing user their password was reset
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
      <form action={login} method="post">
        <Flex Direction="column" Gap="medium" PaddingY="medium">
          <Text Align="center" As="h2" FontSize="large" FontWeight="semibold">
            Welcome Back
          </Text>
          <Show when={!!searchParams.verified}>
            <Text
              Align="center"
              Color="success"
              FontSize="small"
              FontWeight="semibold"
            >
              Your account has been verified. Please login.
            </Text>
          </Show>
          <Show when={!!searchParams.reset}>
            <Text
              Align="center"
              Color="success"
              FontSize="small"
              FontWeight="semibold"
            >
              Password reset successful. Please login.
            </Text>
          </Show>
          <Show when={loggingIn?.error || forgotPasswordFlow?.error}>
            <Text
              Align="center"
              Color="error"
              FontSize="small"
              FontWeight="semibold"
            >
              {loggingIn?.error?.message || forgotPasswordFlow?.error?.message}
            </Text>
          </Show>
          <Input
            Label="Email"
            Name="username"
            OnChange={setUsername}
            Placeholder="Email"
          />
          <Input
            Label="Password"
            Name="password"
            Placeholder="Password"
            Type="password"
          />
          <input type="hidden" name="loginType" value="login" />
          <Flex
            AlignItems="center"
            Direction="row"
            JustifyContent="space-between"
          >
            <Button
              OnClick={async () => {
                await requestForgotPassword(username());
                setUsername("");
              }}
              Pending={forgotPasswordFlow.pending}
              Variant="text"
            >
              Forgot Password?
            </Button>
            <Button
              OnClick={() => setSearchParams({ reset: undefined })}
              Pending={loggingIn.pending}
              Type="submit"
              Variant="full"
            >
              Login
            </Button>
          </Flex>
        </Flex>
      </form>
    </>
  );
};
