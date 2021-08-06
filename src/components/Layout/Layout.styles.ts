import styled from "styled-components";

export const LayoutContainer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const BackgroundGradient = styled.div<{
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

export const LayoutOverlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: grid;
  grid-template-columns: 100vw;
  grid-template-rows: min-content minmax(0, 1fr);
`;

export const LayoutHeader = styled.header`
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  flex-gap: 15px;
  align-content: center;
`;

export const MenuButton = styled.button`
  border: 0px;
  background: transparent;
  font-size: 20rem;
  color: #000;
  cursor: pointer;

  & svg {
    height: 35rem;
    width: 35rem;
  }
`;

export const HeaderLogo = styled.div`
  font-size: 40rem;
  font-family: "Pattaya", Helvetica, Gill-sans, sans-serif;
  color: #000;
`;

export const ContentContainer = styled.div<{ ShowNav: boolean }>`
  position: relative;
  height: 100%;
  left: ${(p) => (p.ShowNav ? "0px" : "-20vw")};
  position: relative;
  width: 120vw;
  display: flex;
  transition: left 0.5s;
  pointer-events: ${(p) => (p.ShowNav ? "none" : "auto")};

  @media screen and (max-width: 992px) {
    left: ${(p) => (p.ShowNav ? "0px" : "-60vw")};
    width: 160vw;
  }
`;

export const NavBreaker = styled.div`
  width: 90%;
  margin: 10px auto;
  height: 2px;
  background-color: #000;
  border-radius: 100%;
`;

export const LayoutNav = styled.nav`
  height: 100%;
  width: 20vw;
  box-sizing: border-box;
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: baseline;
  pointer-events: auto;

  @media screen and (max-width: 992px) {
    width: 60vw;
  }
`;

export const Navbutton = styled.button`
  border: 0px;
  background: transparent;
  color: #000;
  text-transform: uppercase;
  font-size: 15rem;
  font-weight: 800;
  margin: 10px 0px;
  text-align: left;
  cursor: pointer;
`;

export const Content = styled.main`
  height: 100%;
  width: 100vw;
  background-color: #fff;
  overflow-y: auto;
`;
