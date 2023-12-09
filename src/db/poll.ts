import { getClient, getUserId } from "./session";
import { generateSlug } from "~/lib/Slug";
import { redirect } from "solid-start";

// Shape of Poll in the db
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

// Types used in the poll page for rendering, includes PollOptions and other helpful properties
export type RenderedPollProps = PollRecord & {
  options?: PollOptionProps[];
  canUserAddOptions?: boolean;
  isPollOwner?: boolean;
  hasPollExpired?: boolean;
};

export type PollOptionProps = {
  id?: number;
  poll_id: number;
  option_name: string;
  option_desc: string;
  user_id: string;
  created_at?: string;
  user_voted?: boolean;
  can_modify?: boolean;
};

export type PollVoteProps = {
  id?: number;
  created_at: string;
  poll_id: number;
  polloption_id: number;
  user_id: string;
};

const getDateInUTC = (date: Date) => {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
};

const pollToRenderedPoll = (
  poll: PollRecord,
  userID: string
): RenderedPollProps => {
  // Check if the poll has expired
  let hasPollExpired = false;

  if (poll.expire_at) {
    const pollExpiration = new Date(poll.expire_at);

    if (pollExpiration instanceof Date && !isNaN(pollExpiration.valueOf())) {
      // This is a valid date!
      const pollExpiryUTC = getDateInUTC(pollExpiration);
      const today = getDateInUTC(new Date());
      const dayInMs = 1000 * 3600 * 24;

      if (
        Math.floor((today.valueOf() - pollExpiryUTC.valueOf()) / dayInMs) > 0
      ) {
        // We have  passed the expiration date
        hasPollExpired = true;
      }
    }
  }

  // Determine if this is poll owner
  const isPollOwner = poll.user_id === userID;

  // Determine if user can add options
  const canUserAddOptions = isPollOwner || poll.public_can_add;

  return {
    ...poll,
    hasPollExpired,
    isPollOwner,
    canUserAddOptions,
  };
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
  // Grab authenticated client and logged in UserID
  const client = await getClient(request);
  const userID = await getUserId(request);

  // Grab Poll IDs of any Poll a user has voted in
  const { data: votedPolls, error: voteError } = await client
    .from("pollvotes")
    .select("poll_id")
    .eq("user_id", userID);

  if (voteError) {
    console.error("Error retrieving Poll IDs User has Voted In", { voteError });
  }

  // Grab Poll IDs of any Poll a user has submitted options for
  const { data: createdOptions, error: optionError } = await client
    .from("polloptions")
    .select("poll_id")
    .eq("user_id", userID);

  if (optionError) {
    console.error(
      "Error retrieving Poll IDs that user has created options for",
      { optionError }
    );
  }

  const combinedPollIds: number[] = [
    ...(votedPolls?.map((id) => Number(id.poll_id)) || []),
    ...(createdOptions?.map((op) => Number(op.poll_id)) || []),
  ];

  const votedPollIds: number[] = Array.from(new Set(combinedPollIds));

  // Grab Poll data for any poll the user has made, or has participated in
  const { data, error } = await client
    .from("poll")
    .select()
    .or(`user_id.eq.${userID},id.in.(${votedPollIds.join(",")})`);

  if (error) {
    console.error("Error retrieving User's Polls:", { error });
  }

  // Grab poll metadata
  const pollsWithMetaData = data?.map((poll) =>
    pollToRenderedPoll(poll, userID || "")
  );

  return pollsWithMetaData;
};

