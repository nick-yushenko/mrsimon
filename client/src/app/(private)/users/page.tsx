"use client";

import { UserDetailsDrawer } from "@/widgets/user/ui/userDetailsDrawer";
import { UsersSummary } from "@/widgets/users/ui/summary/usersSummary";
import { UsersTable } from "@/widgets/users/ui/usersTable";
import Stack from "@mui/material/Stack";

export default function UsersPage() {
  return (
    <Stack spacing={2}>
      <UsersSummary />
      <UsersTable />
      <UserDetailsDrawer />
    </Stack>
  );
}
