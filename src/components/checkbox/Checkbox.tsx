import React, { useState, useEffect } from "react";
import { StyledElement } from "@pridgey/afterburner";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";

type CheckboxProps = {
  OnClick: () => void;
  IsSelected: boolean;
};

export const Checkbox = ({ OnClick, IsSelected }: CheckboxProps) => {
  const [isChecked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(IsSelected);
  }, [IsSelected]);

  const StyledCheckbox = StyledElement("button", {
    standard: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "15px",
      fontSize: "30px",
      backgroundColor: "transparent",
      color: "--foreground",
      border: "0px",
      cursor: "pointer",
      borderRadius: "20px",
    },
    hover: {
      color: "--blue",
    },
    focus: {
      outlineWidth: "2px",
      outlineStyle: "solid",
      outlineColor: "--blue",
      outlineOffset: "-2px",
    },
  });

  return (
    <StyledCheckbox
      onClick={() => {
        setChecked(!isChecked);
        OnClick();
      }}
    >
      {isChecked ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />}
    </StyledCheckbox>
  );
};