export const getPollBySlug = async (
  request: Request,
  slug: string
): Promise<RenderedPollProps | null> => {
  // Get user and supabase client
  const client = await getClient(request);
  const userID = await getUserId(request);

  // Grab poll data for this slug
  const { data, error } = await client.from("poll").select().eq("slug", slug);

  if (error) {
    console.error("Error retrieving specific Poll:", { error });
  }

  // Grab first poll for easier access
  const currentPoll: PollRecord = data?.[0];

  if (!currentPoll) {
    return null;
  }

  // This poll's ID, for easier access
  const currentPollID = currentPoll?.id;

  // Collect the options for this poll
  const getPollOptions = client
    .from("polloptions")
    .select()
    .eq("poll_id", currentPollID);

  // Collect the votes for this poll
  const getUserVotes = client
    .from("pollvotes")
    .select()
    .eq("user_id", userID)
    .eq("poll_id", currentPollID);

  // Run options and votes query at once
  const [
    { data: options, error: optionerror },
    { data: optionVotes, error: votesError },
  ] = await Promise.all([getPollOptions, getUserVotes]);

  if (optionerror) {
    console.error("Error retrieving Poll Options:", { optionerror });
  }

  if (votesError) {
    console.error("Error retrieving User Votes:", { votesError });
  }

  // Get the metadata for the poll
  const pollWithMeta = pollToRenderedPoll(currentPoll, userID || "");

  return {
    ...pollWithMeta,
    options: options?.map((opt) => {
      // Determines if this user created this Poll Option
      const isOptionOwner = opt.user_id === userID;

      return {
        ...opt,
        user_voted: optionVotes?.some((vote) => vote.polloption_id === opt.id),
        can_modify: pollWithMeta.isPollOwner || isOptionOwner,
      };
    }),
  };
};

export const editPoll = async (request: Request, pollData: PollRecord) => {
  const client = await getClient(request);
  const userID = await getUserId(request);

  const { data, error } = await client
    .from("poll")
    .update({
      ...pollData,
    })
    .eq("user_id", userID)
    .eq("id", pollData.id)
    .select();

  if (error) {
    console.error("Error modifying Poll", { error });
  }

  return data;
};

export const deletePoll = async (request: Request, pollID: number) => {
  const client = await getClient(request);
  const userID = await getUserId(request);

  const { error: votesError } = await client
    .from("pollvotes")
    .delete()
    .eq("poll_id", pollID);

  if (votesError) {
    console.error("Error deleting Poll's Votes", votesError);
  }

  const { error: optionsError } = await client
    .from("polloptions")
    .delete()
    .eq("poll_id", pollID);

  if (optionsError) {
    console.error("Error deleting Poll's Options", optionsError);
  }

  const { error: pollError } = await client
    .from("poll")
    .delete()
    .eq("id", pollID)
    .eq("user_id", userID);

  if (pollError) {
    console.error("Error deleting Poll", pollError);
  }

  return redirect("/");
};

export const optionVote = async (
  request: Request,
  pollID: number,
  optionID: number
) => {
  // Get client and userID
  const client = await getClient(request);
  const userID = await getUserId(request);

  // Selecting all votes by this user, for this poll
  const votesQuery = client
    .from("pollvotes")
    .select()
    .eq("user_id", userID)
    .eq("poll_id", pollID);

  // Select vote options for this poll
  const pollQuery = client
    .from("poll")
    .select("multivote")
    .eq("id", pollID)
    .limit(1)
    .single();

  // Query for Votes and Poll Settings simultaneously
  const [
    { data: votes, error: votesError },
    { data: multivote, error: pollError },
  ] = await Promise.all([votesQuery, pollQuery]);

  // Log any errors
  votesError && console.error("Error retrieving Poll Votes", votesError);
  pollError && console.error("Error retrieving Poll Settings", pollError);

  // Check and see if there is already a Vote record for this poll option
  const existingVote: PollVoteProps = votes?.find(
    (vote: PollVoteProps) => vote.polloption_id === optionID
  );
  console.log("Vote", { votes, multivote, existingVote });
  if (existingVote?.id) {
    // There is a vote record. This must be an "unvote", remove it
    const { error: removeError } = await client
      .from("pollvotes")
      .delete()
      .eq("id", existingVote.id);
    if (removeError) {
      console.error("Error removing vote record", removeError);
      return false;
    }
    return true;
  } else {
    // There is no existing vote with this id
    if (!multivote?.multivote && (votes?.length || 0) > 0) {
      // There are other votes, and multivote isn't allowed
      return false;
    } else {
      // Either multivote is on, or there are no other votes
      const { error: insertError } = await client.from("pollvotes").insert({
        poll_id: pollID,
        polloption_id: optionID,
        user_id: userID,
      });
      if (insertError) {
        console.error("Error inserting new vote record", insertError);
        return false;
      }
      return true;
    }
  }
};

