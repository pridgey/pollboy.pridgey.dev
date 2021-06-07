import { useState } from "react";
import { Poll } from "./../../types";
import {
  Input,
  FormFooter,
  SandwichCard,
  MessageBoolean,
} from "./../../components";
import { StyledCreatePoll } from "./CreatePoll.styles";
import { useHistory } from "react-router-dom";
import { usePollAPI, useUserID } from "./../../utilities";
import toast from "react-hot-toast";

export const CreatePoll = () => {
  const today = new Date();
  const tomorrow = new Date(today.valueOf());
  tomorrow.setDate(tomorrow.getDate() + 1);
  const hundred = new Date(today.valueOf());
  hundred.setDate(hundred.getDate() + 100);

  const userID = useUserID();

  const [newPoll, updateNewPoll] = useState<Poll>({
    DateExpire: "",
    PollDescription:
      "Put something here that will really blow the pants off everybody",
    PollName: "Your Brand New Poll",
    PublicCanAdd: false,
    Slug: "",
    UserID: userID,
  });

  const routerHistory = useHistory();

  const { createPoll } = usePollAPI();

  return (
    <StyledCreatePoll>
      <SandwichCard Poll={newPoll} />
      <Input
        Label="Poll Name"
        Type="text"
        OnChange={(newValue) => {
          updateNewPoll({
            ...newPoll,
            PollName: newValue,
          });
        }}
      />
      <Input
        Label="Poll Description"
        Type="text"
        OnChange={(newValue) => {
          updateNewPoll({
            ...newPoll,
            PollDescription: newValue,
          });
        }}
      />
      <Input
        Label="Date To Expire"
        Type="date"
        Min={tomorrow}
        Max={hundred}
        OnChange={(newValue) => {
          updateNewPoll({
            ...newPoll,
            DateExpire: newValue,
          });
        }}
      />
      <MessageBoolean
        BooleanLabels={["Yes", "No"]}
        Label="Public Can Add Options"
        Message="Can any user add an option to this poll?"
        OnChange={(newValue) => {
          updateNewPoll({
            ...newPoll,
            PublicCanAdd: newValue,
          });
        }}
      />
      <FormFooter
        OnCancel={() => routerHistory.goBack()}
        OnSubmit={() => {
          const { PollName, PollDescription, DateExpire } = newPoll;
          if (PollName.length && PollDescription.length && DateExpire.length) {
            // We are good to go
            toast
              .promise(createPoll(newPoll), {
                loading: "Creating The Poll...",
                success: "Poll Created!",
                error: "An error has occurred with this poll.",
              })
              .then((slug) => routerHistory.push(`/p?s=${slug}`));
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
    </StyledCreatePoll>
  );
};
