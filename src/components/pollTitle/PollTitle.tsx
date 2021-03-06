import React, { ReactNode } from "react";
import { StyledElement } from "@pridgey/afterburner";

type PollTitleProps = {
  children: ReactNode;
  FontSize?: string;
  FontWeight?: number;
  Margin?: string;
};

export const PollTitle = ({
  children,
  FontSize = "80px",
  FontWeight = 800,
  Margin = "0px 15px",
}: PollTitleProps) => {
  const StyledPollTitle = StyledElement("span", {
    fontSize: FontSize,
    fontFamily: "'Mukta', sans-serif",
    fontWeight: FontWeight,
    margin: Margin,
  });

  return <StyledPollTitle>{children}</StyledPollTitle>;
};
