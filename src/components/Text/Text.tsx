import { ReactNode } from "react";
import { StyledText } from "./Text.styles";

type TextProps = {
  FontSize: number;
  FontWeight?: number;
  TextAlign?: "left" | "right" | "center";
  children: ReactNode;
};

export const Text = ({
  FontSize,
  FontWeight = 400,
  TextAlign = "left",
  children,
}: TextProps) => (
  <StyledText FontSize={FontSize} FontWeight={FontWeight} TextAlign={TextAlign}>
    {children}
  </StyledText>
);
