import {
  DirectoryContainer,
  PollBlock,
  PollImage,
  PollTitle,
} from "./PollDirectory.styles";
import { useAirtable } from "./../../utilities";
import { useEffect, useState } from "react";

type PollDirectoryProps = {
  UserID: string;
};

export const PollDirectory = ({ UserID }: PollDirectoryProps) => {
  const [pollList, setPollList] = useState<
    { PollName: string; PollID: string }[]
  >([]);
  const airtable = useAirtable();

  const generateHSL = () => {
    let h = Math.round(Math.random() * 360);
    let s = Math.round(Math.random() * (50 - 30) + 30);
    let l = Math.round(Math.random() * (50 - 30) + 30);

    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  useEffect(() => {
    if (airtable) {
      airtable("Polls")
        .select()
        .all()
        .then((results: Airtable.Records<{}>) => {
          if (results.length) {
            // Translate from airtable's wacky typing to our own
            const pollResults: any[] = results.map((result) => result.fields);

            // Find polls created by the user, or the user has voted in
            const validPolls = pollResults.filter((poll) => {
              const payload = JSON.parse(poll.PollPayload);

              return (
                payload.CreatedBy === UserID ||
                payload.PollOptions.some((options: any) =>
                  options.Votes.includes(UserID)
                )
              );
            });

            // Set State
            setPollList(
              validPolls.map((poll) => {
                const payload = JSON.parse(poll.PollPayload);
                return {
                  PollName: payload.PollName,
                  PollID: poll.PollID,
                };
              })
            );
          }
        });
    }
  }, [airtable]);

  return (
    <DirectoryContainer>
      {pollList.map((poll, index) => {
        return (
          <PollBlock
            ColorOne={generateHSL()}
            ColorTwo={generateHSL()}
            Direction={Math.round(Math.random() * 360)}
            key={`pollblock-${index}`}
            onClick={() => {
              window.open(`${window.location.origin}?p=${poll.PollID}`);
            }}
          >
            <PollImage
              alt={poll.PollName}
              src={`https://source.unsplash.com/random/${Math.round(
                Math.random() * (150 - 140) + 140
              )}x${Math.round(Math.random() * (150 - 140) + 140)}`}
            />
            <PollTitle>{poll.PollName}</PollTitle>
          </PollBlock>
        );
      })}
    </DirectoryContainer>
  );
};
