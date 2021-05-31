import { ChangeEvent } from "react";
import { InputLabel, StyledInput } from "./Input.styles";
import { convertDateToMinMax } from "./Input.functions";

type InputProps = {
  Label: string;
  Max?: Date;
  Min?: Date;
  Type: "text" | "date";
  OnChange: (newValue: string) => void;
};

export const Input = ({ Label, Type, Max, Min, OnChange }: InputProps) => (
  <InputLabel>
    {Label}
    <StyledInput
      type={Type}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        OnChange(event.target.value)
      }
      max={convertDateToMinMax(Max)}
      min={convertDateToMinMax(Min)}
    />
  </InputLabel>
);
