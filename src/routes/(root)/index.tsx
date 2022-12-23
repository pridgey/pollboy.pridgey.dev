import { useRouteData } from "solid-start";
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server";
import { getUser, logout } from "~/db/session";
import styles from "~/css/home.module.css";
import { Button, Input, PollCard } from "~/components";

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const user = await getUser(request);

    if (!user) {
      throw redirect("/login");
    }

    return user;
  });
}

export default function Home() {
  // Grab user info from route data above
  const user = useRouteData<typeof routeData>();
  // Create a server action for the logout action
  const [, { Form }] = createServerAction$((f: FormData, { request }) =>
    logout(request)
  );

  return (
    <div class={styles.container}>
      <aside class={styles.pollcontainer}>
        <Input
          Label="Polls"
          Name="poll-search"
          Type="text"
          Placeholder="Search for Polls"
        />
        <div class={styles.polllist}>
          <h1 class={styles.polltitle}>Polls Created / Voted In</h1>
          <PollCard
            CardTitle="Jul-I can't believe it's not Disney"
            Description="You’d think it was Disney, but nope"
          />
          <PollCard
            CardTitle="AuGust of Adventure"
            Description="Thrust yourself into a gust of adventure"
          />
          <PollCard
            CardTitle="AuGust of Adventure"
            Description="Thrust yourself into a gust of adventure"
          />
          <PollCard
            CardTitle="AuGust of Adventure"
            Description="Thrust yourself into a gust of adventure"
          />
          <PollCard
            CardTitle="AuGust of Adventure"
            Description="Thrust yourself into a gust of adventure"
          />
          <PollCard
            CardTitle="AuGust of Adventure"
            Description="Thrust yourself into a gust of adventure"
          />
          <PollCard
            CardTitle="AuGust of Adventure"
            Description="Thrust yourself into a gust of adventure"
          />
          <PollCard
            CardTitle="AuGust of Adventure"
            Description="Thrust yourself into a gust of adventure"
          />
          <PollCard
            CardTitle="AuGust of Adventure"
            Description="Thrust yourself into a gust of adventure"
          />
          <PollCard
            CardTitle="AuGust of Adventure"
            Description="Thrust yourself into a gust of adventure"
          />
        </div>
        <Button Type="button">Create Poll</Button>
      </aside>
      <div class={styles.poll}>
        <h1 class={styles.pollinfotitle}>
          Jul-I Can’t Believe It’s Not Disney
        </h1>
        <h2 class={styles.pollinfosubtitle}>
          You’d think it was Disney, but nope
        </h2>
        <Button BackgroundColor="transparent" Type="button">
          Edit
        </Button>
        <Button BackgroundColor="--color-green" Type="button">
          Add Option
        </Button>
        <div class={styles.polloptioncontainer}>
          <PollCard
            CardTitle="AuGust of Adventure"
            Description="Thrust yourself into a gust of adventure"
          />
          <PollCard
            CardTitle="AuGust of Adventure"
            Description="Thrust yourself into a gust of adventure"
          />
          <PollCard
            CardTitle="AuGust of Adventure"
            Description="Thrust yourself into a gust of adventure"
          />
          <PollCard
            CardTitle="AuGust of Adventure"
            Description="Thrust yourself into a gust of adventure"
          />
          <PollCard
            CardTitle="AuGust of Adventure"
            Description="Thrust yourself into a gust of adventure"
          />
          <PollCard
            CardTitle="AuGust of Adventure"
            Description="Thrust yourself into a gust of adventure"
          />
        </div>
      </div>
    </div>
  );
}
