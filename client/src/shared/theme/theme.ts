"use client";

import { palette } from "./palette";
import { typography } from "./typography";
import { shadows } from "./shadows";
import { dataGridCustomizations } from "./customizations/dataGrid";
import { surfacesCustomizations } from "./customizations/surfaces";
import { createTheme } from "@mui/material/styles";
import { inputsCustomizations } from "./customizations/inputs";
import { createContainerQueries } from "./containerQueries";

export const theme = createTheme({
  palette,
  typography,
  shadows,

  shape: {
    borderRadius: 8,
  },

  // TODO Проверить "красоту" и использование данных значений
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
