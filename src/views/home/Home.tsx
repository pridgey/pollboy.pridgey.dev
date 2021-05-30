import { useEffect } from "react";
import { usePollAPI, useUserID } from "./../../utilities";
import { PollBoyLogo, Button } from "./../../components";
import { StyledHome } from "./Home.styles";

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
      <PollBoyLogo Height="50vw" Width="50vw" />
      <Button OnClick={() => alert("one")}>Create New Poll</Button>
      <Button OnClick={() => alert("one")}>View My Polls</Button>
    </StyledHome>
  );
};
