"use client";

import type { AppTableToolbarAction } from "../types";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

type AppTableToolbarActionsProps = {
  actions?: AppTableToolbarAction[];
};

export const AppTableToolbarActions = ({ actions = [] }: AppTableToolbarActionsProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (!actions.length) {
    return null;
  }

  return (
    <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
      {actions.map((action) => (
        <Button
          key={action.id}
          size="large"
          variant="contained"
          {...action.buttonProps}
          disabled={action.disabled}
          onClick={action.onClick}
          disableFocusRipple
          startIcon={action.icon ?? <AddIcon fontSize="small" />}
          sx={{
            p: isSmallScreen ? 1 : 2,
            height: 50,
            minWidth: 50,
            gap: "6px",
            "& .MuiButton-startIcon": {
              marginRight: 0,
              marginLeft: 0,
            },
          }}
        >
          {isSmallScreen ? null : action.label}
        </Button>
      ))}
    </Stack>
  );
};
