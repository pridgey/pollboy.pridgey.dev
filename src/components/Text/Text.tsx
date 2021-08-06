import { ReactNode, Ref } from "react";
import { StyledText } from "./Text.styles";

type TextProps = {
  FontSize: number;
  FontWeight?: number;
  Ref?: Ref<HTMLDivElement>;
  TextAlign?: "left" | "right" | "center";
  children: ReactNode;
};

export const Text = ({
  FontSize,
  FontWeight = 400,
  TextAlign = "left",
  Ref,
  children,
}: TextProps) => (
  <StyledText
    ref={Ref}
    FontSize={FontSize}
    FontWeight={FontWeight}
    TextAlign={TextAlign}
  >
    {children}
  </StyledText>
);
