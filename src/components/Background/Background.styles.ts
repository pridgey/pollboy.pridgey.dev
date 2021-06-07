import styled, { css } from "styled-components";

const Knockout = css`
  & p {
    color: black;
    mix-blend-mode: screen;
    background-color: #fff;
    font-size: 100rem;
    width: 100%;
    height: 100%;
    font-family: "Pattaya", Helvetica, Gill-sans, sans-serif;
    margin: 0px;
  }
`;

const Childless = css`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
`;

export const BackgroundGradient = styled.div<{
  angle: number;
  hslArray: string[];
  duration: number;
  positionsArray: string[];
  HasChildren: boolean;
}>`
  @keyframes flow {
    ${(p) => p.positionsArray.join(" ")}
  }

  ${(p) => (p.HasChildren ? Knockout : Childless)}
  background: ${(p) =>
    `linear-gradient(${p.angle}deg, ${p.hslArray.join(", ")})`};
  background-size: 600% 600%;
  animation: flow ${(p) => p.duration}s ease infinite;
  align-items: flex-start;
  overflow-y: hidden;
`;
