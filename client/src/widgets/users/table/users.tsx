"use client";

import type { GetUsersParams } from "@/entities/user/model/types";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { usersApi } from "@/entities/user/api/usersApi";

import { useDebouncedValue } from "@/shared/lib/hooks/useDebounce";
import AppTable, { AppTablePagination, DEFAULT_ROWS_PER_PAGE_OPTIONS } from "@/shared/ui/appTable";

import { UsersToolbar } from "./ui/toolbar";
import { UsersDataBody } from "./ui/dataBody";

export const useUsersListQuery = (params: Required<GetUsersParams>) => {
  return useQuery({
    queryKey: ["studyGroups", params],
    queryFn: () => usersApi.getUsers(params),
  });
};

export const Users = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebouncedValue(search, 400);

  const query = useUsersListQuery({
    page,
    pageSize,
    search: debouncedSearch,
  });

  const data = query.data;

  const onSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const onPageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
    setPage(1);
  };

  return (
    <AppTable
      toolbar={<UsersToolbar search={search} onSearchChange={onSearchChange} />}
      body={<UsersDataBody data={data} loading={query.isFetching} />}
      pagination={
        <AppTablePagination
          count={data?.totalCount ?? 0}
          page={data?.page ?? page}
          pageSize={data?.pageSize ?? pageSize}
          onPageChange={setPage}
          onPageSizeChange={onPageSizeChange}
          rowsPerPageOptions={DEFAULT_ROWS_PER_PAGE_OPTIONS}
        />
      }
    />
  );
};
