import {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
  useContext,
  ReactNode,
} from "react";

type RecentPollType = {
  Slug: string;
  Name: string;
};
type ContextValueType = {
  recentPollsState: RecentPollType[];
  setRecentPolls: Dispatch<SetStateAction<RecentPollType[]>>;
};
type RecentPollsProps = { children: ReactNode };

const RecentPollsContext = createContext<ContextValueType>({
  recentPollsState: [],
  setRecentPolls: () => undefined,
});

const retrieveRecentPollsFromLocalStorage = () => {
  // Grab the recent polls from local storage
  const recentPollsStorage = localStorage.getItem("pb-recent-polls");
  const recentPollsResults: RecentPollType[] = JSON.parse(
    recentPollsStorage ?? "[]"
  );

  return recentPollsResults;
};

export const RecentPollProvider = ({ children }: RecentPollsProps) => {
  const [recentPollsState, setRecentPolls] = useState<RecentPollType[]>(
    retrieveRecentPollsFromLocalStorage()
  );

  const value = { recentPollsState, setRecentPolls };

  return (
    <RecentPollsContext.Provider value={value}>
      {children}
    </RecentPollsContext.Provider>
  );
};

export const useRecentPolls = () => {
  const context = useContext(RecentPollsContext);
  if (context === undefined) {
    return {
      recentPollsState: [],
      setRecentPolls: () => undefined,
    };
  }
  return context;
};
