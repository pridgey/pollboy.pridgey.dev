import { useState, useEffect, useCallback } from "react";
import { Poll, PollOption } from "../../types";
import {
  AddOptionForm,
  Button,
  GridArea,
  PollViewTitle,
  Loader,
  SandwichCard,
  PollOptionCard,
} from "../../components";
import { StyledPollView } from "./PollView.styles";
import { usePollAPI, useUserID, useRecentPolls } from "../../utilities";
import queryString from "query-string";
import { v4 } from "uuid";
import Toast from "react-hot-toast";

export const PollView = () => {
  // User ID
  const userID = useUserID();

  // Recent polls
  const { setRecentPolls } = useRecentPolls();

  // Grab poll params
  const { slug } = queryString.parse(window.location.search);

  // Get poll API
  const { selectPoll, createPollOption, listPollOptions } = usePollAPI();

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
    }
  }, [slug, selectPoll, listPollOptions]);

  // Function to add an option
  const handleNewOption = useCallback(
    (optionTitle, optionDescription) => {
      if (optionTitle) {
        const newOption: PollOption = {
          PollID: slug?.toString() ?? "",
          PollOptionDescription: optionDescription,
          PollOptionID: v4(),
          PollOptionName: optionTitle,
        };

        setPollOptionsState([...pollOptionsState, newOption]);
        createPollOption(newOption);
        Toast.success("Created New Poll Option");
      }
    },
    [setPollOptionsState, createPollOption, pollOptionsState, slug]
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
                IsChecked={false}
                OnChange={() => {
                  alert("vote");
                }}
                OptionDescription={item.PollOptionDescription}
                OptionName={item.PollOptionName}
                Place={index}
              />
            ))}
          </GridArea>
        </>
      )}
    </StyledPollView>
  );
};
