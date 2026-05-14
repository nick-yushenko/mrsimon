"use client";

import type { Subject } from "@/entities/subject/model/types";
import type { StudyGroupDetails, StudyGroupFormValues } from "@/entities/studyGroup/model/types";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardHeader, CardContent } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

import { StudyGroupMemberList } from "@/features/manage-study-group-members/ui/studyGroupMemberList";

import { OpenInNewLink } from "@/shared/ui/openInNew/openInNew";
import { ContainerGridItem } from "@/shared/ui/containerGridItem";

import { StudyGroupInfo } from "./studyGroupInfo";

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

  const handleAddMember = (userId: string) => {};

  return (
    <Grid container spacing={2}>
      {isEmbedded && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
          <OpenInNewLink href={`/groups/${id}`}>Перейти к группе</OpenInNewLink>
        </Box>
      )}

      <ContainerGridItem containerSize={{ xs: 12, md: 6 }}>
        <StudyGroupInfo
          group={group}
          actions={actions}
          isEmbedded={isEmbedded}
          isLoading={isLoading}
          isArchiving={isArchiving}
        />
      </ContainerGridItem>

      <ContainerGridItem containerSize={{ xs: 12, md: 6 }}>
        <Card sx={{ containerType: "inline-size" }} variant="plain">
          <CardHeader
            subheader={
              <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="h5">Ученики:</Typography>
                <Button
                  startIcon={<PersonAddAlt1Icon />}
                  size="medium"
                  disabled={false}
                  onClick={() => handleAddMember("")}
                  color="primary"
                >
                  Добавить
                </Button>
              </Stack>
            }
          />
          <CardContent>
            {isLoading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                <CircularProgress />
              </Box>
            )}
            <StudyGroupMemberList groupId={group?.id ?? 0} role="Student" />
          </CardContent>
        </Card>
      </ContainerGridItem>
    </Grid>
  );
};
