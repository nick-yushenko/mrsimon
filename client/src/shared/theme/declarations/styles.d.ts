import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    radius: {
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    customShadows: {
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
  }

  interface SimplePaletteColorOptions {
    lighter?: string;
    darker?: string;
  }

  // TODO - удалить из проекта использование
  // interface Palette {
  //   chart: Color;
  // }

  // interface PaletteOptions {
  //   chart?: Partial<Color>;
  // }
}
