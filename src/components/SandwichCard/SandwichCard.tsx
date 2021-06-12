import { useEffect, useState } from "react";
import { Poll } from "./../../types";
import {
  ContentContainer,
  ContentText,
  DeleteModalContent,
  Icons,
  SandwichCardContainer,
  SandwichStripe,
  SandwichStripesContainer,
} from "./SandwichCard.styles";
import { Text } from "./../Text";
import { getCharSum } from "./SandwichCard.functions";
import { Button, GridArea, Modal } from "./../";
import { RiDeleteBin6Line, RiEditBoxFill } from "react-icons/ri";
import { usePollAPI } from "./../../utilities";
import toast from "react-hot-toast";

type SandwichCardProps = {
  DisplayMode?: boolean;
  Poll: Poll;
  OnDelete?: () => void;
};

type CardStripe = {
  Height: number;
  Color: string;
};

type CardConfig = {
  Angle: string;
  Stripes: CardStripe[];
};

export const SandwichCard = ({
  DisplayMode = false,
  Poll,
  OnDelete,
}: SandwichCardProps) => {
  // Config for the card config
  const [cardConfig, setCardConfig] = useState<CardConfig>({
    Angle: "0",
    Stripes: [],
  });

  // State for deleting a poll
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Poll API functions
  const { deletePoll } = usePollAPI();

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
        <GridArea Area="icons" JustifySelf="flex-end">
          {!DisplayMode && (
            <Icons>
              <Button
                OnClick={() => alert("edit coming soon")}
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
      </ContentContainer>
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
    </SandwichCardContainer>
  );
};
