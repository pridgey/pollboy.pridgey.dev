import styled from "styled-components";

export const StyledBackground = styled.div<{
  angle: number;
  hslArray: string[];
  duration: number;
  positionsArray: string[];
}>`
  @keyframes flow {
    ${(p) => p.positionsArray.join(" ")}
  }

  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${(p) =>
    `linear-gradient(${p.angle}deg, ${p.hslArray.join(", ")})`};
  background-size: 600% 600%;
  animation: flow ${(p) => p.duration}s ease infinite;
  display: flex;
  align-items: flex-start;
  overflow-y: hidden;
`;

export const StyledMain = styled.main`
  @keyframes growin {
    from {
      top: 100vh;
    }
    to {
      top: 10vh;
    }
  }

  position: fixed;
  top: 10vh;
  bottom: 0;
  left: 0;
  right: 0;
  animation: growin 1s ease;
  background: transparent;
  border-top: 2px solid #5bc0eb;
  border-radius: 26px 26px 0px 0px;
`;
