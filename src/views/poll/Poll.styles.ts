import styled from "styled-components";
import Youtube from "react-youtube";

export const YoutubeBackground = styled(Youtube)`
  position: fixed;
  top: -10%;
  left: -10%;
  right: 0;
  bottom: 0;
  background-color: black;
  width: 120vw;
  height: 120vh;
`;

export const PollContainer = styled.main`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: 30vw 1fr 1fr 30vw;
  grid-template-rows: min-content min-content min-content;
  grid-template-areas: "gutterl logo buttons gutterr" "gutterl title title gutterr" "gutterl poll poll gutterr";
  justify-content: center;
  grid-gap: 15px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 15px;
  box-sizing: border-box;
`;

export const GridArea = styled.div<{ Area: string }>`
  grid-area: ${(props) => props.Area};
`;

export const LogoContainer = styled.div`
  border-radius: 12px;
  background-color: ${(props) => props.theme.getColor("blue")};
  padding: 15px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: min-content min-content;
  grid-template-rows: min-content;
  column-gap: 15px;
  font-size: 40px;
  font-family: "Mukta", sans-serif;
  font-weight: 600;
  align-items: center;
  justify-content: center;
  user-select: none;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

export const Button = styled.button<{ Color: string }>`
  border-radius: 12px;
  background-color: ${(props) => props.theme.getColor(props.Color)};
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

export const Title = styled.div`
  font-family: "Mukta", sans-serif;
  font-weight: 600;
  font-size: 40px;
  text-align: center;
  color: white;
  margin-top: 10px;
  width: 100%;
`;

export const PollOptionContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
`;
