import { ReactNode, useState, useEffect } from "react";
import { StyledBackground, StyledMain } from "./Background.styles";

type BackgroundProps = {
  children: ReactNode;
};

export const Background = ({ children }: BackgroundProps) => {
  // State contains all the randomized values for the background
  const [backgroundConfig, setBackgroundConfig] = useState<{
    angle: number;
    hslArray: string[];
    duration: number;
    positionsArray: string[];
  }>({
    angle: 0,
    hslArray: [],
    duration: 0,
    positionsArray: [],
  });

  useEffect(() => {
    const angle = Math.random() * 360;

    const hslArray = [];
    const randomAmount = Math.round(2 + Math.random() * 10);

    for (let i = 0; i < randomAmount; i++) {
      const h = Math.round(Math.random() * 360);
      const s = Math.round(Math.random() * 100);
      const l = Math.round(50 + Math.random() * (100 - 50));

      hslArray.push(`hsl(${h}, ${s}%, ${l}%)`);
    }

    const duration = Math.round(20 + Math.random() * 40);

    const positionsArray: string[] = [];
    const positions = Math.round(2 + Math.random() * 4);

    for (let j = 0; j <= positions; j++) {
      const percentage = Math.round((100 / positions) * j);
      const randX = Math.random() * 100;
      const randY = Math.random() * 100;
      if (percentage === 100) {
        positionsArray.push(positionsArray[0].replace("0%", "100%"));
      } else {
        positionsArray.push(
          `${percentage}%{background-position: ${randX}% ${randY}%}`
        );
      }
    }

    setBackgroundConfig({
      angle,
      hslArray,
      duration,
      positionsArray,
    });
  }, []);

  return (
    <StyledBackground {...backgroundConfig}>
      <StyledMain>{children}</StyledMain>
    </StyledBackground>
  );
};
