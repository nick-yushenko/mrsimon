"use client";

import { Subject } from "@/entities/subject/model/types";
import { createEmptySubject } from "@/features/subjects/model/subjectForm";
import { useSubjectsStore } from "@/features/subjects/model/subjectsStore";
import { CreateSubjectRequest } from "@/features/subjects/types";
import { ChipsAutocomplete } from "@/shared/ui/autocomplete/chipsAutocomplete";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { toast } from "react-toastify/unstyled";

export default function SubjectsPage() {
  const [form, setForm] = useState<CreateSubjectRequest>(createEmptySubject);
  const [selectedDisciplines, setSelectedDisciplines] = useState<Subject[]>([]);

  const subjects = useSubjectsStore((state) => state.items);
  const isLoading = useSubjectsStore((state) => state.isLoading);
  const isSaving = useSubjectsStore((state) => state.isSaving);
  const isDeleting = useSubjectsStore((state) => state.isDeleting);
  const error = useSubjectsStore((state) => state.error);
  const fetchSubjects = useSubjectsStore((state) => state.fetchSubjects);
  const createSubject = useSubjectsStore((state) => state.createSubject);
  const deleteSubject = useSubjectsStore((state) => state.deleteSubject);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      return;
    }

    await create(form);

    setForm(createEmptySubject());
  };

  const create = async (values: CreateSubjectRequest) => {
    return await toast.promise(createSubject(values), {
      pending: "Создание дисциплины",
      success: "Дисциплина создана",
      error: "Не удалось создать дисциплину",
    });
  };

  const handleDelete = async (id: number, subjectName: string) => {
    const shouldDelete = window.confirm(`Удалить дисциплину "${subjectName}"?`);

    if (!shouldDelete) {
      return;
    }

    await toast.promise(deleteSubject(id), {
      pending: "Удаление дисциплины",
      success: "Дисциплина удалена",
      error: "Не удалось удалить дисциплину",
    });
  };

  return (
    <Stack spacing={2}>
      <ChipsAutocomplete
        multiple
        options={subjects}
        value={selectedDisciplines}
        onChange={setSelectedDisciplines}
        onCreate={(subjectName) => create({ name: subjectName })}
        getOptionKey={(subject) => subject.id}
        getOptionLabel={(subject) => subject.name}
        label="Дисциплины"
        placeholder="Выберите или создайте дисциплину"
      />

      <Card variant="plain" sx={{ p: 3 }}>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <Typography component="h1" variant="h4">
            Дисциплины
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Название"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            required
            fullWidth
          />

          <TextField
            label="Описание"
            value={form.description ?? ""}
            onChange={(event) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
            fullWidth
            multiline
            minRows={3}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<AddRoundedIcon />}
              loading={isSaving}
              disabled={!form.name.trim()}
            >
              Создать
            </Button>
          </Box>
        </Stack>
      </Card>

      <Card variant="plain" sx={{ p: 0 }}>
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {!isLoading && subjects.length === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography color="text.secondary">Дисциплины пока не добавлены.</Typography>
          </Box>
        )}

        {!isLoading &&
          subjects.map((subject, index) => (
            <Box key={subject.id}>
              {index > 0 && <Divider />}

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{
                  p: 2.5,
                  alignItems: { xs: "stretch", sm: "center" },
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle1">{subject.name}</Typography>
                  {subject.description && (
                    <Typography variant="body2" color="text.secondary">
                      {subject.description}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    Групп: {subject.groupsCount} · ID: {subject.id}
                  </Typography>
                </Box>

                <Tooltip
                  title={
                    subject.groupsCount > 0
                      ? "Нельзя удалить дисциплину с привязанными группами"
                      : "Удалить"
                  }
                >
                  <span>
                    <IconButton
                      aria-label="Удалить дисциплину"
                      color="error"
                      disabled={subject.groupsCount > 0 || isDeleting}
                      onClick={() => handleDelete(subject.id, subject.name)}
                    >
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            </Box>
          ))}
      </Card>
    </Stack>
  );
}
