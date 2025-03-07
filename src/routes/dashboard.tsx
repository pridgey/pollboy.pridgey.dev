import { createAsync } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { Card } from "~/components/Card";
import { Divider } from "~/components/Divider";
import { Flex } from "~/components/Flex";
import { Input } from "~/components/Input";
import { Text } from "~/components/Text";
import { ForumBanner } from "~/compositions/ForumBanner";
import { getDefaultForum } from "~/lib/api";

const ForumUrlCard = clientOnly(
  () => import("~/compositions/ForumUrlCard/ForumUrlCard")
);

export default function Dashboard() {
  const forum = createAsync(() => getDefaultForum(), {
    name: "getDashboardForum",
  });

  return (
    <Flex
      Direction="row"
      Gap="medium"
      Height="100%"
      Padding="large"
      Width="100%"
      Style={{ "min-height": "0px" }}
    >
      <Card height="100%" width="300px" variant="outlined">
        <Flex Direction="column" Gap="large">
          <Flex Direction="column" Gap="medium">
            <Text Align="center" As="h2" FontSize="header">
              Forum
            </Text>
            <Divider />
            <Input
              Label="Forum Title"
              HelperText="The title of your forum"
              Placeholder="Title"
              DefaultValue={forum()?.name}
            />
            <Input
              Label="Question"
              HelperText="The main question that sums everything up"
              Placeholder="Question"
            />
            <Input
              Label="Description"
              HelperText="What feedback you're looking for"
              Placeholder="Description"
            />
            <Input
              Label="Banner Image"
              HelperText="Some customized branding for your forum"
              Placeholder="Image URL"
            />
          </Flex>
        </Flex>
      </Card>
      <Card height="100%" width="100%" variant="outlined">
        <Flex Direction="column" Gap="small">
          {/* Forum Url */}
          <ForumUrlCard
            forumId={forum()?.id ?? ""}
            slug={forum()?.slug ?? ""}
          />
          <Divider />
          <ForumBanner
            forumBanner={forum()?.banner}
            forumId={forum()?.id ?? ""}
          />
          Preview the forum here, banner image, forum name, description, and
          feedback
          <br />
          {forum()?.banner}
        </Flex>
      </Card>
    </Flex>
  );
}
