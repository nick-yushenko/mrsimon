"use client";

import "dayjs/locale/ru";

import type { ReactNode } from "react";
import type { $ZodType } from "zod/v4/core";
import type { EntityFieldConfig, EntityViewLayoutItem } from "./types";
import type { Resolver, FieldValues, DefaultValues } from "react-hook-form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useMemo, useState, useEffect, useCallback } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { ruRU } from "@mui/x-date-pickers/locales";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { EntityField } from "./entityField";
import { getFieldError } from "./getFieldError";

const createInputNameVersion = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export type EntityViewProps<TValues extends FieldValues> = {
  entity: TValues;
  fields: EntityFieldConfig<TValues>[];
  schema: $ZodType<TValues, TValues>;
  formId?: string;
  editable?: boolean;
  defaultEditMode?: boolean;
  actions?: "internal" | "none";
  onSubmit?: (values: TValues) => Promise<void> | void;
  renderFields?: (items: EntityViewLayoutItem<TValues>[]) => ReactNode;
};

export const EntityView = <TValues extends FieldValues>({
  entity,
  fields,
  schema,
  formId,
  editable = false,
  defaultEditMode = false,
  actions = "internal",
  onSubmit,
  renderFields,
}: EntityViewProps<TValues>) => {
  const entityViewId = useId();
  const [isEditMode, setIsEditMode] = useState(defaultEditMode);
  const [inputNameVersion, setInputNameVersion] = useState("initial");

  const form = useForm<TValues>({
    resolver: zodResolver<TValues, unknown, TValues>(schema) as Resolver<TValues>,
    defaultValues: entity as DefaultValues<TValues>,
  });

  const {
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = form;

  useEffect(() => {
    reset(entity as DefaultValues<TValues>);
  }, [entity, reset]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setInputNameVersion(createInputNameVersion());
    });

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const handleValidSubmit = useCallback(
    async (values: TValues) => {
      await onSubmit?.(values);
      reset(values as DefaultValues<TValues>);
      setInputNameVersion(createInputNameVersion());

      if (!defaultEditMode) {
        setIsEditMode(false);
      }
    },
    [defaultEditMode, onSubmit, reset],
  );

  const submitForm = useMemo(
    () => handleSubmit(handleValidSubmit),
    [handleSubmit, handleValidSubmit],
  );

  const startEdit = useCallback(() => {
    setIsEditMode(true);
  }, []);

  const cancelEdit = useCallback(() => {
    reset(entity as DefaultValues<TValues>);
    setIsEditMode(defaultEditMode);
  }, [defaultEditMode, entity, reset]);

  const shouldShowSaveButton = !defaultEditMode || isDirty;

  const inputNamePrefix = useMemo(
    () => `entity-${entityViewId.replaceAll(":", "")}-${inputNameVersion}`,
    [entityViewId, inputNameVersion],
  );

  const fieldItems = useMemo(
    () =>
      fields
        .filter((field) => !field.hidden)
        .map<EntityViewLayoutItem<TValues>>((field) => {
          const disabled = !isEditMode || field.editable === false || isSubmitting;
          const error = getFieldError(errors, field.key);
          const renderParams = {
            field,
            form,
            value: form.getValues(field.key),
            disabled,
            isEditMode,
            error,
          };

          return {
            field,
            node: field.render ? (
              field.render(renderParams)
            ) : (
              <EntityField
                field={field}
                form={form}
                disabled={disabled}
                inputNamePrefix={inputNamePrefix}
                error={error}
              />
            ),
          };
        }),
    [errors, fields, form, inputNamePrefix, isEditMode, isSubmitting],
  );

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="ru"
      localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
    >
      <Box id={formId} component="form" onSubmit={submitForm} noValidate>
        <Stack spacing={2}>
          {renderFields ? (
            renderFields(fieldItems)
          ) : (
            <Stack spacing={2}>
              {fieldItems.map((item) => (
                <Box key={item.field.key}>{item.node}</Box>
              ))}
            </Stack>
          )}

          {editable && actions === "internal" && (
            <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
              {isEditMode ? (
                <>
                  {!defaultEditMode && (
                    <Button
                      type="button"
                      variant="text"
                      onClick={cancelEdit}
                      disabled={isSubmitting}
                    >
                      Отмена
                    </Button>
                  )}
                  {shouldShowSaveButton && (
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      Сохранить
                    </Button>
                  )}
                </>
              ) : (
                <Button type="button" variant="contained" onClick={startEdit}>
                  Редактировать
                </Button>
              )}
            </Stack>
          )}
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};
