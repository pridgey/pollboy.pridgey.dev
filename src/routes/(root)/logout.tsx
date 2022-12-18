import { useRouteData } from "solid-start";
import { createServerData$, redirect } from "solid-start/server";
import { logout } from "~/db/session";

export function routeData() {
  return createServerData$(async (_, { request }) => {
    try {
      await logout(request);
    } catch (err) {
      console.error("Error:", { err });
    }

    return;
  });
}

export default function Logout() {
  useRouteData<typeof routeData>();
  return <div>Logging out</div>;
}
