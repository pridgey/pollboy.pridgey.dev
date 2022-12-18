import { APIEvent, redirect } from "solid-start/api";
import { logout } from "~/db/session";

export const GET = async ({ request }: APIEvent) => {
  await logout(request);
  redirect("/login");
};
