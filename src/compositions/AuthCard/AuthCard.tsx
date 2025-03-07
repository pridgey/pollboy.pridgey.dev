import { createAsync } from "@solidjs/router";
import { createSignal, Match, Switch } from "solid-js";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { getUser } from "~/lib/auth";
import { LoginCard } from "./LoginCard";
import { RegisterCard } from "./RegisterCard";

/**
 * Composition to display a tab switch that will show either the login or register card.
 */
export const AuthCard = () => {
  const user = createAsync(() => getUser());
  const [authState, setAuthState] = createSignal<"login" | "register">("login");

  return (
    <Switch>
      <Match when={!user()?.email}>
        {/* Only display AuthCard when the user is not logged in */}
        <Card padding="large">
          <Switch>
            <Match when={authState() === "login"}>
              <LoginCard />
              <span style={{ "align-self": "flex-start" }}>
                <Button OnClick={() => setAuthState("register")} Variant="text">
                  Register
                </Button>
              </span>
            </Match>
            <Match when={authState() === "register"}>
              <RegisterCard />
              <span style={{ "align-self": "flex-start" }}>
                <Button OnClick={() => setAuthState("login")} Variant="text">
                  Login
                </Button>
              </span>
            </Match>
          </Switch>
        </Card>
      </Match>
    </Switch>
  );
};
