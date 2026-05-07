"use client";

import type { MenuOptionAction } from "@/shared/ui/menu/menuOptions";

import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";

type ToogleHeightActionProps = {
  isHeightLimited: boolean;
  onClick: () => void;
};

export const createToggleTableHeightAction = ({
  isHeightLimited,
  onClick,
}: ToogleHeightActionProps): MenuOptionAction => ({
  id: "toggle-table-height",
  label: isHeightLimited ? "Раскрыть таблицу" : "Ограничить высоту",
  icon: isHeightLimited ? <UnfoldMoreIcon fontSize="small" /> : <UnfoldLessIcon fontSize="small" />,
  onClick,
});
