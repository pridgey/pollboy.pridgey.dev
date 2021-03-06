import React, { ReactNode } from "react";
import { StyledElement } from "@pridgey/afterburner";

type ButtonProps = {
  OnClick: () => void;
  children: ReactNode;
  HoverColor?: string;
};

export const Button = ({
  OnClick,
  HoverColor = "--blue",
  children,
}: ButtonProps) => {
  const StyledButton = StyledElement("button", {
    standard: {
      border: "0px",
      backgroundColor: "transparent",
      fontSize: "20px",
      fontFamily: "'Mukta', sans-serif",
      fontWeight: 600,
      cursor: "pointer",
      color: "--foreground",
      textTransform: "uppercase",
      margin: "0px 15px",
    },
    hover: {
      color: HoverColor,
    },
  });

  return <StyledButton onClick={() => OnClick()}>{children}</StyledButton>;
};
