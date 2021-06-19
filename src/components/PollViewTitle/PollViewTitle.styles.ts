import styled from "styled-components";

export const TextContainer = styled.button`
  border: 0px;
  background-color: transparent;
  cursor: pointer;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content min-content;
`;

export const DescriptionContainer = styled.div<{
  Expanded: boolean;
  Height: number;
}>`
  height: ${(p) => (p.Expanded ? `${p.Height}px` : "65rem")};
  transition: height 0.3s;
  overflow: hidden;
  box-shadow: ${(p) =>
    p.Expanded ? "" : "inset 0px -49px 24px -35px rgba(0,0,0,0.4);"};
  border-radius: 4px;
`;
