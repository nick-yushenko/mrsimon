import type { PagedResult } from "@/shared/api/types";
import type {
  UserDetails,
  UserListItem,
  UsersSummary,
  GetUsersParams,
} from "@/entities/user/model/types";

import { apiClient } from "@/shared/api/apiClient";

export const usersApi = {
  getUsers: async ({ page = 1, pageSize = 20, search = "", role }: GetUsersParams = {}): Promise<
    PagedResult<UserListItem>
  > => {
    const searchParams = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });

    if (search.trim()) {
      searchParams.set("search", search.trim());
    }

    if (role) {
      searchParams.set("role", role);
    }

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // await sleep(2000);
    return apiClient.get<PagedResult<UserListItem>>(`/api/users?${searchParams.toString()}`);
  },

  getUserById: async (id: string): Promise<UserDetails> => {
    return apiClient.get<UserDetails>(`/api/users/${id}`);
  },

  getSummary: async (): Promise<UsersSummary> => {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    await sleep(1000);
    // TODO изменить endpoint (на беке и затем на фронте)
    return apiClient.get<UsersSummary>(`/api/users/summary`, {
      cache: "no-store",
    });
  },
};
