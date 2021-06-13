export const getCharSum = (text: string) => {
  let sum = 0;
  text.split("").forEach((x) => {
    sum += x.charCodeAt(0);
  });
  return sum;
};

export const clampNumber = (
  num: number,
  limit: { max?: number; min?: number }
): number => {
  const { max, min } = limit;

  if (max && num > max) {
    return max;
  }

  if (min && num < min) {
    return min;
  }

  return num;
};
