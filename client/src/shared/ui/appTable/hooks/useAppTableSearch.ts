"use client";

import { useRef, useState, useEffect } from "react";

import { useDebouncedValue } from "@/shared/lib/hooks/useDebounce";

/**
 * @deprecated Этот тип устарел, как и useAppTableSearch. Для таблиц используйте серверный поиск через useAppTableUrlState.
 */
export type UseAppTableSearchOptions = {
  value: string;
  onChange: (value: string) => void;
  delay?: number;
};

/**
 * @deprecated Эта функция устарела. Для таблиц используйте серверный поиск через useAppTableUrlState.
 */
export const useAppTableSearch = ({ delay = 400, onChange, value }: UseAppTableSearchOptions) => {
  const [search, setSearch] = useState(value);
  const debouncedSearch = useDebouncedValue(search, delay);
  const lastCommittedSearch = useRef(value);

  useEffect(() => {
    if (value !== lastCommittedSearch.current) {
      lastCommittedSearch.current = value;
      setSearch(value);
    }
  }, [value]);

  useEffect(() => {
    if (debouncedSearch === lastCommittedSearch.current) {
      return;
    }

    lastCommittedSearch.current = debouncedSearch;
    onChange(debouncedSearch);
  }, [debouncedSearch, onChange]);

  return {
    search,
    setSearch,
  };
};
