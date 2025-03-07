import { useSearchParams, useSubmission } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { Button } from "~/components/Button";
import { Divider } from "~/components/Divider";
import { Flex } from "~/components/Flex";
import { Input } from "~/components/Input";
import { Text } from "~/components/Text";
import { register } from "~/lib/auth";
import { AccountInfoModal } from "../AccountInfoModal";

/**
 * Composition to display a register card
 */
export const RegisterCard = () => {
  // Resource that holds the register submission state
  const registering = useSubmission(register);
  // State to show the info modal
  const [showInfoModel, setShowInfoModel] = createSignal(false);
  // Check search params for reset flag informing user their registration is set and needs to verify
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
      <form action={register} method="post">
        <Flex Direction="column" Gap="medium" PaddingY="medium">
          <Text Align="center" As="h2" FontSize="large" FontWeight="semibold">
            Let's Get Started
          </Text>
          <Show when={!!searchParams.registered}>
            <Text
              Align="center"
              Color="success"
              FontSize="small"
              FontWeight="semibold"
            >
              Account successfully created. <br />
              You may now login.
            </Text>
          </Show>
          <Show when={!!searchParams.verify}>
            <Text
              Align="center"
              Color="success"
              FontSize="small"
              FontWeight="semibold"
            >
              Account created. Please check for a verification email to
              continue.
            </Text>
          </Show>
          <Show when={registering?.error}>
            <Text
              Align="center"
              Color="error"
              FontSize="small"
              FontWeight="semibold"
            >
              {registering?.error?.message}
            </Text>
          </Show>
          <Input Label="Email" Name="email" Placeholder="Email" />
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
              OnClick={() => setSearchParams({ reset: undefined })}
              Pending={registering.pending}
              Type="submit"
              Variant="full"
            >
              Register
            </Button>
          </Flex>
          <Divider />
          <Button
            FontSize="small"
            OnClick={() => setShowInfoModel(true)}
            Padding="small"
            Variant="text"
          >
            Why do I need an account?
          </Button>
        </Flex>
      </form>
      <Show when={showInfoModel()}>
        <AccountInfoModal OnClose={() => setShowInfoModel(false)} />
      </Show>
    </>
  );
};
