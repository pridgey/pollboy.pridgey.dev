import { PollType } from "./../../views/poll/Poll.types";

export const JSONToState = (JSONString: string): PollType => {
  const results: PollType = JSON.parse(JSONString);

  return results;
};

export const StateToJSON = (PollObject: PollType): string => {
  const result: string = JSON.stringify(PollObject);

  return result;
};
