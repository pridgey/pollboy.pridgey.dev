import {
  CancelButton,
  FormFooterContainer,
  SubmitButton,
} from "./FormFooter.styles";

type FormFooterProps = {
  OnSubmit: () => void;
  OnCancel: () => void;
};

export const FormFooter = ({ OnSubmit, OnCancel }: FormFooterProps) => (
  <FormFooterContainer>
    <CancelButton onClick={() => OnCancel()}>Cancel</CancelButton>
    <SubmitButton onClick={() => OnSubmit()}>Submit</SubmitButton>
  </FormFooterContainer>
);
