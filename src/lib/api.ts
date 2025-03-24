import { action, query, reload } from "@solidjs/router";
import { getPocketBase, getUser } from "./auth";
import {
  PollOptionRecord,
  PollRecord,
  PollVoteRecord,
} from "~/types/pocketbase";
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

/**
 * Query to to a poll record and all options and votes attached to it for the UI
 */
export const getFullPoll = query(async (pollId: string) => {
  "use server";
  const user = await getUser();

  console.log("Getting full poll...", { pollId });

  // First get the poll
  const poll = await getPollById(pollId);
  // Next get the options
  const pollOptions = await getPollOptions(pollId);
  // Next get any votes
  const optionVotes = await getPollVotes(pollId);

  // Calculate votes for all options
  const pollOptionsWithVotes =
    pollOptions?.map((option) => {
      const voteCount =
        optionVotes?.filter((vote) => vote.polloption_id === option.id)
          .length ?? 0;

      return {
        ...option,
        user_voted:
          optionVotes?.some(
            (vote) =>
              vote.polloption_id === option.id && vote.user_id === user?.id
          ) ?? false,
        votes: voteCount,
      };
    }) ?? [];

  // Rank the poll options
  pollOptionsWithVotes.sort((a, b) => b.votes - a.votes);
  let rank = 1;
  const pollOptionsWithRankings =
    pollOptionsWithVotes.map((option, index) => {
      if (index > 0 && option.votes < pollOptionsWithVotes[index - 1].votes) {
        // If this option has less votes than the previous option, increment the rank
        rank = index + 1;
      }
      // Apply the rank
      return {
        ...option,
        ranking: rank,
      };
    }) ?? [];

  return {
    ...poll,
    options: pollOptionsWithRankings,
  };
}, "getFullPoll");

// #endregion Poll Actions

// #region Poll Option Actions

/**
 * Get all of the option records for a poll
 */
export const getPollOptions = query(async (pollId: string) => {
  "use server";
  const client = await getPocketBase();

  console.log("Getting poll options...", { pollId });

  // Get the options
  try {
    const pollOptions = await client
      .collection<PollOptionRecord>("polloptions")
      .getFullList({
        filter: `poll_id = "${pollId}"`,
      });

    return pollOptions;
  } catch (err) {
    console.error("Error getting poll options.", err);

    return null;
  }
}, "getPollOptions");

// #endregion Poll Option Actions

// #region Poll Vote Actions
export const getPollVotes = query(async (pollId: string) => {
  "use server";
  const client = await getPocketBase();

  console.log("Getting poll votes...", { pollId });

  // Get the votes
  try {
    const pollVotes = await client
      .collection<PollVoteRecord>("pollvotes")
      .getFullList({ filter: `poll_id = "${pollId}"` });

    return pollVotes;
  } catch (err) {
    console.error("Error getting poll votes.", err);

    return null;
  }
}, "getPollVotes");
// #endregion Poll Vote Actions
