export const calculateVotePercentage = (
  votesForOption: number,
  totalVotes: number
) => {
  return votesForOption / totalVotes;
};
