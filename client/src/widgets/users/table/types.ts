import type { GetUsersParams } from "@/features/users/types";

import { getStringParam, getPositiveNumberParam } from "@/shared/lib/utlis/param";

export const USERS_TABLE_ID = "users";

type UsersTableUrlParam = "page" | "pageSize" | "search";
type SearchParamValue = string | string[];

export type UsersTableParams = Required<Pick<GetUsersParams, UsersTableUrlParam>>;

export type UsersSearchParams = Partial<
  Record<UsersTableUrlParam | `${typeof USERS_TABLE_ID}_${UsersTableUrlParam}`, SearchParamValue>
>;

export type UsersSearchParamsPromise = Promise<UsersSearchParams | undefined> | undefined;

export const getUsersTableUrlParam = (param: UsersTableUrlParam) =>
  `${USERS_TABLE_ID}_${param}` as const;

const getUsersTableSearchParam = (searchParams: UsersSearchParams, param: UsersTableUrlParam) =>
  searchParams[getUsersTableUrlParam(param)] ?? searchParams[param];

export const getUsersParams = (searchParams: UsersSearchParams = {}): UsersTableParams => ({
  page: getPositiveNumberParam(getUsersTableSearchParam(searchParams, "page"), 1),
  pageSize: getPositiveNumberParam(getUsersTableSearchParam(searchParams, "pageSize"), 5, 100),
  search: getStringParam(getUsersTableSearchParam(searchParams, "search"))?.trim() ?? "",
});
