import {
  Box,
  Button,
  Checkbox,
  LoadingOverlay,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DatePicker, DatePickerProps } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { APINewTaskRequest } from "types";

export default function NewTaskModal() {
  const [loading, setLoading] = useState(false);
  const [useDescription, setUseDescription] = useState(false);
  const modals = useModals();
  const queryClient = useQueryClient();
  const form = useForm<APINewTaskRequest>({
    initialValues: {
      classId: null,
      dueDate: null,
      workDate: null,
      title: "",
      description: null,
    },
    validate: {
      workDate: (value, form) => {
        if (value && form.dueDate && value > form.dueDate) {
          return "Work date must be before due date";
        }
      },
      dueDate: (value, form) => {
        if (value && form.workDate && value < new Date(Date.now())) {
          return "Due date must be in the future";
        }
      },
    },
  });

  useEffect(() => {
    form.validateField("workDate");
    form.validateField("dueDate");
  }, [form.values]);

  const submit = async (values: APINewTaskRequest) => {
    console.log(JSON.stringify(values));
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    if (response.ok) {
      console.log("success");
    }
    const json = await response.json();
    if (json.error) {
      console.error(json.error);
      showNotification({
        message: json.error.message,
        color: "red",
      });
      setLoading(false);
    } else {
      showNotification({
        message: "Class created",
        color: "green",
      });
      queryClient.invalidateQueries(["tasks"]);
      console.log(json.task);
      modals.closeModal("new-class");
    }
  };

  const datePickerProps: DatePickerProps = {
    minDate: new Date(),
  };

  const maxDate = form.values.dueDate || undefined;

  return (
    <form onSubmit={form.onSubmit(submit)}>
      <Stack spacing={"md"} style={{ position: "relative" }}>
        <LoadingOverlay radius="md" visible={loading} />
        <TextInput
          data-autofocus
          {...form.getInputProps("title")}
          label="Title"
        />
        <Checkbox
          checked={useDescription}
          onChange={(event) => setUseDescription(event.currentTarget.checked)}
          size="xs"
          label="Add description"
        />
        {useDescription && (
          <Textarea
            {...form.getInputProps("description")}
            label="Description"
          />
        )}
        <Box
          sx={(theme) => ({
            display: "flex",
            gap: theme.spacing.md,
          })}
        >
          <DatePicker
            style={{ flexGrow: "1" }}
            {...form.getInputProps("dueDate")}
            clearable={false}
            label="Due Date"
            {...datePickerProps}
          />
          <DatePicker
            style={{ flexGrow: "1" }}
            {...form.getInputProps("workDate")}
            clearable={false}
            label="Work Date"
            disabled={!form.values.dueDate}
            maxDate={maxDate}
            {...datePickerProps}
          />
        </Box>
        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  );
}
