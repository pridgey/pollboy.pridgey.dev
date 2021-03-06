import React, { ReactNode } from "react";
import { createPortal } from "react-dom";
import { StyledElement, StyleWrapper } from "@pridgey/afterburner";
import { Button, Card, FlexContainer } from "./../";
import { getTheme } from "./../../utilities";

type PollModalProps = {
  children: ReactNode;
  OnSubmit: () => void;
  OnCancel: () => void;
  SubmitButtonOverride?: string;
  CancelButtonOverride?: string;
};

export const PollModal = ({
  children,
  OnSubmit,
  OnCancel,
  SubmitButtonOverride = "Submit",
  CancelButtonOverride = "Cancel",
}: PollModalProps) => {
  const StyledModalBG = StyledElement("div", {
    position: "fixed",
    top: "0px",
    bottom: "0px",
    left: "0px",
    right: "0px",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Mukta', sans-serif",
    fontSize: "20px",
  });

  const StyledModal = StyledElement("div", {
    display: "grid",
    gridTemplateRows: "min-content min-content",
    gridTemplateColumns: "min-content",
    gap: "15px",
  });

  return createPortal(
    <StyleWrapper Theme={getTheme()}>
      <StyledModalBG>
        <Card>
          <StyledModal>
            <>
              {children}
              <FlexContainer JustifyContent="flex-end">
                <Button OnClick={() => OnCancel()}>
                  {CancelButtonOverride}
                </Button>
                <Button OnClick={() => OnSubmit()}>
                  {SubmitButtonOverride}
                </Button>
              </FlexContainer>
            </>
          </StyledModal>
        </Card>
      </StyledModalBG>
    </StyleWrapper>,
    document.body
  );
};
