import { getUserId, getUserSession } from "./session";
import { createClient } from "@supabase/supabase-js";

const getClient = async (request: Request) => {
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

// Shape of User Settings
type UserSettings = {
  avatar_url?: string;
  display_name?: string;
};

export const getUserSettings = async (
  request: Request
): Promise<UserSettings[] | null> => {
  // Grab userID and Supabase client instance
  const userID = await getUserId(request);
  const client = await getClient(request);

  // Selecting user settings based on userID
  const { data, error } = await client
    .from("settings")
    .select()
    .eq("user_id", userID);

  if (error) {
    console.error("Get User Settings Error:", { error });
  }

  return data;
};

export const updateUserSettings = async (
  request: Request,
  newData: UserSettings
) => {
  // Grab userID and Supabase client instance
  const userID = await getUserId(request);
  const client = await getClient(request);

  // Update passed in settings for user
  const { data, error } = await client
    .from("settings")
    .update({ ...newData })
    .eq("user_id", userID)
    .select();

  console.log("Post Update:", { data, error });

  if (error) {
    console.error("Update User Settings Error:", { error });
  }

  return data;
};
