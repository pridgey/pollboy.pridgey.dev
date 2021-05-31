import { ReactNode } from "react";
import { StyledButton } from "./button.styles";

type ButtonProps = {
  OnClick: () => void;
  children: ReactNode;
  FontSize?: number;
};

export const Button = ({ OnClick, FontSize = 20, children }: ButtonProps) => (
  <StyledButton onClick={() => OnClick()} FontSize={FontSize}>
    {children}
  </StyledButton>
);
