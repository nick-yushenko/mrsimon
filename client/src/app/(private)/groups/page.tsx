import type { StudyGroupsSearchParams } from "@/widgets/studyGroups/table";

import Stack from "@mui/material/Stack";

import { StudyGroups } from "@/widgets/studyGroups/table";
import { StudyGroupPreview } from "@/widgets/studyGroups/item/preview/studyGroupPreview";

type GroupsPageProps = {
  searchParams?: Promise<StudyGroupsSearchParams>;
};

export default function GroupsPage({ searchParams }: GroupsPageProps) {
  return (
    <Stack spacing={2}>
      <StudyGroups searchParams={searchParams} />
      <StudyGroupPreview />
    </Stack>
  );
}
