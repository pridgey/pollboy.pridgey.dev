import { createAsync } from "@solidjs/router";
import { Match, Switch } from "solid-js";
import { Card } from "~/components/Card";
import { getUser } from "~/lib/auth";
import { LoginCard } from "./LoginCard";
import { RegisterCard } from "./RegisterCard";
import { TabSwitch } from "~/components/TabSwitch/TabSwitch";

/**
 * Composition to display a tab switch that will show either the login or register card.
 */
export const AuthCard = () => {
  const user = createAsync(() => getUser());

  return (
    <Switch>
      <Match when={!user()?.email}>
        {/* Only display AuthCard when the user is not logged in */}
        <Card padding="large">
          <TabSwitch
            Tabs={[
              {
                Content: LoginCard,
                Display: "Login",
                Value: "login",
              },
              {
                Content: RegisterCard,
                Display: "Register",
                Value: "Register",
              },
            ]}
          />
        </Card>
      </Match>
    </Switch>
  );
};
