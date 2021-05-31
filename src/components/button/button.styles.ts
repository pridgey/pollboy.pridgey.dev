import styled from "styled-components";

export const StyledButton = styled.button<{ FontSize: number }>`
  border: 0px;
  background-color: transparent;
  font-size: ${(p) => p.FontSize}rem;
  font-weight: 800;
  cursor: pointer;
  color: #5bc0eb;
  text-transform: uppercase;
  margin: 15px 0px;
  padding: 15px;
  box-sizing: border-box;
  border-radius: 16px;

  &:hover {
    border: 2px solid #5bc0eb;
  }
`;
