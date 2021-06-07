import { useState } from "react";
import {
  BooleanButton,
  ComponentWrapper,
  Divider,
  MessageBooleanContainer,
  MessageBooleanLabel,
} from "./MessageBoolean.styles";
import { Text } from "./../Text";

type MessageBooleanProps = {
  BooleanLabels: [string, string];
  Label: string;
  Message: string;
  OnChange: (bool: boolean) => void;
};

export const MessageBoolean = ({
  BooleanLabels,
  Label,
  Message,
  OnChange,
}: MessageBooleanProps) => {
  const [bool, setBool] = useState(false);

  return (
    <ComponentWrapper>
      <MessageBooleanLabel>{Label}</MessageBooleanLabel>
      <MessageBooleanContainer>
        <BooleanButton
          onClick={() => {
            const newVal = !bool;
            setBool(newVal);
            OnChange(newVal);
          }}
        >
          {BooleanLabels[bool ? 0 : 1].toUpperCase()}
        </BooleanButton>
        <Divider />
        <Text FontSize={20}>{Message}</Text>
      </MessageBooleanContainer>
    </ComponentWrapper>
  );
};
