import { useEffect, useState } from "react";
import {
  Button,
  Background,
  Header,
  PollOption,
  PollInput,
  PollBoyLogo,
  PollLayout,
  TitleEdit,
  FlexContainer,
  ConfirmDeleteModal,
  EditOptionModal,
} from "./../../components";
import { useAirtable, JSONToState, StateToJSON } from "./../../utilities";
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
  const [optionIDToDelete, setOptionIDToDelete] = useState("");
  const [optionIDToEdit, setOptionIDToEdit] = useState("");

  useEffect(() => {
    // Once airtable is ready, grab data for this pollid
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

  // Function for updating Airtable
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
      <Background>
        <PollLayout
          Header={
            <Header
              Title={
                <FlexContainer JustifyContent="flex-start">
                  <PollBoyLogo Height="100" />
                  <TitleEdit
                    Text={params.p ? pollState.PollName : "PollBoy"}
                    UsersPoll={!!params.p && pollState.CreatedBy === UserID}
                    OnChange={(newTitle: string) => {
                      // Convert to string and back to get unique JS object
                      const thePoll: PollType = JSON.parse(
                        JSON.stringify(pollState)
                      );

                      thePoll.PollName = newTitle;
                      updatePollState(thePoll);
                      updateAirtable(thePoll);
                    }}
                  />
                </FlexContainer>
              }
              Actions={
                <FlexContainer JustifyContent="flex-start">
                  {params.p ? (
                    <Button
                      OnClick={() => {
                        if (params.p) {
                          // Create textarea to paste thing into and copy it to clipboard
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
                            console.error(
                              "Unable to copy text to clipboard.",
                              err
                            );
                          }

                          document.getElementById("temp-textarea")?.remove();
                        }
                      }}
                    >
                      copy poll link
                    </Button>
                  ) : undefined}
                  <Button
                    OnClick={() => {
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
                            window.open(
                              `${window.location.origin}?p=${newID}`,
                              params.p ? "_blank" : "_self"
                            );
                          });
                      }
                    }}
                  >
                    create new poll
                  </Button>
                </FlexContainer>
              }
            />
          }
          Input={
            params.p && (
              <PollInput
                Placeholder="Add a new Poll Item"
                OnSubmit={(newItem: string) => {
                  // Convert to string and back to get unique JS object
                  const thePoll: PollType = JSON.parse(
                    JSON.stringify(pollState)
                  );

                  thePoll.PollOptions.push({
                    OptionID: v4(),
                    OptionText: newItem,
                    Votes: [],
                  });

                  updatePollState(thePoll);
                  updateAirtable(thePoll);
                }}
              />
            )
          }
          Options={
            params.p ? (
              <FlexContainer
                JustifyContent="flex-start"
                AlignItems="flex-start"
                Wrap="wrap"
              >
                {pollState.PollOptions.sort((a, b) => {
                  // Sort by the items with the most votes first
                  return b.Votes.length - a.Votes.length;
                }).map((option) => (
                  <PollOption
                    UsersPoll={pollState.CreatedBy === UserID}
                    OnDeleteClick={() => setOptionIDToDelete(option.OptionID)}
                    OnEditClick={() => setOptionIDToEdit(option.OptionID)}
                    OnClick={() => {
                      // Convert to string and back to get unique JS object
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
                    key={option.OptionID}
                    UserVoted={option.Votes.includes(UserID)}
                    Text={option.OptionText}
                    Votes={option.Votes.length}
                  />
                ))}
              </FlexContainer>
            ) : (
              <PollDirectory UserID={UserID} />
            )
          }
        />
        {optionIDToDelete && (
          <ConfirmDeleteModal
            OnCancel={() => setOptionIDToDelete("")}
            OnConfirm={() => {
              // Convert to string and back to get unique JS object
              const thePoll: PollType = JSON.parse(JSON.stringify(pollState));

              thePoll.PollOptions.splice(
                thePoll.PollOptions.findIndex(
                  (option) => option.OptionID === optionIDToDelete
                ),
                1
              );

              updatePollState(thePoll);
              updateAirtable(thePoll);
              setOptionIDToDelete("");
            }}
          />
        )}
        {optionIDToEdit && (
          <EditOptionModal
            OnCancel={() => setOptionIDToEdit("")}
            OnConfirm={(newText: string) => {
              // Convert to string and back to get unique JS object
              const thePoll: PollType = JSON.parse(JSON.stringify(pollState));

              const option = thePoll.PollOptions.find(
                (option) => option.OptionID === optionIDToEdit
              );

              console.log("option:", option);
              console.log("newText:", newText);

              if (option) {
                option.OptionText = newText;
              }

              updatePollState(thePoll);
              updateAirtable(thePoll);
              setOptionIDToEdit("");
            }}
          />
        )}
      </Background>
    </>
  );
};
