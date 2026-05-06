import type { ReactNode } from "react";
import type { MenuOptionAction } from "@/shared/ui/menu/menuOptions";
import type { DataGridToolbarAction } from "@/shared/ui/dataGrid/dataGridToolbar";

import "@mui/x-data-grid";

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    actions?: DataGridToolbarAction[];
    leftSlot?: ReactNode;
    menuActions?: MenuOptionAction[];
    onSearchChange?: (value: string) => void;
    handleHeightLimitToggle?: () => void;
    rightSlot?: ReactNode;
    isHeightLimited?: boolean;
    search?: string;
  }
}
