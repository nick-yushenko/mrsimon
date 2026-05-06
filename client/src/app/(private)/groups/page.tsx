import Stack from "@mui/material/Stack";

import UsersStats from "@/widgets/users/stats";
import { StudyGroupsTable } from "@/widgets/studyGroups/tables/studyGroupsTable";
import { StudyGroupPreview } from "@/widgets/studyGroups/item/preview/studyGroupPreview";

export default function GroupsPage() {
  return (
    <Stack spacing={2}>
      <UsersStats />

      <StudyGroupsTable />
      <StudyGroupPreview />
    </Stack>
  );
}
