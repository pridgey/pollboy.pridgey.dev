import { A, createAsync, useAction } from "@solidjs/router";
import { Show } from "solid-js";
import { Button } from "~/components/Button";
import { Flex } from "~/components/Flex";
import { Text } from "~/components/Text";
import { getUser, logout } from "~/lib/auth";

export const Navbar = () => {
  const user = createAsync(() => getUser());
  const logoutAction = useAction(logout);

  return (
    <Flex
      AlignItems="center"
      Direction="row"
      Gap="medium"
      JustifyContent="space-between"
      PaddingX="large"
      PaddingY="medium"
      Style={{
        "background-color": "var(--color-foreground)",
        position: "sticky",
        top: "0px",
        "z-index": 1,
      }}
      Width="100%"
    >
      <A href="/" style={{ "text-decoration": "none" }}>
        <Text
          As="h1"
          Color="white"
          FontSize="extra-large"
          FontWeight="semibold"
        >
          Chatplats
        </Text>
      </A>
      <Show when={user()?.email}>
        <Button
          OnClick={async () => {
            await logoutAction();
            // Force reload to ensure the user is logged out
            window.location.reload();
          }}
          Type="submit"
        >
          Logout
        </Button>
        <Text Color="white" FontSize="small">
          Welcome, {user()?.email}
        </Text>
      </Show>
    </Flex>
  );
};
