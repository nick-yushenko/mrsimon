import type { ThemeOptions } from "@mui/material/styles";

import { themeConfig } from "./themeConfig";
import { varAlpha, createPaletteChannel } from "./utils";

export const primary = createPaletteChannel(themeConfig.palette.primary);
export const secondary = createPaletteChannel(themeConfig.palette.secondary);
export const info = createPaletteChannel(themeConfig.palette.info);
export const success = createPaletteChannel(themeConfig.palette.success);
export const warning = createPaletteChannel(themeConfig.palette.warning);
export const error = createPaletteChannel(themeConfig.palette.error);
export const grey = createPaletteChannel(themeConfig.palette.grey);

export const palette: ThemeOptions["palette"] = {
  mode: "light",

  primary,
  secondary,
  info,
  success,
  warning,
  error,
  grey,

  text: {
    primary: grey[800],
    secondary: grey[600],
    disabled: grey[500],
  },

  background: {
    default: grey[100],
    paper: "#FFFFFF",
  },

  // TODO скорее всего ничего из этого не нужно
  action: {
    active: grey[600],
    hover: varAlpha(grey["500Channel"], 0.08),
    selected: varAlpha(grey["500Channel"], 0.16),
    disabled: varAlpha(grey["500Channel"], 0.8),
    disabledBackground: varAlpha(grey["500Channel"], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },

  divider: varAlpha(grey["500Channel"], 0.4),
};
