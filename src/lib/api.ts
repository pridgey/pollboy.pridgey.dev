import { action, query, reload, redirect } from "@solidjs/router";
import { getPocketBase, getUser } from "./auth";
import {
  PollOptionRecord,
  PollRecord,
  PollVoteRecord,
} from "~/types/pocketbase";
import { generateSlug } from "~/utilities/generateSlug";
import pkg from "lodash";
const { sortBy } = pkg;

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
 * Delete Poll
 * Action to delete a poll
 */
export const deletePoll = async (pollId: string, redirectToHome?: boolean) => {
  "use server";
  const client = await getPocketBase();

  try {
    await client.collection<PollRecord>("poll").delete(pollId);

    if (redirectToHome) {
      throw redirect("/");
    }
  } catch (err) {
    console.error("Error occurred during poll deletion.", err);
  }
};
export const deletePollAction = action(deletePoll);

/**
 * Edit Poll
 * Action to edit a poll
 */
export const editPoll = async (poll: PollRecord) => {
  "use server";
  const client = await getPocketBase();

  try {
    await client.collection<PollRecord>("poll").update(poll.id ?? "", {
      ...poll,
    });
  } catch (err) {
    console.error("Error editing poll record", err);
  }
};
export const editPollAction = action(editPoll);

/**
 * Get relevant polls
 * Action to get relevant polls for a user - polls the user has made, or has voted in
 */
export const getRelevantPolls = query(async () => {
  "use server";
  const client = await getPocketBase();
  const user = await getUser();

  console.log("Getting relevant polls...");

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

    console.log("Got Poll by Id:", { retrievedPoll });

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
        can_modify: poll?.user_id === user?.id || option.user_id === user?.id,
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
    options: sortBy(pollOptionsWithRankings, "option_name"),
    rankings: pollOptionsWithRankings.map((option) => ({
      Name: option.option_name,
      Votes: option.votes,
      Ranking: option.ranking,
    })),
  };
}, "getFullPoll");

// #endregion Poll Actions
// ======================================================================================
// #region Poll Option Actions

/**
 * Action to create a new poll option record
 */
export const createPollOption = async (pollOptionRecord: PollOptionRecord) => {
  "use server";
  const client = await getPocketBase();
  const user = await getUser();

  try {
    const createdPollOption = await client
      .collection<PollOptionRecord>("polloptions")
      .create({
        ...pollOptionRecord,
        user_id: user?.id ?? "",
      });

    return createdPollOption;
  } catch (err) {
    console.error("Error creating new poll option record", err);
  }
};
export const createPollOptionAction = action(createPollOption);

/**
 * Get a single poll option record
 */
export const getPollOptionById = query(async (pollOptionId: string) => {
  "use server";
  const client = await getPocketBase();

  console.log("Getting poll option...", { pollOptionId });

  // Get poll
  try {
    const retrievePollOption = await client
      .collection<PollOptionRecord>("polloptions")
      .getOne(pollOptionId);

    return retrievePollOption;
  } catch (err) {
    console.error("Error getting poll option by id:", err);

    return null;
  }
}, "getPollOptionById");

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

/**
 * Server Action to delete a Poll Option
 */
export const deletePollOption = async (pollOptionId: string) => {
  "use server";
  const client = await getPocketBase();

  try {
    await client
      .collection<PollOptionRecord>("polloptions")
      .delete(pollOptionId);
  } catch (err) {
    console.error("Error deleting Poll Option record", err);
  }
};
export const deletePollOptionAction = action(deletePollOption);

/**
 * Server Action to update a poll option record
 */
export const updatePollOption = async (
  pollOptionId: string,
  optionName: string,
  optionDescription: string
) => {
  "use server";
  const client = await getPocketBase();

  try {
    await client
      .collection<PollOptionRecord>("polloptions")
      .update(pollOptionId, {
        option_name: optionName,
        option_desc: optionDescription,
      });
  } catch (err) {
    console.error("Error updating a Poll Option Record", err);
  }
};
export const updatePollOptionAction = action(updatePollOption);

// #endregion Poll Option Actions
// ======================================================================================
// #region Poll Vote Actions

/**
 * Server query to get all of the vote records for a given poll
 */
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

/**
 * Server action to vote for a poll option record
 */
export const voteForOption = async (pollOptionId: string, pollId: string) => {
  "use server";
  const client = await getPocketBase();
  const user = await getUser();

  try {
    const existingVote = await client
      .collection<PollVoteRecord>("pollvotes")
      .getFirstListItem(
        `user_id = "${user?.id}" && polloption_id = "${pollOptionId}"`
      );

    // There is an existing vote, delete it to be a "unvote"
    await client
      .collection<PollVoteRecord>("pollvotes")
      .delete(existingVote.id ?? "unknown vote id");
  } catch (err) {
    console.log("Error:", err);
    // Likely there is no existing vote, so we shall make a new one
    await client.collection<PollVoteRecord>("pollvotes").create({
      polloption_id: pollOptionId,
      user_id: user?.id,
      poll_id: pollId,
    });
  }
};
export const voteForOptionAction = action(voteForOption);

// #endregion Poll Vote Actions
