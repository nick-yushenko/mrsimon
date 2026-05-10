import Stack from "@mui/material/Stack";

import { Users } from "@/widgets/users/table";
import UsersAnalytics from "@/widgets/users/analytics";
import { ProfilePreview } from "@/widgets/profile/preview/profilePreview";

export default function UsersPage() {
  return (
    <Stack spacing={2}>
      <UsersAnalytics />

      <Users />
      <ProfilePreview />
    </Stack>
  );
}
