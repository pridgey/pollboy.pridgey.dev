import { getClient, getUserId } from "./session";

// Shape of Poll
type PollRecord = {
  id?: number;
  poll_name: string;
  poll_desc: string;
  expire_at?: string;
  created_at?: string;
  public_can_add?: boolean;
  multivote?: boolean;
  user_id?: string;
  slug?: string;
};

export const createPoll = async (request: Request, newData: PollRecord) => {
  const client = await getClient(request);

  const userID = await getUserId(request);

  const newPollData = {
    ...newData,
    user_id: userID,
  };

  const { error } = await client.from("poll").insert({ ...newPollData });

  if (error) {
    console.error("Create Poll Error:", { error });
    return false;
  }

  return true;
};

export const getUserPolls = async (request: Request) => {
  const client = await getClient(request);

  const userID = await getUserId(request);

  const { data, error } = await client
    .from("poll")
    .select()
    .eq("user_id", userID);

  if (error) {
    console.error("Error retrieving User's Polls:", { error });
  }

  return data;
};
