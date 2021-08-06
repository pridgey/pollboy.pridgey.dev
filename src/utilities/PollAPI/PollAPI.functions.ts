import { Poll, PollOption, PollVote } from "./../../types";
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
      .then(
        (result) =>
          (result as unknown as any[]).map((result) => result.fields)[0].Slug
      )
      .catch((err) => {
        console.error(err);
        return false;
      }),
  // Update an existing Poll
  updatePoll: (UpdatedPoll: Poll) =>
    Base("Polls")
      ?.select({
        filterByFormula: `Slug = "${UpdatedPoll.Slug}"`,
      })
      .all()
      .then((result) => result.map((result) => result.id))
      .then((result) =>
        Base("Polls")
          .update([
            {
              id: result[0],
              fields: {
                ...UpdatedPoll,
              },
            },
          ])
          .then(() => true)
      )
      .catch((err) => {
        console.error(err);
        return false;
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
          .then((results) => results.map((result) => result.fields as Poll))
      )
      .catch((err) => {
        console.error(err);
        return [] as Poll[];
      }),
  // Select a single poll
  selectPoll: (PollID: string) =>
    Base("Polls")
      ?.select({
        filterByFormula: `Slug = "${PollID}"`,
      })
      .all()
      .then((result) => result.map((result) => result.fields as Poll))
      .catch((err) => {
        console.error(err);
        return [] as Poll[];
      }),
  // Delete Poll
  deletePoll: (PollID: string) =>
    Base("Polls")
      ?.select({
        filterByFormula: `Slug = "${PollID}"`,
      })
      .all()
      .then((result) => result.map((result) => result.id))
      .then((result) =>
        Base("Polls")
          .destroy(result)
          .then(() =>
            Base("PollOptions")
              .select({
                filterByFormula: `PollID = "${PollID}"`,
              })
              .all()
              .then((results) => results.map((result) => result.id))
              .then((results) =>
                Base("PollOptions")
                  .destroy(results)
                  .then(() =>
                    Base("PollVotes")
                      .select({
                        filterByFormula: `PollID = "${PollID}"`,
                      })
                      .all()
                      .then((results) => results.map((result) => result.id))
                      .then((results) =>
                        Base("PollVotes")
                          .destroy(results)
                          .then(() => true)
                      )
                  )
              )
          )
      )
      .catch((err) => {
        console.error(err);
        return false;
      }),
  // Create a new Poll Option for a Poll
  createPollOption: (NewPollOption: PollOption) =>
    Base("PollOptions")
      ?.create([
        {
          fields: {
            ...{ ...NewPollOption },
            UserVotes: JSON.stringify(NewPollOption.UserVotes),
            PollOptionID: NewPollOption.PollOptionID ?? v4(),
          },
        },
      ])
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.error(err);
        return false;
      }),
  // List all poll options for a specific poll
  listPollOptions: (PollID: string) =>
    Base("PollOptions")
      ?.select({
        filterByFormula: `PollID = "${PollID}"`,
      })
      .all()
      .then((results) =>
        results.map((result) => {
          return {
            ...result.fields,
            UserVotes: JSON.parse((result.fields as any).UserVotes),
          } as PollOption;
        })
      )
      .catch((err) => {
        console.error(err);
        return [] as PollOption[];
      }),
  // Select a single poll option for a poll
  selectPollOption: (PollOptionID: string, PollID: string) =>
    Base("PollOptions")
      ?.select({
        filterByFormula: `AND(PollID = "${PollID}", PollOptionID = "${PollOptionID}")`,
      })
      .all()
      .then((result) =>
        result.map((result) => {
          return {
            ...result.fields,
            UserVotes: JSON.parse((result.fields as any).UserVotes),
          } as PollOption;
        })
      )
      .catch((err) => {
        console.error(err);
        return [] as PollOption[];
      }),
  // Delete PollOption from Poll
  deletePollOption: (PollOptionID: string, PollID: string) =>
    Base("PollOptions")
      ?.select({
        filterByFormula: `AND(PollID = "${PollID}", PollOptionID = "${PollOptionID}")`,
      })
      .all()
      .then((result) => result.map((result) => result.id))
      .then((result) =>
        Base("PollOptions")
          .destroy(result)
          .then(() => true)
      )
      .catch((err) => {
        console.error(err);
        return false;
      }),
  // Update an existing Poll Option
  updatePollOption: (UpdatedPollOption: PollOption) =>
    Base("PollOptions")
      ?.select({
        filterByFormula: `PollOptionID = "${UpdatedPollOption.PollOptionID}"`,
      })
      .all()
      .then((result) => result.map((result) => result.id))
      .then((result) =>
        Base("PollOptions")
          .update([
            {
              id: result[0],
              fields: {
                ...UpdatedPollOption,
                UserVotes: JSON.stringify(UpdatedPollOption.UserVotes),
              },
            },
          ])
          .then(() => true)
      )
      .catch((err) => {
        console.error(err);
        return false;
      }),
  // Creates a vote for a poll option for a user
  vote: (PollOption: PollOption, UserID: string) =>
    Base("PollOptions")
      ?.select({
        filterByFormula: `PollOptionID = "${PollOption.PollOptionID}"`,
      })
      .all()
      .then((result) => result.map((result) => result))
      .then((results) => {
        const record = results[0].fields;

        const Votes: string[] = JSON.parse((record as any).UserVotes);
        if (Votes.includes(UserID)) {
          // Remove them!
          Votes.splice(Votes.indexOf(UserID), 1);
        } else {
          // Add them!
          Votes.push(UserID);
        }

        return Base("PollOptions")
          .update([
            {
              id: results[0].id,
              fields: {
                ...PollOption,
                UserVotes: JSON.stringify(Votes),
              },
            },
          ])
          .then(() => true);
      })
      .catch((err) => {
        console.error(err);
        return false;
      }),
  // List all PollVotes for a Poll
  listPollVotes: (PollID: string) =>
    Base("PollVotes")
      ?.select({
        filterByFormula: `PollID = "${PollID}"`,
      })
      .all()
      .then((results) => results.map((result) => result.fields as PollVote))
      .catch((err) => {
        console.error(err);
        return [] as PollVote[];
      }),
});
