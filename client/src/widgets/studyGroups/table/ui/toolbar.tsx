"use client";

import type { AppTableToolbarAction } from "@/shared/ui/appTable";
import type { StudyGroupDetails } from "@/entities/studyGroup/model/types";

import { useMemo, useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import Switch from "@mui/material/Switch";
import AddIcon from "@mui/icons-material/Add";
import FormControlLabel from "@mui/material/FormControlLabel";

import { AppTableToolbar } from "@/shared/ui/appTable";

import { AddDialog } from "../../actions/addDialog";

export type StudyGroupsToolbarProps = {
  includeArchived: boolean;
  onIncludeArchivedChange: (includeArchived: boolean) => void;
  onSearchChange: (search: string) => void;
  search: string;
};

export const StudyGroupsToolbar = ({
  includeArchived,
  onIncludeArchivedChange,
  onSearchChange,
  search,
}: StudyGroupsToolbarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);

  const openGroup = useCallback(
    (id: number) => {
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.set("groupId", String(id));

      window.history.pushState(null, "", `${pathname}?${nextParams.toString()}`);
    },
    [pathname, searchParams],
  );

  const handleAddGroupSuccess = useCallback(
    async (group: StudyGroupDetails) => {
      setIsAddGroupOpen(false);
      router.refresh();
      openGroup(group.id);
    },
    [openGroup, router],
  );

  const handleAddGroupOpen = useCallback(() => {
    setIsAddGroupOpen(true);
  }, []);

  const handleAddGroupClose = useCallback(() => {
    setIsAddGroupOpen(false);
  }, []);

  const actions = useMemo<AppTableToolbarAction[]>(
    () => [
      {
        id: "add-group",
        label: "Создать",
        icon: <AddIcon fontSize="small" />,
        onClick: handleAddGroupOpen,
      },
    ],
    [handleAddGroupOpen],
  );

  const archivedFilter = useMemo(
    () => (
      <FormControlLabel
        control={
          <Switch
            checked={includeArchived}
            onChange={(_, checked) => onIncludeArchivedChange(checked)}
          />
        }
        label="Включая архивные"
        sx={{ flexShrink: 1, ml: 0, mr: 0 }}
      />
    ),
    [includeArchived, onIncludeArchivedChange],
  );

  return (
    <>
      <AppTableToolbar
        actions={actions}
        leftSlot={archivedFilter}
        onSearchChange={onSearchChange}
        search={search}
        searchPlaceholder="Поиск групп..."
      />

      <AddDialog
        open={isAddGroupOpen}
        onClose={handleAddGroupClose}
        onSuccess={handleAddGroupSuccess}
      />
    </>
  );
};
