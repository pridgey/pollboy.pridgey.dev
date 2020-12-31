import { getTheme } from "./getTheme";

export const getColor = (Color: string) => {
  return getTheme().getColor(Color);
};