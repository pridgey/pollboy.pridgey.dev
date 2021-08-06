import React, { createContext, useContext } from "react";
import { useAirtable } from "./../useAirtable";
import { Poll, PollOption, PollVote } from "./../../types";
import { CallAPI } from "./PollAPI.functions";
import Airtable from "airtable";

// Defines the functions that come out of the PollAPI
type PollAPI = {
  createPoll: (NewPoll: Poll) => Promise<any>;
  listPolls: (UserID: string) => Promise<Poll[]>;
  updatePoll: (UpdatedPoll: Poll) => Promise<boolean>;
  deletePoll: (PollID: string) => Promise<boolean>;
  selectPoll: (PollID: string) => Promise<Poll[]>;
  createPollOption: (NewPollOption: PollOption) => Promise<boolean>;
  listPollOptions: (PollID: string) => Promise<PollOption[]>;
  selectPollOption: (
    PollOptionID: string,
    PollID: string
  ) => Promise<PollOption[]>;
  deletePollOption: (PollOptionID: string, PollID: string) => Promise<boolean>;
  updatePollOption: (UpdatedPollOption: PollOption) => Promise<boolean>;
  vote: (PollOption: PollOption, UserID: string) => Promise<boolean>;
  listPollVotes: (PollID: string) => Promise<PollVote[]>;
};

// The Context
export const PollAPIContext = createContext<PollAPI>(
  CallAPI(new Airtable({ apiKey: "Fake" }).base(""))
);

// The hook
export const usePollAPI = () => useContext(PollAPIContext);

// The Provider which provides the stuff
export const PollAPIProvider: React.FC = ({ children }) => {
  // Get Airtable
  const airtable = useAirtable();

  return (
    <PollAPIContext.Provider value={CallAPI(airtable!)}>
      {children}
    </PollAPIContext.Provider>
  );
};
