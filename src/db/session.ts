import { redirect } from "solid-start/server";
import { createCookieSessionStorage } from "solid-start/session";
import { createClient } from "@supabase/supabase-js";

// #region create Supabase client
const url = import.meta.env.VITE_SUPABASE_URL || "no_url_found";
const key = import.meta.env.VITE_SUPABASE_KEY || "no_key_found";
console.log("Keys:", { url, key });
export const client = createClient(url, key);
// #endregion create Supabase client

// #region create storage session
const sessionSecret = import.meta.env.VITE_SESSION_SECRET;

const storage = createCookieSessionStorage({
  cookie: {
    name: "pollboy_session",
    // secure doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
});
// #endregion create storage session

// #region session Types
type LoginForm = {
  email: string;
  username?: string;
  password: string;
};
// #endregion session Types

// Helper function that will create the supabase client with jwt context
export const getClient = async (request: Request) => {
  // Get env variables
  const url = import.meta.env.VITE_SUPABASE_URL || "no_url_found";
  const key = import.meta.env.VITE_SUPABASE_KEY || "no_key_found";

  const userSession = await getUserSession(request);
  const jwt = await userSession.get("token");

  // Return client
  return createClient(url, key, {
    global: {
      headers: { Authorization: `Bearer ${jwt}` },
    },
  });
};

// Register the user with Supabase. Currently only email+pass auth
export async function register({ email, username, password }: LoginForm) {
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  if (error) {
    console.error("Register Error:", error);
    return null;
  }

  return data;
}

// Update user information
export async function updateUser(request: Request, userProfileSettings: any) {
  console.log(" ");
  console.log(" ");
  console.log("=============== UPDATE USER  ===============");
  console.log("New Profile Settings:", { userProfileSettings });

  const client = await getClient(request);

  const { data, error } = await client.auth.updateUser({
    data: userProfileSettings,
  });

  console.log("Update User:", { data });

  if (error) {
    console.error("Update User Error:", { error });
  }

  return data;
}

// Login the user to Supabase and get auth result
export async function login({ email, password }: LoginForm) {
  console.log(" ");
  console.log(" ");
  console.log("=============== LOGIN  ===============");
  // Login to Supabase
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  console.log("Login:", { email, password, data });

  if (error) {
    console.error("Login Error:", error);
    return null;
  }

  return data;
}

// Grabs the current user session
export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

// Gets the user's current ID (might not use this if getUser() exists)
export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

// Looks like this simplifies authorized routes (might refactor this)
export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

// Grabs user data
export async function getUser(request: Request) {
  console.log(" ");
  console.log(" ");
  console.log("=============== GET USER ===============");
  const session = await storage.getSession(request.headers.get("Cookie"));
  const jwt = await session.get("token");

  const { data, error } = await client.auth.getUser(jwt);

  if (error) {
    console.error("GetUser Error:", error);
    return null;
  }

  return data;
}

// Sign user out of Supabase and then destroy the user session
export async function logout(request: Request) {
  console.log(" ");
  console.log(" ");
  console.log("=============== Logout ===============");
  const session = await storage.getSession(request.headers.get("Cookie"));
  const { error } = await client.auth.signOut();

  if (error) {
    console.error("Logout Error:", { error });
  }

  console.log("Post Logout:", { session });

  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

// Creates a user session and then redirects them
export async function createUserSession(
  userId: string,
  jwt: string,
  refreshtoken: string,
  redirectTo: string = "/"
) {
  console.log(" ");
  console.log(" ");
  console.log("=============== CreateUserSession ===============");
  const session = await storage.getSession();
  console.log("Session Keys:", { userId, jwt });
  session.set("userId", userId);
  session.set("token", jwt);

  await client.auth.setSession({
    access_token: jwt,
    refresh_token: refreshtoken,
  });

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}
