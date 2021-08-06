import styled from "styled-components";

export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContainer = styled.div`
  width: 400px;
  border-radius: 13px;
  background-color: #fff;
  padding: 15px 15px 0px 15px;
  display: grid;
  grid-template-columns: 1fr min-content;
  grid-template-rows: 1fr min-content;
  grid-template-areas: "body body" "buttons buttons";
  box-sizing: border-box;

  @media screen and (max-width: 992px) {
    width: 95vw;
  }
`;

export const ButtonsContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: min-content min-content;
  grid-template-rows: min-content;
  justify-content: flex-end;
`;
