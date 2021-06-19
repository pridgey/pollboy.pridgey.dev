import { useState } from "react";
import {
  RiCheckboxBlankLine,
  RiCheckboxFill,
  RiTrophyFill,
} from "react-icons/ri";
import { StyledPollOptionCard } from "./PollOptionCard.styles";
import { GridArea, Text } from "./../";

type PollOptionCardProps = {
  IsChecked: boolean;
  OptionName: string;
  OptionDescription: string;
  Place: number;
  OnChange: () => void;
};

export const PollOptionCard = ({
  IsChecked,
  OptionName,
  OptionDescription,
  Place,
  OnChange,
}: PollOptionCardProps) => {
  const [isChecked, setIsChecked] = useState(IsChecked);

  return (
    <StyledPollOptionCard
      onClick={() => {
        setIsChecked(!isChecked);
        OnChange();
      }}
    >
      <GridArea Area="check">
        <Text FontSize={40}>
          {isChecked ? <RiCheckboxFill /> : <RiCheckboxBlankLine />}
        </Text>
      </GridArea>
      <GridArea Area="trophey" JustifySelf="center">
        {Place <= 2 && (
          <Text FontSize={30}>
            <RiTrophyFill
              color={Place === 0 ? "gold" : Place === 1 ? "silver" : "orange"}
            />
          </Text>
        )}
      </GridArea>
      <GridArea Area="title">
        <Text FontSize={30} FontWeight={800} TextAlign="left">
          {OptionName}
        </Text>
      </GridArea>
      <GridArea Area="description">
        <Text FontSize={20} FontWeight={600} TextAlign="left">
          {OptionDescription}
        </Text>
      </GridArea>
    </StyledPollOptionCard>
  );
};
