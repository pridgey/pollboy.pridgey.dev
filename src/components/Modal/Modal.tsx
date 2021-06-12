import { ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  ButtonsContainer,
  ModalBackdrop,
  ModalContainer,
} from "./Modal.styles";
import { Button, GridArea } from "./../";

type ModalProps = {
  OnSubmit: () => void;
  OnCancel?: () => void;
  SubmitLabel: string;
  SubmitButtonColor?: string;
  CancelLabel?: string;
  children: ReactNode;
};

export const Modal = ({
  OnSubmit,
  OnCancel,
  SubmitLabel,
  SubmitButtonColor,
  CancelLabel = "Cancel",
  children,
}: ModalProps) => {
  return createPortal(
    <ModalBackdrop>
      <ModalContainer>
        <GridArea Area="body">{children}</GridArea>
        <GridArea Area="buttons">
          <ButtonsContainer>
            {OnCancel && (
              <Button OnClick={() => OnCancel()} Color="#000">
                {CancelLabel}
              </Button>
            )}
            <Button OnClick={() => OnSubmit()} Color={SubmitButtonColor}>
              {SubmitLabel}
            </Button>
          </ButtonsContainer>
        </GridArea>
      </ModalContainer>
    </ModalBackdrop>,
    document.body
  );
};
