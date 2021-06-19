import styled from "styled-components";

export const StyledPollView = styled.div`
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content min-content 1fr;
  grid-template-areas: "title" "add" "options";
  grid-gap: 15px 0px;

  @media screen and (max-width: 992px) {
    height: 100%;
    justify-content: flex-start;
  }
`;
