import { ReactNode } from "react";
import { StyledButton } from "./button.styles";

type ButtonProps = {
  OnClick: () => void;
  children: ReactNode;
  FontSize?: number;
  BackgroundColor?: string;
  Color?: string;
  Padding?: number | number[];
  Margin?: number | number[];
};

export const Button = ({
  OnClick,
  FontSize = 20,
  Padding = 15,
  BackgroundColor = "transparent",
  Color = "#5bc0eb",
  Margin = [15, 0],
  children,
}: ButtonProps) => (
  <StyledButton
    onClick={() => OnClick()}
    FontSize={FontSize}
    Padding={Padding}
    Margin={Margin}
    Color={Color}
    BackgroundColor={BackgroundColor}
  >
    {children}
  </StyledButton>
);
