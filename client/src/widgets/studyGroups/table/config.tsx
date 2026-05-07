"use client";

import type { GridColDef } from "@mui/x-data-grid/models";
import type { StudyGroupListItem } from "@/entities/studyGroup/model/types";

import Chip from "@mui/material/Chip";

import { StudyGroupCompactCard } from "@/entities/studyGroup/ui/studyGroupCompactCard";

import { formatCurrency } from "@/shared/lib/format/number";

const studyGroupStatusLabels: Record<StudyGroupListItem["status"], string> = {
  Active: "Активна",
  Archived: "В архиве",
};

const staticColumns: GridColDef<StudyGroupListItem>[] = [
  {
    field: "studentsCount",
    headerName: "Ученики",
    flex: 1,
    minWidth: 120,
  },
  {
    field: "pricePerLesson",
    headerName: "Стоимость",
    flex: 1,
    minWidth: 140,
    valueFormatter: (value: number) => formatCurrency(value),
  },
  {
    field: "startsOn",
    headerName: "Начало",
    flex: 1,
    minWidth: 140,
    valueFormatter: (value: string) => new Date(value).toLocaleDateString("ru-RU"),
  },
  {
    field: "status",
    headerName: "Статус",
    flex: 1,
    minWidth: 140,
    renderCell: (cellParams) => (
      <Chip
        label={studyGroupStatusLabels[cellParams.row.status]}
        color={cellParams.row.status === "Archived" ? "default" : "success"}
        size="small"
      />
    ),
  },
];

export const studyGroupsColumns: GridColDef<StudyGroupListItem>[] = [
  {
    field: "group",
    headerName: "Группа",
    flex: 1,
    minWidth: 260,
    renderCell: (cellParams) => <StudyGroupCompactCard {...cellParams.row} />,
    valueGetter: (_value, row) => `${row.name} ${row.subjectName} ${row.description ?? ""}`,
  },
  ...staticColumns,
];
