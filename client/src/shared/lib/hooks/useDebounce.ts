"use client";

import { useState, useEffect } from "react";

// TODO (обдумать) заменить на использование debaunce из библиотеки es-tookit, если это будет необходимо (ради других утилит)
/**
 * @deprecated Эта функция может устареть и быть замененина на debaunce из библиотеки es-tookit в будущем
 */
export function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timerId);
  }, [value, delay]);

  return debouncedValue;
}
