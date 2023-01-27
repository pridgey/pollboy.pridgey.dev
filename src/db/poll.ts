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

  const votedPollIds: number[] = Array.from(
    new Set(votedPolls?.map((id) => Number(id.poll_id)) || [])
  );

  // Grab Poll data for any poll the user has made, or has participated in
  const { data, error } = await client
    .from("poll")
    .select()
    .or(`user_id.eq.${userID},id.in.(${votedPollIds.join(",")})`);

  if (error) {
    console.error("Error retrieving User's Polls:", { error });
  }

  return data;
};

export const getPollBySlug = async (
  request: Request,
  slug: string
): Promise<RenderedPollProps | null> => {
  const client = await getClient(request);
  const userID = await getUserId(request);

  const { data, error } = await client.from("poll").select().eq("slug", slug);

  if (error) {
    console.error("Error retrieving specific Poll:", { error });
  }

  const currentPoll: PollRecord = data?.[0];

  if (!currentPoll) {
    return null;
  }

  // Check if the poll has expired
  let hasPollExpired = false;

  if (currentPoll.expire_at) {
    const pollExpiration = new Date(currentPoll.expire_at);

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

  const currentPollID = currentPoll?.id;

  const getPollOptions = client
    .from("polloptions")
    .select()
    .eq("poll_id", currentPollID);

  const getUserVotes = client
    .from("pollvotes")
    .select()
    .eq("user_id", userID)
    .eq("poll_id", currentPollID);

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

  // Determines if this user created this poll
  const isPollOwner = currentPoll?.user_id === userID;

  // Determines if this user can add options
  const canUserAddOptions = isPollOwner || currentPoll?.public_can_add;

  return {
    ...data?.[0],
    options: options?.map((opt) => {
      // Determines if this user created this Poll Option
      const isOptionOwner = opt.user_id === userID;

      return {
        ...opt,
        user_voted: optionVotes?.some((vote) => vote.polloption_id === opt.id),
        can_modify: isPollOwner || isOptionOwner,
      };
    }),
    canUserAddOptions,
    isPollOwner,
    hasPollExpired,
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
  const client = await getClient(request);
  const userID = await getUserId(request);

  const { data: checkData, error: checkError } = await client
    .from("pollvotes")
    .select()
    .eq("polloption_id", optionID)
    .eq("user_id", userID);

  if (checkError) {
    console.error("Error checking for Poll Vote existence", checkError);
  }

  if (checkData?.length) {
    // Option exists, so let's remove it
    const { error: removeError } = await client
      .from("pollvotes")
      .delete()
      .eq("id", checkData[0].id);

    if (removeError) {
      console.error("Error removing Poll Vote", removeError);
      return false;
    }
  } else {
    // Option doesn't exist, so let's add it
    const { error: insertError } = await client.from("pollvotes").insert({
      poll_id: pollID,
      polloption_id: optionID,
      user_id: userID,
    });

    if (insertError) {
      console.error("Error inserting Poll Vote", insertError);
      return false;
    }
  }

  return true;
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

  const rankedOptions = options?.map((opt) => {
    // count votes for this option
    const voteCount =
      votes?.filter((v) => v.polloption_id === opt.id).length || 0;

    return {
      Name: String(opt.option_name),
      Votes: voteCount,
    };
  });

  // Sort by votes
  rankedOptions?.sort((a, b) => b.Votes - a.Votes);

  return rankedOptions;
};
