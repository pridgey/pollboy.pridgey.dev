import { ChangeEvent, FormEvent, useState } from "react";
import {
  InputControl,
  PollInputContainer,
  PollInputSubmit,
} from "./PollInput.styles";

type PollInputProps = {
  ButtonText: string;
  Placeholder: string;
  OnSubmit: (newOption: string) => void;
};

export const PollInput = ({
  ButtonText,
  Placeholder,
  OnSubmit,
}: PollInputProps) => {
  const [inputValue, updateInputValue] = useState("");

  return (
    <PollInputContainer onSubmit={(e: FormEvent) => e.preventDefault()}>
      <InputControl
        type="text"
        placeholder={Placeholder}
        value={inputValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          updateInputValue(e.currentTarget.value)
        }
      />
      {!!inputValue.length && (
        <PollInputSubmit
          type="submit"
          onClick={() => {
            if (inputValue) {
              OnSubmit(inputValue);
              updateInputValue("");
            }
          }}
        >
          {ButtonText}
        </PollInputSubmit>
      )}
    </PollInputContainer>
  );
};
