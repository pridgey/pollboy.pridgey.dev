import styles from "./PollCard.module.css";
import { A } from "solid-start";
import { RenderedPollProps } from "~/db/poll";
import { Match, Switch } from "solid-js";

export type PollCardProps = {
  Poll: RenderedPollProps;
};

export const PollCard = (props: PollCardProps) => {
  return (
    <A
      href={`/poll/${props.Poll.slug}`}
      classList={{
        [styles.container]: true,
        [styles.expired]: props.Poll.hasPollExpired,
      }}
      class={styles.container}
    >
      <div class={styles.titles}>
        <h1 class={styles.cardtitle}>{props.Poll.poll_name}</h1>
        <h2 class={styles.cardsubtitle}>{props.Poll.poll_desc}</h2>
      </div>
      <div class={styles.tagbox}>
        <div
          class={styles.tag}
          style={{ width: "100%" }}
          title="Why does this poll appear here?"
        >
          <Switch>
            <Match when={props.Poll.isPollOwner}>
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 24 24"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="User">
                  <g>
                    <path d="M17.438,21.937H6.562a2.5,2.5,0,0,1-2.5-2.5V18.61c0-3.969,3.561-7.2,7.938-7.2s7.938,3.229,7.938,7.2v.827A2.5,2.5,0,0,1,17.438,21.937ZM12,12.412c-3.826,0-6.938,2.78-6.938,6.2v.827a1.5,1.5,0,0,0,1.5,1.5H17.438a1.5,1.5,0,0,0,1.5-1.5V18.61C18.938,15.192,15.826,12.412,12,12.412Z"></path>
                    <path d="M12,9.911a3.924,3.924,0,1,1,3.923-3.924A3.927,3.927,0,0,1,12,9.911Zm0-6.847a2.924,2.924,0,1,0,2.923,2.923A2.926,2.926,0,0,0,12,3.064Z"></path>
                  </g>
                </g>
              </svg>
            </Match>
            <Match when={!props.Poll.isPollOwner}>
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 24 24"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Square_Check">
                  <g>
                    <path d="M18.437,20.939H5.563a2.5,2.5,0,0,1-2.5-2.5V5.566a2.5,2.5,0,0,1,2.5-2.5H18.437a2.5,2.5,0,0,1,2.5,2.5V18.439A2.5,2.5,0,0,1,18.437,20.939ZM5.563,4.066a1.5,1.5,0,0,0-1.5,1.5V18.439a1.5,1.5,0,0,0,1.5,1.5H18.437a1.5,1.5,0,0,0,1.5-1.5V5.566a1.5,1.5,0,0,0-1.5-1.5Z"></path>
                    <path d="M15.81,10.4c.45-.46-.26-1.17-.71-.71l-3.56,3.56c-.58-.58-1.16-1.15-1.73-1.73a.5.5,0,0,0-.71.71l2.08,2.08a.513.513,0,0,0,.71,0Z"></path>
                  </g>
                </g>
              </svg>
            </Match>
          </Switch>
          <span>
            {props.Poll.isPollOwner ? "Created By You" : "You Voted In This"}
          </span>
        </div>
        <div
          class={styles.tag}
          title={`Created At ${new Date(
            props.Poll.created_at || ""
          ).toLocaleDateString()}`}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 16 16"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6.445 12.688V7.354h-.633A12.6 12.6 0 0 0 4.5 8.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61h.675zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82h-.684zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23z"></path>
            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z"></path>
            <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z"></path>
          </svg>
          <span>
            {new Date(props.Poll.created_at || "").toLocaleDateString()}
          </span>
        </div>
        <div
          class={styles.tag}
          title={`${
            props.Poll.hasPollExpired
              ? "Poll expired on"
              : "Poll will expire on"
          } ${new Date(props.Poll.expire_at || "").toLocaleDateString()}`}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Lock">
              <g>
                <path d="M17.44,9.33h-1.1V6.4a4.34,4.34,0,0,0-8.68,0V9.33H6.56a2.5,2.5,0,0,0-2.5,2.5v7.61a2.507,2.507,0,0,0,2.5,2.5H17.44a2.507,2.507,0,0,0,2.5-2.5V11.83A2.5,2.5,0,0,0,17.44,9.33ZM8.66,6.4a3.34,3.34,0,0,1,6.68,0V9.33H8.66ZM18.94,19.44a1.511,1.511,0,0,1-1.5,1.5H6.56a1.511,1.511,0,0,1-1.5-1.5V11.83a1.5,1.5,0,0,1,1.5-1.5H17.44a1.5,1.5,0,0,1,1.5,1.5Z"></path>
                <path d="M13,14.95a.984.984,0,0,1-.5.86v1.5a.5.5,0,0,1-1,0v-1.5a.984.984,0,0,1-.5-.86,1,1,0,0,1,2,0Z"></path>
              </g>
            </g>
          </svg>
          <span>
            {props.Poll.hasPollExpired
              ? "Expired"
              : new Date(props.Poll.expire_at || "").toLocaleDateString()}
          </span>
        </div>
      </div>
    </A>
  );
};
