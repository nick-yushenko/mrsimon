"use client";

import { SyntheticEvent, useMemo, useState } from "react";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

type CreateOption = {
  __creatableAutocompleteCreateOption: true;
  inputValue: string;
};

type AutocompleteOption<TOption> = TOption | CreateOption;

type BaseChipsAutocompleteProps<TOption> = {
  options: TOption[];
  onCreate: (inputValue: string) => Promise<TOption> | TOption;
  getOptionKey: (option: TOption) => string | number;
  getOptionLabel: (option: TOption) => string;
  label?: string;
  placeholder?: string;
  createLabel?: (inputValue: string) => string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
};

type MultipleChipsAutocompleteProps<TOption> = BaseChipsAutocompleteProps<TOption> & {
  multiple: true;
  value: TOption[];
  onChange: (value: TOption[]) => void;
};

type SingleChipsAutocompleteProps<TOption> = BaseChipsAutocompleteProps<TOption> & {
  multiple?: false;
  value: TOption | null;
  onChange: (value: TOption | null) => void;
};

export type chipsAutocompleteProps<TOption> =
  | MultipleChipsAutocompleteProps<TOption>
  | SingleChipsAutocompleteProps<TOption>;

function isCreateOption<TOption>(option: AutocompleteOption<TOption>): option is CreateOption {
  return (
    typeof option === "object" && option !== null && "__creatableAutocompleteCreateOption" in option
  );
}

function useCreatableFilter<TOption>(
  options: TOption[],
  getOptionLabel: (option: TOption) => string,
) {
  const filter = useMemo(
    () =>
      createFilterOptions<AutocompleteOption<TOption>>({
        stringify: (option) =>
          isCreateOption(option) ? option.inputValue : getOptionLabel(option),
        trim: true,
      }),
    [getOptionLabel],
  );

  return (filteredOptions: AutocompleteOption<TOption>[], inputValue: string) => {
    const filtered = filter(filteredOptions, { inputValue, getOptionLabel: () => "" });
    const trimmedInputValue = inputValue.trim();
    const exists = options.some(
      (option) => getOptionLabel(option).trim().toLowerCase() === trimmedInputValue.toLowerCase(),
    );

    if (trimmedInputValue && !exists) {
      filtered.push({
        __creatableAutocompleteCreateOption: true,
        inputValue: trimmedInputValue,
      });
    }

    return filtered;
  };
}

// TODO доработать. Сложная реализация
export function ChipsAutocomplete<TOption>(props: chipsAutocompleteProps<TOption>) {
  const {
    options,
    onCreate,
    getOptionKey,
    getOptionLabel,
    label,
    placeholder,
    createLabel = (inputValue) => `Создать "${inputValue}"`,
    disabled,
    error,
    helperText,
  } = props;

  const [isCreating, setIsCreating] = useState(false);
  const filterOptions = useCreatableFilter(options, getOptionLabel);

  const renderOption = (
    optionProps: React.HTMLAttributes<HTMLLIElement> & { key: React.Key },
    option: AutocompleteOption<TOption>,
  ) => {
    const { key, ...restOptionProps } = optionProps;

    return (
      <li {...restOptionProps} key={key}>
        {isCreateOption(option) ? createLabel(option.inputValue) : getOptionLabel(option)}
      </li>
    );
  };

  const isOptionEqualToValue = (
    option: AutocompleteOption<TOption>,
    selectedOption: AutocompleteOption<TOption>,
  ) => {
    if (isCreateOption(option) || isCreateOption(selectedOption)) {
      return false;
    }

    return getOptionKey(option) === getOptionKey(selectedOption);
  };

  if (props.multiple) {
    const selectedValue = props.value.map((selectedOption) => {
      return (
        options.find((option) => getOptionKey(option) === getOptionKey(selectedOption)) ??
        selectedOption
      );
    });

    const handleChange = async (_: SyntheticEvent, nextValue: AutocompleteOption<TOption>[]) => {
      const hasCreateOption = nextValue.some(isCreateOption);

      if (hasCreateOption) {
        setIsCreating(true);
      }

      try {
        const nextOptions: TOption[] = [];
        const usedKeys = new Set<string | number>();

        for (const option of nextValue) {
          const nextOption = isCreateOption(option) ? await onCreate(option.inputValue) : option;
          const nextOptionKey = getOptionKey(nextOption);

          if (!usedKeys.has(nextOptionKey)) {
            usedKeys.add(nextOptionKey);
            nextOptions.push(nextOption);
          }
        }

        props.onChange(nextOptions);
      } finally {
        if (hasCreateOption) {
          setIsCreating(false);
        }
      }
    };

    return (
      <Autocomplete
        multiple
        disabled={disabled || isCreating}
        loading={isCreating}
        options={options}
        value={selectedValue}
        filterSelectedOptions
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        getOptionLabel={(option) =>
          isCreateOption(option) ? option.inputValue : getOptionLabel(option)
        }
        isOptionEqualToValue={isOptionEqualToValue}
        filterOptions={(filteredOptions, params) =>
          filterOptions(filteredOptions, params.inputValue)
        }
        renderOption={renderOption}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            error={error}
            helperText={helperText}
          />
        )}
      />
    );
  }

  const selectedValue =
    props.value == null
      ? null
      : (options.find((option) => getOptionKey(option) === getOptionKey(props.value!)) ??
        props.value);

  const handleChange = async (_: SyntheticEvent, nextValue: AutocompleteOption<TOption> | null) => {
    if (!nextValue) {
      props.onChange(null);
      return;
    }

    if (!isCreateOption(nextValue)) {
      props.onChange(nextValue);
      return;
    }

    setIsCreating(true);

    try {
      props.onChange(await onCreate(nextValue.inputValue));
    } finally {
      setIsCreating(false);
    }
  };

  // TODO избавиться от такого объявления типизации
  return (
    <Autocomplete<AutocompleteOption<TOption>, false, false, false>
      disabled={disabled || isCreating}
      loading={isCreating}
      options={options}
      value={selectedValue}
      // selectOnFocus
      // clearOnBlur
      // handleHomeEndKeys
      getOptionLabel={(option) =>
        isCreateOption(option) ? option.inputValue : getOptionLabel(option)
      }
      isOptionEqualToValue={isOptionEqualToValue}
      filterOptions={(filteredOptions, params) => filterOptions(filteredOptions, params.inputValue)}
      renderOption={renderOption}
      onChange={handleChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
        />
      )}
    />
  );
}
