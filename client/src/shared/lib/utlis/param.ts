export const getStringParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export const getPositiveNumberParam = (
  value: string | string[] | undefined,
  fallback: number,
  max?: number,
) => {
  const parsed = Number(getStringParam(value));
  const normalized = Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;

  return max ? Math.min(normalized, max) : normalized;
};

export const getBooleanParam = (value: string | string[] | undefined) => {
  const normalized = getStringParam(value);

  return normalized === "true" || normalized === "1";
};
