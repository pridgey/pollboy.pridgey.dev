import styled from "styled-components";

export const PollOptionCardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr min-content;
  grid-template-rows: 1fr 1fr;
  grid-template-areas: "card edit" "card delete";
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  padding: 15px;
  box-sizing: border-box;
  border-radius: 6px;
  width: 100%;
  margin: 15px 0px;
`;

export const StyledPollOptionCard = styled.button`
  border: 0px;
  background-color: #fff;
  display: grid;
  grid-template-columns: min-content 1fr;
  grid-template-rows: min-content min-content;
  grid-template-areas: "check title" "trophey description";
  grid-gap: 5px 15px;
  width: 100%;
`;

export const DeleteModalContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content min-content;
  grid-gap: 15px 0px;
`;
