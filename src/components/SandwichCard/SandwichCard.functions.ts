export const getCharSum = (text: string) => {
  let sum = 0;
  text.split("").forEach((x) => {
    sum += x.charCodeAt(0);
  });
  return sum;
};
