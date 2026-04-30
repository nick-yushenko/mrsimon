"use client";

import { UserDetailsDrawer } from "@/widgets/users/ui/userDetailsDrawer";
import { UsersCounter } from "@/widgets/users/ui/usersCounter";
import { UsersTable } from "@/widgets/users/ui/usersTable";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";

export default function UsersPage() {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
        <UsersCounter />
        <Card variant="plain">какая-то сводка</Card>
        <Card variant="plain">еще сводка</Card>
      </Stack>
      <UsersTable />
      <UserDetailsDrawer />
    </Stack>
  );
}
