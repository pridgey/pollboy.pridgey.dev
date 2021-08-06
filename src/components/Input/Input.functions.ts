export const convertDateToMinMax = (date?: Date) => {
  const year = date?.getFullYear() ?? 0;
  const month = (date?.getMonth() ?? 0) + 1;
  const day = date?.getDate() ?? 0;

  return `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
};
