import { useState, useEffect } from "react";
import { Poll } from "./../../types";
import {
  Input,
  FormFooter,
  SandwichCard,
  MessageBoolean,
  Loader,
} from "./../../components";
import { StyledEditPoll } from "./EditPoll.styles";
import { useHistory } from "react-router-dom";
import { usePollAPI, useUserID } from "./../../utilities";
import toast from "react-hot-toast";
import queryString from "query-string";

export const EditPoll = () => {
  // Create some dates so the Date Expires field has proper boundaries
  const today = new Date();
  const tomorrow = new Date(today.valueOf());
  tomorrow.setDate(tomorrow.getDate() + 1);
  const hundred = new Date(today.valueOf());
  hundred.setDate(hundred.getDate() + 100);

  // Grab the UserID
  const userID = useUserID();

  // The state of the poll
  const [pollState, updatePollState] = useState<Poll>({
    expire_at: "",
    poll_desc:
      "Put something here that will really blow the pants off everybody",
    poll_name: "Your Brand New Poll",
    public_can_add: false,
    slug: "",
    user_id: userID,
    created_at: "",
    multivote: true,
  });

  // Loading state
  const [loading, setLoading] = useState(true);

  // Grab router history for route updates
  const routerHistory = useHistory();

  // Get the functions for communicating with the api
  const { updatePoll, selectPollBySlug } = usePollAPI();

  // Check for any url params
  const { slug } = queryString.parse(window.location.search);

  useEffect(() => {
    const getPollInfo = async () => {
      const pollResponse = await selectPollBySlug(slug!.toString());

      if (pollResponse?.data) {
        updatePollState(pollResponse.data);
      }
    };

    if (slug) {
      getPollInfo();
    }
  }, [slug]);

  return (
    <StyledEditPoll>
      {loading ? (
        <Loader />
      ) : (
        <>
          <SandwichCard Poll={pollState} DisplayMode={true} />
          <Input
            Value={pollState.poll_name}
            Label="Poll Name"
            Type="text"
            OnChange={(newValue) => {
              updatePollState({
                ...pollState,
                poll_name: newValue,
              });
            }}
          />
          <Input
            Value={pollState.poll_desc}
            Label="Poll Description"
            Type="text"
            OnChange={(newValue) => {
              updatePollState({
                ...pollState,
                poll_desc: newValue,
              });
            }}
          />
          <Input
            Value={pollState.expire_at}
            Label="Date To Expire"
            Type="date"
            Min={tomorrow}
            Max={hundred}
            OnChange={(newValue) => {
              updatePollState({
                ...pollState,
                expire_at: newValue,
              });
            }}
          />
          <MessageBoolean
            Value={pollState.public_can_add}
            BooleanLabels={["Yes", "No"]}
            Label="Public Can Add Options"
            Message="Can any user add an option to this poll?"
            OnChange={(newValue) => {
              updatePollState({
                ...pollState,
                public_can_add: newValue,
              });
            }}
          />
          <MessageBoolean
            Value={pollState.multivote}
            BooleanLabels={["Multi Vote", "Single Vote"]}
            Label="Multi Vote"
            Message="Can Users vote for multiple options?"
            OnChange={(newValue) => {
              updatePollState({
                ...pollState,
                multivote: newValue,
              });
            }}
          />
          <FormFooter
            OnCancel={() => routerHistory.goBack()}
            OnSubmit={() => {
              const { poll_name, poll_desc, expire_at } = pollState;
              if (poll_name.length && poll_desc.length && expire_at.length) {
                // We are good to go
                toast
                  .promise(
                    updatePoll({
                      expire_at: pollState.expire_at,
                      poll_desc: pollState.poll_desc,
                      poll_name: pollState.poll_name,
                      public_can_add: pollState.public_can_add,
                      slug: pollState.slug,
                      user_id: pollState.user_id,
                      created_at: pollState.created_at,
                      multivote: pollState.multivote,
                    }),
                    {
                      loading: "Editing The Poll...",
                      success: "Poll Modified!",
                      error: "An error has occurred with this poll.",
                    }
                  )
                  .then(() => routerHistory.push(`/p?s=${pollState.slug}`));
              } else {
                // Not quite right
                toast.error(
                  "Poll Name, Poll Description and Date To Expire are all required fields. Please check them over once more.",
                  {
                    icon: "⚠️",
                  }
                );
              }
            }}
          />
        </>
      )}
    </StyledEditPoll>
  );
};
