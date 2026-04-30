"use client";

import { useMemo } from "react";

import AddIcon from "@mui/icons-material/Add";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {
  DataGridToolbarActions,
  DataGridToolbarActionsMenu,
  DataGridToolbarLayout,
  DataGridToolbarSearch,
  type DataGridToolbarAction,
} from "@/shared/ui/dataGrid/dataGridToolbar";
import type { MenuOptionAction } from "@/shared/ui/menu/menuOptions";

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    search?: string;
    onSearchChange?: (value: string) => void;
    isHeightLimited?: boolean;
    onHeightLimitToggle?: () => void;
    onAddUserClick?: () => void;
  }
}

export type UsersTableToolbarProps = {
  search?: string;
  onSearchChange?: (value: string) => void;
  isHeightLimited?: boolean;
  onHeightLimitToggle?: () => void;
  onAddUserClick?: () => void;
};

export const UsersTableToolbar = ({
  isHeightLimited = true,
  onAddUserClick,
  onHeightLimitToggle,
  onSearchChange,
  search = "",
}: UsersTableToolbarProps) => {
  const toolbarActions = useMemo<DataGridToolbarAction[]>(
    () => [
      {
        id: "add-user",
        label: "Добавить",
        icon: <AddIcon fontSize="small" />,
        onClick: onAddUserClick,
      },
    ],
    [onAddUserClick],
  );

  const menuActions = useMemo<MenuOptionAction[]>(
    () => [
      {
        id: "toggle-table-height",
        label: isHeightLimited ? "Раскрыть таблицу" : "Ограничить высоту",
        icon: isHeightLimited ? (
          <UnfoldMoreIcon fontSize="small" />
        ) : (
          <UnfoldLessIcon fontSize="small" />
        ),
        disabled: !onHeightLimitToggle,
        onClick: onHeightLimitToggle,
      },
    ],
    [isHeightLimited, onHeightLimitToggle],
  );

  return (
    <DataGridToolbarLayout
      leftSlot={
        <Select
          value="teacher"
          size="small"
          sx={{
            height: 50,
            minWidth: 120,
            outline: "none !important",
          }}
        >
          <MenuItem value="all">Все</MenuItem>
          <MenuItem value="teacher">Учитель</MenuItem>
          <MenuItem value="admin">Админ</MenuItem>
          <MenuItem value="student">Студент</MenuItem>
        </Select>
      }
    >
      <DataGridToolbarSearch value={search} onChange={onSearchChange ?? (() => undefined)} />
      <DataGridToolbarActions actions={toolbarActions} />
      <DataGridToolbarActionsMenu actions={menuActions} />
    </DataGridToolbarLayout>
  );
};
