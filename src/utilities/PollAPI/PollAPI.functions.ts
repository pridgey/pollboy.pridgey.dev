import Airtable from "airtable";
import { Poll, PollVote } from "./../../types";
import { v4 } from "uuid";

export const CallAPI = (Base: Airtable.Base) => ({
  // Create a new Poll
  createPoll: (NewPoll: Poll) =>
    Base("Polls")
      ?.create([
        {
          fields: {
            ...{ ...NewPoll },
            Slug: v4(),
          },
        },
      ])
      .then(() => {
        return true;
      }),
  // Update an existing Poll
  updatePoll: (UpdatedPoll: Poll) =>
    Base("Polls")
      ?.select({
        filterByFormula: `Slug = "${UpdatedPoll.Slug}"`,
      })
      .all()
      .then((result) => result.map((result) => result.id))
      .then((result) => {
        Base("Polls")
          .update([
            {
              id: result[0],
              fields: {
                ...UpdatedPoll,
              },
            },
          ])
          .then(() => true);
      }),
  // List all Polls the user has made, or has voted in
  listPolls: (UserID: string) =>
    Base("PollVotes")
      ?.select({
        filterByFormula: `UserID = "${UserID}"`,
      })
      .all()
      .then((results) =>
        results.map((result) => (result.fields as PollVote).PollID)
      )
      .then((VotedPollIDs: string[]) =>
        Base("Polls")
          ?.select({
            filterByFormula: VotedPollIDs.length
              ? `OR(UserID = "${UserID}"${VotedPollIDs.map(
                  (PollID) => `, Slug = "${PollID}"`
                ).join("")})`
              : `UserID="${UserID}"`,
          })
          .all()
          .then((results) => results.map((result) => result.fields))
      ),
  // Select a single poll
  selectPoll: (PollID: string) =>
    Base("Polls")
      ?.select({
        filterByFormula: `Slug = "${PollID}"`,
      })
      .all()
      .then((result) => result.map((result) => result.fields)),
  // Delete Poll
  deletePoll: (PollID: string) =>
    Base("Polls")
      ?.select({
        filterByFormula: `Slug = "${PollID}"`,
      })
      .all()
      .then((result) => result.map((result) => result.id))
      .then((result) => {
        Base("Polls")
          .destroy(result)
          .then(() => true);
      }),
});
