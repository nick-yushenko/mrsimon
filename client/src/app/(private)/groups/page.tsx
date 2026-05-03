"use client";

import { StudyGroupDetailsDrawer } from "@/widgets/studyGroup/ui/studyGroupDetailsDrawer";
import { StudyGroupsTable } from "@/widgets/studyGroups/ui/studyGroupsTable";
import Stack from "@mui/material/Stack";

export default function GroupsPage() {
  return (
    <Stack spacing={2}>
      <StudyGroupsTable />
      <StudyGroupDetailsDrawer />
    </Stack>
  );
}
