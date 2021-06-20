import { useState } from "react";
import {
  RiCheckboxBlankLine,
  RiCheckboxFill,
  RiTrophyFill,
  RiDeleteBin6Line,
  RiEditBoxFill,
} from "react-icons/ri";
import {
  PollOptionCardContainer,
  StyledPollOptionCard,
} from "./PollOptionCard.styles";
import { Button, GridArea, Text } from "./../";

type PollOptionCardProps = {
  CanEdit: boolean;
  IsChecked: boolean;
  OptionName: string;
  OptionDescription: string;
  Place: number;
  OnChange: () => void;
};

export const PollOptionCard = ({
  CanEdit,
  IsChecked,
  OptionName,
  OptionDescription,
  Place,
  OnChange,
}: PollOptionCardProps) => {
  const [isChecked, setIsChecked] = useState(IsChecked);

  return (
    <PollOptionCardContainer>
      <>
        <GridArea Area="card">
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
                    color={
                      Place === 0 ? "gold" : Place === 1 ? "silver" : "orange"
                    }
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
        </GridArea>
        {CanEdit && (
          <>
            <GridArea Area="edit" AlignSelf="center" JustifySelf="center">
              <Button OnClick={() => alert("edit")} Padding={0} Margin={0}>
                <RiEditBoxFill />
              </Button>
            </GridArea>
            <GridArea Area="delete" AlignSelf="center" JustifySelf="center">
              <Button
                OnClick={() => alert("delete")}
                Padding={0}
                Margin={0}
                Color="#d00000"
              >
                <RiDeleteBin6Line />
              </Button>
            </GridArea>
          </>
        )}
      </>
    </PollOptionCardContainer>
  );
};
