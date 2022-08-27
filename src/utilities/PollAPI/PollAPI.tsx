import React, { createContext, useContext } from "react";
import { Poll, PollOption, PollVote } from "./../../types";
import { CallAPI, EmptyApi } from "./PollAPI.functions";
import { useSupabase } from "./../useSupabase";

// Defines the functions that come out of the PollAPI
type PollAPI = {
  createPoll: (NewPoll: Poll) => any;
  listPolls: (UserID: string) => Promise<any>;
  updatePoll: (UpdatedPoll: Poll) => any;
  deletePoll: (PollID: number) => any;
  selectPoll: (PollID: number) => any;
  selectPollBySlug: (Slug: string) => any;
  createPollOption: (NewPollOption: PollOption) => any;
  listPollOptions: (PollID: number) => any;
  selectPollOption: (PollOptionID: number) => any;
  deletePollOption: (PollOptionID: number) => any;
  updatePollOption: (UpdatedPollOption: PollOption) => any;
  vote: (Vote: PollVote) => any;
  listPollVotes: (PollID: number) => any;
};

// The Context
export const PollAPIContext = createContext<PollAPI>(EmptyApi());

// The hook
export const usePollAPI = () => useContext(PollAPIContext);

// The Provider which provides the stuff
export const PollAPIProvider: React.FC = ({ children }) => {
  // here will be supabase shit
  const { supabase } = useSupabase();

  if (supabase) {
    return (
      <PollAPIContext.Provider value={CallAPI(supabase)}>
        {children}
      </PollAPIContext.Provider>
    );
  }
  return null;
};
