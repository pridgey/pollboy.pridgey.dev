import { Input, Modal, Text, TextArea } from "./../";
import { useState, useRef } from "react";
import { FormLayout } from "./EditOptionForm.styles";
import { PollOption } from "./../../types";

type EditOptionFormProps = {
  PollOption: PollOption;
  OnSave: (PollOption: PollOption) => void;
  OnCancel: () => void;
};

export const EditOptionForm = ({
  PollOption,
  OnSave,
  OnCancel,
}: EditOptionFormProps) => {
  const [optionTitle, setOptionTitle] = useState(PollOption.PollOptionName);
  const [optionDescription, setOptionDescription] = useState(
    PollOption.PollOptionDescription
  );

  const titleRef = useRef(document.createElement("input"));

  return (
    <Modal
      SubmitLabel="Save"
      CancelLabel="Cancel"
      OnSubmit={() =>
        OnSave({
          ...PollOption,
          PollOptionName: optionTitle,
          PollOptionDescription: optionDescription,
        })
      }
      OnCancel={() => OnCancel()}
    >
      <FormLayout>
        <Text FontSize={25} FontWeight={800}>
          Edit This Poll Option
        </Text>
        <Input
          Ref={titleRef}
          Type="text"
          Value={optionTitle}
          Label="Poll Option Name"
          OnChange={(newValue: string) => setOptionTitle(newValue)}
        />
        <TextArea
          Value={optionDescription}
          Label="Poll Option Description"
          OnChange={(newValue: string) => setOptionDescription(newValue)}
        />
      </FormLayout>
    </Modal>
  );
};
