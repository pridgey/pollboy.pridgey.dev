import { useEffect, useRef, useState } from "react";
import {
  OptionText,
  PollOptionBar,
  PollOptionContainer,
} from "./PollOption.styles";

type PollOptionProps = {
  Percentage: number;
  Text: string;
  UserVoted?: boolean;
  Votes: number;
  OnClick: () => void;
};

export const PollOption = ({
  Percentage,
  Text,
  UserVoted = false,
  Votes,
  OnClick,
}: PollOptionProps) => {
  const containerRef = useRef<HTMLButtonElement>(
    document.createElement("button")
  );
  const [percentWidth, setPercentWidth] = useState(0);

  useEffect(() => {
    if (containerRef) {
      let perc = Percentage;
      if (Percentage > 1) {
        // If percentage isn't 0.5, but instead 50, do this:
        perc = Percentage / 100;
      }
      // Calculate the width
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      setPercentWidth(containerWidth * perc);
    }
  }, [containerRef, Percentage]);

  return (
    <PollOptionContainer
      ref={containerRef}
      onClick={() => {
        OnClick();
      }}
    >
      <PollOptionBar Percentage={percentWidth} UserVoted={UserVoted} />
      <OptionText>
        <span>{Text}</span>
        <span>{Votes}</span>
      </OptionText>
    </PollOptionContainer>
  );
};
