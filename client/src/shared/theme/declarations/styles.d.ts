import type { ContainerQueries } from "../containerQueries";
import type {} from "@mui/material/themeCssVarsAugmentation";

import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    containerQueries: ContainerQueries;
    radius: {
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    customShadows: {
      z1: string;
      z4: string;
      z8: string;
      z12: string;
      z16: string;
      z20: string;
      z24: string;

      primary: string;
      secondary: string;
      info: string;
      success: string;
      warning: string;
      error: string;
      card: string;
      dropdown: string;
      dialog: string;
    };
  }
  interface ThemeOptions {
    containerQueries?: ContainerQueries;
    radius?: {
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
    };
    customShadows?: Partial<Theme["customShadows"]>;
  }

  interface PaletteColor {
    lighter?: string;
    darker?: string;
    lighterChannel: string;
    lightChannel: string;
    mainChannel: string;
    darkChannel: string;
    darkerChannel: string;
  }

  interface SimplePaletteColorOptions {
    lighter?: string;
    darker?: string;
    lighterChannel?: string;
    lightChannel?: string;
    mainChannel?: string;
    darkChannel?: string;
    darkerChannel?: string;
  }

  interface Color {
    "50Channel": string;
    "100Channel": string;
    "200Channel": string;
    "300Channel": string;
    "400Channel": string;
    "500Channel": string;
    "600Channel": string;
    "700Channel": string;
    "800Channel": string;
    "900Channel": string;
  }
}
