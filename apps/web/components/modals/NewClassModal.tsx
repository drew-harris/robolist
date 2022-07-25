import { Button, LoadingOverlay, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { APIClassCreate } from "types";
import { colorChoices } from "types";
import ThemeColorSelector from "../input/ThemeColorSelector";

export default function NewClassModal() {
  const [loading, setLoading] = useState(false);
  const modals = useModals();
  const queryClient = useQueryClient();

  const form = useForm<APIClassCreate>({
    initialValues: {
      color: colorChoices[5],
      name: "",
    },

    validate: {
      name: (name) => (name.length <= 0 ? "Name is required" : null),
    },
  });

  const handleColorChange = (color: string) => {
    form.setFieldValue("color", color);
  };

  async function handleSubmit(values: APIClassCreate) {
    console.log(values);
    setLoading(true);
    const data = await fetch("/api/classes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const json = await data.json();
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
      queryClient.invalidateQueries(["classes"]);
      modals.closeModal("new-class");
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack p="sm" style={{ position: "relative" }}>
        <LoadingOverlay radius="md" visible={loading}></LoadingOverlay>
        <TextInput
          id="class-name-input"
          {...form.getInputProps("name")}
          label="Class Name"
        />
        <ThemeColorSelector
          value={form.values.color}
          onChange={handleColorChange}
        />
        <Button type="submit" color={form.values.color} size="md">
          Submit
        </Button>
      </Stack>
    </form>
  );
}
