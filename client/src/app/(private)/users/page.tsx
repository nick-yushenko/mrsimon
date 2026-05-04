"use client";

import { UserDetailsDrawer } from "@/widgets/user/ui/userDetailsDrawer";
import { UsersSummary } from "@/widgets/users/ui/summary/usersSummary";
import { UsersTable } from "@/widgets/users/ui/usersTable";
import Stack from "@mui/material/Stack";
import { Suspense } from "react";

export default function UsersPage() {
  return (
    <Suspense fallback={null}>
      <Stack spacing={2}>
        <UsersSummary />
        <UsersTable />
        <UserDetailsDrawer />
      </Stack>
    </Suspense>
  );
}
