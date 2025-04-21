import { createAsync, type RouteDefinition } from "@solidjs/router";
import { createMemo, Match, Switch } from "solid-js";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
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
          <h2 class={styles.profileinfolabel}>created</h2>
          <h3 class={styles.profileinfodatum}>
            {userData()?.created
              ? new Date(userData()!.created).toLocaleDateString()
              : "Unknown"}
          </h3>
        </div>
      </div>
      <div class={styles.profilecard} style={{ "align-items": "flex-start" }}>
        <h1 class={styles.profiletitle}>User Profile</h1>
        <Input
          Label="Avatar URL"
          Name="avatar"
          Type="text"
          Placeholder="Paste a URL to an avatar image"
        />
        <Input
          Label="Display Name"
          Name="username"
          Type="text"
          Placeholder="What to call you"
        />
        <Button Type="submit">Save Settings</Button>
      </div>
    </div>
  );
}
