import { createAsync, type RouteDefinition } from "@solidjs/router";
import { For } from "solid-js";
import { Button } from "~/components/Button";
import { Flex } from "~/components/Flex";
import { Text } from "~/components/Text";
import { getRelevantPolls } from "~/lib/api";
import { getUser } from "~/lib/auth";
import styles from "~/styles/home.module.css";

export const route = {
  preload() {
    getUser();
    getRelevantPolls();
  },
} satisfies RouteDefinition;

export default function Home() {
  const user = createAsync(() => getUser(true), { deferStream: true });
  const polls = createAsync(() => getRelevantPolls());

  return (
    <main>
      <h1>hej</h1>
      <For each={polls()}>{(poll) => <h2>{poll.poll_name}</h2>}</For>
    </main>
  );
}
