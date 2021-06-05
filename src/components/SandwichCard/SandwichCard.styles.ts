import styled from "styled-components";

export const SandwichCardContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 13px;
  background-color: #fff;
  overflow: hidden;
`;

export const SandwichStripesContainer = styled.div<{ Angle: string }>`
  position: absolute;
  top: -100%;
  left: -15%;
  right: -15%;
  bottom: -100%;
  display: flex;
  flex-direction: column;
  transform: rotate(${(p) => p.Angle}deg);
  opacity: 0.6;
`;

export const ContentContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: min-content 1fr;
  grid-template-areas: "title empty" "desc desc";
  grid-gap: 15px;
  padding: 15px;
`;

export const GridArea = styled.div<{ Area: string }>`
  grid-area: ${(p) => p.Area};
`;

export const ContentText = styled.div`
  border-radius: 13px;
  background-color: #fff;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export const SandwichStripe = styled.div<{ Height: number; Color: string }>`
  border-radius: 5px;
  height: ${(p) => p.Height}%;
  background-color: ${(p) => p.Color};
  width: 100%;
`;
