import { client, getUserId } from "./session";

export const getUserSettings = async (request: Request) => {
  const userID = await getUserId(request);
  console.log("Get UserID:", { userID });
  const { data, error } = await client
    .from("settings")
    .select()
    .eq("user_id", userID);

  if (error) {
    console.error("Get User Settings Error:", { error });
  }

  return data;
};

type UserSettings = {
  avatar_url?: string;
  display_name?: string;
};

export const updateUserSettings = async (
  request: Request,
  newData: UserSettings
) => {
  const userID = await getUserId(request);
  const { data, error } = await client
    .from("settings")
    .update(newData)
    .eq("user_id", userID);

  if (error) {
    console.error("Update User Settings Error:", { error });
  }

  return data;
};
