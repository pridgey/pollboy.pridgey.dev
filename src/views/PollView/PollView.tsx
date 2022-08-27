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

  // Poll State
  const [pollInfo, setPollInfo] = useState<Poll>();
  const [pollOptions, setPollOptions] = useState<PollOption[]>([]);
  const [pollVotes, setPollVotes] = useState<PollVote[]>([]);
  // Loading state
  const [loading, setLoading] = useState(true);
  // Show Poll Option form
  const [showPollOptionForm, setShowPollOptionForm] = useState(false);

  // Grab poll name
  const urlParams = new URLSearchParams(window.location.search);

  // Get poll API
  const {
    selectPollBySlug,
    createPollOption,
    listPollOptions,
    listPollVotes,
    vote,
  } = usePollAPI();

  // Call api
  useEffect(() => {
    // Get poll slug from url
    const slug = urlParams.get("slug");

    if (slug) {
      const pollData = selectPollBySlug(slug);

      console.log({ pollData });
    }
  });

  return (
    <StyledPollView>
      {loading ? (
        <Loader />
      ) : (
        <>
          <GridArea Area="title">
            <PollViewTitle
              Title={pollInfo?.poll_name || "Loading..."}
              Description={pollInfo?.poll_desc || ""}
            />
          </GridArea>
          <GridArea Area="description"></GridArea>
          <GridArea Area="add">
            {(pollInfo?.user_id === userID || pollInfo?.public_can_add) && (
              <>
                <Button OnClick={() => setShowPollOptionForm(true)}>
                  Create New Poll Option
                </Button>
                {showPollOptionForm && (
                  <AddOptionForm
                    OnSaveAndClose={(title: string, description: string) => {
                      //handleNewOption(title, description);
                      setShowPollOptionForm(false);
                    }}
                    OnSaveAndMore={(title: string, description: string) => {
                      //handleNewOption(title, description);
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
                    //removePollOptionFromState(pollOption);
                  }}
                  key={`pollOption-${pollOption.id}`}
                  IsChecked={pollVotes.some((vote) => vote.user_id === userID)}
                  OnEdit={(EditedPollOption: PollOption) => {
                    // Edit the state
                    // updatePollOptionInState(
                    //   EditedPollOption.id!,
                    //   EditedPollOption.option_name,
                    //   EditedPollOption.option_desc
                    // );
                  }}
                  OnChange={() => {
                    // user clicked on card, we should probably vote
                  }}
                  Place={index}
                  CanEdit={[pollOption.user_id, pollInfo?.user_id].includes(
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
