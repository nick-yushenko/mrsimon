"use client";

import type { DataGridToolbarAction } from "@/shared/ui/dataGrid/dataGridToolbar";
import type { StudyGroupDetails, StudyGroupListItem } from "@/entities/studyGroup/model/types";
import type { GridColDef, GridRowParams, GridRenderCellParams } from "@mui/x-data-grid/models";

import { usePathname, useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect, useCallback } from "react";

import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import Switch from "@mui/material/Switch";
import AddIcon from "@mui/icons-material/Add";
import FormControlLabel from "@mui/material/FormControlLabel";

import { useStudyGroupsStore } from "@/features/studyGroups/model/studyGroupsStore";

import { StudyGroupCompactCard } from "@/entities/studyGroup/ui/studyGroupCompactCard";

import { formatDate } from "@/shared/lib/format/date";
import { formatCurrency } from "@/shared/lib/format/number";
import { AppDataGrid } from "@/shared/ui/dataGrid/appDataGrid";
import { useDataGridSearch } from "@/shared/ui/dataGrid/useDataGridSearch";

import { AddDialog } from "../actions/addDialog";

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
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

  const openGroup = useCallback(
    (id: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("groupId", String(id));

      window.history.pushState(null, "", `${pathname}?${params.toString()}`);
    },
    [searchParams, pathname],
  );

  const handleRowClick = (params: GridRowParams<StudyGroupListItem>) => {
    openGroup(params.row.id);
  };

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
      openGroup(group.id);
    },
    [
      fetchStudyGroups,
      includeArchived,
      openGroup,
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
      <StudyGroupCompactCard {...params.row} onClick={() => openGroup(params.row.id)} />
    ),
    [openGroup],
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
        toolbarProps={{
          search: searchInput,
          onSearchChange: setSearchInput,
          leftSlot: archivedFilter,
          actions: toolbarActions,
        }}
        sx={{
          cursor: "pointer",
        }}
      />

      <AddDialog
        open={isAddGroupOpen}
        onClose={handleAddGroupClose}
        onSuccess={handleAddGroupSuccess}
      />
    </>
  );
};
