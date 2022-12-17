import { Outlet } from "@solidjs/router";
import { A, useRouteData } from "solid-start";
import { createServerData$, redirect } from "solid-start/server";
import { Avatar } from "~/components";
import { getUser } from "~/db/session";

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const user = await getUser(request);

    console.log("Avatar", { user });

    return user;
  });
}

export default function GlobalLayout() {
  const user = useRouteData<typeof routeData>();

  return (
    <div id="layout">
      <nav class="navbar">
        <A href="/" class="sitetitle">
          Pollboy
        </A>
        <Avatar User={user()?.user} />
      </nav>
      <main class="maincontent">
        <Outlet />
      </main>
    </div>
  );
}
