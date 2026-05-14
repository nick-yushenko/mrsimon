import type { GetUsersParams } from "./types";

import { useQuery } from "@tanstack/react-query";

import { usersApi } from "../api/usersApi";
import { usersQueryKeys } from "./queryKeys";

export const useUserListQuery = (params: GetUsersParams = {}) => {
  return useQuery({
    queryKey: usersQueryKeys.list(params),
    queryFn: () => usersApi.getUsers(params),
  });
};

export const useUserQuery = (id: string) => {
  return useQuery({
    queryKey: usersQueryKeys.detail(id),
    queryFn: () => usersApi.getUserById(id),
    enabled: !!id,
  });
};
