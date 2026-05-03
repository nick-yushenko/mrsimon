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
import { ChipsAutocomplete } from "@/shared/ui/autocomplete/chipsAutocomplete";

import type { EntityFieldConfig, EntityFieldOption } from "./types";

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
    if (field.creatable) {
      const options = field.options?.filter((option) => !option.disabled) ?? [];
      const createOption =
        field.onCreateOption ??
        ((inputValue: string): EntityFieldOption => ({
          label: inputValue,
          value: inputValue,
        }));

      // TODO Переписать, так как сейчас дубли кода
      return (
        <Controller
          name={field.key}
          control={control}
          render={({ field: controllerField }) => {
            if (field.multiple) {
              const selectedValues = Array.isArray(controllerField.value)
                ? controllerField.value
                : [];
              const selectedOptions = selectedValues
                .map((value) => options.find((option) => option.value === value))
                .filter((option): option is EntityFieldOption => Boolean(option));

              return (
                <ChipsAutocomplete
                  multiple
                  options={options}
                  value={selectedOptions}
                  disabled={disabled}
                  label={field.label}
                  placeholder={field.placeholder}
                  error={Boolean(error)}
                  helperText={error}
                  createLabel={field.createOptionLabel}
                  onCreate={createOption}
                  onChange={(nextOptions) =>
                    controllerField.onChange(nextOptions.map((option) => option.value))
                  }
                  getOptionKey={(option) => option.value}
                  getOptionLabel={(option) => option.label}
                />
              );
            }

            const selectedOption =
              options.find((option) => option.value === controllerField.value) ?? null;

            return (
              <ChipsAutocomplete
                options={options}
                value={selectedOption}
                disabled={disabled}
                label={field.label}
                placeholder={field.placeholder}
                error={Boolean(error)}
                helperText={error}
                createLabel={field.createOptionLabel}
                onCreate={createOption}
                onChange={(option) =>
                  controllerField.onChange(
                    option?.value ?? (typeof controllerField.value === "number" ? 0 : ""),
                  )
                }
                getOptionKey={(option) => option.value}
                getOptionLabel={(option) => option.label}
              />
            );
          }}
        />
      );
    }

    return (
      <Controller
        name={field.key}
        control={control}
        render={({ field: controllerField }) => (
          <FormControl fullWidth error={Boolean(error)} disabled={disabled}>
            <InputLabel>{field.label}</InputLabel>
            <Select {...controllerField} label={field.label} value={controllerField.value ?? ""}>
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
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
              format="DD.MM.YYYY"
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
