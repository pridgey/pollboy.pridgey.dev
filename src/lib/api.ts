import { action, query, reload } from "@solidjs/router";
import { getPocketBase, getUser } from "./auth";
import { PollRecord } from "~/types/pocketbase";
import { generateSlug } from "~/utilities/generateSlug";

// #region Poll Actions

/**
 * Create Poll
 * Action to create a new poll
 */
export const createPoll = async (poll: PollRecord) => {
  "use server";
  try {
    const client = await getPocketBase();
    const user = await getUser();

    // Create the poll
    const createdPoll = await client.collection<PollRecord>("poll").create({
      ...poll,
      slug: generateSlug(),
      user_id: user?.id ?? "unknown user",
    });

    return createdPoll;
  } catch (error) {
    console.error(error);
  }
};
export const createPollAction = action(createPoll);

/**
 * Get relevant polls
 * Action to get relevant polls for a user - polls the user has made, or has voted in
 */
export const getRelevantPolls = query(async () => {
  "use server";
  const client = await getPocketBase();
  const user = await getUser();

  // Pocketbase API Rules will automatically only return polls that the user has created, or has a vote record for
  try {
    const allPolls = await client.collection<PollRecord>("poll").getFullList();

    return allPolls;
  } catch (err) {
    console.error("Error getting polls:", err);

    throw new Error("Something went wrong during listing polls", {
      cause: err,
    });
  }
}, "getRelevantPolls");

/**
 * Get a specified poll by id
 * Query to get a single poll
 */
export const getPollById = query(async (pollId: string) => {
  "use server";
  const client = await getPocketBase();

  console.log("Getting poll...", { pollId });

  // Get poll
  try {
    const retrievedPoll = await client
      .collection<PollRecord>("poll")
      .getOne(pollId);

    return retrievedPoll;
  } catch (err) {
    console.error("Error getting poll by id:", err);

    return null;
  }
}, "getPollById");

// #endregion Poll Actions
