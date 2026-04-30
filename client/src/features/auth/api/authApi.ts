import type { User } from "@/entities/user/model/types";
import { AuthResponse, LoginRequest, RegisterRequest } from "../types";
import { apiClient } from "@/shared/api/apiClient";

export const authApi = {
  register(data: RegisterRequest) {
    return apiClient.post<AuthResponse>("/api/auth/register", data, {
      withAuth: false,
    });
  },

  login(data: LoginRequest) {
    return apiClient.post<AuthResponse>("/api/auth/login", data, {
      withAuth: false,
    });
  },

  me(accessToken?: string) {
    return apiClient.get<User>("/api/auth/me", { accessToken: accessToken });
  },
};
