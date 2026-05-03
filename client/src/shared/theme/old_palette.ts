import type { ThemeOptions } from "@mui/material/styles";

export const palette: ThemeOptions["palette"] = {
  primary: {
    // main: '#1B84FF',
    // light: '#EDF5FD',
    // dark: '#1B84FF',
    main: "#106E83",
    light: "#E7F7FB",
    // TODO подобрать цвет
    dark: "#108299",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#43CED7",
    light: "#b9eefc",
    dark: "#43CED7",
    contrastText: "#ffffff",
  },
  success: {
    main: "#2cd07e",
    light: "#EDFDF2",
    dark: "#2cd07e",
    contrastText: "#ffffff",
  },
  info: {
    main: "#725AF2",
    light: "#e9e5ff",
    dark: "#725AF2",
    contrastText: "#ffffff",
  },
  error: {
    main: "#F8285A",
    light: "#FFF0F4",
    dark: "#F8285A",
    contrastText: "#ffffff",
  },
  warning: {
    main: "#F6C000",
    light: "#FFFCF0",
    dark: "#F6C000",
    contrastText: "#ffffff",
  },
  grey: {
    100: "#f2f4f8",
    200: "#e9ecef",
    300: "#dee2e6",
    400: "#ced4da",
    500: "#768B9E",
    600: "#2a3547",
  },
  chart: {
    50: "#f0fdff",
    100: "#d4f4e1",
    200: "#1daa78",
    300: "#66e6f3",
    400: "#33ddef",
    500: "#00d5eb",
    600: "#00aabb",
    700: "#007f8c",
    800: "#00555c",
    900: "#002a2e",
  },
  text: {
    primary: "#3A4752",
    secondary: "#768B9E",
  },
  action: {
    disabledBackground: "rgba(73,82,88,0.12)",
    hoverOpacity: 0.1,
    hover: "#E7F7FB",
  },
  divider: "#ebf1f6",
  background: {
    default: "#f4f7f9",
    paper: "#ffffff",
  },
};
