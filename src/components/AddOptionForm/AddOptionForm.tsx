import { Input, Modal, Text, TextArea } from "./../";
import { useState, useRef } from "react";
import { FormLayout } from "./AddOptionForm.styles";

type AddOptionFormProps = {
  OnSaveAndClose: (title: string, description: string) => void;
  OnSaveAndMore: (title: string, description: string) => void;
};

export const AddOptionForm = ({
  OnSaveAndClose,
  OnSaveAndMore,
}: AddOptionFormProps) => {
  const [optionTitle, setOptionTitle] = useState("");
  const [optionDescription, setOptionDescription] = useState("");

  const titleRef = useRef(document.createElement("input"));

  return (
    <Modal
      SubmitLabel="All Done"
      CancelLabel="And Another"
      OnSubmit={() => OnSaveAndClose(optionTitle, optionDescription)}
      OnCancel={() => {
        OnSaveAndMore(optionTitle, optionDescription);
        setOptionTitle("");
        setOptionDescription("");
        titleRef?.current?.focus();
      }}
    >
      <FormLayout>
        <Text FontSize={25} FontWeight={800}>
          Add a New Poll Option
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
