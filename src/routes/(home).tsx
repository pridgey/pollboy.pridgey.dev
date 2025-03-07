import { createAsync, type RouteDefinition } from "@solidjs/router";
import { Button } from "~/components/Button";
import { Flex } from "~/components/Flex";
import { Text } from "~/components/Text";
import { AuthCard } from "~/compositions/AuthCard";
import { GirlBubbleSVG } from "~/compositions/GirlBubbleSVG";
import { GirlLaptopSVG } from "~/compositions/GirlLaptopSVG";
import { getUser } from "~/lib/auth";
import styles from "~/styles/home.module.css";

export const route = {
  preload() {
    getUser();
  },
} satisfies RouteDefinition;

export default function Home() {
  const user = createAsync(() => getUser(), { deferStream: true });

  return (
    <main class={styles.container}>
      <section class={styles.landing_container}>
        <div class={styles.landing_content}>
          <div class={styles.hero_container}>
            <Flex
              Direction="column"
              Gap="small"
              Height="30%"
              PaddingX="large"
              Width="80%"
            >
              <Text As="h1" Color="white" FontSize="jumbo">
                Speak Freely
              </Text>
              <Text Color="white" FontSize="extra-large" FontWeight="light">
                Collect truly anonymous feedback from your team to facilitate
                open and honest growth.
              </Text>
            </Flex>
          </div>
          <div class={styles.login_container}>
            <AuthCard />
          </div>
        </div>
      </section>
      <section class={styles.text_block}>
        <Text As="h2" FontSize="extra-large" FontWeight="semibold">
          Stronger Voices. Stronger Teams.
        </Text>
        <Text Align="justify" FontSize="large" LineHeight="medium">
          Chatplats is a web application that allows a single user to create
          forums dedicated to collecting truly anonymous feedback. We believe
          that when individuals are assured of their privacy, it removes the
          barriers of identity-linked pressure, empowering teams to ask
          meaningful questions and deliver candid feedback, thus nurturing a
          culture of open and genuine communication.
        </Text>
      </section>
      <section class={styles.text_block}>
        <Flex AlignItems="center" Direction="row" Gap="large">
          <GirlBubbleSVG style={{ "min-width": "40%" }} />
          <Flex Direction="column" Gap="medium">
            <Text As="h2" FontSize="extra-large" FontWeight="semibold">
              Engaging Town Halls
            </Text>
            <Text Align="justify" FontSize="large" LineHeight="medium">
              Gather valuable feedback for your large company meetings. Create a
              forum and post a link to collect anonymous questions and comments
              days or weeks in advance. Moderate the posts that come in to help
              keep the meeting on topic.
            </Text>
          </Flex>
        </Flex>
      </section>
      <section class={styles.text_block}>
        <Flex AlignItems="center" Direction="row" Gap="large">
          <Flex Direction="column" Gap="medium">
            <Text As="h2" FontSize="extra-large" FontWeight="semibold">
              Feature Rich
            </Text>
            <Text Align="justify" FontSize="large" LineHeight="medium">
              Chatplats empowers users to let their voices be heard by allowing
              them to see feedback items and upvote those they agree with. Forum
              moderators can manage these items by marking them as off-topic to
              keep discussions focused. Subscribed users benefit from the
              ability to feature important feedback at the top, alongside
              automated AI moderation to address inappropriate language and
              maintain a respectful environment.
            </Text>
          </Flex>
          <img src="/images/home_featureblock.jpg" width="40%" />
        </Flex>
      </section>
      <section class={styles.text_block}>
        <GirlLaptopSVG style={{ "min-width": "40%" }} />
        <Text
          As="h2"
          Align="center"
          FontSize="large"
          Italic={true}
          LineHeight="medium"
        >
          "I've had a great time using Chatplats. It has allowed our employees
          the comfort of being able to ask questions without the fear of being
          judged, and overall feels nicer to use than a standard survey tool."
        </Text>
        <Text Align="center" Italic={true}>
          - Teri G.
        </Text>
      </section>
      <footer class={styles.footer}>
        <Flex
          AlignItems="flex-start"
          Direction="row"
          Gap="large"
          Padding="large"
        >
          <Text As="h3" Color="white" FontSize="extra-large">
            Chatplats
          </Text>
          <Flex AlignItems="flex-start" Direction="column" Gap="small">
            <Button Color="white" Href="/privacy-policy" Variant="text">
              Privacy Policy
            </Button>
            <Button Color="white" Href="/terms-and-conditions" Variant="text">
              Terms & Conditions
            </Button>
          </Flex>
        </Flex>
      </footer>
    </main>
  );
}
