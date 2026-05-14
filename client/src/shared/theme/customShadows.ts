import { varAlpha } from "./utils";
import { grey, info, error, primary, success, warning, secondary } from "./palette";

export const customShadows = {
  // TODO убрать тени z - оставть только именные
  z1: `0 1px 2px 0 ${varAlpha(grey["500Channel"], 0.16)}`,
  z4: `0 4px 8px 0 ${varAlpha(grey["500Channel"], 0.16)}`,
  z8: `0 8px 16px 0 ${varAlpha(grey["500Channel"], 0.16)}`,
  z12: `0 12px 24px -4px ${varAlpha(grey["500Channel"], 0.16)}`,
  z16: `0 16px 32px -4px ${varAlpha(grey["500Channel"], 0.16)}`,
  z20: `0 20px 40px -4px ${varAlpha(grey["500Channel"], 0.16)}`,
  z24: `0 24px 48px 0 ${varAlpha(grey["500Channel"], 0.16)}`,

  card: `
    0 0 2px 0 ${varAlpha(grey["500Channel"], 0.2)},
    0 12px 24px -4px ${varAlpha(grey["500Channel"], 0.12)}
  `,

  dropdown: `
    0 0 2px 0 ${varAlpha(grey["500Channel"], 0.24)},
    0px 10px 20px -4px ${varAlpha(grey["500Channel"], 0.24)}
  `,

  dialog: `-10px 20px 40px -8px ${varAlpha(grey["800Channel"], 0.24)}`,

  primary: `0 8px 16px 0 ${varAlpha(primary.mainChannel, 0.24)}`,
  secondary: `0 8px 16px 0 ${varAlpha(secondary.mainChannel, 0.24)}`,
  info: `0 8px 16px 0 ${varAlpha(info.mainChannel, 0.24)}`,
  success: `0 8px 16px 0 ${varAlpha(success.mainChannel, 0.24)}`,
  warning: `0 8px 16px 0 ${varAlpha(warning.mainChannel, 0.24)}`,
  error: `0 8px 16px 0 ${varAlpha(error.mainChannel, 0.24)}`,
};
