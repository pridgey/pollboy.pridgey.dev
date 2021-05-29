import styled from "styled-components";

export const StyledHome = styled.main`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: #a9c9ff;
  background-image: linear-gradient(180deg, #a9c9ff 0%, #ffbbec 100%);
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  align-items: flex-end;
  padding: 15px;
  box-sizing: border-box;
  font-size: 60px;
  font-family: Helvetica, Gill-sans, sans-serif;
  font-weight: 800;

  &:before {
    content: "";
    position: absolute;
    background: inherit;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: inset 0 0 2000px rgba(255, 255, 255, 0.5);
    filter: blur(3px);
  }
`;
