import type { Breakpoint } from "@mui/material/styles";

export type ContainerQueryInput = Breakpoint | number;

export type ContainerQueries = {
  values: Record<Breakpoint, number>;
  up: (key: ContainerQueryInput) => string;
  down: (key: ContainerQueryInput) => string;
  between: (start: ContainerQueryInput, end: ContainerQueryInput) => string;
  only: (key: Breakpoint) => string;
};

const DEFAULT_STEP = 5;

const resolveValue = (values: Record<Breakpoint, number>, key: ContainerQueryInput) =>
  typeof key === "number" ? key : values[key];

const createMaxWidth = (value: number, step = DEFAULT_STEP) => value - step / 100;

export const createContainerQueries = (
  values: Record<Breakpoint, number>,
  step = DEFAULT_STEP,
): ContainerQueries => {
  const sortedBreakpoints = (Object.keys(values) as Breakpoint[]).sort(
    (a, b) => values[a] - values[b],
  );

  return {
    values,
    up: (key) => `@container (min-width:${resolveValue(values, key)}px)`,
    down: (key) => `@container (max-width:${createMaxWidth(resolveValue(values, key), step)}px)`,
    between: (start, end) =>
      `@container (min-width:${resolveValue(values, start)}px) and (max-width:${createMaxWidth(
        resolveValue(values, end),
        step,
      )}px)`,
    only: (key) => {
      const index = sortedBreakpoints.indexOf(key);
      const next = sortedBreakpoints[index + 1];

      return next
        ? `@container (min-width:${values[key]}px) and (max-width:${createMaxWidth(values[next], step)}px)`
        : `@container (min-width:${values[key]}px)`;
    },
  };
};
