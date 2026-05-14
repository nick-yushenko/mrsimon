"use client";

import type { GroupMember } from "@/entities/studyGroup/model/types";

import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import GroupIcon from "@mui/icons-material/Group";

import { StudentCard } from "./studentCard";

type TProps = {
  students: GroupMember[];
  isLoading: boolean;
  onAdd: (userId: string) => void;
  onRemove: (userId: string) => void;
  isAdding: boolean;
  isRemoving: boolean;
  error?: string;
};

export const StudyGroupStudentList = ({
  students,
  onAdd,
  onRemove,
  isAdding,
  isRemoving,
}: TProps) => {
  return (
    <Stack spacing={1}>
      {/* TODO вынести в отдельный универсальный компонент - NoDataOverlay или что-то такое */}
      {!students.length && (
        <Stack
          sx={{
            alignItems: "center",
            height: "100%",
            justifyContent: "center",
            minHeight: 220,
            p: 3,
            textAlign: "center",
            color: "grey.300",
            userSelect: "none",
          }}
        >
          <GroupIcon
            sx={{
              width: 100,
              height: 100,
            }}
          />
          <Stack
            spacing={1}
            sx={{ alignItems: "center", maxWidth: 300, width: "100%", color: "text.secondary" }}
          >
            <Typography variant="subtitle1" sx={{ fontSize: "1.35rem" }}>
              Список пуст
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
              Добавьте учеников, чтобы они могли пользоваться платформой
            </Typography>
          </Stack>
        </Stack>
      )}

      {students?.map((member, index) => {
        return (
          <Stack key={member.id} direction="column" spacing={0}>
            {/* <Typography variant="subtitle1">{memberName}</Typography> */}

            {index !== 0 && <Divider variant="middle-dashed" />}

            <StudentCard {...member} onRemove={onRemove} isRemoving={isRemoving} />
          </Stack>
        );
      })}
    </Stack>
  );
};
