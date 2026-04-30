"use client";

import type { User, UserListItem } from "@/entities/user/model/types";
import { UserCompactCard } from "@/entities/user/ui/userCompactCard";
import { useUsersStore } from "@/features/users/model/usersStore";
import { useDebouncedValue } from "@/shared/lib/hooks/useDebounce";
import { AddUserDialog } from "@/widgets/users/ui/addUserDialog";
import { UsersTableToolbar } from "@/widgets/users/ui/usersTableToolbar";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import type {
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
  GridRowParams,
} from "@mui/x-data-grid/models";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

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

export const UsersTable = () => {
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

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearchInput = useDebouncedValue(searchInput, 400);

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

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    setPage(model.page + 1);
    setPageSize(model.pageSize);
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
    [fetchUsers, openUserDetails, page, pageSize, search, setSearch],
  );

  const paginationModel: GridPaginationModel = {
    page: page - 1,
    pageSize,
  };

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

  useEffect(() => {
    setSearch(debouncedSearchInput);
  }, [debouncedSearchInput, setSearch]);

  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}

      <Card
        variant="plain"
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minHeight: 432,
          height: isHeightLimited ? 432 : "auto",
          maxHeight: isHeightLimited ? 432 : "none",
          p: 0,
        }}
      >
        <DataGrid
          rows={items}
          columns={columns}
          loading={isLoading}
          rowCount={totalCount}
          pagination
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[5, 10, 25]}
          onRowClick={handleRowClick}
          disableRowSelectionOnClick
          showToolbar
          autoHeight={!isHeightLimited}
          // getRowHeight={() => "auto"}
          slots={{
            toolbar: UsersTableToolbar,
          }}
          slotProps={{
            toolbar: {
              search: searchInput,
              onSearchChange: setSearchInput,
              isHeightLimited,
              onHeightLimitToggle: handleHeightLimitToggle,
              onAddUserClick: handleAddUserOpen,
            },
          }}
          sx={{
            cursor: "pointer",
          }}
        />
      </Card>

      <AddUserDialog
        open={isAddUserOpen}
        onClose={handleAddUserClose}
        onSuccess={handleAddUserSuccess}
      />
    </>
  );
};
