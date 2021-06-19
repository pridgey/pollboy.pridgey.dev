import { useState, useEffect, ChangeEvent } from "react";
import { StyledTextArea, TextAreaLabel } from "./TextArea.styles";

type TextAreaProps = {
  Label: string;
  Placeholder?: string;
  Value?: string;
  OnChange: (newValue: string) => void;
};

export const TextArea = ({
  Label,
  Placeholder,
  Value,
  OnChange,
}: TextAreaProps) => {
  const [textAreaValue, setTextAreaValue] = useState(Value);

  useEffect(() => {
    setTextAreaValue(Value);
  }, [Value]);

  return (
    <TextAreaLabel>
      {Label}
      <StyledTextArea
        placeholder={Placeholder}
        value={textAreaValue}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
          const newValue = event.target.value;
          setTextAreaValue(newValue);
          OnChange(newValue);
        }}
      />
    </TextAreaLabel>
  );
};
