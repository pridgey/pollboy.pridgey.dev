export const convertColorToCSS = (color: any, opacity?: number) => {
  if (opacity !== undefined) {
    return `hsla(${color.hue}, ${color.saturation}%, ${color.lightness}%, ${opacity})`;
  }
  return `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;
};
