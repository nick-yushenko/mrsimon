import { ApiError, ApiErrorData } from "./apiError";
import { apiConfig } from "./config";

import { getStoredAccessToken } from "./getStoredAccessToken";

export type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  accessToken?: string;
  withAuth?: boolean;
  mock?: boolean;
};

export async function apiFetch<TResponse>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<TResponse> {
  const shouldUseMock = options?.mock ?? apiConfig.useMockApi;
  const shouldUseAuth = options.withAuth ?? true;

  const accessToken = options.accessToken ?? (shouldUseAuth ? getStoredAccessToken() : null);

  const baseUrl = shouldUseMock ? "" : apiConfig.baseUrl;

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");

  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorData = data as ApiErrorData | null;

    throw new ApiError<ApiErrorData | null>(
      response.status,
      errorData?.message ?? "Request failed",
      errorData,
    );
  }

  return data as TResponse;
}
