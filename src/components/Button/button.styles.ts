import styled from "styled-components";

export const StyledButton = styled.button<{
  Color: string;
  BackgroundColor: string;
  FontSize: number;
  Padding: number | number[];
  Margin: number | number[];
}>`
  border: 0px;
  background-color: ${(p) => p.BackgroundColor};
  font-size: ${(p) => p.FontSize}rem;
  font-weight: 800;
  cursor: pointer;
  color: ${(p) => p.Color};
  text-transform: uppercase;
  margin: ${(p) =>
    Array.isArray(p.Margin) ? p.Margin.join("rem ") : p.Margin}rem;
  padding: ${(p) =>
    Array.isArray(p.Padding) ? p.Padding.join("rem ") : p.Padding}rem;
  box-sizing: border-box;
  border-radius: 16px;
  line-height: 0px;

  &:hover {
    border: 2px solid ${(p) => p.Color};
  }

  & svg {
    font-size: ${(p) => p.FontSize}rem;
  }

  @media screen and (max-width: 992px) {
    &:hover {
      border: 0px;
    }
  }
`;
