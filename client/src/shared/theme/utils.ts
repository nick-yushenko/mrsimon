"use client";

type PaletteKey = string | number;

type PaletteChannel<T extends Record<PaletteKey, string>> = T & {
  [K in Extract<keyof T, PaletteKey> as `${K}Channel`]: string;
};

export function hexToRgbChannel(hex: string) {
  const clean = hex.replace("#", "");

  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);

  return `${r} ${g} ${b}`;
}

export function varAlpha(channel: string, opacity: number) {
  return `rgba(${channel} / ${opacity})`;
}

export function createPaletteChannel<T extends Record<PaletteKey, string>>(
  colors: T,
): PaletteChannel<T> {
  const result: Record<string, string> = {};

  Object.entries(colors).forEach(([key, value]) => {
    result[key] = value;
    result[`${key}Channel`] = hexToRgbChannel(value);
  });

  return {
    ...colors,
    ...result,
  } as PaletteChannel<T>;
}
