import { useState, useEffect, useCallback } from "react";
import { Poll, PollOption } from "../../types";
import {
  AddOptionForm,
  Button,
  GridArea,
  PollViewTitle,
  Loader,
  PollOptionCard,
} from "../../components";
import { StyledPollView } from "./PollView.styles";
import {
  usePollAPI,
  useUserID,
  useRecentPolls,
  useSocket,
} from "../../utilities";
import queryString from "query-string";
import { v4 } from "uuid";
import Toast from "react-hot-toast";
import { sortBy } from "lodash";

type SocketMessage = {
  Task: "add" | "delete" | "edit";
  PollID: string;
  UserID: string;
  Payload: PollOption;
};

export const PollView = () => {
  // User ID
  const userID = useUserID();

  // Recent polls
  const { setRecentPolls } = useRecentPolls();

  // Grab socket connection to send messages and receive updates from other users
  const socket = useSocket();

  // Grab poll params
  const { slug } = queryString.parse(window.location.search);

  // Get poll API
  const { selectPoll, createPollOption, listPollOptions, listPollVotes, vote } =
    usePollAPI();

  // Loading state
  const [loading, setLoading] = useState(true);

  // Poll state
  const [pollState, updatePollState] = useState<Poll>({
    DateExpire: "",
    PollDescription:
      "Put something here that will really blow the pants off everybody",
    PollName: "Your Brand New Poll",
    PublicCanAdd: false,
    Slug: "",
    UserID: userID,
  });

  // Poll Option State
  const [pollOptions, setPollOptions] = useState<PollOption[]>([]);

  // Function for adding new Options to state
  const addPollOptionToState = useCallback(
    (newOption: PollOption) => {
      const currentOptions = [...pollOptions];

      // Add to state unless it's already there
      if (
        !currentOptions.some(
          (option) => option.PollOptionID === newOption.PollOptionID
        )
      ) {
        currentOptions.push(newOption);
        setPollOptions([...currentOptions]);
      }
    },
    [pollOptions]
  );

  // Function to remove options from state
  const removePollOptionFromState = useCallback(
    (optionToDelete: PollOption) => {
      const currentOptions = [...pollOptions];

      currentOptions.splice(
        currentOptions.findIndex(
          (option) => option.PollOptionID === optionToDelete.PollOptionID
        ),
        1
      );
      setPollOptions([...currentOptions]);
    },
    [pollOptions]
  );

  // Reorder poll options by votes
  const rankPollOptions = useCallback(
    (options?: PollOption[]) => {
      const currentOptions = options ?? [...pollOptions];

      console.log("Before:", currentOptions);
      const sortedOptions = sortBy(
        currentOptions,
        (option) => -option.UserVotes.length
      );
      console.log("After:", sortedOptions);

      setPollOptions([...sortedOptions]);
    },
    [pollOptions]
  );

  // Function to update option in state
  const updatePollOptionInState = useCallback(
    (optionID: string, Title: string, Desc: string) => {
      const currentOptions = [...pollOptions];

      const optionToUpdate = currentOptions.find(
        (option) => option.PollOptionID === optionID
      );
      if (optionToUpdate) {
        const updatedOption = { ...optionToUpdate };
        updatedOption.PollOptionName = Title;
        updatedOption.PollOptionDescription = Desc;

        currentOptions.splice(currentOptions.indexOf(optionToUpdate), 1);
        currentOptions.push(updatedOption);
        setPollOptions([...currentOptions]);
      }
    },
    [pollOptions]
  );

  // Listen to socket updates
  useEffect(() => {
    socket.on("message", (msg: string) => {
      // Grab the data
      const parsedMessage: SocketMessage = JSON.parse(msg);

      if (
        parsedMessage?.PollID === slug?.toString() && // Is this the right poll?
        parsedMessage?.UserID !== userID // Comes from another user
      ) {
        // Run an action based on the task
        const messageAction: {
          [key in "add" | "delete" | "edit"]: () => void;
        } = {
          add: () => addPollOptionToState(parsedMessage?.Payload),
          delete: () => removePollOptionFromState(parsedMessage?.Payload),
          edit: () => {
            const { PollOptionID, PollOptionName, PollOptionDescription } =
              parsedMessage?.Payload;
            updatePollOptionInState(
              PollOptionID,
              PollOptionName,
              PollOptionDescription
            );
          },
        };

        const action = messageAction[parsedMessage?.Task];
        action();
      }
    });
  }, [
    socket,
    slug,
    userID,
    addPollOptionToState,
    removePollOptionFromState,
    updatePollOptionInState,
  ]);

  // Show Poll Option form
  const [showPollOptionForm, setShowPollOptionForm] = useState(false);

  // Add this poll to recent polls
  useEffect(() => {
    if (pollState.Slug) {
      // Grab the recent polls from local storage
      const recentPollsStorage = localStorage.getItem("pb-recent-polls");
      const recentPollsItems: any[] = JSON.parse(recentPollsStorage ?? "[]");

      // Apply this poll to the front of the array if it doesn't exist
      if (!recentPollsItems.map((x) => x.Slug).includes(pollState.Slug)) {
        recentPollsItems.unshift({
          Slug: pollState.Slug,
          Name: pollState.PollName,
        });
      }

      // Reset storage with the first 5 items
      localStorage.setItem(
        "pb-recent-polls",
        JSON.stringify(recentPollsItems.slice(0, 5))
      );

      // Set the state
      setRecentPolls(recentPollsItems.slice(0, 5));
    }
  }, [pollState, setRecentPolls]);

  // Grab the poll
  useEffect(() => {
    if (slug) {
      // Grab all the data we need from the api
      const getPoll = selectPoll(slug.toString());
      const getOptions = listPollOptions(slug.toString());

      Promise.all([getPoll, getOptions])
        .then(([pollResults, optionsResults]) => {
          if (pollResults) {
            updatePollState(pollResults[0]);
          }

          if (optionsResults) {
            rankPollOptions(optionsResults);
          }
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line
  }, [slug, selectPoll, listPollOptions, listPollVotes]);

  // Function to add an option
  const handleNewOption = useCallback(
    (optionTitle, optionDescription) => {
      if (optionTitle) {
        const newOption: PollOption = {
          PollID: slug?.toString() ?? "",
          PollOptionDescription: optionDescription,
          PollOptionID: v4(),
          PollOptionName: optionTitle,
          UserID: userID,
          UserVotes: [],
        };

        // Update local state
        addPollOptionToState(newOption);

        // Update API
        createPollOption(newOption);
        Toast.success("Created New Poll Option");
        // Alert other users
        const newMessage: SocketMessage = {
          Task: "add",
          PollID: slug?.toString() ?? "",
          UserID: userID ?? "",
          Payload: newOption,
        };
        socket.send(JSON.stringify(newMessage));
      }
    },
    [createPollOption, slug, userID, socket, addPollOptionToState]
  );

  return (
    <StyledPollView>
      {loading ? (
        <Loader />
      ) : (
        <>
          <GridArea Area="title">
            <PollViewTitle
              Title={pollState.PollName}
              Description={pollState.PollDescription}
            />
          </GridArea>
          <GridArea Area="description"></GridArea>
          <GridArea Area="add">
            {(pollState.UserID === userID || pollState.PublicCanAdd) && (
              <>
                <Button OnClick={() => setShowPollOptionForm(true)}>
                  Create New Poll Option
                </Button>
                {showPollOptionForm && (
                  <AddOptionForm
                    OnSaveAndClose={(title: string, description: string) => {
                      handleNewOption(title, description);
                      setShowPollOptionForm(false);
                    }}
                    OnSaveAndMore={(title: string, description: string) => {
                      handleNewOption(title, description);
                    }}
                  />
                )}
              </>
            )}
          </GridArea>
          <GridArea Area="options">
            {pollOptions.map((pollOption, index) => {
              return (
                <PollOptionCard
                  PollOption={pollOption}
                  OnDelete={() => {
                    // Remove from state
                    removePollOptionFromState(pollOption);
                    // Inform  others
                    const deleteMessage: SocketMessage = {
                      Task: "delete",
                      PollID: slug?.toString() ?? "",
                      UserID: userID,
                      Payload: pollOption,
                    };
                    socket.send(JSON.stringify(deleteMessage));
                  }}
                  key={`pollOption-${pollOption.PollOptionID}`}
                  IsChecked={pollOption.UserVotes.includes(userID)}
                  OnEdit={(EditedPollOption: PollOption) => {
                    // Edit the state
                    updatePollOptionInState(
                      EditedPollOption.PollOptionID,
                      EditedPollOption.PollOptionName,
                      EditedPollOption.PollOptionDescription
                    );
                    // Inform others
                    const updateMessage: SocketMessage = {
                      Task: "edit",
                      PollID: slug?.toString() ?? "",
                      UserID: userID,
                      Payload: EditedPollOption,
                    };
                    socket.send(JSON.stringify(updateMessage));
                  }}
                  OnChange={() => {
                    const currentOptions = [...pollOptions];
                    const votedOption = currentOptions.find(
                      (option) =>
                        option.PollOptionID === pollOption.PollOptionID
                    );
                    if (votedOption) {
                      if (votedOption.UserVotes.includes(userID)) {
                        // Remove the vote
                        votedOption.UserVotes.splice(
                          votedOption.UserVotes.indexOf(userID),
                          1
                        );
                      } else {
                        // Add the vote
                        votedOption.UserVotes.push(userID);
                      }
                      setPollOptions([...currentOptions]);
                    }
                    vote(pollOption, userID);
                    // Rerank state
                    rankPollOptions(currentOptions);
                  }}
                  Place={index}
                  CanEdit={[pollOption.UserID, pollState.UserID].includes(
                    userID
                  )}
                />
              );
            })}
          </GridArea>
        </>
      )}
    </StyledPollView>
  );
};
