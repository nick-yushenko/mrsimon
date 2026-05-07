"use client";

import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { useDebouncedValue } from "@/shared/lib/hooks/useDebounce";

export type UseAppTableUrlStateOptions = {
  delay?: number;
  pageParam?: string;
  pageSizeParam?: string;
  searchParam?: string;
};

export const useAppTableUrlState = ({
  delay = 200,
  pageParam = "page",
  pageSizeParam = "pageSize",
  searchParam = "search",
}: UseAppTableUrlStateOptions = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchParamValue = searchParams.get(searchParam) ?? "";
  const [search, setSearch] = useState(searchParamValue);
  const debouncedSearch = useDebouncedValue(search, delay);
  const lastCommittedSearch = useRef(searchParamValue);
  const queryString = useMemo(() => searchParams.toString(), [searchParams]);

  const updateParams = useCallback(
    (update: (nextParams: URLSearchParams) => void) => {
      const nextParams = new URLSearchParams(searchParams.toString());
      update(nextParams);

      const query = nextParams.toString();

      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    if (searchParamValue !== lastCommittedSearch.current) {
      lastCommittedSearch.current = searchParamValue;
      setSearch(searchParamValue);
    }
  }, [searchParamValue]);

  useEffect(() => {
    if (debouncedSearch === lastCommittedSearch.current) {
      return;
    }

    const nextParams = new URLSearchParams(queryString);
    const nextSearch = debouncedSearch.trim();

    if (nextSearch) {
      nextParams.set(searchParam, nextSearch);
    } else {
      nextParams.delete(searchParam);
    }

    nextParams.delete(pageParam);

    const nextQueryString = nextParams.toString();
    lastCommittedSearch.current = debouncedSearch;

    router.replace(nextQueryString ? `${pathname}?${nextQueryString}` : pathname, {
      scroll: false,
    });
  }, [debouncedSearch, pageParam, pathname, queryString, router, searchParam]);

  const setPage = useCallback(
    (page: number) => {
      updateParams((nextParams) => {
        if (page > 1) {
          nextParams.set(pageParam, String(page));
        } else {
          nextParams.delete(pageParam);
        }
      });
    },
    [pageParam, updateParams],
  );

  const setPageSize = useCallback(
    (pageSize: number) => {
      updateParams((nextParams) => {
        nextParams.set(pageSizeParam, String(pageSize));
        nextParams.delete(pageParam);
      });
    },
    [pageParam, pageSizeParam, updateParams],
  );

  const clearSearch = useCallback(() => {
    setSearch("");
  }, []);

  return {
    search,
    setSearch,
    clearSearch,
    setPage,
    setPageSize,
    updateParams,
  };
};
