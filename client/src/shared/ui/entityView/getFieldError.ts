import type { FieldErrors, FieldValues } from "react-hook-form";

export const getFieldError = <TValues extends FieldValues>(
  errors: FieldErrors<TValues>,
  path: string,
): string | undefined => {
  const fieldError = path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[key];
  }, errors);

  if (!fieldError || typeof fieldError !== "object" || !("message" in fieldError)) {
    return undefined;
  }

  const message = (fieldError as { message?: unknown }).message;

  return typeof message === "string" ? message : undefined;
};
