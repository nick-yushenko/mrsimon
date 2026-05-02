"use client";

import { useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "@/shared/lib/hooks/useDebounce";

export type UseDataGridSearchOptions = {
  value: string;
  onChange: (value: string) => void;
  delay?: number;
};

export const useDataGridSearch = ({ delay = 400, onChange, value }: UseDataGridSearchOptions) => {
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
