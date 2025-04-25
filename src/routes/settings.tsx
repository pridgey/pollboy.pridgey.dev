import {
  createAsync,
  useAction,
  useSubmission,
  type RouteDefinition,
} from "@solidjs/router";
import {
  createEffect,
  createMemo,
  createSignal,
  Match,
  Show,
  Switch,
} from "solid-js";
import { Button } from "~/components/Button";
import { FileUpload } from "~/components/FileUpload";
import { Flex } from "~/components/Flex";
import { Input } from "~/components/Input";
import { Text } from "~/components/Text";
import { updateUserAvatarAction, updateUsernameAction } from "~/lib/api";
import { getUser } from "~/lib/auth";
import styles from "~/styles/settings.module.css";

export const route = {
  preload() {
    getUser();
  },
} satisfies RouteDefinition;

/**
 * Home route for listing out polls
 */
export default function Settings() {
  const userData = createAsync(() => getUser(true), { deferStream: true });
  // Action to update username
  const updateUsername = useAction(updateUsernameAction);
  const updatingUserName = useSubmission(updateUsernameAction);

  // Action to update user avatar
  const updateAvatar = useAction(updateUserAvatarAction);
  const updatingAvatar = useSubmission(updateUserAvatarAction);

  // State of the username input
  const [username, setusername] = createSignal("");
  createEffect(() => {
    if (!!userData()?.name) {
      setusername(userData()!.name);
    }
  });

  console.log("Debug User Data", { userData: userData() });

  return (
    <div class={styles.container}>
      <div class={styles.profilecard}>
        <Switch>
          <Match when={!!userData()?.avatarUrl}>
            <img
              alt="user profile image"
              class={styles.profileimage}
              src={userData()!.avatarUrl}
            />
          </Match>
          <Match when={!userData()?.avatarUrl}>
            <div class={styles.profileimage}></div>
          </Match>
        </Switch>
        <h1 class={styles.profiletitle}>
          {userData()?.name || userData()?.email}
        </h1>
        <div class={styles.profileinfogroup}>
          <h2 class={styles.profileinfolabel}>email</h2>
          <h3 class={styles.profileinfodatum}>{userData()?.email}</h3>
        </div>
        <div class={styles.profileinfogroup}>
          <h2 class={styles.profileinfolabel}>joined</h2>
          <h3 class={styles.profileinfodatum}>
            {userData()?.created
              ? new Date(userData()!.created).toLocaleDateString()
              : "Unknown"}
          </h3>
        </div>
      </div>
      <div class={styles.profilecard} style={{ "align-items": "flex-start" }}>
        <h1 class={styles.profiletitle}>User Profile</h1>
        <Flex
          AlignItems="flex-start"
          Direction="column"
          Gap="large"
          JustifyContent="flex-start"
          Width="100%"
        >
          {/* Update Username */}
          <Flex AlignItems="flex-end" Direction="row" Gap="medium">
            <Input
              Label="Display Name"
              Name="username"
              Type="text"
              Placeholder="What to call you"
              OnChange={(newUsername) => setusername(newUsername)}
              DefaultValue={username()}
              Error={
                username().length > 20
                  ? "Username cannot be longer than 20 characters"
                  : undefined
              }
            />
            <Show
              when={
                !!username().length &&
                username().length < 20 &&
                username() !== userData()?.name
              }
            >
              <Flex
                AlignItems="center"
                Direction="row"
                Gap="small"
                Style={{
                  "margin-bottom": "var(--spacing-small)",
                }}
              >
                <Button
                  FontSize="small"
                  OnClick={async () => {
                    // update the username
                    await updateUsername(username());
                  }}
                  Pending={updatingUserName.pending}
                  Variant="text"
                >
                  Update Username
                </Button>
                <Button
                  Color="error"
                  FontSize="small"
                  OnClick={() => {
                    setusername(userData()?.name ?? "");
                  }}
                  Pending={updatingUserName.pending}
                  Variant="text"
                >
                  Reset
                </Button>
              </Flex>
            </Show>
          </Flex>
          {/* Update User Avatar */}
          <Flex Direction="column" Gap="small">
            <Text FontSize="text" FontWeight="semibold">
              Upload a new Avatar
            </Text>
            <FileUpload
              accept="image/*"
              buttonOnly={true}
              label="Change Avatar"
              name="user-avatar"
              onFileAccepted={async (data) => {
                const avatarFile = data.at(0);

                if (avatarFile && avatarFile.type.includes("image")) {
                  await updateAvatar(avatarFile);
                }
              }}
              onFileRejected={(data) => console.log("data", data)}
              pending={updatingAvatar.pending}
            />
          </Flex>
        </Flex>
      </div>
    </div>
  );
}
