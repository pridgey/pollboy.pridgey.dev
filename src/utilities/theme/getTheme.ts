import { DarkTheme, LightTheme } from "./themes";

export const getTheme = () => {
  let resultingTheme;

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    resultingTheme = new DarkTheme();
  } else {
    resultingTheme = new LightTheme();
  }

  return resultingTheme;
};
