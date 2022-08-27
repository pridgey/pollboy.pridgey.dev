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
import { useSupabase, generateSlug } from "./../../utilities";
import toast from "react-hot-toast";

export const CreatePoll = () => {
  const today = new Date();
  const tomorrow = new Date(today.valueOf());
  tomorrow.setDate(tomorrow.getDate() + 1);
  const hundred = new Date(today.valueOf());
  hundred.setDate(hundred.getDate() + 100);

  const {
    user: { id: userID },
    supabase,
  } = useSupabase();

  // The state of the poll
  const [newPoll, updateNewPoll] = useState<Poll>({
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

  // Grab router history for route updates
  const routerHistory = useHistory();

  return (
    <StyledCreatePoll>
      <SandwichCard Poll={newPoll} DisplayMode={true} />
      <Input
        Label="Poll Name"
        Type="text"
        OnChange={(newValue) => {
          updateNewPoll({
            ...newPoll,
            poll_name: newValue,
          });
        }}
      />
      <Input
        Label="Poll Description"
        Type="text"
        OnChange={(newValue) => {
          updateNewPoll({
            ...newPoll,
            poll_desc: newValue,
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
            expire_at: new Date(newValue).toISOString(),
          });
        }}
      />
      <MessageBoolean
        Value={newPoll.public_can_add}
        BooleanLabels={["Yes", "No"]}
        Label="Public Can Add Options"
        Message="Can any user add an option to this poll?"
        OnChange={(newValue) => {
          updateNewPoll({
            ...newPoll,
            public_can_add: newValue,
          });
        }}
      />
      <MessageBoolean
        Value={newPoll.multivote}
        BooleanLabels={["Yes", "No"]}
        Label="Multi Vote"
        Message="Can Users vote for multiple options?"
        OnChange={(newValue) => {
          updateNewPoll({
            ...newPoll,
            multivote: newValue,
          });
        }}
      />
      <FormFooter
        OnCancel={() => routerHistory.goBack()}
        OnSubmit={() => {
          const { poll_name, poll_desc, expire_at } = newPoll;
          if (poll_name.length && poll_desc.length && expire_at.length) {
            // We are good to go
            const newSlug = generateSlug();
            const pollToCreate = {
              ...newPoll,
              created_at: new Date().toISOString(),
              slug: newSlug,
            };

            const createPoll = new Promise((resolve) =>
              supabase
                .from("poll")
                .insert([pollToCreate])
                .then(() => resolve(true))
            );

            toast
              .promise(createPoll, {
                loading: "Creating The Poll...",
                success: "Poll Created!",
                error: "An error has occurred with this poll.",
              })
              .then(() => routerHistory.push(`/p?s=${newSlug}`));
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
