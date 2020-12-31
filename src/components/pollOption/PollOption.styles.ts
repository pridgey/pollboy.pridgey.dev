import styled from "styled-components";

export const PollOptionContainer = styled.button`
  border-radius: 12px;
  background-color: ${(props) => props.theme.getColor("white", 0.5)};
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  border: 0px;
  margin: 10px 0px;
  position: relative;
  cursor: pointer;
`;

export const PollOptionBar = styled.div<{
  Percentage: number;
  UserVoted: boolean;
}>`
  position: absolute;
  background-color: ${(props) =>
    props.UserVoted
      ? props.theme.getColor("green", 0.75)
      : props.theme.getColor("yellow", 0.5)};
  border-radius: 12px;
  width: ${(props) => `${props.Percentage}px`};
  height: 100%;
  transition: all 0.5s;
  top: 0;
  left: 0;
`;

export const OptionText = styled.div`
  position: absolute;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 25px;
  font-family: "Montserrat", sans-serif;
  padding: 5px 10px;
  box-sizing: border-box;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

export const OptionVoteCount = styled.span`
  font-size: 20px;
  background-color: ${(props) => props.theme.getColor("blue")};
  border-radius: 100%;
  padding: 5px;
`;
