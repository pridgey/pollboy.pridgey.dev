import { getClient, getUserId } from "./session";

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
    .upsert({ ...newData, user_id: userID }, { onConflict: "user_id" })
    .eq("user_id", userID)
    .select();

  console.log("Post Update:", { data, error });

  if (error) {
    console.error("Update User Settings Error:", { error });
  }

  return data;
};
