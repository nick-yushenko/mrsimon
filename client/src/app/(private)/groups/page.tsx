import Stack from "@mui/material/Stack";

import { StudyGroups } from "@/widgets/studyGroups/table";
import { StudyGroupPreview } from "@/widgets/studyGroups/item/preview/studyGroupPreview";

export default function GroupsPage() {
  return (
    <Stack spacing={2}>
      <StudyGroups />
      <StudyGroupPreview />
    </Stack>
  );
}
