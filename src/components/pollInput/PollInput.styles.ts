import styled from "styled-components";

export const InputControl = styled.input`
  width: 100%;
  font-size: 25px;
  font-family: "Mukta", sans-serif;
  padding: 10px 15px;
  box-sizing: border-box;
  border: 0px;
  border-radius: 12px;
  background-color: var(--background);
  color: var(--foreground);

  &:focus {
    outline: 0px;
    border: 2px solid var(--green);
  }
`;
