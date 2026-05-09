"use client";

import { createTheme } from "@mui/material/styles";

import { palette } from "./palette";
import { shadows } from "./shadows";
import { typography } from "./typography";
import { createContainerQueries } from "./containerQueries";
import { inputsCustomizations } from "./customizations/inputs";
import { dataGridCustomizations } from "./customizations/dataGrid";
import { surfacesCustomizations } from "./customizations/surfaces";

export const theme = createTheme({
  cssVariables: {
    cssVarPrefix: "",
    colorSchemeSelector: "data-color-scheme",
  },

  palette,
  typography,
  shadows,

  shape: {
    borderRadius: 8,
  },

  radius: {
    sm: 8, // inputs
    md: 12, // small cards / panels
    lg: 16, // cards
    xl: 24, // modals / big surfaces
  },

  components: {
    ...inputsCustomizations,
    ...dataGridCustomizations,
    ...surfacesCustomizations,
  },
});

theme.containerQueries = createContainerQueries(theme.breakpoints.values);
