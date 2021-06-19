import styled from "styled-components";

export const StyledPollOptionCard = styled.button`
  border: 0px;
  background-color: #fff;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  display: grid;
  grid-template-columns: min-content 1fr;
  grid-template-rows: min-content min-content;
  grid-template-areas: "check title" "trophey description";
  grid-gap: 5px 15px;
  padding: 15px;
  box-sizing: border-box;
  border-radius: 6px;
  width: 100%;
  margin: 15px 0px;
`;
