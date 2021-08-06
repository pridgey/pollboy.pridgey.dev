import { DescriptionContainer, TextContainer } from "./PollViewTitle.styles";
import { useState, useRef, useEffect } from "react";
import { Text } from "./../";

type PollViewTitleProps = {
  Title: string;
  Description: string;
};

export const PollViewTitle = ({ Title, Description }: PollViewTitleProps) => {
  const [isExpanded, setExpanded] = useState(false);
  const [descriptorHeight, setDescriptorHeight] = useState(0);

  const descriptorRef = useRef(document.createElement("div"));

  useEffect(() => {
    setDescriptorHeight(descriptorRef.current.getBoundingClientRect().height);
  }, [descriptorRef]);

  return (
    <TextContainer onClick={() => setExpanded(!isExpanded)}>
      <Text FontSize={45} FontWeight={800} TextAlign="left">
        {Title}
      </Text>
      <DescriptionContainer Expanded={isExpanded} Height={descriptorHeight}>
        <Text
          Ref={descriptorRef}
          FontSize={35}
          FontWeight={400}
          TextAlign="left"
        >
          {Description}
        </Text>
      </DescriptionContainer>
    </TextContainer>
  );
};
