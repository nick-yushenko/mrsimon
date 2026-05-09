import type { GetUsersParams } from "./types";

export const usersQueryKeys = {
  all: ["users"],
  lists: () => [...usersQueryKeys.all, "list"] as const,
  list: (params: Required<GetUsersParams>) => [...usersQueryKeys.lists(), params] as const,
  details: () => [...usersQueryKeys.all, "detail"] as const,
  detail: (id: string | number) => [...usersQueryKeys.details(), String(id)] as const,
};
