import type { GetStudyGroupsParams } from "@/features/studyGroups/types";

import { getStringParam, getBooleanParam, getPositiveNumberParam } from "@/shared/lib/utlis/param";

// TODO позже посмотреть на использование таблиц, возможно вынести в ui/appTable частичо
export type StudyGroupsSearchParams = {
  includeArchived?: string | string[];
  page?: string | string[];
  pageSize?: string | string[];
  search?: string | string[];
};

export type StudyGroupsSearchParamsPromise =
  | Promise<StudyGroupsSearchParams | undefined>
  | undefined;

// TODO позже посмотреть на использование таблиц, возможно вынести в ui/appTable частичо
export const getStudyGroupsParams = (
  searchParams: StudyGroupsSearchParams = {},
): GetStudyGroupsParams => ({
  page: getPositiveNumberParam(searchParams.page, 1),
  pageSize: getPositiveNumberParam(searchParams.pageSize, 5, 100),
  search: getStringParam(searchParams.search)?.trim() ?? "",
  includeArchived: getBooleanParam(searchParams.includeArchived),
});
