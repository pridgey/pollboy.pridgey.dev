export type PollType = {
  PollName: string;
  DateCreated: Date;
  CreatedBy: string;
  PollOptions: PollOptionType[];
};

export type PollOptionType = {
  OptionID: string;
  OptionText: string;
  Votes: string[];
};

export const generateEmptyPoll = (userID?: string) => {
  const newPoll: PollType = {
    PollName: "Loading...",
    CreatedBy: userID || "",
    DateCreated: new Date(),
    PollOptions: [],
  };

  return newPoll;
};
