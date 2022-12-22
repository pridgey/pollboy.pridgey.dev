import { Outlet } from "@solidjs/router";
import { A, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { Avatar } from "~/components";
import { getUser } from "~/db/session";
import { getUserSettings } from "~/db/settings";

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const user = await getUser(request);
    const userSettings = await getUserSettings(request);

    console.log("User Settings?:", { userSettings });

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
        <Avatar
          User={data()?.user?.user}
          AvatarUrl={data()?.userSettings?.[0]?.avatar_url}
        />
      </nav>
      <main class="maincontent">
        <Outlet />
      </main>
    </div>
  );
}
