import React, { ReactNode } from "react";
import { StyledElement } from "@pridgey/afterburner";

type FlexContainerProps = {
  Direction?: "row" | "column";
  AlignItems?:
    | "baseline"
    | "center"
    | "end"
    | "flex-end"
    | "flex-start"
    | "unset";
  JustifyContent?:
    | "center"
    | "end"
    | "flex-end"
    | "flex-start"
    | "space-around"
    | "space-between"
    | "space-evenly"
    | "unset";
  children: ReactNode;
  Wrap?: "nowrap" | "wrap";
};

export const FlexContainer = ({
  Direction = "row",
  AlignItems = "center",
  JustifyContent = "center",
  Wrap = "nowrap",
  children,
}: FlexContainerProps) => {
  const StyledFlexContainer = StyledElement("div", {
    display: "flex",
    flexDirection: Direction,
    alignItems: AlignItems,
    justifyContent: JustifyContent,
    flexWrap: Wrap,
    width: "100%",
  });

  return <StyledFlexContainer>{children}</StyledFlexContainer>;
};
