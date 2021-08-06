import styled from "styled-components";

export const ContentText = styled.button`
  border-radius: 13px;
  background-color: #fff;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border: 0px;
  width: 100%;
`;

export const Icons = styled.div`
  border-radius: 13px;
  background-color: #fff;
  padding: 10px;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0px 15px;
  align-items: center;
  justify-content: flex-start;
`;

export const DeleteModalContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content min-content;
  grid-gap: 15px 0px;
`;

export const Sandwich = styled.div<{ Angle: number; Colors: string[] }>`
  width: 100%;
  border: 0px;
  cursor: pointer;
  background: #000;
  background: linear-gradient(
    ${(p) => p.Angle}deg,
    ${(p) => p.Colors.join(", ")}
  );
  transition: all 0.3s;
  border-radius: 13px;
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: min-content 1fr;
  grid-template-areas: "title icons" "desc desc";
  grid-gap: 15px;
  padding: 15px;
  box-sizing: border-box;
`;
