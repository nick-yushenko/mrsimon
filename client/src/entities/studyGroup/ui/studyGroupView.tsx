"use client";

import { useCallback, useMemo } from "react";

import type { StudyGroupDetails } from "@/entities/studyGroup/model/types";
import type { Subject } from "@/entities/subject/model/types";
import {
  createStudyGroupFormFields,
  normalizeStudyGroupFormValues,
  studyGroupFormSchema,
  toStudyGroupFormValues,
} from "@/features/studyGroups/model/studyGroupForm";
import type { StudyGroupFormValues } from "@/features/studyGroups/types";
import { formatCurrency } from "@/shared/lib/format/number";
import { EntityView, type EntityViewLayoutItem } from "@/shared/ui/entityView";
import { ContainerGridItem } from "@/shared/ui/containerGridItem";
import { OpenInNewLink } from "@/shared/ui/openInNew/openInNew";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export type StudyGroupViewActions = {
  edit?: (values: StudyGroupFormValues) => Promise<void>;
  archive?: (group: StudyGroupDetails) => Promise<void>;
  createSubject?: (name: string) => Promise<Subject>;
};

type StudyGroupViewProps = {
  id: string | number;
  group: StudyGroupDetails | null;
  isLoading?: boolean;
  isArchiving?: boolean;
  error?: string | null;
  variant?: "page" | "embedded";
  subjects?: Subject[];
  actions?: StudyGroupViewActions;
};

const statusLabels = {
  Active: "Активна",
  Archived: "В архиве",
} as const;

export const StudyGroupView = ({
  id,
  group,
  isLoading = false,
  isArchiving = false,
  error,
  variant = "page",
  subjects = [],
  actions,
}: StudyGroupViewProps) => {
  const isEmbedded = variant === "embedded";

  const formValues = useMemo(() => (group ? toStudyGroupFormValues(group) : null), [group]);

  const fields = useMemo(
    () =>
      createStudyGroupFormFields({
        subjects,
        currentSubject: group ? { id: group.subjectId, name: group.subjectName } : null,
        onCreateSubject: actions?.createSubject,
      }),
    [actions?.createSubject, group, subjects],
  );

  const teachersCount = useMemo(
    () => group?.members.filter((member) => member.role === "Teacher").length ?? 0,
    [group],
  );

  const renderGroupFields = useCallback((items: EntityViewLayoutItem<StudyGroupFormValues>[]) => {
    return (
      <Grid container spacing={2}>
        {items.map((item) => (
          <ContainerGridItem
            key={item.field.key}
            containerSize={{
              xs: 12,
              sm: item.field.key === "description" || item.field.key === "subjectId" ? 12 : 6,
            }}
          >
            {item.node}
          </ContainerGridItem>
        ))}
      </Grid>
    );
  }, []);

  const handleGroupSubmit = useCallback(
    async (values: StudyGroupFormValues) => {
      await actions?.edit?.(normalizeStudyGroupFormValues(values));
    },
    [actions],
  );

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
    <Grid container spacing={2}>
      {isEmbedded && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
          <OpenInNewLink href={`/groups/${id}`}>Перейти к группе</OpenInNewLink>
        </Box>
      )}

      <ContainerGridItem containerSize={{ xs: 12, md: 4 }}>
        <Card variant="plain" sx={{ p: 3 }}>
          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          )}

          {!isLoading && group && (
            <Stack spacing={2.5}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Chip
                    label={statusLabels[group.status]}
                    color={group.status === "Active" ? "success" : "default"}
                    size="small"
                  />
                  <Chip label={group.subjectName} color={"info"} size="small" />
                </Stack>

                <Typography variant={isEmbedded ? "h5" : "h4"}>{group.name}</Typography>

                {group.description && (
                  <Typography variant="body2" color="text.secondary">
                    {group.description}
                  </Typography>
                )}
              </Stack>

              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Цена за занятие
                  </Typography>
                  <Typography variant="subtitle1">
                    {formatCurrency(group.pricePerLesson)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Ученики
                  </Typography>
                  <Typography variant="subtitle1">{group.studentsCount}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Преподаватели
                  </Typography>
                  <Typography variant="subtitle1">{teachersCount}</Typography>
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
        </Card>
      </ContainerGridItem>

      <ContainerGridItem containerSize={{ xs: 12, md: 8 }}>
        <Card sx={{ p: 3, containerType: "inline-size" }} variant="plain">
          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          )}

          {!isLoading && error && <Alert severity="error">{error}</Alert>}

          {!isLoading && !error && group && formValues && (
            <EntityView
              entity={formValues}
              fields={fields}
              schema={studyGroupFormSchema}
              editable
              defaultEditMode
              renderFields={renderGroupFields}
              onSubmit={handleGroupSubmit}
            />
          )}

          {!isLoading && !error && !group && (
            <Typography color="text.secondary">Группа не найдена.</Typography>
          )}
        </Card>
      </ContainerGridItem>
    </Grid>
  );
};
