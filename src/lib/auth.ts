import { useSession } from "vinxi/http";
import { action, query, redirect, revalidate } from "@solidjs/router";
import PocketBase from "pocketbase";
import { UserRecord } from "~/types/pocketbase";

/**
 * Gets the current session data
 */
export const getSession = () => {
  "use server";
  return useSession({
    password: process.env.SESSION_SECRET ?? "unknown session secret",
  });
};

/**
 * Clears the session data as a user logs out
 */
export const logoutSession = async () => {
  "use server";
  const session = await getSession();
  await session.clear();
};

/**
 * Grabs the cookie out of the session and uses it to create a PocketBase client
 * @returns pocketbase client
 */
export const getPocketBase = async () => {
  "use server";
  const client = new PocketBase(process.env.VITE_POCKETBASE_URL ?? "");

  try {
    const session = await getSession();
    const cookie = session.data.cookie;
    client.authStore.loadFromCookie(cookie);
  } catch (err) {
    console.error("Error getting PocketBase client:", err);
  } finally {
    return client;
  }
};

/**
 * Grabs the user from the session and returns the user model
 * @returns user object
 */
export const getUser = query(async (restrict?: boolean) => {
  "use server";
  try {
    const client = await getPocketBase();
    const user = client.authStore.record;

    console.log("Get User", { user });

    if (!user) throw new Error("User not found");

    let avatarUrl = "";
    if (user.avatar) {
      avatarUrl = await client.files.getURL(user, user.avatar);
    }

    return {
      ...(user as Partial<UserRecord>),
      avatarUrl,
    } as UserRecord;
  } catch {
    if (restrict) {
      await logoutSession();
      throw redirect("/login");
    }
  }
}, "user");

/**
 * Takes user data and updates session with it
 */
export const setUserInSession = async (data: {
  userId: string;
  email: string;
  cookie: string;
}) => {
  "use server";

  try {
    const session = await getSession();
    await session.update((theSession) => {
      theSession.userId = data.userId;
      theSession.email = data.email;
      theSession.cookie = data.cookie;
    });

    // Redirect to home
    return redirect("/");
  } catch (err) {
    return err as Error;
  }
};

/**
 * Action to log the user in
 */
export const login = action(async (formData: FormData) => {
  "use server";
  const client = await getPocketBase();
  const username = String(formData.get("username"));
  const password = String(formData.get("password"));

  try {
    const user = await client
      .collection("users")
      .authWithPassword(username, password);

    return setUserInSession({
      userId: user.record.id,
      email: user.record.email,
      cookie: client.authStore.exportToCookie(),
    });
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error(`Error during login: ${err}`);
    }
  }
}, "login");

/**
 * Action to register a new user
 */
export const register = action(async (formData: FormData) => {
  "use server";
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const confirm = String(formData.get("confirm"));
  const username = String(formData.get("username"));

  if (!email) {
    throw new Error("email is required");
  }
  if (!password) {
    throw new Error("Password is required");
  }
  if (!confirm) {
    throw new Error("Password Confirmation is required");
  }
  if (password !== confirm) {
    throw new Error("Passwords do not match");
  }

  const client = await getPocketBase();

  try {
    const newUser = await client.collection("users").create({
      email: email,
      password,
      passwordConfirm: confirm,
      name: username,
    });

    await setUserInSession({
      userId: newUser?.record?.id,
      email: newUser?.record?.email,
      cookie: client.authStore.exportToCookie(),
    });

    // await client.collection("users").requestVerification(email);

    //return redirect("/?verify=true");
    return redirect("/?registered=true");
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error(`Error during registration: ${err}`);
    }
  }
}, "register");

/**
 * Action to log the user out and redirect to login page
 */
export const logout = action(async () => {
  "use server";
  await logoutSession();

  const client = await getPocketBase();
  client.authStore.clear();

  await revalidate(undefined, true);
  throw redirect("/", { revalidate: getUser.key });
});

/**
 * Action to begin the password reset process
 */
export const forgotPassword = action(async (username: string) => {
  "use server";
  console.log("Debug forgot password", { username });
  if (!username) {
    throw new Error("Email is required");
  }

  const client = await getPocketBase();
  await client.collection("users").requestPasswordReset(username);

  throw redirect("/forgot-password");
});

/**
 * Action to reset the user's password
 */
export const resetPassword = action(async (formData: FormData) => {
  "use server";
  const password = String(formData.get("password"));
  const confirm = String(formData.get("confirm"));
  const token = String(formData.get("token"));

  if (!token) {
    throw new Error("Token was not supplied, please try again.");
  }
  if (!password) {
    throw new Error("New Password is required.");
  }
  if (!confirm) {
    throw new Error("New Password Confirmation is required.");
  }
  if (password !== confirm) {
    throw new Error("Passwords do not match.");
  }

  try {
    const client = await getPocketBase();
    const result = await client
      .collection("users")
      .confirmPasswordReset(token, password, confirm);

    if (!result) {
      throw new Error("Error resetting password, please try again.");
    }

    return redirect("/?reset=true");
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error(`Error during password reset: ${err}`);
    }
  }
});

/**
 * Action to verify the user's email address
 */
export const verifyEmail = async (token: string) => {
  "use server";
  if (!token) {
    throw new Error("Token was not supplied, please try again.");
  }

  try {
    const client = await getPocketBase();
    const result = await client.collection("users").confirmVerification(token);

    if (!result) {
      throw new Error("Error verifying email, please try again.");
    }

    return;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error(`Error during email verification: ${err}`);
    }
  }
};

/**
 * Action to resend the verification email
 */
export const resendVerification = action(async (email: string) => {
  "use server";
  if (!email) {
    throw new Error("Email is required");
  }

  const client = await getPocketBase();
  await client.collection("users").requestVerification(email);

  throw redirect("/?verify=true");
}, "resend-verification");
