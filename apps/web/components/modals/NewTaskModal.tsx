import {
  Box,
  Button,
  LoadingOverlay,
  MediaQuery,
  NumberInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { DatePicker, DatePickerProps } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { APINewTaskRequest } from "types";
import ClassIdPicker from "../input/ClassIdPicker";
import HeatmapDatePicker from "../input/HeatmapDatePicker";

export default function NewTaskModal() {
  const [loading, setLoading] = useState(false);
  const [maxDate, setMaxDate] = useState<Date | null>(null);

  const modals = useModals();
  const queryClient = useQueryClient();
  const form = useForm<APINewTaskRequest>({
    initialValues: {
      classId: null,
      dueDate: null,
      workDate: null,
      title: "",
      description: null,
      workTime: 20,
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

    if (form.values.dueDate) {
      setMaxDate(new Date(form.values.dueDate.getTime() - 24 * 60 * 60 * 1000));
    }
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
    firstDayOfWeek: "sunday",
    dropdownType: "modal",
    clearable: false,
  };

  return (
    <form onSubmit={form.onSubmit(submit)}>
      <Stack spacing={"sm"} style={{ position: "relative" }}>
        <LoadingOverlay radius="md" visible={loading} />
        <TextInput
          data-autofocus
          {...form.getInputProps("title")}
          label="Title"
        />
        <MediaQuery smallerThan={"xs"} styles={{ flexDirection: "column" }}>
          <Box
            sx={(theme) => ({
              display: "flex",
              gap: theme.spacing.md,
            })}
            mt="lg"
          >
            <ClassIdPicker form={form} />
            <NumberInput
              style={{ flexGrow: "3" }}
              {...form.getInputProps("workTime")}
              label="Estimated Work Time (minutes)"
              step={5}
              stepHoldDelay={500}
              stepHoldInterval={200}
            />
          </Box>
        </MediaQuery>
        <MediaQuery smallerThan={"xs"} styles={{ flexDirection: "column" }}>
          <Box
            sx={(theme) => ({
              display: "flex",
              gap: theme.spacing.md,
            })}
            mt="lg"
          >
            <DatePicker
              style={{ flexGrow: "1" }}
              {...form.getInputProps("dueDate")}
              clearable={false}
              label="Due Date"
              {...datePickerProps}
            />
            <HeatmapDatePicker
              style={{ flexGrow: "1" }}
              {...form.getInputProps("workDate")}
              clearable={false}
              disabled={!form.values.dueDate}
              maxDate={maxDate}
              {...datePickerProps}
            />
          </Box>
        </MediaQuery>
        <Button mt="md" type="submit">
          Submit
        </Button>
      </Stack>
    </form>
  );
}
