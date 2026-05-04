"use client";

import type { User, UserListItem } from "@/entities/user/model/types";
import { UserCompactCard } from "@/entities/user/ui/userCompactCard";
import { useUsersStore } from "@/features/users/model/usersStore";
import { AppDataGrid } from "@/shared/ui/dataGrid/appDataGrid";
import { useDataGridSearch } from "@/shared/ui/dataGrid/useDataGridSearch";
import type { DataGridToolbarAction } from "@/shared/ui/dataGrid/dataGridToolbar";
import type { MenuOptionAction } from "@/shared/ui/menu/menuOptions";
import AddIcon from "@mui/icons-material/Add";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { GridColDef, GridRenderCellParams, GridRowParams } from "@mui/x-data-grid/models";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AddUserDialog } from "../actions/addUserDialog";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isHeightLimited, setIsHeightLimited] = useState(true);
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

  const openUserDetails = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("userId", id);

      router.push(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    [searchParams, pathname, router],
  );

  const handleRowClick = (params: GridRowParams<UserListItem>) => {
    openUserDetails(params.row.id);
  };

  const handleHeightLimitToggle = useCallback(() => {
    setIsHeightLimited((value) => !value);
  }, []);

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
      openUserDetails(user.id);
    },
    [fetchUsers, openUserDetails, page, pageSize, search, setSearch, setSearchInput],
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
      <UserCompactCard {...params.row} onClick={() => openUserDetails(params.row.id)} />
    ),
    [openUserDetails],
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
          leftSlot: roleFilter,
          actions: toolbarActions,
          menuActions: toolbarMenuActions,
        }}
        sx={{
          cursor: "pointer",
        }}
      />

      <AddUserDialog
        open={isAddUserOpen}
        onClose={handleAddUserClose}
        onSuccess={handleAddUserSuccess}
      />
    </>
  );
};

export default UsersTable;
