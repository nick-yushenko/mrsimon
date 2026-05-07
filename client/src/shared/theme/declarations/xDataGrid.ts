import type { ReactNode } from "react";
import type { AppTableToolbarAction } from "@/shared/ui/appTable";
import type { MenuOptionAction } from "@/shared/ui/menu/menuOptions";

import "@mui/x-data-grid";

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    actions?: AppTableToolbarAction[];
    leftSlot?: ReactNode;
    menuActions?: MenuOptionAction[];
    onSearchChange?: (value: string) => void;
    handleHeightLimitToggle?: () => void;
    rightSlot?: ReactNode;
    isHeightLimited?: boolean;
    search?: string;
  }
}
