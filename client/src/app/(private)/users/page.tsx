import { UserDetailsDrawer } from "@/widgets/user/ui/userDetailsDrawer";
import UsersStats from "@/widgets/users/stats";
import UsersTable from "@/widgets/users/tables/usersTable";
import Stack from "@mui/material/Stack";
import { Suspense } from "react";

export default function UsersPage() {
  return (
    <Stack spacing={2}>
      <UsersStats />

      <UsersTable />
      <UserDetailsDrawer />
    </Stack>
  );
}
