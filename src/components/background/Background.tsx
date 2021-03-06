import React, { ReactNode } from "react";
import { StyledElement } from "@pridgey/afterburner";

type BackgroundProps = {
  children: ReactNode;
};

export const Background = ({ children }: BackgroundProps) => {
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

  const StyledBackground = StyledElement(
    "div",
    {
      standard: {
        position: "fixed",
        top: "0",
        bottom: "0",
        left: "0",
        right: "0",
        background: `linear-gradient(${angle}deg, ${hslArray.join(", ")})`,
        backgroundSize: "600% 600%",
        animation: `flow ${duration}s ease infinite`,
        display: "flex",
        alignItems: "flex-start",
        padding: "50px 0px",
        justifyContent: "center",
        overflowY: "hidden",
      },
      hover: {
        overflowY: "scroll",
      },
    },
    `@keyframes flow {
        ${positionsArray.join(" ")}  
    }`
  );

  return <StyledBackground>{children}</StyledBackground>;
};
