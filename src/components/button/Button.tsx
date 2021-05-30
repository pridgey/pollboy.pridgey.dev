import { ReactNode } from "react";
import { StyledButton } from "./button.styles";

type ButtonProps = {
  OnClick: () => void;
  children: ReactNode;
  HoverColor?: string;
};

export const Button = ({ OnClick, children }: ButtonProps) => (
  <StyledButton onClick={() => OnClick()}>{children}</StyledButton>
);
