import styled from "styled-components";

export const PollInputContainer = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
`;

export const InputControl = styled.input`
  width: 100%;
  font-size: 25px;
  font-family: "Montserrat", sans-serif;
  padding: 15px 10px;
  box-sizing: border-box;
  border-radius: 12px;
  margin: 10px 0px;
  background-color: ${(props) => props.theme.getColor("white")};
`;

export const PollInputSubmit = styled.button`
  border-radius: 12px;
  background-color: ${(props) => props.theme.getColor("green")};
  padding: 5px 10px;
  box-sizing: border-box;
  font-family: "Mukta", sans-serif;
  font-weight: 600;
  font-size: 20px;
  cursor: pointer;
  border: 0px;
  white-space: nowrap;
  text-transform: uppercase;
  color: white;
`;
