import { useState, useEffect } from "react";
import { useSupabase } from "./../../utilities";
import { StyledHome } from "./Home.styles";
import { Poll } from "./../../types";
import { Button, Loader, SandwichCard, Text } from "./../../components";
import { useHistory } from "react-router-dom";

export const Home = () => {
  // Get the user id
  const {
    user: { id: userID },
    supabase,
  } = useSupabase();

  // React-router history
  const routerHistory = useHistory();

  // State to store polls
  const [userPolls, setUserPolls] = useState<Poll[]>([]);
  // State for initial load
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPolls = async () => {
      const { data: poll, error } = await supabase.from("poll").select();

      if (poll) {
        setUserPolls(poll);
      }

      if (error) {
        console.error(error);
      }

      setLoading(false);
    };
    if (userID) {
      console.log("run");
      getPolls();
    }
  }, [userID]);

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
              OnClick={() => routerHistory.push(`/poll?slug=${poll.slug}`)}
              Poll={poll}
              key={`sandwich-${index}`}
              DisplayMode={poll.user_id !== userID}
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
