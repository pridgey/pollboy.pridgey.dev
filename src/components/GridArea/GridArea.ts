import styled from "styled-components";

export const GridArea = styled.div<{
  Area: string;
  AlignSelf?: string;
  JustifySelf?: string;
}>`
  grid-area: ${(p) => p.Area};
  align-self: ${(p) => p.AlignSelf};
  justify-self: ${(p) => p.JustifySelf};
`;
