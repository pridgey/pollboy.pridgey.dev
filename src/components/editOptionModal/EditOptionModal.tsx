import { useState } from "react";
import { PollModal, PollInput } from "./../";

type EditOptionModalProps = {
  OnConfirm: (newText: string) => void;
  OnCancel: () => void;
};

export const EditOptionModal = ({
  OnConfirm,
  OnCancel,
}: EditOptionModalProps) => {
  const [newValue, updateNewValue] = useState("");

  return (
    <PollModal
      OnCancel={() => OnCancel()}
      OnSubmit={() => OnConfirm(newValue)}
      SubmitButtonOverride="Update"
    >
      <PollInput
        Placeholder="Edit this Option"
        OnSubmit={() => OnConfirm(newValue)}
        Value={newValue}
        OnChange={(newValueString: string) => updateNewValue(newValueString)}
      />
    </PollModal>
  );
};
