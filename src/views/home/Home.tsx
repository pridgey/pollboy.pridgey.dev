import { useState, useEffect } from "react";
import { usePollAPI, useUserID } from "./../../utilities";
import { StyledHome } from "./Home.styles";
import { Poll } from "./../../types";
import { Button, Text, WalkOutsideSVG } from "./../../components";
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

  console.log(userPolls);

  useEffect(() => {
    listPolls(userID).then((results: Poll[]) => setUserPolls(results));
  }, [userID, listPolls]);

  return (
    <StyledHome>
      <WalkOutsideSVG Width="50vw" Height="50vw" />
      <Text FontSize={20} TextAlign="center">
        We took a walk and a look around but couldn't find any of your polls...
      </Text>
      <Button FontSize={20} OnClick={() => routerHistory.push("/create")}>
        create a new one
      </Button>
    </StyledHome>
  );
};
