import { ChangeEvent, useState, useEffect } from "react";
import { InputLabel, StyledInput } from "./Input.styles";
import { convertDateToMinMax } from "./Input.functions";

type InputProps = {
  Label: string;
  Max?: Date;
  Min?: Date;
  Type: "text" | "date";
  Value?: string;
  OnChange: (newValue: string) => void;
};

export const Input = ({
  Label,
  Type,
  Max,
  Min,
  Value,
  OnChange,
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
        value={inputValue}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setInputValue(event.target.value);
          OnChange(event.target.value);
        }}
        max={convertDateToMinMax(Max)}
        min={convertDateToMinMax(Min)}
      />
    </InputLabel>
  );
};
