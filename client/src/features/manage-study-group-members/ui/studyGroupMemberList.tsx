"use client";

import type { GroupMemberRole } from "@/entities/studyGroup/model/types";

import { useState, useCallback } from "react";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import { useStudyGroupMemberListQuery } from "../model/queries";
import { useManageStudyGroupMembersActions } from "../model/actions";

type TProps = {
  groupId: number;
  role: GroupMemberRole;
};

export const StudyGroupMemberList = ({ groupId, role }: TProps) => {
  const [userId, setUserId] = useState("");
  const query = useStudyGroupMemberListQuery(groupId, role);
  const { addMember, removeMember, isAdding, isRemoving } = useManageStudyGroupMembersActions();

  const handleAdd = useCallback(async () => {
    const trimmedUserId = userId.trim();

    if (!trimmedUserId) {
      return;
    }

    await addMember({
      groupId,
      member: {
        userId: trimmedUserId,
        role,
      },
    });

    setUserId("");
  }, [addMember, groupId, role, userId]);

  const handleRemove = useCallback(
    async (memberUserId: string) => {
      await removeMember({ groupId, userId: memberUserId });
    },
    [groupId, removeMember],
  );

  if (query.isLoading) {
    return (
      <Typography variant="body2" color="text.secondary">
        Загрузка...
      </Typography>
    );
  }

  if (query.isError) {
    return (
      <Typography variant="body2" color="error">
        Не удалось загрузить список.
      </Typography>
    );
  }

  return (
    <Stack spacing={1}>
      {!query.data?.length && (
        <Typography variant="body2" color="text.secondary">
          Пока никого нет.
        </Typography>
      )}

      {query.data?.map((member) => {
        const memberName = [member.userName, member.userLastName].filter(Boolean).join(" ");

        return (
          <Stack
            key={member.id}
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Typography variant="subtitle1">{memberName}</Typography>

            <IconButton
              aria-label="Удалить участника"
              size="small"
              disabled={isRemoving}
              onClick={() => handleRemove(member.userId)}
            >
              <DeleteRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
        );
      })}

      <Stack direction="row" spacing={1}>
        <TextField
          value={userId}
          size="small"
          label="ID пользователя"
          onChange={(event) => setUserId(event.target.value)}
        />
        <Button type="button" variant="outlined" loading={isAdding} onClick={handleAdd}>
          Добавить
        </Button>
      </Stack>
    </Stack>
  );
};
