import { Flex } from "~/components/Flex";
import { Modal } from "~/components/Modal";
import { Text } from "~/components/Text";

type AccountInfoModalProps = {
  OnClose: () => void;
};

/**
 * Composition to display a modal with information about why an account is needed.
 */
export const AccountInfoModal = (props: AccountInfoModalProps) => {
  return (
    <Modal
      OnClose={() => props.OnClose()}
      Title="Why do I need an account?"
      Width="600px"
    >
      <Flex Direction="column" Gap="medium">
        <Text Italic={true} FontWeight="light">
          Q: Why do I need an account for anonymous feedback?
        </Text>
        <Text LineHeight="medium">
          A: Each Feedback Forum on Chatplats requires only the forum moderator
          or organizer to have a Chatplats account. This approach ensures that
          one individual holds verifiable access to manage the forum
          effectively. After the forum is created, anyone with the private URL
          can submit feedback, no account required.
        </Text>
      </Flex>
    </Modal>
  );
};
