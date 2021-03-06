import React, { ReactNode } from "react";
import { StyledElement } from "@pridgey/afterburner";

type GridAreaProps = {
  Area: string;
  Overflow?: "auto" | "hidden" | "scroll";
  children: ReactNode;
};

export const GridArea = ({
  Area,
  Overflow = "hidden",
  children,
}: GridAreaProps) => {
  const StyledGridArea = StyledElement("div", {
    gridArea: Area,
    width: "100%",
    overflowY: Overflow,
  });

  return <StyledGridArea>{children}</StyledGridArea>;
};
