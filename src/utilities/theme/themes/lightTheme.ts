import { convertColorToCSS } from "../convertColorToCSS";

export class LightTheme {
  Colors: {
    [key: string]: {
      hue: number;
      saturation: number;
      lightness: number;
    };
  } = {
    background: {
      hue: 60,
      saturation: 1,
      lightness: 14,
    },
    foreground: {
      hue: 46,
      saturation: 100,
      lightness: 97,
    },
    black: {
      hue: 60,
      saturation: 1,
      lightness: 14,
    },
    white: {
      hue: 46,
      saturation: 100,
      lightness: 97,
    },
    blue: {
      hue: 207,
      saturation: 25,
      lightness: 55,
    },
    green: {
      hue: 162,
      saturation: 43,
      lightness: 46,
    },
    yellow: {
      hue: 42,
      saturation: 93,
      lightness: 64,
    },
    red: {
      hue: 359,
      saturation: 94,
      lightness: 63,
    },
    purple: {
      hue: 270,
      saturation: 73,
      lightness: 67,
    },
    grayOne: {
      hue: 60,
      saturation: 2,
      lightness: 54,
    },
    grayTwo: {
      hue: 60,
      saturation: 2,
      lightness: 59,
    },
    grayThree: {
      hue: 60,
      saturation: 2,
      lightness: 64,
    },
  };
  getColor = (col: string, opacity?: number): string => {
    if (col in this.Colors) {
      return convertColorToCSS(this.Colors[col], opacity);
    } else {
      return convertColorToCSS(this.Colors.blue, opacity);
    }
  };
}
