import { createEffect, createSignal, Match, Switch } from "solid-js";
import styles from "./ForumBanner.module.css";
import { FileUpload } from "~/components/FileUpload";
import { createAsync, useAction, useSubmission } from "@solidjs/router";
import { retrieveBannerUrl, uploadForumBanner } from "~/lib/api";

type ForumBannerProps = {
  displayMode?: boolean;
  forumId: string;
  forumBanner?: string;
};

export const ForumBanner = (props: ForumBannerProps) => {
  const uploadImage = useAction(uploadForumBanner);
  const uploadingImage = useSubmission(uploadForumBanner);
  const bannerUrl = createAsync(() =>
    retrieveBannerUrl(props.forumId, props.forumBanner ?? "")
  );
  const [tempUrl, setTempUrl] = createSignal("");

  createEffect(() => {
    if (uploadingImage.pending && !!uploadingImage.input) {
      console.log("Pending Upload", { input: uploadingImage.input });
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempUrl(e.target?.result?.toString() || "");
      };
      reader.readAsDataURL(uploadingImage.input.at(1) as File);
    } else {
      console.log("Upload Done");
      setTempUrl("");
    }
  });

  return (
    <Switch>
      <Match when={!bannerUrl()}>
        <FileUpload
          helperText="Upload a banner"
          label="Change Banner Image"
          onFileAccepted={async (newImages) => {
            const newBannerImage = newImages.at(0);
            if (newBannerImage) {
              await uploadImage(props.forumId, newBannerImage);
            }
          }}
          pending={uploadingImage.pending}
        />
      </Match>
      <Match when={bannerUrl()}>
        <div class={styles.banner_container}>
          <img class={styles.banner_image} src={tempUrl() || bannerUrl()} />
          <div class={styles.change_image}>
            <FileUpload
              buttonOnly={true}
              label="Change Banner"
              onFileAccepted={async (newImages) => {
                const newBannerImage = newImages.at(0);
                if (newBannerImage) {
                  await uploadImage(props.forumId, newBannerImage);
                }
              }}
              pending={uploadingImage.pending}
            />
          </div>
        </div>
      </Match>
    </Switch>
  );
};
