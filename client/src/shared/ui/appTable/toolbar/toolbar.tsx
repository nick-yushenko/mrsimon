"use client";

import type { AppTableToolbarAction } from "../types";
import type { Theme, SxProps } from "@mui/material/styles";

import { type ReactNode } from "react";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

import { MenuOptions, type MenuOptionAction } from "@/shared/ui/menu/menuOptions";

import { ToolbarSearch } from "./search";
import { useAppTableContext } from "../context";
import { AppTableToolbarActions } from "./actions";
import { createToggleTableHeightAction } from "../config";
import { ContainerGridItem } from "../../containerGridItem";

export type AppTableToolbarProps = {
  actions?: AppTableToolbarAction[];

  leftSlot?: ReactNode | ReactNode[];
  // TODO добавить второй слот для показа примененных фильтров и тд (будет второй строкой)
  // rightSlot?: ReactNode | ReactNode[];

  menuActions?: MenuOptionAction[];

  onSearchChange?: (value: string) => void;
  search?: string;
  searchPlaceholder?: string;

  isHeightLimited?: boolean;
  toggleHeightLimited?: () => void;

  sx?: SxProps<Theme>;
};

// TODO refactor names (remove AppTable prefix for ui folder)
export const AppTableToolbar = ({
  actions,
  leftSlot,
  menuActions = [],
  onSearchChange,
  search,
  searchPlaceholder,
  isHeightLimited,
  toggleHeightLimited,
  sx,
}: AppTableToolbarProps) => {
  const tableContext = useAppTableContext();
  const resolvedIsHeightLimited = isHeightLimited ?? tableContext?.isBodyHeightLimited ?? false;
  const resolvedToggleHeightLimited = toggleHeightLimited ?? tableContext?.toggleBodyHeightLimited;

  const baseMenuActions: MenuOptionAction[] = resolvedToggleHeightLimited
    ? [
        createToggleTableHeightAction({
          isHeightLimited: resolvedIsHeightLimited,
          onClick: resolvedToggleHeightLimited,
        }),
      ]
    : [];

  return (
    <Grid
      container
      spacing={2}
      sx={[
        {
          minHeight: 80,
          padding: "20px 16px 20px 20px",
          alignItems: "stretch",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <ContainerGridItem
        containerSize={{ xs: 12, sm: 4 }}
        spacing={1}
        sx={{ minWidth: 0, display: "flex", alignItems: "stretch" }}
      >
        {leftSlot}
      </ContainerGridItem>

      <ContainerGridItem
        containerSize={{ xs: 12, sm: 8 }}
        spacing={2}
        sx={{ display: "flex", justifyContent: "flex-end" }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: "flex-end", alignItems: "center", flex: 1 }}
        >
          <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", flex: 1 }}>
            {onSearchChange && (
              <ToolbarSearch
                value={search}
                onChange={onSearchChange}
                placeholder={searchPlaceholder}
                expandable={Boolean(actions)}
              />
            )}

            <AppTableToolbarActions actions={actions} />
          </Stack>

          <MenuOptions
            actions={[...baseMenuActions, ...menuActions]}
            ariaLabel="Действия с таблицей"
          />
        </Stack>
      </ContainerGridItem>
    </Grid>
  );
};
