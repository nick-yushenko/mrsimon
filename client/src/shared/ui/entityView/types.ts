import type { ReactNode } from "react";
import type { Path, FieldValues, UseFormReturn } from "react-hook-form";

export type EntityFieldKind =
  | "text"
  | "number"
  | "email"
  | "textarea"
  | "select"
  | "date"
  | "switch"
  | "checkbox";

export type EntityFieldOption<T = string | number> = {
  label: string;
  value: T;
  disabled?: boolean;
};

export type EntityFieldRenderParams<TValues extends FieldValues> = {
  field: EntityFieldConfig<TValues>;
  form: UseFormReturn<TValues>;
  value: unknown;
  disabled: boolean;
  isEditMode: boolean;
  error?: string;
};

export type EntityFieldConfig<TValues extends FieldValues> = {
  key: Path<TValues>;
  label: string;
  kind: EntityFieldKind;
  editable?: boolean;
  hidden?: boolean;
  placeholder?: string;
  autoComplete?: boolean;
  creatable?: boolean;
  multiple?: boolean;
  options?: EntityFieldOption[];
  onCreateOption?: (inputValue: string) => Promise<EntityFieldOption> | EntityFieldOption;
  createOptionLabel?: (inputValue: string) => string;
  render?: (params: EntityFieldRenderParams<TValues>) => ReactNode;
};

export type EntityViewLayoutItem<TValues extends FieldValues> = {
  field: EntityFieldConfig<TValues>;
  node: ReactNode;
};
