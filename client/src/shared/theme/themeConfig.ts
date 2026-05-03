export type PaletteColorKey = "primary" | "secondary" | "info" | "success" | "warning" | "error";

export const themeConfig = {
  palette: {
    primary: {
      lighter: "#E6F4F7",
      light: "#7FB8C4",
      main: "#106E83",
      dark: "#0C5566",
      darker: "#083B47",
      contrastText: "#FFFFFF",
    },

    secondary: {
      lighter: "#EEE7FF",
      light: "#9B8CDB",
      main: "#7A5AF8",
      dark: "#5B3FC4",
      darker: "#3E2A8F",
      contrastText: "#FFFFFF",
    },

    info: {
      lighter: "#E3F6FD",
      light: "#6EC1E4",
      main: "#1DA4D4",
      dark: "#14779C",
      darker: "#0D4F66",
      contrastText: "#FFFFFF",
    },

    success: {
      lighter: "#E9F8F0",
      light: "#86D9A8",
      main: "#3BAA6F",
      dark: "#287A50",
      darker: "#1A4F34",
      contrastText: "#FFFFFF",
    },

    warning: {
      lighter: "#FFF4E5",
      light: "#F6C177",
      main: "#E09A3E",
      dark: "#A86B1E",
      darker: "#6F4512",
      contrastText: "#FFFFFF",
    },
    error: {
      lighter: "#FDECEC",
      light: "#E88A8A",
      main: "#D95757",
      dark: "#9C2F2F",
      darker: "#661D1D",
      contrastText: "#FFFFFF",
    },

    grey: {
      50: "#FCFDFD",
      100: "#F9FAFB",
      200: "#F4F6F8",
      300: "#DFE3E8",
      400: "#C4CDD5",
      500: "#919EAB",
      600: "#637381",
      700: "#454F5B",
      800: "#1C252E",
      900: "#141A21",
    },
  },
  classesPrefix: "mrsimon",
} as const;
