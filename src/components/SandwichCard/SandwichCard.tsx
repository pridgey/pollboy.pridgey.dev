import { useEffect, useState } from "react";
import { Poll } from "./../../types";
import {
  ContentText,
  DeleteModalContent,
  Icons,
  Sandwich,
} from "./SandwichCard.styles";
import { Text } from "./../Text";
import { getCharSum, clampNumber } from "./SandwichCard.functions";
import { Button, GridArea, Modal } from "./../";
import { RiDeleteBin6Line, RiEditBoxFill } from "react-icons/ri";
import { usePollAPI } from "./../../utilities";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";

type SandwichCardProps = {
  DisplayMode?: boolean;
  Poll: Poll;
  OnDelete?: () => void;
  OnClick?: () => void;
};

type CardConfig = {
  Angle: number;
  Colors?: string[];
};

export const SandwichCard = ({
  DisplayMode = false,
  Poll,
  OnDelete,
  OnClick,
}: SandwichCardProps) => {
  // Config for the card config
  const [cardConfig, setCardConfig] = useState<CardConfig>({
    Angle: 0,
    Colors: [],
  });

  // State for deleting a poll
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Poll API functions
  const { deletePoll } = usePollAPI();

  // Router history for route changes
  const routerHistory = useHistory();

  useEffect(() => {
    if (Poll?.PollName && Poll?.PollDescription) {
      // Concat the Name and Description together
      const ConcatTitleDesc = `${Poll.PollName}:${Poll.PollDescription}`;
      // Get the charcode sum of the concat'd string
      const TotalCodeSum = getCharSum(ConcatTitleDesc);
      // Determine the num of vowels in the string
      const NumOfVowels = ConcatTitleDesc.split(/[a,e,i,o,u]/g).length;
      // Get the angle of the gradient, odd num of vowels is a negative angle
      const Angle =
        (ConcatTitleDesc.length % 45) * (NumOfVowels % 2 === 0 ? 1 : -1);

      // Get the number of stripes by dividing the larger string by the smaller string
      const FirstOp = Math.max(
        Poll.PollName.length,
        Poll.PollDescription.length
      );
      const SecondOp = Math.min(
        Poll.PollName.length,
        Poll.PollDescription.length
      );
      // We add two to ensure a bit more variety
      const NumOfStripes = clampNumber(Math.round(FirstOp / SecondOp), {
        max: 10,
        min: 2,
      });

      // Array to hold the colors of the gradient
      const ColorArray: string[] = [];
      // We start the percent at 0 and build the gradient up
      let ColorPercent = 0;
      // We're going to break the string into equal chunks
      const TextStripSize = Math.round(ConcatTitleDesc.length / NumOfStripes);
      // The base Hue for the stripes, determine by the total char sum
      const BaseHue = TotalCodeSum % 360;

      // Loop through the number of stripes to create the gradient
      for (let j = 0; j < NumOfStripes; j++) {
        // Get the substring of text for this particular stripe
        const StripeText = ConcatTitleDesc.substring(
          TextStripSize * j,
          TextStripSize * (j + 1)
        );

        // The charcode sum of this substring
        const StripeSum = getCharSum(StripeText);

        // The percentage of this charcode sum compared to the total
        const StripePercent = StripeSum / TotalCodeSum;

        // Add stripe 1 of 2
        ColorArray.push(
          `hsl(${BaseHue + (StripeSum % 10) * j}, 100%, 60%) ${ColorPercent}%`
        );
        // Increment the percent of the gradient
        ColorPercent += clampNumber(Math.ceil(StripePercent * 100), {
          max: 100,
        });
        // Add the stripe 2 of 2. Adding the same color at the new percentage gives us clean edges instead of blended edges
        ColorArray.push(
          `hsl(${BaseHue + (StripeSum % 10) * j}, 100%, 60%) ${ColorPercent}%`
        );
      }

      setCardConfig({
        Angle,
        Colors: ColorArray,
      });
    }
  }, [Poll]);

  return (
    <>
      <Sandwich Angle={cardConfig.Angle} Colors={cardConfig.Colors ?? []}>
        <GridArea Area="title">
          <ContentText
            onClick={() => {
              OnClick && OnClick();
            }}
          >
            <Text FontSize={19} FontWeight={500}>
              {Poll.PollName}
            </Text>
          </ContentText>
        </GridArea>
        <GridArea Area="desc">
          <ContentText
            onClick={() => {
              OnClick && OnClick();
            }}
          >
            <Text FontSize={19} FontWeight={300}>
              {Poll.PollDescription}
            </Text>
          </ContentText>
        </GridArea>
        <GridArea Area="icons" JustifySelf="flex-end">
          {!DisplayMode && (
            <Icons>
              <Button
                OnClick={() => routerHistory.push(`/edit?slug=${Poll.Slug}`)}
                Padding={0}
                Margin={0}
              >
                <RiEditBoxFill />
              </Button>
              <Button
                OnClick={() => setShowDeleteModal(true)}
                Padding={0}
                Margin={0}
                Color="#d00000"
              >
                <RiDeleteBin6Line />
              </Button>
            </Icons>
          )}
        </GridArea>
        {showDeleteModal && (
          <Modal
            OnSubmit={() => {
              setShowDeleteModal(false);
              toast
                .promise(deletePoll(Poll.Slug), {
                  loading: "Deleting The Poll...",
                  success: "Poll was deleted :(",
                  error: "An error has occurred with this poll.",
                })
                .then(() => {
                  OnDelete && OnDelete();
                });
            }}
            OnCancel={() => setShowDeleteModal(false)}
            SubmitButtonColor="#d00000"
            SubmitLabel="Delete"
          >
            <DeleteModalContent>
              <Text FontSize={25} FontWeight={800}>
                Delete this Poll?
              </Text>
              <Text FontSize={19}>
                Are you sure you want to delete this poll? It is irreversible.
              </Text>
            </DeleteModalContent>
          </Modal>
        )}
      </Sandwich>
    </>
  );
};
