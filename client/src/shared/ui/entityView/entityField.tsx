"use client";

import type { FieldValues, UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";

import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import type { EntityFieldConfig } from "./types";

type EntityFieldProps<TValues extends FieldValues> = {
  field: EntityFieldConfig<TValues>;
  form: UseFormReturn<TValues>;
  disabled: boolean;
  inputNamePrefix: string;
  error?: string;
};

export const EntityField = <TValues extends FieldValues>({
  field,
  form,
  disabled,
  inputNamePrefix,
  error,
}: EntityFieldProps<TValues>) => {
  const { control } = form;
  const isAutoCompleteEnabled = field.autoComplete !== false;
  const textFieldType = field.kind === "email" || field.kind === "number" ? field.kind : "text";

  if (field.kind === "select") {
    return (
      <Controller
        name={field.key}
        control={control}
        render={({ field: controllerField }) => (
          <FormControl fullWidth error={Boolean(error)} disabled={disabled}>
            <InputLabel>{field.label}</InputLabel>
            <Select {...controllerField} label={field.label} value={controllerField.value ?? ""}>
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        )}
      />
    );
  }

  if (field.kind === "date") {
    return (
      <Controller
        name={field.key}
        control={control}
        render={({ field: controllerField }) => {
          const value =
            typeof controllerField.value === "string" && controllerField.value
              ? dayjs(controllerField.value)
              : null;

          return (
            <DatePicker
              label={field.label}
              value={value}
              disabled={disabled}
              onChange={(dateValue) => {
                controllerField.onChange(dateValue?.format("YYYY-MM-DD") ?? "");
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: Boolean(error),
                  helperText: error,
                },
              }}
            />
          );
        }}
      />
    );
  }

  if (field.kind === "switch" || field.kind === "checkbox") {
    const Control = field.kind === "switch" ? Switch : Checkbox;

    return (
      <Controller
        name={field.key}
        control={control}
        render={({ field: controllerField }) => (
          <FormControl error={Boolean(error)} disabled={disabled}>
            <FormControlLabel
              label={field.label}
              control={
                <Control
                  checked={Boolean(controllerField.value)}
                  onBlur={controllerField.onBlur}
                  onChange={(_, checked) => controllerField.onChange(checked)}
                />
              }
            />
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        )}
      />
    );
  }

  return (
    <Controller
      name={field.key}
      control={control}
      render={({ field: controllerField }) => (
        <TextField
          fullWidth
          label={field.label}
          placeholder={field.placeholder}
          type={textFieldType}
          multiline={field.kind === "textarea"}
          minRows={field.kind === "textarea" ? 4 : undefined}
          variant="outlined"
          disabled={disabled}
          error={Boolean(error)}
          helperText={error}
          value={controllerField.value ?? ""}
          onChange={(event) => {
            if (field.kind === "number") {
              controllerField.onChange(
                event.target.value === "" ? undefined : Number(event.target.value),
              );
              return;
            }

            controllerField.onChange(event);
          }}
          onBlur={controllerField.onBlur}
          inputRef={controllerField.ref}
          slotProps={{
            htmlInput: {
              name: isAutoCompleteEnabled ? field.key : `${inputNamePrefix}-${field.key}`,
              autoComplete: isAutoCompleteEnabled ? "on" : "new-password",
            },
          }}
        />
      )}
    />
  );
};
