import { useState, useEffect } from "react";
import { Poll } from "../../types";
import { Input, GridArea, Text, Loader } from "../../components";
import { StyledPollView } from "./PollView.styles";
import { usePollAPI, useUserID } from "../../utilities";
import queryString from "query-string";

export const PollView = () => {
  // User ID
  const userID = useUserID();

  // Grab poll params
  const { slug } = queryString.parse(window.location.search);

  // Get poll API
  const { selectPoll } = usePollAPI();

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

  // Add this poll to recent polls
  useEffect(() => {
    if (pollState.Slug) {
      // Grab the recent polls from local storage
      const recentPollsStorage = localStorage.getItem("pb-recent-polls");
      const recentPolls: any[] = JSON.parse(recentPollsStorage ?? "[]");

      // Apply this poll to the front of the array if it doesn't exist
      if (!recentPolls.map((x) => x.Slug).includes(pollState.Slug)) {
        recentPolls.unshift({
          Slug: pollState.Slug,
          Name: pollState.PollName,
        });
      }

      // Reset storage with the first 5 items
      localStorage.setItem(
        "pb-recent-polls",
        JSON.stringify(recentPolls.slice(0, 5))
      );
    }

    // This needs to be in contextual state so it updates without the need for refreshing
  }, [pollState]);

  // Grab the poll
  useEffect(() => {
    if (slug) {
      selectPoll(slug.toString()).then((results) => {
        setLoading(false);
        if (results) {
          updatePollState(results[0]);
        }
      });
    }
  }, [slug, selectPoll]);

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
                OnChange={(newValue: string) => console.log(newValue)}
              />
            )}
          </GridArea>
          <GridArea Area="options">
            {["one", "two", "three", "four", "five"].map((item, index) => (
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
                {item}
              </div>
            ))}
          </GridArea>
        </>
      )}
    </StyledPollView>
  );
};
