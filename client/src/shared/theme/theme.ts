"use client";

import { createTheme } from "@mui/material/styles";

import { palette } from "./palette";
import { typography } from "./typography";
import { customShadows } from "./customShadows";
import { createContainerQueries } from "./containerQueries";
import { inputsCustomizations } from "./customizations/inputs";
import { dataGridCustomizations } from "./customizations/dataGrid";
import { surfacesCustomizations } from "./customizations/surfaces";
import { accordionCustomizations } from "./customizations/accordion";

export const theme = createTheme({
  cssVariables: {
    cssVarPrefix: "",
    colorSchemeSelector: "data-color-scheme",
  },

  palette,
  typography,
  customShadows,

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
    ...surfacesCustomizations,
    ...inputsCustomizations,
    ...accordionCustomizations,
    ...dataGridCustomizations,
  },
});

theme.containerQueries = createContainerQueries(theme.breakpoints.values);
