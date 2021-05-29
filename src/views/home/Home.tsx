import { useEffect } from "react";
import { usePollAPI, useUserID } from "./../../utilities";
import { StyledHome } from "./Home.styles";
import Avatar from "boring-avatars";

export const Home = () => {
  const { listPollVotes } = usePollAPI();
  const userID = useUserID();

  useEffect(() => {
    listPollVotes("4421c5fc-9f7f-4309-b26f-6023295ba742").then((result) =>
      console.log(result)
    );
  }, []);

  return (
    <StyledHome>
      <span>Welcome to Pollboy</span>
      <Avatar size={80} name={userID} variant="beam" />
    </StyledHome>
  );
};
