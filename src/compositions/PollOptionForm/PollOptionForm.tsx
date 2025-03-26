import { createAsync } from "@solidjs/router";
import { createEffect, createSignal, Suspense } from "solid-js";
import { Flex } from "~/components/Flex";
import { Input } from "~/components/Input";
import { getPollOptionById } from "~/lib/api";
import { PollOptionRecord } from "~/types/pocketbase";

type PollOptionFormProps = {
  PollOptionId?: string;
  OnChange: (pollOption: PollOptionRecord) => void;
};

/**
 * Composition to display a form for Poll Option Data. Allows a user to create or edit a poll option
 */
export const PollOptionForm = (props: PollOptionFormProps) => {
  // Fetch any poll option data, if no Id it will return null
  const pollOptionData = createAsync<PollOptionRecord | null>(() =>
    getPollOptionById(props.PollOptionId ?? "")
  );

  // Holds state for current data
  const [pollOptionState, updatePollOptionState] = createSignal<
    PollOptionRecord | Object
  >(pollOptionData() ?? {});

  // If the fetch comes back, update state
  createEffect(() => {
    if (!!pollOptionData()) {
      updatePollOptionState({
        ...pollOptionData(),
      });
    }
  });

  // When state updates, call the onChange
  createEffect(() => {
    if (Object.hasOwn(pollOptionState(), "option_name")) {
      props.OnChange({
        ...(pollOptionState() as PollOptionRecord),
      });
    }
  });

  return (
    <Suspense fallback="Loading...">
      <Flex Direction="column">
        <Input
          DefaultValue={pollOptionData()?.option_name}
          Label="Option Name"
          Name="option_name"
          OnChange={(newName) => {
            updatePollOptionState({
              ...pollOptionState(),
              option_name: newName,
            });
          }}
          Placeholder="Vote for me"
        />
        <Input
          DefaultValue={pollOptionData()?.option_desc}
          Label="Description"
          Name="option_desc"
          OnChange={(newDesc) => {
            updatePollOptionState({
              ...pollOptionState(),
              option_desc: newDesc,
            });
          }}
          Placeholder="Why you should vote for me"
        />
      </Flex>
    </Suspense>
  );
};
