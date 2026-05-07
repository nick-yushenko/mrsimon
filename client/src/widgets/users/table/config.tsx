"use client";

import type { GridColDef } from "@mui/x-data-grid/models";
import type { UserListItem } from "@/entities/user/model/types";

import { UserCompactCard } from "@/entities/user/ui/userCompactCard";

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

export const usersColumns: GridColDef<UserListItem>[] = [
  {
    field: "user",
    headerName: "Пользователь",
    flex: 1,
    minWidth: 250,
    valueGetter: (_value, row) => `${row.lastName} ${row.name} ${row.email}`,
    renderCell: (cellParams) => <UserCompactCard {...cellParams.row} />,
  },
  ...staticColumns,
];
