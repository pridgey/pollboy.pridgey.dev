import { ChangeEvent, KeyboardEvent, useState, useEffect } from "react";
import { InputControl } from "./PollInput.styles";

type PollInputProps = {
  AutoFocus?: boolean;
  Default?: string;
  Placeholder: string;
  Value?: string;
  OnSubmit: (newOption: string) => void;
  OnChange?: (newOption: string) => void;
};

export const PollInput = ({
  AutoFocus,
  Default,
  Placeholder,
  Value,
  OnSubmit,
  OnChange,
}: PollInputProps) => {
  const [inputValue, updateInputValue] = useState("");

  useEffect(() => {
    if (Value) {
      updateInputValue(Value);
    }
  }, [Value]);

  return (
    <InputControl
      type="text"
      defaultValue={Default}
      placeholder={Placeholder}
      value={inputValue}
      autoFocus={AutoFocus || (Value !== null && !!OnChange)}
      onKeyUp={(e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          e.preventDefault();
          OnSubmit(inputValue);
          updateInputValue("");
        }
      }}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        updateInputValue(e.currentTarget.value);
        if (Value !== null && OnChange) {
          OnChange(e.currentTarget.value);
        }
      }}
    />
  );
};
