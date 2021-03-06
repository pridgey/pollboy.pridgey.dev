import { PollModal } from "./../";

type ConfirmDeleteModalProps = {
  OnConfirm: () => void;
  OnCancel: () => void;
};

export const ConfirmDeleteModal = ({
  OnConfirm,
  OnCancel,
}: ConfirmDeleteModalProps) => {
  return (
    <PollModal
      OnCancel={() => OnCancel()}
      OnSubmit={() => OnConfirm()}
      SubmitButtonOverride="Delete"
    >
      Are you sure you want to delete this{" "}
    </PollModal>
  );
};
