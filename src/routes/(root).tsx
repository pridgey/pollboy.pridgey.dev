import { Outlet } from "@solidjs/router";
import { A, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { Avatar } from "~/components";
import { getUser } from "~/db/session";
import { getUserSettings } from "~/db/settings";
import { Switch, Match } from "solid-js";

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const user = await getUser(request);
    const userSettings = await getUserSettings(request);

    return { user, userSettings };
  });
}

export default function GlobalLayout() {
  const data = useRouteData<typeof routeData>();

  return (
    <div id="layout">
      <nav class="navbar">
        <A href="/" class="sitetitle">
          Pollboy
        </A>
        <Switch>
          <Match when={data()?.user?.user}>
            <Avatar
              User={data()?.user?.user}
              AvatarUrl={data()?.userSettings?.[0]?.avatar_url}
            />
          </Match>
          <Match when={!data()?.user?.user}>
            <div class="linkgroup">
              <A href="login" class="link">
                Login
              </A>
              <A href="register" class="link">
                Register
              </A>
            </div>
          </Match>
        </Switch>
      </nav>
      <main class="maincontent">
        <Outlet />
      </main>
    </div>
  );
}
