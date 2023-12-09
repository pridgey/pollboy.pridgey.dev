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
  Ranking: number;
};

export type PollResultsProps = {
  OnClose: () => void;
  PollExpired: boolean;
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
      <div class={styles.container}>
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
                    Name={result.Name}
                    Rank={result.Ranking}
                    VoteCount={result.Votes}
                  />
                </li>
              )}
            </For>
          </TransitionGroup>
        </ul>
      </div>
      <Show when={isMobile() && !props.PollExpired}>
        <Button Type="button" OnClick={() => props.OnClose()}>
          Close Results
        </Button>
      </Show>
    </>
  );
};
