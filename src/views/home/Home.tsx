import { useEffect } from "react";
import { usePollAPI } from "./../../utilities";

export const Home = () => {
  const { updatePoll } = usePollAPI();

  useEffect(() => {
    updatePoll({
      Slug: "4421c5fc-9f7f-4309-b26f-6023295ba742",
      DateExpire: "6/15/2021",
      PollDescription: "A new poll description",
      PollName: "Check this shit out",
      PublicCanAdd: true,
      UserID: "Boooooi",
    });
  }, []);

  return <div>Hello</div>;
};
