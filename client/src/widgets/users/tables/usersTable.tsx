"use client";

import type { User, UserListItem } from "@/entities/user/model/types";
import type { DataGridToolbarAction } from "@/shared/ui/dataGrid/dataGridToolbar";
import type { GridColDef, GridRowParams, GridRenderCellParams } from "@mui/x-data-grid/models";

import { usePathname, useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect, useCallback } from "react";

import Alert from "@mui/material/Alert";
import Select from "@mui/material/Select";
import AddIcon from "@mui/icons-material/Add";
import MenuItem from "@mui/material/MenuItem";

import { useUsersStore } from "@/features/users/model/usersStore";

import { UserCompactCard } from "@/entities/user/ui/userCompactCard";

import { AppDataGrid } from "@/shared/ui/dataGrid/appDataGrid";
import { useDataGridSearch } from "@/shared/ui/dataGrid/useDataGridSearch";

import { AddDialog } from "../actions/addDialog";

const staticColumns: GridColDef<UserListItem>[] = [
  {
    field: "role",
    headerName: "Роль",
    flex: 1,
    minWidth: 120,
  },
  {
    field: "createdAt",
    headerName: "Создан",
    flex: 1,
    minWidth: 180,
    valueFormatter: (value: string) => new Date(value).toLocaleDateString("ru-RU"),
  },
];

const UsersTable = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const fetchUsers = useUsersStore((state) => state.fetchUsers);

  const setPage = useUsersStore((state) => state.setPage);
  const setPageSize = useUsersStore((state) => state.setPageSize);

  const page = useUsersStore((state) => state.page);
  const pageSize = useUsersStore((state) => state.pageSize);
  const totalCount = useUsersStore((state) => state.totalCount);

  const search = useUsersStore((state) => state.search);
  const setSearch = useUsersStore((state) => state.setSearch);

  const { search: searchInput, setSearch: setSearchInput } = useDataGridSearch({
    value: search,
    onChange: setSearch,
  });

  const items = useUsersStore((state) => state.items);
  const isLoading = useUsersStore((state) => state.isLoading);
  const error = useUsersStore((state) => state.error);

  const openProfile = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("userId", id);

      window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
    },
    [searchParams, pathname],
  );

  const handleRowClick = (params: GridRowParams<UserListItem>) => {
    openProfile(params.row.id);
  };

  const handleAddUserOpen = useCallback(() => {
    setIsAddUserOpen(true);
  }, []);

  const handleAddUserClose = useCallback(() => {
    setIsAddUserOpen(false);
  }, []);

  const handleAddUserSuccess = useCallback(
    async (user: User) => {
      const shouldFetchManually = search === "" && page === 1;

      setSearchInput("");
      setSearch("");

      if (shouldFetchManually) {
        await fetchUsers({ page: 1, pageSize, search: "" });
      }

      setIsAddUserOpen(false);
      openProfile(user.id);
    },
    [fetchUsers, openProfile, page, pageSize, search, setSearch, setSearchInput],
  );

  const toolbarActions = useMemo<DataGridToolbarAction[]>(
    () => [
      {
        id: "add-user",
        label: "Добавить",
        icon: <AddIcon fontSize="small" />,
        onClick: handleAddUserOpen,
      },
    ],
    [handleAddUserOpen],
  );

  const roleFilter = useMemo(
    () => (
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
    ),
    [],
  );

  const renderUserCell = useCallback(
    (params: GridRenderCellParams<UserListItem>) => (
      <UserCompactCard {...params.row} onClick={() => openProfile(params.row.id)} />
    ),
    [openProfile],
  );

  const columns = useMemo<GridColDef<UserListItem>[]>(() => {
    const result = [...staticColumns];

    // вставка на нулевое место
    result.splice(0, 0, {
      field: "user",
      headerName: "Пользователь",
      flex: 1,
      minWidth: 250,
      // sortable: false,
      valueGetter: (_value, row) => {
        return `${row.lastName} ${row.name} ${row.email}`;
      },
      renderCell: renderUserCell,
    });

    return result;
  }, [renderUserCell]);

  useEffect(() => {
    fetchUsers({ page, pageSize, search });
  }, [fetchUsers, page, pageSize, search]);

  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}

      <AppDataGrid
        rows={items}
        columns={columns}
        loading={isLoading}
        rowCount={totalCount}
        defaultHeightLimited={true}
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
          leftSlot: roleFilter,
          actions: toolbarActions,
        }}
        sx={{
          cursor: "pointer",
        }}
      />

      <AddDialog
        open={isAddUserOpen}
        onClose={handleAddUserClose}
        onSuccess={handleAddUserSuccess}
      />
    </>
  );
};

export default UsersTable;
