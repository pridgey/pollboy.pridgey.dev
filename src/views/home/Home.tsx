import { useState, useEffect } from "react";
import { usePollAPI, useUserID } from "./../../utilities";
import { StyledHome } from "./Home.styles";
import { Poll } from "./../../types";
import { Button, Loader, SandwichCard, Text } from "./../../components";
import { useHistory } from "react-router-dom";

export const Home = () => {
  // Get the user id
  const userID = useUserID();
  // Grab API Functions
  const { listPolls } = usePollAPI();
  // React-router history
  const routerHistory = useHistory();

  // State to store polls
  const [userPolls, setUserPolls] = useState<Poll[]>([]);
  // State for initial load
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPolls(userID)
      .then((results: Poll[]) => setUserPolls(results))
      .then(() => setLoading(false));
  }, [userID, listPolls]);

  return (
    <StyledHome>
      {loading ? (
        <Loader />
      ) : userPolls.length ? (
        <>
          <Text FontSize={50} FontWeight={800} TextAlign="left">
            Your Polls
          </Text>
          {userPolls.map((poll, index) => (
            <SandwichCard
              OnClick={() => routerHistory.push(`/poll?s=${poll.Slug}`)}
              Poll={poll}
              key={`sandwich-${index}`}
              DisplayMode={poll.UserID !== userID}
              OnDelete={() => {
                const thePolls = [...userPolls];
                thePolls.splice(index, 1);
                setUserPolls([...thePolls]);
              }}
            />
          ))}
        </>
      ) : (
        <>
          <Loader />
          <Text FontSize={20} TextAlign="center">
            Looked around but found no polls you have created or participated
            in.
          </Text>
          <Button FontSize={20} OnClick={() => routerHistory.push("/create")}>
            create a new one
          </Button>
        </>
      )}
    </StyledHome>
  );
};
