import { Poll, PollOption, PollVote } from "./../../types";
import { v4 } from "uuid";
import { SupabaseClient } from "@supabase/supabase-js";

export const CallAPI = (supabase: SupabaseClient) => ({
  // Create a new Poll
  createPoll: async (NewPoll: Poll) => {
    const { data } = await supabase.from("poll").insert([NewPoll]);
    return data;
  },
  // Update an existing Poll
  updatePoll: async (UpdatedPoll: Poll) => {
    const { count, data } = await supabase.from("poll").update([UpdatedPoll]);
    return { count, data };
  },
  // List all Polls the user has made, or has voted in
  listPolls: async (UserID: string) => {
    console.log("Hello?");
    const { data: pollVotesData } = await supabase
      .from("pollvotes")
      .select("poll_id")
      .eq("user_id", UserID);

    const pollsUserHasVotedIn = pollVotesData?.map((votes) => votes.poll_id);

    const { count, data } = await supabase
      .from("poll")
      .select("*")
      .or(`user_id.eq.${UserID},poll_id.in.(${pollsUserHasVotedIn})`);

    return { count, data };
  },
  // Select a single poll
  selectPoll: async (PollID: number) => {
    const { count, data } = await supabase
      .from("poll")
      .select("*")
      .eq("id", PollID);

    return { count, data };
  },
  // Select a single poll by slug
  selectPollBySlug: async (Slug: string) => {
    const { count, data } = await supabase
      .from("poll")
      .select("*")
      .eq("slug", Slug);

    return { count, data };
  },
  // Delete Poll
  deletePoll: async (PollID: number) => {
    const { error } = await supabase.from("poll").delete().eq("id", PollID);

    return error ? false : true;
  },
  // Create a new Poll Option for a Poll
  createPollOption: async (NewPollOption: PollOption) => {
    const { count, data } = await supabase
      .from("polloptions")
      .insert([NewPollOption]);

    return { count, data };
  },
  // List all poll options for a specific poll
  listPollOptions: async (PollID: number) => {
    const { count, data } = await supabase
      .from("polloptions")
      .select("*")
      .eq("poll_id", PollID);

    return { count, data };
  },
  // Select a single poll option for a poll
  selectPollOption: async (PollOptionID: number) => {
    const { count, data } = await supabase
      .from("polloptions")
      .select("*")
      .eq("id", PollOptionID);

    return { count, data };
  },
  // Delete PollOption from Poll
  deletePollOption: async (PollOptionID: number) => {
    const { error } = await supabase
      .from("polloptions")
      .delete()
      .eq("id", PollOptionID);

    return error ? false : true;
  },
  // Update an existing Poll Option
  updatePollOption: async (UpdatedPollOption: PollOption) => {
    const { count, data } = await supabase
      .from("polloptions")
      .update([UpdatedPollOption]);

    return { count, data };
  },
  // Creates a vote for a poll option for a user
  vote: async (Vote: PollVote) => {
    const { count, data } = await supabase.from("pollvotes").insert([Vote]);

    return { count, data };
  },
  // List all PollVotes for a Poll
  listPollVotes: async (PollID: number) => {
    const { count, data } = await supabase
      .from("pollvotes")
      .select("*")
      .eq("poll_id", PollID);

    return { count, data };
  },
});

export const EmptyApi = () => ({
  // Create a new Poll
  createPoll: (NewPoll: Poll) => {},
  // Update an existing Poll
  updatePoll: (UpdatedPoll: Poll) => {},
  // List all Polls the user has made, or has voted in
  listPolls: (UserID: string) => new Promise(() => {}),
  // Select a single poll
  selectPoll: (PollID: number) => {},
  // Select a single poll by slug
  selectPollBySlug: (Slug: string) => {},
  // Delete Poll
  deletePoll: (PollID: number) => {},
  // Create a new Poll Option for a Poll
  createPollOption: (NewPollOption: PollOption) => {},
  // List all poll options for a specific poll
  listPollOptions: (PollID: number) => {},
  // Select a single poll option for a poll
  selectPollOption: (PollOptionID: number) => {},
  // Delete PollOption from Poll
  deletePollOption: (PollOptionID: number) => {},
  // Update an existing Poll Option
  updatePollOption: (UpdatedPollOption: PollOption) => {},
  // Creates a vote for a poll option for a user
  vote: (Vote: PollVote) => {},
  // List all PollVotes for a Poll
  listPollVotes: (PollID: number) => {},
});
