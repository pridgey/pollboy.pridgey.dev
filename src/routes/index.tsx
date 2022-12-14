import { useRouteData } from "solid-start";
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server";
import { getUser, logout } from "~/db/session";

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const user = await getUser(request);

    if (!user) {
      throw redirect("/login");
    }

    return user;
  });
}

export default function Home() {
  // Grab user info from route data above
  const user = useRouteData<typeof routeData>();
  // Create a server action for the logout action
  const [, { Form }] = createServerAction$((f: FormData, { request }) =>
    logout(request)
  );

  return (
    <main class="w-full p-4 space-y-2">
      <h1 class="font-bold text-3xl">Hello {user()?.user?.email || "World"}</h1>
      <Form>
        <button name="logout" type="submit">
          Logout
        </button>
      </Form>
      <pre>{JSON.stringify(user() ?? {}, null, 4)}</pre>
    </main>
  );
}