export const createPollOption = async (
  request: Request,
  newOption: Omit<PollOptionProps, "user_id">
): Promise<PollOptionProps> => {
  const client = await getClient(request);
  const userID = await getUserId(request);

  const { data, error } = await client
    .from("polloptions")
    .insert({
      ...newOption,
      user_id: userID,
    })
    .select();

  if (error) {
    console.error("Error creating new Poll Option", error);
  }

  return data?.[0];
};

export const deletePollOption = async (request: Request, optionId: number) => {
  const client = await getClient(request);

  const { error: votesError } = await client
    .from("pollvotes")
    .delete()
    .eq("polloption_id", optionId);

  if (votesError) {
    console.error("Error deleting votes", votesError);
  }

  const { data: options, error: optionsError } = await client
    .from("polloptions")
    .delete()
    .eq("id", optionId)
    .select();

  if (optionsError) {
    console.error("Error deleting options", optionsError);
  }

  return options;
};

export const modifyPollOption = async (
  request: Request,
  modifiedOption: Omit<PollOptionProps, "user_voted" | "user_id">
) => {
  // Get supabase client and logged in userid
  const client = await getClient(request);

  const { data, error } = await client
    .from("polloptions")
    .update({
      ...modifiedOption,
    })
    .eq("id", modifiedOption.id)
    .select();

  if (error) {
    console.error("Error modifying existing Poll Option", { error });
  }

  return data;
};

export const getPollResults = async (request: Request, pollID: number) => {
  // Get supabase client and logged in userid
  const client = await getClient(request);

  const optionQuery = client.from("polloptions").select().eq("poll_id", pollID);

  const voteQuery = client.from("pollvotes").select().eq("poll_id", pollID);

  const [
    { data: options, error: optionsError },
    { data: votes, error: votesError },
  ] = await Promise.all([optionQuery, voteQuery]);

  if (optionsError || votesError) {
    console.error("Error retrieving Poll rankings", {
      optionsError,
      votesError,
    });
  }

  const rankedOptions =
    options?.map((opt) => {
      // count votes for this option
      const voteCount =
        votes?.filter((v) => v.polloption_id === opt.id).length || 0;

      return {
        Name: String(opt.option_name),
        Votes: voteCount,
      };
    }) ?? [];

  // Sort by votes
  rankedOptions?.sort((a, b) => b.Votes - a.Votes);

  // Add ranking to sorted votes
  type CandidateWithRanking = {
    Name: string;
    Votes: number;
    Ranking: number;
  };

  const optionsWithRanks: CandidateWithRanking[] = [];
  // Track the last candidate's votes and ranking to handle ties
  let lastVotes = -1;
  let lastRanking = 0;
  let skippedRanks = 0; // To account for ties

  // Assign rankings with tie consideration
  rankedOptions.forEach((candidate, index) => {
    if (candidate.Votes === lastVotes) {
      // This candidate is tied with the previous candidate
      optionsWithRanks.push({ ...candidate, Ranking: lastRanking });
      skippedRanks++; // We have an additional tie, so skip the next rank
    } else {
      // This candidate is not tied, so give the next appropriate ranking
      const currentRanking = lastRanking + 1;
      optionsWithRanks.push({ ...candidate, Ranking: currentRanking });
      // Update the last votes and ranking, reset skipped ranks
      lastVotes = candidate.Votes;
      lastRanking = currentRanking;
      skippedRanks = 0;
    }
  });

  return optionsWithRanks;
};
