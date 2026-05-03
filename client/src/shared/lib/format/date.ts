export type InputDateValue = Date | string | number | null | undefined;

type Options = Intl.DateTimeFormatOptions;

const DEFAULT_LOCALE = { code: "ru-RU" };

function processInput(inputValue: InputDateValue): Date | null {
  if (inputValue == null) return null;

  const date = inputValue instanceof Date ? inputValue : new Date(inputValue);

  if (Number.isNaN(date.getTime())) return null;

  return date;
}

// ----------------------------------------------------------------------

// formatDate(new Date(2026, 4, 3)) -> "03.05.2026"
export function formatDate(inputValue: InputDateValue, options?: Options) {
  const locale = DEFAULT_LOCALE;

  const date = processInput(inputValue);
  if (date === null) return "";

  return new Intl.DateTimeFormat(locale.code, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...options,
  }).format(date);
}

// ----------------------------------------------------------------------

// formatMonth(new Date(2026, 4, 1)) -> "май"
export function formatMonth(inputValue: InputDateValue, options?: Options) {
  const locale = DEFAULT_LOCALE;

  const date = processInput(inputValue);
  if (date === null) return "";

  return new Intl.DateTimeFormat(locale.code, {
    month: "long",
    ...options,
  }).format(date);
}

// ----------------------------------------------------------------------

// formatMonthFromParts(2026, 5) -> "май"
export function formatMonthFromParts(year: number, month: number, options?: Options) {
  const res = formatMonth(new Date(year, month - 1, 1), options);
  console.log(res);
  return res;
}
