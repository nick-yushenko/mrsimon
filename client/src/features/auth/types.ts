import type { User } from "@/entities/user/model/types";

export type SessionId = string | number;
export type AccessToken = string;

export type AuthSession = {
  sessionId: SessionId;
  accessToken: AccessToken;
};

export type AuthResponse = {
  user: User;
  accessToken: AccessToken;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  lastName: string;
  email: string;
  password: string;
};
