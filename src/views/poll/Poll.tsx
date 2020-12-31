import { useEffect, useState } from "react";
import firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";
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

export const Poll = () => {
  // Grab the user (if logged in)
  const [user] = useAuthState(firebase.auth());
  // Initialize db connection
  const airtable = useAirtable();
  // Grab any query string params
  const params = queryString.parse(window.location.search);

  // State for the poll overall
  const [pollState, updatePollState] = useState<PollType>(
    generateEmptyPoll(user?.uid)
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

                  const newPoll = generateEmptyPoll(user.uid);

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
                {!editPollName && pollState.CreatedBy === user?.uid && (
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
                {pollState.PollOptions.sort((a, b) => {
                  // Sort by the items with the most votes first
                  return b.Votes.length - a.Votes.length;
                }).map((option, index) => {
                  return (
                    <PollOption
                      key={`polloption-${index}`}
                      Editable={!!user?.uid}
                      Percentage={option.Votes.length / totalVotes}
                      Text={option.OptionText}
                      OnClick={() => {
                        const thePoll: PollType = JSON.parse(
                          JSON.stringify(pollState)
                        );
                        // Add or remove this user from the votes
                        if (option.Votes.includes(user?.uid)) {
                          // You voted for this one already bud
                          const voteIndex = thePoll.PollOptions.find(
                            (options) => options.OptionID === option.OptionID
                          )?.Votes.findIndex((vote) => vote === user.uid);

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
                          )?.Votes.push(user.uid);
                        }

                        updatePollState(thePoll);
                        updateAirtable(thePoll);
                      }}
                    />
                  );
                })}
                {!!user?.uid ? (
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
                        Votes: [user?.uid],
                      });

                      // Update our own state optimistically
                      updatePollState(thePoll);

                      // Update Airtable
                      updateAirtable(thePoll);
                    }}
                  />
                ) : (
                  <Button
                    type="button"
                    Color="grayTwo"
                    onClick={() => {
                      const provider = new firebase.auth.GoogleAuthProvider();
                      firebase.auth().signInWithPopup(provider);
                    }}
                  >
                    Sign In with Google
                  </Button>
                )}
              </PollOptionContainer>
            </GridArea>
          </>
        ) : (
          <GridArea Area="poll">
            <Title>Create a New Poll Above</Title>
          </GridArea>
        )}
      </PollContainer>
    </>
  );
};
