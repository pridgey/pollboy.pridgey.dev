import { useEffect, useState } from "react";
import { Poll } from "./../../types";
import {
  ContentContainer,
  ContentText,
  GridArea,
  SandwichCardContainer,
  SandwichStripe,
  SandwichStripesContainer,
} from "./SandwichCard.styles";
import { Text } from "./../Text";
import { getCharSum } from "./SandwichCard.functions";

type SandwichCardProps = {
  Poll: Poll;
};

type CardStripe = {
  Height: number;
  Color: string;
};

type CardConfig = {
  Angle: string;
  Stripes: CardStripe[];
};

export const SandwichCard = ({ Poll }: SandwichCardProps) => {
  const [cardConfig, setCardConfig] = useState<CardConfig>({
    Angle: "0",
    Stripes: [],
  });

  useEffect(() => {
    if (Poll?.PollName && Poll?.PollDescription) {
      const concatTitleDesc = `${Poll.PollName}:${Poll.PollDescription}`;
      const totalCodeSum = getCharSum(concatTitleDesc);

      const angles = ["-5", "-4", "-3", "-2", "-1", "0", "1", "2", "3", "4"];
      const angle = angles[concatTitleDesc.length % 10];

      const firstOp = Math.max(
        Poll.PollName.length,
        Poll.PollDescription.length
      );
      const secondOp = Math.min(
        Poll.PollName.length,
        Poll.PollDescription.length
      );
      const numOfStripes = Math.round(firstOp / secondOp);

      const pallet = ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"];

      const stripes = [];

      for (let i = 0; i < numOfStripes; i++) {
        const stripeSize = Math.round(concatTitleDesc.length / numOfStripes);
        const stripeString = concatTitleDesc.substring(
          stripeSize * i,
          stripeSize * (i + 1)
        );
        const stripeSum = getCharSum(stripeString);
        const percentage = Math.ceil((stripeSum / totalCodeSum) * 100);
        const color = pallet[stripeSum % pallet.length];

        stripes.push({
          Height: percentage,
          Color: color,
        });
      }

      setCardConfig({
        Angle: angle,
        Stripes: stripes,
      });
    }
  }, [Poll]);

  return (
    <SandwichCardContainer>
      <SandwichStripesContainer Angle={cardConfig?.Angle ?? 0}>
        {cardConfig?.Stripes.map((x: CardStripe, index: number) => (
          <SandwichStripe key={index} Height={x.Height} Color={x.Color} />
        ))}
      </SandwichStripesContainer>

      <ContentContainer>
        <GridArea Area="title">
          <ContentText>
            <Text FontSize={19} FontWeight={500}>
              {Poll.PollName}
            </Text>
          </ContentText>
        </GridArea>
        <GridArea Area="desc">
          <ContentText>
            <Text FontSize={19} FontWeight={300}>
              {Poll.PollDescription}
            </Text>
          </ContentText>
        </GridArea>
      </ContentContainer>
    </SandwichCardContainer>
  );
};

/* 

1. Concat the Poll Name + Description
-- "June Statham Movie Month:Come vote on which movies we should watch this month featuring Jason Statham!"
2. Determine angle of sandwich by number of letters % 10 
-- Above has 102 characters, % 10 is 2. That many steps away from -5, so in this case -3deg
3. Determine number of ingredients 
-- Math.round a division of Title and Description character counts. Higher Count / Lower Count
4. For each ingredient determine a percentage height, and a color 
-- Split concat string by number of ingredients
-- Height is percentage of charcode sum compared to total charcode sum
-- Color is charcode sum % pallet options

*/
