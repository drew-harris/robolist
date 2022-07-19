import {
  Button,
  LoadingOverlay,
  Stack,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { APIClassCreate } from "types";
import { colorChoices } from "types";
import ThemeColorSelector from "../input/ThemeColorSelector";

export default function NewClassModal() {
  const [loading, setLoading] = useState(false);
  const modals = useModals();
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
      modals.closeModal("new-class");
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack spacing="lg" style={{ position: "relative" }} p="md">
        <LoadingOverlay radius="md" visible={loading}></LoadingOverlay>
        <TextInput {...form.getInputProps("name")} label="Class Name" />
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
