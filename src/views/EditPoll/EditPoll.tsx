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
    DateExpire: "",
    PollDescription:
      "Put something here that will really blow the pants off everybody",
    PollName: "Your Brand New Poll",
    PublicCanAdd: false,
    Slug: "",
    UserID: userID,
  });

  // Loading state
  const [loading, setLoading] = useState(true);

  // Grab router history for route updates
  const routerHistory = useHistory();

  // Get the functions for communicating with the api
  const { updatePoll, selectPoll } = usePollAPI();

  // Check for any url params
  const { slug } = queryString.parse(window.location.search);

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
    <StyledEditPoll>
      {loading ? (
        <Loader />
      ) : (
        <>
          <SandwichCard Poll={pollState} DisplayMode={true} />
          <Input
            Value={pollState.PollName}
            Label="Poll Name"
            Type="text"
            OnChange={(newValue) => {
              updatePollState({
                ...pollState,
                PollName: newValue,
              });
            }}
          />
          <Input
            Value={pollState.PollDescription}
            Label="Poll Description"
            Type="text"
            OnChange={(newValue) => {
              updatePollState({
                ...pollState,
                PollDescription: newValue,
              });
            }}
          />
          <Input
            Value={pollState.DateExpire}
            Label="Date To Expire"
            Type="date"
            Min={tomorrow}
            Max={hundred}
            OnChange={(newValue) => {
              updatePollState({
                ...pollState,
                DateExpire: newValue,
              });
            }}
          />
          <MessageBoolean
            Value={pollState.PublicCanAdd}
            BooleanLabels={["Yes", "No"]}
            Label="Public Can Add Options"
            Message="Can any user add an option to this poll?"
            OnChange={(newValue) => {
              updatePollState({
                ...pollState,
                PublicCanAdd: newValue,
              });
            }}
          />
          <FormFooter
            OnCancel={() => routerHistory.goBack()}
            OnSubmit={() => {
              const { PollName, PollDescription, DateExpire } = pollState;
              if (
                PollName.length &&
                PollDescription.length &&
                DateExpire.length
              ) {
                // We are good to go
                toast
                  .promise(
                    updatePoll({
                      DateExpire: pollState.DateExpire,
                      PollDescription: pollState.PollDescription,
                      PollName: pollState.PollName,
                      PublicCanAdd: pollState.PublicCanAdd,
                      Slug: pollState.Slug,
                      UserID: pollState.UserID,
                    }),
                    {
                      loading: "Editing The Poll...",
                      success: "Poll Modified!",
                      error: "An error has occurred with this poll.",
                    }
                  )
                  .then(() => routerHistory.push(`/p?s=${pollState.Slug}`));
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
