import { A, createAsync } from "@solidjs/router";
import { JSX, Match, Switch } from "solid-js";
import { Avatar } from "~/components/Avatar";
import { getUser } from "~/lib/auth";
import { UserRecord } from "~/types/pocketbase";
import styles from "./Layout.module.css";

type LayoutProps = {
  children?: JSX.Element;
};

/**
 * Composition that acts as the layout to the entire application
 */
export const Layout = (props: LayoutProps) => {
  const user = createAsync(() => getUser());

  return (
    <div class={styles.layout}>
      <nav class={styles.navbar}>
        <A href="/" class={styles.sitetitle}>
          Pollboy
        </A>
        <Switch>
          <Match when={user()?.email}>
            <Avatar User={user() as Partial<UserRecord>} />
          </Match>
          <Match when={!user()?.email}>
            <div class={styles.linkgroup}>
              <A href="login" class={styles.link}>
                Login / Register
              </A>
            </div>
          </Match>
        </Switch>
      </nav>
      <main class={styles.maincontent}>{props.children}</main>
    </div>
  );
};
