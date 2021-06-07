import styled from "styled-components";

export const FormFooterContainer = styled.footer`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: min-content;
  border: 1px solid #5bc0eb;
`;

const ButtonBase = styled.button`
  border: 0px;
  width: 100%;
  height: 100%;
  font-size: 20rem;
  text-transform: uppercase;
  font-weight: 700;
  padding: 15px;
`;

export const CancelButton = styled(ButtonBase)`
  color: #5bc0eb;
  background-color: transparent;
`;

export const SubmitButton = styled(ButtonBase)`
  color: #fff;
  background-color: #5bc0eb;
`;
