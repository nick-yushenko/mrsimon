import type { GetUsersParams } from "@/features/users/types";

import { getStringParam, getPositiveNumberParam } from "@/shared/lib/utlis/param";

export type UsersSearchParams = {
  page?: string | string[];
  pageSize?: string | string[];
  search?: string | string[];
};

export type UsersSearchParamsPromise = Promise<UsersSearchParams | undefined> | undefined;

export const getUsersParams = (searchParams: UsersSearchParams = {}): GetUsersParams => ({
  page: getPositiveNumberParam(searchParams.page, 1),
  pageSize: getPositiveNumberParam(searchParams.pageSize, 5, 100),
  search: getStringParam(searchParams.search)?.trim() ?? "",
});
