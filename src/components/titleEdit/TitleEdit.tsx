import { useState } from "react";
import { PollInput, FlexContainer, EditIcon, PollTitle } from "./../";

type TitleEditProps = {
  UsersPoll: boolean;
  OnChange: (newTitle: string) => void;
  Text: string;
};

export const TitleEdit = ({ UsersPoll, OnChange, Text }: TitleEditProps) => {
  const [editMode, setEditMode] = useState(false);

  if (editMode) {
    return (
      <PollInput
        AutoFocus={true}
        Placeholder="Make a New Title"
        Default={Text}
        OnSubmit={(newTitleString: string) => OnChange(newTitleString)}
      />
    );
  } else {
    return (
      <FlexContainer JustifyContent="flex-start">
        <PollTitle>{Text}</PollTitle>
        {UsersPoll && (
          <EditIcon
            Width="30px"
            Height="30px"
            OnClick={() => setEditMode(true)}
          />
        )}
      </FlexContainer>
    );
  }
};
