"use client";

import { useContext, createContext } from "react";

export const APP_TABLE_DEFAULT_BODY_HEIGHT = 400;

export type AppTableContextValue = {
  bodyHeight: number | string;
  isBodyHeightLimited: boolean;
  toggleBodyHeightLimited: () => void;
};

const AppTableContext = createContext<AppTableContextValue | null>(null);

export const AppTableContextProvider = AppTableContext.Provider;

export const useAppTableContext = () => useContext(AppTableContext);
