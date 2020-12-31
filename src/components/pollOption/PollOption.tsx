import { useEffect, useRef, useState } from "react";
import {
  OptionText,
  PollOptionBar,
  PollOptionContainer,
} from "./PollOption.styles";

type PollOptionProps = {
  Editable?: boolean;
  Percentage: number;
  Text: string;
  OnClick: () => void;
};

export const PollOption = ({
  Editable = false,
  Percentage,
  Text,
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
      Editable={Editable}
      onClick={() => {
        if (Editable) {
          OnClick();
        }
      }}
    >
      <PollOptionBar Percentage={percentWidth} />
      <OptionText>{Text}</OptionText>
    </PollOptionContainer>
  );
};
