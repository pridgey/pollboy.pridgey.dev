import { StyledElement } from "@pridgey/afterburner";
import {
  Button,
  Card,
  Checkbox,
  GridArea,
  PollTitle,
  FlexContainer,
} from "./../";
import { HiTrash } from "react-icons/hi";
import { AiFillEdit } from "react-icons/ai";

type PollOptionProps = {
  Text: string;
  UserVoted?: boolean;
  UsersPoll?: boolean;
  Votes: number;
  OnClick: () => void;
  OnDeleteClick: () => void;
  OnEditClick: () => void;
};

export const PollOption = ({
  Text,
  UserVoted = false,
  UsersPoll = false,
  Votes,
  OnClick,
  OnDeleteClick,
  OnEditClick,
}: PollOptionProps) => {
  const StyledPollOption = StyledElement("div", {
    borderRadius: "20px",
    display: "grid",
    gridTemplateColumns: "min-content auto min-content",
    gridTemplateRows: "min-content min-content",
    gridTemplateAreas: `"check title options" "check subtitle options"`,
    gap: "0px 15px",
    fontFamily: "'Mukta', sans-serif",
  });

  return (
    <Card Margin="10px">
      <StyledPollOption>
        <GridArea Area="check">
          <Checkbox OnClick={() => OnClick()} IsSelected={UserVoted} />
        </GridArea>
        <GridArea Area="title">
          <PollTitle FontSize="30px" FontWeight={400} Margin="0px">
            {Text}
          </PollTitle>
        </GridArea>
        <GridArea Area="subtitle">Votes: {Votes}</GridArea>
        <GridArea Area="options">
          <FlexContainer Direction="column">
            {UsersPoll && (
              <>
                <Button HoverColor="--red" OnClick={() => OnDeleteClick()}>
                  <HiTrash />
                </Button>
                <Button HoverColor="--green" OnClick={() => OnEditClick()}>
                  <AiFillEdit />
                </Button>
              </>
            )}
          </FlexContainer>
        </GridArea>
      </StyledPollOption>
    </Card>
  );
};
