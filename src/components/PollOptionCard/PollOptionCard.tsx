import { useState } from "react";
import {
  RiCheckboxBlankLine,
  RiCheckboxFill,
  RiTrophyFill,
  RiDeleteBin6Line,
  RiEditBoxFill,
} from "react-icons/ri";
import {
  DeleteModalContent,
  PollOptionCardContainer,
  StyledPollOptionCard,
} from "./PollOptionCard.styles";
import { Button, EditOptionForm, GridArea, Modal, Text } from "./../";
import toast from "react-hot-toast";
import { usePollAPI } from "./../../utilities";
import { PollOption } from "./../../types";

type PollOptionCardProps = {
  CanEdit: boolean;
  IsChecked: boolean;
  PollOption: PollOption;
  Place: number;
  OnChange: () => void;
  OnDelete: () => void;
  OnEdit: (PollOption: PollOption) => void;
};

export const PollOptionCard = ({
  CanEdit,
  IsChecked,
  Place,
  PollOption,
  OnChange,
  OnDelete,
  OnEdit,
}: PollOptionCardProps) => {
  const [isChecked, setIsChecked] = useState(IsChecked);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Poll API functions
  const { deletePollOption, updatePollOption } = usePollAPI();

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
                {PollOption.option_name}
              </Text>
            </GridArea>
            <GridArea Area="description">
              <Text FontSize={20} FontWeight={600} TextAlign="left">
                {PollOption.option_desc}
              </Text>
            </GridArea>
          </StyledPollOptionCard>
        </GridArea>
        {CanEdit && (
          <>
            <GridArea Area="edit" AlignSelf="center" JustifySelf="center">
              <Button
                OnClick={() => setShowEditModal(true)}
                Padding={0}
                Margin={0}
              >
                <RiEditBoxFill />
              </Button>
            </GridArea>
            <GridArea Area="delete" AlignSelf="center" JustifySelf="center">
              <Button
                OnClick={() => setShowDeleteModal(true)}
                Padding={0}
                Margin={0}
                Color="#d00000"
              >
                <RiDeleteBin6Line />
              </Button>
            </GridArea>
          </>
        )}
        {showDeleteModal && (
          <Modal
            OnSubmit={() => {
              setShowDeleteModal(false);
              if (PollOption.id) {
                toast
                  .promise(deletePollOption(PollOption.id), {
                    loading: "Deleting The Poll Option...",
                    success: "Poll Option was deleted :(",
                    error:
                      "An error has occurred trying to delete this Poll Option.",
                  })
                  .then(() => {
                    OnDelete();
                  });
              }
            }}
            OnCancel={() => setShowDeleteModal(false)}
            SubmitButtonColor="#d00000"
            SubmitLabel="Delete"
          >
            <DeleteModalContent>
              <Text FontSize={25} FontWeight={800}>
                Delete this Poll Option?
              </Text>
              <Text FontSize={19}>
                Are you sure you want to delete this poll option? You cannot
                undo this action.
              </Text>
            </DeleteModalContent>
          </Modal>
        )}
        {showEditModal && (
          <EditOptionForm
            PollOption={PollOption}
            OnCancel={() => setShowEditModal(false)}
            OnSave={(EditedPollOption: PollOption) => {
              toast.promise(updatePollOption(EditedPollOption), {
                loading: "Updating the Poll Option...",
                success: "Option successfully updated",
                error:
                  "An error has occurred trying to update this Poll Option",
              });
              OnEdit(EditedPollOption);
              setShowEditModal(false);
            }}
          />
        )}
      </>
    </PollOptionCardContainer>
  );
};
