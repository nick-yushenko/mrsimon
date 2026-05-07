import { Suspense } from "react";

import { usersApi } from "@/features/users/api/usersApi";

import { UsersDataBody } from "./ui/dataBody";
import { UsersTableShell } from "./tableShell";
import { UsersDataBodyServer } from "./server/dataBodyServer";
import { UsersPaginationServer } from "./server/paginationServer";
import { getUsersParams, type UsersSearchParamsPromise } from "./types";

type UsersProps = {
  searchParams?: UsersSearchParamsPromise;
};

const getUsersData = async (searchParams: UsersSearchParamsPromise) => {
  const params = getUsersParams(await searchParams);
  return usersApi.getUsers(params);
};

export const Users = ({ searchParams }: UsersProps) => {
  const dataPromise = getUsersData(searchParams);

  return (
    <UsersTableShell
      body={
        <Suspense fallback={<UsersDataBody loading />}>
          <UsersDataBodyServer dataPromise={dataPromise} />
        </Suspense>
      }
      pagination={
        <Suspense fallback={<div>TODO Loading</div>}>
          <UsersPaginationServer dataPromise={dataPromise} />
        </Suspense>
      }
    />
  );
};
