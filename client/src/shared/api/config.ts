export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000",
  useMockApi: process.env.NEXT_PUBLIC_USE_MOCK_API === "true",
};
