import styled from "styled-components";

export const ComponentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MessageBooleanLabel = styled.div`
  font-size: 18rem;
  font-weight: 600;
  padding: 0px 5px;
`;

export const MessageBooleanContainer = styled.div`
  width: 100%;
  padding: 15px 10px;
  border-radius: 15px;
  border: 1px solid #000;
  box-sizing: border-box;
  background-color: transparent;
  display: grid;
  grid-template-columns: 50px 2px 1fr;
  grid-template-rows: min-content;
  grid-gap: 0px 15px;
`;

export const BooleanButton = styled.button`
  font-size: 20rem;
  border: 0px;
  background-color: transparent;
  color: #5bc0eb;
  font-weight: 700;
  cursor: pointer;
  padding: 0px;
  margin: 0px;
`;

export const Divider = styled.div`
  height: 100%;
  width: 2px;
  background-color: #000;
`;
