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
import { usePollAPI, useUserID, useRecentPolls } from "../../utilities";
import queryString from "query-string";
import { v4 } from "uuid";
import Toast from "react-hot-toast";
import { sortBy } from "lodash";

export const PollView = () => {
  // User ID
  const userID = useUserID();

  // Recent polls
  const { setRecentPolls } = useRecentPolls();

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

  // Poll Options
  const [pollOptionsState, setPollOptionsState] = useState<PollOption[]>([]);

  // Poll Votes
  const [pollVotesState, setPollVotesState] = useState<PollVote[]>([]);

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
      selectPoll(slug.toString()).then((results) => {
        setLoading(false);
        if (results) {
          updatePollState(results[0]);
        }
      });

      listPollOptions(slug.toString()).then((results) => {
        if (results) {
          setPollOptionsState(results);
        }
      });

      listPollVotes(slug.toString()).then((results) => {
        if (results) {
          setPollVotesState(results);
        }
      });
    }
  }, [slug, selectPoll, listPollOptions, listPollVotes]);

  // Reorder poll options by votes
  const rankPollOptions = () => {
    const optionRanking: {
      Option: string;
      Votes: number;
    }[] = [];

    // Count the votes per option
    pollOptionsState.forEach((option) => {
      const numOfVotes = pollVotesState.filter(
        (vote) => vote.PollOptionID === option.PollOptionID
      ).length;
      optionRanking.push({
        Option: option.PollOptionID,
        Votes: numOfVotes,
      });
    });

    // Sort the options by vote
    sortBy(optionRanking, ["Votes"]);

    // Remake options
    const rankedOptions: PollOption[] = [];

    optionRanking.forEach((rank) => {
      rankedOptions.push(
        pollOptionsState.filter(
          (option) => option.PollOptionID === rank.Option
        )[0]
      );
    });

    console.log("------------------------------");
    console.log("optionRanking", optionRanking);
    console.log("Ranked", rankedOptions);
    setPollOptionsState([...rankedOptions]);

    // Probably need to unify state here. Make a new type for this view that combines votes and options
    // Calculate it all at the beginning with the api pull, and then optimistically update it all via state after
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

        setPollOptionsState([...pollOptionsState, newOption]);
        createPollOption(newOption);
        Toast.success("Created New Poll Option");
      }
    },
    [setPollOptionsState, createPollOption, pollOptionsState, slug, userID]
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
            {pollOptionsState.map((item, index) => (
              <PollOptionCard
                key={`pollOption-${item.PollOptionID}`}
                IsChecked={pollVotesState.some(
                  (option) =>
                    option.PollOptionID === item.PollOptionID &&
                    option.UserID === userID
                )}
                OnChange={() => {
                  const pollVoteID = `${userID}-${item.PollOptionID}`;
                  const newVote = {
                    PollID: item.PollID,
                    PollOptionID: item.PollOptionID,
                    PollVoteID: pollVoteID,
                    UserID: userID,
                  };
                  // Update state
                  const pollIndex = pollVotesState.findIndex(
                    (vote) => vote.PollVoteID === pollVoteID
                  );
                  if (pollIndex === -1) {
                    // Doesn't exist
                    pollVotesState.push(newVote);
                  } else {
                    pollVotesState.splice(pollIndex, 1);
                  }
                  vote(newVote);
                  rankPollOptions();
                }}
                OptionDescription={item.PollOptionDescription}
                OptionName={item.PollOptionName}
                Place={index}
                CanEdit={[item.UserID, pollState.UserID].includes(userID)}
              />
            ))}
          </GridArea>
        </>
      )}
    </StyledPollView>
  );
};
