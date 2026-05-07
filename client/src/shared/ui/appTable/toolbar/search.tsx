"use client";

import type { TextFieldProps } from "@mui/material/TextField";

import { useState } from "react";

import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

type TSearchProps = Omit<TextFieldProps, "onChange" | "value"> & {
  onChange: (value: string) => void;
  value?: string;
  placeholder?: string;
  expandable?: boolean;
};

// TODO сделать поиск по конкретным колонкам: На колонке нажали иконку поиска, в поле поиска появилось что-то вроде :column(ColumnName) ... (ввод тела запроса для поиска)
export const ToolbarSearch = ({
  onChange,
  value = "",
  placeholder = "Поиск...",
  expandable = true,
  ...props
}: TSearchProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  // isExpanded === false gри ширине родительского конейнера меньше sm (через Containers Query)
  const isExpanded = !expandable ? true : expanded || Boolean(value);

  return (
    <TextField
      {...props}
      fullWidth
      placeholder={placeholder}
      size={"small"}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onFocus={() => setExpanded(true)}
      onClick={() => setExpanded(true)}
      onBlur={() => {
        if (!value) {
          setExpanded(false);
        }
      }}
      sx={(theme) => ({
        width: isExpanded ? "100%" : 50,
        transition: "width 200ms ease, min-width 200ms ease",
        flexShrink: 1,
        "& .MuiOutlinedInput-root": {
          cursor: isExpanded ? "text" : "pointer",
        },

        [theme.containerQueries.down("sm")]: {
          width: "100%",
        },
      })}
      slotProps={{
        input: {
          sx: (theme) => ({
            height: 50,
            padding: isExpanded ? "0 12px 0 0" : 0,
            [theme.containerQueries.down("sm")]: {
              padding: "0 12px 0 0",
            },
            "& input": {
              height: "100%",
              padding: 0,
              opacity: isExpanded ? 1 : 0,
              width: isExpanded ? "100%" : 0,
              transition: "opacity 120ms ease",
              cursor: isExpanded ? "text" : "pointer",

              [theme.containerQueries.down("sm")]: {
                width: "100%",
                opacity: 1,
              },
            },
          }),
          startAdornment: (
            <InputAdornment
              position="start"
              sx={(theme) => ({
                marginRight: 0,
                minWidth: !isExpanded ? "50px" : "40px",
                display: "flex",
                justifyContent: "center",
                pointerEvents: "none",

                [theme.containerQueries.down("sm")]: {
                  minWidth: "40px",
                },
              })}
            >
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        },
      }}
    />
  );
};
