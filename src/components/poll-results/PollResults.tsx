import styles from "./PollResults.module.css";
import { Button, Ranking } from "~/components";
import { For, createSignal, createEffect, Show } from "solid-js";
import {
  TransitionGroup,
  animateEnter,
  animateExit,
  animateMove,
} from "@otonashixav/solid-flip";

export type OptionVotes = {
  Name: string;
  Votes: number;
};

export type PollResultsProps = {
  OnClose: () => void;
  Results: OptionVotes[];
};

export const PollResults = (props: PollResultsProps) => {
  const [results, setResults] = createSignal([...props.Results]);
  const [isMobile, setIsMobile] = createSignal(false);

  createEffect(() => {
    if (window.innerWidth < 480) {
      setIsMobile(true);
    }
  });

  createEffect(() => {
    setResults([...props.Results]);
  });

  return (
    <>
      <ul class={styles.list}>
        <TransitionGroup
          enter={animateEnter()}
          exit={animateExit()}
          move={animateMove()}
        >
          <For each={results()}>
            {(result, index) => (
              <li>
                <Ranking
                  Index={index() + 1}
                  Place={index() < 3 ? index() + 1 : undefined}
                  Name={result.Name}
                  VoteCount={result.Votes}
                />
              </li>
            )}
          </For>
        </TransitionGroup>
      </ul>
      <Show when={isMobile()}>
        <Button Type="button" OnClick={() => props.OnClose()}>
          Close Results
        </Button>
      </Show>
    </>
  );
};
