import type { UsersSearchParams } from "@/widgets/users/table";

import Stack from "@mui/material/Stack";

import { Users } from "@/widgets/users/table";
import UsersStats from "@/widgets/users/stats";
import { ProfilePreview } from "@/widgets/profile/preview/profilePreview";

type UsersPageProps = {
  searchParams?: Promise<UsersSearchParams>;
};

export default function UsersPage({ searchParams }: UsersPageProps) {
  return (
    <Stack spacing={2}>
      <UsersStats />

      <Users searchParams={searchParams} />
      <ProfilePreview />
    </Stack>
  );
}
