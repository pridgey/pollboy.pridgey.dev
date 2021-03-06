import React, { ReactNode } from "react";
import { StyledElement } from "@pridgey/afterburner";

type CardProps = {
  Margin?: string;
  children: ReactNode;
};

export const Card = ({ Margin = "0px", children }: CardProps) => {
  const StyledCard = StyledElement("div", {
    backgroundColor: "--background",
    color: "--foreground",
    borderRadius: "20px",
    padding: "30px",
    margin: Margin,
  });

  return <StyledCard>{children}</StyledCard>;
};
