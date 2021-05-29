import { useEffect } from "react";
import { usePollAPI } from "./../../utilities";

export const Home = () => {
  const { listPollVotes } = usePollAPI();

  useEffect(() => {
    listPollVotes("4421c5fc-9f7f-4309-b26f-6023295ba742").then((result) =>
      console.log(result)
    );
  }, []);

  return <div>Hello</div>;
};
