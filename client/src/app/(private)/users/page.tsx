import Stack from "@mui/material/Stack";

import UsersStats from "@/widgets/users/stats";
import UsersTable from "@/widgets/users/tables/usersTable";
import { ProfilePreview } from "@/widgets/profile/preview/profilePreview";

export default function UsersPage() {
  return (
    <Stack spacing={2}>
      <UsersStats />

      <UsersTable />
      <ProfilePreview />
    </Stack>
  );
}
