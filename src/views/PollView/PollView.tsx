import { useState, useEffect, useCallback } from "react";
import { Poll, PollOption, PollVote } from "../../types";
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

type SocketMessage = {
  Task: "add" | "delete" | "edit";
  PollID: string;
  UserID: string;
  Payload: { [key: string]: number | string | Date };
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
  const [pollOptionsMap, setPollOptionsMap] = useState<
    Map<PollOption, PollVote[]>
  >(new Map());

  // Function for adding new Options to state
  const addPollOptionToState = useCallback(
    (newOption: PollOption) => {
      const currentOptions = new Map(pollOptionsMap);

      // Add to state unless it's already there
      if (!currentOptions.has(newOption)) {
        currentOptions.set(newOption, []);
        setPollOptionsMap(currentOptions);
      }
    },
    [pollOptionsMap]
  );

  const removePollOptionFromState = useCallback(
    (option: PollOption) => {
      const currentOptions = new Map(pollOptionsMap);

      currentOptions.forEach((val, key) => {
        if (key.PollOptionID === option.PollOptionID) {
          // Ladies and gentlemen, we got it
          currentOptions.delete(key);
        }
      });

      setPollOptionsMap(currentOptions);
    },
    [pollOptionsMap]
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
          add: () => addPollOptionToState(parsedMessage?.Payload as PollOption),
          delete: () =>
            removePollOptionFromState(parsedMessage?.Payload as PollOption),
          edit: () => {
            // do stuff
          },
        };

        const action = messageAction[parsedMessage?.Task];
        action();
      }
    });
  }, [socket, slug, userID, addPollOptionToState, removePollOptionFromState]);

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
      const getVotes = listPollVotes(slug.toString());

      Promise.all([getPoll, getOptions, getVotes])
        .then(([pollResults, optionsResults, votesResults]) => {
          if (pollResults) {
            updatePollState(pollResults[0]);
          }

          if (optionsResults) {
            const pollOptions: Map<PollOption, PollVote[]> = new Map();
            optionsResults.forEach((option: PollOption) => {
              // Grab all votes for this option
              const optionVotes: PollVote[] = votesResults.filter(
                (vote: PollVote) => vote.PollOptionID === option.PollOptionID
              );
              pollOptions.set(option, optionVotes);
            });

            // Set state
            setPollOptionsMap(pollOptions);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [slug, selectPoll, listPollOptions, listPollVotes]);

  // Reorder poll options by votes
  const rankPollOptions = () => {
    // Needs to rank shit
  };

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
            {Array.from(pollOptionsMap).map((item, index) => {
              const [pollOption, pollVotes] = item;
              return (
                <PollOptionCard
                  ID={pollOption.PollOptionID}
                  PollID={pollOption.PollID}
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
                  IsChecked={pollVotes.some(
                    (option) =>
                      option.PollOptionID === pollOption.PollOptionID &&
                      option.UserID === userID
                  )}
                  OnChange={() => {
                    const pollVoteID = `${userID}-${pollOption.PollOptionID}`;
                    const newVote = {
                      PollID: pollOption.PollID,
                      PollOptionID: pollOption.PollOptionID,
                      PollVoteID: pollVoteID,
                      UserID: userID,
                    };
                    // Update state locally
                    // -- do stuff --
                    // Update API
                    vote(newVote);
                    // Rerank state
                    rankPollOptions();
                  }}
                  OptionDescription={pollOption.PollOptionDescription}
                  OptionName={pollOption.PollOptionName}
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
