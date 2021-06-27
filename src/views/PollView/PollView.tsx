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

export const PollView = () => {
  // User ID
  const userID = useUserID();

  // Recent polls
  const { setRecentPolls } = useRecentPolls();

  const socket = useSocket();
  socket.send("test");

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
        const updatedMap = new Map(pollOptionsMap);
        updatedMap.set(newOption, []);
        setPollOptionsMap(updatedMap);

        // Update API
        createPollOption(newOption);
        Toast.success("Created New Poll Option");
      }
    },
    [createPollOption, slug, userID, pollOptionsMap]
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
