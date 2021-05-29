import React, { createContext, useContext } from "react";
import { useAirtable } from "./../useAirtable";
import { Poll } from "./../../types";
import { CallAPI } from "./PollAPI.functions";
import Airtable from "airtable";

// Defines the functions that come out of the PollAPI
type PollAPI = {
  createPoll: (NewPoll: Poll) => Promise<boolean>;
  listPolls: (UserID: string) => Promise<{}[]>;
  updatePoll: (UpdatedPoll: Poll) => Promise<void>;
  deletePoll: (PollID: string) => Promise<void>;
  selectPoll: (PollID: string) => Promise<{}[]>;
};

// The Context
export const PollAPIContext = createContext<PollAPI>(
  CallAPI(new Airtable({ apiKey: "awf" }).base(""))
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
