"use client";

import { useState, useEffect } from "react";

// TODO заменить на использование debaunce из библиотеки es-tookit
/**
 * @deprecated Эта функция устарела, в будущем будет заменена на debaunce из библиотеки es-tookit
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
