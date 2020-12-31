import { useEffect, useState } from "react";
import {
  Button,
  ButtonContainer,
  GridArea,
  LogoContainer,
  PollContainer,
  PollOptionContainer,
  Title,
  YoutubeBackground,
} from "./Poll.styles";
import { EditIcon, PollIcon, PollInput, PollOption } from "./../../components";
import { useAirtable } from "./../../utilities";
import queryString from "query-string";
import { PollType, generateEmptyPoll } from "./Poll.types";
import { v4 } from "uuid";
import { PollDirectory } from "./../pollDirectory";

type PollProps = {
  UserID: string;
};

export const Poll = ({ UserID }: PollProps) => {
  // Initialize db connection
  const airtable = useAirtable();
  // Grab any query string params
  const params = queryString.parse(window.location.search);

  // State for the poll overall
  const [pollState, updatePollState] = useState<PollType>(
    generateEmptyPoll(UserID)
  );
  const [pollID, setPollID] = useState("");
  const [totalVotes, updateTotalVotes] = useState(0);
  const [editPollName, setEditPollName] = useState(false);

  useEffect(() => {
    if (airtable && params) {
      airtable("Polls")
        .select({
          filterByFormula: `PollID = "${params.p}"`,
        })
        .all()
        .then((results: Airtable.Records<{}>) => {
          if (results[0]) {
            // Set the record id for future updates
            setPollID(results[0].id);

            // Translate from airtable's wacky typing to our own
            const pollResults: any[] = results.map((result) => result.fields);
            if (
              pollResults[0]?.PollID === params.p &&
              !!pollResults[0]?.PollPayload
            ) {
              // Everything checks out
              updatePollState(JSON.parse(pollResults[0].PollPayload));
            }
          }
        });
    }
    // eslint-disable-next-line
  }, [airtable]);

  useEffect(() => {
    let total = 0;
    pollState.PollOptions.forEach((option) => {
      total += option.Votes.length;
    });

    updateTotalVotes(total);
  }, [pollState]);

  const updateAirtable = (updatedPoll: PollType) => {
    if (airtable) {
      airtable("Polls")
        .update([
          {
            id: pollID,
            fields: {
              PollPayload: JSON.stringify(updatedPoll),
            },
          },
        ])
        .catch((e) => console.error(e));
    }
  };

  return (
    <>
      <YoutubeBackground
        videoId="gdJjc6l6iII"
        opts={{
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            loop: 1,
            modestbranding: 1,
            mute: 1,
            start: 4,
          },
        }}
      />
      <PollContainer>
        <GridArea Area="logo">
          <LogoContainer>
            <PollIcon Height="1.3em" Width="1.3em" />
            <span>PollBoy</span>
          </LogoContainer>
        </GridArea>
        <GridArea Area="buttons">
          <ButtonContainer>
            <Button
              Color="green"
              type="button"
              onClick={() => {
                // Create new poll and show
                if (airtable) {
                  const newID = v4();

                  const newPoll = generateEmptyPoll(UserID);

                  newPoll.PollName = "Your brand new poll";

                  airtable("Polls")
                    .create([
                      {
                        fields: {
                          PollID: newID,
                          PollPayload: JSON.stringify(newPoll),
                        },
                      },
                    ])
                    .catch((e) => console.error(e))
                    .finally(() => {
                      window.open(`${window.location.origin}?p=${newID}`);
                    });
                }
              }}
            >
              New Poll
            </Button>
            <Button
              Color="grayTwo"
              type="button"
              disabled={!params.p}
              onClick={() => {
                if (params.p) {
                  const textArea = document.createElement("textarea");
                  textArea.value = window.location.href;

                  textArea.id = "temp-textarea";
                  textArea.style.top = "0";
                  textArea.style.left = "0";
                  textArea.style.position = "fixed";
                  textArea.style.opacity = "0";

                  document.body.appendChild(textArea);
                  textArea.focus();
                  textArea.select();

                  try {
                    document.execCommand("copy");
                  } catch (err) {
                    console.error("Unable to copy text to clipboard.", err);
                  }

                  document.getElementById("temp-textarea")?.remove();
                }
              }}
            >
              Copy Poll Link
            </Button>
          </ButtonContainer>
        </GridArea>
        {params.p ? (
          <>
            <GridArea Area="title">
              <Title>
                {pollState.PollName}{" "}
                {!editPollName && pollState.CreatedBy === UserID && (
                  <EditIcon
                    Height="0,5em"
                    Width="0.5em"
                    OnClick={() => setEditPollName(true)}
                  />
                )}
              </Title>
              {editPollName && (
                <PollInput
                  ButtonText="Update Poll Name"
                  Placeholder="New Poll Name"
                  OnSubmit={(newOption: string) => {
                    // Add the new option to the poll and have the user vote for it
                    const thePoll: PollType = JSON.parse(
                      JSON.stringify(pollState)
                    );
                    // Set new name
                    thePoll.PollName = newOption;

                    // Update our own state optimistically
                    updatePollState(thePoll);

                    // Update Airtable
                    updateAirtable(thePoll);
                    setEditPollName(false);
                  }}
                />
              )}
            </GridArea>
            <GridArea Area="poll">
              <PollOptionContainer>
                <PollInput
                  ButtonText="Add Option"
                  Placeholder="Your New Option"
                  OnSubmit={(newOption: string) => {
                    // Add the new option to the poll and have the user vote for it
                    const thePoll: PollType = JSON.parse(
                      JSON.stringify(pollState)
                    );
                    thePoll.PollOptions.push({
                      OptionID: v4().toString(),
                      OptionText: newOption,
                      Votes: [UserID],
                    });

                    // Update our own state optimistically
                    updatePollState(thePoll);

                    // Update Airtable
                    updateAirtable(thePoll);
                  }}
                />
                {pollState.PollOptions.sort((a, b) => {
                  // Sort by the items with the most votes first
                  return b.Votes.length - a.Votes.length;
                }).map((option, index) => {
                  return (
                    <PollOption
                      key={`polloption-${index}`}
                      UserVoted={option.Votes.includes(UserID)}
                      Percentage={option.Votes.length / totalVotes}
                      Text={option.OptionText}
                      OnClick={() => {
                        const thePoll: PollType = JSON.parse(
                          JSON.stringify(pollState)
                        );
                        // Add or remove this user from the votes
                        if (option.Votes.includes(UserID)) {
                          // You voted for this one already bud
                          const voteIndex = thePoll.PollOptions.find(
                            (options) => options.OptionID === option.OptionID
                          )?.Votes.findIndex((vote) => vote === UserID);

                          if (typeof voteIndex === "number") {
                            // Splice the vote from the array
                            thePoll.PollOptions.find(
                              (options) => options.OptionID === option.OptionID
                            )?.Votes.splice(voteIndex!, 1);
                          }
                        } else {
                          // Count the vote!
                          thePoll.PollOptions.find(
                            (options) => options.OptionID === option.OptionID
                          )?.Votes.push(UserID);
                        }

                        updatePollState(thePoll);
                        updateAirtable(thePoll);
                      }}
                    />
                  );
                })}
              </PollOptionContainer>
            </GridArea>
          </>
        ) : (
          <GridArea Area="poll">
            <PollDirectory UserID={UserID} />
          </GridArea>
        )}
      </PollContainer>
    </>
  );
};
