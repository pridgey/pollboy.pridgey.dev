import { useState, useEffect } from "react";
import { Poll, PollOption } from "../../types";
import { Input, GridArea, Text, Loader } from "../../components";
import { StyledPollView } from "./PollView.styles";
import { usePollAPI, useUserID, useRecentPolls } from "../../utilities";
import queryString from "query-string";
import { v4 } from "uuid";

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

  return (
    <StyledPollView>
      {loading ? (
        <Loader />
      ) : (
        <>
          <GridArea Area="title">
            <Text FontSize={50} FontWeight={800} TextAlign="left">
              {pollState.PollName}
            </Text>
          </GridArea>
          <GridArea Area="description">
            <Text FontSize={35} FontWeight={400} TextAlign="left">
              {pollState.PollDescription}
            </Text>
          </GridArea>
          <GridArea Area="add">
            {pollState.UserID === userID && (
              <Input
                Type="text"
                Label="Add New Option"
                OnChange={() => undefined}
                OnEnter={(newValue: string) => {
                  const newOption: PollOption = {
                    PollID: slug?.toString() ?? "",
                    PollOptionDescription: newValue,
                    PollOptionID: v4(),
                    PollOptionName: newValue,
                  };

                  setPollOptionsState([...pollOptionsState, newOption]);
                  createPollOption(newOption);
                  return true;
                }}
              />
            )}
          </GridArea>
          <GridArea Area="options">
            {pollOptionsState.map((item, index) => (
              <div
                style={{
                  fontSize: "20rem",
                  width: "100%",
                  backgroundColor: "#0000e0",
                  margin: "15rem 0px",
                  padding: "15px",
                  boxSizing: "border-box",
                  color: "#fff",
                }}
                key={index}
              >
                {item.PollOptionName}
              </div>
            ))}
          </GridArea>
        </>
      )}
    </StyledPollView>
  );
};
