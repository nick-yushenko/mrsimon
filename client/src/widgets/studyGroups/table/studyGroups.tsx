import { Suspense } from "react";

import { studyGroupsApi } from "@/features/studyGroups/api/studyGroupsApi";

import { DEFAULT_ROWS_PER_PAGE_OPTIONS } from "@/shared/ui/appTable/constants";

import { StudyGroupsDataBody } from "./ui/dataBody";
import { StudyGroupsTableShell } from "./tableShell";
import { StudyGroupsPagination } from "./ui/pagination";
import { StudyGroupsDataBodyServer } from "./server/dataBodyServer";
import { StudyGroupsPaginationServer } from "./server/paginationServer";
import { getStudyGroupsParams, type StudyGroupsSearchParamsPromise } from "./types";

type StudyGroupsProps = {
  searchParams?: StudyGroupsSearchParamsPromise;
};

const getStudyGroupsData = async (searchParams: StudyGroupsSearchParamsPromise) => {
  const params = getStudyGroupsParams(await searchParams);
  return studyGroupsApi.getStudyGroups(params);
};

export const StudyGroups = ({ searchParams }: StudyGroupsProps) => {
  const dataPromise = getStudyGroupsData(searchParams);
  return (
    <StudyGroupsTableShell
      body={
        <Suspense fallback={<StudyGroupsDataBody loading />}>
          <StudyGroupsDataBodyServer dataPromise={dataPromise} />
        </Suspense>
      }
      pagination={
        <Suspense
          fallback={
            <StudyGroupsPagination
              page={0}
              pageSize={DEFAULT_ROWS_PER_PAGE_OPTIONS[0]}
              count={0}
              rowsPerPageOptions={DEFAULT_ROWS_PER_PAGE_OPTIONS}
            />
          }
        >
          <StudyGroupsPaginationServer dataPromise={dataPromise} />
        </Suspense>
      }
    />
  );
};
