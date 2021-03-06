import React, { ReactNode } from "react";
import { StyledElement } from "@pridgey/afterburner";
import { GridArea, Card } from "./../";

type HeaderProps = {
  Title: ReactNode;
  Actions: ReactNode;
};

export const Header = ({ Title, Actions }: HeaderProps) => {
  const StyledHeader = StyledElement("main", {
    standard: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gridTemplateRows: "min-content min-content",
      gridTemplateAreas: `"title" "buttons"`,
    },
    "@media (max-width: 1000px)": {
      width: "100%",
    },
  });

  return (
    <Card>
      <StyledHeader>
        <GridArea Area="title">{Title}</GridArea>
        <GridArea Area="buttons">{Actions}</GridArea>
      </StyledHeader>
    </Card>
  );
};
