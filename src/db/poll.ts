import { getClient, getUserId } from "./session";
import { generateSlug } from "~/lib/Slug";

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
  // Gets the client, and userID
  const client = await getClient(request);
  const userID = await getUserId(request);

  // The data for the new poll
  const newPollData = {
    ...newData,
    user_id: userID,
  };

  // Create the new poll, and grab the new ID
  const { data, error } = await client
    .from("poll")
    .insert({ ...newPollData })
    .select("id");

  // Error creating the poll
  if (error) {
    console.error("Create Poll Error:", { error });
    return null;
  }

  // Grabs the new poll id
  const newPollId = data?.[0]?.id;
  // Generates a fun slug to identify the poll (more fun than just an id)
  const poll_slug = generateSlug();
  // Combines the two info a string
  const combined_slug = `${newPollId}-${poll_slug}`;

  if (newPollId) {
    // Update slug on created record to include unique id
    const { error: updateError } = await client
      .from("poll")
      .update({
        slug: combined_slug,
      })
      .eq("id", newPollId);

    if (updateError) {
      console.error("Create Poll Slug Error:", { updateError });
      return null;
    }
    return combined_slug;
  } else {
    return null;
  }
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
