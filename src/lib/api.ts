import { action, query, reload } from "@solidjs/router";
import { getPocketBase, getUser } from "./auth";
import { ForumRecord } from "~/types/pocketbase";
import { generateSlug } from "~/utilities/generateSlug";

// #region Forum Actions

/**
 * Create Forum
 * Action to create a new forum
 */
export const createForum = async (forum: ForumRecord) => {
  "use server";
  try {
    const client = await getPocketBase();
    const user = await getUser();

    const createdForum = await client.collection<ForumRecord>("forum").create({
      ...forum,
      user: user?.id,
    });

    return createdForum;
  } catch (error) {
    console.error(error);
  }
};
export const createForumAction = action(createForum);

/**
 * Get Default Forum
 * Action to get the default forum
 */
export const getDefaultForum = query(async () => {
  "use server";
  const client = await getPocketBase();
  const user = await getUser();

  try {
    const mostRecentForum = await client
      .collection<ForumRecord>("forum")
      .getFirstListItem(`user = "${user?.id}"`, { sort: "-created" });

    console.log("mostRecentForum", mostRecentForum);

    return mostRecentForum;
  } catch (error) {
    console.log("Error selecting default forum, creating new forum", error);
    const newSlug = generateSlug();
    // Create forum
    const newForum = await createForum({
      name: "My Forum",
      open: false,
      description: "Welcome to your new feedback forum!",
      slug: newSlug,
      user: "",
    });
    return newForum;
  }
}, "getDefaultForum");

/**
 * Regenerate Forum Slug
 * Action to regenerate the forum slug
 */
export const regenerateForumSlug = action(
  async (forumId: ForumRecord["id"]) => {
    "use server";
    const client = await getPocketBase();

    if (forumId) {
      const newSlug = generateSlug();

      await client.collection<ForumRecord>("forum").update(forumId, {
        slug: newSlug,
      });
    }
  }
);

/**
 * Retrieve Banner Url
 * Query to generate the image url for the banner of a specified forum
 */
export const retrieveBannerUrl = query(
  async (forumId: string, fileName: string) => {
    "use server";
    console.log("Retrieve Banner URL", { forumId, fileName });
    const client = await getPocketBase();

    const forumRecord = await client
      .collection<ForumRecord>("forum")
      .getOne(forumId);

    const bannerUrl = await client.files.getURL(forumRecord, fileName);

    console.log("Retrieved Banner URL", { bannerUrl });
    return bannerUrl;
  },
  "retrieveBannerUrl"
);

/**
 * Upload Forum Banner
 * Action to upload a banner to a forum
 */
export const uploadForumBanner = action(
  async (forumId: ForumRecord["id"], file: File) => {
    "use server";
    console.log("Uploading Forum Banner", { forumId, file });
    const client = await getPocketBase();

    if (forumId && file) {
      await client.collection<ForumRecord>("forum").update(forumId, {
        banner: file,
      });
      console.log("Forum record updated with new banner file");
    }

    console.log("Completed Upload Forum Banner");

    return reload();
  }
);

// #endregion Forum Actions
