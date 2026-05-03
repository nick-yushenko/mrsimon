"use client";

import type { StudyGroupDetails, StudyGroupListItem } from "@/entities/studyGroup/model/types";
import { StudyGroupCompactCard } from "@/entities/studyGroup/ui/studyGroupCompactCard";
import { useStudyGroupsStore } from "@/features/studyGroups/model/studyGroupsStore";
import { formatDate } from "@/shared/lib/format/date";
import { formatCurrency } from "@/shared/lib/format/number";
import { AppDataGrid } from "@/shared/ui/dataGrid/appDataGrid";
import type { DataGridToolbarAction } from "@/shared/ui/dataGrid/dataGridToolbar";
import { useDataGridSearch } from "@/shared/ui/dataGrid/useDataGridSearch";
import type { MenuOptionAction } from "@/shared/ui/menu/menuOptions";
import { AddStudyGroupDialog } from "@/widgets/studyGroups/ui/addStudyGroupDialog";
import AddIcon from "@mui/icons-material/Add";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import type { GridColDef, GridRenderCellParams, GridRowParams } from "@mui/x-data-grid/models";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const statusLabels = {
  Active: "Активна",
  Archived: "В архиве",
} as const;

const staticColumns: GridColDef<StudyGroupListItem>[] = [
  {
    field: "subjectName",
    headerName: "Предмет",
    flex: 1,
    minWidth: 160,
  },
  {
    field: "pricePerLesson",
    headerName: "Цена",
    flex: 1,
    minWidth: 140,
    valueFormatter: (value: number) => formatCurrency(value),
  },
  {
    field: "period",
    headerName: "Период",
    flex: 1,
    minWidth: 210,
    valueGetter: (_value, row) => `${row.startsOn} ${row.endsOn}`,
    valueFormatter: (_value, row) => `${formatDate(row.startsOn)} - ${formatDate(row.endsOn)}`,
  },
  {
    field: "studentsCount",
    headerName: "Ученики",
    flex: 1,
    minWidth: 110,
  },
  {
    field: "status",
    headerName: "Статус",
    flex: 1,
    minWidth: 130,
    renderCell: (params) => (
      <Chip
        label={statusLabels[params.row.status]}
        color={params.row.status === "Active" ? "success" : "default"}
        size="small"
      />
    ),
  },
  {
    field: "createdAt",
    headerName: "Создана",
    minWidth: 150,
    valueFormatter: (value: string) => formatDate(value),
  },
];

export const StudyGroupsTable = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isHeightLimited, setIsHeightLimited] = useState(true);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);

  const fetchStudyGroups = useStudyGroupsStore((state) => state.fetchStudyGroups);

  const setPage = useStudyGroupsStore((state) => state.setPage);
  const setPageSize = useStudyGroupsStore((state) => state.setPageSize);

  const page = useStudyGroupsStore((state) => state.page);
  const pageSize = useStudyGroupsStore((state) => state.pageSize);
  const totalCount = useStudyGroupsStore((state) => state.totalCount);

  const search = useStudyGroupsStore((state) => state.search);
  const setSearch = useStudyGroupsStore((state) => state.setSearch);

  const includeArchived = useStudyGroupsStore((state) => state.includeArchived);
  const setIncludeArchived = useStudyGroupsStore((state) => state.setIncludeArchived);

  const { search: searchInput, setSearch: setSearchInput } = useDataGridSearch({
    value: search,
    onChange: setSearch,
  });

  const items = useStudyGroupsStore((state) => state.items);
  const isLoading = useStudyGroupsStore((state) => state.isLoading);
  const error = useStudyGroupsStore((state) => state.error);

  const openGroupDetails = useCallback(
    (id: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("groupId", String(id));

      router.push(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    [searchParams, pathname, router],
  );

  const handleRowClick = (params: GridRowParams<StudyGroupListItem>) => {
    openGroupDetails(params.row.id);
  };

  const handleHeightLimitToggle = useCallback(() => {
    setIsHeightLimited((value) => !value);
  }, []);

  const handleAddGroupOpen = useCallback(() => {
    setIsAddGroupOpen(true);
  }, []);

  const handleAddGroupClose = useCallback(() => {
    setIsAddGroupOpen(false);
  }, []);

  const handleAddGroupSuccess = useCallback(
    async (group: StudyGroupDetails) => {
      const shouldFetchManually = search === "" && page === 1 && !includeArchived;

      setSearchInput("");
      setSearch("");
      setIncludeArchived(false);

      if (shouldFetchManually) {
        await fetchStudyGroups({ page: 1, pageSize, search: "", includeArchived: false });
      }

      setIsAddGroupOpen(false);
      openGroupDetails(group.id);
    },
    [
      fetchStudyGroups,
      includeArchived,
      openGroupDetails,
      page,
      pageSize,
      search,
      setIncludeArchived,
      setSearch,
      setSearchInput,
    ],
  );

  const toolbarActions = useMemo<DataGridToolbarAction[]>(
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

  const toolbarMenuActions = useMemo<MenuOptionAction[]>(
    () => [
      {
        id: "toggle-table-height",
        label: isHeightLimited ? "Раскрыть таблицу" : "Ограничить высоту",
        icon: isHeightLimited ? (
          <UnfoldMoreIcon fontSize="small" />
        ) : (
          <UnfoldLessIcon fontSize="small" />
        ),
        onClick: handleHeightLimitToggle,
      },
    ],
    [handleHeightLimitToggle, isHeightLimited],
  );

  const archivedFilter = useMemo(
    () => (
      <FormControlLabel
        control={
          <Switch
            checked={includeArchived}
            onChange={(_, checked) => setIncludeArchived(checked)}
          />
        }
        label="Включая архивные"
        sx={{ flexShrink: 0, ml: 0 }}
      />
    ),
    [includeArchived, setIncludeArchived],
  );

  const renderGroupCell = useCallback(
    (params: GridRenderCellParams<StudyGroupListItem>) => (
      <StudyGroupCompactCard {...params.row} onClick={() => openGroupDetails(params.row.id)} />
    ),
    [openGroupDetails],
  );

  const columns = useMemo<GridColDef<StudyGroupListItem>[]>(() => {
    const result = [...staticColumns];

    result.splice(0, 0, {
      field: "group",
      headerName: "Группа",
      flex: 1,
      minWidth: 260,
      valueGetter: (_value, row) => `${row.name} ${row.subjectName} ${row.description ?? ""}`,
      renderCell: renderGroupCell,
    });

    return result;
  }, [renderGroupCell]);

  useEffect(() => {
    fetchStudyGroups({ page, pageSize, search, includeArchived });
  }, [fetchStudyGroups, includeArchived, page, pageSize, search]);

  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}

      <AppDataGrid
        rows={items}
        columns={columns}
        loading={isLoading}
        rowCount={totalCount}
        serverPagination={{
          page,
          pageSize,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
        }}
        onRowClick={handleRowClick}
        isHeightLimited={isHeightLimited}
        toolbarProps={{
          search: searchInput,
          onSearchChange: setSearchInput,
          leftSlot: archivedFilter,
          actions: toolbarActions,
          menuActions: toolbarMenuActions,
        }}
        sx={{
          cursor: "pointer",
        }}
      />

      <AddStudyGroupDialog
        open={isAddGroupOpen}
        onClose={handleAddGroupClose}
        onSuccess={handleAddGroupSuccess}
      />
    </>
  );
};
