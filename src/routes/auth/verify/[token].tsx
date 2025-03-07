import { createAsync, query, redirect, useParams } from "@solidjs/router";
import { verifyEmail } from "~/lib/auth";

const verifyUser = query(async (token: string) => {
  "use server";
  if (!token) {
    throw redirect("/");
  }

  console.log("Debug verify?", { token });

  await verifyEmail(token);

  return redirect("/?verified=true");
}, "verify");

export default function VerifyEmail() {
  const { token } = useParams();
  createAsync(() => verifyUser(token));

  return null;
}
