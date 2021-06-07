import styled from "styled-components";

export const StyledCreatePoll = styled.div`
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 992px) {
    height: 100%;
    justify-content: space-between;
  }
`;
