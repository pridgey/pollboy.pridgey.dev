import styled from "styled-components";

export const StyledText = styled.div<{
  FontSize: number;
  FontWeight: number;
  TextAlign: "left" | "right" | "center";
}>`
  font-size: ${(p) => p.FontSize}rem;
  font-weight: ${(p) => p.FontWeight};
  text-align: ${(p) => p.TextAlign};
`;
