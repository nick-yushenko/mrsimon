"use client";

import { useState } from "react";

import { useStudyGroupListQuery } from "@/entities/studyGroup/model/queries";

import { useDebouncedValue } from "@/shared/lib/hooks/useDebounce";
import { AppTable, AppTablePagination, DEFAULT_ROWS_PER_PAGE_OPTIONS } from "@/shared/ui/appTable";

import { StudyGroupsToolbar } from "./ui/toolbar";
import { StudyGroupsDataBody } from "./ui/dataBody";

export const StudyGroups = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_ROWS_PER_PAGE_OPTIONS[0]);
  const [search, setSearch] = useState("");
  const [includeArchived, setIncludeArchived] = useState(false);

  const debouncedSearch = useDebouncedValue(search, 400);

  const query = useStudyGroupListQuery({
    page,
    pageSize,
    search: debouncedSearch,
    includeArchived,
  });

  const data = query.data;

  const handleIncludeArchivedChange = () => {
    setIncludeArchived((value) => !value);
    setPage(1);
  };

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
      toolbar={
        <StudyGroupsToolbar
          includeArchived={includeArchived}
          onIncludeArchivedChange={handleIncludeArchivedChange}
          search={search}
          onSearchChange={onSearchChange}
        />
      }
      body={<StudyGroupsDataBody data={data} loading={query.isFetching} />}
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
