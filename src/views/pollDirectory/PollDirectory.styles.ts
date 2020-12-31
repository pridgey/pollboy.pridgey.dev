import styled from "styled-components";

export const DirectoryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const PollBlock = styled.button<{
  ColorOne: string;
  ColorTwo: string;
  Direction: number;
}>`
  display: grid;
  grid-template-columns: 150px;
  grid-template-rows: 150px min-content;
  row-gap: 15px;
  border-radius: 12px;
  background-color: ${(props) => props.ColorOne};
  background-image: linear-gradient(
    ${(props) => props.Direction}deg,
    ${(props) => props.ColorOne} 0%,
    ${(props) => props.ColorTwo} 100%
  );
  border: 0px;
  cursor: pointer;
  padding: 10px;
  box-sizing: border-box;
  margin: 10px;
`;

export const PollImage = styled.img`
  border-radius: 12px;
  width: 150px;
  height: 150px;
  background-color: ${(props) => props.theme.getColor("blue")};
`;

export const PollTitle = styled.div`
  color: white;
  font-size: 20px;
  font-family: "Montserrat", sans-serif;
  text-align: center;
  width: 100%;
`;
