import React, { ReactNode } from "react";
import { StyledElement } from "@pridgey/afterburner";
import { GridArea } from "./../";

type PollLayoutProps = {
  Header: ReactNode;
  Input: ReactNode;
  Options: ReactNode;
};

export const PollLayout = ({ Header, Input, Options }: PollLayoutProps) => {
  const StyledPollLayout = StyledElement("main", {
    standard: {
      width: "80%",
      display: "grid",
      gridTemplateColumns: "1fr",
      gridTemplateRows: "min-content min-content 1fr",
      gridTemplateAreas: `"header" "input" "options"`,
      gap: "30px 0px",
    },
    "@media (max-width: 1000px)": {
      width: "100%",
    },
  });

  return (
    <StyledPollLayout>
      <GridArea Area="header">{Header}</GridArea>
      <GridArea Area="input">{Input}</GridArea>
      <GridArea Area="options">{Options}</GridArea>
    </StyledPollLayout>
  );
};
