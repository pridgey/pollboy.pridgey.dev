import { Card } from "~/components/Card";
import { Flex } from "~/components/Flex";
import { Text } from "~/components/Text";
import { Button } from "~/components/Button";
import { createMemo, Show } from "solid-js";
import { createSignal } from "solid-js";
import { useAction, useSubmission } from "@solidjs/router";
import { regenerateForumSlug } from "~/lib/api";

type ForumUrlCardProps = {
  forumId: string;
  slug: string;
};

/**
 * Client only component to manage the current forum's url and slug
 */
export default function ForumUrlCard(props: ForumUrlCardProps) {
  const regenerateSlug = useAction(regenerateForumSlug);
  const regeneratingSlug = useSubmission(regenerateForumSlug);

  const [showCopied, setShowCopied] = createSignal(false);

  const forumUrl = createMemo(
    () => `https://${window.location.host}/forum/${props.forumId}-${props.slug}`
  );

  return (
    <Card height="min-content" variant="outlined">
      <Flex Direction="column">
        <Text FontSize="mini" FontWeight="bold">
          Forum URL
        </Text>
        <Flex
          AlignItems="center"
          Direction="row"
          Gap="medium"
          JustifyContent="space-between"
        >
          <Text FontSize="header">{forumUrl()}</Text>
          <Flex AlignItems="center" Direction="row" Gap="small">
            <Button
              Disabled={showCopied()}
              FontSize="small"
              OnClick={() => {
                if (navigator?.clipboard) {
                  // standard method
                  navigator.clipboard.writeText(forumUrl());
                } else {
                  // hacky method
                  const temp = document.createElement("input");
                  document.body.appendChild(temp);
                  temp.value = forumUrl();
                  temp.select();
                  document.execCommand("copy");
                  document.body.removeChild(temp);
                }
                setShowCopied(true);
                setTimeout(() => setShowCopied(false), 2000);
              }}
              Padding="small"
              Variant="outlined"
            >
              {showCopied() ? "Copied!" : "Copy Forum URL"}
            </Button>
            <Show when={!!navigator?.share}>
              <Button
                Disabled={showCopied()}
                FontSize="small"
                OnClick={async () => {
                  const shareData = {
                    title: "Chatplats Feedback Forum",
                    text: "Please submit anonymous feedback at this URL",
                    url: forumUrl(),
                  };

                  if (!!navigator?.share && navigator.canShare(shareData)) {
                    await navigator.share(shareData);
                  }
                }}
                Padding="small"
                Variant="outlined"
              >
                Share URL
              </Button>
            </Show>
            <Button
              FontSize="small"
              OnClick={async () => {
                console.log("regenerating slug", props.forumId);
                await regenerateSlug(props.forumId);
              }}
              Padding="small"
              Pending={regeneratingSlug.pending}
              Variant="outlined"
            >
              Regenerate
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
