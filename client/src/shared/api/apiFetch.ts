import type { ApiErrorData } from "./apiError";
import type { PageMeta, ApiResponse } from "./types";

import { apiConfig } from "./config";
import { ApiError } from "./apiError";
import { getStoredAccessToken } from "./getStoredAccessToken";

export type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  accessToken?: string;
  withAuth?: boolean;
  mock?: boolean;
};

// important TODO уйти от multy-account auth и от использования getStoredAccessToken, так как это ломает логику для SSR
// временно endpoint пропустит без accessToken

// TODO переделать авторизацию архитектурно, чтобы ключ был не почта, а ник, так как у многих студентов детей нет своей личной почты и родители регистриуют их на свою, а если обучается несколько детей из семьи, происходит конфликт почт, так как нужно зарегистрировать на 1 почту несколько студентов (обсудить, обдумать)
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
    const errorData = normalizeApiErrorData(data);

    throw new ApiError<ApiErrorData | null>(
      response.status,
      errorData?.detail ?? errorData?.title ?? errorData?.message ?? "Request failed",
      errorData,
    );
  }

  return unwrapApiResponse<TResponse>(data);
}

type ApiEnvelope = ApiResponse<unknown>;

const unwrapApiResponse = <TResponse>(data: unknown): TResponse => {
  if (!isApiEnvelope(data)) {
    return data as TResponse;
  }

  if (isPageMeta(data.meta) && Array.isArray(data.data)) {
    return {
      items: data.data,
      ...data.meta,
    } as TResponse;
  }

  return data.data as TResponse;
};

const normalizeApiErrorData = (data: unknown): ApiErrorData | null => {
  if (!isObject(data)) {
    return null;
  }

  return {
    type: getStringValue(data.type),
    title: getStringValue(data.title),
    status: getNumberValue(data.status),
    detail: getStringValue(data.detail),
    code: getStringValue(data.code),
    message: getStringValue(data.message),
    errors: isValidationErrors(data.errors) ? data.errors : undefined,
    traceId: getStringValue(data.traceId),
  };
};

const isApiEnvelope = (value: unknown): value is ApiEnvelope => {
  return isObject(value) && "data" in value && "meta" in value;
};

const isPageMeta = (value: unknown): value is PageMeta => {
  return (
    isObject(value) &&
    typeof value.page === "number" &&
    typeof value.pageSize === "number" &&
    typeof value.totalCount === "number" &&
    typeof value.totalPages === "number"
  );
};

const isValidationErrors = (value: unknown): value is Record<string, string[]> => {
  return (
    isObject(value) &&
    Object.values(value).every(
      (messages) =>
        Array.isArray(messages) && messages.every((message) => typeof message === "string"),
    )
  );
};

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const getStringValue = (value: unknown): string | undefined => {
  return typeof value === "string" ? value : undefined;
};

const getNumberValue = (value: unknown): number | undefined => {
  return typeof value === "number" ? value : undefined;
};
