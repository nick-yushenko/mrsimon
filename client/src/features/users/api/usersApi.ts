import type { UserDetails, UserListItem } from "@/entities/user/model/types";
import type { PagedResult } from "@/shared/api/types";
import { apiClient } from "@/shared/api/apiClient";
import { GetUsersParams, UsersSummary } from "../types";

export const usersApi = {
  getUsers: async ({ page = 1, pageSize = 20, search = "" }: GetUsersParams = {}): Promise<
    PagedResult<UserListItem>
  > => {
    const searchParams = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });

    if (search.trim()) {
      searchParams.set("search", search.trim());
    }

    return apiClient.get<PagedResult<UserListItem>>(`/api/users?${searchParams.toString()}`);
  },

  getUserById: async (id: string): Promise<UserDetails> => {
    return apiClient.get<UserDetails>(`/api/users/${id}`);
  },

  getSummary: async (): Promise<UsersSummary> => {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    await sleep(1000);
    return apiClient.get<UsersSummary>(`/api/users/summary`);
  },
};
