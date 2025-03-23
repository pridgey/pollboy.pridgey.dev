import { createAsync, useParams, useSubmission } from "@solidjs/router";
import { Match, Suspense, Switch } from "solid-js";
import { getPollById } from "~/lib/api";

export default function Poll() {
  const params = useParams();
  const poll = createAsync(() => getPollById(params.id));

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Match when={poll()?.slug === params.slug}>
          <pre>{JSON.stringify(poll(), null, 4)}</pre>
        </Match>
        <Match when={poll()?.slug !== params.slug}>
          <div>No poll found</div>
        </Match>
      </Switch>
    </Suspense>
  );
}
