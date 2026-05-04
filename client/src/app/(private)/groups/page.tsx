"use client";

import { StudyGroupDetailsDrawer } from "@/widgets/studyGroup/ui/studyGroupDetailsDrawer";
import { StudyGroupsTable } from "@/widgets/studyGroups/ui/studyGroupsTable";
import Stack from "@mui/material/Stack";
import { Suspense } from "react";

export default function GroupsPage() {
  return (
    <Suspense fallback={null}>
      <Stack spacing={2}>
        <StudyGroupsTable />
        <StudyGroupDetailsDrawer />
      </Stack>
    </Suspense>
  );
}
