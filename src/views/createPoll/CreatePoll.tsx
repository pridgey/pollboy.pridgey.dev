import { useState } from "react";
import { Poll } from "./../../types";
import { Input, SandwichCard } from "./../../components";
import { StyledCreatePoll } from "./CreatePoll.styles";

export const CreatePoll = () => {
  const today = new Date();
  const tomorrow = new Date(today.valueOf());
  tomorrow.setDate(tomorrow.getDate() + 1);
  const hundred = new Date(today.valueOf());
  hundred.setDate(hundred.getDate() + 100);

  const [newPoll, updateNewPoll] = useState<Poll>({
    DateExpire: "",
    PollDescription:
      "Put something here that will really blow the pants off everybody",
    PollName: "Your Brand New Poll",
    PublicCanAdd: false,
    Slug: "",
    UserID: "",
    DateCreated: new Date(),
  });

  console.log(newPoll);

  return (
    <StyledCreatePoll>
      <SandwichCard Poll={newPoll} />
      <Input
        Label="Poll Name"
        Type="text"
        OnChange={(newValue) => {
          const currentPoll = JSON.parse(JSON.stringify(newPoll));
          currentPoll.PollName = newValue;
          updateNewPoll(currentPoll);
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
    </StyledCreatePoll>
  );
};
