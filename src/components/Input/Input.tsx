import { ChangeEvent, KeyboardEvent, useState, useEffect } from "react";
import { InputLabel, StyledInput } from "./Input.styles";
import { convertDateToMinMax } from "./Input.functions";

type InputProps = {
  Label: string;
  Max?: Date;
  Min?: Date;
  Placeholder?: string;
  Type: "text" | "date";
  Value?: string;
  OnChange: (newValue: string) => void;
  OnEnter?: (newValue: string) => boolean;
};

export const Input = ({
  Label,
  Max,
  Min,
  Placeholder,
  Type,
  Value,
  OnChange,
  OnEnter,
}: InputProps) => {
  const [inputValue, setInputValue] = useState(Value);

  useEffect(() => {
    setInputValue(Value);
  }, [Value]);

  return (
    <InputLabel>
      {Label}
      <StyledInput
        type={Type}
        placeholder={Placeholder}
        value={inputValue}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setInputValue(event.target.value);
          OnChange(event.target.value);
        }}
        onKeyUp={(event: KeyboardEvent<HTMLInputElement>) => {
          if (OnEnter && event.key === "Enter") {
            event.preventDefault();
            if (OnEnter(inputValue ?? "")) {
              setInputValue("");
            }
          }
        }}
        max={convertDateToMinMax(Max)}
        min={convertDateToMinMax(Min)}
      />
    </InputLabel>
  );
};
