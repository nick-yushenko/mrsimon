import type { Theme, Components } from "@mui/material/styles";

export const inputsCustomizations: Components<Theme> = {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        textTransform: "none",
        fontWeight: 400,
      }),
      startIcon: {
        marginLeft: 0,
      },
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,

        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.divider,
        },

        // hover
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.text.primary,
        },

        // focus
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
        },
      }),
      input: ({ theme }) => ({
        "&.Mui-disabled": {
          WebkitTextFillColor: theme.palette.text.primary, // важно для Chrome
          color: theme.palette.text.primary,
          cursor: "default",
        },
      }),
    },
  },
  MuiAutocomplete: {
    defaultProps: {
      selectOnFocus: true,
      clearOnBlur: true,
      handleHomeEndKeys: true,
    },

    styleOverrides: {
      paper: ({ theme }) => ({
        boxShadow: theme.customShadows.dropdown,
        marginTop: 2,

        "& .MuiAutocomplete-listbox": {
          padding: 0,
        },
      }),
    },
  },

  MuiSelect: {
    styleOverrides: {},
  },

  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }) => ({
        boxShadow: theme.customShadows.dropdown,
        transform: "scale(1, 1)",
      }),
    },
  },
};
