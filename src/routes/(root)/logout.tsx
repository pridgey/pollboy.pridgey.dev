import { useRouteData } from "solid-start";
import { createServerData$, redirect } from "solid-start/server";
import { logout } from "~/db/session";

export function routeData() {
  return createServerData$(async (_, { request }) => {
    await logout(request);

    return;
  });
}

export default function Logout() {
  useRouteData<typeof routeData>();
  return <div>Logging out</div>;
}
