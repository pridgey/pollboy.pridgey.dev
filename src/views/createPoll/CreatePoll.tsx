import { Input } from "./../../components";
import { StyledCreatePoll } from "./CreatePoll.styles";

export const CreatePoll = () => {
  const today = new Date();
  const tomorrow = new Date(today.valueOf());
  tomorrow.setDate(tomorrow.getDate() + 1);
  const hundred = new Date(today.valueOf());
  hundred.setDate(hundred.getDate() + 100);

  return (
    <StyledCreatePoll>
      <Input
        Label="Poll Name"
        Type="text"
        OnChange={(newValue) => console.log(newValue)}
      />
      <Input
        Label="Poll Description"
        Type="text"
        OnChange={(newValue) => console.log(newValue)}
      />
      <Input
        Label="Date To Expire"
        Type="date"
        Min={tomorrow}
        Max={hundred}
        OnChange={(newValue) => console.log(newValue)}
      />
    </StyledCreatePoll>
  );
};
