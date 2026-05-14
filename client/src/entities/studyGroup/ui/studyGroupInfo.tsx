"use client";

import type { StudyGroupViewActions } from "./studyGroupView";
import type { StudyGroupDetails } from "@/entities/studyGroup/model/types";

import { useCallback } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";

import { StudyGroupMemberList } from "@/features/manage-study-group-members/ui/studyGroupMemberList";

import { formatCurrency } from "@/shared/lib/format/number";
import { SkeletonTypography } from "@/shared/ui/skeleton/typography";

const statusLabels = {
  Active: "Активна",
  Archived: "В архиве",
} as const;

type TProps = {
  group: StudyGroupDetails | null;

  isEmbedded: boolean;
  isLoading: boolean;

  actions?: StudyGroupViewActions;
  isArchiving?: boolean;
};

export const StudyGroupInfo = ({ group, isEmbedded, isLoading, isArchiving, actions }: TProps) => {
  const handleArchive = useCallback(async () => {
    if (!group || group.status === "Archived") {
      return;
    }

    const shouldArchive = window.confirm(`Архивировать группу "${group.name}"?`);

    if (!shouldArchive) {
      return;
    }

    await actions?.archive?.(group);
  }, [actions, group]);

  return (
    <Card variant="plain">
      <CardContent>
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {!isLoading && group && (
          <Stack spacing={2}>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Chip
                  label={statusLabels[group.status]}
                  color={group.status === "Active" ? "success" : "default"}
                  size="small"
                />
                <Chip label={group.subjectName} color={"info"} size="small" />
              </Stack>

              <SkeletonTypography variant={isEmbedded ? "h5" : "h4"} loading={isLoading}>
                {group.name}
              </SkeletonTypography>

              <SkeletonTypography variant="body2" color="text.secondary" loading={isLoading}>
                {group.description}
              </SkeletonTypography>
            </Stack>

            <Stack spacing={1.5}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Цена за занятие
                </Typography>
                <Typography variant="subtitle1">{formatCurrency(group.pricePerLesson)}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Ученики
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Преподаватели
                </Typography>
                <StudyGroupMemberList groupId={group.id} role="Teacher" />
              </Box>
            </Stack>

            {group.status !== "Archived" && (
              <Button
                type="button"
                variant="outlined"
                color="warning"
                startIcon={<ArchiveRoundedIcon />}
                loading={isArchiving}
                onClick={handleArchive}
              >
                Архивировать
              </Button>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};
